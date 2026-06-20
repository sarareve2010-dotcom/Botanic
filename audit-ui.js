// UI complémentaire : audit pro et checklists visibles.
(function(){
  function box(title,items){return '<section class="card span-12"><h3>'+title+'</h3><div class="class-grid">'+items.map(x=>'<div class="class-card"><b>'+x.split(':')[0]+'</b><p>'+x+'</p></div>').join('')+'</div></section>'}
  const oldHome=home;
  home=function(){oldHome(); if(DATA.expertAngers){view.innerHTML+='<div class="grid">'+box('Angers + 100 km : priorités écologiques',DATA.expertAngers.mustNotForget)+box('Check-list chargée d’étude flore/habitats',DATA.expertAngers.beChecklist)+'</div>'}}
  const oldTerrain=terrain;
  terrain=function(){
    if(state.terrain==='Expert Angers'){
      title('Terrain','Expert Angers 100 km : Natura 2000, EUNIS, phyto et modèles BE.');
      const e=DATA.expertAngers||{mustNotForget:[],beChecklist:[]};
      view.innerHTML=tabs(['Relevés','Échantillonnage','EUNIS','Phytosociologie','Bioévaluation','Cas BE','Rapport','Expert Angers'],state.terrain,'setTerrain')+'<div class="grid">'+
      box('Priorités Natura 2000 et grands systèmes locaux',e.mustNotForget)+
      box('Check-list professionnelle avant terrain et rapport',e.beChecklist)+
      '<section class="card span-12"><h3>Structure idéale fiche plante</h3><p><b>Identité :</b> nom français, latin, famille, classification. <b>Photos :</b> 6 photos, photo 1 en couverture. <b>Identification :</b> critères fiables, feuilles, fleurs, fruits, confusions, période. <b>Écologie :</b> habitat, sol, pH, humidité, lumière, trophie, espèces associées. <b>Statuts :</b> protection, liste rouge, invasive, source. <b>Pédagogie :</b> mémo, piège, niveau, conseils terrain.</p></section>'+ 
      '<section class="card span-12"><h3>Modèles terrain indispensables</h3><div class="class-grid"><div class="class-card"><b>Fiche relevé flore</b><p>Station, GPS, surface, strates, recouvrements, espèces, Braun-Blanquet.</p></div><div class="class-card"><b>Fiche habitat</b><p>EUNIS, syntaxon, structure, cortège, état, pressions, photos, justification.</p></div><div class="class-card"><b>Fiche zone humide</b><p>Hydromorphie, végétation hygrophile, alimentation, fonctions, dégradations.</p></div><div class="class-card"><b>Fiche espèce protégée</b><p>Localisation, effectifs, habitat, menaces, statut, mesures ERC.</p></div><div class="class-card"><b>Fiche invasive</b><p>Espèce, surface, densité, stade, risque, préconisations.</p></div><div class="class-card"><b>Fiche bioévaluation</b><p>Espèces, habitats, fonctionnalité, connectivité, niveau d’enjeu, justification.</p></div></div></section>'+ 
      '<section class="card span-12"><h3>EUNIS / Natura 2000 / CORINE</h3><p>EUNIS décrit et code les habitats observés. Natura 2000 cible habitats et espèces d’intérêt communautaire avec objectifs de conservation. CORINE Biotopes est une ancienne typologie encore citée dans des études. En rapport, ne jamais les confondre : on justifie les correspondances.</p></section></div>';
    }else oldTerrain();
  };
  setTerrain=function(x){state.terrain=x;terrain()};
  const oldRender=render; render=function(){if(state.view==='terrain'&&state.terrain==='Expert Angers')terrain();else oldRender()};
  render();
})();
