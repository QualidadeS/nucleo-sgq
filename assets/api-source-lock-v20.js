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

  window.nucleoEnsureApiConfigured=async function(candidateUrl){
    const current=validApiUrl(candidateUrl || window.portalApiBase());
    if(!current){
      throw new Error('Informe uma URL válida do Web App do Apps Script.');
    }

    const result=await window.portalJsonp({acao:'portal_public_config'},20000,current);
    if(!result?.sucesso||!result?.config){
      throw new Error('A API informada não confirmou uma conexão válida com o Núcleo.');
    }

    const ambiente=String(result.ambiente||result.config?.ambiente||'').trim().toUpperCase();
    if(ambiente&&ambiente!=='PRODUCAO'){
      throw new Error('A API informada não é o backend de PRODUÇÃO do Núcleo.');
    }

    try{window.nucleoConfirmedApiUrl=current;}catch(_){}
    return {url:current,result};
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

    try{
      await window.nucleoEnsureApiConfigured(candidate);
      const saved=window.saveIntegrationSettings(true,candidate);
      if(!saved)return false;

      if(st){
        st.classList.remove('hidden');
        st.textContent='API confirmada e integração salva.';
      }

      alert('API confirmada e salva. A nova URL já está ativa.');
      return true;
    }catch(e){
      if(st){
        st.classList.remove('hidden');
        st.textContent='Não foi possível confirmar a API informada.';
      }
      alert('Não foi possível confirmar a API: '+(e?.message||e));
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
