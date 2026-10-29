/* NÚCLEO | R.O.s atribuídas — colunas estáveis + cota | v13 */
(function(){
  if(window.__nucleoAssignedStableV13)return;
  window.__nucleoAssignedStableV13=true;

  function norm(v){
    try{return typeof normalizeAnswer==='function'?normalizeAnswer(v):String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim()}
    catch(e){return String(v||'').toLowerCase().trim()}
  }
  function roDigits(v){
    const m=String(v||'').match(/\d+/g);
    return m&&m.length?String(parseInt(m[m.length-1],10)):'';
  }
  function sameRo(a,b){return !!roDigits(a)&&roDigits(a)===roDigits(b)}
  function eventTime(x){
    const d=Date.parse(String(x?.sentAt||x?.at||x?.createdAt||''));
    return Number.isFinite(d)?d:0;
  }
  function assignedMode(){
    try{return typeof roListMode!=='undefined'&&roListMode==='assigned'}catch(e){return false}
  }

  let cache=[];
  let cacheAt=0;
  let loading=null;
  let usage=null;

  async function loadStatus(force=false){
    if(!force && cacheAt && Date.now()-cacheAt<30000)return {history:cache,usage};
    if(loading)return loading;
    loading=(async()=>{
      try{
        const res=await portalJsonp({acao:'portal_email_status'},60000);
        if(res?.sucesso){
          cache=(res.history||[]).slice();
          usage=res.emailUsage||null;
          cacheAt=Date.now();
          return {history:cache,usage};
        }
      }catch(e){console.warn('[V13 EMAIL STATUS]',e)}
      return {history:cache,usage};
    })();
    try{return await loading}finally{loading=null}
  }

  function quotaErrorToday(history){
    const today=new Date();
    return (history||[]).some(x=>{
      const status=String(x?.status||'').toLowerCase();
      if(status!=='error')return false;
      const d=new Date(String(x?.at||x?.sentAt||x?.createdAt||''));
      if(isNaN(d.getTime()))return false;
      const same=d.getFullYear()===today.getFullYear()&&d.getMonth()===today.getMonth()&&d.getDate()===today.getDate();
      if(!same)return false;
      const msg=String(x?.error||x?.erro||x?.message||'').toLowerCase();
      return msg.includes('serviço chamado muitas vezes')||msg.includes('service invoked too many times')||msg.includes('daily quota')||msg.includes('limite diário');
    });
  }

  function renderQuota(history,usageData){
    const badge=document.getElementById('nucleoAssignedQuotaBadge');
    if(!badge)return;
    badge.classList.remove('low','zero');

    const remaining=usageData&&Number(usageData.remainingQuota);
    if(Number.isFinite(remaining)){
      badge.textContent='✉ E-mail hoje: '+remaining+' restante'+(remaining===1?'':'s');
      if(remaining<=0)badge.classList.add('zero');
      else if(remaining<=10)badge.classList.add('low');
      return;
    }

    if(quotaErrorToday(history)){
      badge.textContent='✉ E-mail hoje: cota esgotada';
      badge.classList.add('zero');
    }else{
      badge.textContent='✉ E-mail hoje: cota não informada';
    }
  }

  function currentSector(tr){
    return String(tr.children[2]?.textContent||'').trim();
  }

  function eventsFor(history,ro,sector){
    const all=(history||[]).filter(h=>String(h?.type||'ro').toLowerCase()==='ro'&&sameRo(h?.ro,ro));
    if(!all.length)return [];
    const wanted=norm(sector);
    const exact=all.filter(h=>norm(h?.sector||h?.setor||h?.responsibleSector||'')===wanted);
    if(exact.length)return exact;

    // fallback conservador: se a R.O. tiver um único destinatário conhecido no histórico
    const sent=all.filter(h=>String(h?.status||'').toLowerCase()==='sent');
    const recipients=[...new Set(sent.flatMap(h=>String(h?.email||h?.recipient||h?.destinatario||'')
      .split(/[;,]/).map(v=>v.trim().toLowerCase()).filter(Boolean)))];
    return recipients.length===1?all:[];
  }

  function stateFor(events){
    if(!events.length)return {code:'none',label:'Não enviado'};
    const latest=events.slice().sort((a,b)=>eventTime(b)-eventTime(a))[0];
    const st=String(latest?.status||'').toLowerCase();
    if(st==='sent')return {code:'sent',label:'Enviado',latest};
    if(st==='error')return {code:'error',label:'Erro',latest};
    return {code:'none',label:'Não enviado',latest};
  }

  function makeEmailCell(tr){
    let cell=tr.querySelector('.nucleo-email-cell');
    if(cell)return cell;
    const action=tr.querySelector('.ro-eye-cell');
    if(!action)return null;
    cell=document.createElement('td');
    cell.className='nucleo-email-cell';
    action.before(cell);
    return cell;
  }

  function makePdcaCell(tr){
    let cell=tr.querySelector('.nucleo-pdca-cell');
    if(cell)return cell;
    const action=tr.querySelector('.ro-eye-cell');
    if(!action)return null;
    cell=document.createElement('td');
    cell.className='nucleo-pdca-cell';
    action.before(cell);
    return cell;
  }

  function organizePdca(tr){
    const cell=makePdcaCell(tr);
    const action=tr.querySelector('.ro-eye-cell');
    if(!cell||!action)return;

    // move apenas controles explicitamente relacionados a PDCA que estejam na célula de ações
    [...action.querySelectorAll('button,span,div')].forEach(el=>{
      if(el.closest('.ro-row-actions,.nucleo-icons-row'))return;
      if(el.matches('[data-ro-resend-email],[data-ro-email-status]'))return;
      const t=String(el.textContent||'').trim().toLowerCase();
      if(!t)return;
      if(t.includes('pdca')||t==='tem pdca'||t==='sem pdca'||t==='não tem pdca'){
        cell.appendChild(el);
      }
    });

    // remove wrappers vazios
    [...action.children].forEach(el=>{
      if((el.matches('div,span'))&&!String(el.textContent||'').trim()&&!el.querySelector('button'))el.remove();
    });
  }

  function renderEmailCell(cell,state,events){
    if(!cell)return;
    let b=cell.querySelector('.nucleo-email-state');
    if(!b){
      b=document.createElement('button');
      b.type='button';
      b.className='nucleo-email-state';
      cell.appendChild(b);
    }
    b.className='nucleo-email-state '+state.code;
    b.textContent=state.code==='sent'?'✉ Enviado':state.code==='error'?'✉ Erro':'✉ Não enviado';
    b.onclick=null;
    if(state.code==='error'){
      b.onclick=e=>{
        e.stopPropagation();
        const failed=(events||[]).filter(x=>String(x?.status||'').toLowerCase()==='error').sort((a,b)=>eventTime(b)-eventTime(a));
        const last=failed[0]||state.latest||{};
        const lines=['Erro no envio de e-mail'];
        const to=String(last?.email||last?.recipient||last?.destinatario||'').trim();
        if(to)lines.push('Destino: '+to);
        const when=String(last?.at||last?.sentAt||last?.createdAt||'').trim();
        if(when){
          let shown=when;
          try{if(typeof formatDateTimeBR==='function')shown=formatDateTimeBR(when)||when}catch(_){}
          lines.push('Data: '+shown);
        }
        lines.push('Motivo: '+String(last?.error||last?.erro||last?.message||'Erro não detalhado pelo servidor.'));
        alert(lines.join('\n'));
      };
    }
  }

  function organizeActions(tr){
    const action=tr.querySelector('.ro-eye-cell');
    if(!action)return;
    let row=action.querySelector('.nucleo-icons-row');
    if(!row){
      row=document.createElement('div');
      row.className='nucleo-icons-row';
      const old=action.querySelector('.ro-row-actions');
      if(old){
        [...old.children].forEach(x=>row.appendChild(x));
        old.remove();
      }else{
        [...action.querySelectorAll(':scope > button.ro-eye-btn')].forEach(x=>row.appendChild(x));
      }
      action.appendChild(row);
    }
    const emailBtn=action.querySelector('[data-ro-resend-email]');
    if(emailBtn&&emailBtn.parentElement!==row)row.appendChild(emailBtn);
  }

  async function refresh(){
    if(!assignedMode())return;
    const data=await loadStatus();
    renderQuota(data.history,data.usage);

    document.querySelectorAll('#rows tr').forEach(tr=>{
      const roBtn=tr.querySelector('td:first-child .ro-link-btn');
      if(!roBtn)return;
      const ro=String(roBtn.textContent||'').trim();
      const sector=currentSector(tr);

      organizePdca(tr);
      organizeActions(tr);

      const emailCell=makeEmailCell(tr);
      const events=eventsFor(data.history,ro,sector);
      renderEmailCell(emailCell,stateFor(events),events);

      // badges legados não ficam no setor
      tr.querySelectorAll('[data-ro-email-status]').forEach(x=>x.remove());
    });
  }

  const obs=new MutationObserver(()=>{
    clearTimeout(window.__nucleoAssignedStableTimerV13);
    window.__nucleoAssignedStableTimerV13=setTimeout(refresh,80);
  });
  obs.observe(document.documentElement,{childList:true,subtree:true});

  document.addEventListener('DOMContentLoaded',refresh);
  setTimeout(refresh,500);
  setTimeout(refresh,1200);

  window.nucleoRefreshAssignedStableV13=async function(){
    cacheAt=0;
    await refresh();
  };
})();
