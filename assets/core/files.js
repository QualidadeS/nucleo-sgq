/* NÚCLEO CORE: files | V4 TESTE | funções: 1 */

function fileToBase64(file){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>{const s=String(reader.result||'');resolve(s.includes(',')?s.split(',').pop():s)};
    reader.onerror=()=>reject(reader.error||new Error('Falha ao ler o arquivo.'));
    reader.readAsDataURL(file);
  });
}

