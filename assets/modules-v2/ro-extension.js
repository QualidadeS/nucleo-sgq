/* NÚCLEO | Estender R.O. para novos setores | v2
   Uma nova atribuição por setor, justificativa individual e e-mail explícito.
*/
(function(){
  if(window.__nucleoRoExtensionV2)return;
  window.__nucleoRoExtensionV2=true;

  function esc(v){
    if(typeof escapeHtml==='function')return escapeHtml(String(v??''));
    return String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }
  function roKeyValue(v){return String(v||'').trim()}

  function findRo(roNumber){
    const key=roKeyValue(roNumber);
    return (typeof getAllRoRecords==='function'?getAllRoRecords():[]).find(r=>
      roKeyValue(r?.numero||r?.id||r?.codigo)===key
    )||null;
  }

  function roUnit(ro){
    try{
      const u=typeof explicitRecordUnit==='function'?explicitRecordUnit(ro):'';
      if(u)return u;
    }catch(e){}
    const raw=String(ro?.unidade||ro?.unit||'').toLowerCase();
    return raw.includes('linhares')||raw.includes('filial')||raw.includes('seta es')?'filial':'matriz';
  }

  function sectorsForRo(ro){
    const unit=roUnit(ro);
    let sectors=[];
    try{
      if(typeof getConfiguredSectors==='function')sectors=getConfiguredSectors(unit)||[];
    }catch(e){}
    if(!sectors.length){
      try{
        const cfg=typeof unitConfiguration==='function'?unitConfiguration(unit):null;
        if(Array.isArray(cfg?.sectorList))sectors=cfg.sectorList;
        else if(typeof cfg?.sectorList==='string')sectors=cfg.sectorList.split(/\r?\n|;/);
      }catch(e){}
    }
    if(!sectors.length){
      try{if(typeof unifiedActionAllSectors==='function')sectors=unifiedActionAllSectors()}catch(e){}
    }
    return [...new Set((sectors||[]).map(x=>String(x||'').trim()).filter(Boolean))]
      .sort((a,b)=>a.localeCompare(b,'pt-BR',{sensitivity:'base'}));
  }

  function assignedSectors(roNumber){
    const out=[];
    try{
      const map=getSavedTriageMap();
      getTriageRecordsForRoNumber(roNumber,map).forEach(t=>{
        const s=String(t?.responsibleSector||t?.setorDirecionado||'').trim();
        if(s)out.push(s);
      });
    }catch(e){}
    return [...new Set(out.map(x=>normalizeAnswer(x)))];
  }

  function cleanInheritedPdca(record){
    [
      'pdcaExternal','pdcaSource','pdcaFileId','pdcaExternalUpdatedAt','pdcaResponded',
      'pdcaSent','pdcaPresented','pdcaReviewDecision','pdcaReviewAt','pdcaReviewBy',
      'apresentadoEm','presentedAt','deliveredAt','deliveryAt','pdcaId','fileId'
    ].forEach(k=>delete record[k]);
    return record;
  }

  let ctx=null;

  window.nucleoCloseRoExtension=function(){
    document.getElementById('nucleoRoExtensionOverlay')?.remove();
    ctx=null;
  };

  window.nucleoToggleExtensionSector=function(index,checked){
    const card=document.querySelector(`[data-ro-extension-card="${index}"]`);
    const reason=document.querySelector(`[data-ro-extension-reason="${index}"]`);
    if(card){
      card.style.borderColor=checked?'#2f67a8':'#d8e1ec';
      card.style.background=checked?'#f2f7fd':'#fff';
      card.style.boxShadow=checked?'0 0 0 2px rgba(47,103,168,.08)':'none';
    }
    if(reason)reason.style.display=checked?'block':'none';
    const count=document.querySelectorAll('[data-ro-extension-sector]:checked').length;
    const countEl=document.getElementById('nucleoRoExtensionCount');
    if(countEl)countEl.textContent=count?`${count} setor${count===1?'':'es'} selecionado${count===1?'':'s'}`:'Nenhum setor selecionado';
  };

  window.nucleoOpenRoExtension=function(roNumber,sourceSector='',sourceTriageKey=''){
    if(typeof isAdmin==='function'&&!isAdmin()){
      alert('Somente o SGQ/Qualidade pode estender uma R.O.');
      return;
    }
    const ro=findRo(roNumber);
    if(!ro){
      alert('R.O. não encontrada. Sincronize a base e tente novamente.');
      return;
    }

    const sectors=sectorsForRo(ro);
    const used=new Set(assignedSectors(roNumber));
    const available=sectors.filter(s=>!used.has(normalizeAnswer(s)));

    if(!available.length){
      alert('Todos os setores configurados desta unidade já possuem vínculo com esta R.O.');
      return;
    }

    ctx={roNumber:roKeyValue(roNumber),sourceSector:String(sourceSector||'').trim(),sourceTriageKey:String(sourceTriageKey||'').trim(),ro,available};

    document.getElementById('nucleoRoExtensionOverlay')?.remove();
    const ov=document.createElement('div');
    ov.id='nucleoRoExtensionOverlay';
    ov.style.cssText='position:fixed;inset:0;z-index:10080;background:rgba(15,23,42,.54);display:flex;align-items:center;justify-content:center;padding:18px';

    ov.innerHTML=`
      <div style="width:min(900px,97vw);max-height:94vh;overflow:auto;background:#fff;border-radius:20px;box-shadow:0 28px 80px rgba(15,23,42,.28)">
        <div style="position:sticky;top:0;z-index:2;background:#fff;border-bottom:1px solid #e5eaf0;padding:20px 22px 16px;display:flex;justify-content:space-between;gap:16px;align-items:flex-start">
          <div>
            <div style="font-size:11px;font-weight:800;letter-spacing:.1em;color:#56708e;text-transform:uppercase">Ampliação da tratativa</div>
            <h2 style="margin:4px 0 0;font-size:21px">Estender R.O.</h2>
            <div class="small" style="margin-top:5px"><b>${esc(roNumber)}</b>${sourceSector?' · vínculo atual: '+esc(sourceSector):''}</div>
          </div>
          <button class="btn secondary" type="button" onclick="nucleoCloseRoExtension()">Fechar</button>
        </div>

        <div style="padding:20px 22px 24px">
          <div style="display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center;padding:13px 15px;background:#f6f9fc;border:1px solid #e1e8f0;border-radius:13px">
            <div>
              <b>Adicione somente os novos responsáveis</b>
              <div class="small" style="margin-top:4px">Cada setor vira uma atribuição independente e deverá responder o próprio PDCA. O histórico anterior permanece intacto.</div>
            </div>
            <span id="nucleoRoExtensionCount" class="status-badge">Nenhum setor selecionado</span>
          </div>

          <div style="margin-top:18px">
            <div style="font-size:13px;font-weight:800;margin-bottom:9px">Novos setores responsáveis</div>
            <div id="nucleoRoExtensionSectors" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(205px,1fr));gap:9px">
              ${available.map((s,i)=>`
                <label data-ro-extension-card="${i}" style="min-height:58px;display:flex;gap:10px;align-items:center;border:1px solid #d8e1ec;border-radius:13px;padding:11px 13px;background:#fff;cursor:pointer;transition:.15s ease">
                  <input type="checkbox" value="${esc(s)}" data-ro-extension-sector="${i}" onchange="nucleoToggleExtensionSector(${i},this.checked)" style="width:18px;height:18px;flex:0 0 auto">
                  <span style="font-size:13px;font-weight:650;line-height:1.2">${esc(s)}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <div style="margin-top:16px;display:grid;gap:10px">
            ${available.map((s,i)=>`
              <div data-ro-extension-reason="${i}" style="display:none;border:1px solid #dce5ef;border-radius:13px;padding:13px 14px;background:#fbfcfe">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:7px">
                  <span style="width:7px;height:7px;border-radius:50%;background:#2f67a8"></span>
                  <b style="font-size:13px">${esc(s)}</b>
                  <span class="small">· justificativa obrigatória</span>
                </div>
                <textarea data-ro-extension-reason-input="${i}" rows="3" maxlength="700" placeholder="Por que esta R.O. também precisa ser enviada para ${esc(s)}?"></textarea>
              </div>
            `).join('')}
          </div>

          <div style="display:grid;grid-template-columns:minmax(220px,300px) 1fr;gap:14px;margin-top:16px;align-items:end">
            <label>
              <span>Prazo dos novos setores</span>
              <input id="nucleoRoExtensionDeadline" type="date" value="${typeof nextTuesdayIsoDate==='function'?nextTuesdayIsoDate():''}">
            </label>
            <div class="small" style="padding-bottom:9px">O prazo é comum às novas atribuições; a justificativa é individual para cada setor.</div>
          </div>

          <div style="margin-top:14px;padding:12px 14px;border-radius:12px;background:#f0f7ff;border:1px solid #d7e8fb">
            <b style="font-size:13px">Envio automático</b>
            <div class="small" style="margin-top:4px">Ao confirmar, o Núcleo envia a R.O. por e-mail para os destinatários cadastrados de cada setor e cria também a notificação interna.</div>
          </div>

          <p id="nucleoRoExtensionStatus" class="small" role="status" style="min-height:18px;margin:12px 0 0"></p>

          <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px">
            <button class="btn secondary" type="button" onclick="nucleoCloseRoExtension()">Cancelar</button>
            <button class="btn primary" type="button" onclick="nucleoConfirmRoExtension(this)">Criar e enviar</button>
          </div>
        </div>
      </div>`;

    ov.addEventListener('click',e=>{if(e.target===ov)nucleoCloseRoExtension()});
    document.body.appendChild(ov);
  };

  window.nucleoConfirmRoExtension=async function(button){
    const status=document.getElementById('nucleoRoExtensionStatus');
    if(!ctx||!status)return;

    const selected=[...document.querySelectorAll('[data-ro-extension-sector]:checked')].map(input=>{
      const index=Number(input.dataset.roExtensionSector);
      return {
        index,
        sector:String(input.value||'').trim(),
        reason:String(document.querySelector(`[data-ro-extension-reason-input="${index}"]`)?.value||'').trim()
      };
    }).filter(x=>x.sector);

    const deadline=String(document.getElementById('nucleoRoExtensionDeadline')?.value||'').trim()||
      (typeof nextTuesdayIsoDate==='function'?nextTuesdayIsoDate():'');

    if(!selected.length){
      status.textContent='Selecione pelo menos um novo setor.';
      return;
    }

    const missing=selected.find(x=>!x.reason);
    if(missing){
      status.textContent='Informe a justificativa para '+missing.sector+'.';
      document.querySelector(`[data-ro-extension-reason-input="${missing.index}"]`)?.focus();
      return;
    }

    button.disabled=true;
    status.textContent='Criando as novas atribuições…';

    try{
      const map=getSavedTriageMap();
      const sourceRecords=getTriageRecordsForRoNumber(ctx.roNumber,map);
      let source=ctx.sourceTriageKey?map.get(ctx.sourceTriageKey):null;
      if(!source&&ctx.sourceSector){
        source=sourceRecords.find(t=>normalizeAnswer(t?.responsibleSector||t?.setorDirecionado||'')===normalizeAnswer(ctx.sourceSector));
      }
      if(!source){
        source=sourceRecords.slice().sort((a,b)=>String(b?.updatedAt||b?.triagedAt||'').localeCompare(String(a?.updatedAt||a?.triagedAt||'')))[0]||{};
      }

      const now=new Date().toISOString();
      const actor=getSession()?.name||'SGQ';
      let created=0;
      let emailsSent=0;
      const skipped=[];
      const emailErrors=[];

      for(let pos=0;pos<selected.length;pos++){
        const {sector,reason}=selected[pos];
        status.textContent=`Criando ${sector} (${pos+1}/${selected.length})…`;

        const key=triageCompositeKey(ctx.roNumber,sector);
        const existing=map.get(key);
        if(existing?.decision==='directed'){
          skipped.push(sector);
          continue;
        }

        const record=cleanInheritedPdca({
          ...source,
          roKey:key,
          roNumber:ctx.roNumber,
          decision:'directed',
          decisionId:'directed',
          decisionLabel:'Direcionar para tratativa',
          responsibleSector:sector,
          responsibleUserEmail:'',
          responsibleUserName:'',
          pdcaRequired:true,
          pdcaDeadline:deadline,
          triagedAt:now,
          updatedAt:now,
          updatedBy:actor,
          importedFromSheet:false,
          __synthetic:false,
          extensionOf:ctx.roNumber,
          extensionFromSector:ctx.sourceSector||String(source?.responsibleSector||'').trim(),
          extensionReason:reason,
          assignmentReason:reason,
          extendedAt:now,
          extendedBy:actor,
          note:'Extensão da R.O. para '+sector+': '+reason
        });

        if(typeof nucleoRemovalSaveVerified!=='function'){
          throw new Error('A rotina de gravação central não está disponível nesta versão.');
        }

        await nucleoRemovalSaveVerified('triage',key,record,null,90000);
        map.set(key,record);
        created++;

        try{
          status.textContent=`Enviando e-mail para ${sector} (${pos+1}/${selected.length})…`;
          const emailResult=await portalJsonp({
            acao:'portal_send_directed_ro_email',
            ro:ctx.roNumber,
            setor:sector,
            email:'',
            unidade:ctx.ro?.unidade||roUnit(ctx.ro)||'',
            tipoRO:ctx.ro?.tipoRO||ctx.ro?.tipo||'',
            cliente:ctx.ro?.cliente||'',
            registrante:ctx.ro?.registrante||'',
            mensagem:
              'A '+ctx.roNumber+' foi estendida para '+sector+'. '+
              'Motivo do direcionamento: '+reason+'. '+
              'É necessário analisar a ocorrência e responder o PDCA.'
          },45000);
          emailsSent+=(emailResult?.enviados||[]).length;
          if(!emailResult?.sucesso){
            emailErrors.push(sector+': '+(emailResult?.erro||(emailResult?.erros||[]).join(' | ')||'erro não informado'));
          }
        }catch(emailErr){
          emailErrors.push(sector+': '+String(emailErr?.message||emailErr));
        }

        try{
          createNotification({
            type:'ro',
            skipEmail:true,
            audience:'sector',
            sector,
            ro:ctx.roNumber,
            unidade:ctx.ro?.unidade||'',
            tipoRO:ctx.ro?.tipoRO||ctx.ro?.tipo||'',
            cliente:ctx.ro?.cliente||'',
            registrante:ctx.ro?.registrante||'',
            title:'R.O. estendida para seu setor',
            message:'A '+ctx.roNumber+' foi estendida para '+sector+'. Motivo: '+reason+'. É necessário analisar a ocorrência e responder o PDCA.'
          });
          if(typeof notifyManagersOfDirectedRo==='function'){
            notifyManagersOfDirectedRo(ctx.roNumber,sector,ctx.ro,'');
          }
        }catch(e){
          console.warn('[NÚCLEO EXTENDER R.O.] notificação interna não enviada',e);
        }
      }

      localStorage.setItem(TRIAGE_KEY,JSON.stringify([...map.values()]));

      try{
        const origin=String(ctx.ro?.origemBase||ctx.ro?.raw?.__origemBase||'');
        const canonical=nucleoPdcaReviewCanonical2026(ctx.roNumber,origin);
        const review=nucleoPdcaReviewMap2026();
        if(review?.[canonical]?.decision==='no'){
          review[canonical]={decision:'yes',automatic:false,at:now,by:actor,ro:ctx.roNumber,origin,reason:'R.O. estendida para novo setor'};
          nucleoSavePdcaReviewMap2026(review);
        }
      }catch(e){}

      try{if(typeof refreshEmailHistory==='function')await refreshEmailHistory()}catch(e){}
      try{render()}catch(e){}
      try{renderSentPdcas()}catch(e){}
      try{renderTriage()}catch(e){}
      try{refreshRoSummary()}catch(e){}
      try{refreshMenuNotificationBadges()}catch(e){}
      try{Promise.resolve(syncPortalBackend(false,{foreground:false})).catch(()=>{})}catch(e){}

      const parts=[];
      parts.push(created+' nova'+(created===1?' atribuição criada':'s atribuições criadas'));
      if(emailsSent)parts.push(emailsSent+' e-mail'+(emailsSent===1?' enviado':'s enviados'));
      if(skipped.length)parts.push(skipped.length+' setor'+(skipped.length===1?' já estava vinculado':'es já estavam vinculados'));
      if(emailErrors.length)parts.push('falha de e-mail: '+emailErrors.join(' | '));
      status.textContent=parts.join(' · ')+'.';

      if(created&&!emailErrors.length)setTimeout(nucleoCloseRoExtension,1200);
      else button.disabled=false;
    }catch(e){
      console.error('[NÚCLEO EXTENDER R.O.]',e);
      status.textContent='Não foi possível estender a R.O.: '+String(e?.message||e);
      button.disabled=false;
    }
  };

  function addAssignedButtons(){
    const viewEl=document.getElementById('roListView');
    if(!viewEl||viewEl.classList.contains('hidden'))return;
    let assigned=false;
    try{assigned=typeof roListMode!=='undefined'&&roListMode==='assigned'}catch(e){}
    if(!assigned)return;

    document.querySelectorAll('#rows tr').forEach(tr=>{
      if(tr.dataset.roExtensionReady==='1')return;
      const roBtn=tr.querySelector('td:first-child .ro-link-btn');
      const actionWrap=tr.querySelector('.ro-row-actions > div:last-child');
      if(!roBtn||!actionWrap)return;
      const ro=String(roBtn.textContent||'').trim();
      const sector=String(tr.children[2]?.textContent||'').trim();
      if(!ro)return;

      const b=document.createElement('button');
      b.type='button';
      b.className='ro-eye-btn';
      b.title='Estender R.O. para outros setores';
      b.setAttribute('aria-label','Estender R.O. para outros setores');
      b.textContent='↗';
      b.onclick=e=>{e.stopPropagation();nucleoOpenRoExtension(ro,sector,'')};
      actionWrap.appendChild(b);
      tr.dataset.roExtensionReady='1';
    });
  }

  function addSentButtons(){
    document.querySelectorAll('#sentRows tr').forEach(tr=>{
      if(tr.dataset.roExtensionReady==='1')return;
      const cells=tr.querySelectorAll('td');
      if(cells.length<8)return;
      const ro=String(cells[1]?.textContent||'').trim();
      if(!ro)return;

      const target=cells[cells.length-1];
      const b=document.createElement('button');
      b.type='button';
      b.className='btn secondary';
      b.style.cssText='margin-left:6px;padding:5px 8px;font-size:11px';
      b.textContent='Estender R.O.';
      b.onclick=e=>{e.stopPropagation();nucleoOpenRoExtension(ro,'','')};
      target.appendChild(b);
      tr.dataset.roExtensionReady='1';
    });
  }

  function refreshButtons(){
    try{
      if(typeof isAdmin==='function'&&!isAdmin())return;
      addAssignedButtons();
      addSentButtons();
    }catch(e){
      console.warn('[NÚCLEO EXTENDER R.O.] falha ao atualizar botões',e);
    }
  }

  const observer=new MutationObserver(()=>refreshButtons());
  observer.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',refreshButtons);
  setTimeout(refreshButtons,500);
  setTimeout(refreshButtons,1500);

})();
