function renderStandardDocumentsWorkspace(){
  if(!isAdmin())return;
  const host=document.getElementById('adminModuleContent');if(!host)return;
  const docs=getStandardDocuments().slice().sort((a,b)=>String(b.updatedAt||b.createdAt||'').localeCompare(String(a.updatedAt||a.createdAt||'')));
  host.innerHTML=`<div style="grid-column:1/-1">
    <button class="btn secondary" type="button" onclick="showAdminOperationalModule('documents')">← Voltar ao módulo</button>
    <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap;margin-top:14px"><div><h3 style="margin:0">Documentos padrão</h3><div class="small" style="margin-top:4px">Arquivos vigentes podem ser enviados automaticamente quando uma solicitação compatível for criada.</div></div><button class="btn primary" type="button" onclick="openStandardDocumentCreate()">＋ Novo documento padrão</button></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;margin-top:16px">
      ${docs.length?docs.map(d=>`<div class="card" style="padding:16px">
        <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start"><div><b>${escapeHtml(d.name||'Documento')}</b><div class="small" style="margin-top:3px">${escapeHtml(standardDocumentTypeLabel(d.code,explicitRecordUnit(d)))}${d.productCode?' · '+escapeHtml(d.productCode):''}</div></div><span class="pill">${d.uploadPending&&!d.fileId?'Enviando':standardDocumentIsValid(d)?'Vigente':'Indisponível'}</span></div>
        <div class="small" style="margin-top:12px;line-height:1.6">Versão: <b>${escapeHtml(d.version||'—')}</b><br>Idioma: ${escapeHtml(d.language||'Qualquer')}<br>Validade: ${escapeHtml(adminModuleDate(d.validUntil))}<br>Arquivo: ${escapeHtml(d.fileName||'—')}</div>
        ${d.description?`<div class="small" style="margin-top:8px">${escapeHtml(d.description)}</div>`:''}
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button class="btn secondary" type="button" onclick="toggleStandardDocument('${escapeHtml(d.id)}')">${d.active===false?'Ativar':'Desativar'}</button><button class="btn secondary" type="button" onclick="deleteStandardDocument('${escapeHtml(d.id)}')">Excluir</button></div>
      </div>`).join(''):'<div class="card" style="padding:24px"><b>Nenhum documento padrão cadastrado.</b><div class="small" style="margin-top:5px">Cadastre os arquivos que podem ser entregues automaticamente.</div></div>'}
    </div>
  </div>`;
}

function renderDocumentDeliveriesWorkspace(){
  if(!isAdmin())return;const host=document.getElementById('adminModuleContent');if(!host)return;const rows=getDocumentDeliveries().slice().sort((a,b)=>String(b.deliveredAt||'').localeCompare(String(a.deliveredAt||'')));
  host.innerHTML=`<div style="grid-column:1/-1"><button class="btn secondary" type="button" onclick="showAdminOperationalModule('documents')">← Voltar ao módulo</button><div class="card" style="margin-top:14px;padding:0;overflow:hidden">${rows.length?`<table style="width:100%"><thead><tr><th>Documento</th><th>Solicitação</th><th>Destinatário</th><th>Data</th><th>Resultado</th></tr></thead><tbody>${rows.map(x=>`<tr><td><b>${escapeHtml(x.documentName||x.standardDocumentId||'Documento')}</b><div class="small">${escapeHtml(x.fileName||'')}</div></td><td>${escapeHtml(x.requestTitle||x.requestId||'—')}</td><td>${escapeHtml(x.recipientEmail||'—')}</td><td>${escapeHtml(formatDateTimeBR(x.deliveredAt)||x.deliveredAt||'—')}</td><td><span class="pill">Enviado</span></td></tr>`).join('')}</tbody></table>`:`<div style="padding:26px"><b>Nenhuma entrega automática registrada.</b></div>`}</div></div>`;
}

function adminModuleFields(key){
  const commonStatus=`<label><span class="small">Status</span><select id="admModStatus">
    <option value="open">Aberto</option><option value="progress">Em andamento</option>
    <option value="pending">Pendente</option><option value="done">Concluído</option>
  </select></label>`;
  const map={
    equipment:`
      <label><span class="small">Unidade *</span><select id="admModEquipmentUnit" ${getSession()?.role==='quality'?'disabled':''}><option value="">Selecione a unidade</option><option value="matriz" ${getSession()?.role==='quality'?'':''}>SETA SC — Matriz</option><option value="filial" ${getSession()?.role==='quality'?'selected':''}>SETA ES — Unidade Linhares</option></select></label>
      <label><span class="small">Equipamento / instrumento</span><input id="admModTitle" placeholder="Nome do equipamento"></label>
      <label><span class="small">Código / patrimônio</span><input id="admModCode" placeholder="Código"></label>
      <label><span class="small">Localização</span><input id="admModLocation" placeholder="Setor / local"></label>
      <label><span class="small">Responsável</span><input id="admModResponsible" placeholder="Responsável"></label>
      <label><span class="small">Próxima calibração</span><input id="admModDueDate" type="date"></label>
      ${commonStatus}
      <label style="grid-column:1/-1"><span class="small">Situação / observações</span><textarea id="admModDescription" placeholder="Condição do ativo, manutenção, bloqueio, certificado..."></textarea></label>`,
    training:`
      <label><span class="small">Treinamento</span><input id="admModTitle" placeholder="Nome do treinamento"></label>
      <label><span class="small">Competência</span><input id="admModCode" placeholder="Competência relacionada"></label>
      <label><span class="small">Participante(s)</span><input id="admModResponsible" placeholder="Nome(s)"></label>
      <label><span class="small">Data do treinamento</span><input id="admModEventDate" type="date"></label>
      <label><span class="small">Validade / reciclagem</span><input id="admModDueDate" type="date"></label>
      ${commonStatus}
      <label><span class="small">Eficácia</span><select id="admModEffectiveness"><option value="">A avaliar</option><option value="effective">Eficaz</option><option value="ineffective">Não eficaz</option></select></label>
      <label style="grid-column:1/-1"><span class="small">Observações / evidências</span><textarea id="admModDescription" placeholder="Conteúdo, certificado, avaliação de eficácia..."></textarea></label>`,
    nccapa:`
      <div style="grid-column:1/-1;padding:12px 14px;border:1px solid #dbe6ff;background:#f7faff;border-radius:12px">
        <b>RNC de fornecedor</b>
        <div class="small" style="margin-top:4px">Este módulo é exclusivo para RNC de fornecedor. Reclamações de cliente permanecem no fluxo de SAC. A RNC pode existir com ou sem R.O. vinculada.</div>
      </div>

      <input type="hidden" id="admModNcType" value="supplier">

      <label style="grid-column:1/-1"><span class="small">Título do desvio *</span><input id="admModTitle" placeholder="Título do desvio"></label>

      <label><span class="small">Origem</span>
        <select id="admModNcOrigin">
          <option value="direct">Registro direto</option>
          <option value="ro">R.O.</option>
          <option value="receiving">Recebimento / inspeção</option>
          <option value="audit">Auditoria</option>
          <option value="process">Processo interno</option>
          <option value="other">Outra</option>
        </select>
      </label>

      <label><span class="small">R.O. vinculada (opcional)</span><input id="admModRelatedRo" placeholder="Ex.: RO-IN-00476"></label>

      <!-- ==========================================================
           RNC DE FORNECEDOR — SOMENTE O QUE O SGQ PREENCHE
           Nº da RNC, data de abertura e tipo são automáticos.
           ========================================================== -->
      <div id="admModRncOpening" class="hidden" style="grid-column:1/-1;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px">

        <div style="grid-column:1/-1;padding:10px 12px;background:#1f4e78;color:#fff;border-radius:8px;font-weight:700;text-align:center">IDENTIFICAÇÃO</div>

        <label><span class="small">Responsável pela identificação</span><input id="admModRncReporter" placeholder="Quem identificou / registrou"></label>
        <label><span class="small">Turno</span><input id="admModRncShift" placeholder="Ex.: 1º turno"></label>
        <label><span class="small">Supervisor da área</span><input id="admModRncSupervisor" placeholder="Supervisor"></label>
        <label><span class="small">Gerente da área</span><input id="admModRncManager" placeholder="Gerente"></label>
        <label style="grid-column:1/-1"><span class="small">Setor</span><input id="admModRncSector" placeholder="Setor de quem está registrando"></label>

        <div style="grid-column:1/-1;padding:10px 12px;background:#1f4e78;color:#fff;border-radius:8px;font-weight:700;text-align:center;margin-top:4px">BLOQUEIO</div>

        <label><span class="small">Fornecedor *</span><input id="admModSupplier" placeholder="Nome do fornecedor"></label>
        <label><span class="small">Área responsável pelo bloqueio</span><input id="admModRncBlockArea" placeholder="Área / setor"></label>
        <label style="grid-column:1/-1"><span class="small">Etapa da área responsável pelo bloqueio</span><input id="admModRncBlockStage" placeholder="Etapa / processo em que o desvio foi identificado"></label>

        <div style="grid-column:1/-1">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin:2px 0 8px">
            <div>
              <b>Itens do bloqueio</b>
              <div class="small">Pode haver mais de um produto / item na mesma RNC.</div>
            </div>
            <button class="btn secondary" type="button" onclick="addRncBlockItem()">＋ Adicionar item</button>
          </div>
          <div id="admModRncBlockItems" style="display:grid;gap:10px"></div>
        </div>

        <div style="grid-column:1/-1;padding:10px 12px;background:#1f4e78;color:#fff;border-radius:8px;font-weight:700;text-align:center;margin-top:4px">DESVIO EVIDENCIADO / DESCRIÇÃO</div>

        <label style="grid-column:1/-1"><span class="small">Desvio evidenciado — resumo</span><textarea id="admModRncSummary" placeholder="Resumo curto do problema"></textarea></label>
        <label style="grid-column:1/-1"><span class="small">Descrição detalhada da ocorrência</span><textarea id="admModRncDetailedDescription" placeholder="Relate objetivamente o problema encontrado"></textarea></label>

        <div style="grid-column:1/-1;padding:10px 12px;background:#1f4e78;color:#fff;border-radius:8px;font-weight:700;text-align:center;margin-top:4px">EFEITO DO DESVIO</div>

        <label style="grid-column:1/-1"><span class="small">Efeito observado / impacto do desvio</span><textarea id="admModRncEffect" placeholder="Informe o efeito ou impacto observado"></textarea></label>

        <div style="grid-column:1/-1;padding:10px 12px;background:#1f4e78;color:#fff;border-radius:8px;font-weight:700;text-align:center;margin-top:4px">REGISTRO FOTOGRÁFICO</div>
        <div style="grid-column:1/-1">${rncPhotoInputsHtml()}</div>
      </div>

      <!-- ==========================================================
           NC INTERNA — CAMPOS PRÓPRIOS DA NC INTERNA
           ========================================================== -->
      <div id="admModNcInternalFields" style="display:none!important">
        <label><span class="small">Processo / requisito / fonte</span><input id="admModCode" placeholder="Processo, requisito, norma ou fonte"></label>
        <label><span class="small">Unidade</span><input id="admModLocation" placeholder="Unidade"></label>
        <label><span class="small">Setor responsável</span><input id="admModSector" placeholder="Setor responsável"></label>
        <label><span class="small">Responsável</span><input id="admModResponsible" placeholder="Responsável pelo tratamento"></label>
        <label><span class="small">Prazo</span><input id="admModDueDate" type="date"></label>
        ${commonStatus}
        <label><span class="small">Gravidade</span><select id="admModSeverity"><option value="low">Baixa</option><option value="medium">Média</option><option value="high">Alta</option><option value="critical">Crítica</option></select></label>
        <label><span class="small">CAPA vinculada?</span><select id="admModCapa"><option value="no">Não</option><option value="yes">Sim</option></select></label>
        <label style="grid-column:1/-1"><span class="small">Descrição objetiva da não conformidade</span><textarea id="admModDescription" placeholder="Descreva o desvio..."></textarea></label>
        <label style="grid-column:1/-1"><span class="small">Contenção / ação / evidência</span><textarea id="admModAction" placeholder="Contenção, ação e evidências..."></textarea></label>
      </div>
    `,
    documents:`
      <label><span class="small">Documento solicitado *</span>
        <select id="admModCode">
          ${documentTypeOptions(getSession()?.role==='quality'?'filial':explicitPortalUnit(getSession()?.unit)||'matriz')}
        </select>
      </label>
      <label><span class="small">Título / necessidade *</span><input id="admModTitle" placeholder="Ex.: FISPQ do produto 123"></label>
      <label><span class="small">Área solicitante</span><input id="admModSector" placeholder="Setor solicitante"></label>
      <label><span class="small">Cliente / destinatário</span><input id="admModLocation" placeholder="Cliente, representante ou destino"></label>
      <label><span class="small">Produto / código</span><input id="admModProduct" placeholder="Código ou descrição do produto"></label>
      <label><span class="small">Pedido</span><input id="admModOrder" placeholder="Nº do pedido"></label>
      <label><span class="small">Nota Fiscal</span><input id="admModInvoice" placeholder="Nº da NF"></label>
      <label><span class="small">Quantidade</span><input id="admModQuantity" type="number" min="0" step="1"></label>
      <label><span class="small">Idioma</span><select id="admModLanguage"><option value="Português">Português</option><option value="Inglês">Inglês</option><option value="Espanhol">Espanhol</option><option value="Outro">Outro</option></select></label>
      <label><span class="small">Prazo necessário</span><input id="admModDueDate" type="date"></label>
      <label><span class="small">Quem deve receber</span><input id="admModRecipient" placeholder="Nome do destinatário"></label>
      <label><span class="small">E-mail do destinatário</span><input id="admModRecipientEmail" type="email" placeholder="email@empresa.com"></label>
      <label><span class="small">Status</span><select id="admModStatus">
        <option value="open">Solicitado</option>
        <option value="doc_analysis">Em análise</option>
        <option value="doc_preparation">Em preparação</option>
        <option value="doc_ready">Pronto para entrega</option>
        <option value="done">Entregue</option>
        <option value="cancelled">Cancelado</option>
      </select></label>
      <label><span class="small">Responsável SGQ</span><input id="admModResponsible" placeholder="Responsável pelo atendimento"></label>
      <label style="grid-column:1/-1"><span class="small">Informações obrigatórias no documento</span><textarea id="admModAction" placeholder="Informe dados, requisitos ou informações que precisam constar no documento."></textarea></label>
      <label style="grid-column:1/-1"><span class="small">Observações</span><textarea id="admModDescription" placeholder="Explique a necessidade ou inclua observações adicionais."></textarea></label>
      <label style="grid-column:1/-1"><span class="small">Documento entregue / link</span><input id="admModLink" placeholder="Cole aqui o link quando o documento estiver pronto."></label>`,
    processes:`
      <label>Unidade *<select id="admModProcessUnit" onchange="document.getElementById('admModDocType').innerHTML=nucleoProcessTypeOptions(this.value)" ${getSession()?.role==='quality'?'disabled':''}><option value="matriz">SETA SC — Matriz</option><option value="filial" ${getSession()?.role==='quality'?'selected':''}>SETA ES — Linhares</option></select></label>
      <label><span class="small">Tipo de documento *</span><select id="admModDocType">
        ${nucleoProcessTypeOptions(getSession()?.role==='quality'?'filial':explicitPortalUnit(getSession()?.unit)||'matriz')}</select></label>
      <label><span class="small">Código do documento *</span><input id="admModCode" placeholder="Ex.: POP-QUA-001"></label>
      <label><span class="small">Título do documento *</span><input id="admModTitle" placeholder="Nome do documento interno"></label>
      <label><span class="small">Área / processo</span><input id="admModSector" placeholder="Setor ou processo relacionado"></label>
      <label><span class="small">Responsável pelo documento</span><input id="admModResponsible" placeholder="Responsável"></label>
      <label><span class="small">Revisão</span><input id="admModRevision" placeholder="Ex.: 03"></label>
      <label><span class="small">Data da revisão</span><input id="admModEventDate" type="date"></label>
      <label><span class="small">Próxima revisão</span><input id="admModDueDate" type="date"></label>
      <label><span class="small">Status</span><select id="admModStatus">
        <option value="published">Vigente</option>
        <option value="review">Em revisão</option>
        <option value="approval">Aguardando aprovação</option>
        <option value="obsolete">Obsoleto / substituído</option>
      </select></label>
      <label style="grid-column:1/-1"><span class="small">Descrição / finalidade</span><textarea id="admModDescription" placeholder="Resumo da finalidade ou aplicação do documento."></textarea></label>
      <label style="grid-column:1/-1"><span class="small">Link do documento interno *</span><input id="admModLink" placeholder="Cole o link do Drive ou repositório interno"></label>`
  };
  return map[key]||'';
}

function showAdminOperationalModule(key){
  const permissionModule={nc_capa:'nc',nccapa:'nc',documents:'documents',equipment:'equipment',training:'training',processes:'processes'}[key]||key;if(getSession()?.permissions&&!nucleoPersonCan(permissionModule)){alert('Seu cadastro não tem acesso a esta área.');return;}

  const documentsUserAccess=key==='documents' && canRequestDocuments();
  const ncCapaAccess=key==='nccapa' && canOperateNcCapa();
  if(!isAdmin()&&!documentsUserAccess&&!ncCapaAccess){
    alert(key==='documents'?'Solicitação de Documentos não está disponível para este setor.':'Este módulo está disponível para o SGQ.');
    return;
  }
  const m=ADMIN_OPERATIONAL_MODULES[key]; if(!m)return;
  const navMap={equipment:'navEquipment',training:'navTraining',nccapa:'navNcCapa',documents:(isAdmin()?'navDocuments':'navDocumentRequests'),processes:'navProcesses'};
  view('adminModuleView'); setNav(navMap[key]);
  const title=document.getElementById('adminModuleTitle'), sub=document.getElementById('adminModuleSubtitle'), list=document.getElementById('adminModuleContent'), eyebrow=document.getElementById('adminModuleEyebrow');
  if(title)title.textContent=m.title; if(sub)sub.textContent=m.desc; if(eyebrow)eyebrow.textContent=m.eyebrow; if(!list)return;
  if(list&&key==='documents'){}
  window.nucleoManagerModuleKey=key;
  const allModuleRecords=getAdminModuleRecords().filter(r=>r.module===key&&nucleoManagerScopeAllows(r));
  const records=(key==='documents'&&!isAdmin())
    ? allModuleRecords.filter(r=>normalizeAnswer(r.createdBy||'')===normalizeAnswer(getSession()?.name||''))
    : allModuleRecords;
  const pending=records.filter(r=>isAdminModulePending(r,key)).length;
  const done=records.filter(r=>['done','published'].includes(r.status)).length;
  const visibleCards=((key==='documents'&&!isAdmin())?m.cards.slice(0,2):m.cards).filter(c=>nucleoWorkspaceAllowed(key,c[2]||'history'));
  list.innerHTML=`<div style="grid-column:1/-1">
    <div style="font-size:11px;letter-spacing:.18em;color:#1455ff;font-weight:700;margin-bottom:10px">${escapeHtml(m.eyebrow)}</div>
    <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-bottom:18px">
      <div class="card" style="padding:16px"><span class="small">REGISTROS</span><div style="font-size:28px;font-weight:700;margin-top:5px">${records.length}</div></div>
      <div class="card" style="padding:16px"><span class="small">PENDÊNCIAS</span><div style="font-size:28px;font-weight:700;margin-top:5px">${pending}</div></div>
      <div class="card" style="padding:16px"><span class="small">CONCLUÍDOS</span><div style="font-size:28px;font-weight:700;margin-top:5px">${done}</div></div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:14px;margin-bottom:20px">
      ${visibleCards.map((c,i)=>`<button type="button" class="card" onclick="openAdminOperationalWorkspace('${key}',${m.cards.indexOf(c)})" style="text-align:left;cursor:pointer;min-height:165px;padding:18px;background:#fff">
        <div style="width:38px;height:38px;border-radius:12px;background:#eef4ff;display:grid;place-items:center;color:#1455ff;font-size:20px;margin-bottom:16px">${i===0?'＋':i===1?'◷':i===2?'▣':'↶'}</div>
        <b style="display:block;font-size:15px;margin-bottom:8px">${escapeHtml(c[0])}</b>
        <span class="small" style="display:block;line-height:1.45">${escapeHtml(c[1])}</span>
        <span style="display:block;color:#1455ff;font-size:12px;margin-top:14px">Abrir operação →</span>
      </button>`).join('')}
    </div>
    ${key==='nccapa'
      ? `<div id="ncModuleInlineOverview"></div>`
      : `<div class="card" style="padding:20px;display:flex;justify-content:space-between;gap:18px;align-items:center;flex-wrap:wrap">
          <div><b>Espaço de trabalho</b><p class="muted" style="margin:8px 0 0">Escolha um subtópico acima ou abra um novo registro agora.</p></div>
          ${nucleoWorkspaceAllowed(key,m.cards[0][2])?`<button class="btn primary" type="button" onclick="openAdminOperationalWorkspace('${key}',0)">＋ Novo registro</button>`:''}
        </div>`}
  </div>`;

  if(key==='nccapa')renderNcCapaHomeOverview();
}

function openAdminOperationalWorkspace(key,index){
  const canOpen =
    isAdmin() ||
    (key==='documents' && canRequestDocuments()) ||
    (key==='nccapa' && canOperateNcCapa());
  if(!canOpen)return;
  const m=ADMIN_OPERATIONAL_MODULES[key], c=m?.cards?.[index]; if(!c)return;
  if(!isAdmin()&&key==='documents'&&index>1)return;
  const mode=c[2]||'history';
  if(!nucleoWorkspaceAllowed(key,mode)){const [module,feature]=nucleoWorkspaceFeature(key,mode);nucleoFeatureRequire(module,feature);return;}
  const title=document.getElementById('adminModuleTitle'), sub=document.getElementById('adminModuleSubtitle'), list=document.getElementById('adminModuleContent'), eyebrow=document.getElementById('adminModuleEyebrow');
  if(title)title.textContent=c[0];
  if(sub)sub.textContent=c[1];
  if(!list)return;
  const records=filterAdminModuleRecords(key,mode);
  const back=`<button class="btn secondary" type="button" onclick="showAdminOperationalModule('${key}')">← Voltar ao módulo</button>`;
  if(key==='documents'&&mode==='standards'){renderStandardDocumentsWorkspace();return}
  if(key==='documents'&&mode==='deliveries'){renderDocumentDeliveriesWorkspace();return}
  if(key==='processes'&&mode==='templates'){window.nucleoRncTemplateEditorOpen=false;window.nucleoProcessTemplateEditor='';renderProcessTemplatesWorkspace();return}
  if(key==='nccapa'&&mode==='active'){renderNcCapaTreatmentWorkspace();return}
  if(mode==='new'||mode==='new_internal'||mode==='new_rnc'){
    list.innerHTML=`<div style="grid-column:1/-1">${back}
      <div class="card" style="margin-top:14px;padding:20px">
        <div style="display:flex;justify-content:space-between;gap:14px;align-items:flex-start;margin-bottom:16px">
          <div><b>${escapeHtml(c[0])}</b><div class="small" style="margin-top:4px">${escapeHtml(c[1])}</div></div>
          <span class="pill">Módulo operacional</span>
        </div>
        <div class="grid" style="grid-template-columns:repeat(2,minmax(0,1fr));gap:12px">${adminModuleFields(key)}</div>
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px">
          <button class="btn secondary" type="button" onclick="showAdminOperationalModule('${key}')">Cancelar</button>
          <button class="btn primary" type="button" onclick="saveAdminOperationalRecord('${key}')">Salvar registro</button>
        </div>
      </div>
    </div>`;
    if(key==='nccapa'){
      const type=document.getElementById('admModNcType');
      if(type)type.value='supplier';
      updateNcCapaFormType();
      if(mode==='new_rnc'){
        window.__rncPhotoUploadKey='RNC-TEMP-'+Date.now();
        const setor=document.getElementById('admModRncSector');
        if(setor&&!setor.value)setor.value=String(getSession()?.sector||'');

        // IMPORTANTE: no cadastro NOVO da RNC, o input de foto precisa
        // receber o onchange que comprime, fixa no hidden e mostra a prévia.
        // Antes isso só acontecia ao EDITAR uma RNC já existente.
        bindRncPhotoInputs({});
      }
      activateNcCapaForm();
      setTimeout(activateNcCapaForm,0);
    }
    if(key==='documents'&&!isAdmin()){
      const st=document.getElementById('admModStatus');if(st){st.value='open';st.disabled=true}
      const resp=document.getElementById('admModResponsible');if(resp)resp.closest('label')?.classList.add('hidden');
      const link=document.getElementById('admModLink');if(link)link.closest('label')?.classList.add('hidden');
      const sector=document.getElementById('admModSector');if(sector&&!sector.value)sector.value=getSession()?.sector||'';
      const rec=document.getElementById('admModRecipient');if(rec&&!rec.value)rec.value=getSession()?.name||'';
      const mail=document.getElementById('admModRecipientEmail');if(mail&&!mail.value)mail.value=getSession()?.email||'';
    }
    return;
  }
  list.innerHTML=`<div style="grid-column:1/-1">${back}
    <div class="card" style="margin-top:14px;padding:0;overflow:hidden">
      ${records.length?`<table style="width:100%"><thead><tr><th>${key==='processes'?'Documento interno':key==='documents'?'Solicitação':'Registro'}</th><th>${key==='documents'?'Solicitante / área':'Responsável / área'}</th><th>Prazo</th><th>Status</th><th>Ações</th></tr></thead><tbody>
        ${records.map(r=>`<tr>
          <td><b>${escapeHtml(key==='nccapa'&&r.rncNumber?(r.rncNumber+' · '+(r.title||'Sem título')):(r.title||'Sem título'))}</b><div class="small">${escapeHtml(key==='nccapa'?('Fornecedor: '+(r.supplier||'—')+(r.relatedRo?' • R.O.: '+r.relatedRo:'')):(r.code||r.description||''))}</div></td>
          <td>${escapeHtml(key==='documents'?(r.createdBy||r.sector||'—'):(r.responsible||r.sector||r.location||'—'))}</td>
          <td>${escapeHtml(adminModuleDate(r.dueDate))}</td>
          <td><span class="pill">${escapeHtml(adminModuleStatusLabel(r.status))}</span></td>
          <td><div style="display:flex;gap:7px;flex-wrap:wrap">
            <button class="btn secondary" type="button" onclick="editAdminOperationalRecord('${escapeHtml(r.id)}')">Abrir</button>
            ${key==='nccapa'&&r.ncType==='supplier'?`<button class="btn danger" type="button" onclick="deleteAdminOperationalRecord('${escapeHtml(r.id)}')">Excluir RNC</button>`:''}
          </div></td>
        </tr>`).join('')}
      </tbody></table>`:`<div style="padding:28px"><b>Nenhum registro nesta visão.</b><div class="small" style="margin-top:6px">Quando houver registros compatíveis com este status, eles aparecerão aqui.</div></div>`}
    </div>
  </div>`;
}


if(typeof window.nucleoRncTemplateEditorOpen!=='boolean')window.nucleoRncTemplateEditorOpen=false;
if(typeof window.nucleoProcessTemplateEditor!=='string')window.nucleoProcessTemplateEditor='';

function nucleoOpenProcessTemplateEditor(kind){
  window.nucleoProcessTemplateEditor=String(kind||'');
  window.nucleoRncTemplateEditorOpen=window.nucleoProcessTemplateEditor==='rnc';
  renderProcessTemplatesWorkspace();
  setTimeout(()=>document.getElementById('nucleoInlineProcessEditor')?.scrollIntoView({behavior:'smooth',block:'start'}),0);
}
function nucleoCloseProcessTemplateEditor(){
  window.nucleoProcessTemplateEditor='';
  window.nucleoRncTemplateEditorOpen=false;
  renderProcessTemplatesWorkspace();
}
function nucleoOpenSystemModelEditor(kind){
  if(!['ro','sac','pdca'].includes(kind))return;
  nucleoOpenProcessTemplateEditor(kind);
}
function nucleoOpenFreeDocumentEditorInline(id){
  if(!id)return;
  nucleoOpenProcessTemplateEditor('free:'+id);
}
function nucleoOpenRncTemplateEditor(){
  nucleoOpenProcessTemplateEditor('rnc');
}
function nucleoCloseRncTemplateEditor(){
  nucleoCloseProcessTemplateEditor();
}

function renderProcessTemplatesWorkspace(){
  const list=document.getElementById('adminModuleContent');if(!list)return;const t=getRncProcessTemplate();
  const active=String(window.nucleoProcessTemplateEditor||'');
  window.nucleoRncTemplateEditorOpen=active==='rnc';
  const base=`<div style="grid-column:1/-1"><button class="btn secondary" type="button" onclick="showAdminOperationalModule('processes')">← Voltar ao módulo</button><button class="btn primary" onclick="nucleoDriveOpen('templates')">Modelos de documentos solicitados</button>${processDocumentLibraryHtml()}`;
  if(!active){
    list.innerHTML=base+`</div>`;
    return;
  }
  if(['ro','sac','pdca'].includes(active)){
    list.innerHTML=base+`<div id="nucleoInlineProcessEditor" class="card" style="margin-top:14px;padding:0;overflow:hidden;min-height:620px;height:calc(100vh - 180px)"><div style="padding:20px">Carregando editor…</div></div></div>`;
    setTimeout(()=>nucleoEditRoModelVisual(active,true),0);
    return;
  }
  if(active.startsWith('free:')){
    const id=active.slice(5);
    list.innerHTML=base+`<div id="nucleoInlineProcessEditor" class="card" style="margin-top:14px;padding:0;overflow:hidden;min-height:620px;height:calc(100vh - 180px)"><div style="padding:20px">Carregando editor…</div></div></div>`;
    setTimeout(()=>nucleoOpenFreeDocumentEditor(id,true),0);
    return;
  }
  list.innerHTML=base+`
  <div class="card" style="margin-top:14px;padding:20px">
    <div style="display:flex;justify-content:space-between;gap:16px;align-items:flex-start;flex-wrap:wrap"><div><div class="small" style="letter-spacing:.12em;color:#1455ff;font-weight:700">MODELO CONTROLADO</div><h3 style="margin:6px 0 4px">${escapeHtml(t.code)} · ${escapeHtml(t.name)}</h3><div class="small">A prévia mantém a estrutura do formulário padrão atual. Aqui você controla a identidade SETA e quais partes entram no documento, sem precisar editar o Excel.</div></div><div style="display:flex;gap:8px;align-items:center"><span class="pill">${t.status==='obsolete'?'Obsoleto':'Vigente'}</span><button class="btn secondary" type="button" onclick="nucleoCloseRncTemplateEditor()">Fechar editor</button></div></div>
    <div id="rncTemplateEditorSplit" style="display:grid;grid-template-columns:minmax(430px,.95fr) minmax(520px,1.35fr);gap:18px;margin-top:18px;align-items:start;height:calc(100vh - 185px);min-height:560px;overflow:hidden">
      <div id="rncTemplateControlsScroll" style="display:grid;gap:12px;overflow-y:auto;overflow-x:hidden;height:100%;padding-right:10px;align-content:start;scrollbar-gutter:stable">
        <label><span class="small">Código do formulário</span><input id="tplCode" oninput="scheduleRncTemplatePreview()" value="${escapeHtml(t.code)}"></label>
        <label><span class="small">Nome</span><input id="tplName" oninput="scheduleRncTemplatePreview()" value="${escapeHtml(t.name)}"></label>
        <label><span class="small">Revisão</span><input id="tplRevision" oninput="scheduleRncTemplatePreview()" value="${escapeHtml(t.revision)}"></label>
        <label><span class="small">Título no documento</span><input id="tplTitle" oninput="scheduleRncTemplatePreview()" value="${escapeHtml(t.title)}"></label>
        <div style="border:1px solid #e3e8f1;border-radius:12px;padding:12px;display:grid;gap:9px"><b style="font-size:13px">Textos fixos do documento</b><div class="small">Estes textos fazem parte do modelo e podem ser alterados aqui.</div><label><span class="small">Título da resposta</span><input id="tplSupplierResponseTitle" oninput="scheduleRncTemplatePreview()" value="${escapeHtml(t.supplierResponseTitle||'RESPOSTA DO FORNECEDOR')}"></label><label><span class="small">Orientação da resposta do fornecedor</span><textarea id="tplSupplierResponseNote" oninput="scheduleRncTemplatePreview()" style="min-height:70px">${escapeHtml(t.supplierResponseNote||'')}</textarea></label><label><span class="small">Texto do rodapé</span><textarea id="tplFooterText" oninput="scheduleRncTemplatePreview()" placeholder="Digite o conteúdo fixo que deve aparecer no rodapé" style="min-height:70px">${escapeHtml(t.footerText||'')}</textarea></label></div>
        <div style="border:1px solid #e3e8f1;border-radius:12px;padding:12px;display:grid;gap:9px"><b style="font-size:13px">Páginas e padrões</b><div class="small">Separe a parte interna da resposta do fornecedor e reutilize cabeçalho/rodapé como padrão.</div><label style="display:flex;gap:8px;align-items:center"><input id="tplPageBreakSupplier" type="checkbox" style="width:auto" ${t.pageBreakBeforeSupplier!==false?'checked':''} onchange="refreshRncTemplatePreview()"> Iniciar a parte do fornecedor em uma nova página</label><label style="display:flex;gap:8px;align-items:center"><input id="tplRepeatHeader" type="checkbox" style="width:auto" ${t.repeatHeaderOnPages!==false?'checked':''} onchange="refreshRncTemplatePreview()"> Repetir cabeçalho em todas as páginas</label><label style="display:flex;gap:8px;align-items:center"><input id="tplRepeatFooter" type="checkbox" style="width:auto" ${t.repeatFooterOnPages!==false?'checked':''} onchange="refreshRncTemplatePreview()"> Repetir rodapé em todas as páginas</label><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><button class="btn secondary" type="button" onclick="saveRncHeaderAsStandard()">Fixar cabeçalho como padrão</button><button class="btn secondary" type="button" onclick="saveRncFooterAsStandard()">Fixar rodapé como padrão</button><button class="btn secondary" type="button" onclick="applyRncHeaderStandard()">Aplicar cabeçalho padrão</button><button class="btn secondary" type="button" onclick="applyRncFooterStandard()">Aplicar rodapé padrão</button></div><div><span class="small">Formato de envio ao fornecedor</span><div style="margin-top:5px;padding:9px 11px;border:1px solid #d8e0ea;border-radius:9px;background:#f8fafc">PDF fechado + documento editável (.docx)</div></div></div>
        <div style="border:1px solid #e3e8f1;border-radius:12px;padding:12px"><b style="font-size:13px">Identidade SETA</b><div class="small" style="margin:3px 0 9px">Envie a logo que deve aparecer no cabeçalho do formulário e do PDF.</div>
          <div id="tplLogoCurrent" style="min-height:64px;border:1px dashed #cbd5e1;border-radius:10px;display:flex;align-items:center;justify-content:center;padding:8px;background:#fff">${rncTemplateLogoHtml(t,true)}</div>
          <input id="tplLogoFile" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" style="margin-top:8px" onchange="handleRncTemplateLogoUpload(this)">
          <input id="tplLogoData" type="hidden" value="${escapeHtml(t.logoDataUrl||'')}">
          <div style="display:flex;gap:8px;margin-top:8px"><label style="flex:1"><span class="small">Texto alternativo</span><input id="tplLogoText" oninput="scheduleRncTemplatePreview()" value="${escapeHtml(t.logoText||'SETA')}"></label><label style="width:92px"><span class="small">Cor</span><input id="tplAccent" type="color" value="${escapeHtml(t.accent||'#1f4e78')}" style="height:42px;padding:4px"></label></div>
          <button class="btn secondary" type="button" style="margin-top:8px" onclick="removeRncTemplateLogo()">Remover logo enviada</button>
        </div>
        <div style="border:1px solid #e3e8f1;border-radius:12px;padding:12px"><b style="font-size:13px">Padrão visual de base</b><div class="small" style="margin:3px 0 8px">Escolha um dos padrões salvos para carregar suas proporções e identidade. Depois você ainda pode personalizar este documento.</div><select id="tplLayoutBase" onchange="if(this.value)applyProcessLayoutToRnc(this.value)"><option value="">Layout independente</option>${getProcessLayouts().filter(x=>x.status!=='obsolete').map(x=>`<option value="${x.id}" ${t.layoutId===x.id?'selected':''}>${escapeHtml(x.name)}</option>`).join('')}</select></div>
        <div style="border:1px solid #e3e8f1;border-radius:12px;padding:12px"><b style="font-size:13px">Proporções do documento</b><div class="small" style="margin:3px 0 9px">Ajuste cabeçalho, linhas e texto. A prévia acompanha as alterações.</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:9px"><label><span class="small">Logo / cabeçalho (%)</span><input id="tplLogoWidth" type="number" min="12" max="30" value="${Number(t.layout?.logoWidth)||19}" oninput="refreshRncTemplatePreview()"></label><label><span class="small">Código/revisão (%)</span><input id="tplMetaWidth" type="number" min="18" max="36" value="${Number(t.layout?.metaWidth)||25}" oninput="refreshRncTemplatePreview()"></label><label><span class="small">Altura cabeçalho (mm)</span><input id="tplHeaderHeight" type="number" min="9" max="24" value="${Number(t.layout?.headerHeight)||13}" oninput="refreshRncTemplatePreview()"></label><label><span class="small">Altura linhas (mm)</span><input id="tplRowHeight" type="number" min="5" max="14" value="${Number(t.layout?.rowHeight)||7}" oninput="refreshRncTemplatePreview()"></label><label><span class="small">Espessura linhas (px)</span><input id="tplBorderWidth" type="number" min="0.4" max="2" step="0.1" value="${Number(t.layout?.borderWidth)||0.65}" oninput="refreshRncTemplatePreview()"></label><label><span class="small">Texto (%)</span><input id="tplFontScale" type="number" min="80" max="125" step="5" value="${Number(t.layout?.fontScale)||100}" oninput="refreshRncTemplatePreview()"></label><label><span class="small">Altura das faixas (mm)</span><input id="tplSectionHeight" type="number" min="4" max="9" value="${Number(t.layout?.sectionHeight)||5}" oninput="refreshRncTemplatePreview()"></label></div><button class="btn secondary" type="button" style="margin-top:9px" onclick="compactRncTemplateLayout()">Proporções compactas</button></div>
        <div style="border:1px solid #e3e8f1;border-radius:12px;padding:12px"><div><b style="font-size:13px">Grade do cabeçalho</b><div class="small" style="margin:3px 0 9px">Título, Área, Código, Revisão, Registro e Página ficam na mesma grade. Ajuste largura e altura como nos campos do documento; na folha, arraste as divisórias.</div></div><div id="tplHeaderLayoutList" style="display:grid;gap:8px">${renderRncHeaderLayoutEditor(t)}</div><input id="tplHeaderLayoutData" type="hidden" value="${escapeHtml(JSON.stringify(t.headerLayout||defaultRncHeaderLayout()))}"></div>
        <div style="border:1px solid #e3e8f1;border-radius:12px;padding:12px"><b style="font-size:13px">Imagens fixas do layout</b><div class="small" style="margin:3px 0 9px">Para selo, marca, certificação ou outro elemento que deve aparecer em todas as RNCs.</div><div id="tplFixedImagesList">${renderRncFixedImagesEditor(t)}</div><input id="tplFixedImageFile" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onchange="addRncFixedImage(this)"><input id="tplFixedImagesData" type="hidden" value="${escapeHtml(JSON.stringify(t.fixedImages||[]))}"></div>
        <div style="border:1px solid #e3e8f1;border-radius:12px;padding:12px"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><div><b style="font-size:13px">Campos de foto</b><div class="small">Espaços preenchidos com fotos de cada RNC.</div></div><button class="btn secondary" type="button" onclick="addRncPhotoField()">+ Campo de foto</button></div><div id="tplPhotoFieldsList" style="display:grid;gap:7px;margin-top:9px">${renderRncPhotoFieldsEditor(t)}</div><input id="tplPhotoFieldsData" type="hidden" value="${escapeHtml(JSON.stringify(t.photoFields||[]))}"></div>
        <div style="border:1px solid #e3e8f1;border-radius:12px;padding:12px"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><div><b style="font-size:13px">Editor completo dos campos</b><div class="small">Edite texto, sequência, largura e dado de origem. Use ↑ ↓ para reorganizar.</div></div><button class="btn secondary" type="button" onclick="addRncLayoutField()">+ Campo</button></div><div id="tplFieldLayoutList" style="display:grid;gap:7px;margin-top:9px">${renderRncFieldLayoutEditor(t)}</div><input id="tplFieldLayoutData" type="hidden" value="${escapeHtml(JSON.stringify(t.fieldLayout||defaultRncFieldLayout()))}"></div>
        <div><span class="small">Seções do padrão</span><div style="display:grid;gap:7px;margin-top:7px">${t.sections.map((x,i)=>`<label style="display:grid;grid-template-columns:auto minmax(0,1fr) 112px auto;align-items:center;gap:8px;border:1px solid #e3e8f1;border-radius:10px;padding:9px 10px"><input type="checkbox" id="tplSec${i}" ${x.enabled?'checked':''} style="width:auto" onchange="refreshRncTemplatePreview()"><input id="tplSecLabel${i}" value="${escapeHtml(x.label)}" oninput="scheduleRncTemplatePreview()" style="border:0;padding:2px;background:transparent;min-width:0"><select id="tplSecAlign${i}" onchange="refreshRncTemplatePreview()" title="Alinhamento do título da seção" style="padding:6px 7px"><option value="left" ${(x.align||'left')==='left'?'selected':''}>Esquerda</option><option value="center" ${x.align==='center'?'selected':''}>Centralizado</option><option value="right" ${x.align==='right'?'selected':''}>Direita</option></select><select id="tplSecOwner${i}" onchange="refreshRncTemplatePreview()" title="Quem preenche esta seção" style="padding:6px 7px"><option value="sgq" ${(x.owner||'sgq')==='sgq'?'selected':''}>Interno / SETA</option><option value="supplier" ${x.owner==='supplier'?'selected':''}>Fornecedor</option><option value="footer" ${x.owner==='footer'?'selected':''}>Rodapé</option></select></label>`).join('')}</div><div class="small" style="margin-top:6px">Você decide livremente se cada seção pertence à parte interna, à parte do fornecedor ou ao rodapé repetido.</div></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn primary" type="button" onclick="saveRncProcessTemplateFromForm()">Salvar modelo</button><button class="btn secondary" type="button" onclick="resetRncProcessTemplate()">Restaurar padrão</button></div>
      </div>
      <div id="rncTemplatePreviewColumn" style="position:relative;align-self:start;height:100%;overflow:hidden"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;gap:12px"><div><b>Prévia ao vivo</b><div class="small">Clique nas células, arraste a divisória e edite a grade diretamente na folha.</div></div><div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;justify-content:flex-end"><button class="btn secondary" type="button" onclick="changeRncPreviewZoom(-10)" title="Diminuir somente o documento">−</button><button id="rncPreviewZoomLabel" class="btn secondary" type="button" onclick="setRncPreviewZoom(100)" title="Voltar para 100% do ajuste">100%</button><button class="btn secondary" type="button" onclick="changeRncPreviewZoom(10)" title="Aumentar somente o documento">+</button><button class="btn secondary" type="button" onclick="setRncPreviewZoom('fit')" title="Ajustar a folha inteira à área disponível">Ajustar</button><button class="btn secondary" type="button" onclick="refreshRncTemplatePreview()">Atualizar</button></div></div><div id="rncGridToolbar"></div><div id="rncTemplatePreview" style="overflow:hidden;border-radius:14px;height:calc(100% - 88px)"></div></div>
    </div>
  </div></div>`;
  const editor=list.querySelector('.card[style*="margin-top:14px"]');
  if(!nucleoProcessShowRetired&&!getProcessTemplates().some(x=>x.kind==='RNC'&&x.status!=='obsolete')){editor?.remove();window.nucleoRncTemplateEditorOpen=false;return;}
  if(editor){editor.addEventListener('input',e=>{if(e.target.closest('#rncTemplatePreview'))return;if(e.target.matches('input,select,textarea'))scheduleRncTemplatePreview()});editor.addEventListener('change',e=>{if(e.target.closest('#rncTemplatePreview'))return;if(e.target.matches('input,select,textarea'))scheduleRncTemplatePreview()})}
  refreshRncTemplatePreview();
}

function editAdminOperationalRecord(id){
  const r=adminModuleRecord(id); if(!r)return;
  const key=r.module, m=ADMIN_OPERATIONAL_MODULES[key];
  if(!isAdmin()){
    const podeDocumento=key==='documents'&&normalizeAnswer(r.createdBy||'')===normalizeAnswer(getSession()?.name||'');
    const podeRnc=key==='nccapa'&&canOperateNcCapa();
    if(!podeDocumento&&!podeRnc)return;
  }
  view('adminModuleView');
  const title=document.getElementById('adminModuleTitle'), sub=document.getElementById('adminModuleSubtitle'), list=document.getElementById('adminModuleContent'), eyebrow=document.getElementById('adminModuleEyebrow');
  if(title)title.textContent='Editar registro';
  if(sub)sub.textContent=m?.title||'Módulo ADM';
  list.innerHTML=`<div style="grid-column:1/-1">
    <button class="btn secondary" type="button" onclick="showAdminOperationalModule('${key}')">← Voltar ao módulo</button>
    <div class="card" style="margin-top:14px;padding:20px">
      <div class="grid" style="grid-template-columns:repeat(2,minmax(0,1fr));gap:12px">${adminModuleFields(key)}</div>
      <div style="display:flex;justify-content:space-between;gap:8px;margin-top:16px">
        <button class="btn secondary" type="button" onclick="deleteAdminOperationalRecord('${escapeHtml(r.id)}')">Excluir</button>
        <div style="display:flex;gap:8px;flex-wrap:wrap">${key==='nccapa'&&r.ncType==='supplier'?`<button class="btn secondary" type="button" onclick="printRncStandard('${escapeHtml(r.id)}')">Gerar PDF padrão</button>`:''}<button class="btn primary" type="button" onclick="saveAdminOperationalRecord('${key}','${escapeHtml(r.id)}')">Salvar alterações</button></div>
      </div>
    </div>
  </div>`;
  if(key==='processes'){document.getElementById('admModProcessUnit').value=explicitRecordUnit(r)||(getSession()?.role==='quality'?'filial':'matriz');document.getElementById('admModDocType').innerHTML=nucleoProcessTypeOptions(document.getElementById('admModProcessUnit').value,r.docType);nucleoProcessReportsPanel(r);}
  if(key==='equipment'){document.getElementById('admModEquipmentUnit').value=explicitRecordUnit(r)||(getSession()?.role==='quality'?'filial':'');nucleoEquipmentReportsPanel(r);}
  const set=(id,v)=>{const el=document.getElementById(id);if(el)el.value=v||''};
  set('admModNcType',r.ncType||'internal');set('admModNcOrigin',r.ncOrigin||'direct');set('admModSupplier',r.supplier);set('admModRelatedRo',r.relatedRo);
  [['admModRncReporter','rncReporter'],['admModRncShift','rncShift'],['admModRncSupervisor','rncSupervisor'],['admModRncManager','rncManager'],['admModRncSector','sector'],['admModRncBlockArea','rncBlockArea'],['admModRncBlockStage','rncBlockStage'],['admModRncSummary','rncSummary'],['admModRncDetailedDescription','rncDetailedDescription'],['admModRncEffect','rncEffect']].forEach(([id,k])=>set(id,r[k]));
  renderRncBlockItems(legacyRncBlockItems(r));
  bindRncPhotoInputs(r.rncPhotos||{});
  set('admModTitle',r.title);set('admModCode',r.code);set('admModLocation',r.location);set('admModSector',r.sector);
  set('admModResponsible',r.responsible);set('admModEventDate',r.eventDate);set('admModDueDate',r.dueDate);set('admModStatus',r.status);
  set('admModEffectiveness',r.effectiveness);set('admModSeverity',r.severity);set('admModCapa',r.capa);
  set('admModDescription',r.description);set('admModAction',r.action);set('admModLink',r.link);
  set('admModProduct',r.product);set('admModOrder',r.order);set('admModInvoice',r.invoice);
  set('admModQuantity',r.quantity);set('admModLanguage',r.language);set('admModRecipient',r.recipient);
  set('admModRecipientEmail',r.recipientEmail);set('admModDocType',r.docType);set('admModRevision',r.revision);
  if(key==='nccapa'){
    updateNcCapaFormType();
    activateNcCapaForm();
    setTimeout(activateNcCapaForm,0);
  }
  if(key==='documents'&&!isAdmin()){
    const st=document.getElementById('admModStatus');if(st)st.disabled=true;
    const resp=document.getElementById('admModResponsible');if(resp)resp.disabled=true;
    const link=document.getElementById('admModLink');if(link)link.disabled=true;
  }
}

const ndOriginalShowAdmin=showAdminOperationalModule;
showAdminOperationalModule=function(key){const result=ndOriginalShowAdmin(key);const host=document.getElementById('adminModuleContent');if(host&&['documents','processes'].includes(key)){const btn=document.createElement('button');btn.className='btn primary';btn.style.margin='12px 0';btn.textContent=key==='processes'?'Modelos de documentos solicitados':'Preencher e gerar documento solicitado';btn.onclick=()=>nucleoDriveOpen(key==='processes'?'templates':'requests');host.prepend(btn);}return result;};
const ndOriginalAdminFields=adminModuleFields;
adminModuleFields=function(key){let html=ndOriginalAdminFields(key);if(key==='documents'){const unit=getSession()?.role==='quality'?'filial':explicitPortalUnit(getSession()?.unit)||'matriz';html='<label>Unidade da solicitação<select id="ndRequestUnit" onchange="document.getElementById(\'admModCode\').innerHTML=documentTypeOptions(this.value)" '+(getSession()?.role==='quality'?'disabled':'')+'><option value="matriz" '+(unit==='matriz'?'selected':'')+'>SETA SC — Matriz</option><option value="filial" '+(unit==='filial'?'selected':'')+'>SETA ES — Unidade Linhares</option></select></label>'+html;}return html;};

async function nucleoEquipmentReportsPanel(record){
 const list=document.getElementById('adminModuleContent'),box=document.createElement('div');box.className='card';box.style.cssText='padding:20px;margin-top:16px;grid-column:1/-1';box.id='equipmentReportsPanel';
 box.innerHTML='<h3>Laudos do equipamento</h3><label>Tipo / descrição do laudo<input id="equipmentReportTitle" maxlength="160" placeholder="Ex.: Laudo de calibração"></label><div class="grid"><label>Emissão<input type="date" id="equipmentReportIssued"></label><label>Validade (opcional)<input type="date" id="equipmentReportExpires"></label></div><label>Arquivo PDF<input id="equipmentReportFile" type="file" accept="application/pdf"></label><button class="btn primary" onclick="nucleoEquipmentUploadReport(this,\''+escapeHtml(record.id)+'\')">Anexar laudo</button><p id="equipmentReportStatus" role="status"></p><button class="btn secondary" onclick="nucleoEquipmentResetAttempt(\''+escapeHtml(record.id)+'\')">Descartar tentativa pendente</button><div id="equipmentReportsList">Consultando laudos…</div>';list.appendChild(box);
 if(!explicitRecordUnit(record)){document.getElementById('equipmentReportsList').textContent='Selecione a Unidade no cadastro acima, clique em Salvar alterações e reabra o equipamento para anexar os laudos.';return;}
 try{const r=await portalJsonp({acao:'nucleo_drive_equipment_reports',unit:explicitRecordUnit(record),equipmentId:record.id},60000);if(!r?.sucesso){if(/desconhecid/i.test(r?.erro||''))throw Error(await nucleoEquipmentDeploymentMessage());throw Error(r?.erro||'Consulta não concluída.');}if(!box.isConnected)return;nucleoEquipmentRenderReports(record,r.reports||[]);}catch(e){if(box.isConnected)document.getElementById('equipmentReportsList').textContent=e.message;}
}
function nucleoEquipmentRenderReports(record,reports){
 const host=document.getElementById('equipmentReportsList');if(!host)return;
 host.innerHTML=reports.slice().reverse().map(p=>'<div class="card" style="padding:12px;margin:10px 0"><b>'+escapeHtml(p.title||p.fileName)+'</b><p class="small">'+escapeHtml(p.fileName)+(p.issued?' · Emissão: '+escapeHtml(p.issued):'')+(p.expires?' · Validade: '+escapeHtml(p.expires):'')+'</p><button class="btn secondary" onclick="nucleoEquipmentViewReport(\''+escapeHtml(record.id)+'\',\''+escapeHtml(p.id)+'\')">Abrir / baixar PDF</button><button class="btn secondary" style="margin-left:8px;color:#b42318" onclick="nucleoEquipmentDeleteReport(this,\''+escapeHtml(record.id)+'\',\''+escapeHtml(p.id)+'\')">Excluir laudo</button></div>').join('')||'<p class="small">Nenhum laudo anexado.</p>';
}
async function nucleoEquipmentUploadReport(button,id){
 if(!nucleoFeatureRequire('equipment','edit'))return;const status=document.getElementById('equipmentReportStatus');button.disabled=true;
 try{const record=adminModuleRecord(id);if(!explicitRecordUnit(record))throw Error('Selecione a Unidade no cadastro acima e salve as alterações antes de anexar o laudo.');const file=document.getElementById('equipmentReportFile').files[0];if(!file&&!localStorage.getItem(nucleoEquipmentPendingKey(record)))throw Error('Selecione o PDF do laudo.');if(file&&file.size>8*1024*1024)throw Error('Selecione um PDF de até 8 MB.');status.textContent='Salvando laudo no Drive e vinculando ao equipamento…';await nucleoDriveLoad();
 const r=await nucleoEquipmentReportMutation({unit:explicitRecordUnit(record),equipmentId:id,fileData:file?await fileToBase64(file):'',fileName:file?.name||'',title:document.getElementById('equipmentReportTitle').value.trim(),issued:document.getElementById('equipmentReportIssued').value,expires:document.getElementById('equipmentReportExpires').value});
 nucleoEquipmentRenderReports(record,r.reports||[]);try{await syncPortalBackend(false);}catch(_){}document.getElementById('equipmentReportFile').value='';status.textContent='Laudo anexado e confirmado na base central.';
 }catch(e){status.textContent=e.message;}finally{button.disabled=false;}
}
async function nucleoEquipmentViewReport(id,reportId){
 try{const record=adminModuleRecord(id),r=await portalJsonp({acao:'nucleo_drive_equipment_read',unit:explicitRecordUnit(record),equipmentId:id,reportId},90000);if(!r?.sucesso)throw Error(r?.erro||'Laudo indisponível.');const url=URL.createObjectURL(new Blob([Uint8Array.from(atob(r.base64),c=>c.charCodeAt(0))],{type:'application/pdf'}));const dialog=document.createElement('dialog');dialog.style.cssText='width:90vw;border:0;border-radius:12px';dialog.innerHTML='<h3>'+escapeHtml(r.fileName)+'</h3><a class="btn secondary" download="'+escapeHtml(r.fileName)+'" href="'+url+'">Baixar PDF</a> <button class="btn secondary">Fechar</button><iframe title="Laudo" src="'+url+'" style="width:100%;height:70vh"></iframe>';document.body.appendChild(dialog);dialog.querySelector('button').onclick=()=>dialog.close();dialog.onclose=()=>{URL.revokeObjectURL(url);dialog.remove();};dialog.showModal();}catch(e){alert(e.message);}
}

function nucleoEquipmentPendingKey(record){return 'nucleo-equipment-upload:'+String(getSession()?.personId||getSession()?.email||getSession()?.name)+':'+record.id;}
async function nucleoEquipmentReportMutation(params){
 const record=adminModuleRecord(params.equipmentId),key=nucleoEquipmentPendingKey(record),prior=localStorage.getItem(key);let pending=prior?JSON.parse(prior):null;
 const ready=await portalJsonp({acao:'nucleo_drive_equipment_reports',equipmentId:params.equipmentId,unit:params.unit},30000);if(!ready?.sucesso)throw Error(/desconhecid/i.test(ready?.erro||'')?await nucleoEquipmentDeploymentMessage():ready?.erro||'Não foi possível consultar os laudos.');if(pending&&(ready.reports||[]).some(r=>r.id===pending.id)){localStorage.removeItem(key);return ready;}
 if(!pending){pending={id:'EQ-'+Date.now()+'-'+Math.random().toString(36).slice(2),at:Date.now()};localStorage.setItem(key,JSON.stringify(pending));if(!portalPostForm({acao:'nucleo_drive_equipment_upload',eventoId:pending.id,...params})){localStorage.removeItem(key);throw Error('Não foi possível enviar o laudo.');}}
 const status=document.getElementById('equipmentReportStatus');
 for(let attempt=0;attempt<6;attempt++){
  status.textContent=prior?'Conferindo o envio anterior, sem reenviar o arquivo…':'Aguardando confirmação do laudo na base central…';
  await new Promise(r=>setTimeout(r,2000));let result;
  try{result=await portalJsonp({acao:'nucleo_drive_status',eventoId:pending.id},15000);}catch(e){if(/sess[aã]o|acesso|permiss/i.test(e.message))throw e;}
  if(result&&!result.pending){if(!result.sucesso){localStorage.removeItem(key);throw Error(result.erro||'O envio não foi concluído.');}localStorage.removeItem(key);return result;}
  // The equipment record remains authoritative even if the callback cache expires.
  if(attempt===2||attempt===5){try{const check=await portalJsonp({acao:'nucleo_drive_equipment_reports',equipmentId:params.equipmentId,unit:params.unit},20000);if(check?.sucesso&&(check.reports||[]).some(p=>p.id===pending.id)){localStorage.removeItem(key);return check;}}catch(e){if(/sess[aã]o|acesso|permiss/i.test(e.message))throw e;}}
 }
 throw Error('A confirmação ainda não chegou. Clique em Anexar laudo para conferir novamente o mesmo envio; o arquivo não será reenviado.');
}

async function nucleoEquipmentResetAttempt(id){
 const record=adminModuleRecord(id),status=document.getElementById('equipmentReportStatus');
 try{const r=await portalJsonp({acao:'nucleo_drive_equipment_reports',unit:explicitRecordUnit(record),equipmentId:id},30000);if(!r?.sucesso)throw Error(r?.erro||'Confira a implantação do Apps Script.');nucleoEquipmentRenderReports(record,r.reports||[]);
 if(!confirm('Confira a lista de laudos acima. Deseja descartar apenas a tentativa pendente deste navegador? Nenhum laudo salvo será removido.'))return;
 localStorage.removeItem(nucleoEquipmentPendingKey(record));status.textContent='Tentativa pendente descartada. Se o laudo ainda não aparece na lista, selecione o PDF e clique em Anexar laudo.';
 }catch(e){status.textContent=e.message;}
}

async function nucleoEquipmentDeploymentMessage(){
 let version='sem identificação (versão anterior)';try{const r=await portalJsonp({acao:'portal_public_config'},20000);version=r.backendRevision||version;}catch(_){}
 return 'O endereço conectado ao Núcleo não reconhece os laudos. Versão recebida: '+version+'. No Apps Script, execute verificarImplantacaoLaudos e confira a URL registrada. A versão esperada é laudos-avatar-20261007-v2.';
}

async function nucleoEquipmentDeleteReport(button,id,reportId){
 if(!nucleoFeatureRequire('equipment','edit'))return;
 if(!confirm('Excluir este laudo? O vínculo será removido do equipamento e o PDF irá para a lixeira do Drive.'))return;
 const record=adminModuleRecord(id),status=document.getElementById('equipmentReportStatus');button.disabled=true;
 try{
  status.textContent='Excluindo laudo e aguardando confirmação…';
  const result=await portalJsonp({acao:'nucleo_drive_equipment_delete',equipmentId:id,unit:explicitRecordUnit(record),reportId,eventoId:'EQ-DEL-'+Date.now()+'-'+Math.random().toString(36).slice(2)},60000);
  if(!result?.sucesso)throw Error(result?.erro||'A exclusão não foi confirmada.');
  nucleoEquipmentRenderReports(record,result.reports||[]);status.textContent='Laudo excluído.';
  try{await syncPortalBackend(false)}catch(_){}
 }catch(e){status.textContent='Não foi possível confirmar a exclusão: '+e.message;button.disabled=false;}
}

// Anexos de Gestão de processos.
async function nucleoProcessReportsPanel(record){
 const list=document.getElementById('adminModuleContent'),box=document.createElement('div');box.className='card';box.style.cssText='padding:20px;margin-top:16px;grid-column:1/-1';box.id='processAttachmentsPanel';
 box.innerHTML='<h3>Documentos anexados</h3><label>Descrição do documento<input id="processAttachmentTitle" maxlength="160" placeholder="Ex.: Procedimento vigente — revisão 03"></label><label>Arquivo PDF ou Word (.docx)<input id="processAttachmentFile" type="file" accept=".pdf,.docx"></label><button class="btn primary" onclick="nucleoProcessUploadReport(this,\''+escapeHtml(record.id)+'\')">Anexar documento</button><p id="processAttachmentStatus" role="status"></p><button class="btn secondary" onclick="nucleoProcessResetAttempt(\''+escapeHtml(record.id)+'\')">Descartar tentativa pendente</button><div id="processAttachmentsList">Consultando documentos…</div>';list.appendChild(box);
 if(!explicitRecordUnit(record)){document.getElementById('processAttachmentsList').textContent='Selecione a Unidade no cadastro acima, clique em Salvar alterações e reabra o registro para anexar os documentos.';return;}
 try{const r=await portalJsonp({acao:'nucleo_drive_process_reports',unit:explicitRecordUnit(record),processId:record.id},60000);if(!r?.sucesso){if(/desconhecid/i.test(r?.erro||''))throw Error(await nucleoProcessDeploymentMessage());throw Error(r?.erro||'Consulta não concluída.');}if(!box.isConnected)return;nucleoProcessRenderReports(record,r.reports||[]);}catch(e){if(box.isConnected)document.getElementById('processAttachmentsList').textContent=e.message;}
}
function nucleoProcessRenderReports(record,reports){
 record.processAttachments=reports;const records=getAdminModuleRecords(),own=records.find(x=>x.id===record.id);if(own){own.processAttachments=reports;saveAdminModuleRecords(records);}
 const host=document.getElementById('processAttachmentsList');if(!host)return;
 host.innerHTML=reports.slice().reverse().map(p=>'<div class="card" style="padding:12px;margin:10px 0"><b>'+escapeHtml(p.title||p.fileName)+'</b><p class="small">'+escapeHtml(p.fileName)+(p.revision?' · Revisão: '+escapeHtml(p.revision):'')+'</p><button class="btn secondary" onclick="nucleoProcessViewReport(\''+escapeHtml(record.id)+'\',\''+escapeHtml(p.id)+'\')">Abrir / baixar documento</button><button class="btn secondary" style="margin-left:8px;color:#b42318" onclick="nucleoProcessDeleteReport(this,\''+escapeHtml(record.id)+'\',\''+escapeHtml(p.id)+'\')">Excluir documento</button></div>').join('')||'<p class="small">Nenhum documento anexado.</p>';
}
async function nucleoProcessUploadReport(button,id){
 if(!nucleoFeatureRequire('processes','edit'))return;const status=document.getElementById('processAttachmentStatus');button.disabled=true;
 try{const record=adminModuleRecord(id);if(!explicitRecordUnit(record))throw Error('Selecione a Unidade no cadastro acima e salve as alterações antes de anexar o documento.');const file=document.getElementById('processAttachmentFile').files[0];if(!file&&!localStorage.getItem(nucleoProcessPendingKey(record)))throw Error('Selecione o documento PDF ou Word (.docx).');if(file&&file.size>8*1024*1024)throw Error('Selecione um PDF ou Word (.docx) de até 8 MB.');status.textContent='Salvando documento no Drive e vinculando ao registro…';await nucleoDriveLoad();
 const r=await nucleoProcessReportMutation({unit:explicitRecordUnit(record),processId:id,fileData:file?await fileToBase64(file):'',fileName:file?.name||'',title:document.getElementById('processAttachmentTitle').value.trim(),mimeType:file?.type||''});
 nucleoProcessRenderReports(record,r.reports||[]);try{await syncPortalBackend(false);}catch(_){}document.getElementById('processAttachmentFile').value='';status.textContent='Documento anexado e confirmado na base central.';
 }catch(e){status.textContent=e.message;}finally{button.disabled=false;}
}
async function nucleoProcessViewReport(id,reportId){
 try{const record=adminModuleRecord(id),r=await portalJsonp({acao:'nucleo_drive_process_read',unit:explicitRecordUnit(record),processId:id,reportId},90000);if(!r?.sucesso)throw Error(r?.erro||'Documento indisponível.');const isPdf=r.mimeType==='application/pdf',url=URL.createObjectURL(new Blob([Uint8Array.from(atob(r.base64),c=>c.charCodeAt(0))],{type:r.mimeType||'application/octet-stream'}));const dialog=document.createElement('dialog');dialog.style.cssText='width:90vw;border:0;border-radius:12px';dialog.innerHTML='<h3>'+escapeHtml(r.fileName)+'</h3><a class="btn secondary" download="'+escapeHtml(r.fileName)+'" href="'+url+'">Baixar documento</a> <button class="btn secondary">Fechar</button>'+(isPdf?'<iframe title="Documento" src="'+url+'" style="width:100%;height:70vh"></iframe>':'<p>Baixe o arquivo Word para abrir e editar.</p>')+'';document.body.appendChild(dialog);dialog.querySelector('button').onclick=()=>dialog.close();dialog.onclose=()=>{URL.revokeObjectURL(url);dialog.remove();};dialog.showModal();}catch(e){alert(e.message);}
}

function nucleoProcessPendingKey(record){return 'nucleo-process-upload:'+String(getSession()?.personId||getSession()?.email||getSession()?.name)+':'+record.id;}
async function nucleoProcessReportMutation(params){
 const record=adminModuleRecord(params.processId),key=nucleoProcessPendingKey(record),prior=localStorage.getItem(key);let pending=prior?JSON.parse(prior):null;
 const ready=await portalJsonp({acao:'nucleo_drive_process_reports',processId:params.processId,unit:params.unit},30000);if(!ready?.sucesso)throw Error(/desconhecid/i.test(ready?.erro||'')?await nucleoProcessDeploymentMessage():ready?.erro||'Não foi possível consultar os documentos.');if(pending&&(ready.reports||[]).some(r=>r.id===pending.id)){localStorage.removeItem(key);return ready;}
 if(!pending){pending={id:'PROC-'+Date.now()+'-'+Math.random().toString(36).slice(2),at:Date.now()};localStorage.setItem(key,JSON.stringify(pending));if(!portalPostForm({acao:'nucleo_drive_process_upload',eventoId:pending.id,...params})){localStorage.removeItem(key);throw Error('Não foi possível enviar o documento.');}}
 const status=document.getElementById('processAttachmentStatus');
 for(let attempt=0;attempt<6;attempt++){
  status.textContent=prior?'Conferindo o envio anterior, sem reenviar o arquivo…':'Aguardando confirmação do documento na base central…';
  await new Promise(r=>setTimeout(r,2000));let result;
  try{result=await portalJsonp({acao:'nucleo_drive_status',eventoId:pending.id},15000);}catch(e){if(/sess[aã]o|acesso|permiss/i.test(e.message))throw e;}
  if(result&&!result.pending){if(!result.sucesso){localStorage.removeItem(key);throw Error(result.erro||'O envio não foi concluído.');}localStorage.removeItem(key);return result;}
  // The process record remains authoritative even if the callback cache expires.
  if(attempt===2||attempt===5){try{const check=await portalJsonp({acao:'nucleo_drive_process_reports',processId:params.processId,unit:params.unit},20000);if(check?.sucesso&&(check.reports||[]).some(p=>p.id===pending.id)){localStorage.removeItem(key);return check;}}catch(e){if(/sess[aã]o|acesso|permiss/i.test(e.message))throw e;}}
 }
 throw Error('A confirmação ainda não chegou. Clique em Anexar documento para conferir novamente o mesmo envio; o arquivo não será reenviado.');
}

async function nucleoProcessResetAttempt(id){
 const record=adminModuleRecord(id),status=document.getElementById('processAttachmentStatus');
 try{const r=await portalJsonp({acao:'nucleo_drive_process_reports',unit:explicitRecordUnit(record),processId:id},30000);if(!r?.sucesso)throw Error(r?.erro||'Confira a implantação do Apps Script.');nucleoProcessRenderReports(record,r.reports||[]);
 if(!confirm('Confira a lista de documentos acima. Deseja descartar apenas a tentativa pendente deste navegador? Nenhum documento salvo será removido.'))return;
 localStorage.removeItem(nucleoProcessPendingKey(record));status.textContent='Tentativa pendente descartada. Se o documento ainda não aparece na lista, selecione o PDF e clique em Anexar documento.';
 }catch(e){status.textContent=e.message;}
}

async function nucleoProcessDeploymentMessage(){return 'A implantação atual do Apps Script ainda não reconhece os anexos de Gestão de processos. Atualize o código e publique uma nova versão da implantação existente.';}

async function nucleoProcessDeleteReport(button,id,reportId){
 if(!nucleoFeatureRequire('processes','edit'))return;
 if(!confirm('Excluir este documento? O vínculo será removido do registro e o PDF irá para a lixeira do Drive.'))return;
 const record=adminModuleRecord(id),status=document.getElementById('processAttachmentStatus');button.disabled=true;
 try{
  status.textContent='Excluindo documento e aguardando confirmação…';
  const result=await portalJsonp({acao:'nucleo_drive_process_delete',processId:id,unit:explicitRecordUnit(record),reportId,eventoId:'PROC-DEL-'+Date.now()+'-'+Math.random().toString(36).slice(2)},60000);
  if(!result?.sucesso)throw Error(result?.erro||'A exclusão não foi confirmada.');
  nucleoProcessRenderReports(record,result.reports||[]);status.textContent='Documento excluído.';
  try{await syncPortalBackend(false)}catch(_){}
 }catch(e){status.textContent='Não foi possível confirmar a exclusão: '+e.message;button.disabled=false;}
}


function nucleoEditProcessLayout(id){
 if(!nucleoFeatureRequire('processes','templates'))return;
 const all=getProcessLayouts(),original=all.find(x=>x.id===id);if(!original)return;
 const dialog=document.createElement('dialog');dialog.style.cssText='width:min(600px,94vw);max-height:85vh;overflow:auto';
 const fields=['logoWidth','metaWidth','headerHeight','rowHeight','borderWidth','fontScale','sectionHeight'];
 const labels=['Largura da logo (%)','Largura do código/revisão (%)','Altura do cabeçalho (mm)','Altura das linhas (mm)','Espessura das bordas','Tamanho do texto (%)','Altura das seções (mm)'];
 dialog.innerHTML='<h3>Editar padrão</h3><label>Nome<input id="pmLayoutName" value="'+escapeHtml(original.name)+'"></label><label>Tipo<input id="pmLayoutType" value="'+escapeHtml(original.type||'')+'"></label>'+fields.map((k,i)=>'<label>'+labels[i]+'<input type="number" min="0.1" max="150" step="0.1" data-layout-key="'+k+'" value="'+Number(original.layout?.[k]||1)+'"></label>').join('')+'<p role="status"></p><button class="btn primary">Salvar</button> <button class="btn secondary">Cancelar</button>';
 dialog.querySelector('.secondary').onclick=()=>dialog.close();dialog.querySelector('.primary').onclick=async()=>{const status=dialog.querySelector('[role="status"]');try{const layout={...original.layout};dialog.querySelectorAll('[data-layout-key]').forEach(el=>{const v=Number(el.value);if(!Number.isFinite(v)||v<=0||v>150)throw Error('Confira as proporções.');layout[el.dataset.layoutKey]=v});const name=dialog.querySelector('#pmLayoutName').value.trim();if(!name)throw Error('Informe o nome.');const updated={...original,name,type:dialog.querySelector('#pmLayoutType').value.trim(),layout,updatedAt:new Date().toISOString()},items=all.map(x=>x.id===id?updated:x);await portalBackendSaveConfirmedPost('shared_state','process_layouts',{items,updatedAt:updated.updatedAt});safeStorageSet(PROCESS_LAYOUT_KEY,JSON.stringify(items));dialog.close();renderProcessTemplatesWorkspace();}catch(e){status.textContent=e.message;}};
 dialog.onclose=()=>dialog.remove();document.body.appendChild(dialog);dialog.showModal();
}
// Editor de folha para os modelos livres. Não modifica o fluxo dos modelos operacionais.
function nucleoOpenFreeDocumentEditor(id,inlineRender=false){
 if(!nucleoFeatureRequire('processes','templates'))return;
 if(!inlineRender){nucleoOpenFreeDocumentEditorInline(id);return;}
 const original=getProcessTemplates().find(x=>x.id===id);if(!original)return;
 const model=JSON.parse(JSON.stringify(original));
 model.freeLayout={...{page:'A4',orientation:'portrait',margin:14,fontSize:11,border:'#334155',text:'#172033',background:'#ffffff'},...(model.freeLayout||{})};
 let seq=0,selectedId='';const uid=()=>`fg_${Date.now().toString(36)}_${++seq}_${Math.random().toString(36).slice(2,5)}`,num=(v,a,b,d)=>Math.max(a,Math.min(b,Number.isFinite(Number(v))?Number(v):d)),clr=(x,d)=>/^#[0-9a-f]{6}$/i.test(String(x||''))?x:d;
 const mk=(over={})=>({id:uid(),type:'text',text:'',width:100,height:10,rowSpan:1,align:'left',verticalAlign:'middle',bold:false,italic:false,fontSize:model.freeLayout.fontSize||11,background:'#ffffff',textColor:model.freeLayout.text||'#172033',borderColor:model.freeLayout.border||'#334155',borderWidth:.5,dataUrl:'',imageFileId:'',imageFit:'contain',...over});
 const row=(cells=[mk()])=>({id:uid(),cells});
 model.freeGrid=Array.isArray(model.freeGrid)&&model.freeGrid.length?model.freeGrid.map(r=>({id:r.id||uid(),cells:(r.cells||[]).map(c=>mk({...c,id:c.id||uid(),rowSpan:num(c.rowSpan,1,20,1),fontSize:num(c.fontSize,6,28,model.freeLayout.fontSize||11),borderWidth:num(c.borderWidth,0,4,.5),textColor:clr(c.textColor,model.freeLayout.text||'#172033'),borderColor:clr(c.borderColor,model.freeLayout.border||'#334155')}))})):[row([mk({text:model.title||model.name||'DOCUMENTO',bold:true,align:'center',fontSize:16})]),row([mk()])];
 selectedId=model.freeGrid[0]?.cells[0]?.id||'';
 const dlg=document.getElementById('nucleoInlineProcessEditor');if(!dlg)return;dlg.style.cssText='margin-top:14px;padding:0;overflow:hidden;border:1px solid #cbd5e1;border-radius:14px;min-height:620px;height:calc(100vh - 180px)';
 dlg.close=()=>nucleoCloseProcessTemplateEditor();
 dlg.innerHTML=`<div style="height:100%;display:flex;flex-direction:column"><header style="display:flex;justify-content:space-between;gap:12px;align-items:center;padding:12px 16px;border-bottom:1px solid #dbe2ea"><div><b>Editor universal · ${escapeHtml(model.name||'Documento')}</b><div class="small">Edição livre de folha, células, imagens, bordas e conteúdo.</div></div><div style="display:flex;gap:7px"><button class="btn secondary" data-act="print">Imprimir / PDF</button><button class="btn primary" data-act="save">Salvar modelo</button><button class="btn secondary" data-act="close">Fechar</button></div></header><div style="display:grid;grid-template-columns:370px minmax(0,1fr);min-height:0;flex:1"><aside style="padding:12px;overflow:auto;border-right:1px solid #e2e8f0"><label>Nome<input data-setting="name"></label><label>Título da folha<input data-setting="title"></label><label>Código<input data-setting="code"></label><label>Revisão<input data-setting="revision"></label><label>Rodapé<textarea data-setting="footerText" rows="2"></textarea></label><div style="display:grid;grid-template-columns:1fr 1fr;gap:7px"><label>Orientação<select data-layout="orientation"><option value="portrait">Retrato</option><option value="landscape">Paisagem</option></select></label><label>Margem (mm)<input data-layout="margin" type="number" min="5" max="35"></label><label>Fonte base<input data-layout="fontSize" type="number" min="7" max="24"></label><label>Cor do texto<input data-layout="text" type="color"></label><label>Cor da borda<input data-layout="border" type="color"></label><label>Fundo da folha<input data-layout="background" type="color"></label></div><hr><div id="fgToolbar"></div><input data-image type="file" accept="image/png,image/jpeg,image/webp" hidden><p data-status class="small">Clique em uma célula da folha para editar.</p></aside><main style="background:#e9edf2;overflow:auto;padding:20px"><div data-page style="margin:auto;background:#fff;box-shadow:0 7px 28px #15223925;box-sizing:border-box"></div></main></div></div>`;
 const $=q=>dlg.querySelector(q),status=$('[data-status]');
 ['name','title','code','revision','footerText'].forEach(k=>{const el=$(`[data-setting="${k}"]`);el.value=model[k]||'';el.oninput=()=>{model[k]=el.value;drawPaper();}});
 ['orientation','margin','fontSize','text','border','background'].forEach(k=>{const el=$(`[data-layout="${k}"]`);if(!el)return;el.value=model.freeLayout[k]??(k==='orientation'?'portrait':'');el.oninput=()=>{model.freeLayout[k]=el.type==='number'?Number(el.value):el.value;drawPaper();};el.onchange=el.oninput;});
 function locate(){for(let ri=0;ri<model.freeGrid.length;ri++){const ci=model.freeGrid[ri].cells.findIndex(c=>c.id===selectedId);if(ci>=0)return{grid:model.freeGrid,row:model.freeGrid[ri],cell:model.freeGrid[ri].cells[ci],ri,ci}}return null;}
 function bounds(r,c){const total=r.cells.reduce((s,x)=>s+(Number(x.width)||50),0)||100;let cur=0;for(const x of r.cells){const w=(Number(x.width)||50)/total*100;if(x===c)return[cur,cur+w];cur+=w}return[0,100];}
 function mergeV(dir){const s=locate();if(!s)return;const span=Math.max(1,Number(s.cell.rowSpan)||1),ti=dir<0?s.ri-1:s.ri+span;if(ti<0||ti>=model.freeGrid.length)return alert('Não há linha nessa direção.');const target=model.freeGrid[ti],[l,r]=bounds(s.row,s.cell);let best=null,bo=0;for(const c of target.cells){const [tl,tr]=bounds(target,c),ov=Math.max(0,Math.min(r,tr)-Math.max(l,tl));if(ov>bo){bo=ov;best=c}}if(!best||bo<Math.max(2,(r-l)*.3))return alert('Não encontrei uma célula alinhada nessa direção.');if(!confirm('Mesclar verticalmente? O conteúdo da outra célula será removido.'))return;target.cells.splice(target.cells.indexOf(best),1);s.cell.rowSpan=span+Math.max(1,Number(best.rowSpan)||1);if(dir<0){s.row.cells.splice(s.ci,1);if(!s.row.cells.length)model.freeGrid.splice(model.freeGrid.indexOf(s.row),1);(model.freeGrid[ti]||target).cells.push(s.cell)}else if(!target.cells.length)model.freeGrid.splice(ti,1);draw();}
 function action(op){const s=locate();if(op==='addrow'){const r=row([mk()]);model.freeGrid.push(r);selectedId=r.cells[0].id;}else if(op==='addcell'){if(s){const c=mk({width:Math.max(10,(Number(s.cell.width)||50)/2)});s.cell.width=c.width;s.row.cells.splice(s.ci+1,0,c);selectedId=c.id}else{const r=row([mk()]);model.freeGrid.push(r);selectedId=r.cells[0].id}}else if(!s)return;else if(op==='left'&&s.ci>0)[s.row.cells[s.ci-1],s.row.cells[s.ci]]=[s.row.cells[s.ci],s.row.cells[s.ci-1]];else if(op==='right'&&s.ci<s.row.cells.length-1)[s.row.cells[s.ci],s.row.cells[s.ci+1]]=[s.row.cells[s.ci+1],s.row.cells[s.ci]];else if(op==='up'&&s.ri>0)[model.freeGrid[s.ri-1],model.freeGrid[s.ri]]=[model.freeGrid[s.ri],model.freeGrid[s.ri-1]];else if(op==='down'&&s.ri<model.freeGrid.length-1)[model.freeGrid[s.ri],model.freeGrid[s.ri+1]]=[model.freeGrid[s.ri+1],model.freeGrid[s.ri]];else if(op==='merge'){if(s.ci>=s.row.cells.length-1)return alert('Não há célula à direita.');const o=s.row.cells[s.ci+1];s.cell.width=Math.min(100,(Number(s.cell.width)||50)+(Number(o.width)||50));s.row.cells.splice(s.ci+1,1);}else if(op==='mergeup')return mergeV(-1);else if(op==='mergedown')return mergeV(1);else if(op==='split'){if(Number(s.cell.rowSpan)>1)s.cell.rowSpan=1;else{const h=Math.max(5,(Number(s.cell.width)||50)/2);s.cell.width=h;s.row.cells.splice(s.ci+1,0,mk({width:h}));}}else if(op==='delete'){s.row.cells.splice(s.ci,1);if(!s.row.cells.length)model.freeGrid.splice(s.ri,1);selectedId='';}else if(op==='image')return $('[data-image]').click();draw();}
 function drawToolbar(){const h=$('#fgToolbar'),s=locate();h.innerHTML=`<div style="display:flex;gap:4px;flex-wrap:wrap"><button class="btn secondary" data-cell-act="addrow">+ Linha</button><button class="btn secondary" data-cell-act="addcell">+ Célula</button>${s?`<button class="btn secondary" data-cell-act="left">←</button><button class="btn secondary" data-cell-act="right">→</button><button class="btn secondary" data-cell-act="up">Linha ↑</button><button class="btn secondary" data-cell-act="down">Linha ↓</button><button class="btn secondary" data-cell-act="merge">Mesclar →</button><button class="btn secondary" data-cell-act="mergeup">Mesclar ↑</button><button class="btn secondary" data-cell-act="mergedown">Mesclar ↓</button><button class="btn secondary" data-cell-act="split">Dividir</button><button class="btn danger" data-cell-act="delete">Excluir</button>`:''}</div>`+(s?`<div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:8px"><label style="grid-column:1/-1">Texto<textarea data-prop="text" rows="3">${escapeHtml(s.cell.text||'')}</textarea></label><label>Tipo<select data-prop="type"><option value="text" ${s.cell.type==='text'?'selected':''}>Texto</option><option value="divider" ${s.cell.type==='divider'?'selected':''}>Divisória</option><option value="image" ${s.cell.type==='image'?'selected':''}>Imagem</option></select></label><label>Largura (%)<input data-prop="width" type="number" min="5" max="100" value="${s.cell.width}"></label><label>Altura (mm)<input data-prop="height" type="number" min="3" max="120" step=".5" value="${s.cell.height}"></label><label>Fonte (pt)<input data-prop="fontSize" type="number" min="6" max="28" step=".5" value="${s.cell.fontSize}"></label><label>Fundo<input data-prop="background" type="color" value="${clr(s.cell.background,'#ffffff')}"></label><label>Texto<input data-prop="textColor" type="color" value="${clr(s.cell.textColor,'#172033')}"></label><label>Borda<input data-prop="borderColor" type="color" value="${clr(s.cell.borderColor,'#334155')}"></label><label>Esp. borda<input data-prop="borderWidth" type="number" min="0" max="4" step=".25" value="${s.cell.borderWidth}"></label><label>Alinhamento<select data-prop="align"><option value="left" ${s.cell.align==='left'?'selected':''}>Esquerda</option><option value="center" ${s.cell.align==='center'?'selected':''}>Centro</option><option value="right" ${s.cell.align==='right'?'selected':''}>Direita</option></select></label><label>Vertical<select data-prop="verticalAlign"><option value="top" ${s.cell.verticalAlign==='top'?'selected':''}>Topo</option><option value="middle" ${s.cell.verticalAlign==='middle'?'selected':''}>Centro</option><option value="bottom" ${s.cell.verticalAlign==='bottom'?'selected':''}>Base</option></select></label><label style="display:flex;gap:6px;align-items:center"><input data-prop="bold" type="checkbox" ${s.cell.bold?'checked':''} style="width:18px"> Negrito</label><label style="display:flex;gap:6px;align-items:center"><input data-prop="italic" type="checkbox" ${s.cell.italic?'checked':''} style="width:18px"> Itálico</label><button class="btn secondary" data-cell-act="image">Inserir / trocar imagem</button></div>`:'<p class="small">Selecione uma célula.</p>');h.querySelectorAll('[data-cell-act]').forEach(b=>b.onclick=()=>action(b.dataset.cellAct));h.querySelectorAll('[data-prop]').forEach(el=>{const change=()=>{const x=locate();if(!x)return;const k=el.dataset.prop;x.cell[k]=el.type==='checkbox'?el.checked:el.type==='number'?Number(el.value):el.value;drawPaper();};el.onchange=change;if(el.tagName==='TEXTAREA'||['number','color'].includes(el.type))el.oninput=change;});}
 function drawPaper(){const page=$('[data-page]'),L=model.freeLayout,land=L.orientation==='landscape';page.style.width=land?'1123px':'794px';page.style.minHeight=land?'794px':'1123px';page.style.padding=(num(L.margin,5,35,14)*3.78)+'px';page.style.background=clr(L.background,'#ffffff');page.style.color=clr(L.text,'#172033');page.style.fontSize=num(L.fontSize,7,24,11)+'pt';const top=`<div style="display:flex;justify-content:space-between;gap:8px;padding-bottom:8px"><span>${escapeHtml(model.code||'')}</span><span>${escapeHtml(model.revision||'')}</span></div>`;const table=`<table style="width:100%;border-collapse:collapse;table-layout:fixed">${model.freeGrid.map(r=>`<tr>${r.cells.map(c=>{const selected=c.id===selectedId,border=selected?'#2f6fed':clr(c.borderColor,L.border||'#334155'),bw=selected?2:num(c.borderWidth,0,4,.5);const content=c.type==='image'?(c.dataUrl?`<img src="${c.dataUrl}" style="display:block;width:100%;max-height:${num(c.height,3,120,10)*3.78}px;object-fit:${c.imageFit||'contain'}">`:'Imagem'):`<div data-edit="${c.id}" contenteditable="true" style="min-height:16px;outline:0;white-space:pre-wrap">${escapeHtml(c.text||'')}</div>`;return `<td data-cell="${c.id}" ${Number(c.rowSpan)>1?`rowspan="${Math.floor(Number(c.rowSpan))}"`:''} style="cursor:pointer;width:${num(c.width,5,100,50)}%;height:${num(c.height,3,120,10)*3.78}px;background:${clr(c.background,'#ffffff')};color:${clr(c.textColor,L.text||'#172033')};border:${bw}pt solid ${border};padding:5px;text-align:${c.align||'left'};vertical-align:${c.verticalAlign||'middle'};font-size:${num(c.fontSize,6,28,L.fontSize||11)}pt;font-weight:${c.bold?'700':'400'};font-style:${c.italic?'italic':'normal'}">${content}</td>`}).join('')}</tr>`).join('')}</table>`;page.innerHTML=top+table+`<footer style="margin-top:20px;padding-top:7px;border-top:1px solid ${clr(L.border,'#334155')};white-space:pre-wrap;font-size:9px">${escapeHtml(model.footerText||'')}</footer>`;page.querySelectorAll('[data-cell]').forEach(td=>td.onclick=e=>{selectedId=td.dataset.cell;if(e.target.closest('[contenteditable]'))drawToolbar();else draw();e.stopPropagation();});page.querySelectorAll('[data-edit]').forEach(el=>el.oninput=()=>{const id=el.dataset.edit;for(const r of model.freeGrid){const c=r.cells.find(x=>x.id===id);if(c){c.text=el.innerText;break}}});}
 function draw(){drawToolbar();drawPaper();}
 $('[data-image]').onchange=e=>{const file=e.target.files[0],s=locate();if(!file||!s)return;if(file.size>120*1024){status.textContent='Use imagem de até 120 KB.';e.target.value='';return;}const rd=new FileReader();rd.onload=()=>{s.cell.type='image';s.cell.dataUrl=String(rd.result||'');s.cell.imageFileId='';draw();};rd.readAsDataURL(file);e.target.value='';};
 dlg.querySelectorAll('[data-act]').forEach(b=>b.onclick=async()=>{const a=b.dataset.act;if(a==='close')return dlg.close();if(a==='print'){const w=window.open('','_blank');if(!w)return;const clone=$('[data-page]').cloneNode(true);clone.querySelectorAll('[contenteditable]').forEach(x=>x.removeAttribute('contenteditable'));w.document.write('<!doctype html><html><head><title>'+escapeHtml(model.name||'Documento')+'</title><style>@page{size:A4 '+(model.freeLayout.orientation==='landscape'?'landscape':'portrait')+';margin:0}body{margin:0;background:#fff}button{display:none}</style></head><body>'+clone.outerHTML+'</body></html>');w.document.close();w.focus();setTimeout(()=>w.print(),120);return;}if(a==='save'){b.disabled=true;try{if(!String(model.name||'').trim())throw new Error('Informe o nome do modelo.');model.updatedAt=new Date().toISOString();const all=getProcessTemplates(),items=all.map(x=>x.id===id?model:x);await saveProcessTemplates(items);status.textContent='Modelo salvo e confirmado na base central.';setTimeout(()=>{dlg.close();},450);}catch(err){status.textContent=err.message;}finally{b.disabled=false;}}});
 draw();
}

function nucleoSystemModelsHtml(){return '<div class="card" style="padding:16px"><h3>Modelos usados pelo sistema</h3><p class="small">Alterações valem para próximas emissões. Arquivos já emitidos permanecem preservados.</p><div class="actions"><button class="btn secondary" onclick="nucleoEditProcessTypes()">Editar tipos: POP, Formulário, Relatório…</button><button class="btn secondary" onclick="nucleoEditSystemModel(\'ro\')">R.O.</button><button class="btn secondary" onclick="nucleoEditSystemModel(\'sac\')">SAC</button><button class="btn secondary" onclick="nucleoEditSystemModel(\'pdca\')">PDCA gerado no Núcleo</button><button class="btn secondary" onclick="nucleoOpenRncTemplateEditor()">RNC — campos e estrutura</button><button class="btn secondary" onclick="nucleoDriveOpen(\'templates\')">Laudos e documentos solicitados — campos e estrutura</button></div></div>';}
async function nucleoEditSystemModel(kind){
 if(['ro','sac','pdca'].includes(kind))return nucleoOpenSystemModelEditor(kind);
 if(!nucleoFeatureRequire('processes','templates'))return;
 const dialog=document.createElement('dialog');dialog.style.cssText='width:min(760px,94vw);max-height:90vh;overflow:auto';document.body.appendChild(dialog);dialog.onclose=()=>dialog.remove();dialog.innerHTML='<p>Consultando modelo…</p>';dialog.showModal();
 let unit=getSession()?.role==='quality'?'filial':explicitPortalUnit(getSession()?.unit)||'matriz';
 async function load(){try{const r=await portalJsonp({acao:'nucleo_drive_process_formats',unit},60000);if(!r?.sucesso)throw Error(r?.erro||'Modelo indisponível.');const model=r.formats?.[kind]||{};
 const defaults={ro:'RELATO DE OCORRÊNCIA',sac:'SERVIÇO DE ATENDIMENTO AO CLIENTE',pdca:'RELATÓRIO PDCA'};
 dialog.innerHTML='<h3>Modelo de '+kind.toUpperCase()+'</h3><label>Unidade<select id="smUnit" '+(getSession()?.role==='quality'?'disabled':'')+'><option value="matriz">Matriz</option><option value="filial">Filial</option></select></label><label>Título<input id="smTitle" maxlength="180" value="'+escapeHtml(model.title||defaults[kind])+'"></label><label>Texto adicional no rodapé<textarea id="smFooter" maxlength="1500">'+escapeHtml(model.footer||'')+'</textarea></label><label>Tamanho do texto (opcional)<input id="smFont" type="number" min="7" max="18" value="'+(model.fontSize||'')+'"></label><h4>Nomes e textos dos campos</h4><p class="small">Informe o texto atual e como deve aparecer no documento. Os dados e as regras de preenchimento permanecem os mesmos.</p><div id="smLabels"></div><button class="btn secondary" id="smAdd">Adicionar texto para alterar</button><p id="smStatus" role="status"></p><button class="btn primary" id="smSave">Salvar modelo</button> <button class="btn secondary" id="smClose">Fechar</button>';
 dialog.querySelector('#smUnit').value=unit;dialog.querySelector('#smUnit').onchange=e=>{unit=e.target.value;load()};
 function row(from='',to=''){const el=document.createElement('div');el.className='actions';el.innerHTML='<input placeholder="Texto atual" maxlength="200" data-from value="'+escapeHtml(from)+'"><input placeholder="Novo texto" maxlength="200" data-to value="'+escapeHtml(to)+'"><button class="btn secondary">Remover</button>';el.querySelector('button').onclick=()=>el.remove();dialog.querySelector('#smLabels').appendChild(el);}
 (model.labels||[]).forEach(x=>row(x.from,x.to));dialog.querySelector('#smAdd').onclick=()=>row();dialog.querySelector('#smClose').onclick=()=>dialog.close();dialog.querySelector('#smSave').onclick=async e=>{e.target.disabled=true;try{const labels=[...dialog.querySelectorAll('#smLabels>div')].map(el=>({from:el.querySelector('[data-from]').value.trim(),to:el.querySelector('[data-to]').value.trim()}));if(labels.some(x=>!x.from||!x.to))throw Error('Preencha os dois textos de cada linha.');const format={title:dialog.querySelector('#smTitle').value.trim(),footer:dialog.querySelector('#smFooter').value.trim(),fontSize:Number(dialog.querySelector('#smFont').value)||null,labels};const result=await portalJsonp({acao:'nucleo_drive_process_formats',unit,kind,data:JSON.stringify(format)},60000);if(!result?.sucesso)throw Error(result?.erro||'Modelo não confirmado.');const configs=JSON.parse(localStorage.getItem('nucleo-unit-configs')||'[]'),own=configs.find(x=>x.id===unit)||{id:unit,unit};own.documentFormats=result.formats;localStorage.setItem('nucleo-unit-configs',JSON.stringify(configs.filter(x=>x.id!==unit).concat(own)));dialog.querySelector('#smStatus').textContent='Modelo salvo na base central. Válido para próximas emissões desta unidade.';}catch(error){dialog.querySelector('#smStatus').textContent=error.message;}finally{e.target.disabled=false;}};
 }catch(e){dialog.innerHTML='<p>'+escapeHtml(e.message)+'</p><button class="btn secondary">Fechar</button>';dialog.querySelector('button').onclick=()=>dialog.close();}}
 await load();
}

function nucleoProcessTypes(unit){try{const types=JSON.parse(localStorage.getItem('nucleo-unit-configs')||'[]').find(x=>x.id===unit)?.processDocumentTypes;if(Array.isArray(types))return types;}catch(e){}return [{id:'IT',label:'IT'},{id:'GSP',label:'GSP'},{id:'POP',label:'POP'},{id:'LPP',label:'LPP'},{id:'FORM',label:'Formulário'},{id:'MANUAL',label:'Manual'},{id:'REPORT',label:'Relatório'},{id:'OTHER',label:'Outro'}];}
function nucleoProcessTypeOptions(unit,current){const types=nucleoProcessTypes(unit).slice();if(current&&!types.some(x=>x.id===current))types.push({id:current,label:current+' (tipo anterior)'});return '<option value="">Selecione...</option>'+types.map(x=>'<option value="'+escapeHtml(x.id)+'">'+escapeHtml(x.label)+'</option>').join('');}
async function nucleoEditProcessTypes(){
 if(!nucleoFeatureRequire('processes','templates'))return;let unit=getSession()?.role==='quality'?'filial':explicitPortalUnit(getSession()?.unit)||'matriz';const dialog=document.createElement('dialog');dialog.style.cssText='width:min(650px,94vw);max-height:85vh;overflow:auto';document.body.appendChild(dialog);dialog.onclose=()=>dialog.remove();dialog.showModal();
 async function load(){try{const result=await portalJsonp({acao:'nucleo_drive_process_formats',unit},60000);if(!result?.sucesso)throw Error(result?.erro||'Consulta não concluída.');const types=result.processDocumentTypes||nucleoProcessTypes(unit);dialog.innerHTML='<h3>Tipos de documento</h3><label>Unidade<select id="ptUnit" '+(getSession()?.role==='quality'?'disabled':'')+'><option value="matriz">Matriz</option><option value="filial">Filial</option></select></label><div id="ptRows"></div><button class="btn secondary" id="ptAdd">Adicionar tipo</button><p id="ptStatus" role="status"></p><button class="btn primary" id="ptSave">Salvar</button> <button class="btn secondary" id="ptClose">Fechar</button>';dialog.querySelector('#ptUnit').value=unit;dialog.querySelector('#ptUnit').onchange=e=>{unit=e.target.value;load()};function row(type){const el=document.createElement('div');el.className='actions';el.dataset.typeId=type.id;el.innerHTML='<input maxlength="150" value="'+escapeHtml(type.label)+'"><button class="btn secondary">Retirar</button>';el.querySelector('button').onclick=()=>el.remove();dialog.querySelector('#ptRows').appendChild(el);}types.forEach(row);dialog.querySelector('#ptAdd').onclick=()=>row({id:'type-'+Date.now()+'-'+Math.random().toString(36).slice(2,6),label:''});dialog.querySelector('#ptClose').onclick=()=>dialog.close();dialog.querySelector('#ptSave').onclick=async e=>{e.target.disabled=true;try{const items=[...dialog.querySelectorAll('#ptRows>div')].map(el=>({id:el.dataset.typeId,label:el.querySelector('input').value.trim()}));const r=await portalJsonp({acao:'nucleo_drive_process_formats',unit,kind:'types',data:JSON.stringify(items)},60000);if(!r?.sucesso)throw Error(r?.erro||'Não confirmado.');const configs=JSON.parse(localStorage.getItem('nucleo-unit-configs')||'[]'),own=configs.find(x=>x.id===unit)||{id:unit,unit};own.processDocumentTypes=r.processDocumentTypes;localStorage.setItem('nucleo-unit-configs',JSON.stringify(configs.filter(x=>x.id!==unit).concat(own)));dialog.querySelector('#ptStatus').textContent='Tipos salvos na base central. Os cadastros anteriores foram preservados.';}catch(error){dialog.querySelector('#ptStatus').textContent=error.message;}finally{e.target.disabled=false;}};}catch(error){dialog.innerHTML='<p>'+escapeHtml(error.message)+'</p><button>Fechar</button>';dialog.querySelector('button').onclick=()=>dialog.close();}}await load();
}

async function toggleProcessLayoutStatus(id){
 if(!nucleoFeatureRequire('processes','templates'))return;const items=getProcessLayouts().map(x=>x.id===id?{...x,status:x.status==='obsolete'?'active':'obsolete',updatedAt:new Date().toISOString()}:x);try{await portalBackendSaveConfirmedPost('shared_state','process_layouts',{items,updatedAt:new Date().toISOString()});safeStorageSet(PROCESS_LAYOUT_KEY,JSON.stringify(items));renderProcessTemplatesWorkspace();}catch(e){alert('A alteração não foi confirmada: '+e.message);}
}
async function toggleProcessDocumentStatus(id){
 if(!nucleoFeatureRequire('processes','templates'))return;const items=getProcessTemplates().map(x=>x.id===id?{...x,status:x.status==='obsolete'?'active':'obsolete',updatedAt:new Date().toISOString()}:x);try{await saveProcessTemplates(items);renderProcessTemplatesWorkspace();}catch(e){alert('A alteração não foi confirmada: '+e.message);}
}

async function nucleoEditRoModelVisual(kind='ro',inlineRender=false){
 const modelName=kind==='pdca'?'PDCA':kind==='sac'?'SAC':'R.O.';
 const defaultTitle=kind==='pdca'?'RELATÓRIO PDCA':kind==='sac'?'SERVIÇO DE ATENDIMENTO AO CLIENTE':'RELATO DE OCORRÊNCIA';
 if(!nucleoFeatureRequire('processes','templates'))return;
 const dialog=inlineRender?document.getElementById('nucleoInlineProcessEditor'):document.createElement('dialog');
 if(!dialog)return;
 dialog.style.cssText=inlineRender?'margin-top:14px;padding:0;overflow:hidden;border:1px solid #cbd5e1;border-radius:14px;min-height:620px;height:calc(100vh - 180px)':'width:min(1540px,99vw);max-width:99vw;height:96vh;max-height:96vh;padding:0;overflow:hidden;border:1px solid #cbd5e1;border-radius:14px';
 dialog.innerHTML='<p style="padding:20px">Carregando editor universal…</p>';
 if(inlineRender){dialog.close=()=>nucleoCloseProcessTemplateEditor();}else{document.body.appendChild(dialog);dialog.onclose=()=>dialog.remove();dialog.showModal();}
 let unit=getSession()?.role==='quality'?'filial':explicitPortalUnit(getSession()?.unit)||'matriz';
 let model={},fields=[],catalog=[],imagePreviews={},logoPreview='',pendingLogo=null,loadVersion=0,selectedId='',region='body';
 const esc=escapeHtml;
 const uid=()=>`uc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;
 const clamp=(v,min,max,def)=>Math.max(min,Math.min(max,Number.isFinite(Number(v))?Number(v):def));
 const color=(v,def)=>/^#[0-9a-f]{6}$/i.test(String(v||''))?String(v):def;
 const newCell=(over={})=>({id:uid(),source:'',type:'text',text:'',width:50,height:9,rowSpan:1,background:'#ffffff',textColor:'#222222',borderColor:'#999999',borderWidth:.5,borderTop:true,borderRight:true,borderBottom:true,borderLeft:true,borderTopColor:'#999999',borderRightColor:'#999999',borderBottomColor:'#999999',borderLeftColor:'#999999',fontSize:9,align:'left',verticalAlign:'middle',bold:false,italic:false,imageFileId:'',imageFit:'contain',...over});
 const newRow=(cells=[newCell()])=>({id:uid(),cells});
 function normalizeCell(c){const bc=color(c?.borderColor,'#999999');return newCell({...c,id:c?.id||uid(),width:clamp(c?.width,5,100,50),height:clamp(c?.height,3,120,9),rowSpan:clamp(c?.rowSpan,1,20,1),background:color(c?.background,'#ffffff'),textColor:color(c?.textColor,'#222222'),borderColor:bc,borderWidth:clamp(c?.borderWidth,0,4,.5),borderTop:c?.borderTop!==false,borderRight:c?.borderRight!==false,borderBottom:c?.borderBottom!==false,borderLeft:c?.borderLeft!==false,borderTopColor:color(c?.borderTopColor,bc),borderRightColor:color(c?.borderRightColor,bc),borderBottomColor:color(c?.borderBottomColor,bc),borderLeftColor:color(c?.borderLeftColor,bc),fontSize:clamp(c?.fontSize,6,28,9),align:['left','center','right'].includes(c?.align)?c.align:'left',verticalAlign:['top','middle','bottom'].includes(c?.verticalAlign)?c.verticalAlign:'middle',imageFit:c?.imageFit==='cover'?'cover':'contain'});}
 function normalizeGrid(g){return Array.isArray(g)?g.filter(r=>Array.isArray(r?.cells)&&r.cells.length).map(r=>({id:r.id||uid(),cells:r.cells.map(normalizeCell)})):[];}
 function defaultBodyGrid(){
  const out=[];let previous='';
  fields.filter(f=>f.enabled!==false).forEach(f=>{
   const sec=String(f.section||'');
   if(sec&&sec!==previous)out.push(newRow([newCell({type:'text',text:sec,width:100,bold:true,background:'#24577b',textColor:'#ffffff',align:'left',height:8})]));
   previous=sec;
   if(f.kind==='divider')out.push(newRow([newCell({type:'text',text:f.label||'',width:100,bold:true,background:f.color||'#24577b',textColor:'#ffffff'})]));
   else if(f.kind==='fixed'||String(f.source||'').startsWith('@'))out.push(newRow([newCell({type:'text',text:f.label||'',width:38,bold:true,background:f.color||'#f1f4f3'}),newCell({type:'text',text:f.value||'',width:62})]));
   else out.push(newRow([newCell({type:'text',text:f.label||f.source||'',width:clamp(f.labelWidth,15,65,38),bold:true,background:f.color||'#f1f4f3',align:f.align||'left'}),newCell({type:'field',source:f.source,width:100-clamp(f.labelWidth,15,65,38),align:f.valueAlign||'left'})]));
  });
  return out.length?out:[newRow([newCell({text:'Documento sem campos',width:100})])];
 }
 function standardHeaderGrid(){return [newRow([newCell({source:'#TITLE',type:'special',width:72,bold:true,fontSize:15,align:'center',height:11,borderWidth:.75,borderTop:false,borderLeft:false,borderRight:false,borderBottom:true,borderBottomColor:'#24577b'}),newCell({source:'#CODE',type:'special',width:28,fontSize:8,align:'right',height:11,borderWidth:.75,borderTop:false,borderRight:false,borderBottom:true,borderLeft:true,borderBottomColor:'#24577b',borderLeftColor:'#24577b'})])];}
 function standardFooterGrid(){return [newRow([newCell({source:'#FOOTER',type:'special',width:70,fontSize:8,height:8,borderWidth:.6,borderTop:true,borderRight:false,borderBottom:false,borderLeft:false,borderTopColor:'#999999'}),newCell({source:'#GENERATED',type:'special',width:30,fontSize:7,align:'right',height:8,borderWidth:.6,borderTop:true,borderRight:false,borderBottom:false,borderLeft:false,borderTopColor:'#999999'})])];}
 function defaultLayout(){return {version:2,repeatHeader:true,repeatFooter:true,headerGrid:standardHeaderGrid(),bodyGrid:defaultBodyGrid(),footerGrid:standardFooterGrid()};}
 let layout=defaultLayout();
 function currentGrid(){return layout[region+'Grid'];}
 function findSelected(){for(let r=0;r<currentGrid().length;r++){const c=currentGrid()[r].cells.find(x=>x.id===selectedId);if(c)return {cell:c,row:currentGrid()[r],ri:r,ci:currentGrid()[r].cells.indexOf(c)}}return null;}
 function sourceOptions(){
  const special=[['','# Texto livre'],['#TITLE','Título do documento'],['#HEADER','Texto do cabeçalho'],['#CODE','Código / revisão'],['#FOOTER','Rodapé'],['#GENERATED','Data/hora de geração'],['#EVIDENCE','Evidências / anexos'],['#HISTORY','Histórico / tratativa']];
  const normal=fields.filter(f=>f.kind!=='divider'&&f.kind!=='fixed'&&!String(f.source).startsWith('@')).map(f=>[f.source,f.label||f.source]);
  return special.concat(normal);
 }
 function sample(source){
  const fixed={'#TITLE':dialog.querySelector('#umTitle')?.value||defaultTitle,'#HEADER':dialog.querySelector('#ud_header')?.value||'','#CODE':dialog.querySelector('#ud_code')?.value||'','#FOOTER':dialog.querySelector('#umFooter')?.value||'','#GENERATED':'Gerado pelo Núcleo em 08/10/2026 13:15','#EVIDENCE':'Evidências e anexos do documento','#HISTORY':'Histórico / tratativa do documento'};
  if(source in fixed)return fixed[source];
  return ({'R.O.':'RO-IN-00296','Cliente':'Cliente de exemplo','Descrição':'Descrição do problema registrada no documento','Unidade':unit==='filial'?'SETA ES — Unidade Linhares':'SETA SC — Matriz','Data':'08/10/2026','Quantidade de peças com desvio':'120','Responsável':'Responsável de exemplo','Setor':'Qualidade'})[source]||'Dado do documento';
 }
 function cellDisplay(c){if(c.type==='image')return '';if(c.source)return sample(c.source);return c.text||'';}
 function rowBounds(row,cell){const total=row.cells.reduce((s,c)=>s+(Number(c.width)||50),0)||100;let cur=0;for(const c of row.cells){const w=(Number(c.width)||50)/total*100;if(c===cell)return[cur,cur+w];cur+=w}return[0,100];}
 function mergeVertical(dir){const sel=findSelected();if(!sel)return;const {cell,row,ri}=sel,span=Math.max(1,Number(cell.rowSpan)||1),targetIndex=dir<0?ri-1:ri+span;if(targetIndex<0||targetIndex>=currentGrid().length)return alert('Não há linha nessa direção.');const target=currentGrid()[targetIndex];const [l,r]=rowBounds(row,cell);let best=null,bestOverlap=0;for(const c of target.cells){const [tl,tr]=rowBounds(target,c),ov=Math.max(0,Math.min(r,tr)-Math.max(l,tl));if(ov>bestOverlap){bestOverlap=ov;best=c}}if(!best||bestOverlap<Math.max(2,(r-l)*.30))return alert('Não encontrei uma célula alinhada nessa direção.');if(!confirm('Mesclar verticalmente? O conteúdo da outra célula será removido.'))return;target.cells.splice(target.cells.indexOf(best),1);if(!target.cells.length)currentGrid().splice(targetIndex,1);if(dir<0){cell.rowSpan=span+Math.max(1,Number(best.rowSpan)||1);const sourceRow=currentGrid().indexOf(row);if(targetIndex<sourceRow){row.cells.splice(row.cells.indexOf(cell),1);if(!row.cells.length)currentGrid().splice(sourceRow,1);const tr=currentGrid()[targetIndex]||target;tr.cells.push(cell);}}else cell.rowSpan=span+Math.max(1,Number(best.rowSpan)||1);renderAll();}
 function splitCell(){const sel=findSelected();if(!sel)return;const c=sel.cell;if((Number(c.rowSpan)||1)>1){c.rowSpan=1;renderAll();return;}const half=Math.max(5,(Number(c.width)||50)/2);c.width=half;sel.row.cells.splice(sel.ci+1,0,newCell({width:half}));renderAll();}
 function mergeRight(){const sel=findSelected();if(!sel||sel.ci>=sel.row.cells.length-1)return alert('Não há célula à direita.');const other=sel.row.cells[sel.ci+1];if(!confirm('Mesclar com a célula à direita? O conteúdo da segunda célula será removido.'))return;sel.cell.width=Math.min(100,(Number(sel.cell.width)||50)+(Number(other.width)||50));sel.row.cells.splice(sel.ci+1,1);renderAll();}
 function moveCell(dir){const s=findSelected();if(!s)return;const j=s.ci+dir;if(j<0||j>=s.row.cells.length)return;[s.row.cells[s.ci],s.row.cells[j]]=[s.row.cells[j],s.row.cells[s.ci]];renderAll();}
 function moveRow(dir){const s=findSelected();if(!s)return;const j=s.ri+dir;if(j<0||j>=currentGrid().length)return;[currentGrid()[s.ri],currentGrid()[j]]=[currentGrid()[j],currentGrid()[s.ri]];renderAll();}
 function deleteSelected(){const s=findSelected();if(!s)return;s.row.cells.splice(s.ci,1);if(!s.row.cells.length)currentGrid().splice(s.ri,1);selectedId='';renderAll();}
 async function uploadCellImage(file){if(!file)return;if(file.size>150*1024)throw new Error('A imagem deve ter até 150 KB.');const sel=findSelected();if(!sel)throw new Error('Selecione uma célula primeiro.');const data=await fileToBase64(file),res=await nucleoDriveMutation('nucleo_drive_process_formats',{unit,kind:'logo',modelKind:kind,fileData:data});sel.cell.type='image';sel.cell.source='';sel.cell.imageFileId=res.logoFileId;sel.cell.text='';imagePreviews[res.logoFileId]='data:'+(file.type||'image/png')+';base64,'+data;renderAll();}
 function renderToolbar(){
  const host=dialog.querySelector('#umToolbar'),inspector=dialog.querySelector('#umCellInspector'),s=findSelected();
  if(!host)return;
  host.innerHTML=`<div style="display:flex;gap:5px;flex-wrap:wrap;align-items:center"><button class="btn secondary" data-op="addrow">+ Linha</button><button class="btn secondary" data-op="addcell">+ Célula</button>${s?`<button class="btn secondary" data-op="left">←</button><button class="btn secondary" data-op="right">→</button><button class="btn secondary" data-op="up">Linha ↑</button><button class="btn secondary" data-op="down">Linha ↓</button><button class="btn secondary" data-op="merge">Mesclar →</button><button class="btn secondary" data-op="mergeup">Mesclar ↑</button><button class="btn secondary" data-op="mergedown">Mesclar ↓</button><button class="btn secondary" data-op="split">Dividir</button><button class="btn danger" data-op="delete">Excluir</button>`:''}</div>`;
  if(inspector){
   inspector.innerHTML=s?`<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px"><b style="font-size:13px">Célula selecionada</b><button class="btn secondary" type="button" data-op="clearSelection">Fechar edição</button></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:7px"><label>Conteúdo<select data-cell="source">${sourceOptions().map(([v,l])=>`<option value="${esc(v)}" ${s.cell.source===v?'selected':''}>${esc(l)}</option>`).join('')}</select></label><label>Tipo<select data-cell="type"><option value="text" ${s.cell.type==='text'?'selected':''}>Texto</option><option value="field" ${s.cell.type==='field'?'selected':''}>Campo</option><option value="divider" ${s.cell.type==='divider'?'selected':''}>Divisória</option><option value="image" ${s.cell.type==='image'?'selected':''}>Imagem</option><option value="special" ${s.cell.type==='special'?'selected':''}>Especial</option></select></label><label style="grid-column:1/-1">Texto livre<textarea data-cell="text" rows="2">${esc(s.cell.text||'')}</textarea></label><label>Largura (%)<input data-cell="width" type="number" min="5" max="100" step="1" value="${clamp(s.cell.width,5,100,50)}"></label><label>Altura mín. (mm)<input data-cell="height" type="number" min="3" max="120" step=".5" value="${clamp(s.cell.height,3,120,9)}"></label><label>Tamanho fonte (pt)<input data-cell="fontSize" type="number" min="6" max="28" step=".5" value="${clamp(s.cell.fontSize,6,28,9)}"></label><label>Fundo<input data-cell="background" type="color" value="${color(s.cell.background,'#ffffff')}"></label><label>Texto<input data-cell="textColor" type="color" value="${color(s.cell.textColor,'#222222')}"></label><label>Esp. borda (pt)<input data-cell="borderWidth" type="number" min="0" max="4" step=".25" value="${clamp(s.cell.borderWidth,0,4,.5)}"></label><label>Alinhamento<select data-cell="align"><option value="left" ${s.cell.align==='left'?'selected':''}>Esquerda</option><option value="center" ${s.cell.align==='center'?'selected':''}>Centro</option><option value="right" ${s.cell.align==='right'?'selected':''}>Direita</option></select></label><label>Vertical<select data-cell="verticalAlign"><option value="top" ${s.cell.verticalAlign==='top'?'selected':''}>Topo</option><option value="middle" ${s.cell.verticalAlign==='middle'?'selected':''}>Centro</option><option value="bottom" ${s.cell.verticalAlign==='bottom'?'selected':''}>Base</option></select></label><label style="display:flex;gap:6px;align-items:center"><input data-cell="bold" type="checkbox" ${s.cell.bold?'checked':''} style="width:18px"> Negrito</label><label style="display:flex;gap:6px;align-items:center"><input data-cell="italic" type="checkbox" ${s.cell.italic?'checked':''} style="width:18px"> Itálico</label><div style="grid-column:1/-1;border:1px solid #dbe2ea;border-radius:10px;padding:8px"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><b style="font-size:12px">Bordas da célula</b><div style="display:flex;gap:5px"><button class="btn secondary" data-op="bordersAll" type="button">Todas</button><button class="btn secondary" data-op="bordersNone" type="button">Nenhuma</button></div></div><div style="display:grid;grid-template-columns:1fr;gap:7px;margin-top:7px">${[['borderTop','borderTopColor','Superior'],['borderRight','borderRightColor','Direita'],['borderBottom','borderBottomColor','Inferior'],['borderLeft','borderLeftColor','Esquerda']].map(([k,ck,l])=>`<label style="display:grid;grid-template-columns:auto 1fr;gap:6px;align-items:center;border:1px solid #e6eaf0;border-radius:8px;padding:6px"><span style="display:flex;gap:5px;align-items:center"><input data-cell="${k}" type="checkbox" ${s.cell[k]!==false?'checked':''} style="width:18px"> ${l}</span><input data-cell="${ck}" type="color" value="${color(s.cell[ck],color(s.cell.borderColor,'#999999'))}" title="Cor da borda ${l.toLowerCase()}"></label>`).join('')}</div></div><button class="btn secondary" data-op="image" style="grid-column:1/-1">Inserir / trocar imagem</button></div>`:`<div style="padding:10px;border:1px dashed #cbd5e1;border-radius:10px;color:#64748b;font-size:12px">Clique em uma célula da folha para editar suas propriedades. A prévia permanece livre.</div>`;
  }
  const roots=[host,inspector].filter(Boolean);
  roots.forEach(root=>root.querySelectorAll('[data-op]').forEach(b=>b.onclick=async()=>{try{const op=b.dataset.op;if(op==='clearSelection'){selectedId='';renderAll();return;}if(op==='addrow'){const r=newRow([newCell({width:100})]);currentGrid().push(r);selectedId=r.cells[0].id}else if(op==='addcell'){const x=findSelected();if(x){const c=newCell({width:Math.max(10,Math.round((Number(x.cell.width)||50)/2))});x.cell.width=c.width;x.row.cells.splice(x.ci+1,0,c);selectedId=c.id}else{const r=newRow([newCell({width:100})]);currentGrid().push(r);selectedId=r.cells[0].id}}else if(op==='left')moveCell(-1);else if(op==='right')moveCell(1);else if(op==='up')moveRow(-1);else if(op==='down')moveRow(1);else if(op==='merge')mergeRight();else if(op==='mergeup')mergeVertical(-1);else if(op==='mergedown')mergeVertical(1);else if(op==='split')splitCell();else if(op==='delete')deleteSelected();else if(op==='image')dialog.querySelector('#umCellImage').click();else if(op==='bordersAll'){const x=findSelected();if(x){x.cell.borderTop=x.cell.borderRight=x.cell.borderBottom=x.cell.borderLeft=true;}}else if(op==='bordersNone'){const x=findSelected();if(x){x.cell.borderTop=x.cell.borderRight=x.cell.borderBottom=x.cell.borderLeft=false;}}renderAll();}catch(e){dialog.querySelector('#umStatus').textContent=e.message;}}));
  if(inspector)inspector.querySelectorAll('[data-cell]').forEach(el=>{const apply=()=>{const x=findSelected();if(!x)return;const k=el.dataset.cell;x.cell[k]=el.type==='checkbox'?el.checked:el.type==='number'?Number(el.value):el.value;if(k==='source')x.cell.type=el.value?(String(el.value).startsWith('#')?'special':'field'):'text';renderPreview();};el.onchange=apply;if(['text','number','color'].includes(el.type)||el.tagName==='TEXTAREA')el.oninput=apply;});
 }
 function rowUnits(row){const cells=row?.cells||[];if(!cells.length)return[];const total=cells.reduce((sum,c)=>sum+Math.max(0.01,Number(c.width)||50),0)||100;let used=0;return cells.map((c,i)=>{if(i===cells.length-1)return Math.max(1,100-used);const remaining=cells.length-i-1;let u=Math.max(1,Math.round((Math.max(.01,Number(c.width)||50)/total)*100));u=Math.min(u,Math.max(1,100-used-remaining));used+=u;return u;});}
 function renderPreviewGrid(grid){
  if(!grid.length)return '<div style="padding:8px;border:1px dashed #cbd5e1;color:#64748b">Região vazia</div>';
  const cols='<colgroup>'+Array.from({length:100},()=>'<col style="width:1%">').join('')+'</colgroup>';
  return `<table style="width:100%;border-collapse:collapse;table-layout:fixed">${cols}<tbody>${grid.map((row,ri)=>{const units=rowUnits(row);return `<tr data-univ-row="${ri}">${row.cells.map((c,ci)=>{const selected=c.id===selectedId,bw=clamp(c.borderWidth,0,4,.5),bc=color(c.borderColor,'#999999'),bt=c.borderTop!==false?`${bw}pt solid ${color(c.borderTopColor,bc)}`:'0 solid transparent',br=c.borderRight!==false?`${bw}pt solid ${color(c.borderRightColor,bc)}`:'0 solid transparent',bb=c.borderBottom!==false?`${bw}pt solid ${color(c.borderBottomColor,bc)}`:'0 solid transparent',bl=c.borderLeft!==false?`${bw}pt solid ${color(c.borderLeftColor,bc)}`:'0 solid transparent';let content;if(c.type==='image'){const src=imagePreviews[c.imageFileId]||'';content=src?`<img src="${src}" style="display:block;width:100%;max-height:${clamp(c.height,3,120,9)*3.78}px;object-fit:${c.imageFit||'contain'}">`:'<span style="color:#64748b">Imagem</span>';}else if(!c.source)content=`<div data-univ-edit="${c.id}" contenteditable="true" style="min-height:16px;outline:0;white-space:pre-wrap">${esc(c.text||'')}</div>`;else content=esc(cellDisplay(c)).replace(/\n/g,'<br>');const xHandle=ci<row.cells.length-1?`<span data-univ-resize-x="${c.id}" title="Arraste para ajustar a largura" style="position:absolute;right:-7px;top:0;width:14px;height:100%;cursor:col-resize;z-index:40;touch-action:none;display:flex;justify-content:center;align-items:center"><i style="display:block;width:${selected?'3':'2'}px;height:100%;background:${selected?'#2f6fed':'rgba(47,111,237,.35)'};pointer-events:none"></i></span>`:'';const yHandle=`<span data-univ-resize-y="${c.id}" title="Arraste para ajustar a altura" style="position:absolute;left:0;bottom:-7px;width:100%;height:14px;cursor:row-resize;z-index:39;touch-action:none;display:flex;align-items:center"><i style="display:block;width:100%;height:${selected?'3':'2'}px;background:${selected?'#2f6fed':'rgba(47,111,237,.25)'};pointer-events:none"></i></span>`;return `<td data-univ-cell="${c.id}" colspan="${units[ci]||1}" ${Number(c.rowSpan)>1?`rowspan="${Math.floor(Number(c.rowSpan))}"`:''} style="position:relative;cursor:pointer;height:${clamp(c.height,3,120,9)*3.78}px;background:${color(c.background,'#ffffff')};color:${color(c.textColor,'#222222')};border-top:${bt};border-right:${br};border-bottom:${bb};border-left:${bl};padding:5px;text-align:${c.align||'left'};vertical-align:${c.verticalAlign||'middle'};font-size:${clamp(c.fontSize,6,28,9)}pt;font-weight:${c.bold?'700':'400'};font-style:${c.italic?'italic':'normal'};overflow-wrap:anywhere;${selected?'box-shadow:inset 0 0 0 2px #2f6fed;':''}">${content||'&nbsp;'}${xHandle}${yHandle}</td>`}).join('')}</tr>`}).join('')}</tbody></table>`;
 }
 function renderPreview(){
  const paper=dialog.querySelector('#umPaper');if(!paper)return;const d=readDesign(false),m=clamp(dialog.querySelector('#umMargin')?.value,5,35,10),font=clamp(dialog.querySelector('#umFont')?.value,7,18,9),land=d.orientation==='landscape';paper.style.width=land?'1123px':'794px';paper.style.minHeight=land?'794px':'1123px';paper.style.padding=(m*3.78)+'px';paper.style.fontSize=font+'pt';paper.style.color=d.textColor;const hasGridImage=layout.headerGrid.some(r=>r.cells.some(c=>c.type==='image'));paper.innerHTML=`${logoPreview&&!hasGridImage?`<div style="text-align:${d.align};margin-bottom:8px"><img src="${logoPreview}" style="width:${clamp(d.logoWidth,10,80,30)}mm;max-height:25mm;object-fit:contain"></div>`:''}<div data-region-preview="header">${renderPreviewGrid(layout.headerGrid)}</div>${d.before?`<div style="white-space:pre-wrap;margin:8px 0">${esc(d.before)}</div>`:''}<div data-region-preview="body">${renderPreviewGrid(layout.bodyGrid)}</div>${d.after?`<div style="white-space:pre-wrap;margin:8px 0">${esc(d.after)}</div>`:''}<div data-region-preview="footer" style="margin-top:12px">${renderPreviewGrid(layout.footerGrid)}</div>`;
  paper.querySelectorAll('[data-univ-cell]').forEach(el=>el.onclick=e=>{if(e.target.closest('[data-univ-resize-x],[data-univ-resize-y]'))return;selectedId=el.dataset.univCell;for(const r of ['header','body','footer'])if(layout[r+'Grid'].some(row=>row.cells.some(c=>c.id===selectedId)))region=r;if(e.target.closest('[contenteditable]')){renderTabs();renderToolbar();return;}renderAll();});
  paper.querySelectorAll('[data-univ-edit]').forEach(el=>el.oninput=()=>{for(const r of ['header','body','footer'])for(const row of layout[r+'Grid']){const c=row.cells.find(x=>x.id===el.dataset.univEdit);if(c){c.text=el.innerText;return;}}});
  const locateCell=id=>{for(const r of ['header','body','footer'])for(let ri=0;ri<layout[r+'Grid'].length;ri++){const row=layout[r+'Grid'][ri];const ci=row.cells.findIndex(c=>c.id===id);if(ci>=0)return{region:r,grid:layout[r+'Grid'],row,ri,ci,cell:row.cells[ci]};}return null;};
  const beginResize=(e,axis)=>{
   e.preventDefault();e.stopPropagation();const handle=e.currentTarget,id=axis==='x'?handle.dataset.univResizeX:handle.dataset.univResizeY,hit=locateCell(id);if(!hit)return;selectedId=id;region=hit.region;
   const startX=e.clientX,startY=e.clientY,table=handle.closest('table'),tableWidth=Math.max(1,table?.getBoundingClientRect().width||1),pointerId=e.pointerId;
   try{handle.setPointerCapture(pointerId)}catch(_){ }
   if(axis==='x'){
    const next=hit.row.cells[hit.ci+1];if(!next)return;const a0=clamp(hit.cell.width,5,100,50),b0=clamp(next.width,5,100,50),pair=a0+b0,td=handle.closest('td'),nextTd=td?.nextElementSibling;
    const move=ev=>{if(ev.pointerId!==pointerId)return;const delta=(ev.clientX-startX)/tableWidth*100;const a=Math.max(5,Math.min(pair-5,a0+delta)),b=pair-a;hit.cell.width=+a.toFixed(2);next.width=+b.toFixed(2);const units=rowUnits(hit.row);if(td)td.colSpan=units[hit.ci]||1;if(nextTd)nextTd.colSpan=units[hit.ci+1]||1;dialog.querySelector('#umStatus').textContent=`Largura: ${hit.cell.width.toFixed(1)}% / ${next.width.toFixed(1)}%`;};
    const end=ev=>{if(ev.pointerId!==pointerId)return;cleanup();renderAll();};
    const cleanup=()=>{handle.removeEventListener('pointermove',move);handle.removeEventListener('pointerup',end);handle.removeEventListener('pointercancel',end);try{handle.releasePointerCapture(pointerId)}catch(_){ }document.body.style.cursor='';document.body.style.userSelect='';};
    document.body.style.cursor='col-resize';document.body.style.userSelect='none';handle.addEventListener('pointermove',move);handle.addEventListener('pointerup',end,{once:true});handle.addEventListener('pointercancel',end,{once:true});
   }else{
    const h0=clamp(hit.cell.height,3,120,9),rowEl=handle.closest('tr');
    const move=ev=>{if(ev.pointerId!==pointerId)return;const h=Math.max(3,Math.min(120,h0+(ev.clientY-startY)/3.78));hit.row.cells.forEach(c=>c.height=+h.toFixed(2));rowEl?.querySelectorAll('[data-univ-cell]').forEach(td=>td.style.height=(h*3.78)+'px');dialog.querySelector('#umStatus').textContent=`Altura da linha: ${h.toFixed(1)} mm`;};
    const end=ev=>{if(ev.pointerId!==pointerId)return;cleanup();renderAll();};
    const cleanup=()=>{handle.removeEventListener('pointermove',move);handle.removeEventListener('pointerup',end);handle.removeEventListener('pointercancel',end);try{handle.releasePointerCapture(pointerId)}catch(_){ }document.body.style.cursor='';document.body.style.userSelect='';};
    document.body.style.cursor='row-resize';document.body.style.userSelect='none';handle.addEventListener('pointermove',move);handle.addEventListener('pointerup',end,{once:true});handle.addEventListener('pointercancel',end,{once:true});
   }
  };
  paper.querySelectorAll('[data-univ-resize-x]').forEach(h=>{h.onpointerdown=e=>beginResize(e,'x');h.onmouseenter=()=>h.querySelector('i').style.background='#2f6fed';h.onmouseleave=()=>{if(h.dataset.univResizeX!==selectedId)h.querySelector('i').style.background='rgba(47,111,237,.35)';}});
  paper.querySelectorAll('[data-univ-resize-y]').forEach(h=>{h.onpointerdown=e=>beginResize(e,'y');h.onmouseenter=()=>h.querySelector('i').style.background='#2f6fed';h.onmouseleave=()=>{if(h.dataset.univResizeY!==selectedId)h.querySelector('i').style.background='rgba(47,111,237,.25)';}});
 }
 function renderTabs(){dialog.querySelectorAll('[data-region]').forEach(b=>{b.classList.toggle('primary',b.dataset.region===region);b.classList.toggle('secondary',b.dataset.region!==region);b.onclick=()=>{region=b.dataset.region;selectedId='';renderAll();}});}
 function renderAll(){renderTabs();renderToolbar();renderPreview();}
 function readDesign(strict=true){const q=id=>dialog.querySelector('#ud_'+id);const base=model.design||{};const d={header:q('header')?.value??base.header??'',code:q('code')?.value??base.code??'',before:q('before')?.value??base.before??'',after:q('after')?.value??base.after??'',accent:q('accent')?.value||base.accent||'#24577b',textColor:q('textColor')?.value||base.textColor||'#222222',borderColor:q('borderColor')?.value||base.borderColor||'#999999',borderWidth:Number(q('borderWidth')?.value??base.borderWidth??.5),labelWidth:Number(base.labelWidth??38),padding:Number(base.padding??4),titleSize:Number(q('titleSize')?.value??base.titleSize??16),logoWidth:Number(q('logoWidth')?.value??base.logoWidth??30),orientation:q('orientation')?.value||base.orientation||'portrait',align:q('align')?.value||base.align||'center',repeatHeader:dialog.querySelector('#umRepeatHeader')?.checked!==false,repeatFooter:dialog.querySelector('#umRepeatFooter')?.checked!==false,logoFileId:base.logoFileId||''};if(strict){d.borderWidth=clamp(d.borderWidth,0,3,.5);d.titleSize=clamp(d.titleSize,10,32,16);d.logoWidth=clamp(d.logoWidth,10,80,30);}return d;}
 function renderFieldList(){const host=dialog.querySelector('#umFields');host.innerHTML=fields.map((f,i)=>`<div style="display:grid;grid-template-columns:24px 1fr 1fr;gap:5px;align-items:center;margin:4px 0"><input type="checkbox" data-fi="${i}" data-fk="enabled" ${f.enabled!==false?'checked':''}><input data-fi="${i}" data-fk="label" value="${esc(f.label||'')}" title="Nome do campo"><input data-fi="${i}" data-fk="section" value="${esc(f.section||'')}" title="Seção"></div>`).join('');host.querySelectorAll('[data-fi]').forEach(el=>el.onchange=()=>{const f=fields[Number(el.dataset.fi)],k=el.dataset.fk;f[k]=el.type==='checkbox'?el.checked:el.value;});}
 async function load(){
  const version=++loadVersion;try{
   const result=await portalJsonp({acao:'nucleo_drive_process_formats',unit,kind},60000);if(!dialog.isConnected||version!==loadVersion)return;if(!result?.sucesso)throw Error(result?.erro||'Modelo indisponível.');
   catalog=kind==='pdca'?result.pdcaFieldCatalog:kind==='sac'?result.sacFieldCatalog:result.roFieldCatalog;if(!Array.isArray(catalog)||!catalog.length)throw Error('Atualize o Apps Script para carregar os campos deste editor.');
   model=result.formats?.[kind]||{};imagePreviews=result.gridImagePreviews||{};logoPreview=result.logoPreviews?.[kind]||result.logoPreview||'';pendingLogo=null;
   fields=(model.fields||catalog.map(source=>({source,label:(kind==='sac'?result.sacDefaultLabels?.[source]:null)||source,enabled:true,section:kind==='pdca'?result.pdcaDefaultSections?.[source]||'':kind==='sac'?result.sacDefaultSections?.[source]||'':''}))).map(x=>({...x}));
   const raw=model.universalLayout;
   if(raw?.version>=2){
     layout={version:2,repeatHeader:raw.repeatHeader!==false,repeatFooter:raw.repeatFooter!==false,headerGrid:normalizeGrid(raw.headerGrid),bodyGrid:normalizeGrid(raw.bodyGrid),footerGrid:normalizeGrid(raw.footerGrid)};
   }else{
     // Preserve o desenho já existente do modelo operacional. O editor universal
     // não deve "trocar" o PDCA/R.O./SAC por uma tabela nova só porque entrou em edição.
     const legacyBody=normalizeGrid(model.layoutGrid);
     layout={version:2,repeatHeader:true,repeatFooter:true,headerGrid:standardHeaderGrid(),bodyGrid:legacyBody.length?legacyBody:defaultBodyGrid(),footerGrid:standardFooterGrid()};
   }
   region='body';selectedId='';
   const d={header:'',code:'',before:'',after:'',accent:'#24577b',textColor:'#222222',borderColor:'#999999',borderWidth:.5,titleSize:16,logoWidth:30,orientation:'portrait',align:'center',repeatHeader:true,repeatFooter:true,...(model.design||{})};
   dialog.innerHTML=`<div style="height:100%;display:flex;flex-direction:column"><header style="display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid #dbe2ea"><div><b>Editor universal · ${modelName}</b><div class="small">Edite a folha diretamente. Esta estrutura é usada na emissão do PDF.</div></div><div style="display:flex;gap:7px"><button class="btn primary" id="umSave">Salvar modelo</button><button class="btn secondary" id="umClose">Fechar</button></div></header><div style="display:grid;grid-template-columns:370px minmax(0,1fr);min-height:0;flex:1"><aside style="overflow:auto;padding:12px;border-right:1px solid #e2e8f0"><label>Unidade<select id="umUnit" ${getSession()?.role==='quality'?'disabled':''}><option value="matriz">SETA SC — Matriz</option><option value="filial">SETA ES — Unidade Linhares</option></select></label><label>Título<input id="umTitle" maxlength="180" value="${esc(model.title||defaultTitle)}"></label><div style="display:grid;grid-template-columns:1fr 1fr;gap:7px"><label>Fonte base (pt)<input id="umFont" type="number" min="7" max="18" value="${model.fontSize||9}"></label><label>Margem (mm)<input id="umMargin" type="number" min="5" max="35" value="${model.marginMm||10}"></label></div><label>Rodapé<textarea id="umFooter" rows="2" maxlength="1500">${esc(model.footer||'')}</textarea></label><label style="display:flex;gap:7px;align-items:center"><input id="umEvidence" type="checkbox" ${model.showEvidence!==false?'checked':''} style="width:18px"> Incluir evidências</label><details open><summary><b>Cabeçalho, página e identidade</b></summary><label>Logo PNG/JPEG (até 150 KB)<input id="umLogo" type="file" accept="image/png,image/jpeg"></label><button class="btn secondary" id="umRemoveLogo" type="button">Retirar logo</button><label>Texto do cabeçalho<input id="ud_header" value="${esc(d.header)}"></label><label>Código / revisão<input id="ud_code" value="${esc(d.code)}"></label><label>Texto antes dos campos<textarea id="ud_before" rows="2">${esc(d.before)}</textarea></label><label>Texto depois dos campos<textarea id="ud_after" rows="2">${esc(d.after)}</textarea></label><div style="display:grid;grid-template-columns:1fr 1fr;gap:7px"><label>Orientação<select id="ud_orientation"><option value="portrait" ${d.orientation!=='landscape'?'selected':''}>Retrato</option><option value="landscape" ${d.orientation==='landscape'?'selected':''}>Paisagem</option></select></label><label>Alinhamento<select id="ud_align"><option value="left" ${d.align==='left'?'selected':''}>Esquerda</option><option value="center" ${d.align==='center'?'selected':''}>Centro</option><option value="right" ${d.align==='right'?'selected':''}>Direita</option></select></label><label>Tamanho título<input id="ud_titleSize" type="number" min="10" max="32" value="${d.titleSize}"></label><label>Largura logo (mm)<input id="ud_logoWidth" type="number" min="10" max="80" value="${d.logoWidth}"></label><label>Cor destaque<input id="ud_accent" type="color" value="${color(d.accent,'#24577b')}"></label><label>Cor texto<input id="ud_textColor" type="color" value="${color(d.textColor,'#222222')}"></label><label>Cor borda padrão<input id="ud_borderColor" type="color" value="${color(d.borderColor,'#999999')}"></label><label>Esp. borda padrão<input id="ud_borderWidth" type="number" min="0" max="3" step=".25" value="${d.borderWidth}"></label></div><label style="display:flex;gap:7px;align-items:center"><input id="umRepeatHeader" type="checkbox" ${layout.repeatHeader!==false?'checked':''} style="width:18px"> Repetir cabeçalho nas páginas</label><label style="display:flex;gap:7px;align-items:center"><input id="umRepeatFooter" type="checkbox" ${layout.repeatFooter!==false?'checked':''} style="width:18px"> Repetir rodapé nas páginas</label><div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:8px"><button class="btn secondary" id="umHeaderStandard" type="button">Aplicar cabeçalho padrão</button><button class="btn secondary" id="umFooterStandard" type="button">Aplicar rodapé padrão</button></div><div class="small" style="margin-top:5px">O padrão já traz título/código no cabeçalho e rodapé/data de geração no final. Depois você pode ajustar normalmente.</div></details><div id="umCellInspector" style="margin-top:10px;border:1px solid #dbe2ea;border-radius:12px;padding:10px;background:#f8fafc"></div><details><summary><b>Campos disponíveis</b></summary><p class="small">Isto controla os nomes usados na estrutura padrão. A folha pode ter qualquer arranjo.</p><div id="umFields"></div><button class="btn secondary" id="umRebuild" type="button">Regenerar corpo com os campos</button></details><input id="umCellImage" type="file" accept="image/png,image/jpeg" hidden><p id="umStatus" class="small" role="status">Clique em uma célula da folha para editar.</p></aside><main style="overflow:auto;background:#e9edf2;padding:16px"><div style="position:sticky;top:0;z-index:80;background:#f8fafc;border:1px solid #dbe3ee;border-radius:12px;padding:9px;margin:0 auto 10px;max-width:1123px;box-shadow:0 3px 14px #0f172a12"><div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:7px"><button class="btn secondary" data-region="header">Cabeçalho</button><button class="btn secondary" data-region="body">Corpo</button><button class="btn secondary" data-region="footer">Rodapé</button><span style="width:1px;background:#cbd5e1;margin:0 3px"></span><button class="btn secondary" id="umHeaderStandardTop" type="button">Aplicar cabeçalho padrão</button><button class="btn secondary" id="umFooterStandardTop" type="button">Aplicar rodapé padrão</button></div><div id="umToolbar"></div></div><div id="umPaper" style="margin:0 auto;background:#fff;box-shadow:0 7px 28px #15223925;box-sizing:border-box"></div></main></div></div>`;
   dialog.querySelector('#umUnit').value=unit;dialog.querySelector('#umUnit').onchange=e=>{unit=e.target.value;load()};dialog.querySelector('#umClose').onclick=()=>dialog.close();
   ['umTitle','umFont','umMargin','umFooter','umEvidence','umRepeatHeader','umRepeatFooter','ud_header','ud_code','ud_before','ud_after','ud_orientation','ud_align','ud_titleSize','ud_logoWidth','ud_accent','ud_textColor','ud_borderColor','ud_borderWidth'].forEach(id=>{const el=dialog.querySelector('#'+id);if(el){el.oninput=()=>{layout.repeatHeader=dialog.querySelector('#umRepeatHeader').checked;layout.repeatFooter=dialog.querySelector('#umRepeatFooter').checked;renderPreview()};el.onchange=el.oninput;}});
   dialog.querySelector('#umLogo').onchange=async e=>{const f=e.target.files[0];if(!f)return;if(f.size>150*1024){e.target.value='';return dialog.querySelector('#umStatus').textContent='Logo maior que 150 KB.';}pendingLogo={fileData:await fileToBase64(f)};logoPreview='data:'+(f.type||'image/png')+';base64,'+pendingLogo.fileData;renderPreview();};
   dialog.querySelector('#umRemoveLogo').onclick=()=>{pendingLogo=null;logoPreview='';model.design={...(model.design||{}),logoFileId:''};renderPreview();};
   const applyHeaderStandard=()=>{layout.headerGrid=standardHeaderGrid();region='header';selectedId=layout.headerGrid[0]?.cells[0]?.id||'';renderAll();dialog.querySelector('#umStatus').textContent='Cabeçalho padrão aplicado à folha. Clique nas células para personalizar.';};
   const applyFooterStandard=()=>{layout.footerGrid=standardFooterGrid();region='footer';selectedId=layout.footerGrid[0]?.cells[0]?.id||'';renderAll();dialog.querySelector('#umStatus').textContent='Rodapé padrão aplicado à folha. Clique nas células para personalizar.';};
   dialog.querySelector('#umHeaderStandard').onclick=applyHeaderStandard;
   dialog.querySelector('#umFooterStandard').onclick=applyFooterStandard;
   dialog.querySelector('#umHeaderStandardTop').onclick=applyHeaderStandard;
   dialog.querySelector('#umFooterStandardTop').onclick=applyFooterStandard;
   dialog.querySelector('#umCellImage').onchange=async e=>{try{dialog.querySelector('#umStatus').textContent='Enviando imagem…';await uploadCellImage(e.target.files[0]);dialog.querySelector('#umStatus').textContent='Imagem incluída na célula. Salve o modelo para gravar o layout.';}catch(err){dialog.querySelector('#umStatus').textContent=err.message;}finally{e.target.value='';}};
   dialog.querySelector('#umRebuild').onclick=()=>{if(!confirm('Substituir o corpo atual pela grade gerada a partir dos campos?'))return;layout.bodyGrid=defaultBodyGrid();region='body';selectedId='';renderAll();};
   dialog.querySelector('#umSave').onclick=async e=>{const btn=e.currentTarget,status=dialog.querySelector('#umStatus');btn.disabled=true;try{if(!String(dialog.querySelector('#umTitle').value||'').trim())throw new Error('Informe o título.');if(!fields.length||fields.some(f=>!String(f.label||'').trim()))throw new Error('Confira os nomes dos campos.');if(!fields.some(f=>f.enabled!==false))throw new Error('Mantenha pelo menos um campo disponível.');const font=clamp(dialog.querySelector('#umFont').value,7,18,9),margin=clamp(dialog.querySelector('#umMargin').value,5,35,10),design=readDesign(true);if(pendingLogo){status.textContent='Enviando logo…';const up=await nucleoDriveMutation('nucleo_drive_process_formats',{unit,kind:'logo',modelKind:kind,...pendingLogo});design.logoFileId=up.logoFileId;model.design={...(model.design||{}),logoFileId:up.logoFileId};pendingLogo=null;}else design.logoFileId=model.design?.logoFileId||design.logoFileId||'';layout.repeatHeader=dialog.querySelector('#umRepeatHeader').checked;layout.repeatFooter=dialog.querySelector('#umRepeatFooter').checked;const format={title:dialog.querySelector('#umTitle').value.trim(),footer:dialog.querySelector('#umFooter').value,fontSize:font,labels:model.labels||[],fields:fields.map(f=>({...f,enabled:f.enabled!==false,label:String(f.label||'').trim(),section:String(f.section||'').trim()})),marginMm:margin,labelColor:model.labelColor||'#f1f4f3',showEvidence:dialog.querySelector('#umEvidence').checked,design,layoutGrid:layout.bodyGrid,universalLayout:{version:2,headerGrid:layout.headerGrid,bodyGrid:layout.bodyGrid,footerGrid:layout.footerGrid,repeatHeader:layout.repeatHeader,repeatFooter:layout.repeatFooter}};status.textContent='Salvando e aguardando confirmação da base central…';const saved=await nucleoDriveMutation('nucleo_drive_process_formats',{unit,kind,data:JSON.stringify(format)});model=saved.formats[kind];status.textContent='Modelo salvo e confirmado. A grade desta folha será usada nas próximas emissões de '+modelName+'.';}catch(err){status.textContent=err.message;}finally{btn.disabled=false;}};
   renderFieldList();renderAll();
  }catch(error){if(version!==loadVersion)return;dialog.innerHTML='<div style="padding:20px"><p>'+esc(error.message)+'</p><button class="btn secondary">Fechar</button></div>';dialog.querySelector('button').onclick=()=>dialog.close();}
 }
 await load();
}

