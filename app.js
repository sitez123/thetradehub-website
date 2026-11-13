(function(){
const D = window.TH, C = D.company, $ = (s,r=document)=>r.querySelector(s), $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const hasG = ()=> !!(window.gsap && window.ScrollTrigger);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const desk = ()=> matchMedia('(min-width: 901px) and (min-height: 600px)').matches;
const mobPin = ()=> matchMedia('(max-width: 900px) and (min-height: 560px)').matches;
const esc = s => String(s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const col = id => D.collections.find(c=>c.id===id);

/* ---------- shared bits ---------- */
const spacer = (c)=>`<svg class="spacer" viewBox="0 0 40 40" aria-hidden="true"><path d="M16 0h8v16h16v8H24v16h-8V24H0v-8h16z" fill="${c}"/></svg>`;
const FL = [ // floating tiles + spacers for hero: [img|spacer, left%, top%, width px, depth, rot, hideMobile]
  ['t-cafe',      72, 10, 260, .9, -9, 0],
  ['t-calacatta', 84, 46, 190, .5, 7, 1],
  ['t-glaze',     58, 64, 210, 1.1, 5, 1],
  ['t-onyx',      -6, 84, 230, .7, 11, 1],
  ['t-oak',       88, 78, 170, 1.2, -12, 1],
  ['t-terrazzo',  44, 4, 120, .4, 14, 1],
  ['t-ivory',     12, 8, 150, .6, -6, 1],
  ['sp:#D3A257',  66, 40, 46, 1.2, 20, 0],
  ['sp:#0E8E8A',  50, 90, 40, .8, -15, 1],
  ['sp:#C2623A',  94, 30, 34, .6, 35, 1]
];
const FLM = [ // mobile-only cluster under the hero text: [img, left%, bottom vw, width vw, depth, rot]
  ['t-cafe',      -4, 16, 44, .9, -8],
  ['t-calacatta', 38, 4, 32, .6, 7],
  ['t-glaze',     62, 24, 40, 1.1, -5],
  ['t-onyx',      74, 2, 30, .7, 10],
  ['sp:#D3A257',  38, 42, 9, 1.2, 20],
  ['sp:#C2623A',  8, 4, 7, .8, -15]
];
function floatsMobile(){ return floatsMobileSet(FLM); }
function floatsMobileSet(set){
  return set.map(([k,l,t,w,d,r])=>{
    const inner = k.startsWith('sp:') ? spacer(k.slice(3)) : `<img class="ftile" src="img/${k}.jpg" alt="" loading="eager">`;
    return `<div class="float mo" data-depth="${d}" style="left:${l}%;bottom:${t}vw;width:${w}vw;transform:rotate(${r}deg)" data-rot="${r}">${inner}</div>`;
  }).join('');
}
function floats(set){
  return set.map(([k,l,t,w,d,r,h])=>{
    const inner = k.startsWith('sp:') ? spacer(k.slice(3)) : `<img class="ftile" src="img/${k}.jpg" alt="" loading="eager">`;
    return `<div class="float${h?' hm':''}" data-depth="${d}" style="left:${l}%;top:${t}%;width:${w}px;transform:rotate(${r}deg)" data-rot="${r}">${inner}</div>`;
  }).join('');
}
const marquee = words => { const s = words.map(w=>`<span>${w}</span>`).join(''); return `<div class="marquee" aria-hidden="true"><div class="track">${s}${s}</div></div>`; };
const head = (crumb, title, lead, cls='b-onyx', extra='', word='') => `<section class="ph-head ${cls}"><div class="wrap"><span class="crumb"><a href="#home">Home</a> / ${crumb}</span>${word?`<div class="pword">${word}</div>`:''}<h1 class="split-lines">${title}</h1>${lead?`<p class="lead">${lead}</p>`:''}${extra}</div></section>`;
const cta = (title='Tell us what you need.', cls='b-gold') => `<section class="block ${cls} cta-big"><div class="wrap"><span class="kicker">Quotes in writing, per order</span><h2 class="split-lines" style="margin:18px 0 30px">${title}</h2><div class="ctas"><a class="pill" href="#quote">Get a quote</a><a class="pill ghost" href="#calculator">Work out your m²</a></div></div></section>`;

function footer(){
  return `<footer class="footer"><div class="wrap"><div class="fcols">
    <div><a class="logo" href="#home" style="color:var(--onyx)"><i></i>The Trade Hub</a><p style="margin-top:14px;opacity:.8;max-width:34ch">Tiles, toilets and insulation from the UAE. Containers worldwide, pallets across the UAE.</p>
      <p style="margin-top:14px" class="mono">${esc(C.phone)} · ${esc(C.email)}</p></div>
    <div><h4>Products</h4><a href="#tiles">Tiles</a>${D.collections.map(c=>`<a href="#${c.id}">· ${c.name}</a>`).join('')}<a href="#toilets">Toilets</a><a href="#insulation">Insulation</a></div>
    <div><h4>Buying</h4><a href="#containers">Containers</a><a href="#pallets">Pallets</a><a href="#how-it-works">How it works</a><a href="#calculator">Calculator</a><a href="#quote">Get a quote</a><a href="#textiles">Textiles</a></div>
    <div><h4>Know-how</h4><a href="#guides">Guides</a><a href="#standards">Standards</a><a href="#glossary">Glossary</a><a href="#faq">FAQ</a><a href="#about">About</a></div>
  </div>
  <p class="fine">The Trade Hub is an independent trading company in ${esc(C.base)}. RAK Ceramics and its range names are trademarks of RAK Ceramics PJSC.</p>
  <div class="wordmark" aria-hidden="true">The Trade Hub</div></div></footer>`;
}

/* ---------- load builder (signature): every product mix, container or pallet ---------- */
// Unit figures (approximate): tile pallet of 60 × 120 (30 boxes, 43.2 m²); boxed one-piece WC; 100 mm Spacesaver roll, packed.
const U = { tile:{ t:.92, v:.70, m2:43.2 }, wc:{ t:.040, v:.30 }, roll:{ t:.01415, v:.29, m2:14.13 } };
const CELL_V = .70; // one block in the container picture ≈ 0.7 m³
const VESSEL = {
  c20:{ name:'20ft container', cols:8,  rows:5, capT:23, capV:28 },
  c40:{ name:'40ft container', cols:16, rows:5, capT:25, capV:56 }
};
const LOADS = [['t','Tiles'],['w','Toilets'],['i','Insulation'],['tw','Tiles + toilets'],['ti','Tiles + insulation'],['twi','All three'],['x','Your mix']];
// "Your mix": the visitor's own quantities. Pallets are planned to about 1.8 m high and 1 t.
const MIXIN = { c20:{tile:15,wc:30,roll:20}, c40:{tile:20,wc:80,roll:60}, pal:{box:12,wc:1,roll:2} };
const MIXF = { c:[['tile','Tile pallets',1,60],['wc','Boxed WCs',5,400],['roll','Rolls',5,400]], pal:[['box','Tile boxes',3,60],['wc','Boxed WCs',1,8],['roll','Rolls',1,12]] };
const PAL_MAX = { h:180, kg:1000 };
function palMix(v){ // two columns on the pallet; each item goes on the lower column
  const top=[], col=[0,0], items=[...Array(v.wc).fill('wc'), ...Array(v.roll).fill('roll')];
  items.forEach(t=>{ const c=col[0]<=col[1]?0:1; top.push([t, t==='wc'?(c?63:10):(c?62:8), col[c]]); col[c]+= t==='wc'?87:52; });
  return { box:v.box, top, h:Math.round(15+v.box*2.2+Math.max(col[0],col[1])) }; }
const PLAN = {
  c20:{ t:{tile:25}, w:{wc:90}, i:{roll:96}, tw:{tile:18,wc:50}, ti:{tile:20,roll:46}, twi:{tile:16,wc:30,roll:25} },
  c40:{ t:{tile:27}, w:{wc:185}, i:{roll:193}, tw:{tile:21,wc:135}, ti:{tile:25,roll:132}, twi:{tile:20,wc:80,roll:60} }
};
const NOTE = {
  c20:{ t:'Tiles alone fill a 20ft by <b>weight</b>: 25 pallets, about 1,080 m² and 23 t, with a third of the box still empty.',
        w:'Toilets fill a 20ft by <b>space</b>: about 90 boxed one-piece WCs, only around 3.6 t.',
        i:'Glass wool is the lightest load: about 96 rolls (≈ 1,360 m² at 100 mm), only around 1.4 t. Full by space.',
        tw:'18 tile pallets on the floor and about 50 boxed WCs above: ≈ 18.6 t, and the box is full.',
        ti:'20 tile pallets with about 46 rolls on top: ≈ 19 t. The rolls use space the tile can\'t.',
        twi:'All three in one box: 16 tile pallets, about 30 WCs and 25 rolls, ≈ 16.3 t.' },
  c40:{ t:'A 40ft takes only 27 tile pallets (≈ 1,170 m², 25 t) before the road weight limit. Two thirds of the box stay empty.',
        w:'About 185 boxed WCs fill a 40ft by space, at only around 7.4 t.',
        i:'About 190 rolls (≈ 2,700 m² at 100 mm), under 3 t. Full by space.',
        tw:'21 tile pallets plus about 135 WCs: ≈ 24.7 t and full. The best use of a 40ft.',
        ti:'25 tile pallets plus about 130 rolls: ≈ 24.9 t. The rolls ride in space the tile leaves empty.',
        twi:'20 tile pallets, about 80 WCs and 60 rolls: ≈ 22.5 t, full by space.' }
};
// Pallets: drawn side-on. box = tile boxes (≈ 2.2 cm each); top = items on the boxes: [type, x cm, y cm above the boxes]
const PAL = {
  t:  { box:30, top:[], note:'30 boxes of 60 × 120 = 43.2 m², about 0.9 t. Delivered across the UAE or shipped worldwide.' },
  w:  { box:0, top:[['wc',10,0],['wc',63,0],['wc',10,87],['wc',63,87]], note:'4 boxed one-piece WCs, two layers of two: about 0.2 t, ≈ 1.9 m high. For replacements that can\'t wait.' },
  i:  { box:0, top:[['roll',8,0],['roll',62,0],['roll',8,52],['roll',62,52],['roll',8,104],['roll',62,104]], note:'6 packed rolls, about 85 m² at 100 mm and only around 0.1 t: light enough to add to any order.' },
  tw: { box:15, top:[['wc',10,0],['wc',63,0]], note:'15 boxes of tile (21.6 m²) with 2 boxed WCs on top: about 0.5 t, one delivery.' },
  ti: { box:15, top:[['roll',8,0],['roll',62,0],['roll',8,52],['roll',62,52]], note:'15 boxes of tile with 4 rolls on top: about 0.5 t.' },
  twi:{ box:12, top:[['wc',8,0],['roll',62,0],['roll',62,52]], note:'12 boxes of tile, a boxed WC and 2 rolls: about 0.45 t on one pallet.' }
};
const PALK = { box:29, pallet:25, wc:40, roll:14.15 };
const SAN = [ // pictograms (36×36 cell)
  '<path d="M9 9h7v12H9zM13 21h15a0 0 0 0 1 0 0c0 5-4 8-9 8h-2l1 4h-6l1-4c-2-1-3-3-3-6z" />',            // WC
  '<path d="M6 17h24c0 6-5 10-12 10S6 23 6 17zM18 9v8M14 9h8" />'                                           // basin + tap
];
const ROLL_ICON = '<circle cx="18" cy="18" r="12"/><path d="M18 18m0 0c2 0 3 2 2 4s-5 2-6-1 1-7 5-7 8 3 7 8-6 9-11 7" />';
const FAM = D.families.find(f=>f.ready); const PAT = FAM.blockImgs;
const AIRCOL=['#E9E4DC','#463B37','#C9CFD1','#2F5A52','#F1EEE8','#A29D99','#A08A6E','#B9A385'];
const AIR = { boxes:24, m2PerBox:1.44, kgBox:29, wc:30, basin:18, pallet:12,
  note:'<b>Distributor sample pallet by air:</b> 120 × 100 cm plastic pallet (no fumigation needed), 24 boxes across 6–8 ranges in the base, a boxed WC and basin on top. About 153 cm high and 0.76 t: inside the ≈ 160 cm belly-hold limit and the aircraft floor-load limit.' };
let cxMode='c20', cxLoad='t', cxP=0;
const fmt=(v,d=0)=>v.toLocaleString('en-GB',{maximumFractionDigits:d,minimumFractionDigits:d});
function cxSVG(){
  const pats = PAT.map((p,i)=>`<pattern id="p${i}" patternUnits="objectBoundingBox" width="1" height="1"><image href="img/${p}.jpg" width="60" height="44" preserveAspectRatio="xMidYMid slice"/></pattern>`).join('');
  return `<svg class="cx-svg" viewBox="0 0 680 320" role="img" aria-label="Load builder"><defs>${pats}
    <pattern id="rib" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#b8562f"/><rect width="4" height="10" fill="#a94c28"/></pattern></defs>
    <g id="cxg"></g></svg>`;
}
const iconCell=(x,y,cell,bg,icon,sw=1.6)=>`<g transform="translate(${x} ${y})"><rect width="${cell}" height="${cell}" rx="3" fill="${bg}"/><g fill="none" stroke="#2A201C" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${icon}</g></g>`;
function setStats(t, sp, spLabel, m2, contents, note){
  $('#cx-t').textContent=t; $('#cx-v').textContent=sp; $('#cx-vl').textContent=spLabel; $('#cx-m2').textContent=m2;
  $('#cx-c').innerHTML=contents; $('#cx-note').innerHTML=note;
  const sl=$('#cx-range'); if(sl && document.activeElement!==sl) sl.value=Math.round(cxP*100);
  const lg=$('#cx-load'); if(lg) lg.hidden = cxMode==='air';
  const mi=$('#cx-mixin'); if(mi){ mi.hidden = !(cxLoad==='x' && cxMode!=='air'); if(!mi.hidden && mi.dataset.for!==(cxMode==='pal'?'pal':'c')) buildMixIn(); }
}
function buildMixIn(){
  const mi=$('#cx-mixin'), key=cxMode==='pal'?'pal':'c'; mi.dataset.for=key;
  mi.innerHTML=MIXF[key].map(([k,lab,st,max])=>`<label class="mx"><span>${lab}</span><button type="button" data-k="${k}" data-d="-${st}" aria-label="Fewer ${lab.toLowerCase()}">−</button><input type="number" inputmode="numeric" min="0" max="${max}" step="${st}" data-k="${k}" aria-label="${lab}"><button type="button" data-k="${k}" data-d="${st}" aria-label="More ${lab.toLowerCase()}">+</button></label>`).join('');
  fillMixIn();
  mi.querySelectorAll('button').forEach(b=>b.onclick=()=>{ const v=MIXIN[cxMode]; const f=MIXF[key].find(x=>x[0]===b.dataset.k); v[b.dataset.k]=Math.max(0,Math.min(f[3],(v[b.dataset.k]||0)+(+b.dataset.d))); fillMixIn(); cxP=1; drawCX(); });
  mi.querySelectorAll('input').forEach(i=>i.oninput=()=>{ const v=MIXIN[cxMode]; const f=MIXF[key].find(x=>x[0]===i.dataset.k); v[i.dataset.k]=Math.max(0,Math.min(f[3],Math.round(+i.value||0))); cxP=1; drawCX(); });
}
function fillMixIn(){ const v=MIXIN[cxMode]; $$('#cx-mixin input').forEach(i=>{ if(document.activeElement!==i) i.value=v[i.dataset.k]||0; }); }
function drawContainer(g){
  const m=VESSEL[cxMode], mine=cxLoad==='x', p= mine ? MIXIN[cxMode] : PLAN[cxMode][cxLoad];
  const parts=[['tile',p.tile||0],['wc',p.wc||0],['roll',p.roll||0]].filter(x=>x[1]>0)
    .map(([k,n])=>({k, n, cells: k==='tile'? n : Math.round(n*U[k].v/CELL_V)}));
  const seq=[]; parts.forEach(pt=>{ for(let i=0;i<pt.cells;i++) seq.push(pt.k); });
  const total=m.cols*m.rows, shown=Math.round(cxP*seq.length);
  const cell=36, gap=3, iw=m.cols*(cell+gap)+gap, ih=m.rows*(cell+gap)+gap, x0=(680-iw)/2, y0=300-ih-14;
  let s=`<rect x="${x0-14}" y="${y0-14}" width="${iw+28}" height="${ih+28}" rx="6" fill="url(#rib)"/><rect x="${x0}" y="${y0}" width="${iw}" height="${ih}" fill="#2a201c" opacity=".88"/>`;
  s+=`<text x="${x0-14}" y="${y0-24}" fill="currentColor" font-family="JetBrains Mono" font-size="13">${m.name.toUpperCase()} · ${LOADS.find(l=>l[0]===cxLoad)[1].toUpperCase()}</text>`;
  let k=0;
  for(let r=m.rows-1;r>=0;r--) for(let c=0;c<m.cols;c++){
    const x=x0+gap+c*(cell+gap), y=y0+gap+r*(cell+gap);
    if(k<shown){ const t=seq[k];
      s+= t==='tile' ? `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="3" fill="url(#p${k%PAT.length})" stroke="rgba(255,255,255,.5)" stroke-width="1"/>`
        : t==='wc' ? iconCell(x,y,cell,'#F6F2EA',SAN[0]) : iconCell(x,y,cell,'#F2CE52',ROLL_ICON,1.5); }
    else if(k<total) s+=`<rect x="${x+.5}" y="${y+.5}" width="${cell-1}" height="${cell-1}" rx="3" fill="none" stroke="rgba(255,255,255,.18)" stroke-dasharray="3 3"/>`;
    k++;
  }
  g.innerHTML=s; g.ownerSVGElement.setAttribute('viewBox', `${x0-44} ${y0-60} ${iw+88} ${ih+118}`);
  // figures scale with what is loaded so far, category by category
  let done=shown, T=0, V=0, m2=0; const got={};
  parts.forEach(pt=>{ const f=Math.max(0,Math.min(1, done/pt.cells)); done-=pt.cells; const n=pt.n*f; got[pt.k]=n; T+=n*U[pt.k].t; V+=n*U[pt.k].v; if(pt.k==='tile') m2+=n*U.tile.m2; });
  const full=cxP>.999, byW = (T/m.capT) >= (V/m.capV);
  if(mine){ // the visitor's own load: does it fit?
    const allT=parts.reduce((a,pt)=>a+pt.n*U[pt.k].t,0), allV=parts.reduce((a,pt)=>a+pt.n*U[pt.k].v,0);
    const overT=allT-m.capT, overV=allV-m.capV, fits=overT<=0 && overV<=0;
    const msg = fits ? `<b>It fits.</b> ${fmt(allT,1)} t of the ${m.capT} t we load a ${m.name.replace(' container','')} to, and ${fmt(allV/m.capV*100)}% of the space. ${allT/m.capT>allV/m.capV?'Weight is the limit to watch.':'Space is the limit to watch.'}`
      : `<b>Too much for one ${m.name.replace(' container','')}.</b> ${overT>0?`Over the weight limit by ${fmt(overT,1)} t. `:''}${overV>0?`Over the space by about ${fmt(overV,1)} m³. `:''}Take some out, switch to a 40ft, or split it across two containers.`;
    const c=[]; parts.forEach(pt=>{ const n=got[pt.k]; if(pt.k==='tile') c.push(`<span><i class="ci tl"></i>${fmt(n)} tile pallets · ${fmt(n*U.tile.m2)} m²</span>`); if(pt.k==='wc') c.push(`<span><i class="ci wc"></i>${fmt(n)} boxed WCs</span>`); if(pt.k==='roll') c.push(`<span><i class="ci rl"></i>${fmt(n)} rolls · ${fmt(n*U.roll.m2)} m²</span>`); });
    if(full) c.push(`<span class="lim ${fits?'ok':'over'}">${fits?'Fits':'Over the limit'}</span>`);
    return setStats(fmt(T,1), fmt(V/m.capV*100), '% of the space', fmt(m2), c.join(''), msg);
  }
  const c=[]; if(got.tile!=null) c.push(`<span><i class="ci tl"></i>${fmt(got.tile)} tile pallets</span>`); if(got.wc!=null) c.push(`<span><i class="ci wc"></i>${fmt(got.wc)} boxed WCs</span>`); if(got.roll!=null) c.push(`<span><i class="ci rl"></i>${fmt(got.roll)} rolls · ${fmt(got.roll*U.roll.m2)} m²</span>`);
  if(full) c.push(`<span class="lim">${byW?'Weight limit reached':'Full by space'}</span>`);
  setStats(fmt(T,1), fmt(Math.min(100,V/m.capV*100)), '% of the space', fmt(m2), c.join(''), `<b>Example ${m.name.replace(' container','')}:</b> ${NOTE[cxMode][cxLoad]}`);
}
function drawPallet(g){
  const mine=cxLoad==='x', P= mine ? palMix(MIXIN.pal) : PAL[cxLoad], u=2.5, W=120*u, x0=60, base=300, palH=15*u, boxH=2.2*u;
  const items=P.box+P.top.length, shown=Math.round(cxP*items);
  let s=`<rect x="${x0-10}" y="${base-palH}" width="${W+20}" height="${palH*.4}" rx="3" fill="#b48659"/>`;
  for(const fx of [0,.45,.9]) s+=`<rect x="${x0-10+(W+20)*fx}" y="${base-palH*.6}" width="${(W+20)*.1}" height="${palH*.6}" fill="#8d6640"/>`;
  let y=base-palH; let bx=0;
  for(let i=0;i<P.box;i++){ y-=boxH; const on=i<shown; if(on) bx++;
    s+= on ? `<rect x="${x0+2}" y="${y}" width="${W-4}" height="${boxH-.6}" rx="1" fill="${AIRCOL[Math.floor(i/3)%AIRCOL.length]}"/><rect x="${x0+2}" y="${y}" width="${W-4}" height=".8" fill="rgba(255,255,255,.35)"/>`
           : `<rect x="${x0+2}" y="${y}" width="${W-4}" height="${boxH-.6}" fill="none" stroke="rgba(255,255,255,.15)" stroke-dasharray="2 2"/>`; }
  const top=y; let wc=0, rl=0, maxY=top;
  P.top.forEach(([t,xc,yc],j)=>{ const on=P.box+j<shown;
    if(t==='wc'){ const w=45*u,h=85*u,X=x0+xc*u,Y=top-yc*u-h; maxY=Math.min(maxY,Y); if(on) wc++;
      s+= on ? `<g><rect x="${X}" y="${Y}" width="${w}" height="${h}" rx="4" fill="#F6F2EA"/><g transform="translate(${X+w/2-27} ${Y+h/2-27}) scale(1.5)" fill="none" stroke="#2A201C" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${SAN[0]}</g></g>`
             : `<rect x="${X}" y="${Y}" width="${w}" height="${h}" rx="4" fill="none" stroke="rgba(255,255,255,.25)" stroke-dasharray="4 4"/>`; }
    else { const d=50*u, X=x0+xc*u, Y=top-yc*u-d; maxY=Math.min(maxY,Y); if(on) rl++;
      s+= on ? `<g><circle cx="${X+d/2}" cy="${Y+d/2}" r="${d/2-2}" fill="#F2CE52"/><g transform="translate(${X+d/2-36} ${Y+d/2-36}) scale(2)" fill="none" stroke="#B88A1E" stroke-width="1.3" stroke-linecap="round">${ROLL_ICON}</g></g>`
             : `<circle cx="${X+d/2}" cy="${Y+d/2}" r="${d/2-2}" fill="none" stroke="rgba(255,255,255,.25)" stroke-dasharray="4 4"/>`; }
  });
  const hcm=Math.round((base-maxY)/u);
  s+=`<text x="${x0-10}" y="${maxY-16}" fill="currentColor" font-family="JetBrains Mono" font-size="13">PALLET · ${LOADS.find(l=>l[0]===cxLoad)[1].toUpperCase()}</text>`;
  s+=`<text x="${x0-10}" y="${base+22}" fill="currentColor" font-family="JetBrains Mono" font-size="12">120 × 100 cm · ≈ ${hcm} cm high</text>`;
  if(mine){ const ly=base-PAL_MAX.h*u; s+=`<line x1="${x0-30}" y1="${ly}" x2="${x0+W+30}" y2="${ly}" stroke="#F6F2EA" stroke-dasharray="6 5" opacity=".7"/><text x="${x0+W+34}" y="${ly+4}" fill="currentColor" font-family="JetBrains Mono" font-size="12">${PAL_MAX.h} cm</text>`; }
  g.innerHTML=s; const vy=Math.min(maxY-40, base-200*u); g.ownerSVGElement.setAttribute('viewBox', `20 ${vy} ${W+130} ${base-vy+40}`);
  const kg=(shown>0?PALK.pallet:0)+bx*PALK.box+wc*PALK.wc+rl*PALK.roll;
  const c=[]; if(P.box) c.push(`<span><i class="ci tl"></i>${bx} boxes of tile</span>`); if(P.top.some(t=>t[0]==='wc')) c.push(`<span><i class="ci wc"></i>${wc} boxed WC${wc===1?'':'s'}</span>`); if(P.top.some(t=>t[0]==='roll')) c.push(`<span><i class="ci rl"></i>${rl} rolls · ${fmt(rl*U.roll.m2)} m²</span>`);
  let note=`<b>Example pallet:</b> ${P.note}`;
  if(mine){ const v=MIXIN.pal, allKg=PALK.pallet+v.box*PALK.box+v.wc*PALK.wc+v.roll*PALK.roll, allH=palMix(v).h, fits=allKg<=PAL_MAX.kg && allH<=PAL_MAX.h;
    note = fits ? `<b>It fits on one pallet.</b> About ${fmt(allKg)} kg and ${allH} cm high, inside the ${PAL_MAX.h} cm and ${fmt(PAL_MAX.kg)} kg we plan a pallet to.`
                : `<b>Too much for one pallet.</b> ${allH>PAL_MAX.h?`${allH} cm high against our ${PAL_MAX.h} cm. `:''}${allKg>PAL_MAX.kg?`${fmt(allKg)} kg against our ${fmt(PAL_MAX.kg)} kg. `:''}Split it across two pallets, or step up to a container.`;
    if(cxP>.999) c.push(`<span class="lim ${fits?'ok':'over'}">${fits?'Fits':'Over the limit'}</span>`); }
  setStats(fmt(kg/1000,2), fmt(cxP>.999?hcm:Math.round(hcm*cxP)), 'cm high', fmt(bx*1.44,1), c.join(''), note);
}
function drawAir(g){
  const u=2.5, W=120*u, x0=60, base=300, palH=15*u, boxH=2.2*u, n=AIR.boxes;
  const total=n+2, shown=Math.round(cxP*total);
  let s='';
  const lim=base-160*u;
  s+=`<line x1="${x0-30}" y1="${lim}" x2="${x0+W+30}" y2="${lim}" stroke="#F6F2EA" stroke-dasharray="6 5" opacity=".7"/><text x="${x0+W+34}" y="${lim+4}" fill="currentColor" font-family="JetBrains Mono" font-size="12">160 cm max</text>`;
  s+=`<rect x="${x0}" y="${base-palH}" width="${W}" height="${palH*.35}" rx="3" fill="#2A201C"/>`;
  for(const fx of [0,.45,.9]) s+=`<rect x="${x0+W*fx}" y="${base-palH*.65}" width="${W*.1}" height="${palH*.65}" rx="2" fill="#2A201C"/>`;
  let y=base-palH;
  for(let k=0;k<n;k++){ y-=boxH; if(k<shown){ const col=AIRCOL[Math.floor(k/3)%AIRCOL.length]; s+=`<rect x="${x0+2}" y="${y}" width="${W-4}" height="${boxH-.6}" rx="1" fill="${col}"/><rect x="${x0+2}" y="${y}" width="${W-4}" height=".8" fill="rgba(255,255,255,.35)"/>`; }
    else s+=`<rect x="${x0+2}" y="${y}" width="${W-4}" height="${boxH-.6}" fill="none" stroke="rgba(255,255,255,.15)" stroke-dasharray="2 2"/>`; }
  const top=y, wcW=45*u, wcH=85*u, bW=65*u, bH=25*u;
  const draw=(x,yy,w,h,icon,on)=> on ? `<g><rect x="${x}" y="${yy}" width="${w}" height="${h}" rx="4" fill="#F6F2EA"/><g transform="translate(${x+w/2-27} ${yy+h/2-27}) scale(1.5)" fill="none" stroke="#2A201C" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${icon}</g></g>`
                                     : `<rect x="${x}" y="${yy}" width="${w}" height="${h}" rx="4" fill="none" stroke="rgba(255,255,255,.25)" stroke-dasharray="4 4"/>`;
  s+=draw(x0+6, top-wcH, wcW, wcH, SAN[0], shown>n);
  s+=draw(x0+6+wcW+8, top-bH, bW, bH, SAN[1], shown>n+1);
  s+=`<text x="${x0}" y="${base+20}" fill="currentColor" font-family="JetBrains Mono" font-size="12">PLASTIC PALLET · 120 × 100 cm · tile box ≈ 2.2 cm</text>`;
  g.innerHTML=s; g.ownerSVGElement.setAttribute('viewBox', `20 ${lim-30} ${W+170} ${base-lim+60}`);
  const bx=Math.min(shown,n), kg=bx*AIR.kgBox+(shown>n?AIR.wc:0)+(shown>n+1?AIR.basin:0)+AIR.pallet*(shown>0?1:0);
  const c=[`<span><i class="ci tl"></i>${bx} boxes of tile</span>`,`<span><i class="ci wc"></i>${shown>n?1:0} WC · ${shown>n+1?1:0} basin</span>`];
  setStats(fmt(kg/1000,2), fmt(Math.round(Math.min(153, 153*cxP))), 'cm high', fmt(bx*AIR.m2PerBox,1), c.join(''), AIR.note);
}
function drawCX(){
  const g=$('#cxg'); if(!g) return;
  if(cxMode==='air') return drawAir(g);
  if(cxMode==='pal') return drawPallet(g);
  drawContainer(g);
}
function cxBlock(start='c20', load='t', free=false, only=null){
  const VS=[['c20','20ft'],['c40','40ft'],['pal','Pallet'],['air','Air sample']].filter(v=>!only||only.includes(v[0]));
  const pal=start==='pal';
  return `<section class="block b-lagoon${free?' cx-free':''}" id="cx" data-start="${start}" data-load="${load}"><div class="wrap cx">
    <div><span class="kicker">The load builder</span><h2 class="split-lines" style="margin-top:16px">${pal?'Build your <em>pallet</em>.':'Build your <em>container</em>.'}</h2>
      <p class="lead" style="margin-top:20px">${pal?'Pick a ready-made pallet or set your own mix of tile boxes, WCs and rolls, and see the height and weight.':'Pick a ready-made load or set your own mix of tile pallets, WCs and rolls. Tile sits on the floor until the weight limit; toilets and rolls fill the space above.'}</p>
      <div class="cx-toggle" role="group" aria-label="Container or pallet">${VS.map(v=>`<button data-m="${v[0]}" aria-pressed="${v[0]===start}">${v[1]}</button>`).join('')}</div>
      <div class="cx-load" id="cx-load" role="group" aria-label="Load">${LOADS.map(l=>`<button type="button" data-l="${l[0]}" aria-pressed="${l[0]===load}">${l[1]}</button>`).join('')}</div>
      <div class="cx-mixin" id="cx-mixin" hidden></div>
      <div class="cx-stats"><div><b id="cx-t">0</b><span>tonnes</span></div><div><b id="cx-v">0</b><span id="cx-vl">% of the space</span></div><div><b id="cx-m2">0</b><span>m² of tile</span></div></div>
      <p class="cx-c" id="cx-c"></p>
      <p class="cx-note" id="cx-note"></p>
      <label class="kicker" for="cx-range" style="display:block;margin-top:12px">Load it by hand</label><input id="cx-range" type="range" min="0" max="100" value="0">
      <p class="note" style="opacity:.8">Example plans, approximate: tile pallet of 60 × 120 ≈ 0.92 t and 0.7 m³; boxed one-piece WC ≈ 40 kg and 0.3 m³; 100 mm Spacesaver roll ≈ 14 kg and 0.29 m³ packed. Every quote comes with a load plan.</p>
    </div>
    <div>${cxSVG()}<div class="legend"><span><i style="background:linear-gradient(135deg,var(--gold),var(--noir))"></i>Tile</span><span><i style="background:var(--onyx)"></i>Boxed WC</span><span><i style="background:#F2CE52"></i>Insulation roll</span>${pal?'<span>Pallet drawn side-on: tile boxes ≈ 2.2 cm each, WC carton ≈ 85 cm high, packed roll ≈ 50 cm across</span>':'<span><i style="border:1px dashed #fff"></i>Empty space</span><span>1 block ≈ 0.7 m³: one tile pallet, about 2 WCs or 2 rolls</span>'}</div></div>
  </div></section>`;
}
function initCX(){
  if(!$('#cx')) return;
  const sync=()=>{ $$('.cx-toggle button').forEach(x=>x.setAttribute('aria-pressed', x.dataset.m===cxMode)); $$('#cx-load button').forEach(x=>x.setAttribute('aria-pressed', x.dataset.l===cxLoad)); };
  $$('.cx-toggle button').forEach(b=>b.onclick=()=>{ cxMode=b.dataset.m; sync(); if(cxLoad==='x') buildMixIn(); drawCX(); });
  $$('#cx-load button').forEach(b=>b.onclick=()=>{ cxLoad=b.dataset.l; sync(); if(cxLoad==='x'){ buildMixIn(); cxP=1; } drawCX(); });
  $('#cx-range').oninput=e=>{ cxP=e.target.value/100; drawCX(); };
  cxMode=$('#cx').dataset.start||'c20'; cxLoad=$('#cx').dataset.load||'t'; sync();
  cxP = 0; if(cxLoad==='x') buildMixIn(); drawCX();
  const free=$('#cx').classList.contains('cx-free');
  if(hasG() && !reduce){
    const upd=s=>{ cxP=s.progress; drawCX(); };
    if(free) ScrollTrigger.create({ trigger:'#cx .cx-svg', start:'top 90%', end:'top 35%', scrub:.4, onUpdate:upd });
    else if(desk() || mobPin()) ScrollTrigger.create({ trigger:'#cx', start:'top top', end:desk()?'+=900':'+=700', pin:true, scrub:.4, onUpdate:upd, anticipatePin:1 });
    else ScrollTrigger.create({ trigger:'#cx .cx-svg', start:'top 85%', end:'bottom 30%', scrub:.4, onUpdate:upd });
  } else { cxP = 1; drawCX(); }
}

function famSwitch(page){
  const act = ['toilets','insulation'].includes(page) ? page : 'tiles';
  return `<div class="famsw" role="group" aria-label="Product">${D.families.map(f=> !f.ready ? `<span class="off" title="Coming soon">${f.word} · soon</span>` : f.id===act ? `<span class="on">${f.word}</span>` : `<a class="lk" href="#${f.id}">${f.word} →</a>`).join('')}</div>`;
}

/* ---------- pages ---------- */
const P = {};
const HV = (()=>{ try{ const q=new URLSearchParams(location.search).get('hero'); return ['a','b','c'].includes(q)?q:'b'; }catch(e){ return 'b'; } })();
const CREDS = `<ul class="creds"><li>Shipped worldwide from the UAE</li><li>ISO 13006 · EN 14411</li><li>20ft · 40ft · pallets · air samples</li></ul>`;
const SEAL = `<svg class="seal" viewBox="0 0 120 120" aria-hidden="true"><defs><path id="sealp" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0"/></defs><circle cx="60" cy="60" r="58" fill="var(--noir)"/><text><textPath href="#sealp" textLength="272" lengthAdjust="spacing">THE TRADE HUB · RAS AL KHAIMAH · WORLDWIDE ·</textPath></text><g transform="translate(60 60) rotate(12)"><rect x="-13" y="-13" width="13" height="13" fill="#D3A257"/><rect x="0" y="-13" width="13" height="13" fill="#0E8E8A"/><rect x="-13" y="0" width="13" height="13" fill="#E6D2B0"/><rect x="0" y="0" width="13" height="13" fill="#F6F2EA"/></g></svg>`;
const HERO_COPY = (cls='')=>`<div class="hero-copy ${cls}">
  <span class="kicker">Ras Al Khaimah · Jebel Ali · Worldwide</span>
  <h1 class="hero-h" style="margin-top:18px"><span class="ln"><span>Marble looks,</span></span><span class="ln"><span><em>straight</em> from</span></span><span class="ln"><span>the kiln.</span></span></h1>
  <p class="lead">RAK porcelain tiles, Starvoll toilets and Isover glass wool rolls, shipped by the 20ft or 40ft container to buyers worldwide, and by the pallet from our Jebel Ali warehouse, across the UAE or worldwide for fast orders.</p>
  <div class="ctas"><a class="pill copper" href="#containers">Containers worldwide</a><a class="pill" href="#pallets">Pallets worldwide</a><a class="pill ghost" href="#tiles">See the tiles</a></div>
  ${CREDS}
</div>`;
const FLA = [
  ['t-cafe',      49, 15, 170, .9, -9, 0],
  ['t-calacatta', 89, 68, 160, .6, 8, 1],
  ['t-onyx',      -5, 88, 210, .7, 11, 1],
  ['sp:#D3A257',  93, 14, 40, 1.2, 20, 1],
  ['sp:#C2623A',  44, 52, 30, .6, 35, 1]
];
const FLAM = [
  ['t-cafe',      -6, 2, 40, .9, -8],
  ['t-glaze',     66, 6, 38, 1.1, -5],
  ['sp:#D3A257',  40, 2, 8, 1.2, 20]
];
function heroA(){ return `<section class="hero hero-a"><div class="wrap hero-grid">${HERO_COPY()}
  <figure class="hero-pic"><div class="arch"><img src="img/mega-slabs-stone.jpg" alt="Kitchen with stone-look porcelain slab island and floor, RAK Ceramics" loading="eager"></div>
    <figcaption class="tag"><span class="kicker">In this room</span><b>Stone-look slabs &amp; floor</b></figcaption>${SEAL}</figure>
</div>${floats(FLA)}${floatsMobileSet(FLAM)}</section>`; }
function heroB(){ return `<section class="hero hero-b"><img class="hb-img" src="img/mega-slabs-stone.jpg" alt="Kitchen with stone-look porcelain slab island and floor, RAK Ceramics" loading="eager"><div class="hb-shade"></div>
  <div class="wrap">${HERO_COPY('on-dark')}</div>${SEAL}</section>`; }
function heroC(){ return `<section class="hero hero-c"><div class="wrap">${HERO_COPY('center')}</div>
  <div class="fan"><figure style="--r:-7deg;--y:40px"><img src="img/tiles-marble.jpg" alt="Marble-look porcelain bathroom, RAK Ceramics"></figure><figure class="mid" style="--r:0deg;--y:0px"><img src="img/mega-slabs-stone.jpg" alt="Stone-look slab kitchen, RAK Ceramics"></figure><figure style="--r:7deg;--y:40px"><img src="img/bricks.jpg" alt="Glazed green wall tiles behind a bath, RAK Ceramics"></figure></div>
  ${floats(FL.filter(f=>f[0].startsWith('sp:')))}</section>`; }
P.home = ()=>`
${HV==='b'?heroB():HV==='c'?heroC():heroA()}
${marquee(['Calacatta','60 × 120','Café noir','Polished','Grey silk','120 × 120','Lappato','Travertine','20ft · 40ft','Zellige glaze','Honed','Jebel Ali pallets'])}
<section class="block b-white"><div class="wrap"><span class="kicker">What we supply</span><h2 class="split-lines" style="margin-top:16px">Tiles, toilets, insulation.</h2>
<div class="grid3 lines3">
  <a class="tile-card" href="#tiles" style="background:var(--onyx)"><div class="ph"><img src="img/tiles-marble.jpg" alt="Marble-look porcelain bathroom" loading="lazy"></div><div class="tx"><span class="chip" style="background:#fff">RAK porcelain &amp; ceramic</span><h3 style="margin-top:12px">Tiles</h3><p style="margin-top:8px">Marble, stone, concrete and wood looks, by the container or the pallet.</p></div></a>
  <a class="tile-card" href="#toilets" style="background:var(--onyx)"><div class="ph"><img src="img/p/sv-l175-room.jpg" alt="Starvoll L175 WC in a bathroom" loading="lazy" style="object-position:50% 62%"></div><div class="tx"><span class="chip" style="background:#fff">Starvoll</span><h3 style="margin-top:12px">Toilets</h3><p style="margin-top:8px">One-piece and close-coupled WCs, led by the L175.</p></div></a>
  <a class="tile-card" href="#insulation" style="background:var(--onyx)"><div class="ph"><img src="img/p/is-spacesaver-2.jpg" alt="Glass wool loft roll being laid in a loft" loading="lazy"></div><div class="tx"><span class="chip" style="background:#fff">Isover</span><h3 style="margin-top:12px">Insulation rolls</h3><p style="margin-top:8px">Spacesaver glass wool rolls, 100 to 200 mm, CE and UKCA marked.</p></div></a>
</div></div></section>
<section class="block b-onyx"><div class="wrap">
  <span class="kicker">Two ways to buy</span><h2 class="split-lines" style="margin-top:16px;max-width:12ch">One factory. Two markets.</h2>
  <div class="split">
    <a class="card dark" href="#containers"><span class="chip" style="background:var(--copper);color:#fff">Worldwide</span><h3>Full containers to your port</h3>
      <p>For importers, merchants, developers and contractors in any market who want volume pricing on full loads.</p>
      <ul><li>20ft ≈ 1,080 m² · 40ft ≈ 1,170 m²</li><li>Mix ranges and colours in one load</li><li>Made to ISO 13006 and EN 14411 (CE)</li></ul><span class="pill gold">Containers →</span></a>
    <a class="card lag" href="#pallets"><span class="chip" style="color:var(--noir)">UAE &amp; worldwide</span><h3>Pallets for fast orders</h3>
      <p>From our Jebel Ali warehouse, for jobs that can't wait for a full container.</p>
      <ul><li>Delivered across the UAE</li><li>Shipped worldwide: shared container or air</li><li>Ideal for top-ups and replacement WCs and basins</li></ul><span class="pill" style="background:var(--onyx);color:var(--noir)">Pallets →</span></a>
  </div></div></section>
<section class="block b-gold hstrip" id="hs"><div class="wrap"><span class="kicker">The collections</span><h2 class="split-lines" style="margin:16px 0 40px">Every look a modern home asks for.</h2><p class="swipe-hint">Swipe to explore <span>→</span></p></div>
  <div class="htrack">${D.collections.map(c=>`<a class="hcard" href="#${c.id}"><div class="ph"><img src="${c.img}" alt="${esc(c.name)} tiles in a room setting"></div><div class="tx"><span class="chip">${esc(c.kicker)}</span><h3 style="margin-top:12px">${c.name}</h3><p>${esc(c.short)}</p></div></a>`).join('')}</div></section>
<div class="band"><img src="img/mega-slabs-marble.jpg" alt="Kitchen with large marble-effect porcelain slabs" class="band-img"><div class="cap"><span class="kicker">Mega slabs</span><h3 style="font-family:var(--display);font-weight:400;font-size:2.2rem;line-height:1;margin-top:8px">Islands, walls and worktops in one piece.</h3></div></div>
<section class="block b-noir"><div class="wrap"><span class="kicker" style="color:var(--gold)">By the numbers (approximate)</span><h2 class="split-lines" style="margin-top:16px;max-width:13ch">Heavy goods, simple maths.</h2>
  <div class="stats">
    <div class="stat"><b data-count="1080">1,080</b><span>m² of 60 × 120 in a 20ft</span></div>
    <div class="stat"><b data-count="23">23</b><span>tonnes of tile: where we stop a 20ft</span></div>
    <div class="stat"><b data-count="43.2" data-dec="1">43.2</b><span>m² on a Jebel Ali pallet</span></div>
    <div class="stat"><b data-count="2">2</b><span>ways to buy: containers and pallets</span></div>
  </div></div></section>
<section class="block b-onyx"><div class="wrap"><span class="kicker">How it works</span><h2 class="split-lines" style="margin-top:16px">From enquiry to unloading.</h2>
  <div class="steps">${[['Tell us','Ranges, colours, m² and where it needs to go.'],['Samples','We arrange samples so you see the real tile.'],['Quote','A written price per order: ex-works, to your port, or delivered.'],['Ship','We book, load and send the paperwork: invoice, packing list, B/L, DoP.']].map((s,i)=>`<div class="step"><b>${i+1}</b><h3>${s[0]}</h3><p style="margin-top:6px">${s[1]}</p></div>`).join('')}</div>
  <p style="margin-top:30px"><a class="pill" href="#how-it-works">The full process</a></p></div></section>
<section class="block b-travertine"><div class="wrap"><span class="kicker">Guides</span><h2 class="split-lines" style="margin-top:16px">Know before you order.</h2>
  <div class="grid3">${D.guides.slice(0,3).map(g=>`<a class="gcard b-${g.color}" href="#${g.id}"><span class="kicker">${g.read} read</span><h3>${esc(g.title)}</h3><span class="mono">Read →</span></a>`).join('')}</div></div></section>
<section class="block b-white"><div class="wrap grid2"><div><span class="kicker">FAQ</span><h2 class="split-lines" style="margin-top:16px">Straight answers.</h2></div>
  <div>${D.faq.slice(0,5).map(f=>`<details><summary>${esc(f[0])}</summary><p>${esc(f[1])}</p></details>`).join('')}<p style="margin-top:24px"><a class="pill ghost" href="#faq">All questions</a></p></div></div></section>
${cta('Ready when your next job is.')}`;

P.tiles = ()=> head('Tiles','Tiles for every <em>room</em>.','Six families of RAK porcelain and ceramic tile. Marble leads our range; everything else can ride in the same container.','b-onyx') + `
<section class="block b-white"><div class="wrap"><div class="grid3">${D.collections.map(c=>`<a class="tile-card" href="#${c.id}" style="background:var(--onyx)"><div class="ph"><img src="${c.img}" alt="${esc(c.name)} tiles" loading="lazy"></div><div class="tx"><span class="chip" style="background:#fff">${esc(c.kicker)}</span><h3 style="margin-top:12px">${c.name}</h3><p style="margin-top:8px;font-size:.95rem">${esc(c.short)}</p></div></a>`).join('')}</div>
<p class="note" style="margin-top:24px">Range availability changes; ask us for current lines and colours.</p></div></section>${cta()}`;

function linesTable(){
  return `<div class="tscroll"><table class="tbl stack"><thead><tr><th>Range / colour</th><th>Finish</th><th>Size</th><th>RAK code</th><th>Our price</th></tr></thead><tbody>${D.lines.map(l=>`<tr><td data-label="Range"><a href="#line-${l.id}">${esc(l.range)} ${esc(l.colour)}</a></td><td data-label="Finish">${l.finish}</td><td data-label="Size" style="white-space:nowrap">${l.size}</td><td data-label="RAK code" class="mono" style="font-size:.8rem">${l.code}</td><td data-label="Price" class="por">On request</td></tr>`).join('')}</tbody></table></div>
  <p class="note">Prices are quoted per order, by the container or the pallet.</p>`;
}
function collectionPage(c){
  return head(`<a href="#tiles">Tiles</a> / ${c.name}`, c.name, c.short, 'b-'+c.color) + `
<section class="block b-onyx"><div class="wrap grid2"><div class="pgal"><img src="${c.img}" alt="${esc(c.name)} tiles in a room setting"></div>
  <div><span class="kicker">${esc(c.kicker)}</span><p class="lead" style="margin-top:14px">${esc(c.body)}</p>
  <h3 style="margin-top:28px">Where it works</h3><ul style="margin:10px 0 0 18px">${c.uses.map(u=>`<li>${esc(u)}</li>`).join('')}</ul>
  <div class="ctas" style="margin-top:28px"><a class="pill" href="#quote">Ask for ${esc(c.name.toLowerCase())} prices</a><a class="pill ghost" href="#calculator">Calculator</a></div>
</div></div></section>
${c.lines ? `<section class="block b-white"><div class="wrap"><span class="kicker">Lines we quote</span><h2 class="split-lines" style="margin-top:16px">Large-format marble.</h2>${linesTable()}</div></section>` : `<section class="block b-white"><div class="wrap"><span class="kicker">Lines</span><h2 class="split-lines" style="margin-top:16px;max-width:14ch">Ask for current colours.</h2><p class="lead" style="margin-top:20px">We quote ${esc(c.name.toLowerCase())} ranges per order from RAK's current collection. Tell us the look, size and finish and we'll send options with codes, box data and samples.</p></div></section>`}
${cta()}`;
}
function linePage(l){
  const rel = D.lines.filter(x=>x.range===l.range && x.id!==l.id).concat(D.lines.filter(x=>x.range!==l.range)).slice(0,3);
  return head(`<a href="#tiles">Tiles</a> / <a href="#marble">Marble</a> / ${esc(l.colour)}`, `${esc(l.range)}<br><em>${esc(l.colour)}</em>`, `${l.finish} · ${l.size} · porcelain`, 'b-onyx') + `
<section class="block b-white"><div class="wrap grid2"><div><div class="pgal"><img src="${l.img}" alt="${esc(l.range+' '+l.colour)}"></div><p class="note">${esc(l.imgNote)}. Colour and veining vary; always check a sample.</p></div>
<div><table class="spec"><tr><td>Range</td><td>${esc(l.range)}</td></tr><tr><td>Colour</td><td>${esc(l.colour)}</td></tr><tr><td>Finish</td><td>${l.finish}</td></tr><tr><td>Size</td><td>${l.size}</td></tr><tr><td>Thickness</td><td>${l.thick}</td></tr><tr><td>Box</td><td>${l.box}</td></tr><tr><td>RAK code</td><td class="mono">${l.code}</td></tr><tr><td>The Trade Hub price</td><td class="por">On request: per container or pallet</td></tr></table>
<div class="ctas" style="margin-top:26px"><a class="pill copper" href="#quote">Quote this tile</a><a class="pill ghost" href="#calculator">How many boxes?</a></div>
<p class="note">"—" means not published by the sources we checked; confirmed on quotation.</p></div></div></section>
<section class="block b-travertine"><div class="wrap"><span class="kicker">Pairs well with</span><div class="grid3">${rel.map(r=>`<a class="tile-card" href="#line-${r.id}"><div class="ph"><img src="${r.img}" alt="" loading="lazy"></div><div class="tx"><h3>${esc(r.range)} ${esc(r.colour)}</h3><p style="margin-top:6px">${r.finish} · ${r.size}</p></div></a>`).join('')}</div></div></section>${cta('Want this in a container?','b-lagoon')}`;
}

P.containers = ()=> head('Containers','By the <em>container</em>, worldwide.','Tiles, toilets and insulation rolls in 20ft or 40ft loads, alone or mixed, shipped to your port. Build your load below and see what fits.','b-copper', '', 'Tiles · Toilets · Insulation') + `
${cxBlock('c20','x',true,['c20','c40'])}
<section class="block b-onyx"><div class="wrap grid2"><div><span class="kicker">20ft or 40ft?</span><h2 class="split-lines" style="margin-top:16px">Weight or space?</h2>
<p class="lead" style="margin-top:18px">Tile runs out of weight before it runs out of space. Toilets and rolls do the opposite. Mixing them fills both.</p></div><div>
 <div class="tscroll"><table class="tbl"><thead><tr><th></th><th>20ft</th><th>40ft</th></tr></thead><tbody>
 <tr><td>Space inside</td><td>≈ 33 m³</td><td>≈ 67 m³</td></tr>
 <tr><td>Weight we load to</td><td>≈ 23 t</td><td>≈ 25 t</td></tr>
 <tr><td>Tiles only</td><td>25 pallets · ≈ 1,080 m²</td><td>27 pallets · ≈ 1,170 m²</td></tr>
 <tr><td>Toilets only</td><td>≈ 90 boxed WCs</td><td>≈ 185 boxed WCs</td></tr>
 <tr><td>Insulation only</td><td>≈ 96 rolls · ≈ 1,360 m²</td><td>≈ 193 rolls · ≈ 2,700 m²</td></tr>
 <tr><td>Filled by</td><td>Weight (tile) or space (toilets, rolls)</td><td>Best for mixed loads</td></tr></tbody></table></div>
 <p class="note">We load below the container's own rating because the road is the real limit: typically 40 to 44 t gross including the truck, depending on the country. Many lines also add a heavy-load surcharge once a 20ft passes about 20 t gross. Figures are approximate; every quote comes with a load plan for your destination.</p></div></div></section>
<section class="block b-white"><div class="wrap"><span class="kicker">What you get</span><h2 class="split-lines" style="margin-top:16px">Paperwork done.</h2>
<div class="steps">${[['Commercial invoice','Values, codes and Incoterm for every product line, ready for your customs agent.'],['Packing list','Pallet by pallet: tile boxes and m², WCs and rolls, with weights.'],['Bill of lading','Issued by the shipping line for collection at your port.'],['Standards papers','Tiles: EN 14411 Declaration of Performance or ISO 13006 data. Insulation: Isover\'s EN 13162 declaration. Toilets: maker\'s test data on request.']].map((s,i)=>`<div class="step"><b>${i+1}</b><h3>${s[0]}</h3><p style="margin-top:6px">${s[1]}</p></div>`).join('')}</div>
<p style="margin-top:28px">We can also supply a certificate of origin. Routes and surcharges out of the Gulf change often, so each quote names the port, routing and charges on the day. <a href="#standards">Standards by country →</a></p></div></section>
${cta('Plan your first container.','b-gold')}`;

P.pallets = ()=> head('Pallets','By the <em>pallet</em>, worldwide.','Tiles, toilets and insulation rolls from our Jebel Ali warehouse, for jobs that can\'t wait for a full container: urgent top-ups, small projects, or replacement WCs. Build a pallet below.','b-zellige', '', 'Tiles · Toilets · Insulation') + `
${cxBlock('pal','x',true,['pal','air'])}
<section class="block b-onyx"><div class="wrap grid2"><div><span class="kicker">Typical pallets</span><h2 class="split-lines" style="margin-top:16px">Ready to go.</h2></div><div>
<div class="tscroll"><table class="tbl"><thead><tr><th></th><th>What's on it</th><th>Weight</th></tr></thead><tbody>
<tr><td>Tiles</td><td>30 boxes of 60 × 120 · 43.2 m²</td><td>≈ 0.9 t</td></tr>
<tr><td>Toilets</td><td>4 boxed one-piece WCs, e.g. Starvoll L175</td><td>≈ 0.2 t</td></tr>
<tr><td>Insulation</td><td>6 Spacesaver rolls · ≈ 85 m² at 100 mm</td><td>≈ 0.1 t</td></tr>
<tr><td>Mixed</td><td>Tile boxes on the base, WCs or rolls on top</td><td>≈ 0.5 t</td></tr></tbody></table></div>
<table class="spec"><tr><td>From</td><td>${esc(C.warehouse)}</td></tr><tr><td>In the UAE</td><td>Collect, or delivered across the Emirates</td></tr><tr><td>Worldwide</td><td>By sea in a shared container (LCL); air for samples, toilets and small urgent orders</td></tr><tr><td>We plan to</td><td>About ${PAL_MAX.h} cm high and ${PAL_MAX.kg.toLocaleString('en-GB')} kg per pallet</td></tr><tr><td>Prices</td><td class="por">On request: AED in the UAE, USD or EUR for export</td></tr></table>
<p class="note">Pallet make-up varies by product and size; we confirm it on the quote. A full tonne of tile by air costs more than the tiles are worth, so heavy tile pallets go by sea.</p></div></div></section>
<section class="block b-white"><div class="wrap"><span class="kicker">When a pallet beats a container</span><h2 class="split-lines" style="margin-top:16px;max-width:14ch">Fast, small, urgent.</h2>
<div class="grid3">${[['Top-up orders','Short on a range mid-job? Send the code and m² and we\'ll ship a pallet to match.'],['Replacement toilets','Broken WC on site? Boxed Starvoll WCs can fly or ship fast.'],['Mix a pallet','Tile boxes, a WC and a few rolls of insulation on one pallet and one delivery.']].map(s=>`<div class="gcard b-onyx" style="min-height:200px"><h3>${s[0]}</h3><p>${s[1]}</p></div>`).join('')}</div></div></section>
<section class="block b-noir"><div class="wrap grid2"><div><span class="kicker" style="color:var(--gold)">For distributors</span><h2 class="split-lines" style="margin-top:16px">The sample pallet, by air.</h2>
<p class="lead" style="margin-top:20px">Everything a new distributor needs to judge the range, on one pallet that flies in the belly of a passenger aircraft: tile boxes from several ranges in the base, a boxed WC and basin on top.</p>
<p style="margin-top:22px"><a class="pill gold" href="#quote">Request a sample pallet</a></p></div>
<div><table class="spec" style="color:var(--onyx)"><tr><td>Pallet</td><td>Plastic, 120 × 100 cm (no ISPM 15 fumigation needed)</td></tr><tr><td>Max height</td><td>≈ 160 cm including pallet (lower-deck limit; some aircraft allow ≈ 163 cm)</td></tr><tr><td>Base</td><td>≈ 24 boxes of tile across 6–8 ranges, ≈ 35 m², ≈ 0.7 t</td></tr><tr><td>Top</td><td>1 boxed WC (≈ 45 × 75 × 85 cm) + 1 boxed basin</td></tr><tr><td>Gross weight</td><td>≈ 760 kg, kept under ≈ 1 t for aircraft floor loading</td></tr><tr><td>Transit</td><td>Typically 1–3 days airport to airport from Dubai</td></tr><tr><td>Freight</td><td>Charged on actual weight; quoted on the day</td></tr></table>
<p class="note" style="color:var(--onyx)">Example build. Final contents, box sizes and weight are confirmed on the quote and with the airline.</p></div></div></section>
${cta('Need a pallet this week?','b-gold')}`;

P['how-it-works'] = ()=> head('How it works','Six steps, <em>no surprises</em>.','How an order moves from your enquiry to tiles on site.','b-gold') + `
<section class="block b-onyx"><div class="wrap article">${[['1. Enquiry','Send ranges, colours, quantities and your delivery point. Not sure yet? Tell us the job and we will suggest lines.'],['2. Samples','We arrange samples so you can check colour, veining and finish.'],['3. Written quote','Per order, in USD or EUR for containers, or AED in the UAE: ex-works, CIF to your port, or delivered. It names the routing and surcharges on the day.'],['4. Confirm and pay','You confirm in writing. Payment terms are agreed per order.'],['5. Load and ship','Containers: we book, plan the load by weight and send the documents. Pallets: prepared at Jebel Ali, then delivered in the UAE or shipped by shared container or air.'],['6. Arrival','Containers: your customs agent clears the goods at the destination port under your country\'s duty and tax rules. Pallets in the UAE: collect or take delivery.']].map(s=>`<h3>${s[0]}</h3><p>${s[1]}</p>`).join('')}</div></section>${cta()}`;

P.calculator = ()=> head('Calculator','How much <em>tile</em>?','Work out boxes, pallets, weight and container fit. Change the assumptions to match your tile.','b-lagoon') + `
<section class="block b-onyx"><div class="wrap calc"><form id="calcf" onsubmit="return false">
<div class="f"><label>Area to cover (m²)<input id="ca" type="number" min="0" value="250"></label><label>Waste allowance (%)<input id="cw" type="number" min="0" max="40" value="10"></label>
<label>m² per box<input id="cm" type="number" step="0.01" value="1.44"></label><label>kg per box<input id="ck" type="number" step="0.1" value="29"></label>
<label>Boxes per pallet<input id="cp" type="number" value="30"></label><label>Empty pallet weight (kg)<input id="cpw" type="number" value="21"></label>
<label>20ft tile allowance (kg)<input id="c20" type="number" value="23000"></label><label>40ft tile allowance (kg)<input id="c40" type="number" value="25000"></label></div>
<p class="note">Defaults: RAK 60 × 120 cm, 9 mm, 2 tiles per box. Allowances include pallets and keep the lorry legal on 44-tonne roads; lower them for 40-tonne countries.</p></form>
<div class="res" aria-live="polite"><span class="kicker" style="color:var(--gold)">Your order</span>
<div><span>m² to order (inc. waste)</span><b id="r1"></b></div><div><span>Boxes</span><b id="r2"></b></div><div><span>Pallets</span><b id="r3"></b></div><div><span>Weight</span><b id="r4"></b></div><div><span>Share of a 20ft</span><b id="r5"></b></div><div><span>Share of a 40ft</span><b id="r6"></b></div>
<p style="margin-top:16px;font-size:.9rem;opacity:.85" id="r7"></p><a class="pill gold" href="#quote" style="margin-top:12px">Quote this</a></div></div></section>`;
function initCalc(){
  const f=$('#calcf'); if(!f) return; const v=id=>parseFloat($('#'+id).value)||0;
  const run=()=>{ const m2=v('ca')*(1+v('cw')/100), boxes=Math.ceil(m2/Math.max(v('cm'),.01)), pal=boxes/Math.max(v('cp'),1), kg=boxes*v('ck')+Math.ceil(pal)*v('cpw');
    const n=(x,d=0)=>x.toLocaleString('en-GB',{maximumFractionDigits:d});
    $('#r1').textContent=n(boxes*v('cm'),1)+' m²'; $('#r2').textContent=n(boxes); $('#r3').textContent=n(pal,1); $('#r4').textContent=n(kg/1000,2)+' t';
    $('#r5').textContent=n(kg/v('c20')*100)+'%'; $('#r6').textContent=n(kg/v('c40')*100)+'%';
    $('#r7').textContent = kg>v('c40') ? 'More than one 40ft: split across containers.' : kg>v('c20')*0.6 ? 'Container territory: ask for a container quote.' : 'Pallet territory: ideal for a UAE order from Jebel Ali.'; };
  $$('input',f).forEach(i=>i.oninput=run); run();
}

P.standards = ()=> head('Standards','Built to the <em>standard</em> your market asks for.','RAK makes porcelain to the international standard ISO 13006 and the European EN 14411. Here is how that lines up with the standards buyers ask for around the world.','b-zellige') + `
<section class="block b-onyx"><div class="wrap"><span class="kicker">Standards by market</span><h2 class="split-lines" style="margin-top:16px;max-width:14ch">One tile, many rulebooks.</h2>
<div class="tscroll"><table class="tbl stack"><thead><tr><th>Market</th><th>Standard</th><th>What it is</th></tr></thead><tbody>${D.standards.map(s=>`<tr><td data-label="Market" style="font-weight:700;white-space:nowrap">${esc(s[0])}</td><td data-label="Standard" class="mono" style="white-space:nowrap">${esc(s[1])}</td><td data-label="" class="wide">${esc(s[2])}</td></tr>`).join('')}</tbody></table></div>
<p class="note">Most national standards are based on ISO 13006, but not all are interchangeable: the US ANSI A137.1, for example, uses its own tests and limits. Tell us your destination country and we'll confirm which test reports and marks are available for each range before you order.</p></div></section>
<section class="block b-white"><div class="wrap article"><span class="kicker">Europe in detail</span>
<h3>CE marking and the DoP</h3><p>Under EN 14411, tiles placed on the market carry CE marking backed by the manufacturer's Declaration of Performance. We pass on RAK's DoP for every range in your order.</p>
<h3>Importer details</h3><p>In the EU, the importer's name and address must appear on the product, packaging or accompanying documents, and records should be kept for 10 years.</p>
<h3>Duty and VAT</h3><p>Tiles fall under commodity code family 6907. Import duty and VAT are set by each destination country; your customs agent will confirm them.</p>
<h3>Sources</h3><p><a href="https://www.gso.org.sa/store/standards/GSO:788026/GSO%20ISO%2013006:2021?lang=en">GSO ISO 13006:2021 (Gulf Standardization Organization)</a></p>
<p class="note">General information, not legal advice. Confirm with your customs agent or adviser for your shipment.</p></div></section>${cta()}`;

P.guides = ()=> head('Guides','Read this <em>before</em> you order.','Short, practical guides for container buyers and UAE builders.','b-travertine') + `
<section class="block b-white"><div class="wrap"><div class="grid3" style="grid-template-columns:repeat(2,1fr)">${D.guides.map(g=>`<a class="gcard b-${g.color}" href="#${g.id}"><span class="kicker">${g.read} read</span><h3>${esc(g.title)}</h3><p>${esc(g.intro)}</p><span class="mono">Read →</span></a>`).join('')}</div></div></section>${cta()}`;
function guidePage(g){
  return head(`<a href="#guides">Guides</a>`, esc(g.title), esc(g.intro), 'b-'+g.color) + `<section class="block b-onyx"><div class="wrap article">${g.sections.map(s=>`<h3>${esc(s[0])}</h3><p>${esc(s[1])}</p>`).join('')}${g.links?`<h3>Official sources</h3><p>${g.links.map(l=>`<a href="${l[1]}">${esc(l[0])}</a>`).join('<br>')}</p>`:''}<p class="note" style="margin-top:30px">General guidance. Always follow the adhesive maker's and manufacturer's instructions.</p></div></section>${cta()}`;
}
P.glossary = ()=> head('Glossary','Tile talk, <em>decoded</em>.','The words on spec sheets, quotes and shipping documents.','b-silk') + `<section class="block b-white"><div class="wrap"><div class="tscroll"><table class="tbl"><tbody>${D.glossary.map(g=>`<tr><td style="width:28%;font-weight:700">${esc(g[0])}</td><td>${esc(g[1])}</td></tr>`).join('')}</tbody></table></div></div></section>${cta()}`;
P.faq = ()=> head('FAQ','Questions, <em>answered</em>.','','b-gold') + `<section class="block b-onyx"><div class="wrap article">${D.faq.map(f=>`<details><summary>${esc(f[0])}</summary><p>${esc(f[1])}</p></details>`).join('')}</div></section>${cta()}`;
P.about = ()=> head('About','A trading desk <em>beside</em> the factory.','','b-noir') + `<section class="block b-onyx"><div class="wrap grid2"><div class="pgal"><img src="img/mega-slabs-stone.jpg" alt="Kitchen in stone-effect porcelain"></div><div class="article">
<p class="lead">The Trade Hub is an independent trading company based in ${esc(C.base)}, the home emirate of RAK Ceramics, one of the world's largest tile makers.</p>
<p style="margin-top:18px">We buy RAK porcelain and ceramic tiles and sell them on two ways: full containers to buyers worldwide, and pallets from our Jebel Ali warehouse for builders and fit-out firms working in the UAE.</p>
<p>We are not RAK Ceramics, and we are not one of RAK's appointed distributors. We are a trade buyer that plans loads, handles export paperwork and quotes in writing.</p>
<p class="note">Trade licence: ${esc(C.licence)}</p></div></div></section>${cta()}`;

P.toilets = ()=>{ const S=D.starvoll, L=S.lead; return head('Toilets','Starvoll WCs, <em>stocked</em> in Dubai.','One-piece and close-coupled WCs from the Starvoll range, held by UAE suppliers. By the pallet for fast orders and replacements, mixed into a tile container, or on a distributor sample pallet.','b-silk', famSwitch('toilets'), 'Toilets') + `
<section class="block b-onyx"><div class="wrap grid2"><div><div class="pshot"><img id="pmain" src="${L.variants[0][2]}" alt="Starvoll L175 one-piece WC"></div>
  <div class="pthumbs">${L.variants.map((v,i)=>`<button type="button" class="${i?'':'on'}" data-src="${v[2]}" aria-label="${v[0]} ${v[1]}"><img src="${v[2]}" alt="" loading="lazy"><span>${v[1]}</span></button>`).join('')}</div></div>
  <div><span class="kicker">Our lead model</span><h2 class="split-lines" style="margin-top:16px">Starvoll <em>L175</em>.</h2>
  <p class="lead" style="margin-top:16px">A one-piece WC, cistern and bowl in a single piece of ceramic, in white, ivory, matt black or gold.</p>
  <table class="spec">${L.rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('')}<tr><td>The Trade Hub price</td><td>On request</td></tr></table>
  <div class="ctas" style="margin-top:26px"><a class="pill copper" href="#quote">Quote the L175</a><a class="pill ghost" href="#pallets">By the pallet</a></div></div></div></section>
<section class="block b-white"><div class="wrap"><span class="kicker">The range</span><h2 class="split-lines" style="margin-top:16px">Pick a WC.</h2>
  <div class="pgrid">${S.range.map(r=>`<div class="pcard${r[0]==='L175'?' hi':''}"><div class="pimg"><img src="${r[5]}" alt="Starvoll ${r[0]} WC"></div><div class="ptx"><b class="mono">${r[0]}</b><span>${r[1]}</span><dl><dt>Trap</dt><dd>${r[2]}</dd><dt>Size (mm)</dt><dd>${r[3]}</dd><dt>Colours</dt><dd>${r[4]}</dd></dl></div></div>`).join('')}</div>
  <p class="note">"—" means not published by the suppliers we checked. We confirm the current spec sheet, seat and fittings with every quote.</p></div></section>
<section class="block b-travertine"><div class="wrap"><span class="kicker">How they ship</span><h2 class="split-lines" style="margin-top:16px;max-width:14ch">Three ways to buy.</h2>
<div class="grid3">${[['By the pallet','Boxed WCs from Jebel Ali, across the UAE or shipped worldwide. Ideal for replacing broken units on site.','#pallets'],['In a tile container','Heavy tile on the floor, boxed WCs on top: one load, one set of papers.','#containers'],['On a sample pallet','A boxed L175 rides on top of the tile boxes on our distributor sample pallet by air.','#pallets']].map(s=>`<a class="gcard b-onyx" href="${s[2]}" style="min-height:220px"><h3>${s[0]}</h3><p>${s[1]}</p><span class="pill" style="align-self:flex-start;margin-top:18px">More →</span></a>`).join('')}</div></div></section>
${cta('Need WCs this week?','b-gold')}`; };

P.insulation = ()=>{ const I=D.isover; return head('Insulation','Glass wool, <em>by the roll</em>.','Isover Spacesaver glass mineral wool rolls for lofts and ceiling joists. CE and UKCA marked to EN 13162, Euroclass A1 non-combustible.','b-gold', famSwitch('insulation'), 'Insulation') + `
<section class="block b-onyx"><div class="wrap grid2"><div><div class="pshot"><img src="img/p/is-spacesaver-1.jpg" alt="Isover Spacesaver glass mineral wool loft roll"></div></div>
  <div><span class="kicker">The product</span><h2 class="split-lines" style="margin-top:16px">Isover <em>Spacesaver</em>.</h2>
  <table class="spec">${I.facts.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('')}<tr><td>The Trade Hub price</td><td>On request</td></tr></table>
  <div class="ctas" style="margin-top:26px"><a class="pill copper" href="#quote">Quote Spacesaver</a><a class="pill ghost" href="#containers">Mix with tiles</a></div></div></div></section>
<section class="block b-white"><div class="wrap"><span class="kicker">Thicknesses</span><h2 class="split-lines" style="margin-top:16px">100 to 200 mm.</h2>
  <div class="tscroll"><table class="tbl stack"><thead><tr><th>Thickness</th><th>R-value (m²K/W)</th><th>Roll (L × W)</th><th>m² per roll</th><th>Rolls per pallet</th><th>m² per pallet</th><th>Isover code</th></tr></thead><tbody>${I.sizes.map(r=>`<tr><td data-label="Thickness"><b>${r[0]}</b></td><td data-label="R-value">${r[1]}</td><td data-label="Roll" style="white-space:nowrap">${r[2]}</td><td data-label="m² per roll">${r[3]}</td><td data-label="Rolls per pallet">${r[4]}</td><td data-label="m² per pallet">${r[5]}</td><td data-label="Isover code" class="mono">${r[6]}</td></tr>`).join('')}</tbody></table></div>
  <p class="note">Figures from Isover's Spacesaver datasheet. Stock thicknesses and pallet make-up are confirmed on the quote.</p></div></section>
<section class="block b-noir"><div class="wrap grid2"><div><span class="kicker" style="color:var(--gold)">Why it pairs with tile</span><h2 class="split-lines" style="margin-top:16px">Light goods, spare space.</h2><div class="pgal" style="margin-top:28px"><img src="img/p/is-spacesaver-2.jpg" alt="Glass wool loft roll being laid between ceiling joists" loading="lazy"></div></div>
  <div><p class="lead">A tile container hits its weight limit long before it is full. Glass wool is the opposite: light, compressed and bulky. Load the tile to the weight limit and fill the space above with rolls, so the same freight carries more value.</p>
  <p style="margin-top:22px"><a class="pill gold" href="#containers">Build a mixed container →</a></p></div></div></section>
${cta('Insulation for your next job?','b-gold')}`; };

P.textiles = ()=> head('Textiles','Textiles, <em>coming soon</em>.','Our second line is on its way. We are adding ranges now.','b-copper') + `<section class="block b-onyx"><div class="wrap grid2"><div><span class="kicker">What's next</span><h2 class="split-lines" style="margin-top:16px">Watch this space.</h2></div><div class="article"><p class="lead">Tell us what you're looking for and we'll let you know when the first ranges are live.</p><div class="ctas" style="margin-top:24px"><a class="pill" href="#quote">Register interest</a><a class="pill ghost" href="#tiles">Back to tiles</a></div></div></div></section>`;
P.quote = ()=> head('Get a quote','Let\'s <em>price</em> it.','Quotes are written per order. Tell us as much as you know; we\'ll fill in the rest.','b-lagoon') + `
<section class="block b-onyx"><div class="wrap grid2"><form id="qf"><div class="f">
<label>Your name<input name="name" required></label><label>Company<input name="company"></label>
<label>Email<input name="email" type="email" required></label><label>Phone / WhatsApp<input name="phone"></label>
<label>Market<select name="market"><option>Containers (worldwide)</option><option>Pallets (UAE or worldwide)</option><option>Textiles</option><option>Not sure yet</option></select></label>
<label>Load<select name="load"><option>20ft</option><option>40ft</option><option>Pallets</option><option>Not sure</option></select></label>
<label class="full">Ranges / colours<input name="ranges" placeholder="e.g. Tech-Marble Calacatta Africa 60×120, Amani Dark Grey"></label>
<label>m² (approx.)<input name="m2" type="number" min="0"></label><label>Delivery to<input name="to" placeholder="Destination port and country, or UAE emirate"></label>
<label class="full">Anything else<textarea name="msg" rows="4"></textarea></label>
<label class="full" style="font-weight:400"><input type="checkbox" name="samples" style="width:auto;margin-right:8px">Please arrange samples</label></div>
<p style="margin-top:18px"><button class="pill copper" type="submit">Prepare my enquiry</button></p></form>
<div><span class="kicker">Contact</span><p class="lead" style="margin-top:12px">Email <a href="mailto:${esc(C.email)}"><b>${esc(C.email)}</b></a><br>Phone / WhatsApp <b>${esc(C.phone)}</b></p><p style="margin-top:12px">${esc(C.address)}</p>
<div class="out" id="qout" aria-live="polite"></div><p><button class="pill" id="qcopy" type="button" style="display:none;margin-top:12px">Copy enquiry</button></p>
<p class="note">This page doesn't send anything by itself. Copy your enquiry and email or WhatsApp it to us.</p></div></div></section>`;
function initQuote(){
  const f=$('#qf'); if(!f) return;
  f.onsubmit=e=>{ e.preventDefault(); const d=new FormData(f); let t='Enquiry for The Trade Hub\n';
    for(const [k,v] of d.entries()) if(v) t+=`${k}: ${v}\n`; const o=$('#qout'); o.textContent=t; o.classList.add('show'); $('#qcopy').style.display='inline-flex';
    $('#qcopy').onclick=async()=>{ try{ await navigator.clipboard.writeText(t); $('#qcopy').textContent='Copied ✓'; }catch(err){ $('#qcopy').textContent='Select the text above to copy'; } }; };
}
P.notfound = ()=> head('Not found','That tile\'s <em>missing</em>.','The page you asked for isn\'t here.','b-copper', '<p style="margin-top:24px"><a class="pill" href="#home">Back home</a></p>');

/* ---------- router ---------- */
function resolve(h){
  if(!h || h==='home') return ['home', P.home];
  const alias={'credits':'home','uk-trade':'containers','compliance':'standards','uae-pallets':'pallets'}; if(alias[h]) h=alias[h];
  if(P[h]) return [h, P[h]];
  const c=col(h); if(c) return [h, ()=>collectionPage(c)];
  if(h.startsWith('line-')){ const l=D.lines.find(x=>'line-'+x.id===h); if(l) return [h, ()=>linePage(l)]; }
  const g=D.guides.find(x=>x.id===h); if(g) return [h, ()=>guidePage(g)];
  return ['notfound', P.notfound];
}
let lenis=null;
function render(){
  const h=location.hash.replace('#','');
  const [key, fn]=resolve(h);
  if(hasG()){ ScrollTrigger.getAll().forEach(t=>t.kill()); gsap.globalTimeline.clear(); }
  $('#app').innerHTML = fn() + footer();
  $$('.nav a.l').forEach(a=>a.classList.toggle('on', a.getAttribute('href')==='#'+key));
  $('.sheet').classList.remove('open'); document.body.classList.remove('noscroll'); if(lenis) lenis.start();
  window.scrollTo(0,0); if(lenis) lenis.scrollTo(0,{immediate:true});
  document.title = (key==='home'?'':(($('h1')||{}).textContent||'').replace(/\s+/g,' ').trim()+' · ') + 'The Trade Hub: tiles, toilets and insulation, worldwide';
  initCX(); initCalc(); initQuote(); motion();
  $('.mbar').classList.toggle('show', !$('.hero'));
  if(hasG()){ let t; const rf=()=>{ clearTimeout(t); t=setTimeout(()=>ScrollTrigger.refresh(),120); };
    $$('#app img').forEach(i=>{ if(!i.complete) i.addEventListener('load',rf,{once:true}); });
    if(document.fonts&&document.fonts.ready) document.fonts.ready.then(rf); }
}

/* ---------- motion ---------- */
function motion(){
  if(!hasG() || reduce) return;
  gsap.registerPlugin(ScrollTrigger);
  // hero lines
  const hl=$$('.hero-h .ln>span'); if(hl.length) gsap.from(hl,{yPercent:110,duration:1.1,ease:'expo.out',stagger:.12,delay:.1});
  const ar=$('.hero .arch img, .hero .hb-img'); if(ar){ gsap.from(ar,{scale:1.15,duration:1.8,ease:'expo.out'}); gsap.to(ar,{yPercent:8,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}}); }
  const fan=$$('.fan figure'); if(fan.length) gsap.from(fan,{y:160,opacity:0,duration:1.3,ease:'expo.out',stagger:.1,delay:.3});
  $$('.creds li').forEach((li,i)=>gsap.from(li,{opacity:0,y:12,duration:.8,delay:.7+i*.08}));
  // floats: idle bob + scroll parallax + pointer
  $$('.float').forEach((el,i)=>{
    const d=+el.dataset.depth||.5, r=+el.dataset.rot||0;
    gsap.set(el,{rotation:r});
    gsap.to(el,{y:'+=16',rotation:r+(i%2?3:-3),duration:3+i%3,yoyo:true,repeat:-1,ease:'sine.inOut'});
    gsap.to(el,{yPercent:-70*d,ease:'none',scrollTrigger:{trigger:el.closest('section'),start:'top top',end:'bottom top',scrub:true}});
  });
  // headings in blocks
  $$('.block h2, .ph-head h1').forEach(h=>gsap.from(h,{y:60,opacity:0,duration:1,ease:'expo.out',scrollTrigger:{trigger:h,start:'top 88%'}}));
  // horizontal strip
  const hs=$('#hs'), tr=hs&&$('.htrack',hs);
  if(tr && desk()){ const dist=()=>tr.scrollWidth-innerWidth+40;
    gsap.to(tr,{x:()=>-dist(),ease:'none',scrollTrigger:{trigger:hs,start:'top top',end:()=>'+='+dist(),pin:true,scrub:true,invalidateOnRefresh:true}}); }
  // band
  const b=$('.band-img'); if(b) gsap.fromTo(b,{scale:1.18,yPercent:-8},{scale:1,yPercent:0,ease:'none',scrollTrigger:{trigger:'.band',start:'top bottom',end:'bottom top',scrub:true}});
  // counters
  $$('[data-count]').forEach(el=>{ const end=+el.dataset.count, dec=+(el.dataset.dec||0), o={v:0};
    gsap.to(o,{v:end,duration:1.6,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 85%'},onUpdate:()=>el.textContent=o.v.toLocaleString('en-GB',{minimumFractionDigits:dec,maximumFractionDigits:dec})}); });
  // footer wordmark
  const w=$('.wordmark'); if(w) gsap.from(w,{yPercent:60,ease:'none',scrollTrigger:{trigger:'.footer',start:'top bottom',end:'bottom bottom',scrub:true}});
  ScrollTrigger.refresh();
}
function pointer(){
  if(reduce) return;
  addEventListener('pointermove',e=>{ if(!hasG()) return; const x=e.clientX/innerWidth-.5, y=e.clientY/innerHeight-.5;
    $$('.float').forEach(el=>{ const d=+el.dataset.depth||.5; gsap.to(el,{x:x*46*d,duration:.9,ease:'power2.out',overwrite:'auto'}); gsap.to(el.firstElementChild,{y:y*30*d,duration:.9,ease:'power2.out',overwrite:'auto'}); }); });
}

/* ---------- boot ---------- */
function boot(){
  document.addEventListener('click',e=>{ const t=e.target.closest('.pthumbs button'); if(!t) return; const m=document.getElementById('pmain'); if(m){ m.src=t.dataset.src; } t.parentElement.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b===t)); });
  let last=0; addEventListener('scroll',()=>{ const y=scrollY; $('.nav').classList.toggle('hide', y>last && y>220); document.body.classList.toggle('at-top', y<30); $('.mbar').classList.toggle('show', y>innerHeight*.55 || !$('.hero')); last=y; },{passive:true});
  $('.burger').onclick=()=>{ $('.sheet').classList.add('open'); document.body.classList.add('noscroll'); if(lenis) lenis.stop();
    if(hasG()&&!reduce) gsap.from('.sheet .sl a',{y:40,opacity:0,duration:.6,stagger:.04,ease:'expo.out'}); };
  const closeSheet=()=>{ $('.sheet').classList.remove('open'); document.body.classList.remove('noscroll'); if(lenis) lenis.start(); };
  $('.sheet .x').onclick=closeSheet; $$('.sheet a').forEach(x=>x.addEventListener('click',closeSheet));
  if(window.Lenis && !reduce){ try{ lenis=new Lenis({lerp:.11}); if(hasG()){ lenis.on('scroll',ScrollTrigger.update); gsap.ticker.add(t=>lenis.raf(t*1000)); gsap.ticker.lagSmoothing(0);} else { const raf=t=>{lenis.raf(t);requestAnimationFrame(raf)}; requestAnimationFrame(raf);} }catch(e){ lenis=null; } }
  pointer();
  addEventListener('hashchange',render); addEventListener('load',()=>{ if(hasG()) ScrollTrigger.refresh(); }); render();
}
document.readyState==='loading' ? document.addEventListener('DOMContentLoaded',boot) : boot();
})();
