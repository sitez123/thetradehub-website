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
function floatsMobile(){
  return FLM.map(([k,l,t,w,d,r])=>{
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
    <div><a class="logo" href="#home" style="color:var(--onyx)"><i></i>The Trade Hub</a><p style="margin-top:14px;opacity:.8;max-width:34ch">Ceramic and porcelain tiles from Ras Al Khaimah. Containers worldwide, pallets across the UAE.</p>
      <p style="margin-top:14px" class="mono">${esc(C.phone)} · ${esc(C.email)}</p></div>
    <div><h4>Tiles</h4>${D.collections.map(c=>`<a href="#${c.id}">${c.name}</a>`).join('')}</div>
    <div><h4>Buying</h4><a href="#containers">Containers</a><a href="#pallets">Pallets</a><a href="#how-it-works">How it works</a><a href="#calculator">Calculator</a><a href="#quote">Get a quote</a><a href="#textiles">Textiles</a></div>
    <div><h4>Know-how</h4><a href="#guides">Guides</a><a href="#standards">Standards</a><a href="#glossary">Glossary</a><a href="#faq">FAQ</a><a href="#about">About</a><a href="#credits">Credits</a></div>
  </div>
  <p class="fine">The Trade Hub is an independent trading company in ${esc(C.base)}. RAK Ceramics and its range names are trademarks of RAK Ceramics PJSC; product photography courtesy of RAK Ceramics, used with permission.</p>
  <div class="wordmark" aria-hidden="true">The Trade Hub</div></div></footer>`;
}

/* ---------- container explainer (signature) ---------- */
const MODES = {
  c20: { name:'20ft container', cols:8, rows:5, fill:23, unit:'tonne', m2:1080, t:23, boxes:750, w:340,
         note:'A 20ft fills by <b>weight</b>, not space: about 23 t of tile on pallets, roughly 1,080 m² of 60 × 120 (about 25 t with the box). Empty space is normal.' },
  c40: { name:'40ft container', cols:16, rows:5, fill:25, unit:'tonne', m2:1170, t:25, boxes:810, w:620,
         note:'Twice the space, but only ~8% more tile: about 25 t (1,170 m²) keeps the lorry legal on 44-tonne roads, and less in 40-tonne countries. Fill the rest with lighter goods such as sanitaryware.' },
  pal: { name:'Jebel Ali pallet', cols:6, rows:5, fill:30, unit:'box', m2:43.2, t:0.92, boxes:30, w:210,
         note:'A pallet from our Jebel Ali warehouse: 30 boxes of 60 × 120 = 43.2 m², about 920 kg. Delivered across the UAE or shipped worldwide for fast orders.' }
};
const MIX = {
  c20:{ tileN:16, sanN:12, m2:750, tT:16, sT:3, pcs:120, note:'<b>Example mixed 20ft:</b> about 750 m² of tile low down, then about 120 boxed WCs, basins, baths and trays stacked on top, ≈ 19 t. You use more of the space and still stay under the weight limit.' },
  pal:{ tileN:12, sanN:18, m2:17.3, tT:0.35, sT:0.4, pcs:18, note:'<b>Example mixed pallet:</b> 12 boxes of tile (about 17 m²) plus 18 boxed WCs and basins, about 0.8 t. Ideal for a fast replacement order shipped anywhere.' },
  c40:{ tileN:18, sanN:24, m2:840, tT:18, sT:6, pcs:240, note:'<b>Example mixed 40ft:</b> about 840 m² of tile on the floor plus about 240 boxed sanitaryware pieces on top, ≈ 24 t (about 28 t with the box). This is where a 40ft beats a 20ft.' }
};
const SAN = [ // little sanitaryware pictograms (36×36 cell)
  '<path d="M9 9h7v12H9zM13 21h15a0 0 0 0 1 0 0c0 5-4 8-9 8h-2l1 4h-6l1-4c-2-1-3-3-3-6z" />',            // WC
  '<path d="M6 17h24c0 6-5 10-12 10S6 23 6 17zM18 9v8M14 9h8" />',                                          // basin + tap
  '<path d="M4 16h28v4c0 6-4 9-10 9H14C8 29 4 26 4 20zM8 16V9a3 3 0 0 1 6 0M9 29l-1 3M27 29l1 3" />',      // bath
  '<rect x="6" y="12" width="24" height="16" rx="2"/><circle cx="18" cy="20" r="2"/>',                     // shower tray
  '<circle cx="18" cy="17" r="10"/><path d="M14 13a6 6 0 0 1 5-3" />'                                        // mirror
];
let cxMix=false;
const FAM = D.families.find(f=>f.ready); const FAM_ = 0; const PAT = FAM.blockImgs;
const AIRCOL=['#E9E4DC','#463B37','#C9CFD1','#2F5A52','#F1EEE8','#A29D99','#A08A6E','#B9A385'];
const AIR = { boxes:24, m2PerBox:1.44, kgBox:29, wc:30, basin:18, pallet:12,
  note:'<b>Distributor sample pallet by air:</b> 120 × 100 cm plastic pallet (no fumigation needed), 24 boxes across 6–8 ranges in the base, a boxed WC and basin on top. About 153 cm high and 0.76 t: inside the ≈ 160 cm belly-hold limit and the aircraft floor-load limit.' };
function cxSVG(){
  const pats = PAT.map((p,i)=>`<pattern id="p${i}" patternUnits="objectBoundingBox" width="1" height="1"><image href="img/${p}.jpg" width="60" height="44" preserveAspectRatio="xMidYMid slice"/></pattern>`).join('');
  return `<svg class="cx-svg" viewBox="0 0 680 320" role="img" aria-label="Container filling with tiles"><defs>${pats}
    <pattern id="rib" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#b8562f"/><rect width="4" height="10" fill="#a94c28"/></pattern></defs>
    <g id="cxg"></g></svg>`;
}
let cxMode='c20', cxP=0;
function drawAir(g){
  const u=2.5, W=120*u, x0=60, base=300, palH=15*u, boxH=2.2*u, n=AIR.boxes;
  const total=n+2, shown=Math.round(cxP*total);
  let s='';
  // height limit line at 160 cm
  const lim=base-160*u;
  s+=`<line x1="${x0-30}" y1="${lim}" x2="${x0+W+30}" y2="${lim}" stroke="#F6F2EA" stroke-dasharray="6 5" opacity=".7"/><text x="${x0+W+34}" y="${lim+4}" fill="currentColor" font-family="JetBrains Mono" font-size="12">160 cm max</text>`;
  // plastic pallet
  s+=`<rect x="${x0}" y="${base-palH}" width="${W}" height="${palH*.35}" rx="3" fill="#2A201C"/>`;
  for(const fx of [0,.45,.9]) s+=`<rect x="${x0+W*fx}" y="${base-palH*.65}" width="${W*.1}" height="${palH*.65}" rx="2" fill="#2A201C"/>`;
  let y=base-palH;
  for(let k=0;k<n;k++){ y-=boxH; if(k<shown){ const col=AIRCOL[Math.floor(k/3)%AIRCOL.length]; s+=`<rect x="${x0+2}" y="${y}" width="${W-4}" height="${boxH-.6}" rx="1" fill="${col}"/><rect x="${x0+2}" y="${y}" width="${W-4}" height=".8" fill="rgba(255,255,255,.35)"/>`; }
    else s+=`<rect x="${x0+2}" y="${y}" width="${W-4}" height="${boxH-.6}" fill="none" stroke="rgba(255,255,255,.15)" stroke-dasharray="2 2"/>`; }
  const top=y; // WC carton 45 × 85 cm, basin carton 65 × 25 cm
  const wcW=45*u, wcH=85*u, bW=65*u, bH=25*u;
  const draw=(x,yy,w,h,icon,on)=> on ? `<g><rect x="${x}" y="${yy}" width="${w}" height="${h}" rx="4" fill="#F6F2EA"/><g transform="translate(${x+w/2-27} ${yy+h/2-27}) scale(1.5)" fill="none" stroke="#2A201C" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${icon}</g></g>`
                                     : `<rect x="${x}" y="${yy}" width="${w}" height="${h}" rx="4" fill="none" stroke="rgba(255,255,255,.25)" stroke-dasharray="4 4"/>`;
  s+=draw(x0+6, top-wcH, wcW, wcH, SAN[0], shown>n);
  s+=draw(x0+6+wcW+8, top-bH, bW, bH, SAN[1], shown>n+1);
  // width label
  s+=`<text x="${x0}" y="${base+20}" fill="currentColor" font-family="JetBrains Mono" font-size="12">PLASTIC PALLET · 120 × 100 cm · tile box ≈ 2.2 cm</text>`;
  g.innerHTML=s;
  g.ownerSVGElement.setAttribute('viewBox', `20 ${lim-30} ${W+170} ${base-lim+60}`);
  const bx=Math.min(shown,n), kg=bx*AIR.kgBox+(shown>n?AIR.wc:0)+(shown>n+1?AIR.basin:0)+AIR.pallet*(shown>0?1:0);
  const fmt=(v,d=0)=>v.toLocaleString('en-GB',{maximumFractionDigits:d,minimumFractionDigits:d});
  $('#cx-m2').textContent=fmt(bx*AIR.m2PerBox,1); $('#cx-t').textContent=fmt(kg/1000,2); $('#cx-b').textContent=fmt(bx);
  $('#cx-bl').textContent='boxes + WC + basin'; $('#cx-note').innerHTML=AIR.note;
  const mb=$('#cx-mix'); if(mb) mb.hidden=true;
  const sl=$('#cx-range'); if(sl && document.activeElement!==sl) sl.value=Math.round(cxP*100);
}
function drawCX(){
  const g = $('#cxg'); if(!g) return;
  if(cxMode==='air') return drawAir(g);
  const m = MODES[cxMode];
  const cell=36, gap=3, iw=m.cols*(cell+gap)+gap, ih=m.rows*(cell+gap)+gap;
  const x0 = (680-iw)/2, y0 = 300-ih-14;
  const mx = (cxMix && MIX[cxMode]) ? MIX[cxMode] : null;
  const seq = mx ? Array(mx.tileN).fill('t').concat(Array(mx.sanN).fill('s')) : Array(m.fill).fill('t');
  const shown = Math.round(cxP*seq.length);
  let s='';
  if(cxMode==='pal'){
    s+=`<rect x="${x0-10}" y="${y0+ih}" width="${iw+20}" height="16" rx="3" fill="#b48659"/><rect x="${x0}" y="${y0+ih+16}" width="18" height="10" fill="#8d6640"/><rect x="${x0+iw/2-9}" y="${y0+ih+16}" width="18" height="10" fill="#8d6640"/><rect x="${x0+iw-18}" y="${y0+ih+16}" width="18" height="10" fill="#8d6640"/>`;
    s+=`<text x="${x0-10}" y="${y0-12}" fill="currentColor" font-family="JetBrains Mono" font-size="13">PALLET${mx?' · MIXED':''} · each block = 1 box${mx?' or 1 piece':''}</text>`;
  } else {
    s+=`<rect x="${x0-14}" y="${y0-14}" width="${iw+28}" height="${ih+28}" rx="6" fill="url(#rib)"/><rect x="${x0}" y="${y0}" width="${iw}" height="${ih}" fill="#2a201c" opacity=".88"/>`;
    s+=`<text x="${x0-14}" y="${y0-24}" fill="currentColor" font-family="JetBrains Mono" font-size="13">${m.name.toUpperCase()}${mx?' · MIXED LOAD':''}</text>`;
  }
  let k=0;
  for(let r=m.rows-1;r>=0;r--) for(let c=0;c<m.cols;c++){
    const x=x0+gap+c*(cell+gap), y=y0+gap+r*(cell+gap);
    if(k<shown){
      if(seq[k]==='t') s+=`<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="3" fill="url(#p${k%PAT.length})" stroke="rgba(255,255,255,.5)" stroke-width="1"/>`;
      else s+=`<g transform="translate(${x} ${y})"><rect width="${cell}" height="${cell}" rx="3" fill="#F6F2EA"/><g fill="none" stroke="#2A201C" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${SAN[(k-mx.tileN)%SAN.length]}</g></g>`;
    }
    else if(k>=seq.length || cxMode==='pal'){ s+=`<rect x="${x+.5}" y="${y+.5}" width="${cell-1}" height="${cell-1}" rx="3" fill="none" stroke="rgba(255,255,255,.18)" stroke-dasharray="3 3"/>`; }
    k++;
  }
  g.innerHTML=s;
  const svg=g.ownerSVGElement, pad=cxMode==='pal'?40:44; svg.setAttribute('viewBox', `${x0-pad} ${y0-pad-16} ${iw+pad*2} ${ih+pad*2+30}`);
  const fmt=(v,d=0)=>v.toLocaleString('en-GB',{maximumFractionDigits:d,minimumFractionDigits:d});
  if(mx){
    const ft=Math.min(shown,mx.tileN)/mx.tileN, fs=Math.max(0,shown-mx.tileN)/mx.sanN;
    $('#cx-m2').textContent=fmt(mx.m2*ft, cxMode==='pal'?1:0); $('#cx-t').textContent=fmt(mx.tT*ft+mx.sT*fs, cxMode==='pal'?2:1); $('#cx-b').textContent=fmt(mx.pcs*fs);
    $('#cx-bl').textContent='sanitary pieces'; $('#cx-note').innerHTML=mx.note;
  } else {
    const p=cxP;
    $('#cx-m2').textContent = fmt(m.m2*p, m.m2<100?1:0);
    $('#cx-t').textContent = fmt(m.t*p, m.t<5?2:1);
    $('#cx-b').textContent = fmt(m.boxes*p);
    $('#cx-bl').textContent='boxes'; $('#cx-note').innerHTML = m.note;
  }
  const mb=$('#cx-mix'); if(mb){ mb.hidden=false; mb.setAttribute('aria-pressed', cxMix); }
  const sl=$('#cx-range'); if(sl && document.activeElement!==sl) sl.value=Math.round(cxP*100);
}
function cxBlock(start='c20'){
  return `<section class="block b-lagoon" id="cx" data-start="${start}"><div class="wrap cx">
    <div><span class="kicker">How tiles really ship</span><h2 class="split-lines" style="margin-top:16px">Tiles fill a box by <em>weight</em>.</h2>
      <p class="lead" style="margin-top:20px">Scroll to load it. Switch between a 20ft, a 40ft, a pallet and an air sample pallet to see what you actually get.</p>
      <div class="cx-toggle" role="group" aria-label="Load type">
        <button data-m="c20" aria-pressed="true">20ft container</button><button data-m="c40" aria-pressed="false">40ft container</button><button data-m="pal" aria-pressed="false">Pallet</button><button data-m="air" aria-pressed="false">Air sample</button></div>
      <button class="pill" id="cx-mix" type="button" aria-pressed="false" style="margin:0 0 6px;background:var(--onyx);color:var(--noir)">＋ Mixed load: tiles + sanitaryware</button>
      <div class="cx-stats"><div><b id="cx-m2">0</b><span>m² of 60 × 120</span></div><div><b id="cx-t">0</b><span>tonnes</span></div><div><b id="cx-b">0</b><span id="cx-bl">boxes</span></div></div>
      <p class="cx-note" id="cx-note"></p>
      <label class="kicker" for="cx-range" style="display:block;margin-top:12px">Load it by hand</label><input id="cx-range" type="range" min="0" max="100" value="0">
      <p class="note" style="opacity:.8">Approximate figures for 9 mm porcelain at 29 kg per 1.44 m² box. Exact loads depend on packing and the shipping line's weight limits.</p>
    </div>
    <div>${cxSVG()}<div class="legend"><span><i style="background:var(--gold)"></i>Marble</span><span><i style="background:var(--noir)"></i>Café noir</span><span><i style="background:var(--zellige)"></i>Glazed wall</span><span><i style="background:var(--oak)"></i>Wood plank</span><span><i style="background:var(--onyx)"></i>Sanitaryware (mixed load)</span><span><i style="border:1px dashed #fff"></i>Space left by the weight limit</span><span>Container: tile block ≈ 1 t, sanitary block ≈ 10 pieces · Pallet: 1 box or 1 piece per block</span></div></div>
  </div></section>`;
}
function initCX(){
  if(!$('#cx')) return;
  $$('.cx-toggle button').forEach(b=>b.onclick=()=>{ cxMode=b.dataset.m; $$('.cx-toggle button').forEach(x=>x.setAttribute('aria-pressed', x===b)); drawCX(); });
  $('#cx-mix').onclick=()=>{ cxMix=!cxMix; $('#cx-mix').textContent = cxMix ? '✓ Mixed load: tiles + sanitaryware' : '＋ Mixed load: tiles + sanitaryware'; drawCX(); };
  $('#cx-range').oninput=e=>{ cxP=e.target.value/100; drawCX(); };
  cxMix=false; cxMode=$('#cx').dataset.start||'c20'; $$('.cx-toggle button').forEach(x=>x.setAttribute('aria-pressed', x.dataset.m===cxMode)); $('#cx-mix').textContent='＋ Mixed load: tiles + sanitaryware';
  cxP = 0; drawCX();
  if(hasG() && !reduce){
    const upd=s=>{ cxP=s.progress; drawCX(); };
    if(desk() || mobPin()) ScrollTrigger.create({ trigger:'#cx', start:'top top', end:desk()?'+=900':'+=700', pin:true, scrub:.4, onUpdate:upd, anticipatePin:1 });
    else ScrollTrigger.create({ trigger:'#cx .cx-svg', start:'top 85%', end:'bottom 30%', scrub:.4, onUpdate:upd });
  } else { cxP = 1; drawCX(); }
}

function famSwitch(page){
  return `<div class="famsw" role="group" aria-label="Product">${D.families.map(f=> f.ready ? `<span class="on">${f.word}</span>` : `<span class="off" title="Coming soon">${f.word} · soon</span>`).join('')}</div>`;
}
/* ---------- pages ---------- */
const P = {};
P.home = ()=>`
<section class="hero"><div class="wrap">
  <span class="kicker">Ras Al Khaimah · Jebel Ali · Worldwide</span>
  <h1 class="hero-h" style="margin-top:18px"><span class="ln"><span>Marble looks,</span></span><span class="ln"><span><em>straight</em> from</span></span><span class="ln"><span>the kiln.</span></span></h1>
  <p class="lead">RAK porcelain and ceramic tiles, shipped by the 20ft or 40ft container to buyers worldwide, and by the pallet from our Jebel Ali warehouse, across the UAE or worldwide for fast orders.</p>
  <div class="ctas"><a class="pill copper" href="#containers">Containers worldwide</a><a class="pill" href="#pallets">Pallets worldwide</a><a class="pill ghost" href="#tiles">See the tiles</a></div>
</div>${floats(FL)}${floatsMobile()}</section>
${marquee(['Calacatta','60 × 120','Café noir','Polished','Grey silk','120 × 120','Lappato','Travertine','20ft · 40ft','Zellige glaze','Honed','Jebel Ali pallets'])}
${cxBlock()}
<section class="block b-onyx"><div class="wrap">
  <span class="kicker">Two ways to buy</span><h2 class="split-lines" style="margin-top:16px;max-width:12ch">One factory. Two markets.</h2>
  <div class="split">
    <a class="card dark" href="#containers"><span class="chip" style="background:var(--copper);color:#fff">Worldwide</span><h3>Full containers to your port</h3>
      <p>For importers, merchants, developers and contractors in any market who want factory-direct pricing on volume.</p>
      <ul><li>20ft ≈ 1,080 m² · 40ft ≈ 1,170 m²</li><li>Mix ranges and colours in one load</li><li>Made to ISO 13006 and EN 14411 (CE)</li></ul><span class="pill gold">Containers →</span></a>
    <a class="card lag" href="#pallets"><span class="chip" style="color:var(--noir)">UAE &amp; worldwide</span><h3>Pallets for fast orders</h3>
      <p>From our Jebel Ali warehouse, for jobs that can't wait for a full container.</p>
      <ul><li>Delivered across the UAE</li><li>Shipped worldwide: shared container or air</li><li>Ideal for top-ups and replacement WCs and basins</li></ul><span class="pill" style="background:var(--onyx);color:var(--noir)">Pallets →</span></a>
  </div></div></section>
<section class="block b-gold hstrip" id="hs"><div class="wrap"><span class="kicker">The collections</span><h2 class="split-lines" style="margin:16px 0 40px">Every look a modern home asks for.</h2><p class="swipe-hint">Swipe to explore <span>→</span></p></div>
  <div class="htrack">${D.collections.map(c=>`<a class="hcard" href="#${c.id}"><div class="ph"><img src="${c.img}" alt="${esc(c.name)} tiles in a room setting"></div><div class="tx"><span class="chip">${esc(c.kicker)}</span><h3 style="margin-top:12px">${c.name}</h3><p>${esc(c.short)}</p></div></a>`).join('')}</div></section>
<div class="band"><img src="img/mega-slabs-marble.jpg" alt="Kitchen with large marble-effect porcelain slabs" class="band-img"><div class="cap"><span class="kicker">Mega slabs</span><h3 style="font-family:var(--display);font-weight:400;font-size:2.2rem;line-height:1;margin-top:8px">Islands, walls and worktops in one piece.</h3><small>Photo: RAK Ceramics</small></div></div>
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
<p class="note" style="margin-top:24px">Photos: RAK Ceramics. Range availability changes; ask us for current lines and colours.</p></div></section>${cta()}`;

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
  <p class="note">Photo: RAK Ceramics.</p></div></div></section>
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

P.containers = ()=> head('Containers','By the <em>container</em>, worldwide.','For importers, merchants, developers and contractors in any market. Factory-direct RAK porcelain in 20ft or 40ft loads, mixed as you need, shipped to your port.','b-copper', famSwitch('containers'), FAM.word) + `
<section class="block b-onyx"><div class="wrap grid2"><div><span class="kicker">20ft or 40ft?</span><h2 class="split-lines" style="margin-top:16px">Pick by weight.</h2></div><div>
 <div class="tscroll"><table class="tbl"><thead><tr><th></th><th>20ft</th><th>40ft</th></tr></thead><tbody>
 <tr><td>Tile we load (incl. pallets)</td><td>≈ 23 t</td><td>≈ 25 t</td></tr>
 <tr><td>60 × 120 cm, 9 mm</td><td>≈ 1,080 m²</td><td>≈ 1,170 m²</td></tr>
 <tr><td>Pallets / boxes</td><td>25 / 750</td><td>27 / 810</td></tr>
 <tr><td>Gross with container (VGM)</td><td>≈ 25.3 t</td><td>≈ 28.9 t</td></tr>
 <tr><td>Container's own rating</td><td>≈ 28 t cargo</td><td>≈ 28.7 t cargo</td></tr>
 <tr><td>Best for</td><td>Tile-only orders</td><td>Mixed loads with lighter goods</td></tr></tbody></table></div>
 <p class="note">We load below the container's rating because the lorry is the real limit: 44 t gross in the UK and 40 t in much of Europe, including the truck. Many lines also add a heavy-load surcharge once a 20ft passes about 20 t gross. Pallet of 60 × 120 ≈ 43.2 m², ≈ 920 kg. Every quote comes with a load plan for your destination.</p></div></div></section>
<section class="block b-white"><div class="wrap"><span class="kicker">What you get</span><h2 class="split-lines" style="margin-top:16px">Paperwork done.</h2>
<div class="steps">${[['Commercial invoice','Values, codes and Incoterm, ready for your customs agent.'],['Packing list','Crate by crate: range, boxes, m² and weight.'],['Bill of lading','Issued by the shipping line for collection at your port.'],['Standards papers','Declaration of Performance to EN 14411 for Europe; ISO 13006 test data or your market\'s standard on request.']].map((s,i)=>`<div class="step"><b>${i+1}</b><h3>${s[0]}</h3><p style="margin-top:6px">${s[1]}</p></div>`).join('')}</div>
<p style="margin-top:28px">We can also supply a certificate of origin. Routes and surcharges out of the Gulf change often, so each quote names the port, routing and charges on the day. <a href="#standards">Standards by country →</a></p></div></section>
${cxBlock()}${cta('Plan your first container.','b-gold')}`;

P.pallets = ()=> head('Pallets','By the <em>pallet</em>, worldwide.','From our Jebel Ali warehouse, for jobs that can\'t wait for a full container: urgent top-ups, small projects, or replacement WCs and basins.','b-zellige', famSwitch('pallets'), FAM.word) + `
<section class="block b-onyx"><div class="wrap grid2"><div><span class="kicker">A typical pallet</span><h2 class="split-lines" style="margin-top:16px">43.2 m², ready to go.</h2></div><div>
<table class="spec"><tr><td>Format</td><td>60 × 120 cm porcelain, 9 mm</td></tr><tr><td>Boxes per pallet</td><td>30 (2 tiles · 1.44 m² each)</td></tr><tr><td>Coverage</td><td>43.2 m²</td></tr><tr><td>Weight</td><td>≈ 920 kg</td></tr><tr><td>From</td><td>${esc(C.warehouse)}</td></tr><tr><td>In the UAE</td><td>Collect, or delivered across the Emirates</td></tr><tr><td>Worldwide</td><td>Tile pallets by sea in a shared container (LCL); air for samples, sanitaryware and small urgent top-ups</td></tr><tr><td>Prices</td><td class="por">On request: AED in the UAE, USD or EUR for export</td></tr></table>
<p class="note">Pallet make-up varies by range and size; we confirm it on the quote. A full tonne of tile by air costs more than the tiles are worth, so heavy tile pallets go by sea.</p></div></div></section>
<section class="block b-white"><div class="wrap"><span class="kicker">When a pallet beats a container</span><h2 class="split-lines" style="margin-top:16px;max-width:14ch">Fast, small, urgent.</h2>
<div class="grid3">${[['Top-up orders','Short on a range mid-job? Send the code and m² and we\'ll ship a pallet to match.'],['Replacement sanitaryware','Broken WC or basin on site? A mixed pallet of boxed sanitaryware can fly or ship fast.'],['Mix a pallet','Floor, wall and feature tiles plus sanitaryware on one pallet and one delivery.']].map(s=>`<div class="gcard b-onyx" style="min-height:200px"><h3>${s[0]}</h3><p>${s[1]}</p></div>`).join('')}</div></div></section>
<section class="block b-noir"><div class="wrap grid2"><div><span class="kicker" style="color:var(--gold)">For distributors</span><h2 class="split-lines" style="margin-top:16px">The sample pallet, by air.</h2>
<p class="lead" style="margin-top:20px">Everything a new distributor needs to judge the range, on one pallet that flies in the belly of a passenger aircraft: tile boxes from several ranges in the base, a boxed WC and basin on top.</p>
<p style="margin-top:22px"><a class="pill gold" href="#quote">Request a sample pallet</a></p></div>
<div><table class="spec" style="color:var(--onyx)"><tr><td>Pallet</td><td>Plastic, 120 × 100 cm (no ISPM 15 fumigation needed)</td></tr><tr><td>Max height</td><td>≈ 160 cm including pallet (lower-deck limit; some aircraft allow ≈ 163 cm)</td></tr><tr><td>Base</td><td>≈ 24 boxes of tile across 6–8 ranges, ≈ 35 m², ≈ 0.7 t</td></tr><tr><td>Top</td><td>1 boxed WC (≈ 45 × 75 × 85 cm) + 1 boxed basin</td></tr><tr><td>Gross weight</td><td>≈ 760 kg, kept under ≈ 1 t for aircraft floor loading</td></tr><tr><td>Transit</td><td>Typically 1–3 days airport to airport from Dubai</td></tr><tr><td>Freight</td><td>Charged on actual weight; quoted on the day</td></tr></table>
<p class="note" style="color:var(--onyx)">Example build. Final contents, box sizes and weight are confirmed on the quote and with the airline.</p></div></div></section>
${cxBlock('pal')}${cta('Need a pallet this week?','b-gold')}`;

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
P.textiles = ()=> head('Textiles','Textiles, <em>coming soon</em>.','Our second line is on its way. We are adding ranges now.','b-copper') + `<section class="block b-onyx"><div class="wrap grid2"><div><span class="kicker">What's next</span><h2 class="split-lines" style="margin-top:16px">Watch this space.</h2></div><div class="article"><p class="lead">Tell us what you're looking for and we'll let you know when the first ranges are live.</p><div class="ctas" style="margin-top:24px"><a class="pill" href="#quote">Register interest</a><a class="pill ghost" href="#tiles">Back to tiles</a></div></div></div></section>`;
P.credits = ()=> head('Credits','Thank you.','','b-silk') + `<section class="block b-onyx"><div class="wrap article"><h3>Photography</h3><p>Product and room photography courtesy of RAK Ceramics (rakceramics.com, onlineshop.rakceramics.com), used with permission. Some marble swatches on product pages are illustrations and are labelled as such.</p><h3>Type</h3><p>Instrument Serif, Hanken Grotesk and JetBrains Mono, via Google Fonts.</p><h3>Code</h3><p>GSAP and ScrollTrigger (GreenSock), Lenis smooth scroll.</p><h3>Trademarks</h3><p>RAK Ceramics, Tech-Marble, Amani Marble, Maximus and other range names belong to RAK Ceramics PJSC.</p></div></section>`;
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
  const alias={'uk-trade':'containers','compliance':'standards','uae-pallets':'pallets'}; if(alias[h]) h=alias[h];
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
  document.title = (key==='home'?'':(($('h1')||{}).textContent||'').replace(/\s+/g,' ').trim()+' · ') + 'The Trade Hub: RAK tiles by the container, worldwide';
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
  let last=0; addEventListener('scroll',()=>{ const y=scrollY; $('.nav').classList.toggle('hide', y>last && y>220); $('.mbar').classList.toggle('show', y>innerHeight*.55 || !$('.hero')); last=y; },{passive:true});
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
