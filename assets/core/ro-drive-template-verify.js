(function(){
'use strict';

let lastDriveModel=null;
let pollToken=0;

function feedback(message,type='info'){
  const status=document.getElementById('umStatus');
  if(status)status.textContent=message;

  const box=document.getElementById('umStandardFeedback');
  if(box){
    box.style.display='';
    box.textContent=message;
    box.style.background=type==='error'?'#fef2f2':type==='success'?'#ecfdf3':'#eff6ff';
    box.style.color=type==='error'?'#b42318':type==='success'?'#067647':'#1d4ed8';
  }
}

function addButton(){
  const dialog=document.getElementById('universalModelEditor');
  if(!dialog||dialog.querySelector('#umOpenDriveModel'))return;

  const save=dialog.querySelector('#umSave');
  if(!save)return;

  const btn=document.createElement('button');
  btn.id='umOpenDriveModel';
  btn.type='button';
  btn.className='btn secondary';
  btn.textContent='Abrir modelo no Drive';
  btn.style.display='none';

  btn.onclick=()=>{
    if(!lastDriveModel?.driveTemplateUrl){
      alert('O modelo oficial ainda não foi confirmado no Drive.');
      return;
    }
    window.open(lastDriveModel.driveTemplateUrl,'_blank','noopener');
  };

  save.parentElement?.insertBefore(btn,save);
}

function confirmed(info){
  lastDriveModel=info;
  addButton();

  const btn=document.getElementById('umOpenDriveModel');
  if(btn){
    btn.style.display='';
    btn.textContent='Abrir modelo no Drive ✓';
  }

  feedback('✓ Modelo salvo e Slides oficial confirmado no Drive.','success');
}

async function pollDrive(unit,requestedAt){
  const token=++pollToken;
  const until=Date.now()+180000;

  while(token===pollToken && Date.now()<until){
    await new Promise(r=>setTimeout(r,3000));

    let r;
    try{
      r=await portalJsonp({
        acao:'nucleo_drive_process_formats',
        unit
      },30000);
    }catch(_){
      continue;
    }

    const ro=r?.formats?.ro||{};

    if(ro.driveTemplateSyncError){
      feedback('Modelo salvo, mas o Slides oficial não pôde ser atualizado: '+ro.driveTemplateSyncError,'error');
      return;
    }

    const finished=Date.parse(ro.driveTemplateSyncFinishedAt||ro.driveTemplateUpdatedAt||'')||0;
    const requested=Date.parse(requestedAt||'')||0;

    if(ro.driveTemplateId && ro.driveTemplateUrl && finished>=requested){
      confirmed(ro);
      return;
    }
  }

  feedback('Modelo salvo. A atualização do Slides oficial ainda está em processamento; você pode continuar usando o Núcleo.','info');
}

function install(){
  const current=window.nucleoAdminDriveMutation;
  if(typeof current!=='function')return;
  if(current.__roDriveQueuedSave)return;

  const original=current;

  async function wrapped(action,params){
    const isRoSave=
      action==='nucleo_drive_process_formats' &&
      String(params?.kind||'')==='ro' &&
      !!params?.data;

    const result=await original.apply(this,arguments);

    if(isRoSave){
      const ro=result?.formats?.ro||{};
      const revision=String(result?.roDriveSaveRevision||'');

      if(revision!=='v29-fast-save'){
        feedback(
          'Modelo salvo, mas o Apps Script publicado não é a revisão esperada. Revisão recebida: '+
          (revision||'nenhuma')+'.',
          'error'
        );
        return result;
      }

      feedback('✓ Modelo salvo na base TESTE. Atualizando o Slides oficial no Drive…','info');
      pollDrive(String(params?.unit||'matriz'),ro.driveTemplateSyncRequestedAt||new Date().toISOString());
    }

    return result;
  }

  wrapped.__roDriveQueuedSave=true;
  wrapped.__roDriveOriginal=original;
  window.nucleoAdminDriveMutation=wrapped;
}

setInterval(()=>{
  install();
  addButton();
},1000);

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',()=>{
    install();
    addButton();
  },{once:true});
}else{
  install();
  addButton();
}
})();

(function(){
'use strict';

function roLayoutTestFeedback(message,type){
  const box=document.getElementById('umStandardFeedback');
  if(box){
    box.style.display='';
    box.textContent=message;
    box.style.background=type==='error'?'#fef2f2':type==='success'?'#ecfdf3':'#eff6ff';
    box.style.color=type==='error'?'#b42318':type==='success'?'#067647':'#1d4ed8';
  }
}

async function roRunLayoutTest(mode,ro){
  const editor=document.getElementById('universalModelEditor');
  const unit=editor?.querySelector('#umUnit')?.value||'matriz';

  roLayoutTestFeedback(
    mode==='real'
      ?'Gerando teste com a R.O. '+ro+' — sem triagem e sem envio…'
      :'Gerando teste com dados fictícios — sem triagem e sem envio…',
    'info'
  );

  const result=await portalJsonp({
    acao:'nucleo_drive_process_ro_layout_test',
    unit,
    mode,
    ro:ro||''
  },120000);

  if(!result?.sucesso){
    throw new Error(result?.erro||'Não foi possível gerar o teste do layout.');
  }

  roLayoutTestFeedback('✓ Teste gerado: '+result.fileName,'success');

  if(result.fileUrl){
    window.open(result.fileUrl,'_blank','noopener');
  }

  return result;
}

function roOpenLayoutTestDialog(){
  let dialog=document.getElementById('roLayoutTestDialog');
  if(dialog)dialog.remove();

  dialog=document.createElement('dialog');
  dialog.id='roLayoutTestDialog';
  dialog.style.cssText='width:min(560px,94vw);border:1px solid #cbd5e1;border-radius:14px;padding:20px';

  dialog.innerHTML=`
    <h3 style="margin-top:0">Testar layout da R.O.</h3>
    <p style="margin:8px 0 16px">
      Este teste não cria triagem, não altera status e não envia e-mail.
    </p>

    <div style="display:grid;gap:12px">
      <button type="button" class="btn primary" id="roTestFake">
        Gerar com dados fictícios
      </button>

      <div style="border-top:1px solid #e2e8f0;padding-top:14px">
        <label style="display:block;margin-bottom:6px">
          Testar com uma R.O. existente
        </label>
        <div style="display:flex;gap:8px;align-items:center">
          <input id="roTestNumber" placeholder="Ex.: 485 ou RO-EX-00485" style="flex:1">
          <button type="button" class="btn secondary" id="roTestReal">
            Gerar
          </button>
        </div>
        <p class="small" style="margin:7px 0 0">
          Usa o mesmo gerador do PDF enviado por e-mail, mas não envia nada.
        </p>
      </div>
    </div>

    <p id="roLayoutTestStatus" class="small" style="margin-top:14px"></p>

    <div style="display:flex;justify-content:flex-end;margin-top:16px">
      <button type="button" class="btn secondary" id="roTestClose">Fechar</button>
    </div>
  `;

  document.body.appendChild(dialog);

  const status=dialog.querySelector('#roLayoutTestStatus');
  const fake=dialog.querySelector('#roTestFake');
  const real=dialog.querySelector('#roTestReal');

  function busy(on){
    fake.disabled=on;
    real.disabled=on;
  }

  fake.onclick=async()=>{
    busy(true);
    status.textContent='Gerando PDF de teste…';
    try{
      const r=await roRunLayoutTest('fake','');
      status.innerHTML='Teste criado. <a href="'+r.fileUrl+'" target="_blank" rel="noopener">Abrir PDF</a>';
    }catch(e){
      status.textContent=e?.message||String(e);
    }finally{
      busy(false);
    }
  };

  real.onclick=async()=>{
    const ro=String(dialog.querySelector('#roTestNumber').value||'').trim();
    if(!ro){
      status.textContent='Informe o número da R.O.';
      dialog.querySelector('#roTestNumber').focus();
      return;
    }

    busy(true);
    status.textContent='Gerando PDF da R.O. sem executar triagem…';
    try{
      const r=await roRunLayoutTest('real',ro);
      status.innerHTML='Teste criado. <a href="'+r.fileUrl+'" target="_blank" rel="noopener">Abrir PDF</a>';
    }catch(e){
      status.textContent=e?.message||String(e);
    }finally{
      busy(false);
    }
  };

  dialog.querySelector('#roTestClose').onclick=()=>dialog.close();
  dialog.onclose=()=>dialog.remove();
  dialog.showModal();
}

function installRoLayoutTestButton(){
  const editor=document.getElementById('universalModelEditor');
  if(!editor||editor.querySelector('#umTestRoLayout'))return;

  const save=editor.querySelector('#umSave');
  if(!save)return;

  const btn=document.createElement('button');
  btn.id='umTestRoLayout';
  btn.type='button';
  btn.className='btn secondary';
  btn.textContent='Testar layout R.O.';
  btn.onclick=roOpenLayoutTestDialog;

  save.parentElement?.insertBefore(btn,save);
}

window.nucleoOpenRoLayoutTest=roOpenLayoutTestDialog;

setInterval(installRoLayoutTestButton,800);
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',installRoLayoutTestButton,{once:true});
}else{
  installRoLayoutTestButton();
}
})();
