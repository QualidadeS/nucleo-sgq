/* NÚCLEO | API editável — v72
   ÚNICA função deste arquivo:
   - permitir editar o campo "URL do Web App / API".
   NÃO altera portalApiBase, sincronização, login, startup, JSONP ou Apps Script.
*/
(function(){
  'use strict';

  function unlockApiField(){
    const input=document.getElementById('apiUrl');
    if(!input)return;

    input.readOnly=false;
    input.disabled=false;
    input.removeAttribute('readonly');
    input.removeAttribute('aria-readonly');
    input.style.background='';
    input.title='';

    document.querySelectorAll('[data-nucleo-api-lock-note]').forEach(el=>el.remove());
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',unlockApiField,{once:true});
  }else{
    unlockApiField();
  }

  const observer=new MutationObserver(unlockApiField);
  observer.observe(document.documentElement,{childList:true,subtree:true});
})();
