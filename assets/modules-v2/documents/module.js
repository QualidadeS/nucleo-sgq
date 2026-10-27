/* NÚCLEO MODULE: documents | v2.0.0-test | funções migradas: 20 */

function canRequestDocuments(){
  const s=getSession();
  if(!s)return false;
  if(s.permissions)return nucleoPersonFeatureCan('documents','request')||nucleoPersonFeatureCan('documents','consult');
  const current=normalizeAnswer(String(s.sector||s.setor||''));
  if(!current)return false;
  return DOCUMENT_REQUEST_ALLOWED_SECTORS.some(sec=>normalizeAnswer(sec)===current);
}

function renderPdcaPrintDocument(p){
  const target=document.getElementById('pdcaPrintReport');
  if(!target)return;

  const a=p.answers||p.respostas||{};
  const labels={
    p1:'Qual é o problema?',
    p2:'Qual é o impacto do problema?',
    p3:'Onde o problema ocorre?',
    p4:'Com que frequência o problema ocorre?',
    p5:'Quais são as possíveis causas do problema?',
    p6:'Por que essas causas ocorrem?',
    p7:'Qual é a causa raiz que deve ser bloqueada?',
    p8:'Qual é a meta SMART?',
    p9:'Qual é o prazo para atingir a meta?',
    p10:'Qual é o status atual da meta?',
    p11:'Qual ação será executada?',
    p12:'Qual é o prazo da ação?',
    p13:'Quais setores são responsáveis pela ação?',
    p14:'Existe algum risco na implantação da ação?',
    d1:'A equipe foi treinada?',
    d2:'A equipe compreendeu a nova forma de trabalho?',
    d3:'Qual é o status do treinamento?',
    d4:'Os recursos necessários estão disponíveis?',
    d5:'Como a execução será registrada?',
    c1:'Os resultados estão conforme a meta SMART?',
    c2:'A causa raiz foi eliminada?',
    c3:'Houve algum efeito colateral?',
    a1:'A melhoria foi padronizada?',
    a2:'Como o novo padrão será acompanhado?',
    a3:'A meta foi atingida?',
    a4:'Quais foram as lições aprendidas?'
  };

  const ro=p.ro||p.numeroRo||p.roNumero||'—';
  const responsavel=p.responsavel||a.p13||'—';
  const setor=p.setor||p.sector||'—';
  const cliente=p.cliente||'—';
  const data=pdcaPrintDate(p.envio||p.dataEnvio||p.sentAt||'');
  const titulo=p.titulo||p.title||a.p1||'—';
  const observacoes=p.observacoes||p.observation||p.obs||'Nenhuma observação geral.';
  const attachments=getPdcaPrintAttachments(p);
  const evidencia=p.evidenciaAcaoCorretiva||p.evidenceCorrectiveAction||(attachments.length?'Sim':'—');
  const tipoRo=p.tipoRo||p.roType||p.origemRo||'—';

  const page1=`
    <section class="pdca-print-page">
      <div class="pdca-doc-topline">
        <span>AVALIA · REGISTRO DE MELHORIA CONTÍNUA</span>
        <span class="pdca-doc-code">FORM-COR-SGQ-0145</span>
      </div>

      <div class="pdca-meta-grid">
        <div class="pdca-meta-cell">
          <span class="pdca-meta-label">Responsável</span>
          <span class="pdca-meta-value">${pdcaPrintEsc(responsavel)}</span>
        </div>
        <div class="pdca-meta-cell">
          <span class="pdca-meta-label">Setor</span>
          <span class="pdca-meta-value">${pdcaPrintEsc(setor)}</span>
        </div>
        
        <div class="pdca-meta-cell">
          <span class="pdca-meta-label">R.O. interna ou externa?</span>
          <span class="pdca-meta-value">${pdcaPrintEsc(tipoRo)}</span>
        </div>

        <div class="pdca-meta-cell">
          <span class="pdca-meta-label">Nº da R.O.</span>
          <span class="pdca-meta-value">${pdcaPrintEsc(ro)}</span>
        </div>
        <div class="pdca-meta-cell">
          <span class="pdca-meta-label">Data</span>
          <span class="pdca-meta-value">${pdcaPrintEsc(data)}</span>
        </div>
        

        <div class="pdca-meta-cell span2">
          <span class="pdca-meta-label">Cliente</span>
          <span class="pdca-meta-value">${pdcaPrintEsc(cliente)}</span>
        </div>
      </div>

      <div class="pdca-quadrants">
        <section class="pdca-q pdca-q-act">
          <div class="pdca-q-head">ACT (AGIR)</div>
          <div class="pdca-q-watermark">A</div>
          <div class="pdca-q-body">${pdcaPrintQuestionLines(['a1','a2','a3','a4'],a,labels)}</div>
        </section>

        <section class="pdca-q pdca-q-plan">
          <div class="pdca-q-head">PLAN (PLANEJAR)</div>
          <div class="pdca-q-watermark">P</div>
          <div class="pdca-q-body">${pdcaPrintQuestionLines(['p1','p2','p3','p4','p5','p6','p7','p8','p9','p10','p11','p12','p13','p14'],a,labels)}</div>
        </section>

        <section class="pdca-q pdca-q-check">
          <div class="pdca-q-head">CHECK (VERIFICAR)</div>
          <div class="pdca-q-watermark">C</div>
          <div class="pdca-q-body">${pdcaPrintQuestionLines(['c1','c2','c3'],a,labels)}</div>
        </section>

        <section class="pdca-q pdca-q-do">
          <div class="pdca-q-head">DO (FAZER)</div>
          <div class="pdca-q-watermark">D</div>
          <div class="pdca-q-body">${pdcaPrintQuestionLines(['d1','d2','d3','d4','d5'],a,labels)}</div>
        </section>
      </div>

      <div class="pdca-doc-footer">
        <strong>ANEXOS:</strong>
        <span>${pdcaPrintEsc(observacoes)}</span>
        <span class="pdca-page-number">PÁGINA 1</span>
      </div>
    </section>`;

  let annex='';
  if(attachments.length){
    annex=`
      <section class="pdca-print-page pdca-annex-page">
        <h1 class="pdca-annex-title">ANEXOS FOTOGRÁFICOS</h1>
        <div class="pdca-annex-subtitle">R.O. ${pdcaPrintEsc(ro)} · ${pdcaPrintEsc(cliente)}</div>
        <div class="pdca-annex-grid">
          ${attachments.map((att,i)=>`
            <div class="pdca-annex-card">
              <div class="pdca-annex-imgbox"><img src="${pdcaPrintEsc(att.src)}" alt="${pdcaPrintEsc(att.name)}"></div>
              <div class="pdca-annex-info">
                <b>${String(i+1).padStart(2,'0')}.${att.stage?' · '+pdcaPrintEsc(att.stage):''}</b>
                <div>${pdcaPrintEsc(att.question||'Evidência anexada ao PDCA')}</div>
                <div style="margin-top:9mm">${pdcaPrintEsc(att.name)}</div>
              </div>
            </div>`).join('')}
        </div>
        <span class="pdca-page-number">PÁGINA 2</span>
      </section>`;
  }

  target.innerHTML=nucleoApplySystemModelHtml(page1+annex,'pdca',explicitRecordUnit(p));
}

function buildPdcaPresentationDocument(p){
  // Reuse exactly the same document generator used by printing/PDF.
  renderPdcaPrintDocument(p);

  const printReport=document.getElementById('pdcaPrintReport');
  const target=document.getElementById('pdcaPresentationDocument');
  if(!printReport || !target)return false;

  target.innerHTML=printReport.innerHTML;

  // Convert print pages into screen pages without altering their content.
  target.querySelectorAll('.pdca-print-page').forEach(page=>{
    page.classList.add('pdca-screen-page');
  });
  return !!target.innerHTML.trim();
}

function getStandardDocuments(){
  try{const a=JSON.parse(localStorage.getItem(STANDARD_DOCUMENTS_KEY)||'[]');return Array.isArray(a)?a.filter(qualityRecordAllowed):[]}catch(e){return []}
}

function saveStandardDocumentsLocal(list){safeStorageSet(STANDARD_DOCUMENTS_KEY,JSON.stringify(Array.isArray(list)?list:[]))}

function getDocumentDeliveries(){
  try{const a=JSON.parse(localStorage.getItem(DOCUMENT_DELIVERIES_KEY)||'[]');return Array.isArray(a)?a:[]}catch(e){return []}
}

function configuredDocumentTypes(unit){const c=unitConfiguration(unit)||{};return Array.isArray(c.documentTypes)?c.documentTypes:Object.entries(defaultDocumentTypes).map(([id,label])=>({id,label}));}

function documentTypeOptions(unit,selected=''){const types=configuredDocumentTypes(unit);return '<option value="">Selecione...</option>'+types.map(t=>'<option value="'+escapeHtml(t.id)+'" '+(t.id===selected?'selected':'')+'>'+escapeHtml(t.label)+'</option>').join('');}

function standardDocumentTypeLabel(v,unit){const units=unit?[unit]:['matriz','filial'];for(const u of units){const t=configuredDocumentTypes(u).find(t=>t.id===v);if(t)return t.label;}return defaultDocumentTypes[v]||v||'Documento';}

function renderDocumentTypeSettings(unit){
 const box=document.getElementById('unitQualitySettings');if(!box)return;let section=document.getElementById('documentTypeSettings');
 if(!section){section=document.createElement('section');section.id='documentTypeSettings';section.className='unit-settings-section';section.innerHTML='<h4>Tipos de documentos</h4><p class="help">Edite os nomes, adicione ou remova tipos desta unidade. Os documentos já cadastrados são mantidos.</p><div id="documentTypeRows"></div><button type="button" class="btn secondary" id="documentTypeAdd">Adicionar tipo</button>';box.querySelector('.unit-settings-grid').appendChild(section);document.getElementById('documentTypeAdd').onclick=()=>addDocumentTypeSettingRow({id:'doc_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8),label:''});}
 document.getElementById('documentTypeRows').innerHTML='';configuredDocumentTypes(unit).forEach(addDocumentTypeSettingRow);
}

function addDocumentTypeSettingRow(type){const row=document.createElement('div');row.dataset.typeId=type.id;row.style.cssText='display:flex;gap:8px;margin:8px 0';const input=document.createElement('input');input.value=type.label;input.placeholder='Nome do tipo de documento';input.setAttribute('aria-label','Tipo de documento');const remove=document.createElement('button');remove.type='button';remove.className='btn secondary';remove.textContent='Remover';remove.onclick=()=>row.remove();row.append(input,remove);document.getElementById('documentTypeRows').appendChild(row);}

function standardDocumentIsValid(d){
  if(!d||d.active===false||String(d.status||'active')==='inactive'||!String(d.fileId||'').trim())return false;
  if(!d.validUntil)return true;
  const end=new Date(String(d.validUntil)+'T23:59:59');
  return !Number.isNaN(end.getTime())&&end>=new Date();
}

function findMatchingStandardDocument(request){
  const code=normalizeAnswer(request?.code||'');
  const product=normalizeAnswer(request?.product||'');
  const language=normalizeAnswer(request?.language||'');
  return getStandardDocuments()
    .filter(standardDocumentIsValid)
    .filter(d=>!d.fillable&&explicitRecordUnit(request)&&explicitRecordUnit(d)===explicitRecordUnit(request))
    .filter(d=>normalizeAnswer(d.code||'')===code)
    .filter(d=>!String(d.productCode||'').trim() || (product && normalizeAnswer(d.productCode)===product))
    .filter(d=>!String(d.language||'').trim() || !language || normalizeAnswer(d.language)===language)
    .sort((a,b)=>String(b.updatedAt||b.createdAt||'').localeCompare(String(a.updatedAt||a.createdAt||'')))[0]||null;
}

function openStandardDocumentCreate(){
  if(!nucleoFeatureRequire('documents','standards'))return;
  if(!isAdmin())return;
  const host=document.getElementById('adminModuleContent');if(!host)return;
  host.innerHTML=`<div style="grid-column:1/-1">
    <button class="btn secondary" type="button" onclick="openAdminOperationalWorkspace('documents',2)">← Voltar aos documentos padrão</button>
    <div class="card" style="margin-top:14px;padding:20px">
      <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap">
        <div><b>Disponibilizar documento padrão</b><div class="small" style="margin-top:4px">Somente o SGQ/ADM cadastra ou substitui arquivos usados na entrega automática.</div></div>
        <span class="pill">Entrega automática</span>
      </div>
      <div class="grid" style="grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:16px">
        <label><span class="small">Nome do documento *</span><input id="stdDocName" placeholder="Ex.: FISPQ Produto X"></label>
        <label><span class="small">Tipo *</span><select id="stdDocCode">${documentTypeOptions(getSession()?.role==='quality'?'filial':document.getElementById('qualityConfigUnit')?.value||explicitPortalUnit(getSession()?.unit)||'matriz')}</select></label>
        <label><span class="small">Versão / revisão</span><input id="stdDocVersion" value="1.0"></label>
        <label><span class="small">Validade</span><input id="stdDocValidUntil" type="date"></label>
        <label><span class="small">Produto / código específico</span><input id="stdDocProduct" placeholder="Opcional — deixe vazio para documento genérico"></label>
        <label><span class="small">Idioma</span><select id="stdDocLanguage"><option value="">Qualquer idioma</option><option>Português</option><option>Inglês</option><option>Espanhol</option></select></label>
        <label><span class="small">Avisar revisão com antecedência</span><input id="stdDocReviewDays" type="number" min="0" value="30"></label>
        <label style="display:flex;align-items:center;gap:8px;margin-top:18px"><input id="stdDocFillable" type="checkbox" style="width:auto"><span class="small">Este arquivo é um modelo preenchível</span></label>
        <label style="grid-column:1/-1"><span class="small">Descrição para orientar a equipe</span><textarea id="stdDocDescription" placeholder="Quando este documento deve ser utilizado"></textarea></label>
        <label style="grid-column:1/-1"><span class="small">Arquivo *</span><input id="stdDocFile" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"></label>
      </div>
      <div id="stdDocUploadStatus" class="small" style="margin-top:12px"></div>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px"><button class="btn primary" type="button" id="stdDocSave" onclick="saveStandardDocument()">Armazenar documento padrão</button></div>
    </div>
  </div>`;
}

async function saveStandardDocument(){
  if(!nucleoFeatureRequire('documents','standards'))return;
  if(!isAdmin())return;
  if(!portalBackendEnabled()){alert('Configure a integração com o Apps Script antes de armazenar arquivos padrão.');return}
  const name=String(document.getElementById('stdDocName')?.value||'').trim();
  const code=String(document.getElementById('stdDocCode')?.value||'').trim();
  const file=document.getElementById('stdDocFile')?.files?.[0];
  if(!name||!code||!file){alert('Informe nome, tipo e arquivo.');return}
  if(file.size>8*1024*1024){alert('Para este fluxo, use arquivos de até 8 MB.');return}
  const status=document.getElementById('stdDocUploadStatus');if(status)status.textContent='Preparando arquivo...';
  try{
    const fileData=await fileToBase64(file);
    const id='STD-'+Date.now()+'-'+Math.random().toString(36).slice(2,7);
    const record={
      id,name,code,version:String(document.getElementById('stdDocVersion')?.value||'').trim(),
      validUntil:String(document.getElementById('stdDocValidUntil')?.value||'').trim(),
      productCode:String(document.getElementById('stdDocProduct')?.value||'').trim(),
      language:String(document.getElementById('stdDocLanguage')?.value||'').trim(),
      reviewDays:Number(document.getElementById('stdDocReviewDays')?.value||30),
      fillable:!!document.getElementById('stdDocFillable')?.checked,
      description:String(document.getElementById('stdDocDescription')?.value||'').trim(),
      fileName:file.name,mimeType:file.type||'application/octet-stream',active:true,status:'active',
      createdAt:new Date().toISOString(),createdBy:getSession()?.name||'SGQ',updatedAt:new Date().toISOString(),updatedBy:getSession()?.name||'SGQ',uploadPending:true
    };
    const local=getStandardDocuments();local.unshift(record);saveStandardDocumentsLocal(local);
    portalPostForm({acao:'portal_upload_standard_document',id,ator:getSession()?.name||'SGQ',metadata:JSON.stringify(record),fileName:file.name,mimeType:record.mimeType,fileData});
    if(status)status.textContent='Arquivo enviado para armazenamento. Confirmando na base central...';
    setTimeout(async()=>{try{await syncPortalBackend(false);renderStandardDocumentsWorkspace()}catch(e){}},2600);
    setTimeout(()=>{try{renderStandardDocumentsWorkspace()}catch(e){}},700);
  }catch(e){if(status)status.textContent='Falha ao preparar o arquivo.';alert(e.message||e)}
}

function renderStandardDocumentsWorkspace(...args){return nucleoOpenLazyAdmin('renderStandardDocumentsWorkspace',args);}

function toggleStandardDocument(id){
  if(!nucleoFeatureRequire('documents','standards'))return;
  if(!isAdmin())return;const list=getStandardDocuments();const i=list.findIndex(x=>String(x.id)===String(id));if(i<0)return;list[i].active=list[i].active===false;list[i].status=list[i].active?'active':'inactive';list[i].updatedAt=new Date().toISOString();list[i].updatedBy=getSession()?.name||'SGQ';saveStandardDocumentsLocal(list);portalBackendSave('standard_documents',id,list[i]);renderStandardDocumentsWorkspace();
}

function deleteStandardDocument(id){
  if(!nucleoFeatureRequire('documents','standards'))return;
  if(!isAdmin()||!confirm('Excluir este documento padrão? O arquivo armazenado também será enviado para a lixeira do Drive.'))return;saveStandardDocumentsLocal(getStandardDocuments().filter(x=>String(x.id)!==String(id)));portalBackendDelete('standard_documents',id);renderStandardDocumentsWorkspace();
}

function renderDocumentDeliveriesWorkspace(...args){return nucleoOpenLazyAdmin('renderDocumentDeliveriesWorkspace',args);}

async function autoFulfillDocumentRequest(request){
  if(!request||request.module!=='documents')return false;
  const doc=findMatchingStandardDocument(request);if(!doc)return false;
  const recipient=String(request.recipientEmail||getSession()?.email||'').trim();if(!recipient)return false;
  if(!portalBackendEnabled())return false;
  try{
    const res=await portalJsonp({acao:'portal_deliver_standard_document',id:doc.id,requestId:request.id,recipientEmail:recipient,recipientName:request.recipient||request.createdBy||'',requestTitle:request.title||'',ator:getSession()?.name||'Portal SGQ'},30000);
    if(!res?.sucesso)throw new Error(res?.erro||'A entrega automática não foi confirmada.');
    request.status='done';request.link='AUTO:'+doc.id;request.standardDocumentId=doc.id;request.standardDocumentName=doc.name;request.autoDelivered=true;request.deliveredAt=res.deliveredAt||new Date().toISOString();request.updatedAt=new Date().toISOString();
    let all=getAdminModuleRecords();const i=all.findIndex(x=>String(x.id)===String(request.id));if(i>=0)all[i]=request;saveAdminModuleRecords(all);portalBackendSave('admin_modules',request.id,request);
    createNotification({type:'document',audience:'user',userKey:notificationUserKey(),title:'Documento enviado automaticamente',message:(doc.name||'Documento')+' foi enviado para '+recipient+'.'});
    setTimeout(()=>syncPortalBackend(false).catch(()=>{}),1600);
    return true;
  }catch(e){console.warn('Falha na entrega automática do documento.',e);return false}
}

