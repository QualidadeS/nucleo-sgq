/* NÚCLEO | Organizador da coluna Ações | v10 */
(function(){
  if(window.__nucleoAssignedActionsOrganizerV10)return;
  window.__nucleoAssignedActionsOrganizerV10=true;

  function organize(){
    let assigned=false;
    try{assigned=typeof roListMode!=='undefined'&&roListMode==='assigned'}catch(e){}
    if(!assigned)return;

    document.querySelectorAll('#rows tr').forEach(tr=>{
      const cell=tr.querySelector('.ro-eye-cell');
      if(!cell)return;

      let stack=cell.querySelector('.nucleo-actions-stack');
      if(!stack){
        stack=document.createElement('div');
        stack.className='nucleo-actions-stack';
        cell.appendChild(stack);
      }

      let icons=stack.querySelector('.nucleo-icons-row');
      if(!icons){
        icons=document.createElement('div');
        icons.className='nucleo-icons-row';
        stack.appendChild(icons);
      }

      const oldWrap=cell.querySelector('.ro-row-actions');
      if(oldWrap && oldWrap!==icons){
        [...oldWrap.children].forEach(el=>icons.appendChild(el));
        oldWrap.remove();
      }

      [...cell.querySelectorAll(':scope > button.ro-eye-btn')].forEach(el=>icons.appendChild(el));
      const emailBtn=cell.querySelector('[data-ro-resend-email]');
      if(emailBtn && emailBtn.parentElement!==icons)icons.appendChild(emailBtn);
    });
  }

  const obs=new MutationObserver(()=>{
    clearTimeout(window.__nucleoAssignedActionsTimerV10);
    window.__nucleoAssignedActionsTimerV10=setTimeout(organize,50);
  });
  obs.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',organize);
  setTimeout(organize,400);
  setTimeout(organize,1000);
})();
