/* NÚCLEO | R.O.s atribuídas | anti-loop de ações v8
   Corrige o ciclo:
   ro-resend-email injeta na coluna PDCA -> layout move -> módulo injeta novamente.
   Esta camada fixa a 8ª coluna como destino oficial das ações e deduplica botões.
*/
(function(){
  if(window.__nucleoAssignedActionsAntiLoopV8)return;
  window.__nucleoAssignedActionsAntiLoopV8=true;

  function isPdcaControl(el){
    return !!(
      el?.closest?.('.assigned-pdca-control') ||
      el?.classList?.contains('assigned-pdca-option')
    );
  }

  function actionKey(el){
    if(!el || el.nodeType!==1)return '';
    if(el.matches('[data-ro-resend-email]'))return 'resend-email';
    const oc=String(el.getAttribute('onclick')||'').trim();
    const title=String(el.getAttribute('title')||el.getAttribute('aria-label')||'').trim();
    const txt=String(el.textContent||'').trim();
    return [el.tagName,oc,title,txt].join('|');
  }

  function ensureActionsWrap(actionsCell){
    let wrap=actionsCell.querySelector(':scope > .assigned-actions-layout-only');
    if(!wrap){
      wrap=document.createElement('div');
      wrap.className='assigned-actions-layout-only';
      const existing=Array.from(actionsCell.childNodes);
      existing.forEach(n=>wrap.appendChild(n));
      actionsCell.appendChild(wrap);
    }
    return wrap;
  }

  function flattenActionContainers(root,wrap){
    Array.from(root.querySelectorAll('.nucleo-icons-row, .nucleo-actions-stack, .ro-row-actions, .assigned-operational-icons'))
      .forEach(box=>{
        if(box===wrap || box.contains(wrap))return;
        Array.from(box.children).forEach(child=>{
          if(isPdcaControl(child))return;
          wrap.appendChild(child);
        });
        if(!box.children.length && !box.textContent.trim())box.remove();
      });
  }

  function dedupe(wrap){
    const seen=new Set();
    Array.from(wrap.querySelectorAll('button, a, [data-ro-resend-email]')).forEach(el=>{
      if(isPdcaControl(el))return;
      const key=actionKey(el);
      if(!key)return;
      if(seen.has(key)){
        el.remove();
        return;
      }
      seen.add(key);
    });

    // Proteção explícita contra o bug dos envelopes repetidos.
    const resend=Array.from(wrap.querySelectorAll('[data-ro-resend-email]'));
    resend.slice(1).forEach(el=>el.remove());
  }

  function normalizeRow(tr){
    if(!tr?.cells || tr.cells.length<8)return;

    const pdcaCell=tr.cells[6];
    const actionsCell=tr.cells[7];
    if(!pdcaCell || !actionsCell)return;

    // A coluna de ações do ADM vinha escondida pelo render antigo.
    actionsCell.style.display='';
    actionsCell.hidden=false;
    actionsCell.classList.add('operational-action-col');

    // ro-resend-email procura .ro-eye-cell. Ela deve ser SEMPRE a coluna 8.
    Array.from(tr.cells).forEach(td=>{
      if(td!==actionsCell)td.classList.remove('ro-eye-cell');
    });
    actionsCell.classList.add('ro-eye-cell');

    const wrap=ensureActionsWrap(actionsCell);

    // Tudo que não é controle de PDCA sai da 7ª coluna e vai para Ações.
    Array.from(pdcaCell.querySelectorAll('button, a, [data-ro-resend-email]')).forEach(el=>{
      if(isPdcaControl(el))return;
      wrap.appendChild(el);
    });

    flattenActionContainers(pdcaCell,wrap);
    flattenActionContainers(actionsCell,wrap);
    dedupe(wrap);

    pdcaCell.classList.add('assigned-pdca-cell');

    // Remove invólucros vazios deixados pelas versões anteriores.
    Array.from(pdcaCell.querySelectorAll('.nucleo-actions-stack,.nucleo-icons-row,.ro-row-actions,.assigned-operational-icons'))
      .forEach(box=>{
        if(!box.children.length && !box.textContent.trim())box.remove();
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

    // O módulo de e-mail também observa o DOM; reaplica após as primeiras injeções.
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
