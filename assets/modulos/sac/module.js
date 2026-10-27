/* NÚCLEO MODULE: sac | v2.0.0-test | funções migradas: 89 */

function unifiedActionIsActiveUser(u){
  return u &&
    u.active!==false &&
    normalizeAnswer(u.active||'sim')!=='nao' &&
    normalizeAnswer(u.status||'')!=='inactive' &&
    u.approvalStatus!=='pending' &&
    u.approvalStatus!=='rejected' &&
    u.approvalStatus!=='inactive' &&
    u.approvalStatus!=='disabled' &&
    !nucleoPersonPermissions(u).sgq;
}

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

function findExternalRoControlByRo(ro){
  const key=String(ro||'').trim();
  return getExternalRoControls().find(x=>String(x.ro||'').trim()===key)||null;
}

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
  if(!nucleoFeatureRequire('sac','consult'))return;
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
    .filter(r=>sacIsRealSac(r)&&r.treatmentStatus!=='done'&&r.status!=='done')
    .sort((a,b)=>String(a.treatmentDeadline||'').localeCompare(String(b.treatmentDeadline||'')));

  if(!list.length){
    host.innerHTML='<div class="card" style="padding:26px"><b>Nenhum SAC em andamento.</b><div class="small" style="margin-top:6px">As tratativas abertas de todos os tipos de SAC aparecem aqui.</div></div>';
    return;
  }

  host.innerHTML=`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:12px">
    ${list.map(r=>`<div class="card" style="padding:16px;min-width:0">
      <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;flex-wrap:wrap">
        <div><b>${escapeHtml(r.ro||'—')}</b><div class="small"><b>Direcionado para:</b> ${escapeHtml(sacDirectedSector(r))}</div></div>
        <span class="status-badge pending">${escapeHtml(isSacRework(r)?sacReworkStageLabel(r.reworkStage):externalTreatmentStatusLabel(r.treatmentStatus))}</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:12px">
        <div><div class="small">Tratativa</div><b>${escapeHtml(externalTreatmentLabel(r.treatmentType))}</b></div>
        <div><div class="small">Prazo</div><b>${escapeHtml(r.treatmentDeadline?formatDateBR(r.treatmentDeadline):'—')}</b></div>
        <div><div class="small">Setor</div><b>${escapeHtml(r.responsibleSector||'—')}</b></div>
        <div><div class="small">Última atualização</div><b>${escapeHtml(r.reworkHistory?.length?(formatDateTimeBR(r.reworkHistory[r.reworkHistory.length-1].changedAt)||'—'):'—')}</b></div>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:14px">
        ${isSacRework(r)?`<button class="btn primary" type="button" onclick="openSacStageUpdate('${escapeHtml(r.id)}')">Atualizar estágio</button>`:`<button class="btn primary" type="button" onclick="openExternalRoControlModal('${escapeHtml(r.id)}')">Atualizar tratativa</button>`}
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
  if(!nucleoFeatureRequire('sac','consult') && !nucleoPersonFeatureCan('sac','edit'))return;
  view('externalRoControlView');
  setNav('externalro');
  renderExternalRoControl();
}

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
  try{
    const confirmation=await portalBackendSaveConfirmedPost('external_ro_controls',record.id,record,90000);
    if(!confirmation?.registro||confirmation.registro.sacDecision!==record.sacDecision)throw new Error('A decisão salva na base não corresponde à selecionada.');
    nucleoSacDraftRemove(record.id);
  }catch(e){
    nucleoSacDraftPut(record);nucleoRenderSacDrafts();
    throw new Error('Decisão guardada neste computador, pendente de sincronização. Use Tentar novamente em Pendências locais do SAC. Detalhe: '+e.message);
  }
  const stored=(()=>{
    try{const x=JSON.parse(localStorage.getItem(EXTERNAL_RO_CONTROL_KEY)||'[]');return Array.isArray(x)?x:[]}catch(e){return []}
  })();
  const roKey=appRoNumber(record?.ro||'','Externa');
  const list=stored.filter(x=>appRoNumber(x?.ro||x?.sourceRo||x?.id||'','Externa')!==roKey);
  list.push(record);
  saveExternalRoControlsLocal(list);
}

async function promoteExternalRoToSac(id){
  if(!nucleoFeatureRequire('sac','edit'))return;
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
  try{await saveSacDecisionLocally(record)}catch(e){hideNucleoLoading();alert('Não foi possível confirmar a decisão de SAC na base central: '+(e?.message||e));return;}
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
  nucleoRenderSacDrafts();
  const canConsultSac=nucleoPersonFeatureCan('sac','consult')||nucleoPersonFeatureCan('sac','edit');
  const canEditSac=nucleoPersonFeatureCan('sac','edit');
  if(!canConsultSac&&!isRepresentativeSacAccess())return;
  const status=document.getElementById('externalRoStatusFilter')?.value||'all';
  const treatment=document.getElementById('externalRoImpactFilter')?.value||'all';
  const q=normalizeAnswer(document.getElementById('externalRoSearch')?.value||'');
  const allSacRows=canConsultSac?getExternalRoControls():getMySacs();

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
          ${canEditSac?`<button class="btn secondary" type="button" onclick="markExternalRoAsRoOnly('${escapeHtml(r.id)}')">Somente R.O.</button>
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
            ${canEditSac?`<button class="btn primary" type="button" style="padding:5px 8px;font-size:11px;min-height:auto" onclick="openExternalRoControlModal('${escapeHtml(r.id)}')">Classificar SAC</button>`:''}
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
        ${canEditSac?`
          <button class="btn secondary" type="button" onclick="openRoReport('${escapeHtml(r.ro)}')">Ver R.O.</button>
          <button class="btn secondary" type="button" onclick="correctSacRepresentative('${escapeHtml(r.id)}')">Corrigir representante</button>
          <button class="btn secondary" type="button" onclick="openSacEditModal('${escapeHtml(r.id)}')">Preencher ficha SAC</button>
          ${sacHasFilledForm(r)?`<button class="btn secondary" type="button" onclick="openSacOfficialFormPreview('${escapeHtml(r.id)}')">Ver ficha SAC</button>`:''}
          ${r.pdfFileId?`<button class="btn secondary" type="button" onclick="openSacPdf('${escapeHtml(r.id)}')">PDF SAC</button>`:''}
          ${startBtn}${updateBtn}${finishBtn}${reviewBtn}
          ${isSacRework(r)?`<button class="btn secondary" type="button" onclick="showSacTracking()">Acompanhar retrabalho</button>`:''}
          ${nucleoPersonFeatureCan('sac','finalize')?`<button class="btn primary" type="button" onclick="finalizeAndSendSac('${escapeHtml(r.id)}')">${r.sacSentAt?'Conferir novo envio':'Preparar e-mail do SAC'}</button>`:''}
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

function openSacPdf(id){
  const r=getExternalRoControls().find(x=>String(x.id)===String(id));
  if(!r?.pdfFileId){alert('Este SAC ainda não possui PDF gerado.');return}
  window.open('https://drive.google.com/file/d/'+encodeURIComponent(r.pdfFileId)+'/view','_blank','noopener,noreferrer');
}

function sacCurrentEditRecord(){
  const id=String(document.getElementById('sacEditRecordId')?.value||'').trim();
  return getExternalRoControls().find(x=>String(x.id)===id)||null;
}

function renderSacAttachmentList(record){
  const host=document.getElementById('sacEditAttachmentList');
  if(!host)return;
  const list=Array.isArray(record?.sacAttachments)?record.sacAttachments:[];
  host.innerHTML=list.length
    ? list.map(a=>`
      <div class="card" style="padding:10px;margin:7px 0;display:flex;justify-content:space-between;gap:10px;align-items:center">
        <div style="min-width:0">
          <b style="word-break:break-word">${escapeHtml(a.fileName||'Arquivo')}</b>
          <div class="small">${escapeHtml(a.mimeType||'arquivo')}${a.size?` · ${Math.max(1,Math.round(Number(a.size)/1024))} KB`:''}</div>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button class="btn secondary" type="button" onclick="openSacAttachment('${escapeHtml(record.id)}','${escapeHtml(a.id)}')">Abrir</button>
          <button class="btn secondary" type="button" style="color:#b42318" onclick="deleteSacAttachment('${escapeHtml(record.id)}','${escapeHtml(a.id)}')">Excluir</button>
        </div>
      </div>`).join('')
    : '<div class="small">Nenhum arquivo anexado.</div>';
}

async function refreshSacAttachments(id){
  try{
    const record=getExternalRoControls().find(x=>String(x.id)===String(id));
    if(!record)return;
    const unit=normalizePortalUnit(record.unit||record.unidade||'matriz');
    const res=await portalJsonp({acao:'nucleo_drive_sac_attachments',unit,sacId:record.id},30000);
    if(!res?.sucesso)throw new Error(res?.erro||'Não foi possível consultar os anexos.');

    const list=getExternalRoControls();
    const idx=list.findIndex(x=>String(x.id)===String(id));
    if(idx>=0){
      list[idx]={...list[idx],sacAttachments:Array.isArray(res.attachments)?res.attachments:[]};
      saveExternalRoControlsLocal(list);
      renderSacAttachmentList(list[idx]);
    }
  }catch(e){
    const st=document.getElementById('sacEditUploadStatus');
    if(st)st.textContent='Não foi possível carregar os anexos: '+(e.message||e);
  }
}

async function uploadSacAttachments(){
  if(!nucleoFeatureRequire('sac','edit'))return;
  const record=sacCurrentEditRecord();
  if(!record){alert('SAC não encontrado.');return}

  const input=document.getElementById('sacEditFile');
  const files=[...(input?.files||[])];
  if(!files.length){alert('Selecione pelo menos um arquivo.');return}

  const tooLarge=files.find(f=>f.size>8*1024*1024);
  if(tooLarge){alert('Cada arquivo deve ter no máximo 8 MB.');return}

  const st=document.getElementById('sacEditUploadStatus');
  const unit=normalizePortalUnit(record.unit||record.unidade||'matriz');
  if(st)st.textContent='Enviando '+files.length+' arquivo(s)...';

  try{
    for(let i=0;i<files.length;i++){
      const file=files[i];
      if(st)st.textContent=`Enviando ${i+1} de ${files.length}: ${file.name}`;
      const fileData=await fileToBase64(file);
      const eventId='SACATT-'+Date.now()+'-'+Math.random().toString(36).slice(2,8);
      const res=await portalJsonp({
        acao:'nucleo_drive_sac_upload',
        unit,
        sacId:record.id,
        eventoId:eventId,
        fileName:file.name,
        mimeType:file.type||'application/octet-stream',
        fileData
      },90000);
      if(!res?.sucesso)throw new Error(res?.erro||('Falha ao anexar '+file.name));
    }
    if(input)input.value='';
    if(st)st.textContent='Arquivo(s) anexado(s) e confirmado(s) na base central.';
    await refreshSacAttachments(record.id);
  }catch(e){
    if(st)st.textContent='Erro ao anexar: '+(e.message||e);
  }
}

async function openSacAttachment(sacId,attachmentId){
  const record=getExternalRoControls().find(x=>String(x.id)===String(sacId));
  if(!record)return;
  try{
    const unit=normalizePortalUnit(record.unit||record.unidade||'matriz');
    const res=await portalJsonp({
      acao:'nucleo_drive_sac_read',
      unit,
      sacId,
      attachmentId
    },60000);
    if(!res?.sucesso||!res.base64)throw new Error(res?.erro||'Arquivo indisponível.');
    const bytes=Uint8Array.from(atob(res.base64),c=>c.charCodeAt(0));
    const blob=new Blob([bytes],{type:res.mimeType||'application/octet-stream'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;
    a.download=res.fileName||'anexo';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1500);
  }catch(e){alert('Não foi possível abrir o anexo: '+(e.message||e))}
}

async function deleteSacAttachment(sacId,attachmentId){
  if(!nucleoFeatureRequire('sac','edit'))return;
  if(!confirm('Excluir este anexo do SAC?'))return;
  const record=getExternalRoControls().find(x=>String(x.id)===String(sacId));
  if(!record)return;
  try{
    const unit=normalizePortalUnit(record.unit||record.unidade||'matriz');
    const res=await portalJsonp({
      acao:'nucleo_drive_sac_delete',
      unit,
      sacId,
      attachmentId,
      eventoId:'SACATTDEL-'+Date.now()+'-'+Math.random().toString(36).slice(2,8)
    },60000);
    if(!res?.sucesso)throw new Error(res?.erro||'Não foi possível excluir o anexo.');
    await refreshSacAttachments(sacId);
  }catch(e){alert('Não foi possível excluir o anexo: '+(e.message||e))}
}

function openSacEditModal(id){
  if(!nucleoFeatureRequire('sac','edit'))return;
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
  renderSacAttachmentList(r);
  setTimeout(()=>refreshSacAttachments(r.id),0);
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

function saveExternalRoControl(){
  if(!nucleoFeatureRequire('sac','edit'))return;
  if(!isAdmin())return;
  const ro=String(document.getElementById('externalRoNumber')?.value||'').trim();

  // Não comparar somente os dígitos da R.O.
  // RO-EX-00485 e RO-IN-00485 podem existir ao mesmo tempo e são registros distintos.
  const requestedOrigin=roOriginFromNumber(ro,'');
  const canonicalRo=appRoNumber(ro,requestedOrigin||'Externa');

  const baseRoRecord=getAllRoRecords().find(x=>{
    const rawNumber=x?.numero||x?.id||x?.codigo||'';
    const recordOrigin=String(
      x?.origemBase||
      x?.raw?.__origemBase||
      roOriginFromNumber(rawNumber,'')
    ).trim();

    const recordCanonical=appRoNumber(rawNumber,recordOrigin||requestedOrigin||'Externa');

    return recordCanonical===canonicalRo &&
      (!requestedOrigin || recordOrigin===requestedOrigin || roOriginFromNumber(rawNumber,'')===requestedOrigin);
  });

  const baseOrigin=String(
    baseRoRecord?.origemBase||
    baseRoRecord?.raw?.__origemBase||
    roOriginFromNumber(baseRoRecord?.numero||baseRoRecord?.id||baseRoRecord?.codigo||'','')
  ).trim();

  // Uma R.O. explicitamente RO-EX é externa e nunca deve ser bloqueada
  // porque exista uma RO-IN com o mesmo número sequencial.
  const isExternalRo=requestedOrigin==='Externa' ||
    baseRoRecord?.ehSac===true ||
    baseOrigin==='Externa';

  const isInternalRo=requestedOrigin==='Interna' ||
    (!!baseRoRecord && !isExternalRo && baseOrigin==='Interna');

  if(isInternalRo){
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
  if(!nucleoFeatureRequire('sac','edit'))return;
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
  if(!nucleoFeatureRequire('sac','edit'))return;
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

function nucleoSacDraftKey(){const u=getSession();return 'nucleo-sac-pending-v1:'+String(u?.personId||u?.email||u?.name||'');}

function nucleoSacDrafts(){try{return JSON.parse(localStorage.getItem(nucleoSacDraftKey())||'[]');}catch(e){return [];}}

function nucleoSacDraftPut(record){const list=nucleoSacDrafts().filter(r=>r.id!==record.id);list.push(record);try{localStorage.setItem(nucleoSacDraftKey(),JSON.stringify(list));}catch(e){throw new Error('Não foi possível guardar a decisão localmente. O armazenamento deste navegador está indisponível ou cheio.');}}

function nucleoSacDraftRemove(id){localStorage.setItem(nucleoSacDraftKey(),JSON.stringify(nucleoSacDrafts().filter(r=>r.id!==id)));}

function nucleoRenderSacDrafts(){const host=document.getElementById('sacLocalPending');if(!host)return;host.innerHTML='';const list=nucleoSacDrafts();host.hidden=!list.length;if(!list.length)return;const title=document.createElement('h3');title.textContent='Pendências locais do SAC';host.appendChild(title);const note=document.createElement('p');note.className='small';note.textContent='Guardadas apenas neste navegador e computador. Ainda não confirmadas na base central.';host.appendChild(note);list.forEach(r=>{const row=document.createElement('div');row.className='actions';const label=document.createElement('span');label.textContent=(r.ro||r.id)+' — '+(r.sacDecision==='ro_only'?'Somente R.O.':'Gerar SAC');row.appendChild(label);const btn=document.createElement('button');btn.type='button';btn.className='btn primary';btn.textContent='Tentar novamente';btn.onclick=()=>nucleoRetrySacDraft(r,btn);row.appendChild(btn);const del=document.createElement('button');del.type='button';del.className='btn secondary';del.textContent='Descartar pendência local';del.onclick=()=>{if(confirm('Descartar esta pendência local? Isso não altera a base central.')){nucleoSacDraftRemove(r.id);nucleoRenderSacDrafts();}};row.appendChild(del);host.appendChild(row);});}

async function nucleoRetrySacDraft(record,button){button.disabled=true;button.textContent='Conferindo a base…';try{const current=await portalJsonp({acao:'portal_get_record',colecao:'external_ro_controls',id:record.id},15000);if(!current?.sucesso)throw new Error(current?.erro||'Não foi possível conferir a versão central.');if(current.registro&&String(current.registro.updatedAt||'')>String(record.updatedAt||''))throw new Error('Existe uma versão mais recente na base. Sincronize e revise a decisão antes de descartar esta pendência.');await saveSacDecisionLocally(record);renderExternalRoControl();refreshMenuNotificationBadges();alert('Decisão confirmada na base central.');}catch(e){hideNucleoLoading();alert(e.message);}finally{button.disabled=false;button.textContent='Tentar novamente';}}

function nucleoRenderSacEmailSettings(){
 const unit=document.getElementById('qualityConfigUnit')?.value||'matriz',parent=document.getElementById('unitQualitySettings');if(!parent)return;
 let box=document.getElementById('sacEmailSettings');if(!box){box=document.createElement('section');box.id='sacEmailSettings';box.className='settings-block';parent.appendChild(box);}box.hidden=!nucleoPersonFeatureCan('sectors','emails');if(box.hidden)return;
 const selected=unitConfiguration(unit)?.sacEmailRecipients||[],sectors=getConfiguredSectors(unit),users=getOperationalUsers().filter(u=>u.active!==false&&u.email);
 box.innerHTML='<h3>Destinatários dos SACs — '+escapeHtml(unit==='filial'?'Filial':'Matriz')+'</h3><p>Marque as pessoas por setor. As cópias fixas da unidade também serão incluídas. Salve pelo botão abaixo.</p>';
 sectors.forEach(sector=>{const list=users.filter(u=>userHasUnitSector(u,unit,sector));if(!list.length)return;const group=document.createElement('details'),title=document.createElement('summary');title.textContent=sector;group.appendChild(title);list.forEach(u=>{const label=document.createElement('label');label.style.cssText='display:flex;align-items:center;gap:10px;margin:10px 0';const input=document.createElement('input');input.type='checkbox';input.style.cssText='width:22px;height:22px';input.dataset.person=String(u.personId||u.email||u.name);input.dataset.sector=sector;input.checked=selected.some(r=>r.person===input.dataset.person&&r.sector===sector);label.append(input,document.createTextNode(u.name+' — '+u.email));group.appendChild(label);});box.appendChild(group);});
 const btn=document.createElement('button');btn.className='btn primary';btn.textContent='Salvar destinatários dos SACs';btn.onclick=async()=>{btn.disabled=true;try{const recipients=[...box.querySelectorAll('input:checked')].map(i=>({person:i.dataset.person,sector:i.dataset.sector}));const r=await portalJsonp({acao:'portal_save_unit_config',unit,data:JSON.stringify({sacEmailRecipients:recipients})},60000);if(!r?.sucesso)throw new Error(r?.erro||'Não confirmado.');const configs=JSON.parse(localStorage.getItem('nucleo-unit-configs')||'[]'),old=configs.find(c=>c.id===unit)||{};localStorage.setItem('nucleo-unit-configs',JSON.stringify(configs.filter(c=>c.id!==unit).concat({...old,id:unit,unit,sacEmailRecipients:recipients})));alert('Destinatários dos SACs salvos na base central.');}catch(e){alert(e.message);}finally{btn.disabled=false;}};box.appendChild(btn);
}

function nucleoSacMailKey(id){return 'nucleo-sac-mail-v1:'+String(getSession()?.personId||getSession()?.email||'')+':'+id;}

async function finalizeAndSendSac(id){
 if(!nucleoFeatureRequire('sac','finalize'))return;const record=getExternalRoControls().find(r=>String(r.id)===String(id));if(!record)return;
 const missing=sacRequiredMissing(record);if(missing.length){alert('Preencha antes de preparar: '+missing.join(', '));return;}
 let dialog=document.getElementById('sacEmailReview');dialog?.remove();dialog=document.createElement('dialog');dialog.id='sacEmailReview';dialog.style.cssText='width:min(850px,94vw);max-height:90vh;border:0;border-radius:16px;padding:24px;z-index:100060';dialog.innerHTML='<h2>Conferir envio do SAC</h2><p id="sacMailStatus" role="status">Preparando destinatários e PDF…</p><div id="sacMailFields"></div><button type="button" class="btn secondary" id="sacMailClose">Fechar</button>';document.body.appendChild(dialog);dialog.querySelector('#sacMailClose').onclick=()=>dialog.close();const restart=document.createElement('button');restart.className='btn secondary';restart.textContent='Descartar rascunho local e preparar novamente';restart.onclick=()=>{if(confirm('Descartar o rascunho local e preparar novamente? Nenhum e-mail será enviado agora.')){localStorage.removeItem(nucleoSacMailKey(id));finalizeAndSendSac(id);}};dialog.appendChild(restart);dialog.showModal();
 const status=dialog.querySelector('#sacMailStatus');let local=null;try{local=JSON.parse(localStorage.getItem(nucleoSacMailKey(id))||'null');}catch(_){}
 try{let r;if(local?.draft?.token){r=await portalJsonp({acao:'portal_finalize_sac',mode:'status',id,draftToken:local.draft.token},60000);if(r?.sucesso&&r.state==='sent'){localStorage.removeItem(nucleoSacMailKey(id));status.textContent='Este envio já foi confirmado. Nenhum novo e-mail foi enviado.';await portalBackendSync({silent:true});return;}if(r?.sucesso&&r.state==='sending'){status.textContent='O envio anterior está sem confirmação. Confira os e-mails e o histórico antes de reenviar. O rascunho continua salvo.';return;}if(!r?.sucesso)throw new Error(r?.erro||'Não foi possível conferir a pendência.');}else r=await portalJsonp({acao:'portal_finalize_sac',mode:'prepare',id},90000);
 if(!r?.sucesso||!r.draft)throw new Error(r?.erro||'Não foi possível preparar o SAC.');const draft=r.draft,host=dialog.querySelector('#sacMailFields');
 host.innerHTML='<p><b>Para:</b> <span id="sacMailTo"></span></p><p><b>Cópia:</b> <span id="sacMailCc"></span></p><label>Assunto<input id="sacMailSubject" maxlength="200"></label><label>Mensagem<textarea id="sacMailBody" rows="9" maxlength="12000"></textarea></label><p id="sacMailPdfName"></p><button class="btn secondary" id="sacMailPdf">Abrir PDF em outra aba</button><label style="display:flex;gap:10px;align-items:center;margin:16px 0"><input id="sacMailChecked" type="checkbox" style="width:24px;height:24px">Conferi os destinatários, a mensagem e o PDF.</label><div class="actions"><button class="btn secondary" id="sacMailLocal">Guardar para depois</button><button class="btn primary" id="sacMailSend" disabled>Confirmar e enviar e-mail</button></div>';
 host.querySelector('#sacMailTo').textContent=draft.to;host.querySelector('#sacMailCc').textContent=draft.cc||'Sem cópias';host.querySelector('#sacMailSubject').value=local?.subject||draft.subject;host.querySelector('#sacMailBody').value=local?.body||draft.body;host.querySelector('#sacMailPdfName').textContent='Anexo: '+draft.pdfName;
 const saveLocal=()=>{const data={draft,subject:host.querySelector('#sacMailSubject').value,body:host.querySelector('#sacMailBody').value};localStorage.setItem(nucleoSacMailKey(id),JSON.stringify(data));return data;};saveLocal();host.querySelector('#sacMailSubject').oninput=host.querySelector('#sacMailBody').oninput=()=>{try{saveLocal();}catch(e){status.textContent='O navegador não conseguiu guardar o rascunho local.';}};
 host.querySelector('#sacMailLocal').onclick=()=>{try{saveLocal();status.textContent='Rascunho guardado neste navegador. Abra Preparar e-mail neste SAC para continuar.';}catch(e){status.textContent='Não foi possível guardar localmente.';}};
 host.querySelector('#sacMailChecked').onchange=e=>host.querySelector('#sacMailSend').disabled=!e.target.checked;
 host.querySelector('#sacMailPdf').onclick=async()=>{const tab=window.open('about:blank','_blank');if(!tab){status.textContent='Permita abrir a aba do PDF neste navegador.';return;}tab.opener=null;tab.document.body.textContent='Carregando PDF…';try{const pdf=await portalJsonp({acao:'portal_finalize_sac',mode:'pdf',id,draftToken:draft.token},90000);if(!pdf?.sucesso)throw new Error(pdf?.erro||'PDF indisponível.');const bytes=Uint8Array.from(atob(pdf.base64),c=>c.charCodeAt(0)),url=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));tab.location.replace(url);setTimeout(()=>URL.revokeObjectURL(url),300000);}catch(e){tab.document.body.textContent=e.message;}};
 host.querySelector('#sacMailSend').onclick=async()=>{const btn=host.querySelector('#sacMailSend');btn.disabled=true;try{const data=saveLocal();status.textContent='Enviando e conferindo…';await portalPostForm({acao:'portal_finalize_sac',mode:'send',id,draftToken:draft.token,message:JSON.stringify({subject:data.subject,body:data.body})});let result;for(let i=0;i<20;i++){await new Promise(resolve=>setTimeout(resolve,1500));result=await portalJsonp({acao:'portal_finalize_sac',mode:'status',id,draftToken:draft.token},15000);if(result?.state==='failed')throw new Error(result.draft?.error||'O servidor não conseguiu enviar. O rascunho ficou guardado.');if(result?.state==='sent')break;}if(result?.state!=='sent')throw new Error('O envio ainda não foi confirmado. O rascunho ficou guardado. Confira antes de tentar novamente.');localStorage.removeItem(nucleoSacMailKey(id));status.textContent='E-mail enviado e confirmado. PDF versão '+draft.version+'.';host.querySelector('#sacMailChecked').disabled=true;await portalBackendSync({silent:true});renderExternalRoControl();}catch(e){status.textContent=e.message+' Abra novamente este SAC para consultar o resultado ou retomar o rascunho.';}finally{if(status.textContent.indexOf('E-mail enviado')!==0)btn.disabled=false;}};
 status.textContent='Confira o conteúdo. O e-mail ainda não foi enviado.';
 }catch(e){status.textContent=e.message;}
}

