/* NÚCLEO | API EDITÁVEL — recuperação v67
   A URL usada pelo Núcleo vem SOMENTE da integração salva na própria tela.
   Não usa URL fixa em código, runtime-config ou fallback oculto.
*/
(function(){
  'use strict';

  const INTEGRATION_KEY='nucleo-integration-settings-v1';
  const ADMIN_KEY='ro-pdca-admin-config-v1';
  const RO_SYNC_KEY='ro-sync-settings';

  function validApiUrl(value){
    const url=String(value||'').trim().replace(/\/+$/,'');
    return /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url)?url:'';
  }

  function readObj(key){
    try{return JSON.parse(localStorage.getItem(key)||'{}')||{};}catch(_){return {};}
  }

  function writeObj(key,obj){
    try{localStorage.setItem(key,JSON.stringify(obj||{}));}catch(_){}
  }

  function storedApi(){
    const integration=readObj(INTEGRATION_KEY);
    const admin=readObj(ADMIN_KEY);
    const sync=readObj(RO_SYNC_KEY);
    return validApiUrl(integration.apiUrl)||
           validApiUrl(sync.apiUrl)||
           validApiUrl(admin.apiUrl)||
           '';
  }

  // Only API source selection is overridden.
  window.nucleoPersistedApiUrl=function(){ return storedApi(); };
  window.portalApiBase=function(){
    return storedApi();
  };
  window.portalBackendEnabled=function(){ return !!storedApi(); };

  const originalGetSaved=window.getSavedIntegrationSettings;
  window.getSavedIntegrationSettings=function(){
    let previous={};
    try{previous=typeof originalGetSaved==='function'?(originalGetSaved()||{}):{};}catch(_){}
    return {...previous,apiUrl:storedApi()};
  };

  // Reuse the original settings semantics but allow apiUrl from the field.
  window.saveIntegrationSettings=function(silent=false){
    if(typeof window.requireIntegrationUnlock==='function'&&!window.requireIntegrationUnlock())return false;

    let current={};
    try{current=window.getSavedIntegrationSettings?.()||{};}catch(_){}

    const apiUrl=validApiUrl(document.getElementById('apiUrl')?.value||current.apiUrl||'');
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

    const payload={
      apiUrl,apiKey,autoSync,roSyncPeriod,roSyncDateFrom,roSyncDateTo,
      savedAt:new Date().toISOString()
    };

    writeObj(INTEGRATION_KEY,payload);
    writeObj(RO_SYNC_KEY,payload);

    const admin=readObj(ADMIN_KEY);
    Object.assign(admin,payload,{__savedAt:new Date().toLocaleString('pt-BR')});
    writeObj(ADMIN_KEY,admin);

    try{window.nucleoConfirmedApiUrl=apiUrl;}catch(_){}

    if(!silent)alert('Integração salva.');
    return payload;
  };

  window.saveIntegrationSettingsConfirmed=async function(){
    if(typeof window.isAdmin==='function'&&!window.isAdmin()){
      alert('Configuração indisponível.');
      return false;
    }
    const saved=window.saveIntegrationSettings(true);
    if(!saved)return false;

    const st=document.getElementById('configSavedState');
    if(st){
      st.classList.remove('hidden');
      st.textContent='Integração salva.';
    }
    alert('Integração salva.');
    return true;
  };

  function unlock(){
    const input=document.getElementById('apiUrl');
    if(!input)return;
    input.readOnly=false;
    input.disabled=false;
    input.removeAttribute('readonly');
    input.removeAttribute('aria-readonly');
    input.style.background='';
    input.title='';
    const current=storedApi();
    if(current){
      input.value=current;
    }
    document.querySelectorAll('[data-nucleo-api-lock-note]').forEach(el=>el.remove());
  }

  unlock();
  new MutationObserver(unlock).observe(document.documentElement,{childList:true,subtree:true});
})();
