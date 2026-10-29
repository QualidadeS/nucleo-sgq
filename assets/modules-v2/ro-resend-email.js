/* NÚCLEO | Reenviar e-mail de atribuição de R.O. | v3 | destinatário editável */
(function(){
  if(window.__nucleoRoResendEmailV3)return;
  window.__nucleoRoResendEmailV3=true;

  function esc(v){
    if(typeof escapeHtml==='function')return escapeHtml(String(v??''));
    return String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }

  function findRo(roNumber){
    const key=String(roNumber||'').trim();
    return (typeof getAllRoRecords==='function'?getAllRoRecords():[]).find(r=>
      String(r?.numero||r?.id||r?.codigo||'').trim()===key
    )||null;
  }

  function originalReason(tri){
    return String(
      tri?.assignmentReason||
      tri?.extensionReason||
      tri?.reason||
      tri?.motivo||
      tri?.note||
      tri?.triageReason||
      tri?.forwardReason||
      tri?.message||
      tri?.mensagem||
      ''
    ).trim();
  }

  function deadlineOf(tri){
    return String(tri?.pdcaDeadline||tri?.deadline||tri?.prazo||'').trim();
  }

  function currentAssignment(roNumber,sector,ro){
    try{
      const map=getSavedTriageMap();
      const rows=getTriageRecordsForRoNumber(roNumber,map)||[];
      const wanted=normalizeAnswer(sector||'');
      let tri=rows.find(x=>wanted && wanted!=='nao direcionado' &&
        normalizeAnswer(x?.responsibleSector||x?.setorDirecionado||'')===wanted);
      if(!tri)tri=rows.find(x=>x?.decision==='directed');
      if(!tri && ro?.__triageRecord)tri=ro.__triageRecord;
      return tri||null;
    }catch(e){
      return ro?.__triageRecord||null;
    }
  }

  function userFromEmail(email){
    const wanted=String(email||'').trim().toLowerCase();
    if(!wanted)return null;
    try{
      const users=typeof activeOperationalUsers==='function'
        ? activeOperationalUsers()
        : (typeof getOperationalUsers==='function'?getOperationalUsers():[]);
      return (users||[]).find(u=>String(u?.email||'').trim().toLowerCase()===wanted)||null;
    }catch(e){return null}
  }

  function sectorFromUser(user,ro){
    if(!user)return '';
    const unit=String(
      (typeof explicitRecordUnit==='function'?explicitRecordUnit(ro):'')||
      ro?.unidade||''
    );
    const memberships=Array.isArray(user.sectorMemberships)?user.sectorMemberships:[];
    const byUnit=memberships.find(m=>
      !unit ||
      (typeof normalizePortalUnit==='function'
        ? normalizePortalUnit(m?.unit||'')===normalizePortalUnit(unit)
        : String(m?.unit||'').toLowerCase()===String(unit).toLowerCase())
    );
    return String(byUnit?.sector||user.sector||'').trim();
  }

  async function latestEmailForRo(roNumber){
    let history=[];
    try{
      if(Array.isArray(emailHistoryLoaded)&&emailHistoryLoaded.length){
        history=emailHistoryLoaded;
      }
    }catch(e){}

    // Sempre consulta o central se o histórico local não tiver a R.O.
    let found=history.find(x=>String(x?.ro||'').trim()===String(roNumber||'').trim() && String(x?.status||'').toLowerCase()==='sent');
    if(found)return found;

    try{
      const res=await portalJsonp({acao:'portal_email_status'},60000);
      if(res?.sucesso){
        history=(res.history||[]).slice().reverse();
        try{
          emailHistoryLoaded=history;
          if(typeof renderEmailHistory==='function')renderEmailHistory();
        }catch(e){}
        found=history.find(x=>String(x?.ro||'').trim()===String(roNumber||'').trim() && String(x?.status||'').toLowerCase()==='sent');
      }
    }catch(e){}
    return found||null;
  }

  async function resolveAssignment(roNumber,sector,ro){
    const tri=currentAssignment(roNumber,sector,ro);
    if(tri){
      const realSector=String(tri.responsibleSector||tri.setorDirecionado||sector||'').trim();
      const badSector=normalizeAnswer(realSector)==='nao direcionado';
      if(!badSector){
        return {
          source:'triage',
          tri,
          sector:realSector,
          email:String(tri.responsibleUserEmail||'').trim(),
          person:String(tri.responsibleUserName||'').trim(),
          reason:originalReason(tri),
          deadline:deadlineOf(tri)
        };
      }
    }

    const h=await latestEmailForRo(roNumber);
    if(!h)return null;

    const email=String(h.email||h.recipient||h.destinatario||'').trim();
    const user=userFromEmail(email);
    const historySector=String(h.sector||h.setor||h.responsibleSector||'').trim();
    const inferredSector=historySector||sectorFromUser(user,ro);
    const historyReason=String(h.reason||h.motivo||h.message||h.mensagem||'').trim();

    return {
      source:'email_history',
      tri:tri||null,
      sector:inferredSector||String(sector||'').trim(),
      email,
      person:String(h.name||h.recipientName||user?.name||'').trim(),
      reason:historyReason||originalReason(tri),
      deadline:deadlineOf(tri),
      emailAt:String(h.at||h.sentAt||h.createdAt||'').trim()
    };
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
    if(!ro){
      alert('R.O. não encontrada.');
      return;
    }

    const resolved=await resolveAssignment(roNumber,sector,ro);
    if(!resolved){
      alert('Não encontrei uma atribuição atual nem um e-mail anterior desta R.O.');
      return;
    }

    const responsibleSector=String(resolved.sector||'').trim();
    const email=String(resolved.email||'').trim();
    const person=String(resolved.person||'').trim();
    const reason=String(resolved.reason||'').trim();
    const deadline=String(resolved.deadline||'').trim();

    if(!email){
      alert('Encontrei a atribuição, mas não consegui recuperar o e-mail usado no primeiro envio. Verifique o histórico de e-mails desta R.O.');
      return;
    }

    ctx={
      ro,
      tri:resolved.tri,
      source:resolved.source,
      roNumber:String(roNumber||'').trim(),
      sector:responsibleSector,
      reason,
      deadline,
      person,
      email,
      emailAt:resolved.emailAt||''
    };

    document.getElementById('nucleoRoResendEmailOverlay')?.remove();
    const ov=document.createElement('div');
    ov.id='nucleoRoResendEmailOverlay';
    ov.style.cssText='position:fixed;inset:0;z-index:10120;background:rgba(15,23,42,.52);display:flex;align-items:center;justify-content:center;padding:18px';

    const sourceLabel=ctx.source==='email_history'
      ? 'Recuperado do histórico de e-mails'
      : 'Recuperado da atribuição original';

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
            <div style="display:grid;grid-template-columns:150px 1fr;gap:8px 12px;font-size:13px">
              <b>Cliente</b><span>${esc(ro.cliente||'—')}</span>
              <b>Setor original</b><span>${esc(responsibleSector||'Não identificado no histórico')}</span>
              <b>Pessoa</b><span>${esc(person||'—')}</span>
              <b>E-mail do primeiro envio</b><span>${esc(email||'Não recuperado')}</span>
              <b>Prazo original</b><span>${esc(deadline||'—')}</span>
              <b>Justificativa original</b><span style="white-space:pre-wrap">${esc(reason||'Não recuperada no histórico disponível.')}</span>
              ${ctx.emailAt?`<b>Último envio</b><span>${esc(typeof formatDateTimeBR==='function'?(formatDateTimeBR(ctx.emailAt)||ctx.emailAt):ctx.emailAt)}</span>`:''}
            </div>
          </div>

          <div style="margin-top:14px">
            <label for="nucleoRoResendEmailRecipient" style="display:block">
              <div style="font-size:13px;font-weight:800;margin-bottom:6px">E-mail para reenvio</div>
              <input
                id="nucleoRoResendEmailRecipient"
                type="email"
                autocomplete="off"
                value="${esc(email||'')}"
                placeholder="nome@setaembalagens.com.br"
                style="width:100%;box-sizing:border-box"
              >
              <div class="small" style="margin-top:6px">
                O campo começa com o e-mail usado no primeiro envio. Você pode alterá-lo somente para este reenvio.
              </div>
            </label>
          </div>

          <div id="nucleoRoResendChangedNotice" style="display:none;margin-top:10px;padding:10px 12px;border:1px solid #f3d39a;background:#fff8eb;border-radius:11px">
            <b style="font-size:12px">Destinatário alterado</b>
            <div class="small" style="margin-top:3px">A alteração vale somente para este reenvio. A atribuição original continua inalterada.</div>
          </div>

          <div style="margin-top:14px;padding:12px 14px;border:1px solid #d7e8fb;background:#f0f7ff;border-radius:12px">
            <b style="font-size:13px">Somente reenvio</b>
            <div class="small" style="margin-top:4px">Nenhum dado da atribuição, prazo ou PDCA será alterado. O novo destinatário ficará registrado apenas no histórico deste reenvio.</div>
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
    const changedNotice=document.getElementById('nucleoRoResendChangedNotice');
    if(recipient){
      const original=String(ctx.email||'').trim().toLowerCase();
      const refreshChanged=()=>{
        const current=String(recipient.value||'').trim().toLowerCase();
        if(changedNotice)changedNotice.style.display=current && current!==original?'block':'none';
      };
      recipient.addEventListener('input',refreshChanged);
      refreshChanged();
      recipient.focus();
      try{recipient.setSelectionRange(recipient.value.length,recipient.value.length)}catch(e){}
    }
  };

  window.nucleoConfirmRoResendEmail=function(button){
    if(!ctx)return;
    const status=document.getElementById('nucleoRoResendEmailStatus');
    if(!status)return;

    const recipientInput=document.getElementById('nucleoRoResendEmailRecipient');
    const recipient=String(recipientInput?.value||'').trim().toLowerCase();

    if(!recipient){
      status.textContent='Informe o e-mail que deve receber este reenvio.';
      recipientInput?.focus();
      return;
    }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)){
      status.textContent='Informe um e-mail válido.';
      recipientInput?.focus();
      return;
    }

    button.disabled=true;
    if(recipientInput)recipientInput.disabled=true;
    status.textContent='Encaminhando o reenvio ao Apps Script…';

    try{
      const msgParts=['A '+ctx.roNumber+' está sendo reenviada'];
      if(ctx.sector && normalizeAnswer(ctx.sector)!=='nao direcionado')msgParts[0]+=' ao setor '+ctx.sector;
      msgParts[0]+='.';
      if(ctx.reason)msgParts.push('Motivo do direcionamento: '+ctx.reason+'.');
      if(ctx.deadline)msgParts.push('Prazo informado na atribuição: '+ctx.deadline+'.');
      msgParts.push('Este é um reenvio da atribuição já existente no Núcleo.');

      const submitted=portalPostForm({
        acao:'portal_send_directed_ro_email',
        ro:ctx.roNumber,
        setor:(normalizeAnswer(ctx.sector)==='nao direcionado'?'':ctx.sector),
        email:recipient,
        unidade:ctx.ro?.unidade||'',
        tipoRO:ctx.ro?.tipoRO||ctx.ro?.tipo||'',
        cliente:ctx.ro?.cliente||'',
        registrante:ctx.ro?.registrante||'',
        mensagem:msgParts.join(' ')
      });

      if(!submitted)throw new Error('Não foi possível encaminhar o e-mail ao Apps Script.');

      status.textContent='Reenvio encaminhado para '+recipient+'. Nenhuma informação da atribuição foi alterada.';
      setTimeout(nucleoCloseRoResendEmail,1400);
    }catch(e){
      status.textContent='Não foi possível reenviar: '+String(e?.message||e);
      button.disabled=false;
      if(recipientInput)recipientInput.disabled=false;
    }
  };

  function injectButtons(){
    try{
      if(typeof isAdmin==='function'&&!isAdmin())return;
      const viewEl=document.getElementById('roListView');
      if(!viewEl||viewEl.classList.contains('hidden'))return;
      let assigned=false;
      try{assigned=typeof roListMode!=='undefined'&&roListMode==='assigned'}catch(e){}
      if(!assigned)return;

      document.querySelectorAll('#rows tr').forEach(tr=>{
        if(tr.dataset.roResendEmailReady==='2')return;
        const roBtn=tr.querySelector('td:first-child .ro-link-btn');
        const actionWrap=tr.querySelector('.ro-row-actions > div:last-child');
        if(!roBtn||!actionWrap)return;
        const ro=String(roBtn.textContent||'').trim();
        const sector=String(tr.children[2]?.textContent||'').trim();
        if(!ro)return;

        const old=actionWrap.querySelector('[data-ro-resend-email]');
        if(old)old.remove();

        const btn=document.createElement('button');
        btn.type='button';
        btn.className='ro-eye-btn';
        btn.dataset.roResendEmail='1';
        btn.title='Reenviar e-mail da atribuição';
        btn.setAttribute('aria-label','Reenviar e-mail da atribuição');
        btn.textContent='✉';
        btn.onclick=e=>{
          e.stopPropagation();
          nucleoOpenRoResendEmail(ro,sector);
        };
        actionWrap.appendChild(btn);
        tr.dataset.roResendEmailReady='2';
      });
    }catch(e){
      console.warn('[NÚCLEO REENVIAR E-MAIL] falha ao atualizar botões',e);
    }
  }

  const obs=new MutationObserver(injectButtons);
  obs.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',injectButtons);
  setTimeout(injectButtons,500);
  setTimeout(injectButtons,1500);
})();
