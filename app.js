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
const cta = (title='Tell us what you need.', cls='b-gold') => `<section class="block ${cls} cta-big"><div class="wrap"><span class="kicker">Quotes in writing, per order</span><h2 class="split-lines" style="margin:18px 0 30px">${title}</h2><div class="ctas"><a class="pill" href="#quote">Get a quote</a><a class="pill ghost" href="#containers">Build your load</a></div></div></section>`;

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

/* ---------- load builder (signature) ----------
   One engine, three uses:
   · product pages: one product only (tiles, toilets or insulation) in a 20ft, 40ft or pallet
   · Containers page: every vessel and every mix, plus "Your mix"
   · Pallets page: pallet and air sample, every mix, plus "Your mix"
   Loads never exceed the limits below. All figures approximate. */
const U = { tile:{ t:.92, v:.70, m2:43.2 }, wc:{ t:.040, v:.30 }, roll:{ t:.01415, v:.29, m2:14.13 } };
const CELL_V = .70; // one block in the container picture ≈ 0.7 m³
const VESSEL = {
  c20:{ name:'20ft', cols:8,  rows:5, capT:23, capV:28 },
  c40:{ name:'40ft', cols:16, rows:5, capT:25, capV:56 }
};
const PAL_MAX = { h:180, kg:1000 };
const PALK = { box:29, pallet:25, wc:40, roll:14.15 };
const LOADS = [['t','Tiles'],['w','Toilets'],['i','Insulation'],['tw','Tiles + toilets'],['ti','Tiles + insulation'],['twi','All three'],['x','Your mix']];
const PLAN = {
  c20:{ t:{tile:25}, w:{wc:90}, i:{roll:96}, tw:{tile:18,wc:50}, ti:{tile:20,roll:46}, twi:{tile:16,wc:30,roll:25} },
  c40:{ t:{tile:27}, w:{wc:185}, i:{roll:193}, tw:{tile:21,wc:135}, ti:{tile:25,roll:132}, twi:{tile:20,wc:80,roll:60} },
  pal:{ t:{box:30,wc:0,roll:0}, w:{box:0,wc:4,roll:0}, i:{box:0,wc:0,roll:6}, tw:{box:15,wc:2,roll:0}, ti:{box:15,wc:0,roll:4}, twi:{box:12,wc:1,roll:2} }
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
        twi:'20 tile pallets, about 80 WCs and 60 rolls: ≈ 22.5 t, full by space.' },
  pal:{ t:'30 boxes of 60 × 120 = 43.2 m², about 0.9 t. Delivered across the UAE or shipped worldwide.',
        w:'4 boxed one-piece WCs, two layers of two: about 0.2 t. For replacements that can\'t wait.',
        i:'6 packed rolls, about 85 m² at 100 mm and only around 0.1 t: easy to add to any order.',
        tw:'15 boxes of tile (21.6 m²) with 2 boxed WCs on top: about 0.5 t, one delivery.',
        ti:'15 boxes of tile with 4 rolls on top: about 0.5 t.',
        twi:'12 boxes of tile, a boxed WC and 2 rolls: about 0.45 t on one pallet.' }
};
const MIXIN = { c20:{tile:15,wc:30,roll:20}, c40:{tile:20,wc:80,roll:60}, pal:{box:12,wc:1,roll:2} };
const MIXF = { c:[['tile','Tile pallets',1],['wc','Boxed WCs',5],['roll','Rolls',5]], pal:[['box','Tile boxes',3],['wc','Boxed WCs',1],['roll','Rolls',1]] };
const AIR = { boxes:24, m2PerBox:1.44, kgBox:29, wc:30, basin:18, pallet:12, maxH:160,
  note:'<b>Distributor sample pallet by air:</b> 120 × 100 cm plastic pallet (no fumigation needed), 24 boxes across 6–8 ranges in the base, a boxed WC and basin on top. About 153 cm high and 0.76 t: inside the ≈ 160 cm belly-hold limit and the aircraft floor-load limit.' };
const FAM = D.families.find(f=>f.ready); const PAT = FAM.blockImgs;
const AIRCOL=['#E9E4DC','#463B37','#C9CFD1','#2F5A52','#F1EEE8','#A29D99','#A08A6E','#B9A385'];
const SAN = [
  '<path d="M9 9h7v12H9zM13 21h15a0 0 0 0 1 0 0c0 5-4 8-9 8h-2l1 4h-6l1-4c-2-1-3-3-3-6z" />',  // WC
  '<path d="M6 17h24c0 6-5 10-12 10S6 23 6 17zM18 9v8M14 9h8" />'                                 // basin + tap
];
const SPIRAL = 'M0 0c2 0 3 2 2 4s-5 2-6-1 1-7 5-7 8 3 7 8-6 9-11 7';
let cxMode='c20', cxLoad='t', cxP=0, cxWarn='';
const fmt=(v,d=0)=>v.toLocaleString('en-GB',{maximumFractionDigits:d,minimumFractionDigits:d});
const loadName = k => (LOADS.find(l=>l[0]===k)||['',''])[1];

/* packed-look pictures */
function gTilePallet(x,y,c,k){ // tile boxes stacked on a pallet, strapped
  let s=`<g transform="translate(${x} ${y})"><rect x="1" y="${c-6}" width="${c-2}" height="2.5" fill="#b48659"/>`;
  for(const fx of [2, c/2-2.5, c-7]) s+=`<rect x="${fx}" y="${c-3.5}" width="5" height="3.5" fill="#8d6640"/>`;
  for(let i=0;i<4;i++) s+=`<rect x="2" y="${2+i*7}" width="${c-4}" height="6.4" rx=".8" fill="url(#p${(k+i)%PAT.length})" stroke="rgba(42,32,28,.35)" stroke-width=".6"/>`;
  return s+`<rect x="9" y="2" width="1.6" height="${c-8}" fill="rgba(255,255,255,.7)"/><rect x="${c-10.6}" y="2" width="1.6" height="${c-8}" fill="rgba(255,255,255,.7)"/></g>`;
}
function gCarton(x,y,w,h,icon=true){ // brown WC carton with tape and printed WC
  const sc=Math.min(w/36*.9, h/36*.62);
  return `<g transform="translate(${x} ${y})"><rect width="${w}" height="${h}" rx="${Math.min(3,w/12)}" fill="#C69A63"/><rect width="${w}" height="${h*.1}" fill="#B3854F"/><rect x="${w*.42}" width="${w*.16}" height="${h}" fill="#DDBF8C" opacity=".85"/>${icon?`<g transform="translate(${w/2-18*sc} ${h*.55-18*sc}) scale(${sc})" fill="none" stroke="#4A3220" stroke-width="${1.6/sc*.9}" stroke-linecap="round" stroke-linejoin="round">${SAN[0]}</g>`:''}</g>`;
}
function gRoll(cx,cy,r){ // packed glass-wool roll, end-on, in its wrapper
  const sc=r/12;
  return `<g><circle cx="${cx}" cy="${cy}" r="${r}" fill="#F2CE52"/><circle cx="${cx}" cy="${cy}" r="${r-r*.09}" fill="none" stroke="#3F8F3A" stroke-width="${r*.16}"/><path d="${SPIRAL}" transform="translate(${cx} ${cy}) scale(${sc*.85})" fill="none" stroke="#B88A1E" stroke-width="${1.3/(sc*.85)}" stroke-linecap="round"/><path d="M${cx-r*.55} ${cy-r*.62}a${r*.8} ${r*.8} 0 0 1 ${r*.7} -${r*.2}" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="${r*.08}" stroke-linecap="round"/></g>`;
}
function cxSVG(){
  const pats = PAT.map((p,i)=>`<pattern id="p${i}" patternUnits="objectBoundingBox" width="1" height="1"><image href="img/${p}.jpg" width="60" height="44" preserveAspectRatio="xMidYMid slice"/></pattern>`).join('');
  return `<svg class="cx-svg" viewBox="0 0 680 320" role="img" aria-label="Load builder"><defs>${pats}
    <pattern id="rib" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#b8562f"/><rect width="4" height="10" fill="#a94c28"/></pattern></defs>
    <g id="cxg"></g></svg>`;
}

/* limits */
function contTotals(v){ const T=(v.tile||0)*U.tile.t+(v.wc||0)*U.wc.t+(v.roll||0)*U.roll.t, V=(v.tile||0)*U.tile.v+(v.wc||0)*U.wc.v+(v.roll||0)*U.roll.v; return {T,V}; }
function palLayout(v){ // tile boxes on the base; WCs and rolls in two columns, each item on the lower column
  const top=[], col=[0,0];
  [...Array(v.wc||0).fill('wc'), ...Array(v.roll||0).fill('roll')].forEach(t=>{ const c=col[0]<=col[1]?0:1; top.push([t, t==='wc'?(c?63:10):(c?62:8), col[c]]); col[c]+= t==='wc'?87:52; });
  return { box:v.box||0, top, h:Math.round(15+(v.box||0)*2.2+Math.max(col[0],col[1])), kg:PALK.pallet+(v.box||0)*PALK.box+(v.wc||0)*PALK.wc+(v.roll||0)*PALK.roll };
}
function fitsMix(mode, v){
  if(mode==='pal'){ const L=palLayout(v); return L.h<=PAL_MAX.h ? (L.kg<=PAL_MAX.kg ? '' : `That would pass the ${fmt(PAL_MAX.kg)} kg we plan a pallet to.`) : `That would pass the ${PAL_MAX.h} cm we plan a pallet to.`; }
  const m=VESSEL[mode], {T,V}=contTotals(v);
  return T>m.capT+1e-9 ? `That would pass the ${m.capT} t we load a ${m.name} to.` : V>m.capV+1e-9 ? `That won't fit: the ${m.name} is full.` : '';
}

/* stats panel */
function setStats({t, sp, spLabel, third, thirdLabel, contents, note}){
  $('#cx-t').textContent=t; $('#cx-v').textContent=sp; $('#cx-vl').textContent=spLabel; $('#cx-3').textContent=third; $('#cx-3l').textContent=thirdLabel;
  $('#cx-c').innerHTML=contents; $('#cx-note').innerHTML=(cxWarn?`<span class="warn">${cxWarn}</span> `:'')+note;
  const sl=$('#cx-range'); if(sl && document.activeElement!==sl) sl.value=Math.round(cxP*100);
  const lg=$('#cx-load'); if(lg) lg.hidden = cxMode==='air';
  const mi=$('#cx-mixin'); if(mi){ const show=cxLoad==='x' && cxMode!=='air'; mi.hidden=!show; if(show && mi.dataset.for!==cxMode) buildMixIn(); }
}
function contentsLine(got, unitTile){
  const c=[];
  if(got.tile!=null) c.push(`<span><i class="ci tl"></i>${unitTile==='box'?`${fmt(got.tile)} boxes of tile`:`${fmt(got.tile)} tile pallets · ${fmt(got.tile*U.tile.m2)} m²`}</span>`);
  if(got.wc!=null) c.push(`<span><i class="ci wc"></i>${fmt(got.wc)} boxed WC${Math.round(got.wc)===1?'':'s'}</span>`);
  if(got.roll!=null) c.push(`<span><i class="ci rl"></i>${fmt(got.roll)} roll${Math.round(got.roll)===1?'':'s'} · ${fmt(got.roll*U.roll.m2)} m²</span>`);
  return c.join('');
}
function thirdStat(v, got, pal){ // the figure that matters most for this load
  if((v.tile||v.box)) return [fmt(pal ? got.tile*1.44 : got.tile*U.tile.m2, pal?1:0), 'm² of tile'];
  if(v.wc) return [fmt(got.wc), 'boxed WCs'];
  return [fmt((got.roll||0)*U.roll.m2), 'm² of insulation'];
}

/* container */
function drawContainer(g){
  const m=VESSEL[cxMode], mine=cxLoad==='x', v= mine ? MIXIN[cxMode] : PLAN[cxMode][cxLoad];
  const parts=[['tile',v.tile||0],['wc',v.wc||0],['roll',v.roll||0]].filter(x=>x[1]>0)
    .map(([k,n])=>({k, n, cells: k==='tile'? n : Math.max(1,Math.round(n*U[k].v/CELL_V))}));
  const seq=[]; parts.forEach(pt=>{ for(let i=0;i<pt.cells;i++) seq.push(pt.k); });
  const total=m.cols*m.rows, shown=Math.min(total, Math.round(cxP*seq.length));
  const cell=36, gap=3, iw=m.cols*(cell+gap)+gap, ih=m.rows*(cell+gap)+gap, x0=(680-iw)/2, y0=300-ih-14;
  let s=`<rect x="${x0-14}" y="${y0-14}" width="${iw+28}" height="${ih+28}" rx="6" fill="url(#rib)"/><rect x="${x0}" y="${y0}" width="${iw}" height="${ih}" fill="#2a201c" opacity=".88"/>`;
  s+=`<text x="${x0-14}" y="${y0-24}" fill="currentColor" font-family="JetBrains Mono" font-size="13">${m.name.toUpperCase()} CONTAINER · ${loadName(cxLoad).toUpperCase()}</text>`;
  let k=0;
  for(let r=m.rows-1;r>=0;r--) for(let c=0;c<m.cols;c++){
    const x=x0+gap+c*(cell+gap), y=y0+gap+r*(cell+gap);
    if(k<shown){ const t=seq[k];
      s+= t==='tile' ? gTilePallet(x,y,cell,k)
        : t==='wc' ? `<g>${gCarton(x+2,y+1,15,cell-2)}${gCarton(x+19,y+1,15,cell-2)}</g>`
        : `<g>${gRoll(x+10,y+10,8.6)}${gRoll(x+26,y+10,8.6)}${gRoll(x+10,y+26,8.6)}${gRoll(x+26,y+26,8.6)}</g>`; }
    else s+=`<rect x="${x+.5}" y="${y+.5}" width="${cell-1}" height="${cell-1}" rx="3" fill="none" stroke="rgba(255,255,255,.18)" stroke-dasharray="3 3"/>`;
    k++;
  }
  g.innerHTML=s; g.ownerSVGElement.setAttribute('viewBox', `${x0-44} ${y0-60} ${iw+88} ${ih+118}`);
  let done=shown; const got={}; let T=0, V=0;
  parts.forEach(pt=>{ const f=Math.max(0,Math.min(1, done/pt.cells)); done-=pt.cells; const n=pt.n*f; got[pt.k]=n; T+=n*U[pt.k].t; V+=n*U[pt.k].v; });
  const all=contTotals(v), byW = all.T/m.capT >= all.V/m.capV;
  let c=contentsLine(got);
  if(cxP>.999) c+=`<span class="lim ok">${byW?`Weight: ${fmt(all.T,1)} of ${m.capT} t`:'Full by space'}</span>`;
  const note = mine ? `<b>Your ${m.name}:</b> ${fmt(all.T,1)} t of the ${m.capT} t we load to, and ${fmt(all.V/m.capV*100)}% of the space. ${byW?'Weight is the limit here.':'Space is the limit here.'}`
                    : `<b>${m.name}:</b> ${NOTE[cxMode][cxLoad]}`;
  const [third,thirdLabel]=thirdStat(v,got,false);
  setStats({ t:fmt(T,1), sp:fmt(V/m.capV*100), spLabel:'% of the space', third, thirdLabel, contents:c, note });
}

/* pallet, side-on */
function drawPallet(g){
  const mine=cxLoad==='x', v= mine ? MIXIN.pal : PLAN.pal[cxLoad], P=palLayout(v);
  const u=2.5, W=120*u, x0=60, base=300, palH=15*u, boxH=2.2*u;
  const items=P.box+P.top.length, shown=Math.round(cxP*items);
  let s=`<rect x="${x0-10}" y="${base-palH}" width="${W+20}" height="${palH*.4}" rx="3" fill="#b48659"/>`;
  for(const fx of [0,.45,.9]) s+=`<rect x="${x0-10+(W+20)*fx}" y="${base-palH*.6}" width="${(W+20)*.1}" height="${palH*.6}" fill="#8d6640"/>`;
  let y=base-palH, bx=0;
  for(let i=0;i<P.box;i++){ y-=boxH; const on=i<shown; if(on) bx++;
    s+= on ? `<rect x="${x0+2}" y="${y}" width="${W-4}" height="${boxH-.6}" rx="1" fill="${AIRCOL[Math.floor(i/3)%AIRCOL.length]}"/><rect x="${x0+2}" y="${y}" width="${W-4}" height=".8" fill="rgba(255,255,255,.35)"/>`
           : `<rect x="${x0+2}" y="${y}" width="${W-4}" height="${boxH-.6}" fill="none" stroke="rgba(255,255,255,.15)" stroke-dasharray="2 2"/>`; }
  if(P.box) s+=`<rect x="${x0+W*.3}" y="${y}" width="5" height="${base-palH-y}" fill="rgba(255,255,255,.55)"/><rect x="${x0+W*.7}" y="${y}" width="5" height="${base-palH-y}" fill="rgba(255,255,255,.55)"/>`;
  const top=y; let wc=0, rl=0, maxY=top;
  P.top.forEach(([t,xc,yc],j)=>{ const on=P.box+j<shown;
    if(t==='wc'){ const w=45*u,h=85*u,X=x0+xc*u,Y=top-yc*u-h; maxY=Math.min(maxY,Y); if(on) wc++;
      s+= on ? gCarton(X,Y,w,h) : `<rect x="${X}" y="${Y}" width="${w}" height="${h}" rx="4" fill="none" stroke="rgba(255,255,255,.25)" stroke-dasharray="4 4"/>`; }
    else { const d=50*u, X=x0+xc*u, Y=top-yc*u-d; maxY=Math.min(maxY,Y); if(on) rl++;
      s+= on ? gRoll(X+d/2, Y+d/2, d/2-2) : `<circle cx="${X+d/2}" cy="${Y+d/2}" r="${d/2-2}" fill="none" stroke="rgba(255,255,255,.25)" stroke-dasharray="4 4"/>`; }
  });
  const ly=base-PAL_MAX.h*u;
  s+=`<line x1="${x0-30}" y1="${ly}" x2="${x0+W+30}" y2="${ly}" stroke="#F6F2EA" stroke-dasharray="6 5" opacity=".6"/><text x="${x0+W+34}" y="${ly+4}" fill="currentColor" font-family="JetBrains Mono" font-size="12">${PAL_MAX.h} cm</text>`;
  s+=`<text x="${x0-10}" y="${ly-16}" fill="currentColor" font-family="JetBrains Mono" font-size="13">PALLET · ${loadName(cxLoad).toUpperCase()}</text>`;
  s+=`<text x="${x0-10}" y="${base+22}" fill="currentColor" font-family="JetBrains Mono" font-size="12">120 × 100 cm · ≈ ${P.h} cm high</text>`;
  g.innerHTML=s; const vy=ly-40; g.ownerSVGElement.setAttribute('viewBox', `20 ${vy} ${W+130} ${base-vy+40}`);
  const kg=(shown>0?PALK.pallet:0)+bx*PALK.box+wc*PALK.wc+rl*PALK.roll;
  const got={}; if(P.box) got.tile=bx; if(v.wc) got.wc=wc; if(v.roll) got.roll=rl;
  let c=contentsLine(got,'box');
  if(cxP>.999) c+=`<span class="lim ok">${P.h} of ${PAL_MAX.h} cm · ${fmt(P.kg)} kg</span>`;
  const note = mine ? `<b>Your pallet:</b> about ${fmt(P.kg)} kg and ${P.h} cm high, inside the ${PAL_MAX.h} cm and ${fmt(PAL_MAX.kg)} kg we plan a pallet to.` : `<b>Pallet:</b> ${NOTE.pal[cxLoad]}`;
  const [third,thirdLabel]=thirdStat(v,{tile:bx,wc,roll:rl},true);
  setStats({ t:fmt(kg/1000,2), sp:fmt(cxP>.999?P.h:Math.round(P.h*cxP)), spLabel:'cm high', third, thirdLabel, contents:c, note });
}

/* air sample pallet (fixed build) */
function drawAir(g){
  const u=2.5, W=120*u, x0=60, base=300, palH=15*u, boxH=2.2*u, n=AIR.boxes;
  const total=n+2, shown=Math.round(cxP*total);
  const lim=base-AIR.maxH*u;
  let s=`<line x1="${x0-30}" y1="${lim}" x2="${x0+W+30}" y2="${lim}" stroke="#F6F2EA" stroke-dasharray="6 5" opacity=".7"/><text x="${x0+W+34}" y="${lim+4}" fill="currentColor" font-family="JetBrains Mono" font-size="12">${AIR.maxH} cm max</text>`;
  s+=`<rect x="${x0}" y="${base-palH}" width="${W}" height="${palH*.35}" rx="3" fill="#2A201C"/>`;
  for(const fx of [0,.45,.9]) s+=`<rect x="${x0+W*fx}" y="${base-palH*.65}" width="${W*.1}" height="${palH*.65}" rx="2" fill="#2A201C"/>`;
  let y=base-palH;
  for(let k=0;k<n;k++){ y-=boxH; s+= k<shown ? `<rect x="${x0+2}" y="${y}" width="${W-4}" height="${boxH-.6}" rx="1" fill="${AIRCOL[Math.floor(k/3)%AIRCOL.length]}"/><rect x="${x0+2}" y="${y}" width="${W-4}" height=".8" fill="rgba(255,255,255,.35)"/>`
    : `<rect x="${x0+2}" y="${y}" width="${W-4}" height="${boxH-.6}" fill="none" stroke="rgba(255,255,255,.15)" stroke-dasharray="2 2"/>`; }
  const top=y, wcW=45*u, wcH=85*u, bW=65*u, bH=25*u;
  s+= shown>n ? gCarton(x0+6, top-wcH, wcW, wcH) : `<rect x="${x0+6}" y="${top-wcH}" width="${wcW}" height="${wcH}" rx="4" fill="none" stroke="rgba(255,255,255,.25)" stroke-dasharray="4 4"/>`;
  s+= shown>n+1 ? `<g>${gCarton(x0+14+wcW, top-bH, bW, bH, false)}<g transform="translate(${x0+14+wcW+bW/2-13} ${top-bH/2-13}) scale(.72)" fill="none" stroke="#4A3220" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${SAN[1]}</g></g>` : `<rect x="${x0+14+wcW}" y="${top-bH}" width="${bW}" height="${bH}" rx="4" fill="none" stroke="rgba(255,255,255,.25)" stroke-dasharray="4 4"/>`;
  s+=`<text x="${x0-10}" y="${lim-16}" fill="currentColor" font-family="JetBrains Mono" font-size="13">AIR SAMPLE PALLET</text>`;
  s+=`<text x="${x0}" y="${base+20}" fill="currentColor" font-family="JetBrains Mono" font-size="12">PLASTIC PALLET · 120 × 100 cm</text>`;
  g.innerHTML=s; g.ownerSVGElement.setAttribute('viewBox', `20 ${lim-40} ${W+170} ${base-lim+70}`);
  const bx=Math.min(shown,n), kg=bx*AIR.kgBox+(shown>n?AIR.wc:0)+(shown>n+1?AIR.basin:0)+AIR.pallet*(shown>0?1:0);
  const c=`<span><i class="ci tl"></i>${bx} boxes of tile</span><span><i class="ci wc"></i>${shown>n?1:0} WC · ${shown>n+1?1:0} basin</span>`;
  setStats({ t:fmt(kg/1000,2), sp:fmt(Math.round(153*cxP)), spLabel:'cm high', third:fmt(bx*AIR.m2PerBox,1), thirdLabel:'m² of tile', contents:c, note:AIR.note });
}
function drawCX(){
  const g=$('#cxg'); if(!g) return;
  if(cxMode==='air') drawAir(g); else if(cxMode==='pal') drawPallet(g); else drawContainer(g);
}

/* "Your mix" steppers: never past the limits */
function buildMixIn(){
  const mi=$('#cx-mixin'); if(!mi) return; const key=cxMode==='pal'?'pal':'c'; mi.dataset.for=cxMode;
  mi.innerHTML=MIXF[key].map(([k,lab,st])=>`<label class="mx"><span>${lab}</span><button type="button" data-k="${k}" data-d="-${st}" aria-label="Fewer ${lab.toLowerCase()}">−</button><input type="number" inputmode="numeric" min="0" step="${st}" data-k="${k}" aria-label="${lab}"><button type="button" data-k="${k}" data-d="${st}" aria-label="More ${lab.toLowerCase()}">+</button></label>`).join('');
  fillMixIn();
  mi.querySelectorAll('button').forEach(b=>b.onclick=()=>{ const v=MIXIN[cxMode], k=b.dataset.k, d=+b.dataset.d;
    const next={...v,[k]:Math.max(0,(v[k]||0)+d)}; const why=fitsMix(cxMode,next);
    if(d>0 && why){ // try smaller steps before refusing
      let ok=false; for(let s2=d-1;s2>=1;s2--){ const n2={...v,[k]:(v[k]||0)+s2}; if(!fitsMix(cxMode,n2)){ Object.assign(v,n2); ok=true; break; } }
      cxWarn= ok ? '' : why; } else { Object.assign(v,next); cxWarn=''; }
    fillMixIn(); cxP=1; drawCX(); });
  mi.querySelectorAll('input').forEach(i=>i.oninput=()=>{ const v=MIXIN[cxMode], k=i.dataset.k; let n=Math.max(0,Math.round(+i.value||0)); cxWarn='';
    const want=n; while(n>0 && fitsMix(cxMode,{...v,[k]:n})) n--;
    if(n<want){ cxWarn=fitsMix(cxMode,{...v,[k]:n+1})+` Set to ${n}, the most that fits.`; i.value=n; }
    v[k]=n; cxP=1; drawCX(); });
}
function fillMixIn(){ const v=MIXIN[cxMode]; $$('#cx-mixin input').forEach(i=>{ if(document.activeElement!==i) i.value=v[i.dataset.k]||0; }); }

/* "Quote this load": hand the load to the quote form */
function currentLoadText(){
  if(cxMode==='air') return { load:'Air sample pallet', text:'Distributor sample pallet by air: 24 boxes of tile, 1 WC, 1 basin.' , tileM2:'', wcs:'1', rolls:'' };
  if(cxMode==='pal'){ const v= cxLoad==='x'?MIXIN.pal:PLAN.pal[cxLoad]; return { load:'Pallets', text:`Pallet: ${v.box} boxes of tile, ${v.wc} boxed WCs, ${v.roll} rolls.`, tileM2: v.box? fmt(v.box*1.44,1):'', wcs:v.wc||'', rolls:v.roll||'' }; }
  const m=VESSEL[cxMode], v= cxLoad==='x'?MIXIN[cxMode]:PLAN[cxMode][cxLoad];
  return { load:m.name, text:`${m.name} container: ${v.tile||0} tile pallets (≈ ${fmt((v.tile||0)*U.tile.m2)} m²), ${v.wc||0} boxed WCs, ${v.roll||0} insulation rolls.`, tileM2:v.tile?Math.round(v.tile*U.tile.m2):'', wcs:v.wc||'', rolls:v.roll||'' };
}
let QUOTE_PREFILL=null;

/* the block */
const CXHEAD = {
  t:['How tiles ship','Tile fills a box by <em>weight</em>.','Scroll to load it. Tile reaches the weight limit long before the box is full, which leaves room for lighter goods.'],
  w:['How toilets ship','Toilets fill a box by <em>space</em>.','Scroll to load it. Boxed WCs are light for their size, so a container runs out of room long before it runs out of weight.'],
  i:['How insulation ships','Rolls fill a box by <em>space</em>.','Scroll to load it. Packed glass wool is the lightest thing we ship: a full container weighs only a few tonnes.'],
  c:['The load builder','Build your <em>container</em>.','Pick a ready-made load or set your own mix. Tile goes on the floor up to the weight limit; toilets and rolls fill the space above. You can\'t go over the limits.'],
  p:['The load builder','Build your <em>pallet</em>.','Pick a ready-made pallet or set your own mix of tile boxes, WCs and rolls. It stays within the height and weight we plan a pallet to.']
};
function cxBlock({start='c20', load='t', single=null, only=null, free=false}={}){
  const VS=[['c20','20ft'],['c40','40ft'],['pal','Pallet'],['air','Air sample']].filter(v=>!only||only.includes(v[0]));
  const H = single ? CXHEAD[single] : start==='pal' ? CXHEAD.p : CXHEAD.c;
  const prods = single ? [single] : ['t','w','i'];
  const leg = {t:'<span><i class="ci tl"></i>Tile on pallets</span>', w:'<span><i class="ci wc"></i>Boxed WC</span>', i:'<span><i class="ci rl"></i>Insulation roll</span>'};
  return `<section class="block b-lagoon${free?' cx-free':''}" id="cx" data-start="${start}" data-load="${load}"${single?` data-single="${single}"`:''}><div class="wrap cx">
    <div><span class="kicker">${H[0]}</span><h2 class="split-lines" style="margin-top:16px">${H[1]}</h2>
      <p class="lead" style="margin-top:20px">${H[2]}</p>
      <div class="cx-toggle" role="group" aria-label="Container or pallet">${VS.map(v=>`<button data-m="${v[0]}" aria-pressed="${v[0]===start}">${v[1]}</button>`).join('')}</div>
      ${single?'':`<div class="cx-load" id="cx-load" role="group" aria-label="Load">${LOADS.map(l=>`<button type="button" data-l="${l[0]}" aria-pressed="${l[0]===load}">${l[1]}</button>`).join('')}</div>
      <div class="cx-mixin" id="cx-mixin" hidden></div>`}
      <div class="cx-stats"><div><b id="cx-t">0</b><span>tonnes</span></div><div><b id="cx-v">0</b><span id="cx-vl">% of the space</span></div><div><b id="cx-3">0</b><span id="cx-3l">m² of tile</span></div></div>
      <p class="cx-c" id="cx-c"></p>
      <p class="cx-note" id="cx-note"></p>
      <div class="cx-acts"><button class="pill gold" type="button" id="cx-quote">Quote this load</button>${single?'<a class="pill ghost" href="#containers">Mix with other products →</a>':''}</div>
      <label class="kicker" for="cx-range" style="display:block;margin-top:12px">Load it by hand</label><input id="cx-range" type="range" min="0" max="100" value="0">
      <p class="note" style="opacity:.8">Approximate: tile pallet of 60 × 120 ≈ 0.92 t and 0.7 m³; boxed one-piece WC ≈ 40 kg and 0.3 m³; 100 mm Spacesaver roll ≈ 14 kg and 0.29 m³ packed. We load a 20ft to about 23 t and a 40ft to about 25 t, and plan pallets to ${PAL_MAX.h} cm and ${fmt(PAL_MAX.kg)} kg. Every quote comes with a load plan.</p>
    </div>
    <div>${cxSVG()}<div class="legend">${prods.map(p=>leg[p]).join('')}${only && !only.includes('c20') ? '<span>Pallet drawn side-on: tile boxes ≈ 2.2 cm each, WC carton ≈ 85 cm high, packed roll ≈ 50 cm across</span>' : '<span><i style="border:1px dashed #fff"></i>Space left</span><span>Container: 1 block ≈ 0.7 m³, one tile pallet or about 2 WCs or 2 rolls</span>'}</div></div>
  </div></section>`;
}
function initCX(){
  const box=$('#cx'); if(!box) return;
  const sync=()=>{ $$('.cx-toggle button').forEach(x=>x.setAttribute('aria-pressed', x.dataset.m===cxMode)); $$('#cx-load button').forEach(x=>x.setAttribute('aria-pressed', x.dataset.l===cxLoad)); };
  $$('.cx-toggle button').forEach(b=>b.onclick=()=>{ cxMode=b.dataset.m; cxWarn=''; sync(); if(cxLoad==='x') buildMixIn(); drawCX(); });
  $$('#cx-load button').forEach(b=>b.onclick=()=>{ cxLoad=b.dataset.l; cxWarn=''; sync(); if(cxLoad==='x'){ buildMixIn(); cxP=1; } drawCX(); });
  $('#cx-range').oninput=e=>{ cxP=e.target.value/100; drawCX(); };
  $('#cx-quote').onclick=()=>{ QUOTE_PREFILL=currentLoadText(); location.hash='quote'; };
  cxMode=box.dataset.start||'c20'; cxLoad=box.dataset.load||'t'; cxWarn=''; sync();
  cxP=0; if(cxLoad==='x') buildMixIn(); drawCX();
  const free=box.classList.contains('cx-free');
  if(hasG() && !reduce){
    const upd=s=>{ cxP=s.progress; drawCX(); };
    if(free) ScrollTrigger.create({ trigger:'#cx .cx-svg', start:'top 90%', end:'top 35%', scrub:.4, onUpdate:upd });
    else if(desk() || mobPin()) ScrollTrigger.create({ trigger:'#cx', start:'top top', end:desk()?'+=900':'+=700', pin:true, scrub:.4, onUpdate:upd, anticipatePin:1 });
    else ScrollTrigger.create({ trigger:'#cx .cx-svg', start:'top 85%', end:'bottom 30%', scrub:.4, onUpdate:upd });
  } else { cxP=1; drawCX(); }
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
${marquee(['Calacatta','60 × 120','Starvoll L175','Café noir','Spacesaver rolls','Polished','Grey silk','20ft · 40ft','One-piece WCs','Lappato','Glass wool','Jebel Ali pallets'])}
<section class="block b-white"><div class="wrap"><span class="kicker">What we supply</span><h2 class="split-lines" style="margin-top:16px">Tiles, toilets, insulation.</h2>
<div class="grid3 lines3">
  <a class="tile-card" href="#tiles" style="background:var(--onyx)"><div class="ph"><img src="img/tiles-marble.jpg" alt="Marble-look porcelain bathroom" loading="lazy"></div><div class="tx"><span class="chip" style="background:#fff">RAK porcelain &amp; ceramic</span><h3 style="margin-top:12px">Tiles</h3><p style="margin-top:8px">Marble, stone, concrete and wood looks, by the container or the pallet.</p></div></a>
  <a class="tile-card" href="#toilets" style="background:var(--onyx)"><div class="ph"><img src="img/p/sv-l175-room.jpg" alt="Starvoll L175 WC in a bathroom" loading="lazy" style="object-position:50% 62%"></div><div class="tx"><span class="chip" style="background:#fff">Starvoll</span><h3 style="margin-top:12px">Toilets</h3><p style="margin-top:8px">One-piece and close-coupled WCs, led by the L175.</p></div></a>
  <a class="tile-card" href="#insulation" style="background:var(--onyx)"><div class="ph"><img src="img/p/is-spacesaver-2.jpg" alt="Glass wool loft roll being laid in a loft" loading="lazy"></div><div class="tx"><span class="chip" style="background:#fff">Isover</span><h3 style="margin-top:12px">Insulation rolls</h3><p style="margin-top:8px">Spacesaver glass wool rolls, 100 to 200 mm, CE and UKCA marked.</p></div></a>
</div></div></section>
<section class="block b-onyx"><div class="wrap">
  <span class="kicker">Two ways to buy</span><h2 class="split-lines" style="margin-top:16px;max-width:14ch">Three products. Two ways to ship.</h2>
  <div class="split">
    <a class="card dark" href="#containers"><span class="chip" style="background:var(--copper);color:#fff">Worldwide</span><h3>Full containers to your port</h3>
      <p>For importers, merchants, developers and contractors in any market who want volume pricing on full loads.</p>
      <ul><li>Tiles, toilets and insulation, alone or mixed</li><li>20ft or 40ft, planned to weight and space</li><li>Build your load online</li></ul><span class="pill gold">Build a container →</span></a>
    <a class="card lag" href="#pallets"><span class="chip" style="color:var(--noir)">UAE &amp; worldwide</span><h3>Pallets for fast orders</h3>
      <p>From our Jebel Ali warehouse, for jobs that can't wait for a full container.</p>
      <ul><li>Delivered across the UAE</li><li>Shipped worldwide: shared container or air</li><li>Top-ups, replacement WCs, mixed pallets</li></ul><span class="pill" style="background:var(--onyx);color:var(--noir)">Build a pallet →</span></a>
  </div></div></section>
<section class="block b-gold hstrip" id="hs"><div class="wrap"><span class="kicker">Tile collections</span><h2 class="split-lines" style="margin:16px 0 40px">Every look a modern home asks for.</h2><p class="swipe-hint">Swipe to explore <span>→</span></p></div>
  <div class="htrack">${D.collections.map(c=>`<a class="hcard" href="#${c.id}"><div class="ph"><img src="${c.img}" alt="${esc(c.name)} tiles in a room setting"></div><div class="tx"><span class="chip">${esc(c.kicker)}</span><h3 style="margin-top:12px">${c.name}</h3><p>${esc(c.short)}</p></div></a>`).join('')}</div></section>
<div class="band"><img src="img/mega-slabs-marble.jpg" alt="Kitchen with large marble-effect porcelain slabs" class="band-img"><div class="cap"><span class="kicker">Mega slabs</span><h3 style="font-family:var(--display);font-weight:400;font-size:2.2rem;line-height:1;margin-top:8px">Islands, walls and worktops in one piece.</h3></div></div>
<section class="block b-noir"><div class="wrap"><span class="kicker" style="color:var(--gold)">By the numbers (approximate)</span><h2 class="split-lines" style="margin-top:16px;max-width:13ch">Heavy and light, simple maths.</h2>
  <div class="stats">
    <div class="stat"><b data-count="1080">1,080</b><span>m² of 60 × 120 tile fill a 20ft by weight</span></div>
    <div class="stat"><b data-count="90">90</b><span>boxed WCs fill a 20ft by space</span></div>
    <div class="stat"><b data-count="190">190</b><span>insulation rolls fit in a 40ft, under 3 t</span></div>
    <div class="stat"><b data-count="3">3</b><span>products, mixed in one container</span></div>
  </div></div></section>
<section class="block b-onyx"><div class="wrap"><span class="kicker">How it works</span><h2 class="split-lines" style="margin-top:16px">From enquiry to unloading.</h2>
  <div class="steps">${[['Tell us','Products, quantities and where it needs to go. Or build your load online.'],['Samples','We arrange samples so you see the real tile, WC or roll.'],['Quote','A written price per order with a load plan: ex-works, to your port, or delivered.'],['Ship','We book, load and send the paperwork: invoice, packing list, B/L and standards papers.']].map((s,i)=>`<div class="step"><b>${i+1}</b><h3>${s[0]}</h3><p style="margin-top:6px">${s[1]}</p></div>`).join('')}</div>
  <p style="margin-top:30px"><a class="pill" href="#how-it-works">The full process</a></p></div></section>
<section class="block b-travertine"><div class="wrap"><span class="kicker">Guides</span><h2 class="split-lines" style="margin-top:16px">Know before you order.</h2>
  <div class="grid3">${D.guides.slice(0,3).map(g=>`<a class="gcard b-${g.color}" href="#${g.id}"><span class="kicker">${g.read} read</span><h3>${esc(g.title)}</h3><span class="mono">Read →</span></a>`).join('')}</div></div></section>
<section class="block b-white"><div class="wrap grid2"><div><span class="kicker">FAQ</span><h2 class="split-lines" style="margin-top:16px">Straight answers.</h2></div>
  <div>${D.faq.slice(0,5).map(f=>`<details><summary>${esc(f[0])}</summary><p>${esc(f[1])}</p></details>`).join('')}<p style="margin-top:24px"><a class="pill ghost" href="#faq">All questions</a></p></div></div></section>
${cta('Ready when your next job is.')}`;

P.tiles = ()=> head('Tiles','Tiles for every <em>room</em>.','Six families of RAK porcelain and ceramic tile. Marble leads our range; any of them can share a container with toilets and insulation.','b-onyx') + `
<section class="block b-white"><div class="wrap"><div class="grid3">${D.collections.map(c=>`<a class="tile-card" href="#${c.id}" style="background:var(--onyx)"><div class="ph"><img src="${c.img}" alt="${esc(c.name)} tiles" loading="lazy"></div><div class="tx"><span class="chip" style="background:#fff">${esc(c.kicker)}</span><h3 style="margin-top:12px">${c.name}</h3><p style="margin-top:8px;font-size:.95rem">${esc(c.short)}</p></div></a>`).join('')}</div>
<p class="note" style="margin-top:24px">Range availability changes; ask us for current lines and colours.</p>
<p style="margin-top:20px"><a class="pill ghost" href="#calculator">How much tile do I need? →</a></p></div></section>
${cxBlock({start:'c20',load:'t',single:'t',only:['c20','c40','pal']})}${cta()}`;

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
${cxBlock({start:'c20',load:'x',free:true})}
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
${cxBlock({start:'pal',load:'x',free:true,only:['pal','air']})}
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

P['how-it-works'] = ()=> head('How it works','Six steps, <em>no surprises</em>.','How an order moves from your enquiry to goods on site: tiles, toilets, insulation or a mix.','b-gold') + `
<section class="block b-onyx"><div class="wrap article">${[['1. Enquiry','Send products, quantities and your delivery point, or build your load on the Containers or Pallets page and press Quote this load. Not sure yet? Tell us the job and we will suggest lines.'],['2. Samples','We arrange samples so you can check tile colour, veining and finish, or see a WC or roll before you commit.'],['3. Written quote','Per order, in USD or EUR for containers, or AED in the UAE: ex-works, CIF to your port, or delivered. It names the routing and surcharges on the day.'],['4. Confirm and pay','You confirm in writing. Payment terms are agreed per order.'],['5. Load and ship','Containers: we book, plan the load by weight and space (tile on the floor, toilets and rolls above) and send the documents. Pallets: prepared at Jebel Ali, then delivered in the UAE or shipped by shared container or air.'],['6. Arrival','Containers: your customs agent clears the goods at the destination port under your country\'s duty and tax rules. Pallets in the UAE: collect or take delivery.']].map(s=>`<h3>${s[0]}</h3><p>${s[1]}</p>`).join('')}</div></section>${cta()}`;

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

P.standards = ()=> head('Standards','Built to the <em>standard</em> your market asks for.','The standards behind each product line: tiles to ISO 13006 and EN 14411, insulation to EN 13162, and what we can supply for toilets.','b-zellige') + `
<section class="block b-onyx"><div class="wrap"><span class="kicker">Tiles · standards by market</span><h2 class="split-lines" style="margin-top:16px;max-width:14ch">One tile, many rulebooks.</h2>
<div class="tscroll"><table class="tbl stack"><thead><tr><th>Market</th><th>Standard</th><th>What it is</th></tr></thead><tbody>${D.standards.map(s=>`<tr><td data-label="Market" style="font-weight:700;white-space:nowrap">${esc(s[0])}</td><td data-label="Standard" class="mono" style="white-space:nowrap">${esc(s[1])}</td><td data-label="" class="wide">${esc(s[2])}</td></tr>`).join('')}</tbody></table></div>
<p class="note">Most national standards are based on ISO 13006, but not all are interchangeable: the US ANSI A137.1, for example, uses its own tests and limits. Tell us your destination country and we'll confirm which test reports and marks are available for each range before you order.</p></div></section>
<section class="block b-travertine"><div class="wrap"><span class="kicker">Toilets and insulation</span><h2 class="split-lines" style="margin-top:16px;max-width:14ch">The other two lines.</h2>
<div class="tscroll"><table class="tbl stack"><thead><tr><th>Product</th><th>Standard</th><th>What it is</th></tr></thead><tbody>${D.standardsOther.map(s=>`<tr><td data-label="Product" style="font-weight:700;white-space:nowrap">${esc(s[0])}</td><td data-label="Standard" class="mono" style="white-space:nowrap">${esc(s[1])}</td><td data-label="" class="wide">${esc(s[2])}</td></tr>`).join('')}</tbody></table></div>
<p class="note">Tell us your destination country and we'll confirm which declarations, test reports and marks are available for each product before you order.</p></div></section>
<section class="block b-white"><div class="wrap article"><span class="kicker">Tiles in Europe, in detail</span>
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
<p style="margin-top:18px">We supply three product lines: RAK porcelain and ceramic tiles, Starvoll toilets and Isover glass wool insulation rolls. We sell them two ways: full or mixed containers to buyers worldwide, and pallets from our Jebel Ali warehouse for builders and fit-out firms in the UAE and beyond.</p>
<p>We are not RAK Ceramics, Starvoll or Isover, and we are not an appointed distributor of any of them. We are a trade buyer that plans loads, handles export paperwork and quotes in writing.</p>
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
${cxBlock({start:'c20',load:'w',single:'w',only:['c20','c40','pal']})}${cta('Need WCs this week?','b-gold')}`; };

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
${cxBlock({start:'c40',load:'i',single:'i',only:['c20','c40','pal']})}${cta('Insulation for your next job?','b-gold')}`; };

P.textiles = ()=> head('Textiles','Textiles, <em>coming soon</em>.','Our second line is on its way. We are adding ranges now.','b-copper') + `<section class="block b-onyx"><div class="wrap grid2"><div><span class="kicker">What's next</span><h2 class="split-lines" style="margin-top:16px">Watch this space.</h2></div><div class="article"><p class="lead">Tell us what you're looking for and we'll let you know when the first ranges are live.</p><div class="ctas" style="margin-top:24px"><a class="pill" href="#quote">Register interest</a><a class="pill ghost" href="#tiles">Back to tiles</a></div></div></div></section>`;
P.quote = ()=> head('Get a quote','Let\'s <em>price</em> it.','Quotes are written per order, with a load plan. Tell us as much as you know about the tiles, toilets or insulation you need; we\'ll fill in the rest.','b-lagoon') + `
<section class="block b-onyx"><div class="wrap grid2"><form id="qf"><div class="f">
<label>Your name<input name="name" required></label><label>Company<input name="company"></label>
<label>Email<input name="email" type="email" required></label><label>Phone / WhatsApp<input name="phone"></label>
<label>How to ship<select name="load"><option>20ft</option><option>40ft</option><option>Pallets</option><option>Air sample pallet</option><option>Not sure</option></select></label>
<label>Delivery to<input name="to" placeholder="Destination port and country, or UAE emirate"></label>
<fieldset class="full prods"><legend>Products</legend><label><input type="checkbox" name="products" value="Tiles"> Tiles</label><label><input type="checkbox" name="products" value="Toilets"> Toilets</label><label><input type="checkbox" name="products" value="Insulation"> Insulation</label><label><input type="checkbox" name="products" value="Textiles"> Textiles (coming soon)</label></fieldset>
<label>Tiles: m² (approx.)<input name="tile_m2" type="number" min="0"></label><label class="full">Tile ranges / colours<input name="ranges" placeholder="e.g. Tech-Marble Calacatta Africa 60×120, Amani Dark Grey"></label>
<label>Toilets: how many<input name="wcs" type="number" min="0"></label><label>Toilet models<input name="wc_models" placeholder="e.g. Starvoll L175 white, L175B black"></label>
<label>Insulation: rolls<input name="rolls" type="number" min="0"></label><label>Roll thickness<select name="roll_mm"><option></option><option>100 mm</option><option>150 mm</option><option>170 mm</option><option>200 mm</option></select></label>
<label class="full">Anything else<textarea name="msg" rows="4"></textarea></label>
<label class="full" style="font-weight:400"><input type="checkbox" name="samples" style="width:auto;margin-right:8px">Please arrange samples</label></div>
<p style="margin-top:18px"><button class="pill copper" type="submit">Prepare my enquiry</button></p></form>
<div><span class="kicker">Contact</span><p class="lead" style="margin-top:12px">Email <a href="mailto:${esc(C.email)}"><b>${esc(C.email)}</b></a><br>Phone / WhatsApp <b>${esc(C.phone)}</b></p><p style="margin-top:12px">${esc(C.address)}</p>
<div class="out" id="qout" aria-live="polite"></div><p><button class="pill" id="qcopy" type="button" style="display:none;margin-top:12px">Copy enquiry</button></p>
<p class="note">This page doesn't send anything by itself. Copy your enquiry and email or WhatsApp it to us.</p></div></div></section>`;
function initQuote(){
  const f=$('#qf'); if(!f) return;
  if(QUOTE_PREFILL){ const q=QUOTE_PREFILL; QUOTE_PREFILL=null; const set=(n,v)=>{ const el=f.elements[n]; if(el && v!=='' && v!=null) el.value=v; };
    const ld=[...f.elements.load.options].find(o=>o.text===q.load); if(ld) f.elements.load.value=ld.text;
    set('tile_m2', q.tileM2); set('wcs', q.wcs); set('rolls', q.rolls); set('msg', 'From the load builder: '+q.text);
    $$('input[name=products]',f).forEach(c=>{ c.checked = (c.value==='Tiles'&&q.tileM2) || (c.value==='Toilets'&&q.wcs) || (c.value==='Insulation'&&q.rolls); });
    if(q.rolls) f.elements.roll_mm.value='100 mm'; }
  f.onsubmit=e=>{ e.preventDefault(); const d=new FormData(f); let t='Enquiry for The Trade Hub\n';
    const lab={name:'Name',company:'Company',email:'Email',phone:'Phone',load:'Shipping',to:'Delivery to',products:'Products',tile_m2:'Tiles m²',ranges:'Tile ranges',wcs:'Toilets',wc_models:'Toilet models',rolls:'Insulation rolls',roll_mm:'Roll thickness',msg:'Notes',samples:'Samples'}; const all={}; for(const [k,v] of d.entries()) if(v) all[k]=(all[k]?all[k]+', ':'')+(k==='samples'?'Yes':v); for(const k in all) t+=`${lab[k]||k}: ${all[k]}\n`; const o=$('#qout'); o.textContent=t; o.classList.add('show'); $('#qcopy').style.display='inline-flex';
    $('#qcopy').onclick=async()=>{ try{ await navigator.clipboard.writeText(t); $('#qcopy').textContent='Copied ✓'; }catch(err){ $('#qcopy').textContent='Select the text above to copy'; } }; };
}
P.notfound = ()=> head('Not found','That page is <em>missing</em>.','The page you asked for isn\'t here.','b-copper', '<p style="margin-top:24px"><a class="pill" href="#home">Back home</a></p>');

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
