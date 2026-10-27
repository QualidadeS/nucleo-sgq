(function(){
'use strict';
window.NucleoCore=window.NucleoCore||{};
NucleoCore.session={current:()=>typeof getSession==='function'?getSession():null};
NucleoCore.permissions={can:(module,feature)=>feature&&typeof nucleoPersonFeatureCan==='function'?!!nucleoPersonFeatureCan(module,feature):(typeof nucleoPersonCan==='function'?!!nucleoPersonCan(module):false)};
NucleoCore.api={call:(action,params,timeout)=>typeof portalJsonp==='function'?portalJsonp({acao:action,...(params||{})},timeout||30000):Promise.reject(new Error('API central ainda não inicializada.'))};
})();
