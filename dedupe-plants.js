// Nettoyage catalogue : une fiche = une vraie plante nommee.
(function(){
  if(!window.DATA||!Array.isArray(DATA.plants))return;
  function bad(p){
    const fr=String(p.fr||'').toLowerCase();
    const la=String(p.latin||'').toLowerCase();
    return fr.includes('fiche locale')||fr.match(/\b0{0,3}\d{2,}\b/)||la.includes('fiche locale');
  }
  function key(p){return String(p.latin||p.fr||'').replace(' agg.','').trim().toLowerCase()}
  const keep=new Map();
  DATA.plants.filter(p=>!bad(p)).forEach(p=>{
    const k=key(p);if(!k)return;
    if(!keep.has(k)||(!keep.get(k).detailed&&p.detailed))keep.set(k,p);
  });
  DATA.plants=[...keep.values()].sort((a,b)=>String(a.fr||'').localeCompare(String(b.fr||''),'fr'));
  DATA.plants.forEach((p,i)=>p.id=i+1);
  localStorage.botadex_catalog_note='Catalogue nettoyé : fiches locales numerotees masquees, une fiche par plante.';
  if(typeof save==='function')save();
  if(typeof render==='function')render();
})();
