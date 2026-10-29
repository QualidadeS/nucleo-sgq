/* NÚCLEO | PDF de R.O. com campos autoajustáveis | v2
   Todos os campos textuais do modelo crescem conforme o conteúdo.
   A altura configurada no editor é tratada como altura mínima.
   Imagens continuam respeitando a altura configurada.
*/
(function(){
  if(window.__nucleoRoPdfAutoHeightV2)return;
  window.__nucleoRoPdfAutoHeightV2=true;

  if(typeof window.nucleoRoModelRowsHtml!=='function')return;

  function textHtml(value){
    return nucleoRoModelEsc(value??'').replace(/\n/g,'<br>');
  }

  window.nucleoRoModelRowsHtml=function(grid,ro,model,images,pageNo=1,totalPages=1){
    const safeColor=(v,d)=>/^#[0-9a-f]{6}$/i.test(String(v||''))?v:d;
    const safeFill=(v,d='#ffffff')=>String(v||'').toLowerCase()==='transparent'?'transparent':safeColor(v,d);
    const rows=Array.isArray(grid)?grid:[];

    return rows.map(row=>{
      const units=nucleoRoModelRowUnits(row);

      return '<tr style="height:auto;min-height:0;break-inside:auto;page-break-inside:auto">'+
        ((row.cells||[]).map((cell,ci)=>{
          const meta=nucleoRoCellPersistMeta(cell);
          const persistedText=String(cell.text||'').trim();

          const placeholderSource={
            '[CÓDIGO DO DOCUMENTO]':'#CODE',
            '[CODIGO DO DOCUMENTO]':'#CODE',
            '[REVISÃO]':'#REVISION',
            '[REVISAO]':'#REVISION',
            '[NÚMERO / REGISTRO]':'#REGISTER',
            '[NUMERO / REGISTRO]':'#REGISTER',
            '[PÁGINA]':'#PAGE',
            '[PAGINA]':'#PAGE'
          };

          let src=String(cell.systemSource||meta.source||cell.source||'');
          if(!src)src=placeholderSource[persistedText]||'';

          const rawBw=Number(cell.borderWidth);
          const bw=Math.max(0,Math.min(4,Number.isFinite(rawBw)?rawBw:.5));
          const bc=safeColor(cell.borderColor,'#999999');

          const sideIndex={Top:0,Right:1,Bottom:2,Left:3};
          const side=(name)=>{
            const explicit=meta.mask
              ? meta.mask[sideIndex[name]]==='1'
              : cell['border'+name]!==false;
            return explicit
              ? `${bw}pt solid ${safeColor(cell['border'+name+'Color'],bc)}`
              : '0';
          };

          const minHeight=Math.max(3,Number(cell.height)||9);
          const isImage=cell.type==='image';

          let content='';

          if(isImage){
            const img=images?.[cell.imageFileId]||'';
            content=img
              ? `<img src="${nucleoRoModelEsc(img)}" style="display:block;width:100%;height:100%;max-height:${minHeight}mm;object-fit:${cell.imageFit==='cover'?'cover':'contain'}">`
              : '';
          }else if(src){
            content=textHtml(nucleoRoModelValue(ro,src,model,pageNo,totalPages));
          }else{
            content=textHtml(cell.text||'');
          }

          const visibleLabel=String(cell.labelText||cell.systemLabelText||meta.label||'');

          if(visibleLabel){
            content=
              `<div class="cell-stack" style="display:flex;flex-direction:column;gap:.7mm;height:auto;min-height:0;overflow:visible">`+
                `<span class="cell-label" style="display:block;font-size:${Math.max(5,Number(cell.labelFontSize)||7)}pt;font-weight:${cell.labelBold===false?'400':'700'};white-space:normal;overflow-wrap:anywhere;word-break:break-word">`+
                  `${nucleoRoModelEsc(visibleLabel)}`+
                `</span>`+
                `<span style="display:block;height:auto;min-height:0;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;overflow:visible">`+
                  `${content||''}`+
                `</span>`+
              `</div>`;
          }

          const body=isImage
            ? (content||'&nbsp;')
            : `<div style="
                display:block;
                width:100%;
                min-height:${minHeight}mm;
                height:auto;
                max-height:none;
                box-sizing:border-box;
                overflow:visible;
                white-space:pre-wrap;
                overflow-wrap:anywhere;
                word-break:break-word;
                line-height:1.28;
              ">${content||'&nbsp;'}</div>`;

          const sizeStyle=isImage
            ? `height:${minHeight}mm;min-height:${minHeight}mm;max-height:${minHeight}mm;overflow:hidden;`
            : `height:auto;min-height:${minHeight}mm;max-height:none;overflow:visible;`;

          return `<td
            colspan="${units[ci]||1}"
            ${Number(cell.rowSpan)>1?`rowspan="${Math.floor(Number(cell.rowSpan))}"`:''}
            style="
              ${sizeStyle}
              background:${cell.backgroundNone===true||meta.fill==='1'?'transparent':safeFill(cell.background,'#ffffff')};
              color:${safeColor(cell.textColor,'#222222')};
              border-top:${side('Top')};
              border-right:${side('Right')};
              border-bottom:${side('Bottom')};
              border-left:${side('Left')};
              padding:1.3mm;
              text-align:${['left','center','right'].includes(cell.align)?cell.align:'left'};
              vertical-align:${['top','middle','bottom'].includes(cell.verticalAlign)?cell.verticalAlign:'middle'};
              font-size:${Math.max(6,Number(cell.fontSize)||9)}pt;
              font-weight:${cell.bold?'700':'400'};
              font-style:${cell.italic?'italic':'normal'};
              white-space:normal;
              overflow-wrap:anywhere;
              word-break:break-word;
              box-sizing:border-box;
            ">${body}</td>`;
        }).join(''))+
      '</tr>';
    }).join('');
  };
})();
