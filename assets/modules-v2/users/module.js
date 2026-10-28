/* NÚCLEO MODULE: users | v2.0.0-test | funções migradas: 40 */

function pendingRegistrationItems(){
  if(!isAdmin())return [];
  return getOperationalUsers()
    .filter(u=>!nucleoPersonPermissions(u).sgq&&u.approvalStatus==='pending')
    .sort((a,b)=>String(a.createdAt||'').localeCompare(String(b.createdAt||'')));
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

function nucleoCurrentUserRecord(){
  const sess=getSession()||{},mail=String(sess.email||'').trim().toLowerCase(),name=String(sess.name||'').trim().toLowerCase();
  let list=[];
  try{ list=typeof getOperationalUsers==='function'?(getOperationalUsers()||[]):[]; }catch(e){ console.warn('Núcleo: não foi possível ler usuários locais para a preferência de metrologia.',e); }
  return list.find(u=>
    (sess.personId&&String(u.personId||'')===String(sess.personId))||
    (mail&&String(u.email||'').trim().toLowerCase()===mail)||
    (name&&String(u.name||'').trim().toLowerCase()===name&&String(u.role||'').toLowerCase()===String(sess.role||'').toLowerCase())
  )||null;
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

    const remote=nucleoApplyUserLoginStatusGuards(Array.isArray(res.users)?res.users:[]);
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
          ${(()=>{const s=nucleoUserLoginState(u);return `<span class="status-badge ${s.className}" style="margin-left:6px">${escapeHtml(s.label)}</span>`})()}
          ${u.role==='manager'||(u.managedSectors||[]).length?`<div class="small" style="margin-top:4px"><b>Gerencia:</b> ${escapeHtml((u.managedSectors||[]).join(', ')||'Nenhum setor')}</div>`:''}
        </div>
      </div>
      ${nucleoPersonCan('users',true)?`<button class="btn secondary" type="button" onclick="openUnitUserAccess('${encodeURIComponent(u.personId||u.email||u.name)}')">Editar acesso</button>`:''}
      <div class="actions">
        <button class="btn secondary" type="button" onclick="openManagerSectorsEditor('${escapeHtml(u.email||u.name)}')">Editar gestão</button>
        <button class="btn secondary" type="button" onclick="openUserRegistrationEditor('${escapeHtml(u.email||u.name)}')">Editar cadastro</button>
        <button class="btn secondary" type="button" onclick="openAdminResetPassword('${escapeHtml(u.email||u.name)}')">Redefinir senha</button>
        ${u.approvalStatus!=='pending'&&u.approvalStatus!=='rejected'
          ? `<button id="userLoginToggle_${btoa(unescape(encodeURIComponent(String(u.email||u.name)))).replace(/=+$/,'')}" class="btn secondary" type="button" onclick="toggleOperationalUserLogin('${escapeHtml(u.email||u.name)}')">${nucleoUserLoginState(u).active?'Desativar login':'Ativar login'}</button>`
          : ''}
        <button class="remove-admin" type="button" onclick="removeOperationalUserByKey('${escapeHtml(u.email||u.name)}')">Excluir login</button>
      </div>
    </div>`).join(''):'';

  box.innerHTML=filtered.length?pendingHtml+approvedHtml+(users.length<filtered.length?'<div class="actions"><button class="btn secondary" type="button" onclick="showMoreOperationalUsers()">Mostrar mais 5</button></div>':''):'<div class="small">Nenhum cadastro encontrado com estes filtros.</div>';
  box.querySelectorAll('.admin-user-row').forEach(row=>{const button=row.querySelector("button[onclick^='openUnitUserAccess']"),actions=row.querySelector('.actions');if(button&&actions)actions.prepend(button);});
}

function nucleoUserLoginState(u){
  const approval=String(u?.approvalStatus||'approved').trim().toLowerCase();
  const status=String(u?.status||'').trim().toLowerCase();
  const inactive=u?.active===false || approval==='inactive' || approval==='disabled' || status==='inactive' || status==='disabled';
  if(inactive)return {active:false,label:'Desativado',className:'rejected'};
  if(approval==='pending')return {active:false,label:'Aguardando aprovação',className:'pending'};
  if(approval==='rejected')return {active:false,label:'Recusado',className:'rejected'};
  return {active:true,label:'Ativo',className:'approved'};
}

function nucleoRememberUserLoginStatus(key,status){
  const k=String(key||'').trim().toLowerCase();
  if(!k)return;
  window.__nucleoUserLoginStatusGuard[k]={
    status:String(status||'').trim().toLowerCase(),
    until:Date.now()+60000
  };
}

function nucleoApplyUserLoginStatusGuards(users){
  const now=Date.now();
  const guards=window.__nucleoUserLoginStatusGuard||{};
  Object.keys(guards).forEach(k=>{
    if(!guards[k] || guards[k].until<=now)delete guards[k];
  });

  return (users||[]).map(u=>{
    const keys=[
      String(u?.email||'').trim().toLowerCase(),
      String(u?.name||'').trim().toLowerCase()
    ].filter(Boolean);

    const guard=keys.map(k=>guards[k]).find(Boolean);
    if(!guard)return u;

    const active=guard.status==='approved';
    return {
      ...u,
      approvalStatus:guard.status,
      active,
      status:active?'active':'inactive'
    };
  });
}

async function toggleOperationalUserLogin(key){
  if(!nucleoFeatureRequire('users','approve'))return;
  if(!isAdmin())return;

  const users=getOperationalUsers();
  const idx=users.findIndex(u=>String(u.email||u.name)===String(key));
  if(idx<0){alert('Usuário não encontrado.');return}

  const user=users[idx];
  const currentEmail=String(getSession()?.email||'').trim().toLowerCase();
  const targetEmail=String(user.email||'').trim().toLowerCase();

  if(targetEmail && targetEmail===currentEmail){
    alert('Você não pode desativar o login da conta que está usando.');
    return;
  }

  const state=nucleoUserLoginState(user);
  const next=state.active?'inactive':'approved';
  const action=state.active?'desativar':'ativar';

  if(!confirm(`Deseja ${action} o login de ${user.name||user.email||'este usuário'}?`))return;

  const original={...user};
  const now=new Date().toISOString();

  users[idx]={
    ...user,
    approvalStatus:next,
    active:next==='approved',
    status:next==='approved'?'active':'inactive',
    updatedAt:now,
    ...(next==='approved'
      ? {reactivatedAt:now,reactivatedBy:getSession()?.name||'SGQ'}
      : {disabledAt:now,disabledBy:getSession()?.name||'SGQ'})
  };

  const button=document.getElementById('userLoginToggle_'+btoa(unescape(encodeURIComponent(String(key)))).replace(/=+$/,''));
  if(button)button.disabled=true;

  try{
    if(portalBackendEnabled()){
      const res=await portalJsonp({
        acao:'portal_update_user_status',
        userId:String(user.email||user.name),
        status:next,
        ator:getSession()?.name||'SGQ'
      },25000);

      if(!res?.sucesso)throw new Error(res?.erro||'A base central não confirmou a alteração.');

      // A própria rota portal_update_user_status grava o cadastro e devolve o
      // status efetivamente salvo. Não fazemos uma segunda leitura imediata,
      // porque a coleção central pode levar alguns segundos para refletir a
      // alteração e isso gerava falso erro de confirmação.
      const confirmedStatus=String(res.approvalStatus||next).trim().toLowerCase();
      if(confirmedStatus!==next){
        throw new Error('A base central confirmou um status diferente do solicitado.');
      }
      nucleoRememberUserLoginStatus(user.email||user.name,next);
    }

    localStorage.setItem(USERS_KEY,JSON.stringify(users));
    claimantIdentityCache=null;
    renderOperationalUsers();
    try{renderAdminUsers()}catch(e){}
    try{nucleo5sPopulateLinkUsers?.(true)}catch(e){}
    addPortalAuditEvent(next==='approved'?'ativar_login_usuario':'desativar_login_usuario',
      user.email||user.name,
      {name:user.name,email:user.email,status:next}
    );

  }catch(e){
    users[idx]=original;
    localStorage.setItem(USERS_KEY,JSON.stringify(users));
    renderOperationalUsers();
    alert('Não foi possível '+action+' o login: '+(e.message||e));
  }
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

function activeOperationalUsers(){
  let contacts=[];try{contacts=JSON.parse(localStorage.getItem('nucleo-unit-contacts')||'[]');}catch(_){}
  return [...new Map(getOperationalUsers().concat(contacts).map(u=>[String(u.email||u.name||'').trim().toLowerCase(),u])).values()].filter(u=>
    u &&
    u.active!==false &&
    normalizeAnswer(u.active||'sim')!=='nao' &&
    normalizeAnswer(u.status||'')!=='inactive' &&
    u.approvalStatus!=='pending' &&
    u.approvalStatus!=='rejected' &&
    u.approvalStatus!=='inactive' &&
    u.approvalStatus!=='disabled' &&
    String(u.name||'').trim() &&
    String(u.email||'').trim()
  );
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

function openUnitUserAccess(encoded){
 if(!nucleoPersonFeatureCan('users','permissions'))return;
 const id=decodeURIComponent(encoded),user=getOperationalUsers().find(u=>String(u.personId||u.email||u.name)===id);if(!user)return;
 const parent=nucleoPersonPermissions(getSession()),perms=nucleoPersonPermissions(user),units=nucleoPersonUnits(user),allowed=nucleoPersonUnits(getSession());
 if(!parent.sgq&&(user.role==='admin'||units.some(u=>!allowed.includes(u)))){alert('Este cadastro é administrado pelo SGQ.');return;}
 let overlay=document.getElementById('unitUserAccess');overlay?.remove();overlay=document.createElement('div');overlay.id='unitUserAccess';overlay.style.cssText='position:fixed;inset:0;background:#0008;z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px';
 overlay.innerHTML='<div style="background:white;padding:24px;border-radius:12px;max-width:760px;width:100%;max-height:90vh;overflow:auto"><h3>Editar acesso — '+escapeHtml(user.name)+'</h3><p>Escolha as unidades e marque somente as funções permitidas dentro de cada área.</p><div id="personAccessUnits">'+['matriz','filial'].map(u=>'<label style="display:inline-flex;gap:8px;margin:10px"><input type="checkbox" value="'+u+'" '+(units.includes(u)?'checked':'')+' '+(!allowed.includes(u)?'disabled':'')+' style="width:20px;height:20px">'+(u==='matriz'?'SETA SC — Matriz':'SETA ES — Linhares')+'</label>').join('')+'</div>'+nucleoFeatureEditor(user,getSession())+'<p><label><input id="personRegisterRo" type="checkbox" '+(perms.registerRo?'checked':'')+' '+(!parent.sgq&&!parent.registerRo?'disabled':'')+' style="width:20px;height:20px"> Cadastrar R.O. interna</label></p><p><label><input id="personRegisterExternal" type="checkbox" '+(perms.registerExternal?'checked':'')+' '+(!parent.sgq&&!parent.registerExternal?'disabled':'')+' style="width:20px;height:20px"> Cadastrar R.O. externa / SAC</label></p>'+(parent.sgq?'<p><label><input id="personSgq" type="checkbox" '+(perms.sgq?'checked':'')+' style="width:20px;height:20px"> Administração geral SGQ — todas as permissões, integração e configurações globais</label><div class="small" style="margin:5px 0 0 30px">Ao desmarcar esta opção e salvar, o perfil SGQ será removido. A pessoa volta ao acesso do próprio setor; se tiver setores sob gestão, permanece como Gestor.</div></p><details><summary>Setores unificados</summary><p class="small">Um vínculo por linha: matriz | PCP ou filial | PCP.</p><textarea id="unitAccessMemberships" rows="4"></textarea></details>':'')+'<p class="small">O cadastro e o e-mail continuam únicos. A alteração exige novo login da pessoa para atualizar seu acesso.</p><button class="btn primary" id="unitAccessSave">Salvar permissões</button> <button class="btn secondary" id="unitAccessClose">Fechar</button><p id="unitAccessStatus" role="status"></p></div>';
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
   const removeSgq=perms.sgq===true && next.sgq!==true;
   const result=await portalJsonp({
     acao:'portal_set_user_access',
     person:id,
     permissions:JSON.stringify(next),
     accessUnits:JSON.stringify(accessUnits),
     memberships:JSON.stringify(memberships),
     removeSgq:removeSgq?'1':'0'
   },60000);
   if(!result?.sucesso)throw new Error(result?.erro||'A base central não confirmou a alteração.');
   status.textContent='Permissões salvas na base central. A pessoa deve entrar novamente.';await syncPortalBackend(false);renderOperationalUsers();
  }catch(e){status.textContent='Não foi possível salvar: '+(/perfil inv[aá]lido/i.test(e.message)?'A implantação do Apps Script ainda usa a versão antiga dos perfis. Atualize o código e publique uma nova versão na implantação existente.':e.message);}finally{btn.disabled=false;}
 };
}

function nucleoPersonPermissions(user){
 if(user.permissions?.version===1)return user.permissions;
 const elevated=['admin','quality'].includes(user.role),modules={};Object.keys(NUCLEO_PERSON_MODULES).forEach(k=>modules[k]={view:elevated||['ros','pdca','sac'].includes(k),manage:elevated});
 if(!elevated){
   if(!modules.documents)modules.documents={view:false,manage:false};
   modules.documents.view=['comercial interno','comercial externo','diretoria','sgq'].includes(normalizeAnswer(user.sector||''));
 }
 return {version:1,modules,registerRo:user.role!=='admin',registerExternal:user.role==='quality'||['comercial interno','comercial externo','diretoria','processos','sgq'].includes(normalizeAnswer(user.sector||'')),sgq:user.role==='admin'};
}

function nucleoPersonCan(module,manage=false){const user=getSession();if(!user)return false;const p=nucleoPersonPermissions(user);return !!(p.sgq||p.modules[module]?.[manage?'manage':'view']);}

function nucleoPersonFeatureAllowed(user,module,feature){
 if(!user)return false;
 const p=nucleoPersonPermissions(user),definition=NUCLEO_PERSON_FEATURES[module]?.[feature];if(!definition)return false;
 if(p.sgq)return true;
 if(p.detailVersion===1)return p.features?.[module]?.[feature]===true;
 return p.modules[module]?.[definition[2]]===true;
}

function nucleoPersonFeatureCan(module,feature){return nucleoPersonFeatureAllowed(getSession(),module,feature);}

function nucleoVisibleManagerSectors(manager,managed,available){return [...new Set((manager?managed:available).map(x=>String(x||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR'));}

