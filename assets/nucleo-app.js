const NUCLEO_DEFAULT_DECISIONS=[{"id":"directed","label":"Direcionar para tratativa","behavior":"directed","active":true,"requireSector":true,"requireReason":true,"pdcaRequired":true,"deadlineDays":null,"color":"#eef4ff"},{"id":"record","label":"Somente para registro","behavior":"record","active":true,"requireSector":false,"requireReason":true,"pdcaRequired":false,"deadlineDays":null,"color":"#fff9e5"},{"id":"cancelled","label":"Cancelar R.O.","behavior":"cancelled","active":true,"requireSector":false,"requireReason":true,"pdcaRequired":false,"deadlineDays":null,"color":"#fff0f0"},{"id":"obsolete","label":"Obsoleta","behavior":"obsolete","active":true,"requireSector":false,"requireReason":true,"pdcaRequired":false,"deadlineDays":null,"color":"#f0f1f3"},{"id":"falta_caixa","label":"Falta de caixa","behavior":"record","active":true,"requireSector":false,"requireReason":false,"pdcaRequired":false,"deadlineDays":null,"color":"#fff9e5"}];
const NUCLEO_FEATURE_BUTTONS={"showList":["ros","consult"],"showAssignedRos":["ros","assigned"],"showMySubmittedRos":["ros","submitted"],"showTriage":["ros","triage"],"openTriageRecord":["ros","triage"],"saveTriageRecord":["ros","triage"],"showContestations":["ros","reviewContests"],"reviewContestation":["ros","reviewContests"],"submitContest":["ros","contest"],"openContest":["ros","contest"],"startPdcaFromList":["pdca","respond"],"openPDCA":["pdca","respond"],"finishPDCA":["pdca","respond"],"showSentPdcas":["pdca","received"],"showActionsDashboard":["pdca","actions"],"showPendingActions":["pdca","reviewActions"],"confirmActionCompletion":["pdca","reviewActions"],"markActionCompleted":["pdca","reviewActions"],"registerActionEvidence":["pdca","completeAction"],"presentPdca":["pdca","present"],"presentCurrentPdca":["pdca","present"],"savePdcaPresentationRecord":["pdca","present"],"finalizeAndSendSac":["sac","finalize"],"saveSacEditForm":["sac","edit"],"saveExternalRoControl":["sac","edit"],"saveSacDecisionLocally":["sac","edit"],"publishAnnouncement":["announcements","publish"],"openStandardDocumentCreate":["documents","standards"],"saveStandardDocument":["documents","standards"],"toggleStandardDocument":["documents","standards"],"deleteStandardDocument":["documents","standards"],"addOperationalUser":["users","create"],"approvePortalUser":["users","approve"],"rejectPortalUser":["users","approve"],"openUserRegistrationEditor":["users","edit"],"saveUserRegistrationEditor":["users","edit"],"removeOperationalUserByKey":["users","delete"],"saveSectorConfiguration":["sectors","edit"],"saveFixedEmailCopies":["sectors","emails"],"saveRncProcessTemplateFromForm":["processes","templates"],"deleteAssignedDirection":["ros","triage"],"openAssignedSectorEdit":["ros","triage"],"endAnnouncement":["announcements","publish"],"openUnitUserAccess":["users","permissions"],"showAnnouncementsAdmin":["announcements","publish"],"openAdminResetPassword":["users","edit"]};
const NUCLEO_PERSON_FEATURES={"ros":{"consult":["Consultar R.O.s disponíveis",false,"view"],"submitted":["R.O.s cadastradas por mim",false,"view"],"assigned":["R.O.s atribuídas",false,"view"],"triage":["Triar, classificar e direcionar",true,"manage"],"contest":["Criar contestações",true,"view"],"reviewContests":["Analisar contestações",true,"manage"],"claimant":["Alterar e confirmar reclamante",true,"manage"]},"pdca":{"received":["Consultar PDCAs recebidos",false,"view"],"respond":["Responder e continuar PDCA",true,"view"],"actions":["Consultar ações",false,"view"],"completeAction":["Registrar conclusão e evidências",true,"view"],"reviewActions":["Conferir e aprovar ações",true,"manage"],"import":["Importar e vincular respostas",true,"manage"],"present":["Registrar apresentação",true,"manage"],"dispatch":["Despachar resposta ao reclamante",true,"manage"]},"sac":{"consult":["Consultar SACs",false,"view"],"edit":["Classificar e editar SACs",true,"manage"],"finalize":["Finalizar e enviar SAC",true,"manage"]},"documents":{"consult":["Consultar documentos e solicitações",false,"view"],"request":["Criar solicitação de documento",true,"view"],"standards":["Cadastrar e alterar documentos padrão",true,"manage"],"prepare":["Preencher e armazenar documento solicitado",true,"manage"],"deliver":["Enviar e entregar documentos",true,"manage"],"history":["Consultar histórico de entregas",false,"manage"]},"indicators":{"consult":["Consultar indicadores",false,"view"]},"announcements":{"consult":["Consultar comunicados",false,"view"],"publish":["Emitir, alterar e encerrar comunicados",true,"manage"]},"equipment":{"consult":["Consultar equipamentos",false,"view"],"pending":["Consultar calibrações pendentes",false,"view"],"history":["Consultar histórico metrológico",false,"view"],"edit":["Cadastrar e alterar equipamentos",true,"manage"],"delete":["Excluir equipamentos",true,"manage"]},"training":{"consult":["Consultar treinamentos",false,"view"],"pending":["Consultar reciclagens pendentes",false,"view"],"history":["Consultar histórico de competências",false,"view"],"edit":["Cadastrar e alterar treinamentos",true,"manage"],"delete":["Excluir treinamentos",true,"manage"]},"nc":{"consult":["Consultar RNCs e tratamento",false,"view"],"edit":["Cadastrar e alterar RNCs",true,"manage"],"send":["Enviar RNC e anexar fotos",true,"manage"],"delete":["Excluir RNCs",true,"manage"]},"processes":{"consult":["Consultar documentos vigentes",false,"view"],"review":["Consultar documentos em revisão",false,"view"],"history":["Consultar histórico documental",false,"view"],"edit":["Cadastrar e alterar documentos internos",true,"manage"],"templates":["Alterar modelos e estrutura dos formulários",true,"manage"],"delete":["Excluir documentos internos",true,"manage"]},"users":{"consult":["Consultar cadastros",false,"manage"],"create":["Cadastrar pessoas",true,"manage"],"edit":["Editar nomes, dados e setores",true,"manage"],"approve":["Aprovar e bloquear cadastros",true,"manage"],"permissions":["Definir permissões de outras pessoas",true,"manage"],"delete":["Excluir usuários",true,"manage"]},"sectors":{"decisions":["Editar decisões e regras de R.O.",true,"manage"],"consult":["Consultar configurações da unidade",false,"manage"],"edit":["Cadastrar e alterar setores",true,"manage"],"emails":["Alterar destinatários e cópias padrão",true,"manage"],"folders":["Alterar e validar pastas do Drive",true,"manage"],"documentTypes":["Editar tipos de documentos",true,"manage"]}};
const NUCLEO_PERSON_MODULES={"ros": "R.O.s", "pdca": "PDCAs e ações", "sac": "SACs", "documents": "Documentos", "indicators": "Indicadores", "announcements": "Comunicados", "equipment": "Equipamentos", "training": "Treinamentos", "nc": "RNCs", "processes": "Gestão de processos", "users": "Usuários e acessos", "sectors": "Setores da unidade"};
// Telas administrativas carregadas somente quando solicitadas.
let nucleoAdminModulePromise=null;
let nucleoLazyNavigation=0;
function nucleoLoadAdminModule(){
  if(nucleoAdminModulePromise)return nucleoAdminModulePromise;
  nucleoAdminModulePromise=new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src=new URL('assets/modules/admin-workspaces.js?v=20261007-fix60',document.baseURI).href;
    const timer=setTimeout(()=>finish(new Error('Tempo limite ao carregar o módulo.')),20000);
    function finish(error){clearTimeout(timer);script.onload=script.onerror=null;if(error){script.remove();nucleoAdminModulePromise=null;reject(error)}else resolve();}
    script.onload=()=>finish();
    script.onerror=()=>finish(new Error('Não foi possível carregar o arquivo do módulo. Confira a pasta assets/modules.'));
    document.head.appendChild(script);
  });
  return nucleoAdminModulePromise;
}
async function nucleoOpenLazyAdmin(name,args){
  const request=++nucleoLazyNavigation;
  try{
    await nucleoLoadAdminModule();
    if(request!==nucleoLazyNavigation)return;
    return window[name](...args);
  }catch(e){alert('Não foi possível abrir o módulo: '+(e?.message||e)+' Tente novamente.');}
}

const ADMIN_OPERATIONAL_MODULES={
  equipment:{
    eyebrow:'ATIVOS E MEDIÇÃO',
    title:'Equipamentos e metrologia',
    desc:'Cadastre instrumentos, controle calibrações e acompanhe a condição dos ativos.',
    cards:[
      ['Novo equipamento','Cadastrar ativo, código, localização e situação.','new'],
      ['Equipamentos em acompanhamento','Acompanhar ativos em uso, manutenção ou bloqueio.','active'],
      ['Calibrações pendentes','Identificar instrumentos que exigem verificação.','pending'],
      ['Histórico metrológico','Consultar eventos, evidências e mudanças de status.','history']
    ]
  },
  training:{
    eyebrow:'PESSOAS E COMPETÊNCIAS',
    title:'Treinamentos, competências e conhecimento',
    desc:'Controle necessidades de treinamento, participantes, validade, eficácia e reciclagens.',
    cards:[
      ['Novo treinamento','Registrar treinamento, competência e participante.','new'],
      ['Treinamentos em andamento','Acompanhar capacitações abertas ou em execução.','active'],
      ['Reciclagens pendentes','Ver registros próximos do vencimento ou sem eficácia.','pending'],
      ['Histórico de competências','Consultar treinamentos e certificados registrados.','history']
    ]
  },
  nccapa:{
    eyebrow:'RNC',
    title:'RNC de fornecedores',
    desc:'Central para registrar e acompanhar RNCs de fornecedor. Reclamações de cliente continuam exclusivamente no fluxo de SAC. CAPA fica apenas como informação/filtro neste momento.',
    cards:[
      ['Nova RNC de fornecedor','Registrar uma RNC de fornecedor. O vínculo com R.O. é opcional.','new_rnc'],
      ['Em tratamento','Visualizar, filtrar, enviar, acompanhar e excluir RNCs de fornecedor.','active']
    ]
  },
  documents:{
    eyebrow:'SOLICITAÇÕES AO SGQ',
    title:'Solicitação de Documentos',
    desc:'Canal para solicitar ao SGQ documentos técnicos, legais, comerciais ou de produto e acompanhar a entrega.',
    cards:[
      ['Nova solicitação','Solicitar FISPQ, ficha técnica, certificado, laudo, documento de produto ou outro documento ao SGQ.','new'],
      ['Minhas solicitações','Acompanhar os pedidos que você abriu e o andamento informado pelo SGQ.','mine'],
      ['Documentos padrão','Cadastrar e controlar arquivos que podem ser entregues automaticamente.','standards'],
      ['Histórico de entregas','Consultar documentos padrão enviados automaticamente pelo portal.','deliveries'],
      ['Em análise','Pedidos sem documento padrão compatível que precisam de análise do SGQ.','doc_analysis'],
      ['Em preparação','Documentos que o SGQ está providenciando.','doc_preparation'],
      ['Prontos para entrega','Documentos concluídos e aguardando envio/entrega.','doc_ready'],
      ['Histórico de solicitações','Consultar todas as solicitações e entregas registradas.','history']
    ]
  },
  processes:{
    eyebrow:'DOCUMENTOS INTERNOS DO SGQ',
    title:'Gestão de processos',
    desc:'Biblioteca controlada dos documentos internos do SGQ: IT, GSP, POP, LPP e outros documentos de processo.',
    cards:[
      ['Novo documento interno','Cadastrar IT, GSP, POP, LPP ou outro documento interno.','new'],
      ['Documentos vigentes','Consultar documentos internos publicados e em uso.','published'],
      ['Em revisão','Acompanhar documentos internos em revisão.','review'],
      ['Revisões pendentes','Ver documentos com revisão próxima ou pendente.','pending'],
      ['Histórico documental','Consultar versões, revisões e documentos substituídos.','history'],
      ['Modelos de formulários','Configurar perguntas, revisão e aparência dos formulários gerados pelo Núcleo.','templates']
    ]
  }
};


window.__NUCLEO_TRIAGE_BUILD='2026-09-24-v5';
console.info('NÚCLEO TRIAGEM BUILD',window.__NUCLEO_TRIAGE_BUILD);

const ACCESS_KEY='ro-pdca-access-v2';

const SESSION_KEY='ro-pdca-session-v63';
const SKIP_LOGIN_PREVIEW=false;
const ADMIN_MODULES_KEY='portal-sgq-admin-modules-v2';
const STANDARD_DOCUMENTS_KEY='portal-sgq-standard-documents-v1';
const DOCUMENT_DELIVERIES_KEY='portal-sgq-document-deliveries-v1';
const RNC_DELETED_TOMBSTONES_KEY='portal-sgq-rnc-deleted-v1';
const ADMIN_CONFIG_KEY='ro-pdca-admin-config-v1';
const INTEGRATION_PERSIST_KEY='nucleo-integration-settings-v1';
const INTEGRATION_ADMIN_PASSWORD='TI1011';
let integrationSettingsUnlocked=false;

function unlockIntegrationSettings(){
  const input=document.getElementById('integrationAdminPassword');
  const msg=document.getElementById('integrationLockMessage');
  if(String(input?.value||'')!==INTEGRATION_ADMIN_PASSWORD){
    if(msg){
      msg.textContent='Senha incorreta.';
      msg.classList.remove('hidden');
    }
    if(input){
      input.value='';
      input.focus();
    }
    return false;
  }
  integrationSettingsUnlocked=true;
  if(input)input.value='';
  document.getElementById('integrationLockPanel')?.classList.add('hidden');
  document.getElementById('integrationProtectedContent')?.classList.remove('hidden');
  if(msg)msg.classList.add('hidden');
  return true;
}

function lockIntegrationSettings(){
  integrationSettingsUnlocked=false;
  document.getElementById('integrationProtectedContent')?.classList.add('hidden');
  document.getElementById('integrationLockPanel')?.classList.remove('hidden');
  const input=document.getElementById('integrationAdminPassword');
  if(input){
    input.value='';
    setTimeout(()=>input.focus(),0);
  }
}

function requireIntegrationUnlock(){
  if(integrationSettingsUnlocked)return true;
  alert('A integração está protegida. Informe a senha para alterar ou acessar essas configurações.');
  return false;
}


const PDCA_DRAFTS_KEY='portal-sgq-pdca-drafts-v1';
const PDCA_STARTED_KEY='portal-sgq-pdca-started-v1';
const SAVED_FILTERS_KEY='portal-sgq-saved-filters-v1';
const DEADLINE_ALERTS_KEY='portal-sgq-deadline-alerts-v1';
let pdcaExtraActions=[];
let pdcaDraftSaveTimer=null;

function getPdcaDrafts(){try{return JSON.parse(localStorage.getItem(PDCA_DRAFTS_KEY)||'{}')||{}}catch(e){return {}}}
function getPdcaDraftForRo(ro){
  const key=String(ro||'').trim();
  if(!key)return null;
  const drafts=getPdcaDrafts();
  const userKey=pdcaDraftUserKey();
  const exact=drafts[key+'@@'+userKey];
  if(exact)return exact;

  const target=normalizeAnswer(key).replace(/[^a-z0-9]/g,'');
  const sessionName=normalizeAnswer(getSession()?.name||'');
  const candidates=Object.values(drafts).filter(d=>{
    const dk=String(d?.ro||'').trim();
    const sameRo=normalizeAnswer(dk).replace(/[^a-z0-9]/g,'')===target;
    if(!sameRo)return false;
    if(d?.userKey)return d.userKey===userKey;
    // Compatibilidade com rascunhos das versões anteriores.
    return !d?.updatedBy || normalizeAnswer(d.updatedBy)===sessionName;
  });
  candidates.sort((a,b)=>String(b?.updatedAt||'').localeCompare(String(a?.updatedAt||'')));
  return candidates[0]||null;
}
function hasPdcaDraft(ro){
  const d=getPdcaDraftForRo(ro);
  if(!d)return false;
  const hasAnswer=Object.values(d.answers||{}).some(v=>String(v||'').trim());
  const hasAction=Array.isArray(d.actions)&&d.actions.some(x=>
    String(x?.action||'').trim()||String(x?.owner||'').trim()||String(x?.deadline||'').trim()
  );
  return hasAnswer||hasAction;
}
function pdcaActionLabel(ro){
  return isPdcaStarted(ro)?'Continuar a responder o PDCA':'Responder PDCA';
}
function pdcaDraftUserKey(){
  const s=getSession()||{};
  return normalizeAnswer(String(s.email||s.name||'usuario'))+'|'+normalizeAnswer(String(s.sector||s.setor||''));
}
function pdcaDraftStorageKey(ro){
  return String(ro||'').trim()+'@@'+pdcaDraftUserKey();
}
function getStartedPdcas(){
  try{return JSON.parse(localStorage.getItem(PDCA_STARTED_KEY)||'{}')||{}}
  catch(e){return {}}
}
function pdcaStartedKey(ro){
  return String(ro||'').trim()+'@@'+pdcaDraftUserKey();
}
function markPdcaStarted(ro){
  const key=String(ro||'').trim();
  if(!key)return;
  const map=getStartedPdcas();
  map[pdcaStartedKey(key)]={ro:key,userKey:pdcaDraftUserKey(),startedAt:new Date().toISOString()};
  safeStorageSet(PDCA_STARTED_KEY,JSON.stringify(map));
}
function clearPdcaStarted(ro){
  const map=getStartedPdcas();
  delete map[pdcaStartedKey(ro)];
  safeStorageSet(PDCA_STARTED_KEY,JSON.stringify(map));
}
function isPdcaStarted(ro){
  const map=getStartedPdcas();
  return Boolean(map[pdcaStartedKey(ro)]) || Boolean(getPdcaDraftForRo(ro));
}
function buildCurrentPdcaDraft(){
  if(!selected)return null;
  const ro=selected.numero||selected.id||selected.codigo;
  const userKey=pdcaDraftUserKey();
  return {
    id:'DRAFT-'+ro+'-'+userKey,
    ro,userKey,
    answers:{...answers},
    actions:pdcaExtraActions.map(x=>({...x})),
    updatedAt:new Date().toISOString(),
    updatedBy:getSession()?.name||''
  };
}
function savePdcaDraftLocal(){
  const draft=buildCurrentPdcaDraft();
  if(!draft)return false;
  markPdcaStarted(draft.ro);
  const drafts=getPdcaDrafts();
  drafts[pdcaDraftStorageKey(draft.ro)]=draft;
  safeStorageSet(PDCA_DRAFTS_KEY,JSON.stringify(drafts));
  const st=document.getElementById('pdcaDraftState');
  if(st)st.textContent='Rascunho salvo localmente às '+new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
  return draft;
}
function savePdcaDraftNow(){
 if(!nucleoFeatureRequire('pdca','respond'))return;
  const draft=savePdcaDraftLocal();
  if(!draft)return;
  portalBackendSave('pdca_drafts',draft.id,draft);
  const st=document.getElementById('pdcaDraftState');
  if(st)st.textContent=(navigator.onLine?'Rascunho salvo':'Rascunho salvo offline')+' às '+new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
  updateNetworkState();
}
function schedulePdcaDraftSave(){
  savePdcaDraftLocal();
  clearTimeout(pdcaDraftSaveTimer);
  pdcaDraftSaveTimer=setTimeout(savePdcaDraftNow,900);
}
function loadPdcaDraftForRo(ro){
  const draft=getPdcaDraftForRo(ro);
  if(!draft){
    answers={};
    pdcaExtraActions=[];
    return false;
  }
  answers={...(draft.answers||{})};
  pdcaExtraActions=Array.isArray(draft.actions)?draft.actions.map(x=>({...x})):[];
  return true;
}
function clearPdcaDraft(ro){
  const drafts=getPdcaDrafts();
  const d=getPdcaDraftForRo(ro);
  Object.keys(drafts).forEach(k=>{if(drafts[k]===d || k===pdcaDraftStorageKey(ro))delete drafts[k]});
  safeStorageSet(PDCA_DRAFTS_KEY,JSON.stringify(drafts));
  clearPdcaStarted(ro);
  if(d?.id)portalBackendDelete('pdca_drafts',d.id);
  portalBackendDelete('pdca_drafts',ro);
}

function parseResponsibleSectors(value){
  if(Array.isArray(value))return normalizeSectorList(value);
  return normalizeSectorList(String(value||'').split(/\s*\|\s*|[\n,;]+/));
}
function renderSectorCheckboxes(selected,onchangeExpr,group){
  const selectedKeys=new Set(parseResponsibleSectors(selected).map(normalizeAnswer));
  const sectors=getConfiguredSectors();
  return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(165px,1fr));gap:7px;margin-top:9px">
    ${sectors.map(s=>`<label style="display:flex;align-items:center;gap:8px;border:1px solid #dbe3ea;border-radius:9px;padding:8px 10px;background:#fff;cursor:pointer">
      <input type="checkbox" data-sector-group="${escapeHtml(group)}" value="${escapeHtml(s)}" ${selectedKeys.has(normalizeAnswer(s))?'checked':''} onchange="${onchangeExpr}">
      <span>${escapeHtml(s)}</span>
    </label>`).join('')}
  </div>`;
}
function collectSectorCheckboxes(group){
  return [...document.querySelectorAll(`input[data-sector-group="${group}"]:checked`)].map(el=>el.value);
}
function updatePdcaMainResponsibleSectors(){
  answers.p13=collectSectorCheckboxes('pdca-p13').join(' | ');
  updateCompletion();renderPdcaStageOverview();schedulePdcaDraftSave();refreshPdcaInlineAlerts();
}
function updateExtraActionResponsibleSectors(id){
  const a=pdcaExtraActions.find(x=>x.id===id);if(!a)return;
  const sectors=collectSectorCheckboxes('extra-'+id);
  a.responsibleSectors=sectors;
  a.owner=sectors.join(' | ');
  schedulePdcaDraftSave();
}
function renderPdcaResponsibleSectorQuestion(it,stage,global,answered){
  return `<div class="question" style="border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-bottom:12px;background:#fff">
    <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start">
      <div class="small" style="font-weight:700">Pergunta ${global} de 26 · ${stage.name}</div>
      <span class="status-badge ${answered?'answered':''}">${answered?'Respondida':'Obrigatória'}</span>
    </div>
    <h4 style="margin:7px 0 4px">${it[1]}</h4>
    <p style="margin:0;color:#667085">Selecione todos os setores que precisam executar ou acompanhar esta ação.</p>
    <div class="small" style="margin-top:7px;padding:9px 10px;border:1px solid #e2e8f0;border-radius:8px;background:#f8fafc">
      Cada setor selecionado receberá a ação como pendência. Setores adicionais poderão contestar a participação; o SGQ decidirá se a vinculação permanece.
    </div>
    ${renderSectorCheckboxes(answers.p13||'',"updatePdcaMainResponsibleSectors()",'pdca-p13')}
    <input id="answer_p13" type="hidden" value="${escapeHtml(answers.p13||'')}">
    ${pdcaInlineAlertHtml('p13')}
  </div>`;
}

function addPdcaAction(){
  pdcaExtraActions.push({id:'ACT-'+Date.now()+'-'+Math.random().toString(36).slice(2,6),action:'',owner:'',responsibleSectors:[],deadline:'',status:'pending',evidenceNote:''});
  renderPdcaActions();schedulePdcaDraftSave();
}
function removePdcaAction(id){pdcaExtraActions=pdcaExtraActions.filter(x=>x.id!==id);renderPdcaActions();schedulePdcaDraftSave()}
function updatePdcaAction(id,field,value){const a=pdcaExtraActions.find(x=>x.id===id);if(!a)return;a[field]=value;schedulePdcaDraftSave()}
function renderPdcaActions(){
  const box=document.getElementById('pdcaActionsList');if(!box)return;
  box.innerHTML=pdcaExtraActions.length?pdcaExtraActions.map((a,i)=>`
    <div class="pdca-action-row">
      <label><div class="label">Ação ${i+2}</div><textarea rows="2" oninput="updatePdcaAction('${a.id}','action',this.value)">${escapeHtml(a.action||'')}</textarea></label>
      <div><div class="label">Setores responsáveis</div>${renderSectorCheckboxes(a.responsibleSectors?.length?a.responsibleSectors:a.owner,`updateExtraActionResponsibleSectors('${a.id}')`,'extra-'+a.id)}</div>
      <label><div class="label">Prazo</div><input type="date" value="${escapeHtml(a.deadline||'')}" onchange="updatePdcaAction('${a.id}','deadline',this.value)"></label>
      <button class="btn secondary" type="button" onclick="removePdcaAction('${a.id}')">Remover</button>
    </div>`).join(''):'<div class="small" style="margin-top:10px">Nenhuma ação adicional.</div>';
}
function allPdcaActionsForRecord(p){
  const arr=[];const ans=p?.answers||{};
  if(String(ans.p11||'').trim()){
    const mainSectors=parseResponsibleSectors(ans.p13||p.setor);
    arr.push({id:(p.id||'PDCA')+'-A1',action:String(ans.p11||'').trim(),owner:mainSectors.join(' | '),responsibleSectors:mainSectors,primarySector:p.setor||'',deadline:String(ans.p12||'').trim(),pdcaId:p.id,ro:p.ro,setor:p.setor,evidenceNote:p.mainActionEvidenceNote||'',completedAt:p.mainActionCompletedAt||''});
  }
  (p?.actions||[]).forEach((x,idx)=>{
    if(String(x.action||'').trim()){
      const sectors=parseResponsibleSectors(x.responsibleSectors?.length?x.responsibleSectors:x.owner);
      arr.push({...x,owner:sectors.join(' | '),responsibleSectors:sectors,primarySector:p.setor||'',id:x.id||((p.id||'PDCA')+'-A'+(idx+2)),pdcaId:p.id,ro:p.ro,setor:p.setor});
    }
  });
  return arr;
}
function getRoTimeline(ro){
  if(!ro)return [];
  const id=String(ro.numero||ro.id||ro.codigo||'');const out=[];
  if(ro.data)out.push({at:ro.data,title:'R.O. registrada',text:ro.registrante?('Registrada por '+ro.registrante):'Ocorrência criada.'});
  const tri=getSavedTriageMap().get(id);
  if(tri?.triagedAt)out.push({at:tri.triagedAt,title:'Triagem do SGQ',text:tri.decision==='directed'?('Direcionada para '+(tri.responsibleSector||'setor')+(tri.responsibleUserName?' · '+tri.responsibleUserName:' · todo o setor')+' · criticidade '+(tri.criticality||'Média')):tri.decision==='record'?'Somente para registro':tri.decision==='obsolete'?'R.O. obsoleta':'R.O. cancelada'});
  getContestations().filter(c=>String(c.ro)===id).forEach(c=>{out.push({at:c.createdAt,title:'Contestação enviada',text:c.reason||''});if(c.reviewedAt)out.push({at:c.reviewedAt,title:c.status==='accepted'?'Contestação aceita':'Contestação rejeitada',text:c.reviewNote||''})});
  const sac=findExternalRoControlByRo(id);
  if(sac){
    if(sac.treatmentDefinedAt)out.push({at:sac.treatmentDefinedAt,title:'Classificação e encaminhamento definida',text:externalTreatmentLabel(sac.treatmentType)+(sac.treatmentDeadline?' · prazo '+formatDateBR(sac.treatmentDeadline):'')});
    if(Array.isArray(sac.deadlineHistory)){
      sac.deadlineHistory.forEach(h=>out.push({
        at:h.changedAt,
        title:'Prazo do SAC atualizado',
        text:(h.oldDeadline?formatDateBR(h.oldDeadline):'Sem prazo')+' → '+(h.newDeadline?formatDateBR(h.newDeadline):'Sem prazo')+(h.reason?' · '+h.reason:'')
      }));
    }
    if(sac.treatmentStartedAt)out.push({at:sac.treatmentStartedAt,title:'Classificação e encaminhamento iniciada',text:externalTreatmentLabel(sac.treatmentType)+' · prazo vigente '+formatDateBR(sac.treatmentDeadline)});
    if(sac.treatmentCompletedAt)out.push({at:sac.treatmentCompletedAt,title:'Classificação e encaminhamento concluída',text:externalTreatmentLabel(sac.treatmentType)});
  }
  getAllSentPdcas().filter(p=>String(p.ro)===id).forEach(p=>out.push({at:p.sentAt||p.envio,title:(p.id||'PDCA')+' enviado',text:'Resposta enviada por '+(p.responsavel||p.setor||'setor')}));
  return out.sort((a,b)=>String(a.at||'').localeCompare(String(b.at||'')));
}
function renderRoTimeline(){
  const box=document.getElementById('roTimeline');if(!box||!selected)return;
  const items=getRoTimeline(selected);
  box.innerHTML=items.length?items.map(x=>`<div class="timeline-item"><span class="timeline-dot2"></span><div class="timeline-card"><b>${escapeHtml(x.title)}</b><div class="small">${escapeHtml(formatDateTimeBR(x.at)||String(x.at||''))}</div>${x.text?`<div style="margin-top:4px">${escapeHtml(x.text)}</div>`:''}</div></div>`).join(''):'<div class="small">Sem movimentações registradas.</div>';
}
function renderGlobalSearch(){
  const input=document.getElementById('globalSearchInput'),panel=document.getElementById('globalSearchPanel');if(!input||!panel)return;
  const q=normalizeAnswer(input.value||'');if(q.length<2){panel.classList.add('hidden');panel.innerHTML='';return}
  const results=[];
  getAllRoRecords().forEach(ro=>{if(normalizeAnswer([ro.numero,ro.cliente,ro.descricao,ro.assunto,ro.setor].join(' ')).includes(q))results.push({kind:'ro',id:ro.numero||ro.id||ro.codigo,title:ro.numero||'R.O.',sub:[ro.cliente,ro.assunto].filter(Boolean).join(' · ')})});
  getAllSentPdcas().forEach(p=>{
    if(normalizeAnswer([p.id,p.ro,p.responsavel,p.setor,...Object.values(p.answers||{})].join(' ')).includes(q))results.push({kind:'pdca',id:p.id,title:p.id||'PDCA',sub:(p.ro||'')+' · '+(p.setor||'')});
    allPdcaActionsForRecord(p).forEach(a=>{if(normalizeAnswer([a.action,a.owner,a.ro,a.pdcaId].join(' ')).includes(q))results.push({kind:'action',id:p.id,title:'Ação · '+(a.ro||''),sub:a.action||''})});
  });
  getContestations().forEach(c=>{if(normalizeAnswer([c.ro,c.reason,c.reviewNote,c.user].join(' ')).includes(q))results.push({kind:'contest',id:c.id,title:'Contestação · '+c.ro,sub:c.reason||''})});
  panel.innerHTML=results.length?results.slice(0,20).map(r=>`<div class="global-search-item" onclick="openGlobalSearchResult('${r.kind}','${escapeHtml(String(r.id))}')"><b>${escapeHtml(r.title)}</b><div class="small">${escapeHtml(r.sub||'')}</div></div>`).join(''):'<div class="small" style="padding:16px">Nenhum resultado.</div>';
  panel.classList.remove('hidden');
}
function openGlobalSearchResult(kind,id){
  document.getElementById('globalSearchPanel')?.classList.add('hidden');
  if(kind==='ro'){openRO(id);return}
  if(kind==='pdca'||kind==='action'){const p=getAllSentPdcas().find(x=>String(x.id)===String(id));if(p){try{openPdcaQuickView(p.id)}catch(e){showSentPdcas()}}return}
  if(kind==='contest'){showContestations();return}
}
document.addEventListener('click',function(e){if(!e.target?.closest?.('.global-search-wrap'))document.getElementById('globalSearchPanel')?.classList.add('hidden')});
function getSavedRoFilters(){try{return JSON.parse(localStorage.getItem(SAVED_FILTERS_KEY)||'[]')||[]}catch(e){return []}}
function renderSavedRoFilters(){const sel=document.getElementById('savedRoFilters');if(!sel)return;const list=getSavedRoFilters();sel.innerHTML='<option value="">Filtros salvos...</option>'+list.map(f=>`<option value="${escapeHtml(f.id)}">${escapeHtml(f.name)}</option>`).join('')}
function saveCurrentRoFilter(){
  const name=prompt('Nome para este filtro:','Meu filtro');if(!name)return;
  const f={id:'FLT-'+Date.now(),name:name.trim(),q:document.getElementById('search')?.value||'',status:document.getElementById('filter')?.value||'todas',createdAt:new Date().toISOString(),userKey:notificationUserKey()};
  const list=getSavedRoFilters();list.push(f);localStorage.setItem(SAVED_FILTERS_KEY,JSON.stringify(list));portalBackendSave('saved_filters',f.id,f);renderSavedRoFilters();
}
function applySavedRoFilter(id){const f=getSavedRoFilters().find(x=>x.id===id);if(!f)return;const s=document.getElementById('search'),st=document.getElementById('filter');if(s)s.value=f.q||'';if(st)st.value=f.status||'todas';try{render()}catch(e){}}
function pendingRegistrationItems(){
  if(!isAdmin())return [];
  return getOperationalUsers()
    .filter(u=>!nucleoPersonPermissions(u).sgq&&u.approvalStatus==='pending')
    .sort((a,b)=>String(a.createdAt||'').localeCompare(String(b.createdAt||'')));
}

function pendingHubData(){
  const admin=isAdmin();
  const triageMap=getSavedTriageMap();
  const sent=getAllSentPdcas();
  const sentRos=new Set((Array.isArray(sent)?sent:[]).map(p=>String(p?.ro||p?.numeroRo||p?.roNumber||'').trim()));

  const roItems=getAllRoRecords()
    .filter(ro=>canAdminSeeAllPortalRecords()?true:canViewRO(ro))
    .filter(ro=>{
      const st=normalizeAnswer(ro.status||'');
      if(st.includes('cancel')||st.includes('somente para registro'))return false;
      const key=String(ro.numero||ro.id||ro.codigo||'').trim();
      const tri=resolvedTriageForRo(ro,triageMap);
      const triStatus=normalizeAnswer(tri?.status||tri?.decision||'');
      if(triStatus.includes('cancel')||triStatus.includes('somente para registro'))return false;
      if(sentRos.has(key))return false;
      return true;
    });

  const actions=actionDashboardItems().filter(x=>x.status.code!=='done');
  const contests=getContestations().filter(c=>c.status==='pending'&&(admin||sameSector(c.sector)));

  // Mantém a fila "Aguardando triagem" coerente com renderTriage().
  // Não use a chave base diretamente: direcionamentos multi-setor usam RO::Setor.
  const triagePending=admin?getTriageRecords().filter(r=>r.triagemStatus==='new'):[];

  const registrations=pendingRegistrationItems();
  return {roItems,actions,contests,triagePending,registrations};
}
async function showPendingHub(){
  view('pendingHubView');
  setNav('pendinghub');
  if(isAdmin()){
    try{await refreshPendingRegistrations(false)}catch(e){}
  }
  renderPendingHub();
}
function pendingHubRoDeadline(ro){
  const key=String(ro.numero||ro.id||ro.codigo||'').trim();
  const tri=getSavedTriageMap().get(key);
  const raw=tri?.pdcaDeadline||ro.prazo||'';
  const d=parseBrDate(raw);
  if(!d)return {label:'Sem prazo',className:'status-badge'};
  const today=new Date();today.setHours(0,0,0,0);
  const end=new Date(d.getFullYear(),d.getMonth(),d.getDate());
  const diff=Math.ceil((end-today)/86400000);
  if(diff<0)return {label:'Atrasado '+Math.abs(diff)+' dia(s)',className:'status-badge pending'};
  if(diff===0)return {label:'Vence hoje',className:'status-badge pending'};
  return {label:'Vence em '+diff+' dia(s)',className:'status-badge'};
}
function closeRegistrationSummary(){
  const ov=document.getElementById('registrationSummaryOverlay');
  if(ov)ov.classList.add('hidden');
}
function openRegistrationSummary(userKey){
  if(!isAdmin())return;
  const users=getOperationalUsers();
  const wanted=String(userKey||'').trim();
  const u=users.find(x=>String(x.email||x.name)===wanted);
  if(!u){
    alert('Não foi possível localizar esse cadastro.');
    return;
  }

  const title=document.getElementById('registrationSummaryTitle');
  const content=document.getElementById('registrationSummaryContent');
  const actions=document.getElementById('registrationSummaryActions');
  if(title)title.textContent=u.name||'Resumo do cadastro';

  if(content){
    content.innerHTML=`
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px">
        <div><div class="small">Nome</div><b>${escapeHtml(u.name||'—')}</b></div>
        <div><div class="small">Status</div><span class="status-badge pending">Aguardando aprovação</span></div>
        <div><div class="small">Unidade</div><b>${escapeHtml(portalUnitDisplay(u.unit))}</b></div>
        <div><div class="small">Setor</div><b>${escapeHtml(u.sector||'—')}</b></div>
        <div><div class="small">Tipo de acesso</div><b>${u.role==='admin'?'Administrador SGQ':'Usuário operacional'}</b></div>
        <div><div class="small">Solicitado em</div><b>${escapeHtml(formatDateTimeBR(u.createdAt)||'—')}</b></div>
      </div>
      ${u.email&&!String(u.email).endsWith('@local')?`<div style="margin-top:14px"><div class="small">E-mail</div><b>${escapeHtml(u.email)}</b></div>`:''}
    `;
  }

  if(actions){
    actions.innerHTML=`
      <button class="btn secondary" type="button" onclick="closeRegistrationSummary()">Fechar</button>
      <button class="btn secondary" type="button" onclick="openUserRegistrationEditor('${escapeHtml(u.email||u.name)}')">Editar cadastro</button>
      <button class="btn secondary" type="button" onclick="rejectPortalUser('${escapeHtml(u.email||u.name)}');closeRegistrationSummary()">Recusar</button>
      <button class="btn primary" type="button" onclick="approvePortalUser('${escapeHtml(u.email||u.name)}');closeRegistrationSummary()">Aprovar cadastro</button>
    `;
  }

  const ov=document.getElementById('registrationSummaryOverlay');
  if(ov)ov.classList.remove('hidden');
}

function renderPendingHubNotifications(){
  const host=document.getElementById('pendingHubNotifications');
  if(!host)return;

  const items=visibleNotifications()
    .slice()
    .sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')));

  const registrations=isAdmin()?pendingRegistrationItems():[];
  const read=getNotificationReadMap();
  const key=notificationUserKey();
  const seen=new Set(read[key]||[]);
  const unread=items.filter(n=>!seen.has(n.id)).length;

  const registrationHtml=registrations.map(u=>`
    <div class="notification-item unread" style="padding:14px 16px;background:#fffaf0;cursor:default">
      <span class="notification-dot"></span>
      <div>
        <div class="notification-title">Novo cadastro aguardando aprovação</div>
        <div><b>${escapeHtml(u.name||u.email||'Usuário')}</b> solicitou acesso ao Portal SGQ.</div>
        <div class="notification-meta">${escapeHtml(portalUnitDisplay(u.unit))} · ${escapeHtml(u.sector||'—')}${u.createdAt?' · '+escapeHtml(formatDateTimeBR(u.createdAt)||''):''}</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
          <button class="btn primary" type="button" onclick="event.stopPropagation();approvePortalUser('${escapeHtml(u.email||u.name)}')">Aprovar</button>
          <button class="btn secondary" type="button" onclick="event.stopPropagation();rejectPortalUser('${escapeHtml(u.email||u.name)}')">Recusar</button>
          <button class="btn secondary" type="button" onclick="event.stopPropagation();openRegistrationSummary('${escapeHtml(u.email||u.name)}')">Abrir cadastro</button>
        </div>
      </div>
    </div>`).join('');

  const normalHtml=items.map(n=>{
    const isRead=seen.has(n.id);
    return `<div class="notification-item ${isRead?'read':'unread'}" onclick="openNotification('${escapeHtml(n.id)}')" style="padding:14px 16px">
      <span class="notification-dot"></span>
      <div>
        <div class="notification-title">${escapeHtml(n.title||'Atualização')}</div>
        <div>${escapeHtml(n.message||'')}</div>
        <div class="notification-meta">${escapeHtml(formatDateTimeBR(n.createdAt)||'')}</div>
      </div>
    </div>`;
  }).join('');

  const pendingCount=unread+registrations.length;
  host.innerHTML=`
    <div class="card" style="padding:0;overflow:hidden">
      <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap;padding:14px 16px;border-bottom:1px solid #e8edf2">
        <div>
          <b style="font-size:16px">Notificações</b>
          <div class="small">${pendingCount?`${pendingCount} exigindo atenção${registrations.length?' · '+registrations.length+' cadastro(s) para aprovar':''}`:'Nenhuma nova notificação'}</div>
        </div>
        ${items.length?'<button class="btn secondary" type="button" onclick="markAllNotificationsRead()">Marcar notificações como lidas</button>':''}
      </div>
      <div>
        ${registrationHtml}
        ${normalHtml}
        ${!registrations.length&&!items.length?'<div class="small" style="padding:20px 16px">Nenhuma notificação para este usuário.</div>':''}
      </div>
    </div>`;
}

function renderPendingHub(){
  renderPendingHubNotifications();
  const d=pendingHubData();
  const sum=document.getElementById('pendingHubSummary');
  if(sum){
    const cards=[
      ['R.O.s / PDCAs pendentes',d.roItems.length],
      ['Ações abertas',d.actions.length],
      ['Contestações em análise',d.contests.length]
    ];
    if(isAdmin()){
      cards.push(['Cadastros para aprovar',d.registrations.length]);
      cards.push(['Aguardando triagem',d.triagePending.length]);
    }
    sum.innerHTML=cards.map(([k,v])=>`<div class="pending-hub-card"><div class="small">${escapeHtml(k)}</div><b style="font-size:28px">${v}</b></div>`).join('');
  }

  const details=document.getElementById('pendingHubDetails');
  if(!details)return;

  const roHtml=d.roItems.map(ro=>{
    const dl=pendingHubRoDeadline(ro);
    const key=String(ro.numero||ro.id||ro.codigo||'');
    return `<div class="card" style="padding:14px;min-width:0">
      <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;flex-wrap:wrap">
        <div><b>${escapeHtml(ro.numero||'R.O.')}</b><div class="small">${escapeHtml(ro.cliente||'—')}</div></div>
        <span class="${dl.className}">${escapeHtml(dl.label)}</span>
      </div>
      <div class="small" style="margin-top:8px">${escapeHtml((ro.setor&&ro.setor!=='Não direcionado')?ro.setor:'Setor não definido')} · ${escapeHtml(ro.status||'PDCA pendente')}</div>
      <div style="margin-top:10px"><button class="btn secondary" type="button" onclick="openRO('${escapeHtml(key)}')">Abrir R.O.</button></div>
    </div>`;
  }).join('');

  const actionHtml=d.actions.map(x=>`<div class="card" style="padding:14px;min-width:0">
    <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap">
      <div><b>${escapeHtml(x.ro||'R.O.')} · Ação</b><div class="small">${escapeHtml(x.acao||'—')}</div></div>
      <span class="status-badge pending">${escapeHtml(x.status?.label||'Pendente')}</span>
    </div>
    <div style="margin-top:10px"><button class="btn secondary" type="button" onclick="showActionsDashboard()">Abrir ações</button></div>
  </div>`).join('');

  const contestHtml=d.contests.map(c=>`<div class="card" style="padding:14px;min-width:0">
    <div><b>${escapeHtml(c.ro||'R.O.')} · Contestação</b><div class="small">${escapeHtml(c.justification||c.reason||'Aguardando análise')}</div></div>
    <div style="margin-top:10px"><button class="btn secondary" type="button" onclick="${isAdmin()?'showContestations()':'showPendingHub()'}">Ver contestação</button></div>
  </div>`).join('');

  const registrationHtml=isAdmin()?d.registrations.map(u=>`<div class="card" style="padding:14px;min-width:0;border-color:#f0d49a;background:#fffaf0">
    <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;flex-wrap:wrap">
      <div>
        <b>${escapeHtml(u.name||u.email||'Usuário')}</b>
        <div class="small">${escapeHtml(portalUnitDisplay(u.unit))} · ${escapeHtml(u.sector||'—')}</div>
        <div class="small" style="margin-top:4px">${escapeHtml(u.email||'')}</div>
      </div>
      <span class="status-badge pending">Aguardando aprovação</span>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:12px">
      <button class="btn primary" type="button" onclick="approvePortalUser('${escapeHtml(u.email||u.name)}')">Aprovar</button>
      <button class="btn secondary" type="button" onclick="rejectPortalUser('${escapeHtml(u.email||u.name)}')">Rejeitar</button>
      <button class="btn secondary" type="button" onclick="openRegistrationSummary('${escapeHtml(u.email||u.name)}')">Abrir cadastro</button>
    </div>
  </div>`).join(''):'';
  const triageHtml=isAdmin()?d.triagePending.map(ro=>`<div class="card" style="padding:14px;min-width:0">
    <div><b>${escapeHtml(ro.numero||'R.O.')} · Triagem</b><div class="small">${escapeHtml(ro.cliente||'—')}</div></div>
    <div style="margin-top:10px"><button class="btn secondary" type="button" onclick="showTriage()">Abrir triagem</button></div>
  </div>`).join(''):'';

  const total=d.roItems.length+d.actions.length+d.contests.length+(isAdmin()?d.triagePending.length+d.registrations.length:0);
  details.innerHTML=total?`
    ${d.roItems.length?`<h3>R.O.s / PDCAs pendentes <span class="small">(${d.roItems.length})</span></h3><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:10px">${roHtml}</div>`:''}
    ${d.actions.length?`<h3 style="margin-top:22px">Ações abertas <span class="small">(${d.actions.length})</span></h3><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:10px">${actionHtml}</div>`:''}
    ${d.contests.length?`<h3 style="margin-top:22px">Contestações em análise <span class="small">(${d.contests.length})</span></h3><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:10px">${contestHtml}</div>`:''}
    ${isAdmin()&&d.registrations.length?`<h3 style="margin-top:22px">Cadastros aguardando aprovação <span class="small">(${d.registrations.length})</span></h3><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:10px">${registrationHtml}</div>`:''}
    ${isAdmin()&&d.triagePending.length?`<h3 style="margin-top:22px">Aguardando triagem <span class="small">(${d.triagePending.length})</span></h3><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:10px">${triageHtml}</div>`:''}
  `:'<div class="card" style="padding:24px"><b>Nenhuma pendência encontrada.</b><div class="small" style="margin-top:6px">Não há itens exigindo ação no seu acesso neste momento.</div></div>';
}
async function refreshPendingHub(){
  processDeadlineAlerts(false);
  if(isAdmin()){
    try{await refreshPendingRegistrations(false)}catch(e){}
  }
  renderPendingHub();
  refreshNotificationBell();
}

function processDeadlineAlerts(showMessage=false){
  const stamp=new Date().toISOString().slice(0,10);let state={};try{state=JSON.parse(localStorage.getItem(DEADLINE_ALERTS_KEY)||'{}')||{}}catch(e){}
  const reminder=getRuleNumber('rulePdcaReminderDays',2,0,90),escalation=getRuleNumber('ruleEscalationDays',3,0,90);let created=0;
  getAllRoRecords().forEach(ro=>{
    if(!isAdmin()&&!canViewRO(ro))return;
    const tri=getSavedTriageMap().get(String(ro.numero||ro.id||ro.codigo||''));const d=parseBrDate(tri?.pdcaDeadline||ro.prazo||'');if(!d)return;
    const today=new Date();today.setHours(0,0,0,0);const end=new Date(d.getFullYear(),d.getMonth(),d.getDate());const diff=Math.ceil((end-today)/86400000);
    let key='',title='';if(diff<0&&Math.abs(diff)>=escalation){key='esc';title='PDCA atrasado · escalonamento'}else if(diff<0){key='over';title='PDCA atrasado'}else if(diff<=reminder){key='soon';title=diff===0?'PDCA vence hoje':'PDCA próximo do prazo'}if(!key)return;
    const id=(ro.numero||'RO')+'|'+key+'|'+stamp+'|'+notificationUserKey();if(state[id])return;
    createNotification({type:'deadline',audience:isAdmin()?'admin':'sector',sector:tri?.responsibleSector||ro.setor||'',ro:ro.numero||'',title,message:(ro.numero||'R.O.')+(diff<0?' está atrasada há '+Math.abs(diff)+' dia(s).':' vence em '+diff+' dia(s).')});state[id]=1;created++;
  });
  localStorage.setItem(DEADLINE_ALERTS_KEY,JSON.stringify(state));if(showMessage)alert(created?created+' alerta(s) atualizado(s).':'Nenhum novo alerta de prazo.');refreshNotificationBell();
}
const NUCLEO_DEFAULT_API_URL='https://script.google.com/macros/s/AKfycbyCl5Cor0mqj0J5m00WfvqoQ6CE_5HJrep9O0DOjpoFHp2DGxYkP62zDpLggr8GmPS2kA/exec';
const PORTAL_BACKEND_STATE_KEY='portal-sgq-backend-state-v1';
const PORTAL_BACKEND_LAST_SYNC_KEY='portal-sgq-backend-last-sync-v1';
let portalBackendSyncInProgress=false;
window.addEventListener('online',()=>setTimeout(retryPendingRncDeletes,300));

function portalApiBase(){
  return String(NUCLEO_DEFAULT_API_URL||'').trim().replace(/\/+$/,'');
}
function portalBackendEnabled(){
  return /^https:\/\/script\.google\.com\/macros\/s\//i.test(portalApiBase());
}

function portalBase64EncodeJson(obj){
  const json=JSON.stringify(obj||{});
  return btoa(unescape(encodeURIComponent(json))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
function portalJsonp(params,timeoutMs=60000){
  return new Promise((resolve,reject)=>{
    const base=portalApiBase();
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
    const actionName=String(requestParams.acao||'').toLowerCase();
    const sessionToken=String(getSession()?.authToken||'').trim();
    if(sessionToken && !requestParams.token && !['portal_login','portal_login_jsonp','portal_register_user'].includes(actionName)){
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
  if(!portalBackendEnabled())return false;
  const params={acao:'portal_save',colecao:collection,id:String(id||''),dados:JSON.stringify(data||{}),ator:getSession()?.name||'Sistema'};
  if(!navigator.onLine){queueOfflineOperation({kind:'save',params});return true}
  const ok=portalPostForm(params);
  if(!ok)queueOfflineOperation({kind:'save',params});
  return ok;
}
async function portalBackendSaveConfirmed(collection,id,data){
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

    // O updatedAt é criado no exato momento deste salvamento.
    // Isso impede que uma versão antiga já existente na planilha seja
    // confundida com a nova gravação.
    if(expectedUpdatedAt){
      return String(registro.updatedAt||'').trim()===expectedUpdatedAt;
    }

    // Fallback para registros antigos que não possuam updatedAt.
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
  const colecaoKey=String(collection||'').trim();
  const idKey=String(id||'').trim();
  if(colecaoKey==='triage')return nucleoDeleteTriageConfirmed(idKey);

  if(colecaoKey!=='admin_modules'||!idKey){
    throw new Error('RNC inválida para exclusão.');
  }

  // A exclusão no Apps Script é idempotente. O clique não precisa depender
  // de uma resposta JSONP que pode falhar por cache/sessão do navegador.
  // Marca como excluída localmente primeiro e envia o POST em seguida.
  markRncDeletedLocally(idKey);

  if(portalBackendEnabled()&&navigator.onLine){
    portalSendPendingRncDelete(idKey);
  }

  return {sucesso:true,excluido:true,pendenteCentral:true};
}

function portalBackendDelete(collection,id){
  if(!portalBackendEnabled())return false;
  const params={acao:'portal_delete',colecao:collection,id:String(id||''),ator:getSession()?.name||'Sistema'};
  if(!navigator.onLine){queueOfflineOperation({kind:'delete',params});return true}
  const ok=portalPostForm(params);
  if(!ok)queueOfflineOperation({kind:'delete',params});
  return ok;
}
function portalUpdateRoSheet(ro,campos){
  if(!portalBackendEnabled()||!ro)return false;
  const params={
    acao:'portal_update_ro_sheet',
    ro:String(ro||''),
    origem:roOriginFromNumber(ro,''),
    campos:JSON.stringify(campos||{}),
    ator:getSession()?.name||'Portal SGQ'
  };
  if(!navigator.onLine){
    queueOfflineOperation({kind:'ro_sheet_update',params});
    return true;
  }
  const ok=portalPostForm(params);
  if(!ok)queueOfflineOperation({kind:'ro_sheet_update',params});
  return ok;
}

async function portalUpdateRoSheetConfirmed(ro,campos){
  if(!portalBackendEnabled())throw new Error('Apps Script não configurado.');
  const res=await portalJsonp({
    acao:'portal_update_ro_sheet',
    ro:String(ro||''),
    origem:roOriginFromNumber(ro,''),
    campos:JSON.stringify(campos||{}),
    ator:getSession()?.name||'Núcleo'
  },25000);
  if(!res?.sucesso)throw new Error(res?.erro||'A planilha não confirmou a atualização.');
  return res;
}

// ===== NÚCLEO: estado compartilhado central =====
// Dados operacionais nunca dependem apenas deste navegador. O localStorage abaixo
// funciona somente como cache; a cópia oficial fica em SGQ_ESTADO_COMPARTILHADO.
const NUCLEO_SHARED_GLOBAL_KEYS=new Set([
  'ro-pdca-access-v2',
  'portal-sgq-deadline-alerts-v1',
  'ro-pdca-sector-emails-v1',
  'ro-pdca-deleted-users-v1',
  'nucleo-sector-aliases-v1',
  'ro-pdca-presentations-v1',
  'nucleo-ro-origin-registry-v1',
  'nucleo-hidden-assigned-directions-v1'
]);
const NUCLEO_SHARED_USER_KEYS=new Set([
  'ro-pdca-notifications-v1',
  'ro-pdca-notification-read-v1',
  'portal-sgq-pdca-started-v1'
]);
let nucleoApplyingCentralState=false;
const nucleoNativeStorageSetItem=Storage.prototype.setItem;
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
Storage.prototype.setItem=function(key,value){
  const result=nucleoNativeStorageSetItem.call(this,key,value);
  if(this===localStorage)try{nucleoPersistSharedState(String(key),String(value))}catch(e){console.warn('Falha ao persistir estado compartilhado:',e)}
  return result;
};
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
  if(Array.isArray(data.pdcaDispatches))localStorage.setItem('nucleo-pdca-dispatches-v1',JSON.stringify(data.pdcaDispatches));
  if(Array.isArray(data.claimantBindings))localStorage.setItem('nucleo-claimant-bindings-v1',JSON.stringify(data.claimantBindings));
  // A base central vence qualquer cache antigo deste navegador.
  nucleoApplySharedState(data.sharedState);
  if(data.config && typeof data.config==='object'){
    const localIntegration=getSavedIntegrationSettings();
    const mergedConfig={
      ...data.config,
      apiUrl:localIntegration.apiUrl||data.config.apiUrl||'',
      apiKey:localIntegration.apiKey||data.config.apiKey||'',
      autoSync:data.config.autoSync??localIntegration.autoSync??'0',
      roSyncPeriod:data.config.roSyncPeriod??localIntegration.roSyncPeriod??'all',
      roSyncDateFrom:data.config.roSyncDateFrom??localIntegration.roSyncDateFrom??'',
      roSyncDateTo:data.config.roSyncDateTo??localIntegration.roSyncDateTo??''
    };
    localStorage.setItem(ADMIN_CONFIG_KEY,JSON.stringify(mergedConfig));

    const persistedIntegration={
      apiUrl:mergedConfig.apiUrl,
      apiKey:mergedConfig.apiKey,
      autoSync:mergedConfig.autoSync,
      roSyncPeriod:mergedConfig.roSyncPeriod,
      roSyncDateFrom:mergedConfig.roSyncDateFrom,
      roSyncDateTo:mergedConfig.roSyncDateTo,
      savedAt:localIntegration.savedAt||new Date().toISOString()
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
    // Não deixa uma sincronização central atrasada apagar uma contestação
    // que acabou de ser criada neste navegador.
    const localContestations=getContestations();
    const byId=new Map();

    [...data.contestations,...localContestations].forEach(c=>{
      if(!c?.id)return;
      const key=String(c.id);
      const prev=byId.get(key);
      if(!prev){
        byId.set(key,c);
        return;
      }

      const prevTime=Date.parse(prev.reviewedAt||prev.updatedAt||prev.createdAt||0)||0;
      const curTime=Date.parse(c.reviewedAt||c.updatedAt||c.createdAt||0)||0;
      if(curTime>=prevTime)byId.set(key,c);
    });

    const merged=[...byId.values()]
      .sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')));
    localStorage.setItem(CONTEST_KEY,JSON.stringify(merged));
  }
  if(Array.isArray(data.users) && data.users.length){
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
  if(Array.isArray(data.pdcaSent)){localStorage.setItem(SENT_PDCA_KEY,JSON.stringify(data.pdcaSent));try{localStorage.setItem(SENT_PDCA_KEY,JSON.stringify(data.pdcaSent))}catch(e){}}
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
  if(portalBackendSyncInProgress)return false;
  if(!portalBackendEnabled()){
    if(showMessage)alert('Configure primeiro a URL do Apps Script em Administração → Integração.');
    updateBackendStatus(false,'Apps Script não configurado.');
    return false;
  }
  const foreground=!!(showMessage||options.foreground);
  portalBackendSyncInProgress=true;
  updateBackendStatus(null,'Sincronizando...');
  if(foreground)await showNucleoLoading(options.loadingMessage||'Carregando dados da base central...','Carregando NÚCLEO');
  try{
    const res=await portalJsonp({acao:'portal_load'});
    if(res?.sucesso===false)throw new Error(res.erro||'Falha ao carregar base central.');
    applyPortalBackendSnapshot(res);
    updateBackendStatus(true,'Base central conectada.');

    // Atualizações leves acontecem imediatamente. Renderizações grandes ficam fora
    // do caminho crítico para o navegador não congelar a cada sincronização automática.
    try{
      refreshSectorSelectors();
      refreshExternalRoSidebarBadge();
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

    if(showMessage)alert('Base central sincronizada.');
    return true;
  }catch(e){
    updateBackendStatus(false,e.message||String(e));
    if(showMessage)alert('Não foi possível sincronizar: '+(e.message||e));
    return false;
  }finally{
    if(foreground)hideNucleoLoading(true);
    portalBackendSyncInProgress=false;
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

const RULE_AUDIT_KEY='portal-sgq-rule-audit-v1';
const RULE_DEFAULTS={
  rulePdcaRequireAll:'Sim',
  rulePdcaDefaultDays:'7',
  ruleEscalationDays:'3',
  rulePdcaReminderDays:'2',
  ruleContestSuspends:'Sim',
  ruleContestRejectNoteRequired:'Sim',
  ruleContestAcceptCloses:'Sim',
  ruleActionCompletionThreshold:'3',
  ruleActionRequireSgq:'Sim',
  ruleActionOverdueGraceDays:'0',
  ruleNotificationLimit:'400',
  ruleEmailDirectedRo:'Sim',
  ruleEmailContestAdmin:'Sim',
  ruleEmailContestSector:'Sim',
  ruleEmailPdcaAdmin:'Sim',
  ruleUseC1:'Sim',
  ruleUseC2:'Sim',
  ruleUseA1:'Sim',
  ruleUseA3:'Sim'
};

function splitNotificationEmails(value){
  return [...new Set(String(value||'').split(/[\n,;]+/).map(v=>v.trim()).filter(Boolean))];
}
function notificationEmailValue(value){
  return splitNotificationEmails(value).join(',');
}
function getAdminConfig(){
  try{return JSON.parse(localStorage.getItem(ADMIN_CONFIG_KEY)||'{}')||{}}
  catch(e){return {}}
}
function getRule(id){
  const c=getAdminConfig();
  const v=c[id];
  return (v===undefined||v===null||v==='')?RULE_DEFAULTS[id]:v;
}
function getRuleYes(id){return String(getRule(id)||'Sim')==='Sim'}
function getRuleNumber(id,fallback,min,max){
  let n=Number(getRule(id));
  if(!Number.isFinite(n))n=fallback;
  if(Number.isFinite(min))n=Math.max(min,n);
  if(Number.isFinite(max))n=Math.min(max,n);
  return n;
}
function getRuleAudit(){
  try{
    const a=JSON.parse(localStorage.getItem(RULE_AUDIT_KEY)||'[]');
    return Array.isArray(a)?a:[];
  }catch(e){return []}
}
function addRuleAudit(changes){
  if(!changes?.length)return;
  const list=getRuleAudit();
  list.unshift({
    id:'AUD-'+Date.now(),
    at:new Date().toISOString(),
    by:getSession()?.name||'Administrador',
    changes
  });
  localStorage.setItem(RULE_AUDIT_KEY,JSON.stringify(list.slice(0,100)));
}
function restoreRuleDefaults(){
  if(!isAdmin())return;
  if(!confirm('Restaurar somente as regras do sistema para os valores padrão?'))return;
  Object.entries(RULE_DEFAULTS).forEach(([id,value])=>{
    const el=document.getElementById(id);
    if(el)el.value=value;
  });
  renderEffectiveRulesSummary();
}
function renderEffectiveRulesSummary(){
  const box=document.getElementById('effectiveRulesSummary');
  if(!box)return;
  const val=id=>document.getElementById(id)?.value??getRule(id);
  const cards=[
    ['Envio do PDCA',val('rulePdcaRequireAll')==='Sim'?'26 respostas obrigatórias':'Pode enviar com respostas pendentes'],
    ['Prazo padrão',val('rulePdcaDefaultDays')+' dias após direcionamento'],
    ['Contestação',val('ruleContestSuspends')==='Sim'?'Suspende o PDCA':'Não suspende o PDCA'],
    ['Conclusão de ação','Sugestão com '+val('ruleActionCompletionThreshold')+' sinais'],
    ['Conferência SGQ',val('ruleActionRequireSgq')==='Sim'?'Obrigatória':'Conclusão automática permitida'],
    ['Notificações','Até '+val('ruleNotificationLimit')+' armazenadas']
  ];
  box.innerHTML=cards.map(([k,v])=>`<div class="rule-summary-card"><small>${escapeHtml(k)}</small><b>${escapeHtml(v)}</b></div>`).join('');
}
function renderRuleAudit(){
  const box=document.getElementById('ruleAuditList');
  if(!box)return;
  const list=getRuleAudit().slice(0,20);
  box.innerHTML=list.length?list.map(x=>`<div class="rule-audit-item"><b>${escapeHtml(formatDateTimeBR(x.at)||'')}</b> · ${escapeHtml(x.by||'ADM')}<div class="small">${escapeHtml((x.changes||[]).join(' · '))}</div></div>`).join(''):'<div class="small">Nenhuma alteração registrada ainda.</div>';
}
function loadRuleCenter(){
  Object.entries(RULE_DEFAULTS).forEach(([id,def])=>{
    const el=document.getElementById(id);
    if(el)el.value=String(getRule(id)??def);
  });
  renderEffectiveRulesSummary();
  renderRuleAudit();
}
function addDaysIso(days){
  const d=new Date();
  d.setHours(12,0,0,0);
  d.setDate(d.getDate()+Number(days||0));
  return d.toISOString().slice(0,10);
}

document.addEventListener('change',function(e){
  if(e.target && e.target.closest && e.target.closest('#cfgRules')){
    renderEffectiveRulesSummary();
  }
});

let currentPdfBlob=null;
let currentPdfUrl=null;
let currentPdfFilename='PDCA.pdf';



const NOTIFICATION_KEY='ro-pdca-notifications-v1';
const NOTIFICATION_READ_KEY='ro-pdca-notification-read-v1';
const SECTOR_EMAIL_KEY='ro-pdca-sector-emails-v1';

function notificationUserKey(){
  const s=getSession();
  if(!s)return 'anonymous';
  return String(s.email||((s.name||'')+'|'+(s.sector||''))).trim().toLowerCase();
}

function getNotifications(){
  try{
    const arr=JSON.parse(localStorage.getItem(NOTIFICATION_KEY)||'[]');
    return Array.isArray(arr)?arr:[];
  }catch(e){return []}
}
function saveNotifications(arr){
  localStorage.setItem(NOTIFICATION_KEY,JSON.stringify(arr.slice(0,getRuleNumber('ruleNotificationLimit',400,50,2000))));
}
function getNotificationReadMap(){
  try{return JSON.parse(localStorage.getItem(NOTIFICATION_READ_KEY)||'{}')||{}}
  catch(e){return {}}
}
function isNotificationForCurrentUser(n){
  const s=getSession();
  if(!s)return false;
  if(['admin','quality'].includes(s.role))return n.audience==='admin'||n.audience==='all';
  if(n.audience==='all')return true;
  if(n.audience==='user' && n.userKey===notificationUserKey())return true;
  if(n.audience==='sector' && (sameSector(n.sector)||managesSector(n.sector)))return true;
  if(n.audience==='complainant'){
    const ro=getAllRoRecords().find(r=>String(r.numero||r.id||r.codigo||'')===String(n.ro||''));
    return !!(ro&&wasRoSubmittedByCurrentUser(ro));
  }
  if(n.audience==='representative'){
    if(n.representativeEmail && s.email){
      return String(n.representativeEmail).trim().toLowerCase()===String(s.email).trim().toLowerCase();
    }
    return normalizeAnswer(n.representative||'')===normalizeAnswer(s.name||'');
  }
  return false;
}
function visibleNotifications(){
  // Cadastros pendentes também são notificações reais para o SGQ.
  const registrationNotifications=isAdmin()?pendingRegistrationItems().map(u=>({
    id:'registration:'+String(u.email||u.name||''),
    type:'registration',audience:'admin',
    title:'Novo cadastro aguardando aprovação',
    message:(u.name||'Novo usuário')+' · '+(u.sector||'Setor não informado'),
    createdAt:u.createdAt||new Date().toISOString(),
    userKey:u.email||u.name||''
  })):[];
  const merged=[...getNotifications(),...getCentralRepresentativeNotifications(),...registrationNotifications];
  const seen=new Set();
  return merged.filter(n=>{
    if(!n?.id||seen.has(String(n.id)))return false;
    seen.add(String(n.id));
    return isNotificationForCurrentUser(n);
  }).sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')));
}
function unreadNotificationCount(){
  const read=getNotificationReadMap();
  const key=notificationUserKey();
  return visibleNotifications().filter(n=>!(read[key]||[]).includes(n.id)).length;
}

function notificationMenuId(n){
  const admin=isAdmin();

  if(n?.audience==='representative' || n?.type==='sac'){
    return admin?'navExternalRoControl':'navMySacs';
  }

  if(n?.type==='contest'){
    return admin?'navContests':'navRos';
  }
  if(n?.type==='registration'){
    return admin?'navAdmin':'navPendingHub';
  }

  if(n?.type==='pdca'){
    if(admin)return 'navSent';
    // Para o reclamante, o retorno pertence às R.O.s cadastradas por ele.
    if(n?.audience==='complainant')return 'navMySubmittedRos';
    return 'navSent';
  }

  if(n?.type==='action'){
    return admin?'navPendingActions':'navActions';
  }

  if(n?.type==='ro'){
    if(n?.audience==='complainant')return 'navMySubmittedRos';
    return admin?'navTriage':'navRos';
  }

  if(n?.type==='announcement'){
    return admin?'navAnnouncements':'navPendingHub';
  }

  // Avisos gerais ficam na central de pendências do usuário.
  return 'navPendingHub';
}

function ensureMenuNotificationBadge(navId){
  const nav=document.getElementById(navId);
  if(!nav)return null;

  let badge=nav.querySelector('.menu-notification-badge');

  // Aproveita as bolinhas já existentes de PDCA/Contestação.
  if(!badge){
    if(navId==='navSent')badge=document.getElementById('pdcaSidebarBadge');
    else if(navId==='navContests')badge=document.getElementById('contestSidebarBadge');
  }

  if(!badge){
    badge=document.createElement('span');
    badge.className='side-pending-badge menu-notification-badge hidden';
    badge.textContent='0';
    nav.appendChild(badge);
  }else{
    badge.classList.add('menu-notification-badge');
  }

  return badge;
}

function pendingTriageCount(){
  if(!isAdmin())return 0;
  const triageMap=getSavedTriageMap();
  return getAllRoRecords().filter(ro=>roNeedsTriage(ro,triageMap)).length;
}

function refreshMenuNotificationBadges(){
  const s=getSession();
  if(!s)return;

  const read=getNotificationReadMap();
  const key=notificationUserKey();
  const seen=new Set(read[key]||[]);
  const counts={};

  visibleNotifications().forEach(n=>{
    if(seen.has(n.id))return;
    const navId=notificationMenuId(n);
    if(!navId)return;
    counts[navId]=(counts[navId]||0)+1;
  });

  const candidateIds=[
    'navRos','navMySubmittedRos','navSent','navActions','navPendingHub',
    'navPendingActions','navTriage','navExternalRoControl','navMySacs','navSacTracking','navContests','navAnnouncements','navEquipment','navTraining','navNcCapa','navDocuments','navProcesses','navAdmin'
  ];

  candidateIds.forEach(navId=>{
    const nav=document.getElementById(navId);
    if(!nav)return;
    const badge=ensureMenuNotificationBadge(navId);
    if(!badge)return;
    let count=counts[navId]||0;

    // Triagem é uma pendência operacional: mostra TODAS as R.O.s ainda sem
    // direcionamento, mesmo que a notificação correspondente já tenha sido lida.
    if(navId==='navTriage' && isAdmin())count=pendingTriageCount();
    if(navId==='navExternalRoControl' && isAdmin())count=externalRoPendingCount();

    badge.textContent=count>99?'99+':String(count);
    badge.classList.toggle('hidden',count===0);
  });
}
function refreshNotificationBell(){
  const badge=document.getElementById('notificationCountBadge');
  const count=unreadNotificationCount();
  if(badge){
    badge.textContent=count>99?'99+':String(count);
    badge.classList.toggle('hidden',count===0);
  }
  try{refreshMenuNotificationBadges()}catch(e){console.warn('Falha ao atualizar bolinhas dos menus.',e)}
}
function renderNotificationPanel(){
  const list=document.getElementById('notificationList');
  const sub=document.getElementById('notificationPanelSubtitle');
  if(!list)return;
  const items=visibleNotifications().sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt)));
  const read=getNotificationReadMap();
  const key=notificationUserKey();
  const seen=new Set(read[key]||[]);
  const unread=items.filter(n=>!seen.has(n.id)).length;
  if(sub)sub.textContent=unread?unread+' nova'+(unread===1?'':'s'):'Nenhuma nova notificação';

  list.innerHTML=items.length?items.map(n=>{
    const isRead=seen.has(n.id);
    return `<div class="notification-item ${isRead?'read':'unread'}" onclick="openNotification('${escapeHtml(n.id)}')">
      <span class="notification-dot"></span>
      <div>
        <div class="notification-title">${escapeHtml(n.title||'Atualização')}</div>
        <div>${escapeHtml(n.message||'')}</div>
        <div class="notification-meta">${escapeHtml(formatDateTimeBR(n.createdAt)||'')}</div>
      </div>
    </div>`;
  }).join(''):'<div class="small" style="padding:24px;text-align:center">Nenhuma notificação para este usuário.</div>';
}
function toggleNotificationPanel(event){
  if(event)event.stopPropagation();
  const panel=document.getElementById('notificationPanel');
  if(!panel)return;
  panel.classList.toggle('hidden');
  if(!panel.classList.contains('hidden'))renderNotificationPanel();
}
document.addEventListener('click',function(e){
  const panel=document.getElementById('notificationPanel');
  const bell=document.getElementById('notificationBellBtn');
  if(!panel||panel.classList.contains('hidden'))return;
  if(panel.contains(e.target)||bell?.contains(e.target))return;
  panel.classList.add('hidden');
});
function markNotificationRead(id){
  const read=getNotificationReadMap();
  const key=notificationUserKey();
  const arr=new Set(read[key]||[]);
  arr.add(String(id));
  read[key]=[...arr].slice(-500);
  localStorage.setItem(NOTIFICATION_READ_KEY,JSON.stringify(read));
  refreshNotificationBell();
  refreshMenuNotificationBadges();
  try{renderPendingHubNotifications()}catch(e){}
}
function markAllNotificationsRead(){
  const read=getNotificationReadMap();
  const key=notificationUserKey();
  read[key]=visibleNotifications().map(n=>n.id);
  localStorage.setItem(NOTIFICATION_READ_KEY,JSON.stringify(read));
  refreshNotificationBell();
  refreshMenuNotificationBadges();
  renderNotificationPanel();
  try{renderPendingHubNotifications()}catch(e){}
}
function openNotification(id){
  const n=visibleNotifications().find(x=>String(x.id)===String(id));
  if(!n)return;
  markNotificationRead(id);
  renderNotificationPanel();

  if(n.audience==='representative' || n.type==='sac'){
    showMySacs();
    return;
  }

  if(n.ro){
    if(n.audience==='complainant'){
      const ro=getAllRoRecords().find(r=>String(r.numero||r.id||r.codigo||'')===String(n.ro));
      if(ro&&wasRoSubmittedByCurrentUser(ro)){openSubmittedRoTracking(n.ro);return}
    }
    if(n.audience==='sector'){
      const ro=getAllRoRecords().find(r=>String(r.numero||r.id||r.codigo||'')===String(n.ro));
      if(ro&&canViewRO(ro)){openRO(n.ro);return}
    }
  }
  if(n.type==='contest'&&isAdmin()){showContestations();return}
  if(n.type==='pdca'&&isAdmin()){showSentPdcas();return}
  if(n.type==='action'&&isAdmin()){showPendingActions();return}
}

function getSectorEmailMap(){
  try{return JSON.parse(localStorage.getItem(SECTOR_EMAIL_KEY)||'{}')||{}}
  catch(e){return {}}
}
function saveSectorEmailMap(map){
  localStorage.setItem(SECTOR_EMAIL_KEY,JSON.stringify(map||{}));
}

function emailForSector(sector,unit){
  const wanted=normalizeAnswer(String(sector||''));
  if(!wanted)return '';

  // Os e-mails dos setores vêm dos usuários cadastrados/aprovados.
  // Se houver mais de uma pessoa no setor, todos os e-mails corporativos
  // válidos daquele setor entram como destinatários.
  const emails=activeOperationalUsers()
    .filter(u=>u && String(u.approvalStatus||'approved').toLowerCase()==='approved')
    .filter(u=>unit?userHasUnitSector(u,normalizePortalUnit(unit),sector):normalizeAnswer(String(u.sector||''))===wanted||(u.sectorMemberships||[]).some(m=>normalizeAnswer(m.sector)===wanted))
    .map(u=>String(u.email||'').trim().toLowerCase())
    .filter(email=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

  return [...new Set(emails)].join(',');
}
function renderSectorEmailMap(){}
function saveSectorEmails(){}

function notificationChannel(n){
  const c=getAdminConfig();
  let value='Portal';
  if(n?.type==='ro'&&(n?.audience==='sector'||n?.audience==='user'))value=c.channelRoSector||'Ambos';
  else if(n?.type==='contest'&&n?.audience==='sector')value=c.channelContestSector||'Ambos';
  else if(n?.type==='contest'&&n?.audience==='admin')value=c.channelContestAdmin||'Ambos';
  else if(n?.type==='pdca'&&n?.audience==='admin')value=c.channelPdcaAdmin||'Ambos';
  else if(n?.type==='action'||n?.type==='deadline')value=c.channelAction||'Portal';
  else if(n?.type==='announcement')value=c.channelAnnouncement||'Portal';
  return value;
}
function channelAllowsPortal(n){const x=notificationChannel(n);return x==='Portal'||x==='Ambos'}
function channelAllowsEmail(n){const x=notificationChannel(n);return x==='E-mail'||x==='Ambos'}
function notificationEventKey(n){
  return [n.type||'',n.audience||'',n.ro||'',n.sector||'',n.title||'',n.message||''].join('|').toLowerCase().replace(/\s+/g,' ').slice(0,900);
}
function isPriorityEmailNotification(n){
  if(!n||!channelAllowsEmail(n))return false;
  if((n.audience==='sector'||n.audience==='user')&&n.type==='ro')return getRuleYes('ruleEmailDirectedRo');
  if(n.audience==='sector'&&n.type==='contest')return getRuleYes('ruleEmailContestSector');
  if(n.audience==='admin'&&n.type==='contest')return getRuleYes('ruleEmailContestAdmin');
  if(n.audience==='admin'&&n.type==='pdca')return getRuleYes('ruleEmailPdcaAdmin');
  if(n.type==='action'||n.type==='deadline'||n.type==='announcement')return true;
  return false;
}
function emailForNotification(n){
  const c=getAdminConfig();
  if((c.emailNotificationsEnabled||'Sim')!=='Sim')return '';
  if(!isPriorityEmailNotification(n))return '';
  if(n.audience==='admin')return String(notificationEmailValue(c.sgqNotificationEmail||'')).trim();
  if(n.audience==='sector')return emailForSector(n.sector);
  if(n.audience==='user'&&n.userKey&&String(n.userKey).includes('@'))return String(n.userKey).trim();
  if(n.type==='announcement'&&n.audience==='all')return String(notificationEmailValue(c.sgqNotificationEmail||'')).trim();
  if(n.type==='announcement'&&n.audience==='operational')return String(notificationEmailValue(c.sgqNotificationEmail||'')).trim();
  return '';
}

function dispatchNotificationEmail(n){
  const unitCfg=unitConfiguration(normalizePortalUnit(n?.unidade||''));
  // R.O. direcionada deve gerar e-mail sempre, independentemente de configuração/cache local.
  const isDirectedRo=!!(n && n.type==='ro' && (n.audience==='sector'||n.audience==='user'));
  if(!isDirectedRo && !isPriorityEmailNotification(n))return false;

  const target=isDirectedRo
    ? (n.audience==='user' ? String(n.userKey||'').trim() : emailForSector(n.sector,n.unidade))
    : (n.audience==='admin'&&unitCfg?.sgqNotificationEmail?unitCfg.sgqNotificationEmail:emailForNotification(n));
  if(!target){
    console.error('Portal SGQ: R.O. direcionada sem e-mail de destino.',n);
    return false;
  }
  if(!portalBackendEnabled()){
    console.error('Portal SGQ: URL do Apps Script não configurada.');
    return false;
  }

  const params={
    acao:'notificar',
    email:target,
    assunto:n.title||'Notificação do Portal SGQ',
    mensagem:n.message||'',
    ro:n.ro||'',
    setor:n.sector||'',
    tipo:n.type||'',
    audiencia:n.audience||'',
    unidade:n.unidade||'',
    tipoRO:n.tipoRO||'',
    cliente:n.cliente||'',
    registrante:n.registrante||'',
    eventoId:notificationEventKey(n),
    anexarPdfRo:(isDirectedRo&&n.ro)?'1':'0'
  };

  portalJsonp(params,30000)
    .then(res=>{
      if(!res||res.sucesso!==true||res.enviado!==true){
        console.error('Portal SGQ: Apps Script não confirmou o envio.',res);
        return;
      }
      console.info('Portal SGQ: e-mail enviado e registrado.',{email:target,ro:n.ro});
      try{refreshEmailHistory()}catch(e){}
    })
    .catch(e=>console.error('Portal SGQ: falha real no envio de e-mail.',e));
  return true;
}
function isInAppNotificationEnabled(data){
  if(!data)return true;
  if(!channelAllowsPortal(data))return false;
  if(data.type==='ro' && data.audience==='admin')return String(getAdminConfig().notifyNewRo||'Sim')==='Sim';
  if(data.type==='ro' && data.audience==='sector')return String(getAdminConfig().notifyDirectedRo||'Sim')==='Sim';
  if(data.type==='pdca' && data.audience==='admin')return String(getAdminConfig().notifyPdcaReceived||'Sim')==='Sim';
  if(data.type==='contest' && data.audience==='sector')return String(getAdminConfig().notifyContestDecision||'Sim')==='Sim';
  if(data.type==='action')return String(getAdminConfig().notifyActionStatus||'Sim')==='Sim';
  return true;
}
function createNotification(data){
  const n={
    id:'NOT-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),
    createdAt:new Date().toISOString(),
    type:data.type||'general',
    title:data.title||'Nova atualização',
    message:data.message||'',
    audience:data.audience||'all',
    sector:data.sector||'',
    userKey:data.userKey||'',
    ro:data.ro||'',
    unidade:data.unidade||'',
    tipoRO:data.tipoRO||'',
    cliente:data.cliente||'',
    registrante:data.registrante||''
  };
  // O e-mail prioritário é independente da exibição na central do aplicativo.
  if(!data.skipEmail){try{dispatchNotificationEmail(n)}catch(e){console.error('Portal SGQ: falha ao preparar e-mail.',e)}}
  if(!isInAppNotificationEnabled(n))return n;

  const list=getNotifications();
  list.unshift(n);
  saveNotifications(list);
  refreshNotificationBell();
  return n;
}

let emailHistoryVisibleLimit=5;
let emailHistoryLoaded=[];
function renderEmailHistory(){
  const rows=document.getElementById('emailHistoryRows');if(!rows)return;
  const h=emailHistoryLoaded;
  rows.innerHTML=h.length?h.slice(0,emailHistoryVisibleLimit).map(x=>`<tr><td>${escapeHtml(formatDateTimeBR(x.at)||x.at||'')}</td><td>${escapeHtml(x.type||'')}</td><td>${escapeHtml(x.ro||'—')}</td><td>${escapeHtml(x.email||'')}</td><td class="${x.status==='sent'?'email-status-ok':'email-status-err'}">${escapeHtml(x.status==='sent'?'Enviado':x.status||'')}</td></tr>`).join(''):'<tr><td colspan="5">Nenhum e-mail registrado.</td></tr>';
  let controls=document.getElementById('emailHistoryPagination');
  if(!controls){controls=document.createElement('div');controls.id='emailHistoryPagination';controls.className='actions';rows.closest('table').parentElement.after(controls);}
  controls.innerHTML='<span class="small">Exibindo '+Math.min(h.length,emailHistoryVisibleLimit)+' de '+h.length+' registro(s) carregados.</span>'+(h.length>emailHistoryVisibleLimit?'<button class="btn secondary" type="button" onclick="showMoreEmailHistory()">Mostrar mais 5</button>':'');
}
function showMoreEmailHistory(){emailHistoryVisibleLimit+=5;renderEmailHistory();}
async function refreshEmailHistory(){
  const rows=document.getElementById('emailHistoryRows'),sum=document.getElementById('emailQueueSummary');
  emailHistoryVisibleLimit=5;
  const controls=document.getElementById('emailHistoryPagination');if(controls)controls.innerHTML='';
  if(rows)rows.innerHTML='<tr><td colspan="5">Carregando...</td></tr>';
  try{
    const res=await portalJsonp({acao:'portal_email_status'});
    if(!res?.sucesso)throw new Error(res?.erro||'Falha ao carregar histórico.');
    const q=res.queue||[],h=res.history||[];
    if(sum)sum.textContent='Fila: '+q.filter(x=>x.status==='queued'||x.status==='error').length+' pendente(s) · '+h.length+' registro(s) no histórico';
    emailHistoryLoaded=h.slice().reverse();renderEmailHistory();
  }catch(e){if(rows)rows.innerHTML='<tr><td colspan="5">Não foi possível carregar.</td></tr>';if(sum)sum.textContent=e.message||String(e)}
}
function requestEmailQueueProcessing(){
  if(!portalBackendEnabled()){alert('Configure o Apps Script primeiro.');return}
  portalPostForm({acao:'portal_process_email_queue',ator:getSession()?.name||'SGQ'});
  setTimeout(refreshEmailHistory,1800);
}

async function testDirectEmailRoute(){
  if(!isAdmin())return;
  saveSectorEmails();
  const map=getSectorEmailMap();
  const first=Object.entries(map).find(([,email])=>String(email||'').trim());
  const st=document.getElementById('emailNotificationStatus');
  if(!first){
    if(st){st.classList.remove('hidden');st.textContent='Configure ao menos um e-mail de setor.'}
    return;
  }
  const base=portalApiBase();
  if(!base){
    if(st){st.classList.remove('hidden');st.textContent='URL do Apps Script não configurada.'}
    return;
  }
  try{
    const res=await portalJsonp({
      acao:'notificar',
      email:first[1],
      tipo:'ro',
      audiencia:'sector',
      setor:first[0],
      ro:'TESTE',
      unidade:'Matriz',
      tipoRO:'Teste',
      mensagem:'Teste direto da rota de e-mail do Portal SGQ.',
      eventoId:'TESTE-DIRETO-'+Date.now(),
      anexarPdfRo:'0'
    },30000);
    if(!res?.sucesso)throw new Error(res?.erro||'Apps Script não confirmou o envio.');
    if(st){
      st.classList.remove('hidden');
      st.className='statusline okline';
      st.textContent=res.enviado?'E-mail de teste enviado para '+first[1]+'.':('Rota respondeu, mas não enviou: '+(res.motivo||'sem motivo informado'));
    }
  }catch(e){
    if(st){
      st.classList.remove('hidden');
      st.className='statusline';
      st.textContent='Falha na rota de e-mail: '+(e.message||e);
    }
  }
}
function testSectorEmail(){
  if(!isAdmin())return;
  saveSectorEmails();
  const map=getSectorEmailMap();
  const first=Object.entries(map).find(([,email])=>email);
  const st=document.getElementById('emailNotificationStatus');
  if(!first){
    if(st){st.classList.remove('hidden');st.className='statusline';st.textContent='Informe ao menos um e-mail de setor para testar.'}
    return;
  }
  const n={
    type:'ro',
    title:'R.O. direcionada para tratativa',
    message:'Este é um teste de e-mail prioritário para uma R.O. que exige resposta do setor.',
    audience:'sector',
    sector:first[0],
    ro:'RO-00010',
    unidade:'Matriz',
    tipoRO:'Interna',
    cliente:'Cliente teste'
  };
  const sent=dispatchNotificationEmail(n);
  if(st){
    st.classList.remove('hidden');
    st.className=sent?'statusline okline':'statusline';
    st.textContent=sent
      ? 'Solicitação de teste enviada ao Apps Script para '+first[1]+'.'
      : 'Não foi possível solicitar o envio. Confira a URL do Apps Script e se o e-mail está configurado.';
  }
}


function testContestEmail(){
  if(!isAdmin())return;
  saveSectorEmails();
  const map=getSectorEmailMap();
  const first=Object.entries(map).find(([,email])=>String(email||'').trim());
  const st=document.getElementById('emailNotificationStatus');

  if(!first){
    if(st){
      st.classList.remove('hidden');
      st.className='statusline';
      st.textContent='Informe ao menos um e-mail de setor para testar.';
    }
    return;
  }

  const n={
    type:'contest',
    title:'Contestação rejeitada',
    message:'O SGQ rejeitou a contestação da RO-TESTE. É necessário responder o PDCA. Motivo da decisão: teste de envio.',
    audience:'sector',
    sector:first[0],
    ro:'RO-TESTE',
    unidade:'Matriz'
  };

  const sent=dispatchNotificationEmail(n);

  if(st){
    st.classList.remove('hidden');
    st.className=sent?'statusline okline':'statusline';
    st.textContent=sent
      ? 'Teste de resposta de contestação solicitado para '+first[1]+'.'
      : 'Não foi possível solicitar o e-mail de contestação. Confira a URL do Apps Script e o e-mail do setor.';
  }
}


const ANNOUNCEMENTS_KEY='portal-sgq-announcements-v1';
const ANNOUNCEMENT_ACK_KEY='portal-sgq-announcement-acks-v1';
const ANNOUNCEMENT_IMAGE_DB='portal-sgq-announcement-images-v1';
const ANNOUNCEMENT_IMAGE_STORE='images';
let currentAnnouncementImageData='';
let currentAnnouncementAttachmentData='';
let currentAnnouncementAttachmentName='';
let currentAnnouncementAttachmentType='';
let currentAnnouncementId='';


function openAnnouncementImageDb(){
  return new Promise((resolve,reject)=>{
    if(!('indexedDB' in window)){reject(new Error('IndexedDB indisponível'));return}
    const req=indexedDB.open(ANNOUNCEMENT_IMAGE_DB,1);
    req.onupgradeneeded=()=>{
      const db=req.result;
      if(!db.objectStoreNames.contains(ANNOUNCEMENT_IMAGE_STORE)){
        db.createObjectStore(ANNOUNCEMENT_IMAGE_STORE);
      }
    };
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error||new Error('Falha ao abrir armazenamento de imagens'));
  });
}
async function saveAnnouncementImage(id,data){
  if(!data)return true;
  const db=await openAnnouncementImageDb();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(ANNOUNCEMENT_IMAGE_STORE,'readwrite');
    tx.objectStore(ANNOUNCEMENT_IMAGE_STORE).put(data,String(id));
    tx.oncomplete=()=>{db.close();resolve(true)};
    tx.onerror=()=>{const err=tx.error;db.close();reject(err||new Error('Falha ao salvar imagem'))};
  });
}
async function loadAnnouncementImage(id){
  try{
    const db=await openAnnouncementImageDb();
    const local=await new Promise((resolve,reject)=>{
      const tx=db.transaction(ANNOUNCEMENT_IMAGE_STORE,'readonly');
      const req=tx.objectStore(ANNOUNCEMENT_IMAGE_STORE).get(String(id));
      req.onsuccess=()=>resolve(req.result||'');
      req.onerror=()=>reject(req.error);
      tx.oncomplete=()=>db.close();
    });
    if(local)return local;
  }catch(e){}

  if(portalBackendEnabled()){
    try{
      const res=await portalJsonp({acao:'portal_imagem_comunicado',id:String(id)},30000);
      if(res?.sucesso&&res.dataUrl){
        saveAnnouncementImage(id,res.dataUrl).catch(()=>{});
        return res.dataUrl;
      }
    }catch(e){}
  }
  return '';
}
async function deleteAnnouncementImage(id){
  try{
    const db=await openAnnouncementImageDb();
    await new Promise((resolve,reject)=>{
      const tx=db.transaction(ANNOUNCEMENT_IMAGE_STORE,'readwrite');
      tx.objectStore(ANNOUNCEMENT_IMAGE_STORE).delete(String(id));
      tx.oncomplete=()=>{db.close();resolve()};
      tx.onerror=()=>{const err=tx.error;db.close();reject(err)};
    });
  }catch(e){}
}

function getAnnouncements(){
  try{
    const arr=JSON.parse(localStorage.getItem(ANNOUNCEMENTS_KEY)||'[]');
    return Array.isArray(arr)?arr:[];
  }catch(e){return []}
}
function saveAnnouncements(list){
  try{
    localStorage.setItem(ANNOUNCEMENTS_KEY,JSON.stringify(list||[]));
    return true;
  }catch(e){
    console.error('Portal SGQ: não foi possível salvar o comunicado.',e);
    return false;
  }
}
function getAnnouncementAcks(){
  try{return JSON.parse(localStorage.getItem(ANNOUNCEMENT_ACK_KEY)||'{}')||{}}
  catch(e){return {}}
}
function announcementUserKey(){
  const s=getSession();
  if(!s)return 'anonymous';
  return String(s.email||((s.name||'')+'|'+(s.sector||''))).trim().toLowerCase();
}
function updateAnnouncementAudienceUi(){
  nucleoAnnouncementUnitUi();
  const val=document.getElementById('announcementAudience')?.value||'all';
  const field=document.getElementById('announcementSectorField');
  if(field)field.style.display=val==='sector'?'block':'none';
}
function refreshAnnouncementSectorSelect(){
  const sel=document.getElementById('announcementSector');
  if(!sel)return;
  const cur=sel.value;
  const sectors=getConfiguredSectors(document.getElementById('announcementUnit')?.value||'filial');
  sel.innerHTML='<option value="">Selecione o setor...</option>'+sectors.map(s=>`<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
  if(cur && sectors.includes(cur))sel.value=cur;
}

function applyAnnouncementTemplate(type){
  const templates={
    procedure:{title:'Atualização de procedimento',message:'Informamos que houve uma atualização de procedimento.\n\nMudança:\n\nData de início:\n\nEm caso de dúvida, procure o SGQ.'},
    training:{title:'Treinamento programado',message:'Será realizado um treinamento referente ao processo abaixo.\n\nTema:\nData:\nHorário:\nLocal:\nPúblico:\n\nConfirme a leitura deste comunicado.'},
    audit:{title:'Auditoria programada',message:'Informamos a realização de auditoria.\n\nData:\nÁrea / setor:\nHorário previsto:\nOrientações:\n\nMantenha os registros e documentos aplicáveis disponíveis.'},
    deadline:{title:'Aviso de prazo',message:'Há um prazo importante relacionado ao SGQ.\n\nAssunto:\nPrazo:\nResponsável:\nAção necessária:'},
    general:{title:'Aviso geral',message:'Comunicamos a seguinte informação:\n\n'}
  };
  const t=templates[type]||templates.general;
  const title=document.getElementById('announcementTitle'),msg=document.getElementById('announcementMessage');
  if(title)title.value=t.title;if(msg)msg.value=t.message;
}
function prepareAnnouncementAttachment(input){
  const file=input?.files?.[0];
  if(!file){clearAnnouncementAttachment();return}
  if(file.size>5*1024*1024){alert('O anexo deve ter no máximo 5 MB.');input.value='';return}
  const allowed=['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','text/plain'];
  if(file.type && !allowed.includes(file.type)){alert('Formato de anexo não permitido.');input.value='';return}
  const reader=new FileReader();
  reader.onerror=()=>{alert('Não foi possível ler o anexo.');input.value=''};
  reader.onload=()=>{
    currentAnnouncementAttachmentData=String(reader.result||'');
    currentAnnouncementAttachmentName=file.name||'anexo';
    currentAnnouncementAttachmentType=file.type||'application/octet-stream';
    const box=document.getElementById('announcementAttachmentPreview'),name=document.getElementById('announcementAttachmentName');
    if(name)name.textContent=currentAnnouncementAttachmentName;if(box)box.classList.remove('hidden');
  };
  reader.readAsDataURL(file);
}
function clearAnnouncementAttachment(){
  currentAnnouncementAttachmentData='';currentAnnouncementAttachmentName='';currentAnnouncementAttachmentType='';
  const input=document.getElementById('announcementAttachment');if(input)input.value='';
  document.getElementById('announcementAttachmentPreview')?.classList.add('hidden');
}
function previewAnnouncementImage(input){
  const file=input?.files?.[0];
  if(!file){clearAnnouncementImage();return}
  if(!file.type.startsWith('image/')){
    alert('Selecione uma imagem válida.');
    input.value='';
    return;
  }

  const reader=new FileReader();
  reader.onerror=()=>{
    alert('Não foi possível ler esta imagem.');
    input.value='';
  };
  reader.onload=()=>{
    const original=String(reader.result||'');
    const img=new Image();

    img.onerror=()=>{
      alert('Não foi possível processar esta imagem.');
      input.value='';
    };

    img.onload=()=>{
      try{
        const maxW=1400;
        const maxH=900;
        const scale=Math.min(1,maxW/img.naturalWidth,maxH/img.naturalHeight);
        const w=Math.max(1,Math.round(img.naturalWidth*scale));
        const h=Math.max(1,Math.round(img.naturalHeight*scale));

        const canvas=document.createElement('canvas');
        canvas.width=w;
        canvas.height=h;
        const ctx=canvas.getContext('2d');
        ctx.drawImage(img,0,0,w,h);

        let data=canvas.toDataURL('image/jpeg',0.78);

        // Segunda redução automática para fotos ainda muito grandes.
        if(data.length>950000){
          const scale2=Math.min(1,1000/w,700/h);
          canvas.width=Math.max(1,Math.round(w*scale2));
          canvas.height=Math.max(1,Math.round(h*scale2));
          const ctx2=canvas.getContext('2d');
          ctx2.drawImage(img,0,0,canvas.width,canvas.height);
          data=canvas.toDataURL('image/jpeg',0.68);
        }

        currentAnnouncementImageData=data;

        const wrap=document.getElementById('announcementImagePreviewWrap');
        const preview=document.getElementById('announcementImagePreview');
        if(preview)preview.src=data;
        if(wrap)wrap.classList.remove('hidden');
      }catch(e){
        console.error(e);
        alert('Não foi possível preparar a imagem do comunicado.');
        input.value='';
      }
    };

    img.src=original;
  };
  reader.readAsDataURL(file);
}
function clearAnnouncementImage(){
  currentAnnouncementImageData='';
  const input=document.getElementById('announcementImage');
  if(input)input.value='';
  const wrap=document.getElementById('announcementImagePreviewWrap');
  if(wrap)wrap.classList.add('hidden');
  const img=document.getElementById('announcementImagePreview');
  if(img)img.removeAttribute('src');
}
function clearAnnouncementForm(){
  ['announcementTitle','announcementMessage','announcementStart','announcementEnd'].forEach(id=>{
    const el=document.getElementById(id); if(el)el.value='';
  });
  if(document.getElementById('announcementAudience'))document.getElementById('announcementAudience').value='all';
  if(document.getElementById('announcementRequireAck'))document.getElementById('announcementRequireAck').value='yes';
  if(document.getElementById('announcementPriority'))document.getElementById('announcementPriority').value='normal';
  if(document.getElementById('announcementSector'))document.getElementById('announcementSector').value='';
  updateAnnouncementAudienceUi();
  clearAnnouncementImage();
  clearAnnouncementAttachment();
}
async function publishAnnouncement(){
  if(!nucleoFeatureRequire('announcements','publish'))return;
  if(!nucleoPersonCan('announcements',true)){alert('Seu cadastro não permite emitir comunicados.');return;}
  const units=nucleoAnnouncementSelectedUnits();
  const publishStatus=document.getElementById('announcementPublishStatus');
  if(publishStatus)publishStatus.textContent='';
  const title=(document.getElementById('announcementTitle')?.value||'').trim();
  const message=(document.getElementById('announcementMessage')?.value||'').trim();
  const audience=document.getElementById('announcementAudience')?.value||'all';
  const sector=(document.getElementById('announcementSector')?.value||'').trim();
  const start=document.getElementById('announcementStart')?.value||'';
  const end=document.getElementById('announcementEnd')?.value||'';
  const requireAck=(document.getElementById('announcementRequireAck')?.value||'yes')==='yes';
  const priority=document.getElementById('announcementPriority')?.value||'normal';

  if(!units.length){alert('Selecione uma unidade autorizada.');return;}
  if(!title||!message){
    alert('Preencha título e mensagem do comunicado.');
    return;
  }
  if(audience==='sector'&&!sector){
    alert('Selecione o setor que deve receber o comunicado.');
    return;
  }
  if(start&&end&&end<start){
    alert('A data final não pode ser anterior à data inicial.');
    return;
  }

  const list=getAnnouncements();
  const announcementId='COM-'+Date.now();
  const announcement={
    id:announcementId,
    units,unit:units[0],
    title,
    message,
    audience,
    sector:audience==='sector'?sector:'',
    start,
    end,
    requireAck,
    priority,
    hasImage:Boolean(currentAnnouncementImageData),
    hasAttachment:Boolean(currentAnnouncementAttachmentData),
    attachmentName:currentAnnouncementAttachmentName||'',
    active:true,
    createdAt:new Date().toISOString(),
    createdBy:getSession()?.name||'SGQ'
  };

  if(currentAnnouncementImageData){
    try{
      await saveAnnouncementImage(announcementId,currentAnnouncementImageData);
    }catch(e){
      console.error('Portal SGQ: não foi possível salvar a foto do comunicado.',e);
      alert('Não foi possível salvar a foto. Tente outra imagem ou publique sem foto.');
      return;
    }
  }

  try{await portalBackendSaveConfirmed('announcements',announcementId,{...announcement,imageData:currentAnnouncementImageData||'',attachmentData:currentAnnouncementAttachmentData||'',attachmentName:currentAnnouncementAttachmentName||'',attachmentType:currentAnnouncementAttachmentType||''});}catch(e){if(publishStatus)publishStatus.textContent='Não foi possível publicar: '+e.message;alert('A base central não confirmou o comunicado: '+e.message);return;}
  list.unshift(announcement);
  const saved=saveAnnouncements(list);
  if(!saved){
    if(currentAnnouncementImageData)await deleteAnnouncementImage(announcementId);
    alert('Não foi possível salvar os dados do comunicado neste navegador. O armazenamento local já está cheio. O comunicado não foi publicado.');
    return;
  }

  try{
    createNotification({
      type:'announcement',
      audience:audience==='sector'?'sector':audience==='operational'?'operational':'all',
      sector:audience==='sector'?sector:'',
      title:priority==='urgent'?'Comunicado urgente do SGQ':'Novo comunicado do SGQ',
      message:title
    });
  }catch(e){
    console.warn('Comunicado salvo, mas não foi possível gerar a notificação interna.',e);
  }

  clearAnnouncementForm();
  renderAnnouncementsAdmin();
  if(publishStatus)publishStatus.textContent='Publicado agora.';
  alert('Comunicado publicado com sucesso.');
}
function audienceLabel(a){
  if(a.audience==='sector')return 'Setor: '+(a.sector||'—');
  if(a.audience==='operational')return 'Usuários operacionais';
  return 'Todos os usuários';
}
function announcementStatus(a){
  const today=new Date().toISOString().slice(0,10);
  if(a.active===false)return 'Encerrado';
  if(a.start&&today<a.start)return 'Agendado';
  if(a.end&&today>a.end)return 'Encerrado';
  return 'Ativo';
}

function eligibleAnnouncementUsers(a){
  return getOperationalUsers().filter(u=>{
    if(!nucleoAnnouncementInScope(a,u))return false;
    if(a.audience==='all')return true;
    if(a.audience==='operational')return !nucleoPersonPermissions(u).sgq;
    if(a.audience==='sector')return !nucleoPersonPermissions(u).sgq&&normalizeSectorEmailKey(u.sector)===normalizeSectorEmailKey(a.sector);
    return false;
  });
}
function announcementAckStats(a){
  const eligible=eligibleAnnouncementUsers(a);
  const ack=getAnnouncementAcks();
  let read=0;
  const rows=eligible.map(u=>{
    const key=String(u.email||((u.name||'')+'|'+(u.sector||''))).trim().toLowerCase();
    const ok=(ack[key]||[]).includes(a.id);
    if(ok)read++;
    return {name:u.name||u.email||'Usuário',sector:u.sector||'',ok};
  });
  return {total:eligible.length,read,pending:Math.max(0,eligible.length-read),rows};
}
function toggleAnnouncementAckReport(id){
  const box=document.getElementById('ackReport_'+id);if(!box)return;
  box.classList.toggle('hidden');
}
async function openAnnouncementAttachment(id){
  if(!portalBackendEnabled()){alert('O anexo está disponível pela base central do Portal SGQ.');return}
  try{
    const res=await portalJsonp({acao:'portal_anexo_comunicado',id:String(id)},30000);
    if(!res?.sucesso||!res.dataUrl)throw new Error(res?.erro||'Anexo não encontrado.');
    const a=document.createElement('a');a.href=res.dataUrl;a.download=res.filename||'anexo';document.body.appendChild(a);a.click();a.remove();
  }catch(e){alert('Não foi possível abrir o anexo: '+(e.message||e))}
}
function renderAnnouncementsAdmin(){
  nucleoAnnouncementUnitUi();
  const box=document.getElementById('announcementsAdminList');if(!box)return;
  const list=getAnnouncements();
  box.innerHTML=list.length?list.map(a=>{
    const status=announcementStatus(a),stats=announcementAckStats(a),pct=stats.total?Math.round((stats.read/stats.total)*100):0;
    return `<div class="announcement-admin-card ${status==='Ativo'?'':'inactive'} ${a.priority==='urgent'?'announcement-urgent':''}">
      <div class="announcement-admin-head">
        <div style="flex:1">
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
            <b>${escapeHtml(a.title)}</b>
            <span class="badge ${status==='Ativo'?'ok':'off'}">${escapeHtml(status)}</span>
            ${a.priority==='urgent'?'<span class="announcement-urgent-tag">⚠ Urgente</span>':''}
          </div>
          <div class="small" style="margin-top:4px">${escapeHtml(audienceLabel(a))} · ${a.requireAck?'Confirmação obrigatória':'Confirmação opcional'}</div>
          <div class="small" style="margin-top:3px">${a.start?'De '+escapeHtml(formatDateBR(a.start)):'Início imediato'}${a.end?' até '+escapeHtml(formatDateBR(a.end)):''}</div>
        </div>
        ${a.hasImage?`<img class="announcement-thumb" id="announcementThumb_${escapeHtml(a.id)}" alt="Imagem do comunicado">`:''}
      </div>
      <div style="margin-top:10px;white-space:pre-wrap">${escapeHtml(a.message)}</div>
      ${a.hasAttachment?`<button class="announcement-attachment" type="button" onclick="openAnnouncementAttachment('${escapeHtml(a.id)}')">📎 ${escapeHtml(a.attachmentName||'Abrir anexo')}</button>`:''}
      <div class="ack-report">
        <div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><b>Ciência de leitura</b><span>${stats.read}/${stats.total} confirmaram</span></div>
        <div class="ack-progress"><span style="width:${pct}%"></span></div>
        <div class="small">${stats.pending} pendente(s) · ${pct}% de confirmação</div>
        <button class="btn secondary" type="button" style="margin-top:8px" onclick="toggleAnnouncementAckReport('${escapeHtml(a.id)}')">Ver pessoas</button>
        <div id="ackReport_${escapeHtml(a.id)}" class="hidden" style="margin-top:8px">${stats.rows.length?stats.rows.map(r=>`<div class="small" style="padding:4px 0;border-top:1px solid #e5ebe9">${r.ok?'✓':'○'} ${escapeHtml(r.name)}${r.sector?' · '+escapeHtml(r.sector):''}</div>`).join(''):'<div class="small">Nenhum usuário elegível encontrado.</div>'}</div>
      </div>
      <div class="actions" style="margin-top:10px">
        ${status==='Ativo'?`<button class="btn secondary" type="button" onclick="endAnnouncement('${escapeHtml(a.id)}')">Encerrar</button>`:''}
        <button class="btn secondary" type="button" onclick="deleteAnnouncement('${escapeHtml(a.id)}')">Excluir</button>
      </div>
    </div>`;
  }).join(''):'<div class="small">Nenhum comunicado publicado.</div>';
  list.filter(a=>a.hasImage).forEach(async a=>{const data=await loadAnnouncementImage(a.id);const img=document.getElementById('announcementThumb_'+a.id);if(img&&data)img.src=data});
}
function endAnnouncement(id){
 if(!nucleoFeatureRequire('announcements','publish'))return;
  if(!isAdmin())return;
  const list=getAnnouncements();
  const i=list.findIndex(a=>String(a.id)===String(id));
  if(i<0)return;
  list[i].active=false;
  list[i].endedAt=new Date().toISOString();
  saveAnnouncements(list);
  portalBackendSave('announcements',list[i].id,list[i]);
  renderAnnouncementsAdmin();
}
async function deleteAnnouncement(id){
  if(!isAdmin())return;
  if(!confirm('Excluir este comunicado?'))return;
  saveAnnouncements(getAnnouncements().filter(a=>String(a.id)!==String(id)));
  portalBackendDelete('announcements',id);
  await deleteAnnouncementImage(id);
  renderAnnouncementsAdmin();
}
function showAnnouncementsAdmin(){
 if(!nucleoFeatureRequire('announcements','publish'))return;
  if(!isAdmin()){showList();return}
  refreshAnnouncementSectorSelect();
  updateAnnouncementAudienceUi();
  renderAnnouncementsAdmin();
  view('announcementsView');
  setNav('announcements');
  const crumb=document.getElementById('crumbCurrent');
  if(crumb)crumb.textContent='Comunicados';
}
function announcementMatchesUser(a){
  const s=getSession();
  if(!s||!nucleoAnnouncementInScope(a,s))return false;
  if(a.audience==='all')return true;
  if(a.audience==='operational')return s.role!=='admin';
  if(a.audience==='sector')return s.role!=='admin' && normalizeSectorEmailKey(a.sector)===normalizeSectorEmailKey(s.sector);
  return false;
}
function isAnnouncementCurrentlyActive(a){
  if(!a||a.active===false)return false;
  const today=new Date().toISOString().slice(0,10);
  if(a.start&&today<a.start)return false;
  if(a.end&&today>a.end)return false;
  return true;
}
function nextAnnouncementForCurrentUser(){
  const key=announcementUserKey();
  const acks=getAnnouncementAcks();
  const read=new Set(acks[key]||[]);
  return getAnnouncements()
    .filter(isAnnouncementCurrentlyActive)
    .filter(announcementMatchesUser)
    .find(a=>!read.has(a.id)) || null;
}
async function showPendingAnnouncement(){
  const a=nextAnnouncementForCurrentUser();
  if(!a)return;
  currentAnnouncementId=a.id;

  const title=document.getElementById('announcementModalTitle');
  const msg=document.getElementById('announcementModalMessage');
  const meta=document.getElementById('announcementModalMeta');
  const img=document.getElementById('announcementModalImage');
  const imgWrap=document.getElementById('announcementModalImageWrap');
  const close=document.getElementById('announcementCloseBtn');
  const ack=document.getElementById('announcementAckBtn');
  const dismiss=document.getElementById('announcementDismissBtn');

  if(title)title.textContent=a.title||'Comunicado';
  if(msg)msg.textContent=a.message||'';
  if(meta)meta.textContent=(a.priority==='urgent'?'URGENTE · ':'')+'Publicado por '+(a.createdBy||'SGQ')+(a.end?' · disponível até '+formatDateBR(a.end):'');
  const modalCard=document.querySelector('#announcementModalOverlay .announcement-modal');
  if(modalCard)modalCard.classList.toggle('announcement-urgent',a.priority==='urgent');

  let announcementImage=a.hasImage?await loadAnnouncementImage(a.id):'';
  if(!announcementImage && (a.hasImage||a.imageFileId) && portalBackendEnabled()){
    try{
      const imgRes=await portalJsonp({acao:'portal_imagem_comunicado',id:a.id},30000);
      if(imgRes?.sucesso && imgRes.imageData){
        announcementImage=imgRes.imageData;
        saveAnnouncementImage(a.id,announcementImage).catch(()=>{});
      }
    }catch(e){
      console.warn('Portal SGQ: não foi possível carregar a imagem do comunicado.',e);
    }
  }
  if(announcementImage){
    if(img){
      img.src=announcementImage;
      img.alt='Imagem do comunicado '+(a.title||'');
    }
    if(imgWrap)imgWrap.classList.remove('hidden');
  }else{
    if(img)img.removeAttribute('src');
    if(imgWrap)imgWrap.classList.add('hidden');
  }

  const attBtn=document.getElementById('announcementModalAttachmentBtn');
  if(attBtn){
    attBtn.classList.toggle('hidden',!a.hasAttachment);
    attBtn.textContent='📎 '+(a.attachmentName||'Abrir anexo');
    attBtn.onclick=()=>openAnnouncementAttachment(a.id);
  }
  if(close)close.style.display=a.requireAck?'none':'';
  if(ack)ack.textContent=a.requireAck?'Li e estou ciente':'Marcar como lido';
  if(dismiss)dismiss.classList.toggle('hidden',a.requireAck);

  const overlay=document.getElementById('announcementModalOverlay');
  if(!overlay){
    console.error('Portal SGQ: modal de comunicado não encontrado no documento principal.');
    return;
  }
  overlay.classList.remove('hidden');
  overlay.style.display='flex';
  document.body.style.overflow='hidden';
}
function acknowledgeAnnouncement(){
  if(!currentAnnouncementId)return;
  const key=announcementUserKey();
  const acks=getAnnouncementAcks();
  const set=new Set(acks[key]||[]);
  set.add(currentAnnouncementId);
  acks[key]=[...set];
  localStorage.setItem(ANNOUNCEMENT_ACK_KEY,JSON.stringify(acks));
  portalBackendSave('announcement_acks',key+'|'+currentAnnouncementId,{
    userKey:key,announcementId:currentAnnouncementId,acknowledgedAt:new Date().toISOString()
  });

  const overlay=document.getElementById('announcementModalOverlay');
  if(overlay){overlay.classList.add('hidden');overlay.style.display='none'}
  document.body.style.overflow='';
  currentAnnouncementId='';

  setTimeout(showPendingAnnouncement,150);
}
function closeAnnouncementModal(){
  const a=getAnnouncements().find(x=>String(x.id)===String(currentAnnouncementId));
  if(a?.requireAck)return;
  const overlay=document.getElementById('announcementModalOverlay');
  if(overlay){overlay.classList.add('hidden');overlay.style.display='none'}
  document.body.style.overflow='';
  currentAnnouncementId='';
}

async function migrateAnnouncementImagesFromLocalStorage(){
  const list=getAnnouncements();
  let changed=false;
  for(const a of list){
    if(a.imageData){
      try{
        await saveAnnouncementImage(a.id,a.imageData);
        a.hasImage=true;
        delete a.imageData;
        changed=true;
      }catch(e){
        console.warn('Não foi possível migrar uma imagem antiga de comunicado.',e);
      }
    }
  }
  if(changed)saveAnnouncements(list);
}
async function refreshAnnouncementsFromCentral(showModal=true){
  if(!portalBackendEnabled()){
    if(showModal)try{showPendingAnnouncement()}catch(e){}
    return false;
  }
  try{
    const res=await portalJsonp({acao:'portal_announcements'},30000);
    if(!res?.sucesso)throw new Error(res?.erro||'Falha ao consultar comunicados.');

    if(Array.isArray(res.announcements)){
      const list=res.announcements.map(a=>{
        const copy={...a};
        if(copy.imageData){
          copy.hasImage=true;
          saveAnnouncementImage(copy.id,copy.imageData).catch(()=>{});
          delete copy.imageData;
        }
        if(copy.imageFileId)copy.hasImage=true;
        return copy;
      });
      localStorage.setItem(ANNOUNCEMENTS_KEY,JSON.stringify(list));
    }

    if(Array.isArray(res.announcementAcks)){
      const ackMap=getAnnouncementAcks();
      res.announcementAcks.forEach(x=>{
        if(!x?.userKey||!x?.announcementId)return;
        const s=new Set(ackMap[x.userKey]||[]);
        s.add(x.announcementId);
        ackMap[x.userKey]=[...s];
      });
      localStorage.setItem(ANNOUNCEMENT_ACK_KEY,JSON.stringify(ackMap));
    }

    if(showModal){
      const overlay=document.getElementById('announcementModalOverlay');
      if(!currentAnnouncementId && (!overlay || overlay.classList.contains('hidden'))){
        await showPendingAnnouncement();
      }
    }
    return true;
  }catch(e){
    console.warn('Portal SGQ: não foi possível atualizar comunicados agora.',e);
    if(showModal)try{showPendingAnnouncement()}catch(_){}
    return false;
  }
}

function schedulePendingAnnouncementCheck(){
  // Comunicados chegam junto com a próxima sincronização central.
}

// Comunicados já vêm no snapshot da base central. Evita uma segunda consulta
// periódica concorrendo com a sincronização principal e travando máquinas mais lentas.

function ensurePreviewSession(){
  if(!SKIP_LOGIN_PREVIEW) return;
  const previewAdmin={
    nome:'Administrador SGQ',
    setor:'SGQ',
    unidade:'Matriz',
    role:'admin',
    email:'sgq@empresa.com',
    password:'1234'
  };
  localStorage.setItem(SESSION_KEY,JSON.stringify(previewAdmin));
}

let nucleoSessionMemory=null;
function getSession(){
  try{
    const raw=localStorage.getItem(SESSION_KEY);
    if(raw){const parsed=JSON.parse(raw);if(parsed){nucleoSessionMemory=parsed;return parsed;}}
  }catch(e){}
  try{
    const raw=sessionStorage.getItem(SESSION_KEY);
    if(raw){const parsed=JSON.parse(raw);if(parsed){nucleoSessionMemory=parsed;return parsed;}}
  }catch(e){}
  return nucleoSessionMemory;
}
function setSession(data){
  // A sessão de login nunca pode falhar só porque o localStorage está cheio/bloqueado.
  nucleoSessionMemory=data||null;
  const raw=JSON.stringify(data||null);
  let saved=false;
  try{localStorage.setItem(SESSION_KEY,raw);saved=true}catch(e){console.warn('localStorage da sessão indisponível:',e)}
  try{sessionStorage.setItem(SESSION_KEY,raw);saved=true}catch(e){console.warn('sessionStorage da sessão indisponível:',e)}
  return saved;
}

const DEFAULT_PORTAL_SECTORS=['Produção','Logística','Qualidade','Manutenção','Comercial','Faturamento'];

function normalizeSectorList(value){
  const raw=Array.isArray(value)?value:String(value||'').split(/[\n,;]+/);
  const seen=new Set();
  const result=[];
  raw.forEach(item=>{
    const s=String(item||'').trim();
    if(!s)return;
    const key=s.toLocaleLowerCase('pt-BR');
    if(seen.has(key))return;
    seen.add(key);
    result.push(s);
  });
  return result;
}

function getConfiguredSectors(unit){
  let cfg={};
  try{cfg=JSON.parse(localStorage.getItem(ADMIN_CONFIG_KEY)||'{}')||{};}catch(e){}

  unit=unit||adminScopeUnit();
  const own=unitConfiguration(unit);
  let sectors=normalizeSectorList(own?.sectorList??(unit==='filial'?'':cfg.sectorList));
  if(unit==='todas'){const configs=JSON.parse(localStorage.getItem('nucleo-unit-configs')||'[]');sectors=[...new Set(sectors.concat(configs.flatMap(c=>normalizeSectorList(c.sectorList))))];}

  // Na primeira utilização, usa a lista padrão exibida nas configurações.
  if(!sectors.length&&unit!=='filial'){
    const field=document.getElementById('sectorList');
    sectors=normalizeSectorList(field?.value||DEFAULT_PORTAL_SECTORS);
  }

  // Mantém o acesso dos cadastros administrativos existentes da matriz.
  if((unit==='matriz'||unit==='todas')&&!sectors.some(sector=>normalizeAnswer(sector)==='sgq'))sectors.push('SGQ');
  return sectors;
}

function fillSectorSelect(selectId,{includeSgq=false,selectedValue=''}={}){
  const sel=document.getElementById(selectId);
  if(!sel)return;

  const current=selectedValue || sel.value || '';
  const unitField={registerSector:'registerUnit',loginSector:'loginUnit',newUserSector:'newUserUnit'}[selectId];
  const unit=unitField?normalizePortalUnit(document.getElementById(unitField)?.value):adminScopeUnit();
  let sectors=getConfiguredSectors(unit).slice();

  if(includeSgq && !sectors.some(s=>s.toLocaleLowerCase('pt-BR')==='sgq')){
    sectors.unshift('SGQ');
  }

  // Mantém um valor já existente em um perfil legado sem incluí-lo
  // automaticamente na lista oficial de novos cadastros.
  if(!unitField && current && !sectors.some(s=>s.toLocaleLowerCase('pt-BR')===String(current).toLocaleLowerCase('pt-BR'))){
    sectors.push(current);
  }

  sel.innerHTML='<option value="">Selecione o setor...</option>'+
    sectors.map(s=>`<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');

  const match=sectors.find(s=>s.toLocaleLowerCase('pt-BR')===String(current).toLocaleLowerCase('pt-BR'));
  if(match)sel.value=match;
}

function refreshRegisterSectorByUnit(){
  const unit=(document.getElementById('registerUnit')?.value||'').trim();
  const sector=document.getElementById('registerSector');
  if(!sector)return;
  fillSectorSelect('registerSector');
  sector.disabled=!unit;
  if(!unit)sector.value='';
}

function refreshSectorSelectors(){
  refreshRegisterSectorByUnit();
  fillSectorSelect('newUserSector');

  const session=getSession();
  fillSectorSelect('profileSector',{
    includeSgq:session?.role==='admin',
    selectedValue:session?.sector||''
  });
}

async function saveSectorConfiguration(){
  if(!nucleoFeatureRequire('sectors','edit'))return;
  if(!isAdmin()){
    alert('Configuração indisponível.');
    return;
  }

  const field=document.getElementById('sectorList');
  const sectors=normalizeSectorList(field?.value||'');
  if(!sectors.length){
    alert('Cadastre pelo menos um setor.');
    return;
  }

  field.value=sectors.join('\n');
  const unit=getSession()?.role==='quality'?'filial':document.getElementById('qualityConfigUnit')?.value||'matriz';
  const st=document.getElementById('configSavedState');if(st){st.classList.remove('hidden');st.textContent='Salvando setores desta unidade…';}
  try{
    const result=await portalJsonp({acao:'portal_save_unit_config',unit,data:JSON.stringify({sectorList:field.value})},60000);
    if(!result?.sucesso)throw new Error(result?.erro||'A base central não confirmou os setores.');
    const configs=JSON.parse(localStorage.getItem('nucleo-unit-configs')||'[]'),old=configs.find(c=>c.id===unit)||{};
    localStorage.setItem('nucleo-unit-configs',JSON.stringify([...configs.filter(c=>c.id!==unit),{...old,id:unit,unit,sectorList:field.value}]));
    const unitField=document.getElementById('qualityConfigSectors');if(unitField)unitField.value=field.value;
    refreshSectorSelectors();try{populateTriageSectors()}catch(_){}try{renderOperationalUsers()}catch(_){}
    if(st)st.textContent='Setores da '+(unit==='filial'?'filial':'matriz')+' salvos na base central.';
  }catch(e){if(st)st.textContent='Não foi possível salvar: '+e.message;else alert(e.message);}

}

async function syncPublicPortalConfig(){
  try{
    const res=await portalJsonp({acao:'portal_public_config'},60000);
    if(res?.config?.sectorListsByUnit)localStorage.setItem('nucleo-unit-public-sectors',JSON.stringify(res.config.sectorListsByUnit));
    if(!res?.sucesso||!res.config)return false;
    const local=getAdminConfig();
    const merged={...local,...res.config};
    localStorage.setItem(ADMIN_CONFIG_KEY,JSON.stringify(merged));
    refreshSectorSelectors();
    try{refreshLoginSectorByUnit()}catch(e){}
    return true;
  }catch(e){
    console.warn('Não foi possível carregar a configuração central antes do login.',e);
    return false;
  }
}

function findKnownUserByNameSector(name,sector){
  const n=(name||'').trim().toLowerCase();
  const s=(sector||'').trim().toLowerCase();
  return getOperationalUsers().find(u=>(u.name||'').trim().toLowerCase()===n && (u.sector||'').trim().toLowerCase()===s) || null;
}
function refreshLoginSectorByUnit(){
  const unit=(document.getElementById('loginUnit')?.value||'').trim();
  const sector=document.getElementById('loginSector');
  if(!sector)return;

  const all=unit?getConfiguredSectors(normalizePortalUnit(unit)):[];
  const current=sector.value||'';
  sector.innerHTML='<option value="">Selecione o setor...</option>'+all.map(s=>`<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
  if(current && all.some(s=>normalizeAnswer(s)===normalizeAnswer(current))) sector.value=all.find(s=>normalizeAnswer(s)===normalizeAnswer(current));
  sector.disabled=!unit;
  if(!unit)sector.value='';
}

function showAuthMode(mode){
  refreshSectorSelectors();
  refreshLoginSectorByUnit();
  const isLogin=mode==='login';
  document.getElementById('loginMode').classList.toggle('hidden',!isLogin);
  document.getElementById('registerMode').classList.toggle('hidden',isLogin);
  document.getElementById('loginTabBtn').className='btn '+(isLogin?'primary':'secondary');
  document.getElementById('registerTabBtn').className='btn '+(!isLogin?'primary':'secondary');
  const loginMsg=document.getElementById('loginMessage');
  if(loginMsg){
    loginMsg.classList.remove('hidden');
    loginMsg.innerHTML=isLogin
      ? ''
      : 'O cadastro cria apenas acesso operacional. Permissão de administrador só pode ser concedida por um ADM.';
  }
}

function enableMobileLoginKeyboard(){
  ['loginName','loginUnit','loginSector','loginPassword'].forEach(id=>{
    const el=document.getElementById(id);
    if(!el||el.dataset.mobileLoginBound==='1')return;
    el.dataset.mobileLoginBound='1';
    el.addEventListener('keydown',event=>{
      if(event.key!=='Enter')return;
      event.preventDefault();
      if(id==='loginName')document.getElementById('loginUnit')?.focus();
      else if(id==='loginUnit')document.getElementById('loginSector')?.focus();
      else if(id==='loginSector')document.getElementById('loginPassword')?.focus();
      else loginUser();
    });
    el.addEventListener('focus',()=>{
      setTimeout(()=>el.scrollIntoView({block:'center',behavior:'smooth'}),180);
    });
  });
}

let loginAttemptNonce=0;

async function loginUser(){
  const name=(document.getElementById('loginName')?.value||'').trim();
  const unit=(document.getElementById('loginUnit')?.value||'').trim();
  const sector=(document.getElementById('loginSector')?.value||'').trim();
  const password=(document.getElementById('loginPassword')?.value||'');
  const msg=document.getElementById('loginMessage');
  const enterBtn=document.getElementById('loginEnterBtn');
  if(msg)msg.classList.remove('hidden');
  if(!name||!unit||!sector||!password){
    if(msg)msg.textContent='Informe seu nome, selecione a unidade e o setor e digite sua senha.';
    return;
  }
  if(enterBtn)enterBtn.disabled=true;
  if(msg)msg.textContent='Validando acesso...';
  try{
    const remote=await portalJsonp({
      acao:'portal_login_jsonp', nome:name, unidade:unit, setor:sector, senha:password
    },60000);
    if(!remote || remote.sucesso!==true){
      if(msg)msg.textContent=(remote&&remote.erro)||'Login não autorizado.';
      return;
    }

    // A partir daqui o servidor JÁ autorizou. Nada do estado local pode cancelar o acesso.
    const u=remote.user||remote.usuario||{};
    const rawRole=String(u.role||u.perfil||u.tipoAcesso||'operational').toLowerCase();
    const session={
      permissions:u.permissions||null,accessUnits:u.accessUnits||null,
      personId:u.personId||'',
      description:u.description||'',
      name:u.name||u.nome||name,
      email:u.email||u.e_mail||'',
      unit:u.unit||u.unidade||unit,
      sector:u.sector||u.setor||sector,
      role:rawRole==='quality'?'quality':((rawRole==='admin'||rawRole.includes('admin'))?'admin':((rawRole==='manager'||rawRole.includes('gest'))?'manager':'operational')),
      sectorMemberships:Array.isArray(u.sectorMemberships)?u.sectorMemberships:[],
      managedSectors:Array.isArray(u.managedSectors)?u.managedSectors:[],
      approvalStatus:u.approvalStatus||'approved',
      authToken:remote.authToken||remote.token||'',
      sessionExpiresAt:Date.now()+21600000,
      sessionExpiryClockVersion:2
    };
    // ABRE O APP imediatamente após sucesso=true. Persistência local não pode bloquear acesso válido.
    document.body.classList.add('nucleo-authenticated');
    const login=document.getElementById('loginOverlay');
    if(login){
      login.classList.add('hidden');
      login.style.setProperty('display','none','important');
      login.style.setProperty('visibility','hidden','important');
      login.style.setProperty('pointer-events','none','important');
      login.setAttribute('aria-hidden','true');
    }
    const loading=document.getElementById('nucleoLoadingOverlay');
    if(loading){loading.classList.remove('show');loading.style.display='none';loading.setAttribute('aria-busy','false');}
    nucleoLoadingDepth=0;

    // O arquivo atual não possui #appShell; mantém compatibilidade se ele existir futuramente.
    const appShell=document.getElementById('appShell');
    if(appShell){appShell.classList.remove('hidden');appShell.style.removeProperty('display');}

    if(msg)msg.textContent='';
    try{document.activeElement?.blur()}catch(e){}
    try{setSession(session)}catch(e){nucleoSessionMemory=session;console.warn('Sessão mantida em memória:',e)}

    // Tudo abaixo é pós-login e NÃO pode fechar/bloquear uma sessão já autorizada.
    const steps=[refreshAccessUI,enforceAdminVisibility,refreshRoRegistrationAccess,showList,refreshNotificationBell,refreshContestPendingBadge,refreshPdcaSidebarBadge,schedulePendingAnnouncementCheck];
    steps.forEach(fn=>{try{if(typeof fn==='function')fn()}catch(e){console.error('Pós-login:',e)}});
    // Toda entrada inicia a atualização central sem depender do botão.
    void nucleoSyncAfterLogin(session.authToken);
    // O SGQ recebe/sincroniza novos cadastros sem precisar abrir Configurações.
    if(['admin','quality'].includes(session.role)){
      setTimeout(()=>{try{refreshPendingRegistrations(false)}catch(e){}},300);
      try{clearInterval(window.__nucleoPendingUsersTimer)}catch(e){}
      window.__nucleoPendingUsersTimer=setInterval(()=>{
        try{if(isAdmin())refreshPendingRegistrations(false)}catch(e){}
      },30000);
    }
  }catch(e){
    console.error('Falha no login do Núcleo:',e);
    if(msg)msg.textContent='Erro ao entrar: '+(e?.message||e);
  }finally{
    if(enterBtn){enterBtn.disabled=false;enterBtn.textContent='Entrar';}
  }
}
async function registerUser(){
  const el=id=>document.getElementById(id);
  const name=(el('registerName')?.value||'').trim();
  const email=(el('registerEmail')?.value||'').trim().toLowerCase();
  const unit=(el('registerUnit')?.value||'').trim();
  const sector=(el('registerSector')?.value||'').trim();
  const password=el('registerPassword')?.value||'';
  const password2=el('registerPassword2')?.value||'';
  const msg=el('registerMessage');
  const submitBtn=el('registerSubmitBtn');

  function showRegisterMessage(text,type='error'){
    if(msg){
      msg.textContent=text;
      msg.style.cssText='display:block!important;margin-top:12px;padding:12px 14px;border-radius:10px;font-weight:700;white-space:normal;position:relative;z-index:99999;'+
        (type==='success'?'background:#ecfdf3;color:#027a48;border:1px solid #abefc6;':
         type==='info'?'background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;':
         'background:#fef2f2;color:#b42318;border:1px solid #fecdca;');
      try{msg.scrollIntoView({behavior:'smooth',block:'nearest'});}catch(_e){}
    }
  }

  // O retorno aparece ANTES de qualquer acesso a storage/backend.
  showRegisterMessage('Validando cadastro...','info');

  if(!name||!email||!unit||!sector||!password||!password2){
    showRegisterMessage('Preencha nome, e-mail SETA, unidade, setor, senha e confirmação da senha.'); return;
  }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    showRegisterMessage('Informe um e-mail corporativo válido.'); return;
  }
  if(password.length<4){
    showRegisterMessage('A senha precisa ter pelo menos 4 caracteres.'); return;
  }
  if(password!==password2){
    showRegisterMessage('As senhas não coincidem. Confira a confirmação da senha.'); return;
  }

  const description=(el('registerDescription')?.value||'').trim();
  const created={name,description,email,unit,sector,selfRegistered:true,password,role:'operational',approvalStatus:portalBackendEnabled()?'pending':'approved',createdAt:new Date().toISOString()};

  if(portalBackendEnabled()){
    showRegisterMessage('Enviando cadastro para o SGQ...','info');
    if(submitBtn){submitBtn.disabled=true;submitBtn.textContent='Enviando...';}
    try{
      const res=await portalJsonp({acao:'portal_register_user',payload:portalBase64EncodeJson(created)},25000);
      if(!res || !res.sucesso) throw new Error((res&&res.erro)||'O Apps Script não confirmou a gravação.');
      // Cache local é opcional: nunca pode apagar/impedir o retorno ao usuário.
      try{
        const users=getOperationalUsers();
        if(!users.some(u=>String(u.email||'').trim().toLowerCase()===email)) users.push(created);
        localStorage.setItem(USERS_KEY,JSON.stringify(users));
      }catch(storageErr){ console.warn('Cadastro confirmado; cache local indisponível:',storageErr); }
      showRegisterMessage('Cadastro enviado com sucesso! Agora ele está aguardando aprovação do SGQ.','success');
      if(submitBtn){submitBtn.disabled=true;submitBtn.textContent='Cadastro enviado ✓';}
      return;
    }catch(e){
      console.error('Erro no cadastro:',e);
      showRegisterMessage('Erro no cadastro: '+(e?.message||String(e)||'erro desconhecido'));
      if(submitBtn){submitBtn.disabled=false;submitBtn.textContent='Tentar novamente';}
      return;
    }
  }

  // Modo sem backend: só aqui tenta persistir localmente.
  try{
    const users=getOperationalUsers(); users.push(created); localStorage.setItem(USERS_KEY,JSON.stringify(users));
  }catch(e){
    showRegisterMessage('Erro ao salvar o cadastro neste navegador: '+(e?.message||e));
    return;
  }

  const session={name,email,unit,sector,role:'operational'};
  setSession(session);
  const access=getAccessState();
  access.currentUser=session.email;
  localStorage.setItem(ACCESS_KEY,JSON.stringify(access));
  const loginOverlay=document.getElementById('loginOverlay');
  const appShell=document.getElementById('appShell');
  if(loginOverlay){loginOverlay.classList.add('hidden');loginOverlay.style.display='none'}
  if(appShell)appShell.classList.remove('hidden');
  refreshAccessUI();enforceAdminVisibility();refreshRoRegistrationAccess();
  showList();refreshNotificationBell();refreshContestPendingBadge();refreshPdcaSidebarBadge();schedulePendingAnnouncementCheck();
}
function initLogin(){
  // Se viemos de um logout, garanta novamente que nenhuma sessão antiga seja restaurada.
  try{
    if(sessionStorage.getItem('nucleo-force-login')==='1'){
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem('nucleo-force-login');
    }
  }catch(e){}
  const existing=getSession();
  if(existing?.sessionExpiryClockVersion===2&&existing?.sessionExpiresAt&&Number(existing.sessionExpiresAt)<=Date.now()){
    setSession(null);try{sessionStorage.setItem('nucleo-session-expired-notice','1')}catch(_){}
  }
  try{if(sessionStorage.getItem('nucleo-session-expired-notice')==='1'){sessionStorage.removeItem('nucleo-session-expired-notice');const message=document.getElementById('loginMessage');if(message)message.textContent='Sua sessão expirou. Entre novamente para continuar.';}}catch(_){}
  refreshSectorSelectors();
  setTimeout(enableMobileLoginKeyboard,0);
  if(SKIP_LOGIN_PREVIEW){
    ensurePreviewSession();
    const login=document.getElementById('loginOverlay');
    if(login) login.classList.add('hidden');
    const app=document.getElementById('appShell');
    if(app) app.classList.remove('hidden');
    return;
  }

  const s=getSession();
  if(s){
    const login=document.getElementById('loginOverlay');
    if(login){
      login.classList.add('hidden');
      login.style.display='none';
    }
    const app=document.getElementById('appShell');
    if(app) app.classList.remove('hidden');
  }else{
    const login=document.getElementById('loginOverlay');
    if(login){
      login.classList.remove('hidden');
      login.style.display='flex';
    }
    const app=document.getElementById('appShell');
    if(app) app.classList.add('hidden');
  }
}
function showProfile(){
  const s=getSession();

  // Meu perfil nunca deve executar logout. Se por algum motivo a sessão
  // não existir, apenas mostramos a tela de login sem apagar qualquer dado.
  if(!s){
    const login=document.getElementById('loginOverlay');
    const app=document.getElementById('appShell');
    if(login){
      login.classList.remove('hidden');
      login.style.display='flex';
    }
    if(app)app.classList.add('hidden');
    return;
  }

  refreshSectorSelectors();

  const name=document.getElementById('profileName');
  const unit=document.getElementById('profileUnit');
  const email=document.getElementById('profileEmail');
  const sector=document.getElementById('profileSector');
  const role=document.getElementById('profileRole');

  if(name)name.value=s.name||'';
  if(email)email.value=s.email||'';
  if(unit)unit.value=s.unit||'Matriz';

  if(sector){
    // Garante que o setor atual continue selecionável mesmo se a configuração
    // tiver sido alterada pelo SGQ depois do login.
    if(s.sector && ![...sector.options].some(o=>o.value===s.sector)){
      const opt=document.createElement('option');
      opt.value=s.sector;
      opt.textContent=s.sector;
      sector.appendChild(opt);
    }
    sector.value=s.sector||'';
  }

  if(role)role.value=s.permissions?'Acesso personalizado':s.role==='admin'?'SGQ':s.role==='quality'?'Qualidade — Filial':s.role==='manager'?'Gestor':'Usuário operacional';

  view('profileView');
  setNav('profile');

  const crumb=document.getElementById('crumbCurrent');
  if(crumb)crumb.textContent='Meu perfil';
}

function saveOwnProfile(){
  const s=getSession();
  if(!s){
    alert('Sua sessão não está ativa. Entre novamente para alterar o perfil.');
    return;
  }

  const name=(document.getElementById('profileName')?.value||'').trim();
  const email=(document.getElementById('profileEmail')?.value||'').trim();
  const unit=(document.getElementById('profileUnit')?.value||'Matriz').trim();
  const sector=(document.getElementById('profileSector')?.value||'').trim();

  if(!name||!email||!sector){
    alert('Preencha nome, e-mail e setor.');
    return;
  }

  const users=getOperationalUsers();
  const oldEmail=String(s.email||'').trim();
  const norm=v=>String(v||'').trim().toLowerCase();

  // Localiza O MESMO cadastro. O perfil nunca cria usuário novo e nunca altera acesso.
  let idx=users.findIndex(u=>norm(u.email)===norm(oldEmail));
  if(idx<0){
    idx=users.findIndex(u=>norm(u.name)===norm(s.name) && norm(u.sector)===norm(s.sector));
  }
  if(idx<0){
    idx=users.findIndex(u=>norm(u.name)===norm(s.name));
  }

  if(idx<0){
    alert('Não encontrei seu cadastro original. Nenhuma alteração foi feita para proteger seu tipo de acesso.');
    return;
  }

  const previous={...users[idx]};

  // REGRA DE SEGURANÇA: role, managedSectors e demais permissões vêm SOMENTE
  // do cadastro existente. "Meu perfil" não pode promovê-las, rebaixá-las
  // nem recalculá-las a partir da sessão ou dos campos da tela.
  const updatedUser={
    ...previous,
    name,
    email,
    unit,
    sector
  };
  users[idx]=updatedUser;

  if(previous.email && norm(previous.email)!==norm(email)){
    portalBackendDelete('users',previous.email);
  }

  localStorage.setItem(USERS_KEY,JSON.stringify(users));
  portalBackendSave('users',email||name,updatedUser);

  const access=getAccessState();
  access.currentUser=email;
  localStorage.setItem(ACCESS_KEY,JSON.stringify(access));

  const updatedSession={
    ...s,
    name,
    email,
    unit,
    sector,
    // Mantém exatamente as permissões que já estavam no cadastro.
    role:previous.role,
    managedSectors:Array.isArray(previous.managedSectors)?previous.managedSectors:[]
  };
  setSession(updatedSession);

  refreshAccessUI();
  enforceAdminVisibility();
  refreshRoRegistrationAccess();

  alert('Seus dados foram atualizados.');
  showProfile();
}
async function changeOwnPassword(){
  const s=getSession();
  if(!s){alert('Sua sessão não está ativa. Entre novamente.');return}

  const current=document.getElementById('profileCurrentPassword')?.value||'';
  const next=document.getElementById('profileNewPassword')?.value||'';
  const next2=document.getElementById('profileNewPassword2')?.value||'';

  if(!current||!next||!next2){alert('Preencha a senha atual, a nova senha e a confirmação.');return}
  if(next.length<4){alert('A nova senha precisa ter pelo menos 4 caracteres.');return}
  if(next!==next2){alert('A confirmação da nova senha não coincide.');return}
  if(current===next){alert('A nova senha precisa ser diferente da senha atual.');return}

  await showNucleoLoading('Alterando sua senha...','Segurança da conta');
  try{
    const remote=await portalJsonp({
      acao:'portal_change_own_password',
      currentPassword:current,
      newPassword:next
    },20000);
    if(!remote || remote.sucesso!==true){
      throw new Error((remote&&remote.erro)||'Não foi possível alterar a senha.');
    }

    // Atualiza apenas o cache local, se o cadastro estiver disponível. A base central é a fonte de verdade.
    try{
      const users=getOperationalUsers();
      const norm=v=>String(v||'').trim().toLowerCase();
      let idx=users.findIndex(u=>norm(u.email)===norm(s.email));
      if(idx<0) idx=users.findIndex(u=>norm(u.name)===norm(s.name)&&norm(u.sector)===norm(s.sector));
      if(idx>=0){
        users[idx]={...users[idx],password:next,passwordChangedAt:new Date().toISOString(),passwordChangedBy:s.name||s.email||'Usuário'};
        localStorage.setItem(USERS_KEY,JSON.stringify(users));
      }
    }catch(cacheErr){console.warn('Senha alterada na base central; cache local não pôde ser atualizado.',cacheErr)}

    if(remote.confirmado!==true){
      throw new Error('A base central respondeu, mas não confirmou a gravação da nova senha.');
    }
    ['profileCurrentPassword','profileNewPassword','profileNewPassword2'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
    alert('Senha alterada e confirmada na base central. Por segurança, entre novamente usando a nova senha.');
    try{ clearSession(); }catch(_e){
      try{ localStorage.removeItem(SESSION_KEY); sessionStorage.removeItem(SESSION_KEY); }catch(__e){}
    }
    location.reload();
  }catch(err){
    alert('Não foi possível alterar a senha. Motivo: '+(err&&err.message?err.message:String(err)));
  }finally{
    hideNucleoLoading(true);
  }
}




const DOCUMENT_REQUEST_ALLOWED_SECTORS=[
  'Comercial Interno',
  'Comercial Externo',
  'Diretoria',
  'SGQ'
];

function canRequestDocuments(){
  const s=getSession();
  if(!s)return false;
  if(s.permissions)return nucleoPersonFeatureCan('documents','request')||nucleoPersonFeatureCan('documents','consult');
  const current=normalizeAnswer(String(s.sector||s.setor||''));
  if(!current)return false;
  return DOCUMENT_REQUEST_ALLOWED_SECTORS.some(sec=>normalizeAnswer(sec)===current);
}

const EXTERNAL_RO_ALLOWED_SECTORS=[
  'Comercial Interno',
  'Comercial Externo',
  'Diretoria',
  'Processos',
  'SGQ'
];

function canRegisterExternalRo(){
  const s=getSession();
  if(!s)return false;
  if(s.permissions)return nucleoPersonPermissions(s).registerExternal;
  if(s.role==='quality')return true;
  const current=normalizeAnswer(String(s.sector||s.setor||''));
  if(!current)return false;
  return EXTERNAL_RO_ALLOWED_SECTORS.some(sec=>normalizeAnswer(sec)===current);
}

function openExternalRoRegistrationForm(){
  if(!canRegisterExternalRo()){
    alert('O cadastro de R.O. Externa / SAC é restrito aos setores Comercial, Diretoria, Processos e SGQ.');
    return;
  }

  const session=getSession()||{};
  try{
    localStorage.setItem('ro-pdca-last-external-registration-intent-v1',JSON.stringify({
      user:session.name||'',
      sector:session.sector||'',
      openedAt:new Date().toISOString()
    }));
  }catch(e){}

  window.open(
    'https://docs.google.com/forms/d/e/1FAIpQLScUUEmDzeajsPNzIv6yQVdQJSb9zV1wYG9d7nx4dhmWooaEPw/viewform?usp=dialog',
    '_blank',
    'noopener,noreferrer'
  );
}


function applyExternalRoAccessClass(){
  const body=document.body;
  if(!body)return;
  body.classList.toggle('external-ro-denied',!canRegisterExternalRo());
}

function refreshRoRegistrationAccess(){
  applyExternalRoAccessClass();
  const normalBtn=document.getElementById('navNewRo');
  const externalBtn=document.getElementById('navNewExternalRo');
  const admin=getSession()?.permissions?!nucleoPersonPermissions(getSession()).registerRo:isAdmin()&&getSession()?.role!=='quality';

  // Qualidade da filial também pode cadastrar ocorrências.
  if(normalBtn){
    normalBtn.classList.toggle('hidden',admin);
    normalBtn.style.display=admin?'none':'';
  }

  // R.O. Externa / SAC depende exclusivamente do setor autorizado,
  // independentemente de o perfil ser ADM ou operacional.
  const canExternal=canRegisterExternalRo();
  if(externalBtn){
    externalBtn.classList.toggle('hidden',!canExternal);
    externalBtn.style.display=canExternal?'':'none';
  }
}

function openRoRegistrationForm(){
  const session=getSession()||{};
  try{
    localStorage.setItem('ro-pdca-last-registration-intent-v1',JSON.stringify({
      user:session.name||'',
      sector:session.sector||'',
      openedAt:new Date().toISOString()
    }));
  }catch(e){}

  window.open('https://docs.google.com/forms/d/1LSG3TpZAYmevKX77O0uVQM8BCTw1JCd-DB9fUJjTrBU/viewform','_blank','noopener,noreferrer');
}

function logoutUser(){
  // Logout robusto: apaga todas as formas de sessão e recarrega o app.
  // O reload evita depender de elementos antigos como #appShell.
  loginAttemptNonce++;
  try{localStorage.removeItem(SESSION_KEY)}catch(e){}
  try{sessionStorage.removeItem(SESSION_KEY)}catch(e){}
  try{sessionStorage.setItem('nucleo-force-login','1')}catch(e){}
  nucleoSessionMemory=null;
  try{
    const access=JSON.parse(localStorage.getItem(ACCESS_KEY)||'{}')||{};
    access.currentUser='';
    localStorage.setItem(ACCESS_KEY,JSON.stringify(access));
  }catch(e){}
  try{window.currentUser=null}catch(e){}
  window.location.reload();
}

function closePdfPreview(){
  document.getElementById('pdfPreviewModal').classList.remove('open');
  if(currentPdfUrl){URL.revokeObjectURL(currentPdfUrl);currentPdfUrl=null}
  document.getElementById('pdfPreviewFrame').src='about:blank';
  const ext=document.getElementById('externalRoPdfLink'); if(ext) ext.style.display='none';
}
function downloadPreviewPdf(){
  if(!currentPdfBlob)return;
  const url=URL.createObjectURL(currentPdfBlob);
  const a=document.createElement('a');a.href=url;a.download=currentPdfFilename;
  document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1200);
}
function showPdfBlob(blob,filename){
  currentPdfBlob=blob;currentPdfFilename=filename||'PDCA.pdf';
  if(currentPdfUrl)URL.revokeObjectURL(currentPdfUrl);
  currentPdfUrl=URL.createObjectURL(blob);
  document.getElementById('pdfPreviewFrame').src=currentPdfUrl;
  document.getElementById('pdfPreviewModal').classList.add('open');
}



const USERS_KEY='ro-pdca-users-v4';
const DELETED_USERS_KEY='ro-pdca-deleted-users-v1';
const SENT_PDCA_KEY='ro-pdca-sent-v2';

function safeStorageSet(key,value){
  try{
    localStorage.setItem(key,value);
    return true;
  }catch(e){
    if(e && (e.name==='QuotaExceededError'||String(e.message||'').toLowerCase().includes('quota'))){
      console.warn('Portal SGQ: armazenamento local cheio para '+key+'. O dado continuará pela base central quando possível.');
      return false;
    }
    throw e;
  }
}


function getDeletedUserKeys(){
  try{
    const v=JSON.parse(localStorage.getItem(DELETED_USERS_KEY)||'[]');
    return Array.isArray(v)?v.map(x=>String(x||'').trim().toLowerCase()).filter(Boolean):[];
  }catch(e){return []}
}
function rememberDeletedUser(key){
  const normalized=String(key||'').trim().toLowerCase();
  if(!normalized)return;
  const set=new Set(getDeletedUserKeys());
  set.add(normalized);
  localStorage.setItem(DELETED_USERS_KEY,JSON.stringify([...set]));
}
function forgetDeletedUser(key){
  const normalized=String(key||'').trim().toLowerCase();
  const list=getDeletedUserKeys().filter(x=>x!==normalized);
  localStorage.setItem(DELETED_USERS_KEY,JSON.stringify(list));
}
function isDeletedUserRecord(u){
  const deleted=new Set(getDeletedUserKeys());
  const email=String(u?.email||'').trim().toLowerCase();
  const name=String(u?.name||'').trim().toLowerCase();
  return (email&&deleted.has(email)) || (name&&deleted.has(name));
}

function getOperationalUsers(){
  let parsed=null;
  try{parsed=JSON.parse(localStorage.getItem(USERS_KEY)||'null');}catch(e){parsed=null}
  const hadStoredUsers=Array.isArray(parsed);
  let users=hadStoredUsers?parsed:[];

  if(getSession()?.role==='quality')return users.filter(u=>!isDeletedUserRecord(u)&&!nucleoPersonPermissions(u).sgq&&explicitPortalUnit(u.unit)==='filial');
  // Usuários apagados pelo ADM não podem reaparecer por cache antigo/sincronização atrasada.
  users=users.filter(u=>!isDeletedUserRecord(u));

  const adminIndex=users.findIndex(u=>
    String(u.email||'').toLowerCase()==='sgq@empresa.com' ||
    (String(u.name||'').trim().toLowerCase()==='administrador sgq' &&
     String(u.sector||'').trim().toLowerCase()==='sgq')
  );

  const adminUser={
    name:'Administrador SGQ',
    email:'sgq@empresa.com',
    unit:'Todas',
    sector:'SGQ',
    role:'admin',
    password:'1234',
    approvalStatus:'approved'
  };

  if(adminIndex>=0){
    users[adminIndex]={
      ...adminUser,
      ...users[adminIndex],
      role:'admin',
      sector:'SGQ',
      approvalStatus:'approved'
    };
    if(!String(users[adminIndex].password||''))users[adminIndex].password='1234';
  }else{
    users.unshift(adminUser);
  }

  // Os usuários demonstrativos só são criados na PRIMEIRA inicialização.
  // Depois disso, se o ADM apagar um deles, ele permanece apagado.
  if(!hadStoredUsers){
    users.push(
      {name:'Responsável Produção',email:'responsavel@empresa.com',unit:'Matriz',sector:'Produção',password:'1234',role:'operational'},
      {name:'Usuário Logística',email:'logistica@empresa.com',unit:'Filial',sector:'Logística',password:'1234',role:'operational'}
    );
  }

  localStorage.setItem(USERS_KEY,JSON.stringify(users));
  return users;
}
function saveOperationalUsers(users){
  claimantIdentityCache=null;
  localStorage.setItem(USERS_KEY,JSON.stringify(users));
  if(portalBackendEnabled()){
    (users||[]).forEach(u=>portalBackendSave('users',u.email||u.name,u));
  }
  renderOperationalUsers();
  try{refreshNewUserManagerFields()}catch(e){}
}


async function diagnoseUserRegistry(){
  if(!isAdmin())return;
  const st=document.getElementById('pendingRegistrationStatus');
  if(st)st.textContent='Executando diagnóstico...';
  try{
    const res=await portalJsonp({acao:'portal_pending_users'},25000);
    if(res?.sucesso===false)throw new Error(res.erro||'Falha na leitura.');
    const users=Array.isArray(res.users)?res.users:[];
    const pending=users.filter(u=>!nucleoPersonPermissions(u).sgq&&u.approvalStatus==='pending');
    const approved=users.filter(u=>!nucleoPersonPermissions(u).sgq&&u.approvalStatus==='approved');
    if(st)st.textContent='Base respondeu: '+users.length+' usuário(s), '+pending.length+' pendente(s), '+approved.length+' aprovado(s).';
    alert('Base de usuários respondeu corretamente.\n\nTotal: '+users.length+'\nPendentes: '+pending.length+'\nAprovados: '+approved.length);
  }catch(e){
    if(st)st.textContent='Diagnóstico falhou.';
    alert('Falha na leitura da base de usuários: '+(e.message||e));
  }
}
async function refreshPendingRegistrations(showMessage=false){
  if(!isAdmin())return false;
  const status=document.getElementById('pendingRegistrationStatus');
  if(status)status.textContent='Buscando cadastros...';

  if(!portalBackendEnabled()){
    renderOperationalUsers();
    if(status)status.textContent='Base central não configurada.';
    if(showMessage)alert('Configure a URL do Apps Script para receber cadastros feitos em outros navegadores.');
    return false;
  }

  try{
    const res=await portalJsonp({acao:'portal_pending_users'});
    if(res?.sucesso===false)throw new Error(res.erro||'Falha ao carregar cadastros.');

    const remote=Array.isArray(res.users)?res.users:[];
    const local=getOperationalUsers();
    const map=new Map();

    local.forEach(u=>map.set(String(u.email||u.name||'').toLowerCase(),u));
    remote.forEach(u=>{
      const key=String(u.email||u.name||'').toLowerCase();
      const existing=map.get(key)||{};
      map.set(key,{...existing,...u});
    });

    const merged=[...map.values()];
    localStorage.setItem(USERS_KEY,JSON.stringify(merged));
    renderOperationalUsers();

    const pending=merged.filter(u=>!nucleoPersonPermissions(u).sgq&&u.approvalStatus==='pending').length;
    if(status)status.textContent=pending?pending+' cadastro(s) aguardando aprovação.':'Nenhum cadastro pendente.';
    // Atualiza imediatamente os avisos do SGQ após sincronizar a base central.
    try{refreshNotificationBell()}catch(e){}
    try{refreshMenuNotificationBadges()}catch(e){}
    try{renderPendingHubNotifications()}catch(e){}
    if(showMessage&&!pending)alert('Nenhum cadastro pendente foi encontrado na base central.');
    return true;
  }catch(e){
    renderOperationalUsers();
    if(status)status.textContent='Erro ao buscar pendências.';
    if(showMessage)alert('Não foi possível buscar cadastros pendentes: '+(e.message||e));
    return false;
  }
}

function canonicalPortalUnit(v){
  return normalizePortalUnit(v)==='filial'
    ? 'Unidade Linhares - Filial'
    : 'Unidade São Bento do Sul - Matriz';
}
function portalUnitDisplay(v){
  return normalizePortalUnit(v)==='filial'
    ? 'SETA ES - Filial'
    : 'SETA SC - Matriz';
}

function openUserRegistrationEditor(key){
  if(!nucleoFeatureRequire('users','edit'))return;
  if(!isAdmin())return;
  const users=getOperationalUsers();
  const u=users.find(x=>String(x.email||x.name)===String(key));
  if(!u)return;
  if(nucleoPersonPermissions(u).sgq&&!nucleoPersonPermissions(getSession()).sgq)return;

  const title=document.getElementById('userRegistrationEditTitle');
  const keyEl=document.getElementById('userRegistrationEditKey');
  const unitSel=document.getElementById('userRegistrationEditUnit');
  const sectorSel=document.getElementById('userRegistrationEditSector');
  if(title)title.textContent='Editar cadastro · '+String(u.name||u.email||'Usuário');
  if(keyEl)keyEl.value=String(u.email||u.name||'');
  let access=document.getElementById('userRegistrationAccessControl');
  if(!access){access=document.createElement('div');access.id='userRegistrationAccessControl';access.style.cssText='padding:12px;margin-bottom:12px;border:1px solid #d5e2ef;border-radius:10px;background:#f1f7ff';keyEl?.before(access);}
  const roleLabel={admin:'SGQ',quality:'Qualidade — somente Filial',manager:'Gestor',operational:'Usuário operacional'}[u.role]||'Usuário operacional';
  access.innerHTML='<div class="label">Tipo de acesso atual</div><b>'+escapeHtml(roleLabel)+'</b>';
  if(nucleoPersonCan('users',true)){
    const button=document.createElement('button');button.type='button';button.className='btn secondary';button.style.marginLeft='12px';button.textContent='Editar acesso';
    button.onclick=()=>{closeUserRegistrationEditor();openUnitUserAccess(encodeURIComponent(u.personId||u.email||u.name));};access.appendChild(button);
    const help=document.createElement('p');help.className='small';help.textContent='Para administrar a Filial, selecione Qualidade — somente Filial. O setor Qualidade não altera o perfil automaticamente.';access.appendChild(help);
  }
  const parts=splitPersonNameDescription(u.name,u.description);
  document.getElementById('userRegistrationEditName').value=parts.name;
  document.getElementById('userRegistrationEditDescription').value=parts.description;
  if(unitSel)unitSel.value=canonicalPortalUnit(u.unit);
  if(sectorSel){
    const sectors=getConfiguredSectorsForTriage();
    sectorSel.innerHTML='<option value="">Selecione o setor...</option>'+sectors.map(s=>`<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
    if(u.sector && !sectors.includes(u.sector))sectorSel.innerHTML+=`<option value="${escapeHtml(u.sector)}">${escapeHtml(u.sector)}</option>`;
    sectorSel.value=u.sector||'';
  }
  document.getElementById('userRegistrationEditOverlay')?.classList.add('open');
  document.body.style.overflow='hidden';
}
function closeUserRegistrationEditor(){
  document.getElementById('userRegistrationEditOverlay')?.classList.remove('open');
  document.body.style.overflow='';
}
async function saveUserRegistrationEditor(){
  if(!nucleoFeatureRequire('users','edit'))return;
  if(!isAdmin())return;
  const key=String(document.getElementById('userRegistrationEditKey')?.value||'');
  const unit=String(document.getElementById('userRegistrationEditUnit')?.value||'').trim();
  const sector=String(document.getElementById('userRegistrationEditSector')?.value||'').trim();
  if(!unit){alert('Selecione a unidade.');return}
  if(!sector){alert('Selecione o setor principal.');return}

  const users=getOperationalUsers();
  const idx=users.findIndex(u=>String(u.email||u.name)===key);
  if(idx<0){alert('Usuário não encontrado.');return}
  const before={unit:users[idx].unit||'',sector:users[idx].sector||''};
  const name=String(document.getElementById('userRegistrationEditName').value||'').trim();
  const description=String(document.getElementById('userRegistrationEditDescription').value||'').trim();
  if(!name){alert('Informe o nome de acesso.');return;}
  const updated={
    ...users[idx],name,description,
    unit:canonicalPortalUnit(unit),
    sector,
    updatedAt:new Date().toISOString(),
    updatedBy:getSession()?.name||'SGQ'
  };

  await showNucleoLoading('Salvando alteração na base central...','Atualizando cadastro');
  try{
    const result=await portalJsonp({acao:'portal_person_identity',person:updated.personId||users[idx].email||users[idx].name,name,description,unit:canonicalPortalUnit(unit),sector,aliases:JSON.stringify(updated.aliases||[])},60000);
    if(!result?.sucesso)throw new Error(result?.erro||'Alteração não confirmada.');
    const fresh=await portalJsonp({acao:'portal_load'},60000);
    if(!fresh?.sucesso)throw new Error('Nome salvo; sincronize novamente para atualizar o cadastro.');
    applyPortalBackendSnapshot(fresh);
    const remote=(fresh.dados?.users||[]).find(u=>u.personId===updated.personId||String(u.email||u.name)===key);
    if(remote)Object.assign(updated,remote);
    claimantIdentityCache=null;
    users[idx]=updated;
    localStorage.setItem(USERS_KEY,JSON.stringify(users));
    addPortalAuditEvent('editar_cadastro_usuario',updated.email||updated.name,{
      name:updated.name,
      oldUnit:before.unit,newUnit:updated.unit,
      oldSector:before.sector,newSector:updated.sector
    });

    const session=getSession();
    if(session && String(session.email||'').toLowerCase()===String(updated.email||'').toLowerCase()){
      setSession({...session,name:updated.name,description:updated.description,personId:updated.personId,unit:updated.unit,sector:updated.sector});
    }

    closeUserRegistrationEditor();
    renderOperationalUsers();
    try{renderPendingHub()}catch(e){}
    try{refreshSectorSelectors()}catch(e){}
    alert('Cadastro salvo na base central: '+portalUnitDisplay(updated.unit)+' · '+updated.sector+'.');
  }catch(e){
    alert('Não foi possível salvar a alteração. O cadastro local não foi alterado.\n\n'+(e?.message||e));
  }finally{
    hideNucleoLoading(true);
  }
}

function openAdminResetPassword(key){
 if(!nucleoFeatureRequire('users','edit'))return;
  if(!isAdmin())return;
  const users=getOperationalUsers();
  const u=users.find(x=>String(x.email||x.name)===String(key));
  if(!u)return;

  const keyEl=document.getElementById('adminResetPasswordUserKey');
  const title=document.getElementById('adminResetPasswordTitle');
  const p1=document.getElementById('adminResetPasswordNew');
  const p2=document.getElementById('adminResetPasswordConfirm');
  if(keyEl)keyEl.value=String(u.email||u.name||'');
  if(title)title.textContent='Redefinir senha · '+String(u.name||u.email||'Usuário');
  if(p1)p1.value='';
  if(p2)p2.value='';

  document.getElementById('adminResetPasswordOverlay')?.classList.add('open');
  document.body.style.overflow='hidden';
}
function closeAdminResetPassword(){
  document.getElementById('adminResetPasswordOverlay')?.classList.remove('open');
  document.body.style.overflow='';
}
function saveAdminResetPassword(){
  if(!isAdmin())return;
  const key=document.getElementById('adminResetPasswordUserKey')?.value||'';
  const p1=document.getElementById('adminResetPasswordNew')?.value||'';
  const p2=document.getElementById('adminResetPasswordConfirm')?.value||'';

  if(!p1||!p2){alert('Informe e confirme a nova senha.');return}
  if(p1.length<4){alert('A nova senha precisa ter pelo menos 4 caracteres neste protótipo.');return}
  if(p1!==p2){alert('A confirmação da senha não coincide.');return}

  const users=getOperationalUsers();
  const idx=users.findIndex(u=>String(u.email||u.name)===String(key));
  if(idx<0){alert('Usuário não encontrado.');return}

  users[idx]={
    ...users[idx],
    password:p1,
    passwordResetAt:new Date().toISOString(),
    passwordResetBy:getSession()?.name||'Administrador SGQ'
  };

  localStorage.setItem(USERS_KEY,JSON.stringify(users));
  portalBackendSave('users',users[idx].email||users[idx].name,users[idx]);
  addPortalAuditEvent('redefinir_senha_usuario',users[idx].email||users[idx].name,{
    name:users[idx].name,
    role:users[idx].role||'operational'
  });

  closeAdminResetPassword();
  renderOperationalUsers();
  alert('Senha de '+(users[idx].name||'usuário')+' redefinida com sucesso.');
}

let operationalUsersLimit=5;
function filterOperationalUsers(){operationalUsersLimit=5;renderOperationalUsers();}
function showMoreOperationalUsers(){operationalUsersLimit+=5;renderOperationalUsers();}
function clearOperationalUsersFilters(){
  ['operationalUserSearch','operationalUserSector','operationalUserUnit','operationalUserStatus'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  filterOperationalUsers();
}
function renderOperationalUsers(){
  const box=document.getElementById('operationalUsersList'); if(!box)return;
  const allUsers=getOperationalUsers().filter(u=>getSession()?.role!=='quality'||explicitPortalUnit(u.unit)==='filial');
  let controls=document.getElementById('operationalUsersFilters');
  if(!controls){
    controls=document.createElement('div');controls.id='operationalUsersFilters';
    controls.innerHTML='<div class="settings-grid"><label><div class="label">Buscar pessoa</div><input id="operationalUserSearch" placeholder="Nome, descrição ou e-mail"></label><label><div class="label">Setor</div><select id="operationalUserSector"></select></label><label><div class="label">Unidade</div><select id="operationalUserUnit"></select></label><label><div class="label">Situação</div><select id="operationalUserStatus"><option value="">Todos os cadastros</option><option value="pending">Aguardando aprovação</option><option value="approved">Aprovados</option><option value="rejected">Recusados</option><option value="inactive">Desativados</option></select></label></div><div class="actions"><button class="btn secondary" type="button" onclick="clearOperationalUsersFilters()">Limpar filtros</button></div><p class="small" id="operationalUsersCount" aria-live="polite"></p>';
    box.before(controls);
    document.getElementById('operationalUserSearch').addEventListener('input',filterOperationalUsers);
    ['operationalUserSector','operationalUserUnit','operationalUserStatus'].forEach(id=>document.getElementById(id).addEventListener('change',filterOperationalUsers));
  }
  function options(id,values,label){
    const el=document.getElementById(id),selected=el.value;
    el.innerHTML='<option value="">'+label+'</option>'+[...new Set(values.filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR')).map(v=>'<option value="'+escapeHtml(v)+'">'+escapeHtml(v)+'</option>').join('');
    el.value=selected;
  }
  options('operationalUserSector',allUsers.flatMap(u=>[u.sector,...(u.managedSectors||[])]),'Todos os setores');
  options('operationalUserUnit',allUsers.map(u=>portalUnitDisplay(u.unit)),'Todas as unidades');
  const query=normalizePersonName(document.getElementById('operationalUserSearch').value);
  const sector=document.getElementById('operationalUserSector').value;
  const unit=getSession()?.role==='quality'?'SETA ES - Filial':document.getElementById('operationalUserUnit').value;
  const status=document.getElementById('operationalUserStatus').value;
  const filtered=allUsers.filter(u=>{
    const state=u.approvalStatus||'approved';
    return (!query||normalizePersonName([u.name,u.description,u.email,...(u.aliases||[])].join(' ')).includes(query))&&
      (!sector||u.sector===sector||(u.managedSectors||[]).includes(sector))&&
      (!unit||explicitPortalUnit(u.unit)===explicitPortalUnit(unit))&&
      (!status||(status==='inactive'?['inactive','disabled'].includes(state):state===status));
  }).sort((a,b)=>Number(b.approvalStatus==='pending')-Number(a.approvalStatus==='pending')||String(a.name||'').localeCompare(String(b.name||''),'pt-BR'));
  const users=filtered.slice(0,operationalUsersLimit);
  document.getElementById('operationalUsersCount').textContent='Exibindo '+users.length+' de '+filtered.length+' cadastro(s)'+(filtered.length!==allUsers.length?' encontrados · '+allUsers.length+' no total':'')+'.';

  const pending=users.filter(u=>!nucleoPersonPermissions(u).sgq&&u.approvalStatus==='pending');
  const approved=users.filter(u=>u.role==='admin'||u.approvalStatus!=='pending');

  const pendingHtml=pending.length?`
    <div style="margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px">
        <b>Cadastros aguardando aprovação</b>
        <span class="status-badge pending">${pending.length}</span>
      </div>
      ${pending.map(u=>`
        <div class="admin-user-row" style="border-color:#f0d49a;background:#fffaf0">
          <div class="admin-user-info">
            <div class="admin-avatar">${escapeHtml((u.name||'?').charAt(0).toUpperCase())}</div>
            <div>
              <div class="admin-email">${escapeHtml(personDisplayName(u)||u.email||'Usuário')}</div>
              <div class="small">${escapeHtml(u.email||'')} · ${escapeHtml(portalUnitDisplay(u.unit))} · ${escapeHtml(u.sector||'—')}</div>
              <div class="small" style="margin-top:3px">Senha: ${String(u.password||'').trim()?'cadastrada':'não definida'}</div>
              <span class="role-tag">Aguardando aprovação</span>
            </div>
          </div>
          <div class="actions">
            <button class="btn secondary" type="button" onclick="openUserRegistrationEditor('${escapeHtml(u.email||u.name)}')">Editar cadastro</button>
            <button class="btn secondary" type="button" onclick="openAdminResetPassword('${escapeHtml(u.email||u.name)}')">Redefinir senha</button>
            <button class="btn primary" type="button" onclick="approvePortalUser('${escapeHtml(u.email||u.name)}')">Aprovar</button>
            <button class="btn secondary" type="button" onclick="rejectPortalUser('${escapeHtml(u.email||u.name)}')">Recusar</button>
          </div>
        </div>`).join('')}
    </div>`:'';

  const approvedHtml=approved.length?approved.map((u,i)=>`
    <div class="admin-user-row">
      <div class="admin-user-info">
        <div class="admin-avatar">${escapeHtml((u.name||u.email||'?').charAt(0).toUpperCase())}</div>
        <div>
          <div class="admin-email">${escapeHtml(personDisplayName(u)||u.email||'Usuário')}</div>
          <div class="small">${escapeHtml(u.email||'')} · ${escapeHtml(portalUnitDisplay(u.unit))} · ${escapeHtml(u.sector||'Todos os setores')}</div>
          <div class="small" style="margin-top:3px">Senha: ${String(u.password||'').trim()?'cadastrada':'não definida'}</div>
          <span class="role-tag">${u.permissions?'Acesso personalizado':u.role==='admin'?'SGQ':u.role==='quality'?'Qualidade — Filial':u.role==='manager'?'Gestor':'Usuário operacional'}</span>
          ${u.role==='manager'||(u.managedSectors||[]).length?`<div class="small" style="margin-top:4px"><b>Gerencia:</b> ${escapeHtml((u.managedSectors||[]).join(', ')||'Nenhum setor')}</div>`:''}
        </div>
      </div>
      ${nucleoPersonCan('users',true)?`<button class="btn secondary" type="button" onclick="openUnitUserAccess('${encodeURIComponent(u.personId||u.email||u.name)}')">Editar acesso</button>`:''}
      <div class="actions">
        <button class="btn secondary" type="button" onclick="openManagerSectorsEditor('${escapeHtml(u.email||u.name)}')">Editar gestão</button>
        <button class="btn secondary" type="button" onclick="openUserRegistrationEditor('${escapeHtml(u.email||u.name)}')">Editar cadastro</button>
        <button class="btn secondary" type="button" onclick="openAdminResetPassword('${escapeHtml(u.email||u.name)}')">Redefinir senha</button>
        <button class="remove-admin" type="button" onclick="removeOperationalUserByKey('${escapeHtml(u.email||u.name)}')">Excluir login</button>
      </div>
    </div>`).join(''):'';

  box.innerHTML=filtered.length?pendingHtml+approvedHtml+(users.length<filtered.length?'<div class="actions"><button class="btn secondary" type="button" onclick="showMoreOperationalUsers()">Mostrar mais 5</button></div>':''):'<div class="small">Nenhum cadastro encontrado com estes filtros.</div>';
  box.querySelectorAll('.admin-user-row').forEach(row=>{const button=row.querySelector("button[onclick^='openUnitUserAccess']"),actions=row.querySelector('.actions');if(button&&actions)actions.prepend(button);});
}
async function approvePortalUser(key){
  if(!nucleoFeatureRequire('users','approve'))return;
  if(!isAdmin())return;
  const users=getOperationalUsers();
  const idx=users.findIndex(u=>String(u.email||u.name)===String(key));
  if(idx<0)return;

  const original={...users[idx]};
  users[idx].approvalStatus='approved';
  users[idx].approvedAt=new Date().toISOString();
  users[idx].approvedBy=getSession()?.name||'SGQ';

  if(portalBackendEnabled()){
    const st=document.getElementById('pendingRegistrationStatus');
    if(st)st.textContent='Aprovando cadastro...';
    try{
      const res=await portalJsonp({
        acao:'portal_update_user_status',
        userId:String(users[idx].email||users[idx].name),
        status:'approved',
        ator:getSession()?.name||'SGQ'
      },25000);
      if(!res?.sucesso)throw new Error(res?.erro||'A base central não confirmou a aprovação.');

      const verify=await portalJsonp({acao:'portal_pending_users'},25000);
      const remote=Array.isArray(verify?.users)?verify.users:[];
      const saved=remote.find(u=>String(u.email||u.name)===String(users[idx].email||users[idx].name));
      if(!saved||saved.approvalStatus!=='approved')throw new Error('A aprovação não foi confirmada na base central.');

      localStorage.setItem(USERS_KEY,JSON.stringify(users));
      renderOperationalUsers();
      try{renderPendingHub()}catch(e){}
      addPortalAuditEvent('aprovar_usuario',users[idx].email||users[idx].name,{name:users[idx].name,sector:users[idx].sector});
      if(st)st.textContent='Cadastro de '+(users[idx].name||'usuário')+' aprovado.';
      alert('Cadastro aprovado. O usuário já pode entrar no Portal SGQ.');
      return;
    }catch(e){
      users[idx]=original;
      localStorage.setItem(USERS_KEY,JSON.stringify(users));
      renderOperationalUsers();
      if(st)st.textContent='Falha ao aprovar.';
      alert('Não foi possível aprovar o cadastro: '+(e.message||e));
      return;
    }
  }

  saveOperationalUsers(users);
  try{renderPendingHub()}catch(e){}
  addPortalAuditEvent('aprovar_usuario',users[idx].email||users[idx].name,{name:users[idx].name,sector:users[idx].sector});
  alert('Cadastro aprovado.');
}
async function rejectPortalUser(key){
  if(!nucleoFeatureRequire('users','approve'))return;
  if(!isAdmin())return;
  const users=getOperationalUsers();
  const idx=users.findIndex(u=>String(u.email||u.name)===String(key));
  if(idx<0)return;
  if(!confirm('Recusar este cadastro?'))return;

  const original={...users[idx]};
  users[idx].approvalStatus='rejected';
  users[idx].rejectedAt=new Date().toISOString();
  users[idx].rejectedBy=getSession()?.name||'SGQ';

  if(portalBackendEnabled()){
    try{
      const res=await portalJsonp({
        acao:'portal_update_user_status',
        userId:String(users[idx].email||users[idx].name),
        status:'rejected',
        ator:getSession()?.name||'SGQ'
      },25000);
      if(!res?.sucesso)throw new Error(res?.erro||'A base central não confirmou a recusa.');
    }catch(e){
      users[idx]=original;
      localStorage.setItem(USERS_KEY,JSON.stringify(users));
      renderOperationalUsers();
      alert('Não foi possível recusar o cadastro: '+(e.message||e));
      return;
    }
  }

  localStorage.setItem(USERS_KEY,JSON.stringify(users));
  renderOperationalUsers();
  addPortalAuditEvent('recusar_usuario',users[idx].email||users[idx].name,{name:users[idx].name,sector:users[idx].sector});
}
function removeOperationalUserByKey(key){
  if(!nucleoFeatureRequire('users','delete'))return;
  if(!isAdmin())return;
  const users=getOperationalUsers();
  const normalized=String(key||'').trim().toLowerCase();
  const u=users.find(x=>
    String(x.email||'').trim().toLowerCase()===normalized ||
    String(x.name||'').trim().toLowerCase()===normalized
  );
  if(!u)return;
  if(u.role==='admin'){if(!nucleoPersonPermissions(getSession()).sgq)return;return deleteAdminAccountByEmail(u.email);}

  const label=u.name||u.email||'este usuário';
  if(!confirm('Apagar definitivamente o cadastro de '+label+'?'))return;

  const deleteKey=String(u.email||u.name||key).trim();
  rememberDeletedUser(deleteKey);
  if(u.name)rememberDeletedUser(u.name);

  const filtered=users.filter(x=>x!==u && !isDeletedUserRecord(x));
  localStorage.setItem(USERS_KEY,JSON.stringify(filtered));

  portalBackendDelete('users',deleteKey);
  addPortalAuditEvent('apagar_usuario',deleteKey,{name:u.name,sector:u.sector,email:u.email});

  renderOperationalUsers();
  try{refreshNewUserManagerFields()}catch(e){}
  alert('Usuário apagado.');
}
function addPortalAuditEvent(action,recordId,data){
  const item={
    id:'AUD-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),
    action,
    recordId:String(recordId||''),
    by:getSession()?.name||'Sistema',
    at:new Date().toISOString(),
    summary:JSON.stringify(data||{}).slice(0,500)
  };
  const list=getRuleAudit();
  list.unshift(item);
  localStorage.setItem(RULE_AUDIT_KEY,JSON.stringify(list.slice(0,100)));
  portalBackendSave('audit',item.id,item);
}

async function addOperationalUser(){
  if(!nucleoFeatureRequire('users','create'))return;
  if(!isAdmin())return;
  const name=(document.getElementById('newUserName')?.value||'').trim();
  const email=(document.getElementById('newUserEmail')?.value||'').trim().toLowerCase();
  const sector=(document.getElementById('newUserSector')?.value||'').trim();
  const unit=canonicalPortalUnit(document.getElementById('newUserUnit')?.value||'Unidade São Bento do Sul - Matriz');
  const role=document.getElementById('newUserRole')?.value||'operational';
  const managedSectors=role==='manager'?[...(document.getElementById('newUserManagedSectors')?.selectedOptions||[])].map(o=>o.value):[];
  const password=(document.getElementById('newUserPassword')?.value||'1234').trim();
  if(!name||!email||!sector){alert('Informe nome, e-mail SETA e setor principal.');return;}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){alert('Informe um e-mail corporativo válido.');return}
  if(role==='manager'&&!managedSectors.length){alert('Selecione pelo menos um setor sob gestão.');return}
  const users=getOperationalUsers();
  if(users.some(u=>String(u.email||'').toLowerCase()===email)){alert('Já existe um usuário com este e-mail.');return}
  const description=String(document.getElementById('newUserDescription')?.value||'').trim();
  const newUser={name,description,email,sector,unit:role==='quality'?'Unidade Linhares - Filial':unit,password,role,managedSectors,approvalStatus:'approved',createdAt:new Date().toISOString()};
  try{await portalBackendSaveConfirmed('users',newUser.email,newUser);}catch(e){alert(e.message||e);return;}
  users.push(newUser);claimantIdentityCache=null;
  localStorage.setItem(USERS_KEY,JSON.stringify(users));
  ['newUserName','newUserDescription','newUserEmail','newUserSector'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  const roleEl=document.getElementById('newUserRole');if(roleEl)roleEl.value='operational';
  refreshNewUserManagerFields();
  renderOperationalUsers();
}
function removeOperationalUser(i){
  if(!isAdmin())return;
  const users=getOperationalUsers(); if(!users[i])return;
  if(!confirm(`Remover ${users[i].name||users[i].email}?`))return;
  users.splice(i,1);saveOperationalUsers(users);
}
function getSentPdcas(){
  let data;
  try{data=JSON.parse(localStorage.getItem(SENT_PDCA_KEY)||'null');}catch(e){}
  if(!Array.isArray(data)){
    data=[
      {id:'PDCA-00031',ro:'RO-00131',responsavel:'Responsável Produção',email:'responsavel@empresa.com',unidade:'Matriz',setor:'Produção',cliente:'Cliente Alfa',envio:'01/09/2026 14:22',status:'Concluído',answers:{"p1": "Foi identificada variação dimensional na embalagem durante a inspeção final.", "p2": "Risco de reprovação do lote, retrabalho e atraso na expedição.", "p3": "Linha de produção 02, etapa de selagem.", "p4": "Ocorreu em 3 lotes no período de duas semanas.", "p5": "Método de ajuste não padronizado e variação no parâmetro da seladora.", "p6": "O ajuste dependia da experiência do operador e não havia faixa de referência visível no equipamento.", "p7": "Ausência de padrão documentado e visual para regulagem do parâmetro crítico.", "p8": "Padronizar a regulagem e reduzir a zero as ocorrências do mesmo desvio nos próximos 30 dias.", "p9": "30 dias.", "p10": "Concluída.", "p11": "Criar padrão visual de regulagem, revisar instrução de trabalho e treinar os operadores.", "p12": "Até 31/08/2026.", "p13": "Liderança da Produção.", "p14": "Risco de redução de produtividade durante o período inicial de adaptação.", "d1": "Sim. Todos os operadores dos turnos envolvidos participaram do treinamento.", "d2": "Sim. Foi realizada verificação prática após o treinamento.", "d3": "Concluído.", "d4": "Sim. Materiais, tempo de parada e suporte da manutenção foram disponibilizados.", "d5": "Checklist de regulagem por turno e registro de desvios na folha de processo.", "c1": "Sim. Não houve reincidência nos lotes acompanhados após a implantação.", "c2": "Sim. O processo permaneceu dentro do padrão durante o período de verificação.", "c3": "Não foram identificados efeitos colaterais relevantes.", "a1": "Sim. A instrução de trabalho foi revisada e o padrão visual foi fixado no equipamento.", "a2": "Auditoria semanal durante 30 dias e, depois, verificação mensal do cumprimento do padrão.", "a3": "Sim.", "a4": "Padronizações visuais próximas ao ponto de operação reduzem dependência de conhecimento informal."}},
      {id:'PDCA-00028',ro:'RO-00128',responsavel:'Usuário Logística',email:'logistica@empresa.com',unidade:'Filial',setor:'Logística',cliente:'Cliente Beta',envio:'28/08/2026 09:10',status:'Em análise',answers:{"p1": "Resposta registrada para demonstração.", "p2": "Resposta registrada para demonstração.", "p3": "Resposta registrada para demonstração.", "p4": "Resposta registrada para demonstração.", "p5": "Resposta registrada para demonstração.", "p6": "Resposta registrada para demonstração.", "p7": "Resposta registrada para demonstração.", "p8": "Resposta registrada para demonstração.", "p9": "Resposta registrada para demonstração.", "p10": "Resposta registrada para demonstração.", "p11": "Resposta registrada para demonstração.", "p12": "Resposta registrada para demonstração.", "p13": "Resposta registrada para demonstração.", "p14": "Resposta registrada para demonstração.", "d1": "Resposta registrada para demonstração.", "d2": "Resposta registrada para demonstração.", "d3": "Resposta registrada para demonstração.", "d4": "Resposta registrada para demonstração.", "d5": "Resposta registrada para demonstração.", "c1": "Resposta registrada para demonstração.", "c2": "Resposta registrada para demonstração.", "c3": "Resposta registrada para demonstração.", "a1": "Resposta registrada para demonstração.", "a2": "Resposta registrada para demonstração.", "a3": "Resposta registrada para demonstração.", "a4": "Resposta registrada para demonstração."}}
    ];
    localStorage.setItem(SENT_PDCA_KEY,JSON.stringify(data));
  }
  return data;
}


function pdcaStatusLabel(p){
  if(!p)return 'Pendente';
  if(p.apresentadoEm)return 'Apresentado';
  if(p.status==='Respondido' || p.status==='Enviado' || p.status==='Em análise')return 'Respondido';
  if(p.status==='Concluído' || p.status==='Concluído')return 'Concluído';
  return 'Pendente';
}
function pdcaStatusClass(p){
  const s=pdcaStatusLabel(p);
  return s==='Apresentado'?'presented':s==='Respondido'?'answered':s==='Concluído'?'done':'pending';
}
function presentPdca(id,presenterName){
  if(!nucleoFeatureRequire('pdca','present'))return;
  const sent=getSentPdca();
  const idx=sent.findIndex(p=>p.id===id);
  if(idx<0)return false;
  if(!canViewPdca(sent[idx]) && !isAdmin())return false;

  const session=getSession();
  sent[idx].status='Apresentado';
  sent[idx].apresentadoEm=new Date().toLocaleString('pt-BR');
  sent[idx].apresentadoPor=(presenterName||sent[idx].responsavel||'').trim();
  sent[idx].apresentacaoRegistradaPor=session?.name||currentEmail()||'Usuário';
  localStorage.setItem(SENT_PDCA_KEY,JSON.stringify(sent));
  window.currentReportPdca=sent[idx];
  return true;
}

function getCurrentPdcaRecord(){
  const roId=(window.currentRO && (window.currentRO.id||window.currentRO.codigo)) || window.currentRoId || '';
  const sent=getSentPdca();
  return sent.find(p=>p.ro===roId || p.roId===roId || p.id===window.currentPdcaId) || null;
}
function refreshPdcaPresentation(){
  const btn=document.getElementById('pdcaPresentBtn');
  const info=document.getElementById('pdcaPresentationInfo');
  if(!btn||!info)return;
  const p=getCurrentPdcaRecord();
  if(!p){
    btn.disabled=true;
    info.textContent='Envie o PDCA antes de registrar a apresentação.';
    return;
  }
  if(p.apresentadoEm){
    btn.disabled=true;
    btn.textContent='Apresentado';
    info.textContent='Apresentado em '+p.apresentadoEm+(p.apresentadoPor?' por '+p.apresentadoPor:'')+(p.apresentacaoRegistradaPor?' · registro feito por '+p.apresentacaoRegistradaPor:'')+'.';
  }else{
    btn.disabled=false;
    btn.textContent='Apresentar';
    info.textContent='PDCA respondido. Clique em Apresentar somente quando a apresentação acontecer.';
  }
}
function presentCurrentPdca(){
  if(!nucleoFeatureRequire('pdca','present'))return;
  const p=getCurrentPdcaRecord();
  if(!p){alert('Envie o PDCA antes de registrar a apresentação.');return}
  window.pendingPresentationPdcaId=p.id;

  const session=getSession();
  const presenter=document.getElementById('presentationPresenter');
  const recorder=document.getElementById('presentationRecorder');

  presenter.value=p.responsavel||'';
  recorder.value=session?.name||'';

  document.getElementById('presentationModal').classList.add('open');
  setTimeout(()=>presenter.focus(),0);
}
function closePresentationModal(){
  document.getElementById('presentationModal').classList.remove('open');
  window.pendingPresentationPdcaId=null;
}
function confirmPresentation(){
  const id=window.pendingPresentationPdcaId;
  const presenter=(document.getElementById('presentationPresenter').value||'').trim();
  if(!id)return;
  if(!presenter){alert('Informe quem está apresentando.');return}

  if(presentPdca(id,presenter)){
    closePresentationModal();
    refreshPdcaPresentation();
    refreshRoSummary();
    refreshPdcaSidebarBadge();
    alert('Apresentação registrada.');
  }
}

function normalizeAnswer(v){
  return String(v||'').trim().toLowerCase();
}
const SECTOR_ALIAS_KEY='nucleo-sector-aliases-v1';

function sectorCompareKey(v){
  return String(v||'')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .toLowerCase()
    // Indicadores comparam somente letras e números.
    // Assim: "2º turno", "2° Turno", "2o turno" e "2 turno" têm a mesma chave.
    .replace(/[º°ª]/g,'')
    .replace(/[^a-z0-9]+/g,'')
    .trim();
}

function sectorStatusLike(v){
  const k=sectorCompareKey(v);
  return [
    'cancelada','cancelado','em analise','em análise','aguardando triagem',
    'aguardando resposta','somente para registro','apenas registro',
    'pdca enviado','concluido','concluida','respondida','apresentada',
    'pendente','nao enviada','não enviada'
  ].map(sectorCompareKey).includes(k);
}

function getSectorAliases(){
  let aliases={};
  try{aliases=JSON.parse(localStorage.getItem(SECTOR_ALIAS_KEY)||'{}')||{};}catch(e){aliases={};}
  const cfg=getAdminConfig();
  if(cfg.sectorAliases && typeof cfg.sectorAliases==='object'){
    aliases={...cfg.sectorAliases,...aliases};
  }
  return aliases;
}

function saveSectorAliases(aliases){
  localStorage.setItem(SECTOR_ALIAS_KEY,JSON.stringify(aliases||{}));
  const cfg=getAdminConfig();
  cfg.sectorAliases=aliases||{};
  cfg.__savedAt=new Date().toLocaleString('pt-BR');
  localStorage.setItem(ADMIN_CONFIG_KEY,JSON.stringify(cfg));
  portalBackendSave('config','main',cfg);
}

function canonicalSectorName(value){
  const raw=String(value||'').trim();
  if(!raw || sectorStatusLike(raw))return '';

  const key=sectorCompareKey(raw);
  const aliases=getSectorAliases();
  if(aliases[key])return String(aliases[key]).trim();

  // Prioridade 1: nome oficial cadastrado no ADM.
  const configured=typeof getConfiguredSectors==='function' ? getConfiguredSectors() : [];
  const official=(Array.isArray(configured)?configured:[]).find(s=>sectorCompareKey(s)===key);
  if(official)return String(official).trim();

  // Prioridade 2: padronização gráfica automática.
  // Não altera a planilha; é somente o nome exibido/agrupado pelo NÚCLEO.
  let display=raw
    .replace(/(\d)\s*[º°]\s*/g,'$1º ')
    .replace(/\s+/g,' ')
    .trim();

  return display;
}

function sameCanonicalSector(a,b){
  const ca=canonicalSectorName(a), cb=canonicalSectorName(b);
  return !!ca && !!cb && sectorCompareKey(ca)===sectorCompareKey(cb);
}

function renderSectorAliases(){
  const box=document.getElementById('sectorAliasList');
  if(!box)return;
  const aliases=getSectorAliases();
  const rows=Object.entries(aliases).sort((a,b)=>String(a[1]).localeCompare(String(b[1]),'pt-BR'));
  box.innerHTML=rows.length?rows.map(([key,to])=>`
    <div class="admin-user-row">
      <div class="admin-user-info"><div><div class="admin-email">${escapeHtml(key)}</div><div class="small">→ ${escapeHtml(to)}</div></div></div>
      <button class="remove-admin" type="button" onclick="removeSectorAlias('${escapeHtml(key)}')">Remover</button>
    </div>`).join(''):'<div class="small">Nenhuma equivalência manual cadastrada.</div>';
}

function addSectorAlias(){
  const from=String(document.getElementById('sectorAliasFrom')?.value||'').trim();
  const to=String(document.getElementById('sectorAliasTo')?.value||'').trim();
  if(!from||!to){alert('Informe os dois nomes de setor.');return}
  if(sectorStatusLike(to)){alert('O nome de destino parece ser um status, não um setor.');return}
  const aliases=getSectorAliases();
  aliases[sectorCompareKey(from)]=to;
  saveSectorAliases(aliases);
  document.getElementById('sectorAliasFrom').value='';
  document.getElementById('sectorAliasTo').value='';
  renderSectorAliases();
  try{renderSgqIndicators()}catch(e){}
}

function removeSectorAlias(key){
  const aliases=getSectorAliases();
  delete aliases[key];
  saveSectorAliases(aliases);
  renderSectorAliases();
  try{renderSgqIndicators()}catch(e){}
}

function suggestSectorAliases(){
  const values=new Map();
  getAllRoRecords().forEach(r=>{
    const raw=String(r.setorResponsavelPlanilha||r.setor||'').trim();
    if(!raw||sectorStatusLike(raw))return;
    const key=sectorCompareKey(raw);
    if(!values.has(key))values.set(key,new Set());
    values.get(key).add(raw);
  });
  const groups=[...values.entries()].filter(([,set])=>set.size>1);
  const box=document.getElementById('sectorAliasSuggestions');
  if(!box)return;
  box.innerHTML=groups.length
    ? '<b>Variações gráficas encontradas:</b><br>'+groups.map(([,set])=>[...set].map(escapeHtml).join(' = ')).join('<br>')
    : 'Nenhuma variação gráfica duplicada encontrada.';
}

function answerLooksYes(v){
  const s=normalizeAnswer(v);
  return /^(sim|s|yes|conclu[ií]d[oa]|conclu[ií]da|feito|executado|atingid[oa]|ok|finalizado|finalizada)/.test(s)
      || s.includes('conclu') || s.includes('executad') || s.includes('atingid') || s.includes('eliminad');
}
function parseBrDate(v){
  const s=String(v||'').trim();
  const m=s.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
  if(!m)return null;
  let y=+m[3]; if(y<100)y+=2000;
  const d=new Date(y,+m[2]-1,+m[1],23,59,59);
  return isNaN(d.getTime())?null:d;
}
function inferActionStatus(p){
  const a=p?.answers||{};
  if(p?.acaoConferidaEm){
    return {code:'done',label:'Concluída',reason:'Ação conferida.'};
  }

  const signals=[];
  if(getRuleYes('ruleUseC1'))signals.push(answerLooksYes(a.c1));
  if(getRuleYes('ruleUseC2'))signals.push(answerLooksYes(a.c2));
  if(getRuleYes('ruleUseA1'))signals.push(answerLooksYes(a.a1));
  if(getRuleYes('ruleUseA3'))signals.push(answerLooksYes(a.a3));
  const positives=signals.filter(Boolean).length;
  const threshold=Math.min(signals.length||1,getRuleNumber('ruleActionCompletionThreshold',3,1,4));

  if(positives>=threshold){
    if(!getRuleYes('ruleActionRequireSgq')){
      return {code:'done',label:'Concluída',reason:'Os critérios configurados indicam conclusão automática.'};
    }
    return {code:'review',label:'Possível conclusão',reason:'As respostas indicam possível conclusão. Aguarda conferência do SGQ.'};
  }

  const deadline=parseBrDate(a.p12);
  const grace=getRuleNumber('ruleActionOverdueGraceDays',0,0,30);
  if(deadline){
    const limit=new Date(deadline.getFullYear(),deadline.getMonth(),deadline.getDate()+grace+1);
    const today=new Date();
    today.setHours(0,0,0,0);
    if(today>=limit)return {code:'overdue',label:'Atrasada',reason:grace?`Prazo vencido além da tolerância de ${grace} dia(s).`:'O prazo da ação já venceu.'};
  }

  return {code:'pending',label:'Pendente',reason:'Ainda não há evidências suficientes de conclusão.'};
}
function userSectorPendingActions(){
  const sector=currentSector();
  if(!sector)return [];
  const out=[];
  getAllSentPdcas().forEach(p=>{
    allPdcaActionsForRecord(p).forEach(a=>{
      const assigned=parseResponsibleSectors(a.responsibleSectors?.length?a.responsibleSectors:a.owner);
      if(!assigned.some(s=>normalizeAnswer(s)===normalizeAnswer(sector)||(isManager()&&managesSector(s))))return;
      const pseudo={...p,answers:{...(p.answers||{}),p11:a.action,p12:a.deadline,p13:a.owner},acaoConferidaEm:a.completedAt||a.acaoConferidaEm};
      const status=inferActionStatus(pseudo);
      if(status.code!=='done')out.push({p,actionRecord:a,status});
    });
  });
  return out;
}
function refreshUserPendingActionAlert(){
  const box=document.getElementById('userPendingActionAlert');
  if(!box)return;
  if(isAdmin()){box.classList.add('hidden');return}

  const items=userSectorPendingActions();
  if(!items.length){box.classList.add('hidden');return}

  const overdue=items.filter(x=>x.status.code==='overdue').length;
  box.classList.remove('hidden');
  document.getElementById('userPendingActionTitle').textContent=
    overdue ? `Você possui ${overdue} ação${overdue===1?'':'ões'} atrasada${overdue===1?'':'s'}`
            : `Você possui ${items.length} ação${items.length===1?'':'ões'} pendente${items.length===1?'':'s'}`;
  document.getElementById('userPendingActionText').textContent=
    'O aviso permanecerá visível enquanto houver ação sem conclusão confirmada.';
}
function markActionCompleted(pdcaId){
  if(!nucleoFeatureRequire('pdca','reviewActions'))return;
  const sent=getSentPdca();
  const idx=sent.findIndex(p=>p.id===pdcaId);
  if(idx<0)return;
  const session=getSession();
  sent[idx].acaoConferidaEm=new Date().toLocaleString('pt-BR');
  sent[idx].acaoConferidaPor=session?.name||currentEmail()||'Usuário';
  localStorage.setItem(SENT_PDCA_KEY,JSON.stringify(sent));
  portalUpdateRoSheet(sent[idx].ro||'',{
    status:'Concluído',
    resultado:'AÇÃO CONFERIDA PELO SGQ'
  });
  createNotification({
    type:'action',
    audience:'complainant',
    ro:sent[idx].ro||'',
    title:'Ação finalizada',
    message:'O SGQ confirmou a conclusão da ação referente à '+(sent[idx].ro||'R.O.')+'.'
  });
  createNotification({
    type:'action',
    audience:'sector',
    sector:sent[idx].setor||'',
    ro:sent[idx].ro||'',
    title:'Conclusão da ação confirmada',
    message:'O SGQ confirmou a conclusão da ação referente à '+(sent[idx].ro||'R.O.')+'.'
  });
  refreshUserPendingActionAlert();
  refreshRoSummary();
  if(isAdmin())showPendingActions();
}

function actionDeadlineInfo(p){
  const a=p?.answers||{};
  const d=parseBrDate(a.p12);
  if(!d)return {text:'Sem prazo',cls:'',days:null};
  const now=new Date();
  const today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  const end=new Date(d.getFullYear(),d.getMonth(),d.getDate());
  const diff=Math.ceil((end-today)/86400000);
  if(diff<0)return {text:`Atrasada há ${Math.abs(diff)} dia${Math.abs(diff)===1?'':'s'}`,cls:'overdue',days:diff};
  if(diff===0)return {text:'Vence hoje',cls:'soon',days:0};
  if(diff<=3)return {text:`Vence em ${diff} dia${diff===1?'':'s'}`,cls:'soon',days:diff};
  return {text:`Vence em ${diff} dias`,cls:'ok',days:diff};
}
function actionDashboardItems(){
  const sent=getSentPdca();const admin=isAdmin();const items=[];
  sent.forEach(p=>{
    allPdcaActionsForRecord(p).forEach(a=>{
      const assigned=parseResponsibleSectors(a.responsibleSectors?.length?a.responsibleSectors:a.owner);
      const visible=admin||assigned.some(s=>normalizeAnswer(s)===normalizeAnswer(currentSector())||(isManager()&&managesSector(s)));
      if(!visible)return;
      const pseudo={...p,answers:{...(p.answers||{}),p11:a.action,p12:a.deadline,p13:a.owner},acaoConferidaEm:a.completedAt||a.acaoConferidaEm};
      items.push({p,actionRecord:a,ro:p.ro||'-',setor:p.setor||'-',acao:a.action||'',responsavel:a.owner||p.responsavel||'-',responsibleSectors:assigned,prazo:a.deadline||'-',status:inferActionStatus(pseudo),deadline:actionDeadlineInfo(pseudo)});
    });
  });
  return items.filter(x=>x.acao);
}

async function registerActionEvidence(pdcaId,actionId){
  if(!nucleoFeatureRequire('pdca','completeAction'))return;
  const p=getAllSentPdcas().find(x=>String(x.id)===String(pdcaId));if(!p)return;
  const actions=allPdcaActionsForRecord(p);const a=actions.find(x=>String(x.id)===String(actionId))||actions[0];if(!a)return;
  const note=prompt('Descreva a evidência de conclusão desta ação:',a.evidenceNote||'')||'';if(!note.trim())return;
  a.evidenceNote=note.trim();a.completedAt=new Date().toISOString();a.completedBy=getSession()?.name||'Usuário';
  if(String(a.id).endsWith('-A1')){p.mainActionEvidenceNote=a.evidenceNote;p.mainActionCompletedAt=a.completedAt}
  else{const ai=(p.actions||[]).findIndex(x=>String(x.id)===String(a.id));if(ai>=0)p.actions[ai]={...p.actions[ai],evidenceNote:a.evidenceNote,completedAt:a.completedAt,completedBy:a.completedBy}}
  const sent=getSentPdca();const pi=sent.findIndex(x=>String(x.id)===String(p.id));if(pi>=0)sent[pi]=p;
  localStorage.setItem(SENT_PDCA_KEY,JSON.stringify(sent));try{localStorage.setItem(SENT_PDCA_KEY,JSON.stringify(sent))}catch(e){}
  portalBackendSave('pdca_sent',p.id,p);portalBackendSave('pdca_actions',a.id,a);
  portalUpdateRoSheet(p.ro||'',{
    acaoPrevista:a.action||'',
    prazoConclusao:a.deadline||'',
    status:'Ação informada como concluída',
    resultado:a.evidenceNote||'Evidência registrada no Portal SGQ'
  });
  createNotification({type:'action',audience:'admin',ro:p.ro||'',title:'Evidência de conclusão registrada',message:(a.owner||p.setor||'Responsável')+' registrou evidência para a ação da '+(p.ro||'R.O.')+'.'});
  alert('Evidência registrada. O SGQ poderá conferir a conclusão.');renderActionsDashboard();
}
function populateActionsSectorFilter(){
  const wrap=document.getElementById('actionsSectorFilterWrap');
  const sel=document.getElementById('actionsSectorFilter');
  if(!wrap||!sel)return;
  if(!isAdmin()){
    wrap.style.display='none';
    return;
  }
  wrap.style.display='';
  const sectors=[...new Set(getSentPdca().flatMap(p=>allPdcaActionsForRecord(p).flatMap(a=>parseResponsibleSectors(a.responsibleSectors?.length?a.responsibleSectors:a.owner))))].filter(Boolean).sort();
  sel.innerHTML='<option value="all">Todos os setores</option>'+sectors.map(s=>`<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
}
function renderActionsDashboard(){
  const items=actionDashboardItems();
  const statusFilter=document.getElementById('actionsStatusFilter')?.value||'all';
  const search=normalizeAnswer(document.getElementById('actionsSearch')?.value||'');
  const sectorFilter=document.getElementById('actionsSectorFilter')?.value||'all';

  const counts={pending:0,overdue:0,review:0,done:0};
  items.forEach(x=>{ if(counts[x.status.code]!==undefined) counts[x.status.code]++; });
  document.getElementById('sumPending').textContent=counts.pending;
  document.getElementById('sumOverdue').textContent=counts.overdue;
  document.getElementById('sumReview').textContent=counts.review;
  document.getElementById('sumDone').textContent=counts.done;

  let filtered=items.filter(x=>{
    if(statusFilter!=='all' && x.status.code!==statusFilter)return false;
    if(isAdmin() && sectorFilter!=='all' && !x.responsibleSectors.some(s=>normalizeAnswer(s)===normalizeAnswer(sectorFilter)))return false;
    if(search){
      const hay=normalizeAnswer([x.ro,x.setor,x.acao,x.responsavel].join(' '));
      if(!hay.includes(search))return false;
    }
    return true;
  });

  filtered.sort((a,b)=>{
    const da=a.deadline.days, db=b.deadline.days;
    if(da===null && db===null)return 0;
    if(da===null)return 1;
    if(db===null)return -1;
    return da-db;
  });

  const body=document.getElementById('actionsDashboardBody');
  body.innerHTML=filtered.length?filtered.map(x=>`<tr>
    <td><b>${escapeHtml(x.ro)}</b></td>
    <td>${escapeHtml(x.setor)}</td>
    <td>${escapeHtml(x.acao)}</td>
    <td>${escapeHtml(x.responsavel)}</td>
    <td>${escapeHtml(x.prazo)}</td>
    <td><span class="deadline-text ${x.deadline.cls}">${escapeHtml(x.deadline.text)}</span></td>
    <td><span class="action-pill ${x.status.code}">${escapeHtml(x.status.label)}</span></td>
    <td style="white-space:nowrap">
      ${canContestActionSector(x.p,x.actionRecord)?(()=>{
        const c=getActionSectorContest(x.actionRecord.id,currentSector());
        return c?.status==='pending'
          ? '<span class="status-badge pending">Contestação em análise</span>'
          : c?.status==='accepted'
            ? '<span class="status-badge answered">Retirado da ação</span>'
            : `<button class="btn secondary" type="button" onclick="contestActionSector('${escapeHtml(x.p.id)}','${escapeHtml(x.actionRecord.id)}')">Contestar participação</button>`;
      })():isAdmin()?'<span class="small">ADM</span>':'<span class="small">Setor responsável</span>'}
    </td>
  </tr>`).join(''):`<tr><td colspan="8" style="text-align:center;color:#667085;padding:24px">Nenhuma ação encontrada.</td></tr>`;
}
function showActionsDashboard(){
  if(!nucleoFeatureRequire('pdca','actions'))return;
  view('actionsDashboardView');
  setNav('actions');

  try{
    populateActionsSectorFilter();
    var scope=document.getElementById('actionsScopeLabel');
    if(scope){
      scope.textContent=isAdmin()?'Todos os setores':'Setor: '+(currentSector()||'-');
    }
    renderActionsDashboard();
  }catch(err){
    console.error('Erro ao carregar Ações:',err);
    var body=document.getElementById('actionsDashboardBody');
    if(body){
      body.innerHTML='<tr><td colspan="7" style="padding:24px;text-align:center;color:#667085">Não foi possível carregar as ações nesta visualização.</td></tr>';
    }
  }
}



function getRoById(id){
  const wanted=String(id??'').trim();
  return getAllRoRecords().find(r=>String(r.id||r.codigo||r.numero||'').trim()===wanted) || null;
}
function roPdfAllowed(ro){
  if(!ro)return false;
  return isAdmin() || canViewRO(ro) || wasRoSubmittedByCurrentUser(ro);
}
function createRoPdfBlob(ro){
  const raw=ro.raw||{};
  const title='RELATO DE OCORRÊNCIA';

  const info=[
    ['R.O.', ro.numero||ro.id||ro.codigo||'-'],
    ['Data', ro.data||ro.dataSolicitacao||'-'],
    ['Unidade', ro.unidade||'-'],
    ['Cliente', firstValue(raw,['Nome do cliente:','Nome do cliente','Cliente','Cliente / origem'])||ro.cliente||'Não informado'],
    ['Tipo de ocorrência', ro.tipoRO||ro.assunto||'-'],
    ['Setor identificado', ro.setorIdentificado||'-'],
    ['Setor causa/responsável', ro.setor||'-'],
    ['Status', ro.status||'-'],
    ['Descrição', ro.descricao||'-']
  ];

  const extras=[
    ['Matrícula', firstValue(raw,['Matrícula','Matricula'])],
    ['Responsável pelo registro', firstValue(raw,['Nome e Sobrenome (responsável pelo registro deste formulário):','Nome e Sobrenome (responsável pelo registro deste formulário)'])],
    ['Número do pedido', firstValue(raw,['Número do pedido:','Número do pedido'])],
    ['Código do item', firstValue(raw,['Código do item:','Código do item'])],
    ['Ordem de produção', firstValue(raw,['Ordem de produção (código de barras):','Ordem de produção (código de barras)'])],
    ['Quantidade de peças com desvio', firstValue(raw,['Quantidade de peças com desvio:','Quantidade de peças com desvio'])],
    ['Peso do material descartado/reaproveitado', firstValue(raw,['Peso do material descartado e/ou reaproveitado:','Peso do material descartado e/ou reaproveitado'])],
    ['Liberado pelo setor da qualidade?', firstValue(raw,['Liberado pelo setor de qualidade?','Liberado pelo setor de qualidade'])],
    ['Registro de quem liberou', firstValue(raw,['Registre o nome de quem liberou:','Registre o nome de quem liberou'])],
    ['Ação preventiva', firstValue(raw,['Ação preventiva'])],
    ['Prazo conclusão ação', firstValue(raw,['Prazo conclusão ação'])],
    ['Status planilha', firstValue(raw,['Status'])]
  ].filter(x=>String(x[1]??'').trim()!=='');

  const all=info.concat(extras);

  function clean(s){
    return String(s??'')
      .replace(/[^\x20-\x7EÀ-ÿ]/g,' ')
      .replace(/\s+/g,' ')
      .trim();
  }
  function escPdf(s){
    return clean(s).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');
  }
  function wrap(text,max=82){
    const words=clean(text).split(' ');
    const lines=[]; let line='';
    words.forEach(w=>{
      const next=line ? line+' '+w : w;
      if(next.length>max && line){ lines.push(line); line=w; }
      else line=next;
    });
    if(line) lines.push(line);
    return lines.length?lines:['-'];
  }

  const lines=[];
  all.forEach(([label,val])=>{
    const wrapped=wrap(label+': '+(val||'-'));
    wrapped.forEach((x,i)=>lines.push(i===0?x:'   '+x));
  });

  const pageHeight=842, top=790, bottom=55, lineH=15;
  const perPage=Math.floor((top-bottom)/lineH);
  const chunks=[];
  for(let i=0;i<lines.length;i+=perPage-3) chunks.push(lines.slice(i,i+perPage-3));

  const objs=[];
  const pageRefs=[];
  let objNum=3;

  chunks.forEach((chunk,pageIndex)=>{
    const pageObj=objNum++;
    const contentObj=objNum++;
    pageRefs.push(pageObj+' 0 R');

    let content='BT\n/F1 15 Tf\n50 790 Td\n('+escPdf(title)+') Tj\n/F1 9 Tf\n0 -24 Td\n';
    chunk.forEach((line,i)=>{
      if(i>0) content+='0 -'+lineH+' Td\n';
      content+='('+escPdf(line)+') Tj\n';
    });
    content+='ET';

    objs[pageObj]=`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 1 0 R >> >> /Contents ${contentObj} 0 R >>`;
    objs[contentObj]=`<< /Length ${content.length} >>\nstream\n${content}\nendstream`;
  });

  // font is object 1, pages object 2, catalog after pages
  objs[1]='<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
  objs[2]=`<< /Type /Pages /Kids [${pageRefs.join(' ')}] /Count ${pageRefs.length} >>`;
  const catalogObj=objNum++;
  objs[catalogObj]='<< /Type /Catalog /Pages 2 0 R >>';

  let pdf='%PDF-1.4\n', offsets=[0];
  for(let i=1;i<objs.length;i++){
    if(!objs[i]) continue;
    offsets[i]=pdf.length;
    pdf+=i+' 0 obj\n'+objs[i]+'\nendobj\n';
  }
  const xref=pdf.length;
  pdf+='xref\n0 '+objs.length+'\n0000000000 65535 f \n';
  for(let i=1;i<objs.length;i++){
    pdf+=(offsets[i]!==undefined?String(offsets[i]).padStart(10,'0'):'0000000000')+' 00000 n \n';
  }
  pdf+='trailer\n<< /Size '+objs.length+' /Root '+catalogObj+' 0 R >>\nstartxref\n'+xref+'\n%%EOF';

  // PDF literal strings use WinAnsi bytes, not UTF-8. Offsets and stream lengths remain byte-exact.
  return new Blob([Uint8Array.from(pdf,c=>c.charCodeAt(0))],{type:'application/pdf'});
}

function openExternalRoPdf(url){
  const modal=document.getElementById('pdfPreviewModal');
  const frame=document.getElementById('pdfPreviewFrame');
  const head=modal?.querySelector('.pdf-preview-head');
  if(!modal || !frame || !head){
    window.open(url,'_blank','noopener');
    return;
  }

  // Direct embedding of Drive links is often blocked. Present a safe clickable link instead.
  currentPdfBlob=null;
  if(currentPdfUrl){try{URL.revokeObjectURL(currentPdfUrl)}catch(e){} currentPdfUrl=null;}
  frame.src='about:blank';

  let link=document.getElementById('externalRoPdfLink');
  if(!link){
    link=document.createElement('a');
    link.id='externalRoPdfLink';
    link.className='btn primary';
    link.target='_blank';
    link.rel='noopener noreferrer';
    link.textContent='Abrir arquivo da R.O. no Drive';
    head.querySelector('.pdf-preview-actions')?.prepend(link);
  }
  link.href=url;
  link.style.display='';
  modal.classList.add('open');
}


function openRoReportHtml(id){
  const wanted=String(id??'').trim();
  const ro=getAllRoRecords().find(r=>String(r.numero||r.id||r.codigo||'').trim()===wanted);
  if(!ro){alert('Não encontrei esta R.O.');return;}

  const raw=ro.raw||{};
  const rows=[
    ['R.O.',ro.numero||'-'],
    ['Data',ro.data||'-'],
    ['Unidade',ro.unidade||'-'],
    ['Cliente',ro.cliente||'-'],
    ['Tipo de ocorrência',ro.tipoRO||ro.assunto||'-'],
    ['Setor identificado',ro.setorIdentificado||'-'],
    ['Setor causa/responsável',ro.setor||'-'],
    ['Status',ro.status||'-'],
    ['Descrição',ro.descricao||'-']
  ];

  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const page=`<!doctype html><html><head><meta charset="utf-8"><title>${esc(ro.numero||'R.O.')}</title>
  <style>
  body{font-family:Arial,sans-serif;margin:32px;color:#111}
  h1{font-size:20px;margin:0 0 20px}
  table{border-collapse:collapse;width:100%;font-size:13px}
  td{border:1px solid #bbb;padding:8px;vertical-align:top}
  td:first-child{font-weight:700;width:210px;background:#f5f5f5}
  .print{margin-bottom:18px}
  @media print{.print{display:none}}
  </style>
<style>
#pdcaView .question textarea{min-height:120px;resize:vertical;line-height:1.45}
#pdcaView .stage-tab small{display:block;font-size:10px;margin-top:2px;opacity:.75}
#pdcaView .stage-tabs{position:sticky;top:0;z-index:4;background:#fff;padding:8px 0}
#contestationsView td{vertical-align:top}
@media(max-width:800px){#pdcaStageOverview{grid-template-columns:1fr 1fr!important}}
</style>

<style>
#complainantReturnPanel .value{font-weight:600}
#mySubmittedRosView td{vertical-align:top}
</style>


</head><body>
  <button class="print" onclick="window.print()">Imprimir / Salvar como PDF</button>
  <h1>RELATO DE OCORRÊNCIA</h1>
  <table>${rows.map(([k,v])=>`<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}</table>
  


</body></html>`;

  const blob=new Blob([page],{type:'text/html;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const w=window.open(url,'_blank');
  if(!w){
    const a=document.createElement('a');
    a.href=url;
    a.download=(ro.numero||'RO')+'_relatorio.html';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  setTimeout(()=>{try{URL.revokeObjectURL(url)}catch(e){}},60000);
}


let currentReportRoId='';

function roReportEsc(s){
  return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function openRoReport(id){
  const wanted=String(id??'').trim();
  currentReportRoId=wanted;
  currentReportRoId=wanted;
  const ro=getAllRoRecords().find(r=>String(r.numero||r.id||r.codigo||'').trim()===wanted);
  if(!ro){
    alert('Não encontrei os dados desta R.O.');
    return;
  }

  const raw=ro.raw||{};
  const known=[
    ['R.O.',ro.numero||ro.id||ro.codigo||'-'],
    ['Data',ro.data||'-'],
    ['Unidade',ro.unidade||'-'],
    ['Cliente',ro.cliente||'-'],
    ['Tipo de ocorrência',ro.tipoRO||ro.assunto||'-'],
    ['Setor onde foi identificado',ro.setorIdentificado||'-'],
    ['Setor causa / responsável',ro.setor||'-'],
    ['Status',ro.status||'-'],
    ['Descrição',ro.descricao||'-']
  ];

  const extraLabels=[
    'Matrícula','Matricula',
    'Nome e Sobrenome (responsável pelo registro deste formulário):',
    'Número do pedido:','Código do item:','Ordem de produção (código de barras):','Nota Fiscal','Pessoa',
    'Quantidade de peças com desvio:','Peso do material descartado e/ou reaproveitado:',
    'Liberado pelo setor de qualidade?','Registre o nome de quem liberou:',
    'Ação preventiva','Prazo conclusão ação','Data Envio',
    'PDCA ENVIADO PARA O RECLAMANTE (DATA)'
  ];

  const seen=new Set();
  const extras=[];
  extraLabels.forEach(label=>{
    if(seen.has(label)) return;
    seen.add(label);
    const val=raw[label];
    if(val!==undefined && val!==null && String(val).trim()!==''){
      extras.push([label.replace(/:$/,''),val]);
    }
  });

  const evidence=String(firstValue(raw,[
    'Insira imagens e/ou vídeos relacionado a ocorrência relatada.',
    'Insira imagens e/ou vídeos relacionado a ocorrência relatada'
  ])||'').trim();

  let evidenceHtml='';
  if(evidence){
    const urls=evidence.match(/https?:\/\/[^\s,]+/g)||[];
    if(urls.length){
      evidenceHtml='<div class="ro-report-section">Evidências anexadas</div><div class="ro-evidence-list">'+
        urls.map((u,i)=>`<div><a href="${roReportEsc(u)}" target="_blank" rel="noopener noreferrer">Abrir evidência ${i+1}</a></div>`).join('')+
        '</div>';
    }
  }

  const rows=known.concat(extras);
  const body=document.getElementById('roReportBody');
  body.innerHTML=
    `<h1 class="ro-report-title">RELATO DE OCORRÊNCIA</h1>`+
    `<table class="ro-report-table">${rows.map(([k,v])=>`<tr><td>${roReportEsc(k)}</td><td>${roReportEsc(v||'-')}</td></tr>`).join('')}</table>`+
    evidenceHtml;

  const overlay=document.getElementById('roReportOverlay');
  overlay.classList.add('open');
  document.body.style.overflow='hidden';
}



function updateRoSyncPeriodUi(){
  const custom=(document.getElementById('roSyncPeriod')?.value||'all')==='custom';
  document.getElementById('roSyncDateFromWrap')?.classList.toggle('hidden',!custom);
}

function roSyncPeriodParams(settings){
  const s=settings||getSavedIntegrationSettings();
  const period=String(s.roSyncPeriod||'all');
  if(period==='all')return {};

  let from='',to='';
  const today=new Date();
  const localIso=d=>[
    d.getFullYear(),
    String(d.getMonth()+1).padStart(2,'0'),
    String(d.getDate()).padStart(2,'0')
  ].join('-');

  if(period==='custom'){
    from=String(s.roSyncDateFrom||'').trim();
    to=localIso(today);
  }else{
    const days=Math.max(1,Number(period)||0);
    const start=new Date(today.getFullYear(),today.getMonth(),today.getDate());
    start.setDate(start.getDate()-days+1);
    from=localIso(start);
    to=localIso(today);
  }

  const out={periodo:period};
  if(from)out.inicio=from;
  if(to)out.fim=to;
  return out;
}

function appendIntegrationParams(baseUrl,settings,includeCacheBust=false){
  const s=settings||getSavedIntegrationSettings();
  const params=new URLSearchParams();
  if(s.apiKey)params.set('chave',s.apiKey);
  const periodParams=roSyncPeriodParams(s);
  Object.entries(periodParams).forEach(([k,v])=>{if(v)params.set(k,v)});
  if(includeCacheBust)params.set('_',Date.now());

  const query=params.toString();
  if(!query)return baseUrl;
  return baseUrl+(baseUrl.includes('?')?'&':'?')+query;
}

function integrationPeriodLabel(settings){
  const s=settings||getSavedIntegrationSettings();
  const p=String(s.roSyncPeriod||'all');
  if(p==='all')return 'todo o período';
  if(p==='custom'){
    const from=s.roSyncDateFrom||'início';
    return 'desde '+from;
  }
  return 'últimos '+p+' dias';
}

function getSavedIntegrationSettings(){
  let dedicated={}, legacy={}, admin={};
  try{dedicated=JSON.parse(localStorage.getItem(INTEGRATION_PERSIST_KEY)||'{}')||{};}catch(e){dedicated={};}
  try{legacy=JSON.parse(localStorage.getItem('ro-sync-settings')||'{}')||{};}catch(e){legacy={};}
  try{admin=JSON.parse(localStorage.getItem(ADMIN_CONFIG_KEY)||'{}')||{};}catch(e){admin={};}

  const sync={
    apiUrl:String(NUCLEO_DEFAULT_API_URL||dedicated.apiUrl||legacy.apiUrl||admin.apiUrl||'').trim(),
    apiKey:String(dedicated.apiKey||legacy.apiKey||admin.apiKey||'').trim(),
    autoSync:String(dedicated.autoSync??legacy.autoSync??admin.autoSync??'0'),
    roSyncPeriod:String(dedicated.roSyncPeriod??legacy.roSyncPeriod??admin.roSyncPeriod??'all'),
    roSyncDateFrom:String(dedicated.roSyncDateFrom??legacy.roSyncDateFrom??admin.roSyncDateFrom??''),
    roSyncDateTo:String(dedicated.roSyncDateTo??legacy.roSyncDateTo??admin.roSyncDateTo??''),
    savedAt:dedicated.savedAt||legacy.savedAt||admin.__savedAt||''
  };

  // Migra configurações antigas para o armazenamento dedicado.
  if(sync.apiUrl || sync.apiKey || sync.autoSync!=='0'){
    try{localStorage.setItem(INTEGRATION_PERSIST_KEY,JSON.stringify(sync));}catch(e){}
  }
  return sync;
}

let roPdfDownloadInProgress=false;
let roPdfRequestToken=0;

function setRoPdfButtonState(loading){
  document.querySelectorAll('[onclick*="downloadCompleteRoPdf"]').forEach(btn=>{
    if(loading){
      if(!btn.dataset.originalText)btn.dataset.originalText=btn.textContent;
      btn.textContent='Gerando PDF...';
      btn.disabled=true;
    }else{
      btn.textContent=btn.dataset.originalText||'Gerar PDF completo';
      btn.disabled=false;
    }
  });
}

function base64PdfToDownload(base64,filename){
  const bin=atob(base64);
  const bytes=new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);

  const blob=new Blob([bytes],{type:'application/pdf'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download=filename||'RO.pdf';
  a.style.display='none';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),30000);
}

window.addEventListener('message',function(event){
  const data=event.data||{};
  if(data.type!=='RO_PDF_READY')return;

  try{
    if(!data.base64)throw new Error('O PDF retornou vazio.');
    base64PdfToDownload(data.base64,data.filename);
  }catch(err){
    alert('Não foi possível baixar o PDF: '+(err.message||err));
  }finally{
    roPdfDownloadInProgress=false;
    roPdfRequestToken++;
    setRoPdfButtonState(false);
    const frame=document.getElementById('roPdfBridgeFrame');
    if(frame)frame.removeAttribute('src');
  }
});

function downloadCompleteRoPdf(id){
  const wanted=String(id||currentReportRoId||'').trim();
  if(!wanted){
    alert('Não foi possível identificar a R.O.');
    return;
  }

  if(roPdfDownloadInProgress)return;

  const sync=getSavedIntegrationSettings();
  if(!sync.apiUrl){
    alert('Configure primeiro a URL do Apps Script em Administração > Integração e sincronização.');
    return;
  }

  const frame=document.getElementById('roPdfBridgeFrame');
  if(!frame){
    alert('Não encontrei o gerador de PDF do sistema.');
    return;
  }

  roPdfDownloadInProgress=true;
  const requestToken=++roPdfRequestToken;
  setRoPdfButtonState(true);

  const sep=sync.apiUrl.includes('?')?'&':'?';
  const scopedRo=getAllRoRecords().find(r=>String(r.numero||r.id||r.codigo)===String(wanted));if(getSession()?.role==='quality'&&(!scopedRo||!qualityRecordAllowed(scopedRo))){alert('Esta R.O. não pertence à SETA ES / Unidade Linhares.');return;}
  const url=sync.apiUrl+sep+'acao=pdf&modo=embed&ro='+encodeURIComponent(wanted)+'&token='+encodeURIComponent(getSession()?.authToken||'');

  // O Apps Script abre somente dentro deste iframe invisível.
  // Quando terminar, ele devolve o PDF via postMessage e o sistema baixa o arquivo.
  frame.src=url;

  // Se o iframe não conseguir devolver o PDF por postMessage (por exemplo,
  // por bloqueio do navegador/origem), não tratamos isso como falha do PDF.
  // Após 60 s, oferecemos a rota direta do Apps Script como alternativa.
  setTimeout(()=>{
    if(roPdfDownloadInProgress && requestToken===roPdfRequestToken){
      roPdfDownloadInProgress=false;
      setRoPdfButtonState(false);
      const fallback=sync.apiUrl+sep+'acao=pdf&ro='+encodeURIComponent(wanted)+'&token='+encodeURIComponent(getSession()?.authToken||'');
      const ok=confirm(
        'O PDF não retornou automaticamente para o sistema.\n\n'+
        'Deseja abrir a geração direta do PDF?'
      );
      if(ok)window.open(fallback,'_blank','noopener,noreferrer');
    }
  },60000);
}

function closeRoReport(){
  const overlay=document.getElementById('roReportOverlay');
  if(overlay) overlay.classList.remove('open');
  document.body.style.overflow='';
}

function openRoPdf(id){
  const wanted=String(id??'').trim();
  const ro=getAllRoRecords().find(r=>String(r.numero||r.id||r.codigo||'').trim()===wanted);

  if(!ro){
    alert('Não encontrei os dados desta R.O. para gerar o PDF.');
    return;
  }

  try{
    const blob=createRoPdfBlob(ro);

    if(!(blob instanceof Blob) || blob.size===0){
      throw new Error('O arquivo PDF foi gerado vazio.');
    }

    const url=URL.createObjectURL(blob);
    const nome=(ro.numero||ro.id||ro.codigo||'RO')+'.pdf';

    const a=document.createElement('a');
    a.href=url;
    a.download=nome;
    a.target='_self';
    a.style.position='fixed';
    a.style.left='-9999px';
    document.body.appendChild(a);

    a.click();

    setTimeout(()=>{
      try{a.remove();}catch(e){}
      try{URL.revokeObjectURL(url);}catch(e){}
    },10000);

  }catch(err){
    alert('Erro ao gerar o PDF: '+(err?.message||String(err)));
  }
}

function openCurrentRoPdf(){
  const ro=(typeof selected!=='undefined' && selected) ? selected : (window.currentRO || window.currentRo || null);
  if(!ro){alert('R.O. não encontrada ou indisponível.');return}
  openRoPdf(ro.id||ro.codigo||ro.numero);
}
function refreshRoPdfAccess(){
  const box=document.getElementById('roPdfAccessBox');
  const btn=document.getElementById('roPdfAccessBtn');
  const txt=document.getElementById('roPdfAccessText');
  if(!box||!btn||!txt)return;

  const ro=(typeof selected!=='undefined' && selected) ? selected : (window.currentRO || window.currentRo || null);
  if(!ro || !roPdfAllowed(ro)){
    box.classList.add('hidden');
    return;
  }

  box.classList.remove('hidden');
  btn.disabled=false;
  txt.textContent='Documento original da ocorrência.';
}

const EXTERNAL_RO_CONTROL_KEY='portal-sgq-external-ro-control-v1';


const SAC_CLASSIFICATION_START_DATE='2026-09-24';

function sacDateKey(value){
  const raw=String(value||'').trim();
  if(!raw)return '';
  let m=raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if(m)return `${m[1]}-${m[2]}-${m[3]}`;
  m=raw.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if(m)return `${m[3]}-${m[2]}-${m[1]}`;
  m=raw.match(/^(\d{2})-(\d{2})-(\d{4})/);
  if(m)return `${m[3]}-${m[2]}-${m[1]}`;
  const d=new Date(raw);
  if(!Number.isNaN(d.getTime())){
    const y=d.getFullYear(),mo=String(d.getMonth()+1).padStart(2,'0'),da=String(d.getDate()).padStart(2,'0');
    return `${y}-${mo}-${da}`;
  }
  return '';
}
function sacOriginalRoDate(record){
  const raw=record?.raw||{};
  return (
    record?.sourceDateRaw ||
    raw?.__dataRo ||
    raw?.['Carimbo de data/hora'] ||
    raw?.['Carimbo de data e hora'] ||
    raw?.['Data da R.O.'] ||
    raw?.['Data R.O.'] ||
    raw?.['Data'] ||
    raw?.['Data da Reclamação'] ||
    raw?.['Data da reclamação'] ||
    record?.dataReclamacao ||
    record?.data ||
    record?.officialForm?.complaintDate ||
    record?.sourceRoDate ||
    ''
  );
}
function sacSourceDate(record){
  return sacDateKey(
    sacOriginalRoDate(record) ||
    record?.createdAt ||
    record?.updatedAt ||
    ''
  );
}
function sacIsCurrentCycle(record){
  const d=sacSourceDate(record);
  return !!d && d>=SAC_CLASSIFICATION_START_DATE;
}
function sacDecision(record){
  return String(record?.sacDecision||'pending').trim().toLowerCase();
}
function sacIsPendingCandidate(record){
  return sacDecision(record)==='pending';
}
function sacIsRealSac(record){
  return sacDecision(record)==='sac';
}
function getExternalRoControls(){
  let stored=[];
  try{
    const arr=JSON.parse(localStorage.getItem(EXTERNAL_RO_CONTROL_KEY)||'[]');
    stored=Array.isArray(arr)?arr:[];
  }catch(e){stored=[]}

  const canonicalRo=value=>appRoNumber(value,'Externa');
  const byRo=new Map();

  // Mantém o histórico técnico no cache, mas a tela atual só trabalha com
  // R.O.s externas a partir de 24/09/2026.
  stored.forEach(record=>{
    const key=canonicalRo(record?.ro||record?.sourceRo||record?.id||'');
    if(!key)return;
    const normalized={
      ...(record||{}),
      ro:key,
      sourceRoOrigin:'Externa',
      autoLinked:record?.autoLinked!==false
    };

    const previous=byRo.get(key);
    if(!previous){byRo.set(key,normalized);return}

    const previousTime=String(previous.updatedAt||previous.createdAt||'');
    const currentTime=String(normalized.updatedAt||normalized.createdAt||'');
    const newer=currentTime>=previousTime?normalized:previous;
    const older=newer===normalized?previous:normalized;

    byRo.set(key,{
      ...older,...newer,
      ro:key,
      sourceRoOrigin:'Externa',
      autoLinked:true,
      officialForm:{...(older.officialForm||{}),...(newer.officialForm||{})},
      representativeNotifications:[
        ...(Array.isArray(older.representativeNotifications)?older.representativeNotifications:[]),
        ...(Array.isArray(newer.representativeNotifications)?newer.representativeNotifications:[])
      ].filter((x,i,a)=>a.findIndex(y=>String(y?.id||'')===String(x?.id||''))===i),
      reworkHistory:[
        ...(Array.isArray(older.reworkHistory)?older.reworkHistory:[]),
        ...(Array.isArray(newer.reworkHistory)?newer.reworkHistory:[])
      ].filter((x,i,a)=>{
        const k=String(x?.changedAt||'')+'|'+String(x?.to||'')+'|'+String(x?.note||'');
        return a.findIndex(y=>(String(y?.changedAt||'')+'|'+String(y?.to||'')+'|'+String(y?.note||''))===k)===i;
      })
    });
  });

  const externals=getAllRoRecords().filter(r=>
    (r?.ehSac===true||String(r?.origemBase||'')==='Externa') &&
    sacIsCurrentCycle(r)
  );

  externals.forEach(ro=>{
    const key=canonicalRo(ro.numero||ro.id||ro.codigo||'');
    if(!key)return;

    const existing=byRo.get(key);
    const sourceRoDate=sacSourceDate(ro)||sacDateKey(existing?.sourceRoDate||'')||'';
    const autoOfficial={
      complaintDate:ro.dataReclamacao||ro.data||'',
      fiscalInvoice:ro.notaFiscal||'',
      fiscalOrder:ro.pedido||'',
      fiscalProductCode:ro.produto||'',
      deviationProductCode:ro.produto||'',
      deviationDescription:ro.problema||ro.descricao||'',
      nonconformingQty:ro.quantidade||'',
      representative:ro.representante||'',
      sentDate:ro.data||''
    };

    const base={
      id:existing?.id||('SAC-'+key.replace(/[^A-Za-z0-9_-]/g,'')),
      ro:key,
      client:ro.cliente||'',
      product:ro.produto||'',
      order:ro.pedido||'',
      sourceRoOrigin:'Externa',
      unidade:ro.unidade||ro.raw?.__unidade||existing?.unidade||existing?.unit||'',
      sourceRoDate,
      autoLinked:true,
      sacDecision:existing?.sacDecision||'pending',
      representative:String(existing?.representative||existing?.officialForm?.representative||ro.representante||'').trim(),
      officialForm:{...autoOfficial,...(existing?.officialForm||{})},
      status:existing?.status||'new',
      treatmentStatus:existing?.treatmentStatus||'',
      pdcaRequired:existing?.pdcaRequired===true,
      createdAt:existing?.createdAt||new Date().toISOString(),
      updatedAt:existing?.updatedAt||new Date().toISOString()
    };

    byRo.set(key,existing?{
      ...base,...existing,
      ro:key,
      sourceRoOrigin:'Externa',
      unidade:ro.unidade||ro.raw?.__unidade||existing?.unidade||existing?.unit||'',
      sourceRoDate,
      autoLinked:true,
      sacDecision:existing?.sacDecision||'pending',
      officialForm:{...autoOfficial,...(existing?.officialForm||{})}
    }:base);
  });

  // Só entram na análise atual registros cujo R.O. é do ciclo iniciado em 24/09/2026.
  // "Somente R.O." continua salvo tecnicamente, mas some da visualização de SAC.
  const normalized=[...byRo.values()].filter(r=>
    sacIsCurrentCycle(r) &&
    sacDecision(r)!=='ro_only'
  );

  try{
    // Preserva também decisões "somente R.O." no cache, para elas não reaparecerem
    // como candidatas na próxima sincronização.
    const allForCache=[...byRo.values()];
    const raw=JSON.stringify(allForCache);
    if(raw!==localStorage.getItem(EXTERNAL_RO_CONTROL_KEY))safeStorageSet(EXTERNAL_RO_CONTROL_KEY,raw);
  }catch(e){}

  return normalized;
}
function saveExternalRoControlsLocal(list){
  const map=new Map();
  (Array.isArray(list)?list:[]).forEach(r=>{
    const key=appRoNumber(r?.ro||r?.sourceRo||r?.id||'','Externa');
    if(!key)return;
    const normalized={...(r||{}),ro:key,sourceRoOrigin:'Externa'};
    const old=map.get(key);
    map.set(key,old?{...old,...normalized,officialForm:{...(old.officialForm||{}),...(normalized.officialForm||{})}}:normalized);
  });
  safeStorageSet(EXTERNAL_RO_CONTROL_KEY,JSON.stringify([...map.values()]));
}
function sacRoKey(v){
  return String(v||'').trim().toUpperCase().replace(/\s+/g,'');
}
function getStoredSacRepresentativeOverrides(){
  let list=[];
  try{
    const arr=JSON.parse(localStorage.getItem(EXTERNAL_RO_CONTROL_KEY)||'[]');
    list=Array.isArray(arr)?arr:[];
  }catch(e){list=[]}
  const map=new Map();
  list.forEach(r=>{
    const rep=String(r?.representative||r?.officialForm?.representative||'').trim();
    if(rep)map.set(sacRoKey(r?.ro),rep);
  });
  return map;
}
function applySacRepresentativeOverridesToRos(list){
  const overrides=getStoredSacRepresentativeOverrides();
  (Array.isArray(list)?list:[]).forEach(ro=>{
    if(String(ro?.origemBase||'')!=='Externa' && ro?.ehSac!==true)return;
    const rep=overrides.get(sacRoKey(ro?.numero||ro?.id||ro?.codigo));
    if(rep)ro.representante=rep;
  });
  return list;
}

function commercialExternalUsers(){
  return usersBySector('Comercial Externo');
}
function populateCommercialExternalUserSelect(selectId,currentName,currentEmail){
  const sel=document.getElementById(selectId);if(!sel)return;
  const users=commercialExternalUsers();
  sel.innerHTML='<option value="">Selecione...</option>'+
    users.map(u=>`<option value="${escapeHtml(u.name)}" data-email="${escapeHtml(u.email)}">${escapeHtml(u.name)} · ${escapeHtml(u.email)}</option>`).join('');
  if(currentName && !users.some(u=>normalizeAnswer(u.name)===normalizeAnswer(currentName))){
    sel.innerHTML+=`<option value="${escapeHtml(currentName)}">${escapeHtml(currentName)} · cadastro anterior</option>`;
  }
  sel.value=currentName||'';
}
function correctSacRepresentative(id){
  if(!isAdmin())return;
  const r=getExternalRoControls().find(x=>String(x.id)===String(id));
  if(!r)return;
  const current=String(r.representative||r.officialForm?.representative||'').trim();
  const sel=document.getElementById('representativePickerSelect');
  const empty=document.getElementById('representativePickerEmpty');
  const users=commercialExternalUsers();
  if(sel){
    sel.innerHTML='<option value="">Selecione...</option>'+
      users.map(u=>`<option value="${escapeHtml(u.email)}">${escapeHtml(u.name)} · ${escapeHtml(u.email)}</option>`).join('');
    const currentUser=users.find(u=>normalizeAnswer(u.name)===normalizeAnswer(current));
    if(currentUser)sel.value=currentUser.email;
  }
  if(empty)empty.classList.toggle('hidden',users.length>0);
  const idEl=document.getElementById('representativePickerSacId');if(idEl)idEl.value=id;
  document.getElementById('representativePickerOverlay')?.classList.add('open');
  document.body.style.overflow='hidden';
}
function closeRepresentativePicker(){
  document.getElementById('representativePickerOverlay')?.classList.remove('open');
  document.body.style.overflow='';
}
function saveRepresentativePicker(){
  const id=document.getElementById('representativePickerSacId')?.value||'';
  const email=document.getElementById('representativePickerSelect')?.value||'';
  if(!email){alert('Selecione um representante cadastrado em Comercial Externo.');return}
  const user=getOperationalUsers().find(u=>String(u.email||'').toLowerCase()===String(email).toLowerCase());
  if(!user){alert('Usuário não encontrado.');return}
  const list=getExternalRoControls();
  const idx=list.findIndex(x=>String(x.id)===String(id));
  if(idx<0)return;
  const r={...list[idx]};
  const current=String(r.representative||r.officialForm?.representative||'').trim();
  const representative=String(user.name||'').trim();
  const now=new Date().toISOString();
  const actor=getSession()?.name||'SGQ';

  r.representative=representative;
  r.representativeEmail=user.email||'';
  r.officialForm={...(r.officialForm||{}),representative,representativeEmail:user.email||''};
  r.representativeHistory=[
    ...(Array.isArray(r.representativeHistory)?r.representativeHistory:[]),
    {from:current,to:representative,toEmail:user.email||'',changedAt:now,changedBy:actor}
  ];
  r.updatedAt=now;r.updatedBy=actor;
  list[idx]=r;
  saveExternalRoControlsLocal(list);
  portalBackendSave('external_ro_controls',r.id,r);

  ros.forEach(ro=>{
    if(sacRoKey(ro?.numero||ro?.id||ro?.codigo)===sacRoKey(r.ro)){
      ro.representante=representative;
      ro.representanteEmail=user.email||'';
    }
  });
  try{
    const split=readImportedRosByOrigin();
    const saved=[...split.internas,...split.externas];
    if(saved.length){
      applySacRepresentativeOverridesToRos(saved);
      saveImportedRosByOrigin(
        saved.filter(x=>String(x.origemBase||'')==='Interna'),
        saved.filter(x=>String(x.origemBase||'')==='Externa')
      );
    }
  }catch(e){}

  closeRepresentativePicker();
  try{render()}catch(e){}
  try{renderExternalRoControl()}catch(e){}
  try{renderSacReworkTracking()}catch(e){}
  try{renderSacReworkHistory()}catch(e){}
  alert('Representante atualizado para '+representative+'.');
}
function externalRoStatusLabel(v){
  return ({new:'Nova',analysis:'Em análise',treatment:'Em tratativa',waiting_pdca:'Aguardando PDCA',done:'Concluída'})[v]||'Nova';
}
function externalTreatmentLabel(v){
  return ({
    informative:'Apenas informativa',
    label_rework:'Retrabalho com etiqueta',
    total_rework:'Retrabalho total',
    reclass_rework:'Reclassificar e retrabalhar',
    reclass_label_rework:'Reclassificar e retrabalhar com etiquetas',
    missing_items:'Reposição de itens faltantes',
    financial:'Reposição financeira'
  })[v]||'A definir';
}
function externalTreatmentStatusLabel(v){
  return ({defined:'Definida',started:'Em execução',done:'Concluída'})[v]||'Definida';
}
function externalRoPendingCount(){
  if(!isAdmin())return 0;
  return getExternalRoControls().filter(r=>r.status!=='done').length;
}
function refreshExternalRoSidebarBadge(){
  const badge=document.getElementById('externalRoSidebarBadge');
  if(!badge)return;
  const n=externalRoPendingCount();
  badge.textContent=n>99?'99+':String(n);
  badge.classList.toggle('hidden',n===0);
}
function findExternalRoControlByRo(ro){
  const key=String(ro||'').trim();
  return getExternalRoControls().find(x=>String(x.ro||'').trim()===key)||null;
}
function externalComplainantNotification(record,title,message){
  createNotification({
    type:'ro',
    audience:'complainant',
    ro:record.ro,
    cliente:record.client||'',
    title,
    message
  });
}

const SAC_REWORK_TYPES=['label_rework','total_rework','reclass_rework','reclass_label_rework'];

function isSacRework(r){
  return SAC_REWORK_TYPES.includes(String(r?.treatmentType||''));
}
function sacReworkStageLabel(v){
  return String(v||'Aguardando início').trim()||'Aguardando início';
}
function ensureSacReworkState(r){
  if(!r)return r;
  if(isSacRework(r)&&!String(r.reworkStage||'').trim()){
    r.reworkStage=r.treatmentStatus==='done'?'Concluído':r.treatmentStatus==='started'?'Em execução':'Aguardando início';
  }
  if(!Array.isArray(r.reworkHistory))r.reworkHistory=[];
  return r;
}
function showSacTracking(){
  if(!isAdmin())return;
  view('sacTrackingView');
  setNav('navSacTracking');
  setSacTrackingTab('active');
}
function setSacTrackingTab(tab){
  const map={active:'Active',history:'History',pdf:'Pdf'};
  Object.keys(map).forEach(k=>{
    const el=document.getElementById('sacTrackTab'+map[k]);
    if(el){el.classList.toggle('primary',k===tab);el.classList.toggle('secondary',k!==tab)}
  });
  if(tab==='active')renderSacReworkTracking();
  else if(tab==='history')renderSacReworkHistory();
  else renderSacPdfArchive();
}
function renderSacReworkTracking(){
  const host=document.getElementById('sacTrackingContent');if(!host)return;
  const list=getExternalRoControls().map(r=>ensureSacReworkState({...r}))
    .filter(r=>isSacRework(r)&&normalizeAnswer(r.reworkStage)!=='concluido')
    .sort((a,b)=>String(a.treatmentDeadline||'').localeCompare(String(b.treatmentDeadline||'')));

  if(!list.length){
    host.innerHTML='<div class="card" style="padding:26px"><b>Nenhum retrabalho em andamento.</b><div class="small" style="margin-top:6px">Quando um SAC receber uma tratativa de retrabalho, ele aparecerá aqui.</div></div>';
    return;
  }

  host.innerHTML=`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:12px">
    ${list.map(r=>`<div class="card" style="padding:16px;min-width:0">
      <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;flex-wrap:wrap">
        <div><b>${escapeHtml(r.ro||'—')}</b><div class="small"><b>Direcionado para:</b> ${escapeHtml(sacDirectedSector(r))}</div></div>
        <span class="status-badge pending">${escapeHtml(sacReworkStageLabel(r.reworkStage))}</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:12px">
        <div><div class="small">Tratativa</div><b>${escapeHtml(externalTreatmentLabel(r.treatmentType))}</b></div>
        <div><div class="small">Prazo</div><b>${escapeHtml(r.treatmentDeadline?formatDateBR(r.treatmentDeadline):'—')}</b></div>
        <div><div class="small">Setor</div><b>${escapeHtml(r.responsibleSector||'—')}</b></div>
        <div><div class="small">Última atualização</div><b>${escapeHtml(r.reworkHistory?.length?(formatDateTimeBR(r.reworkHistory[r.reworkHistory.length-1].changedAt)||'—'):'—')}</b></div>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:14px">
        <button class="btn primary" type="button" onclick="openSacStageUpdate('${escapeHtml(r.id)}')">Atualizar estágio</button>
        ${sacHasFilledForm(r)?`<button class="btn secondary" type="button" onclick="openSacOfficialFormPreview('${escapeHtml(r.id)}')">Ver ficha</button>`:''}
      </div>
    </div>`).join('')}
  </div>`;
}
function openSacStageUpdate(id){
  const r=getExternalRoControls().find(x=>String(x.id)===String(id));if(!r)return;
  ensureSacReworkState(r);

  const current=sacReworkStageLabel(r.reworkStage);
  const stage=prompt(
    'Estágio atual: '+current+'\n\nDigite o novo estágio do retrabalho.\nPode usar qualquer nome que faça sentido para este caso:',
    current
  );
  if(stage===null)return;
  const newStage=String(stage||'').trim();
  if(!newStage){alert('Informe o novo estágio.');return}

  const note=prompt('Observação da atualização (opcional):','')||'';
  updateSacReworkStage(id,newStage,note);
}
function updateSacReworkStage(id,stage,note){
  let list=getExternalRoControls();
  const idx=list.findIndex(x=>String(x.id)===String(id));if(idx<0)return;
  const r=ensureSacReworkState({...list[idx]});
  const oldStage=sacReworkStageLabel(r.reworkStage);
  const now=new Date().toISOString();
  const newStage=String(stage||'').trim();

  r.reworkStage=newStage;
  r.reworkHistory=[...(r.reworkHistory||[]),{
    from:oldStage,
    to:newStage,
    note:String(note||'').trim(),
    changedAt:now,
    changedBy:getSession()?.name||'SGQ'
  }];

  if(!r.treatmentStartedAt)r.treatmentStartedAt=now;

  if(normalizeAnswer(newStage)==='concluido'){
    r.treatmentStatus='done';
    r.status='done';
    r.treatmentCompletedAt=r.treatmentCompletedAt||now;
  }else{
    r.treatmentStatus='started';
    r.status='treatment';
  }

  r.updatedAt=now;
  r.updatedBy=getSession()?.name||'SGQ';

  appendRepresentativeSacNotification(
    r,
    'Andamento do SAC '+r.ro+' atualizado',
    'Nova etapa: '+newStage+'.'+(note?' '+String(note).trim():'')
  );

  list[idx]=r;
  saveExternalRoControlsLocal(list);
  portalBackendSave('external_ro_controls',r.id,r);

  createNotification({
    type:'ro',
    audience:'complainant',
    ro:r.ro,
    title:'Atualização do retrabalho',
    message:'O retrabalho da R.O. '+r.ro+' foi atualizado para "'+newStage+'".'+(note?' '+note:'')
  });

  renderSacReworkTracking();
  refreshNotificationBell();
  try{refreshRepresentativeSacMenu()}catch(e){}
  try{refreshDocumentRequestAccess()}catch(e){}
try{applySidebarCollapsedState()}catch(e){}
}
function renderSacReworkHistory(){
  const host=document.getElementById('sacTrackingContent');if(!host)return;
  const rows=getExternalRoControls()
    .slice()
    .sort((a,b)=>String(b.createdAt||b.updatedAt||'').localeCompare(String(a.createdAt||a.updatedAt||'')));

  host.innerHTML=rows.length?`<div style="display:grid;gap:10px">
    ${rows.map(r=>{
      const classified=sacIsClassified(r);
      const state=r.treatmentStatus==='done'?'Concluído':r.treatmentStatus==='started'?'Em andamento':classified?'Classificado':'A classificar';
      const created=r.createdAt||r.complaintDate||r.officialForm?.complaintDate||r.updatedAt||'';
      const history=Array.isArray(r.reworkHistory)?r.reworkHistory:[];
      const last=history.length?history[history.length-1]:null;
      return `<div class="card" style="padding:14px">
        <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap">
          <div>
            <b>${escapeHtml(r.ro||'—')}</b>
            <div class="small"><b>Direcionado para:</b> ${escapeHtml(sacDirectedSector(r))}</div>
          </div>
          <span class="status-badge ${r.treatmentStatus==='done'?'answered':'pending'}">${escapeHtml(state)}</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin-top:12px">
          <div><div class="small">Gerado / recebido</div><b>${escapeHtml(formatDateTimeBR(created)||formatDateBR(created)||created||'—')}</b></div>
          <div><div class="small">Tratativa</div><b>${escapeHtml(classified?externalTreatmentLabel(r.treatmentType):'Ainda não definida')}</b></div>
          <div><div class="small">Setor responsável</div><b>${escapeHtml(r.responsibleSector||'—')}</b></div>
          <div><div class="small">Ficha SAC</div><b>${sacHasFilledForm(r)?'Preenchida':'Pendente'}</b></div>
        </div>
        ${last?`<div class="small" style="margin-top:10px"><b>Último andamento:</b> ${escapeHtml(sacReworkStageLabel(last.to))}${last.note?' · '+escapeHtml(last.note):''} · ${escapeHtml(formatDateTimeBR(last.changedAt)||last.changedAt||'')}</div>`:''}
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:12px">
          <button class="btn secondary" type="button" onclick="openRoReport('${escapeHtml(r.ro)}')">Ver R.O.</button>
          ${sacHasFilledForm(r)?`<button class="btn secondary" type="button" onclick="openSacOfficialFormPreview('${escapeHtml(r.id)}')">Ver ficha SAC</button>`:''}
          ${r.pdfFileId?`<button class="btn secondary" type="button" onclick="openSacPdf('${escapeHtml(r.id)}')">PDF SAC</button>`:''}
        </div>
      </div>`;
    }).join('')}
  </div>`:'<div class="card" style="padding:26px"><b>Nenhum SAC no histórico.</b><div class="small" style="margin-top:6px">Toda R.O. Externa que gerar SAC aparecerá aqui automaticamente.</div></div>';
}
function sacPdfEntries(){
  const out=[];
  getExternalRoControls().forEach(r=>{
    const seen=new Set();
    (r.sacSendHistory||[]).forEach(h=>{
      if(!h.pdfFileId)return;
      seen.add(h.pdfFileId);
      out.push({ro:r.ro,client:r.client,version:h.version||1,fileId:h.pdfFileId,fileName:h.pdfName||('SAC_'+r.ro+'.pdf'),createdAt:h.sentAt||'',createdBy:h.sentBy||''});
    });
    if(r.pdfFileId&&!seen.has(r.pdfFileId)){
      out.push({ro:r.ro,client:r.client,version:r.sacPdfVersion||1,fileId:r.pdfFileId,fileName:r.pdfName||('SAC_'+r.ro+'.pdf'),createdAt:r.sacSentAt||r.updatedAt||'',createdBy:r.sacSentBy||r.updatedBy||''});
    }
  });
  return out.sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')));
}
function renderSacPdfArchive(){
  const host=document.getElementById('sacTrackingContent');if(!host)return;
  const files=sacPdfEntries();
  host.innerHTML=files.length?`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:12px">
    ${files.map(f=>`<div class="card" style="padding:15px">
      <div style="display:flex;justify-content:space-between;gap:10px">
        <div><b>${escapeHtml(f.ro||'—')}</b><div class="small">${escapeHtml(f.client||'—')}</div></div>
        <span class="pill">V${escapeHtml(String(f.version||1))}</span>
      </div>
      <div style="margin-top:10px"><b>${escapeHtml(f.fileName||'PDF SAC')}</b></div>
      <div class="small" style="margin-top:5px">${escapeHtml(formatDateTimeBR(f.createdAt)||f.createdAt||'—')} · ${escapeHtml(f.createdBy||'—')}</div>
      <button class="btn secondary" style="margin-top:12px" type="button" onclick="window.open('https://drive.google.com/file/d/${escapeHtml(f.fileId)}/view','_blank')">Abrir PDF</button>
    </div>`).join('')}
  </div>`:'<div class="card" style="padding:26px"><b>Nenhum PDF de SAC armazenado.</b><div class="small" style="margin-top:6px">Os PDFs gerados na finalização do SAC aparecerão aqui automaticamente.</div></div>';
}
function currentRepresentativeName(){return normalizeAnswer(getSession()?.name||'')}
function sacBelongsToCurrentRepresentative(r){
  if(isAdmin())return true;
  const me=currentRepresentativeName();
  const rep=normalizeAnswer(r?.representative||r?.officialForm?.representative||'');
  return !!me && !!rep && rep===me;
}
function getMySacs(){
  const sacs=getExternalRoControls().filter(sacIsRealSac);
  return isAdmin()?sacs:sacs.filter(sacBelongsToCurrentRepresentative);
}
function appendRepresentativeSacNotification(record,title,message){
  const representative=String(record?.representative||record?.officialForm?.representative||'').trim();
  if(!representative)return null;

  const event={
    id:'SACREP-'+String(record.id||record.ro||'SAC')+'-'+Date.now()+'-'+Math.random().toString(36).slice(2,6),
    createdAt:new Date().toISOString(),
    type:'sac',
    audience:'representative',
    representative,
    representativeEmail:String(record?.representativeEmail||record?.officialForm?.representativeEmail||''),
    ro:String(record.ro||''),
    title:String(title||'Atualização do SAC'),
    message:String(message||''),
    sacId:String(record.id||'')
  };
  const current=Array.isArray(record.representativeNotifications)?record.representativeNotifications:[];
  record.representativeNotifications=[...current,event].slice(-100);
  return event;
}
function getCentralRepresentativeNotifications(){
  const out=[];
  getExternalRoControls().forEach(r=>{
    (Array.isArray(r?.representativeNotifications)?r.representativeNotifications:[]).forEach(n=>{
      out.push({...n,representative:n.representative||r.representative||r.officialForm?.representative||''});
    });
  });
  return out;
}

function isRepresentativeSacAccess(){
  if(isAdmin())return false;
  return normalizeAnswer(getSession()?.sector||'').includes('comercial externo') || getMySacs().length>0;
}
function refreshRepresentativeSacMenu(){
  const admin=isAdmin();
  const allowed=isRepresentativeSacAccess(), item=document.getElementById('navMySacs'), mod=document.getElementById('moduleSac');
  if(item){item.style.display=(!admin&&allowed)?'':'none';item.classList.toggle('hidden',admin||!allowed)}
  if(mod){
    const showModule=admin||allowed;
    mod.style.display=showModule?'':'none';
    mod.classList.toggle('hidden',!showModule);
  }
  const badge=document.getElementById('mySacSidebarBadge');
  if(badge){const n=allowed?getMySacs().filter(r=>r.treatmentStatus!=='done'&&r.status!=='done').length:0;badge.textContent=String(n);badge.classList.toggle('hidden',!n)}
}
let mySacTab='open';

function mySacState(r){
  if(r?.treatmentStatus==='done' || r?.status==='done')return 'done';
  if(
    r?.treatmentStatus==='started' ||
    r?.status==='treatment' ||
    r?.status==='waiting_pdca'
  )return 'active';
  return 'open';
}

function setMySacTab(tab){
  mySacTab=tab||'open';
  const map={open:'mySacTabOpen',active:'mySacTabActive',done:'mySacTabDone'};
  Object.entries(map).forEach(([key,id])=>{
    const el=document.getElementById(id);
    if(!el)return;
    el.classList.toggle('primary',key===mySacTab);
    el.classList.toggle('secondary',key!==mySacTab);
  });
  renderMySacs();
}

function renderMySacs(){
  if(isAdmin())return;

  const all=getMySacs();
  const rows=all
    .filter(r=>mySacState(r)===mySacTab)
    .sort((a,b)=>String(b.updatedAt||b.createdAt||'').localeCompare(String(a.updatedAt||a.createdAt||'')));

  const summary=document.getElementById('mySacSummary');
  if(summary){
    const opened=all.filter(r=>mySacState(r)==='open').length;
    const active=all.filter(r=>mySacState(r)==='active').length;
    const done=all.filter(r=>mySacState(r)==='done').length;
    summary.textContent=`Abertos: ${opened} · Em andamento: ${active} · Concluídos: ${done}`;
  }

  const box=document.getElementById('mySacsCards');
  if(!box)return;

  if(!rows.length){
    const labels={open:'aberto',active:'em andamento',done:'concluído'};
    box.innerHTML=`<div class="card" style="padding:22px"><b>Nenhum SAC ${labels[mySacTab]||''}.</b></div>`;
    return;
  }

  box.innerHTML=rows.map(r=>{
    const state=mySacState(r);
    const stateLabel=state==='done'?'Concluído':state==='active'?'Em andamento':'Aberto';
    const rep=String(r.representative||r.officialForm?.representative||'—');
    const treatment=externalTreatmentLabel(r.treatmentType)||'Aguardando definição';
    const deadline=r.treatmentDeadline ? formatDateBR(r.treatmentDeadline) : '—';
    const latestUpdate=(Array.isArray(r.representativeNotifications)?r.representativeNotifications:[])
      .slice().sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')))[0];
    const reworkHistory=Array.isArray(r.reworkHistory)?r.reworkHistory:[];
    const latestRework=reworkHistory.slice().sort((a,b)=>String(b.changedAt||'').localeCompare(String(a.changedAt||'')))[0];
    const currentWork=String(
      r.treatmentDescription ||
      latestRework?.note ||
      latestRework?.to ||
      ''
    ).trim();
    const workUpdatedAt=
      latestRework?.changedAt ||
      r.updatedAt ||
      latestUpdate?.createdAt ||
      '';
    const workUpdatedBy=
      latestRework?.changedBy ||
      r.updatedBy ||
      'SGQ';

    return `<div class="card" style="padding:16px;min-width:0">
      <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;flex-wrap:wrap">
        <div>
          <b style="font-size:16px">${escapeHtml(r.ro||'—')}</b>
          <div class="small" style="margin-top:4px"><b>Direcionado para:</b> ${escapeHtml(sacDirectedSector(r))}</div>
        </div>
        <span class="status-badge ${state==='done'?'answered':'pending'}">${escapeHtml(stateLabel)}</span>
      </div>

      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 14px;margin-top:14px">
        <div><div class="small">Tratativa</div><b>${escapeHtml(treatment)}</b></div>
        <div><div class="small">Prazo</div><b>${escapeHtml(deadline)}</b></div>
        <div><div class="small">Setor responsável</div><b>${escapeHtml(r.responsibleSector||'—')}</b></div>
        <div><div class="small">Representante</div><b>${escapeHtml(rep)}</b></div>
      </div>

      <div style="margin-top:14px;padding:12px 14px;border:1px solid #cbd5e1;border-radius:10px;background:#f8fafc">
        <div style="font-size:12px;font-weight:800;margin-bottom:5px">O que está sendo feito</div>
        <div style="line-height:1.45">${escapeHtml(currentWork||'Ainda não informado pelo SGQ.')}</div>
        ${workUpdatedAt?`<div class="small" style="margin-top:7px">Atualizado em ${escapeHtml(formatDateTimeBR(workUpdatedAt)||workUpdatedAt)}${workUpdatedBy?' · '+escapeHtml(workUpdatedBy):''}</div>`:''}
      </div>

      ${latestRework?.to?`<div class="small" style="margin-top:8px"><b>Etapa atual:</b> ${escapeHtml(latestRework.to)}</div>`:''}

      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:14px">
        ${sacHasFilledForm(r)?`<button class="btn secondary" type="button" onclick="openSacOfficialFormPreview('${escapeHtml(r.id)}')">Ver ficha SAC</button>`:''}
        ${r.pdfFileId?`<button class="btn secondary" type="button" onclick="openSacPdf('${escapeHtml(r.id)}')">PDF SAC</button>`:''}
      </div>
    </div>`;
  }).join('');
}


function showMySacs(){
  if(isAdmin()){showExternalRoControl();return}
  if(!isRepresentativeSacAccess()){showList();return}
  view('mySacsView');
  setNav('mysacs');
  renderMySacs();
}

function showExternalRoControl(){
  if(!isAdmin()){showList();return}
  view('externalRoControlView');
  setNav('externalro');
  renderExternalRoControl();
}

let sacQuickTab='all';

function setSacQuickTab(tab){
  sacQuickTab=tab||'all';
  const map={
    all:'sacTabAll',
    unclassified:'sacTabUnclassified',
    defined:'sacTabDefined',
    form:'sacTabForm',
    active:'sacTabActive',
    done:'sacTabDone'
  };
  Object.entries(map).forEach(([key,id])=>{
    const el=document.getElementById(id);
    if(!el)return;
    el.classList.toggle('primary',key===sacQuickTab);
    el.classList.toggle('secondary',key!==sacQuickTab);
  });
  renderExternalRoControl();
}
function sacIsClassified(r){
  return sacIsRealSac(r) &&
         !!String(r?.treatmentType||'').trim() &&
         !!String(r?.responsibleSector||'').trim() &&
         !!String(r?.treatmentDeadline||'').trim();
}
function sacHasFilledForm(r){
  const f=r?.officialForm||{};
  const required=[
    f.complaintDate,
    r?.client,
    f.fiscalInvoice,
    f.fiscalOrder,
    f.fiscalProductCode,
    f.deviationDescription,
    f.deviationType,
    f.founded
  ];
  if(required.some(v=>String(v??'').trim()===''))return false;
  if(f.returnInvoiceIssued==='yes'&&!String(f.returnInvoiceNumber||'').trim())return false;
  if(f.replacementOrderIssued==='yes'&&!String(f.replacementOrderNumber||'').trim())return false;
  return true;
}
function sacMatchesQuickTab(r){
  if(sacIsPendingCandidate(r)){
    return sacQuickTab==='all'||sacQuickTab==='unclassified';
  }
  if(!sacIsRealSac(r))return false;
  if(sacQuickTab==='unclassified')return false;
  if(sacQuickTab==='defined')return sacIsClassified(r) && r.treatmentStatus!=='done';
  if(sacQuickTab==='form')return sacHasFilledForm(r);
  if(sacQuickTab==='active')return r.treatmentStatus==='started' || r.status==='treatment';
  if(sacQuickTab==='done')return r.treatmentStatus==='done' || r.status==='done';
  return true;
}
function updateSacQuickSummary(allRows,visibleRows){
  const el=document.getElementById('sacQuickSummary');
  if(!el)return;
  const candidates=allRows.filter(sacIsPendingCandidate);
  const sacs=allRows.filter(sacIsRealSac);
  const counts={
    all:allRows.length,
    unclassified:candidates.length,
    defined:sacs.filter(r=>sacIsClassified(r)&&r.treatmentStatus!=='done').length,
    form:sacs.filter(sacHasFilledForm).length,
    active:sacs.filter(r=>r.treatmentStatus==='started'||r.status==='treatment').length,
    done:sacs.filter(r=>r.treatmentStatus==='done'||r.status==='done').length
  };
  const label={
    all:'Visão geral',
    unclassified:'R.O.s para avaliar',
    defined:'SACs classificados',
    form:'Ficha preenchida',
    active:'Em andamento',
    done:'Concluídos'
  }[sacQuickTab]||'Visão geral';
  el.textContent=`${label}: ${visibleRows.length} registro(s) · Para avaliar: ${counts.unclassified} · SACs: ${sacs.length}`;
}


function sacDirectedSector(record){
  const roKey=appRoNumber(record?.ro||'','Externa');

  try{
    const tri=getSavedTriageMap().get(roKey);
    if(tri?.responsibleSector)return String(tri.responsibleSector).trim();
  }catch(e){}

  try{
    const row=getTriageRecords().find(x=>triageKeyOf(x)===roKey);
    if(row?.setorDirecionado)return String(row.setorDirecionado).trim();
  }catch(e){}

  if(record?.responsibleSector)return String(record.responsibleSector).trim();
  return 'Ainda não direcionado';
}


async function saveSacDecisionLocally(record){
  if(!nucleoFeatureRequire('sac','edit'))return;
  await portalBackendSaveConfirmed('external_ro_controls',record.id,record);
  const stored=(()=>{
    try{const x=JSON.parse(localStorage.getItem(EXTERNAL_RO_CONTROL_KEY)||'[]');return Array.isArray(x)?x:[]}catch(e){return []}
  })();
  const roKey=appRoNumber(record?.ro||'','Externa');
  const list=stored.filter(x=>appRoNumber(x?.ro||x?.sourceRo||x?.id||'','Externa')!==roKey);
  list.push(record);
  saveExternalRoControlsLocal(list);
}

async function markExternalRoAsRoOnly(id){
  if(!isAdmin())return;
  const r=getExternalRoControls().find(x=>String(x.id)===String(id));
  if(!r)return;
  if(!confirm('Manter '+String(r.ro||'esta ocorrência')+' somente como R.O.? Ela sairá da área de SAC.'))return;
  const now=new Date().toISOString();
  const record={...r,sacDecision:'ro_only',sacDecisionAt:now,sacDecisionBy:getSession()?.name||'SGQ',updatedAt:now};
  try{await saveSacDecisionLocally(record)}catch(e){alert('Não foi possível confirmar a decisão de SAC na base central: '+(e?.message||e));return;}
  renderExternalRoControl();
  refreshMenuNotificationBadges();
}
async function promoteExternalRoToSac(id){
  if(!isAdmin())return;
  const r=getExternalRoControls().find(x=>String(x.id)===String(id));
  if(!r)return;
  const now=new Date().toISOString();
  const record={
    ...r,
    sacDecision:'sac',
    sacCreatedAt:r.sacCreatedAt||now,
    sacDecisionAt:now,
    sacDecisionBy:getSession()?.name||'SGQ',
    pdcaRequired:r.pdcaRequired===true,
    updatedAt:now
  };
  try{await saveSacDecisionLocally(record)}catch(e){alert('Não foi possível confirmar a decisão de SAC na base central: '+(e?.message||e));return;}
  openExternalRoControlModal(record.id);
}

function sacRoNumericKey(value){
  const m=String(value||'').match(/(\d+)(?!.*\d)/);
  return m?Number(m[1]):Number.MAX_SAFE_INTEGER;
}
function sacSortRows(rows,mode){
  const list=[...(rows||[])];
  const txt=v=>normalizeAnswer(String(v||''));
  const date=v=>{
    const k=sacDateKey(v);
    if(!k)return 0;
    const t=new Date(k+'T00:00:00').getTime();
    return Number.isNaN(t)?0:t;
  };
  const cmpText=(a,b)=>txt(a).localeCompare(txt(b),'pt-BR',{numeric:true,sensitivity:'base'});

  switch(mode){
    case 'date_asc':
      return list.sort((a,b)=>date(sacSourceDate(a))-date(sacSourceDate(b)));
    case 'ro_asc':
      return list.sort((a,b)=>sacRoNumericKey(a.ro)-sacRoNumericKey(b.ro) || cmpText(a.ro,b.ro));
    case 'ro_desc':
      return list.sort((a,b)=>sacRoNumericKey(b.ro)-sacRoNumericKey(a.ro) || cmpText(b.ro,a.ro));
    case 'client_asc':
      return list.sort((a,b)=>cmpText(a.client,b.client) || sacRoNumericKey(a.ro)-sacRoNumericKey(b.ro));
    case 'client_desc':
      return list.sort((a,b)=>cmpText(b.client,a.client) || sacRoNumericKey(a.ro)-sacRoNumericKey(b.ro));
    case 'sector_asc':
      return list.sort((a,b)=>cmpText(sacDirectedSector(a),sacDirectedSector(b)) || sacRoNumericKey(a.ro)-sacRoNumericKey(b.ro));
    case 'deadline_asc':
      return list.sort((a,b)=>{
        const da=date(a.treatmentDeadline), db=date(b.treatmentDeadline);
        if(!da&&!db)return sacRoNumericKey(a.ro)-sacRoNumericKey(b.ro);
        if(!da)return 1;
        if(!db)return -1;
        return da-db;
      });
    case 'status_asc':
      return list.sort((a,b)=>cmpText(
        sacIsPendingCandidate(a)?'Avaliar necessidade de SAC':externalTreatmentStatusLabel(a.treatmentStatus),
        sacIsPendingCandidate(b)?'Avaliar necessidade de SAC':externalTreatmentStatusLabel(b.treatmentStatus)
      ) || date(sacSourceDate(b))-date(sacSourceDate(a)));
    case 'date_desc':
    default:
      return list.sort((a,b)=>date(sacSourceDate(b))-date(sacSourceDate(a)));
  }
}

function renderExternalRoControl(){
  if(!isAdmin()&&!isRepresentativeSacAccess())return;
  const status=document.getElementById('externalRoStatusFilter')?.value||'all';
  const treatment=document.getElementById('externalRoImpactFilter')?.value||'all';
  const q=normalizeAnswer(document.getElementById('externalRoSearch')?.value||'');
  const allSacRows=isAdmin()?getExternalRoControls():getMySacs();

  const sortMode=document.getElementById('externalRoSort')?.value||'date_desc';

  let rows=allSacRows.filter(r=>{
    if(!sacMatchesQuickTab(r))return false;

    if(sacIsRealSac(r)){
      if(status!=='all'){
        if(status==='started' && r.treatmentStatus!=='started')return false;
        if(status!=='started' && r.status!==status)return false;
      }
      if(treatment!=='all'&&r.treatmentType!==treatment)return false;
    }else{
      if(status!=='all'||treatment!=='all')return false;
    }

    if(q){
      const hay=normalizeAnswer([
        r.ro,r.client,r.product,r.order,r.sourceRoOrigin,sacDirectedSector(r),
        r.responsibleSector,r.qualityNote,r.adminNote,r.treatmentDescription,
        externalTreatmentLabel(r.treatmentType)
      ].join(' '));
      if(!hay.includes(q))return false;
    }
    return true;
  });

  rows=sacSortRows(rows,sortMode);

  updateSacQuickSummary(allSacRows,rows);

  const body=document.getElementById('externalRoControlBody');
  if(!body)return;
  const table=body.closest('table');
  if(table)table.style.display='none';

  let cards=document.getElementById('externalRoControlCards');
  if(!cards){
    cards=document.createElement('div');
    cards.id='externalRoControlCards';
    cards.style.display='grid';
    cards.style.gridTemplateColumns='repeat(auto-fit,minmax(320px,1fr))';
    cards.style.gap='12px';
    const parent=body.closest('table')?.parentElement || body.parentElement;
    if(parent)parent.insertAdjacentElement('afterend',cards);
  }

  cards.innerHTML=rows.length?rows.map(r=>{
    if(sacIsPendingCandidate(r)){
      return `<div class="card" style="padding:16px;min-width:0;border:1px solid #dbe4ee">
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap">
          <div>
            <b style="font-size:16px">${escapeHtml(r.ro||'—')}</b>
            <div class="small" style="margin-top:4px">${escapeHtml(r.client||'Cliente não informado')}</div>
            <div class="small" style="margin-top:2px">Entrada: ${escapeHtml(sacSourceDate(r)?formatDateBR(sacSourceDate(r)):'—')}</div>
          </div>
          <span class="status-badge pending">Avaliar necessidade de SAC</span>
        </div>
        <div class="small" style="margin-top:12px">Esta é uma R.O. externa. Só será criada como SAC se o SGQ indicar que há necessidade de atendimento ao cliente.</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px">
          <button class="btn secondary" type="button" onclick="openRoReport('${escapeHtml(r.ro)}')">Ver R.O.</button>
          ${isAdmin()?`<button class="btn secondary" type="button" onclick="markExternalRoAsRoOnly('${escapeHtml(r.id)}')">Somente R.O.</button>
          <button class="btn primary" type="button" onclick="promoteExternalRoToSac('${escapeHtml(r.id)}')">Criar SAC</button>`:''}
        </div>
      </div>`;
    }

    const pdca=r.pdcaRequired?'Obrigatório':'—';
    const treatmentState=externalTreatmentStatusLabel(r.treatmentStatus);
    const started=r.treatmentStartedAt?('Em execução desde: '+(formatDateTimeBR(r.treatmentStartedAt)||r.treatmentStartedAt)):'Ainda não iniciada';
    const completed=r.treatmentCompletedAt?(' · Fim: '+(formatDateTimeBR(r.treatmentCompletedAt)||r.treatmentCompletedAt)):'';
    const startBtn=sacIsClassified(r)&&r.treatmentStatus!=='started'&&r.treatmentStatus!=='done'
      ? `<button class="btn secondary" type="button" onclick="startExternalTreatment('${escapeHtml(r.id)}')">Iniciar</button>`:'';
    const updateBtn=r.treatmentStatus==='started'
      ? `<button class="btn secondary" type="button" onclick="openExternalRoControlModal('${escapeHtml(r.id)}')">Atualizar</button>`:'';
    const finishBtn=r.treatmentStatus==='started'
      ? `<button class="btn primary" type="button" onclick="finishExternalTreatment('${escapeHtml(r.id)}')">Concluir</button>`:'';
    const reviewBtn=r.treatmentStatus==='done'
      ? `<button class="btn secondary" type="button" onclick="openExternalRoControlModal('${escapeHtml(r.id)}')">Ver/atualizar</button>`:'';

    return `<div class="card" style="padding:16px;min-width:0">
      <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap">
        <div>
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <b style="font-size:16px">${escapeHtml(r.ro||'—')}</b>
            ${isAdmin()?`<button class="btn primary" type="button" style="padding:5px 8px;font-size:11px;min-height:auto" onclick="openExternalRoControlModal('${escapeHtml(r.id)}')">Classificar SAC</button>`:''}
          </div>
          <div class="small" style="margin-top:4px"><b>Direcionado para:</b> ${escapeHtml(sacDirectedSector(r))}</div>
        </div>
        <span class="status-badge ${r.treatmentStatus==='done'?'answered':'pending'}">${escapeHtml(treatmentState)}</span>
      </div>

      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
        ${sacIsClassified(r)?'<span class="status-badge answered">SAC classificado</span>':'<span class="status-badge pending">SAC aguardando classificação</span>'}
        ${sacHasFilledForm(r)?'<span class="status-badge answered">Ficha preenchida</span>':`<span class="status-badge pending">Ficha ${officialSacCompletion(r).percent}%</span>`}
      </div>

      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 14px;margin-top:14px">
        <div><div class="small">Tratativa</div><b>${escapeHtml(externalTreatmentLabel(r.treatmentType))}</b></div>
        <div><div class="small">Prazo</div><b>${escapeHtml(r.treatmentDeadline?formatDateBR(r.treatmentDeadline):'—')}</b></div>
        <div><div class="small">Setor responsável</div><b>${escapeHtml(r.responsibleSector||'—')}</b></div>
        <div><div class="small">Representante</div><b>${escapeHtml(r.representative||r.officialForm?.representative||'—')}</b></div>
        <div><div class="small">PDCA</div><b>${escapeHtml(pdca)}</b></div>
        <div><div class="small">Situação</div><b>${escapeHtml(externalRoStatusLabel(r.status))}</b></div>
        <div><div class="small">Ficha SAC</div><b>${officialSacCompletion(r).percent}%</b></div>
      </div>

      <div class="small" style="margin-top:12px">${escapeHtml(started)}${escapeHtml(completed)}</div>

      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:14px">
        ${isAdmin()?`
          <button class="btn secondary" type="button" onclick="openRoReport('${escapeHtml(r.ro)}')">Ver R.O.</button>
          <button class="btn secondary" type="button" onclick="correctSacRepresentative('${escapeHtml(r.id)}')">Corrigir representante</button>
          <button class="btn secondary" type="button" onclick="openSacEditModal('${escapeHtml(r.id)}')">Preencher ficha SAC</button>
          ${sacHasFilledForm(r)?`<button class="btn secondary" type="button" onclick="openSacOfficialFormPreview('${escapeHtml(r.id)}')">Ver ficha SAC</button>`:''}
          ${r.pdfFileId?`<button class="btn secondary" type="button" onclick="openSacPdf('${escapeHtml(r.id)}')">PDF SAC</button>`:''}
          ${startBtn}${updateBtn}${finishBtn}${reviewBtn}
          ${isSacRework(r)?`<button class="btn secondary" type="button" onclick="showSacTracking()">Acompanhar retrabalho</button>`:''}
          ${r.treatmentStatus==='done'?`<button class="btn primary" type="button" onclick="finalizeAndSendSac('${escapeHtml(r.id)}')">${r.sacSentAt?'Regerar e reenviar SAC':'Finalizar e enviar SAC'}</button>`:''}
        `:`
          ${sacHasFilledForm(r)?`<button class="btn secondary" type="button" onclick="openSacOfficialFormPreview('${escapeHtml(r.id)}')">Ver ficha SAC</button>`:''}
          ${r.pdfFileId?`<button class="btn secondary" type="button" onclick="openSacPdf('${escapeHtml(r.id)}')">PDF SAC</button>`:''}
        `}
      </div>
      ${r.sacSentAt?`<div class="small" style="margin-top:8px">Enviado em ${escapeHtml(formatDateTimeBR(r.sacSentAt)||r.sacSentAt)} · versão ${escapeHtml(String(r.sacPdfVersion||1))}</div>`:''}
    </div>`;
  }).join(''):'<div class="card" style="padding:24px"><b>Nenhuma R.O. externa nova aguardando análise de SAC.</b></div>';

  refreshExternalRoSidebarBadge();
}

function prefillSacFromRo(){
  const key=String(document.getElementById('externalRoNumber')?.value||'').trim();
  if(!key)return;
  const norm=v=>String(v||'').replace(/\D/g,'').replace(/^0+/,'')||String(v||'').trim().toLowerCase();
  const ro=getAllRoRecords().find(x=>norm(x.numero||x.id||x.codigo||'')===norm(key));
  if(!ro)return;
  const setIfEmpty=(id,v)=>{const el=document.getElementById(id);if(el&&!String(el.value||'').trim()&&v!==undefined&&v!==null)el.value=v};
  setIfEmpty('externalRoClient',ro.cliente||'');
  setIfEmpty('externalRoProduct',ro.produto||ro.codigoProduto||ro.item||'');
  setIfEmpty('externalRoOrder',ro.pedido||ro.numeroPedido||'');
  setIfEmpty('sacFiscalOrder',ro.pedido||ro.numeroPedido||'');
  setIfEmpty('sacFiscalInvoice',ro.notaFiscal||'');
  setIfEmpty('sacFiscalProductCode',ro.produto||ro.codigoProduto||ro.item||'');
  setIfEmpty('sacDeviationProductCode',ro.produto||ro.codigoProduto||ro.item||'');
  setIfEmpty('sacDeviationDescription',ro.descricao||ro.assunto||ro.tipoRO||'');
  const date=String(ro.dataSolicitacao||ro.data||'');
  const m=date.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if(m)setIfEmpty('sacComplaintDate',`${m[3]}-${m[2]}-${m[1]}`);
}

function populateExternalRoSectorSelect(){
  const sel=document.getElementById('externalRoResponsibleSector');
  if(!sel)return;
  const cur=sel.value||'';
  const sectors=getConfiguredSectors();
  sel.innerHTML='<option value="">Selecione...</option>'+sectors.map(s=>`<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
  if(cur&&[...sel.options].some(o=>o.value===cur))sel.value=cur;
}

function refreshOfficialSacFields(){
  const noteIssued=document.getElementById('sacReturnInvoiceIssued')?.value==='yes';
  const orderIssued=document.getElementById('sacReplacementOrderIssued')?.value==='yes';
  document.getElementById('sacReturnInvoiceNumberField')?.classList.toggle('hidden',!noteIssued);
  document.getElementById('sacReplacementOrderNumberField')?.classList.toggle('hidden',!orderIssued);
}
function getOfficialSacFormData(){
  const val=id=>String(document.getElementById(id)?.value||'').trim();
  const num=id=>Number(document.getElementById(id)?.value||0);
  return {
    complaintDate:val('sacComplaintDate'),
    titleWriteoff:val('sacTitleWriteoff'),
    financialDiscount:val('sacFinancialDiscount'),
    financialDiscountValue:num('sacFinancialDiscountValue'),
    returnInvoiceIssued:val('sacReturnInvoiceIssued'),
    returnInvoiceNumber:val('sacReturnInvoiceNumber'),
    replacementOrderIssued:val('sacReplacementOrderIssued'),
    replacementOrderNumber:val('sacReplacementOrderNumber'),
    fiscalInvoice:val('sacFiscalInvoice'),
    fiscalOrder:val('sacFiscalOrder'),
    fiscalProductCode:val('sacFiscalProductCode'),
    deviationDescription:val('sacDeviationDescription'),
    deviationProductCode:val('sacDeviationProductCode'),
    deviationType:val('sacDeviationType'),
    nonconformingQty:num('sacNonconformingQty'),
    pickup:val('sacPickup'),
    attachments:val('sacAttachments'),
    representative:val('sacRepresentative'),
    sentDate:val('sacSentDate'),
    founded:val('sacFounded'),
    rncNumber:val('sacRncNumber'),
    lotSize:num('sacLotSize'),
    claimValue:num('sacClaimValue'),
    boPercent:num('sacBoPercent'),
    recognitionArea:val('sacRecognitionArea')
  };
}
function setOfficialSacFormData(r){
  const f=r?.officialForm||{};
  const set=(id,v)=>{const el=document.getElementById(id);if(el)el.value=v??''};
  set('sacComplaintDate',f.complaintDate||'');
  set('sacTitleWriteoff',f.titleWriteoff||'');
  set('sacFinancialDiscount',f.financialDiscount||'');
  set('sacFinancialDiscountValue',f.financialDiscountValue||'');
  set('sacReturnInvoiceIssued',f.returnInvoiceIssued||'');
  set('sacReturnInvoiceNumber',f.returnInvoiceNumber||'');
  set('sacReplacementOrderIssued',f.replacementOrderIssued||'');
  set('sacReplacementOrderNumber',f.replacementOrderNumber||'');
  set('sacFiscalInvoice',f.fiscalInvoice||r?.order||'');
  set('sacFiscalOrder',f.fiscalOrder||r?.order||'');
  set('sacFiscalProductCode',f.fiscalProductCode||r?.product||'');
  set('sacDeviationDescription',f.deviationDescription||'');
  set('sacDeviationProductCode',f.deviationProductCode||r?.product||'');
  set('sacDeviationType',f.deviationType||'');
  set('sacNonconformingQty',f.nonconformingQty||'');
  set('sacPickup',f.pickup||'');
  set('sacAttachments',f.attachments||'');
  set('sacRepresentative',r?.representative||f.representative||'');
  set('sacSentDate',f.sentDate||'');
  set('sacFounded',f.founded||'');
  set('sacRncNumber',f.rncNumber||'');
  set('sacLotSize',f.lotSize||'');
  set('sacClaimValue',f.claimValue||'');
  set('sacBoPercent',f.boPercent||'');
  set('sacRecognitionArea',f.recognitionArea||'');
  refreshOfficialSacFields();
}
function officialSacCompletion(r){
  const f=r?.officialForm||{};
  const required=[
    f.complaintDate,r?.client,f.fiscalInvoice,f.fiscalOrder,f.fiscalProductCode,
    f.deviationDescription,f.deviationType,f.founded
  ];
  const filled=required.filter(v=>String(v??'').trim()!=='').length;
  return {filled,total:required.length,percent:Math.round((filled/required.length)*100)};
}

function sacRequiredMissing(r){
  const f=r?.officialForm||{};
  const required=[
    ['Data da reclamação',f.complaintDate],
    ['Cliente',r?.client],
    ['Nota Fiscal',f.fiscalInvoice],
    ['Pedido',f.fiscalOrder],
    ['Código do produto',f.fiscalProductCode],
    ['Descrição do desvio',f.deviationDescription],
    ['Tipo de desvio',f.deviationType],
    ['Procedência',f.founded],
    ['Encaminhamento definido pelo SGQ',r?.treatmentType],
    ['Prazo vigente',r?.treatmentDeadline]
  ];
  if(f.returnInvoiceIssued==='yes')required.push(['Nº da Nota de Devolução/Remessa',f.returnInvoiceNumber]);
  if(f.replacementOrderIssued==='yes')required.push(['Nº do Pedido de Reposição',f.replacementOrderNumber]);
  if(r?.treatmentType==='missing_items'&&r?.receiptSigned==='no'&&r?.directorDecision==='pending')required.push(['Decisão da Diretoria','']);
  return required.filter(([,v])=>String(v??'').trim()==='').map(([k])=>k);
}
async function finalizeAndSendSac(id){
  if(!nucleoFeatureRequire('sac','finalize'))return;
  if(!isAdmin())return;
  const r=getExternalRoControls().find(x=>String(x.id)===String(id));
  if(!r){alert('Controle de SAC não encontrado.');return}
  const missing=sacRequiredMissing(r);
  if(missing.length){
    alert('Antes de finalizar o SAC, preencha:\\n\\n• '+missing.join('\\n• '));
    openExternalRoControlModal(id);
    return;
  }
  if(r.treatmentStatus!=='done'){
    alert('Conclua a tratativa antes de finalizar e enviar o SAC.');
    return;
  }
  const cfg=getAdminConfig();
  if(!String(cfg.sgqNotificationEmail||'').trim()||!String(cfg.directorSacEmail||'').trim()){
    alert('Cadastre o e-mail do SGQ e o e-mail da Diretoria em Administração > Avisos e e-mails.');
    return;
  }
  const resend=!!r.sacSentAt;
  if(!confirm((resend?'Gerar uma nova versão':'Gerar o PDF oficial')+' do SAC '+r.ro+' e enviar para Diretoria e SGQ?'))return;

  try{
    const result=await portalJsonp({
      acao:'portal_finalize_sac',
      id:r.id,
      ator:getSession()?.name||'SGQ'
    },45000);
    if(!result||result.sucesso===false)throw new Error(result?.erro||'Falha ao finalizar o SAC.');
    await portalBackendSync({silent:true});
    renderExternalRoControl();
    createNotification({
      type:'ro',audience:'complainant',ro:r.ro,
      title:'SAC finalizado',
      message:'O SAC da R.O. '+r.ro+' foi finalizado pelo SGQ.'
    });
    alert('SAC finalizado. PDF versão '+(result.versao||1)+' gerado e enviado para Diretoria e SGQ.');
  }catch(e){
    alert('Não foi possível finalizar/enviar o SAC: '+(e?.message||e));
  }
}
function openSacPdf(id){
  const r=getExternalRoControls().find(x=>String(x.id)===String(id));
  if(!r?.pdfFileId){alert('Este SAC ainda não possui PDF gerado.');return}
  window.open('https://drive.google.com/file/d/'+encodeURIComponent(r.pdfFileId)+'/view','_blank','noopener,noreferrer');
}


function openSacEditModal(id){
  if(!isAdmin())return;
  const r=getExternalRoControls().find(x=>String(x.id)===String(id));
  if(!r){alert('Controle de SAC não encontrado.');return}
  const f=r.officialForm||{};
  const set=(id,v)=>{const el=document.getElementById(id);if(el)el.value=v??''};

  set('sacEditRecordId',r.id);
  set('sacEditRo',r.ro||'');
  set('sacEditClient',r.client||'');
  set('sacEditComplaintDate',f.complaintDate||'');
  set('sacEditRepresentative',r.representative||f.representative||'');
  set('sacEditTitleWriteoff',f.titleWriteoff||'');
  set('sacEditFinancialDiscount',f.financialDiscount||'');
  set('sacEditFinancialDiscountValue',f.financialDiscountValue||'');
  set('sacEditReturnInvoiceIssued',f.returnInvoiceIssued||'');
  set('sacEditReturnInvoiceNumber',f.returnInvoiceNumber||'');
  set('sacEditReplacementOrderIssued',f.replacementOrderIssued||'');
  set('sacEditReplacementOrderNumber',f.replacementOrderNumber||'');
  set('sacEditFiscalInvoice',f.fiscalInvoice||'');
  set('sacEditFiscalOrder',f.fiscalOrder||r.order||'');
  set('sacEditFiscalProductCode',f.fiscalProductCode||r.product||'');
  set('sacEditNonconformingQty',f.nonconformingQty||'');
  set('sacEditPickup',f.pickup||'');
  set('sacEditSentDate',f.sentDate||'');
  set('sacEditDeviationType',f.deviationType||'');
  set('sacEditDeviationProductCode',f.deviationProductCode||r.product||'');
  set('sacEditDeviationDescription',f.deviationDescription||'');
  set('sacEditAttachments',f.attachments||'');
  set('sacEditFounded',f.founded||'');
  set('sacEditRncNumber',f.rncNumber||'');
  set('sacEditLotSize',f.lotSize||'');
  set('sacEditClaimValue',f.claimValue||'');
  set('sacEditBoPercent',f.boPercent||'');
  set('sacEditRecognitionArea',f.recognitionArea||'');

  const title=document.getElementById('sacEditTitle');
  if(title)title.textContent='Preencher ficha SAC · '+(r.ro||'');
  refreshSacEditConditionalFields();
  document.getElementById('sacEditOverlay')?.classList.add('open');
  document.body.style.overflow='hidden';
}
function closeSacEditModal(){
  document.getElementById('sacEditOverlay')?.classList.remove('open');
  document.body.style.overflow='';
}
function refreshSacEditConditionalFields(){
  const ret=document.getElementById('sacEditReturnInvoiceIssued')?.value==='yes';
  const rep=document.getElementById('sacEditReplacementOrderIssued')?.value==='yes';
  const retF=document.getElementById('sacEditReturnInvoiceNumberField');
  const repF=document.getElementById('sacEditReplacementOrderNumberField');
  if(retF)retF.style.display=ret?'block':'none';
  if(repF)repF.style.display=rep?'block':'none';
}
function collectSacEditForm(){
  const val=id=>String(document.getElementById(id)?.value||'').trim();
  return {
    complaintDate:val('sacEditComplaintDate'),
    titleWriteoff:val('sacEditTitleWriteoff'),
    financialDiscount:val('sacEditFinancialDiscount'),
    financialDiscountValue:val('sacEditFinancialDiscountValue'),
    returnInvoiceIssued:val('sacEditReturnInvoiceIssued'),
    returnInvoiceNumber:val('sacEditReturnInvoiceNumber'),
    replacementOrderIssued:val('sacEditReplacementOrderIssued'),
    replacementOrderNumber:val('sacEditReplacementOrderNumber'),
    fiscalInvoice:val('sacEditFiscalInvoice'),
    fiscalOrder:val('sacEditFiscalOrder'),
    fiscalProductCode:val('sacEditFiscalProductCode'),
    deviationProductCode:val('sacEditDeviationProductCode'),
    deviationDescription:val('sacEditDeviationDescription'),
    deviationType:val('sacEditDeviationType'),
    nonconformingQty:val('sacEditNonconformingQty'),
    pickup:val('sacEditPickup'),
    attachments:val('sacEditAttachments'),
    representative:val('sacEditRepresentative'),
    sentDate:val('sacEditSentDate'),
    founded:val('sacEditFounded'),
    rncNumber:val('sacEditRncNumber'),
    lotSize:val('sacEditLotSize'),
    claimValue:val('sacEditClaimValue'),
    boPercent:val('sacEditBoPercent'),
    recognitionArea:val('sacEditRecognitionArea')
  };
}
function saveSacEditForm(){
  if(!nucleoFeatureRequire('sac','edit'))return;
  if(!isAdmin())return;
  const id=String(document.getElementById('sacEditRecordId')?.value||'').trim();
  let list=getExternalRoControls();
  const idx=list.findIndex(x=>String(x.id)===String(id));
  if(idx<0){alert('Controle de SAC não encontrado.');return}

  const now=new Date().toISOString();
  const r={...list[idx]};
  r.client=String(document.getElementById('sacEditClient')?.value||r.client||'').trim();
  r.officialForm=collectSacEditForm();
  r.representative=String(r.officialForm?.representative||'').trim();
  r.updatedAt=now;
  r.updatedBy=getSession()?.name||'SGQ';

  const hist=Array.isArray(r.sacFormHistory)?r.sacFormHistory.slice():[];
  hist.push({
    changedAt:now,
    changedBy:r.updatedBy,
    completion:officialSacCompletion(r).percent
  });
  r.sacFormHistory=hist;

  list[idx]=r;
  saveExternalRoControlsLocal(list);
  portalBackendSave('external_ro_controls',r.id,r);
  closeSacEditModal();
  renderExternalRoControl();
  alert('Ficha SAC atualizada.');
}

let currentSacPreviewId='';
function openSacOfficialFormPreview(id){
  currentSacPreviewId=String(id||'');
  const r=getExternalRoControls().find(x=>String(x.id)===String(id));
  if(!r){alert('Controle de SAC não encontrado.');return}
  const f=r.officialForm||{};
  const yesno=v=>v==='yes'?'Sim':v==='no'?'Não':v==='na'?'Não se aplica':v==='analysis'?'Em análise':'—';
  const dev=({informative:'Informativo',billing:'Faturamento',quality:'Qualidade'})[f.deviationType]||'—';
  const rec=({billing:'Faturista',quality:'Qualidade'})[f.recognitionArea]||'—';
  const money=v=>v?Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}):'—';
  const cell=(label,value,span=1)=>`<div style="grid-column:span ${span};border:1px solid #dce3ea;padding:10px 12px;background:#fff"><div class="small" style="font-weight:700;margin-bottom:4px">${escapeHtml(label)}</div><div>${escapeHtml(String(value??'—'))}</div></div>`;
  const section=(title,items)=>`<div style="margin-top:14px"><div style="padding:8px 10px;background:#eef4f1;border:1px solid #dce3ea;font-weight:700">${escapeHtml(title)}</div><div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr))">${items.join('')}</div></div>`;

  const overlay=document.getElementById('sacPreviewOverlay');
  const title=document.getElementById('sacPreviewTitle');
  const content=document.getElementById('sacPreviewContent');
  if(!overlay||!content){alert('Não foi possível abrir a ficha SAC.');return}
  if(title)title.textContent='Ficha SAC · R.O. '+(r.ro||'');

  content.innerHTML=`
    <div style="border:1px solid #cfd8df;border-radius:12px;overflow:hidden;background:#fff">
      <div style="padding:16px 18px;background:#f8fafc;border-bottom:1px solid #cfd8df;display:flex;justify-content:space-between;gap:16px;align-items:flex-start">
        <div><b style="font-size:18px">Serviço de Atendimento ao Cliente</b><div class="small" style="margin-top:4px">SISTEMA DE GESTÃO DA QUALIDADE</div></div>
        <div class="small" style="text-align:right"><b>FOR-GER-ADM-001</b><br>Revisão 1</div>
      </div>
      <div style="padding:14px">
        ${section('Identificação',[
          cell('R.O.',r.ro||'—'),
          cell('Cliente',r.client||'—'),
          cell('Data da reclamação',f.complaintDate?formatDateBR(f.complaintDate):'—'),
          cell('Representante',f.representative||r.representative||'—')
        ])}
        ${section('Entrada fiscal',[
          cell('Baixa de títulos',yesno(f.titleWriteoff)),
          cell('Desconto financeiro',yesno(f.financialDiscount)),
          cell('Valor do desconto',money(f.financialDiscountValue)),
          cell('Nota de devolução / remessa',yesno(f.returnInvoiceIssued)),
          cell('Nº da Nota',f.returnInvoiceNumber||'—'),
          cell('Pedido de reposição',yesno(f.replacementOrderIssued)),
          cell('Nº Pedido de reposição',f.replacementOrderNumber||'—')
        ])}
        ${section('Referência fiscal',[
          cell('Nota Fiscal',f.fiscalInvoice||'—'),
          cell('Pedido',f.fiscalOrder||r.order||'—'),
          cell('Código do produto',f.fiscalProductCode||r.product||'—'),
          cell('Qtd. não conforme',f.nonconformingQty||'—'),
          cell('Retirada?',yesno(f.pickup)),
          cell('Data de envio',f.sentDate?formatDateBR(f.sentDate):'—')
        ])}
        ${section('Desvio',[
          cell('Tipo de desvio',dev),
          cell('Descrição do desvio',f.deviationDescription||'—'),
          cell('Anexos',f.attachments||'—',2)
        ])}
        ${section('Reconhecimento da reclamação',[
          cell('Procedente?',yesno(f.founded)),
          cell('Nº RNC',f.rncNumber||'—'),
          cell('Tamanho do lote',f.lotSize||'—'),
          cell('Valor',money(f.claimValue)),
          cell('% de B.O.',f.boPercent?f.boPercent+'%':'—'),
          cell('Faturista ou Qualidade',rec)
        ])}
      </div>
    </div>
    <div class="card" style="margin-top:14px;padding:16px">
      <b>Classificação e encaminhamento do SGQ</b>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:12px">
        <div><span class="small">Tratativa</span><br><b>${escapeHtml(externalTreatmentLabel(r.treatmentType))}</b></div>
        <div><span class="small">Prazo vigente</span><br><b>${escapeHtml(r.treatmentDeadline?formatDateBR(r.treatmentDeadline):'—')}</b></div>
        <div><span class="small">Setor responsável</span><br><b>${escapeHtml(r.responsibleSector||'—')}</b></div>
        <div><span class="small">PDCA</span><br><b>${r.pdcaRequired===false?'Dispensado':'Obrigatório'}</b></div>
      </div>
    </div>`;
  overlay.classList.add('open');
  document.body.style.overflow='hidden';
}
function closeSacPreview(){
  const overlay=document.getElementById('sacPreviewOverlay');
  if(overlay)overlay.classList.remove('open');
  document.body.style.overflow='';
}
function printSacPreview(){
  const content=document.getElementById('sacPreviewContent');
  if(!content)return;
  const w=window.open('','_blank');
  if(!w){alert('O navegador bloqueou a janela de impressão.');return}
  w.document.open();
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Ficha SAC</title>
  <style>body{font-family:Arial,sans-serif;padding:24px;color:#17233b}table{width:100%;border-collapse:collapse}td{border:1px solid #d9e1e7;padding:8px}.card{border:1px solid #d9e1e7;border-radius:10px;padding:12px;margin-top:12px}.small{font-size:12px;color:#667085}.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}</style>
  
<style id="v96-65-my-sacs-view">
#mySacsView.hidden{display:none!important}
#mySacsView{overflow-x:hidden}
#mySacsView *{min-width:0}
@media(max-width:760px){
  #mySacsCards{grid-template-columns:1fr!important}
}
</style>

<style id="login-success-hardening">
body.nucleo-authenticated #loginOverlay{display:none!important;visibility:hidden!important;pointer-events:none!important}
</style>
</head><body>${content.innerHTML}</body></html>`);
  w.document.close();
  w.focus();
  setTimeout(()=>w.print(),250);
}

function refreshExternalTreatmentFields(){
  const type=document.getElementById('externalTreatmentType')?.value||'';
  const hasLabels=type==='label_rework'||type==='reclass_label_rework';
  const missing=type==='missing_items';
  const financial=type==='financial';
  document.getElementById('externalLabelFields')?.classList.toggle('hidden',!hasLabels);
  document.getElementById('externalMissingItemsFields')?.classList.toggle('hidden',!missing);
  document.getElementById('externalFinancialFields')?.classList.toggle('hidden',!financial);
  const receipt=document.getElementById('externalReceiptSigned')?.value||'pending';
  document.getElementById('externalDirectorDecisionField')?.classList.toggle('hidden',!(missing&&receipt==='no'));
}
function renderExternalTreatmentHistory(r){
  const box=document.getElementById('externalTreatmentHistoryText');
  if(!box)return;
  if(!r){box.textContent='Ainda não iniciada.';return}
  const parts=[];
  if(r.treatmentDefinedAt)parts.push('Definida em '+(formatDateTimeBR(r.treatmentDefinedAt)||r.treatmentDefinedAt));
  if(r.treatmentDeadline)parts.push('Prazo '+formatDateBR(r.treatmentDeadline));
  if(r.treatmentStartedAt)parts.push('Iniciada em '+(formatDateTimeBR(r.treatmentStartedAt)||r.treatmentStartedAt));
  if(r.treatmentCompletedAt)parts.push('Concluída em '+(formatDateTimeBR(r.treatmentCompletedAt)||r.treatmentCompletedAt));
  const deadlineHistory=formatSacDeadlineHistory(r);
  box.innerHTML=escapeHtml(parts.join(' · ')||'Ainda não iniciada.')+
    (deadlineHistory?'<div style="margin-top:8px;white-space:pre-line"><b>Histórico de prazos</b>\n'+escapeHtml(deadlineHistory)+'</div>':'');
}

function refreshExternalDeadlineReason(){
  const currentId=String(document.getElementById('externalRoControlId')?.value||'').trim();
  const existing=currentId?getExternalRoControls().find(x=>String(x.id)===currentId):null;
  const currentDeadline=String(document.getElementById('externalTreatmentDeadline')?.value||'').trim();
  const changed=!!existing && String(existing.treatmentDeadline||'')!==currentDeadline;
  const field=document.getElementById('externalDeadlineReasonField');
  if(field)field.classList.toggle('hidden',!changed);
  if(!changed){
    const reason=document.getElementById('externalDeadlineReason');
    if(reason)reason.value='';
  }
}
function formatSacDeadlineHistory(r){
  const history=Array.isArray(r?.deadlineHistory)?r.deadlineHistory:[];
  if(!history.length)return '';
  return history.map(h=>{
    const when=formatDateTimeBR(h.changedAt)||h.changedAt||'';
    const from=h.oldDeadline?formatDateBR(h.oldDeadline):'sem prazo';
    const to=h.newDeadline?formatDateBR(h.newDeadline):'sem prazo';
    const reason=h.reason?' · '+h.reason:'';
    return when+' — '+from+' → '+to+reason;
  }).join('\n');
}

function openRoFromSacControl(){
  const raw=String(document.getElementById('externalRoNumber')?.value||'').trim();
  if(!raw){
    alert('Nenhuma R.O. vinculada a este SAC.');
    return;
  }

  const normalizeRo=v=>{
    const s=String(v||'').trim();
    const digits=s.replace(/\D/g,'').replace(/^0+/,'');
    return digits||normalizeAnswer(s);
  };

  const wanted=normalizeRo(raw);
  const ro=getAllRoRecords().find(r=>
    normalizeRo(r?.numero||r?.id||r?.codigo||'')===wanted
  );

  if(!ro){
    alert('Não encontrei os dados da R.O. '+raw+'.');
    return;
  }

  openRoReport(String(ro.numero||ro.id||ro.codigo||'').trim());
}

function openExternalRoControlModal(id){
  if(!isAdmin())return;
  populateExternalRoSectorSelect();
  const list=getExternalRoControls();
  const r=id?list.find(x=>String(x.id)===String(id)):null;
  const set=(id2,v)=>{const el=document.getElementById(id2);if(el)el.value=v??''};
  set('externalRoControlId',r?.id||'');
  const viewFormBtn=document.getElementById('externalViewSacFormBtn');
  if(viewFormBtn)viewFormBtn.classList.toggle('hidden',!(r&&sacHasFilledForm(r)));
  const follow=document.getElementById('externalTreatmentFollowupSummary');
  if(follow){
    if(r && (r.treatmentStatus==='started'||r.treatmentStatus==='done')){
      follow.classList.remove('hidden');
      follow.innerHTML=`<b>Acompanhamento da tratativa</b>
        <div class="small" style="margin-top:5px">
          ${r.treatmentStatus==='started'?'Em execução':'Concluída'} ·
          Início: ${escapeHtml(r.treatmentStartedAt?(formatDateTimeBR(r.treatmentStartedAt)||r.treatmentStartedAt):'—')}
          ${r.treatmentCompletedAt?' · Conclusão: '+escapeHtml(formatDateTimeBR(r.treatmentCompletedAt)||r.treatmentCompletedAt):''}
        </div>`;
    }else{
      follow.classList.add('hidden');follow.innerHTML='';
    }
  }
  set('externalRoNumber',r?.ro||'');
  set('externalRoClient',r?.client||'');
  set('externalRoProduct',r?.product||'');
  set('externalRoOrder',r?.order||'');
  set('externalRoResponsibleSector',r?.responsibleSector||'');
  set('externalRoStatus',r?.status||'new');
  set('externalRoPdcaRequired','yes');
  set('externalRoPdcaDeadline',r?.pdcaDeadline||'');
  set('externalRoQualityNote',r?.qualityNote||'');
  set('externalTreatmentType',r?.treatmentType||'');
  set('externalTreatmentDeadline',r?.treatmentDeadline||'');
  set('externalDeadlineReason','');
  set('externalTreatmentStatus',r?.treatmentStatus||'defined');
  set('externalLabelPeople',r?.labelPeople||'undecided');
  set('externalTreatmentQty',r?.treatmentQty||'');
  set('externalReceiptSigned',r?.receiptSigned||'pending');
  set('externalDirectorDecision',r?.directorDecision||'pending');
  set('externalReplacementItem',r?.replacementItem||'');
  set('externalReplacementQty',r?.replacementQty||'');
  set('externalFinancialValue',r?.financialValue||'');
  set('externalFinancialReference',r?.financialReference||'');
  set('externalTreatmentDescription',r?.treatmentDescription||'');
  set('externalRoAdminNote',r?.adminNote||'');
  setOfficialSacFormData(r);
  document.getElementById('externalRoControlModalTitle').textContent=r
    ? (r.treatmentStatus==='started'?'Atualizar '+(r.ro||'SAC'):'Classificar '+(r.ro||'SAC'))
    : 'Classificar SAC';
  refreshExternalTreatmentFields();
  refreshExternalDeadlineReason();
  renderExternalTreatmentHistory(r);
  document.getElementById('externalRoControlModalOverlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeExternalRoControlModal(){
  document.getElementById('externalRoControlModalOverlay')?.classList.remove('open');
  document.body.style.overflow='';
}
function refreshExternalRoPdcaFields(){
  const required=document.getElementById('externalRoPdcaRequired')?.value==='yes';
  const f=document.getElementById('externalRoPdcaDeadlineField');
  if(f)f.style.display=required?'block':'none';
}
function saveExternalRoControl(){
  if(!nucleoFeatureRequire('sac','edit'))return;
  if(!isAdmin())return;
  const ro=String(document.getElementById('externalRoNumber')?.value||'').trim();
  const normRo=v=>String(v||'').replace(/\D/g,'').replace(/^0+/,'')||String(v||'').trim().toLowerCase();
  const baseRoRecord=getAllRoRecords().find(x=>normRo(x.numero||x.id||x.codigo||'')===normRo(ro));
  if(baseRoRecord && !(baseRoRecord.ehSac===true||String(baseRoRecord.origemBase||'')==='Externa')){
    alert('Esta R.O. pertence à aba Interna. O Controle de SAC aceita apenas R.O.s da aba Externa.');
    return;
  }
  const client=String(document.getElementById('externalRoClient')?.value||'').trim();
  const responsibleSector=String(document.getElementById('externalRoResponsibleSector')?.value||'').trim();
  const pdcaRequired=true;
  const qualityNote=String(document.getElementById('externalRoQualityNote')?.value||'').trim();
  const treatmentType=String(document.getElementById('externalTreatmentType')?.value||'').trim();
  const treatmentDeadline=String(document.getElementById('externalTreatmentDeadline')?.value||'').trim();
  const deadlineReason=String(document.getElementById('externalDeadlineReason')?.value||'').trim();

  if(!ro){alert('Informe o número da R.O.');return}
  if(!client){alert('Informe o cliente.');return}
  if(!treatmentType){alert('Selecione a tratativa definida pelo SGQ.');return}
  if(!treatmentDeadline){alert('Informe o prazo da tratativa.');return}
  if(!responsibleSector){alert('Selecione o setor responsável pelo PDCA.');return}

  const receiptSigned=String(document.getElementById('externalReceiptSigned')?.value||'pending');
  const directorDecision=String(document.getElementById('externalDirectorDecision')?.value||'pending');
  if(treatmentType==='missing_items'&&receiptSigned==='no'&&directorDecision==='pending'){
    if(!confirm('O canhoto está sem assinatura. A reposição depende da análise da Diretoria e continuará marcada como pendente. Deseja salvar assim mesmo?'))return;
  }

  let list=getExternalRoControls();
  const existingId=String(document.getElementById('externalRoControlId')?.value||'').trim();
  const existing=existingId?list.find(x=>String(x.id)===existingId):list.find(x=>String(x.ro)===ro);
  const id=existing?.id||('SAC-'+ro.replace(/\s+/g,'-')+'-'+Date.now());
  const now=new Date().toISOString();
  const treatmentStatus=String(document.getElementById('externalTreatmentStatus')?.value||'defined');
  const deadlineChanged=!!existing && String(existing.treatmentDeadline||'')!==treatmentDeadline;
  if(deadlineChanged && !deadlineReason){
    alert('Informe o motivo da atualização do prazo.');
    return;
  }
  const treatmentChanged=!existing || existing.treatmentType!==treatmentType;
  const deadlineHistory=Array.isArray(existing?.deadlineHistory)?existing.deadlineHistory.map(x=>({...x})):[];
  if(deadlineChanged){
    deadlineHistory.push({
      oldDeadline:existing.treatmentDeadline||'',
      newDeadline:treatmentDeadline,
      reason:deadlineReason,
      changedAt:now,
      changedBy:getSession()?.name||'SGQ'
    });
  }

  const record={
    ...(existing||{}),
    id,ro,client,
    product:String(document.getElementById('externalRoProduct')?.value||'').trim(),
    order:String(document.getElementById('externalRoOrder')?.value||'').trim(),
    responsibleSector,
    status:String(document.getElementById('externalRoStatus')?.value||'new'),
    pdcaRequired,
    pdcaDeadline:pdcaRequired?String(document.getElementById('externalRoPdcaDeadline')?.value||''):'',
    qualityNote,
    treatmentType,
    treatmentDeadline,
    deadlineHistory,
    treatmentStatus,
    treatmentDefinedAt:existing?.treatmentDefinedAt||now,
    labelPeople:String(document.getElementById('externalLabelPeople')?.value||'undecided'),
    treatmentQty:Number(document.getElementById('externalTreatmentQty')?.value||0),
    receiptSigned,
    directorDecision:treatmentType==='missing_items'&&receiptSigned==='no'?directorDecision:'',
    replacementItem:treatmentType==='missing_items'?String(document.getElementById('externalReplacementItem')?.value||'').trim():'',
    replacementQty:treatmentType==='missing_items'?Number(document.getElementById('externalReplacementQty')?.value||0):0,
    financialValue:treatmentType==='financial'?Number(document.getElementById('externalFinancialValue')?.value||0):0,
    financialReference:treatmentType==='financial'?String(document.getElementById('externalFinancialReference')?.value||'').trim():'',
    treatmentDescription:String(document.getElementById('externalTreatmentDescription')?.value||'').trim(),
    adminNote:String(document.getElementById('externalRoAdminNote')?.value||'').trim(),
    sourceRoOrigin:'Externa',
    sourceRoDate:(baseRoRecord?sacSourceDate(baseRoRecord):'')||sacDateKey(existing?.sourceRoDate||'')||'',
    sacDecision:'sac',
    sacCreatedAt:existing?.sacCreatedAt||now,
    autoLinked:!!baseRoRecord,
    officialForm:{...(existing?.officialForm||{}),...getOfficialSacFormData()},
    representative:String(document.getElementById('sacRepresentative')?.value||existing?.representative||'').trim(),
    createdAt:existing?.createdAt||now,
    updatedAt:now,
    updatedBy:getSession()?.name||'SGQ'
  };
  ensureSacReworkState(record);

  const treatmentDescriptionChanged=!!existing &&
    String(existing.treatmentDescription||'').trim()!==String(record.treatmentDescription||'').trim();

  if(treatmentDescriptionChanged){
    appendRepresentativeSacNotification(
      record,
      'Atualização do SAC '+ro,
      String(record.treatmentDescription||'').trim()
        ? 'O que está sendo feito foi atualizado: '+String(record.treatmentDescription).trim()
        : 'O andamento do SAC foi atualizado pelo SGQ.'
    );
  }

  if(isSacRework(record)&&!existing?.reworkStage&&!record.reworkHistory.length){
    record.reworkStage='Aguardando início';
    record.reworkHistory=[{from:'',to:'Aguardando início',note:'Retrabalho definido pelo SGQ.',changedAt:now,changedBy:getSession()?.name||'SGQ'}];
  }


  if(treatmentChanged){
    appendRepresentativeSacNotification(
      record,
      existing?'Encaminhamento do SAC atualizado':'Encaminhamento do SAC definido',
      'Tratativa: '+externalTreatmentLabel(treatmentType)+'. Prazo vigente: '+formatDateBR(treatmentDeadline)+'.'
    );
  }
  if(deadlineChanged){
    appendRepresentativeSacNotification(
      record,
      'Prazo do SAC atualizado',
      'Novo prazo: '+formatDateBR(treatmentDeadline)+'. Motivo: '+deadlineReason+'.'
    );
  }

  list=list.filter(x=>String(x.id)!==String(id));
  list.push(record);
  saveExternalRoControlsLocal(list);
  portalBackendSave('external_ro_controls',id,record);

  const baseRo=getAllRoRecords().find(r=>String(r.numero||r.id||r.codigo||'')===ro);
  if(baseRo){
    const map=getSavedTriageMap();
    const old=map.get(ro)||{};
    map.set(ro,{
      ...old,
      roKey:ro,
      decision:pdcaRequired?'directed':'record',
      classification:old.classification||'R.O. Externa / SAC',
      responsibleSector:pdcaRequired?responsibleSector:'',
      pdcaRequired,
      pdcaDeadline:pdcaRequired?record.pdcaDeadline:'',
      note:qualityNote,
      triagedAt:old.triagedAt||now,
      triagedBy:getSession()?.name||'SGQ',
      source:'external_sac'
    });
    localStorage.setItem(TRIAGE_KEY,JSON.stringify([...map.values()]));
    portalBackendSave('triage',ro,map.get(ro));

    if(pdcaRequired && (!existing || existing.pdcaRequired!==true || existing.responsibleSector!==responsibleSector)){
      createNotification({
        type:'ro',
        audience:'sector',
        sector:responsibleSector,
        ro,
        title:'SAC com PDCA obrigatório',
        message:'A Qualidade definiu que a R.O. '+ro+' exige PDCA. Consulte a ocorrência e responda dentro do prazo indicado.'
      });
    }
  }

  if(treatmentChanged){
    const extra=treatmentType==='missing_items'&&receiptSigned==='no'
      ? ' Como o canhoto está sem assinatura, a reposição depende da análise da Diretoria.'
      : '';
    externalComplainantNotification(
      record,
      existing?'Classificação e encaminhamento atualizada':'Classificação e encaminhamento definida',
      'A Qualidade '+(existing?'atualizou':'definiu')+' para a R.O. '+ro+': '+externalTreatmentLabel(treatmentType)+'. Prazo vigente: '+formatDateBR(treatmentDeadline)+'.'+extra
    );
  }

  if(deadlineChanged){
    externalComplainantNotification(
      record,
      'Prazo do SAC atualizado',
      'O prazo da tratativa da R.O. '+ro+' foi atualizado de '+formatDateBR(existing.treatmentDeadline)+' para '+formatDateBR(treatmentDeadline)+'. Motivo: '+deadlineReason+'.'
    );
  }

  closeExternalRoControlModal();
  renderExternalRoControl();
  refreshMenuNotificationBadges();
  alert('Controle de SAC salvo.');
}
function updateExternalTreatmentRecord(id,patch){
  let list=getExternalRoControls();
  const idx=list.findIndex(x=>String(x.id)===String(id));
  if(idx<0)return null;
  const record={...list[idx],...patch,updatedAt:new Date().toISOString(),updatedBy:getSession()?.name||'SGQ'};
  list[idx]=record;
  saveExternalRoControlsLocal(list);
  portalBackendSave('external_ro_controls',record.id,record);
  return record;
}
function startExternalTreatment(id){
  if(!isAdmin())return;
  const current=getExternalRoControls().find(x=>String(x.id)===String(id));
  if(!current)return;
  if(!sacIsClassified(current)){
    alert('Antes de iniciar, defina a classificação / tratativa, o setor responsável e o prazo vigente do SAC.');
    openExternalRoControlModal(id);
    return;
  }
  if(!confirm('Confirmar o início da tratativa da R.O. '+current.ro+'? O reclamante será notificado.'))return;
  const now=new Date().toISOString();
  const record=updateExternalTreatmentRecord(id,{
    treatmentStatus:'started',
    treatmentStartedAt:current.treatmentStartedAt||now,
    status:'treatment'
  });
  if(!record)return;
  appendRepresentativeSacNotification(
    record,
    'SAC '+record.ro+' em andamento',
    'A tratativa foi iniciada: '+externalTreatmentLabel(record.treatmentType)+'. Prazo vigente: '+formatDateBR(record.treatmentDeadline)+'.'
  );
  updateExternalTreatmentRecord(record.id,{representativeNotifications:record.representativeNotifications});
  externalComplainantNotification(
    record,
    'Classificação e encaminhamento iniciada',
    'A tratativa da R.O. '+record.ro+' foi iniciada: '+externalTreatmentLabel(record.treatmentType)+'. Prazo vigente: '+formatDateBR(record.treatmentDeadline)+'.'
  );
  renderExternalRoControl();
  refreshMenuNotificationBadges();
}
function finishExternalTreatment(id){
  if(!isAdmin())return;
  const current=getExternalRoControls().find(x=>String(x.id)===String(id));
  if(!current)return;
  if(!confirm('Confirmar a conclusão da tratativa da R.O. '+current.ro+'? O reclamante será notificado.'))return;
  const now=new Date().toISOString();
  const hasPdca=current.pdcaRequired && getAllSentPdcas().some(p=>String(p.ro||p.roId||'')===String(current.ro));
  const nextStatus=current.pdcaRequired&&!hasPdca?'waiting_pdca':'done';
  const record=updateExternalTreatmentRecord(id,{
    treatmentStatus:'done',
    treatmentCompletedAt:now,
    status:nextStatus
  });
  if(!record)return;
  appendRepresentativeSacNotification(
    record,
    'SAC '+record.ro+' concluído',
    nextStatus==='waiting_pdca'
      ? 'A tratativa foi concluída e o SAC aguarda o PDCA para encerramento.'
      : 'A tratativa do SAC foi concluída.'
  );
  updateExternalTreatmentRecord(record.id,{representativeNotifications:record.representativeNotifications});
  externalComplainantNotification(
    record,
    'Classificação e encaminhamento concluída',
    'A tratativa da R.O. '+record.ro+' foi concluída: '+externalTreatmentLabel(record.treatmentType)+'.'+(nextStatus==='waiting_pdca'?' O encerramento do SAC ainda aguarda o PDCA.':' O SAC está concluído.')
  );
  renderExternalRoControl();
  refreshMenuNotificationBadges();
}


const TRIAGE_KEY='ro-pdca-triage-v2';
const DELETED_TRIAGE_KEYS_KEY='nucleo-deleted-triage-keys-v1';
const HIDDEN_ASSIGNED_KEYS_KEY='nucleo-hidden-assigned-directions-v1';
try{localStorage.removeItem(DELETED_TRIAGE_KEYS_KEY)}catch(e){}
let currentTriageRoId='';
let currentEditingTriageKey='';

function getHiddenAssignedKeys(){
  try{return new Set(JSON.parse(localStorage.getItem(HIDDEN_ASSIGNED_KEYS_KEY)||'[]').map(String))}catch(e){return new Set()}
}
function saveHiddenAssignedKeys(set){
  try{localStorage.setItem(HIDDEN_ASSIGNED_KEYS_KEY,JSON.stringify([...set]))}catch(e){}
}


function roNumbersSameLegacy(a,b){
  const da=roDigits(a), db=roDigits(b);
  if(!da || !db || da!==db)return false;
  const oa=roOriginFromNumber(a,''), ob=roOriginFromNumber(b,'');
  return !oa || !ob || oa===ob;
}

function findRoByAnyNumber(value,originHint){
  const exact=String(value||'').trim();
  const rows=getAllRoRecords();
  let found=rows.find(r=>String(r.numero||r.id||r.codigo||'').trim()===exact);
  if(found)return found;
  const digits=roDigits(value);
  if(!digits)return null;
  const origin=roOriginFromNumber(value,originHint||'');
  const matches=rows.filter(r=>roDigits(r.numero||r.id||r.codigo)===digits &&
    (!origin || String(r.origemBase||'')===origin));
  return matches.length===1?matches[0]:null;
}

function triageBaseRoNumber(ro){
  return String(ro?.numero||ro?.id||ro?.codigo||'').trim();
}
function triageSectorPart(value){
  return String(value||'').trim().replace(/::/g,'-');
}
function triageCompositeKey(roNumber,sector){
  const base=String(roNumber||'').trim();
  const sec=triageSectorPart(sector);
  return sec ? `${base}::${sec}` : base;
}
function triageRoNumberPart(value){
  return String(value||'').trim().split('::')[0];
}
function triageDisplayRoNumber(value){
  // A parte após :: é uma chave técnica para diferenciar a mesma R.O. por setor.
  // Nunca deve aparecer na interface.
  return String(value||'').trim().split('::')[0];
}
function triageKeyOf(ro){
  const base=triageBaseRoNumber(ro);
  const explicit=String(ro?.__triageKey||ro?.triageKey||ro?.__triageRecord?.roKey||'').trim();
  if(explicit)return explicit;
  // Em telas com uma R.O. desdobrada por setor, __assignedSector é a identidade
  // daquele vínculo. Nunca volte ao setor original da planilha nesses casos,
  // senão uma ação (ex.: "Temos PDCA") cria uma segunda linha para a mesma R.O.
  const sector=String(ro?.__assignedSector||ro?.setorResponsavelPlanilha||ro?.raw?.__setorResponsavel||ro?.setor||'').trim();
  return sector ? triageCompositeKey(base,sector) : base;
}
function baseTriageSituation(ro){
  // Lê a FONTE ORIGINAL por todos os caminhos possíveis. Isso é importante porque
  // registros restaurados do IndexedDB/localStorage podem não carregar os campos
  // técnicos __setorResponsavel/__statusOperacional, embora ainda tenham Y/AD no raw.
  const raw=ro?.raw||{};
  const sector=String(
    ro?.setorResponsavelPlanilha ||
    raw?.__setorResponsavel ||
    raw?.['Setor (causa)'] ||
    raw?.['Setor causa'] ||
    raw?.['Setor Responsável'] ||
    raw?.['Setor responsável'] ||
    // `ro.setor` em R.O. importada é justamente Setor (causa); só entra como último fallback.
    ro?.setor ||
    ''
  ).trim();
  const sectorNorm=normalizeAnswer(sector);
  const hasSector=!!sector && !['nao direcionado','nao informado','sem setor','-'].includes(sectorNorm);

  // Status ORIGINAL da planilha. Não usar primeiro o rótulo visual de PDCA.
  const rawStatus=String(
    ro?.statusOperacional ||
    raw?.__statusOperacional ||
    raw?.['Status'] ||
    raw?.['Status R.O.'] ||
    raw?.['Status da R.O.'] ||
    // Compatibilidade final com snapshots antigos.
    ro?.status ||
    ''
  ).trim();
  const status=normalizeAnswer(rawStatus);

  // Regra única definida pelo SGQ:
  // Registro/Cancelada/Obsoleto independem de setor; somente Setor + Enviado = Triada.
  // Obsoleto é uma decisão terminal do SGQ: dispensa PDCA e NUNCA volta para a fila de triagem.
  if(status.includes('obsolet'))return {code:'obsolete',decision:'obsolete',sector,hasSector,rawStatus};
  if(status.includes('cancel'))return {code:'cancelled',decision:'cancelled',sector,hasSector,rawStatus};
  if(status.includes('registro')||status==='falta de caixa'||status==='falta de caixas')return {code:'record',decision:'record',sector,hasSector,rawStatus};
  if(hasSector && /\benviad[oa]s?\b/.test(status) && !/\b(?:não|nao)\s+enviad[oa]s?\b/.test(status))return {code:'directed',decision:'directed',sector,hasSector,rawStatus};
  return {code:'new',decision:'',sector,hasSector,rawStatus};
}

function getTriageRecordsForRoNumber(roNumber,map=getSavedTriageMap()){
  const base=String(roNumber||'').trim();
  return [...map.values()].filter(t=>String(t?.roNumber||String(t?.roKey||'').split('::')[0]||'').trim()===base);
}
function getTriageRecordForRoSector(roNumber,sector,map=getSavedTriageMap()){
  const composite=triageCompositeKey(roNumber,sector);
  return map.get(composite)||map.get(String(roNumber||'').trim())||null;
}

// Resolve a triagem real da R.O. sem confundir chave base com RO::Setor.
// Todas as telas que perguntam "já foi triada?" devem usar esta função.
function resolvedTriageForRo(ro,map=getSavedTriageMap()){
  if(!ro)return null;
  const base=String(triageBaseRoNumber(ro)||'').trim();
  const baseSituation=baseTriageSituation(ro);
  const manual=getTriageRecordsForRoNumber(base,map).filter(t=>t?.decision&&!t.importedFromSheet).sort((a,b)=>String(b.triagedAt||'').localeCompare(String(a.triagedAt||'')));
  const exactManual=map.get(String(triageKeyOf(ro)||''));
  if(manual.length&&manual[0].decision!=='directed')return manual[0];
  if(exactManual?.decision&&!exactManual.importedFromSheet)return exactManual;
  if(manual.length)return manual[0];

  // FONTE ÚNICA DA SITUAÇÃO DA R.O.: Setor (causa) + Status da planilha-base.
  // SGQ_TRIAGENS fornece os detalhes da triagem (pessoa, motivo, prazo, PDCA),
  // mas NÃO pode transformar Registro/Cancelada em triada nem fazer uma R.O.
  // voltar para "Necessita triar" quando a base diz setor + Enviado.
  if(baseSituation.decision){
    let saved=null;
    if(baseSituation.decision==='directed'){
      saved=getTriageRecordForRoSector(base,baseSituation.sector,map);
      if(saved && saved.decision && saved.decision!=='directed')saved=null;
    }else{
      saved=map.get(base)||getTriageRecordsForRoNumber(base,map).find(t=>t?.decision===baseSituation.decision)||null;
    }
    return {
      ...(saved||{}),
      roKey:baseSituation.decision==='directed' ? triageCompositeKey(base,baseSituation.sector) : base,
      roNumber:base,
      decision:baseSituation.decision,
      responsibleSector:baseSituation.decision==='directed'?baseSituation.sector:(saved?.decisionSector||saved?.responsibleSector||''),
      importedFromSheet:saved?.importedFromSheet??true,
      __synthetic:!saved,
      sourceStatus:baseSituation.rawStatus
    };
  }

  // Se a planilha ainda não refletiu a alteração, uma decisão MANUAL recém-salva
  // pelo SGQ continua válida para a interface e para o contador de triagem.
  // Registros puramente reconstruídos da planilha não ganham essa prioridade.
  const exact=String(triageKeyOf(ro)||'').trim();
  const saved=(exact&&map.get(exact))||map.get(base)||getTriageRecordsForRoNumber(base,map)[0]||null;

  if(saved?.decision && !saved?.importedFromSheet){
    return saved;
  }

  if(saved?.decision==='obsolete')return saved;
  return null;
}
function roNeedsTriage(ro,map=getSavedTriageMap()){
  const tri=resolvedTriageForRo(ro,map);
  return !String(tri?.decision||'').trim();
}

function getDeletedTriageKeys(){
  try{return new Set(JSON.parse(localStorage.getItem(DELETED_TRIAGE_KEYS_KEY)||'[]').map(String))}catch(e){return new Set()}
}
function saveDeletedTriageKeys(set){
  try{localStorage.setItem(DELETED_TRIAGE_KEYS_KEY,JSON.stringify([...set]))}catch(e){}
}

function getSavedTriageMap(){
  let map=new Map();
  try{
    const arr=JSON.parse(localStorage.getItem(TRIAGE_KEY)||'[]');
    if(Array.isArray(arr))map=new Map(arr.map(x=>[String(x.roKey||''),x]));
  }catch(e){map=new Map()}

  // "Importado da planilha" é origem do dado, não uma decisão/classificação SGQ.
  [...map.values()].forEach(tri=>{
    if(tri?.importedFromSheet && normalizeAnswer(tri.classification||'')==='importado da planilha'){
      tri.classification='';
    }
  });

  // Migra chaves antigas "RO-00000" somente quando há uma única origem possível.
  // Se Interna e Externa possuem o mesmo número, a chave antiga é ambígua e não
  // é aplicada a nenhuma das duas; cada origem será reconstruída pela planilha.
  try{
    const allRos=getAllRoRecords();
    const byDigits=new Map();
    allRos.forEach(r=>{
      const digits=roDigits(r.numero);
      if(!digits)return;
      const arr=byDigits.get(digits)||[];
      arr.push(r);
      byDigits.set(digits,arr);
    });

    [...map.entries()].forEach(([oldKey,tri])=>{
      if(/^RO-(?:IN|EX)-\d+$/i.test(oldKey))return;
      const digits=roDigits(oldKey);
      if(!digits)return;
      const candidates=byDigits.get(digits)||[];
      if(candidates.length===1){
        const newKey=String(candidates[0].numero||'');
        if(newKey && !map.has(newKey)){
          map.set(newKey,{...tri,roKey:newKey,migratedFromLegacyKey:oldKey});
        }
        map.delete(oldKey);
      }else if(candidates.length>1 && tri?.importedFromSheet){
        map.delete(oldKey);
      }
    });
  }catch(e){}

  // Remove registros automáticos antigos criados indevidamente como
  // "Não direcionado". Triagens feitas manualmente pelo SGQ são preservadas.
  [...map.entries()].forEach(([key,tri])=>{
    if(tri?.importedFromSheet){
      const sectorNorm=normalizeAnswer(tri.responsibleSector||'');
      if(!tri.responsibleSector || ['nao direcionado','nao informado','sem setor','-'].includes(sectorNorm)){
        map.delete(key);
      }
    }
  });

  // Reconstrói automaticamente a triagem das R.O.s que já possuem
  // Setor/Pessoa/Status preenchidos na planilha.
  // O registro salvo manualmente no Núcleo continua tendo prioridade.
  try{
    getAllRoRecords().forEach(ro=>{
      const key=triageKeyOf(ro);
      // Uma exclusão antiga de duplicata visual não pode transformar a R.O. em não triada.
      // Se a planilha ainda comprova setor/status, o direcionamento deve ser reconstruído.
      if(!key || map.has(key))return;

      const pessoa=String(ro.pessoaResponsavel||'').trim();
      const baseSituation=baseTriageSituation(ro);
      const setor=baseSituation.sector;
      const decision=baseSituation.decision;

      // Regras literais da coluna Status:
      // setor + Enviado = triada
      // setor/sem setor + Registro = para registro
      // setor/sem setor + Cancelada = cancelada
      // qualquer outro caso = necessita triar
      if(!decision)return;

      let responsibleUserEmail='';
      if(decision==='directed' && pessoa && normalizeAnswer(pessoa)!=='todo o setor'){
        const u=getOperationalUsers().find(user=>
          normalizeAnswer(user.name||'')===normalizeAnswer(pessoa) &&
          normalizeAnswer(user.sector||'')===normalizeAnswer(setor)
        );
        responsibleUserEmail=String(u?.email||'').trim().toLowerCase();
      }

      map.set(key,{
        roKey:key,
        decision,
        classification:'',
        responsibleSector:decision==='directed'?setor:'',
        responsibleUserEmail:decision==='directed'?responsibleUserEmail:'',
        responsibleUserName:decision==='directed'?(pessoa&&normalizeAnswer(pessoa)!=='todo o setor'?pessoa:''):'',
        pdcaRequired:decision==='directed',
        pdcaDeadline:'',
        criticality:'Média',
        note:'Triagem reconhecida automaticamente a partir da planilha.',
        triagedAt:ro.dataEnvioOperacional||'',
        triagedBy:'Planilha',
        importedFromSheet:true
      });
    });
  }catch(e){
    console.warn('Não foi possível reconstruir algumas triagens da planilha.',e);
  }

  return map;
}

function getTriageRecords(){
  const saved=getSavedTriageMap();
  return getAllRoRecords().map(ro=>{
    const tri=resolvedTriageForRo(ro,saved)||{};
    const baseSituation=baseTriageSituation(ro);

    // A planilha continua sendo a fonte principal quando já refletiu a decisão.
    // Enquanto a planilha ainda não atualizou, uma decisão MANUAL do SGQ
    // já salva no Núcleo também tira a R.O. da fila "A triar".
    let decision=tri.decision||baseSituation.decision;

    if(!decision && tri?.decision && !tri?.importedFromSheet){
      decision=tri.decision;
    }

    let triagemStatus='new';
    if(decision==='directed')triagemStatus='directed';
    if(decision==='record')triagemStatus='record';
    if(decision==='cancelled')triagemStatus='cancelled';
    if(decision==='obsolete')triagemStatus='obsolete';

    return {
      ...ro,
      triagem:tri,
      classificacaoSGQ:tri.classification||'',
      setorDirecionado:tri.responsibleSector||'',
      pdcaObrigatorio:decision==='directed'&&tri.pdcaRequired!==false,
      prazoPdca:tri.pdcaDeadline||'',
      triagemStatus
    };
  });
}


function getConfiguredSectorsForTriage(){
  // A triagem usa somente a lista oficial cadastrada pelo SGQ.
  // Valores históricos da planilha não criam setores automaticamente.
  return getConfiguredSectors()
    .slice()
    .sort((a,b)=>a.localeCompare(b,'pt-BR'));
}

function populateTriageSectors(){
  const sel=document.getElementById('triageSectorFilter');
  if(!sel)return;
  const sectors=getConfiguredSectorsForTriage();
  const current=sel.value||'all';
  sel.innerHTML='<option value="all">Todos os setores</option>'+
    sectors.map(s=>`<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
  if([...sel.options].some(o=>o.value===current))sel.value=current;
}

function populateTriageUnits(){
  const sel=document.getElementById('triageUnitFilter');
  if(!sel)return;

  const current=sel.value||'all';
  const units=[...new Set(
    getAllRoRecords()
      .map(r=>canonicalUnitName(r.unidade||''))
      .filter(v=>v && normalizeAnswer(v)!=='nao informada' && normalizeAnswer(v)!=='nao informado')
  )].sort((a,b)=>a.localeCompare(b,'pt-BR'));

  sel.innerHTML='<option value="all">Todas as unidades</option>'+
    units.map(u=>`<option value="${escapeHtml(u)}">${escapeHtml(u)}</option>`).join('');

  if([...sel.options].some(o=>o.value===current))sel.value=current;
}

function triageDecisionLabel(status){
  if(status==='directed')return 'Direcionar para tratativa';
  if(status==='record')return 'Somente para registro';
  if(status==='cancelled')return 'Cancelar R.O.';
  if(status==='obsolete')return 'Obsoleto';
  return 'Não analisada';
}

function triageStatusLabel(status){
  if(status==='directed')return 'Direcionada';
  if(status==='record')return 'Somente para registro';
  if(status==='cancelled')return 'Cancelada';
  if(status==='obsolete')return 'Obsoleta';
  return 'Aguardando triagem';
}

function triageStatusClass(status){
  if(status==='directed')return 'triage-status-directed';
  if(status==='record')return 'triage-status-record';
  if(status==='cancelled')return 'triage-status-cancelled';
  if(status==='obsolete')return 'triage-status-record';
  return 'triage-status-new';
}

function renderTriage(){
  try{refreshMenuNotificationBadges()}catch(e){}
  if(!isAdmin())return;
  const status=document.getElementById('triageStatusFilter')?.value||'all';
  const sector=document.getElementById('triageSectorFilter')?.value||'all';
  const origin=document.getElementById('triageOriginFilter')?.value||'all';
  const unit=document.getElementById('triageUnitFilter')?.value||'all';
  const q=normalizeAnswer(document.getElementById('triageSearch')?.value||'');

  let rows=getTriageRecords().filter(r=>{
    // Esta tela é exclusivamente a fila de trabalho da triagem.
    // Qualquer R.O. já decidida sai daqui e passa para R.O.s atribuídas.
    if(r.triagemStatus!=='new')return false;
    const sec=r.setorDirecionado||'';
    if(sector!=='all'&&sec!==sector)return false;
    const rowOrigin=String(r.origemBase||r.raw?.__origemBase||'').trim();
    if(origin!=='all'&&rowOrigin!==origin)return false;
    const rowUnit=String(r.unidade||'').trim();
    if(unit!=='all'&&!sameCanonicalUnit(rowUnit,unit))return false;
    if(q){
      const hay=normalizeAnswer([
        r.numero,r.id,r.codigo,r.cliente,r.assunto,r.tipo,r.tipoRO,r.descricao,
        r.classificacaoSGQ,r.setorDirecionado,r.origemBase,r.unidade
      ].join(' '));
      if(!hay.includes(q))return false;
    }
    return true;
  });

  const body=document.getElementById('triageBody');
  if(!body)return;

  body.innerHTML=rows.length?rows.map(r=>{
    const key=String(r.numero||r.id||r.codigo||'').trim();
    const origin=String(r.origemBase||r.raw?.__origemBase||'').trim();
    const pdca=r.triagemStatus==='directed'
      ? `<div class="pdca-requirement"><span class="pdca-requirement-label">PDCA obrigatório</span>${r.prazoPdca?`<span class="pdca-requirement-date"><span class="pdca-calendar">▣</span>${escapeHtml(formatDateBR(r.prazoPdca))}</span>`:''}</div>`
      : r.triagemStatus==='new'
        ? '<span class="status-badge">A definir</span>'
        : r.triagemStatus==='record'
          ? '<span class="status-badge answered">Dispensado</span>'
          : '<span class="status-badge">Não se aplica</span>';

    const decision=nucleoDecisionForRecord(r,r.triagem)?.label||triageDecisionLabel(r.triagemStatus);

    return `<tr>
      <td><b>${escapeHtml(triageDisplayRoNumber(key)||'-')}</b></td>
      <td>${escapeHtml(r.cliente||r.origem||'-')}</td>
      <td>${escapeHtml(r.tipoRO||r.assunto||r.tipo||'-')}</td>
      <td>${escapeHtml(decision)}</td>
      <td>${escapeHtml(r.triagem?.responsibleUserName ? (r.setorDirecionado+' · '+r.triagem.responsibleUserName) : (r.setorDirecionado||'-'))}</td>
      <td>${pdca}</td>
      <td><span style="background:${escapeHtml(nucleoDecisionForRecord(r,r.triagem)?.color||'#eef4ff')}" class="status-badge ${triageStatusClass(r.triagemStatus)}">${escapeHtml(triageStatusLabel(r.triagemStatus))}</span></td>
      <td>
        <div class="triage-actions">
          <button class="btn secondary" type="button" onclick="openRoReport('${escapeHtml(key)}')">Ver R.O.</button>
          <button class="btn ${r.triagemStatus==='new'?'primary':'secondary'}" type="button" onclick="openTriageRecord('${escapeHtml(key)}','${escapeHtml(origin)}')">${r.triagemStatus==='new'?'Triar':'Editar'}</button>
        </div>
      </td>
    </tr>`;
  }).join(''):`<tr><td colspan="8" style="text-align:center;color:#667085;padding:28px">Nenhuma R.O. real carregada. Sincronize com a planilha para carregar Interna e Externa.</td></tr>`;
}

function showTriage(){
  if(!nucleoFeatureRequire('ros','triage'))return;
  try{refreshMenuNotificationBadges()}catch(e){}
  if(!isAdmin()){showList();return}
  view('triageView');
  setNav('triage');
  populateTriageSectors();
  populateTriageUnits();
  renderTriage();
}


function activeOperationalUsers(){
  let contacts=[];try{contacts=JSON.parse(localStorage.getItem('nucleo-unit-contacts')||'[]');}catch(_){}
  return [...new Map(getOperationalUsers().concat(contacts).map(u=>[u.email||u.name,u])).values()].filter(u=>
    u &&
    !nucleoPersonPermissions(u).sgq &&
    u.approvalStatus!=='pending' &&
    u.approvalStatus!=='rejected' &&
    String(u.name||'').trim() &&
    String(u.email||'').trim()
  );
}
function usersBySector(sector){
  const wanted=normalizeAnswer(sector||'');
  return activeOperationalUsers()
    .filter(u=>{const ro=getAllRoRecords().find(r=>String(r.numero||r.id||r.codigo)===String(currentTriageRoId));const unit=ro?roUnit(ro):adminScopeUnit();return userHasUnitSector(u,unit,sector);})
    .sort((a,b)=>String(a.name||'').localeCompare(String(b.name||''),'pt-BR'));
}
function getTriageAssignmentsFromUi(){
  return [...document.querySelectorAll('#triageAssignments .triage-assignment-row')].map(row=>({
    sector:String(row.querySelector('.triage-assignment-sector')?.value||row.dataset.sector||'').trim(),
    originalSector:String(row.dataset.originalSector||'').trim(),
    responsibleUserEmail:String(row.querySelector('.triage-assignment-user')?.value||'').trim().toLowerCase(),
    reason:String(row.querySelector('.triage-assignment-reason')?.value||'').trim()
  })).filter(x=>x.sector);
}
function selectedTriageSectors(){
  return getTriageAssignmentsFromUi().map(x=>x.sector);
}
function triageAssignmentUserOptions(sector,selectedEmail=''){
  const users=usersBySector(sector);
  return '<option value="">Todo o setor</option>'+users.map(u=>`<option value="${escapeHtml(u.email)}" ${String(u.email||'').toLowerCase()===String(selectedEmail||'').toLowerCase()?'selected':''}>${escapeHtml(u.name)} · ${escapeHtml(u.email)}</option>`).join('');
}
function addTriageAssignment(sector='',selectedEmail='',reason='',originalSector=''){
  const picker=document.getElementById('triageSectorPicker');
  const chosen=String(sector||picker?.value||'').trim();
  if(!chosen)return;
  const box=document.getElementById('triageAssignments');
  if(!box)return;
  const existing=[...box.querySelectorAll('.triage-assignment-row')].find(r=>normalizeAnswer(r.dataset.sector||'')===normalizeAnswer(chosen));
  if(existing){
    existing.querySelector('.triage-assignment-user')?.focus();
    if(picker)picker.value='';
    return;
  }
  const row=document.createElement('div');
  row.className='triage-assignment-row';
  row.dataset.sector=chosen;
  row.dataset.originalSector=String(originalSector||chosen).trim();
  row.style.cssText='display:grid;grid-template-columns:minmax(140px,.7fr) minmax(200px,1fr) minmax(260px,1.35fr) auto;gap:8px;align-items:center;padding:8px 0;border-bottom:1px solid #edf1ef';
  const sectorList=(typeof getConfiguredSectors==='function'?getConfiguredSectors(explicitRecordUnit(ro)||explicitPortalUnit(document.getElementById('triageRoUnit')?.value)):[])
    .slice()
    .sort((a,b)=>String(a).localeCompare(String(b),'pt-BR'));
  const sectorOptions=sectorList.map(sec=>`<option value="${escapeHtml(sec)}" ${normalizeAnswer(sec)===normalizeAnswer(chosen)?'selected':''}>${escapeHtml(sec)}</option>`).join('');
  row.innerHTML=`<select class="triage-assignment-sector" aria-label="Setor responsável" style="font-weight:700">${sectorOptions}</select><select class="triage-assignment-user">${triageAssignmentUserOptions(chosen,selectedEmail)}</select><input class="triage-assignment-reason" value="${escapeHtml(reason||'')}" placeholder="Motivo deste setor *" aria-label="Motivo do direcionamento para ${escapeHtml(chosen)}"><button class="btn secondary" type="button" onclick="this.closest('.triage-assignment-row').remove()" style="padding:8px 10px">Remover</button>`;
  const sectorSelect=row.querySelector('.triage-assignment-sector');
  sectorSelect?.addEventListener('change',()=>{
    const next=String(sectorSelect.value||'').trim();
    if(!next)return;
    const duplicate=[...box.querySelectorAll('.triage-assignment-row')].some(other=>other!==row&&normalizeAnswer(other.dataset.sector||'')===normalizeAnswer(next));
    if(duplicate){
      alert('Este setor já foi adicionado para esta R.O.');
      sectorSelect.value=row.dataset.sector||chosen;
      return;
    }
    row.dataset.sector=next;
    const userSelect=row.querySelector('.triage-assignment-user');
    if(userSelect)userSelect.innerHTML=triageAssignmentUserOptions(next,'');
  });
  box.appendChild(row);
  if(picker)picker.value='';
}
function refreshTriageResponsibleUsers(){ /* compatibilidade: responsáveis agora são definidos por setor, na própria linha */ }

function userMatchesDirectedPerson(tri){
  const email=String(tri?.responsibleUserEmail||'').trim().toLowerCase();
  const name=normalizeAnswer(tri?.responsibleUserName||'');
  if(!email&&!name)return true;
  const s=getSession()||{};
  if(email && String(s.email||'').trim().toLowerCase()===email)return true;
  if(name && normalizeAnswer(s.name||'')===name)return true;
  return false;
}
function directedRecipientLabel(tri){
  if(!tri)return '';
  return tri.responsibleUserName
    ? `${tri.responsibleSector||''} · ${tri.responsibleUserName}`
    : (tri.responsibleSector||'');
}


function configuredRoUnits(){
  const units=[...new Set(
    getAllRoRecords()
      .map(r=>canonicalUnitName(r.unidade||''))
      .filter(v=>v && normalizeAnswer(v)!=='nao informada' && normalizeAnswer(v)!=='nao informado')
  )];
  // Garante as duas unidades operacionais principais mesmo se o período carregado não tiver registros de uma delas.
  ['Unidade São Bento do Sul','Unidade Linhares'].forEach(u=>{
    if(!units.some(x=>sameCanonicalUnit(x,u)))units.push(u);
  });
  return units.sort((a,b)=>a.localeCompare(b,'pt-BR'));
}

function populateTriageRoUnit(selectedUnit){
  const sel=document.getElementById('triageRoUnit');
  if(!sel)return;
  const canonical=canonicalUnitName(selectedUnit||'');
  const units=configuredRoUnits();
  sel.innerHTML=units.map(u=>`<option value="${escapeHtml(u)}">${escapeHtml(u)}</option>`).join('');
  const match=units.find(u=>sameCanonicalUnit(u,canonical));
  if(match)sel.value=match;
}

function updateRoUnitLocal(roKey,newUnit){
  const target=getAllRoRecords().find(r=>triageKeyOf(r)===String(roKey||'').trim());
  if(!target)return false;
  const canonical=canonicalUnitName(newUnit);
  target.unidade=canonical;
  if(target.raw && typeof target.raw==='object')target.raw.__unidade=canonical;

  const internas=getAllRoRecords().filter(r=>String(r.origemBase||r.raw?.__origemBase||'')==='Interna');
  const externas=getAllRoRecords().filter(r=>String(r.origemBase||r.raw?.__origemBase||'')==='Externa');
  saveImportedRosByOrigin(internas,externas);
  return true;
}

function openTriageRecord(id,originHint=''){
  if(!nucleoFeatureRequire('ros','triage'))return;
  try{hideNucleoLoading(true)}catch(e){}

  const wanted=String(id||'').trim();
  const base=triageRoNumberPart(wanted)||String(wanted).split('::')[0];
  const origin=String(originHint||roOriginFromNumber(base,'')||'').trim();

  // Primeiro usa o resolvedor robusto já existente no portal.
  let ro=findRoByAnyNumber(base,origin);

  // Fallback: procura na mesma coleção usada para montar a própria fila.
  if(!ro){
    ro=getTriageRecords().find(r=>{
      const num=String(r?.numero||r?.id||r?.codigo||'').trim();
      const org=String(r?.origemBase||r?.raw?.__origemBase||'').trim();
      return num===base && (!origin || org===origin);
    })||null;
  }

  // Último fallback: mesma numeração + mesma origem.
  if(!ro){
    const digits=roDigits(base);
    ro=getAllRoRecords().find(r=>
      roDigits(r?.numero||r?.id||r?.codigo||'')===digits &&
      (!origin || String(r?.origemBase||r?.raw?.__origemBase||'')===origin)
    )||null;
  }

  if(!ro){
    alert(
      'Não consegui localizar os dados da R.O. '+base+'.\\n\\n'+
      'A lista será atualizada. Depois tente clicar em Triar novamente.'
    );
    syncImportedRosFromConfiguredSources({silent:true,force:true})
      .then(()=>{try{renderTriage()}catch(e){}})
      .catch(()=>{});
    return;
  }

  const roNumber=String(ro.numero||ro.id||ro.codigo||base).trim();

  currentTriageRoId=roNumber;
  // Só é edição por vínculo quando a chamada realmente veio de uma chave RO::SETOR.
  currentEditingTriageKey=wanted.includes('::')?wanted:'';

  const overlay=document.getElementById('triageModalOverlay');
  if(!overlay){
    alert('A janela de triagem não foi encontrada na página.');
    return;
  }

  // Limpa qualquer bloqueio residual.
  overlay.removeAttribute('inert');
  overlay.style.pointerEvents='auto';
  overlay.classList.add('open');
  document.body.style.overflow='hidden';

  overlay.querySelectorAll('input,textarea,select,button').forEach(el=>{
    el.style.pointerEvents='auto';
    if(el.type!=='hidden'){
      try{el.disabled=false}catch(e){}
      try{el.readOnly=false}catch(e){}
      el.removeAttribute('aria-disabled');
    }
  });

  try{
    const savedMap=getSavedTriageMap();
    const tri=
      savedMap.get(wanted)||
      savedMap.get(roNumber)||
      getTriageRecordsForRoNumber(roNumber,savedMap)[0]||
      {};

    const raw=ro.raw||{};
    const value=(...vals)=>{
      for(const v of vals){
        if(v!==undefined&&v!==null&&String(v).trim()!=='')return String(v).trim();
      }
      return '';
    };

    const summary=document.getElementById('triageRoSummary');
    if(summary){
      summary.innerHTML=[
        ['R.O.',roNumber],
        ['Unidade',value(ro.unidade,raw.__unidade,'-')],
        ['Cliente',value(ro.cliente,raw.Cliente,raw['Nome do cliente'],'Não informado')],
        ['Tipo de ocorrência',value(ro.tipoRO,ro.assunto,ro.tipo,raw['Tipo de ocorrência'],raw['Tipo de ocorrencia'],'-')],
        ['Setor identificado',value(ro.setorIdentificado,raw['Setor identificado'],raw['Setor'],'-')],
        ['Setor causa da planilha',value(ro.setorResponsavelPlanilha,raw.__setorResponsavel,ro.setor,'-')]
      ].map(([k,v])=>`<div class="triage-summary-item"><span>${escapeHtml(k)}</span><b>${escapeHtml(v)}</b></div>`).join('');
    }

    const decisionEl=document.getElementById('triageDecision');
    if(decisionEl)nucleoPopulateDecisions(ro,tri);

    const classificationEl=document.getElementById('triageClassification');
    if(classificationEl)nucleoLoadClassification(tri,ro);

    populateTriageRoUnit(value(ro.unidade,raw.__unidade,''));

    const sectors=(typeof getConfiguredSectors==='function'?getConfiguredSectors():[])
      .slice()
      .sort((a,b)=>String(a).localeCompare(String(b),'pt-BR'));
    const picker=document.getElementById('triageSectorPicker');
    if(picker){
      picker.innerHTML='<option value="">Selecione um setor...</option>'+
        sectors.map(sec=>`<option value="${escapeHtml(sec)}">${escapeHtml(sec)}</option>`).join('');
    }

    const decisionSector=document.getElementById('triageDecisionSector');
    if(decisionSector){const chosen=tri.decisionSector||tri.responsibleSector||ro.setorResponsavelPlanilha||ro.setor||'';const options=[...new Set(sectors.concat(chosen?[chosen]:[]))];decisionSector.innerHTML='<option value="">Sem setor atribuído</option>'+options.map(sec=>'<option value="'+escapeHtml(sec)+'">'+escapeHtml(sec)+'</option>').join('');decisionSector.value=chosen;}

    const assignmentsBox=document.getElementById('triageAssignments');
    if(assignmentsBox)assignmentsBox.innerHTML='';

    const existingForRo=getTriageRecordsForRoNumber(roNumber,savedMap);
    const targetedAssignment=currentEditingTriageKey
      ? (savedMap.get(currentEditingTriageKey)||tri)
      : null;

    const existingAssignments=targetedAssignment?.responsibleSector
      ? [targetedAssignment]
      : (existingForRo.length?existingForRo:(tri.responsibleSector?[tri]:[]));

    existingAssignments.forEach(x=>
      addTriageAssignment(
        x.responsibleSector,
        x.responsibleUserEmail||'',
        x.assignmentReason||x.reason||'',
        x.responsibleSector
      )
    );

    const noteEl=document.getElementById('triageNote');
    if(noteEl)noteEl.value=tri.note||'';

    updateTriageDecisionUi();
    nucleoAiPanel(ro,tri);

    setTimeout(()=>{
      try{renderTriageDuplicateWarning(ro)}catch(e){}
    },0);

  }catch(err){
    console.error('[NUCLEO TRIAGEM] falha ao preencher modal',err);
    const note=document.getElementById('triageNote');
    if(note&&!note.value){
      note.placeholder='Alguns dados auxiliares não carregaram, mas você pode preencher e salvar a triagem normalmente.';
    }
  }
}

function updateTriageDecisionUi(){
  const rule=nucleoSelectedDecision();const decision=rule.behavior;
  const sectorField=document.getElementById('triageSectorField');
  const title=document.getElementById('triagePdcaRuleTitle');
  const text=document.getElementById('triagePdcaRuleText');
  const noteLabel=document.getElementById('triageNoteLabel');
  const note=document.getElementById('triageNote');

  const directed=decision==='directed';
  const unitCorrection=decision==='unit_correction';
  const motiveRequired=rule.requireReason===true;
  if(noteLabel)noteLabel.textContent=unitCorrection?'Observação da correção':(motiveRequired?'Motivo *':'Observação da triagem');
  if(note)note.placeholder=unitCorrection?'Opcional: informe por que a unidade foi corrigida.':(motiveRequired?'Informe obrigatoriamente o motivo desta decisão.':'Informações do SGQ sobre a classificação, direcionamento ou decisão tomada.');
  sectorField.style.display=directed?'block':'none';
  const decisionSectorField=document.getElementById('triageDecisionSectorField');if(decisionSectorField)decisionSectorField.style.display=['record','cancelled','obsolete'].includes(decision)?'block':'none';

  if(unitCorrection){
    title.textContent='Somente correção cadastral';
    text.textContent='Será alterada apenas a Unidade da R.O. na planilha de origem. A decisão, o setor, o Status e o PDCA permanecerão inalterados.';
  }else if(directed){
    title.textContent=rule.pdcaRequired?'PDCA obrigatório':'PDCA dispensado';
    text.textContent='Escolha o setor e, se necessário, uma pessoa específica. Sem pessoa selecionada, todos os usuários cadastrados no setor recebem a R.O.';
  }else if(decision==='record'){
    title.textContent='PDCA dispensado';
    text.textContent='R.O. marcada como “Somente para registro”. Não será exigido PDCA.';
  }else if(decision==='cancelled'){
    title.textContent='PDCA dispensado';
    text.textContent='R.O. cancelada pelo SGQ. O motivo é obrigatório e não será exigido PDCA.';
  }else{
    title.textContent='PDCA dispensado';
    text.textContent='R.O. marcada como obsoleta pelo SGQ. O motivo é obrigatório e não será exigido PDCA.';
  }
}

function closeTriageModal(){
  const el=document.getElementById('triageModalOverlay');
  if(el)el.classList.remove('open');
  document.body.style.overflow='';
  currentTriageRoId='';
  currentEditingTriageKey='';
}

function nextTuesdayIsoDate(fromDate=new Date()){
  const d=new Date(fromDate.getFullYear(),fromDate.getMonth(),fromDate.getDate());
  const days=(2-d.getDay()+7)%7 || 7;
  d.setDate(d.getDate()+days);
  const y=d.getFullYear();
  const m=String(d.getMonth()+1).padStart(2,'0');
  const day=String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}


function applyTriageDecisionLocal(roNumber,decision,savedRecords,roUnitValue){
  const base=String(roNumber||'').trim();
  if(!base)return;

  const target=getAllRoRecords().find(r=>
    String(triageBaseRoNumber(r)||'').trim()===base ||
    String(r?.numero||r?.id||r?.codigo||'').trim()===base
  );
  if(!target)return;

  const first=(savedRecords||[])[0]||{};
  const directed=decision==='directed';
  const sector=directed?String(first.responsibleSector||'').trim():'';
  const person=directed?String(first.responsibleUserName||'Todo o setor').trim():'';

  const status=
    decision==='directed' ? 'Enviado' :
    decision==='record' ? (first.decisionId==='falta_caixa'?'Falta de caixa':'Registro') :
    decision==='obsolete' ? 'Obsoleto' :
    decision==='cancelled' ? 'Cancelada' : '';

  if(roUnitValue){
    target.unidade=canonicalUnitName(roUnitValue);
  }

  target.setorResponsavelPlanilha=sector;
  target.pessoaResponsavel=person;
  target.statusOperacional=status;
  target.status=status;

  // `ro.setor` também é fallback da lógica de triagem em snapshots antigos.
  if(directed)target.setor=sector;

  if(target.raw&&typeof target.raw==='object'){
    target.raw.__unidade=target.unidade||'';
    target.raw.__setorResponsavel=sector;
    target.raw.__pessoaResponsavel=person;
    target.raw.__statusOperacional=status;
  }

  // Persiste imediatamente no cache importado para o contador não voltar
  // ao renderizar a tela antes da próxima sincronização da planilha.
  try{
    const all=getAllRoRecords();
    const internas=all.filter(r=>String(r.origemBase||r.raw?.__origemBase||'')==='Interna');
    const externas=all.filter(r=>String(r.origemBase||r.raw?.__origemBase||'')==='Externa');
    saveImportedRosByOrigin(internas,externas);
  }catch(e){
    console.warn('[NUCLEO TRIAGEM] não foi possível persistir o status local imediatamente',e);
  }
}

let nucleoTriageSaving=false;
async function saveTriageRecord(){
  if(nucleoTriageSaving)return;
  if(!nucleoFeatureRequire('ros','triage'))return;
  const key=currentTriageRoId;
  if(!key){
    alert('Nenhuma R.O. foi selecionada para triagem.');
    return;
  }

  nucleoTriageSaving=true;
  try{

  const decisionRule=nucleoSelectedDecision();const decision=decisionRule.behavior;
  const classificationData=nucleoReadClassification();
  if(!classificationData)return;
  const classification=classificationData.labels.join(' / ');
  const roUnitValue=canonicalUnitName(document.getElementById('triageRoUnit')?.value||'');
  const assignments=getTriageAssignmentsFromUi();
  const responsibleSectors=assignments.map(x=>x.sector);
  const responsibleSector=responsibleSectors[0]||'';
  const pdcaDeadline=decisionRule.pdcaRequired?nucleoDecisionDeadline(decisionRule):'';
  const criticality='Média';
  const note=document.getElementById('triageNote').value.trim();
  const decisionSector=['record','cancelled','obsolete'].includes(decision)?String(document.getElementById('triageDecisionSector')?.value||'').trim():'';

  if(!roUnitValue){
    alert('Selecione a unidade da R.O.');
    return;
  }
  if(decision==='directed'&&!responsibleSectors.length){
    alert('Selecione pelo menos um setor responsável pela tratativa.');
    return;
  }
  if(decision==='directed'&&decisionRule.requireReason&&assignments.some(x=>!String(x.reason||'').trim())){
    alert('Informe o motivo do direcionamento para cada setor adicionado.');
    document.querySelector('.triage-assignment-reason:placeholder-shown')?.focus();
    return;
  }
  if(decisionRule.requireSector&&decision!=='directed'&&!decisionSector){alert('Selecione o setor responsável pela ocorrência.');return;}
  if(decisionRule.requireReason&&decision!=='directed'&&!note){
    alert('Informe o motivo desta decisão.');
    document.getElementById('triageNote')?.focus();
    return;
  }

  await showNucleoLoading('Salvando triagem e processando ações...','Processando');

  // Correção de unidade NÃO é uma decisão de triagem. Ela existe para o SGQ
  // corrigir um cadastro de outra unidade (ex.: Linhares) sem assumir a decisão.
  // Portanto não cria/edita SGQ_TRIAGENS, não altera setor, Status, PDCA ou decisão.
  if(decision==='unit_correction'){
    if(!portalBackendEnabled())throw new Error('Apps Script não configurado.');
    updateNucleoLoading('Corrigindo somente a unidade da R.O. na planilha...','Processando');
    await portalUpdateRoSheetConfirmed(String(key).split('::')[0],{unidade:roUnitValue});
    updateRoUnitLocal(key,roUnitValue);
    try{
      updateNucleoLoading('Relendo a R.O. após a correção...','Processando');
      await syncImportedRosFromConfiguredSources({silent:true,force:true});
    }catch(syncErr){
      console.warn('[NUCLEO TRIAGEM] unidade corrigida, mas a releitura imediata falhou',syncErr);
    }
    closeTriageModal();
    populateTriageUnits();
    renderTriage();
    try{render()}catch(e){}
    try{refreshRoSummary()}catch(e){}
    hideNucleoLoading(true);
    alert('Unidade corrigida. Nenhuma decisão de triagem, setor, Status ou PDCA foi alterado.');
    return;
  }

  const map=getSavedTriageMap();
  const roNumber=String(key).split('::')[0];
  const allPreviousRecords=getTriageRecordsForRoNumber(roNumber,map).slice();
  // Pelo lápis, altera somente o direcionamento clicado. Nunca apaga os outros
  // setores da mesma R.O. Na triagem completa, a seleção atual continua sendo
  // a fonte de verdade para todos os direcionamentos.
  const previousRecords=currentEditingTriageKey&&decision==='directed'
    ? allPreviousRecords.filter(x=>String(x.roKey||'')===String(currentEditingTriageKey))
    : allPreviousRecords;
  previousRecords.forEach(old=>map.delete(String(old.roKey||'')));
  const targetSectors=decision==='directed'?responsibleSectors:[''];
  const savedRecords=[];
  for(const sec of targetSectors){
    const assignment=assignments.find(x=>normalizeAnswer(x.sector)===normalizeAnswer(sec))||{};
    const assignmentEmail=String(assignment.responsibleUserEmail||'').trim().toLowerCase();
    const assignmentUser=assignmentEmail?getOperationalUsers().find(u=>String(u.email||'').trim().toLowerCase()===assignmentEmail):null;
    const recordKey=decision==='directed'?triageCompositeKey(roNumber,sec):roNumber;
    const record={
      roKey:recordKey,roNumber,
      unidade:roUnitValue,unit:roUnitValue,roUnit:roUnitValue,
      decision,decisionId:decisionRule.id,decisionLabel:decisionRule.label,decisionRule:{...decisionRule},classification,classificationMs:classificationData.ms,classificationOther:classificationData.other,
      responsibleSector:decision==='directed'?sec:decisionSector,
      decisionSector,
      responsibleUserEmail:decision==='directed'?assignmentEmail:'',
      responsibleUserName:decision==='directed'?(assignmentUser?.name||''):'',
      assignmentReason:decision==='directed'?String(assignment.reason||'').trim():'',
      previousResponsibleSector:decision==='directed'?String(assignment.originalSector||sec).trim():'',
      pdcaRequired:decisionRule.pdcaRequired,pdcaDeadline:decisionRule.pdcaRequired?pdcaDeadline:'',criticality,note,
      scoreAssessment:nucleoAiScoreState?.assessment?.confirmed?JSON.parse(JSON.stringify(nucleoAiScoreState.assessment)):null,
      triagedAt:new Date().toISOString(),triagedBy:getSession()?.name||'SGQ'
    };
    map.set(recordKey,record);savedRecords.push(record);
  }

  // A decisão fica registrada localmente IMEDIATAMENTE.
  // Assim a R.O. deixa de contar como "A triar" assim que o SGQ salva.
  localStorage.setItem(TRIAGE_KEY,JSON.stringify([...map.values()]));
  applyTriageDecisionLocal(roNumber,decision,savedRecords,roUnitValue);

  try{renderTriage()}catch(e){}
  try{refreshRoSummary()}catch(e){}
  try{refreshMenuNotificationBadges()}catch(e){}

  const syncWarnings=[];let centralTriageSaved=true;

  // Depois sincroniza com a planilha/base central.
  // Se a planilha estiver lenta/indisponível, a decisão local continua válida
  // e o usuário recebe um AVISO, não fica preso no carregamento.
  for(const record of savedRecords){
    if(portalBackendEnabled()){
      updateNucleoLoading('Atualizando a linha de '+(record.responsibleSector||roNumber)+' na planilha...','Processando');

      try{
        await Promise.race([
          portalUpdateRoSheetConfirmed(roNumber,{
            unidade:roUnitValue,
            setor:record.responsibleSector||'',
            setorAnterior:record.previousResponsibleSector||record.responsibleSector||'',
            pessoa:decision==='directed'?(record.responsibleUserName||'Todo o setor'):'',
            status:decision==='directed'?'Enviado':decision==='record'?(decisionRule.id==='falta_caixa'?'Falta de caixa':'Registro'):decision==='obsolete'?'Obsoleto':'Cancelada'
          }),
          new Promise((_,reject)=>setTimeout(()=>reject(new Error('Tempo excedido ao atualizar a planilha.')),18000))
        ]);
      }catch(syncErr){
        console.warn('[NUCLEO TRIAGEM] decisão salva localmente, mas planilha não confirmou',syncErr);
        syncWarnings.push(
          'A planilha não confirmou a atualização: '+
          String(syncErr?.message||syncErr||'erro não informado')
        );
      }

      try{await portalBackendSaveConfirmed('triage',record.roKey,record);}catch(error){centralTriageSaved=false;syncWarnings.push('A base central não confirmou a classificação e o setor: '+error.message);}

      const deletedKeys=getDeletedTriageKeys();
      if(deletedKeys.delete(String(record.roKey||'')))saveDeletedTriageKeys(deletedKeys);
    }
  }

  // Se um setor foi alterado pelo lápis, a chave antiga (RO::setor-antigo)
  // também precisa sair da base central. Caso contrário o próximo portal_load
  // traz o direcionamento antigo de volta e a tela parece "se desatualizar".
  const newKeys=new Set(savedRecords.map(r=>String(r.roKey||'')));
  const obsoleteKeys=previousRecords
    .map(r=>String(r.roKey||''))
    .filter(oldKey=>oldKey && !newKeys.has(oldKey));
  for(const oldKey of obsoleteKeys){
    if(portalBackendEnabled()){
      updateNucleoLoading('Removendo o direcionamento anterior da base central...','Processando');
      if(!centralTriageSaved)continue;
      try{await nucleoDeleteTriageConfirmed(oldKey);const deletedKeys=getDeletedTriageKeys();deletedKeys.add(String(oldKey));saveDeletedTriageKeys(deletedKeys);}
      catch(error){syncWarnings.push('A base central não confirmou a remoção do direcionamento anterior: '+error.message);}
    }
  }

  localStorage.setItem(TRIAGE_KEY,JSON.stringify([...map.values()]));

  updateRoUnitLocal(key,roUnitValue);

  // A interface já foi atualizada localmente. A releitura completa da planilha
  // acontece em segundo plano e não mantém o usuário preso no carregamento.
  setTimeout(()=>{
    syncImportedRosFromConfiguredSources({silent:true,force:true})
      .then(()=>{
        try{renderTriage()}catch(e){}
        try{refreshRoSummary()}catch(e){}
        try{refreshMenuNotificationBadges()}catch(e){}
      })
      .catch(syncErr=>console.warn('[NUCLEO TRIAGEM] releitura em segundo plano falhou',syncErr));
  },300);

  closeTriageModal();
  populateTriageSectors();
  populateTriageUnits();
  renderTriage();

  const roListView=document.getElementById('roListView');
  if(roListView && !roListView.classList.contains('hidden')){
    try{render()}catch(e){}
  }
  try{refreshRoSummary()}catch(e){}

  const indicatorView=document.getElementById('sgqIndicatorsView');
  if(indicatorView && !indicatorView.classList.contains('hidden')){
    try{renderSgqIndicators()}catch(e){}
  }

  if(decision==='directed'){
    const triageRo=getAllRoRecords().find(r=>String(r.numero||r.id||r.codigo||'').split('::')[0]===roNumber)||{};
    const emailErrors=[];
    let totalSent=0;
    try{
      updateNucleoLoading('Enviando os e-mails por setor…','Processando');
      const result=await portalJsonp({acao:'portal_send_directed_ro_email',ro:roNumber,setor:savedRecords[0]?.responsibleSector||'',unidade:roUnitValue||triageRo.unidade||'',tipoRO:triageRo.tipoRO||triageRo.tipo||'',cliente:triageRo.cliente||'',registrante:triageRo.registrante||'',assignments:JSON.stringify(savedRecords.map(record=>({sector:record.responsibleSector,email:record.responsibleUserEmail||'',reason:'Motivo do direcionamento: '+(record.assignmentReason||'Não informado')+'. É necessário analisar a ocorrência e responder o PDCA.'})))},90000);
      if(!Array.isArray(result?.results))throw new Error(result?.erro||'Atualize a implantação do Apps Script para a revisão 55.');
      totalSent=result.results.filter(r=>r.sucesso).length;
      result.results.filter(r=>!r.sucesso).forEach(r=>emailErrors.push(r.sector+': '+r.erro));
    }catch(err){emailErrors.push(err.message||String(err));}
    for(const record of savedRecords){
      const sec=record.responsibleSector,email=record.responsibleUserEmail||'';
      createNotification({type:'ro',skipEmail:true,audience:email?'user':'sector',userKey:email,sector:sec,ro:roNumber,unidade:roUnitValue||triageRo.unidade||'',title:'R.O. direcionada para tratativa',message:'A '+roNumber+' foi direcionada para '+sec+'. Motivo: '+(record.assignmentReason||'Não informado')+'.'});
      notifyManagersOfDirectedRo(roNumber,sec,{...triageRo,unidade:roUnitValue||triageRo.unidade},record.responsibleUserName);
    }
    try{await refreshEmailHistory()}catch(_){ }

    hideNucleoLoading(true);

    const avisos=[...syncWarnings];
    if(emailErrors.length)avisos.push('Falha em alguns e-mails: '+emailErrors.join(' | '));

    alert(
      'Triagem concluída com sucesso. '+savedRecords.length+' setor(es) direcionado(s) e '+totalSent+' e-mail(s) enviado(s).'+
      (avisos.length?'\n\nAviso: '+avisos.join(' | '):'')
    );
  }else{
    hideNucleoLoading(true);

    const decisionLabel=decisionRule.label||triageDecisionLabel(decision);

    alert(
      'Triagem concluída com sucesso.\n\n'+
      roNumber+' — '+decisionLabel+
      (note?'\nMotivo: '+note:'')+
      (syncWarnings.length?'\n\nAviso: '+syncWarnings.join(' | '):'')
    );
  }
  } catch(err) {
    console.error('[NUCLEO TRIAGEM] falha ao concluir triagem',err);
    hideNucleoLoading(true);

    alert(
      'Não foi possível concluir toda a sincronização da triagem.\n\n'+
      String(err?.message||err||'Falha desconhecida.')+
      '\n\nA decisão já foi mantida localmente para não continuar aparecendo como “A triar”.'
    );

    try{renderTriage()}catch(e){}
    try{refreshRoSummary()}catch(e){}
    try{refreshMenuNotificationBadges()}catch(e){}
  } finally {
    nucleoTriageSaving=false;
    hideNucleoLoading(true);
  }
}

function formatDateBR(value){
  if(!value)return '';
  const p=String(value).split('-');
  return p.length===3?`${p[2]}/${p[1]}/${p[0]}`:value;
}



const OFFLINE_QUEUE_KEY='portal-sgq-offline-sync-v1';

function tokenizeForSimilarity(v){
  // Similaridade de reincidência deve comparar o PROBLEMA, não metadados.
  // Termos administrativos/contextuais e verbos genéricos não podem criar uma falsa reincidência.
  const stop=new Set([
    'de','da','do','das','dos','e','em','para','por','com','um','uma','o','a','os','as','no','na','nos','nas','que','foi','ser','tem','ao','aos','se','sua','seu','suas','seus',
    'cliente','producao','produto','operador','empresa','setor','ocorrencia','problema','registrada','registrado','informacao','informado','informada','necessario','necessaria','durante','devido','conforme','este','esta','esse','essa','tipo','peca','pecas','processo',
    'falta','erro','falha','incorreto','incorreta','incorretos','incorretas'
  ]);
  const stem=(x)=>{
    x=normalizeAnswer(x||'').replace(/[^a-z0-9]/g,'');
    // pequenas normalizações úteis para descrições industriais em português
    const map={
      medidas:'medida',dimensoes:'dimensao',dimensional:'dimensao',dimensionais:'dimensao',comprimentos:'comprimento',larguras:'largura',alturas:'altura',
      chapas:'chapa',caixas:'caixa',cliches:'cliche',etiquetas:'etiqueta',fitas:'fita',colas:'cola',pedidos:'pedido',lotes:'lote',itens:'item',
      atrasando:'atraso',atrasada:'atraso',atrasado:'atraso',danificou:'danificar',danificada:'danificar',danificado:'danificar',
      especificado:'especificacao',especificada:'especificacao',especificacoes:'especificacao',solicitado:'solicitacao',solicitada:'solicitacao'
    };
    return map[x]||x;
  };
  return normalizeAnswer(v||'').replace(/[^a-z0-9áéíóúãõâêôç\s]/gi,' ').split(/\s+/)
    .map(stem).filter(x=>x.length>2&&!stop.has(x));
}
function problemFeatures(v){
  const toks=tokenizeForSimilarity(v);
  const features=new Set(toks);
  // Bigrams preservam o objeto do problema: "fita dupla", "medida chapa", etc.
  for(let i=0;i<toks.length-1;i++)features.add(toks[i]+'_'+toks[i+1]);
  const n=normalizeAnswer(v||'');
  const concepts=[];
  if(/\b(medida|dimens|comprimento|largura|altura|milimet|mm\b)/.test(n))concepts.push('CONCEITO_DIMENSIONAL');
  if(/\b(cliche|clichê)/.test(n))concepts.push('OBJETO_CLICHE');
  if(/\b(fita dupla|dupla face|adesiv)/.test(n))concepts.push('OBJETO_FITA_ADESIVA');
  if(/\b(chapa|chapas)/.test(n))concepts.push('OBJETO_CHAPA');
  if(/\b(caixa|caixas|embalagem|embalagens)/.test(n))concepts.push('OBJETO_EMBALAGEM');
  if(/\b(etiqueta|etiquetas|rotulo|rótulo)/.test(n))concepts.push('OBJETO_ETIQUETA');
  if(/\b(impress|tinta|cor|tonalidade)/.test(n))concepts.push('CONCEITO_IMPRESSAO');
  if(/\b(colagem|cola|descol|aderencia|aderência)/.test(n))concepts.push('CONCEITO_COLAGEM');
  if(/\b(corte|cortad|faca)/.test(n))concepts.push('CONCEITO_CORTE');
  if(/\b(amass|rasg|quebr|danific)/.test(n))concepts.push('CONCEITO_DANO_FISICO');
  concepts.forEach(x=>features.add(x));
  return features;
}
function jaccardSimilarity(a,b){
  const A=problemFeatures(a),B=problemFeatures(b);
  if(!A.size||!B.size)return 0;
  let inter=0;A.forEach(x=>{if(B.has(x))inter++});
  const union=new Set([...A,...B]).size;
  return union?inter/union:0;
}
function problemSimilarity(a,b){
  const A=problemFeatures(a),B=problemFeatures(b);
  if(!A.size||!B.size)return 0;
  let inter=0;A.forEach(x=>{if(B.has(x))inter++});
  // Dice é menos punitivo quando uma descrição é muito mais detalhada que a outra.
  const dice=(2*inter)/(A.size+B.size);
  const ca=[...A].filter(x=>x.startsWith('CONCEITO_')||x.startsWith('OBJETO_'));
  const cb=new Set([...B].filter(x=>x.startsWith('CONCEITO_')||x.startsWith('OBJETO_')));
  const conceptHits=ca.filter(x=>cb.has(x)).length;
  const conceptBoost=conceptHits?Math.min(.22,conceptHits*.11):0;
  return Math.min(1,dice+conceptBoost);
}
function roSimilarity(a,b,triageMap){
  if(!a||!b)return 0;
  const text=problemSimilarity(a.descricao||'',b.descricao||'');
  // REGRA PRINCIPAL: sem semelhança real do problema, metadados não geram pontuação.
  if(text<0.22)return 0;

  let score=text*90;
  const same=(x,y)=>normalizeAnswer(x||'')&&normalizeAnswer(x||'')===normalizeAnswer(y||'');
  const ar=a.raw||{},br=b.raw||{};
  const ai=firstValue(ar,['Código do item:','Código do item','Codigo do item','Item'])||'';
  const bi=firstValue(br,['Código do item:','Código do item','Codigo do item','Item'])||'';
  // Item e tipo só REFORÇAM um problema que já é semelhante. Cliente/setor não pontuam.
  if(ai&&bi&&same(ai,bi))score+=7;
  if(same(a.tipoRO||a.assunto,b.tipoRO||b.assunto))score+=3;
  return Math.max(0,Math.min(100,Math.round(score)));
}
function findSimilarRos(ro,limit=6){
  const id=String(ro?.numero||ro?.id||ro?.codigo||'');
  const triageMap=getSavedTriageMap();
  const out=[];
  getAllRoRecords().forEach(x=>{
    if(String(x.numero||x.id||x.codigo||'')===id)return;
    const score=roSimilarity(ro,x,triageMap);
    if(score>=35)out.push({ro:x,score});
  });
  return out.sort((a,b)=>b.score-a.score).slice(0,limit);
}
function summarizeOccurrence(ro){
  if(!ro)return 'Sem dados suficientes.';
  const raw=ro.raw||{};
  const parts=[];
  if(ro.cliente&&ro.cliente!=='Não informado')parts.push('Cliente: '+ro.cliente+'.');
  if(ro.tipoRO||ro.assunto)parts.push('Tipo: '+(ro.tipoRO||ro.assunto)+'.');
  const item=firstValue(raw,['Código do item:','Código do item','Codigo do item']);
  const pedido=firstValue(raw,['Número do pedido:','Número do pedido','Pedido']);
  if(item)parts.push('Item '+item+'.');
  if(pedido)parts.push('Pedido '+pedido+'.');
  const desc=String(ro.descricao||'').replace(/\s+/g,' ').trim();
  if(desc)parts.push(desc.length>260?desc.slice(0,257)+'...':desc);
  const tri=getSavedTriageMap().get(String(ro.numero||ro.id||ro.codigo||''));
  if(tri?.responsibleSector)parts.push('Tratativa direcionada para '+tri.responsibleSector+'.');
  if(tri?.criticality)parts.push('Criticidade '+tri.criticality+'.');
  return parts.join(' ');
}
function renderRoIntelligence(){
  if(!selected)return;
  const summary=document.getElementById('roAutoSummary');
  if(summary)summary.textContent=summarizeOccurrence(selected);
  const sims=findSimilarRos(selected);
  const score=document.getElementById('roSimilarityScore');
  const list=document.getElementById('roSimilarList');
  const card=document.getElementById('roDuplicateCard');
  if(score)score.textContent=sims.length?sims.length+' encontrada(s)':'Nenhuma encontrada';
  if(card)card.classList.toggle('intel-warning',sims.some(x=>x.score>=65));
  if(list)list.innerHTML=sims.length?sims.map(x=>`<div style="padding:5px 0;border-top:1px solid #edf1ef"><button class="ro-link-btn" type="button" onclick="openRO('${escapeHtml(x.ro.numero||x.ro.id||x.ro.codigo)}')"><b>${escapeHtml(x.ro.numero||'R.O.')}</b></button> · ${x.score}% semelhante · ${escapeHtml(x.ro.cliente||'')}</div>`).join(''):'Nenhuma ocorrência suficientemente semelhante pelos critérios atuais.';
}
function similarityReasons(a,b,triageMap){
  const reasons=[];
  const pct=Math.round(problemSimilarity(a?.descricao||'',b?.descricao||'')*100);
  if(pct>=22)reasons.push('Problema '+pct+'% semelhante');
  const same=(x,y)=>normalizeAnswer(x||'')&&normalizeAnswer(x||'')===normalizeAnswer(y||'');
  const ar=a?.raw||{},br=b?.raw||{};
  const ai=firstValue(ar,['Código do item:','Código do item','Codigo do item','Item'])||'';
  const bi=firstValue(br,['Código do item:','Código do item','Codigo do item','Item'])||'';
  if(ai&&bi&&same(ai,bi))reasons.push('Mesmo item');
  if(same(a?.tipoRO||a?.assunto,b?.tipoRO||b?.assunto))reasons.push('Mesmo tipo de R.O.');
  return reasons;
}
function duplicateMeta(ro){
  const raw=ro?.raw||{};
  const item=firstValue(raw,['Código do item:','Código do item','Codigo do item','Item'])||'';
  const pedido=firstValue(raw,['Número do pedido:','Número do pedido','Pedido'])||'';
  const data=ro?.data||ro?.dataRegistro||ro?.timestamp||firstValue(raw,['Data','Data:','Data da ocorrência','Data da ocorrência:'])||'';
  return {item,pedido,data};
}
function renderTriageDuplicateWarning(ro){
  const box=document.getElementById('triageDuplicateWarning');
  const list=document.getElementById('triageDuplicateList');
  if(!box||!list)return;

  box.classList.remove('hidden');
  list.textContent='Verificando ocorrências semelhantes...';
  window.__triageDuplicateContext={ro,sims:[]};

  const run=()=>{
    try{
      const sims=findSimilarRos(ro,8).filter(x=>x.score>=35);
      window.__triageDuplicateContext={ro,sims};
      box.classList.toggle('hidden',!sims.length);
      if(sims.length){
        list.innerHTML=sims.slice(0,4).map(x=>`<div style="padding:4px 0"><b>${escapeHtml(x.ro.numero||'')}</b> · ${x.score}% semelhante · ${escapeHtml(x.ro.cliente||'')} · ${escapeHtml(x.ro.descricao||'').slice(0,120)}${String(x.ro.descricao||'').length>120?'…':''}</div>`).join('');
      }else{
        list.textContent='';
      }
    }catch(e){
      console.warn('Falha ao verificar possíveis duplicidades.',e);
      box.classList.add('hidden');
    }
  };

  if('requestIdleCallback' in window)requestIdleCallback(run,{timeout:500});
  else setTimeout(run,30);
}
function openTriageDuplicateDetails(){
  const ctx=window.__triageDuplicateContext||{};
  const ro=ctx.ro;
  if(!ro)return;
  const triageMap=getSavedTriageMap();
  const sims=(ctx.sims&&ctx.sims.length?ctx.sims:findSimilarRos(ro,20).filter(x=>x.score>=35));
  const overlay=document.getElementById('triageDuplicateDetailsOverlay');
  const list=document.getElementById('triageDuplicateDetailsList');
  const summary=document.getElementById('triageDuplicateDetailsSummary');
  if(!overlay||!list)return;
  if(summary)summary.innerHTML=`<b>${escapeHtml(ro.numero||ro.id||ro.codigo||'R.O. atual')}</b> · ${sims.length} ocorrência(s) com problema semelhante.`;
  list.innerHTML=sims.length?sims.map(x=>{
    const m=duplicateMeta(x.ro), reasons=similarityReasons(ro,x.ro,triageMap);
    const meta=[x.ro.cliente?('Cliente: '+x.ro.cliente):'',m.item?('Item: '+m.item):'',m.pedido?('Pedido: '+m.pedido):'',m.data?('Data: '+m.data):'',effectiveRoSector(x.ro,triageMap)?('Setor: '+effectiveRoSector(x.ro,triageMap)):''].filter(Boolean);
    return `<div class="duplicate-detail-card">
      <div class="duplicate-detail-top"><button class="ro-link-btn" type="button" onclick="openRO('${escapeHtml(x.ro.numero||x.ro.id||x.ro.codigo)}')"><b>${escapeHtml(x.ro.numero||'R.O.')}</b></button><span class="duplicate-score">${x.score}% semelhante</span></div>
      ${reasons.length?`<div class="duplicate-badges">${reasons.map(r=>`<span class="duplicate-badge">${escapeHtml(r)}</span>`).join('')}</div>`:''}
      ${meta.length?`<div class="small">${meta.map(escapeHtml).join(' · ')}</div>`:''}
      <div class="duplicate-fulltext">${escapeHtml(String(x.ro.descricao||'Sem descrição registrada.'))}</div>
    </div>`;
  }).join(''):'<div class="small">Nenhuma ocorrência com problema suficientemente semelhante.</div>';
  overlay.classList.add('open');
}
function closeTriageDuplicateDetails(){
  document.getElementById('triageDuplicateDetailsOverlay')?.classList.remove('open');
}

function pdcaQualityIssues(){
  const a=answers||{},issues=[];
  const text=(id)=>String(a[id]||'').trim();
  const norm=(v)=>normalizeAnswer(String(v||''));
  const add=(id,title,items,example='')=>issues.push({id,level:'warn',title,text:title,items,example});

  const numberWords=[
    'zero','um','uma','dois','duas','tres','três','quatro','cinco','seis','sete','oito','nove','dez',
    'onze','doze','treze','quatorze','catorze','quinze','dezesseis','dezessete','dezoito','dezenove','vinte',
    'trinta','quarenta','cinquenta','sessenta','setenta','oitenta','noventa','cem','cento','mil'
  ];
  const numberWordRe=new RegExp('\\b(?:'+numberWords.join('|')+')\\b','i');
  const hasQuantity=(v)=>/\d/.test(v)||numberWordRe.test(v);
  const hasFrequency=(v)=>{
    const n=norm(v);
    return hasQuantity(v) ||
      /\b(diari|seman|quinzen|mensal|bimestral|trimestral|anual|hora|turno|lote|pedido|vez|vezes|ocasional|raramente|frequent|sempre|eventual|esporadic)\w*/i.test(n);
  };
  const hasMeasure=(v)=>{
    const n=norm(v);
    return hasQuantity(v) ||
      /%|percent|por cento|indice|taxa|tempo|prazo|quantidade|zero ocorr|sem ocorr|eliminar|reduzir|aumentar|diminuir|manter|atingir|maximo|minimo|no maximo|no minimo/i.test(n);
  };
  const hasDateOrPeriod=(v)=>{
    const n=norm(v);
    return /\b\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?\b|\b20\d{2}\b/i.test(v) ||
      hasQuantity(v)&&/\b(dia|dias|semana|semanas|mes|meses|mês|ano|anos|hora|horas|turno|turnos)\b/i.test(v) ||
      /\b(hoje|amanha|amanhã|esta semana|proxima semana|próxima semana|este mes|este mês|proximo mes|próximo mês|fim do mes|fim do mês)\b/i.test(n);
  };
  const actionVerb=(v)=>/\b(implementar|implantar|criar|realizar|treinar|alterar|revisar|instalar|desenvolver|padronizar|elaborar|adquirir|substituir|contratar|conferir|monitorar|definir|estabelecer|incluir|disponibilizar)\b/i.test(norm(v));
  const tooShort=(v,n)=>String(v||'').trim().length<n;
  const onlyYesNo=(v)=>/^(sim|nao|não|ok)$/i.test(String(v||'').trim());
  const isExplicitNoRisk=(v)=>/\b(nao ha|não há|sem risco|nenhum risco|nao identificado|não identificado|não foram identificados|nao foram identificados)\b/i.test(norm(v));
  const statusLike=(v)=>{
    const n=norm(v);
    return /\b(previst|programad|planejad|agendad|nao inici|não inici|a iniciar|pendente|em andamento|andamento|parcial|em execucao|em execução|iniciad|conclu|finaliz|realiz|cancelad|suspens|aguardando)\w*/i.test(n);
  };
  const causalDepth=(v)=>{
    const n=norm(v);
    const connectors=(n.match(/\b(porque|pois|devido|devido a|por causa|ocorre porque|acontece porque|isso leva|isso ocorre|faz com que|resulta|decorrente|causado)\b/g)||[]).length;
    const separators=(v.match(/(?:->|→|;|\n|\d+\s*[\.\-\)])/g)||[]).length;
    const clauses=v.split(/[.;\n]/).filter(x=>x.trim().length>8).length;
    return connectors+separators+(clauses>=3?1:0);
  };

  // PLAN
  if(text('p1') && tooShort(text('p1'),15))
    add('p1','O problema ainda está pouco definido.',[
      'Descreva o que aconteceu de forma objetiva.',
      'Informe qual foi o desvio observado.',
      'Evite colocar a solução neste campo.'
    ],'Ex.: “Foram expedidos itens em quantidade diferente da solicitada no pedido.”');

  if(text('p2') && tooShort(text('p2'),12))
    add('p2','O impacto ainda está pouco explicado.',[
      'Diga qual consequência o problema gera para o cliente, processo ou empresa.',
      'Se souber, complemente com retrabalho, atraso, custo, perda, risco ou outra consequência.'
    ],'Ex.: “Gera retrabalho, atraso na entrega e necessidade de reposição do pedido.”');

  if(text('p3') && tooShort(text('p3'),3))
    add('p3','O local ou processo precisa ser identificado.',[
      'Informe o setor, etapa, equipamento, linha ou ponto do processo onde o problema ocorre.'
    ],'Ex.: “Expedição, na etapa de separação dos pedidos.”');

  if(text('p4') && !hasFrequency(text('p4')))
    add('p4','A frequência ainda não está clara.',[
      'Informe quantas vezes ocorre ou qual é a periodicidade observada.',
      'Pode escrever números por extenso ou usar termos como diariamente, semanalmente, por lote ou ocasionalmente.',
      'Não precisa ter um número exato se ele não for conhecido.'
    ],'Ex.: “Acontece umas cinco a seis vezes por semana.”');

  if(text('p5') && tooShort(text('p5'),18))
    add('p5','A análise de possíveis causas pode ser aprofundada.',[
      'Registre mais de uma hipótese quando houver.',
      'Considere os grupos do 5M que realmente se aplicam ao caso.',
      'Não é obrigatório preencher todos os 5M.'
    ],'Ex.: “Método: não há conferência final. Mão de obra: orientação não padronizada.”');

  if(text('p6')){
    const v=text('p6');
    // Só alerta se a resposta for curta ou parecer mera lista de causas sem aprofundamento.
    if(tooShort(v,35) || (causalDepth(v)===0 && v.split(/\s+/).length<18))
      add('p6','O raciocínio dos 5 Porquês pode ser aprofundado.',[
        'Explique por que as causas citadas acontecem.',
        'Vá aprofundando até chegar a uma origem que possa ser tratada.',
        'Você não precisa escrever literalmente “por quê?” cinco vezes; o importante é mostrar a sequência de causa e origem.',
        'Se já houver uma sequência lógica na resposta, mantenha-a e apenas complemente os pontos que ainda ficaram sem explicação.'
      ],'Ex.: “A contagem falha porque não existe uma etapa formal de conferência; isso ocorre porque o fluxo atual libera o pedido direto após a separação.”');
  }

  if(text('p7') && tooShort(text('p7'),10))
    add('p7','A causa raiz ainda está pouco específica.',[
      'Informe a causa fundamental identificada após a análise.',
      'Ela deve explicar por que o problema acontece e ser algo que possa ser tratado.'
    ],'Ex.: “O fluxo não possui uma etapa padronizada de conferência antes da saída do pedido.”');

  if(text('p8')){
    const v=text('p8');
    if(actionVerb(v) && !hasMeasure(v))
      add('p8','A resposta parece descrever uma ação, e não o resultado da meta.',[
        'Informe qual resultado se espera alcançar.',
        'Inclua uma forma de medir esse resultado, como quantidade, percentual, índice, frequência ou redução esperada.',
        'Não precisa colocar prazo aqui; existe uma pergunta específica para o prazo da meta.',
        'A forma de executar a melhoria deve ficar na pergunta da ação.'
      ],'Ex.: “Reduzir em 80% as divergências na expedição.”');
    else if(!hasMeasure(v))
      add('p8','A meta ainda não mostra claramente como o resultado será medido.',[
        'Indique qual resultado permitirá verificar se a melhoria funcionou.',
        'Pode ser quantidade, percentual, índice, frequência, tempo ou eliminação/redução do problema.',
        'Não precisa colocar prazo neste campo.'
      ],'Ex.: “Reduzir as divergências para no máximo 2 ocorrências por mês.”');
  }

  if(text('p9') && !hasDateOrPeriod(text('p9')))
    add('p9','O prazo da meta ainda não está objetivo.',[
      'Informe uma data ou período para atingir a meta.',
      'Pode ser uma data específica ou um período como 30 dias, 2 meses ou até o fim do mês.'
    ],'Ex.: “Até 30/11/2026”.');

  if(text('p10') && !statusLike(text('p10')))
    add('p10','O status da meta não foi reconhecido com clareza.',[
      'Informe a situação atual da meta.',
      'São válidos termos como: previsto, planejado, não iniciado, em andamento, parcial, concluído ou equivalente.'
    ],'Ex.: “Previsto”.');

  if(text('p11')){
    const v=text('p11');
    if(tooShort(v,12))
      add('p11','A ação precisa ficar mais específica.',[
        'Descreva exatamente o que será feito.',
        'A ação deve atuar sobre a causa raiz.',
        'Não precisa colocar prazo nem responsável aqui; existem campos próprios para isso.'
      ],'Ex.: “Implantar uma etapa de conferência dos itens antes da liberação do pedido.”');

    // Relação causa→ação agora só alerta em casos muito claros de desconexão:
    // precisa haver textos razoavelmente longos E ausência total de termos comuns.
    if(text('p7') && v.length>=25 && text('p7').length>=25 && jaccardSimilarity(text('p7'),v)<0.01)
      add('p11','Confira se a ação está ligada à causa raiz.',[
        'Verifique se esta ação elimina, reduz ou bloqueia a causa raiz identificada.',
        'Se a ligação já existir, deixe isso mais explícito na descrição da ação.'
      ]);
  }

  if(text('p11')&&!text('p12'))
    add('p12','Falta informar o prazo da ação.',[
      'Informe quando a ação deverá ser concluída.',
      'Pode ser uma data ou período objetivo.'
    ],'Ex.: “15/10/2026”.');
  else if(text('p12')&&!hasDateOrPeriod(text('p12')))
    add('p12','O prazo da ação ainda não está objetivo.',[
      'Informe uma data ou período que permita acompanhar a conclusão.',
      'Evite expressões indefinidas como “assim que possível”.'
    ],'Ex.: “Até 15/10/2026”.');

  if(text('p11')&&!text('p13'))
    add('p13','Falta selecionar ao menos um setor responsável pela ação.',[
      'Informe a pessoa, função ou cargo responsável por executar e acompanhar a ação.',
      'Não precisa repetir a ação nem o prazo.'
    ],'Ex.: “Supervisor de Expedição”.');

  if(text('p14') && onlyYesNo(text('p14')) && !isExplicitNoRisk(text('p14')))
    add('p14','Vale esclarecer melhor o risco de implantação.',[
      'Se houver risco, diga qual é.',
      'Se não houver risco relevante identificado, registre isso de forma explícita.'
    ],'Ex.: “Não foram identificados riscos relevantes na implantação.”');

  // DO
  if(text('d1') && onlyYesNo(text('d1')))
    add('d1','O treinamento pode ser registrado com um pouco mais de contexto.',[
      'Informe se ocorreu e, se possível, qual equipe ou grupo foi treinado.',
      'Não precisa detalhar todo o conteúdo do treinamento.'
    ],'Ex.: “Sim. A equipe da Expedição foi treinada no novo fluxo.”');

  if(text('d2') && onlyYesNo(text('d2')))
    add('d2','A compreensão da equipe pode ser melhor evidenciada.',[
      'Informe como foi percebido ou confirmado que a equipe entendeu a nova forma de trabalho.',
      'Pode citar demonstração prática, acompanhamento, teste ou orientação.'
    ],'Ex.: “Sim. A equipe executou o novo fluxo acompanhada pelo supervisor.”');

  if(text('d3') && !statusLike(text('d3')))
    add('d3','O status do treinamento não foi reconhecido com clareza.',[
      'Use um status objetivo.',
      'São válidos termos como: previsto, programado, planejado, pendente, não iniciado, em andamento, parcial, concluído ou equivalente.'
    ],'Ex.: “Previsto”.');

  if(text('d4') && onlyYesNo(text('d4')))
    add('d4','A resposta pode ser um pouco mais clara sobre os recursos.',[
      'Se todos os recursos estiverem disponíveis, registre isso explicitamente.',
      'Se faltar algo, identifique o recurso que ainda é necessário.'
    ],'Ex.: “Sim. Todos os recursos necessários estão disponíveis.”');

  if(text('d5') && tooShort(text('d5'),12))
    add('d5','A forma de registrar a execução está pouco definida.',[
      'Explique onde ou como ficará registrado que a ação foi executada.',
      'Informe também como serão registrados desvios, se ocorrerem.'
    ],'Ex.: “A execução será registrada em checklist digital, incluindo os desvios encontrados.”');

  // CHECK
  if(text('c1') && onlyYesNo(text('c1')))
    add('c1','A comparação com a meta pode ser melhor demonstrada.',[
      'Informe qual resultado foi observado.',
      'Compare esse resultado com a meta definida.',
      'Use dados disponíveis quando houver.'
    ],'Ex.: “Sim. As divergências caíram de 10 para 2 por mês.”');

  if(text('c2') && onlyYesNo(text('c2')))
    add('c2','A conclusão sobre a causa raiz pode ser melhor sustentada.',[
      'Informe se a causa foi eliminada ou controlada.',
      'Acrescente a evidência, dado ou observação que sustenta essa conclusão.'
    ],'Ex.: “Sim. Todos os pedidos passaram a ter conferência registrada antes da saída.”');

  if(text('c3') && onlyYesNo(text('c3')))
    add('c3','A avaliação de efeitos colaterais pode ser registrada de forma mais clara.',[
      'Se houve algum efeito não previsto, descreva-o.',
      'Se não houve, registre explicitamente que nenhum efeito foi identificado.'
    ],'Ex.: “Não foram observados efeitos colaterais após a implantação.”');

  // ACT
  if(text('a1') && onlyYesNo(text('a1')))
    add('a1','A padronização pode ser melhor identificada.',[
      'Informe como a melhoria foi incorporada ao processo.',
      'Pode citar procedimento, instrução de trabalho, checklist, treinamento ou outro padrão.'
    ],'Ex.: “Sim. O novo fluxo foi incluído na instrução de trabalho da Expedição.”');

  if(text('a2') && tooShort(text('a2'),12))
    add('a2','O acompanhamento do novo padrão está pouco definido.',[
      'Explique como será verificado se o padrão continua sendo seguido.',
      'Quando fizer sentido, informe também a frequência do acompanhamento.'
    ],'Ex.: “O supervisor verificará semanalmente uma amostra dos checklists.”');

  if(text('a3') && onlyYesNo(text('a3')))
    add('a3','A conclusão sobre a meta pode ser melhor justificada.',[
      'Informe se a meta foi atingida com base no resultado verificado.',
      'Se não foi atingida, indique em qual etapa houve falha: Planejar, Fazer ou Checar.'
    ],'Ex.: “Sim. A meta foi atingida, pois as divergências ficaram abaixo do limite definido.”');

  if(text('a4') && tooShort(text('a4'),12))
    add('a4','As lições aprendidas ainda estão pouco detalhadas.',[
      'Registre o principal aprendizado gerado por este ciclo.',
      'Pense no que pode ser útil para evitar repetição do problema ou melhorar outros processos.'
    ],'Ex.: “A conferência precisa fazer parte do fluxo antes da liberação do pedido, e não depois da ocorrência.”');

  pdcaExtraActions.forEach((x,i)=>{
    const n=i+2;
    if(x.action && String(x.action).trim().length<10)
      add('extra','A ação adicional '+n+' está pouco detalhada.',[
        'Descreva de forma mais clara o que será feito.'
      ]);
    if(x.action&&!x.owner)
      add('extra','A ação adicional '+n+' está sem responsável.',[
        'Defina a pessoa, função ou cargo responsável.'
      ]);
    if(x.action&&!x.deadline)
      add('extra','A ação adicional '+n+' está sem prazo.',[
        'Defina uma data ou período para conclusão.'
      ]);
  });

  return issues;
}
function runPdcaQualityCheck(scrollToFirst=false){
  const issues=pdcaQualityIssues(),box=document.getElementById('pdcaQualityList'),sum=document.getElementById('pdcaQualitySummary');
  setTimeout(()=>{try{refreshPdcaInlineAlerts()}catch(e){}},0);
  const allIds=stages.flatMap(s=>s.items.map(x=>x[0]));
  const answered=allIds.filter(id=>String(answers[id]||'').trim()).length;
  if(sum)sum.textContent=issues.length?answered+'/26 respondidas · '+issues.length+' ponto(s) para revisar.':answered+'/26 respondidas · Nenhum alerta de qualidade encontrado.';
  if(box)box.innerHTML=issues.length?issues.slice(0,10).map(x=>`<div class="pdca-quality-item warn">${pdcaIssueHtml(x)}</div>`).join(''):'<div class="pdca-quality-item ok">✓ As respostas preenchidas passaram nas verificações automáticas atuais.</div>';
  if(scrollToFirst&&issues[0]?.id&&issues[0].id!=='extra'){
    const target=stages.findIndex(s=>s.items.some(i=>i[0]===issues[0].id));
    if(target>=0){activeStage=target;renderStage();setTimeout(()=>document.getElementById('answer_'+issues[0].id)?.scrollIntoView({behavior:'smooth',block:'center'}),80)}
  }
  return issues;
}
function pdcaPresentationSummaryHtml(p){
  const a=p?.answers||{};
  const item=(label,val)=>`<div><div class="label">${escapeHtml(label)}</div><div>${escapeHtml(val||'—')}</div></div>`;
  return `<div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap"><div><b>Resumo para apresentação</b><div class="small">Visão rápida dos pontos principais do PDCA.</div></div><span class="status-badge">${escapeHtml(p.id||'PDCA')}</span></div>
    <div class="presentation-summary-grid" style="margin-top:12px">
      ${item('Problema',a.p1)}
      ${item('Causa raiz',a.p7)}
      ${item('Meta',a.p8)}
      ${item('Ação principal',a.p11)}
      ${item('Responsável',a.p13)}
      ${item('Prazo',a.p12)}
      ${item('Resultado',a.c1)}
      ${item('Meta atingida',a.a3)}
    </div>`;
}
function getOfflineQueue(){try{return JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY)||'[]')||[]}catch(e){return []}}
function setOfflineQueue(q){localStorage.setItem(OFFLINE_QUEUE_KEY,JSON.stringify(q.slice(-500)))}
function queueOfflineOperation(op){const q=getOfflineQueue();q.push({...op,queuedAt:new Date().toISOString()});setOfflineQueue(q);updateNetworkState()}
async function flushOfflineQueue(){
  if(!navigator.onLine||!portalBackendEnabled())return false;
  const q=getOfflineQueue();if(!q.length){updateNetworkState();return true}
  const pending=[];
  q.forEach(op=>{
    const ok=portalPostForm(op.params||{});
    if(!ok)pending.push(op);
  });
  setOfflineQueue(pending);
  updateNetworkState();
  return !pending.length;
}
function updateNetworkState(){
  const pill=document.getElementById('networkStatePill');if(!pill)return;
  const q=getOfflineQueue().length;
  const online=navigator.onLine;
  pill.textContent=online?(q?'● Online · '+q+' aguardando sync':'● Online'):'● Offline · rascunho local';
  pill.classList.toggle('offline',!online||q>0);
}
window.addEventListener('online',()=>{updateNetworkState();flushOfflineQueue();setTimeout(()=>syncPortalBackend(false),500)});

// Mantém as máquinas atualizadas sem bombardear o Apps Script nem rerenderizar
// a aplicação a cada poucos segundos. Foco/retorno só sincroniza se a última carga
// já tiver algum tempo, evitando 2–3 chamadas seguidas ao alternar de janela.
let __nucleoCentralRefreshTimer=null;
let __nucleoLastAutoSyncAttempt=0;
function nucleoAutoSyncIfDue(force=false){
  try{
    if(!getSession()?.authToken||document.visibilityState==='hidden'||portalBackendSyncInProgress||nucleoRoCentralRefreshPromise||syncNow.inProgress)return;
    const now=Date.now();
    if(!force && now-__nucleoLastAutoSyncAttempt<300000)return;
    __nucleoLastAutoSyncAttempt=now;
    syncPortalBackend(false);
  }catch(e){}
}
function startNucleoCentralRefresh(){
  try{clearInterval(__nucleoCentralRefreshTimer)}catch(e){}
  __nucleoCentralRefreshTimer=setInterval(()=>nucleoAutoSyncIfDue(false),300000);
}
setTimeout(retryPendingRncDeletes,1800);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')nucleoAutoSyncIfDue(false)});
window.addEventListener('focus',()=>nucleoAutoSyncIfDue(false));
startNucleoCentralRefresh();
window.addEventListener('offline',updateNetworkState);
const FAVORITES_KEY='portal-sgq-favorites-v1';
const ARCHIVED_RO_KEY='portal-sgq-archived-ro-v1';

function getFavorites(){
  try{return JSON.parse(localStorage.getItem(FAVORITES_KEY)||'[]')||[]}catch(e){return []}
}
function saveFavorites(list){
  localStorage.setItem(FAVORITES_KEY,JSON.stringify(list));
  const key=notificationUserKey();
  portalBackendSave('favorites',key,{id:key,userKey:key,items:list,updatedAt:new Date().toISOString()});
}
function isFavoriteRo(roNumber){return getFavorites().includes(String(roNumber||''))}
function toggleFavoriteSelectedRo(){
  if(!selected)return;
  const id=String(selected.numero||selected.id||selected.codigo||'');
  const list=getFavorites();
  const next=list.includes(id)?list.filter(x=>x!==id):[id,...list];
  saveFavorites(next);
  refreshFavoriteButton();
  if(isAdmin())try{renderManagementDashboard()}catch(e){}
}
function refreshFavoriteButton(){
  const b=document.getElementById('favoriteRoBtn');if(!b||!selected)return;
  const fav=isFavoriteRo(selected.numero||selected.id||selected.codigo);
  b.textContent=fav?'★':'☆';b.classList.toggle('active',fav);
  b.title=fav?'Remover do acompanhamento especial':'Adicionar ao acompanhamento especial';
}
function getArchivedRoIds(){
  try{return JSON.parse(localStorage.getItem(ARCHIVED_RO_KEY)||'[]')||[]}catch(e){return []}
}
function saveArchivedRoIds(list){
  localStorage.setItem(ARCHIVED_RO_KEY,JSON.stringify(list));
  portalBackendSave('archives','main',{id:'main',items:list,updatedAt:new Date().toISOString()});
}
function isArchivedRo(id){return getArchivedRoIds().includes(String(id||''))}
function archiveOldRos(){
  if(!isAdmin())return;
  const cutoff=new Date();cutoff.setFullYear(cutoff.getFullYear()-1);
  const current=getArchivedRoIds();const set=new Set(current);let added=0;
  getAllRoRecords().forEach(ro=>{
    const id=String(ro.numero||ro.id||ro.codigo||'');
    const st=String(syncContestStateToRo({...ro}).status||'').toLowerCase();
    const closed=st.includes('cancel')||st.includes('somente para registro')||st.includes('pdca enviado')||st.includes('concl');
    const d=parseBrDate(ro.data||'');
    if(closed && d && d<cutoff && !set.has(id)){set.add(id);added++}
  });
  saveArchivedRoIds([...set]);
  alert(added?added+' R.O.(s) arquivada(s).':'Nenhuma R.O. encerrada com mais de 1 ano foi encontrada.');
  render();renderManagementDashboard();
}
function showArchivedRos(){
  const toggle=document.getElementById('showArchivedToggle');if(toggle)toggle.checked=true;
  showList();render();
}
function managementDate(ro){
  return parseBrDate(ro.data||ro.createdAt||'');
}
function withinManagementPeriod(ro){
  const val=document.getElementById('managementPeriod')?.value||'90';
  if(val==='all')return true;
  const d=managementDate(ro);if(!d)return true;
  const cut=new Date();cut.setHours(0,0,0,0);cut.setDate(cut.getDate()-Number(val||90));
  return d>=cut;
}
function effectiveRoSector(ro,triageMap){
  const id=String(ro?.numero||ro?.id||ro?.codigo||'');
  const tri=(triageMap instanceof Map ? triageMap : getSavedTriageMap()).get(id);
  const candidates=[tri?.responsibleSector,ro?.setorResponsavelPlanilha,ro?.setor];
  for(const value of candidates){
    const canonical=canonicalSectorName(value);
    if(canonical)return canonical;
  }
  return 'Sem setor';
}
function effectiveRoDeadline(ro){
  const id=String(ro?.numero||ro?.id||ro?.codigo||'');
  const tri=getSavedTriageMap().get(id);
  return tri?.pdcaDeadline||ro?.prazo||ro?.dataLimite||'';
}
function effectiveRoCriticality(ro){
  const id=String(ro?.numero||ro?.id||ro?.codigo||'');
  const tri=getSavedTriageMap().get(id);
  return tri?.criticality||'Média';
}
function pdcaForRo(ro){
  const id=String(ro?.numero||ro?.id||ro?.codigo||'');
  return getAllSentPdcas().find(p=>String(p.ro||p.roId||'')===id)||null;
}
function pdcaSentDate(p){
  if(!p)return null;
  if(p.sentAt){const d=new Date(p.sentAt);if(!isNaN(d))return d}
  const raw=String(p.envio||'').trim();
  if(raw){
    const m=raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
    if(m)return new Date(Number(m[3]),Number(m[2])-1,Number(m[1]),Number(m[4]||0),Number(m[5]||0));
  }
  return null;
}
function roResponseDays(ro,p){
  const start=managementDate(ro),end=pdcaSentDate(p);
  if(!start||!end)return null;
  return Math.max(0,Math.round((end-start)/86400000*10)/10);
}
function normalizeRecurrenceText(v){
  return normalizeAnswer(v||'').replace(/\b(de|da|do|das|dos|e|em|para|por|com|um|uma|o|a)\b/g,' ').replace(/\s+/g,' ').trim();
}
function recurrenceSignature(ro){
  const raw=ro.raw||{};
  const product=String(firstValue(raw,['Código do item:','Código do item','Codigo do item','Item'])||'').trim();
  const client=String(ro.cliente||'').trim();
  const type=String(ro.tipoRO||ro.assunto||'').trim();
  const desc=normalizeRecurrenceText(ro.descricao||'').split(' ').slice(0,7).join(' ');
  return [normalizeAnswer(client),normalizeAnswer(product),normalizeAnswer(type),desc].filter(Boolean).join('|');
}
function recurrenceGroups(ros){
  const map=new Map();
  ros.forEach(ro=>{
    const sig=recurrenceSignature(ro);if(!sig)return;
    if(!map.has(sig))map.set(sig,[]);
    map.get(sig).push(ro);
  });
  return [...map.values()].filter(g=>g.length>1).sort((a,b)=>b.length-a.length);
}
function causeLabelForPdca(p){
  const a=p?.answers||{};
  return String(a.p7||a.p5||'').trim();
}
function managementData(){
  const ros=getAllRoRecords().filter(withinManagementPeriod);
  const sent=getAllSentPdcas();
  const bySector={};const monthly={};let total=0,onTime=0,late=0,responseDays=[];
  ros.forEach(ro=>{
    const state=syncContestStateToRo({...ro});
    const st=String(state.status||'').toLowerCase();
    const required=!st.includes('cancel')&&!st.includes('somente para registro')&&!st.includes('apenas registro');
    const sec=effectiveRoSector(ro);
    if(!bySector[sec])bySector[sec]={total:0,onTime:0,late:0,responseDays:[],recurrences:0};
    if(required){total++;bySector[sec].total++}
    const p=pdcaForRo(ro);
    const deadline=parseBrDate(effectiveRoDeadline(ro));
    const sentDate=pdcaSentDate(p);
    const days=roResponseDays(ro,p);
    if(days!==null){responseDays.push(days);bySector[sec].responseDays.push(days)}
    if(required&&p&&deadline&&sentDate){
      const due=new Date(deadline.getFullYear(),deadline.getMonth(),deadline.getDate(),23,59,59);
      if(sentDate<=due){onTime++;bySector[sec].onTime++}else{late++;bySector[sec].late++}
    }else if(required&&!p&&deadline&&deadline<new Date()){late++;bySector[sec].late++}
    const d=managementDate(ro);
    if(d){
      const key=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
      monthly[key]=(monthly[key]||0)+1;
    }
  });
  const rec=recurrenceGroups(ros);
  rec.forEach(g=>{
    const sectors=new Set(g.map(effectiveRoSector));
    sectors.forEach(s=>{if(bySector[s])bySector[s].recurrences+=(g.filter(x=>effectiveRoSector(x)===s).length-1)})
  });
  const causes={};
  sent.filter(p=>ros.some(r=>String(r.numero||r.id||r.codigo)===String(p.ro||''))).forEach(p=>{
    const c=causeLabelForPdca(p);if(!c)return;
    const k=normalizeAnswer(c).slice(0,100);
    if(!causes[k])causes[k]={label:c,count:0};
    causes[k].count++;
  });
  const avg=responseDays.length?responseDays.reduce((a,b)=>a+b,0)/responseDays.length:null;
  return {ros,total,onTime,late,responseDays,avg,bySector,monthly,recurrences:rec,causes:Object.values(causes).sort((a,b)=>b.count-a.count)};
}
function renderManagementDashboard(){
  if(!isAdmin())return;
  const d=managementData();
  const compliance=(d.onTime+d.late)?Math.round(d.onTime/(d.onTime+d.late)*100):0;
  const activeWatch=getFavorites().filter(id=>getAllRoRecords().some(r=>String(r.numero||r.id||r.codigo)===id));
  const k=document.getElementById('managementKpis');
  if(k)k.innerHTML=[
    ['R.O.s no período',d.ros.length],
    ['PDCAs exigidos',d.total],
    ['Cumprimento de prazo',compliance+'%'],
    ['Tempo médio de resposta',d.avg===null?'—':d.avg.toFixed(1)+' dias'],
    ['Possíveis reincidências',d.recurrences.reduce((s,g)=>s+(g.length-1),0)],
    ['Acompanhamento especial',activeWatch.length]
  ].map(([a,b])=>`<div class="mgmt-kpi"><span class="small">${escapeHtml(a)}</span><b>${escapeHtml(String(b))}</b></div>`).join('');

  const sr=document.getElementById('managementSectorRows');
  const sectors=Object.entries(d.bySector).sort((a,b)=>b[1].total-a[1].total);
  if(sr)sr.innerHTML=sectors.length?sectors.map(([name,x])=>{
    const denom=x.onTime+x.late;
    const pct=denom?Math.round(x.onTime/denom*100):0;
    const avg=x.responseDays.length?x.responseDays.reduce((a,b)=>a+b,0)/x.responseDays.length:null;
    return `<tr><td><b>${escapeHtml(name)}</b></td><td>${x.total}</td><td>${pct}%</td><td>${avg===null?'—':avg.toFixed(1)+' d'}</td><td>${x.late}</td><td>${x.recurrences}</td></tr>`;
  }).join(''):'<tr><td colspan="6">Sem dados.</td></tr>';

  const monthly=document.getElementById('managementMonthly');
  const monthEntries=Object.entries(d.monthly).sort((a,b)=>a[0].localeCompare(b[0])).slice(-12);
  const maxMonth=Math.max(1,...monthEntries.map(x=>x[1]));
  if(monthly)monthly.innerHTML=monthEntries.length?monthEntries.map(([m,v])=>`<div class="bar-row"><span>${escapeHtml(m)}</span><div class="bar-track"></div><b>${v}</b></div>`).join(''):'<div class="small">Sem dados.</div>';

  const rec=document.getElementById('managementRecurrences');
  if(rec)rec.innerHTML=d.recurrences.length?d.recurrences.slice(0,10).map(g=>{
    const base=g[0];
    return `<div class="watch-card"><b>${g.length} ocorrências semelhantes</b><div class="small">${escapeHtml(base.cliente||'')} · ${escapeHtml(base.tipoRO||base.assunto||'')}</div><div class="small" style="margin-top:4px">${g.map(r=>escapeHtml(r.numero||'')).join(' · ')}</div></div>`;
  }).join(''):'<div class="small">Nenhuma reincidência provável encontrada pelos critérios atuais.</div>';

  const cause=document.getElementById('managementCauses');
  const maxCause=Math.max(1,...d.causes.slice(0,10).map(x=>x.count));
  if(cause)cause.innerHTML=d.causes.length?d.causes.slice(0,10).map(x=>`<div class="bar-row"><span title="${escapeHtml(x.label)}">${escapeHtml(x.label.length>50?x.label.slice(0,50)+'…':x.label)}</span><div class="bar-track"></div><b>${x.count}</b></div>`).join(''):'<div class="small">Sem causas registradas nos PDCAs.</div>';

  const watch=document.getElementById('managementWatchlist');
  const watchRos=activeWatch.map(id=>getAllRoRecords().find(r=>String(r.numero||r.id||r.codigo)===id)).filter(Boolean);
  if(watch)watch.innerHTML=watchRos.length?watchRos.map(ro=>`<div class="watch-card"><span class="tag-watch">Acompanhando</span><div style="margin-top:6px"><b>${escapeHtml(ro.numero||'')}</b> · ${escapeHtml(ro.cliente||'')}</div><div class="small">${escapeHtml(effectiveRoSector(ro))} · ${escapeHtml(effectiveRoCriticality(ro))}</div><div class="actions" style="margin-top:7px"><button class="btn secondary" type="button" onclick="openRO('${escapeHtml(ro.numero||ro.id||ro.codigo)}')">Abrir</button></div></div>`).join(''):'<div class="small">Nenhuma R.O. marcada para acompanhamento especial.</div>';

  const ar=document.getElementById('managementArchiveSummary');
  if(ar)ar.innerHTML=`<b>${getArchivedRoIds().length}</b> R.O.(s) arquivada(s).`;
}
function showManagementDashboard(){
  if(!isAdmin()){showList();return}
  view('managementView');setNav('management');renderManagementDashboard();
  const crumb=document.getElementById('crumbCurrent');if(crumb)crumb.textContent='Gestão SGQ';
}
function getAllRoRecords(){
  const base=(typeof ROs!=='undefined' ? ROs : (typeof ros!=='undefined' ? ros : []));
  return getSession()?.role==='quality'||getSession()?.accessUnits?base.filter(qualityRecordAllowed):base;
}

function sgqIndicatorStatusCode(ro,triageMap){
  const map=triageMap instanceof Map?triageMap:getSavedTriageMap();
  const baseSituation=baseTriageSituation(ro);
  if(baseSituation.code==='cancelled')return 'cancelled';
  if(baseSituation.code==='record')return 'record';
  if(baseSituation.code==='directed')return 'directed';

  const tri=resolvedTriageForRo(ro,map)||{};
  if(tri.decision==='obsolete')return 'obsolete';

  // Estados posteriores à triagem só são considerados quando a base não está
  // classificando a R.O. como Registro/Cancelada/Enviada.
  const status=normalizeAnswer(ro?.statusOperacional||ro?.raw?.__statusOperacional||'');
  if(status.includes('em analise') || status.includes('em análise') || status==='analise' || status==='análise')return 'analysis';
  if(status.includes('conclu'))return 'done';
  return 'triage';
}
function sgqIndicatorDate(ro){
  const values=[
    ro?.data,
    ro?.dataReclamacao,
    ro?.raw?.['Carimbo de data/hora'],
    ro?.raw?.['Data'],
    ro?.raw?.['Data da R.O.'],
    ro?.raw?.['Data R.O.']
  ];
  for(const value of values){
    const s=String(value||'').trim();
    if(!s || s==='—')continue;
    const br=parseBrDate(s);
    if(br)return new Date(br.getFullYear(),br.getMonth(),br.getDate());
    const d=new Date(s);
    if(!Number.isNaN(d.getTime()))return new Date(d.getFullYear(),d.getMonth(),d.getDate());
  }
  return null;
}


function canonicalUnitName(value){
  const raw=String(value||'').trim();
  const key=normalizeAnswer(raw).replace(/[^a-z0-9]/g,'');
  if(key==='setaes' || key==='unidadelinhares' || key==='linhares')return 'Unidade Linhares';
  if(key==='setasc' || key==='unidadesaobentodosul' || key==='saobentodosul' || key==='saobento')return 'Unidade São Bento do Sul';
  return raw;
}
function sameCanonicalUnit(a,b){
  return normalizeAnswer(canonicalUnitName(a))===normalizeAnswer(canonicalUnitName(b));
}

function sgqIndicatorFilterState(){
  return {
    unit:document.getElementById('sgqIndicatorUnit')?.value||'all',
    origin:document.getElementById('sgqIndicatorOrigin')?.value||'all',
    period:document.getElementById('sgqIndicatorPeriod')?.value||'all',
    status:document.getElementById('sgqIndicatorStatus')?.value||'all',
    classification:document.getElementById('sgqIndicatorClassification')?.value||'all',
    decisionId:document.getElementById('sgqIndicatorDecision')?.value||'all',
    from:document.getElementById('sgqIndicatorDateFrom')?.value||'',
    to:document.getElementById('sgqIndicatorDateTo')?.value||''
  };
}

function sgqIndicatorMatchesFilters(ro,triageMap,filters){
  if(filters.unit!=='all' && !sameCanonicalUnit(ro?.unidade||'',filters.unit))return false;
  if(filters.origin!=='all' && String(ro?.origemBase||ro?.raw?.__origemBase||'').trim()!==filters.origin)return false;

  if(filters.decisionId&&filters.decisionId!=='all'){const tri=resolvedTriageForRo(ro,triageMap)||{};if((tri.decisionId||tri.decision)!==filters.decisionId)return false;}
  if(filters.classification&&filters.classification!=='all'&&!nucleoRoClassifications(ro,triageMap).some(name=>normalizeAnswer(name)===normalizeAnswer(filters.classification)))return false;
  const statusCode=sgqIndicatorStatusCode(ro,triageMap);
  if(filters.status!=='all' && statusCode!==filters.status)return false;

  const date=sgqIndicatorDate(ro);
  if(filters.period!=='all'){
    if(!date)return false;
    const today=new Date();
    const end=new Date(today.getFullYear(),today.getMonth(),today.getDate(),23,59,59);
    let start=null;

    if(filters.period==='custom'){
      if(filters.from){
        const p=filters.from.split('-').map(Number);
        start=new Date(p[0],p[1]-1,p[2],0,0,0);
      }
      let customEnd=end;
      if(filters.to){
        const p=filters.to.split('-').map(Number);
        customEnd=new Date(p[0],p[1]-1,p[2],23,59,59);
      }
      if(start && date<start)return false;
      if(date>customEnd)return false;
    }else{
      const days=Number(filters.period)||0;
      start=new Date(end);
      start.setDate(start.getDate()-days+1);
      start.setHours(0,0,0,0);
      if(date<start || date>end)return false;
    }
  }
  return true;
}

function populateSgqIndicatorUnits(){
  const sel=document.getElementById('sgqIndicatorUnit');
  if(!sel)return;
  const current=sel.value||'all';
  const units=[...new Set(getAllRoRecords().map(r=>canonicalUnitName(r.unidade||'')).filter(Boolean))]
    .sort((a,b)=>a.localeCompare(b,'pt-BR'));
  sel.innerHTML='<option value="all">Todas as unidades</option>'+
    units.map(u=>`<option value="${escapeHtml(u)}">${escapeHtml(u)}</option>`).join('');
  if([...sel.options].some(o=>o.value===current))sel.value=current;
}

function refreshSgqIndicatorPeriodFields(){
  const custom=document.getElementById('sgqIndicatorCustomPeriod');
  if(custom)custom.classList.toggle('hidden',(document.getElementById('sgqIndicatorPeriod')?.value||'all')!=='custom');
}

function clearSgqIndicatorFilters(){
  ['sgqIndicatorUnit','sgqIndicatorOrigin','sgqIndicatorPeriod','sgqIndicatorStatus','sgqIndicatorClassification','sgqIndicatorDecision'].forEach(id=>{
    const el=document.getElementById(id);
    if(el)el.value='all';
  });
  const from=document.getElementById('sgqIndicatorDateFrom');
  const to=document.getElementById('sgqIndicatorDateTo');
  if(from)from.value='';
  if(to)to.value='';
  refreshSgqIndicatorPeriodFields();
  renderSgqIndicators();
}

function sgqIndicatorData(){
  const triageMap=getSavedTriageMap();
  const filters=sgqIndicatorFilterState();
  const rosAll=getAllRoRecords().filter(ro=>sgqIndicatorMatchesFilters(ro,triageMap,filters));
  const sent=getAllSentPdcas();
  const byRo=new Map();
  sent.forEach(p=>{
    const key=String(p.ro||p.roId||'').trim();
    if(key)byRo.set(key,p);
  });

  const statusCounts={analysis:0,record:0,cancelled:0,directed:0,triage:0,done:0};
  rosAll.forEach(ro=>{
    const code=sgqIndicatorStatusCode(ro,triageMap);
    statusCounts[code]=(statusCounts[code]||0)+1;
  });

  let totalRO=0,pendingPDCA=0,noPresentation=0,overduePDCA=0;
  let openActions=0,overdueActions=0,presented=0,doneActions=0;
  const sectorMap={};
  const actionCounts={pending:0,overdue:0,review:0,done:0};
  const now=new Date();

  rosAll.forEach(baseRo=>{
    const roKey=String(baseRo.numero||baseRo.id||baseRo.codigo||'').trim();
    const tri=resolvedTriageForRo(baseRo,triageMap)||{};
    const ro=syncContestStateToRo({...baseRo});
    const decision=String(tri.decision||'').trim();

    const sector=canonicalSectorName(tri.decisionSector||tri.responsibleSector) || effectiveRoSector(baseRo,triageMap) || 'Sem setor';
    const sectorKey=sectorCompareKey(sector)||'semsetor';
    if(!sectorMap[sectorKey])sectorMap[sectorKey]={name:sector,total:0,pending:0,overdue:0};
    sectorMap[sectorKey].total++;
    // Registro, cancelamento e obsolescência contam como ocorrências, sem cobrança de PDCA.
    const required=decision==='directed' && tri.pdcaRequired!==false;
    if(!required)return;
    totalRO++;

    const p=byRo.get(roKey);
    if(!p){
      pendingPDCA++;
      sectorMap[sectorKey].pending++;
      const d=parseBrDate(tri.pdcaDeadline||effectiveRoDeadline(baseRo));
      if(d&&d<now){
        overduePDCA++;
        sectorMap[sectorKey].overdue++;
      }
      return;
    }

    const ps=pdcaStatusLabel(p);
    if(ps==='Pendente'){
      pendingPDCA++;
      sectorMap[sectorKey].pending++;
    }
    if(!p.apresentadoEm&&ps!=='Pendente')noPresentation++;
    if(p.apresentadoEm)presented++;

    const pd=parseBrDate(tri.pdcaDeadline||effectiveRoDeadline(baseRo)||p.prazo||p.dataLimite||(p.answers||{}).p9||'');
    if(pd&&pd<now&&ps==='Pendente'){
      overduePDCA++;
      sectorMap[sectorKey].overdue++;
    }

    allPdcaActionsForRecord(p).forEach(a=>{
      const pseudo={...p,answers:{...(p.answers||{}),p11:a.action,p12:a.deadline,p13:a.owner},acaoConferidaEm:a.completedAt||a.acaoConferidaEm};
      const ac=inferActionStatus(pseudo);
      actionCounts[ac.code]=(actionCounts[ac.code]||0)+1;
      if(ac.code==='done')doneActions++;
      else openActions++;
      if(ac.code==='overdue')overdueActions++;
    });
  });

  return {
    filteredRO:rosAll.length,
    filters,
    statusCounts,
    totalRO,pendingPDCA,noPresentation,overduePDCA,
    openActions,overdueActions,presented,doneActions,sectorMap,actionCounts
  };
}

function sgqIndicatorMonthlyData(rows){
  const map=new Map();
  (rows||[]).forEach(ro=>{
    const d=sgqIndicatorDate(ro);
    if(!d)return;
    const key=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
    map.set(key,(map.get(key)||0)+1);
  });
  return [...map.entries()]
    .sort((a,b)=>a[0].localeCompare(b[0]))
    .slice(-12)
    .map(([key,value])=>{
      const [y,m]=key.split('-').map(Number);
      const label=new Date(y,m-1,1).toLocaleDateString('pt-BR',{month:'short'});
      return {key,label:label.replace('.',''),value};
    });
}

function renderSgqCharts(d){
  const statusLabels={
    analysis:'Em análise',
    record:'Somente registro',
    cancelled:'Cancelada',
    directed:'Direcionada',
    triage:'Aguardando triagem',
    done:'Concluída'
  };

  const palette={
    analysis:'#d7a600',
    record:'#6b7280',
    cancelled:'#b42318',
    directed:'#315f54',
    triage:'#7c3aed',
    done:'#2f855a'
  };

  const statusOrder=['directed','triage','analysis','record','cancelled','done'];
  const statusData=statusOrder
    .map(k=>({key:k,label:statusLabels[k],value:Number(d.statusCounts[k]||0)}))
    .filter(x=>x.value>0);

  const total=statusData.reduce((s,x)=>s+x.value,0);
  const donut=document.getElementById('sgqStatusDonut');
  const donutTotal=document.getElementById('sgqStatusDonutTotal');
  const legend=document.getElementById('sgqStatusLegend');

  if(donutTotal)donutTotal.textContent=total;

  if(donut){
    if(!total){
      donut.style.background='#edf2f0';
    }else{
      let acc=0;
      const parts=statusData.map(x=>{
        const start=(acc/total)*360;
        acc+=x.value;
        const end=(acc/total)*360;
        return `${palette[x.key]} ${start}deg ${end}deg`;
      });
      donut.style.background=`conic-gradient(${parts.join(',')})`;
    }
  }

  if(legend){
    legend.innerHTML=statusData.length?statusData.map(x=>`
      <div class="sgq-legend-row">
        <span class="sgq-legend-dot" style="--dot:${palette[x.key]}"></span>
        <span>${escapeHtml(x.label)}</span>
        <b>${x.value}</b>
      </div>`).join(''):'<div class="small">Sem dados para os filtros atuais.</div>';
  }

  const sectors=Object.values(d.sectorMap)
    .sort((a,b)=>b.total-a.total)
    .slice(0,10);
  const maxSector=Math.max(1,...sectors.map(x=>x.total||0));
  const sectorBox=document.getElementById('sgqSectorBars');
  if(sectorBox){
    sectorBox.innerHTML=sectors.length?sectors.map(x=>`
      <div class="sgq-bar-row">
        <div class="sgq-bar-label" title="${escapeHtml(x.name||'Sem setor')}">${escapeHtml(x.name||'Sem setor')}</div>
        <div class="sgq-bar-track"></div>
        <div class="sgq-bar-value">${x.total}</div>
      </div>`).join(''):'<div class="small">Sem dados por setor.</div>';
  }

  const triageMap=getSavedTriageMap();
  const rows=getAllRoRecords().filter(ro=>sgqIndicatorMatchesFilters(ro,triageMap,d.filters));
  const months=sgqIndicatorMonthlyData(rows);
  const maxMonth=Math.max(1,...months.map(x=>x.value||0));
  const monthBox=document.getElementById('sgqMonthlyBars');
  if(monthBox){
    monthBox.innerHTML=months.length?months.map(x=>`
      <div class="sgq-month-item">
        <div class="sgq-month-value">${x.value}</div>
        <div class="sgq-month-bar-wrap"></div>
        <div class="sgq-month-label">${escapeHtml(x.label)}</div>
      </div>`).join(''):'<div class="small">Sem datas suficientes para gerar a evolução.</div>';
  }

  const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v};
  set('sgqMiniTriage',d.statusCounts.triage||0);
  set('sgqMiniDirected',d.statusCounts.directed||0);
  set('sgqMiniDone',d.statusCounts.done||0);
  set('sgqMiniRecord',d.statusCounts.record||0);
  set('sgqMiniCancelled',d.statusCounts.cancelled||0);
  set('sgqMiniAnalysis',d.statusCounts.analysis||0);
}

function renderSgqIndicators(){
  if(!isAdmin()){showList();return}
  nucleoRefreshIndicatorDecisions();
  nucleoRefreshIndicatorClassificationOptions();
  const d=sgqIndicatorData();
  nucleoRenderClassificationIndicators(d);
  const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v};
  set('kpiFilteredRO',d.filteredRO);
  set('kpiStatusAnalysis',d.statusCounts.analysis||0);
  set('kpiStatusRecord',d.statusCounts.record||0);
  set('kpiStatusCancelled',d.statusCounts.cancelled||0);
  set('kpiTotalRO',d.totalRO);
  set('kpiPendingPDCA',d.pendingPDCA);
  set('kpiNoPresentation',d.noPresentation);
  set('kpiOverduePDCA',d.overduePDCA);
  set('kpiOpenActions',d.openActions);
  set('kpiOverdueActions',d.overdueActions);
  set('kpiPresented',d.presented);
  set('kpiDoneActions',d.doneActions);

  const sectors=Object.values(d.sectorMap).sort((a,b)=>String(a.name||'').localeCompare(String(b.name||''),'pt-BR'));
  const sectorBox=document.getElementById('sgqBySector');
  if(sectorBox){
    sectorBox.innerHTML=sectors.length?sectors.map(x=>`
      <div class="sgq-row">
        <span><b>${escapeHtml(x.name||'Sem setor')}</b></span>
        <span>${x.total} R.O. · ${x.pending} pendente${x.pending===1?'':'s'} · ${x.overdue} atrasado${x.overdue===1?'':'s'}</span>
      </div>`).join(''):'<div class="small">Sem dados.</div>';
  }

  const labels={pending:'Pendentes',overdue:'Atrasadas',review:'Possível conclusão',done:'Concluídas'};
  const actionBox=document.getElementById('sgqActionStatus');
  if(actionBox){
    actionBox.innerHTML=['pending','overdue','review','done'].map(k=>`
      <div class="sgq-row">
        <span>${labels[k]}</span>
        <b>${d.actionCounts[k]||0}</b>
      </div>`).join('');
  }

  const summary=document.getElementById('sgqIndicatorFilterSummary');
  if(summary){
    const parts=[];
    if(d.filters.classification!=='all')parts.push('Classificação: '+d.filters.classification);
    if(d.filters.unit!=='all')parts.push('Unidade: '+d.filters.unit);
    if(d.filters.origin!=='all')parts.push('Entrada: '+(d.filters.origin==='Externa'?'Externa/SAC':d.filters.origin));
    if(d.filters.status!=='all'){
      const labelsStatus={analysis:'Em análise',record:'Somente para registro',cancelled:'Cancelada',directed:'Direcionada / com PDCA',triage:'Aguardando triagem',done:'Concluída / retorno entregue'};
      parts.push('Status: '+(labelsStatus[d.filters.status]||d.filters.status));
    }
    if(d.filters.period!=='all'){
      parts.push(d.filters.period==='custom'?'Período personalizado':'Últimos '+d.filters.period+' dias');
    }
    summary.textContent=(parts.length?parts.join(' · ')+' · ':'')+d.filteredRO+' R.O.(s) consideradas';
  }

  nucleoRenderSectorDecisionIndicators(d);
  renderSgqCharts(d);
}
async function showSgqIndicators(){
 if(!nucleoFeatureRequire('indicators','consult'))return;
  if(!isAdmin()){showList();return}
  view('sgqIndicatorsView');
  setNav('indicators');
  populateSgqIndicatorUnits();
  refreshSgqIndicatorPeriodFields();

  const loading=document.getElementById('sgqBySector');
  if(loading)loading.innerHTML='<div class="small">Calculando indicadores...</div>';

  await showNucleoLoading('Analisando R.O.s, PDCAs e ações...','Calculando indicadores');
  try{
    await new Promise(resolve=>requestAnimationFrame(resolve));
    renderSgqIndicators();
  }catch(e){
    console.error('Falha ao gerar indicadores SGQ:',e);
    if(loading)loading.innerHTML='<div class="small">Não foi possível gerar os indicadores. Atualize a sincronização e tente novamente.</div>';
  }finally{
    hideNucleoLoading();
  }
}

function getAllSentPdcas(){
  try{
    if(typeof getSentPdcas==='function'){
      const v=getSentPdcas();
      if(Array.isArray(v))return v;
    }
  }catch(e){}
  try{
    if(typeof getSentPdca==='function'){
      const v=getSentPdca();
      if(Array.isArray(v))return v;
    }
  }catch(e){}
  return [];
}

function findSentPdcaById(id){
  const wanted=String(id||'').trim();
  return getAllSentPdcas().find(p=>String(p.id||p.pdcaId||'').trim()===wanted) || null;
}

function pendingActionItems(){
  return getAllSentPdcas()
    .map(p=>{
      const a=p.answers||{};
      const acao=String(a.p11||'').trim();
      if(!acao)return null;
      const status=inferActionStatus(p);
      if(status.code==='done')return null;
      return {
        id:p.id,
        ro:p.ro||'-',
        setor:p.setor||'-',
        acao,
        responsavel:a.p13||p.responsavel||'-',
        prazo:a.p12||'-',
        status,
        deadline:actionDeadlineInfo(p),
        envio:p.envio||'-',
        pdca:p
      };
    })
    .filter(Boolean);
}

function populatePendingActionsSectorFilter(items){
  const sel=document.getElementById('pendingActionsSectorFilter');
  if(!sel)return;
  const current=sel.value||'all';
  const sectors=[...new Set(items.map(x=>x.setor).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
  sel.innerHTML='<option value="all">Todos os setores</option>'+
    sectors.map(s=>`<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
  if([...sel.options].some(o=>o.value===current))sel.value=current;
}

function renderPendingActions(){
  if(!isAdmin())return;

  const items=pendingActionItems();
  populatePendingActionsSectorFilter(items);

  const counts={pending:0,overdue:0,review:0};
  items.forEach(x=>{if(counts[x.status.code]!==undefined)counts[x.status.code]++;});

  const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v};
  set('pendingCountOpen',counts.pending);
  set('pendingCountOverdue',counts.overdue);
  set('pendingCountReview',counts.review);
  set('pendingActionsCount',items.length+' em aberto');

  const statusFilter=document.getElementById('pendingActionsStatusFilter')?.value||'all';
  const sectorFilter=document.getElementById('pendingActionsSectorFilter')?.value||'all';
  const search=normalizeAnswer(document.getElementById('pendingActionsSearch')?.value||'');

  let rows=items.filter(x=>{
    if(statusFilter!=='all'&&x.status.code!==statusFilter)return false;
    if(sectorFilter!=='all'&&x.setor!==sectorFilter)return false;
    if(search){
      const hay=normalizeAnswer([x.ro,x.id,x.setor,x.acao,x.responsavel].join(' '));
      if(!hay.includes(search))return false;
    }
    return true;
  });

  const priority={overdue:0,review:1,pending:2};
  rows.sort((a,b)=>{
    const pa=priority[a.status.code]??9;
    const pb=priority[b.status.code]??9;
    if(pa!==pb)return pa-pb;
    const da=a.deadline.days, db=b.deadline.days;
    if(da===null&&db===null)return 0;
    if(da===null)return 1;
    if(db===null)return -1;
    return da-db;
  });

  const body=document.getElementById('pendingActionsBody');
  if(!body)return;

  body.innerHTML=rows.length?rows.map(r=>`<tr>
    <td>
      <div class="pending-action-ro">
        <b>${escapeHtml(r.ro)}</b>
        <small>${escapeHtml(r.id||'')}</small>
      </div>
    </td>
    <td>${escapeHtml(r.setor)}</td>
    <td>${escapeHtml(r.acao)}</td>
    <td>${escapeHtml(r.responsavel)}</td>
    <td>
      <b>${escapeHtml(r.prazo)}</b>
      <div class="small deadline-text ${r.deadline.cls}" style="margin-top:4px">${escapeHtml(r.deadline.text)}</div>
    </td>
    <td>
      <span class="action-pill ${r.status.code}">${escapeHtml(r.status.label)}</span>
      <div class="small" style="margin-top:5px">${escapeHtml(r.status.reason)}</div>
    </td>
    <td>
      <div class="pending-action-buttons">
        <button class="btn secondary" type="button" onclick="openPdcaReport(\'${escapeHtml(r.id)}\')">Ver PDCA</button>
        <button class="btn primary" type="button" onclick="confirmActionCompletion('${escapeHtml(r.id)}')">Confirmar conclusão</button>
      </div>
    </td>
  </tr>`).join(''):`<tr><td colspan="7" style="text-align:center;color:#667085;padding:24px">Nenhuma ação pendente para os filtros selecionados.</td></tr>`;
}

function confirmActionCompletion(pdcaId){
  if(!nucleoFeatureRequire('pdca','reviewActions'))return;
  if(!isAdmin())return;
  const p=findSentPdcaById(pdcaId);
  if(!p){alert('PDCA não encontrado.');return}

  const a=p.answers||{};
  const acao=String(a.p11||'').trim()||'esta ação';
  const ok=confirm(
    'Confirmar a conclusão desta ação?\n\n'+
    (p.ro||'-')+' — '+acao+
    '\n\nEsta confirmação encerra o acompanhamento da ação pelo SGQ.'
  );
  if(!ok)return;

  markActionCompleted(pdcaId);
}

function showPendingActions(){
  if(!nucleoFeatureRequire('pdca','reviewActions'))return;
  if(!isAdmin()){showList();return}
  view('pendingActionsView');
  setNav('pending');
  renderPendingActions();
}



function printCurrentPdca(){
  const p=window.currentPrintPdca;
  if(!p){
    alert('Nenhum PDCA está aberto para impressão.');
    return;
  }

  renderPdcaPrintDocument(p);

  const report=document.getElementById('pdcaPrintReport');
  if(!report || !report.innerHTML.trim()){
    alert('Não foi possível montar o relatório do PDCA.');
    return;
  }

  document.body.classList.add('print-pdca-document');

  const cleanup=()=>{
    document.body.classList.remove('print-pdca-document');
    window.removeEventListener('afterprint',cleanup);
  };

  window.addEventListener('afterprint',cleanup);

  requestAnimationFrame(()=>{
    requestAnimationFrame(()=>{
      window.print();
    });
  });
}





function pdcaPrintEsc(v){
  return (typeof escapeHtml==='function')
    ? escapeHtml(v==null?'':String(v))
    : String(v==null?'':v);
}

function pdcaPrintDate(v){
  if(!v)return '—';
  const s=String(v);
  const m=s.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if(m)return `${m[3]}-${m[2]}-${m[1]}`;
  const iso=s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if(iso)return `${iso[1]}-${iso[2]}-${iso[3]}`;
  return s.split(' ')[0]||s;
}

function getPdcaPrintAttachments(p){
  const raw=p.attachments||p.anexos||p.images||p.imagens||p.evidencias||[];
  const arr=Array.isArray(raw)?raw:[];
  return arr.map((item,i)=>{
    if(typeof item==='string'){
      return {src:item,name:'Anexo '+(i+1),stage:'',question:''};
    }
    return {
      src:item.src||item.dataUrl||item.url||item.preview||'',
      name:item.name||item.filename||('Anexo '+(i+1)),
      stage:item.stage||item.etapa||'',
      question:item.question||item.pergunta||''
    };
  }).filter(x=>x.src);
}

function pdcaPrintQuestionLines(keys,answers,labels){
  return keys.map((k,i)=>{
    const answer=String(answers[k]??'').trim()||'—';
    return `<div class="pdca-answer-line"><b>${i+1}. ${pdcaPrintEsc(labels[k])}</b><span class="pdca-answer-value">${pdcaPrintEsc(answer)}</span></div>`;
  }).join('');
}

function renderPdcaPrintDocument(p){
  const target=document.getElementById('pdcaPrintReport');
  if(!target)return;

  const a=p.answers||p.respostas||{};
  const labels={
    p1:'Qual é o problema?',
    p2:'Qual é o impacto do problema?',
    p3:'Onde o problema ocorre?',
    p4:'Com que frequência o problema ocorre?',
    p5:'Quais são as possíveis causas do problema?',
    p6:'Por que essas causas ocorrem?',
    p7:'Qual é a causa raiz que deve ser bloqueada?',
    p8:'Qual é a meta SMART?',
    p9:'Qual é o prazo para atingir a meta?',
    p10:'Qual é o status atual da meta?',
    p11:'Qual ação será executada?',
    p12:'Qual é o prazo da ação?',
    p13:'Quais setores são responsáveis pela ação?',
    p14:'Existe algum risco na implantação da ação?',
    d1:'A equipe foi treinada?',
    d2:'A equipe compreendeu a nova forma de trabalho?',
    d3:'Qual é o status do treinamento?',
    d4:'Os recursos necessários estão disponíveis?',
    d5:'Como a execução será registrada?',
    c1:'Os resultados estão conforme a meta SMART?',
    c2:'A causa raiz foi eliminada?',
    c3:'Houve algum efeito colateral?',
    a1:'A melhoria foi padronizada?',
    a2:'Como o novo padrão será acompanhado?',
    a3:'A meta foi atingida?',
    a4:'Quais foram as lições aprendidas?'
  };

  const ro=p.ro||p.numeroRo||p.roNumero||'—';
  const responsavel=p.responsavel||a.p13||'—';
  const setor=p.setor||p.sector||'—';
  const cliente=p.cliente||'—';
  const data=pdcaPrintDate(p.envio||p.dataEnvio||p.sentAt||'');
  const titulo=p.titulo||p.title||a.p1||'—';
  const observacoes=p.observacoes||p.observation||p.obs||'Nenhuma observação geral.';
  const attachments=getPdcaPrintAttachments(p);
  const evidencia=p.evidenciaAcaoCorretiva||p.evidenceCorrectiveAction||(attachments.length?'Sim':'—');
  const tipoRo=p.tipoRo||p.roType||p.origemRo||'—';

  const page1=`
    <section class="pdca-print-page">
      <div class="pdca-doc-topline">
        <span>AVALIA · REGISTRO DE MELHORIA CONTÍNUA</span>
        <span class="pdca-doc-code">FORM-COR-SGQ-0145</span>
      </div>

      <div class="pdca-meta-grid">
        <div class="pdca-meta-cell">
          <span class="pdca-meta-label">Responsável</span>
          <span class="pdca-meta-value">${pdcaPrintEsc(responsavel)}</span>
        </div>
        <div class="pdca-meta-cell">
          <span class="pdca-meta-label">Setor</span>
          <span class="pdca-meta-value">${pdcaPrintEsc(setor)}</span>
        </div>
        
        <div class="pdca-meta-cell">
          <span class="pdca-meta-label">R.O. interna ou externa?</span>
          <span class="pdca-meta-value">${pdcaPrintEsc(tipoRo)}</span>
        </div>

        <div class="pdca-meta-cell">
          <span class="pdca-meta-label">Nº da R.O.</span>
          <span class="pdca-meta-value">${pdcaPrintEsc(ro)}</span>
        </div>
        <div class="pdca-meta-cell">
          <span class="pdca-meta-label">Data</span>
          <span class="pdca-meta-value">${pdcaPrintEsc(data)}</span>
        </div>
        

        <div class="pdca-meta-cell span2">
          <span class="pdca-meta-label">Cliente</span>
          <span class="pdca-meta-value">${pdcaPrintEsc(cliente)}</span>
        </div>
      </div>

      <div class="pdca-quadrants">
        <section class="pdca-q pdca-q-act">
          <div class="pdca-q-head">ACT (AGIR)</div>
          <div class="pdca-q-watermark">A</div>
          <div class="pdca-q-body">${pdcaPrintQuestionLines(['a1','a2','a3','a4'],a,labels)}</div>
        </section>

        <section class="pdca-q pdca-q-plan">
          <div class="pdca-q-head">PLAN (PLANEJAR)</div>
          <div class="pdca-q-watermark">P</div>
          <div class="pdca-q-body">${pdcaPrintQuestionLines(['p1','p2','p3','p4','p5','p6','p7','p8','p9','p10','p11','p12','p13','p14'],a,labels)}</div>
        </section>

        <section class="pdca-q pdca-q-check">
          <div class="pdca-q-head">CHECK (VERIFICAR)</div>
          <div class="pdca-q-watermark">C</div>
          <div class="pdca-q-body">${pdcaPrintQuestionLines(['c1','c2','c3'],a,labels)}</div>
        </section>

        <section class="pdca-q pdca-q-do">
          <div class="pdca-q-head">DO (FAZER)</div>
          <div class="pdca-q-watermark">D</div>
          <div class="pdca-q-body">${pdcaPrintQuestionLines(['d1','d2','d3','d4','d5'],a,labels)}</div>
        </section>
      </div>

      <div class="pdca-doc-footer">
        <strong>ANEXOS:</strong>
        <span>${pdcaPrintEsc(observacoes)}</span>
        <span class="pdca-page-number">PÁGINA 1</span>
      </div>
    </section>`;

  let annex='';
  if(attachments.length){
    annex=`
      <section class="pdca-print-page pdca-annex-page">
        <h1 class="pdca-annex-title">ANEXOS FOTOGRÁFICOS</h1>
        <div class="pdca-annex-subtitle">R.O. ${pdcaPrintEsc(ro)} · ${pdcaPrintEsc(cliente)}</div>
        <div class="pdca-annex-grid">
          ${attachments.map((att,i)=>`
            <div class="pdca-annex-card">
              <div class="pdca-annex-imgbox"><img src="${pdcaPrintEsc(att.src)}" alt="${pdcaPrintEsc(att.name)}"></div>
              <div class="pdca-annex-info">
                <b>${String(i+1).padStart(2,'0')}.${att.stage?' · '+pdcaPrintEsc(att.stage):''}</b>
                <div>${pdcaPrintEsc(att.question||'Evidência anexada ao PDCA')}</div>
                <div style="margin-top:9mm">${pdcaPrintEsc(att.name)}</div>
              </div>
            </div>`).join('')}
        </div>
        <span class="pdca-page-number">PÁGINA 2</span>
      </section>`;
  }

  target.innerHTML=page1+annex;
}



function buildPdcaPresentationDocument(p){
  // Reuse exactly the same document generator used by printing/PDF.
  renderPdcaPrintDocument(p);

  const printReport=document.getElementById('pdcaPrintReport');
  const target=document.getElementById('pdcaPresentationDocument');
  if(!printReport || !target)return false;

  target.innerHTML=printReport.innerHTML;

  // Convert print pages into screen pages without altering their content.
  target.querySelectorAll('.pdca-print-page').forEach(page=>{
    page.classList.add('pdca-screen-page');
  });
  return !!target.innerHTML.trim();
}


function refreshPresentationScreenState(){
  const p=window.currentPrintPdca;
  const badge=document.getElementById('pdcaPresentationCompletedBadge');
  const btn=document.getElementById('pdcaCompletePresentationBtn');
  if(!p || !badge || !btn)return;

  let rec=getPdcaPresentationMap().get(String(p.id||''));
  if(!rec){
    const source=findRoByAnyNumber(p.ro||'',p.origemBase||p.sourceRoOrigin||'');
    if(source?.reclamanteRecebeuPdca){
      rec={
        presentationCompleted:true,
        presentedBy:'Registrado na planilha',
        completedAt:source.pdcaEnviadoReclamanteEm||'',
        claimantDeliveredAt:source.pdcaEnviadoReclamanteEm||''
      };
    }
  }

  if(rec && rec.presentationCompleted){
    badge.textContent='Apresentação concluída';
    badge.className='status-badge answered';
    btn.textContent='Apresentação concluída';
    btn.disabled=true;
  }else{
    badge.textContent='Apresentação em andamento';
    badge.className='status-badge pending';
    btn.textContent='Marcar apresentação como concluída';
    btn.disabled=false;
  }
}

async function completeCurrentPdcaPresentation(){
  const p=window.currentPrintPdca;
  if(!p){
    alert('Nenhum PDCA está aberto.');
    return;
  }
  if(!isAdmin()){
    alert('Somente o SGQ pode concluir a apresentação.');
    return;
  }

  const existing=getPdcaPresentationMap().get(String(p.id||''));
  const roRecord=findRoByAnyNumber(p.ro||'',p.origemBase||p.sourceRoOrigin||'');
  const origin=String(roRecord?.origemBase||roRecord?.raw?.__origemBase||'Interna');
  const alreadyInSheet=String(roRecord?.pdcaEnviadoReclamanteEm||'').trim();

  // Mesmo que a apresentação já tenha sido marcada localmente antes,
  // se a planilha ainda não tem a data do reclamante, o Núcleo corrige/backfill.
  if(existing?.presentationCompleted && (origin!=='Interna' || alreadyInSheet)){
    refreshPresentationScreenState();
    refreshViewedPdcaPresentation();
    return;
  }

  const ok=confirm(
    existing?.presentationCompleted
      ? 'A apresentação já estava registrada no Núcleo, mas a planilha ainda não tem a data de entrega ao reclamante. Corrigir a planilha agora?'
      : 'Confirmar que a resposta deste PDCA foi apresentada/entregue ao reclamante?\n\n'+
        'R.O.: '+(p.ro||'-')+
        '\nSetor: '+(p.setor||'-')+
        '\n\nEssa confirmação preencherá "PDCA ENVIADO PARA O RECLAMANTE (DATA)" na R.O. Interna.'
  );
  if(!ok)return;

  const session=(typeof getSession==='function'?getSession():null)||{};
  const userName=session.name||'Administrador SGQ';
  const now=new Date().toISOString();
  const claimantDeliveredAt=alreadyInSheet ||
    (existing?.claimantDeliveredAt
      ? String(existing.claimantDeliveredAt)
      : new Date().toLocaleDateString('pt-BR')+' '+new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}));

  try{
    if(origin==='Interna' && !alreadyInSheet){
      const result=await portalUpdateRoSheetConfirmed(p.ro||'',{
        pdcaEnviado:claimantDeliveredAt
      });
      if(!result?.sucesso)throw new Error(result?.erro||'A planilha não confirmou a gravação.');
    }
  }catch(sheetError){
    alert('A apresentação NÃO foi concluída porque a planilha não confirmou a data do reclamante.\n\n'+String(sheetError?.message||sheetError));
    return;
  }

  savePdcaPresentationRecord({
    ...(existing||{}),
    pdcaId:String(p.id||''),
    ro:p.ro||'',
    status:'Concluído',
    presentationCompleted:true,
    presentedBy:existing?.presentedBy||userName,
    registeredBy:existing?.registeredBy||userName,
    presentedAt:existing?.presentedAt||now,
    completedAt:existing?.completedAt||now,
    claimantDeliveredAt:claimantDeliveredAt
  });

  // Atualiza também a cópia local da R.O. para a interface refletir imediatamente.
  if(roRecord && origin==='Interna'){
    roRecord.pdcaEnviadoReclamanteEm=claimantDeliveredAt;
    roRecord.reclamanteRecebeuPdca=true;
    if(roRecord.raw)roRecord.raw['PDCA ENVIADO PARA O RECLAMANTE (DATA)']=claimantDeliveredAt;
  }

  refreshPresentationScreenState();
  refreshViewedPdcaPresentation();
  try{renderSentPdcas()}catch(e){}
  try{renderPendingActions()}catch(e){}
  try{refreshRoSummary()}catch(e){}
  try{renderSgqIndicators()}catch(e){}

  alert(origin==='Interna'
    ? 'Apresentação concluída e data de entrega ao reclamante registrada na planilha.'
    : 'Apresentação concluída.');
}

function openPdcaPresentation(p){
  if(!p)return;
  window.currentPrintPdca=p;

  if(!buildPdcaPresentationDocument(p)){
    alert('Não foi possível montar a visualização do PDCA.');
    return;
  }
  const summary=document.getElementById('pdcaPresentationSummary');
  if(summary)summary.innerHTML=pdcaPresentationSummaryHtml(p);

  const title=document.getElementById('pdcaPresentationTitle');
  if(title){
    title.textContent='R.O. '+(p.ro||p.numeroRo||p.roNumero||'—')+' · '+(p.setor||p.sector||'—');
  }

  const overlay=document.getElementById('pdcaPresentationOverlay');
  if(overlay){
    overlay.classList.add('open');
    document.body.style.overflow='hidden';
    const scroll=overlay.querySelector('.pdca-presentation-scroll');
    if(scroll)scroll.scrollTop=0;
    refreshPresentationScreenState();
  }
}

function closePdcaPresentation(){
  const overlay=document.getElementById('pdcaPresentationOverlay');
  if(overlay)overlay.classList.remove('open');

  // Return to the PDCA viewer if it is still open.
  const viewer=document.getElementById('pdcaQuickViewOverlay');
  document.body.style.overflow=(viewer && viewer.classList.contains('open'))?'hidden':'';
}


const PDCA_PRESENTATION_KEY='ro-pdca-presentations-v1';

function getPdcaPresentationMap(){
  try{
    const arr=JSON.parse(localStorage.getItem(PDCA_PRESENTATION_KEY)||'[]');
    return new Map((Array.isArray(arr)?arr:[]).map(x=>[String(x.pdcaId||''),x]));
  }catch(e){
    return new Map();
  }
}

function savePdcaPresentationRecord(record){
  if(!nucleoFeatureRequire('pdca','present'))return;
  const map=getPdcaPresentationMap();
  map.set(String(record.pdcaId),record);
  localStorage.setItem(PDCA_PRESENTATION_KEY,JSON.stringify([...map.values()]));
}

function formatDateTimeBR(value){
  if(!value)return '';
  try{
    return new Date(value).toLocaleString('pt-BR');
  }catch(e){
    return String(value);
  }
}


function pdcaPresentationLabel(pdcaId){
  if(getPdcaPresentationMap().has(String(pdcaId||'')))return 'Concluído';
  const p=findSentPdcaById(pdcaId);
  const ro=p?.ro||'';
  const source=findRoByAnyNumber(ro,'');
  return source?.reclamanteRecebeuPdca ? 'Concluído' : 'Não apresentado';
}

function refreshViewedPdcaPresentation(){
  const p=window.currentPrintPdca;
  const badge=document.getElementById('pdcaPresentationBadge');
  const meta=document.getElementById('pdcaPresentationMeta');
  const btn=document.getElementById('pdcaPresentBtn');
  if(!p || !badge || !meta || !btn)return;

  let rec=getPdcaPresentationMap().get(String(p.id||''));
  if(!rec){
    const source=findRoByAnyNumber(p.ro||'',p.origemBase||p.sourceRoOrigin||'');
    if(source?.reclamanteRecebeuPdca){
      rec={
        presentationCompleted:true,
        presentedBy:'Registrado na planilha',
        completedAt:source.pdcaEnviadoReclamanteEm||'',
        claimantDeliveredAt:source.pdcaEnviadoReclamanteEm||''
      };
    }
  }

  if(rec && rec.presentationCompleted){
    badge.textContent='Apresentação concluída';
    badge.className='status-badge answered';
    meta.textContent='Resposta entregue ao reclamante'+(rec.claimantDeliveredAt||rec.completedAt||rec.presentedAt?' em '+formatDateTimeBR(rec.claimantDeliveredAt||rec.completedAt||rec.presentedAt):'')+(rec.presentedBy?' · '+rec.presentedBy:'');
    btn.textContent='Abrir apresentação';
    btn.disabled=false;
  }else{
    badge.textContent='Não apresentado';
    badge.className='status-badge pending';
    meta.textContent='';
    btn.textContent='Apresentar PDCA';
    btn.disabled=false;
  }
}

function presentCurrentViewedPdca(){
  const p=window.currentPrintPdca;
  if(!p){
    alert('Nenhum PDCA está aberto.');
    return;
  }
  if(!isAdmin()){
    alert('Somente o SGQ pode registrar a apresentação do PDCA.');
    return;
  }

  openPdcaPresentation(p);
}

function openPdcaReport(pdcaId){
  const p=findSentPdcaById(pdcaId);

  if(p) window.currentPrintPdca=p;

  if(!p){
    alert('PDCA não encontrado ou indisponível.');
    return;
  }

  if(typeof canViewPdca==='function' && !canViewPdca(p)){
    alert('PDCA não encontrado ou indisponível.');
    return;
  }

  const overlay=document.getElementById('pdcaQuickViewOverlay');
  const body=document.getElementById('pdcaQuickViewBody');

  if(!overlay || !body){
    alert('Visualizador do PDCA não foi carregado.');
    return;
  }

  const a=p.answers||p.respostas||{};
  const esc=typeof escapeHtml==='function' ? escapeHtml : (v=>String(v??''));

  const labels={
    p1:'Qual é o problema?',
    p2:'Qual é o impacto do problema?',
    p3:'Onde o problema ocorre?',
    p4:'Com que frequência o problema ocorre?',
    p5:'Quais são as possíveis causas do problema?',
    p6:'Por que essas causas ocorrem?',
    p7:'Qual é a causa raiz que deve ser bloqueada?',
    p8:'Qual é a meta SMART?',
    p9:'Qual é o prazo para atingir a meta?',
    p10:'Qual é o status atual da meta?',
    p11:'Qual ação será executada?',
    p12:'Qual é o prazo da ação?',
    p13:'Quais setores são responsáveis pela ação?',
    p14:'Existe algum risco na implantação da ação?',
    d1:'A equipe foi treinada?',
    d2:'A equipe compreendeu a nova forma de trabalho?',
    d3:'Qual é o status do treinamento?',
    d4:'Os recursos necessários estão disponíveis?',
    d5:'Como a execução será registrada?',
    c1:'Os resultados estão conforme a meta SMART?',
    c2:'A causa raiz foi eliminada?',
    c3:'Houve algum efeito colateral?',
    a1:'A melhoria foi padronizada?',
    a2:'Como o novo padrão será acompanhado?',
    a3:'A meta foi atingida?',
    a4:'Quais foram as lições aprendidas?'
  };

  const groups=[
    ['PLAN',['p1','p2','p3','p4','p5','p6','p7','p8','p9','p10','p11','p12','p13','p14']],
    ['DO',['d1','d2','d3','d4','d5']],
    ['CHECK',['c1','c2','c3']],
    ['ACT',['a1','a2','a3','a4']]
  ];

  const ro=p.ro||p.numeroRo||p.roNumero||'-';
  const setor=p.setor||p.sector||'-';
  const envio=p.envio||p.dataEnvio||p.sentAt||'-';

  body.innerHTML=
    `<h1 class="ro-report-title">PDCA — ${esc(ro)}</h1>`+
    `<div class="small" style="margin-bottom:18px">Setor: <b>${esc(setor)}</b> · Enviado em: <b>${esc(envio)}</b></div>`+
    groups.map(([title,keys])=>{
      return `<h2 style="margin:20px 0 8px">${title}</h2>`+
        `<table class="ro-report-table">`+
        keys.map(k=>`<tr><td style="width:43%"><b>${esc(labels[k]||k)}</b></td><td>${esc(a[k]||'-')}</td></tr>`).join('')+
        `</table>`;
    }).join('');

  document.body.classList.add('printing-pdca-ready');
  overlay.classList.add('open');
  overlay.style.display='flex';
  document.body.style.overflow='hidden';
  refreshViewedPdcaPresentation();
}

function closePdcaQuickView(){
  const overlay=document.getElementById('pdcaQuickViewOverlay');
  if(overlay){
    overlay.classList.remove('open');
    overlay.style.display='none';
  }
  document.body.style.overflow='';
  window.currentPrintPdca=null;
}

function canViewPdca(p){
  if(!nucleoManagerScopeAllows(p))return false;
  if(isAdmin() || sameSector(p.setor))return true;

  const roKey=String(p?.ro||p?.roId||p?.numeroRo||'').trim();
  const ro=getAllRoRecords().find(r=>String(r.numero||r.id||r.codigo||'').trim()===roKey);
  return !!(ro && wasRoSubmittedByCurrentUser(ro));
}

function presentReportPdca(){
  const p=window.currentReportPdca;
  if(!p)return;
  window.pendingPresentationPdcaId=p.id;

  const session=getSession();
  document.getElementById('presentationPresenter').value=p.responsavel||'';
  document.getElementById('presentationRecorder').value=session?.name||'';
  document.getElementById('presentationModal').classList.add('open');
}


function shortLabel(q){
  const map={
    'Qual é o problema?':'Problema',
    'Qual é o impacto do problema?':'Impacto',
    'Onde o problema ocorre?':'Local',
    'Com que frequência o problema ocorre?':'Frequência',
    'Quais são as possíveis causas do problema?':'Possíveis causas',
    'Por que essas causas ocorrem?':'Porquês',
    'Qual é a causa raiz que deve ser bloqueada?':'Causa raiz',
    'Qual é a meta SMART?':'Meta SMART',
    'Qual é o prazo para atingir a meta?':'Prazo da meta',
    'Qual é o status atual da meta?':'Status',
    'Qual ação será executada?':'Ação',
    'Qual é o prazo da ação?':'Prazo da ação',
    'Quais setores são responsáveis pela ação?':'Setores responsáveis',
    'Existe algum risco na implantação da ação?':'Risco',
    'A equipe foi treinada?':'Treinamento',
    'A equipe compreendeu a nova forma de trabalho?':'Compreensão',
    'Qual é o status do treinamento?':'Status treinamento',
    'Os recursos necessários estão disponíveis?':'Recursos',
    'Como a execução será registrada?':'Registro',
    'Os resultados estão conforme a meta SMART?':'Meta atingida',
    'A causa raiz foi eliminada?':'Causa eliminada',
    'Houve algum efeito colateral?':'Efeito colateral',
    'A melhoria foi padronizada?':'Padronização',
    'Como o novo padrão será acompanhado?':'Acompanhamento',
    'A meta foi atingida?':'Meta atingida',
    'Quais foram as lições aprendidas?':'Lições aprendidas'
  };
  return map[q]||q.replace(/\?$/,'');
}

/* Minimal self-contained PDF writer. Generates a real downloadable PDF without external libraries. */
function pdfEsc(s){
  return String(s??'').replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)')
    .replace(/[^\x20-\x7E\xA0-\xFF]/g,'?');
}
function latin1Bytes(s){
  const a=new Uint8Array(s.length);
  for(let i=0;i<s.length;i++) a[i]=s.charCodeAt(i)&255;
  return a;
}
function wrapText(text,maxChars){
  const words=String(text||'').replace(/\s+/g,' ').trim().split(' ');
  const lines=[];let line='';
  words.forEach(w=>{
    const test=line?line+' '+w:w;
    if(test.length>maxChars && line){lines.push(line);line=w}else line=test;
  });
  if(line)lines.push(line);
  return lines.length?lines:['-'];
}
function downloadCurrentPdcaPdf(){
  const p=window.currentReportPdca;
  if(!p){alert('Abra um PDCA antes de gerar o PDF.');return}
  const ans=p.answers||{};

  const W=842,H=595;
  const pages=[];

  function makePage(){
    const content=[];
    const cmd=s=>content.push(s);
    const txt=(x,y,size,text,bold=false)=>cmd(`BT /F${bold?2:1} ${size} Tf ${x} ${y} Td (${pdfEsc(text)}) Tj ET`);
    const rect=(x,y,w,h,lw=1)=>cmd(`${lw} w ${x} ${y} ${w} ${h} re S`);
    const fillRect=(x,y,w,h,r,g,b)=>cmd(`${r} ${g} ${b} rg ${x} ${y} ${w} ${h} re f 0 0 0 rg`);
    const line=(x1,y1,x2,y2)=>cmd(`1 w ${x1} ${y1} m ${x2} ${y2} l S`);
    const field=(x,y,w,label,value)=>{
      rect(x,y,w,24); line(x+92,y,x+92,y+24); txt(x+5,y+8,9,label,true);
      const v=String(value||'-'); txt(x+100,y+8,9,v.length>58?v.slice(0,55)+'...':v,false);
    };
    return {content,cmd,txt,rect,fillRect,line,field};
  }

  function renderHeader(pg){
    const {txt,rect,field}=pg;
    txt(36,558,26,'PDCA',true);
    txt(36,542,8,'PLANO DE ACAO CORRETIVA E PREVENTIVA');
    field(36,492,374,'Responsavel:',p.responsavel);
    field(430,492,376,'Setor:',p.setor);
    field(36,460,374,'Data:',(p.envio||'-').split(' ')[0]);
    field(430,460,376,'R.O:',p.ro);
    field(36,428,374,'Cliente:',p.cliente);
    field(430,428,376,'Tipo de R.O:',p.tipoRO||'Externa');
  }

  function buildItems(){
    const get=k=>ans[k]||'Não informado';
    return {
      plan:[
        ['Problema',get('p1')],['Impacto',get('p2')],['Local',get('p3')],['Frequencia',get('p4')],
        ['Possiveis causas',get('p5')],['Porques',get('p6')],['Causa raiz',get('p7')],
        ['Meta SMART',get('p8')],['Prazo da meta',get('p9')],['Status',get('p10')],
        ['Acao',get('p11')],['Prazo da acao',get('p12')],['Responsavel',get('p13')],['Risco',get('p14')]
      ],
      doing:[['Treinamento',get('d1')],['Compreensao',get('d2')],['Status treinamento',get('d3')],['Recursos',get('d4')],['Registro',get('d5')]],
      check:[['Meta atingida',get('c1')],['Causa eliminada',get('c2')],['Efeito colateral',get('c3')]],
      act:[['Padronizacao',get('a1')],['Acompanhamento',get('a2')],['Meta atingida',get('a3')],['Licoes aprendidas',get('a4')]]
    };
  }

  function flattenLines(items,maxChars){
    const out=[];
    for(const [label,val] of items){
      const lines=wrapText(label+': '+(val||'Não informado'),maxChars);
      out.push(...lines);
      out.push('');
    }
    return out;
  }

  function drawQuadrant(pg,x,y,w,h,title,letter,rgb,lines,font=7){
    const {txt,rect,fillRect}=pg;
    rect(x,y,w,h);
    txt(x+6,y+h-14,9,title,true);
    let cy=y+h-30;
    for(const l of lines){
      if(cy<y+24) break;
      if(l) txt(x+15,cy,font,l);
      cy-=font+2.5;
    }
    fillRect(x,y,w,13,...rgb);
    txt(x+w-34,y+20,18,letter,true);
  }

  const items=buildItems();
  const planLines=flattenLines(items.plan,76);
  const actLines=flattenLines(items.act,72);
  const checkLines=flattenLines(items.check,72);
  const doLines=flattenLines(items.doing,72);

  // Approximate capacity of PLAN quadrant on page 1.
  const planCap=27;
  const planPart1=planLines.slice(0,planCap);
  const planPart2=planLines.slice(planCap);

  const pg1=makePage();
  renderHeader(pg1);
  drawQuadrant(pg1,36,211,378,205,'ACT (AGIR)','A',[.41,.68,.24],actLines,6.8);
  drawQuadrant(pg1,428,211,378,205,'PLAN (PLANEJAR)','P',[.96,.47,.13],planPart1,6.2);
  drawQuadrant(pg1,36,42,378,155,'CHECK (VERIFICAR)','C',[.27,.45,.76],checkLines,6.8);
  drawQuadrant(pg1,428,42,378,155,'DO (FAZER)','D',[.94,0,0],doLines,6.8);
  pages.push(pg1.content.join('\n')+'\n');

  if(planPart2.length){
    const pg2=makePage();
    const {txt,rect,fillRect}=pg2;
    txt(36,558,22,'PDCA - CONTINUACAO DO PLANEJAR',true);
    txt(36,540,8,`${p.id||''}  |  ${p.ro||''}  |  ${p.responsavel||''}`);
    rect(36,78,770,435);
    txt(48,493,10,'PLAN (PLANEJAR) - CONTINUACAO',true);
    let cy=470;
    for(const l of planPart2){
      if(cy<105) break;
      if(l) txt(56,cy,7,l);
      cy-=10;
    }
    fillRect(36,78,770,14,.96,.47,.13);
    txt(760,98,20,'P',true);
    pages.push(pg2.content.join('\n')+'\n');
  }

  // PDF objects
  const objects=[];
  const pageObjNums=[];
  let objNum=3;

  for(let i=0;i<pages.length;i++){
    const pageNum=objNum++;
    const contentNum=objNum++;
    pageObjNums.push(pageNum);
    objects[pageNum]=`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /Font << /F1 ${objNum} 0 R /F2 ${objNum+1} 0 R >> >> /Contents ${contentNum} 0 R >>`;
    objects[contentNum]=`<< /Length ${latin1Bytes(pages[i]).length} >>\nstream\n${pages[i]}endstream`;
  }
  const font1Num=objNum++, font2Num=objNum++;
  // patch font refs in page objects
  for(const pageNum of pageObjNums){
    objects[pageNum]=objects[pageNum]
      .replace(`/F1 ${font1Num-2} 0 R`,`/F1 ${font1Num} 0 R`)
      .replace(`/F2 ${font1Num-1} 0 R`,`/F2 ${font2Num} 0 R`);
  }
  objects[1]='<< /Type /Catalog /Pages 2 0 R >>';
  objects[2]=`<< /Type /Pages /Kids [${pageObjNums.map(n=>n+' 0 R').join(' ')}] /Count ${pageObjNums.length} >>`;
  objects[font1Num]='<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
  objects[font2Num]='<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';

  const maxObj=font2Num;
  let pdf='%PDF-1.4\n%\xE2\xE3\xCF\xD3\n', offsets=[0];
  for(let i=1;i<=maxObj;i++){
    offsets[i]=latin1Bytes(pdf).length;
    pdf+=`${i} 0 obj\n${objects[i]}\nendobj\n`;
  }
  const xref=latin1Bytes(pdf).length;
  pdf+=`xref\n0 ${maxObj+1}\n0000000000 65535 f \n`;
  for(let i=1;i<=maxObj;i++) pdf+=String(offsets[i]).padStart(10,'0')+' 00000 n \n';
  pdf+=`trailer\n<< /Size ${maxObj+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;

  const blob=new Blob([latin1Bytes(pdf)],{type:'application/pdf'});
  showPdfBlob(blob,`${p.id||'PDCA'}_${p.ro||'RO'}.pdf`);
}
function escapeHtml(text){
  return String(text).replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}

function refreshPdcaSidebarBadge(){
  try{refreshMenuNotificationBadges()}catch(e){console.warn('Falha ao atualizar indicador de PDCA:',e)}
}
function showSentPdcas(){
  if(!nucleoFeatureRequire('pdca','received'))return;
  // A abertura da tela não pode depender de nenhum indicador lateral.
  view('sentView');
  setNav('sent');
  const lifecycle=document.getElementById('sentLifecycleFilter');if(lifecycle){lifecycle.value=isAdmin()?'active':'all';lifecycle.style.display=isAdmin()?'':'none';}
  renderSentPdcas();
  refreshPdcaSidebarBadge();
}
function renderSentPdcas(){
 refreshPdcaSidebarBadge();
 const q=String(document.getElementById('sentSearch')?.value||'').toLowerCase(),sf=document.getElementById('sentStatusFilter')?.value||'todos';
 let data=getSentPdcas();if(!isAdmin()){const email=currentEmail();data=data.filter(p=>String(p.email||'').toLowerCase()===email);}
 const rows=data.map(p=>{const ro=getAllRoRecords().find(r=>String(r.numero||r.id)===String(p.ro)&&(!explicitRecordUnit(p)||explicitRecordUnit(r)===explicitRecordUnit(p))),user=ro?resolveRoClaimant(ro):null;return {p,ro,user,name:p.externalPdf&&p.fileName?p.fileName.replace(/\.pdf$/i,''):p.id};}).filter(({p,ro,user,name})=>[name,p.ro,p.responsavel,p.setor,p.cliente,ro?roRegistrantName(ro):'',user?personDisplayName(user):''].join(' ').toLowerCase().includes(q)&&(sf==='todos'||p.status===sf));
 const body=document.getElementById('sentRows');if(!body)return;
 const lifecycle=isAdmin()?(document.getElementById('sentLifecycleFilter')?.value||'active'):'all';
 nucleoRenderPdcaLifecycle(data,lifecycle);
 const visibleRows=rows.filter(({p})=>lifecycle==='all'||(lifecycle==='history')===!!nucleoPdcaDelivery(p));
 body.innerHTML=visibleRows.length?visibleRows.map(({p,ro,user,name})=>{
  const date=new Date(p.sentAt||p.envio),when=Number.isNaN(date.getTime())?p.envio:date.toLocaleString('pt-BR');
  const claimant=user?personDisplayName(user):(ro?roRegistrantName(ro):'');
  const delivery=nucleoPdcaDelivery(p),confirmed=!!delivery||!!(ro&&claimantIdentityIndex().bindings.get(claimantRoKey(ro))?.confirmedAt);
  const detail=delivery?'Encerrada — entregue ao reclamante':confirmed?'Reclamante confirmado — falta entregar a resposta':user?'Cadastro identificado — confirmar':'Reclamante a confirmar';
  return '<tr class="click" onclick="openPdcaReport(\''+escapeHtml(p.id)+'\')"><td><b>'+escapeHtml(name||'PDCA')+'</b>'+(p.externalPdf?'<div class="small">'+escapeHtml(p.setor||'')+' · V'+escapeHtml(p.version||1)+'</div>':'')+'</td><td>'+escapeHtml(p.ro||'')+'</td><td>'+escapeHtml(p.responsavel||'')+'</td><td>'+escapeHtml(claimant||'—')+'<div class="small">'+escapeHtml(detail)+'</div>'+(isAdmin()&&p.externalPdf&&!delivery?'<button class="btn secondary" type="button" onclick="event.stopPropagation();'+(confirmed?'nucleoConsultPdcaClaimant':'confirmReceivedPdcaClaimant')+'(\''+escapeHtml(p.id)+'\')">'+(confirmed?'Consultar reclamante':'Confirmar reclamante')+'</button>'+(confirmed?'<button class="btn primary" type="button" onclick="event.stopPropagation();confirmReceivedPdcaClaimant(\''+escapeHtml(p.id)+'\')">Entregar resposta</button>':''):'')+'</td><td>'+escapeHtml(canonicalUnitName(p.unidade||p.unit||''))+'</td><td>'+escapeHtml(when||'')+'</td><td><span class="badge">'+escapeHtml(delivery?'Encerrada':confirmed?'Aguardando entrega':'Confirmar reclamante')+'</span></td><td class="sent-action">Ver PDCA →</td></tr>';
 }).join(''):'<tr><td colspan="8" class="small">Nenhum PDCA encontrado.</td></tr>';
}

function getAccessState(){
  let state;
  try{ state=JSON.parse(localStorage.getItem(ACCESS_KEY)||'null'); }catch(e){}
  if(!state || typeof state!=='object') state={};

  if(!Array.isArray(state.admins)) state.admins=[];
  const normalized=state.admins.map(x=>String(x).trim().toLowerCase());
  if(!normalized.includes('sgq@empresa.com')) state.admins.unshift('sgq@empresa.com');

  if(typeof state.currentUser!=='string') state.currentUser='';

  localStorage.setItem(ACCESS_KEY,JSON.stringify(state));
  return state;
}
function saveAccessState(state){
  localStorage.setItem(ACCESS_KEY,JSON.stringify(state));
  refreshAccessUI();
}
function currentEmail(){
  const session=getSession();
  if(session?.email)return session.email.trim().toLowerCase();
  return '';
}

function currentSector(){
  const s=getSession();
  return (s?.sector||'').trim().toLowerCase();
}
function sameSector(sector){
  return sameCanonicalSector(sector,currentSector());
}

function getRoTriageRecord(ro){
  try{
    if(ro?.__triageRecord)return ro.__triageRecord;
    const base=String(ro?.numero||ro?.id||ro?.codigo||'').trim();
    if(!base)return null;
    const map=getSavedTriageMap();
    return resolvedTriageForRo(ro,map);
  }catch(e){return null}
}

function effectiveResponsibleSector(ro){
  const tri=getRoTriageRecord(ro);
  if(tri?.decision==='directed' && String(tri.responsibleSector||'').trim()){
    return String(tri.responsibleSector).trim();
  }
  return '';
}

function getOperationalRoView(ro){
  if(!ro)return ro;
  const tri=getRoTriageRecord(ro);
  const copy={...ro};

  // Preserve what came from the spreadsheet only as reference.
  copy.setorPlanilha=ro.setor||'';

  if(!tri || !tri.decision){
    copy.status='Aguardando triagem';
    copy.pdca='A definir';
    copy.setorResponsavel='';
    return copy;
  }

  if(tri.decision==='directed'){
    copy.setorResponsavel=tri.responsibleSector||'';
    copy.setor=tri.responsibleSector||'';
    copy.prazo=tri.pdcaDeadline||copy.prazo||'—';
    if(tri.pdcaExternal===true || String(tri.pdcaSource||'').toLowerCase()==='external'){
      copy.status='PDCA externo';
      copy.pdca='PDCA externo';
      copy.prazo='—';
    }else{
      copy.status='Aguardando resposta';
      copy.pdca='Obrigatório';
    }
  }else if(tri.decision==='record'){
    copy.setorResponsavel='';
    copy.status='Somente para registro';
    copy.pdca='Não se aplica';
    copy.prazo='—';
  }else if(tri.decision==='cancelled'){
    copy.setorResponsavel='';
    copy.status='Cancelada';
    copy.pdca='Não se aplica';
    copy.prazo='—';
  }

  // Contestation may temporarily override the triage state.
  try{syncContestStateToRo(copy)}catch(e){}
  return copy;
}

function normalizePortalUnit(v){
  const s=normalizeAnswer(String(v||''));

  // Regra operacional:
  // somente identificações explícitas da unidade ES/Linhares/Filial são Filial.
  // Qualquer outro valor, inclusive vazio/legado, é tratado como Matriz.
  if(
    s.includes('linhares') ||
    s.includes('seta es') ||
    s==='filial' ||
    s.includes('filial')
  ) return 'filial';

  return 'matriz';
}

function currentUserUnit(){
  return normalizePortalUnit(getSession()?.unit||'');
}
function roUnit(ro){
  return normalizePortalUnit(
    ro?.unidade ||
    ro?.unit ||
    ro?.raw?.Unidade ||
    ro?.raw?.['Unidade produtiva'] ||
    ro?.raw?.['Em qual unidade produtiva ocorreu o problema?'] ||
    ''
  );
}
function adminScopeUnit(){const s=getSession()||{};return s.role==='admin'?'todas':s.role==='quality'?'filial':currentUserUnit();}
function isGeneralAdmin(){
  return isAdmin() && adminScopeUnit()==='todas';
}
function getUnifiedSectors(){
  const cfg=getAdminConfig()||{};
  const list=Array.isArray(cfg.unifiedSectors)?cfg.unifiedSectors:[];
  return list.map(x=>String(x||'').trim()).filter(Boolean);
}
function isUnifiedSector(sector){
  const wanted=normalizeAnswer(String(sector||''));
  return !!wanted && getUnifiedSectors().some(s=>normalizeAnswer(s)===wanted);
}
function sameUnitAsCurrentUser(ro){
  if(isGeneralAdmin())return true;
  if(getSession()?.accessUnits&&!qualityRecordAllowed(ro))return false;
  if(getSession()?.role==='quality')return qualityRecordAllowed(ro);
  return currentUserUnit()===roUnit(ro);
}

function canAdminSeeAllPortalRecords(){
  return isGeneralAdmin();
}

function isManager(){
  return getSession()?.role==='manager';
}
function managedSectorsForCurrentUser(){
  const s=getSession()||{};
  let sectors=Array.isArray(s.managedSectors)?s.managedSectors:[];
  if(!sectors.length && s.email){
    const u=getOperationalUsers().find(x=>String(x.email||'').toLowerCase()===String(s.email||'').toLowerCase());
    sectors=Array.isArray(u?.managedSectors)?u.managedSectors:[];
  }
  return [...new Set(sectors.map(x=>String(x||'').trim()).filter(Boolean))];
}
function managesSector(sector){
  const wanted=normalizeAnswer(sector||'');
  return managedSectorsForCurrentUser().some(s=>normalizeAnswer(s)===wanted);
}
function managersForSector(sector){
  const wanted=normalizeAnswer(sector||'');
  return getOperationalUsers().filter(u=>
    u.role==='manager' &&
    u.approvalStatus!=='pending' &&
    u.approvalStatus!=='rejected' &&
    (Array.isArray(u.managedSectors)?u.managedSectors:[]).some(s=>normalizeAnswer(s)===wanted)
  );
}
function refreshNewUserManagerFields(){
  const role=document.getElementById('newUserRole')?.value||'operational';
  const wrap=document.getElementById('newUserManagedSectorsWrap');
  const sel=document.getElementById('newUserManagedSectors');
  if(wrap)wrap.classList.toggle('hidden',role!=='manager');
  if(sel){
    const selected=new Set([...sel.selectedOptions].map(o=>o.value));
    sel.innerHTML=getConfiguredSectorsForTriage().map(s=>`<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
    [...sel.options].forEach(o=>o.selected=selected.has(o.value));
  }
}
function openManagerSectorsEditor(key){
  if(!isAdmin())return;
  const u=getOperationalUsers().find(x=>String(x.email||x.name)===String(key));if(!u)return;
  if(u.role==='admin'&&!nucleoPersonPermissions(getSession()).sgq)return;
  const role=document.getElementById('managerRoleSelect');
  const sel=document.getElementById('managerSectorsSelect');
  const keyEl=document.getElementById('managerSectorsUserKey');
  const title=document.getElementById('managerSectorsTitle');
  if(keyEl)keyEl.value=String(u.email||u.name||'');
  if(title)title.textContent='Configurar acesso · '+(u.name||u.email||'Usuário');
  if(role){role.value=u.role==='manager'||(u.managedSectors||[]).length?'manager':'operational';role.disabled=false;}
  if(sel){
    const current=new Set(Array.isArray(u.managedSectors)?u.managedSectors:[]);
    sel.innerHTML=getConfiguredSectorsForTriage().map(s=>`<option value="${escapeHtml(s)}" ${current.has(s)?'selected':''}>${escapeHtml(s)}</option>`).join('');
  }
  refreshManagerSectorsVisibility();
  document.getElementById('managerSectorsOverlay')?.classList.add('open');
  document.body.style.overflow='hidden';
}
function refreshManagerSectorsVisibility(){
  const field=document.getElementById('managerSectorsField');
  if(field)field.style.display=document.getElementById('managerRoleSelect')?.value==='manager'?'block':'none';
}
function closeManagerSectorsEditor(){
  document.getElementById('managerSectorsOverlay')?.classList.remove('open');document.body.style.overflow='';
}
function saveManagerSectorsEditor(){
 if(!nucleoFeatureRequire('users','edit'))return;
  if(!isAdmin())return;
  const key=document.getElementById('managerSectorsUserKey')?.value||'';
  const role=document.getElementById('managerRoleSelect')?.value||'operational';
  const managed=role==='manager'?[...(document.getElementById('managerSectorsSelect')?.selectedOptions||[])].map(o=>o.value):[];
  if(role==='manager'&&!managed.length){alert('Selecione pelo menos um setor sob gestão.');return}
  const users=getOperationalUsers();const i=users.findIndex(u=>String(u.email||u.name)===String(key));if(i<0)return;
  users[i]={...users[i],role:users[i].role==='admin'?'admin':role,managedSectors:managed,updatedAt:new Date().toISOString(),updatedBy:getSession()?.name||'SGQ'};
  localStorage.setItem(USERS_KEY,JSON.stringify(users));
  portalBackendSave('users',users[i].email||users[i].name,users[i]);
  addPortalAuditEvent('alterar_acesso_gestor',users[i].email||users[i].name,{role,managedSectors:managed});
  closeManagerSectorsEditor();renderOperationalUsers();
  alert(role==='manager'?'Gestor atualizado. Setores: '+managed.join(', ')+'.':'Usuário alterado para acesso operacional.');
}
function notifyManagersOfDirectedRo(roKey,sector,triageRo,responsibleUserName){
  const managers=managersForSector(sector);
  managers.forEach(manager=>{
    createNotification({
      type:'ro',skipEmail:true,
      audience:'user',
      userKey:String(manager.email||'').trim().toLowerCase(),
      sector,
      ro:roKey,
      unidade:triageRo?.unidade||'',
      tipoRO:triageRo?.tipoRO||triageRo?.tipo||'',
      cliente:triageRo?.cliente||'',
      title:'R.O. direcionada para setor sob sua gestão',
      message:responsibleUserName
        ? `A ${roKey} foi direcionada para ${sector} · ${responsibleUserName}. Você recebeu para acompanhamento como gestor do setor.`
        : `A ${roKey} foi direcionada para ${sector}. Você recebeu para acompanhamento como gestor do setor.`
    });
  });
}

function canViewRO(ro){
  if(!nucleoManagerScopeAllows(ro))return false;
  // ADM Geral vê as duas unidades. ADM Matriz/Filial fica restrito à sua unidade.
  if(isAdmin())return getSession()?.role==='quality'?qualityRecordAllowed(ro):isGeneralAdmin()||sameUnitAsCurrentUser(ro);

  const tri=getRoTriageRecord(ro);
  if(!tri || tri.decision!=='directed')return false;
  const linked=(getSession()?.sectorMemberships||[]).some(m=>normalizePortalUnit(m.unit)===roUnit(ro)&&normalizeAnswer(m.sector)===normalizeAnswer(tri.responsibleSector));
  if(linked)return userMatchesDirectedPerson(tri);

  // Regra de unidade:
  // usuário comum vê a própria unidade; setor explicitamente unificado também
  // recebe R.O.s direcionadas a ele vindas da outra unidade como uma R.O. normal.
  const crossUnitUnified=isUnifiedSector(tri.responsibleSector) &&
    (sameSector(tri.responsibleSector) || (isManager() && managesSector(tri.responsibleSector)));
  if(!sameUnitAsCurrentUser(ro) && !crossUnitUnified)return false;

  // Dentro do escopo permitido, a R.O. precisa estar direcionada ao setor.
  // Gestor vinculado ao setor sempre acompanha, mesmo quando existe
  // uma pessoa específica responsável.
  if(isManager() && managesSector(tri.responsibleSector))return true;

  if(!sameSector(tri.responsibleSector))return false;

  // Se o SGQ escolheu uma pessoa específica, somente ela recebe a R.O.
  // Sem pessoa específica, todos os usuários cadastrados no setor recebem.
  return userMatchesDirectedPerson(tri);
}

function isAdmin(){
  // A permissão deve vir exclusivamente do perfil autenticado pelo backend.
  // Não inferir ADM pelo e-mail/cache local: isso fazia um usuário operacional
  // ganhar o menu completo quando usava um e-mail presente na antiga lista de ADMs.
  const session=getSession();
  return !!(session && ['admin','quality'].includes(String(session.role||'').toLowerCase()));
}

function showConfigSection(name){
  const names=['users','units','triage','pdca','actions','integration','columns'];
  names.forEach(n=>{
    const sec=document.getElementById('cfg'+n.charAt(0).toUpperCase()+n.slice(1));
    const tab=document.getElementById('cfgTab'+n.charAt(0).toUpperCase()+n.slice(1));
    if(sec)sec.classList.toggle('active',n===name);
    if(tab)tab.classList.toggle('active',n===name);
  });
}


function getAdminConfig(){
  let c={};
  try{c=JSON.parse(localStorage.getItem(ADMIN_CONFIG_KEY)||'{}')||{};}catch(e){c={};}

  try{
    const sync=getSavedIntegrationSettings();
    if(sync.apiUrl)c.apiUrl=sync.apiUrl;
    if(sync.apiKey)c.apiKey=sync.apiKey;
    if(sync.autoSync!==undefined)c.autoSync=sync.autoSync;
  }catch(e){}

  return c;
}

function loadAdminConfig(){
  const c=getAdminConfig();

  document.querySelectorAll('#settingsView input, #settingsView select, #settingsView textarea').forEach((el,i)=>{
    if(!el.id) el.id='adminCfgAuto'+i;
    if(Object.prototype.hasOwnProperty.call(c,el.id)) el.value=c[el.id];
  });

  // A integração é restaurada do armazenamento dedicado para não sumir
  // depois da sincronização da base central.
  const integration=getSavedIntegrationSettings();
  if(document.getElementById('apiUrl'))document.getElementById('apiUrl').value=integration.apiUrl||c.apiUrl||'';
  if(document.getElementById('apiKey'))document.getElementById('apiKey').value=integration.apiKey||c.apiKey||'';
  if(document.getElementById('autoSync'))document.getElementById('autoSync').value=String(integration.autoSync||c.autoSync||'0');
  if(document.getElementById('roSyncPeriod'))document.getElementById('roSyncPeriod').value=String(integration.roSyncPeriod||c.roSyncPeriod||'all');
  if(document.getElementById('roSyncDateFrom'))document.getElementById('roSyncDateFrom').value=integration.roSyncDateFrom||c.roSyncDateFrom||'';
  updateRoSyncPeriodUi();

  const st=document.getElementById('configSavedState');
  if(st && c.__savedAt){
    st.classList.remove('hidden');
    st.textContent='Configurações salvas em '+c.__savedAt;
  }

  refreshSectorSelectors();
  renderSectorEmailMap();
  try{renderSectorAliases()}catch(e){}
  if(document.getElementById('sgqNotificationEmail'))document.getElementById('sgqNotificationEmail').value=notificationEmailValue(c.sgqNotificationEmail||'');
  if(document.getElementById('directorSacEmail'))document.getElementById('directorSacEmail').value=notificationEmailValue(c.directorSacEmail||'');
  if(document.getElementById('emailNotificationsEnabled'))document.getElementById('emailNotificationsEnabled').value=c.emailNotificationsEnabled||'Sim';
  refreshNotificationBell();
  if(isAdmin())setTimeout(refreshEmailHistory,250);

  loadRuleCenter();
  try{populateAdminCleanupRos();}catch(e){}
}


function cleanupRoKey(){
  return String(document.getElementById('adminCleanupRo')?.value||'').trim();
}

function populateAdminCleanupRos(){
  const sel=document.getElementById('adminCleanupRo');
  if(!sel || !isAdmin())return;

  const current=sel.value||'';
  const rows=getAllRoRecords().slice().sort((a,b)=>
    String(a.numero||'').localeCompare(String(b.numero||''),'pt-BR',{numeric:true})
  );

  sel.innerHTML='<option value="">Selecione uma R.O...</option>'+
    rows.map(r=>{
      const key=String(r.numero||r.id||r.codigo||'').trim();
      const label=[key,r.cliente||'',r.origemBase||''].filter(Boolean).join(' · ');
      return `<option value="${escapeHtml(key)}">${escapeHtml(label)}</option>`;
    }).join('');

  if(current && [...sel.options].some(o=>o.value===current))sel.value=current;
  refreshAdminCleanupPreview();
}

function adminCleanupLinkedPdca(roKey){
  return getAllSentPdcas().filter(p=>roNumbersSameLegacy(p.ro||p.roId||'',roKey));
}

function refreshAdminCleanupPreview(){
  const box=document.getElementById('adminCleanupPreview');
  if(!box)return;
  const key=cleanupRoKey();
  if(!key){
    box.textContent='Selecione uma R.O. para verificar o que existe vinculado.';
    return;
  }

  const tri=getSavedTriageMap().get(key);
  const pdcas=adminCleanupLinkedPdca(key);
  const actionCount=pdcas.reduce((sum,p)=>sum+allPdcaActionsForRecord(p).length,0);

  const triText=tri
    ? `Triagem: ${triageDecisionLabel(tri.decision||'new')}${tri.responsibleSector?' · '+tri.responsibleSector:''}`
    : 'Triagem: nenhuma';
  const pdcaText=pdcas.length
    ? `PDCA: ${pdcas.length} registro(s) · ${actionCount} ação(ões)`
    : 'PDCA: nenhum';

  box.textContent=triText+' | '+pdcaText;
}

function removePdcaLocalRecords(roKey,pdcas){
  const ids=new Set((pdcas||[]).map(p=>String(p.id||'')));

  const sent=getSentPdca().filter(p=>!ids.has(String(p.id||'')));
  safeStorageSet(SENT_PDCA_KEY,JSON.stringify(sent));
  try{safeStorageSet(SENT_PDCA_KEY,JSON.stringify(sent))}catch(e){}

  try{
    const drafts=getPdcaDrafts();
    Object.keys(drafts).forEach(k=>{
      const d=drafts[k];
      if(roNumbersSameLegacy(d?.ro||k.split('@@')[0],roKey))delete drafts[k];
    });
    safeStorageSet(PDCA_DRAFTS_KEY,JSON.stringify(drafts));
  }catch(e){}

  try{
    const presentations=JSON.parse(localStorage.getItem(PDCA_PRESENTATION_KEY)||'[]');
    const clean=(Array.isArray(presentations)?presentations:[])
      .filter(x=>!ids.has(String(x.pdcaId||'')) && !roNumbersSameLegacy(x.ro||'',roKey));
    localStorage.setItem(PDCA_PRESENTATION_KEY,JSON.stringify(clean));
  }catch(e){}
}

async function adminDeleteTriageForRo(skipConfirm=false){
  if(!isAdmin())return false;
  const key=cleanupRoKey();
  if(!key){alert('Selecione uma R.O.');return false;}

  if(!skipConfirm){
    const ok=confirm(
      'Excluir o direcionamento/triagem de '+key+'?\n\n'+
      'A R.O. voltará para "Aguardando triagem". A R.O. original não será excluída.'
    );
    if(!ok)return false;
  }

  const map=getSavedTriageMap();
  map.delete(key);
  localStorage.setItem(TRIAGE_KEY,JSON.stringify([...map.values()]));
  portalBackendDelete('triage',key);

  // Limpa o direcionamento operacional na planilha sem apagar a R.O.
  try{
    await portalUpdateRoSheetConfirmed(key,{
      setor:'',
      pessoa:'',
      status:'',
      dataEnvio:''
    });
  }catch(e){
    console.warn('Triagem removida do Núcleo, mas a planilha não confirmou a limpeza.',e);
  }

  // Atualiza o modelo local imediatamente.
  const ro=findRoByAnyNumber(key,'');
  if(ro){
    ro.setor='Não direcionado';
    ro.setorResponsavelPlanilha='';
    ro.pessoaResponsavel='';
    ro.status='Aguardando triagem';
    if(ro.raw){
      ro.raw.__setorResponsavel='';
      ro.raw.__pessoaResponsavel='';
      ro.raw.__statusOperacional='';
      ro.raw.__dataEnvioOperacional='';
    }
  }

  try{renderTriage()}catch(e){}
  try{refreshRoSummary()}catch(e){}
  try{refreshMenuNotificationBadges()}catch(e){}
  refreshAdminCleanupPreview();
  if(!skipConfirm)alert('Direcionamento/triagem excluído.');
  return true;
}

async function adminDeletePdcaForRo(skipConfirm=false){
  if(!isAdmin())return false;
  const key=cleanupRoKey();
  if(!key){alert('Selecione uma R.O.');return false;}

  const pdcas=adminCleanupLinkedPdca(key);
  if(!pdcas.length){
    if(!skipConfirm)alert('Não há PDCA vinculado a esta R.O.');
    return true;
  }

  if(!skipConfirm){
    const ok=confirm(
      'Excluir '+pdcas.length+' PDCA(s) vinculado(s) a '+key+'?\n\n'+
      'Também serão removidas as ações e a apresentação relacionadas. Esta operação é para limpeza de testes.'
    );
    if(!ok)return false;
  }

  // Remove coleções centrais.
  pdcas.forEach(p=>{
    allPdcaActionsForRecord(p).forEach(a=>{
      if(a?.id)portalBackendDelete('pdca_actions',a.id);
    });
    if(p?.id)portalBackendDelete('pdca_sent',p.id);
  });

  removePdcaLocalRecords(key,pdcas);

  // Limpa campos de PDCA na planilha mantendo a triagem/direcionamento.
  const ro=findRoByAnyNumber(key,'');
  const origin=String(ro?.origemBase||ro?.raw?.__origemBase||'');
  try{
    const fields=origin==='Externa'
      ? {prazoConclusao:'',status:'Pendente',dataEnvio:'',resultado:''}
      : {pdcaEnviado:'',acaoPrevista:'',prazoConclusao:'',status:'Pendente',dataEnvio:''};
    await portalUpdateRoSheetConfirmed(key,fields);
  }catch(e){
    console.warn('PDCA removido do Núcleo, mas a planilha não confirmou a limpeza dos campos do PDCA.',e);
  }

  if(ro){
    ro.pdca='Obrigatório';
    ro.status=getSavedTriageMap().has(key)?'Aguardando resposta':'Aguardando triagem';
    ro.pdcaEnviadoReclamanteEm='';
    ro.reclamanteRecebeuPdca=false;
  }

  try{renderSentPdcas()}catch(e){}
  try{renderTriage()}catch(e){}
  try{renderActionsDashboard()}catch(e){}
  try{refreshRoSummary()}catch(e){}
  try{refreshPdcaSidebarBadge()}catch(e){}
  refreshAdminCleanupPreview();

  if(!skipConfirm)alert('PDCA de teste excluído.');
  return true;
}

async function adminDeleteTestDataForRo(){
  if(!isAdmin())return;
  const key=cleanupRoKey();
  if(!key){alert('Selecione uma R.O.');return;}

  const ok=confirm(
    'Excluir PDCA E direcionamento/triagem de '+key+'?\n\n'+
    'A R.O. original continuará na planilha e voltará para "Aguardando triagem".'
  );
  if(!ok)return;

  await adminDeletePdcaForRo(true);
  await adminDeleteTriageForRo(true);

  refreshAdminCleanupPreview();
  alert('Dados de teste removidos. A R.O. foi mantida.');
}


async function saveIntegrationSettingsConfirmed(){
  if(!isAdmin()){alert('Configuração indisponível.');return false}
  const sync=saveIntegrationSettings(true);
  if(!sync)return false;
  const st=document.getElementById('configSavedState');
  if(st){st.classList.remove('hidden');st.textContent='Confirmando integração na base central...'}
  try{
    const res=await portalJsonp({
      acao:'portal_save_config',
      dados:JSON.stringify(getAdminConfig()),
      ator:getSession()?.name||'SGQ'
    },60000);
    if(!res?.sucesso)throw new Error(res?.erro||'A base central não confirmou a integração.');
    if(st)st.textContent='Integração salva na base central.';
    alert('Integração atualizada para todos os usuários.');
    return true;
  }catch(e){
    if(st)st.textContent='Integração não confirmada na base central.';
    alert('Não foi possível salvar a integração para todos: '+(e?.message||e));
    return false;
  }
}
function saveIntegrationSettings(silent=false){
  if(!requireIntegrationUnlock())return;

  const current=getSavedIntegrationSettings();
  const apiUrl=(document.getElementById('apiUrl')?.value||current.apiUrl||'').trim();
  const apiKey=(document.getElementById('apiKey')?.value||current.apiKey||'').trim();
  const autoSync=document.getElementById('autoSync')?.value||current.autoSync||'0';
  const roSyncPeriod=document.getElementById('roSyncPeriod')?.value||current.roSyncPeriod||'all';
  const roSyncDateFrom=document.getElementById('roSyncDateFrom')?.value||current.roSyncDateFrom||'';
  const roSyncDateTo='';

  if(roSyncPeriod==='custom' && !roSyncDateFrom){
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
  const periodChanged=currentRoSyncPeriodSignature(current)!==currentRoSyncPeriodSignature(sync);

  // A integração fica em uma chave exclusiva para não ser apagada
  // quando a configuração central é sincronizada.
  localStorage.setItem(INTEGRATION_PERSIST_KEY,JSON.stringify(sync));
  localStorage.setItem('ro-sync-settings',JSON.stringify(sync));

  const c=getAdminConfig();
  c.apiUrl=apiUrl;
  c.apiKey=apiKey;
  c.autoSync=autoSync;
  c.roSyncPeriod=roSyncPeriod;
  c.roSyncDateFrom=roSyncDateFrom;
  c.roSyncDateTo=roSyncDateTo;
  c.__savedAt=new Date().toLocaleString('pt-BR');
  localStorage.setItem(ADMIN_CONFIG_KEY,JSON.stringify(c));

  if(periodChanged){
    // O período faz parte da identidade do cache. Nunca reutiliza dados de outro intervalo.
    importedRoCacheNeedsRefresh=true;
    clearImportedRosDurable().catch(()=>{});
    try{
      localStorage.removeItem(IMPORTED_ROS_INTERNA_KEY);
      localStorage.removeItem(IMPORTED_ROS_EXTERNA_KEY);
      localStorage.removeItem(IMPORTED_ROS_KEY);
    }catch(e){}
  }

  if(!silent){
    const st=document.getElementById('configSavedState');
    if(st){
      st.classList.remove('hidden');
      st.textContent='Configurações salvas em '+c.__savedAt;
    }
    alert('Configurações de integração salvas.');
  }
  return sync;
}

function saveSettings(){
  if(!isAdmin()){
    alert('Configuração indisponível.');
    return;
  }

  const c=getAdminConfig();
  const beforeRules={};
  Object.keys(RULE_DEFAULTS).forEach(id=>beforeRules[id]=String(getRule(id)));

  document.querySelectorAll('#settingsView input, #settingsView select, #settingsView textarea').forEach((el,i)=>{
    if(!el.id) el.id='adminCfgAuto'+i;
    if(el.type==='file')return;
    c[el.id]=el.value;
  });

  const ruleChanges=[];
  Object.keys(RULE_DEFAULTS).forEach(id=>{
    const after=String(document.getElementById(id)?.value??c[id]??RULE_DEFAULTS[id]);
    if(beforeRules[id]!==after)ruleChanges.push(id+': '+beforeRules[id]+' → '+after);
    c[id]=after;
  });


  c.sectorAliases=getSectorAliases();
  c.__savedAt=new Date().toLocaleString('pt-BR');
  localStorage.setItem(ADMIN_CONFIG_KEY,JSON.stringify(c));
  portalBackendSave('config','main',c);
  addRuleAudit(ruleChanges);
  if(ruleChanges.length){
    const latest=getRuleAudit()[0];
    if(latest)portalBackendSave('audit',latest.id,latest);
  }

  refreshSectorSelectors();
  try{populateTriageSectors()}catch(e){}

  // Mantém a integração sincronizada com a chave usada pelo botão Sincronizar.
  saveIntegrationSettings(true);

  const st=document.getElementById('configSavedState');
  if(st){
    st.classList.remove('hidden');
    st.textContent='Configurações salvas em '+c.__savedAt;
  }
  renderEffectiveRulesSummary();
  renderRuleAudit();
  alert('Configurações salvas.');
}


const IMPORTED_ROS_KEY='ro-pdca-imported-ros-v1';
const IMPORTED_ROS_INTERNA_KEY='ro-pdca-imported-ros-interna-v1';
const IMPORTED_ROS_EXTERNA_KEY='ro-pdca-imported-ros-externa-v1';
const IMPORTED_RO_ORIGIN_REGISTRY_KEY='nucleo-ro-origin-registry-v1';
let nucleoBulkRoOriginRegistry=null;
const IMPORTED_RAW_KEY='ro-pdca-imported-raw-v1';
const NUCLEO_RO_DB_NAME='nucleo-ro-cache-v1';
const NUCLEO_RO_DB_STORE='cache';
const NUCLEO_RO_DB_KEY='ros-by-origin';

function firstValue(obj, names){
  for(const name of names){
    if(Object.prototype.hasOwnProperty.call(obj,name)){
      const v=obj[name];
      if(v!==undefined && v!==null && String(v).trim()!=='') return v;
    }
  }
  return '';
}

function formatImportedDate(v){
  if(v===undefined || v===null || v==='') return '—';
  const s=String(v).trim();
  if(!s)return '—';

  // IMPORTANTE: nunca entregar DD/MM/AAAA direto ao new Date().
  // O navegador pode interpretar 05/12/2026 como 12/05/2026.
  let m=s.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})(?:\D|$)/);
  if(m){
    let y=Number(m[3]); if(y<100)y+=2000;
    const d=Number(m[1]), mo=Number(m[2]);
    if(d>=1&&d<=31&&mo>=1&&mo<=12){
      return String(d).padStart(2,'0')+'/'+String(mo).padStart(2,'0')+'/'+String(y).padStart(4,'0');
    }
  }

  m=s.match(/^(\d{4})-(\d{2})-(\d{2})(?:T|\s|$)/);
  if(m){
    return `${m[3]}/${m[2]}/${m[1]}`;
  }

  const dt=new Date(s);
  if(!Number.isNaN(dt.getTime())){
    try{
      return new Intl.DateTimeFormat('pt-BR',{
        timeZone:'America/Sao_Paulo',day:'2-digit',month:'2-digit',year:'numeric'
      }).format(dt);
    }catch(e){
      return dt.toLocaleDateString('pt-BR');
    }
  }
  return s;
}


function roDigits(value){
  const m=String(value||'').match(/(\d+)(?!.*\d)/);
  return m?String(parseInt(m[1],10)):'';
}

function roOriginCode(origin){
  return normalizeAnswer(origin||'')==='externa'?'EX':'IN';
}

function appRoNumber(value,origin){
  const raw=String(value||'').trim().toUpperCase();
  const existing=raw.match(/^RO-(IN|EX)-(\d+)$/);
  if(existing)return 'RO-'+existing[1]+'-'+String(parseInt(existing[2],10)).padStart(5,'0');

  const digits=roDigits(raw);
  if(!digits)return raw||('RO-'+roOriginCode(origin)+'-00000');
  return 'RO-'+roOriginCode(origin)+'-'+String(parseInt(digits,10)).padStart(5,'0');
}

function legacyRoNumber(value){
  const digits=roDigits(value);
  return digits?'RO-'+String(parseInt(digits,10)).padStart(5,'0'):String(value||'').trim();
}

function roOriginFromNumber(value,fallbackOrigin){
  const m=String(value||'').toUpperCase().match(/^RO-(IN|EX)-/);
  if(m)return m[1]==='EX'?'Externa':'Interna';
  return fallbackOrigin||'';
}


function getRoOriginRegistry(){
  if(nucleoBulkRoOriginRegistry)return nucleoBulkRoOriginRegistry;
  try{
    const obj=JSON.parse(localStorage.getItem(IMPORTED_RO_ORIGIN_REGISTRY_KEY)||'{}');
    return obj&&typeof obj==='object'?obj:{};
  }catch(e){return {}}
}

function saveRoOriginRegistry(registry){
  if(nucleoBulkRoOriginRegistry){
    nucleoBulkRoOriginRegistry=registry||{};
    return true;
  }
  try{
    const serialized=JSON.stringify(registry||{});
    if(localStorage.getItem(IMPORTED_RO_ORIGIN_REGISTRY_KEY)===serialized)return true;
    localStorage.setItem(IMPORTED_RO_ORIGIN_REGISTRY_KEY,serialized);
    return true;
  }catch(e){
    console.warn('NÚCLEO: não foi possível salvar o mapa de origem das R.O.s.',e);
    return false;
  }
}

function originRegistryKeys(value){
  const raw=String(value||'').trim().toUpperCase();
  const digits=roDigits(raw);
  const keys=[];
  if(raw)keys.push('RAW:'+raw);
  if(digits)keys.push('N:'+digits);
  return keys;
}

function rememberRoOrigin(value,origin){
  const normalizedOrigin=normalizeAnswer(origin||'')==='externa'?'Externa':
    normalizeAnswer(origin||'')==='interna'?'Interna':'';
  if(!normalizedOrigin)return;

  const registry=getRoOriginRegistry();
  originRegistryKeys(value).forEach(k=>{
    const old=registry[k];
    if(!old){
      registry[k]=normalizedOrigin;
    }else if(old!==normalizedOrigin){
      // O mesmo número pode existir em Interna e Externa.
      // Nesse caso não usamos a chave numérica genérica como fonte de verdade.
      if(k.startsWith('N:'))registry[k]='AMBIGUO';
    }
  });

  const canonical=appRoNumber(value,normalizedOrigin);
  if(canonical)registry['CANON:'+canonical]=normalizedOrigin;
  saveRoOriginRegistry(registry);
}

function rememberedRoOrigin(value){
  const registry=getRoOriginRegistry();
  const raw=String(value||'').trim().toUpperCase();
  const canonical=registry['CANON:'+raw];
  if(canonical==='Interna'||canonical==='Externa')return canonical;

  for(const k of originRegistryKeys(value)){
    const v=registry[k];
    if(v==='Interna'||v==='Externa')return v;
  }
  return '';
}

function rebuildRoOriginRegistry(records){
  const registry=getRoOriginRegistry();
  (Array.isArray(records)?records:[]).forEach(r=>{
    const origin=String(r?.origemBase||r?.raw?.__origemBase||r?.__origemBase||'').trim();
    if(!origin)return;
    const values=[r?.numero,r?.numeroOriginal,r?.numeroPlanilha,r?.raw?.RO,r?.raw?.['Nº R.O.']];
    values.filter(Boolean).forEach(v=>{
      const normalizedOrigin=normalizeAnswer(origin)==='externa'?'Externa':'Interna';
      originRegistryKeys(v).forEach(k=>{
        const old=registry[k];
        if(!old)registry[k]=normalizedOrigin;
        else if(old!==normalizedOrigin && k.startsWith('N:'))registry[k]='AMBIGUO';
      });
      const canonical=appRoNumber(v,normalizedOrigin);
      if(canonical)registry['CANON:'+canonical]=normalizedOrigin;
    });
  });
  saveRoOriginRegistry(registry);
}

function normalizeImportedRo(raw,index){
  const numeroRaw=raw?.__numeroPlanilha || firstValue(raw,['RO','Nº R.O.','Nº RO','Numero RO','Número RO','Código R.O.','Codigo RO']);
  const numeroOriginal=String(numeroRaw||index+1).trim();
  const origemMarcada=String(raw?.__origemBase||'').trim();
  const numeroAppBackend=String(raw?.__numeroApp||'').trim();
  const origemDoNumero=roOriginFromNumber(numeroAppBackend||numeroOriginal,'');
  const origemMemorizada=rememberedRoOrigin(numeroOriginal);
  const origemBase=origemMarcada||origemDoNumero||origemMemorizada||'';
  if(origemBase)rememberRoOrigin(numeroOriginal,origemBase);
  const ehSac=origemBase==='Externa'||raw?.__ehSac===true;
  const numero=numeroAppBackend || (origemBase
    ? appRoNumber(numeroOriginal,origemBase)
    : String(numeroOriginal||'').trim());
  // A unidade é a coluna D tanto na aba Interna quanto na Externa.
  // O Apps Script envia a linha como objeto, mas usamos também o marcador
  // posicional para não depender do texto do cabeçalho.
  const unidade=String(
    raw?.__unidade ||
    firstValue(raw,['Unidade','Unidade produtiva','Em qual unidade produtiva ocorreu o problema?']) ||
    'Não informada'
  ).trim();

  const cliente=String(firstValue(raw,[
    'Nome do cliente:','Nome do cliente','Cliente','Cliente / origem'
  ])||'Não informado').trim();

  const setorCausa=String(
    raw?.__setorResponsavel ||
    firstValue(raw,[
      'Setor (causa)','Setor Responsável','Setor responsável','Setor causa',
      'Setor responsável pelo desvio','Setor responsavel pelo desvio'
    ]) || ''
  ).trim();

  const setorIdentificado=String(firstValue(raw,[
    'Setor (onde foi identificado o desvio de qualidade):',
    'Setor (onde foi identificado o desvio de qualidade)',
    'Setor onde foi identificado o desvio de qualidade'
  ])||'').trim();

  const setor=setorCausa||'Não direcionado';

  const tipo=String(firstValue(raw,[
    'Tipo de Ocorrência','Tipo de ocorrência','Classificação'
  ])||'R.O.').trim();

  const descricao=String((ehSac ? raw?.__descricaoProblema : '') || firstValue(raw,[
    'Descreva sobre o problema encontrado:',
    'Descreva sobre o problema encontrado',
    'Descrição','Descricao'
  ])||'Sem descrição').trim();

  const dataOriginal=raw?.__dataRo || firstValue(raw,[
    'Carimbo de data/hora','Carimbo de data e hora','Data da R.O.','Data R.O.','Data'
  ]);
  const data=formatImportedDate(dataOriginal);

  const prazo=formatImportedDate(firstValue(raw,[
    'Prazo PDCA','Prazo para PDCA','Prazo','Data limite','Data Limite'
  ]));

  const statusPlanilha=String(
    raw?.__statusOperacional ||
    firstValue(raw,['Status R.O.','Status da R.O.','Status']) ||
    ''
  ).trim();
  const statusLower=statusPlanilha.toLowerCase();

  let status='Aguardando triagem';
  let pdca='Obrigatório';

  if(statusLower.includes('cancel')){
    status='Cancelada';
    pdca='Não se aplica';
  }else if(statusLower.includes('somente') && statusLower.includes('registro')){
    status='Somente para registro';
    pdca='Não se aplica';
  }else if(statusLower.includes('contesta')){
    status='Em contestação';
    pdca='Suspenso';
  }else if(statusLower==='enviado' || statusLower.includes('pdca enviado')){
    status='PDCA enviado';
    pdca='Enviado ao SGQ';
  }else if(statusLower==='concluído' || statusLower==='concluido'){
    status='Concluído';
    pdca='Enviado';
  }else if(statusPlanilha && !statusLower.includes('nenhum email encontrado')){
    status=statusPlanilha;
  }

  const pdcaEnvio=raw?.__pdcaReclamanteData || firstValue(raw,[
    'PDCA ENVIADO PARA O RECLAMANTE (DATA)',
    'Data Resposta PDCA'
  ]);
  const reclamanteRecebeuPdca=!!(pdcaEnvio && !String(pdcaEnvio).toLowerCase().includes('antes da implantação'));
  if(reclamanteRecebeuPdca){
    status='Retorno entregue ao reclamante';
    pdca='Apresentado ao reclamante';
  }

  const registrante=String(firstValue(raw,[
    'Nome e Sobrenome (responsável pelo registro deste formulário):',
    'Nome e Sobrenome (responsável pelo registro deste formulário)',
    'Responsável pelo registro',
    'Responsavel pelo registro'
  ])||'').trim();

  const matricula=String(firstValue(raw,[
    'Matrícula','Matricula'
  ])||'').trim();

  const evidencia=String(firstValue(raw,[
    'Insira imagens e/ou vídeos relacionado a ocorrência relatada.',
    'Insira imagens e/ou vídeos relacionado a ocorrência relatada'
  ])||'').trim();
  const pdfRo='';
  const produto=String(firstValue(raw,['Código do item:','Código do item','Código do Produto','Código do produto','Produto','Item','Produto:','Código produto','Codigo produto'])||'').trim();
  const pedido=String(firstValue(raw,['Número do pedido:','Número do pedido','Pedido','Nº Pedido','Pedido:','N° Pedido'])||'').trim();
  const notaFiscal=String(firstValue(raw,['Nota Fiscal','NF','Nº NF','Número da nota','Nota Fiscal:','N° NF','Nº Nota Fiscal'])||'').trim();
  const quantidade=String(firstValue(raw,['Quantidade de peças com desvio:','Quantidade','Qtd','Qtd.','Quantidade não conforme','Qtd. não conforme','Qtd Não Conforme'])||'').trim();
  const representante=String(firstValue(raw,['Representante','REPRESENTANTE','Nome do representante'])||'').trim();
  const dataReclamacao=String(firstValue(raw,['Data da Reclamação','Data da reclamação','Data Reclamação'])||'').trim();
  const pessoaResponsavel=String(
    raw?.__pessoaResponsavel ||
    firstValue(raw,['Pessoa','Pessoa responsável','Responsável']) ||
    ''
  ).trim();
  const acaoPreventiva=String(
    raw?.__acaoPreventiva ||
    firstValue(raw,['Ação preventiva','Acao preventiva']) ||
    ''
  ).trim();
  const prazoConclusaoAcao=String(
    raw?.__prazoConclusaoAcao ||
    firstValue(raw,['Prazo conclusão ação','Prazo conclusao acao']) ||
    ''
  ).trim();
  const dataEnvioOperacional=String(
    raw?.__dataEnvioOperacional ||
    firstValue(raw,['Data Envio','Data de Envio']) ||
    ''
  ).trim();
  const resultadoEnvio=String(
    raw?.__resultadoOperacional ||
    firstValue(raw,['Resultado']) ||
    ''
  ).trim();
  const setorResponsavelPlanilha=String(
    raw?.__setorResponsavel ||
    firstValue(raw,[
      'Setor responsável pelo desvio',
      'Setor responsavel pelo desvio',
      'Setor (causa)',
      'Setor causa'
    ]) ||
    ''
  ).trim();

  return {
    numero,
    numeroOriginal,
    numeroPlanilha:numeroOriginal,
    unidade,
    cliente,
    setor,
    setorIdentificado,
    assunto: tipo,
    tipoRO: tipo,
    data,
    sourceDateRaw:String(dataOriginal||'').trim(),
    prazo: prazo==='—'?'—':prazo,
    status,
    // Valor literal da coluna Status da planilha-base (Interna: AD / Externa: AE).
    // Não confundir com `status`, que é o rótulo transformado usado na interface.
    statusOperacional:statusPlanilha,
    descricao,
    pdca,
    pdfUrl: '',
    evidencia,
    registrante,
    matricula,
    produto,
    pedido,
    notaFiscal,
    quantidade,
    representante,
    dataReclamacao,
    pessoaResponsavel,
    setorResponsavelPlanilha,
    acaoPreventiva,
    prazoConclusaoAcao,
    dataEnvioOperacional,
    resultadoEnvio,
    pdcaEnviadoReclamanteEm:String(pdcaEnvio||''),
    reclamanteRecebeuPdca,
    origemBase:origemBase,
    ehSac,
    raw
  };
}


function notifyNewImportedRos(previousNumbers,newRecords){
  if(!isAdmin())return;
  // A primeira leitura de uma máquina nova não é um lote de novas R.O.s.
  // Evita centenas de notificações, e-mails e POSTs ocultos simultâneos.
  if(!Array.isArray(previousNumbers)||previousNumbers.length===0)return;
  const before=new Set(previousNumbers||[]);
  const fresh=(newRecords||[]).filter(r=>!before.has(String(r.numero||'')));
  // Uma importação grande indica troca de período/base ou recuperação de cache.
  // Notificações individuais só fazem sentido para poucas entradas incrementais.
  if(fresh.length>5){console.info('NÚCLEO: carga em lote sem disparar notificações individuais:',fresh.length);return}
  fresh.forEach(r=>createNotification({
    type:'ro',
    audience:'admin',
    ro:r.numero||'',
    title:'Nova R.O. cadastrada',
    message:(r.numero||'Nova R.O.')+' entrou na base e está aguardando triagem.'
  }));
}


function readImportedRosByOrigin(){
  const read=key=>{
    try{
      const arr=JSON.parse(localStorage.getItem(key)||'[]');
      return Array.isArray(arr)?arr:[];
    }catch(e){return []}
  };

  let internas=read(IMPORTED_ROS_INTERNA_KEY);
  let externas=read(IMPORTED_ROS_EXTERNA_KEY);

  // Migração da chave antiga combinada.
  if(!internas.length && !externas.length){
    const legacy=read(IMPORTED_ROS_KEY);
    internas=legacy.filter(r=>String(r?.origemBase||r?.raw?.__origemBase||'')==='Interna');
    externas=legacy.filter(r=>String(r?.origemBase||r?.raw?.__origemBase||'')==='Externa');

    if(internas.length)safeStorageSet(IMPORTED_ROS_INTERNA_KEY,JSON.stringify(internas));
    if(externas.length)safeStorageSet(IMPORTED_ROS_EXTERNA_KEY,JSON.stringify(externas));
    try{localStorage.removeItem(IMPORTED_ROS_KEY)}catch(e){}
  }

  return {internas,externas};
}



let nucleoLoadingDepth=0;
let nucleoLoadingHideTimer=null;

function showNucleoLoading(message,title){
  nucleoLoadingDepth++;
  if(nucleoLoadingHideTimer){
    clearTimeout(nucleoLoadingHideTimer);
    nucleoLoadingHideTimer=null;
  }

  const overlay=document.getElementById('nucleoLoadingOverlay');
  const titleEl=document.getElementById('nucleoLoadingTitle');
  const textEl=document.getElementById('nucleoLoadingText');

  if(titleEl)titleEl.textContent=title||'Carregando NÚCLEO';
  if(textEl)textEl.textContent=message||'Processando dados...';
  if(overlay){
    overlay.classList.add('show');
    overlay.setAttribute('aria-busy','true');
  }

  // Dá ao navegador a chance de desenhar o overlay antes de iniciar trabalho pesado.
  return new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
}

function updateNucleoLoading(message,title){
  const titleEl=document.getElementById('nucleoLoadingTitle');
  const textEl=document.getElementById('nucleoLoadingText');
  if(title && titleEl)titleEl.textContent=title;
  if(message && textEl)textEl.textContent=message;
}

function hideNucleoLoading(force=false){
  if(force)nucleoLoadingDepth=0;
  else nucleoLoadingDepth=Math.max(0,nucleoLoadingDepth-1);

  if(nucleoLoadingDepth>0)return;

  const overlay=document.getElementById('nucleoLoadingOverlay');
  if(!overlay)return;

  nucleoLoadingHideTimer=setTimeout(()=>{
    overlay.classList.remove('show');
    overlay.setAttribute('aria-busy','false');
    nucleoLoadingHideTimer=null;
  },120);
}

async function withNucleoLoading(message,fn,title){
  await showNucleoLoading(message,title);
  try{
    return await fn();
  }finally{
    hideNucleoLoading();
  }
}

function openNucleoRoDb(){
  return new Promise((resolve,reject)=>{
    if(!('indexedDB' in window)){
      reject(new Error('IndexedDB indisponível neste navegador.'));
      return;
    }
    const req=indexedDB.open(NUCLEO_RO_DB_NAME,1);
    req.onupgradeneeded=()=>{
      const db=req.result;
      if(!db.objectStoreNames.contains(NUCLEO_RO_DB_STORE)){
        db.createObjectStore(NUCLEO_RO_DB_STORE);
      }
    };
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error||new Error('Falha ao abrir IndexedDB.'));
  });
}

function currentRoSyncPeriodSignature(settings){
  const s=settings||getSavedIntegrationSettings();
  return JSON.stringify({
    period:String(s.roSyncPeriod||'all'),
    from:String(s.roSyncDateFrom||''),
    to:String(s.roSyncDateTo||'')
  });
}

async function saveImportedRosDurable(internas,externas){
  const db=await openNucleoRoDb();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(NUCLEO_RO_DB_STORE,'readwrite');
    tx.objectStore(NUCLEO_RO_DB_STORE).put({
      internas:Array.isArray(internas)?internas:[],
      externas:Array.isArray(externas)?externas:[],
      periodSignature:currentRoSyncPeriodSignature(),
      savedAt:Date.now()
    },NUCLEO_RO_DB_KEY);
    tx.oncomplete=()=>{try{db.close()}catch(e){};resolve(true)};
    tx.onerror=()=>{try{db.close()}catch(e){};reject(tx.error||new Error('Falha ao salvar cache de R.O.s.'))};
    tx.onabort=()=>{try{db.close()}catch(e){};reject(tx.error||new Error('Gravação do cache de R.O.s abortada.'))};
  });
}

async function readImportedRosDurable(){
  const db=await openNucleoRoDb();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(NUCLEO_RO_DB_STORE,'readonly');
    const req=tx.objectStore(NUCLEO_RO_DB_STORE).get(NUCLEO_RO_DB_KEY);
    req.onsuccess=()=>{
      const value=req.result||{};
      try{db.close()}catch(e){}
      resolve({
        internas:Array.isArray(value.internas)?value.internas:[],
        externas:Array.isArray(value.externas)?value.externas:[],
        periodSignature:String(value.periodSignature||''),
        savedAt:value.savedAt||0
      });
    };
    req.onerror=()=>{
      try{db.close()}catch(e){}
      reject(req.error||new Error('Falha ao ler cache de R.O.s.'));
    };
  });
}

async function clearImportedRosDurable(){
  try{
    const db=await openNucleoRoDb();
    await new Promise((resolve,reject)=>{
      const tx=db.transaction(NUCLEO_RO_DB_STORE,'readwrite');
      tx.objectStore(NUCLEO_RO_DB_STORE).delete(NUCLEO_RO_DB_KEY);
      tx.oncomplete=resolve;
      tx.onerror=()=>reject(tx.error||new Error('Falha ao limpar cache.'));
    });
    try{db.close()}catch(e){}
  }catch(e){
    console.warn('NÚCLEO: não foi possível limpar o cache persistente de R.O.s.',e);
  }
}

function normalizeRestoredRoRecord(r){
  const copy={...(r||{})};
  const origin=String(
    copy.origemBase ||
    copy.raw?.__origemBase ||
    copy.__origemBase ||
    rememberedRoOrigin(copy.numero||copy.numeroOriginal||copy.numeroPlanilha||'')
  ).trim();

  if(!origin)return null;

  copy.origemBase=origin;
  copy.ehSac=origin==='Externa'||copy.ehSac===true;
  copy.numeroOriginal=copy.numeroOriginal||copy.numeroPlanilha||copy.numero||'';
  copy.numeroPlanilha=copy.numeroPlanilha||copy.numeroOriginal;
  copy.numero=copy.raw?.__numeroApp || copy.numero || appRoNumber(copy.numeroOriginal,origin);
  return copy;
}

async function restoreImportedRosDurable(){
  try{
    const split=await readImportedRosDurable();
    const expectedSignature=currentRoSyncPeriodSignature();
    // Cache de outro período nunca pode reaparecer depois de atualizar/reabrir o app.
    if(split.periodSignature && split.periodSignature!==expectedSignature){
      console.info('NÚCLEO: cache de R.O.s ignorado porque pertence a outro período.');
      await clearImportedRosDurable().catch(()=>{});
      return 0;
    }
    // Cache legado sem assinatura só é seguro para "Todo o período".
    if(!split.periodSignature && String(getSavedIntegrationSettings().roSyncPeriod||'all')!=='all'){
      await clearImportedRosDurable().catch(()=>{});
      return 0;
    }
    const saved=[...split.internas,...split.externas];
    if(!saved.length)return 0;

    const restored=saved.map(normalizeRestoredRoRecord).filter(Boolean);
    if(!restored.length)return 0;

    // Cache criado por versões antigas podia ter Setor (causa), mas não guardar
    // a coluna Status operacional (Interna AD / Externa AE). Nesse cenário o
    // Núcleo restaurava o cache e, por já possuir R.O.s, NÃO consultava a API
    // novamente. Isso explica casos como RO-IN-00527: DT aparecia nas atribuídas,
    // porém a fila de triagem via status vazio e mostrava Aguardando triagem.
    // Se houver qualquer registro com setor responsável e sem o marcador de status,
    // usamos o cache apenas para abrir rápido e obrigamos uma leitura fresca da base.
    const cacheSemStatusOperacional=restored.some(r=>{
      const setor=String(r?.setorResponsavelPlanilha||r?.raw?.__setorResponsavel||r?.setor||'').trim();
      const setorValido=!!setor && !['nao direcionado','nao informado','sem setor','-'].includes(normalizeAnswer(setor));
      const temMarcador=String(r?.statusOperacional||r?.raw?.__statusOperacional||'').trim()!=='';
      return setorValido && !temMarcador;
    });
    if(cacheSemStatusOperacional){
      importedRoCacheNeedsRefresh=true;
      console.info('NÚCLEO: cache antigo sem Status operacional; atualização da planilha será forçada.');
    }

    applySacRepresentativeOverridesToRos(restored);
    rebuildRoOriginRegistry(restored);
    ros.splice(0,ros.length,...restored);
    selected=ros[0]||null;

    // Evita renderizar milhares de linhas e todos os módulos no mesmo instante.
    // Cada tela pesada renderiza quando for aberta.
    try{refreshRoSummary()}catch(e){}
    try{renderCurrentOverview()}catch(e){}
    try{refreshNotificationBell()}catch(e){}

    const triageView=document.getElementById('triageView');
    if(triageView && !triageView.classList.contains('hidden')){
      try{renderTriage()}catch(e){}
    }
    const indicatorView=document.getElementById('sgqIndicatorsView');
    if(indicatorView && !indicatorView.classList.contains('hidden')){
      try{renderSgqIndicators()}catch(e){}
    }
    return restored.length;
  }catch(e){
    console.warn('NÚCLEO: falha ao restaurar R.O.s do IndexedDB.',e);
    return 0;
  }
}

function compactRoForStorage(r){
  const raw=r?.raw||{};
  const keepRaw={};
  [
    'RO','Nº R.O.','Nº RO',
    'Matrícula','Matricula',
    'Nome e Sobrenome (responsável pelo registro deste formulário):',
    'Número do pedido:','Número do pedido',
    'Código do item:','Código do item',
    'Ordem de produção (código de barras):',
    'Quantidade de peças com desvio:',
    'Peso do material descartado e/ou reaproveitado:',
    'Liberado pelo setor de qualidade?',
    'Registre o nome de quem liberou:',
    'Insira imagens e/ou vídeos relacionado a ocorrência relatada.',
    'Insira imagens e/ou vídeos relacionado a ocorrência relatada',
    'Ação preventiva','Prazo conclusão ação','Data Envio',
    'PDCA ENVIADO PARA O RECLAMANTE (DATA)'
  ].forEach(k=>{
    if(raw[k]!==undefined && raw[k]!==null && String(raw[k]).trim()!=='')keepRaw[k]=raw[k];
  });

  [
    '__origemBase','__ehSac','__numeroPlanilha','__numeroApp','__unidade','__descricaoProblema',
    '__setorResponsavel','__pessoaResponsavel','__pdcaReclamanteData',
    '__acaoPreventiva','__prazoConclusaoAcao','__statusOperacional',
    '__dataEnvioOperacional','__resultadoOperacional'
  ].forEach(k=>{
    if(raw[k]!==undefined)keepRaw[k]=raw[k];
  });

  return {...r,raw:keepRaw};
}

function saveImportedRosByOrigin(internas,externas){
  const inList=Array.isArray(internas)?internas:[];
  const exList=Array.isArray(externas)?externas:[];

  // Fonte persistente principal: IndexedDB. É adequado para milhares de R.O.s
  // e não sofre o limite pequeno do localStorage.
  saveImportedRosDurable(inList,exList).catch(e=>{
    console.warn('NÚCLEO: falha ao salvar R.O.s no IndexedDB.',e);
  });

  // Remove a antiga cópia completa que consumia a quota do localStorage.
  try{localStorage.removeItem(IMPORTED_ROS_KEY)}catch(e){}
  try{localStorage.removeItem(IMPORTED_ROS_INTERNA_KEY)}catch(e){}
  try{localStorage.removeItem(IMPORTED_ROS_EXTERNA_KEY)}catch(e){}

  // Mantém apenas um snapshot mínimo no localStorage para compatibilidade.
  // Nunca guarda o raw completo aqui.
  const tiny=r=>({
    numero:r?.numero||'',
    numeroOriginal:r?.numeroOriginal||r?.numeroPlanilha||'',
    numeroPlanilha:r?.numeroPlanilha||r?.numeroOriginal||'',
    origemBase:r?.origemBase||r?.raw?.__origemBase||'',
    ehSac:r?.ehSac===true,
    data:r?.data||'',
    unidade:r?.unidade||'',
    cliente:r?.cliente||'',
    tipoRO:r?.tipoRO||'',
    assunto:r?.assunto||'',
    descricao:r?.descricao||'',
    setorIdentificado:r?.setorIdentificado||'',
    setorResponsavelPlanilha:r?.setorResponsavelPlanilha||'',
    pessoaResponsavel:r?.pessoaResponsavel||'',
    status:r?.status||'',
    statusOperacional:r?.statusOperacional||r?.raw?.__statusOperacional||''
  });

  // Salva apenas se couber; a persistência real já está no IndexedDB.
  safeStorageSet(IMPORTED_ROS_INTERNA_KEY,JSON.stringify(inList.map(tiny)));
  safeStorageSet(IMPORTED_ROS_EXTERNA_KEY,JSON.stringify(exList.map(tiny)));
  return true;
}


function roOriginMemorySummary(){
  const split=readImportedRosByOrigin();
  const registry=getRoOriginRegistry();
  return {
    interna:split.internas.length,
    externa:split.externas.length,
    registryEntries:Object.keys(registry).length
  };
}

function importedRoPersistenceStatus(){
  const split=readImportedRosByOrigin();
  return {
    interna:split.internas.length,
    externa:split.externas.length,
    internaComOrigem:split.internas.filter(r=>String(r.origemBase||r.raw?.__origemBase||'')==='Interna').length,
    externaComOrigem:split.externas.filter(r=>String(r.origemBase||r.raw?.__origemBase||'')==='Externa').length
  };
}

function importedRoStorageCounts(){
  const split=readImportedRosByOrigin();
  return {interna:split.internas.length,externa:split.externas.length,total:split.internas.length+split.externas.length};
}

function applyImportedRos(records,meta){
  const previousNumbers=ros.map(r=>String(r.numero||''));

  // A API devolve Interna primeiro e Externa depois. Mesmo que uma versão antiga
  // do backend não tenha colocado __origemBase em cada linha, as quantidades
  // permitem identificar cada registro sem ambiguidade.
  const qtdInterna=(meta && Number.isFinite(Number(meta.quantidadeInterna)))
    ? Number(meta.quantidadeInterna)
    : null;
  const qtdExterna=(meta && Number.isFinite(Number(meta.quantidadeExterna)))
    ? Number(meta.quantidadeExterna)
    : null;

  const prepared=records.map((row,index)=>{
    const copy={...(row||{})};
    if(!String(copy.__origemBase||'').trim() && qtdInterna!==null){
      copy.__origemBase=index<qtdInterna?'Interna':'Externa';
      copy.__ehSac=copy.__origemBase==='Externa';
    }
    return copy;
  });

  if(qtdInterna!==null && qtdExterna!==null && (qtdInterna+qtdExterna)!==records.length){
    throw new Error('A API informou quantidades de Interna/Externa incompatíveis com a lista recebida.');
  }

  // Durante uma importação grande, rememberRoOrigin é chamado para cada linha.
  // Acumula o mapa em memória e envia somente uma gravação central ao final.
  nucleoBulkRoOriginRegistry=getRoOriginRegistry();
  let incoming;
  try{
    incoming=prepared.map(normalizeImportedRo).filter(r=>r.numero);
  }finally{
    const registry=nucleoBulkRoOriginRegistry;
    nucleoBulkRoOriginRegistry=null;
    if(registry)saveRoOriginRegistry(registry);
  }
  // Uma resposta oficial vazia é válida: não mantenha registros antigos por causa dela.
  if(!incoming.length && !(meta && Number(meta.quantidadeInterna)===0 && Number(meta.quantidadeExterna)===0))
    throw new Error('Nenhuma R.O. válida foi encontrada.');

  const hasOriginMarkers=prepared.some(x=>String(x?.__origemBase||'').trim());
  let normalized=incoming;

  // A sincronização oficial informa as quantidades das duas abas.
  // Se a chamada for parcial/antiga e trouxer somente uma origem, preserva a outra base
  // em vez de substituir todas as R.O.s por apenas Interna ou apenas Externa.
  const previousByOrigin=readImportedRosByOrigin();
  const previous=[...previousByOrigin.internas,...previousByOrigin.externas];

  const incomingInterna=incoming.filter(r=>String(r.origemBase||'')==='Interna');
  const incomingExterna=incoming.filter(r=>String(r.origemBase||'')==='Externa');

  const authoritativeInterna=meta && typeof meta.quantidadeInterna!=='undefined';
  const authoritativeExterna=meta && typeof meta.quantidadeExterna!=='undefined';

  if(hasOriginMarkers){
    const prevInternas=previous.filter(r=>String(r.origemBase||'')==='Interna');
    const prevExternas=previous.filter(r=>String(r.origemBase||'')==='Externa');

    // Uma sincronização parcial NÃO pode apagar a outra origem.
    // Mesmo que uma resposta informe 0 registros de uma origem, preservamos o que
    // já estava memorizado até recebermos registros concretos dessa origem.
    const filteredPeriod=Boolean(meta?.filtroPeriodo?.ativo);
    let internas=(filteredPeriod||authoritativeInterna) ? incomingInterna : (incomingInterna.length ? incomingInterna : prevInternas);
    let externas=(filteredPeriod||authoritativeExterna) ? incomingExterna : (incomingExterna.length ? incomingExterna : prevExternas);

    // Sem filtro, preserva a outra origem em sincronizações parciais.
    // Com filtro de período, zero registros é um resultado válido e deve permanecer zero.
    if(!filteredPeriod){
      if(!incomingInterna.length && !prevInternas.length && authoritativeInterna)internas=[];
      if(!incomingExterna.length && !prevExternas.length && authoritativeExterna)externas=[];
    }

    normalized=[...internas,...externas];
  }

  applySacRepresentativeOverridesToRos(normalized);
  rebuildRoOriginRegistry(normalized);

  const finalInternas=normalized.filter(r=>String(r.origemBase||r.raw?.__origemBase||'')==='Interna');
  const finalExternas=normalized.filter(r=>String(r.origemBase||r.raw?.__origemBase||'')==='Externa');
  saveImportedRosByOrigin(finalInternas,finalExternas);

  try{localStorage.removeItem(IMPORTED_RAW_KEY)}catch(e){}

  ros.splice(0,ros.length,...normalized);
  selected=ros[0]||null;

  // Não apaga a triagem a cada sincronização. Registros antigos sem marcador
  // de origem precisam preservar a triagem já existente até a origem ser confirmada.
  // Atualiza somente a tela que estiver realmente aberta.
  const roListView=document.getElementById('roListView');
  if(roListView && !roListView.classList.contains('hidden')){
    try{render()}catch(e){}
  }
  refreshRoSummary();
  if(isAdmin()){
    const triageView=document.getElementById('triageView');
    if(triageView && !triageView.classList.contains('hidden')){
      try{renderTriage()}catch(e){}
    }
    const indicatorView=document.getElementById('sgqIndicatorsView');
    if(indicatorView && !indicatorView.classList.contains('hidden')){
      try{renderSgqIndicators()}catch(e){}
    }
    try{notifyNewImportedRos(previousNumbers,normalized)}catch(e){}
  }
  try{renderCurrentOverview()}catch(e){}
  refreshNotificationBell();
  return normalized.length;
}
let importedRoCacheNeedsRefresh=false;
function restoreImportedRos(){
  try{
    const split=readImportedRosByOrigin();
    const saved=[...split.internas,...split.externas];

    if(saved.length){
      let ambiguous=false;

      const migrated=saved.map(r=>{
        const copy={...(r||{})};
        const origin=String(
          copy.origemBase ||
          copy.raw?.__origemBase ||
          copy.__origemBase ||
          (copy.ehSac===true?'Externa':'') ||
          rememberedRoOrigin(copy.numero||copy.numeroOriginal||copy.numeroPlanilha||'')
        ).trim();

        if(!origin){
          ambiguous=true;
          return copy;
        }

        copy.origemBase=origin;
        copy.ehSac=origin==='Externa'||copy.ehSac===true;
        copy.numeroOriginal=copy.numeroOriginal||copy.numeroPlanilha||copy.numero||'';
        copy.numeroPlanilha=copy.numeroPlanilha||copy.numeroOriginal;
        copy.numero=appRoNumber(copy.numero||copy.numeroOriginal,origin);
        return copy;
      });

      if(ambiguous){
        importedRoCacheNeedsRefresh=true;
        return 0;
      }

      const internas=migrated.filter(r=>String(r.origemBase||'')==='Interna');
      const externas=migrated.filter(r=>String(r.origemBase||'')==='Externa');

      applySacRepresentativeOverridesToRos(migrated);
      rebuildRoOriginRegistry(migrated);

      ros.splice(0,ros.length,...migrated);
      selected=ros[0]||null;
      return migrated.length;
    }
  }catch(e){
    console.warn('Falha ao restaurar cache de R.O.s.',e);
  }
  return 0;
}



async function bootstrapRoData(){
  // Primeiro tenta o cache grande e persistente.
  const restoredDurable=await restoreImportedRosDurable();
  if(restoredDurable){
    console.info('NÚCLEO: R.O.s restauradas do IndexedDB:',restoredDurable);
    return restoredDurable;
  }

  // Migração: tenta o cache antigo do localStorage uma única vez.
  const restoredLegacy=restoreImportedRos();
  if(restoredLegacy){
    const split=readImportedRosByOrigin();
    saveImportedRosDurable(split.internas,split.externas).catch(()=>{});
    console.info('NÚCLEO: cache antigo migrado para IndexedDB:',restoredLegacy);
  }
  return restoredLegacy;
}

let nucleoRoCentralRefreshPromise=null;
async function loadOfficialRosPaged(settings,onProgress){
  const s=settings||getSavedIntegrationSettings();
  const period=roSyncPeriodParams(s);
  const all=[];
  let total=null,internas=null,externas=null,meta=null;
  const pageSize=200;
  const started=Date.now();
  for(let offset=0;offset===0||offset<total;offset+=pageSize){
    if(Date.now()-started>240000)throw new Error('A leitura central ultrapassou 4 minutos. A carga foi interrompida sem substituir os dados exibidos.');
    if(offset>20000)throw new Error('A base ultrapassou o limite de leitura por páginas.');
    let page;
    for(let attempt=1;attempt<=2;attempt++){
      try{
        page=await portalJsonp({acao:'portal_ro_page',...period,offset,limite:pageSize},60000);
        break;
      }catch(e){
        if(attempt===2)throw new Error('A página '+(Math.floor(offset/pageSize)+1)+' falhou após 2 tentativas: '+(e?.message||e));
        if(onProgress)onProgress(all.length,total,'Repetindo página '+(Math.floor(offset/pageSize)+1)+'...');
        await new Promise(resolve=>setTimeout(resolve,1000*attempt));
      }
    }
    if(page?.sucesso===false)throw new Error(page.erro||'A planilha recusou a leitura.');
    if(!page?.paginado||!Array.isArray(page.dados))
      throw new Error('A implantação do Apps Script ainda não contém a leitura por páginas. Publique o script atualizado na mesma URL /exec.');
    const expected=Number(page.quantidade);
    if(!Number.isSafeInteger(expected)||expected<0||Number(page.offset)!==offset)
      throw new Error('A planilha devolveu uma página inválida.');
    if(total===null){total=expected;internas=Number(page.quantidadeInterna);externas=Number(page.quantidadeExterna);meta=page}
    if(total!==expected||internas!==Number(page.quantidadeInterna)||externas!==Number(page.quantidadeExterna))
      throw new Error('A planilha mudou durante a leitura. Execute Sincronizar novamente.');
    if(page.dados.length>pageSize||(!page.dados.length && offset<total))
      throw new Error('A planilha devolveu uma página incompleta.');
    all.push(...page.dados);
    if(onProgress)onProgress(Math.min(all.length,total),total,'Lendo R.O.s e SACs: '+Math.min(all.length,total)+' de '+total+'...');
    // Deixa a interface responder entre as páginas.
    await new Promise(resolve=>setTimeout(resolve,0));
  }
  if(all.length!==total)throw new Error('A leitura terminou com registros faltando. Tente sincronizar novamente.');
  return {...meta,quantidade:total,quantidadeInterna:internas,quantidadeExterna:externas,dados:all};
}
async function refreshLegacyRoCacheFromApi(force=false){
  if(syncNow.inProgress)return false;
  if(nucleoRoCentralRefreshPromise)return nucleoRoCentralRefreshPromise;
  nucleoRoCentralRefreshPromise=refreshRosFromOfficialSheets(force);
  try{return await nucleoRoCentralRefreshPromise}
  finally{nucleoRoCentralRefreshPromise=null}
}
async function refreshRosFromOfficialSheets(force=false){
  const splitNow=readImportedRosByOrigin();
  const s=getSavedIntegrationSettings();
  const periodFiltered=String(s.roSyncPeriod||'all')!=='all';
  const missingOrigin=!periodFiltered && (!splitNow.internas.length || !splitNow.externas.length);
  if(!force && !importedRoCacheNeedsRefresh && ros.length && !missingOrigin)return false;
  if(!s?.apiUrl)return false;

  try{
    const data=await loadOfficialRosPaged(s,(loaded,total,message)=>{
      const status=document.getElementById('syncMsg');
      if(status)status.textContent=message;
    });

    if(data?.sucesso===false)throw new Error(data.erro||'Falha ao carregar R.O.s.');
    if(!Array.isArray(data?.dados))throw new Error('Resposta sem lista de R.O.s.');

    applyImportedRos(data.dados,data);
    importedRoCacheNeedsRefresh=false;
    const syncMsg=document.getElementById('syncMsg');
    if(syncMsg){syncMsg.textContent='R.O.s e SACs atualizados pelas planilhas centrais às '+new Date().toLocaleTimeString('pt-BR')+'.';syncMsg.className='statusline okline'}
    return true;
  }catch(e){
    console.warn('Não foi possível consultar R.O.s e SACs nas planilhas centrais.',e);
    const syncMsg=document.getElementById('syncMsg');
    if(syncMsg){syncMsg.textContent='R.O.s e SACs não conferidos com a base central: '+(e?.message||e)+'. Os números na tela podem estar desatualizados.';syncMsg.className='statusline'}
    return false;
  }
}

function parseIntegrationPayload(text){
  const cleaned=String(text||'').trim().replace(/^\uFEFF/,'');
  if(!cleaned) throw new Error('Cole o JSON retornado pelo Apps Script.');
  let data;
  try{data=JSON.parse(cleaned);}
  catch(e){throw new Error('O conteúdo colado não é um JSON válido.');}

  if(data && data.sucesso===false) throw new Error(data.erro||'O Apps Script retornou erro.');
  const records=Array.isArray(data) ? data : data?.dados;
  if(!Array.isArray(records)) throw new Error('Não encontrei a lista "dados" no JSON.');
  return {
    records,
    meta:Array.isArray(data)?{}:data
  };
}

async function importIntegrationJson(){
  if(!requireIntegrationUnlock())return;

  const result=document.getElementById('importResult');
  await showNucleoLoading('Importando e organizando as R.O.s...','Importando dados');
  try{
    const parsed=parseIntegrationPayload(document.getElementById('integrationJsonPaste')?.value||'');
    updateNucleoLoading('Organizando '+parsed.records.length+' R.O.s...');
    await new Promise(resolve=>requestAnimationFrame(resolve));
    const qty=applyImportedRos(parsed.records,parsed.meta);
    if(result){
      result.className='statusline okline';
      result.classList.remove('hidden');
      result.textContent=qty+' R.O.(s) importada(s). A base foi salva no armazenamento persistente do navegador.';
    }
    alert(qty+' R.O.(s) importada(s) para o preview.');
    showList();
  }catch(err){
    if(result){
      result.className='statusline';
      result.classList.remove('hidden');
      result.textContent='Não foi possível importar: '+(err?.message||err);
    }
  }finally{
    hideNucleoLoading();
  }
}

function importIntegrationFile(input){
  if(!requireIntegrationUnlock())return;

  const file=input?.files?.[0];
  if(!file) return;
  const reader=new FileReader();
  reader.onload=()=>{
    const ta=document.getElementById('integrationJsonPaste');
    if(ta) ta.value=reader.result||'';
    importIntegrationJson();
    input.value='';
  };
  reader.onerror=()=>{
    const result=document.getElementById('importResult');
    if(result){
      result.className='statusline';
      result.classList.remove('hidden');
      result.textContent='Não foi possível ler o arquivo.';
    }
  };
  reader.readAsText(file,'utf-8');
}

function clearImportedRos(){
  if(!requireIntegrationUnlock())return;

  if(!confirm('Voltar aos dados de demonstração deste preview?')) return;
  localStorage.removeItem(IMPORTED_ROS_KEY);
  localStorage.removeItem(IMPORTED_ROS_INTERNA_KEY);
  localStorage.removeItem(IMPORTED_ROS_EXTERNA_KEY);
  localStorage.removeItem(IMPORTED_RO_ORIGIN_REGISTRY_KEY);
  localStorage.removeItem(IMPORTED_RAW_KEY);
  localStorage.removeItem('ro-pdca-triage-v1');
  clearImportedRosDurable().finally(()=>location.reload());
}

function openIntegrationApi(){
  if(!requireIntegrationUnlock())return;

  const s=saveIntegrationSettings(true);
  const result=document.getElementById('testResult');
  if(!s.apiUrl){
    if(result){
      result.className='statusline';
      result.classList.remove('hidden');
      result.textContent='Informe e salve a URL /exec do Apps Script.';
    }
    return;
  }
  window.open(appendIntegrationParams(s.apiUrl,s,false),'_blank','noopener,noreferrer');
}

function jsonpRequest(baseUrl, apiKey, extraParams, timeoutMs=90000){
  return new Promise((resolve,reject)=>{
    const callback='roPdcaJsonp_'+Date.now()+'_'+Math.floor(Math.random()*10000);
    const script=document.createElement('script');
    const timer=setTimeout(()=>{
      cleanup();
      reject(new Error('Tempo limite ao tentar conexão alternativa.'));
    },timeoutMs);

    function cleanup(){
      clearTimeout(timer);
      try{delete window[callback];}catch(e){window[callback]=undefined;}
      script.remove();
    }

    window[callback]=(data)=>{
      cleanup();
      resolve(data);
    };

    script.onerror=()=>{
      cleanup();
      reject(new Error('O Apps Script não respondeu à conexão alternativa.'));
    };

    const params=new URLSearchParams();
    params.set('callback',callback);
    if(getSession()?.authToken)params.set('token',getSession().authToken);
    if(apiKey)params.set('chave',apiKey);
    Object.entries(extraParams||{}).forEach(([k,v])=>{if(v!==undefined&&v!==null&&String(v)!=='')params.set(k,String(v))});
    params.set('_',Date.now());

    const url=baseUrl+(baseUrl.includes('?')?'&':'?')+params.toString();
    script.src=url;
    document.head.appendChild(script);
  });
}

async function testConnection(){
  if(!requireIntegrationUnlock())return;
  if(!isAdmin()){alert('Configuração indisponível.');return;}
  const settings=saveIntegrationSettings(true);
  const result=document.getElementById('testResult');
  if(!settings.apiUrl){
    if(result){result.className='statusline';result.classList.remove('hidden');result.textContent='Informe a URL /exec do Apps Script.';}
    return;
  }
  if(result){result.className='statusline';result.classList.remove('hidden');result.textContent='Testando a resposta da API...';}
  try{
    const data=await portalJsonp({acao:'portal_public_config'},60000);
    if(!data?.sucesso)throw new Error(data?.erro||'A implantação não confirmou a conexão.');
    if(result){result.className='statusline okline';result.classList.remove('hidden');result.textContent='API conectada. Para buscar as R.O.s, clique em Sincronizar.';}
  }catch(err){
    if(result){result.className='statusline';result.classList.remove('hidden');result.textContent='A API não respondeu ao teste curto: '+(err?.message||err);}
  }
}

function getRncDeletedTombstones(){
  try{
    const obj=JSON.parse(localStorage.getItem(RNC_DELETED_TOMBSTONES_KEY)||'{}');
    return obj&&typeof obj==='object'?obj:{};
  }catch(e){return {}}
}
function saveRncDeletedTombstones(obj){
  try{
    localStorage.setItem(RNC_DELETED_TOMBSTONES_KEY,JSON.stringify(obj||{}));
  }catch(e){}
}
function markRncDeletedLocally(id){
  const key=String(id||'').trim();
  if(!key)return;

  const map=getRncDeletedTombstones();
  map[key]={
    id:key,
    deletedAt:new Date().toISOString(),
    lastAttemptAt:'',
    attempts:Number(map[key]?.attempts||0)
  };
  saveRncDeletedTombstones(map);

  saveAdminModuleRecords(
    getAdminModuleRecordsRaw().filter(x=>String(x?.id||'')!==key)
  );
}
function rncIsLocallyDeleted(id){
  const key=String(id||'').trim();
  return !!getRncDeletedTombstones()[key];
}
function portalSendPendingRncDelete(id){
  const key=String(id||'').trim();
  if(!key||!portalBackendEnabled()||!navigator.onLine)return false;

  const map=getRncDeletedTombstones();
  const item=map[key]||{id:key,attempts:0};

  const params={
    acao:'portal_delete',
    colecao:'admin_modules',
    id:key,
    ator:getSession()?.name||'SGQ'
  };
  const token=String(getSession()?.authToken||'').trim();
  if(token)params.token=token;

  const ok=portalPostForm(params);

  if(ok){
    item.attempts=Number(item.attempts||0)+1;
    item.lastAttemptAt=new Date().toISOString();
    map[key]=item;
    saveRncDeletedTombstones(map);
  }
  return ok;
}
function retryPendingRncDeletes(){
  if(!portalBackendEnabled()||!navigator.onLine)return;

  const map=getRncDeletedTombstones();
  Object.keys(map).forEach(id=>{
    portalSendPendingRncDelete(id);
  });
}
function getAdminModuleRecordsRaw(){
  try{
    const a=JSON.parse(localStorage.getItem(ADMIN_MODULES_KEY)||'[]');
    return Array.isArray(a)?a:[];
  }catch(e){return []}
}

function getAdminModuleRecords(){
  const deleted=getRncDeletedTombstones();
  return getAdminModuleRecordsRaw().filter(x=>!deleted[String(x?.id||'')]&&qualityRecordAllowed(x));
}
function saveAdminModuleRecords(list){
  safeStorageSet(ADMIN_MODULES_KEY,JSON.stringify(Array.isArray(list)?list:[]));
}
function adminModuleRecord(id){
  return getAdminModuleRecords().find(x=>String(x.id)===String(id))||null;
}

function getStandardDocuments(){
  try{const a=JSON.parse(localStorage.getItem(STANDARD_DOCUMENTS_KEY)||'[]');return Array.isArray(a)?a.filter(qualityRecordAllowed):[]}catch(e){return []}
}
function saveStandardDocumentsLocal(list){safeStorageSet(STANDARD_DOCUMENTS_KEY,JSON.stringify(Array.isArray(list)?list:[]))}
function getDocumentDeliveries(){
  try{const a=JSON.parse(localStorage.getItem(DOCUMENT_DELIVERIES_KEY)||'[]');return Array.isArray(a)?a:[]}catch(e){return []}
}
const defaultDocumentTypes={fispq:'FISPQ / FDS',technical_sheet:'Ficha Técnica',analysis_certificate:'Certificado de Análise',factory_report:'Laudo para item em fabricação',product_document:'Documento para produto específico',permit:'Alvará',environmental_license:'Licença Ambiental',avcb:'AVCB',declaration:'Declaração / Certificado',other:'Outro documento'};
function configuredDocumentTypes(unit){const c=unitConfiguration(unit)||{};return Array.isArray(c.documentTypes)?c.documentTypes:Object.entries(defaultDocumentTypes).map(([id,label])=>({id,label}));}
function documentTypeOptions(unit,selected=''){const types=configuredDocumentTypes(unit);return '<option value="">Selecione...</option>'+types.map(t=>'<option value="'+escapeHtml(t.id)+'" '+(t.id===selected?'selected':'')+'>'+escapeHtml(t.label)+'</option>').join('');}
function standardDocumentTypeLabel(v,unit){const units=unit?[unit]:['matriz','filial'];for(const u of units){const t=configuredDocumentTypes(u).find(t=>t.id===v);if(t)return t.label;}return defaultDocumentTypes[v]||v||'Documento';}
function renderDocumentTypeSettings(unit){
 const box=document.getElementById('unitQualitySettings');if(!box)return;let section=document.getElementById('documentTypeSettings');
 if(!section){section=document.createElement('section');section.id='documentTypeSettings';section.className='unit-settings-section';section.innerHTML='<h4>Tipos de documentos</h4><p class="help">Edite os nomes, adicione ou remova tipos desta unidade. Os documentos já cadastrados são mantidos.</p><div id="documentTypeRows"></div><button type="button" class="btn secondary" id="documentTypeAdd">Adicionar tipo</button>';box.querySelector('.unit-settings-grid').appendChild(section);document.getElementById('documentTypeAdd').onclick=()=>addDocumentTypeSettingRow({id:'doc_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8),label:''});}
 document.getElementById('documentTypeRows').innerHTML='';configuredDocumentTypes(unit).forEach(addDocumentTypeSettingRow);
}
function addDocumentTypeSettingRow(type){const row=document.createElement('div');row.dataset.typeId=type.id;row.style.cssText='display:flex;gap:8px;margin:8px 0';const input=document.createElement('input');input.value=type.label;input.placeholder='Nome do tipo de documento';input.setAttribute('aria-label','Tipo de documento');const remove=document.createElement('button');remove.type='button';remove.className='btn secondary';remove.textContent='Remover';remove.onclick=()=>row.remove();row.append(input,remove);document.getElementById('documentTypeRows').appendChild(row);}

function standardDocumentIsValid(d){
  if(!d||d.active===false||String(d.status||'active')==='inactive'||!String(d.fileId||'').trim())return false;
  if(!d.validUntil)return true;
  const end=new Date(String(d.validUntil)+'T23:59:59');
  return !Number.isNaN(end.getTime())&&end>=new Date();
}
function findMatchingStandardDocument(request){
  const code=normalizeAnswer(request?.code||'');
  const product=normalizeAnswer(request?.product||'');
  const language=normalizeAnswer(request?.language||'');
  return getStandardDocuments()
    .filter(standardDocumentIsValid)
    .filter(d=>!d.fillable&&explicitRecordUnit(request)&&explicitRecordUnit(d)===explicitRecordUnit(request))
    .filter(d=>normalizeAnswer(d.code||'')===code)
    .filter(d=>!String(d.productCode||'').trim() || (product && normalizeAnswer(d.productCode)===product))
    .filter(d=>!String(d.language||'').trim() || !language || normalizeAnswer(d.language)===language)
    .sort((a,b)=>String(b.updatedAt||b.createdAt||'').localeCompare(String(a.updatedAt||a.createdAt||'')))[0]||null;
}
function fileToBase64(file){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>{const s=String(reader.result||'');resolve(s.includes(',')?s.split(',').pop():s)};
    reader.onerror=()=>reject(reader.error||new Error('Falha ao ler o arquivo.'));
    reader.readAsDataURL(file);
  });
}
function openStandardDocumentCreate(){
  if(!nucleoFeatureRequire('documents','standards'))return;
  if(!isAdmin())return;
  const host=document.getElementById('adminModuleContent');if(!host)return;
  host.innerHTML=`<div style="grid-column:1/-1">
    <button class="btn secondary" type="button" onclick="openAdminOperationalWorkspace('documents',2)">← Voltar aos documentos padrão</button>
    <div class="card" style="margin-top:14px;padding:20px">
      <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap">
        <div><b>Disponibilizar documento padrão</b><div class="small" style="margin-top:4px">Somente o SGQ/ADM cadastra ou substitui arquivos usados na entrega automática.</div></div>
        <span class="pill">Entrega automática</span>
      </div>
      <div class="grid" style="grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:16px">
        <label><span class="small">Nome do documento *</span><input id="stdDocName" placeholder="Ex.: FISPQ Produto X"></label>
        <label><span class="small">Tipo *</span><select id="stdDocCode">${documentTypeOptions(getSession()?.role==='quality'?'filial':document.getElementById('qualityConfigUnit')?.value||explicitPortalUnit(getSession()?.unit)||'matriz')}</select></label>
        <label><span class="small">Versão / revisão</span><input id="stdDocVersion" value="1.0"></label>
        <label><span class="small">Validade</span><input id="stdDocValidUntil" type="date"></label>
        <label><span class="small">Produto / código específico</span><input id="stdDocProduct" placeholder="Opcional — deixe vazio para documento genérico"></label>
        <label><span class="small">Idioma</span><select id="stdDocLanguage"><option value="">Qualquer idioma</option><option>Português</option><option>Inglês</option><option>Espanhol</option></select></label>
        <label><span class="small">Avisar revisão com antecedência</span><input id="stdDocReviewDays" type="number" min="0" value="30"></label>
        <label style="display:flex;align-items:center;gap:8px;margin-top:18px"><input id="stdDocFillable" type="checkbox" style="width:auto"><span class="small">Este arquivo é um modelo preenchível</span></label>
        <label style="grid-column:1/-1"><span class="small">Descrição para orientar a equipe</span><textarea id="stdDocDescription" placeholder="Quando este documento deve ser utilizado"></textarea></label>
        <label style="grid-column:1/-1"><span class="small">Arquivo *</span><input id="stdDocFile" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"></label>
      </div>
      <div id="stdDocUploadStatus" class="small" style="margin-top:12px"></div>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px"><button class="btn primary" type="button" id="stdDocSave" onclick="saveStandardDocument()">Armazenar documento padrão</button></div>
    </div>
  </div>`;
}
async function saveStandardDocument(){
  if(!nucleoFeatureRequire('documents','standards'))return;
  if(!isAdmin())return;
  if(!portalBackendEnabled()){alert('Configure a integração com o Apps Script antes de armazenar arquivos padrão.');return}
  const name=String(document.getElementById('stdDocName')?.value||'').trim();
  const code=String(document.getElementById('stdDocCode')?.value||'').trim();
  const file=document.getElementById('stdDocFile')?.files?.[0];
  if(!name||!code||!file){alert('Informe nome, tipo e arquivo.');return}
  if(file.size>8*1024*1024){alert('Para este fluxo, use arquivos de até 8 MB.');return}
  const status=document.getElementById('stdDocUploadStatus');if(status)status.textContent='Preparando arquivo...';
  try{
    const fileData=await fileToBase64(file);
    const id='STD-'+Date.now()+'-'+Math.random().toString(36).slice(2,7);
    const record={
      id,name,code,version:String(document.getElementById('stdDocVersion')?.value||'').trim(),
      validUntil:String(document.getElementById('stdDocValidUntil')?.value||'').trim(),
      productCode:String(document.getElementById('stdDocProduct')?.value||'').trim(),
      language:String(document.getElementById('stdDocLanguage')?.value||'').trim(),
      reviewDays:Number(document.getElementById('stdDocReviewDays')?.value||30),
      fillable:!!document.getElementById('stdDocFillable')?.checked,
      description:String(document.getElementById('stdDocDescription')?.value||'').trim(),
      fileName:file.name,mimeType:file.type||'application/octet-stream',active:true,status:'active',
      createdAt:new Date().toISOString(),createdBy:getSession()?.name||'SGQ',updatedAt:new Date().toISOString(),updatedBy:getSession()?.name||'SGQ',uploadPending:true
    };
    const local=getStandardDocuments();local.unshift(record);saveStandardDocumentsLocal(local);
    portalPostForm({acao:'portal_upload_standard_document',id,ator:getSession()?.name||'SGQ',metadata:JSON.stringify(record),fileName:file.name,mimeType:record.mimeType,fileData});
    if(status)status.textContent='Arquivo enviado para armazenamento. Confirmando na base central...';
    setTimeout(async()=>{try{await syncPortalBackend(false);renderStandardDocumentsWorkspace()}catch(e){}},2600);
    setTimeout(()=>{try{renderStandardDocumentsWorkspace()}catch(e){}},700);
  }catch(e){if(status)status.textContent='Falha ao preparar o arquivo.';alert(e.message||e)}
}
function renderStandardDocumentsWorkspace(...args){return nucleoOpenLazyAdmin('renderStandardDocumentsWorkspace',args);}

function toggleStandardDocument(id){
  if(!nucleoFeatureRequire('documents','standards'))return;
  if(!isAdmin())return;const list=getStandardDocuments();const i=list.findIndex(x=>String(x.id)===String(id));if(i<0)return;list[i].active=list[i].active===false;list[i].status=list[i].active?'active':'inactive';list[i].updatedAt=new Date().toISOString();list[i].updatedBy=getSession()?.name||'SGQ';saveStandardDocumentsLocal(list);portalBackendSave('standard_documents',id,list[i]);renderStandardDocumentsWorkspace();
}
function deleteStandardDocument(id){
  if(!nucleoFeatureRequire('documents','standards'))return;
  if(!isAdmin()||!confirm('Excluir este documento padrão? O arquivo armazenado também será enviado para a lixeira do Drive.'))return;saveStandardDocumentsLocal(getStandardDocuments().filter(x=>String(x.id)!==String(id)));portalBackendDelete('standard_documents',id);renderStandardDocumentsWorkspace();
}
function renderDocumentDeliveriesWorkspace(...args){return nucleoOpenLazyAdmin('renderDocumentDeliveriesWorkspace',args);}

async function autoFulfillDocumentRequest(request){
  if(!request||request.module!=='documents')return false;
  const doc=findMatchingStandardDocument(request);if(!doc)return false;
  const recipient=String(request.recipientEmail||getSession()?.email||'').trim();if(!recipient)return false;
  if(!portalBackendEnabled())return false;
  try{
    const res=await portalJsonp({acao:'portal_deliver_standard_document',id:doc.id,requestId:request.id,recipientEmail:recipient,recipientName:request.recipient||request.createdBy||'',requestTitle:request.title||'',ator:getSession()?.name||'Portal SGQ'},30000);
    if(!res?.sucesso)throw new Error(res?.erro||'A entrega automática não foi confirmada.');
    request.status='done';request.link='AUTO:'+doc.id;request.standardDocumentId=doc.id;request.standardDocumentName=doc.name;request.autoDelivered=true;request.deliveredAt=res.deliveredAt||new Date().toISOString();request.updatedAt=new Date().toISOString();
    let all=getAdminModuleRecords();const i=all.findIndex(x=>String(x.id)===String(request.id));if(i>=0)all[i]=request;saveAdminModuleRecords(all);portalBackendSave('admin_modules',request.id,request);
    createNotification({type:'document',audience:'user',userKey:notificationUserKey(),title:'Documento enviado automaticamente',message:(doc.name||'Documento')+' foi enviado para '+recipient+'.'});
    setTimeout(()=>syncPortalBackend(false).catch(()=>{}),1600);
    return true;
  }catch(e){console.warn('Falha na entrega automática do documento.',e);return false}
}
function adminModuleStatusLabel(v){
  return ({open:'Aberto',progress:'Em andamento',pending:'Pendente',done:'Concluído',
    elaboration:'Em elaboração',review:'Em revisão',approval:'Aguardando aprovação',published:'Vigente',
    doc_analysis:'Em análise',doc_preparation:'Em preparação',doc_ready:'Pronto para entrega',
    cancelled:'Cancelado',obsolete:'Obsoleto / substituído'})[v]||v||'—';
}
function adminModuleDate(v){
  const s=String(v||''); const m=s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m?`${m[3]}/${m[2]}/${m[1]}`:(s||'—');
}
function isAdminModulePending(r,key){
  if(r.status==='done'||r.status==='published')return false;
  if(r.status==='pending'||r.status==='approval')return true;
  if(r.dueDate){
    const d=new Date(r.dueDate+'T23:59:59'), today=new Date();
    const diff=Math.ceil((d-today)/86400000);
    if(diff<=30)return true;
  }
  if(key==='training' && r.effectiveness!=='effective')return true;
  return false;
}
function filterAdminModuleRecords(key,mode){
  let list=getAdminModuleRecords().filter(r=>r.module===key);
  const mine=normalizeAnswer(getSession()?.name||'');
  if(key==='documents'&&!isAdmin())list=list.filter(r=>normalizeAnswer(r.createdBy||'')===mine);
  if(mode==='mine')return list.filter(r=>normalizeAnswer(r.createdBy||'')===mine);
  if(mode==='active')return list.filter(r=>!['done','published'].includes(r.status));
  if(mode==='pending')return list.filter(r=>isAdminModulePending(r,key));
  if(mode==='capa')return list.filter(r=>r.capa==='yes');
  if(mode==='rnc')return list.filter(r=>r.ncType==='supplier'||String(r.rncNumber||'').trim());
  if(mode==='elaboration')return list.filter(r=>r.status==='elaboration');
  if(mode==='review')return list.filter(r=>r.status==='review');
  if(mode==='approval')return list.filter(r=>r.status==='approval');
  if(mode==='published')return list.filter(r=>r.status==='published');
  if(mode==='doc_analysis')return list.filter(r=>r.status==='doc_analysis');
  if(mode==='doc_preparation')return list.filter(r=>r.status==='doc_preparation');
  if(mode==='doc_ready')return list.filter(r=>r.status==='doc_ready');
  return list;
}

function canOperateNcCapa(){
  if(isAdmin())return true;
  const session=getSession()||{};
  const sector=normalizeAnswer(session.sector||'');
  return sector==='sgq' || sector==='sistema de gestao da qualidade' || sector==='qualidade';
}

function activateNcCapaForm(){
  const host=document.getElementById('adminModuleContent');
  const viewEl=document.getElementById('adminModuleView');
  if(!host)return;

  // Garante que o formulário não fique travado por estado residual,
  // atributo herdado ou camada de bloqueio.
  try{ host.removeAttribute('inert'); }catch(e){}
  try{ viewEl?.removeAttribute('inert'); }catch(e){}

  host.style.pointerEvents='auto';
  if(viewEl)viewEl.style.pointerEvents='auto';

  host.querySelectorAll('input,textarea,select,button').forEach(el=>{
    el.style.pointerEvents='auto';

    // Campos automáticos/ocultos continuam ocultos; todo campo visível
    // da abertura da NC/RNC precisa aceitar interação.
    if(el.type!=='hidden'){
      try{ el.disabled=false; }catch(e){}
      try{ el.readOnly=false; }catch(e){}
      el.removeAttribute('aria-disabled');
    }

    // Evita que algum container pai capture o clique do campo.
    if(!el.dataset.ncInteractiveBound){
      el.dataset.ncInteractiveBound='1';
      el.addEventListener('pointerdown',ev=>ev.stopPropagation());
      el.addEventListener('click',ev=>ev.stopPropagation());
    }
  });
}

function showAdminOperationalModule(...args){return nucleoOpenLazyAdmin('showAdminOperationalModule',args);}

function openAdminOperationalWorkspace(...args){return nucleoOpenLazyAdmin('openAdminOperationalWorkspace',args);}

function ncCapaTypeKey(r){
  const t=normalizeAnswer(r?.ncType||'');
  if(t==='supplier'||String(r?.rncNumber||'').trim())return 'supplier';
  if(t==='client'||t==='customer'||t==='cliente')return 'client';
  return 'internal';
}
function ncCapaTypeLabel(r){
  const t=ncCapaTypeKey(r);
  if(t==='supplier')return 'RNC fornecedor';
  if(t==='client')return 'Cliente / SAC';
  return 'NC interna';
}
function ncCapaEmailLabel(r){
  if(ncCapaTypeKey(r)!=='supplier')return '—';
  if(r?.rncEmailStatus==='sent')return 'Enviada';
  if(r?.rncEmailStatus==='sending')return 'Enviando';
  return 'Não enviada';
}
function ncCapaCapaLabel(r){
  return String(r?.capa||'no')==='yes'?'Sim':'Não';
}
function ncCapaRecordDate(r){
  return r?.updatedAt||r?.createdAt||r?.eventDate||r?.rncIssueDate||'';
}

function renderNcCapaHomeOverview(){
  const host=document.getElementById('ncModuleInlineOverview');if(!host)return;

  host.innerHTML=`<div class="card" style="padding:20px">
    <div style="display:flex;justify-content:space-between;gap:14px;align-items:flex-start;flex-wrap:wrap">
      <div>
        <b style="font-size:16px">Todas as RNCs</b>
        <div class="small" style="margin-top:5px">As RNCs de fornecedor ficam expostas aqui. Filtre por CAPA, situação ou envio e use as ações direto na linha.</div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn primary" type="button" onclick="openAdminOperationalWorkspace('nccapa',0)">＋ Nova RNC fornecedor</button>
      </div>
    </div>

    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;margin-top:16px">
      <label><span class="small">CAPA</span>
        <select id="ncTreatmentCapa" onchange="renderNcCapaTreatmentList()">
          <option value="all">Todas</option>
          <option value="yes">Com CAPA</option>
          <option value="no">Sem CAPA</option>
        </select>
      </label>

      <label><span class="small">Situação</span>
        <select id="ncTreatmentStatus" onchange="renderNcCapaTreatmentList()">
          <option value="all">Todas</option>
          <option value="open">Em aberto</option>
          <option value="done">Concluídas</option>
        </select>
      </label>

      <label><span class="small">Envio da RNC</span>
        <select id="ncTreatmentEmail" onchange="renderNcCapaTreatmentList()">
          <option value="all">Todos</option>
          <option value="sent">Enviadas</option>
          <option value="not_sent">Não enviadas</option>
        </select>
      </label>

      <label><span class="small">Organizar</span>
        <select id="ncTreatmentSort" onchange="renderNcCapaTreatmentList()">
          <option value="recent">Mais recentes</option>
          <option value="old">Mais antigas</option>
          <option value="number">Número / título</option>
        </select>
      </label>

      <label style="grid-column:span 2"><span class="small">Buscar</span>
        <input id="ncTreatmentSearch" placeholder="Número, título, fornecedor, setor, R.O..." oninput="renderNcCapaTreatmentList()">
      </label>
    </div>

    <div id="ncTreatmentSummary" class="small" style="margin-top:14px"></div>
    <div id="ncTreatmentList" style="margin-top:12px"></div>
  </div>`;

  renderNcCapaTreatmentList();
}

function renderNcCapaTreatmentWorkspace(){
  const host=document.getElementById('adminModuleContent');if(!host)return;

  host.innerHTML=`<div style="grid-column:1/-1">
    <button class="btn secondary" type="button" onclick="showAdminOperationalModule('nccapa')">← Voltar ao módulo</button>

    <div class="card" style="margin-top:14px;padding:20px">
      <div style="display:flex;justify-content:space-between;gap:14px;align-items:flex-start;flex-wrap:wrap">
        <div>
          <h3 style="margin:0">Em tratamento</h3>
          <div class="small" style="margin-top:5px">Todas as RNCs ficam nesta central. Use os filtros para separar fornecedor, interna, cliente/SAC, CAPA e situação.</div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="btn primary" type="button" onclick="openAdminOperationalWorkspace('nccapa',0)">＋ Nova RNC fornecedor</button>
        </div>
      </div>

      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(165px,1fr));gap:10px;margin-top:18px">
        <label><span class="small">CAPA</span>
          <select id="ncTreatmentCapa" onchange="renderNcCapaTreatmentList()">
            <option value="all">Todas</option>
            <option value="yes">Com CAPA</option>
            <option value="no">Sem CAPA</option>
          </select>
        </label>

        <label><span class="small">Situação</span>
          <select id="ncTreatmentStatus" onchange="renderNcCapaTreatmentList()">
            <option value="all">Todas</option>
            <option value="open">Em aberto</option>
            <option value="done">Concluídas</option>
          </select>
        </label>

        <label><span class="small">Envio da RNC</span>
          <select id="ncTreatmentEmail" onchange="renderNcCapaTreatmentList()">
            <option value="all">Todos</option>
            <option value="sent">Enviadas</option>
            <option value="not_sent">Não enviadas</option>
          </select>
        </label>

        <label><span class="small">Organizar</span>
          <select id="ncTreatmentSort" onchange="renderNcCapaTreatmentList()">
            <option value="recent">Mais recentes</option>
            <option value="old">Mais antigas</option>
            <option value="number">Número / título</option>
            </select>
        </label>

        <label style="grid-column:span 2"><span class="small">Buscar</span>
          <input id="ncTreatmentSearch" placeholder="Número, título, fornecedor, setor, R.O..." oninput="renderNcCapaTreatmentList()">
        </label>
      </div>

      <div id="ncTreatmentSummary" class="small" style="margin-top:14px"></div>
      <div id="ncTreatmentList" style="margin-top:12px"></div>
    </div>
  </div>`;

  renderNcCapaTreatmentList();
}
function renderNcCapaTreatmentList(){
  const host=document.getElementById('ncTreatmentList');if(!host)return;

  const capa=document.getElementById('ncTreatmentCapa')?.value||'all';
  const status=document.getElementById('ncTreatmentStatus')?.value||'all';
  const email=document.getElementById('ncTreatmentEmail')?.value||'all';
  const sort=document.getElementById('ncTreatmentSort')?.value||'recent';
  const q=normalizeAnswer(document.getElementById('ncTreatmentSearch')?.value||'');

  let rows=getAdminModuleRecords().filter(r=>
    r.module==='nccapa' &&
    ncCapaTypeKey(r)==='supplier'
  );

  rows=rows.filter(r=>{
    const tk='supplier';

    if(capa!=='all'&&String(r.capa||'no')!==capa)return false;

    const concluida=['done','published','closed','concluded'].includes(String(r.status||''));
    if(status==='open'&&concluida)return false;
    if(status==='done'&&!concluida)return false;

    if(email!=='all'){
      if(tk!=='supplier')return false;
      if(email==='sent'&&r.rncEmailStatus!=='sent')return false;
      if(email==='not_sent'&&r.rncEmailStatus==='sent')return false;
    }

    if(q){
      const hay=normalizeAnswer([
        r.rncNumber,r.title,r.supplier,r.sector,r.responsible,r.relatedRo,
        r.rncProduct,r.rncSummary,r.description
      ].filter(Boolean).join(' '));
      if(!hay.includes(q))return false;
    }
    return true;
  });

  if(sort==='old'){
    rows.sort((a,b)=>String(ncCapaRecordDate(a)).localeCompare(String(ncCapaRecordDate(b))));
  }else if(sort==='number'){
    rows.sort((a,b)=>String(a.rncNumber||a.title||'').localeCompare(String(b.rncNumber||b.title||''),'pt-BR',{numeric:true,sensitivity:'base'}));
  }else{
    rows.sort((a,b)=>String(ncCapaRecordDate(b)).localeCompare(String(ncCapaRecordDate(a))));
  }

  const summary=document.getElementById('ncTreatmentSummary');
  if(summary){
    const capas=rows.filter(r=>String(r.capa||'no')==='yes').length;
    const enviadas=rows.filter(r=>r.rncEmailStatus==='sent').length;
    summary.textContent=`${rows.length} RNC(s) • ${enviadas} enviada(s) • ${capas} com CAPA`;
  }

  if(!rows.length){
    host.innerHTML='<div style="padding:28px;border:1px solid #e5e7eb;border-radius:12px;background:#fafafa"><b>Nenhum registro encontrado.</b><div class="small" style="margin-top:5px">Ajuste os filtros ou a busca.</div></div>';
    return;
  }

  host.innerHTML=`<div style="overflow:auto;border:1px solid #e5e7eb;border-radius:12px">
    <table style="width:100%;min-width:1080px">
      <thead><tr>
        <th>RNC</th>
        <th>Fornecedor</th>
        <th>CAPA</th>
        <th>Situação</th>
        <th>Envio</th>
        <th style="text-align:right">Ações</th>
      </tr></thead>
      <tbody>${rows.map(r=>{
        const registro=r.rncNumber||'RNC sem número';
        const complemento=r.title||r.rncSummary||'';
        const fornecedor=r.supplier||'—';
        return `<tr>
          <td><b>${escapeHtml(registro)}</b>${complemento?`<div class="small">${escapeHtml(complemento)}</div>`:''}</td>
          <td>${escapeHtml(fornecedor)}</td>
          <td><span class="pill">${escapeHtml(ncCapaCapaLabel(r))}</span></td>
          <td><span class="pill">${escapeHtml(adminModuleStatusLabel(r.status))}</span></td>
          <td><span class="pill">${escapeHtml(ncCapaEmailLabel(r))}</span></td>
          <td><div style="display:flex;justify-content:flex-end;gap:6px;flex-wrap:wrap">
            <button class="btn secondary" type="button" onclick="printRncStandard('${escapeHtml(r.id)}')">Visualizar</button>
            <button class="btn primary" type="button" onclick="openRncSendModal('${escapeHtml(r.id)}')">Enviar</button>
            <button class="btn secondary" type="button" onclick="showNcCapaStatus('${escapeHtml(r.id)}')">Situação</button>
            <button class="btn secondary" type="button" onclick="editAdminOperationalRecord('${escapeHtml(r.id)}')">Abrir</button>
            <button class="btn danger" type="button" onclick="deleteAdminOperationalRecord('${escapeHtml(r.id)}')">Excluir</button>
          </div></td>
        </tr>`;
      }).join('')}</tbody>
    </table>
  </div>`;
}
function showNcCapaStatus(id){
  const r=adminModuleRecord(id);if(!r)return;

  const situacao=adminModuleStatusLabel(r.status);
  const capa=ncCapaCapaLabel(r);
  const envio=ncCapaEmailLabel(r);
  const numero=r.rncNumber||r.title||'RNC';
  const vinculo=r.relatedRo||'Não vinculada';

  alert(
    `${numero}\n\n`+
    `Fornecedor: ${r.supplier||'—'}\n`+
    `Situação: ${situacao}\n`+
    `CAPA: ${capa}\n`+
    `Envio da RNC: ${envio}\n`+
    `R.O. vinculada: ${vinculo}`
  );
}

function renderRncSendWorkspace(){
  const host=document.getElementById('adminModuleContent');if(!host)return;
  const rncs=getAdminModuleRecords().filter(r=>r.module==='nccapa'&&(r.ncType==='supplier'||String(r.rncNumber||'').trim())).slice().sort((a,b)=>String(b.updatedAt||b.createdAt||'').localeCompare(String(a.updatedAt||a.createdAt||'')));
  host.innerHTML=`<div style="grid-column:1/-1">
    <button class="btn secondary" type="button" onclick="showAdminOperationalModule('nccapa')">← Voltar ao módulo</button>
    <div class="card" style="margin-top:14px;padding:20px">
      <div style="display:flex;justify-content:space-between;gap:14px;align-items:flex-start;flex-wrap:wrap">
        <div><h3 style="margin:0">Enviar RNC</h3><div class="small" style="margin-top:5px">Escolha uma RNC já pronta. Você pode conferir o PDF e fazer o envio sem abrir a tela de acompanhamento.</div></div>
        <div style="min-width:min(360px,100%);flex:0 1 420px"><input id="rncSendSearch" placeholder="Buscar por nº da RNC, fornecedor ou título" oninput="filterRncSendWorkspace()"></div>
      </div>
      <div id="rncSendWorkspaceList" style="margin-top:16px"></div>
    </div>
  </div>`;
  renderRncSendWorkspaceList(rncs);
}
function rncSendWorkspaceRecords(){
  return getAdminModuleRecords().filter(r=>r.module==='nccapa'&&(r.ncType==='supplier'||String(r.rncNumber||'').trim())).slice().sort((a,b)=>String(b.updatedAt||b.createdAt||'').localeCompare(String(a.updatedAt||a.createdAt||'')));
}
function filterRncSendWorkspace(){renderRncSendWorkspaceList(rncSendWorkspaceRecords())}
function renderRncSendWorkspaceList(records){
  const host=document.getElementById('rncSendWorkspaceList');if(!host)return;
  const q=normalizeAnswer(document.getElementById('rncSendSearch')?.value||'');
  const rows=(records||[]).filter(r=>!q||normalizeAnswer([r.rncNumber,r.supplier,r.title,r.rncProduct,r.description].filter(Boolean).join(' ')).includes(q));
  if(!rows.length){host.innerHTML='<div style="padding:26px;border:1px solid #e5e7eb;border-radius:12px;background:#fafafa"><b>Nenhuma RNC encontrada.</b><div class="small" style="margin-top:5px">RNCs salvas no Núcleo aparecerão aqui para envio.</div></div>';return}
  host.innerHTML=`<div style="overflow:auto;border:1px solid #e5e7eb;border-radius:12px"><table style="width:100%"><thead><tr><th>RNC</th><th>Fornecedor</th><th>Situação do envio</th><th>Último envio</th><th style="text-align:right">Ações</th></tr></thead><tbody>${rows.map(r=>`<tr>
    <td><b>${escapeHtml(r.rncNumber||'RNC sem número')}</b><div class="small">${escapeHtml(r.title||r.rncSummary||'—')}</div></td>
    <td>${escapeHtml(r.supplier||'—')}</td>
    <td><span class="pill">${escapeHtml(r.rncEmailStatus==='sent'?'Enviada':r.rncEmailStatus==='sending'?'Enviando':'Não enviada')}</span>${r.supplierEmail?`<div class="small" style="margin-top:4px">${escapeHtml(r.supplierEmail)}</div>`:''}</td>
    <td>${escapeHtml(formatDateTimeBR(r.rncEmailSentAt||'')||'—')}</td>
    <td><div style="display:flex;gap:7px;justify-content:flex-end;flex-wrap:wrap">
      <button class="btn secondary" type="button" onclick="printRncStandard('${escapeHtml(r.id)}')">Ver PDF</button>
      <button class="btn primary" type="button" onclick="openRncSendModal('${escapeHtml(r.id)}')">Enviar RNC</button>
      <button class="btn danger" type="button" onclick="deleteAdminOperationalRecord('${escapeHtml(r.id)}')">Excluir RNC</button>
    </div></td>
  </tr>`).join('')}</tbody></table></div>`;
}

function rncBlockItemRowHtml(item={},index=0){
  const e=v=>escapeHtml(String(v??''));
  return `<div class="rnc-block-item" data-rnc-block-index="${index}" style="border:1px solid #d8e0ec;border-radius:10px;padding:12px;background:#fff">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px">
      <b>Item ${index+1}</b>
      <button class="btn danger" type="button" onclick="removeRncBlockItem(this)" style="padding:6px 9px">Remover</button>
    </div>
    <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px">
      <label><span class="small">Nota Fiscal</span><input data-rnc-block-field="invoice" value="${e(item.invoice||item.notaFiscal||'')}" placeholder="Nº da NF"></label>
      <label><span class="small">Data da emissão</span><input data-rnc-block-field="issueDate" type="date" value="${e(item.issueDate||item.dataEmissao||'')}"></label>
      <label><span class="small">Código do produto</span><input data-rnc-block-field="productCode" value="${e(item.productCode||item.codigoProduto||'')}" placeholder="Código"></label>
      <label><span class="small">Quantidade não conforme</span><input data-rnc-block-field="quantity" value="${e(item.quantity||item.qtd||'')}" placeholder="Quantidade e unidade"></label>
      <label><span class="small">Produto / descrição</span><input data-rnc-block-field="product" value="${e(item.product||item.produto||'')}" placeholder="Produto ou matéria-prima"></label>
      <label><span class="small">Dimensões / especificação</span><input data-rnc-block-field="dimensions" value="${e(item.dimensions||item.dimensoes||'')}" placeholder="Quando aplicável"></label>
      <label style="grid-column:1/-1"><span class="small">Disposição</span><input data-rnc-block-field="disposition" value="${e(item.disposition||item.disposicao||'')}" placeholder="Ex.: devolução, segregação, retrabalho..."></label>
    </div>
  </div>`;
}
function normalizeRncBlockItems(items){
  const list=Array.isArray(items)?items.filter(Boolean):[];
  return list.length?list:[{}];
}
function renderRncBlockItems(items){
  const host=document.getElementById('admModRncBlockItems');if(!host)return;
  host.innerHTML=normalizeRncBlockItems(items).map((item,i)=>rncBlockItemRowHtml(item,i)).join('');
  renumberRncBlockItems();
}
function renumberRncBlockItems(){
  const rows=[...document.querySelectorAll('#admModRncBlockItems .rnc-block-item')];
  rows.forEach((row,i)=>{
    row.dataset.rncBlockIndex=i;
    const b=row.querySelector('b');if(b)b.textContent='Item '+(i+1);
    const remove=row.querySelector('button.danger');if(remove)remove.style.display=rows.length>1?'inline-flex':'none';
  });
}
function addRncBlockItem(item={}){
  const host=document.getElementById('admModRncBlockItems');if(!host)return;
  const wrap=document.createElement('div');
  wrap.innerHTML=rncBlockItemRowHtml(item,host.querySelectorAll('.rnc-block-item').length);
  host.appendChild(wrap.firstElementChild);
  renumberRncBlockItems();
}
function removeRncBlockItem(btn){
  const host=document.getElementById('admModRncBlockItems');if(!host)return;
  const rows=host.querySelectorAll('.rnc-block-item');if(rows.length<=1)return;
  btn.closest('.rnc-block-item')?.remove();
  renumberRncBlockItems();
}
function collectRncBlockItems(){
  return [...document.querySelectorAll('#admModRncBlockItems .rnc-block-item')].map(row=>{
    const get=k=>String(row.querySelector(`[data-rnc-block-field="${k}"]`)?.value||'').trim();
    return {
      invoice:get('invoice'),
      issueDate:get('issueDate'),
      productCode:get('productCode'),
      product:get('product'),
      dimensions:get('dimensions'),
      quantity:get('quantity'),
      disposition:get('disposition')
    };
  }).filter(item=>Object.values(item).some(v=>String(v||'').trim()));
}
function legacyRncBlockItems(r={}){
  if(Array.isArray(r.rncBlockItems)&&r.rncBlockItems.length)return r.rncBlockItems;
  const legacy={
    invoice:r.rncInvoice||'',
    issueDate:r.rncIssueDate||'',
    productCode:r.rncProductCode||'',
    product:r.rncProduct||'',
    dimensions:r.rncDimensions||'',
    quantity:r.rncQuantity||'',
    disposition:r.rncDisposition||''
  };
  return Object.values(legacy).some(v=>String(v||'').trim())?[legacy]:[{}];
}

function updateNcCapaFormType(){
  const type=document.getElementById('admModNcType');
  if(type)type.value='supplier';

  document.getElementById('admModRncOpening')?.classList.remove('hidden');

  const internal=document.getElementById('admModNcInternalFields');
  if(internal){
    internal.classList.add('hidden');
    internal.style.display='none';
  }

  if(document.getElementById('admModRncBlockItems')&&!document.querySelector('#admModRncBlockItems .rnc-block-item')){
    renderRncBlockItems([{}]);
  }
}
function nextRncNumber(){
  const year=new Date().getFullYear();
  let max=0;
  getAdminModuleRecords().filter(r=>r.module==='nccapa').forEach(r=>{
    const m=String(r.rncNumber||'').match(/^RNC-(\d{4})-(\d+)$/i);
    if(m&&Number(m[1])===year)max=Math.max(max,Number(m[2])||0);
  });
  return `RNC-${year}-${String(max+1).padStart(4,'0')}`;
}
function collectAdminModuleForm(key,existing){
  const val=id=>String(document.getElementById(id)?.value||'').trim();
  const blockItems=key==='nccapa'&&val('admModNcType')==='supplier'?collectRncBlockItems():[];
  const firstBlockItem=blockItems[0]||{};
  const now=new Date().toISOString();
  return {
    ...(existing||{}),
    id:existing?.id||('ADM-'+key.toUpperCase()+'-'+Date.now()),
    module:key,
    ncType:val('admModNcType')||(existing?.ncType||''),
    rncNumber:(existing?.rncNumber||''),
    ncOrigin:val('admModNcOrigin')||(existing?.ncOrigin||''),
    supplier:val('admModSupplier')||(existing?.supplier||''),
    relatedRo:val('admModRelatedRo')||(existing?.relatedRo||''),
    rncReporter:val('admModRncReporter'), rncShift:val('admModRncShift'), rncSupervisor:val('admModRncSupervisor'), rncManager:val('admModRncManager'),
    rncBlockItems:blockItems,
    rncInvoice:firstBlockItem.invoice||'', rncIssueDate:firstBlockItem.issueDate||'', rncBlockRange:(existing?.rncBlockRange||''), rncBlockArea:val('admModRncBlockArea'), rncBlockStage:val('admModRncBlockStage'),
    rncProductCode:firstBlockItem.productCode||'', rncProduct:firstBlockItem.product||'', rncDimensions:firstBlockItem.dimensions||'', rncQuantity:firstBlockItem.quantity||'', rncDisposition:firstBlockItem.disposition||'',
    rncSummary:val('admModRncSummary')||val('admModDescription'), rncDetailedDescription:val('admModRncDetailedDescription')||val('admModDescription'), rncEffect:val('admModRncEffect'),
    rncResponseStatus:(existing?.rncResponseStatus||'none'),
    rncImmediateActions:(existing?.rncImmediateActions||''),
    rncCause:(existing?.rncCause||''),
    rncFiveWhys:(existing?.rncFiveWhys||''),
    rncSupplierConclusion:(existing?.rncSupplierConclusion||''),
    rncCorrectiveActions:(existing?.rncCorrectiveActions||''),
    rncEffectiveness:(existing?.rncEffectiveness||''), rncPhotos:(()=>{const fresh=collectRncPhotos(),oldPhotos=(existing&&existing.rncPhotos&&typeof existing.rncPhotos==='object')?existing.rncPhotos:{};const merged={...oldPhotos};Object.keys(fresh||{}).forEach(k=>{const a=Array.isArray(fresh[k])?fresh[k]:[];if(a.length)merged[k]=a;else if(!Array.isArray(merged[k]))merged[k]=[]});return merged})(),
    title:val('admModTitle'),
    code:val('admModCode'),
    location:val('admModLocation'),
    sector:(val('admModNcType')==='supplier'?val('admModRncSector'):val('admModSector')),
    responsible:val('admModResponsible'),
    eventDate:val('admModEventDate')||(val('admModNcType')==='supplier'?(existing?.eventDate||new Date().toISOString().slice(0,10)):''),
    dueDate:val('admModDueDate'),
    status:val('admModStatus')||'open',
    effectiveness:val('admModEffectiveness'),
    severity:val('admModSeverity'),
    capa:val('admModCapa'),
    description:val('admModDescription'),
    action:val('admModAction'),
    link:val('admModLink'),
    product:val('admModProduct'),
    order:val('admModOrder'),
    invoice:val('admModInvoice'),
    quantity:val('admModQuantity'),
    language:val('admModLanguage'),
    recipient:val('admModRecipient'),
    recipientEmail:val('admModRecipientEmail'),
    docType:val('admModDocType'),
    revision:val('admModRevision'),
    createdAt:existing?.createdAt||now,
    createdBy:existing?.createdBy||getSession()?.name||'SGQ',
    updatedAt:now,
    updatedBy:getSession()?.name||'SGQ'
  };
}
function saveAdminOperationalRecord(key,id){
  const permissionModule={nccapa:'nc'}[key]||key,permissionKey=key==='documents'?(id?'prepare':'request'):'edit';if(!nucleoFeatureRequire(permissionModule,permissionKey))return;
  const existing=id?adminModuleRecord(id):null;
  const r=collectAdminModuleForm(key,existing);
  if(!r.title){alert('Informe o título/nome principal do registro.');return}
  if(key==='nccapa'&&r.ncType==='supplier'){
    if(!r.supplier){alert('Informe o fornecedor da RNC.');return}
    if(!r.rncNumber)r.rncNumber=nextRncNumber();
  }
  if(key==='documents'&&!r.code){alert('Selecione o documento solicitado.');return}
  if(key==='documents'&&!isAdmin()){
    r.status='open';
    r.createdBy=existing?.createdBy||getSession()?.name||'Usuário';
    r.createdByEmail=existing?.createdByEmail||getSession()?.email||'';
    r.sector=existing?.sector||getSession()?.sector||r.sector||'';
    r.recipient=r.recipient||getSession()?.name||'';
    r.recipientEmail=r.recipientEmail||getSession()?.email||'';
    r.responsible=existing?.responsible||'';
    r.link=existing?.link||'';
  }
  if(key==='processes'){
    if(!r.docType){alert('Selecione o tipo de documento interno.');return}
    if(!r.code){alert('Informe o código do documento interno.');return}
    if(!r.link){alert('Informe o link do documento interno.');return}
  }
  let all=getAdminModuleRecords();
  const ix=all.findIndex(x=>String(x.id)===String(r.id));
  if(ix>=0)all[ix]=r; else all.unshift(r);
  saveAdminModuleRecords(all);
  // RNC usa salvamento confirmado abaixo; não dispara um segundo POST em paralelo.
  if(!(key==='nccapa'&&r.ncType==='supplier')) portalBackendSave('admin_modules',r.id,r);
  if(key==='documents'&&!isAdmin()){
    const match=findMatchingStandardDocument(r);
    if(match){
      alert('Solicitação registrada. Existe um documento padrão vigente; o Portal vai enviá-lo automaticamente para '+(r.recipientEmail||getSession()?.email||'seu e-mail')+'.');
      autoFulfillDocumentRequest(r).then(ok=>{if(!ok)alert('A solicitação foi registrada, mas a entrega automática não pôde ser confirmada. O SGQ receberá a pendência normalmente.');showAdminOperationalModule(key)});
      return;
    }
    alert('Solicitação registrada. Não há documento padrão compatível; o pedido foi encaminhado ao SGQ.');
    showAdminOperationalModule(key);return;
  }
  if(key==='nccapa'&&r.ncType==='supplier'){
    finishRncCreation(r,ix>=0);
    return;
  }
  alert('Registro salvo.');
  showAdminOperationalModule(key);
}

async function finishRncCreation(r,wasExisting){
  const msg=wasExisting?'RNC atualizada com sucesso.':'RNC criada com sucesso.';
  if(!portalBackendEnabled()){openRncSuccessModal(r,msg);return;}
  showNucleoLoading('Salvando RNC...');
  try{
    // Usa POST confirmado para toda RNC. A rota GET não é usada para gravar e
    // fotos podem tornar o registro grande demais para uma URL.
    const saved=await portalBackendSaveConfirmedPost('admin_modules',r.id,r,150000);
    const central=saved?.registro||r;
    // Atualiza o cache local com a versão realmente devolvida pela base (inclusive refs das fotos).
    const all=getAdminModuleRecords(),ix=all.findIndex(x=>String(x.id)===String(r.id));
    if(ix>=0){all[ix]={...r,...central};saveAdminModuleRecords(all)}
    hideNucleoLoading();
    openRncSuccessModal({...r,...central},msg);
  }catch(e){
    hideNucleoLoading();
    alert('Não foi possível confirmar o salvamento da RNC na base central.\n\n'+String(e?.message||e||'Falha desconhecida.')+'\n\nNada será enviado por e-mail até o salvamento ser confirmado.');
  }
}
function ensureRncSuccessModal(){
  let ov=document.getElementById('rncSuccessOverlay');if(ov)return ov;
  ov=document.createElement('div');ov.id='rncSuccessOverlay';ov.className='modal hidden';ov.style.zIndex='100300';
  ov.innerHTML=`<div class="modal-box" style="width:min(680px,96vw)"><div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start"><div><h3 id="rncSuccessTitle" style="margin-bottom:5px">RNC criada com sucesso</h3><div id="rncSuccessMeta" class="small"></div></div><button class="btn secondary" type="button" onclick="closeRncSuccessModal()">Fechar</button></div><div style="margin-top:18px;padding:14px;border:1px solid #dbe4df;border-radius:12px;background:#f8faf9"><b>O que deseja fazer agora?</b><div class="small" style="margin-top:4px">Você pode conferir o PDF antes do envio ou enviar depois pela opção Enviar RNC.</div><div style="display:flex;gap:9px;flex-wrap:wrap;margin-top:14px"><button class="btn secondary" type="button" id="rncSuccessPdfBtn">Ver PDF</button><button class="btn primary" type="button" id="rncSuccessSendBtn">Realizar envio</button><button class="btn secondary" type="button" onclick="closeRncSuccessModal(true)">Concluir e voltar</button></div></div></div>`;
  document.body.appendChild(ov);return ov;
}
function openRncSuccessModal(r,msg){
  const ov=ensureRncSuccessModal();ov.dataset.rncId=r.id;ov.classList.remove('hidden');
  document.getElementById('rncSuccessTitle').textContent=msg||'RNC criada com sucesso.';
  const totalFotos=Object.values(r.rncPhotos||{}).reduce((n,g)=>n+(Array.isArray(g)?g.filter(x=>x&&x.fileId).length:0),0);
  document.getElementById('rncSuccessMeta').textContent=[
    r.rncNumber,
    r.supplier,
    r.eventDate||r.rncIssueDate,
    totalFotos?(`${totalFotos} foto(s) confirmada(s) no Drive`):''
  ].filter(Boolean).join(' · ');
  document.getElementById('rncSuccessPdfBtn').onclick=()=>printRncStandard(r.id);
  document.getElementById('rncSuccessSendBtn').onclick=()=>openRncSendModal(r.id);
}
function closeRncSuccessModal(goBack=false){const ov=document.getElementById('rncSuccessOverlay');ov?.classList.add('hidden');if(goBack)showAdminOperationalModule('nccapa')}
function ensureRncSendModal(){
  let ov=document.getElementById('rncSendOverlay');if(ov)return ov;
  ov=document.createElement('div');ov.id='rncSendOverlay';ov.className='modal hidden';ov.style.zIndex='100350';
  ov.innerHTML=`<div class="modal-box" style="width:min(720px,96vw)"><div style="display:flex;justify-content:space-between;gap:12px"><div><h3 style="margin-bottom:4px">Enviar RNC</h3><div class="small">O fornecedor receberá o PDF fechado e o documento editável.</div></div><button class="btn secondary" type="button" onclick="document.getElementById('rncSendOverlay').classList.add('hidden')">Fechar</button></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px"><label><span class="small">Responsável pela abertura</span><input id="rncSendFromName" disabled></label><label><span class="small">E-mail do responsável</span><input id="rncSendReplyTo" disabled></label><label style="grid-column:1/-1"><span class="small">E-mail do fornecedor *</span><input id="rncSendSupplierEmail" type="email" placeholder="fornecedor@empresa.com"></label><label style="grid-column:1/-1"><span class="small">Diretoria / outros destinatários (CC)</span><input id="rncSendCc" placeholder="email1@seta.com.br; email2@seta.com.br"></label><label style="grid-column:1/-1"><span class="small">Assunto</span><input id="rncSendSubject"></label><label style="grid-column:1/-1"><span class="small">Mensagem</span><textarea id="rncSendMessage" style="min-height:110px"></textarea></label></div><div id="rncSendStatus" class="small" style="margin-top:10px"></div><div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px"><button class="btn secondary" type="button" id="rncSendPreviewBtn">Ver PDF</button><button class="btn primary" type="button" id="rncSendNowBtn">Enviar RNC</button></div></div>`;
  document.body.appendChild(ov);return ov;
}
function openRncSendModal(id){
  const r=adminModuleRecord(id);if(!r)return;const ov=ensureRncSendModal(),sess=getSession()||{};ov.dataset.rncId=id;ov.classList.remove('hidden');
  document.getElementById('rncSendFromName').value=sess.name||r.createdBy||'';document.getElementById('rncSendReplyTo').value=sess.email||r.createdByEmail||'';
  document.getElementById('rncSendSupplierEmail').value=r.supplierEmail||'';document.getElementById('rncSendCc').value=r.rncEmailCc||'';
  document.getElementById('rncSendSubject').value=`RNC ${r.rncNumber||''} – ${r.supplier||'Fornecedor'}`;
  document.getElementById('rncSendMessage').value=`Prezados,\n\nSegue anexa a ${r.rncNumber||'RNC'} referente à não conformidade registrada.\n\nSolicitamos a análise e o retorno das ações aplicáveis.\n\nAtenciosamente,\n${sess.name||r.createdBy||'SGQ'}`;
  document.getElementById('rncSendPreviewBtn').onclick=()=>printRncStandard(id);document.getElementById('rncSendNowBtn').onclick=sendRncEmailNow;
  document.getElementById('rncSendStatus').textContent='';
}
async function sendRncEmailNow(){
 if(!nucleoFeatureRequire('nc','send'))return;
  const ov=document.getElementById('rncSendOverlay'),id=ov?.dataset.rncId,r=adminModuleRecord(id);if(!r)return;
  const supplierEmail=String(document.getElementById('rncSendSupplierEmail')?.value||'').trim();if(!supplierEmail||!supplierEmail.includes('@'))return alert('Informe o e-mail do fornecedor.');
  const sendFormat='both',cc=String(document.getElementById('rncSendCc')?.value||'').trim(),replyTo=String(document.getElementById('rncSendReplyTo')?.value||'').trim(),subject=String(document.getElementById('rncSendSubject')?.value||'').trim(),message=String(document.getElementById('rncSendMessage')?.value||'').trim();
  if(!portalBackendEnabled())return alert('Configure o Apps Script para realizar o envio.');
  const html=printRncStandard(id,true);if(!html)return alert('Não foi possível montar o PDF da RNC.');const docHtml=rncWordCompatibleHtml(html);
  const eventId='RNCMAIL-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),btn=document.getElementById('rncSendNowBtn'),st=document.getElementById('rncSendStatus');btn.disabled=true;st.textContent='Confirmando RNC na base central...';showNucleoLoading('Confirmando RNC...');
  const updated={...r,supplierEmail,rncEmailCc:cc,rncEmailStatus:'sending',rncEmailLastAttemptAt:new Date().toISOString()};let all=getAdminModuleRecords(),ix=all.findIndex(x=>String(x.id)===String(id));if(ix>=0)all[ix]=updated;saveAdminModuleRecords(all);
  try{
    // O envio nunca corre em paralelo com o salvamento. Primeiro confirma que o
    // mesmo ID está legível na base central; se necessário, grava e confirma.
    let central=await portalJsonp({acao:'portal_get_record',colecao:'admin_modules',id},15000).catch(()=>null);
    if(!central?.sucesso||!central?.registro){
      central=await portalBackendSaveConfirmedPost('admin_modules',id,updated,90000);
    }
    st.textContent='RNC confirmada. Enviando e-mail...';updateNucleoLoading('Enviando RNC...');
  }catch(e){
    hideNucleoLoading();btn.disabled=false;st.textContent='O envio não foi iniciado. '+String(e?.message||e);return;
  }
  const submitted=portalPostForm({acao:'portal_send_rnc_email',id,email:supplierEmail,cc,replyTo,subject,message,html,docHtml,formato:'both',eventoId:eventId,ator:getSession()?.name||'SGQ'});
  if(!submitted){hideNucleoLoading();btn.disabled=false;st.textContent='Não foi possível iniciar o envio.';return}
  // Gerar PDF + DOCX (principalmente com fotos) pode levar bem mais de 12 s.
  // Aguarda até 2 minutos e confirma por DUAS fontes:
  // 1) status do evento; 2) registro da própria RNC já marcado como enviado.
  let result=null;
  const startedEmail=Date.now();

  while(Date.now()-startedEmail<120000 && !result){
    await new Promise(res=>setTimeout(res,1500));

    try{
      const chk=await portalJsonp({acao:'portal_rnc_email_status',eventoId:eventId},15000);
      if(chk?.sucesso&&chk?.status&&chk.status!=='processing'){
        result=chk;
        break;
      }
    }catch(e){}

    // Fallback real: se o Apps Script já gravou a RNC como "sent",
    // o e-mail foi enviado mesmo que o status do evento ainda não apareça.
    try{
      const central=await portalJsonp({acao:'portal_get_record',colecao:'admin_modules',id},15000);
      const reg=central?.registro;
      if(central?.sucesso && reg && reg.rncEmailStatus==='sent'){
        const sentAt=String(reg.rncEmailSentAt||'');
        const attemptAt=String(updated.rncEmailLastAttemptAt||'');
        if(!attemptAt || !sentAt || sentAt>=attemptAt){
          result={sucesso:true,status:'sent',at:sentAt||new Date().toISOString(),registro:reg};
          break;
        }
      }
    }catch(e){}

    st.textContent='Enviando RNC... aguardando confirmação do e-mail.';
  }

  hideNucleoLoading();btn.disabled=false;

  // Última leitura antes de declarar falha.
  if(!result){
    try{
      const central=await portalJsonp({acao:'portal_get_record',colecao:'admin_modules',id},15000);
      const reg=central?.registro;
      if(central?.sucesso && reg?.rncEmailStatus==='sent'){
        result={sucesso:true,status:'sent',at:reg.rncEmailSentAt||new Date().toISOString(),registro:reg};
      }
    }catch(e){}
  }

  if(!result||result.status!=='sent'){
    st.textContent='O envio não foi confirmado.'+(result?.erro?' '+result.erro:'');
    return;
  }

  const done={...updated,...(result.registro||{}),rncEmailStatus:'sent',rncEmailSentAt:result.at||new Date().toISOString(),rncEmailTo:supplierEmail,rncEmailCc:cc};all=getAdminModuleRecords();ix=all.findIndex(x=>x.id===id);if(ix>=0)all[ix]=done;saveAdminModuleRecords(all);portalBackendSave('admin_modules',id,done);st.textContent='RNC enviada com sucesso.';setTimeout(()=>{ov.classList.add('hidden');openRncSuccessModal(done,'RNC enviada com sucesso.');},650);
}

const PROCESS_LAYOUT_KEY='nucleo_process_layouts_v1';
function defaultProcessLayouts(){return [
 {id:'layout-form-seta',name:'Formulários SETA',type:'Formulário',status:'active',accent:'#1f4e78',logoDataUrl:'',logoText:'SETA',layout:{logoWidth:19,metaWidth:25,headerHeight:13,rowHeight:7,borderWidth:.65,fontScale:100,sectionHeight:5},updatedAt:''},
 {id:'layout-proc-seta',name:'POP / Procedimentos',type:'Procedimento',status:'active',accent:'#1f4e78',logoDataUrl:'',logoText:'SETA',layout:{logoWidth:18,metaWidth:24,headerHeight:12,rowHeight:6,borderWidth:.6,fontScale:95,sectionHeight:4},updatedAt:''},
 {id:'layout-rel-seta',name:'Relatórios SETA',type:'Relatório',status:'active',accent:'#1f4e78',logoDataUrl:'',logoText:'SETA',layout:{logoWidth:20,metaWidth:24,headerHeight:14,rowHeight:7,borderWidth:.6,fontScale:100,sectionHeight:5},updatedAt:''}
]}
function getProcessLayouts(){try{const a=JSON.parse(localStorage.getItem(PROCESS_LAYOUT_KEY)||'[]');if(Array.isArray(a)&&a.length)return a}catch(e){}return defaultProcessLayouts()}
function saveProcessLayouts(a){safeStorageSet(PROCESS_LAYOUT_KEY,JSON.stringify(a));portalBackendSave('shared_state','process_layouts',{items:a,updatedAt:new Date().toISOString()})}
function processLayoutById(id){return getProcessLayouts().find(x=>x.id===id)||null}
function createProcessLayout(){const name=prompt('Nome do novo padrão de layout:','Novo padrão SETA');if(!name)return;const a=getProcessLayouts();a.push({id:'layout-'+Date.now(),name:name.trim(),type:'Personalizado',status:'active',accent:'#1f4e78',logoDataUrl:'',logoText:'SETA',layout:{logoWidth:19,metaWidth:25,headerHeight:13,rowHeight:7,borderWidth:.65,fontScale:100,sectionHeight:5},updatedAt:new Date().toISOString()});saveProcessLayouts(a);renderProcessTemplatesWorkspace()}
function duplicateProcessLayout(id){const src=processLayoutById(id);if(!src)return;const a=getProcessLayouts();a.push({...JSON.parse(JSON.stringify(src)),id:'layout-'+Date.now(),name:src.name+' — cópia',status:'active',updatedAt:new Date().toISOString()});saveProcessLayouts(a);renderProcessTemplatesWorkspace()}
function toggleProcessLayoutStatus(id){const a=getProcessLayouts(),x=a.find(v=>v.id===id);if(!x)return;x.status=x.status==='obsolete'?'active':'obsolete';x.updatedAt=new Date().toISOString();saveProcessLayouts(a);renderProcessTemplatesWorkspace()}
function createProcessDocumentModel(){const name=prompt('Nome do novo modelo de documento:','Novo documento');if(!name)return;const code=prompt('Código do documento (opcional):','')||'';const layouts=getProcessLayouts().filter(x=>x.status!=='obsolete');const layoutId=layouts[0]?.id||'';const a=getProcessTemplates();a.push({id:'tpl-'+Date.now(),kind:'GENERIC',name:name.trim(),code:code.trim(),revision:'01',title:name.trim().toUpperCase(),status:'active',layoutId,documentType:'Formulário',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),sections:[],fieldLayout:[],fixedImages:[],photoFields:[]});saveProcessTemplates(a);renderProcessTemplatesWorkspace()}
function duplicateProcessDocumentModel(id){const a=getProcessTemplates(),src=a.find(x=>x.id===id);if(!src)return;const cp=JSON.parse(JSON.stringify(src));cp.id='tpl-'+Date.now();cp.name=(src.name||'Documento')+' — cópia';cp.code='';cp.status='active';cp.updatedAt=new Date().toISOString();a.push(cp);saveProcessTemplates(a);renderProcessTemplatesWorkspace()}
function toggleProcessDocumentStatus(id){const a=getProcessTemplates(),x=a.find(v=>v.id===id);if(!x)return;x.status=x.status==='obsolete'?'active':'obsolete';x.updatedAt=new Date().toISOString();saveProcessTemplates(a);renderProcessTemplatesWorkspace()}
function applyProcessLayoutToRnc(id){const l=processLayoutById(id);if(!l)return;['tplLogoWidth','tplMetaWidth','tplHeaderHeight','tplRowHeight','tplBorderWidth','tplFontScale','tplSectionHeight'].forEach((elId,i)=>{const keys=['logoWidth','metaWidth','headerHeight','rowHeight','borderWidth','fontScale','sectionHeight'];const el=document.getElementById(elId);if(el)el.value=l.layout?.[keys[i]]??el.value});const ac=document.getElementById('tplAccent');if(ac)ac.value=l.accent||'#1f4e78';if(l.logoDataUrl){const h=document.getElementById('tplLogoData');if(h)h.value=l.logoDataUrl;const c=document.getElementById('tplLogoCurrent');if(c)c.innerHTML=`<img src="${l.logoDataUrl}" alt="Logo" style="max-width:150px;max-height:54px;object-fit:contain">`}const lt=document.getElementById('tplLogoText');if(lt)lt.value=l.logoText||'SETA';refreshRncTemplatePreview()}
function processDocumentLibraryHtml(){const layouts=getProcessLayouts(),models=getProcessTemplates();return `<div style="display:grid;gap:14px;margin-bottom:18px"><div class="card" style="padding:16px"><div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap"><div><b>Padrões de layout</b><div class="small">Você pode ter vários padrões SETA. Eles servem como base visual e não obrigam todos os documentos a serem iguais.</div></div><button class="btn secondary" type="button" onclick="createProcessLayout()">+ Novo padrão</button></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:9px;margin-top:12px">${layouts.map(l=>`<div style="border:1px solid #e3e8f1;border-radius:11px;padding:11px;opacity:${l.status==='obsolete'?'.58':'1'}"><div style="display:flex;justify-content:space-between;gap:6px"><b>${escapeHtml(l.name)}</b><span class="pill">${l.status==='obsolete'?'Obsoleto':'Vigente'}</span></div><div class="small" style="margin-top:4px">${escapeHtml(l.type||'Personalizado')}</div><div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:9px"><button class="btn secondary" type="button" onclick="applyProcessLayoutToRnc('${l.id}')">Aplicar na RNC</button><button class="btn secondary" type="button" onclick="duplicateProcessLayout('${l.id}')">Duplicar</button><button class="btn secondary" type="button" onclick="toggleProcessLayoutStatus('${l.id}')">${l.status==='obsolete'?'Reativar':'Retirar'}</button></div></div>`).join('')}</div></div><div class="card" style="padding:16px"><div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap"><div><b>Modelos de documentos</b><div class="small">Cada documento escolhe seu próprio padrão ou pode ter layout independente.</div></div><button class="btn secondary" type="button" onclick="createProcessDocumentModel()">+ Novo modelo</button></div><div style="overflow:auto;margin-top:10px"><table style="width:100%;border-collapse:collapse"><thead><tr><th style="text-align:left;padding:7px">Código</th><th style="text-align:left;padding:7px">Documento</th><th style="text-align:left;padding:7px">Tipo</th><th style="text-align:left;padding:7px">Revisão</th><th style="text-align:left;padding:7px">Situação</th><th style="padding:7px"></th></tr></thead><tbody>${models.map(m=>`<tr style="border-top:1px solid #e8edf4;opacity:${m.status==='obsolete'?'.58':'1'}"><td style="padding:8px">${escapeHtml(m.code||'—')}</td><td style="padding:8px"><b>${escapeHtml(m.name||m.title||'Documento')}</b>${m.kind==='RNC'?'<div class="small">Modelo operacional da RNC</div>':''}</td><td style="padding:8px">${escapeHtml(m.documentType||m.kind||'Documento')}</td><td style="padding:8px">${escapeHtml(m.revision||'—')}</td><td style="padding:8px">${m.status==='obsolete'?'Obsoleto':'Vigente'}</td><td style="padding:8px;white-space:nowrap"><button class="btn secondary" type="button" onclick="duplicateProcessDocumentModel('${m.id}')">Duplicar</button> <button class="btn secondary" type="button" onclick="toggleProcessDocumentStatus('${m.id}')">${m.status==='obsolete'?'Reativar':'Retirar'}</button></td></tr>`).join('')}</tbody></table></div></div></div>`}
const PROCESS_TEMPLATE_KEY='nucleo_process_templates_v1';
function defaultRncProcessTemplate(){
  return {id:'tpl-rnc-for-cor-qua-0003',kind:'RNC',layoutId:'layout-form-seta',documentType:'Formulário',name:'RNC de fornecedor',code:'FOR-COR-QUA-0003',revision:'Vigente',title:'RELATÓRIO DE SEGREGAÇÃO',status:'active',accent:'#1f4e78',showLogo:true,logoText:'SETA',logoDataUrl:'',supplierResponseTitle:'RESPOSTA DO FORNECEDOR',supplierResponseNote:'As etapas abaixo registram somente as informações efetivamente devolvidas pelo fornecedor e podem permanecer em branco.',footerText:'',pageBreakBeforeSupplier:true,repeatHeaderOnPages:true,repeatFooterOnPages:true,headerStandard:false,footerStandard:false,sendFormat:'pdf',layout:{logoWidth:19,metaWidth:25,headerHeight:13,rowHeight:7,borderWidth:0.65,fontScale:100,sectionHeight:5},headerLayout:defaultRncHeaderLayout(),fixedImages:[],photoFields:[{id:'registro-fotografico',label:'REGISTRO FOTOGRÁFICO',maxPhotos:4,required:false,enabled:true}],fieldLayout:defaultRncFieldLayout(),updatedAt:'',sections:[
    {id:'identification',label:'IDENTIFICAÇÃO',enabled:true,owner:'sgq',align:'left'},
    {id:'blocking',label:'BLOQUEIO',enabled:true,owner:'sgq',align:'left'},
    {id:'problem',label:'DESVIO EVIDENCIADO / DESCRIÇÃO DETALHADA DA OCORRÊNCIA',enabled:true,owner:'sgq',align:'left'},
    {id:'effect',label:'EFEITO DO DESVIO',enabled:true,owner:'sgq',align:'left'},
    {id:'participants',label:'PARTICIPANTES DO PREENCHIMENTO',enabled:true,owner:'sgq',align:'left'},
    {id:'immediate',label:'AÇÕES IMEDIATAS',enabled:true,owner:'supplier',align:'left'},
    {id:'ishikawa',label:'ISHIKAWA',enabled:true,owner:'supplier',align:'left'},
    {id:'fivewhys',label:'ANÁLISE DOS 5 PORQUÊS',enabled:true,owner:'supplier',align:'left'},
    {id:'cause',label:'CONCLUSÃO DA INVESTIGAÇÃO DE CAUSA',enabled:true,owner:'supplier',align:'left'},
    {id:'corrective',label:'AÇÕES CORRETIVAS E PREVENTIVAS',enabled:true,owner:'supplier',align:'left'},
    {id:'effectiveness',label:'VERIFICAÇÃO DE EFICÁCIA',enabled:true,owner:'supplier',align:'left'},
    {id:'photos',label:'REGISTRO FOTOGRÁFICO',enabled:true,owner:'sgq',align:'left'},
    {id:'signatures',label:'ELABORADOR · VERIFICADOR · APROVADOR',enabled:true,owner:'footer',align:'left'}
  ]};
}
function normalizeRncTemplate(t){
  const d=defaultRncProcessTemplate(), src=t&&typeof t==='object'?t:{};
  const oldSecs=Array.isArray(src.sections)?src.sections:[];
  const sections=d.sections.map(ds=>{const os=oldSecs.find(x=>x.id===ds.id);const merged=os?{...ds,...os}:{...ds};if(!src.ownershipVersion&&merged.id==='signatures')merged.owner='footer';return merged;});
  const layout={...d.layout,...(src.layout||{})};
  let fieldLayout=Array.isArray(src.fieldLayout)&&src.fieldLayout.length?src.fieldLayout.map(x=>({...x})):defaultRncFieldLayout();if(Number(src.gridVersion||0)<3){const defs=defaultRncFieldLayout();const existing=new Set(fieldLayout.map(x=>x.id));defs.forEach(x=>{if(!existing.has(x.id))fieldLayout.push({...x})})}
  // Migração v4: remove a célula fantasma legado "@A" que podia surgir antes
  // do PORQUÊ 1 e normaliza os cinco campos dos 5 Porquês para ocupar 100% da linha.
  if(Number(src.gridVersion||0)<4){fieldLayout=fieldLayout.filter(x=>!(x.section==='fivewhys'&&String(x.source||'')==='@A'));const whys=fieldLayout.filter(x=>x.section==='fivewhys');if(whys.length===5)whys.forEach(x=>{x.width=20;x.row=1})}
  // Migração v2: nos modelos salvos antes do rodapé real, as três assinaturas podiam
  // continuar marcadas como fornecedor e por isso apareciam no meio da página 2.
  if(Number(src.ownershipVersion||0)<2){fieldLayout=fieldLayout.map(x=>x.section==='signatures'?{...x,owner:'footer'}:x);const sig=sections.find(x=>x.id==='signatures');if(sig)sig.owner='footer';}
  let headerLayout=Array.isArray(src.headerLayout)&&src.headerLayout.length?src.headerLayout.map(x=>({...x})):defaultRncHeaderLayout();
  if(!headerLayout.some(x=>x.source==='@logo')){headerLayout=headerLayout.map(x=>({...x,row:(Number(x.row)||1)+2}));headerLayout.unshift({id:'h-logo',row:1,label:'',value:'',source:'@logo',width:20,height:13,align:'center',bold:true},{id:'h-system',row:1,label:'',value:'SISTEMA DE GESTÃO INTEGRADO',source:'@SISTEMA DE GESTÃO INTEGRADO',width:80,height:13,align:'center',bold:true},{id:'h-form',row:2,label:'',value:'FORMULÁRIO DE REGISTRO',source:'@FORMULÁRIO DE REGISTRO',width:100,height:6,align:'center',bold:false});}
  return {...d,...src,gridVersion:4,ownershipVersion:2,layout,sections,headerLayout,logoDataUrl:String(src.logoDataUrl||''),fixedImages:Array.isArray(src.fixedImages)?src.fixedImages:[],photoFields:Array.isArray(src.photoFields)&&src.photoFields.length?src.photoFields:d.photoFields,fieldLayout};
}
function getProcessTemplates(){
  try{const a=JSON.parse(localStorage.getItem(PROCESS_TEMPLATE_KEY)||'[]');if(Array.isArray(a)&&a.length)return a.map(x=>x.kind==='RNC'?normalizeRncTemplate(x):x)}catch(e){}
  return [defaultRncProcessTemplate()];
}
function saveProcessTemplates(a){safeStorageSet(PROCESS_TEMPLATE_KEY,JSON.stringify(a));portalBackendSave('shared_state','process_templates',{items:a,updatedAt:new Date().toISOString()});}
function getRncProcessTemplate(){return normalizeRncTemplate(getProcessTemplates().find(x=>x.kind==='RNC'&&x.status!=='obsolete')||defaultRncProcessTemplate())}
function rncTemplateLogoHtml(t,preview=false){
  const logo=String(t.logoDataUrl||'');
  if(logo)return `<img src="${logo}" alt="Logo" style="max-width:${preview?'150':'145'}px;max-height:${preview?'54':'42'}px;object-fit:contain;display:block">`;
  return `<div style="font-size:${preview?'23':'18'}px;font-weight:900;letter-spacing:.04em;color:${escapeHtml(t.accent||'#1f4e78')}">${escapeHtml(t.logoText||'SETA')}</div>`;
}
function renderRncFixedImagesEditor(t){const a=t.fixedImages||[];return a.length?a.map((x,i)=>`<div style="display:flex;align-items:center;gap:8px;border:1px solid #e3e8f1;border-radius:9px;padding:7px;margin-bottom:6px"><img src="${x.dataUrl}" style="width:54px;height:38px;object-fit:contain;background:#fff"><input value="${escapeHtml(x.label||'Imagem fixa')}" onchange="renameRncFixedImage(${i},this.value)"><button class="btn secondary" type="button" onclick="removeRncFixedImage(${i})">Remover</button></div>`).join(''):'<div class="small">Nenhuma imagem fixa adicional.</div>'}
function getTplJson(id,fallback=[]){try{return JSON.parse(document.getElementById(id)?.value||'[]')}catch(e){return fallback}}
function setTplJson(id,v){const el=document.getElementById(id);if(el)el.value=JSON.stringify(v)}
function addRncFixedImage(input){const f=input?.files?.[0];if(!f)return;if(f.size>1500000){alert('A imagem precisa ter até 1,5 MB.');input.value='';return}const rd=new FileReader();rd.onload=()=>{const a=getTplJson('tplFixedImagesData');a.push({id:'img-'+Date.now(),label:f.name||'Imagem fixa',dataUrl:String(rd.result||'')});setTplJson('tplFixedImagesData',a);const h=document.getElementById('tplFixedImagesList');if(h)h.innerHTML=renderRncFixedImagesEditor({fixedImages:a});input.value='';refreshRncTemplatePreview()};rd.readAsDataURL(f)}
function removeRncFixedImage(i){const a=getTplJson('tplFixedImagesData');a.splice(i,1);setTplJson('tplFixedImagesData',a);document.getElementById('tplFixedImagesList').innerHTML=renderRncFixedImagesEditor({fixedImages:a});refreshRncTemplatePreview()}
function renameRncFixedImage(i,v){const a=getTplJson('tplFixedImagesData');if(a[i])a[i].label=v;setTplJson('tplFixedImagesData',a)}
function renderRncPhotoFieldsEditor(t){const a=t.photoFields||[];return a.length?a.map((x,i)=>`<div style="display:grid;grid-template-columns:1fr 92px auto auto;gap:7px;align-items:center;border:1px solid #e3e8f1;border-radius:9px;padding:7px"><input value="${escapeHtml(x.label||'Registro fotográfico')}" onchange="updateRncPhotoField(${i},'label',this.value)"><label class="small">Máx. <input type="number" min="1" max="8" value="${Number(x.maxPhotos)||4}" onchange="updateRncPhotoField(${i},'maxPhotos',this.value)" style="padding:5px"></label><label class="small"><input type="checkbox" ${x.required?'checked':''} onchange="updateRncPhotoField(${i},'required',this.checked)" style="width:auto"> obrigatório</label><button class="btn secondary" type="button" onclick="removeRncPhotoField(${i})">Remover</button></div>`).join(''):'<div class="small">Nenhum campo de foto no modelo.</div>'}
function addRncPhotoField(){const a=getTplJson('tplPhotoFieldsData');a.push({id:'foto-'+Date.now(),label:'REGISTRO FOTOGRÁFICO',maxPhotos:4,required:false,enabled:true});setTplJson('tplPhotoFieldsData',a);document.getElementById('tplPhotoFieldsList').innerHTML=renderRncPhotoFieldsEditor({photoFields:a});refreshRncTemplatePreview()}
function updateRncPhotoField(i,k,v){const a=getTplJson('tplPhotoFieldsData');if(!a[i])return;a[i][k]=k==='maxPhotos'?Math.max(1,Math.min(8,Number(v)||1)):v;setTplJson('tplPhotoFieldsData',a);refreshRncTemplatePreview()}
function removeRncPhotoField(i){const a=getTplJson('tplPhotoFieldsData');a.splice(i,1);setTplJson('tplPhotoFieldsData',a);document.getElementById('tplPhotoFieldsList').innerHTML=renderRncPhotoFieldsEditor({photoFields:a});refreshRncTemplatePreview()}
function rncTemplateMediaPreview(t){const fixed=(t.fixedImages||[]).map(x=>`<div style="padding:7px;border-bottom:1px solid #555;text-align:center"><div style="font-size:7px;font-weight:700;margin-bottom:4px">${escapeHtml(x.label||'IMAGEM')}</div><img src="${x.dataUrl}" style="max-width:90%;max-height:70px;object-fit:contain"></div>`).join('');const photos=(t.photoFields||[]).map(x=>`<div style="padding:7px;border-bottom:1px solid #555"><b style="font-size:8px">${escapeHtml(x.label)}</b><div style="display:grid;grid-template-columns:repeat(${Math.min(4,Number(x.maxPhotos)||4)},1fr);gap:4px;margin-top:6px">${Array.from({length:Math.min(4,Number(x.maxPhotos)||4)},()=>'<div style="height:38px;border:1px dashed #9aa4b2;background:#fafafa"></div>').join('')}</div></div>`).join('');return fixed+photos}
function rncPhotoInputsHtml(){const t=getRncProcessTemplate();return (t.photoFields||[]).map(f=>`<div style="grid-column:1/-1;border:1px solid #d9e1ee;border-radius:12px;padding:12px"><b>${escapeHtml(f.label)}</b><div class="small">Até ${Number(f.maxPhotos)||4} foto(s)${f.required?' · obrigatório':''}. Elas entram automaticamente no PDF.</div><input type="file" accept="image/*" multiple data-rnc-photo-field="${escapeHtml(f.id)}" data-max="${Number(f.maxPhotos)||4}" style="margin-top:8px"><input type="hidden" id="rncPhotos_${escapeHtml(f.id)}" value="[]"></div>`).join('')}
function collectRncPhotos(){const out={};document.querySelectorAll('[data-rnc-photo-field]').forEach(inp=>{const id=inp.dataset.rncPhotoField;const hidden=document.getElementById('rncPhotos_'+id);try{out[id]=JSON.parse(hidden?.value||'[]')}catch(e){out[id]=[]}});return out}

function compressRncPhotoPreview(file){
  return new Promise((resolve,reject)=>{
    const rd=new FileReader();
    rd.onload=()=>{
      const im=new Image();
      im.onload=()=>{
        const max=320,scale=Math.min(1,max/Math.max(im.width,im.height));
        const c=document.createElement('canvas');
        c.width=Math.max(1,Math.round(im.width*scale));
        c.height=Math.max(1,Math.round(im.height*scale));
        c.getContext('2d').drawImage(im,0,0,c.width,c.height);
        resolve(c.toDataURL('image/jpeg',.5));
      };
      im.onerror=reject;
      im.src=rd.result;
    };
    rd.onerror=reject;
    rd.readAsDataURL(file);
  });
}
async function uploadRncPhotoOnline(dataUrl,fieldId){
  if(!navigator.onLine)throw new Error('A foto precisa ser enviada com conexão à internet.');
  if(!portalBackendEnabled())throw new Error('Apps Script não configurado para salvar a foto.');

  if(!window.__rncPhotoUploadKey)window.__rncPhotoUploadKey='RNC-TEMP-'+Date.now();
  const eventoId='RNCPHOTO-'+Date.now()+'-'+Math.random().toString(36).slice(2,9);

  const ok=portalPostForm({
    acao:'portal_upload_rnc_photo',
    eventoId,
    rncKey:window.__rncPhotoUploadKey,
    campoId:String(fieldId||'foto'),
    fileData:String(dataUrl||''),
    ator:getSession()?.name||'SGQ'
  });
  if(!ok)throw new Error('Não foi possível iniciar o envio da foto.');

  const started=Date.now();
  while(Date.now()-started<120000){
    await new Promise(resolve=>setTimeout(resolve,900));
    const st=await portalJsonp({acao:'portal_rnc_photo_status',eventoId},12000).catch(()=>null);
    if(st?.status==='done'&&st?.photo?.fileId)return st.photo;
    if(st?.status==='error')throw new Error(st.erro||'Falha ao gravar a foto no Drive.');
  }
  throw new Error('A foto não foi confirmada no Drive dentro do tempo esperado.');
}
function bindRncPhotoInputs(existing={}){
  document.querySelectorAll('[data-rnc-photo-field]').forEach(inp=>{
    const id=inp.dataset.rncPhotoField,h=document.getElementById('rncPhotos_'+id);
    let saved=Array.isArray(existing[id])?existing[id]:[];
    if(h)h.value=JSON.stringify(saved);

    let info=inp.parentElement?.querySelector('[data-rnc-photo-info]');
    if(!info){
      info=document.createElement('div');
      info.dataset.rncPhotoInfo='1';
      info.className='small';
      info.style.marginTop='6px';
      inp.insertAdjacentElement('afterend',info);
    }

    let preview=inp.parentElement?.querySelector('[data-rnc-photo-preview]');
    if(!preview){
      preview=document.createElement('div');
      preview.dataset.rncPhotoPreview='1';
      preview.style.cssText='display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:8px';
      info.insertAdjacentElement('afterend',preview);
    }

    const updateInfo=(message='',state='neutral')=>{
      let a=[];try{a=JSON.parse(h?.value||'[]')}catch(e){}

      const defaultText=a.length
        ? `${a.length} foto(s) salva(s) online nesta RNC.`
        : 'Nenhuma foto salva ainda.';

      info.textContent=message||defaultText;
      info.style.fontWeight=state==='success'||state==='error'?'700':'400';
      info.style.color=
        state==='success'?'#18794e':
        state==='error'?'#b42318':
        state==='sending'?'#7a5a00':'';

      preview.innerHTML=a.map((photo,i)=>{
        const src=rncPhotoSrc(photo);
        return src?`<div style="position:relative;border:1px solid #d8e0ec;border-radius:8px;padding:4px;background:#fff"><img src="${escapeHtml(src)}" style="display:block;width:100%;height:90px;object-fit:contain"><button type="button" class="btn danger" onclick="removeRncPhoto('${escapeHtml(id)}',${i})" style="position:absolute;right:4px;top:4px;padding:3px 6px;font-size:10px">×</button></div>`:'';
      }).join('');
    };

    updateInfo();

    inp.onchange=async()=>{
      const max=Number(inp.dataset.max)||4;
      let arr=[];try{arr=JSON.parse(h?.value||'[]')}catch(e){}
      const files=[...(inp.files||[])];

      if(!files.length)return;

      inp.disabled=true;
      let onlineAgora=0;
      let pendentesAgora=0;

      try{
        for(const f of files){
          if(arr.length>=max){
            updateInfo(`Limite de ${max} foto(s) atingido.`, 'error');
            break;
          }

          if(f.size>2500000){
            updateInfo(`A foto "${f.name}" é maior que 2,5 MB e não foi adicionada.`, 'error');
            alert('Cada foto precisa ter até 2,5 MB.');
            continue;
          }

          // A miniatura aparece imediatamente. O usuário não fica preso
          // olhando apenas "Enviando..." sem saber se a foto foi registrada.
          updateInfo(`Preparando "${f.name}"...`, 'sending');

          const [dataUrl,previewDataUrl]=await Promise.all([
            compressRncPhoto(f),
            compressRncPhotoPreview(f)
          ]);

          let savedPhoto=null;

          try{
            updateInfo(`Enviando "${f.name}" para o Drive...`, 'sending');

            // Não deixa a interface ficar indefinidamente em "Enviando".
            // Se a confirmação direta demorar, a foto fica guardada no
            // próprio registro e o backend conclui o upload quando a RNC for salva.
            savedPhoto=await Promise.race([
              uploadRncPhotoOnline(dataUrl,id),
              new Promise((_,reject)=>setTimeout(
                ()=>reject(new Error('A confirmação online demorou mais que o esperado.')),
                18000
              ))
            ]);
          }catch(uploadErr){
            savedPhoto=null;
          }

          if(savedPhoto?.fileId){
            arr.push({...savedPhoto,previewDataUrl});
            onlineAgora++;
            updateInfo(
              `✓ "${f.name}" salva no Drive com sucesso.`,
              'success'
            );
          }else{
            // Fallback seguro: mantém a foto dentro da RNC. O Apps Script já
            // converte dataUrl em arquivo do Drive durante o salvamento da RNC.
            arr.push({
              dataUrl,
              previewDataUrl,
              name:f.name,
              mimeType:f.type||'image/jpeg',
              pendingDriveUpload:true
            });
            pendentesAgora++;
            updateInfo(
              `✓ "${f.name}" adicionada à RNC. O Drive será confirmado ao salvar a RNC.`,
              'success'
            );
          }

          arr=arr.slice(0,max);
          if(h)h.value=JSON.stringify(arr);
          updateInfo(
            onlineAgora
              ? `✓ Foto confirmada no Drive. Total nesta RNC: ${arr.length}.`
              : `✓ Foto adicionada. Ela será enviada ao Drive quando você salvar a RNC.`,
            'success'
          );
        }

        if(onlineAgora>1){
          updateInfo(`✓ ${onlineAgora} fotos confirmadas no Drive.`, 'success');
        }else if(pendentesAgora>1){
          updateInfo(`✓ ${pendentesAgora} fotos adicionadas. O Drive será confirmado ao salvar a RNC.`, 'success');
        }
      }catch(e){
        const msg=String(e?.message||e||'Erro desconhecido');
        updateInfo(`✕ Não foi possível adicionar a foto: ${msg}`, 'error');
        alert('Não foi possível adicionar a foto.\n\n'+msg);
      }finally{
        inp.value='';
        inp.disabled=false;
      }
    };
  });
}
function removeRncPhoto(fieldId,index){
  const h=document.getElementById('rncPhotos_'+fieldId);if(!h)return;
  let arr=[];try{arr=JSON.parse(h.value||'[]')}catch(e){}
  arr.splice(index,1);
  h.value=JSON.stringify(arr);
  bindRncPhotoInputs({[fieldId]:arr});
}
function compressRncPhoto(file){return new Promise((resolve,reject)=>{const rd=new FileReader();rd.onload=()=>{const im=new Image();im.onload=()=>{const max=900,scale=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(im.width*scale));c.height=Math.max(1,Math.round(im.height*scale));c.getContext('2d').drawImage(im,0,0,c.width,c.height);resolve(c.toDataURL('image/jpeg',.65))};im.onerror=reject;im.src=rd.result};rd.onerror=reject;rd.readAsDataURL(file)})}
function defaultRncHeaderLayout(){return [
{id:'h-logo',row:1,label:'',value:'',source:'@logo',width:20,height:13,align:'center',bold:true},
{id:'h-system',row:1,label:'',value:'SISTEMA DE GESTÃO INTEGRADO',source:'@SISTEMA DE GESTÃO INTEGRADO',width:80,height:13,align:'center',bold:true},
{id:'h-form',row:2,label:'',value:'FORMULÁRIO DE REGISTRO',source:'@FORMULÁRIO DE REGISTRO',width:100,height:6,align:'center',bold:false},
{id:'h-title-label',row:3,label:'Título:',value:'',source:'@label',width:10,height:7,align:'left',bold:true},
{id:'h-title',row:3,label:'',value:'RELATÓRIO DE SEGREGAÇÃO',source:'title',width:52,height:7,align:'center',bold:true},
{id:'h-code',row:3,label:'Código',value:'',source:'code',width:19,height:7,align:'left',bold:false},
{id:'h-revision',row:3,label:'Revisão',value:'',source:'revision',width:19,height:7,align:'left',bold:false},
{id:'h-area-label',row:4,label:'Área:',value:'',source:'@label',width:10,height:7,align:'left',bold:true},
{id:'h-area',row:4,label:'',value:'QUALIDADE',source:'@QUALIDADE',width:52,height:7,align:'left',bold:false},
{id:'h-register',row:4,label:'Registro',value:'',source:'@RNC-2026-0001',width:19,height:7,align:'left',bold:false},
{id:'h-page',row:4,label:'Página',value:'',source:'@1 de 1',width:19,height:7,align:'left',bold:false}
]}
function rncHeaderFields(){return getTplJson('tplHeaderLayoutData',defaultRncHeaderLayout())}
function saveRncHeaderFields(a){setTplJson('tplHeaderLayoutData',a);const h=document.getElementById('tplHeaderLayoutList');if(h)h.innerHTML=renderRncHeaderLayoutEditor({...collectRncTemplateForm(),headerLayout:a});refreshRncTemplatePreview()}
function updateRncHeaderField(i,k,v){const a=rncHeaderFields();if(!a[i])return;if(['width','height'].includes(k))v=Math.max(k==='width'?5:3,Number(v)||0);a[i][k]=v;saveRncHeaderFields(a)}
function updateRncHeaderValue(i,v){
  const a=rncHeaderFields();
  if(!a[i])return;

  const src=String(a[i].source||'');

  if(src==='code'){
    const el=document.getElementById('tplCode');
    if(el)el.value=v;
  }else if(src==='revision'){
    const el=document.getElementById('tplRevision');
    if(el)el.value=v;
  }else if(src==='title'){
    const el=document.getElementById('tplTitle');
    if(el)el.value=v;
  }else if(src==='@logo'){
    return;
  }else{
    // Valores literais do cabeçalho ficam guardados como @texto.
    a[i].source='@'+String(v||'');
    setTplJson('tplHeaderLayoutData',a);
  }

  // Atualiza a folha sem recriar o input onde a pessoa está digitando.
  refreshRncTemplatePreview();
}

function renderRncHeaderLayoutEditor(t){const a=t.headerLayout||defaultRncHeaderLayout();const rows=[...new Set(a.map(x=>Number(x.row)||1))].sort((x,y)=>x-y);return `<div style="display:flex;gap:7px;flex-wrap:wrap;margin-bottom:10px"><button type="button" class="btn secondary" onclick="addRncHeaderCell()">+ Célula</button><button type="button" class="btn secondary" onclick="addRncHeaderRow()">+ Linha</button></div>`+rows.map(row=>`<div style="border:1px solid #d7deea;border-radius:12px;padding:10px;background:#f8fafc"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><b style="font-size:12px">Linha ${row}</b><button type="button" class="btn secondary" style="padding:6px 9px" onclick="addRncHeaderCell(${row})">+ célula nesta linha</button></div><div style="display:grid;gap:8px">${a.map((x,i)=>({x,i})).filter(o=>(Number(o.x.row)||1)===row).map(({x,i})=>`<div style="border:1px solid #e3e8f1;border-radius:10px;padding:10px;background:#fff"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center;margin-bottom:8px"><b style="font-size:12px">${escapeHtml(x.label||x.value||('Célula '+(i+1)))}</b><div style="display:flex;gap:5px;flex-wrap:wrap"><button type="button" class="btn secondary" style="padding:5px 8px" onclick="mergeRncHeaderCell(${i})">Mesclar →</button><button type="button" class="btn secondary" style="padding:5px 8px" onclick="splitRncHeaderCell(${i})">Dividir</button><button type="button" class="btn danger" style="padding:5px 8px" onclick="removeRncHeaderCellById('${x.id}',event)">Excluir</button></div></div><div style="display:grid;grid-template-columns:minmax(140px,1.3fr) minmax(140px,1fr) 90px 90px 115px;gap:7px;align-items:end"><label><span class="small">Texto / rótulo</span><input value="${escapeHtml(x.label||'')}" oninput="updateRncHeaderField(${i},'label',this.value)"></label><label><span class="small">Valor</span><input value="${escapeHtml(
  x.source==='code' ? (t.code||'') :
  x.source==='revision' ? (t.revision||'') :
  x.source==='title' ? (t.title||'') :
  String(x.source||'').startsWith('@')&&x.source!=='@label'&&x.source!=='@logo' ? String(x.source).slice(1) :
  (x.value||'')
)}" ${x.source==='@logo'?'disabled':''} oninput="updateRncHeaderValue(${i},this.value)"></label><label><span class="small">Largura %</span><input type="number" min="3" max="100" step="1" value="${Number(x.width)||20}" oninput="updateRncHeaderField(${i},'width',this.value)"></label><label><span class="small">Altura mm</span><input type="number" min="3" max="50" step="1" value="${Number(x.height)||7}" oninput="updateRncHeaderField(${i},'height',this.value)"></label><label><span class="small">Alinhamento</span><select onchange="updateRncHeaderField(${i},'align',this.value)"><option value="left" ${x.align==='left'?'selected':''}>Esquerda</option><option value="center" ${x.align==='center'?'selected':''}>Centro</option><option value="right" ${x.align==='right'?'selected':''}>Direita</option></select></label></div></div>`).join('')}</div></div>`).join('')}
function nextRncHeaderId(){return 'h-custom-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,6)}
function addRncHeaderCell(row){const a=rncHeaderFields();row=Number(row)||Math.max(1,...a.map(x=>Number(x.row)||1));const same=a.filter(x=>(Number(x.row)||1)===row);const width=same.length?Math.max(5,Math.round(100/(same.length+1))):100;if(same.length)same.forEach(x=>x.width=Math.max(5,(Number(x.width)||20)*same.length/(same.length+1)));a.push({id:nextRncHeaderId(),row,label:'Novo campo',value:'',source:'@',width,height:7,align:'left',bold:false});saveRncHeaderFields(a)}
function addRncHeaderRow(){const a=rncHeaderFields(),row=Math.max(0,...a.map(x=>Number(x.row)||1))+1;a.push({id:nextRncHeaderId(),row,label:'Novo campo',value:'',source:'@',width:100,height:7,align:'left',bold:false});saveRncHeaderFields(a)}
function removeRncHeaderCell(i){
  const a=rncHeaderFields();
  const x=a[i];
  if(!x)return;
  removeRncHeaderCellById(x.id);
}

function removeRncHeaderCellById(id,ev){
  if(ev){
    ev.preventDefault();
    ev.stopPropagation();
  }

  const a=rncHeaderFields();
  const idx=a.findIndex(x=>String(x.id)===String(id));
  if(idx<0)return;

  const removida=a[idx];
  const row=Number(removida.row)||1;

  a.splice(idx,1);

  // Reequilibra somente as células que sobraram na mesma linha.
  const same=a.filter(v=>(Number(v.row)||1)===row);
  if(same.length){
    const total=same.reduce((sum,v)=>sum+(Number(v.width)||20),0)||100;
    same.forEach(v=>{
      v.width=((Number(v.width)||20)/total)*100;
    });
  }

  // Grava diretamente no hidden que é a fonte real do editor.
  const hidden=document.getElementById('tplHeaderLayoutData');
  if(hidden)hidden.value=JSON.stringify(a);

  // Se a célula excluída estava selecionada, limpa a seleção.
  if(String(rncGridSelectedHeaderId||'')===String(id)){
    rncGridSelectedHeaderId='';
  }

  // Atualiza imediatamente a lista e a folha.
  const list=document.getElementById('tplHeaderLayoutList');
  if(list){
    const t=collectRncTemplateForm();
    t.headerLayout=a;
    list.innerHTML=renderRncHeaderLayoutEditor(t);
  }

  refreshRncTemplatePreview();
}

function mergeRncHeaderCell(i){const a=rncHeaderFields(),x=a[i];if(!x)return;const row=a.filter(v=>(Number(v.row)||1)===(Number(x.row)||1)),pos=row.findIndex(v=>v.id===x.id),right=row[pos+1];if(!right)return alert('Não há célula à direita para mesclar.');x.width=(Number(x.width)||20)+(Number(right.width)||20);const ri=a.findIndex(v=>v.id===right.id);if(ri>=0)a.splice(ri,1);saveRncHeaderFields(a)}
function splitRncHeaderCell(i){const a=rncHeaderFields(),x=a[i];if(!x)return;const w=Math.max(6,Number(x.width)||20);x.width=w/2;const ni=a.findIndex(v=>v.id===x.id)+1;a.splice(ni,0,{id:nextRncHeaderId(),row:Number(x.row)||1,label:'',value:'',source:'@',width:w/2,height:Number(x.height)||7,align:x.align||'left',bold:false});saveRncHeaderFields(a)}
function rncHeaderValue(t,x,preview=true,obj={}){const src=String(x.source||'');if(src==='@logo')return '__RNC_LOGO__';if(src==='title')return t.title||'';if(src==='code')return t.code||'';if(src==='revision')return t.revision||'';if(src==='@label')return '';if(src.startsWith('@')){const v=src.slice(1);if(x.id==='h-register'&&!preview)return obj.rncNumber||'—';return v}return x.value||''}
function selectRncHeaderCell(id){rncGridSelectedFieldId='';rncGridSelectedHeaderId=id||'';refreshRncTemplatePreview();const a=rncHeaderFields();const list=document.getElementById('tplHeaderLayoutList');if(list)list.innerHTML=renderRncHeaderLayoutEditor({...collectRncTemplateForm(),headerLayout:a})}
function selectedRncHeaderCell(){return rncHeaderFields().find(x=>x.id===rncGridSelectedHeaderId)||null}
function rncHeaderIndexBySelected(){return rncHeaderFields().findIndex(x=>x.id===rncGridSelectedHeaderId)}
function rncHeaderAdjustWidth(delta){const a=rncHeaderFields(),x=a.find(v=>v.id===rncGridSelectedHeaderId);if(!x)return;const row=a.filter(v=>(Number(v.row)||1)===(Number(x.row)||1)),i=row.findIndex(v=>v.id===x.id),right=row[i+1];if(right){const min=5,total=(Number(x.width)||20)+(Number(right.width)||20),nw=Math.max(min,Math.min(total-min,(Number(x.width)||20)+delta));x.width=nw;right.width=total-nw}else{x.width=Math.max(5,Math.min(100,(Number(x.width)||20)+delta))}saveRncHeaderFields(a)}
function rncHeaderAdjustHeight(delta){const a=rncHeaderFields(),x=a.find(v=>v.id===rncGridSelectedHeaderId);if(!x)return;const row=Number(x.row)||1,h=Math.max(3,Math.min(60,(Number(x.height)||7)+delta));a.filter(v=>(Number(v.row)||1)===row).forEach(v=>v.height=h);saveRncHeaderFields(a)}
function rncHeaderMergeSelected(){const i=rncHeaderIndexBySelected();if(i>=0)mergeRncHeaderCell(i)}
function rncHeaderCellBounds(a,x){const row=a.filter(v=>(Number(v.row)||1)===(Number(x.row)||1));const total=row.reduce((s,v)=>s+(Number(v.width)||20),0)||100;let cur=0;for(const v of row){const w=(Number(v.width)||20)/total*100;if(v.id===x.id)return [cur,cur+w];cur+=w}return [0,100]}
function rncHeaderMergeVertical(dir){const a=rncHeaderFields(),x=a.find(v=>v.id===rncGridSelectedHeaderId);if(!x)return;const row=Number(x.row)||1,span=Math.max(1,Number(x.rowSpan)||1),targetRow=dir<0?row-1:row+span;if(targetRow<1)return alert('Não há linha acima para mesclar.');const candidates=a.filter(v=>(Number(v.row)||1)===targetRow);if(!candidates.length){if(dir>0){x.rowSpan=span+1;saveRncHeaderFields(a);return}return alert('Não há célula acima para mesclar.')}const [l,r]=rncHeaderCellBounds(a,x);let best=null,bestOv=0;for(const v of candidates){const [vl,vr]=rncHeaderCellBounds(a,v),ov=Math.max(0,Math.min(r,vr)-Math.max(l,vl));if(ov>bestOv){bestOv=ov;best=v}}if(!best||bestOv<Math.max(2,(r-l)*.35))return alert('Não encontrei uma célula alinhada nessa direção para mesclar.');const xw=Math.max(1,Number(x.width)||20),bw=Math.max(1,Number(best.width)||20);if(!confirm(`Mesclar “${x.label||'célula'}” ${dir<0?'para cima':'para baixo'}?`))return;if(bw<=xw*1.15){const bi=a.findIndex(v=>v.id===best.id);if(bi>=0)a.splice(bi,1)}else{best.width=Math.max(5,bw-xw)}if(dir<0){x.row=targetRow;x.rowSpan=span+1}else{x.rowSpan=span+1}saveRncHeaderFields(a)}
function rncHeaderMergeUp(){rncHeaderMergeVertical(-1)}
function rncHeaderMergeDown(){rncHeaderMergeVertical(1)}
function rncHeaderSplitSelected(){const i=rncHeaderIndexBySelected();if(i>=0)splitRncHeaderCell(i)}
function rncHeaderDeleteSelected(){const x=selectedRncHeaderCell();if(!x)return;removeRncHeaderCellById(x.id);}
function rncHeaderAddCellSelected(){const x=selectedRncHeaderCell();addRncHeaderCell(x?Number(x.row)||1:undefined)}
function rncHeaderAddRowSelected(){addRncHeaderRow()}
function rncHeaderRowsHtml(t,preview=true,obj={}){const a=t.headerLayout||defaultRncHeaderLayout(),bw=Math.max(.4,Number(t.layout?.borderWidth)||.65),fs=(Number(t.layout?.fontScale)||100)/100,rows=[...new Set(a.map(x=>Number(x.row)||1))].sort((a,b)=>a-b);if(!rows.length)return'';const maxRow=Math.max(...rows,...a.map(x=>(Number(x.row)||1)+Math.max(1,Number(x.rowSpan)||1)-1));const rowHeights=Array.from({length:maxRow},(_,i)=>{const rr=i+1,c=a.filter(x=>(Number(x.row)||1)===rr);return Math.max(3,...c.map(x=>Number(x.height)||7))});const positions=new Map(),occupied={};for(let rr=1;rr<=maxRow;rr++){const blocks=(occupied[rr]||[]).sort((u,v)=>u[0]-v[0]);const cells=a.filter(x=>(Number(x.row)||1)===rr);let free=[];let cursor=0;for(const b of blocks){if(b[0]>cursor)free.push([cursor,b[0]]);cursor=Math.max(cursor,b[1])}if(cursor<100)free.push([cursor,100]);const freeTotal=free.reduce((s,z)=>s+z[1]-z[0],0)||100,total=cells.reduce((s,x)=>s+(Number(x.width)||20),0)||100;let freePos=0,seg=0,segPos=free[0]?.[0]||0;for(const x of cells){let want=(Number(x.width)||20)/total*freeTotal,left=null,right=null;while(want>.001&&seg<free.length){const [sl,sr]=free[seg];segPos=Math.max(segPos,sl);const avail=sr-segPos;if(avail<=.001){seg++;segPos=free[seg]?.[0]||100;continue}const take=Math.min(want,avail);if(left===null)left=segPos;right=segPos+take;segPos+=take;want-=take;if(segPos>=sr-.001){seg++;segPos=free[seg]?.[0]||100}}if(left===null){left=0;right=0}positions.set(x.id,[left,right]);const sp=Math.max(1,Number(x.rowSpan)||1);if(sp>1)for(let z=1;z<sp;z++){(occupied[rr+z]||(occupied[rr+z]=[])).push([left,right])}}}const rowTpl=rowHeights.map(h=>preview?`minmax(${h*4.2}px,auto)`:`minmax(${h}mm,auto)`).join(' ');return `<div data-rnc-header-grid="1" style="display:grid;grid-template-columns:repeat(1000,minmax(0,1fr));grid-template-rows:${rowTpl};border-bottom:${bw}px solid #111">${a.map(x=>{const i=a.findIndex(z=>z.id===x.id),v=rncHeaderValue(t,x,preview,obj),al=['left','center','right'].includes(x.align)?x.align:'left',[l,r]=positions.get(x.id)||[0,100],cs=Math.max(1,Math.round(l*10)+1),ce=Math.max(cs+1,Math.round(r*10)+1),rs=Number(x.row)||1,re=Math.min(maxRow+1,rs+Math.max(1,Number(x.rowSpan)||1));const label=x.label?`<b ${preview?`contenteditable="true" spellcheck="false" oninput="previewEditRncHeader(${i},'label',this.textContent)" onclick="event.stopPropagation();selectRncHeaderCell('${x.id}')"`:''} style="font-size:${6.7*fs}px;outline:none">${escapeHtml(x.label)}</b>`:'';const value=v==='__RNC_LOGO__'?rncTemplateLogoHtml(t,preview):(v?`<span ${preview&&String(x.source||'').startsWith('@')&&x.source!=='@logo'?`contenteditable="true" spellcheck="false" oninput="previewEditRncHeader(${i},'source','@'+this.textContent)" onclick="event.stopPropagation();selectRncHeaderCell('${x.id}')"`:''} style="font-size:${7.4*fs}px;${x.bold?'font-weight:800;':''};outline:none">${escapeHtml(v)}</span>`:'');const selected=preview&&x.id===rncGridSelectedHeaderId;return `<div data-rnc-header-cell="${x.id}" ${preview?`onclick="selectRncHeaderCell('${x.id}')"`:''} style="grid-column:${cs}/${ce};grid-row:${rs}/${re};position:relative;min-width:0;overflow:hidden;overflow-wrap:anywhere;word-break:break-word;white-space:normal;padding:${preview?'4px 5px':'1mm'};border-right:${bw}px solid #777;border-top:${rs>1?bw:0}px solid #777;text-align:${al};display:flex;${x.label&&v?'flex-direction:column;gap:2px;':'align-items:center;'}justify-content:${al==='center'?'center':al==='right'?'flex-end':'flex-start'};${selected?'box-shadow:inset 0 0 0 2px #2f6fed;background:#eef5ff;':''};cursor:${preview?'pointer':'default'}">${label}${value}${preview?`<span onpointerdown="startRncHeaderResize(event,'${x.id}')" style="position:absolute;right:-4px;top:0;width:8px;height:100%;cursor:col-resize;z-index:5" title="Arraste para dimensionar"></span>`:''}</div>`}).join('')}</div>`}
function previewEditRncHeader(i,k,v){const a=rncHeaderFields();if(!a[i])return;a[i][k]=String(v||'');setTplJson('tplHeaderLayoutData',a)}
function startRncHeaderResize(ev,id){ev.preventDefault();ev.stopPropagation();const a=rncHeaderFields(),x=a.find(v=>v.id===id);if(!x)return;const row=a.filter(v=>(Number(v.row)||1)===(Number(x.row)||1)),idx=row.findIndex(v=>v.id===id),right=row[idx+1];if(!right)return;const rowEl=ev.currentTarget.closest('[data-rnc-header-grid]'),startX=ev.clientX,startW=Number(x.width)||20,startR=Number(right.width)||20,total=startW+startR,w=rowEl?.getBoundingClientRect().width||600,min=5;const move=e=>{const d=((e.clientX-startX)/w)*row.reduce((s,v)=>s+(Number(v.width)||20),0),nw=Math.max(min,Math.min(total-min,startW+d));x.width=nw;right.width=total-nw;setTplJson('tplHeaderLayoutData',a);refreshRncTemplatePreview()};const up=()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);saveRncHeaderFields(a)};window.addEventListener('pointermove',move);window.addEventListener('pointerup',up)}
function defaultRncFieldLayout(){return [
{id:'responsavel',section:'identification',label:'Responsável',source:'rncReporter',width:25,row:1,display:'inline'},{id:'turno',section:'identification',label:'Turno',source:'rncShift',width:17,row:1,display:'inline'},{id:'abertura',section:'identification',label:'Data da Abertura',source:'eventDate',width:25,row:1,display:'inline'},{id:'tipo',section:'identification',label:'TIPO DE OCORRÊNCIA',source:'@RNC',width:33,row:1,display:'stack'},
{id:'supervisor',section:'identification',label:'Supervisor da área',source:'rncSupervisor',width:34,row:2,display:'inline'},{id:'gerente',section:'identification',label:'Gerente da área',source:'rncManager',width:33,row:2,display:'inline'},{id:'registro',section:'identification',label:'N° DE REGISTRO',source:'rncNumber',width:33,row:2,display:'inline'},
{id:'fornecedor',section:'blocking',label:'Fornecedor',source:'supplier',width:22,row:1,display:'inline'},{id:'nf',section:'blocking',label:'Nota Fiscal',source:'rncInvoice',width:13,row:1,display:'inline'},{id:'emissao',section:'blocking',label:'Data da emissão',source:'rncIssueDate',width:16,row:1,display:'inline'},{id:'codigo',section:'blocking',label:'Código do produto',source:'rncProductCode',width:16,row:1,display:'inline'},{id:'qtd',section:'blocking',label:'Qtd. Não Conforme',source:'rncQuantity',width:16,row:1,display:'stack'},{id:'disp',section:'blocking',label:'Disposição',source:'rncDisposition',width:17,row:1,display:'inline'},
{id:'produto',section:'blocking',label:'Produto / descrição',source:'rncProduct',width:28,row:2,display:'inline'},{id:'dim',section:'blocking',label:'Dimensões / especificação',source:'rncDimensions',width:24,row:2,display:'stack'},{id:'area',section:'blocking',label:'Área responsável pelo Bloqueio',source:'rncBlockArea',width:28,row:2,display:'stack'},{id:'ro',section:'blocking',label:'R.O. relacionada',source:'relatedRo',width:20,row:2,display:'inline'},
{id:'problem-summary',section:'problem',label:'Desvio evidenciado — Resumo',source:'rncSummary',width:100,row:1,height:10,display:'stack'},{id:'problem-detail',section:'problem',label:'Descrição detalhada da ocorrência',source:'rncDetailedDescription',width:100,row:2,height:16,display:'stack'},
{id:'effect-main',section:'effect',label:'Efeito observado / impacto do desvio',source:'rncEffect',width:100,row:1,height:12,display:'stack'},
{id:'part-name',section:'participants',label:'Nome',source:'rncReporter',width:50,row:1,display:'stack'},{id:'part-sector',section:'participants',label:'Setor',source:'sector',width:30,row:1,display:'stack'},{id:'part-shift',section:'participants',label:'Turno',source:'rncShift',width:20,row:1,display:'stack'},
{id:'imm-action',section:'immediate',label:'Ação',source:'rncImmediateActions',width:100,row:1,height:12,display:'stack'},
{id:'ishi-material',section:'ishikawa',label:'Matéria Prima',source:'@',width:33.33,row:1,height:9,display:'stack'},{id:'ishi-machine',section:'ishikawa',label:'Máquina',source:'@',width:33.33,row:1,height:9,display:'stack'},{id:'ishi-measure',section:'ishikawa',label:'Medição',source:'@',width:33.34,row:1,height:9,display:'stack'},{id:'ishi-environment',section:'ishikawa',label:'Meio ambiente',source:'@',width:33.33,row:2,height:9,display:'stack'},{id:'ishi-labor',section:'ishikawa',label:'Mão de Obra',source:'@',width:33.33,row:2,height:9,display:'stack'},{id:'ishi-method',section:'ishikawa',label:'Método',source:'@',width:33.34,row:2,height:9,display:'stack'},
{id:'why-1',section:'fivewhys',label:'PORQUÊ 1',source:'rncFiveWhys',width:18.4,row:1,height:9,display:'stack'},{id:'why-2',section:'fivewhys',label:'PORQUÊ 2',source:'@',width:18.4,row:1,height:9,display:'stack'},{id:'why-3',section:'fivewhys',label:'PORQUÊ 3',source:'@',width:18.4,row:1,height:9,display:'stack'},{id:'why-4',section:'fivewhys',label:'PORQUÊ 4',source:'@',width:18.4,row:1,height:9,display:'stack'},{id:'why-5',section:'fivewhys',label:'PORQUÊ 5',source:'@',width:18.4,row:1,height:9,display:'stack'},
{id:'cause-main',section:'cause',label:'Causa Macro / Conclusão',source:'rncSupplierConclusion',width:100,row:1,height:12,display:'stack'},
{id:'corr-action',section:'corrective',label:'Ações corretivas e preventivas',source:'rncCorrectiveActions',width:100,row:1,height:12,display:'stack'},
{id:'eff-main',section:'effectiveness',label:'Efeito do desvio / verificação de eficácia',source:'rncEffectiveness',width:100,row:1,height:12,display:'stack'},
{id:'photo-main',section:'photos',label:'Fotos da ocorrência',source:'photo:registro-fotografico',width:100,row:1,height:28,display:'stack'},
{id:'sign-elab',section:'signatures',label:'ELABORADOR',source:'@SGQ',width:33.33,row:1,height:13,display:'stack'},{id:'sign-ver',section:'signatures',label:'VERIFICADOR',source:'@',width:33.33,row:1,height:13,display:'stack'},{id:'sign-app',section:'signatures',label:'APROVADOR',source:'@',width:33.34,row:1,height:13,display:'stack'}
]}
const RNC_FIELD_SOURCES=[['rncReporter','Responsável'],['rncShift','Turno'],['eventDate','Data de abertura'],['rncIssueDate','Data de emissão'],['rncSupervisor','Supervisor'],['rncManager','Gerente'],['rncNumber','Nº RNC'],['supplier','Fornecedor'],['rncInvoice','Nota fiscal'],['rncProductCode','Código produto'],['rncProduct','Produto'],['rncDimensions','Dimensões'],['rncQuantity','Quantidade'],['rncDisposition','Disposição'],['rncBlockArea','Área bloqueio'],['rncBlockStage','Etapa da área responsável pelo bloqueio'],['relatedRo','R.O. relacionada'],['sector','Setor'],['title','Título'],['description','Descrição'],['rncSummary','Resumo do desvio'],['rncDetailedDescription','Descrição detalhada'],['rncEffect','Efeito do desvio'],['rncImmediateActions','Ações imediatas'],['rncFiveWhys','5 Porquês'],['rncSupplierConclusion','Conclusão da causa'],['rncCause','Causa'],['rncCorrectiveActions','Ações corretivas/preventivas'],['rncEffectiveness','Verificação de eficácia'],['photo:registro-fotografico','Fotos da RNC'],['@RNC','Texto fixo: RNC'],['@—','Texto fixo: —'],['@','Em branco'],['@A','Texto fixo: A'],['@SGQ','Texto fixo: SGQ']];
let rncGridSelectedFieldId='';
let rncGridSelectedHeaderId='';
function rncGridFields(){return getTplJson('tplFieldLayoutData',defaultRncFieldLayout())}
function saveRncGridFields(a,rerender=true){setTplJson('tplFieldLayoutData',a);if(rerender){const list=document.getElementById('tplFieldLayoutList');if(list)list.innerHTML=renderRncFieldLayoutEditor({...collectRncTemplateForm(),fieldLayout:a})}refreshRncTemplatePreview()}
function renderRncFieldLayoutEditor(t){const a=t.fieldLayout||defaultRncFieldLayout();return a.map((x,i)=>`<div style="border:1px solid #e3e8f1;border-radius:11px;padding:11px;${x.id===rncGridSelectedFieldId?'box-shadow:0 0 0 2px #2f6fed inset;background:#f7faff':''}"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center;margin-bottom:9px"><b style="font-size:12px">${escapeHtml(x.label||'Campo')}</b><div style="display:flex;gap:4px"><button class="btn secondary" type="button" title="Localizar na folha" onclick="selectRncGridField('${x.id}')">◎ Ver</button><button class="btn secondary" type="button" onclick="moveRncLayoutField(${i},-1)">↑</button><button class="btn secondary" type="button" onclick="moveRncLayoutField(${i},1)">↓</button><button class="btn secondary" type="button" onclick="removeRncLayoutField(${i})">×</button></div></div><div style="display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:9px"><label><span class="small">Texto exibido</span><input data-rnc-field-label="${i}" value="${escapeHtml(x.label||'Campo')}" oninput="updateRncLayoutField(${i},'label',this.value)"></label><label><span class="small">Dado de origem</span><select onchange="updateRncLayoutField(${i},'source',this.value)">${RNC_FIELD_SOURCES.map(o=>`<option value="${o[0]}" ${x.source===o[0]?'selected':''}>${o[1]}</option>`).join('')}</select></label>${String(x.source||'').startsWith('@')?`<label style="grid-column:1/-1"><span class="small">Texto / resposta fixa</span><input value="${escapeHtml(String(x.source||'').slice(1))}" placeholder="Digite o texto que deve aparecer no documento" oninput="updateRncFixedText(${i},this.value)"></label>`:''}<label><span class="small">Seção</span><select onchange="updateRncLayoutField(${i},'section',this.value)">${(t.sections||[]).map(s=>`<option value="${s.id}" ${x.section===s.id?'selected':''}>${escapeHtml(s.label)}</option>`).join('')}</select></label><label><span class="small">Título e valor</span><select onchange="updateRncLayoutField(${i},'display',this.value)"><option value="inline" ${(x.display||'stack')==='inline'?'selected':''}>Na mesma linha</option><option value="stack" ${(x.display||'stack')==='stack'?'selected':''}>Um abaixo do outro</option></select></label><label><span class="small">Alinhamento</span><select onchange="updateRncLayoutField(${i},'align',this.value)"><option value="left" ${(x.align||'left')==='left'?'selected':''}>Esquerda</option><option value="center" ${x.align==='center'?'selected':''}>Centralizado</option><option value="right" ${x.align==='right'?'selected':''}>Direita</option></select></label><label><span class="small">Preenchido por</span><select onchange="updateRncLayoutField(${i},'owner',this.value)"><option value="inherit" ${!x.owner||x.owner==='inherit'?'selected':''}>Herdar da seção</option><option value="sgq" ${x.owner==='sgq'?'selected':''}>Interno / SETA</option><option value="supplier" ${x.owner==='supplier'?'selected':''}>Fornecedor</option><option value="footer" ${x.owner==='footer'?'selected':''}>Rodapé</option></select></label><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;grid-column:1/-1"><label><span class="small">Largura (%)</span><input type="number" min="5" max="100" value="${Number(x.width)||25}" onchange="updateRncLayoutField(${i},'width',this.value)"></label><label><span class="small">Linha</span><input type="number" min="1" max="30" value="${Number(x.row)||1}" onchange="updateRncLayoutField(${i},'row',this.value)"></label><label><span class="small">Altura da linha (mm)</span><input type="number" min="3" max="60" step="0.5" value="${Number(x.height)||Number(t.layout?.rowHeight)||7}" onchange="updateRncLayoutRowHeight(${i},this.value)"></label></div></div></div>`).join('')}
function updateRncLayoutField(i,k,v){const a=rncGridFields();if(!a[i])return;a[i][k]=(k==='width'||k==='row'||k==='height')?Number(v)||1:v;saveRncGridFields(a,false)}
function updateRncFixedText(i,v){const a=rncGridFields();if(!a[i])return;a[i].source='@'+String(v??'');saveRncGridFields(a,false)}
function updateRncLayoutRowHeight(i,v){const a=rncGridFields();if(!a[i])return;const x=a[i],h=Math.max(3,Math.min(60,Number(v)||7));a.filter(z=>z.section===x.section&&(Number(z.row)||1)===(Number(x.row)||1)).forEach(z=>z.height=h);saveRncGridFields(a)}
function moveRncLayoutField(i,d){const a=rncGridFields(),j=i+d;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];saveRncGridFields(a)}
function removeRncLayoutField(i){const a=rncGridFields();if(!a[i])return;if(rncGridSelectedFieldId===a[i].id)rncGridSelectedFieldId='';a.splice(i,1);saveRncGridFields(a)}
function addRncLayoutField(){const a=rncGridFields();const sec=selectedRncGridField()?.section||document.getElementById('tplNewFieldSection')?.value||'identification',rows=a.filter(x=>x.section===sec).map(x=>Number(x.row)||1);a.push({id:'campo-'+Date.now(),section:sec,label:'Novo campo',source:'@—',width:25,row:Math.max(1,...rows),display:'inline'});saveRncGridFields(a)}
function selectRncGridField(id){rncGridSelectedHeaderId='';rncGridSelectedFieldId=id||'';refreshRncTemplatePreview();const a=rncGridFields();const list=document.getElementById('tplFieldLayoutList');if(list)list.innerHTML=renderRncFieldLayoutEditor({...collectRncTemplateForm(),fieldLayout:a})}
function selectedRncGridField(){return rncGridFields().find(x=>x.id===rncGridSelectedFieldId)||null}
function rncGridRowCells(a,x){return a.filter(v=>v.section===x.section&&(Number(v.row)||1)===(Number(x.row)||1))}
function rncGridAdjustWidth(delta){const a=rncGridFields(),x=a.find(v=>v.id===rncGridSelectedFieldId);if(!x)return;const row=rncGridRowCells(a,x),i=row.findIndex(v=>v.id===x.id),right=row[i+1];if(right){const min=5,total=(Number(x.width)||25)+(Number(right.width)||25),nw=Math.max(min,Math.min(total-min,(Number(x.width)||25)+delta));right.width=total-nw;x.width=nw}else{x.width=Math.max(5,Math.min(100,(Number(x.width)||25)+delta));saveRncGridFields(a);return}saveRncGridFields(a)}
function rncGridAdjustHeight(delta){const a=rncGridFields(),x=a.find(v=>v.id===rncGridSelectedFieldId);if(!x)return;const old=Number(x.height)||Number(document.getElementById('tplRowHeight')?.value)||7,h=Math.max(3,Math.min(60,old+delta));a.filter(v=>v.section===x.section&&(Number(v.row)||1)===(Number(x.row)||1)).forEach(v=>v.height=h);saveRncGridFields(a)}
function rncGridToggleDisplay(){const a=rncGridFields(),x=a.find(v=>v.id===rncGridSelectedFieldId);if(!x)return;x.display=(x.display||'stack')==='inline'?'stack':'inline';saveRncGridFields(a)}
function rncGridAddCell(){const a=rncGridFields(),x=a.find(v=>v.id===rncGridSelectedFieldId);if(!x)return;a.splice(a.indexOf(x)+1,0,{id:'campo-'+Date.now(),section:x.section,label:'Novo campo',source:'@—',width:Math.max(10,Math.round((Number(x.width)||25)/2)),row:Number(x.row)||1,display:'inline'});saveRncGridFields(a)}
function rncGridAddRow(){const a=rncGridFields(),x=a.find(v=>v.id===rncGridSelectedFieldId);const sec=x?.section||'identification';const max=Math.max(0,...a.filter(v=>v.section===sec).map(v=>Number(v.row)||1));const n={id:'campo-'+Date.now(),section:sec,label:'Novo campo',source:'@—',width:100,row:max+1,display:'inline'};a.push(n);rncGridSelectedFieldId=n.id;saveRncGridFields(a)}
function rncGridDeleteSelected(){const a=rncGridFields(),i=a.findIndex(v=>v.id===rncGridSelectedFieldId);if(i<0)return;a.splice(i,1);rncGridSelectedFieldId='';saveRncGridFields(a)}
function rncGridMergeNext(){const a=rncGridFields(),i=a.findIndex(v=>v.id===rncGridSelectedFieldId);if(i<0)return;const x=a[i];const candidates=a.map((v,j)=>({v,j})).filter(o=>o.j>i&&o.v.section===x.section&&(Number(o.v.row)||1)===(Number(x.row)||1));if(!candidates.length){alert('Não há outra célula à direita nesta linha.');return}const n=candidates[0];if(!confirm(`Mesclar “${x.label||'célula'}” com “${n.v.label||'célula'}”? O conteúdo da segunda célula será removido.`))return;x.width=Math.min(100,(Number(x.width)||25)+(Number(n.v.width)||25));a.splice(n.j,1);saveRncGridFields(a)}
function rncGridCellBounds(a,x){const row=a.filter(v=>v.section===x.section&&(Number(v.row)||1)===(Number(x.row)||1));const total=row.reduce((s,v)=>s+(Number(v.width)||25),0)||100;let cur=0;for(const v of row){const w=(Number(v.width)||25)/total*100;if(v.id===x.id)return [cur,cur+w];cur+=w}return [0,100]}
function rncGridMergeVertical(dir){const a=rncGridFields(),x=a.find(v=>v.id===rncGridSelectedFieldId);if(!x)return;const row=Number(x.row)||1,span=Math.max(1,Number(x.rowSpan)||1),targetRow=dir<0?row-1:row+span;if(targetRow<1)return alert('Não há linha acima para mesclar.');const candidates=a.filter(v=>v.section===x.section&&(Number(v.row)||1)===targetRow);if(!candidates.length)return alert(dir<0?'Não há célula acima para mesclar.':'Não há célula abaixo para mesclar.');const [l,r]=rncGridCellBounds(a,x);let best=null,bestOv=0;for(const v of candidates){const [vl,vr]=rncGridCellBounds(a,v),ov=Math.max(0,Math.min(r,vr)-Math.max(l,vl));if(ov>bestOv){bestOv=ov;best=v}}if(!best||bestOv<Math.max(2,(r-l)*.35))return alert('Não encontrei uma célula alinhada nessa direção para mesclar.');if(!confirm(`Mesclar “${x.label||'célula'}” ${dir<0?'para cima':'para baixo'}? O conteúdo da outra célula será removido.`))return;const bi=a.findIndex(v=>v.id===best.id);if(bi>=0)a.splice(bi,1);if(dir<0){x.row=targetRow;x.rowSpan=span+Math.max(1,Number(best.rowSpan)||1)}else{x.rowSpan=span+Math.max(1,Number(best.rowSpan)||1)}saveRncGridFields(a)}
function rncGridMergeUp(){rncGridMergeVertical(-1)}
function rncGridMergeDown(){rncGridMergeVertical(1)}
function rncGridSplit(){const a=rncGridFields(),i=a.findIndex(v=>v.id===rncGridSelectedFieldId);if(i<0)return;const x=a[i],half=Math.max(5,(Number(x.width)||25)/2);x.width=half;a.splice(i+1,0,{id:'campo-'+Date.now(),section:x.section,label:'Nova célula',source:'@—',width:half,row:Number(x.row)||1,display:'inline'});saveRncGridFields(a)}
function rncGridMoveRow(delta){const a=rncGridFields(),x=a.find(v=>v.id===rncGridSelectedFieldId);if(!x)return;const old=Number(x.row)||1,n=Math.max(1,old+delta);a.filter(v=>v.section===x.section&&(Number(v.row)||1)===old).forEach(v=>v.row=n);saveRncGridFields(a)}
function rncSwapCellSlots(a,x,other,swapOrder=true){
  if(!x||!other)return;
  const sx={row:Number(x.row)||1,width:Number(x.width)||25,height:Number(x.height)||7,rowSpan:Math.max(1,Number(x.rowSpan)||1)};
  const so={row:Number(other.row)||1,width:Number(other.width)||25,height:Number(other.height)||7,rowSpan:Math.max(1,Number(other.rowSpan)||1)};
  x.row=so.row;x.width=so.width;x.height=so.height;x.rowSpan=so.rowSpan;
  other.row=sx.row;other.width=sx.width;other.height=sx.height;other.rowSpan=sx.rowSpan;
  if(swapOrder){const ix=a.indexOf(x),io=a.indexOf(other);if(ix>=0&&io>=0)[a[ix],a[io]]=[a[io],a[ix]]}
}
function rncGridMoveSelectedHorizontal(dir){const a=rncGridFields(),x=a.find(v=>v.id===rncGridSelectedFieldId);if(!x)return;const row=rncGridRowCells(a,x);const pos=row.findIndex(v=>v.id===x.id),other=row[pos+(dir<0?-1:1)];if(!other)return;rncSwapCellSlots(a,x,other,true);saveRncGridFields(a)}
function rncGridMoveSelectedVertical(dir){const a=rncGridFields(),x=a.find(v=>v.id===rncGridSelectedFieldId);if(!x)return;const targetRow=(Number(x.row)||1)+(dir<0?-1:1);if(targetRow<1)return;const candidates=a.filter(v=>v.section===x.section&&(Number(v.row)||1)===targetRow);if(!candidates.length){x.row=targetRow;saveRncGridFields(a);return}const [l,r]=rncGridCellBounds(a,x);let best=candidates[0],bestOv=-1;for(const v of candidates){const [vl,vr]=rncGridCellBounds(a,v),ov=Math.max(0,Math.min(r,vr)-Math.max(l,vl));if(ov>bestOv){bestOv=ov;best=v}}rncSwapCellSlots(a,x,best,false);saveRncGridFields(a)}
function rncHeaderMoveSelectedHorizontal(dir){const a=rncHeaderFields(),x=a.find(v=>v.id===rncGridSelectedHeaderId);if(!x)return;const row=a.filter(v=>(Number(v.row)||1)===(Number(x.row)||1)),pos=row.findIndex(v=>v.id===x.id),other=row[pos+(dir<0?-1:1)];if(!other)return;rncSwapCellSlots(a,x,other,true);saveRncHeaderFields(a)}
function rncHeaderMoveSelectedVertical(dir){const a=rncHeaderFields(),x=a.find(v=>v.id===rncGridSelectedHeaderId);if(!x)return;const targetRow=(Number(x.row)||1)+(dir<0?-1:1);if(targetRow<1)return;const candidates=a.filter(v=>(Number(v.row)||1)===targetRow);if(!candidates.length){x.row=targetRow;saveRncHeaderFields(a);return}const [l,r]=rncHeaderCellBounds(a,x);let best=candidates[0],bestOv=-1;for(const v of candidates){const [vl,vr]=rncHeaderCellBounds(a,v),ov=Math.max(0,Math.min(r,vr)-Math.max(l,vl));if(ov>bestOv){bestOv=ov;best=v}}rncSwapCellSlots(a,x,best,false);saveRncHeaderFields(a)}
function startRncCellResize(ev,id){ev.preventDefault();ev.stopPropagation();selectRncGridField(id);const a=rncGridFields(),x=a.find(v=>v.id===id);if(!x)return;const rowEl=ev.currentTarget.closest('[data-rnc-grid-row]'),rowCells=rncGridRowCells(a,x),idx=rowCells.findIndex(v=>v.id===id),right=rowCells[idx+1],startX=ev.clientX,startW=Number(x.width)||25,startRight=right?(Number(right.width)||25):0,total=startW+startRight,rowW=rowEl?.getBoundingClientRect().width||500,min=5;const move=e=>{const delta=((e.clientX-startX)/rowW)*rowCells.reduce((sum,v)=>sum+(Number(v.width)||25),0);if(right){const nw=Math.max(min,Math.min(total-min,startW+delta));x.width=nw;right.width=total-nw}else{x.width=Math.max(min,Math.min(100,startW+delta))}setTplJson('tplFieldLayoutData',a);refreshRncTemplatePreview()};const up=()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);saveRncGridFields(a)};window.addEventListener('pointermove',move);window.addEventListener('pointerup',up)}
function startRncRowResize(ev,id){ev.preventDefault();ev.stopPropagation();selectRncGridField(id);const a=rncGridFields(),x=a.find(v=>v.id===id);if(!x)return;const startY=ev.clientY,startH=Number(x.height)||Number(document.getElementById('tplRowHeight')?.value)||7;const move=e=>{const h=Math.max(3,Math.min(60,startH+(e.clientY-startY)/4.2));a.filter(v=>v.section===x.section&&(Number(v.row)||1)===(Number(x.row)||1)).forEach(v=>v.height=h);setTplJson('tplFieldLayoutData',a);refreshRncTemplatePreview()};const up=()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);saveRncGridFields(a)};window.addEventListener('pointermove',move);window.addEventListener('pointerup',up)}
function rncGridToolbarHtml(){const h=selectedRncHeaderCell();if(h)return `<div style="display:flex;gap:5px;align-items:center;flex-wrap:wrap;padding:7px 8px;margin-bottom:8px;border:1px solid #9db8e8;border-radius:10px;background:#eef5ff;position:sticky;top:72px;z-index:4"><b style="font-size:12px">Cabeçalho:</b><span class="small">${escapeHtml(h.label||rncHeaderValue(collectRncTemplateForm(),h,true,{})||'Célula')}</span><button class="btn secondary" type="button" title="Trocar com a célula da esquerda" onclick="rncHeaderMoveSelectedHorizontal(-1)">← mover</button><button class="btn secondary" type="button" title="Trocar com a célula da direita" onclick="rncHeaderMoveSelectedHorizontal(1)">mover →</button><button class="btn secondary" type="button" title="Trocar com a célula acima" onclick="rncHeaderMoveSelectedVertical(-1)">↑ mover</button><button class="btn secondary" type="button" title="Trocar com a célula abaixo" onclick="rncHeaderMoveSelectedVertical(1)">↓ mover</button><button class="btn secondary" type="button" onclick="rncHeaderAdjustWidth(-5)">− largura</button><button class="btn secondary" type="button" onclick="rncHeaderAdjustWidth(5)">+ largura</button><button class="btn secondary" type="button" onclick="rncHeaderAdjustHeight(-1)">− altura</button><button class="btn secondary" type="button" onclick="rncHeaderAdjustHeight(1)">+ altura</button><button class="btn secondary" type="button" onclick="rncHeaderMergeSelected()">Mesclar →</button><button class="btn secondary" type="button" onclick="rncHeaderMergeUp()">Mesclar ↑</button><button class="btn secondary" type="button" onclick="rncHeaderMergeDown()">Mesclar ↓</button><button class="btn secondary" type="button" onclick="rncHeaderSplitSelected()">Dividir</button><button class="btn secondary" type="button" onclick="rncHeaderAddCellSelected()">+ Célula</button><button class="btn secondary" type="button" onclick="rncHeaderAddRowSelected()">+ Linha</button><button class="btn danger" type="button" onclick="rncHeaderDeleteSelected()">Excluir</button></div>`;const x=selectedRncGridField();return `<div style="display:flex;gap:5px;align-items:center;flex-wrap:wrap;padding:7px 8px;margin-bottom:8px;border:1px solid #d8e0ec;border-radius:10px;background:#fff;position:sticky;top:72px;z-index:4"><b style="font-size:12px">Grade:</b>${x?`<span class="small">${escapeHtml(x.label||'Célula')}</span><button class="btn secondary" type="button" title="Trocar com a célula da esquerda" onclick="rncGridMoveSelectedHorizontal(-1)">← mover</button><button class="btn secondary" type="button" title="Trocar com a célula da direita" onclick="rncGridMoveSelectedHorizontal(1)">mover →</button><button class="btn secondary" type="button" title="Trocar com a célula acima" onclick="rncGridMoveSelectedVertical(-1)">↑ mover</button><button class="btn secondary" type="button" title="Trocar com a célula abaixo" onclick="rncGridMoveSelectedVertical(1)">↓ mover</button><button class="btn secondary" type="button" onclick="rncGridAdjustWidth(-5)">− largura</button><button class="btn secondary" type="button" onclick="rncGridAdjustWidth(5)">+ largura</button><button class="btn secondary" type="button" onclick="rncGridAdjustHeight(-1)">− altura</button><button class="btn secondary" type="button" onclick="rncGridAdjustHeight(1)">+ altura</button><button class="btn secondary" type="button" onclick="rncGridToggleDisplay()">Título/valor</button><button class="btn secondary" type="button" onclick="rncGridMergeNext()">Mesclar →</button><button class="btn secondary" type="button" onclick="rncGridMergeUp()">Mesclar ↑</button><button class="btn secondary" type="button" onclick="rncGridMergeDown()">Mesclar ↓</button><button class="btn secondary" type="button" onclick="rncGridSplit()">Dividir</button><button class="btn secondary" type="button" onclick="rncGridAddCell()">+ Célula</button><button class="btn secondary" type="button" onclick="rncGridAddRow()">+ Linha</button><button class="btn secondary" type="button" onclick="rncGridDeleteSelected()">Excluir</button>`:'<span class="small">Clique em qualquer célula da folha, inclusive no cabeçalho, para editar a grade.</span>'}</div>`}
function rncPhotoSrc(photo){
  if(!photo)return '';
  if(typeof photo==='string')return photo;
  if(photo.previewDataUrl)return String(photo.previewDataUrl);
  if(photo.dataUrl)return String(photo.dataUrl);
  if(photo.url)return String(photo.url);
  if(photo.fileId)return 'https://drive.google.com/thumbnail?id='+encodeURIComponent(photo.fileId)+'&sz=w1600';
  return String(photo.src||'');
}
function rncFieldValue(obj,source,preview=false){if(String(source||'').startsWith('@'))return String(source).slice(1);if(!preview&&source==='eventDate'&&!String(obj?.eventDate||'').trim()){const d=String(obj?.createdAt||'').slice(0,10);if(d)return d;}if(!preview&&source==='rncIssueDate'){const v=obj?.rncIssueDate||obj?.issueDate||obj?.dataEmissao||obj?.emissionDate||'';if(String(v).trim())return v;}if(!preview&&source==='rncDisposition'){const v=obj?.rncDisposition||obj?.disposition||obj?.disposicao||'';if(String(v).trim())return v;}if(preview){const ex={rncReporter:'Maria',rncShift:'1º turno',eventDate:'17/09/2026',rncIssueDate:'17/09/2026',rncSupervisor:'Supervisor',rncManager:'Gerente',rncNumber:'RNC-2026-0001',supplier:'Fornecedor ABC',rncInvoice:'3215',rncProductCode:'000123',rncProduct:'Produto exemplo',rncDimensions:'Especificação',rncQuantity:'250 un.',rncDisposition:'Segregação / devolução',rncBlockArea:'Qualidade',rncBlockStage:'Recebimento',relatedRo:'Não vinculada',sector:'Qualidade',title:'RNC',description:'Descrição'};return ex[source]||'—'}return obj?.[source]??'—'}
function rncLayoutRowsHtml(t,section,obj={},preview=false,cellClass='',ownerFilter=''){
  const all=t.fieldLayout||defaultRncFieldLayout(),secOwner=(t.sections||[]).find(z=>z.id===section)?.owner||'sgq',fields=all.filter(x=>x.section===section&&(!ownerFilter||((x.owner&&x.owner!=='inherit')?x.owner:secOwner)===ownerFilter));if(!fields.length)return'';
  const rows=[...new Set(fields.map(x=>Number(x.row)||1))].sort((a,b)=>a-b),maxRow=Math.max(...rows,...fields.map(x=>(Number(x.row)||1)+Math.max(1,Number(x.rowSpan)||1)-1)),baseH=Number(t.layout?.rowHeight)||7,rbw=Math.max(.4,Number(t.layout?.borderWidth)||.65);
  const rowHeights=Array.from({length:maxRow},(_,i)=>{const rr=i+1,c=fields.filter(x=>(Number(x.row)||1)===rr);return Math.max(3,...c.map(x=>Number(x.height)||baseH))});
  const positions=new Map();for(const rr of rows){const cells=fields.filter(x=>(Number(x.row)||1)===rr),total=cells.reduce((s,x)=>s+(Number(x.width)||25),0)||100;let cur=0;for(const x of cells){const w=(Number(x.width)||25)/total*100;positions.set(x.id,[cur,cur+w]);cur+=w}}
  const rowTpl=rowHeights.map(h=>preview?`minmax(${Math.max(18,h*4.2)}px,auto)`:`minmax(${h}mm,auto)`).join(' ');
  return `<div data-rnc-grid-section="${section}" style="display:grid;grid-template-columns:repeat(1000,minmax(0,1fr));grid-template-rows:${rowTpl};border-bottom:${rbw}px solid #777">${fields.map(x=>{
      const idx=all.findIndex(z=>z.id===x.id),selected=preview&&x.id===rncGridSelectedFieldId,[l,r]=positions.get(x.id)||[0,100],cs=Math.max(1,Math.round(l*10)+1),ce=Math.max(cs+1,Math.round(r*10)+1),rs=Number(x.row)||1,re=Math.min(maxRow+1,rs+Math.max(1,Number(x.rowSpan)||1));
      const label=preview?`<span contenteditable="true" spellcheck="false" title="Clique para editar o texto" oninput="previewEditRncFieldLabel(${idx},this.textContent)" onclick="event.stopPropagation()" style="font-size:7px;font-weight:700;outline:none;cursor:text;border-radius:3px">${escapeHtml(x.label||'')}</span>`:`<span style="font-size:6.5px;font-weight:700">${escapeHtml(x.label||'')}</span>`;
      const isPhoto=String(x.source||'').startsWith('photo:'),photoId=isPhoto?String(x.source).slice(6):'',pf=(t.photoFields||[]).find(f=>f.id===photoId),imgs=!preview&&isPhoto?((obj?.rncPhotos||{})[photoId]||Object.values(obj?.rncPhotos||{}).find(v=>Array.isArray(v)&&v.length)||[]):[],photoVal=isPhoto?(preview?`<div style="display:grid;grid-template-columns:repeat(${Math.min(4,Number(pf?.maxPhotos)||4)},1fr);gap:4px;width:100%;margin-top:4px">${Array.from({length:Math.min(4,Number(pf?.maxPhotos)||4)},()=>'<div style="min-height:38px;border:1px dashed #9aa4b2;background:#fafafa"></div>').join('')}</div>`:(imgs.length?`<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:2mm;width:100%">${imgs.map(photo=>{const src=rncPhotoSrc(photo);return src?`<img src="${escapeHtml(src)}" style="width:100%;max-height:60mm;object-fit:contain;border:1px solid #ddd">`:''}).join('')}</div>`:'—')):'',val=isPhoto?photoVal:`<span class="rncAnswer" style="font-size:8px;font-weight:400;min-width:0;max-width:100%;white-space:normal;overflow-wrap:anywhere;word-break:break-word">${escapeHtml(String(rncFieldValue(obj,x.source,preview)||'—'))}</span>`,inline=(x.display||'stack')==='inline';
      return `<div class="${cellClass}" data-rnc-grid-cell="${x.id}" ${preview?`onclick="selectRncGridField('${x.id}')"`:''} style="grid-column:${cs}/${ce};grid-row:${rs}/${re};position:relative;min-width:0;overflow:hidden;overflow-wrap:anywhere;word-break:break-word;white-space:normal;text-align:${['left','center','right'].includes(x.align)?x.align:'left'};padding:${preview?'4px 5px':'1mm'};border-right:${rbw}px solid #777;border-top:${rs>1?rbw:0}px solid #777;${selected?'box-shadow:inset 0 0 0 2px #2f6fed;background:#eef5ff;':''};cursor:${preview?'pointer':'default'}"><div style="display:${inline?'flex':'block'};align-items:${inline?'flex-start':'stretch'};justify-content:${inline?(x.align==='center'?'center':x.align==='right'?'flex-end':'flex-start'):'initial'};gap:${inline?'5px':'0'};height:100%;min-width:0;max-width:100%;overflow:hidden;overflow-wrap:anywhere;word-break:break-word;white-space:normal">${label}${inline?'<span style="font-weight:700">:</span>':''}${inline?val:`<div style="margin-top:${preview?'4px':'1.2mm'}">${val}</div>`}</div>${preview?`<span title="Arraste para mudar a largura" onpointerdown="startRncCellResize(event,'${x.id}')" style="position:absolute;right:-3px;top:0;width:7px;height:100%;cursor:col-resize;z-index:3"></span><span title="Arraste para mudar a altura da linha" onpointerdown="startRncRowResize(event,'${x.id}')" style="position:absolute;left:0;bottom:-4px;width:100%;height:8px;cursor:row-resize;z-index:4"></span>`:''}</div>`;
    }).join('')}</div>`
}
function previewEditRncFieldLabel(i,v){
  const a=getTplJson('tplFieldLayoutData',defaultRncFieldLayout());if(!a[i])return;
  a[i].label=String(v||'').trim();setTplJson('tplFieldLayoutData',a);
  const list=document.getElementById('tplFieldLayoutList');
  const input=list?.querySelector(`[data-rnc-field-label="${i}"]`);if(input&&input.value!==a[i].label)input.value=a[i].label;
}
function previewEditRncSectionLabel(id,v){
  const base=getRncProcessTemplate();const i=base.sections.findIndex(x=>x.id===id);if(i<0)return;
  const el=document.getElementById('tplSecLabel'+i);if(el)el.value=String(v||'').trim();
}
function previewEditRncSimple(id,v){const el=document.getElementById(id);if(el)el.value=String(v||'').trim()}

function renderProcessTemplatesWorkspace(...args){return nucleoOpenLazyAdmin('renderProcessTemplatesWorkspace',args);}

function handleRncTemplateLogoUpload(input){
  const f=input?.files?.[0];if(!f)return;
  if(f.size>1500000){alert('A logo precisa ter até 1,5 MB.');input.value='';return;}
  const reader=new FileReader();reader.onload=()=>{const data=String(reader.result||'');const hidden=document.getElementById('tplLogoData');if(hidden)hidden.value=data;const host=document.getElementById('tplLogoCurrent');if(host)host.innerHTML=`<img src="${data}" alt="Logo" style="max-width:150px;max-height:54px;object-fit:contain">`;refreshRncTemplatePreview();};reader.readAsDataURL(f);
}
function removeRncTemplateLogo(){const h=document.getElementById('tplLogoData');if(h)h.value='';const c=document.getElementById('tplLogoCurrent');if(c)c.innerHTML='<b>SETA</b>';const f=document.getElementById('tplLogoFile');if(f)f.value='';refreshRncTemplatePreview();}
function collectRncTemplateForm(){
  const base=getRncProcessTemplate(),val=id=>document.getElementById(id)?.value||'';
  let fixedImages=base.fixedImages||[],photoFields=base.photoFields||[],fieldLayout=base.fieldLayout||defaultRncFieldLayout(),headerLayout=base.headerLayout||defaultRncHeaderLayout();try{fixedImages=JSON.parse(val('tplFixedImagesData')||'[]')}catch(e){}try{photoFields=JSON.parse(val('tplPhotoFieldsData')||'[]')}catch(e){}try{fieldLayout=JSON.parse(val('tplFieldLayoutData')||'[]')}catch(e){}try{headerLayout=JSON.parse(val('tplHeaderLayoutData')||'[]')}catch(e){}return {...base,fieldLayout,headerLayout,layoutId:val('tplLayoutBase')||'',code:val('tplCode').trim()||base.code,name:val('tplName').trim()||base.name,revision:val('tplRevision').trim()||base.revision,title:val('tplTitle').trim()||base.title,supplierResponseTitle:val('tplSupplierResponseTitle').trim()||base.supplierResponseTitle||'RESPOSTA DO FORNECEDOR',supplierResponseNote:val('tplSupplierResponseNote'),footerText:val('tplFooterText'),pageBreakBeforeSupplier:!!document.getElementById('tplPageBreakSupplier')?.checked,repeatHeaderOnPages:!!document.getElementById('tplRepeatHeader')?.checked,repeatFooterOnPages:!!document.getElementById('tplRepeatFooter')?.checked,sendFormat:val('tplSendFormat')||base.sendFormat||'pdf',logoText:val('tplLogoText').trim()||'SETA',logoDataUrl:val('tplLogoData'),layout:{logoWidth:Number(val('tplLogoWidth'))||19,metaWidth:Number(val('tplMetaWidth'))||25,headerHeight:Number(val('tplHeaderHeight'))||13,rowHeight:Number(val('tplRowHeight'))||7,borderWidth:Number(val('tplBorderWidth'))||0.65,fontScale:Number(val('tplFontScale'))||100,sectionHeight:Number(val('tplSectionHeight'))||5},fixedImages,photoFields,accent:val('tplAccent')||'#1f4e78',updatedAt:new Date().toISOString(),sections:base.sections.map((x,i)=>({...x,enabled:!!document.getElementById('tplSec'+i)?.checked,label:val('tplSecLabel'+i).trim()||x.label,align:val('tplSecAlign'+i)||x.align||'left',owner:val('tplSecOwner'+i)||x.owner||'sgq'}))};
}
const RNC_HEADER_STANDARD_KEY='nucleo_rnc_header_standard_v1',RNC_FOOTER_STANDARD_KEY='nucleo_rnc_footer_standard_v1';
function saveRncHeaderAsStandard(){const t=collectRncTemplateForm();safeStorageSet(RNC_HEADER_STANDARD_KEY,JSON.stringify({headerLayout:t.headerLayout,logoDataUrl:t.logoDataUrl,logoText:t.logoText,layout:{logoWidth:t.layout.logoWidth,metaWidth:t.layout.metaWidth,headerHeight:t.layout.headerHeight},savedAt:new Date().toISOString()}));alert('Cabeçalho fixado como padrão.');}
function saveRncFooterAsStandard(){const t=collectRncTemplateForm(),footerIds=(t.sections||[]).filter(x=>x.owner==='footer').map(x=>x.id);safeStorageSet(RNC_FOOTER_STANDARD_KEY,JSON.stringify({footerText:t.footerText,footerIds,footerSections:(t.sections||[]).filter(x=>footerIds.includes(x.id)),footerFields:(t.fieldLayout||[]).filter(x=>footerIds.includes(x.section)||x.owner==='footer'),savedAt:new Date().toISOString()}));alert('Rodapé fixado como padrão.');}
function applyRncHeaderStandard(){try{const x=JSON.parse(localStorage.getItem(RNC_HEADER_STANDARD_KEY)||'null');if(!x)return alert('Ainda não existe cabeçalho padrão salvo.');const h=document.getElementById('tplHeaderLayoutData');if(h)h.value=JSON.stringify(x.headerLayout||defaultRncHeaderLayout());const l=document.getElementById('tplLogoData');if(l)l.value=x.logoDataUrl||'';const lt=document.getElementById('tplLogoText');if(lt)lt.value=x.logoText||'SETA';if(x.layout){['LogoWidth','MetaWidth','HeaderHeight'].forEach(k=>{const el=document.getElementById('tpl'+k);if(el&&x.layout[k.charAt(0).toLowerCase()+k.slice(1)]!=null)el.value=x.layout[k.charAt(0).toLowerCase()+k.slice(1)]});}refreshRncTemplatePreview();}catch(e){alert('Não foi possível aplicar o cabeçalho padrão.')}}
function applyRncFooterStandard(){try{const x=JSON.parse(localStorage.getItem(RNC_FOOTER_STANDARD_KEY)||'null');if(!x)return alert('Ainda não existe rodapé padrão salvo.');const f=document.getElementById('tplFooterText');if(f)f.value=x.footerText||'';const base=collectRncTemplateForm(),ids=new Set(x.footerIds||[]);(base.sections||[]).forEach((s,i)=>{const el=document.getElementById('tplSecOwner'+i);if(el&&ids.has(s.id))el.value='footer'});if(Array.isArray(x.footerFields)&&x.footerFields.length){const a=getTplJson('tplFieldLayoutData',defaultRncFieldLayout());x.footerFields.forEach(ff=>{const i=a.findIndex(z=>z.id===ff.id);if(i>=0)a[i]={...a[i],...ff};else a.push({...ff})});setTplJson('tplFieldLayoutData',a);const list=document.getElementById('tplFieldLayoutList');if(list)list.innerHTML=renderRncFieldLayoutEditor(collectRncTemplateForm())}refreshRncTemplatePreview();}catch(e){alert('Não foi possível aplicar o rodapé padrão.')}}
function saveRncProcessTemplateFromForm(){
  if(!nucleoFeatureRequire('processes','templates'))return;
  const t=collectRncTemplateForm(),all=getProcessTemplates(),ix=all.findIndex(x=>x.id===t.id);if(ix>=0)all[ix]=t;else all.unshift(t);saveProcessTemplates(all);alert('Modelo salvo. A logo e o padrão serão usados nas novas gerações de RNC.');renderProcessTemplatesWorkspace();
}
function resetRncProcessTemplate(){
 if(!nucleoFeatureRequire('processes','templates'))return;if(!confirm('Restaurar a estrutura padrão da RNC? A logo personalizada também será removida.'))return;const all=getProcessTemplates().filter(x=>x.kind!=='RNC');all.unshift(defaultRncProcessTemplate());saveProcessTemplates(all);renderProcessTemplatesWorkspace();}
function compactRncTemplateLayout(){const v={tplLogoWidth:18,tplMetaWidth:24,tplHeaderHeight:12,tplRowHeight:6,tplBorderWidth:.6,tplFontScale:95,tplSectionHeight:4};Object.entries(v).forEach(([id,x])=>{const el=document.getElementById(id);if(el)el.value=x});refreshRncTemplatePreview();}
let rncTemplatePreviewTimer=0;
let rncPreviewZoom='fit';
function setRncPreviewZoom(value){
  if(value==='fit') rncPreviewZoom='fit';
  else rncPreviewZoom=Math.max(50,Math.min(250,Number(value)||100));
  refreshRncTemplatePreview();
}
function changeRncPreviewZoom(delta){
  const current=rncPreviewZoom==='fit'?100:Number(rncPreviewZoom)||100;
  setRncPreviewZoom(current+Number(delta||0));
}
function scheduleRncTemplatePreview(){clearTimeout(rncTemplatePreviewTimer);rncTemplatePreviewTimer=setTimeout(refreshRncTemplatePreview,90)}
function refreshRncTemplatePreview(){
  const host=document.getElementById('rncTemplatePreview');if(!host)return;const tb=document.getElementById('rncGridToolbar');if(tb)tb.innerHTML=rncGridToolbarHtml();let t;try{t=collectRncTemplateForm()}catch(e){t=getRncProcessTemplate()}
  const sec=id=>t.sections.find(x=>x.id===id)?.enabled;const lbl=id=>escapeHtml(t.sections.find(x=>x.id===id)?.label||'');
  const L={...defaultRncProcessTemplate().layout,...(t.layout||{})},bw=Math.max(.4,Number(L.borderWidth)||.65),fs=(Number(L.fontScale)||100)/100,rowPx=Math.max(27,(Number(L.rowHeight)||7)*5),headPx=Math.max(45,(Number(L.headerHeight)||13)*5),barPx=Math.max(18,(Number(L.sectionHeight)||5)*4);
  const bar=id=>{const sx=t.sections.find(x=>x.id===id)||{},al=['left','center','right'].includes(sx.align)?sx.align:'left',jc=al==='center'?'center':al==='right'?'flex-end':'flex-start';return sec(id)?`<div contenteditable="true" spellcheck="false" title="Clique para editar o título desta seção" oninput="previewEditRncSectionLabel('${id}',this.textContent)" onblur="refreshRncTemplatePreview()" style="grid-column:1/-1;min-height:${barPx}px;display:flex;align-items:center;justify-content:${jc};text-align:${al};padding:2px 7px;background:${t.accent};color:#fff;font-size:${8.5*fs}px;font-weight:800;border-top:${bw}px solid #111;border-bottom:${bw}px solid #111;outline:none;cursor:text">${lbl(id)}</div>`:''};
  const cell=(a,b='')=>`<div style="padding:3px 5px;min-height:${rowPx}px;border-right:${bw}px solid #777;border-bottom:${bw}px solid #777"><small style="font-size:${6.6*fs}px;font-weight:700">${a}</small><div style="margin-top:3px;font-size:${7.8*fs}px">${b}</div></div>`;
  const previewOwnerContent=owner=>(t.sections||[]).map(sx=>{if(sx.enabled===false)return'';const rows=rncLayoutRowsHtml(t,sx.id,{},true,'',owner);return rows?`${bar(sx.id)}${rows}`:''}).join('');
  const internalPreview=previewOwnerContent('sgq'),supplierPreview=previewOwnerContent('supplier'),footerPreview=previewOwnerContent('footer');
  const previewFooter=()=>`<div style="margin-top:auto;border-top:${bw}px solid #111">${footerPreview}${t.footerText?`<div style="padding:7px 9px;font-size:7px;text-align:center;white-space:pre-wrap;overflow-wrap:anywhere">${escapeHtml(t.footerText)}</div>`:''}</div>`;
  host.innerHTML=`<div style="background:#eef1f5;padding:10px;border-radius:14px;overflow:hidden;height:100%;display:flex;align-items:flex-start;justify-content:center"><div id="rncPreviewSheet" style="width:760px;min-height:900px;margin:0 auto;transform-origin:top center;background:#fff;border:1.5px solid #111;box-shadow:0 8px 24px #0001;font-family:Arial,sans-serif;color:#111">
    ${rncHeaderRowsHtml(t,true,{})}
    ${internalPreview}
    ${(t.fixedImages||[]).map(x=>`<div style="padding:7px;border-bottom:1px solid #555;text-align:center"><div style="font-size:7px;font-weight:700;margin-bottom:4px">${escapeHtml(x.label||'IMAGEM')}</div><img src="${x.dataUrl}" style="max-width:90%;max-height:70px;object-fit:contain"></div>`).join('')}
    ${t.pageBreakBeforeSupplier!==false?`${t.repeatFooterOnPages!==false?previewFooter():''}<div style="height:22px;background:#eef1f5;border-top:2px dashed #9aa4b2;border-bottom:2px dashed #9aa4b2;display:flex;align-items:center;justify-content:center;font-size:9px;color:#667085;font-weight:700">QUEBRA DE PÁGINA · PARTE DO FORNECEDOR</div>${t.repeatHeaderOnPages!==false?rncHeaderRowsHtml(t,true,{}):''}`:''}<div style="padding:7px;background:#f4f6f8;border-bottom:1px solid #111;font-size:8px"><b>${escapeHtml(t.supplierResponseTitle||'RESPOSTA DO FORNECEDOR')}</b>${t.supplierResponseNote?' · '+escapeHtml(t.supplierResponseNote):''}</div>
    ${supplierPreview}
    ${t.repeatFooterOnPages!==false?previewFooter():''}
    ${(t.fixedImages||[]).map(x=>`<div style="padding:7px;border-bottom:1px solid #555;text-align:center"><div style="font-size:7px;font-weight:700;margin-bottom:4px">${escapeHtml(x.label||'IMAGEM')}</div><img src="${x.dataUrl}" style="max-width:90%;max-height:70px;object-fit:contain"></div>`).join('')}
  </div></div>`;
  requestAnimationFrame(()=>{
    const sheet=document.getElementById('rncPreviewSheet'),box=host;if(!sheet||!box)return;
    sheet.style.transform='none';sheet.style.marginBottom='0';
    const viewport=sheet.parentElement;
    const availW=Math.max(320,box.clientWidth-20),availH=Math.max(320,box.clientHeight-20),sw=sheet.scrollWidth||760,sh=sheet.scrollHeight||900;
    const fitScale=Math.min(1,availW/sw,availH/sh);
    const zoomPct=rncPreviewZoom==='fit'?100:Math.max(50,Math.min(250,Number(rncPreviewZoom)||100));
    const scale=Math.max(.2,Math.min(2.5,fitScale*(zoomPct/100)));
    const scaledW=sw*scale,scaledH=sh*scale;
    // O transform não altera o tamanho de layout do elemento. Um canvas com o tamanho
    // realmente escalado mantém a folha centralizada e evita que o zoom a empurre lateralmente.
    const canvas=document.createElement('div');
    canvas.className='rnc-preview-canvas';
    canvas.style.cssText=`position:relative;flex:0 0 auto;width:${scaledW}px;height:${scaledH}px;`;
    sheet.parentNode.insertBefore(canvas,sheet);canvas.appendChild(sheet);
    sheet.style.position='absolute';sheet.style.left='0';sheet.style.top='0';
    sheet.style.transformOrigin='top left';sheet.style.transform=`scale(${scale})`;
    sheet.style.margin='0';
    if(viewport){
      viewport.style.overflow='auto';viewport.style.alignItems='flex-start';viewport.style.padding='10px';
      viewport.style.justifyContent=(scaledW<=Math.max(0,viewport.clientWidth-20)?'center':'flex-start');
    }
    const label=document.getElementById('rncPreviewZoomLabel');if(label)label.textContent=rncPreviewZoom==='fit'?'100%':`${Math.round(zoomPct)}%`;
    if(viewport){
      // Quando ainda cabe, fica geometricamente centralizado. Quando passa a largura do visor,
      // começa pela esquerda e a rolagem horizontal passa a navegar somente a prévia.
      if(scaledW<=Math.max(0,viewport.clientWidth-20)) viewport.scrollLeft=0;
      if(zoomPct<=100 && scaledH<=Math.max(0,viewport.clientHeight-20)) viewport.scrollTop=0;
    }
  });
}

function rncWordCompatibleHtml(html){
  const parser=new DOMParser(),doc=parser.parseFromString(String(html||''),'text/html');
  doc.querySelectorAll('.toolbar').forEach(x=>x.remove());
  const gridPos=el=>{const st=String(el.getAttribute('style')||''),cm=st.match(/grid-column\s*:\s*(\d+)\s*\/\s*(\d+)/i),rm=st.match(/grid-row\s*:\s*(\d+)\s*\/\s*(\d+)/i);return cm&&rm?{cs:+cm[1],ce:+cm[2],rs:+rm[1],re:+rm[2]}:null};
  const cleanCellStyle=st=>String(st||'').replace(/grid-column\s*:[^;]+;?/ig,'').replace(/grid-row\s*:[^;]+;?/ig,'').replace(/display\s*:\s*flex\s*;?/ig,'').replace(/cursor\s*:[^;]+;?/ig,'');
  const convertGrid=grid=>{
    const kids=[...grid.children].map(el=>({el,p:gridPos(el)})).filter(x=>x.p);if(!kids.length)return;
    const cb=[...new Set(kids.flatMap(x=>[x.p.cs,x.p.ce]))].sort((a,b)=>a-b),rb=[...new Set(kids.flatMap(x=>[x.p.rs,x.p.re]))].sort((a,b)=>a-b);
    const table=doc.createElement('table');table.setAttribute('cellspacing','0');table.setAttribute('cellpadding','0');table.style.cssText='width:100%;border-collapse:collapse;table-layout:fixed;margin:0;padding:0;';
    const cg=doc.createElement('colgroup');for(let i=0;i<cb.length-1;i++){const c=doc.createElement('col');c.style.width=((cb[i+1]-cb[i])/10)+'%';cg.appendChild(c)}table.appendChild(cg);
    for(let ri=0;ri<rb.length-1;ri++){
      const rowStart=rb[ri],tr=doc.createElement('tr');
      kids.filter(x=>x.p.rs===rowStart).sort((a,b)=>a.p.cs-b.p.cs).forEach(({el,p})=>{
        const td=doc.createElement('td'),ci1=cb.indexOf(p.cs),ci2=cb.indexOf(p.ce),ri2=rb.indexOf(p.re);if(ci2-ci1>1)td.colSpan=ci2-ci1;if(ri2-ri>1)td.rowSpan=ri2-ri;
        td.innerHTML=el.innerHTML;td.setAttribute('data-rnc-word-cell',el.getAttribute('data-rnc-grid-cell')||el.getAttribute('data-rnc-header-cell')||'');td.setAttribute('style',cleanCellStyle(el.getAttribute('style'))+';vertical-align:top;');tr.appendChild(td);
      });table.appendChild(tr);
    }
    grid.replaceWith(table);
  };
  doc.querySelectorAll('[data-rnc-header-grid],[data-rnc-grid-section]').forEach(convertGrid);
  doc.querySelectorAll('[style]').forEach(el=>{let st=String(el.getAttribute('style')||'');st=st.replace(/display\s*:\s*grid\s*;?/ig,'').replace(/grid-template-[^;]+;?/ig,'').replace(/display\s*:\s*flex\s*;?/ig,'');el.setAttribute('style',st)});
  // Google Docs/Word ignora de forma inconsistente break-before vindo de classes CSS.
  // Materializa a quebra entre as páginas como elemento inline, antes da segunda página,
  // e remove alturas/flex do HTML de impressão que causavam o cabeçalho da página 2
  // a escorrer para o fim da página 1 durante a conversão DOCX.
  const pages=[...doc.querySelectorAll('.rncPage')];
  pages.forEach((pg,i)=>{
    pg.style.width='100%';
    pg.style.minHeight='0';
    pg.style.height='auto';
    pg.style.display='block';
    pg.style.breakInside='auto';
    pg.style.pageBreakInside='auto';
    pg.style.pageBreakAfter='auto';
    // A quebra real é aplicada no OOXML pelo backend após a exportação DOCX.
    // Não inserir quebra HTML aqui: Google Docs pode deslocá-la e criar página vazia.
  });
  doc.querySelectorAll('.doc').forEach(el=>{el.style.height='auto';el.style.minHeight='0';el.style.display='block';el.style.overflow='visible'});
  doc.querySelectorAll('.pageContent').forEach(el=>{el.style.display='block';el.style.width='100%'});
  doc.querySelectorAll('.pageFooter').forEach(el=>{el.style.pageBreakInside='avoid';el.style.breakInside='avoid';el.style.marginTop='0'});
  const extra=doc.createElement('style');extra.textContent='@page{size:A4 portrait;margin:6mm} body{font-family:Arial,Helvetica,sans-serif;font-size:8pt;margin:0}.rncPage{width:100%!important;min-height:0!important;height:auto!important;display:block!important;page-break-inside:auto!important}.doc{width:100%!important;height:auto!important;min-height:0!important;display:block!important;overflow:visible!important;border:1px solid #111}.pageFooter{page-break-inside:avoid!important;break-inside:avoid!important;margin-top:0!important}.bar{display:block!important;padding:3px 6px!important;color:#fff!important;font-weight:bold!important}.supplierNote{background:#eef5ff!important}.cell{min-height:0!important}table{border-collapse:collapse;table-layout:fixed;width:100%}td{overflow-wrap:anywhere;word-break:break-word}p[data-rnc-word-page-break]{page-break-before:always!important;break-before:page!important;margin:0!important;padding:0!important;height:0!important;line-height:0!important}';doc.head.appendChild(extra);
  return '<!doctype html>\n'+doc.documentElement.outerHTML;
}
function downloadRncEditableDoc(id){
  // O Núcleo não gera mais .doc/HTML no navegador. O editável oficial é DOCX
  // e é criado exclusivamente no backend durante o fluxo de envio.
  const r=adminModuleRecord(id);
  if(!r)return;
  openRncSendModal(id);
}

function rncBlockingRowsHtml(r={}){
  const e=v=>escapeHtml(String(v??''));
  const items=legacyRncBlockItems(r).filter(item=>Object.values(item||{}).some(v=>String(v||'').trim()));
  const safeItems=items.length?items:[{}];
  const supplier=String(r.supplier||'').trim();
  const area=String(r.rncBlockArea||'').trim();
  const etapa=String(r.rncBlockStage||'').trim();
  const head=['Fornecedor','Nota Fiscal','Data da emissão','Código do produto','Produto / descrição','Dimensões / especificação','Qtd. Não Conforme','Área responsável pelo Bloqueio','Etapa da área responsável pelo bloqueio','Disposição'];
  return `<table class="rncBlockingItems" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;table-layout:fixed;margin:0">
    <tr>${head.map(h=>`<td style="border:1px solid #777;background:#b7dde8;font-size:6.5px;font-weight:700;padding:1mm;text-align:center">${e(h)}</td>`).join('')}</tr>
    ${safeItems.map(item=>`<tr>
      <td style="border:1px solid #777;padding:1mm">${e(supplier||'—')}</td>
      <td style="border:1px solid #777;padding:1mm">${e(item.invoice||'—')}</td>
      <td style="border:1px solid #777;padding:1mm">${e(item.issueDate||'—')}</td>
      <td style="border:1px solid #777;padding:1mm">${e(item.productCode||'—')}</td>
      <td style="border:1px solid #777;padding:1mm">${e(item.product||'—')}</td>
      <td style="border:1px solid #777;padding:1mm">${e(item.dimensions||'—')}</td>
      <td style="border:1px solid #777;padding:1mm">${e(item.quantity||'—')}</td>
      <td style="border:1px solid #777;padding:1mm">${e(area||'—')}</td>
      <td style="border:1px solid #777;padding:1mm">${e(etapa||'—')}</td>
      <td style="border:1px solid #777;padding:1mm">${e(item.disposition||'—')}</td>
    </tr>`).join('')}
  </table>`;
}

function printRncStandard(id,returnHtml=false){
  const r=adminModuleRecord(id); if(!r||r.module!=='nccapa'||r.ncType!=='supplier')return;
  const e=v=>escapeHtml(String(v??'')).replace(/\n/g,'<br>'); const v=(x,empty='')=>String(x??'').trim()||empty; const tpl=getRncProcessTemplate();
  const responseLabel={none:'SEM RESPOSTA',partial:'RESPOSTA PARCIAL',complete:'RESPOSTA COMPLETA'}[r.rncResponseStatus]||'SEM RESPOSTA';
  const enabled=id=>tpl.sections.find(x=>x.id===id)?.enabled!==false;
  const cell=(label,value)=>`<div class="cell"><span>${e(label)}</span><span class="rncAnswer">${e(v(value,'—'))}</span></div>`;
  const long=(label,value)=>`<div class="long"><div class="lbl">${e(label)}</div><div class="answer">${e(v(value,'—'))}</div></div>`;
  const logo=tpl.logoDataUrl?`<img src="${tpl.logoDataUrl}" alt="Logo" class="logo">`:`<b class="logoText" style="color:${e(tpl.accent)}">${e(tpl.logoText||'SETA')}</b>`;
  const L={...defaultRncProcessTemplate().layout,...(tpl.layout||{})},bw=Math.max(.4,Number(L.borderWidth)||.65),fs=(Number(L.fontScale)||100)/100;
  const bar=(id,fallback)=>{const sx=tpl.sections.find(x=>x.id===id)||{},al=['left','center','right'].includes(sx.align)?sx.align:'left',jc=al==='center'?'center':al==='right'?'flex-end':'flex-start';return enabled(id)?`<div class="bar" style="background:${e(tpl.accent)};justify-content:${jc};text-align:${al}">${e(sx.label||fallback)}</div>`:''};
  const pageHeader=(page,total)=>{const pt={...tpl,headerLayout:(tpl.headerLayout||defaultRncHeaderLayout()).map(x=>x.id==='h-page'?{...x,source:'@'+page+' de '+total}:{...x})};return rncHeaderRowsHtml(pt,false,r)};
  const sectionFallback={identification:'IDENTIFICAÇÃO',blocking:'BLOQUEIO',problem:'DESVIO EVIDENCIADO / DESCRIÇÃO',effect:'EFEITO DO DESVIO',participants:'PARTICIPANTES DO PREENCHIMENTO',immediate:'AÇÕES IMEDIATAS',ishikawa:'ISHIKAWA',fivewhys:'ANÁLISE DOS 5 PORQUÊS',cause:'CONCLUSÃO DA INVESTIGAÇÃO DE CAUSA',corrective:'AÇÕES CORRETIVAS E PREVENTIVAS',effectiveness:'VERIFICAÇÃO DE EFICÁCIA',photos:'REGISTRO FOTOGRÁFICO',signatures:'ELABORADOR · VERIFICADOR · APROVADOR'};
  const sectionForOwner=(sx,owner)=>{
    if(!sx||sx.enabled===false)return'';
    if(owner==='sgq'&&sx.id==='blocking'){
      const fields=rncBlockingRowsHtml(r);
      return `${bar(sx.id,sectionFallback[sx.id]||sx.label)}${fields}`;
    }
    const fields=rncLayoutRowsHtml(tpl,sx.id,r,false,'cell',owner);
    if(!fields)return'';
    return `${bar(sx.id,sectionFallback[sx.id]||sx.label)}${fields}`;
  };
  const ownerContent=owner=>(tpl.sections||[]).map(sx=>sectionForOwner(sx,owner)).join('');
  const internalContent=ownerContent('sgq');
  const supplierContent=`<div class="supplierNote"><b>${e(tpl.supplierResponseTitle||'RESPOSTA DO FORNECEDOR')} — ${e(responseLabel)}</b>${tpl.supplierResponseNote?`<br>${e(tpl.supplierResponseNote)}`:''}</div>${ownerContent('supplier')}`;
  const footerSections=ownerContent('footer');
  const extraImages=(tpl.fixedImages||[]).map(x=>`<div class="long"><div class="lbl">${e(x.label||'IMAGEM')}</div><div class="answer" style="text-align:center"><img src="${x.dataUrl}" style="max-width:95%;max-height:45mm;object-fit:contain"></div></div>`).join('');
  const footerHtml=()=>`<div class="pageFooter">${footerSections}${tpl.footerText?`<div class="footerText" style="font-size:${6.8*fs}px">${e(tpl.footerText)}</div>`:''}</div>`;
  const split=tpl.pageBreakBeforeSupplier!==false,totalPages=split?2:1;
  const pages=split
    ? `<section class="rncPage"><div class="doc">${pageHeader(1,totalPages)}<div class="pageContent">${internalContent}${extraImages}</div>${tpl.repeatFooterOnPages!==false?footerHtml():''}</div></section><section class="rncPage pageBreak"><div class="doc">${tpl.repeatHeaderOnPages!==false?pageHeader(2,totalPages):''}<div class="pageContent">${supplierContent}</div>${tpl.repeatFooterOnPages!==false?footerHtml():''}</div></section>`
    : `<section class="rncPage"><div class="doc">${pageHeader(1,1)}<div class="pageContent">${internalContent}${extraImages}${supplierContent}</div>${footerHtml()}</div></section>`;
  const html=`<!doctype html><html><head><meta charset="utf-8"><title>${e(v(r.rncNumber,'RNC'))}</title><style>
  @page{size:A4 portrait;margin:6mm}*{box-sizing:border-box;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}html,body{margin:0;background:#fff;color:#111;font-family:Arial,Helvetica,sans-serif;font-size:8px;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}.rncPage{width:100%;min-height:285mm;display:flex;break-inside:avoid;page-break-inside:avoid}.rncPage.pageBreak{break-before:page;page-break-before:always}.doc{width:100%;height:285mm;min-height:285mm;border:${bw}px solid #111;display:flex;flex-direction:column;overflow:hidden}.pageContent{width:100%;flex:0 0 auto}.pageFooter{margin-top:auto;border-top:${bw}px solid #111;text-align:center;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;flex:0 0 auto}.pageFooter>[data-rnc-grid-section]{border-bottom:0!important}.footerText{padding:2mm}.head{display:grid;grid-template-columns:${L.logoWidth}% 1fr;min-height:${L.headerHeight}mm;border-bottom:${bw}px solid #111}.logoBox{display:flex;align-items:center;justify-content:center;border-right:${bw}px solid #111;padding:1.5mm}.logo{max-width:92%;max-height:${Math.max(7,L.headerHeight-2)}mm;object-fit:contain}.logoText{font-size:${18*fs}px}.sys{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}.sys b{font-size:${10*fs}px}.sys span{margin-top:1mm}.meta{display:grid;grid-template-columns:1fr 1fr}.meta div{padding:1mm;border-right:${bw}px solid #777;border-bottom:${bw}px solid #777}.meta div:nth-child(even){border-right:0}.titleRow{display:grid;grid-template-columns:18mm 1fr;border-bottom:1px solid #111}.titleRow>*{padding:1.5mm}.titleRow b:first-child{border-right:1px solid #777}.report{text-align:center;font-weight:800}.bar{color:#fff!important;font-weight:800;min-height:${L.sectionHeight}mm;display:flex;align-items:center;padding:.7mm 1.5mm;border-top:${bw}px solid #111;border-bottom:${bw}px solid #111;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}.grid3,.grid4,.grid5,.grid6{display:grid;border-bottom:1px solid #777}.grid3{grid-template-columns:1.1fr 1fr 1fr}.grid4{grid-template-columns:1.1fr .6fr .9fr 1fr}.grid5{grid-template-columns:1.3fr .8fr .9fr 1fr 1fr}.grid6{grid-template-columns:1.1fr .7fr .8fr .9fr .8fr 1fr}.cell{min-height:${L.rowHeight}mm;padding:1mm;border-right:${bw}px solid #777}.cell:last-child{border-right:0}.cell span{display:block;font-size:6.5px;font-weight:700;margin-bottom:1.5mm}.cell b{font-size:8px;font-weight:400}.rncAnswer{font-weight:400!important}.long{border-bottom:1px solid #777;min-height:13mm}.lbl{font-weight:700;padding:1.4mm 2mm;border-bottom:1px solid #bbb}.answer{padding:2mm;min-height:9mm}.supplierNote{padding:1.8mm 2mm;background:#f2f4f7;border-bottom:1px solid #111}.matrix{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid #777}.matrix div{padding:2mm;min-height:9mm;border-right:1px solid #777}.sign{display:grid;grid-template-columns:repeat(3,1fr);min-height:13mm}.sign div{text-align:center;padding:2mm;border-right:1px solid #777}.toolbar{margin-bottom:8px}.toolbar button{padding:7px 12px}@media screen{body{background:#dfe3e8}.rncPage{width:198mm;margin:8px auto;background:#fff;box-shadow:0 2px 8px #0002}}@media print{.toolbar{display:none}.rncPage{margin:0;box-shadow:none}}
  </style></head><body><div class="toolbar"><button onclick="window.print()">Salvar como PDF / Imprimir</button></div>${pages}</body></html>`;
  if(returnHtml)return html;
  let frame=document.getElementById('nucleoRncPrintFrame');if(frame)frame.remove();frame=document.createElement('iframe');frame.id='nucleoRncPrintFrame';frame.style.cssText='position:fixed;left:-10000px;top:0;width:210mm;height:297mm;border:0;background:#fff;';document.body.appendChild(frame);const d=frame.contentDocument||frame.contentWindow.document;d.open();d.write(html);d.close();const doPrint=()=>{try{frame.contentWindow.focus();frame.contentWindow.print()}catch(err){console.error(err);alert('Não foi possível abrir a impressão do PDF.')}};if(d.readyState==='complete')setTimeout(doPrint,250);else frame.onload=()=>setTimeout(doPrint,250);
}
function editAdminOperationalRecord(...args){return nucleoOpenLazyAdmin('editAdminOperationalRecord',args);}

async function deleteAdminOperationalRecord(id){
  const r=adminModuleRecord(id);if(!r)return;
  if(!nucleoFeatureRequire(r.module==='nccapa'?'nc':r.module,r.module==='documents'?'prepare':'delete'))return;

  if(r.module==='nccapa'&&!canOperateNcCapa()){
    alert('Somente o SGQ/ADM pode excluir uma RNC.');
    return;
  }

  const nome=String(r.rncNumber||r.title||'esta RNC').trim();
  const fornecedor=String(r.supplier||'').trim();
  const enviada=r.rncEmailStatus==='sent';

  let msg=
    `Excluir ${nome}${fornecedor?` — ${fornecedor}`:''}?\n\n`+
    `A RNC será removida da central e a exclusão será sincronizada com a base.`;

  if(enviada){
    msg+=`\n\nATENÇÃO: esta RNC já foi enviada por e-mail. Excluir o registro não desfaz o e-mail já enviado.`;
  }

  if(!confirm(msg))return;

  showNucleoLoading('Excluindo RNC...');

  try{
    await portalBackendDeleteConfirmed('admin_modules',id);

    // Garante a remoção visual mesmo se a tela estiver usando um array antigo.
    saveAdminModuleRecords(
      getAdminModuleRecordsRaw().filter(x=>String(x?.id||'')!==String(id))
    );

    hideNucleoLoading();

    if(document.getElementById('ncTreatmentList')){
      renderNcCapaTreatmentList();
    }else{
      showAdminOperationalModule('nccapa');
    }

    // Reenvia mais uma vez alguns segundos depois.
    setTimeout(()=>portalSendPendingRncDelete(id),2500);
  }catch(e){
    hideNucleoLoading();

    // Mesmo em uma falha local inesperada, mantém a RNC marcada para
    // exclusão e tenta sincronizar novamente.
    markRncDeletedLocally(id);
    setTimeout(()=>portalSendPendingRncDelete(id),2500);

    if(document.getElementById('ncTreatmentList')){
      renderNcCapaTreatmentList();
    }else{
      showAdminOperationalModule('nccapa');
    }
  }
}

function openAdmin(){
  refreshSectorSelectors();
  if(!isAdmin()){showList();return;}
  view('settingsView');setNav('admin');loadAdminConfig();window.scrollTo({top:0,behavior:'instant'});
  if(typeof renderAccess==='function')renderAccess();
  renderOperationalUsers();
  setTimeout(()=>refreshPendingRegistrations(false),120);
}
function renderAdminUsers(){
  const box=document.getElementById('adminUsersList');
  if(!box)return;
  const st=getAccessState();
  const users=getOperationalUsers();
  const current=String(getSession()?.email||'').trim().toLowerCase();

  // A fonte principal é a coleção de usuários: qualquer cadastro role=admin
  // precisa aparecer aqui, mesmo que a lista local access.admins esteja antiga.
  const emails=[];
  const addEmail=v=>{const e=String(v||'').trim().toLowerCase();if(e&&!emails.includes(e))emails.push(e)};
  users.filter(u=>nucleoPersonPermissions(u).sgq).forEach(u=>addEmail(u.email));
  (Array.isArray(st.admins)?st.admins:[]).forEach(addEmail);

  if(!emails.length){
    box.innerHTML='<div class="small">Nenhum administrador cadastrado.</div>';
    return;
  }

  box.innerHTML=emails.map(email=>{
    const u=users.find(x=>String(x.email||'').trim().toLowerCase()===email);
    const displayName=u?.name||email;
    const initial=(displayName||'?').trim().charAt(0).toUpperCase();
    const active=!(u?.active===false || u?.approvalStatus==='disabled');
    const isSelf=email===current;
    const protectedBase=email==='sgq@empresa.com';
    const realAdmins=emails.filter(e=>e!=='sgq@empresa.com'||users.some(u=>String(u.email||'').trim().toLowerCase()===e));
    const cantDelete=realAdmins.length<=1 || isSelf || protectedBase;
    const safeEmail=encodeURIComponent(email);
    return `<div class="admin-user-row">
      <div class="admin-user-info">
        <div class="admin-avatar">${escapeHtml(initial)}</div>
        <div><div class="admin-email">${escapeHtml(displayName)}</div><div class="small">${escapeHtml(email)}</div><span class="role-tag">Administrador</span> <span class="status-badge ${active?'approved':'rejected'}">${active?'Ativo':'Desativado'}</span></div>
      </div>
      <div style="display:flex;gap:7px;flex-wrap:wrap;justify-content:flex-end">
        ${u?`<button class="btn secondary" type="button" onclick="openUnitUserAccess('${encodeURIComponent(u.personId||u.email||u.name)}')">Editar acesso</button>`:''}
        <button class="btn secondary" type="button" onclick="editAdminAccountByEmail(decodeURIComponent('${safeEmail}'))">Editar</button>
        <button class="btn secondary" type="button" ${isSelf?'disabled title="Você não pode desativar a conta que está usando"':''} onclick="toggleAdminAccountByEmail(decodeURIComponent('${safeEmail}'))">${active?'Desativar':'Ativar'}</button>
        <button class="remove-admin" type="button" ${cantDelete?'disabled title="Não é possível excluir esta conta"':''} onclick="deleteAdminAccountByEmail(decodeURIComponent('${safeEmail}'))">Excluir</button>
      </div>
    </div>`;
  }).join('');
}

function adminIndexByEmail(email){
  const st=getAccessState();
  return st.admins.findIndex(x=>String(x||'').trim().toLowerCase()===String(email||'').trim().toLowerCase());
}
function editAdminAccountByEmail(email){
  const st=getAccessState();
  let i=adminIndexByEmail(email);
  if(i<0){st.admins.push(String(email||'').trim().toLowerCase());saveAccessState(st);i=adminIndexByEmail(email)}
  editAdminAccount(i);
}
function toggleAdminAccountByEmail(email){
  const st=getAccessState();
  let i=adminIndexByEmail(email);
  if(i<0){st.admins.push(String(email||'').trim().toLowerCase());saveAccessState(st);i=adminIndexByEmail(email)}
  toggleAdminAccount(i);
}
function deleteAdminAccountByEmail(email){
  if(!isAdmin()){alert('Acesso restrito.');return}
  email=String(email||'').trim().toLowerCase();
  const current=String(getSession()?.email||'').trim().toLowerCase();
  if(email===current){alert('Você não pode excluir a conta que está usando.');return}
  if(email==='sgq@empresa.com'){alert('A conta administrativa principal não pode ser excluída.');return}

  const users=getOperationalUsers();
  const admins=users.filter(u=>String(u.role||'').toLowerCase()==='admin' && String(u.email||'').trim().toLowerCase()!==email);
  if(admins.length<1){alert('É necessário manter pelo menos um administrador cadastrado.');return}
  const u=users.find(x=>String(x.email||'').trim().toLowerCase()===email);
  if(!u){alert('Cadastro do administrador não encontrado.');return}
  if(!confirm(`Excluir permanentemente o acesso de ${u.name||email}?\n\nO histórico do sistema será preservado, mas esta conta não poderá mais entrar.`))return;

  saveOperationalUsers(users.filter(x=>String(x.email||'').trim().toLowerCase()!==email));
  markDeletedUserKey(email);
  const st=getAccessState();
  st.admins=(st.admins||[]).filter(x=>String(x||'').trim().toLowerCase()!==email);
  saveAccessState(st);
  portalBackendDelete('users',email);
  renderAdminUsers();
  renderOperationalUsers();
  alert('Administrador excluído.');
}

function editAdminAccount(index){
  if(!isAdmin()){alert('Acesso restrito.');return}
  const st=getAccessState();
  const email=String(st.admins[index]||'').trim().toLowerCase();
  const users=getOperationalUsers();
  const ui=users.findIndex(u=>String(u.email||'').trim().toLowerCase()===email);
  if(ui<0){alert('Cadastro do administrador não encontrado.');return}
  const u=users[ui];
  const name=prompt('Nome do administrador:',u.name||'');
  if(name===null)return;
  const cleanName=String(name).trim();
  if(!cleanName){alert('O nome não pode ficar vazio.');return}
  users[ui]={...u,name:cleanName,role:'admin'};
  saveOperationalUsers(users);
  portalBackendSave('users',users[ui].email||users[ui].name,users[ui]);
  renderAdminUsers();
}
function toggleAdminAccount(index){
  if(!isAdmin()){alert('Acesso restrito.');return}
  const st=getAccessState();
  const email=String(st.admins[index]||'').trim().toLowerCase();
  const current=String(getSession()?.email||'').trim().toLowerCase();
  if(email===current){alert('Você não pode desativar a conta que está usando.');return}
  const users=getOperationalUsers();
  const ui=users.findIndex(u=>String(u.email||'').trim().toLowerCase()===email);
  if(ui<0){alert('Cadastro do administrador não encontrado.');return}
  const active=!(users[ui].active===false || users[ui].approvalStatus==='disabled');
  const action=active?'desativar':'ativar';
  if(!confirm(`Deseja ${action} o acesso de ${users[ui].name||email}?`))return;
  users[ui]={...users[ui],role:'admin',active:!active,approvalStatus:active?'disabled':'approved',status:active?'disabled':'active',updatedAt:new Date().toISOString()};
  saveOperationalUsers(users);
  portalBackendSave('users',users[ui].email||users[ui].name,users[ui]);
  renderAdminUsers();
}
function deleteAdminAccount(index){
  if(!isAdmin()){alert('Acesso restrito.');return}
  const st=getAccessState();
  if(st.admins.length<=1){alert('É necessário manter pelo menos um administrador cadastrado.');return}
  const email=String(st.admins[index]||'').trim().toLowerCase();
  const current=String(getSession()?.email||'').trim().toLowerCase();
  if(email===current){alert('Você não pode excluir a conta que está usando.');return}
  if(email==='sgq@empresa.com'){alert('A conta administrativa principal não pode ser excluída.');return}
  const users=getOperationalUsers();
  const u=users.find(x=>String(x.email||'').trim().toLowerCase()===email);
  if(!confirm(`Excluir permanentemente o acesso de ${u?.name||email}?\n\nO histórico do sistema será preservado, mas esta conta não poderá mais entrar.`))return;
  const filtered=users.filter(x=>String(x.email||'').trim().toLowerCase()!==email);
  localStorage.setItem(USERS_KEY,JSON.stringify(filtered));
  markDeletedUserKey(email);
  st.admins=st.admins.filter(x=>String(x||'').trim().toLowerCase()!==email);
  saveAccessState(st);
  portalBackendDelete('users',email);
  renderAdminUsers();
  renderOperationalUsers();
}
async function addAdmin(){
  if(!nucleoPersonPermissions(getSession()||{}).sgq)return;
  const name=(document.getElementById('newAdminName')?.value||'').trim();
  const email=(document.getElementById('newAdminEmail')?.value||'').trim().toLowerCase();
  const password=document.getElementById('newAdminPassword')?.value||'';
  const password2=document.getElementById('newAdminPassword2')?.value||'';

  if(!name||!email||!password||!password2){
    alert('Preencha nome, e-mail SETA, senha e confirmação da senha.');
    return;
  }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    alert('Informe um e-mail corporativo válido.');
    return;
  }
  if(password.length<4){
    alert('A senha precisa ter pelo menos 4 caracteres neste protótipo.');
    return;
  }
  if(password!==password2){
    alert('As senhas não coincidem.');
    return;
  }

  const users=getOperationalUsers();
  const existingIndex=users.findIndex(u=>String(u.email||'').trim().toLowerCase()===email);
  if(existingIndex>=0 && users[existingIndex].role==='admin'){
    alert('Esse usuário já é administrador.');
    return;
  }

  const adminUser={
    ...(existingIndex>=0?users[existingIndex]:{}),
    name,
    email,
    unit:'Todas',
    sector:'SGQ',
    role:'admin',
    password,
    approvalStatus:'approved',
    approvedAt:new Date().toISOString(),
    approvedBy:getSession()?.name||'SGQ',
    managedSectors:[]
  };

  if(existingIndex>=0)users[existingIndex]=adminUser;
  else users.push(adminUser);

  localStorage.setItem(USERS_KEY,JSON.stringify(users));

  const st=getAccessState();
  if(!st.admins.map(x=>String(x).trim().toLowerCase()).includes(email))st.admins.push(email);
  saveAccessState(st);

  // A coleção users já é sincronizada pelo backend existente.
  portalBackendSave('users',email,adminUser);

  ['newAdminName','newAdminEmail','newAdminPassword','newAdminPassword2'].forEach(id=>{
    const el=document.getElementById(id);if(el)el.value='';
  });
  renderAdminUsers();
  renderOperationalUsers();
  alert('Administrador cadastrado. Ele já pode entrar usando nome, setor SGQ e a senha definida.');
}
function removeAdmin(index){
  if(!isAdmin()){ alert('Acesso restrito.'); return; }
  const st=getAccessState();
  if(st.admins.length<=1){
    alert('É necessário manter pelo menos um administrador cadastrado.');
    return;
  }
  const email=st.admins[index];
  if(!confirm(`Remover ${email} da lista de administradores?`)) return;
  st.admins.splice(index,1);
  saveAccessState(st);
  const users=getOperationalUsers();
  const ui=users.findIndex(u=>String(u.email||'').trim().toLowerCase()===String(email||'').trim().toLowerCase());
  if(ui>=0 && String(email||'').toLowerCase()!=='sgq@empresa.com'){
    users[ui]={...users[ui],role:'operational',unit:canonicalPortalUnit(users[ui].unit),sector:users[ui].sector==='SGQ'?'':users[ui].sector};
    localStorage.setItem(USERS_KEY,JSON.stringify(users));
    portalBackendSave('users',users[ui].email||users[ui].name,users[ui]);
  }
  if(!isAdmin()){
    showList();
    alert('Seu usuário deixou de ser administrador. O acesso foi reduzido.');
  } else {
    renderAdminUsers();
  }
}
function refreshAccessUI(){
  const __adminAllowed=isAdmin();
  const __adminNav=document.getElementById('navAdmin');
  if(__adminNav)__adminNav.style.display=__adminAllowed?'':'none';
  const __settings=document.getElementById('settingsView');
  if(__settings && !__adminAllowed)__settings.classList.add('hidden');

  const admin=isAdmin();
  const email=currentEmail();
  const top=document.getElementById('topUserLabel');
  const s=getSession(); if(top) top.textContent=(s?.name||email)+(admin?' · Administrador':' · Usuário operacional');

  const navAdmin=document.getElementById('navAdmin');
  if(navAdmin){
    navAdmin.style.opacity=admin?'1':'.42';
    navAdmin.title=admin?'Administração':'Acesso exclusivo para administradores';
  }

  const banner=document.getElementById('accessBanner');
  if(banner){
    banner.className='access-banner'+(admin?' admin':'');
    banner.innerHTML=admin
      ? ''
      : '';
  }

  const syncBtn=[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Sincronizar') && b.closest('.topbar'));
  if(syncBtn){
    // Sincronizar é operacional e não altera links/regras/período.
    syncBtn.disabled=false;
    syncBtn.title='Sincronizar agora';
  }
}



const SIDE_MODULE_STATE_KEY='portal-sgq-side-modules-v1';
function sideModuleState(){try{return JSON.parse(localStorage.getItem(SIDE_MODULE_STATE_KEY)||'{}')||{}}catch(e){return {}}}
function setSideModuleOpen(id,open,persist=true){const el=document.getElementById(id);if(!el)return;el.classList.toggle('open',!!open);if(persist){const s=sideModuleState();s[id]=!!open;safeStorageSet(SIDE_MODULE_STATE_KEY,JSON.stringify(s));}}

const SIDEBAR_COLLAPSE_KEY='portal-sgq-sidebar-collapsed-v1';
function applySidebarCollapsedState(){
  const sidebar=document.querySelector('.sidebar');
  if(!sidebar)return;
  const collapsed=localStorage.getItem(SIDEBAR_COLLAPSE_KEY)==='1';
  sidebar.classList.toggle('collapsed',collapsed);
  const btn=document.getElementById('sidebarCollapseBtn');
  if(btn){
    btn.textContent=collapsed?'❯':'❮';
    btn.title=collapsed?'Expandir menu':'Recolher menu';
    btn.setAttribute('aria-label',collapsed?'Expandir menu':'Recolher menu');
  }
}
function toggleSidebarCollapsed(){
  const sidebar=document.querySelector('.sidebar');if(!sidebar)return;
  const next=!sidebar.classList.contains('collapsed');
  localStorage.setItem(SIDEBAR_COLLAPSE_KEY,next?'1':'0');
  applySidebarCollapsedState();
}

function toggleSideModule(id){const el=document.getElementById(id);if(el)setSideModuleOpen(id,!el.classList.contains('open'))}
function restoreSideModules(){
  applyBodyRoleClass();
  enforceAdminVisibility();
  setTimeout(enforceAdminVisibility,0);
  const s=sideModuleState();
  ['moduleRo','moduleSac','modulePersonal'].forEach(id=>{
    const defaultOpen=isAdmin()?true:(id==='moduleRo');
    setSideModuleOpen(id,s[id]===undefined?defaultOpen:!!s[id],false);
  });
}
function openModuleForNav(id){const m={navNewRo:'moduleRo',navMySubmittedRos:'moduleRo',navAssignedRos:'moduleRo',navSent:'moduleRo',navActions:'moduleRo',navPendingActions:'moduleRo',navTriage:'moduleRo',navContests:'moduleRo',navNewExternalRo:'moduleRo',navExternalRoControl:'moduleSac',navMySacs:'moduleSac',navSacTracking:'moduleSac',navPendingHub:'modulePersonal',navDocumentRequests:'modulePersonal',navIndicators:'moduleManagement',navAnnouncements:'moduleManagement',navEquipment:'moduleManagement',navTraining:'moduleManagement',navNcCapa:'moduleManagement',navDocuments:'moduleManagement',navProcesses:'moduleManagement'};if(m[id])setSideModuleOpen(m[id],true)}
function setNav(which){
  ['navRos','navNewRo','navNewExternalRo','navMySubmittedRos','navAssignedRos','navSent','navActions','navPendingHub','navDocumentRequests','navProfile','navTriage','navExternalRoControl','navMySacs','navContests','navIndicators','navPendingActions','navAnnouncements','navEquipment','navTraining','navNcCapa','navDocuments','navProcesses','navAdmin'].forEach(function(id){
    var el=document.getElementById(id);
    if(el) el.classList.remove('active');
  });

  var map={
    ros:'navRos',
    mysubmitted:'navMySubmittedRos',
    assigned:'navAssignedRos',
    sent:'navSent',
    actions:'navActions',
    triage:'navTriage',
    externalro:'navExternalRoControl',
    mysacs:'navMySacs',
    contests:'navContests',
    indicators:'navIndicators',
    pending:'navPendingActions',
    profile:'navProfile',
    admin:'navAdmin'
  };

  var target=document.getElementById(map[which] || 'navRos');
  if(target){ target.classList.add('active'); openModuleForNav(target.id); }

  var crumb=document.getElementById('crumbCurrent');
  if(crumb){
    var labels={
      ros:'Minhas R.O.s',
      mysubmitted:'R.O.s cadastradas por mim',
      assigned:'R.O.s atribuídas',
      sent:'PDCAs enviados',
      actions:'Ações',
      triage:'Triagem de R.O.s',
      externalro:'Controle de SAC',
      mysacs:'Meus SACs',
      contests:'Contestações',
      indicators:'Indicadores SGQ',
      pending:'Ações pendentes',
      profile:'Meu perfil',
      admin:'Administração'
    };
    crumb.textContent=labels[which] || 'Minhas R.O.s';
  }
}


function enforcePdcaRole(){
  if(!isAdmin())return;
  const sendButtons=[...document.querySelectorAll('#pdcaView button')];
  sendButtons.forEach(btn=>{
    const txt=(btn.textContent||'').toLowerCase();
    if(txt.includes('enviar pdca')||txt.includes('salvar e enviar')||txt==='enviar'){
      btn.style.display='none';
    }
  });
}
function goStage(idx){
  setTimeout(enforcePdcaRole,0);
  setTimeout(refreshPdcaPresentation,0);
  setTimeout(refreshUserPendingActionAlert,0);
  if(!selected){
    alert('Selecione uma R.O. primeiro.');
    return;
  }
  if(['Cancelada','Somente para registro'].includes(selected.status)){
    alert('Esta R.O. não exige PDCA.');
    return;
  }
  if(selected.status==='Em contestação'){
    alert('O PDCA está suspenso enquanto a contestação estiver em análise.');
    return;
  }

  pRo.textContent=selected.numero+' • '+selected.assunto;
  pNumero.value=selected.numero;
  pUnidade.value=selected.unidade;
  pCliente.value=selected.cliente;
  pSetor.value=selected.setor;

  activeStage=idx;
  view('pdcaView');
  renderStage();
  setNav(['plan','do','check','act'][idx]);
}

const stages=[{"id": "plan", "number": "01", "name": "Planejar", "subtitle": "Entender antes de agir", "items": [["p1", "Qual é o problema?", "Descrever de forma clara, objetiva e baseada em fatos."], ["p2", "Qual é o impacto do problema?", "Registrar custos, tempo, qualidade, segurança, produtividade, atrasos ou retrabalho."], ["p3", "Onde o problema ocorre?", "Identificar o local ou processo da ocorrência."], ["p4", "Com que frequência o problema ocorre?", "Registrar a frequência observada para direcionar a análise."], ["p5", "Quais são as possíveis causas do problema?", "Analisar pelo 5M: método, máquina, mão de obra, material e meio ambiente."], ["p6", "Por que essas causas ocorrem?", "Aplicar a técnica dos 5 Porquês."], ["p7", "Qual é a causa raiz que deve ser bloqueada?", "Validar a causa com dados, evidências ou observação do processo."], ["p8", "Qual é a meta SMART?", "Definir o resultado esperado para resolver o problema."], ["p9", "Qual é o prazo para atingir a meta?", "Registrar o prazo previsto para a conclusão das ações."], ["p10", "Qual é o status atual da meta?", "Informe se está planejada, em andamento ou concluída."], ["p11", "Qual ação será executada?", "Descrever o que será feito para bloquear ou eliminar a causa raiz."], ["p12", "Qual é o prazo da ação?", "Registrar quando a ação deve ser executada."], ["p13", "Quais setores são responsáveis pela ação?", "Selecione um ou mais setores que executarão ou acompanharão a ação."], ["p14", "Existe algum risco na implantação da ação?", "Registrar possíveis efeitos colaterais da solução."]]}, {"id": "do", "number": "02", "name": "Fazer", "subtitle": "Colocar o plano em prática", "items": [["d1", "A equipe foi treinada?", "Registrar o treinamento da equipe."], ["d2", "A equipe compreendeu a nova forma de trabalho?", "Confirmar se todos sabem o que e como fazer."], ["d3", "Qual é o status do treinamento?", "Registrar o status da pergunta anterior."], ["d4", "Os recursos necessários estão disponíveis?", "Verificar se a execução pode acontecer sem interrupções."], ["d5", "Como a execução será registrada?", "Registrar também os desvios do plano."]]}, {"id": "check", "number": "03", "name": "Checar", "subtitle": "Olhar para o que aconteceu", "items": [["c1", "Os resultados estão conforme a meta SMART?", "Verificar se o objetivo foi alcançado."], ["c2", "A causa raiz foi eliminada?", "Usar os dados coletados para validar a eficácia da ação."], ["c3", "Houve algum efeito colateral?", "Identificar consequências não previstas na mudança."]]}, {"id": "act", "number": "04", "name": "Agir", "subtitle": "Consolidar o próximo passo", "items": [["a1", "A melhoria foi padronizada?", "Registrar instrução de trabalho, check list ou treinamento."], ["a2", "Como o novo padrão será acompanhado?", "Definir o acompanhamento periódico."], ["a3", "A meta foi atingida?", "Se não foi atingida, registre onde ocorreu a falha: P, D ou C."], ["a4", "Quais foram as lições aprendidas?", "Registrar problemas e aprendizados para o próximo ciclo."]]}];const ros=[];
restoreImportedRos();
let detailReturnView='ros';
let selected=ros[0],activeStage=0;let answers={};

function pdcaExternalExists(ro){
  const tri=getRoTriageRecord(ro);
  return tri?.pdcaExternal===true || String(tri?.pdcaSource||'').toLowerCase()==='external';
}
function pdcaSituationLabel(ro){
  if(pdcaExternalExists(ro))return 'PDCA externo';
  const status=String(ro?.status||'');
  const pdca=String(ro?.pdca||'');
  if(pdca==='Enviado'||status==='PDCA enviado')return 'PDCA enviado';
  if(status==='Apresentada'||pdca==='Apresentado')return 'PDCA apresentado';
  if(['Cancelada','Somente para registro'].includes(status))return 'Não se aplica';
  return 'PDCA necessário';
}
async function setExternalPdca(numero,hasExternal,sector=''){
  const base=ros.find(r=>String(r.numero||r.id||r.codigo||'')===String(numero));
  const ro=base?{...base,__assignedSector:sector,__triageRecord:getTriageRecordForRoSector(numero,sector)}:null;
  if(!ro){alert('R.O. não encontrada.');return;}
  if(!isAdmin()){alert('Somente o SGQ pode alterar a situação do PDCA.');return;}

  try{
    await withNucleoLoading(hasExternal?'Registrando PDCA externo...':'Registrando necessidade de PDCA...',async()=>{
      // Usa obrigatoriamente a chave do vínculo já existente (R.O. + setor).
      // Marcar PDCA externo é uma atualização dessa linha, nunca a criação de outra.
      const existingRecord=ro.__triageRecord||getTriageRecordForRoSector(numero,sector);
      const key=String(existingRecord?.roKey||triageCompositeKey(numero,sector)).trim();
      const map=getSavedTriageMap();
      const tri={...(existingRecord||map.get(key)||{}),roKey:key,roNumber:triageDisplayRoNumber(numero)};
      if(String(tri.decision||'')!=='directed'){
        throw new Error('Esta R.O. ainda não está direcionada a um setor responsável.');
      }
      tri.pdcaExternal=!!hasExternal;
      tri.pdcaSource=hasExternal?'external':'portal';
      tri.pdcaRequired=!hasExternal;
      // Se não há PDCA externo, o setor deve ser cobrado até a próxima terça-feira.
      if(!hasExternal) tri.pdcaDeadline=nextTuesdayIsoDate();
      tri.pdcaExternalUpdatedAt=new Date().toISOString();
      tri.pdcaExternalUpdatedBy=getSession()?.name||'SGQ';
      if(portalBackendEnabled()){
        await portalBackendSaveConfirmedPost('triage',key,tri,60000);
      }
      // Só altera o cache depois de a base central confirmar. Como usamos a mesma
      // roKey, a linha existente é substituída em vez de duplicada.
      map.set(key,tri);
      try{localStorage.setItem(TRIAGE_KEY,JSON.stringify([...map.values()]));}catch(e){}
      render();
      try{renderCurrentOverview()}catch(e){}
    },hasExternal?'Salvando PDCA externo':'Atualizando necessidade de PDCA');

    alert(hasExternal
      ?'PDCA externo registrado. O setor continuará vendo a R.O., mas não será cobrado por um novo PDCA no Núcleo.'
      :'Marcado como PDCA necessário. O setor responsável verá a pendência e o prazo será a próxima terça-feira.');
  }catch(err){
    console.error('[NUCLEO PDCA EXTERNO]',err);
    alert('Não foi possível alterar a situação do PDCA. '+(err?.message||err||'Erro desconhecido.'));
  }
}

function assignedRoStatus(r){
  const raw=String(r?.status||'').trim().toLowerCase();
  const tri=getRoTriageRecord(r)||{};
  if(raw.includes('cancel')) return 'Cancelada';
  if(raw.includes('obsolet')) return 'Obsoleto';
  if(tri.decision==='record'||raw==='falta de caixa'||raw==='falta de caixas'||raw.includes('registro')) return 'Registro';
  if(tri.pdcaExternal===true&&!tri.pdcaFileId) return 'PDCA externo';

  // Fonte de verdade para "PDCA respondido": precisa existir um PDCA REAL
  // salvo/enviado na coleção pdca_sent para esta R.O. Não usa mais r.status/r.pdca
  // das planilhas antigas, pois esses campos estavam promovendo registros sem resposta.
  const sentPdca=getPdcaReturnForRo(r);
  if(sentPdca){
    const presented = Boolean(sentPdca.apresentadoEm) ||
      (!sentPdca.externalPdf&&typeof getPdcaPresentationMap==='function' && getPdcaPresentationMap().has(String(sentPdca.id||sentPdca.pdcaId||'')));
    return presented ? 'PDCA apresentado' : 'PDCA respondido';
  }
  return 'Pendente';
}

function assignedRoDeadline(r){
  const status=assignedRoStatus(r);
  if(status!=='Pendente') return '—';
  const tri=getRoTriageRecord(r)||{};
  // Pendência sem PDCA externo sempre vence na próxima terça. Se a triagem já
  // possui um prazo central salvo, preserva-o; caso contrário calcula para exibição.
  return String(tri.pdcaDeadline||tri.deadline||nextTuesdayIsoDate()).trim()||nextTuesdayIsoDate();
}

let roListVisibleLimit=60;
let roListFilterSignature='';
function showMoreRos(){roListVisibleLimit+=60;render()}
function badgeClass(status){if(status==="Em contestação")return"badge warn";if(status==="Cancelada")return"badge danger";if(status==="Somente para registro")return"badge off";if(status==="PDCA enviado")return"badge ok";return"badge"}function render(){
  const searchEl=document.getElementById('search');
  const filterEl=document.getElementById('filter');
  const rowsEl=document.getElementById('rows');
  if(!searchEl||!filterEl||!rowsEl)return;
  const q=searchEl.value.trim().toLowerCase(),f=filterEl.value;
  const admin=isAdmin();
  const assignedSector=document.getElementById('assignedSectorFilter')?.value||'all';
  const assignedOrigin=document.getElementById('assignedOriginFilter')?.value||'all';
  const assignedUnit=document.getElementById('assignedUnitFilter')?.value||'all';
  const filterSignature=JSON.stringify([q,f,roListMode,assignedSector,assignedOrigin,assignedUnit]);
  if(filterSignature!==roListFilterSignature){roListVisibleLimit=60;roListFilterSignature=filterSignature}
  const hiddenAssigned=roListMode==='assigned'?getHiddenAssignedKeys():null;
  const assignedTriageByRo=new Map();
  if(roListMode==='assigned'){
    getSavedTriageMap().forEach(t=>{
      const number=String(t?.roNumber||String(t?.roKey||'').split('::')[0]||'').trim();
      if(!number)return;
      const entries=assignedTriageByRo.get(number)||[];
      entries.push(t);
      assignedTriageByRo.set(number,entries);
    });
  }

  const assignedSource = roListMode==='assigned' ? ros.flatMap(r=>{
    const base=String(r.numero||r.id||r.codigo||'').trim();
    let records=(assignedTriageByRo.get(base)||[]).filter(t=>String(t.decision||'')!=='' && !hiddenAssigned.has(String(t.roKey||'')));
    const confirmed=resolvedTriageForRo(r,getSavedTriageMap());
    if(confirmed?.decision&&confirmed.decision!=='directed')records=[confirmed];
    // Recuperação segura: se SGQ_TRIAGENS estiver vazio/desatualizado, mas a
    // própria R.O. importada ainda trouxer setor causa, ela continua atribuída.
    // Não exige status operacional aqui, pois versões anteriores chegaram a
    // limpar esse campo no cache e isso fazia a lista inteira desaparecer.
    if(!records.length){
      const sheetSector=String(r.setorResponsavelPlanilha||r.raw?.__setorResponsavel||r.setor||'').trim();
      const norm=normalizeAnswer(sheetSector);
      if(sheetSector && !['nao direcionado','nao informado','sem setor','-'].includes(norm)){
        const syntheticKey=triageCompositeKey(base,sheetSector);
        records=[{roKey:syntheticKey,roNumber:base,decision:'directed',responsibleSector:sheetSector,importedFromSheet:true,__synthetic:true}];
      }
    }
    if(!records.length)return [];
    // Uma linha visual por R.O. + setor. Registros legados/duplicados não podem
    // reaparecer como uma segunda linha após atualizar o PDCA.
    const bySector=new Map();
    records.forEach(t=>{
      const sector=String(t.responsibleSector||t.setorDirecionado||'').trim();
      const visualKey=triageCompositeKey(base,sector||'__sem_setor__');
      const prev=bySector.get(visualKey);
      const score=x=>{
        const composite=String(x?.roKey||'').includes('::')?10000000000000:0;
        const ts=Date.parse(x?.pdcaExternalUpdatedAt||x?.updatedAt||x?.triagedAt||x?.createdAt||'')||0;
        return composite+ts;
      };
      if(!prev||score(t)>=score(prev))bySector.set(visualKey,t);
    });
    return [...bySector.values()].map(t=>({...r,__triageKey:t.roKey,__triageRecord:t,__assignedSector:t.responsibleSector||''}));
  }) : ros;
  const list=assignedSource.filter(nucleoManagerScopeAllows)
    .filter(r=>{
      if(roListMode!=='assigned')return canViewRO(r);
      const tri=getRoTriageRecord(r);
      // Uma R.O. é atribuída quando existe uma decisão central OU quando a própria
      // planilha ainda comprova o direcionamento. Isso evita esvaziar esta tela se
      // o cache de SGQ_TRIAGENS ainda não tiver sido restaurado/sincronizado.
      const triStatus=String(tri?.status||tri?.triagemStatus||tri?.decision||'').toLowerCase();
      const sheetSector=String(r.setorResponsavelPlanilha||r.raw?.__setorResponsavel||r.setor||'').trim();
      const validSheetSector=!!sheetSector && !['nao direcionado','nao informado','sem setor','-'].includes(normalizeAnswer(sheetSector));
      const assignedBySheet=validSheetSector;
      const assignedByTriage=!!tri && !['','new','nova','aguardando','aguardando triagem'].includes(triStatus);
      if(!assignedByTriage && !assignedBySheet)return false;
      // ADM vê todo o restante; usuário/gestor continua limitado ao que pode visualizar.
      return isAdmin()?true:canViewRO(r);
    })
    .map(r=>isAdmin()?r:getOperationalRoView(r))
    .filter(r=>{
      if(roListMode==='assigned'){
        const tri=getRoTriageRecord(r);
        const rowSector=String(tri?.responsibleSector||tri?.setorDirecionado||r.setor||'').trim();
        const rowOrigin=String(r.origemBase||r.raw?.__origemBase||'').trim();
        const rowUnit=String(r.unidade||'').trim();
        if(assignedSector!=='all'&&rowSector!==assignedSector)return false;
        if(assignedOrigin!=='all'&&rowOrigin!==assignedOrigin)return false;
        if(assignedUnit!=='all'&&!sameCanonicalUnit(rowUnit,assignedUnit))return false;
      }
      const text=nucleoRoSearchMatches(r,q);
      const displayStatus=assignedRoStatus(r);
      const statusKey={'Pendente':'pendente','PDCA externo':'pdca_externo','PDCA respondido':'pdca_respondido','PDCA apresentado':'pdca_apresentado','Cancelada':'cancelada','Registro':'registro','Obsoleto':'obsoleto'}[displayStatus]||'pendente';
      const filt=f==='todas'||f===statusKey;
      return text&&filt;
    });

  // Mantém busca e totais sobre a lista completa, mas cria apenas 60 linhas no DOM.
  rowsEl.innerHTML=list.slice(0,roListVisibleLimit).map(r=>{
    const status=String(r.status||'');
    const pdca=String(r.pdca||'');
    const noPdca=['Cancelada','Somente para registro'].includes(status);
    const contest=status==='Em contestação';
    const externalPdca=pdcaExternalExists(r);
    const alreadySent=pdca==='Enviado' || status==='PDCA enviado' || externalPdca;
    const tri=getRoTriageRecord(r);
    const responsibleSector=String(tri?.responsibleSector||tri?.setorDirecionado||r.__assignedSector||r.setorResponsavelPlanilha||r.raw?.__setorResponsavel||r.setorResponsavel||r.setor||'—').trim()||'—';
    const pdcaSituation=pdcaSituationLabel(r);
    const displayStatus=assignedRoStatus(r);
    const displayDecisionLabel=nucleoAssignedDecisionLabel(r,tri,displayStatus);

    let operationalActions='';
    if(!admin){
      const respondDisabled=noPdca||contest||alreadySent;
      const contestDisabled=noPdca||contest;

      operationalActions=`
        <td class="operational-action-col">
          <div style="display:flex;gap:6px;flex-wrap:wrap;min-width:230px">
            <button class="btn primary" type="button"
              ${respondDisabled?'disabled':''}
              onclick="startPdcaFromList('${escapeHtml(r.numero)}')">
              ${alreadySent?'PDCA enviado':pdcaActionLabel(r.numero)}
            </button>
            ${(!alreadySent&&isPdcaStarted(r.numero))?'<span class="status-badge pending" style="align-self:center">Rascunho iniciado</span>':''}
            <button class="btn secondary" type="button"
              ${contestDisabled?'disabled':''}
              onclick="contestRoFromList('${escapeHtml(r.numero)}')">
              ${contest?'Em contestação':'Contestar'}
            </button>
          </div>
        </td>`;
    }else{
      operationalActions='<td class="operational-action-col" style="display:none"></td>';
    }

    const statusControl = admin && !noPdca && displayStatus==='Pendente'
      ? `<div class="pdca-source-control"><span class="badge warn">Pendente</span><button class="btn secondary" type="button" onclick="setExternalPdca('${escapeHtml(r.numero)}',true,'${escapeHtml(responsibleSector)}')">✓ Temos PDCA</button></div>`
      : `<span class="${displayStatus==='PDCA externo'||displayStatus==='PDCA respondido'||displayStatus==='PDCA apresentado'?'badge ok':displayStatus==='Pendente'?'badge warn':badgeClass(displayStatus)}">${escapeHtml(displayDecisionLabel)}</span>`;

    return `<tr>
      <td><button type="button" class="ro-link-btn" onclick="openRO('${escapeHtml(r.numero)}')"><b>${escapeHtml(r.numero)}</b></button>${isArchivedRo(r.numero)?'<div class="small">Arquivada</div>':''}</td>
      <td>${escapeHtml(r.unidade||'')}</td>
      <td>${escapeHtml(responsibleSector)}</td>
      <td><span class="status-badge">${escapeHtml(r.origemBase||'')}</span></td>
      <td>${escapeHtml(assignedRoDeadline(r))}</td>
      <td>${statusControl}</td>
      <td class="ro-eye-cell"><div class="ro-row-actions"><button class="ro-eye-btn" type="button" onclick="openRoReport('${escapeHtml(r.numero)}')" title="Visualizar R.O." aria-label="Visualizar R.O. ${escapeHtml(r.numero)}">👁</button>${admin&&tri?.roKey?`<button class="ro-eye-btn ro-edit-btn" type="button" onclick="openAssignedSectorEdit('${escapeHtml(tri.roKey)}')" title="Editar setor causa" aria-label="Editar setor causa">✎</button><button class="ro-eye-btn ro-delete-btn" type="button" onclick="deleteAssignedDirection('${escapeHtml(tri.roKey)}')" title="Excluir este direcionamento" aria-label="Excluir este direcionamento">🗑</button>`:''}</div></td>
      ${operationalActions}
    </tr>`;
  }).join('');
  const more=document.getElementById('roListMore');
  if(more)more.innerHTML=list.length>roListVisibleLimit
    ? `Mostrando ${roListVisibleLimit} de ${list.length} R.O.s · <button class="btn secondary" type="button" onclick="showMoreRos()">Mostrar mais 60</button>`
    : (list.length?`Mostrando ${list.length} R.O.s`:'');

  // A coluna "Ações" é exclusiva da visão operacional.
  document.querySelectorAll('.operational-action-col').forEach(el=>{
    el.style.display=admin?'none':'';
  });
}

async function deleteAssignedDirection(triageKey){
  if(!nucleoFeatureRequire('ros','triage'))return;
  if(!isAdmin()){alert('Somente o SGQ pode remover duplicatas da visualização.');return;}
  const key=String(triageKey||'').trim();
  if(!key)return;
  const map=getSavedTriageMap();
  const tri=map.get(key);
  if(!tri){alert('Este direcionamento não foi encontrado. Sincronize e tente novamente.');return;}
  const ro=triageRoNumberPart(key);
  const sector=String(tri.responsibleSector||tri.setorDirecionado||'').trim();
  if(!confirm(`Ocultar esta linha duplicada em R.O.s atribuídas?\n\n${ro}${sector?' • '+sector:''}\n\nNenhum direcionamento, setor ou dado da planilha será apagado.`))return;
  try{
    await withNucleoLoading('Removendo somente a duplicata da visualização...',async()=>{
      // Esta ação é EXCLUSIVAMENTE visual. Não apaga SGQ_TRIAGENS e não altera
      // a planilha original. O direcionamento continua existindo e a R.O. segue triada.
      const hidden=getHiddenAssignedKeys();
      hidden.add(key);
      saveHiddenAssignedKeys(hidden);
      render();
      try{renderCurrentOverview()}catch(e){}
    },'Atualizando visualização');
    alert('Linha removida da visualização. O direcionamento foi preservado.');
  }catch(err){
    console.error('[NUCLEO OCULTAR DUPLICATA]',err);
    alert('Não foi possível remover a duplicata da visualização. '+(err?.message||err||''));
  }
}

function openAssignedSectorEdit(triageKey){
  if(!nucleoFeatureRequire('ros','triage'))return;
  if(!isAdmin()){alert('Somente o SGQ pode editar o setor causa.');return;}
  openTriageRecord(String(triageKey||''));
  setTimeout(()=>{
    const row=document.querySelector('#triageAssignments .triage-assignment-row');
    if(row){row.scrollIntoView({block:'center',behavior:'smooth'});row.querySelector('.triage-assignment-sector')?.focus();}
  },80);
}

function selectRoForOperationalAction(numero){
  const base=ros.find(r=>(r.id||r.codigo||r.numero)===numero || r.numero===numero);
  if(!base || !canViewRO(base)){
    alert('R.O. não encontrada ou indisponível.');
    return null;
  }
  const ro=isAdmin()?base:getOperationalRoView(base);
  selected=ro;
  return ro;
}

function startPdcaFromList(numero){
  if(!nucleoFeatureRequire('pdca','respond'))return;
  const ro=selectRoForOperationalAction(numero);
  if(!ro)return;
  selected=ro;

  if(['Cancelada','Somente para registro'].includes(ro.status)){
    alert('Esta R.O. não exige PDCA.');
    return;
  }
  if(ro.status==='Em contestação'){
    alert('O PDCA está suspenso enquanto a contestação estiver em análise pelo SGQ.');
    return;
  }
  if(ro.pdca==='Enviado' || ro.status==='PDCA enviado'){
    alert('O PDCA desta R.O. já foi enviado.');
    return;
  }

  fillDetail();
  openPDCA();
}

function contestRoFromList(numero){
  const ro=selectRoForOperationalAction(numero);
  if(!ro)return;

  if(['Cancelada','Somente para registro'].includes(ro.status)){
    alert('Esta R.O. está encerrada e não pode ser contestada por este fluxo.');
    return;
  }
  if(ro.status==='Em contestação'){
    alert('Esta R.O. já está em contestação.');
    return;
  }

  try{fillDetail()}catch(e){console.warn('Falha ao preparar detalhes antes da contestação.',e)}
  openContest();
}

function view(id){
  document.body.classList.toggle('triage-wide',id==='triageView');
  const sacModal=document.getElementById('externalRoControlModalOverlay');
  if(sacModal)sacModal.classList.remove('open');
  document.body.style.overflow='';
  ['listView','roListView','adminModuleView','mySubmittedRosView','detailView','pdcaView','sentView','pdcaReportView','pendingHubView','actionsDashboardView','triageView','externalRoControlView','mySacsView','sacTrackingView','contestationsView','sgqIndicatorsView','managementView','pendingActionsView','profileView','announcementsView','settingsView'].forEach(function(x){
    var el=document.getElementById(x);
    if(el) el.classList.add('hidden');
  });
  var target=document.getElementById(id);
  if(target) target.classList.remove('hidden');
}function openRO(n){
  detailReturnView='ros';
  const returnPanel=document.getElementById('complainantReturnPanel');
  if(returnPanel)returnPanel.classList.add('hidden');
  if(pdcaBtn)pdcaBtn.style.display='';
  if(contestBtn)contestBtn.style.display='';
  setTimeout(refreshRoPdfAccess,0);
  const __ro=ros.find(r=>(r.id||r.codigo||r.numero)===n || r.numero===n);
  if(!__ro || !canViewRO(__ro)){alert('R.O. não encontrada ou indisponível.');showList();return;}
  selected=isAdmin()?syncContestStateToRo(__ro):getOperationalRoView(__ro);
  fillDetail();
  view('detailView');
  setTimeout(refreshRoPdfAccess,0);
  setNav('ros');
}function fillDetail(){
  document.getElementById('submittedRoDecisionInfo')?.remove();dNumero.textContent=selected.numero;dCliente.textContent=selected.cliente;dStatus.textContent=selected.status;dStatus.className=badgeClass(selected.status);dUnidade.textContent=selected.unidade;dSetor.textContent=selected.setor;dData.textContent=selected.data;dPrazo.textContent=selected.prazo;dDescricao.textContent=selected.descricao;const noPDCA=['Cancelada','Somente para registro'].includes(selected.status),contest=selected.status==='Em contestação';pdcaBtn.disabled=noPDCA||contest;contestBtn.disabled=noPDCA||contest;if(pdcaBtn&&!noPDCA&&!contest){const roKey=selected.numero||selected.id||selected.codigo||'';pdcaBtn.textContent=isPdcaStarted(roKey)?'Continuar a responder o PDCA':'Responder o PDCA';}dNotice.classList.toggle('hidden',!(noPDCA||contest));dNotice.textContent=contest?'O PDCA está suspenso enquanto a contestação estiver em análise pelo SGQ.':noPDCA?'Esta R.O. não exige PDCA.':'';refreshContestUserStatus();refreshFavoriteButton();renderRoTimeline();renderRoIntelligence()}
function roSummaryData(){
  const source=(typeof ROs!=='undefined' ? ROs : (typeof ros!=='undefined' ? ros : []));
  const visibleRos=source
    .filter(ro=>canViewRO(ro))
    .map(ro=>isAdmin()?ro:getOperationalRoView(ro));

  const sent=getSentPdcas().filter(p=>isAdmin() || sameSector(p.setor));
  const byRo=new Map();
  sent.forEach(p=>{
    const key=String(p.ro||p.roId||'').trim();
    if(key)byRo.set(key,p);
  });

  const triageMap=getSavedTriageMap();
  let pending=0,noPresentation=0,openActions=0,overdue=0;
  const now=new Date();

  visibleRos.forEach(ro=>{
    const roKey=String(ro.numero||ro.id||ro.codigo||'').trim();
    const tri=triageMap.get(roKey)||{};
    const decision=String(tri.decision||'').trim();

    // Antes da triagem, o SGQ ainda não definiu a obrigação de PDCA.
    // Depois da triagem, somente "directed" exige PDCA.
    let pdcaRequired=false;
    if(decision){
      pdcaRequired=decision==='directed' && tri.pdcaRequired!==false;
    }else if(!isAdmin()){
      const status=String(ro.status||'').toLowerCase();
      pdcaRequired=!status.includes('cancel')&&!status.includes('somente para registro')&&!status.includes('apenas registro');
    }
    if(!pdcaRequired)return;

    const p=byRo.get(roKey);
    if(!p){
      pending++;
      const roDeadline=parseBrDate(tri.pdcaDeadline||ro.prazo||ro.dataLimite||'');
      if(roDeadline&&roDeadline<now)overdue++;
      return;
    }

    const pStatus=pdcaStatusLabel(p);
    if(pStatus==='Pendente')pending++;
    if(!p.apresentadoEm&&pStatus!=='Pendente')noPresentation++;

    allPdcaActionsForRecord(p).forEach(a=>{
      const pseudo={...p,answers:{...(p.answers||{}),p11:a.action,p12:a.deadline,p13:a.owner},acaoConferidaEm:a.completedAt||a.acaoConferidaEm};
      const actionState=inferActionStatus(pseudo);
      if(actionState.code!=='done')openActions++;
    });

    const a=p.answers||{};
    const pdcaDeadline=parseBrDate(tri.pdcaDeadline||p.prazo||p.dataLimite||a.p9||ro.prazo||'');
    if(pdcaDeadline&&pdcaDeadline<now&&pStatus==='Pendente')overdue++;
  });

  return {pending,noPresentation,openActions,overdue};
}
function refreshRoSummary(){
  const ids=['roSummaryPending','roSummaryNoPresentation','roSummaryOpenActions','roSummaryOverdue'];
  if(!ids.every(id=>document.getElementById(id)))return;
  const s=roSummaryData();
  document.getElementById('roSummaryPending').textContent=s.pending;
  document.getElementById('roSummaryNoPresentation').textContent=s.noPresentation;
  document.getElementById('roSummaryOpenActions').textContent=s.openActions;
  document.getElementById('roSummaryOverdue').textContent=s.overdue;
}


function refreshRoleNavigationLabels(){
  try{enforceAdminVisibility()}catch(e){}
  try{refreshRoRegistrationAccess()}catch(e){}
  try{refreshDocumentRequestAccess()}catch(e){}
  const sent=document.querySelector('#navSent b');
  if(sent) sent.textContent=isAdmin()?'PDCAs recebidos':'PDCAs enviados';
  const ros=document.querySelector('#navRos b');
  if(ros) ros.textContent='Visão geral';
}
function refreshMainRoTitle(){
  const title=document.getElementById('mainRoTitle');
  if(!title)return;
  title.textContent=isAdmin()?'Visão geral':'Minhas R.O.s';
}

function normalizePersonName(value){
  return String(value||'')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/\s+/g,' ')
    .trim()
    .toLowerCase();
}

function roRegistrantName(ro){
  if(String(ro?.registrante||'').trim())return String(ro.registrante).trim();
  const raw=ro?.raw||{};
  return String(firstValue(raw,[
    'Nome e Sobrenome (responsável pelo registro deste formulário):',
    'Nome e Sobrenome (responsável pelo registro deste formulário)',
    'Responsável pelo registro',
    'Responsavel pelo registro'
  ])||'').trim();
}

function splitPersonNameDescription(value,description){
  let name=String(value||'').trim(),extras=[];
  const par=name.match(/\s*\(([^()]*)\)\s*$/);if(par){extras.push(par[1].trim());name=name.slice(0,par.index).trim();}
  const dash=name.match(/\s+[-–—]\s+/);if(dash){extras.unshift(name.slice(dash.index+dash[0].length).trim());name=name.slice(0,dash.index).trim();}
  return {name,description:description===undefined?extras.filter(Boolean).join(' — '):String(description||'').trim()};
}
function personDisplayName(u){const p=splitPersonNameDescription(u.name,u.description);return p.name+(p.description?' ('+p.description+')':'');}
function personNameKey(v){return normalizePersonName(splitPersonNameDescription(v).name);}
function claimantRoKey(ro){return String(ro.numero||ro.id||ro.codigo||'').trim().toUpperCase();}
let claimantIdentityCache=null;
function claimantIdentityIndex(){
  if(claimantIdentityCache)return claimantIdentityCache;
  let users=[],bindings=[];try{users=JSON.parse(localStorage.getItem(USERS_KEY)||'[]');bindings=JSON.parse(localStorage.getItem('nucleo-claimant-bindings-v1')||'[]');}catch(_){}
  users=users.filter(u=>String(u.approvalStatus||'approved')==='approved'&&!isDeletedUserRecord(u));
  const names=new Map();users.forEach(u=>{new Set([u.name].concat(u.aliases||[]).map(personNameKey).filter(Boolean)).forEach(k=>{if(!names.has(k))names.set(k,[]);names.get(k).push(u);});});
  return claimantIdentityCache={users,names,bindings:new Map(bindings.map(b=>[b.id,b]))};
}
function resolveRoClaimant(ro){
  const name=personNameKey(roRegistrantName(ro));if(!name)return null;
  const users=claimantIdentityIndex().users;
  const saved=claimantIdentityIndex().bindings.get(claimantRoKey(ro));
  const binding=saved&&personNameKey(saved.registrant)===name?saved:null;
  if(binding)return users.find(u=>u.personId&&u.personId===binding.personId)||null;
  const matches=(claimantIdentityIndex().names.get(name)||[]).filter(u=>!roUnit(ro)||normalizePortalUnit(u.unit)==='todas'||normalizePortalUnit(u.unit)===roUnit(ro));
  return matches.length===1?matches[0]:null;
}
function wasRoSubmittedByCurrentUser(ro){
  if(isAdmin()||!ro)return false;
  const user=resolveRoClaimant(ro),session=getSession()||{};if(!user)return false;
  if(session.personId&&user.personId)return session.personId===user.personId;
  return !!session.email&&String(session.email).trim().toLowerCase()===String(user.email||'').trim().toLowerCase();
}


function getPdcaReturnForRo(ro){
  const key=String(ro?.numero||ro?.id||ro?.codigo||'').trim();
  if(!key)return null;
  const sector=ro.__assignedSector||ro.__triageRecord?.responsibleSector||'';
  return getAllSentPdcas().find(p=>String(p.ro||p.roId||p.numeroRo||'').trim()===key&&(!sector||normalizeAnswer(p.setor||'')===normalizeAnswer(sector)))||null;
}

function complainantActionState(p){
  if(!p)return {code:'waiting',label:'Aguardando retorno',reason:'O PDCA ainda não foi recebido.'};

  const base=inferActionStatus(p);
  if(base.code==='done'){
    return {code:'finalized',label:'Finalizada',reason:'A conclusão da ação foi conferida pelo SGQ.'};
  }
  if(base.code==='review'){
    return {code:'completed',label:'Concluída',reason:'O PDCA indica conclusão da ação e aguarda conferência final do SGQ.'};
  }
  if(base.code==='overdue'){
    return {code:'progress',label:'Em andamento',reason:'A ação ainda não foi finalizada e o prazo informado já venceu.'};
  }
  return {code:'progress',label:'Em andamento',reason:'A ação está sendo acompanhada pelo setor responsável.'};
}

function complainantReturnState(ro){
  const p=getPdcaReturnForRo(ro);
  if(!p){
    return {pdca:null,returnLabel:'Aguardando retorno',action:complainantActionState(null)};
  }
  return {pdca:p,returnLabel:'Retorno disponível',action:complainantActionState(p)};
}

function refreshComplainantReturnPanel(ro){
  const panel=document.getElementById('complainantReturnPanel');
  if(!panel)return;

  if(detailReturnView!=='mysubmitted' || !ro || !wasRoSubmittedByCurrentUser(ro) || submittedRoRowClass(ro)){
    panel.classList.add('hidden');
    return;
  }

  panel.classList.remove('hidden');
  const sac=findExternalRoControlByRo(ro.numero||ro.id||ro.codigo||'');
  const state=complainantReturnState(ro);
  if(sac){
    const lastDeadlineChange=Array.isArray(sac.deadlineHistory)&&sac.deadlineHistory.length?sac.deadlineHistory[sac.deadlineHistory.length-1]:null;
    const sacText='SAC: '+externalTreatmentLabel(sac.treatmentType)+' · '+externalTreatmentStatusLabel(sac.treatmentStatus)+(sac.treatmentDeadline?' · prazo vigente '+formatDateBR(sac.treatmentDeadline):'')+(lastDeadlineChange?.reason?' · última atualização: '+lastDeadlineChange.reason:'');
    const existing=document.getElementById('complainantSacTracking');
    if(existing){existing.textContent=sacText;existing.classList.remove('hidden')}
    else{
      const line=document.createElement('div');
      line.id='complainantSacTracking';
      line.className='meta-box';
      line.style.marginBottom='12px';
      line.textContent=sacText;
      panel.prepend(line);
    }
  }else{
    document.getElementById('complainantSacTracking')?.classList.add('hidden');
  }
  const badge=document.getElementById('complainantReturnBadge');
  const noPdca=document.getElementById('complainantNoPdca');
  const available=document.getElementById('complainantPdcaAvailable');

  if(!state.pdca){
    badge.textContent='Aguardando retorno';
    badge.className='status-badge pending';
    noPdca.classList.remove('hidden');
    available.classList.add('hidden');
    return;
  }

  badge.textContent='Retorno disponível';
  badge.className='status-badge answered';
  noPdca.classList.add('hidden');
  available.classList.remove('hidden');

  const p=state.pdca;
  const a=p.answers||{};
  const meta=document.getElementById('complainantPdcaMeta');
  if(meta)meta.textContent=(p.id||'PDCA')+' · enviado por '+(p.setor||'setor responsável')+(p.envio?' em '+p.envio:'');

  const btn=document.getElementById('complainantViewPdcaBtn');
  if(btn)btn.onclick=()=>openPdcaReport(p.id);

  const action=state.action;
  const actionText=document.getElementById('complainantActionText');
  const actionOwner=document.getElementById('complainantActionOwner');
  const actionDeadline=document.getElementById('complainantActionDeadline');
  const actionReason=document.getElementById('complainantActionReason');
  const actionBadge=document.getElementById('complainantActionBadge');

  if(actionText)actionText.textContent=a.p11||'Nenhuma ação informada.';
  if(actionOwner)actionOwner.textContent=a.p13||p.responsavel||'—';
  if(actionDeadline)actionDeadline.textContent=a.p12||'—';
  if(actionReason)actionReason.textContent=action.reason;

  if(actionBadge){
    actionBadge.textContent=action.label;
    actionBadge.className='status-badge '+(action.code==='finalized'?'answered':action.code==='completed'?'answered':'pending');
  }
}

function getSubmittedRoTrackingState(ro){
  const tri=getRoTriageRecord(ro);
  const contest=getContestRecord(ro.numero||ro.id||ro.codigo);
  const ret=complainantReturnState(ro);
  const sent=ret.pdca;

  if(contest?.status==='pending'){
    return {code:'contest',label:'Em contestação',sector:tri?.responsibleSector||'',pdca:'Suspenso',returnState:ret};
  }
  if(contest?.status==='accepted'){
    return {code:'done',label:'Encerrada após contestação',sector:tri?.responsibleSector||'',pdca:'Não se aplica',returnState:ret};
  }
  if(tri?.decision==='obsolete'){
    return {code:'done',label:'Obsoleta',sector:tri?.decisionSector||tri?.responsibleSector||'',pdca:'Não se aplica',returnState:ret};
  }
  if(tri?.decision==='cancelled'){
    return {code:'done',label:'Cancelada pelo SGQ',sector:tri?.decisionSector||tri?.responsibleSector||'',pdca:'Não se aplica',returnState:ret};
  }
  if(tri?.decision==='record'){
    return {code:'done',label:'Somente para registro',sector:tri?.decisionSector||tri?.responsibleSector||'',pdca:'Não se aplica',returnState:ret};
  }
  if(tri?.decision==='directed'){
    if(sent){
      const action=ret.action;
      if(action.code==='finalized'){
        return {code:'done',label:'Tratativa finalizada',sector:tri.responsibleSector||'',pdca:'Retorno disponível',returnState:ret};
      }
      return {code:'directed',label:'Retorno recebido',sector:tri.responsibleSector||'',pdca:'Retorno disponível',returnState:ret};
    }
    return {code:'directed',label:'Em tratativa',sector:tri.responsibleSector||'',pdca:'Aguardando retorno',returnState:ret};
  }
  return {code:'triage',label:'Aguardando triagem do SGQ',sector:'',pdca:'Aguardando retorno',returnState:ret};
}

function getMySubmittedRos(){
  return getAllRoRecords()
    .filter(ro=>isAdmin()&&getSession()?.permissions?.detailVersion!==1 ? true : (wasRoSubmittedByCurrentUser(ro) && sameUnitAsCurrentUser(ro)))
    .map(ro=>({ro,state:getSubmittedRoTrackingState(ro)}));
}

function returnFromRoDetail(){
  if(detailReturnView==='mysubmitted')showMySubmittedRos();
  else showList();
}

function showMySubmittedRos(){
  if(!nucleoFeatureRequire('ros','submitted'))return;
  if(isAdmin()&&getSession()?.permissions?.detailVersion!==1){showList();return}
  view('mySubmittedRosView');
  setNav('mysubmitted');
  renderMySubmittedRos();
}

function submittedRoRowClass(ro){
 const decision=getRoTriageRecord(ro)?.decision;
 return decision==='cancelled'?'submitted-ro-cancelled':decision==='record'?'submitted-ro-record':decision==='obsolete'?'submitted-ro-obsolete':'';
}
function renderMySubmittedRos(){
  if(isAdmin())return;

  const q=normalizeAnswer(document.getElementById('mySubmittedSearch')?.value||'');
  const filter=document.getElementById('mySubmittedStatusFilter')?.value||'all';
  const all=getMySubmittedRos();

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

  let rowsData=all.filter(x=>{
    if(filter!=='all'&&x.state.code!==filter)return false;
    if(q){
      const r=x.ro;
      const hay=normalizeAnswer([r.numero,r.cliente,r.assunto,r.tipoRO,r.descricao,x.state.label,x.state.sector].join(' '));
      if(!hay.includes(q))return false;
    }
    return true;
  });

  const body=document.getElementById('mySubmittedRows');
  if(!body)return;

  body.innerHTML=rowsData.length?rowsData.map(({ro,state})=>`
    <tr style="background:${escapeHtml(nucleoDecisionForRecord(ro,getRoTriageRecord(ro))?.color||'')}" class="${submittedRoRowClass(ro)}">
      <td><b>${escapeHtml(ro.numero||'-')}</b></td>
      <td>${escapeHtml(ro.data||'-')}</td>
      <td>${escapeHtml(ro.cliente||'-')}</td>
      <td>${escapeHtml(ro.assunto||ro.tipoRO||'-')}</td>
      <td><span class="status-badge ${submittedRoRowClass(ro)?'submitted-ro-terminal-badge':state.code==='done'?'answered':state.code==='contest'?'pending':''}">${escapeHtml(state.label)}</span></td>
      <td>${escapeHtml(state.sector||(submittedRoRowClass(ro)?'—':'Aguardando definição'))}</td>
      <td>
        ${!submittedRoRowClass(ro)?`<button class="btn secondary" type="button" onclick="openMyRoResponses('${escapeHtml(ro.numero||'')}')">Respostas</button>`:''}
        ${submittedRoRowClass(ro)?'<span class="small">—</span>':state.returnState?.pdca
          ? `<button class="btn primary" type="button" onclick="openComplainantPdcaReturn('${escapeHtml(ro.numero||'')}')">Ver retorno</button>`
          : `<span class="status-badge pending">Aguardando retorno</span>`}
      </td>
      <td>
        ${submittedRoRowClass(ro)?'<span class="small">—</span>':state.returnState?.pdca
          ? `<span class="status-badge ${state.returnState.action.code==='finalized'||state.returnState.action.code==='completed'?'answered':'pending'}">${escapeHtml(state.returnState.action.label)}</span>
             <div class="small" style="margin-top:4px">${escapeHtml((state.returnState.pdca.answers||{}).p12?'Prazo: '+(state.returnState.pdca.answers||{}).p12:'')}</div>`
          : '<span class="small">Ainda sem ação informada</span>'}
      </td>
      <td><button class="btn secondary" type="button" onclick="openSubmittedRoTracking('${escapeHtml(ro.numero||'')}')">Acompanhar</button></td>
    </tr>`).join('')
    : `<tr><td colspan="9" style="text-align:center;padding:28px;color:#667085">
        Nenhuma R.O. cadastrada por ${escapeHtml(getSession()?.name||'este usuário')} foi encontrada na base sincronizada.
      </td></tr>`;
}

function openComplainantPdcaReturn(numero){
  const ro=getAllRoRecords().find(r=>String(r.numero||r.id||r.codigo)===String(numero));
  if(!ro || !wasRoSubmittedByCurrentUser(ro)){
    alert('R.O. não encontrada ou indisponível.');
    return;
  }
  const p=getPdcaReturnForRo(ro);
  if(!p){
    alert('O retorno em PDCA ainda não foi disponibilizado.');
    return;
  }
  if(p.externalPdf){return openMyRoResponses(numero);}
  openPdcaReport(p.id);
}

function openSubmittedRoTracking(numero){
  detailReturnView='mysubmitted';
  const ro=getAllRoRecords().find(r=>String(r.numero||r.id||r.codigo)===String(numero));
  if(!ro||!wasRoSubmittedByCurrentUser(ro)){
    alert('R.O. não encontrada ou indisponível.');
    return;
  }

  // The creator may follow the original R.O. even if another sector owns the treatment.
  selected={...ro};
  const state=getSubmittedRoTrackingState(ro);
  selected.status=state.label;
  selected.pdca=state.pdca;
  selected.setor=state.sector||(submittedRoRowClass(ro)?'Sem setor atribuído':'Aguardando definição');
  fillDetail();
  document.getElementById('submittedRoDecisionInfo')?.remove();
  const terminal=submittedRoRowClass(ro);
  if(terminal){
    const tri=getRoTriageRecord(ro)||{},box=document.createElement('section');box.id='submittedRoDecisionInfo';box.className='card';box.style.cssText='padding:16px;margin:12px 0;background:'+(terminal==='submitted-ro-record'?'#fff9e5':terminal==='submitted-ro-cancelled'?'#fff0f0':'#f0f1f3');
    box.innerHTML='<h3>'+escapeHtml(state.label)+'</h3><p><b>Setor responsável:</b> '+escapeHtml(state.sector||'Sem setor atribuído')+'</p><p><b>Motivo do SGQ:</b> '+escapeHtml(tri.note||'Motivo não registrado nesta ocorrência.')+'</p>'+(tri.triagedBy?'<p class="small">Decisão registrada por '+escapeHtml(tri.triagedBy)+'</p>':'');
    document.getElementById('detailView')?.prepend(box);
  }
  refreshComplainantReturnPanel(ro);

  // Tracking is read-only when the current user's sector is not the responsible sector.
  const canTreat=canViewRO(ro);
  if(pdcaBtn)pdcaBtn.style.display=canTreat?'':'none';
  if(contestBtn)contestBtn.style.display=canTreat?'':'none';

  view('detailView');
  setNav('mysubmitted');
}


function overviewSafe(fn,fallback){
  try{return fn()}catch(e){console.warn('Overview:',e);return fallback}
}
function overviewEsc(v){return escapeHtml(String(v??''))}
function overviewKpi(value,label,tone,action,labelAction){
  const click=action?` onclick="${action}" role="button" tabindex="0"`:'';
  return `<div class="overview-kpi ${tone||''}"${click}>
    <b>${overviewEsc(value)}</b><span>${overviewEsc(label)}</span>
    ${action?`<small>${overviewEsc(labelAction||'Abrir')} →</small>`:''}
  </div>`;
}
function overviewPriority(title,detail,action,tone){
  return `<button class="overview-priority ${tone||''}" type="button" ${action?`onclick="${action}"`:''}>
    <span class="overview-priority-dot"></span>
    <span class="overview-priority-copy"><b>${overviewEsc(title)}</b><small>${overviewEsc(detail)}</small></span>
    <span class="overview-priority-arrow">›</span>
  </button>`;
}
function overviewQuick(label,detail,action){
  return `<button class="overview-quick" type="button" onclick="${action}">
    <span><b>${overviewEsc(label)}</b><small>${overviewEsc(detail)}</small></span><span>›</span>
  </button>`;
}
function overviewMySubmittedWaiting(){
  return getMySubmittedRos().filter(x=>x.state.code==='triage').length;
}
function overviewOpenMyDocumentRequests(){
  const me=normalizeAnswer(getSession()?.name||'');
  return getAdminModuleRecords().filter(r=>
    r.module==='documents' &&
    normalizeAnswer(r.createdBy||'')===me &&
    !['done','cancelled'].includes(String(r.status||''))
  ).length;
}
function overviewUserData(){
  const summary=overviewSafe(()=>roSummaryData(),{pending:0,noPresentation:0,openActions:0,overdue:0});
  const actions=overviewSafe(()=>userSectorPendingActions(),[]);
  const overdueActions=actions.filter(x=>x?.status?.code==='overdue').length;
  const submittedWaiting=overviewSafe(()=>overviewMySubmittedWaiting(),0);
  const mySacs=overviewSafe(()=>getMySacs(),[]);
  const activeSacs=mySacs.filter(r=>String(r.treatmentStatus||'')!=='done').length;
  const docs=overviewSafe(()=>overviewOpenMyDocumentRequests(),0);
  return {summary,actions,overdueActions,submittedWaiting,activeSacs,docs};
}
function overviewAdminData(){
  const triageMap=overviewSafe(()=>getSavedTriageMap(),new Map());
  const allRos=overviewSafe(()=>getAllRoRecords(),[]);
  // Use a mesma regra da tela de Triagem. A mesma R.O. pode ter chave técnica
  // RO::Setor; procurar apenas pela chave base fazia uma R.O. já atribuída
  // também ser contada como "aguardando triagem".
  const triagePending=overviewSafe(()=>getTriageRecords().filter(r=>r.triagemStatus==='new').length,0);
  const contests=overviewSafe(()=>getContestations().filter(c=>c.status==='pending'),[]);
  const pendingActions=overviewSafe(()=>pendingActionItems(),[]);
  const actionReview=pendingActions.filter(x=>['review','overdue'].includes(x?.status?.code)).length;
  const sacs=overviewSafe(()=>getExternalRoControls(),[]);
  const sacToClassify=sacs.filter(r=>!sacIsClassified(r)).length;
  const registrations=overviewSafe(()=>pendingRegistrationItems(),[]);
  const docs=overviewSafe(()=>getAdminModuleRecords().filter(r=>r.module==='documents'&&!['done','cancelled'].includes(String(r.status||''))),[]);
  const summary=overviewSafe(()=>roSummaryData(),{pending:0,noPresentation:0,openActions:0,overdue:0});
  return {triagePending,contests,pendingActions,actionReview,sacToClassify,registrations,docs,summary};
}

const OVERVIEW_QUICK_LINKS_KEY='nucleo-overview-quick-links-v1';
let quickLinksDraft=[];

function overviewQuickUserKey(){
  const s=getSession()||{};
  return String(s.email||((s.name||'usuario')+'|'+(s.sector||''))).trim().toLowerCase();
}
function overviewQuickCatalog(){
  const items=[
    {id:'assigned',label:'R.O.s atribuídas',detail:'Ocorrências para sua atuação',action:'showAssignedRos()',allowed:()=>true},
    {id:'submitted',label:'R.O.s cadastradas por mim',detail:'Acompanhar registros que você abriu',action:'showMySubmittedRos()',allowed:()=>!isAdmin()},
    {id:'actions',label:'Ações',detail:'Prazos e responsabilidades',action:'showActionsDashboard()',allowed:()=>true},
    {id:'pending',label:'Pendências',detail:'Sua central de acompanhamento',action:'showPendingHub()',allowed:()=>true},
    {id:'documents',label:'Solicitação de Documentos',detail:'Pedir ou acompanhar documentos',action:"showAdminOperationalModule('documents')",allowed:()=>canRequestDocuments()},
    {id:'mysacs',label:'Meus SACs',detail:'Reclamações em que você é representante',action:'showMySacs()',allowed:()=>!isAdmin()&&overviewSafe(()=>isRepresentativeSacAccess(),false)},
    {id:'triage',label:'Triagem de R.O.s',detail:'Classificar e direcionar ocorrências',action:'showTriage()',allowed:()=>isAdmin()},
    {id:'saccontrol',label:'Controle de SAC',detail:'Classificação e encaminhamento',action:'showExternalRoControl()',allowed:()=>isAdmin()},
    {id:'pendingactions',label:'Ações pendentes',detail:'Conferência e acompanhamento do SGQ',action:'showPendingActions()',allowed:()=>isAdmin()},
    {id:'contests',label:'Contestações',detail:'Analisar solicitações',action:'showContestations()',allowed:()=>isAdmin()},
    {id:'equipment',label:'Equipamentos e metrologia',detail:'Ativos, calibrações e histórico',action:"showAdminOperationalModule('equipment')",allowed:()=>isAdmin()},
    {id:'training',label:'Treinamentos e competências',detail:'Treinamentos e reciclagens',action:"showAdminOperationalModule('training')",allowed:()=>isAdmin()},
    {id:'nccapa',label:'Não conformidades e CAPA',detail:'Relatórios e ações',action:"showAdminOperationalModule('nccapa')",allowed:()=>isAdmin()},
    {id:'processes',label:'Gestão de processos',detail:'IT, GSP, POP, LPP e documentos internos',action:"showAdminOperationalModule('processes')",allowed:()=>isAdmin()},
    {id:'indicators',label:'Indicadores SGQ',detail:'Visão consolidada',action:'showSgqIndicators()',allowed:()=>isAdmin()},
    {id:'announcements',label:'Comunicados',detail:'Avisos gerais do SGQ',action:'showAnnouncementsAdmin()',allowed:()=>isAdmin()},
    {id:'profile',label:'Meu perfil',detail:'Dados da conta e senha',action:'showProfile()',allowed:()=>true}
  ];
  return items.filter(x=>overviewSafe(()=>x.allowed(),false));
}
function defaultOverviewQuickLinkIds(){
  return isAdmin()
    ? ['triage','saccontrol','pendingactions','contests','documents','indicators']
    : ['assigned','submitted','actions','pending','documents','profile'];
}
function getOverviewQuickLinkIds(){
  let state={};
  try{state=JSON.parse(localStorage.getItem(OVERVIEW_QUICK_LINKS_KEY)||'{}')||{}}catch(e){}
  const key=overviewQuickUserKey();
  const allowedIds=new Set(overviewQuickCatalog().map(x=>x.id));
  const saved=Array.isArray(state[key])?state[key].filter(id=>allowedIds.has(id)):[];
  return saved.length?saved:defaultOverviewQuickLinkIds().filter(id=>allowedIds.has(id));
}
function setOverviewQuickLinkIds(ids){
  let state={};
  try{state=JSON.parse(localStorage.getItem(OVERVIEW_QUICK_LINKS_KEY)||'{}')||{}}catch(e){}
  state[overviewQuickUserKey()]=ids;
  localStorage.setItem(OVERVIEW_QUICK_LINKS_KEY,JSON.stringify(state));
}
function renderCustomOverviewQuickLinks(){
  const box=document.getElementById('overviewQuickLinks');if(!box)return;
  const catalog=overviewQuickCatalog();
  const map=new Map(catalog.map(x=>[x.id,x]));
  const ids=getOverviewQuickLinkIds();
  const items=ids.map(id=>map.get(id)).filter(Boolean);
  box.innerHTML=items.length
    ? items.map(x=>overviewQuick(x.label,x.detail,x.action)).join('')
    : `<div class="overview-empty"><b>Nenhum atalho selecionado.</b><span>Clique em Personalizar para escolher seus acessos rápidos.</span></div>`;
}
function openQuickLinksCustomizer(){
  quickLinksDraft=[...getOverviewQuickLinkIds()];
  renderQuickLinksCustomizer();
  document.getElementById('quickLinksCustomizerOverlay')?.classList.add('open');
  document.body.style.overflow='hidden';
}
function closeQuickLinksCustomizer(){
  document.getElementById('quickLinksCustomizerOverlay')?.classList.remove('open');
  document.body.style.overflow='';
}
function renderQuickLinksCustomizer(){
  const box=document.getElementById('quickLinksCustomizerList');if(!box)return;
  const catalog=overviewQuickCatalog();
  const selected=new Set(quickLinksDraft);
  const ordered=[
    ...quickLinksDraft.map(id=>catalog.find(x=>x.id===id)).filter(Boolean),
    ...catalog.filter(x=>!selected.has(x.id))
  ];
  box.innerHTML=ordered.map((x)=>{
    const on=selected.has(x.id);
    const pos=quickLinksDraft.indexOf(x.id);
    return `<div class="quick-custom-row ${on?'selected':''}">
      <label class="quick-custom-main">
        <input type="checkbox" ${on?'checked':''} onchange="toggleQuickLinkDraft('${x.id}',this.checked)">
        <span><b>${overviewEsc(x.label)}</b><small>${overviewEsc(x.detail)}</small></span>
      </label>
      <div class="quick-custom-order ${on?'':'hidden'}">
        <button type="button" onclick="moveQuickLinkDraft('${x.id}',-1)" ${pos<=0?'disabled':''} title="Subir">↑</button>
        <button type="button" onclick="moveQuickLinkDraft('${x.id}',1)" ${pos<0||pos>=quickLinksDraft.length-1?'disabled':''} title="Descer">↓</button>
      </div>
    </div>`;
  }).join('');
}
function toggleQuickLinkDraft(id,checked){
  quickLinksDraft=quickLinksDraft.filter(x=>x!==id);
  if(checked)quickLinksDraft.push(id);
  renderQuickLinksCustomizer();
}
function moveQuickLinkDraft(id,dir){
  const i=quickLinksDraft.indexOf(id);if(i<0)return;
  const j=i+dir;if(j<0||j>=quickLinksDraft.length)return;
  [quickLinksDraft[i],quickLinksDraft[j]]=[quickLinksDraft[j],quickLinksDraft[i]];
  renderQuickLinksCustomizer();
}
function saveQuickLinksCustomizer(){
  setOverviewQuickLinkIds([...quickLinksDraft]);
  closeQuickLinksCustomizer();
  renderCustomOverviewQuickLinks();
}
function resetQuickLinksCustomizer(){
  quickLinksDraft=defaultOverviewQuickLinkIds().filter(id=>overviewQuickCatalog().some(x=>x.id===id));
  renderQuickLinksCustomizer();
}

function renderUserOverview(){
  const s=getSession()||{};
  const d=overviewUserData();
  const title=document.getElementById('overviewTitle');
  const sub=document.getElementById('overviewSubtitle');
  const eyebrow=document.getElementById('overviewEyebrow');
  if(eyebrow)eyebrow.textContent=isManager()?'MINHA GESTÃO':'MINHA SITUAÇÃO';
  if(title)title.textContent=s.name?`Olá, ${String(s.name).split(' ')[0]}.`:'Sua situação agora';
  if(sub)sub.textContent=isManager()
    ? 'Você acompanha '+(managedSectorsForCurrentUser().join(', ')||'os setores vinculados')+'. Direcionamentos individuais desses setores também aparecem para você.'
    : 'Aqui aparece somente o que está relacionado à sua atuação e o que precisa da sua atenção.';

  const k=document.getElementById('overviewKpis');
  if(k){
    const cards=[
      overviewKpi(d.summary.pending,'PDCAs que aguardam sua resposta',d.summary.overdue?'danger':'','showAssignedRos()','Ver R.O.s'),
      overviewKpi(d.actions.length,'Ações do seu setor',d.overdueActions?'danger':'','showActionsDashboard()','Ver ações'),
      overviewKpi(d.submittedWaiting,'R.O.s que você abriu aguardando triagem',d.submittedWaiting?'warn':'','showMySubmittedRos()','Acompanhar'),
      overviewKpi(d.activeSacs,'SACs em acompanhamento',d.activeSacs?'':'','showMySacs()','Ver SACs')
    ];
    if(canRequestDocuments()){
      cards.push(overviewKpi(d.docs,'Solicitações de documentos abertas','',"showAdminOperationalModule('documents')",'Acompanhar'));
    }
    nucleoRenderKpiChoices(cards,['pdca_pending','sector_actions','submitted','sacs',...(canRequestDocuments()?['documents']:[])]);
  }

  const priorities=[];
  if(d.summary.overdue)priorities.push(overviewPriority(`${d.summary.overdue} PDCA(s) em atraso`,'Há respostas com prazo vencido que dependem do seu setor.','showAssignedRos()','danger'));
  if(d.overdueActions)priorities.push(overviewPriority(`${d.overdueActions} ação(ões) atrasada(s)`,'Ações atribuídas ao seu setor ultrapassaram o prazo.','showActionsDashboard()','danger'));
  if(d.summary.pending)priorities.push(overviewPriority(`${d.summary.pending} PDCA(s) aguardando resposta`,'R.O.s direcionadas ao seu setor ainda precisam de resposta.','showAssignedRos()','warn'));
  if(d.actions.length-d.overdueActions>0)priorities.push(overviewPriority(`${d.actions.length-d.overdueActions} ação(ões) em andamento`,'Existem ações do seu setor ainda não concluídas.','showActionsDashboard()',''));
  if(d.submittedWaiting)priorities.push(overviewPriority(`${d.submittedWaiting} R.O.(s) aguardando triagem`,'Ocorrências registradas por você ainda estão na análise inicial do SGQ.','showMySubmittedRos()',''));
  if(d.activeSacs)priorities.push(overviewPriority(`${d.activeSacs} SAC(s) em acompanhamento`,'Há reclamações vinculadas a você ainda abertas.','showMySacs()',''));
  if(canRequestDocuments()&&d.docs)priorities.push(overviewPriority(`${d.docs} solicitação(ões) de documentos aberta(s)`,'Pedidos enviados ao SGQ ainda estão em atendimento.',"showAdminOperationalModule('documents')",''));

  renderOverviewPriorities(priorities);
  renderCustomOverviewQuickLinks();
}
function renderAdminOverview(){
  const d=overviewAdminData();
  const title=document.getElementById('overviewTitle');
  const sub=document.getElementById('overviewSubtitle');
  const eyebrow=document.getElementById('overviewEyebrow');
  if(eyebrow)eyebrow.textContent='SITUAÇÃO DO SGQ';
  if(title)title.textContent='Situação atual do SGQ';
  if(sub)sub.textContent='Pendências e pontos que exigem atuação administrativa agora. Não é uma listagem de todas as R.O.s.';

  const k=document.getElementById('overviewKpis');
  if(k)nucleoRenderKpiChoices([
    overviewKpi(d.triagePending,'R.O.s aguardando triagem',d.triagePending?'warn':'','showTriage()','Triar'),
    overviewKpi(d.sacToClassify,'SACs aguardando classificação',d.sacToClassify?'warn':'','showExternalRoControl()','Classificar'),
    overviewKpi(d.actionReview,'Ações para atenção do SGQ',d.actionReview?'danger':'','showPendingActions()','Analisar'),
    overviewKpi(d.contests.length,'Contestações pendentes',d.contests.length?'warn':'','showContestations()','Analisar'),
    overviewKpi(d.registrations.length,'Cadastros aguardando aprovação',d.registrations.length?'warn':'','showPendingHub()','Revisar'),
    overviewKpi(d.docs.length,'Solicitações de documentos abertas','',"showAdminOperationalModule('documents')",'Atender')
  ],['triage','sac_classify','action_review','contests','registrations','documents']);

  const priorities=[];
  if(d.triagePending)priorities.push(overviewPriority(`${d.triagePending} R.O.(s) sem triagem`,'Precisam ser classificadas e direcionadas pelo SGQ.','showTriage()','warn'));
  if(d.sacToClassify)priorities.push(overviewPriority(`${d.sacToClassify} SAC(s) sem classificação completa`,'Defina tratativa, setor responsável e prazo antes do início.','showExternalRoControl()','warn'));
  if(d.actionReview)priorities.push(overviewPriority(`${d.actionReview} ação(ões) exigem atenção`,'Há ações atrasadas ou aguardando conferência do SGQ.','showPendingActions()','danger'));
  if(d.contests.length)priorities.push(overviewPriority(`${d.contests.length} contestação(ões) pendente(s)`,'Existem solicitações aguardando decisão administrativa.','showContestations()','warn'));
  if(d.summary.overdue)priorities.push(overviewPriority(`${d.summary.overdue} PDCA(s) em atraso`,'Há PDCAs direcionados com prazo vencido.','showPendingHub()','danger'));
  if(d.registrations.length)priorities.push(overviewPriority(`${d.registrations.length} cadastro(s) aguardando aprovação`,'Novos usuários precisam de análise.','showPendingHub()',''));
  if(d.docs.length)priorities.push(overviewPriority(`${d.docs.length} solicitação(ões) de documentos aberta(s)`,'Pedidos enviados ao SGQ ainda precisam de atendimento.',"showAdminOperationalModule('documents')",''));

  renderOverviewPriorities(priorities);
  renderCustomOverviewQuickLinks();
}
function renderOverviewPriorities(items){
  const box=document.getElementById('overviewPriorities');
  const count=document.getElementById('overviewPriorityCount');
  if(count)count.textContent=items.length;
  if(!box)return;
  box.innerHTML=items.length?items.join(''):`<div class="overview-empty">
    <b>Nenhuma pendência crítica agora.</b>
    <span>${isAdmin()?'As filas administrativas estão sem itens que exijam atuação imediata.':'Você não tem nenhuma atividade urgente identificada neste momento.'}</span>
  </div>`;
}
function renderCurrentOverview(){
  try{
    if(isAdmin())renderAdminOverview();
    else renderUserOverview();
  }catch(e){
    console.error('Falha ao renderizar Visão geral:',e);
    const k=document.getElementById('overviewKpis');
    if(k)k.innerHTML=[
      overviewKpi(overviewSafe(()=>getAllRoRecords().filter(r=>canViewRO(r)).length,0),'R.O.s disponíveis','','showAssignedRos()','Abrir'),
      overviewKpi(overviewSafe(()=>userSectorPendingActions().length,0),'Ações em acompanhamento','','showActionsDashboard()','Abrir')
    ].join('');
    renderOverviewPriorities([]);
    renderCustomOverviewQuickLinks();
  }
}

function showList(){
  if(!nucleoFeatureRequire('ros','consult'))return;
  roListMode='all';
  refreshRoleNavigationLabels();
  view('listView');
  setNav('ros');
  renderCurrentOverview();
  try{refreshNotificationBell()
  const extra=document.getElementById('assignedExtraFilters');if(extra)extra.style.display='none';
}catch(e){console.warn('Falha ao atualizar notificações:',e)}
}

function populateAssignedRoFilters(){
  const sectorEl=document.getElementById('assignedSectorFilter');
  const unitEl=document.getElementById('assignedUnitFilter');
  if(sectorEl){
    const current=sectorEl.value||'all';
    const sectors=nucleoVisibleManagerSectors(isManager(),managedSectorsForCurrentUser(),getTriageRecords().filter(r=>r.triagemStatus!=='new').map(r=>r.setorDirecionado));
    sectorEl.setAttribute('aria-label',isManager()?'Setor sob minha gestão':'Setor responsável');
    sectorEl.title=isManager()?'Escolha o setor que deseja acompanhar':'Filtrar por setor';
    sectorEl.innerHTML='<option value="all">'+(isManager()?'Todos os meus setores':'Todos os setores')+'</option>'+sectors.map(s=>`<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
    if([...sectorEl.options].some(o=>o.value===current))sectorEl.value=current;
  }
  if(unitEl){
    const current=unitEl.value||'all';
    const units=[...new Set(getTriageRecords()
      .filter(r=>r.triagemStatus!=='new')
      .map(r=>String(r.unidade||'').trim()).filter(Boolean))]
      .sort((a,b)=>a.localeCompare(b,'pt-BR'));
    unitEl.innerHTML='<option value="all">Todas as unidades</option>'+units.map(u=>`<option value="${escapeHtml(u)}">${escapeHtml(u)}</option>`).join('');
    if([...unitEl.options].some(o=>o.value===current))unitEl.value=current;
  }
}

function showAssignedRos(){
  if(!nucleoFeatureRequire('ros','assigned'))return;
  roListMode='assigned';
  view('roListView');
  setNav('assigned');
  const extra=document.getElementById('assignedExtraFilters');
  if(extra)extra.style.display='flex';
  populateAssignedRoFilters();
  render();
  try{refreshRoSummary()}catch(e){}
  try{refreshUserPendingActionAlert()}catch(e){}
}function showDetail(){fillDetail();view('detailView')}function showSettings(){
  ensureUnitQualitySettings();
  ensureFixedEmailCopiesPanel();
  loadFixedEmailCopies();
  if(!isAdmin()){showList();return;}
  view('settingsView');
  setNav('admin');
  loadAdminConfig();
  loadRuleCenter();
  updateBackendStatus(portalBackendEnabled(),portalBackendEnabled()?'Apps Script configurado.':'Apps Script não configurado.');
  window.scrollTo({top:0,behavior:'instant'});
}function openPDCA(){
  if(!nucleoFeatureRequire('pdca','respond'))return;
  if(!selected){alert('Não foi possível identificar a R.O. deste PDCA. Abra a R.O. novamente.');return}
  const roKey=selected.numero||selected.id||selected.codigo;
  const wasStarted=isPdcaStarted(roKey);
  markPdcaStarted(roKey);
  pRo.textContent=selected.numero+' • '+selected.assunto;
  pNumero.value=selected.numero;pUnidade.value=selected.unidade;pCliente.value=selected.cliente;pSetor.value=selected.setor;
  activeStage=0;
  const continuing=loadPdcaDraftForRo(roKey) || wasStarted;
  if(!getPdcaDraftForRo(roKey))savePdcaDraftLocal();
  view('pdcaView');
  const title=document.querySelector('#pdcaView h2');
  if(title)title.textContent=continuing?'Continuar a responder o PDCA':'Responder PDCA';
  renderStage();renderPdcaActions();runPdcaQualityCheck(false);
  const st=document.getElementById('pdcaDraftState');
  if(st)st.textContent=continuing?'Rascunho recuperado. Continue de onde parou.':'Rascunho será salvo automaticamente.';
  setNav('plan');
}
function pdcaIssueForQuestion(id){
  return pdcaQualityIssues().filter(x=>x.id===id);
}
function pdcaIssueHtml(x){
  const items=(x.items||[]).map(v=>`<li>${escapeHtml(v)}</li>`).join('');
  const example=x.example?`<div class="quality-example"><b>Exemplo:</b> ${escapeHtml(String(x.example).replace(/^Ex\.:\s*/i,''))}</div>`:'';
  return `<div class="quality-guidance"><div class="quality-guidance-title">⚠ ${escapeHtml(x.title||x.text||'Revise esta resposta.')}</div>${items?`<div class="quality-guidance-label">O que melhorar:</div><ul>${items}</ul>`:''}${example}</div>`;
}
function pdcaInlineAlertHtml(id){
  const issues=pdcaIssueForQuestion(id);
  return `<div id="quality_${id}" class="${issues.length?'question-inline-alert':''}">${issues.map(pdcaIssueHtml).join('')}</div>`;
}
function refreshPdcaInlineAlerts(){
  stages[activeStage].items.forEach(it=>{
    const el=document.getElementById('quality_'+it[0]);
    if(!el)return;
    const issues=pdcaIssueForQuestion(it[0]);
    el.className=issues.length?'question-inline-alert':'';
    el.innerHTML=issues.map(pdcaIssueHtml).join('');
  });
}
let pdcaSpeechRecognition=null;
function dictatePdcaAnswer(id,button){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){
    alert('A transcrição por voz não está disponível neste navegador. No Chrome ou Edge atualizado ela costuma estar disponível.');
    return;
  }
  try{if(pdcaSpeechRecognition)pdcaSpeechRecognition.abort()}catch(e){}
  const rec=new SR();
  pdcaSpeechRecognition=rec;
  rec.lang='pt-BR';
  rec.continuous=false;
  rec.interimResults=true;
  let finalText='';
  const area=document.getElementById('answer_'+id);
  const original=area?.value||'';
  rec.onstart=()=>{button?.classList.add('listening');if(button)button.textContent='● Ouvindo...'};
  rec.onresult=(event)=>{
    let interim='';
    for(let i=event.resultIndex;i<event.results.length;i++){
      const t=event.results[i][0].transcript;
      if(event.results[i].isFinal)finalText+=(finalText?' ':'')+t;
      else interim+=t;
    }
    if(area){
      const spoken=(finalText+(interim?' '+interim:'')).trim();
      area.value=(original+(original&&spoken?' ':'')+spoken).trim();
    }
  };
  rec.onerror=(event)=>{
    if(event.error!=='aborted')alert('Não foi possível transcrever a fala: '+event.error);
  };
  rec.onend=()=>{
    button?.classList.remove('listening');
    if(button)button.textContent='🎤 Falar resposta';
    if(area){
      answers[id]=area.value;
      updateCompletion();
      renderPdcaStageOverview();
      schedulePdcaDraftSave();
      refreshPdcaInlineAlerts();
    }
    pdcaSpeechRecognition=null;
  };
  rec.start();
}
function renderStage(){
  renderPdcaStageOverview();
  stageTabs.innerHTML=stages.map((s,i)=>{
    const done=s.items.filter(it=>(answers[it[0]]||'').trim()).length;
    return `<button class="stage-tab ${i===activeStage?'active':''}" onclick="activeStage=${i};renderStage()">${s.number} · ${s.name} <small>${done}/${s.items.length}</small></button>`;
  }).join('');

  const s=stages[activeStage];
  stageTitle.textContent=s.number+' · '+s.name;
  stageSubtitle.textContent=s.subtitle;

  const stageDone=s.items.filter(it=>(answers[it[0]]||'').trim()).length;
  const pos=document.getElementById('stagePosition');
  const badge=document.getElementById('stageCompletionBadge');
  if(pos)pos.textContent=`Etapa ${activeStage+1} de ${stages.length}`;
  if(badge)badge.textContent=`${stageDone}/${s.items.length} respondidas`;

  questions.innerHTML=s.items.map((it,i)=>{
    const global=globalQuestionNumber(it[0]);
    const answered=(answers[it[0]]||'').trim().length>0;
    if(it[0]==='p13')return renderPdcaResponsibleSectorQuestion(it,s,global,answered);
    return `<div class="question" style="border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-bottom:12px;background:#fff">
      <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start">
        <div class="small" style="font-weight:700">Pergunta ${global} de 26 · ${s.name}</div>
        <span class="status-badge ${answered?'answered':''}">${answered?'Respondida':'Obrigatória'}</span>
      </div>
      <h4 style="margin:7px 0 4px">${it[1]}</h4>
      <p style="margin:0 0 10px;color:#667085">${it[2]}</p>
      <div class="question-answer-tools"><button class="mic-answer-btn" type="button" onclick="dictatePdcaAnswer('${it[0]}',this)">🎤 Falar resposta</button></div>
      <textarea id="answer_${it[0]}" spellcheck="true"
        oninput="answers['${it[0]}']=this.value;updateCompletion();renderPdcaStageOverview();schedulePdcaDraftSave();refreshPdcaInlineAlerts()"
        placeholder="Escreva ou fale aqui sua resposta...">${answers[it[0]]||''}</textarea>
      ${pdcaInlineAlertHtml(it[0])}
      <div style="margin-top:10px"><div class="small" style="margin-bottom:5px">Evidência ou foto (opcional)</div><input type="file" style="font-size:12px"></div>
    </div>`;
  }).join('');

  prevStage.disabled=activeStage===0;
  nextStage.disabled=activeStage===stages.length-1;
  updateCompletion();
  setNav(['plan','do','check','act'][activeStage]);
  setTimeout(()=>runPdcaQualityCheck(false),0);
}
function updateCompletion(){
  const allIds=stages.flatMap(s=>s.items.map(it=>it[0]));
  const completed=allIds.filter(id=>(answers[id]||'').trim().length>0).length;
  const total=allIds.length;
  const pct=Math.round((completed/total)*100);
  const txt=document.getElementById('completionText');
  const fill=document.getElementById('completionFill');
  const btn=document.getElementById('sendPdcaBtn');
  const hint=document.getElementById('submitHint');
  if(txt) txt.textContent=`${completed} de ${total} respondidas`;
  if(fill) fill.style.width=pct+'%';
  const requireAll=getRuleYes('rulePdcaRequireAll');
  if(btn) btn.disabled=requireAll && completed!==total;
  if(hint){
    hint.textContent=requireAll
      ? (completed===total?'PDCA completo. O envio está liberado.':`Faltam ${total-completed} resposta(s) para liberar o envio.`)
      : (completed===total?'PDCA completo. O envio está liberado.':`Há ${total-completed} resposta(s) pendente(s), mas a regra atual permite o envio.`);
  }
  const stage=stages[activeStage];
  const stageDone=stage.items.filter(it=>(answers[it[0]]||'').trim()).length;
  const stageBadge=document.getElementById('stageCompletionBadge');
  if(stageBadge)stageBadge.textContent=`${stageDone}/${stage.items.length} respondidas`;

}
function highlightMissing(){
  if(!getRuleYes('rulePdcaRequireAll'))return true;
  const missing=[];
  stages.forEach((stage,si)=>stage.items.forEach(it=>{
    if(!(answers[it[0]]||'').trim()) missing.push({id:it[0],stage:si,label:it[1]});
  }));
  if(!missing.length) return true;
  activeStage=missing[0].stage;
  renderStage();
  setTimeout(()=>{
    const el=document.getElementById('answer_'+missing[0].id);
    if(el){
      const q=el.closest('.question'); if(q)q.classList.add('missing');
      if(missing[0].id!=='p13' && typeof el.focus==='function')el.focus();
      (q||el).scrollIntoView({behavior:'smooth',block:'center'});
    }
  },50);
  alert(`Ainda faltam ${missing.length} resposta(s). O sistema levou você até a primeira pergunta pendente.`);
  return false;
}

let roListMode='all';

const CONTEST_KEY='ro-pdca-contestations-v1';

function getContestations(){
  try{
    const data=JSON.parse(localStorage.getItem(CONTEST_KEY)||'[]');
    return Array.isArray(data)?data:[];
  }catch(e){return []}
}
function saveContestations(list){
  localStorage.setItem(CONTEST_KEY,JSON.stringify(list));
  if(portalBackendEnabled()){
    (list||[]).forEach(c=>{if(c?.id)portalBackendSave('contestations',c.id,c)});
  }
}

function getActionSectorContest(actionId,sector){
  return getContestations().filter(c=>c.type==='action_sector'&&String(c.actionId)===String(actionId)&&normalizeAnswer(c.sector)===normalizeAnswer(sector))
    .sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')))[0]||null;
}
function canContestActionSector(p,a){
  if(isAdmin())return false;
  const sector=currentSector();if(!sector)return false;
  const assigned=parseResponsibleSectors(a.responsibleSectors?.length?a.responsibleSectors:a.owner);
  const included=assigned.some(s=>normalizeAnswer(s)===normalizeAnswer(sector));
  const primary=normalizeAnswer(sector)===normalizeAnswer(a.primarySector||p.setor||'');
  return included&&!primary;
}
function contestActionSector(pdcaId,actionId){
  const p=getAllSentPdcas().find(x=>String(x.id)===String(pdcaId));if(!p)return;
  const a=allPdcaActionsForRecord(p).find(x=>String(x.id)===String(actionId));if(!a)return;
  if(!canContestActionSector(p,a)){alert('Este setor não pode contestar esta vinculação.');return}
  const sector=currentSector();
  const previous=getActionSectorContest(actionId,sector);
  if(previous?.status==='pending'){alert('Esta contestação já está aguardando análise do SGQ.');return}
  const reason=prompt('Justifique por que o setor '+sector+' não deve participar desta ação:','')||'';
  if(!reason.trim())return;
  const list=getContestations();
  const rec={id:'ACTCONT-'+Date.now(),type:'action_sector',ro:p.ro||'',pdcaId:p.id,actionId:a.id,action:a.action||'',sector,primarySector:a.primarySector||p.setor||'',user:getSession()?.name||currentEmail(),reason:reason.trim(),status:'pending',createdAt:new Date().toISOString()};
  list.unshift(rec);saveContestations(list);
  createNotification({type:'contest',audience:'admin',ro:p.ro||'',title:'Contestação de participação em ação',message:sector+' contestou sua inclusão na ação "'+(a.action||'')+'".'});
  alert('Contestação enviada ao SGQ. A atribuição permanece ativa até a decisão do ADM.');
  renderActionsDashboard();
}
function updateActionSectorAssignment(pdcaId,actionId,sector,keepAssigned){
  const all=getSentPdcas();
  const pi=all.findIndex(x=>String(x.id)===String(pdcaId));if(pi<0)return false;
  const p=all[pi];
  if(String(actionId).endsWith('-A1')){
    let sectors=parseResponsibleSectors(p.answers?.p13||p.setor);
    sectors=keepAssigned
      ? normalizeSectorList(sectors.concat([sector]))
      : sectors.filter(s=>normalizeAnswer(s)!==normalizeAnswer(sector));
    p.answers={...(p.answers||{}),p13:sectors.join(' | ')};
  }else{
    const ai=(p.actions||[]).findIndex(x=>String(x.id)===String(actionId));if(ai<0)return false;
    let sectors=parseResponsibleSectors(p.actions[ai].responsibleSectors?.length?p.actions[ai].responsibleSectors:p.actions[ai].owner);
    sectors=keepAssigned
      ? normalizeSectorList(sectors.concat([sector]))
      : sectors.filter(s=>normalizeAnswer(s)!==normalizeAnswer(sector));
    p.actions[ai]={...p.actions[ai],responsibleSectors:sectors,owner:sectors.join(' | ')};
  }
  all[pi]=p;
  safeStorageSet(SENT_PDCA_KEY,JSON.stringify(all));try{safeStorageSet(SENT_PDCA_KEY,JSON.stringify(all))}catch(e){}
  portalBackendSave('pdca_sent',p.id,p);
  allPdcaActionsForRecord(p).forEach(a=>portalBackendSave('pdca_actions',a.id,a));
  return true;
}

function getContestRecord(roNumber){
  const key=String(roNumber||'').trim();
  return getContestations().filter(c=>String(c.ro||'').trim()===key)
    .sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')))[0]||null;
}
function syncContestStateToRo(ro){
  if(!ro)return ro;
  const c=getContestRecord(ro.numero||ro.id||ro.codigo);
  if(!c)return ro;
  if(c.status==='pending'){
    if(getRuleYes('ruleContestSuspends')){ro.status='Em contestação';ro.pdca='Suspenso';}
  }
  else if(c.status==='accepted'){
    if(getRuleYes('ruleContestAcceptCloses')){ro.status='Cancelada';ro.pdca='Não se aplica';}
    else {ro.status='Aguardando resposta';ro.pdca='Obrigatório';}
  }
  else if(c.status==='rejected'){
    ro.status='Aguardando resposta';ro.pdca='Obrigatório';
  }
  return ro;
}
function contestStatusLabel(status){
  return status==='accepted'?'Aceita':status==='rejected'?'Rejeitada':'Em análise';
}
function refreshContestUserStatus(){
  const box=document.getElementById('contestUserStatusBox');
  if(!box||!selected)return;
  const c=getContestRecord(selected.numero||selected.id||selected.codigo);
  if(!c){box.classList.add('hidden');return;}
  box.classList.remove('hidden');

  const title=document.getElementById('contestUserStatusTitle');
  const text=document.getElementById('contestUserStatusText');
  const badge=document.getElementById('contestUserStatusBadge');

  if(c.status==='pending'){
    title.textContent='Sua contestação está em análise pelo SGQ';
    text.textContent='Motivo informado: '+(c.reason||'—')+'. O PDCA permanece suspenso até a decisão do SGQ.';
    badge.textContent='Em análise'; badge.className='status-badge pending';
  }else if(c.status==='accepted'){
    title.textContent='Contestação aceita pelo SGQ';
    text.textContent='Motivo informado: '+(c.reason||'—')+'. A R.O. foi encerrada sem necessidade de PDCA.';
    badge.textContent='Aceita'; badge.className='status-badge answered';
  }else{
    title.textContent='Contestação rejeitada pelo SGQ';
    text.textContent='Motivo informado: '+(c.reason||'—')+(c.reviewNote?' · Retorno do SGQ: '+c.reviewNote:'')+'. O PDCA voltou a ser obrigatório.';
    badge.textContent='Rejeitada'; badge.className='status-badge';
  }
}
function showContestations(){
  if(!nucleoFeatureRequire('ros','reviewContests'))return;
  if(!isAdmin()){showList();return}
  view('contestationsView'); setNav('contests'); renderContestations();
}
function refreshContestPendingBadge(){
  refreshMenuNotificationBadges();
}
function renderContestations(){
  if(!isAdmin())return;
  refreshContestPendingBadge();
  const filter=document.getElementById('contestStatusFilter')?.value||'pending';
  const q=normalizeAnswer(document.getElementById('contestSearch')?.value||'');
  let list=getContestations();
  if(filter!=='all')list=list.filter(c=>c.status===filter);
  if(q)list=list.filter(c=>normalizeAnswer([c.ro,c.sector,c.user,c.reason,c.reviewNote,c.action,c.pdcaId].join(' ')).includes(q));

  const pending=getContestations().filter(c=>c.status==='pending').length;
  const count=document.getElementById('contestPendingCount'); if(count)count.textContent=pending+' em análise';

  const body=document.getElementById('contestationsBody'); if(!body)return;
  body.innerHTML=list.length?list.map(c=>`
    <tr>
      <td><b>${escapeHtml(c.ro||'-')}</b>${c.type==='action_sector'?`<div class="small">${escapeHtml(c.pdcaId||'')} · Ação</div>`:''}</td>
      <td>${escapeHtml(c.sector||'-')}${c.suggestedSector?`<div class="small" style="margin-top:4px">Sugestão: ${escapeHtml(c.suggestedSector)}</div>`:''}</td>
      <td>${escapeHtml(c.user||'-')}</td>
      <td style="min-width:260px">${c.type==='action_sector'?`<div class="small" style="margin-bottom:5px"><b>Ação:</b> ${escapeHtml(c.action||'-')}</div>`:''}<b>${escapeHtml(c.reason||'-')}</b>${c.reviewNote?`<div class="small" style="margin-top:5px">Retorno SGQ: ${escapeHtml(c.reviewNote)}</div>`:''}</td>
      <td>${escapeHtml(formatDateTimeBR(c.createdAt)||'-')}</td>
      <td><span class="status-badge ${c.status==='pending'?'pending':c.status==='accepted'?'answered':''}">${contestStatusLabel(c.status)}</span></td>
      <td style="white-space:nowrap">${c.status==='pending'
        ? `<button class="btn secondary" type="button" onclick="reviewContestation('${escapeHtml(c.id)}','rejected')">Rejeitar</button>
           <button class="btn primary" type="button" onclick="reviewContestation('${escapeHtml(c.id)}','accepted')">Aceitar</button>`
        : '<span class="small">Analisada</span>'}</td>
    </tr>`).join('')
    : '<tr><td colspan="7" style="text-align:center;padding:24px;color:#667085">Nenhuma contestação encontrada.</td></tr>';
}
function reviewContestation(id,decision){
  if(!nucleoFeatureRequire('ros','reviewContests'))return;
  if(!isAdmin())return;
  const list=getContestations();
  const idx=list.findIndex(c=>String(c.id)===String(id));if(idx<0)return;
  const c=list[idx];
  let note='';
  if(decision==='rejected'){
    note=prompt(c.type==='action_sector'?'Explique por que o setor continuará vinculado à ação:':'Informe ao setor por que a contestação foi rejeitada:','')||'';
    if(getRuleYes('ruleContestRejectNoteRequired')&&!note.trim()){alert('Informe o motivo da rejeição.');return}
  }else{
    const msg=c.type==='action_sector'
      ?'Aceitar a contestação e retirar o setor '+c.sector+' desta ação?'
      :(getRuleYes('ruleContestAcceptCloses')?'Aceitar esta contestação? A R.O. será encerrada sem necessidade de PDCA.':'Aceitar esta contestação? Pela regra atual, a R.O. continuará exigindo PDCA.');
    if(!confirm(msg))return;
  }
  list[idx]={...c,status:decision,reviewNote:note.trim(),reviewedAt:new Date().toISOString(),reviewedBy:getSession()?.name||'SGQ'};
  saveContestations(list);

  if(c.type==='action_sector'){
    updateActionSectorAssignment(c.pdcaId,c.actionId,c.sector,decision!=='accepted');
    createNotification({
      type:'contest',audience:'sector',sector:c.sector,ro:c.ro,
      title:decision==='accepted'?'Contestação de ação aceita':'Contestação de ação rejeitada',
      message:decision==='accepted'
        ?'O SGQ aceitou a contestação e retirou o setor '+c.sector+' da ação "'+(c.action||'')+'".'
        :'O SGQ manteve o setor '+c.sector+' como responsável pela ação "'+(c.action||'')+'".'+(note?' Motivo: '+note:'')
    });
    renderContestations();try{renderActionsDashboard()}catch(e){};return;
  }

  const ro=ros.find(r=>String(r.numero||r.id||r.codigo)===String(c.ro));
  if(ro)syncContestStateToRo(ro);
  renderContestations();try{render()}catch(e){};try{refreshRoSummary()}catch(e){}
  const contestRo=ros.find(r=>String(r.numero||r.id||r.codigo)===String(c.ro));
  const triageRecord=contestRo?getRoTriageRecord(contestRo):null;
  const destinationSector=(triageRecord?.responsibleSector||c.sector||contestRo?.setor||'').trim();
  createNotification({
    type:'contest',audience:'sector',sector:destinationSector,ro:c.ro,
    unidade:contestRo?.unidade||'',tipoRO:contestRo?.tipoRO||contestRo?.tipo||'',cliente:contestRo?.cliente||'',
    title:decision==='accepted'?'Contestação aceita':'Contestação rejeitada',
    message:decision==='accepted'
      ?(getRuleYes('ruleContestAcceptCloses')?'O SGQ aceitou a contestação da '+c.ro+'. A R.O. foi encerrada e não é necessário responder PDCA.':'O SGQ aceitou a contestação da '+c.ro+'. Pela regra atual, o PDCA continua necessário.')
      :'O SGQ rejeitou a contestação da '+c.ro+'. É necessário responder o PDCA.'+(note?' Motivo da decisão: '+note:'')
  });
}

function globalQuestionNumber(id){
  let n=0;
  for(const stage of stages){
    for(const item of stage.items){ n++; if(item[0]===id)return n; }
  }
  return n;
}
function renderPdcaStageOverview(){
  const box=document.getElementById('pdcaStageOverview'); if(!box)return;
  box.innerHTML=stages.map((s,i)=>{
    const done=s.items.filter(it=>(answers[it[0]]||'').trim()).length;
    const active=i===activeStage;
    return `<button type="button" onclick="activeStage=${i};renderStage()" style="text-align:left;border:1px solid ${active?'#1f4f82':'#d9e2ec'};background:${active?'#eef5ff':'#fff'};border-radius:10px;padding:10px 12px;cursor:pointer">
      <div class="small" style="font-weight:700">Etapa ${i+1}</div><b>${escapeHtml(s.name)}</b><div class="small">${done}/${s.items.length} respondidas</div>
    </button>`;
  }).join('');
}
function goFirstMissingQuestion(){
  const missing=[];
  stages.forEach((stage,si)=>stage.items.forEach(it=>{if(!(answers[it[0]]||'').trim())missing.push({id:it[0],stage:si});}));
  if(!missing.length){alert('Todas as 26 perguntas já foram respondidas.');return;}
  activeStage=missing[0].stage; renderStage();
  setTimeout(()=>{const el=document.getElementById('answer_'+missing[0].id);if(el){el.focus();el.scrollIntoView({behavior:'smooth',block:'center'});el.closest('.question')?.classList.add('missing');}},50);
}

function changeStage(d){activeStage=Math.max(0,Math.min(stages.length-1,activeStage+d));renderStage();window.scrollTo({top:0,behavior:'smooth'})}function openContest(){
  if(!nucleoFeatureRequire('ros','contest'))return;
  const modal=document.getElementById('contestModal');
  if(!modal){
    alert('Não foi possível abrir a contestação.');
    return;
  }
  const text=document.getElementById('contestText');
  const sector=document.getElementById('contestSector');
  if(text)text.value='';
  if(sector)sector.value='';
  modal.classList.remove('hidden');
  setTimeout(()=>text?.focus(),0);
}function closeContest(){
  const modal=document.getElementById('contestModal');
  if(modal)modal.classList.add('hidden');
}function submitContest(){
  if(!nucleoFeatureRequire('ros','contest'))return;
  const textEl=document.getElementById('contestText');
  const sectorEl=document.getElementById('contestSector');
  const reason=String(textEl?.value||'').trim();
  const suggestedSector=String(sectorEl?.value||'').trim();

  if(!reason){
    alert('Informe o motivo da contestação.');
    return;
  }
  if(!selected){
    alert('Nenhuma R.O. selecionada para contestação.');
    return;
  }

  const session=getSession()||{};
  const list=getContestations();
  const roNumber=String(selected.numero||selected.id||selected.codigo||'').trim();
  if(!roNumber){
    alert('Não foi possível identificar a R.O.');
    return;
  }

  const existing=list.find(c=>
    String(c.ro||'').trim()===roNumber &&
    String(c.status||'')==='pending' &&
    String(c.type||'ro')!=='action_sector'
  );
  if(existing){
    alert('Esta R.O. já possui uma contestação em análise.');
    closeContest();
    return;
  }

  const baseRo=getAllRoRecords().find(r=>String(r.numero||r.id||r.codigo||'').trim()===roNumber);
  const tri=baseRo?getRoTriageRecord(baseRo):null;
  const currentResponsibleSector=String(
    tri?.responsibleSector ||
    selected.setorResponsavel ||
    selected.setor ||
    session.sector ||
    ''
  ).trim();

  const record={
    id:'CONT-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),
    type:'ro',
    ro:roNumber,
    sector:currentResponsibleSector,
    suggestedSector,
    user:session.name||currentEmail(),
    userEmail:session.email||currentEmail()||'',
    reason,
    status:'pending',
    createdAt:new Date().toISOString()
  };

  list.unshift(record);
  saveContestations(list);

  if(getRuleYes('ruleContestSuspends')){
    selected.status='Em contestação';
    selected.pdca='Suspenso';
  }else{
    selected.status='Aguardando resposta';
    selected.pdca='Obrigatório';
  }

  if(textEl)textEl.value='';
  if(sectorEl)sectorEl.value='';
  closeContest();

  try{fillDetail()}catch(e){}
  try{refreshContestUserStatus()}catch(e){}
  try{render()}catch(e){}
  try{refreshContestPendingBadge()}catch(e){}

  portalUpdateRoSheet(roNumber,{status:'Em contestação'});

  createNotification({
    type:'contest',
    audience:'admin',
    ro:roNumber,
    sector:currentResponsibleSector,
    title:'Nova contestação recebida',
    message:(session.name||'Usuário')+' contestou '+roNumber+'. Motivo: '+reason+
      (suggestedSector?' · Setor sugerido: '+suggestedSector:'')
  });

  alert(
    getRuleYes('ruleContestSuspends')
      ?'Contestação enviada ao SGQ. O PDCA ficará suspenso enquanto ela estiver em análise.'
      :'Contestação enviada ao SGQ. Pela regra atual, o PDCA continua ativo durante a análise.'
  );
}
async function finishPDCA(){
  if(!nucleoFeatureRequire('pdca','respond'))return;
  const btn=document.getElementById('sendPdcaBtn');
  const hint=document.getElementById('submitHint');

  if(!highlightMissing())return;

  const qualityIssues=runPdcaQualityCheck(false);
  if(qualityIssues.length){
    const proceed=confirm(
      'O assistente encontrou '+qualityIssues.length+
      ' ponto(s) que podem melhorar a qualidade do PDCA.\n\nDeseja enviar mesmo assim?'
    );
    if(!proceed)return;
  }

  if(!selected){
    alert('Não foi possível identificar a R.O. deste PDCA. Abra a R.O. novamente e tente enviar.');
    return;
  }

  try{
    if(btn){
      btn.disabled=true;
      btn.dataset.originalText=btn.textContent||'Enviar PDCA';
      btn.textContent='Enviando...';
    }
    if(hint)hint.textContent='Salvando o PDCA...';

    const sent=getSentPdcas();
    const op=getOperationalUsers().find(
      u=>String(u.email||'').toLowerCase()===String(currentEmail()||'').toLowerCase()
    );
    const now=new Date();

    let pdcaNumber='';

    // A numeração central não pode travar o envio inteiro.
    if(portalBackendEnabled()){
      try{
        const numberingRequest=portalJsonp({acao:'portal_next_pdca_number'},7000);
        const timeout=new Promise((_,reject)=>
          setTimeout(()=>reject(new Error('Tempo limite para gerar número do PDCA.')),7500)
        );
        const res=await Promise.race([numberingRequest,timeout]);
        if(res?.sucesso)pdcaNumber=String(res.numero||'').trim();
      }catch(e){
        console.warn('Portal SGQ: numeração central indisponível, usando número provisório.',e);
      }
    }

    if(!pdcaNumber){
      pdcaNumber='PDCA-'+String(Date.now()).slice(-8);
    }

    const roNumber=selected.numero||selected.id||selected.codigo||'';
    const record={
      id:pdcaNumber,
      ro:roNumber,
      responsavel:op?.name||getSession()?.name||currentEmail(),
      email:currentEmail(),
      unidade:selected.unidade||'',
      setor:selected.setor||currentSector()||'',
      cliente:selected.cliente||'',
      tipoRO:selected.tipoRO||'Externa',
      sentAt:now.toISOString(),
      envio:now.toLocaleDateString('pt-BR')+' '+now.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}),
      status:'Enviado',
      answers:{...answers},
      actions:pdcaExtraActions.filter(x=>String(x.action||'').trim()).map(x=>({...x}))
    };

    // Registra no histórico em memória. Se o navegador estiver com o armazenamento
    // local cheio, isso não pode impedir o envio para a base central.
    sent.unshift(record);
    try{refreshPdcaSidebarBadge()}catch(e){}
    const savedLocal=safeStorageSet(SENT_PDCA_KEY,JSON.stringify(sent));
    try{safeStorageSet(SENT_PDCA_KEY,JSON.stringify(sent))}catch(e){}

    selected.status='PDCA enviado';
    selected.pdca='Enviado';

    // A base central é a persistência principal do envio.
    const centralSaved=portalBackendSave('pdca_sent',record.id,record);
    allPdcaActionsForRecord(record).forEach(a=>portalBackendSave('pdca_actions',a.id,a));

    const triageForSheet=overviewSafe(()=>getSavedTriageMap().get(String(roNumber||'').trim()),null);
    const sheetSector=triageForSheet?.responsibleSector||record.setor||'';
    const sheetPerson=triageForSheet?.responsibleUserName||'Todo o setor';
    const sheetOrigin=String(selected?.origemBase||selected?.raw?.__origemBase||'Interna');

    try{
      const sheetFields=sheetOrigin==='Externa'
        ? {
            setor:sheetSector,
            pessoa:sheetPerson,
            prazoConclusao:record.answers?.p12||'',
            status:'Enviado',
            dataEnvio:record.envio||'',
            resultado:'ENVIADO COM SUCESSO'
          }
        : {
            setor:sheetSector,
            pessoa:sheetPerson,
            acaoPrevista:record.answers?.p11||'',
            prazoConclusao:record.answers?.p12||'',
            status:'Enviado',
            dataEnvio:record.envio||''
          };

      const sheetResult=await portalUpdateRoSheetConfirmed(roNumber,sheetFields);
      record.sheetUpdate={
        ok:true,
        origin:sheetResult?.origem||sheetOrigin,
        at:new Date().toISOString()
      };
    }catch(sheetError){
      record.sheetUpdate={
        ok:false,
        origin:sheetOrigin,
        error:String(sheetError?.message||sheetError),
        at:new Date().toISOString()
      };

      // Na Externa, Resultado precisa deixar explícito o motivo do erro.
      if(sheetOrigin==='Externa'){
        portalUpdateRoSheet(roNumber,{
          setor:sheetSector,
          pessoa:sheetPerson,
          prazoConclusao:record.answers?.p12||'',
          status:'Erro',
          dataEnvio:record.envio||'',
          resultado:'ERRO NO ENVIO: '+String(sheetError?.message||sheetError)
        });
      }
      throw new Error('PDCA registrado, mas a atualização da planilha falhou: '+String(sheetError?.message||sheetError));
    }

    clearPdcaDraft(roNumber);

    const own=document.getElementById('pdcaOwnNumber');
    if(own)own.textContent=pdcaNumber;

    try{
      createNotification({
        type:'pdca',
        audience:'admin',
        ro:roNumber,
        title:'Novo PDCA recebido',
        message:'O setor '+record.setor+' enviou o '+pdcaNumber+' referente à '+roNumber+'.'
      });
    }catch(e){console.warn('Falha ao criar notificação do SGQ.',e)}

    try{
      const assignedSectors=[...new Set(allPdcaActionsForRecord(record).flatMap(a=>parseResponsibleSectors(a.responsibleSectors?.length?a.responsibleSectors:a.owner)))];
      assignedSectors.forEach(sec=>{
        createNotification({
          type:'action',audience:'sector',sector:sec,ro:roNumber,
          title:'Nova ação atribuída',
          message:'O '+pdcaNumber+' atribuiu uma ou mais ações ao setor '+sec+'. Consulte Ações para acompanhar.'
        });
      });
    }catch(e){console.warn('Falha ao notificar setores responsáveis pelas ações.',e)}

    try{
      createNotification({
        type:'pdca',
        audience:'complainant',
        ro:roNumber,
        title:'Retorno da sua R.O. disponível',
        message:'O '+pdcaNumber+' da '+roNumber+' foi respondido. Você já pode visualizar o retorno e acompanhar as ações.'
      });
    }catch(e){console.warn('Falha ao criar notificação do reclamante.',e)}

    if(hint)hint.textContent=centralSaved
      ? (savedLocal?'PDCA enviado. Sincronização com a base central solicitada.':'PDCA enviado para a base central. O armazenamento local do navegador está cheio.')
      : (savedLocal?'PDCA salvo localmente. A sincronização central será tentada novamente.':'O navegador está sem espaço local e a sincronização central não pôde ser confirmada.');

    alert(pdcaNumber+' enviado e incluído no histórico.');
    showSentPdcas();

  }catch(err){
    console.error('Portal SGQ: erro ao enviar PDCA.',err);
    if(hint)hint.textContent='Não foi possível concluir o envio: '+(err?.message||err);
    alert('Não foi possível enviar o PDCA: '+(err?.message||err));
  }finally{
    if(btn){
      btn.disabled=false;
      btn.textContent=btn.dataset.originalText||'Enviar PDCA';
    }
  }
}
async function syncNow(){
  // Sincronizar é uma ação operacional: qualquer usuário autenticado pode executar.
  // Links, chave, regras e período continuam protegidos na Administração.
  if(syncNow.inProgress)return;
  syncNow.inProgress=true;
  const syncMsg=document.getElementById('syncMsg');
  const s=getSavedIntegrationSettings();
  await showNucleoLoading('Buscando '+integrationPeriodLabel(s)+' nas abas Interna e Externa...','Sincronizando com a planilha');

  if(!s.apiUrl){
    syncMsg.textContent='Configure primeiro a URL do Web App/API em Administração.';
    syncMsg.className='statusline';
    hideNucleoLoading();
    syncNow.inProgress=false;
    return;
  }

  syncMsg.textContent='Sincronizando...';
  syncMsg.className='statusline';

  try{
    if(nucleoRoCentralRefreshPromise){
      const ok=await nucleoRoCentralRefreshPromise;
      if(!ok)throw new Error(document.getElementById('syncMsg')?.textContent||'A leitura central falhou.');
      syncMsg.textContent='R.O.s e SACs atualizados pela base central.';
      syncMsg.className='statusline okline';
      return;
    }
    const data=await loadOfficialRosPaged(s,(loaded,total,message)=>{
      updateNucleoLoading(message);
      syncMsg.textContent=message;
    });

    if(data?.sucesso===false) throw new Error(data.erro||'Falha informada pelo Apps Script.');
    if(!Array.isArray(data?.dados)) throw new Error('Resposta sem a lista "dados".');

    updateNucleoLoading('Organizando '+data.dados.length+' R.O.s recebidas...');
    await new Promise(resolve=>requestAnimationFrame(resolve));
    const qty=applyImportedRos(data.dados,data);
    // A carga das R.O.s já terminou. A base complementar não deve segurar
    // o botão de sincronização nem manter o indicador aberto.
    setTimeout(()=>syncPortalBackend(false,{foreground:false}).catch(e=>console.warn('Falha na sincronização complementar:',e)),100);
    const bases=(typeof data.quantidadeInterna!=='undefined')?' · Interna: '+data.quantidadeInterna+' · Externa/SAC: '+(data.quantidadeExterna||0):'';
    syncMsg.textContent='Sincronização concluída: '+qty+' R.O.(s) carregada(s)'+bases+' · período: '+integrationPeriodLabel(s)+' · '+new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})+'.';
    syncMsg.className='statusline okline';
  }catch(err){
    syncMsg.textContent='Não foi possível concluir a carga das R.O.s: '+(err?.message||err)+'. Confira a execução do doGet no Apps Script e tente um período menor na Integração.';
    syncMsg.className='statusline';
  }finally{
    hideNucleoLoading();
    syncNow.inProgress=false;
  }
}
try{localStorage.removeItem(IMPORTED_RAW_KEY)}catch(e){}
ensurePreviewSession();
initLogin();
if(getSession())render();
refreshAccessUI();enforceAdminVisibility();refreshRoRegistrationAccess();
setTimeout(async()=>{
  await showNucleoLoading('Recuperando R.O.s salvas...','Carregando NÚCLEO');
  try{
    await bootstrapRoData();

    updateNucleoLoading('Conferindo bases Interna e Externa...');

    // Se o IndexedDB/cache não tiver as duas origens, completa pela API.
    const hasInterna=ros.some(r=>String(r.origemBase||r.raw?.__origemBase||'')==='Interna');
    const hasExterna=ros.some(r=>String(r.origemBase||r.raw?.__origemBase||'')==='Externa');
    const startupSyncSettings=getSavedIntegrationSettings();
    const startupPeriodFiltered=String(startupSyncSettings.roSyncPeriod||'all')!=='all';
    if(!startupPeriodFiltered && (!hasInterna || !hasExterna)){
      importedRoCacheNeedsRefresh=true;
      updateNucleoLoading('Completando dados pela planilha...');
    }

    const RO_DATE_CACHE_VERSION='ro-date-source-v4';
    const needDateRepair=localStorage.getItem('portal-sgq-ro-date-cache-version')!==RO_DATE_CACHE_VERSION;

    if(needDateRepair){
      importedRoCacheNeedsRefresh=true;
      updateNucleoLoading('Atualizando datas diretamente da planilha de R.O.s...');
    }

    const repaired=false; // Evita carregar todas as R.O.s durante a abertura; use Sincronizar após entrar.

    if(needDateRepair && repaired){
      localStorage.setItem('portal-sgq-ro-date-cache-version',RO_DATE_CACHE_VERSION);
      // Substitui também as datas antigas guardadas nos cards de SAC.
      try{saveExternalRoControlsLocal(getExternalRoControls())}catch(e){}
    }

    console.info('NÚCLEO R.O.s em memória',{
      total:ros.length,
      interna:ros.filter(r=>String(r.origemBase||r.raw?.__origemBase||'')==='Interna').length,
      externa:ros.filter(r=>String(r.origemBase||r.raw?.__origemBase||'')==='Externa').length
    });
    // O cache acelera a abertura, mas a fonte oficial é a planilha central.
    // Faça uma leitura real mesmo quando o cache já contém as duas origens.
    if(getSession()?.authToken)void refreshLegacyRoCacheFromApi(true);

    if(repaired){
      try{refreshRoSummary()}catch(e){}
      try{renderCurrentOverview()}catch(e){}
      const triageView=document.getElementById('triageView');
      if(triageView && !triageView.classList.contains('hidden')){
        try{renderTriage()}catch(e){}
      }
      const indicatorView=document.getElementById('sgqIndicatorsView');
      if(indicatorView && !indicatorView.classList.contains('hidden')){
        try{renderSgqIndicators()}catch(e){}
      }
    }
  }catch(e){
    console.warn('Falha ao completar carga de R.O.s.',e);
  }finally{
    hideNucleoLoading(true);
  }
},80);
try{if(getSession())renderCurrentOverview()}catch(e){console.warn('Falha ao carregar a Visão geral inicial.',e)}
try{refreshNotificationBell();refreshMenuNotificationBadges()}catch(e){}

try{
  // Força a normalização imediata do cache de SACs antigos.
  saveExternalRoControlsLocal(getExternalRoControls());
}catch(e){console.warn('Falha ao normalizar cache de SAC.',e)}

try{refreshDocumentRequestAccess()}catch(e){}
function refreshDocumentRequestAccess(){
  const el=document.getElementById('navDocumentRequests');
  if(!el)return;
  const allowed=canRequestDocuments();
  if(allowed)el.style.removeProperty('display');else el.style.setProperty('display','none','important');
  el.classList.toggle('hidden',!allowed);
}


function applyBodyRoleClass(){
  const body=document.body;
  if(!body)return;
  body.classList.remove('role-admin','role-manager','role-operator');
  if(isAdmin())body.classList.add('role-admin');
  else if(isManager())body.classList.add('role-manager');
  else body.classList.add('role-operator');
}

function enforceAdminVisibility(){
  applyBodyRoleClass();
  document.body.classList.toggle('nucleo-sgq-session',nucleoPersonPermissions(getSession()||{}).sgq);
  const allowed=isAdmin();

  // Qualquer item marcado como administrativo fica invisível para operador,
  // independentemente de estilos antigos, restauração do menu ou renderizações posteriores.
  document.querySelectorAll('.admin-only').forEach(el=>{
    el.style.display=allowed?'':'none';
    el.classList.toggle('hidden',!allowed);
  });

  const module=document.getElementById('moduleManagement');
  if(module){
    module.style.display=allowed?'':'none';
    module.classList.toggle('hidden',!allowed);
  }

  const adminIds=[
    'navExternalPdcas','navAdmin','navEquipment','navTraining','navNcCapa','navDocuments',
    'navProcesses','navIndicators','navAnnouncements',
    'navPendingActions','navTriage','navContests','navExternalRoControl','navSacTracking'
  ];
  adminIds.forEach(id=>{
    const el=document.getElementById(id);
    if(!el)return;
    el.style.display=allowed?'':'none';
    el.classList.toggle('hidden',!allowed);
  });

  // Cadastro de R.O. Externa / SAC é restrito a Comercial, Diretoria, Processos e SGQ,
  // inclusive quando o usuário possui perfil administrativo.
  try{refreshRoRegistrationAccess()}catch(e){}

  // Usuário representante recebe apenas "Meus SACs"; ADM mantém o controle completo.
  try{refreshRepresentativeSacMenu()}catch(e){}
  nucleoApplyPersonAccess();
}



window.addEventListener('pagehide',()=>{try{if(selected && !document.getElementById('pdcaView')?.classList.contains('hidden'))savePdcaDraftLocal()}catch(e){}});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){try{if(selected && !document.getElementById('pdcaView')?.classList.contains('hidden'))savePdcaDraftLocal()}catch(e){}}});


try{restoreSideModules()}catch(e){}
try{enforceAdminVisibility()}catch(e){}
document.addEventListener('DOMContentLoaded',()=>{
  try{enforceAdminVisibility()}catch(e){}
  try{refreshRoRegistrationAccess()}catch(e){}
  try{refreshRoleNavigationLabels()}catch(e){}
});

// Administração explícita; gravação confirmada antes de atualizar a tela.
function openPersonIdentityManager(){
 if(!nucleoFeatureRequire('users','edit'))return;
  if(!isAdmin())return;
  let box=document.getElementById('personIdentityManager');
  if(!box){box=document.createElement('div');box.id='personIdentityManager';box.className='settings-block';document.getElementById('cfgUsers').appendChild(box);}
  const users=getOperationalUsers();
  box.innerHTML='<h3>Identidade das pessoas e reclamantes</h3><p>Nomes alternativos só devem ser cadastrados após confirmação do SGQ.</p><select id="identityPerson">'+users.map((u,i)=>'<option value="'+i+'">'+escapeHtml(u.name+(u.description?' ('+u.description+')':'')+' · '+(u.email||'sem e-mail'))+'</option>').join('')+'</select><div class="actions"><button class="btn secondary" id="identityEdit">Editar nome e nomes alternativos</button></div><label>Buscar R.O. ou nome no formulário</label><input id="identitySearch"><div id="identityRos"></div><p id="identityStatus"></p>';
  document.getElementById('identityEdit').onclick=async()=>{
    const u=users[Number(document.getElementById('identityPerson').value)];if(!u)return;
    const parts=splitPersonNameDescription(u.name,u.description);
    const name=prompt('Nome de acesso único:',parts.name);if(name===null)return;
    const description=prompt('Descrição (ex.: Representante):',parts.description);if(description===null)return;
    const aliases=prompt('Nomes alternativos confirmados, separados por ponto e vírgula:',(u.aliases||[]).join('; '));if(aliases===null)return;
    await save({acao:'portal_person_identity',person:u.personId||u.email||u.name,name,description,aliases:JSON.stringify(aliases.split(';').map(x=>x.trim()).filter(Boolean))});
  };
  let timer;document.getElementById('identitySearch').oninput=()=>{clearTimeout(timer);timer=setTimeout(draw,250);};
  function draw(){
    const query=normalizePersonName(document.getElementById('identitySearch').value);const out=document.getElementById('identityRos');
    if(query.length<2){out.textContent='Digite pelo menos 2 caracteres para localizar a R.O.';return;}
    const all=getAllRoRecords().filter(ro=>normalizePersonName(claimantRoKey(ro)+' '+roRegistrantName(ro)).includes(query));
    out.innerHTML='<p>'+all.length+' resultado(s). Mostrando até 60.</p>';
    all.slice(0,60).forEach(ro=>{
      const row=document.createElement('div');row.style.padding='10px 0';
      const text=document.createElement('span');const person=resolveRoClaimant(ro);text.textContent=claimantRoKey(ro)+' · '+roRegistrantName(ro)+' → '+(person?person.name:'Aguardando confirmação')+' ';row.appendChild(text);
      const btn=document.createElement('button');btn.className='btn secondary';btn.textContent='Confirmar pessoa selecionada';
      btn.onclick=async()=>{const u=users[Number(document.getElementById('identityPerson').value)];if(!u)return;if(!confirm('Confirmar '+claimantRoKey(ro)+' para '+u.name+'?'))return;const alias=confirm('Guardar "'+roRegistrantName(ro)+'" como nome alternativo desta pessoa? Cancelar confirma somente esta R.O.');await save({acao:'portal_claimant_confirm',person:u.personId||u.email||u.name,ro:claimantRoKey(ro),registrant:roRegistrantName(ro),alias:alias?'1':'0'});};row.appendChild(btn);out.appendChild(row);
    });
  }
  async function save(params){const status=document.getElementById('identityStatus');const buttons=box.querySelectorAll('button');buttons.forEach(b=>b.disabled=true);status.textContent='Salvando na base central...';try{const res=await portalJsonp(params,60000);if(!res?.sucesso)throw new Error(res?.erro||'A base não confirmou a alteração.');const synced=await syncPortalBackend();if(!synced)throw new Error('A alteração foi salva, mas a atualização da tela falhou. Sincronize novamente.');openPersonIdentityManager();document.getElementById('identityStatus').textContent='Salvo na base central.';}catch(e){status.textContent=String(e.message||e);}finally{buttons.forEach(b=>b.disabled=false);}}
  draw();box.scrollIntoView({behavior:'smooth'});
}

function loadFixedEmailCopies(){
  let records=[];try{records=JSON.parse(localStorage.getItem('nucleo-fixed-email-copies')||'[]');}catch(_){}
  const scope=adminScopeUnit();
  ['matriz','filial'].forEach(unit=>{const emails=records.find(r=>r.id===unit)?.emails||[];[1,2].forEach(n=>{const el=document.getElementById('fixedCopy'+(unit==='matriz'?'Matriz':'Filial')+n);if(el){el.value=emails[n-1]||'';el.disabled=scope!=='todas'&&scope!==unit;}});});
}
async function saveFixedEmailCopies(){
  if(!nucleoFeatureRequire('sectors','emails'))return;
  if(!isAdmin())return;
  const data={},scope=adminScopeUnit();
  for(const unit of ['matriz','filial']){if(scope!=='todas'&&scope!==unit)continue;const emails=[1,2].map(n=>document.getElementById('fixedCopy'+(unit==='matriz'?'Matriz':'Filial')+n).value.trim()).filter(Boolean);if(emails.some(e=>! /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/.test(e))){alert('Confira os e-mails de '+unit+'. Informe um endereço por campo.');return;}data[unit]=emails;}
  const button=document.getElementById('fixedCopiesSave'),status=document.getElementById('fixedCopiesStatus');button.disabled=true;status.textContent='Salvando...';
  try{const result=await portalJsonp({acao:'portal_save_fixed_email_copies',data:JSON.stringify(data)},60000);if(!result?.sucesso)throw new Error(result?.erro||'A base não confirmou.');const snapshot=await portalJsonp({acao:'portal_load'},60000);if(!snapshot?.sucesso)throw new Error('Salvo. Sincronize para atualizar os campos.');applyPortalBackendSnapshot(snapshot);status.textContent='Cópias salvas na base central.';}catch(e){status.textContent=e.message||String(e);}finally{button.disabled=false;}
}

function ensureFixedEmailCopiesPanel(){
  const settings=document.getElementById("settingsView");if(!settings)return;
  let panel=document.getElementById("fixedEmailCopiesPanel");
  if(!panel){const existing=document.getElementById("fixedCopiesSave");if(existing){panel=existing.closest(".settings-block");if(panel)panel.id="fixedEmailCopiesPanel";}}
  if(!panel){const wrap=document.createElement("div");wrap.innerHTML="<div class=\"settings-block\" id=\"fixedEmailCopiesPanel\"><h3>Cópias fixas por unidade</h3><p class=\"help\">Estes destinatários recebem cópia (CC) de todos os e-mails enviados pelo Núcleo para a unidade correspondente. Deixe vazio para remover.</p><div class=\"settings-grid\"><label><div class=\"label\">Matriz — e-mail 1</div><input type=\"email\" id=\"fixedCopyMatriz1\"></label><label><div class=\"label\">Matriz — e-mail 2</div><input type=\"email\" id=\"fixedCopyMatriz2\"></label><label><div class=\"label\">Filial — e-mail 1</div><input type=\"email\" id=\"fixedCopyFilial1\"></label><label><div class=\"label\">Filial — e-mail 2</div><input type=\"email\" id=\"fixedCopyFilial2\"></label></div><button class=\"btn primary\" id=\"fixedCopiesSave\" type=\"button\" onclick=\"saveFixedEmailCopies()\">Salvar cópias na base central</button><p class=\"small\" id=\"fixedCopiesStatus\" aria-live=\"polite\"></p></div>";panel=wrap.firstElementChild;}
  const users=document.getElementById("cfgUsers");
  if(users)users.before(panel);else settings.prepend(panel);
  panel.style.display="block";
  let shortcut=document.getElementById("fixedCopiesShortcut");
  if(!shortcut){shortcut=document.createElement("button");shortcut.id="fixedCopiesShortcut";shortcut.type="button";shortcut.className="btn secondary";shortcut.textContent="Cópias de e-mail — Matriz e Filial";shortcut.onclick=()=>panel.scrollIntoView({behavior:"smooth",block:"start"});const nav=settings.querySelector(".config-nav");if(nav)nav.appendChild(shortcut);else panel.before(shortcut);}
}

function unitConfiguration(unit){
  if(!unit||unit==='todas')return null;
  try{const own=JSON.parse(localStorage.getItem('nucleo-unit-configs')||'[]').find(c=>c.id===unit);if(own)return own;const sectors=JSON.parse(localStorage.getItem('nucleo-unit-public-sectors')||'{}');if(sectors[unit]!==undefined)return {sectorList:sectors[unit]};}catch(_){}
  return null;
}
function ensureUnitQualitySettings(){
  const settings=document.getElementById('settingsView');if(!settings)return;
  let box=document.getElementById('unitQualitySettings');
  if(!box){box=document.createElement('div');box.id='unitQualitySettings';box.className='settings-block unit-settings-card';box.innerHTML="<div class=\"unit-settings-heading\"><div><span class=\"unit-settings-eyebrow\">ADMINISTRAÇÃO</span><h3>Configurações por unidade</h3><p class=\"help\">Cadastros, setores e e-mails próprios de cada fábrica.</p></div><label class=\"unit-settings-picker\"><div class=\"label\">Unidade em edição</div><select id=\"qualityConfigUnit\"><option value=\"matriz\">SETA SC — Matriz</option><option value=\"filial\">SETA ES — Unidade Linhares</option></select></label></div><div class=\"unit-settings-grid\"><section class=\"unit-settings-section\"><h4>Setores desta unidade</h4><label><div class=\"label\">Um setor por linha</div><textarea id=\"qualityConfigSectors\" rows=\"7\" placeholder=\"Ex.: Qualidade&#10;PCP&#10;Produção\"></textarea></label></section><section class=\"unit-settings-section\"><h4>Destinatários padrão</h4><label><div class=\"label\">E-mail da qualidade</div><input type=\"email\" id=\"qualityConfigEmail\" placeholder=\"qualidade@empresa.com.br\"></label><label><div class=\"label\">E-mail da Diretoria para SAC</div><input type=\"email\" id=\"qualityConfigDirector\" placeholder=\"diretoria@empresa.com.br\"></label><p class=\"help\">As cópias fixas são configuradas no bloco abaixo.</p></section></div><div class=\"unit-settings-footer\"><button class=\"btn primary\" id=\"qualityConfigSave\">Salvar configuração desta unidade</button><span id=\"qualityConfigStatus\" class=\"small\" role=\"status\"></span></div>";const users=document.getElementById('cfgUsers');if(users)users.before(box);else settings.prepend(box);document.getElementById('qualityConfigUnit').onchange=()=>{loadUnitQualitySettings();applySettingsUnitSelection();};document.getElementById('qualityConfigSave').onclick=saveUnitQualitySettings;}
  const isQuality=getSession()?.role==='quality';const select=document.getElementById('qualityConfigUnit');select.disabled=isQuality;if(isQuality)select.value='filial';
  ['cfgUnits','cfgTriage','cfgBackend','cfgIntegration'].forEach(id=>{const el=document.getElementById(id);if(el)el.style.display=isQuality?'none':'';});
  const addUnit=document.getElementById('newUserUnit');if(isQuality&&addUnit){addUnit.value='Unidade Linhares - Filial';addUnit.disabled=true;}
  if(isQuality){const notifications=document.getElementById('cfgNotifications');notifications?.querySelectorAll('.settings-block').forEach(el=>{if(el.id!=='fixedEmailCopiesPanel'&&!el.querySelector('#emailHistoryRows'))el.style.display='none';});}
  const roles=document.getElementById('newUserRole');if(roles&&!roles.querySelector('option[value=quality]')&&!isQuality){const option=document.createElement('option');option.value='quality';option.textContent='Qualidade — somente Filial';roles.appendChild(option);}
  loadUnitQualitySettings();
  renderOperationalUsers();applySettingsUnitSelection();
}
function loadUnitQualitySettings(){
  const unit=document.getElementById('qualityConfigUnit').value;const c=unitConfiguration(unit)||{};
  const sectors=c.sectorList??(unit==='matriz'?getConfiguredSectors('matriz').join('\n'):'');const legacyField=document.getElementById('sectorList');if(legacyField)legacyField.value=sectors;
  document.getElementById('qualityConfigSectors').value=sectors;document.getElementById('qualityConfigEmail').value=c.sgqNotificationEmail||'';document.getElementById('qualityConfigDirector').value=c.directorSacEmail||'';renderDocumentTypeSettings(unit);nucleoRenderDecisionSettings(unit);
}
async function saveUnitQualitySettings(){
  const unit=document.getElementById('qualityConfigUnit').value,data={sectorList:document.getElementById('qualityConfigSectors').value,sgqNotificationEmail:document.getElementById('qualityConfigEmail').value,directorSacEmail:document.getElementById('qualityConfigDirector').value};
  if(document.getElementById('documentTypeRows')){data.documentTypes=[...document.getElementById('documentTypeRows').children].map(row=>({id:row.dataset.typeId,label:row.querySelector('input').value.trim()}));if(data.documentTypes.some(t=>!t.label)||new Set(data.documentTypes.map(t=>t.label.toLocaleLowerCase())).size!==data.documentTypes.length){document.getElementById('qualityConfigStatus').textContent='Informe nomes diferentes e preenchidos para os tipos de documentos.';return;}}
  if(document.getElementById('nucleoDriveFolders')&&nucleoPersonFeatureCan('sectors','folders'))data.driveFolders=Object.fromEntries(['ros','pdcas','standard','requested','templates'].map(k=>[k,document.getElementById('ndFolder_'+k).value]));
  if(!nucleoPersonFeatureCan('sectors','edit'))delete data.sectorList;
  if(!nucleoPersonFeatureCan('sectors','emails')){delete data.sgqNotificationEmail;delete data.directorSacEmail;}
  if(!nucleoPersonFeatureCan('sectors','documentTypes'))delete data.documentTypes;
  if(document.getElementById('decisionRuleRows')&&nucleoPersonFeatureCan('sectors','decisions'))data.decisionRules=nucleoCollectDecisionRules();
  if(!Object.keys(data).length){alert('Seu acesso não inclui alterar estas configurações.');return;}
  const status=document.getElementById('qualityConfigStatus');status.textContent='Salvando...';
  try{const result=await portalJsonp({acao:'portal_save_unit_config',unit,data:JSON.stringify(data)},60000);if(!result?.sucesso)throw new Error(result?.erro||'Não confirmado.');await syncPortalBackend();refreshSectorSelectors();status.textContent='Configuração salva na base central.';}catch(e){status.textContent=e.message||String(e);}
}
function openUnitUserAccess(encoded){
 if(!nucleoPersonFeatureCan('users','permissions'))return;
 const id=decodeURIComponent(encoded),user=getOperationalUsers().find(u=>String(u.personId||u.email||u.name)===id);if(!user)return;
 const parent=nucleoPersonPermissions(getSession()),perms=nucleoPersonPermissions(user),units=nucleoPersonUnits(user),allowed=nucleoPersonUnits(getSession());
 if(!parent.sgq&&(user.role==='admin'||units.some(u=>!allowed.includes(u)))){alert('Este cadastro é administrado pelo SGQ.');return;}
 let overlay=document.getElementById('unitUserAccess');overlay?.remove();overlay=document.createElement('div');overlay.id='unitUserAccess';overlay.style.cssText='position:fixed;inset:0;background:#0008;z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px';
 overlay.innerHTML='<div style="background:white;padding:24px;border-radius:12px;max-width:760px;width:100%;max-height:90vh;overflow:auto"><h3>Editar acesso — '+escapeHtml(user.name)+'</h3><p>Escolha as unidades e marque somente as funções permitidas dentro de cada área.</p><div id="personAccessUnits">'+['matriz','filial'].map(u=>'<label style="display:inline-flex;gap:8px;margin:10px"><input type="checkbox" value="'+u+'" '+(units.includes(u)?'checked':'')+' '+(!allowed.includes(u)?'disabled':'')+' style="width:20px;height:20px">'+(u==='matriz'?'SETA SC — Matriz':'SETA ES — Linhares')+'</label>').join('')+'</div>'+nucleoFeatureEditor(user,getSession())+'<p><label><input id="personRegisterRo" type="checkbox" '+(perms.registerRo?'checked':'')+' '+(!parent.sgq&&!parent.registerRo?'disabled':'')+' style="width:20px;height:20px"> Cadastrar R.O. interna</label></p><p><label><input id="personRegisterExternal" type="checkbox" '+(perms.registerExternal?'checked':'')+' '+(!parent.sgq&&!parent.registerExternal?'disabled':'')+' style="width:20px;height:20px"> Cadastrar R.O. externa / SAC</label></p>'+(parent.sgq?'<p><label><input id="personSgq" type="checkbox" '+(perms.sgq?'checked':'')+' style="width:20px;height:20px"> Administração geral SGQ — todas as permissões, integração e configurações globais</label></p><details><summary>Setores unificados</summary><p class="small">Um vínculo por linha: matriz | PCP ou filial | PCP.</p><textarea id="unitAccessMemberships" rows="4"></textarea></details>':'')+'<p class="small">O cadastro e o e-mail continuam únicos. A alteração exige novo login da pessoa para atualizar seu acesso.</p><button class="btn primary" id="unitAccessSave">Salvar permissões</button> <button class="btn secondary" id="unitAccessClose">Fechar</button><p id="unitAccessStatus" role="status"></p></div>';
 document.body.appendChild(overlay);if(parent.sgq)document.getElementById('unitAccessMemberships').value=(user.sectorMemberships||[]).map(m=>m.unit+' | '+m.sector).join('\n');document.getElementById('unitAccessClose').onclick=()=>overlay.remove();
 overlay.querySelectorAll('[data-mode="manage"]').forEach(input=>input.onchange=()=>{if(input.checked)input.closest('tr').querySelector('[data-mode="view"]').checked=true;});
 document.getElementById('unitAccessSave').onclick=async()=>{
  const btn=document.getElementById('unitAccessSave'),status=document.getElementById('unitAccessStatus');btn.disabled=true;status.textContent='Salvando permissões na base central…';
  try{
   const next={version:1,modules:{},registerRo:document.getElementById('personRegisterRo').checked,registerExternal:document.getElementById('personRegisterExternal').checked,sgq:!!document.getElementById('personSgq')?.checked};
   next.detailVersion=1;next.features={};
   Object.keys(NUCLEO_PERSON_FEATURES).forEach(module=>{next.features[module]={};overlay.querySelectorAll('[data-feature-module="'+module+'"]').forEach(input=>next.features[module][input.dataset.feature]=input.checked);const entries=Object.entries(next.features[module]).filter(([,enabled])=>enabled);next.modules[module]={view:entries.length>0,manage:entries.some(([key])=>NUCLEO_PERSON_FEATURES[module][key][1])};});
   const accessUnits=[...overlay.querySelectorAll('#personAccessUnits input:checked')].map(x=>x.value);if(!accessUnits.length)throw new Error('Selecione ao menos uma unidade.');
   let memberships=user.sectorMemberships||[];
   if(parent.sgq)memberships=document.getElementById('unitAccessMemberships').value.split('\n').filter(x=>x.trim()).map(line=>{const parts=line.split('|');if(parts.length!==2)throw new Error('Informe unidade | setor em cada vínculo.');return {unit:parts[0].trim().toLowerCase(),sector:parts[1].trim()};});
   const result=await portalJsonp({acao:'portal_set_user_access',person:id,permissions:JSON.stringify(next),accessUnits:JSON.stringify(accessUnits),memberships:JSON.stringify(memberships)},60000);
   if(!result?.sucesso)throw new Error(result?.erro||'A base central não confirmou a alteração.');
   status.textContent='Permissões salvas na base central. A pessoa deve entrar novamente.';await syncPortalBackend(false);renderOperationalUsers();
  }catch(e){status.textContent='Não foi possível salvar: '+(/perfil inv[aá]lido/i.test(e.message)?'A implantação do Apps Script ainda usa a versão antiga dos perfis. Atualize o código e publique uma nova versão na implantação existente.':e.message);}finally{btn.disabled=false;}
 };
}

function userHasUnitSector(user,unit,sector){
  const key=normalizeAnswer(sector||'');
  if(unit==='todas')return normalizeAnswer(user.sector||'')===key||(user.sectorMemberships||[]).some(m=>normalizeAnswer(m.sector)===key);
  if((user.sectorMemberships||[]).some(m=>m.unit===unit&&normalizeAnswer(m.sector)===key))return true;
  return normalizePortalUnit(user.unit)===unit&&[user.sector,...(user.managedSectors||[])].some(s=>normalizeAnswer(s||'')===key);
}

function explicitPortalUnit(value){
  const text=normalizePersonName(value).replace(/[._]/g,' ').replace(/\s+/g,' ');
  const filial=/\bseta\s*es\b|\blinhares\b|\bfilial\b/.test(text);
  const matriz=/\bseta\s*sc\b|\bsao bento\b|\bmatriz\b/.test(text);
  if(filial&&matriz)return '';return filial?'filial':matriz?'matriz':'';
}
function explicitRecordUnit(record){
  const values=[record?.unidade,record?.unit,record?.roUnit,record?.raw?.__unidade,record?.__unidade,record?.raw?.Unidade,record?.raw?.['Unidade produtiva'],record?.raw?.['Em qual unidade produtiva ocorreu o problema?']];
  const units=[...new Set(values.map(explicitPortalUnit).filter(Boolean))];return units.length===1?units[0]:'';
}
function qualityRecordAllowed(record){const s=getSession()||{};if(Array.isArray(s.accessUnits))return s.accessUnits.includes(explicitRecordUnit(record));return s.role!=='quality'||explicitRecordUnit(record)==='filial';}

function applySettingsUnitSelection(){
  const unit=document.getElementById('qualityConfigUnit')?.value||'matriz';
  const field=document.getElementById('operationalUserUnit');if(field){const option=[...field.options].find(o=>explicitPortalUnit(o.value)===unit);field.value=option?.value||'';field.disabled=getSession()?.role==='quality';filterOperationalUsers();}
  const addUnit=document.getElementById('newUserUnit');if(addUnit){const option=[...addUnit.options].find(o=>explicitPortalUnit(o.value)===unit);if(option)addUnit.value=option.value;fillSectorSelect('newUserSector');}
  const panel=document.getElementById('fixedEmailCopiesPanel');if(panel){panel.querySelectorAll('input[id^="fixedCopy"]').forEach(input=>{const own=input.id.includes(unit==='filial'?'Filial':'Matriz');const label=input.closest('label');if(label)label.style.display=own?'':'none';});}
}

// Módulo de arquivos carregado sob demanda.
let nucleoDriveModulePromise=null;
function nucleoDriveLoad(){if(typeof nucleoDriveShow==='function')return Promise.resolve();if(!nucleoDriveModulePromise)nucleoDriveModulePromise=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=new URL('assets/modules/drive-documents.js?v=20261007-fix60',document.baseURI).href;const timer=setTimeout(()=>finish(new Error('Tempo limite ao carregar o módulo de arquivos. Tente novamente.')),20000);function finish(error){clearTimeout(timer);script.onload=script.onerror=null;if(error){script.remove();nucleoDriveModulePromise=null;reject(error);}else resolve();}script.onload=()=>finish();script.onerror=()=>finish(new Error('Não foi possível carregar o módulo de arquivos.'));document.head.appendChild(script);});return nucleoDriveModulePromise;}
async function nucleoDriveOpen(tab){try{await nucleoDriveLoad();await nucleoDriveShow(tab);}catch(e){alert(e.message);}}
function nucleoDriveSettingsShortcut(){
 const box=document.getElementById('unitQualitySettings');if(!box)return;
 box.style.display='block';
 if(document.getElementById('nucleoDriveFolders'))return;
 const section=document.createElement('section');section.id='nucleoDriveFolders';section.className='unit-settings-section';section.style.margin='16px 0';
 const labels={ros:'R.O.s',pdcas:'Respostas de PDCA',standard:'Documentos padrão',requested:'Documentos solicitados',templates:'Modelos editáveis'};
 section.innerHTML='<h4>Pastas do Drive desta unidade</h4><p class="small">Selecione a unidade acima e cole os links das pastas. Depois salve a configuração desta unidade.</p>'+Object.entries(labels).map(([k,label])=>'<label style="display:block;margin:10px 0"><span>'+label+'</span><div style="display:flex;gap:8px"><input id="ndFolder_'+k+'" type="url" style="flex:1;min-width:0" placeholder="https://drive.google.com/drive/folders/…"><button class="btn secondary" type="button" data-folder="'+k+'">Validar acesso</button></div><span id="ndFolderStatus_'+k+'" class="small" role="status"></span></label>').join('');
 box.querySelector('.unit-settings-footer').before(section);
 section.querySelectorAll('button[data-folder]').forEach(btn=>btn.onclick=async()=>{const kind=btn.dataset.folder,status=document.getElementById('ndFolderStatus_'+kind);btn.disabled=true;status.textContent='Validando…';try{const r=await portalJsonp({acao:'nucleo_drive_validate',unit:document.getElementById('qualityConfigUnit').value,kind,link:document.getElementById('ndFolder_'+kind).value},60000);if(!r?.sucesso)throw new Error(r?.erro||'Acesso não confirmado.');status.textContent='Acesso confirmado: '+r.name;}catch(e){status.textContent=e.message;}finally{btn.disabled=false;}});
 const unit=document.getElementById('qualityConfigUnit').value,c=unitConfiguration(unit)||{};Object.keys(labels).forEach(k=>document.getElementById('ndFolder_'+k).value=c.driveFolders?.[k]||'');
}

const nucleoOriginalEnsureUnitSettings=ensureUnitQualitySettings;
ensureUnitQualitySettings=function(...args){const result=nucleoOriginalEnsureUnitSettings(...args);nucleoDriveSettingsShortcut();return result;};
const nucleoOriginalLoadUnitSettings=loadUnitQualitySettings;
loadUnitQualitySettings=function(...args){const result=nucleoOriginalLoadUnitSettings(...args);const unit=document.getElementById('qualityConfigUnit')?.value,c=unitConfiguration(unit)||{};for(const kind of ['ros','pdcas','standard','requested','templates']){const field=document.getElementById('ndFolder_'+kind);if(field)field.value=c.driveFolders?.[kind]||'';const status=document.getElementById('ndFolderStatus_'+kind);if(status)status.textContent='';}return result;};
const nucleoOriginalCollectAdminModuleForm=collectAdminModuleForm;
collectAdminModuleForm=function(key,existing){const r=nucleoOriginalCollectAdminModuleForm(key,existing);if(key==='documents'){r.unit=existing?.unit||document.getElementById('ndRequestUnit')?.value||(getSession()?.role==='quality'?'filial':explicitPortalUnit(getSession()?.unit));}return r;};
const nucleoOriginalOpenPdcaReport=openPdcaReport;
openPdcaReport=function(id){const p=getAllSentPdcas().find(x=>String(x.id)===String(id));if(p?.externalPdf){if(!canViewPdca(p)){alert('PDCA fora do seu acesso.');return;}nucleoDriveOpenExternalPdf(p);return;}return nucleoOriginalOpenPdcaReport(id);};
async function nucleoDriveOpenExternalPdf(p){try{const r=await portalJsonp({acao:'nucleo_drive_file',fileId:p.fileId},90000);if(!r?.sucesso)throw new Error(r?.erro||'Arquivo indisponível.');const bytes=Uint8Array.from(atob(r.base64),c=>c.charCodeAt(0)),url=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));let overlay=document.getElementById('ndExternalPdf');if(overlay)overlay.remove();overlay=document.createElement('div');overlay.id='ndExternalPdf';overlay.style.cssText='position:fixed;inset:0;background:#0008;z-index:99999;padding:20px;display:flex;align-items:center;justify-content:center';overlay.innerHTML='<div style="background:white;padding:18px;border-radius:12px;width:95%;max-height:95vh;overflow:auto"><h3>'+escapeHtml(p.ro+' · '+p.setor+' · V'+(p.version||1))+'</h3><a class="btn secondary" download="'+escapeHtml(p.fileName||'PDCA.pdf')+'" href="'+url+'">Baixar original</a> <button class="btn secondary" id="ndPdfClose">Fechar</button>'+(nucleoPersonFeatureCan('pdca','present')?'<button class="btn primary" id="ndPdfPresent">Registrar apresentação</button>':'')+'<p id="ndExternalStatus" class="small"></p><iframe title="Resposta de PDCA" src="'+url+'" style="width:100%;height:70vh;border:1px solid #ddd"></iframe></div>';document.body.appendChild(overlay);document.getElementById('ndPdfClose').onclick=()=>{URL.revokeObjectURL(url);overlay.remove();};const btn=document.getElementById('ndPdfPresent');if(btn)btn.onclick=async()=>{btn.disabled=true;try{const updated={...p,status:'Apresentado',apresentadoEm:new Date().toISOString(),apresentadoPor:getSession()?.name,updatedAt:new Date().toISOString()};const confirmation=await portalJsonp({acao:'nucleo_drive_present_pdca',unit:explicitRecordUnit(p),id:p.id,fileId:p.fileId},60000);if(!confirmation?.sucesso)throw new Error(confirmation?.erro||'Apresentação não confirmada.');await syncPortalBackend(false);document.getElementById('ndExternalStatus').textContent='Apresentação confirmada na base central.';}catch(e){document.getElementById('ndExternalStatus').textContent=e.message;}finally{btn.disabled=false;}};}catch(e){alert(e.message);}}

const ndOriginalStandardCreate=openStandardDocumentCreate;
openStandardDocumentCreate=function(...args){const result=ndOriginalStandardCreate(...args);const input=document.getElementById('stdDocFile');if(input){const label=document.createElement('label');label.innerHTML='<span class="small">Unidade do documento</span><select id="ndStandardUnit" '+(getSession()?.role==='quality'?'disabled':'')+'><option value="matriz">SETA SC — Matriz</option><option value="filial">SETA ES — Unidade Linhares</option></select>';input.closest('label').before(label);const drive=document.createElement('div');drive.style.gridColumn='1/-1';drive.innerHTML='<button type="button" class="btn secondary" id="ndChooseStandardDrive">Selecionar na pasta do Drive</button><input id="ndStandardDriveId" type="hidden"><p id="ndStandardDriveName" class="small"></p><div id="ndStandardDriveList"></div>';input.closest('label').after(drive);document.getElementById('ndChooseStandardDrive').onclick=async()=>{try{await nucleoDriveLoad();await nucleoDriveChooseDocument('standard');}catch(e){document.getElementById('ndStandardDriveName').textContent=e.message;}};const clearDrive=()=>{document.getElementById('ndStandardDriveId').value='';document.getElementById('ndStandardDriveName').textContent='';document.getElementById('ndStandardDriveList').innerHTML='';};input.addEventListener('change',clearDrive);document.getElementById('ndStandardUnit').addEventListener('change',()=>{clearDrive();document.getElementById('stdDocCode').innerHTML=documentTypeOptions(document.getElementById('ndStandardUnit').value);});document.getElementById('ndStandardUnit').value=getSession()?.role==='quality'?'filial':document.getElementById('qualityConfigUnit')?.value||explicitPortalUnit(getSession()?.unit)||'matriz';}return result;};

const ndOriginalPdcaPresentation=openPdcaPresentation;
openPdcaPresentation=function(p){if(p?.externalPdf)return nucleoDriveOpenExternalPdf(p);return ndOriginalPdcaPresentation(p);};

saveStandardDocument=async function(){try{await nucleoDriveLoad();await nucleoDriveUploadStandard();}catch(e){alert(e.message);}};

function openUnitDriveSettings(){
 if(!nucleoFeatureRequire('sectors','folders'))return;
  if(!isAdmin())return;
  ensureUnitQualitySettings();
  nucleoDriveSettingsShortcut();
  const box=document.getElementById('unitQualitySettings');
  if(!box){alert('Não foi possível abrir as configurações por unidade.');return;}
  box.classList.remove('hidden');box.hidden=false;box.style.display='block';
  const settings=document.getElementById('settingsView');settings.classList.remove('hidden');
  box.scrollIntoView({behavior:'smooth',block:'start'});
  const field=document.getElementById('qualityConfigUnit');
  if(field&&!field.disabled)field.focus({preventScroll:true});
  box.style.outline='2px solid #1455ff';setTimeout(()=>box.style.outline='',1500);
}

async function openMyRoResponses(ro){
 const modal=document.createElement('div');modal.style.cssText='position:fixed;inset:0;background:#0008;z-index:99990;display:flex;align-items:center;justify-content:center;padding:20px';
 modal.innerHTML='<div style="background:white;border-radius:14px;padding:22px;max-width:850px;width:100%;max-height:90vh;overflow:auto"><h3>Respostas — '+escapeHtml(ro)+'</h3><button class="btn secondary" id="myResponsesClose">Fechar</button><div id="myResponsesItems" role="status">Consultando respostas disponibilizadas…</div></div>';document.body.appendChild(modal);modal.querySelector('#myResponsesClose').onclick=()=>modal.remove();
 const host=modal.querySelector('#myResponsesItems');
 try{const result=await portalJsonp({acao:'nucleo_drive_my_responses',ro},60000);if(!result?.sucesso)throw new Error(result?.erro||'Não foi possível consultar as respostas.');const items=result.items||[];host.innerHTML=items.length?items.map((p,i)=>'<div class="card" style="padding:12px;margin:10px 0"><b>'+escapeHtml(p.fileName)+'</b><p>'+escapeHtml(p.sector)+' · V'+escapeHtml(p.version)+' · '+escapeHtml(new Date(p.createdAt).toLocaleString('pt-BR'))+'</p><button class="btn primary" data-response="'+i+'">Visualizar / baixar PDCA</button></div>').join(''):'Nenhuma resposta foi disponibilizada para o seu cadastro ainda. O SGQ precisa confirmar o reclamante e disponibilizar o PDCA no Núcleo.';host.querySelectorAll('[data-response]').forEach(btn=>btn.onclick=()=>{const p=items[Number(btn.dataset.response)];nucleoDriveOpenExternalPdf({...p,setor:p.sector});});}catch(e){host.textContent=e.message;}
}

async function confirmReceivedPdcaClaimant(id){
 if(!isAdmin())return;
 const p=getAllSentPdcas().find(x=>String(x.id)===String(id));if(!p?.externalPdf)return;
 try{
  await nucleoDriveLoad();
  const unit=explicitRecordUnit(p);if(!['matriz','filial'].includes(unit))throw new Error('Unidade da resposta não identificada.');
  nucleoDriveState.unit=unit;
  let host=document.getElementById('nucleoDriveOverlay');if(host)host.remove();
  host=document.createElement('div');host.id='nucleoDriveOverlay';host.style.cssText='position:fixed;inset:0;background:#16324d88;z-index:99990;display:flex;padding:20px;align-items:center;justify-content:center';
  host.innerHTML='<div style="background:white;border-radius:16px;padding:22px;width:min(900px,100%);max-height:94vh;overflow:auto"><button class="btn secondary" id="ndReceivedClose">Fechar</button><p id="ndStatus" role="status">Consultando resposta na base central…</p><div id="ndContent"></div></div>';
  document.body.appendChild(host);document.getElementById('ndReceivedClose').onclick=()=>{if(!nucleoDriveState.busy)host.remove();};
  const result=await nucleoDriveApi('nucleo_drive_overview');nucleoDriveState.pdcaFiles=result.pdcaFiles||[];
  const record=nucleoDriveState.pdcaFiles.find(x=>x.id===p.pdcaFileId||x.fileId===p.fileId);
  if(!record)throw new Error('Resposta não encontrada na base central. Sincronize e tente novamente.');
  nucleoDriveStatus('Confirme o cadastro para liberar o PDF ao reclamante.');
  await nucleoDriveSendPdca(record.id,p.ro);
 }catch(e){const status=document.getElementById('ndStatus');if(status)status.textContent=e.message;else alert(e.message);}
}

// A expiração central encerra o acesso local sem apagar cadastros ou rascunhos.
let nucleoEndingExpiredSession=false;
function nucleoSessionError(data){return data?.sucesso===false&&/sess[aã]o (?:inv[aá]lida ou )?expirada/i.test(String(data.erro||data.error||''));}
function nucleoEndExpiredSession(){
 if(nucleoEndingExpiredSession||!getSession()?.authToken)return;
 nucleoEndingExpiredSession=true;
 try{sessionStorage.setItem('nucleo-session-expired-notice','1')}catch(_){}
 logoutUser();
}
function nucleoCheckSessionExpiry(){
 const session=getSession();
 if(session?.authToken&&session.sessionExpiryClockVersion===2&&Number(session.sessionExpiresAt)>0&&Number(session.sessionExpiresAt)<=Date.now())nucleoEndExpiredSession();
}
setInterval(nucleoCheckSessionExpiry,30000);
window.addEventListener('focus',nucleoCheckSessionExpiry);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')nucleoCheckSessionExpiry();});

async function nucleoSyncAfterLogin(token){
 if(!token||getSession()?.authToken!==token)return;
 const status=document.getElementById('syncMsg');if(status)status.textContent='Atualizando dados da base central após o login…';
 try{await syncPortalBackend(false);}catch(e){console.warn('Atualização central após login:',e);}
 if(getSession()?.authToken!==token)return;
 // Uma falha na atualização de cadastros não impede a tentativa de carregar as R.O.s.
 if(!getSession()?.permissions||nucleoPersonCan('ros')){try{await refreshLegacyRoCacheFromApi(true);}catch(e){console.warn('Atualização de R.O.s após login:',e);}}
 if(getSession()?.authToken!==token)return;
 try{refreshSectorSelectors();populateTriageSectors();render();}catch(e){console.warn('Atualização da tela após login:',e);}
}

function nucleoPersonPermissions(user){
 if(user.permissions?.version===1)return user.permissions;
 const elevated=['admin','quality'].includes(user.role),modules={};Object.keys(NUCLEO_PERSON_MODULES).forEach(k=>modules[k]={view:elevated||['ros','pdca','sac'].includes(k),manage:elevated});
 if(!elevated)modules.documents.view=['comercial interno','comercial externo','diretoria','sgq'].includes(normalizeAnswer(user.sector||''));
 return {version:1,modules,registerRo:user.role!=='admin',registerExternal:user.role==='quality'||['comercial interno','comercial externo','diretoria','processos','sgq'].includes(normalizeAnswer(user.sector||'')),sgq:user.role==='admin'};
}
function nucleoPersonCan(module,manage=false){const user=getSession();if(!user)return false;const p=nucleoPersonPermissions(user);return !!(p.sgq||p.modules[module]?.[manage?'manage':'view']);}
function nucleoPersonUnits(user){return Array.isArray(user.accessUnits)?user.accessUnits:user.role==='admin'?['matriz','filial']:user.role==='quality'?['filial']:[explicitPortalUnit(user.unit)||'matriz'];}
function nucleoApplyPersonAccess(){
 const user=getSession();if(!user?.permissions)return;
 const map={navRos:'ros',navAssignedRos:'ros',navMySubmittedRos:'ros',navTriage:'ros',navContests:'ros',navSent:'pdca',navActions:'pdca',navPendingActions:'pdca',navExternalPdcas:'pdca',navExternalRoControl:'sac',navMySacs:'sac',navSacTracking:'sac',navDocuments:'documents',navDocumentRequests:'documents',navIndicators:'indicators',navAnnouncements:'announcements',navEquipment:'equipment',navTraining:'training',navNcCapa:'nc',navProcesses:'processes'};
 Object.entries(map).forEach(([id,module])=>{const el=document.getElementById(id);if(!el)return;const allowed=nucleoPersonCan(module,id==='navTriage'||id==='navExternalRoControl');if(!allowed){el.style.setProperty('display','none','important');el.classList.add('hidden');}else{el.style.removeProperty('display');el.classList.remove('hidden');}});
 nucleoApplyFeatureAccess();
 ['cfgUsers','unitQualitySettings','cfgNotifications','cfgUnits'].forEach(id=>{const el=document.getElementById(id);if(!el)return;const module=id==='cfgUsers'?'users':'sectors';el.style.setProperty('display',nucleoPersonCan(module)?'':'none','important');});
}

function nucleoAnnouncementSelectedUnits(){
 const allowed=nucleoPersonUnits(getSession());
 const value=document.getElementById('announcementUnit')?.value||allowed[0];
 return value==='todas'?allowed:allowed.filter(u=>u===value);
}
function nucleoAnnouncementUnitUi(){
 const select=document.getElementById('announcementUnit');if(!select)return;
 const allowed=nucleoPersonUnits(getSession()),current=select.value;
 select.innerHTML=(allowed.length===2?'<option value="todas">Matriz e filial</option>':'')+allowed.map(u=>'<option value="'+u+'">'+(u==='filial'?'SETA ES — Linhares':'SETA SC — Matriz')+'</option>').join('');
 if([...select.options].some(o=>o.value===current))select.value=current;
 select.disabled=allowed.length===1;
 refreshAnnouncementSectorSelect();
}
function nucleoAnnouncementInScope(a,user){
 const targets=Array.isArray(a.units)&&a.units.length?a.units:[explicitPortalUnit(a.unit)||'matriz'];
 return nucleoPersonUnits(user).some(u=>targets.includes(u));
}

function nucleoPersonFeatureAllowed(user,module,feature){
 if(!user)return false;
 const p=nucleoPersonPermissions(user),definition=NUCLEO_PERSON_FEATURES[module]?.[feature];if(!definition)return false;
 if(p.sgq)return true;
 if(p.detailVersion===1)return p.features?.[module]?.[feature]===true;
 return p.modules[module]?.[definition[2]]===true;
}
function nucleoPersonFeatureCan(module,feature){return nucleoPersonFeatureAllowed(getSession(),module,feature);}
function nucleoFeatureRequire(module,feature){if(nucleoPersonFeatureCan(module,feature))return true;alert('Seu acesso não inclui: '+(NUCLEO_PERSON_FEATURES[module]?.[feature]?.[0]||'esta função')+'.');return false;}
function nucleoFeatureEditor(user,parent){
 return Object.entries(NUCLEO_PERSON_FEATURES).map(([module,features])=>'<details class="person-feature-group" style="border:1px solid #dce4ee;border-radius:10px;margin:10px 0;padding:12px" '+(module==='ros'?'open':'')+'><summary style="cursor:pointer;font-weight:700">'+escapeHtml(NUCLEO_PERSON_MODULES[module])+'</summary><div style="display:grid;gap:10px;margin-top:14px">'+Object.entries(features).map(([key,[label]])=>'<label style="display:flex;gap:10px;align-items:center"><input type="checkbox" data-feature-module="'+module+'" data-feature="'+key+'" '+(nucleoPersonFeatureAllowed(user,module,key)?'checked ':'')+(!nucleoPersonFeatureAllowed(parent,module,key)?'disabled ':'')+'style="width:22px;height:22px;flex-shrink:0">'+escapeHtml(label)+'</label>').join('')+'</div></details>').join('');
}
function nucleoApplyFeatureAccess(){
 if(getSession()?.permissions?.detailVersion!==1)return;
 const nav={navRos:['ros','consult'],navAssignedRos:['ros','assigned'],navMySubmittedRos:['ros','submitted'],navTriage:['ros','triage'],navContests:['ros','reviewContests'],navSent:['pdca','received'],navActions:['pdca','actions'],navPendingActions:['pdca','reviewActions'],navExternalPdcas:['pdca','import'],navExternalRoControl:['sac','edit'],navMySacs:['sac','consult'],navSacTracking:['sac','consult'],navDocuments:['documents','*'],navDocumentRequests:['documents','request'],navIndicators:['indicators','consult'],navAnnouncements:['announcements','publish'],navEquipment:['equipment','*'],navTraining:['training','*'],navNcCapa:['nc','*'],navProcesses:['processes','*']};
 Object.entries(nav).forEach(([id,[module,key]])=>{const el=document.getElementById(id);if(el&&!(key==='*'?nucleoPersonCan(module):nucleoPersonFeatureCan(module,key))){el.style.setProperty('display','none','important');el.classList.add('hidden');}});
}

function nucleoWorkspaceFeature(key,mode){
 const module=key==='nccapa'?'nc':key;
 const maps={documents:{new:'request',mine:'consult',standards:'standards',deliveries:'history',doc_analysis:'prepare',doc_preparation:'prepare',doc_ready:'deliver',history:'consult'},processes:{new:'edit',published:'consult',review:'review',pending:'review',history:'history',templates:'templates'},equipment:{new:'edit',active:'consult',pending:'pending',history:'history'},training:{new:'edit',active:'consult',pending:'pending',history:'history'},nccapa:{new_rnc:'edit',new_internal:'edit',active:'consult',history:'consult'}};
 return [module,maps[key]?.[mode]||'consult'];
}
function nucleoWorkspaceAllowed(key,mode){const [module,feature]=nucleoWorkspaceFeature(key,mode);return nucleoPersonFeatureCan(module,feature);}
function nucleoApplyFeatureButtons(){
 if(getSession()?.permissions?.detailVersion!==1)return;
 document.querySelectorAll('[onclick]').forEach(el=>{
  const handler=el.getAttribute('onclick')||'';const name=handler.match(/^\s*([A-Za-z_][\w]*)\(/)?.[1];const spec=NUCLEO_FEATURE_BUTTONS[name];
  if(spec&&!nucleoPersonFeatureCan(spec[0],spec[1]))el.style.setProperty('display','none','important');
 });
 [['sectorList','edit'],['qualityConfigSectors','edit'],['qualityConfigEmail','emails'],['qualityConfigDirector','emails']].forEach(([id,key])=>{const el=document.getElementById(id);if(el)el.disabled=!nucleoPersonFeatureCan('sectors',key);});
 const types=document.getElementById('documentTypeRows')?.parentElement;if(types&&!nucleoPersonFeatureCan('sectors','documentTypes'))types.querySelectorAll('input,button').forEach(el=>el.disabled=true);
 const folders=document.getElementById('nucleoDriveFolders');if(folders&&!nucleoPersonFeatureCan('sectors','folders'))folders.querySelectorAll('input,button').forEach(el=>el.disabled=true);
}
let nucleoFeatureButtonRefresh=false;
new MutationObserver(()=>{if(nucleoFeatureButtonRefresh)return;nucleoFeatureButtonRefresh=true;queueMicrotask(()=>{nucleoFeatureButtonRefresh=false;nucleoApplyFeatureButtons();});}).observe(document.body,{childList:true,subtree:true});

function nucleoRoClassification(ro,map){
 return String((resolvedTriageForRo(ro,map)||{}).classification||ro.classificacaoSGQ||'').trim();
}
function nucleoClassificationOptions(){
 const map=getSavedTriageMap(),names=new Map();
 ['Falta de caixa',...NUCLEO_CLASSIFICATION_MS,...getAllRoRecords().flatMap(ro=>nucleoRoClassifications(ro,map))].filter(Boolean).forEach(name=>{const key=normalizeAnswer(name);if(!names.has(key))names.set(key,name);});
 return [...names.values()].sort((a,b)=>a.localeCompare(b,'pt-BR'));
}
function nucleoRefreshClassificationOptions(){
 const list=document.getElementById('triageClassificationOptions');if(list)list.innerHTML=nucleoClassificationOptions().map(name=>'<option value="'+escapeHtml(name)+'"></option>').join('');
}
function nucleoRefreshIndicatorClassificationOptions(){
 const select=document.getElementById('sgqIndicatorClassification');if(!select)return;const value=select.value;
 select.innerHTML='<option value="all">Todas as classificações</option>'+nucleoClassificationOptions().map(name=>'<option value="'+escapeHtml(name)+'">'+escapeHtml(name)+'</option>').join('');
 if([...select.options].some(o=>o.value===value))select.value=value;
}
function nucleoRenderClassificationIndicators(data){
 const host=document.getElementById('sgqByClassification');if(!host)return;
 const map=getSavedTriageMap(),rows=new Map();
 getAllRoRecords().filter(ro=>sgqIndicatorMatchesFilters(ro,map,data.filters)).forEach(ro=>{
  const names=nucleoRoClassifications(ro,map);
  (names.length?names:['Sem classificação']).forEach(name=>{const key=normalizeAnswer(name);
  if(!rows.has(key))rows.set(key,{name,total:0,record:0,cancelled:0,obsolete:0,directed:0});
  const row=rows.get(key);row.total++;const status=sgqIndicatorStatusCode(ro,map);if(status in row)row[status]++;});
 });
 host.innerHTML=rows.size?'<p class="small">Uma R.O. com várias classificações é contada em cada uma delas.</p><div style="overflow:auto"><table style="width:100%"><thead><tr><th>Classificação</th><th>Total</th><th>Registro</th><th>Canceladas</th><th>Obsoletas</th><th>Direcionadas</th></tr></thead><tbody>'+[...rows.values()].sort((a,b)=>b.total-a.total||a.name.localeCompare(b.name,'pt-BR')).map(row=>'<tr><td>'+escapeHtml(row.name)+'</td><td>'+row.total+'</td><td>'+row.record+'</td><td>'+row.cancelled+'</td><td>'+row.obsolete+'</td><td>'+row.directed+'</td></tr>').join('')+'</tbody></table></div>':'<p class="small">Nenhuma ocorrência para os filtros escolhidos.</p>';
}

function nucleoDecisionRules(unit){const config=unitConfiguration(unit)||{};return Array.isArray(config.decisionRules)?config.decisionRules:NUCLEO_DEFAULT_DECISIONS;}
function nucleoDecisionForRecord(ro,tri){const unit=explicitRecordUnit(ro)||explicitPortalUnit(tri?.unit)||'matriz';return nucleoDecisionRules(unit).find(rule=>rule.id===(tri?.decisionId||tri?.decision))||tri?.decisionRule||NUCLEO_DEFAULT_DECISIONS.find(rule=>rule.id===tri?.decision);}
function nucleoPopulateDecisions(ro,tri){
 const select=document.getElementById('triageDecision'),unit=explicitRecordUnit(ro)||'matriz',rules=nucleoDecisionRules(unit),current=nucleoDecisionForRecord(ro,tri);
 const options=rules.filter(rule=>rule.active!==false);if(current&&!options.some(rule=>rule.id===current.id))options.push(current);
 select.innerHTML=options.map(rule=>'<option value="'+escapeHtml(rule.id)+'">'+escapeHtml(rule.label)+(rule.active===false?' (desativada)':'')+'</option>').join('')+'<option value="unit_correction">Correção de unidade</option>';
 select.value=current?.id||options[0]?.id||'unit_correction';select._decisionRules=rules.concat(current?[current]:[]);
}
function nucleoSelectedDecision(){const select=document.getElementById('triageDecision');if(select?.value==='unit_correction')return {id:'unit_correction',behavior:'unit_correction',requireReason:false,pdcaRequired:false};const rule=select?._decisionRules?.find(rule=>rule.id===select.value);if(!rule)throw new Error('A decisão selecionada não foi encontrada. Reabra a triagem e selecione novamente.');return rule;}
function nucleoDecisionDeadline(rule){if(rule.deadlineDays===null||rule.deadlineDays===undefined)return nextTuesdayIsoDate();const date=new Date();date.setDate(date.getDate()+Number(rule.deadlineDays));return date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0')+'-'+String(date.getDate()).padStart(2,'0');}
function nucleoRenderDecisionSettings(unit){
 let box=document.getElementById('decisionRuleSettings');if(!box){box=document.createElement('section');box.id='decisionRuleSettings';box.className='unit-settings-section';document.getElementById('unitQualitySettings').appendChild(box);}
 box.innerHTML='<h3>Decisões de R.O.</h3><p class="small">Altere nomes e regras desta unidade. Desative uma opção para retirá-la das novas triagens; o histórico será preservado. Mudanças de regra serão aplicadas ao salvar uma nova triagem.</p><div id="decisionRuleRows"></div><button class="btn secondary" id="addDecisionRule">Adicionar decisão</button> <button class="btn primary" onclick="nucleoSaveDecisionRules()">Salvar decisões desta unidade</button><p id="decisionRuleStatus" role="status"></p>';
 nucleoDecisionRules(unit).forEach(nucleoAddDecisionRow);document.getElementById('addDecisionRule').onclick=()=>nucleoAddDecisionRow({id:'decision_'+Date.now().toString(36),label:'',behavior:'record',active:true,requireSector:false,requireReason:true,pdcaRequired:false,deadlineDays:null,color:'#fff9e5'});
 if(!nucleoPersonFeatureCan('sectors','decisions'))box.querySelectorAll('input,select,button').forEach(el=>el.disabled=true);
}
function nucleoAddDecisionRow(rule){
 const row=document.createElement('div');row.dataset.decisionId=rule.id;row.style.cssText='border:1px solid #dde4ed;padding:14px;border-radius:10px;margin:10px 0;display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px';
 row.innerHTML='<label>Nome<input data-rule="label" value="'+escapeHtml(rule.label)+'"></label><label>Comportamento<select data-rule="behavior">'+[['directed','Direcionamento'],['record','Somente registro'],['cancelled','Cancelamento'],['obsolete','Obsolescência']].map(([id,label])=>'<option value="'+id+'">'+label+'</option>').join('')+'</select></label><label>Cor<input data-rule="color" type="color" value="'+escapeHtml(rule.color||'#fff9e5')+'"></label><label>Prazo de PDCA (dias)<input data-rule="deadlineDays" type="number" min="0" max="365" placeholder="Vazio: próxima terça-feira" value="'+(rule.deadlineDays??'')+'"></label>'+[['active','Disponível para novas triagens'],['requireSector','Exigir setor'],['requireReason','Exigir motivo'],['pdcaRequired','Exigir PDCA']].map(([key,label])=>'<label style="display:flex;gap:8px;align-items:center"><input style="width:20px;height:20px" type="checkbox" data-rule="'+key+'" '+(rule[key]?'checked':'')+'>'+label+'</label>').join('');
 document.getElementById('decisionRuleRows').appendChild(row);row.querySelector('[data-rule="behavior"]').value=rule.behavior;
 const refresh=()=>{const directed=row.querySelector('[data-rule="behavior"]').value==='directed';const sector=row.querySelector('[data-rule="requireSector"]');sector.disabled=directed;if(directed)sector.checked=true;const pdca=row.querySelector('[data-rule="pdcaRequired"]');pdca.disabled=!directed;if(!directed)pdca.checked=false;row.querySelector('[data-rule="deadlineDays"]').disabled=!directed;};row.querySelector('[data-rule="behavior"]').onchange=refresh;refresh();
}
function nucleoCollectDecisionRules(){return [...document.getElementById('decisionRuleRows').children].map(row=>{const rule={id:row.dataset.decisionId};row.querySelectorAll('[data-rule]').forEach(input=>rule[input.dataset.rule]=input.type==='checkbox'?input.checked:input.dataset.rule==='deadlineDays'?(input.value===''?null:Number(input.value)):input.value.trim());return rule;});}
function nucleoSectorDecisionIndicators(data){
 const map=getSavedTriageMap(),rows=new Map(),sent=getAllSentPdcas();
 getAllRoRecords().filter(ro=>sgqIndicatorMatchesFilters(ro,map,data.filters)).forEach(ro=>{
  const resolved=resolvedTriageForRo(ro,map)||{};const assignments=resolved.decision==='directed'&&typeof getTriageRecordsForRoNumber==='function'?getTriageRecordsForRoNumber(String(ro.numero||ro.id),map).filter(t=>t.decision==='directed'):[];const unique=new Map();(assignments.length?assignments:[resolved]).forEach(t=>unique.set(sectorCompareKey(t.responsibleSector||t.decisionSector||''),t));
  for(const tri of unique.values()){const sector=tri.decisionSector||tri.responsibleSector||effectiveRoSector(ro,map)||'Sem setor',key=sectorCompareKey(sector);
  if(!rows.has(key))rows.set(key,{name:sector,total:0,cancelled:0,record:0,obsolete:0,pending:0,responded:0,presented:0,done:0,triage:0,decisions:new Map()});const row=rows.get(key);row.total++;
  const status=tri.decision||sgqIndicatorStatusCode(ro,map),rule=nucleoDecisionForRecord(ro,tri),label=rule?.label||tri.decisionLabel||triageDecisionLabel(tri.decision);
  row.decisions.set(label,(row.decisions.get(label)||0)+1);
  if(['cancelled','record','obsolete'].includes(status)){row[status]++;continue;}
  if(status!=='directed'){row[status==='done'?'done':'triage']++;continue;}
  if(tri.pdcaRequired===false){row.done++;continue;}
  const p=sent.filter(p=>String(p.ro||p.roId)===String(ro.numero||ro.id)&&(!p.setor&&!p.sector||sectorCompareKey(p.setor||p.sector)===sectorCompareKey(sector))&&(!explicitRecordUnit(p)||explicitRecordUnit(p)===explicitRecordUnit(ro))).sort((a,b)=>String(b.createdAt||b.dataHora||'').localeCompare(String(a.createdAt||a.dataHora||'')))[0];
  const ps=pdcaStatusLabel(p);row[ps==='Apresentado'?'presented':ps==='Respondido'?'responded':ps==='Concluído'?'done':'pending']++;
 }
 });return [...rows.values()].sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'));
}
function nucleoRenderSectorDecisionIndicators(data){
 const host=document.getElementById('sgqBySector');if(!host)return;const rows=nucleoSectorDecisionIndicators(data);
 host.innerHTML=rows.length?'<div style="overflow:auto"><table style="width:100%;min-width:850px"><thead><tr><th>Setor</th><th>Total</th><th>Canceladas</th><th>Registro</th><th>Obsoletas</th><th>Pendentes</th><th>Respondidas</th><th>Apresentadas</th><th>Concluídas</th><th>A triar</th><th>Decisões</th></tr></thead><tbody>'+rows.map(row=>'<tr><td>'+escapeHtml(row.name)+'</td>'+['total','cancelled','record','obsolete','pending','responded','presented','done','triage'].map(key=>'<td>'+row[key]+'</td>').join('')+'<td>'+[...row.decisions].map(([label,count])=>escapeHtml(label)+': '+count).join('<br>')+'</td></tr>').join('')+'</tbody></table></div>':'<p class="small">Nenhuma ocorrência para os filtros.</p>';
}

function nucleoRefreshIndicatorDecisions(){
 const select=document.getElementById('sgqIndicatorDecision');if(!select)return;const current=select.value,map=new Map();
 for(const unit of nucleoPersonUnits(getSession()))for(const rule of nucleoDecisionRules(unit))map.set(rule.id,rule.label);
 for(const ro of getAllRoRecords()){const tri=getRoTriageRecord(ro)||{},rule=nucleoDecisionForRecord(ro,tri);if(rule)map.set(rule.id,rule.label);}
 select.innerHTML='<option value="all">Todas as decisões</option>'+[...map].map(([id,label])=>'<option value="'+escapeHtml(id)+'">'+escapeHtml(label)+'</option>').join('');if([...select.options].some(o=>o.value===current))select.value=current;
}

async function nucleoSaveDecisionRules(){
 if(!nucleoFeatureRequire('sectors','decisions'))return;
 const status=document.getElementById('decisionRuleStatus'),unit=document.getElementById('qualityConfigUnit').value;status.textContent='Salvando decisões na base central…';
 try{const rules=nucleoCollectDecisionRules(),result=await portalJsonp({acao:'portal_save_unit_config',unit,data:JSON.stringify({decisionRules:rules})},60000);if(!result?.sucesso)throw new Error(result?.erro||'Salvamento não confirmado.');const configs=JSON.parse(localStorage.getItem('nucleo-unit-configs')||'[]'),old=configs.find(c=>c.id===unit)||{};localStorage.setItem('nucleo-unit-configs',JSON.stringify([...configs.filter(c=>c.id!==unit),{...old,id:unit,unit,decisionRules:rules}]));status.textContent='Decisões salvas na base central. Novas triagens usarão estas regras.';}catch(error){status.textContent='Não foi possível salvar: '+error.message;}
}

const NUCLEO_CLASSIFICATION_MS=['Método','Máquina','Mão de obra','Material','Medição','Meio ambiente'];
function nucleoRoClassifications(ro,map){
 const tri=resolvedTriageForRo(ro,map)||{};
 if(Array.isArray(tri.classificationMs))return [...tri.classificationMs,...(tri.classificationOther?[tri.classificationOther]:[])];
 const legacy=nucleoRoClassification(ro,map);return legacy?[legacy]:[];
}
function nucleoToggleClassificationOther(){
 const checked=document.getElementById('triageClassificationOther').checked;
 document.getElementById('triageClassificationOtherWrap').hidden=!checked;
 document.getElementById('triageClassification').required=checked;
}
function nucleoLoadClassification(tri,ro){
 const input=document.getElementById('triageClassification');
 if(!document.getElementById('triageClassificationChoices')&&input){
  const host=document.createElement('div');host.id='triageClassificationChoices';host.style.cssText='display:flex;flex-wrap:wrap;gap:12px';input.before(host);
  const wrap=document.createElement('div');wrap.id='triageClassificationOtherWrap';input.before(wrap);wrap.appendChild(input);
  const label=host.parentElement.querySelector('.label');if(label)label.textContent='Classificação da R.O. — 6Ms *';
 }
 const legacy=String(tri.classification||ro.classificacaoSGQ||'').trim();
 const structured=Array.isArray(tri.classificationMs);
 const ms=structured?tri.classificationMs:NUCLEO_CLASSIFICATION_MS.filter(name=>normalizeAnswer(name)===normalizeAnswer(legacy));
 const other=structured?String(tri.classificationOther||''):(ms.length?'':legacy);
 document.getElementById('triageClassificationChoices').innerHTML=[...NUCLEO_CLASSIFICATION_MS,'Outra classificação'].map((name,i)=>'<label style="display:flex;align-items:center;gap:7px"><input type="checkbox" '+(i===6?'id="triageClassificationOther" onchange="nucleoToggleClassificationOther()"':'class="triage-classification-m" value="'+escapeHtml(name)+'"')+' style="width:20px;height:20px" '+((i===6?!!other:ms.includes(name))?'checked':'')+'>'+escapeHtml(name)+'</label>').join('');
 document.getElementById('triageClassification').value=other;nucleoRefreshClassificationOptions();nucleoToggleClassificationOther();
}
function nucleoReadClassification(){
 const ms=[...document.querySelectorAll('.triage-classification-m:checked')].map(el=>el.value);
 const otherChecked=document.getElementById('triageClassificationOther').checked;
 let other=otherChecked?document.getElementById('triageClassification').value.trim().replace(/\s+/g,' '):'';
 if(other)other=nucleoClassificationOptions().find(name=>normalizeAnswer(name)===normalizeAnswer(other))||other;
 if(otherChecked&&!other){alert('Preencha a outra classificação.');document.getElementById('triageClassification').focus();return null;}
 if(!ms.length&&!other){alert('Selecione pelo menos uma classificação dos 6Ms ou informe outra classificação.');return null;}
 return {ms,other,labels:[...ms,...(other?[other]:[])]};
}

let nucleoRoSearchTimer;
function nucleoScheduleRoSearch(){clearTimeout(nucleoRoSearchTimer);nucleoRoSearchTimer=setTimeout(nucleoRunRoSearch,180);}
function nucleoRunRoSearch(){clearTimeout(nucleoRoSearchTimer);render();}
function nucleoRoSearchMatches(ro,query){
 const q=String(query||'').trim().toLowerCase();if(!q)return true;
 const number=String(ro.numero||ro.id||ro.codigo||'');
 if(/^\d+$/.test(q)){const digits=number.match(/\d+/g);return !!digits&&digits.some(part=>Number(part)===Number(q));}
 return normalizeAnswer([number,ro.cliente||'',ro.origemBase||''].join(' ')).includes(normalizeAnswer(q));
}

function nucleoPdcaDelivery(p){let deliveries=[];try{deliveries=JSON.parse(localStorage.getItem('nucleo-pdca-dispatches-v1')||'[]');}catch(_){}return deliveries.find(d=>d.ro===p.ro&&d.unit===explicitRecordUnit(p)&&(d.pdcaFileId===p.pdcaFileId||d.fileId&&d.fileId===p.fileId)&&Number(d.version||1)===Number(p.version||1));}

function nucleoConsultPdcaClaimant(id){const p=getAllSentPdcas().find(p=>p.id===id);if(!p)return;const ro=getAllRoRecords().find(r=>String(r.numero||r.id)===p.ro&&explicitRecordUnit(r)===explicitRecordUnit(p));const binding=ro&&claimantIdentityIndex().bindings.get(claimantRoKey(ro));const user=ro&&resolveRoClaimant(ro);alert('Reclamante confirmado: '+(user?personDisplayName(user):'Cadastro indisponível')+(binding?.confirmedBy?'\nConfirmado por: '+binding.confirmedBy:'')+(binding?.confirmedAt?'\nData: '+new Date(binding.confirmedAt).toLocaleString('pt-BR'):''));}

async function nucleoDeleteTriageConfirmed(id){
 if(!id)throw new Error('Direcionamento anterior não identificado.');
 if(!portalBackendEnabled())throw new Error('Apps Script não configurado.');
 const result=await portalJsonp({acao:'portal_delete',colecao:'triage',id:String(id),ator:getSession()?.name||'SGQ'},60000);
 if(!result?.sucesso)throw new Error(result?.erro||'A base central não confirmou a exclusão da triagem anterior.');
 return result;
}

function nucleoSetPdcaLifecycle(value){document.getElementById('sentLifecycleFilter').value=value;document.getElementById('sentStatusFilter').value='todos';renderSentPdcas();}
function nucleoRenderPdcaLifecycle(data,lifecycle){
 const tabs=document.getElementById('sentLifecycleTabs');if(tabs)tabs.style.display=isAdmin()?'flex':'none';
 const active=data.filter(p=>!nucleoPdcaDelivery(p)).length,history=data.length-active;
 [['sentActiveTab','active','Pendências e confirmações',active],['sentHistoryTab','history','Histórico — encerradas',history]].forEach(([id,value,label,count])=>{const el=document.getElementById(id);if(el){el.textContent=label+' ('+count+')';el.className='btn '+(lifecycle===value?'primary':'secondary');el.setAttribute('aria-selected',String(lifecycle===value));}});
 const text=document.getElementById('sentLifecycleDescription');if(text)text.textContent=!isAdmin()?'Respostas disponíveis para consulta.':lifecycle==='history'?'Respostas já entregues ao reclamante. Encerradas nesta etapa e mantidas para consulta e indicadores.':'Confirme o reclamante e entregue a resposta. Reclamante já confirmado não exige nova confirmação de identidade.';
}

function nucleoShowTriageBuild(){const host=document.getElementById('triageModalOverlay');if(!host)return;let badge=document.getElementById('nucleoTriageBuild');if(!badge){badge=document.createElement('p');badge.id='nucleoTriageBuild';badge.className='small';badge.style.cssText='margin:6px 0;color:#667085';const heading=host.querySelector('h2,h3');if(heading)heading.after(badge);}if(badge)badge.textContent='Versão da triagem: 06/10 — revisão 55';}
document.addEventListener('DOMContentLoaded',nucleoShowTriageBuild);
nucleoShowTriageBuild();

function nucleoAssignedDecisionLabel(ro,tri,status){const saved=resolvedTriageForRo(ro,getSavedTriageMap());const decision=saved?.decision&&!saved.importedFromSheet?saved:tri;const raw=normalizeAnswer(ro?.statusPlanilha||ro?.status||ro?.raw?.__statusOperacional||'');if(decision?.decisionId==='falta_caixa'||raw==='falta de caixa'||raw==='falta de caixas')return decision?.decisionLabel||'Falta de caixa';return decision?.decision&&decision.decision!=='directed'?(decision.decisionLabel||nucleoDecisionForRecord(ro,decision)?.label||status):status;}

function nucleoVisibleManagerSectors(manager,managed,available){return [...new Set((manager?managed:available).map(x=>String(x||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR'));}

// Escopo de consulta do gestor. Não altera sessão, permissões ou dados salvos.
var nucleoManagerScope;
var nucleoManagerRendering=false;
function nucleoManagerScopeState(){const owner=String(getSession()?.email||getSession()?.name||'');if(!nucleoManagerScope||nucleoManagerScope.owner!==owner)nucleoManagerScope={owner,sector:'all',unit:'all'};return nucleoManagerScope;}
function nucleoManagerRecordMatches(record,scope,sectors,roRecords,triages){
 if(!record)return false;
 if(scope.unit!=='all'&&explicitRecordUnit(record)&&explicitRecordUnit(record)!==scope.unit)return false;
 if(scope.sector==='all')return true;
 const own=[record.responsibleSector,record.decisionSector,record.setor,record.sector,record.__assignedSector,...(Array.isArray(record.responsibleSectors)?record.responsibleSectors:[])].filter(Boolean);
 const ro=String(record.roNumber||record.ro||record.roKey||record.numero||record.roId||'').split('::')[0];
 if(ro){triages.filter(t=>String(t.roNumber||t.roKey||'').split('::')[0]===ro).forEach(t=>own.push(t.responsibleSector||t.decisionSector));const base=roRecords.find(r=>String(r.numero||r.id)===ro);if(base)own.push(base.setorResponsavelPlanilha||base.setor||'');}
 const selected=normalizeAnswer(scope.sector);return own.length?own.some(s=>normalizeAnswer(s)===selected):true;
}
const nucleoManagerRawRos=getAllRoRecords;
var nucleoManagerQueryContext=null;
function nucleoManagerQuery(){
 if(nucleoManagerQueryContext&&nucleoManagerRendering)return nucleoManagerQueryContext;
 const state=nucleoManagerScopeState();
 // A opção padrão não precisa ler ROs, triagens ou cadastros.
 const context={state:{...state},active:state.sector!=='all'||state.unit!=='all',roSectors:new Map()};
 if(context.active&&!nucleoHasManagedScope())context.active=false;
 if(context.active&&state.sector!=='all'){
  let triages=[];try{triages=JSON.parse(localStorage.getItem(TRIAGE_KEY)||'[]');}catch(_){}
  const add=(ro,sector)=>{if(!ro||!sector)return;const key=String(ro).split('::')[0],list=context.roSectors.get(key)||new Set();list.add(normalizeAnswer(sector));context.roSectors.set(key,list);};
  triages.forEach(t=>add(t.roNumber||t.roKey,t.responsibleSector||t.decisionSector));
  nucleoManagerRawRos().forEach(r=>add(r.numero||r.id,r.setorResponsavelPlanilha||r.setor));
 }
 if(nucleoManagerRendering)nucleoManagerQueryContext=context;return context;
}
function nucleoManagerMatchQuery(record,context){
 if(!context.active)return true;
 const state=context.state,unit=state.unit==='all'?'':explicitRecordUnit(record);
 if(unit&&unit!==state.unit)return false;
 if(state.sector==='all')return true;
 const own=[record.responsibleSector,record.decisionSector,record.setor,record.sector,record.__assignedSector,...(Array.isArray(record.responsibleSectors)?record.responsibleSectors:[])].filter(Boolean);
 const ro=String(record.roNumber||record.ro||record.roKey||record.numero||record.roId||'').split('::')[0],linked=context.roSectors.get(ro),selected=normalizeAnswer(state.sector);
 return own.some(s=>normalizeAnswer(s)===selected)||!!linked?.has(selected)||(!own.length&&!linked?.size);
}
function nucleoManagerScopeAllows(record){return nucleoManagerMatchQuery(record,nucleoManagerQuery());}
function nucleoManagerFilterRows(rows){if(!nucleoManagerRendering||!Array.isArray(rows))return rows;const context=nucleoManagerQuery();return context.active?rows.filter(r=>nucleoManagerMatchQuery(r,context)):rows;}
function nucleoManagerInstallReadScopes(){['getAllRoRecords','getAllSentPdcas','getSentPdcas','getAdminModuleRecords','getStandardDocuments','getDocumentDeliveries','getAnnouncements'].forEach(name=>{const original=window[name];if(typeof original!=='function'||original._managerReadScope)return;const wrapped=function(...args){return nucleoManagerFilterRows(original.apply(this,args));};wrapped._managerReadScope=true;window[name]=wrapped;});}
function nucleoManagerInstallRenderScopes(){Object.keys(window).filter(name=>/^render/.test(name)).forEach(name=>{const original=window[name];if(typeof original!=='function'||original._managerRenderScope)return;const wrapped=function(...args){const previous=nucleoManagerRendering;if(!previous)nucleoManagerQueryContext=null;nucleoManagerRendering=true;try{return original.apply(this,args);}finally{nucleoManagerRendering=previous;if(!previous)nucleoManagerQueryContext=null;}};wrapped._managerRenderScope=true;window[name]=wrapped;});}
function nucleoManagerScopeControl(){
 let host=document.getElementById('managerGlobalScope');if(!host){host=document.createElement('div');host.id='managerGlobalScope';host.style.cssText='display:flex;flex-wrap:wrap;align-items:center;gap:10px;padding:12px 16px;margin:10px 0;background:#eef4ff;border:1px solid #d9e5f5;border-radius:12px';const top=document.getElementById('globalSearchInput')?.closest('header')||document.getElementById('listView')?.parentElement;if(!top)return;if(top.tagName==='HEADER')top.after(host);else top.prepend(host);}
 host.hidden=!nucleoHasManagedScope();host.style.display=nucleoHasManagedScope()?'flex':'none';if(!nucleoHasManagedScope())return;
 const state=nucleoManagerScopeState(),sectors=nucleoVisibleManagerSectors(true,managedSectorsForCurrentUser(),[]),units=nucleoPersonUnits(getSession());if(!sectors.includes(state.sector))state.sector='all';if(!units.includes(state.unit))state.unit='all';
 host.innerHTML='<b>Visualizar:</b><label>Setor <select id="managerGlobalSector" aria-label="Setor em todas as áreas"><option value="all">Todos os meus setores</option>'+sectors.map(s=>'<option value="'+escapeHtml(s)+'">'+escapeHtml(s)+'</option>').join('')+'</select></label><label>Unidade <select id="managerGlobalUnit" aria-label="Unidade em todas as áreas"><option value="all">Todas as unidades permitidas</option>'+units.map(u=>'<option value="'+escapeHtml(u)+'">'+(u==='filial'?'Filial — Linhares':'Matriz')+'</option>').join('')+'</select></label><span class="small">Filtro geral de consulta</span><button class="btn secondary" type="button" onclick="nucleoOpenManagerEmails()">Recebimento de e-mails</button>';
 document.getElementById('managerGlobalSector').value=state.sector;document.getElementById('managerGlobalUnit').value=state.unit;
 ['managerGlobalSector','managerGlobalUnit'].forEach(id=>document.getElementById(id).onchange=nucleoManagerChangeScope);
 nucleoManagerInstallReadScopes();nucleoManagerInstallRenderScopes();
}
function nucleoManagerChangeScope(){const state=nucleoManagerScopeState();state.sector=document.getElementById('managerGlobalSector').value;state.unit=document.getElementById('managerGlobalUnit').value;
 ['assignedSectorFilter','assignedUnitFilter'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='all';});
 const previous=nucleoManagerRendering;nucleoManagerQueryContext=null;nucleoManagerRendering=true;
 try{
  const visible=id=>{const el=document.getElementById(id);return el&&!el.classList.contains('hidden');};
  if(visible('roListView'))render();
  else if(visible('listView'))renderCurrentOverview();
  else if(visible('sentView'))renderSentPdcas();
  else if(visible('actionsDashboardView'))renderActionsDashboard();
  else if(visible('sgqIndicatorsView'))renderSgqIndicators();
  else if(visible('adminModuleView')&&window.nucleoManagerModuleKey)showAdminOperationalModule(window.nucleoManagerModuleKey);
  else if(typeof nucleoDriveRenderRequests==='function'&&document.getElementById('nucleoDriveView')?.classList.contains('hidden')===false)nucleoDriveRenderRequests();
 }finally{nucleoManagerRendering=previous;nucleoManagerQueryContext=null;}
}
const nucleoManagerOriginalView=view;
view=function(id){nucleoManagerOriginalView(id);nucleoManagerScopeControl();};
document.addEventListener('DOMContentLoaded',()=>{nucleoManagerScopeControl();nucleoManagerInstallReadScopes();nucleoManagerInstallRenderScopes();});

function nucleoHasManagedScope(){return isManager()||managedSectorsForCurrentUser().length>0;}

function nucleoKpiCatalog(){return (isAdmin()?[['triage','R.O.s aguardando triagem','ros','triage'],['sac_classify','SACs aguardando classificação','sac','edit'],['action_review','Ações para atenção do SGQ','pdca','reviewActions'],['contests','Contestações pendentes','ros','reviewContests'],['registrations','Cadastros aguardando aprovação','users','approve'],['documents','Solicitações de documentos abertas','documents','consult']]:[['pdca_pending','PDCAs que aguardam sua resposta','ros','assigned'],['sector_actions','Ações do seu setor','pdca','actions'],['submitted','R.O.s que você abriu aguardando triagem','ros','submitted'],['sacs','SACs em acompanhamento','sac','consult'],['documents','Solicitações de documentos abertas','documents','consult']]).concat(nucleoKpiExtraCatalog());}
function nucleoKpiOrder(available,saved){return Array.isArray(saved)?[...new Set(saved)].filter(id=>available.includes(id)):available;}
function nucleoRenderKpiChoices(cards,ids){const host=document.getElementById('overviewKpis');if(!host)return;const extra=nucleoKpiExtraCatalog();if((getSession()?.overviewIndicators||[]).some(id=>extra.some(x=>x[0]===id))){const counts=nucleoKpiExtraCounts();extra.forEach(x=>{if(!ids.includes(x[0])){ids.push(x[0]);cards.push(overviewKpi(counts[x[0]]||0,x[1],'',null));}});}const allowed=nucleoKpiCatalog().filter(x=>nucleoPersonFeatureCan(x[2],x[3])).map(x=>x[0]),order=Array.isArray(getSession()?.overviewIndicators)?nucleoKpiOrder(ids.filter(id=>allowed.includes(id)),getSession().overviewIndicators):ids.filter(id=>allowed.includes(id)&&nucleoKpiDefaultIds().includes(id));host.innerHTML=order.map(id=>cards[ids.indexOf(id)]).join('')||'<p class="small">Nenhum indicador selecionado. Use Personalizar indicadores.</p>';let toolbar=document.getElementById('overviewIndicatorToolbar');if(!toolbar){toolbar=document.createElement('div');toolbar.id='overviewIndicatorToolbar';toolbar.className='actions';toolbar.style.cssText='justify-content:flex-end;margin:8px 0';toolbar.innerHTML='<button class="btn secondary" type="button" onclick="nucleoOpenKpiEditor()">⚙ Personalizar indicadores</button><span class="small">Dados do período carregado</span><button class="btn secondary" type="button" onclick="nucleoOpenMyTeam()">Minha equipe</button>';host.before(toolbar);}}
var nucleoKpiDraft;
function nucleoOpenKpiEditor(){const catalog=nucleoKpiCatalog().filter(x=>nucleoPersonFeatureCan(x[2],x[3]));nucleoKpiDraft=nucleoKpiOrder(catalog.map(x=>x[0]),getSession()?.overviewIndicators||nucleoKpiDefaultIds());let overlay=document.getElementById('overviewIndicatorEditor');overlay?.remove();overlay=document.createElement('div');overlay.id='overviewIndicatorEditor';overlay.className='modal open';overlay.style.cssText='position:fixed;inset:0;background:#0008;z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px';overlay.innerHTML='<div class="modal-box" style="max-width:650px;max-height:85vh;overflow:auto"><h3>Personalizar indicadores</h3><p class="small">Escolha os cartões e a ordem. A preferência acompanha seu login.</p><div id="overviewIndicatorChoices"></div><p id="overviewIndicatorSaveStatus" role="status"></p><div class="actions"><button class="btn primary" id="overviewIndicatorSave" onclick="nucleoSaveKpis()">Salvar</button><button class="btn secondary" onclick="nucleoKpiDraft=null;nucleoRenderKpiEditor()">Restaurar padrão</button><button class="btn secondary" onclick="document.getElementById(\'overviewIndicatorEditor\').remove()">Cancelar</button></div></div>';document.body.appendChild(overlay);nucleoRenderKpiEditor();}
function nucleoRenderKpiEditor(){const catalog=nucleoKpiCatalog().filter(x=>nucleoPersonFeatureCan(x[2],x[3]));if(!Array.isArray(nucleoKpiDraft))nucleoKpiDraft=nucleoKpiDefaultIds().filter(id=>catalog.some(x=>x[0]===id));const ordered=[...nucleoKpiDraft,...catalog.map(x=>x[0]).filter(id=>!nucleoKpiDraft.includes(id))];document.getElementById('overviewIndicatorChoices').innerHTML=ordered.map(id=>{const item=catalog.find(x=>x[0]===id);if(!item)return '';const pos=nucleoKpiDraft.indexOf(id);return '<div style="display:flex;gap:12px;align-items:center;padding:10px;border-bottom:1px solid #eee"><label style="flex:1"><input type="checkbox" style="width:20px;height:20px" '+(pos>=0?'checked':'')+' onchange="nucleoToggleKpi(\''+id+'\',this.checked)"> '+escapeHtml(item[1])+'</label><button class="btn secondary" '+(pos<=0?'disabled':'')+' onclick="nucleoMoveKpi(\''+id+'\',-1)" aria-label="Mover para cima">↑</button><button class="btn secondary" '+(pos<0||pos===nucleoKpiDraft.length-1?'disabled':'')+' onclick="nucleoMoveKpi(\''+id+'\',1)" aria-label="Mover para baixo">↓</button></div>';}).join('');}
function nucleoToggleKpi(id,checked){nucleoKpiDraft=nucleoKpiDraft.filter(x=>x!==id);if(checked)nucleoKpiDraft.push(id);nucleoRenderKpiEditor();}
function nucleoMoveKpi(id,delta){const i=nucleoKpiDraft.indexOf(id),j=i+delta;if(i<0||j<0||j>=nucleoKpiDraft.length)return;[nucleoKpiDraft[i],nucleoKpiDraft[j]]=[nucleoKpiDraft[j],nucleoKpiDraft[i]];nucleoRenderKpiEditor();}
async function nucleoSaveKpis(){const button=document.getElementById('overviewIndicatorSave'),status=document.getElementById('overviewIndicatorSaveStatus');button.disabled=true;status.textContent='Salvando na base central…';try{const result=await portalJsonp({acao:'portal_save_overview_preferences',indicators:JSON.stringify(nucleoKpiDraft)},60000);if(!result?.sucesso)throw new Error(result?.erro||'A base central não confirmou a preferência.');setSession({...getSession(),overviewIndicators:result.indicators});document.getElementById('overviewIndicatorEditor').remove();renderCurrentOverview();alert('Indicadores salvos para seu login.');}catch(e){status.textContent='Não foi possível salvar: '+e.message;}finally{button.disabled=false;}}

async function nucleoOpenManagerEmails(){
 try{const result=await portalJsonp({acao:'portal_manager_email_preferences'},60000);if(!result?.sucesso)throw new Error(result?.erro||'Não foi possível carregar.');const old=document.getElementById('managerEmailEditor');old?.remove();const box=document.createElement('div');box.id='managerEmailEditor';box.style.cssText='position:fixed;inset:0;background:#0008;z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px';box.innerHTML='<div style="background:white;padding:24px;border-radius:12px;max-width:650px;max-height:85vh;overflow:auto"><h3>Recebimento de e-mails por setor</h3><p>Avisos de triagem como gestor. As notificações no Núcleo continuam disponíveis.</p>'+result.scopes.map(m=>{const key=m.key;return '<label style="display:block;padding:12px"><input type="checkbox" data-manager-email="'+escapeHtml(key)+'" style="width:22px;height:22px" '+(result.preferences[key]!==false?'checked':'')+'> '+escapeHtml(m.sector)+' · '+(m.unit==='filial'?'Filial — Linhares':'Matriz')+'</label>';}).join('')+'<p role="status" id="managerEmailStatus"></p><button class="btn primary" onclick="nucleoSaveManagerEmails(this)">Salvar</button> <button class="btn secondary" onclick="document.getElementById(\'managerEmailEditor\').remove()">Cancelar</button></div>';document.body.appendChild(box);}catch(err){alert(err.message);}
}
async function nucleoSaveManagerEmails(button){button.disabled=true;const status=document.getElementById('managerEmailStatus');status.textContent='Salvando na base central…';try{const data={};document.querySelectorAll('[data-manager-email]').forEach(el=>data[el.dataset.managerEmail]=el.checked);const result=await portalJsonp({acao:'portal_manager_email_preferences',data:JSON.stringify(data)},60000);if(!result?.sucesso)throw new Error(result?.erro||'Salvamento não confirmado.');status.textContent='Preferências salvas na base central.';}catch(err){status.textContent=err.message;}finally{button.disabled=false;}}

var nucleoMyTeamData=[];
async function nucleoOpenMyTeam(){
 const old=document.getElementById('myTeamOverlay');old?.remove();const overlay=document.createElement('div');overlay.id='myTeamOverlay';overlay.style.cssText='position:fixed;inset:0;background:#0008;z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px';overlay.innerHTML='<div style="background:white;padding:24px;border-radius:16px;width:min(850px,96vw);max-height:85vh;overflow:auto"><div style="display:flex;justify-content:space-between;align-items:center"><h3>Minha equipe</h3><button class="btn secondary" onclick="document.getElementById(\'myTeamOverlay\').remove()">Fechar</button></div><p class="small">Gestores e colegas com cadastro aprovado e ativo nos seus setores.</p><div id="myTeamFilters"></div><div id="myTeamContents" role="status">Carregando equipes da base central…</div></div>';document.body.appendChild(overlay);
 try{const result=await portalJsonp({acao:'portal_my_team'},60000);if(!result?.sucesso)throw new Error(result?.erro||'Não foi possível carregar a equipe.');if(!overlay.isConnected)return;nucleoMyTeamData=result.teams||[];document.getElementById('myTeamFilters').innerHTML='<div class="actions"><label>Setor <select id="myTeamSector"><option value="all">Todos os meus setores</option>'+[...new Set(nucleoMyTeamData.map(t=>t.sector))].map(s=>'<option value="'+escapeHtml(s)+'">'+escapeHtml(s)+'</option>').join('')+'</select></label><label>Unidade <select id="myTeamUnit"><option value="all">Todas as minhas unidades</option>'+[...new Set(nucleoMyTeamData.map(t=>t.unit))].map(u=>'<option value="'+escapeHtml(u)+'">'+(u==='filial'?'Filial — Linhares':'Matriz')+'</option>').join('')+'</select></label></div>';['myTeamSector','myTeamUnit'].forEach(id=>document.getElementById(id).onchange=nucleoRenderMyTeam);nucleoRenderMyTeam();}catch(err){if(overlay.isConnected)document.getElementById('myTeamContents').textContent='Não foi possível consultar: '+err.message;}
}
function nucleoRenderMyTeam(){
 const host=document.getElementById('myTeamContents');if(!host)return;const sector=document.getElementById('myTeamSector')?.value||'all',unit=document.getElementById('myTeamUnit')?.value||'all',teams=nucleoMyTeamData.filter(t=>(sector==='all'||t.sector===sector)&&(unit==='all'||t.unit===unit));
 host.innerHTML=teams.map(t=>'<section style="border:1px solid #dce5ee;border-radius:12px;padding:18px;margin-top:16px"><h3 style="margin:0">'+escapeHtml(t.sector)+'</h3><p class="small">'+(t.unit==='filial'?'Filial — Linhares':'Matriz')+' · '+t.people.length+' pessoa(s)</p>'+(!t.people.some(p=>p.manager)?'<p class="small">Nenhum gestor cadastrado para esta equipe.</p>':'')+'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px">'+t.people.map(p=>{const parts=splitPersonNameDescription(p.name,p.description||undefined);return '<div style="padding:14px;border-radius:10px;background:'+(p.manager?'#eef4ff':'#f6f8fa')+'"><strong>'+escapeHtml(parts.name)+'</strong>'+(p.self?' <span class="small">(você)</span>':'')+'<div class="small">'+(p.manager?'Gestor':escapeHtml(p.functionLabel||'Integrante da equipe'))+'</div>'+(parts.description?'<div class="small">'+escapeHtml(parts.description)+'</div>':'')+'</div>';}).join('')+'</div></section>').join('')||'<p>Nenhuma equipe disponível para esta seleção.</p>';
}

var nucleoAiScoreState;
function nucleoAiPanel(ro,tri){nucleoAiScoreState={ro:String(ro.numero||ro.id||ro.codigo||'').split('::')[0],origin:ro.origemBase||ro.raw?.__origemBase||'',assessment:tri?.scoreAssessment||null,roRecord:ro};document.getElementById('roAiScores').innerHTML='<div class="actions"><button class="btn secondary" type="button" onclick="nucleoAiSuggest(this)">Sugerir pontuação com IA</button><button class="btn secondary" type="button" onclick="nucleoAiManual(this)">Fazer manualmente</button><button class="btn secondary" type="button" onclick="nucleoAiOpenRoTab()">Abrir PDF da R.O. em outra aba</button><button class="btn secondary" type="button" onclick="nucleoAiRulesEditor()">Regras de pontuação</button></div><p class="small">Teste: revise as seis notas antes de confirmar. A sugestão não altera a decisão da triagem.</p><div id="roAiScoreResult"></div>';if(nucleoAiScoreState.assessment)nucleoAiRenderAssessment(nucleoAiScoreState.assessment);}
async function nucleoAiSuggest(button){const state=nucleoAiScoreState,host=document.getElementById('roAiScoreResult');button.disabled=true;host.textContent='Analisando a R.O. na base central…';try{const r=await portalJsonp({acao:'portal_ai_analyze_ro',ro:state.ro,origin:state.origin},90000);if(state!==nucleoAiScoreState)return;if(!r?.sucesso)throw new Error(r?.erro||'Análise não confirmada.');state.assessment={...r,confirmed:false};nucleoAiRenderAssessment(state.assessment);}catch(err){if(state===nucleoAiScoreState)host.textContent=/HTTP\s*503/i.test(err.message)?'IA sobrecarregada. Aguarde alguns minutos e tente novamente.':err.message;}finally{button.disabled=false;}}
function nucleoAiRenderAssessment(a){const host=document.getElementById('roAiScoreResult'),rules=a.rules;host.innerHTML='<table style="width:100%"><thead><tr><th>Critério</th><th>Nota revisada</th>'+(a.mode==='manual'?'':'<th>Justificativa da sugestão</th>')+'</tr></thead><tbody>'+a.answer.scores.map((s,i)=>'<tr><td>'+escapeHtml(rules.criteria[i].label)+'</td><td><select data-ai-score="'+s.id+'" onchange="nucleoAiInvalidateConfirmation()"><option value="">Confirmar dado</option>'+[0,1,2,3].map(n=>'<option value="'+n+'" '+((a.reviewedScores?.[i]??s.score)===n?'selected':'')+'>'+n+' — '+escapeHtml(rules.criteria[i].points[n])+'</option>').join('')+'</select></td>'+(a.mode==='manual'?'':'<td>'+escapeHtml(s.reason)+'</td>')+'</tr>').join('')+'</tbody></table><label>Reclamação ou devolução do cliente? <select id="roAiClientComplaint" onchange="nucleoAiInvalidateConfirmation()"><option value="">Confirmar</option><option value="yes" '+((a.reviewedClientComplaint??a.answer.clientComplaint)===true?'selected':'')+'>Sim</option><option value="no" '+((a.reviewedClientComplaint??a.answer.clientComplaint)===false?'selected':'')+'>Não</option></select></label><p id="roAiScoreSummary"></p><button class="btn primary" type="button" onclick="nucleoAiConfirmScores()">Confirmar pontuação revisada</button><p class="small">A pontuação será armazenada ao salvar a triagem. A decisão e o direcionamento continuam sob sua escolha.</p><div id="roAiSimilar"></div>';nucleoAiUpdateSummary();const similar=findSimilarRos(nucleoAiScoreState.roRecord,8).filter(x=>sameCanonicalUnit(x.ro.unidade,nucleoAiScoreState.roRecord.unidade));document.getElementById('roAiSimilar').textContent=similar.length?'R.O.s semelhantes no período carregado (confira se são recorrência): '+similar.map(x=>x.ro.numero||x.ro.id||x.ro.codigo).join(', ')+'.':'Nenhuma R.O. semelhante encontrada no período carregado. Isso não comprova primeira ocorrência.';}
function nucleoAiCalculate(scores,client,rules){const pending=scores.some(s=>s===null)||client===null,total=scores.reduce((n,s)=>n+(s||0),0);return {pending,total,level:client===true&&rules.clientForcesLevel4?4:pending?null:rules.maxima.findIndex(n=>total<=n)+1};}
function nucleoAiReadScores(){const scores=[...document.querySelectorAll('[data-ai-score]')].map(el=>el.value===''?null:Number(el.value)),v=document.getElementById('roAiClientComplaint').value;return {scores,client:v===''?null:v==='yes'};}
function nucleoAiUpdateSummary(){const a=nucleoAiScoreState.assessment;if(!a)return;const data=nucleoAiReadScores(),r=nucleoAiCalculate(data.scores,data.client,a.rules);document.getElementById('roAiScoreSummary').textContent=(r.pending?'Avaliação incompleta · subtotal: ':'Total: ')+r.total+' pontos'+(r.level?' · Nível '+r.level+' · '+(r.level>=3?'PDCA':'Registro simples e ação imediata'):'')+(a.confirmed?' · Pontuação confirmada.':' · Aguardando revisão do SGQ.');return r;}
function nucleoAiInvalidateConfirmation(){nucleoAiScoreState.assessment.confirmed=false;nucleoAiUpdateSummary();}
function nucleoAiConfirmScores(){const a=nucleoAiScoreState.assessment,r=nucleoAiUpdateSummary();if(r.pending)return alert('Confirme os seis critérios e a situação do cliente.');const data=nucleoAiReadScores();a.reviewedScores=data.scores;a.reviewedClientComplaint=data.client;a.total=r.total;a.level=r.level;a.confirmed=true;a.confirmedBy=getSession()?.name;a.confirmedAt=new Date().toISOString();nucleoAiUpdateSummary();}
async function nucleoAiRulesEditor(){
 document.getElementById('roAiRulesEditor')?.remove();
 const box=document.createElement('dialog');box.id='roAiRulesEditor';box.style.cssText='border:0;border-radius:12px;padding:0;max-width:95vw;max-height:95vh;background:white';
 box.innerHTML='<div style="background:white;padding:24px;border-radius:12px;width:min(800px,95vw);max-height:90vh;overflow:auto"><h3>Regras de pontuação — teste IA</h3><div id="roAiRulesContent"></div><p id="roAiRulesStatus" role="status">Carregando regras da base central…</p><button class="btn secondary" onclick="document.getElementById(\'roAiRulesEditor\').remove()">Fechar</button></div>';
 document.body.appendChild(box);box.showModal();
 try{const r=await portalJsonp({acao:'portal_ai_rules'},60000);if(!box.isConnected)return;if(!r?.sucesso)throw new Error(r?.erro||'Não foi possível consultar regras.');
 const editable=isAdmin()&&nucleoPersonFeatureCan('sectors','decisions');
 box.querySelector('#roAiRulesContent').innerHTML=nucleoAiRulesTable(r.rules)+(editable?'<details style="margin-top:18px"><summary>Editar regras de pontuação</summary><p>Alterações valem para todas as unidades. Preserve os identificadores.</p><textarea id="roAiRulesJson" style="width:100%;height:40vh"></textarea><button class="btn primary" onclick="nucleoAiSaveRules(this)">Salvar regras na base central</button></details>':'');
 const input=box.querySelector('#roAiRulesJson');if(input)input.value=JSON.stringify(r.rules,null,2);box.querySelector('#roAiRulesStatus').textContent='Regras carregadas.';
 }catch(err){if(box.isConnected){box.querySelector('#roAiRulesStatus').textContent='Não foi possível carregar as regras: '+err.message;}}
}
async function nucleoAiSaveRules(button){button.disabled=true;const status=document.getElementById('roAiRulesStatus');try{const data=JSON.parse(document.getElementById('roAiRulesJson').value),r=await portalJsonp({acao:'portal_ai_rules',data:JSON.stringify(data)},60000);if(!r?.sucesso)throw new Error(r?.erro||'Não confirmado.');status.textContent='Regras salvas. Gere uma nova sugestão para usar as regras atualizadas.';}catch(err){status.textContent=err.message;}finally{button.disabled=false;}}

function nucleoKpiExtraCatalog(){return [['ro_total','R.O.s disponíveis','ros','consult'],['ro_pending','R.O.s pendentes de resposta','ros','consult'],['ro_answered','R.O.s respondidas','ros','consult'],['ro_presented','R.O.s apresentadas','ros','consult'],['ro_finalized','R.O.s finalizadas — retorno disponibilizado','ros','consult'],['ro_record','R.O.s para registro','ros','consult'],['ro_cancelled','R.O.s canceladas','ros','consult'],['ro_obsolete','R.O.s obsoletas','ros','consult'],['ro_box','R.O.s por falta de caixa','ros','consult'],['pdca_received','PDCAs recebidos','pdca','received'],['pdca_dispatch','PDCAs aguardando envio ao reclamante','pdca','dispatch'],['actions_ontime','Ações abertas no prazo','pdca','actions'],['actions_late','Ações atrasadas','pdca','actions'],['actions_done','Ações concluídas','pdca','actions'],['sacs_done','SACs finalizados','sac','consult'],['docs_done','Documentos entregues','documents','consult']].concat(nucleoKpiClassificationNames().map(name=>['class:'+encodeURIComponent(name),'Classificação: '+name,'ros','consult']));}
function nucleoKpiClassificationNames(){const names=['Método','Máquina','Mão de obra','Material','Medição','Meio ambiente'];if(document.readyState!=='loading'){const map=getSavedTriageMap();map.forEach(t=>{(t.classificationMs||[]).concat(t.classificationOther?[t.classificationOther]:!t.classificationMs&&t.classification?[t.classification]:[]).forEach(n=>{const name=String(n||'').trim();if(name&&!names.some(x=>normalizeAnswer(x)===normalizeAnswer(name)))names.push(name);});});}return names;}
function nucleoKpiDefaultIds(){return isAdmin()?['triage','sac_classify','action_review','contests','registrations','documents']:['pdca_pending','sector_actions','submitted','sacs','documents'];}
function nucleoKpiExtraCounts(){
 const map=getSavedTriageMap(),classNames=nucleoKpiClassificationNames(),ros=getAllRoRecords().filter(r=>canViewRO(r)&&nucleoManagerScopeAllows(r)),pdcas=getAllSentPdcas().filter(p=>canViewPdca(p)&&nucleoManagerScopeAllows(p)),byRo=new Map();pdcas.forEach(p=>{const key=String(p.ro||p.roId||'').split('::')[0];if(!byRo.has(key))byRo.set(key,[]);byRo.get(key).push(p);});
 const triageByRo=new Map();map.forEach(t=>{const key=String(t.roNumber||t.roKey||'').split('::')[0],old=triageByRo.get(key);if(!old||old.importedFromSheet&&!t.importedFromSheet||old.importedFromSheet===t.importedFromSheet&&String(t.triagedAt||'')>String(old.triagedAt||''))triageByRo.set(key,t);});
 const counts={ro_total:ros.length,ro_pending:0,ro_answered:0,ro_presented:0,ro_finalized:0,ro_record:0,ro_cancelled:0,ro_obsolete:0,ro_box:0,pdca_received:pdcas.length,pdca_dispatch:0,actions_ontime:0,actions_late:0,actions_done:0,sacs_done:0,docs_done:0};
 let deliveries=[];try{deliveries=JSON.parse(localStorage.getItem('nucleo-pdca-dispatches-v1')||'[]');}catch(_){}const delivered=p=>deliveries.some(d=>d.ro===p.ro&&d.unit===explicitRecordUnit(p)&&(d.pdcaFileId&&d.pdcaFileId===p.pdcaFileId||d.fileId&&d.fileId===p.fileId)&&Number(d.version||1)===Number(p.version||1));
 ros.forEach(ro=>{const key=String(ro.numero||ro.id||ro.codigo||'').split('::')[0],tri=triageByRo.get(key)||map.get(key)||{},decision=tri.decision||baseTriageSituation(ro)?.decision;const ps=byRo.get(String(ro.numero||ro.id||ro.codigo||'').split('::')[0])||[];
  if(decision==='record')counts.ro_record++;if(decision==='cancelled')counts.ro_cancelled++;if(decision==='obsolete')counts.ro_obsolete++;if(tri.decisionId==='falta_caixa'||/falta de caixas?/i.test(tri.decisionLabel||ro.statusPlanilha||ro.status||''))counts.ro_box++;
  if(ps.length)counts.ro_answered++;if(ps.some(p=>p.apresentadoEm||p.presented||p.presentedAt))counts.ro_presented++;if(ps.some(delivered))counts.ro_finalized++;if(decision==='directed'&&tri.pdcaRequired!==false&&!ps.length)counts.ro_pending++;
  const names=Array.isArray(tri.classificationMs)?tri.classificationMs.concat(tri.classificationOther?[tri.classificationOther]:[]):tri.classification?[tri.classification]:[];[...new Set(names)].forEach(n=>{const canonical=classNames.find(x=>normalizeAnswer(x)===normalizeAnswer(n))||String(n).trim(),id='class:'+encodeURIComponent(canonical);counts[id]=(counts[id]||0)+1;});
 });
 pdcas.forEach(p=>{if(p.externalPdf&&!delivered(p))counts.pdca_dispatch++;allPdcaActionsForRecord(p).filter(a=>isAdmin()||(a.responsibleSectors||[a.setor||p.setor]).some(sector=>userHasUnitSector(getSession(),explicitRecordUnit(p),sector))).forEach(a=>{const status=inferActionStatus({...p,answers:{...(p.answers||{}),p11:a.action,p12:a.deadline,p13:a.owner},acaoConferidaEm:a.completedAt||a.acaoConferidaEm});if(status.code==='done')counts.actions_done++;else if(status.code==='overdue')counts.actions_late++;else if(status.code==='pending'&&parseBrDate(a.deadline))counts.actions_ontime++;});});
 const sacs=isAdmin()?getExternalRoControls():getMySacs();counts.sacs_done=sacs.filter(r=>r.treatmentStatus==='done'&&nucleoManagerScopeAllows(r)).length;
 counts.docs_done=getAdminModuleRecords().filter(r=>r.module==='documents'&&['done','delivered'].includes(r.status)&&nucleoManagerScopeAllows(r)&&(isAdmin()||normalizeAnswer(r.createdBy)===normalizeAnswer(getSession()?.name))).length;
 return counts;
}

document.addEventListener('DOMContentLoaded',()=>{try{renderCurrentOverview();}catch(err){console.error(err);}});

function nucleoAiRulesTable(rules){return '<div style="overflow:auto"><table style="width:100%"><thead><tr><th>Critério</th>'+[0,1,2,3].map(n=>'<th>Nota '+n+'</th>').join('')+'</tr></thead><tbody>'+rules.criteria.map(c=>'<tr><th>'+escapeHtml(c.label)+'</th>'+c.points.map(t=>'<td>'+escapeHtml(t)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div><p>'+rules.maxima.map((n,i)=>'Nível '+(i+1)+': '+(i?rules.maxima[i-1]+1:0)+' a '+n+' pontos').join(' · ')+'</p>'+(rules.clientForcesLevel4?'<p>Reclamação ou devolução do cliente: nível 4.</p>':'')+'<p>'+escapeHtml(rules.recurrenceInstructions)+'</p>';}
async function nucleoAiManual(button){const state=nucleoAiScoreState,host=document.getElementById('roAiScoreResult');button.disabled=true;host.textContent='Carregando critérios para pontuação manual…';try{const r=await portalJsonp({acao:'portal_ai_rules'},60000);if(state!==nucleoAiScoreState)return;if(!r?.sucesso)throw new Error(r?.erro||'Não foi possível carregar os critérios.');state.assessment={mode:'manual',rules:r.rules,confirmed:false,answer:{scores:r.rules.criteria.map(c=>({id:c.id,score:null,reason:''})),clientComplaint:null}};nucleoAiRenderAssessment(state.assessment);}catch(err){if(state===nucleoAiScoreState)host.textContent=err.message;}finally{button.disabled=false;}}
async function nucleoAiOpenRoTab(){
 const ro=nucleoAiScoreState?.roRecord,state=nucleoAiScoreState;
 if(!ro||!canViewRO(ro)){alert('R.O. indisponível para consulta.');return;}
 const tab=window.open('about:blank','_blank');if(!tab){alert('Permita a abertura de outra aba para consultar o PDF.');return;}tab.opener=null;tab.document.title='PDF da R.O.';tab.document.body.textContent='Gerando PDF completo da R.O. com as evidências…';
 try{const r=await portalJsonp({acao:'portal_ro_scoring_pdf',ro:state.ro,origin:state.origin},90000);if(!r?.sucesso||!r.base64)throw new Error(r?.erro||'PDF não confirmado.');if(tab.closed)return;const bytes=Uint8Array.from(atob(r.base64),c=>c.charCodeAt(0)),url=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));tab.location.replace(url);setTimeout(()=>URL.revokeObjectURL(url),300000);}
 catch(err){if(!tab.closed)tab.document.body.textContent='Não foi possível abrir o PDF: '+err.message;}
}
