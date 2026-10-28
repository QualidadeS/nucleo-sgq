
// Núcleo build unificado: todos os navegadores devem carregar a mesma implantação.
window.NUCLEO_BUILD_VERSION = '20261028-pdca-review-unlink-v7';
(function nucleoBuildConsistencyGuard(){
  try {
    var meta=document.querySelector('meta[name="nucleo-build"]');
    var htmlBuild=meta&&meta.getAttribute('content')||'';
    if(htmlBuild && htmlBuild!==window.NUCLEO_BUILD_VERSION){
      var k='nucleo-build-reload-'+window.NUCLEO_BUILD_VERSION;
      if(!sessionStorage.getItem(k)){
        sessionStorage.setItem(k,'1');
        var u=new URL(location.href);
        u.searchParams.set('_build',window.NUCLEO_BUILD_VERSION);
        location.replace(u.toString());
      }
    }
  } catch(e) {}
})();

// Recuperação explícita: preserva cadastros, rascunhos e caches.
if(new URLSearchParams(location.search).get('recuperar')==='1'){
  try{localStorage.removeItem('ro-pdca-session-v63')}catch(e){}
  try{sessionStorage.removeItem('ro-pdca-session-v63')}catch(e){}
}
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
    script.src=new URL('assets/modules/admin-workspaces.js?v=20261021-0945-unified',document.baseURI).href;
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
    nucleoPatchEquipmentReportsUi();
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
      ['Em tratamento','Visualizar, filtrar, enviar, acompanhar e excluir RNCs de fornecedor.','active'],
      ['Fornecedores','Cadastre a ficha completa de cada fornecedor, contatos, compras e acordos.','suppliers'],
      ['Indicadores de fornecedores','Compare volume comprado, RNCs, reincidência e acordos pendentes.','supplier_indicators']
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
    eyebrow:'GESTÃO DE PROCESSOS E DOCUMENTOS',
    title:'Gestão de processos',
    desc:'Lista Mestra digital dos documentos controlados, nomenclaturas, modelos e histórico documental do SGQ.',
    cards:[
      ['Lista Mestra','Consultar todos os documentos controlados, situação, revisão e vínculo com o arquivo vigente.','master'],
      ['Adicionar documento existente','Adotar um documento que já existe e trazê-lo para o controle do Núcleo sem recriar o arquivo.','adopt'],
      ['Importar documentos existentes','Colar uma tabela do Excel/Sheets ou importar CSV/TSV para migrar a Lista Mestra atual.','import'],
      ['Nomenclaturas','Controlar siglas de tipos, unidades e áreas usadas na codificação documental.','nomenclature'],
      ['Modelos','Gerenciar os modelos visuais e formulários usados pelo Núcleo.','templates'],
      ['Histórico / obsoletos','Consultar documentos substituídos, cancelados, vencidos e versões anteriores.','history']
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









































const PDCA_DRAFTS_KEY='portal-sgq-pdca-drafts-v1';
const PDCA_STARTED_KEY='portal-sgq-pdca-started-v1';
const SAVED_FILTERS_KEY='portal-sgq-saved-filters-v1';
const DEADLINE_ALERTS_KEY='portal-sgq-deadline-alerts-v1';
let pdcaExtraActions=[];
let pdcaDraftSaveTimer=null;





























































































































function parseResponsibleSectors(value){
  if(Array.isArray(value))return normalizeSectorList(value);
  return normalizeSectorList(String(value||'').split(/\s*\|\s*|[\n,;]+/));
}















function renderSectorCheckboxes(selected,onchangeExpr,group){
  const selectedKeys=new Set(parseResponsibleSectors(selected).map(normalizeAnswer));
  const sectors=pdcaConfiguredSectors();
  return `<div class="pdca-sector-grid">
    ${sectors.map(s=>`<label class="pdca-sector-option ${selectedKeys.has(normalizeAnswer(s))?'selected':''}">
      <input type="checkbox" data-sector-group="${escapeHtml(group)}" value="${escapeHtml(s)}" ${selectedKeys.has(normalizeAnswer(s))?'checked':''} onchange="${onchangeExpr};this.closest('.pdca-sector-option')?.classList.toggle('selected',this.checked)">
      <span>${escapeHtml(s)}</span>
    </label>`).join('')}
  </div>`;
}
function collectSectorCheckboxes(group){
  return [...document.querySelectorAll(`input[data-sector-group="${group}"]:checked`)].map(el=>el.value);
}




function updateExtraActionResponsibleSectors(id){
  const a=pdcaExtraActions.find(x=>x.id===id);if(!a)return;
  const sectors=collectSectorCheckboxes('extra-'+id);
  a.responsibleSectors=sectors;
  a.owner=sectors.join(' | ');
  schedulePdcaDraftSave();
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














const NUCLEO_DEFAULT_API_URL=String(window.NUCLEO_RUNTIME_CONFIG?.apiUrl||'').trim(); // Configuração central gerada pelo GitHub Actions
const PORTAL_BACKEND_STATE_KEY='portal-sgq-backend-state-v1';
const PORTAL_BACKEND_LAST_SYNC_KEY='portal-sgq-backend-last-sync-v1';
let portalBackendSyncInProgress=false;
let portalBackendLastSyncResult=false;
let portalBackendSyncWaiters=[];






















window.addEventListener('online',()=>setTimeout(retryPendingRncDeletes,300));

// ===== NÚCLEO: estado de confirmação da base central =====
// O navegador pode exibir cache para abrir rápido, mas cache nunca é considerado dado oficial.
// Somente uma resposta válida de portal_load muda o estado para "synced".
let nucleoPublicConfigReady=false;
let nucleoCentralSyncState={status:'cache',message:'Dados locais temporários. Atualizando com a base central…',confirmedAt:'',serverAt:''};





























































let nucleoConfirmedApiUrl='';















































































































































































































































































































































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
  'nucleo-hidden-assigned-directions-v1',
  'nucleo-deleted-triage-keys-v1',
  'nucleo-unified-actions-v1',
  'nucleo-pdca-review-2026-v1',
  'nucleo-5s-auditor-links-v1'
]);
const NUCLEO_SHARED_USER_KEYS=new Set([
  'ro-pdca-notifications-v1',
  'ro-pdca-notification-read-v1',
  'portal-sgq-pdca-started-v1'
]);
let nucleoApplyingCentralState=false;
// Estado operacional de PDCA em memória, sempre vindo da base central.
// localStorage pode existir para preferências/cache de outros módulos, mas não é fonte de verdade para PDCAs recebidos/entregues.
let nucleoCentralPdcaSent=[];
let nucleoCentralPdcaDispatches=[];
let nucleoCentralPdcaSnapshotReady=false;
const nucleoNativeStorageSetItem=Storage.prototype.setItem;

















Storage.prototype.setItem=function(key,value){
  const result=nucleoNativeStorageSetItem.call(this,key,value);
  if(this===localStorage)try{nucleoPersistSharedState(String(key),String(value))}catch(e){console.warn('Falha ao persistir estado compartilhado:',e)}
  return result;
};











































































































































































































































































































































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


















































































































































































































document.addEventListener('click',function(e){
  const panel=document.getElementById('notificationPanel');
  const bell=document.getElementById('notificationBellBtn');
  if(!panel||panel.classList.contains('hidden'))return;
  if(panel.contains(e.target)||bell?.contains(e.target))return;
  panel.classList.add('hidden');
});











































































































































































































let nucleoMetrologyEmailPreferenceCache=null;























































































let emailHistoryVisibleLimit=5;
let emailHistoryLoaded=[];














































































































































const ANNOUNCEMENTS_KEY='portal-sgq-announcements-v1';
const ANNOUNCEMENT_ACK_KEY='portal-sgq-announcement-acks-v1';
const ANNOUNCEMENT_IMAGE_DB='portal-sgq-announcement-images-v1';
const ANNOUNCEMENT_IMAGE_STORE='images';
let currentAnnouncementImageData='';
let currentAnnouncementAttachmentData='';
let currentAnnouncementAttachmentName='';
let currentAnnouncementAttachmentType='';
let currentAnnouncementId='';




















































































































































































































































































































function audienceLabel(a){
  if(a.audience==='sector')return 'Setor: '+(a.sector||'—');
  if(a.audience==='operational')return 'Usuários operacionais';
  return 'Todos os usuários';
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
let nucleoSessionLastRaw;




























const DEFAULT_PORTAL_SECTORS=['Produção','Logística','Qualidade','Manutenção','Comercial','Faturamento'];





























































































































































function findKnownUserByNameSector(name,sector){
  const n=(name||'').trim().toLowerCase();
  const s=(sector||'').trim().toLowerCase();
  return getOperationalUsers().find(u=>(u.name||'').trim().toLowerCase()===n && (u.sector||'').trim().toLowerCase()===s) || null;
}

















































let loginAttemptNonce=0;




























































































































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











































function showProfile(){
  if(getSession())nucleoLoadAvatar();
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























































const DOCUMENT_REQUEST_ALLOWED_SECTORS=[
  'Comercial Interno',
  'Comercial Externo',
  'Diretoria',
  'SGQ'
];










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
























function applyExternalRoAccessClass(){
  const body=document.body;
  if(!body)return;
  body.classList.toggle('external-ro-denied',!canRegisterExternalRo());
}




















































function closePdfPreview(){
  document.getElementById('pdfPreviewModal').classList.remove('open');
  if(currentPdfUrl){URL.revokeObjectURL(currentPdfUrl);currentPdfUrl=null}
  const frame=document.getElementById('pdfPreviewFrame');
  frame.src='about:blank';
  try{frame.srcdoc='';}catch(e){}
  currentPdfHtmlMode=false;
  const dl=document.querySelector('#pdfPreviewModal .pdf-preview-actions .btn.primary');if(dl)dl.textContent='Baixar PDF';
  const ext=document.getElementById('externalRoPdfLink'); if(ext) ext.style.display='none';
}
let currentPdfHtmlMode=false;
function downloadPreviewPdf(){
  if(currentPdfHtmlMode){
    const frame=document.getElementById('pdfPreviewFrame');
    try{frame?.contentWindow?.focus();frame?.contentWindow?.print();}
    catch(e){alert('Não foi possível abrir a impressão do documento.');}
    return;
  }
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































































































































































































































































































































let operationalUsersLimit=5;













































































































window.__nucleoUserLoginStatusGuard=window.__nucleoUserLoginStatusGuard||{};




















































































































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



































































































function answerLooksYes(v){
  const s=normalizeAnswer(v);
  return /^(sim|s|yes|conclu[ií]d[oa]|conclu[ií]da|feito|executado|atingid[oa]|ok|finalizado|finalizada)/.test(s)
      || s.includes('conclu') || s.includes('executad') || s.includes('atingid') || s.includes('eliminad');
}









const UNIFIED_ACTIONS_KEY='nucleo-unified-actions-v1';

function getUnifiedManualActions(){
  try{
    const arr=JSON.parse(localStorage.getItem(UNIFIED_ACTIONS_KEY)||'[]');
    return Array.isArray(arr)?arr:[];
  }catch(e){return []}
}
function saveUnifiedManualActions(list){
  localStorage.setItem(UNIFIED_ACTIONS_KEY,JSON.stringify(Array.isArray(list)?list:[]));
}
function unifiedActionUserKey(user){
  return String(user?.email||user?.name||'').trim().toLowerCase();
}
function unifiedCurrentUserKey(){
  const s=getSession()||{};
  return String(s.email||s.name||'').trim().toLowerCase();
}
function unifiedActionUserDisplay(key){
  const wanted=String(key||'').trim().toLowerCase();
  const u=getOperationalUsers().find(x=>unifiedActionUserKey(x)===wanted);
  return u?.name||u?.email||key||'-';
}
function unifiedActionUserSector(user){
  return String(user?.sector||'').trim();
}











function unifiedActionAssignableUsers(){
  const users=getOperationalUsers().filter(unifiedActionIsActiveUser);
  if(isAdmin())return users;
  if(isManager()){
    const managed=managedSectorsForCurrentUser().map(normalizeAnswer);
    return users.filter(u=>{
      const sectors=[u.sector,...(u.managedSectors||[]),(u.sectorMemberships||[]).map(m=>m.sector)].flat().filter(Boolean);
      return sectors.some(s=>managed.includes(normalizeAnswer(s)));
    });
  }
  const self=unifiedCurrentUserKey();
  return users.filter(u=>unifiedActionUserKey(u)===self);
}
function unifiedActionCanCreateFor(mode,targetUser=''){
  if(isAdmin())return ['self','person','sector'].includes(mode);
  if(isManager()){
    if(mode==='self')return true;
    if(mode!=='person')return false;
    return unifiedActionAssignableUsers().some(u=>unifiedActionUserKey(u)===String(targetUser||'').toLowerCase());
  }
  return mode==='self';
}
function unifiedActionCanSee(record){
  if(!record)return false;
  if(isAdmin())return true;
  const me=unifiedCurrentUserKey();
  if(String(record.assigneeKey||'').toLowerCase()===me)return true;
  if(String(record.createdByKey||'').toLowerCase()===me)return true;

  if(isManager()){
    const target=getOperationalUsers().find(u=>unifiedActionUserKey(u)===String(record.assigneeKey||'').toLowerCase());
    if(target){
      const targetSectors=[target.sector,...(target.sectorMemberships||[]).map(m=>m.sector)].filter(Boolean);
      if(targetSectors.some(managesSector))return true;
    }
  }
  return false;
}

function unifiedActionDateLabel(v){
  if(!v)return '—';
  try{
    const d=new Date(v);
    if(!Number.isNaN(d.getTime()))return d.toLocaleDateString('pt-BR');
  }catch(e){}
  return String(v||'—');
}
function unifiedActionDateTimeLabel(v){
  if(!v)return '—';
  try{
    const d=new Date(v);
    if(!Number.isNaN(d.getTime()))return d.toLocaleString('pt-BR');
  }catch(e){}
  return String(v||'—');
}
function unifiedActionUrgencyLabel(v){
  const n=normalizeAnswer(v||'media');
  if(n==='alta')return '🔴 Alta';
  if(n==='baixa')return '🟢 Baixa';
  return '🟡 Média';
}





function unifiedManualActionStatus(a){
  if(a?.completedAt || Number(a?.progress||0)>=100)return {code:'done',label:'Concluída',reason:'Conclusão registrada.'};
  const d=parseBrDate(a?.deadline||'');
  if(d){
    const today=new Date();today.setHours(0,0,0,0);
    const end=new Date(d.getFullYear(),d.getMonth(),d.getDate());
    if(today>end)return {code:'overdue',label:'Atrasada',reason:'O prazo da ação venceu.'};
  }
  return {code:'pending',label:'Pendente',reason:'Aguardando conclusão.'};
}
function unifiedManualActionDeadline(a){
  return actionDeadlineInfo({answers:{p12:a?.deadline||''}});
}

function unifiedActionAllSectors(){
  const values=[];
  ['matriz','filial'].forEach(unit=>{
    try{values.push(...getConfiguredSectors(unit))}catch(e){}
  });
  try{values.push(...getConfiguredSectorsForTriage())}catch(e){}
  return [...new Set(values.map(x=>String(x||'').trim()).filter(Boolean))]
    .sort((a,b)=>a.localeCompare(b,'pt-BR'));
}
function populateUnifiedActionDependencySectors(){
  const sel=document.getElementById('unifiedActionDependencySectors');
  if(!sel)return;
  const current=new Set([...sel.selectedOptions].map(o=>o.value));
  sel.innerHTML=unifiedActionAllSectors()
    .map(s=>`<option value="${escapeHtml(s)}"${current.has(s)?' selected':''}>${escapeHtml(s)}</option>`)
    .join('');
}
function unifiedActionSelectedDependencies(){
  const sectors=[...(document.getElementById('unifiedActionDependencySectors')?.selectedOptions||[])]
    .map(o=>String(o.value||'').trim()).filter(Boolean);
  const external=String(document.getElementById('unifiedActionExternalDependencies')?.value||'')
    .split(/\n|;/).map(x=>x.trim()).filter(Boolean);
  return {
    sectors:[...new Set(sectors)],
    external:[...new Set(external)]
  };
}
function unifiedActionDependencyText(a){
  const deps=a?.dependencies||{};
  const sectors=Array.isArray(deps.sectors)?deps.sectors:[];
  const external=Array.isArray(deps.external)?deps.external:[];
  const legacy=String(a?.dependency||'').trim();
  const all=[...sectors,...external];
  if(!all.length&&legacy)all.push(legacy);
  return all.length?all.join(' · '):'—';
}
function openUnifiedActionModal(){
  const ov=document.getElementById('unifiedActionOverlay');
  if(!ov)return;
  document.getElementById('unifiedActionText').value='';
  document.getElementById('unifiedActionDeadline').value='';
  document.getElementById('unifiedActionNote').value='';
  document.getElementById('unifiedActionType').value='Contenção';
  document.getElementById('unifiedActionProject').value='';
  document.getElementById('unifiedActionSubject').value='';
  document.getElementById('unifiedActionExternalDependencies').value='';
  document.getElementById('unifiedActionUrgency').value='media';
  document.getElementById('unifiedActionNextStep').value='';
  document.getElementById('unifiedActionProgress').value='0';
  document.getElementById('unifiedActionRemaining').value='';
  populateUnifiedActionDependencySectors();

  const mode=document.getElementById('unifiedActionMode');
  if(isAdmin()){
    mode.innerHTML='<option value="self">Para mim</option><option value="person">Pessoa</option><option value="sector">Grupo / setor</option>';
  }else if(isManager()){
    mode.innerHTML='<option value="self">Para mim</option><option value="person">Liderado</option>';
  }else{
    mode.innerHTML='<option value="self">Para mim</option>';
  }
  mode.value='self';

  const unit=document.getElementById('unifiedActionUnit');
  if(unit)unit.value=currentUserUnit();

  refreshUnifiedActionTargetUi();
  ov.classList.add('open');
  document.body.style.overflow='hidden';
}
function closeUnifiedActionModal(){
  document.getElementById('unifiedActionOverlay')?.classList.remove('open');
  document.body.style.overflow='';
}
function refreshUnifiedActionTargetUi(){
  const mode=document.getElementById('unifiedActionMode')?.value||'self';
  const personWrap=document.getElementById('unifiedActionPersonWrap');
  const personSectorWrap=document.getElementById('unifiedActionPersonSectorWrap');
  const sectorWrap=document.getElementById('unifiedActionSectorWrap');
  const unitWrap=document.getElementById('unifiedActionUnitWrap');
  const person=document.getElementById('unifiedActionPerson');
  const personSector=document.getElementById('unifiedActionPersonSector');
  const sector=document.getElementById('unifiedActionSector');
  const unit=document.getElementById('unifiedActionUnit')?.value||currentUserUnit();
  const summary=document.getElementById('unifiedActionTargetSummary');

  if(personWrap)personWrap.classList.toggle('hidden',mode!=='person');
  if(personSectorWrap)personSectorWrap.classList.toggle('hidden',mode!=='person');
  if(sectorWrap)sectorWrap.classList.toggle('hidden',mode!=='sector');
  if(unitWrap)unitWrap.classList.toggle('hidden',!(isAdmin()&&mode==='sector'));

  if(mode==='person'&&personSector){
    const users=unifiedActionAssignableUsers();
    const sectors=[...new Set(users.flatMap(u=>[
      u.sector,
      ...(Array.isArray(u.sectorMemberships)?u.sectorMemberships.map(m=>m.sector):[])
    ]).map(x=>String(x||'').trim()).filter(Boolean))]
      .sort((a,b)=>a.localeCompare(b,'pt-BR'));

    const currentSector=personSector.value||'';
    personSector.innerHTML='<option value="">Selecione o setor...</option>'+
      sectors.map(s=>`<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
    if(currentSector && [...personSector.options].some(o=>o.value===currentSector))personSector.value=currentSector;

    refreshUnifiedActionPeopleBySector();
  }

  if(mode==='sector'&&sector){
    const sectors=getConfiguredSectors(unit).slice().sort((a,b)=>a.localeCompare(b,'pt-BR'));
    sector.innerHTML='<option value="">Selecione...</option>'+sectors.map(s=>`<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
  }

  if(summary){
    if(mode==='self')summary.textContent='A ação será criada somente para você.';
    else if(mode==='person')summary.textContent=isManager()
      ?'Escolha primeiro um setor sob sua gestão e depois o liderado.'
      :'Escolha primeiro o setor e depois a pessoa responsável.';
    else summary.textContent='Será criada uma ação individual para cada usuário ativo do setor selecionado.';
  }
}

function refreshUnifiedActionPeopleBySector(){
  const person=document.getElementById('unifiedActionPerson');
  const sector=String(document.getElementById('unifiedActionPersonSector')?.value||'').trim();
  if(!person)return;

  if(!sector){
    person.innerHTML='<option value="">Selecione primeiro o setor...</option>';
    return;
  }

  const users=unifiedActionAssignableUsers()
    .filter(u=>{
      const sectors=[
        u.sector,
        ...(Array.isArray(u.sectorMemberships)?u.sectorMemberships.map(m=>m.sector):[])
      ].filter(Boolean);
      return sectors.some(s=>normalizeAnswer(s)===normalizeAnswer(sector));
    })
    .sort((a,b)=>String(a.name||a.email||'').localeCompare(String(b.name||b.email||''),'pt-BR'));

  person.innerHTML='<option value="">Selecione a pessoa...</option>'+
    users.map(u=>
      `<option value="${escapeHtml(unifiedActionUserKey(u))}">${escapeHtml(u.name||u.email)} · ${escapeHtml(canonicalUnitName(u.unit||''))}</option>`
    ).join('');

  if(!users.length){
    person.innerHTML='<option value="">Nenhuma pessoa ativa neste setor</option>';
  }
}

async function saveUnifiedAction(){
  const text=String(document.getElementById('unifiedActionText')?.value||'').trim();
  const deadline=String(document.getElementById('unifiedActionDeadline')?.value||'').trim();
  const note=String(document.getElementById('unifiedActionNote')?.value||'').trim();
  const type=String(document.getElementById('unifiedActionType')?.value||'Ação').trim();
  const project=String(document.getElementById('unifiedActionProject')?.value||'').trim();
  const subject=String(document.getElementById('unifiedActionSubject')?.value||'').trim();
  const dependencies=unifiedActionSelectedDependencies();
  const urgency=String(document.getElementById('unifiedActionUrgency')?.value||'media').trim();
  const nextStep=String(document.getElementById('unifiedActionNextStep')?.value||'').trim();
  const progress=Math.max(0,Math.min(100,Number(document.getElementById('unifiedActionProgress')?.value||0)));
  const remaining=String(document.getElementById('unifiedActionRemaining')?.value||'').trim();
  const mode=String(document.getElementById('unifiedActionMode')?.value||'self');
  if(!text){alert('Informe a ação.');return}

  const session=getSession()||{};
  const creatorKey=unifiedCurrentUserKey();
  const creatorName=session.name||session.email||'Usuário';
  const now=new Date().toISOString();
  let assignees=[];

  if(mode==='self'){
    assignees=[{
      key:creatorKey,
      name:creatorName,
      sector:session.sector||'',
      unit:session.unit||''
    }];
  }else if(mode==='person'){
    const selectedSector=String(document.getElementById('unifiedActionPersonSector')?.value||'').trim();
    const key=String(document.getElementById('unifiedActionPerson')?.value||'').trim().toLowerCase();
    if(!selectedSector){alert('Selecione primeiro o setor da pessoa.');return}
    if(!key){alert('Selecione a pessoa.');return}
    if(!unifiedActionCanCreateFor(mode,key)){alert('Você não pode atribuir ação para esta pessoa.');return}
    const u=getOperationalUsers().find(x=>unifiedActionUserKey(x)===key);
    if(!u){alert('Pessoa não encontrada.');return}

    const belongs=[
      u.sector,
      ...(Array.isArray(u.sectorMemberships)?u.sectorMemberships.map(m=>m.sector):[])
    ].filter(Boolean).some(s=>normalizeAnswer(s)===normalizeAnswer(selectedSector));
    if(!belongs){alert('A pessoa selecionada não pertence ao setor informado.');return}

    assignees=[{key,name:u.name||u.email,sector:selectedSector,unit:u.unit||''}];
  }else if(mode==='sector'){
    if(!isAdmin()){alert('Somente o SGQ pode atribuir ações por grupo/setor.');return}
    const unit=String(document.getElementById('unifiedActionUnit')?.value||'matriz');
    const sector=String(document.getElementById('unifiedActionSector')?.value||'').trim();
    if(!sector){alert('Selecione o grupo/setor.');return}
    assignees=getOperationalUsers()
      .filter(unifiedActionIsActiveUser)
      .filter(u=>userHasUnitSector(u,unit,sector))
      .map(u=>({key:unifiedActionUserKey(u),name:u.name||u.email,sector,unit:u.unit||unit}));
    if(!assignees.length){alert('Não há usuários ativos neste setor.');return}
  }else{
    alert('Tipo de atribuição inválido.');
    return;
  }

  const list=getUnifiedManualActions();
  const groupId='ACTGRP-'+Date.now()+'-'+Math.random().toString(36).slice(2,7);
  assignees.forEach((a,i)=>{
    list.push({
      id:'ACT-'+Date.now()+'-'+i+'-'+Math.random().toString(36).slice(2,7),
      groupId:assignees.length>1?groupId:'',
      source:mode==='self'?'self':'assigned',
      action:text,
      deadline,
      note,
      type,
      project,
      subject,
      dependencies,
      dependency:[...(dependencies.sectors||[]),...(dependencies.external||[])].join(' · '),
      urgency,
      nextStep,
      progress,
      remaining,
      history:[{
        id:'UPD-'+Date.now()+'-'+Math.random().toString(36).slice(2,6),
        at:now,
        byKey:creatorKey,
        byName:creatorName,
        text:'Ação criada.',
        progress,
        remaining,
        nextStep
      }],
      assigneeKey:a.key,
      assigneeName:a.name,
      sector:a.sector||'',
      unit:a.unit||'',
      createdByKey:creatorKey,
      createdByName:creatorName,
      createdAt:now,
      completedAt:'',
      completedBy:'',
      evidence:''
    });
  });
  saveUnifiedManualActions(list);

  // Local/global shared_state persistence is handled automatically by the shared key.
  assignees.forEach(a=>{
    createNotification({
      type:'action',
      skipEmail:true,
      audience:'user',
      userKey:a.key,
      sector:a.sector||'',
      title:mode==='self'?'Nova ação pessoal':'Nova ação atribuída',
      message:text+(deadline?' · Prazo: '+formatDateBR(deadline):'')
    });
  });

  closeUnifiedActionModal();
  renderActionsDashboard();
  refreshUserPendingActionAlert();
  alert(assignees.length>1?`Ação atribuída a ${assignees.length} pessoa(s).`:'Ação criada.');
}
function unifiedManualActionCanComplete(a){
  const me=unifiedCurrentUserKey();
  return String(a?.assigneeKey||'').toLowerCase()===me || isAdmin();
}

function unifiedActionCanUpdate(a){
  if(!a)return false;
  const me=unifiedCurrentUserKey();
  if(isAdmin())return true;
  if(String(a.assigneeKey||'').toLowerCase()===me)return true;
  if(isManager()){
    const target=getOperationalUsers().find(u=>unifiedActionUserKey(u)===String(a.assigneeKey||'').toLowerCase());
    const sectors=[
      target?.sector,
      ...(Array.isArray(target?.sectorMemberships)?target.sectorMemberships.map(m=>m.sector):[])
    ].filter(Boolean);
    if(sectors.some(managesSector))return true;
  }
  return false;
}
function openUnifiedActionHistory(id){
  const a=getUnifiedManualActions().find(x=>String(x.id)===String(id));
  if(!a)return;
  if(!unifiedActionCanSee(a)){alert('Você não possui acesso a esta ação.');return}

  const ov=document.getElementById('unifiedActionHistoryOverlay');
  if(!ov)return;
  document.getElementById('unifiedActionHistoryId').value=String(a.id||'');
  document.getElementById('unifiedActionHistoryTitle').textContent=a.action||'Acompanhamento da ação';
  document.getElementById('unifiedActionHistorySubtitle').textContent=
    [a.id,a.assigneeName,a.sector].filter(Boolean).join(' · ');

  const canUpdate=unifiedActionCanUpdate(a);
  const updateBlock=document.getElementById('unifiedActionUpdateText')?.closest('.settings-block');
  if(updateBlock)updateBlock.style.display=canUpdate?'':'none';

  document.getElementById('unifiedActionUpdateText').value='';
  document.getElementById('unifiedActionUpdateProgress').value=String(Math.max(0,Math.min(100,Number(a.progress||0))));
  document.getElementById('unifiedActionUpdateRemaining').value=a.remaining||'';
  document.getElementById('unifiedActionUpdateNextStep').value=a.nextStep||'';

  renderUnifiedActionHistory(a);
  ov.classList.add('open');
  document.body.style.overflow='hidden';
}
function closeUnifiedActionHistory(){
  document.getElementById('unifiedActionHistoryOverlay')?.classList.remove('open');
  document.body.style.overflow='';
}
function renderUnifiedActionHistory(a){
  const summary=document.getElementById('unifiedActionDetailSummary');
  const timeline=document.getElementById('unifiedActionTimeline');
  if(summary){
    const progress=Math.max(0,Math.min(100,Number(a.progress||0)));
    summary.innerHTML=`
      <div><span>Responsável</span><b>${escapeHtml(a.assigneeName||'-')}</b></div>
      <div><span>Setor</span><b>${escapeHtml(a.sector||'-')}</b></div>
      <div><span>Tipo</span><b>${escapeHtml(a.type||'Ação')}</b></div>
      <div><span>Urgência</span><b>${escapeHtml(unifiedActionUrgencyLabel(a.urgency))}</b></div>
      <div><span>Dependências</span><b>${escapeHtml(unifiedActionDependencyText(a))}</b></div>
      <div><span>Prazo</span><b>${escapeHtml(a.deadline?formatDateBR(a.deadline):'—')}</b></div>
      <div class="full"><span>Próximo passo</span><b>${escapeHtml(a.nextStep||'—')}</b></div>
      <div class="full"><span>Falta para terminar</span><b>${escapeHtml(a.remaining||'—')}</b></div>
      <div class="full">
        <span>Andamento</span>
        <div class="action-progress-bar large"><span style="width:${progress}%"></span></div>
        <b>${progress}%</b>
      </div>`;
  }

  if(timeline){
    const history=Array.isArray(a.history)?a.history.slice():[];
    history.sort((x,y)=>String(y.at||'').localeCompare(String(x.at||'')));
    timeline.innerHTML=history.length?history.map(h=>`
      <div class="action-timeline-item">
        <div class="action-timeline-dot"></div>
        <div class="action-timeline-content">
          <div class="action-timeline-head">
            <b>${escapeHtml(h.byName||'Usuário')}</b>
            <span>${escapeHtml(unifiedActionDateTimeLabel(h.at))}</span>
          </div>
          <div class="action-timeline-text">${escapeHtml(h.text||'Atualização registrada.')}</div>
          <div class="action-timeline-meta">
            <span>${Math.max(0,Math.min(100,Number(h.progress||0)))}% concluído</span>
            ${h.remaining?`<span>Falta: ${escapeHtml(h.remaining)}</span>`:''}
            ${h.nextStep?`<span>Próximo: ${escapeHtml(h.nextStep)}</span>`:''}
          </div>
        </div>
      </div>`).join(''):'<div class="small">Nenhuma atualização registrada.</div>';
  }
}
function saveUnifiedActionUpdate(){
  const id=String(document.getElementById('unifiedActionHistoryId')?.value||'');
  const list=getUnifiedManualActions();
  const i=list.findIndex(a=>String(a.id)===id);
  if(i<0)return;
  const a=list[i];
  if(!unifiedActionCanUpdate(a)){alert('Você não pode atualizar esta ação.');return}

  const text=String(document.getElementById('unifiedActionUpdateText')?.value||'').trim();
  const progress=Math.max(0,Math.min(100,Number(document.getElementById('unifiedActionUpdateProgress')?.value||0)));
  const remaining=String(document.getElementById('unifiedActionUpdateRemaining')?.value||'').trim();
  const nextStep=String(document.getElementById('unifiedActionUpdateNextStep')?.value||'').trim();

  if(!text){alert('Descreva o que foi feito ou o que mudou.');return}

  const now=new Date().toISOString();
  const session=getSession()||{};
  const history=Array.isArray(a.history)?a.history.slice():[];
  history.push({
    id:'UPD-'+Date.now()+'-'+Math.random().toString(36).slice(2,6),
    at:now,
    byKey:unifiedCurrentUserKey(),
    byName:session.name||session.email||'Usuário',
    text,
    progress,
    remaining,
    nextStep
  });

  list[i]={
    ...a,
    progress,
    remaining,
    nextStep,
    history,
    updatedAt:now,
    ...(progress>=100?{
      completedAt:a.completedAt||now,
      completedBy:a.completedBy||session.name||session.email||'Usuário'
    }:{
      completedAt:'',
      completedBy:''
    })
  };
  saveUnifiedManualActions(list);

  renderUnifiedActionHistory(list[i]);
  document.getElementById('unifiedActionUpdateText').value='';
  renderActionsDashboard();
  refreshUserPendingActionAlert();
}

function completeUnifiedManualAction(id){
  const list=getUnifiedManualActions();
  const i=list.findIndex(a=>String(a.id)===String(id));
  if(i<0)return;
  if(!unifiedManualActionCanComplete(list[i])){alert('Esta ação não está atribuída a você.');return}

  const evidence=prompt('Descreva brevemente o que foi feito / evidência da conclusão:',list[i].evidence||'');
  if(evidence===null)return;
  if(!String(evidence).trim()){alert('Informe a evidência ou resultado da ação.');return}

  const now=new Date().toISOString();
  const actor=getSession()?.name||getSession()?.email||'Usuário';
  const history=Array.isArray(list[i].history)?list[i].history.slice():[];
  history.push({
    id:'UPD-'+Date.now()+'-'+Math.random().toString(36).slice(2,6),
    at:now,
    byKey:unifiedCurrentUserKey(),
    byName:actor,
    text:'Ação concluída. '+String(evidence).trim(),
    progress:100,
    remaining:'',
    nextStep:'Concluída'
  });

  list[i]={
    ...list[i],
    evidence:String(evidence).trim(),
    progress:100,
    remaining:'',
    nextStep:'Concluída',
    history,
    completedAt:now,
    updatedAt:now,
    completedBy:actor
  };
  saveUnifiedManualActions(list);
  renderActionsDashboard();
  refreshUserPendingActionAlert();
}
function deleteUnifiedManualAction(id){
  const list=getUnifiedManualActions();
  const a=list.find(x=>String(x.id)===String(id));
  if(!a)return;
  const me=unifiedCurrentUserKey();
  const allowed=isAdmin() || String(a.createdByKey||'').toLowerCase()===me;
  if(!allowed){alert('Somente quem criou a ação ou o SGQ pode excluí-la.');return}
  if(!confirm('Excluir esta ação?'))return;
  saveUnifiedManualActions(list.filter(x=>String(x.id)!==String(id)));
  renderActionsDashboard();
  refreshUserPendingActionAlert();
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
  const out=[];
  const sector=currentSector();

  getAllSentPdcas().forEach(p=>{
    allPdcaActionsForRecord(p).forEach(a=>{
      const assigned=parseResponsibleSectors(a.responsibleSectors?.length?a.responsibleSectors:a.owner);
      if(!assigned.some(s=>normalizeAnswer(s)===normalizeAnswer(sector)||(isManager()&&managesSector(s))))return;
      const pseudo={...p,answers:{...(p.answers||{}),p11:a.action,p12:a.deadline,p13:a.owner},acaoConferidaEm:a.completedAt||a.acaoConferidaEm};
      const status=inferActionStatus(pseudo);
      if(status.code!=='done')out.push({source:'pdca',p,actionRecord:a,status});
    });
  });

  getUnifiedManualActions()
    .filter(unifiedActionCanSee)
    .forEach(a=>{
      const status=unifiedManualActionStatus(a);
      if(status.code!=='done')out.push({source:a.source,manualAction:a,status});
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

  // Ações originadas de PDCA.
  sent.forEach(p=>{
    allPdcaActionsForRecord(p).forEach(a=>{
      const assigned=parseResponsibleSectors(a.responsibleSectors?.length?a.responsibleSectors:a.owner);
      const visible=admin||assigned.some(s=>normalizeAnswer(s)===normalizeAnswer(currentSector())||(isManager()&&managesSector(s)));
      if(!visible)return;
      const pseudo={...p,answers:{...(p.answers||{}),p11:a.action,p12:a.deadline,p13:a.owner},acaoConferidaEm:a.completedAt||a.acaoConferidaEm};
      const status=inferActionStatus(pseudo);
      const sourceRo=findRoByAnyNumber(p.ro||'',p.origemBase||p.sourceRoOrigin||'');
      items.push({
        source:'pdca',sourceLabel:'PDCA',
        id:a.id||p.id||'PDCA',
        createdAt:p.envio||p.dataEnvio||p.sentAt||'',
        type:'Ação corretiva',
        project:p.ro||'-',
        subject:sourceRo?.cliente||p.cliente||p.titulo||p.title||'PDCA',
        dependency:'',
        urgency:pdcaActionUrgency(status),
        nextStep:status.code==='review'?'Aguardar conferência do SGQ':status.code==='overdue'?'Regularizar ação atrasada':'Executar ação e registrar evidência',
        updatedAt:a.completedAt||p.updatedAt||p.envio||'',
        p,actionRecord:a,
        ro:p.ro||'-',setor:p.setor||assigned.join(', ')||'-',acao:a.action||'',
        responsavel:a.owner||p.responsavel||'-',
        responsibleSectors:assigned,prazo:a.deadline||'-',
        status,deadline:actionDeadlineInfo(pseudo),impacta5S:status.code==='overdue'
      });
    });
  });

  // Ações atribuídas / pessoais.
  getUnifiedManualActions().filter(unifiedActionCanSee).forEach(a=>{
    const status=unifiedManualActionStatus(a);
    items.push({
      source:a.source==='self'?'self':'assigned',
      sourceLabel:a.source==='self'?'Pessoal':'Atribuída',
      id:a.id||'-',
      createdAt:a.createdAt||'',
      type:a.type||'Ação',
      project:a.project||'—',
      subject:a.subject||'—',
      dependency:unifiedActionDependencyText(a),
      urgency:a.urgency||'media',
      nextStep:a.nextStep||'—',
      progress:Number(a.progress||0),
      remaining:a.remaining||'',
      updatedAt:a.completedAt||a.updatedAt||a.createdAt||'',
      manualAction:a,
      ro:a.project||'—',
      setor:a.sector||'-',
      acao:a.action||'',
      responsavel:a.assigneeName||unifiedActionUserDisplay(a.assigneeKey),
      responsibleSectors:a.sector?[a.sector]:[],
      prazo:a.deadline||'-',
      status,
      deadline:unifiedManualActionDeadline(a),
      impacta5S:false
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
  const personWrap=document.getElementById('actionsPersonFilterWrap');
  const personSel=document.getElementById('actionsPersonFilter');
  if(!wrap||!sel)return;

  const items=actionDashboardItems();
  const current=sel.value||'all';

  if(!isAdmin()&&!isManager()){
    wrap.style.display='none';
  }else{
    wrap.style.display='';
    const sectors=[...new Set(items.flatMap(x=>x.responsibleSectors||[]).filter(Boolean))]
      .sort((a,b)=>a.localeCompare(b,'pt-BR'));
    sel.innerHTML='<option value="all">Todos os setores</option>'+sectors.map(s=>`<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
    if([...sel.options].some(o=>o.value===current))sel.value=current;
  }

  if(personWrap&&personSel){
    const people=[...new Set(items.map(x=>String(x.responsavel||'').trim()).filter(Boolean))]
      .sort((a,b)=>a.localeCompare(b,'pt-BR'));
    const currentPerson=personSel.value||'all';
    personSel.innerHTML='<option value="all">Todas as pessoas</option>'+people.map(p=>`<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`).join('');
    if([...personSel.options].some(o=>o.value===currentPerson))personSel.value=currentPerson;
    personWrap.style.display=people.length?'':'none';
  }
}
function unifiedActionRowButtons(x){
  if(x.source==='pdca'){
    const buttons=[];
    if(x.p?.id)buttons.push(`<button class="btn secondary" type="button" onclick="openPdcaReport('${escapeHtml(x.p.id)}')">Ver PDCA</button>`);
    if(x.status.code!=='done' && !isAdmin() && x.actionRecord?.id){
      buttons.push(`<button class="btn primary" type="button" onclick="registerActionEvidence('${escapeHtml(x.p.id)}','${escapeHtml(x.actionRecord.id)}')">Registrar conclusão</button>`);
    }
    if(isAdmin() && x.status.code==='review' && x.p?.id){
      buttons.push(`<button class="btn primary" type="button" onclick="confirmActionCompletion('${escapeHtml(x.p.id)}')">Confirmar conclusão</button>`);
    }
    if(canContestActionSector(x.p,x.actionRecord)){
      const c=getActionSectorContest(x.actionRecord.id,currentSector());
      if(c?.status==='pending')buttons.push('<span class="status-badge pending">Contestação em análise</span>');
      else if(c?.status==='accepted')buttons.push('<span class="status-badge answered">Retirado da ação</span>');
      else buttons.push(`<button class="btn secondary" type="button" onclick="contestActionSector('${escapeHtml(x.p.id)}','${escapeHtml(x.actionRecord.id)}')">Contestar</button>`);
    }
    return buttons.join('');
  }

  const a=x.manualAction||{};
  const buttons=[];
  buttons.push(`<button class="btn secondary" type="button" onclick="openUnifiedActionHistory('${escapeHtml(a.id)}')">Acompanhar</button>`);
  if(x.status.code!=='done' && unifiedManualActionCanComplete(a)){
    buttons.push(`<button class="btn primary" type="button" onclick="completeUnifiedManualAction('${escapeHtml(a.id)}')">Concluir</button>`);
  }
  const me=unifiedCurrentUserKey();
  if(isAdmin() || String(a.createdByKey||'').toLowerCase()===me){
    buttons.push(`<button class="btn secondary" type="button" onclick="deleteUnifiedManualAction('${escapeHtml(a.id)}')">Excluir</button>`);
  }
  return buttons.join('')||'<span class="small">Somente acompanhamento</span>';
}
function renderActionsDashboard(){
  const items=actionDashboardItems();
  const statusFilter=document.getElementById('actionsStatusFilter')?.value||'all';
  const search=normalizeAnswer(document.getElementById('actionsSearch')?.value||'');
  const sectorFilter=document.getElementById('actionsSectorFilter')?.value||'all';
  const originFilter=document.getElementById('actionsOriginFilter')?.value||'all';
  const personFilter=document.getElementById('actionsPersonFilter')?.value||'all';
  const urgencyFilter=document.getElementById('actionsUrgencyFilter')?.value||'all';

  const counts={pending:0,overdue:0,review:0,done:0};
  items.forEach(x=>{ if(counts[x.status.code]!==undefined) counts[x.status.code]++; });
  ['sumPending','sumOverdue','sumReview','sumDone'].forEach((id,i)=>{
    const key=['pending','overdue','review','done'][i];
    const el=document.getElementById(id);if(el)el.textContent=counts[key]||0;
  });

  let filtered=items.filter(x=>{
    if(statusFilter!=='all' && x.status.code!==statusFilter)return false;
    if(originFilter!=='all' && x.source!==originFilter)return false;
    if(urgencyFilter!=='all' && normalizeAnswer(x.urgency)!==normalizeAnswer(urgencyFilter))return false;
    if(personFilter!=='all' && normalizeAnswer(x.responsavel)!==normalizeAnswer(personFilter))return false;
    if((isAdmin()||isManager()) && sectorFilter!=='all' && !(x.responsibleSectors||[]).some(s=>normalizeAnswer(s)===normalizeAnswer(sectorFilter)))return false;
    if(search){
      const hay=normalizeAnswer([
        x.id,x.sourceLabel,x.type,x.project,x.ro,x.subject,x.setor,x.acao,x.responsavel,
        x.dependency,x.nextStep,x.remaining,x.manualAction?.createdByName
      ].join(' '));
      if(!hay.includes(search))return false;
    }
    return true;
  });

  filtered.sort((a,b)=>{
    const da=a.deadline.days, db=b.deadline.days;
    if(da===null && db===null)return String(a.acao).localeCompare(String(b.acao),'pt-BR');
    if(da===null)return 1;
    if(db===null)return -1;
    return da-db;
  });

  const body=document.getElementById('actionsDashboardBody');
  if(!body)return;
  body.innerHTML=filtered.length?filtered.map(x=>`<tr>
    <td><b>${escapeHtml(x.id||'-')}</b></td>
    <td>${escapeHtml(unifiedActionDateLabel(x.createdAt))}</td>
    <td><span class="action-origin-badge ${escapeHtml(x.source)}">${escapeHtml(x.type||x.sourceLabel)}</span></td>
    <td>${escapeHtml(x.project||x.ro||'—')}</td>
    <td>${escapeHtml(x.subject||'—')}</td>
    <td><div class="action-main-text">${escapeHtml(x.acao)}</div>${x.manualAction?.note?`<div class="small" style="margin-top:4px">${escapeHtml(x.manualAction.note)}</div>`:''}</td>
    <td><b>${escapeHtml(x.responsavel)}</b></td>
    <td>${escapeHtml(x.setor)}</td>
    <td>${escapeHtml(x.dependency||'—')}</td>
    <td><span class="urgency-pill ${escapeHtml(normalizeAnswer(x.urgency||'media'))}">${escapeHtml(unifiedActionUrgencyLabel(x.urgency))}</span></td>
    <td><span class="action-pill ${x.status.code}">${escapeHtml(x.status.label)}</span>${x.impacta5S?'<div class="five-s-impact">Impacta 5S</div>':x.source==='pdca'?'<div class="five-s-neutral">Sem impacto no 5S</div>':''}</td>
    <td>
      ${escapeHtml(x.nextStep||'—')}
      ${x.source!=='pdca'?`<div class="action-progress-wrap"><div class="action-progress-bar"><span style="width:${Math.max(0,Math.min(100,Number(x.progress||0)))}%"></span></div><small>${Math.max(0,Math.min(100,Number(x.progress||0)))}% concluído${x.remaining?' · Falta: '+escapeHtml(x.remaining):''}</small></div>`:''}
      <div class="small deadline-text ${x.deadline.cls}" style="margin-top:4px">${escapeHtml(x.deadline.text)}</div>
    </td>
    <td>${escapeHtml(unifiedActionDateTimeLabel(x.updatedAt))}</td>
    <td><div class="unified-action-buttons">${unifiedActionRowButtons(x)}</div></td>
  </tr>`).join(''):`<tr><td colspan="14" style="text-align:center;color:#667085;padding:24px">Nenhuma ação encontrada nesta visão.</td></tr>`;
}
function showActionsDashboard(){
  if(!nucleoFeatureRequire('pdca','actions'))return;
  view('actionsDashboardView');
  setNav('actions');

  try{
    populateActionsSectorFilter();
    const scope=document.getElementById('actionsScopeLabel');
    if(scope){
      scope.textContent=isAdmin()
        ?'SGQ · todas as ações'
        :isManager()
          ?'Gestor · minhas + liderados'
          :'Minhas ações';
    }
    renderActionsDashboard();
  }catch(err){
    console.error('Erro ao carregar Ações:',err);
    const body=document.getElementById('actionsDashboardBody');
    if(body)body.innerHTML='<tr><td colspan="14" style="padding:24px;text-align:center;color:#667085">Não foi possível carregar as ações nesta visualização.</td></tr>';
  }
}

// Compatibilidade: a antiga tela "Ações pendentes" agora abre a área unificada.
function showPendingActions(){
  showActionsDashboard();
}
function renderPendingActions(){
  renderActionsDashboard();
}



function getRoById(id){
  const wanted=String(id??'').trim();
  return getAllRoRecords().find(r=>String(r.id||r.codigo||r.numero||'').trim()===wanted) || null;
}
function roPdfAllowed(ro){
  if(!ro)return false;
  return isAdmin() || canViewRO(ro) || wasRoSubmittedByCurrentUser(ro);
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

  const rows=nucleoRoDisplayRows(known.concat(extras),nucleoSystemFormat('ro',explicitRecordUnit(ro)));
  const body=document.getElementById('roReportBody');
  body.innerHTML=
    `<h1 class="ro-report-title">RELATO DE OCORRÊNCIA</h1>`+
    `<table class="ro-report-table">${rows.map(([k,v])=>`<tr><td>${roReportEsc(k)}</td><td>${roReportEsc(v||'-')}</td></tr>`).join('')}</table>`+
    (nucleoSystemFormat('ro',explicitRecordUnit(ro))?.showEvidence===false?'':evidenceHtml);
  body.innerHTML=nucleoApplySystemModelHtml(body.innerHTML,'ro',explicitRecordUnit(ro));

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
  // Esta leitura é apenas cache da última configuração CENTRAL confirmada.
  // A URL jamais é escolhida pelo navegador: portalApiBase() é definida pelo bootstrap central/publicado.
  let admin={}, dedicated={};
  try{admin=JSON.parse(localStorage.getItem(ADMIN_CONFIG_KEY)||'{}')||{};}catch(e){admin={};}
  try{dedicated=JSON.parse(localStorage.getItem(INTEGRATION_PERSIST_KEY)||'{}')||{};}catch(e){dedicated={};}
  return {
    apiUrl:portalApiBase(),
    apiKey:String(admin.apiKey??dedicated.apiKey??'').trim(),
    autoSync:String(admin.autoSync??dedicated.autoSync??'0'),
    roSyncPeriod:String(admin.roSyncPeriod??dedicated.roSyncPeriod??'all'),
    roSyncDateFrom:String(admin.roSyncDateFrom??dedicated.roSyncDateFrom??''),
    roSyncDateTo:String(admin.roSyncDateTo??dedicated.roSyncDateTo??''),
    savedAt:String(admin.__savedAt??dedicated.savedAt??'')
  };
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

async function downloadCompleteRoPdf(id){
  const wanted=String(id||currentReportRoId||'').trim();
  if(!wanted){
    alert('Não foi possível identificar a R.O.');
    return;
  }

  if(roPdfDownloadInProgress)return;

  const scopedRo=getAllRoRecords().find(r=>String(r.numero||r.id||r.codigo)===String(wanted));
  if(getSession()?.role==='quality'&&(!scopedRo||!qualityRecordAllowed(scopedRo))){
    alert('Esta R.O. não pertence à SETA ES / Unidade Linhares.');
    return;
  }

  // V48: a opção "Gerar PDF completo" precisa usar exatamente o mesmo modelo
  // universal mostrado no editor. A rota antiga `acao=pdf` do Apps Script ainda
  // montava o PDF legado e, por isso, o arquivo saía com alturas/paginação
  // diferentes da folha salva no Núcleo.
  roPdfDownloadInProgress=true;
  setRoPdfButtonState(true);
  try{
    await openRoPdf(wanted);
  }catch(err){
    console.error('Falha ao abrir PDF pelo modelo universal:',err);
    alert('Não foi possível gerar o PDF pelo modelo salvo: '+(err?.message||String(err)));
  }finally{
    roPdfDownloadInProgress=false;
    roPdfRequestToken++;
    setRoPdfButtonState(false);
  }
}

function closeRoReport(){
  const overlay=document.getElementById('roReportOverlay');
  if(overlay) overlay.classList.remove('open');
  document.body.style.overflow='';
}


function nucleoRoModelNormKey(v){
  return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,' ').trim().toLowerCase();
}
function nucleoRoModelValue(ro,source,model,pageNo=1,totalPages=1){
  const raw=ro?.raw||{},src=String(source||'');
  if(src==='#TITLE')return model?.title||'RELATO DE OCORRÊNCIA';
  if(src==='#HEADER')return model?.design?.header||'';
  if(src==='#CODE')return ro?.documentCode||ro?.codigoDocumento||firstValue(raw,['Código do documento','Codigo do documento','Código documento','Codigo documento'])||'';
  if(src==='#REVISION')return ro?.revision||ro?.revisao||firstValue(raw,['Revisão','Revisao','Revisão do documento','Revisao do documento'])||'';
  if(src==='#REGISTER')return ro?.numero||ro?.id||ro?.codigo||'';
  if(src==='#PAGE')return totalPages>1?(pageNo+' / '+totalPages):String(pageNo);
  if(src==='#FOOTER')return model?.footer||'';
  if(src==='#GENERATED')return new Date().toLocaleString('pt-BR');
  if(src==='#EVIDENCE')return '';
  if(src==='#HISTORY')return '';

  if(Object.prototype.hasOwnProperty.call(raw,src) && String(raw[src]??'').trim()!=='')return raw[src];
  const wanted=nucleoRoModelNormKey(src);
  for(const [k,v] of Object.entries(raw))if(nucleoRoModelNormKey(k)===wanted && String(v??'').trim()!=='')return v;

  const values={
    'R.O.':ro?.numero||ro?.id||ro?.codigo||'',
    'RO':ro?.numero||ro?.id||ro?.codigo||'',
    'Data':ro?.data||ro?.dataSolicitacao||'',
    'Unidade':ro?.unidade||'',
    'Cliente':firstValue(raw,['Nome do cliente:','Nome do cliente','Cliente','Cliente / origem'])||ro?.cliente||'',
    'Tipo de ocorrência':ro?.tipoRO||ro?.assunto||'',
    'Setor identificado':ro?.setorIdentificado||'',
    'Setor onde foi identificado':ro?.setorIdentificado||'',
    'Setor causa/responsável':ro?.setor||'',
    'Setor causa / responsável':ro?.setor||'',
    'Setor':ro?.setor||'',
    'Status':ro?.status||'',
    'Descrição':ro?.descricao||'',
    'Matrícula':firstValue(raw,['Matrícula','Matricula']),
    'Responsável pelo registro':firstValue(raw,['Nome e Sobrenome (responsável pelo registro deste formulário):','Nome e Sobrenome (responsável pelo registro deste formulário)','Responsável pelo registro','Responsavel pelo registro']),
    'Número do pedido':firstValue(raw,['Número do pedido:','Número do pedido','Numero do pedido:','Numero do pedido']),
    'Código do item':firstValue(raw,['Código do item:','Código do item','Codigo do item:','Codigo do item']),
    'Ordem de produção':firstValue(raw,['Ordem de produção (código de barras):','Ordem de produção (código de barras)','Ordem de produção','Ordem de producao']),
    'Nota fiscal de venda':firstValue(raw,['Nota fiscal de venda','Nota fiscal de venda:','NF de venda','NF venda']),
    'Quantidade de peças com desvio':firstValue(raw,['Quantidade de peças com desvio:','Quantidade de peças com desvio']),
    'Peso do material descartado/reaproveitado':firstValue(raw,['Peso do material descartado e/ou reaproveitado:','Peso do material descartado e/ou reaproveitado']),
    'Liberado pelo setor de qualidade?':firstValue(raw,['Liberado pelo setor de qualidade?','Liberado pelo setor de qualidade']),
    'Quem liberou':firstValue(raw,['Registre o nome de quem liberou:','Registre o nome de quem liberou']),
    'Ação preventiva':firstValue(raw,['Ação preventiva','Acao preventiva']),
    'Prazo conclusão ação':firstValue(raw,['Prazo conclusão ação','Prazo conclusao acao'])
  };
  for(const [k,v] of Object.entries(values))if(nucleoRoModelNormKey(k)===wanted)return v??'';
  const f=(model?.fields||[]).find(x=>nucleoRoModelNormKey(x?.source)===wanted||nucleoRoModelNormKey(x?.label)===wanted);
  if(f){
    const fw=nucleoRoModelNormKey(f.source||f.label||'');
    for(const [k,v] of Object.entries(values))if(nucleoRoModelNormKey(k)===fw)return v??'';
  }
  return '';
}
function nucleoRoModelEsc(v){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function nucleoRoCellPersistMeta(cell){
  const raw=String(cell?.id||''),mark='~nmeta~',i=raw.indexOf(mark);
  if(i<0)return {source:'',mask:'',fill:'',label:''};
  const parts=raw.slice(i+mark.length).split('~');
  const dec=v=>{try{return decodeURIComponent(String(v||''));}catch(_){return String(v||'');}};
  const hasFill=/^[01]$/.test(parts[2]||'');
  return {source:dec(parts[0]),mask:/^[01]{4}$/.test(parts[1]||'')?parts[1]:'',fill:hasFill?parts[2]:'',label:dec(parts.slice(hasFill?3:2).join('~'))};
}
function nucleoRoModelRowUnits(row){const cells=row?.cells||[];if(!cells.length)return[];const total=cells.reduce((s,c)=>s+Math.max(.01,Number(c.width)||50),0)||100;let used=0;return cells.map((c,i)=>{if(i===cells.length-1)return Math.max(1,100-used);const rem=cells.length-i-1;let u=Math.max(1,Math.round((Math.max(.01,Number(c.width)||50)/total)*100));u=Math.min(u,Math.max(1,100-used-rem));used+=u;return u;});}
function nucleoRoModelRowsHtml(grid,ro,model,images,pageNo=1,totalPages=1){
  const safeColor=(v,d)=>/^#[0-9a-f]{6}$/i.test(String(v||''))?v:d;
  const safeFill=(v,d='#ffffff')=>String(v||'').toLowerCase()==='transparent'?'transparent':safeColor(v,d);
  const rows=Array.isArray(grid)?grid:[];
  return rows.map(row=>{const units=nucleoRoModelRowUnits(row);return '<tr>'+((row.cells||[]).map((cell,ci)=>{
    const meta=nucleoRoCellPersistMeta(cell);
    // V62: alguns backends preservam o texto do placeholder, mas removem a origem
    // especial da célula. Nesse caso, recupere a origem pelo próprio placeholder
    // para que PÁGINA (e os demais campos dinâmicos) continuem funcionando no PDF.
    const persistedText=String(cell.text||'').trim();
    const placeholderSource={
      '[CÓDIGO DO DOCUMENTO]':'#CODE',
      '[CODIGO DO DOCUMENTO]':'#CODE',
      '[REVISÃO]':'#REVISION',
      '[REVISAO]':'#REVISION',
      '[NÚMERO / REGISTRO]':'#REGISTER',
      '[NUMERO / REGISTRO]':'#REGISTER',
      '[PÁGINA]':'#PAGE',
      '[PAGINA]':'#PAGE'
    };
    let src=String(cell.systemSource||meta.source||cell.source||'');
    if(!src)src=placeholderSource[persistedText]||'';
    const rawBw=Number(cell.borderWidth),bw=Math.max(0,Math.min(4,Number.isFinite(rawBw)?rawBw:.5)),bc=safeColor(cell.borderColor,'#999999');
    const sideIndex={Top:0,Right:1,Bottom:2,Left:3};
    const side=(name)=>{const explicit=meta.mask?meta.mask[sideIndex[name]]==='1':cell['border'+name]!==false;return explicit?`${bw}pt solid ${safeColor(cell['border'+name+'Color'],bc)}`:'0';};
    let content='';
    if(cell.type==='image'){
      const img=images?.[cell.imageFileId]||'';
      content=img?`<img src="${nucleoRoModelEsc(img)}" style="display:block;width:100%;height:100%;max-height:${Math.max(3,Number(cell.height)||9)}mm;object-fit:${cell.imageFit==='cover'?'cover':'contain'}">`:'';
    }else if(src){
      content=nucleoRoModelEsc(nucleoRoModelValue(ro,src,model,pageNo,totalPages)).replace(/\n/g,'<br>');
    }else content=nucleoRoModelEsc(cell.text||'').replace(/\n/g,'<br>');
    const visibleLabel=String(cell.labelText||cell.systemLabelText||meta.label||'');
    if(visibleLabel){content=`<div class="cell-stack"><span class="cell-label" style="font-size:${Math.max(5,Number(cell.labelFontSize)||7)}pt;font-weight:${cell.labelBold===false?'400':'700'}">${nucleoRoModelEsc(visibleLabel)}</span><span>${content||''}</span></div>`;}
    return `<td colspan="${units[ci]||1}" ${Number(cell.rowSpan)>1?`rowspan="${Math.floor(Number(cell.rowSpan))}"`:''} style="height:${Math.max(3,Number(cell.height)||9)}mm;background:${cell.backgroundNone===true||meta.fill==='1'?'transparent':safeFill(cell.background,'#ffffff')};color:${safeColor(cell.textColor,'#222222')};border-top:${side('Top')};border-right:${side('Right')};border-bottom:${side('Bottom')};border-left:${side('Left')};padding:1.3mm;text-align:${['left','center','right'].includes(cell.align)?cell.align:'left'};vertical-align:${['top','middle','bottom'].includes(cell.verticalAlign)?cell.verticalAlign:'middle'};font-size:${Math.max(6,Number(cell.fontSize)||9)}pt;font-weight:${cell.bold?'700':'400'};font-style:${cell.italic?'italic':'normal'};overflow-wrap:anywhere;white-space:pre-wrap">${content||'&nbsp;'}</td>`;
   }).join(''))+'</tr>';}).join('');
}
function nucleoRoEvidenceUrls(ro){
  const raw=ro?.raw||{};
  const evidence=String(ro?.evidencia||firstValue(raw,[
    'Insira imagens e/ou vídeos relacionado a ocorrência relatada.',
    'Insira imagens e/ou vídeos relacionado a ocorrência relatada'
  ])||'').trim();
  if(!evidence)return [];
  const urls=evidence.match(/https?:\/\/[^\s,]+/g)||[];
  return [...new Set(urls.map(u=>String(u).replace(/[)\]>]+$/g,'').trim()).filter(Boolean))];
}
function nucleoRoEvidenceImageUrl(url){
  const u=String(url||'').trim();
  if(!u)return '';
  let m=u.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i)||u.match(/[?&]id=([a-zA-Z0-9_-]+)/i);
  if(m?.[1])return 'https://drive.google.com/thumbnail?id='+encodeURIComponent(m[1])+'&sz=w1600';
  return u;
}



































































































































const EXTERNAL_RO_CONTROL_KEY='portal-sgq-external-ro-control-v1';


const SAC_CLASSIFICATION_START_DATE='2026-09-24';
























































































































































































































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















const SAC_REWORK_TYPES=['label_rework','total_rework','reclass_rework','reclass_label_rework'];







































































































































































































function currentRepresentativeName(){return normalizeAnswer(getSession()?.name||'')}
























































let mySacTab='open';


























































































































let sacQuickTab='all';
































































































































































































































































































































































function populateExternalRoSectorSelect(){
  const sel=document.getElementById('externalRoResponsibleSector');
  if(!sel)return;
  const cur=sel.value||'';
  const sectors=getConfiguredSectors();
  sel.innerHTML='<option value="">Selecione...</option>'+sectors.map(s=>`<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
  if(cur&&[...sel.options].some(o=>o.value===cur))sel.value=cur;
}

































































































































































































































































































































































let currentSacPreviewId='';




































































































































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










































































































































































































































































































































































const TRIAGE_KEY='ro-pdca-triage-v2';
const DELETED_TRIAGE_KEYS_KEY='nucleo-deleted-triage-keys-v1';
const HIDDEN_ASSIGNED_KEYS_KEY='nucleo-hidden-assigned-directions-v1';
// Mantém exclusões temporárias de teste entre recargas até a confirmação da fonte oficial.
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

















































































// Resolve a triagem real da R.O. sem confundir chave base com RO::Setor.
// Todas as telas que perguntam "já foi triada?" devem usar esta função.

















































































































































































































































































































const NUCLEO_PDCA_REVIEW_2026_KEY='nucleo-pdca-review-2026-v1';










































































































































































































































































































































































































































function usersBySector(sector){
  const wanted=normalizeAnswer(sector||'');
  return activeOperationalUsers()
    .filter(u=>{const ro=getAllRoRecords().find(r=>String(r.numero||r.id||r.codigo)===String(currentTriageRoId));const unit=explicitPortalUnit(document.getElementById('triageRoUnit')?.value)||(ro?roUnit(ro):adminScopeUnit());return userHasUnitSector(u,unit,sector);})
    .sort((a,b)=>String(a.name||'').localeCompare(String(b.name||''),'pt-BR'));
}


































































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






































































































































































































function nextTuesdayIsoDate(fromDate=new Date()){
  const d=new Date(fromDate.getFullYear(),fromDate.getMonth(),fromDate.getDate());
  const days=(2-d.getDay()+7)%7 || 7;
  d.setDate(d.getDate()+days);
  const y=d.getFullYear();
  const m=String(d.getMonth()+1).padStart(2,'0');
  const day=String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}






















































let nucleoTriageSaving=false;









































































































































































































































































































































































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













































































































































































































































































































































































function getOfflineQueue(){try{return JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY)||'[]')||[]}catch(e){return []}}
function setOfflineQueue(q){localStorage.setItem(OFFLINE_QUEUE_KEY,JSON.stringify(q.slice(-500)))}
function queueOfflineOperation(op){const q=getOfflineQueue();q.push({...op,queuedAt:new Date().toISOString()});setOfflineQueue(q);updateNetworkState()}
async function flushOfflineQueue(){
  // Operações empresariais não são mais reproduzidas a partir de fila local.
  // Rascunhos continuam locais em suas chaves próprias e exigem confirmação explícita do usuário.
  const q=getOfflineQueue();
  if(q.length){
    console.warn('Fila operacional local antiga encontrada e não reenviada automaticamente:',q.length);
  }
  updateNetworkState();
  return q.length===0;
}
function updateNetworkState(){
  // O estado relevante para o usuário é a confirmação da base central, não apenas navigator.onLine.
  if(!navigator.onLine && nucleoCentralSyncState.status!=='synced'){
    nucleoSetCentralSyncState('error','Sem conexão de rede. Os dados em tela são apenas cache local e não estão confirmados pela base central.');
  }else{
    nucleoRenderCentralSyncState();
  }
}
window.addEventListener('online',()=>{updateNetworkState();flushOfflineQueue();setTimeout(()=>syncPortalBackend(false),500)});

// Mantém as máquinas atualizadas sem bombardear o Apps Script nem rerenderizar
// a aplicação a cada poucos segundos. Foco/retorno só sincroniza se a última carga
// já tiver algum tempo, evitando 2–3 chamadas seguidas ao alternar de janela.
let __nucleoCentralRefreshTimer=null;
let __nucleoLastAutoSyncAttempt=0;









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

  const rows=Array.isArray(d.filteredRows)?d.filteredRows:[];
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














































































































































































































































function refreshPresentationScreenState(){
  const p=window.currentPrintPdca;
  const badge=document.getElementById('pdcaPresentationCompletedBadge');
  const btn=document.getElementById('pdcaCompletePresentationBtn');
  if(!p || !badge || !btn)return;

  let rec=getPdcaPresentationMap().get(String(p.id||''));
  if(!rec && (p.claimantDeliveredAt||p.pdcaEnviadoReclamanteEm)){
    rec={presentationCompleted:true,presentedBy:p.claimantDeliveredBy||'Núcleo',completedAt:p.claimantDeliveredAt||p.pdcaEnviadoReclamanteEm,claimantDeliveredAt:p.claimantDeliveredAt||p.pdcaEnviadoReclamanteEm};
  }
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




















































































































































const PDCA_PRESENTATION_KEY='ro-pdca-presentations-v1';
















































































































































































































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























































































































































function escapeHtml(text){
  return String(text).replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}

function refreshPdcaSidebarBadge(){
  try{refreshMenuNotificationBadges()}catch(e){console.warn('Falha ao atualizar indicador de PDCA:',e)}
}
async function nucleoEnsureCentralPdcaSnapshot(){
  // Se uma sincronização geral já estiver em andamento, não iniciar outra em paralelo.
  // Aguarda a sincronização corrente concluir e reaproveita o snapshot confirmado.
  if(portalBackendSyncInProgress){
    const started=Date.now();
    while(portalBackendSyncInProgress && Date.now()-started<45000){
      await new Promise(resolve=>setTimeout(resolve,250));
    }
    if(nucleoCentralPdcaSnapshotReady)return true;
  }

  const ok=await syncPortalBackend(false,{foreground:false});
  if(ok&&nucleoCentralPdcaSnapshotReady)return true;

  // Última tentativa direta: evita falso erro quando a sincronização geral terminou
  // entre a abertura da tela e a chamada acima.
  try{
    const res=await portalJsonp({acao:'portal_load'},60000);
    if(res?.sucesso===false)throw new Error(res.erro||'Falha ao carregar base central.');
    applyPortalBackendSnapshot(res);
    return !!nucleoCentralPdcaSnapshotReady;
  }catch(e){
    console.warn('Falha na leitura direta dos PDCAs recebidos.',e);
    return false;
  }
}

async function nucleoUploadPendingPdcaPdf(pdcaId){
  const p=getSentPdcas().find(x=>String(x.id||'')===String(pdcaId||''));
  if(!p)return;
  try{
    await nucleoDriveLoad();
    if(typeof nucleoDriveOpenForRo==='function'){
      await nucleoDriveOpenForRo(String(p.ro||''),String(p.unidade||p.unit||''),String(p.setor||''));
    }else{
      await nucleoDriveOpen('pdca');
    }
  }catch(e){
    alert('Não foi possível abrir a importação do PDF.\n\n'+String(e?.message||e));
  }
}

async function showSentPdcas(){
  if(!nucleoFeatureRequire('pdca','received'))return;
  view('sentView');
  setNav('sent');
  const lifecycle=document.getElementById('sentLifecycleFilter');
  if(lifecycle){lifecycle.value=isAdmin()?'active':'all';lifecycle.style.display=isAdmin()?'':'none';}
  const body=document.getElementById('sentRows');
  if(body)body.innerHTML='<tr><td colspan="8" class="small">Atualizando PDCAs recebidos com a base central…</td></tr>';
  try{
    const ok=await nucleoEnsureCentralPdcaSnapshot();
    if(!ok)throw new Error('A base central não confirmou os PDCAs recebidos.');
    renderPdcaPdfSummary();
    renderSentPdcas();
    refreshPdcaSidebarBadge();
  }catch(e){
    console.warn('Falha ao atualizar PDCAs recebidos antes da exibição.',e);
    if(body)body.innerHTML='<tr><td colspan="8" class="small" style="color:#a12f2f">Não foi possível consultar a base central agora. Nenhum cache local foi usado. Clique em Sincronizar e tente novamente.</td></tr>';
  }
}
function renderSentPdcas(){
 refreshPdcaSidebarBadge();
 renderPdcaPdfSummary();
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
  const realPdfOnThisRecord=!!(
    p.externalPdf===true ||
    String(p.fileId||p.pdfFileId||p.driveFileId||p.storageFileId||'').trim()
  );
  const realPdfOnSibling=data.some(other=>{
    if(other===p)return false;
    const sameRo=String(other?.ro||other?.roId||other?.numeroRo||'').trim()===String(p?.ro||p?.roId||p?.numeroRo||'').trim();
    if(!sameRo)return false;
    const sameSector=normalizeAnswer(other?.setor||other?.responsibleSector||'')===normalizeAnswer(p?.setor||p?.responsibleSector||'');
    if(!sameSector)return false;
    const sameUnit=!explicitRecordUnit(p)||!explicitRecordUnit(other)||explicitRecordUnit(p)===explicitRecordUnit(other);
    if(!sameUnit)return false;
    return !!(
      other?.externalPdf===true ||
      String(other?.fileId||other?.pdfFileId||other?.driveFileId||other?.storageFileId||'').trim()
    );
  });
  const pdfPending=!!(p.pdfPending||p.legacyMissingPdf||p.controlImported) && !realPdfOnThisRecord && !realPdfOnSibling;
  const detail=pdfPending
    ? (String(p.status||'').toLowerCase().includes('apresent')?'Já apresentado — falta subir o PDF no Núcleo':'Já respondido — falta subir o PDF no Núcleo')
    : delivery?'Encerrada — entregue ao reclamante'
    : confirmed?'Reclamante confirmado — falta entregar a resposta'
    : user?'Cadastro identificado — confirmar'
    :'Reclamante a confirmar';
  return '<tr class="click" onclick="'+(pdfPending?'event.stopPropagation()':'openPdcaReport(\''+escapeHtml(p.id)+'\')')+'"><td><b>'+escapeHtml(name||'PDCA')+'</b>'+(p.externalPdf?'<div class="small">'+escapeHtml(p.setor||'')+' · V'+escapeHtml(p.version||1)+'</div>':'')+(pdfPending?'<div class="small">'+escapeHtml(p.setor||'')+'</div>':'')+'</td><td>'+escapeHtml(p.ro||'')+'</td><td>'+escapeHtml(p.responsavel||'')+'</td><td>'+escapeHtml(claimant||'—')+'<div class="small">'+escapeHtml(detail)+'</div>'+(pdfPending?'<div style="margin-top:6px"><span class="status-badge pending">PDF pendente</span> <button class="btn primary" type="button" onclick="event.stopPropagation();nucleoUploadPendingPdcaPdf(\''+escapeHtml(p.id)+'\')">Subir PDF</button></div>':'')+(isAdmin()&&p.externalPdf&&!delivery?'<button class="btn secondary" type="button" onclick="event.stopPropagation();'+(confirmed?'nucleoConsultPdcaClaimant':'confirmReceivedPdcaClaimant')+'(\''+escapeHtml(p.id)+'\')">'+(confirmed?'Consultar reclamante':'Confirmar reclamante')+'</button>'+(confirmed?'<button class="btn primary" type="button" onclick="event.stopPropagation();confirmReceivedPdcaClaimant(\''+escapeHtml(p.id)+'\')">Entregar resposta</button>':''):'')+'</td><td>'+escapeHtml(canonicalUnitName(p.unidade||p.unit||''))+'</td><td>'+escapeHtml(when||'')+'</td><td><span class="badge">'+escapeHtml(pdfPending?(String(p.status||'').toLowerCase().includes('apresent')?'Apresentado':'Respondido'):delivery?'Encerrada':confirmed?'Aguardando entrega':'Confirmar reclamante')+'</span></td><td class="sent-action">'+(pdfPending?'Subir PDF':'Ver PDCA →')+'</td></tr>';
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






function currentSector(){
  const s=getSession();
  return (s?.sector||'').trim().toLowerCase();
}
function sameSector(sector){
  return sameCanonicalSector(sector,currentSector());
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
    u.approvalStatus!=='inactive' &&
    u.approvalStatus!=='disabled' &&
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






























function isAdmin(){
  // A permissão deve vir exclusivamente do perfil autenticado pelo backend.
  // Não inferir ADM pelo e-mail/cache local: isso fazia um usuário operacional
  // ganhar o menu completo quando usava um e-mail presente na antiga lista de ADMs.
  const session=getSession();
  return !!(session && ['admin','quality'].includes(String(session.role||'').toLowerCase()));
}
































































async function adminCleanupEnsureTestBackend(){
  if(!isAdmin())throw new Error('Esta correção exige acesso SGQ/ADM.');
  const base=portalApiBase();
  if(!base)throw new Error('A base central não está configurada.');
  return base;
}

async function adminCleanupMutation(params,timeout=60000){
  await adminCleanupEnsureTestBackend();
  const res=await portalJsonp({...params},timeout);
  if(!res?.sucesso)throw new Error(res?.erro||'A base central não confirmou a operação.');
  return res;
}

async function adminCleanupDeleteRecord(collection,id){
  if(!id)return true;

  const before=await portalJsonp({
    acao:'portal_get_record',
    colecao:String(collection),
    id:String(id)
  },15000).catch(()=>null);

  if(!before?.registro)return true;

  await adminCleanupMutation({
    acao:'portal_delete',
    colecao:String(collection),
    id:String(id),
    ator:getSession()?.name||'SGQ'
  },60000);

  const after=await portalJsonp({
    acao:'portal_get_record',
    colecao:String(collection),
    id:String(id)
  },15000).catch(()=>null);

  if(after?.registro)throw new Error('A base central ainda apresenta o registro '+id+' após a exclusão.');
  return true;
}

async function adminCleanupSaveSharedState(key,value){
  const id='global:'+String(key);
  const record={
    id,
    key:String(key),
    value:String(value??''),
    scope:'global',
    userKey:'',
    updatedAt:new Date().toISOString(),
    updatedBy:getSession()?.name||'SGQ'
  };

  await adminCleanupMutation({
    acao:'portal_save',
    colecao:'shared_state',
    id,
    dados:JSON.stringify(record),
    ator:getSession()?.name||'SGQ'
  },60000);

  const verify=await portalJsonp({
    acao:'portal_get_record',
    colecao:'shared_state',
    id
  },15000).catch(()=>null);

  if(!verify?.registro || String(verify.registro.value??'')!==String(value??'')){
    throw new Error('A base central não confirmou o marcador da correção.');
  }
  return true;
}

function cleanupRoKey(){
  const raw=String(document.getElementById('adminCleanupRo')?.value||'').trim();
  if(!raw)return '';

  const rows=getAllRoRecords();
  const exact=rows.find(r=>String(r.numero||r.id||r.codigo||'').trim().toLowerCase()===raw.toLowerCase());
  if(exact)return String(exact.numero||exact.id||exact.codigo||'').trim();

  // Permite digitar somente o número, por exemplo 1193.
  if(/^\d+$/.test(raw)){
    const matches=rows.filter(r=>{
      const number=String(r.numero||r.id||r.codigo||'');
      const parts=number.match(/\d+/g)||[];
      return parts.some(x=>Number(x)===Number(raw));
    });
    if(matches.length===1)return String(matches[0].numero||matches[0].id||matches[0].codigo||'').trim();
  }

  return raw;
}

function populateAdminCleanupRos(){
  const input=document.getElementById('adminCleanupRo');
  const list=document.getElementById('adminCleanupRoList');
  if(!input || !list || !isAdmin())return;

  const rows=getAllRoRecords().slice().sort((a,b)=>
    String(a.numero||'').localeCompare(String(b.numero||''),'pt-BR',{numeric:true})
  );

  list.innerHTML=rows.map(r=>{
    const key=String(r.numero||r.id||r.codigo||'').trim();
    const label=[r.cliente||'',r.origemBase||''].filter(Boolean).join(' · ');
    return `<option value="${escapeHtml(key)}" label="${escapeHtml(label)}"></option>`;
  }).join('');

  refreshAdminCleanupPreview();
}





function refreshAdminCleanupPreview(){
  const box=document.getElementById('adminCleanupPreview');
  if(!box)return;
  const key=cleanupRoKey();
  if(!key){
    box.textContent='Selecione uma R.O. para verificar o que existe vinculado.';
    return;
  }

  const cleanupRo=findRoByAnyNumber(key,'');
  if(!cleanupRo){
    box.textContent='Nenhuma R.O. encontrada para "'+key+'".';
    return;
  }
  const tri=resolvedTriageForRo(cleanupRo,getSavedTriageMap());
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

























async function adminCorrectRoSend(){
  if(!isAdmin())return false;
  const key=cleanupRoKey();
  if(!key){alert('Selecione uma R.O.');return false;}

  const ro=findRoByAnyNumber(key,'');
  if(!ro){
    alert('R.O. não encontrada. Digite o número completo ou apenas os dígitos.');
    return false;
  }

  const numero=String(ro.number||ro.numero||ro.ro||key);
  const statusAtual=String(ro.__statusOperacional||ro.status||'').trim();
  const dataAtual=String(ro.__dataEnvioOperacional||'').trim();
  const resultadoAtual=String(ro.__resultadoOperacional||'').trim();
  const detalhe=[
    statusAtual?'Status atual: '+statusAtual:'',
    dataAtual?'Data atual: '+dataAtual:'',
    resultadoAtual?'Resultado atual: '+resultadoAtual:''
  ].filter(Boolean).join('\n');

  const ok=confirm(
    'Corrigir o envio da '+numero+'?\n\n'+
    (detalhe?detalhe+'\n\n':'')+
    'A triagem e o PDCA serão preservados.\n'+
    'O envio voltará para "Não enviado", a data será limpa e o Resultado registrará a correção quando essa coluna existir.'
  );
  if(!ok)return false;

  try{
    await adminCleanupEnsureTestBackend();

    const campos={
      status:'Não enviado',
      dataEnvio:'',
      resultado:'Envio corrigido administrativamente'
    };
    const res=await portalUpdateRoSheetConfirmed(numero,campos);

    ro.__statusOperacional='Não enviado';
    ro.__dataEnvioOperacional='';
    ro.__resultadoOperacional='Envio corrigido administrativamente';

    // Não desfaz a decisão de triagem nem o PDCA. Ajusta apenas a apresentação
    // local do estado para não continuar exibindo o envio antigo até o próximo sync.
    const tri=getRoTriageRecord(ro);
    if(tri?.decision==='directed'){
      ro.status=adminCleanupLinkedPdca(numero).length?'Respondido':'Aguardando resposta';
    }else if(!tri?.decision){
      ro.status='Aguardando triagem';
    }

    try{await syncPortalBackend(false,{foreground:true})}catch(e){}
    try{renderAssignedRos()}catch(e){}
    try{renderTriage()}catch(e){}
    try{refreshRoSummary()}catch(e){}
    try{refreshMenuNotificationBadges()}catch(e){}
    refreshAdminCleanupPreview();

    alert('Envio corrigido. A triagem e o PDCA foram preservados.');
    return true;
  }catch(e){
    console.error('[CORREÇÃO ADMIN] falha ao corrigir envio',e);
    alert('Não foi possível corrigir o envio.\n\n'+String(e?.message||e));
    return false;
  }
}
















































































































































































async function adminDeleteTestDataForRo(){
  if(!isAdmin())return;
  const key=cleanupRoKey();
  if(!key){alert('Selecione uma R.O.');return;}

  const ok=confirm(
    'Excluir PDCA E direcionamento/triagem de '+key+'?\n\n'+
    'A R.O. principal será preservada e voltará para "Aguardando triagem".'
  );
  if(!ok)return;

  const pdcaOk=await adminDeletePdcaForRo(true);
  if(!pdcaOk)return;
  const triageOk=await adminDeleteTriageForRo(true);
  if(!triageOk)return;

  refreshAdminCleanupPreview();
  alert('Direcionamento e PDCA removidos. A R.O. principal foi preservada.');
}


async function saveIntegrationSettingsConfirmed(){
  if(!isAdmin()){alert('Configuração indisponível.');return false}
  if(!requireIntegrationUnlock())return false;
  const candidate=String(document.getElementById('apiUrl')?.value||portalApiBase()).trim();
  const currentBase=portalApiBase();
  const keys=[INTEGRATION_PERSIST_KEY,'ro-sync-settings',ADMIN_CONFIG_KEY];
  const before=keys.map(key=>localStorage.getItem(key));
  const st=document.getElementById('configSavedState');
  if(st){st.classList.remove('hidden');st.textContent='Verificando conexão antes de salvar...'}
  try{
    await nucleoCheckApiUrl(candidate);
    const sync=saveIntegrationSettings(true);
    if(!sync)return false;
    const res=await portalJsonp({acao:'portal_save_config',dados:JSON.stringify(getAdminConfig()),ator:getSession()?.name||'SGQ'},60000,candidate);
    if(!res?.sucesso)throw new Error(res?.erro||'A base central não confirmou a integração.');
    nucleoConfirmedApiUrl=candidate;
    if(st)st.textContent='Integração confirmada e salva na base central.';
    await syncPortalBackend(false);
    alert('Integração salva na base central. Todos os dispositivos usarão esta configuração ao atualizar o Núcleo.');
    return true;
  }catch(e){
    keys.forEach((key,i)=>before[i]===null?localStorage.removeItem(key):localStorage.setItem(key,before[i]));
    if(st)st.textContent='Alteração não confirmada. A conexão anterior foi mantida.';
    alert('Não foi possível confirmar a alteração: '+(e?.message||e));
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

  const cliente=String(raw.__cliente||firstValue(raw,[
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
    'PDCA ENVIADO PARA O RECLAMENTE (DATA)',
    'Data Resposta PDCA'
  ]);
  const situacaoPdca=String(firstValue(raw,['Situação PDCA','Situacao PDCA'])||'').trim();
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
    situacaoPdca,
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
async function loadOfficialRosFullFallback(settings,onProgress,reason){
  const s=settings||getSavedIntegrationSettings();
  const period=roSyncPeriodParams(s);
  if(onProgress)onProgress(0,null,'A leitura por páginas não respondeu. Tentando a leitura completa da base...');
  console.warn('[NÚCLEO SYNC] fallback para leitura completa',reason||'');
  const data=await portalJsonp({...period},150000);
  if(data?.sucesso===false)throw new Error(data.erro||'A planilha recusou a leitura completa.');
  if(!Array.isArray(data?.dados))throw new Error('A leitura completa não devolveu a lista de R.O.s.');
  const total=Number.isFinite(Number(data.quantidade))?Number(data.quantidade):data.dados.length;
  const internas=Number.isFinite(Number(data.quantidadeInterna))?Number(data.quantidadeInterna):null;
  const externas=Number.isFinite(Number(data.quantidadeExterna))?Number(data.quantidadeExterna):null;
  if(total!==data.dados.length)throw new Error('A leitura completa devolveu quantidade incompatível com os registros recebidos.');
  if(onProgress)onProgress(total,total,'Leitura completa concluída: '+total+' R.O.s e SACs.');
  return {...data,quantidade:total,quantidadeInterna:internas,quantidadeExterna:externas,dados:data.dados,__syncMode:'full'};
}
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
    let page=null,lastError=null;
    for(let attempt=1;attempt<=2;attempt++){
      try{
        page=await portalJsonp({acao:'portal_ro_page',...period,offset,limite:pageSize},60000);
        break;
      }catch(e){
        lastError=e;
        if(attempt<2){
          if(onProgress)onProgress(all.length,total,'Repetindo página '+(Math.floor(offset/pageSize)+1)+'...');
          await new Promise(resolve=>setTimeout(resolve,1000*attempt));
        }
      }
    }
    // Se nem a primeira página respondeu, usa a rota completa que continua
    // disponível no mesmo doGet. Isso mantém compatibilidade com implantações
    // que ainda não responderam corretamente ao portal_ro_page.
    if(!page && offset===0)return loadOfficialRosFullFallback(s,onProgress,lastError);
    if(!page)throw new Error('A página '+(Math.floor(offset/pageSize)+1)+' falhou após 2 tentativas: '+(lastError?.message||lastError||'sem resposta'));
    if(page?.sucesso===false){
      if(offset===0)return loadOfficialRosFullFallback(s,onProgress,page.erro||'portal_ro_page recusado');
      throw new Error(page.erro||'A planilha recusou a leitura.');
    }
    if(!page?.paginado||!Array.isArray(page.dados)){
      if(offset===0)return loadOfficialRosFullFallback(s,onProgress,'resposta paginada incompatível');
      throw new Error('A leitura por páginas deixou de responder no meio da sincronização.');
    }
    const expected=Number(page.quantidade);
    if(!Number.isSafeInteger(expected)||expected<0||Number(page.offset)!==offset){
      if(offset===0)return loadOfficialRosFullFallback(s,onProgress,'primeira página inválida');
      throw new Error('A planilha devolveu uma página inválida.');
    }
    if(total===null){total=expected;internas=Number(page.quantidadeInterna);externas=Number(page.quantidadeExterna);meta=page}
    if(total!==expected||internas!==Number(page.quantidadeInterna)||externas!==Number(page.quantidadeExterna))
      throw new Error('A planilha mudou durante a leitura. Execute Sincronizar novamente.');
    if(page.dados.length>pageSize||(!page.dados.length && offset<total))
      throw new Error('A planilha devolveu uma página incompleta.');
    all.push(...page.dados);
    if(onProgress)onProgress(Math.min(all.length,total),total,'Lendo R.O.s e SACs: '+Math.min(all.length,total)+' de '+total+'...');
    await new Promise(resolve=>setTimeout(resolve,0));
  }
  if(all.length!==total)throw new Error('A leitura terminou com registros faltando. Tente sincronizar novamente.');
  return {...meta,quantidade:total,quantidadeInterna:internas,quantidadeExterna:externas,dados:all,__syncMode:'paged'};
}
async function refreshLegacyRoCacheFromApi(force=false){
  if(syncNow.inProgress)return false;
  if(nucleoRoCentralRefreshPromise)return nucleoRoCentralRefreshPromise;
  nucleoRoCentralRefreshPromise=refreshRosFromOfficialSheets(force);
  try{return await nucleoRoCentralRefreshPromise}
  finally{nucleoRoCentralRefreshPromise=null}
}
async function refreshRosFromOfficialSheets(force=false){
  const splitNow=force?{internas:[],externas:[]}:readImportedRosByOrigin();
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
      result.textContent='A URL do Apps Script é definida centralmente pelo GitHub Actions.';
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
    if(result){result.className='statusline';result.classList.remove('hidden');result.textContent='A URL do Apps Script é definida centralmente pelo GitHub Actions.';}
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



































































function getAdminModuleRecordsRaw(){
  try{
    const a=JSON.parse(localStorage.getItem(ADMIN_MODULES_KEY)||'[]');
    return Array.isArray(a)?a:[];
  }catch(e){return []}
}








function adminModuleRecord(id){
  return getAdminModuleRecords().find(x=>String(x.id)===String(id))||null;
}









const defaultDocumentTypes={fispq:'FISPQ / FDS',technical_sheet:'Ficha Técnica',analysis_certificate:'Certificado de Análise',factory_report:'Laudo para item em fabricação',product_document:'Documento para produto específico',permit:'Alvará',environmental_license:'Licença Ambiental',avcb:'AVCB',declaration:'Declaração / Certificado',other:'Outro documento'};
































































































































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









































function showAdminOperationalModule(...args){return nucleoOpenLazyAdmin('showAdminOperationalModule',args);}

function openAdminOperationalWorkspace(...args){return nucleoOpenLazyAdmin('openAdminOperationalWorkspace',args);}












































































































































































































































































































































































































function collectAdminModuleForm(key,existing){
  const val=id=>String(document.getElementById(id)?.value||'').trim();
  const blockItems=key==='nccapa'&&val('admModNcType')==='supplier'?collectRncBlockItems():[];
  const firstBlockItem=blockItems[0]||{};
  const now=new Date().toISOString();
  return {
    ...(existing||{}),
    id:existing?.id||('ADM-'+key.toUpperCase()+'-'+Date.now()),
    module:key,
    ...(key==='equipment'?{unit:val('admModEquipmentUnit'),unidade:val('admModEquipmentUnit')}:key==='processes'?{unit:val('admModProcessUnit'),unidade:val('admModProcessUnit')}:{ }),
    ncType:val('admModNcType')||(existing?.ncType||''),
    rncNumber:(existing?.rncNumber||''),
    ncOrigin:val('admModNcOrigin')||(existing?.ncOrigin||''),
    supplier:val('admModSupplier')||(existing?.supplier||''),
    supplierId:(getSupplierProfiles().find(p=>supplierNamesMatch(p,val('admModSupplier')||(existing?.supplier||'')))?.id||(existing?.supplierId||'')),
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
    ...(key==='equipment'?{
      equipmentType:val('admModEquipmentType'),
      manufacturer:existing?.manufacturer||'',
      model:existing?.model||'',
      serialNumber:val('admModSerialNumber'),
      lastCalibration:val('admModLastCalibration'),
      lastCalibrationCompany:val('admModLastCalibrationCompany')||(existing?.lastCalibrationCompany||''),
      calibrationIntervalMonths:Number(val('admModCalibrationInterval')||0),
      alertDays:Number(val('admModAlertDays')||30),
      calibrationRequired:val('admModCalibrationRequired')!=='no',
      calibrationScheduled:val('admModCalibrationScheduled')==='yes',
      scheduledCalibrationDate:val('admModCalibrationScheduled')==='yes'?val('admModScheduledCalibrationDate'):'',
      scheduledCalibrationCompany:val('admModCalibrationScheduled')==='yes'?val('admModScheduledCalibrationCompany'):'',
      scheduledCalibrationNotes:val('admModCalibrationScheduled')==='yes'?val('admModScheduledCalibrationNotes'):'',
      metrologyHistory:Array.isArray(existing?.metrologyHistory)?existing.metrologyHistory:[],
      equipmentReports:Array.isArray(existing?.equipmentReports)?existing.equipmentReports:[]
    }:{}),
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
  if(key==='equipment'&&!['matriz','filial'].includes(r.unit)){alert('Selecione a unidade do equipamento.');return;}
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
    if(!['matriz','filial'].includes(r.unit)){alert('Selecione a unidade do documento.');return}
    if(existing?.processAttachments?.length&&explicitRecordUnit(existing)!==r.unit){alert('Remova os anexos antes de mudar a unidade do documento.');return}
  }
  if(key==='processes'){void nucleoSaveProcessRecordConfirmed(r);return;}
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






































































































































const PROCESS_LAYOUT_KEY='nucleo_process_layouts_v1';

























var nucleoProcessShowRetired=false;


const PROCESS_TEMPLATE_KEY='nucleo_process_templates_v1';































































































































function getTplJson(id,fallback=[]){try{return JSON.parse(document.getElementById(id)?.value||'[]')}catch(e){return fallback}}
function setTplJson(id,v){const el=document.getElementById(id);if(el)el.value=JSON.stringify(v)}




















































































































































































































































































































































































































































































































































































const RNC_FIELD_SOURCES=[['rncReporter','Responsável'],['rncShift','Turno'],['eventDate','Data de abertura'],['rncIssueDate','Data de emissão'],['rncSupervisor','Supervisor'],['rncManager','Gerente'],['rncNumber','Nº RNC'],['supplier','Fornecedor'],['rncInvoice','Nota fiscal'],['rncProductCode','Código produto'],['rncProduct','Produto'],['rncDimensions','Dimensões'],['rncQuantity','Quantidade'],['rncDisposition','Disposição'],['rncBlockArea','Área bloqueio'],['rncBlockStage','Etapa da área responsável pelo bloqueio'],['relatedRo','R.O. relacionada'],['sector','Setor'],['title','Título'],['description','Descrição'],['rncSummary','Resumo do desvio'],['rncDetailedDescription','Descrição detalhada'],['rncEffect','Efeito do desvio'],['rncImmediateActions','Ações imediatas'],['rncFiveWhys','5 Porquês'],['rncSupplierConclusion','Conclusão da causa'],['rncCause','Causa'],['rncCorrectiveActions','Ações corretivas/preventivas'],['rncEffectiveness','Verificação de eficácia'],['photo:registro-fotografico','Fotos da RNC'],['@RNC','Texto fixo: RNC'],['@—','Texto fixo: —'],['@','Em branco'],['@A','Texto fixo: A'],['@SGQ','Texto fixo: SGQ']];
let rncGridSelectedFieldId='';
let rncGridSelectedHeaderId='';



























































































































const RNC_HEADER_STANDARD_KEY='nucleo_rnc_header_standard_v3',RNC_FOOTER_STANDARD_KEY='nucleo_rnc_footer_standard_v3';








































































































































































































































let rncTemplatePreviewTimer=0;
let rncPreviewZoom='fit';















































































































































































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
  if(nucleoPersonPermissions(getSession()).sgq)nucleoReadAvatarGalleryConfig();
  refreshSectorSelectors();
  if(!nucleoPersonCan('users')&&!nucleoPersonCan('sectors')){showList();return;}
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





const SIDEBAR_COLLAPSE_KEY='portal-sgq-sidebar-collapsed-v1';




























































































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
// R.O.s carregadas pela base central após login, sem migração síncrona na abertura.
let detailReturnView='ros';
let selected=ros[0],activeStage=0;let answers={};
































































function assignedRoStatus(r,preloadedMap=null){
  const raw=String(r?.status||'').trim().toLowerCase();
  const tri=getRoTriageRecord(r,preloadedMap)||{};
  const triDecision=String(tri?.decision||tri?.status||'').trim().toLowerCase();

  // O encerramento pode estar registrado apenas na triagem central.
  // Considerar a decisão da triagem evita que "Cancelar R.O." permaneça
  // em Em andamento e evita exibir ações de PDCA para uma R.O. encerrada.
  if(raw.includes('cancel')||['cancelled','canceled','cancelada','cancelado','cancel'].includes(triDecision)) return 'Cancelada';
  if(raw.includes('obsolet')||['obsolete','obsoleto','obsoleta'].includes(triDecision)) return 'Obsoleto';
  if(['record','registro'].includes(triDecision)||raw==='falta de caixa'||raw==='falta de caixas'||raw.includes('registro')) return 'Registro';
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

function assignedRoDeadline(r,preloadedMap=null){
  const status=assignedRoStatus(r,preloadedMap);
  if(status!=='Pendente') return '—';
  const tri=getRoTriageRecord(r,preloadedMap)||{};
  // Pendência sem PDCA externo sempre vence na próxima terça. Se a triagem já
  // possui um prazo central salvo, preserva-o; caso contrário calcula para exibição.
  return String(tri.pdcaDeadline||tri.deadline||nextTuesdayIsoDate()).trim()||nextTuesdayIsoDate();
}

function currentUserCanRespondAssignedRo(ro,tri){
  if(!tri || tri.decision!=='directed')return false;

  const session=getSession()||{};
  const assignedEmail=String(tri.responsibleUserEmail||'').trim().toLowerCase();
  const assignedName=normalizeAnswer(tri.responsibleUserName||'');
  const sessionEmail=String(session.email||'').trim().toLowerCase();
  const sessionName=normalizeAnswer(session.name||'');
  const sector=String(tri.responsibleSector||'').trim();
  const sectorKey=normalizeAnswer(sector);

  if(assignedEmail && sessionEmail && assignedEmail===sessionEmail)return true;
  if(!assignedEmail && assignedName && sessionName && assignedName===sessionName)return true;

  if(sectorKey && normalizeAnswer(session.sector||'')===sectorKey)return true;

  const unit=explicitRecordUnit(ro)||roUnit(ro);
  if(sectorKey && (session.sectorMemberships||[]).some(m=>
    normalizePortalUnit(m.unit||'')===normalizePortalUnit(unit||'') &&
    normalizeAnswer(m.sector||'')===sectorKey
  ))return true;

  if(sectorKey && isManager() && managesSector(sector))return true;

  return false;
}

let roListVisibleLimit=60;
let roListFilterSignature='';
let assignedLifecycle='active';
function setAssignedLifecycle(mode){
  assignedLifecycle=mode==='history'?'history':'active';
  const active=document.getElementById('assignedActiveTab');
  const history=document.getElementById('assignedHistoryTab');
  if(active)active.className='btn '+(assignedLifecycle==='active'?'primary':'secondary');
  if(history)history.className='btn '+(assignedLifecycle==='history'?'primary':'secondary');
  const f=document.getElementById('filter');
  if(f)f.value='todas';
  render();
}


















function assignedTerminalStatus(status){
  const s=normalizeAnswer(status||'');
  return ['cancelada','cancelado','registro','somente para registro','obsoleto','obsoleta'].includes(s);
}
function showMoreRos(){roListVisibleLimit+=60;render()}
function badgeClass(status){if(status==="Em contestação")return"badge warn";if(status==="Cancelada")return"badge danger";if(status==="Somente para registro")return"badge off";if(status==="PDCA enviado")return"badge ok";return"badge"}
function nucleoAssignedExportDataset(){
  const hiddenAssigned=getHiddenAssignedKeys();
  const triageMap=getSavedTriageMap();
  const byRo=new Map();

  triageMap.forEach(t=>{
    const number=String(t?.roNumber||String(t?.roKey||'').split('::')[0]||'').trim();
    if(!number)return;
    const arr=byRo.get(number)||[];
    arr.push(t);
    byRo.set(number,arr);
  });

  const grouped=new Map();
  ros.forEach(r=>{
    const k=nucleoPdcaReviewGroupKey2026(r)||[
      String(r.numero||r.id||r.codigo||''),
      String(r.origemBase||''),
      String(r.unidade||'')
    ].join('|');
    const arr=grouped.get(k)||[];
    arr.push(r);
    grouped.set(k,arr);
  });

  const bases=[...grouped.values()]
    .map(items=>nucleoPdcaPreferredRo2026(items,triageMap))
    .filter(Boolean);

  const source=bases.flatMap(r=>{
    const base=String(r.numero||r.id||r.codigo||'').trim();
    let records=(byRo.get(base)||[])
      .filter(t=>String(t.decision||'')!==''&&!hiddenAssigned.has(String(t.roKey||'')));

    const confirmed=resolvedTriageForRo(r,triageMap);
    if(confirmed?.decision&&confirmed.decision!=='directed')records=[confirmed];

    if(!records.length){
      const deletedKeys=getDeletedTriageKeys();
      if(deletedKeys.has(base)||deletedKeys.has(String(triageKeyOf(r)||'')))return [];

      const sheetSector=String(
        r.setorResponsavelPlanilha||
        r.raw?.__setorResponsavel||
        r.setor||
        ''
      ).trim();
      const norm=normalizeAnswer(sheetSector);
      if(sheetSector&&!['nao direcionado','nao informado','sem setor','-'].includes(norm)){
        records=[{
          roKey:triageCompositeKey(base,sheetSector),
          roNumber:base,
          decision:'directed',
          responsibleSector:sheetSector,
          importedFromSheet:true,
          __synthetic:true
        }];
      }
    }

    if(!records.length)return [];

    const sectorMap=new Map();
    records.forEach(t=>{
      const sector=String(t.responsibleSector||t.setorDirecionado||'').trim();
      const key=triageCompositeKey(base,sector||'__sem_setor__');
      const prev=sectorMap.get(key);
      const score=x=>{
        const composite=String(x?.roKey||'').includes('::')?10000000000000:0;
        const ts=Date.parse(x?.pdcaExternalUpdatedAt||x?.updatedAt||x?.triagedAt||x?.createdAt||'')||0;
        return composite+ts;
      };
      if(!prev||score(t)>=score(prev))sectorMap.set(key,t);
    });

    return [...sectorMap.values()].map(t=>({
      ...r,
      __triageKey:t.roKey,
      __triageRecord:t,
      __assignedSector:t.responsibleSector||''
    }));
  });

  return source
    .filter(nucleoManagerScopeAllows)
    .filter(r=>{
      const triNow=getRoTriageRecord(r,triageMap);
      const reviewCanonical=nucleoPdcaReviewCanonical2026(
        nucleoPdcaReviewRoKey2026(r),
        String(r?.origemBase||r?.raw?.__origemBase||'')
      );
      const reviewDecision=nucleoPdcaReviewMap2026()[reviewCanonical]?.decision||'';
      const pdcaExists=
        reviewDecision==='yes'||
        !!getPdcaReturnForRo(r)||
        pdcaExternalExists(r,triageMap);
      if(pdcaExists)return false;
      const tri=getRoTriageRecord(r,triageMap);
      const triStatus=String(tri?.status||tri?.triagemStatus||tri?.decision||'').toLowerCase();
      const sheetSector=String(
        r.setorResponsavelPlanilha||
        r.raw?.__setorResponsavel||
        r.setor||
        ''
      ).trim();
      const validSheetSector=!!sheetSector&&!['nao direcionado','nao informado','sem setor','-']
        .includes(normalizeAnswer(sheetSector));
      const assignedByTriage=!!tri&&!['','new','nova','aguardando','aguardando triagem'].includes(triStatus);
      if(!assignedByTriage&&!validSheetSector)return false;
      return isAdmin()?true:canViewRO(r);
    })
    .map(r=>isAdmin()?r:getOperationalRoView(r));
}

function nucleoAssignedExportDateValue(r){
  const candidates=[
    r?.data,
    r?.dataRegistro,
    r?.dataSolicitacao,
    r?.createdAt,
    r?.raw?.data,
    r?.raw?.Data,
    r?.raw?.timestamp
  ];
  for(const v of candidates){
    if(!v)continue;
    if(v instanceof Date&&!Number.isNaN(v.getTime()))return v;
    const txt=String(v).trim();
    let d=new Date(txt);
    if(!Number.isNaN(d.getTime()))return d;
    const m=txt.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if(m){
      d=new Date(Number(m[3]),Number(m[2])-1,Number(m[1]));
      if(!Number.isNaN(d.getTime()))return d;
    }
  }
  return null;
}

function nucleoAssignedExportMeta(r,triageMap){
  const tri=getRoTriageRecord(r,triageMap)||{};
  const status=assignedRoStatus(r,triageMap);
  const terminal=assignedTerminalStatus(status);
  const reviewCanonical=nucleoPdcaReviewCanonical2026(
    nucleoPdcaReviewRoKey2026(r),
    String(r?.origemBase||r?.raw?.__origemBase||'')
  );
  const reviewDecision=nucleoPdcaReviewMap2026()[reviewCanonical]?.decision||'';
  const pdcaAdvanced=
    reviewDecision==='yes'||
    tri?.pdcaRequired===true||
    !!getPdcaReturnForRo(r)||
    pdcaExternalExists(r,triageMap);

  const hasAnswer=assignedHasAnswerWithoutPdca(r,triageMap);
  const lifecycle=terminal
    ? (status==='Cancelada'?'cancelada':status==='Registro'?'registro':'obsoleto')
    : hasAnswer?'ja_respondeu':'precisa_resposta';
  const sector=String(
    tri?.responsibleSector||
    tri?.setorDirecionado||
    r.__assignedSector||
    r.setorResponsavelPlanilha||
    r.raw?.__setorResponsavel||
    r.setorResponsavel||
    r.setor||
    ''
  ).trim();

  const person=String(
    tri?.responsibleUserName||
    tri?.pessoaResponsavel||
    r?.pessoaResponsavel||
    r?.raw?.__pessoaResponsavel||
    ''
  ).trim();

  const origin=String(r?.origemBase||r?.raw?.__origemBase||'').trim();
  const unit=nucleoCanonicalUnitLabel(r?.unidade||'');
  const classification=String(
    tri?.classification||
    tri?.classificacaoSGQ||
    r?.classificacaoSGQ||
    ''
  ).trim();
  const decision=String(
    tri?.decision||
    tri?.triagemStatus||
    ''
  ).trim();
  const pdcaSituation=pdcaSituationLabel(r,triageMap)||'';
  const client=String(r?.cliente||r?.origem||'').trim();
  const occurrence=String(
    r?.problema||
    r?.descricao||
    r?.ocorrencia||
    r?.assunto||
    r?.tipo||
    ''
  ).trim();

  return {
    tri,status,terminal,pdcaAdvanced,lifecycle,sector,person,origin,unit,
    classification,decision,pdcaSituation,client,occurrence,
    date:nucleoAssignedExportDateValue(r)
  };
}


function nucleoCanonicalUnitLabel(value){
  const raw=String(value||'').trim();
  const n=normalizeAnswer(raw);
  if(!n)return 'Matriz — São Bento do Sul (SC)';

  // MATRIZ: todos os nomes históricos/legados usados para São Bento do Sul e Piên.
  if(
    n==='matriz'||
    n==='seta sc'||
    n==='seta pr'||
    n==='rl'||
    n==='unidade sao bento do sul'||
    n==='sao bento do sul'||
    n==='unidade pien'||
    n==='pien'||
    n.includes('sao bento do sul')||
    n.includes('pien')
  ) return 'Matriz — São Bento do Sul (SC)';

  // FILIAL: Linhares / ES.
  if(
    n==='filial'||
    n==='seta es'||
    n==='unidade linhares'||
    n==='linhares'||
    n.includes('linhares')
  ) return 'Filial — Linhares (ES)';

  // Valores históricos não reconhecidos não viram nova unidade no filtro.
  return 'Matriz — São Bento do Sul (SC)';
}

function nucleoAssignedExportUnique(rows, getter){
  return [...new Set(rows.map(getter).map(v=>String(v||'').trim()).filter(Boolean))]
    .sort((a,b)=>a.localeCompare(b,'pt-BR',{sensitivity:'base'}));
}

function nucleoAssignedExportOptions(values, selected){
  return '<option value="all">Todos</option>'+
    values.map(v=>'<option value="'+escapeHtml(v)+'"'+(String(v)===String(selected)?' selected':'')+'>'+escapeHtml(v)+'</option>').join('');
}

function nucleoOpenAssignedExcelExport(){
  const rows=nucleoAssignedExportDataset();
  const triageMap=getSavedTriageMap();
  const metas=rows.map(r=>({r,m:nucleoAssignedExportMeta(r,triageMap)}));

  let modal=document.getElementById('assignedExcelExportModal');
  if(modal)modal.remove();

  modal=document.createElement('div');
  modal.id='assignedExcelExportModal';
  modal.style.cssText='position:fixed;inset:0;z-index:99999;background:rgba(15,23,42,.42);display:flex;align-items:center;justify-content:center;padding:20px;overflow:auto';

  const currentLifecycle=typeof assignedLifecycle==='string'?assignedLifecycle:'active';
  const currentSector=document.getElementById('assignedSectorFilter')?.value||'all';
  const currentOrigin=document.getElementById('assignedOriginFilter')?.value||'all';
  const currentUnitRaw=document.getElementById('assignedUnitFilter')?.value||'all';
  const currentUnit=currentUnitRaw==='all'?'all':nucleoCanonicalUnitLabel(currentUnitRaw);
  const currentStatus=document.getElementById('filter')?.value||'todas';
  const currentSearch=document.getElementById('search')?.value||'';

  const sectors=nucleoAssignedExportUnique(metas,x=>x.m.sector);
  const origins=nucleoAssignedExportUnique(metas,x=>x.m.origin);
  const units=nucleoAssignedExportUnique(metas,x=>x.m.unit);
  const persons=nucleoAssignedExportUnique(metas,x=>x.m.person);
  const classifications=nucleoAssignedExportUnique(metas,x=>x.m.classification);
  const pdcaSituations=nucleoAssignedExportUnique(metas,x=>x.m.pdcaSituation);

  modal.innerHTML=`
    <div style="background:#fff;border-radius:16px;box-shadow:0 20px 60px rgba(15,23,42,.25);width:min(980px,96vw);max-height:92vh;overflow:auto;padding:22px">
      <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start">
        <div>
          <h2 style="margin:0">Exportar R.O.s para Excel</h2>
          <p class="small" style="margin:6px 0 0">Aplique os filtros abaixo. O arquivo leva somente os registros que correspondem aos filtros selecionados.</p>
        </div>
        <button class="btn secondary" type="button" onclick="document.getElementById('assignedExcelExportModal')?.remove()">Fechar</button>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:18px">
        <label><div class="label">Escopo</div>
          <select id="axScope">
            <option value="precisa_resposta">Precisa de resposta</option>
            <option value="ja_respondeu">Já tem resposta</option>
            <option value="cancelada">Canceladas</option>
            <option value="registro">Registro</option>
            <option value="obsoleto">Obsoletas</option>
            <option value="all">Todos desta etapa</option>
          </select>
        </label>
        <label><div class="label">Data inicial</div><input id="axDateFrom" type="date"></label>
        <label><div class="label">Data final</div><input id="axDateTo" type="date"></label>

        <label style="grid-column:span 3"><div class="label">Busca geral</div>
          <input id="axSearch" value="${escapeHtml(currentSearch)}" placeholder="R.O., cliente, ocorrência, setor, responsável...">
        </label>

        <label><div class="label">Origem</div>
          <select id="axOrigin">${nucleoAssignedExportOptions(origins,currentOrigin)}</select>
        </label>
        <label><div class="label">Unidade</div>
          <select id="axUnit">${nucleoAssignedExportOptions(units,currentUnit)}</select>
        </label>
        <label><div class="label">Setor responsável</div>
          <select id="axSector">${nucleoAssignedExportOptions(sectors,currentSector)}</select>
        </label>

        <label><div class="label">Pessoa responsável</div>
          <select id="axPerson">${nucleoAssignedExportOptions(persons,'all')}</select>
        </label>
        <label><div class="label">Status</div>
          <select id="axStatus">
            <option value="all">Todos</option>
            <option value="Pendente">Precisa de resposta</option>
            <option value="Cancelada">Cancelada</option>
            <option value="Registro">Registro</option>
            <option value="Obsoleto">Obsoleto</option>
          </select>
        </label>
        <label><div class="label">Situação PDCA</div>
          <select id="axPdca">${nucleoAssignedExportOptions(pdcaSituations,'all')}</select>
        </label>

        <label><div class="label">Classificação SGQ</div>
          <select id="axClassification">${nucleoAssignedExportOptions(classifications,'all')}</select>
        </label>
        <label><div class="label">Decisão SGQ</div>
          <select id="axDecision">
            <option value="all">Todas</option>
            <option value="directed">Direcionada</option>
            <option value="record">Registro</option>
            <option value="cancelled">Cancelada</option>
            <option value="obsolete">Obsoleto</option>
          </select>
        </label>
      </div>

      <div id="axCount" class="small" style="margin-top:14px"></div>
      <div class="actions" style="margin-top:16px">
        <button class="btn primary" type="button" onclick="nucleoExportAssignedExcel()">Gerar Excel</button>
        <button class="btn secondary" type="button" onclick="nucleoAssignedExportReset()">Limpar filtros</button>
      </div>
    </div>`;

  document.body.appendChild(modal);

  const scopeEl=document.getElementById('axScope');
  if(scopeEl)scopeEl.value=currentLifecycle==='history'?'cancelada':'precisa_resposta';

  modal.addEventListener('click',e=>{if(e.target===modal)modal.remove()});
  modal.querySelectorAll('input,select').forEach(el=>el.addEventListener('input',nucleoAssignedExportUpdateCount));
  nucleoAssignedExportUpdateCount();
}

function nucleoAssignedExportFilters(){
  const val=id=>document.getElementById(id)?.value||'';
  return {
    scope:val('axScope')||'all',
    from:val('axDateFrom'),
    to:val('axDateTo'),
    search:normalizeAnswer(val('axSearch')),
    origin:val('axOrigin')||'all',
    unit:val('axUnit')||'all',
    sector:val('axSector')||'all',
    person:val('axPerson')||'all',
    status:val('axStatus')||'all',
    pdca:val('axPdca')||'all',
    classification:val('axClassification')||'all',
    decision:val('axDecision')||'all'
  };
}

function nucleoAssignedExportFiltered(){
  const filters=nucleoAssignedExportFilters();
  const rows=nucleoAssignedExportDataset();
  const triageMap=getSavedTriageMap();

  let fromDate=filters.from?new Date(filters.from+'T00:00:00'):null;
  let toDate=filters.to?new Date(filters.to+'T23:59:59'):null;

  return rows.map(r=>({r,m:nucleoAssignedExportMeta(r,triageMap)})).filter(({r,m})=>{
    if(filters.scope!=='all'&&m.lifecycle!==filters.scope)return false;
    if(filters.origin!=='all'&&m.origin!==filters.origin)return false;
    if(filters.unit!=='all'&&nucleoCanonicalUnitLabel(m.unit)!==nucleoCanonicalUnitLabel(filters.unit))return false;
    if(filters.sector!=='all'&&m.sector!==filters.sector)return false;
    if(filters.person!=='all'&&m.person!==filters.person)return false;
    if(filters.status!=='all'&&m.status!==filters.status)return false;
    if(filters.pdca!=='all'&&m.pdcaSituation!==filters.pdca)return false;
    if(filters.classification!=='all'&&m.classification!==filters.classification)return false;
    if(filters.decision!=='all'&&String(m.decision||'')!==filters.decision)return false;
    if(fromDate&&(!m.date||m.date<fromDate))return false;
    if(toDate&&(!m.date||m.date>toDate))return false;

    if(filters.search){
      const hay=normalizeAnswer([
        r.numero,r.id,r.codigo,m.client,m.occurrence,m.unit,m.sector,m.person,
        m.origin,m.status,m.pdcaSituation,m.classification,m.decision
      ].join(' '));
      if(!hay.includes(filters.search))return false;
    }
    return true;
  });
}

function nucleoAssignedExportUpdateCount(){
  const count=document.getElementById('axCount');
  if(!count)return;
  const total=nucleoAssignedExportFiltered().length;
  count.textContent=total+' registro'+(total===1?'':'s')+' será'+(total===1?'':'ão')+' exportado'+(total===1?'':'s')+'.';
}

function nucleoAssignedExportReset(){
  ['axDateFrom','axDateTo','axSearch'].forEach(id=>{const el=document.getElementById(id);if(el)el.value=''});
  ['axOrigin','axUnit','axSector','axPerson','axStatus','axPdca','axClassification','axDecision']
    .forEach(id=>{const el=document.getElementById(id);if(el)el.value='all'});
  const scope=document.getElementById('axScope');if(scope)scope.value='precisa_resposta';
  nucleoAssignedExportUpdateCount();
}

function nucleoExcelXmlEscape(v){
  return String(v==null?'':v)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&apos;');
}

function nucleoExcelCell(v,style){
  return '<Cell'+(style?' ss:StyleID="'+style+'"':'')+'><Data ss:Type="String">'+nucleoExcelXmlEscape(v)+'</Data></Cell>';
}

function nucleoExportAssignedExcel(){
  const filtered=nucleoAssignedExportFiltered();
  if(!filtered.length){alert('Nenhum registro corresponde aos filtros selecionados.');return;}

  const headers=[
    'R.O.','Data','Cliente / origem','Ocorrência','Unidade','Setor responsável',
    'Pessoa responsável','Origem','Classificação SGQ','Decisão SGQ','Prazo',
    'Status','Situação PDCA','PDCA','Reclamante','Atualizado em'
  ];

  const rows=filtered.map(({r,m})=>{
    const claimant=typeof resolveRoClaimant==='function' ? resolveRoClaimant(r) : null;
    const claimantName=claimant&&typeof personDisplayName==='function'?personDisplayName(claimant):'';
    const deadline=assignedRoDeadline(r,getSavedTriageMap());
    const date=m.date?m.date.toLocaleDateString('pt-BR'):'';
    const updated=String(
      m.tri?.updatedAt||
      m.tri?.triagedAt||
      r?.updatedAt||
      r?.raw?.updatedAt||
      ''
    );
    return [
      String(r.numero||r.id||r.codigo||''),
      date,
      m.client,
      m.occurrence,
      m.unit,
      m.sector,
      m.person,
      m.origin,
      m.classification,
      m.decision,
      deadline==='—'?'':deadline,
      m.status,
      m.pdcaSituation,
      m.pdcaAdvanced?'Sim':'Não',
      claimantName,
      updated
    ];
  });

  const xmlRows=[
    '<Row>'+headers.map(h=>nucleoExcelCell(h,'Header')).join('')+'</Row>',
    ...rows.map(row=>'<Row>'+row.map(v=>nucleoExcelCell(v,'Cell')).join('')+'</Row>')
  ].join('');

  const xml='<?xml version="1.0"?>'+
    '<?mso-application progid="Excel.Sheet"?>'+
    '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" '+
      'xmlns:o="urn:schemas-microsoft-com:office:office" '+
      'xmlns:x="urn:schemas-microsoft-com:office:excel" '+
      'xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">'+
      '<Styles>'+
        '<Style ss:ID="Default" ss:Name="Normal"><Alignment ss:Vertical="Bottom"/><Font ss:FontName="Calibri" ss:Size="11"/></Style>'+
        '<Style ss:ID="Header"><Font ss:Bold="1"/><Interior ss:Color="#D9EAF7" ss:Pattern="Solid"/><Alignment ss:Vertical="Center"/></Style>'+
        '<Style ss:ID="Cell"><Alignment ss:Vertical="Top" ss:WrapText="1"/></Style>'+
      '</Styles>'+
      '<Worksheet ss:Name="ROs">'+
        '<Table>'+xmlRows+'</Table>'+
        '<AutoFilter x:Range="R1C1:R'+(rows.length+1)+'C'+headers.length+'" xmlns="urn:schemas-microsoft-com:office:excel"/>'+
      '</Worksheet>'+
    '</Workbook>';

  const blob=new Blob(['\ufeff',xml],{type:'application/vnd.ms-excel;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  const now=new Date();
  const stamp=[
    now.getFullYear(),
    String(now.getMonth()+1).padStart(2,'0'),
    String(now.getDate()).padStart(2,'0')
  ].join('-');
  a.href=url;
  a.download='ROs_Nucleo_'+stamp+'.xls';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1500);
}


function render(){
  const searchEl=document.getElementById('search');
  const filterEl=document.getElementById('filter');
  const rowsEl=document.getElementById('rows');
  if(!searchEl||!filterEl||!rowsEl)return;
  const q=searchEl.value.trim().toLowerCase(),f=filterEl.value;
  const admin=isAdmin();
  const assignedSector=document.getElementById('assignedSectorFilter')?.value||'all';
  const assignedOrigin=document.getElementById('assignedOriginFilter')?.value||'all';
  const assignedUnit=document.getElementById('assignedUnitFilter')?.value||'all';
  const filterSignature=JSON.stringify([q,f,roListMode,assignedSector,assignedOrigin,assignedUnit,assignedLifecycle]);
  if(filterSignature!==roListFilterSignature){roListVisibleLimit=60;roListFilterSignature=filterSignature}
  const hiddenAssigned=roListMode==='assigned'?getHiddenAssignedKeys():null;

  // A tela de R.O.s atribuídas precisa trabalhar com um único snapshot de triagem.
  // getSavedTriageMap() reconstrói registros a partir das R.O.s; chamá-lo dentro
  // dos loops fazia o custo crescer quadraticamente e podia congelar a página.
  const renderTriageMap=roListMode==='assigned'?getSavedTriageMap():null;

  const assignedTriageByRo=new Map();
  if(roListMode==='assigned'){
    renderTriageMap.forEach(t=>{
      const number=String(t?.roNumber||String(t?.roKey||'').split('::')[0]||'').trim();
      if(!number)return;
      const entries=assignedTriageByRo.get(number)||[];
      entries.push(t);
      assignedTriageByRo.set(number,entries);
    });
  }

  const assignedBaseRos = roListMode==='assigned' ? (()=>{
    const grouped=new Map();
    ros.forEach(r=>{
      const k=nucleoPdcaReviewGroupKey2026(r)||[String(r.numero||r.id||r.codigo||''),String(r.origemBase||''),String(r.unidade||'')].join('|');
      const arr=grouped.get(k)||[];arr.push(r);grouped.set(k,arr);
    });
    return [...grouped.values()].map(items=>nucleoPdcaPreferredRo2026(items,renderTriageMap)).filter(Boolean);
  })() : ros;

  const assignedSource = roListMode==='assigned' ? assignedBaseRos.flatMap(r=>{
    const base=String(r.numero||r.id||r.codigo||'').trim();
    let records=(assignedTriageByRo.get(base)||[]).filter(t=>String(t.decision||'')!=='' && !hiddenAssigned.has(String(t.roKey||'')));
    const confirmed=resolvedTriageForRo(r,renderTriageMap);
    if(confirmed?.decision&&confirmed.decision!=='directed')records=[confirmed];
    // Recuperação segura: se SGQ_TRIAGENS estiver vazio/desatualizado, mas a
    // própria R.O. importada ainda trouxer setor causa, ela continua atribuída.
    // Não exige status operacional aqui, pois versões anteriores chegaram a
    // limpar esse campo no cache e isso fazia a lista inteira desaparecer.
    if(!records.length){
      const deletedKeys=getDeletedTriageKeys();
      const deletedInTest=deletedKeys.has(base)||deletedKeys.has(String(triageKeyOf(r)||''));
      if(deletedInTest)return [];
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
      const tri=getRoTriageRecord(r,renderTriageMap);
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
        const displayStatusNow=assignedRoStatus(r,renderTriageMap);
        const encerrada=assignedTerminalStatus(displayStatusNow);

        // Em andamento: não mostra encerradas e nem R.O. que já avançou para PDCA.
        // Histórico: mostra somente Cancelada / Registro / Obsoleto.
        const reviewCanonical=nucleoPdcaReviewCanonical2026(
          nucleoPdcaReviewRoKey2026(r),
          String(r?.origemBase||r?.raw?.__origemBase||'')
        );
        const reviewDecision=nucleoPdcaReviewMap2026()[reviewCanonical]?.decision||'';
        const triNow=getRoTriageRecord(r,renderTriageMap);
        const pdcaMarcadoComoTem=reviewDecision==='yes';
        const pdcaJaRecebido=!!getPdcaReturnForRo(r)||pdcaExternalExists(r,renderTriageMap);

        // PDCA real/externo já recebido continua fora da fila operacional.
        // A definição manual "Tem PDCA" permanece visível para o SGQ poder
        // desfazer/desvincular a marcação diretamente em R.O.s atribuídas.
        if(pdcaJaRecebido)return false;

        if(assignedLifecycle==='history'){
          if(!encerrada)return false;
        }else{
          if(encerrada)return false;
        }

        const tri=getRoTriageRecord(r,renderTriageMap);
        const rowSector=String(tri?.responsibleSector||tri?.setorDirecionado||r.setor||'').trim();
        const rowOrigin=String(r.origemBase||r.raw?.__origemBase||'').trim();
        const rowUnit=String(r.unidade||'').trim();
        if(assignedSector!=='all'&&rowSector!==assignedSector)return false;
        if(assignedOrigin!=='all'&&rowOrigin!==assignedOrigin)return false;
        if(assignedUnit!=='all'&&!sameCanonicalUnit(rowUnit,assignedUnit))return false;
      }
      const text=nucleoRoSearchMatches(r,q);
      const displayStatus=assignedRoStatus(r,renderTriageMap);
      const statusKey={'Cancelada':'cancelada','Registro':'registro','Obsoleto':'obsoleto'}[displayStatus]||'';
      const hasAnswer=assignedHasAnswerWithoutPdca(r,renderTriageMap);
      const filt=
        f==='todas'||
        (f==='precisa_resposta'&&!assignedTerminalStatus(displayStatus)&&!hasAnswer)||
        (f==='ja_respondeu'&&!assignedTerminalStatus(displayStatus)&&hasAnswer)||
        f===statusKey;
      return text&&filt;
    });

  // Mantém busca e totais sobre a lista completa, mas cria apenas 60 linhas no DOM.
  rowsEl.innerHTML=list.slice(0,roListVisibleLimit).map(r=>{
    const status=String(r.status||'');
    const noPdca=['Cancelada','Somente para registro'].includes(status);
    const contest=status==='Em contestação';
    const externalPdca=pdcaExternalExists(r,renderTriageMap);

    // Só considerar "PDCA enviado" quando existir um PDCA REAL salvo para
    // esta R.O. + setor. Campos antigos da R.O. podem trazer "Enviado" por
    // outros motivos e não podem bloquear a resposta.
    const realSentPdca=getPdcaReturnForRo(r);
    const alreadySent=!!realSentPdca || externalPdca;

    const tri=getRoTriageRecord(r,renderTriageMap);
    const responsibleSector=String(tri?.responsibleSector||tri?.setorDirecionado||r.__assignedSector||r.setorResponsavelPlanilha||r.raw?.__setorResponsavel||r.setorResponsavel||r.setor||'—').trim()||'—';
    const pdcaSituation=pdcaSituationLabel(r,renderTriageMap);
    const displayStatus=assignedRoStatus(r,renderTriageMap);
    const terminalAssigned=assignedTerminalStatus(displayStatus);
    const displayDecisionLabel=nucleoAssignedDecisionLabel(r,tri,displayStatus,renderTriageMap);
    const reviewCanonical=nucleoPdcaReviewCanonical2026(nucleoPdcaReviewRoKey2026(r),String(r?.origemBase||r?.raw?.__origemBase||''));
    const reviewState=nucleoPdcaReviewMap2026()[reviewCanonical];
    const reviewDate=nucleoPdcaReviewDate2026(r);
    const review2026Eligible=admin&&reviewDate&&reviewDate>=new Date(2026,0,1)&&!terminalAssigned&&!nucleoPdcaReviewOwnTerminal2026(r);
    const reviewHasEvidence=nucleoPdcaReviewHasEvidence2026(r);
    const reviewDecision=reviewState?.decision||(reviewHasEvidence?'yes':'');
    const reviewRoKeyEsc=escapeHtml(nucleoPdcaReviewRoKey2026(r));
    const reviewOriginEsc=escapeHtml(String(r.origemBase||r.raw?.__origemBase||''));
    const pdcaReviewAction=review2026Eligible&&!reviewDecision
      ? `<div class="pdca-review-choice" style="display:flex;gap:6px;align-items:center;justify-content:center;white-space:nowrap"><button class="btn primary" style="padding:5px 9px;font-size:11px;min-width:76px" type="button" onclick="event.stopPropagation();nucleoMarkPdcaReview2026('${reviewRoKeyEsc}','${reviewOriginEsc}','yes')">Tem PDCA</button><button class="btn secondary" style="padding:5px 9px;font-size:11px;min-width:92px" type="button" onclick="event.stopPropagation();nucleoMarkPdcaReview2026('${reviewRoKeyEsc}','${reviewOriginEsc}','no')">Não tem PDCA</button></div>`
      : review2026Eligible&&reviewDecision
        ? `<span class="status-badge answered">${reviewDecision==='yes'?'Tem PDCA':'Sem PDCA'}</span>`
        : '';

    let operationalActions='';
    const canRespondHere=currentUserCanRespondAssignedRo(r,tri);

    if(canRespondHere){
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
            ${!admin?`<button class="btn secondary" type="button"
              ${contestDisabled?'disabled':''}
              onclick="contestRoFromList('${escapeHtml(r.numero)}')">
              ${contest?'Em contestação':'Contestar'}
            </button>`:''}
          </div>
        </td>`;
    }else{
      operationalActions='<td class="operational-action-col" style="display:none"></td>';
    }

    const statusControl =
      `<span class="${displayStatus==='PDCA respondido'||displayStatus==='PDCA apresentado'?'badge ok':displayStatus==='Pendente'?'badge warn':badgeClass(displayStatus)}">${escapeHtml(displayDecisionLabel)}</span>`;

    return `<tr>
      <td><button type="button" class="ro-link-btn" onclick="openRO('${escapeHtml(r.numero)}')"><b>${escapeHtml(r.numero)}</b></button>${isArchivedRo(r.numero)?'<div class="small">Arquivada</div>':''}</td>
      <td>${escapeHtml(r.unidade||'')}</td>
      <td>${escapeHtml(responsibleSector)}</td>
      <td><span class="status-badge">${escapeHtml(r.origemBase||'')}</span></td>
      <td>${escapeHtml(assignedRoDeadline(r,renderTriageMap))}</td>
      <td>${statusControl}</td>
      <td class="ro-eye-cell"><div class="ro-row-actions" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px">${pdcaReviewAction}<div style="display:flex;align-items:center;justify-content:center;gap:8px;white-space:nowrap"><button class="ro-eye-btn" type="button" onclick="openRoReport('${escapeHtml(r.numero)}')" title="Visualizar R.O." aria-label="Visualizar R.O. ${escapeHtml(r.numero)}">👁</button>${admin&&tri?.roKey?`<button class="ro-eye-btn ro-edit-btn" type="button" onclick="openAssignedSectorEdit('${escapeHtml(tri.roKey)}')" title="Editar setor causa" aria-label="Editar setor causa">✎</button><button class="ro-eye-btn ro-delete-btn" type="button" onclick="openRoRemovalManager('${escapeHtml(tri.roKey)}')" title="Gerenciar remoção" aria-label="Gerenciar remoção desta R.O.">🗑</button>`:''}</div></div></td>
      ${operationalActions}
    </tr>`;
  }).join('');
  const more=document.getElementById('roListMore');
  if(more)more.innerHTML=list.length>roListVisibleLimit
    ? `Mostrando ${roListVisibleLimit} de ${list.length} R.O.s · <button class="btn secondary" type="button" onclick="showMoreRos()">Mostrar mais 60</button>`
    : (list.length?`Mostrando ${list.length} R.O.s`:'');

  // A ação de responder só existe nas linhas em que a pessoa logada
  // pertence ao setor responsável ou é a pessoa explicitamente responsável.
  document.querySelectorAll('.operational-action-col').forEach(el=>{
    el.style.display='';
  });
}

let nucleoRoRemovalContext=null;

function nucleoRemovalClose(){
  document.getElementById('nucleoRoRemovalOverlay')?.remove();
  nucleoRoRemovalContext=null;
}

function nucleoRemovalSetExtraFields(){
  const type=document.getElementById('nucleoRoRemovalType')?.value||'';
  const dup=document.getElementById('nucleoRoRemovalDuplicateBox');
  if(dup)dup.hidden=type!=='duplicate';
  const note=document.getElementById('nucleoRoRemovalHelp');
  if(note){
    const messages={
      unlink_pdca:'Remove somente a marcação Tem PDCA / Não tem PDCA. A R.O. voltará a mostrar essa pergunta. Setor, R.O., arquivos e PDCAs reais não serão alterados.',
      assignment:'Remove somente este direcionamento. A R.O. principal e os outros setores são preservados.',
      person:'Mantém o setor atribuído e remove somente a pessoa responsável.',
      duplicate:'A R.O. será retirada do fluxo ativo como cancelada por duplicidade. O registro permanece no histórico.',
      mistake:'A R.O. será retirada do fluxo ativo como cancelada por lançamento indevido. O registro permanece no histórico.',
      cancel:'Mantém o registro e altera a decisão para Cancelada.',
      obsolete:'Mantém o registro e altera a decisão para Obsoleta.'
    };
    note.textContent=messages[type]||'';
  }
}

function openRoRemovalManager(triageKey){
  if(!nucleoFeatureRequire('ros','triage'))return;
  if(!isAdmin()){alert('Somente o SGQ pode gerenciar remoções de R.O.');return;}
  const key=String(triageKey||'').trim();
  if(!key)return;
  const tri=getSavedTriageMap().get(key);
  if(!tri){alert('Este direcionamento não foi encontrado. Sincronize e tente novamente.');return;}
  const ro=triageRoNumberPart(key);
  const sector=String(tri.responsibleSector||tri.setorDirecionado||'').trim();
  nucleoRoRemovalContext={triageKey:key,ro,sector};
  document.getElementById('nucleoRoRemovalOverlay')?.remove();
  const overlay=document.createElement('div');
  overlay.id='nucleoRoRemovalOverlay';
  overlay.className='modal-overlay';
  overlay.style.cssText='position:fixed;inset:0;z-index:10050;background:rgba(15,23,42,.52);display:flex;align-items:center;justify-content:center;padding:20px';
  overlay.innerHTML=`<div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="nucleoRoRemovalTitle" style="width:min(620px,96vw);max-height:90vh;overflow:auto;background:#fff;border-radius:18px;padding:22px;box-shadow:0 24px 70px rgba(0,0,0,.24)">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:14px">
      <div><h3 id="nucleoRoRemovalTitle" style="margin:0 0 6px">Gerenciar remoção da R.O.</h3><p class="small" style="margin:0">${escapeHtml(ro)}${sector?' · '+escapeHtml(sector):''}</p></div>
      <button type="button" class="btn secondary" onclick="nucleoRemovalClose()" aria-label="Fechar">Fechar</button>
    </div>
    <label style="display:block;margin-top:18px"><span>O que deseja fazer?</span>
      <select id="nucleoRoRemovalType" onchange="nucleoRemovalSetExtraFields()">
        <option value="unlink_pdca">Desvincular PDCA</option>
        <option value="assignment">Remover esta atribuição da R.O.</option>
        <option value="person">Remover somente a pessoa responsável</option>
        <option value="duplicate">Excluir R.O. duplicada do fluxo ativo</option>
        <option value="mistake">Excluir R.O. lançada por engano do fluxo ativo</option>
        <option value="cancel">Cancelar R.O.</option>
        <option value="obsolete">Marcar R.O. como obsoleta</option>
      </select>
    </label>
    <div id="nucleoRoRemovalDuplicateBox" hidden style="margin-top:12px">
      <label><span>R.O. original que deve permanecer</span><input id="nucleoRoRemovalDuplicateOf" placeholder="Ex.: 325" autocomplete="off"></label>
    </div>
    <label style="display:block;margin-top:12px"><span>Motivo *</span><textarea id="nucleoRoRemovalReason" rows="4" maxlength="600" placeholder="Registre o motivo para o histórico"></textarea></label>
    <p id="nucleoRoRemovalHelp" class="small" style="margin:10px 0 0"></p>
    <p id="nucleoRoRemovalStatus" class="small" role="status"></p>
    <div class="actions" style="display:flex;justify-content:flex-end;gap:8px;margin-top:18px">
      <button type="button" class="btn secondary" onclick="nucleoRemovalClose()">Cancelar</button>
      <button type="button" class="btn primary" id="nucleoRoRemovalConfirm" onclick="nucleoConfirmRoRemoval(this)">Confirmar</button>
    </div>
  </div>`;
  overlay.addEventListener('click',e=>{if(e.target===overlay)nucleoRemovalClose();});
  document.body.appendChild(overlay);
  nucleoRemovalSetExtraFields();
  setTimeout(()=>document.getElementById('nucleoRoRemovalType')?.focus(),0);
}


async function nucleoRemovalSaveVerified(collection,id,data,verifyFn,timeoutMs=90000){
  if(!nucleoRequireCentralData('salvar esta alteração'))throw new Error('A base central ainda não confirmou os dados.');
  if(!portalBackendEnabled())throw new Error('Apps Script não configurado.');

  const eventoId='ROREMOVE-'+Date.now()+'-'+Math.random().toString(36).slice(2,9);
  const submitted=portalPostForm({
    acao:'portal_save',
    colecao:String(collection||''),
    id:String(id||''),
    dados:JSON.stringify(data||{}),
    ator:getSession()?.name||'SGQ',
    eventoId
  });

  if(!submitted)throw new Error('Não foi possível enviar a alteração para a base central.');

  const started=Date.now();

  while(Date.now()-started<timeoutMs){
    await new Promise(resolve=>setTimeout(resolve,800));

    const statusRes=await portalJsonp({
      acao:'portal_save_status',
      eventoId
    },12000).catch(()=>null);

    if(statusRes?.status==='done'){
      return {sucesso:true,status:'done',eventoId};
    }

    if(statusRes?.status==='error'){
      throw new Error(statusRes.erro||'A base central recusou o salvamento.');
    }
  }

  throw new Error('A base central não confirmou o salvamento dentro do tempo esperado.');
}

async function nucleoPersistTriageRemovalRecord(key,changes,reason,type){
  const map=getSavedTriageMap();
  const current=map.get(key);
  if(!current)throw new Error('O direcionamento não foi encontrado na base carregada.');
  const now=new Date().toISOString();
  const actor=getSession()?.name||'SGQ';
  const record={...current,...changes,updatedAt:now,updatedBy:actor,administrativeChange:{type,reason,at:now,by:actor}};
  await nucleoRemovalSaveVerified('triage',key,record,(saved)=>{
    const adm=saved?.administrativeChange||{};
    return String(adm.type||'')===String(type||'') &&
      String(adm.reason||'').trim()===String(reason||'').trim();
  },90000);
  map.set(key,record);
  localStorage.setItem(TRIAGE_KEY,JSON.stringify([...map.values()]));
  return record;
}

async function nucleoUnlinkPdcaFromAssignment(key,reason){
  const map=getSavedTriageMap(),tri=map.get(key);
  if(!tri)throw new Error('Direcionamento não encontrado.');

  const ro=triageRoNumberPart(key);
  const sourceRo=(getAllRoRecords()||[]).find(r=>{
    const n=String(r?.numero||r?.id||r?.codigo||'').trim();
    return n===ro || (
      roDigits(n)===roDigits(ro) &&
      normalizeAnswer(roOriginFromNumber(n,r?.origemBase||r?.raw?.__origemBase||''))===
      normalizeAnswer(roOriginFromNumber(ro,tri?.origin||tri?.origem||tri?.origemBase||''))
    );
  });

  const origin=String(
    sourceRo?.origemBase||
    sourceRo?.raw?.__origemBase||
    tri?.origin||
    tri?.origem||
    tri?.origemBase||
    roOriginFromNumber(ro,'')
  ).trim();

  const target=nucleoPdcaReviewCanonical2026(ro,origin);
  if(!target)throw new Error('Não foi possível identificar a definição de PDCA desta R.O.');

  const review=nucleoPdcaReviewMap2026();
  delete review[target];
  nucleoSavePdcaReviewMap2026(review);

  const records=getTriageRecordsForRoNumber(ro,map);
  const now=new Date().toISOString();
  const actor=getSession()?.name||'SGQ';

  for(const old of records){
    const recordKey=String(old?.roKey||ro);
    const updated={...old};
    delete updated.pdcaReviewDecision;
    delete updated.pdcaReviewAt;
    delete updated.pdcaReviewBy;

    updated.pdcaReviewUnlinkedAt=now;
    updated.pdcaReviewUnlinkedBy=actor;
    updated.pdcaReviewUnlinkReason=reason;
    updated.updatedAt=now;
    updated.updatedBy=actor;

    await nucleoRemovalSaveVerified('triage',recordKey,updated,null,90000);
    map.set(recordKey,updated);
  }

  localStorage.setItem(TRIAGE_KEY,JSON.stringify([...map.values()]));

  try{
    if(typeof nucleoPersistSharedState==='function'){
      await Promise.resolve(
        nucleoPersistSharedState(
          NUCLEO_PDCA_REVIEW_2026_KEY,
          JSON.stringify(review)
        )
      );
    }
  }catch(e){
    console.warn('[NUCLEO PDCA REVIEW] persistência compartilhada seguirá pelo sincronizador.',e);
  }

  try{render()}catch(e){}
  try{renderPdcaReview2026()}catch(e){}
  try{renderPdcaPdfSummary()}catch(e){}
  try{refreshRoSummary()}catch(e){}

  try{
    Promise.resolve(syncPortalBackend(false,{foreground:false}))
      .catch(e=>console.warn('[NUCLEO PDCA REVIEW] sincronização posterior falhou',e));
  }catch(e){}

  return {removed:true,ro,origin};
}
async function nucleoRemoveSingleAssignment(key,reason){
  const tri=getSavedTriageMap().get(key);
  if(!tri)throw new Error('Direcionamento não encontrado.');
  // Salva o motivo antes da exclusão para que a auditoria central registre a causa.
  const annotated={...tri,administrativeRemoval:{type:'assignment',reason,at:new Date().toISOString(),by:getSession()?.name||'SGQ'},updatedAt:new Date().toISOString()};
  await nucleoRemovalSaveVerified('triage',key,annotated,(saved)=>{
    const adm=saved?.administrativeRemoval||{};
    return String(adm.type||'')==='assignment' &&
      String(adm.reason||'').trim()===String(reason||'').trim();
  },90000);
  await adminCleanupDeleteRecord('triage',key);
  const deleted=getDeletedTriageKeys();
  deleted.add(key);
  saveDeletedTriageKeys(deleted);
  await adminCleanupSaveSharedState(DELETED_TRIAGE_KEYS_KEY,JSON.stringify([...deleted]));
  const map=getSavedTriageMap();map.delete(key);localStorage.setItem(TRIAGE_KEY,JSON.stringify([...map.values()]));
  try{await syncPortalBackend(false,{foreground:true})}catch(e){}
  const finalDeleted=getDeletedTriageKeys();finalDeleted.add(key);saveDeletedTriageKeys(finalDeleted);
}

async function nucleoRemoveAssignedPerson(key,reason){
  await nucleoPersistTriageRemovalRecord(key,{responsibleUserEmail:'',responsibleUserName:'',personRemovedAt:new Date().toISOString(),personRemovalReason:reason},reason,'person');
}

async function nucleoSetAdministrativeRoDecision(key,decision,reason,extra={}){
  const map=getSavedTriageMap();
  const base=triageRoNumberPart(key);
  let records=getTriageRecordsForRoNumber(base,map).filter(x=>x?.decision);
  if(!records.length&&map.get(key))records=[map.get(key)];
  if(!records.length)throw new Error('Nenhuma triagem foi encontrada para esta R.O.');
  const now=new Date().toISOString(),actor=getSession()?.name||'SGQ';
  for(const old of records){
    const recordKey=String(old.roKey||base);
    const record={...old,
      decision,decisionId:decision,decisionLabel:decision==='obsolete'?'Obsoleta':'Cancelar R.O.',
      pdcaRequired:false,pdcaDeadline:'',responsibleUserEmail:'',responsibleUserName:'',
      note:reason,updatedAt:now,updatedBy:actor,
      administrativeRemoval:{type:extra.type||decision,reason,duplicateOf:extra.duplicateOf||'',at:now,by:actor}
    };
    await nucleoRemovalSaveVerified('triage',recordKey,record,(saved)=>{
      const adm=saved?.administrativeRemoval||{};
      return String(saved?.decision||'')===String(decision||'') &&
        String(adm.type||'')===String(extra.type||decision||'') &&
        String(adm.reason||'').trim()===String(reason||'').trim();
    },90000);
    map.set(recordKey,record);
  }
  localStorage.setItem(TRIAGE_KEY,JSON.stringify([...map.values()]));
  try{
    await portalUpdateRoSheetConfirmed(base,{status:decision==='obsolete'?'Obsoleto':'Cancelada',pessoa:'',resultado:reason});
  }catch(e){console.warn('[NUCLEO REMOÇÃO] decisão salva, mas planilha não confirmou status',e);}
  try{await syncPortalBackend(false,{foreground:true})}catch(e){}
}

async function nucleoConfirmRoRemoval(button){
  const ctx=nucleoRoRemovalContext;
  if(!ctx)return;
  const type=document.getElementById('nucleoRoRemovalType')?.value||'';
  const reason=String(document.getElementById('nucleoRoRemovalReason')?.value||'').trim();
  const duplicateOf=String(document.getElementById('nucleoRoRemovalDuplicateOf')?.value||'').trim();
  const status=document.getElementById('nucleoRoRemovalStatus');
  if(!reason){status.textContent='Informe o motivo da alteração.';document.getElementById('nucleoRoRemovalReason')?.focus();return;}
  if(type==='duplicate'&&!duplicateOf){status.textContent='Informe qual R.O. original deve permanecer.';document.getElementById('nucleoRoRemovalDuplicateOf')?.focus();return;}
  button.disabled=true;status.textContent='Aplicando alteração e conferindo a base central…';
  try{
    if(type==='unlink_pdca'){
      status.textContent='Removendo a definição Tem PDCA / Não tem PDCA…';
      await nucleoUnlinkPdcaFromAssignment(ctx.triageKey,reason);
      status.textContent='Definição removida. A pergunta será exibida novamente.';
    }
    else if(type==='assignment')await nucleoRemoveSingleAssignment(ctx.triageKey,reason);
    else if(type==='person')await nucleoRemoveAssignedPerson(ctx.triageKey,reason);
    else if(type==='duplicate')await nucleoSetAdministrativeRoDecision(ctx.triageKey,'cancelled',reason,{type:'duplicate',duplicateOf});
    else if(type==='mistake')await nucleoSetAdministrativeRoDecision(ctx.triageKey,'cancelled',reason,{type:'mistake'});
    else if(type==='cancel')await nucleoSetAdministrativeRoDecision(ctx.triageKey,'cancelled',reason,{type:'cancel'});
    else if(type==='obsolete')await nucleoSetAdministrativeRoDecision(ctx.triageKey,'obsolete',reason,{type:'obsolete'});
    else throw new Error('Escolha uma ação válida.');
    try{render()}catch(e){}
    try{renderAssignedRos()}catch(e){}
    try{renderTriage()}catch(e){}
    try{refreshRoSummary()}catch(e){}
    try{refreshMenuNotificationBadges()}catch(e){}
    status.textContent='Alteração confirmada.';
    setTimeout(nucleoRemovalClose,350);
  }catch(e){
    console.error('[NUCLEO GERENCIAR REMOÇÃO]',e);
    status.textContent='Não foi possível concluir: '+String(e?.message||e);
    button.disabled=false;
  }
}

// Compatibilidade com botões antigos/caches anteriores: o antigo delete agora abre
// o gerenciador e nunca executa exclusão direta.
async function deleteAssignedDirection(triageKey){
  openRoRemovalManager(triageKey);
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
  if(!base){
    alert('R.O. não encontrada ou indisponível.');
    return null;
  }
  const tri=getRoTriageRecord(base);
  if(!currentUserCanRespondAssignedRo(base,tri)){
    alert('Esta R.O. não está direcionada para você nem para um setor em que você atua.');
    return null;
  }
  const ro=getOperationalRoView({...base,__triageRecord:tri,__assignedSector:tri?.responsibleSector||''});
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
  ['pdcaImportView','listView','roListView','audit5sView','adminModuleView','mySubmittedRosView','detailView','pdcaView','sentView','pdcaReportView','pendingHubView','actionsDashboardView','triageView','externalRoControlView','mySacsView','sacTrackingView','contestationsView','sgqIndicatorsView','managementView','pendingActionsView','profileView','announcementsView','settingsView'].forEach(function(x){
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
    {id:'triage',label:'Triagem de R.O.s',detail:'Classificar e direcionar ocorrências',action:'showTriage()',allowed:()=>nucleoPersonFeatureCan('sac','edit')},
    {id:'saccontrol',label:'Controle de SAC',detail:'Classificação e encaminhamento',action:'showExternalRoControl()',allowed:()=>nucleoPersonCan('equipment')},
    {id:'pendingactions',label:'Ações pendentes',detail:'Conferência e acompanhamento do SGQ',action:'showPendingActions()',allowed:()=>nucleoPersonCan('training')},
    {id:'contests',label:'Contestações',detail:'Analisar solicitações',action:'showContestations()',allowed:()=>nucleoPersonCan('nc')},
    {id:'equipment',label:'Equipamentos e metrologia',detail:'Ativos, calibrações e histórico',action:"showAdminOperationalModule('equipment')",allowed:()=>nucleoPersonCan('processes')},
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
      overviewKpi(d.summary.pending,'R.O.s aguardando sua resposta',d.summary.overdue?'danger':'','showAssignedRos()','Ver R.O.s'),
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
  if(d.summary.overdue)priorities.push(overviewPriority(`${d.summary.overdue} R.O.(s) com resposta em atraso`,'Há respostas com prazo vencido que dependem do seu setor.','showAssignedRos()','danger'));
  if(d.overdueActions)priorities.push(overviewPriority(`${d.overdueActions} ação(ões) atrasada(s)`,'Ações atribuídas ao seu setor ultrapassaram o prazo.','showActionsDashboard()','danger'));
  if(d.summary.pending)priorities.push(overviewPriority(`${d.summary.pending} R.O.(s) aguardando resposta`,'R.O.s direcionadas ao seu setor ainda precisam de resposta.','showAssignedRos()','warn'));
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
  if(d.summary.overdue)priorities.push(overviewPriority(`${d.summary.overdue} R.O.(s) com resposta em atraso`,'Há PDCAs direcionados com prazo vencido.','showPendingHub()','danger'));
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



const NUCLEO_5S_SECTORS = {"matriz": ["Expedição", "Infraestrutura", "Mecânica (manutenção)", "Clicheria + sala de tintas", "Plotter", "2° turno", "Serralheria", "Acabamento", "Recebimento + almoxarifado", "Acessórios", "Máquinas 1", "Máquinas 2", "Serviços gerais", "Administrativo (rh)", "Administrativo aquário 1", "Administrativo aquário 2", "Administrativo aquário 3"], "filial": ["ADMINISTRATIVO 1", "ADMINISTRATIVO 2", "CLICHERIA", "EXPEDIÇÃO", "MÁQUINAS", "MANUTENÇÃO", "ACABAMENTO", "ACESSÓRIOS", "RECEBIMENTO - ALMOXARIFADO", "ÁREA EXTERNA"]};
let nucleo5sCurrentUnit='matriz';

function nucleo5sNormalizeUnit(value){
  const n=normalizeAnswer(String(value||''));
  if(n.includes('linhares')||n.includes('seta es')||n==='filial')return 'filial';
  return 'matriz';
}

function nucleo5sSessionUnit(){
  const s=getSession()||{};
  return nucleo5sNormalizeUnit(s.unit||s.unidade||'matriz');
}

function nucleo5sConfig(unit){
  const cfg=window.NUCLEO_RUNTIME_CONFIG||{};
  const isFilial=unit==='filial';
  return {
    unit,
    url:isFilial
      ? String(cfg.audit5sEsUrl||'').trim()
      : String(cfg.audit5sScUrl||'').trim(),
    page:isFilial?'assets/5s/es/index.html':'assets/5s/sc/index.html'
  };
}

function nucleo5sUnitLabel(unit){
  return unit==='filial'?'Filial — Linhares (ES)':'Matriz — São Bento do Sul (SC)';
}

function nucleo5sSetUnitButtons(unit){
  const matrizBtn=document.getElementById('audit5sMatrizBtn');
  const filialBtn=document.getElementById('audit5sFilialBtn');
  if(matrizBtn)matrizBtn.className='btn '+(unit==='matriz'?'primary':'secondary');
  if(filialBtn)filialBtn.className='btn '+(unit==='filial'?'primary':'secondary');
}

function nucleoOpen5SUnit(unit){
  unit=unit==='filial'?'filial':'matriz';
  nucleo5sCurrentUnit=unit;
  nucleo5sSetUnitButtons(unit);
  nucleo5sShowPanel('home');
}

function nucleo5sConfigReady(){
  const cfg=nucleo5sConfig(nucleo5sCurrentUnit);
  const notice=document.getElementById('audit5sConfigNotice');
  if(cfg.url){
    if(notice)notice.classList.add('hidden');
    return true;
  }
  if(notice){
    notice.classList.remove('hidden');
    notice.innerHTML='<b>Integração 5S da '+escapeHtml(nucleo5sUnitLabel(nucleo5sCurrentUnit))+' ainda não configurada.</b>'+
      '<div class="small" style="margin-top:5px">Configure a URL central do Apps Script da unidade no GitHub e publique novamente.</div>';
  }
  return false;
}

function nucleo5sSectorOptions(selected=''){
  return (NUCLEO_5S_SECTORS[nucleo5sCurrentUnit]||[])
    .map(s=>`<option value="${escapeHtml(s)}"${s===selected?' selected':''}>${escapeHtml(s)}</option>`).join('');
}

function nucleo5sShowPanel(panel){
  const host=document.getElementById('audit5sPanel');
  if(!host)return;
  if(panel==='home'){
    host.innerHTML='<div class="small" style="padding:8px 2px">Selecione uma opção acima. Unidade atual: <b>'+escapeHtml(nucleo5sUnitLabel(nucleo5sCurrentUnit))+'</b>.</div>';
    return;
  }
  if(panel==='audit')return nucleo5sRenderAudit(host);
  if(panel==='tutorial')return nucleo5sRenderTutorial(host);
  if(panel==='schedule')return nucleo5sRenderSchedule(host);
  if(panel==='actions')return nucleo5sRenderActions(host);
  if(panel==='history')return nucleo5sRenderHistory(host);
  if(panel==='cycle')return nucleo5sRenderCycle(host);
}

function nucleo5sRenderAudit(host){
  if(!nucleo5sConfigReady())return;
  const cfg=nucleo5sConfig(nucleo5sCurrentUnit);
  const src=new URL(cfg.page,document.baseURI);
  src.searchParams.set('embedded','1');
  src.searchParams.set('config',cfg.url);
  src.searchParams.set('nucleoUnit',nucleo5sCurrentUnit);
  const session=getSession()||{};
  if(session.name)src.searchParams.set('auditor',String(session.name));
  host.innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px">
      <div><h3 style="margin:0">Realizar auditoria 5S</h3><div class="small">${escapeHtml(nucleo5sUnitLabel(nucleo5sCurrentUnit))}</div></div>
      <button class="btn secondary" type="button" onclick="nucleo5sShowPanel('home')">Voltar</button>
    </div>
    <iframe id="audit5sFrame" title="Auditoria 5S" src="${escapeHtml(src.toString())}" style="width:100%;height:calc(100vh - 205px);min-height:760px;border:1px solid var(--line);border-radius:12px;background:#fff"></iframe>`;
}

function nucleo5sRenderTutorial(host){
  host.innerHTML=`
    <div class="card" style="padding:18px">
      <div style="display:flex;justify-content:space-between;gap:10px"><div><h3 style="margin:0">Como realizar a auditoria 5S</h3><div class="small">${escapeHtml(nucleo5sUnitLabel(nucleo5sCurrentUnit))}</div></div><button class="btn secondary" type="button" onclick="nucleo5sShowPanel('home')">Voltar</button></div>
      <div style="margin-top:16px;display:grid;gap:12px">
        <div><b>1. Confirme setor, responsáveis e data.</b><div class="small">O cronograma pode preencher os auditores previstos; eles podem ser ajustados quando necessário.</div></div>
        <div><b>2. Avalie todos os itens dos cinco sensos.</b><div class="small">Registre a nota, observação e evidência quando aplicável.</div></div>
        <div><b>3. Confira pendências do setor.</b><div class="small">Ações abertas aparecem durante a auditoria para atualização do status.</div></div>
        <div><b>4. Cadastre novas ações.</b><div class="small">Toda não conformidade que exigir acompanhamento deve ter descrição, responsável e prazo no fluxo 5S.</div></div>
        <div><b>5. Salve e sincronize.</b><div class="small">A auditoria fica vinculada à unidade, setor, auditores, pontuações, evidências e ações.</div></div>
        <div><b>6. Consulte o resultado do ciclo.</b><div class="small">Depois da migração histórica para o Supabase, o resultado consolidado e a impressão ficam disponíveis neste Centro 5S.</div></div>
      </div>
    </div>`;
}

async function nucleo5sFetchJson(url){
  const r=await fetch(url,{method:'GET',cache:'no-store'});
  if(!r.ok)throw new Error('Erro HTTP '+r.status);
  const data=await r.json();
  if(data&&data.error)throw new Error(data.error);
  return data;
}


function nucleo5sBackend(action, params={}){
  return portalJsonp({
    acao: action,
    unit: nucleo5sCurrentUnit,
    ...(params||{})
  },90000);
}

function nucleo5sRenderSchedule(host){
  const now=new Date();
  const month=String(now.getMonth()+1).padStart(2,'0');
  host.innerHTML=`
    <div class="card" style="padding:18px">
      <div style="display:flex;justify-content:space-between;gap:10px">
        <div><h3 style="margin:0">Cronograma do mês</h3><div class="small">${escapeHtml(nucleo5sUnitLabel(nucleo5sCurrentUnit))}</div></div>
        <button class="btn secondary" type="button" onclick="nucleo5sShowPanel('home')">Voltar</button>
      </div>
      <div class="toolbar" style="margin-top:14px">
        <select id="nucleo5sScheduleSector"><option value="">Todos os setores</option>${nucleo5sSectorOptions()}</select>
        <input id="nucleo5sScheduleMonth" type="month" value="${now.getFullYear()}-${month}">
        <button class="btn primary" type="button" onclick="nucleo5sLoadSchedule()">Consultar</button>
      </div>
      <div id="nucleo5sScheduleResult" style="margin-top:14px"><div class="small">Consulte o cronograma já migrado para o Supabase.</div></div>
    </div>`;
}

async function nucleo5sLoadSchedule(){
  const box=document.getElementById('nucleo5sScheduleResult');
  const sector=document.getElementById('nucleo5sScheduleSector')?.value||'';
  const month=document.getElementById('nucleo5sScheduleMonth')?.value||'';
  if(box)box.innerHTML='<div class="small">Consultando Supabase...</div>';
  try{
    const data=await nucleo5sBackend('nucleo_5s_schedule',{sector,month});
    if(!data?.sucesso)throw new Error(data?.erro||'Falha ao consultar cronograma.');
    const rows=Array.isArray(data.rows)?data.rows:[];
    if(!rows.length){
      box.innerHTML='<div class="notice">Nenhum cronograma encontrado para os filtros selecionados.</div>';
      return;
    }
    box.innerHTML='<div style="overflow:auto"><table><thead><tr><th>Setor</th><th>Mês</th><th>Auditor 1</th><th>Auditor 2</th></tr></thead><tbody>'+
      rows.map(r=>`<tr><td>${escapeHtml(r.sector||'-')}</td><td>${escapeHtml(r.monthLabel||month||'-')}</td><td>${escapeHtml(r.auditor1||'-')}</td><td>${escapeHtml(r.auditor2||'-')}</td></tr>`).join('')+
      '</tbody></table></div>';
  }catch(e){
    if(box)box.innerHTML='<div class="notice danger">Não foi possível consultar o cronograma: '+escapeHtml(e.message||String(e))+'</div>';
  }
}

function nucleo5sRenderActions(host){
  host.innerHTML=`
    <div class="card" style="padding:18px">
      <div style="display:flex;justify-content:space-between;gap:10px">
        <div><h3 style="margin:0">Ações do 5S</h3><div class="small">${escapeHtml(nucleo5sUnitLabel(nucleo5sCurrentUnit))}</div></div>
        <button class="btn secondary" type="button" onclick="nucleo5sShowPanel('home')">Voltar</button>
      </div>
      <div class="toolbar" style="margin-top:14px">
        <select id="nucleo5sActionsSector"><option value="">Todos os setores</option>${nucleo5sSectorOptions()}</select>
        <select id="nucleo5sActionsStatus">
          <option value="open">Pendentes / em andamento</option>
          <option value="all">Todas</option>
          <option value="done">Concluídas</option>
        </select>
        <button class="btn primary" type="button" onclick="nucleo5sLoadActions()">Consultar</button>
      </div>
      <div id="nucleo5sActionsResult" style="margin-top:14px"><div class="small">As ações agora são consultadas no Supabase.</div></div>
    </div>`;
}

async function nucleo5sLoadActions(){
  const box=document.getElementById('nucleo5sActionsResult');
  const sector=document.getElementById('nucleo5sActionsSector')?.value||'';
  const status=document.getElementById('nucleo5sActionsStatus')?.value||'open';
  if(box)box.innerHTML='<div class="small">Consultando Supabase...</div>';
  try{
    const data=await nucleo5sBackend('nucleo_5s_actions',{sector,status});
    if(!data?.sucesso)throw new Error(data?.erro||'Falha ao consultar ações.');
    const list=Array.isArray(data.rows)?data.rows:[];
    if(!list.length){
      box.innerHTML='<div class="notice success">Nenhuma ação encontrada para os filtros selecionados.</div>';
      return;
    }
    box.innerHTML='<div style="overflow:auto"><table><thead><tr><th>Ação</th><th>Setor</th><th>Responsável</th><th>Prazo</th><th>Status</th></tr></thead><tbody>'+
      list.map(a=>`<tr><td>${escapeHtml(a.description||'-')}</td><td>${escapeHtml(a.sector||'-')}</td><td>${escapeHtml(a.responsible||'-')}</td><td>${escapeHtml(a.dueDate||'-')}</td><td>${escapeHtml(a.status||'-')}</td></tr>`).join('')+
      '</tbody></table></div>';
  }catch(e){
    if(box)box.innerHTML='<div class="notice danger">Não foi possível consultar as ações: '+escapeHtml(e.message||String(e))+'</div>';
  }
}

function nucleo5sRenderHistory(host){
  const now=new Date();
  host.innerHTML=`
    <div class="card" style="padding:18px">
      <div style="display:flex;justify-content:space-between;gap:10px">
        <div><h3 style="margin:0">Histórico de pontuações</h3><div class="small">${escapeHtml(nucleo5sUnitLabel(nucleo5sCurrentUnit))}</div></div>
        <button class="btn secondary" type="button" onclick="nucleo5sShowPanel('home')">Voltar</button>
      </div>
      <div class="toolbar" style="margin-top:14px">
        <select id="nucleo5sHistorySector"><option value="">Todos os setores</option>${nucleo5sSectorOptions()}</select>
        <input id="nucleo5sHistoryYear" type="number" min="2020" max="2100" value="${now.getFullYear()}" style="max-width:130px">
        <button class="btn primary" type="button" onclick="nucleo5sLoadHistory()">Consultar</button>
      </div>
      <div id="nucleo5sHistoryResult" style="margin-top:14px"><div class="small">Histórico alimentado pelo Supabase.</div></div>
    </div>`;
  setTimeout(()=>nucleo5sLoadHistory(),0);
}

async function nucleo5sLoadHistory(){
  const box=document.getElementById('nucleo5sHistoryResult');
  const sector=document.getElementById('nucleo5sHistorySector')?.value||'';
  const year=document.getElementById('nucleo5sHistoryYear')?.value||'';
  if(box)box.innerHTML='<div class="small">Consultando Supabase...</div>';
  try{
    const data=await nucleo5sBackend('nucleo_5s_history',{sector,year});
    if(!data?.sucesso)throw new Error(data?.erro||'Falha ao consultar histórico.');
    const rows=Array.isArray(data.rows)?data.rows:[];
    const summary=data.summary||{};
    if(!rows.length){
      box.innerHTML='<div class="notice">Nenhuma auditoria encontrada para os filtros selecionados.</div>';
      return;
    }
    const cards=`
      <div class="ro-summary" style="margin-bottom:12px">
        <div class="ro-summary-card"><b>${escapeHtml(String(summary.total||rows.length))}</b><span>Auditorias</span></div>
        <div class="ro-summary-card"><b>${summary.average!=null?escapeHtml(String(summary.average))+'%':'-'}</b><span>Média</span></div>
        <div class="ro-summary-card"><b>${summary.best!=null?escapeHtml(String(summary.best))+'%':'-'}</b><span>Melhor resultado</span></div>
      </div>`;
    box.innerHTML=cards+'<div style="overflow:auto"><table><thead><tr><th>Data</th><th>Setor</th><th>Pontuação</th><th>Auditor 1</th><th>Auditor 2</th><th>Status</th></tr></thead><tbody>'+
      rows.map(r=>`<tr><td>${escapeHtml(r.date||'-')}</td><td>${escapeHtml(r.sector||'-')}</td><td>${r.score!=null?escapeHtml(String(r.score))+'%':'-'}</td><td>${escapeHtml(r.auditor1||'-')}</td><td>${escapeHtml(r.auditor2||'-')}</td><td>${escapeHtml(r.status||'-')}</td></tr>`).join('')+
      '</tbody></table></div>';
  }catch(e){
    if(box)box.innerHTML='<div class="notice danger">Não foi possível consultar o histórico: '+escapeHtml(e.message||String(e))+'</div>';
  }
}

function nucleo5sRenderCycle(host){
  const now=new Date();
  const month=String(now.getMonth()+1).padStart(2,'0');
  host.innerHTML=`
    <div class="card" style="padding:18px">
      <div style="display:flex;justify-content:space-between;gap:10px">
        <div><h3 style="margin:0">Resultado do ciclo</h3><div class="small">${escapeHtml(nucleo5sUnitLabel(nucleo5sCurrentUnit))}</div></div>
        <button class="btn secondary" type="button" onclick="nucleo5sShowPanel('home')">Voltar</button>
      </div>
      <div class="toolbar" style="margin-top:14px">
        <input id="nucleo5sCycleMonth" type="month" value="${now.getFullYear()}-${month}">
        <select id="nucleo5sCycleSector"><option value="">Todos os setores</option>${nucleo5sSectorOptions()}</select>
        <button class="btn primary" type="button" onclick="nucleo5sLoadCycle()">Consultar</button>
        <button class="btn secondary" type="button" onclick="nucleo5sPrintCycle()">Imprimir</button>
      </div>
      <div id="nucleo5sCycleResult" style="margin-top:14px"><div class="small">Resultado consolidado pelo Supabase.</div></div>
    </div>`;
  setTimeout(()=>nucleo5sLoadCycle(),0);
}

async function nucleo5sLoadCycle(){
  const box=document.getElementById('nucleo5sCycleResult');
  const month=document.getElementById('nucleo5sCycleMonth')?.value||'';
  const sector=document.getElementById('nucleo5sCycleSector')?.value||'';
  if(box)box.innerHTML='<div class="small">Calculando ciclo...</div>';
  try{
    const data=await nucleo5sBackend('nucleo_5s_cycle',{month,sector});
    if(!data?.sucesso)throw new Error(data?.erro||'Falha ao calcular ciclo.');
    const rows=Array.isArray(data.rows)?data.rows:[];
    if(!rows.length){
      box.innerHTML='<div class="notice">Nenhum resultado encontrado neste ciclo.</div>';
      return;
    }
    box.dataset.printTitle='Resultado 5S - '+(data.monthLabel||month||'ciclo');
    box.innerHTML=`
      <div id="nucleo5sCyclePrintable">
        <div style="margin-bottom:12px"><b>${escapeHtml(data.monthLabel||month||'Ciclo')}</b> · ${escapeHtml(nucleo5sUnitLabel(nucleo5sCurrentUnit))}</div>
        <div style="overflow:auto"><table><thead><tr><th>Setor</th><th>Auditorias</th><th>Média</th><th>Melhor</th><th>Última auditoria</th></tr></thead><tbody>
          ${rows.map(r=>`<tr><td>${escapeHtml(r.sector||'-')}</td><td>${escapeHtml(String(r.count||0))}</td><td>${r.average!=null?escapeHtml(String(r.average))+'%':'-'}</td><td>${r.best!=null?escapeHtml(String(r.best))+'%':'-'}</td><td>${escapeHtml(r.lastDate||'-')}</td></tr>`).join('')}
        </tbody></table></div>
      </div>`;
  }catch(e){
    if(box)box.innerHTML='<div class="notice danger">Não foi possível calcular o ciclo: '+escapeHtml(e.message||String(e))+'</div>';
  }
}

function nucleo5sPrintCycle(){
  const printable=document.getElementById('nucleo5sCyclePrintable');
  if(!printable){alert('Consulte um ciclo antes de imprimir.');return;}
  const win=window.open('','_blank','width=1000,height=760');
  if(!win){alert('O navegador bloqueou a janela de impressão.');return;}
  win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Resultado 5S</title><style>
    body{font-family:Arial,sans-serif;color:#111;padding:28px}h1{font-size:22px;margin:0 0 18px}
    table{border-collapse:collapse;width:100%}th,td{border:1px solid #bbb;padding:8px;text-align:left}
    th{background:#f2f2f2}@media print{button{display:none}}
  </style></head><body><h1>Resultado do ciclo 5S</h1>${printable.innerHTML}<script>window.onload=()=>window.print();<\/script></body></html>`);
  win.document.close();
}

function showAudit5S(){
  view('audit5sView');
  setNav('audit5s');

  const switcher=document.getElementById('audit5sUnitSwitcher');
  if(switcher)switcher.style.display=isAdmin()?'flex':'none';

  nucleo5sCurrentUnit=nucleo5sSessionUnit();
  nucleo5sSetUnitButtons(nucleo5sCurrentUnit);
  nucleo5sConfigReady();
  nucleo5sShowPanel('home');
  window.scrollTo({top:0,behavior:'instant'});
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
  const assignedRows=getTriageRecords().filter(r=>r.triagemStatus!=='new');
  if(sectorEl){
    const current=sectorEl.value||'all';
    const sectors=nucleoVisibleManagerSectors(isManager(),managedSectorsForCurrentUser(),assignedRows.map(r=>r.setorDirecionado));
    sectorEl.setAttribute('aria-label',isManager()?'Setor sob minha gestão':'Setor responsável');
    sectorEl.title=isManager()?'Escolha o setor que deseja acompanhar':'Filtrar por setor';
    sectorEl.innerHTML='<option value="all">'+(isManager()?'Todos os meus setores':'Todos os setores')+'</option>'+sectors.map(s=>`<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
    if([...sectorEl.options].some(o=>o.value===current))sectorEl.value=current;
  }
  if(unitEl){
    const current=unitEl.value||'all';
    const units=[...new Set(assignedRows
      .map(r=>String(r.unidade||'').trim()).filter(Boolean))]
      .sort((a,b)=>a.localeCompare(b,'pt-BR'));
    unitEl.innerHTML='<option value="all">Todas as unidades</option>'+units.map(u=>`<option value="${escapeHtml(u)}">${escapeHtml(u)}</option>`).join('');
    if([...unitEl.options].some(o=>o.value===current))unitEl.value=current;
  }
}

function showAssignedRos(){
  if(!nucleoFeatureRequire('ros','assigned'))return;
  roListMode='assigned';
  assignedLifecycle='active';
  view('roListView');
  setNav('assigned');
  const activeTab=document.getElementById('assignedActiveTab');if(activeTab)activeTab.className='btn primary';
  const historyTab=document.getElementById('assignedHistoryTab');if(historyTab)historyTab.className='btn secondary';
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
function pdcaMaxActionDate(){
  const d=new Date();
  d.setHours(0,0,0,0);
  d.setMonth(d.getMonth()+6);
  return d;
}
function pdcaIsoDate(d){
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function pdcaActionDeadlineValid(value){
  const d=parseBrDate(value);
  if(!d)return false;
  const max=pdcaMaxActionDate();
  d.setHours(0,0,0,0);
  return d<=max;
}
function pdcaValidateActionDeadlines(showAlert=true){
  const invalid=[];
  const main=String(answers.p12||'').trim();
  if(main && !pdcaActionDeadlineValid(main))invalid.push('Ação principal');
  pdcaExtraActions.forEach((a,i)=>{
    if(String(a.action||'').trim() && String(a.deadline||'').trim() && !pdcaActionDeadlineValid(a.deadline)){
      invalid.push('Ação '+(i+2));
    }
  });
  if(invalid.length && showAlert){
    alert('O prazo máximo para execução de uma ação é de 6 meses a partir de hoje.\n\nRevise: '+invalid.join(', ')+'.');
  }
  return invalid.length===0;
}
function pdcaInitialRequiredIds(){
  // O primeiro envio formaliza o plano e cria as cobranças das ações.
  // DO/CHECK/ACT podem ser concluídos depois conforme a execução avança.
  return ['p1','p2','p3','p4','p5','p6','p7','p8','p9','p10','p11','p12','p13','p14'];
}
function pdcaInitialPlanComplete(){
  return pdcaInitialRequiredIds().every(id=>String(answers[id]||'').trim());
}
function pdcaAllActionsCompleted(p){
  const actions=allPdcaActionsForRecord(p);
  if(!actions.length)return false;
  return actions.every(a=>{
    const pseudo={...p,answers:{...(p.answers||{}),p11:a.action,p12:a.deadline,p13:a.owner},acaoConferidaEm:a.completedAt||a.acaoConferidaEm};
    return inferActionStatus(pseudo).code==='done';
  });
}
function pdcaActionImpacts5S(p,a){
  const pseudo={...p,answers:{...(p.answers||{}),p11:a.action,p12:a.deadline,p13:a.owner},acaoConferidaEm:a.completedAt||a.acaoConferidaEm};
  return inferActionStatus(pseudo).code==='overdue';
}
function pdcaExecutionCompleted(){
  const status=normalizeAnswer(answers.p10||'');
  if(!status)return false;
  return /(conclu|finaliz|executad|implantad|realizad|encerrad|feito|atingid)/.test(status);
}
function pdcaActionText(){
  return normalizeAnswer(answers.p11||'');
}
function pdcaActionIsTrainingRelated(){
  const a=pdcaActionText();
  return /\b(treinar|treinamento|capacitar|capacitacao|capacitação|orientar|orientacao|orientação|instruir|instrucao|instrução|reciclar|reciclagem)\b/.test(a);
}
function pdcaQuestionDependency(id){
  // CHECK/ACT depend on the execution being concluded.
  const stageIndex=stages.findIndex(s=>s.items.some(item=>item[0]===id));
  if(stageIndex>=2 && !pdcaExecutionCompleted()){
    return {
      locked:true,
      label:'Aguardando execução',
      reason:'Esta pergunta só faz sentido depois que a ação planejada for executada.'
    };
  }

  // When the action itself IS the training/capacitation, these answers cannot
  // exist before the action happens.
  if(!pdcaExecutionCompleted() && pdcaActionIsTrainingRelated() && ['d1','d2','d3'].includes(id)){
    const labels={
      d1:'O treinamento ainda é a própria ação planejada.',
      d2:'A compreensão da equipe só pode ser verificada depois do treinamento.',
      d3:'O status do treinamento será atualizado conforme a ação for executada.'
    };
    return {
      locked:true,
      label:'Aguardando treinamento',
      reason:labels[id]||'Esta resposta depende da execução da ação.'
    };
  }

  return {locked:false,label:'',reason:''};
}
function pdcaQuestionLocked(id){
  return pdcaQuestionDependency(id).locked;
}
function pdcaEditableQuestionIds(){
  return stages.flatMap((stage,index)=>
    pdcaStageLocked(index)?[]:stage.items.map(item=>item[0]).filter(id=>!pdcaQuestionLocked(id))
  );
}
function pdcaStageLocked(index){
  return index>=2 && !pdcaExecutionCompleted();
}
function pdcaLockedStageMessage(){
  return 'Esta etapa será liberada quando o status da meta/ação indicar que a execução foi concluída. Enquanto estiver prevista ou em andamento, ainda não há resultado suficiente para checar eficácia ou padronizar.';
}
function pdcaHandleAnswerInput(id,value){
  answers[id]=value;
  if(id==='p10'){
    if(!pdcaExecutionCompleted() && activeStage>=2)activeStage=1;
    renderPdcaStageOverview();
    setTimeout(()=>runPdcaQualityCheck(false),0);
  }
  if(['p11','p12'].includes(id))renderPdcaActions();
  if(id==='p11'){
    renderPdcaStageOverview();
    setTimeout(()=>runPdcaQualityCheck(false),0);
  }
  updateCompletion();
  renderPdcaStageOverview();
  schedulePdcaDraftSave();
  refreshPdcaInlineAlerts();
}
function renderStage(){
  renderPdcaStageOverview();
  stageTabs.innerHTML=stages.map((s,i)=>{
    const locked=pdcaStageLocked(i);
    const available=s.items.filter(it=>!pdcaQuestionLocked(it[0]));
    const done=available.filter(it=>(answers[it[0]]||'').trim()).length;
    const waiting=s.items.length-available.length;
    return `<button class="stage-tab ${i===activeStage?'active':''} ${locked?'pdca-stage-locked':''}" ${locked?'disabled':''} onclick="activeStage=${i};renderStage()">${s.number} · ${s.name} <small>${locked?'Aguardando execução':done+'/'+available.length+(waiting?' · '+waiting+' aguardando ação':'')}</small></button>`;
  }).join('');

  if(pdcaStageLocked(activeStage))activeStage=1;
  const s=stages[activeStage];
  stageTitle.textContent=s.number+' · '+s.name;
  stageSubtitle.textContent=s.subtitle;

  const stageAvailable=s.items.filter(it=>!pdcaQuestionLocked(it[0]));
  const stageDone=stageAvailable.filter(it=>(answers[it[0]]||'').trim()).length;
  const pos=document.getElementById('stagePosition');
  const badge=document.getElementById('stageCompletionBadge');
  if(pos)pos.textContent=`Etapa ${activeStage+1} de ${stages.length}`;
  if(badge)badge.textContent=`${stageDone}/${stageAvailable.length} disponíveis respondidas`;

  const lockedCurrent=pdcaStageLocked(activeStage);
  questions.innerHTML=(lockedCurrent?`<div class="pdca-stage-lock-banner"><b>Etapa aguardando execução</b><span>${escapeHtml(pdcaLockedStageMessage())}</span></div>`:'')+s.items.map((it,i)=>{
    const global=globalQuestionNumber(it[0]);
    const answered=(answers[it[0]]||'').trim().length>0;
    const dependency=pdcaQuestionDependency(it[0]);
    const questionLocked=lockedCurrent||dependency.locked;

    if(it[0]==='p13')return renderPdcaResponsibleSectorQuestion(it,s,global,answered);

    return `<div class="question ${questionLocked?'pdca-question-locked':''}">
      <div class="pdca-question-head">
        <div class="small" style="font-weight:700">Pergunta ${global} de 26 · ${s.name}</div>
        <div class="pdca-question-actions">
          <span class="status-badge ${answered&&!questionLocked?'answered':''}">${questionLocked?escapeHtml(dependency.label||'Aguardando execução'):answered?'Respondida':'Obrigatória'}</span>
          <button class="mic-answer-btn" type="button" ${questionLocked?'disabled':''} onclick="dictatePdcaAnswer('${it[0]}',this)">🎤 Falar resposta</button>
        </div>
      </div>
      <h4>${it[1]}</h4>
      <p>${it[2]}</p>
      ${dependency.locked?`<div class="pdca-dependency-note"><b>Esta resposta ainda não é exigida.</b><span>${escapeHtml(dependency.reason)}</span></div>`:''}
      <textarea id="answer_${it[0]}" spellcheck="true" ${questionLocked?'disabled':''}
        oninput="pdcaHandleAnswerInput('${it[0]}',this.value)"
        placeholder="${questionLocked?'Esta pergunta será liberada automaticamente quando a ação correspondente for executada.':'Escreva ou fale aqui sua resposta...'}">${answers[it[0]]||''}</textarea>
      ${questionLocked?'':pdcaInlineAlertHtml(it[0])}
      <div class="pdca-evidence-row"><div class="small">Evidência ou foto (opcional)</div><input type="file" ${questionLocked?'disabled':''}></div>
    </div>`;
  }).join('');

  prevStage.disabled=activeStage===0;
  nextStage.disabled=activeStage===stages.length-1 || (activeStage===1&&!pdcaExecutionCompleted());
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
  const planReady=pdcaInitialPlanComplete();
  const deadlineOk=pdcaValidateActionDeadlines(false);

  if(txt)txt.textContent=`${completed} de ${total} respondidas`;
  if(fill)fill.style.width=pct+'%';
  if(btn)btn.disabled=!(planReady&&deadlineOk);

  if(hint){
    if(!planReady){
      const missing=pdcaInitialRequiredIds().filter(id=>!String(answers[id]||'').trim()).length;
      hint.textContent=`Complete o planejamento para enviar e iniciar o acompanhamento. Faltam ${missing} campo(s) da etapa Planejar.`;
    }else if(!deadlineOk){
      hint.textContent='Revise o prazo das ações: nenhuma ação pode ter prazo superior a 6 meses.';
    }else if(!pdcaExecutionCompleted()){
      hint.textContent='O planejamento já pode ser enviado. As ações serão cobradas até a conclusão; Checar e Agir serão liberados depois.';
    }else if(completed<total){
      hint.textContent=`O acompanhamento pode ser enviado. Ainda há ${total-completed} resposta(s) de execução/verificação pendente(s).`;
    }else{
      hint.textContent='PDCA completo. O envio está liberado.';
    }
  }

  const stage=stages[activeStage];
  const availableStageItems=stage.items.filter(it=>!pdcaQuestionLocked(it[0]));
  const stageDone=availableStageItems.filter(it=>(answers[it[0]]||'').trim()).length;
  const stageBadge=document.getElementById('stageCompletionBadge');
  if(stageBadge)stageBadge.textContent=`${stageDone}/${availableStageItems.length} disponíveis respondidas`;
}
function highlightMissing(){
  const required=pdcaInitialRequiredIds();
  const missing=required.filter(id=>!String(answers[id]||'').trim());
  if(!missing.length)return true;

  const first=missing[0];
  activeStage=0;
  renderStage();
  setTimeout(()=>{
    const el=document.getElementById('answer_'+first);
    if(el){
      const q=el.closest('.question');if(q)q.classList.add('missing');
      if(first!=='p13'&&typeof el.focus==='function')el.focus();
      (q||el).scrollIntoView({behavior:'smooth',block:'center'});
    }
  },50);
  alert(`Antes de enviar, complete a etapa Planejar. Ainda faltam ${missing.length} campo(s).`);
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
  view('contestationsView'); setNav('contests'); renderContestations();
}
function refreshContestPendingBadge(){
  refreshMenuNotificationBadges();
}
function renderContestations(){
  if(!nucleoPersonFeatureCan('ros','reviewContests'))return;
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
    const active=i===activeStage;
    const locked=pdcaStageLocked(i);
    const available=s.items.filter(it=>!pdcaQuestionLocked(it[0]));
    const done=available.filter(it=>(answers[it[0]]||'').trim()).length;
    const waiting=s.items.length-available.length;
    return `<button type="button" ${locked?'disabled':''} onclick="activeStage=${i};renderStage()" class="pdca-overview-stage ${active?'active':''} ${locked?'locked':''}">
      <div class="small" style="font-weight:700">Etapa ${i+1}</div><b>${escapeHtml(s.name)}</b><div class="small">${locked?'Aguardando execução':done+'/'+available.length+' disponíveis'+(waiting?' · '+waiting+' dependente(s) da ação':'')}</div>
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

function changeStage(d){
  const target=Math.max(0,Math.min(stages.length-1,activeStage+d));
  if(pdcaStageLocked(target)){
    alert(pdcaLockedStageMessage());
    return;
  }
  activeStage=target;renderStage();window.scrollTo({top:0,behavior:'smooth'});
}function openContest(){
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
  if(!pdcaValidateActionDeadlines(true))return;

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
      status:pdcaExecutionCompleted()?'Enviado':'Em acompanhamento',
      answers:{...answers},
      followUpRequired:!pdcaExecutionCompleted(),
      presentationBlockedUntilActionsComplete:true,
      fiveSImpactRule:'overdue_only',
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
  nucleoSetCentralSyncState('syncing','Sincronização manual em andamento. Os dados locais ainda não estão confirmados.');
  const syncMsg=document.getElementById('syncMsg');

  let s=getSavedIntegrationSettings();

  try{
    if(!s.apiUrl || !portalBackendEnabled()){
      await nucleoEnsureApiConfigured();
      s=getSavedIntegrationSettings();
    }
  }catch(e){
    syncMsg.textContent='Não foi possível confirmar o Apps Script: '+(e?.message||e)+'.';
    syncMsg.className='statusline';
    hideNucleoLoading();
    syncNow.inProgress=false;
    return;
  }

  await showNucleoLoading('Buscando '+integrationPeriodLabel(s)+' nas abas Interna e Externa...','Sincronizando com a planilha');

  if(!s.apiUrl){
    syncMsg.textContent='A URL do Apps Script ainda não foi configurada.';
    syncMsg.className='statusline';
    hideNucleoLoading();
    syncNow.inProgress=false;
    return;
  }

  syncMsg.textContent='Sincronizando...';
  syncMsg.className='statusline';

  try{
    // Se a carga automática estiver em andamento, aguarda pouco tempo. Se ela
    // travou, libera apenas a referência do front e executa uma leitura manual.
    // O backend continua seguro porque a leitura não grava na planilha.
    if(nucleoRoCentralRefreshPromise){
      syncMsg.textContent='Conferindo a carga automática em andamento...';
      const autoResult=await Promise.race([
        Promise.resolve(nucleoRoCentralRefreshPromise).then(v=>v===true?'ok':'failed').catch(()=> 'failed'),
        new Promise(resolve=>setTimeout(()=>resolve('timeout'),5000))
      ]);
      if(autoResult==='ok'){
        syncMsg.textContent='R.O.s e SACs atualizados pela base central.';
        syncMsg.className='statusline okline';
        return;
      }
      if(autoResult==='timeout')nucleoRoCentralRefreshPromise=null;
      syncMsg.textContent='Executando uma leitura manual da base central...';
      updateNucleoLoading('Executando uma leitura manual da base central...');
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
    updateNucleoLoading('Confirmando configurações e cadastros na base central...');
    let centralOk=await syncPortalBackend(false,{foreground:false});

    // Uma sincronização automática pode ter acabado de encerrar entre a leitura das
    // R.O.s e esta confirmação. Faz uma segunda tentativa curta antes de concluir
    // que a base central está indisponível.
    if(!centralOk){
      await new Promise(resolve=>setTimeout(resolve,800));
      centralOk=await syncPortalBackend(false,{foreground:false});
    }

    const bases=(typeof data.quantidadeInterna!=='undefined')?' · Interna: '+data.quantidadeInterna+' · Externa/SAC: '+(data.quantidadeExterna||0):'';
    if(centralOk){
      syncMsg.textContent='Sincronização concluída e confirmada: '+qty+' R.O.(s) carregada(s)'+bases+' · período: '+integrationPeriodLabel(s)+' · '+new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})+'.';
      syncMsg.className='statusline okline';
    }else{
      // As R.O.s oficiais já foram carregadas com sucesso. Não bloquear a tela inteira
      // por uma confirmação auxiliar; mantém estado de atenção e agenda nova tentativa.
      nucleoSetCentralSyncState('syncing','R.O.s atualizadas. A confirmação dos demais dados da base central será repetida automaticamente.');
      syncMsg.textContent='R.O.s atualizadas: '+qty+' carregada(s)'+bases+'. Confirmando os demais dados da base central...';
      syncMsg.className='statusline';
      setTimeout(()=>syncPortalBackend(false,{foreground:false}),2500);
    }
  }catch(err){
    const detail=String(err?.message||err||'Erro não informado');
    const stack=String(err?.stack||'').split('\n').slice(0,4).join(' | ');
    const diagnostic=stack?(' · Diagnóstico: '+stack):'';
    nucleoSetCentralSyncState('error','Sincronização não confirmada: '+detail);
    syncMsg.textContent='Não foi possível concluir a carga das R.O.s: '+detail+diagnostic+'.';
    syncMsg.className='statusline';
    console.error('[NÚCLEO SYNC] Falha na sincronização manual',err,err?.stack);
  }finally{
    hideNucleoLoading();
    syncNow.inProgress=false;
  }
}
try{localStorage.removeItem(IMPORTED_RAW_KEY)}catch(e){}
ensurePreviewSession();
initLogin();
if(getSession()){
  nucleoSetCentralSyncState('syncing','Cache local exibido temporariamente. Confirmando dados com a base central…');
  render();
}
refreshAccessUI();enforceAdminVisibility();refreshRoRegistrationAccess();
setTimeout(async()=>{
  if(!getSession()?.authToken)return;
  await showNucleoLoading('Confirmando dados com a base central...','Carregando NÚCLEO');
  try{
    const centralOk=await syncPortalBackend(false);
    if(!centralOk){
      if(portalBackendSyncInProgress || nucleoCentralSyncState.status==='syncing'){
        console.info('[NÚCLEO SYNC] Confirmação central ainda em andamento; mantendo estado de sincronização.');
        return;
      }
      throw new Error('A base central não confirmou os dados.');
    }
    if(!getSession()?.permissions||nucleoPersonCan('ros'))await refreshLegacyRoCacheFromApi(true);
  }
  catch(e){
    console.warn('Falha ao confirmar dados da base central.',e);
    nucleoSetCentralSyncState('error','Não foi possível confirmar os dados com a base central: '+(e?.message||e));
  }
  finally{hideNucleoLoading(true);}
},80);
try{if(getSession())renderCurrentOverview()}catch(e){console.warn('Falha ao carregar a Visão geral inicial.',e)}
try{refreshNotificationBell();refreshMenuNotificationBadges()}catch(e){}

try{
  // Força a normalização imediata do cache de SACs antigos.
  if(getSession()?.authToken)saveExternalRoControlsLocal(getExternalRoControls());
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

  const session5s=getSession()||{};
  const canSee5s=allowed || !!String(session5s.sector||'').trim();

  const module=document.getElementById('moduleManagement');
  if(module){
    module.style.display=canSee5s?'':'none';
    module.classList.toggle('hidden',!canSee5s);
  }

  const navAudit5s=document.getElementById('navAudit5s');
  if(navAudit5s){
    navAudit5s.style.display=canSee5s?'':'none';
    navAudit5s.classList.toggle('hidden',!canSee5s);
  }

  const adminIds=[
    'navExternalPdcas','navAdmin','navEquipment','navTraining','navNcCapa','navDocuments',
    'navProcesses','navIndicators','navAnnouncements',
    'navPendingActions','navTriage','navContests','navExternalRoControl','navSacTracking'
  ];
  adminIds.forEach(id=>{
    const el=document.getElementById(id);
    if(!el)return;

    // Para perfis sem edição detalhada, mantém o comportamento antigo.
    if(getSession()?.permissions?.detailVersion!==1){
      el.style.display=allowed?'':'none';
      el.classList.toggle('hidden',!allowed);
      return;
    }

    // Com permissões detalhadas, nucleoApplyFeatureAccess decide item por item.
    el.style.removeProperty('display');
    el.classList.remove('hidden');
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
  try{nucleoRenderCentralSyncState()}catch(e){}
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
  document.getElementById('qualityConfigSectors').value=sectors;document.getElementById('qualityConfigEmail').value=c.sgqNotificationEmail||'';document.getElementById('qualityConfigDirector').value=c.directorSacEmail||'';renderDocumentTypeSettings(unit);nucleoRenderDecisionSettings(unit);nucleoRenderSacEmailSettings();
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

































function userHasUnitSector(user,unit,sector){
  const key=normalizeAnswer(sector||'');
  const targetUnit=normalizePortalUnit(unit||'');
  if(unit==='todas'||targetUnit==='todas'){
    return normalizeAnswer(user.sector||'')===key ||
      (user.sectorMemberships||[]).some(m=>normalizeAnswer(m.sector)===key) ||
      (user.managedSectors||[]).some(s=>normalizeAnswer(s||'')===key);
  }
  if((user.sectorMemberships||[]).some(m=>
    normalizePortalUnit(m.unit||'')===targetUnit &&
    normalizeAnswer(m.sector)===key
  ))return true;
  return normalizePortalUnit(user.unit)===targetUnit &&
    [user.sector,...(user.managedSectors||[])].some(s=>normalizeAnswer(s||'')===key);
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
function nucleoDriveLoad(){if(typeof nucleoDriveShow==='function')return Promise.resolve();if(!nucleoDriveModulePromise)nucleoDriveModulePromise=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=new URL('assets/modules/drive-documents.js?v=20261028-no-pdca-list-v9',document.baseURI).href;const timer=setTimeout(()=>finish(new Error('Tempo limite ao carregar o módulo de arquivos. Tente novamente.')),20000);function finish(error){clearTimeout(timer);script.onload=script.onerror=null;if(error){script.remove();nucleoDriveModulePromise=null;reject(error);}else resolve();}script.onload=()=>finish();script.onerror=()=>finish(new Error('Não foi possível carregar o módulo de arquivos.'));document.head.appendChild(script);});return nucleoDriveModulePromise;}
async function nucleoDriveOpen(tab){try{await nucleoDriveLoad();await nucleoDriveShow(tab);}catch(e){alert(e.message);}}
function nucleoDriveSettingsShortcut(){
 const box=document.getElementById('unitQualitySettings');if(!box)return;
 box.style.display='block';
 if(document.getElementById('nucleoDriveFolders'))return;
 const section=document.createElement('section');section.id='nucleoDriveFolders';section.className='unit-settings-section';section.style.margin='16px 0';
 const labels={ros:'R.O.s',pdcas:'Respostas de PDCA',standard:'Documentos padrão',requested:'Documentos solicitados',templates:'Modelos editáveis'};
 section.innerHTML='<h4>Pastas do Drive desta unidade</h4><p class="small">Selecione a unidade acima e cole os links das pastas. Depois salve a configuração desta unidade.</p>'+Object.entries(labels).map(([k,label])=>'<label style="display:block;margin:10px 0"><span>'+label+'</span><div style="display:flex;gap:8px"><input id="ndFolder_'+k+'" type="url" style="flex:1;min-width:0" placeholder="https://drive.google.com/drive/folders/…"><button class="btn secondary" type="button" data-folder="'+k+'">Validar acesso</button></div><span id="ndFolderStatus_'+k+'" class="small" role="status"></span></label>').join('')+'<div class="settings-block sgq-only" id="avatarGalleryConfig" style="margin-top:16px"><h4 style="margin:0 0 6px">Galeria de avatares</h4><p class="small">Pasta do Drive com as imagens aprovadas (JPG, PNG ou WebP). As pessoas escolhem a imagem em Meu perfil.</p><div style="display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap"><label style="flex:1;min-width:260px"><span>Pasta da galeria</span><input id="avatarGalleryFolder" type="url" placeholder="https://drive.google.com/drive/folders/…"></label><button type="button" class="btn primary" onclick="nucleoConfigureAvatarGallery(this)">Salvar pasta da galeria</button></div><p id="avatarGalleryConfigStatus" class="small" role="status"></p></div>';
 box.querySelector('.unit-settings-footer').before(section);
 section.querySelectorAll('button[data-folder]').forEach(btn=>btn.onclick=async()=>{const kind=btn.dataset.folder,status=document.getElementById('ndFolderStatus_'+kind);btn.disabled=true;status.textContent='Validando…';try{const r=await portalJsonp({acao:'nucleo_drive_validate',unit:document.getElementById('qualityConfigUnit').value,kind,link:document.getElementById('ndFolder_'+kind).value},60000);if(!r?.sucesso)throw new Error(r?.erro||'Acesso não confirmado.');status.textContent='Acesso confirmado: '+r.name;}catch(e){status.textContent=e.message;}finally{btn.disabled=false;}});
 const unit=document.getElementById('qualityConfigUnit').value,c=unitConfiguration(unit)||{};Object.keys(labels).forEach(k=>document.getElementById('ndFolder_'+k).value=c.driveFolders?.[k]||'');
 if(nucleoPersonPermissions(getSession()).sgq)nucleoReadAvatarGalleryConfig();
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




















// A expiração central encerra o acesso local sem apagar cadastros ou rascunhos.
let nucleoEndingExpiredSession=false;












setInterval(nucleoCheckSessionExpiry,30000);
window.addEventListener('focus',nucleoCheckSessionExpiry);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')nucleoCheckSessionExpiry();});























function nucleoPersonUnits(user){return Array.isArray(user.accessUnits)?user.accessUnits:user.role==='admin'?['matriz','filial']:user.role==='quality'?['filial']:[explicitPortalUnit(user.unit)||'matriz'];}
function nucleoApplyPersonAccess(){
 const user=getSession();if(!user?.permissions)return;
 const map={navRos:'ros',navAssignedRos:'ros',navMySubmittedRos:'ros',navTriage:'ros',navContests:'ros',navSent:'pdca',navActions:'pdca',navPendingActions:'pdca',navExternalPdcas:'pdca',navExternalRoControl:'sac',navMySacs:'sac',navSacTracking:'sac',navDocuments:'documents',navDocumentRequests:'documents',navIndicators:'indicators',navAnnouncements:'announcements',navEquipment:'equipment',navTraining:'training',navNcCapa:'nc',navProcesses:'processes'};
 Object.entries(map).forEach(([id,module])=>{
   const el=document.getElementById(id);if(!el)return;
   let allowed=nucleoPersonCan(module);
   if(id==='navTriage')allowed=nucleoPersonFeatureCan('ros','triage');
   if(id==='navExternalRoControl')allowed=nucleoPersonFeatureCan('sac','edit')||nucleoPersonFeatureCan('sac','consult');
   if(id==='navSacTracking'||id==='navMySacs')allowed=nucleoPersonFeatureCan('sac','consult');
   if(id==='navIndicators')allowed=nucleoPersonFeatureCan('indicators','consult');
   if(id==='navContests')allowed=nucleoPersonFeatureCan('ros','reviewContests');
   if(id==='navPendingActions')allowed=nucleoPersonFeatureCan('pdca','reviewActions');
   if(!allowed){
     el.style.setProperty('display','none','important');
     el.classList.add('hidden');
   }else{
     el.style.removeProperty('display');
     el.classList.remove('hidden');
   }
 });
 nucleoApplyFeatureAccess();
 ['cfgUsers','unitQualitySettings','cfgNotifications','cfgUnits'].forEach(id=>{const el=document.getElementById(id);if(!el)return;const module=id==='cfgUsers'?'users':'sectors';el.style.setProperty('display',nucleoPersonCan(module)?'':'none','important');});
}




























function nucleoFeatureRequire(module,feature){if(nucleoPersonFeatureCan(module,feature))return true;alert('Seu acesso não inclui: '+(NUCLEO_PERSON_FEATURES[module]?.[feature]?.[0]||'esta função')+'.');return false;}
function nucleoFeatureEditor(user,parent){
 return Object.entries(NUCLEO_PERSON_FEATURES).map(([module,features])=>'<details class="person-feature-group" style="border:1px solid #dce4ee;border-radius:10px;margin:10px 0;padding:12px" '+(module==='ros'?'open':'')+'><summary style="cursor:pointer;font-weight:700">'+escapeHtml(NUCLEO_PERSON_MODULES[module])+'</summary><div style="display:grid;gap:10px;margin-top:14px">'+Object.entries(features).map(([key,[label]])=>'<label style="display:flex;gap:10px;align-items:center"><input type="checkbox" data-feature-module="'+module+'" data-feature="'+key+'" '+(nucleoPersonFeatureAllowed(user,module,key)?'checked ':'')+(!nucleoPersonFeatureAllowed(parent,module,key)?'disabled ':'')+'style="width:22px;height:22px;flex-shrink:0">'+escapeHtml(label)+'</label>').join('')+'</div></details>').join('');
}
function nucleoApplyFeatureAccess(){
 if(getSession()?.permissions?.detailVersion!==1)return;
 const nav={navRos:['ros','consult'],navAssignedRos:['ros','assigned'],navMySubmittedRos:['ros','submitted'],navTriage:['ros','triage'],navContests:['ros','reviewContests'],navSent:['pdca','received'],navActions:['pdca','actions'],navPendingActions:['pdca','reviewActions'],navExternalPdcas:['pdca','import'],navExternalRoControl:['sac','edit'],navMySacs:['sac','consult'],navSacTracking:['sac','consult'],navDocuments:['documents','*'],navDocumentRequests:['documents','request'],navIndicators:['indicators','consult'],navAnnouncements:['announcements','publish'],navEquipment:['equipment','*'],navTraining:['training','*'],navNcCapa:['nc','*'],navProcesses:['processes','*']};
 Object.entries(nav).forEach(([id,[module,key]])=>{
   const el=document.getElementById(id);if(!el)return;
   const allowed=key==='*'?nucleoPersonCan(module):nucleoPersonFeatureCan(module,key);
   if(allowed){
     el.style.removeProperty('display');
     el.classList.remove('hidden');
   }else{
     el.style.setProperty('display','none','important');
     el.classList.add('hidden');
   }
 });
}

function nucleoWorkspaceFeature(key,mode){
 const module=key==='nccapa'?'nc':key;
 const maps={documents:{new:'request',mine:'consult',standards:'standards',deliveries:'history',doc_analysis:'prepare',doc_preparation:'prepare',doc_ready:'deliver',history:'consult'},processes:{new:'edit',published:'consult',review:'review',pending:'review',history:'history',templates:'templates'},equipment:{new:'edit',active:'consult',pending:'pending',history:'history'},training:{new:'edit',active:'consult',pending:'pending',history:'history'},nccapa:{new_rnc:'edit',new_internal:'edit',active:'consult',history:'consult',suppliers:'edit',supplier_indicators:'consult'}};
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


























document.addEventListener('DOMContentLoaded',nucleoShowTriageBuild);
nucleoShowTriageBuild();

function nucleoAssignedDecisionLabel(ro,tri,status,preloadedMap=null){const saved=resolvedTriageForRo(ro,preloadedMap instanceof Map?preloadedMap:getSavedTriageMap());const decision=saved?.decision&&!saved.importedFromSheet?saved:tri;const raw=normalizeAnswer(ro?.statusPlanilha||ro?.status||ro?.raw?.__statusOperacional||'');if(decision?.decisionId==='falta_caixa'||raw==='falta de caixa'||raw==='falta de caixas')return decision?.decisionLabel||'Falta de caixa';return decision?.decision&&decision.decision!=='directed'?(decision.decisionLabel||nucleoDecisionForRecord(ro,decision)?.label||status):status;}




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

function nucleoKpiCatalog(){return (isAdmin()?[['triage','R.O.s aguardando triagem','ros','triage'],['sac_classify','SACs aguardando classificação','sac','edit'],['action_review','Ações para atenção do SGQ','pdca','reviewActions'],['contests','Contestações pendentes','ros','reviewContests'],['registrations','Cadastros aguardando aprovação','users','approve'],['documents','Solicitações de documentos abertas','documents','consult']]:[['pdca_pending','R.O.s aguardando sua resposta','ros','assigned'],['sector_actions','Ações do seu setor','pdca','actions'],['submitted','R.O.s que você abriu aguardando triagem','ros','submitted'],['sacs','SACs em acompanhamento','sac','consult'],['documents','Solicitações de documentos abertas','documents','consult']]).concat(nucleoKpiExtraCatalog());}
function nucleoKpiOrder(available,saved){return Array.isArray(saved)?[...new Set(saved)].filter(id=>available.includes(id)):available;}
function nucleoRenderKpiChoices(cards,ids){const host=document.getElementById('overviewKpis');if(!host)return;const extra=nucleoKpiExtraCatalog();if((getSession()?.overviewIndicators||[]).some(id=>extra.some(x=>x[0]===id))){const counts=nucleoKpiExtraCounts();extra.forEach(x=>{if(!ids.includes(x[0])){ids.push(x[0]);cards.push(overviewKpi(counts[x[0]]||0,x[1],'',null));}});}const allowed=nucleoKpiCatalog().filter(x=>nucleoPersonFeatureCan(x[2],x[3])).map(x=>x[0]),order=Array.isArray(getSession()?.overviewIndicators)?nucleoKpiOrder(ids.filter(id=>allowed.includes(id)),getSession().overviewIndicators):ids.filter(id=>allowed.includes(id)&&nucleoKpiDefaultIds().includes(id));host.innerHTML=order.map(id=>cards[ids.indexOf(id)]).join('')||'<p class="small">Nenhum indicador selecionado. Use Personalizar indicadores.</p>';let toolbar=document.getElementById('overviewIndicatorToolbar');if(!toolbar){toolbar=document.createElement('div');toolbar.id='overviewIndicatorToolbar';toolbar.className='actions';toolbar.style.cssText='justify-content:flex-end;align-items:center;gap:10px;flex-wrap:wrap;margin:8px 0';toolbar.innerHTML='<button class="btn secondary" type="button" onclick="nucleoOpenKpiEditor()">⚙ Personalizar indicadores</button>';host.before(toolbar);}const refresh=document.getElementById('overviewRefreshButton');if(refresh)toolbar.appendChild(refresh);nucleoEnsureInlineTeam();}
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
 host.innerHTML=teams.map(t=>'<section style="border:1px solid #dce5ee;border-radius:12px;padding:18px;margin-top:16px"><h3 style="margin:0">'+escapeHtml(t.sector)+'</h3><p class="small">'+(t.unit==='filial'?'Filial — Linhares':'Matriz')+' · '+t.people.length+' pessoa(s)</p>'+(!t.people.some(p=>p.manager)?'<p class="small">Nenhum gestor cadastrado para esta equipe.</p>':'')+'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px">'+t.people.map(p=>{const parts=splitPersonNameDescription(p.name,p.description||undefined);return '<div style="padding:14px;border-radius:10px;background:'+(p.manager?'#eef4ff':'#f6f8fa')+'">'+nucleoAvatarHtml(p.avatar)+'<strong>'+escapeHtml(parts.name)+'</strong>'+(p.self?' <span class="small">(você)</span>':'')+'<div class="small">'+(p.manager?'Gestor':escapeHtml(p.jobTitle||p.functionLabel||'Integrante da equipe'))+'</div>'+(p.jobTitle&&p.manager?'<div class="small">'+escapeHtml(p.jobTitle)+'</div>':'')+(p.workDescription?'<div class="small">'+escapeHtml(p.workDescription)+'</div>':'')+(parts.description?'<div class="small">'+escapeHtml(parts.description)+'</div>':'')+'</div>';}).join('')+'</div></section>').join('')||'<p>Nenhuma equipe disponível para esta seleção.</p>';
}

var nucleoAiScoreState;
function nucleoAiPanel(ro,tri){nucleoAiScoreState={ro:String(ro.numero||ro.id||ro.codigo||'').split('::')[0],origin:ro.origemBase||ro.raw?.__origemBase||'',assessment:tri?.scoreAssessment||null,roRecord:ro};document.getElementById('roAiScores').innerHTML='<div class="actions"><button class="btn secondary" type="button" onclick="nucleoAiSuggest(this)">Sugerir pontuação com IA</button><button class="btn secondary" type="button" onclick="nucleoAiManual(this)">Fazer manualmente</button><button class="btn secondary" type="button" onclick="nucleoAiOpenRoTab()">Abrir PDF da R.O. em outra aba</button><button class="btn secondary" type="button" onclick="nucleoAiRulesEditor()">Regras de pontuação</button></div><p class="small">Revise as seis notas antes de confirmar. A sugestão não altera a decisão da triagem.</p><div id="roAiScoreResult"></div>';if(nucleoAiScoreState.assessment)nucleoAiRenderAssessment(nucleoAiScoreState.assessment);}
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
 box.innerHTML='<div style="background:white;padding:24px;border-radius:12px;width:min(800px,95vw);max-height:90vh;overflow:auto"><h3>Regras de pontuação — IA</h3><div id="roAiRulesContent"></div><p id="roAiRulesStatus" role="status">Carregando regras da base central…</p><button class="btn secondary" onclick="document.getElementById(\'roAiRulesEditor\').remove()">Fechar</button></div>';
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
 const deliveries=Array.isArray(nucleoCentralPdcaDispatches)?nucleoCentralPdcaDispatches:[];const delivered=p=>deliveries.some(d=>d.ro===p.ro&&d.unit===explicitRecordUnit(p)&&(d.pdcaFileId&&d.pdcaFileId===p.pdcaFileId||d.fileId&&d.fileId===p.fileId)&&Number(d.version||1)===Number(p.version||1));
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

var nucleoAvatarDraft='';
var nucleoAvatarIcons={flower:'🌸',star:'⭐',fox:'🦊',cat:'🐱',robot:'🤖',sun:'☀️',leaf:'🍃',heart:'💜'};
function nucleoAvatarHtml(value){value=nucleoAvatarGalleryPreviews[value]||value;if(/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(value||'')&&value.length<=70000)return '<img alt="Foto de perfil" src="'+value+'" style="width:48px;height:48px;border-radius:50%;object-fit:cover;display:block;margin-bottom:8px">';const icon=nucleoAvatarIcons[String(value||'').replace('icon:','')];return '<span style="display:block;font-size:32px;margin-bottom:8px">'+(icon||'👤')+'</span>';}
function nucleoAvatarPreview(){document.getElementById('profileAvatarPreview').innerHTML=nucleoAvatarHtml(nucleoAvatarDraft);}
async function nucleoLoadAvatar(){const status=document.getElementById('profileAvatarStatus');try{const r=await portalJsonp({acao:'portal_profile_avatar'},60000);if(!r?.sucesso)throw new Error(r?.erro||'Falha na consulta do perfil.');document.getElementById('profileJobTitle').value=r.jobTitle||'';document.getElementById('profileWorkDescription').value=r.workDescription||'';nucleoAvatarDraft=r.avatar||'';nucleoAvatarGalleryPreviews[nucleoAvatarDraft]=r.preview||'';nucleoAvatarPreview();nucleoLoadAvatarGallery();document.getElementById('profileAvatarIcons').innerHTML=Object.entries(nucleoAvatarIcons).map(([key,icon])=>'<button type="button" class="btn secondary" aria-label="Escolher '+key+'" onclick="nucleoAvatarDraft=\'icon:'+key+'\';nucleoAvatarPreview()">'+icon+'</button>').join('');status.textContent='';}catch(e){status.textContent=e.message;}}
async function nucleoAvatarPhoto(input){const file=input.files?.[0];if(!file)return;const status=document.getElementById('profileAvatarStatus');try{if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>10000000)throw Error('Escolha uma foto JPG, PNG ou WebP de até 10 MB.');const url=URL.createObjectURL(file),img=new Image();try{await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(Error('Não foi possível ler a foto.'));img.src=url;});const canvas=document.createElement('canvas');canvas.width=canvas.height=256;const c=canvas.getContext('2d'),side=Math.min(img.width,img.height);c.fillStyle='#fff';c.fillRect(0,0,256,256);c.imageSmoothingQuality='high';c.drawImage(img,(img.width-side)/2,(img.height-side)/2,side,side,0,0,256,256);let data=canvas.toDataURL('image/jpeg',0.9);if(data.length>60000)data=canvas.toDataURL('image/jpeg',0.75);if(data.length>60000)throw Error('Escolha uma imagem menos complexa.');nucleoAvatarDraft=data;nucleoAvatarPreview();status.textContent='Foto preparada em melhor qualidade. Clique em Salvar foto ou ícone.';}finally{URL.revokeObjectURL(url);}}catch(e){status.textContent=e.message;}}
async function nucleoSaveAvatar(button){const status=document.getElementById('profileAvatarStatus');button.disabled=true;status.textContent='Salvando na base central…';try{let r;if(nucleoAvatarDraft.startsWith('data:')){const event='AV-'+Date.now()+'-'+Math.random().toString(36).slice(2);if(!portalPostForm({acao:'portal_profile_avatar',avatar:nucleoAvatarDraft,avatarEvent:event}))throw Error('Não foi possível enviar a foto.');for(let i=0;i<12;i++){await new Promise(resolve=>setTimeout(resolve,1500));try{const check=await portalJsonp({acao:'portal_profile_avatar'},15000);if(check?.avatarEvent===event){r=check;break;}}catch(_) {}}if(!r)throw Error('A confirmação demorou. Reabra o perfil para conferir se a foto foi salva.');}else r=await portalJsonp({acao:'portal_profile_avatar',avatar:nucleoAvatarDraft},60000);if(!r?.sucesso)throw new Error(r?.erro||'Não confirmado.');nucleoAvatarDraft=r.avatar;nucleoAvatarGalleryPreviews[r.avatar]=r.preview||'';nucleoAvatarPreview();setSession({...getSession(),avatar:r.avatar});const users=getOperationalUsers(),own=users.find(u=>getSession()?.personId?u.personId===getSession().personId:u.email===getSession()?.email);if(own){own.avatar=r.avatar;localStorage.setItem(USERS_KEY,JSON.stringify(users));}status.textContent='Foto ou ícone salvo.';}catch(e){status.textContent=e.message;}finally{button.disabled=false;}}

var nucleoAvatarGalleryPreviews={};
async function nucleoLoadAvatarGallery(offset=0){const host=document.getElementById('profileAvatarGallery');if(!host)return;host.textContent='Carregando galeria…';try{const r=await portalJsonp({acao:'portal_avatar_gallery',offset},60000);if(!r?.sucesso)throw new Error(r?.erro||'Galeria indisponível.');host.innerHTML='';if(!r.items.length){host.textContent='O SGQ ainda não disponibilizou imagens na galeria.';return;}const grid=document.createElement('div');grid.style.cssText='display:flex;flex-wrap:wrap;gap:12px;margin:12px 0';r.items.forEach(item=>{nucleoAvatarGalleryPreviews[item.value]=item.preview;const button=document.createElement('button');button.type='button';button.className='btn secondary';button.title=item.name;button.setAttribute('aria-label','Escolher '+item.name);button.innerHTML=nucleoAvatarHtml(item.preview);const label=document.createElement('span');label.textContent=item.name;label.style.cssText='display:block;max-width:100px;overflow:hidden;text-overflow:ellipsis';button.appendChild(label);button.onclick=()=>{nucleoAvatarDraft=item.value;nucleoAvatarPreview();document.getElementById('profileAvatarStatus').textContent='Avatar selecionado. Clique em Salvar foto ou ícone.';};grid.appendChild(button);});host.appendChild(grid);for(const [label,page] of [['Anterior',offset>=20?offset-20:null],['Próximas imagens',r.next]])if(page!==null){const btn=document.createElement('button');btn.type='button';btn.className='btn secondary';btn.textContent=label;btn.onclick=()=>nucleoLoadAvatarGallery(page);host.appendChild(btn);}}catch(e){host.textContent=e.message;}}
async function nucleoConfigureAvatarGallery(button){const status=document.getElementById('avatarGalleryConfigStatus');button.disabled=true;status.textContent='Salvando e conferindo a pasta…';try{const r=await portalJsonp({acao:'portal_avatar_gallery',folder:document.getElementById('avatarGalleryFolder').value.trim()},60000);if(!r?.sucesso)throw new Error(r?.erro||'Não confirmado.');status.textContent=r.folder?'Galeria salva. As imagens estão disponíveis em Meu perfil.':'Galeria desativada.';}catch(e){status.textContent=e.message;}finally{button.disabled=false;}}
async function nucleoReadAvatarGalleryConfig(){const box=document.getElementById('avatarGalleryConfig');if(!box)return;box.hidden=!nucleoPersonPermissions(getSession()).sgq;if(box.hidden)return;const field=document.getElementById('avatarGalleryFolder'),status=document.getElementById('avatarGalleryConfigStatus');try{const r=await portalJsonp({acao:'portal_avatar_gallery'},60000);if(r?.sucesso&&field)field.value=r.folder?'https://drive.google.com/drive/folders/'+r.folder:'';}catch(e){if(status)status.textContent=e.message;}}


















function nucleoOpenAvatarGalleryConfig(){if(!nucleoPersonPermissions(getSession()).sgq)return;openUnitDriveSettings();setTimeout(()=>{const box=document.getElementById('avatarGalleryConfig');if(!box)return;box.hidden=false;box.style.removeProperty('display');box.scrollIntoView({behavior:'smooth',block:'center'});nucleoReadAvatarGalleryConfig();},0);}




























var nucleoInlineTeamKey='',nucleoInlineTeamPromise=null,nucleoInlineTeamAt=0,nucleoInlineTeamData=[];
async function nucleoEnsureInlineTeam(){
 const page=document.getElementById('listView');if(!page)return;
 let box=document.getElementById('overviewTeam');if(!box){box=document.createElement('section');box.id='overviewTeam';box.className='overview-panel';box.style.marginTop='16px';box.innerHTML='<h3 style="margin:0 0 10px">Minha equipe</h3><div id="overviewTeamFilters" class="actions" style="align-items:center"></div><div id="overviewTeamPeople" role="status">Carregando equipe…</div>';page.appendChild(box);}
 const key=JSON.stringify([getSession()?.email,getSession()?.personId,getSession()?.name,getSession()?.token]);
 if(key===nucleoInlineTeamKey&&(nucleoInlineTeamPromise||Date.now()-nucleoInlineTeamAt<60000))return;
 nucleoInlineTeamKey=key;nucleoInlineTeamAt=0;document.getElementById('overviewTeamPeople').textContent='Carregando equipe…';
 const request=portalJsonp({acao:'portal_my_team'},60000);nucleoInlineTeamPromise=request;
 try{const result=await request;if(key!==nucleoInlineTeamKey)return;if(!result?.sucesso)throw Error(result?.erro||'Consulta não concluída.');nucleoInlineTeamData=result.teams||[];nucleoInlineTeamAt=Date.now();
 document.getElementById('overviewTeamFilters').innerHTML='<label>Setor <select id="overviewTeamSector" onchange="nucleoRenderInlineTeam(false)"><option value="all">Todos os meus setores</option>'+[...new Set(nucleoInlineTeamData.map(t=>t.sector))].map(t=>'<option value="'+escapeHtml(t)+'">'+escapeHtml(t)+'</option>').join('')+'</select></label><label>Unidade <select id="overviewTeamUnit" onchange="nucleoRenderInlineTeam(false)"><option value="all">Todas as minhas unidades</option>'+[...new Set(nucleoInlineTeamData.map(t=>t.unit))].map(t=>'<option value="'+escapeHtml(t)+'">'+(t==='filial'?'Filial — Linhares':'Matriz')+'</option>').join('')+'</select></label>';nucleoRenderInlineTeam(false);
 }catch(e){if(key===nucleoInlineTeamKey)document.getElementById('overviewTeamPeople').textContent='Não foi possível carregar a equipe. Clique em Atualizar para tentar novamente.';}finally{if(nucleoInlineTeamPromise===request)nucleoInlineTeamPromise=null;}
}
function nucleoUniqueTeamPeople(teams,sector,unit){
 const people=new Map();
 teams.filter(t=>(sector==='all'||t.sector===sector)&&(unit==='all'||t.unit===unit)).forEach(t=>{
  (t.people||[]).forEach(p=>{
   const key=p.personKey||p.personId||JSON.stringify([p.name,p.description||'']);
   let person=people.get(key);
   if(!person){person={...p,teamMemberships:[]};people.set(key,person);}
   person.manager=person.manager||p.manager;person.self=person.self||p.self;
   if(!person.teamMemberships.some(m=>m.sector===t.sector&&m.unit===t.unit))person.teamMemberships.push({sector:t.sector,unit:t.unit});
  });
 });
 return [...people.values()];
}
function nucleoRenderInlineTeam(expanded){
 const host=document.getElementById('overviewTeamPeople');if(!host)return;
 const sector=document.getElementById('overviewTeamSector')?.value||'all',unit=document.getElementById('overviewTeamUnit')?.value||'all';
 const people=nucleoUniqueTeamPeople(nucleoInlineTeamData,sector,unit);
 const width=host.clientWidth||window.innerWidth,columns=width<520?1:width<850?2:4,limit=columns*2;
 host.innerHTML='<div class="inline-team-grid">'+people.slice(0,expanded?people.length:limit).map(p=>{const parts=splitPersonNameDescription(p.name,p.description||undefined);return '<div class="inline-team-person" style="background:'+(p.manager?'#eef4ff':'#f6f8fa')+'">'+nucleoAvatarHtml(p.avatar)+'<div><strong>'+escapeHtml(parts.name)+'</strong>'+(p.self?' <span class="small">(você)</span>':'')+'<div class="small">'+(p.manager?'Gestor':escapeHtml(p.jobTitle||p.functionLabel||'Integrante'))+'</div><div class="small">'+escapeHtml(p.teamMemberships.map(m=>m.sector+' · '+(m.unit==='filial'?'Filial':'Matriz')).join(' / '))+'</div>'+(p.jobTitle&&p.manager?'<div class="small">'+escapeHtml(p.jobTitle)+'</div>':'')+(p.workDescription?'<div class="small">'+escapeHtml(p.workDescription)+'</div>':'')+(parts.description?'<div class="small">'+escapeHtml(parts.description)+'</div>':'')+'</div></div>';}).join('')+'</div>'+(people.length>limit?'<button class="btn secondary" style="margin-top:12px" onclick="nucleoRenderInlineTeam('+(!expanded)+')">'+(expanded?'Ver menos':'Ver mais')+'</button>':'')+(!people.length?'<p class="small">Nenhuma equipe disponível para esta seleção.</p>':'');
 const grid=host.querySelector('.inline-team-grid');grid.style.gridTemplateColumns='repeat('+columns+',minmax(0,1fr))';
}
window.addEventListener('resize',()=>{clearTimeout(window.nucleoTeamResizeTimer);window.nucleoTeamResizeTimer=setTimeout(()=>{if(document.getElementById('overviewTeamPeople'))nucleoRenderInlineTeam(false);},150);});

async function nucleoSaveProfessionalProfile(button){
 const status=document.getElementById('profileProfessionalStatus');button.disabled=true;status.textContent='Salvando na base central…';
 try{const jobTitle=document.getElementById('profileJobTitle').value.trim(),workDescription=document.getElementById('profileWorkDescription').value.trim();
 const r=await portalJsonp({acao:'portal_profile_avatar',profileDetails:JSON.stringify({jobTitle,workDescription})},60000);if(!r?.sucesso)throw Error(r?.erro||'Salvamento não confirmado.');setSession({...getSession(),jobTitle:r.jobTitle,workDescription:r.workDescription});nucleoInlineTeamAt=0;status.textContent='Cargo e descrição salvos.';
 }catch(e){status.textContent=e.message;}finally{button.disabled=false;}
}









function nucleoSystemFormat(kind,unit){try{return (JSON.parse(localStorage.getItem('nucleo-unit-configs')||'[]').find(x=>x.id===unit)?.documentFormats||{})[kind]||null}catch(e){return null}}
function nucleoApplySystemModelHtml(html,kind,unit){const model=nucleoSystemFormat(kind,unit);if(!model)return html;const root=document.createElement('div');root.innerHTML=html;
 const pairs=model.labels||[],walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;while(node=walker.nextNode()){if(['STYLE','SCRIPT'].includes(node.parentElement?.tagName))continue;const text=node.textContent.trim(),pair=pairs.find(x=>x.from===text);if(pair)node.textContent=node.textContent.replace(text,pair.to);}
 const heading=root.querySelector('h1,.pdca-doc-title');if(heading&&model.title)heading.textContent=model.title;
 if(model.fontSize)root.querySelectorAll('p,td,th,span,.pdca-answer').forEach(el=>el.style.fontSize=model.fontSize+'pt');
 if(model.footer){const footer=document.createElement('p');footer.textContent=model.footer;root.appendChild(footer);}return root.innerHTML;
}

function nucleoRoDisplayRows(rows,model){
 if(!model?.fields)return rows;
 const aliases={'Setor identificado':'Setor onde foi identificado','Setor causa/responsável':'Setor causa / responsável','Setor causa':'Setor causa / responsável','Liberado pelo setor da qualidade?':'Liberado pelo setor de qualidade?','Registro de quem liberou':'Quem liberou','Status planilha':'Status da planilha'};
 const canonical=label=>aliases[label]||label,bySource=new Map(rows.map(row=>[canonical(row[0]),row]));
 const selected=model.fields.filter(f=>f.enabled&&bySource.has(f.source)).map(f=>[f.label,bySource.get(f.source)[1]]),known=new Set(model.fields.map(f=>f.source));
 return selected.concat(rows.filter(row=>!known.has(canonical(row[0]))));
}









/* ================================================================
   CONTROLE DE FORNECEDORES — NÃO CONFORMIDADES
   Integração nativa do Núcleo. Perfis ficam em admin_modules como
   supplier_profile para usar a mesma base central, escopo e auditoria.
   ================================================================ */



















































































































































































window.NUCLEO_5S_ACCESS_CACHE = window.NUCLEO_5S_ACCESS_CACHE || {};





































































































































































































const __nucleo5sRenderScheduleOriginal=nucleo5sRenderSchedule;
nucleo5sRenderSchedule=function(host){ __nucleo5sRenderScheduleOriginal(host); nucleo5sLockSectorSelect('nucleo5sScheduleSector'); };
const __nucleo5sRenderActionsOriginal=nucleo5sRenderActions;
nucleo5sRenderActions=function(host){ __nucleo5sRenderActionsOriginal(host); nucleo5sLockSectorSelect('nucleo5sActionsSector'); };
const __nucleo5sRenderHistoryOriginal=nucleo5sRenderHistory;
nucleo5sRenderHistory=function(host){ __nucleo5sRenderHistoryOriginal(host); nucleo5sLockSectorSelect('nucleo5sHistorySector'); };
const __nucleo5sRenderCycleOriginal=nucleo5sRenderCycle;
nucleo5sRenderCycle=function(host){ __nucleo5sRenderCycleOriginal(host); nucleo5sLockSectorSelect('nucleo5sCycleSector'); };


/* ===== NÚCLEO 5S | VÍNCULOS MANUAIS DE AUDITORES ===== */
const NUCLEO_5S_AUDITOR_LINKS_KEY='nucleo-5s-auditor-links-v1';


































































































































































































































































































































document.addEventListener('DOMContentLoaded',()=>{
  try{nucleo5sEnsureAuditorLinkCard()}catch(e){}
});
