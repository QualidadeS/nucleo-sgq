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
      <label><span class="small">Tipo de documento *</span><select id="admModDocType">
        <option value="">Selecione...</option>
        <option value="IT">IT</option>
        <option value="GSP">GSP</option>
        <option value="POP">POP</option>
        <option value="LPP">LPP</option>
        <option value="FORM">Formulário</option>
        <option value="MANUAL">Manual</option>
        <option value="OTHER">Outro</option>
      </select></label>
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
  if(key==='processes'&&mode==='templates'){renderProcessTemplatesWorkspace();return}
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


function renderProcessTemplatesWorkspace(){
  const list=document.getElementById('adminModuleContent');if(!list)return;const t=getRncProcessTemplate();
  list.innerHTML=`<div style="grid-column:1/-1"><button class="btn secondary" type="button" onclick="showAdminOperationalModule('processes')">← Voltar ao módulo</button><button class="btn primary" onclick="nucleoDriveOpen('templates')">Modelos de documentos solicitados</button>${processDocumentLibraryHtml()}
  <div class="card" style="margin-top:14px;padding:20px">
    <div style="display:flex;justify-content:space-between;gap:16px;align-items:flex-start;flex-wrap:wrap"><div><div class="small" style="letter-spacing:.12em;color:#1455ff;font-weight:700">MODELO CONTROLADO</div><h3 style="margin:6px 0 4px">${escapeHtml(t.code)} · ${escapeHtml(t.name)}</h3><div class="small">A prévia mantém a estrutura do formulário padrão atual. Aqui você controla a identidade SETA e quais partes entram no documento, sem precisar editar o Excel.</div></div><span class="pill">${t.status==='obsolete'?'Obsoleto':'Vigente'}</span></div>
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
  if(key==='equipment')nucleoEquipmentReportsPanel(r);
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
 box.innerHTML='<h3>Laudos do equipamento</h3><label>Tipo / descrição do laudo<input id="equipmentReportTitle" maxlength="160" placeholder="Ex.: Laudo de calibração"></label><div class="grid"><label>Emissão<input type="date" id="equipmentReportIssued"></label><label>Validade (opcional)<input type="date" id="equipmentReportExpires"></label></div><label>Arquivo PDF<input id="equipmentReportFile" type="file" accept="application/pdf"></label><button class="btn primary" onclick="nucleoEquipmentUploadReport(this,\''+escapeHtml(record.id)+'\')">Anexar laudo</button><p id="equipmentReportStatus" role="status"></p><div id="equipmentReportsList">Consultando laudos…</div>';list.appendChild(box);
 try{const r=await portalJsonp({acao:'nucleo_drive_equipment_reports',unit:explicitRecordUnit(record),equipmentId:record.id},60000);if(!r?.sucesso)throw Error(r?.erro||'Consulta não concluída.');if(!box.isConnected)return;nucleoEquipmentRenderReports(record,r.reports||[]);}catch(e){if(box.isConnected)document.getElementById('equipmentReportsList').textContent=e.message;}
}
function nucleoEquipmentRenderReports(record,reports){
 const host=document.getElementById('equipmentReportsList');if(!host)return;
 host.innerHTML=reports.slice().reverse().map(p=>'<div class="card" style="padding:12px;margin:10px 0"><b>'+escapeHtml(p.title||p.fileName)+'</b><p class="small">'+escapeHtml(p.fileName)+(p.issued?' · Emissão: '+escapeHtml(p.issued):'')+(p.expires?' · Validade: '+escapeHtml(p.expires):'')+'</p><button class="btn secondary" onclick="nucleoEquipmentViewReport(\''+escapeHtml(record.id)+'\',\''+escapeHtml(p.id)+'\')">Abrir / baixar PDF</button></div>').join('')||'<p class="small">Nenhum laudo anexado.</p>';
}
async function nucleoEquipmentUploadReport(button,id){
 if(!nucleoFeatureRequire('equipment','edit'))return;const status=document.getElementById('equipmentReportStatus');button.disabled=true;
 try{const record=adminModuleRecord(id),file=document.getElementById('equipmentReportFile').files[0];if(!file)throw Error('Selecione o PDF do laudo.');if(file.size>8*1024*1024)throw Error('Selecione um PDF de até 8 MB.');status.textContent='Salvando laudo no Drive e vinculando ao equipamento…';await nucleoDriveLoad();
 const r=await nucleoDriveMutation('nucleo_drive_equipment_upload',{unit:explicitRecordUnit(record),equipmentId:id,fileData:await fileToBase64(file),fileName:file.name,title:document.getElementById('equipmentReportTitle').value.trim(),issued:document.getElementById('equipmentReportIssued').value,expires:document.getElementById('equipmentReportExpires').value});
 await syncPortalBackend(false);nucleoEquipmentRenderReports(record,r.reports||[]);document.getElementById('equipmentReportFile').value='';status.textContent='Laudo anexado e confirmado na base central.';
 }catch(e){status.textContent=e.message;}finally{button.disabled=false;}
}
async function nucleoEquipmentViewReport(id,reportId){
 try{const record=adminModuleRecord(id),r=await portalJsonp({acao:'nucleo_drive_equipment_read',unit:explicitRecordUnit(record),equipmentId:id,reportId},90000);if(!r?.sucesso)throw Error(r?.erro||'Laudo indisponível.');const url=URL.createObjectURL(new Blob([Uint8Array.from(atob(r.base64),c=>c.charCodeAt(0))],{type:'application/pdf'}));const dialog=document.createElement('dialog');dialog.style.cssText='width:90vw;border:0;border-radius:12px';dialog.innerHTML='<h3>'+escapeHtml(r.fileName)+'</h3><a class="btn secondary" download="'+escapeHtml(r.fileName)+'" href="'+url+'">Baixar PDF</a> <button class="btn secondary">Fechar</button><iframe title="Laudo" src="'+url+'" style="width:100%;height:70vh"></iframe>';document.body.appendChild(dialog);dialog.querySelector('button').onclick=()=>dialog.close();dialog.onclose=()=>{URL.revokeObjectURL(url);dialog.remove();};dialog.showModal();}catch(e){alert(e.message);}
}
