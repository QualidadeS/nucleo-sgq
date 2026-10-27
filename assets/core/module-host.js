/* NÚCLEO CORE: module-host | host compartilhado de módulos administrativos */

function adminModuleRecord(id){
  return getAdminModuleRecords().find(x=>String(x.id)===String(id))||null;
}

function adminModuleStatusLabel(v){
  return ({open:'Aberto',progress:'Em andamento',pending:'Pendente',done:'Concluído',
    elaboration:'Em elaboração',review:'Em revisão',approval:'Aguardando aprovação',published:'Vigente',
    doc_analysis:'Em análise',doc_preparation:'Em preparação',doc_ready:'Pronto para entrega',
    cancelled:'Cancelado',obsolete:'Obsoleto / substituído'})[v]||v||'—';
}

function adminModuleDate(v){
  const s=String(v||''); const m=s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m?`${m[3]}/${m[2]}/${m[1]}`:(s||'—');
}

function showAdminOperationalModule(...args){return nucleoOpenLazyAdmin('showAdminOperationalModule',args);}

function openAdminOperationalWorkspace(...args){return nucleoOpenLazyAdmin('openAdminOperationalWorkspace',args);}

function saveAdminOperationalRecord(key,id){
  const permissionModule={nccapa:'nc'}[key]||key,permissionKey=key==='documents'?(id?'prepare':'request'):'edit';if(!nucleoFeatureRequire(permissionModule,permissionKey))return;
  const existing=id?adminModuleRecord(id):null;
  const r=collectAdminModuleForm(key,existing);
  if(key==='equipment'&&!['matriz','filial'].includes(r.unit)){alert('Selecione a unidade do equipamento.');return;}
  if(!r.title){alert('Informe o título/nome principal do registro.');return}
  if(key==='nccapa'&&r.ncType==='supplier'){
    if(!r.supplier){alert('Informe o fornecedor da RNC.');return}
    if(!r.rncNumber)r.rncNumber=nextRncNumber();
  }
  if(key==='documents'&&!r.code){alert('Selecione o documento solicitado.');return}
  if(key==='documents'&&!isAdmin()){
    r.status='open';
    r.createdBy=existing?.createdBy||getSession()?.name||'Usuário';
    r.createdByEmail=existing?.createdByEmail||getSession()?.email||'';
    r.sector=existing?.sector||getSession()?.sector||r.sector||'';
    r.recipient=r.recipient||getSession()?.name||'';
    r.recipientEmail=r.recipientEmail||getSession()?.email||'';
    r.responsible=existing?.responsible||'';
    r.link=existing?.link||'';
  }
  if(key==='processes'){
    if(!r.docType){alert('Selecione o tipo de documento interno.');return}
    if(!r.code){alert('Informe o código do documento interno.');return}
    if(!['matriz','filial'].includes(r.unit)){alert('Selecione a unidade do documento.');return}
    if(existing?.processAttachments?.length&&explicitRecordUnit(existing)!==r.unit){alert('Remova os anexos antes de mudar a unidade do documento.');return}
  }
  if(key==='processes'){void nucleoSaveProcessRecordConfirmed(r);return;}
  let all=getAdminModuleRecords();
  const ix=all.findIndex(x=>String(x.id)===String(r.id));
  if(ix>=0)all[ix]=r; else all.unshift(r);
  saveAdminModuleRecords(all);
  // RNC usa salvamento confirmado abaixo; não dispara um segundo POST em paralelo.
  if(!(key==='nccapa'&&r.ncType==='supplier')) portalBackendSave('admin_modules',r.id,r);
  if(key==='documents'&&!isAdmin()){
    const match=findMatchingStandardDocument(r);
    if(match){
      alert('Solicitação registrada. Existe um documento padrão vigente; o Portal vai enviá-lo automaticamente para '+(r.recipientEmail||getSession()?.email||'seu e-mail')+'.');
      autoFulfillDocumentRequest(r).then(ok=>{if(!ok)alert('A solicitação foi registrada, mas a entrega automática não pôde ser confirmada. O SGQ receberá a pendência normalmente.');showAdminOperationalModule(key)});
      return;
    }
    alert('Solicitação registrada. Não há documento padrão compatível; o pedido foi encaminhado ao SGQ.');
    showAdminOperationalModule(key);return;
  }
  if(key==='nccapa'&&r.ncType==='supplier'){
    finishRncCreation(r,ix>=0);
    return;
  }
  alert('Registro salvo.');
  showAdminOperationalModule(key);
}

function editAdminOperationalRecord(...args){return nucleoOpenLazyAdmin('editAdminOperationalRecord',args);}

async function deleteAdminOperationalRecord(id){
  const r=adminModuleRecord(id);if(!r)return;
  if(!nucleoFeatureRequire(r.module==='nccapa'?'nc':r.module,r.module==='documents'?'prepare':'delete'))return;

  if(r.module==='nccapa'&&!canOperateNcCapa()){
    alert('Somente o SGQ/ADM pode excluir uma RNC.');
    return;
  }

  const nome=String(r.rncNumber||r.title||'esta RNC').trim();
  const fornecedor=String(r.supplier||'').trim();
  const enviada=r.rncEmailStatus==='sent';

  let msg=
    `Excluir ${nome}${fornecedor?` — ${fornecedor}`:''}?\n\n`+
    `A RNC será removida da central e a exclusão será sincronizada com a base.`;

  if(enviada){
    msg+=`\n\nATENÇÃO: esta RNC já foi enviada por e-mail. Excluir o registro não desfaz o e-mail já enviado.`;
  }

  if(!confirm(msg))return;

  showNucleoLoading('Excluindo RNC...');

  try{
    await portalBackendDeleteConfirmed('admin_modules',id);

    // Garante a remoção visual mesmo se a tela estiver usando um array antigo.
    saveAdminModuleRecords(
      getAdminModuleRecordsRaw().filter(x=>String(x?.id||'')!==String(id))
    );

    hideNucleoLoading();

    if(document.getElementById('ncTreatmentList')){
      renderNcCapaTreatmentList();
    }else{
      showAdminOperationalModule('nccapa');
    }

    // Reenvia mais uma vez alguns segundos depois.
    setTimeout(()=>portalSendPendingRncDelete(id),2500);
  }catch(e){
    hideNucleoLoading();

    // Mesmo em uma falha local inesperada, mantém a RNC marcada para
    // exclusão e tenta sincronizar novamente.
    markRncDeletedLocally(id);
    setTimeout(()=>portalSendPendingRncDelete(id),2500);

    if(document.getElementById('ncTreatmentList')){
      renderNcCapaTreatmentList();
    }else{
      showAdminOperationalModule('nccapa');
    }
  }
}

function nucleoWorkspaceFeature(key,mode){
 const module=key==='nccapa'?'nc':key;
 const maps={documents:{new:'request',mine:'consult',standards:'standards',deliveries:'history',doc_analysis:'prepare',doc_preparation:'prepare',doc_ready:'deliver',history:'consult'},processes:{new:'edit',published:'consult',review:'review',pending:'review',history:'history',templates:'templates'},equipment:{new:'edit',active:'consult',pending:'pending',history:'history'},training:{new:'edit',active:'consult',pending:'pending',history:'history'},nccapa:{new_rnc:'edit',new_internal:'edit',active:'consult',history:'consult',suppliers:'edit',supplier_indicators:'consult'}};
 return [module,maps[key]?.[mode]||'consult'];
}

function nucleoWorkspaceAllowed(key,mode){const [module,feature]=nucleoWorkspaceFeature(key,mode);return nucleoPersonFeatureCan(module,feature);}