/* NÚCLEO MODULE: pdca | v2.0.0-test | funções migradas: 97 */

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

function pdcaRegisteredUnit(){
  const session=getSession()||{};
  let unit=explicitPortalUnit(session.unit||'');
  if(unit)return unit;

  const email=String(session.email||'').trim().toLowerCase();
  const user=email?getOperationalUsers().find(u=>String(u.email||'').trim().toLowerCase()===email):null;
  unit=explicitPortalUnit(user?.unit||'');
  if(unit)return unit;

  return session.role==='quality'?'filial':'matriz';
}

function pdcaConfiguredSectors(){
  return getConfiguredSectors(pdcaRegisteredUnit());
}

function updatePdcaMainResponsibleSectors(){
  answers.p13=collectSectorCheckboxes('pdca-p13').join(' | ');
  updateCompletion();renderPdcaStageOverview();renderPdcaActions();schedulePdcaDraftSave();refreshPdcaInlineAlerts();
}

function renderPdcaResponsibleSectorQuestion(it,stage,global,answered){
  const unit=pdcaRegisteredUnit();
  return `<div class="question pdca-sector-question">
    <div class="pdca-question-head">
      <div class="small" style="font-weight:700">Pergunta ${global} de 26 · ${stage.name}</div>
      <div class="pdca-question-actions">
        <span class="status-badge ${answered?'answered':''}">${answered?'Respondida':'Obrigatória'}</span>
      </div>
    </div>
    <h4>${it[1]}</h4>
    <p>Selecione os setores da sua unidade que precisam executar ou acompanhar esta ação.</p>
    <div class="pdca-unit-note">
      <b>${unit==='filial'?'Unidade Linhares — Filial':'Unidade São Bento do Sul — Matriz'}</b>
      <span>Seu acesso SGQ pode consultar outras unidades, mas as responsabilidades desta ação usam somente os setores da unidade em que você está cadastrada.</span>
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

  const mainAction=String(answers.p11||'').trim();
  const mainDeadline=String(answers.p12||'').trim();
  const mainSectors=parseResponsibleSectors(answers.p13||'');
  const maxDate=pdcaIsoDate(pdcaMaxActionDate());

  const mainHtml=mainAction
    ? `<div class="pdca-action-card pdca-action-card-main">
        <div class="pdca-action-card-top">
          <span class="pdca-action-tag">Ação principal</span>
          <span class="pdca-action-state">Planejada</span>
        </div>
        <div class="pdca-action-title">${escapeHtml(mainAction)}</div>
        <div class="pdca-action-details">
          <div class="pdca-action-detail"><span>Prazo</span><b>${escapeHtml(mainDeadline||'Não informado')}</b></div>
          <div class="pdca-action-detail"><span>Responsáveis</span><b>${escapeHtml(mainSectors.join(' · ')||'Não informado')}</b></div>
        </div>
        <div class="pdca-action-ruleline">
          <span>Prazo máximo: 6 meses</span>
          <span>Apresentação: após conclusão</span>
          <span>5S: só impacta se atrasar</span>
        </div>
      </div>`
    : `<div class="pdca-action-empty">
        <b>A ação principal ainda não foi definida.</b>
        <span>Preencha “Qual ação será executada?” para ela aparecer automaticamente aqui.</span>
      </div>`;

  const extrasHtml=pdcaExtraActions.length?pdcaExtraActions.map((a,i)=>`
    <div class="pdca-action-card pdca-extra-action">
      <div class="pdca-action-card-top">
        <span class="pdca-action-tag neutral">Ação ${i+2}</span>
        <button class="pdca-action-remove" type="button" onclick="removePdcaAction('${a.id}')">Remover</button>
      </div>
      <label><div class="label">O que será feito</div><textarea rows="2" oninput="updatePdcaAction('${a.id}','action',this.value)">${escapeHtml(a.action||'')}</textarea></label>
      <div><div class="label">Setores responsáveis</div>${renderSectorCheckboxes(a.responsibleSectors?.length?a.responsibleSectors:a.owner,`updateExtraActionResponsibleSectors('${a.id}')`,'extra-'+a.id)}</div>
      <label><div class="label">Prazo <span class="small">· máximo ${escapeHtml(maxDate)}</span></div><input type="date" max="${escapeHtml(maxDate)}" value="${escapeHtml(a.deadline||'')}" onchange="if(this.value&&!pdcaActionDeadlineValid(this.value)){alert('O prazo máximo da ação é de 6 meses.');this.value='';updatePdcaAction('${a.id}','deadline','');}else updatePdcaAction('${a.id}','deadline',this.value)"></label>
    </div>`).join(''):'';

  box.innerHTML=mainHtml+extrasHtml;
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

function getSentPdcas(){
  // Fonte oficial: snapshot mais recente carregado da base central.
  // Nunca reconstruir PDCAs recebidos a partir de localStorage nem dados de demonstração.
  if(!nucleoCentralPdcaSnapshotReady)return [];
  return nucleoCentralPdcaSent.map(x=>({...x}));
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

function pdcaActionUrgency(status){
  if(status?.code==='overdue')return 'alta';
  if(status?.code==='review')return 'media';
  return 'media';
}

function refreshExternalRoPdcaFields(){
  const required=document.getElementById('externalRoPdcaRequired')?.value==='yes';
  const f=document.getElementById('externalRoPdcaDeadlineField');
  if(f)f.style.display=required?'block':'none';
}

function nucleoPdcaReviewMap2026(){
  try{return JSON.parse(localStorage.getItem(NUCLEO_PDCA_REVIEW_2026_KEY)||'{}')||{}}catch(e){return {}}
}

function nucleoSavePdcaReviewMap2026(map){
  localStorage.setItem(NUCLEO_PDCA_REVIEW_2026_KEY,JSON.stringify(map||{}));
}

function nucleoPdcaReviewDate2026(ro){
  const raw=String(ro?.data||ro?.dataRegistro||ro?.dataSolicitacao||ro?.createdAt||ro?.timestamp||ro?.raw?.['Data']||ro?.raw?.['Carimbo de data/hora']||'').trim();
  if(!raw)return null;
  let d=null;
  try{d=parseBrDate(raw)}catch(e){}
  if(!(d instanceof Date)||isNaN(d)){
    const iso=new Date(raw);if(!isNaN(iso))d=iso;
  }
  return d instanceof Date&&!isNaN(d)?d:null;
}

function nucleoPdcaReviewRoKey2026(ro){return String(ro?.numero||ro?.id||ro?.codigo||'').trim();}

function nucleoPdcaReviewCanonical2026(value,originHint=''){
  const s=String(value||'').trim();
  const digits=(s.match(/\d+/g)||[]).pop();
  if(!digits)return normalizeAnswer(s);
  let origin='';
  if(/RO[-_ ]?EX|ROE|extern/i.test(s)||/extern/i.test(originHint))origin='EX';
  else if(/RO[-_ ]?IN|RIO|intern/i.test(s)||/intern/i.test(originHint))origin='IN';
  return origin+':'+String(Number(digits));
}

function nucleoPdcaReviewTerminal2026(ro,map){
  const tri=resolvedTriageForRo(ro,map)||{};
  const decision=normalizeAnswer(tri.decision||'');
  const status=normalizeAnswer(ro?.statusPlanilha||ro?.status||ro?.raw?.__statusOperacional||'');
  if(['record','cancelled','obsolete'].includes(decision))return true;
  return status.includes('registro')||status.includes('cancel')||status.includes('obsolet');
}

function nucleoPdcaReviewHasEvidence2026(ro){
  const roKey=nucleoPdcaReviewRoKey2026(ro), origin=String(ro?.origemBase||ro?.raw?.__origemBase||'');
  const target=nucleoPdcaReviewCanonical2026(roKey,origin);
  if(!target)return false;
  return getAllSentPdcas().some(p=>nucleoPdcaReviewCanonical2026(p?.ro||p?.roId||'',p?.origin||p?.origemBase||'')===target);
}

function nucleoPdcaReviewOwnTerminal2026(ro){
  const status=normalizeAnswer(ro?.statusPlanilha||ro?.status||ro?.raw?.__statusOperacional||'');
  return status.includes('registro')||status.includes('cancel')||status.includes('obsolet');
}

function nucleoPdcaReviewGroupKey2026(ro){
  const canonical=nucleoPdcaReviewCanonical2026(nucleoPdcaReviewRoKey2026(ro),String(ro?.origemBase||ro?.raw?.__origemBase||''));
  const unit=normalizePortalUnit(explicitRecordUnit(ro)||ro?.unidade||'');
  return canonical+(unit?'|'+unit:'');
}

function nucleoPdcaPreferredRo2026(items,triageMap=null){
  const list=(items||[]).filter(Boolean);if(!list.length)return null;
  const active=list.filter(r=>!nucleoPdcaReviewOwnTerminal2026(r));
  const pool=active.length?active:list;
  return pool.slice().sort((a,b)=>{
    const sectorScore=r=>{const v=String(r?.setorResponsavelPlanilha||r?.raw?.__setorResponsavel||r?.setor||'').trim();return v&&!['nao direcionado','nao informado','sem setor','-'].includes(normalizeAnswer(v))?1:0;};
    const evidenceScore=r=>nucleoPdcaReviewHasEvidence2026(r)?1:0;
    const da=nucleoPdcaReviewDate2026(a)?.getTime()||0,db=nucleoPdcaReviewDate2026(b)?.getTime()||0;
    return (evidenceScore(b)-evidenceScore(a))||(sectorScore(b)-sectorScore(a))||(db-da);
  })[0];
}

function nucleoPdcaReviewCandidates2026(){
  const cutoff=new Date(2026,0,1,0,0,0,0),triageMap=getSavedTriageMap(),review=nucleoPdcaReviewMap2026();
  const groups=new Map(),out=[];
  getAllRoRecords().forEach(ro=>{
    const key=nucleoPdcaReviewRoKey2026(ro);if(!key)return;
    const d=nucleoPdcaReviewDate2026(ro);if(!d||d<cutoff)return;
    const groupKey=nucleoPdcaReviewGroupKey2026(ro);if(!groupKey)return;
    const arr=groups.get(groupKey)||[];arr.push(ro);groups.set(groupKey,arr);
  });
  groups.forEach(items=>{
    const ro=nucleoPdcaPreferredRo2026(items,triageMap);if(!ro)return;
    const key=nucleoPdcaReviewRoKey2026(ro),d=nucleoPdcaReviewDate2026(ro);
    const canonical=nucleoPdcaReviewCanonical2026(key,String(ro?.origemBase||ro?.raw?.__origemBase||''));
    const hasActiveDuplicate=items.some(x=>!nucleoPdcaReviewOwnTerminal2026(x));
    if(!hasActiveDuplicate&&nucleoPdcaReviewTerminal2026(ro,triageMap))return;
    const manual=review[canonical];
    const hasEvidence=nucleoPdcaReviewHasEvidence2026(ro);
    if(hasEvidence && manual?.decision!=='yes')review[canonical]={decision:'yes',automatic:true,at:new Date().toISOString(),by:'Núcleo',ro:key};
    if(!review[canonical])out.push({ro,key,canonical,date:d});
  });
  nucleoSavePdcaReviewMap2026(review);
  return out.sort((a,b)=>b.date-a.date);
}

async function nucleoPdcaReviewPersist2026(ro,decision){
  const key=nucleoPdcaReviewRoKey2026(ro),origin=String(ro?.origemBase||ro?.raw?.__origemBase||''),canonical=nucleoPdcaReviewCanonical2026(key,origin);
  if(!canonical)throw new Error('R.O. não identificada.');
  const review=nucleoPdcaReviewMap2026();
  review[canonical]={decision,automatic:false,at:new Date().toISOString(),by:getSession()?.name||'SGQ',ro:key,origin};
  nucleoSavePdcaReviewMap2026(review);
  const map=getSavedTriageMap();
  const records=getTriageRecordsForRoNumber(key,map);
  for(const old of records){
    const updated={...old,pdcaRequired:decision==='yes',pdcaReviewDecision:decision,pdcaReviewAt:new Date().toISOString(),pdcaReviewBy:getSession()?.name||'SGQ'};
    map.set(String(updated.roKey||key),updated);
    if(portalBackendEnabled())await portalBackendSaveConfirmed('triage',String(updated.roKey||key),updated);
  }
  localStorage.setItem(TRIAGE_KEY,JSON.stringify([...map.values()]));
  return true;
}

async function nucleoUnlinkPdcaReview2026(roKey,origin){
  if(!nucleoFeatureRequire('pdca','import'))return;

  const target=nucleoPdcaReviewCanonical2026(roKey,origin);
  if(!target){alert('R.O. não identificada.');return;}

  const review=nucleoPdcaReviewMap2026();
  const current=review[target];
  const currentLabel=current?.decision==='yes'?'Tem PDCA':current?.decision==='no'?'Não tem PDCA':'sem definição';

  if(!confirm(
    'Desvincular a definição de PDCA desta R.O.?\n\n'+
    'Situação atual: '+currentLabel+'\n\n'+
    'A R.O. voltará a permitir a escolha entre "Tem PDCA" e "Não tem PDCA". '+
    'Nenhuma R.O., arquivo ou PDCA salvo será excluído.'
  ))return;

  try{
    await withNucleoLoading('Desvinculando definição de PDCA...',async()=>{
      delete review[target];
      nucleoSavePdcaReviewMap2026(review);

      const map=getSavedTriageMap();
      const records=getTriageRecordsForRoNumber(roKey,map);

      for(const old of records){
        const updated={...old};
        delete updated.pdcaReviewDecision;
        delete updated.pdcaReviewAt;
        delete updated.pdcaReviewBy;

        // Retorna à regra operacional da triagem sem excluir PDCA ou arquivo.
        if(String(updated.decision||'')==='directed')updated.pdcaRequired=true;

        map.set(String(updated.roKey||roKey),updated);
        if(portalBackendEnabled()){
          await portalBackendSaveConfirmed('triage',String(updated.roKey||roKey),updated);
        }
      }

      localStorage.setItem(TRIAGE_KEY,JSON.stringify([...map.values()]));

      try{render()}catch(e){}
      try{renderPdcaReview2026()}catch(e){}
      try{renderPdcaPdfSummary()}catch(e){}
      try{renderCurrentOverview()}catch(e){}
      try{refreshRoSummary()}catch(e){}
    },'Atualizando R.O.');

    alert('Definição de PDCA desvinculada. Você pode escolher novamente entre Tem PDCA e Não tem PDCA.');
  }catch(e){
    console.error('[NUCLEO DESVINCULAR PDCA]',e);
    alert('Não foi possível desvincular a definição de PDCA.\n\n'+String(e?.message||e));
  }
}

async function nucleoMarkPdcaReview2026(roKey,origin,decision){
  if(!nucleoFeatureRequire('pdca','import'))return;
  const target=nucleoPdcaReviewCanonical2026(roKey,origin);
  const matches=getAllRoRecords().filter(r=>nucleoPdcaReviewCanonical2026(nucleoPdcaReviewRoKey2026(r),String(r?.origemBase||r?.raw?.__origemBase||''))===target);
  const ro=nucleoPdcaPreferredRo2026(matches,getSavedTriageMap())||findRoByAnyNumber(roKey,origin);
  if(!ro){alert('R.O. não encontrada. Sincronize e tente novamente.');return;}
  try{
    await nucleoPdcaReviewPersist2026(ro,decision);
    renderPdcaReview2026();
    renderPdcaPdfSummary();
    if(decision==='yes'){
      await nucleoDriveLoad();
      if(typeof nucleoDriveOpenForRo==='function')await nucleoDriveOpenForRo(nucleoPdcaReviewRoKey2026(ro),explicitRecordUnit(ro),effectiveRoSector(ro,getSavedTriageMap()));
      else await nucleoDriveOpen('pdca');
    }
  }catch(e){alert('Não foi possível salvar a definição de PDCA.\n\n'+String(e?.message||e));}
}

function nucleoPdcaPdfSummaryRows(){
  const all=getSentPdcas()||[];
  const visible=isAdmin()?all:all.filter(p=>String(p.email||'').toLowerCase()===currentEmail());

  return visible.map(p=>{
    const pending=!!(p.pdfPending||p.legacyMissingPdf||p.controlImported);
    const hasPdf=!pending&&!!(
      p.externalPdf===true||
      p.fileId||
      p.pdcaFileId||
      p.pdfUrl||
      p.driveFileId
    );
    const status=String(p.status||'').trim();
    const presentedNoPdf=pending&&status.toLowerCase().includes('apresent');
    const respondedNoPdf=pending&&!presentedNoPdf;
    return {p,pending,hasPdf,presentedNoPdf,respondedNoPdf};
  });
}

function nucleoPdcaPdfSummaryData(){
  const rows=nucleoPdcaPdfSummaryRows();
  return {
    total:rows.length,
    withPdf:rows.filter(x=>x.hasPdf).length,
    pendingPdf:rows.filter(x=>x.pending).length,
    presentedNoPdf:rows.filter(x=>x.presentedNoPdf).length,
    respondedNoPdf:rows.filter(x=>x.respondedNoPdf).length
  };
}

function nucleoPdcaSummaryCategoryRows(category){
  const rows=nucleoPdcaPdfSummaryRows();
  if(category==='withPdf')return rows.filter(x=>x.hasPdf);
  if(category==='pendingPdf')return rows.filter(x=>x.pending);
  if(category==='presentedNoPdf')return rows.filter(x=>x.presentedNoPdf);
  if(category==='respondedNoPdf')return rows.filter(x=>x.respondedNoPdf);
  return rows;
}

function nucleoPdcaSummaryCategoryTitle(category){
  if(category==='withPdf')return 'PDCAs com PDF';
  if(category==='pendingPdf')return 'PDCAs com PDF pendente';
  if(category==='presentedNoPdf')return 'Apresentados sem PDF';
  if(category==='respondedNoPdf')return 'Respondidos sem PDF';
  return 'PDCAs no Núcleo';
}

function nucleoOpenPdcaSummary(category){
  const rows=nucleoPdcaSummaryCategoryRows(category);
  const title=nucleoPdcaSummaryCategoryTitle(category);

  let modal=document.getElementById('pdcaSummaryDetailModal');
  if(modal)modal.remove();

  modal=document.createElement('div');
  modal.id='pdcaSummaryDetailModal';
  modal.style.cssText='position:fixed;inset:0;z-index:99999;background:rgba(15,23,42,.42);display:flex;align-items:center;justify-content:center;padding:20px;overflow:auto';

  const tableRows=rows.map(({p,pending,hasPdf})=>{
    const ro=String(p.ro||'').trim();
    const setor=String(p.setor||'').trim()||'—';
    const status=String(p.status||'').trim()||'—';
    const unidade=canonicalUnitName(p.unidade||p.unit||'')||'—';
    const recebido=p.sentAt||p.envio||'';
    let when='—';
    if(recebido){
      const d=new Date(recebido);
      when=Number.isNaN(d.getTime())?String(recebido):d.toLocaleString('pt-BR');
    }
    const fileName=String(p.fileName||'').trim();
    const pdfLabel=hasPdf?(fileName||'PDF disponível'):'PDF pendente';
    const action=pending
      ? `<button class="btn primary" type="button" onclick="event.stopPropagation();document.getElementById('pdcaSummaryDetailModal')?.remove();nucleoUploadPendingPdcaPdf('${escapeHtml(p.id||'')}')">Subir PDF</button>`
      : `<button class="btn secondary" type="button" onclick="event.stopPropagation();document.getElementById('pdcaSummaryDetailModal')?.remove();openPdcaReport('${escapeHtml(p.id||'')}')">Abrir PDCA</button>`;

    return `<tr>
      <td><b>${escapeHtml(ro||'—')}</b></td>
      <td>${escapeHtml(setor)}</td>
      <td>${escapeHtml(unidade)}</td>
      <td>${escapeHtml(status)}</td>
      <td>${escapeHtml(pdfLabel)}</td>
      <td>${escapeHtml(when)}</td>
      <td>${action}</td>
    </tr>`;
  }).join('');

  modal.innerHTML=`
    <div style="background:#fff;width:min(1250px,96vw);max-height:90vh;overflow:auto;border-radius:16px;box-shadow:0 22px 60px rgba(15,23,42,.28);padding:20px">
      <div style="display:flex;justify-content:space-between;gap:14px;align-items:flex-start;margin-bottom:14px">
        <div>
          <h2 style="margin:0">${escapeHtml(title)}</h2>
          <p class="small" style="margin:5px 0 0">${rows.length} R.O.${rows.length===1?'':'s'} nesta categoria.</p>
        </div>
        <button class="btn secondary" type="button" onclick="document.getElementById('pdcaSummaryDetailModal')?.remove()">Fechar</button>
      </div>
      <div style="overflow:auto">
        <table class="action-table" style="min-width:920px">
          <thead><tr><th>R.O.</th><th>Setor</th><th>Unidade</th><th>Status</th><th>PDF</th><th>Recebimento</th><th></th></tr></thead>
          <tbody>${tableRows||'<tr><td colspan="7" style="text-align:center;padding:24px">Nenhuma R.O. nesta categoria.</td></tr>'}</tbody>
        </table>
      </div>
    </div>`;

  document.body.appendChild(modal);
  modal.addEventListener('click',e=>{if(e.target===modal)modal.remove()});
}

function renderPdcaPdfSummary(){
  const box=document.getElementById('pdcaPdfSummary');
  if(!box)return;

  const d=nucleoPdcaPdfSummaryData();
  const priorities=isAdmin()?nucleoPdcaReviewCandidates2026().length:0;
  const btn=document.getElementById('pdcaPrioritiesButton');
  if(btn){
    btn.innerHTML='Abrir prioridades'+(priorities?` <span class="status-badge" style="margin-left:6px">${priorities}</span>`:'');
    btn.style.display=isAdmin()?'':'none';
  }

  const card=(category,label,value,detail)=>`
    <button type="button"
      onclick="nucleoOpenPdcaSummary('${category}')"
      title="Clique para ver as R.O.s"
      style="min-width:150px;flex:1;border:1px solid #dfe7ef;border-radius:12px;padding:10px 12px;background:#fff;text-align:left;cursor:pointer;font:inherit">
      <div class="small" style="margin-bottom:4px">${escapeHtml(label)}</div>
      <div style="font-size:21px;font-weight:800;line-height:1">${value}</div>
      <div class="small" style="margin-top:5px">${escapeHtml(detail)}</div>
      <div class="small" style="margin-top:6px;font-weight:700">Ver R.O.s →</div>
    </button>`;

  box.innerHTML=`
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      ${card('total','PDCAs no Núcleo',d.total,'Total reconhecido')}
      ${card('withPdf','Com PDF',d.withPdf,'Arquivo já disponível')}
      ${card('pendingPdf','PDF pendente',d.pendingPdf,'Falta anexar o arquivo')}
      ${card('presentedNoPdf','Apresentados sem PDF',d.presentedNoPdf,'Status já confirmado')}
      ${card('respondedNoPdf','Respondidos sem PDF',d.respondedNoPdf,'Status já confirmado')}
    </div>`;
}

function renderPdcaReview2026(){
  if(!isAdmin())return;
  const panel=document.getElementById('pdcaPrioritiesContent');
  if(!panel)return;

  const rows=nucleoPdcaReviewCandidates2026();
  const count=document.getElementById('pdcaPrioritiesCount');
  if(count)count.textContent=rows.length+' para definir';

  if(!rows.length){
    panel.innerHTML='<div style="padding:28px;text-align:center"><b>Nenhuma prioridade pendente.</b><div class="small" style="margin-top:5px">Todas as R.O.s de 2026 já possuem definição de PDCA.</div></div>';
    return;
  }

  panel.innerHTML=`
    <div style="overflow:auto">
      <table class="action-table" style="min-width:900px">
        <thead><tr><th>R.O.</th><th>Data</th><th>Cliente / origem</th><th>Setor</th><th>Definir PDCA</th></tr></thead>
        <tbody>
          ${rows.slice(0,150).map(x=>{
            const r=x.ro;
            const origin=String(r.origemBase||r.raw?.__origemBase||'');
            const sector=effectiveRoSector(r,getSavedTriageMap())||'-';
            return `<tr style="background:#fffdf5">
              <td><b>${escapeHtml(x.key)}</b></td>
              <td>${escapeHtml(formatDateBR(r.data||r.dataRegistro||r.dataSolicitacao||''))}</td>
              <td>${escapeHtml(r.cliente||r.origem||'-')}</td>
              <td>${escapeHtml(sector)}</td>
              <td>
                <div style="display:flex;gap:8px;white-space:nowrap">
                  <button class="btn primary" type="button" onclick="nucleoMarkPdcaReview2026('${escapeHtml(x.key)}','${escapeHtml(origin)}','yes')">Tem PDCA</button>
                  <button class="btn secondary" type="button" onclick="nucleoMarkPdcaReview2026('${escapeHtml(x.key)}','${escapeHtml(origin)}','no')">Não tem PDCA</button>
                </div>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
    ${rows.length>150?'<p class="small" style="margin-top:10px">Mostrando as 150 prioridades mais recentes. Resolva estas para carregar as próximas.</p>':''}`;
}

function nucleoOpenPdcaPriorities(){
  if(!isAdmin())return;

  let modal=document.getElementById('pdcaPrioritiesModal');
  if(!modal){
    modal=document.createElement('div');
    modal.id='pdcaPrioritiesModal';
    modal.style.cssText='position:fixed;inset:0;z-index:99999;background:rgba(15,23,42,.42);display:flex;align-items:center;justify-content:center;padding:22px';
    modal.innerHTML=`
      <div style="background:#fff;width:min(1500px,97vw);max-height:92vh;overflow:auto;border-radius:16px;box-shadow:0 22px 60px rgba(15,23,42,.28);padding:20px">
        <div style="display:flex;justify-content:space-between;gap:16px;align-items:flex-start;margin-bottom:14px">
          <div>
            <h2 style="margin:0">Prioridades de PDCA — 2026</h2>
            <p class="small" style="margin:5px 0 0">R.O.s a partir de 01/01/2026 que ainda precisam ser definidas como Tem PDCA ou Não tem PDCA. Registro, Cancelada e Obsoleto não entram aqui.</p>
          </div>
          <div style="display:flex;gap:8px;align-items:center">
            <span id="pdcaPrioritiesCount" class="status-badge"></span>
            <button class="btn secondary" type="button" onclick="nucleoClosePdcaPriorities()">Fechar</button>
          </div>
        </div>
        <div id="pdcaPrioritiesContent"></div>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click',e=>{if(e.target===modal)nucleoClosePdcaPriorities()});
  }

  modal.style.display='flex';
  renderPdcaReview2026();
}

function nucleoClosePdcaPriorities(){
  const modal=document.getElementById('pdcaPrioritiesModal');
  if(modal)modal.style.display='none';
}

function pdcaQualityIssues(){
  const a=answers||{},issues=[];
  const editableQualityIds=new Set(pdcaEditableQuestionIds());
  const text=(id)=>String(a[id]||'').trim();
  const norm=(v)=>normalizeAnswer(String(v||''));
  const add=(id,title,items,example='')=>{
    if(id!=='extra'&&!editableQualityIds.has(id))return;
    issues.push({id,level:'warn',title,text:title,items,example});
  };

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

  if(text('p12') && !pdcaActionDeadlineValid(text('p12')))
    add('p12','O prazo da ação ultrapassa o limite permitido.',[
      'O prazo máximo de uma ação é de 6 meses a partir de hoje.',
      'Defina uma data dentro desse período.'
    ],'Ex.: escolha uma data em até 6 meses.');

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

  const editableIds=pdcaEditableQuestionIds();
  const answered=editableIds.filter(id=>String(answers[id]||'').trim()).length;
  const lockedCount=stages.flatMap(stage=>stage.items.map(x=>x[0])).filter(id=>pdcaQuestionLocked(id)).length;

  if(sum){
    const base=answered+'/'+editableIds.length+' respostas das etapas liberadas';
    const locked=lockedCount?' · Checar/Agir aguardando conclusão da ação':'';
    sum.textContent=issues.length
      ? base+' · '+issues.length+' ponto(s) para revisar'+locked+'.'
      : base+' · Nenhum alerta de qualidade'+locked+'.';
  }

  if(box)box.innerHTML=issues.length
    ? issues.slice(0,10).map(x=>`<div class="pdca-quality-item warn">${pdcaIssueHtml(x)}</div>`).join('')
    : `<div class="pdca-quality-item ok">✓ As respostas das etapas liberadas passaram nas verificações atuais.${lockedCount?' Checar e Agir serão analisados somente depois da conclusão da ação.':''}</div>`;
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

function causeLabelForPdca(p){
  const a=p?.answers||{};
  return String(a.p7||a.p5||'').trim();
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

function printCurrentPdca(){
  const p=window.currentPrintPdca;
  if(!p){
    alert('Nenhum PDCA está aberto para impressão.');
    return;
  }

  if(nucleoSystemFormat('pdca',explicitRecordUnit(p))?.design){void nucleoPdcaDownloadModelPdf(p,true);return;}
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
  if(!pdcaAllActionsCompleted(p)){
    alert('A apresentação não pode ser concluída enquanto houver ação pendente ou atrasada.');
    return;
  }

  const existing=getPdcaPresentationMap().get(String(p.id||''));
  const roRecord=findRoByAnyNumber(p.ro||'',p.origemBase||p.sourceRoOrigin||'');
  const origin=String(roRecord?.origemBase||roRecord?.raw?.__origemBase||'Interna');
  const alreadyInSheet=String(roRecord?.pdcaEnviadoReclamanteEm||'').trim();

  // Mesmo que a apresentação já tenha sido marcada localmente antes,
  // se a planilha ainda não tem a data do reclamante, o Núcleo corrige/backfill.
  const alreadyConfirmed=String(p.claimantDeliveredAt||p.pdcaEnviadoReclamanteEm||alreadyInSheet||'').trim();
  if(existing?.presentationCompleted && alreadyConfirmed){
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
    if(portalBackendEnabled()){
      const result=await portalJsonp({
        acao:'portal_pdca_claimant_delivered',
        ro:p.ro||'',
        pdcaId:String(p.id||''),
        deliveredAt:claimantDeliveredAt
      },60000);
      if(!result?.sucesso)throw new Error(result?.erro||'A base central não confirmou a devolutiva ao reclamante.');
      if(result.record){
        p.claimantDeliveredAt=result.record.claimantDeliveredAt||claimantDeliveredAt;
        p.pdcaEnviadoReclamanteEm=p.claimantDeliveredAt;
        p.claimantDeliveredBy=result.record.claimantDeliveredBy||userName;
        p.status=result.record.status||p.status;
      }
    }else{
      const result=await portalUpdateRoSheetConfirmed(p.ro||'',{pdcaEnviado:claimantDeliveredAt});
      if(!result?.sucesso)throw new Error(result?.erro||'A planilha não confirmou a gravação.');
    }
  }catch(sheetError){
    alert('A apresentação NÃO foi concluída porque a base central/planilha não confirmou a data do reclamante.\n\n'+String(sheetError?.message||sheetError));
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
  if(roRecord){
    roRecord.pdcaEnviadoReclamanteEm=claimantDeliveredAt;
    roRecord.reclamanteRecebeuPdca=true;
    roRecord.situacaoPdca='Enviado ao reclamante';
    if(roRecord.raw){
      roRecord.raw['PDCA ENVIADO PARA O RECLAMANTE (DATA)']=claimantDeliveredAt;
      roRecord.raw['Situação PDCA']='Enviado ao reclamante';
    }
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
  if(!pdcaAllActionsCompleted(p)){
    alert('A apresentação só será liberada após a conclusão de todas as ações deste PDCA.');
    return;
  }
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
    meta.textContent='Resposta entregue ao reclamante'+(rec.claimantDeliveredAt||rec.completedAt||rec.presentedAt?' em '+formatDateTimeBR(rec.claimantDeliveredAt||rec.completedAt||rec.presentedAt):'')+(rec.presentedBy?' · '+rec.presentedBy:'');
    btn.textContent='Abrir apresentação';
    btn.disabled=false;
  }else{
    const completed=pdcaAllActionsCompleted(p);
    badge.textContent=completed?'Pronto para apresentação':'Aguardando conclusão das ações';
    badge.className='status-badge pending';
    meta.textContent=completed
      ?'Todas as ações estão concluídas. A apresentação pode ser registrada.'
      :'A apresentação só será liberada após a conclusão de todas as ações.';
    btn.textContent=completed?'Apresentar PDCA':'Apresentação bloqueada';
    btn.disabled=!completed;
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
  if(!pdcaAllActionsCompleted(p)){
    alert('A apresentação só pode ser realizada após a conclusão de todas as ações deste PDCA.');
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

async function downloadCurrentPdcaPdf(){
  const p=window.currentReportPdca;
  if(!p){alert('Abra um PDCA antes de gerar o PDF.');return}
  if(nucleoSystemFormat('pdca',explicitRecordUnit(p))?.design)return nucleoPdcaDownloadModelPdf(p,false);
  const ans=p.answers||{};
  const model=nucleoSystemFormat('pdca',explicitRecordUnit(p));

  const W=842,H=595;
  const pages=[];

  function makePage(){
    const content=[];
    const cmd=s=>content.push(s);
    const txt=(x,y,size,text,bold=false)=>{text=(model?.labels||[]).find(z=>z.from===text)?.to||text;return cmd(`BT /F${bold?2:1} ${model?.fontSize&&size<=12?model.fontSize:size} Tf ${x} ${y} Td (${pdfEsc(text)}) Tj ET`);};
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
    txt(36,558,26,model?.title||'PDCA',true);
    if(model?.footer)txt(36,20,8,model.footer);
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

function adminCleanupLinkedPdca(roKey){
  return getAllSentPdcas().filter(p=>roNumbersSameLegacy(p.ro||p.roId||'',roKey));
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

async function adminDeletePdcaForRo(skipConfirm=false){
  if(!isAdmin())return false;
  const key=cleanupRoKey();
  if(!key){alert('Digite ou selecione uma R.O.');return false;}

  const ro=findRoByAnyNumber(key,'');
  if(!ro){
    alert('R.O. não encontrada. Digite o número completo ou apenas os dígitos.');
    return false;
  }

  const pdcas=adminCleanupLinkedPdca(key);
  if(!pdcas.length){
    if(!skipConfirm)alert('Não há PDCA vinculado a esta R.O.');
    return true;
  }

  if(!skipConfirm){
    const ok=confirm(
      'Excluir '+pdcas.length+' PDCA(s) vinculado(s) a '+key+'?\n\n'+
      'Também serão removidas as ações e a apresentação relacionadas.\n'+
      'A R.O. principal será preservada.'
    );
    if(!ok)return false;
  }

  try{
    await adminCleanupEnsureTestBackend();

    // Remove e confirma cada registro na base central.
    for(const p of pdcas){
      for(const a of allPdcaActionsForRecord(p)){
        if(a?.id)await adminCleanupDeleteRecord('pdca_actions',a.id);
      }
      if(p?.id)await adminCleanupDeleteRecord('pdca_sent',p.id);
    }

    removePdcaLocalRecords(key,pdcas);

    // Preserva a R.O. principal e remove somente os registros vinculados ao PDCA.
    if(ro){
      ro.pdca='Obrigatório';
      const tri=getRoTriageRecord(ro);
      ro.status=tri?.decision==='directed'?'Aguardando resposta':'Aguardando triagem';
      ro.pdcaEnviadoReclamanteEm='';
      ro.reclamanteRecebeuPdca=false;
    }

    try{await syncPortalBackend(false,{foreground:true})}catch(e){}

    try{renderSentPdcas()}catch(e){}
    try{renderTriage()}catch(e){}
    try{renderActionsDashboard()}catch(e){}
    try{refreshRoSummary()}catch(e){}
    try{refreshPdcaSidebarBadge()}catch(e){}
    refreshAdminCleanupPreview();

    const stillThere=adminCleanupLinkedPdca(key);
    if(stillThere.length){
      throw new Error('A base central ainda apresenta PDCA vinculado a esta R.O. após a exclusão.');
    }

    if(!skipConfirm)alert('PDCA excluído. A R.O. principal foi preservada.');
    return true;
  }catch(e){
    console.error('[CORREÇÃO ADMIN] falha ao excluir PDCA',e);
    alert('Não foi possível excluir o PDCA.\n\n'+String(e?.message||e));
    return false;
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

function pdcaExternalExists(ro,preloadedMap=null){
  const tri=getRoTriageRecord(ro,preloadedMap);
  return tri?.pdcaExternal===true || String(tri?.pdcaSource||'').toLowerCase()==='external';
}

function pdcaSituationLabel(ro,preloadedMap=null){
  const tri=getRoTriageRecord(ro,preloadedMap)||{};
  if(String(tri.pdcaSituation||'').trim())return String(tri.pdcaSituation).trim();
  if(pdcaExternalExists(ro,preloadedMap))return 'PDCA externo';
  const sent=getPdcaReturnForRo(ro);
  if(sent){
    const presented=Boolean(sent.apresentadoEm) ||
      (!sent.externalPdf && typeof getPdcaPresentationMap==='function' &&
       getPdcaPresentationMap().has(String(sent.id||sent.pdcaId||'')));
    return presented?'PDCA apresentado':'PDCA enviado';
  }
  const status=String(ro?.status||'');
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

function assignedHasAnswerWithoutPdca(r,triageMap){
  const tri=getRoTriageRecord(r,triageMap)||{};
  const display=assignedRoStatus(r,triageMap);
  const pdcaExists=
    !!getPdcaReturnForRo(r)||
    pdcaExternalExists(r,triageMap)||
    tri?.pdcaExternal===true||
    tri?.pdcaFileId;

  if(pdcaExists)return false;

  if(tri?.pdcaResponded===true||tri?.answered===true||tri?.responseReceived===true)return true;

  const s=normalizeAnswer(display||'');
  return ['pdca respondido','pdca apresentado','respondido','apresentado','respondida','apresentada'].includes(s);
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

function nucleoPdcaDelivery(p){const deliveries=Array.isArray(nucleoCentralPdcaDispatches)?nucleoCentralPdcaDispatches:[];return deliveries.find(d=>d.ro===p.ro&&d.unit===explicitRecordUnit(p)&&(d.pdcaFileId===p.pdcaFileId||d.fileId&&d.fileId===p.fileId)&&Number(d.version||1)===Number(p.version||1));}

function nucleoConsultPdcaClaimant(id){const p=getAllSentPdcas().find(p=>p.id===id);if(!p)return;const ro=getAllRoRecords().find(r=>String(r.numero||r.id)===p.ro&&explicitRecordUnit(r)===explicitRecordUnit(p));const binding=ro&&claimantIdentityIndex().bindings.get(claimantRoKey(ro));const user=ro&&resolveRoClaimant(ro);alert('Reclamante confirmado: '+(user?personDisplayName(user):'Cadastro indisponível')+(binding?.confirmedBy?'\nConfirmado por: '+binding.confirmedBy:'')+(binding?.confirmedAt?'\nData: '+new Date(binding.confirmedAt).toLocaleString('pt-BR'):''));}

function nucleoSetPdcaLifecycle(value){document.getElementById('sentLifecycleFilter').value=value;document.getElementById('sentStatusFilter').value='todos';renderSentPdcas();}

function nucleoRenderPdcaLifecycle(data,lifecycle){
 const tabs=document.getElementById('sentLifecycleTabs');if(tabs)tabs.style.display=isAdmin()?'flex':'none';
 const active=data.filter(p=>!nucleoPdcaDelivery(p)).length,history=data.length-active;
 [['sentActiveTab','active','Pendências e confirmações',active],['sentHistoryTab','history','Histórico — encerradas',history]].forEach(([id,value,label,count])=>{const el=document.getElementById(id);if(el){el.textContent=label+' ('+count+')';el.className='btn '+(lifecycle===value?'primary':'secondary');el.setAttribute('aria-selected',String(lifecycle===value));}});
 const text=document.getElementById('sentLifecycleDescription');if(text)text.textContent=!isAdmin()?'Respostas disponíveis para consulta.':lifecycle==='history'?'Respostas já entregues ao reclamante. Encerradas nesta etapa e mantidas para consulta e indicadores.':'Confirme o reclamante e entregue a resposta. Reclamante já confirmado não exige nova confirmação de identidade.';
}

async function nucleoPdcaDownloadModelPdf(p,open){
 if(!p?.id){alert('Salve o PDCA na base central antes de gerar o PDF.');return;}
 const tab=open?window.open('about:blank','_blank'):null;if(open&&!tab){alert('Permita abrir a aba do PDF neste navegador.');return;}if(tab){tab.opener=null;tab.document.body.textContent='Gerando PDF com o modelo da unidade…';}
 try{await showNucleoLoading('Gerando PDF do PDCA…','Aplicando o modelo salvo para esta unidade.');const result=await portalJsonp({acao:'portal_pdca_model_pdf',id:p.id},90000);if(!result?.sucesso||!result.base64)throw Error(result?.erro||'PDF não confirmado pela base central.');const blob=new Blob([Uint8Array.from(atob(result.base64),c=>c.charCodeAt(0))],{type:'application/pdf'}),url=URL.createObjectURL(blob);if(tab){if(!tab.closed)tab.location.replace(url);}else{const a=document.createElement('a');a.href=url;a.download=result.fileName||'PDCA.pdf';document.body.appendChild(a);a.click();a.remove();}setTimeout(()=>URL.revokeObjectURL(url),300000);
 }catch(error){if(tab&&!tab.closed){tab.document.body.textContent=error.message;}else alert(error.message);}finally{hideNucleoLoading(true);}
}

