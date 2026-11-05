/* NÚCLEO | API EDITÁVEL v65
   Mantém o sincronizador original do Núcleo.
   A URL salva pela Administração tem prioridade; runtime-config é apenas fallback.
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

  function fallbackApi(){
    return validApiUrl(window.NUCLEO_RUNTIME_CONFIG?.apiUrl||'');
  }

  function savedApi(){
    const integration=readObj(INTEGRATION_KEY);
    const admin=readObj(ADMIN_KEY);
    const sync=readObj(RO_SYNC_KEY);
    return validApiUrl(integration.apiUrl)||validApiUrl(admin.apiUrl)||validApiUrl(sync.apiUrl)||'';
  }

  // Restaurar a lógica original: API salva tem prioridade.
  window.nucleoPersistedApiUrl=function(){
    return savedApi();
  };

  window.portalApiBase=function(){
    return savedApi()||fallbackApi();
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
      apiUrl:window.portalApiBase()
    };
  };

  // Salva sem testar, sem ping e sem alterar o sincronizador.
  window.saveIntegrationSettings=function(silent=false,candidateUrl){
    if(typeof window.requireIntegrationUnlock==='function'&&!window.requireIntegrationUnlock())return false;

    const input=document.getElementById('apiUrl');
    const apiUrl=validApiUrl(candidateUrl||input?.value||window.portalApiBase());
    if(!apiUrl){
      if(!silent)alert('Informe uma URL válida do Web App / API terminando em /exec.');
      return false;
    }

    let current={};
    try{current=window.getSavedIntegrationSettings?.()||{};}catch(_){}

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
    if(input)input.value=apiUrl;

    if(!silent)alert('Integração salva. A nova API está ativa.');
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
      st.textContent='Integração salva. A API informada está ativa.';
    }
    alert('Integração salva. A API informada está ativa.');
    return true;
  };

  function enableApiField(){
    const input=document.getElementById('apiUrl');
    if(!input)return;

    if(input.readOnly)input.readOnly=false;
    if(input.disabled)input.disabled=false;
    input.removeAttribute('readonly');
    input.removeAttribute('aria-readonly');
    input.style.background='';
    input.title='';

    const current=savedApi()||fallbackApi();
    if(current && (!input.value || validApiUrl(input.value)!==current)){
      input.value=current;
    }

    document.querySelectorAll('[data-nucleo-api-lock-note]').forEach(el=>el.remove());
  }

  enableApiField();
  const observer=new MutationObserver(enableApiField);
  observer.observe(document.documentElement,{childList:true,subtree:true});

  console.info('[NÚCLEO] v65: sincronização original restaurada; API editável.');
})();