// Accueil clarifie : supprime les blocs vagues et donne un vrai tableau de bord.
(function(){
  window.home=function(){
    title('Accueil','Apprendre la botanique, s’entraîner au terrain et préparer le métier de chargée d’étude.');
    const c=counts();
    const detailed=(DATA.plants||[]).filter(p=>p.detailed).length;
    view.innerHTML=progressBlock()+`<div class="grid">
      <section class="card hero"><div><h2>Botadex, ton carnet d’apprentissage flore-habitats.</h2><p>Le but est simple : apprendre à reconnaître les plantes, comprendre les habitats EUNIS, faire des relevés, raisonner en phytosociologie et rédiger comme en bureau d’étude.</p><div class="actions"><button class="primary" onclick="setView('learn')">Commencer à apprendre</button><button class="secondary" onclick="setView('explore')">Voir les plantes</button><button class="secondary" onclick="setView('terrain')">Préparer une sortie terrain</button></div></div><div class="hero-art">🌿</div></section>
      <section class="card span-4"><h3>1. Apprendre</h3><p>Glossaire, morphologie, familles, quiz, mini-clés et erreurs fréquentes. C’est la partie pour progresser vite.</p></section>
      <section class="card span-4"><h3>2. Explorer</h3><p>Fiches plantes avec photos, classification, critères d’identification, confusions, habitat et niveau de fiabilité.</p></section>
      <section class="card span-4"><h3>3. Terrain</h3><p>Relevés, EUNIS, phytosociologie, bioévaluation, cas pratiques et modèles de phrases pour rapport.</p></section>
      <section class="card span-6"><h3>État de la base</h3><p><b>${c.total}</b> entrées dans le catalogue, dont <b>${detailed}</b> fiches détaillées de départ. Les fiches locales servent de support d’entraînement et doivent être validées avec une flore/source officielle.</p></section>
      <section class="card span-6"><h3>Installation Android</h3><p>Ouvre Botadex dans Chrome, puis menu 3 points → Ajouter à l’écran d’accueil / Installer l’application. Le bouton “Installer sur Android” te rappelle la marche à suivre.</p></section>
      <section class="card span-12 warn"><b>Important :</b> Botadex est un outil d’apprentissage. Pour un rapport professionnel, vérifie toujours les noms, statuts et habitats avec INPN/TAXREF, CBN, DREAL, EUNIS/HabRef et les documents Natura 2000 locaux.</section>
    </div>`;
  };
  if(window.state&&state.view==='home')home();
})();
