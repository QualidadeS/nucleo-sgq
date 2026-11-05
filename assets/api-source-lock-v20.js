/* NÚCLEO | API EDITÁVEL v21
   A URL do Web App pode ser alterada pela Administração na tela de Integração.
   O valor salvo passa a ser a fonte ativa. nucleo-runtime-config.js permanece
   apenas como fallback inicial/recuperação.
*/
(function(){
  'use strict';

  const INTEGRATION_KEY='nucleo-integration-settings-v1';
  const ADMIN_KEY='ro-pdca-admin-config-v1';
  const RO_SYNC_KEY='ro-sync-settings';

  function normalizeUrl(url){
    return String(url||'').trim().replace(/\/+$/,'');
  }

  function validApiUrl(url){
    const value=normalizeUrl(url);
    return /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(value)?value:'';
  }

  function fallbackApiUrl(){
    return validApiUrl(window.NUCLEO_RUNTIME_CONFIG?.apiUrl||'');
  }

  function readObj(key){
    try{return JSON.parse(localStorage.getItem(key)||'{}')||{};}catch(_){return {};}
  }

  function writeObj(key,obj){
    try{localStorage.setItem(key,JSON.stringify(obj||{}));}catch(_){}
  }

  function storedApiUrl(){
    const sources=[
      readObj(INTEGRATION_KEY)?.apiUrl,
      readObj(ADMIN_KEY)?.apiUrl,
      readObj(RO_SYNC_KEY)?.apiUrl
    ];
    for(const value of sources){
      const valid=validApiUrl(value);
      if(valid)return valid;
    }
    return '';
  }

  window.nucleoPersistedApiUrl=function(){
    return storedApiUrl();
  };

  window.portalApiBase=function(){
    return storedApiUrl() || fallbackApiUrl();
  };

  window.portalBackendEnabled=function(){
    return !!window.portalApiBase();
  };

  const originalGetSaved=window.getSavedIntegrationSettings;
  window.getSavedIntegrationSettings=function(){
    let previous={};
    try{
      previous=typeof originalGetSaved==='function'?(originalGetSaved()||{}):{};
    }catch(_){}
    return {
      ...previous,
      apiUrl:storedApiUrl() || fallbackApiUrl()
    };
  };


  function directJsonp(url, params={}, timeoutMs=25000){
    return new Promise((resolve,reject)=>{
      const base=validApiUrl(url);
      if(!base){reject(new Error('URL inválida.'));return;}

      const cb='nucleoApiTestV61_'+Date.now()+'_'+Math.floor(Math.random()*100000);
      const script=document.createElement('script');
      let done=false;
      let timer=null;

      function cleanup(){
        if(timer)clearTimeout(timer);
        try{delete window[cb];}catch(_){window[cb]=undefined;}
        try{script.remove();}catch(_){}
      }
      function finish(err,data){
        if(done)return;
        done=true;
        cleanup();
        err?reject(err):resolve(data);
      }

      window[cb]=(data)=>finish(null,data);

      const parts=[];
      Object.entries(params||{}).forEach(([k,v])=>{
        if(v!==undefined&&v!==null&&String(v)!==''){
          parts.push(encodeURIComponent(k)+'='+encodeURIComponent(String(v)));
        }
      });
      parts.push('callback='+encodeURIComponent(cb));
      parts.push('_='+Date.now());

      script.async=true;
      script.src=base+'?'+parts.join('&');
      script.onerror=()=>finish(new Error('A URL /exec não devolveu o ping JSONP esperado pelo Núcleo.'));
      timer=setTimeout(()=>finish(new Error('A API não respondeu dentro do tempo limite.')),timeoutMs);
      document.head.appendChild(script);
    });
  }

  async function probeApi(candidate){
    const url=validApiUrl(candidate);
    if(!url)throw new Error('Informe uma URL válida do Web App / API terminando em /exec.');

    const data=await directJsonp(
      url,
      {
        mode:'nucleo_ping_v61',
        nucleoAction:'nucleo_ping_v61',
        acao:'nucleo_ping_v61'
      },
      20000
    );

    if(
      data?.sucesso===true &&
      data?.nucleo===true &&
      data?.route==='nucleo_ping_v61'
    ){
      return {url,result:data,probe:'nucleo_ping_v61'};
    }

    let raw='';
    try{raw=JSON.stringify(data);}catch(_){raw=String(data);}
    throw new Error(
      'A URL respondeu, mas não executou o backend V61 do Núcleo. Resposta: '+raw
    );
  }

  window.nucleoEnsureApiConfigured=async function(candidateUrl){
    const current=validApiUrl(candidateUrl || document.getElementById('apiUrl')?.value || window.portalApiBase());
    const checked=await probeApi(current);
    try{window.nucleoConfirmedApiUrl=current;}catch(_){}
    return checked;
  };

  window.saveIntegrationSettings=function(silent=false,forcedApiUrl){
    if(typeof window.requireIntegrationUnlock==='function'&&!window.requireIntegrationUnlock())return false;

    let current={};
    try{current=window.getSavedIntegrationSettings?.()||{};}catch(_){}

    const typed=forcedApiUrl!==undefined
      ? forcedApiUrl
      : document.getElementById('apiUrl')?.value;

    const apiUrl=validApiUrl(typed || current.apiUrl || fallbackApiUrl());
    if(!apiUrl){
      if(!silent)alert('Informe uma URL válida do Web App / API terminando em /exec.');
      return false;
    }

    const apiKey=String(document.getElementById('apiKey')?.value||current.apiKey||'').trim();
    const autoSync=document.getElementById('autoSync')?.value||current.autoSync||'0';
    const roSyncPeriod=document.getElementById('roSyncPeriod')?.value||current.roSyncPeriod||'all';
    const roSyncDateFrom=document.getElementById('roSyncDateFrom')?.value||current.roSyncDateFrom||'';
    const roSyncDateTo='';

    if(roSyncPeriod==='custom'&&!roSyncDateFrom){
      if(!silent)alert('Informe a data inicial da busca.');
      return false;
    }

    const sync={
      apiUrl,
      apiKey,
      autoSync,
      roSyncPeriod,
      roSyncDateFrom,
      roSyncDateTo,
      savedAt:new Date().toISOString()
    };

    writeObj(INTEGRATION_KEY,sync);
    writeObj(RO_SYNC_KEY,sync);

    const cfg=readObj(ADMIN_KEY);
    cfg.apiUrl=apiUrl;
    cfg.apiKey=apiKey;
    cfg.autoSync=autoSync;
    cfg.roSyncPeriod=roSyncPeriod;
    cfg.roSyncDateFrom=roSyncDateFrom;
    cfg.roSyncDateTo=roSyncDateTo;
    cfg.__savedAt=new Date().toLocaleString('pt-BR');
    writeObj(ADMIN_KEY,cfg);

    const input=document.getElementById('apiUrl');
    if(input)input.value=apiUrl;

    if(!silent)alert('Integração salva. A nova API já está ativa neste navegador.');
    return sync;
  };

  window.saveIntegrationSettingsConfirmed=async function(){
    if(typeof window.isAdmin==='function'&&!window.isAdmin()){
      alert('Configuração indisponível.');
      return false;
    }
    if(typeof window.requireIntegrationUnlock==='function'&&!window.requireIntegrationUnlock())return false;

    const input=document.getElementById('apiUrl');
    const candidate=validApiUrl(input?.value||'');
    const st=document.getElementById('configSavedState');

    if(!candidate){
      alert('Informe uma URL válida do Web App / API terminando em /exec.');
      return false;
    }

    // Salva e ativa PRIMEIRO. O teste é informativo e nunca mais bloqueia a troca da API.
    const saved=window.saveIntegrationSettings(true,candidate);
    if(!saved)return false;

    if(st){
      st.classList.remove('hidden');
      st.textContent='Integração salva. A nova API já está ativa neste navegador.';
    }

    try{
      const checked=await probeApi(candidate);
      if(st){
        st.textContent='Integração salva e API V61 confirmada.';
      }
      alert('Integração salva. A nova API já está ativa.');
      return true;
    }catch(e){
      // A URL permanece salva mesmo quando o teste falha.
      if(st){
        st.textContent='Integração salva. O teste automático não conseguiu validar a resposta da API.';
      }
      alert(
        'Integração salva e API alterada.\n\n'+
        'O teste automático não conseguiu validar a resposta agora: '+
        (e?.message||e)
      );
      return true;
    }
  };


  window.testConnection=async function(){
    if(typeof window.requireIntegrationUnlock==='function'&&!window.requireIntegrationUnlock())return;
    if(typeof window.isAdmin==='function'&&!window.isAdmin()){
      alert('Configuração indisponível.');
      return;
    }

    const input=document.getElementById('apiUrl');
    const result=document.getElementById('testResult');
    const candidate=validApiUrl(input?.value||'');

    if(result){
      result.className='statusline';
      result.classList.remove('hidden');
    }

    if(!candidate){
      if(result)result.textContent='Informe uma URL /exec válida do Apps Script.';
      return;
    }

    if(result)result.textContent='Testando exatamente a URL digitada...';

    try{
      const checked=await probeApi(candidate);
      if(result){
        result.className='statusline okline';
        result.classList.remove('hidden');
        result.textContent='API conectada. Backend V61 confirmado.';
      }
      return true;
    }catch(err){
      if(result){
        result.className='statusline';
        result.classList.remove('hidden');
        result.textContent='Falha ao testar esta URL: '+(err?.message||err);
      }
      return false;
    }
  };

  function enableApiField(){
    const input=document.getElementById('apiUrl');
    if(!input)return;

    input.readOnly=false;
    input.removeAttribute('readonly');
    input.removeAttribute('aria-readonly');
    input.title='URL do Web App / API usada pelo Núcleo.';
    input.style.background='';

    // Só preenche automaticamente se o usuário não estiver editando.
    if(document.activeElement!==input){
      const current=storedApiUrl()||fallbackApiUrl();
      if(current && input.value!==current)input.value=current;
    }

    const parent=input.parentElement;
    const oldNote=parent?.querySelector('[data-nucleo-api-lock-note]');
    if(oldNote)oldNote.remove();
  }

  enableApiField();

  // A tela pode ser recriada dinamicamente; apenas garante que o campo continue editável.
  const observer=new MutationObserver(enableApiField);
  observer.observe(document.documentElement,{childList:true,subtree:true});

  console.info('[NÚCLEO] API editável pela Administração ativa.');
})();
