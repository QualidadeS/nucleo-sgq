/* NÚCLEO | transporte API v70
   - API vem somente da integração salva no próprio Núcleo.
   - Mantém as ações e respostas existentes.
   - Substitui apenas JSONP por iframe + postMessage.
*/
(function(){
  'use strict';

  const INTEGRATION_PERSIST_KEY='nucleo-integration-settings-v1';
  const ADMIN_CONFIG_KEY='ro-pdca-admin-config-v1';

  function validApiUrl(value){
    const url=String(value||'').trim().replace(/\/+$/,'');
    return /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url)?url:'';
  }

  function readJson(key){
    try{return JSON.parse(localStorage.getItem(key)||'{}')||{};}catch(_){return {};}
  }

  function persistedApi(){
    const dedicated=readJson(INTEGRATION_PERSIST_KEY);
    const admin=readJson(ADMIN_CONFIG_KEY);
    return validApiUrl(dedicated.apiUrl)||validApiUrl(admin.apiUrl)||'';
  }

  // Regra única: nenhuma URL fixa de build é usada.
  window.nucleoPersistedApiUrl=persistedApi;
  window.portalApiBase=function(){
    return persistedApi();
  };
  window.portalBackendEnabled=function(){
    return !!persistedApi();
  };

  // O campo permanece editável; o código original continua responsável por salvar.
  function unlockApiField(){
    const input=document.getElementById('apiUrl');
    if(!input)return;
    input.readOnly=false;
    input.disabled=false;
    input.removeAttribute('readonly');
    input.removeAttribute('aria-readonly');
    const saved=persistedApi();
    if(saved && !String(input.value||'').trim())input.value=saved;
  }

  function bridgeRequest(params,timeoutMs=60000,baseOverride=''){
    return new Promise((resolve,reject)=>{
      const base=validApiUrl(baseOverride)||persistedApi();
      if(!base){
        reject(new Error('URL do Apps Script não configurada no Núcleo.'));
        return;
      }

      const requestParams={...(params||{})};
      const actionName=String(requestParams.acao||'').toLowerCase();
      const sessionToken=String(typeof getSession==='function'?(getSession()?.authToken||''):'').trim();

      // Mantém as mesmas regras do portalJsonp original.
      try{
        if(
          sessionToken &&
          typeof nucleoActionNeedsCentralConfirmation==='function' &&
          nucleoActionNeedsCentralConfirmation(actionName) &&
          typeof nucleoCentralDataConfirmed==='function' &&
          !nucleoCentralDataConfirmed()
        ){
          reject(new Error('Dados ainda não confirmados pela base central. Aguarde o indicador ficar verde e tente novamente.'));
          return;
        }
      }catch(_){}

      if(
        sessionToken &&
        !requestParams.token &&
        actionName!=='portal_public_config' &&
        !['portal_login','portal_login_jsonp','portal_register_user'].includes(actionName)
      ){
        requestParams.token=sessionToken;
      }

      const id='bridge70_'+Date.now()+'_'+Math.floor(Math.random()*1000000);
      const iframe=document.createElement('iframe');
      iframe.style.display='none';
      iframe.setAttribute('aria-hidden','true');

      let done=false;
      let timer=null;

      function cleanup(){
        if(timer)clearTimeout(timer);
        window.removeEventListener('message',onMessage);
        try{iframe.remove();}catch(_){}
      }

      function finish(err,data){
        if(done)return;
        done=true;
        cleanup();
        if(err)reject(err);else resolve(data);
      }

      function onMessage(event){
        const data=event.data||{};
        if(data.type!=='NUCLEO_API_BRIDGE_V70'||data.id!==id)return;
        if(event.source!==iframe.contentWindow)return;

        try{
          const current=typeof getSession==='function'?getSession():null;
          if(
            requestParams.token &&
            current?.authToken===requestParams.token &&
            typeof nucleoSessionError==='function' &&
            nucleoSessionError(data.payload) &&
            typeof nucleoEndExpiredSession==='function'
          ){
            nucleoEndExpiredSession();
          }
        }catch(_){}

        finish(null,data.payload);
      }

      const parts=[];
      const all={
        ...requestParams,
        __nucleo_bridge:'1',
        __bridge_id:id,
        _bridge_ts:Date.now()
      };
      Object.entries(all).forEach(([k,v])=>{
        if(v!==undefined&&v!==null){
          parts.push(encodeURIComponent(k)+'='+encodeURIComponent(String(v)));
        }
      });

      window.addEventListener('message',onMessage);
      iframe.src=base+'?'+parts.join('&');
      iframe.onload=function(){ /* resposta chega por postMessage */ };
      timer=setTimeout(
        ()=>finish(new Error('O Apps Script não respondeu à ponte de dados dentro do tempo limite.')),
        Math.max(15000,Number(timeoutMs)||60000)
      );

      document.body.appendChild(iframe);
    });
  }

  // Substitui a função global usada pelo Núcleo sem alterar quem chama.
  window.portalJsonp=bridgeRequest;
  try{portalJsonp=bridgeRequest;}catch(_){}

  unlockApiField();
  document.addEventListener('DOMContentLoaded',unlockApiField);
  new MutationObserver(unlockApiField).observe(document.documentElement,{childList:true,subtree:true});

  console.info('[NÚCLEO] API v70: URL salva no Núcleo + transporte iframe ativo.');
})();
