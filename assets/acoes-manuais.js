const UNIFIED_ACTIONS_KEY='nucleo-unified-actions-v1';

let unifiedCentralActions=[],unifiedCentralToken='';
function getUnifiedManualActions(){return unifiedCentralToken===getSession()?.authToken?unifiedCentralActions.slice():[];}
async function loadUnifiedManualActions(){
  const token=getSession()?.authToken;if(!token)return;
  const r=await portalJsonp({acao:'portal_manual_actions',mode:'list'},60000);
  if(token!==getSession()?.authToken)return;
  if(!r?.sucesso||!Array.isArray(r.records))throw new Error(r?.erro||'A base não confirmou as ações.');
  unifiedCentralActions=r.records;unifiedCentralToken=token;
}
async function saveUnifiedManualActions(list){
 const token=getSession()?.authToken;if(!token)throw new Error('Entre novamente.');
 const before=getUnifiedManualActions().slice();
 for(const record of list){
   const previous=before.find(x=>x.id===record.id);
   if(previous&&JSON.stringify(previous)===JSON.stringify(record))continue;
   const payload={...record,updatedAt:new Date().toISOString(),_manualExpected:previous?.updatedAt||previous?.createdAt||''};
   const result=previous
     ? await portalBackendSaveConfirmedPost('pdca_actions',record.id,payload,90000)
     : await confirmNewUnifiedManualAction(payload,token);
   if(token!==getSession()?.authToken)throw new Error('A sessão mudou. Sincronize para conferir o resultado.');
   if(!result?.sucesso||!result.registro)throw new Error(result?.erro||'A ação não foi confirmada. Confira as ações antes de tentar novamente.');
   unifiedCentralToken=token;unifiedCentralActions=unifiedCentralActions.filter(x=>x.id!==record.id).concat(result.registro);
 }
 for(const removed of before.filter(x=>!list.some(y=>y.id===x.id))){
   const r=await portalJsonp({acao:'portal_delete',colecao:'pdca_actions',id:removed.id,manualExpected:removed.updatedAt||removed.createdAt||''},60000);
   if(!r?.sucesso)throw new Error(r?.erro||'A exclusão não foi confirmada.');
   unifiedCentralActions=unifiedCentralActions.filter(x=>x.id!==removed.id);
 }
}
async function confirmNewUnifiedManualAction(record,token){
  let saveError;
  try{
    // As ações manuais são registros pequenos. Recebe a resposta da própria
    // gravação, em vez de enviar por iframe e depender de outro endpoint.
    const response=await portalBackendSaveConfirmed('pdca_actions',record.id,record);
    if(response?.sucesso!==true)throw new Error(response?.erro||'Gravação não confirmada.');
  }catch(error){
    saveError=error;
  }
  for(let attempt=0;attempt<3;attempt++){
    if(getSession()?.authToken!==token)throw new Error('A sessão mudou. Entre novamente.');
    try{
      const response=await portalJsonp({acao:'portal_manual_actions',mode:'list'},60000);
      if(getSession()?.authToken!==token)throw new Error('A sessão mudou.');
      const saved=response?.sucesso===true&&Array.isArray(response.records)
        ? response.records.find(item=>item.id===record.id):null;
      if(saved&&saved.assigneeKey===record.assigneeKey&&saved.action===record.action
        &&String(saved.sector||'')===String(record.sector||'')
        &&saved.recordKind===record.recordKind){
        return {sucesso:true,registro:saved};
      }
    }catch(error){if(!saveError)saveError=error;}
    if(attempt<2)await new Promise(resolve=>setTimeout(resolve,700*(attempt+1)));
  }
  throw new Error('Ação '+(record.actionCode||record.id)+' · '+(record.sector||record.assigneeName||'')+
    ': '+(saveError?.message||'A base central ainda não retornou o registro. Faça nova tentativa para continuar a distribuição.'));
}

async function unifiedDependencyRecordId(parentId,sector,key){
  const bytes=new TextEncoder().encode(JSON.stringify([parentId,sector,key]));
  const digest=await crypto.subtle.digest('SHA-256',bytes);
  return 'ACT-DEP-'+Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join('');
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
  if(unifiedManualActionDeadline(a).days<0)return {code:'overdue',label:'Atrasada',reason:'O prazo da ação venceu.'};
  return {code:'pending',label:'Pendente',reason:'Aguardando conclusão.'};
}
function unifiedManualActionDeadline(a){
  const value=String(a?.deadline||'').trim();
  const iso=value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return actionDeadlineInfo({answers:{p12:iso?iso[3]+'/'+iso[2]+'/'+iso[1]:value}});
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
const unifiedSectorDescriptions=new Map();
function renderUnifiedSectorResponsibilities(){
 const host=document.getElementById('unifiedActionSectorResponsibilities');if(!host)return;
 host.querySelectorAll('textarea[data-action-sector]').forEach(el=>unifiedSectorDescriptions.set(el.dataset.actionSector,el.value));
 const sectors=[...(document.getElementById('unifiedActionDependencySectors')?.selectedOptions||[])].map(o=>o.value);
 host.innerHTML=sectors.map(sector=>'<label style="display:block;margin-top:10px"><div class="label">Parte do setor '+escapeHtml(sector)+'</div><textarea data-action-sector="'+escapeHtml(sector)+'" rows="2" maxlength="2000" placeholder="Descreva o que este setor precisa fazer nesta ação">'+escapeHtml(unifiedSectorDescriptions.get(sector)||'')+'</textarea></label>').join('');
 host.hidden=sectors.length===0;
}
function unifiedActionSelectedDependencies(){
 const sectors=[...(document.getElementById('unifiedActionDependencySectors')?.selectedOptions||[])].map(o=>String(o.value||'').trim()).filter(Boolean);
 document.querySelectorAll('#unifiedActionSectorResponsibilities textarea[data-action-sector]').forEach(el=>unifiedSectorDescriptions.set(el.dataset.actionSector,el.value));
 const external=String(document.getElementById('unifiedActionExternalDependencies')?.value||'').split(/\n|;/).map(x=>x.trim()).filter(Boolean);
 return {sectors:[...new Set(sectors)],external:[...new Set(external)],
   sectorResponsibilities:[...new Set(sectors)].map(sector=>({sector,description:String(unifiedSectorDescriptions.get(sector)||'').trim()}))};
}
function unifiedActionDependencyText(a){
 const deps=a?.dependencies||{},sectors=Array.isArray(deps.sectors)?deps.sectors:[],external=Array.isArray(deps.external)?deps.external:[];
 const all=[...sectors,...external];
 if(!all.length&&a?.dependency)all.push(String(a.dependency));
 return all.length?all.join(' · '):'—';
}
function unifiedActionDependencyDetails(a){
 const summary=unifiedActionDependencyText(a);
 const me=unifiedCurrentUserKey();
 if(a.dependencySector||(!isAdmin()&&a.createdByKey!==me))return escapeHtml(summary);
 const parts=new Map((a.dependencies?.sectorResponsibilities||[]).map(part=>[part.sector,part.description]));
 const groupId=a.groupId||a.id;
 const children=getUnifiedManualActions().filter(child=>child.groupId===groupId&&child.dependencySector);
 for(const child of children)parts.set(child.dependencySector,child.action);
 for(const sector of a.dependencies?.sectors||[])if(!parts.has(sector))parts.set(sector,'');
 if(!parts.size)return escapeHtml(summary);
 return '<div>'+escapeHtml(summary)+'</div><div style="display:grid;gap:8px;margin-top:10px">'+
   [...parts].map(([sector,description])=>{
     const assigned=children.filter(child=>child.dependencySector===sector);
     const done=assigned.filter(child=>unifiedManualActionStatus(child).code==='done').length;
     const checked=assigned.length>0&&done===assigned.length;
     const label=assigned.length?done+'/'+assigned.length+' concluídas':'Aguardando distribuição';
     const people=assigned.map(child=>{
       const completed=unifiedManualActionStatus(child).code==='done';
       return '<div class="small" style="margin-top:4px">'+(completed?'✓ ':'○ ')+escapeHtml(child.assigneeName||child.assigneeKey||'Responsável')+
         ' · '+(completed?'Concluída':'Pendente')+
         (!completed&&unifiedManualActionCanComplete(child)?' <button class="btn secondary" type="button" data-dependency-complete="'+escapeHtml(child.id)+'">Concluir</button>':'')+'</div>';
     }).join('');
     return '<div style="border:1px solid var(--line);padding:10px;border-radius:8px"><b>'+ (checked?'✓ ':'○ ')+escapeHtml(sector)+'</b>'+
       '<div class="small">'+escapeHtml(label)+'</div>'+
       '<details style="margin-top:5px"><summary>Consultar parte</summary>'+
       '<div style="white-space:pre-wrap;overflow-wrap:anywhere">'+escapeHtml(description)+'</div>'+people+'</details></div>';
   }).join('')+'</div>';
}
document.addEventListener('change',event=>{
 if(event.target.id==='unifiedActionDependencySectors')renderUnifiedSectorResponsibilities();
});
async function openUnifiedActionModal(){
  if(!nucleoFeatureRequire('pdca','actions'))return;
  try{await loadUnifiedManualActions();}catch(e){alert(e.message);return;}
  const ov=document.getElementById('unifiedActionOverlay');
  if(!ov)return;
  document.getElementById('unifiedActionRo').value='';
  populateUnifiedActionRos();
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
  unifiedSectorDescriptions.clear();
  const responsibilityHost=document.getElementById('unifiedActionSectorResponsibilities');if(responsibilityHost)responsibilityHost.innerHTML='';
  const sectorSelect=document.getElementById('unifiedActionDependencySectors');if(sectorSelect)[...sectorSelect.options].forEach(o=>o.selected=false);
  populateUnifiedActionDependencySectors();
  renderUnifiedSectorResponsibilities();

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

function unifiedActionCodeScope(record){
  const ro=String(record.ro||'').trim().toUpperCase();
  if(!ro)return '';
  const unit=explicitPortalUnit(record.roUnit||record.unit)||'';
  const origin=normalizeAnswer(record.sourceRoOrigin||'');
  return JSON.stringify([ro,unit,/^RO[- ]?(IN|EX)[- ]/.test(ro)?'':origin]);
}

function unifiedActionCodePrefix(ro){
  const number=String(ro||'').trim().match(/\d+$/)?.[0];
  return number?'ACT-'+number.replace(/^0+(?=\d)/,'')+'-':'ACT-';
}

function unifiedActionLegacySequences(records){
  const scopes=new Map();
  const sequences=new Map();
  for(const record of records){
    const scope=unifiedActionCodeScope(record);
    if(!scopes.has(scope))scopes.set(scope,{used:new Set(),groups:new Map()});
    const {used,groups}=scopes.get(scope);
    if(record.actionCode){
      if(Number(record.actionSequence)>0)used.add(Number(record.actionSequence));
      continue;
    }
    const key=JSON.stringify([record.groupId||record.id,record.dependencySector||'']);
    if(!groups.has(key))groups.set(key,[]);
    groups.get(key).push(record);
  }
  for(const {used,groups} of scopes.values()){
    const ordered=[...groups.entries()].sort(([a],[b])=>a.localeCompare(b));
    let sequence=1;
    for(const [,group] of ordered){
      while(used.has(sequence))sequence++;
      for(const record of group)sequences.set(record.id,sequence);
      sequence++;
    }
  }
  return sequences;
}

function unifiedActionCodeStart(records,scope){
  const previous=records.filter(record=>unifiedActionCodeScope(record)===scope);
  const legacy=unifiedActionLegacySequences(previous);
  return previous.reduce((max,record)=>Math.max(max,Number(record.actionSequence)||legacy.get(record.id)||0),0)+1;
}

let unifiedActionPendingCreation=null;
async function saveUnifiedAction(button){
  if(button?.disabled)return;
  if(button)button.disabled=true;
  try{await createUnifiedAction();}
  catch(error){alert(error.message||String(error));}
  finally{if(button)button.disabled=false;}
}
async function createUnifiedAction(){
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
  const ro=resolveUnifiedActionRo();
  if(ro===null)return;

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

  const unit=explicitPortalUnit(ro?.unit||(mode==='sector'?document.getElementById('unifiedActionUnit')?.value:'')||session.unit||currentUserUnit());
  const deliveries=[];
  for(const part of dependencies.sectorResponsibilities){
    if(!part.description){alert('Descreva a ação de '+part.sector+'.');return;}
    if(!unit){alert('Identifique a unidade da ação para atribuir aos setores.');return;}
    const recipients=getOperationalUsers().filter(unifiedActionIsActiveUser)
      .filter(u=>unifiedActionUserKey(u)&&userHasUnitSector(u,unit,part.sector));
    if(!recipients.length){alert('Não há usuários ativos em '+part.sector+' nesta unidade.');return;}
    const recipientKeys=new Set();
    for(const user of recipients){
      const key=unifiedActionUserKey(user);
      if(recipientKeys.has(key))continue;
      recipientKeys.add(key);
      deliveries.push({key,name:user.name||user.email,unit,sector:part.sector,description:part.description});
    }
  }

  await loadUnifiedManualActions();
  const list=getUnifiedManualActions();
  const destinations=[...assignees,...deliveries];
  const signature=JSON.stringify({creatorKey,mode,ro,text,deadline,note,type,project,subject,dependencies,urgency,nextStep,progress,remaining,destinations});
  if(unifiedActionPendingCreation?.signature!==signature){
    const groupId='ACTGRP-'+Date.now()+'-'+Math.random().toString(36).slice(2,9);
    const codeScope=unifiedActionCodeScope({ro:ro?.number,roUnit:ro?.unit,sourceRoOrigin:ro?.origin});
    const firstSequence=unifiedActionCodeStart(list,codeScope);
    const prefix=unifiedActionCodePrefix(ro?.number);
    const sectorSequences=new Map(dependencies.sectors.map((sector,i)=>[sector,firstSequence+i+1]));
    const records=destinations.map((recipient,index)=>{
      const isDependency=index>=assignees.length;
      const actionSequence=isDependency?sectorSequences.get(recipient.sector):firstSequence;
      return {
        id:'ACT-'+groupId.slice(7)+'-'+index,
        actionCode:prefix+actionSequence,actionSequence,
        groupId:destinations.length>1?groupId:'',
        source:isDependency||mode!=='self'?'assigned':'self',
        recordKind:'manual_action',
        ro:ro?.number||'',roUnit:ro?.unit||'',sourceRoOrigin:ro?.origin||'',
        action:isDependency?recipient.description:text,
        deadline,
        note:isDependency?'':note,
        type,project,subject,urgency,
        dependencies:isDependency?{}:{sectors:dependencies.sectors,external:dependencies.external},
        dependencySector:isDependency?recipient.sector:'',
        nextStep:isDependency?'':nextStep,
        progress:isDependency?0:progress,
        remaining:isDependency?'':remaining,
        history:[{
          id:'UPD-'+groupId+'-'+index,at:now,byKey:creatorKey,byName:creatorName,
          text:'Ação criada.',progress:isDependency?0:progress,
          remaining:isDependency?'':remaining,nextStep:isDependency?'':nextStep
        }],
        assigneeKey:recipient.key,assigneeName:recipient.name,
        sector:recipient.sector||'',unit:recipient.unit||'',
        createdByKey:creatorKey,createdByName:creatorName,createdAt:now,
        completedAt:'',completedBy:'',evidence:''
      };
    });
    unifiedActionPendingCreation={signature,records};
  }
  const records=unifiedActionPendingCreation.records;
  const existing=new Set(list.map(record=>record.id));
  await saveUnifiedManualActions(list.concat(records.filter(record=>!existing.has(record.id))));
  unifiedActionPendingCreation=null;

  for(const record of records){
    createNotification({
      type:'action',skipEmail:true,audience:'user',userKey:record.assigneeKey,
      sector:record.sector,title:record.source==='self'?'Nova ação pessoal':'Nova ação atribuída',
      message:record.action+(deadline?' · Prazo: '+formatDateBR(deadline):'')
    });
  }

  closeUnifiedActionModal();
  renderActionsDashboard();
  refreshUserPendingActionAlert();
  alert(deliveries.length?'Ação criada e partes atribuídas aos setores selecionados.':assignees.length>1?`Ação atribuída a ${assignees.length} pessoa(s).`:'Ação criada.');
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
      <div><span>Dependências</span>${unifiedActionDependencyDetails(a)}</div>
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
async function saveUnifiedActionUpdate(){
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
  await saveUnifiedManualActions(list);

  renderUnifiedActionHistory(list[i]);
  document.getElementById('unifiedActionUpdateText').value='';
  renderActionsDashboard();
  refreshUserPendingActionAlert();
}

async function completeUnifiedManualAction(id){
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
  await saveUnifiedManualActions(list);
  renderActionsDashboard();
  refreshUserPendingActionAlert();
}
async function deleteUnifiedManualAction(id){
  const list=getUnifiedManualActions();
  const a=list.find(x=>String(x.id)===String(id));
  if(!a)return;
  const me=unifiedCurrentUserKey();
  const allowed=isAdmin() || String(a.createdByKey||'').toLowerCase()===me;
  if(!allowed){alert('Somente quem criou a ação ou o SGQ pode excluí-la.');return}
  if(!confirm('Excluir esta ação?'))return;
  await saveUnifiedManualActions(list.filter(x=>String(x.id)!==String(id)));
  renderActionsDashboard();
  refreshUserPendingActionAlert();
}

function actionDashboardItems(){
  const sent=getAllSentPdcas();const admin=isAdmin();const items=[];

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
  const manualActions=getUnifiedManualActions();
  const legacySequences=unifiedActionLegacySequences(manualActions);
  const mainGroups=new Set(manualActions.filter(a=>!a.dependencySector).map(a=>a.groupId||a.id));
  const me=unifiedCurrentUserKey();
  manualActions.filter(a=>{
    if(!unifiedActionCanSee(a))return false;
    if(!a.dependencySector)return true;
    // A gestão acompanha as partes na ação principal.
    // A fila operacional contém apenas as atribuições do próprio responsável.
    return admin?!mainGroups.has(a.groupId):String(a.assigneeKey||'').toLowerCase()===me;
  }).forEach(a=>{
    const status=unifiedManualActionStatus(a);
    items.push({
      source:a.source==='self'?'self':'assigned',
      sourceLabel:a.source==='self'?'Pessoal':'Atribuída',
      id:a.actionCode||unifiedActionCodePrefix(a.ro)+legacySequences.get(a.id),
      createdAt:a.createdAt||'',
      type:a.type||'Ação',
      project:[a.ro,a.project].filter(Boolean).join(' · ')||'—',
      subject:a.subject||'—',
      dependency:unifiedActionDependencyText(a),
      urgency:a.urgency||'media',
      nextStep:a.nextStep||'—',
      progress:Number(a.progress||0),
      remaining:a.remaining||'',
      updatedAt:a.completedAt||a.updatedAt||a.createdAt||'',
      manualAction:a,
      ro:a.ro||'—',
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
  body.innerHTML=filtered.length?filtered.map((x,index)=>`<tr>
    <td><b>${escapeHtml(x.id||'—')}</b><div class="small">${escapeHtml(x.ro||'—')}</div></td>
    <td><div class="action-main-text action-summary-text">${escapeHtml(x.acao)}</div></td>
    <td>${escapeHtml(x.responsavel)}<div class="small">${escapeHtml(x.setor)}</div></td>
    <td><span class="action-pill ${x.status.code}">${escapeHtml(x.status.label)}</span></td>
    <td><button class="btn secondary" type="button" data-action-consult="${index}">Consultar</button></td>
  </tr>`).join(''):'<tr><td colspan="5" style="text-align:center;padding:24px">Nenhuma ação encontrada nesta visão.</td></tr>';
  body.querySelectorAll('[data-action-consult]').forEach(button=>{
    button.onclick=async()=>{
      const item=filtered[Number(button.dataset.actionConsult)];
      if(!item)return;
      if(!item.manualAction){openUnifiedActionDetails(item);return;}
      button.disabled=true;
      try{
        await loadUnifiedManualActions();
        const current=actionDashboardItems().find(row=>row.manualAction?.id===item.manualAction.id);
        if(current)openUnifiedActionDetails(current);
        else alert('A ação não está mais disponível nesta visualização.');
      }catch(error){alert(error.message||String(error));}
      finally{button.disabled=false;}
    };
  });

}
async function distributeExistingActionParts(id,button){
  if(button.disabled)return;
  button.disabled=true;
  try{
    await loadUnifiedManualActions();
    const list=getUnifiedManualActions();
    const parent=list.find(a=>a.id===id);
    if(!parent||(!isAdmin()&&parent.createdByKey!==unifiedCurrentUserKey()))return;
    const unit=explicitPortalUnit(parent.roUnit||parent.unit);
    if(!unit)throw new Error('A unidade da ação precisa estar identificada.');
    const parts=parent.dependencies?.sectorResponsibilities||[];
    const users=getOperationalUsers().filter(unifiedActionIsActiveUser);
    const groupId=parent.groupId||parent.id;
    let sequence=unifiedActionCodeStart(list,unifiedActionCodeScope(parent));
    const existing=new Set(list.map(a=>a.id));
    const records=[];
    for(const part of parts){
      const description=String(part.description||'').trim();
      if(!description)continue;
      const recipients=new Map(users.filter(u=>userHasUnitSector(u,unit,part.sector))
        .map(u=>[unifiedActionUserKey(u),u]).filter(([key])=>key));
      if(!recipients.size)throw new Error('Não há usuários ativos em '+part.sector+' nesta unidade.');
      const previous=list.find(a=>a.groupId===groupId&&a.dependencySector===part.sector);
      const partSequence=previous?.actionSequence||sequence;
      const code=previous?.actionCode||unifiedActionCodePrefix(parent.ro)+partSequence;
      for(const [key,user] of recipients){
        const childId=await unifiedDependencyRecordId(parent.id,part.sector,key);
        if(existing.has(childId)||list.some(a=>a.groupId===groupId&&a.dependencySector===part.sector&&a.assigneeKey===key))continue;
        existing.add(childId);
        records.push({
          id:childId,groupId,source:'assigned',recordKind:'manual_action',
          dependencySector:part.sector,actionCode:code,actionSequence:partSequence,
          ro:parent.ro,roUnit:parent.roUnit,sourceRoOrigin:parent.sourceRoOrigin,
          action:description,deadline:parent.deadline,type:parent.type,project:parent.project,
          subject:parent.subject,urgency:parent.urgency,sector:part.sector,unit,
          assigneeKey:key,assigneeName:user.name||user.email,
          createdByKey:parent.createdByKey,createdByName:parent.createdByName,
          createdAt:new Date().toISOString(),progress:0,history:[]
        });
      }
      if(!previous&&records.some(a=>a.actionCode===code))sequence++;
    }
    if(records.length){
      await saveUnifiedManualActions(list.concat(records));
      for(const record of records){
        createNotification({type:'action',skipEmail:true,audience:'user',userKey:record.assigneeKey,
          sector:record.sector,title:'Nova ação atribuída',message:record.action});
      }
    }
    renderActionsDashboard();
    alert(records.length?'Partes atribuídas aos setores.':'As partes já estão atribuídas.');
  }catch(error){
    try{
      await loadUnifiedManualActions();
      renderActionsDashboard();
    }catch(refreshError){console.warn('Não foi possível atualizar as ações.',refreshError);}
    alert(error.message||String(error));
  }
  finally{button.disabled=false;}
}

function openUnifiedActionDetails(x){
  if(!x||!nucleoFeatureRequire('pdca','actions'))return;
  if(x.manualAction&&!unifiedActionCanSee(x.manualAction))return;
  const dialog=document.getElementById('actionDetailsDialog');
  const content=document.getElementById('actionDetailsContent');
  document.getElementById('actionDetailsTitle').textContent='Ação '+x.id;
  const fields=[
    ['Descrição',x.acao],['Observações',x.manualAction?.note],
    ['Projeto / R.O.',x.project],['Cliente / assunto',x.subject],
    ['Origem',x.sourceLabel],['Tipo',x.type],['Responsável',x.responsavel],['Setor',x.setor],
    ['Urgência',unifiedActionUrgencyLabel(x.urgency)],['Status',x.status.label],
    ['Prazo',x.prazo],['Situação do prazo',x.deadline.text],['Próximo passo',x.nextStep],
    ['Progresso',x.manualAction?x.progress+'%':''],['Falta',x.remaining],
    ['Data de criação',unifiedActionDateTimeLabel(x.createdAt)],
    ['Última atualização',unifiedActionDateTimeLabel(x.updatedAt)],
    ['Impacto no 5S',x.source==='pdca'?(x.impacta5S?'Impacta 5S':'Sem impacto no 5S'):''],
    ['Evidência',x.manualAction?.evidence||x.actionRecord?.evidenceNote]
  ];
  content.innerHTML='<dl class="action-details-fields">'+fields
    .filter(([,value])=>String(value??'').trim()&&!['-','—'].includes(value))
    .map(([label,value])=>'<div><dt>'+escapeHtml(label)+'</dt><dd>'+escapeHtml(value)+'</dd></div>').join('')
    +'<div><dt>Dependências</dt><dd>'+(x.manualAction?unifiedActionDependencyDetails(x.manualAction):escapeHtml(x.dependency||'—'))
    +'</dd></div></dl><div class="unified-action-buttons">'+unifiedActionRowButtons(x)+'</div>';
  content.querySelectorAll('.unified-action-buttons button').forEach(button=>{
    button.addEventListener('click',()=>dialog.close(),{capture:true});
  });
  content.querySelectorAll('[data-dependency-complete]').forEach(button=>{
    button.onclick=async()=>{
      const id=button.dataset.dependencyComplete;
      dialog.close();
      await window.completeUnifiedManualAction(id);
      const current=actionDashboardItems().find(row=>row.manualAction?.id===x.manualAction?.id);
      if(current)openUnifiedActionDetails(current);
    };
  });
  const action=x.manualAction;
  if(action?.dependencies?.sectorResponsibilities?.some(part=>String(part.description||'').trim())
    &&(isAdmin()||action.createdByKey===unifiedCurrentUserKey())){
    const distribute=document.createElement('button');
    distribute.type='button';
    distribute.className='btn secondary';
    distribute.textContent='Distribuir partes aos setores';
    distribute.onclick=()=>distributeExistingActionParts(action.id,distribute);
    content.querySelector('.unified-action-buttons').append(distribute);
  }
  if(!dialog.open)dialog.showModal();
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
    if(body)body.innerHTML='<tr><td colspan="5" style="padding:24px;text-align:center;color:#667085">Não foi possível carregar as ações nesta visualização.</td></tr>';
  }
}

// Compatibilidade: a antiga tela "Ações pendentes" agora abre a área unificada.

function unifiedActionRoChoices(){
  return getAllRoRecords().filter(ro=>nucleoManagerScopeAllows(ro)).map(ro=>({
    number:String(ro.numero||ro.id||ro.codigo||'').split('::')[0],
    unit:explicitRecordUnit(ro),origin:ro.origemBase||ro.raw?.__origemBase||'',client:ro.cliente||''
  })).filter(ro=>/^RO-(IN|EX)-\d+$/i.test(ro.number));
}
function populateUnifiedActionRos(){
 const list=document.getElementById('unifiedActionRoOptions');if(!list)return;
 const seen=new Set();list.innerHTML=unifiedActionRoChoices().filter(r=>{const key=r.number+'|'+r.unit;if(seen.has(key))return false;seen.add(key);return true;}).map(r=>'<option value="'+escapeHtml(r.number)+'">'+escapeHtml([r.origin,r.client,canonicalUnitName(r.unit)].filter(Boolean).join(' · '))+'</option>').join('');
}
function resolveUnifiedActionRo(){
 const value=String(document.getElementById('unifiedActionRo')?.value||'').trim();if(!value)return undefined;
 const choices=unifiedActionRoChoices();let matches=choices.filter(r=>r.number.toUpperCase()===value.toUpperCase());
 if(!matches.length&&/^\d+$/.test(value))matches=choices.filter(r=>Number(r.number.match(/\d+$/)[0])===Number(value));
 const unique=[...new Map(matches.map(r=>[r.number+'|'+r.unit,r])).values()];
 if(unique.length!==1){alert(unique.length?'Há R.O.s internas/externas com esse número. Selecione o código completo da lista.':'Selecione uma R.O. disponível na lista ou deixe o vínculo vazio.');return null;}
 document.getElementById('unifiedActionRo').value=unique[0].number;return unique[0];
}
for(const name of ['saveUnifiedAction','saveUnifiedActionUpdate','completeUnifiedManualAction','deleteUnifiedManualAction']){
 const original=window[name];let busy=false;
 window[name]=async function(...args){if(busy)return;busy=true;try{return await original(...args);}catch(e){alert(e.message||'A base não confirmou a operação.');}finally{busy=false;}};
}
const unifiedOriginalShowActions=showActionsDashboard;
showActionsDashboard=async function(){
 if(!nucleoFeatureRequire('pdca','actions'))return;
 unifiedOriginalShowActions();
 try{await loadUnifiedManualActions();populateActionsSectorFilter();renderActionsDashboard();}
 catch(e){alert('Não foi possível atualizar as ações atribuídas: '+e.message);}
};
