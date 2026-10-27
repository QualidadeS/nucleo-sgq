/* NÚCLEO CORE: ui | V4 TESTE | funções: 5 */

function formatDateBR(value){
  if(!value)return '';
  const p=String(value).split('-');
  return p.length===3?`${p[2]}/${p[1]}/${p[0]}`:value;
}

function formatDateTimeBR(value){
  if(!value)return '';
  try{
    return new Date(value).toLocaleString('pt-BR');
  }catch(e){
    return String(value);
  }
}

function showNucleoLoading(message,title){
  nucleoLoadingDepth++;
  if(nucleoLoadingHideTimer){
    clearTimeout(nucleoLoadingHideTimer);
    nucleoLoadingHideTimer=null;
  }

  const overlay=document.getElementById('nucleoLoadingOverlay');
  const titleEl=document.getElementById('nucleoLoadingTitle');
  const textEl=document.getElementById('nucleoLoadingText');

  if(titleEl)titleEl.textContent=title||'Carregando NÚCLEO';
  if(textEl)textEl.textContent=message||'Processando dados...';
  if(overlay){
    overlay.classList.add('show');
    overlay.setAttribute('aria-busy','true');
  }

  // Dá ao navegador a chance de desenhar o overlay antes de iniciar trabalho pesado.
  return new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
}

function updateNucleoLoading(message,title){
  const titleEl=document.getElementById('nucleoLoadingTitle');
  const textEl=document.getElementById('nucleoLoadingText');
  if(title && titleEl)titleEl.textContent=title;
  if(message && textEl)textEl.textContent=message;
}

function hideNucleoLoading(force=false){
  if(force)nucleoLoadingDepth=0;
  else nucleoLoadingDepth=Math.max(0,nucleoLoadingDepth-1);

  if(nucleoLoadingDepth>0)return;

  const overlay=document.getElementById('nucleoLoadingOverlay');
  if(!overlay)return;

  nucleoLoadingHideTimer=setTimeout(()=>{
    overlay.classList.remove('show');
    overlay.setAttribute('aria-busy','false');
    nucleoLoadingHideTimer=null;
  },120);
}

