(function(){
  'use strict';

  function effectiveSession(){
    try{return typeof window.getSession==='function' ? (window.getSession()||{}) : {}}
    catch(e){return {}}
  }

  function isRealSgqAdmin(){
    const s=effectiveSession();
    const role=String(s.role||'').toLowerCase();

    // Qualidade mantém o comportamento administrativo restrito da filial.
    if(role==='quality') return true;

    if(role!=='admin') return false;

    // Regra central:
    // admin com sgq:false NÃO é SGQ e deve respeitar setor/unidade/permissões.
    // Usuários SGQ legados sem campo explícito continuam válidos.
    if(s?.permissions?.sgq === false) return false;

    return true;
  }

  // Substitui a interpretação ampla de role:"admin".
  window.isAdmin = function(){
    return isRealSgqAdmin();
  };

  function currentUserSector(){
    const s=effectiveSession();
    return String(s.sector||'').trim();
  }

  function currentUserEmail(){
    const s=effectiveSession();
    return String(s.email||'').trim().toLowerCase();
  }

  function sameSectorSafe(a,b){
    if(typeof window.sameCanonicalSector==='function'){
      try{return window.sameCanonicalSector(a,b)}catch(e){}
    }
    if(typeof window.normalizeAnswer==='function'){
      try{return window.normalizeAnswer(a||'')===window.normalizeAnswer(b||'')}catch(e){}
    }
    return String(a||'').trim().toLowerCase()===String(b||'').trim().toLowerCase();
  }

  function unitAllowed(ro){
    const s=effectiveSession();
    const allowed=Array.isArray(s.accessUnits)?s.accessUnits:[];

    // Sem lista explícita, preserva a regra existente.
    if(!allowed.length){
      try{return typeof window.sameUnitAsCurrentUser==='function' ? window.sameUnitAsCurrentUser(ro) : true}
      catch(e){return true}
    }

    try{
      const ru=typeof window.roUnit==='function' ? window.roUnit(ro) : '';
      return allowed.some(u=>{
        const nu=typeof window.normalizePortalUnit==='function' ? window.normalizePortalUnit(u) : String(u||'');
        return nu===ru;
      });
    }catch(e){
      return true;
    }
  }

  function triageFor(ro){
    try{return typeof window.getRoTriageRecord==='function' ? window.getRoTriageRecord(ro) : null}
    catch(e){return null}
  }

  function directedToOwnSector(ro){
    const tri=triageFor(ro);
    if(!tri || String(tri.decision||'')!=='directed') return false;

    const own=currentUserSector();
    const directed=String(tri.responsibleSector||tri.setorDirecionado||'').trim();
    if(!own || !directed || !sameSectorSafe(own,directed)) return false;

    // Se foi direcionado a uma pessoa específica, só essa pessoa recebe.
    const email=String(tri.responsibleUserEmail||'').trim().toLowerCase();
    const name=String(tri.responsibleUserName||'').trim();
    if(email && email!==currentUserEmail()) return false;

    if(name){
      const s=effectiveSession();
      const sameName = typeof window.normalizeAnswer==='function'
        ? window.normalizeAnswer(name)===window.normalizeAnswer(s.name||'')
        : name.toLowerCase()===String(s.name||'').trim().toLowerCase();
      if(!sameName && !email) return false;
    }

    return true;
  }

  // Garante visibilidade operacional estrita para usuários não-SGQ.
  const originalCanViewRO = window.canViewRO;
  window.canViewRO = function(ro){
    if(isRealSgqAdmin()){
      return typeof originalCanViewRO==='function' ? originalCanViewRO.call(this,ro) : true;
    }

    if(!ro || !unitAllowed(ro)) return false;
    return directedToOwnSector(ro);
  };

  function isOperationalNonSgq(){
    const s=effectiveSession();
    return String(s.role||'').toLowerCase()==='admin' && s?.permissions?.sgq===false;
  }

  // Remove o escopo de gestor amplo desses usuários. Ter managedSectors legado
  // não transforma usuário operacional em gestor.
  if(typeof window.nucleoHasManagedScope==='function'){
    window.nucleoHasManagedScope = function(){
      if(isOperationalNonSgq()) return false;
      try{
        return (typeof window.isManager==='function' && window.isManager()) ||
          (typeof window.managedSectorsForCurrentUser==='function' &&
           window.managedSectorsForCurrentUser().length>0);
      }catch(e){return false}
    };
  }

  // Reforça a seleção da R.O. antes de Responder/Contestar.
  const originalSelect = window.selectRoForOperationalAction;
  if(typeof originalSelect==='function'){
    window.selectRoForOperationalAction = function(numero){
      const all = typeof window.getAllRoRecords==='function' ? window.getAllRoRecords() : [];
      const base = all.find(r=>
        String(r?.numero||r?.id||r?.codigo||'')===String(numero)
      );

      if(!base || !window.canViewRO(base)){
        alert('R.O. não encontrada ou fora do seu setor.');
        return null;
      }

      const ro = isRealSgqAdmin()
        ? base
        : (typeof window.getOperationalRoView==='function' ? window.getOperationalRoView(base) : base);

      window.selected=ro;
      return ro;
    };
  }

  // Segurança adicional: contestação só pode ser criada para R.O. visível ao usuário.
  const originalSubmitContest = window.submitContest;
  if(typeof originalSubmitContest==='function'){
    window.submitContest = function(){
      if(!isRealSgqAdmin()){
        const sel=window.selected;
        const num=String(sel?.numero||sel?.id||sel?.codigo||'').trim();
        const all=typeof window.getAllRoRecords==='function' ? window.getAllRoRecords() : [];
        const base=all.find(r=>String(r?.numero||r?.id||r?.codigo||'').trim()===num);
        if(!base || !window.canViewRO(base)){
          alert('Você só pode contestar R.O.s atribuídas ao seu setor.');
          return;
        }
      }
      return originalSubmitContest.apply(this,arguments);
    };
  }

  function hideAdminOnlyRowActions(){
    if(isRealSgqAdmin()) return;

    // Para usuário operacional, a própria renderização padrão não-admin
    // já entrega somente Responder PDCA + Contestar.
    // Este reforço remove ícones administrativos que possam ter sobrado no DOM.
    document.querySelectorAll('#rows .assigned-operational-icons').forEach(el=>{
      el.remove();
    });
  }

  const originalRender=window.render;
  if(typeof originalRender==='function'){
    window.render=function(){
      const result=originalRender.apply(this,arguments);
      try{hideAdminOnlyRowActions()}catch(e){}
      return result;
    };
  }

  function refreshCurrentView(){
    try{
      if(typeof window.nucleoManagerScopeControl==='function'){
        window.nucleoManagerScopeControl();
      }
    }catch(e){}

    try{
      const roList=document.getElementById('roListView');
      if(roList && !roList.classList.contains('hidden') && typeof window.render==='function'){
        window.render();
      }
    }catch(e){}
  }

  setTimeout(refreshCurrentView,0);
  setTimeout(refreshCurrentView,250);
})();