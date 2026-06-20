// Botadex : parcours apprendre plus complet et plus professionnel.
(function(){
const modules=[['Bases de botanique','Port, racine, tige, feuille, fleur, fruit, habitat.','Decrire une plante en 6 criteres observables.'],['Morphologie vegetative','Limbe, petiole, stipule, gaine, nervation, marge, pilosite.','Comparer une feuille petiolee, sessile et engainante.'],['Morphologie florale','Calice, corolle, etamines, pistil, ovaire, fruit.','Observer une fleur de face et de profil.'],['Grandes familles','Asteraceae, Poaceae, Cyperaceae, Juncaceae, Fabaceae, Rosaceae, Orchidaceae.','Justifier une famille avec deux criteres.'],['Utiliser une flore','Suivre une cle avec des caracteres observes, pas avec une intuition.','Noter les bifurcations et les doutes.'],['Ecologie vegetale','Sol, eau, lumiere, pH, trophie et cortege.','Lister les especes indicatrices d une prairie humide.'],['Habitats EUNIS','Structure, cortege, hydrologie, gestion, degradation.','Justifier E2, E3 ou D5.'],['Phytosociologie','Cortege, caracteristique, differentielle, compagne, alliance.','Comparer Molinion et Juncion.'],['Terrain pro','Releve homogene, surface, strates, Braun-Blanquet, GPS, photos.','Faire une fiche releve complete.'],['Bioevaluation','Statuts, rarete, typicite, etat, fonctionnalite, pressions.','Rediger un niveau d enjeu justifie.']];
const families=[['Asteraceae','Capitule, involucre, fleurs ligulees ou tubulees, akenes.'],['Poaceae','Gaine, ligule, noeuds, epillets, glumes, lemmes.'],['Cyperaceae','Tige souvent triangulaire, feuilles en trois rangs, utricules chez Carex.'],['Juncaceae','Tiges joncoides, fleurs a six tepales, capsules.'],['Fabaceae','Fleur papilionacee, feuilles composees, stipules, gousses.'],['Lamiaceae','Tige carree, feuilles opposees, fleurs bilabiees, odeur frequente.'],['Apiaceae','Ombelles, feuilles divisees, fruits a cotes, ovaire infere.'],['Orchidaceae','Labelle, ovaire infere, fleur zygomorphe, feuilles entieres.']];
const quiz=[['Capitule + involucre + akenes','Asteraceae'],['Gaine + ligule + epillets','Poaceae'],['Tige souvent triangulaire + utricules','Carex / Cyperaceae'],['Molinia + Succisa + Carex panicea','Prairie humide oligotrophe / Molinion'],['Phragmites ou Typha dominants','Roseliere / D5'],['Dominante = caracteristique ?','Non'],['Urtica + Galium aparine','Ourlet ou friche nitrophile'],['Braun-Blanquet 3','25 a 50 % de recouvrement']];
const keys=['Fleur en capitule -> Asteraceae','Tige carree + feuilles opposees -> souvent Lamiaceae','Epillets + ligule -> Poaceae','Utricules -> Carex','Tepales discrets + capsule -> Juncaceae','Sous-arbrisseau acidiphile -> lande/Ericaceae','Labelle -> Orchidaceae','Eau stagnante -> C1','Courant -> C2','Prairie humide -> E3','Molinia + Succisa -> E3.4','Grands helophytes -> D5'];
const errors=['Identifier uniquement a la couleur de la fleur','Confondre dominante et caracteristique','Faire un releve sur une station heterogene','Oublier sol, hydrologie et gestion','Oublier les statuts officiels','Sur-affirmer un syntaxon','Ne pas photographier le fruit','Ne pas noter les incertitudes'];
const sources=['INPN et TAXREF : noms et statuts','CBN de Brest : flore et validation locale','DREAL Pays de la Loire : zonages et reglementation','EUNIS et HabRef : habitats','Cahiers habitats Natura 2000 : correspondances','Listes rouges : rarete et menace','DOCOB Natura 2000 : enjeux locaux'];
function grid(title,arr){return '<section class="card span-12"><h3>'+title+'</h3><div class="class-grid">'+arr.map(x=>Array.isArray(x)?'<div class="class-card"><b>'+x[0]+'</b><p>'+x.slice(1).join('<br>')+'</p></div>':'<div class="class-card"><p>'+x+'</p></div>').join('')+'</div></section>'}
const oldLearn=learn;
learn=function(){
 const all=['Parcours','Glossaire','Physiologie','Sols','Flashcards','Pro','Master','Familles','Cle terrain','Quiz','Erreurs','Sources'];
 if(['Master','Familles','Cle terrain','Quiz','Erreurs','Sources'].includes(state.learn)){
  title('Apprendre','Parcours complet botanique, EUNIS, phyto et metier.');
  let h=tabs(all,state.learn,'setLearn')+'<div class="grid">';
  if(state.learn==='Master')h+=grid('Parcours en 10 modules',modules);
  if(state.learn==='Familles')h+=grid('Familles prioritaires',families);
  if(state.learn==='Cle terrain')h+=grid('Mini-cles rapides',keys);
  if(state.learn==='Quiz')h+=grid('Quiz express avec correction',quiz);
  if(state.learn==='Erreurs')h+=grid('Erreurs frequentes',errors);
  if(state.learn==='Sources')h+=grid('Sources a consulter avant conclusion pro',sources);
  view.innerHTML=h+'</div>';
 } else oldLearn();
};
setLearn=function(x){state.learn=x;learn()};
})();