/* NÚCLEO MODULE: ro | v2.0.0-test | funções migradas: 61 */

function getRoTimeline(ro){
  if(!ro)return [];
  const id=String(ro.numero||ro.id||ro.codigo||'');const out=[];
  if(ro.data)out.push({at:ro.data,title:'R.O. registrada',text:ro.registrante?('Registrada por '+ro.registrante):'Ocorrência criada.'});
  const tri=getSavedTriageMap().get(id);
  if(tri?.triagedAt)out.push({at:tri.triagedAt,title:'Triagem do SGQ',text:tri.decision==='directed'?('Direcionada para '+(tri.responsibleSector||'setor')+(tri.responsibleUserName?' · '+tri.responsibleUserName:' · todo o setor')+' · criticidade '+(tri.criticality||'Média')):tri.decision==='record'?'Somente para registro':tri.decision==='obsolete'?'R.O. obsoleta':'R.O. cancelada'});
  getContestations().filter(c=>String(c.ro)===id).forEach(c=>{out.push({at:c.createdAt,title:'Contestação enviada',text:c.reason||''});if(c.reviewedAt)out.push({at:c.reviewedAt,title:c.status==='accepted'?'Contestação aceita':'Contestação rejeitada',text:c.reviewNote||''})});
  const sac=findExternalRoControlByRo(id);
  if(sac){
    if(sac.treatmentDefinedAt)out.push({at:sac.treatmentDefinedAt,title:'Classificação e encaminhamento definida',text:externalTreatmentLabel(sac.treatmentType)+(sac.treatmentDeadline?' · prazo '+formatDateBR(sac.treatmentDeadline):'')});
    if(Array.isArray(sac.deadlineHistory)){
      sac.deadlineHistory.forEach(h=>out.push({
        at:h.changedAt,
        title:'Prazo do SAC atualizado',
        text:(h.oldDeadline?formatDateBR(h.oldDeadline):'Sem prazo')+' → '+(h.newDeadline?formatDateBR(h.newDeadline):'Sem prazo')+(h.reason?' · '+h.reason:'')
      }));
    }
    if(sac.treatmentStartedAt)out.push({at:sac.treatmentStartedAt,title:'Classificação e encaminhamento iniciada',text:externalTreatmentLabel(sac.treatmentType)+' · prazo vigente '+formatDateBR(sac.treatmentDeadline)});
    if(sac.treatmentCompletedAt)out.push({at:sac.treatmentCompletedAt,title:'Classificação e encaminhamento concluída',text:externalTreatmentLabel(sac.treatmentType)});
  }
  getAllSentPdcas().filter(p=>String(p.ro)===id).forEach(p=>out.push({at:p.sentAt||p.envio,title:(p.id||'PDCA')+' enviado',text:'Resposta enviada por '+(p.responsavel||p.setor||'setor')}));
  return out.sort((a,b)=>String(a.at||'').localeCompare(String(b.at||'')));
}

function renderRoTimeline(){
  const box=document.getElementById('roTimeline');if(!box||!selected)return;
  const items=getRoTimeline(selected);
  box.innerHTML=items.length?items.map(x=>`<div class="timeline-item"><span class="timeline-dot2"></span><div class="timeline-card"><b>${escapeHtml(x.title)}</b><div class="small">${escapeHtml(formatDateTimeBR(x.at)||String(x.at||''))}</div>${x.text?`<div style="margin-top:4px">${escapeHtml(x.text)}</div>`:''}</div></div>`).join(''):'<div class="small">Sem movimentações registradas.</div>';
}

function getSavedRoFilters(){try{return JSON.parse(localStorage.getItem(SAVED_FILTERS_KEY)||'[]')||[]}catch(e){return []}}

function renderSavedRoFilters(){const sel=document.getElementById('savedRoFilters');if(!sel)return;const list=getSavedRoFilters();sel.innerHTML='<option value="">Filtros salvos...</option>'+list.map(f=>`<option value="${escapeHtml(f.id)}">${escapeHtml(f.name)}</option>`).join('')}

function saveCurrentRoFilter(){
  const name=prompt('Nome para este filtro:','Meu filtro');if(!name)return;
  const f={id:'FLT-'+Date.now(),name:name.trim(),q:document.getElementById('search')?.value||'',status:document.getElementById('filter')?.value||'todas',createdAt:new Date().toISOString(),userKey:notificationUserKey()};
  const list=getSavedRoFilters();list.push(f);localStorage.setItem(SAVED_FILTERS_KEY,JSON.stringify(list));portalBackendSave('saved_filters',f.id,f);renderSavedRoFilters();
}

function applySavedRoFilter(id){const f=getSavedRoFilters().find(x=>x.id===id);if(!f)return;const s=document.getElementById('search'),st=document.getElementById('filter');if(s)s.value=f.q||'';if(st)st.value=f.status||'todas';try{render()}catch(e){}}

function pendingTriageCount(){
  if(!isAdmin())return 0;
  const triageMap=getSavedTriageMap();
  return getAllRoRecords().filter(ro=>roNeedsTriage(ro,triageMap)).length;
}

function testContestEmail(){
  if(!isAdmin())return;
  saveSectorEmails();
  const map=getSectorEmailMap();
  const first=Object.entries(map).find(([,email])=>String(email||'').trim());
  const st=document.getElementById('emailNotificationStatus');

  if(!first){
    if(st){
      st.classList.remove('hidden');
      st.className='statusline';
      st.textContent='Informe ao menos um e-mail de setor para testar.';
    }
    return;
  }

  const n={
    type:'contest',
    title:'Contestação rejeitada',
    message:'O SGQ rejeitou a contestação da RO-TESTE. É necessário responder o PDCA. Motivo da decisão: teste de envio.',
    audience:'sector',
    sector:first[0],
    ro:'RO-TESTE',
    unidade:'Matriz'
  };

  const sent=dispatchNotificationEmail(n);

  if(st){
    st.classList.remove('hidden');
    st.className=sent?'statusline okline':'statusline';
    st.textContent=sent
      ? 'Teste de resposta de contestação solicitado para '+first[1]+'.'
      : 'Não foi possível solicitar o e-mail de contestação. Confira a URL do Apps Script e o e-mail do setor.';
  }
}

function createRoPdfBlob(ro){
  const raw=ro.raw||{};
  const documentModel=nucleoSystemFormat('ro',explicitRecordUnit(ro));
  const title=documentModel?.title||'RELATO DE OCORRÊNCIA';

  const info=[
    ['R.O.', ro.numero||ro.id||ro.codigo||'-'],
    ['Data', ro.data||ro.dataSolicitacao||'-'],
    ['Unidade', ro.unidade||'-'],
    ['Cliente', firstValue(raw,['Nome do cliente:','Nome do cliente','Cliente','Cliente / origem'])||ro.cliente||'Não informado'],
    ['Tipo de ocorrência', ro.tipoRO||ro.assunto||'-'],
    ['Setor identificado', ro.setorIdentificado||'-'],
    ['Setor causa/responsável', ro.setor||'-'],
    ['Status', ro.status||'-'],
    ['Descrição', ro.descricao||'-']
  ];

  const extras=[
    ['Matrícula', firstValue(raw,['Matrícula','Matricula'])],
    ['Responsável pelo registro', firstValue(raw,['Nome e Sobrenome (responsável pelo registro deste formulário):','Nome e Sobrenome (responsável pelo registro deste formulário)'])],
    ['Número do pedido', firstValue(raw,['Número do pedido:','Número do pedido'])],
    ['Código do item', firstValue(raw,['Código do item:','Código do item'])],
    ['Ordem de produção', firstValue(raw,['Ordem de produção (código de barras):','Ordem de produção (código de barras)'])],
    ['Quantidade de peças com desvio', firstValue(raw,['Quantidade de peças com desvio:','Quantidade de peças com desvio'])],
    ['Peso do material descartado/reaproveitado', firstValue(raw,['Peso do material descartado e/ou reaproveitado:','Peso do material descartado e/ou reaproveitado'])],
    ['Liberado pelo setor da qualidade?', firstValue(raw,['Liberado pelo setor de qualidade?','Liberado pelo setor de qualidade'])],
    ['Registro de quem liberou', firstValue(raw,['Registre o nome de quem liberou:','Registre o nome de quem liberou'])],
    ['Ação preventiva', firstValue(raw,['Ação preventiva'])],
    ['Prazo conclusão ação', firstValue(raw,['Prazo conclusão ação'])],
    ['Status planilha', firstValue(raw,['Status'])]
  ].filter(x=>String(x[1]??'').trim()!=='');

  const all=nucleoRoDisplayRows(info.concat(extras),documentModel).map(([label,value])=>[(documentModel?.labels||[]).find(x=>x.from===label)?.to||label,value]);
  if(documentModel?.footer)all.push(['Observação',documentModel.footer]);

  function clean(s){
    return String(s??'')
      .replace(/[^\x20-\x7EÀ-ÿ]/g,' ')
      .replace(/\s+/g,' ')
      .trim();
  }
  function escPdf(s){
    return clean(s).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');
  }
  function wrap(text,max=82){
    const words=clean(text).split(' ');
    const lines=[]; let line='';
    words.forEach(w=>{
      const next=line ? line+' '+w : w;
      if(next.length>max && line){ lines.push(line); line=w; }
      else line=next;
    });
    if(line) lines.push(line);
    return lines.length?lines:['-'];
  }

  const lines=[];
  all.forEach(([label,val])=>{
    const wrapped=wrap(label+': '+(val||'-'));
    wrapped.forEach((x,i)=>lines.push(i===0?x:'   '+x));
  });

  const pageHeight=842, top=790, bottom=55, lineH=15;
  const perPage=Math.floor((top-bottom)/lineH);
  const chunks=[];
  for(let i=0;i<lines.length;i+=perPage-3) chunks.push(lines.slice(i,i+perPage-3));

  const objs=[];
  const pageRefs=[];
  let objNum=3;

  chunks.forEach((chunk,pageIndex)=>{
    const pageObj=objNum++;
    const contentObj=objNum++;
    pageRefs.push(pageObj+' 0 R');

    let content='BT\n/F1 15 Tf\n50 790 Td\n('+escPdf(title)+') Tj\n/F1 9 Tf\n0 -24 Td\n';
    chunk.forEach((line,i)=>{
      if(i>0) content+='0 -'+lineH+' Td\n';
      content+='('+escPdf(line)+') Tj\n';
    });
    content+='ET';

    objs[pageObj]=`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 1 0 R >> >> /Contents ${contentObj} 0 R >>`;
    objs[contentObj]=`<< /Length ${content.length} >>\nstream\n${content}\nendstream`;
  });

  // font is object 1, pages object 2, catalog after pages
  objs[1]='<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
  objs[2]=`<< /Type /Pages /Kids [${pageRefs.join(' ')}] /Count ${pageRefs.length} >>`;
  const catalogObj=objNum++;
  objs[catalogObj]='<< /Type /Catalog /Pages 2 0 R >>';

  let pdf='%PDF-1.4\n', offsets=[0];
  for(let i=1;i<objs.length;i++){
    if(!objs[i]) continue;
    offsets[i]=pdf.length;
    pdf+=i+' 0 obj\n'+objs[i]+'\nendobj\n';
  }
  const xref=pdf.length;
  pdf+='xref\n0 '+objs.length+'\n0000000000 65535 f \n';
  for(let i=1;i<objs.length;i++){
    pdf+=(offsets[i]!==undefined?String(offsets[i]).padStart(10,'0'):'0000000000')+' 00000 n \n';
  }
  pdf+='trailer\n<< /Size '+objs.length+' /Root '+catalogObj+' 0 R >>\nstartxref\n'+xref+'\n%%EOF';

  // PDF literal strings use WinAnsi bytes, not UTF-8. Offsets and stream lengths remain byte-exact.
  return new Blob([Uint8Array.from(pdf,c=>c.charCodeAt(0))],{type:'application/pdf'});
}

function openExternalRoPdf(url){
  const modal=document.getElementById('pdfPreviewModal');
  const frame=document.getElementById('pdfPreviewFrame');
  const head=modal?.querySelector('.pdf-preview-head');
  if(!modal || !frame || !head){
    window.open(url,'_blank','noopener');
    return;
  }

  // Direct embedding of Drive links is often blocked. Present a safe clickable link instead.
  currentPdfBlob=null;
  if(currentPdfUrl){try{URL.revokeObjectURL(currentPdfUrl)}catch(e){} currentPdfUrl=null;}
  frame.src='about:blank';

  let link=document.getElementById('externalRoPdfLink');
  if(!link){
    link=document.createElement('a');
    link.id='externalRoPdfLink';
    link.className='btn primary';
    link.target='_blank';
    link.rel='noopener noreferrer';
    link.textContent='Abrir arquivo da R.O. no Drive';
    head.querySelector('.pdf-preview-actions')?.prepend(link);
  }
  link.href=url;
  link.style.display='';
  modal.classList.add('open');
}

function nucleoBuildRoModelPrintHtml(ro,model,assets={}){
  const layout=model?.universalLayout||{},design=model?.design||{},orientation=design.orientation==='landscape'?'landscape':'portrait',margin=Math.max(5,Math.min(35,Number(model?.marginMm)||10));
  const images={...(assets.standardImagePreviews||{}),...(assets.gridImagePreviews||{})};
  const logo=assets.logoPreviews?.ro||assets.logoPreview||'';
  if(design.logoFileId&&logo&&!images[design.logoFileId])images[design.logoFileId]=logo;
  const header=Array.isArray(layout.headerGrid)?layout.headerGrid:[],body=Array.isArray(layout.bodyGrid)&&layout.bodyGrid.length?layout.bodyGrid:(Array.isArray(model?.layoutGrid)?model.layoutGrid:[]),footer=Array.isArray(layout.footerGrid)?layout.footerGrid:[];
  const evidenceUrls=model?.showEvidence===false?[]:nucleoRoEvidenceUrls(ro);

  // As evidências não devem criar uma folha inteira para cada imagem.
  // Agrupamos até 4 evidências por página (grade 2x2).
  const evidenceGroups=[];
  for(let i=0;i<evidenceUrls.length;i+=4)evidenceGroups.push(evidenceUrls.slice(i,i+4));

  const totalPages=Math.max(1,1+evidenceGroups.length);
  const table=(rows,cls='')=>rows?`<table class="grid ${cls}"><colgroup>${'<col>'.repeat(100)}</colgroup><tbody>${rows}</tbody></table>`:'';
  const pageShell=(pageNo,inner)=>{
    const headerRows=nucleoRoModelRowsHtml(header,ro,model,images,pageNo,totalPages);
    const footerRows=nucleoRoModelRowsHtml(footer,ro,model,images,pageNo,totalPages);
    const fallbackLogo=logo&&!Object.values(images).includes(logo)?`<div style="text-align:${['left','center','right'].includes(design.align)?design.align:'center'};margin-bottom:2mm"><img src="${nucleoRoModelEsc(logo)}" style="width:${Math.max(10,Math.min(80,Number(design.logoWidth)||30))}mm;max-height:25mm;object-fit:contain"></div>`:'';
    return `<section class="page">${fallbackLogo}${layout.repeatHeader===false&&pageNo>1?'':table(headerRows)}${inner}${layout.repeatFooter===false&&pageNo<totalPages?'':(footerRows?`<div class="footer-wrap">${table(footerRows)}</div>`:'')}</section>`;
  };

  const bodyRows=nucleoRoModelRowsHtml(body,ro,model,images,1,totalPages);
  let pages=pageShell(1,`${design.before?`<div class="before">${nucleoRoModelEsc(design.before)}</div>`:''}${table(bodyRows)}${design.after?`<div class="after">${nucleoRoModelEsc(design.after)}</div>`:''}`);

  let evidenceNumber=0;
  evidenceGroups.forEach((group,groupIndex)=>{
    const pageNo=groupIndex+2;
    const cards=group.map(url=>{
      evidenceNumber++;
      const imageUrl=nucleoRoEvidenceImageUrl(url);
      return `<div class="evidence-card">
        <div class="evidence-title">EVIDÊNCIA ${evidenceNumber}</div>
        <div class="evidence-frame">
          <img src="${nucleoRoModelEsc(imageUrl)}" alt="Evidência ${evidenceNumber}" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
          <div class="evidence-fallback" style="display:none">Não foi possível carregar a imagem nesta visualização.<br><a href="${nucleoRoModelEsc(url)}" target="_blank" rel="noopener noreferrer">Abrir evidência ${evidenceNumber}</a></div>
        </div>
      </div>`;
    }).join('');

    pages+=pageShell(pageNo,`<div class="evidence-page"><div class="evidence-section-title">EVIDÊNCIAS ANEXADAS</div><div class="evidence-grid count-${group.length}">${cards}</div></div>`);
  });
  return `<!doctype html><html><head><meta charset="utf-8"><title>${nucleoRoModelEsc(ro?.numero||'R.O.')}</title><style>
  @page{size:A4 ${orientation};margin:0}*{box-sizing:border-box;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}html,body{margin:0;padding:0;background:#e5e7eb;font-family:Arial,Helvetica,sans-serif;color:${nucleoRoModelEsc(design.textColor||'#222222')}}
  .page{width:${orientation==='landscape'?'297mm':'210mm'};height:${orientation==='landscape'?'210mm':'297mm'};margin:0 auto 8mm;background:#fff;padding:${margin}mm;font-size:${Math.max(7,Math.min(18,Number(model?.fontSize)||9))}pt;display:flex;flex-direction:column;overflow:hidden;page-break-after:always}.page:last-child{page-break-after:auto}
  .grid{width:100%;border-collapse:collapse;table-layout:fixed}.grid col{width:1%}.cell-stack{display:flex;flex-direction:column;gap:.35mm;min-width:0}.cell-label{line-height:1.05}.before,.after{white-space:pre-wrap;margin:2mm 0}.footer-wrap{margin-top:auto;padding-top:3mm}
  .evidence-page{display:flex;flex:1;min-height:0;flex-direction:column;padding-top:2mm}.evidence-section-title{font-size:10pt;font-weight:700;margin:0 0 2mm}.evidence-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat(2,minmax(0,1fr));gap:3mm;flex:1;min-height:0}.evidence-grid.count-1{grid-template-columns:1fr;grid-template-rows:1fr}.evidence-grid.count-2{grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:1fr}.evidence-card{display:flex;min-width:0;min-height:0;flex-direction:column;border:.5pt solid #c8cdd3;padding:2mm;overflow:hidden}.evidence-title{font-size:8pt;font-weight:700;margin:0 0 1.5mm}.evidence-frame{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;overflow:hidden}.evidence-frame img{display:block;max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain}.evidence-fallback{text-align:center;font-size:8pt;line-height:1.35}
  @media screen{body{padding:8mm}.page{box-shadow:0 2px 12px #0003}}@media print{body{background:#fff;padding:0}.page{box-shadow:none;margin:0}}
  </style></head><body>${pages}</body></html>`;
}

function nucleoShowRoModelPreview(ro,model,assets){
  const modal=document.getElementById('pdfPreviewModal'),frame=document.getElementById('pdfPreviewFrame');if(!modal||!frame)throw new Error('Visualizador de documento indisponível.');
  currentPdfBlob=null;currentPdfFilename=(ro?.numero||ro?.id||ro?.codigo||'RO')+'.pdf';currentPdfHtmlMode=true;
  if(currentPdfUrl){try{URL.revokeObjectURL(currentPdfUrl)}catch(e){}currentPdfUrl=null;}
  const dl=modal.querySelector('.pdf-preview-actions .btn.primary');if(dl)dl.textContent='Imprimir / Salvar PDF';
  frame.src='about:blank';frame.srcdoc=nucleoBuildRoModelPrintHtml(ro,model,assets||{});modal.classList.add('open');
}

async function openRoPdf(id){
  const wanted=String(id??'').trim();
  const ro=getAllRoRecords().find(r=>String(r.numero||r.id||r.codigo||'').trim()===wanted);

  if(!ro){alert('Não encontrei os dados desta R.O. para gerar o PDF.');return;}

  try{
    const unit=explicitRecordUnit(ro);
    let model=nucleoSystemFormat('ro',unit),assets={};

    // O modelo precisa ser relido ANTES de decidir qual gerador usar. A versão
    // anterior só consultava a base quando o cache local já tinha universalLayout;
    // por isso um cache antigo fazia a R.O. continuar abrindo no PDF legado.
    await showNucleoLoading('Carregando o modelo atual da R.O.…','Conferindo a estrutura salva na base central.');
    try{
      const fresh=await portalJsonp({acao:'nucleo_drive_process_formats',unit,kind:'ro'},60000);
      if(fresh?.sucesso&&fresh.formats?.ro){
        model=fresh.formats.ro;
        assets=fresh;
        // Atualiza o cache para as próximas telas, sem depender de recarregar a página.
        try{
          const configs=JSON.parse(localStorage.getItem('nucleo-unit-configs')||'[]');
          const own=configs.find(x=>x.id===unit)||{id:unit,unit};
          own.documentFormats={...(own.documentFormats||{}),ro:model};
          localStorage.setItem('nucleo-unit-configs',JSON.stringify(configs.filter(x=>x.id!==unit).concat(own)));
        }catch(_){ }
      }
    }catch(e){
      console.warn('Não foi possível reler o modelo atual da R.O.; usando a cópia local.',e);
    }finally{
      hideNucleoLoading(true);
    }

    const u=model?.universalLayout;
    const hasUniversal=!!(u&&Number(u.version)>=2&&(Array.isArray(u.headerGrid)||Array.isArray(u.bodyGrid)||Array.isArray(u.footerGrid)));
    if(hasUniversal){
      nucleoShowRoModelPreview(ro,model,assets);
      return;
    }

    let blob;
    if(model?.design){
      await showNucleoLoading('Gerando PDF com o modelo da unidade…','Aplicando o modelo salvo pela base central.');
      try{const result=await portalJsonp({acao:'portal_ro_model_pdf',ro:ro.numero||ro.id||ro.codigo,origin:ro.origem||ro.origin||''},90000);if(!result?.sucesso||!result.base64)throw Error(result?.erro||'PDF não confirmado pela base central.');blob=new Blob([Uint8Array.from(atob(result.base64),c=>c.charCodeAt(0))],{type:'application/pdf'});}finally{hideNucleoLoading(true);}
    }else blob=createRoPdfBlob(ro);

    if(!(blob instanceof Blob)||blob.size===0)throw new Error('O arquivo PDF foi gerado vazio.');
    showPdfBlob(blob,(ro.numero||ro.id||ro.codigo||'RO')+'.pdf');
  }catch(err){alert('Erro ao gerar o PDF: '+(err?.message||String(err)));}
}

function openCurrentRoPdf(){
  const ro=(typeof selected!=='undefined' && selected) ? selected : (window.currentRO || window.currentRo || null);
  if(!ro){alert('R.O. não encontrada ou indisponível.');return}
  openRoPdf(ro.id||ro.codigo||ro.numero);
}

function refreshRoPdfAccess(){
  const box=document.getElementById('roPdfAccessBox');
  const btn=document.getElementById('roPdfAccessBtn');
  const txt=document.getElementById('roPdfAccessText');
  if(!box||!btn||!txt)return;

  const ro=(typeof selected!=='undefined' && selected) ? selected : (window.currentRO || window.currentRo || null);
  if(!ro || !roPdfAllowed(ro)){
    box.classList.add('hidden');
    return;
  }

  box.classList.remove('hidden');
  btn.disabled=false;
  txt.textContent='Documento original da ocorrência.';
}

async function markExternalRoAsRoOnly(id){
  if(!nucleoFeatureRequire('sac','edit'))return;
  const r=getExternalRoControls().find(x=>String(x.id)===String(id));
  if(!r)return;
  if(!confirm('Manter '+String(r.ro||'esta ocorrência')+' somente como R.O.? Ela sairá da área de SAC.'))return;
  const now=new Date().toISOString();
  const record={...r,sacDecision:'ro_only',sacDecisionAt:now,sacDecisionBy:getSession()?.name||'SGQ',updatedAt:now};
  try{await saveSacDecisionLocally(record)}catch(e){hideNucleoLoading();alert('Não foi possível confirmar a decisão de SAC na base central: '+(e?.message||e));return;}
  renderExternalRoControl();
  refreshMenuNotificationBadges();
}

function triageBaseRoNumber(ro){
  return String(ro?.numero||ro?.id||ro?.codigo||'').trim();
}

function triageSectorPart(value){
  return String(value||'').trim().replace(/::/g,'-');
}

function triageCompositeKey(roNumber,sector){
  const base=String(roNumber||'').trim();
  const sec=triageSectorPart(sector);
  return sec ? `${base}::${sec}` : base;
}

function triageRoNumberPart(value){
  return String(value||'').trim().split('::')[0];
}

function triageDisplayRoNumber(value){
  // A parte após :: é uma chave técnica para diferenciar a mesma R.O. por setor.
  // Nunca deve aparecer na interface.
  return String(value||'').trim().split('::')[0];
}

function triageKeyOf(ro){
  const base=triageBaseRoNumber(ro);
  const explicit=String(ro?.__triageKey||ro?.triageKey||ro?.__triageRecord?.roKey||'').trim();
  if(explicit)return explicit;
  // Em telas com uma R.O. desdobrada por setor, __assignedSector é a identidade
  // daquele vínculo. Nunca volte ao setor original da planilha nesses casos,
  // senão uma ação (ex.: "Temos PDCA") cria uma segunda linha para a mesma R.O.
  const sector=String(ro?.__assignedSector||ro?.setorResponsavelPlanilha||ro?.raw?.__setorResponsavel||ro?.setor||'').trim();
  return sector ? triageCompositeKey(base,sector) : base;
}

function baseTriageSituation(ro){
  // Lê a FONTE ORIGINAL por todos os caminhos possíveis. Isso é importante porque
  // registros restaurados do IndexedDB/localStorage podem não carregar os campos
  // técnicos __setorResponsavel/__statusOperacional, embora ainda tenham Y/AD no raw.
  const raw=ro?.raw||{};
  const sector=String(
    ro?.setorResponsavelPlanilha ||
    raw?.__setorResponsavel ||
    raw?.['Setor (causa)'] ||
    raw?.['Setor causa'] ||
    raw?.['Setor Responsável'] ||
    raw?.['Setor responsável'] ||
    // `ro.setor` em R.O. importada é justamente Setor (causa); só entra como último fallback.
    ro?.setor ||
    ''
  ).trim();
  const sectorNorm=normalizeAnswer(sector);
  const hasSector=!!sector && !['nao direcionado','nao informado','sem setor','-'].includes(sectorNorm);

  // Status ORIGINAL da planilha. Não usar primeiro o rótulo visual de PDCA.
  const rawStatus=String(
    ro?.statusOperacional ||
    raw?.__statusOperacional ||
    raw?.['Status'] ||
    raw?.['Status R.O.'] ||
    raw?.['Status da R.O.'] ||
    // Compatibilidade final com snapshots antigos.
    ro?.status ||
    ''
  ).trim();
  const status=normalizeAnswer(rawStatus);

  // Regra única definida pelo SGQ:
  // Registro/Cancelada/Obsoleto independem de setor; somente Setor + Enviado = Triada.
  // Obsoleto é uma decisão terminal do SGQ: dispensa PDCA e NUNCA volta para a fila de triagem.
  if(status.includes('obsolet'))return {code:'obsolete',decision:'obsolete',sector,hasSector,rawStatus};
  if(status.includes('cancel'))return {code:'cancelled',decision:'cancelled',sector,hasSector,rawStatus};
  if(status.includes('registro')||status==='falta de caixa'||status==='falta de caixas')return {code:'record',decision:'record',sector,hasSector,rawStatus};
  if(hasSector && /\benviad[oa]s?\b/.test(status) && !/\b(?:não|nao)\s+enviad[oa]s?\b/.test(status))return {code:'directed',decision:'directed',sector,hasSector,rawStatus};
  return {code:'new',decision:'',sector,hasSector,rawStatus};
}

function getTriageRecordsForRoNumber(roNumber,map=getSavedTriageMap()){
  const base=String(roNumber||'').trim();
  return [...map.values()].filter(t=>String(t?.roNumber||String(t?.roKey||'').split('::')[0]||'').trim()===base);
}

function getTriageRecordForRoSector(roNumber,sector,map=getSavedTriageMap()){
  const composite=triageCompositeKey(roNumber,sector);
  return map.get(composite)||map.get(String(roNumber||'').trim())||null;
}

function resolvedTriageForRo(ro,map=getSavedTriageMap()){
  if(!ro)return null;
  const base=String(triageBaseRoNumber(ro)||'').trim();
  const exactKey=String(triageKeyOf(ro)||'').trim();

  const deletedKeys=getDeletedTriageKeys();

  const baseSituation=baseTriageSituation(ro);
  const manual=getTriageRecordsForRoNumber(base,map)
    .filter(t=>t?.decision&&!t.importedFromSheet)
    .sort((a,b)=>String(b.triagedAt||'').localeCompare(String(a.triagedAt||'')));
  const exactManual=map.get(exactKey);

  // Regra definitiva:
  // se existe uma triagem MANUAL real, ela vence qualquer marcador antigo de exclusão.
  // O tombstone só representa "limpo" quando não existe mais triagem manual.
  const manualReal=
    (exactManual?.decision&&!exactManual.importedFromSheet?exactManual:null) ||
    (manual.length?manual[0]:null);

  if(manualReal)return manualReal;

  if(deletedKeys.has(base) || (exactKey && deletedKeys.has(exactKey)))return null;

  // A planilha pode indicar situação antiga, mas somente quando não existe
  // marcador administrativo de exclusão.
  if(baseSituation.decision){
    const saved=(exactKey&&map.get(exactKey))||map.get(base)||getTriageRecordsForRoNumber(base,map)[0]||null;
    return {
      ...(saved||{}),
      roKey:baseSituation.decision==='directed' ? triageCompositeKey(base,baseSituation.sector) : base,
      roNumber:base,
      decision:baseSituation.decision,
      responsibleSector:baseSituation.decision==='directed'?baseSituation.sector:(saved?.decisionSector||saved?.responsibleSector||''),
      importedFromSheet:saved?.importedFromSheet??true,
      __synthetic:!saved,
      sourceStatus:baseSituation.rawStatus
    };
  }

  const saved=(exactKey&&map.get(exactKey))||map.get(base)||getTriageRecordsForRoNumber(base,map)[0]||null;

  if(saved?.decision && !saved?.importedFromSheet){
    return saved;
  }

  if(saved?.decision==='obsolete')return saved;
  return null;
}

function roNeedsTriage(ro,map=getSavedTriageMap()){
  const tri=resolvedTriageForRo(ro,map);
  return !String(tri?.decision||'').trim();
}

function getDeletedTriageKeys(){
  try{return new Set(JSON.parse(localStorage.getItem(DELETED_TRIAGE_KEYS_KEY)||'[]').map(String))}catch(e){return new Set()}
}

function saveDeletedTriageKeys(set){
  try{localStorage.setItem(DELETED_TRIAGE_KEYS_KEY,JSON.stringify([...set]))}catch(e){}
}

async function saveDeletedTriageKeysConfirmed(set){
  saveDeletedTriageKeys(set);
  const value=JSON.stringify([...set]);
  const id='global:'+DELETED_TRIAGE_KEYS_KEY;
  const record={
    id,
    key:DELETED_TRIAGE_KEYS_KEY,
    value,
    scope:'global',
    userKey:'',
    updatedAt:new Date().toISOString(),
    updatedBy:getSession()?.name||'SGQ'
  };
  if(portalBackendEnabled()){
    await portalBackendSaveConfirmed('shared_state',id,record);
  }
  return true;
}

function getSavedTriageMap(){
  let map=new Map();
  try{
    const arr=JSON.parse(localStorage.getItem(TRIAGE_KEY)||'[]');
    if(Array.isArray(arr))map=new Map(arr.map(x=>[String(x.roKey||''),x]));
  }catch(e){map=new Map()}

  // "Importado da planilha" é origem do dado, não uma decisão/classificação SGQ.
  [...map.values()].forEach(tri=>{
    if(tri?.importedFromSheet && normalizeAnswer(tri.classification||'')==='importado da planilha'){
      tri.classification='';
    }
  });

  // Migra chaves antigas "RO-00000" somente quando há uma única origem possível.
  // Se Interna e Externa possuem o mesmo número, a chave antiga é ambígua e não
  // é aplicada a nenhuma das duas; cada origem será reconstruída pela planilha.
  try{
    const allRos=getAllRoRecords();
    const byDigits=new Map();
    allRos.forEach(r=>{
      const digits=roDigits(r.numero);
      if(!digits)return;
      const arr=byDigits.get(digits)||[];
      arr.push(r);
      byDigits.set(digits,arr);
    });

    [...map.entries()].forEach(([oldKey,tri])=>{
      if(/^RO-(?:IN|EX)-\d+$/i.test(oldKey))return;
      const digits=roDigits(oldKey);
      if(!digits)return;
      const candidates=byDigits.get(digits)||[];
      if(candidates.length===1){
        const newKey=String(candidates[0].numero||'');
        if(newKey && !map.has(newKey)){
          map.set(newKey,{...tri,roKey:newKey,migratedFromLegacyKey:oldKey});
        }
        map.delete(oldKey);
      }else if(candidates.length>1 && tri?.importedFromSheet){
        map.delete(oldKey);
      }
    });
  }catch(e){}

  // Remove registros automáticos antigos criados indevidamente como
  // "Não direcionado". Triagens feitas manualmente pelo SGQ são preservadas.
  [...map.entries()].forEach(([key,tri])=>{
    if(tri?.importedFromSheet){
      const sectorNorm=normalizeAnswer(tri.responsibleSector||'');
      if(!tri.responsibleSector || ['nao direcionado','nao informado','sem setor','-'].includes(sectorNorm)){
        map.delete(key);
      }
    }
  });

  // Reconstrói automaticamente a triagem das R.O.s que já possuem
  // Setor/Pessoa/Status preenchidos na planilha.
  // O registro salvo manualmente no Núcleo continua tendo prioridade.
  try{
    const deletedKeys=getDeletedTriageKeys();
    getAllRoRecords().forEach(ro=>{
      const key=triageKeyOf(ro);
      const baseKey=triageBaseRoNumber(ro);
      if(deletedKeys.has(String(key)) || deletedKeys.has(String(baseKey)))return;
      // Uma exclusão antiga de duplicata visual não pode transformar a R.O. em não triada.
      // Se a planilha ainda comprova setor/status, o direcionamento deve ser reconstruído.
      if(!key || map.has(key))return;

      const pessoa=String(ro.pessoaResponsavel||'').trim();
      const baseSituation=baseTriageSituation(ro);
      const setor=baseSituation.sector;
      const decision=baseSituation.decision;

      // Regras literais da coluna Status:
      // setor + Enviado = triada
      // setor/sem setor + Registro = para registro
      // setor/sem setor + Cancelada = cancelada
      // qualquer outro caso = necessita triar
      if(!decision)return;

      let responsibleUserEmail='';
      if(decision==='directed' && pessoa && normalizeAnswer(pessoa)!=='todo o setor'){
        const u=getOperationalUsers().find(user=>
          normalizeAnswer(user.name||'')===normalizeAnswer(pessoa) &&
          normalizeAnswer(user.sector||'')===normalizeAnswer(setor)
        );
        responsibleUserEmail=String(u?.email||'').trim().toLowerCase();
      }

      map.set(key,{
        roKey:key,
        decision,
        classification:'',
        responsibleSector:decision==='directed'?setor:'',
        responsibleUserEmail:decision==='directed'?responsibleUserEmail:'',
        responsibleUserName:decision==='directed'?(pessoa&&normalizeAnswer(pessoa)!=='todo o setor'?pessoa:''):'',
        pdcaRequired:decision==='directed',
        pdcaDeadline:'',
        criticality:'Média',
        note:'Triagem reconhecida automaticamente a partir da planilha.',
        triagedAt:ro.dataEnvioOperacional||'',
        triagedBy:'Planilha',
        importedFromSheet:true
      });
    });
  }catch(e){
    console.warn('Não foi possível reconstruir algumas triagens da planilha.',e);
  }

  return map;
}

function getTriageRecords(){
  const saved=getSavedTriageMap();
  const deletedKeys=getDeletedTriageKeys();

  return getAllRoRecords().map(ro=>{
    const base=String(triageBaseRoNumber(ro)||'').trim();
    const exact=String(triageKeyOf(ro)||'').trim();

    const manual=getTriageRecordsForRoNumber(base,saved)
      .filter(t=>t?.decision&&!t.importedFromSheet)
      .sort((a,b)=>String(b.triagedAt||'').localeCompare(String(a.triagedAt||'')))[0]||null;

    const hasCleanupTombstone=deletedKeys.has(base)||(exact&&deletedKeys.has(exact));

    // Se existe triagem manual, a R.O. já foi efetivamente decidida no TESTE.
    // O tombstone só vale quando a limpeza realmente deixou a R.O. sem triagem manual.
    const deletedInTest=hasCleanupTombstone&&!manual;

    const tri=manual || (deletedInTest?{}:(resolvedTriageForRo(ro,saved)||{}));
    const baseSituation=baseTriageSituation(ro);

    let decision=deletedInTest?'':(tri.decision||baseSituation.decision);

    // Autocorreção local: se chegaram juntos triagem manual e tombstone antigo,
    // a triagem manual é a fonte válida para as telas.
    if(manual && hasCleanupTombstone){
      const repaired=getDeletedTriageKeys();
      let repairedChanged=false;
      if(repaired.delete(base))repairedChanged=true;
      if(exact && repaired.delete(exact))repairedChanged=true;
      if(manual?.roKey && repaired.delete(String(manual.roKey)))repairedChanged=true;
      if(repairedChanged)saveDeletedTriageKeys(repaired);
    }

    let triagemStatus='new';
    if(decision==='directed')triagemStatus='directed';
    if(decision==='record')triagemStatus='record';
    if(decision==='cancelled')triagemStatus='cancelled';
    if(decision==='obsolete')triagemStatus='obsolete';

    return {
      ...ro,
      triagem:tri,
      classificacaoSGQ:tri.classification||'',
      setorDirecionado:deletedInTest?'':(tri.responsibleSector||''),
      pdcaObrigatorio:decision==='directed'&&tri.pdcaRequired!==false,
      prazoPdca:tri.pdcaDeadline||'',
      triagemStatus,
      __triageDeletedInTest:deletedInTest
    };
  });
}

function getConfiguredSectorsForTriage(){
  // A triagem usa somente a lista oficial cadastrada pelo SGQ.
  // Valores históricos da planilha não criam setores automaticamente.
  return getConfiguredSectors()
    .slice()
    .sort((a,b)=>a.localeCompare(b,'pt-BR'));
}

function populateTriageSectors(){
  const sel=document.getElementById('triageSectorFilter');
  if(!sel)return;
  const sectors=getConfiguredSectorsForTriage();
  const current=sel.value||'all';
  sel.innerHTML='<option value="all">Todos os setores</option>'+
    sectors.map(s=>`<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
  if([...sel.options].some(o=>o.value===current))sel.value=current;
}

function populateTriageUnits(){
  const sel=document.getElementById('triageUnitFilter');
  if(!sel)return;

  const current=sel.value||'all';
  const units=[...new Set(
    getAllRoRecords()
      .map(r=>canonicalUnitName(r.unidade||''))
      .filter(v=>v && normalizeAnswer(v)!=='nao informada' && normalizeAnswer(v)!=='nao informado')
  )].sort((a,b)=>a.localeCompare(b,'pt-BR'));

  sel.innerHTML='<option value="all">Todas as unidades</option>'+
    units.map(u=>`<option value="${escapeHtml(u)}">${escapeHtml(u)}</option>`).join('');

  if([...sel.options].some(o=>o.value===current))sel.value=current;
}

function triageDecisionLabel(status){
  if(status==='directed')return 'Direcionar para tratativa';
  if(status==='record')return 'Somente para registro';
  if(status==='cancelled')return 'Cancelar R.O.';
  if(status==='obsolete')return 'Obsoleto';
  return 'Não analisada';
}

function triageStatusLabel(status){
  if(status==='directed')return 'Direcionada';
  if(status==='record')return 'Somente para registro';
  if(status==='cancelled')return 'Cancelada';
  if(status==='obsolete')return 'Obsoleta';
  return 'Aguardando triagem';
}

function triageStatusClass(status){
  if(status==='directed')return 'triage-status-directed';
  if(status==='record')return 'triage-status-record';
  if(status==='cancelled')return 'triage-status-cancelled';
  if(status==='obsolete')return 'triage-status-record';
  return 'triage-status-new';
}

function renderTriage(){
  try{refreshMenuNotificationBadges()}catch(e){}
  if(!nucleoPersonFeatureCan('ros','triage'))return;
  const status=document.getElementById('triageStatusFilter')?.value||'all';
  const sector=document.getElementById('triageSectorFilter')?.value||'all';
  const origin=document.getElementById('triageOriginFilter')?.value||'all';
  const unit=document.getElementById('triageUnitFilter')?.value||'all';
  const q=normalizeAnswer(document.getElementById('triageSearch')?.value||'');

  let rows=getTriageRecords().filter(r=>{
    // Esta tela é exclusivamente a fila de trabalho da triagem.
    // Qualquer R.O. já decidida sai daqui e passa para R.O.s atribuídas.
    if(r.triagemStatus!=='new')return false;
    const sec=r.setorDirecionado||'';
    if(sector!=='all'&&sec!==sector)return false;
    const rowOrigin=String(r.origemBase||r.raw?.__origemBase||'').trim();
    if(origin!=='all'&&rowOrigin!==origin)return false;
    const rowUnit=String(r.unidade||'').trim();
    if(unit!=='all'&&!sameCanonicalUnit(rowUnit,unit))return false;
    if(q){
      const hay=normalizeAnswer([
        r.numero,r.id,r.codigo,r.cliente,r.assunto,r.tipo,r.tipoRO,r.descricao,
        r.classificacaoSGQ,r.setorDirecionado,r.origemBase,r.unidade
      ].join(' '));
      if(!hay.includes(q))return false;
    }
    return true;
  });

  const body=document.getElementById('triageBody');
  if(!body)return;

  body.innerHTML=rows.length?rows.map(r=>{
    const key=String(r.numero||r.id||r.codigo||'').trim();
    const origin=String(r.origemBase||r.raw?.__origemBase||'').trim();
    const pdca=r.triagemStatus==='directed'
      ? `<div class="pdca-requirement"><span class="pdca-requirement-label">PDCA obrigatório</span>${r.prazoPdca?`<span class="pdca-requirement-date"><span class="pdca-calendar">▣</span>${escapeHtml(formatDateBR(r.prazoPdca))}</span>`:''}</div>`
      : r.triagemStatus==='new'
        ? '<span class="status-badge">A definir</span>'
        : r.triagemStatus==='record'
          ? '<span class="status-badge answered">Dispensado</span>'
          : '<span class="status-badge">Não se aplica</span>';

    const decision=nucleoDecisionForRecord(r,r.triagem)?.label||triageDecisionLabel(r.triagemStatus);

    return `<tr>
      <td><b>${escapeHtml(triageDisplayRoNumber(key)||'-')}</b></td>
      <td>${escapeHtml(r.cliente||r.origem||'-')}</td>
      <td>${escapeHtml(r.tipoRO||r.assunto||r.tipo||'-')}</td>
      <td>${escapeHtml(decision)}</td>
      <td>${escapeHtml(r.triagem?.responsibleUserName ? (r.setorDirecionado+' · '+r.triagem.responsibleUserName) : (r.setorDirecionado||'-'))}</td>
      <td>${pdca}</td>
      <td><span style="background:${escapeHtml(nucleoDecisionForRecord(r,r.triagem)?.color||'#eef4ff')}" class="status-badge ${triageStatusClass(r.triagemStatus)}">${escapeHtml(triageStatusLabel(r.triagemStatus))}</span></td>
      <td>
        <div class="triage-actions">
          <button class="btn secondary" type="button" onclick="openRoReport('${escapeHtml(key)}')">Ver R.O.</button>
          <button class="btn ${r.triagemStatus==='new'?'primary':'secondary'}" type="button" onclick="openTriageRecord('${escapeHtml(key)}','${escapeHtml(origin)}')">${r.triagemStatus==='new'?'Triar':'Editar'}</button>
        </div>
      </td>
    </tr>`;
  }).join(''):`<tr><td colspan="8" style="text-align:center;color:#667085;padding:28px">Nenhuma R.O. aguardando triagem corresponde aos filtros atuais.</td></tr>`;
}

function showTriage(){
  if(!nucleoFeatureRequire('ros','triage'))return;
  try{refreshMenuNotificationBadges()}catch(e){}
  view('triageView');
  setNav('triage');
  populateTriageSectors();
  populateTriageUnits();
  renderTriage();
}

function getTriageAssignmentsFromUi(){
  return [...document.querySelectorAll('#triageAssignments .triage-assignment-row')].map(row=>({
    sector:String(row.querySelector('.triage-assignment-sector')?.value||row.dataset.sector||'').trim(),
    originalSector:String(row.dataset.originalSector||'').trim(),
    responsibleUserEmail:String(row.querySelector('.triage-assignment-user')?.value||'').trim().toLowerCase(),
    reason:String(row.querySelector('.triage-assignment-reason')?.value||'').trim()
  })).filter(x=>x.sector);
}

function selectedTriageSectors(){
  return getTriageAssignmentsFromUi().map(x=>x.sector);
}

function triageAssignmentUserOptions(sector,selectedEmail=''){
  const users=usersBySector(sector);
  return '<option value="">Todo o setor</option>'+users.map(u=>`<option value="${escapeHtml(u.email)}" ${String(u.email||'').toLowerCase()===String(selectedEmail||'').toLowerCase()?'selected':''}>${escapeHtml(u.name)} · ${escapeHtml(u.email)}</option>`).join('');
}

function addTriageAssignment(sector='',selectedEmail='',reason='',originalSector=''){
  const picker=document.getElementById('triageSectorPicker');
  const chosen=String(sector||picker?.value||'').trim();
  if(!chosen)return;
  const box=document.getElementById('triageAssignments');
  if(!box)return;
  const existing=[...box.querySelectorAll('.triage-assignment-row')].find(r=>normalizeAnswer(r.dataset.sector||'')===normalizeAnswer(chosen));
  if(existing){
    existing.querySelector('.triage-assignment-user')?.focus();
    if(picker)picker.value='';
    return;
  }
  const row=document.createElement('div');
  row.className='triage-assignment-row';
  row.dataset.sector=chosen;
  row.dataset.originalSector=String(originalSector||chosen).trim();
  row.style.cssText='display:grid;grid-template-columns:minmax(140px,.7fr) minmax(200px,1fr) minmax(260px,1.35fr) auto;gap:8px;align-items:center;padding:8px 0;border-bottom:1px solid #edf1ef';
  const ro=getAllRoRecords().find(r=>String(r.numero||r.id||r.codigo||'')===String(currentTriageRoId));
  const unit=explicitPortalUnit(document.getElementById('triageRoUnit')?.value)||(ro?explicitRecordUnit(ro):'')||adminScopeUnit();
  const sectorList=[...new Set((typeof getConfiguredSectors==='function'?getConfiguredSectors(unit):[]).concat(chosen))]
    .slice()
    .sort((a,b)=>String(a).localeCompare(String(b),'pt-BR'));
  const sectorOptions=sectorList.map(sec=>`<option value="${escapeHtml(sec)}" ${normalizeAnswer(sec)===normalizeAnswer(chosen)?'selected':''}>${escapeHtml(sec)}</option>`).join('');
  row.innerHTML=`<select class="triage-assignment-sector" aria-label="Setor responsável" style="font-weight:700">${sectorOptions}</select><select class="triage-assignment-user">${triageAssignmentUserOptions(chosen,selectedEmail)}</select><input class="triage-assignment-reason" value="${escapeHtml(reason||'')}" placeholder="Motivo deste setor *" aria-label="Motivo do direcionamento para ${escapeHtml(chosen)}"><button class="btn secondary" type="button" onclick="this.closest('.triage-assignment-row').remove()" style="padding:8px 10px">Remover</button>`;
  const sectorSelect=row.querySelector('.triage-assignment-sector');
  sectorSelect?.addEventListener('change',()=>{
    const next=String(sectorSelect.value||'').trim();
    if(!next)return;
    const duplicate=[...box.querySelectorAll('.triage-assignment-row')].some(other=>other!==row&&normalizeAnswer(other.dataset.sector||'')===normalizeAnswer(next));
    if(duplicate){
      alert('Este setor já foi adicionado para esta R.O.');
      sectorSelect.value=row.dataset.sector||chosen;
      return;
    }
    row.dataset.sector=next;
    const userSelect=row.querySelector('.triage-assignment-user');
    if(userSelect)userSelect.innerHTML=triageAssignmentUserOptions(next,'');
  });
  box.appendChild(row);
  if(picker)picker.value='';
}

function refreshTriageResponsibleUsers(){
  document.querySelectorAll('#triageAssignments .triage-assignment-row').forEach(row=>{
    const sector=String(row.querySelector('.triage-assignment-sector')?.value||row.dataset.sector||'').trim();
    const userSelect=row.querySelector('.triage-assignment-user');
    if(!sector||!userSelect)return;
    const current=String(userSelect.value||'').trim().toLowerCase();
    userSelect.innerHTML=triageAssignmentUserOptions(sector,current);
  });
}

function populateTriageRoUnit(selectedUnit){
  const sel=document.getElementById('triageRoUnit');
  if(!sel)return;
  const canonical=canonicalUnitName(selectedUnit||'');
  const units=configuredRoUnits();
  sel.innerHTML=units.map(u=>`<option value="${escapeHtml(u)}">${escapeHtml(u)}</option>`).join('');
  const match=units.find(u=>sameCanonicalUnit(u,canonical));
  if(match)sel.value=match;
}

function openTriageRecord(id,originHint=''){
  if(!nucleoFeatureRequire('ros','triage'))return;
  try{hideNucleoLoading(true)}catch(e){}

  const wanted=String(id||'').trim();
  const base=triageRoNumberPart(wanted)||String(wanted).split('::')[0];
  const origin=String(originHint||roOriginFromNumber(base,'')||'').trim();

  // Primeiro usa o resolvedor robusto já existente no portal.
  let ro=findRoByAnyNumber(base,origin);

  // Fallback: procura na mesma coleção usada para montar a própria fila.
  if(!ro){
    ro=getTriageRecords().find(r=>{
      const num=String(r?.numero||r?.id||r?.codigo||'').trim();
      const org=String(r?.origemBase||r?.raw?.__origemBase||'').trim();
      return num===base && (!origin || org===origin);
    })||null;
  }

  // Último fallback: mesma numeração + mesma origem.
  if(!ro){
    const digits=roDigits(base);
    ro=getAllRoRecords().find(r=>
      roDigits(r?.numero||r?.id||r?.codigo||'')===digits &&
      (!origin || String(r?.origemBase||r?.raw?.__origemBase||'')===origin)
    )||null;
  }

  if(!ro){
    alert(
      'Não consegui localizar os dados da R.O. '+base+'.\\n\\n'+
      'A lista será atualizada. Depois tente clicar em Triar novamente.'
    );
    syncImportedRosFromConfiguredSources({silent:true,force:true})
      .then(()=>{try{renderTriage()}catch(e){}})
      .catch(()=>{});
    return;
  }

  const roNumber=String(ro.numero||ro.id||ro.codigo||base).trim();

  currentTriageRoId=roNumber;
  // Só é edição por vínculo quando a chamada realmente veio de uma chave RO::SETOR.
  currentEditingTriageKey=wanted.includes('::')?wanted:'';

  const overlay=document.getElementById('triageModalOverlay');
  if(!overlay){
    alert('A janela de triagem não foi encontrada na página.');
    return;
  }

  // Limpa qualquer bloqueio residual.
  overlay.removeAttribute('inert');
  overlay.style.pointerEvents='auto';
  overlay.classList.add('open');
  document.body.style.overflow='hidden';

  overlay.querySelectorAll('input,textarea,select,button').forEach(el=>{
    el.style.pointerEvents='auto';
    if(el.type!=='hidden'){
      try{el.disabled=false}catch(e){}
      try{el.readOnly=false}catch(e){}
      el.removeAttribute('aria-disabled');
    }
  });

  try{
    const savedMap=getSavedTriageMap();
    const tri=
      savedMap.get(wanted)||
      savedMap.get(roNumber)||
      getTriageRecordsForRoNumber(roNumber,savedMap)[0]||
      {};

    const raw=ro.raw||{};
    const value=(...vals)=>{
      for(const v of vals){
        if(v!==undefined&&v!==null&&String(v).trim()!=='')return String(v).trim();
      }
      return '';
    };

    const summary=document.getElementById('triageRoSummary');
    if(summary){
      summary.innerHTML=[
        ['R.O.',roNumber],
        ['Unidade',value(ro.unidade,raw.__unidade,'-')],
        ['Cliente',value(ro.cliente,raw.Cliente,raw['Nome do cliente'],'Não informado')],
        ['Tipo de ocorrência',value(ro.tipoRO,ro.assunto,ro.tipo,raw['Tipo de ocorrência'],raw['Tipo de ocorrencia'],'-')],
        ['Setor identificado',value(ro.setorIdentificado,raw['Setor identificado'],raw['Setor'],'-')],
        ['Setor causa da planilha',value(ro.setorResponsavelPlanilha,raw.__setorResponsavel,ro.setor,'-')]
      ].map(([k,v])=>`<div class="triage-summary-item"><span>${escapeHtml(k)}</span><b>${escapeHtml(v)}</b></div>`).join('');
    }

    const decisionEl=document.getElementById('triageDecision');
    if(decisionEl)nucleoPopulateDecisions(ro,tri);

    const classificationEl=document.getElementById('triageClassification');
    if(classificationEl)nucleoLoadClassification(tri,ro);

    populateTriageRoUnit(value(ro.unidade,raw.__unidade,''));

    const sectors=(typeof getConfiguredSectors==='function'?getConfiguredSectors():[])
      .slice()
      .sort((a,b)=>String(a).localeCompare(String(b),'pt-BR'));
    const picker=document.getElementById('triageSectorPicker');
    if(picker){
      picker.innerHTML='<option value="">Selecione um setor...</option>'+
        sectors.map(sec=>`<option value="${escapeHtml(sec)}">${escapeHtml(sec)}</option>`).join('');
    }

    const decisionSector=document.getElementById('triageDecisionSector');
    if(decisionSector){const chosen=tri.decisionSector||tri.responsibleSector||ro.setorResponsavelPlanilha||ro.setor||'';const options=[...new Set(sectors.concat(chosen?[chosen]:[]))];decisionSector.innerHTML='<option value="">Sem setor atribuído</option>'+options.map(sec=>'<option value="'+escapeHtml(sec)+'">'+escapeHtml(sec)+'</option>').join('');decisionSector.value=chosen;}

    const assignmentsBox=document.getElementById('triageAssignments');
    if(assignmentsBox)assignmentsBox.innerHTML='';

    const existingForRo=getTriageRecordsForRoNumber(roNumber,savedMap);
    const targetedAssignment=currentEditingTriageKey
      ? (savedMap.get(currentEditingTriageKey)||tri)
      : null;

    const existingAssignments=targetedAssignment?.responsibleSector
      ? [targetedAssignment]
      : (existingForRo.length?existingForRo:(tri.responsibleSector?[tri]:[]));

    existingAssignments.forEach(x=>
      addTriageAssignment(
        x.responsibleSector,
        x.responsibleUserEmail||'',
        x.assignmentReason||x.reason||'',
        x.responsibleSector
      )
    );

    const noteEl=document.getElementById('triageNote');
    if(noteEl)noteEl.value=tri.note||'';

    updateTriageDecisionUi();
    nucleoAiPanel(ro,tri);

    setTimeout(()=>{
      try{renderTriageDuplicateWarning(ro)}catch(e){}
    },0);

  }catch(err){
    console.error('[NUCLEO TRIAGEM] falha ao preencher modal',err);
    const note=document.getElementById('triageNote');
    if(note&&!note.value){
      note.placeholder='Alguns dados auxiliares não carregaram, mas você pode preencher e salvar a triagem normalmente.';
    }
  }
}

function updateTriageDecisionUi(){
  const rule=nucleoSelectedDecision();const decision=rule.behavior;
  const sectorField=document.getElementById('triageSectorField');
  const title=document.getElementById('triagePdcaRuleTitle');
  const text=document.getElementById('triagePdcaRuleText');
  const noteLabel=document.getElementById('triageNoteLabel');
  const note=document.getElementById('triageNote');

  const directed=decision==='directed';
  const unitCorrection=decision==='unit_correction';
  const motiveRequired=rule.requireReason===true;
  if(noteLabel)noteLabel.textContent=unitCorrection?'Observação da correção':(motiveRequired?'Motivo *':'Observação da triagem');
  if(note)note.placeholder=unitCorrection?'Opcional: informe por que a unidade foi corrigida.':(motiveRequired?'Informe obrigatoriamente o motivo desta decisão.':'Informações do SGQ sobre a classificação, direcionamento ou decisão tomada.');
  sectorField.style.display=directed?'block':'none';
  const decisionSectorField=document.getElementById('triageDecisionSectorField');if(decisionSectorField)decisionSectorField.style.display=['record','cancelled','obsolete'].includes(decision)?'block':'none';

  if(unitCorrection){
    title.textContent='Somente correção cadastral';
    text.textContent='Será alterada apenas a Unidade da R.O. na planilha de origem. A decisão, o setor, o Status e o PDCA permanecerão inalterados.';
  }else if(directed){
    title.textContent=rule.pdcaRequired?'PDCA obrigatório':'PDCA dispensado';
    text.textContent='Escolha o setor e, se necessário, uma pessoa específica. Sem pessoa selecionada, todos os usuários cadastrados no setor recebem a R.O.';
  }else if(decision==='record'){
    title.textContent='PDCA dispensado';
    text.textContent='R.O. marcada como “Somente para registro”. Não será exigido PDCA.';
  }else if(decision==='cancelled'){
    title.textContent='PDCA dispensado';
    text.textContent='R.O. cancelada pelo SGQ. O motivo é obrigatório e não será exigido PDCA.';
  }else{
    title.textContent='PDCA dispensado';
    text.textContent='R.O. marcada como obsoleta pelo SGQ. O motivo é obrigatório e não será exigido PDCA.';
  }
}

function closeTriageModal(){
  const el=document.getElementById('triageModalOverlay');
  if(el)el.classList.remove('open');
  document.body.style.overflow='';
  currentTriageRoId='';
  currentEditingTriageKey='';
}

function applyTriageDecisionLocal(roNumber,decision,savedRecords,roUnitValue){
  const base=String(roNumber||'').trim();
  if(!base)return;

  const target=getAllRoRecords().find(r=>
    String(triageBaseRoNumber(r)||'').trim()===base ||
    String(r?.numero||r?.id||r?.codigo||'').trim()===base
  );
  if(!target)return;

  const first=(savedRecords||[])[0]||{};
  const directed=decision==='directed';
  const sector=directed?String(first.responsibleSector||'').trim():'';
  const person=directed?String(first.responsibleUserName||'Todo o setor').trim():'';

  const status=
    decision==='directed' ? 'Enviado' :
    decision==='record' ? (first.decisionId==='falta_caixa'?'Falta de caixa':'Registro') :
    decision==='obsolete' ? 'Obsoleto' :
    decision==='cancelled' ? 'Cancelada' : '';

  if(roUnitValue){
    target.unidade=canonicalUnitName(roUnitValue);
  }

  target.setorResponsavelPlanilha=sector;
  target.pessoaResponsavel=person;
  target.statusOperacional=status;
  target.status=status;

  // `ro.setor` também é fallback da lógica de triagem em snapshots antigos.
  if(directed)target.setor=sector;

  if(target.raw&&typeof target.raw==='object'){
    target.raw.__unidade=target.unidade||'';
    target.raw.__setorResponsavel=sector;
    target.raw.__pessoaResponsavel=person;
    target.raw.__statusOperacional=status;
  }

  // Persiste imediatamente no cache importado para o contador não voltar
  // ao renderizar a tela antes da próxima sincronização da planilha.
  try{
    const all=getAllRoRecords();
    const internas=all.filter(r=>String(r.origemBase||r.raw?.__origemBase||'')==='Interna');
    const externas=all.filter(r=>String(r.origemBase||r.raw?.__origemBase||'')==='Externa');
    saveImportedRosByOrigin(internas,externas);
  }catch(e){
    console.warn('[NUCLEO TRIAGEM] não foi possível persistir o status local imediatamente',e);
  }
}

async function saveTriageRecord(){
  if(nucleoTriageSaving)return;
  if(!nucleoFeatureRequire('ros','triage'))return;
  const key=currentTriageRoId;
  if(!key){
    alert('Nenhuma R.O. foi selecionada para triagem.');
    return;
  }

  nucleoTriageSaving=true;
  try{

  const decisionRule=nucleoSelectedDecision();const decision=decisionRule.behavior;
  const classificationData=nucleoReadClassification();
  if(!classificationData)return;
  const classification=classificationData.labels.join(' / ');
  const roUnitValue=canonicalUnitName(document.getElementById('triageRoUnit')?.value||'');
  const assignments=getTriageAssignmentsFromUi();
  const responsibleSectors=assignments.map(x=>x.sector);
  const responsibleSector=responsibleSectors[0]||'';
  const pdcaDeadline=decisionRule.pdcaRequired?nucleoDecisionDeadline(decisionRule):'';
  const criticality='Média';
  const note=document.getElementById('triageNote').value.trim();
  const decisionSector=['record','cancelled','obsolete'].includes(decision)?String(document.getElementById('triageDecisionSector')?.value||'').trim():'';

  if(!roUnitValue){
    alert('Selecione a unidade da R.O.');
    return;
  }
  if(decision==='directed'&&!responsibleSectors.length){
    alert('Selecione pelo menos um setor responsável pela tratativa.');
    return;
  }
  if(decision==='directed'&&decisionRule.requireReason&&assignments.some(x=>!String(x.reason||'').trim())){
    alert('Informe o motivo do direcionamento para cada setor adicionado.');
    document.querySelector('.triage-assignment-reason:placeholder-shown')?.focus();
    return;
  }
  if(decisionRule.requireSector&&decision!=='directed'&&!decisionSector){alert('Selecione o setor responsável pela ocorrência.');return;}
  if(decisionRule.requireReason&&decision!=='directed'&&!note){
    alert('Informe o motivo desta decisão.');
    document.getElementById('triageNote')?.focus();
    return;
  }

  await showNucleoLoading('Salvando triagem e processando ações...','Processando');

  // Correção de unidade NÃO é uma decisão de triagem. Ela existe para o SGQ
  // corrigir um cadastro de outra unidade (ex.: Linhares) sem assumir a decisão.
  // Portanto não cria/edita SGQ_TRIAGENS, não altera setor, Status, PDCA ou decisão.
  if(decision==='unit_correction'){
    if(!portalBackendEnabled())throw new Error('Apps Script não configurado.');
    updateNucleoLoading('Corrigindo somente a unidade da R.O. na planilha...','Processando');
    await portalUpdateRoSheetConfirmed(String(key).split('::')[0],{unidade:roUnitValue});
    updateRoUnitLocal(key,roUnitValue);
    try{
      updateNucleoLoading('Relendo a R.O. após a correção...','Processando');
      await syncImportedRosFromConfiguredSources({silent:true,force:true});
    }catch(syncErr){
      console.warn('[NUCLEO TRIAGEM] unidade corrigida, mas a releitura imediata falhou',syncErr);
    }
    closeTriageModal();
    populateTriageUnits();
    renderTriage();
    try{render()}catch(e){}
    try{refreshRoSummary()}catch(e){}
    hideNucleoLoading(true);
    alert('Unidade corrigida. Nenhuma decisão de triagem, setor, Status ou PDCA foi alterado.');
    return;
  }

  const map=getSavedTriageMap();
  const roNumber=String(key).split('::')[0];
  const allPreviousRecords=getTriageRecordsForRoNumber(roNumber,map).slice();
  // Pelo lápis, altera somente o direcionamento clicado. Nunca apaga os outros
  // setores da mesma R.O. Na triagem completa, a seleção atual continua sendo
  // a fonte de verdade para todos os direcionamentos.
  const previousRecords=currentEditingTriageKey&&decision==='directed'
    ? allPreviousRecords.filter(x=>String(x.roKey||'')===String(currentEditingTriageKey))
    : allPreviousRecords;
  previousRecords.forEach(old=>map.delete(String(old.roKey||'')));
  const targetSectors=decision==='directed'?responsibleSectors:[''];
  const savedRecords=[];
  for(const sec of targetSectors){
    const assignment=assignments.find(x=>normalizeAnswer(x.sector)===normalizeAnswer(sec))||{};
    const assignmentEmail=String(assignment.responsibleUserEmail||'').trim().toLowerCase();
    const assignmentUser=assignmentEmail?getOperationalUsers().find(u=>String(u.email||'').trim().toLowerCase()===assignmentEmail):null;
    const recordKey=decision==='directed'?triageCompositeKey(roNumber,sec):roNumber;
    const record={
      roKey:recordKey,roNumber,
      unidade:roUnitValue,unit:roUnitValue,roUnit:roUnitValue,
      decision,decisionId:decisionRule.id,decisionLabel:decisionRule.label,decisionRule:{...decisionRule},classification,classificationMs:classificationData.ms,classificationOther:classificationData.other,
      responsibleSector:decision==='directed'?sec:decisionSector,
      decisionSector,
      responsibleUserEmail:decision==='directed'?assignmentEmail:'',
      responsibleUserName:decision==='directed'?(assignmentUser?.name||''):'',
      assignmentReason:decision==='directed'?String(assignment.reason||'').trim():'',
      previousResponsibleSector:decision==='directed'?String(assignment.originalSector||sec).trim():'',
      pdcaRequired:decisionRule.pdcaRequired,pdcaDeadline:decisionRule.pdcaRequired?pdcaDeadline:'',criticality,note,
      scoreAssessment:nucleoAiScoreState?.assessment?.confirmed?JSON.parse(JSON.stringify(nucleoAiScoreState.assessment)):null,
      triagedAt:new Date().toISOString(),triagedBy:getSession()?.name||'SGQ'
    };
    map.set(recordKey,record);savedRecords.push(record);
  }

  // Uma nova triagem invalida imediatamente qualquer tombstone antigo.
  // A confirmação central desse estado é feita logo abaixo, mas a interface
  // não pode continuar mostrando a R.O. como "Aguardando triagem" nesse intervalo.
  const deletedNow=getDeletedTriageKeys();
  let deletedNowChanged=false;
  if(deletedNow.delete(roNumber))deletedNowChanged=true;
  savedRecords.forEach(r=>{
    if(deletedNow.delete(String(r.roKey||'')))deletedNowChanged=true;
  });

  if(deletedNowChanged){
    // Marca esta decisão como uma nova triagem feita DEPOIS da correção administrativa.
    // Isso impede um snapshot atrasado de fazê-la voltar para "Aguardando triagem".
    savedRecords.forEach(record=>{
      record.retriagedAfterCleanup=true;
      record.retriagedAfterCleanupAt=new Date().toISOString();
      map.set(String(record.roKey||''),record);
    });

    saveDeletedTriageKeys(deletedNow);

    // O marcador também precisa ser removido da base central antes de seguir.
    // Caso contrário o próximo snapshot central recoloca a R.O. como
    // "Aguardando triagem", mesmo depois de o e-mail da nova triagem ter sido enviado.
    try{
      if(isAdmin()){
        await adminCleanupSaveSharedState(
          DELETED_TRIAGE_KEYS_KEY,
          JSON.stringify([...deletedNow])
        );
      }else{
        await saveDeletedTriageKeysConfirmed(deletedNow);
      }
    }catch(e){
      console.warn('[NUCLEO TRIAGEM] não foi possível limpar o tombstone central',e);
      alert(
        'A nova triagem não foi finalizada porque a base central não confirmou a remoção do marcador administrativo.\n\n'+
        String(e?.message||e)
      );
      hideNucleoLoading(true);
      return;
    }
  }

  // A decisão fica registrada localmente IMEDIATAMENTE.
  // Assim a R.O. deixa de contar como "A triar" assim que o SGQ salva.
  localStorage.setItem(TRIAGE_KEY,JSON.stringify([...map.values()]));
  applyTriageDecisionLocal(roNumber,decision,savedRecords,roUnitValue);

  try{renderTriage()}catch(e){}
  try{refreshRoSummary()}catch(e){}
  try{refreshMenuNotificationBadges()}catch(e){}

  const syncWarnings=[];let centralTriageSaved=true;

  // Depois sincroniza com a planilha/base central.
  // Se uma mesma R.O. foi direcionada para mais de um setor, a partir do
  // segundo vínculo a planilha precisa CRIAR uma nova linha física da R.O.,
  // e não simplesmente sobrescrever a primeira.
  // Em edição de um vínculo existente, não criamos linha nova.
  for(let recordIndex=0;recordIndex<savedRecords.length;recordIndex++){
    const record=savedRecords[recordIndex];
    if(portalBackendEnabled()){
      updateNucleoLoading('Atualizando a linha de '+(record.responsibleSector||roNumber)+' na planilha...','Processando');

      try{
        await portalUpdateRoSheetConfirmed(roNumber,{
          unidade:roUnitValue,
          setor:record.responsibleSector||'',
          setorAnterior:record.previousResponsibleSector||record.responsibleSector||'',
          pessoa:decision==='directed'?(record.responsibleUserName||'Todo o setor'):'',
          status:decision==='directed'?'Enviado':decision==='record'?(decisionRule.id==='falta_caixa'?'Falta de caixa':'Registro'):decision==='obsolete'?'Obsoleto':'Cancelada',
          duplicarLinha:decision==='directed'&&!currentEditingTriageKey&&savedRecords.length>1&&recordIndex>0
        });
      }catch(syncErr){
        console.warn('[NUCLEO TRIAGEM] decisão salva localmente, mas planilha não confirmou',syncErr);
        syncWarnings.push(
          'A planilha não confirmou a atualização: '+
          String(syncErr?.message||syncErr||'erro não informado')
        );
      }

      try{await portalBackendSaveConfirmed('triage',record.roKey,record);}catch(error){centralTriageSaved=false;syncWarnings.push('A base central não confirmou a classificação e o setor: '+error.message);}

      const deletedKeys=getDeletedTriageKeys();
      let tombstoneChanged=false;
      if(deletedKeys.delete(String(record.roKey||'')))tombstoneChanged=true;
      if(deletedKeys.delete(String(record.roNumber||roNumber||'')))tombstoneChanged=true;
      if(tombstoneChanged){
        try{
          saveDeletedTriageKeys(deletedKeys);
          if(isAdmin()){
            await adminCleanupSaveSharedState(
              DELETED_TRIAGE_KEYS_KEY,
              JSON.stringify([...deletedKeys])
            );
          }else{
            await saveDeletedTriageKeysConfirmed(deletedKeys);
          }
        }catch(e){
          centralTriageSaved=false;
          syncWarnings.push('A base central não confirmou a remoção do marcador administrativo antigo: '+String(e?.message||e));
        }
      }
    }
  }

  // Se um setor foi alterado pelo lápis, a chave antiga (RO::setor-antigo)
  // também precisa sair da base central. Caso contrário o próximo portal_load
  // traz o direcionamento antigo de volta e a tela parece "se desatualizar".
  const newKeys=new Set(savedRecords.map(r=>String(r.roKey||'')));
  const obsoleteKeys=previousRecords
    .map(r=>String(r.roKey||''))
    .filter(oldKey=>oldKey && !newKeys.has(oldKey));
  for(const oldKey of obsoleteKeys){
    if(portalBackendEnabled()){
      updateNucleoLoading('Removendo o direcionamento anterior da base central...','Processando');
      if(!centralTriageSaved)continue;
      try{await nucleoDeleteTriageConfirmed(oldKey);const deletedKeys=getDeletedTriageKeys();deletedKeys.add(String(oldKey));saveDeletedTriageKeys(deletedKeys);}
      catch(error){syncWarnings.push('A base central não confirmou a remoção do direcionamento anterior: '+error.message);}
    }
  }

  localStorage.setItem(TRIAGE_KEY,JSON.stringify([...map.values()]));

  updateRoUnitLocal(key,roUnitValue);

  // A interface já foi atualizada localmente. A releitura completa da planilha
  // acontece em segundo plano e não mantém o usuário preso no carregamento.
  setTimeout(()=>{
    syncImportedRosFromConfiguredSources({silent:true,force:true})
      .then(async ()=>{
        try{
          // Confirma novamente que uma triagem recém-criada não ficou
          // mascarada por um tombstone antigo retornado pelo snapshot.
          const freshDeleted=getDeletedTriageKeys();
          let changed=false;
          if(freshDeleted.delete(roNumber))changed=true;
          savedRecords.forEach(r=>{
            if(freshDeleted.delete(String(r.roKey||'')))changed=true;
          });

          // Garante que a nova retriagem continue marcada mesmo após snapshot.
          const freshMap=getSavedTriageMap();
          savedRecords.forEach(savedRecord=>{
            const current=freshMap.get(String(savedRecord.roKey||''))||savedRecord;
            freshMap.set(String(savedRecord.roKey||''),{
              ...current,
              ...savedRecord,
              retriagedAfterCleanup:savedRecord.retriagedAfterCleanup===true || current?.retriagedAfterCleanup===true
            });
          });
          localStorage.setItem(TRIAGE_KEY,JSON.stringify([...freshMap.values()]));

          if(changed){
            saveDeletedTriageKeys(freshDeleted);
            if(isAdmin()){
              await adminCleanupSaveSharedState(
                DELETED_TRIAGE_KEYS_KEY,
                JSON.stringify([...freshDeleted])
              );
            }
          }
        }catch(e){
          console.warn('[NUCLEO TRIAGEM] falha ao confirmar remoção final do tombstone',e);
        }

        try{renderTriage()}catch(e){}
        try{refreshRoSummary()}catch(e){}
        try{refreshMenuNotificationBadges()}catch(e){}
      })
      .catch(syncErr=>console.warn('[NUCLEO TRIAGEM] releitura em segundo plano falhou',syncErr));
  },300);

  closeTriageModal();
  populateTriageSectors();
  populateTriageUnits();
  renderTriage();

  const roListView=document.getElementById('roListView');
  if(roListView && !roListView.classList.contains('hidden')){
    try{render()}catch(e){}
  }
  try{refreshRoSummary()}catch(e){}

  const indicatorView=document.getElementById('sgqIndicatorsView');
  if(indicatorView && !indicatorView.classList.contains('hidden')){
    try{renderSgqIndicators()}catch(e){}
  }

  if(decision==='directed'){
    const triageRo=getAllRoRecords().find(r=>String(r.numero||r.id||r.codigo||'').split('::')[0]===roNumber)||{};
    const emailErrors=[];
    let totalSent=0;
    try{
      updateNucleoLoading('Enviando os e-mails por setor…','Processando');
      const result=await portalJsonp({acao:'portal_send_directed_ro_email',ro:roNumber,setor:savedRecords[0]?.responsibleSector||'',unidade:roUnitValue||triageRo.unidade||'',tipoRO:triageRo.tipoRO||triageRo.tipo||'',cliente:triageRo.cliente||'',registrante:triageRo.registrante||'',assignments:JSON.stringify(savedRecords.map(record=>({sector:record.responsibleSector,email:record.responsibleUserEmail||'',reason:'Motivo do direcionamento: '+(record.assignmentReason||'Não informado')+'. É necessário analisar a ocorrência e responder o PDCA.'})))},90000);
      if(!Array.isArray(result?.results))throw new Error(result?.erro||'Atualize a implantação do Apps Script para a revisão 55.');
      totalSent=result.results.filter(r=>r.sucesso).length;
      result.results.filter(r=>!r.sucesso).forEach(r=>emailErrors.push(r.sector+': '+r.erro));
    }catch(err){emailErrors.push(err.message||String(err));}
    for(const record of savedRecords){
      const sec=record.responsibleSector,email=record.responsibleUserEmail||'';
      createNotification({type:'ro',skipEmail:true,audience:email?'user':'sector',userKey:email,sector:sec,ro:roNumber,unidade:roUnitValue||triageRo.unidade||'',title:'R.O. direcionada para tratativa',message:'A '+roNumber+' foi direcionada para '+sec+'. Motivo: '+(record.assignmentReason||'Não informado')+'.'});
      notifyManagersOfDirectedRo(roNumber,sec,{...triageRo,unidade:roUnitValue||triageRo.unidade},record.responsibleUserName);
    }
    try{await refreshEmailHistory()}catch(_){ }

    hideNucleoLoading(true);

    const avisos=[...syncWarnings];
    if(emailErrors.length)avisos.push('Falha em alguns e-mails: '+emailErrors.join(' | '));

    alert(
      'Triagem concluída com sucesso. '+savedRecords.length+' setor(es) direcionado(s) e '+totalSent+' e-mail(s) enviado(s).'+
      (avisos.length?'\n\nAviso: '+avisos.join(' | '):'')
    );
  }else{
    hideNucleoLoading(true);

    const decisionLabel=decisionRule.label||triageDecisionLabel(decision);

    alert(
      'Triagem concluída com sucesso.\n\n'+
      roNumber+' — '+decisionLabel+
      (note?'\nMotivo: '+note:'')+
      (syncWarnings.length?'\n\nAviso: '+syncWarnings.join(' | '):'')
    );
  }
  } catch(err) {
    console.error('[NUCLEO TRIAGEM] falha ao concluir triagem',err);
    hideNucleoLoading(true);

    alert(
      'Não foi possível concluir toda a sincronização da triagem.\n\n'+
      String(err?.message||err||'Falha desconhecida.')+
      '\n\nA decisão já foi mantida localmente para não continuar aparecendo como “A triar”.'
    );

    try{renderTriage()}catch(e){}
    try{refreshRoSummary()}catch(e){}
    try{refreshMenuNotificationBadges()}catch(e){}
  } finally {
    nucleoTriageSaving=false;
    hideNucleoLoading(true);
  }
}

function renderTriageDuplicateWarning(ro){
  const box=document.getElementById('triageDuplicateWarning');
  const list=document.getElementById('triageDuplicateList');
  if(!box||!list)return;

  box.classList.remove('hidden');
  list.textContent='Verificando ocorrências semelhantes...';
  window.__triageDuplicateContext={ro,sims:[]};

  const run=()=>{
    try{
      const sims=findSimilarRos(ro,8).filter(x=>x.score>=35);
      window.__triageDuplicateContext={ro,sims};
      box.classList.toggle('hidden',!sims.length);
      if(sims.length){
        list.innerHTML=sims.slice(0,4).map(x=>`<div style="padding:4px 0"><b>${escapeHtml(x.ro.numero||'')}</b> · ${x.score}% semelhante · ${escapeHtml(x.ro.cliente||'')} · ${escapeHtml(x.ro.descricao||'').slice(0,120)}${String(x.ro.descricao||'').length>120?'…':''}</div>`).join('');
      }else{
        list.textContent='';
      }
    }catch(e){
      console.warn('Falha ao verificar possíveis duplicidades.',e);
      box.classList.add('hidden');
    }
  };

  if('requestIdleCallback' in window)requestIdleCallback(run,{timeout:500});
  else setTimeout(run,30);
}

function openTriageDuplicateDetails(){
  const ctx=window.__triageDuplicateContext||{};
  const ro=ctx.ro;
  if(!ro)return;
  const triageMap=getSavedTriageMap();
  const sims=(ctx.sims&&ctx.sims.length?ctx.sims:findSimilarRos(ro,20).filter(x=>x.score>=35));
  const overlay=document.getElementById('triageDuplicateDetailsOverlay');
  const list=document.getElementById('triageDuplicateDetailsList');
  const summary=document.getElementById('triageDuplicateDetailsSummary');
  if(!overlay||!list)return;
  if(summary)summary.innerHTML=`<b>${escapeHtml(ro.numero||ro.id||ro.codigo||'R.O. atual')}</b> · ${sims.length} ocorrência(s) com problema semelhante.`;
  list.innerHTML=sims.length?sims.map(x=>{
    const m=duplicateMeta(x.ro), reasons=similarityReasons(ro,x.ro,triageMap);
    const meta=[x.ro.cliente?('Cliente: '+x.ro.cliente):'',m.item?('Item: '+m.item):'',m.pedido?('Pedido: '+m.pedido):'',m.data?('Data: '+m.data):'',effectiveRoSector(x.ro,triageMap)?('Setor: '+effectiveRoSector(x.ro,triageMap)):''].filter(Boolean);
    return `<div class="duplicate-detail-card">
      <div class="duplicate-detail-top"><button class="ro-link-btn" type="button" onclick="openRO('${escapeHtml(x.ro.numero||x.ro.id||x.ro.codigo)}')"><b>${escapeHtml(x.ro.numero||'R.O.')}</b></button><span class="duplicate-score">${x.score}% semelhante</span></div>
      ${reasons.length?`<div class="duplicate-badges">${reasons.map(r=>`<span class="duplicate-badge">${escapeHtml(r)}</span>`).join('')}</div>`:''}
      ${meta.length?`<div class="small">${meta.map(escapeHtml).join(' · ')}</div>`:''}
      <div class="duplicate-fulltext">${escapeHtml(String(x.ro.descricao||'Sem descrição registrada.'))}</div>
    </div>`;
  }).join(''):'<div class="small">Nenhuma ocorrência com problema suficientemente semelhante.</div>';
  overlay.classList.add('open');
}

function closeTriageDuplicateDetails(){
  document.getElementById('triageDuplicateDetailsOverlay')?.classList.remove('open');
}

function getAllRoRecords(){
  const base=(typeof ROs!=='undefined' ? ROs : (typeof ros!=='undefined' ? ros : []));
  return getSession()?.role==='quality'||getSession()?.accessUnits?base.filter(qualityRecordAllowed):base;
}

function getRoTriageRecord(ro,preloadedMap=null){
  try{
    if(ro?.__triageRecord)return ro.__triageRecord;
    const base=String(ro?.numero||ro?.id||ro?.codigo||'').trim();
    if(!base)return null;
    const map=preloadedMap instanceof Map?preloadedMap:getSavedTriageMap();
    return resolvedTriageForRo(ro,map);
  }catch(e){return null}
}

function canViewRO(ro){
  if(!nucleoManagerScopeAllows(ro))return false;
  // ADM Geral vê as duas unidades. ADM Matriz/Filial fica restrito à sua unidade.
  if(isAdmin())return getSession()?.role==='quality'?qualityRecordAllowed(ro):isGeneralAdmin()||sameUnitAsCurrentUser(ro);

  const tri=getRoTriageRecord(ro);
  if(!tri || tri.decision!=='directed')return false;
  const linked=(getSession()?.sectorMemberships||[]).some(m=>normalizePortalUnit(m.unit)===roUnit(ro)&&normalizeAnswer(m.sector)===normalizeAnswer(tri.responsibleSector));
  if(linked)return userMatchesDirectedPerson(tri);

  // Regra de unidade:
  // usuário comum vê a própria unidade; setor explicitamente unificado também
  // recebe R.O.s direcionadas a ele vindas da outra unidade como uma R.O. normal.
  const crossUnitUnified=isUnifiedSector(tri.responsibleSector) &&
    (sameSector(tri.responsibleSector) || (isManager() && managesSector(tri.responsibleSector)));
  if(!sameUnitAsCurrentUser(ro) && !crossUnitUnified)return false;

  // Dentro do escopo permitido, a R.O. precisa estar direcionada ao setor.
  // Gestor vinculado ao setor sempre acompanha, mesmo quando existe
  // uma pessoa específica responsável.
  if(isManager() && managesSector(tri.responsibleSector))return true;

  if(!sameSector(tri.responsibleSector))return false;

  // Se o SGQ escolheu uma pessoa específica, somente ela recebe a R.O.
  // Sem pessoa específica, todos os usuários cadastrados no setor recebem.
  return userMatchesDirectedPerson(tri);
}

async function adminDeleteTriageForRo(skipConfirm=false){
  if(!isAdmin())return false;
  const key=cleanupRoKey();
  if(!key){alert('Selecione uma R.O.');return false;}

  if(!skipConfirm){
    const ok=confirm(
      'Excluir o direcionamento/triagem de '+key+'?\n\n'+
      'A R.O. principal será preservada. Esta exclusão será aplicada na base central de produção.'
    );
    if(!ok)return false;
  }

  try{
    // Confirma que a base central está configurada antes da exclusão administrativa.
    await adminCleanupEnsureTestBackend();

    const map=getSavedTriageMap();
    const ro=findRoByAnyNumber(key,'');
    const baseSituation=ro?baseTriageSituation(ro):{sector:'',decision:''};

    // Uma nova limpeza invalida qualquer marca de retriagem anterior.
    getTriageRecordsForRoNumber(key,map).forEach(record=>{
      if(record){
        delete record.retriagedAfterCleanup;
        delete record.retriagedAfterCleanupAt;
      }
    });

    const records=getTriageRecordsForRoNumber(key,map);
    const centralKeys=new Set(
      [...map.keys()].filter(k=>triageRoNumberPart(k)===key)
    );
    records.forEach(r=>{
      if(r?.roKey)centralKeys.add(String(r.roKey));
    });
    if(baseSituation?.sector){
      centralKeys.add(triageCompositeKey(key,baseSituation.sector));
    }
    if(map.has(key))centralKeys.add(key);

    // Remove os registros reais da coleção triage da base central.
    for(const triageKey of centralKeys){
      await adminCleanupDeleteRecord('triage',triageKey);
    }

    // Marcador global: impede que uma origem sincronizada reconstrua a triagem
    // após F5/relogin.
    const deletedKeys=getDeletedTriageKeys();
    deletedKeys.add(key);
    [...centralKeys].forEach(k=>deletedKeys.add(String(k)));
    saveDeletedTriageKeys(deletedKeys);
    await adminCleanupSaveSharedState(DELETED_TRIAGE_KEYS_KEY,JSON.stringify([...deletedKeys]));

    // Limpa também o cache local para refletir a exclusão confirmada na base central.
    [...map.keys()].forEach(k=>{
      if(triageRoNumberPart(k)===key)map.delete(k);
    });
    localStorage.setItem(TRIAGE_KEY,JSON.stringify([...map.values()]));

    if(ro){
      ro.__triageDeletedInTest=true;
      ro.status='Aguardando triagem';
    }

    try{await syncPortalBackend(false,{foreground:true})}catch(e){}

    // Reaplica tombstone depois do snapshot e remove qualquer triagem antiga
    // que tenha voltado pelo cache/snapshot anterior.
    const finalDeleted=getDeletedTriageKeys();
    finalDeleted.add(key);
    [...centralKeys].forEach(k=>finalDeleted.add(String(k)));
    saveDeletedTriageKeys(finalDeleted);

    const cleanMap=getSavedTriageMap();
    [...cleanMap.keys()].forEach(k=>{
      if(triageRoNumberPart(k)===key)cleanMap.delete(k);
    });
    localStorage.setItem(TRIAGE_KEY,JSON.stringify([...cleanMap.values()]));

    try{renderTriage()}catch(e){}
    try{refreshRoSummary()}catch(e){}
    try{refreshMenuNotificationBadges()}catch(e){}
    refreshAdminCleanupPreview();

    const verifyDeleted=getDeletedTriageKeys();
    const verifyRo=findRoByAnyNumber(key,'');
    const verify=verifyRo?resolvedTriageForRo(verifyRo,getSavedTriageMap()):null;

    if(!verifyDeleted.has(key)){
      throw new Error('O marcador da correção da R.O. não permaneceu ativo.');
    }
    if(verify?.decision){
      throw new Error('A R.O. ainda aparece como triada após a exclusão.');
    }

    if(!skipConfirm)alert('Direcionamento/triagem removido da base central.');
    return true;
  }catch(e){
    console.error('[CORREÇÃO ADMIN] falha ao excluir triagem',e);
    alert('Não foi possível excluir o direcionamento/triagem.\n\n'+String(e?.message||e));
    return false;
  }
}

function normalizeRestoredRoRecord(r){
  const copy={...(r||{})};
  const origin=String(
    copy.origemBase ||
    copy.raw?.__origemBase ||
    copy.__origemBase ||
    rememberedRoOrigin(copy.numero||copy.numeroOriginal||copy.numeroPlanilha||'')
  ).trim();

  if(!origin)return null;

  copy.origemBase=origin;
  copy.ehSac=origin==='Externa'||copy.ehSac===true;
  copy.numeroOriginal=copy.numeroOriginal||copy.numeroPlanilha||copy.numero||'';
  copy.numeroPlanilha=copy.numeroPlanilha||copy.numeroOriginal;
  copy.numero=copy.raw?.__numeroApp || copy.numero || appRoNumber(copy.numeroOriginal,origin);
  return copy;
}

async function nucleoDeleteTriageConfirmed(id){
 if(!id)throw new Error('Direcionamento anterior não identificado.');
 if(!portalBackendEnabled())throw new Error('Apps Script não configurado.');
 const result=await portalJsonp({acao:'portal_delete',colecao:'triage',id:String(id),ator:getSession()?.name||'SGQ'},60000);
 if(!result?.sucesso)throw new Error(result?.erro||'A base central não confirmou a exclusão da triagem anterior.');
 return result;
}

function nucleoShowTriageBuild(){const host=document.getElementById('triageModalOverlay');if(!host)return;let badge=document.getElementById('nucleoTriageBuild');if(!badge){badge=document.createElement('p');badge.id='nucleoTriageBuild';badge.className='small';badge.style.cssText='margin:6px 0;color:#667085';const heading=host.querySelector('h2,h3');if(heading)heading.after(badge);}if(badge)badge.textContent='Versão da triagem: 06/10 — revisão 55';}

