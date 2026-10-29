/* NÚCLEO | Reenviar e-mail | v8 | mostrar apenas erros */
(function(){
  if(window.__nucleoRoResendEmailV8)return;
  window.__nucleoRoResendEmailV8=true;

  function esc(v){
    if(typeof escapeHtml==='function')return escapeHtml(String(v??''));
    return String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }
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
  function findRo(roNumber){
    const key=String(roNumber||'').trim();
    return (typeof getAllRoRecords==='function'?getAllRoRecords():[]).find(r=>
      String(r?.numero||r?.id||r?.codigo||'').trim()===key
    )||null;
  }
  function originalReason(tri){
    return String(
      tri?.assignmentReason||tri?.extensionReason||tri?.reason||tri?.motivo||
      tri?.note||tri?.triageReason||tri?.forwardReason||tri?.message||tri?.mensagem||''
    ).trim();
  }
  function deadlineOf(tri){
    return String(tri?.pdcaDeadline||tri?.deadline||tri?.prazo||'').trim();
  }
  function currentAssignment(roNumber,sector,ro){
    try{
      const map=getSavedTriageMap();
      const rows=getTriageRecordsForRoNumber(roNumber,map)||[];
      const wanted=norm(sector||'');
      let tri=rows.find(x=>wanted&&wanted!=='nao direcionado' &&
        norm(x?.responsibleSector||x?.setorDirecionado||'')===wanted);
      if(!tri)tri=rows.find(x=>x?.decision==='directed');
      if(!tri&&ro?.__triageRecord)tri=ro.__triageRecord;
      return tri||null;
    }catch(e){return ro?.__triageRecord||null}
  }
  function usersList(){
    try{
      if(typeof activeOperationalUsers==='function')return activeOperationalUsers()||[];
      if(typeof getOperationalUsers==='function')return getOperationalUsers()||[];
    }catch(e){}
    return [];
  }
  function userFromEmail(email){
    const wanted=String(email||'').trim().toLowerCase();
    if(!wanted)return null;
    return usersList().find(u=>String(u?.email||'').trim().toLowerCase()===wanted)||null;
  }
  function sectorFromUser(user,ro){
    if(!user)return '';
    const unit=String(
      (typeof explicitRecordUnit==='function'?explicitRecordUnit(ro):'')||
      ro?.unidade||''
    );
    const memberships=Array.isArray(user.sectorMemberships)?user.sectorMemberships:[];
    const unitNorm=typeof normalizePortalUnit==='function'?normalizePortalUnit(unit):norm(unit);
    const sectors=memberships
      .filter(m=>!unit || (typeof normalizePortalUnit==='function'
        ? normalizePortalUnit(m?.unit||'')===unitNorm
        : norm(m?.unit||'')===unitNorm))
      .map(m=>String(m?.sector||'').trim()).filter(Boolean);
    const unique=[...new Set(sectors.map(norm))];
    if(unique.length===1){
      return sectors.find(s=>norm(s)===unique[0])||'';
    }
    return String(user.sector||'').trim();
  }

  let historyCache=[];
  let historyLoadedAt=0;
  let historyPromise=null;

  async function loadHistory(force=false){
    if(!force && historyCache.length && Date.now()-historyLoadedAt<30000)return historyCache;
    if(historyPromise)return historyPromise;
    historyPromise=(async()=>{
      let local=[];
      try{if(Array.isArray(emailHistoryLoaded)&&emailHistoryLoaded.length)local=emailHistoryLoaded.slice()}catch(e){}
      try{
        const res=await portalJsonp({acao:'portal_email_status'},60000);
        if(res?.sucesso){
          local=(res.history||[]).slice();
          try{
            emailHistoryLoaded=local.slice().reverse();
            if(typeof renderEmailHistory==='function')renderEmailHistory();
          }catch(e){}
        }
      }catch(e){
        console.warn('[NÚCLEO EMAIL STATUS] Falha ao atualizar histórico central.',e);
      }
      historyCache=local;
      historyLoadedAt=Date.now();
      historyPromise=null;
      return historyCache;
    })();
    return historyPromise;
  }

  function relevantHistory(history,roNumber,sector,ro){
    const all=(history||[]).filter(h=>
      String(h?.type||'ro').toLowerCase()==='ro' &&
      sameRo(h?.ro,roNumber)
    );
    if(!all.length)return [];

    const wanted=norm(sector||'');
    if(wanted && wanted!=='nao direcionado'){
      const exact=all.filter(h=>norm(h?.sector||h?.setor||h?.responsibleSector||'')===wanted);
      if(exact.length)return exact;

      // Histórico legado: tenta descobrir setor somente pelo cadastro do destinatário.
      const inferred=all.filter(h=>{
        const raw=String(h?.email||h?.recipient||h?.destinatario||'').trim();
        const emails=raw.split(/[;,]/).map(x=>x.trim()).filter(Boolean);
        if(!emails.length)return false;
        const inferredSectors=[...new Set(emails.map(e=>norm(sectorFromUser(userFromEmail(e),ro))).filter(Boolean))];
        return inferredSectors.length===1 && inferredSectors[0]===wanted;
      });
      if(inferred.length)return inferred;
    }

    // Se não conseguiu setor, só usa automaticamente se houver um único destinatário enviado na R.O.
    const sent=all.filter(h=>String(h?.status||'').toLowerCase()==='sent');
    const emails=[...new Set(sent.flatMap(h=>String(h?.email||h?.recipient||h?.destinatario||'')
      .split(/[;,]/).map(x=>x.trim().toLowerCase()).filter(Boolean)))];
    if(emails.length===1)return all.filter(h=>
      String(h?.email||h?.recipient||h?.destinatario||'').toLowerCase().includes(emails[0])
    );

    return [];
  }

  function statusFromEvents(events){
    if(!events||!events.length)return {code:'none',label:'Sem registro',title:'Nenhum envio de e-mail identificado para esta atribuição.'};
    const sorted=events.slice().sort((a,b)=>eventTime(b)-eventTime(a));
    const latest=sorted[0];
    const status=String(latest?.status||'').toLowerCase();
    if(status==='sent')return {
      code:'sent',
      label:'Enviado',
      title:'Último envio confirmado para '+String(latest.email||latest.recipient||latest.destinatario||'destinatário')+'.'
    };
    if(status==='error')return {
      code:'error',
      label:'Erro',
      title:'O último envio registrou erro'+(latest?.error?': '+String(latest.error):'.')
    };
    if(status==='queued')return {code:'queued',label:'Pendente',title:'Envio ainda pendente na fila.'};
    return {code:'other',label:status||'Sem registro',title:'Status registrado: '+(status||'não informado')};
  }

  function firstSentEvent(events){
    const sent=(events||[]).filter(h=>String(h?.status||'').toLowerCase()==='sent');
    if(!sent.length)return null;
    return sent.slice().sort((a,b)=>eventTime(a)-eventTime(b))[0];
  }

  async function resolveAssignment(roNumber,sector,ro){
    const tri=currentAssignment(roNumber,sector,ro);
    const triSector=String(tri?.responsibleSector||tri?.setorDirecionado||sector||'').trim();

    const history=await loadHistory();
    const events=relevantHistory(history,roNumber,triSector||sector,ro);
    const first=firstSentEvent(events);

    let email='';
    let person='';
    let emailAt='';
    let historySector='';
    let historyReason='';

    if(first){
      email=String(first.email||first.recipient||first.destinatario||'').split(/[;,]/)[0].trim();
      const user=userFromEmail(email);
      person=String(first.name||first.recipientName||user?.name||'').trim();
      emailAt=String(first.at||first.sentAt||first.createdAt||'').trim();
      historySector=String(first.sector||first.setor||first.responsibleSector||'').trim();
      historyReason=String(first.reason||first.motivo||first.message||first.mensagem||'').trim();
    }

    // Se a triagem guarda explicitamente o e-mail da pessoa, ele é um fallback válido.
    if(!email)email=String(tri?.responsibleUserEmail||'').trim();

    return {
      source:first?'email_history':(tri?'triage':'manual'),
      tri:tri||null,
      sector:historySector||triSector||String(sector||'').trim(),
      email,
      person:person||String(tri?.responsibleUserName||'').trim(),
      reason:historyReason||originalReason(tri),
      deadline:deadlineOf(tri),
      emailAt,
      status:statusFromEvents(events)
    };
  }

  function sectorUsersForRo(sector,ro){
    const wanted=String(sector||'').trim();
    if(!wanted)return [];
    const unit=String(
      (typeof explicitRecordUnit==='function'?explicitRecordUnit(ro):'')||
      ro?.unidade||''
    );
    try{
      return usersList()
        .filter(u=>u && String(u.email||'').trim())
        .filter(u=>{
          try{
            if(typeof userHasUnitSector==='function'){
              return userHasUnitSector(
                u,
                typeof normalizePortalUnit==='function'?normalizePortalUnit(unit):unit,
                wanted
              );
            }
          }catch(e){}
          const direct=norm(u?.sector||'')===norm(wanted);
          const membership=(u?.sectorMemberships||[]).some(m=>
            norm(m?.sector||'')===norm(wanted) &&
            (!unit || norm(m?.unit||'')===norm(unit))
          );
          return direct||membership;
        })
        .sort((a,b)=>String(a?.name||'').localeCompare(String(b?.name||''),'pt-BR'));
    }catch(e){
      return [];
    }
  }

  function sectorRecipientOptionsHtml(sector,ro,currentEmail=''){
    const users=sectorUsersForRo(sector,ro);
    const seen=new Set();
    const opts=[];

    const current=String(currentEmail||'').trim().toLowerCase();
    if(current){
      seen.add(current);
      opts.push(
        `<option value="${esc(current)}">${esc(current)}${users.some(u=>String(u?.email||'').trim().toLowerCase()===current)?'':''}</option>`
      );
    }

    users.forEach(u=>{
      const email=String(u?.email||'').trim().toLowerCase();
      if(!email||seen.has(email))return;
      seen.add(email);
      const name=String(u?.name||'').trim();
      opts.push(`<option value="${esc(email)}">${esc(name?name+' · '+email:email)}</option>`);
    });

    if(!opts.length){
      return '<option value="">Nenhum e-mail cadastrado para este setor</option>';
    }

    return '<option value="">Escolha um destinatário cadastrado</option>'+opts.join('');
  }

  let ctx=null;

  window.nucleoCloseRoResendEmail=function(){
    document.getElementById('nucleoRoResendEmailOverlay')?.remove();
    ctx=null;
  };

  window.nucleoOpenRoResendEmail=async function(roNumber,sector){
    if(typeof isAdmin==='function'&&!isAdmin()){
      alert('Somente o SGQ/Qualidade pode reenviar este e-mail.');
      return;
    }
    const ro=findRo(roNumber);
    if(!ro){alert('R.O. não encontrada.');return;}

    const resolved=await resolveAssignment(roNumber,sector,ro);
    const responsibleSector=String(resolved?.sector||sector||'').trim();
    const email=String(resolved?.email||'').trim();
    const person=String(resolved?.person||'').trim();
    const reason=String(resolved?.reason||'').trim();
    const deadline=String(resolved?.deadline||'').trim();

    ctx={
      ro,
      tri:resolved?.tri||null,
      source:resolved?.source||'manual',
      roNumber:String(roNumber||'').trim(),
      sector:responsibleSector,
      reason,deadline,person,email,
      emailAt:resolved?.emailAt||''
    };

    document.getElementById('nucleoRoResendEmailOverlay')?.remove();
    const ov=document.createElement('div');
    ov.id='nucleoRoResendEmailOverlay';
    ov.style.cssText='position:fixed;inset:0;z-index:10120;background:rgba(15,23,42,.52);display:flex;align-items:center;justify-content:center;padding:18px';

    const sourceLabel=ctx.source==='email_history'
      ? 'E-mail recuperado do histórico'
      : ctx.source==='triage'
        ? 'E-mail recuperado da atribuição'
        : 'Destinatário não recuperado';

    ov.innerHTML=`
      <div style="width:min(660px,96vw);max-height:92vh;overflow:auto;background:#fff;border-radius:18px;box-shadow:0 26px 70px rgba(15,23,42,.28)">
        <div style="padding:20px 22px 16px;border-bottom:1px solid #e5eaf0;display:flex;justify-content:space-between;gap:14px">
          <div>
            <div style="font-size:11px;font-weight:800;letter-spacing:.1em;color:#56708e;text-transform:uppercase">${esc(sourceLabel)}</div>
            <h3 style="margin:5px 0 0">Reenviar e-mail</h3>
            <div class="small" style="margin-top:5px">${esc(roNumber)}${responsibleSector?' · '+esc(responsibleSector):''}</div>
          </div>
          <button class="btn secondary" type="button" onclick="nucleoCloseRoResendEmail()">Fechar</button>
        </div>
        <div style="padding:18px 22px 22px">
          <div class="card" style="padding:14px;background:#f8fafc">
            <div style="display:grid;grid-template-columns:150px minmax(0,1fr);gap:8px 12px;font-size:13px">
              <b>Cliente</b><span>${esc(ro.cliente||'—')}</span>
              <b>Setor original</b><span>${esc(responsibleSector||'—')}</span>
              <b>Pessoa</b><span>${esc(person||'—')}</span>
              <b>E-mail do primeiro envio</b><span style="overflow-wrap:anywhere">${esc(email||'Não recuperado — informe abaixo')}</span>
              <b>Prazo original</b><span>${esc(deadline||'—')}</span>
              <b>Justificativa original</b><span style="white-space:pre-wrap">${esc(reason||'Não recuperada no histórico disponível.')}</span>
              ${ctx.emailAt?`<b>Primeiro envio</b><span>${esc(typeof formatDateTimeBR==='function'?(formatDateTimeBR(ctx.emailAt)||ctx.emailAt):ctx.emailAt)}</span>`:''}
            </div>
          </div>

          ${!email?`<div style="margin-top:12px;padding:10px 12px;border:1px solid #f3d39a;background:#fff8eb;border-radius:11px">
            <b style="font-size:12px">Histórico antigo incompleto</b>
            <div class="small" style="margin-top:3px">Não foi possível vincular automaticamente um destinatário a esta R.O. + setor. Digite o e-mail para este reenvio.</div>
          </div>`:''}

          <div style="margin-top:14px">
            <label for="nucleoRoResendSectorRecipient" style="display:block">
              <div style="font-size:13px;font-weight:800;margin-bottom:6px">Destinatários cadastrados em ${esc(responsibleSector||'este setor')}</div>
              <select id="nucleoRoResendSectorRecipient" style="width:100%;box-sizing:border-box">
                ${sectorRecipientOptionsHtml(responsibleSector,ro,email)}
              </select>
              <div class="small" style="margin-top:6px">Ao escolher uma pessoa, o e-mail abaixo é preenchido automaticamente.</div>
            </label>
          </div>

          <div style="margin-top:12px">
            <label for="nucleoRoResendEmailRecipient" style="display:block">
              <div style="font-size:13px;font-weight:800;margin-bottom:6px">E-mail para reenvio</div>
              <input id="nucleoRoResendEmailRecipient" type="email" autocomplete="off"
                value="${esc(email||'')}" placeholder="nome@setaembalagens.com.br" style="width:100%;box-sizing:border-box">
              <div class="small" style="margin-top:6px">Você ainda pode digitar outro endereço manualmente; isso vale somente para este reenvio.</div>
            </label>
          </div>

          <div id="nucleoRoResendChangedNotice" style="display:none;margin-top:10px;padding:10px 12px;border:1px solid #f3d39a;background:#fff8eb;border-radius:11px">
            <b style="font-size:12px">Destinatário alterado</b>
            <div class="small" style="margin-top:3px">A alteração vale somente para este reenvio. A atribuição original continua inalterada.</div>
          </div>

          <div style="margin-top:14px;padding:12px 14px;border:1px solid #d7e8fb;background:#f0f7ff;border-radius:12px">
            <b style="font-size:13px">Somente reenvio</b>
            <div class="small" style="margin-top:4px">Setor, pessoa, prazo, atribuição e PDCA não serão alterados.</div>
          </div>

          <p id="nucleoRoResendEmailStatus" class="small" style="min-height:18px;margin:12px 0 0"></p>
          <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px">
            <button class="btn secondary" type="button" onclick="nucleoCloseRoResendEmail()">Cancelar</button>
            <button class="btn primary" type="button" onclick="nucleoConfirmRoResendEmail(this)">Reenviar e-mail</button>
          </div>
        </div>
      </div>`;

    ov.addEventListener('click',e=>{if(e.target===ov)nucleoCloseRoResendEmail()});
    document.body.appendChild(ov);

    const recipient=document.getElementById('nucleoRoResendEmailRecipient');
    const sectorPicker=document.getElementById('nucleoRoResendSectorRecipient');
    const changedNotice=document.getElementById('nucleoRoResendChangedNotice');

    if(sectorPicker){
      if(email && [...sectorPicker.options].some(o=>String(o.value||'').toLowerCase()===String(email||'').toLowerCase())){
        sectorPicker.value=String(email||'').toLowerCase();
      }
      sectorPicker.addEventListener('change',()=>{
        const selected=String(sectorPicker.value||'').trim();
        if(selected && recipient){
          recipient.value=selected;
          recipient.dispatchEvent(new Event('input',{bubbles:true}));
          recipient.focus();
        }
      });
    }

    if(recipient){
      const original=String(ctx.email||'').trim().toLowerCase();
      const refreshChanged=()=>{
        const current=String(recipient.value||'').trim().toLowerCase();
        if(changedNotice)changedNotice.style.display=original&&current&&current!==original?'block':'none';
      };
      recipient.addEventListener('input',refreshChanged);
      refreshChanged();
      recipient.focus();
      try{recipient.setSelectionRange(recipient.value.length,recipient.value.length)}catch(e){}
    }
  };

  window.nucleoConfirmRoResendEmail=async function(button){
    if(!ctx)return;

    const status=document.getElementById('nucleoRoResendEmailStatus');
    const recipientInput=document.getElementById('nucleoRoResendEmailRecipient');
    const sectorPicker=document.getElementById('nucleoRoResendSectorRecipient');
    const recipient=String(recipientInput?.value||'').trim().toLowerCase();

    if(!status)return;

    if(!recipient){
      status.textContent='Informe o e-mail que deve receber este reenvio.';
      status.style.color='#b42318';
      recipientInput?.focus();
      return;
    }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)){
      status.textContent='Informe um e-mail válido.';
      status.style.color='#b42318';
      recipientInput?.focus();
      return;
    }

    button.disabled=true;
    if(recipientInput)recipientInput.disabled=true;
    if(sectorPicker)sectorPicker.disabled=true;

    status.style.color='';
    status.textContent='Enviando e aguardando confirmação do Apps Script…';

    try{
      const msgParts=['A '+ctx.roNumber+' está sendo reenviada'];
      if(ctx.sector && norm(ctx.sector)!=='nao direcionado')msgParts[0]+=' ao setor '+ctx.sector;
      msgParts[0]+='.';
      if(ctx.reason)msgParts.push('Motivo do direcionamento: '+ctx.reason+'.');
      if(ctx.deadline)msgParts.push('Prazo informado na atribuição: '+ctx.deadline+'.');
      msgParts.push('Este é um reenvio da atribuição já existente no Núcleo.');

      const assignment={
        sector:(norm(ctx.sector)==='nao direcionado'?'':ctx.sector),
        email:recipient,
        reason:msgParts.join(' ')
      };

      const result=await portalJsonp({
        acao:'portal_send_directed_ro_email',
        ro:ctx.roNumber,
        setor:assignment.sector,
        email:recipient,
        unidade:ctx.ro?.unidade||'',
        tipoRO:ctx.ro?.tipoRO||ctx.ro?.tipo||'',
        cliente:ctx.ro?.cliente||'',
        registrante:ctx.ro?.registrante||'',
        mensagem:assignment.reason,
        assignments:JSON.stringify([assignment])
      },90000);

      if(!result?.sucesso && !Array.isArray(result?.results)){
        throw new Error(result?.erro||'O Apps Script não confirmou o envio.');
      }

      const rows=Array.isArray(result?.results)?result.results:[];
      const confirmed=rows.length?rows.find(r=>r?.sucesso):null;
      const failed=rows.find(r=>!r?.sucesso);

      if(failed && !confirmed){
        throw new Error(failed?.erro||failed?.error||'O envio foi recusado pelo Apps Script.');
      }

      if(rows.length && !confirmed){
        throw new Error('O Apps Script respondeu, mas nenhum envio foi confirmado.');
      }

      status.style.color='#087443';
      status.textContent='✓ E-mail enviado com sucesso para '+recipient+'.';

      historyLoadedAt=0;
      await loadHistory(true);
      await updateAssignedEmailMarkers();

      // Deixa a confirmação visível por um momento.
      setTimeout(nucleoCloseRoResendEmail,2200);

    }catch(e){
      status.style.color='#b42318';
      status.textContent='✕ Erro ao enviar: '+String(e?.message||e);
      button.disabled=false;
      if(recipientInput)recipientInput.disabled=false;
      if(sectorPicker)sectorPicker.disabled=false;

      historyLoadedAt=0;
      try{
        await loadHistory(true);
        await updateAssignedEmailMarkers();
      }catch(_){}
    }
  };

  function findActionWrap(tr){
    const wrap=tr.querySelector('.ro-row-actions')||tr.querySelector('.ro-eye-cell');
    if(wrap){
      wrap.style.display='flex';
      wrap.style.alignItems='center';
      wrap.style.justifyContent='center';
      wrap.style.gap='7px';
      wrap.style.flexWrap='nowrap';
      wrap.style.whiteSpace='nowrap';
      wrap.style.minWidth='max-content';
    }
    return wrap;
  }

  function ensureResendButton(tr,ro,sector){
    const wrap=findActionWrap(tr);
    if(!wrap)return;
    let btn=wrap.querySelector('[data-ro-resend-email]');
    if(!btn){
      btn=document.createElement('button');
      btn.type='button';
      btn.className='ro-eye-btn';
      btn.dataset.roResendEmail='1';
      btn.textContent='✉';
      btn.style.flex='0 0 auto';
      btn.style.margin='0';
      wrap.appendChild(btn);
    }
    btn.title='Reenviar e-mail da atribuição';
    btn.setAttribute('aria-label','Reenviar e-mail da atribuição');
    btn.onclick=e=>{
      e.stopPropagation();
      nucleoOpenRoResendEmail(ro,sector);
    };
  }

  function ensureStatusBadge(tr,status,events){
    const sectorCell=tr.children[2];
    if(!sectorCell)return;

    let badge=sectorCell.querySelector('[data-ro-email-status]');

    // Lista limpa: só mostra marcação quando houver ERRO.
    if(status.code!=='error'){
      if(badge)badge.remove();
      return;
    }

    if(!badge){
      badge=document.createElement('button');
      badge.type='button';
      badge.dataset.roEmailStatus='1';
      badge.style.cssText='display:inline-flex;align-items:center;gap:4px;margin-left:7px;padding:3px 7px;border-radius:999px;font-size:10px;font-weight:800;vertical-align:middle;white-space:nowrap;cursor:pointer;background:#fff0f0;color:#b42318;border:1px solid #fecdca';
      sectorCell.appendChild(badge);
    }

    badge.textContent='✉ Erro';

    const failed=(events||[])
      .filter(x=>String(x?.status||'').toLowerCase()==='error')
      .sort((a,b)=>eventTime(b)-eventTime(a));

    const last=failed[0]||{};
    const recipient=String(last?.email||last?.recipient||last?.destinatario||'').trim();
    const when=String(last?.sentAt||last?.at||last?.createdAt||'').trim();
    const error=String(last?.erro||last?.error||last?.message||last?.mensagem||'Erro não detalhado pelo servidor.').trim();

    badge.title='Clique para ver o erro do último envio.';
    badge.onclick=function(e){
      e.stopPropagation();

      const parts=[
        'Erro no envio de e-mail'
      ];

      if(recipient)parts.push('Destino: '+recipient);
      if(when){
        let formatted=when;
        try{
          if(typeof formatDateTimeBR==='function')formatted=formatDateTimeBR(when)||when;
        }catch(_){}
        parts.push('Data: '+formatted);
      }

      parts.push('Motivo: '+error);

      if(failed.length>1){
        parts.push('Falhas registradas para esta atribuição: '+failed.length);
      }

      alert(parts.join('\n'));
    };
  }

  async function updateAssignedEmailMarkers(){
    try{
      let assigned=false;
      try{assigned=typeof roListMode!=='undefined'&&roListMode==='assigned'}catch(e){}
      if(!assigned)return;
      const history=await loadHistory();
      document.querySelectorAll('#rows tr').forEach(tr=>{
        const roBtn=tr.querySelector('td:first-child .ro-link-btn');
        if(!roBtn)return;
        const ro=String(roBtn.textContent||'').trim();
        const sector=String(tr.children[2]?.childNodes?.[0]?.textContent||tr.children[2]?.textContent||'').trim();
        const roObj=findRo(ro);
        if(!ro)return;
        ensureResendButton(tr,ro,sector);
        const events=relevantHistory(history,ro,sector,roObj);
        ensureStatusBadge(tr,statusFromEvents(events),events);
      });
    }catch(e){
      console.warn('[NÚCLEO EMAIL STATUS] Falha ao marcar R.O.s atribuídas.',e);
    }
  }

  function injectButtonsAndMarkers(){
    try{
      if(typeof isAdmin==='function'&&!isAdmin())return;
      const viewEl=document.getElementById('roListView');
      if(!viewEl||viewEl.classList.contains('hidden'))return;
      let assigned=false;
      try{assigned=typeof roListMode!=='undefined'&&roListMode==='assigned'}catch(e){}
      if(!assigned)return;

      document.querySelectorAll('#rows tr').forEach(tr=>{
        const roBtn=tr.querySelector('td:first-child .ro-link-btn');
        if(!roBtn)return;
        const ro=String(roBtn.textContent||'').trim();
        const sector=String(tr.children[2]?.childNodes?.[0]?.textContent||tr.children[2]?.textContent||'').trim();
        ensureResendButton(tr,ro,sector);
      });
      updateAssignedEmailMarkers();
    }catch(e){
      console.warn('[NÚCLEO REENVIAR E-MAIL] falha ao atualizar botões',e);
    }
  }

  const obs=new MutationObserver(()=>{
    clearTimeout(window.__nucleoEmailMarkerTimer);
    window.__nucleoEmailMarkerTimer=setTimeout(injectButtonsAndMarkers,80);
  });
  obs.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',injectButtonsAndMarkers);
  setTimeout(injectButtonsAndMarkers,500);
  setTimeout(injectButtonsAndMarkers,1500);
})();
