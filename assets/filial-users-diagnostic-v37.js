/* NÚCLEO | Diagnóstico visível usuários Filial V37
   Não altera dados. Mede:
   1) portal_load real do /exec publicado
   2) USERS_KEY/localStorage
   3) getOperationalUsers()
   4) linhas renderizadas na tela
*/
(function(){
  'use strict';
  if(window.__nucleoFilialUsersDiagV37)return;
  window.__nucleoFilialUsersDiagV37=true;

  const AMANDA_EMAIL='amanda.marafigo@setaembalagens.com.br';

  function norm(v){ return String(v||'').trim().toLowerCase(); }
  function findAmanda(list){
    return (Array.isArray(list)?list:[]).find(u=>norm(u?.email)===AMANDA_EMAIL)||null;
  }
  function unit(u){ return String(u?.unit||u?.unidade||''); }
  function compact(u){
    if(!u)return null;
    return {
      name:u.name||'',
      email:u.email||'',
      unit:unit(u),
      sector:u.sector||u.setor||'',
      role:u.role||'',
      sgq:(()=>{try{return typeof nucleoPersonPermissions==='function'?!!nucleoPersonPermissions(u).sgq:null}catch(_){return null}})(),
      replica:!!u.__unitReplica,
      replicaUnit:u.__replicaUnit||'',
      replicaKey:u.__replicaKey||''
    };
  }
  function usersKey(){
    try{ if(typeof USERS_KEY!=='undefined' && USERS_KEY)return USERS_KEY; }catch(_){}
    return 'ro-pdca-users-v4';
  }
  function readLocal(){
    try{
      const x=JSON.parse(localStorage.getItem(usersKey())||'[]');
      return Array.isArray(x)?x:[];
    }catch(_){ return []; }
  }
  function visibleRows(){
    const box=document.getElementById('operationalUsersList');
    return box ? box.querySelectorAll('.admin-user-row').length : 0;
  }
  function ensureBox(){
    const list=document.getElementById('operationalUsersList');
    if(!list)return null;
    let box=document.getElementById('nucleoFilialUsersDiagV37');
    if(box)return box;
    box=document.createElement('div');
    box.id='nucleoFilialUsersDiagV37';
    box.style.cssText='margin:10px 0 14px;padding:12px;border:2px solid #c7d6e8;border-radius:10px;background:#f8fbff;font:12px/1.45 system-ui,sans-serif;white-space:normal';
    box.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between;gap:10px"><b>Diagnóstico usuários Filial V37</b><button type="button" id="nucleoFilialUsersDiagRun" style="padding:6px 10px">Executar diagnóstico</button></div><pre id="nucleoFilialUsersDiagOut" style="white-space:pre-wrap;margin:8px 0 0;max-height:420px;overflow:auto"></pre>';
    list.before(box);
    box.querySelector('#nucleoFilialUsersDiagRun').onclick=()=>run();
    return box;
  }
  function line(label,value){
    return label+': '+(typeof value==='string'?value:JSON.stringify(value,null,2));
  }
  async function run(){
    const box=ensureBox(); if(!box)return;
    const out=box.querySelector('#nucleoFilialUsersDiagOut');
    const btn=box.querySelector('#nucleoFilialUsersDiagRun');
    btn.disabled=true;
    out.textContent='Executando no navegador real...';

    const session=(()=>{try{return typeof getSession==='function'?(getSession()||{}):{}}catch(_){return {}}})();
    const localBefore=readLocal();
    let operationalBefore=[];
    try{ operationalBefore=typeof getOperationalUsers==='function'?(getOperationalUsers()||[]):[]; }catch(e){ operationalBefore=[]; }

    let portal=null, portalError='';
    try{
      if(typeof portalJsonp!=='function')throw new Error('portalJsonp não disponível');
      portal=await portalJsonp({acao:'portal_load'},180000);
    }catch(e){
      portalError=e?.message||String(e);
    }

    const portalUsers=Array.isArray(portal?.dados?.users)?portal.dados.users:[];
    const portalContacts=Array.isArray(portal?.dados?.unitContacts)?portal.dados.unitContacts:[];

    const localAfter=readLocal();
    let operationalAfter=[];
    try{ operationalAfter=typeof getOperationalUsers==='function'?(getOperationalUsers()||[]):[]; }catch(e){ operationalAfter=[]; }

    const report=[
      line('Sessão', {name:session.name,email:session.email,role:session.role,unit:session.unit,sector:session.sector}),
      line('API usada', (()=>{try{return typeof portalApiBase==='function'?portalApiBase():'?'}catch(_){return '?'}})()),
      '',
      '=== /exec PUBLICADO ===',
      line('portal_load sucesso', portal?.sucesso ?? null),
      line('portal_load erro', portalError || portal?.erro || ''),
      line('dados.users', portalUsers.length),
      line('Amanda em dados.users', compact(findAmanda(portalUsers))),
      line('dados.unitContacts', portalContacts.length),
      line('Amanda em unitContacts', compact(findAmanda(portalContacts))),
      '',
      '=== LOCALSTORAGE ===',
      line('USERS_KEY', usersKey()),
      line('antes do diagnóstico', localBefore.length),
      line('Amanda antes', compact(findAmanda(localBefore))),
      line('depois do portal_load de leitura', localAfter.length),
      line('Amanda depois', compact(findAmanda(localAfter))),
      '',
      '=== FILTRO DO FRONT ===',
      line('getOperationalUsers antes', operationalBefore.length),
      line('Amanda getOperationalUsers antes', compact(findAmanda(operationalBefore))),
      line('getOperationalUsers depois', operationalAfter.length),
      line('Amanda getOperationalUsers depois', compact(findAmanda(operationalAfter))),
      line('linhas renderizadas agora', visibleRows()),
      '',
      'INTERPRETAÇÃO:',
      portalUsers.length===0
        ? 'O /exec publicado não devolveu usuários ou falhou.'
        : (!findAmanda(portalUsers)
            ? 'Amanda NÃO veio do /exec publicado. Problema na implantação/backend publicado.'
            : (!findAmanda(localBefore)
                ? 'Amanda veio do /exec, mas NÃO estava no USERS_KEY. Problema ao aplicar snapshot.'
                : (!findAmanda(operationalBefore)
                    ? 'Amanda está no USERS_KEY, mas getOperationalUsers() está descartando.'
                    : 'Amanda passa pelo getOperationalUsers(); o problema está na renderização/filtros visuais.')))
    ].join('\n');

    out.textContent=report;
    console.log('[NÚCLEO V37 DIAG]\n'+report);
    btn.disabled=false;
  }

  function mount(){
    const box=ensureBox();
    if(!box)return false;
    setTimeout(run,300);
    return true;
  }

  if(!mount()){
    let tries=0;
    const t=setInterval(()=>{ if(mount()||++tries>80)clearInterval(t); },250);
  }
})();
