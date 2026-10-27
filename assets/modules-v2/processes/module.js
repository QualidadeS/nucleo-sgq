/* NÚCLEO MODULE: processes | v2.0.0-test | funções migradas: 19 */

function processDeadlineAlerts(showMessage=false){
  const stamp=new Date().toISOString().slice(0,10);let state={};try{state=JSON.parse(localStorage.getItem(DEADLINE_ALERTS_KEY)||'{}')||{}}catch(e){}
  const reminder=getRuleNumber('rulePdcaReminderDays',2,0,90),escalation=getRuleNumber('ruleEscalationDays',3,0,90);let created=0;
  getAllRoRecords().forEach(ro=>{
    if(!isAdmin()&&!canViewRO(ro))return;
    const tri=getSavedTriageMap().get(String(ro.numero||ro.id||ro.codigo||''));const d=parseBrDate(tri?.pdcaDeadline||ro.prazo||'');if(!d)return;
    const today=new Date();today.setHours(0,0,0,0);const end=new Date(d.getFullYear(),d.getMonth(),d.getDate());const diff=Math.ceil((end-today)/86400000);
    let key='',title='';if(diff<0&&Math.abs(diff)>=escalation){key='esc';title='PDCA atrasado · escalonamento'}else if(diff<0){key='over';title='PDCA atrasado'}else if(diff<=reminder){key='soon';title=diff===0?'PDCA vence hoje':'PDCA próximo do prazo'}if(!key)return;
    const id=(ro.numero||'RO')+'|'+key+'|'+stamp+'|'+notificationUserKey();if(state[id])return;
    createNotification({type:'deadline',audience:isAdmin()?'admin':'sector',sector:tri?.responsibleSector||ro.setor||'',ro:ro.numero||'',title,message:(ro.numero||'R.O.')+(diff<0?' está atrasada há '+Math.abs(diff)+' dia(s).':' vence em '+diff+' dia(s).')});state[id]=1;created++;
  });
  localStorage.setItem(DEADLINE_ALERTS_KEY,JSON.stringify(state));if(showMessage)alert(created?created+' alerta(s) atualizado(s).':'Nenhum novo alerta de prazo.');refreshNotificationBell();
}

function requestEmailQueueProcessing(){
  if(!portalBackendEnabled()){alert('Configure o Apps Script primeiro.');return}
  portalPostForm({acao:'portal_process_email_queue',ator:getSession()?.name||'SGQ'});
  setTimeout(refreshEmailHistory,1800);
}

function defaultProcessLayouts(){return [
 {id:'layout-form-seta',name:'Formulários SETA',type:'Formulário',status:'active',accent:'#1f4e78',logoDataUrl:'',logoText:'SETA',layout:{logoWidth:19,metaWidth:25,headerHeight:13,rowHeight:7,borderWidth:.65,fontScale:100,sectionHeight:5},updatedAt:''},
 {id:'layout-proc-seta',name:'POP / Procedimentos',type:'Procedimento',status:'active',accent:'#1f4e78',logoDataUrl:'',logoText:'SETA',layout:{logoWidth:18,metaWidth:24,headerHeight:12,rowHeight:6,borderWidth:.6,fontScale:95,sectionHeight:4},updatedAt:''},
 {id:'layout-rel-seta',name:'Relatórios SETA',type:'Relatório',status:'active',accent:'#1f4e78',logoDataUrl:'',logoText:'SETA',layout:{logoWidth:20,metaWidth:24,headerHeight:14,rowHeight:7,borderWidth:.6,fontScale:100,sectionHeight:5},updatedAt:''}
]}

function getProcessLayouts(){try{const a=JSON.parse(localStorage.getItem(PROCESS_LAYOUT_KEY)||'[]');if(Array.isArray(a)&&a.length)return a}catch(e){}return defaultProcessLayouts()}

function saveProcessLayouts(a){safeStorageSet(PROCESS_LAYOUT_KEY,JSON.stringify(a));portalBackendSave('shared_state','process_layouts',{items:a,updatedAt:new Date().toISOString()})}

function processLayoutById(id){return getProcessLayouts().find(x=>x.id===id)||null}

function createProcessLayout(){const name=prompt('Nome do novo padrão de layout:','Novo padrão SETA');if(!name)return;const a=getProcessLayouts();a.push({id:'layout-'+Date.now(),name:name.trim(),type:'Personalizado',status:'active',accent:'#1f4e78',logoDataUrl:'',logoText:'SETA',layout:{logoWidth:19,metaWidth:25,headerHeight:13,rowHeight:7,borderWidth:.65,fontScale:100,sectionHeight:5},updatedAt:new Date().toISOString()});saveProcessLayouts(a);renderProcessTemplatesWorkspace()}

function duplicateProcessLayout(id){const src=processLayoutById(id);if(!src)return;const a=getProcessLayouts();a.push({...JSON.parse(JSON.stringify(src)),id:'layout-'+Date.now(),name:src.name+' — cópia',status:'active',updatedAt:new Date().toISOString()});saveProcessLayouts(a);renderProcessTemplatesWorkspace()}

function toggleProcessLayoutStatus(id){const a=getProcessLayouts(),x=a.find(v=>v.id===id);if(!x)return;x.status=x.status==='obsolete'?'active':'obsolete';x.updatedAt=new Date().toISOString();saveProcessLayouts(a);renderProcessTemplatesWorkspace()}

async function createProcessDocumentModel(){const name=prompt('Nome do novo modelo de documento:','Novo documento');if(!name)return;const code=prompt('Código do documento (opcional):','')||'';const layouts=getProcessLayouts().filter(x=>x.status!=='obsolete');const layoutId=layouts[0]?.id||'';const a=getProcessTemplates();a.push({id:'tpl-'+Date.now(),kind:'GENERIC',name:name.trim(),code:code.trim(),revision:'01',title:name.trim().toUpperCase(),status:'active',layoutId,documentType:'Formulário',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),sections:[],fieldLayout:[],fixedImages:[],photoFields:[]});try{await saveProcessTemplates(a);renderProcessTemplatesWorkspace()}catch(e){alert('Não foi possível salvar o modelo: '+e.message)}}

async function duplicateProcessDocumentModel(id){const a=getProcessTemplates(),src=a.find(x=>x.id===id);if(!src)return;const cp=JSON.parse(JSON.stringify(src));cp.id='tpl-'+Date.now();cp.name=(src.name||'Documento')+' — cópia';cp.code='';cp.status='active';cp.updatedAt=new Date().toISOString();a.push(cp);try{await saveProcessTemplates(a);renderProcessTemplatesWorkspace()}catch(e){alert('Não foi possível duplicar o modelo: '+e.message)}}

async function toggleProcessDocumentStatus(id){const a=getProcessTemplates(),x=a.find(v=>v.id===id);if(!x)return;x.status=x.status==='obsolete'?'active':'obsolete';x.updatedAt=new Date().toISOString();try{await saveProcessTemplates(a);renderProcessTemplatesWorkspace()}catch(e){alert('Não foi possível atualizar o modelo: '+e.message)}}

function processDocumentLibraryHtml(){const layouts=getProcessLayouts().filter(x=>nucleoProcessShowRetired||x.status!=='obsolete'),models=getProcessTemplates().filter(x=>nucleoProcessShowRetired||x.status!=='obsolete');return `<div style="display:grid;gap:14px;margin-bottom:18px"><label><input type="checkbox" style="width:auto" ${nucleoProcessShowRetired?'checked':''} onchange="nucleoProcessShowRetired=this.checked;renderProcessTemplatesWorkspace()"> Mostrar itens retirados</label>${nucleoSystemModelsHtml()}<div class="card" style="padding:16px"><div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap"><div><b>Padrões de layout</b><div class="small">Você pode ter vários padrões SETA. Eles servem como base visual e não obrigam todos os documentos a serem iguais.</div></div><button class="btn secondary" type="button" onclick="createProcessLayout()">+ Novo padrão</button></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:9px;margin-top:12px">${layouts.map(l=>`<div style="border:1px solid #e3e8f1;border-radius:11px;padding:11px;opacity:${l.status==='obsolete'?'.58':'1'}"><div style="display:flex;justify-content:space-between;gap:6px"><b>${escapeHtml(l.name)}</b><span class="pill">${l.status==='obsolete'?'Obsoleto':'Vigente'}</span></div><div class="small" style="margin-top:4px">${escapeHtml(l.type||'Personalizado')}</div><div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:9px"><button class="btn secondary" type="button" onclick="nucleoEditProcessLayout('${l.id}')">Editar</button><button class="btn secondary" type="button" onclick="applyProcessLayoutToRnc('${l.id}')">Aplicar na RNC</button><button class="btn secondary" type="button" onclick="duplicateProcessLayout('${l.id}')">Duplicar</button><button class="btn secondary" type="button" onclick="toggleProcessLayoutStatus('${l.id}')">${l.status==='obsolete'?'Reativar':'Retirar'}</button></div></div>`).join('')}</div></div><div class="card" style="padding:16px"><div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap"><div><b>Modelos de documentos</b><div class="small">Cada documento escolhe seu próprio padrão ou pode ter layout independente.</div></div><button class="btn secondary" type="button" onclick="createProcessDocumentModel()">+ Novo modelo</button></div><div style="overflow:auto;margin-top:10px"><table style="width:100%;border-collapse:collapse"><thead><tr><th style="text-align:left;padding:7px">Código</th><th style="text-align:left;padding:7px">Documento</th><th style="text-align:left;padding:7px">Tipo</th><th style="text-align:left;padding:7px">Revisão</th><th style="text-align:left;padding:7px">Situação</th><th style="padding:7px"></th></tr></thead><tbody>${models.map(m=>`<tr style="border-top:1px solid #e8edf4;opacity:${m.status==='obsolete'?'.58':'1'}"><td style="padding:8px">${escapeHtml(m.code||'—')}</td><td style="padding:8px"><b>${escapeHtml(m.name||m.title||'Documento')}</b>${m.kind==='RNC'?'<div class="small">Modelo operacional da RNC</div>':''}</td><td style="padding:8px">${escapeHtml(m.documentType||m.kind||'Documento')}</td><td style="padding:8px">${escapeHtml(m.revision||'—')}</td><td style="padding:8px">${m.status==='obsolete'?'Obsoleto':'Vigente'}</td><td style="padding:8px;white-space:nowrap">${m.kind==='RNC'?`<button class="btn secondary" type="button" onclick="nucleoOpenRncTemplateEditor()">Editar folha</button>`:`<button class="btn secondary" type="button" onclick="nucleoOpenFreeDocumentEditor('${m.id}')">Editar folha</button>`}<button class="btn secondary" type="button" onclick="nucleoEditProcessMetadata('${m.id}')">Cadastro</button><button class="btn secondary" type="button" onclick="duplicateProcessDocumentModel('${m.id}')">Duplicar</button> <button class="btn secondary" type="button" onclick="toggleProcessDocumentStatus('${m.id}')">${m.status==='obsolete'?'Reativar':'Retirar'}</button></td></tr>`).join('')}</tbody></table></div></div></div>`}

function getProcessTemplates(){
  try{const a=JSON.parse(localStorage.getItem(PROCESS_TEMPLATE_KEY)||'[]');if(Array.isArray(a)&&a.length)return a.map(x=>x.kind==='RNC'?normalizeRncTemplate(x):x)}catch(e){}
  return [defaultRncProcessTemplate()];
}

function nucleoProcessTemplateSaveUnit(){const s=getSession?.()||{};return s.role==='quality'?'filial':explicitPortalUnit(s.unit)||'matriz';}

function nucleoApplyProcessTemplateImageRefs(items,refs){(items||[]).forEach(model=>{const r=refs?.[String(model.id||'')];if(!r)return;if(r.logoFileId)model.logoFileId=r.logoFileId;(model.fixedImages||[]).forEach((img,i)=>{const id=r.fixed?.[String(img.id||i)];if(id)img.fileId=id;});(model.freeGrid||[]).forEach(row=>(row.cells||[]).forEach(cell=>{const id=r.cells?.[String(cell.id||'')];if(id)cell.imageFileId=id;}));});return items;}

async function saveProcessTemplates(a){
  if(!Array.isArray(a))throw new Error('Biblioteca de modelos inválida.');
  if(!portalBackendEnabled())throw new Error('Apps Script não configurado.');

  try{rncStandardFeedback('Salvando modelo na base central…','info');}catch(e){}

  if(!nucleoCentralDataConfirmed()){
    const synced=await syncPortalBackend(false,{
      foreground:true,
      loadingMessage:'Confirmando a base central antes de salvar o modelo...'
    });
    if(!synced || !nucleoCentralDataConfirmed()){
      throw new Error('A base central não foi confirmada. Sincronize e tente salvar novamente.');
    }
  }

  const eventoId='PROCTPL-'+Date.now()+'-'+Math.random().toString(36).slice(2,9);
  const unit=nucleoProcessTemplateSaveUnit();
  const ok=portalPostForm({
    acao:'nucleo_drive_process_template_state',
    unit,
    eventoId,
    data:JSON.stringify(a),
    ator:getSession()?.name||'SGQ'
  });
  if(!ok)throw new Error('O envio do modelo para a base central não foi iniciado.');

  try{rncStandardFeedback('Modelo enviado. Aguardando confirmação da base central…','info');}catch(e){}

  let result=null;
  for(let i=0;i<90;i++){
    await new Promise(r=>setTimeout(r,i<3?700:1100));
    try{
      const x=await portalJsonp({acao:'nucleo_drive_status',eventoId},25000);
      if(x&&!x.pending){result=x;break;}
    }catch(e){
      if(/sess[aã]o|acesso|permiss/i.test(String(e?.message||e)))throw e;
    }
  }
  if(!result)throw new Error('A base central recebeu o envio, mas não confirmou o salvamento dentro do tempo limite.');
  if(!result.sucesso)throw new Error(result.erro||'A base central recusou o salvamento do modelo.');

  nucleoApplyProcessTemplateImageRefs(a,result.imageRefs||{});

  // A resposta de nucleo_drive_status com sucesso=true já é a confirmação do
  // salvamento executado pelo servidor. A releitura por portal_load pode demorar
  // alguns segundos para refletir a mesma versão (ou até estourar o timeout do
  // Apps Script), mas isso não deve transformar um salvamento confirmado em erro.
  // Mantemos imediatamente a versão confirmada pelo servidor como cache local e
  // fazemos a releitura apenas como sincronização complementar, sem bloquear a UI.
  const confirmedTemplates=JSON.parse(JSON.stringify(a));
  nucleoNativeStorageSetItem.call(localStorage,PROCESS_TEMPLATE_KEY,JSON.stringify(confirmedTemplates));

  setTimeout(async()=>{
    try{
      const snap=await portalJsonp({acao:'portal_load'},45000);
      if(snap?.sucesso===false)return;
      const central=Array.isArray(snap?.dados?.processTemplates)?snap.dados.processTemplates:null;
      if(!central)return;

      const expected=confirmedTemplates.filter(x=>x&&x.id).slice().sort((x,y)=>String(y.updatedAt||'').localeCompare(String(x.updatedAt||'')))[0]||null;
      if(expected){
        const saved=central.find(x=>String(x?.id||'')===String(expected.id||''));
        if(!saved)return;
        const expectedStamp=String(expected.updatedAt||'');
        const savedStamp=String(saved?.updatedAt||'');
        if(expectedStamp && savedStamp!==expectedStamp)return;
      }
      nucleoNativeStorageSetItem.call(localStorage,PROCESS_TEMPLATE_KEY,JSON.stringify(central));
    }catch(e){
      console.warn('[MODELOS] Salvamento confirmado; releitura posterior ainda indisponível:',e);
    }
  },1800);

  try{rncStandardFeedback('Modelo salvo e confirmado na base central.','success');}catch(e){}
  return confirmedTemplates;
}

function renderProcessTemplatesWorkspace(...args){return nucleoOpenLazyAdmin('renderProcessTemplatesWorkspace',args);}

async function nucleoSaveProcessRecordConfirmed(record){
 await showNucleoLoading('Salvando documento na base central...');
 try{const result=await portalBackendSaveConfirmedPost('admin_modules',record.id,record,150000),central=result?.registro||record;
 const all=getAdminModuleRecords(),index=all.findIndex(r=>r.id===record.id);if(index>=0)all[index]=central;else all.unshift(central);saveAdminModuleRecords(all);
 editAdminOperationalRecord(central.id);const status=document.getElementById('processAttachmentStatus');if(status)status.textContent='Registro salvo. Você já pode anexar o documento.';
 }catch(e){alert('O registro não foi confirmado: '+e.message);}finally{hideNucleoLoading();}
}

