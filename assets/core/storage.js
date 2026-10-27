/* NÚCLEO CORE: storage | V4 TESTE | funções: 2 */

function getAdminModuleRecords(){
  const deleted=getRncDeletedTombstones();
  return getAdminModuleRecordsRaw().filter(x=>!deleted[String(x?.id||'')]&&qualityRecordAllowed(x));
}

function saveAdminModuleRecords(list){
  safeStorageSet(ADMIN_MODULES_KEY,JSON.stringify(Array.isArray(list)?list:[]));
}

