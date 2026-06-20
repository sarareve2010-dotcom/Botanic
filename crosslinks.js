// Botadex : liens internes entre plantes, habitats, syntaxons et glossaire.
(function(){
  const style=document.createElement('style');
  style.textContent='.xlink{color:#1f5b3c;font-weight:900;border-bottom:1px dotted #1f5b3c;background:#eef8ef;border-radius:6px;padding:0 3px;cursor:pointer}.xlink:hover{background:#dcefd8}.xlink-syntaxon{color:#6b4aa0}.xlink-habitat{color:#2c6f9f}.xlink-glossary{color:#8a6a45}';
  document.head.appendChild(style);
  function norm(s){return String(s||'').replace(' agg.','').trim()}
  function escapeRe(s){return String(s).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}
  function detailedPlants(){return (DATA.plants||[]).filter(p=>p.detailed||p.id<=80)}
  function makeTerms(){
    const terms=[];const seen=new Set();
    function add(term,kind,id,label){term=norm(term);if(term.length<4)return;const k=kind+'|'+term.toLowerCase();if(seen.has(k))return;seen.add(k);terms.push({term,kind,id,label:label||term});}
    detailedPlants().forEach(p=>{
      add(p.fr,'plant',p.id,p.fr);add(p.latin,'plant',p.id,p.fr);
      const g=norm(p.latin).split(' ')[0];
      if(['Molinia','Succisa','Carex','Juncus','Phragmites','Typha','Erica','Calluna','Ulex','Sphagnum','Drosera','Filipendula','Salix','Alnus','Iris','Urtica','Centaurea','Achillea'].includes(g)) add(g,'plant',p.id,p.fr);
    });
    (DATA.syntaxons||[]).forEach((s,i)=>add(s.name,'syntaxon',i,s.name));
    (DATA.habitats||[]).forEach((h,i)=>{add(h.name,'habitat',i,h.name); if(h.code&&h.code.length>1&&!['E2','E3','G1','F3','F4','D5','C1','C2','C3','J'].includes(h.code))add(h.code,'habitat',i,h.name)});
    (DATA.glossary||[]).forEach((g,i)=>add(g.term,'glossary',i,g.term));
    return terms.sort((a,b)=>b.term.length-a.term.length).slice(0,600);
  }
  let TERMS=[];
  function rebuild(){TERMS=makeTerms()}
  rebuild();
  function hasSkipParent(node){let e=node.parentElement;while(e){if(['SCRIPT','STYLE','TEXTAREA','INPUT','SELECT','BUTTON'].includes(e.tagName))return true;if(e.classList&&e.classList.contains('xlink'))return true;e=e.parentElement}return false}
  function linkTextNode(node){
    const text=node.nodeValue;if(!text||text.length<4||hasSkipParent(node))return;
    const lower=text.toLowerCase();let best=null,idx=-1;
    for(const t of TERMS){const i=lower.indexOf(t.term.toLowerCase());if(i>=0){best=t;idx=i;break}}
    if(!best)return;
    const before=text.slice(0,idx),match=text.slice(idx,idx+best.term.length),after=text.slice(idx+best.term.length);
    const frag=document.createDocumentFragment();
    if(before)frag.appendChild(document.createTextNode(before));
    const sp=document.createElement('span');sp.className='xlink xlink-'+best.kind;sp.dataset.kind=best.kind;sp.dataset.id=best.id;sp.title='Ouvrir dans Botadex : '+best.label;sp.textContent=match;frag.appendChild(sp);
    if(after)frag.appendChild(document.createTextNode(after));
    node.parentNode.replaceChild(frag,node);
  }
  let busy=false;
  function linkify(root){
    if(busy||!root)return;busy=true;rebuild();
    try{const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>hasSkipParent(n)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});const nodes=[];while(nodes.length<350){const n=walker.nextNode();if(!n)break;nodes.push(n)}nodes.forEach(linkTextNode)}finally{busy=false}
  }
  function linkAll(){linkify(document.getElementById('view'));linkify(document.getElementById('modalContent'))}
  document.addEventListener('click',function(e){
    const el=e.target.closest&&e.target.closest('.xlink');if(!el)return;e.preventDefault();
    const kind=el.dataset.kind,id=Number(el.dataset.id);
    if(kind==='plant'){
      const p=DATA.plants.find(x=>x.id===id);if(!p)return;
      state.view='explore';state.q=norm(p.latin)||p.fr;state.group='all';state.family='all';state.classe='all';state.onlyDetailed=false;setView('explore');
      setTimeout(()=>{try{openPlant(id)}catch(err){}},120);
    }
    if(kind==='syntaxon'){state.view='terrain';state.terrain='Phytosociologie';setView('terrain')}
    if(kind==='habitat'){state.view='terrain';state.terrain='EUNIS';setView('terrain')}
    if(kind==='glossary'){state.view='learn';state.learn='Glossaire';setView('learn')}
  });
  const obs=new MutationObserver(()=>setTimeout(linkAll,40));
  window.addEventListener('load',()=>{linkAll();const v=document.getElementById('view');const m=document.getElementById('modalContent');if(v)obs.observe(v,{childList:true,subtree:true});if(m)obs.observe(m,{childList:true,subtree:true})});
  const oldRender=render;render=function(){oldRender();setTimeout(linkAll,50)};
})();
