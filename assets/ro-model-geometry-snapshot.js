(function(){
'use strict';

function captureGeometry(){
  const paper=document.getElementById('umPaper');
  if(!paper)return null;

  const pr=paper.getBoundingClientRect();
  if(!pr.width||!pr.height)return null;

  const regions={};

  ['header','body','footer'].forEach(region=>{
    const host=paper.querySelector(`[data-region-preview="${region}"]`);
    if(!host)return;

    const hr=host.getBoundingClientRect();
    const cells=[];

    host.querySelectorAll('[data-univ-cell]').forEach(el=>{
      const id=String(el.dataset.univCell||'').trim();
      if(!id)return;

      const r=el.getBoundingClientRect();

      cells.push({
        id,
        x:+((r.left-pr.left)/pr.width).toFixed(8),
        y:+((r.top-pr.top)/pr.height).toFixed(8),
        w:+(r.width/pr.width).toFixed(8),
        h:+(r.height/pr.height).toFixed(8)
      });
    });

    regions[region]={
      x:+((hr.left-pr.left)/pr.width).toFixed(8),
      y:+((hr.top-pr.top)/pr.height).toFixed(8),
      w:+(hr.width/pr.width).toFixed(8),
      h:+(hr.height/pr.height).toFixed(8),
      cells
    };
  });

  const totalCells=Object.values(regions).reduce(
    (n,r)=>n+(Array.isArray(r?.cells)?r.cells.length:0),0
  );

  if(!totalCells)return null;

  return {
    version:4,
    capturedAt:new Date().toISOString(),
    pageAspect:+(pr.width/pr.height).toFixed(8),
    totalCells,
    regions
  };
}

function injectGeometryIntoPayload(params){
  if(
    String(params?.kind||'')!=='ro' ||
    !params?.data
  ) return params;

  let model;
  try{
    model=JSON.parse(String(params.data));
  }catch(_){
    return params;
  }

  const snapshot=captureGeometry();
  if(!snapshot)return params;

  model.universalLayout=model.universalLayout||{};
  model.universalLayout.version=Math.max(
    4,
    Number(model.universalLayout.version)||0
  );
  model.universalLayout.geometrySnapshot=snapshot;

  return {
    ...params,
    data:JSON.stringify(model)
  };
}

function install(){
  const current=window.nucleoAdminDriveMutation;
  if(typeof current!=='function')return;
  if(current.__roGeometryInsideModel)return;

  const original=current;

  async function wrapped(action,params){
    let nextParams=params;

    if(
      action==='nucleo_drive_process_formats' &&
      String(params?.kind||'')==='ro' &&
      params?.data
    ){
      nextParams=injectGeometryIntoPayload(params);
    }

    const result=await original.call(this,action,nextParams);

    try{
      if(
        action==='nucleo_drive_process_formats' &&
        String(params?.kind||'')==='ro' &&
        nextParams!==params &&
        result &&
        typeof result==='object'
      ){
        result.geometrySnapshotSaved=true;
      }
    }catch(_){}

    return result;
  }

  // Preserva os marcadores dos outros wrappers para impedir
  // que os instaladores se envolvam mutuamente em loop infinito.
  wrapped.__roGeometryInsideModel=true;
  wrapped.__roDriveQueuedSave=!!original.__roDriveQueuedSave;
  wrapped.__roGeometryOriginal=original;
  window.nucleoAdminDriveMutation=wrapped;
}

window.nucleoCaptureRoGeometrySnapshot=captureGeometry;
window.nucleoInstallRoGeometrySnapshot=install;

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',install,{once:true});
}else{
  install();
}

setInterval(install,1000);
})();