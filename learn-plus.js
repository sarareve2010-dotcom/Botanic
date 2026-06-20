// Botadex : parcours apprendre plus complet.
(function(){
  const modules=[
    ['Bases de botanique','Port, racine, tige, feuille, fleur, fruit, habitat.','Décrire une plante en 6 critères observables.'],
    ['Morphologie végétative','Limbe, pétiole, stipule, gaine, nervation, marge, pilosité.','Comparer une feuille pétiolée, sessile et engainante.'],
    ['Morphologie florale','Calice, corolle, étamines, pistil, ovaire, fruit.','Observer une fleur de face et de profil.'],
    ['Grandes familles','Asteraceae, Poaceae, Cyperaceae, Juncaceae, Fabaceae, Rosaceae, Orchidaceae.','Justifier une famille avec deux critères.'],
    ['Utiliser une flore','Suivre une clé avec des caractères vus, pas avec une intuition.','Noter les bifurcations et les doutes.'],
    ['Écologie végétale','Sol, eau, lumière, pH, trophie et cortège.','Lister les espèces indicatrices d’une prairie humide.'],
    ['Habitats EUNIS','Structure, cortège, hydrologie, gestion, dégradation.','Justifier E2, E3 ou D5.'],
    ['Phytosociologie','Cortège, caractéristique, différentielle, compagne, alliance.','Comparer Molinion et Juncion.'],
    ['Terrain pro','Relevé homogène, surface, strates, Braun-Blanquet, GPS, photos.','Faire une fiche relevé complète.'],
    ['Bioévaluation','Statuts, rareté, typicité, état, fonctionnalité, pressions.','Rédiger un niveau d’enjeu justifié.']
  ];
  const quiz=[
    ['Capitule + involucre + akènes','Asteraceae'],['Gaine + ligule + épillets','Poaceae'],['Tige souvent triangulaire + utricules','Carex / Cyperaceae'],['Molinia + Succisa + Carex panicea','Prairie humide oligotrophe / Molinion'],['Phragmites ou Typha dominants','Roselière / D5'],['Dominante = caractéristique ?','Non'],['Urtica + Galium aparine','Ourlet ou friche nitrophile'],['Braun-Blanquet 3','25 à 50 % de recouvrement']
  ];
  const keys=['Fleur en capitule -> Asteraceae','Tige carrée + feuilles opposées -> souvent Lamiaceae','Épillets + ligule -> Poaceae','Utricules -> Carex','Tépales discrets + capsule -> Juncaceae','Sous-arbrisseau acidiphile -> lande/Ericaceae','Labelle -> Orchidaceae','Eau stagnante -> C1','Courant -> C2','Prairie humide -> E3','Molinia + Succisa -> E3.4','Grands hélophytes -> D5'];
  const oldLearn=learn;
  learn=function(){
    if(state.learn==='Master'){
      title('Apprendre','Parcours complet botanique, EUNIS, phyto et métier.');
      view.innerHTML=tabs(['Parcours','Glossaire','Physiologie','Sols','Flashcards','Pro','Master'],state.learn,'setLearn')+
      '<div class="grid"><section class="card span-12"><h3>Parcours en 10 modules</h3><p>But : apprendre vite mais proprement, avec des exercices utilisables sur le terrain.</p></section>'+modules.map(m=>'<section class="card span-6"><h3>'+m[0]+'</h3><p><b>À apprendre :</b> '+m[1]+'</p><p><b>Exercice :</b> '+m[2]+'</p></section>').join('')+
      '<section class="card span-12"><h3>Quiz express</h3><div class="class-grid">'+quiz.map((q,i)=>'<div class="class-card"><b>Q'+(i+1)+' : '+q[0]+'</b><p>'+q[1]+'</p></div>').join('')+'</div></section>'+ 
      '<section class="card span-12"><h3>Mini-clés rapides</h3><div class="class-grid">'+keys.map(k=>'<div class="class-card"><p>'+k+'</p></div>').join('')+'</div></section></div>';
    } else oldLearn();
  };
  setLearn=function(x){state.learn=x;learn()};
})();
