/* NÚCLEO | API GLOBAL CANÔNICA V40
   REGRA FIXA:
   - A URL da API é global para todo o Núcleo.
   - localStorage NUNCA escolhe a URL da API.
   - O navegador começa pela URL bootstrap publicada no código.
   - A configuração central (portal_public_config) pode apontar para outra URL.
   - Se houver uma cadeia A -> B -> C, o cliente segue a cadeia até a URL final.
   - A tela SGQ salva a nova URL na configuração CENTRAL do backend atual.
   - localStorage pode guardar preferências locais, mas nunca a URL global.
*/
(function(){
  'use strict';

  const LOCAL_INTEGRATION_KEYS=[
    'nucleo-integration-settings-v1',
    'ro-pdca-admin-config-v1',
    'ro-sync-settings'
  ];

  function normalizeUrl(url){
    return String(url||'').trim().replace(/\/+$/,'');
  }

  function validApiUrl(url){
    const value=normalizeUrl(url);
    return /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(value)?value:'';
  }

  function bootstrapApiUrl(){
    const runtime=validApiUrl(window.NUCLEO_RUNTIME_CONFIG?.apiUrl||'');
    if(runtime)return runtime;
    try{
      if(typeof NUCLEO_DEFAULT_API_URL!=='undefined'){
        const legacy=validApiUrl(NUCLEO_DEFAULT_API_URL||'');
        if(legacy)return legacy;
      }
    }catch(_){}
    return '';
  }

  // Remove somente apiUrl de caches legados. Os demais campos locais podem
  // continuar existindo quando forem realmente preferências do dispositivo.
  function purgeLocalApiUrl(){
    LOCAL_INTEGRATION_KEYS.forEach(key=>{
      try{
        const raw=localStorage.getItem(key);
        if(!raw)return;
        const obj=JSON.parse(raw);
        if(!obj||typeof obj!=='object'||Array.isArray(obj))return;
        if(Object.prototype.hasOwnProperty.call(obj,'apiUrl')){
          delete obj.apiUrl;
          localStorage.setItem(key,JSON.stringify(obj));
        }
      }catch(_){}
    });
  }

  purgeLocalApiUrl();

  let globalApiUrl=bootstrapApiUrl();
  let resolvingPromise=null;

  function directJsonp(url,params={},timeoutMs=25000){
    return new Promise((resolve,reject)=>{
      const base=validApiUrl(url);
      if(!base){reject(new Error('URL inválida.'));return;}

      const cb='nucleoGlobalApiV40_'+Date.now()+'_'+Math.floor(Math.random()*100000);
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

      window[cb]=data=>finish(null,data);
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
      script.onerror=()=>finish(new Error('A API global não respondeu ao Núcleo.'));
      timer=setTimeout(()=>finish(new Error('A API global excedeu o tempo limite.')),timeoutMs);
      document.head.appendChild(script);
    });
  }

  async function probeApi(url){
    const candidate=validApiUrl(url);
    if(!candidate)throw new Error('Informe uma URL válida do Web App terminando em /exec.');
    const data=await directJsonp(candidate,{acao:'portal_public_config',nucleoAction:'portal_public_config'},25000);
    if(!data?.sucesso)throw new Error(data?.erro||'A URL não respondeu como backend do Núcleo.');
    return data;
  }

  async function resolveGlobalApiUrl(force=false){
    if(resolvingPromise&&!force)return resolvingPromise;

    resolvingPromise=(async()=>{
      let current=bootstrapApiUrl();
      if(!current)throw new Error('A URL bootstrap global do Núcleo não está configurada.');

      const seen=new Set();
      for(let hop=0;hop<6;hop++){
        if(seen.has(current))break;
        seen.add(current);

        let data;
        try{
          data=await probeApi(current);
        }catch(e){
          // Se ao menos o bootstrap existe, mantém essa URL como fallback global.
          if(hop===0){globalApiUrl=current;return current;}
          break;
        }

        const next=validApiUrl(data?.config?.apiUrl||'');
        if(!next||next===current){
          globalApiUrl=current;
          return current;
        }
        current=next;
      }

      globalApiUrl=current;
      return current;
    })().finally(()=>{resolvingPromise=null;});

    return resolvingPromise;
  }

  window.nucleoResolveGlobalApiUrl=resolveGlobalApiUrl;
  window.nucleoGlobalApiBootstrap=bootstrapApiUrl;

  // Compatibilidade: o nome antigo continua existindo, mas NÃO lê localStorage.
  window.nucleoPersistedApiUrl=function(){
    return globalApiUrl||bootstrapApiUrl();
  };

  window.portalApiBase=function(){
    return validApiUrl(globalApiUrl)||bootstrapApiUrl();
  };

  window.portalBackendEnabled=function(){
    return !!window.portalApiBase();
  };

  const originalPortalJsonp=window.portalJsonp;
  if(typeof originalPortalJsonp==='function'){
    window.portalJsonp=function(params,timeoutMs=60000,baseOverride=''){
      if(baseOverride)return originalPortalJsonp.call(this,params,timeoutMs,baseOverride);
      return resolveGlobalApiUrl(false).then(base=>originalPortalJsonp.call(this,params,timeoutMs,base));
    };
  }

  const originalGetSaved=window.getSavedIntegrationSettings;
  window.getSavedIntegrationSettings=function(){
    let previous={};
    try{previous=typeof originalGetSaved==='function'?(originalGetSaved()||{}):{};}catch(_){}
    return {...previous,apiUrl:window.portalApiBase()};
  };

  function readLocalDeviceSettings(){
    let previous={};
    try{previous=typeof originalGetSaved==='function'?(originalGetSaved()||{}):{};}catch(_){}
    if(previous&&typeof previous==='object')delete previous.apiUrl;
    return previous||{};
  }

  function saveLocalDeviceSettings(settings){
    const copy={...(settings||{})};
    delete copy.apiUrl;
    try{localStorage.setItem('nucleo-integration-settings-v1',JSON.stringify(copy));}catch(_){}
    try{localStorage.setItem('ro-sync-settings',JSON.stringify(copy));}catch(_){}
  }

  window.nucleoEnsureApiConfigured=async function(candidateUrl){
    if(candidateUrl){
      const candidate=validApiUrl(candidateUrl);
      const result=await probeApi(candidate);
      return {url:candidate,result};
    }
    const url=await resolveGlobalApiUrl(true);
    const result=await probeApi(url);
    try{window.nucleoConfirmedApiUrl=url;}catch(_){}
    return {url,result};
  };

  // Mantém preferências realmente locais, mas a URL nunca é persistida localmente.
  window.saveIntegrationSettings=function(silent=false){
    if(typeof window.requireIntegrationUnlock==='function'&&!window.requireIntegrationUnlock())return false;
    const current=readLocalDeviceSettings();
    const next={
      ...current,
      apiKey:String(document.getElementById('apiKey')?.value||current.apiKey||'').trim(),
      autoSync:document.getElementById('autoSync')?.value||current.autoSync||'0',
      roSyncPeriod:document.getElementById('roSyncPeriod')?.value||current.roSyncPeriod||'all',
      roSyncDateFrom:document.getElementById('roSyncDateFrom')?.value||current.roSyncDateFrom||'',
      roSyncDateTo:'',
      savedAt:new Date().toISOString()
    };
    if(next.roSyncPeriod==='custom'&&!next.roSyncDateFrom){
      if(!silent)alert('Informe a data inicial da busca.');
      return false;
    }
    saveLocalDeviceSettings(next);
    if(!silent)alert('Preferências deste dispositivo salvas. A URL da API continua sendo global.');
    return {...next,apiUrl:window.portalApiBase()};
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
      await probeApi(candidate);
      const currentBase=await resolveGlobalApiUrl(true);
      if(typeof originalPortalJsonp!=='function')throw new Error('Conexão central indisponível.');

      // Busca a configuração CENTRAL atual. localStorage não participa da decisão.
      const loaded=await originalPortalJsonp({acao:'portal_load'},60000,currentBase);
      if(!loaded?.sucesso)throw new Error(loaded?.erro||'Não foi possível ler a configuração central atual.');
      const centralConfig={...(loaded?.dados?.config||{})};

      const device=window.saveIntegrationSettings(true)||{};
      const nextConfig={
        ...centralConfig,
        apiUrl:candidate,
        apiKey:device.apiKey||centralConfig.apiKey||'',
        autoSync:device.autoSync??centralConfig.autoSync??'0',
        roSyncPeriod:device.roSyncPeriod||centralConfig.roSyncPeriod||'all',
        roSyncDateFrom:device.roSyncDateFrom||centralConfig.roSyncDateFrom||'',
        roSyncDateTo:'',
        __savedAt:new Date().toISOString()
      };

      // Salva no backend global ATUAL. Assim a cadeia bootstrap -> atual -> nova
      // é comum a todos os dispositivos e não depende de estado local.
      const saved=await originalPortalJsonp({
        acao:'portal_save_config',
        dados:JSON.stringify(nextConfig),
        ator:(typeof getSession==='function'?getSession()?.name:'')||'SGQ'
      },60000,currentBase);
      if(!saved?.sucesso)throw new Error(saved?.erro||'A base central não confirmou a URL global.');

      globalApiUrl=candidate;
      try{window.nucleoConfirmedApiUrl=candidate;}catch(_){}
      purgeLocalApiUrl();
      if(input)input.value=candidate;
      if(st){
        st.classList.remove('hidden');
        st.textContent='URL global salva na base central. Todos os dispositivos usarão a mesma API.';
      }

      if(currentBase!==candidate){
        alert('URL global alterada na base central. O Núcleo será recarregado para entrar usando a nova API.');

        // A sessão/token atual pertence à API anterior. Não reutiliza esse token na API nova.
        try{
          if(typeof SESSION_KEY!=='undefined'){
            localStorage.removeItem(SESSION_KEY);
            sessionStorage.removeItem(SESSION_KEY);
          }
        }catch(_){}
        try{if(typeof nucleoSessionMemory!=='undefined')nucleoSessionMemory=null;}catch(_){}
        try{if(typeof nucleoSessionLastRaw!=='undefined')nucleoSessionLastRaw=undefined;}catch(_){}
        setTimeout(()=>location.reload(),50);
        return true;
      }

      alert('URL global confirmada na base central.');
      return true;
    }catch(e){
      if(st){
        st.classList.remove('hidden');
        st.textContent='Não foi possível salvar a URL global.';
      }
      alert('Não foi possível salvar a URL global: '+(e?.message||e));
      return false;
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
    if(result){result.className='statusline';result.classList.remove('hidden');}
    if(!candidate){if(result)result.textContent='Informe uma URL /exec válida do Apps Script.';return;}
    if(result)result.textContent='Testando a URL global informada...';
    try{
      await probeApi(candidate);
      if(result){
        result.className='statusline okline';
        result.textContent='API confirmada. Ao salvar, esta URL será gravada na configuração central para todos os Núcleos.';
      }
      return true;
    }catch(e){
      if(result){result.className='statusline';result.textContent='Falha ao testar a URL: '+(e?.message||e);}
      return false;
    }
  };

  // Cada instância do campo recebe a URL global somente UMA vez e apenas se estiver vazia.
  // Depois disso, o que o SGQ digitar é preservado até testar/salvar/cancelar a própria edição.
  // Nenhum observer, refresh ou resolução assíncrona pode reescrever o valor digitado.
  const initializedApiInputs=new WeakSet();
  function enableApiField(){
    const input=document.getElementById('apiUrl');
    if(!input)return;
    input.readOnly=false;
    input.removeAttribute('readonly');
    input.removeAttribute('aria-readonly');
    input.title='URL GLOBAL do Núcleo. Não depende deste navegador.';
    input.style.background='';

    if(!initializedApiInputs.has(input)){
      initializedApiInputs.add(input);
      if(!String(input.value||'').trim()){
        const current=window.portalApiBase();
        if(current)input.value=current;
      }
    }

    const parent=input.parentElement;
    const oldNote=parent?.querySelector('[data-nucleo-api-lock-note]');
    if(oldNote)oldNote.remove();
  }

  const observer=new MutationObserver(enableApiField);
  observer.observe(document.documentElement,{childList:true,subtree:true});
  enableApiField();

  window.nucleoGlobalApiReady=resolveGlobalApiUrl(true)
    .then(url=>{enableApiField();return url;})
    .catch(e=>{console.error('[NÚCLEO] Falha ao resolver API global.',e);return bootstrapApiUrl();});

  window.addEventListener('load',()=>{resolveGlobalApiUrl(true).then(enableApiField).catch(()=>{});},{once:true});
  console.info('[NÚCLEO] API GLOBAL CANÔNICA V40 ativa — localStorage não escolhe API e o campo SGQ não é sobrescrito.');
})();

/* NÚCLEO | Diretório compartilhado Matriz/Filial V31
   Usa portal_pending_users, rota já consolidada, para evitar depender de uma
   ação nova do Apps Script. A triagem monta setor + pessoa por accessUnits.
*/
(function(){
  'use strict';
  if(window.__nucleoAccessUnitsTriageV31)return;
  window.__nucleoAccessUnitsTriageV31=true;

  const CACHE_KEY='nucleo-shared-directory-v43-disabled';
  const originalUsersBySector=window.usersBySector;
  const originalGetConfiguredSectors=window.getConfiguredSectors;
  const originalOpenTriageRecord=window.openTriageRecord;
  const originalShowTriage=window.showTriage;

  function norm(v){
    try{return typeof normalizeAnswer==='function'?normalizeAnswer(v):String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();}
    catch(_){return String(v||'').toLowerCase().trim();}
  }
  function normUnit(v){
    try{if(typeof normalizePortalUnit==='function'){const n=normalizePortalUnit(v);if(n)return n;}}catch(_){}
    const x=norm(v);
    if(/filial|linhares|seta es/.test(x))return 'filial';
    if(/todas|ambas/.test(x))return 'todas';
    if(/matriz|sao bento|seta sc/.test(x))return 'matriz';
    return '';
  }
  function userUnits(u){
    const raw=Array.isArray(u?.accessUnits)?u.accessUnits:[];
    const out=[];
    const add=v=>{const n=normUnit(v);if(n==='todas'){if(!out.includes('matriz'))out.push('matriz');if(!out.includes('filial'))out.push('filial');}else if(n&&!out.includes(n))out.push(n)};
    raw.forEach(add);
    if(!out.length)add(u?.unit||u?.unidade||'');
    return out;
  }
  function currentUnit(){
    const modal=normUnit(document.getElementById('triageRoUnit')?.value||'');
    if(modal&&modal!=='todas')return modal;
    try{
      const s=typeof getSession==='function'?(getSession()||{}):{};
      if(String(s.role||'').toLowerCase()==='quality')return 'filial';
      const u=normUnit(s.unit||'');
      if(u&&u!=='todas')return u;
    }catch(_){}
    return 'matriz';
  }
  function approved(u){
    const st=norm(u?.approvalStatus||'approved');
    const state=norm(u?.status||'');
    return !!String(u?.email||'').trim() && u?.active!==false &&
      !['pending','rejected','inactive','disabled','recusado','inativo'].includes(st) &&
      !['inactive','inativo'].includes(state);
  }
  function sectorsForUser(u,unit){
    const out=[];
    const add=v=>{v=String(v||'').trim();if(v&&!out.some(x=>norm(x)===norm(v)))out.push(v)};
    if(userUnits(u).includes(unit))add(u?.sector||u?.setor||'');
    (Array.isArray(u?.sectorMemberships)?u.sectorMemberships:[]).forEach(m=>{
      const mu=normUnit(m?.unit||'');
      if(mu===unit||mu==='todas')add(m?.sector||'');
    });
    return out;
  }

  function ignoreSectorReplicationUserV42(u){
    const email=String(u?.email||'').trim().toLowerCase();
    const personId=String(u?.personId||'').trim().toLowerCase();
    return email==='leonardo@setaembalagens.com.br' ||
      personId==='69d13e9d-bc82-476c-8e33-10404aa21582';
  }
  // V43: diretório compartilhado é informação global. Nunca usa localStorage
  // como fonte para setores/pessoas compartilhados. Apenas memória da sessão.
  function readCache(){ return null; }
  function writeCache(x){ /* sem persistência local por regra global do Núcleo */ }
  function directory(unit){
    unit=normUnit(unit)||currentUnit();
    const live=window.__nucleoSharedDirectoryV31;
    if(live&&live.unit===unit)return live;
    return {unit,users:[],sectors:[]};
  }
  function buildDirectory(allUsers,unit){
    const users=(Array.isArray(allUsers)?allUsers:[]).filter(approved).filter(u=>userUnits(u).includes(unit)||sectorsForUser(u,unit).length);
    const sectors=[];
    const add=v=>{v=String(v||'').trim();if(v&&!sectors.some(x=>norm(x)===norm(v)))sectors.push(v)};
    users.forEach(u=>{
      // V42: Leonardo continua no diretório e mantém todos os acessos,
      // mas seu cadastro global de gestão não pode publicar setores da Matriz na Filial.
      if(ignoreSectorReplicationUserV42(u))return;
      sectorsForUser(u,unit).forEach(add);
    });
    return {unit,users,sectors:sectors.sort((a,b)=>a.localeCompare(b,'pt-BR')),loadedAt:new Date().toISOString()};
  }
  function usersBySectorV31(sector){
    const unit=currentUnit(),key=norm(sector),dir=directory(unit);
    let users=(dir.users||[]).filter(u=>sectorsForUser(u,unit).some(s=>norm(s)===key));
    if(!users.length&&typeof originalUsersBySector==='function'){
      try{users=originalUsersBySector(sector)||[]}catch(_){}
    }
    const map=new Map();
    users.forEach(u=>{const k=String(u?.personId||u?.email||u?.name||'').trim().toLowerCase();if(k)map.set(k,u)});
    return [...map.values()].sort((a,b)=>String(a?.name||a?.email||'').localeCompare(String(b?.name||b?.email||''),'pt-BR'));
  }
  function getConfiguredSectorsV31(unit){
    const target=normUnit(unit)||currentUnit();
    const out=[];
    const add=v=>{v=String(v||'').trim();if(v&&!out.some(x=>norm(x)===norm(v)))out.push(v)};
    try{(typeof originalGetConfiguredSectors==='function'?(originalGetConfiguredSectors(unit)||[]):[]).forEach(add)}catch(_){}
    (directory(target).sectors||[]).forEach(add);
    return out.sort((a,b)=>a.localeCompare(b,'pt-BR'));
  }
  function refreshUi(unit){
    try{
      const picker=document.getElementById('triageSectorPicker');
      if(picker){
        const current=picker.value||'';
        const sectors=getConfiguredSectorsV31(unit);
        picker.innerHTML='<option value="">Selecione um setor...</option>'+sectors.map(sec=>'<option value="'+(typeof escapeHtml==='function'?escapeHtml(sec):sec)+'">'+(typeof escapeHtml==='function'?escapeHtml(sec):sec)+'</option>').join('');
        const match=sectors.find(s=>norm(s)===norm(current));if(match)picker.value=match;
      }
      if(typeof refreshTriageResponsibleUsers==='function')refreshTriageResponsibleUsers();
      if(typeof populateTriageSectors==='function')populateTriageSectors();
    }catch(e){console.warn('[NÚCLEO V31] atualizar triagem',e)}
  }
  let inflight=null;
  async function loadDirectory(force=false){
    const unit=currentUnit();
    if(!force){const cached=directory(unit);if((cached.users||[]).length){refreshUi(unit);return cached;}}
    if(inflight)return inflight;
    inflight=(async()=>{
      try{
        if(typeof portalJsonp!=='function')throw new Error('Conexão com a base central indisponível.');
        const res=await portalJsonp({acao:'portal_pending_users'},30000);
        if(!res?.sucesso)throw new Error(res?.erro||'Base de usuários não retornada.');
        const data=buildDirectory(res.users||[],unit);
        window.__nucleoSharedDirectoryV31=data;
        writeCache(data);
        refreshUi(unit);
        return data;
      }catch(e){
        console.error('[NÚCLEO V31] falha ao carregar usuários compartilhados',e);
        return directory(unit);
      }finally{inflight=null}
    })();
    return inflight;
  }

  window.usersBySector=usersBySectorV31;
  window.getConfiguredSectors=getConfiguredSectorsV31;
  window.nucleoLoadSharedDirectoryV31=loadDirectory;

  try{
    localStorage.removeItem('nucleo-shared-directory-v31');
    localStorage.removeItem('nucleo-shared-directory-v42');
  }catch(_){}

  if(typeof originalOpenTriageRecord==='function'){
    window.openTriageRecord=function(){
      const result=originalOpenTriageRecord.apply(this,arguments);
      setTimeout(()=>loadDirectory(true),0);
      return result;
    };
  }
  if(typeof originalShowTriage==='function'){
    window.showTriage=function(){
      const result=originalShowTriage.apply(this,arguments);
      setTimeout(()=>loadDirectory(false),0);
      return result;
    };
  }
  document.addEventListener('change',ev=>{if(ev.target&&ev.target.id==='triageRoUnit')loadDirectory(true)},true);
  setTimeout(()=>loadDirectory(true),300);
  window.addEventListener('load',()=>setTimeout(()=>loadDirectory(true),0),{once:true});
  console.info('[NÚCLEO] Matriz/Filial V43 central, sem cache local de setores compartilhados.');
})();

/* NÚCLEO | PRESERVA RÉPLICA FILIAL NO MERGE DE USUÁRIOS V35
   Evita que portal_pending_users sobrescreva uma réplica operacional da Filial
   com o cadastro físico principal da Matriz pelo mesmo e-mail/personId.
*/
(function(){
  'use strict';
  if(window.__nucleoPreserveFilialReplicaV35)return;
  window.__nucleoPreserveFilialReplicaV35=true;

  function normUnit(v){
    try{
      if(typeof explicitPortalUnit==='function'){
        const n=explicitPortalUnit(v);
        if(n)return n;
      }
      if(typeof normalizePortalUnit==='function'){
        const n=normalizePortalUnit(v);
        if(n)return n;
      }
    }catch(_){}
    const x=String(v||'').toLowerCase();
    if(/filial|linhares|seta es/.test(x))return 'filial';
    if(/matriz|sao bento|são bento|seta sc/.test(x))return 'matriz';
    return '';
  }

  function keyOf(u){
    return String(u?.personId||u?.email||u?.name||'').trim().toLowerCase();
  }

  function isFilialReplica(u){
    return !!u && (
      u.__unitReplica===true ||
      String(u.__replicaUnit||'').toLowerCase()==='filial' ||
      (String(u.__replicaKey||'').toLowerCase().endsWith('@filial') && normUnit(u.unit||u.unidade)==='filial')
    );
  }

  function mergeKeepingReplica(existing,remote){
    if(!existing)return {...remote};
    if(!remote)return {...existing};

    const qualityFilial=(function(){
      try{
        const s=typeof getSession==='function'?(getSession()||{}):{};
        return String(s.role||'').toLowerCase()==='quality' && normUnit(s.unit||'filial')==='filial';
      }catch(_){return false}
    })();

    if(qualityFilial && isFilialReplica(existing) && normUnit(existing.unit||existing.unidade)==='filial'){
      return {
        ...existing,
        ...remote,
        personId: existing.personId || remote.personId || '',
        name: existing.name || remote.name || '',
        email: existing.email || remote.email || '',
        unit: existing.unit,
        unidade: existing.unidade || existing.unit,
        sector: existing.sector,
        role: existing.role,
        managedSectors: Array.isArray(existing.managedSectors)?existing.managedSectors:(remote.managedSectors||[]),
        accessUnits: Array.isArray(existing.accessUnits)?existing.accessUnits:(remote.accessUnits||[]),
        sectorMemberships: Array.isArray(existing.sectorMemberships)?existing.sectorMemberships:(remote.sectorMemberships||[]),
        __unitReplica: true,
        __sourceUnit: existing.__sourceUnit || remote.unit || remote.unidade || '',
        __replicaUnit: 'filial',
        __replicaKey: existing.__replicaKey || ((existing.personId||existing.email||existing.name||'')+'@filial')
      };
    }

    return {...existing,...remote};
  }

  window.nucleoMergeUserKeepingFilialReplicaV35=mergeKeepingReplica;

  if(typeof window.refreshPendingRegistrations==='function'){
    window.refreshPendingRegistrations=async function(showMessage=false){
      if(typeof isAdmin==='function' && !isAdmin())return false;
      const status=document.getElementById('pendingRegistrationStatus');
      if(status)status.textContent='Buscando cadastros...';

      if(typeof portalBackendEnabled==='function' && !portalBackendEnabled()){
        if(typeof renderOperationalUsers==='function')renderOperationalUsers();
        if(status)status.textContent='Base central não configurada.';
        if(showMessage)alert('Configure a URL do Apps Script para receber cadastros feitos em outros navegadores.');
        return false;
      }

      try{
        const res=await portalJsonp({acao:'portal_pending_users'});
        if(res?.sucesso===false)throw new Error(res.erro||'Falha ao carregar cadastros.');

        const remoteRaw=Array.isArray(res.users)?res.users:[];
        const remote=typeof nucleoApplyUserLoginStatusGuards==='function'
          ? nucleoApplyUserLoginStatusGuards(remoteRaw)
          : remoteRaw;

        let local=[];
        try{
          const parsed=JSON.parse(localStorage.getItem(typeof USERS_KEY!=='undefined'?USERS_KEY:'ro-pdca-users-v4')||'[]');
          if(Array.isArray(parsed))local=parsed;
        }catch(_){}

        const map=new Map();
        local.forEach(u=>{const k=keyOf(u);if(k)map.set(k,u)});
        remote.forEach(u=>{
          const k=keyOf(u);if(!k)return;
          map.set(k,mergeKeepingReplica(map.get(k),u));
        });

        const merged=[...map.values()];
        localStorage.setItem(typeof USERS_KEY!=='undefined'?USERS_KEY:'ro-pdca-users-v4',JSON.stringify(merged));
        if(typeof renderOperationalUsers==='function')renderOperationalUsers();

        const pending=merged.filter(u=>{
          try{return !(typeof nucleoPersonPermissions==='function'&&nucleoPersonPermissions(u).sgq)&&u.approvalStatus==='pending'}catch(_){return u.approvalStatus==='pending'}
        }).length;
        if(status)status.textContent=pending?pending+' cadastro(s) aguardando aprovação.':'Nenhum cadastro pendente.';
        try{refreshNotificationBell()}catch(_){}
        try{refreshMenuNotificationBadges()}catch(_){}
        try{renderPendingHubNotifications()}catch(_){}
        if(showMessage&&!pending)alert('Nenhum cadastro pendente foi encontrado na base central.');
        return true;
      }catch(e){
        try{renderOperationalUsers()}catch(_){}
        if(status)status.textContent='Erro ao buscar pendências.';
        if(showMessage)alert('Não foi possível buscar cadastros pendentes: '+(e.message||e));
        return false;
      }
    };
  }

  console.info('[NÚCLEO] Preservação de réplica da Filial V35 ativa.');
})();

/* NÚCLEO | SETORES COMPARTILHADOS CENTRAIS V41
   Os nomes de setores válidos para Matriz/Filial vêm do portal_public_config.
   Não usa localStorage como fonte de autoridade e não altera escopo de R.O.
*/
(function(){
  'use strict';
  if(window.__nucleoSharedSectorNamesV41)return;
  window.__nucleoSharedSectorNamesV41=true;

  let central={matriz:[],filial:[]};

  function norm(v){
    try{
      return typeof normalizeAnswer==='function'
        ? normalizeAnswer(v)
        : String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
    }catch(_){return String(v||'').toLowerCase().trim();}
  }
  function unitKey(v){
    try{
      if(typeof normalizePortalUnit==='function'){
        const n=normalizePortalUnit(v);
        if(n==='filial'||n==='matriz')return n;
      }
    }catch(_){}
    return /filial|linhares|seta es/i.test(String(v||''))?'filial':'matriz';
  }
  function list(v){
    const raw=Array.isArray(v)?v:String(v||'').split(/[\n,;]+/);
    const out=[];
    raw.forEach(x=>{
      x=String(x||'').trim();
      if(x&&!out.some(y=>norm(y)===norm(x)))out.push(x);
    });
    return out;
  }
  function merge(){
    const out=[];
    Array.from(arguments).flat().forEach(x=>{
      x=String(x||'').trim();
      if(x&&!out.some(y=>norm(y)===norm(x)))out.push(x);
    });
    return out.sort((a,b)=>a.localeCompare(b,'pt-BR'));
  }

  function consumeConfig(data){
    const cfg=data?.config||data||{};
    const byName=cfg.sectorNamesByUnit||{};
    const byList=cfg.sectorListsByUnit||{};
    central={
      matriz:merge(list(byName.matriz),list(byList.matriz)),
      filial:merge(list(byName.filial),list(byList.filial))
    };
    window.__nucleoCentralSectorNamesV41=central;
    refreshAll();
    return central;
  }

  async function load(){
    try{
      if(window.nucleoGlobalApiReady&&typeof window.nucleoGlobalApiReady.then==='function'){
        try{await window.nucleoGlobalApiReady}catch(_){}
      }
      if(typeof portalJsonp!=='function')return central;
      const res=await portalJsonp({acao:'portal_public_config'},30000);
      if(res?.sucesso)consumeConfig(res);
    }catch(e){
      console.warn('[NÚCLEO V41] Não foi possível carregar os setores compartilhados centrais.',e);
    }
    return central;
  }

  const originalConfigured=window.getConfiguredSectors;
  if(typeof originalConfigured==='function'){
    window.getConfiguredSectors=function(unit){
      const key=unitKey(unit||(
        typeof adminScopeUnit==='function'?adminScopeUnit():'matriz'
      ));
      let own=[];
      try{own=originalConfigured.apply(this,arguments)||[]}catch(_){}
      return merge(own,central[key]||[]);
    };
  }

  const originalPublic=window.nucleoPublicLoginSectors;
  if(typeof originalPublic==='function'){
    window.nucleoPublicLoginSectors=function(unit){
      const key=unitKey(unit);
      let own=[];
      try{own=originalPublic.apply(this,arguments)||[]}catch(_){}
      return merge(own,central[key]||[]);
    };
  }else{
    // Compatibilidade para builds em que a função pública só é criada depois.
    let tries=0;
    const timer=setInterval(()=>{
      if(typeof window.nucleoPublicLoginSectors==='function'&&!window.nucleoPublicLoginSectors.__v41){
        const fn=window.nucleoPublicLoginSectors;
        const wrapped=function(unit){
          const key=unitKey(unit);
          let own=[];
          try{own=fn.apply(this,arguments)||[]}catch(_){}
          return merge(own,central[key]||[]);
        };
        wrapped.__v41=true;
        window.nucleoPublicLoginSectors=wrapped;
        clearInterval(timer);
      }
      if(++tries>80)clearInterval(timer);
    },100);
  }

  function safeFill(id){
    try{
      if(typeof fillSectorSelect==='function'&&document.getElementById(id))fillSectorSelect(id);
    }catch(_){}
  }
  function refreshAll(){
    try{safeFill('loginSector')}catch(_){}
    try{safeFill('registerSector')}catch(_){}
    try{safeFill('newUserSector')}catch(_){}
    try{
      if(typeof refreshSectorSelectors==='function')refreshSectorSelectors();
    }catch(_){}
    try{
      if(typeof populateTriageSectors==='function')populateTriageSectors();
    }catch(_){}
  }

  document.addEventListener('change',function(ev){
    const id=ev?.target?.id;
    if(id==='loginUnit')setTimeout(()=>safeFill('loginSector'),0);
    if(id==='registerUnit')setTimeout(()=>safeFill('registerSector'),0);
    if(id==='newUserUnit')setTimeout(()=>safeFill('newUserSector'),0);
    if(id==='triageRoUnit')setTimeout(refreshAll,0);
  },true);

  window.nucleoReloadSharedSectorNamesV41=load;

  setTimeout(load,200);
  window.addEventListener('load',()=>setTimeout(load,0),{once:true});
  console.info('[NÚCLEO] Setores compartilhados centrais V41 ativos.');
})();
