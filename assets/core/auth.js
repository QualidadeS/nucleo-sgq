/* NÚCLEO CORE: auth | V3 TESTE | funções: 21 */

function nucleoParseSession(raw){
  if(raw===nucleoSessionLastRaw)return nucleoSessionMemory;
  const parsed=JSON.parse(raw);
  nucleoSessionLastRaw=raw;nucleoSessionMemory=parsed||null;
  return nucleoSessionMemory;
}

function getSession(){
  try{
    const raw=localStorage.getItem(SESSION_KEY);
    if(raw){const parsed=nucleoParseSession(raw);if(parsed)return parsed;}
  }catch(e){}
  try{
    const raw=sessionStorage.getItem(SESSION_KEY);
    if(raw){const parsed=nucleoParseSession(raw);if(parsed)return parsed;}
  }catch(e){}
  return nucleoSessionMemory;
}

function setSession(data){
  // A sessão de login nunca pode falhar só porque o localStorage está cheio/bloqueado.
  nucleoSessionMemory=data||null;
  const raw=JSON.stringify(data||null);
  nucleoSessionLastRaw=raw;
  let saved=false;
  try{localStorage.setItem(SESSION_KEY,raw);saved=true}catch(e){console.warn('localStorage da sessão indisponível:',e)}
  try{sessionStorage.setItem(SESSION_KEY,raw);saved=true}catch(e){console.warn('sessionStorage da sessão indisponível:',e)}
  return saved;
}

function refreshLoginSectorByUnit(){
  const unit=(document.getElementById('loginUnit')?.value||'').trim();
  const sector=document.getElementById('loginSector');
  if(!sector)return;

  const all=unit?nucleoPublicLoginSectors(normalizePortalUnit(unit)):[];
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

function renderLoginMessage(message, type='info'){
  const msg=document.getElementById('loginMessage');
  if(!msg)return;
  const palette={
    error:{bg:'#fff1f2',border:'#fecdd3',color:'#b42318'},
    success:{bg:'#ecfdf3',border:'#abefc6',color:'#067647'},
    info:{bg:'#eff8ff',border:'#b2ddff',color:'#175cd3'}
  };
  const c=palette[type]||palette.info;
  msg.textContent=String(message||'');
  msg.classList.toggle('hidden',!message);
  msg.style.background=c.bg;
  msg.style.border='1px solid '+c.border;
  msg.style.color=c.color;
}

function loginReasonMessage(remote){
  const code=String(remote?.errorCode||remote?.codigoErro||'').toUpperCase();
  const server=String(remote?.erro||remote?.message||'').trim();
  const byCode={
    USER_NOT_FOUND:'Cadastro não encontrado. Confira seu nome ou use “Cadastrar-se” se ainda não tiver acesso.',
    UNIT_MISMATCH:'A unidade selecionada não corresponde ao seu cadastro. Confira Matriz/Filial.',
    SECTOR_MISMATCH:'O setor selecionado não corresponde ao seu cadastro.',
    WRONG_PASSWORD:'Senha incorreta. Confira a senha e tente novamente.',
    PENDING:'Seu cadastro existe, mas ainda está aguardando aprovação do SGQ.',
    DISABLED:'Seu acesso está desativado. Procure o SGQ.',
    REJECTED:'Seu cadastro não foi aprovado pelo SGQ.',
    DUPLICATE:'Existe mais de um cadastro compatível. O SGQ precisa revisar os cadastros.'
  };
  return byCode[code]||server||'Não foi possível validar seu acesso.';
}

async function loginUser(){
  const name=(document.getElementById('loginName')?.value||'').trim();
  const unit=(document.getElementById('loginUnit')?.value||'').trim();
  const sector=(document.getElementById('loginSector')?.value||'').trim();
  const password=(document.getElementById('loginPassword')?.value||'');
  const msg=document.getElementById('loginMessage');
  const enterBtn=document.getElementById('loginEnterBtn');
  if(msg)msg.classList.remove('hidden');
  if(!name||!unit||!sector||!password){
    renderLoginMessage('Preencha nome, unidade, setor e senha antes de entrar.','error');
    return;
  }
  if(enterBtn)enterBtn.disabled=true;
  renderLoginMessage('Confirmando configuração central...','info');
  try{
    if(!nucleoPublicConfigReady){
      const publicOk=await syncPublicPortalConfig();
      if(!publicOk)throw new Error('Não foi possível confirmar a configuração central do Núcleo. Tente novamente.');
    }
    renderLoginMessage('Validando acesso...','info');
    const remote=await portalJsonp({
      acao:'portal_login_jsonp', nome:name, unidade:unit, setor:sector, senha:password
    },60000);
    if(!remote || remote.sucesso!==true){
      renderLoginMessage(loginReasonMessage(remote),'error');
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

    renderLoginMessage('','info');
    try{document.activeElement?.blur()}catch(e){}
    try{setSession(session)}catch(e){nucleoSessionMemory=session;console.warn('Sessão mantida em memória:',e)}

    // O cache pode aparecer imediatamente, mas ainda não é considerado dado atual.
    nucleoSetCentralSyncState('syncing','Login confirmado. Atualizando dados com a base central…');
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
    renderLoginMessage('Erro ao entrar: '+(e?.message||e),'error');
  }finally{
    if(enterBtn){enterBtn.disabled=false;enterBtn.textContent='Entrar';}
  }
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

function currentEmail(){
  const session=getSession();
  if(session?.email)return session.email.trim().toLowerCase();
  return '';
}

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

async function nucleoSyncAfterLogin(token){
 if(!token||getSession()?.authToken!==token)return;
 const status=document.getElementById('syncMsg');if(status)status.textContent='Atualizando dados da base central após o login…';
 let centralOk=false;
 try{centralOk=await syncPortalBackend(false);}catch(e){console.warn('Atualização central após login:',e);}
 if(getSession()?.authToken!==token)return;
 if(centralOk && (!getSession()?.permissions||nucleoPersonCan('ros'))){
   try{await refreshLegacyRoCacheFromApi(true);}catch(e){console.warn('Atualização de R.O.s após login:',e);}
 }
 if(getSession()?.authToken!==token)return;
 try{refreshSectorSelectors();populateTriageSectors();render();}catch(e){console.warn('Atualização da tela após login:',e);}
 if(status)status.textContent=centralOk?'Dados confirmados pela base central.':'Dados locais/cache — atualização central ainda não confirmada.';
}

function nucleoPublicLoginSectors(unit){
  try{const lists=JSON.parse(localStorage.getItem('nucleo-unit-public-sectors')||'{}');if(Object.prototype.hasOwnProperty.call(lists,unit)){const sectors=normalizeSectorList(lists[unit]);if(unit==='matriz'&&!sectors.some(s=>normalizeAnswer(s)==='sgq'))sectors.push('SGQ');return sectors;}}catch(_){}
  const own=unitConfiguration(unit);return own?normalizeSectorList(own.sectorList):[];
}

