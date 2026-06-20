// Fix plantes : ne pas renommer les fiches locales comme des taxons valides.
(function(){
  if(!window.DATA||!Array.isArray(DATA.plants))return;
  DATA.plants.forEach(p=>{
    const isLocal=String(p.fr||'').includes('fiche locale')||p.detailed===false;
    if(isLocal){
      p.proStatus='fiche locale a completer';
      if(!p.criteria||String(p.criteria).includes('Fiche de travail')){
        p.criteria='Fiche locale de catalogue : identifier avec une flore avant validation. Observer port, feuilles, tige, fleurs, fruits, pilosite, habitat et cortege.';
      }
      p.identification=p.identification||{};
      p.identification.fiabilite='fiche locale non validee : ne pas utiliser telle quelle en rapport professionnel';
    }
  });
  const oldCard=window.card;
  if(typeof oldCard==='function'){
    window.card=function(p){
      const isLocal=String(p.fr||'').includes('fiche locale')||p.detailed===false;
      if(isLocal&&String(p.proStatus||'').includes('verifiee'))p.proStatus='fiche locale a completer';
      return oldCard(p).replaceAll('fiche modele verifiee a consolider','fiche locale a completer');
    }
  }
})();
