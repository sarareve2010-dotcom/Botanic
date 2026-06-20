// Botadex Pro UI : rend visibles les outils professionnels.
(function(){
  function grid(title,items){return '<section class="card span-12"><h3>'+title+'</h3><div class="class-grid">'+items.map(x=>'<div class="class-card"><p>'+x+'</p></div>').join('')+'</div></section>'}
  const oldLearn=learn;
  learn=function(){
    if(state.learn==='Pro'){
      title('Apprendre','Parcours professionnel accéléré pour devenir chargée d’étude flore/habitats.');
      view.innerHTML=tabs(['Parcours','Glossaire','Physiologie','Sols','Flashcards','Pro'],state.learn,'setLearn')+
      '<div class="grid">'+
      grid('Progression idéale en 10 modules',['1. Morphologie végétale','2. Vocabulaire illustré','3. Grandes familles','4. Utiliser une flore et une clé','5. Identifier une plante sur le terrain','6. Comprendre sol/eau/lumière/trophie','7. Comprendre EUNIS','8. Faire un relevé','9. Interpréter un cortège','10. Rédiger une synthèse BE'])+
      grid('Méthode de révision rapide',['Chaque jour : 10 termes de glossaire','Chaque sortie : 5 photos par plante inconnue','Chaque semaine : 1 relevé complet','Après chaque relevé : 1 hypothèse EUNIS + 1 hypothèse phyto','Chaque mois : mini-rapport de 2 pages'])+
      grid('Erreurs à éviter',['Identifier uniquement à la fleur','Confondre dominante et caractéristique','Faire un relevé sur une station hétérogène','Oublier les statuts réglementaires','Sur-affirmer un syntaxon','Ne pas noter les limites de prospection'])+
      '</div>';
    } else oldLearn();
  };
  const oldTerrain=terrain;
  terrain=function(){
    if(state.terrain==='Pro BE'){
      title('Terrain','Outils professionnels chargée d’étude flore/habitats.');
      const p=DATA.pro;
      view.innerHTML=tabs(['Relevés','Échantillonnage','EUNIS','Phytosociologie','Bioévaluation','Cas BE','Rapport','Expert Angers','Pro BE'],state.terrain,'setTerrain')+
      '<div class="grid">'+
      grid('Champs indispensables fiche plante',p.plantFields)+
      grid('Champs indispensables relevé terrain',p.surveyFields)+
      grid('Braun-Blanquet',p.braun)+
      grid('Méthode EUNIS opérationnelle',p.eunisMethod)+
      grid('Méthode phytosociologique',p.phytoMethod)+
      grid('Structure rapport BE',p.reportBlocks)+
      grid('Sources à consulter',p.sources)+
      '<section class="card span-12"><h3>Conclusion pro</h3><p>Une donnée n’est professionnelle que si elle est localisée, datée, sourcée, justifiée, cartographiable et accompagnée de ses limites. Botadex doit servir à apprendre et structurer, mais les statuts et habitats réglementaires restent à vérifier avec les sources officielles.</p></section></div>';
    } else oldTerrain();
  };
  setLearn=function(x){state.learn=x;learn()};
  setTerrain=function(x){state.terrain=x;terrain()};
  const oldRender=render;render=function(){if(state.view==='learn'&&state.learn==='Pro')learn();else if(state.view==='terrain'&&state.terrain==='Pro BE')terrain();else oldRender()};
  render();
})();
