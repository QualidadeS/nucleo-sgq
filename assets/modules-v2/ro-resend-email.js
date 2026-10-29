/* NÚCLEO | Reenviar e-mail de atribuição de R.O. | v1 */
(function(){
  if(window.__nucleoRoResendEmailV1)return;
  window.__nucleoRoResendEmailV1=true;

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

  function findAssignment(roNumber,sector){
    try{
      const map=getSavedTriageMap();
      const rows=getTriageRecordsForRoNumber(roNumber,map)||[];
      const wanted=normalizeAnswer(sector||'');
      return rows.find(x=>normalizeAnswer(x?.responsibleSector||x?.setorDirecionado||'')===wanted)
        || rows.find(x=>x?.decision==='directed')
        || null;
    }catch(e){return null}
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
      ''
    ).trim();
  }

  function deadlineOf(tri){
    return String(tri?.pdcaDeadline||tri?.deadline||tri?.prazo||'').trim();
  }

  let ctx=null;

  window.nucleoCloseRoResendEmail=function(){
    document.getElementById('nucleoRoResendEmailOverlay')?.remove();
    ctx=null;
  };

  window.nucleoOpenRoResendEmail=function(roNumber,sector){
    if(typeof isAdmin==='function'&&!isAdmin()){
      alert('Somente o SGQ/Qualidade pode reenviar este e-mail.');
      return;
    }

    const ro=findRo(roNumber);
    const tri=findAssignment(roNumber,sector);

    if(!ro){
      alert('R.O. não encontrada.');
      return;
    }
    if(!tri){
      alert('Não encontrei a atribuição original desta R.O. para este setor.');
      return;
    }

    const reason=originalReason(tri);
    const deadline=deadlineOf(tri);
    const person=String(tri.responsibleUserName||'').trim();
    const email=String(tri.responsibleUserEmail||'').trim();
    const responsibleSector=String(tri.responsibleSector||sector||'').trim();

    ctx={ro,tri,roNumber:String(roNumber||'').trim(),sector:responsibleSector,reason,deadline,person,email};

    document.getElementById('nucleoRoResendEmailOverlay')?.remove();
    const ov=document.createElement('div');
    ov.id='nucleoRoResendEmailOverlay';
    ov.style.cssText='position:fixed;inset:0;z-index:10120;background:rgba(15,23,42,.52);display:flex;align-items:center;justify-content:center;padding:18px';
    ov.innerHTML=`
      <div style="width:min(640px,96vw);max-height:92vh;overflow:auto;background:#fff;border-radius:18px;box-shadow:0 26px 70px rgba(15,23,42,.28)">
        <div style="padding:20px 22px 16px;border-bottom:1px solid #e5eaf0;display:flex;justify-content:space-between;gap:14px">
          <div>
            <div style="font-size:11px;font-weight:800;letter-spacing:.1em;color:#56708e;text-transform:uppercase">Atribuição existente</div>
            <h3 style="margin:5px 0 0">Reenviar e-mail</h3>
            <div class="small" style="margin-top:5px">${esc(roNumber)} · ${esc(responsibleSector)}</div>
          </div>
          <button class="btn secondary" type="button" onclick="nucleoCloseRoResendEmail()">Fechar</button>
        </div>

        <div style="padding:18px 22px 22px">
          <div class="card" style="padding:14px;background:#f8fafc">
            <div style="display:grid;grid-template-columns:150px 1fr;gap:8px 12px;font-size:13px">
              <b>Cliente</b><span>${esc(ro.cliente||'—')}</span>
              <b>Setor</b><span>${esc(responsibleSector||'—')}</span>
              <b>Pessoa</b><span>${esc(person||'Destinatários cadastrados do setor')}</span>
              <b>E-mail</b><span>${esc(email||'Usará os destinatários cadastrados do setor')}</span>
              <b>Prazo original</b><span>${esc(deadline||'—')}</span>
              <b>Justificativa original</b><span style="white-space:pre-wrap">${esc(reason||'Não havia justificativa gravada nesta atribuição.')}</span>
            </div>
          </div>

          <div style="margin-top:14px;padding:12px 14px;border:1px solid #d7e8fb;background:#f0f7ff;border-radius:12px">
            <b style="font-size:13px">Somente reenvio</b>
            <div class="small" style="margin-top:4px">Nenhum dado da atribuição, prazo ou PDCA será alterado.</div>
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
  };

  window.nucleoConfirmRoResendEmail=function(button){
    if(!ctx)return;
    const status=document.getElementById('nucleoRoResendEmailStatus');
    if(!status)return;

    button.disabled=true;
    status.textContent='Encaminhando o reenvio ao Apps Script…';

    try{
      const msgParts=[
        'A '+ctx.roNumber+' está sendo reenviada ao setor '+ctx.sector+'.'
      ];
      if(ctx.reason)msgParts.push('Motivo do direcionamento: '+ctx.reason+'.');
      if(ctx.deadline)msgParts.push('Prazo informado na atribuição: '+ctx.deadline+'.');
      msgParts.push('Este é um reenvio da atribuição já existente no Núcleo.');

      const submitted=portalPostForm({
        acao:'portal_send_directed_ro_email',
        ro:ctx.roNumber,
        setor:ctx.sector,
        email:ctx.email||'',
        unidade:ctx.ro?.unidade||'',
        tipoRO:ctx.ro?.tipoRO||ctx.ro?.tipo||'',
        cliente:ctx.ro?.cliente||'',
        registrante:ctx.ro?.registrante||'',
        mensagem:msgParts.join(' ')
      });

      if(!submitted)throw new Error('Não foi possível encaminhar o e-mail ao Apps Script.');

      try{
        createNotification({
          type:'ro',
          skipEmail:true,
          audience:'sector',
          sector:ctx.sector,
          ro:ctx.roNumber,
          title:'R.O. reenviada',
          message:'O SGQ reenviou por e-mail a atribuição da '+ctx.roNumber+'.'
        });
      }catch(e){}

      status.textContent='Reenvio encaminhado. Nenhuma informação da atribuição foi alterada.';
      setTimeout(nucleoCloseRoResendEmail,1200);
    }catch(e){
      status.textContent='Não foi possível reenviar: '+String(e?.message||e);
      button.disabled=false;
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
        if(tr.dataset.roResendEmailReady==='1')return;

        const roBtn=tr.querySelector('td:first-child .ro-link-btn');
        const actionWrap=tr.querySelector('.ro-row-actions > div:last-child');
        if(!roBtn||!actionWrap)return;

        const ro=String(roBtn.textContent||'').trim();
        const sector=String(tr.children[2]?.textContent||'').trim();
        if(!ro||!sector)return;

        const btn=document.createElement('button');
        btn.type='button';
        btn.className='ro-eye-btn';
        btn.title='Reenviar e-mail da atribuição';
        btn.setAttribute('aria-label','Reenviar e-mail da atribuição');
        btn.textContent='✉';
        btn.onclick=e=>{
          e.stopPropagation();
          nucleoOpenRoResendEmail(ro,sector);
        };

        actionWrap.appendChild(btn);
        tr.dataset.roResendEmailReady='1';
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
