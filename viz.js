"use strict";
/* ============ المحاكيات (ثنائية اللغة) ============ */
function vizHazel(c){
  const NETS={3:[[0,1],[1,2],[0,1]],4:[[0,1],[2,3],[0,2],[1,3],[1,2]],5:[[0,3],[1,4],[0,2],[1,3],[0,1],[2,4],[1,2],[3,4],[2,3]]};
  let n=4,k=0,init=[];
  const shuf=()=>{do{init=[...Array(n).keys()].map(x=>x+1).sort(()=>Math.random()-.5)}while(init.every((v,i)=>v===i+1));k=0};
  const at=kk=>{const a=[...init];for(let s=0;s<kk;s++){const[i,j]=NETS[n][s];if(a[i]>a[j])[a[i],a[j]]=[a[j],a[i]]}return a};
  c.innerHTML=`<p class="cap">${B("شبكة فرز تفاعلية: كل خط عمودي «مقارن» يبدّل المدخلين إن كانا بترتيب خاطئ (الأصغر للأعلى). الأرقام مواضع الشبكات التي تحققتُ منها برمجياً.","Interactive sorting network: each vertical line is a “comparator” that swaps its two inputs if they are out of order (smaller goes up). The networks shown are the ones I verified programmatically.")}</p><div id="hz"></div><div class="vbar"><span class="row" id="hzn"></span><button class="chip" id="hzr">${S("ترتيب عشوائي","Shuffle")}</button><button class="chip" id="hzb">${S("رجوع","Back")}</button><button class="chip" id="hzx">${S("الخطوة التالية ▶","Next step ▶")}</button><span class="st" id="hzs"></span></div>`;
  function draw(){
    const net=NETS[n],m=net.length,W=620,H=50+n*56,y=i=>40+i*56,x0=90,x1=590,xs=s=>x0+30+s*((x1-x0-60)/Math.max(m-1,1));
    const a=at(k);let g='';
    for(let i=0;i<n;i++)g+=`<line x1="${x0-10}" x2="${x1}" y1="${y(i)}" y2="${y(i)}" stroke="rgba(255,255,255,.35)" stroke-width="3"/>`;
    net.forEach(([i,j],s)=>{const col=s<k?'#25d091':s===k?'#ffc83d':'rgba(255,255,255,.5)';g+=`<line x1="${xs(s)}" x2="${xs(s)}" y1="${y(i)}" y2="${y(j)}" stroke="${col}" stroke-width="5" stroke-linecap="round"/><circle cx="${xs(s)}" cy="${y(i)}" r="7" fill="${col}"/><circle cx="${xs(s)}" cy="${y(j)}" r="7" fill="${col}"/>`});
    for(let i=0;i<n;i++)g+=`<g transform="translate(40 ${y(i)})"><ellipse cx="0" cy="2" rx="19" ry="21" fill="#b8742f" stroke="#6b3d12" stroke-width="2"/><path d="M-19 -2 Q0 -26 19 -2 Q0 -12 -19 -2Z" fill="#7c4a1a"/><text x="0" y="12" text-anchor="middle" font-size="20" font-weight="800" fill="#fff">${a[i]}</text></g>`;
    $('hz').innerHTML=`<svg viewBox="0 0 ${W} ${H}" width="${W}">${g}</svg>`;
    const done=k===m;$('hzs').textContent=done?(a.every((v,i)=>i===0||a[i-1]<=v)?ST(`✓ تم الترتيب بعد ${m} مقارنات`,`✓ Sorted after ${m} comparisons`):''):ST(`الخطوة ${k}/${m} — التالي: قارن الموضعين ${net[k][0]+1} و${net[k][1]+1}`,`Step ${k}/${m} — next: compare positions ${net[k][0]+1} and ${net[k][1]+1}`);
    $('hzn').innerHTML=[3,4,5].map(v=>`<button class="chip" data-n="${v}" aria-pressed="${v===n}">${S(`${v} مدخلات`,`${v} inputs`)}</button>`).join('');
    $('hzn').querySelectorAll('button').forEach(b=>b.onclick=()=>{n=+b.dataset.n;shuf();draw()});
  }
  $('hzr').onclick=()=>{shuf();draw()};$('hzb').onclick=()=>{k=Math.max(0,k-1);draw()};$('hzx').onclick=()=>{k=Math.min(NETS[n].length,k+1);draw()};
  shuf();draw();
}

function vizGrid(c){
  const G0=[[0,1,0,1,1],[1,1,2,3,2],[0,0,1,1,1],[1,2,2,0,0],[0,1,1,0,0]];
  const SH={T:[[0,1],[1,0],[1,1],[1,2]],S:[[0,0],[0,1],[1,0],[1,1]],B:[[0,0],[0,1],[0,2]]};
  const SOL=[['T',0,0],['S',0,3],['B',1,2],['T',1,2],['B',3,0],['S',3,1]];
  const NAME={T:['حرف T','T shape'],S:['مربع 2×2','2×2 square'],B:['شريط من 3','bar of 3']};
  let k=0;
  const state=kk=>{const g=G0.map(r=>[...r]);for(let s=0;s<kk;s++){const[n,r,cc]=SOL[s];SH[n].forEach(([dr,dc])=>g[r+dr][cc+dc]--)}return g};
  c.innerHTML=`<p class="cap">${B("المستوى 3 (5×5): تتبّع الحل قطعةً قطعة (تحققتُ منه برمجياً حتى وصلت كل الخلايا إلى صفر). الإطار الأخضر = القطعة الأخيرة المُوضَعة.","Level 3 (5×5): follow the solution piece by piece (verified programmatically until every cell reached zero). Green outline = the last piece placed.")}</p><div id="gd"></div><div class="vbar"><button class="chip" id="gb">${S("◀ السابقة","◀ Previous")}</button><button class="chip" id="gx">${S("القطعة التالية ▶","Next piece ▶")}</button><button class="chip" id="gr">${S("من البداية","Restart")}</button><span class="st" id="gs"></span></div>`;
  function draw(){
    const g=state(k),cs=64,pal=['rgba(255,255,255,.07)','#4a8cff','#8a5cf5','#ffc83d','#ff7a70'];
    const last=new Set();if(k>0){const[n,r,cc]=SOL[k-1];SH[n].forEach(([dr,dc])=>last.add((r+dr)+','+(cc+dc)))}
    let s='';g.forEach((row,i)=>row.forEach((v,j)=>{s+=`<rect x="${j*cs+4}" y="${i*cs+4}" width="${cs-6}" height="${cs-6}" rx="12" fill="${pal[Math.min(v,4)]}" stroke="${last.has(i+','+j)?'#25d091':'rgba(255,255,255,.18)'}" stroke-width="${last.has(i+','+j)?5:1.5}"/><text x="${j*cs+cs/2+1}" y="${i*cs+cs/2+11}" text-anchor="middle" font-size="30" font-weight="800" fill="${v?'#fff':'rgba(255,255,255,.3)'}">${v}</text>`}));
    $('gd').innerHTML=`<svg viewBox="0 0 ${cs*5+8} ${cs*5+8}" width="340">${s}</svg>`;
    $('gs').textContent=k===0?ST('الشبكة الابتدائية','Initial grid'):ST(`الخطوة ${k}/6: ${NAME[SOL[k-1][0]][0]} عند (صف ${SOL[k-1][1]}، عمود ${SOL[k-1][2]})`+(k===6?' — كل الخلايا صفر ✓':''),`Step ${k}/6: ${NAME[SOL[k-1][0]][1]} at (row ${SOL[k-1][1]}, col ${SOL[k-1][2]})`+(k===6?' — all cells zero ✓':''));
  }
  $('gb').onclick=()=>{k=Math.max(0,k-1);draw()};$('gx').onclick=()=>{k=Math.min(6,k+1);draw()};$('gr').onclick=()=>{k=0;draw()};
  draw();
}

function vizEmoji(c){
  const RULES=[['FFFF','R'],['RFF','R'],['RF','P']];
  let nF=5,step=0;
  const hist=()=>{let s='F'.repeat(nF);const h=[s];RULES.forEach(([a,b])=>{s=s.split(a).join(b);h.push(s)});return h};
  const toks=s=>'<span class="ltr">'+([...s].map(ch=>`<span class="tok">${av({F:'fox',R:'rabbit',P:'panda'}[ch],40)}</span>`).join('')||'—')+'</span>';
  const arrow=mode==='en'?'→':'←';
  c.innerHTML=`<p class="cap">${B("المستوى 4: مجموعة ثعالب بعدد 4 أو 5 أو 6 يجب أن تتحوّل إلى أرنب / باندا / أرنب. القواعد تُطبَّق بالترتيب من الأعلى. غيّر العدد وتتبّع.","Level 4: a group of 4, 5 or 6 foxes must become rabbit / panda / rabbit. Rules apply in order from the top. Change the count and trace.")}</p><div class="row" id="ek"></div><p class="cap">${B("ترتيب الرموز في الصفوف يُقرأ من اليسار إلى اليمين كما سجّلتُه.","Token rows read left to right, as I recorded them.")}</p><table><tr><th>#</th><th>${S("النمط","Pattern")}</th><th></th><th>${S("البديل","Replacement")}</th></tr>${RULES.map((r,i)=>`<tr id="er${i}"><td>${i+1}</td><td>${toks(r[0])}</td><td>${arrow}</td><td>${toks(r[1])}</td></tr>`).join('')}</table><div class="viz" style="margin:6px 0"><div id="es"></div></div><div class="vbar"><button class="chip" id="eb">◀</button><button class="chip" id="ex">${S("طبّق القاعدة التالية ▶","Apply next rule ▶")}</button><span class="st" id="et"></span></div>`;
  function draw(){
    const h=hist();
    $('ek').innerHTML=[3,4,5,6,7].map(v=>`<button class="chip" data-n="${v}" aria-pressed="${v===nF}">${S(`${v} ثعالب`,`${v} foxes`)}</button>`).join('');
    $('ek').querySelectorAll('button').forEach(b=>b.onclick=()=>{nF=+b.dataset.n;step=0;draw()});
    RULES.forEach((_,i)=>$('er'+i).style.background=step===i+1?'rgba(37,208,145,.3)':'');
    $('es').innerHTML=`<div class="row">${toks(h[step])}</div>`;
    const want={4:'R',5:'P',6:'R'}[nF];
    $('et').textContent=step<3?ST(`الحالة بعد ${step} قاعدة`,`State after ${step} rule(s)`):(want?(h[3]===want?ST('✓ النتيجة مطابقة للهدف','✓ Result matches the target'):ST('✗ لا تطابق الهدف','✗ Does not match the target')):ST('العدد خارج الأعداد المطلوبة (4/5/6)','Count is outside the required 4/5/6'));
  }
  $('eb').onclick=()=>{step=Math.max(0,step-1);draw()};$('ex').onclick=()=>{step=Math.min(3,step+1);draw()};
  draw();
}

function vizRumors(c){
  const A=['elephant','beaver','fox','tiger','panda','rabbit','penguin','lion'];
  const DAYS=[[],[['elephant','beaver']],[['elephant','fox'],['beaver','tiger']],[['elephant','panda'],['beaver','rabbit'],['fox','penguin'],['tiger','lion']]];
  let d=1;
  c.innerHTML=`<p class="cap">${B("المستوى 2: 8 حيوانات، 4 غرف باثنين، 3 أيام. الفيل يبدأ بالقصة، والمضاعفة 1 ← 2 ← 4 ← 8.","Level 2: 8 animals, 4 rooms of two, 3 days. The elephant starts with the story, and it doubles 1 → 2 → 4 → 8.")}</p><div class="row" id="rd"></div><div class="viz" style="margin:8px 0"><div class="row" id="rr"></div></div><div class="row" id="rk"></div>`;
  function draw(){
    const inf=new Set(['elephant']);for(let i=1;i<=d;i++)DAYS[i].forEach(r=>{if(r.some(x=>inf.has(x)))r.forEach(x=>inf.add(x))});
    $('rd').innerHTML=[1,2,3].map(v=>`<button class="chip" data-d="${v}" aria-pressed="${v===d}">${S(`اليوم ${v}`,`Day ${v}`)}</button>`).join('');
    $('rd').querySelectorAll('button').forEach(b=>b.onclick=()=>{d=+b.dataset.d;draw()});
    $('rr').innerHTML=DAYS[d].map((r,i)=>`<div class="room"><span class="rl">${S(`غرفة ${i+1}`,`Room ${i+1}`)}</span>${r.map(x=>`<span class="an ${inf.has(x)?'on':'off'}">${av(x,46)}${nm(x)}</span>`).join('')}</div>`).join('');
    $('rk').innerHTML=`<span class="mut">${S(`يعرفون القصة بعد اليوم ${d}:`,`Know the story after day ${d}:`)}</span>`+A.map(x=>`<span class="an ${inf.has(x)?'on':'off'}">${av(x,36)}</span>`).join('')+`<b style="color:var(--mintsoft)">${inf.size}/8</b>`;
  }
  draw();
}

/* رموز اللعبة: رسم أصلي */
function sym(t,x,y,r=22){
  const f={star:'#ffc83d',wave:'#4dc6ff',grid:'#b9a8ff',green:'#25d091',yellow:'#ffe066',diamond:'#ff8ad4',start:'#b9a8ff',goal:'#ff8ad4'}[t]||'#fff';
  let s='';
  if(t==='star'){let p=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;p.push((x+rr*Math.cos(a)).toFixed(1)+','+(y+rr*Math.sin(a)).toFixed(1))}s=`<polygon points="${p.join(' ')}" fill="${f}"/>`}
  else if(t==='wave')s=`<path d="M${x-r} ${y} q${r/2} ${-r} ${r} 0 t${r} 0" stroke="${f}" stroke-width="7" fill="none" stroke-linecap="round" transform="translate(${-r/2} 0)"/>`;
  else if(t==='grid'||t==='start')s=`<rect x="${x-r*.8}" y="${y-r*.8}" width="${r*1.6}" height="${r*1.6}" rx="5" fill="none" stroke="${f}" stroke-width="3"/><path d="M${x-r*.27} ${y-r*.8}v${r*1.6}M${x+r*.27} ${y-r*.8}v${r*1.6}M${x-r*.8} ${y-r*.27}h${r*1.6}M${x-r*.8} ${y+r*.27}h${r*1.6}" stroke="${f}" stroke-width="2.4"/>`;
  else if(t==='green')s=`<circle cx="${x}" cy="${y}" r="${r*.8}" fill="${f}"/>`;
  else if(t==='yellow')s=`<rect x="${x-r*.75}" y="${y-r*.75}" width="${r*1.5}" height="${r*1.5}" rx="8" fill="${f}"/>`;
  else s=`<rect x="${x-r*.7}" y="${y-r*.7}" width="${r*1.4}" height="${r*1.4}" fill="${f}" transform="rotate(45 ${x} ${y})"/>`;
  return s;
}
function vizRules(c,m){
  const MK='<defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#a8ffe0"/></marker></defs>';
  if(m==='2'){
    const chain=['star','wave','yellow','grid','green','yellow','diamond'];
    let cs='';chain.forEach((t,i)=>{const x=40+i*86;cs+=`<circle cx="${x}" cy="34" r="28" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.3)"/>${sym(t,x,34,20)}`;if(i<chain.length-1)cs+=`<path d="M${x+30} 34h22" stroke="#a8ffe0" stroke-width="3" marker-end="url(#ar)"/>`});
    c.innerHTML=`<p class="cap">${B("المستوى 2 — المتسلسلة المطلوبة (بعد البداية بالشبكة):","Level 2 — the required sequence (after the starting grid symbol):")}</p><svg viewBox="0 0 640 70" width="640">${MK}${cs}</svg>`;return;
  }
  const N={S:[70,150,'start'],ST:[250,55,'star'],WV:[250,245,'wave'],G1:[70,40,'green'],GR:[430,150,'grid'],GO:[570,150,'goal']};
  const E=[['S','ST'],['S','WV'],['S','G1'],['G1','S'],['ST','GR'],['WV','GR'],['GR','ST'],['GR','WV'],['GR','GO']];
  let g=MK;
  E.forEach(([a,b])=>{const[ax,ay]=N[a],[bx,by]=N[b];const dx=bx-ax,dy=by-ay,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L;
    const sx=ax+ux*30,sy=ay+uy*30,ex=bx-ux*32,ey=by-uy*32,mx=(sx+ex)/2-uy*20,my=(sy+ey)/2+ux*20;
    g+=`<path d="M${sx} ${sy} Q${mx} ${my} ${ex} ${ey}" fill="none" stroke="#a8ffe0" stroke-width="3" marker-end="url(#ar)"/>`});
  Object.entries(N).forEach(([k,[x,y,t]])=>{g+=`<circle cx="${x}" cy="${y}" r="30" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.35)" stroke-width="2"/>${sym(t,x,y)}`});
  g+=SVT(70,200,'بداية','Start')+SVT(570,198,'الهدف','Goal');
  c.innerHTML=`<p class="cap">${B("المستوى 3 — المخطط ذو الأسهم التسعة الذي نجح (العقدة الثانية بالشبكة تفصل المسارين). الرموز والأشكال من رسم التطبيق.","Level 3 — the nine-arrow diagram that worked (the second grid node separates the two paths). Symbols and shapes are drawn by this app.")}</p><svg viewBox="0 0 640 290" width="640">${g}</svg>`;
}

function vizCater(c){
  const cat=(n,x,y,s,a,e)=>{let r='';for(let i=0;i<n;i++)r+=`<circle cx="${x+i*s*1.7}" cy="${y}" r="${s}" fill="${i===n-1?'#25d091':'#8dffd0'}" stroke="#05301f" stroke-width="2"/>`;r+=`<circle cx="${x+(n-1)*s*1.7+s*.3}" cy="${y-s*.25}" r="${s*.22}" fill="#05301f"/>`;return r+SVT(x+(n-1)*s*.85,y+s+24,a,e)};
  const CH=[['تحرّك','Move'],['اصنع يرقة أصغر','Make smaller'],['استدر','Turn'],['تحرّك','Move']];
  const chips=CH.map((t,i)=>`<g transform="translate(${20+i*150} 10)"><rect width="138" height="46" rx="12" fill="${i===1?'#5a3df0':'rgba(255,255,255,.12)'}" stroke="rgba(255,255,255,.35)"/>${SVT(69,21,`${i+1}) ${t[0]}`,`${i+1}) ${t[1]}`,{s:14,w:700})}</g>`).join('');
  c.innerHTML=`<p class="cap">${B("المستوى 2: ترتيب الأوامر الناجح. الرسم توضيحي للفكرة (الأم ثم الابنة ثم الحفيدة بنفس البرنامج)، وليس خريطة المسألة.","Level 2: the successful command order. The drawing illustrates the idea (mother, then daughter, then granddaughter running the same program); it is not the problem's map.")}</p><svg viewBox="0 0 640 225" width="640">${chips}${cat(3,40,105,13,'اليرقة الأم','Mother')}${cat(2,200,105,11,'الابنة','Daughter')}${cat(1,320,105,9,'الحفيدة (طول 1)','Granddaughter (length 1)')}<path d="M95 105h60M232 105h50" stroke="#a8ffe0" stroke-width="2.5" stroke-dasharray="5 4"/>${SVT(320,195,'كل جيل ينفّذ نفس البرنامج ثم يتوقف عند أصغر طول.','Each generation runs the same program, then stops at the smallest length.',{f:'#a8ffe0'})}</svg>`;
}

function vizFlowers(c){
  const P={a:[70,70],b:[200,70],c:[70,190],d:[200,190],e:[340,110],f:[450,60],g:[450,170],h:[90,300],i:[220,300],flag:[540,300]};
  const COMP={a:0,b:0,c:0,d:0,e:1,f:1,g:1,h:2,i:2};const CC=['#4dc6ff','#ffc83d','#ff8ad4'];
  const E=[['a','b'],['b','a'],['b','d'],['d','c'],['c','a'],['d','e'],['e','f'],['f','e'],['e','g'],['f','g'],['g','f'],['c','h'],['h','i'],['i','h']];
  const STEPS=[
    {t:['أسقط القندس عند a (الاستخدام 1 للدرون)','Drop the beaver at a (drone use 1)'],walk:[],drone:['a','a']},
    {t:['امشِ a→b→d→c→a ثم الدرون إلى e (الاستخدام 2)','Walk a→b→d→c→a, then drone to e (use 2)'],walk:['a','b','d','c','a'],drone:['a','e']},
    {t:['امشِ e→f→g→f→e ثم الدرون إلى h (الاستخدام 3)','Walk e→f→g→f→e, then drone to h (use 3)'],walk:['e','f','g','f','e'],drone:['e','h']},
    {t:['امشِ h→i→h ثم الدرون إلى العلم (الاستخدام 4)','Walk h→i→h, then drone to the flag (use 4)'],walk:['h','i','h'],drone:['h','flag']}];
  let k=0;
  c.innerHTML=`<p class="cap">${B("المستوى 2: ثلاثة مكوّنات مترابطة بقوة بألوان مختلفة، و4 استخدامات للدرون. المواضع على الرسم من تصميمي؛ الجسور والمكوّنات كما استنتجتها.","Level 2: three strongly connected components in different colors, and 4 drone uses. Positions on the drawing are my own layout; the bridges and components are as I deduced them.")}</p><div id="fl"></div><div class="vbar"><button class="chip" id="fb">◀</button><button class="chip" id="fx">${S("التالي ▶","Next ▶")}</button><span class="st" id="fs"></span></div>`;
  function draw(){
    let g='<defs><marker id="fa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#fff"/></marker><marker id="fg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#25d091"/></marker></defs>';
    const walked=new Set();for(let s=1;s<=k;s++){const w=STEPS[s].walk;for(let i=0;i<w.length-1;i++)walked.add(w[i]+w[i+1])}
    const cur=STEPS[k].walk.length?STEPS[k].walk:[];
    const act=new Set();for(let i=0;i<cur.length-1;i++)act.add(cur[i]+cur[i+1]);
    E.forEach(([p,q])=>{const[ax,ay]=P[p],[bx,by]=P[q],dx=bx-ax,dy=by-ay,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,sx=ax+ux*28,sy=ay+uy*28,ex=bx-ux*30,ey=by-uy*30,mx=(sx+ex)/2-uy*10,my=(sy+ey)/2+ux*10,on=act.has(p+q);
      g+=`<path d="M${sx} ${sy} Q${mx} ${my} ${ex} ${ey}" fill="none" stroke="${on?'#25d091':walked.has(p+q)?'rgba(37,208,145,.55)':'rgba(255,255,255,.55)'}" stroke-width="${on?6:3}" marker-end="url(#${on?'fg':'fa'})"/>`});
    Object.entries(P).forEach(([n,[x,y]])=>{if(n==='flag')g+=`<path d="M${x} ${y+22}V${y-24}L${x+32} ${y-12}L${x} ${y}" fill="#ffc83d" stroke="#fff" stroke-width="2"/>`+SVT(x,y+44,'العلم','Flag');
      else g+=`<circle cx="${x}" cy="${y}" r="26" fill="${CC[COMP[n]]}" fill-opacity=".28" stroke="${CC[COMP[n]]}" stroke-width="3"/><text x="${x}" y="${y+7}" text-anchor="middle" font-size="22" font-weight="800" fill="#fff">${n}</text>`});
    const [da,db]=STEPS[k].drone;if(da!==db){const[ax,ay]=P[da],[bx,by]=P[db];g+=`<path d="M${ax} ${ay-30} Q${(ax+bx)/2} ${Math.min(ay,by)-110} ${bx} ${by-32}" fill="none" stroke="#ff8ad4" stroke-width="3.5" stroke-dasharray="8 6" marker-end="url(#fa)"/>`+SVT((ax+bx)/2,Math.min(ay,by)-62,'درون ✈','Drone ✈',{s:14,w:700,f:'#ff8ad4'})}
    const wk=STEPS[k].walk,pos=wk.length?wk[0]:da;const[px,py]=P[pos];g+=`<g transform="translate(${px-18} ${py-46})">${av('beaver',36).replace('<svg','<svg x="0" y="0"')}</g>`;
    $('fl').innerHTML=`<svg viewBox="0 0 600 370" width="620">${g}</svg>`;$('fs').textContent=ST(STEPS[k].t[0],STEPS[k].t[1]);
  }
  $('fb').onclick=()=>{k=Math.max(0,k-1);draw()};$('fx').onclick=()=>{k=Math.min(3,k+1);draw()};draw();
}

function vizPool(c){
  const brick=(x,y)=>`<rect x="${x}" y="${y}" width="46" height="26" rx="4" fill="#d9772f" stroke="#7a3b10" stroke-width="2"/>`;
  let b='';for(let i=0;i<3;i++)b+=brick(80,100+i*28);for(let i=0;i<2;i++)b+=brick(290,128+i*28);
  c.innerHTML=`<p class="cap">${B("رسم توضيحي للحل المسجّل فقط (3 طوبات في الجهة اليسرى و2 في اليمنى). ليس خريطة المسألة الأصلية.","An illustration of the recorded solution only (3 bricks on the left side and 2 on the right). Not the original problem's map.")}</p><svg viewBox="0 0 420 235" width="420"><rect x="40" y="60" width="340" height="140" rx="14" fill="rgba(77,198,255,.22)" stroke="#4dc6ff" stroke-width="3"/>${b}${SVT(103,92,'3 طوبات','3 bricks',{s:14})}${SVT(313,120,'2 طوبتان','2 bricks',{s:14})}${SVT(210,38,'المجموع 5','Total 5',{s:15,f:'#a8ffe0'})}</svg>`;
}

function vizCams(c){
  const POLY=[[30,30],[310,30],[310,100],[110,100],[110,125],[310,125],[310,230],[30,230],[30,160],[230,160],[230,135],[30,135]];
  const E=POLY.map((p,i)=>[p,POLY[(i+1)%POLY.length]]);
  const pip=(pt,poly)=>{let ins=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const[xi,yi]=poly[i],[xj,yj]=poly[j];if((yi>pt[1])!==(yj>pt[1])&&pt[0]<(xj-xi)*(pt[1]-yi)/(yj-yi)+xi)ins=!ins}return ins};
  const hit=(o,a)=>{const dx=Math.cos(a),dy=Math.sin(a);let best=1e9;for(const[p,q]of E){const ex=q[0]-p[0],ey=q[1]-p[1],den=dx*ey-dy*ex;if(Math.abs(den)<1e-9)continue;const t=((p[0]-o[0])*ey-ex*(p[1]-o[1]))/den,u=(dy*(p[0]-o[0])-dx*(p[1]-o[1]))/den;if(t>1e-6&&u>=-1e-9&&u<=1+1e-9&&t<best)best=t}return best};
  const vis=o=>{const angs=[];POLY.forEach(([x,y])=>{const a=Math.atan2(y-o[1],x-o[0]);angs.push(a-1e-4,a,a+1e-4)});angs.sort((a,b)=>a-b);return angs.map(a=>{const t=hit(o,a);return[o[0]+Math.cos(a)*t,o[1]+Math.sin(a)*t]})};
  let cams=[[60,70],[250,60]];
  c.innerHTML=`<p class="cap">${B("جرّب بنفسك: اسحب الكاميرات داخل معرض توضيحي من تصميمي (ليس خريطة المسألة). الأرقام تحسب نسبة المساحة المغطاة بالنظر الحقيقي حول الزوايا.","Try it yourself: drag the cameras inside an illustrative gallery of my own design (not the problem's map). The numbers compute the covered share of the area using true line of sight around corners.")}</p><svg id="cv" viewBox="0 0 340 260" width="560" style="touch-action:none"></svg><div class="vbar"><button class="chip" id="ca">${S("+ كاميرا","+ Camera")}</button><button class="chip" id="cr">${S("− كاميرا","− Camera")}</button><span class="st" id="cs"></span></div>`;
  const svg=$('cv');
  function cover(polys){let tot=0,ok=0;for(let x=32;x<310;x+=5)for(let y=32;y<230;y+=5){if(!pip([x,y],POLY))continue;tot++;if(polys.some(p=>pip([x,y],p)))ok++}return tot?ok/tot:0}
  function draw(){
    const vs=cams.map(vis);let g=`<polygon points="${POLY.map(p=>p.join(',')).join(' ')}" fill="rgba(255,255,255,.07)" stroke="#fff" stroke-width="3"/>`;
    vs.forEach(v=>g+=`<polygon points="${v.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ')}" fill="rgba(255,214,102,.55)"/>`);
    g+=`<polygon points="${POLY.map(p=>p.join(',')).join(' ')}" fill="none" stroke="#fff" stroke-width="3"/>`;
    cams.forEach((p,i)=>g+=`<g class="cm" data-i="${i}" style="cursor:grab"><circle cx="${p[0]}" cy="${p[1]}" r="13" fill="#5a3df0" stroke="#fff" stroke-width="3"/><text x="${p[0]}" y="${p[1]+5}" text-anchor="middle" font-size="14" font-weight="800" fill="#fff" pointer-events="none">${i+1}</text></g>`);
    svg.innerHTML=g;const pc=Math.round(cover(vs)*100);$('cs').textContent=ST(`المغطّى ≈ ${pc}% — ${cams.length} كاميرات`+(pc>=98?' ✓ تغطية كاملة':''),`Covered ≈ ${pc}% — ${cams.length} camera(s)`+(pc>=98?' ✓ full coverage':''));
  }
  let drag=-1;
  const pt=e=>{const m=svg.getScreenCTM().inverse(),p=new DOMPoint(e.clientX,e.clientY).matrixTransform(m);return[p.x,p.y]};
  svg.addEventListener('pointerdown',e=>{const g=e.target.closest('.cm');if(g){drag=+g.dataset.i;svg.setPointerCapture(e.pointerId)}});
  svg.addEventListener('pointermove',e=>{if(drag<0)return;const p=pt(e);if(pip(p,POLY)){cams[drag]=[Math.round(p[0]),Math.round(p[1])];draw()}});
  svg.addEventListener('pointerup',()=>{drag=-1});
  $('ca').onclick=()=>{if(cams.length<4){cams.push([170,80]);draw()}};$('cr').onclick=()=>{if(cams.length>1){cams.pop();draw()}};
  draw();
}

function vizBuild(c){
  const br=(x,y,w,h,col)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="${col}" stroke="#fff" stroke-width="2"/>`;
  c.innerHTML=`<p class="cap">${B("رسم توضيحي للفكرة فقط: الطوبة العمودية داعمة، والسقف يُقلب بزر «غيّر الاتجاه».","An illustration of the idea only: the vertical brick is the support, and the roof is flipped with the “Change direction” button.")}</p><svg viewBox="0 0 440 205" width="440"><rect x="20" y="160" width="400" height="10" fill="rgba(255,255,255,.35)"/>${br(100,70,28,90,'#d9772f')}${br(60,48,108,22,'#4dc6ff')}<path d="M210 105h50M250 95l12 10-12 10" stroke="#a8ffe0" stroke-width="4" fill="none"/>${SVT(236,80,'قلب السقف','Flip the roof',{f:'#a8ffe0'})}${br(320,70,28,90,'#d9772f')}${br(280,48,108,22,'#ff8ad4')}${SVT(114,185,'قبل','Before')}${SVT(334,185,'بعد','After')}</svg>`;
}
