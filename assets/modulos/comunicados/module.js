/* NÚCLEO MODULE: announcements | v2.0.0-test | funções migradas: 38 */

function openAnnouncementImageDb(){
  return new Promise((resolve,reject)=>{
    if(!('indexedDB' in window)){reject(new Error('IndexedDB indisponível'));return}
    const req=indexedDB.open(ANNOUNCEMENT_IMAGE_DB,1);
    req.onupgradeneeded=()=>{
      const db=req.result;
      if(!db.objectStoreNames.contains(ANNOUNCEMENT_IMAGE_STORE)){
        db.createObjectStore(ANNOUNCEMENT_IMAGE_STORE);
      }
    };
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error||new Error('Falha ao abrir armazenamento de imagens'));
  });
}

async function saveAnnouncementImage(id,data){
  if(!data)return true;
  const db=await openAnnouncementImageDb();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(ANNOUNCEMENT_IMAGE_STORE,'readwrite');
    tx.objectStore(ANNOUNCEMENT_IMAGE_STORE).put(data,String(id));
    tx.oncomplete=()=>{db.close();resolve(true)};
    tx.onerror=()=>{const err=tx.error;db.close();reject(err||new Error('Falha ao salvar imagem'))};
  });
}

async function loadAnnouncementImage(id){
  try{
    const db=await openAnnouncementImageDb();
    const local=await new Promise((resolve,reject)=>{
      const tx=db.transaction(ANNOUNCEMENT_IMAGE_STORE,'readonly');
      const req=tx.objectStore(ANNOUNCEMENT_IMAGE_STORE).get(String(id));
      req.onsuccess=()=>resolve(req.result||'');
      req.onerror=()=>reject(req.error);
      tx.oncomplete=()=>db.close();
    });
    if(local)return local;
  }catch(e){}

  if(portalBackendEnabled()){
    try{
      const res=await portalJsonp({acao:'portal_imagem_comunicado',id:String(id)},30000);
      if(res?.sucesso&&res.dataUrl){
        saveAnnouncementImage(id,res.dataUrl).catch(()=>{});
        return res.dataUrl;
      }
    }catch(e){}
  }
  return '';
}

async function deleteAnnouncementImage(id){
  try{
    const db=await openAnnouncementImageDb();
    await new Promise((resolve,reject)=>{
      const tx=db.transaction(ANNOUNCEMENT_IMAGE_STORE,'readwrite');
      tx.objectStore(ANNOUNCEMENT_IMAGE_STORE).delete(String(id));
      tx.oncomplete=()=>{db.close();resolve()};
      tx.onerror=()=>{const err=tx.error;db.close();reject(err)};
    });
  }catch(e){}
}

function getAnnouncements(){
  try{
    const arr=JSON.parse(localStorage.getItem(ANNOUNCEMENTS_KEY)||'[]');
    return Array.isArray(arr)?arr:[];
  }catch(e){return []}
}

function saveAnnouncements(list){
  try{
    localStorage.setItem(ANNOUNCEMENTS_KEY,JSON.stringify(list||[]));
    return true;
  }catch(e){
    console.error('Portal SGQ: não foi possível salvar o comunicado.',e);
    return false;
  }
}

function getAnnouncementAcks(){
  try{return JSON.parse(localStorage.getItem(ANNOUNCEMENT_ACK_KEY)||'{}')||{}}
  catch(e){return {}}
}

function announcementUserKey(){
  const s=getSession();
  if(!s)return 'anonymous';
  return String(s.email||((s.name||'')+'|'+(s.sector||''))).trim().toLowerCase();
}

function updateAnnouncementAudienceUi(){
  nucleoAnnouncementUnitUi();
  const val=document.getElementById('announcementAudience')?.value||'all';
  const field=document.getElementById('announcementSectorField');
  if(field)field.style.display=val==='sector'?'block':'none';
}

function refreshAnnouncementSectorSelect(){
  const sel=document.getElementById('announcementSector');
  if(!sel)return;
  const cur=sel.value;
  const sectors=getConfiguredSectors(document.getElementById('announcementUnit')?.value||'filial');
  sel.innerHTML='<option value="">Selecione o setor...</option>'+sectors.map(s=>`<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
  if(cur && sectors.includes(cur))sel.value=cur;
}

function applyAnnouncementTemplate(type){
  const templates={
    procedure:{title:'Atualização de procedimento',message:'Informamos que houve uma atualização de procedimento.\n\nMudança:\n\nData de início:\n\nEm caso de dúvida, procure o SGQ.'},
    training:{title:'Treinamento programado',message:'Será realizado um treinamento referente ao processo abaixo.\n\nTema:\nData:\nHorário:\nLocal:\nPúblico:\n\nConfirme a leitura deste comunicado.'},
    audit:{title:'Auditoria programada',message:'Informamos a realização de auditoria.\n\nData:\nÁrea / setor:\nHorário previsto:\nOrientações:\n\nMantenha os registros e documentos aplicáveis disponíveis.'},
    deadline:{title:'Aviso de prazo',message:'Há um prazo importante relacionado ao SGQ.\n\nAssunto:\nPrazo:\nResponsável:\nAção necessária:'},
    general:{title:'Aviso geral',message:'Comunicamos a seguinte informação:\n\n'}
  };
  const t=templates[type]||templates.general;
  const title=document.getElementById('announcementTitle'),msg=document.getElementById('announcementMessage');
  if(title)title.value=t.title;if(msg)msg.value=t.message;
}

function prepareAnnouncementAttachment(input){
  const file=input?.files?.[0];
  if(!file){clearAnnouncementAttachment();return}
  if(file.size>5*1024*1024){alert('O anexo deve ter no máximo 5 MB.');input.value='';return}
  const allowed=['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','text/plain'];
  if(file.type && !allowed.includes(file.type)){alert('Formato de anexo não permitido.');input.value='';return}
  const reader=new FileReader();
  reader.onerror=()=>{alert('Não foi possível ler o anexo.');input.value=''};
  reader.onload=()=>{
    currentAnnouncementAttachmentData=String(reader.result||'');
    currentAnnouncementAttachmentName=file.name||'anexo';
    currentAnnouncementAttachmentType=file.type||'application/octet-stream';
    const box=document.getElementById('announcementAttachmentPreview'),name=document.getElementById('announcementAttachmentName');
    if(name)name.textContent=currentAnnouncementAttachmentName;if(box)box.classList.remove('hidden');
  };
  reader.readAsDataURL(file);
}

function clearAnnouncementAttachment(){
  currentAnnouncementAttachmentData='';currentAnnouncementAttachmentName='';currentAnnouncementAttachmentType='';
  const input=document.getElementById('announcementAttachment');if(input)input.value='';
  document.getElementById('announcementAttachmentPreview')?.classList.add('hidden');
}

function previewAnnouncementImage(input){
  const file=input?.files?.[0];
  if(!file){clearAnnouncementImage();return}
  if(!file.type.startsWith('image/')){
    alert('Selecione uma imagem válida.');
    input.value='';
    return;
  }

  const reader=new FileReader();
  reader.onerror=()=>{
    alert('Não foi possível ler esta imagem.');
    input.value='';
  };
  reader.onload=()=>{
    const original=String(reader.result||'');
    const img=new Image();

    img.onerror=()=>{
      alert('Não foi possível processar esta imagem.');
      input.value='';
    };

    img.onload=()=>{
      try{
        const maxW=1400;
        const maxH=900;
        const scale=Math.min(1,maxW/img.naturalWidth,maxH/img.naturalHeight);
        const w=Math.max(1,Math.round(img.naturalWidth*scale));
        const h=Math.max(1,Math.round(img.naturalHeight*scale));

        const canvas=document.createElement('canvas');
        canvas.width=w;
        canvas.height=h;
        const ctx=canvas.getContext('2d');
        ctx.drawImage(img,0,0,w,h);

        let data=canvas.toDataURL('image/jpeg',0.78);

        // Segunda redução automática para fotos ainda muito grandes.
        if(data.length>950000){
          const scale2=Math.min(1,1000/w,700/h);
          canvas.width=Math.max(1,Math.round(w*scale2));
          canvas.height=Math.max(1,Math.round(h*scale2));
          const ctx2=canvas.getContext('2d');
          ctx2.drawImage(img,0,0,canvas.width,canvas.height);
          data=canvas.toDataURL('image/jpeg',0.68);
        }

        currentAnnouncementImageData=data;

        const wrap=document.getElementById('announcementImagePreviewWrap');
        const preview=document.getElementById('announcementImagePreview');
        if(preview)preview.src=data;
        if(wrap)wrap.classList.remove('hidden');
      }catch(e){
        console.error(e);
        alert('Não foi possível preparar a imagem do comunicado.');
        input.value='';
      }
    };

    img.src=original;
  };
  reader.readAsDataURL(file);
}

function clearAnnouncementImage(){
  currentAnnouncementImageData='';
  const input=document.getElementById('announcementImage');
  if(input)input.value='';
  const wrap=document.getElementById('announcementImagePreviewWrap');
  if(wrap)wrap.classList.add('hidden');
  const img=document.getElementById('announcementImagePreview');
  if(img)img.removeAttribute('src');
}

function clearAnnouncementForm(){
  ['announcementTitle','announcementMessage','announcementStart','announcementEnd'].forEach(id=>{
    const el=document.getElementById(id); if(el)el.value='';
  });
  if(document.getElementById('announcementAudience'))document.getElementById('announcementAudience').value='all';
  if(document.getElementById('announcementRequireAck'))document.getElementById('announcementRequireAck').value='yes';
  if(document.getElementById('announcementPriority'))document.getElementById('announcementPriority').value='normal';
  if(document.getElementById('announcementSector'))document.getElementById('announcementSector').value='';
  updateAnnouncementAudienceUi();
  clearAnnouncementImage();
  clearAnnouncementAttachment();
}

async function publishAnnouncement(){
  if(!nucleoFeatureRequire('announcements','publish'))return;
  if(!nucleoPersonCan('announcements',true)){alert('Seu cadastro não permite emitir comunicados.');return;}
  const units=nucleoAnnouncementSelectedUnits();
  const publishStatus=document.getElementById('announcementPublishStatus');
  if(publishStatus)publishStatus.textContent='';
  const title=(document.getElementById('announcementTitle')?.value||'').trim();
  const message=(document.getElementById('announcementMessage')?.value||'').trim();
  const audience=document.getElementById('announcementAudience')?.value||'all';
  const sector=(document.getElementById('announcementSector')?.value||'').trim();
  const start=document.getElementById('announcementStart')?.value||'';
  const end=document.getElementById('announcementEnd')?.value||'';
  const requireAck=(document.getElementById('announcementRequireAck')?.value||'yes')==='yes';
  const priority=document.getElementById('announcementPriority')?.value||'normal';

  if(!units.length){alert('Selecione uma unidade autorizada.');return;}
  if(!title||!message){
    alert('Preencha título e mensagem do comunicado.');
    return;
  }
  if(audience==='sector'&&!sector){
    alert('Selecione o setor que deve receber o comunicado.');
    return;
  }
  if(start&&end&&end<start){
    alert('A data final não pode ser anterior à data inicial.');
    return;
  }

  const list=getAnnouncements();
  const announcementId='COM-'+Date.now();
  const announcement={
    id:announcementId,
    units,unit:units[0],
    title,
    message,
    audience,
    sector:audience==='sector'?sector:'',
    start,
    end,
    requireAck,
    priority,
    hasImage:Boolean(currentAnnouncementImageData),
    hasAttachment:Boolean(currentAnnouncementAttachmentData),
    attachmentName:currentAnnouncementAttachmentName||'',
    active:true,
    createdAt:new Date().toISOString(),
    createdBy:getSession()?.name||'SGQ'
  };

  if(currentAnnouncementImageData){
    try{
      await saveAnnouncementImage(announcementId,currentAnnouncementImageData);
    }catch(e){
      console.error('Portal SGQ: não foi possível salvar a foto do comunicado.',e);
      alert('Não foi possível salvar a foto. Tente outra imagem ou publique sem foto.');
      return;
    }
  }

  try{await portalBackendSaveConfirmed('announcements',announcementId,{...announcement,imageData:currentAnnouncementImageData||'',attachmentData:currentAnnouncementAttachmentData||'',attachmentName:currentAnnouncementAttachmentName||'',attachmentType:currentAnnouncementAttachmentType||''});}catch(e){if(publishStatus)publishStatus.textContent='Não foi possível publicar: '+e.message;alert('A base central não confirmou o comunicado: '+e.message);return;}
  list.unshift(announcement);
  const saved=saveAnnouncements(list);
  if(!saved){
    if(currentAnnouncementImageData)await deleteAnnouncementImage(announcementId);
    alert('Não foi possível salvar os dados do comunicado neste navegador. O armazenamento local já está cheio. O comunicado não foi publicado.');
    return;
  }

  try{
    createNotification({
      type:'announcement',
      audience:audience==='sector'?'sector':audience==='operational'?'operational':'all',
      sector:audience==='sector'?sector:'',
      title:priority==='urgent'?'Comunicado urgente do SGQ':'Novo comunicado do SGQ',
      message:title
    });
  }catch(e){
    console.warn('Comunicado salvo, mas não foi possível gerar a notificação interna.',e);
  }

  clearAnnouncementForm();
  renderAnnouncementsAdmin();
  if(publishStatus)publishStatus.textContent='Publicado agora.';
  alert('Comunicado publicado com sucesso.');
}

function announcementStatus(a){
  const today=new Date().toISOString().slice(0,10);
  if(a.active===false)return 'Encerrado';
  if(a.start&&today<a.start)return 'Agendado';
  if(a.end&&today>a.end)return 'Encerrado';
  return 'Ativo';
}

function eligibleAnnouncementUsers(a){
  return getOperationalUsers().filter(u=>{
    if(!nucleoAnnouncementInScope(a,u))return false;
    if(a.audience==='all')return true;
    if(a.audience==='operational')return !nucleoPersonPermissions(u).sgq;
    if(a.audience==='sector')return !nucleoPersonPermissions(u).sgq&&normalizeSectorEmailKey(u.sector)===normalizeSectorEmailKey(a.sector);
    return false;
  });
}

function announcementAckStats(a){
  const eligible=eligibleAnnouncementUsers(a);
  const ack=getAnnouncementAcks();
  let read=0;
  const rows=eligible.map(u=>{
    const key=String(u.email||((u.name||'')+'|'+(u.sector||''))).trim().toLowerCase();
    const ok=(ack[key]||[]).includes(a.id);
    if(ok)read++;
    return {name:u.name||u.email||'Usuário',sector:u.sector||'',ok};
  });
  return {total:eligible.length,read,pending:Math.max(0,eligible.length-read),rows};
}

function toggleAnnouncementAckReport(id){
  const box=document.getElementById('ackReport_'+id);if(!box)return;
  box.classList.toggle('hidden');
}

async function openAnnouncementAttachment(id){
  if(!portalBackendEnabled()){alert('O anexo está disponível pela base central do Portal SGQ.');return}
  try{
    const res=await portalJsonp({acao:'portal_anexo_comunicado',id:String(id)},30000);
    if(!res?.sucesso||!res.dataUrl)throw new Error(res?.erro||'Anexo não encontrado.');
    const a=document.createElement('a');a.href=res.dataUrl;a.download=res.filename||'anexo';document.body.appendChild(a);a.click();a.remove();
  }catch(e){alert('Não foi possível abrir o anexo: '+(e.message||e))}
}

function renderAnnouncementsAdmin(){
  nucleoAnnouncementUnitUi();
  const box=document.getElementById('announcementsAdminList');if(!box)return;
  const list=getAnnouncements();
  box.innerHTML=list.length?list.map(a=>{
    const status=announcementStatus(a),stats=announcementAckStats(a),pct=stats.total?Math.round((stats.read/stats.total)*100):0;
    return `<div class="announcement-admin-card ${status==='Ativo'?'':'inactive'} ${a.priority==='urgent'?'announcement-urgent':''}">
      <div class="announcement-admin-head">
        <div style="flex:1">
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
            <b>${escapeHtml(a.title)}</b>
            <span class="badge ${status==='Ativo'?'ok':'off'}">${escapeHtml(status)}</span>
            ${a.priority==='urgent'?'<span class="announcement-urgent-tag">⚠ Urgente</span>':''}
          </div>
          <div class="small" style="margin-top:4px">${escapeHtml(audienceLabel(a))} · ${a.requireAck?'Confirmação obrigatória':'Confirmação opcional'}</div>
          <div class="small" style="margin-top:3px">${a.start?'De '+escapeHtml(formatDateBR(a.start)):'Início imediato'}${a.end?' até '+escapeHtml(formatDateBR(a.end)):''}</div>
        </div>
        ${a.hasImage?`<img class="announcement-thumb" id="announcementThumb_${escapeHtml(a.id)}" alt="Imagem do comunicado">`:''}
      </div>
      <div style="margin-top:10px;white-space:pre-wrap">${escapeHtml(a.message)}</div>
      ${a.hasAttachment?`<button class="announcement-attachment" type="button" onclick="openAnnouncementAttachment('${escapeHtml(a.id)}')">📎 ${escapeHtml(a.attachmentName||'Abrir anexo')}</button>`:''}
      <div class="ack-report">
        <div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><b>Ciência de leitura</b><span>${stats.read}/${stats.total} confirmaram</span></div>
        <div class="ack-progress"><span style="width:${pct}%"></span></div>
        <div class="small">${stats.pending} pendente(s) · ${pct}% de confirmação</div>
        <button class="btn secondary" type="button" style="margin-top:8px" onclick="toggleAnnouncementAckReport('${escapeHtml(a.id)}')">Ver pessoas</button>
        <div id="ackReport_${escapeHtml(a.id)}" class="hidden" style="margin-top:8px">${stats.rows.length?stats.rows.map(r=>`<div class="small" style="padding:4px 0;border-top:1px solid #e5ebe9">${r.ok?'✓':'○'} ${escapeHtml(r.name)}${r.sector?' · '+escapeHtml(r.sector):''}</div>`).join(''):'<div class="small">Nenhum usuário elegível encontrado.</div>'}</div>
      </div>
      <div class="actions" style="margin-top:10px">
        ${status==='Ativo'?`<button class="btn secondary" type="button" onclick="endAnnouncement('${escapeHtml(a.id)}')">Encerrar</button>`:''}
        <button class="btn secondary" type="button" onclick="deleteAnnouncement('${escapeHtml(a.id)}')">Excluir</button>
      </div>
    </div>`;
  }).join(''):'<div class="small">Nenhum comunicado publicado.</div>';
  list.filter(a=>a.hasImage).forEach(async a=>{const data=await loadAnnouncementImage(a.id);const img=document.getElementById('announcementThumb_'+a.id);if(img&&data)img.src=data});
}

function endAnnouncement(id){
 if(!nucleoFeatureRequire('announcements','publish'))return;
  if(!isAdmin())return;
  const list=getAnnouncements();
  const i=list.findIndex(a=>String(a.id)===String(id));
  if(i<0)return;
  list[i].active=false;
  list[i].endedAt=new Date().toISOString();
  saveAnnouncements(list);
  portalBackendSave('announcements',list[i].id,list[i]);
  renderAnnouncementsAdmin();
}

async function deleteAnnouncement(id){
  if(!isAdmin())return;
  if(!confirm('Excluir este comunicado?'))return;
  saveAnnouncements(getAnnouncements().filter(a=>String(a.id)!==String(id)));
  portalBackendDelete('announcements',id);
  await deleteAnnouncementImage(id);
  renderAnnouncementsAdmin();
}

function showAnnouncementsAdmin(){
 if(!nucleoFeatureRequire('announcements','publish'))return;
  if(!isAdmin()){showList();return}
  refreshAnnouncementSectorSelect();
  updateAnnouncementAudienceUi();
  renderAnnouncementsAdmin();
  view('announcementsView');
  setNav('announcements');
  const crumb=document.getElementById('crumbCurrent');
  if(crumb)crumb.textContent='Comunicados';
}

function announcementMatchesUser(a){
  const s=getSession();
  if(!s||!nucleoAnnouncementInScope(a,s))return false;
  if(a.audience==='all')return true;
  if(a.audience==='operational')return s.role!=='admin';
  if(a.audience==='sector')return s.role!=='admin' && normalizeSectorEmailKey(a.sector)===normalizeSectorEmailKey(s.sector);
  return false;
}

function isAnnouncementCurrentlyActive(a){
  if(!a||a.active===false)return false;
  const today=new Date().toISOString().slice(0,10);
  if(a.start&&today<a.start)return false;
  if(a.end&&today>a.end)return false;
  return true;
}

function nextAnnouncementForCurrentUser(){
  const key=announcementUserKey();
  const acks=getAnnouncementAcks();
  const read=new Set(acks[key]||[]);
  return getAnnouncements()
    .filter(isAnnouncementCurrentlyActive)
    .filter(announcementMatchesUser)
    .find(a=>!read.has(a.id)) || null;
}

async function showPendingAnnouncement(){
  const a=nextAnnouncementForCurrentUser();
  if(!a)return;
  currentAnnouncementId=a.id;

  const title=document.getElementById('announcementModalTitle');
  const msg=document.getElementById('announcementModalMessage');
  const meta=document.getElementById('announcementModalMeta');
  const img=document.getElementById('announcementModalImage');
  const imgWrap=document.getElementById('announcementModalImageWrap');
  const close=document.getElementById('announcementCloseBtn');
  const ack=document.getElementById('announcementAckBtn');
  const dismiss=document.getElementById('announcementDismissBtn');

  if(title)title.textContent=a.title||'Comunicado';
  if(msg)msg.textContent=a.message||'';
  if(meta)meta.textContent=(a.priority==='urgent'?'URGENTE · ':'')+'Publicado por '+(a.createdBy||'SGQ')+(a.end?' · disponível até '+formatDateBR(a.end):'');
  const modalCard=document.querySelector('#announcementModalOverlay .announcement-modal');
  if(modalCard)modalCard.classList.toggle('announcement-urgent',a.priority==='urgent');

  let announcementImage=a.hasImage?await loadAnnouncementImage(a.id):'';
  if(!announcementImage && (a.hasImage||a.imageFileId) && portalBackendEnabled()){
    try{
      const imgRes=await portalJsonp({acao:'portal_imagem_comunicado',id:a.id},30000);
      if(imgRes?.sucesso && imgRes.imageData){
        announcementImage=imgRes.imageData;
        saveAnnouncementImage(a.id,announcementImage).catch(()=>{});
      }
    }catch(e){
      console.warn('Portal SGQ: não foi possível carregar a imagem do comunicado.',e);
    }
  }
  if(announcementImage){
    if(img){
      img.src=announcementImage;
      img.alt='Imagem do comunicado '+(a.title||'');
    }
    if(imgWrap)imgWrap.classList.remove('hidden');
  }else{
    if(img)img.removeAttribute('src');
    if(imgWrap)imgWrap.classList.add('hidden');
  }

  const attBtn=document.getElementById('announcementModalAttachmentBtn');
  if(attBtn){
    attBtn.classList.toggle('hidden',!a.hasAttachment);
    attBtn.textContent='📎 '+(a.attachmentName||'Abrir anexo');
    attBtn.onclick=()=>openAnnouncementAttachment(a.id);
  }
  if(close)close.style.display=a.requireAck?'none':'';
  if(ack)ack.textContent=a.requireAck?'Li e estou ciente':'Marcar como lido';
  if(dismiss)dismiss.classList.toggle('hidden',a.requireAck);

  const overlay=document.getElementById('announcementModalOverlay');
  if(!overlay){
    console.error('Portal SGQ: modal de comunicado não encontrado no documento principal.');
    return;
  }
  overlay.classList.remove('hidden');
  overlay.style.display='flex';
  document.body.style.overflow='hidden';
}

function acknowledgeAnnouncement(){
  if(!currentAnnouncementId)return;
  const key=announcementUserKey();
  const acks=getAnnouncementAcks();
  const set=new Set(acks[key]||[]);
  set.add(currentAnnouncementId);
  acks[key]=[...set];
  localStorage.setItem(ANNOUNCEMENT_ACK_KEY,JSON.stringify(acks));
  portalBackendSave('announcement_acks',key+'|'+currentAnnouncementId,{
    userKey:key,announcementId:currentAnnouncementId,acknowledgedAt:new Date().toISOString()
  });

  const overlay=document.getElementById('announcementModalOverlay');
  if(overlay){overlay.classList.add('hidden');overlay.style.display='none'}
  document.body.style.overflow='';
  currentAnnouncementId='';

  setTimeout(showPendingAnnouncement,150);
}

function closeAnnouncementModal(){
  const a=getAnnouncements().find(x=>String(x.id)===String(currentAnnouncementId));
  if(a?.requireAck)return;
  const overlay=document.getElementById('announcementModalOverlay');
  if(overlay){overlay.classList.add('hidden');overlay.style.display='none'}
  document.body.style.overflow='';
  currentAnnouncementId='';
}

async function migrateAnnouncementImagesFromLocalStorage(){
  const list=getAnnouncements();
  let changed=false;
  for(const a of list){
    if(a.imageData){
      try{
        await saveAnnouncementImage(a.id,a.imageData);
        a.hasImage=true;
        delete a.imageData;
        changed=true;
      }catch(e){
        console.warn('Não foi possível migrar uma imagem antiga de comunicado.',e);
      }
    }
  }
  if(changed)saveAnnouncements(list);
}

async function refreshAnnouncementsFromCentral(showModal=true){
  if(!portalBackendEnabled()){
    if(showModal)try{showPendingAnnouncement()}catch(e){}
    return false;
  }
  try{
    const res=await portalJsonp({acao:'portal_announcements'},30000);
    if(!res?.sucesso)throw new Error(res?.erro||'Falha ao consultar comunicados.');

    if(Array.isArray(res.announcements)){
      const list=res.announcements.map(a=>{
        const copy={...a};
        if(copy.imageData){
          copy.hasImage=true;
          saveAnnouncementImage(copy.id,copy.imageData).catch(()=>{});
          delete copy.imageData;
        }
        if(copy.imageFileId)copy.hasImage=true;
        return copy;
      });
      localStorage.setItem(ANNOUNCEMENTS_KEY,JSON.stringify(list));
    }

    if(Array.isArray(res.announcementAcks)){
      const ackMap=getAnnouncementAcks();
      res.announcementAcks.forEach(x=>{
        if(!x?.userKey||!x?.announcementId)return;
        const s=new Set(ackMap[x.userKey]||[]);
        s.add(x.announcementId);
        ackMap[x.userKey]=[...s];
      });
      localStorage.setItem(ANNOUNCEMENT_ACK_KEY,JSON.stringify(ackMap));
    }

    if(showModal){
      const overlay=document.getElementById('announcementModalOverlay');
      if(!currentAnnouncementId && (!overlay || overlay.classList.contains('hidden'))){
        await showPendingAnnouncement();
      }
    }
    return true;
  }catch(e){
    console.warn('Portal SGQ: não foi possível atualizar comunicados agora.',e);
    if(showModal)try{showPendingAnnouncement()}catch(_){}
    return false;
  }
}

function schedulePendingAnnouncementCheck(){
  // Comunicados chegam junto com a próxima sincronização central.
}

function nucleoAnnouncementSelectedUnits(){
 const allowed=nucleoPersonUnits(getSession());
 const value=document.getElementById('announcementUnit')?.value||allowed[0];
 return value==='todas'?allowed:allowed.filter(u=>u===value);
}

function nucleoAnnouncementUnitUi(){
 const select=document.getElementById('announcementUnit');if(!select)return;
 const allowed=nucleoPersonUnits(getSession()),current=select.value;
 select.innerHTML=(allowed.length===2?'<option value="todas">Matriz e filial</option>':'')+allowed.map(u=>'<option value="'+u+'">'+(u==='filial'?'SETA ES — Linhares':'SETA SC — Matriz')+'</option>').join('');
 if([...select.options].some(o=>o.value===current))select.value=current;
 select.disabled=allowed.length===1;
 refreshAnnouncementSectorSelect();
}

function nucleoAnnouncementInScope(a,user){
 const targets=Array.isArray(a.units)&&a.units.length?a.units:[explicitPortalUnit(a.unit)||'matriz'];
 return nucleoPersonUnits(user).some(u=>targets.includes(u));
}

