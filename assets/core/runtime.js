// NÚCLEO | runtime limpo | 20261103-runtime-clean-v23
// Este arquivo NÃO contém cópia do aplicativo.
// A lógica do sistema deve existir somente em assets/nucleo-app.js.

window.NUCLEO_BUILD_VERSION = '20261103-runtime-clean-v23';

(function nucleoBuildConsistencyGuard(){
  try {
    var meta=document.querySelector('meta[name="nucleo-build"]');
    var htmlBuild=meta&&meta.getAttribute('content')||'';
    if(htmlBuild && htmlBuild!==window.NUCLEO_BUILD_VERSION){
      var k='nucleo-build-reload-'+window.NUCLEO_BUILD_VERSION;
      if(!sessionStorage.getItem(k)){
        sessionStorage.setItem(k,'1');
        var u=new URL(location.href);
        u.searchParams.set('_build',window.NUCLEO_BUILD_VERSION);
        location.replace(u.toString());
      }
    }
  } catch(e) {}
})();

// Recuperação explícita solicitada pelo usuário.
if(new URLSearchParams(location.search).get('recuperar')==='1'){
  try{localStorage.removeItem('ro-pdca-session-v63')}catch(e){}
  try{sessionStorage.removeItem('ro-pdca-session-v63')}catch(e){}
}
