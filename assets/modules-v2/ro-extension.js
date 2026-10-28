/* NÚCLEO | Estender R.O. para novos setores
   Cria uma nova atribuição por setor sem alterar ou duplicar o histórico anterior.
*/
(function(){
  if(window.__nucleoRoExtensionV1)return;
  window.__nucleoRoExtensionV1=true;

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
      try{
        if(typeof unifiedActionAllSectors==='function')sectors=unifiedActionAllSectors();
      }catch(e){}
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

  let ctx=null;

  window.nucleoCloseRoExtension=function(){
    document.getElementById('nucleoRoExtensionOverlay')?.remove();
    ctx=null;
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

    ctx={roNumber:roKeyValue(roNumber),sourceSector:String(sourceSector||'').trim(),sourceTriageKey:String(sourceTriageKey||'').trim(),ro};

    document.getElementById('nucleoRoExtensionOverlay')?.remove();
    const ov=document.createElement('div');
    ov.id='nucleoRoExtensionOverlay';
    ov.style.cssText='position:fixed;inset:0;z-index:10080;background:rgba(15,23,42,.5);display:flex;align-items:center;justify-content:center;padding:20px';
    ov.innerHTML=`
      <div style="width:min(720px,96vw);max-height:92vh;overflow:auto;background:white;border-radius:18px;padding:22px;box-shadow:0 24px 70px rgba(0,0,0,.24)">
        <div style="display:flex;justify-content:space-between;gap:14px;align-items:flex-start">
          <div>
            <h3 style="margin:0">Estender R.O.</h3>
            <p class="small" style="margin:6px 0 0"><b>${esc(roNumber)}</b>${sourceSector?' · origem da extensão: '+esc(sourceSector):''}</p>
          </div>
          <button class="btn secondary" type="button" onclick="nucleoCloseRoExtension()">Fechar</button>
        </div>

        <div class="card" style="padding:14px;margin-top:16px;background:#f8fafc">
          <b>Como funciona</b>
          <div class="small" style="margin-top:5px">Será criada uma nova atribuição independente para cada setor selecionado. A R.O. original, PDCAs já recebidos e histórico anterior não serão alterados.</div>
        </div>

        <div style="margin-top:16px">
          <div class="label">Novos setores responsáveis *</div>
          <div id="nucleoRoExtensionSectors" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:8px;margin-top:8px">
            ${available.map(s=>`
              <label style="display:flex;gap:8px;align-items:center;border:1px solid #dfe7ef;border-radius:10px;padding:10px;background:#fff;cursor:pointer">
                <input type="checkbox" value="${esc(s)}" data-ro-extension-sector>
                <span>${esc(s)}</span>
              </label>`).join('')}
          </div>
        </div>

        <label style="display:block;margin-top:16px">
          <span>Motivo da extensão *</span>
          <textarea id="nucleoRoExtensionReason" rows="4" maxlength="700" placeholder="Ex.: após análise do PDCA foi identificada necessidade de tratativa também pelo setor..."></textarea>
        </label>

        <label style="display:block;margin-top:12px;max-width:260px">
          <span>Prazo para os novos setores</span>
          <input id="nucleoRoExtensionDeadline" type="date" value="${typeof nextTuesdayIsoDate==='function'?nextTuesdayIsoDate():''}">
        </label>

        <p id="nucleoRoExtensionStatus" class="small" role="status" style="margin-top:10px"></p>

        <div class="actions" style="display:flex;justify-content:flex-end;gap:8px;margin-top:18px">
          <button class="btn secondary" type="button" onclick="nucleoCloseRoExtension()">Cancelar</button>
          <button class="btn primary" id="nucleoRoExtensionConfirm" type="button" onclick="nucleoConfirmRoExtension(this)">Criar novas atribuições</button>
        </div>
      </div>`;
    ov.addEventListener('click',e=>{if(e.target===ov)nucleoCloseRoExtension()});
    document.body.appendChild(ov);
  };

  function cleanInheritedPdca(record){
    [
      'pdcaExternal','pdcaSource','pdcaFileId','pdcaExternalUpdatedAt','pdcaResponded',
      'pdcaSent','pdcaPresented','pdcaReviewDecision','pdcaReviewAt','pdcaReviewBy',
      'apresentadoEm','presentedAt','deliveredAt','deliveryAt','pdcaId','fileId'
    ].forEach(k=>delete record[k]);
    return record;
  }

  window.nucleoConfirmRoExtension=async function(button){
    const status=document.getElementById('nucleoRoExtensionStatus');
    if(!ctx||!status)return;

    const sectors=[...document.querySelectorAll('[data-ro-extension-sector]:checked')]
      .map(x=>String(x.value||'').trim()).filter(Boolean);
    const reason=String(document.getElementById('nucleoRoExtensionReason')?.value||'').trim();
    const deadline=String(document.getElementById('nucleoRoExtensionDeadline')?.value||'').trim()||
      (typeof nextTuesdayIsoDate==='function'?nextTuesdayIsoDate():'');

    if(!sectors.length){status.textContent='Selecione pelo menos um novo setor.';return}
    if(!reason){status.textContent='Informe o motivo da extensão.';document.getElementById('nucleoRoExtensionReason')?.focus();return}

    button.disabled=true;
    status.textContent='Criando '+sectors.length+' nova'+(sectors.length===1?' atribuição…':'s atribuições…');

    try{
      const map=getSavedTriageMap();
      const sourceRecords=getTriageRecordsForRoNumber(ctx.roNumber,map);
      let source=ctx.sourceTriageKey?map.get(ctx.sourceTriageKey):null;
      if(!source&&ctx.sourceSector){
        source=sourceRecords.find(t=>normalizeAnswer(t?.responsibleSector||t?.setorDirecionado||'')===normalizeAnswer(ctx.sourceSector));
      }
      if(!source)source=sourceRecords.slice().sort((a,b)=>String(b?.updatedAt||b?.triagedAt||'').localeCompare(String(a?.updatedAt||a?.triagedAt||'')))[0]||{};

      const now=new Date().toISOString();
      const actor=getSession()?.name||'SGQ';
      let created=0, skipped=[];

      for(const sector of sectors){
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
          extendedAt:now,
          extendedBy:actor,
          note:'Extensão da R.O.: '+reason
        });

        if(typeof nucleoRemovalSaveVerified!=='function'){
          throw new Error('A rotina de gravação central não está disponível nesta versão.');
        }
        await nucleoRemovalSaveVerified('triage',key,record,null,90000);
        map.set(key,record);
        created++;

        try{
          createNotification({
            type:'ro',
            audience:'sector',
            sector,
            ro:ctx.roNumber,
            unidade:ctx.ro?.unidade||'',
            tipoRO:ctx.ro?.tipoRO||ctx.ro?.tipo||'',
            cliente:ctx.ro?.cliente||'',
            title:'R.O. estendida para seu setor',
            message:'A '+ctx.roNumber+' foi estendida para '+sector+'. Motivo: '+reason
          });
          if(typeof notifyManagersOfDirectedRo==='function'){
            notifyManagersOfDirectedRo(ctx.roNumber,sector,ctx.ro,'');
          }
        }catch(e){
          console.warn('[NÚCLEO EXTENDER R.O.] notificação não enviada',e);
        }
      }

      localStorage.setItem(TRIAGE_KEY,JSON.stringify([...map.values()]));

      // Se esta R.O. estava marcada como "Não tem PDCA", a extensão cria uma
      // necessidade real de PDCA e a definição passa a "Tem PDCA".
      try{
        const origin=String(ctx.ro?.origemBase||ctx.ro?.raw?.__origemBase||'');
        const canonical=nucleoPdcaReviewCanonical2026(ctx.roNumber,origin);
        const review=nucleoPdcaReviewMap2026();
        if(review?.[canonical]?.decision==='no'){
          review[canonical]={decision:'yes',automatic:false,at:now,by:actor,ro:ctx.roNumber,origin,reason:'R.O. estendida para novo setor'};
          nucleoSavePdcaReviewMap2026(review);
        }
      }catch(e){}

      try{render()}catch(e){}
      try{renderSentPdcas()}catch(e){}
      try{renderTriage()}catch(e){}
      try{refreshRoSummary()}catch(e){}
      try{refreshMenuNotificationBadges()}catch(e){}
      try{
        Promise.resolve(syncPortalBackend(false,{foreground:false})).catch(()=>{});
      }catch(e){}

      status.textContent=created
        ? created+' nova'+(created===1?' atribuição criada':'s atribuições criadas')+(skipped.length?' · '+skipped.length+' já existia(m).':'')+'.'
        : 'Nenhuma nova atribuição foi criada. Os setores selecionados já estavam vinculados.';

      if(created)setTimeout(nucleoCloseRoExtension,900);
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
