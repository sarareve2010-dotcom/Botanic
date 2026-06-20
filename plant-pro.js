// Botadex : classement taxonomique et critères d’identification pour toutes les fiches.
(function(){
  const familyMap={
    Asteraceae:{ordre:'Asterales',classe:'Eudicotylédones',crit:'Capitule composé de petites fleurs, involucre de bractées, fruit souvent en akène, observer ligules/tubes et bractées.'},
    Poaceae:{ordre:'Poales',classe:'Monocotylédones',crit:'Tige généralement creuse à nœuds, feuilles à gaine, limbe linéaire, ligule, inflorescence en épillets, glumes/lemmes à vérifier.'},
    Cyperaceae:{ordre:'Poales',classe:'Monocotylédones',crit:'Tige souvent triangulaire, feuilles en trois rangs, inflorescences en épis, utricules chez Carex, loupe souvent nécessaire.'},
    Juncaceae:{ordre:'Poales',classe:'Monocotylédones',crit:'Tiges cylindriques ou feuilles joncoïdes, fleurs à 6 tépales discrets, capsules, milieux souvent humides.'},
    Ericaceae:{ordre:'Ericales',classe:'Eudicotylédones',crit:'Sous-arbrisseau acidiphile, feuilles petites coriaces, fleurs en grelots ou corolles, lande ou tourbière acide.'},
    Fabaceae:{ordre:'Fabales',classe:'Eudicotylédones',crit:'Feuilles souvent composées, stipules fréquentes, fleurs papilionacées, fruit en gousse.'},
    Rosaceae:{ordre:'Rosales',classe:'Eudicotylédones',crit:'Fleurs souvent à 5 pétales, nombreuses étamines, stipules fréquentes, fruits variés, feuilles alternes ou composées.'},
    Caryophyllaceae:{ordre:'Caryophyllales',classe:'Eudicotylédones',crit:'Feuilles opposées, nœuds renflés, fleurs souvent à 5 pétales parfois échancrés, capsule fréquente.'},
    Orchidaceae:{ordre:'Asparagales',classe:'Monocotylédones',crit:'Fleur zygomorphe à labelle, périanthe à 6 pièces, ovaire infère, feuilles entières souvent basales.'},
    Iridaceae:{ordre:'Asparagales',classe:'Monocotylédones',crit:'Feuilles en glaive, fleurs à 6 tépales pétaloïdes, ovaire infère, souvent rhizome ou bulbe.'},
    Betulaceae:{ordre:'Fagales',classe:'Eudicotylédones',crit:'Ligneux à feuilles simples, fleurs en chatons, fruits petits, critères sur feuilles, bourgeons, écorce et infrutescences.'},
    Urticaceae:{ordre:'Rosales',classe:'Eudicotylédones',crit:'Feuilles souvent opposées, poils urticants possibles, petites fleurs verdâtres, milieux nitrophiles.'},
    Sphagnaceae:{ordre:'Sphagnales',classe:'Sphagnopsida',crit:'Mousse spongieuse des milieux tourbeux, capitulum terminal, rameaux fasciculés, couleur variable, identification spécifique délicate.'},
    Dennstaedtiaceae:{ordre:'Polypodiales',classe:'Polypodiopsida',crit:'Fougère à frondes divisées, sores et rhizome à observer, attention aux grandes fougères de sous-bois.'},
    Droseraceae:{ordre:'Caryophyllales',classe:'Eudicotylédones',crit:'Petite plante carnivore, feuilles à poils glanduleux, milieux tourbeux acides, fleurs discrètes.'},
    Caprifoliaceae:{ordre:'Dipsacales',classe:'Eudicotylédones',crit:'Feuilles souvent opposées, fleurs groupées, fruits variables, vérifier inflorescence et structure florale.'},
    Rhamnaceae:{ordre:'Rosales',classe:'Eudicotylédones',crit:'Ligneux à feuilles simples, nervures arquées possibles, fruits charnus, critères de rameaux et bourgeons.'}
  };
  const groupMap={
    prairie:'Vérifier port général, feuilles basales/caulinaires, inflorescence, période de floraison et cortège prairial associé.',
    humide:'Vérifier caractères de zone humide : joncs, carex, hydromorphie, tiges souvent robustes, feuilles adaptées aux sols frais à engorgés.',
    carex:'Observer tige, gaine, disposition des épis, utricules mûrs, bec, glumes et habitat. Loupe indispensable.',
    juncus:'Observer tige, feuilles cloisonnées ou non, position de l’inflorescence, tépales, capsule et habitat humide.',
    hélophyte:'Vérifier enracinement dans vase/eau, tiges émergées, feuilles robustes, ceinture de mare/fossé/berge.',
    lande:'Observer sous-arbrisseau, feuilles petites/coriaces, acidiphilie, sol pauvre, association avec Calluna/Erica/Ulex/Molinia.',
    'lande humide':'Observer sous-arbrisseaux acidiphiles + humidité, sphaignes éventuelles, Molinia, sol tourbeux ou hydromorphe.',
    rudéral:'Chercher signes de perturbation, enrichissement azoté, espèces nitrophiles, sol remanié, bord de chemin ou friche.',
    invasive:'Vérifier capacité de colonisation, densité, reproduction, surface occupée et risque de dispersion.',
    orchidée:'Observer labelle, éperon, feuilles basales, bractées, inflorescence et habitat. Photographier fleur de face et de profil.',
    'forêt humide':'Observer essence dominante, strate herbacée hygrophile, sol engorgé, microtopographie et relation au cours d’eau.',
    tourbière:'Vérifier sphaignes, tourbe, eau acide, espèces oligotrophes, microrelief et alimentation hydrique.',
    bryophyte:'Observer à la loupe, noter substrat, humidité, couleur, architecture et habitat. Validation spécifique souvent délicate.',
    fougère:'Observer fronde, division du limbe, sores, pétiole, rhizome et écologie du sous-bois ou de lande.'
  };
  function genus(latin){return String(latin||'').split(' ')[0]||'Genre à préciser'}
  function enrichPlant(p){
    const fam=familyMap[p.family]||{};
    p.classif=p.classif||{};
    p.classif.règne=p.classif.règne||'Plantae';
    p.classif.embranchement=p.classif.embranchement||'Trachéophytes';
    p.classif.classe=p.classif.classe||fam.classe||'Classe à préciser';
    p.classif.ordre=p.classif.ordre||fam.ordre||'Ordre à préciser';
    p.classif.famille=p.family||'Famille à préciser';
    p.classif.genre=p.classif.genre||genus(p.latin);
    p.classif.taxon=p.classif.taxon||p.latin||p.fr;
    const fcrit=fam.crit||'Observer port, feuilles, tige, fleurs, fruits, pilosité, odeur éventuelle, habitat et cortège associé.';
    const gcrit=groupMap[p.group]||'Croiser les critères morphologiques avec l’habitat, la phénologie et les espèces associées.';
    const base=p.detailed&&p.criteria&&!p.criteria.includes('Fiche de travail')?p.criteria:'';
    p.identification={
      synthese: base||fcrit,
      famille:fcrit,
      groupe:gcrit,
      feuille:'Noter disposition, forme du limbe, marge, nervation, pétiole/gaine/stipules et pilosité.',
      tige:'Observer section, nœuds, pilosité, présence de gaine, rameaux, rhizome/stolon si visible.',
      fleur:'Observer type d’inflorescence, symétrie, calice, corolle, étamines, ovaire et couleur sans s’y limiter.',
      fruit:'Chercher le type de fruit, sa forme, son mode d’ouverture et les caractères mûrs utiles à la clé.',
      terrain:'Photographier port, feuille dessus/dessous, tige, fleur, fruit et habitat. Noter date, station et cortège.',
      validation:p.detailed?'Critères spécifiques de fiche détaillée, à confirmer avec flore et source officielle.':'Critères pédagogiques par famille/groupe : fiche à compléter avec une flore et validation terrain.'
    };
    if(!base){p.criteria=fcrit+' '+gcrit;}
    p.proStatus=p.detailed?'fiche détaillée':'fiche de catalogue à valider';
    return p;
  }
  if(window.DATA&&Array.isArray(DATA.plants)){DATA.plants.forEach(enrichPlant)}
  window.openPlant=function(id){
    let p=DATA.plants.find(x=>x.id===id),n=state.notes[id]||'',photos=state.photos[id]||[];
    const c=p.classif||{},ic=p.identification||{};
    modalContent.innerHTML=`<h2>${p.fr}</h2><div class="latin">${p.latin} · ${p.family}</div><div class="badges"><span class="badge">${p.group}</span><span class="badge">${p.proStatus}</span><span class="badge">${p.eunis}</span><span class="badge">${p.syntaxon}</span></div>
    <section class="module"><h3>Classement taxonomique</h3><table><tr><th>Rang</th><th>Valeur</th></tr><tr><td>Règne</td><td>${c.règne}</td></tr><tr><td>Embranchement</td><td>${c.embranchement}</td></tr><tr><td>Classe</td><td>${c.classe}</td></tr><tr><td>Ordre</td><td>${c.ordre}</td></tr><tr><td>Famille</td><td>${c.famille}</td></tr><tr><td>Genre</td><td>${c.genre}</td></tr><tr><td>Taxon</td><td>${c.taxon}</td></tr></table></section>
    <h3>Galerie personnelle — 6 photos</h3><p>La photo 1 devient automatiquement la couverture.</p><div class="photo-grid">${[0,1,2,3,4,5].map(i=>`<label class="photo-slot">${photos[i]?`<img src="${photos[i]}">`:`Photo ${i+1}<br>${i===0?'couverture':''}`}<input hidden type="file" accept="image/*" onchange="addPhoto(${id},${i},this)"></label>`).join('')}</div>
    <section class="module"><h3>Critères d’identification</h3><table><tr><th>Bloc</th><th>À vérifier</th></tr><tr><td>Synthèse</td><td>${ic.synthese}</td></tr><tr><td>Famille</td><td>${ic.famille}</td></tr><tr><td>Groupe/habitat</td><td>${ic.groupe}</td></tr><tr><td>Feuille</td><td>${ic.feuille}</td></tr><tr><td>Tige</td><td>${ic.tige}</td></tr><tr><td>Fleur</td><td>${ic.fleur}</td></tr><tr><td>Fruit</td><td>${ic.fruit}</td></tr><tr><td>Terrain</td><td>${ic.terrain}</td></tr><tr><td>Validation</td><td>${ic.validation}</td></tr></table></section>
    <div class="two-col"><section class="module"><h3>Description</h3><p>${p.description}</p><p><b>Habitat :</b> ${p.habitat}</p></section><section class="module"><h3>Écologie</h3><p>${p.ecology}</p></section><section class="module"><h3>Confusions</h3><p>${p.confusions}</p></section><section class="module"><h3>Niveau expert</h3><p>${p.expert}</p></section></div>
    <h3>Notes personnelles</h3><textarea id="note">${n}</textarea><div class="actions"><button class="primary" onclick="state.notes[${id}]=$('#note').value;save();closeModal();render()">Sauvegarder</button><button class="secondary" onclick="removePhotos(${id})">Retirer photos</button></div>`;
    modal.showModal();
  };
  if(typeof render==='function')render();
})();
