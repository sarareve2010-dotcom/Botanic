// Botadex Pro : contenus professionnels, pédagogie, terrain, sources et modèles.
(function(){
  const G=[
    ['Morphologie','Racine','Organe souterrain d’ancrage et d’absorption.','Observer pivot, fasciculée, tubercule, rhizome associé.','Ne pas confondre racine et rhizome.'],
    ['Morphologie','Rhizome','Tige souterraine horizontale.','Iris, fougère aigle, beaucoup de plantes vivaces.','Ce n’est pas une racine.'],
    ['Morphologie','Stolon','Tige rampante qui produit de nouveaux individus.','Fraisier, renoncule rampante.','À distinguer du rhizome souterrain.'],
    ['Morphologie','Gaine','Base foliaire entourant la tige.','Poaceae, Cyperaceae, Apiaceae.','Critère essentiel des graminoïdes.'],
    ['Morphologie','Nervation pennée','Nervures secondaires partant d’une nervure centrale.','Chêne, plantain lancéolé.','À distinguer de palmée ou parallèle.'],
    ['Morphologie','Nervation parallèle','Nervures plus ou moins parallèles.','Poaceae, Plantago, nombreuses monocotylédones.','Ne suffit pas seule à identifier une famille.'],
    ['Forme de feuille','Lancéolé','Forme allongée, plus large au milieu, extrémités atténuées.','Plantago lanceolata.','Ne pas confondre avec linéaire.'],
    ['Forme de feuille','Elliptique','Forme d’ellipse, plus large au centre.','Beaucoup de feuilles de ligneux.','Observer base et sommet.'],
    ['Forme de feuille','Oblong','Plus long que large, bords presque parallèles.','Certaines feuilles de rumex.','Moins pointu que lancéolé.'],
    ['Forme de feuille','Réniforme','En forme de rein.','Ficaire, lierre terrestre parfois.','Base souvent échancrée.'],
    ['Forme de feuille','Cordé','En forme de cœur.','Viola, Tilia, certaines renouées.','À regarder à la base du limbe.'],
    ['Forme de feuille','Cunéiforme','Base en coin.','Certains pétales ou feuilles.','Terme de forme de base.'],
    ['Marge','Denté','Marge à dents pointues.','Feuilles d’ortie.','Denté ≠ crénelé.'],
    ['Marge','Crénelé','Marge à dents arrondies.','Lierre terrestre.','Dents arrondies.'],
    ['Marge','Lobé','Marge découpée en lobes.','Chêne, géraniums.','Lobé ≠ composé.'],
    ['Pilosité','Glabre','Sans poils visibles.','Feuille lisse.','Utiliser loupe si doute.'],
    ['Pilosité','Pubescent','Couvert de poils fins.','Houlque laineuse.','Densité et orientation comptent.'],
    ['Pilosité','Poil appliqué','Poil couché contre l’organe.','Critère dans certaines clés.','À distinguer de poil étalé.'],
    ['Pilosité','Poil étalé','Poil dressé ou écarté de la surface.','Critère de clé.','Observer à la loupe.'],
    ['Fleur','Actinomorphe','Fleur à symétrie radiaire.','Renoncule.','Plusieurs plans de symétrie.'],
    ['Fleur','Zygomorphe','Fleur à symétrie bilatérale.','Lamiaceae, Fabaceae, Orchidaceae.','Un seul plan de symétrie.'],
    ['Fleur','Rotacé','Corolle en roue, étalée.','Certaines Solanaceae.','À distinguer de campanulé.'],
    ['Fleur','Campanulé','En forme de cloche.','Campanules.','Corolle en cloche.'],
    ['Fleur','Calicule','Petit verticille de bractées sous le calice.','Mauves, fraisiers.','Ce n’est pas un deuxième calice vrai.'],
    ['Fleur','Accrescent','Organe qui continue de grandir après floraison.','Calice de certaines espèces.','Utile sur fruits.'],
    ['Fleur','Fugace','Qui tombe vite.','Pétales de certaines fleurs.','Peut manquer à l’observation.'],
    ['Fruit','Akène','Fruit sec indéhiscent à une graine.','Asteraceae, renoncules.','Souvent petit.'],
    ['Fruit','Silique','Fruit allongé des Brassicaceae.','Cardamine, moutarde.','Silicule si court.'],
    ['Fruit','Capsule','Fruit sec qui s’ouvre à maturité.','Silene, Plantago.','Mode d’ouverture utile.'],
    ['Écologie','Thérophyte','Plante annuelle passant la mauvaise saison en graine.','Messicoles, rudérales annuelles.','Fréquent en milieux perturbés.'],
    ['Écologie','Hémicryptophyte','Bourgeons au niveau du sol.','Nombreuses prairiales vivaces.','Forme biologique de Raunkiaer.'],
    ['Écologie','Géophyte','Organes de survie souterrains.','Bulbes, rhizomes, tubercules.','Printanières forestières.'],
    ['Écologie','Phanérophyte','Bourgeons portés en hauteur.','Arbres, arbustes.','Ligneux.'],
    ['Écologie','Xérophile','Qui aime les milieux secs.','Pelouses sèches.','À distinguer de thermophile.'],
    ['Écologie','Hygrophile','Qui aime les sols humides.','Joncs, carex humides.','Pas forcément aquatique.'],
    ['Écologie','Hydrophile','Lié à l’eau libre ou très mouillé.','Hydrophytes, hélophytes.','Plus fort qu’hygrophile.'],
    ['Écologie','Acidiphile','Qui préfère les sols acides.','Callune, Erica, Molinie.','Souvent sols pauvres.'],
    ['Écologie','Basiphile','Qui préfère les sols basiques/calcaire.','Pelouses calcicoles.','À confirmer par cortège.'],
    ['Écologie','Nitrophile','Qui apprécie l’azote.','Ortie, gaillet gratteron.','Signal d’eutrophisation.']
  ];
  DATA.glossary=[...DATA.glossary,...G.map(x=>({cat:x[0],term:x[1],simple:x[2],expert:x[3],example:x[3],trap:x[4]}))].filter((g,i,a)=>a.findIndex(y=>y.term===g.term)===i);
  DATA.pro={
    sources:['INPN / TAXREF pour noms et statuts','CBN de Brest pour flore du Massif armoricain et Pays de la Loire','DREAL Pays de la Loire pour arrêtés, Natura 2000, zones humides','OFB pour documentation habitats et méthodes','EUNIS / HabRef pour typologies habitats','Cahiers d’habitats Natura 2000 pour habitats d’intérêt communautaire','Listes rouges nationale et régionale','DOCOB et FSD des sites Natura 2000 locaux'],
    plantFields:['Nom français','Nom latin','Famille','Classification','Synonymes','Photos port/feuille/fleur/fruit/habitat','Critères fiables','Feuille','Tige','Fleur','Fruit','Floraison','Habitat','Sol','pH','Humidité','Lumière','Trophie','Répartition','Statut protection','Liste rouge','Invasive','Confusions','Espèces associées','Niveau difficulté','Mémo terrain','Source/date'],
    surveyFields:['Observateur','Date','Heure','Météo','Commune','GPS','Altitude','Surface','Homogénéité','Strate herbacée','Strate arbustive','Strate arborée','Recouvrement total','Recouvrement par strate','Espèces et Braun-Blanquet','Sol','pH estimé','Hydromorphie','Gestion','Pressions','Photos','EUNIS pressenti','Syntaxon pressenti','Incertitudes'],
    braun:['r : individu isolé, recouvrement négligeable','+ : peu abondant, recouvrement très faible','1 : nombreux mais recouvrement <5 %','2 : recouvrement 5 à 25 %','3 : recouvrement 25 à 50 %','4 : recouvrement 50 à 75 %','5 : recouvrement 75 à 100 %'],
    eunisMethod:['1. Décrire structure : eau, herbacé, lande, fourré, boisement, artificiel','2. Observer hydrologie : sec, frais, humide, inondé, aquatique','3. Identifier cortège dominant et espèces différentielles','4. Évaluer gestion et dégradation','5. Choisir grand type EUNIS puis niveau plus fin','6. Vérifier correspondances Natura 2000/HabRef si enjeu','7. Justifier incertitudes et mosaïques'],
    phytoMethod:['Travailler sur une station homogène','Lister tout le cortège, pas seulement dominantes','Séparer caractéristique, différentielle, compagne','Ne pas sur-affirmer : rattachement probable si données insuffisantes','Comparer avec tableaux/sources régionales','Relier syntaxon à sol, eau, trophie, gestion'],
    reportBlocks:['Méthodologie de prospection','Conditions et limites','Résultats flore','Résultats habitats','Espèces protégées/patrimoniales','Espèces exotiques envahissantes','Bioévaluation','Impacts potentiels','Mesures ERC','Conclusion opérationnelle']
  };
})();
