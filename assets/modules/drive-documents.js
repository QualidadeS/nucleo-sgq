/* Pastas, respostas externas e documentos: dados confirmados na base central. */
const nucleoDriveLabels={ros:'R.O.s',pdcas:'PDCAs',standard:'Documentos padrão',requested:'Documentos solicitados',templates:'Modelos editáveis'};
let nucleoDriveState={unit:'matriz',tab:'pdca',files:[],offset:0,pdcaFiles:[],templates:[],documents:[],selectedPdf:null,parsed:null,links:[],previousId:'',busy:false,pdcaLimit:5,documentLimit:5};
function nucleoDriveUnit(){return getSession()?.role==='quality'?'filial':document.getElementById('qualityConfigUnit')?.value||nucleoDriveState.unit||'matriz';}
function nucleoDriveEscape(v){return escapeHtml(String(v??''));}
function nucleoDriveStatus(text){const el=document.getElementById('ndStatus');if(el)el.textContent=text;}
async function nucleoDriveApi(action,params={},timeout=60000){const r=await portalJsonp({acao:action,unit:nucleoDriveState.unit,...params},timeout);if(!r?.sucesso)throw new Error(r?.erro||'A base central não confirmou a operação.');return r;}
async function nucleoDriveMutation(action,params){
 if(nucleoDriveState.busy)throw new Error('Aguarde a operação atual.');nucleoDriveState.busy=true;
 const id='ND-'+Date.now()+'-'+Math.random().toString(36).slice(2);let timedOut=false;
 try{
  if(!navigator.onLine)throw new Error('Conecte à internet para salvar na base central.');
  if(!portalPostForm({acao:action,unit:nucleoDriveState.unit,eventoId:id,...params}))throw new Error('Não foi possível enviar a operação.');
  const until=Date.now()+150000;
  while(Date.now()<until){await new Promise(r=>setTimeout(r,1800));const result=await portalJsonp({acao:'nucleo_drive_status',eventoId:id},30000);if(result?.pending)continue;if(!result?.sucesso)throw new Error(result?.erro||'Falha na operação.');return result;}
  timedOut=true;throw new Error('A confirmação demorou. Reabra a lista antes de tentar novamente para conferir se foi salvo.');
 }finally{nucleoDriveState.busy=false;}
}
function nucleoDriveInstallSettings(){
 const card=document.getElementById('unitQualitySettings');if(!card||document.getElementById('nucleoDriveFolders'))return;
 const box=document.createElement('section');box.id='nucleoDriveFolders';box.className='unit-settings-section';box.style.margin='16px 0';
 box.innerHTML='<h4>Pastas do Drive desta unidade</h4><p class="small">Cole o link de cada pasta. A validação usa o acesso do Apps Script.</p>'+Object.entries(nucleoDriveLabels).map(([k,label])=>'<label style="display:block;margin:10px 0"><span class="small">'+label+'</span><div style="display:flex;gap:8px"><input id="ndFolder_'+k+'" type="url" placeholder="https://drive.google.com/drive/folders/…"><button class="btn secondary" type="button" onclick="nucleoDriveValidateFolder(\''+k+'\')">Validar acesso</button></div><span id="ndFolderStatus_'+k+'" class="small"></span></label>').join('');
 card.querySelector('.unit-settings-footer')?.before(box);
 const unit=document.getElementById('qualityConfigUnit').value,c=unitConfiguration(unit)||{};
 Object.keys(nucleoDriveLabels).forEach(k=>{document.getElementById('ndFolder_'+k).value=c.driveFolders?.[k]||'';});
}
async function nucleoDriveValidateFolder(kind){const el=document.getElementById('ndFolderStatus_'+kind);el.textContent='Validando…';try{const r=await nucleoDriveApi('nucleo_drive_validate',{unit:nucleoDriveUnit(),kind,link:document.getElementById('ndFolder_'+kind).value});el.textContent='Acesso confirmado: '+r.name;}catch(e){el.textContent=e.message;}}
async function nucleoDriveShow(tab='pdca'){
 if(!isAdmin())return;
 nucleoDriveState.unit=nucleoDriveUnit();nucleoDriveState.tab=tab;
 let host=document.getElementById('nucleoDriveOverlay');if(host)host.remove();host=document.createElement('div');host.id='nucleoDriveOverlay';host.style.cssText='position:fixed;inset:0;background:#16324d88;z-index:99990;display:flex;padding:20px;align-items:center;justify-content:center';
 host.innerHTML='<div style="background:white;border-radius:16px;padding:22px;width:min(1150px,100%);max-height:94vh;overflow:auto"><div style="display:flex;justify-content:space-between;align-items:center;gap:12px"><h2 style="margin:0">Arquivos e documentos</h2><button class="btn secondary" onclick="document.getElementById(\'nucleoDriveOverlay\').remove()">Fechar</button></div><div style="display:flex;gap:10px;flex-wrap:wrap;margin:16px 0"><select id="ndUnit" '+(getSession()?.role==='quality'?'disabled':'')+'><option value="matriz">SETA SC — Matriz</option><option value="filial">SETA ES — Unidade Linhares</option></select><button class="btn secondary" onclick="nucleoDriveSwitchTab(\'pdca\')">Respostas de PDCA</button><button class="btn secondary" onclick="nucleoDriveSwitchTab(\'templates\')">Modelos de documentos</button><button class="btn secondary" onclick="nucleoDriveSwitchTab(\'requests\')">Preencher solicitação</button></div><p id="ndStatus" role="status" class="small">Consultando a base central…</p><div id="ndContent"></div></div>';
 if(tab==='pdca'){
  view('pdcaImportView');setNav('externalPdcas');host.style.cssText='';
  host.firstElementChild.style.cssText='';
  host.querySelector('button').remove();
  const pane=document.getElementById('pdcaImportView');pane.replaceChildren(host);
 }else document.body.appendChild(host);
 document.getElementById('ndUnit').value=nucleoDriveState.unit;document.getElementById('ndUnit').onchange=async()=>{if(nucleoDriveState.busy){document.getElementById('ndUnit').value=nucleoDriveState.unit;return;}nucleoDriveState.unit=document.getElementById('ndUnit').value;nucleoDriveState.selectedPdf=null;nucleoDriveState.previousId='';await nucleoDriveRefresh();};await nucleoDriveRefresh();
}
async function nucleoDriveRefresh(){try{const r=await nucleoDriveApi('nucleo_drive_overview');Object.assign(nucleoDriveState,{pdcaFiles:r.pdcaFiles||[],templates:r.templates||[],documents:r.documents||[]});nucleoDriveSwitchTab(nucleoDriveState.tab);nucleoDriveStatus('Dados da unidade consultados na base central.');}catch(e){nucleoDriveStatus(e.message);}}
function nucleoDriveSwitchTab(tab){const spec=tab==='pdca'?['pdca','import']:tab==='templates'?['processes','templates']:['documents','prepare'];if(!nucleoFeatureRequire(...spec))return;if(nucleoDriveState.busy)return;nucleoDriveState.tab=tab;const host=document.getElementById('ndContent');if(!host)return;if(tab==='pdca')nucleoDrivePdcaPage(nucleoDriveState.pdcaPanel||'import');else if(tab==='templates')nucleoDriveRenderTemplates();else nucleoDriveRenderRequests();}
function nucleoDriveRenderPdca(){
 const h=document.getElementById('ndContent');h.innerHTML='<div class="card" style="padding:18px"><h3>Importar resposta de PDCA</h3><p class="small">O PDF pode responder a várias R.O.s. Confira cada vínculo com o setor antes de salvar. O upload não encerra a ocorrência.</p><input id="ndPdf" type="file" accept="application/pdf"><button class="btn primary" onclick="nucleoDriveReadLocal()">Identificar PDF</button><button class="btn secondary" onclick="nucleoDriveListPdfs(false)">Selecionar na pasta do Drive</button><div id="ndDriveFiles"></div><div id="ndPdcaConfirm"></div></div>';
}
function nucleoDrivePdcaPage(panel){
 nucleoDriveState.pdcaPanel=panel;
 const host=document.getElementById('ndContent');
 host.innerHTML='<div style="display:flex;gap:8px;flex-wrap:wrap;margin:12px 0">'+[['import','Importar PDF'],['history','Histórico de importações'],['missing','R.O.s sem resposta']].map(([key,label])=>'<button class="btn '+(key===panel?'primary':'secondary')+'" onclick="nucleoDrivePdcaPage(\''+key+'\')">'+label+'</button>').join('')+'</div><div id="ndPdcaPanel"></div>';
 const box=document.getElementById('ndPdcaPanel');
 if(panel==='import'){nucleoDriveRenderPdca();const content=host.innerHTML;host.innerHTML='<div style="display:flex;gap:8px;margin:12px 0"><button class="btn primary" onclick="nucleoDrivePdcaPage(\'import\')">Importar PDF</button><button class="btn secondary" onclick="nucleoDrivePdcaPage(\'history\')">Histórico de importações</button><button class="btn secondary" onclick="nucleoDrivePdcaPage(\'missing\')">R.O.s sem resposta</button></div>'+content;return;}
 box.innerHTML='<input id="ndPdcaSearch" placeholder="Buscar R.O., setor ou arquivo" oninput="nucleoDrivePdcaRows()"><p class="small">Dados da unidade selecionada. Para conferir pendências, mantenha as R.O.s sincronizadas.</p><div id="ndPdcaRows"></div>';nucleoDrivePdcaRows();
}
function nucleoDrivePdcaRows(){
 const query=sectorCompareKey(document.getElementById('ndPdcaSearch')?.value||'');let rows=[];
 if(nucleoDriveState.pdcaPanel==='history')rows=nucleoDriveState.pdcaFiles.slice().reverse().map(p=>({text:p.fileName+' · '+p.links.map(l=>l.ro+' / '+l.sector).join(', '),status:p.importComplete===false?'Importação incompleta':'Importado · V'+p.version,fileId:p.fileId}));
 else{
  const responses=getAllSentPdcas().filter(p=>explicitRecordUnit(p)===nucleoDriveState.unit);
  nucleoDriveCandidates().forEach(r=>{const ro=String(r.numero||r.id),base=baseTriageSituation(r),triages=getTriageRecordsForRoNumber(ro);const sectors=nucleoDriveSectors(ro).filter(sector=>triages.some(t=>t.decision==='directed'&&sectorCompareKey(t.responsibleSector||t.sector||t.setor||t.directedSector)===sectorCompareKey(sector))||(base.decision==='directed'&&sectorCompareKey(base.sector)===sectorCompareKey(sector)));sectors.forEach(sector=>{const imported=nucleoDriveState.pdcaFiles.some(p=>p.importComplete!==false&&p.links.some(l=>l.ro===ro&&sectorCompareKey(l.sector)===sectorCompareKey(sector)));const answered=responses.some(p=>p.ro===ro&&sectorCompareKey(p.setor)===sectorCompareKey(sector)&&/respond|apresent/i.test(p.status||''));if(!imported&&!answered)rows.push({text:ro+' · '+(r.cliente||'')+' · '+sector,status:'Sem resposta de PDCA'});});});
 }
 rows=rows.filter(r=>!query||sectorCompareKey(r.text).includes(query));
 const host=document.getElementById('ndPdcaRows');host.innerHTML='<p>'+rows.length+' registro(s)</p>'+rows.slice(0,nucleoDriveState.pdcaListLimit||20).map(r=>'<div class="card" style="padding:12px;margin:8px 0"><b>'+nucleoDriveEscape(r.text)+'</b><p class="small">'+nucleoDriveEscape(r.status)+'</p>'+(r.fileId?'<button class="btn secondary" onclick="nucleoDriveViewFile(\''+nucleoDriveEscape(r.fileId)+'\',\'pdcas\')">Abrir PDF</button>':'')+'</div>').join('')+(rows.length>(nucleoDriveState.pdcaListLimit||20)?'<button class="btn secondary" onclick="nucleoDriveState.pdcaListLimit=(nucleoDriveState.pdcaListLimit||20)+20;nucleoDrivePdcaRows()">Mostrar mais 20</button>':'');
}
function nucleoDriveStartRevision(id){const r=nucleoDriveState.pdcaFiles.find(x=>x.id===id);if(!r)return;nucleoDriveState.previousId=id;nucleoDriveState.links=r.links.map(l=>({...l}));nucleoDriveStatus('Nova revisão de '+r.fileName+'. Selecione o novo PDF; os vínculos serão preservados.');document.getElementById('ndPdf').scrollIntoView({behavior:'smooth'});}
async function nucleoDriveListPdfs(more){try{if(!more){nucleoDriveState.files=[];nucleoDriveState.offset=0;}const r=await nucleoDriveApi('nucleo_drive_list',{kind:'pdcas',offset:nucleoDriveState.offset});nucleoDriveState.files.push(...r.items);nucleoDriveState.offset=r.nextOffset;document.getElementById('ndDriveFiles').innerHTML=nucleoDriveState.files.filter(f=>f.mimeType==='application/pdf'&&!nucleoDriveState.pdcaFiles.some(p=>p.fileId===f.id&&p.importComplete===true)).map(f=>'<div style="margin:8px"><button class="btn secondary" onclick="nucleoDriveSelectExisting(\''+nucleoDriveEscape(f.id)+'\')">'+nucleoDriveEscape(f.name)+'</button></div>').join('')+(r.hasMore?'<button class="btn secondary" onclick="nucleoDriveListPdfs(true)">Carregar mais 30 arquivos</button>':'');}catch(e){nucleoDriveStatus(e.message);}}
function nucleoDriveBase64Bytes(b64){return Uint8Array.from(atob(b64),c=>c.charCodeAt(0));}
async function nucleoDriveSelectExisting(id){const f=nucleoDriveState.files.find(x=>x.id===id);if(!f)return;if(nucleoDriveState.pdcaFiles.some(p=>p.fileId===id&&p.importComplete===true)){nucleoDriveStatus('Este PDF já foi vinculado. Consulte PDCAs recebidos.');return;}nucleoDriveState.selectedPdf={fileId:id,name:f.name};try{nucleoDriveStatus('Lendo o PDF da pasta…');const r=await nucleoDriveApi('nucleo_drive_read',{fileId:id,kind:'pdcas'},90000);await nucleoDriveIdentify(nucleoDriveBase64Bytes(r.base64),f.name);}catch(e){nucleoDriveState.parsed=nucleoDriveParse('',f.name);nucleoDrivePrepareLinks();nucleoDriveRenderConfirmation();nucleoDriveStatus(e.message+' Você pode conferir os vínculos manualmente.');}}
async function nucleoDriveReadLocal(){try{const f=document.getElementById('ndPdf').files[0];if(!f)throw new Error('Selecione um PDF.');if(f.size>8*1024*1024)throw new Error('Use um PDF de até 8 MB.');nucleoDriveState.selectedPdf={file:f,name:f.name};nucleoDriveStatus('Identificando o PDF…');await nucleoDriveIdentify(new Uint8Array(await f.arrayBuffer()),f.name);}catch(e){nucleoDriveStatus(e.message);}}
async function nucleoDriveIdentify(bytes,name){
 let text='';try{const lib=await import(new URL('assets/vendor/pdf.min.mjs',document.baseURI).href);lib.GlobalWorkerOptions.workerSrc=new URL('assets/vendor/pdf.worker.min.mjs',document.baseURI).href;const pdf=await lib.getDocument({data:bytes}).promise;try{for(let i=1;i<=Math.min(pdf.numPages,5);i++){const page=await pdf.getPage(i),content=await page.getTextContent();const rows=new Map();content.items.forEach(item=>{if(!item.str)return;const y=Math.round(item.transform[5]);if(!rows.has(y))rows.set(y,[]);rows.get(y).push(item);});text+=[...rows.entries()].sort((a,b)=>b[0]-a[0]).map(([,items])=>items.sort((a,b)=>a.transform[4]-b.transform[4]).map(x=>x.str).join(' ')).join('\n')+'\n';}}finally{await pdf.destroy();}}catch(e){nucleoDriveStatus('Leitura automática indisponível. Confira os dados manualmente.');}
 nucleoDriveState.parsed=nucleoDriveParse(text,name);nucleoDrivePrepareLinks();nucleoDriveRenderConfirmation();nucleoDriveStatus(text.trim()?'Dados identificados. Confira R.O.s, setor e responsável antes de salvar.':'Sem texto legível. Use os dados do nome e confira os vínculos manualmente.');
}
function nucleoDriveParse(text,name){
 const lines=String(text||'').split('\n'),filename=String(name||'').replace(/\.pdf$/i,'');
 const fileMatch=filename.match(/^(.*?)\bR\.?\s*O\.?[-_ ]+([\d\s,;eE]+)[-_ ]+(intern[oa]|extern[oa])(?:[-_ ]+(.*))?$/i);
 const field=label=>{const line=lines.find(l=>new RegExp(label,'i').test(l))||'';const match=line.match(new RegExp(label+'\\s*:?\\s*(.*?)(?=\\s+(?:Setor|Tipo de|R\\.?O|Cliente|Data|Respons[aá]vel)\\s*:?|$)','i'));const value=match?.[1]?.trim()||'';return /^(?:Setor:?|Tipo de.*|Cliente:?|Respons[aá]vel:?)$/i.test(value)?'':value;};
 let numberText=fileMatch?.[2]||'';
 if(!numberText){const line=lines.find(l=>/\bR\.?\s*O\.?[-_ ]*:?\s*\d/i.test(l))||'';const match=line.match(/\bR\.?\s*O\.?[-_ ]*:?\s*([\d\s,;eE]+)/i);numberText=match?.[1]||'';}
 const numbers=[...new Set((numberText.match(/\d+/g)||[]).map(x=>String(Number(x))))];
 const source=fileMatch?.[3]||text+' '+name;
 const origin=/\bextern[oa]\b|\bRO[-_ ]EX[-_ ]/i.test(source)?'Externa':/\bintern[oa]\b|\bRO[-_ ]IN[-_ ]/i.test(source)?'Interna':'';
 const fileSector=fileMatch?fileMatch[1].replace(/[-_,\s]+$/,''):'';
 return {numbers,origin,sector:fileSector||field('Setor'),responsible:fileMatch?.[4]?.trim()||field('Respons[aá]vel'),client:field('Cliente'),date:field('Data')};
}
function nucleoDriveCandidates(){return getAllRoRecords().filter(r=>explicitRecordUnit(r)===nucleoDriveState.unit);}
function nucleoDriveRoIdentity(r){
 const key=String(r.numero||r.id||r.codigo||'');
 const marked=key.match(/^RO-(IN|EX)-/i);
 const source=String(r.origemBase||r.raw?.__origemBase||r.__origemBase||'').trim().toLowerCase();
 const origin=marked?(marked[1].toUpperCase()==='EX'?'Externa':'Interna'):/^extern[oa]$/.test(source)?'Externa':/^intern[oa]$/.test(source)?'Interna':r.ehSac===true?'Externa':'';
 const digits=(key.match(/\d+$/)||[])[0];
 return {key,origin,number:digits?Number(digits):null};
}
function nucleoDrivePrepareLinks(){
 if(nucleoDriveState.previousId)return;
 const p=nucleoDriveState.parsed,candidates=nucleoDriveCandidates();nucleoDriveState.links=[];
 p.numbers.forEach(n=>{
  const matches=new Map();
  candidates.forEach(r=>{const id=nucleoDriveRoIdentity(r);if(id.number===Number(n)&&(!p.origin||id.origin===p.origin))matches.set(id.key,r);});
  const match=matches.size===1?[...matches.values()][0]:null;
  nucleoDriveState.links.push({ro:match?(match.numero||match.id||match.codigo):'',sector:p.sector,identifiedNumber:n,identifiedOrigin:p.origin,matchWarning:match?'':matches.size>1?'Mais de uma R.O. encontrada. Selecione o vínculo correto.':'R.O. não encontrada nos dados carregados desta unidade. Confira a unidade e a sincronização antes de selecionar.'});
 });
}
function nucleoDriveSectors(ro){
 const sectors=getTriageRecordsForRoNumber(ro).map(t=>t.responsibleSector||t.sector||t.setor||t.directedSector||'');
 nucleoDriveCandidates().filter(r=>String(r.numero||r.id)===ro).forEach(r=>{const tri=getRoTriageRecord(r),base=baseTriageSituation(r);if(tri?.decision==='directed')sectors.push(tri.responsibleSector||tri.sector||tri.setor||tri.directedSector);if(base.decision==='directed')sectors.push(base.sector);});
 return [...new Set(sectors.filter(Boolean).flatMap(x=>typeof parseResponsibleSectors==='function'?parseResponsibleSectors(x):[x]))];
}
function nucleoDriveRenderConfirmation(){const p=nucleoDriveState.parsed||{};document.getElementById('ndPdcaConfirm').innerHTML='<h4>'+nucleoDriveEscape(nucleoDriveState.selectedPdf.name)+'</h4><p class="small">Números encontrados: '+nucleoDriveEscape((p.numbers||[]).join(', ')||'nenhum')+'. Confirme todos os vínculos abaixo.</p><div class="grid"><label>Responsável<input id="ndResponsible" value="'+nucleoDriveEscape(p.responsible||'')+'"></label><label>Cliente<input id="ndClient" value="'+nucleoDriveEscape(p.client||'')+'"></label><label>Data do documento<input id="ndDate" value="'+nucleoDriveEscape(p.date||'')+'"></label></div><div id="ndLinks"></div><button class="btn secondary" onclick="nucleoDriveAddLink()">Adicionar R.O. / setor</button> <button class="btn primary" id="ndSavePdca" onclick="nucleoDriveSavePdca()">Confirmar e armazenar resposta</button>';nucleoDriveRenderLinks();}
function nucleoDriveAddLink(){nucleoDriveState.links.push({ro:'',sector:nucleoDriveState.parsed?.sector||''});nucleoDriveRenderLinks();}
function nucleoDriveRenderLinks(){const candidates=nucleoDriveCandidates();document.getElementById('ndLinks').innerHTML=nucleoDriveState.links.map((l,i)=>{const directed=nucleoDriveSectors(l.ro);const sectors=[...new Set(directed.concat(getConfiguredSectors(nucleoDriveState.unit)))];const identified=l.sector||nucleoDriveState.parsed?.sector||'';const actual=directed.find(x=>sectorCompareKey(x)===sectorCompareKey(identified));const chosen=l.sectorConfirmed?sectors.find(x=>sectorCompareKey(x)===sectorCompareKey(l.sector)):actual;l.sector=chosen||(!identified&&directed.length===1?directed[0]:'');return '<div style="display:flex;gap:8px;flex-wrap:wrap;margin:10px 0">'+(l.matchWarning&&!l.ro?'<p class="small" style="width:100%;color:#9b3b12">'+nucleoDriveEscape('R.O. '+l.identifiedNumber+' '+l.identifiedOrigin+' — '+l.matchWarning)+'</p>':'')+(!l.sector?'<p class="small" style="width:100%">Setor direcionado não identificado. Selecione o setor.</p>':'')+'<select onchange="nucleoDriveState.links['+i+'].ro=this.value;nucleoDriveState.links['+i+'].sector=\'\';nucleoDriveState.links['+i+'].sectorConfirmed=false;nucleoDriveRenderLinks()"><option value="">Selecione a R.O.</option>'+candidates.map(r=>{const key=r.numero||r.id;return '<option value="'+nucleoDriveEscape(key)+'" '+(key===l.ro?'selected':'')+'>'+nucleoDriveEscape(key+' · '+(r.cliente||''))+'</option>';}).join('')+'</select><select onchange="nucleoDriveState.links['+i+'].sector=this.value;nucleoDriveState.links['+i+'].sectorConfirmed=true;nucleoDriveRenderLinks()"><option value="">Setor direcionado</option>'+sectors.map(sector=>'<option '+(sectorCompareKey(sector)===sectorCompareKey(l.sector)?'selected':'')+' value="'+nucleoDriveEscape(sector)+'">'+nucleoDriveEscape(sector)+'</option>').join('')+'</select><button class="btn secondary" onclick="nucleoDriveState.links.splice('+i+',1);nucleoDriveRenderLinks()">Remover</button></div>';}).join('');nucleoDriveUpdateClient();}
function nucleoDriveUpdateClient(){
 const input=document.getElementById('ndClient');if(!input)return;
 const candidates=nucleoDriveCandidates(),clients=[...new Set(nucleoDriveState.links.map(l=>candidates.find(r=>String(r.numero||r.id)===l.ro)?.cliente).filter(Boolean))];
 input.value=clients.length?clients.join(' / '):(nucleoDriveState.parsed?.client||'');
}
async function nucleoDriveSavePdca(){if(!nucleoFeatureRequire('pdca','import'))return;
 const btn=document.getElementById('ndSavePdca');if(!btn||nucleoDriveState.busy)return;btn.disabled=true;
 let status=document.getElementById('ndImportResult');if(!status){status=document.createElement('p');status.id='ndImportResult';status.setAttribute('role','status');btn.after(status);}status.textContent='Conferindo vínculos…';status.scrollIntoView({behavior:'smooth',block:'center'});
 let stored=false;
 try{
  if(!nucleoDriveState.links.length||nucleoDriveState.links.some(l=>!l.ro||!l.sector))throw new Error('Selecione a R.O. e o setor de cada vínculo.');
  if(!confirm('Confirma estes vínculos?\n'+nucleoDriveState.links.map(l=>l.ro+' — '+l.sector).join('\n'))){status.textContent='Confirmação cancelada. Nenhuma resposta foi armazenada.';return;}
  const selected=nucleoDriveState.selectedPdf,metadata={links:nucleoDriveState.links.map(l=>({...l,sectorConfirmed:true})),responsible:document.getElementById('ndResponsible').value,client:document.getElementById('ndClient').value,date:document.getElementById('ndDate').value},savedRos=metadata.links.map(l=>l.ro);
  status.textContent='Armazenando na base central. Aguarde a confirmação…';
  const params={metadata:JSON.stringify(metadata),previousId:nucleoDriveState.previousId||''};let result;
  if(selected.fileId){params.fileId=selected.fileId;nucleoDriveState.busy=true;try{result=await nucleoDriveApi('nucleo_drive_pdca',{...params,eventoId:'ND-'+Date.now()+'-'+Math.random().toString(36).slice(2)},120000);}finally{nucleoDriveState.busy=false;}}
  else{params.fileData=await fileToBase64(selected.file);params.fileName=selected.name;result=await nucleoDriveMutation('nucleo_drive_pdca',params);}
  if(!result?.record||result.record.importComplete!==true||!Array.isArray(result.sentRecords)||!result.sentRecords.length)throw new Error('A base não confirmou a inclusão em PDCAs recebidos. Confira se a versão atual do Apps Script foi publicada antes de tentar novamente.');
  stored=true;
  const existing=getSentPdcas(),byId=new Map(existing.map(x=>[x.id,x]));result.sentRecords.forEach(x=>byId.set(x.id,x));localStorage.setItem(SENT_PDCA_KEY,JSON.stringify([...byId.values()]));
  const files=nucleoDriveState.pdcaFiles.filter(x=>x.id!==result.record.id);files.push(result.record);nucleoDriveState.pdcaFiles=files;nucleoDriveState.previousId='';nucleoDriveState.selectedPdf=null;nucleoDriveState.links=[];nucleoDriveState.parsed=null;
  nucleoDriveRenderPdca();nucleoDriveSavedNotice(savedRos,result.record.fileName,result.record.id);nucleoDriveStatus(result.alreadyLinked?'Este PDF já estava vinculado. Registro localizado em PDCAs recebidos.':'PDCA confirmado em PDCAs recebidos.');
 }catch(e){status.textContent='Não foi possível concluir: '+e.message;status.style.color='#b42318';status.scrollIntoView({behavior:'smooth',block:'center'});nucleoDriveStatus(e.message);}
 finally{if(!stored)btn.disabled=false;}
}

async function nucleoDriveViewFile(id,kind){try{nucleoDriveStatus('Carregando arquivo…');const r=await nucleoDriveApi('nucleo_drive_file',{fileId:id},90000);const url=URL.createObjectURL(new Blob([nucleoDriveBase64Bytes(r.base64)],{type:r.mimeType}));let pane=document.getElementById('ndPdfViewer');if(pane)pane.remove();pane=document.createElement('div');pane.id='ndPdfViewer';pane.innerHTML='<div style="margin:12px 0"><a class="btn secondary" download="'+nucleoDriveEscape(r.fileName)+'" href="'+url+'">Baixar PDF</a><button class="btn secondary" id="ndCloseViewer">Fechar visualização</button><iframe title="PDF" src="'+url+'" style="width:100%;height:65vh;border:1px solid #ddd"></iframe></div>';document.getElementById('ndContent').prepend(pane);document.getElementById('ndCloseViewer').onclick=()=>{URL.revokeObjectURL(url);pane.remove();};nucleoDriveStatus('Arquivo carregado.');}catch(e){nucleoDriveStatus(e.message);}}
function nucleoDriveLatestTemplates(){const all=nucleoDriveState.templates;return all.filter(t=>!all.some(x=>x.previousId===t.id));}
function nucleoDriveRenderTemplates(){document.getElementById('ndContent').innerHTML='<h3>Modelos de documentos solicitados</h3><p class="small">Cada alteração cria uma revisão. Arquivos já emitidos permanecem preservados.</p><button class="btn primary" onclick="nucleoDriveNewLaudo()">Adicionar modelo do laudo enviado</button> <button class="btn secondary" onclick="nucleoDriveEditTemplate(\'\')">Novo modelo</button><div>'+nucleoDriveLatestTemplates().map(t=>'<div class="card" style="padding:14px;margin:10px 0"><b>'+nucleoDriveEscape(t.model.name)+'</b><p class="small">Revisão '+t.revision+' · '+t.model.fields.length+' campos</p><button class="btn secondary" onclick="nucleoDriveEditTemplate(\''+nucleoDriveEscape(t.id)+'\')">Editar campos, fórmulas e estrutura</button></div>').join('')+'</div><div id="ndTemplateEditor"></div>';}
let nucleoDriveEditing=null;
async function nucleoDriveNewLaudo(){try{const r=await fetch(new URL('assets/modules/laudo-modelo.json',document.baseURI));if(!r.ok)throw new Error('Modelo não encontrado.');nucleoDriveEditing={previousId:'',model:await r.json()};const sourceResponse=await fetch(new URL('assets/modules/Laudos_Modelo.xltm',document.baseURI));if(sourceResponse.ok)nucleoDriveEditing.sourceFile=new File([await sourceResponse.blob()],'Laudos Modelo.xltm',{type:'application/vnd.ms-excel.template.macroEnabled.12'});nucleoDriveTemplateEditor();}catch(e){nucleoDriveStatus(e.message);}}
function nucleoDriveEditTemplate(id){const previous=nucleoDriveState.templates.find(t=>t.id===id);nucleoDriveEditing={previousId:id,model:previous?JSON.parse(JSON.stringify(previous.model)):{name:'Novo documento',code:'',fields:[{id:'client',label:'Cliente',type:'text',source:'client'}],layout:'<h1>Documento</h1><p>Cliente: {{client}}</p>'}};nucleoDriveTemplateEditor();}
function nucleoDriveTemplateEditor(){const m=nucleoDriveEditing.model;document.getElementById('ndTemplateEditor').innerHTML='<div class="card" style="padding:18px;margin-top:18px"><h3>Editar modelo</h3><label>Nome<input id="ndTemplateName" value="'+nucleoDriveEscape(m.name)+'"></label><label>Código<input id="ndTemplateCode" value="'+nucleoDriveEscape(m.code||'')+'"></label><h4>Campos e fórmulas</h4><p class="small">Use identificadores nos cálculos. Funções: MIN, MAX, AVERAGE e SUM. Exemplo: MAX(B16,B17,B18,B19,B20). Os cálculos seguem a ordem dos campos.</p><div id="ndTemplateFields" style="overflow:auto"></div><button class="btn secondary" onclick="nucleoDriveAddField()">Adicionar campo</button><label>Arquivo original de referência (opcional)<input id="ndTemplateSource" type="file" accept=".doc,.docx,.xls,.xlsx,.xltm,.xlsm,.pdf"></label><h4>Estrutura do documento</h4><p class="small">Edite títulos, tabelas e estilos HTML. Insira valores com {{identificador}}. A prévia mostra a estrutura antes de salvar.</p><textarea id="ndTemplateLayout" rows="14" style="font-family:monospace">'+nucleoDriveEscape(m.layout)+'</textarea><div style="margin:12px 0"><button class="btn secondary" onclick="nucleoDriveTemplatePreview()">Visualizar estrutura</button> <button class="btn primary" id="ndSaveTemplate" onclick="nucleoDriveSaveTemplate()">Salvar nova revisão</button></div><iframe id="ndTemplatePreview" sandbox="" style="width:100%;height:400px;background:white;border:1px solid #ddd" title="Prévia do modelo"></iframe></div>';nucleoDriveRenderFields();nucleoDriveTemplatePreview();}
function nucleoDriveRenderFields(){const m=nucleoDriveEditing.model;document.getElementById('ndTemplateFields').innerHTML='<table style="width:100%"><thead><tr><th>Identificador</th><th>Nome</th><th>Tipo</th><th>Dado da solicitação</th><th>Fórmula</th><th>Obrigatório</th><th></th></tr></thead><tbody>'+m.fields.map((f,i)=>'<tr><td><input value="'+nucleoDriveEscape(f.id)+'" onchange="nucleoDriveEditing.model.fields['+i+'].id=this.value"></td><td><input value="'+nucleoDriveEscape(f.label)+'" onchange="nucleoDriveEditing.model.fields['+i+'].label=this.value"></td><td><select onchange="nucleoDriveEditing.model.fields['+i+'].type=this.value">'+['text','number','date','textarea','select'].map(t=>'<option '+(t===f.type?'selected':'')+'>'+t+'</option>').join('')+'</select></td><td><input value="'+nucleoDriveEscape(f.source||'')+'" onchange="nucleoDriveEditing.model.fields['+i+'].source=this.value" placeholder="client, product, order…"></td><td><input value="'+nucleoDriveEscape(f.formula||'')+'" onchange="nucleoDriveEditing.model.fields['+i+'].formula=this.value"></td><td><input type="checkbox" '+(f.required?'checked':'')+' onchange="nucleoDriveEditing.model.fields['+i+'].required=this.checked"></td><td><button class="btn secondary" onclick="nucleoDriveEditField('+i+')">Opções</button><button class="btn secondary" onclick="nucleoDriveEditing.model.fields.splice('+i+',1);nucleoDriveRenderFields()">Remover</button></td></tr>').join('')+'</tbody></table>';}
function nucleoDriveAddField(){nucleoDriveEditing.model.fields.push({id:'campo'+(nucleoDriveEditing.model.fields.length+1),label:'Novo campo',type:'text'});nucleoDriveRenderFields();}
function nucleoDriveTemplateCollect(){const m=nucleoDriveEditing.model;m.name=document.getElementById('ndTemplateName').value;m.code=document.getElementById('ndTemplateCode').value;m.layout=document.getElementById('ndTemplateLayout').value;return m;}
function nucleoDriveTemplatePreview(){const m=nucleoDriveTemplateCollect();document.getElementById('ndTemplatePreview').srcdoc=m.layout.replace(/\{\{(\w+)\}\}/g,(_,key)=>nucleoDriveEscape(m.fields.find(f=>f.id===key)?.label||key));}
async function nucleoDriveSaveTemplate(){if(!nucleoFeatureRequire('processes','templates'))return;const btn=document.getElementById('ndSaveTemplate');btn.disabled=true;try{nucleoDriveStatus('Salvando nova revisão do modelo…');const params={model:JSON.stringify(nucleoDriveTemplateCollect()),previousId:nucleoDriveEditing.previousId||''};const source=document.getElementById('ndTemplateSource')?.files[0]||nucleoDriveEditing.sourceFile;if(source){if(source.size>8*1024*1024)throw new Error('Arquivo original maior que 8 MB.');params.sourceData=await fileToBase64(source);params.sourceName=source.name;params.sourceMime=source.type||'application/octet-stream';}await nucleoDriveMutation('nucleo_drive_template',params);await nucleoDriveRefresh();nucleoDriveStatus('Modelo e revisão salvos na base central e na pasta de modelos.');}catch(e){nucleoDriveStatus(e.message);}finally{btn.disabled=false;}}
function nucleoDriveRequests(){return getAdminModuleRecords().filter(r=>r.module==='documents'&&explicitRecordUnit(r)===nucleoDriveState.unit&&nucleoManagerScopeAllows(r));}
function nucleoDriveRenderRequests(){document.getElementById('ndContent').innerHTML='<h3>Preencher documento solicitado</h3><label>Solicitação<select id="ndRequest"><option value="">Selecione</option>'+nucleoDriveRequests().map(r=>'<option value="'+nucleoDriveEscape(r.id)+'">'+nucleoDriveEscape((r.title||r.documentType||r.id)+' · '+(r.client||r.cliente||''))+'</option>').join('')+'</select></label><label>Modelo<select id="ndRequestTemplate"><option value="">Selecione</option>'+nucleoDriveLatestTemplates().map(t=>'<option value="'+nucleoDriveEscape(t.id)+'">'+nucleoDriveEscape(t.model.name)+' · revisão '+t.revision+'</option>').join('')+'</select></label><button class="btn primary" onclick="nucleoDriveFillRequest()">Abrir preenchimento</button><div id="ndRequestForm"></div><div class="card" style="padding:16px;margin:12px 0"><h4>Adicionar documento já preenchido</h4><p class="small">Selecione a solicitação acima e envie seu PDF final.</p><input id="ndRequestedUpload" onchange="document.getElementById(\'ndRequestedDriveId\').value=\'\';document.getElementById(\'ndRequestedDriveName\').textContent=\'\'" type="file" accept="application/pdf"><button class="btn secondary" onclick="nucleoDriveUploadRequested()">Armazenar PDF da solicitação</button><button class="btn secondary" onclick="nucleoDriveChooseDocument(\'requested\')">Selecionar na pasta do Drive</button><input id="ndRequestedDriveId" type="hidden"><p id="ndRequestedDriveName" class="small"></p><div id="ndRequestedDriveList"></div></div><h3>Documentos gerados</h3>'+nucleoDriveState.documents.slice().reverse().slice(0,nucleoDriveState.documentLimit).map(d=>'<div class="card" style="padding:12px;margin:8px 0"><b>'+nucleoDriveEscape(d.fileName)+'</b><p class="small">'+nucleoDriveEscape(d.requestId)+' · revisão do modelo '+(d.templateRevision||'arquivo enviado')+(d.sentAt?' · enviado para '+nucleoDriveEscape(d.sentTo):' · aguardando envio')+'</p><button class="btn secondary" onclick="nucleoDriveViewFile(\''+nucleoDriveEscape(d.fileId)+'\',\'requested\')">Conferir PDF</button> <button class="btn primary" onclick="nucleoDriveSendDocument(\''+nucleoDriveEscape(d.id)+'\')">Enviar ao solicitante</button></div>').join('');}
function nucleoDriveFillRequest(){const request=nucleoDriveRequests().find(r=>r.id===document.getElementById('ndRequest').value),template=nucleoDriveState.templates.find(t=>t.id===document.getElementById('ndRequestTemplate').value);if(!request||!template){nucleoDriveStatus('Selecione a solicitação e o modelo.');return;}document.getElementById('ndRequestForm').innerHTML='<div class="card" style="padding:18px;margin:14px 0"><h4>'+nucleoDriveEscape(template.model.name)+'</h4><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px">'+template.model.fields.map(f=>{const value=f.source?request[f.source]||'':f.default||'';return '<label>'+nucleoDriveEscape(f.label)+(f.required?' *':'')+(f.formula?'<p class="small">Calculado: '+nucleoDriveEscape(f.formula)+'</p>':f.type==='textarea'?'<textarea data-nd-field="'+f.id+'">'+nucleoDriveEscape(value)+'</textarea>':f.type==='select'?'<select data-nd-field="'+f.id+'">'+(f.options||[]).map(o=>'<option '+(o===value?'selected':'')+'>'+nucleoDriveEscape(o)+'</option>').join('')+'</select>':'<input data-nd-field="'+f.id+'" type="'+nucleoDriveEscape(f.type||'text')+'" '+(f.type==='number'?'step="any"':'')+' value="'+nucleoDriveEscape(value)+'">')+'</label>';}).join('')+'</div><button class="btn primary" id="ndGenerate" style="margin-top:16px" onclick="nucleoDriveGenerateDocument()">Gerar PDF e armazenar</button></div>';}
async function nucleoDriveGenerateDocument(){if(!nucleoFeatureRequire('documents','prepare'))return;const btn=document.getElementById('ndGenerate');btn.disabled=true;try{const values={};document.querySelectorAll('[data-nd-field]').forEach(el=>values[el.dataset.ndField]=el.value);nucleoDriveStatus('Gerando PDF na pasta de documentos solicitados…');await nucleoDriveMutation('nucleo_drive_generate',{requestId:document.getElementById('ndRequest').value,templateId:document.getElementById('ndRequestTemplate').value,values:JSON.stringify(values)});await syncPortalBackend(false);await nucleoDriveRefresh();nucleoDriveStatus('Documento armazenado. Confira o PDF antes de enviar.');}catch(e){nucleoDriveStatus(e.message);}finally{btn.disabled=false;}}
async function nucleoDriveSendDocument(id){if(!nucleoFeatureRequire('documents','deliver'))return;const d=nucleoDriveState.documents.find(x=>x.id===id),r=nucleoDriveRequests().find(x=>x.id===d?.requestId);const email=r?.recipientEmail||r?.requesterEmail||r?.createdByEmail;if(!email){nucleoDriveStatus('A solicitação precisa ter o e-mail confirmado do solicitante.');return;}if(!confirm('Enviar '+d.fileName+' para '+email+'?'))return;try{nucleoDriveStatus('Enviando documento…');await nucleoDriveMutation('nucleo_drive_send',{id});await syncPortalBackend(false);await nucleoDriveRefresh();nucleoDriveStatus('Envio confirmado e registrado no histórico.');}catch(e){nucleoDriveStatus(e.message);}}

function nucleoDriveSuggestedClaimant(ro,users){
 const exact=resolveRoClaimant(ro);if(exact?.personId&&users.some(u=>u.personId===exact.personId))return {user:exact,shortName:false};
 const key=personNameKey(roRegistrantName(ro)),parts=key.split(' ').filter(Boolean);if(!parts.length||parts[0].length<3)return {user:null,shortName:false};
 const unit=explicitRecordUnit(ro);
 const candidates=users.filter(u=>{
  const global=/^(todas|todos|geral)$/i.test(String(u.unit||'').trim());
  const allowed=global||explicitRecordUnit({unit:u.unit})===unit||(u.sectorMemberships||[]).some(m=>m.unit===unit);
  if(!unit||!allowed)return false;
  return [u.name,...(u.aliases||[])].some(name=>{const other=personNameKey(name).split(' ').filter(Boolean);return other[0]===parts[0]&&(other.length===1||parts.length===1);});
 });
 const unique=[...new Map(candidates.map(u=>[u.personId,u])).values()];
 return {user:unique.length===1?unique[0]:null,shortName:unique.length===1};
}
async function nucleoDriveSendPdca(id,selectedRo){if(!nucleoFeatureRequire('pdca','dispatch'))return;
 const record=nucleoDriveState.pdcaFiles.find(x=>x.id===id);if(!record)return;
 const ros=[...new Set(record.links.map(l=>l.ro))];
 const roKey=selectedRo|| (ros.length===1?ros[0]:prompt('Qual R.O. deseja disponibilizar? '+ros.join(', '),ros[0]));
 if(!ros.includes(roKey))return;
 const ro=getAllRoRecords().find(r=>String(r.numero||r.id)===roKey);if(!ro){nucleoDriveStatus('Sincronize a R.O. antes de confirmar o reclamante.');return;}
 claimantIdentityCache=null;
 const users=claimantIdentityIndex().users,suggestion=nucleoDriveSuggestedClaimant(ro,users),suggested=suggestion.user,registrant=roRegistrantName(ro);
 const area=document.createElement('div');area.id='ndDispatchConfirm';document.getElementById('ndDispatchConfirm')?.remove();
 area.className='card';area.style.padding='18px';
 area.innerHTML='<h3>Confirmar reclamante — '+nucleoDriveEscape(roKey)+'</h3><p>Nome na R.O.: <b>'+nucleoDriveEscape(registrant)+'</b></p><p>Cliente: '+nucleoDriveEscape(ro.cliente)+' · Unidade: '+nucleoDriveEscape(ro.unidade)+'</p><p>Setor que respondeu: '+nucleoDriveEscape(record.links.filter(l=>l.ro===roKey).map(l=>l.sector).join(', '))+'</p><button class="btn secondary" id="ndCheckRo">Ver R.O.</button><label style="display:block;margin:12px 0">Cadastro do reclamante<select id="ndClaimant"><option value="">Selecione a pessoa</option>'+users.map(u=>'<option value="'+nucleoDriveEscape(u.personId||u.email||u.name)+'" '+(u===suggested?'selected':'')+'>'+nucleoDriveEscape(personDisplayName(u)+' · '+(u.sector||'')+' · '+(u.unit||''))+'</option>').join('')+'</select></label>'+(suggestion.shortName?'<p class="small" style="color:#805d14">Cadastro sugerido pelo primeiro nome. Confira o nome completo na R.O. antes de confirmar.</p>':'')+'<p class="small">Confirmação obrigatória durante a validação inicial, inclusive após as primeiras 20 identificações. Nenhum e-mail será enviado.</p><p>Este PDF contém: '+nucleoDriveEscape(ros.join(', '))+'. O reclamante terá acesso ao arquivo completo.</p><label style="display:flex;align-items:flex-start;gap:10px;margin:16px 0;cursor:pointer"><input type="checkbox" id="ndClaimantChecked" style="width:22px;height:22px;min-width:22px;flex:0 0 22px;margin:0;accent-color:#1766a5"><span style="line-height:22px">Conferi a R.O. e confirmo que esse cadastro é o reclamante correto.</span></label><p><button class="btn primary" id="ndDispatchNow">Confirmar e disponibilizar</button> <button class="btn secondary" id="ndDispatchCancel">Cancelar</button></p><p id="ndDispatchStatus" role="status"></p>';
 document.getElementById('ndContent').prepend(area);area.scrollIntoView({behavior:'smooth'});
 document.getElementById('ndCheckRo').onclick=()=>openRoReport(roKey);
 document.getElementById('ndDispatchCancel').onclick=()=>area.remove();
 document.getElementById('ndDispatchNow').onclick=async()=>{
  const btn=area.querySelector('#ndDispatchNow'),status=area.querySelector('#ndDispatchStatus'),cancel=area.querySelector('#ndDispatchCancel'),select=area.querySelector('#ndClaimant'),checked=area.querySelector('#ndClaimantChecked');
  const show=(message,kind)=>{status.textContent=message;status.style.cssText='padding:12px;border-radius:8px;font-weight:600;background:'+(kind==='success'?'#eaf7ee':kind==='error'?'#fff0f0':'#edf4fc')+';color:'+(kind==='success'?'#23633b':kind==='error'?'#a12f2f':'#234c73');status.scrollIntoView({behavior:'smooth',block:'nearest'});};
  if(!checked.checked||!select.value){show('Selecione o cadastro e marque a confirmação.','error');return;}
  btn.disabled=true;cancel.disabled=true;select.disabled=true;checked.disabled=true;btn.textContent='Confirmando…';show('Confirmando a disponibilização na base central. Aguarde…','pending');let saved=false;
  try{
   const result=await nucleoDriveMutation('nucleo_drive_dispatch_pdca',{id,ro:roKey,personId:select.value,registrant,confirmed:'1'});
   if(!result?.record||result.record.ro!==roKey||!result.record.recipientPersonId||result.selectedRecipientKey!==select.value)throw new Error('A base central não confirmou o destinatário desta resposta. Confira antes de tentar novamente.');
   let deliveries=[];try{deliveries=JSON.parse(localStorage.getItem('nucleo-pdca-dispatches-v1')||'[]');}catch(_){}deliveries=deliveries.filter(d=>d.id!==result.record.id);deliveries.push(result.record);localStorage.setItem('nucleo-pdca-dispatches-v1',JSON.stringify(deliveries));
   saved=true;renderSentPdcas();show((result.alreadyDispatched?'Esta resposta já estava disponibilizada':'Resposta disponibilizada com sucesso')+' para '+(result.record.recipientName||select.options[select.selectedIndex].text)+'. O reclamante pode abrir o PDF em Respostas. Nenhum e-mail foi enviado.','success');
   btn.textContent='Disponibilização confirmada';cancel.textContent='Concluir';
   Promise.resolve().then(()=>syncPortalBackend(false)).catch(e=>console.warn('A resposta foi disponibilizada; atualização da tela pendente.',e));
  }catch(e){show('Não foi possível confirmar a disponibilização: '+e.message,'error');}
  finally{cancel.disabled=false;if(!saved){btn.disabled=false;select.disabled=false;checked.disabled=false;btn.textContent='Tentar novamente';}}
 };

}


function nucleoDriveEditField(i){const current=nucleoDriveEditing.model.fields[i],text=prompt('Edite o campo: opções, valor inicial, fórmula, origem e tipo.',JSON.stringify(current,null,2));if(text===null)return;try{const field=JSON.parse(text);if(!field.id||!field.label)throw new Error('Informe identificador e nome.');nucleoDriveEditing.model.fields[i]=field;nucleoDriveRenderFields();}catch(e){nucleoDriveStatus(e.message);}}
async function nucleoDriveUploadRequested(){if(!nucleoFeatureRequire('documents','prepare'))return;try{const requestId=document.getElementById('ndRequest').value,file=document.getElementById('ndRequestedUpload').files[0],fileId=document.getElementById('ndRequestedDriveId')?.value;if(!requestId||(!file&&!fileId))throw new Error('Selecione a solicitação e o PDF final.');if(file&&!fileId&&file.size>8*1024*1024)throw new Error('Use um PDF de até 8 MB.');nucleoDriveStatus('Armazenando documento solicitado…');const params=fileId?{requestId,fileId}:{requestId,fileData:await fileToBase64(file),fileName:file.name};const result=await nucleoDriveMutation('nucleo_drive_upload_requested',params);if(!result?.record?.fileId)throw new Error('A base central não confirmou o documento.');await syncPortalBackend(false);await nucleoDriveRefresh();nucleoDriveStatus('Documento confirmado. Confira o PDF antes do envio.');}catch(e){nucleoDriveStatus(e.message);}}


const ndOriginalRenderPdca=nucleoDriveRenderPdca;
nucleoDriveRenderPdca=function(){ndOriginalRenderPdca();};
const ndOriginalRenderRequests=nucleoDriveRenderRequests;
nucleoDriveRenderRequests=function(){ndOriginalRenderRequests();if(nucleoDriveState.documents.length>nucleoDriveState.documentLimit){const btn=document.createElement('button');btn.className='btn secondary';btn.textContent='Mostrar mais 5 documentos';btn.onclick=()=>{nucleoDriveState.documentLimit+=5;nucleoDriveRenderRequests();};document.getElementById('ndContent').appendChild(btn);}};

function nucleoDriveLegacyHtml(){if(getSession()?.role!=='admin')return '';const requests=getAdminModuleRecords().filter(r=>r.module==='documents'&&!explicitRecordUnit(r)),docs=getStandardDocuments().filter(r=>!explicitRecordUnit(r));if(!requests.length&&!docs.length)return '';return '<div class="card" style="padding:14px;margin:12px 0"><h4>Cadastros antigos sem unidade</h4><p class="small">Associe cada cadastro à fábrica correta para usar o fluxo de documentos.</p>'+requests.slice(0,5).map(r=>'<p>'+nucleoDriveEscape(r.title||r.id)+' <button class="btn secondary" onclick="nucleoDriveAssignLegacy(\'admin_modules\',\''+nucleoDriveEscape(r.id)+'\')">Associar à unidade selecionada</button></p>').join('')+docs.slice(0,5).map(r=>'<p>'+nucleoDriveEscape(r.name||r.fileName||r.id)+' <button class="btn secondary" onclick="nucleoDriveAssignLegacy(\'standard_documents\',\''+nucleoDriveEscape(r.id)+'\')">Associar à unidade selecionada</button></p>').join('')+'</div>'; }
async function nucleoDriveAssignLegacy(collection,id){if(getSession()?.role!=='admin')return;const record=(collection==='admin_modules'?getAdminModuleRecords():getStandardDocuments()).find(r=>r.id===id);if(!record||explicitRecordUnit(record))return;if(!confirm('Associar este cadastro à '+(nucleoDriveState.unit==='filial'?'Unidade Linhares':'Matriz')+'?'))return;try{await portalBackendSaveConfirmed(collection,id,{...record,unit:nucleoDriveState.unit,updatedAt:new Date().toISOString()});await syncPortalBackend(false);nucleoDriveRenderRequests();nucleoDriveStatus('Unidade confirmada na base central.');}catch(e){nucleoDriveStatus(e.message);}}
const ndRequestsWithLegacy=nucleoDriveRenderRequests;
nucleoDriveRenderRequests=function(){ndRequestsWithLegacy();document.getElementById('ndContent').insertAdjacentHTML('beforeend',nucleoDriveLegacyHtml());};

async function nucleoDriveUploadStandard(){if(!nucleoFeatureRequire('documents','standards'))return;
 if(!isAdmin())return;const status=document.getElementById('stdDocUploadStatus'),btn=document.getElementById('stdDocSave');if(btn?.disabled)return;
 const show=(text,error=false)=>{if(status){status.textContent=text;status.style.cssText='margin-top:12px;padding:12px;border-radius:8px;background:'+(error?'#fff0f0':'#edf8f0')+';color:'+(error?'#a12f2f':'#23633b');status.scrollIntoView({behavior:'smooth',block:'nearest'});}else alert(text);};
 let saved=false;
 try{
  const val=id=>String(document.getElementById(id)?.value||'').trim(),file=document.getElementById('stdDocFile')?.files[0],fileId=val('ndStandardDriveId');
  if((!file&&!fileId)||!val('stdDocName')||!val('stdDocCode'))throw new Error('Informe nome, tipo de documento e arquivo.');
  if(file&&!fileId&&file.size>8*1024*1024)throw new Error('Use um arquivo de até 8 MB.');
  const unit=val('ndStandardUnit')||nucleoDriveUnit(),id='STD-'+Date.now()+'-'+Math.random().toString(36).slice(2),at=new Date().toISOString(),metadata={id,unit,name:val('stdDocName'),code:val('stdDocCode'),version:val('stdDocVersion'),validUntil:val('stdDocValidUntil'),productCode:val('stdDocProduct'),language:val('stdDocLanguage'),reviewDays:Number(val('stdDocReviewDays')||30),fillable:!!document.getElementById('stdDocFillable')?.checked,description:val('stdDocDescription'),active:true,status:'active',createdAt:at,updatedAt:at};
  if(btn){btn.disabled=true;btn.textContent='Armazenando…';}show('Armazenando na base central. Aguarde a confirmação…');
  const result=await nucleoDriveMutation('nucleo_drive_standard_upload',{unit,id,metadata:JSON.stringify(metadata),...(fileId?{fileId}:{fileName:file.name,mimeType:file.type||'application/octet-stream',fileData:await fileToBase64(file)})});
  if(!result?.sucesso||result.id!==id||!result.fileId)throw new Error('A base central não confirmou o cadastro do documento.');
  saved=true;
  const record=result.record||{...metadata,fileId:result.fileId,fileName:result.fileName,mimeType:file?.type||'application/octet-stream',uploadPending:false};
  try{saveStandardDocumentsLocal([record,...getStandardDocuments().filter(d=>d.id!==id)]);}catch(e){console.warn('Documento salvo; atualização local pendente.',e);}
  show('Documento armazenado com sucesso na base central: '+metadata.name+'.');
  if(btn){btn.textContent='Documento armazenado';const next=document.createElement('button');next.type='button';next.className='btn secondary';next.textContent='Ver documentos cadastrados';next.onclick=()=>renderStandardDocumentsWorkspace();btn.after(next);}
 }catch(e){show('Não foi possível concluir o cadastro: '+e.message,true);}
 finally{if(btn&&!saved){btn.disabled=false;btn.textContent='Tentar armazenar novamente';}}
}


function nucleoDriveScrollToConfirmation(){
 const box=document.getElementById('ndPdcaConfirm');if(!box)return;
 box.setAttribute('tabindex','-1');box.scrollIntoView({behavior:'smooth',block:'start'});box.focus({preventScroll:true});
}
const ndPreviousConfirmation=nucleoDriveRenderConfirmation;
nucleoDriveRenderConfirmation=function(){ndPreviousConfirmation();nucleoDriveScrollToConfirmation();};
const ndPreviousLinks=nucleoDriveRenderLinks;
nucleoDriveRenderLinks=function(){
 ndPreviousLinks();const host=document.getElementById('ndLinks');
 nucleoDriveState.links.forEach((link,i)=>{const row=host.children[i];if(!row)return;const ro=nucleoDriveCandidates().find(r=>String(r.numero||r.id)===link.ro),user=ro?resolveRoClaimant(ro):null;
 const info=document.createElement('div');info.style.cssText='flex-basis:100%;padding:10px;background:#f1f5f9;border-radius:8px';
 info.innerHTML='<b>Reclamante na R.O.:</b> '+nucleoDriveEscape(ro?roRegistrantName(ro)||'Não informado':'Selecione uma R.O.')+'<br><b>Cadastro identificado:</b> '+nucleoDriveEscape(user?personDisplayName(user)+' · '+(user.sector||''):'Não identificado com segurança — o SGQ deverá escolher o cadastro.')+'<br><span class="small">Esta é uma sugestão. A confirmação do reclamante será feita antes de disponibilizar no Núcleo.</span>';
 const edit=document.createElement('button');edit.className='btn secondary';edit.textContent='Alterar reclamante';edit.disabled=!ro;edit.onclick=()=>nucleoDriveEditClaimant(link.ro,info);info.appendChild(document.createElement('br'));info.appendChild(edit);
 row.appendChild(info);});
};
function nucleoDriveSavedNotice(ros,fileName,pdcaId){
 const card=document.createElement('div');card.className='card';card.style.cssText='padding:22px;background:#edf8f0;border:2px solid #98c9a5;margin:12px 0';card.setAttribute('role','status');
 card.innerHTML='<h3>Resposta armazenada com sucesso</h3><p>A base central confirmou o recebimento de <b>'+nucleoDriveEscape(fileName)+'</b>.</p><p>Vínculos: '+nucleoDriveEscape(ros.join(', '))+'</p><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn primary" id="ndContinueImport">Continuar importando PDCAs</button><button class="btn secondary" id="ndGoReceived">Ver todos os PDCAs recebidos</button><button class="btn secondary" id="ndExitImport">Sair</button></div><p class="small">A confirmação registra o PDCA em PDCAs recebidos. A disponibilização ao reclamante é uma etapa separada.</p>';
 const claimantActions=document.createElement('div');claimantActions.style.cssText='margin:14px 0;display:flex;gap:10px;flex-wrap:wrap';
 [...new Set(ros)].forEach(roKey=>{const btn=document.createElement('button');btn.className='btn primary';btn.textContent='Confirmar reclamante'+(ros.length>1?' — '+roKey:'');btn.onclick=()=>nucleoDriveSendPdca(pdcaId,roKey);claimantActions.appendChild(btn);});
 card.insertBefore(claimantActions,card.querySelector('div'));
 document.getElementById('ndContent').prepend(card);card.scrollIntoView({behavior:'smooth',block:'start'});
 card.querySelector('#ndContinueImport').onclick=()=>{nucleoDriveState.selectedPdf=null;nucleoDriveState.parsed=null;nucleoDriveState.links=[];nucleoDriveState.previousId='';nucleoDriveRenderPdca();nucleoDriveStatus('Selecione o próximo PDF para importar.');document.getElementById('ndPdf')?.scrollIntoView({behavior:'smooth',block:'center'});};
 card.querySelector('#ndGoReceived').onclick=()=>{document.getElementById('nucleoDriveOverlay')?.remove();const search=document.getElementById('sentSearch');if(search)search.value='';const filter=document.getElementById('sentStatusFilter');if(filter)filter.value='todos';showSentPdcas();};
 card.querySelector('#ndExitImport').onclick=()=>document.getElementById('nucleoDriveOverlay')?.remove();
}

async function nucleoDriveEditClaimant(roKey,host){
 const ro=nucleoDriveCandidates().find(r=>String(r.numero||r.id)===roKey);if(!ro)return;
 host.querySelector('.ndClaimantEditor')?.remove();
 const unit=explicitRecordUnit(ro),users=claimantIdentityIndex().users.filter(u=>u.personId&&String(u.approvalStatus||'approved')==='approved'&&(['todas','todos','geral'].includes(String(u.unit||'').toLowerCase())||explicitRecordUnit({unit:u.unit})===unit||(u.sectorMemberships||[]).some(m=>explicitRecordUnit({unit:m.unit})===unit)));
 const editor=document.createElement('div');editor.className='ndClaimantEditor';editor.style.marginTop='12px';
 editor.innerHTML='<label>Cadastro correto do reclamante<select><option value="">Selecione a pessoa</option>'+users.map(u=>'<option value="'+nucleoDriveEscape(u.personId)+'">'+nucleoDriveEscape(personDisplayName(u)+' · '+(u.sector||''))+'</option>').join('')+'</select></label><p class="small">Confirma o cadastro desta R.O. sem alterar o nome original da planilha ou disponibilizar respostas.</p><button class="btn primary">Salvar reclamante</button> <button class="btn secondary">Cancelar</button><p role="status"></p>';
 host.appendChild(editor);const select=editor.querySelector('select'),buttons=editor.querySelectorAll('button'),status=editor.querySelector('[role="status"]');
 const current=resolveRoClaimant(ro);if(current)select.value=current.personId;
 buttons[1].onclick=()=>editor.remove();
 buttons[0].onclick=async()=>{
  if(!select.value){status.textContent='Selecione o cadastro correto.';return;}
  const person=users.find(u=>u.personId===select.value);if(!confirm('Confirmar '+roKey+' para '+personDisplayName(person)+'?'))return;
  buttons.forEach(b=>b.disabled=true);select.disabled=true;status.textContent='Salvando reclamante na base central…';
  try{
   const result=await portalJsonp({acao:'portal_claimant_confirm',person:select.value,ro:roKey,registrant:roRegistrantName(ro),alias:'0'},60000);
   if(!result?.sucesso||result.binding?.id!==roKey||result.binding?.personId!==select.value)throw new Error(result?.erro||'A base central não confirmou o vínculo.');
   const bindings=[...claimantIdentityIndex().bindings.values()].filter(b=>b.id!==roKey);bindings.push(result.binding);localStorage.setItem('nucleo-claimant-bindings-v1',JSON.stringify(bindings));claimantIdentityCache=null;
   nucleoDriveRenderLinks();nucleoDriveStatus('Reclamante salvo na base central: '+personDisplayName(person)+'. Nenhum envio realizado.');
  }catch(e){status.textContent='Não foi possível salvar: '+e.message;buttons.forEach(b=>b.disabled=false);select.disabled=false;}
 };
}

async function nucleoDriveChooseDocument(kind,more=false){
 const standard=kind==='standard',prefix=standard?'ndStandard':'ndRequested',host=document.getElementById(prefix+'DriveList'),unit=standard?document.getElementById('ndStandardUnit').value:nucleoDriveState.unit;
 if(!host)return;
 if(!more){host._files=[];host._offset=0;host._unit=unit;}
 if(host._unit!==unit){host.textContent='A unidade mudou. Abra novamente a seleção de arquivos.';return;}
 host.textContent='Carregando arquivos da pasta…';
 try{
  const result=await nucleoDriveApi('nucleo_drive_list',{kind,unit,offset:host._offset||0});
  if(!host.isConnected)return;
  host._files.push(...result.items);host._offset=result.nextOffset;host.innerHTML='';
  const items=host._files.filter(f=>standard||f.mimeType==='application/pdf');
  if(!items.length)host.textContent='Nenhum arquivo compatível encontrado nesta pasta.';
  items.forEach(file=>{const row=document.createElement('div'),btn=document.createElement('button');row.style.margin='8px 0';btn.type='button';btn.className='btn secondary';btn.textContent=file.name;btn.onclick=()=>{
   if(standard&&document.getElementById('ndStandardUnit').value!==unit){host.textContent='A unidade mudou. Abra novamente a seleção.';return;}
   document.getElementById(prefix+'DriveId').value=file.id;document.getElementById(prefix+'DriveName').textContent='Arquivo selecionado no Drive: '+file.name;
   document.getElementById(standard?'stdDocFile':'ndRequestedUpload').value='';host.innerHTML='';
  };row.appendChild(btn);host.appendChild(row);});
  if(result.hasMore){const btn=document.createElement('button');btn.className='btn secondary';btn.textContent='Carregar mais 30 arquivos';btn.onclick=()=>nucleoDriveChooseDocument(kind,true);host.appendChild(btn);}
 }catch(e){host.textContent='Não foi possível listar os arquivos: '+e.message;}
}
