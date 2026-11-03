/* NÚCLEO | R.O.s atribuídas | mover apenas ações para Ações operacionais v13 */
(function(){
  if(window.__nucleoAssignedMoveActionsOnlyV13)return;
  window.__nucleoAssignedMoveActionsOnlyV13=true;

  function isPdcaControl(el){
    if(!el || el.nodeType!==1)return false;
    const txt=String(el.textContent||'').toLowerCase();
    const cls=String(el.className||'').toLowerCase();
    const oc=String(el.getAttribute('onclick')||'').toLowerCase();
    return cls.includes('pdca') || txt.includes('pdca') || oc.includes('pdca');
  }

  function ensureActionsWrap(cell){
    let wrap=cell.querySelector(':scope > .assigned-operational-icons');
    if(!wrap){
      wrap=document.createElement('div');
      wrap.className='assigned-operational-icons';
      cell.appendChild(wrap);
    }
    return wrap;
  }

  function normalizeRow(tr){
    if(!tr?.cells || tr.cells.length<8)return;

    const pdcaCell=tr.cells[6];
    const actionsCell=tr.cells[7];
    if(!pdcaCell || !actionsCell)return;

    const actionsWrap=ensureActionsWrap(actionsCell);

    // Move somente os ícones de ação que ainda ficaram na coluna PDCA.
    Array.from(pdcaCell.querySelectorAll(
      'button.ro-eye-btn, .ro-row-actions button, .assigned-operational-icons button'
    )).forEach(el=>{
      if(isPdcaControl(el))return;
      actionsWrap.appendChild(el);
    });

    // Remove invólucros vazios deixados na coluna PDCA.
    Array.from(pdcaCell.querySelectorAll('.ro-row-actions,.assigned-operational-icons'))
      .forEach(box=>{
        if(!box.children.length && !String(box.textContent||'').trim())box.remove();
      });

    actionsCell.style.display='';
    actionsCell.hidden=false;

    // Não deixa ações duplicarem.
    const seen=new Set();
    Array.from(actionsWrap.querySelectorAll('button')).forEach(btn=>{
      const key=[
        btn.getAttribute('onclick')||'',
        btn.getAttribute('title')||'',
        btn.textContent||''
      ].join('|');
      if(seen.has(key))btn.remove();
      else seen.add(key);
    });
  }

  function normalizeAll(){
    document.querySelectorAll('#roListView #rows tr').forEach(normalizeRow);
  }

  let scheduled=false;
  function schedule(){
    if(scheduled)return;
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
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',start,{once:true});
  }else{
    start();
  }
})();
