/* NÚCLEO CORE: settings | V3 TESTE | funções: 41 */

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
  let sectors=(['loginSector','registerSector'].includes(selectId)?nucleoPublicLoginSectors(unit):getConfiguredSectors(unit)).slice();

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

function unitConfiguration(unit){
  if(!unit||unit==='todas')return null;
  try{const own=JSON.parse(localStorage.getItem('nucleo-unit-configs')||'[]').find(c=>c.id===unit);if(own)return own;const sectors=JSON.parse(localStorage.getItem('nucleo-unit-public-sectors')||'{}');if(sectors[unit]!==undefined)return {sectorList:sectors[unit]};}catch(_){}
  return null;
}

