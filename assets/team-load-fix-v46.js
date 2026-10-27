(function(){
  if(window.__nucleoTeamLoadFixV46)return;
  window.__nucleoTeamLoadFixV46=true;

  async function waitCentralReady(){
    try{
      if(typeof window.nucleoCentralDataConfirmed==='function' && window.nucleoCentralDataConfirmed()){
        return true;
      }

      if(typeof window.syncPortalBackend==='function'){
        const ok=await window.syncPortalBackend(false,{foreground:false});
        if(ok)return true;
      }

      const started=Date.now();
      while(Date.now()-started<30000){
        if(typeof window.nucleoCentralDataConfirmed==='function' && window.nucleoCentralDataConfirmed()){
          return true;
        }
        await new Promise(resolve=>setTimeout(resolve,300));
      }
    }catch(e){
      console.warn('[MINHA EQUIPE] Falha ao aguardar base central:',e);
    }
    return typeof window.nucleoCentralDataConfirmed==='function'
      ? !!window.nucleoCentralDataConfirmed()
      : true;
  }

  window.nucleoEnsureInlineTeam=async function(){
    const page=document.getElementById('listView');
    if(!page)return;

    let box=document.getElementById('overviewTeam');
    if(!box){
      box=document.createElement('section');
      box.id='overviewTeam';
      box.className='overview-panel';
      box.style.marginTop='16px';
      box.innerHTML=
        '<h3 style="margin:0 0 10px">Minha equipe</h3>'+
        '<div id="overviewTeamFilters" class="actions" style="align-items:center"></div>'+
        '<div id="overviewTeamPeople" role="status">Carregando equipe…</div>';
      page.appendChild(box);
    }

    const host=document.getElementById('overviewTeamPeople');
    if(!host)return;

    const session=typeof getSession==='function' ? (getSession()||{}) : {};
    const key=JSON.stringify([session.email,session.personId,session.name,session.authToken]);

    if(
      key===window.nucleoInlineTeamKey &&
      (window.nucleoInlineTeamPromise || Date.now()-(window.nucleoInlineTeamAt||0)<60000)
    ) return;

    window.nucleoInlineTeamKey=key;
    window.nucleoInlineTeamAt=0;
    host.textContent='Confirmando base central e carregando equipe…';

    const promise=(async()=>{
      const ready=await waitCentralReady();
      if(!ready){
        throw new Error('A base central ainda não terminou de sincronizar.');
      }

      const result=await portalJsonp({acao:'portal_my_team'},60000);
      if(!result?.sucesso){
        throw new Error(result?.erro||'A base central não confirmou a consulta da equipe.');
      }
      return result;
    })();

    window.nucleoInlineTeamPromise=promise;

    try{
      const result=await promise;
      if(key!==window.nucleoInlineTeamKey)return;

      window.nucleoInlineTeamData=Array.isArray(result.teams)?result.teams:[];
      window.nucleoInlineTeamAt=Date.now();

      const filters=document.getElementById('overviewTeamFilters');
      if(filters){
        const sectors=[...new Set(window.nucleoInlineTeamData.map(t=>t.sector).filter(Boolean))];
        const units=[...new Set(window.nucleoInlineTeamData.map(t=>t.unit).filter(Boolean))];

        filters.innerHTML=
          '<label>Setor <select id="overviewTeamSector" onchange="nucleoRenderInlineTeam(false)">'+
          '<option value="all">Todos os meus setores</option>'+
          sectors.map(t=>'<option value="'+escapeHtml(t)+'">'+escapeHtml(t)+'</option>').join('')+
          '</select></label>'+
          '<label>Unidade <select id="overviewTeamUnit" onchange="nucleoRenderInlineTeam(false)">'+
          '<option value="all">Todas as minhas unidades</option>'+
          units.map(t=>'<option value="'+escapeHtml(t)+'">'+(t==='filial'?'Filial — Linhares':'Matriz')+'</option>').join('')+
          '</select></label>';
      }

      if(typeof window.nucleoRenderInlineTeam==='function'){
        window.nucleoRenderInlineTeam(false);
      }
    }catch(e){
      console.error('[MINHA EQUIPE] Falha ao carregar:',e);
      if(key!==window.nucleoInlineTeamKey)return;

      const msg=String(e&&e.message||e||'Erro desconhecido');
      host.innerHTML=
        '<div style="color:#a12f2f">'+
          '<b>Não foi possível carregar a equipe.</b>'+
          '<div class="small" style="margin-top:6px;white-space:pre-wrap">'+escapeHtml(msg)+'</div>'+
          '<button class="btn secondary" type="button" style="margin-top:10px" id="nucleoRetryTeamBtn">Atualizar</button>'+
        '</div>';

      const btn=document.getElementById('nucleoRetryTeamBtn');
      if(btn)btn.onclick=function(){
        window.nucleoInlineTeamAt=0;
        window.nucleoInlineTeamKey='';
        window.nucleoEnsureInlineTeam();
      };
    }finally{
      if(window.nucleoInlineTeamPromise===promise){
        window.nucleoInlineTeamPromise=null;
      }
    }
  };
})();