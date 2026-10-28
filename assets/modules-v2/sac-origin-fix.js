/* NÚCLEO | correção de origem no Controle de SAC
   Evita colisão entre RO-IN-xxxxx e RO-EX-xxxxx com o mesmo número.
   O patch só atua quando existe uma R.O. Externa real correspondente.
*/
(function nucleoSacOriginFix(){
  if(window.__nucleoSacOriginFixLoaded)return;
  window.__nucleoSacOriginFixLoaded=true;

  function key(v){
    return String(v||'').trim().toUpperCase().replace(/\s+/g,'');
  }
  function digits(v){
    return String(v||'').replace(/\D/g,'').replace(/^0+/,'');
  }
  function isExternalRecord(r){
    const n=key(r?.numero||r?.id||r?.codigo||'');
    return r?.ehSac===true ||
      String(r?.origemBase||'').trim().toLowerCase()==='externa' ||
      /^RO-EX-/.test(n);
  }

  function install(){
    const original=window.saveExternalRoControl;
    if(typeof original!=='function')return false;
    if(original.__originFixWrapped)return true;

    const wrapped=function(){
      const ro=String(document.getElementById('externalRoNumber')?.value||'').trim();
      const roKey=key(ro);

      // Só interfere em R.O.s explicitamente externas.
      if(!/^RO-EX-/.test(roKey)){
        return original.apply(this,arguments);
      }

      const getRecords=window.getAllRoRecords;
      if(typeof getRecords!=='function'){
        return original.apply(this,arguments);
      }

      let list=[];
      try{list=getRecords()||[]}catch(e){list=[]}
      const targetDigits=digits(roKey);

      // Confirma que existe de fato uma R.O. externa correspondente.
      const realExternal=(Array.isArray(list)?list:[]).find(r=>
        digits(r?.numero||r?.id||r?.codigo||'')===targetDigits &&
        isExternalRecord(r)
      );

      if(!realExternal){
        return original.apply(this,arguments);
      }

      // A função antiga procura só pelos dígitos e pode achar primeiro RO-IN.
      // Durante este salvamento, força apenas os registros de mesmo número
      // a serem reconhecidos como externos. Depois restaura tudo.
      const touched=[];
      (Array.isArray(list)?list:[]).forEach(r=>{
        if(digits(r?.numero||r?.id||r?.codigo||'')!==targetDigits)return;
        touched.push({
          record:r,
          ehSac:r.ehSac,
          origemBase:r.origemBase,
          hadEhSac:Object.prototype.hasOwnProperty.call(r,'ehSac'),
          hadOrigem:Object.prototype.hasOwnProperty.call(r,'origemBase')
        });
        r.ehSac=true;
        r.origemBase='Externa';
      });

      try{
        return original.apply(this,arguments);
      }finally{
        touched.forEach(x=>{
          if(x.hadEhSac)x.record.ehSac=x.ehSac;
          else delete x.record.ehSac;
          if(x.hadOrigem)x.record.origemBase=x.origemBase;
          else delete x.record.origemBase;
        });
      }
    };

    wrapped.__originFixWrapped=true;
    wrapped.__originFixOriginal=original;
    window.saveExternalRoControl=wrapped;
    return true;
  }

  if(install())return;
  let tries=0;
  const timer=setInterval(()=>{
    if(install()||++tries>80)clearInterval(timer);
  },100);
})();
