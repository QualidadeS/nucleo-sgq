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

  function testApiUrl(){
    return location.pathname.split('/')[1] === 'nucleo-sgq-teste'
      ? validApiUrl(window.NUCLEO_SISTEMA_TESTE_API_URL)
      : '';
  }

  function bootstrapApiUrl(){
    const test = testApiUrl();
    if(test)return test;
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
    const test = testApiUrl();
    if(test){globalApiUrl=test;return test;}
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
      const action=String(params?.acao||'').toLowerCase();
      const publicAction=['portal_public_config','portal_login','portal_login_jsonp','portal_auth_v2','portal_register_user'].includes(action);
      const token=publicAction?'':(params?.token||window.getSession?.()?.authToken||'');
      const sessionBase=!testApiUrl()&&token&&window.nucleoSessionApiBase?.(token);
      if(sessionBase)return originalPortalJsonp.call(this,params,timeoutMs,sessionBase);
      return resolveGlobalApiUrl(false).then(base=>{
        if(token&&window.getSession?.()?.authToken!==token){
          throw new Error('A sessão mudou durante a conexão com a API.');
        }
        return originalPortalJsonp.call(this,params,timeoutMs,base);
      });
    };
  }

  const originalGetSaved=window.getSavedIntegrationSettings;
  window.getSavedIntegrationSettings=function(){
    let previous={};
    try{previous=typeof originalGetSaved==='function'?(originalGetSaved()||{}):{};}catch(_){}
    return {...previous,apiUrl:window.portalApiBase()};
  };

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

  // Lê o formulário para prévia. Só uma confirmação central altera a configuração.
  window.saveIntegrationSettings=function(silent=false){
    if(typeof window.requireIntegrationUnlock==='function'&&!window.requireIntegrationUnlock())return false;
    const current=window.getSavedIntegrationSettings();
    const next={
      apiUrl:window.portalApiBase(),
      apiKey:String(document.getElementById('apiKey')?.value??current.apiKey??'').trim(),
      autoSync:document.getElementById('autoSync')?.value||current.autoSync||'0',
      roSyncPeriod:document.getElementById('roSyncPeriod')?.value||current.roSyncPeriod||'all',
      roSyncDateFrom:document.getElementById('roSyncDateFrom')?.value??current.roSyncDateFrom??'',
      roSyncDateTo:''
    };
    if(next.roSyncPeriod==='custom'&&!next.roSyncDateFrom){
      if(!silent)alert('Informe a data inicial da busca.');
      return false;
    }
    if(next.roSyncPeriod!=='custom')next.roSyncDateFrom='';
    return next;
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

    const session=window.getSession?.();
    const token=session?.authToken;
    if(!token){
      alert('Entre com o login do SGQ para salvar a integração.');
      return false;
    }
    const draft=window.saveIntegrationSettings();
    if(!draft)return false;
    const saveButton=document.getElementById('saveIntegrationButton');
    if(saveButton?.disabled)return false;
    if(saveButton)saveButton.disabled=true;
    if(st){
      st.classList.remove('hidden');
      st.textContent='Confirmando a integração na base central…';
    }
    try{
      await probeApi(candidate);
      const currentBase=await resolveGlobalApiUrl(true);
      if(typeof originalPortalJsonp!=='function')throw new Error('Conexão central indisponível.');

      // Busca a configuração CENTRAL atual. localStorage não participa da decisão.
      const request=params=>{
        if(window.getSession?.()?.authToken!==token)throw new Error('A sessão mudou. Entre novamente para salvar a integração.');
        return originalPortalJsonp({...params,token},60000,currentBase);
      };
      let centralConfig=await window.readNucleoSavedIntegration(request);
      if(!centralConfig){
        const loaded=await request({acao:'portal_load'});
        if(!loaded?.sucesso)throw new Error(loaded?.erro||'A base central não respondeu à leitura autenticada da configuração.');
        centralConfig=loaded.dados?.config;
      }
      if(!centralConfig||typeof centralConfig!=='object'||Array.isArray(centralConfig)){
        throw new Error('A API respondeu sem a configuração administrativa. Entre novamente com o login do SGQ e tente salvar.');
      }

      const nextConfig={
        ...centralConfig,
        ...draft,
        // A gravação usa esta chave física e a releitura procura o mesmo ID no JSON.
        id:'config-central',
        apiUrl:candidate,
        __savedAt:new Date().toISOString()
      };

      // Salva no backend global ATUAL. Assim a cadeia bootstrap -> atual -> nova
      // é comum a todos os dispositivos e não depende de estado local.
      if(window.getSession?.()?.authToken!==token)throw new Error('A sessão mudou antes do salvamento da integração.');
      const saved=await originalPortalJsonp({
        acao:'portal_save_config',
        token,
        dados:JSON.stringify(nextConfig),
        ator:session.name||'SGQ'
      },60000,currentBase,{integrationReadToken:token});
      if(window.getSession?.()?.authToken!==token)throw new Error('A sessão mudou durante o salvamento da integração.');
      if(!saved?.sucesso)throw new Error(saved?.erro||'A base central não confirmou a integração.');

      if(currentBase===candidate){
        const confirmed=await window.readNucleoSavedIntegration(request);
        if(window.getSession?.()?.authToken!==token)throw new Error('A sessão mudou antes da confirmação da integração.');
        if(String(confirmed?.roSyncPeriod??'')!==draft.roSyncPeriod
          || (draft.roSyncPeriod==='custom'&&String(confirmed?.roSyncDateFrom??'')!==draft.roSyncDateFrom)){
          throw new Error('A API aceitou a gravação, mas a releitura do registro config-central não confirmou o período escolhido.');
        }
        window.applyNucleoCentralConfig(confirmed);
        const formPeriod=document.getElementById('roSyncPeriod')?.value;
        const formFrom=document.getElementById('roSyncDateFrom')?.value;
        if(formPeriod===draft.roSyncPeriod&&(formPeriod!=='custom'||formFrom===draft.roSyncDateFrom)){
          nucleoRoSyncPeriodDirty=false;
        }
      }

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

      if(st)st.textContent='Período salvo na base central. Clique em Sincronizar para atualizar as R.O.s.';
      alert('Período salvo. Clique em Sincronizar para buscar as R.O.s no intervalo escolhido.');
      return true;
    }catch(e){
      if(st){
        st.classList.remove('hidden');
        st.textContent='O salvamento da integração não foi confirmado.';
      }
      alert('Não foi possível confirmar a integração: '+(e?.message||e));
      return false;
    }finally{
      if(saveButton)saveButton.disabled=false;
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
      // V44: para a Filial, a lista central é a autoridade.
      // Não mistura setores antigos/locais, pois isso reintroduzia managedSectors
      // globais do Leonardo e outros resíduos de cache/configuração.
      if(key==='filial' && Array.isArray(central.filial) && central.filial.length){
        return central.filial.slice();
      }
      let own=[];
      try{own=originalConfigured.apply(this,arguments)||[]}catch(_){}
      return merge(own,central[key]||[]);
    };
  }

  const originalPublic=window.nucleoPublicLoginSectors;
  if(typeof originalPublic==='function'){
    window.nucleoPublicLoginSectors=function(unit){
      const key=unitKey(unit);
      if(key==='filial' && Array.isArray(central.filial) && central.filial.length){
        return central.filial.slice();
      }
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
          if(key==='filial' && Array.isArray(central.filial) && central.filial.length){
            return central.filial.slice();
          }
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

  // V44: proteção final contra qualquer função antiga que volte a acrescentar
  // setores de gestão global na Filial. A lista central é a única fonte válida.
  function filialSession(){
    try{
      const s=typeof getSession==='function'?(getSession()||{}):{};
      return String(s.role||'').toLowerCase()==='quality' || unitKey(s.unit||'')==='filial';
    }catch(_){return false}
  }
  function installTriageGuard(){
    if(typeof window.getConfiguredSectorsForTriage!=='function')return false;
    if(window.getConfiguredSectorsForTriage.__nucleoV44)return true;
    const old=window.getConfiguredSectorsForTriage;
    const wrapped=function(){
      if(filialSession() && central.filial.length)return central.filial.slice();
      return old.apply(this,arguments);
    };
    wrapped.__nucleoV44=true;
    window.getConfiguredSectorsForTriage=wrapped;
    return true;
  }
  function cleanFilialSectorSelects(){
    if(!filialSession()||!central.filial.length)return;
    const allowed=new Set(central.filial.map(norm));
    ['operationalUserSector','triageSectorPicker','newUserSector','registerSector','loginSector','userRegistrationEditSector'].forEach(id=>{
      const el=document.getElementById(id);
      if(!el||el.tagName!=='SELECT')return;
      [...el.options].forEach(opt=>{
        const v=String(opt.value||'').trim();
        if(v && !allowed.has(norm(v)))opt.remove();
      });
    });
  }
  const guardTimer=setInterval(()=>{
    installTriageGuard();
    cleanFilialSectorSelects();
  },250);
  setTimeout(()=>clearInterval(guardTimer),15000);
  const v44Observer=new MutationObserver(()=>cleanFilialSectorSelects());
  v44Observer.observe(document.documentElement,{childList:true,subtree:true});

  setTimeout(load,200);
  window.addEventListener('load',()=>setTimeout(load,0),{once:true});
  console.info('[NÚCLEO] Setores compartilhados centrais V41 ativos.');
})();


/* NÚCLEO | LÍDER PDCAs + SETORES FILIAL SEM LEONARDO V46
   1) Gestor enxerga os PDCAs das R.O.s que ele realmente pode consultar.
   2) A lista de setores da Filial não usa managedSectors do Leonardo como fonte.
*/
(function(){
  'use strict';
  if(window.__nucleoLeaderPdcaAndFilialSectorV46)return;
  window.__nucleoLeaderPdcaAndFilialSectorV46=true;

  const LEONARDO_EMAIL='leonardo@setaembalagens.com.br';
  const LEONARDO_PERSON='69d13e9d-bc82-476c-8e33-10404aa21582';

  function norm(v){
    try{return typeof normalizeAnswer==='function'?normalizeAnswer(v):String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();}
    catch(_){return String(v||'').toLowerCase().trim();}
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
  function uniq(list){
    const out=[];
    (list||[]).forEach(v=>{
      v=String(v||'').trim();
      if(v&&!out.some(x=>norm(x)===norm(v)))out.push(v);
    });
    return out.sort((a,b)=>a.localeCompare(b,'pt-BR'));
  }
  function isLeonardo(u){
    return String(u?.email||'').trim().toLowerCase()===LEONARDO_EMAIL ||
      String(u?.personId||'').trim().toLowerCase()===LEONARDO_PERSON;
  }
  function userHasFilialEvidence(u,sector){
    if(!u||isLeonardo(u))return false;
    const wanted=norm(sector);
    const own=norm(u.sector||u.setor||'');
    let units=[];
    if(Array.isArray(u.accessUnits))units=u.accessUnits.map(unitKey);
    if(!units.length)units=[unitKey(u.unit||u.unidade||'')];
    if(own===wanted&&units.includes('filial'))return true;
    return (Array.isArray(u.sectorMemberships)?u.sectorMemberships:[]).some(m=>
      unitKey(m?.unit||'')==='filial' && norm(m?.sector||'')===wanted
    );
  }
  function filialSectorList(){
    let central=[];
    try{
      central=Array.isArray(window.__nucleoCentralSectorNamesV41?.filial)
        ? window.__nucleoCentralSectorNamesV41.filial.slice()
        : [];
    }catch(_){}

    let users=[];
    try{users=typeof getOperationalUsers==='function'?(getOperationalUsers()||[]):[]}catch(_){}

    // Complementa apenas com vínculos REAIS da Filial. managedSectors nunca entra aqui.
    users.forEach(u=>{
      if(!u||isLeonardo(u))return;
      const sector=String(u.sector||u.setor||'').trim();
      if(sector&&userHasFilialEvidence(u,sector))central.push(sector);
      (Array.isArray(u.sectorMemberships)?u.sectorMemberships:[]).forEach(m=>{
        if(unitKey(m?.unit||'')==='filial')central.push(m?.sector||'');
      });
    });

    // Se algum setor contaminado ainda vier do cadastro antigo da Filial,
    // remove-o quando ele só é sustentado pelos managedSectors do Leonardo.
    const leonardo=users.find(isLeonardo);
    const leoManaged=uniq([...(leonardo?.managedSectors||[])]);
    central=uniq(central).filter(sec=>{
      const fromLeonardo=leoManaged.some(x=>norm(x)===norm(sec));
      if(!fromLeonardo)return true;
      return users.some(u=>userHasFilialEvidence(u,sec));
    });

    return uniq(central);
  }

  const originalGetConfigured=window.getConfiguredSectors;
  window.getConfiguredSectors=function(unit){
    const target=unitKey(unit||(
      typeof adminScopeUnit==='function'?adminScopeUnit():(getSession?.()?.unit||'')
    ));
    if(target==='filial')return filialSectorList();
    try{return typeof originalGetConfigured==='function'?(originalGetConfigured.apply(this,arguments)||[]):[]}
    catch(_){return []}
  };

  const originalTriage=window.getConfiguredSectorsForTriage;
  window.getConfiguredSectorsForTriage=function(){
    const session=typeof getSession==='function'?(getSession()||{}):{};
    if(String(session.role||'').toLowerCase()==='quality' || unitKey(session.unit||'')==='filial'){
      return filialSectorList();
    }
    try{return typeof originalTriage==='function'?(originalTriage.apply(this,arguments)||[]):window.getConfiguredSectors()}
    catch(_){return window.getConfiguredSectors()}
  };

  const originalPublic=window.nucleoPublicLoginSectors;
  if(typeof originalPublic==='function'){
    window.nucleoPublicLoginSectors=function(unit){
      if(unitKey(unit)==='filial')return filialSectorList();
      return originalPublic.apply(this,arguments)||[];
    };
  }

  function roForPdca(p){
    const key=String(p?.ro||p?.roId||p?.numeroRo||'').trim();
    if(!key)return p?.__sourceRo||null;
    let all=[];
    try{all=typeof getAllRoRecords==='function'?(getAllRoRecords()||[]):[]}catch(_){}
    return p?.__sourceRo || all.find(r=>String(r?.numero||r?.id||r?.codigo||'').trim()===key) || null;
  }

  // Regra única: quem pode consultar a R.O. pode consultar o PDCA vinculado.
  window.canViewPdca=function(p){
    if(!p)return false;
    try{
      if(typeof isAdmin==='function'&&isAdmin())return true;
    }catch(_){}

    const ro=roForPdca(p);
    if(ro){
      try{
        const map=typeof getSavedTriageMap==='function'?getSavedTriageMap():null;
        if(typeof canViewRO==='function'&&canViewRO(ro,map))return true;
      }catch(_){}
    }

    // Compatibilidade: próprio setor ou R.O. aberta pelo usuário.
    try{if(typeof sameSector==='function'&&sameSector(p.setor))return true}catch(_){}
    try{if(ro&&typeof wasRoSubmittedByCurrentUser==='function'&&wasRoSubmittedByCurrentUser(ro))return true}catch(_){}
    return false;
  };

  function claimantFor(p,ro){
    try{
      const u=ro&&typeof resolveRoClaimant==='function'?resolveRoClaimant(ro):null;
      if(u&&typeof personDisplayName==='function')return personDisplayName(u)||'—';
      if(u)return String(u.name||u.nome||u.email||'—');
    }catch(_){}
    return String(
      p?.reclamante||p?.claimantName||ro?.reclamante||ro?.solicitante||
      (typeof roRegistrantName==='function'&&ro?roRegistrantName(ro):'')||'—'
    ).trim()||'—';
  }
  function companyFor(p,ro){
    return String(
      p?.cliente||p?.empresa||p?.company||
      ro?.cliente||ro?.empresa||ro?.razaoSocial||
      ro?.raw?.Cliente||ro?.raw?.['Razão social']||ro?.raw?.['Razao social']||'—'
    ).trim()||'—';
  }
  function receivedWhen(p){
    const raw=p?.sentAt||p?.envio||'';
    if(!raw)return '—';
    const d=new Date(raw);
    return Number.isNaN(d.getTime())?String(raw):d.toLocaleString('pt-BR');
  }
  function pdcaStatus(p){
    try{
      if(typeof nucleoPdcaDelivery==='function'&&nucleoPdcaDelivery(p))return 'Encerrada';
    }catch(_){}
    return String(p?.status||p?.__displayStatus||'Respondido').trim()||'Respondido';
  }

  window.nucleoLeaderOpenPdcaPdfV46=async function(id){
    let p=null;
    try{p=typeof findSentPdcaById==='function'?findSentPdcaById(id):null}catch(_){}
    if(!p){alert('PDCA não encontrado.');return}
    if(!window.canViewPdca(p)){alert('PDCA não encontrado ou indisponível.');return}

    // PDF/modelo oficial quando disponível.
    try{
      if(typeof nucleoSystemFormat==='function' &&
         nucleoSystemFormat('pdca',typeof explicitRecordUnit==='function'?explicitRecordUnit(p):'')?.design &&
         typeof nucleoPdcaDownloadModelPdf==='function'){
        return await nucleoPdcaDownloadModelPdf(p,true);
      }
    }catch(_){}

    // PDF anexado/Drive.
    const direct=String(p.pdfUrl||p.fileUrl||p.driveUrl||p.webViewLink||'').trim();
    if(/^https?:\/\//i.test(direct)){
      window.open(direct,'_blank','noopener');
      return;
    }

    // Fallback: abre o PDCA e usa o gerador existente.
    try{
      window.currentReportPdca=p;
      window.currentPrintPdca=p;
      if(typeof downloadCurrentPdcaPdf==='function')return await downloadCurrentPdcaPdf();
    }catch(e){
      console.error('[NÚCLEO V46 PDF]',e);
    }
    if(typeof openPdcaReport==='function')openPdcaReport(id);
  };

  window.renderSentPdcas=function(){
    try{if(typeof refreshPdcaSidebarBadge==='function')refreshPdcaSidebarBadge()}catch(_){}

    const q=String(document.getElementById('sentSearch')?.value||'').toLowerCase().trim();
    const sf=document.getElementById('sentStatusFilter')?.value||'todos';

    let data=[];
    try{
      data=typeof nucleoReceivedPdcaDisplayData==='function'
        ? (nucleoReceivedPdcaDisplayData()||[])
        : (typeof getSentPdcas==='function'?(getSentPdcas()||[]):[]);
    }catch(_){data=[]}

    // SGQ/Qualidade seguem o escopo normal; líder/operacional usa a mesma autorização da R.O.
    if(!(typeof isAdmin==='function'&&isAdmin())){
      data=data.filter(p=>window.canViewPdca(p));
    }

    let rows=data.map(p=>{
      const ro=roForPdca(p);
      return {
        p,ro,
        claimant:claimantFor(p,ro),
        company:companyFor(p,ro)
      };
    }).filter(x=>{
      const hay=[
        x.p?.id,x.p?.ro,x.p?.responsavel,x.p?.setor,
        x.claimant,x.company
      ].join(' ').toLowerCase();
      return (!q||hay.includes(q))&&(sf==='todos'||String(x.p?.status||'')===sf);
    });

    // Histórico/pêndencias continua valendo para SGQ. Para líder mostra todos os PDCAs permitidos.
    let lifecycle='all';
    try{
      lifecycle=(typeof isAdmin==='function'&&isAdmin())
        ? (document.getElementById('sentLifecycleFilter')?.value||'active')
        : 'all';
      if(typeof nucleoRenderPdcaLifecycle==='function')nucleoRenderPdcaLifecycle(data,lifecycle);
    }catch(_){}
    if(lifecycle!=='all'&&typeof nucleoPdcaDelivery==='function'){
      rows=rows.filter(({p})=>(lifecycle==='history')===!!nucleoPdcaDelivery(p));
    }

    const body=document.getElementById('sentRows');
    if(!body)return;

    // Ajusta cabeçalho da tela para a informação que o líder precisa.
    const table=body.closest('table');
    const head=table?.querySelector('thead tr');
    if(head){
      head.innerHTML='<th>PDCA</th><th>R.O.</th><th>Responsável pela resposta</th><th>Reclamante</th><th>Empresa / cliente</th><th>Unidade</th><th>Recebimento</th><th>Status</th><th></th>';
    }

    body.innerHTML=rows.length?rows.map(({p,ro,claimant,company})=>{
      const id=String(p?.id||'');
      const name=String(
        p?.externalPdf&&p?.fileName?p.fileName.replace(/\.pdf$/i,''):
        (p?.__virtualReceived?'PDCA recebido':(p?.id||'PDCA'))
      );
      const unit=typeof canonicalUnitName==='function'
        ? canonicalUnitName(p?.unidade||p?.unit||ro?.unidade||'')
        : String(p?.unidade||p?.unit||ro?.unidade||'—');
      const status=pdcaStatus(p);
      const pdfButton=p?.__virtualReceived
        ? '<button class="btn secondary" type="button" onclick="event.stopPropagation();openRO(\''+
          (typeof escapeHtml==='function'?escapeHtml(p?.ro||''):String(p?.ro||''))+'\')">Ver R.O.</button>'
        : '<button class="btn primary" type="button" onclick="event.stopPropagation();nucleoLeaderOpenPdcaPdfV46(\''+
          (typeof escapeHtml==='function'?escapeHtml(id):id)+'\')">Abrir PDF</button>';
      const esc=typeof escapeHtml==='function'?escapeHtml:(v=>String(v??''));
      return '<tr class="click" onclick="'+(p?.__virtualReceived
        ? "openRO('"+esc(p?.ro||'')+"')"
        : "openPdcaReport('"+esc(id)+"')")+'">'+
        '<td><b>'+esc(name)+'</b><div class="small">'+esc(p?.setor||'')+'</div></td>'+
        '<td><b>'+esc(p?.ro||'—')+'</b></td>'+
        '<td>'+esc(p?.responsavel||'—')+'</td>'+
        '<td>'+esc(claimant)+'</td>'+
        '<td>'+esc(company)+'</td>'+
        '<td>'+esc(unit||'—')+'</td>'+
        '<td>'+esc(receivedWhen(p))+'</td>'+
        '<td><span class="badge">'+esc(status)+'</span></td>'+
        '<td class="sent-action">'+pdfButton+'</td>'+
      '</tr>';
    }).join(''):'<tr><td colspan="9" class="small">Nenhum PDCA encontrado.</td></tr>';
  };

  // Reaplica opções de setor após o snapshot da Filial.
  function refreshFilialSectorUi(){
    try{
      const s=typeof getSession==='function'?(getSession()||{}):{};
      if(String(s.role||'').toLowerCase()!=='quality'&&unitKey(s.unit||'')!=='filial')return;
      if(typeof populateTriageSectors==='function')populateTriageSectors();
      if(typeof refreshSectorSelectors==='function')refreshSectorSelectors();
    }catch(_){}
  }
  setTimeout(refreshFilialSectorUi,600);
  window.addEventListener('load',()=>setTimeout(refreshFilialSectorUi,300),{once:true});

  console.info('[NÚCLEO] V46 — líder vê PDCAs pelas R.O.s autorizadas; Filial sem managedSectors do Leonardo.');
})();


/* NÚCLEO | RESPOSTAS PDF + AÇÃO SOMENTE INTERNA + MOTIVO DECISÃO V47 */
(function(){
  'use strict';
  if(window.__nucleoSubmittedResponsesV47)return;
  window.__nucleoSubmittedResponsesV47=true;

  const esc=v=>typeof escapeHtml==='function'?escapeHtml(String(v??'')):String(v??'');

  function isMeaningful(v){
    const s=String(v??'').trim();
    return !!s && !['-','—','nao informado','não informado','n/a'].includes(s.toLowerCase());
  }

  function isInternalPdca(p){
    if(!p)return false;
    if(p.externalPdf===true)return false;
    if(p.fileId||p.pdcaFileId||p.pdfUrl||p.driveFileId||p.fileUrl||p.webViewLink){
      const a=p.answers||p.respostas||{};
      return Object.values(a).some(isMeaningful);
    }
    const a=p.answers||p.respostas||{};
    return Object.values(a).some(isMeaningful);
  }

  async function findResponsePdf(roNumber){
    try{
      const result=await portalJsonp({acao:'nucleo_drive_my_responses',ro:roNumber},60000);
      if(!result?.sucesso)return null;
      const items=Array.isArray(result.items)?result.items:[];
      if(!items.length)return null;
      return items.slice().sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')))[0]||null;
    }catch(_){
      return null;
    }
  }

  window.nucleoOpenSubmittedReturnV47=async function(numero){
    const ro=(typeof getAllRoRecords==='function'?getAllRoRecords():[])
      .find(r=>String(r.numero||r.id||r.codigo)===String(numero));
    if(!ro || (typeof wasRoSubmittedByCurrentUser==='function'&&!wasRoSubmittedByCurrentUser(ro))){
      alert('R.O. não encontrada ou indisponível.');
      return;
    }

    const p=typeof getPdcaReturnForRo==='function'?getPdcaReturnForRo(ro):null;

    // PDF anexado tem prioridade: consulta o arquivo real em vez de montar PLAN/DO/CHECK/ACT vazio.
    const file=await findResponsePdf(numero);
    if(file){
      return nucleoDriveOpenExternalPdf({
        ...file,
        id:file.id||p?.id||'',
        ro:numero,
        setor:file.sector||p?.setor||'',
        externalPdf:true
      });
    }

    if(p && isInternalPdca(p)){
      return openPdcaReport(p.id);
    }

    if(typeof openMyRoResponses==='function'){
      return openMyRoResponses(numero);
    }

    alert('Nenhum PDF ou PDCA interno foi disponibilizado para esta R.O.');
  };

  window.openComplainantPdcaReturn=function(numero){
    return window.nucleoOpenSubmittedReturnV47(numero);
  };

  window.nucleoShowDecisionReasonV47=function(numero){
    const ro=(typeof getAllRoRecords==='function'?getAllRoRecords():[])
      .find(r=>String(r.numero||r.id||r.codigo)===String(numero));
    if(!ro){
      alert('R.O. não encontrada.');
      return;
    }
    const tri=typeof getRoTriageRecord==='function'?(getRoTriageRecord(ro)||{}):{};
    const decision=String(tri.decision||'');
    const labels={
      record:'Somente para registro',
      cancelled:'Cancelada pelo SGQ',
      obsolete:'Obsoleta'
    };
    const reason=String(
      tri.note||tri.reason||tri.motivo||tri.decisionReason||
      tri.justification||tri.observacao||tri.observation||''
    ).trim();

    let overlay=document.getElementById('nucleoDecisionReasonV47');
    if(overlay)overlay.remove();
    overlay=document.createElement('div');
    overlay.id='nucleoDecisionReasonV47';
    overlay.style.cssText='position:fixed;inset:0;background:#0008;z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px';
    overlay.innerHTML=
      '<div style="background:#fff;border-radius:14px;padding:22px;width:min(680px,95vw);max-height:90vh;overflow:auto">'+
        '<div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start">'+
          '<div><div class="small">R.O. '+esc(numero)+'</div><h3 style="margin:4px 0 0">'+esc(labels[decision]||'Decisão do SGQ')+'</h3></div>'+
          '<button class="btn secondary" type="button" id="nucleoDecisionReasonCloseV47">Fechar</button>'+
        '</div>'+
        '<div class="card" style="margin-top:16px;padding:16px">'+
          '<div class="label">Motivo da decisão</div>'+
          '<p style="white-space:pre-wrap;margin:8px 0 0">'+esc(reason||'Motivo não registrado nesta ocorrência.')+'</p>'+
        '</div>'+
        (tri.triagedBy?'<p class="small">Decisão registrada por '+esc(tri.triagedBy)+(tri.triagedAt?' · '+esc(typeof formatDateTimeBR==='function'?formatDateTimeBR(tri.triagedAt):tri.triagedAt):'')+'</p>':'')+
      '</div>';
    document.body.appendChild(overlay);
    overlay.querySelector('#nucleoDecisionReasonCloseV47').onclick=()=>overlay.remove();
    overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.remove();});
  };

  window.renderMySubmittedRos=function(){
    if(typeof isAdmin==='function'&&isAdmin())return;

    const q=typeof normalizeAnswer==='function'
      ? normalizeAnswer(document.getElementById('mySubmittedSearch')?.value||'')
      : String(document.getElementById('mySubmittedSearch')?.value||'').toLowerCase();
    const filter=document.getElementById('mySubmittedStatusFilter')?.value||'all';
    const all=typeof getMySubmittedRos==='function'?getMySubmittedRos():[];

    const counts={
      total:all.length,
      waiting:all.filter(x=>x.state.code==='triage').length,
      directed:all.filter(x=>x.state.code==='directed'||x.state.code==='contest').length,
      done:all.filter(x=>x.state.code==='done').length
    };
    const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v};
    set('mySubmittedTotal',counts.total);
    set('mySubmittedWaiting',counts.waiting);
    set('mySubmittedDirected',counts.directed);
    set('mySubmittedDone',counts.done);

    const rowsData=all.filter(x=>{
      if(filter!=='all'&&x.state.code!==filter)return false;
      if(q){
        const r=x.ro;
        const hay=typeof normalizeAnswer==='function'
          ? normalizeAnswer([r.numero,r.cliente,r.assunto,r.tipoRO,r.descricao,x.state.label,x.state.sector].join(' '))
          : [r.numero,r.cliente,r.assunto,r.tipoRO,r.descricao,x.state.label,x.state.sector].join(' ').toLowerCase();
        if(!hay.includes(q))return false;
      }
      return true;
    });

    const body=document.getElementById('mySubmittedRows');
    if(!body)return;

    body.innerHTML=rowsData.length?rowsData.map(({ro,state})=>{
      const terminal=typeof submittedRoRowClass==='function'?submittedRoRowClass(ro):'';
      const p=state.returnState?.pdca||null;
      const internal=!!(p&&isInternalPdca(p));
      const hasReturn=!!p;
      const decisionButton=terminal
        ? '<button class="btn secondary" type="button" onclick="nucleoShowDecisionReasonV47(\''+esc(ro.numero||'')+'\')">Consultar motivo</button>'
        : '';

      let responseCell='';
      if(terminal){
        responseCell=decisionButton;
      }else if(hasReturn){
        responseCell='<button class="btn primary" type="button" onclick="nucleoOpenSubmittedReturnV47(\''+esc(ro.numero||'')+'\')">'+
          (internal?'Ver retorno':'Ver PDF')+
        '</button>';
      }else{
        responseCell='<span class="status-badge pending">Aguardando retorno</span>';
      }

      let actionCell='';
      if(terminal){
        actionCell='<span class="small">Não se aplica</span>';
      }else if(!hasReturn){
        actionCell='<span class="small">Ainda sem ação informada</span>';
      }else if(!internal){
        actionCell=
          '<div class="small">Sem controle interno da ação</div>';
      }else{
        const action=state.returnState.action;
        const a=p.answers||{};
        actionCell=
          '<span class="status-badge '+((action.code==='finalized'||action.code==='completed')?'answered':'pending')+'">'+esc(action.label)+'</span>'+
          '<div class="small" style="margin-top:4px">'+esc(a.p12?'Prazo: '+a.p12:'')+'</div>';
      }

      const bg=typeof nucleoDecisionForRecord==='function'
        ? (nucleoDecisionForRecord(ro,typeof getRoTriageRecord==='function'?getRoTriageRecord(ro):null)?.color||'')
        : '';

      return '<tr style="background:'+esc(bg)+'" class="'+esc(terminal)+'">'+
        '<td><b>'+esc(ro.numero||'-')+'</b></td>'+
        '<td>'+esc(ro.data||'-')+'</td>'+
        '<td>'+esc(ro.cliente||'-')+'</td>'+
        '<td>'+esc(ro.assunto||ro.tipoRO||'-')+'</td>'+
        '<td><span class="status-badge '+(terminal?'submitted-ro-terminal-badge':state.code==='done'?'answered':state.code==='contest'?'pending':'')+'">'+esc(state.label)+'</span></td>'+
        '<td>'+esc(state.sector||(terminal?'—':'Aguardando definição'))+'</td>'+
        '<td>'+responseCell+'</td>'+
        '<td>'+actionCell+'</td>'+
        '<td><button class="btn secondary" type="button" onclick="openSubmittedRoTracking(\''+esc(ro.numero||'')+'\')">Acompanhar</button></td>'+
      '</tr>';
    }).join('')
    : '<tr><td colspan="9" style="text-align:center;padding:28px;color:#667085">Nenhuma R.O. encontrada.</td></tr>';
  };

  console.info('[NÚCLEO] V47 — PDF anexado abre arquivo real; ações só para PDCA interno; motivo de decisão consultável.');
})();


/* NÚCLEO | AJUSTE VISUAL RESPOSTAS V48 */
(function(){
  'use strict';
  if(window.__nucleoSubmittedVisualV48)return;
  window.__nucleoSubmittedVisualV48=true;

  function renameConsultationHeader(){
    const body=document.getElementById('mySubmittedRows');
    const table=body?.closest('table');
    const cells=table?.querySelectorAll('thead th');
    if(cells&&cells.length){
      cells[cells.length-1].textContent='Consulta';
    }
  }

  const original=window.renderMySubmittedRos;
  if(typeof original==='function'){
    window.renderMySubmittedRos=function(){
      const result=original.apply(this,arguments);
      renameConsultationHeader();
      return result;
    };
  }

  document.addEventListener('DOMContentLoaded',()=>setTimeout(renameConsultationHeader,0));
  console.info('[NÚCLEO] V48 — ação de PDF sem selo/botão e última coluna renomeada para Consulta.');
})();

