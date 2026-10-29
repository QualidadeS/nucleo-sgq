/* NÚCLEO | Painel de cota de e-mail | v1 */
(function(){
  if(window.__nucleoEmailQuotaPanelV1)return;
  window.__nucleoEmailQuotaPanelV1=true;

  function esc(v){
    if(typeof escapeHtml==='function')return escapeHtml(String(v??''));
    return String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }

  function ensurePanel(){
    let summary=document.getElementById('emailQueueSummary');
    if(!summary)return null;

    let panel=document.getElementById('nucleoEmailQuotaPanel');
    if(panel)return panel;

    panel=document.createElement('div');
    panel.id='nucleoEmailQuotaPanel';
    panel.style.cssText='display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:12px 0 4px';

    panel.innerHTML=`
      <div class="card" style="padding:12px 14px;min-width:0">
        <div class="small">Cota restante agora</div>
        <div id="nucleoEmailQuotaRemaining" style="font-size:24px;font-weight:800;margin-top:3px">—</div>
        <div id="nucleoEmailQuotaRemainingHint" class="small" style="margin-top:2px">destinatários disponíveis</div>
      </div>
      <div class="card" style="padding:12px 14px;min-width:0">
        <div class="small">Enviados pelo Núcleo hoje</div>
        <div id="nucleoEmailQuotaSent" style="font-size:24px;font-weight:800;margin-top:3px">—</div>
        <div class="small" style="margin-top:2px">destinatários confirmados</div>
      </div>
      <div class="card" style="padding:12px 14px;min-width:0">
        <div class="small">Falhas hoje</div>
        <div id="nucleoEmailQuotaErrors" style="font-size:24px;font-weight:800;margin-top:3px">—</div>
        <div id="nucleoEmailQuotaErrorsHint" class="small" style="margin-top:2px">envios com erro</div>
      </div>
    `;

    summary.insertAdjacentElement('afterend',panel);

    if(!document.getElementById('nucleoEmailQuotaResponsiveStyle')){
      const st=document.createElement('style');
      st.id='nucleoEmailQuotaResponsiveStyle';
      st.textContent=`
        @media(max-width:760px){
          #nucleoEmailQuotaPanel{grid-template-columns:1fr!important}
        }
      `;
      document.head.appendChild(st);
    }

    return panel;
  }

  function renderUsage(usage){
    ensurePanel();
    const remaining=document.getElementById('nucleoEmailQuotaRemaining');
    const sent=document.getElementById('nucleoEmailQuotaSent');
    const errors=document.getElementById('nucleoEmailQuotaErrors');
    const remHint=document.getElementById('nucleoEmailQuotaRemainingHint');
    const errHint=document.getElementById('nucleoEmailQuotaErrorsHint');

    if(!usage){
      if(remaining)remaining.textContent='—';
      if(sent)sent.textContent='—';
      if(errors)errors.textContent='—';
      return;
    }

    const r=Number(usage.remainingQuota);
    const s=Number(usage.sentRecipientsToday||0);
    const e=Number(usage.errorsToday||0);

    if(remaining)remaining.textContent=Number.isFinite(r)?String(r):'—';
    if(sent)sent.textContent=String(s);
    if(errors)errors.textContent=String(e);

    if(remHint){
      if(Number.isFinite(r)&&r<=0){
        remHint.textContent='cota esgotada';
        remHint.style.color='#b42318';
        if(remaining)remaining.style.color='#b42318';
      }else if(Number.isFinite(r)&&r<=10){
        remHint.textContent='atenção: cota muito baixa';
        remHint.style.color='#8a5a00';
        if(remaining)remaining.style.color='#8a5a00';
      }else{
        remHint.textContent='destinatários disponíveis';
        remHint.style.color='';
        if(remaining)remaining.style.color='';
      }
    }

    if(errHint){
      errHint.textContent=e===1?'envio com erro':'envios com erro';
      errHint.style.color=e>0?'#b42318':'';
      if(errors)errors.style.color=e>0?'#b42318':'';
    }
  }

  async function refreshQuota(){
    ensurePanel();
    try{
      const res=await portalJsonp({acao:'portal_email_status'},60000);
      if(res?.sucesso){
        renderUsage(res.emailUsage||null);
      }
    }catch(e){
      console.warn('[NÚCLEO COTA EMAIL] Não foi possível atualizar o painel.',e);
    }
  }

  // Atualiza o painel junto com o histórico, sem substituir a função original.
  const bindRefresh=()=>{
    if(typeof window.refreshEmailHistory==='function'&&!window.refreshEmailHistory.__quotaWrapped){
      const original=window.refreshEmailHistory;
      const wrapped=async function(){
        const out=await original.apply(this,arguments);
        try{await refreshQuota()}catch(_){}
        return out;
      };
      wrapped.__quotaWrapped=true;
      window.refreshEmailHistory=wrapped;
    }
  };

  document.addEventListener('DOMContentLoaded',()=>{
    ensurePanel();
    bindRefresh();
    setTimeout(refreshQuota,600);
  });

  setTimeout(()=>{ensurePanel();bindRefresh();refreshQuota();},1200);
})();
