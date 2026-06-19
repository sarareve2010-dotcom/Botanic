
function goTab(tab){
  const btn=document.querySelector(`[data-tab="${tab}"]`);
  if(btn) btn.click();
  window.scrollTo({top:0,behavior:'smooth'});
}
function renderHomeStats(){
  if(!document.getElementById('homeKnown')) return;
  const k=PLANTS.filter(p=>["known","mastered"].includes(getStatus(p.id))).length;
  homeKnown.textContent=k;
  homeTotal.textContent=PLANTS.length;
  homeLevel.textContent=lvl(k);
}

const statuses=[["unknown","⬜","Pas encore"],["seen","👀","Vue"],["progress","🔄","En progression"],["known","✅","Connue"],["mastered","⭐","Maîtrisée"]];
let progress=JSON.parse(localStorage.getItem("botadexProgressV4")||localStorage.getItem("botadexProgressV3")||"{}");let notes=JSON.parse(localStorage.getItem("botadexNotesV4")||"{}");let surveys=JSON.parse(localStorage.getItem("botadexSurveysV4")||"[]");let db=null,deferredPrompt=null;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;installBtn.hidden=false});installBtn.onclick=()=>{if(deferredPrompt){deferredPrompt.prompt();deferredPrompt=null}};
function openDB(){return new Promise((res,rej)=>{let r=indexedDB.open("botadexPhotosV4",1);r.onupgradeneeded=e=>e.target.result.createObjectStore("photos");r.onsuccess=e=>{db=e.target.result;res(db)};r.onerror=rej})}
function putPhoto(k,d){return new Promise(res=>{let tx=db.transaction("photos","readwrite");tx.objectStore("photos").put(d,k);tx.oncomplete=res})}
function getPhoto(k){return new Promise(res=>{let tx=db.transaction("photos","readonly");let r=tx.objectStore("photos").get(k);r.onsuccess=()=>res(r.result||"")})}
function resize(file){return new Promise(resolve=>{let img=new Image(),rd=new FileReader();rd.onload=e=>{img.onload=()=>{let c=document.createElement("canvas"),max=1000,sc=Math.min(1,max/Math.max(img.width,img.height));c.width=img.width*sc;c.height=img.height*sc;c.getContext("2d").drawImage(img,0,0,c.width,c.height);resolve(c.toDataURL("image/jpeg",0.78))};img.src=e.target.result};rd.readAsDataURL(file)})}
function save(){localStorage.setItem("botadexProgressV4",JSON.stringify(progress));localStorage.setItem("botadexNotesV4",JSON.stringify(notes));localStorage.setItem("botadexSurveysV4",JSON.stringify(surveys))}
function getStatus(id){return progress[id]?.status||"unknown"}function setStatus(id,s){progress[id]=progress[id]||{};progress[id].status=s;save();render()}function em(id){return statuses.find(x=>x[0]===getStatus(id))?.[1]||"⬜"}function lvl(n){if(n>=1000)return"Expert flore Anjou";if(n>=700)return"Très solide terrain";if(n>=450)return"Chargée d’étude junior";if(n>=250)return"Botaniste terrain";if(n>=100)return"Naturaliste";return"Débutante botanique"}
function renderStats(){total.textContent=PLANTS.length;seen.textContent=PLANTS.filter(p=>["seen","progress","known","mastered"].includes(getStatus(p.id))).length;progressing.textContent=PLANTS.filter(p=>getStatus(p.id)==="progress").length;known.textContent=PLANTS.filter(p=>["known","mastered"].includes(getStatus(p.id))).length;mastered.textContent=PLANTS.filter(p=>getStatus(p.id)==="mastered").length;let k=PLANTS.filter(p=>["known","mastered"].includes(getStatus(p.id))).length,pct=Math.round(k/1000*100);progressBar.style.width=pct+"%";levelName.textContent=lvl(k);progressText.textContent=`${k} / 1000 plantes connues (${pct} %)`}function populateFamilies(){let cur=familyFilter.value,fam=[...new Set(PLANTS.map(p=>p.family))].sort();familyFilter.innerHTML='<option value="">Toutes familles</option>'+fam.map(f=>`<option value="${f}">${f}</option>`).join("");familyFilter.value=cur}
function renderList(){let q=search.value.toLowerCase(),fam=familyFilter.value,stat=statusFilter.value;let list=PLANTS.filter(p=>{let text=`${p.fr} ${p.latin} ${p.family} ${p.habitat} ${p.tags.join(" ")} ${p.phytosociology} ${p.eunis}`.toLowerCase();return(!q||text.includes(q))&&(!fam||p.family===fam)&&(!stat||getStatus(p.id)===stat)});plantList.innerHTML=list.map(p=>`<article class="plant ${p.special||''}"><div class="thumb" id="thumb-${p.id}">🌿</div><div class="plant-head"><div class="plant-check">${em(p.id)}</div><div><h3>${p.id}. ${p.fr}</h3><div class="latin">${p.latin}</div></div></div><div class="badges"><span class="badge">${p.family}</span>${p.special==='protected'?'<span class="badge prot">protégée/patrimoniale</span>':''}${p.special==='invasive'?'<span class="badge inv">invasive</span>':''}${p.tags.slice(0,3).map(t=>`<span class="badge">${t}</span>`).join("")}</div><p>${p.short}</p><p class="phyto-mini"><b>Phyto :</b> ${p.phytosociology}</p><div class="status-row">${statuses.map(([s,e,l])=>`<button title="${l}" class="${getStatus(p.id)===s?'selected':''}" onclick="setStatus(${p.id},'${s}')">${e}</button>`).join("")}</div><button class="detail" onclick="openPlant(${p.id})">Voir plus / photos / commentaire</button></article>`).join("")}
async function openPlant(id){let p=PLANTS.find(x=>x.id===id);let ph=[];for(let i=1;i<=6;i++)ph.push(await getPhoto(`p${id}-${i}`));dialogContent.innerHTML=`<h2>${p.fr}</h2><p class="latin">${p.latin}</p><p><b>Famille :</b> ${p.family}</p><p><b>Ton statut :</b> ${em(p.id)} ${statuses.find(x=>x[0]===getStatus(p.id))?.[2]}</p><div class="photo-grid">${ph.map((x,i)=>`<div class="photo-box"><b>Photo ${i+1}</b><br>${x?`<img src="${x}">`:"<p>Aucune photo</p>"}<input type="file" accept="image/*" onchange="savePlantPhoto(${id},${i+1},this.files[0])"></div>`).join("")}</div><hr><p><b>Critères :</b> ${p.criteria}</p><p><b>Confusions :</b> ${p.confusions}</p><p><b>Milieu :</b> ${p.habitat}</p><p><b>Phytosociologie :</b> ${p.phytosociology}</p><p><b>EUNIS :</b> ${p.eunis}</p><p><b>Statut :</b> ${p.status}</p><label><b>Commentaires personnels :</b></label><textarea class="comment" oninput="saveNote(${id},this.value)">${notes[id]||""}</textarea>`;plantDialog.showModal()}
async function savePlantPhoto(id,n,file){
  if(!file)return;
  let data=await resize(file);
  await putPhoto(`p${id}-${n}`,data);
  if(n===1){ setTimeout(()=>{render();renderProtected();renderInvasives();renderEnjeux();setupVisualKey(); if(document.getElementById('runKey')) runKey.onclick=runExpertKey; if(document.getElementById('runEnjeu')) runEnjeu.onclick=runEnjeuEval;loadThumbs();},120); }
  openPlant(id);
}
function saveNote(id,v){notes[id]=v;save()}window.openPlant=openPlant;window.setStatus=setStatus;window.savePlantPhoto=savePlantPhoto;window.saveNote=saveNote;
async function loadThumbs(){
  if(!db) return;
  const visible=[...document.querySelectorAll('[id^="thumb-"]')].slice(0,200);
  for(const el of visible){
    const id=el.id.replace('thumb-','');
    const ph=await getPhoto(`p${id}-1`);
    if(ph) el.innerHTML=`<img src="${ph}" alt="photo plante">`;
  }
}
function render(){renderStats();renderList();renderLearning();setTimeout(loadThumbs,80)}document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab,.panel").forEach(x=>x.classList.remove("active"));b.classList.add("active");document.getElementById(b.dataset.tab).classList.add("active")});[search,familyFilter,statusFilter].forEach(e=>e.oninput=renderList);closeDialog.onclick=()=>plantDialog.close();
runKey.onclick=()=>{let scores={};function add(f,n){scores[f]=(scores[f]||0)+n} if(k_cap.checked)add("Asteraceae",5); if(k_cross.checked)add("Brassicaceae",5); if(k_pea.checked)add("Fabaceae",5); if(k_umbel.checked)add("Apiaceae",5); if(k_bilab.checked||k_square.checked&&k_opp.checked)add("Lamiaceae",5); if(k_gram.checked)add("Poaceae",3),add("Cyperaceae",3),add("Juncaceae",3); if(k_tri.checked)add("Cyperaceae",6); if(k_latex.checked)add("Asteraceae",2),add("Euphorbiaceae",4); if(k_comp.checked&&k_5pet.checked)add("Rosaceae",3); if(k_spines.checked)add("Rosaceae",3),add("Fabaceae",2); if(k_woody.checked)add("Rosaceae",2),add("Salicaceae",2),add("Fagaceae",1),add("Betulaceae",1); if(k_fern.checked)add("Dryopteridaceae",3),add("Aspleniaceae",3),add("Equisetaceae",3); if(k_wet.checked)add("Cyperaceae",2),add("Juncaceae",2),add("Lythraceae",1); let arr=Object.entries(scores).sort((a,b)=>b[1]-a[1]).slice(0,8);keyResult.innerHTML=arr.length?"<h3>Familles probables</h3>"+arr.map(([f,s])=>`<p><b>${f}</b> — score ${s}<br><small>${PLANTS.filter(p=>p.family===f).slice(0,10).map(p=>p.fr).join(", ")}</small></p>`).join(""):"<p>Coche quelques critères observables.</p>"}
function doQuiz(){quizFeedback.textContent="";let p=PLANTS[Math.floor(Math.random()*PLANTS.length)],m=["family","latin","phyto"][Math.floor(Math.random()*3)],correct,question,pool;if(m==="family"){question=`Quelle est la famille de : ${p.fr} ?`;correct=p.family;pool=PLANTS.map(x=>x.family)}else if(m==="latin"){question=`Quel est le nom latin de : ${p.fr} ?`;correct=p.latin;pool=PLANTS.map(x=>x.latin)}else{question=`Repère phytosociologique probable pour : ${p.fr} ?`;correct=p.phytosociology;pool=PLANTS.map(x=>x.phytosociology)}let options=[...new Set([correct,...pool.sort(()=>Math.random()-.5).slice(0,8)])].slice(0,4).sort(()=>Math.random()-.5);quizQuestion.textContent=question;quizOptions.innerHTML=options.map(o=>`<button>${o}</button>`).join("");quizOptions.querySelectorAll("button").forEach(b=>b.onclick=()=>{if(b.textContent===correct){b.classList.add("good");quizFeedback.textContent="✅ Oui !"}else{b.classList.add("bad");quizFeedback.textContent=`❌ Réponse : ${correct}`}})}newQuiz.onclick=doQuiz;
const GLOSSARY = [["Actinomorphe", "Fleur à symétrie radiale : on peut la couper selon plusieurs plans identiques."], ["Zygomorphe", "Fleur à symétrie bilatérale : un seul plan de symétrie, fréquent chez Fabaceae, Lamiaceae, Orchidaceae."], ["Dialypétale", "Pétales libres entre eux."], ["Gamopétale", "Pétales soudés entre eux, formant souvent un tube ou une corolle en cloche."], ["Tépales", "Pièces florales non différenciées en sépales et pétales."], ["Bractée", "Petite feuille modifiée associée à une fleur ou une inflorescence."], ["Calicule", "Petit verticille de bractées sous le calice, fréquent chez certaines Malvaceae/Rosaceae."], ["Ovaire supère", "Ovaire situé au-dessus de l’insertion des sépales/pétales/étamines."], ["Ovaire infère", "Ovaire situé sous l’insertion des pièces florales, comme chez beaucoup d’Apiaceae."], ["Capitule", "Inflorescence compacte typique des Asteraceae, mimant parfois une seule fleur."], ["Ombelle", "Inflorescence où les pédicelles partent d’un même point, typique des Apiaceae."], ["Grappe", "Inflorescence allongée avec fleurs pédicellées sur un axe principal."], ["Épi", "Inflorescence allongée avec fleurs sessiles ou presque sessiles."], ["Panicule", "Inflorescence ramifiée, fréquente chez beaucoup de Poaceae."], ["Cyme", "Inflorescence où l’axe principal se termine par une fleur."], ["Chaton", "Inflorescence souvent pendante, à fleurs réduites, fréquente chez saules, noisetiers, bouleaux."], ["Limbe", "Partie élargie de la feuille."], ["Pétiole", "Partie rétrécie reliant le limbe à la tige."], ["Sessile", "Sans pétiole ou pédoncule apparent."], ["Stipule", "Appendice à la base du pétiole, important chez Rosaceae, Fabaceae, Polygonaceae."], ["Ochréa", "Gaine membraneuse entourant la tige au niveau du nœud, typique de beaucoup de Polygonaceae."], ["Feuille simple", "Feuille avec un seul limbe non divisé en folioles."], ["Feuille composée", "Feuille divisée en folioles."], ["Pennée", "Disposition de folioles ou nervures de part et d’autre d’un axe."], ["Palmée", "Disposition rayonnante depuis un même point, comme une main."], ["Opposées", "Deux feuilles insérées face à face au même nœud."], ["Alternes", "Une seule feuille par nœud, alternant le long de la tige."], ["Verticillées", "Plus de deux feuilles insérées au même niveau autour de la tige."], ["Rosette", "Feuilles regroupées à la base de la plante."], ["Lancéolé", "Limbe en forme de lance, plus long que large, rétréci aux deux extrémités."], ["Elliptique", "Limbe ovale régulier, plus large au milieu."], ["Oblong", "Limbe allongé avec bords presque parallèles."], ["Réniforme", "En forme de rein."], ["Hasté", "En forme de fer de lance, avec deux lobes basaux divergents."], ["Sagitté", "En forme de flèche, avec lobes basaux dirigés vers le bas."], ["Cordé", "En forme de cœur à la base."], ["Marge entière", "Bord du limbe sans dents ni lobes."], ["Marge dentée", "Bord avec dents assez nettes."], ["Marge crénelée", "Bord avec dents arrondies."], ["Marge serrée", "Bord avec petites dents orientées vers l’avant."], ["Marge lobée", "Bord découpé en lobes."], ["Tige quadrangulaire", "Tige à section carrée, fréquente chez Lamiaceae."], ["Tige trigone", "Tige à trois angles, fréquente chez Cyperaceae."], ["Tige cannelée", "Tige présentant des sillons longitudinaux."], ["Tige ailée", "Tige avec expansions en forme d’ailes."], ["Glabre", "Sans poils."], ["Pubescent", "Couvert de poils fins."], ["Hirsute", "Couvert de poils longs et raides."], ["Tomenteux", "Couvert de poils denses donnant un aspect feutré."], ["Glanduleux", "Portant des poils ou glandes sécrétrices."], ["Latex", "Liquide souvent blanc s’écoulant à la cassure, utile chez Euphorbia, Sonchus, Lactuca."], ["Aiguillon", "Structure piquante issue de l’épiderme, détachable, comme chez la ronce/rosier."], ["Épine", "Organe transformé en pointe piquante, plus intégré à la plante."], ["Silique", "Fruit allongé des Brassicaceae."], ["Silicule", "Fruit court des Brassicaceae."], ["Gousse", "Fruit des Fabaceae."], ["Akène", "Fruit sec indéhiscent à une graine, fréquent chez Asteraceae/Ranunculaceae."], ["Capsule", "Fruit sec s’ouvrant à maturité."], ["Drupe", "Fruit charnu à noyau."], ["Baie", "Fruit charnu à graines incluses dans la pulpe."], ["Samare", "Fruit sec ailé, comme chez érables/frênes."], ["Ligule", "Petite membrane ou rangée de poils entre gaine et limbe chez les Poaceae."], ["Gaine", "Base de la feuille entourant la tige, importante chez graminoïdes."], ["Auricules", "Petites oreillettes à la base du limbe chez certaines Poaceae."], ["Épillet", "Unité élémentaire de l’inflorescence des Poaceae/Cyperaceae."], ["Glume", "Bractée basale d’un épillet de Poaceae."], ["Lemme", "Bractée entourant la fleur chez les Poaceae."], ["Paléole", "Bractée interne de la fleur chez les Poaceae."], ["Arête", "Prolongement filiforme d’une glume ou lemme."], ["Utricule", "Enveloppe autour de l’akène chez Carex."], ["Style bifide", "Style divisé en deux branches, critère utile chez Carex."], ["Style trifide", "Style divisé en trois branches, critère utile chez Carex."], ["Hélophyte", "Plante enracinée dans l’eau ou sol gorgé d’eau, avec partie aérienne émergée."], ["Hydrophyte", "Plante aquatique vivant totalement ou partiellement dans l’eau."], ["Thérophyte", "Plante annuelle passant la mauvaise saison sous forme de graine."], ["Hémicryptophyte", "Plante vivace avec bourgeons au niveau du sol."], ["Géophyte", "Plante vivace avec organe souterrain : bulbe, rhizome, tubercule."], ["Phanérophyte", "Arbre ou arbuste avec bourgeons portés haut."], ["Nitrophile", "Qui apprécie les sols riches en azote."], ["Acidiphile", "Qui préfère les sols acides."], ["Calcicole", "Qui préfère les sols riches en calcaire."], ["Hygrophile", "Qui préfère les milieux humides."], ["Xérophile", "Qui supporte les milieux secs."], ["Oligotrophe", "Milieu pauvre en nutriments."], ["Mésotrophe", "Milieu moyennement riche en nutriments."], ["Eutrophe", "Milieu riche en nutriments."], ["Dystrophe", "Milieu pauvre/minéralement déséquilibré, souvent brunâtre par matières humiques."], ["Mégaphorbiaie", "Formation de grandes herbacées hautes en milieu frais à humide."], ["Roselière", "Formation dominée par de grands hélophytes comme Phragmites."], ["Magnocariçaie", "Formation dominée par de grandes laîches."], ["Ourlet", "Végétation de transition entre milieu ouvert et boisé."], ["Manteau arbustif", "Végétation arbustive en lisière ou haie."]];
function renderGlossary(){
  const q=(document.getElementById('glossSearch')?.value||'').toLowerCase();
  const data=GLOSSARY.filter(([t,d])=>(t+' '+d).toLowerCase().includes(q));
  glossaryList.innerHTML=data.map(([t,d])=>`<div class="gloss-card"><b>${t}</b><p>${d}</p></div>`).join('');
}



function renderSurveys(){surveyList.innerHTML=surveys.map((s,i)=>`<div class="box"><b>${s.title}</b><p>${s.text.replaceAll("\\n","<br>")}</p><button onclick="surveys.splice(${i},1);save();renderSurveys()">Supprimer</button></div>`).join("")}saveSurvey.onclick=()=>{surveys.push({title:surveyTitle.value||"Relevé sans titre",text:surveyText.value,date:new Date().toISOString()});surveyTitle.value="";surveyText.value="";save();renderSurveys()};renderSurveys();
exportBtn.onclick=()=>exportBox.value=JSON.stringify({progress,notes,surveys});importBtn.onclick=()=>{try{let o=JSON.parse(exportBox.value||"{}");progress=o.progress||{};notes=o.notes||{};surveys=o.surveys||[];save();render();renderSurveys();alert("Importé")}catch(e){alert("Sauvegarde invalide")}};

const SYNTAXONS = [{"id": "MOLINION", "name": "Molinion caeruleae", "rank": "Alliance", "class": "Molinio-Arrhenatheretea", "order": "Molinietalia caeruleae", "habitat": "Prairies humides oligotrophes à méso-oligotrophes", "eunis": "Principalement E3 prairies humides, à préciser selon structure et cortège", "description": "Prairies humides peu à moyennement fertilisées, souvent sur sols acides à neutres, avec engorgement saisonnier. Végétation souvent riche, peu nitrophile, à graminées fines, joncs et dicotylédones hygrophiles.", "structure": "Strate herbacée dense, souvent 40 à 100 cm. Peu ou pas de ligneux si gestion par fauche/pâturage extensif.", "soil": "Sol hydromorphe, oligotrophe à mésotrophe, acide à neutre.", "characteristic": ["Molinia caerulea", "Succisa pratensis", "Juncus acutiflorus", "Carex panicea", "Lotus pedunculatus", "Cirsium dissectum"], "differential": ["faible nitrophilie", "flore hygrophile diversifiée", "absence de dominance de grandes nitrophiles"], "confusions": "À distinguer des prairies humides eutrophes, mégaphorbiaies et bas-marais. Vérifier la trophie, la hauteur de végétation et le cortège complet."}, {"id": "CALTHION", "name": "Calthion palustris", "rank": "Alliance", "class": "Molinio-Arrhenatheretea", "order": "Molinietalia caeruleae", "habitat": "Prairies humides eutrophes à mésotrophes", "eunis": "E3 prairies humides", "description": "Prairies humides plus productives, souvent fauchées ou pâturées, sur sols frais à engorgés, généralement plus riches que les prairies du Molinion.", "structure": "Strate herbacée moyenne à haute, biomasse plus importante, graminées et grandes dicotylédones fréquentes.", "soil": "Sol humide, mésotrophe à eutrophe, souvent alluvial ou enrichi.", "characteristic": ["Caltha palustris", "Lychnis flos-cuculi", "Juncus effusus", "Rumex acetosa", "Holcus lanatus", "Ranunculus acris"], "differential": ["forte productivité", "espèces prairiales communes humides", "moins oligotrophe"], "confusions": "Peut être confondu avec mégaphorbiaie si abandon de gestion, ou prairie mésophile si humidité peu visible."}, {"id": "PHRAGMITION", "name": "Phragmition australis", "rank": "Alliance", "class": "Phragmito australis-Magnocaricetea elatae", "order": "Phragmitetalia australis", "habitat": "Roselières", "eunis": "D5 roselières / C3 ceintures de végétation aquatique selon contexte", "description": "Ceintures de grands hélophytes en bord d’eau, fossés, mares, étangs ou marais, souvent dominées par une ou quelques grandes espèces.", "structure": "Végétation haute, dense, souvent monospécifique ou paucispécifique.", "soil": "Sol engorgé à inondé, vaseux ou organique, eutrophe à mésotrophe.", "characteristic": ["Phragmites australis", "Typha latifolia", "Typha angustifolia", "Sparganium erectum", "Schoenoplectus lacustris"], "differential": ["grands hélophytes", "bord d’eau", "végétation haute dense"], "confusions": "À distinguer des magnocariçaies dominées par Carex élevés et des mégaphorbiaies humides non inondées."}, {"id": "MAGNOCARICION", "name": "Magnocaricion elatae", "rank": "Alliance", "class": "Phragmito australis-Magnocaricetea elatae", "order": "Magnocaricetalia", "habitat": "Magnocariçaies", "eunis": "D5 formations à grandes laîches", "description": "Végétations humides dominées par de grandes laîches, souvent en ceintures de marais, fossés, queues d’étangs ou dépressions engorgées.", "structure": "Touffes ou nappes de Carex élevés, hauteur souvent 50 cm à plus d’1 m.", "soil": "Sol très humide à inondable, souvent organique ou vaseux.", "characteristic": ["Carex acutiformis", "Carex riparia", "Carex paniculata", "Carex elata", "Carex vesicaria", "Carex rostrata"], "differential": ["dominance de grandes Cyperaceae", "tiges trigones", "sol engorgé"], "confusions": "À distinguer des roselières à Phragmites/Typha et des prairies humides gérées."}, {"id": "ARRHENATHERION", "name": "Arrhenatherion elatioris", "rank": "Alliance", "class": "Molinio-Arrhenatheretea", "order": "Arrhenatheretalia elatioris", "habitat": "Prairies de fauche mésophiles", "eunis": "E2 prairies mésiques", "description": "Prairies mésophiles de fauche, généralement riches en graminées et dicotylédones prairiales, sur sols ni trop secs ni trop humides.", "structure": "Strate herbacée moyenne à haute, aspect prairial équilibré, floraison printanière à estivale.", "soil": "Sol mésotrophe à eutrophe, frais à mésophile.", "characteristic": ["Arrhenatherum elatius", "Dactylis glomerata", "Trifolium pratense", "Leucanthemum vulgare", "Centaurea jacea", "Knautia arvensis"], "differential": ["prairie fauchée", "cortège mésophile", "absence d’espèces franchement hygrophiles"], "confusions": "À distinguer des pâtures intensives, friches herbacées et prairies humides."}, {"id": "CYNOSURION", "name": "Cynosurion cristati", "rank": "Alliance", "class": "Molinio-Arrhenatheretea", "order": "Trifolio repentis-Phleetalia pratensis", "habitat": "Prairies pâturées mésophiles", "eunis": "E2 prairies mésiques pâturées", "description": "Prairies pâturées, souvent rases à moyennes, avec espèces tolérant le piétinement et le broutage.", "structure": "Végétation plus basse, hétérogène, présence de rosettes et espèces rampantes.", "soil": "Sol mésophile à frais, souvent enrichi par le pâturage.", "characteristic": ["Cynosurus cristatus", "Lolium perenne", "Trifolium repens", "Plantago lanceolata", "Bellis perennis", "Ranunculus repens"], "differential": ["pâturage", "espèces rampantes ou en rosette", "piétinement"], "confusions": "À distinguer des pelouses urbaines et prairies de fauche."}, {"id": "CALLUNO_ULICETEA", "name": "Calluno-Ulicetea", "rank": "Classe", "class": "Calluno-Ulicetea", "order": "Ulicetalia / Erico-Ulicetalia selon contexte", "habitat": "Landes atlantiques sèches à humides", "eunis": "F4 landes tempérées", "description": "Landes acidiphiles dominées par chaméphytes : callune, bruyères, ajoncs, parfois molinie. Très importantes en contexte armoricain et atlantique.", "structure": "Sous-arbrisseaux bas à moyens, parfois mosaïque avec molinie, ajonc ou jeunes ligneux.", "soil": "Sol acide, pauvre, oligotrophe, sec à humide selon type.", "characteristic": ["Calluna vulgaris", "Erica ciliaris", "Erica tetralix", "Ulex minor", "Ulex europaeus", "Molinia caerulea"], "differential": ["sol acide pauvre", "bruyères/ajoncs", "absence de cortège prairial eutrophe"], "confusions": "À distinguer des fourrés à ajoncs, moliniaies dégradées et boisements pionniers."}, {"id": "CRATAEGO_PRUNETEA", "name": "Crataego monogynae-Prunetea spinosae", "rank": "Classe", "class": "Crataego-Prunetea", "order": "Prunetalia spinosae", "habitat": "Haies, fourrés, manteaux arbustifs", "eunis": "F3 fourrés / FA haies", "description": "Végétations arbustives des haies, lisières, manteaux et recolonisations : ronces, aubépines, prunelliers, rosiers, cornouillers.", "structure": "Strate arbustive dominante, parfois lianes, ourlet herbacé associé.", "soil": "Très variable, souvent mésotrophe à eutrophe en bocage.", "characteristic": ["Crataegus monogyna", "Prunus spinosa", "Rosa canina agg.", "Rubus fruticosus agg.", "Cornus sanguinea", "Corylus avellana"], "differential": ["ligneux épineux ou arbustifs", "structure de haie/fourré", "lisière"], "confusions": "À distinguer d’un jeune boisement, d’une haie arborée mature ou d’un fourré humide à saules."}, {"id": "QUERCO_FAGETEA", "name": "Querco-Fagetea", "rank": "Classe", "class": "Querco-Fagetea", "order": "Fagetalia / Quercetalia selon contexte", "habitat": "Forêts feuillues tempérées", "eunis": "G1 forêts feuillues", "description": "Boisements feuillus caducifoliés, du chênaie-charmaie aux hêtraies et bois frais. Syntaxonomie à préciser selon sol, humidité et cortège de sous-bois.", "structure": "Strate arborée dominante, arbustive variable, strate herbacée souvent saisonnière.", "soil": "Acide à neutre, sec à frais selon type forestier.", "characteristic": ["Quercus robur", "Quercus petraea", "Fagus sylvatica", "Carpinus betulus", "Anemone nemorosa", "Hyacinthoides non-scripta"], "differential": ["strate arborée fermée", "espèces de sous-bois", "humus/litière"], "confusions": "À distinguer des haies arborées, plantations et boisements alluviaux."}, {"id": "STELLARIETEA", "name": "Stellarietea mediae", "rank": "Classe", "class": "Stellarietea mediae", "order": "Polygono-Chenopodietalia / Centaureetalia selon contexte", "habitat": "Adventices de cultures et friches annuelles", "eunis": "I1 cultures / habitats anthropisés", "description": "Végétations annuelles des sols remués : cultures, jardins, bords de champs, zones rudérales ouvertes.", "structure": "Strate basse à moyenne, annuelle, souvent discontinue, dépendant des perturbations.", "soil": "Sols perturbés, souvent enrichis.", "characteristic": ["Capsella bursa-pastoris", "Stellaria media", "Veronica persica", "Chenopodium album", "Papaver rhoeas", "Fumaria officinalis"], "differential": ["annuelles", "sol nu/remué", "contexte agricole ou urbain"], "confusions": "À distinguer des friches vivaces de l’Artemisietea."}, {"id": "ARTEMISIETEA", "name": "Artemisietea vulgaris", "rank": "Classe", "class": "Artemisietea vulgaris", "order": "Onopordetalia / Artemisietalia selon contexte", "habitat": "Friches vivaces rudérales", "eunis": "E5 friches herbacées", "description": "Végétations hautes de friches vivaces sur sols riches et perturbés : bords de routes, dépôts, terrains abandonnés.", "structure": "Herbacées hautes, souvent nitrophiles, biomasse importante.", "soil": "Sol eutrophe à très eutrophe, perturbé.", "characteristic": ["Artemisia vulgaris", "Urtica dioica", "Cirsium vulgare", "Dipsacus fullonum", "Tanacetum vulgare", "Arctium lappa"], "differential": ["vivaces hautes", "nitrophilie", "abandon/perturbation"], "confusions": "À distinguer des mégaphorbiaies humides naturelles ou semi-naturelles."}];
function renderSyntaxons(){
  const q=(document.getElementById('syntaxSearch')?.value||'').toLowerCase();
  const list=SYNTAXONS.filter(s=>JSON.stringify(s).toLowerCase().includes(q));
  syntaxonList.innerHTML=list.map(s=>`<div class="syntax-card">
    <h3>${s.name}</h3>
    <span class="syntax-rank">${s.rank}</span><span class="syntax-rank">${s.class}</span>
    <p><b>Habitat :</b> ${s.habitat}</p>
    <p><b>EUNIS :</b> ${s.eunis}</p>
    <p>${s.description}</p>
    <p><b>Structure :</b> ${s.structure}</p>
    <p><b>Sol :</b> ${s.soil}</p>
    <p><b>Confusions :</b> ${s.confusions}</p>
    <div class="syntax-species">${s.characteristic.map(x=>`<span>${x}</span>`).join('')}</div>
  </div>`).join('');
}
function runPhytoDiagnosis(){
  const raw=(phytoSpecies.value||'').toLowerCase();
  const entries=raw.split(/\n|,|;/).map(x=>x.trim()).filter(Boolean);
  let results=SYNTAXONS.map(s=>{
    let score=0, why=[];
    s.characteristic.forEach(sp=>{
      const low=sp.toLowerCase();
      if(entries.some(e=>low.includes(e)||e.includes(low))){score+=18; why.push('espèce indicatrice : '+sp);}
    });
    const blob=(s.habitat+' '+s.description+' '+s.structure+' '+s.soil).toLowerCase();
    if(ph_wet.checked && /humide|engorg|marais|eau|hélophyte|inond/.test(blob)){score+=10; why.push('milieu humide cohérent');}
    if(ph_oligo.checked && /oligo|pauvre|acide/.test(blob)){score+=10; why.push('trophie oligotrophe/acide cohérente');}
    if(ph_eutro.checked && /eutro|nitro|riche|productive/.test(blob)){score+=10; why.push('trophie eutrophe/nitrophile cohérente');}
    if(ph_meadow.checked && /prairie|fauche|pâtur/.test(blob)){score+=8; why.push('structure prairiale');}
    if(ph_reed.checked && /roseli|hélophyte|carex|laîche|typha|phragmites/.test(blob)){score+=12; why.push('grands hélophytes/cariçaie');}
    if(ph_wood.checked && /forêt|bois|arbor/.test(blob)){score+=12; why.push('structure boisée');}
    if(ph_hedge.checked && /haie|fourré|arbust/.test(blob)){score+=12; why.push('structure haie/fourré');}
    if(ph_heath.checked && /lande|bruyère|callune|ajonc|acide/.test(blob)){score+=12; why.push('lande acide');}
    if(ph_ruderal.checked && /friche|rudéral|culture|perturb/.test(blob)){score+=10; why.push('contexte rudéral/perturbé');}
    return {...s, score, why};
  }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,5);
  if(!results.length){phytoResult.innerHTML='<p>Ajoute quelques espèces ou critères écologiques.</p>';return;}
  const max=Math.max(...results.map(r=>r.score));
  phytoResult.innerHTML='<h3>Propositions</h3>'+results.map(r=>`<div class="score-card">
    <b>${r.name}</b><br><small>${r.rank} — ${r.class}</small>
    <div class="score-bar"><div style="width:${Math.round(r.score/max*100)}%"></div></div>
    <p><b>Habitat :</b> ${r.habitat}</p><p><b>EUNIS probable :</b> ${r.eunis}</p>
    <div class="why"><b>Pourquoi ?</b><br>${r.why.length?r.why.join('<br>'):'Correspondance écologique générale'}</div>
    <p><b>À vérifier :</b> ${r.confusions}</p>
  </div>`).join('');
}



const HABITATS = [{"code": "E1", "title": "Pelouses sèches", "description": "Végétations basses sur sols secs, souvent maigres, sableux ou calcaires. Faible productivité, espèces xérophiles.", "criteria": "Sol sec, végétation basse, graminées fines, annuelles, Fabaceae basses, absence d’espèces hygrophiles.", "plants": ["Festuca ovina", "Bromus erectus", "Aira praecox", "Vulpia myuros", "Pilosella officinarum", "Trifolium arvense", "Lotus corniculatus", "Plantago coronopus", "Thymus", "Sanguisorba minor"]}, {"code": "E2", "title": "Prairies mésophiles", "description": "Prairies ni franchement sèches ni franchement humides, souvent fauchées ou pâturées.", "criteria": "Strate herbacée continue, graminées prairiales, Fabaceae, Asteraceae, sol frais à mésophile.", "plants": ["Arrhenatherum elatius", "Dactylis glomerata", "Cynosurus cristatus", "Lolium perenne", "Trifolium pratense", "Trifolium repens", "Leucanthemum vulgare", "Centaurea jacea", "Plantago lanceolata", "Rumex acetosa"]}, {"code": "E3", "title": "Prairies humides", "description": "Prairies influencées par l’engorgement, une nappe ou des inondations temporaires.", "criteria": "Présence de joncs, laîches, hygrophiles ; sol frais à humide ; gestion par fauche ou pâturage possible.", "plants": ["Juncus effusus", "Juncus acutiflorus", "Carex panicea", "Carex hirta", "Lotus pedunculatus", "Lychnis flos-cuculi", "Cirsium dissectum", "Filipendula ulmaria", "Ranunculus repens", "Pulicaria dysenterica"]}, {"code": "E5", "title": "Ourlets et friches herbacées", "description": "Végétations hautes, souvent rudérales, de lisières, bords de chemins, dépôts ou terrains remaniés.", "criteria": "Grandes herbacées, nitrophiles, espèces vivaces ou annuelles de friches.", "plants": ["Urtica dioica", "Artemisia vulgaris", "Cirsium vulgare", "Dipsacus fullonum", "Tanacetum vulgare", "Arctium lappa", "Conyza canadensis", "Sonchus oleraceus", "Lactuca serriola", "Malva sylvestris"]}, {"code": "F3", "title": "Fourrés tempérés", "description": "Formations arbustives : prunelliers, aubépines, ronces, rosiers, saules selon l’humidité.", "criteria": "Dominance arbustive, recolonisation, manteau de lisière ou fourré dense.", "plants": ["Prunus spinosa", "Crataegus monogyna", "Rosa canina agg.", "Rubus fruticosus agg.", "Cornus sanguinea", "Corylus avellana", "Sambucus nigra", "Euonymus europaeus", "Salix cinerea", "Frangula alnus"]}, {"code": "FA", "title": "Haies", "description": "Linéaires arborés et/ou arbustifs du bocage, avec strates variables.", "criteria": "Structure linéaire, continuité écologique, présence possible d’arbres âgés, talus, ourlet herbacé.", "plants": ["Quercus robur", "Fraxinus excelsior", "Acer campestre", "Corylus avellana", "Crataegus monogyna", "Prunus spinosa", "Rosa canina agg.", "Rubus fruticosus agg.", "Hedera helix", "Lonicera periclymenum"]}, {"code": "F4", "title": "Landes tempérées", "description": "Landes acidiphiles à bruyères, callune, ajoncs, souvent sur sols pauvres.", "criteria": "Sous-arbrisseaux acidiphiles, sol oligotrophe, parfois humide avec Molinia.", "plants": ["Calluna vulgaris", "Erica ciliaris", "Erica tetralix", "Erica cinerea", "Ulex europaeus", "Ulex minor", "Genista anglica", "Molinia caerulea", "Potentilla erecta", "Juncus squarrosus"]}, {"code": "G1", "title": "Forêts feuillues", "description": "Boisements de feuillus caducifoliés : chênaies, hêtraies, bois frais, ripisylves selon contexte.", "criteria": "Strate arborée dominante, sous-bois, litière, espèces sciaphiles.", "plants": ["Quercus robur", "Quercus petraea", "Fagus sylvatica", "Carpinus betulus", "Fraxinus excelsior", "Anemone nemorosa", "Hyacinthoides non-scripta", "Arum maculatum", "Dryopteris filix-mas", "Hedera helix"]}, {"code": "C1", "title": "Eaux stagnantes", "description": "Mares, étangs, plans d’eau, végétation aquatique flottante ou enracinée.", "criteria": "Eau calme, hydrophytes, lentilles d’eau, potamots, ceintures amphibies.", "plants": ["Lemna minor", "Potamogeton natans", "Potamogeton crispus", "Callitriche stagnalis", "Alisma plantago-aquatica", "Sparganium erectum", "Typha latifolia", "Persicaria amphibia", "Eleocharis palustris", "Juncus articulatus"]}, {"code": "C2", "title": "Eaux courantes", "description": "Rivières, ruisseaux, fossés courants et berges associées.", "criteria": "Présence d’écoulement, végétation aquatique ou amphibie, berges fraîches.", "plants": ["Nasturtium officinale", "Veronica beccabunga", "Callitriche stagnalis", "Apium nodiflorum", "Berula erecta", "Glyceria fluitans", "Phalaris arundinacea", "Iris pseudacorus", "Mentha aquatica", "Lycopus europaeus"]}, {"code": "D5", "title": "Roselières et magnocariçaies", "description": "Grandes ceintures humides dominées par hélophytes ou grandes laîches.", "criteria": "Végétation haute, souvent dense, sol inondé ou engorgé.", "plants": ["Phragmites australis", "Typha latifolia", "Typha angustifolia", "Carex riparia", "Carex acutiformis", "Carex paniculata", "Schoenoplectus lacustris", "Sparganium erectum", "Iris pseudacorus", "Lythrum salicaria"]}, {"code": "I1", "title": "Cultures et jardins", "description": "Milieux fortement anthropisés, sols travaillés ou perturbés, cortèges d’adventices.", "criteria": "Sols nus ou remaniés, annuelles, adventices, rudérales.", "plants": ["Capsella bursa-pastoris", "Stellaria media", "Veronica persica", "Papaver rhoeas", "Chenopodium album", "Fumaria officinalis", "Euphorbia helioscopia", "Anagallis arvensis", "Sinapis arvensis", "Raphanus raphanistrum"]}];
function plantLink(name){
  const safe=name.replaceAll("'","’");
  return `<button class="plant-chip" onclick="search.value='${safe}'; document.querySelector('[data-tab=dex]').click(); renderList();">${name}</button>`;
}
function renderHabitats(){
  const q=(document.getElementById('habSearch')?.value||'').toLowerCase();
  const data=HABITATS.filter(h=>(h.code+' '+h.title+' '+h.description+' '+h.criteria+' '+h.plants.join(' ')).toLowerCase().includes(q));
  habitatList.innerHTML=data.map(h=>`<div class="hab-card">
    <div class="hab-code">${h.code}</div>
    <h3>${h.title}</h3>
    <p>${h.description}</p>
    <p><b>Critères terrain :</b> ${h.criteria}</p>
    <p><b>Plantes associées / repères :</b></p>
    <div class="plant-chip-list">${h.plants.map(plantLink).join('')}</div>
  </div>`).join('');
}


const SOILS = [["Texture", "Proportion sable / limon / argile. Influence rétention d’eau, aération et végétation.", "Test terrain : humidifier, rouler entre doigts. Sable = granuleux ; argile = plastique ; limon = doux farineux."], ["pH", "Acide, neutre ou basique. Très structurant pour la flore.", "Acidiphiles : Calluna, Erica, Molinia, Potentilla erecta. Calcicoles : Bromus erectus, Sanguisorba minor, certaines orchidées."], ["Trophie", "Richesse en nutriments : oligotrophe, mésotrophe, eutrophe.", "Oligotrophe = flore maigre et spécialisée ; eutrophe = nitrophiles, orties, grandes herbacées productives."], ["Hydromorphie", "Signes d’engorgement du sol par l’eau.", "Taches rouille/gris, gley, stagnation, joncs/laîches/hélophytes."], ["Humus", "Forme de matière organique en surface : mull, moder, mor.", "Mull = bonne décomposition, sols actifs ; mor = acide pauvre, litière épaisse."], ["Substrat", "Roche-mère ou matériau : schiste, granite, calcaire, alluvions, sable.", "Conditionne pH, drainage, flore acidiphile ou calcicole."], ["Gestion", "Fauche, pâturage, abandon, broyage, fertilisation.", "La gestion modifie structure, hauteur, cortège, enjeu et rattachement EUNIS."]];
function renderGroupList(targetId, tag){
  const el=document.getElementById(targetId);
  if(!el) return;
  const list=PLANTS.filter(p => (p.tags||[]).includes(tag));
  el.innerHTML=list.map(p=>`<span class="module-pill" onclick="search.value='${p.latin}'; document.querySelector('[data-tab=dex]').click(); renderList();">${p.fr} — <i>${p.latin}</i></span>`).join('');
}
function renderSoils(){
  if(!document.getElementById('soilList')) return;
  soilList.innerHTML=SOILS.map(([title,desc,test])=>`<div class="soil-card"><h3>${title}</h3><p>${desc}</p><p><b>Terrain :</b> ${test}</p></div>`).join('');
}


const PROTECTED_TAXA = [{"name": "Drosera rotundifolia", "fr": "Rossolis à feuilles rondes", "group": "Tourbières / bas-marais acides", "where": "Tourbières acides, gouilles, tapis de sphaignes, landes humides oligotrophes.", "criteria": "Petite plante carnivore en rosette ; feuilles rondes couvertes de poils glanduleux rougeâtres collants.", "confusion": "Ne pas confondre avec plantules rouges ou débris sur sphaignes. Vérifier rosette, poils glanduleux et milieu tourbeux.", "period": "Fin printemps à été.", "attention": "Très fort"}, {"name": "Osmunda regalis", "fr": "Osmonde royale", "group": "Fougère des milieux humides acides", "where": "Bois marécageux, fossés tourbeux, aulnaies humides, landes humides.", "criteria": "Grande fougère robuste ; frondes fertiles avec panicule brun-roux terminale.", "confusion": "Peu de confusion adulte ; vérifier fronde fertile et habitat très humide/acide.", "period": "Printemps-été.", "attention": "Fort"}, {"name": "Erica ciliaris", "fr": "Bruyère ciliée", "group": "Landes humides atlantiques", "where": "Landes humides acides avec Erica tetralix, Ulex minor, Molinia.", "criteria": "Fleurs roses en grappes, feuilles ciliées visibles à la loupe.", "confusion": "Avec Erica tetralix / cinerea. Vérifier cils foliaires, disposition des fleurs et humidité du milieu.", "period": "Été.", "attention": "Fort"}, {"name": "Erica tetralix", "fr": "Bruyère à quatre angles", "group": "Landes humides / tourbeuses", "where": "Landes humides, tourbières, sols acides engorgés.", "criteria": "Feuilles souvent par 4, fleurs roses en tête terminale.", "confusion": "Avec Erica ciliaris/cinerea ; vérifier verticilles de feuilles et tête florale terminale.", "period": "Été.", "attention": "Fort"}, {"name": "Anacamptis laxiflora", "fr": "Orchis à fleurs lâches", "group": "Orchidée de prairie humide", "where": "Prairies humides extensives, dépressions, sols frais à engorgés.", "criteria": "Inflorescence lâche, fleurs pourpres, labelle marqué.", "confusion": "Avec autres orchidées roses/pourpres ; vérifier inflorescence lâche, habitat humide et labelle.", "period": "Avril à juin.", "attention": "Fort"}, {"name": "Dactylorhiza maculata", "fr": "Orchis tacheté", "group": "Orchidée de landes/prairies humides", "where": "Prairies humides, landes, bas-marais, sols acides à frais.", "criteria": "Feuilles souvent tachetées, inflorescence rose à pourpre, labelle trilobé.", "confusion": "Complexe Dactylorhiza délicat : vérifier feuilles, labelle, éperon, habitat.", "period": "Mai à juillet.", "attention": "Modéré à fort"}, {"name": "Pilularia globulifera", "fr": "Pilulaire", "group": "Mares temporaires / berges exondées", "where": "Mares temporaires, vases exondées oligotrophes, landes humides.", "criteria": "Petite ptéridophyte à feuilles filiformes ; sporocarpes globuleux à la base.", "confusion": "Très discrète ; confusion avec jeunes joncs/graminoïdes. Chercher sporocarpes.", "period": "Vases exondées.", "attention": "Très fort"}, {"name": "Littorella uniflora", "fr": "Littorelle à une fleur", "group": "Rives oligotrophes amphibies", "where": "Berges sableuses ou graveleuses de mares/étangs oligotrophes, zones exondées.", "criteria": "Petite rosette de feuilles linéaires charnues, gazonnante sur rives pauvres.", "confusion": "Avec jeunes Plantago/isoétides ; vérifier contexte amphibie oligotrophe et rosette linéaire.", "period": "Été-exondation.", "attention": "Très fort"}, {"name": "Narcissus pseudonarcissus", "fr": "Jonquille sauvage", "group": "Bois frais / prairies fraîches", "where": "Bois clairs, prairies fraîches, talus, stations parfois localisées.", "criteria": "Fleur jaune avec trompette centrale, feuilles linéaires glauques.", "confusion": "Avec cultivars échappés ; noter naturalité, population, proximité jardins.", "period": "Fin hiver-printemps.", "attention": "À vérifier localement"}];
function renderProtected(){
  if(!document.getElementById('protectedList')) return;
  const q=(document.getElementById('protectedSearch')?.value||'').toLowerCase();
  const data=PROTECTED_TAXA.filter(x=>JSON.stringify(x).toLowerCase().includes(q));
  protectedList.innerHTML=data.map(x=>`<div class="protected-card">
    <div class="attention">${x.attention}</div>
    <h3>${x.fr}</h3>
    <p class="latin"><i>${x.name}</i></p>
    <p><b>Groupe / habitat :</b> ${x.group}</p>
    <p><b>Où chercher :</b> ${x.where}</p>
    <p><b>Critères déterminants :</b> ${x.criteria}</p>
    <p><b>Confusions à éviter :</b> ${x.confusion}</p>
    <p><b>Période :</b> ${x.period}</p>
    <button onclick="search.value='${x.name}'; document.querySelector('[data-tab=dex]').click(); renderList(); setTimeout(loadThumbs,80);">Chercher dans Botadex</button>
  </div>`).join('');
}

const CASES = [{"title": "Prairie humide oligotrophe en fond de vallon", "context": "Parcelle fauchée tardivement, sol hydromorphe, végétation assez basse à moyenne, faible fertilisation apparente.", "species": ["Molinia caerulea", "Juncus acutiflorus", "Succisa pratensis", "Carex panicea", "Lotus pedunculatus"], "questions": ["Habitat probable ?", "Espèces indicatrices ?", "Enjeu pressenti ?", "Confusions à vérifier ?"], "correction": "Habitat probable : prairie humide oligotrophe à méso-oligotrophe, proche du Molinion caeruleae. Enjeu potentiellement modéré à fort selon rareté locale, état de conservation et présence d’espèces protégées/patrimoniales. Confusions : prairie humide eutrophe, bas-marais, moliniaie dégradée."}, {"title": "Haie bocagère ancienne", "context": "Linéaire arboré et arbustif dense, vieux chênes, talus, ronces, prunelliers et aubépines.", "species": ["Quercus robur", "Crataegus monogyna", "Prunus spinosa", "Rubus fruticosus agg.", "Rosa canina agg.", "Corylus avellana"], "questions": ["Habitat EUNIS ?", "Éléments structuraux à enjeu ?", "Groupes faune concernés ?", "Que cartographier ?"], "correction": "Habitat probable : FA haies, avec composante F3 fourrés/manteaux selon structure. Enjeu renforcé par ancienneté, continuité écologique, arbres à cavités, talus, lisières et connexion bocagère. À cartographier : linéaire, largeur, strates, arbres remarquables, espèces invasives éventuelles."}, {"title": "Friche rudérale nitrophile", "context": "Ancien dépôt remanié, sol nu par endroits, végétation haute et dense, espèces nitrophiles.", "species": ["Urtica dioica", "Artemisia vulgaris", "Cirsium vulgare", "Dipsacus fullonum", "Conyza canadensis"], "questions": ["Enjeu flore ?", "Habitat EUNIS ?", "Invasives à rechercher ?", "Comment nuancer la bioévaluation ?"], "correction": "Habitat probable : E5 friches herbacées / Artemisietea vulgaris. Enjeu souvent faible à modéré si cortège banal et rudéral, mais à nuancer selon espèces patrimoniales, rôle de refuge, mosaïque d’habitats et présence d’invasives."}, {"title": "Mare bocagère eutrophe", "context": "Petite mare prairiale, berges piétinées, eau stagnante, ceinture d’hélophytes.", "species": ["Typha latifolia", "Alisma plantago-aquatica", "Lemna minor", "Juncus effusus", "Persicaria hydropiper"], "questions": ["Habitats EUNIS ?", "Zonages à distinguer ?", "Plantes utiles au diagnostic ?", "Enjeu potentiel ?"], "correction": "Habitats probables : C1 eaux stagnantes, D5/C3 ceintures d’hélophytes selon structure. Cartographier séparément eau libre, végétation amphibie, roselière/massette, berges piétinées. Enjeu à évaluer selon naturalité, espèces patrimoniales, amphibiens et connectivité."}];

function renderCases(){
  if(!document.getElementById('caseList')) return;
  caseList.innerHTML = CASES.map((c,i)=>`<div class="case-card">
    <h3>${c.title}</h3>
    <p><b>Contexte :</b> ${c.context}</p>
    <p><b>Cortège :</b> <i>${c.species.join(', ')}</i></p>
    <b>Questions pro :</b>
    <ul>${c.questions.map(q=>`<li>${q}</li>`).join('')}</ul>
    <button onclick="toggleCase(${i})">Voir correction</button>
    <div id="casecorr-${i}" class="case-correction">${c.correction}</div>
  </div>`).join('');
}
function toggleCase(i){
  const el=document.getElementById('casecorr-'+i);
  el.style.display = el.style.display==='block' ? 'none' : 'block';
}



const INVASIVE_TAXA = [{"name": "Reynoutria japonica", "fr": "Renouée du Japon", "habitat": "Berges, friches humides, remblais, talus", "criteria": "Invasive avérée majeure : rhizomes puissants, tiges creuses bambusiformes, grandes feuilles triangulaires.", "confusion": "Vérifier l’identification avant action de gestion : regarder feuilles, fleurs/fruits, mode de croissance, station et photos de détail.", "risk": "Fort", "management": "Éviter la dispersion : fragments, graines, terres contaminées, broyage inadapté, déplacement de matériel."}, {"name": "Reynoutria x bohemica", "fr": "Renouée de Bohême", "habitat": "Berges, friches humides, remblais", "criteria": "Hybride invasif proche de R. japonica ; critères foliaires intermédiaires, identification délicate.", "confusion": "Vérifier l’identification avant action de gestion : regarder feuilles, fleurs/fruits, mode de croissance, station et photos de détail.", "risk": "Modéré à fort", "management": "Éviter la dispersion : fragments, graines, terres contaminées, broyage inadapté, déplacement de matériel."}, {"name": "Impatiens glandulifera", "fr": "Balsamine de l’Himalaya", "habitat": "Berges, fossés, mégaphorbiaies humides", "criteria": "Grande annuelle à fleurs roses, capsules explosives, colonise berges et milieux humides.", "confusion": "Vérifier l’identification avant action de gestion : regarder feuilles, fleurs/fruits, mode de croissance, station et photos de détail.", "risk": "Modéré à fort", "management": "Éviter la dispersion : fragments, graines, terres contaminées, broyage inadapté, déplacement de matériel."}, {"name": "Buddleja davidii", "fr": "Buddleia de David", "habitat": "Friches, voies ferrées, murs, remblais", "criteria": "Arbuste à longues panicules violettes, feuilles opposées lancéolées, colonise milieux remaniés.", "confusion": "Vérifier l’identification avant action de gestion : regarder feuilles, fleurs/fruits, mode de croissance, station et photos de détail.", "risk": "Modéré à fort", "management": "Éviter la dispersion : fragments, graines, terres contaminées, broyage inadapté, déplacement de matériel."}, {"name": "Robinia pseudoacacia", "fr": "Robinier faux-acacia", "habitat": "Boisements rudéraux, talus, friches, anciennes plantations", "criteria": "Arbre à feuilles composées, épines stipulaires, grappes blanches ; enrichit le sol en azote.", "confusion": "Vérifier l’identification avant action de gestion : regarder feuilles, fleurs/fruits, mode de croissance, station et photos de détail.", "risk": "Modéré à fort", "management": "Éviter la dispersion : fragments, graines, terres contaminées, broyage inadapté, déplacement de matériel."}, {"name": "Ailanthus altissima", "fr": "Ailante glanduleux", "habitat": "Friches urbaines, talus, murs, bords de route", "criteria": "Grandes feuilles composées, odeur désagréable au froissement, rejets nombreux.", "confusion": "Vérifier l’identification avant action de gestion : regarder feuilles, fleurs/fruits, mode de croissance, station et photos de détail.", "risk": "Modéré à fort", "management": "Éviter la dispersion : fragments, graines, terres contaminées, broyage inadapté, déplacement de matériel."}, {"name": "Baccharis halimifolia", "fr": "Baccharis à feuilles d’arroche", "habitat": "Marais littoraux, prés salés, friches humides littorales", "criteria": "Arbuste invasif littoral, feuilles alternes, capitules blanchâtres ; enjeu fort en marais atlantiques.", "confusion": "Vérifier l’identification avant action de gestion : regarder feuilles, fleurs/fruits, mode de croissance, station et photos de détail.", "risk": "Fort", "management": "Éviter la dispersion : fragments, graines, terres contaminées, broyage inadapté, déplacement de matériel."}, {"name": "Ludwigia grandiflora", "fr": "Jussie à grandes fleurs", "habitat": "Mares, fossés, étangs, eaux lentes", "criteria": "Aquatique/amphibie à fleurs jaunes, feuilles alternes, tapis denses flottants ou enracinés.", "confusion": "Vérifier l’identification avant action de gestion : regarder feuilles, fleurs/fruits, mode de croissance, station et photos de détail.", "risk": "Fort", "management": "Éviter la dispersion : fragments, graines, terres contaminées, broyage inadapté, déplacement de matériel."}, {"name": "Ludwigia peploides", "fr": "Jussie rampante", "habitat": "Mares, fossés, étangs, eaux lentes", "criteria": "Proche L. grandiflora ; tapis denses, fleurs jaunes, identification à confirmer.", "confusion": "Vérifier l’identification avant action de gestion : regarder feuilles, fleurs/fruits, mode de croissance, station et photos de détail.", "risk": "Modéré à fort", "management": "Éviter la dispersion : fragments, graines, terres contaminées, broyage inadapté, déplacement de matériel."}, {"name": "Ambrosia artemisiifolia", "fr": "Ambroisie à feuilles d’armoise", "habitat": "Cultures, friches, bords de routes, sols nus", "criteria": "Annuelle allergisante, feuilles très divisées, inflorescences verdâtres ; enjeu sanitaire.", "confusion": "Vérifier l’identification avant action de gestion : regarder feuilles, fleurs/fruits, mode de croissance, station et photos de détail.", "risk": "Fort", "management": "Éviter la dispersion : fragments, graines, terres contaminées, broyage inadapté, déplacement de matériel."}, {"name": "Cortaderia selloana", "fr": "Herbe de la pampa", "habitat": "Friches, dunes, talus, jardins, remblais", "criteria": "Grande graminée en touffe avec plumeaux blancs ; colonise milieux ouverts.", "confusion": "Vérifier l’identification avant action de gestion : regarder feuilles, fleurs/fruits, mode de croissance, station et photos de détail.", "risk": "Modéré à fort", "management": "Éviter la dispersion : fragments, graines, terres contaminées, broyage inadapté, déplacement de matériel."}, {"name": "Prunus laurocerasus", "fr": "Laurier-cerise", "habitat": "Sous-bois rudéraux, haies, parcs, lisières", "criteria": "Arbuste persistant à feuilles coriaces luisantes, naturalisation possible en sous-bois.", "confusion": "Vérifier l’identification avant action de gestion : regarder feuilles, fleurs/fruits, mode de croissance, station et photos de détail.", "risk": "Modéré à fort", "management": "Éviter la dispersion : fragments, graines, terres contaminées, broyage inadapté, déplacement de matériel."}, {"name": "Phytolacca americana", "fr": "Raisin d’Amérique", "habitat": "Friches, bois clairs, jardins abandonnés", "criteria": "Grande plante à tiges rougeâtres, grappes de baies noires ; toxique.", "confusion": "Vérifier l’identification avant action de gestion : regarder feuilles, fleurs/fruits, mode de croissance, station et photos de détail.", "risk": "Modéré à fort", "management": "Éviter la dispersion : fragments, graines, terres contaminées, broyage inadapté, déplacement de matériel."}, {"name": "Solidago canadensis", "fr": "Solidage du Canada", "habitat": "Friches, berges, prairies abandonnées", "criteria": "Grande Asteraceae à panicules jaunes, forme des colonies denses.", "confusion": "Vérifier l’identification avant action de gestion : regarder feuilles, fleurs/fruits, mode de croissance, station et photos de détail.", "risk": "Modéré à fort", "management": "Éviter la dispersion : fragments, graines, terres contaminées, broyage inadapté, déplacement de matériel."}, {"name": "Solidago gigantea", "fr": "Solidage géant", "habitat": "Friches humides, berges, prairies abandonnées", "criteria": "Proche S. canadensis ; tiges souvent glabres, milieux plus frais.", "confusion": "Vérifier l’identification avant action de gestion : regarder feuilles, fleurs/fruits, mode de croissance, station et photos de détail.", "risk": "Modéré à fort", "management": "Éviter la dispersion : fragments, graines, terres contaminées, broyage inadapté, déplacement de matériel."}];
const ENJEUX_RULES = [["Très fort", "Espèce protégée nationale/régionale confirmée, habitat Natura 2000 rare en bon état, station d’espèce très rare, tourbière/bas-marais fonctionnel."], ["Fort", "Espèce patrimoniale ou déterminante ZNIEFF, habitat humide oligotrophe, lande humide, prairie maigre riche, station d’orchidées ou cortège remarquable."], ["Modéré", "Habitat semi-naturel fonctionnel mais commun, haie ancienne, prairie diversifiée, mare bocagère, présence d’espèces indicatrices sans statut fort."], ["Faible", "Habitat très anthropisé, culture intensive, friche banale, cortège rudéral commun, absence d’enjeu spécifique identifié."], ["À surveiller", "Présence d’invasives, forte dynamique de fermeture, eutrophisation, drainage, piétinement, remblais ou risque travaux."]];

function setupVisualKey(){
  document.querySelectorAll('.id-choice').forEach(btn=>{
    btn.onclick=()=>{
      const id=btn.dataset.k;
      const box=document.getElementById(id);
      if(box){ box.checked=!box.checked; btn.classList.toggle('selected', box.checked); }
    };
  });
  const reset=document.getElementById('resetKey');
  if(reset) reset.onclick=()=>{
    document.querySelectorAll('.id-choice').forEach(b=>b.classList.remove('selected'));
    document.querySelectorAll('#identify input[type=checkbox]').forEach(c=>c.checked=false);
    if(document.getElementById('keyResult')) keyResult.innerHTML='';
  };
}
function renderInvasives(){
  if(!document.getElementById('invasiveList')) return;
  const q=(document.getElementById('invasiveSearch')?.value||'').toLowerCase();
  const data=INVASIVE_TAXA.filter(x=>JSON.stringify(x).toLowerCase().includes(q));
  invasiveList.innerHTML=data.map(x=>`<div class="invasive-card">
    <div class="risk">Risque ${x.risk}</div>
    <h3>${x.fr}</h3>
    <p class="latin"><i>${x.name}</i></p>
    <p><b>Où chercher :</b> ${x.habitat}</p>
    <p><b>Critères :</b> ${x.criteria}</p>
    <p><b>Confusions :</b> ${x.confusion}</p>
    <p><b>Précautions :</b> ${x.management}</p>
    <button onclick="search.value='${x.name}'; document.querySelector('[data-tab=dex]').click(); renderList(); setTimeout(loadThumbs,80);">Chercher dans Botadex</button>
  </div>`).join('');
}
function renderEnjeux(){
  if(!document.getElementById('enjeuxList')) return;
  enjeuxList.innerHTML=ENJEUX_RULES.map(([level,txt])=>`<div class="enjeu-card"><strong>${level}</strong><p>${txt}</p></div>`).join('');
}
function runEnjeuEval(){
  let score=0, why=[];
  if(ej_prot.checked){score+=4;why.push('espèce protégée/patrimoniale');}
  if(ej_habrare.checked){score+=3;why.push('habitat rare/Natura 2000 potentiel');}
  if(ej_humide.checked){score+=2;why.push('zone humide fonctionnelle');}
  if(ej_bon.checked){score+=2;why.push('bon état de conservation');}
  if(ej_invasive.checked){score+=1;why.push('invasive présente : enjeu de gestion');}
  if(ej_degrade.checked){score-=2;why.push('dégradation/anthropisation');}
  let level='Faible';
  if(score>=7) level='Très fort';
  else if(score>=5) level='Fort';
  else if(score>=3) level='Modéré';
  enjeuResult.innerHTML=`<b>Enjeu pressenti : ${level}</b><br><small>${why.join(' · ')||'Peu d’éléments à enjeu cochés'}</small><p>À confirmer par inventaire complet, statuts officiels, état de conservation et contexte local.</p>`;
}


function runExpertKey(){
  let scores={};
  function add(f,n){scores[f]=(scores[f]||0)+n}
  if(document.getElementById('k_cap')?.checked)add('Asteraceae',6);
  if(document.getElementById('k_cross')?.checked)add('Brassicaceae',6);
  if(document.getElementById('k_pea')?.checked)add('Fabaceae',6);
  if(document.getElementById('k_umbel')?.checked)add('Apiaceae',6);
  if(document.getElementById('k_bilab')?.checked||document.getElementById('k_square')?.checked&&document.getElementById('k_opp')?.checked)add('Lamiaceae',6);
  if(document.getElementById('k_gram')?.checked){add('Poaceae',4);add('Cyperaceae',4);add('Juncaceae',4)}
  if(document.getElementById('k_tri')?.checked)add('Cyperaceae',7);
  if(document.getElementById('k_cone')?.checked)add('Pinaceae',7),add('Cupressaceae',5),add('Taxaceae',4);
  if(document.getElementById('k_fern')?.checked)add('Dryopteridaceae',4),add('Aspleniaceae',4),add('Equisetaceae',4);
  if(document.getElementById('k_bryo')?.checked)add('Sphagnaceae',4),add('Polytrichaceae',3),add('Brachytheciaceae',3);
  if(document.getElementById('k_latex')?.checked)add('Euphorbiaceae',5),add('Asteraceae',2);
  if(document.getElementById('k_spines')?.checked)add('Rosaceae',4),add('Fabaceae',2);
  if(document.getElementById('k_woody')?.checked)add('Rosaceae',2),add('Salicaceae',2),add('Fagaceae',2),add('Pinaceae',2),add('Cupressaceae',2);
  if(document.getElementById('k_wet')?.checked)add('Cyperaceae',2),add('Juncaceae',2),add('Onagraceae',1),add('Lythraceae',1);
  if(document.getElementById('k_heath')?.checked)add('Ericaceae',4),add('Fabaceae',2);
  const arr=Object.entries(scores).sort((a,b)=>b[1]-a[1]).slice(0,8);
  keyResult.innerHTML=arr.length?'<h3>Groupes probables</h3>'+arr.map(([f,s])=>`<div class="score-card"><b>${f}</b><div class="score-bar"><div style="width:${Math.min(100,s*12)}%"></div></div><small>${PLANTS.filter(p=>p.family===f).slice(0,8).map(p=>p.fr).join(', ')}</small></div>`).join('')+'<p><b>Suite pro :</b> ouvrir une flore et vérifier les critères de genre/espèce.</p>':'<p>Sélectionne quelques critères visibles.</p>';
}

openDB().then(()=>{populateFamilies();render();renderGlossary();renderHabitats();renderSyntaxons();renderCases();renderProtected();renderGroupList('fernList','fougères / prêles');renderGroupList('bryoList','bryophytes');renderSoils();renderProtected(); if(document.getElementById('runPhyto')) runPhyto.onclick=runPhytoDiagnosis;});

// === UX FIX v14 ===
function validQuizPlants(){
  return PLANTS.filter(p =>
    !p.quiz_exclude &&
    p.fr && p.latin &&
    !String(p.fr).toLowerCase().startsWith('taxon régional') &&
    !String(p.latin).toLowerCase().startsWith('taxon régional') &&
    !String(p.fr).toLowerCase().includes('à compléter')
  );
}

function setupVisualKey(){
  document.querySelectorAll('.id-choice').forEach(btn=>{
    btn.onclick=()=>{
      const id=btn.dataset.k;
      const box=document.getElementById(id);
      if(!box) return;
      box.checked=!box.checked;
      btn.classList.toggle('selected', box.checked);
    };
  });
  const reset=document.getElementById('resetKey');
  if(reset) reset.onclick=()=>{
    document.querySelectorAll('.id-choice').forEach(b=>b.classList.remove('selected'));
    document.querySelectorAll('#identify input[type=checkbox]').forEach(c=>c.checked=false);
    if(document.getElementById('keyResult')) keyResult.innerHTML='';
  };
  const run=document.getElementById('runKey');
  if(run) run.onclick=runExpertKey;
}

function checked(id){ return !!document.getElementById(id)?.checked; }

function runExpertKey(){
  let scores={}, why={};
  function add(f,n,msg){
    scores[f]=(scores[f]||0)+n;
    why[f]=why[f]||[];
    if(msg) why[f].push(msg);
  }
  if(checked('k_cap')) add('Asteraceae',7,'capitule');
  if(checked('k_cross')) add('Brassicaceae',7,'4 pétales en croix');
  if(checked('k_pea')) add('Fabaceae',7,'fleur papilionacée');
  if(checked('k_umbel')) add('Apiaceae',7,'ombelle');
  if(checked('k_bilab')) add('Lamiaceae',6,'fleur bilabiée');
  if(checked('k_square') && checked('k_opp')) add('Lamiaceae',6,'tige carrée + feuilles opposées');
  if(checked('k_gram')) { add('Poaceae',4,'aspect graminée'); add('Cyperaceae',4,'aspect graminoïde'); add('Juncaceae',4,'aspect graminoïde'); }
  if(checked('k_tri')) add('Cyperaceae',8,'tige trigone');
  if(checked('k_conifer') || checked('k_cone')) { add('Pinaceae',7,'cône/aiguilles'); add('Cupressaceae',5,'cône/écailles'); add('Taxaceae',4,'gymnosperme'); }
  if(checked('k_fern')) { add('Dryopteridaceae',5,'fougère'); add('Aspleniaceae',4,'fougère'); add('Equisetaceae',4,'prêle possible'); }
  if(checked('k_bryo')) { add('Sphagnaceae',5,'mousse/tourbière possible'); add('Polytrichaceae',3,'mousse acrocarpe possible'); add('Brachytheciaceae',3,'mousse pleurocarpe possible'); }
  if(checked('k_latex')) { add('Euphorbiaceae',5,'latex'); add('Asteraceae',2,'latex chez certains laiterons/laitues'); }
  if(checked('k_spines')) { add('Rosaceae',5,'aiguillons/épines fréquents'); add('Fabaceae',3,'ajoncs/genêts épineux possibles'); }
  if(checked('k_comp')) { add('Rosaceae',2,'feuilles composées possibles'); add('Fabaceae',3,'feuilles composées fréquentes'); }
  if(checked('k_5pet')) { add('Rosaceae',3,'5 pétales libres fréquents'); add('Caryophyllaceae',2,'5 pétales possibles'); }
  if(checked('k_opp')) { add('Caryophyllaceae',2,'feuilles opposées'); add('Rubiaceae',2,'feuilles opposées/verticillées'); }
  if(checked('k_rosette')) { add('Plantaginaceae',2,'rosette possible'); add('Asteraceae',2,'rosette possible'); }
  if(checked('k_wet')) { add('Cyperaceae',2,'milieu humide'); add('Juncaceae',2,'milieu humide'); add('Lythraceae',1,'milieu humide'); add('Onagraceae',1,'milieu humide'); }
  if(checked('k_aquatic')) { add('Potamogetonaceae',4,'aquatique'); add('Araceae',2,'lentilles d’eau possibles'); add('Alismataceae',2,'aquatique/amphibie'); }
  if(checked('k_heath')) { add('Ericaceae',5,'lande acide'); add('Fabaceae',2,'ajoncs/genêts de lande'); }
  if(checked('k_wood')) { add('Fagaceae',2,'boisement'); add('Rosaceae',2,'lisières/haies'); add('Dryopteridaceae',2,'sous-bois'); }
  if(checked('k_rud')) { add('Asteraceae',2,'friche'); add('Brassicaceae',2,'adventices'); add('Polygonaceae',2,'rudérales'); }
  const arr=Object.entries(scores).sort((a,b)=>b[1]-a[1]).slice(0,8);
  if(!arr.length){ keyResult.innerHTML='<p>Sélectionne un ou deux critères visibles : type de plante, feuille, fleur ou milieu.</p>'; return; }
  keyResult.innerHTML='<h3>Familles / groupes probables</h3>'+arr.map(([f,s])=>{
    const examples=validQuizPlants().filter(p=>p.family===f).slice(0,8).map(p=>p.fr).join(', ');
    return `<div class="score-card"><b>${f}</b><div class="score-bar"><div style="width:${Math.min(100,s*10)}%"></div></div><p><b>Pourquoi :</b> ${(why[f]||[]).join(' + ')}</p><small>${examples || 'Aucun exemple dans la base actuelle'}</small></div>`;
  }).join('')+'<p><b>Suite pro :</b> vérifie ensuite le genre et l’espèce avec une flore, surtout pour Poaceae, Carex, Juncus, orchidées, ronces et saules.</p>';
}

function setupEnjeux(){
  const run=document.getElementById('runEnjeu');
  if(run) run.onclick=runEnjeuEval;
  const reset=document.getElementById('resetEnjeu');
  if(reset) reset.onclick=()=>{
    document.querySelectorAll('#enjeux input[type=checkbox]').forEach(c=>c.checked=false);
    enjeuResult.className='enjeu-result empty';
    enjeuResult.innerHTML='Coche les éléments observés puis clique sur “Évaluer l’enjeu”.';
  };
  renderEnjeux();
}

function renderEnjeux(){
  if(!document.getElementById('enjeuxList')) return;
  const rules=[
    ['Très fort','Espèce protégée confirmée, habitat rare en bon état, station très localisée, tourbière/bas-marais/lande humide remarquable.'],
    ['Fort','Espèce patrimoniale ou déterminante, habitat semi-naturel rare ou bien conservé, prairie humide oligotrophe, mare oligotrophe, haie ancienne riche.'],
    ['Modéré','Habitat semi-naturel commun mais fonctionnel, diversité correcte, rôle de corridor, zone humide ordinaire ou prairie diversifiée.'],
    ['Faible','Habitat très anthropisé, culture intensive, friche banale, cortège rudéral commun, état dégradé sans espèce à enjeu.'],
    ['Gestion','La présence d’invasives ne rend pas forcément l’enjeu patrimonial fort, mais crée un enjeu de gestion et de prévention de dispersion.']
  ];
  enjeuxList.innerHTML=rules.map(([l,t])=>`<div class="enjeu-card"><b>${l}</b><p>${t}</p></div>`).join('');
}

function runEnjeuEval(){
  let score=0, why=[], caution=[];
  if(checked('ej_prot')){score+=5;why.push('espèce protégée confirmée ou très probable');}
  if(checked('ej_patrim')){score+=4;why.push('espèce patrimoniale / ZNIEFF / rare');}
  if(checked('ej_orchid')){score+=2;why.push('orchidées ou cortège spécialisé');}
  if(checked('ej_habrare')){score+=4;why.push('habitat rare ou Natura 2000 potentiel');}
  if(checked('ej_humide')){score+=2;why.push('zone humide fonctionnelle');}
  if(checked('ej_oligo')){score+=2;why.push('milieu oligotrophe peu fertilisé');}
  if(checked('ej_bocage')){score+=2;why.push('haie ancienne / continuité écologique');}
  if(checked('ej_bon')){score+=2;why.push('bon état de conservation');}
  if(checked('ej_mosaic')){score+=1;why.push('mosaïque d’habitats');}
  if(checked('ej_invasive')){caution.push('invasive présente : enjeu de gestion et vigilance travaux');}
  if(checked('ej_threat')){caution.push('menace forte à prendre en compte');}
  if(checked('ej_degrade')){score-=3;why.push('dégradation forte : baisse de l’enjeu patrimonial, sauf espèce protégée');}
  let level='Faible';
  if(score>=9) level='Très fort';
  else if(score>=6) level='Fort';
  else if(score>=3) level='Modéré';
  enjeuResult.className='enjeu-result';
  enjeuResult.innerHTML=`<span class="enjeu-level">Enjeu pressenti : ${level}</span>
  <p><b>Arguments :</b> ${why.length?why.join(' · '):'peu d’éléments écologiques à enjeu cochés'}</p>
  ${caution.length?`<p><b>Vigilance :</b> ${caution.join(' · ')}</p>`:''}
  <p><b>À confirmer :</b> statut officiel, rareté locale, surface, état de conservation, connectivité, saison d’inventaire et pression de gestion.</p>`;
}

function doQuiz(){
  if(!document.getElementById('quizFeedback')) return;
  quizFeedback.textContent="";
  const poolValid=validQuizPlants();
  if(!poolValid.length){ quizQuestion.textContent='Aucune plante valide pour le quiz.'; return; }
  let p=poolValid[Math.floor(Math.random()*poolValid.length)];
  let modes=["family","latin","habitat","status"].filter(Boolean);
  let m=modes[Math.floor(Math.random()*modes.length)], correct, question, pool;
  if(m==="family"){question=`Quelle est la famille de : ${p.fr} ?`;correct=p.family;pool=poolValid.map(x=>x.family);}
  else if(m==="latin"){question=`Quel est le nom latin de : ${p.fr} ?`;correct=p.latin;pool=poolValid.map(x=>x.latin);}
  else if(m==="habitat"){question=`Dans quel milieu cherche-t-on surtout : ${p.fr} ?`;correct=p.habitat;pool=poolValid.map(x=>x.habitat);}
  else {question=`Quel statut/attention pour : ${p.fr} ?`;correct=p.status||'À vérifier';pool=poolValid.map(x=>x.status||'À vérifier');}
  let options=[...new Set([correct,...pool.sort(()=>Math.random()-.5).slice(0,8)])].slice(0,4).sort(()=>Math.random()-.5);
  quizQuestion.textContent=question;
  quizOptions.innerHTML=options.map(o=>`<button>${o}</button>`).join("");
  quizOptions.querySelectorAll("button").forEach(b=>b.onclick=()=>{
    if(b.textContent===correct){b.classList.add("good");quizFeedback.textContent="✅ Oui !";}
    else{b.classList.add("bad");quizFeedback.textContent=`❌ Réponse : ${correct}`;}
  });
}

setTimeout(()=>{
  setupVisualKey();
  setupEnjeux();
  const nq=document.getElementById('newQuiz');
  if(nq) nq.onclick=doQuiz;
},300);


let learning = JSON.parse(localStorage.getItem("botadexLearningV1") || '{"errors":{},"reviews":{},"goal":"families","sessions":0}');
function saveLearning(){ localStorage.setItem("botadexLearningV1", JSON.stringify(learning)); }
function cleanPlantPool(){ return PLANTS.filter(p => p.fr && p.latin && !p.quiz_exclude && !String(p.fr).toLowerCase().startsWith('taxon régional') && !String(p.latin).toLowerCase().startsWith('taxon régional') && !String(p.fr).toLowerCase().includes('à compléter')); }
function duePlants(){ const now=Date.now(); return cleanPlantPool().filter(p => !learning.reviews[p.id] || learning.reviews[p.id].due <= now).slice(0,20); }
function scheduleReview(id, quality){ const days={bad:1,ok:3,good:7,master:30}[quality]||3; learning.reviews[id]={last:Date.now(),due:Date.now()+days*86400000,quality}; saveLearning(); }
function renderLearning(){
  if(!document.getElementById('dailyPlan')) return;
  const due=duePlants(); const known=PLANTS.filter(p=>["known","mastered"].includes(getStatus(p.id))).length;
  dailyPlan.innerHTML=`Aujourd’hui : <b>${due.length}</b> plantes à revoir, <b>${known}</b> plantes connues. Session conseillée : 12 minutes.`;
  srsStats.innerHTML=`<span class="srs-pill">${Object.keys(learning.reviews).length} planifiées</span><span class="srs-pill">${due.length} dues</span>`;
  renderLearningPath(); renderWeaknesses(); renderProExercises();
}
function renderLearningPath(){
  const steps=[["Bases morphologie","Opposé/alterne, limbe, pétiole, fleur, fruit, poils."],["Grandes familles","Asteraceae, Fabaceae, Lamiaceae, Brassicaceae, Apiaceae."],["Milieux","Prairie, friche, haie, bois, humide, lande, aquatique."],["Groupes difficiles","Poaceae, Carex, Juncus, Salix, Rosa, Rubus."],["Habitats/EUNIS","Reconnaître un habitat par structure + cortège."],["Enjeux BE","Protégées, invasives, patrimoniales, bioévaluation."]];
  const known=PLANTS.filter(p=>["known","mastered"].includes(getStatus(p.id))).length;
  learningPath.innerHTML=steps.map((s,i)=>{ const done=known >= [20,80,160,300,450,650][i]; return `<div class="path-step ${done?'done':'todo'}"><b>${done?'✅':'⬜'} ${s[0]}</b><p>${s[1]}</p></div>`;}).join('');
}
function renderWeaknesses(){
  const top=Object.entries(learning.errors||{}).sort((a,b)=>b[1]-a[1]).slice(0,5);
  weaknessBox.innerHTML=top.length ? "À retravailler : "+top.map(([k,v])=>`<span class="srs-pill">${k} (${v})</span>`).join('') : "Pas encore assez d’erreurs enregistrées. Fais quelques quiz.";
}
function setLearningGoal(){ learning.goal=learningGoal.value; saveLearning(); renderProExercises(); }
function startDailySession(){ document.querySelector('[data-tab="quiz"]')?.click(); if(typeof doQuiz==="function") doQuiz(); }
function findPlant(q){ q=(q||'').toLowerCase().trim(); return cleanPlantPool().find(p => p.latin.toLowerCase().includes(q) || p.fr.toLowerCase().includes(q)); }
function runComparePlants(){
  const a=findPlant(compareA.value), b=findPlant(compareB.value);
  if(!a||!b){ compareResult.innerHTML="<p>Je n’ai pas trouvé les deux plantes.</p>"; return; }
  compareResult.innerHTML=`<table class="compare-table"><tr><th>Critère</th><th>${a.fr}<br><i>${a.latin}</i></th><th>${b.fr}<br><i>${b.latin}</i></th></tr><tr><td>Famille</td><td>${a.family}</td><td>${b.family}</td></tr><tr><td>Habitat</td><td>${a.habitat}</td><td>${b.habitat}</td></tr><tr><td>Critères</td><td>${a.criteria}</td><td>${b.criteria}</td></tr><tr><td>Confusions</td><td>${a.confusions}</td><td>${b.confusions}</td></tr><tr><td>EUNIS / phyto</td><td>${a.eunis}<br>${a.phytosociology}</td><td>${b.eunis}<br>${b.phytosociology}</td></tr></table>`;
}
function renderProExercises(){
  if(!document.getElementById('proExercises')) return;
  const ex={families:["Reconnais la famille à partir de 3 critères.","Compare Lamiaceae / Caryophyllaceae / Rubiaceae.","Trouve 5 Fabaceae dans le Botadex."],wetlands:["Liste les indices de zone humide.","Compare prairie humide eutrophe vs oligotrophe.","Cherche 5 plantes liées à E3 ou D5."],protected:["Choisis une protégée et note milieu/période/confusion.","Fais une fiche station : effectif, habitat, menaces.","Compare une orchidée avec une espèce proche."],invasives:["Cherche 3 invasives de berges.","Explique le risque de la renouée en travaux.","Compare invasive avérée vs horticole échappée."],eunis:["Propose EUNIS à partir d’un cortège.","Compare E2 et E3.","Liste les plantes repères d’un habitat."],phyto:["Lis un relevé Braun-Blanquet simple.","Différencie caractéristique/différentielle/compagne.","Propose un syntaxon à partir de 5 espèces."]};
  proExercises.innerHTML=(ex[learning.goal]||ex.families).map((e,i)=>`<div class="exercise-card"><b>Exercice ${i+1}</b><p>${e}</p></div>`).join('');
}
function doQuiz(){
  if(!document.getElementById('quizFeedback')) return;
  quizFeedback.textContent=""; const pool=cleanPlantPool(); let p=pool[Math.floor(Math.random()*pool.length)];
  let modes=["family","latin","habitat"], m=modes[Math.floor(Math.random()*modes.length)], correct, question, sourcePool;
  if(m==="family"){question=`Quelle est la famille de : ${p.fr} ?`;correct=p.family;sourcePool=pool.map(x=>x.family);}
  else if(m==="latin"){question=`Quel est le nom latin de : ${p.fr} ?`;correct=p.latin;sourcePool=pool.map(x=>x.latin);}
  else {question=`Dans quel milieu cherche-t-on surtout : ${p.fr} ?`;correct=p.habitat;sourcePool=pool.map(x=>x.habitat);}
  let options=[...new Set([correct,...sourcePool.sort(()=>Math.random()-.5).slice(0,8)])].slice(0,4).sort(()=>Math.random()-.5);
  quizQuestion.textContent=question; quizOptions.innerHTML=options.map(o=>`<button>${o}</button>`).join("");
  quizOptions.querySelectorAll("button").forEach(b=>b.onclick=()=>{ if(b.textContent===correct){b.classList.add("good"); quizFeedback.innerHTML=`✅ Oui ! <button onclick="scheduleReview(${p.id},'good');renderLearning();">Revoir dans 7 jours</button>`;} else {b.classList.add("bad"); learning.errors[p.family]=(learning.errors[p.family]||0)+1; scheduleReview(p.id,'bad'); saveLearning(); quizFeedback.textContent=`❌ Réponse : ${correct}`; renderLearning();}});
}
setTimeout(()=>{renderLearning(); if(document.getElementById('setGoal')) setGoal.onclick=setLearningGoal; if(document.getElementById('startDaily')) startDaily.onclick=startDailySession; if(document.getElementById('runCompare')) runCompare.onclick=runComparePlants; if(document.getElementById('newQuiz')) newQuiz.onclick=doQuiz;},400);


// === v17 Fluidité + Coach adaptatif ===
let visibleLimitV17 = 80;
function debounceV17(fn, delay=150){let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),delay)}}
function safePoolV17(){
  return PLANTS.filter(p => p && p.fr && p.latin && !p.quiz_exclude &&
    !String(p.fr).toLowerCase().startsWith('taxon régional') &&
    !String(p.latin).toLowerCase().startsWith('taxon régional') &&
    !String(p.fr).toLowerCase().includes('à compléter'));
}
function renderListV17(){
  if(!document.getElementById('plantList')) return;
  const q=(document.getElementById('search')?.value||'').toLowerCase();
  const fam=document.getElementById('familyFilter')?.value||'';
  const stat=document.getElementById('statusFilter')?.value||'';
  const pool=PLANTS.filter(p=>{
    const text=`${p.fr} ${p.latin} ${p.family} ${p.habitat} ${(p.tags||[]).join(" ")} ${p.phytosociology||""} ${p.eunis||""}`.toLowerCase();
    return(!q||text.includes(q))&&(!fam||p.family===fam)&&(!stat||getStatus(p.id)===stat);
  });
  const list=pool.slice(0,visibleLimitV17);
  plantList.innerHTML=list.map(p=>`<article class="plant ${p.special||''}">
    <div class="thumb" id="thumb-${p.id}">🌿</div>
    <div class="plant-head"><div class="plant-check">${em(p.id)}</div><div><h3>${p.id}. ${p.fr}</h3><div class="latin">${p.latin}</div></div></div>
    <div class="badges"><span class="badge">${p.family}</span>${p.special==='protected'?'<span class="badge prot">protégée/patrimoniale</span>':''}${p.special==='invasive'?'<span class="badge inv">invasive</span>':''}${(p.tags||[]).slice(0,3).map(t=>`<span class="badge">${t}</span>`).join("")}</div>
    <p>${p.short||''}</p>
    <p class="phyto-mini"><b>Phyto :</b> ${p.phytosociology||'À préciser'}</p>
    <div class="status-row">${statuses.map(([s,e,l])=>`<button title="${l}" class="${getStatus(p.id)===s?'selected':''}" onclick="setStatus(${p.id},'${s}')">${e}</button>`).join("")}</div>
    <button class="detail" onclick="openPlant(${p.id})">Voir plus / photos / commentaire</button>
  </article>`).join("");
  if(pool.length>visibleLimitV17){
    plantList.innerHTML += `<button class="load-more" onclick="visibleLimitV17+=80;renderListV17();setTimeout(loadThumbs,80)">Afficher plus (${Math.min(visibleLimitV17,pool.length)}/${pool.length})</button>`;
  }
  requestAnimationFrame(()=>{ if(typeof loadThumbs==="function") loadThumbs(); });
}
renderList = renderListV17;
function attachFluidSearchV17(){
  const deb=debounceV17(()=>{visibleLimitV17=80;renderListV17();},150);
  ['search','familyFilter','statusFilter'].forEach(id=>{
    const e=document.getElementById(id);
    if(e){e.oninput=deb;e.onchange=deb;}
  });
}
function coachDataV17(){
  const pool=safePoolV17();
  const known=pool.filter(p=>["known","mastered"].includes(getStatus(p.id)));
  const unknown=pool.filter(p=>getStatus(p.id)==="unknown").slice(0,8);
  const progress=pool.filter(p=>getStatus(p.id)==="progress").slice(0,8);
  const errors=(typeof learning!=="undefined" && learning.errors) ? Object.entries(learning.errors).sort((a,b)=>b[1]-a[1]).slice(0,4) : [];
  return {pool,known,unknown,progress,errors};
}
function renderCoachV17(){
  if(!document.getElementById('coachPlan')) return;
  const d=coachDataV17();
  coachPlan.innerHTML=`<p><b>${d.known.length}</b> plantes connues sur <b>${d.pool.length}</b>.</p>
  <p>Routine conseillée : 5 min quiz + 5 min comparaison + 5 min habitat/enjeu.</p>
  <p>${d.progress.length?`À consolider : ${d.progress.slice(0,4).map(p=>p.fr).join(', ')}`:'Coche quelques plantes “en progression” pour que je cible mieux.'}</p>`;
  coachPriorities.innerHTML=(d.errors.length?`<b>Familles à retravailler :</b><br>${d.errors.map(([k,v])=>`<span class="coach-pill">${k} (${v})</span>`).join('')}`:`<span class="coach-pill">Pas encore assez d’erreurs quiz</span>`)
  + `<hr><b>Nouvelles plantes proposées :</b><br>${d.unknown.slice(0,5).map(p=>`<span class="coach-pill">${p.fr}</span>`).join('')}`;
}
function startCoachRoutineV17(){
  document.querySelector('[data-tab="quiz"]')?.click();
  if(typeof doQuiz==="function") doQuiz();
}
async function launchVisualTrainV17(){
  if(!db || !document.getElementById('visualCard')) return;
  const pool=safePoolV17();
  let candidates=[];
  for(const p of pool.slice(0,500)){
    const ph=await getPhoto(`p${p.id}-1`);
    if(ph) candidates.push({p,ph});
    if(candidates.length>=20) break;
  }
  if(!candidates.length){
    visualCard.innerHTML="Aucune photo 1 trouvée pour l’instant. Ajoute une photo 1 dans une fiche plante.";
    return;
  }
  const item=candidates[Math.floor(Math.random()*candidates.length)];
  visualCard.innerHTML=`<img src="${item.ph}"><p>Quelle est cette plante ?</p>
  <button onclick="visualCard.innerHTML += '<p><b>${item.p.fr}</b><br><i>${item.p.latin}</i><br>${item.p.family}</p>'">Voir réponse</button>`;
}
function initV17(){
  attachFluidSearchV17();
  renderCoachV17();
  const cs=document.getElementById('coachStart'); if(cs) cs.onclick=startCoachRoutineV17;
  const vt=document.getElementById('visualTrain'); if(vt) vt.onclick=launchVisualTrainV17;
  setTimeout(()=>{renderListV17();renderCoachV17();},120);
}
setTimeout(initV17,500);
