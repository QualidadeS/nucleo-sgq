/* NÚCLEO CORE: api-sync | V3 TESTE | funções: 37 */

function portalResolveSyncWaiters_(result){
  portalBackendLastSyncResult=!!result;
  const waiters=portalBackendSyncWaiters.splice(0);
  waiters.forEach(resolve=>{try{resolve(!!result)}catch(e){}});
}

function portalWaitForCurrentSync_(){
  if(!portalBackendSyncInProgress)return Promise.resolve(!!portalBackendLastSyncResult);
  return new Promise(resolve=>{
    portalBackendSyncWaiters.push(resolve);
    // Segurança: o portal_load pode demorar bastante, mas não deve deixar
    // um chamador preso indefinidamente caso a execução seja interrompida.
    setTimeout(()=>{
      const i=portalBackendSyncWaiters.indexOf(resolve);
      if(i>=0){
        portalBackendSyncWaiters.splice(i,1);
        resolve(nucleoCentralDataConfirmed());
      }
    },370000);
  });
}

function nucleoCentralDataConfirmed(){return nucleoCentralSyncState.status==='synced';}

function nucleoCentralStatusText(){
  const st=nucleoCentralSyncState.status;
  if(st==='synced')return '● Dados atualizados';
  if(st==='syncing')return '● Atualizando base central…';
  if(st==='error')return '● Dados locais — atualização falhou';
  return '● Dados locais — aguardando confirmação';
}

function nucleoRenderCentralSyncState(){
  const pill=document.getElementById('networkStatePill');
  if(pill){
    pill.textContent=nucleoCentralStatusText();
    pill.classList.remove('central-synced','central-syncing','central-stale','offline');
    pill.classList.add(nucleoCentralSyncState.status==='synced'?'central-synced':(nucleoCentralSyncState.status==='syncing'?'central-syncing':'central-stale'));
    pill.title=nucleoCentralSyncState.message||'';
    pill.onclick=()=>{
      const when=nucleoCentralSyncState.confirmedAt?('\nÚltima confirmação: '+nucleoCentralSyncState.confirmedAt):'';
      alert((nucleoCentralSyncState.message||nucleoCentralStatusText())+when+'\n\nFonte oficial: base central do Núcleo. O cache deste dispositivo nunca substitui a base central.');
    };
  }
  const banner=document.getElementById('centralSyncBanner');
  if(banner){
    if(nucleoCentralSyncState.status==='synced'){
      banner.classList.add('hidden');
      banner.textContent='';
    }else{
      banner.classList.remove('hidden');
      banner.className='central-sync-banner '+(nucleoCentralSyncState.status==='error'?'error':'pending');
      banner.textContent=nucleoCentralSyncState.status==='error'
        ? 'Dados apenas locais/cache. A base central ainda não confirmou estas informações. Não realize operações críticas até a conexão ser restabelecida.'
        : 'Dados locais temporários. O Núcleo está atualizando com a base central; até a confirmação, estas informações não devem ser tratadas como dados atuais.';
    }
  }
}

function nucleoSetCentralSyncState(status,message='',serverAt=''){
  nucleoCentralSyncState={
    status:status||'cache',
    message:message||'',
    serverAt:serverAt||nucleoCentralSyncState.serverAt||'',
    confirmedAt:status==='synced'?new Date().toLocaleString('pt-BR'):(nucleoCentralSyncState.confirmedAt||'')
  };
  nucleoRenderCentralSyncState();
}

function nucleoRequireCentralData(action='continuar'){
  if(nucleoCentralDataConfirmed())return true;
  const msg='A base central ainda não confirmou os dados deste dispositivo. Aguarde o indicador ficar verde antes de '+action+'.';
  nucleoSetCentralSyncState(nucleoCentralSyncState.status==='error'?'error':'syncing',nucleoCentralSyncState.message||msg);
  try{nucleoAutoSyncIfDue(true)}catch(e){}
  alert(msg+'\n\nO que está na tela pode ser somente cache local e não será usado para uma operação crítica.');
  return false;
}

function nucleoActionNeedsCentralConfirmation(action){
  action=String(action||'').toLowerCase();
  if(!action)return false;
  if(action.indexOf('nucleo_5s_')===0)return false;
  if(['portal_login','portal_login_jsonp','portal_auth_v2','portal_register_user','portal_public_config','portal_load','portal_ro_page','portal_get_record','portal_save_status','portal_delete_status'].includes(action))return false;
  if(/(?:^|_)(load|get|read|list|overview|status|search|public|diagnostic|pdf)(?:_|$)/.test(action))return false;
  return /(?:^|_)(save|delete|update|create|upload|finalize|present|approve|reject|confirm|send|schedule|cancel|archive|remove|set|change)(?:_|$)/.test(action);
}

function nucleoValidApiUrl(value){return /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(String(value||'').trim());}

function nucleoPersistedApiUrl(){
  const candidates=[];
  try{
    const dedicated=JSON.parse(localStorage.getItem(INTEGRATION_PERSIST_KEY)||'{}')||{};
    candidates.push(dedicated.apiUrl);
  }catch(e){}
  try{
    const admin=JSON.parse(localStorage.getItem(ADMIN_CONFIG_KEY)||'{}')||{};
    candidates.push(admin.apiUrl);
  }catch(e){}
  const valid=candidates
    .map(v=>String(v||'').trim())
    .find(nucleoValidApiUrl);
  return valid||'';
}

function portalApiBase(){
  // BUILD MODULAR DE TESTE:
  // 1) usa a URL publicada no build quando existir;
  // 2) senão, reutiliza a URL /exec já configurada neste navegador.
  return String(
    nucleoConfirmedApiUrl||
    NUCLEO_DEFAULT_API_URL||
    nucleoPersistedApiUrl()||
    ''
  ).trim().replace(/\/+$/,'');
}

async function nucleoCheckApiUrl(url){
  const candidate=String(url||'').trim();
  if(!nucleoValidApiUrl(candidate)){
    throw new Error('Informe a URL do aplicativo da Web do Apps Script, terminada em /exec.');
  }

  // Produção: confirma que a URL responde como backend do Núcleo.
  const result=await portalJsonp({acao:'portal_public_config'},20000,candidate);
  if(!result?.sucesso||!result.config){
    throw new Error('O endereço não confirmou uma conexão válida com o Núcleo.');
  }

  // Esta build é destinada ao ambiente modular de TESTE.
  // Um backend explicitamente marcado como TESTE é aceito de propósito.
  return result;
}

async function nucleoEnsureApiConfigured(){
  const published=String(NUCLEO_DEFAULT_API_URL||'').trim();
  const persisted=String(nucleoPersistedApiUrl()||'').trim();
  const current=published||persisted;

  if(!current){
    throw new Error(
      'Nenhuma URL do Apps Script foi encontrada para o ambiente de teste. '+
      'Informe a URL /exec do Apps Script de teste na configuração de integração desta cópia do Núcleo.'
    );
  }

  const confirmed=await nucleoCheckApiUrl(current);
  nucleoConfirmedApiUrl=current;
  return {url:current,result:confirmed};
}

function portalBackendEnabled(){
  return /^https:\/\/script\.google\.com\/macros\/s\//i.test(portalApiBase());
}

function portalBase64EncodeJson(obj){
  const json=JSON.stringify(obj||{});
  return btoa(unescape(encodeURIComponent(json))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}

function portalJsonp(params,timeoutMs=60000,baseOverride=''){
  return new Promise((resolve,reject)=>{
    const base=baseOverride||portalApiBase();
    if(!base){reject(new Error('URL do Apps Script não configurada.'));return;}

    const cb='nucleoLoginCallback_'+Date.now()+'_'+Math.floor(Math.random()*100000);
    const script=document.createElement('script');
    let done=false;

    function cleanup(){
      try{clearTimeout(timer)}catch(e){}
      try{delete window[cb]}catch(e){window[cb]=undefined}
      try{script.remove()}catch(e){}
    }
    function finish(err,data){
      if(done)return;
      done=true;
      cleanup();
      if(err)reject(err); else resolve(data);
    }

    window[cb]=function(data){
      const current=getSession();
      if(requestParams.token&&current?.authToken===requestParams.token&&nucleoSessionError(data))nucleoEndExpiredSession();
      finish(null,data);
    };

    const parts=[];
    const requestParams={...(params||{})};
    const cleanupBypass=requestParams.__testCleanup===true && isAdmin();
    delete requestParams.__testCleanup;
    const actionName=String(requestParams.acao||'').toLowerCase();
    const sessionToken=String(getSession()?.authToken||'').trim();
    if(
      sessionToken &&
      !cleanupBypass &&
      actionName!=='portal_save_config' &&
      nucleoActionNeedsCentralConfirmation(actionName) &&
      !nucleoCentralDataConfirmed()
    ){
      cleanup();
      reject(new Error('Dados ainda não confirmados pela base central. Aguarde o indicador ficar verde e tente novamente.'));
      return;
    }
    if(sessionToken && !requestParams.token && actionName!=='portal_public_config' && !['portal_login','portal_login_jsonp','portal_register_user'].includes(actionName)){
      requestParams.token=sessionToken;
    }
    Object.entries(requestParams).forEach(([k,v])=>{
      if(v!==undefined && v!==null)parts.push(encodeURIComponent(k)+'='+encodeURIComponent(String(v)));
    });
    parts.push('callback='+encodeURIComponent(cb));
    parts.push('_='+Date.now());

    script.async=true;
    script.src=base+'?'+parts.join('&');
    script.onerror=()=>finish(new Error('O Apps Script respondeu, mas o navegador não conseguiu carregar os dados da base central.'));
    const timer=setTimeout(()=>finish(new Error('O Apps Script executou, mas não devolveu a confirmação ao aplicativo dentro do tempo limite.')),timeoutMs);

    document.head.appendChild(script);
  });
}

function portalPostForm(params){
  params={...(params||{})};if(params.acao==='portal_upload_standard_document'){const metadata=JSON.parse(params.metadata||'{}');if(!metadata.unit&&!metadata.unidade)metadata.unit=getSession()?.role==='quality'?'filial':document.getElementById('ndStandardUnit')?.value||document.getElementById('qualityConfigUnit')?.value||explicitPortalUnit(getSession()?.unit);params.metadata=JSON.stringify(metadata);}
  const authToken=getSession()?.authToken;if(authToken&&!params.token)params.token=authToken;
  if(authToken && nucleoActionNeedsCentralConfirmation(params.acao) && !nucleoCentralDataConfirmed())return false;
  const base=portalApiBase();
  if(!base)return false;
  try{
    const frameName='portalBackendFrame_'+Date.now()+'_'+Math.floor(Math.random()*9999);
    const iframe=document.createElement('iframe');
    iframe.name=frameName;
    iframe.style.display='none';
    document.body.appendChild(iframe);

    const form=document.createElement('form');
    form.method='POST';
    form.action=base;
    form.target=frameName;
    form.style.display='none';

    Object.entries(params||{}).forEach(([k,v])=>{
      const input=document.createElement('input');
      input.type='hidden';
      input.name=k;
      input.value=typeof v==='string'?v:JSON.stringify(v);
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    // Fotos de RNC podem tornar o POST grande. Não remova o iframe enquanto o upload ainda pode estar em andamento.
    setTimeout(()=>{try{form.remove();iframe.remove()}catch(e){}},120000);
    return true;
  }catch(e){
    console.error('Falha ao enviar dados para base central.',e);
    return false;
  }
}

function portalBackendSave(collection,id,data){
  if(getSession()?.role==='quality'&&data&&!data.unit&&!data.unidade)data={...data,unit:'Filial'};
  if(!portalBackendEnabled()||!navigator.onLine||!nucleoCentralDataConfirmed())return false;
  const params={acao:'portal_save',colecao:collection,id:String(id||''),dados:JSON.stringify(data||{}),ator:getSession()?.name||'Sistema'};
  return portalPostForm(params);
}

async function portalBackendSaveConfirmed(collection,id,data){
  if(!nucleoRequireCentralData('salvar esta alteração'))throw new Error('A base central ainda não confirmou os dados.');
  if(getSession()?.role==='quality'&&data&&!data.unit&&!data.unidade)data={...data,unit:'Filial'};
  if(!portalBackendEnabled())throw new Error('Apps Script não configurado.');
  const res=await portalJsonp({
    acao:'portal_save',
    colecao:String(collection||''),
    id:String(id||''),
    dados:JSON.stringify(data||{}),
    ator:getSession()?.name||'Sistema'
  },60000);
  if(!res?.sucesso)throw new Error(res?.erro||'A base central não confirmou o salvamento.');
  return res;
}

async function portalBackendSaveConfirmedPost(collection,id,data,timeoutMs=150000){
  if(!nucleoRequireCentralData('salvar esta alteração'))throw new Error('A base central ainda não confirmou os dados.');
  if(getSession()?.role==='quality'&&data&&!data.unit&&!data.unidade)data={...data,unit:'Filial'};
  if(!portalBackendEnabled())throw new Error('Apps Script não configurado.');

  const eventoId='PORTALSAVE-'+Date.now()+'-'+Math.random().toString(36).slice(2,9);
  const expectedUpdatedAt=String(data?.updatedAt||'').trim();
  const expectedRnc=String(data?.rncNumber||'').trim();

  const submitted=portalPostForm({
    acao:'portal_save',
    colecao:String(collection||''),
    id:String(id||''),
    dados:JSON.stringify(data||{}),
    ator:getSession()?.name||'Sistema',
    eventoId
  });

  if(!submitted)throw new Error('Não foi possível enviar o registro para a base central.');

  const recordMatches=(registro)=>{
    if(!registro)return false;

    // shared_state pode ter o updatedAt regravado pelo Apps Script.
    // Para esse tipo de registro, o que confirma a versão é o conteúdo
    // autoritativo do marcador — não o timestamp exato do navegador.
    if(String(collection||'')==='shared_state'){
      return (
        String(registro.id||'')===String(id||'') &&
        String(registro.key||'')===String(data?.key||'') &&
        String(registro.value??'')===String(data?.value??'') &&
        String(registro.scope||'global')===String(data?.scope||'global') &&
        String(registro.userKey||'')===String(data?.userKey||'')
      );
    }

    // Nos demais registros, mantém a confirmação de versão por updatedAt
    // quando o próprio objeto fornece esse valor.
    if(expectedUpdatedAt){
      return String(registro.updatedAt||'').trim()===expectedUpdatedAt;
    }

    if(expectedRnc){
      return String(registro.rncNumber||'').trim()===expectedRnc;
    }

    return String(registro.id||id)===String(id);
  };

  const started=Date.now();
  let ultimoStatus='processing';

  while(Date.now()-started<timeoutMs){
    await new Promise(resolve=>setTimeout(resolve,1200));

    // Não depende mais exclusivamente do PORTALSAVE_.
    // Confirma diretamente se a versão recém-salva já existe na base.
    const [chk,read]=await Promise.all([
      portalJsonp({acao:'portal_save_status',eventoId},12000).catch(()=>null),
      portalJsonp({
        acao:'portal_get_record',
        colecao:String(collection||''),
        id:String(id||'')
      },12000).catch(()=>null)
    ]);

    if(chk?.status)ultimoStatus=String(chk.status);

    if(read?.sucesso&&recordMatches(read.registro)){
      return {sucesso:true,registro:read.registro};
    }

    if(chk?.status==='error'){
      throw new Error(chk.erro||'A base central recusou o salvamento.');
    }

    // Mesmo quando o status já marcou "done", aguarda alguns instantes
    // até a leitura devolver exatamente a versão recém-gravada.
    if(chk?.status==='done'){
      await new Promise(resolve=>setTimeout(resolve,300));
      const finalRead=await portalJsonp({
        acao:'portal_get_record',
        colecao:String(collection||''),
        id:String(id||'')
      },12000).catch(()=>null);

      if(finalRead?.sucesso&&recordMatches(finalRead.registro)){
        return {sucesso:true,registro:finalRead.registro};
      }
    }
  }

  // Última conferência direta antes de declarar falha.
  const finalRead=await portalJsonp({
    acao:'portal_get_record',
    colecao:String(collection||''),
    id:String(id||'')
  },15000).catch(()=>null);

  if(finalRead?.sucesso&&recordMatches(finalRead.registro)){
    return {sucesso:true,registro:finalRead.registro};
  }

  throw new Error(
    ultimoStatus==='processing'
      ? 'O registro foi enviado, mas a versão nova ainda não apareceu na base central.'
      : 'A base central não confirmou a versão recém-salva.'
  );
}

async function portalBackendDeleteConfirmed(collection,id){
  if(!nucleoRequireCentralData('excluir este registro'))throw new Error('A base central ainda não confirmou os dados.');
  const colecaoKey=String(collection||'').trim();
  const idKey=String(id||'').trim();
  if(colecaoKey==='triage')return nucleoDeleteTriageConfirmed(idKey);

  if(colecaoKey!=='admin_modules'||!idKey){
    throw new Error('RNC inválida para exclusão.');
  }

  if(!portalBackendEnabled()||!navigator.onLine)throw new Error('Base central indisponível. A exclusão não foi realizada.');
  const res=await portalJsonp({acao:'portal_delete',colecao:colecaoKey,id:idKey,ator:getSession()?.name||'Sistema'},60000);
  if(!res?.sucesso)throw new Error(res?.erro||'A base central não confirmou a exclusão.');
  markRncDeletedLocally(idKey);
  return {sucesso:true,excluido:true,pendenteCentral:false};
}

function portalBackendDelete(collection,id){
  if(!portalBackendEnabled()||!navigator.onLine||!nucleoCentralDataConfirmed())return false;
  const params={acao:'portal_delete',colecao:collection,id:String(id||''),ator:getSession()?.name||'Sistema'};
  return portalPostForm(params);
}

function portalUpdateRoSheet(ro,campos){
  if(!portalBackendEnabled()||!ro||!navigator.onLine||!nucleoCentralDataConfirmed())return false;
  const params={
    acao:'portal_update_ro_sheet',
    ro:String(ro||''),
    origem:roOriginFromNumber(ro,''),
    campos:JSON.stringify(campos||{}),
    ator:getSession()?.name||'Portal SGQ'
  };
  return portalPostForm(params);
}

async function portalUpdateRoSheetConfirmed(ro,campos){
  if(!nucleoRequireCentralData('atualizar a R.O.'))throw new Error('A base central ainda não confirmou os dados.');
  if(!portalBackendEnabled())throw new Error('Apps Script não configurado.');
  const res=await portalJsonp({
    acao:'portal_update_ro_sheet',
    ro:String(ro||''),
    origem:roOriginFromNumber(ro,''),
    campos:JSON.stringify(campos||{}),
    ator:getSession()?.name||'Núcleo'
  },90000);
  if(!res?.sucesso)throw new Error(res?.erro||'A planilha não confirmou a atualização.');
  return res;
}

function nucleoSharedStateUserKey(){
  try{return String(notificationUserKey?.()||getSession?.()?.email||getSession?.()?.name||'anon').trim().toLowerCase()||'anon'}catch(e){return 'anon'}
}

function nucleoSharedStateId(key){
  return NUCLEO_SHARED_USER_KEYS.has(String(key)) ? ('user:'+nucleoSharedStateUserKey()+':'+String(key)) : ('global:'+String(key));
}

function nucleoPersistSharedState(key,value){
  if(nucleoApplyingCentralState||!portalBackendEnabled?.())return;
  const k=String(key||'');
  if(!NUCLEO_SHARED_GLOBAL_KEYS.has(k)&&!NUCLEO_SHARED_USER_KEYS.has(k))return;
  portalBackendSave('shared_state',nucleoSharedStateId(k),{
    id:nucleoSharedStateId(k),key:k,value:String(value??''),
    scope:NUCLEO_SHARED_USER_KEYS.has(k)?'user':'global',
    userKey:NUCLEO_SHARED_USER_KEYS.has(k)?nucleoSharedStateUserKey():'',
    updatedAt:new Date().toISOString(),updatedBy:getSession?.()?.name||'Sistema'
  });
}

function nucleoApplySharedState(list){
  if(!Array.isArray(list))return;
  const userKey=nucleoSharedStateUserKey();
  nucleoApplyingCentralState=true;
  try{
    list.forEach(x=>{
      if(!x?.key)return;
      if(x.scope==='user'&&String(x.userKey||'')!==userKey)return;
      if(!NUCLEO_SHARED_GLOBAL_KEYS.has(String(x.key))&&!NUCLEO_SHARED_USER_KEYS.has(String(x.key)))return;
      nucleoNativeStorageSetItem.call(localStorage,String(x.key),String(x.value??''));
    });
  }finally{nucleoApplyingCentralState=false;}
}

function applyPortalBackendSnapshot(snapshot){
  claimantIdentityCache=null;
  if(!snapshot||snapshot.sucesso===false)return false;

  const data=snapshot.dados||{};
  if(snapshot.session&&getSession()){setSession({...getSession(),...snapshot.session,...(data.overviewIndicators!==undefined?{overviewIndicators:data.overviewIndicators}:{})});}

  if(Array.isArray(data.unitContacts))localStorage.setItem('nucleo-unit-contacts',JSON.stringify(data.unitContacts));
  if(Array.isArray(data.unitConfigs))localStorage.setItem('nucleo-unit-configs',JSON.stringify(data.unitConfigs));
  if(Array.isArray(data.fixedEmailCopies)){localStorage.setItem('nucleo-fixed-email-copies',JSON.stringify(data.fixedEmailCopies));loadFixedEmailCopies();}
  if(Array.isArray(data.pdcaDispatches))nucleoCentralPdcaDispatches=data.pdcaDispatches.map(x=>({...x}));
  if(Array.isArray(data.claimantBindings))localStorage.setItem('nucleo-claimant-bindings-v1',JSON.stringify(data.claimantBindings));
  // A base central vence qualquer cache antigo deste navegador.
  nucleoApplySharedState(data.sharedState);
  if(Array.isArray(data.processTemplates)){
    try{nucleoNativeStorageSetItem.call(localStorage,'nucleo_process_templates_v1',JSON.stringify(data.processTemplates));}catch(e){console.warn('Falha ao aplicar modelos centrais:',e)}
  }
  if(data.config && typeof data.config==='object'){
    // Configuração administrativa vem integralmente da base central.
    const mergedConfig={
      ...data.config,
      apiUrl:portalApiBase(),
      autoSync:String(data.config.autoSync??'0'),
      roSyncPeriod:String(data.config.roSyncPeriod??'all'),
      roSyncDateFrom:String(data.config.roSyncDateFrom??''),
      roSyncDateTo:String(data.config.roSyncDateTo??'')
    };
    localStorage.setItem(ADMIN_CONFIG_KEY,JSON.stringify(mergedConfig));
    // Mantém somente uma cópia de cache, nunca usada para escolher a API.
    const persistedIntegration={
      apiUrl:portalApiBase(),
      apiKey:String(data.config.apiKey||''),
      autoSync:mergedConfig.autoSync,
      roSyncPeriod:mergedConfig.roSyncPeriod,
      roSyncDateFrom:mergedConfig.roSyncDateFrom,
      roSyncDateTo:mergedConfig.roSyncDateTo,
      savedAt:String(data.config.__savedAt||snapshot.atualizadoEm||new Date().toISOString())
    };
    try{
      localStorage.setItem(INTEGRATION_PERSIST_KEY,JSON.stringify(persistedIntegration));
      localStorage.setItem('ro-sync-settings',JSON.stringify(persistedIntegration));
    }catch(e){}
  }
  if(Array.isArray(data.triage))localStorage.setItem(TRIAGE_KEY,JSON.stringify(data.triage));
  // triageDeletedKeys era usado por uma versão antiga para bloquear a reconstrução
  // da triagem. Isso fazia R.O.s válidas irem para 'Não triada'. Não reaplicar esse estado.
  if(Array.isArray(data.externalRoControls))saveExternalRoControlsLocal(data.externalRoControls);
  if(Array.isArray(data.adminModules)){
    const deleted=getRncDeletedTombstones();
    const clean=data.adminModules.filter(x=>!deleted[String(x?.id||'')]);
    localStorage.setItem(ADMIN_MODULES_KEY,JSON.stringify(clean));

    // Cada sincronização é também uma nova tentativa silenciosa de concluir
    // as exclusões pendentes no Apps Script.
    setTimeout(retryPendingRncDeletes,50);
  }
  if(Array.isArray(data.standardDocuments))localStorage.setItem(STANDARD_DOCUMENTS_KEY,JSON.stringify(data.standardDocuments));
  if(Array.isArray(data.documentDeliveries))localStorage.setItem(DOCUMENT_DELIVERIES_KEY,JSON.stringify(data.documentDeliveries));
  if(Array.isArray(data.contestations)){
    // A base central é a fonte oficial. A cópia local é apenas cache e é substituída integralmente.
    localStorage.setItem(CONTEST_KEY,JSON.stringify(data.contestations));
  }
  if(Array.isArray(data.users)){
    const filteredUsers=data.users.filter(u=>!isDeletedUserRecord(u));
    localStorage.setItem(USERS_KEY,JSON.stringify(filteredUsers));
  }
  if(Array.isArray(data.announcements)){
    const localAnnouncements=data.announcements.map(a=>{
      const copy={...a};
      if(copy.imageData){
        copy.hasImage=true;
        saveAnnouncementImage(copy.id,copy.imageData).catch(()=>{});
        delete copy.imageData;
      }
      if(copy.imageFileId)copy.hasImage=true;
      return copy;
    });
    localStorage.setItem(ANNOUNCEMENTS_KEY,JSON.stringify(localAnnouncements));
  }
  if(Array.isArray(data.audit))localStorage.setItem(RULE_AUDIT_KEY,JSON.stringify(data.audit));
  if(Array.isArray(data.pdcaDrafts)){
    const map=getPdcaDrafts();
    const userKey=pdcaDraftUserKey();
    const sessionName=normalizeAnswer(getSession()?.name||'');
    data.pdcaDrafts.forEach(x=>{
      if(!x?.ro)return;
      const belongs=x.userKey?x.userKey===userKey:(!x.updatedBy||normalizeAnswer(x.updatedBy)===sessionName);
      if(!belongs)return;
      const k=x.userKey?(String(x.ro)+'@@'+x.userKey):String(x.ro);
      const local=map[k];
      if(!local || String(x.updatedAt||'')>=String(local.updatedAt||''))map[k]=x;
    });
    localStorage.setItem(PDCA_DRAFTS_KEY,JSON.stringify(map));
  }
  if(Array.isArray(data.savedFilters))localStorage.setItem(SAVED_FILTERS_KEY,JSON.stringify(data.savedFilters));
  if(Array.isArray(data.pdcaSent)){nucleoCentralPdcaSent=data.pdcaSent.map(x=>({...x}));nucleoCentralPdcaSnapshotReady=true;}
  if(Array.isArray(data.favorites)){
    const mine=data.favorites.find(x=>String(x.userKey||x.id||'')===notificationUserKey());
    if(mine&&Array.isArray(mine.items))localStorage.setItem(FAVORITES_KEY,JSON.stringify(mine.items));
  }
  if(Array.isArray(data.archives))localStorage.setItem(ARCHIVED_RO_KEY,JSON.stringify(Array.isArray(data.archives[0]?.items)?data.archives[0].items:[]));
  if(Array.isArray(data.announcementAcks)){
    const ackMap=getAnnouncementAcks();
    data.announcementAcks.forEach(x=>{
      if(!x?.userKey||!x?.announcementId)return;
      const s=new Set(ackMap[x.userKey]||[]);
      s.add(x.announcementId);
      ackMap[x.userKey]=[...s];
    });
    localStorage.setItem(ANNOUNCEMENT_ACK_KEY,JSON.stringify(ackMap));
  }

  const now=new Date().toLocaleString('pt-BR');
  localStorage.setItem(PORTAL_BACKEND_LAST_SYNC_KEY,now);
  const el=document.getElementById('backendLastSync');
  if(el)el.textContent=now;
  return true;
}

async function syncPortalBackend(showMessage=false,options={}){
  // Se outra sincronização central já estiver em andamento, compartilha o
  // resultado dela. Não existe mais o falso erro depois de 30 segundos.
  if(portalBackendSyncInProgress){
    updateBackendStatus(null,'Base central ainda está sincronizando...');
    return await portalWaitForCurrentSync_();
  }

  if(!portalBackendEnabled()){
    try{
      await nucleoEnsureApiConfigured();
    }catch(e){
      if(showMessage)alert('Não foi possível configurar o Apps Script: '+(e?.message||e));
      updateBackendStatus(false,e?.message||'Apps Script não configurado.');
      return false;
    }
  }

  if(!portalBackendEnabled()){
    if(showMessage)alert('Configure primeiro a URL do Apps Script.');
    updateBackendStatus(false,'Apps Script não configurado.');
    return false;
  }

  const foreground=!!(showMessage||options.foreground);
  portalBackendSyncInProgress=true;
  nucleoSetCentralSyncState('syncing','Atualizando com a base central. Os dados exibidos até a confirmação são apenas cache local.');
  updateBackendStatus(null,'Sincronizando...');
  if(foreground)await showNucleoLoading(options.loadingMessage||'Carregando dados da base central...','Carregando NÚCLEO');
  try{
    // A base central hoje reúne R.O.s, PDCAs, usuários, auditoria, histórico de
    // e-mails, equipamentos etc. Em produção esta resposta pode ultrapassar 60 s.
    // Não transformar um timeout curto em "dados locais — atualização falhou".
    let res=null;
    let lastCentralError=null;

    for(let attempt=1;attempt<=2;attempt++){
      try{
        res=await portalJsonp({acao:'portal_load'},180000);
        if(res?.sucesso===false)throw new Error(res.erro||'Falha ao carregar base central.');
        if(res)break;
      }catch(loadErr){
        lastCentralError=loadErr;
        if(attempt<2){
          updateBackendStatus(null,'Base central demorou para responder. Confirmando novamente...');
          nucleoSetCentralSyncState(
            'syncing',
            'As R.O.s já foram atualizadas. Confirmando os demais dados da base central...'
          );
          await new Promise(resolve=>setTimeout(resolve,1800));
        }
      }
    }

    if(!res)throw (lastCentralError||new Error('A base central não retornou os dados.'));
    applyPortalBackendSnapshot(res);
    nucleoSetCentralSyncState('synced','Base central confirmada. Os dados em tela estão atualizados.',res?.atualizadoEm||'');
    updateBackendStatus(true,'Base central conectada.');
    try{nucleo5sPopulateLinkUsers?.(true)}catch(e){}

    // Atualizações leves acontecem imediatamente. Renderizações grandes ficam fora
    // do caminho crítico para o navegador não congelar a cada sincronização automática.
    try{
      refreshSectorSelectors();
      refreshExternalRoSidebarBadge();
      try{nucleoRefreshMetrologyAlertsForCurrentUser()}catch(e){console.warn('Falha ao atualizar alertas metrológicos.',e)}
      refreshNotificationBell();
      refreshContestPendingBadge();
      refreshPdcaSidebarBadge();
    }catch(e){}
    const heavyRefresh=()=>{
      try{
        loadAdminConfig();
        renderAnnouncementsAdmin();
        renderContestations();
        populateTriageUnits();
        if(!document.getElementById('triageView')?.classList.contains('hidden'))renderTriage();
        if(!document.getElementById('externalRoControlView')?.classList.contains('hidden'))renderExternalRoControl();
        refreshRoSummary();
        if(!document.getElementById('roListView')?.classList.contains('hidden'))try{render()}catch(e){}
        if(!document.getElementById('settingsView')?.classList.contains('hidden'))renderOperationalUsers();
        if(!document.getElementById('settingsView')?.classList.contains('hidden'))try{populateAdminCleanupRos();}catch(e){}
        setTimeout(()=>{try{showPendingAnnouncement()}catch(e){}},100);
      }catch(e){}
    };
    if(foreground)heavyRefresh();
    else if('requestIdleCallback' in window)requestIdleCallback(heavyRefresh,{timeout:2500});
    else setTimeout(heavyRefresh,350);

    portalResolveSyncWaiters_(true);
    if(showMessage)alert('Base central sincronizada.');
    return true;
  }catch(e){
    const roStatusText=String(document.getElementById('syncMsg')?.textContent||'');
    const freshRos=/R\.O\.s.*atualizad|carregada\(s\)/i.test(roStatusText);

    if(freshRos){
      nucleoSetCentralSyncState(
        'syncing',
        'As R.O.s estão atualizadas. Os demais dados da base central ainda estão sendo confirmados: '+(e.message||String(e))
      );
      updateBackendStatus(null,'R.O.s atualizadas; confirmação complementar pendente.');
      // Uma nova confirmação acontece em segundo plano sem bloquear a tela.
      setTimeout(()=>syncPortalBackend(false,{foreground:false}).catch(()=>{}),5000);
    }else{
      nucleoSetCentralSyncState('error','Falha ao confirmar a base central: '+(e.message||String(e)));
      updateBackendStatus(false,e.message||String(e));
    }

    portalResolveSyncWaiters_(false);
    if(showMessage&&!freshRos)alert('Não foi possível sincronizar: '+(e.message||e));
    return false;
  }finally{
    if(foreground)hideNucleoLoading(true);
    portalBackendSyncInProgress=false;
    // Em caminhos inesperados, libera qualquer chamador que esteja aguardando.
    if(portalBackendSyncWaiters.length){
      portalResolveSyncWaiters_(nucleoCentralDataConfirmed());
    }
  }
}

function updateBackendStatus(ok,text){
  const box=document.getElementById('backendConnectionState');
  if(box){
    box.textContent=text||'—';
    box.className='statusline'+(ok===true?' okline':'');
  }
  const last=document.getElementById('backendLastSync');
  if(last)last.textContent=localStorage.getItem(PORTAL_BACKEND_LAST_SYNC_KEY)||'—';
}

async function runPortalDiagnostics(){
  const box=document.getElementById('backendDiagnosticResult');
  if(box){box.classList.remove('hidden');box.textContent='Executando diagnóstico...';box.className='statusline'}
  try{
    const res=await portalJsonp({acao:'portal_diagnostico'});
    if(res?.sucesso===false)throw new Error(res.erro||'Diagnóstico falhou.');
    const d=res.dados||{};
    const parts=[
      'Planilha: '+(d.planilha?'OK':'ERRO'),
      'Drive: '+(d.drive?'OK':'ERRO'),
      'Docs/PDF: '+(d.docs?'OK':'ERRO'),
      'E-mail: '+(d.email?'OK':'ERRO'),
      'Base central: '+(d.baseCentral?'OK':'ERRO')
    ];
    if(box){box.textContent=parts.join(' · ');box.className='statusline okline'}
  }catch(e){
    if(box){box.textContent='Falha no diagnóstico: '+(e.message||e);box.className='statusline'}
  }
}

async function exportPortalConfiguration(){
  try{
    const res=await portalJsonp({acao:'portal_backup'});
    if(res?.sucesso===false)throw new Error(res.erro||'Falha ao gerar backup.');
    const blob=new Blob([JSON.stringify(res.backup||{},null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;
    a.download='Portal_SGQ_backup_'+new Date().toISOString().slice(0,10)+'.json';
    document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),20000);
  }catch(e){alert('Não foi possível exportar o backup: '+(e.message||e))}
}

async function importPortalConfiguration(input){
  if(!isAdmin())return;
  const file=input?.files?.[0];
  if(!file)return;
  try{
    const text=await file.text();
    const backup=JSON.parse(text);
    const data=backup?.dados||backup?.backup?.dados;
    if(!data||typeof data!=='object')throw new Error('Arquivo de backup inválido.');
    if(!confirm('Importar este backup? Os dados locais serão atualizados e enviados à base central.'))return;

    if(data.config){
      localStorage.setItem(ADMIN_CONFIG_KEY,JSON.stringify(data.config));
      portalBackendSave('config','main',data.config);
    }
    for(const x of (data.triage||[]))portalBackendSave('triage',x.roKey||x.id,x);
    for(const x of (data.contestations||[]))portalBackendSave('contestations',x.id,x);
    for(const x of (data.users||[]))portalBackendSave('users',x.email||x.name,x);
    for(const x of (data.announcements||[]))portalBackendSave('announcements',x.id,x);
    for(const x of (data.audit||[]))portalBackendSave('audit',x.id,x);

    applyPortalBackendSnapshot({sucesso:true,dados:data});
    loadAdminConfig();
    alert('Backup importado.');
  }catch(e){
    alert('Não foi possível importar o backup: '+(e.message||e));
  }finally{
    if(input)input.value='';
  }
}

function scheduleBackendSync(){
  if(!portalBackendEnabled())return;
  setTimeout(()=>syncPortalBackend(false),500);
}

async function syncPublicPortalConfig(){
  nucleoPublicConfigReady=false;
  try{
    const setup=await nucleoEnsureApiConfigured();
    const base=setup.url;
    const res=setup.result;

    if(!res?.sucesso||!res.config){
      throw new Error(res?.erro||'A configuração central TESTE não respondeu.');
    }

    nucleoConfirmedApiUrl=base;

    localStorage.setItem(
      'nucleo-unit-public-sectors',
      JSON.stringify(res.config.sectorListsByUnit||{})
    );
    localStorage.setItem(
      ADMIN_CONFIG_KEY,
      JSON.stringify({...res.config,apiUrl:base})
    );

    const persisted={
      ...res.config,
      apiUrl:base,
      savedAt:String(res.config.__savedAt||new Date().toISOString())
    };
    localStorage.setItem(INTEGRATION_PERSIST_KEY,JSON.stringify(persisted));
    localStorage.setItem('ro-sync-settings',JSON.stringify(persisted));

    nucleoPublicConfigReady=true;
    refreshSectorSelectors();
    try{refreshLoginSectorByUnit()}catch(e){}
    return true;
  }catch(e){
    console.warn('Não foi possível carregar a configuração central antes do login.',e);
    nucleoPublicConfigReady=false;
    const msg=document.getElementById('loginMessage');
    if(msg){
      msg.classList.remove('hidden');
      msg.textContent='Configuração da base central não confirmada: '+(e?.message||e);
    }
    return false;
  }
}

function nucleoAutoSyncIfDue(force=false){
  try{
    if(!getSession()?.authToken||document.visibilityState==='hidden'||portalBackendSyncInProgress||nucleoRoCentralRefreshPromise||syncNow.inProgress)return;
    const now=Date.now();
    if(!force && now-__nucleoLastAutoSyncAttempt<300000)return;
    __nucleoLastAutoSyncAttempt=now;
    syncPortalBackend(false);
  }catch(e){}
}

