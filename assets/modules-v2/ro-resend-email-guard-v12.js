/* NÚCLEO | R.O.s atribuídas | guarda de envelope único v12
   Não move colunas e não recria layout.
   Só garante que exista no máximo 1 botão de reenvio por linha.
*/
(function(){
  if(window.__nucleoRoResendSingleGuardV12)return;
  window.__nucleoRoResendSingleGuardV12=true;

  function normalizeRow(tr){
    if(!tr || !tr.cells || tr.cells.length<8)return;

    const actionsCell=tr.cells[7];
    if(!actionsCell)return;

    // O destino oficial de ações é sempre a 8ª coluna.
    actionsCell.classList.add('operational-action-col','ro-eye-cell');

    // Nenhuma outra coluna deve ser tratada como coluna de ações.
    Array.from(tr.cells).forEach((td,i)=>{
      if(i!==7)td.classList.remove('ro-eye-cell');
    });

    // Se algum módulo criou mais de um envelope, mantém somente o primeiro.
    const resendButtons=Array.from(tr.querySelectorAll('[data-ro-resend-email]'));
    resendButtons.forEach((btn,i)=>{
      if(i>0)btn.remove();
    });

    // Se houver envelope fora da 8ª coluna, move apenas esse botão para Ações.
    const first=tr.querySelector('[data-ro-resend-email]');
    if(first && !actionsCell.contains(first)){
      let target=
        actionsCell.querySelector('.nucleo-icons-row') ||
        actionsCell.querySelector('.assigned-operational-icons') ||
        actionsCell.querySelector('.ro-row-actions') ||
        actionsCell.querySelector('.assigned-actions-layout-only');

      if(!target){
        target=document.createElement('div');
        target.className='assigned-operational-icons';
        actionsCell.appendChild(target);
      }
      target.appendChild(first);
    }
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
    if(!rows)return;
    const obs=new MutationObserver(schedule);
    obs.observe(rows,{childList:true,subtree:true});
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',start,{once:true});
  }else{
    start();
  }
})();
