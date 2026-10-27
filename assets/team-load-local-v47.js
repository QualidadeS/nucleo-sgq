(function(){
  if(window.__nucleoTeamLocalV47)return;
  window.__nucleoTeamLocalV47=true;

  function norm(v){
    return String(v||'')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g,'')
      .replace(/\s+/g,' ');
  }

  function unit(v){
    const n=norm(v);
    if(n.includes('linhares')||n.includes('seta es')||n==='filial')return 'filial';
    return 'matriz';
  }

  function arr(v){
    if(Array.isArray(v))return v;
    if(v===undefined||v===null||v==='')return [];
    if(typeof v==='object')return [v];
    const s=String(v).trim();
    if(!s)return [];
    try{
      const parsed=JSON.parse(s);
      if(Array.isArray(parsed))return parsed;
      if(parsed&&typeof parsed==='object')return [parsed];
    }catch(_){}
    return s.split(/[|,;\n]+/).map(x=>x.trim()).filter(Boolean);
  }

  function memberships(u){
    const out=[];
    arr(u?.sectorMemberships).forEach(m=>{
      if(typeof m==='string')out.push({unit:unit(u?.unit),sector:m.trim()});
      else if(m&&typeof m==='object')out.push({unit:unit(m.unit||u?.unit),sector:String(m.sector||m.name||'').trim()});
    });
    if(String(u?.sector||'').trim())out.push({unit:unit(u?.unit),sector:String(u.sector).trim()});
    const seen=new Set();
    return out.filter(m=>{
      const k=m.unit+'::'+norm(m.sector);
      if(!m.sector||seen.has(k))return false;
      seen.add(k);return true;
    });
  }

  function managed(u){
    return arr(u?.managedSectors).map(m=>{
      if(typeof m==='string')return {unit:unit(u?.unit),sector:m.trim()};
      m=m||{};
      return {unit:unit(m.unit||u?.unit),sector:String(m.sector||m.name||'').trim()};
    }).filter(m=>m.sector);
  }

  function active(u){
    if(!u)return false;
    const approval=norm(u.approvalStatus||'approved');
    const a=norm(u.active===false?'nao':(u.active||'sim'));
    const st=norm(u.status||'');
    return (approval==='approved'||approval==='aprovado'||approval==='') &&
      !['nao','false','inativo'].includes(a) &&
      !['inactive','inativo'].includes(st);
  }

  function usersFromCentralCache(){
    try{
      if(typeof window.getOperationalUsers==='function'){
        const x=window.getOperationalUsers();
        if(Array.isArray(x)&&x.length)return x;
      }
    }catch(_){}
    try{
      const x=JSON.parse(localStorage.getItem('ro-pdca-users-v4')||'[]');
      return Array.isArray(x)?x:[];
    }catch(_){return [];}
  }

  function buildTeams(){
    const users=usersFromCentralCache();
    const me=typeof getSession==='function'?(getSession()||{}):{};

    let owner=users.find(u=>
      (me.personId&&String(u.personId||'')===String(me.personId))||
      (me.email&&String(u.email||'').toLowerCase()===String(me.email).toLowerCase())||
      (me.name&&norm(u.name)===norm(me.name))
    )||me;

    let scopes=managed(owner);
    if(!scopes.length)scopes=memberships(owner);

    if(!scopes.length && ['admin','quality'].includes(norm(owner.role))){
      users.forEach(u=>memberships(u).forEach(m=>scopes.push(m)));
    }

    const seen=new Set();
    scopes=scopes.filter(s=>{
      const k=s.unit+'::'+norm(s.sector);
      if(!s.sector||seen.has(k))return false;
      seen.add(k);return true;
    });

    return scopes.map(scope=>{
      const people=[];
      users.forEach(u=>{
        if(!active(u))return;
        const belongs=memberships(u).some(m=>m.unit===scope.unit&&norm(m.sector)===norm(scope.sector));
        if(!belongs)return;

        const manager=managed(u).some(m=>m.unit===scope.unit&&norm(m.sector)===norm(scope.sector));
        const self=
          (owner.personId&&String(u.personId||'')===String(owner.personId))||
          (owner.email&&String(u.email||'').toLowerCase()===String(owner.email||'').toLowerCase())||
          norm(u.name)===norm(owner.name);

        people.push({
          personKey:String(u.personId||u.storageId||u.email||u.name||''),
          name:String(u.name||u.email||'Pessoa'),
          description:String(u.description||''),
          jobTitle:String(u.jobTitle||''),
          workDescription:String(u.workDescription||''),
          avatar:String(u.avatar||''),
          functionLabel:String(u.role||''),
          manager:!!manager,
          self:!!self
        });
      });

      people.sort((a,b)=>Number(b.manager)-Number(a.manager)||String(a.name).localeCompare(String(b.name),'pt-BR'));
      return {unit:scope.unit,sector:scope.sector,people};
    });
  }

  function renderLocalTeam(){
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
        '<div id="overviewTeamPeople" role="status"></div>';
      page.appendChild(box);
    }

    const teams=buildTeams();
    window.nucleoInlineTeamData=teams;

    const filters=document.getElementById('overviewTeamFilters');
    const host=document.getElementById('overviewTeamPeople');
    if(!filters||!host)return;

    const sectors=[...new Set(teams.map(t=>t.sector).filter(Boolean))];
    const units=[...new Set(teams.map(t=>t.unit).filter(Boolean))];

    filters.innerHTML=
      '<label>Setor <select id="overviewTeamSector"><option value="all">Todos os meus setores</option>'+
      sectors.map(s=>'<option value="'+escapeHtml(s)+'">'+escapeHtml(s)+'</option>').join('')+
      '</select></label>'+
      '<label>Unidade <select id="overviewTeamUnit"><option value="all">Todas as minhas unidades</option>'+
      units.map(u=>'<option value="'+escapeHtml(u)+'">'+(u==='filial'?'Filial — Linhares':'Matriz')+'</option>').join('')+
      '</select></label>';

    function draw(){
      const sector=document.getElementById('overviewTeamSector')?.value||'all';
      const un=document.getElementById('overviewTeamUnit')?.value||'all';
      const selected=teams.filter(t=>(sector==='all'||t.sector===sector)&&(un==='all'||t.unit===un));

      const people=new Map();
      selected.forEach(t=>(t.people||[]).forEach(p=>{
        const key=p.personKey||JSON.stringify([p.name,p.description||'']);
        if(!people.has(key))people.set(key,{...p,teamMemberships:[]});
        const person=people.get(key);
        person.manager=person.manager||p.manager;
        person.self=person.self||p.self;
        if(!person.teamMemberships.some(m=>m.sector===t.sector&&m.unit===t.unit)){
          person.teamMemberships.push({sector:t.sector,unit:t.unit});
        }
      }));

      const list=[...people.values()];
      host.innerHTML=list.length
        ? '<div class="inline-team-grid">'+list.map(p=>{
            const parts=typeof splitPersonNameDescription==='function'
              ? splitPersonNameDescription(p.name,p.description||undefined)
              : {name:p.name,description:p.description||''};
            return '<div class="inline-team-person" style="background:'+(p.manager?'#eef4ff':'#f6f8fa')+'">'+
              (typeof nucleoAvatarHtml==='function'?nucleoAvatarHtml(p.avatar):'')+
              '<div><strong>'+escapeHtml(parts.name||p.name)+'</strong>'+
              (p.self?' <span class="small">(você)</span>':'')+
              '<div class="small">'+(p.manager?'Gestor':escapeHtml(p.jobTitle||p.functionLabel||'Integrante'))+'</div>'+
              '<div class="small">'+escapeHtml(p.teamMemberships.map(m=>m.sector+' · '+(m.unit==='filial'?'Filial':'Matriz')).join(' / '))+'</div>'+
              (p.workDescription?'<div class="small">'+escapeHtml(p.workDescription)+'</div>':'')+
              (parts.description?'<div class="small">'+escapeHtml(parts.description)+'</div>':'')+
              '</div></div>';
          }).join('')+'</div>'
        : '<p class="small">Nenhuma pessoa encontrada nos seus setores.</p>';

      const grid=host.querySelector('.inline-team-grid');
      if(grid){
        const width=host.clientWidth||window.innerWidth;
        const columns=width<520?1:width<850?2:4;
        grid.style.gridTemplateColumns='repeat('+columns+',minmax(0,1fr))';
      }
    }

    document.getElementById('overviewTeamSector').onchange=draw;
    document.getElementById('overviewTeamUnit').onchange=draw;
    draw();
  }

  window.nucleoEnsureInlineTeam=function(){
    try{
      const confirmed=typeof nucleoCentralDataConfirmed==='function'
        ? nucleoCentralDataConfirmed()
        : true;

      if(!confirmed && typeof syncPortalBackend==='function'){
        const host=document.getElementById('overviewTeamPeople');
        if(host)host.textContent='Confirmando base central e carregando equipe…';
        Promise.resolve(syncPortalBackend(false,{foreground:false}))
          .finally(()=>setTimeout(renderLocalTeam,0));
        return;
      }

      renderLocalTeam();
    }catch(e){
      console.error('[MINHA EQUIPE V47]',e);
      const host=document.getElementById('overviewTeamPeople');
      if(host){
        host.innerHTML='<div style="color:#a12f2f"><b>Não foi possível montar a equipe.</b><div class="small">'+escapeHtml(String(e&&e.message||e))+'</div></div>';
      }
    }
  };
})();