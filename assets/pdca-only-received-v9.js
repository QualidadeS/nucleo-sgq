(function(){
  'use strict';

  function normalize(v){
    try{
      return String(v==null?'':v)
        .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
        .trim().toLowerCase();
    }catch(e){
      return String(v==null?'':v).trim().toLowerCase();
    }
  }

  function roNumberOf(ro){
    return String(ro?.numero || ro?.id || ro?.codigo || ro?.ro || ro?.roId || ro?.numeroRo || '').trim();
  }

  function triageSectorOf(tri){
    return String(tri?.responsibleSector || tri?.setorDirecionado || tri?.setor || '').trim();
  }

  function rowSectorOfRo(ro){
    return String(
      ro?.__assignedSector ||
      ro?.__triageRecord?.responsibleSector ||
      ro?.__triageRecord?.setorDirecionado ||
      ro?.setorResponsavelPlanilha ||
      ro?.raw?.__setorResponsavel ||
      ro?.setorResponsavel ||
      ro?.setor ||
      ''
    ).trim();
  }

  function getSavedMapSafe(){
    try{
      return typeof window.getSavedTriageMap === 'function'
        ? window.getSavedTriageMap()
        : new Map();
    }catch(e){
      return new Map();
    }
  }

  function sameSector(a,b){
    if(typeof window.sameCanonicalSector === 'function'){
      try{return window.sameCanonicalSector(a,b);}catch(e){}
    }
    return normalize(a) === normalize(b);
  }

  function anyReceivedPdcaForRoSector(roNumber, sector){
    const roKey = String(roNumber||'').trim();
    if(!roKey) return false;

    // 1) PDCA realmente salvo/recebido.
    try{
      const list = typeof window.getAllSentPdcas === 'function'
        ? window.getAllSentPdcas()
        : [];
      const found = list.some(p=>{
        const sameRo = String(p?.ro || p?.roId || p?.numeroRo || '').trim() === roKey;
        if(!sameRo) return false;
        const pSector = String(p?.setor || '').trim();
        return !sector || !pSector || sameSector(pSector, sector);
      });
      if(found) return true;
    }catch(e){}

    // 2) Marcação manual "Tem PDCA" salva na triagem do Núcleo.
    try{
      const map = getSavedMapSafe();
      for(const tri of map.values()){
        const triRo = String(tri?.roNumber || String(tri?.roKey || '').split('::')[0] || '').trim();
        if(triRo !== roKey) continue;

        const triSector = triageSectorOf(tri);
        if(sector && triSector && !sameSector(triSector, sector)) continue;

        if(
          tri?.pdcaExternal === true ||
          normalize(tri?.pdcaSource) === 'external' ||
          normalize(tri?.pdcaSituation) === 'tem pdca'
        ){
          return true;
        }
      }
    }catch(e){}

    // 3) Mecanismo visual/legado 2026.
    try{
      if(typeof window.nucleoPdcaReviewHasEvidence2026 === 'function'){
        const dummy = {numero:roKey,setor,origemBase:'Interna'};
        if(window.nucleoPdcaReviewHasEvidence2026(dummy)) return true;
      }
    }catch(e){}

    return false;
  }

  function shouldBeOnlyInReceived(ro){
    if(!ro) return false;
    const roNumber = roNumberOf(ro);
    const sector = rowSectorOfRo(ro);

    try{
      if(typeof window.__originalRoHasPdcaVisualEvidenceV9 === 'function' &&
         window.__originalRoHasPdcaVisualEvidenceV9(ro)){
        return true;
      }
    }catch(e){}

    return anyReceivedPdcaForRoSector(roNumber, sector);
  }

  // Strengthen shared PDCA detector so original screens inherit the rule.
  if(typeof window.roHasPdcaVisualEvidence === 'function' && !window.__originalRoHasPdcaVisualEvidenceV9){
    window.__originalRoHasPdcaVisualEvidenceV9 = window.roHasPdcaVisualEvidence;
    window.roHasPdcaVisualEvidence = function(ro){
      try{
        if(window.__originalRoHasPdcaVisualEvidenceV9(ro)) return true;
      }catch(e){}
      return shouldBeOnlyInReceived(ro);
    };
  }

  function hideAssignedPdcaRowsInDom(){
    const rowsHost = document.getElementById('rows');
    if(!rowsHost) return;

    const rows = [...rowsHost.querySelectorAll('tr')];
    let visible = 0;

    rows.forEach(tr=>{
      const tds = tr.querySelectorAll('td');
      if(!tds || tds.length < 3){
        if(tr.style.display !== 'none') visible += 1;
        return;
      }

      const roNumber = (tds[0]?.innerText || '').split('\n')[0].trim();
      const sector = (tds[2]?.innerText || '').split('\n')[0].trim();

      if(!roNumber){
        if(tr.style.display !== 'none') visible += 1;
        return;
      }

      if(anyReceivedPdcaForRoSector(roNumber, sector)){
        tr.style.display = 'none';
        tr.dataset.pdcaMovedToReceived = '1';
      }else{
        tr.style.display = '';
        delete tr.dataset.pdcaMovedToReceived;
        visible += 1;
      }
    });

    const more = document.getElementById('roListMore');
    if(more){
      more.textContent = visible ? ('Mostrando ' + visible + ' R.O.s') : '';
    }
  }

  function rerenderViewsIfNeeded(){
    try{
      if(typeof window.render === 'function') window.render();
    }catch(e){}
    try{
      if(typeof window.renderSentPdcas === 'function') window.renderSentPdcas();
    }catch(e){}
  }

  if(typeof window.render === 'function' && !window.__originalRenderPdcaOnlyV9){
    window.__originalRenderPdcaOnlyV9 = window.render;
    window.render = function(){
      const result = window.__originalRenderPdcaOnlyV9.apply(this, arguments);

      try{
        const assignedViewOpen =
          !document.getElementById('roListView')?.classList.contains('hidden') &&
          (
            document.getElementById('navAssignedRos')?.classList.contains('active') ||
            normalize(window.roListMode) === 'assigned'
          );

        if(assignedViewOpen){
          hideAssignedPdcaRowsInDom();
        }
      }catch(e){
        console.warn('Núcleo: falha ao ocultar linhas com PDCA em R.O.s atribuídas.', e);
      }

      return result;
    };
  }

  if(typeof window.setExternalPdca === 'function' && !window.__wrappedSetExternalPdcaOnlyV9){
    const originalSetExternalPdca = window.setExternalPdca;
    window.__wrappedSetExternalPdcaOnlyV9 = true;
    window.setExternalPdca = async function(){
      const res = await originalSetExternalPdca.apply(this, arguments);
      setTimeout(rerenderViewsIfNeeded, 50);
      return res;
    };
  }

  if(typeof window.showAssignedRos === 'function' && !window.__wrappedShowAssignedRosOnlyV9){
    const originalShowAssignedRos = window.showAssignedRos;
    window.__wrappedShowAssignedRosOnlyV9 = true;
    window.showAssignedRos = function(){
      const res = originalShowAssignedRos.apply(this, arguments);
      setTimeout(hideAssignedPdcaRowsInDom, 0);
      return res;
    };
  }

  if(typeof window.showSentPdcas === 'function' && !window.__wrappedShowSentPdcasOnlyV9){
    const originalShowSentPdcas = window.showSentPdcas;
    window.__wrappedShowSentPdcasOnlyV9 = true;
    window.showSentPdcas = function(){
      const res = originalShowSentPdcas.apply(this, arguments);
      // O render original já auto-completa a lista a partir de roHasPdcaVisualEvidence.
      // Como reforçamos essa função, basta pedir um segundo render.
      setTimeout(function(){
        try{ window.renderSentPdcas(); }catch(e){}
      }, 0);
      return res;
    };
  }

  // Aplica na carga inicial e em re-renderizações tardias.
  let tries = 0;
  const timer = setInterval(function(){
    tries += 1;
    try{
      hideAssignedPdcaRowsInDom();
    }catch(e){}
    if(tries > 50) clearInterval(timer);
  }, 200);
})();