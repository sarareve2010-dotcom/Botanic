// Botadex simple mode : familles, photos galerie, commentaires, EUNIS et phytosociologie.
(function(){
  ['plants-lot-004.js','plants-lot-005.js'].forEach(function(src){
    var s=document.createElement('script');
    s.src=src+'?v=7';
    s.onload=function(){if(typeof render==='function')render()};
    document.head.appendChild(s);
  });
  window.addEventListener('load',function(){
    var css=document.createElement('style');
    css.textContent='.family-title{margin:22px 0 10px;font-size:1.25rem}.note-box{width:100%;min-height:120px;border:1px solid #d8e3d6;border-radius:14px;padding:12px;font:inherit}.photo-help{font-size:.9rem;opacity:.8}.plant-card .comment-dot{font-size:.82rem;opacity:.75}';
    document.head.appendChild(css);
    window.botadexNotes=JSON.parse(localStorage.botadex_notes||'{}');
    window.saveNote=function(id,v){botadexNotes[id]=v;localStorage.botadex_notes=JSON.stringify(botadexNotes)};
    function clean(x){return String(x||'').replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c]})}
    plants=function(){
      title('Plantes','Tri par famille, critères, EUNIS, phytosociologie, photos et commentaires.');
      var fam=['all'].concat([...new Set(DATA.plants.map(function(p){return p.family||'Famille inconnue'}))].sort());
      var eu=['all'].concat([...new Set(DATA.plants.map(function(p){return p.eunis||'—'}))].sort());
      view.innerHTML='<div class="toolbar"><input class="search" placeholder="Rechercher nom, latin, famille, EUNIS..." value="'+clean(state.q)+'" oninput="state.q=this.value;plantList()"><select class="select" onchange="state.family=this.value;plantList()">'+fam.map(function(x){return '<option value="'+clean(x)+'" '+(x===state.family?'selected':'')+'>'+(x==='all'?'Toutes familles':clean(x))+'</option>'}).join('')+'</select><select class="select" onchange="state.eunis=this.value;plantList()">'+eu.map(function(x){return '<option value="'+clean(x)+'" '+(x===state.eunis?'selected':'')+'>'+(x==='all'?'Tous codes EUNIS':clean(x))+'</option>'}).join('')+'</select></div><div id="plants"></div>';
      plantList();
    };
    plantList=function(){
      var q=(state.q||'').toLowerCase();
      var list=DATA.plants.filter(function(p){return (state.family==='all'||!state.family||p.family===state.family)&&(state.eunis==='all'||!state.eunis||p.eunis===state.eunis)&&Object.values(p).join(' ').toLowerCase().includes(q)});
      var by={};list.forEach(function(p){var f=p.family||'Famille inconnue';(by[f]=by[f]||[]).push(p)});
      $('#plants').innerHTML='<p><b>'+list.length+'</b> plantes</p>'+Object.keys(by).sort().map(function(f){return '<h2 class="family-title">'+clean(f)+'</h2><div class="plant-grid">'+by[f].map(card).join('')+'</div>'}).join('');
    };
    card=function(p){
      var ph=(state.photos[p.id]||[])[0];var hasNote=botadexNotes[p.id]?' · commentaire perso':'';
      return '<article class="plant-card"><div class="plant-cover">'+(ph?'<img class="cover-img" src="'+ph+'">':'🌿')+'</div><div class="plant-body"><h3>'+clean(p.fr)+'</h3><div class="latin"><i>'+clean(p.latin)+'</i></div><div class="badges"><span class="badge">'+clean(p.family)+'</span><span class="badge">'+clean(p.eunis)+'</span><span class="badge">'+clean(p.syntaxon)+'</span></div><p>'+clean(p.criteria||'Critères à compléter.')+'</p><p class="comment-dot">'+clean(hasNote)+'</p><button onclick="openPlant('+p.id+')">Ouvrir la fiche</button></div></article>';
    };
    openPlant=function(id){
      var p=DATA.plants.find(function(x){return x.id===id}),c=p.classif||{},ph=state.photos[id]||[],note=botadexNotes[id]||'';
      modalContent.innerHTML='<h2>'+clean(p.fr)+'</h2><div class="latin"><i>'+clean(p.latin)+'</i> · '+clean(p.family)+'</div><section class="module"><h3>Classification</h3><table><tr><td>Classe</td><td>'+clean(c.classe||'—')+'</td></tr><tr><td>Ordre</td><td>'+clean(c.ordre||'—')+'</td></tr><tr><td>Famille</td><td>'+clean(p.family)+'</td></tr></table></section><section class="module"><h3>Critères d’identification</h3><p>'+clean(p.criteria||'À compléter.')+'</p><p><b>Confusions :</b> '+clean(p.confusions||'À vérifier avec une flore locale.')+'</p></section><section class="module"><h3>Habitat</h3><p><b>Biotope :</b> '+clean(p.biotope||p.habitat||'—')+'</p><p><b>Code EUNIS :</b> '+clean(p.eunis||'—')+'</p><p><b>Phytosociologie :</b> '+clean(p.syntaxon||'—')+'</p></section><section class="module"><h3>Mes commentaires</h3><textarea class="note-box" placeholder="Note terrain, lieu, date, doute d’identification..." oninput="saveNote('+id+',this.value)">'+clean(note)+'</textarea></section><h3>Photos depuis la galerie</h3><p class="photo-help">Appuie sur une case puis choisis une image dans ta galerie du téléphone.</p><div class="photo-grid">'+[0,1,2,3,4,5].map(function(i){return '<label class="photo-slot">'+(ph[i]?'<img src="'+ph[i]+'">':'Ajouter photo '+(i+1))+'<input hidden type="file" accept="image/*" onchange="addPhoto('+id+','+i+',this)"></label>'}).join('')+'</div>';
      modal.showModal();
    };
    render();
  });
})();
