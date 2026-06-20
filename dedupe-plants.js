// Dedupe plantes : une fiche = une plante réelle.
(function(){
  if(!window.DATA||!Array.isArray(DATA.plants))return;
  function baseLatin(p){return String(p.latin||p.fr||'').replace(' agg.','').replace(/ · fiche locale .*/,'').trim().toLowerCase()}
  const keep=new Map();
  DATA.plants.forEach(p=>{
    const local=String(p.fr||'').includes('fiche locale')||p.detailed===false;
    const key=baseLatin(p);
    if(!key)return;
    if(!keep.has(key)){keep.set(key,p);return}
    const old=keep.get(key);
    const oldLocal=String(old.fr||'').includes('fiche locale')||old.detailed===false;
    if(oldLocal&&!local)keep.set(key,p);
  });
  DATA.plants=[...keep.values()].sort((a,b)=>String(a.fr||'').localeCompare(String(b.fr||''),'fr'));
  DATA.plants.forEach((p,i)=>p.id=i+1);
  localStorage.botadex_catalog_note='Catalogue nettoyé : une fiche par plante, doublons générés supprimés.';
  if(typeof save==='function')save();
  if(typeof render==='function')render();
})();
