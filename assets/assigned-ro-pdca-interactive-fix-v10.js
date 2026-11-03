/* NÚCLEO | R.O.s atribuídas | PDCA interativo na coluna PDCA v10
   Garante que:
   - badge/controle "Tem PDCA / Sem PDCA" fique sempre na coluna PDCA
   - a marcação interativa de PDCA fique sempre na coluna PDCA
   - a coluna Ações operacionais fique só com ícones operacionais
*/
(function(){
  if(window.__nucleoAssignedPdcaInteractiveFixV10)return;
  window.__nucleoAssignedPdcaInteractiveFixV10=true;

  function norm(v){
    return String(v||'').replace(/\s+/g,' ').trim().toLowerCase();
  }

  function hasPdcaMeaning(el){
    if(!el || el.nodeType!==1)return false;
    const txt = norm(el.textContent);
    const title = norm(el.getAttribute('title') || el.getAttribute('aria-label'));
    const cls = norm(el.className);
    const oc = String(el.getAttribute('onclick')||'');
    return (
      cls.includes('assigned-pdca') ||
      txt.includes('pdca') ||
      title.includes('pdca') ||
      /pdca/i.test(oc)
    );
  }

  function isOperationalAction(el){
    if(!el || el.nodeType!==1)return false;
    if(hasPdcaMeaning(el)) return false;
    return !!(
      el.matches('button, a, [role="button"], [data-ro-resend-email]') ||
      el.classList.contains('ro-eye-btn')
    );
  }

  function ensurePdcaWrap(cell){
    let wrap = cell.querySelector(':scope > .assigned-pdca-control');
    if(!wrap){
      wrap = document.createElement('div');
      wrap.className = 'assigned-pdca-control';
      cell.appendChild(wrap);
    }
    return wrap;
  }

  function ensureActionsWrap(cell){
    let wrap = cell.querySelector(':scope > .assigned-actions-layout-only');
    if(!wrap){
      wrap = document.createElement('div');
      wrap.className = 'assigned-actions-layout-only';
      const existing = Array.from(cell.childNodes);
      existing.forEach(n=>wrap.appendChild(n));
      cell.appendChild(wrap);
    }
    return wrap;
  }

  function stripGhostText(cell){
    Array.from(cell.childNodes).forEach(node=>{
      if(node.nodeType===3){
        const t = norm(node.textContent);
        if(!t || t==='o' || t==='○' || t==='•' || t==='.' || t.includes('pdca')){
          node.textContent='';
        }
      }
    });
  }

  function cleanupBoxes(cell){
    Array.from(cell.querySelectorAll('.nucleo-actions-stack,.nucleo-icons-row,.ro-row-actions,.assigned-operational-icons'))
      .forEach(box=>{
        if(!box.children.length && !norm(box.textContent)) box.remove();
      });
  }

  function dedupePdca(wrap){
    const seen = new Set();
    Array.from(wrap.children).forEach(el=>{
      if(el.nodeType!==1){ el.remove(); return; }
      const key = norm(el.textContent || el.getAttribute('title') || el.getAttribute('aria-label')) + '|' + norm(el.className);
      if(!hasPdcaMeaning(el)){
        el.remove();
        return;
      }
      if(seen.has(key)){
        el.remove();
        return;
      }
      seen.add(key);
    });
  }

  function dedupeActions(wrap){
    const seen = new Set();
    Array.from(wrap.querySelectorAll('button, a, [data-ro-resend-email]')).forEach(el=>{
      if(hasPdcaMeaning(el)){
        el.remove();
        return;
      }
      const key = [
        el.tagName,
        String(el.getAttribute('onclick')||'').trim(),
        String(el.getAttribute('title')||el.getAttribute('aria-label')||'').trim(),
        String(el.textContent||'').trim()
      ].join('|');
      if(seen.has(key)){
        el.remove();
        return;
      }
      seen.add(key);
    });
  }

  function reorderPdca(wrap){
    const items = Array.from(wrap.children);
    items.sort((a,b)=>{
      const at = norm(a.textContent || a.getAttribute('title') || a.getAttribute('aria-label'));
      const bt = norm(b.textContent || b.getAttribute('title') || b.getAttribute('aria-label'));
      const aw = at.includes('tem pdca') ? 1 : (at.includes('sem pdca') || at.includes('não tem pdca') || at.includes('nao tem pdca')) ? 2 : 9;
      const bw = bt.includes('tem pdca') ? 1 : (bt.includes('sem pdca') || bt.includes('não tem pdca') || bt.includes('nao tem pdca')) ? 2 : 9;
      return aw - bw;
    });
    items.forEach(el=>wrap.appendChild(el));
  }

  function collectPdcaCandidates(root){
    return Array.from(root.querySelectorAll('button, a, span, div, [role="button"], [data-ro-resend-email]'))
      .filter(el=>hasPdcaMeaning(el));
  }

  function collectActionCandidates(root){
    return Array.from(root.querySelectorAll('button, a, [role="button"], [data-ro-resend-email]'))
      .filter(el=>isOperationalAction(el));
  }

  function normalizeRow(tr){
    if(!tr || !tr.cells || tr.cells.length < 8) return;

    const pdcaCell = tr.cells[6];
    const actionsCell = tr.cells[7];
    if(!pdcaCell || !actionsCell) return;

    pdcaCell.classList.add('assigned-pdca-cell');
    actionsCell.classList.add('operational-action-col');
    actionsCell.style.display='';
    actionsCell.hidden=false;

    Array.from(tr.cells).forEach(td=>{
      if(td!==actionsCell) td.classList.remove('ro-eye-cell');
    });
    actionsCell.classList.add('ro-eye-cell');

    const pdcaWrap = ensurePdcaWrap(pdcaCell);
    const actionsWrap = ensureActionsWrap(actionsCell);

    // Move qualquer badge/controle/texto de PDCA da coluna de ações para a coluna PDCA
    collectPdcaCandidates(actionsCell).forEach(el=>pdcaWrap.appendChild(el));
    collectPdcaCandidates(pdcaCell).forEach(el=>pdcaWrap.appendChild(el));

    // Move apenas ações reais para a coluna de ações
    collectActionCandidates(pdcaCell).forEach(el=>actionsWrap.appendChild(el));
    collectActionCandidates(actionsCell).forEach(el=>actionsWrap.appendChild(el));

    stripGhostText(pdcaCell);
    stripGhostText(actionsCell);

    dedupePdca(pdcaWrap);
    reorderPdca(pdcaWrap);
    dedupeActions(actionsWrap);

    cleanupBoxes(pdcaCell);
    cleanupBoxes(actionsCell);

    // remove qualquer resto textual de PDCA da coluna de ações
    Array.from(actionsCell.querySelectorAll('*')).forEach(el=>{
      if(el!==actionsWrap && hasPdcaMeaning(el)){
        pdcaWrap.appendChild(el);
      }
    });
  }

  function normalizeAll(){
    document.querySelectorAll('#roListView #rows tr').forEach(normalizeRow);
  }

  let scheduled=false;
  function schedule(){
    if(scheduled) return;
    scheduled=true;
    requestAnimationFrame(()=>{
      scheduled=false;
      normalizeAll();
    });
  }

  function start(){
    normalizeAll();
    const rows=document.getElementById('rows');
    if(rows){
      const obs=new MutationObserver(schedule);
      obs.observe(rows,{childList:true,subtree:true});
    }
    setTimeout(normalizeAll,100);
    setTimeout(normalizeAll,350);
    setTimeout(normalizeAll,900);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',start,{once:true});
  } else {
    start();
  }
})();
