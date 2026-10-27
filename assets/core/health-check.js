(function(){
'use strict';

const required = {
  core: ['getSession','portalJsonp','syncPortalBackend','nucleoPersonCan','view','setNav'],
  users: ['getOperationalUsers'],
  ro: ['showList'],
  pdca: ['showSentPdcas'],
  sac: ['showExternalRoControl'],
  audit5s: ['showAudit5S'],
  equipment: ['showAdminOperationalModule']
};

function testFunctions(){
  const missing=[];
  Object.entries(required).forEach(([group,names])=>{
    names.forEach(name=>{
      if(typeof window[name]!=='function')missing.push(group+': '+name);
    });
  });
  return missing;
}

window.nucleoArchitectureHealthCheck=function(){
  const missing=testFunctions();
  const modules=window.NUCLEO_ARCHITECTURE?.list?.()||[];
  const core=window.NUCLEO_CORE_REGISTRY||null;
  const result={
    ok:missing.length===0,
    build:window.NUCLEO_BUILD_VERSION||window.NUCLEO_MODULAR_BOOTSTRAP||'unknown',
    modules:modules.length,
    core,
    missing
  };
  if(missing.length)console.error('[NÚCLEO MODULAR] Funções ausentes:',missing);
  else console.info('[NÚCLEO MODULAR] Estrutura carregada corretamente.',result);
  return result;
};

window.addEventListener('load',()=>{
  setTimeout(()=>{
    try{window.nucleoArchitectureHealthCheck()}catch(e){console.error('[NÚCLEO MODULAR] Health check falhou.',e)}
  },0);
});
})();
