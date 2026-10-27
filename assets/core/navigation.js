/* NÚCLEO CORE: navigation | V3 TESTE | funções: 8 */

function sideModuleState(){try{return JSON.parse(localStorage.getItem(SIDE_MODULE_STATE_KEY)||'{}')||{}}catch(e){return {}}}

function setSideModuleOpen(id,open,persist=true){const el=document.getElementById(id);if(!el)return;el.classList.toggle('open',!!open);if(persist){const s=sideModuleState();s[id]=!!open;safeStorageSet(SIDE_MODULE_STATE_KEY,JSON.stringify(s));}}

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
  ['navRos','navNewRo','navNewExternalRo','navMySubmittedRos','navAssignedRos','navSent','navActions','navPendingHub','navDocumentRequests','navProfile','navTriage','navExternalRoControl','navMySacs','navContests','navIndicators','navPendingActions','navAnnouncements','navEquipment','navTraining','navNcCapa','navDocuments','navProcesses','navAudit5s','navAdmin'].forEach(function(id){
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
    audit5s:'navAudit5s',
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
      audit5s:'Auditoria 5S',
      admin:'Administração'
    };
    crumb.textContent=labels[which] || 'Minhas R.O.s';
  }
}

