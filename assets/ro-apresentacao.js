/* R.O.s a apresentar — fila derivada dos recebimentos, sem cópia de registros. */
function pendingPresentationCompleted(pdca){
  return Boolean(pdca&&(pdca.apresentadoEm||pdca.presentedAt||pdca.presented===true||
    pdca.presentationCompleted===true||normalizeAnswer(pdca.status||'')==='apresentado'||nucleoPdcaDelivery(pdca)));
}
function pendingPresentationRows(){
  if(!nucleoPersonFeatureCan('pdca','present'))return [];
  return getAllSentPdcas().filter(pdca=>canViewPdca(pdca)&&!pendingPresentationCompleted(pdca));
}
function showPendingPresentations(){
  if(!nucleoFeatureRequire('pdca','present'))return;
  view('pendingPresentationsView');setNav('presentations');
  renderPendingPresentations();refreshMenuNotificationBadges();
}
function refreshPendingPresentationView(){
  const view=document.getElementById('pendingPresentationsView');
  if(view&&!view.classList.contains('hidden'))renderPendingPresentations();
}
function renderPendingPresentations(){
  const host=document.getElementById('pendingPresentationRows');if(!host)return;
  const query=normalizeAnswer(document.getElementById('pendingPresentationSearch')?.value||'');
  const all=pendingPresentationRows();
  const rows=all.filter(p=>normalizeAnswer([p.ro,p.roId,p.setor,p.sector,p.cliente,p.client,p.responsavel,p.fileName,canonicalUnitName(p.unidade||p.unit||'')].join(' ')).includes(query));
  rows.sort((a,b)=>String(b.sentAt||b.envio||b.createdAt||'').localeCompare(String(a.sentAt||a.envio||a.createdAt||'')));
  document.getElementById('pendingPresentationSummary').textContent=rows.length+' resposta(s) a apresentar'+(query?' · '+all.length+' pendente(s) no total':'');
  host.innerHTML=rows.length?rows.map(p=>{
    const id=String(p.id||p.pdcaId||''),when=p.sentAt||p.envio||p.createdAt||'';
    return '<tr><td><b>'+escapeHtml(p.ro||p.roId||'—')+'</b><div class="small">'+escapeHtml(p.cliente||p.client||'')+'</div></td><td>'+escapeHtml(p.setor||p.sector||'—')+'</td><td>'+escapeHtml(canonicalUnitName(p.unidade||p.unit||'')||'—')+'</td><td>'+escapeHtml(formatDateTimeBR(when)||'—')+'</td><td><div class="actions"><button class="btn secondary" type="button" data-presentation-action="open" data-pdca-id="'+escapeHtml(id)+'">Abrir apresentação</button><button class="btn primary" type="button" data-presentation-action="complete" data-pdca-id="'+escapeHtml(id)+'">Registrar conclusão</button></div></td></tr>';
  }).join(''):'<tr><td colspan="5" class="small">'+(query?'Nenhuma resposta corresponde à busca.':'Nenhuma R.O. aguardando apresentação.')+'</td></tr>';
}
document.addEventListener('click',async event=>{
  const button=event.target.closest?.('[data-presentation-action]');if(!button)return;
  const pdca=findSentPdcaById(button.dataset.pdcaId);
  if(!pdca||!nucleoPersonFeatureCan('pdca','present')||!canViewPdca(pdca))return;
  if(button.dataset.presentationAction==='open'){
    openPdcaPresentation(pdca);return;
  }
  if(button.dataset.presentationAction==='complete'){
    await nucleoMarkAssignedPresented(button);
    refreshPendingPresentationView();refreshMenuNotificationBadges();
  }
});
