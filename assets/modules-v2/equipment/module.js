/* NÚCLEO MODULE: equipment | v2.0.0-test | funções migradas: 10 */

function nucleoPatchEquipmentReportsUi(){
  if(window.__nucleoEquipmentReportsPatched)return;
  if(typeof window.nucleoEquipmentReportsPanel!=='function' || typeof window.nucleoEquipmentRenderReports!=='function')return;

  window.__nucleoEquipmentReportsPatched=true;

  const originalRender=window.nucleoEquipmentRenderReports;
  window.nucleoEquipmentRenderReports=function(record,reports){
    const fresh=(typeof adminModuleRecord==='function'&&record?.id)?adminModuleRecord(record.id):record;
    const central=Array.isArray(fresh?.equipmentReports)?fresh.equipmentReports:[];
    const incoming=Array.isArray(reports)?reports:[];
    const merged=[];
    const seen=new Set();

    [...incoming,...central].forEach(item=>{
      if(!item)return;
      const key=String(item.fileId||item.id||item.fileName||'').trim();
      if(!key||seen.has(key))return;
      seen.add(key);

      const imported=!!item.importedFromDrive;
      merged.push({
        ...item,
        title:String(item.title||'').trim()||(imported?'Laudo de calibração':''),
        issued:String(item.issued||'').trim()||(imported?String(fresh?.lastCalibration||fresh?.eventDate||'').trim():''),
        expires:String(item.expires||'').trim()||(imported?String(fresh?.dueDate||'').trim():''),
        calibrationCompany:String(item.calibrationCompany||'').trim()||(imported?String(fresh?.lastCalibrationCompany||'').trim():'')
      });
    });

    const host=document.getElementById('equipmentReportsList');
    if(!host)return originalRender(fresh||record,merged);

    const equipmentId=String((fresh||record)?.id||'');
    host.innerHTML=merged.slice().reverse().map(p=>{
      const meta=[
        p.fileName||'',
        p.issued?'Emissão: '+p.issued:'',
        p.expires?'Validade: '+p.expires:'',
        p.calibrationCompany?'Empresa: '+p.calibrationCompany:''
      ].filter(Boolean).map(escapeHtml).join(' · ');

      return `<div class="card" style="padding:12px;margin:10px 0">
        <b>${escapeHtml(p.title||p.fileName||'Laudo')}</b>
        <p class="small">${meta}</p>
        <button class="btn secondary" onclick="nucleoEquipmentViewReport('${escapeHtml(equipmentId)}','${escapeHtml(p.id)}')">Abrir / baixar PDF</button>
        <button class="btn secondary" style="margin-left:8px;color:#b42318" onclick="nucleoEquipmentDeleteReport(this,'${escapeHtml(equipmentId)}','${escapeHtml(p.id)}')">Excluir laudo</button>
      </div>`;
    }).join('')||'<p class="small">Nenhum laudo anexado.</p>';
  };

  const originalPanel=window.nucleoEquipmentReportsPanel;
  window.nucleoEquipmentReportsPanel=async function(record){
    try{
      if(typeof syncPortalBackend==='function')await syncPortalBackend(false);
    }catch(_){}

    const fresh=(typeof adminModuleRecord==='function'&&record?.id)?adminModuleRecord(record.id):record;
    await originalPanel(fresh||record);

    const title=document.getElementById('equipmentReportTitle');
    const issued=document.getElementById('equipmentReportIssued');
    const expires=document.getElementById('equipmentReportExpires');
    if(title&&!title.value)title.value='Laudo de calibração';
    if(issued&&!issued.value&&fresh?.lastCalibration)issued.value=String(fresh.lastCalibration);
    if(expires&&!expires.value&&fresh?.dueDate)expires.value=String(fresh.dueDate);

    const panel=document.getElementById('equipmentReportsPanel');
    if(panel&&typeof nucleoEquipmentPendingKey==='function'){
      let hasPending=false;
      try{hasPending=!!localStorage.getItem(nucleoEquipmentPendingKey(fresh||record));}catch(_){}
      [...panel.querySelectorAll('button')].forEach(btn=>{
        if(String(btn.textContent||'').trim()==='Descartar tentativa pendente'){
          btn.style.display=hasPending?'':'none';
        }
      });
    }
  };
}

function nucleoMetrologyEmailEnabled(){
  if(typeof nucleoMetrologyEmailPreferenceCache==='boolean')return nucleoMetrologyEmailPreferenceCache;
  return nucleoCurrentUserRecord()?.metrologyEmailAlerts===true;
}

async function nucleoLoadMetrologyAlertPreferences(){
  const res=await portalJsonp({acao:'portal_metrology_email_preferences',mode:'get'},30000);
  if(res?.sucesso===false)throw new Error(res.erro||'Não foi possível consultar sua preferência.');
  nucleoMetrologyEmailPreferenceCache=!!res.enabled;
  const rec=nucleoCurrentUserRecord();if(rec)rec.metrologyEmailAlerts=!!res.enabled;
  return res;
}

async function nucleoOpenMetrologyAlertPreferences(){
  if(!isAdmin())return alert('Esta preferência é destinada às pessoas do SGQ.');
  let ov=document.getElementById('metrologyAlertPreferencesOverlay');if(ov)ov.remove();
  ov=document.createElement('div');ov.id='metrologyAlertPreferencesOverlay';ov.className='modal';ov.style.zIndex='100500';
  ov.innerHTML=`<div class="modal-box" style="width:min(620px,96vw)"><div style="display:flex;justify-content:space-between;gap:12px"><div><h3 style="margin:0">Meus alertas de calibração</h3><div class="small" style="margin-top:5px">Os avisos continuam aparecendo no Núcleo. Você decide se também quer recebê-los por e-mail.</div></div><button class="btn secondary" type="button" onclick="document.getElementById('metrologyAlertPreferencesOverlay')?.remove()">Fechar</button></div><label style="display:flex;align-items:flex-start;gap:10px;margin-top:18px;padding:14px;border:1px solid #e4e7ec;border-radius:10px"><input id="metrologyEmailAlertsEnabled" type="checkbox" disabled style="width:20px;height:20px;margin-top:1px"><span><b>Receber alertas de calibração por e-mail</b><div class="small" style="margin-top:4px">Você receberá e-mail quando houver necessidade de calibração e, se já estiver agendada, somente no dia agendado para lembrar de concluir e atualizar o cadastro.</div></span></label><div id="metrologyAlertPrefStatus" class="small" style="margin-top:10px">Carregando sua preferência da base central...</div><div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px"><button id="metrologyAlertPrefReload" class="btn secondary" type="button" onclick="nucleoReloadMetrologyAlertPreferences()">Recarregar</button><button id="metrologyAlertPrefSave" class="btn primary" type="button" disabled onclick="nucleoSaveMetrologyAlertPreferences()">Salvar preferência</button></div></div>`;
  document.body.appendChild(ov);
  await nucleoReloadMetrologyAlertPreferences();
}

async function nucleoReloadMetrologyAlertPreferences(){
  const check=document.getElementById('metrologyEmailAlertsEnabled'),status=document.getElementById('metrologyAlertPrefStatus'),save=document.getElementById('metrologyAlertPrefSave');
  if(status)status.textContent='Carregando sua preferência da base central...';if(check)check.disabled=true;if(save)save.disabled=true;
  try{
    const res=await nucleoLoadMetrologyAlertPreferences();
    if(check){check.checked=!!res.enabled;check.disabled=false}if(save)save.disabled=false;
    if(status)status.textContent=res.enabled?'E-mails de calibração estão ativados para você.':'E-mails de calibração estão desativados para você.';
  }catch(e){if(status)status.textContent='Erro ao carregar: '+(e?.message||e)}
}

async function nucleoSaveMetrologyAlertPreferences(){
  const check=document.getElementById('metrologyEmailAlertsEnabled'),enabled=!!check?.checked,status=document.getElementById('metrologyAlertPrefStatus'),save=document.getElementById('metrologyAlertPrefSave');
  if(status)status.textContent='Salvando na base central...';if(check)check.disabled=true;if(save)save.disabled=true;
  try{
    const res=await portalJsonp({acao:'portal_metrology_email_preferences',mode:'set',enabled:enabled?'1':'0'},30000);
    if(res?.sucesso===false)throw new Error(res.erro||'Não foi possível salvar a preferência.');
    nucleoMetrologyEmailPreferenceCache=!!res.enabled;
    const rec=nucleoCurrentUserRecord();if(rec)rec.metrologyEmailAlerts=!!res.enabled;
    if(check){check.checked=!!res.enabled;check.disabled=false}if(save)save.disabled=false;
    if(status)status.textContent=(res.enabled?'✓ E-mails de calibração ativados para você.':'✓ E-mails de calibração desativados para você.')+(res.triggerWarning?' Aviso: '+res.triggerWarning:'');
  }catch(e){if(check)check.disabled=false;if(save)save.disabled=false;if(status)status.textContent='Erro ao salvar: '+(e?.message||e)}
}

function nucleoMetrologyDaysUntil(dateStr){
  if(!dateStr)return null;const d=new Date(String(dateStr)+'T12:00:00'),n=new Date();if(Number.isNaN(d.getTime()))return null;
  const a=new Date(n.getFullYear(),n.getMonth(),n.getDate()),b=new Date(d.getFullYear(),d.getMonth(),d.getDate());return Math.round((b-a)/86400000);
}

function nucleoMetrologyAlertDescriptor(r){
  if(!r||r.module!=='equipment'||r.calibrationRequired===false)return null;
  if(r.calibrationScheduled){
    const d=nucleoMetrologyDaysUntil(r.scheduledCalibrationDate);
    if(d===0)return {kind:'scheduled_today',title:'Calibração agendada para hoje',message:`${r.title||'Equipamento'}${r.code?' · '+r.code:''}: a calibração está agendada para hoje. Após a execução, marque como concluída e atualize a próxima calibração.`,date:r.scheduledCalibrationDate};
    return null;
  }
  const d=nucleoMetrologyDaysUntil(r.dueDate);if(d===null)return null;const alertDays=Math.max(0,Number(r.alertDays??30)||0);
  if(d<0)return {kind:'overdue',title:'Calibração vencida',message:`${r.title||'Equipamento'}${r.code?' · '+r.code:''}: a calibração venceu em ${r.dueDate}. Agende a calibração ou atualize o cadastro.`,date:r.dueDate};
  if(d===0)return {kind:'due_today',title:'Calibração vence hoje',message:`${r.title||'Equipamento'}${r.code?' · '+r.code:''}: a calibração vence hoje. Agende a calibração ou registre a conclusão.`,date:r.dueDate};
  if(d<=alertDays)return {kind:'due_window',title:'Calibração próxima',message:`${r.title||'Equipamento'}${r.code?' · '+r.code:''}: faltam ${d} dia${d===1?'':'s'} para a calibração. Quando agendar, marque o agendamento no cadastro para interromper este alerta.`,date:r.dueDate};
  return null;
}

function nucleoClearEquipmentNotifications(equipmentId){
  const id=String(equipmentId||'');if(!id)return;
  const list=getNotifications().filter(n=>!(n?.type==='equipment'&&String(n.equipmentId||'')===id));
  saveNotifications(list);refreshNotificationBell();try{renderPendingHubNotifications()}catch(e){}
}

function nucleoRefreshMetrologyAlertsForCurrentUser(){
  if(!isAdmin())return;
  const sess=getSession()||{},unit=normalizePortalUnit(sess.unit||'');
  const list=getNotifications();let changed=false;
  getAdminModuleRecords().filter(r=>r.module==='equipment').forEach(r=>{
    const ru=normalizePortalUnit(r.unit||r.unidade||'');if(unit&&ru&&unit!==ru&&!(sess.accessUnits||[]).includes(ru))return;
    const a=nucleoMetrologyAlertDescriptor(r);if(!a)return;
    const id=`METRO-${r.id}-${a.kind}-${a.date||'nodate'}-${notificationUserKey()}`;
    if(list.some(n=>String(n.id)===id))return;
    const n={id,createdAt:new Date().toISOString(),type:'equipment',title:a.title,message:a.message,audience:'user',userKey:notificationUserKey(),unidade:r.unit||r.unidade||'',equipmentId:r.id};
    list.unshift(n);changed=true;
  });
  if(changed){saveNotifications(list);refreshNotificationBell();try{renderPendingHubNotifications()}catch(e){}}
}

