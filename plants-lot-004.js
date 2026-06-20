// Botadex lot 004 : prairies, boisements, zones humides, rudérales et invasives à vérifier.
(function(){
if(!window.DATA||!Array.isArray(DATA.plants))return;
const rows=`
Gaillet croisette|Cruciata laevipes|Rubiaceae|Gentianales|Eudicotylédones|Haies, lisières, prairies fraîches, ourlets|E5/E2|Trifolion medii|Feuilles verticillées par 4, petites fleurs jaunes, plante d’ourlet frais|commune
Gaillet grêle|Galium parisiense|Rubiaceae|Gentianales|Eudicotylédones|Pelouses sèches, friches ouvertes, sols maigres|E1/J|Sedo-Scleranthetea|Petit gaillet annuel, feuilles fines verticillées, sols ouverts secs|commune sèche
Benoîte commune|Geum urbanum|Rosaceae|Rosales|Eudicotylédones|Haies, bois frais, ourlets nitrophiles|G1/E5|Galio-Urticetea|Feuilles divisées, fleurs jaunes, fruits accrochants en tête|commune
Benoîte des ruisseaux|Geum rivale|Rosaceae|Rosales|Eudicotylédones|Prairies humides, bois marécageux, berges fraîches|E3/G1|Calthion / Alnion|Fleurs pendantes rosées brunâtres, milieux frais à humides|patrimoniale à vérifier
Potentille rampante|Potentilla reptans|Rosaceae|Rosales|Eudicotylédones|Chemins, prairies, friches fraîches, sols tassés|E2/J|Agrostietea / Cynosurion|Tiges rampantes, feuilles à 5 folioles, fleurs jaunes à 5 pétales|commune
Potentille faux-fraisier|Potentilla sterilis|Rosaceae|Rosales|Eudicotylédones|Haies, talus ombragés, bois clairs|G1/E5|Querco-Fagetea|Ressemble au fraisier, fleurs blanches petites, feuilles trifoliées|commune
Fraisier des bois|Fragaria vesca|Rosaceae|Rosales|Eudicotylédones|Bois clairs, haies, talus, lisières|G1/E5|Querco-Fagetea|Feuilles trifoliées, fleurs blanches, stolons, petites fraises rouges|commune
Aigremoine élevée|Agrimonia procera|Rosaceae|Rosales|Eudicotylédones|Ourlets, lisières, talus frais à mésophiles|E5/F3|Trifolion medii|Grande aigremoine, épis jaunes, fruits crochus, à distinguer d’A. eupatoria|à vérifier
Renoncule bulbeuse|Ranunculus bulbosus|Ranunculaceae|Ranunculales|Eudicotylédones|Pelouses sèches, prairies maigres, talus|E1/E2|Mesobromion / Cynosurion|Sépales rabattus, base de tige bulbeuse, fleurs jaunes|indicatrice prairie sèche
Renoncule scélérate|Ranunculus sceleratus|Ranunculaceae|Ranunculales|Eudicotylédones|Vases, fossés, mares temporaires, sols très humides|C3/J|Bidention / Nanocyperion|Petites fleurs jaunes, nombreux akènes en tête allongée, plante de vase|indicatrice vases
Renoncule flammette|Ranunculus flammula|Ranunculaceae|Ranunculales|Eudicotylédones|Fossés, tourbières, prairies humides pauvres|E3/D2|Caricion / Littorelletea|Feuilles étroites lancéolées, fleurs jaunes, milieux humides acides|indicatrice humide
Anémone fausse-renoncule|Anemone ranunculoides|Ranunculaceae|Ranunculales|Eudicotylédones|Bois frais riches, haies anciennes, sous-bois|G1|Fagetalia|Fleur jaune printanière, feuilles découpées, tapis forestiers localisés|patrimoniale à vérifier
Cardamine flexueuse|Cardamine flexuosa|Brassicaceae|Brassicales|Eudicotylédones|Bois frais, suintements, chemins humides, jardins|G1/E3|Cardaminetea|Petite Brassicaceae, fleurs blanches, tige flexueuse, milieux frais|commune
Cardamine impatiente|Cardamine impatiens|Brassicaceae|Brassicales|Eudicotylédones|Bois frais, bords de ruisseaux, ravins, haies humides|G1/C2|Cardaminetea|Feuilles composées, siliques dressées, plante de milieux frais|commune locale
Barbarée commune|Barbarea vulgaris|Brassicaceae|Brassicales|Eudicotylédones|Fossés, prairies humides, friches fraîches|E3/E5|Agrostietea / Artemisietea|Fleurs jaunes, feuilles basales lyrées, siliques dressées|commune
Rorippe amphibie|Rorippa amphibia|Brassicaceae|Brassicales|Eudicotylédones|Berges, fossés, roselières, eaux peu profondes|C3/D5|Phragmito-Magnocaricetea|Brassicaceae amphibie à fleurs jaunes, feuilles variables|indicatrice berges
Rorippe des marais|Rorippa palustris|Brassicaceae|Brassicales|Eudicotylédones|Vases exondées, fossés, berges eutrophes|C3/J|Bidention tripartitae|Petites fleurs jaunes, siliques courtes, sols humides nus|indicatrice vases
Arabette de Thalius|Arabidopsis thaliana|Brassicaceae|Brassicales|Eudicotylédones|Murs, cultures, friches sèches, sols nus|J/H3|Stellarietea / Sedo-Scleranthetea|Très petite Brassicaceae, rosette, hampes fines, siliques allongées|commune
Lamier blanc|Lamium album|Lamiaceae|Lamiales|Eudicotylédones|Ourlets, haies, friches riches, bords de chemins|E5/J|Galio-Urticetea|Fleurs blanches bilabiées, feuilles opposées ressemblant à l’ortie non urticante|commune
Lamier tacheté|Lamium maculatum|Lamiaceae|Lamiales|Eudicotylédones|Haies, ourlets frais, bords de ruisseaux, jardins|E5/G1|Galio-Urticetea|Fleurs roses, feuilles souvent maculées, tige carrée|commune locale
Lamier jaune|Lamium galeobdolon|Lamiaceae|Lamiales|Eudicotylédones|Bois frais, haies anciennes, sous-bois riches|G1|Fagetalia|Fleurs jaunes bilabiées, feuilles opposées parfois maculées|indicatrice forestière
Épiaire des marais|Stachys palustris|Lamiaceae|Lamiales|Eudicotylédones|Prairies humides, fossés, berges, mégaphorbiaies|E3/E5|Filipendulion / Calthion|Lamiaceae à fleurs pourpres, feuilles opposées, milieux humides|indicatrice humide
Clinopode commun|Clinopodium vulgare|Lamiaceae|Lamiales|Eudicotylédones|Ourlets secs, lisières, pelouses, talus|E5/E1|Trifolion medii|Fleurs roses en verticilles denses, feuilles opposées, odeur aromatique|indicatrice ourlet sec
Origan commun|Origanum vulgare|Lamiaceae|Lamiales|Eudicotylédones|Ourlets secs, pelouses, talus, lisières thermophiles|E5/E1|Trifolion medii / Mesobromion|Plante aromatique, fleurs roses en glomérules, bractées pourprées|commune sèche
Thym faux-pouliot|Thymus pulegioides|Lamiaceae|Lamiales|Eudicotylédones|Pelouses sèches, talus, prairies maigres|E1/E2|Mesobromion / Nardetea|Petit sous-arbrisseau aromatique, tiges rampantes, fleurs roses|indicatrice pelouse maigre
Bugrane rampante|Ononis repens|Fabaceae|Fabales|Eudicotylédones|Pelouses sèches, prairies maigres, talus calcaires|E1/E2|Mesobromion|Fabaceae basse, fleurs roses, tiges couchées, milieux secs|indicatrice pelouse sèche
Anthyllide vulnéraire|Anthyllis vulneraria|Fabaceae|Fabales|Eudicotylédones|Pelouses sèches, talus calcaires, prairies maigres|E1/E2|Mesobromion|Fleurs jaunes en têtes entourées de bractées, feuilles composées|indicatrice pelouse sèche
Ornithope délicat|Ornithopus perpusillus|Fabaceae|Fabales|Eudicotylédones|Pelouses sableuses acides, chemins, sols pauvres ouverts|E1/F4|Sedo-Scleranthetea|Petite Fabaceae, fleurs rosées, gousses articulées courbées|indicatrice sable acide
Genêt des teinturiers|Genista tinctoria|Fabaceae|Fabales|Eudicotylédones|Landes, prairies maigres, lisières acides|F4/E2|Molinion / Calluno-Ulicetea|Sous-arbrisseau non épineux, fleurs jaunes, sols pauvres|indicatrice maigre acide
Laîche glauque|Carex flacca|Cyperaceae|Poales|Monocotylédones|Pelouses, prairies maigres, suintements basiques|E1/E3|Mesobromion / Molinion|Feuilles glauques, épis femelles pendants, milieux maigres|indicatrice maigre
Laîche ovale|Carex leporina|Cyperaceae|Poales|Monocotylédones|Prairies fraîches, chemins humides, sols tassés|E3/E2|Cynosurion / Agrostietea|Épis ovales groupés, petite laîche des prairies fraîches|commune
Laîche noire|Carex nigra|Cyperaceae|Poales|Monocotylédones|Bas-marais, prairies humides acides, tourbières|D2/E3.4|Caricion fuscae|Laîche de milieux tourbeux pauvres, épis sombres|indicatrice tourbeuse
Laîche des bois|Carex sylvatica|Cyperaceae|Poales|Monocotylédones|Bois frais, ravins, haies ombragées|G1|Fagetalia|Laîche forestière, épis femelles fins pendants|indicatrice forestière
Laîche divisée|Carex divulsa|Cyperaceae|Poales|Monocotylédones|Chemins, haies, lisières, sols tassés frais|E5/J|Agrostietea / ourlets|Épis espacés sur tige grêle, milieux perturbés frais|commune
Jonc aggloméré|Juncus conglomeratus|Juncaceae|Poales|Monocotylédones|Prairies humides, fossés, sols acides à neutres|E3|Agrostietea / Calthion|Inflorescence compacte, tiges striées, touffes de zones humides|commune humide
Jonc grêle|Juncus tenuis|Juncaceae|Poales|Monocotylédones|Chemins forestiers, sols tassés humides, allées|J/G1|Polygono-Poetea|Petit jonc à feuilles basales, sols piétinés frais, exotique naturalisé|commune/naturalisée
Flouve à feuilles de phléole|Phleum bertolonii|Poaceae|Poales|Monocotylédones|Prairies maigres, pelouses, talus|E2/E1|Cynosurion|Proche de Phleum pratense, plus grêle, prairies maigres|à vérifier
Vulpie queue-de-rat|Vulpia myuros|Poaceae|Poales|Monocotylédones|Sols secs ouverts, friches, pelouses sableuses|E1/J|Sedo-Scleranthetea|Petite graminée annuelle, panicule étroite, longues arêtes|commune sèche
Digitaire sanguine|Digitaria sanguinalis|Poaceae|Poales|Monocotylédones|Cultures, trottoirs, sables urbains, sols chauds|J/I1|Stellarietea mediae|Épis digitiformes, tiges couchées, graminée estivale rudérale|commune chaude
Sétaire verte|Setaria viridis|Poaceae|Poales|Monocotylédones|Cultures, friches, trottoirs, sols nus chauds|J/I1|Stellarietea mediae|Inflorescence cylindrique hérissée de soies vertes|commune chaude
Panic pied-de-coq|Echinochloa crus-galli|Poaceae|Poales|Monocotylédones|Cultures, vases, fossés, sols humides remaniés|J/C3|Bidention / Stellarietea|Grande graminée annuelle, panicule à épillets aristés, milieux humides perturbés|commune
`.trim().split('\n');
let next=Math.max(...DATA.plants.map(p=>p.id||0))+1;
rows.forEach(r=>{let a=r.split('|');if(DATA.plants.some(p=>p.latin===a[1]))return;DATA.plants.push({id:next++,fr:a[0],latin:a[1],family:a[2],classif:{ordre:a[3],classe:a[4],famille:a[2]},biotope:a[5],habitat:a[5],eunis:a[6],syntaxon:a[7],criteria:a[8],status:a[9]||'commune',confusions:'À vérifier avec flore locale si doute.',ecology:a[5]})});
DATA.plants.sort((a,b)=>a.fr.localeCompare(b.fr,'fr')).forEach((p,i)=>p.id=i+1);
})();
