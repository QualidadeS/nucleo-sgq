/* NÚCLEO | API ÚNICA DE PRODUÇÃO v20
   A API oficial vem exclusivamente de assets/nucleo-runtime-config.js.
   Nenhum valor salvo no navegador pode escolher outro backend.
*/
(function(){
  'use strict';

  const INTEGRATION_KEY='nucleo-integration-settings-v1';
  const ADMIN_KEY='ro-pdca-admin-config-v1';
  const RO_SYNC_KEY='ro-sync-settings';

  function officialApiUrl(){
    return String(window.NUCLEO_RUNTIME_CONFIG?.apiUrl||'').trim().replace(/\/+$/,'');
  }

  function validOfficialApi(){
    const url=officialApiUrl();
    return /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url)?url:'';
  }

  // Nunca mais escolher API por cache/localStorage/admin.
  window.nucleoPersistedApiUrl=function(){ return ''; };
  window.portalApiBase=function(){ return validOfficialApi(); };
  window.portalBackendEnabled=function(){ return !!validOfficialApi(); };

  const originalGetSaved=window.getSavedIntegrationSettings;
  window.getSavedIntegrationSettings=function(){
    let previous={};
    try{ previous=typeof originalGetSaved==='function'?(originalGetSaved()||{}):{}; }catch(_){ }
    return {...previous,apiUrl:validOfficialApi()};
  };

  // Falha fechada: se a API oficial não responder, não procura outra.
  window.nucleoEnsureApiConfigured=async function(){
    const current=validOfficialApi();
    if(!current)throw new Error('API oficial do Núcleo não configurada no bootstrap de produção.');

    const result=await window.portalJsonp({acao:'portal_public_config'},20000,current);
    if(!result?.sucesso||!result?.config){
      throw new Error('A API oficial não confirmou uma conexão válida com o Núcleo.');
    }

    const ambiente=String(result.ambiente||result.config?.ambiente||'').trim().toUpperCase();
    if(ambiente&&ambiente!=='PRODUCAO'){
      throw new Error('A API configurada não é o backend de PRODUÇÃO do Núcleo.');
    }

    try{ window.nucleoConfirmedApiUrl=current; }catch(_){ }
    return {url:current,result};
  };

  function readObj(key){
    try{return JSON.parse(localStorage.getItem(key)||'{}')||{};}catch(_){return {};}
  }
  function writeObj(key,obj){
    try{localStorage.setItem(key,JSON.stringify(obj||{}));}catch(_){ }
  }

  // Salva apenas preferências. A URL sempre é forçada para a oficial.
  window.saveIntegrationSettings=function(silent=false){
    if(typeof window.requireIntegrationUnlock==='function'&&!window.requireIntegrationUnlock())return false;

    const official=validOfficialApi();
    if(!official){
      if(!silent)alert('API oficial do Núcleo não configurada.');
      return false;
    }

    let current={};
    try{current=window.getSavedIntegrationSettings?.()||{};}catch(_){ }

    const apiKey=String(document.getElementById('apiKey')?.value||current.apiKey||'').trim();
    const autoSync=document.getElementById('autoSync')?.value||current.autoSync||'0';
    const roSyncPeriod=document.getElementById('roSyncPeriod')?.value||current.roSyncPeriod||'all';
    const roSyncDateFrom=document.getElementById('roSyncDateFrom')?.value||current.roSyncDateFrom||'';
    const roSyncDateTo='';

    if(roSyncPeriod==='custom'&&!roSyncDateFrom){
      if(!silent)alert('Informe a data inicial da busca.');
      return false;
    }

    const sync={apiUrl:official,apiKey,autoSync,roSyncPeriod,roSyncDateFrom,roSyncDateTo,savedAt:new Date().toISOString()};
    writeObj(INTEGRATION_KEY,sync);
    writeObj(RO_SYNC_KEY,sync);

    const cfg=readObj(ADMIN_KEY);
    cfg.apiUrl=official;
    cfg.apiKey=apiKey;
    cfg.autoSync=autoSync;
    cfg.roSyncPeriod=roSyncPeriod;
    cfg.roSyncDateFrom=roSyncDateFrom;
    cfg.roSyncDateTo=roSyncDateTo;
    cfg.__savedAt=new Date().toLocaleString('pt-BR');
    writeObj(ADMIN_KEY,cfg);

    if(!silent)alert('Preferências de sincronização salvas. A API oficial não foi alterada.');
    return sync;
  };

  window.saveIntegrationSettingsConfirmed=async function(){
    if(typeof window.isAdmin==='function'&&!window.isAdmin()){
      alert('Configuração indisponível.');
      return false;
    }
    if(typeof window.requireIntegrationUnlock==='function'&&!window.requireIntegrationUnlock())return false;

    const st=document.getElementById('configSavedState');
    try{
      await window.nucleoEnsureApiConfigured();
      const saved=window.saveIntegrationSettings(true);
      if(!saved)return false;
      if(st){
        st.classList.remove('hidden');
        st.textContent='API oficial confirmada. Preferências de sincronização salvas.';
      }
      alert('API oficial confirmada. A URL é controlada pela infraestrutura e não pode ser alterada pela Administração.');
      return true;
    }catch(e){
      if(st){
        st.classList.remove('hidden');
        st.textContent='API oficial não confirmada.';
      }
      alert('Não foi possível confirmar a API oficial: '+(e?.message||e));
      return false;
    }
  };

  function sanitizeStoredApi(){
    const official=validOfficialApi();
    if(!official)return;
    [INTEGRATION_KEY,RO_SYNC_KEY,ADMIN_KEY].forEach(key=>{
      const obj=readObj(key);
      if(obj.apiUrl!==official){obj.apiUrl=official;writeObj(key,obj);}
    });
  }

  function lockApiField(){
    const input=document.getElementById('apiUrl');
    if(!input)return;
    input.value=validOfficialApi();
    input.readOnly=true;
    input.setAttribute('aria-readonly','true');
    input.title='API oficial do Núcleo. Alteração somente em assets/nucleo-runtime-config.js.';
    input.style.background='#f3f4f6';

    const parent=input.parentElement;
    if(parent&&!parent.querySelector('[data-nucleo-api-lock-note]')){
      const note=document.createElement('div');
      note.dataset.nucleoApiLockNote='1';
      note.className='small';
      note.style.marginTop='5px';
      note.textContent='API oficial bloqueada pela infraestrutura. Este campo é somente leitura.';
      parent.appendChild(note);
    }
  }

  sanitizeStoredApi();
  lockApiField();
  const observer=new MutationObserver(lockApiField);
  observer.observe(document.documentElement,{childList:true,subtree:true});

  console.info('[NÚCLEO] API única de produção ativa.');
})();
