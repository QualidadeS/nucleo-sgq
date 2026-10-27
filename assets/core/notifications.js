/* NÚCLEO CORE: notifications | V3 TESTE | funções: 34 */

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

function splitNotificationEmails(value){
  return [...new Set(String(value||'').split(/[\n,;]+/).map(v=>v.trim()).filter(Boolean))];
}

function notificationEmailValue(value){
  return splitNotificationEmails(value).join(',');
}

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
  if(n?.type==='equipment'){
    return 'navEquipment';
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
  if(n.type==='equipment'){
    showAdminOperationalModule('equipment');
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

function notificationChannel(n){
  const c=getAdminConfig();
  let value='Portal';
  if(n?.type==='ro'&&(n?.audience==='sector'||n?.audience==='user'))value=c.channelRoSector||'Ambos';
  else if(n?.type==='contest'&&n?.audience==='sector')value=c.channelContestSector||'Ambos';
  else if(n?.type==='contest'&&n?.audience==='admin')value=c.channelContestAdmin||'Ambos';
  else if(n?.type==='pdca'&&n?.audience==='admin')value=c.channelPdcaAdmin||'Ambos';
  else if(n?.type==='action'||n?.type==='deadline')value=c.channelAction||'Portal';
  else if(n?.type==='announcement')value=c.channelAnnouncement||'Portal';
  else if(n?.type==='equipment')value='Ambos';
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
  if(n.type==='action'||n.type==='deadline'||n.type==='announcement'||n.type==='equipment')return true;
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
    id:data.id||('NOT-'+Date.now()+'-'+Math.random().toString(36).slice(2,7)),
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

function getCentralRepresentativeNotifications(){
  const out=[];
  getExternalRoControls().forEach(r=>{
    (Array.isArray(r?.representativeNotifications)?r.representativeNotifications:[]).forEach(n=>{
      out.push({...n,representative:n.representative||r.representative||r.officialForm?.representative||''});
    });
  });
  return out;
}

