(function(){
  'use strict';

  function roBaseFromTriage(t, fallbackKey){
    return String(
      t?.roNumber ||
      String(t?.roKey || fallbackKey || '').split('::')[0] ||
      ''
    ).trim();
  }

  function manualTriagesFromMap(base, map){
    if(!(map instanceof Map) || !base) return [];
    return [...map.values()]
      .filter(t =>
        roBaseFromTriage(t) === base &&
        !!String(t?.decision || '').trim() &&
        t?.importedFromSheet !== true
      )
      .sort((a,b) =>
        String(b?.triagedAt || b?.updatedAt || b?.createdAt || '')
          .localeCompare(String(a?.triagedAt || a?.updatedAt || a?.createdAt || ''))
      );
  }

  const originalGetSavedTriageMap = window.getSavedTriageMap;
  const originalResolvedTriageForRo = window.resolvedTriageForRo;
  const originalGetTriageRecords = window.getTriageRecords;
  const originalGetRealSavedTriageMap = window.getRealSavedTriageMap;

  if(typeof originalGetSavedTriageMap === 'function'){
    window.getSavedTriageMap = function(){
      const map = originalGetSavedTriageMap.apply(this, arguments);
      if(!(map instanceof Map)) return map;

      const manualBases = new Set(
        [...map.values()]
          .filter(t => t?.decision && t?.importedFromSheet !== true)
          .map(t => roBaseFromTriage(t))
          .filter(Boolean)
      );

      [...map.entries()].forEach(([key,t])=>{
        const base = roBaseFromTriage(t, key);
        if(t?.importedFromSheet === true && manualBases.has(base)){
          map.delete(key);
        }
      });

      return map;
    };
  }

  if(typeof originalGetRealSavedTriageMap === 'function'){
    window.getRealSavedTriageMap = function(){
      let map = originalGetRealSavedTriageMap.apply(this, arguments);
      if(!(map instanceof Map)) return map;

      let all = null;
      try{
        all = typeof window.getSavedTriageMap === 'function'
          ? window.getSavedTriageMap()
          : null;
      }catch(e){}

      if(all instanceof Map){
        const manualBases = new Set(
          [...all.values()]
            .filter(t => t?.decision && t?.importedFromSheet !== true)
            .map(t => roBaseFromTriage(t))
            .filter(Boolean)
        );

        map = new Map(
          [...map.entries()].filter(([key,t])=>{
            const base = roBaseFromTriage(t,key);
            return !(t?.importedFromSheet === true && manualBases.has(base));
          })
        );
      }

      return map;
    };
  }

  if(typeof originalResolvedTriageForRo === 'function'){
    window.resolvedTriageForRo = function(ro, map){
      if(!ro) return null;

      const base = String(
        (typeof window.triageBaseRoNumber === 'function'
          ? window.triageBaseRoNumber(ro)
          : (ro?.numero || ro?.id || ro?.codigo || ''))
      ).trim();

      const sourceMap = map instanceof Map
        ? map
        : (typeof window.getSavedTriageMap === 'function'
            ? window.getSavedTriageMap()
            : new Map());

      const manual = manualTriagesFromMap(base, sourceMap);
      if(manual.length) return manual[0];

      // Só sem triagem manual o sistema consulta o fallback legado da planilha.
      return originalResolvedTriageForRo.call(this, ro, sourceMap);
    };
  }

  if(typeof originalGetTriageRecords === 'function'){
    window.getTriageRecords = function(){
      const allRos = typeof window.getAllRoRecords === 'function'
        ? window.getAllRoRecords()
        : [];

      const map = typeof window.getSavedTriageMap === 'function'
        ? window.getSavedTriageMap()
        : new Map();

      return allRos.map(ro=>{
        const tri = typeof window.resolvedTriageForRo === 'function'
          ? (window.resolvedTriageForRo(ro,map) || {})
          : {};

        const decision = String(tri?.decision || '').trim();

        let triagemStatus='new';
        if(decision==='directed')triagemStatus='directed';
        if(decision==='record')triagemStatus='record';
        if(decision==='cancelled')triagemStatus='cancelled';
        if(decision==='obsolete')triagemStatus='obsolete';

        return {
          ...ro,
          triagem:tri,
          classificacaoSGQ:tri.classification||'',
          setorDirecionado:tri.responsibleSector||'',
          pdcaObrigatorio:decision==='directed'&&tri.pdcaRequired!==false,
          prazoPdca:tri.pdcaDeadline||'',
          triagemStatus
        };
      });
    };
  }

  // Atualiza a tela caso o app já tenha renderizado antes desta camada carregar.
  setTimeout(function(){
    try{
      if(typeof window.renderTriage === 'function' &&
         !document.getElementById('triageView')?.classList.contains('hidden')){
        window.renderTriage();
      }
      if(typeof window.render === 'function' &&
         !document.getElementById('roListView')?.classList.contains('hidden')){
        window.render();
      }
    }catch(e){
      console.warn('Núcleo: falha ao reaplicar prioridade da triagem.', e);
    }
  },0);
})();