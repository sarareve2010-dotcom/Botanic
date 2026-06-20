# Audit pro Botadex

## Etat general
Botadex est une application statique GitHub Pages deja utilisable pour apprendre la botanique, explorer des plantes, travailler les habitats EUNIS, la phytosociologie, les releves terrain, la bioevaluation et la progression personnelle.

Note globale actuelle estimee : 73/100.

## Points forts
- Application publiee en statique, compatible GitHub Pages.
- Navigation simple : Accueil, Apprendre, Explorer, Terrain, Profil.
- Galerie de six photos par plante avec photo de couverture.
- Progression locale, notes et sauvegarde JSON.
- Modules EUNIS, phytosociologie, bioevaluation, cas pratiques.
- Ajouts professionnels : pro-data, pro-ui, plant-pro, crosslinks.
- Classement taxonomique et criteres pour les fiches reelles.
- Liens internes entre plantes, habitats, syntaxons et glossaire.

## Points faibles
- Les 1500 entrees sont un catalogue de travail, pas 1500 fiches botaniques validees une par une.
- La partie apprendre doit encore devenir plus progressive et interactive.
- Les quiz restent simples.
- Les cles de determination sont encore pedagogiques, pas une vraie flore interactive.
- Les statuts de protection doivent rester relies aux sources officielles.
- Les photos sont stockees en localStorage, limite pour un usage lourd.

## Priorites urgentes
1. Enrichir progressivement les 100 especes les plus courantes autour d Angers.
2. Ajouter pour chaque vraie fiche : floraison, fruit, feuille, tige, habitat, sol, humidite, pH, lumiere, trophie, confusions, statut, source.
3. Ajouter un vrai parcours Apprendre : morphologie, familles, flore, EUNIS, phyto, terrain, rapport.
4. Renforcer les exports terrain : CSV et GeoJSON.
5. Ajouter une page Sources officielle.

## Priorites importantes
- Ajouter des schemas botaniques.
- Ajouter des quiz par niveau.
- Ajouter des cas pratiques corriges avec releves.
- Ajouter un mode revision espacee.
- Ajouter une verification des liens internes dans Profil ou Terrain Pro.

## Bonus
- IndexedDB pour stocker les photos.
- Carte terrain.
- Export rapport automatique.
- Mode sombre.
- Vraie cle multicriteres.

## Verification liens internes
Le fichier crosslinks.js relie deja les noms de plantes, habitats, syntaxons et termes de glossaire aux sections correspondantes. A verifier sur GitHub Pages apres Ctrl+F5.

## Conclusion
Botadex est maintenant une base solide mais pas encore une application professionnelle finale. Elle est tres utile pour apprendre et structurer le travail de future chargee d etude flore-habitats. Le prochain vrai saut qualitatif consiste a valider et enrichir les fiches especes une par une avec des sources botaniques fiables.