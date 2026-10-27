/* NÚCLEO MODULE: indicators | v2.0.0-test | funções migradas: 16 */

function sgqIndicatorStatusCode(ro,triageMap){
  const map=triageMap instanceof Map?triageMap:getSavedTriageMap();
  const baseSituation=baseTriageSituation(ro);
  if(baseSituation.code==='cancelled')return 'cancelled';
  if(baseSituation.code==='record')return 'record';
  if(baseSituation.code==='directed')return 'directed';

  const tri=resolvedTriageForRo(ro,map)||{};
  if(tri.decision==='obsolete')return 'obsolete';

  // Estados posteriores à triagem só são considerados quando a base não está
  // classificando a R.O. como Registro/Cancelada/Enviada.
  const status=normalizeAnswer(ro?.statusOperacional||ro?.raw?.__statusOperacional||'');
  if(status.includes('em analise') || status.includes('em análise') || status==='analise' || status==='análise')return 'analysis';
  if(status.includes('conclu'))return 'done';
  return 'triage';
}

function sgqIndicatorDate(ro){
  const values=[
    ro?.data,
    ro?.dataReclamacao,
    ro?.raw?.['Carimbo de data/hora'],
    ro?.raw?.['Data'],
    ro?.raw?.['Data da R.O.'],
    ro?.raw?.['Data R.O.']
  ];
  for(const value of values){
    const s=String(value||'').trim();
    if(!s || s==='—')continue;
    const br=parseBrDate(s);
    if(br)return new Date(br.getFullYear(),br.getMonth(),br.getDate());
    const d=new Date(s);
    if(!Number.isNaN(d.getTime()))return new Date(d.getFullYear(),d.getMonth(),d.getDate());
  }
  return null;
}

function sgqIndicatorFilterState(){
  return {
    unit:document.getElementById('sgqIndicatorUnit')?.value||'all',
    origin:document.getElementById('sgqIndicatorOrigin')?.value||'all',
    period:document.getElementById('sgqIndicatorPeriod')?.value||'all',
    status:document.getElementById('sgqIndicatorStatus')?.value||'all',
    classification:document.getElementById('sgqIndicatorClassification')?.value||'all',
    decisionId:document.getElementById('sgqIndicatorDecision')?.value||'all',
    from:document.getElementById('sgqIndicatorDateFrom')?.value||'',
    to:document.getElementById('sgqIndicatorDateTo')?.value||''
  };
}

function sgqIndicatorMatchesFilters(ro,triageMap,filters){
  if(filters.unit!=='all' && !sameCanonicalUnit(ro?.unidade||'',filters.unit))return false;
  if(filters.origin!=='all' && String(ro?.origemBase||ro?.raw?.__origemBase||'').trim()!==filters.origin)return false;

  if(filters.decisionId&&filters.decisionId!=='all'){const tri=resolvedTriageForRo(ro,triageMap)||{};if((tri.decisionId||tri.decision)!==filters.decisionId)return false;}
  if(filters.classification&&filters.classification!=='all'&&!nucleoRoClassifications(ro,triageMap).some(name=>normalizeAnswer(name)===normalizeAnswer(filters.classification)))return false;
  const statusCode=sgqIndicatorStatusCode(ro,triageMap);
  if(filters.status!=='all' && statusCode!==filters.status)return false;

  const date=sgqIndicatorDate(ro);
  if(filters.period!=='all'){
    if(!date)return false;
    const today=new Date();
    const end=new Date(today.getFullYear(),today.getMonth(),today.getDate(),23,59,59);
    let start=null;

    if(filters.period==='custom'){
      if(filters.from){
        const p=filters.from.split('-').map(Number);
        start=new Date(p[0],p[1]-1,p[2],0,0,0);
      }
      let customEnd=end;
      if(filters.to){
        const p=filters.to.split('-').map(Number);
        customEnd=new Date(p[0],p[1]-1,p[2],23,59,59);
      }
      if(start && date<start)return false;
      if(date>customEnd)return false;
    }else{
      const days=Number(filters.period)||0;
      start=new Date(end);
      start.setDate(start.getDate()-days+1);
      start.setHours(0,0,0,0);
      if(date<start || date>end)return false;
    }
  }
  return true;
}

function populateSgqIndicatorUnits(){
  const sel=document.getElementById('sgqIndicatorUnit');
  if(!sel)return;
  const current=sel.value||'all';
  const units=[...new Set(getAllRoRecords().map(r=>canonicalUnitName(r.unidade||'')).filter(Boolean))]
    .sort((a,b)=>a.localeCompare(b,'pt-BR'));
  sel.innerHTML='<option value="all">Todas as unidades</option>'+
    units.map(u=>`<option value="${escapeHtml(u)}">${escapeHtml(u)}</option>`).join('');
  if([...sel.options].some(o=>o.value===current))sel.value=current;
}

function refreshSgqIndicatorPeriodFields(){
  const custom=document.getElementById('sgqIndicatorCustomPeriod');
  if(custom)custom.classList.toggle('hidden',(document.getElementById('sgqIndicatorPeriod')?.value||'all')!=='custom');
}

function clearSgqIndicatorFilters(){
  ['sgqIndicatorUnit','sgqIndicatorOrigin','sgqIndicatorPeriod','sgqIndicatorStatus','sgqIndicatorClassification','sgqIndicatorDecision'].forEach(id=>{
    const el=document.getElementById(id);
    if(el)el.value='all';
  });
  const from=document.getElementById('sgqIndicatorDateFrom');
  const to=document.getElementById('sgqIndicatorDateTo');
  if(from)from.value='';
  if(to)to.value='';
  refreshSgqIndicatorPeriodFields();
  renderSgqIndicators();
}

function sgqIndicatorData(preloadedMap=null,preloadedRos=null){
  const triageMap=preloadedMap instanceof Map?preloadedMap:getSavedTriageMap();
  const filters=sgqIndicatorFilterState();
  const sourceRos=Array.isArray(preloadedRos)?preloadedRos:getAllRoRecords();
  const rosAll=sourceRos.filter(ro=>sgqIndicatorMatchesFilters(ro,triageMap,filters));
  const sent=getAllSentPdcas();
  const byRo=new Map();
  sent.forEach(p=>{
    const key=String(p.ro||p.roId||'').trim();
    if(key)byRo.set(key,p);
  });

  const statusCounts={analysis:0,record:0,cancelled:0,directed:0,triage:0,done:0};
  rosAll.forEach(ro=>{
    const code=sgqIndicatorStatusCode(ro,triageMap);
    statusCounts[code]=(statusCounts[code]||0)+1;
  });

  let totalRO=0,pendingPDCA=0,noPresentation=0,overduePDCA=0;
  let openActions=0,overdueActions=0,presented=0,doneActions=0;
  const sectorMap={};
  const actionCounts={pending:0,overdue:0,review:0,done:0};
  const now=new Date();

  rosAll.forEach(baseRo=>{
    const roKey=String(baseRo.numero||baseRo.id||baseRo.codigo||'').trim();
    const tri=resolvedTriageForRo(baseRo,triageMap)||{};
    const ro=syncContestStateToRo({...baseRo});
    const decision=String(tri.decision||'').trim();

    const sector=canonicalSectorName(tri.decisionSector||tri.responsibleSector) || effectiveRoSector(baseRo,triageMap) || 'Sem setor';
    const sectorKey=sectorCompareKey(sector)||'semsetor';
    if(!sectorMap[sectorKey])sectorMap[sectorKey]={name:sector,total:0,pending:0,overdue:0};
    sectorMap[sectorKey].total++;
    // Registro, cancelamento e obsolescência contam como ocorrências, sem cobrança de PDCA.
    const required=decision==='directed' && tri.pdcaRequired!==false;
    if(!required)return;
    totalRO++;

    const p=byRo.get(roKey);
    if(!p){
      pendingPDCA++;
      sectorMap[sectorKey].pending++;
      const d=parseBrDate(tri.pdcaDeadline||effectiveRoDeadline(baseRo));
      if(d&&d<now){
        overduePDCA++;
        sectorMap[sectorKey].overdue++;
      }
      return;
    }

    const ps=pdcaStatusLabel(p);
    if(ps==='Pendente'){
      pendingPDCA++;
      sectorMap[sectorKey].pending++;
    }
    if(!p.apresentadoEm&&ps!=='Pendente')noPresentation++;
    if(p.apresentadoEm)presented++;

    const pd=parseBrDate(tri.pdcaDeadline||effectiveRoDeadline(baseRo)||p.prazo||p.dataLimite||(p.answers||{}).p9||'');
    if(pd&&pd<now&&ps==='Pendente'){
      overduePDCA++;
      sectorMap[sectorKey].overdue++;
    }

    allPdcaActionsForRecord(p).forEach(a=>{
      const pseudo={...p,answers:{...(p.answers||{}),p11:a.action,p12:a.deadline,p13:a.owner},acaoConferidaEm:a.completedAt||a.acaoConferidaEm};
      const ac=inferActionStatus(pseudo);
      actionCounts[ac.code]=(actionCounts[ac.code]||0)+1;
      if(ac.code==='done')doneActions++;
      else openActions++;
      if(ac.code==='overdue')overdueActions++;
    });
  });

  return {
    filteredRO:rosAll.length,
    filters,
    statusCounts,
    totalRO,pendingPDCA,noPresentation,overduePDCA,
    openActions,overdueActions,presented,doneActions,sectorMap,actionCounts,
    triageMap,filteredRows:rosAll,sourceRows:sourceRos,sentPdcas:sent
  };
}

function sgqIndicatorMonthlyData(rows){
  const map=new Map();
  (rows||[]).forEach(ro=>{
    const d=sgqIndicatorDate(ro);
    if(!d)return;
    const key=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
    map.set(key,(map.get(key)||0)+1);
  });
  return [...map.entries()]
    .sort((a,b)=>a[0].localeCompare(b[0]))
    .slice(-12)
    .map(([key,value])=>{
      const [y,m]=key.split('-').map(Number);
      const label=new Date(y,m-1,1).toLocaleDateString('pt-BR',{month:'short'});
      return {key,label:label.replace('.',''),value};
    });
}

function renderSgqIndicators(){
  if(!nucleoPersonFeatureCan('indicators','consult'))return;

  // Carrega a base uma única vez para esta renderização.
  const allRows=getAllRoRecords();
  const triageMap=getSavedTriageMap();

  nucleoRefreshIndicatorDecisions(triageMap,allRows);
  nucleoRefreshIndicatorClassificationOptions();

  const d=sgqIndicatorData(triageMap,allRows);
  nucleoRenderClassificationIndicators(d);

  const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v};
  set('kpiFilteredRO',d.filteredRO);
  set('kpiStatusAnalysis',d.statusCounts.analysis||0);
  set('kpiStatusRecord',d.statusCounts.record||0);
  set('kpiStatusCancelled',d.statusCounts.cancelled||0);
  set('kpiTotalRO',d.totalRO);
  set('kpiPendingPDCA',d.pendingPDCA);
  set('kpiNoPresentation',d.noPresentation);
  set('kpiOverduePDCA',d.overduePDCA);
  set('kpiOpenActions',d.openActions);
  set('kpiOverdueActions',d.overdueActions);
  set('kpiPresented',d.presented);
  set('kpiDoneActions',d.doneActions);

  const sectors=Object.values(d.sectorMap).sort((a,b)=>String(a.name||'').localeCompare(String(b.name||''),'pt-BR'));
  const sectorBox=document.getElementById('sgqBySector');
  if(sectorBox){
    sectorBox.innerHTML=sectors.length?sectors.map(x=>`
      <div class="sgq-row">
        <span><b>${escapeHtml(x.name||'Sem setor')}</b></span>
        <span>${x.total} R.O. · ${x.pending} pendente${x.pending===1?'':'s'} · ${x.overdue} atrasado${x.overdue===1?'':'s'}</span>
      </div>`).join(''):'<div class="small">Sem dados.</div>';
  }

  const labels={pending:'Pendentes',overdue:'Atrasadas',review:'Possível conclusão',done:'Concluídas'};
  const actionBox=document.getElementById('sgqActionStatus');
  if(actionBox){
    actionBox.innerHTML=['pending','overdue','review','done'].map(k=>`
      <div class="sgq-row">
        <span>${labels[k]}</span>
        <b>${d.actionCounts[k]||0}</b>
      </div>`).join('');
  }

  const summary=document.getElementById('sgqIndicatorFilterSummary');
  if(summary){
    const parts=[];
    if(d.filters.classification!=='all')parts.push('Classificação: '+d.filters.classification);
    if(d.filters.unit!=='all')parts.push('Unidade: '+d.filters.unit);
    if(d.filters.origin!=='all')parts.push('Entrada: '+(d.filters.origin==='Externa'?'Externa/SAC':d.filters.origin));
    if(d.filters.status!=='all'){
      const labelsStatus={analysis:'Em análise',record:'Somente para registro',cancelled:'Cancelada',directed:'Direcionada / com PDCA',triage:'Aguardando triagem',done:'Concluída / retorno entregue'};
      parts.push('Status: '+(labelsStatus[d.filters.status]||d.filters.status));
    }
    if(d.filters.period!=='all'){
      parts.push(d.filters.period==='custom'?'Período personalizado':'Últimos '+d.filters.period+' dias');
    }
    summary.textContent=(parts.length?parts.join(' · ')+' · ':'')+d.filteredRO+' R.O.(s) consideradas';
  }

  nucleoRenderSectorDecisionIndicators(d);
  renderSgqCharts(d);
}

async function showSgqIndicators(){
  if(!nucleoFeatureRequire('indicators','consult'))return;

  view('sgqIndicatorsView');
  setNav('indicators');
  populateSgqIndicatorUnits();
  refreshSgqIndicatorPeriodFields();

  const loading=document.getElementById('sgqBySector');
  if(loading)loading.innerHTML='<div class="small">Calculando indicadores...</div>';

  showNucleoLoading('Analisando R.O.s, PDCAs e ações...','Calculando indicadores');

  try{
    // Duas pinturas antes do cálculo impedem o navegador de marcar a aba como travada
    // antes de conseguir exibir a própria tela de indicadores.
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    renderSgqIndicators();
  }catch(e){
    console.error('Falha ao gerar indicadores SGQ:',e);
    if(loading)loading.innerHTML='<div class="small">Não foi possível gerar os indicadores. Atualize a sincronização e tente novamente.</div>';
  }finally{
    hideNucleoLoading();
  }
}

function nucleoRefreshIndicatorClassificationOptions(){
 const select=document.getElementById('sgqIndicatorClassification');if(!select)return;const value=select.value;
 select.innerHTML='<option value="all">Todas as classificações</option>'+nucleoClassificationOptions().map(name=>'<option value="'+escapeHtml(name)+'">'+escapeHtml(name)+'</option>').join('');
 if([...select.options].some(o=>o.value===value))select.value=value;
}

function nucleoRenderClassificationIndicators(data){
 const host=document.getElementById('sgqByClassification');if(!host)return;
 const map=data?.triageMap instanceof Map?data.triageMap:getSavedTriageMap(),rows=new Map();
 const sourceRows=Array.isArray(data?.filteredRows)?data.filteredRows:[];
 sourceRows.forEach(ro=>{
  const names=nucleoRoClassifications(ro,map);
  (names.length?names:['Sem classificação']).forEach(name=>{const key=normalizeAnswer(name);
  if(!rows.has(key))rows.set(key,{name,total:0,record:0,cancelled:0,obsolete:0,directed:0});
  const row=rows.get(key);row.total++;const status=sgqIndicatorStatusCode(ro,map);if(status in row)row[status]++;});
 });
 host.innerHTML=rows.size?'<p class="small">Uma R.O. com várias classificações é contada em cada uma delas.</p><div style="overflow:auto"><table style="width:100%"><thead><tr><th>Classificação</th><th>Total</th><th>Registro</th><th>Canceladas</th><th>Obsoletas</th><th>Direcionadas</th></tr></thead><tbody>'+[...rows.values()].sort((a,b)=>b.total-a.total||a.name.localeCompare(b.name,'pt-BR')).map(row=>'<tr><td>'+escapeHtml(row.name)+'</td><td>'+row.total+'</td><td>'+row.record+'</td><td>'+row.cancelled+'</td><td>'+row.obsolete+'</td><td>'+row.directed+'</td></tr>').join('')+'</tbody></table></div>':'<p class="small">Nenhuma ocorrência para os filtros escolhidos.</p>';
}

function nucleoSectorDecisionIndicators(data){
 const map=data?.triageMap instanceof Map?data.triageMap:getSavedTriageMap();
 const rows=new Map();
 const sent=Array.isArray(data?.sentPdcas)?data.sentPdcas:getAllSentPdcas();
 const sourceRows=Array.isArray(data?.filteredRows)?data.filteredRows:[];

 // Indexa PDCAs uma vez. Evita varrer toda a lista de PDCAs para cada R.O./setor.
 const sentIndex=new Map();
 sent.forEach(p=>{
   const ro=String(p.ro||p.roId||'').trim();
   if(!ro)return;
   const sector=sectorCompareKey(p.setor||p.sector||'');
   const unit=explicitRecordUnit(p)||'';
   const keys=[
     ro+'|'+sector+'|'+unit,
     ro+'|'+sector+'|',
     ro+'||'+unit,
     ro+'||'
   ];
   keys.forEach(key=>{
     const current=sentIndex.get(key);
     if(!current || String(p.createdAt||p.dataHora||'')>String(current.createdAt||current.dataHora||'')){
       sentIndex.set(key,p);
     }
   });
 });

 sourceRows.forEach(ro=>{
  const resolved=resolvedTriageForRo(ro,map)||{};
  const assignments=resolved.decision==='directed'&&typeof getTriageRecordsForRoNumber==='function'
    ?getTriageRecordsForRoNumber(String(ro.numero||ro.id),map).filter(t=>t.decision==='directed')
    :[];
  const unique=new Map();
  (assignments.length?assignments:[resolved]).forEach(t=>
    unique.set(sectorCompareKey(t.responsibleSector||t.decisionSector||''),t)
  );

  for(const tri of unique.values()){
    const sector=tri.decisionSector||tri.responsibleSector||effectiveRoSector(ro,map)||'Sem setor';
    const key=sectorCompareKey(sector);
    if(!rows.has(key))rows.set(key,{
      name:sector,total:0,cancelled:0,record:0,obsolete:0,
      pending:0,responded:0,presented:0,done:0,triage:0,decisions:new Map()
    });
    const row=rows.get(key);
    row.total++;

    const status=tri.decision||sgqIndicatorStatusCode(ro,map);
    const rule=nucleoDecisionForRecord(ro,tri);
    const label=rule?.label||tri.decisionLabel||triageDecisionLabel(tri.decision);
    row.decisions.set(label,(row.decisions.get(label)||0)+1);

    if(['cancelled','record','obsolete'].includes(status)){row[status]++;continue;}
    if(status!=='directed'){row[status==='done'?'done':'triage']++;continue;}
    if(tri.pdcaRequired===false){row.done++;continue;}

    const roNumber=String(ro.numero||ro.id||'').trim();
    const sectorKey=sectorCompareKey(sector);
    const unit=explicitRecordUnit(ro)||'';
    const p=
      sentIndex.get(roNumber+'|'+sectorKey+'|'+unit) ||
      sentIndex.get(roNumber+'|'+sectorKey+'|') ||
      sentIndex.get(roNumber+'||'+unit) ||
      sentIndex.get(roNumber+'||');

    const ps=pdcaStatusLabel(p);
    row[ps==='Apresentado'?'presented':ps==='Respondido'?'responded':ps==='Concluído'?'done':'pending']++;
  }
 });
 return [...rows.values()].sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'));
}

function nucleoRenderSectorDecisionIndicators(data){
 const host=document.getElementById('sgqBySector');if(!host)return;const rows=nucleoSectorDecisionIndicators(data);
 host.innerHTML=rows.length?'<div style="overflow:auto"><table style="width:100%;min-width:850px"><thead><tr><th>Setor</th><th>Total</th><th>Canceladas</th><th>Registro</th><th>Obsoletas</th><th>Pendentes</th><th>Respondidas</th><th>Apresentadas</th><th>Concluídas</th><th>A triar</th><th>Decisões</th></tr></thead><tbody>'+rows.map(row=>'<tr><td>'+escapeHtml(row.name)+'</td>'+['total','cancelled','record','obsolete','pending','responded','presented','done','triage'].map(key=>'<td>'+row[key]+'</td>').join('')+'<td>'+[...row.decisions].map(([label,count])=>escapeHtml(label)+': '+count).join('<br>')+'</td></tr>').join('')+'</tbody></table></div>':'<p class="small">Nenhuma ocorrência para os filtros.</p>';
}

function nucleoRefreshIndicatorDecisions(preloadedMap=null,preloadedRows=null){
 const select=document.getElementById('sgqIndicatorDecision');
 if(!select)return;
 const current=select.value,mapOptions=new Map();
 const triageMap=preloadedMap instanceof Map?preloadedMap:getSavedTriageMap();
 const rows=Array.isArray(preloadedRows)?preloadedRows:getAllRoRecords();

 for(const unit of nucleoPersonUnits(getSession())){
   for(const rule of nucleoDecisionRules(unit))mapOptions.set(rule.id,rule.label);
 }

 for(const ro of rows){
   const tri=resolvedTriageForRo(ro,triageMap)||{};
   const rule=nucleoDecisionForRecord(ro,tri);
   if(rule)mapOptions.set(rule.id,rule.label);
 }

 select.innerHTML='<option value="all">Todas as decisões</option>'+
   [...mapOptions].map(([id,label])=>'<option value="'+escapeHtml(id)+'">'+escapeHtml(label)+'</option>').join('');
 if([...select.options].some(o=>o.value===current))select.value=current;
}

