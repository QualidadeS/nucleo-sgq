/* NÚCLEO MODULE: nc | v2.0.0-test | funções migradas: 192 */

function getRncDeletedTombstones(){
  try{
    const obj=JSON.parse(localStorage.getItem(RNC_DELETED_TOMBSTONES_KEY)||'{}');
    return obj&&typeof obj==='object'?obj:{};
  }catch(e){return {}}
}

function saveRncDeletedTombstones(obj){
  try{
    localStorage.setItem(RNC_DELETED_TOMBSTONES_KEY,JSON.stringify(obj||{}));
  }catch(e){}
}

function markRncDeletedLocally(id){
  const key=String(id||'').trim();
  if(!key)return;

  const map=getRncDeletedTombstones();
  map[key]={
    id:key,
    deletedAt:new Date().toISOString(),
    lastAttemptAt:'',
    attempts:Number(map[key]?.attempts||0)
  };
  saveRncDeletedTombstones(map);

  saveAdminModuleRecords(
    getAdminModuleRecordsRaw().filter(x=>String(x?.id||'')!==key)
  );
}

function rncIsLocallyDeleted(id){
  const key=String(id||'').trim();
  return !!getRncDeletedTombstones()[key];
}

function portalSendPendingRncDelete(id){
  const key=String(id||'').trim();
  if(!key||!portalBackendEnabled()||!navigator.onLine)return false;

  const map=getRncDeletedTombstones();
  const item=map[key]||{id:key,attempts:0};

  const params={
    acao:'portal_delete',
    colecao:'admin_modules',
    id:key,
    ator:getSession()?.name||'SGQ'
  };
  const token=String(getSession()?.authToken||'').trim();
  if(token)params.token=token;

  const ok=portalPostForm(params);

  if(ok){
    item.attempts=Number(item.attempts||0)+1;
    item.lastAttemptAt=new Date().toISOString();
    map[key]=item;
    saveRncDeletedTombstones(map);
  }
  return ok;
}

function retryPendingRncDeletes(){
  if(!portalBackendEnabled()||!navigator.onLine)return;

  const map=getRncDeletedTombstones();
  Object.keys(map).forEach(id=>{
    portalSendPendingRncDelete(id);
  });
}

function canOperateNcCapa(){
  if(isAdmin())return true;
  const session=getSession()||{};
  const sector=normalizeAnswer(session.sector||'');
  return sector==='sgq' || sector==='sistema de gestao da qualidade' || sector==='qualidade';
}

function activateNcCapaForm(){
  const host=document.getElementById('adminModuleContent');
  const viewEl=document.getElementById('adminModuleView');
  if(!host)return;

  // Garante que o formulário não fique travado por estado residual,
  // atributo herdado ou camada de bloqueio.
  try{ host.removeAttribute('inert'); }catch(e){}
  try{ viewEl?.removeAttribute('inert'); }catch(e){}

  host.style.pointerEvents='auto';
  if(viewEl)viewEl.style.pointerEvents='auto';

  host.querySelectorAll('input,textarea,select,button').forEach(el=>{
    el.style.pointerEvents='auto';

    // Campos automáticos/ocultos continuam ocultos; todo campo visível
    // da abertura da NC/RNC precisa aceitar interação.
    if(el.type!=='hidden'){
      try{ el.disabled=false; }catch(e){}
      try{ el.readOnly=false; }catch(e){}
      el.removeAttribute('aria-disabled');
    }

    // Evita que algum container pai capture o clique do campo.
    if(!el.dataset.ncInteractiveBound){
      el.dataset.ncInteractiveBound='1';
      el.addEventListener('pointerdown',ev=>ev.stopPropagation());
      el.addEventListener('click',ev=>ev.stopPropagation());
    }
  });
}

function ncCapaTypeKey(r){
  const t=normalizeAnswer(r?.ncType||'');
  if(t==='supplier'||String(r?.rncNumber||'').trim())return 'supplier';
  if(t==='client'||t==='customer'||t==='cliente')return 'client';
  return 'internal';
}

function ncCapaTypeLabel(r){
  const t=ncCapaTypeKey(r);
  if(t==='supplier')return 'RNC fornecedor';
  if(t==='client')return 'Cliente / SAC';
  return 'NC interna';
}

function ncCapaEmailLabel(r){
  if(ncCapaTypeKey(r)!=='supplier')return '—';
  if(r?.rncEmailStatus==='sent')return 'Enviada';
  if(r?.rncEmailStatus==='sending')return 'Enviando';
  return 'Não enviada';
}

function ncCapaCapaLabel(r){
  return String(r?.capa||'no')==='yes'?'Sim':'Não';
}

function ncCapaRecordDate(r){
  return r?.updatedAt||r?.createdAt||r?.eventDate||r?.rncIssueDate||'';
}

function renderNcCapaHomeOverview(){
  const host=document.getElementById('ncModuleInlineOverview');if(!host)return;

  host.innerHTML=`<div class="card" style="padding:20px">
    <div style="display:flex;justify-content:space-between;gap:14px;align-items:flex-start;flex-wrap:wrap">
      <div>
        <b style="font-size:16px">Todas as RNCs</b>
        <div class="small" style="margin-top:5px">As RNCs de fornecedor ficam expostas aqui. Filtre por CAPA, situação ou envio e use as ações direto na linha.</div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn primary" type="button" onclick="openAdminOperationalWorkspace('nccapa',0)">＋ Nova RNC fornecedor</button>
      </div>
    </div>

    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;margin-top:16px">
      <label><span class="small">CAPA</span>
        <select id="ncTreatmentCapa" onchange="renderNcCapaTreatmentList()">
          <option value="all">Todas</option>
          <option value="yes">Com CAPA</option>
          <option value="no">Sem CAPA</option>
        </select>
      </label>

      <label><span class="small">Situação</span>
        <select id="ncTreatmentStatus" onchange="renderNcCapaTreatmentList()">
          <option value="all">Todas</option>
          <option value="open">Em aberto</option>
          <option value="done">Concluídas</option>
        </select>
      </label>

      <label><span class="small">Envio da RNC</span>
        <select id="ncTreatmentEmail" onchange="renderNcCapaTreatmentList()">
          <option value="all">Todos</option>
          <option value="sent">Enviadas</option>
          <option value="not_sent">Não enviadas</option>
        </select>
      </label>

      <label><span class="small">Organizar</span>
        <select id="ncTreatmentSort" onchange="renderNcCapaTreatmentList()">
          <option value="recent">Mais recentes</option>
          <option value="old">Mais antigas</option>
          <option value="number">Número / título</option>
        </select>
      </label>

      <label style="grid-column:span 2"><span class="small">Buscar</span>
        <input id="ncTreatmentSearch" placeholder="Número, título, fornecedor, setor, R.O..." oninput="renderNcCapaTreatmentList()">
      </label>
    </div>

    <div id="ncTreatmentSummary" class="small" style="margin-top:14px"></div>
    <div id="ncTreatmentList" style="margin-top:12px"></div>
  </div>`;

  renderNcCapaTreatmentList();
}

function renderNcCapaTreatmentWorkspace(){
  const host=document.getElementById('adminModuleContent');if(!host)return;

  host.innerHTML=`<div style="grid-column:1/-1">
    <button class="btn secondary" type="button" onclick="showAdminOperationalModule('nccapa')">← Voltar ao módulo</button>

    <div class="card" style="margin-top:14px;padding:20px">
      <div style="display:flex;justify-content:space-between;gap:14px;align-items:flex-start;flex-wrap:wrap">
        <div>
          <h3 style="margin:0">Em tratamento</h3>
          <div class="small" style="margin-top:5px">Todas as RNCs ficam nesta central. Use os filtros para separar fornecedor, interna, cliente/SAC, CAPA e situação.</div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="btn primary" type="button" onclick="openAdminOperationalWorkspace('nccapa',0)">＋ Nova RNC fornecedor</button>
        </div>
      </div>

      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(165px,1fr));gap:10px;margin-top:18px">
        <label><span class="small">CAPA</span>
          <select id="ncTreatmentCapa" onchange="renderNcCapaTreatmentList()">
            <option value="all">Todas</option>
            <option value="yes">Com CAPA</option>
            <option value="no">Sem CAPA</option>
          </select>
        </label>

        <label><span class="small">Situação</span>
          <select id="ncTreatmentStatus" onchange="renderNcCapaTreatmentList()">
            <option value="all">Todas</option>
            <option value="open">Em aberto</option>
            <option value="done">Concluídas</option>
          </select>
        </label>

        <label><span class="small">Envio da RNC</span>
          <select id="ncTreatmentEmail" onchange="renderNcCapaTreatmentList()">
            <option value="all">Todos</option>
            <option value="sent">Enviadas</option>
            <option value="not_sent">Não enviadas</option>
          </select>
        </label>

        <label><span class="small">Organizar</span>
          <select id="ncTreatmentSort" onchange="renderNcCapaTreatmentList()">
            <option value="recent">Mais recentes</option>
            <option value="old">Mais antigas</option>
            <option value="number">Número / título</option>
            </select>
        </label>

        <label style="grid-column:span 2"><span class="small">Buscar</span>
          <input id="ncTreatmentSearch" placeholder="Número, título, fornecedor, setor, R.O..." oninput="renderNcCapaTreatmentList()">
        </label>
      </div>

      <div id="ncTreatmentSummary" class="small" style="margin-top:14px"></div>
      <div id="ncTreatmentList" style="margin-top:12px"></div>
    </div>
  </div>`;

  renderNcCapaTreatmentList();
}

function renderNcCapaTreatmentList(){
  const host=document.getElementById('ncTreatmentList');if(!host)return;

  const capa=document.getElementById('ncTreatmentCapa')?.value||'all';
  const status=document.getElementById('ncTreatmentStatus')?.value||'all';
  const email=document.getElementById('ncTreatmentEmail')?.value||'all';
  const sort=document.getElementById('ncTreatmentSort')?.value||'recent';
  const q=normalizeAnswer(document.getElementById('ncTreatmentSearch')?.value||'');

  let rows=getAdminModuleRecords().filter(r=>
    r.module==='nccapa' &&
    ncCapaTypeKey(r)==='supplier'
  );

  rows=rows.filter(r=>{
    const tk='supplier';

    if(capa!=='all'&&String(r.capa||'no')!==capa)return false;

    const concluida=['done','published','closed','concluded'].includes(String(r.status||''));
    if(status==='open'&&concluida)return false;
    if(status==='done'&&!concluida)return false;

    if(email!=='all'){
      if(tk!=='supplier')return false;
      if(email==='sent'&&r.rncEmailStatus!=='sent')return false;
      if(email==='not_sent'&&r.rncEmailStatus==='sent')return false;
    }

    if(q){
      const hay=normalizeAnswer([
        r.rncNumber,r.title,r.supplier,r.sector,r.responsible,r.relatedRo,
        r.rncProduct,r.rncSummary,r.description
      ].filter(Boolean).join(' '));
      if(!hay.includes(q))return false;
    }
    return true;
  });

  if(sort==='old'){
    rows.sort((a,b)=>String(ncCapaRecordDate(a)).localeCompare(String(ncCapaRecordDate(b))));
  }else if(sort==='number'){
    rows.sort((a,b)=>String(a.rncNumber||a.title||'').localeCompare(String(b.rncNumber||b.title||''),'pt-BR',{numeric:true,sensitivity:'base'}));
  }else{
    rows.sort((a,b)=>String(ncCapaRecordDate(b)).localeCompare(String(ncCapaRecordDate(a))));
  }

  const summary=document.getElementById('ncTreatmentSummary');
  if(summary){
    const capas=rows.filter(r=>String(r.capa||'no')==='yes').length;
    const enviadas=rows.filter(r=>r.rncEmailStatus==='sent').length;
    summary.textContent=`${rows.length} RNC(s) • ${enviadas} enviada(s) • ${capas} com CAPA`;
  }

  if(!rows.length){
    host.innerHTML='<div style="padding:28px;border:1px solid #e5e7eb;border-radius:12px;background:#fafafa"><b>Nenhum registro encontrado.</b><div class="small" style="margin-top:5px">Ajuste os filtros ou a busca.</div></div>';
    return;
  }

  host.innerHTML=`<div style="overflow:auto;border:1px solid #e5e7eb;border-radius:12px">
    <table style="width:100%;min-width:1080px">
      <thead><tr>
        <th>RNC</th>
        <th>Fornecedor</th>
        <th>CAPA</th>
        <th>Situação</th>
        <th>Envio</th>
        <th style="text-align:right">Ações</th>
      </tr></thead>
      <tbody>${rows.map(r=>{
        const registro=r.rncNumber||'RNC sem número';
        const complemento=r.title||r.rncSummary||'';
        const fornecedor=r.supplier||'—';
        return `<tr>
          <td><b>${escapeHtml(registro)}</b>${complemento?`<div class="small">${escapeHtml(complemento)}</div>`:''}</td>
          <td>${escapeHtml(fornecedor)}</td>
          <td><span class="pill">${escapeHtml(ncCapaCapaLabel(r))}</span></td>
          <td><span class="pill">${escapeHtml(adminModuleStatusLabel(r.status))}</span></td>
          <td><span class="pill">${escapeHtml(ncCapaEmailLabel(r))}</span></td>
          <td><div style="display:flex;justify-content:flex-end;gap:6px;flex-wrap:wrap">
            <button class="btn secondary" type="button" onclick="printRncStandard('${escapeHtml(r.id)}')">Visualizar</button>
            <button class="btn primary" type="button" onclick="openRncSendModal('${escapeHtml(r.id)}')">Enviar</button>
            <button class="btn secondary" type="button" onclick="showNcCapaStatus('${escapeHtml(r.id)}')">Situação</button>
            <button class="btn secondary" type="button" onclick="editAdminOperationalRecord('${escapeHtml(r.id)}')">Abrir</button>
            <button class="btn danger" type="button" onclick="deleteAdminOperationalRecord('${escapeHtml(r.id)}')">Excluir</button>
          </div></td>
        </tr>`;
      }).join('')}</tbody>
    </table>
  </div>`;
}

function showNcCapaStatus(id){
  const r=adminModuleRecord(id);if(!r)return;

  const situacao=adminModuleStatusLabel(r.status);
  const capa=ncCapaCapaLabel(r);
  const envio=ncCapaEmailLabel(r);
  const numero=r.rncNumber||r.title||'RNC';
  const vinculo=r.relatedRo||'Não vinculada';

  alert(
    `${numero}\n\n`+
    `Fornecedor: ${r.supplier||'—'}\n`+
    `Situação: ${situacao}\n`+
    `CAPA: ${capa}\n`+
    `Envio da RNC: ${envio}\n`+
    `R.O. vinculada: ${vinculo}`
  );
}

function renderRncSendWorkspace(){
  const host=document.getElementById('adminModuleContent');if(!host)return;
  const rncs=getAdminModuleRecords().filter(r=>r.module==='nccapa'&&(r.ncType==='supplier'||String(r.rncNumber||'').trim())).slice().sort((a,b)=>String(b.updatedAt||b.createdAt||'').localeCompare(String(a.updatedAt||a.createdAt||'')));
  host.innerHTML=`<div style="grid-column:1/-1">
    <button class="btn secondary" type="button" onclick="showAdminOperationalModule('nccapa')">← Voltar ao módulo</button>
    <div class="card" style="margin-top:14px;padding:20px">
      <div style="display:flex;justify-content:space-between;gap:14px;align-items:flex-start;flex-wrap:wrap">
        <div><h3 style="margin:0">Enviar RNC</h3><div class="small" style="margin-top:5px">Escolha uma RNC já pronta. Você pode conferir o PDF e fazer o envio sem abrir a tela de acompanhamento.</div></div>
        <div style="min-width:min(360px,100%);flex:0 1 420px"><input id="rncSendSearch" placeholder="Buscar por nº da RNC, fornecedor ou título" oninput="filterRncSendWorkspace()"></div>
      </div>
      <div id="rncSendWorkspaceList" style="margin-top:16px"></div>
    </div>
  </div>`;
  renderRncSendWorkspaceList(rncs);
}

function rncSendWorkspaceRecords(){
  return getAdminModuleRecords().filter(r=>r.module==='nccapa'&&(r.ncType==='supplier'||String(r.rncNumber||'').trim())).slice().sort((a,b)=>String(b.updatedAt||b.createdAt||'').localeCompare(String(a.updatedAt||a.createdAt||'')));
}

function filterRncSendWorkspace(){renderRncSendWorkspaceList(rncSendWorkspaceRecords())}

function renderRncSendWorkspaceList(records){
  const host=document.getElementById('rncSendWorkspaceList');if(!host)return;
  const q=normalizeAnswer(document.getElementById('rncSendSearch')?.value||'');
  const rows=(records||[]).filter(r=>!q||normalizeAnswer([r.rncNumber,r.supplier,r.title,r.rncProduct,r.description].filter(Boolean).join(' ')).includes(q));
  if(!rows.length){host.innerHTML='<div style="padding:26px;border:1px solid #e5e7eb;border-radius:12px;background:#fafafa"><b>Nenhuma RNC encontrada.</b><div class="small" style="margin-top:5px">RNCs salvas no Núcleo aparecerão aqui para envio.</div></div>';return}
  host.innerHTML=`<div style="overflow:auto;border:1px solid #e5e7eb;border-radius:12px"><table style="width:100%"><thead><tr><th>RNC</th><th>Fornecedor</th><th>Situação do envio</th><th>Último envio</th><th style="text-align:right">Ações</th></tr></thead><tbody>${rows.map(r=>`<tr>
    <td><b>${escapeHtml(r.rncNumber||'RNC sem número')}</b><div class="small">${escapeHtml(r.title||r.rncSummary||'—')}</div></td>
    <td>${escapeHtml(r.supplier||'—')}</td>
    <td><span class="pill">${escapeHtml(r.rncEmailStatus==='sent'?'Enviada':r.rncEmailStatus==='sending'?'Enviando':'Não enviada')}</span>${r.supplierEmail?`<div class="small" style="margin-top:4px">${escapeHtml(r.supplierEmail)}</div>`:''}</td>
    <td>${escapeHtml(formatDateTimeBR(r.rncEmailSentAt||'')||'—')}</td>
    <td><div style="display:flex;gap:7px;justify-content:flex-end;flex-wrap:wrap">
      <button class="btn secondary" type="button" onclick="printRncStandard('${escapeHtml(r.id)}')">Ver PDF</button>
      <button class="btn primary" type="button" onclick="openRncSendModal('${escapeHtml(r.id)}')">Enviar RNC</button>
      <button class="btn danger" type="button" onclick="deleteAdminOperationalRecord('${escapeHtml(r.id)}')">Excluir RNC</button>
    </div></td>
  </tr>`).join('')}</tbody></table></div>`;
}

function rncBlockItemRowHtml(item={},index=0){
  const e=v=>escapeHtml(String(v??''));
  return `<div class="rnc-block-item" data-rnc-block-index="${index}" style="border:1px solid #d8e0ec;border-radius:10px;padding:12px;background:#fff">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px">
      <b>Item ${index+1}</b>
      <button class="btn danger" type="button" onclick="removeRncBlockItem(this)" style="padding:6px 9px">Remover</button>
    </div>
    <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px">
      <label><span class="small">Nota Fiscal</span><input data-rnc-block-field="invoice" value="${e(item.invoice||item.notaFiscal||'')}" placeholder="Nº da NF"></label>
      <label><span class="small">Data da emissão</span><input data-rnc-block-field="issueDate" type="date" value="${e(item.issueDate||item.dataEmissao||'')}"></label>
      <label><span class="small">Código do produto</span><input data-rnc-block-field="productCode" value="${e(item.productCode||item.codigoProduto||'')}" placeholder="Código"></label>
      <label><span class="small">Quantidade não conforme</span><input data-rnc-block-field="quantity" value="${e(item.quantity||item.qtd||'')}" placeholder="Quantidade e unidade"></label>
      <label><span class="small">Produto / descrição</span><input data-rnc-block-field="product" value="${e(item.product||item.produto||'')}" placeholder="Produto ou matéria-prima"></label>
      <label><span class="small">Dimensões / especificação</span><input data-rnc-block-field="dimensions" value="${e(item.dimensions||item.dimensoes||'')}" placeholder="Quando aplicável"></label>
      <label style="grid-column:1/-1"><span class="small">Disposição</span><input data-rnc-block-field="disposition" value="${e(item.disposition||item.disposicao||'')}" placeholder="Ex.: devolução, segregação, retrabalho..."></label>
    </div>
  </div>`;
}

function normalizeRncBlockItems(items){
  const list=Array.isArray(items)?items.filter(Boolean):[];
  return list.length?list:[{}];
}

function renderRncBlockItems(items){
  const host=document.getElementById('admModRncBlockItems');if(!host)return;
  host.innerHTML=normalizeRncBlockItems(items).map((item,i)=>rncBlockItemRowHtml(item,i)).join('');
  renumberRncBlockItems();
}

function renumberRncBlockItems(){
  const rows=[...document.querySelectorAll('#admModRncBlockItems .rnc-block-item')];
  rows.forEach((row,i)=>{
    row.dataset.rncBlockIndex=i;
    const b=row.querySelector('b');if(b)b.textContent='Item '+(i+1);
    const remove=row.querySelector('button.danger');if(remove)remove.style.display=rows.length>1?'inline-flex':'none';
  });
}

function addRncBlockItem(item={}){
  const host=document.getElementById('admModRncBlockItems');if(!host)return;
  const wrap=document.createElement('div');
  wrap.innerHTML=rncBlockItemRowHtml(item,host.querySelectorAll('.rnc-block-item').length);
  host.appendChild(wrap.firstElementChild);
  renumberRncBlockItems();
}

function removeRncBlockItem(btn){
  const host=document.getElementById('admModRncBlockItems');if(!host)return;
  const rows=host.querySelectorAll('.rnc-block-item');if(rows.length<=1)return;
  btn.closest('.rnc-block-item')?.remove();
  renumberRncBlockItems();
}

function collectRncBlockItems(){
  return [...document.querySelectorAll('#admModRncBlockItems .rnc-block-item')].map(row=>{
    const get=k=>String(row.querySelector(`[data-rnc-block-field="${k}"]`)?.value||'').trim();
    return {
      invoice:get('invoice'),
      issueDate:get('issueDate'),
      productCode:get('productCode'),
      product:get('product'),
      dimensions:get('dimensions'),
      quantity:get('quantity'),
      disposition:get('disposition')
    };
  }).filter(item=>Object.values(item).some(v=>String(v||'').trim()));
}

function legacyRncBlockItems(r={}){
  if(Array.isArray(r.rncBlockItems)&&r.rncBlockItems.length)return r.rncBlockItems;
  const legacy={
    invoice:r.rncInvoice||'',
    issueDate:r.rncIssueDate||'',
    productCode:r.rncProductCode||'',
    product:r.rncProduct||'',
    dimensions:r.rncDimensions||'',
    quantity:r.rncQuantity||'',
    disposition:r.rncDisposition||''
  };
  return Object.values(legacy).some(v=>String(v||'').trim())?[legacy]:[{}];
}

function updateNcCapaFormType(){
  const type=document.getElementById('admModNcType');
  if(type)type.value='supplier';

  document.getElementById('admModRncOpening')?.classList.remove('hidden');

  const internal=document.getElementById('admModNcInternalFields');
  if(internal){
    internal.classList.add('hidden');
    internal.style.display='none';
  }

  if(document.getElementById('admModRncBlockItems')&&!document.querySelector('#admModRncBlockItems .rnc-block-item')){
    renderRncBlockItems([{}]);
  }
}

function nextRncNumber(){
  const year=new Date().getFullYear();
  let max=0;
  getAdminModuleRecords().filter(r=>r.module==='nccapa').forEach(r=>{
    const m=String(r.rncNumber||'').match(/^RNC-(\d{4})-(\d+)$/i);
    if(m&&Number(m[1])===year)max=Math.max(max,Number(m[2])||0);
  });
  return `RNC-${year}-${String(max+1).padStart(4,'0')}`;
}

async function finishRncCreation(r,wasExisting){
  const msg=wasExisting?'RNC atualizada com sucesso.':'RNC criada com sucesso.';
  if(!portalBackendEnabled()){openRncSuccessModal(r,msg);return;}
  showNucleoLoading('Salvando RNC...');
  try{
    // Usa POST confirmado para toda RNC. A rota GET não é usada para gravar e
    // fotos podem tornar o registro grande demais para uma URL.
    const saved=await portalBackendSaveConfirmedPost('admin_modules',r.id,r,150000);
    const central=saved?.registro||r;
    // Atualiza o cache local com a versão realmente devolvida pela base (inclusive refs das fotos).
    const all=getAdminModuleRecords(),ix=all.findIndex(x=>String(x.id)===String(r.id));
    if(ix>=0){all[ix]={...r,...central};saveAdminModuleRecords(all)}
    hideNucleoLoading();
    openRncSuccessModal({...r,...central},msg);
  }catch(e){
    hideNucleoLoading();
    alert('Não foi possível confirmar o salvamento da RNC na base central.\n\n'+String(e?.message||e||'Falha desconhecida.')+'\n\nNada será enviado por e-mail até o salvamento ser confirmado.');
  }
}

function ensureRncSuccessModal(){
  let ov=document.getElementById('rncSuccessOverlay');if(ov)return ov;
  ov=document.createElement('div');ov.id='rncSuccessOverlay';ov.className='modal hidden';ov.style.zIndex='100300';
  ov.innerHTML=`<div class="modal-box" style="width:min(680px,96vw)"><div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start"><div><h3 id="rncSuccessTitle" style="margin-bottom:5px">RNC criada com sucesso</h3><div id="rncSuccessMeta" class="small"></div></div><button class="btn secondary" type="button" onclick="closeRncSuccessModal()">Fechar</button></div><div style="margin-top:18px;padding:14px;border:1px solid #dbe4df;border-radius:12px;background:#f8faf9"><b>O que deseja fazer agora?</b><div class="small" style="margin-top:4px">Você pode conferir o PDF antes do envio ou enviar depois pela opção Enviar RNC.</div><div style="display:flex;gap:9px;flex-wrap:wrap;margin-top:14px"><button class="btn secondary" type="button" id="rncSuccessPdfBtn">Ver PDF</button><button class="btn primary" type="button" id="rncSuccessSendBtn">Realizar envio</button><button class="btn secondary" type="button" onclick="closeRncSuccessModal(true)">Concluir e voltar</button></div></div></div>`;
  document.body.appendChild(ov);return ov;
}

function openRncSuccessModal(r,msg){
  const ov=ensureRncSuccessModal();ov.dataset.rncId=r.id;ov.classList.remove('hidden');
  document.getElementById('rncSuccessTitle').textContent=msg||'RNC criada com sucesso.';
  const totalFotos=Object.values(r.rncPhotos||{}).reduce((n,g)=>n+(Array.isArray(g)?g.filter(x=>x&&x.fileId).length:0),0);
  document.getElementById('rncSuccessMeta').textContent=[
    r.rncNumber,
    r.supplier,
    r.eventDate||r.rncIssueDate,
    totalFotos?(`${totalFotos} foto(s) confirmada(s) no Drive`):''
  ].filter(Boolean).join(' · ');
  document.getElementById('rncSuccessPdfBtn').onclick=()=>printRncStandard(r.id);
  document.getElementById('rncSuccessSendBtn').onclick=()=>openRncSendModal(r.id);
}

function closeRncSuccessModal(goBack=false){const ov=document.getElementById('rncSuccessOverlay');ov?.classList.add('hidden');if(goBack)showAdminOperationalModule('nccapa')}

function ensureRncSendModal(){
  let ov=document.getElementById('rncSendOverlay');if(ov)return ov;
  ov=document.createElement('div');ov.id='rncSendOverlay';ov.className='modal hidden';ov.style.zIndex='100350';
  ov.innerHTML=`<div class="modal-box" style="width:min(720px,96vw)"><div style="display:flex;justify-content:space-between;gap:12px"><div><h3 style="margin-bottom:4px">Enviar RNC</h3><div class="small">O fornecedor receberá o PDF fechado e o documento editável.</div></div><button class="btn secondary" type="button" onclick="document.getElementById('rncSendOverlay').classList.add('hidden')">Fechar</button></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px"><label><span class="small">Responsável pela abertura</span><input id="rncSendFromName" disabled></label><label><span class="small">E-mail do responsável</span><input id="rncSendReplyTo" disabled></label><label style="grid-column:1/-1"><span class="small">E-mail do fornecedor *</span><input id="rncSendSupplierEmail" type="email" placeholder="fornecedor@empresa.com"></label><label style="grid-column:1/-1"><span class="small">Diretoria / outros destinatários (CC)</span><input id="rncSendCc" placeholder="email1@seta.com.br; email2@seta.com.br"></label><label style="grid-column:1/-1"><span class="small">Assunto</span><input id="rncSendSubject"></label><label style="grid-column:1/-1"><span class="small">Mensagem</span><textarea id="rncSendMessage" style="min-height:110px"></textarea></label></div><div id="rncSendStatus" class="small" style="margin-top:10px"></div><div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px"><button class="btn secondary" type="button" id="rncSendPreviewBtn">Ver PDF</button><button class="btn primary" type="button" id="rncSendNowBtn">Enviar RNC</button></div></div>`;
  document.body.appendChild(ov);return ov;
}

function openRncSendModal(id){
  const r=adminModuleRecord(id);if(!r)return;const ov=ensureRncSendModal(),sess=getSession()||{};ov.dataset.rncId=id;ov.classList.remove('hidden');
  document.getElementById('rncSendFromName').value=sess.name||r.createdBy||'';document.getElementById('rncSendReplyTo').value=sess.email||r.createdByEmail||'';
  document.getElementById('rncSendSupplierEmail').value=r.supplierEmail||'';document.getElementById('rncSendCc').value=r.rncEmailCc||'';
  document.getElementById('rncSendSubject').value=`RNC ${r.rncNumber||''} – ${r.supplier||'Fornecedor'}`;
  document.getElementById('rncSendMessage').value=`Prezados,\n\nSegue anexa a ${r.rncNumber||'RNC'} referente à não conformidade registrada.\n\nSolicitamos a análise e o retorno das ações aplicáveis.\n\nAtenciosamente,\n${sess.name||r.createdBy||'SGQ'}`;
  document.getElementById('rncSendPreviewBtn').onclick=()=>printRncStandard(id);document.getElementById('rncSendNowBtn').onclick=sendRncEmailNow;
  document.getElementById('rncSendStatus').textContent='';
}

async function sendRncEmailNow(){
 if(!nucleoFeatureRequire('nc','send'))return;
  const ov=document.getElementById('rncSendOverlay'),id=ov?.dataset.rncId,r=adminModuleRecord(id);if(!r)return;
  const supplierEmail=String(document.getElementById('rncSendSupplierEmail')?.value||'').trim();if(!supplierEmail||!supplierEmail.includes('@'))return alert('Informe o e-mail do fornecedor.');
  const sendFormat='both',cc=String(document.getElementById('rncSendCc')?.value||'').trim(),replyTo=String(document.getElementById('rncSendReplyTo')?.value||'').trim(),subject=String(document.getElementById('rncSendSubject')?.value||'').trim(),message=String(document.getElementById('rncSendMessage')?.value||'').trim();
  if(!portalBackendEnabled())return alert('Configure o Apps Script para realizar o envio.');
  const html=printRncStandard(id,true);if(!html)return alert('Não foi possível montar o PDF da RNC.');const docHtml=rncWordCompatibleHtml(html);
  const eventId='RNCMAIL-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),btn=document.getElementById('rncSendNowBtn'),st=document.getElementById('rncSendStatus');btn.disabled=true;st.textContent='Confirmando RNC na base central...';showNucleoLoading('Confirmando RNC...');
  const updated={...r,supplierEmail,rncEmailCc:cc,rncEmailStatus:'sending',rncEmailLastAttemptAt:new Date().toISOString()};let all=getAdminModuleRecords(),ix=all.findIndex(x=>String(x.id)===String(id));if(ix>=0)all[ix]=updated;saveAdminModuleRecords(all);
  try{
    // O envio nunca corre em paralelo com o salvamento. Primeiro confirma que o
    // mesmo ID está legível na base central; se necessário, grava e confirma.
    let central=await portalJsonp({acao:'portal_get_record',colecao:'admin_modules',id},15000).catch(()=>null);
    if(!central?.sucesso||!central?.registro){
      central=await portalBackendSaveConfirmedPost('admin_modules',id,updated,90000);
    }
    st.textContent='RNC confirmada. Enviando e-mail...';updateNucleoLoading('Enviando RNC...');
  }catch(e){
    hideNucleoLoading();btn.disabled=false;st.textContent='O envio não foi iniciado. '+String(e?.message||e);return;
  }
  const submitted=portalPostForm({acao:'portal_send_rnc_email',id,email:supplierEmail,cc,replyTo,subject,message,html,docHtml,formato:'both',eventoId:eventId,ator:getSession()?.name||'SGQ'});
  if(!submitted){hideNucleoLoading();btn.disabled=false;st.textContent='Não foi possível iniciar o envio.';return}
  // Gerar PDF + DOCX (principalmente com fotos) pode levar bem mais de 12 s.
  // Aguarda até 2 minutos e confirma por DUAS fontes:
  // 1) status do evento; 2) registro da própria RNC já marcado como enviado.
  let result=null;
  const startedEmail=Date.now();

  while(Date.now()-startedEmail<120000 && !result){
    await new Promise(res=>setTimeout(res,1500));

    try{
      const chk=await portalJsonp({acao:'portal_rnc_email_status',eventoId:eventId},15000);
      if(chk?.sucesso&&chk?.status&&chk.status!=='processing'){
        result=chk;
        break;
      }
    }catch(e){}

    // Fallback real: se o Apps Script já gravou a RNC como "sent",
    // o e-mail foi enviado mesmo que o status do evento ainda não apareça.
    try{
      const central=await portalJsonp({acao:'portal_get_record',colecao:'admin_modules',id},15000);
      const reg=central?.registro;
      if(central?.sucesso && reg && reg.rncEmailStatus==='sent'){
        const sentAt=String(reg.rncEmailSentAt||'');
        const attemptAt=String(updated.rncEmailLastAttemptAt||'');
        if(!attemptAt || !sentAt || sentAt>=attemptAt){
          result={sucesso:true,status:'sent',at:sentAt||new Date().toISOString(),registro:reg};
          break;
        }
      }
    }catch(e){}

    st.textContent='Enviando RNC... aguardando confirmação do e-mail.';
  }

  hideNucleoLoading();btn.disabled=false;

  // Última leitura antes de declarar falha.
  if(!result){
    try{
      const central=await portalJsonp({acao:'portal_get_record',colecao:'admin_modules',id},15000);
      const reg=central?.registro;
      if(central?.sucesso && reg?.rncEmailStatus==='sent'){
        result={sucesso:true,status:'sent',at:reg.rncEmailSentAt||new Date().toISOString(),registro:reg};
      }
    }catch(e){}
  }

  if(!result||result.status!=='sent'){
    st.textContent='O envio não foi confirmado.'+(result?.erro?' '+result.erro:'');
    return;
  }

  const done={...updated,...(result.registro||{}),rncEmailStatus:'sent',rncEmailSentAt:result.at||new Date().toISOString(),rncEmailTo:supplierEmail,rncEmailCc:cc};all=getAdminModuleRecords();ix=all.findIndex(x=>x.id===id);if(ix>=0)all[ix]=done;saveAdminModuleRecords(all);portalBackendSave('admin_modules',id,done);st.textContent='RNC enviada com sucesso.';setTimeout(()=>{ov.classList.add('hidden');openRncSuccessModal(done,'RNC enviada com sucesso.');},650);
}

function applyProcessLayoutToRnc(id){const l=processLayoutById(id);if(!l)return;['tplLogoWidth','tplMetaWidth','tplHeaderHeight','tplRowHeight','tplBorderWidth','tplFontScale','tplSectionHeight'].forEach((elId,i)=>{const keys=['logoWidth','metaWidth','headerHeight','rowHeight','borderWidth','fontScale','sectionHeight'];const el=document.getElementById(elId);if(el)el.value=l.layout?.[keys[i]]??el.value});const ac=document.getElementById('tplAccent');if(ac)ac.value=l.accent||'#1f4e78';if(l.logoDataUrl){const h=document.getElementById('tplLogoData');if(h)h.value=l.logoDataUrl;const c=document.getElementById('tplLogoCurrent');if(c)c.innerHTML=`<img src="${l.logoDataUrl}" alt="Logo" style="max-width:150px;max-height:54px;object-fit:contain">`}const lt=document.getElementById('tplLogoText');if(lt)lt.value=l.logoText||'SETA';refreshRncTemplatePreview()}

function defaultRncProcessTemplate(){
  return {id:'tpl-rnc-for-cor-qua-0003',kind:'RNC',layoutId:'layout-form-seta',documentType:'Formulário',name:'RNC de fornecedor',code:'FOR-COR-QUA-0003',revision:'Vigente',title:'RELATÓRIO DE SEGREGAÇÃO',status:'active',accent:'#1f4e78',showLogo:true,logoText:'SETA',logoDataUrl:'',supplierResponseTitle:'RESPOSTA DO FORNECEDOR',supplierResponseNote:'As etapas abaixo registram somente as informações efetivamente devolvidas pelo fornecedor e podem permanecer em branco.',footerText:'',pageBreakBeforeSupplier:true,repeatHeaderOnPages:true,repeatFooterOnPages:true,headerStandard:false,footerStandard:false,sendFormat:'pdf',layout:{logoWidth:19,metaWidth:25,headerHeight:13,rowHeight:7,borderWidth:0.65,fontScale:100,sectionHeight:5},headerLayout:defaultRncHeaderLayout(),fixedImages:[],photoFields:[{id:'registro-fotografico',label:'REGISTRO FOTOGRÁFICO',maxPhotos:4,required:false,enabled:true}],fieldLayout:defaultRncFieldLayout(),updatedAt:'',sections:[
    {id:'identification',label:'IDENTIFICAÇÃO',enabled:true,owner:'sgq',align:'left'},
    {id:'blocking',label:'BLOQUEIO',enabled:true,owner:'sgq',align:'left'},
    {id:'problem',label:'DESVIO EVIDENCIADO / DESCRIÇÃO DETALHADA DA OCORRÊNCIA',enabled:true,owner:'sgq',align:'left'},
    {id:'effect',label:'EFEITO DO DESVIO',enabled:true,owner:'sgq',align:'left'},
    {id:'participants',label:'PARTICIPANTES DO PREENCHIMENTO',enabled:true,owner:'sgq',align:'left'},
    {id:'immediate',label:'AÇÕES IMEDIATAS',enabled:true,owner:'supplier',align:'left'},
    {id:'ishikawa',label:'ISHIKAWA',enabled:true,owner:'supplier',align:'left'},
    {id:'fivewhys',label:'ANÁLISE DOS 5 PORQUÊS',enabled:true,owner:'supplier',align:'left'},
    {id:'cause',label:'CONCLUSÃO DA INVESTIGAÇÃO DE CAUSA',enabled:true,owner:'supplier',align:'left'},
    {id:'corrective',label:'AÇÕES CORRETIVAS E PREVENTIVAS',enabled:true,owner:'supplier',align:'left'},
    {id:'effectiveness',label:'VERIFICAÇÃO DE EFICÁCIA',enabled:true,owner:'supplier',align:'left'},
    {id:'photos',label:'REGISTRO FOTOGRÁFICO',enabled:true,owner:'sgq',align:'left'},
    {id:'signatures',label:'ELABORADOR · VERIFICADOR · APROVADOR',enabled:true,owner:'footer',align:'left'}
  ]};
}

function normalizeRncTemplate(t){
  const d=defaultRncProcessTemplate(), src=t&&typeof t==='object'?t:{};
  const oldSecs=Array.isArray(src.sections)?src.sections:[];
  const sections=d.sections.map(ds=>{const os=oldSecs.find(x=>x.id===ds.id);const merged=os?{...ds,...os}:{...ds};if(!src.ownershipVersion&&merged.id==='signatures')merged.owner='footer';return merged;});
  const layout={...d.layout,...(src.layout||{})};
  let fieldLayout=Array.isArray(src.fieldLayout)&&src.fieldLayout.length?src.fieldLayout.map(x=>({...x})):defaultRncFieldLayout();if(Number(src.gridVersion||0)<3){const defs=defaultRncFieldLayout();const existing=new Set(fieldLayout.map(x=>x.id));defs.forEach(x=>{if(!existing.has(x.id))fieldLayout.push({...x})})}
  // Migração v4: remove a célula fantasma legado "@A" que podia surgir antes
  // do PORQUÊ 1 e normaliza os cinco campos dos 5 Porquês para ocupar 100% da linha.
  if(Number(src.gridVersion||0)<4){fieldLayout=fieldLayout.filter(x=>!(x.section==='fivewhys'&&String(x.source||'')==='@A'));const whys=fieldLayout.filter(x=>x.section==='fivewhys');if(whys.length===5)whys.forEach(x=>{x.width=20;x.row=1})}
  // Migração v2: nos modelos salvos antes do rodapé real, as três assinaturas podiam
  // continuar marcadas como fornecedor e por isso apareciam no meio da página 2.
  if(Number(src.ownershipVersion||0)<2){fieldLayout=fieldLayout.map(x=>x.section==='signatures'?{...x,owner:'footer'}:x);const sig=sections.find(x=>x.id==='signatures');if(sig)sig.owner='footer';}
  let headerLayout=Array.isArray(src.headerLayout)&&src.headerLayout.length?src.headerLayout.map(x=>({...x})):defaultRncHeaderLayout();
  if(!headerLayout.some(x=>x.source==='@logo')){headerLayout=headerLayout.map(x=>({...x,row:(Number(x.row)||1)+2}));headerLayout.unshift({id:'h-logo',row:1,label:'',value:'',source:'@logo',width:20,height:13,align:'center',bold:true},{id:'h-system',row:1,label:'',value:'SISTEMA DE GESTÃO INTEGRADO',source:'@SISTEMA DE GESTÃO INTEGRADO',width:80,height:13,align:'center',bold:true},{id:'h-form',row:2,label:'',value:'FORMULÁRIO DE REGISTRO',source:'@FORMULÁRIO DE REGISTRO',width:100,height:6,align:'center',bold:false});}
  return {...d,...src,gridVersion:4,ownershipVersion:2,layout,sections,headerLayout,logoDataUrl:String(src.logoDataUrl||''),fixedImages:Array.isArray(src.fixedImages)?src.fixedImages:[],photoFields:Array.isArray(src.photoFields)&&src.photoFields.length?src.photoFields:d.photoFields,fieldLayout};
}

function getRncProcessTemplate(){return normalizeRncTemplate(getProcessTemplates().find(x=>x.kind==='RNC'&&x.status!=='obsolete')||defaultRncProcessTemplate())}

function rncTemplateLogoHtml(t,preview=false){
  const logo=String(t.logoDataUrl||'');
  if(logo)return `<img src="${logo}" alt="Logo" style="max-width:${preview?'150':'145'}px;max-height:${preview?'54':'42'}px;object-fit:contain;display:block">`;
  return `<div style="font-size:${preview?'23':'18'}px;font-weight:900;letter-spacing:.04em;color:${escapeHtml(t.accent||'#1f4e78')}">${escapeHtml(t.logoText||'SETA')}</div>`;
}

function renderRncFixedImagesEditor(t){const a=t.fixedImages||[];return a.length?a.map((x,i)=>`<div style="display:flex;align-items:center;gap:8px;border:1px solid #e3e8f1;border-radius:9px;padding:7px;margin-bottom:6px"><img src="${x.dataUrl}" style="width:54px;height:38px;object-fit:contain;background:#fff"><input value="${escapeHtml(x.label||'Imagem fixa')}" onchange="renameRncFixedImage(${i},this.value)"><button class="btn secondary" type="button" onclick="removeRncFixedImage(${i})">Remover</button></div>`).join(''):'<div class="small">Nenhuma imagem fixa adicional.</div>'}

function addRncFixedImage(input){const f=input?.files?.[0];if(!f)return;if(f.size>1500000){alert('A imagem precisa ter até 1,5 MB.');input.value='';return}const rd=new FileReader();rd.onload=()=>{const a=getTplJson('tplFixedImagesData');a.push({id:'img-'+Date.now(),label:f.name||'Imagem fixa',dataUrl:String(rd.result||'')});setTplJson('tplFixedImagesData',a);const h=document.getElementById('tplFixedImagesList');if(h)h.innerHTML=renderRncFixedImagesEditor({fixedImages:a});input.value='';refreshRncTemplatePreview()};rd.readAsDataURL(f)}

function removeRncFixedImage(i){const a=getTplJson('tplFixedImagesData');a.splice(i,1);setTplJson('tplFixedImagesData',a);document.getElementById('tplFixedImagesList').innerHTML=renderRncFixedImagesEditor({fixedImages:a});refreshRncTemplatePreview()}

function renameRncFixedImage(i,v){const a=getTplJson('tplFixedImagesData');if(a[i])a[i].label=v;setTplJson('tplFixedImagesData',a)}

function renderRncPhotoFieldsEditor(t){const a=t.photoFields||[];return a.length?a.map((x,i)=>`<div style="display:grid;grid-template-columns:1fr 92px auto auto;gap:7px;align-items:center;border:1px solid #e3e8f1;border-radius:9px;padding:7px"><input value="${escapeHtml(x.label||'Registro fotográfico')}" onchange="updateRncPhotoField(${i},'label',this.value)"><label class="small">Máx. <input type="number" min="1" max="8" value="${Number(x.maxPhotos)||4}" onchange="updateRncPhotoField(${i},'maxPhotos',this.value)" style="padding:5px"></label><label class="small"><input type="checkbox" ${x.required?'checked':''} onchange="updateRncPhotoField(${i},'required',this.checked)" style="width:auto"> obrigatório</label><button class="btn secondary" type="button" onclick="removeRncPhotoField(${i})">Remover</button></div>`).join(''):'<div class="small">Nenhum campo de foto no modelo.</div>'}

function addRncPhotoField(){const a=getTplJson('tplPhotoFieldsData');a.push({id:'foto-'+Date.now(),label:'REGISTRO FOTOGRÁFICO',maxPhotos:4,required:false,enabled:true});setTplJson('tplPhotoFieldsData',a);document.getElementById('tplPhotoFieldsList').innerHTML=renderRncPhotoFieldsEditor({photoFields:a});refreshRncTemplatePreview()}

function updateRncPhotoField(i,k,v){const a=getTplJson('tplPhotoFieldsData');if(!a[i])return;a[i][k]=k==='maxPhotos'?Math.max(1,Math.min(8,Number(v)||1)):v;setTplJson('tplPhotoFieldsData',a);refreshRncTemplatePreview()}

function removeRncPhotoField(i){const a=getTplJson('tplPhotoFieldsData');a.splice(i,1);setTplJson('tplPhotoFieldsData',a);document.getElementById('tplPhotoFieldsList').innerHTML=renderRncPhotoFieldsEditor({photoFields:a});refreshRncTemplatePreview()}

function rncTemplateMediaPreview(t){const fixed=(t.fixedImages||[]).map(x=>`<div style="padding:7px;border-bottom:1px solid #555;text-align:center"><div style="font-size:7px;font-weight:700;margin-bottom:4px">${escapeHtml(x.label||'IMAGEM')}</div><img src="${x.dataUrl}" style="max-width:90%;max-height:70px;object-fit:contain"></div>`).join('');const photos=(t.photoFields||[]).map(x=>`<div style="padding:7px;border-bottom:1px solid #555"><b style="font-size:8px">${escapeHtml(x.label)}</b><div style="display:grid;grid-template-columns:repeat(${Math.min(4,Number(x.maxPhotos)||4)},1fr);gap:4px;margin-top:6px">${Array.from({length:Math.min(4,Number(x.maxPhotos)||4)},()=>'<div style="height:38px;border:1px dashed #9aa4b2;background:#fafafa"></div>').join('')}</div></div>`).join('');return fixed+photos}

function rncPhotoInputsHtml(){const t=getRncProcessTemplate();return (t.photoFields||[]).map(f=>`<div style="grid-column:1/-1;border:1px solid #d9e1ee;border-radius:12px;padding:12px"><b>${escapeHtml(f.label)}</b><div class="small">Até ${Number(f.maxPhotos)||4} foto(s)${f.required?' · obrigatório':''}. Elas entram automaticamente no PDF.</div><input type="file" accept="image/*" multiple data-rnc-photo-field="${escapeHtml(f.id)}" data-max="${Number(f.maxPhotos)||4}" style="margin-top:8px"><input type="hidden" id="rncPhotos_${escapeHtml(f.id)}" value="[]"></div>`).join('')}

function collectRncPhotos(){const out={};document.querySelectorAll('[data-rnc-photo-field]').forEach(inp=>{const id=inp.dataset.rncPhotoField;const hidden=document.getElementById('rncPhotos_'+id);try{out[id]=JSON.parse(hidden?.value||'[]')}catch(e){out[id]=[]}});return out}

function compressRncPhotoPreview(file){
  return new Promise((resolve,reject)=>{
    const rd=new FileReader();
    rd.onload=()=>{
      const im=new Image();
      im.onload=()=>{
        const max=320,scale=Math.min(1,max/Math.max(im.width,im.height));
        const c=document.createElement('canvas');
        c.width=Math.max(1,Math.round(im.width*scale));
        c.height=Math.max(1,Math.round(im.height*scale));
        c.getContext('2d').drawImage(im,0,0,c.width,c.height);
        resolve(c.toDataURL('image/jpeg',.5));
      };
      im.onerror=reject;
      im.src=rd.result;
    };
    rd.onerror=reject;
    rd.readAsDataURL(file);
  });
}

async function uploadRncPhotoOnline(dataUrl,fieldId){
  if(!navigator.onLine)throw new Error('A foto precisa ser enviada com conexão à internet.');
  if(!portalBackendEnabled())throw new Error('Apps Script não configurado para salvar a foto.');

  if(!window.__rncPhotoUploadKey)window.__rncPhotoUploadKey='RNC-TEMP-'+Date.now();
  const eventoId='RNCPHOTO-'+Date.now()+'-'+Math.random().toString(36).slice(2,9);

  const ok=portalPostForm({
    acao:'portal_upload_rnc_photo',
    eventoId,
    rncKey:window.__rncPhotoUploadKey,
    campoId:String(fieldId||'foto'),
    fileData:String(dataUrl||''),
    ator:getSession()?.name||'SGQ'
  });
  if(!ok)throw new Error('Não foi possível iniciar o envio da foto.');

  const started=Date.now();
  while(Date.now()-started<120000){
    await new Promise(resolve=>setTimeout(resolve,900));
    const st=await portalJsonp({acao:'portal_rnc_photo_status',eventoId},12000).catch(()=>null);
    if(st?.status==='done'&&st?.photo?.fileId)return st.photo;
    if(st?.status==='error')throw new Error(st.erro||'Falha ao gravar a foto no Drive.');
  }
  throw new Error('A foto não foi confirmada no Drive dentro do tempo esperado.');
}

function bindRncPhotoInputs(existing={}){
  document.querySelectorAll('[data-rnc-photo-field]').forEach(inp=>{
    const id=inp.dataset.rncPhotoField,h=document.getElementById('rncPhotos_'+id);
    let saved=Array.isArray(existing[id])?existing[id]:[];
    if(h)h.value=JSON.stringify(saved);

    let info=inp.parentElement?.querySelector('[data-rnc-photo-info]');
    if(!info){
      info=document.createElement('div');
      info.dataset.rncPhotoInfo='1';
      info.className='small';
      info.style.marginTop='6px';
      inp.insertAdjacentElement('afterend',info);
    }

    let preview=inp.parentElement?.querySelector('[data-rnc-photo-preview]');
    if(!preview){
      preview=document.createElement('div');
      preview.dataset.rncPhotoPreview='1';
      preview.style.cssText='display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:8px';
      info.insertAdjacentElement('afterend',preview);
    }

    const updateInfo=(message='',state='neutral')=>{
      let a=[];try{a=JSON.parse(h?.value||'[]')}catch(e){}

      const defaultText=a.length
        ? `${a.length} foto(s) salva(s) online nesta RNC.`
        : 'Nenhuma foto salva ainda.';

      info.textContent=message||defaultText;
      info.style.fontWeight=state==='success'||state==='error'?'700':'400';
      info.style.color=
        state==='success'?'#18794e':
        state==='error'?'#b42318':
        state==='sending'?'#7a5a00':'';

      preview.innerHTML=a.map((photo,i)=>{
        const src=rncPhotoSrc(photo);
        return src?`<div style="position:relative;border:1px solid #d8e0ec;border-radius:8px;padding:4px;background:#fff"><img src="${escapeHtml(src)}" style="display:block;width:100%;height:90px;object-fit:contain"><button type="button" class="btn danger" onclick="removeRncPhoto('${escapeHtml(id)}',${i})" style="position:absolute;right:4px;top:4px;padding:3px 6px;font-size:10px">×</button></div>`:'';
      }).join('');
    };

    updateInfo();

    inp.onchange=async()=>{
      const max=Number(inp.dataset.max)||4;
      let arr=[];try{arr=JSON.parse(h?.value||'[]')}catch(e){}
      const files=[...(inp.files||[])];

      if(!files.length)return;

      inp.disabled=true;
      let onlineAgora=0;
      let pendentesAgora=0;

      try{
        for(const f of files){
          if(arr.length>=max){
            updateInfo(`Limite de ${max} foto(s) atingido.`, 'error');
            break;
          }

          if(f.size>2500000){
            updateInfo(`A foto "${f.name}" é maior que 2,5 MB e não foi adicionada.`, 'error');
            alert('Cada foto precisa ter até 2,5 MB.');
            continue;
          }

          // A miniatura aparece imediatamente. O usuário não fica preso
          // olhando apenas "Enviando..." sem saber se a foto foi registrada.
          updateInfo(`Preparando "${f.name}"...`, 'sending');

          const [dataUrl,previewDataUrl]=await Promise.all([
            compressRncPhoto(f),
            compressRncPhotoPreview(f)
          ]);

          let savedPhoto=null;

          try{
            updateInfo(`Enviando "${f.name}" para o Drive...`, 'sending');

            // Não deixa a interface ficar indefinidamente em "Enviando".
            // Se a confirmação direta demorar, a foto fica guardada no
            // próprio registro e o backend conclui o upload quando a RNC for salva.
            savedPhoto=await Promise.race([
              uploadRncPhotoOnline(dataUrl,id),
              new Promise((_,reject)=>setTimeout(
                ()=>reject(new Error('A confirmação online demorou mais que o esperado.')),
                18000
              ))
            ]);
          }catch(uploadErr){
            savedPhoto=null;
          }

          if(savedPhoto?.fileId){
            arr.push({...savedPhoto,previewDataUrl});
            onlineAgora++;
            updateInfo(
              `✓ "${f.name}" salva no Drive com sucesso.`,
              'success'
            );
          }else{
            // Fallback seguro: mantém a foto dentro da RNC. O Apps Script já
            // converte dataUrl em arquivo do Drive durante o salvamento da RNC.
            arr.push({
              dataUrl,
              previewDataUrl,
              name:f.name,
              mimeType:f.type||'image/jpeg',
              pendingDriveUpload:true
            });
            pendentesAgora++;
            updateInfo(
              `✓ "${f.name}" adicionada à RNC. O Drive será confirmado ao salvar a RNC.`,
              'success'
            );
          }

          arr=arr.slice(0,max);
          if(h)h.value=JSON.stringify(arr);
          updateInfo(
            onlineAgora
              ? `✓ Foto confirmada no Drive. Total nesta RNC: ${arr.length}.`
              : `✓ Foto adicionada. Ela será enviada ao Drive quando você salvar a RNC.`,
            'success'
          );
        }

        if(onlineAgora>1){
          updateInfo(`✓ ${onlineAgora} fotos confirmadas no Drive.`, 'success');
        }else if(pendentesAgora>1){
          updateInfo(`✓ ${pendentesAgora} fotos adicionadas. O Drive será confirmado ao salvar a RNC.`, 'success');
        }
      }catch(e){
        const msg=String(e?.message||e||'Erro desconhecido');
        updateInfo(`✕ Não foi possível adicionar a foto: ${msg}`, 'error');
        alert('Não foi possível adicionar a foto.\n\n'+msg);
      }finally{
        inp.value='';
        inp.disabled=false;
      }
    };
  });
}

function removeRncPhoto(fieldId,index){
  const h=document.getElementById('rncPhotos_'+fieldId);if(!h)return;
  let arr=[];try{arr=JSON.parse(h.value||'[]')}catch(e){}
  arr.splice(index,1);
  h.value=JSON.stringify(arr);
  bindRncPhotoInputs({[fieldId]:arr});
}

function compressRncPhoto(file){return new Promise((resolve,reject)=>{const rd=new FileReader();rd.onload=()=>{const im=new Image();im.onload=()=>{const max=900,scale=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(im.width*scale));c.height=Math.max(1,Math.round(im.height*scale));c.getContext('2d').drawImage(im,0,0,c.width,c.height);resolve(c.toDataURL('image/jpeg',.65))};im.onerror=reject;im.src=rd.result};rd.onerror=reject;rd.readAsDataURL(file)})}

function defaultRncHeaderLayout(){return [
{id:'h-logo',row:1,label:'',value:'',source:'@logo',width:20,height:13,align:'center',bold:true},
{id:'h-system',row:1,label:'',value:'SISTEMA DE GESTÃO INTEGRADO',source:'@SISTEMA DE GESTÃO INTEGRADO',width:80,height:13,align:'center',bold:true},
{id:'h-form',row:2,label:'',value:'FORMULÁRIO DE REGISTRO',source:'@FORMULÁRIO DE REGISTRO',width:100,height:6,align:'center',bold:false},
{id:'h-title-label',row:3,label:'Título:',value:'',source:'@label',width:10,height:7,align:'left',bold:true},
{id:'h-title',row:3,label:'',value:'RELATÓRIO DE SEGREGAÇÃO',source:'title',width:52,height:7,align:'center',bold:true},
{id:'h-code',row:3,label:'Código',value:'',source:'code',width:19,height:7,align:'left',bold:false},
{id:'h-revision',row:3,label:'Revisão',value:'',source:'revision',width:19,height:7,align:'left',bold:false},
{id:'h-area-label',row:4,label:'Área:',value:'',source:'@label',width:10,height:7,align:'left',bold:true},
{id:'h-area',row:4,label:'',value:'QUALIDADE',source:'@QUALIDADE',width:52,height:7,align:'left',bold:false},
{id:'h-register',row:4,label:'Registro',value:'',source:'@RNC-2026-0001',width:19,height:7,align:'left',bold:false},
{id:'h-page',row:4,label:'Página',value:'',source:'@1 de 1',width:19,height:7,align:'left',bold:false}
]}

function rncHeaderFields(){return getTplJson('tplHeaderLayoutData',defaultRncHeaderLayout())}

function saveRncHeaderFields(a){setTplJson('tplHeaderLayoutData',a);const h=document.getElementById('tplHeaderLayoutList');if(h)h.innerHTML=renderRncHeaderLayoutEditor({...collectRncTemplateForm(),headerLayout:a});refreshRncTemplatePreview()}

function updateRncHeaderField(i,k,v){const a=rncHeaderFields();if(!a[i])return;if(['width','height'].includes(k))v=Math.max(k==='width'?5:3,Number(v)||0);a[i][k]=v;saveRncHeaderFields(a)}

function updateRncHeaderValue(i,v){
  const a=rncHeaderFields();
  if(!a[i])return;

  const src=String(a[i].source||'');

  if(src==='code'){
    const el=document.getElementById('tplCode');
    if(el)el.value=v;
  }else if(src==='revision'){
    const el=document.getElementById('tplRevision');
    if(el)el.value=v;
  }else if(src==='title'){
    const el=document.getElementById('tplTitle');
    if(el)el.value=v;
  }else if(src==='@logo'){
    return;
  }else{
    // Valores literais do cabeçalho ficam guardados como @texto.
    a[i].source='@'+String(v||'');
    setTplJson('tplHeaderLayoutData',a);
  }

  // Atualiza a folha sem recriar o input onde a pessoa está digitando.
  refreshRncTemplatePreview();
}

function renderRncHeaderLayoutEditor(t){const a=t.headerLayout||defaultRncHeaderLayout();const rows=[...new Set(a.map(x=>Number(x.row)||1))].sort((x,y)=>x-y);return `<div class="small" style="margin-bottom:8px;padding:8px 10px;border:1px solid #dbe4ee;border-radius:8px;background:#f8fafc"><b>Mesclagem:</b> horizontal une com a célula à direita. A mesclagem vertical só é permitida quando as bordas estão alinhadas. Se a célula estiver mesclada para cima/baixo, <b>Dividir</b> desfaz primeiro a mesclagem vertical.</div><div style="display:flex;gap:7px;flex-wrap:wrap;margin-bottom:10px"><button type="button" class="btn secondary" onclick="addRncHeaderCell()">+ Célula</button><button type="button" class="btn secondary" onclick="addRncHeaderRow()">+ Linha</button></div>`+rows.map(row=>`<div style="border:1px solid #d7deea;border-radius:12px;padding:10px;background:#f8fafc"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><b style="font-size:12px">Linha ${row}</b><button type="button" class="btn secondary" style="padding:6px 9px" onclick="addRncHeaderCell(${row})">+ célula nesta linha</button></div><div style="display:grid;gap:8px">${a.map((x,i)=>({x,i})).filter(o=>(Number(o.x.row)||1)===row).map(({x,i})=>`<div style="border:1px solid #e3e8f1;border-radius:10px;padding:10px;background:#fff"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center;margin-bottom:8px"><b style="font-size:12px">${escapeHtml(x.label||x.value||('Célula '+(i+1)))}</b><div style="display:flex;gap:5px;flex-wrap:wrap"><button type="button" class="btn secondary" style="padding:5px 8px" onclick="mergeRncHeaderCell(${i})">Mesclar →</button><button type="button" class="btn secondary" style="padding:5px 8px" onclick="splitRncHeaderCell(${i})">Dividir</button><button type="button" class="btn danger" style="padding:5px 8px" onclick="removeRncHeaderCellById('${x.id}',event)">Excluir</button></div></div><div style="display:grid;grid-template-columns:minmax(140px,1.3fr) minmax(140px,1fr) 90px 90px 115px;gap:7px;align-items:end"><label><span class="small">Texto / rótulo</span><input value="${escapeHtml(x.label||'')}" oninput="updateRncHeaderField(${i},'label',this.value)"></label><label><span class="small">Valor</span><input value="${escapeHtml(
  x.source==='code' ? (t.code||'') :
  x.source==='revision' ? (t.revision||'') :
  x.source==='title' ? (t.title||'') :
  String(x.source||'').startsWith('@')&&x.source!=='@label'&&x.source!=='@logo' ? String(x.source).slice(1) :
  (x.value||'')
)}" ${x.source==='@logo'?'disabled':''} oninput="updateRncHeaderValue(${i},this.value)"></label><label><span class="small">Largura %</span><input type="number" min="3" max="100" step="1" value="${Number(x.width)||20}" oninput="updateRncHeaderField(${i},'width',this.value)"></label><label><span class="small">Altura mm</span><input type="number" min="3" max="50" step="1" value="${Number(x.height)||7}" oninput="updateRncHeaderField(${i},'height',this.value)"></label><label><span class="small">Alinhamento</span><select onchange="updateRncHeaderField(${i},'align',this.value)"><option value="left" ${x.align==='left'?'selected':''}>Esquerda</option><option value="center" ${x.align==='center'?'selected':''}>Centro</option><option value="right" ${x.align==='right'?'selected':''}>Direita</option></select></label></div></div>`).join('')}</div></div>`).join('')}

function nextRncHeaderId(){return 'h-custom-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,6)}

function addRncHeaderCell(row){const a=rncHeaderFields();row=Number(row)||Math.max(1,...a.map(x=>Number(x.row)||1));const same=a.filter(x=>(Number(x.row)||1)===row);const width=same.length?Math.max(5,Math.round(100/(same.length+1))):100;if(same.length)same.forEach(x=>x.width=Math.max(5,(Number(x.width)||20)*same.length/(same.length+1)));a.push({id:nextRncHeaderId(),row,label:'Novo campo',value:'',source:'@',width,height:7,align:'left',bold:false});saveRncHeaderFields(a)}

function addRncHeaderRow(){const a=rncHeaderFields(),row=Math.max(0,...a.map(x=>Number(x.row)||1))+1;a.push({id:nextRncHeaderId(),row,label:'Novo campo',value:'',source:'@',width:100,height:7,align:'left',bold:false});saveRncHeaderFields(a)}

function removeRncHeaderCell(i){
  const a=rncHeaderFields();
  const x=a[i];
  if(!x)return;
  removeRncHeaderCellById(x.id);
}

function removeRncHeaderCellById(id,ev){
  if(ev){
    ev.preventDefault();
    ev.stopPropagation();
  }

  const a=rncHeaderFields();
  const idx=a.findIndex(x=>String(x.id)===String(id));
  if(idx<0)return;

  const removida=a[idx];
  const row=Number(removida.row)||1;

  a.splice(idx,1);

  // Reequilibra somente as células que sobraram na mesma linha.
  const same=a.filter(v=>(Number(v.row)||1)===row);
  if(same.length){
    const total=same.reduce((sum,v)=>sum+(Number(v.width)||20),0)||100;
    same.forEach(v=>{
      v.width=((Number(v.width)||20)/total)*100;
    });
  }

  // Grava diretamente no hidden que é a fonte real do editor.
  const hidden=document.getElementById('tplHeaderLayoutData');
  if(hidden)hidden.value=JSON.stringify(a);

  // Se a célula excluída estava selecionada, limpa a seleção.
  if(String(rncGridSelectedHeaderId||'')===String(id)){
    rncGridSelectedHeaderId='';
  }

  // Atualiza imediatamente a lista e a folha.
  const list=document.getElementById('tplHeaderLayoutList');
  if(list){
    const t=collectRncTemplateForm();
    t.headerLayout=a;
    list.innerHTML=renderRncHeaderLayoutEditor(t);
  }

  refreshRncTemplatePreview();
}

function mergeRncHeaderCell(i){
  const a=rncHeaderFields(),x=a[i];
  if(!x)return;

  const row=a
    .map((v,idx)=>({v,idx}))
    .filter(o=>(Number(o.v.row)||1)===(Number(x.row)||1) && !o.v.mergedInto);

  const pos=row.findIndex(o=>o.v.id===x.id);
  const right=row[pos+1]?.v;
  if(!right)return alert('Não há célula à direita para mesclar.');

  // Não mistura horizontalmente células que já ocupam quantidades diferentes de linhas.
  const xs=Math.max(1,Number(x.rowSpan)||1);
  const rs=Math.max(1,Number(right.rowSpan)||1);
  if(xs!==rs){
    alert('Estas células não podem ser mescladas porque possuem alturas de mesclagem diferentes. Divida a mesclagem vertical primeiro.');
    return;
  }

  x.width=(Number(x.width)||20)+(Number(right.width)||20);
  const ri=a.findIndex(v=>v.id===right.id);
  if(ri>=0)a.splice(ri,1);
  saveRncHeaderFields(a);
}

function rncHeaderRestoreVerticalSplit(a,x){
  const span=Math.max(1,Number(x.rowSpan)||1);
  if(span<=1)return false;

  const sourceRow=Number(x.row)||1;
  const sourceRowCells=a.filter(v=>(Number(v.row)||1)===sourceRow && !v.mergedInto);
  const sourceTotal=sourceRowCells.reduce((s,v)=>s+(Number(v.width)||20),0)||100;
  let left=0;
  for(const v of sourceRowCells){
    if(v.id===x.id)break;
    left+=(Number(v.width)||20)/sourceTotal*100;
  }

  const backups=Array.isArray(x.verticalMergeBackup)?x.verticalMergeBackup.slice():[];

  for(let rr=sourceRow+1;rr<sourceRow+span;rr++){
    const backupIndex=backups.findIndex(b=>Number(b?.cell?.row||b?.row||0)===rr);
    if(backupIndex>=0){
      const backup=backups[backupIndex];
      const cell={...(backup.cell||{})};
      delete cell.mergedInto;
      if(!a.some(v=>String(v.id)===String(cell.id))){
        const insertAt=Math.max(0,Math.min(a.length,Number(backup.index)));
        a.splice(insertAt,0,cell);
      }
      backups.splice(backupIndex,1);
      continue;
    }

    // Compatibilidade com mesclagens antigas, que apagavam a célula inferior.
    // Recria uma célula vazia exatamente na largura/posição ocupada pela mesclagem.
    const rowCells=a
      .map((v,idx)=>({v,idx}))
      .filter(o=>(Number(o.v.row)||1)===rr && !o.v.mergedInto);

    let cumulative=0,insertAt=a.length;
    for(const o of rowCells){
      const w=Number(o.v.width)||20;
      if(cumulative>=left-.5){insertAt=o.idx;break}
      cumulative+=w;
      insertAt=o.idx+1;
    }

    a.splice(insertAt,0,{
      id:nextRncHeaderId(),
      row:rr,
      label:'',
      value:'',
      source:'@',
      width:Number(x.width)||20,
      height:Number(x.height)||7,
      align:x.align||'left',
      bold:false
    });
  }

  x.rowSpan=1;
  delete x.verticalMergeBackup;
  return true;
}

function splitRncHeaderCell(i){
  const a=rncHeaderFields(),x=a[i];
  if(!x)return;

  // Se a célula está mesclada verticalmente, "Dividir" desfaz primeiro
  // essa mesclagem, em vez de criar outra coluna ao lado.
  if(rncHeaderRestoreVerticalSplit(a,x)){
    saveRncHeaderFields(a);
    return;
  }

  const w=Math.max(6,Number(x.width)||20);
  x.width=w/2;
  const ni=a.findIndex(v=>v.id===x.id)+1;
  a.splice(ni,0,{
    id:nextRncHeaderId(),
    row:Number(x.row)||1,
    label:'',
    value:'',
    source:'@',
    width:w/2,
    height:Number(x.height)||7,
    align:x.align||'left',
    bold:false
  });
  saveRncHeaderFields(a);
}

function rncHeaderValue(t,x,preview=true,obj={}){const src=String(x.source||'');if(src==='@logo')return '__RNC_LOGO__';if(src==='title')return t.title||'';if(src==='code')return t.code||'';if(src==='revision')return t.revision||'';if(src==='@label')return '';if(src.startsWith('@')){const v=src.slice(1);if(x.id==='h-register'&&!preview)return obj.rncNumber||'—';return v}return x.value||''}

function selectRncHeaderCell(id){rncGridSelectedFieldId='';rncGridSelectedHeaderId=id||'';refreshRncTemplatePreview();const a=rncHeaderFields();const list=document.getElementById('tplHeaderLayoutList');if(list)list.innerHTML=renderRncHeaderLayoutEditor({...collectRncTemplateForm(),headerLayout:a})}

function selectedRncHeaderCell(){return rncHeaderFields().find(x=>x.id===rncGridSelectedHeaderId)||null}

function rncHeaderIndexBySelected(){return rncHeaderFields().findIndex(x=>x.id===rncGridSelectedHeaderId)}

function rncHeaderAdjustWidth(delta){const a=rncHeaderFields(),x=a.find(v=>v.id===rncGridSelectedHeaderId);if(!x)return;const row=a.filter(v=>(Number(v.row)||1)===(Number(x.row)||1)),i=row.findIndex(v=>v.id===x.id),right=row[i+1];if(right){const min=5,total=(Number(x.width)||20)+(Number(right.width)||20),nw=Math.max(min,Math.min(total-min,(Number(x.width)||20)+delta));x.width=nw;right.width=total-nw}else{x.width=Math.max(5,Math.min(100,(Number(x.width)||20)+delta))}saveRncHeaderFields(a)}

function rncHeaderAdjustHeight(delta){const a=rncHeaderFields(),x=a.find(v=>v.id===rncGridSelectedHeaderId);if(!x)return;const row=Number(x.row)||1,h=Math.max(3,Math.min(60,(Number(x.height)||7)+delta));a.filter(v=>(Number(v.row)||1)===row).forEach(v=>v.height=h);saveRncHeaderFields(a)}

function rncHeaderMergeSelected(){const i=rncHeaderIndexBySelected();if(i>=0)mergeRncHeaderCell(i)}

function rncHeaderCellBounds(a,x){
  const row=a.filter(v=>(Number(v.row)||1)===(Number(x.row)||1) && !v.mergedInto);
  const total=row.reduce((s,v)=>s+(Number(v.width)||20),0)||100;
  let cur=0;
  for(const v of row){
    const w=(Number(v.width)||20)/total*100;
    if(v.id===x.id)return [cur,cur+w];
    cur+=w;
  }
  return [0,100];
}

function rncHeaderMergeVertical(dir){
  const a=rncHeaderFields(),x=a.find(v=>v.id===rncGridSelectedHeaderId);
  if(!x)return;

  const row=Number(x.row)||1;
  const span=Math.max(1,Number(x.rowSpan)||1);
  const targetRow=dir<0?row-1:row+span;
  if(targetRow<1)return alert('Não há linha acima para mesclar.');

  const candidates=a.filter(v=>(Number(v.row)||1)===targetRow && !v.mergedInto);
  if(!candidates.length){
    return alert(dir<0?'Não há célula acima para mesclar.':'Não há célula abaixo para mesclar.');
  }

  const [l,r]=rncHeaderCellBounds(a,x);
  let best=null,bestDelta=Infinity;

  for(const v of candidates){
    const [vl,vr]=rncHeaderCellBounds(a,v);
    const delta=Math.abs(vl-l)+Math.abs(vr-r);
    if(delta<bestDelta){bestDelta=delta;best=v}
  }

  // Mesclagem vertical só é permitida quando as bordas realmente coincidem.
  // Isso evita engolir parte de Código/Revisão/Página ou deslocar a linha inferior.
  if(!best || bestDelta>2.5){
    alert('As células não estão alinhadas para uma mesclagem vertical. Ajuste as larguras primeiro para que as bordas coincidam.');
    return;
  }

  if(!confirm(`Mesclar “${x.label||'célula'}” ${dir<0?'para cima':'para baixo'}?`))return;

  const bi=a.findIndex(v=>v.id===best.id);
  const backup={cell:{...best},index:bi};

  if(dir<0){
    // A célula selecionada passa a ocupar a linha de cima e a linha original.
    const xi=a.findIndex(v=>v.id===x.id);
    const xBackup={...x};
    if(bi>=0)a.splice(bi,1);
    x.row=targetRow;
    x.rowSpan=span+1;
    x.verticalMergeBackup=[...(Array.isArray(x.verticalMergeBackup)?x.verticalMergeBackup:[]),backup];
    // Mantém a ordem visual da célula selecionada próxima da posição original.
    const nowIndex=a.findIndex(v=>v.id===x.id);
    if(nowIndex>=0 && xi>=0 && nowIndex!==xi){
      const [moved]=a.splice(nowIndex,1);
      a.splice(Math.min(xi,a.length),0,moved);
    }
  }else{
    if(bi>=0)a.splice(bi,1);
    x.rowSpan=span+1;
    x.verticalMergeBackup=[...(Array.isArray(x.verticalMergeBackup)?x.verticalMergeBackup:[]),backup];
  }

  saveRncHeaderFields(a);
}

function rncHeaderMergeUp(){rncHeaderMergeVertical(-1)}

function rncHeaderMergeDown(){rncHeaderMergeVertical(1)}

function rncHeaderSplitSelected(){const i=rncHeaderIndexBySelected();if(i>=0)splitRncHeaderCell(i)}

function rncHeaderDeleteSelected(){const x=selectedRncHeaderCell();if(!x)return;removeRncHeaderCellById(x.id);}

function rncHeaderAddCellSelected(){const x=selectedRncHeaderCell();addRncHeaderCell(x?Number(x.row)||1:undefined)}

function rncHeaderAddRowSelected(){addRncHeaderRow()}

function rncHeaderRowsHtml(t,preview=true,obj={}){const a=t.headerLayout||defaultRncHeaderLayout(),bw=Math.max(.4,Number(t.layout?.borderWidth)||.65),fs=(Number(t.layout?.fontScale)||100)/100,rows=[...new Set(a.map(x=>Number(x.row)||1))].sort((a,b)=>a-b);if(!rows.length)return'';const maxRow=Math.max(...rows,...a.map(x=>(Number(x.row)||1)+Math.max(1,Number(x.rowSpan)||1)-1));const rowHeights=Array.from({length:maxRow},(_,i)=>{const rr=i+1,c=a.filter(x=>(Number(x.row)||1)===rr);return Math.max(3,...c.map(x=>Number(x.height)||7))});const positions=new Map(),occupied={};for(let rr=1;rr<=maxRow;rr++){const blocks=(occupied[rr]||[]).sort((u,v)=>u[0]-v[0]);const cells=a.filter(x=>(Number(x.row)||1)===rr);let free=[];let cursor=0;for(const b of blocks){if(b[0]>cursor)free.push([cursor,b[0]]);cursor=Math.max(cursor,b[1])}if(cursor<100)free.push([cursor,100]);const freeTotal=free.reduce((s,z)=>s+z[1]-z[0],0)||100,total=cells.reduce((s,x)=>s+(Number(x.width)||20),0)||100;let freePos=0,seg=0,segPos=free[0]?.[0]||0;for(const x of cells){let want=(Number(x.width)||20)/total*freeTotal,left=null,right=null;while(want>.001&&seg<free.length){const [sl,sr]=free[seg];segPos=Math.max(segPos,sl);const avail=sr-segPos;if(avail<=.001){seg++;segPos=free[seg]?.[0]||100;continue}const take=Math.min(want,avail);if(left===null)left=segPos;right=segPos+take;segPos+=take;want-=take;if(segPos>=sr-.001){seg++;segPos=free[seg]?.[0]||100}}if(left===null){left=0;right=0}positions.set(x.id,[left,right]);const sp=Math.max(1,Number(x.rowSpan)||1);if(sp>1)for(let z=1;z<sp;z++){(occupied[rr+z]||(occupied[rr+z]=[])).push([left,right])}}}const rowTpl=rowHeights.map(h=>preview?`minmax(${h*4.2}px,auto)`:`minmax(${h}mm,auto)`).join(' ');return `<div data-rnc-header-grid="1" style="display:grid;grid-template-columns:repeat(1000,minmax(0,1fr));grid-template-rows:${rowTpl};border-bottom:${bw}px solid #111">${a.map(x=>{const i=a.findIndex(z=>z.id===x.id),v=rncHeaderValue(t,x,preview,obj),al=['left','center','right'].includes(x.align)?x.align:'left',[l,r]=positions.get(x.id)||[0,100],cs=Math.max(1,Math.round(l*10)+1),ce=Math.max(cs+1,Math.round(r*10)+1),rs=Number(x.row)||1,re=Math.min(maxRow+1,rs+Math.max(1,Number(x.rowSpan)||1));const label=x.label?`<b ${preview?`contenteditable="true" spellcheck="false" oninput="previewEditRncHeader(${i},'label',this.textContent)" onclick="event.stopPropagation();selectRncHeaderCell('${x.id}')"`:''} style="font-size:${6.7*fs}px;outline:none">${escapeHtml(x.label)}</b>`:'';const value=v==='__RNC_LOGO__'?rncTemplateLogoHtml(t,preview):(v?`<span ${preview&&String(x.source||'').startsWith('@')&&x.source!=='@logo'?`contenteditable="true" spellcheck="false" oninput="previewEditRncHeader(${i},'source','@'+this.textContent)" onclick="event.stopPropagation();selectRncHeaderCell('${x.id}')"`:''} style="font-size:${7.4*fs}px;${x.bold?'font-weight:800;':''};outline:none">${escapeHtml(v)}</span>`:'');const selected=preview&&x.id===rncGridSelectedHeaderId;return `<div data-rnc-header-cell="${x.id}" ${preview?`onclick="selectRncHeaderCell('${x.id}')"`:''} style="grid-column:${cs}/${ce};grid-row:${rs}/${re};position:relative;min-width:0;overflow:hidden;overflow-wrap:anywhere;word-break:break-word;white-space:normal;padding:${preview?'4px 5px':'1mm'};border-right:${bw}px solid #777;border-top:${rs>1?bw:0}px solid #777;text-align:${al};display:flex;${x.label&&v?'flex-direction:column;gap:2px;':'align-items:center;'}justify-content:${al==='center'?'center':al==='right'?'flex-end':'flex-start'};${selected?'box-shadow:inset 0 0 0 2px #2f6fed;background:#eef5ff;':''};cursor:${preview?'pointer':'default'}">${label}${value}${preview?`<span onpointerdown="startRncHeaderResize(event,'${x.id}')" style="position:absolute;right:-4px;top:0;width:8px;height:100%;cursor:col-resize;z-index:5" title="Arraste para dimensionar"></span>`:''}</div>`}).join('')}</div>`}

function previewEditRncHeader(i,k,v){const a=rncHeaderFields();if(!a[i])return;a[i][k]=String(v||'');setTplJson('tplHeaderLayoutData',a)}

function startRncHeaderResize(ev,id){ev.preventDefault();ev.stopPropagation();const a=rncHeaderFields(),x=a.find(v=>v.id===id);if(!x)return;const row=a.filter(v=>(Number(v.row)||1)===(Number(x.row)||1)),idx=row.findIndex(v=>v.id===id),right=row[idx+1];if(!right)return;const rowEl=ev.currentTarget.closest('[data-rnc-header-grid]'),startX=ev.clientX,startW=Number(x.width)||20,startR=Number(right.width)||20,total=startW+startR,w=rowEl?.getBoundingClientRect().width||600,min=5;const move=e=>{const d=((e.clientX-startX)/w)*row.reduce((s,v)=>s+(Number(v.width)||20),0),nw=Math.max(min,Math.min(total-min,startW+d));x.width=nw;right.width=total-nw;setTplJson('tplHeaderLayoutData',a);refreshRncTemplatePreview()};const up=()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);saveRncHeaderFields(a)};window.addEventListener('pointermove',move);window.addEventListener('pointerup',up)}

function defaultRncFieldLayout(){return [
{id:'responsavel',section:'identification',label:'Responsável',source:'rncReporter',width:25,row:1,display:'inline'},{id:'turno',section:'identification',label:'Turno',source:'rncShift',width:17,row:1,display:'inline'},{id:'abertura',section:'identification',label:'Data da Abertura',source:'eventDate',width:25,row:1,display:'inline'},{id:'tipo',section:'identification',label:'TIPO DE OCORRÊNCIA',source:'@RNC',width:33,row:1,display:'stack'},
{id:'supervisor',section:'identification',label:'Supervisor da área',source:'rncSupervisor',width:34,row:2,display:'inline'},{id:'gerente',section:'identification',label:'Gerente da área',source:'rncManager',width:33,row:2,display:'inline'},{id:'registro',section:'identification',label:'N° DE REGISTRO',source:'rncNumber',width:33,row:2,display:'inline'},
{id:'fornecedor',section:'blocking',label:'Fornecedor',source:'supplier',width:22,row:1,display:'inline'},{id:'nf',section:'blocking',label:'Nota Fiscal',source:'rncInvoice',width:13,row:1,display:'inline'},{id:'emissao',section:'blocking',label:'Data da emissão',source:'rncIssueDate',width:16,row:1,display:'inline'},{id:'codigo',section:'blocking',label:'Código do produto',source:'rncProductCode',width:16,row:1,display:'inline'},{id:'qtd',section:'blocking',label:'Qtd. Não Conforme',source:'rncQuantity',width:16,row:1,display:'stack'},{id:'disp',section:'blocking',label:'Disposição',source:'rncDisposition',width:17,row:1,display:'inline'},
{id:'produto',section:'blocking',label:'Produto / descrição',source:'rncProduct',width:28,row:2,display:'inline'},{id:'dim',section:'blocking',label:'Dimensões / especificação',source:'rncDimensions',width:24,row:2,display:'stack'},{id:'area',section:'blocking',label:'Área responsável pelo Bloqueio',source:'rncBlockArea',width:28,row:2,display:'stack'},{id:'ro',section:'blocking',label:'R.O. relacionada',source:'relatedRo',width:20,row:2,display:'inline'},
{id:'problem-summary',section:'problem',label:'Desvio evidenciado — Resumo',source:'rncSummary',width:100,row:1,height:10,display:'stack'},{id:'problem-detail',section:'problem',label:'Descrição detalhada da ocorrência',source:'rncDetailedDescription',width:100,row:2,height:16,display:'stack'},
{id:'effect-main',section:'effect',label:'Efeito observado / impacto do desvio',source:'rncEffect',width:100,row:1,height:12,display:'stack'},
{id:'part-name',section:'participants',label:'Nome',source:'rncReporter',width:50,row:1,display:'stack'},{id:'part-sector',section:'participants',label:'Setor',source:'sector',width:30,row:1,display:'stack'},{id:'part-shift',section:'participants',label:'Turno',source:'rncShift',width:20,row:1,display:'stack'},
{id:'imm-action',section:'immediate',label:'Ação',source:'rncImmediateActions',width:100,row:1,height:12,display:'stack'},
{id:'ishi-material',section:'ishikawa',label:'Matéria Prima',source:'@',width:33.33,row:1,height:9,display:'stack'},{id:'ishi-machine',section:'ishikawa',label:'Máquina',source:'@',width:33.33,row:1,height:9,display:'stack'},{id:'ishi-measure',section:'ishikawa',label:'Medição',source:'@',width:33.34,row:1,height:9,display:'stack'},{id:'ishi-environment',section:'ishikawa',label:'Meio ambiente',source:'@',width:33.33,row:2,height:9,display:'stack'},{id:'ishi-labor',section:'ishikawa',label:'Mão de Obra',source:'@',width:33.33,row:2,height:9,display:'stack'},{id:'ishi-method',section:'ishikawa',label:'Método',source:'@',width:33.34,row:2,height:9,display:'stack'},
{id:'why-1',section:'fivewhys',label:'PORQUÊ 1',source:'rncFiveWhys',width:18.4,row:1,height:9,display:'stack'},{id:'why-2',section:'fivewhys',label:'PORQUÊ 2',source:'@',width:18.4,row:1,height:9,display:'stack'},{id:'why-3',section:'fivewhys',label:'PORQUÊ 3',source:'@',width:18.4,row:1,height:9,display:'stack'},{id:'why-4',section:'fivewhys',label:'PORQUÊ 4',source:'@',width:18.4,row:1,height:9,display:'stack'},{id:'why-5',section:'fivewhys',label:'PORQUÊ 5',source:'@',width:18.4,row:1,height:9,display:'stack'},
{id:'cause-main',section:'cause',label:'Causa Macro / Conclusão',source:'rncSupplierConclusion',width:100,row:1,height:12,display:'stack'},
{id:'corr-action',section:'corrective',label:'Ações corretivas e preventivas',source:'rncCorrectiveActions',width:100,row:1,height:12,display:'stack'},
{id:'eff-main',section:'effectiveness',label:'Efeito do desvio / verificação de eficácia',source:'rncEffectiveness',width:100,row:1,height:12,display:'stack'},
{id:'photo-main',section:'photos',label:'Fotos da ocorrência',source:'photo:registro-fotografico',width:100,row:1,height:28,display:'stack'},
{id:'sign-elab',section:'signatures',label:'ELABORADOR',source:'@SGQ',width:33.33,row:1,height:13,display:'stack'},{id:'sign-ver',section:'signatures',label:'VERIFICADOR',source:'@',width:33.33,row:1,height:13,display:'stack'},{id:'sign-app',section:'signatures',label:'APROVADOR',source:'@',width:33.34,row:1,height:13,display:'stack'}
]}

function rncGridFields(){return getTplJson('tplFieldLayoutData',defaultRncFieldLayout())}

function saveRncGridFields(a,rerender=true){setTplJson('tplFieldLayoutData',a);if(rerender){const list=document.getElementById('tplFieldLayoutList');if(list)list.innerHTML=renderRncFieldLayoutEditor({...collectRncTemplateForm(),fieldLayout:a})}refreshRncTemplatePreview()}

function renderRncFieldLayoutEditor(t){const a=t.fieldLayout||defaultRncFieldLayout();return a.map((x,i)=>`<div style="border:1px solid #e3e8f1;border-radius:11px;padding:11px;${x.id===rncGridSelectedFieldId?'box-shadow:0 0 0 2px #2f6fed inset;background:#f7faff':''}"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center;margin-bottom:9px"><b style="font-size:12px">${escapeHtml(x.label||'Campo')}</b><div style="display:flex;gap:4px"><button class="btn secondary" type="button" title="Localizar na folha" onclick="selectRncGridField('${x.id}')">◎ Ver</button><button class="btn secondary" type="button" onclick="moveRncLayoutField(${i},-1)">↑</button><button class="btn secondary" type="button" onclick="moveRncLayoutField(${i},1)">↓</button><button class="btn secondary" type="button" onclick="removeRncLayoutField(${i})">×</button></div></div><div style="display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:9px"><label><span class="small">Texto exibido</span><input data-rnc-field-label="${i}" value="${escapeHtml(x.label||'Campo')}" oninput="updateRncLayoutField(${i},'label',this.value)"></label><label><span class="small">Dado de origem</span><select onchange="updateRncLayoutField(${i},'source',this.value)">${RNC_FIELD_SOURCES.map(o=>`<option value="${o[0]}" ${x.source===o[0]?'selected':''}>${o[1]}</option>`).join('')}</select></label>${String(x.source||'').startsWith('@')?`<label style="grid-column:1/-1"><span class="small">Texto / resposta fixa</span><input value="${escapeHtml(String(x.source||'').slice(1))}" placeholder="Digite o texto que deve aparecer no documento" oninput="updateRncFixedText(${i},this.value)"></label>`:''}<label><span class="small">Seção</span><select onchange="updateRncLayoutField(${i},'section',this.value)">${(t.sections||[]).map(s=>`<option value="${s.id}" ${x.section===s.id?'selected':''}>${escapeHtml(s.label)}</option>`).join('')}</select></label><label><span class="small">Título e valor</span><select onchange="updateRncLayoutField(${i},'display',this.value)"><option value="inline" ${(x.display||'stack')==='inline'?'selected':''}>Na mesma linha</option><option value="stack" ${(x.display||'stack')==='stack'?'selected':''}>Um abaixo do outro</option></select></label><label><span class="small">Alinhamento</span><select onchange="updateRncLayoutField(${i},'align',this.value)"><option value="left" ${(x.align||'left')==='left'?'selected':''}>Esquerda</option><option value="center" ${x.align==='center'?'selected':''}>Centralizado</option><option value="right" ${x.align==='right'?'selected':''}>Direita</option></select></label><label><span class="small">Preenchido por</span><select onchange="updateRncLayoutField(${i},'owner',this.value)"><option value="inherit" ${!x.owner||x.owner==='inherit'?'selected':''}>Herdar da seção</option><option value="sgq" ${x.owner==='sgq'?'selected':''}>Interno / SETA</option><option value="supplier" ${x.owner==='supplier'?'selected':''}>Fornecedor</option><option value="footer" ${x.owner==='footer'?'selected':''}>Rodapé</option></select></label><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;grid-column:1/-1"><label><span class="small">Largura (%)</span><input type="number" min="5" max="100" value="${Number(x.width)||25}" onchange="updateRncLayoutField(${i},'width',this.value)"></label><label><span class="small">Linha</span><input type="number" min="1" max="30" value="${Number(x.row)||1}" onchange="updateRncLayoutField(${i},'row',this.value)"></label><label><span class="small">Altura da linha (mm)</span><input type="number" min="3" max="60" step="0.5" value="${Number(x.height)||Number(t.layout?.rowHeight)||7}" onchange="updateRncLayoutRowHeight(${i},this.value)"></label></div></div></div>`).join('')}

function updateRncLayoutField(i,k,v){const a=rncGridFields();if(!a[i])return;a[i][k]=(k==='width'||k==='row'||k==='height')?Number(v)||1:v;saveRncGridFields(a,false)}

function updateRncFixedText(i,v){const a=rncGridFields();if(!a[i])return;a[i].source='@'+String(v??'');saveRncGridFields(a,false)}

function updateRncLayoutRowHeight(i,v){const a=rncGridFields();if(!a[i])return;const x=a[i],h=Math.max(3,Math.min(60,Number(v)||7));a.filter(z=>z.section===x.section&&(Number(z.row)||1)===(Number(x.row)||1)).forEach(z=>z.height=h);saveRncGridFields(a)}

function moveRncLayoutField(i,d){const a=rncGridFields(),j=i+d;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];saveRncGridFields(a)}

function removeRncLayoutField(i){const a=rncGridFields();if(!a[i])return;if(rncGridSelectedFieldId===a[i].id)rncGridSelectedFieldId='';a.splice(i,1);saveRncGridFields(a)}

function addRncLayoutField(){const a=rncGridFields();const sec=selectedRncGridField()?.section||document.getElementById('tplNewFieldSection')?.value||'identification',rows=a.filter(x=>x.section===sec).map(x=>Number(x.row)||1);a.push({id:'campo-'+Date.now(),section:sec,label:'Novo campo',source:'@—',width:25,row:Math.max(1,...rows),display:'inline'});saveRncGridFields(a)}

function selectRncGridField(id){rncGridSelectedHeaderId='';rncGridSelectedFieldId=id||'';refreshRncTemplatePreview();const a=rncGridFields();const list=document.getElementById('tplFieldLayoutList');if(list)list.innerHTML=renderRncFieldLayoutEditor({...collectRncTemplateForm(),fieldLayout:a})}

function selectedRncGridField(){return rncGridFields().find(x=>x.id===rncGridSelectedFieldId)||null}

function rncGridRowCells(a,x){return a.filter(v=>v.section===x.section&&(Number(v.row)||1)===(Number(x.row)||1))}

function rncGridAdjustWidth(delta){const a=rncGridFields(),x=a.find(v=>v.id===rncGridSelectedFieldId);if(!x)return;const row=rncGridRowCells(a,x),i=row.findIndex(v=>v.id===x.id),right=row[i+1];if(right){const min=5,total=(Number(x.width)||25)+(Number(right.width)||25),nw=Math.max(min,Math.min(total-min,(Number(x.width)||25)+delta));right.width=total-nw;x.width=nw}else{x.width=Math.max(5,Math.min(100,(Number(x.width)||25)+delta));saveRncGridFields(a);return}saveRncGridFields(a)}

function rncGridAdjustHeight(delta){const a=rncGridFields(),x=a.find(v=>v.id===rncGridSelectedFieldId);if(!x)return;const old=Number(x.height)||Number(document.getElementById('tplRowHeight')?.value)||7,h=Math.max(3,Math.min(60,old+delta));a.filter(v=>v.section===x.section&&(Number(v.row)||1)===(Number(x.row)||1)).forEach(v=>v.height=h);saveRncGridFields(a)}

function rncGridToggleDisplay(){const a=rncGridFields(),x=a.find(v=>v.id===rncGridSelectedFieldId);if(!x)return;x.display=(x.display||'stack')==='inline'?'stack':'inline';saveRncGridFields(a)}

function rncGridAddCell(){const a=rncGridFields(),x=a.find(v=>v.id===rncGridSelectedFieldId);if(!x)return;a.splice(a.indexOf(x)+1,0,{id:'campo-'+Date.now(),section:x.section,label:'Novo campo',source:'@—',width:Math.max(10,Math.round((Number(x.width)||25)/2)),row:Number(x.row)||1,display:'inline'});saveRncGridFields(a)}

function rncGridAddRow(){const a=rncGridFields(),x=a.find(v=>v.id===rncGridSelectedFieldId);const sec=x?.section||'identification';const max=Math.max(0,...a.filter(v=>v.section===sec).map(v=>Number(v.row)||1));const n={id:'campo-'+Date.now(),section:sec,label:'Novo campo',source:'@—',width:100,row:max+1,display:'inline'};a.push(n);rncGridSelectedFieldId=n.id;saveRncGridFields(a)}

function rncGridDeleteSelected(){const a=rncGridFields(),i=a.findIndex(v=>v.id===rncGridSelectedFieldId);if(i<0)return;a.splice(i,1);rncGridSelectedFieldId='';saveRncGridFields(a)}

function rncGridMergeNext(){const a=rncGridFields(),i=a.findIndex(v=>v.id===rncGridSelectedFieldId);if(i<0)return;const x=a[i];const candidates=a.map((v,j)=>({v,j})).filter(o=>o.j>i&&o.v.section===x.section&&(Number(o.v.row)||1)===(Number(x.row)||1));if(!candidates.length){alert('Não há outra célula à direita nesta linha.');return}const n=candidates[0];if(!confirm(`Mesclar “${x.label||'célula'}” com “${n.v.label||'célula'}”? O conteúdo da segunda célula será removido.`))return;x.width=Math.min(100,(Number(x.width)||25)+(Number(n.v.width)||25));a.splice(n.j,1);saveRncGridFields(a)}

function rncGridCellBounds(a,x){const row=a.filter(v=>v.section===x.section&&(Number(v.row)||1)===(Number(x.row)||1));const total=row.reduce((s,v)=>s+(Number(v.width)||25),0)||100;let cur=0;for(const v of row){const w=(Number(v.width)||25)/total*100;if(v.id===x.id)return [cur,cur+w];cur+=w}return [0,100]}

function rncGridMergeVertical(dir){const a=rncGridFields(),x=a.find(v=>v.id===rncGridSelectedFieldId);if(!x)return;const row=Number(x.row)||1,span=Math.max(1,Number(x.rowSpan)||1),targetRow=dir<0?row-1:row+span;if(targetRow<1)return alert('Não há linha acima para mesclar.');const candidates=a.filter(v=>v.section===x.section&&(Number(v.row)||1)===targetRow);if(!candidates.length)return alert(dir<0?'Não há célula acima para mesclar.':'Não há célula abaixo para mesclar.');const [l,r]=rncGridCellBounds(a,x);let best=null,bestOv=0;for(const v of candidates){const [vl,vr]=rncGridCellBounds(a,v),ov=Math.max(0,Math.min(r,vr)-Math.max(l,vl));if(ov>bestOv){bestOv=ov;best=v}}if(!best||bestOv<Math.max(2,(r-l)*.35))return alert('Não encontrei uma célula alinhada nessa direção para mesclar.');if(!confirm(`Mesclar “${x.label||'célula'}” ${dir<0?'para cima':'para baixo'}? O conteúdo da outra célula será removido.`))return;const bi=a.findIndex(v=>v.id===best.id);if(bi>=0)a.splice(bi,1);if(dir<0){x.row=targetRow;x.rowSpan=span+Math.max(1,Number(best.rowSpan)||1)}else{x.rowSpan=span+Math.max(1,Number(best.rowSpan)||1)}saveRncGridFields(a)}

function rncGridMergeUp(){rncGridMergeVertical(-1)}

function rncGridMergeDown(){rncGridMergeVertical(1)}

function rncGridSplit(){const a=rncGridFields(),i=a.findIndex(v=>v.id===rncGridSelectedFieldId);if(i<0)return;const x=a[i],half=Math.max(5,(Number(x.width)||25)/2);x.width=half;a.splice(i+1,0,{id:'campo-'+Date.now(),section:x.section,label:'Nova célula',source:'@—',width:half,row:Number(x.row)||1,display:'inline'});saveRncGridFields(a)}

function rncGridMoveRow(delta){const a=rncGridFields(),x=a.find(v=>v.id===rncGridSelectedFieldId);if(!x)return;const old=Number(x.row)||1,n=Math.max(1,old+delta);a.filter(v=>v.section===x.section&&(Number(v.row)||1)===old).forEach(v=>v.row=n);saveRncGridFields(a)}

function rncSwapCellSlots(a,x,other,swapOrder=true){
  if(!x||!other)return;
  const sx={row:Number(x.row)||1,width:Number(x.width)||25,height:Number(x.height)||7,rowSpan:Math.max(1,Number(x.rowSpan)||1)};
  const so={row:Number(other.row)||1,width:Number(other.width)||25,height:Number(other.height)||7,rowSpan:Math.max(1,Number(other.rowSpan)||1)};
  x.row=so.row;x.width=so.width;x.height=so.height;x.rowSpan=so.rowSpan;
  other.row=sx.row;other.width=sx.width;other.height=sx.height;other.rowSpan=sx.rowSpan;
  if(swapOrder){const ix=a.indexOf(x),io=a.indexOf(other);if(ix>=0&&io>=0)[a[ix],a[io]]=[a[io],a[ix]]}
}

function rncGridMoveSelectedHorizontal(dir){const a=rncGridFields(),x=a.find(v=>v.id===rncGridSelectedFieldId);if(!x)return;const row=rncGridRowCells(a,x);const pos=row.findIndex(v=>v.id===x.id),other=row[pos+(dir<0?-1:1)];if(!other)return;rncSwapCellSlots(a,x,other,true);saveRncGridFields(a)}

function rncGridMoveSelectedVertical(dir){const a=rncGridFields(),x=a.find(v=>v.id===rncGridSelectedFieldId);if(!x)return;const targetRow=(Number(x.row)||1)+(dir<0?-1:1);if(targetRow<1)return;const candidates=a.filter(v=>v.section===x.section&&(Number(v.row)||1)===targetRow);if(!candidates.length){x.row=targetRow;saveRncGridFields(a);return}const [l,r]=rncGridCellBounds(a,x);let best=candidates[0],bestOv=-1;for(const v of candidates){const [vl,vr]=rncGridCellBounds(a,v),ov=Math.max(0,Math.min(r,vr)-Math.max(l,vl));if(ov>bestOv){bestOv=ov;best=v}}rncSwapCellSlots(a,x,best,false);saveRncGridFields(a)}

function rncHeaderMoveSelectedHorizontal(dir){const a=rncHeaderFields(),x=a.find(v=>v.id===rncGridSelectedHeaderId);if(!x)return;const row=a.filter(v=>(Number(v.row)||1)===(Number(x.row)||1)),pos=row.findIndex(v=>v.id===x.id),other=row[pos+(dir<0?-1:1)];if(!other)return;rncSwapCellSlots(a,x,other,true);saveRncHeaderFields(a)}

function rncHeaderMoveSelectedVertical(dir){const a=rncHeaderFields(),x=a.find(v=>v.id===rncGridSelectedHeaderId);if(!x)return;const targetRow=(Number(x.row)||1)+(dir<0?-1:1);if(targetRow<1)return;const candidates=a.filter(v=>(Number(v.row)||1)===targetRow);if(!candidates.length){x.row=targetRow;saveRncHeaderFields(a);return}const [l,r]=rncHeaderCellBounds(a,x);let best=candidates[0],bestOv=-1;for(const v of candidates){const [vl,vr]=rncHeaderCellBounds(a,v),ov=Math.max(0,Math.min(r,vr)-Math.max(l,vl));if(ov>bestOv){bestOv=ov;best=v}}rncSwapCellSlots(a,x,best,false);saveRncHeaderFields(a)}

function startRncCellResize(ev,id){ev.preventDefault();ev.stopPropagation();selectRncGridField(id);const a=rncGridFields(),x=a.find(v=>v.id===id);if(!x)return;const rowEl=ev.currentTarget.closest('[data-rnc-grid-row]'),rowCells=rncGridRowCells(a,x),idx=rowCells.findIndex(v=>v.id===id),right=rowCells[idx+1],startX=ev.clientX,startW=Number(x.width)||25,startRight=right?(Number(right.width)||25):0,total=startW+startRight,rowW=rowEl?.getBoundingClientRect().width||500,min=5;const move=e=>{const delta=((e.clientX-startX)/rowW)*rowCells.reduce((sum,v)=>sum+(Number(v.width)||25),0);if(right){const nw=Math.max(min,Math.min(total-min,startW+delta));x.width=nw;right.width=total-nw}else{x.width=Math.max(min,Math.min(100,startW+delta))}setTplJson('tplFieldLayoutData',a);refreshRncTemplatePreview()};const up=()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);saveRncGridFields(a)};window.addEventListener('pointermove',move);window.addEventListener('pointerup',up)}

function startRncRowResize(ev,id){ev.preventDefault();ev.stopPropagation();selectRncGridField(id);const a=rncGridFields(),x=a.find(v=>v.id===id);if(!x)return;const startY=ev.clientY,startH=Number(x.height)||Number(document.getElementById('tplRowHeight')?.value)||7;const move=e=>{const h=Math.max(3,Math.min(60,startH+(e.clientY-startY)/4.2));a.filter(v=>v.section===x.section&&(Number(v.row)||1)===(Number(x.row)||1)).forEach(v=>v.height=h);setTplJson('tplFieldLayoutData',a);refreshRncTemplatePreview()};const up=()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);saveRncGridFields(a)};window.addEventListener('pointermove',move);window.addEventListener('pointerup',up)}

function rncGridToolbarHtml(){const h=selectedRncHeaderCell();if(h)return `<div style="display:flex;gap:5px;align-items:center;flex-wrap:wrap;padding:7px 8px;margin-bottom:8px;border:1px solid #9db8e8;border-radius:10px;background:#eef5ff;position:sticky;top:72px;z-index:4"><b style="font-size:12px">Cabeçalho:</b><span class="small">${escapeHtml(h.label||rncHeaderValue(collectRncTemplateForm(),h,true,{})||'Célula')}</span><button class="btn secondary" type="button" title="Trocar com a célula da esquerda" onclick="rncHeaderMoveSelectedHorizontal(-1)">← mover</button><button class="btn secondary" type="button" title="Trocar com a célula da direita" onclick="rncHeaderMoveSelectedHorizontal(1)">mover →</button><button class="btn secondary" type="button" title="Trocar com a célula acima" onclick="rncHeaderMoveSelectedVertical(-1)">↑ mover</button><button class="btn secondary" type="button" title="Trocar com a célula abaixo" onclick="rncHeaderMoveSelectedVertical(1)">↓ mover</button><button class="btn secondary" type="button" onclick="rncHeaderAdjustWidth(-5)">− largura</button><button class="btn secondary" type="button" onclick="rncHeaderAdjustWidth(5)">+ largura</button><button class="btn secondary" type="button" onclick="rncHeaderAdjustHeight(-1)">− altura</button><button class="btn secondary" type="button" onclick="rncHeaderAdjustHeight(1)">+ altura</button><button class="btn secondary" type="button" onclick="rncHeaderMergeSelected()">Mesclar →</button><button class="btn secondary" type="button" onclick="rncHeaderMergeUp()">Mesclar ↑</button><button class="btn secondary" type="button" onclick="rncHeaderMergeDown()">Mesclar ↓</button><button class="btn secondary" type="button" onclick="rncHeaderSplitSelected()">Dividir</button><button class="btn secondary" type="button" onclick="rncHeaderAddCellSelected()">+ Célula</button><button class="btn secondary" type="button" onclick="rncHeaderAddRowSelected()">+ Linha</button><button class="btn danger" type="button" onclick="rncHeaderDeleteSelected()">Excluir</button></div>`;const x=selectedRncGridField();return `<div style="display:flex;gap:5px;align-items:center;flex-wrap:wrap;padding:7px 8px;margin-bottom:8px;border:1px solid #d8e0ec;border-radius:10px;background:#fff;position:sticky;top:72px;z-index:4"><b style="font-size:12px">Grade:</b>${x?`<span class="small">${escapeHtml(x.label||'Célula')}</span><button class="btn secondary" type="button" title="Trocar com a célula da esquerda" onclick="rncGridMoveSelectedHorizontal(-1)">← mover</button><button class="btn secondary" type="button" title="Trocar com a célula da direita" onclick="rncGridMoveSelectedHorizontal(1)">mover →</button><button class="btn secondary" type="button" title="Trocar com a célula acima" onclick="rncGridMoveSelectedVertical(-1)">↑ mover</button><button class="btn secondary" type="button" title="Trocar com a célula abaixo" onclick="rncGridMoveSelectedVertical(1)">↓ mover</button><button class="btn secondary" type="button" onclick="rncGridAdjustWidth(-5)">− largura</button><button class="btn secondary" type="button" onclick="rncGridAdjustWidth(5)">+ largura</button><button class="btn secondary" type="button" onclick="rncGridAdjustHeight(-1)">− altura</button><button class="btn secondary" type="button" onclick="rncGridAdjustHeight(1)">+ altura</button><button class="btn secondary" type="button" onclick="rncGridToggleDisplay()">Título/valor</button><button class="btn secondary" type="button" onclick="rncGridMergeNext()">Mesclar →</button><button class="btn secondary" type="button" onclick="rncGridMergeUp()">Mesclar ↑</button><button class="btn secondary" type="button" onclick="rncGridMergeDown()">Mesclar ↓</button><button class="btn secondary" type="button" onclick="rncGridSplit()">Dividir</button><button class="btn secondary" type="button" onclick="rncGridAddCell()">+ Célula</button><button class="btn secondary" type="button" onclick="rncGridAddRow()">+ Linha</button><button class="btn secondary" type="button" onclick="rncGridDeleteSelected()">Excluir</button>`:'<span class="small">Clique em qualquer célula da folha, inclusive no cabeçalho, para editar a grade.</span>'}</div>`}

function rncPhotoSrc(photo){
  if(!photo)return '';
  if(typeof photo==='string')return photo;
  if(photo.previewDataUrl)return String(photo.previewDataUrl);
  if(photo.dataUrl)return String(photo.dataUrl);
  if(photo.url)return String(photo.url);
  if(photo.fileId)return 'https://drive.google.com/thumbnail?id='+encodeURIComponent(photo.fileId)+'&sz=w1600';
  return String(photo.src||'');
}

function rncFieldValue(obj,source,preview=false){if(String(source||'').startsWith('@'))return String(source).slice(1);if(!preview&&source==='eventDate'&&!String(obj?.eventDate||'').trim()){const d=String(obj?.createdAt||'').slice(0,10);if(d)return d;}if(!preview&&source==='rncIssueDate'){const v=obj?.rncIssueDate||obj?.issueDate||obj?.dataEmissao||obj?.emissionDate||'';if(String(v).trim())return v;}if(!preview&&source==='rncDisposition'){const v=obj?.rncDisposition||obj?.disposition||obj?.disposicao||'';if(String(v).trim())return v;}if(preview){const ex={rncReporter:'Maria',rncShift:'1º turno',eventDate:'17/09/2026',rncIssueDate:'17/09/2026',rncSupervisor:'Supervisor',rncManager:'Gerente',rncNumber:'RNC-2026-0001',supplier:'Fornecedor ABC',rncInvoice:'3215',rncProductCode:'000123',rncProduct:'Produto exemplo',rncDimensions:'Especificação',rncQuantity:'250 un.',rncDisposition:'Segregação / devolução',rncBlockArea:'Qualidade',rncBlockStage:'Recebimento',relatedRo:'Não vinculada',sector:'Qualidade',title:'RNC',description:'Descrição'};return ex[source]||'—'}return obj?.[source]??'—'}

function rncLayoutRowsHtml(t,section,obj={},preview=false,cellClass='',ownerFilter=''){
  const all=t.fieldLayout||defaultRncFieldLayout(),secOwner=(t.sections||[]).find(z=>z.id===section)?.owner||'sgq',fields=all.filter(x=>x.section===section&&(!ownerFilter||((x.owner&&x.owner!=='inherit')?x.owner:secOwner)===ownerFilter));if(!fields.length)return'';
  const rows=[...new Set(fields.map(x=>Number(x.row)||1))].sort((a,b)=>a-b),maxRow=Math.max(...rows,...fields.map(x=>(Number(x.row)||1)+Math.max(1,Number(x.rowSpan)||1)-1)),baseH=Number(t.layout?.rowHeight)||7,rbw=Math.max(.4,Number(t.layout?.borderWidth)||.65);
  const rowHeights=Array.from({length:maxRow},(_,i)=>{const rr=i+1,c=fields.filter(x=>(Number(x.row)||1)===rr);return Math.max(3,...c.map(x=>Number(x.height)||baseH))});
  const positions=new Map();for(const rr of rows){const cells=fields.filter(x=>(Number(x.row)||1)===rr),total=cells.reduce((s,x)=>s+(Number(x.width)||25),0)||100;let cur=0;for(const x of cells){const w=(Number(x.width)||25)/total*100;positions.set(x.id,[cur,cur+w]);cur+=w}}
  const rowTpl=rowHeights.map(h=>preview?`minmax(${Math.max(18,h*4.2)}px,auto)`:`minmax(${h}mm,auto)`).join(' ');
  return `<div data-rnc-grid-section="${section}" style="display:grid;grid-template-columns:repeat(1000,minmax(0,1fr));grid-template-rows:${rowTpl};border-bottom:${rbw}px solid #777">${fields.map(x=>{
      const idx=all.findIndex(z=>z.id===x.id),selected=preview&&x.id===rncGridSelectedFieldId,[l,r]=positions.get(x.id)||[0,100],cs=Math.max(1,Math.round(l*10)+1),ce=Math.max(cs+1,Math.round(r*10)+1),rs=Number(x.row)||1,re=Math.min(maxRow+1,rs+Math.max(1,Number(x.rowSpan)||1));
      const label=preview?`<span contenteditable="true" spellcheck="false" title="Clique para editar o texto" oninput="previewEditRncFieldLabel(${idx},this.textContent)" onclick="event.stopPropagation()" style="font-size:7px;font-weight:700;outline:none;cursor:text;border-radius:3px">${escapeHtml(x.label||'')}</span>`:`<span style="font-size:6.5px;font-weight:700">${escapeHtml(x.label||'')}</span>`;
      const isPhoto=String(x.source||'').startsWith('photo:'),photoId=isPhoto?String(x.source).slice(6):'',pf=(t.photoFields||[]).find(f=>f.id===photoId),imgs=!preview&&isPhoto?((obj?.rncPhotos||{})[photoId]||Object.values(obj?.rncPhotos||{}).find(v=>Array.isArray(v)&&v.length)||[]):[],photoVal=isPhoto?(preview?`<div style="display:grid;grid-template-columns:repeat(${Math.min(4,Number(pf?.maxPhotos)||4)},1fr);gap:4px;width:100%;margin-top:4px">${Array.from({length:Math.min(4,Number(pf?.maxPhotos)||4)},()=>'<div style="min-height:38px;border:1px dashed #9aa4b2;background:#fafafa"></div>').join('')}</div>`:(imgs.length?`<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:2mm;width:100%">${imgs.map(photo=>{const src=rncPhotoSrc(photo);return src?`<img src="${escapeHtml(src)}" style="width:100%;max-height:60mm;object-fit:contain;border:1px solid #ddd">`:''}).join('')}</div>`:'—')):'',val=isPhoto?photoVal:`<span class="rncAnswer" style="font-size:8px;font-weight:400;min-width:0;max-width:100%;white-space:normal;overflow-wrap:anywhere;word-break:break-word">${escapeHtml(String(rncFieldValue(obj,x.source,preview)||'—'))}</span>`,inline=(x.display||'stack')==='inline';
      return `<div class="${cellClass}" data-rnc-grid-cell="${x.id}" ${preview?`onclick="selectRncGridField('${x.id}')"`:''} style="grid-column:${cs}/${ce};grid-row:${rs}/${re};position:relative;min-width:0;overflow:hidden;overflow-wrap:anywhere;word-break:break-word;white-space:normal;text-align:${['left','center','right'].includes(x.align)?x.align:'left'};padding:${preview?'4px 5px':'1mm'};border-right:${rbw}px solid #777;border-top:${rs>1?rbw:0}px solid #777;${selected?'box-shadow:inset 0 0 0 2px #2f6fed;background:#eef5ff;':''};cursor:${preview?'pointer':'default'}"><div style="display:${inline?'flex':'block'};align-items:${inline?'flex-start':'stretch'};justify-content:${inline?(x.align==='center'?'center':x.align==='right'?'flex-end':'flex-start'):'initial'};gap:${inline?'5px':'0'};height:100%;min-width:0;max-width:100%;overflow:hidden;overflow-wrap:anywhere;word-break:break-word;white-space:normal">${label}${inline?'<span style="font-weight:700">:</span>':''}${inline?val:`<div style="margin-top:${preview?'4px':'1.2mm'}">${val}</div>`}</div>${preview?`<span title="Arraste para mudar a largura" onpointerdown="startRncCellResize(event,'${x.id}')" style="position:absolute;right:-3px;top:0;width:7px;height:100%;cursor:col-resize;z-index:3"></span><span title="Arraste para mudar a altura da linha" onpointerdown="startRncRowResize(event,'${x.id}')" style="position:absolute;left:0;bottom:-4px;width:100%;height:8px;cursor:row-resize;z-index:4"></span>`:''}</div>`;
    }).join('')}</div>`
}

function previewEditRncFieldLabel(i,v){
  const a=getTplJson('tplFieldLayoutData',defaultRncFieldLayout());if(!a[i])return;
  a[i].label=String(v||'').trim();setTplJson('tplFieldLayoutData',a);
  const list=document.getElementById('tplFieldLayoutList');
  const input=list?.querySelector(`[data-rnc-field-label="${i}"]`);if(input&&input.value!==a[i].label)input.value=a[i].label;
}

function previewEditRncSectionLabel(id,v){
  const base=getRncProcessTemplate();const i=base.sections.findIndex(x=>x.id===id);if(i<0)return;
  const el=document.getElementById('tplSecLabel'+i);if(el)el.value=String(v||'').trim();
}

function previewEditRncSimple(id,v){const el=document.getElementById(id);if(el)el.value=String(v||'').trim()}

function handleRncTemplateLogoUpload(input){
  const f=input?.files?.[0];if(!f)return;
  if(f.size>1500000){alert('A logo precisa ter até 1,5 MB.');input.value='';return;}
  const reader=new FileReader();reader.onload=()=>{window.__rncTemplateLogoChanged=true;const data=String(reader.result||'');const hidden=document.getElementById('tplLogoData');if(hidden)hidden.value=data;const host=document.getElementById('tplLogoCurrent');if(host)host.innerHTML=`<img src="${data}" alt="Logo" style="max-width:150px;max-height:54px;object-fit:contain">`;refreshRncTemplatePreview();};reader.readAsDataURL(f);
}

function removeRncTemplateLogo(){window.__rncTemplateLogoChanged=true;const h=document.getElementById('tplLogoData');if(h)h.value='';const c=document.getElementById('tplLogoCurrent');if(c)c.innerHTML='<b>SETA</b>';const f=document.getElementById('tplLogoFile');if(f)f.value='';refreshRncTemplatePreview();}

function collectRncTemplateForm(){
  const base=getRncProcessTemplate(),val=id=>document.getElementById(id)?.value||'';
  let fixedImages=base.fixedImages||[],photoFields=base.photoFields||[],fieldLayout=base.fieldLayout||defaultRncFieldLayout(),headerLayout=base.headerLayout||defaultRncHeaderLayout();try{fixedImages=JSON.parse(val('tplFixedImagesData')||'[]')}catch(e){}try{photoFields=JSON.parse(val('tplPhotoFieldsData')||'[]')}catch(e){}try{fieldLayout=JSON.parse(val('tplFieldLayoutData')||'[]')}catch(e){}try{headerLayout=JSON.parse(val('tplHeaderLayoutData')||'[]')}catch(e){}return {...base,fieldLayout,headerLayout,layoutId:val('tplLayoutBase')||'',code:val('tplCode').trim()||base.code,name:val('tplName').trim()||base.name,revision:val('tplRevision').trim()||base.revision,title:val('tplTitle').trim()||base.title,supplierResponseTitle:val('tplSupplierResponseTitle').trim()||base.supplierResponseTitle||'RESPOSTA DO FORNECEDOR',supplierResponseNote:val('tplSupplierResponseNote'),footerText:val('tplFooterText'),pageBreakBeforeSupplier:!!document.getElementById('tplPageBreakSupplier')?.checked,repeatHeaderOnPages:!!document.getElementById('tplRepeatHeader')?.checked,repeatFooterOnPages:!!document.getElementById('tplRepeatFooter')?.checked,sendFormat:val('tplSendFormat')||base.sendFormat||'pdf',logoText:val('tplLogoText').trim()||'SETA',logoDataUrl:val('tplLogoData'),logoFileId:window.__rncTemplateLogoChanged?'':String(base.logoFileId||''),layout:{logoWidth:Number(val('tplLogoWidth'))||19,metaWidth:Number(val('tplMetaWidth'))||25,headerHeight:Number(val('tplHeaderHeight'))||13,rowHeight:Number(val('tplRowHeight'))||7,borderWidth:Number(val('tplBorderWidth'))||0.65,fontScale:Number(val('tplFontScale'))||100,sectionHeight:Number(val('tplSectionHeight'))||5},fixedImages,photoFields,accent:val('tplAccent')||'#1f4e78',updatedAt:new Date().toISOString(),sections:base.sections.map((x,i)=>({...x,enabled:!!document.getElementById('tplSec'+i)?.checked,label:val('tplSecLabel'+i).trim()||x.label,align:val('tplSecAlign'+i)||x.align||'left',owner:val('tplSecOwner'+i)||x.owner||'sgq'}))};
}

function rncStandardUnit(){return getSession()?.role==='quality'?'filial':document.getElementById('qualityConfigUnit')?.value||'matriz';}

function rncStandardFeedback(message,type='info'){
  let box=document.getElementById('rncStandardFeedback');
  if(box){box.style.display='block';box.textContent=message;box.style.background=type==='success'?'#ecfdf3':type==='error'?'#fff1f2':'#eff6ff';box.style.border='1px solid '+(type==='success'?'#86efac':type==='error'?'#fda4af':'#93c5fd');box.style.color=type==='success'?'#166534':type==='error'?'#9f1239':'#1d4ed8';}
  let toast=document.getElementById('nucleoStandardToast');
  if(!toast){toast=document.createElement('div');toast.id='nucleoStandardToast';toast.style.cssText='position:fixed;right:22px;bottom:22px;z-index:2147483647;max-width:min(440px,calc(100vw - 44px));padding:13px 16px;border-radius:12px;box-shadow:0 12px 34px #0f172a33;font:700 13px/1.35 Arial,sans-serif;transition:.18s';document.body.appendChild(toast);}
  toast.textContent=message;toast.style.display='block';toast.style.background=type==='success'?'#ecfdf3':type==='error'?'#fff1f2':'#eff6ff';toast.style.border='1px solid '+(type==='success'?'#86efac':type==='error'?'#fda4af':'#93c5fd');toast.style.color=type==='success'?'#166534':type==='error'?'#9f1239':'#1d4ed8';
  clearTimeout(window.__nucleoStandardToastTimer);window.__nucleoStandardToastTimer=setTimeout(()=>{toast.style.display='none'},6500);
}

function rncStandardStorageKey(kind,unit=rncStandardUnit()){
  const base=kind==='header'?RNC_HEADER_STANDARD_KEY:RNC_FOOTER_STANDARD_KEY;
  return base+':'+String(unit||'matriz').toLowerCase();
}

function rncStandardRecordId(kind,unit=rncStandardUnit()){
  return 'global:'+rncStandardStorageKey(kind,unit);
}

async function rncSaveCentralStandard(kind,payload){
  const unit=rncStandardUnit();
  const key=rncStandardStorageKey(kind,unit);
  const id=rncStandardRecordId(kind,unit);
  const stamp=String(payload?.savedAt||new Date().toISOString());
  const record={
    id,key,value:JSON.stringify(payload||{}),scope:'global',userKey:'',
    unit,standardKind:kind,updatedAt:stamp,updatedBy:getSession()?.name||'SGQ'
  };

  // Usa a rota de shared_state, que confirma o salvamento na própria resposta.
  // Evita o fluxo assíncrono PROCTPL/nucleo_drive_status que podia permanecer em
  // "Salvando..." mesmo depois de o servidor ter recebido a alteração.
  await portalBackendSaveConfirmed('shared_state',id,record);

  const verify=await portalJsonp({acao:'portal_get_record',colecao:'shared_state',id},15000).catch(()=>null);
  const saved=verify?.registro;
  if(!saved)throw new Error('A base central não devolveu o padrão após salvar.');
  if(String(saved.updatedAt||'')!==stamp)throw new Error('A base central devolveu uma versão anterior do padrão.');
  let decoded=null;
  try{decoded=JSON.parse(String(saved.value||''));}catch(e){}
  if(!decoded||String(decoded.savedAt||'')!==stamp)throw new Error('A confirmação do padrão salvo não corresponde à versão enviada.');

  safeStorageSet(key,JSON.stringify(decoded));
  return decoded;
}

async function rncReadCentralStandard(kind,unit=rncStandardUnit()){
  const key=rncStandardStorageKey(kind,unit);
  const id=rncStandardRecordId(kind,unit);
  try{
    const res=await portalJsonp({acao:'portal_get_record',colecao:'shared_state',id},12000);
    const raw=res?.registro?.value;
    if(raw){
      const parsed=JSON.parse(String(raw));
      safeStorageSet(key,JSON.stringify(parsed));
      return parsed;
    }
  }catch(e){console.warn('[PADRÃO RNC] Falha ao reler '+kind+' da base central:',e);}
  try{return JSON.parse(localStorage.getItem(key)||'null')}catch(e){return null}
}

async function rncStandardMutation(payload){
  const out={header:null,footer:null};
  if(payload?.header)out.header=await rncSaveCentralStandard('header',payload.header);
  if(payload?.footer)out.footer=await rncSaveCentralStandard('footer',payload.footer);
  return out;
}

async function saveRncHeaderAsStandard(button){
  const original=button?.textContent||'Fixar cabeçalho como padrão';
  if(button){button.disabled=true;button.textContent='Salvando…';}
  rncStandardFeedback('Salvando cabeçalho padrão na base central…');
  try{
    const t=collectRncTemplateForm();
    const header={version:3,headerLayout:t.headerLayout,logoDataUrl:t.logoDataUrl||'',logoFileId:t.logoFileId||'',logoText:t.logoText,layout:{logoWidth:t.layout.logoWidth,metaWidth:t.layout.metaWidth,headerHeight:t.layout.headerHeight},savedAt:new Date().toISOString()};
    const x=await rncStandardMutation({header});
    if(!x.header)throw new Error('A base central não devolveu o cabeçalho salvo.');
    rncStandardFeedback('Cabeçalho padrão salvo e confirmado na base central.','success');
    if(button){button.textContent='✓ Cabeçalho salvo';setTimeout(()=>{if(document.body.contains(button))button.textContent=original},1800);}
  }catch(e){
    rncStandardFeedback('Erro ao salvar cabeçalho padrão: '+(e?.message||e),'error');
    if(button)button.textContent=original;
  }finally{if(button)button.disabled=false;}
}

async function saveRncFooterAsStandard(button){
  const original=button?.textContent||'Fixar rodapé como padrão';
  if(button){button.disabled=true;button.textContent='Salvando…';}
  rncStandardFeedback('Salvando rodapé padrão na base central…');
  try{
    const t=collectRncTemplateForm(),footerIds=(t.sections||[]).filter(x=>x.owner==='footer').map(x=>x.id);
    const footer={version:3,footerText:t.footerText,footerIds,footerSections:(t.sections||[]).filter(x=>footerIds.includes(x.id)),footerFields:(t.fieldLayout||[]).filter(x=>footerIds.includes(x.section)||x.owner==='footer'),savedAt:new Date().toISOString()};
    const x=await rncStandardMutation({footer});
    if(!x.footer)throw new Error('A base central não devolveu o rodapé salvo.');
    rncStandardFeedback('Rodapé padrão salvo e confirmado na base central.','success');
    if(button){button.textContent='✓ Rodapé salvo';setTimeout(()=>{if(document.body.contains(button))button.textContent=original},1800);}
  }catch(e){
    rncStandardFeedback('Erro ao salvar rodapé padrão: '+(e?.message||e),'error');
    if(button)button.textContent=original;
  }finally{if(button)button.disabled=false;}
}

async function rncLoadCentralStandards(){
  const [header,footer]=await Promise.all([
    rncReadCentralStandard('header'),
    rncReadCentralStandard('footer')
  ]);
  return {header,footer};
}

async function applyRncHeaderStandard(button){
  const original=button?.textContent||'Aplicar cabeçalho padrão';
  try{
    if(button){button.disabled=true;button.textContent='Aplicando…';}
    rncStandardFeedback('Buscando cabeçalho padrão salvo…');
    const standards=await rncLoadCentralStandards();
    let x=standards.header;
    if(!x){try{x=JSON.parse(localStorage.getItem(RNC_HEADER_STANDARD_KEY)||'null')}catch(_){x=null}}
    if(!x)throw new Error('Ainda não existe cabeçalho padrão salvo para esta unidade.');

    // Substitui de fato a estrutura que o editor usa e redesenha os controles.
    const header=JSON.parse(JSON.stringify(Array.isArray(x.headerLayout)&&x.headerLayout.length?x.headerLayout:defaultRncHeaderLayout()));
    saveRncHeaderFields(header);

    const logoData=String(x.logoDataUrl||'');
    const logoInput=document.getElementById('tplLogoData');if(logoInput)logoInput.value=logoData;
    const logoText=document.getElementById('tplLogoText');if(logoText)logoText.value=x.logoText||'SETA';
    const logoHost=document.getElementById('tplLogoCurrent');
    if(logoHost)logoHost.innerHTML=logoData?`<img src="${logoData}" alt="Logo" style="max-width:150px;max-height:54px;object-fit:contain">`:`<b>${escapeHtml(x.logoText||'SETA')}</b>`;
    window.__rncTemplateLogoChanged=!!logoData;

    if(x.layout){
      [['tplLogoWidth','logoWidth'],['tplMetaWidth','metaWidth'],['tplHeaderHeight','headerHeight']].forEach(([id,key])=>{const el=document.getElementById(id);if(el&&x.layout[key]!=null)el.value=x.layout[key];});
    }
    // Garante que lista lateral, célula selecionada e prévia reflitam imediatamente o padrão aplicado.
    rncGridSelectedHeaderId='';
    const list=document.getElementById('tplHeaderLayoutList');if(list)list.innerHTML=renderRncHeaderLayoutEditor({...collectRncTemplateForm(),headerLayout:header});
    refreshRncTemplatePreview();
    rncStandardFeedback('Cabeçalho padrão aplicado nesta folha. Clique em “Salvar modelo” para manter a alteração.','success');
    if(button){button.textContent='✓ Cabeçalho aplicado';setTimeout(()=>{button.textContent=original},1800);}
  }catch(e){rncStandardFeedback('Erro ao aplicar cabeçalho padrão: '+(e?.message||e),'error');if(button)button.textContent=original;}
  finally{if(button)button.disabled=false;}
}

async function applyRncFooterStandard(button){
  const original=button?.textContent||'Aplicar rodapé padrão';
  try{
    if(button){button.disabled=true;button.textContent='Aplicando…';}
    rncStandardFeedback('Buscando rodapé padrão salvo…');
    const standards=await rncLoadCentralStandards();
    let x=standards.footer;
    if(!x){try{x=JSON.parse(localStorage.getItem(RNC_FOOTER_STANDARD_KEY)||'null')}catch(_){x=null}}
    if(!x)throw new Error('Ainda não existe rodapé padrão salvo para esta unidade.');

    const f=document.getElementById('tplFooterText');if(f)f.value=x.footerText||'';
    const base=collectRncTemplateForm(),ids=new Set(x.footerIds||[]);
    (base.sections||[]).forEach((s,i)=>{const el=document.getElementById('tplSecOwner'+i);if(el)el.value=ids.has(s.id)?'footer':(el.value==='footer'?'sgq':el.value);});

    if(Array.isArray(x.footerSections)&&x.footerSections.length){
      x.footerSections.forEach(fs=>{const i=(base.sections||[]).findIndex(s=>s.id===fs.id);if(i<0)return;const lab=document.getElementById('tplSecLabel'+i);if(lab&&fs.label!=null)lab.value=fs.label;const al=document.getElementById('tplSecAlign'+i);if(al&&fs.align)al.value=fs.align;const ow=document.getElementById('tplSecOwner'+i);if(ow)ow.value='footer';});
    }
    if(Array.isArray(x.footerFields)&&x.footerFields.length){
      const a=getTplJson('tplFieldLayoutData',defaultRncFieldLayout());
      // Remove da região de rodapé as versões atuais dos mesmos campos e aplica o snapshot salvo.
      x.footerFields.forEach(ff=>{const i=a.findIndex(z=>z.id===ff.id);if(i>=0)a[i]={...a[i],...JSON.parse(JSON.stringify(ff))};else a.push(JSON.parse(JSON.stringify(ff)));});
      setTplJson('tplFieldLayoutData',a);
      const list=document.getElementById('tplFieldLayoutList');if(list)list.innerHTML=renderRncFieldLayoutEditor({...collectRncTemplateForm(),fieldLayout:a});
    }
    rncGridSelectedFieldId='';
    refreshRncTemplatePreview();
    rncStandardFeedback('Rodapé padrão aplicado nesta folha. Clique em “Salvar modelo” para manter a alteração.','success');
    if(button){button.textContent='✓ Rodapé aplicado';setTimeout(()=>{button.textContent=original},1800);}
  }catch(e){rncStandardFeedback('Erro ao aplicar rodapé padrão: '+(e?.message||e),'error');if(button)button.textContent=original;}
  finally{if(button)button.disabled=false;}
}

async function saveRncProcessTemplateFromForm(){
  if(!nucleoFeatureRequire('processes','templates')){
    try{rncStandardFeedback('Seu acesso não permite salvar modelos.','error');}catch(e){}
    return;
  }

  const button=document.querySelector('button[onclick*="saveRncProcessTemplateFromForm"]');
  const original=button?.textContent||'Salvar modelo';

  try{
    if(button){button.disabled=true;button.textContent='Salvando…';}
    rncStandardFeedback('Salvando alterações do modelo…','info');

    const t=collectRncTemplateForm();
    const all=getProcessTemplates();
    const ix=all.findIndex(x=>x.id===t.id);
    if(ix>=0)all[ix]=t;else all.unshift(t);

    const confirmed=await saveProcessTemplates(all);
    const saved=confirmed.find(x=>String(x?.id||'')===String(t.id||''));
    if(!saved)throw new Error('A base central não devolveu o modelo após o salvamento.');
    if(String(t.updatedAt||'') && String(saved.updatedAt||'')!==String(t.updatedAt||'')){
      throw new Error('A base central devolveu uma versão anterior. As alterações ainda não foram confirmadas.');
    }

    window.__rncTemplateLogoChanged=false;
    rncStandardFeedback('✓ Modelo salvo e confirmado na base central. As alterações permanecerão após atualizar ou entrar novamente.','success');

    if(button){
      button.textContent='✓ Salvo';
      setTimeout(()=>{if(document.body.contains(button)){button.textContent=original;button.disabled=false;}},2200);
    }
    refreshRncTemplatePreview();
    return true;
  }catch(e){
    const message='Erro ao salvar o modelo: '+String(e?.message||e);
    console.error('[MODELO RNC] falha ao salvar',e);
    rncStandardFeedback(message,'error');
    if(button){
      button.textContent='Erro ao salvar';
      setTimeout(()=>{if(document.body.contains(button))button.textContent=original;},2500);
    }
    return false;
  }finally{
    if(button && button.textContent!=='✓ Salvo')button.disabled=false;
  }
}

async function resetRncProcessTemplate(){
 if(!nucleoFeatureRequire('processes','templates'))return;
 if(!confirm('Restaurar a estrutura padrão da RNC? A logo personalizada também será removida.'))return;
 const all=getProcessTemplates().filter(x=>x.kind!=='RNC');
 const restored=defaultRncProcessTemplate();
 restored.updatedAt=new Date().toISOString();
 all.unshift(restored);
 try{
   rncStandardFeedback('Restaurando o modelo padrão…','info');
   await saveProcessTemplates(all);
   window.__rncTemplateLogoChanged=false;
   rncStandardFeedback('Modelo padrão restaurado e confirmado na base central.','success');
   renderProcessTemplatesWorkspace();
 }catch(e){
   rncStandardFeedback('Não foi possível restaurar o modelo: '+String(e?.message||e),'error');
 }
}

function compactRncTemplateLayout(){const v={tplLogoWidth:18,tplMetaWidth:24,tplHeaderHeight:12,tplRowHeight:6,tplBorderWidth:.6,tplFontScale:95,tplSectionHeight:4};Object.entries(v).forEach(([id,x])=>{const el=document.getElementById(id);if(el)el.value=x});refreshRncTemplatePreview();}

function setRncPreviewZoom(value){
  if(value==='fit') rncPreviewZoom='fit';
  else rncPreviewZoom=Math.max(50,Math.min(250,Number(value)||100));
  refreshRncTemplatePreview();
}

function changeRncPreviewZoom(delta){
  const current=rncPreviewZoom==='fit'?100:Number(rncPreviewZoom)||100;
  setRncPreviewZoom(current+Number(delta||0));
}

function scheduleRncTemplatePreview(){clearTimeout(rncTemplatePreviewTimer);rncTemplatePreviewTimer=setTimeout(refreshRncTemplatePreview,90)}

function refreshRncTemplatePreview(){
  const host=document.getElementById('rncTemplatePreview');if(!host)return;const tb=document.getElementById('rncGridToolbar');if(tb)tb.innerHTML=rncGridToolbarHtml();let t;try{t=collectRncTemplateForm()}catch(e){t=getRncProcessTemplate()}
  const sec=id=>t.sections.find(x=>x.id===id)?.enabled;const lbl=id=>escapeHtml(t.sections.find(x=>x.id===id)?.label||'');
  const L={...defaultRncProcessTemplate().layout,...(t.layout||{})},bw=Math.max(.4,Number(L.borderWidth)||.65),fs=(Number(L.fontScale)||100)/100,rowPx=Math.max(27,(Number(L.rowHeight)||7)*5),headPx=Math.max(45,(Number(L.headerHeight)||13)*5),barPx=Math.max(18,(Number(L.sectionHeight)||5)*4);
  const bar=id=>{const sx=t.sections.find(x=>x.id===id)||{},al=['left','center','right'].includes(sx.align)?sx.align:'left',jc=al==='center'?'center':al==='right'?'flex-end':'flex-start';return sec(id)?`<div contenteditable="true" spellcheck="false" title="Clique para editar o título desta seção" oninput="previewEditRncSectionLabel('${id}',this.textContent)" onblur="refreshRncTemplatePreview()" style="grid-column:1/-1;min-height:${barPx}px;display:flex;align-items:center;justify-content:${jc};text-align:${al};padding:2px 7px;background:${t.accent};color:#fff;font-size:${8.5*fs}px;font-weight:800;border-top:${bw}px solid #111;border-bottom:${bw}px solid #111;outline:none;cursor:text">${lbl(id)}</div>`:''};
  const cell=(a,b='')=>`<div style="padding:3px 5px;min-height:${rowPx}px;border-right:${bw}px solid #777;border-bottom:${bw}px solid #777"><small style="font-size:${6.6*fs}px;font-weight:700">${a}</small><div style="margin-top:3px;font-size:${7.8*fs}px">${b}</div></div>`;
  const previewOwnerContent=owner=>(t.sections||[]).map(sx=>{if(sx.enabled===false)return'';const rows=rncLayoutRowsHtml(t,sx.id,{},true,'',owner);return rows?`${bar(sx.id)}${rows}`:''}).join('');
  const internalPreview=previewOwnerContent('sgq'),supplierPreview=previewOwnerContent('supplier'),footerPreview=previewOwnerContent('footer');
  const previewFooter=()=>`<div style="margin-top:auto;border-top:${bw}px solid #111">${footerPreview}${t.footerText?`<div style="padding:7px 9px;font-size:7px;text-align:center;white-space:pre-wrap;overflow-wrap:anywhere">${escapeHtml(t.footerText)}</div>`:''}</div>`;
  host.innerHTML=`<div style="background:#eef1f5;padding:10px;border-radius:14px;overflow:hidden;height:100%;display:flex;align-items:flex-start;justify-content:center"><div id="rncPreviewSheet" style="width:760px;min-height:900px;margin:0 auto;transform-origin:top center;background:#fff;border:1.5px solid #111;box-shadow:0 8px 24px #0001;font-family:Arial,sans-serif;color:#111">
    ${rncHeaderRowsHtml(t,true,{})}
    ${internalPreview}
    ${(t.fixedImages||[]).map(x=>`<div style="padding:7px;border-bottom:1px solid #555;text-align:center"><div style="font-size:7px;font-weight:700;margin-bottom:4px">${escapeHtml(x.label||'IMAGEM')}</div><img src="${x.dataUrl}" style="max-width:90%;max-height:70px;object-fit:contain"></div>`).join('')}
    ${t.pageBreakBeforeSupplier!==false?`${t.repeatFooterOnPages!==false?previewFooter():''}<div style="height:22px;background:#eef1f5;border-top:2px dashed #9aa4b2;border-bottom:2px dashed #9aa4b2;display:flex;align-items:center;justify-content:center;font-size:9px;color:#667085;font-weight:700">QUEBRA DE PÁGINA · PARTE DO FORNECEDOR</div>${t.repeatHeaderOnPages!==false?rncHeaderRowsHtml(t,true,{}):''}`:''}<div style="padding:7px;background:#f4f6f8;border-bottom:1px solid #111;font-size:8px"><b>${escapeHtml(t.supplierResponseTitle||'RESPOSTA DO FORNECEDOR')}</b>${t.supplierResponseNote?' · '+escapeHtml(t.supplierResponseNote):''}</div>
    ${supplierPreview}
    ${t.repeatFooterOnPages!==false?previewFooter():''}
    ${(t.fixedImages||[]).map(x=>`<div style="padding:7px;border-bottom:1px solid #555;text-align:center"><div style="font-size:7px;font-weight:700;margin-bottom:4px">${escapeHtml(x.label||'IMAGEM')}</div><img src="${x.dataUrl}" style="max-width:90%;max-height:70px;object-fit:contain"></div>`).join('')}
  </div></div>`;
  requestAnimationFrame(()=>{
    const sheet=document.getElementById('rncPreviewSheet'),box=host;if(!sheet||!box)return;
    sheet.style.transform='none';sheet.style.marginBottom='0';
    const viewport=sheet.parentElement;
    const availW=Math.max(320,box.clientWidth-20),availH=Math.max(320,box.clientHeight-20),sw=sheet.scrollWidth||760,sh=sheet.scrollHeight||900;
    const fitScale=Math.min(1,availW/sw,availH/sh);
    const zoomPct=rncPreviewZoom==='fit'?100:Math.max(50,Math.min(250,Number(rncPreviewZoom)||100));
    const scale=Math.max(.2,Math.min(2.5,fitScale*(zoomPct/100)));
    const scaledW=sw*scale,scaledH=sh*scale;
    // O transform não altera o tamanho de layout do elemento. Um canvas com o tamanho
    // realmente escalado mantém a folha centralizada e evita que o zoom a empurre lateralmente.
    const canvas=document.createElement('div');
    canvas.className='rnc-preview-canvas';
    canvas.style.cssText=`position:relative;flex:0 0 auto;width:${scaledW}px;height:${scaledH}px;`;
    sheet.parentNode.insertBefore(canvas,sheet);canvas.appendChild(sheet);
    sheet.style.position='absolute';sheet.style.left='0';sheet.style.top='0';
    sheet.style.transformOrigin='top left';sheet.style.transform=`scale(${scale})`;
    sheet.style.margin='0';
    if(viewport){
      viewport.style.overflow='auto';viewport.style.alignItems='flex-start';viewport.style.padding='10px';
      viewport.style.justifyContent=(scaledW<=Math.max(0,viewport.clientWidth-20)?'center':'flex-start');
    }
    const label=document.getElementById('rncPreviewZoomLabel');if(label)label.textContent=rncPreviewZoom==='fit'?'100%':`${Math.round(zoomPct)}%`;
    if(viewport){
      // Quando ainda cabe, fica geometricamente centralizado. Quando passa a largura do visor,
      // começa pela esquerda e a rolagem horizontal passa a navegar somente a prévia.
      if(scaledW<=Math.max(0,viewport.clientWidth-20)) viewport.scrollLeft=0;
      if(zoomPct<=100 && scaledH<=Math.max(0,viewport.clientHeight-20)) viewport.scrollTop=0;
    }
  });
}

function rncWordCompatibleHtml(html){
  const parser=new DOMParser(),doc=parser.parseFromString(String(html||''),'text/html');
  doc.querySelectorAll('.toolbar').forEach(x=>x.remove());
  const gridPos=el=>{const st=String(el.getAttribute('style')||''),cm=st.match(/grid-column\s*:\s*(\d+)\s*\/\s*(\d+)/i),rm=st.match(/grid-row\s*:\s*(\d+)\s*\/\s*(\d+)/i);return cm&&rm?{cs:+cm[1],ce:+cm[2],rs:+rm[1],re:+rm[2]}:null};
  const cleanCellStyle=st=>String(st||'').replace(/grid-column\s*:[^;]+;?/ig,'').replace(/grid-row\s*:[^;]+;?/ig,'').replace(/display\s*:\s*flex\s*;?/ig,'').replace(/cursor\s*:[^;]+;?/ig,'');
  const convertGrid=grid=>{
    const kids=[...grid.children].map(el=>({el,p:gridPos(el)})).filter(x=>x.p);if(!kids.length)return;
    const cb=[...new Set(kids.flatMap(x=>[x.p.cs,x.p.ce]))].sort((a,b)=>a-b),rb=[...new Set(kids.flatMap(x=>[x.p.rs,x.p.re]))].sort((a,b)=>a-b);
    const table=doc.createElement('table');table.setAttribute('cellspacing','0');table.setAttribute('cellpadding','0');table.style.cssText='width:100%;border-collapse:collapse;table-layout:fixed;margin:0;padding:0;';
    const cg=doc.createElement('colgroup');for(let i=0;i<cb.length-1;i++){const c=doc.createElement('col');c.style.width=((cb[i+1]-cb[i])/10)+'%';cg.appendChild(c)}table.appendChild(cg);
    for(let ri=0;ri<rb.length-1;ri++){
      const rowStart=rb[ri],tr=doc.createElement('tr');
      kids.filter(x=>x.p.rs===rowStart).sort((a,b)=>a.p.cs-b.p.cs).forEach(({el,p})=>{
        const td=doc.createElement('td'),ci1=cb.indexOf(p.cs),ci2=cb.indexOf(p.ce),ri2=rb.indexOf(p.re);if(ci2-ci1>1)td.colSpan=ci2-ci1;if(ri2-ri>1)td.rowSpan=ri2-ri;
        td.innerHTML=el.innerHTML;td.setAttribute('data-rnc-word-cell',el.getAttribute('data-rnc-grid-cell')||el.getAttribute('data-rnc-header-cell')||'');td.setAttribute('style',cleanCellStyle(el.getAttribute('style'))+';vertical-align:top;');tr.appendChild(td);
      });table.appendChild(tr);
    }
    grid.replaceWith(table);
  };
  doc.querySelectorAll('[data-rnc-header-grid],[data-rnc-grid-section]').forEach(convertGrid);
  doc.querySelectorAll('[style]').forEach(el=>{let st=String(el.getAttribute('style')||'');st=st.replace(/display\s*:\s*grid\s*;?/ig,'').replace(/grid-template-[^;]+;?/ig,'').replace(/display\s*:\s*flex\s*;?/ig,'');el.setAttribute('style',st)});
  // Google Docs/Word ignora de forma inconsistente break-before vindo de classes CSS.
  // Materializa a quebra entre as páginas como elemento inline, antes da segunda página,
  // e remove alturas/flex do HTML de impressão que causavam o cabeçalho da página 2
  // a escorrer para o fim da página 1 durante a conversão DOCX.
  const pages=[...doc.querySelectorAll('.rncPage')];
  pages.forEach((pg,i)=>{
    pg.style.width='100%';
    pg.style.minHeight='0';
    pg.style.height='auto';
    pg.style.display='block';
    pg.style.breakInside='auto';
    pg.style.pageBreakInside='auto';
    pg.style.pageBreakAfter='auto';
    // A quebra real é aplicada no OOXML pelo backend após a exportação DOCX.
    // Não inserir quebra HTML aqui: Google Docs pode deslocá-la e criar página vazia.
  });
  doc.querySelectorAll('.doc').forEach(el=>{el.style.height='auto';el.style.minHeight='0';el.style.display='block';el.style.overflow='visible'});
  doc.querySelectorAll('.pageContent').forEach(el=>{el.style.display='block';el.style.width='100%'});
  doc.querySelectorAll('.pageFooter').forEach(el=>{el.style.pageBreakInside='avoid';el.style.breakInside='avoid';el.style.marginTop='0'});
  const extra=doc.createElement('style');extra.textContent='@page{size:A4 portrait;margin:6mm} body{font-family:Arial,Helvetica,sans-serif;font-size:8pt;margin:0}.rncPage{width:100%!important;min-height:0!important;height:auto!important;display:block!important;page-break-inside:auto!important}.doc{width:100%!important;height:auto!important;min-height:0!important;display:block!important;overflow:visible!important;border:1px solid #111}.pageFooter{page-break-inside:avoid!important;break-inside:avoid!important;margin-top:0!important}.bar{display:block!important;padding:3px 6px!important;color:#fff!important;font-weight:bold!important}.supplierNote{background:#eef5ff!important}.cell{min-height:0!important}table{border-collapse:collapse;table-layout:fixed;width:100%}td{overflow-wrap:anywhere;word-break:break-word}p[data-rnc-word-page-break]{page-break-before:always!important;break-before:page!important;margin:0!important;padding:0!important;height:0!important;line-height:0!important}';doc.head.appendChild(extra);
  return '<!doctype html>\n'+doc.documentElement.outerHTML;
}

function downloadRncEditableDoc(id){
  // O Núcleo não gera mais .doc/HTML no navegador. O editável oficial é DOCX
  // e é criado exclusivamente no backend durante o fluxo de envio.
  const r=adminModuleRecord(id);
  if(!r)return;
  openRncSendModal(id);
}

function rncBlockingRowsHtml(r={}){
  const e=v=>escapeHtml(String(v??''));
  const items=legacyRncBlockItems(r).filter(item=>Object.values(item||{}).some(v=>String(v||'').trim()));
  const safeItems=items.length?items:[{}];
  const supplier=String(r.supplier||'').trim();
  const area=String(r.rncBlockArea||'').trim();
  const etapa=String(r.rncBlockStage||'').trim();
  const head=['Fornecedor','Nota Fiscal','Data da emissão','Código do produto','Produto / descrição','Dimensões / especificação','Qtd. Não Conforme','Área responsável pelo Bloqueio','Etapa da área responsável pelo bloqueio','Disposição'];
  return `<table class="rncBlockingItems" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;table-layout:fixed;margin:0">
    <tr>${head.map(h=>`<td style="border:1px solid #777;background:#b7dde8;font-size:6.5px;font-weight:700;padding:1mm;text-align:center">${e(h)}</td>`).join('')}</tr>
    ${safeItems.map(item=>`<tr>
      <td style="border:1px solid #777;padding:1mm">${e(supplier||'—')}</td>
      <td style="border:1px solid #777;padding:1mm">${e(item.invoice||'—')}</td>
      <td style="border:1px solid #777;padding:1mm">${e(item.issueDate||'—')}</td>
      <td style="border:1px solid #777;padding:1mm">${e(item.productCode||'—')}</td>
      <td style="border:1px solid #777;padding:1mm">${e(item.product||'—')}</td>
      <td style="border:1px solid #777;padding:1mm">${e(item.dimensions||'—')}</td>
      <td style="border:1px solid #777;padding:1mm">${e(item.quantity||'—')}</td>
      <td style="border:1px solid #777;padding:1mm">${e(area||'—')}</td>
      <td style="border:1px solid #777;padding:1mm">${e(etapa||'—')}</td>
      <td style="border:1px solid #777;padding:1mm">${e(item.disposition||'—')}</td>
    </tr>`).join('')}
  </table>`;
}

function printRncStandard(id,returnHtml=false){
  const r=adminModuleRecord(id); if(!r||r.module!=='nccapa'||r.ncType!=='supplier')return;
  const e=v=>escapeHtml(String(v??'')).replace(/\n/g,'<br>'); const v=(x,empty='')=>String(x??'').trim()||empty; const tpl=getRncProcessTemplate();
  const responseLabel={none:'SEM RESPOSTA',partial:'RESPOSTA PARCIAL',complete:'RESPOSTA COMPLETA'}[r.rncResponseStatus]||'SEM RESPOSTA';
  const enabled=id=>tpl.sections.find(x=>x.id===id)?.enabled!==false;
  const cell=(label,value)=>`<div class="cell"><span>${e(label)}</span><span class="rncAnswer">${e(v(value,'—'))}</span></div>`;
  const long=(label,value)=>`<div class="long"><div class="lbl">${e(label)}</div><div class="answer">${e(v(value,'—'))}</div></div>`;
  const logo=tpl.logoDataUrl?`<img src="${tpl.logoDataUrl}" alt="Logo" class="logo">`:`<b class="logoText" style="color:${e(tpl.accent)}">${e(tpl.logoText||'SETA')}</b>`;
  const L={...defaultRncProcessTemplate().layout,...(tpl.layout||{})},bw=Math.max(.4,Number(L.borderWidth)||.65),fs=(Number(L.fontScale)||100)/100;
  const bar=(id,fallback)=>{const sx=tpl.sections.find(x=>x.id===id)||{},al=['left','center','right'].includes(sx.align)?sx.align:'left',jc=al==='center'?'center':al==='right'?'flex-end':'flex-start';return enabled(id)?`<div class="bar" style="background:${e(tpl.accent)};justify-content:${jc};text-align:${al}">${e(sx.label||fallback)}</div>`:''};
  const pageHeader=(page,total)=>{const pt={...tpl,headerLayout:(tpl.headerLayout||defaultRncHeaderLayout()).map(x=>x.id==='h-page'?{...x,source:'@'+page+' de '+total}:{...x})};return rncHeaderRowsHtml(pt,false,r)};
  const sectionFallback={identification:'IDENTIFICAÇÃO',blocking:'BLOQUEIO',problem:'DESVIO EVIDENCIADO / DESCRIÇÃO',effect:'EFEITO DO DESVIO',participants:'PARTICIPANTES DO PREENCHIMENTO',immediate:'AÇÕES IMEDIATAS',ishikawa:'ISHIKAWA',fivewhys:'ANÁLISE DOS 5 PORQUÊS',cause:'CONCLUSÃO DA INVESTIGAÇÃO DE CAUSA',corrective:'AÇÕES CORRETIVAS E PREVENTIVAS',effectiveness:'VERIFICAÇÃO DE EFICÁCIA',photos:'REGISTRO FOTOGRÁFICO',signatures:'ELABORADOR · VERIFICADOR · APROVADOR'};
  const sectionForOwner=(sx,owner)=>{
    if(!sx||sx.enabled===false)return'';
    if(owner==='sgq'&&sx.id==='blocking'){
      const fields=rncBlockingRowsHtml(r);
      return `${bar(sx.id,sectionFallback[sx.id]||sx.label)}${fields}`;
    }
    const fields=rncLayoutRowsHtml(tpl,sx.id,r,false,'cell',owner);
    if(!fields)return'';
    return `${bar(sx.id,sectionFallback[sx.id]||sx.label)}${fields}`;
  };
  const ownerContent=owner=>(tpl.sections||[]).map(sx=>sectionForOwner(sx,owner)).join('');
  const internalContent=ownerContent('sgq');
  const supplierContent=`<div class="supplierNote"><b>${e(tpl.supplierResponseTitle||'RESPOSTA DO FORNECEDOR')} — ${e(responseLabel)}</b>${tpl.supplierResponseNote?`<br>${e(tpl.supplierResponseNote)}`:''}</div>${ownerContent('supplier')}`;
  const footerSections=ownerContent('footer');
  const extraImages=(tpl.fixedImages||[]).map(x=>`<div class="long"><div class="lbl">${e(x.label||'IMAGEM')}</div><div class="answer" style="text-align:center"><img src="${x.dataUrl}" style="max-width:95%;max-height:45mm;object-fit:contain"></div></div>`).join('');
  const footerHtml=()=>`<div class="pageFooter">${footerSections}${tpl.footerText?`<div class="footerText" style="font-size:${6.8*fs}px">${e(tpl.footerText)}</div>`:''}</div>`;
  const split=tpl.pageBreakBeforeSupplier!==false,totalPages=split?2:1;
  const pages=split
    ? `<section class="rncPage"><div class="doc">${pageHeader(1,totalPages)}<div class="pageContent">${internalContent}${extraImages}</div>${tpl.repeatFooterOnPages!==false?footerHtml():''}</div></section><section class="rncPage pageBreak"><div class="doc">${tpl.repeatHeaderOnPages!==false?pageHeader(2,totalPages):''}<div class="pageContent">${supplierContent}</div>${tpl.repeatFooterOnPages!==false?footerHtml():''}</div></section>`
    : `<section class="rncPage"><div class="doc">${pageHeader(1,1)}<div class="pageContent">${internalContent}${extraImages}${supplierContent}</div>${footerHtml()}</div></section>`;
  const html=`<!doctype html><html><head><meta charset="utf-8"><title>${e(v(r.rncNumber,'RNC'))}</title><style>
  @page{size:A4 portrait;margin:6mm}*{box-sizing:border-box;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}html,body{margin:0;background:#fff;color:#111;font-family:Arial,Helvetica,sans-serif;font-size:8px;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}.rncPage{width:100%;min-height:285mm;display:flex;break-inside:avoid;page-break-inside:avoid}.rncPage.pageBreak{break-before:page;page-break-before:always}.doc{width:100%;height:285mm;min-height:285mm;border:${bw}px solid #111;display:flex;flex-direction:column;overflow:hidden}.pageContent{width:100%;flex:0 0 auto}.pageFooter{margin-top:auto;border-top:${bw}px solid #111;text-align:center;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;flex:0 0 auto}.pageFooter>[data-rnc-grid-section]{border-bottom:0!important}.footerText{padding:2mm}.head{display:grid;grid-template-columns:${L.logoWidth}% 1fr;min-height:${L.headerHeight}mm;border-bottom:${bw}px solid #111}.logoBox{display:flex;align-items:center;justify-content:center;border-right:${bw}px solid #111;padding:1.5mm}.logo{max-width:92%;max-height:${Math.max(7,L.headerHeight-2)}mm;object-fit:contain}.logoText{font-size:${18*fs}px}.sys{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}.sys b{font-size:${10*fs}px}.sys span{margin-top:1mm}.meta{display:grid;grid-template-columns:1fr 1fr}.meta div{padding:1mm;border-right:${bw}px solid #777;border-bottom:${bw}px solid #777}.meta div:nth-child(even){border-right:0}.titleRow{display:grid;grid-template-columns:18mm 1fr;border-bottom:1px solid #111}.titleRow>*{padding:1.5mm}.titleRow b:first-child{border-right:1px solid #777}.report{text-align:center;font-weight:800}.bar{color:#fff!important;font-weight:800;min-height:${L.sectionHeight}mm;display:flex;align-items:center;padding:.7mm 1.5mm;border-top:${bw}px solid #111;border-bottom:${bw}px solid #111;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}.grid3,.grid4,.grid5,.grid6{display:grid;border-bottom:1px solid #777}.grid3{grid-template-columns:1.1fr 1fr 1fr}.grid4{grid-template-columns:1.1fr .6fr .9fr 1fr}.grid5{grid-template-columns:1.3fr .8fr .9fr 1fr 1fr}.grid6{grid-template-columns:1.1fr .7fr .8fr .9fr .8fr 1fr}.cell{min-height:${L.rowHeight}mm;padding:1mm;border-right:${bw}px solid #777}.cell:last-child{border-right:0}.cell span{display:block;font-size:6.5px;font-weight:700;margin-bottom:1.5mm}.cell b{font-size:8px;font-weight:400}.rncAnswer{font-weight:400!important}.long{border-bottom:1px solid #777;min-height:13mm}.lbl{font-weight:700;padding:1.4mm 2mm;border-bottom:1px solid #bbb}.answer{padding:2mm;min-height:9mm}.supplierNote{padding:1.8mm 2mm;background:#f2f4f7;border-bottom:1px solid #111}.matrix{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid #777}.matrix div{padding:2mm;min-height:9mm;border-right:1px solid #777}.sign{display:grid;grid-template-columns:repeat(3,1fr);min-height:13mm}.sign div{text-align:center;padding:2mm;border-right:1px solid #777}.toolbar{margin-bottom:8px}.toolbar button{padding:7px 12px}@media screen{body{background:#dfe3e8}.rncPage{width:198mm;margin:8px auto;background:#fff;box-shadow:0 2px 8px #0002}}@media print{.toolbar{display:none}.rncPage{margin:0;box-shadow:none}}
  </style></head><body><div class="toolbar"><button onclick="window.print()">Salvar como PDF / Imprimir</button></div>${pages}</body></html>`;
  if(returnHtml)return html;
  let frame=document.getElementById('nucleoRncPrintFrame');if(frame)frame.remove();frame=document.createElement('iframe');frame.id='nucleoRncPrintFrame';frame.style.cssText='position:fixed;left:-10000px;top:0;width:210mm;height:297mm;border:0;background:#fff;';document.body.appendChild(frame);const d=frame.contentDocument||frame.contentWindow.document;d.open();d.write(html);d.close();const doPrint=()=>{try{frame.contentWindow.focus();frame.contentWindow.print()}catch(err){console.error(err);alert('Não foi possível abrir a impressão do PDF.')}};if(d.readyState==='complete')setTimeout(doPrint,250);else frame.onload=()=>setTimeout(doPrint,250);
}

function supplierMoney(v){
  const n=Number(String(v??'').replace(',','.'));return Number.isFinite(n)?n:0;
}

function supplierMoneyBR(v){
  try{return supplierMoney(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}catch(e){return 'R$ '+supplierMoney(v).toFixed(2)}
}

function supplierNamesMatch(profile,name){
  const q=normalizeAnswer(name||'');if(!q)return false;
  return [profile?.supplier,profile?.title,profile?.legalName,profile?.tradeName,profile?.supplierCode].some(v=>normalizeAnswer(v||'')===q);
}

function getSupplierProfiles(){
  return getAdminModuleRecords().filter(r=>r.module==='nccapa'&&r.recordType==='supplier_profile'&&nucleoManagerScopeAllows(r)).slice().sort((a,b)=>String(a.supplier||a.title||'').localeCompare(String(b.supplier||b.title||''),'pt-BR',{sensitivity:'base'}));
}

function supplierDatalistOptions(){return getSupplierProfiles().map(p=>`<option value="${escapeHtml(p.supplier||p.title||'')}">${escapeHtml([p.supplierCode,p.cnpj,p.category].filter(Boolean).join(' · '))}</option>`).join('')}

function supplierRncs(profile){
  if(!profile)return[];
  return getAdminModuleRecords().filter(r=>r.module==='nccapa'&&r.recordType!=='supplier_profile'&&ncCapaTypeKey(r)==='supplier'&&((profile.id&&String(r.supplierId||'')===String(profile.id))||supplierNamesMatch(profile,r.supplier))).slice().sort((a,b)=>String(b.eventDate||b.createdAt||'').localeCompare(String(a.eventDate||a.createdAt||'')));
}

function supplierPurchasesTotal(profile,monthPrefix=''){
  return (profile?.purchases||[]).filter(x=>!monthPrefix||String(x.month||'').startsWith(monthPrefix)).reduce((t,x)=>t+supplierMoney(x.amount),0);
}

function supplierQuantityTotal(profile,monthPrefix=''){
  return (profile?.purchases||[]).filter(x=>!monthPrefix||String(x.month||'').startsWith(monthPrefix)).reduce((t,x)=>t+supplierMoney(x.quantity),0);
}

function supplierOpenAgreements(profile){
  const now=new Date().toISOString().slice(0,10);
  return (profile?.agreements||[]).filter(a=>!['done','cancelled'].includes(String(a.status||''))).map(a=>({...a,overdue:!!a.dueDate&&a.dueDate<now}));
}

function supplierIndicator(profile){const total=supplierPurchasesTotal(profile);return total>0?(supplierRncs(profile).length/total*100000):null;}

function supplierReincidenceCount(profile){
  const counts={};supplierRncs(profile).forEach(r=>{const k=normalizeAnswer(r.rncProductCode||r.rncProduct||r.title||'geral');counts[k]=(counts[k]||0)+1});
  return Object.values(counts).reduce((n,c)=>n+(c>1?c-1:0),0);
}

function supplierStatusLabel(v){return ({active:'Ativo',inactive:'Inativo',blocked:'Bloqueado',qualification:'Em homologação'})[v]||'Ativo'}

function supplierAgreementStatusLabel(v){return ({open:'Aberto',progress:'Em andamento',done:'Cumprido',overdue:'Vencido',cancelled:'Cancelado'})[v]||'Aberto'}

function supplierDocumentStatus(d){
  if(!d?.validUntil)return 'Sem validade';const today=new Date().toISOString().slice(0,10);return d.validUntil<today?'Vencido':'Vigente';
}

function supplierLatestPurchaseMonth(profile){return (profile?.purchases||[]).map(x=>x.month).filter(Boolean).sort().at(-1)||''}

function renderSupplierWorkspace(){
  const host=document.getElementById('adminModuleContent');if(!host)return;
  const profiles=getSupplierProfiles();
  const totalPurchase=profiles.reduce((t,p)=>t+supplierPurchasesTotal(p),0), totalRncs=profiles.reduce((t,p)=>t+supplierRncs(p).length,0), pending=profiles.reduce((t,p)=>t+supplierOpenAgreements(p).length,0);
  host.innerHTML=`<div style="grid-column:1/-1">
    <button class="btn secondary" type="button" onclick="showAdminOperationalModule('nccapa')">← Voltar ao módulo</button>
    <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap;margin-top:14px">
      <div><h3 style="margin:0">Fornecedores</h3><div class="small" style="margin-top:5px">Cadastro, contatos, compras, acordos, documentos, RNCs e desempenho em uma ficha única.</div></div>
      <button class="btn primary" type="button" onclick="openSupplierProfile()">＋ Novo fornecedor</button>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;margin-top:16px">
      <div class="card" style="padding:14px"><span class="small">FORNECEDORES</span><b style="display:block;font-size:24px;margin-top:4px">${profiles.length}</b></div>
      <div class="card" style="padding:14px"><span class="small">COMPRADO REGISTRADO</span><b style="display:block;font-size:20px;margin-top:4px">${supplierMoneyBR(totalPurchase)}</b></div>
      <div class="card" style="padding:14px"><span class="small">RNCs VINCULADAS</span><b style="display:block;font-size:24px;margin-top:4px">${totalRncs}</b></div>
      <div class="card" style="padding:14px"><span class="small">ACORDOS PENDENTES</span><b style="display:block;font-size:24px;margin-top:4px">${pending}</b></div>
    </div>
    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin-top:14px">
      <label style="grid-column:span 2"><span class="small">Buscar</span><input id="supplierSearch" placeholder="Fornecedor, CNPJ, código, categoria, material..." oninput="renderSupplierList()"></label>
      <label><span class="small">Situação</span><select id="supplierStatusFilter" onchange="renderSupplierList()"><option value="all">Todos</option><option value="active">Ativos</option><option value="qualification">Em homologação</option><option value="blocked">Bloqueados</option><option value="inactive">Inativos</option></select></label>
    </div>
    <div id="supplierList" style="margin-top:14px"></div>
  </div>`;
  renderSupplierList();
}

function renderSupplierList(){
  const host=document.getElementById('supplierList');if(!host)return;
  const q=normalizeAnswer(document.getElementById('supplierSearch')?.value||''),st=document.getElementById('supplierStatusFilter')?.value||'all';
  const rows=getSupplierProfiles().filter(p=>{
    if(st!=='all'&&String(p.supplierStatus||'active')!==st)return false;
    if(q&&!normalizeAnswer([p.supplier,p.legalName,p.tradeName,p.cnpj,p.supplierCode,p.category,p.products,p.city,p.state,p.notes].join(' ')).includes(q))return false;
    return true;
  });
  host.innerHTML=rows.length?`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:12px">${rows.map(p=>{
    const rncs=supplierRncs(p),purchase=supplierPurchasesTotal(p),idx=supplierIndicator(p),agreements=supplierOpenAgreements(p),over=agreements.filter(a=>a.overdue).length;
    return `<button type="button" class="card" onclick="openSupplierProfile('${escapeHtml(p.id)}')" style="padding:16px;text-align:left;cursor:pointer;background:#fff">
      <div style="display:flex;justify-content:space-between;gap:10px"><div><b style="font-size:15px">${escapeHtml(p.supplier||p.title||'Fornecedor')}</b><div class="small" style="margin-top:4px">${escapeHtml([p.supplierCode,p.category,p.cnpj].filter(Boolean).join(' · ')||'Sem classificação')}</div></div><span class="pill">${escapeHtml(supplierStatusLabel(p.supplierStatus))}</span></div>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:14px">
        <div><span class="small">Comprado</span><b style="display:block;margin-top:3px">${supplierMoneyBR(purchase)}</b></div>
        <div><span class="small">RNCs</span><b style="display:block;margin-top:3px">${rncs.length}</b></div>
        <div><span class="small">Índice / R$ 100 mil</span><b style="display:block;margin-top:3px">${idx==null?'—':idx.toFixed(2)}</b></div>
        <div><span class="small">Acordos pendentes</span><b style="display:block;margin-top:3px">${agreements.length}${over?` · ${over} venc.`:''}</b></div>
      </div><span style="display:block;color:#1455ff;font-size:12px;margin-top:14px">Abrir ficha do fornecedor →</span>
    </button>`}).join('')}</div>`:'<div class="card" style="padding:24px"><b>Nenhum fornecedor cadastrado.</b><div class="small" style="margin-top:5px">Cadastre o primeiro fornecedor para começar o histórico.</div></div>';
}

function supplierContactRow(x={}){return `<div class="supplier-contact-row" data-id="${escapeHtml(x.id||('CT-'+Date.now()+'-'+Math.random().toString(36).slice(2,6)))}" style="border:1px solid #e3e8f1;border-radius:10px;padding:10px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px"><input data-f="name" placeholder="Nome" value="${escapeHtml(x.name||'')}"><input data-f="role" placeholder="Função / área" value="${escapeHtml(x.role||'')}"><input data-f="email" placeholder="E-mail" value="${escapeHtml(x.email||'')}"><input data-f="phone" placeholder="Telefone" value="${escapeHtml(x.phone||'')}"><input data-f="whatsapp" placeholder="WhatsApp" value="${escapeHtml(x.whatsapp||'')}"><select data-f="preferred"><option value="">Contato comum</option><option value="yes" ${x.preferred==='yes'?'selected':''}>Contato principal</option></select><button class="btn danger" type="button" onclick="this.closest('.supplier-contact-row').remove()">Remover</button></div>`}

function supplierPurchaseRow(x={}){return `<div class="supplier-purchase-row" data-id="${escapeHtml(x.id||('CP-'+Date.now()+'-'+Math.random().toString(36).slice(2,6)))}" style="border:1px solid #e3e8f1;border-radius:10px;padding:10px;display:grid;grid-template-columns:130px 150px 110px 120px 100px minmax(160px,1fr) auto;gap:8px;align-items:end"><label><span class="small">Mês</span><input data-f="month" type="month" value="${escapeHtml(x.month||'')}"></label><label><span class="small">Valor comprado (R$)</span><input data-f="amount" type="number" step="0.01" min="0" value="${escapeHtml(x.amount||'')}"></label><label><span class="small">Pedidos/NFs</span><input data-f="orders" type="number" min="0" value="${escapeHtml(x.orders||'')}"></label><label><span class="small">Qtd. recebida</span><input data-f="quantity" type="number" step="0.001" min="0" value="${escapeHtml(x.quantity||'')}"></label><label><span class="small">Unidade</span><input data-f="unit" placeholder="kg, un..." value="${escapeHtml(x.unit||'')}"></label><label><span class="small">Observação</span><input data-f="notes" value="${escapeHtml(x.notes||'')}"></label><button class="btn danger" type="button" onclick="this.closest('.supplier-purchase-row').remove()">×</button></div>`}

function supplierAgreementRow(x={}){return `<div class="supplier-agreement-row" data-id="${escapeHtml(x.id||('AC-'+Date.now()+'-'+Math.random().toString(36).slice(2,6)))}" style="border:1px solid #dfe6ef;border-radius:11px;padding:12px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px"><label><span class="small">Data</span><input data-f="date" type="date" value="${escapeHtml(x.date||'')}"></label><label style="grid-column:span 2"><span class="small">Assunto</span><input data-f="subject" placeholder="Ex.: alteração de embalagem" value="${escapeHtml(x.subject||'')}"></label><label style="grid-column:1/-1"><span class="small">Compromisso / acordo</span><textarea data-f="commitment" placeholder="O que ficou combinado">${escapeHtml(x.commitment||'')}</textarea></label><label><span class="small">Responsável</span><input data-f="responsible" value="${escapeHtml(x.responsible||'')}"></label><label><span class="small">Prazo</span><input data-f="dueDate" type="date" value="${escapeHtml(x.dueDate||'')}"></label><label><span class="small">Situação</span><select data-f="status"><option value="open" ${x.status==='open'||!x.status?'selected':''}>Aberto</option><option value="progress" ${x.status==='progress'?'selected':''}>Em andamento</option><option value="done" ${x.status==='done'?'selected':''}>Cumprido</option><option value="cancelled" ${x.status==='cancelled'?'selected':''}>Cancelado</option></select></label><label style="grid-column:span 2"><span class="small">Evidência / link / referência</span><input data-f="evidence" value="${escapeHtml(x.evidence||'')}"></label><div style="display:flex;align-items:end;justify-content:flex-end"><button class="btn danger" type="button" onclick="this.closest('.supplier-agreement-row').remove()">Remover acordo</button></div></div>`}

function supplierDocumentRow(x={}){return `<div class="supplier-document-row" data-id="${escapeHtml(x.id||('DOC-'+Date.now()+'-'+Math.random().toString(36).slice(2,6)))}" style="border:1px solid #dfe6ef;border-radius:10px;padding:10px;display:grid;grid-template-columns:1.2fr 1fr 150px 1.5fr auto;gap:8px;align-items:end"><label><span class="small">Documento</span><input data-f="name" placeholder="Ex.: certificado ISO" value="${escapeHtml(x.name||'')}"></label><label><span class="small">Tipo</span><input data-f="type" placeholder="Certificado, contrato..." value="${escapeHtml(x.type||'')}"></label><label><span class="small">Validade</span><input data-f="validUntil" type="date" value="${escapeHtml(x.validUntil||'')}"></label><label><span class="small">Link / referência</span><input data-f="link" value="${escapeHtml(x.link||'')}"></label><button class="btn danger" type="button" onclick="this.closest('.supplier-document-row').remove()">×</button></div>`}

function supplierReadRows(selector,fields){return [...document.querySelectorAll(selector)].map(row=>{const o={id:row.dataset.id||('X-'+Date.now())};fields.forEach(f=>o[f]=String(row.querySelector(`[data-f="${f}"]`)?.value||'').trim());return o}).filter(o=>fields.some(f=>o[f]))}

function supplierAddContact(){document.getElementById('supplierContacts')?.insertAdjacentHTML('beforeend',supplierContactRow())}

function supplierAddPurchase(){document.getElementById('supplierPurchases')?.insertAdjacentHTML('beforeend',supplierPurchaseRow({month:new Date().toISOString().slice(0,7)}))}

function supplierAddAgreement(){document.getElementById('supplierAgreements')?.insertAdjacentHTML('beforeend',supplierAgreementRow({date:new Date().toISOString().slice(0,10),status:'open'}))}

function supplierAddDocument(){document.getElementById('supplierDocuments')?.insertAdjacentHTML('beforeend',supplierDocumentRow())}

function supplierShowTab(tab){document.querySelectorAll('.supplier-tab-panel').forEach(x=>x.classList.add('hidden'));document.getElementById('supplierTab-'+tab)?.classList.remove('hidden');document.querySelectorAll('[data-supplier-tab]').forEach(b=>b.classList.toggle('primary',b.dataset.supplierTab===tab));}

function openSupplierProfile(id=''){
  const host=document.getElementById('adminModuleContent');if(!host)return;
  const p=id?getSupplierProfiles().find(x=>String(x.id)===String(id)):null;
  const rncs=p?supplierRncs(p):[],idx=p?supplierIndicator(p):null,purchase=p?supplierPurchasesTotal(p):0,agreements=p?supplierOpenAgreements(p):[];
  host.innerHTML=`<div style="grid-column:1/-1"><button class="btn secondary" type="button" onclick="renderSupplierWorkspace()">← Voltar aos fornecedores</button>
    <div class="card" style="margin-top:14px;padding:20px">
      <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap"><div><div class="small" style="letter-spacing:.12em;color:#1455ff;font-weight:700">FICHA DO FORNECEDOR</div><h3 style="margin:5px 0 0">${escapeHtml(p?.supplier||'Novo fornecedor')}</h3></div><div style="display:flex;gap:8px"><button class="btn primary" type="button" onclick="saveSupplierProfile('${escapeHtml(p?.id||'')}')">Salvar fornecedor</button>${p?`<button class="btn danger" type="button" onclick="deleteSupplierProfile('${escapeHtml(p.id)}')">Excluir</button>`:''}</div></div>
      ${p?`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:9px;margin-top:16px"><div class="card" style="padding:12px"><span class="small">Comprado</span><b style="display:block;font-size:18px;margin-top:4px">${supplierMoneyBR(purchase)}</b></div><div class="card" style="padding:12px"><span class="small">RNCs</span><b style="display:block;font-size:18px;margin-top:4px">${rncs.length}</b></div><div class="card" style="padding:12px"><span class="small">Índice / R$ 100 mil</span><b style="display:block;font-size:18px;margin-top:4px">${idx==null?'—':idx.toFixed(2)}</b></div><div class="card" style="padding:12px"><span class="small">Reincidências</span><b style="display:block;font-size:18px;margin-top:4px">${supplierReincidenceCount(p)}</b></div><div class="card" style="padding:12px"><span class="small">Acordos pendentes</span><b style="display:block;font-size:18px;margin-top:4px">${agreements.length}</b></div></div>`:''}
      <div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:18px;border-bottom:1px solid #e4e9f0;padding-bottom:10px"><button class="btn secondary primary" data-supplier-tab="general" onclick="supplierShowTab('general')">Visão geral</button><button class="btn secondary" data-supplier-tab="contacts" onclick="supplierShowTab('contacts')">Contatos</button><button class="btn secondary" data-supplier-tab="purchases" onclick="supplierShowTab('purchases')">Compras</button><button class="btn secondary" data-supplier-tab="agreements" onclick="supplierShowTab('agreements')">Acordos</button><button class="btn secondary" data-supplier-tab="documents" onclick="supplierShowTab('documents')">Documentos</button><button class="btn secondary" data-supplier-tab="rncs" onclick="supplierShowTab('rncs')">RNCs</button><button class="btn secondary" data-supplier-tab="indicators" onclick="supplierShowTab('indicators')">Indicadores</button><button class="btn secondary" data-supplier-tab="history" onclick="supplierShowTab('history')">Histórico</button></div>
      <div id="supplierTab-general" class="supplier-tab-panel" style="margin-top:16px"><div class="grid" style="grid-template-columns:repeat(3,minmax(0,1fr));gap:10px">
        <label><span class="small">Nome do fornecedor *</span><input id="supplierName" value="${escapeHtml(p?.supplier||'')}"></label><label><span class="small">Razão social</span><input id="supplierLegalName" value="${escapeHtml(p?.legalName||'')}"></label><label><span class="small">Nome fantasia</span><input id="supplierTradeName" value="${escapeHtml(p?.tradeName||'')}"></label>
        <label><span class="small">CNPJ / identificação</span><input id="supplierCnpj" value="${escapeHtml(p?.cnpj||'')}"></label><label><span class="small">Inscrição estadual</span><input id="supplierStateRegistration" value="${escapeHtml(p?.stateRegistration||'')}"></label><label><span class="small">Código interno</span><input id="supplierCode" value="${escapeHtml(p?.supplierCode||'')}"></label>
        <label><span class="small">Categoria</span><input id="supplierCategory" value="${escapeHtml(p?.category||'')}"></label><label><span class="small">Situação</span><select id="supplierStatus"><option value="active" ${!p||p?.supplierStatus==='active'?'selected':''}>Ativo</option><option value="qualification" ${p?.supplierStatus==='qualification'?'selected':''}>Em homologação</option><option value="blocked" ${p?.supplierStatus==='blocked'?'selected':''}>Bloqueado</option><option value="inactive" ${p?.supplierStatus==='inactive'?'selected':''}>Inativo</option></select></label><label><span class="small">Início do relacionamento</span><input id="supplierStartDate" type="date" value="${escapeHtml(p?.startDate||'')}"></label>
        <label><span class="small">Comprador / responsável SETA</span><input id="supplierBuyer" value="${escapeHtml(p?.buyer||'')}"></label><label><span class="small">Condição de pagamento</span><input id="supplierPaymentTerms" value="${escapeHtml(p?.paymentTerms||'')}"></label><label><span class="small">Prazo médio de entrega</span><input id="supplierLeadTime" value="${escapeHtml(p?.leadTime||'')}"></label>
        <label><span class="small">Frete / condição logística</span><input id="supplierFreight" value="${escapeHtml(p?.freight||'')}"></label><label><span class="small">Site</span><input id="supplierWebsite" value="${escapeHtml(p?.website||'')}"></label><label><span class="small">CEP</span><input id="supplierPostalCode" value="${escapeHtml(p?.postalCode||'')}"></label>
        <label style="grid-column:span 2"><span class="small">Endereço</span><input id="supplierAddress" value="${escapeHtml(p?.address||'')}"></label><label><span class="small">Cidade</span><input id="supplierCity" value="${escapeHtml(p?.city||'')}"></label><label><span class="small">UF / Estado</span><input id="supplierState" value="${escapeHtml(p?.state||'')}"></label>
        <label style="grid-column:1/-1"><span class="small">Produtos / materiais / serviços fornecidos</span><textarea id="supplierProducts">${escapeHtml(p?.products||'')}</textarea></label><label style="grid-column:1/-1"><span class="small">Observações</span><textarea id="supplierNotes">${escapeHtml(p?.notes||'')}</textarea></label>
      </div></div>
      <div id="supplierTab-contacts" class="supplier-tab-panel hidden" style="margin-top:16px"><div style="display:flex;justify-content:space-between;align-items:center"><div><b>Meios de contato</b><div class="small">Comercial, qualidade, financeiro, logística e demais contatos.</div></div><button class="btn secondary" type="button" onclick="supplierAddContact()">＋ Contato</button></div><div id="supplierContacts" style="display:grid;gap:9px;margin-top:12px">${(p?.contacts||[]).map(supplierContactRow).join('')}</div></div>
      <div id="supplierTab-purchases" class="supplier-tab-panel hidden" style="margin-top:16px"><div style="display:flex;justify-content:space-between;align-items:center"><div><b>Compras por mês</b><div class="small">Valor comprado, quantidade recebida e volume de pedidos/NFs para comparar exposição com não conformidades.</div></div><button class="btn secondary" type="button" onclick="supplierAddPurchase()">＋ Mês</button></div><div id="supplierPurchases" style="display:grid;gap:9px;margin-top:12px;overflow:auto">${(p?.purchases||[]).map(supplierPurchaseRow).join('')}</div></div>
      <div id="supplierTab-agreements" class="supplier-tab-panel hidden" style="margin-top:16px"><div style="display:flex;justify-content:space-between;align-items:center"><div><b>Acordos com o fornecedor</b><div class="small">Compromissos, responsáveis, prazo e evidência do que foi combinado.</div></div><button class="btn secondary" type="button" onclick="supplierAddAgreement()">＋ Acordo</button></div><div id="supplierAgreements" style="display:grid;gap:10px;margin-top:12px">${(p?.agreements||[]).map(supplierAgreementRow).join('')}</div></div>
      <div id="supplierTab-documents" class="supplier-tab-panel hidden" style="margin-top:16px"><div style="display:flex;justify-content:space-between;align-items:center"><div><b>Documentos do fornecedor</b><div class="small">Contratos, certificados, laudos, especificações, homologações e referências.</div></div><button class="btn secondary" type="button" onclick="supplierAddDocument()">＋ Documento</button></div><div id="supplierDocuments" style="display:grid;gap:9px;margin-top:12px;overflow:auto">${(p?.documents||[]).map(supplierDocumentRow).join('')}</div></div>
      <div id="supplierTab-rncs" class="supplier-tab-panel hidden" style="margin-top:16px">${p?renderSupplierRncsHtml(p):'<div class="small">Salve o fornecedor primeiro para vincular RNCs.</div>'}</div>
      <div id="supplierTab-indicators" class="supplier-tab-panel hidden" style="margin-top:16px">${p?renderSupplierIndicatorsHtml(p):'<div class="small">Os indicadores aparecem depois que o fornecedor for salvo.</div>'}</div>
      <div id="supplierTab-history" class="supplier-tab-panel hidden" style="margin-top:16px">${p?renderSupplierHistoryHtml(p):'<div class="small">O histórico aparece depois que o fornecedor for salvo.</div>'}</div>
    </div></div>`;
  if(!(p?.contacts||[]).length)supplierAddContact();
  if(!(p?.purchases||[]).length)supplierAddPurchase();
  if(!(p?.agreements||[]).length)supplierAddAgreement();
  if(!(p?.documents||[]).length)supplierAddDocument();
}

function renderSupplierRncsHtml(p){const rows=supplierRncs(p);return `<div><b>Não conformidades vinculadas</b><div class="small" style="margin-top:4px">A RNC reconhece o cadastro selecionado e também o mesmo nome do fornecedor.</div></div><div style="overflow:auto;margin-top:12px">${rows.length?`<table style="width:100%"><thead><tr><th>RNC</th><th>Data</th><th>Desvio / item</th><th>Status</th><th></th></tr></thead><tbody>${rows.map(r=>`<tr><td><b>${escapeHtml(r.rncNumber||'—')}</b></td><td>${escapeHtml(adminModuleDate(r.eventDate||r.createdAt))}</td><td>${escapeHtml(r.rncProduct||r.title||r.rncSummary||'—')}</td><td><span class="pill">${escapeHtml(adminModuleStatusLabel(r.status))}</span></td><td><button class="btn secondary" type="button" onclick="editAdminOperationalRecord('${escapeHtml(r.id)}')">Abrir</button></td></tr>`).join('')}</tbody></table>`:'<div class="card" style="padding:18px">Nenhuma RNC vinculada ainda.</div>'}</div>`}

function renderSupplierIndicatorsHtml(p){
  const rncs=supplierRncs(p),purchases=p.purchases||[],months=[...new Set([...purchases.map(x=>x.month).filter(Boolean),...rncs.map(r=>String(r.eventDate||r.createdAt||'').slice(0,7)).filter(Boolean)])].sort().reverse();
  return `<div><b>Indicadores</b><div class="small" style="margin-top:4px">O índice financeiro compara quantidade de RNC com o valor comprado. A quantidade recebida também fica visível sem misturar unidades diferentes.</div></div><div style="overflow:auto;margin-top:12px"><table style="width:100%"><thead><tr><th>Mês</th><th>Comprado</th><th>Qtd. registrada</th><th>RNCs</th><th>Índice / R$ 100 mil</th></tr></thead><tbody>${months.length?months.map(m=>{const buy=supplierPurchasesTotal(p,m),qty=supplierQuantityTotal(p,m),n=rncs.filter(r=>String(r.eventDate||r.createdAt||'').slice(0,7)===m).length,idx=buy>0?n/buy*100000:null;return `<tr><td>${escapeHtml(m.split('-').reverse().join('/'))}</td><td>${supplierMoneyBR(buy)}</td><td>${qty||'—'}</td><td>${n}</td><td><b>${idx==null?'—':idx.toFixed(2)}</b></td></tr>`}).join(''):'<tr><td colspan="5">Sem dados mensais.</td></tr>'}</tbody></table></div>`
}

function renderSupplierHistoryHtml(p){
  const events=[];
  (p.purchases||[]).forEach(x=>x.month&&events.push({date:x.month+'-01',type:'Compra',text:`${supplierMoneyBR(x.amount)}${x.notes?' · '+x.notes:''}`}));
  (p.agreements||[]).forEach(x=>events.push({date:x.date||x.dueDate||'',type:'Acordo',text:[x.subject,x.commitment,supplierAgreementStatusLabel(x.status)].filter(Boolean).join(' · ')}));
  (p.documents||[]).forEach(x=>events.push({date:x.validUntil||'',type:'Documento',text:[x.name,x.type,supplierDocumentStatus(x)].filter(Boolean).join(' · ')}));
  supplierRncs(p).forEach(r=>events.push({date:String(r.eventDate||r.createdAt||'').slice(0,10),type:'RNC',text:[r.rncNumber,r.rncProduct||r.title,adminModuleStatusLabel(r.status)].filter(Boolean).join(' · ')}));
  events.sort((a,b)=>String(b.date).localeCompare(String(a.date)));
  return `<div><b>Histórico do relacionamento</b><div class="small" style="margin-top:4px">Linha do tempo consolidada com compras, acordos, documentos e RNCs.</div></div><div style="display:grid;gap:8px;margin-top:12px">${events.length?events.map(e=>`<div class="card" style="padding:12px"><div style="display:flex;justify-content:space-between;gap:10px"><b>${escapeHtml(e.type)}</b><span class="small">${escapeHtml(adminModuleDate(e.date)||e.date||'—')}</span></div><div class="small" style="margin-top:5px">${escapeHtml(e.text||'')}</div></div>`).join(''):'<div class="small">Ainda não há eventos registrados para este fornecedor.</div>'}</div>`
}

function collectSupplierProfile(existing){
  const v=id=>String(document.getElementById(id)?.value||'').trim(),now=new Date().toISOString();
  return {...(existing||{}),id:existing?.id||('SUP-'+Date.now()),module:'nccapa',recordType:'supplier_profile',ncType:'supplier_profile',title:v('supplierName'),supplier:v('supplierName'),legalName:v('supplierLegalName'),tradeName:v('supplierTradeName'),cnpj:v('supplierCnpj'),stateRegistration:v('supplierStateRegistration'),supplierCode:v('supplierCode'),category:v('supplierCategory'),supplierStatus:v('supplierStatus')||'active',startDate:v('supplierStartDate'),buyer:v('supplierBuyer'),paymentTerms:v('supplierPaymentTerms'),leadTime:v('supplierLeadTime'),freight:v('supplierFreight'),website:v('supplierWebsite'),postalCode:v('supplierPostalCode'),address:v('supplierAddress'),city:v('supplierCity'),state:v('supplierState'),products:v('supplierProducts'),notes:v('supplierNotes'),contacts:supplierReadRows('.supplier-contact-row',['name','role','email','phone','whatsapp','preferred']),purchases:supplierReadRows('.supplier-purchase-row',['month','amount','orders','quantity','unit','notes']),agreements:supplierReadRows('.supplier-agreement-row',['date','subject','commitment','responsible','dueDate','status','evidence']),documents:supplierReadRows('.supplier-document-row',['name','type','validUntil','link']),unit:existing?.unit||explicitPortalUnit(getSession()?.unit)||'matriz',status:'active',createdAt:existing?.createdAt||now,createdBy:existing?.createdBy||getSession()?.name||'SGQ',updatedAt:now,updatedBy:getSession()?.name||'SGQ'};
}

async function saveSupplierProfile(id=''){
  if(!nucleoFeatureRequire('nc','edit'))return;
  const existing=id?getSupplierProfiles().find(x=>String(x.id)===String(id)):null,p=collectSupplierProfile(existing);
  if(!p.supplier)return alert('Informe o nome do fornecedor.');
  let all=getAdminModuleRecords(),i=all.findIndex(x=>String(x.id)===String(p.id));if(i>=0)all[i]=p;else all.push(p);saveAdminModuleRecords(all);
  try{if(portalBackendEnabled())await portalBackendSaveConfirmedPost('admin_modules',p.id,p,90000);else portalBackendSave('admin_modules',p.id,p);}catch(e){alert('O fornecedor ficou salvo neste navegador, mas a base central não confirmou: '+(e.message||e));return}
  openSupplierProfile(p.id);
}

async function deleteSupplierProfile(id){
  if(!nucleoFeatureRequire('nc','delete'))return;if(!confirm('Excluir este fornecedor? As RNCs existentes não serão apagadas.'))return;
  saveAdminModuleRecords(getAdminModuleRecords().filter(x=>String(x.id)!==String(id)));
  try{if(portalBackendEnabled())await portalBackendDeleteConfirmed('admin_modules',id);else portalBackendDelete('admin_modules',id);}catch(e){alert('Não foi possível confirmar a exclusão na base central: '+(e.message||e));return}
  renderSupplierWorkspace();
}

function renderSupplierIndicatorsWorkspace(){
  const host=document.getElementById('adminModuleContent');if(!host)return;const rows=getSupplierProfiles().map(p=>({p,buy:supplierPurchasesTotal(p),rncs:supplierRncs(p).length,idx:supplierIndicator(p),reinc:supplierReincidenceCount(p),agreements:supplierOpenAgreements(p)})).sort((a,b)=>(b.idx??-1)-(a.idx??-1));
  host.innerHTML=`<div style="grid-column:1/-1"><button class="btn secondary" type="button" onclick="showAdminOperationalModule('nccapa')">← Voltar ao módulo</button><div class="card" style="margin-top:14px;padding:20px"><div><h3 style="margin:0">Indicadores de fornecedores</h3><div class="small" style="margin-top:5px">Comparação de volume comprado, RNCs, reincidências e acordos pendentes.</div></div><div style="overflow:auto;margin-top:16px">${rows.length?`<table style="width:100%"><thead><tr><th>Fornecedor</th><th>Comprado</th><th>RNCs</th><th>Índice / R$ 100 mil</th><th>Reincid.</th><th>Acordos pend.</th><th>Última compra</th><th></th></tr></thead><tbody>${rows.map(x=>`<tr><td><b>${escapeHtml(x.p.supplier||'Fornecedor')}</b><div class="small">${escapeHtml([x.p.supplierCode,x.p.category].filter(Boolean).join(' · '))}</div></td><td>${supplierMoneyBR(x.buy)}</td><td>${x.rncs}</td><td><b>${x.idx==null?'—':x.idx.toFixed(2)}</b></td><td>${x.reinc}</td><td>${x.agreements.length}</td><td>${escapeHtml(supplierLatestPurchaseMonth(x.p).split('-').reverse().join('/')||'—')}</td><td><button class="btn secondary" onclick="openSupplierProfile('${escapeHtml(x.p.id)}')">Abrir</button></td></tr>`).join('')}</tbody></table>`:'<div>Nenhum fornecedor cadastrado.</div>'}</div></div></div>`;
}

