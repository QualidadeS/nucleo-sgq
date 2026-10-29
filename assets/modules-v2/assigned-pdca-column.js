/* NÚCLEO | Coluna PDCA separada | v11 */
(function(){
  if(window.__nucleoAssignedPdcaColumnV11)return;
  window.__nucleoAssignedPdcaColumnV11=true;

  function assignedMode(){
    try{return typeof roListMode!=='undefined'&&roListMode==='assigned'}catch(e){return false}
  }

  function ensureHeader(){
    if(!assignedMode())return;
    const table=document.querySelector('#roListView table');
    if(!table)return;
    const head=table.querySelector('thead tr');
    if(!head)return;

    // Já existe?
    if(head.querySelector('[data-nucleo-pdca-header]'))return;

    const ths=[...head.children];
    const actions=ths[ths.length-1];
    if(!actions)return;

    const th=document.createElement('th');
    th.dataset.nucleoPdcaHeader='1';
    th.textContent='PDCA';
    actions.before(th);
  }

  function ensurePdcaCell(tr){
    if(!assignedMode())return;
    const actionCell=tr.querySelector('.ro-eye-cell');
    if(!actionCell)return;

    let pdcaCell=tr.querySelector('.nucleo-pdca-cell');
    if(!pdcaCell){
      pdcaCell=document.createElement('td');
      pdcaCell.className='nucleo-pdca-cell';
      actionCell.before(pdcaCell);
    }

    // Procura controles/status de PDCA que estejam dentro da célula de ações.
    const candidates=[
      ...actionCell.querySelectorAll('.pdca-source-control'),
      ...actionCell.querySelectorAll('.badge.ok,.badge.warn,.badge.danger,.badge.info'),
      ...actionCell.querySelectorAll('.status-badge')
    ];

    candidates.forEach(el=>{
      if(
        el.closest('.nucleo-icons-row') ||
        el.matches('[data-ro-email-status]')
      ) return;

      const txt=String(el.textContent||'').trim().toLowerCase();
      if(
        txt.includes('pdca') ||
        txt.includes('pendente') ||
        txt.includes('temos pdca') ||
        txt.includes('sem pdca')
      ){
        pdcaCell.appendChild(el);
      }
    });

    // Caso os botões "Tem PDCA / Não tem PDCA" tenham ficado soltos.
    [...actionCell.querySelectorAll('button')].forEach(btn=>{
      if(btn.matches('.ro-eye-btn,[data-ro-resend-email]'))return;
      const txt=String(btn.textContent||'').trim().toLowerCase();
      if(txt.includes('pdca')){
        pdcaCell.appendChild(btn);
      }
    });
  }

  function organize(){
    if(!assignedMode())return;
    ensureHeader();
    document.querySelectorAll('#rows tr').forEach(ensurePdcaCell);
  }

  const obs=new MutationObserver(()=>{
    clearTimeout(window.__nucleoPdcaColumnTimerV11);
    window.__nucleoPdcaColumnTimerV11=setTimeout(organize,60);
  });

  obs.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',organize);
  setTimeout(organize,400);
  setTimeout(organize,1000);
})();
