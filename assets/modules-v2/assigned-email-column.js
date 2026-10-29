/* NÚCLEO | Coluna E-mail em R.O.s atribuídas | v12 */
(function(){
  if(window.__nucleoAssignedEmailColumnV12)return;
  window.__nucleoAssignedEmailColumnV12=true;

  function norm(v){
    try{
      return typeof normalizeAnswer==='function'
        ? normalizeAnswer(v)
        : String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
    }catch(e){
      return String(v||'').toLowerCase().trim();
    }
  }

  function roDigits(v){
    const m=String(v||'').match(/\d+/g);
    return m&&m.length?String(parseInt(m[m.length-1],10)):'';
  }

  function sameRo(a,b){
    return !!roDigits(a) && roDigits(a)===roDigits(b);
  }

  function eventTime(x){
    const d=Date.parse(String(x?.sentAt||x?.at||x?.createdAt||''));
    return Number.isFinite(d)?d:0;
  }

  function assignedMode(){
    try{return typeof roListMode!=='undefined'&&roListMode==='assigned'}catch(e){return false}
  }

  let historyCache=[];
  let historyAt=0;
  let loading=null;

  async function loadHistory(force=false){
    if(!force && historyCache.length && Date.now()-historyAt<30000)return historyCache;
    if(loading)return loading;

    loading=(async()=>{
      try{
        const res=await portalJsonp({acao:'portal_email_status'},60000);
        if(res?.sucesso){
          historyCache=(res.history||[]).slice();
          historyAt=Date.now();
          return historyCache;
        }
      }catch(e){
        console.warn('[EMAIL COLUMN V12] Falha ao carregar histórico',e);
      }
      return historyCache;
    })();

    try{return await loading}
    finally{loading=null}
  }

  function findRoObject(ro){
    try{
      return (typeof getAllRoRecords==='function'?getAllRoRecords():[])
        .find(r=>String(r?.numero||r?.id||r?.codigo||'').trim()===String(ro||'').trim())||null;
    }catch(e){return null}
  }

  function userSectorFromEmail(email,ro){
    const wanted=String(email||'').trim().toLowerCase();
    if(!wanted)return '';

    let users=[];
    try{
      users=typeof activeOperationalUsers==='function'
        ? activeOperationalUsers()
        : (typeof getOperationalUsers==='function'?getOperationalUsers():[]);
    }catch(e){}

    const user=(users||[]).find(u=>String(u?.email||'').trim().toLowerCase()===wanted);
    if(!user)return '';

    const unit=String(
      (typeof explicitRecordUnit==='function'?explicitRecordUnit(ro):'')||
      ro?.unidade||''
    );

    const sectors=[];
    (user?.sectorMemberships||[]).forEach(m=>{
      const sector=String(m?.sector||'').trim();
      if(!sector)return;
      if(unit && typeof normalizePortalUnit==='function'){
        if(normalizePortalUnit(m?.unit||'')!==normalizePortalUnit(unit))return;
      }
      sectors.push(sector);
    });

    if(!sectors.length && user?.sector)sectors.push(String(user.sector).trim());

    const unique=[...new Map(sectors.map(s=>[norm(s),s])).values()];
    return unique.length===1?unique[0]:'';
  }

  function eventsFor(history,roNumber,sector){
    const all=(history||[]).filter(h=>
      String(h?.type||'ro').toLowerCase()==='ro' &&
      sameRo(h?.ro,roNumber)
    );

    if(!all.length)return [];

    const wanted=norm(sector||'');

    if(wanted && wanted!=='nao direcionado'){
      const exact=all.filter(h=>
        norm(h?.sector||h?.setor||h?.responsibleSector||'')===wanted
      );
      if(exact.length)return exact;

      // Histórico antigo sem setor: tenta vincular pelo destinatário.
      const roObj=findRoObject(roNumber);
      const inferred=all.filter(h=>{
        const emails=String(h?.email||h?.recipient||h?.destinatario||'')
          .split(/[;,]/)
          .map(x=>x.trim())
          .filter(Boolean);
        if(!emails.length)return false;

        const sectors=[...new Set(
          emails.map(e=>norm(userSectorFromEmail(e,roObj))).filter(Boolean)
        )];

        return sectors.length===1 && sectors[0]===wanted;
      });

      if(inferred.length)return inferred;
    }

    return [];
  }

  function getState(events){
    if(!events.length){
      return {
        code:'none',
        label:'Não enviado',
        title:'Nenhum envio confirmado para esta R.O. + setor.'
      };
    }

    const sorted=events.slice().sort((a,b)=>eventTime(b)-eventTime(a));
    const latest=sorted[0];
    const status=String(latest?.status||'').toLowerCase();

    if(status==='sent'){
      return {
        code:'sent',
        label:'Enviado',
        title:'Envio confirmado para '+String(latest?.email||latest?.recipient||latest?.destinatario||'destinatário')+'.',
        latest
      };
    }

    if(status==='error'){
      return {
        code:'error',
        label:'Erro',
        title:'Clique para ver o erro do último envio.',
        latest
      };
    }

    // queued/processing/outros não são envio confirmado
    return {
      code:'none',
      label:'Não enviado',
      title:'Não há envio confirmado. Último status: '+(status||'não informado')+'.',
      latest
    };
  }

  function ensureHeader(){
    if(!assignedMode())return;
    const table=document.querySelector('#roListView table');
    if(!table)return;
    const head=table.querySelector('thead tr');
    if(!head)return;

    if(head.querySelector('[data-nucleo-email-header]'))return;

    const actionHeader=[...head.children].find(th=>
      String(th.textContent||'').trim().toLowerCase()==='ações'
    );
    if(!actionHeader)return;

    const th=document.createElement('th');
    th.dataset.nucleoEmailHeader='1';
    th.textContent='E-mail';

    actionHeader.before(th);
  }

  function ensureCell(tr){
    const actionCell=tr.querySelector('.ro-eye-cell');
    if(!actionCell)return null;

    let cell=tr.querySelector('.nucleo-email-cell');
    if(!cell){
      cell=document.createElement('td');
      cell.className='nucleo-email-cell';
      actionCell.before(cell);
    }
    return cell;
  }

  function renderCell(cell,state,events){
    if(!cell)return;

    let el=cell.querySelector('.nucleo-email-state');
    if(!el){
      el=document.createElement('button');
      el.type='button';
      el.className='nucleo-email-state';
      cell.appendChild(el);
    }

    el.className='nucleo-email-state '+state.code;
    el.textContent=state.code==='sent'
      ? '✉ Enviado'
      : state.code==='error'
        ? '✉ Erro'
        : '✉ Não enviado';

    el.title=state.title||'';
    el.onclick=null;

    if(state.code==='error'){
      el.onclick=function(e){
        e.stopPropagation();

        const failed=(events||[])
          .filter(x=>String(x?.status||'').toLowerCase()==='error')
          .sort((a,b)=>eventTime(b)-eventTime(a));

        const last=failed[0]||state.latest||{};
        const recipient=String(last?.email||last?.recipient||last?.destinatario||'').trim();
        const when=String(last?.sentAt||last?.at||last?.createdAt||'').trim();
        const error=String(
          last?.erro||last?.error||last?.message||last?.mensagem||
          'Erro não detalhado pelo servidor.'
        ).trim();

        const lines=['Erro no envio de e-mail'];
        if(recipient)lines.push('Destino: '+recipient);

        if(when){
          let formatted=when;
          try{
            if(typeof formatDateTimeBR==='function')formatted=formatDateTimeBR(when)||when;
          }catch(_){}
          lines.push('Data: '+formatted);
        }

        lines.push('Motivo: '+error);

        if(failed.length>1){
          lines.push('Falhas registradas: '+failed.length);
        }

        alert(lines.join('\n'));
      };
    }
  }

  async function refresh(){
    if(!assignedMode())return;

    ensureHeader();
    const history=await loadHistory();

    document.querySelectorAll('#rows tr').forEach(tr=>{
      const roBtn=tr.querySelector('td:first-child .ro-link-btn');
      if(!roBtn)return;

      const ro=String(roBtn.textContent||'').trim();

      // depois de RO e Unidade, a coluna seguinte é Setor.
      const sectorCell=tr.children[2];
      const sector=String(
        sectorCell?.childNodes?.[0]?.textContent ||
        sectorCell?.textContent ||
        ''
      ).trim();

      const cell=ensureCell(tr);
      const events=eventsFor(history,ro,sector);
      const state=getState(events);

      renderCell(cell,state,events);
    });
  }

  // Remove badges antigos de e-mail que possam ter ficado na coluna Setor.
  function cleanupOldBadges(){
    document.querySelectorAll('#rows [data-ro-email-status]').forEach(el=>el.remove());
  }

  const obs=new MutationObserver(()=>{
    clearTimeout(window.__nucleoEmailColumnTimerV12);
    window.__nucleoEmailColumnTimerV12=setTimeout(()=>{
      cleanupOldBadges();
      refresh();
    },70);
  });

  obs.observe(document.documentElement,{childList:true,subtree:true});

  document.addEventListener('DOMContentLoaded',()=>{
    cleanupOldBadges();
    refresh();
  });

  setTimeout(()=>{cleanupOldBadges();refresh();},500);
  setTimeout(()=>{cleanupOldBadges();refresh();},1200);

  window.nucleoRefreshAssignedEmailColumnV12=async function(){
    historyAt=0;
    await refresh();
  };
})();
