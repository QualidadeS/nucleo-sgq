/* NÚCLEO CORE: utils | V4 TESTE | funções: 2 */

function normalizeAnswer(v){
  return String(v||'').trim().toLowerCase();
}

function parseBrDate(v){
  const s=String(v||'').trim();
  const m=s.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
  if(!m)return null;
  let y=+m[3]; if(y<100)y+=2000;
  const d=new Date(y,+m[2]-1,+m[1],23,59,59);
  return isNaN(d.getTime())?null:d;
}

