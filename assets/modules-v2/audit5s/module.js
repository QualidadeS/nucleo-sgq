/* NÚCLEO MODULE: audit5s | v2.0.0-test | funções migradas: 25 */

function nucleo5sAccessCacheKey(unit,month){
  return String(unit||'matriz')+'|'+String(month||'');
}

async function nucleo5sGetAccess(force=false,month=''){
  const now=new Date();
  const m=month || (now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0'));
  const key=nucleo5sAccessCacheKey(nucleo5sCurrentUnit,m);
  if(!force && window.NUCLEO_5S_ACCESS_CACHE[key]) return window.NUCLEO_5S_ACCESS_CACHE[key];
  const data=await nucleo5sBackend('nucleo_5s_access',{month:m});
  if(!data?.sucesso) throw new Error(data?.erro||'Não foi possível validar o acesso ao 5S.');
  window.NUCLEO_5S_ACCESS_CACHE[key]=data;
  return data;
}

function nucleo5sEquivalentSectorClient(a,b){
  const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[º°ª]/g,'').replace(/[^a-z0-9]+/g,'').trim();
  const alias=v=>{
    const n=norm(v);
    const m={
      mecanica:'manutencao',manutencao:'manutencao',mecanicamanutencao:'manutencao',manutencaomecanica:'manutencao',
      clicheria:'clicheria',clicheriasaladetintas:'clicheria',
      recebimento:'recebimentoalmoxarifado',almoxarifado:'recebimentoalmoxarifado',recebimentoalmoxarifado:'recebimentoalmoxarifado',
      servicosgerais:'servicosgerais',servicosgeraiscozinhaelimpeza:'servicosgerais',
      administrativorh:'administrativorh',rh:'administrativorh'
    };
    return m[n]||n;
  };
  const x=alias(a),y=alias(b);
  if(!x||!y)return false;
  if(x===y)return true;
  return Math.min(x.length,y.length)>=6&&(x.includes(y)||y.includes(x));
}

function nucleo5sCurrentAccess(){
  const now=new Date();
  const m=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0');
  return window.NUCLEO_5S_ACCESS_CACHE[nucleo5sAccessCacheKey(nucleo5sCurrentUnit,m)]||null;
}

function nucleo5sApplyHubAccess(access){
  try{nucleo5sEnsureAuditorLinkCard?.()}catch(e){}
  const auditButton=document.querySelector("#audit5sHubCards [onclick=\"nucleo5sShowPanel('audit')\"]");
  if(auditButton) auditButton.style.display=access?.canAudit?'':'none';
  const tutorialButton=document.querySelector("#audit5sHubCards [onclick=\"nucleo5sShowPanel('tutorial')\"]");
  if(tutorialButton) tutorialButton.style.display=(access?.canAudit||access?.canSeeAllResults)?'':'none';
  const switcher=document.getElementById('audit5sUnitSwitcher');
  if(switcher) switcher.style.display=isAdmin()?'flex':'none';
}

async function nucleoOpen5SUnit(unit){
  unit=unit==='filial'?'filial':'matriz';
  nucleo5sCurrentUnit=unit;
  nucleo5sSetUnitButtons(unit);
  try{
    const access=await nucleo5sGetAccess(true);
    nucleo5sApplyHubAccess(access);
    nucleo5sShowPanel('home');
  }catch(e){
    const host=document.getElementById('audit5sPanel');
    if(host)host.innerHTML='<div class="notice danger">Não foi possível validar seu acesso ao 5S: '+escapeHtml(e.message||String(e))+'</div>';
  }
}

async function showAudit5S(){
  view('audit5sView');
  setNav('audit5s');
  nucleo5sCurrentUnit=nucleo5sSessionUnit();
  nucleo5sSetUnitButtons(nucleo5sCurrentUnit);
  nucleo5sConfigReady();

  const host=document.getElementById('audit5sPanel');
  if(host)host.innerHTML='<div class="small" style="padding:8px 2px">Validando seu acesso ao 5S...</div>';

  try{nucleo5sEnsureAuditorLinkCard?.()}catch(e){}

  try{
    const timeout=new Promise((_,reject)=>setTimeout(
      ()=>reject(new Error('A base do 5S não respondeu em até 12 segundos.')),
      12000
    ));
    const access=await Promise.race([nucleo5sGetAccess(true),timeout]);
    nucleo5sApplyHubAccess(access);
    await nucleo5sShowPanel('home');
  }catch(e){
    if(host)host.innerHTML=
      '<div class="notice danger"><b>O Centro 5S abriu, mas a validação de acesso não respondeu.</b><br>'+
      escapeHtml(e.message||String(e))+
      '<br><br>O restante do Núcleo continua disponível.</div>';
  }

  window.scrollTo({top:0,behavior:'instant'});
}

async function nucleo5sShowPanel(panel){
  const host=document.getElementById('audit5sPanel');
  if(!host)return;

  if(panel==='auditor-links'){
    return nucleo5sRenderAuditorLinks(host);
  }

  let access;
  try{ access=await nucleo5sGetAccess(false); }
  catch(e){ host.innerHTML='<div class="notice danger">Não foi possível validar seu acesso ao 5S: '+escapeHtml(e.message||String(e))+'</div>'; return; }

  if(panel==='home'){
    nucleo5sApplyHubAccess(access);
    const auditInfo=access.canAudit
      ? 'Você está escalado(a) neste mês para: <b>'+access.auditSectors.map(escapeHtml).join(', ')+'</b>.'
      : 'Você não está escalado(a) como auditor(a) neste mês.';
    const resultInfo=access.canSeeAllResults
      ? 'Você possui visão administrativa dos resultados desta unidade.'
      : 'Resultados disponíveis somente para: <b>'+access.resultSectors.map(escapeHtml).join(', ')+'</b>.';
    host.innerHTML='<div class="small" style="padding:8px 2px">'+auditInfo+'<br>'+resultInfo+'</div>';
    return;
  }

  if(panel==='audit'){
    if(!access.canAudit){
      host.innerHTML='<div class="notice">A opção de realizar auditoria fica disponível somente para os auditores escalados no cronograma do mês.</div>';
      return;
    }
    return nucleo5sRenderAudit(host,access);
  }
  if(panel==='tutorial')return nucleo5sRenderTutorial(host);
  if(panel==='schedule')return nucleo5sRenderSchedule(host);
  if(panel==='actions')return nucleo5sRenderActions(host);
  if(panel==='history')return nucleo5sRenderHistory(host);
  if(panel==='cycle')return nucleo5sRenderCycle(host);
}

function nucleo5sRestrictAuditIframe(frame,access){
  try{
    const doc=frame.contentDocument||frame.contentWindow?.document;
    if(!doc)return;
    const allowed=Array.isArray(access?.auditSectors)?access.auditSectors:[];
    const sector=doc.getElementById('setor');
    if(sector){
      [...sector.options].forEach(opt=>{
        if(!opt.value)return;
        const ok=allowed.some(a=>nucleo5sEquivalentSectorClient(opt.value,a));
        if(!ok)opt.remove();
      });
      if(allowed.length===1){
        const match=[...sector.options].find(o=>o.value&&nucleo5sEquivalentSectorClient(o.value,allowed[0]));
        if(match){ sector.value=match.value; sector.disabled=true; try{frame.contentWindow.aoMudarSetor?.()}catch(_){} }
      }
    }
    const a1=doc.getElementById('auditor1');
    const a2=doc.getElementById('auditor2');
    if(a1)a1.readOnly=true;
    if(a2)a2.readOnly=true;
    if(sector && allowed.length>1)sector.disabled=false;
    frame.dataset.nucleo5sRestricted='1';
  }catch(e){ console.error('Falha ao restringir formulário 5S:',e); }
}

function nucleo5sRenderAudit(host,access){
  if(!nucleo5sConfigReady())return;
  access=access||nucleo5sCurrentAccess();
  if(!access?.canAudit){ host.innerHTML='<div class="notice">Você não está escalado(a) como auditor(a) neste mês.</div>'; return; }
  const cfg=nucleo5sConfig(nucleo5sCurrentUnit);
  const src=new URL(cfg.page,document.baseURI);
  src.searchParams.set('embedded','1');
  src.searchParams.set('config',cfg.url);
  src.searchParams.set('nucleoUnit',nucleo5sCurrentUnit);
  const session=getSession()||{};
  if(session.name)src.searchParams.set('auditor',String(session.name));
  host.innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px">
      <div>
        <h3 style="margin:0">Realizar auditoria 5S</h3>
        <div class="small">${escapeHtml(nucleo5sUnitLabel(nucleo5sCurrentUnit))}</div>
        <div class="small" style="margin-top:4px">Setor(es) atribuídos: <b>${access.auditSectors.map(escapeHtml).join(', ')}</b></div>
      </div>
      <button class="btn secondary" type="button" onclick="nucleo5sShowPanel('home')">Voltar</button>
    </div>
    <iframe id="audit5sFrame" title="Auditoria 5S" src="${escapeHtml(src.toString())}" style="width:100%;height:calc(100vh - 205px);min-height:760px;border:1px solid var(--line);border-radius:12px;background:#fff"></iframe>`;
  const frame=document.getElementById('audit5sFrame');
  if(frame)frame.addEventListener('load',()=>nucleo5sRestrictAuditIframe(frame,access));
}

function nucleo5sLockSectorSelect(selectId){
  const el=document.getElementById(selectId);
  const access=nucleo5sCurrentAccess();
  if(!el||!access||access.canSeeAllResults)return;
  const allowed=Array.isArray(access.resultSectors)?access.resultSectors:[];
  [...el.options].forEach(opt=>{ if(opt.value&&!allowed.some(a=>nucleo5sEquivalentSectorClient(opt.value,a)))opt.remove(); });
  if(allowed.length===1){
    const match=[...el.options].find(o=>o.value&&nucleo5sEquivalentSectorClient(o.value,allowed[0]));
    if(match)el.value=match.value;
    el.disabled=true;
  }
}

function nucleo5sLinkNorm(v){
  return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase().replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim();
}

function nucleo5sIsLinkAdmin(){
  return ['admin','quality'].includes(String(getSession()?.role||'').trim().toLowerCase());
}

function nucleo5sReadAuditorLinks(){
  try{
    const data=JSON.parse(localStorage.getItem(NUCLEO_5S_AUDITOR_LINKS_KEY)||'[]');
    return Array.isArray(data)?data:[];
  }catch(e){return []}
}

function nucleo5sUserKeyForLink(u){
  return String(u?.personId||u?.email||u?.name||'').trim();
}

function nucleo5sUserMatchesUnitForLink(u,unit){
  const raw=String(u?.unit||'').toLowerCase();
  if(raw.includes('todas'))return true;
  try{return explicitPortalUnit(u?.unit)===unit}catch(e){}
  return unit==='filial'
    ? raw.includes('filial')||raw.includes('linhares')
    : raw.includes('matriz')||raw.includes('são bento')||raw.includes('sao bento');
}

function nucleo5sEnsureAuditorLinkCard(){
  const cards=document.getElementById('audit5sHubCards');
  if(!cards)return;

  const existing=document.getElementById('audit5sAuditorLinksBtn');

  if(!nucleo5sIsLinkAdmin()){
    if(existing)existing.remove();
    return;
  }
  if(existing)return;

  const btn=document.createElement('button');
  btn.id='audit5sAuditorLinksBtn';
  btn.className='card';
  btn.type='button';
  btn.style.cssText='text-align:left;padding:16px;cursor:pointer';
  btn.onclick=()=>nucleo5sShowPanel('auditor-links');
  btn.innerHTML='<div class="overview-eyebrow">VÍNCULOS</div><h3 style="margin:6px 0">Vincular auditores</h3><div class="small">Relacione o nome do cronograma ao usuário correto do Núcleo.</div>';
  cards.appendChild(btn);
}

async function nucleo5sSaveAuditorLinks(links){
  if(!nucleo5sIsLinkAdmin())throw new Error('Acesso restrito ao SGQ.');
  if(!nucleoCentralDataConfirmed())throw new Error('A base central ainda não terminou a sincronização.');

  const record={
    id:'global:'+NUCLEO_5S_AUDITOR_LINKS_KEY,
    key:NUCLEO_5S_AUDITOR_LINKS_KEY,
    value:JSON.stringify(links||[]),
    scope:'global',
    userKey:'',
    updatedAt:new Date().toISOString(),
    updatedBy:getSession()?.name||'SGQ'
  };

  const timeout=new Promise((_,reject)=>setTimeout(
    ()=>reject(new Error('A base demorou mais de 15 segundos para confirmar o vínculo.')),
    15000
  ));

  await Promise.race([
    portalBackendSaveConfirmed('shared_state',record.id,record),
    timeout
  ]);

  nucleoNativeStorageSetItem.call(localStorage,NUCLEO_5S_AUDITOR_LINKS_KEY,record.value);
  window.NUCLEO_5S_ACCESS_CACHE={};
}

function nucleo5sCurrentLinkUsers(){
  // Usa exatamente a mesma fonte da tela Administração > Usuários.
  // Não aplica filtro extra de status/unidade, para que qualquer cadastro
  // exibido na administração também possa ser localizado para vínculo 5S.
  return (getOperationalUsers()||[])
    .filter(u=>String(u.name||u.email||'').trim())
    .sort((a,b)=>String(a.name||'').localeCompare(String(b.name||''),'pt-BR'));
}

async function nucleo5sPopulateLinkUsers(forceRemote=false){
  const select=document.getElementById('nucleo5sLinkUser');
  if(!select)return;

  const previous=String(select.value||'');
  const localUsers=nucleo5sCurrentLinkUsers();
  const map=new Map();

  localUsers.forEach(u=>{
    const key=String(u.email||u.personId||u.name||'').trim().toLowerCase();
    if(key)map.set(key,u);
  });

  // A lista de vínculo 5S precisa refletir a base central real de cadastros.
  // portal_pending_users já é a rota usada pela administração para atualizar usuários.
  if(portalBackendEnabled()){
    try{
      if(forceRemote || !window.__nucleo5sRemoteUsersAt || Date.now()-window.__nucleo5sRemoteUsersAt>30000){
        const timeout=new Promise((_,reject)=>setTimeout(
          ()=>reject(new Error('A base de usuários demorou para responder.')),
          20000
        ));
        const res=await Promise.race([
          portalJsonp({acao:'portal_pending_users'},20000),
          timeout
        ]);

        if(res?.sucesso!==false){
          const remote=nucleoApplyUserLoginStatusGuards(Array.isArray(res?.users)?res.users:[]);
          remote.forEach(u=>{
            const key=String(u.email||u.personId||u.name||'').trim().toLowerCase();
            if(!key)return;
            const existing=map.get(key)||{};
            map.set(key,{...existing,...u});
          });

          window.__nucleo5sRemoteUsersAt=Date.now();

          // Atualiza também o cache oficial local para manter consistência com Administração > Usuários.
          try{
            const merged=[...map.values()];
            nucleoNativeStorageSetItem.call(localStorage,USERS_KEY,JSON.stringify(merged));
          }catch(e){}
        }
      }
    }catch(e){
      console.warn('Falha ao atualizar usuários para vínculo 5S:',e);
    }
  }

  const users=[...map.values()]
    .filter(u=>String(u.name||u.email||'').trim())
    .sort((a,b)=>String(a.name||'').localeCompare(String(b.name||''),'pt-BR'));

  select.innerHTML='<option value="">Selecione a pessoa...</option>'+
    users.map(u=>{
      const key=nucleo5sUserKeyForLink(u);
      const label=[u.name,u.sector,u.email].filter(Boolean).join(' · ');
      return '<option value="'+escapeHtml(key)+'">'+escapeHtml(label)+'</option>';
    }).join('');

  if(previous && [...select.options].some(o=>o.value===previous)){
    select.value=previous;
  }

  const counter=document.getElementById('nucleo5sLinkPeopleCount');
  if(counter)counter.textContent=users.length+' pessoa(s) carregada(s) da base do Núcleo.';
}

function nucleo5sRenderAuditorLinks(host){
  if(!host)return;

  if(!nucleo5sIsLinkAdmin()){
    host.innerHTML='<div class="notice">Somente o SGQ pode editar os vínculos.</div>';
    return;
  }

  const unit=nucleo5sCurrentUnit;
  const links=nucleo5sReadAuditorLinks().filter(x=>x.unit===unit);
  const users=nucleo5sCurrentLinkUsers();

  const rows=links.length
    ? '<div style="overflow:auto;margin-top:18px"><table><thead><tr><th>Nome no cronograma</th><th>Usuário Núcleo</th><th></th></tr></thead><tbody>'+
      links.map(x=>'<tr><td><b>'+escapeHtml(x.scheduleName||'-')+'</b></td><td>'+
        escapeHtml([x.userName,x.email].filter(Boolean).join(' · '))+
        '</td><td><button class="btn secondary" type="button" onclick="nucleo5sRemoveAuditorLink('+JSON.stringify(x.scheduleName||'')+')">Remover</button></td></tr>').join('')+
      '</tbody></table></div>'
    : '<div class="small" style="margin-top:16px">Nenhum vínculo manual cadastrado.</div>';

  host.innerHTML=
    '<div class="card" style="padding:18px">'+
      '<div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap">'+
        '<div><div class="overview-eyebrow">ADMINISTRAÇÃO 5S</div><h3 style="margin:5px 0">Vincular auditor</h3>'+
        '<div class="small">Escolha qualquer nome existente no Cronograma 5S e vincule à pessoa correspondente no Núcleo.</div></div>'+
        '<button class="btn secondary" type="button" onclick="nucleo5sShowPanel(\'home\')">Voltar</button>'+
      '</div>'+

      '<div class="grid" style="margin-top:16px;align-items:end">'+
        '<label><span class="small">Nome no cronograma</span>'+
          '<select id="nucleo5sLinkScheduleSelect" onchange="nucleo5sSelectScheduleAuditorName()">'+
            '<option value="">Carregando todos os nomes do cronograma...</option>'+
          '</select>'+
        '</label>'+

        '<label><span class="small">Pessoa no Núcleo</span>'+
          '<select id="nucleo5sLinkUser" onfocus="nucleo5sPopulateLinkUsers(true)" onclick="nucleo5sPopulateLinkUsers(true)">'+
            '<option value="">Carregando pessoas...</option>'+
          '</select>'+
          '<span id="nucleo5sLinkPeopleCount" class="small"></span>'+
        '</label>'+
      '</div>'+

      '<div style="margin-top:10px">'+
        '<label><span class="small">Ou digite manualmente</span>'+
          '<input id="nucleo5sLinkScheduleName" placeholder="Ex.: Bruna">'+
        '</label>'+
      '</div>'+

      '<div class="actions">'+
        '<button id="nucleo5sLinkSaveBtn" class="btn primary" type="button" onclick="nucleo5sSaveManualAuditorLink()">Salvar vínculo</button>'+
        '<button class="btn secondary" type="button" onclick="nucleo5sLoadAuditorNamesFromSchedule(true)">↻ Atualizar nomes</button>'+
      '</div>'+

      '<div id="nucleo5sLinkStatus" class="small" style="margin-top:12px"></div>'+
      rows+
    '</div>';

  nucleo5sPopulateLinkUsers(true);
  setTimeout(()=>nucleo5sPopulateLinkUsers(false),1200);
  setTimeout(()=>nucleo5sPopulateLinkUsers(),4000);
  setTimeout(()=>nucleo5sPopulateLinkUsers(),9000);
  setTimeout(()=>nucleo5sLoadAuditorNamesFromSchedule(false),0);
}

function nucleo5sSelectScheduleAuditorName(){
  const select=document.getElementById('nucleo5sLinkScheduleSelect');
  const input=document.getElementById('nucleo5sLinkScheduleName');
  if(!select||!input)return;
  if(select.value)input.value=select.value;
}

async function nucleo5sLoadAuditorNamesFromSchedule(force=false){
  const select=document.getElementById('nucleo5sLinkScheduleSelect');
  const status=document.getElementById('nucleo5sLinkStatus');
  if(!select)return;

  select.disabled=true;
  select.innerHTML='<option value="">Carregando todos os nomes do cronograma...</option>';
  if(status && force)status.textContent='Atualizando nomes do Cronograma 5S...';

  try{
    const timeout=new Promise((_,reject)=>setTimeout(
      ()=>reject(new Error('O cronograma demorou mais de 30 segundos para responder.')),
      30000
    ));

    const data=await Promise.race([
      nucleo5sBackend('nucleo_5s_schedule_names',{}),
      timeout
    ]);

    if(!data?.sucesso)throw new Error(data?.erro||'Não foi possível consultar o cronograma.');

    const names=Array.isArray(data.names)
      ? data.names.map(name=>String(name||'').trim()).filter(Boolean)
      : [];

    names.sort((a,b)=>a.localeCompare(b,'pt-BR'));

    if(names.length){
      select.innerHTML='<option value="">Selecione um nome do cronograma...</option>'+
        names.map(name=>'<option value="'+escapeHtml(name)+'">'+escapeHtml(name)+'</option>').join('');
      if(status)status.textContent=names.length+' nome(s) encontrado(s) em todo o Cronograma 5S.';
    }else{
      select.innerHTML='<option value="">Nenhum auditor encontrado no cronograma</option>';
      if(status)status.textContent='Nenhum auditor foi encontrado no Cronograma 5S. Você ainda pode digitar o nome manualmente.';
    }
  }catch(e){
    select.innerHTML='<option value="">Não foi possível carregar o cronograma</option>';
    if(status)status.textContent='Não foi possível carregar os nomes automaticamente: '+(e.message||e)+'. Você ainda pode digitar o nome manualmente.';
  }finally{
    select.disabled=false;
  }
}

async function nucleo5sSaveManualAuditorLink(){
  const status=document.getElementById('nucleo5sLinkStatus');
  const btn=document.getElementById('nucleo5sLinkSaveBtn');
  const scheduleName=String(document.getElementById('nucleo5sLinkScheduleName')?.value||'').trim();
  const userKey=String(document.getElementById('nucleo5sLinkUser')?.value||'').trim();

  if(!scheduleName){if(status)status.textContent='Digite o nome do cronograma.';return}
  if(!userKey){if(status)status.textContent='Selecione a pessoa no Núcleo.';return}

  try{
    if(btn){btn.disabled=true;btn.textContent='Salvando...'}
    if(status)status.textContent='Salvando vínculo...';

    const unit=nucleo5sCurrentUnit;
    const user=(getOperationalUsers()||[]).find(u=>nucleo5sUserKeyForLink(u)===userKey);
    if(!user)throw new Error('Usuário selecionado não encontrado.');

    let links=nucleo5sReadAuditorLinks().filter(x=>!(
      x.unit===unit && nucleo5sLinkNorm(x.scheduleName)===nucleo5sLinkNorm(scheduleName)
    ));

    links.push({
      unit,
      scheduleName,
      personId:String(user.personId||'').trim(),
      email:String(user.email||'').trim().toLowerCase(),
      userName:String(user.name||'').trim(),
      updatedAt:new Date().toISOString(),
      updatedBy:getSession()?.name||'SGQ'
    });

    await nucleo5sSaveAuditorLinks(links);
    nucleo5sRenderAuditorLinks(document.getElementById('audit5sPanel'));
  }catch(e){
    if(status)status.textContent='Erro: '+(e.message||e);
  }finally{
    if(btn){btn.disabled=false;btn.textContent='Salvar vínculo'}
  }
}

async function nucleo5sRemoveAuditorLink(scheduleName){
  const unit=nucleo5sCurrentUnit;
  const links=nucleo5sReadAuditorLinks().filter(x=>!(
    x.unit===unit && nucleo5sLinkNorm(x.scheduleName)===nucleo5sLinkNorm(scheduleName)
  ));

  try{
    await nucleo5sSaveAuditorLinks(links);
    nucleo5sRenderAuditorLinks(document.getElementById('audit5sPanel'));
  }catch(e){
    const status=document.getElementById('nucleo5sLinkStatus');
    if(status)status.textContent='Erro: '+(e.message||e);
  }
}

