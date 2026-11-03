/* NÚCLEO | R.O.s atribuídas | PDCA na coluna correta v9
   Objetivo:
   - "Tem PDCA / Sem PDCA" fica exclusivamente na coluna PDCA
   - Ações operacionais ficam exclusivamente na coluna Ações operacionais
   - remove sobras de texto/controles de PDCA da coluna de ações
*/
(function(){
  if(window.__nucleoAssignedPdcaColumnFixV9)return;
  window.__nucleoAssignedPdcaColumnFixV9=true;

  function norm(v){
    return String(v||'').replace(/\s+/g,' ').trim().toLowerCase();
  }

  function isPdcaLike(el){
    if(!el || el.nodeType!==1)return false;
    const txt = norm(el.textContent);
    const title = norm(el.getAttribute('title') || el.getAttribute('aria-label'));
    const cls = norm(el.className);
    const oc = String(el.getAttribute('onclick')||'');
    if(cls.includes('assigned-pdca')) return true;
    if(txt.includes('pdca') || title.includes('pdca')) return true;
    if(/pdca/i.test(oc)) return true;
    return false;
  }

  function isActionLike(el){
    return !!(el && el.nodeType===1 && (
      el.matches('button, a, [role="button"], [data-ro-resend-email]') ||
      el.classList.contains('ro-eye-btn')
    ));
  }

  function actionKey(el){
    if(!el || el.nodeType!==1)return '';
    if(el.matches('[data-ro-resend-email]')) return 'resend-email';
    const oc = String(el.getAttribute('onclick')||'').trim();
    const title = String(el.getAttribute('title')||el.getAttribute('aria-label')||'').trim();
    const txt = String(el.textContent||'').trim();
    return [el.tagName, oc, title, txt].join('|');
  }

  function ensurePdcaWrap(pdcaCell){
    let wrap = pdcaCell.querySelector(':scope > .assigned-pdca-control');
    if(!wrap){
      wrap = document.createElement('div');
      wrap.className = 'assigned-pdca-control';
      pdcaCell.appendChild(wrap);
    }
    return wrap;
  }

  function ensureActionsWrap(actionsCell){
    let wrap = actionsCell.querySelector(':scope > .assigned-actions-layout-only');
    if(!wrap){
      wrap = document.createElement('div');
      wrap.className = 'assigned-actions-layout-only';
      const existing = Array.from(actionsCell.childNodes);
      existing.forEach(n=>wrap.appendChild(n));
      actionsCell.appendChild(wrap);
    }
    return wrap;
  }

  function removePdcaGhostText(root){
    Array.from(root.childNodes).forEach(node=>{
      if(node.nodeType===3){
        const txt = norm(node.textContent);
        if(txt.includes('pdca')) node.textContent = '';
      }
    });
  }

  function sortPdcaButtons(wrap){
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

  function dedupeActions(wrap){
    const seen=new Set();
    Array.from(wrap.querySelectorAll('button, a, [data-ro-resend-email]')).forEach(el=>{
      if(isPdcaLike(el)) return;
      const key=actionKey(el);
      if(!key) return;
      if(seen.has(key)){
        el.remove();
        return;
      }
      seen.add(key);
    });
    const resend=Array.from(wrap.querySelectorAll('[data-ro-resend-email]'));
    resend.slice(1).forEach(el=>el.remove());
  }

  function moveElements(sourceRoot, targetWrap, predicate){
    Array.from(sourceRoot.querySelectorAll('button, a, [role="button"], [data-ro-resend-email], .assigned-pdca-option, .assigned-pdca-control > *'))
      .forEach(el=>{
        if(!predicate(el)) return;
        targetWrap.appendChild(el);
      });
  }

  function cleanupEmpty(root){
    Array.from(root.querySelectorAll('.nucleo-actions-stack,.nucleo-icons-row,.ro-row-actions,.assigned-operational-icons'))
      .forEach(box=>{
        if(!box.children.length && !norm(box.textContent)) box.remove();
      });
  }

  function normalizeRow(tr){
    if(!tr || !tr.cells || tr.cells.length < 8) return;
    const pdcaCell = tr.cells[6];
    const actionsCell = tr.cells[7];
    if(!pdcaCell || !actionsCell) return;

    actionsCell.style.display='';
    actionsCell.hidden=false;
    actionsCell.classList.add('operational-action-col');
    pdcaCell.classList.add('assigned-pdca-cell');

    Array.from(tr.cells).forEach(td=>{
      if(td!==actionsCell) td.classList.remove('ro-eye-cell');
    });
    actionsCell.classList.add('ro-eye-cell');

    const pdcaWrap = ensurePdcaWrap(pdcaCell);
    const actionsWrap = ensureActionsWrap(actionsCell);

    // 1) qualquer controle/label relacionado a PDCA vai para a coluna PDCA
    moveElements(actionsCell, pdcaWrap, isPdcaLike);
    moveElements(pdcaCell, pdcaWrap, isPdcaLike);

    // 2) qualquer ação operacional que tenha ido parar em PDCA vai para Ações
    moveElements(pdcaCell, actionsWrap, el=>isActionLike(el) && !isPdcaLike(el));
    moveElements(actionsCell, actionsWrap, el=>isActionLike(el) && !isPdcaLike(el));

    // 3) limpa sobras textuais de PDCA na coluna errada
    removePdcaGhostText(actionsCell);

    // 4) deduplicação
    Array.from(pdcaWrap.children).forEach((el,idx,arr)=>{
      if(el.nodeType!==1) return;
      const txt = norm(el.textContent || el.getAttribute('title') || el.getAttribute('aria-label'));
      if(!txt.includes('pdca') && !norm(el.className).includes('assigned-pdca')){
        // qualquer coisa não-PDCA não deve ficar aqui
        actionsWrap.appendChild(el);
      }
    });

    const seenPdca = new Set();
    Array.from(pdcaWrap.children).forEach(el=>{
      if(el.nodeType!==1) return;
      const key = norm(el.textContent || el.getAttribute('title') || el.getAttribute('aria-label')) + '|' + norm(el.className);
      if(seenPdca.has(key)){
        el.remove();
        return;
      }
      seenPdca.add(key);
    });

    dedupeActions(actionsWrap);
    sortPdcaButtons(pdcaWrap);
    cleanupEmpty(pdcaCell);
    cleanupEmpty(actionsCell);
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
  }else{
    start();
  }
})();
