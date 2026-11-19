"use strict";
/* ============ التواريخ والعدّ التنازلي ============ */
const EV=[["2026-10-06","فتح التسجيل وبدء الاختبار التجريبي","Registration & pilot test open","6 أكتوبر 2026","Oct 6, 2026"],
["2026-11-22","إغلاق التسجيل","Registration closes","22 نوفمبر 2026","Nov 22, 2026"],
["2026-11-29","نهاية الاختبار التجريبي","Pilot test ends","29 نوفمبر 2026","Nov 29, 2026"],
["2026-12-05","الاختبار الرسمي · 60 دقيقة · عن بُعد","Official exam · 60 min · online","5 ديسمبر 2026 · 2:00 م","Sat, Dec 5, 2026 · 2:00 PM",1],
["2027-01-05","إعلان النتائج","Results announced","5 يناير 2027","Jan 5, 2027"],
["2027-02-05","تسليم الميداليات","Medals handover","5 فبراير 2027","Feb 5, 2027"]];
const today=new Date();today.setHours(0,0,0,0);
const left=s=>{const[y,m,d]=s.split('-').map(Number);return Math.round((new Date(y,m-1,d)-today)/864e5)};
const cd=n=>{if(n<0)return'';
  const ar=n===0?'اليوم':n===1?'غداً':n===2?'بعد يومين':`بعد ${n} ${n<=10?'أيام':'يوماً'}`;
  const en=n===0?'today':n===1?'tomorrow':`in ${n} days`;
  return `<span class="cd">${ST(ar,en)}</span>`};

/* ============ حالة المتتبّع ============ */
const KEY="bebras26_state_v2";
let st={};try{st=JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}};
const base=(p,i)=>p.lv[i]==="s"?"solved":"todo";
const cur=(p,i)=>(st[p.id]&&st[p.id][i])||base(p,i);
const nextS={todo:"solved",solved:"review",review:"todo"};
/* النقاط: 10 لكل مستوى، وحلّ المستوى الرابع يمنح الـ40 كاملة للمسألة */
const ptsP=(p,get)=>get(p,3)==="solved"?40:10*[0,1,2,3].filter(i=>get(p,i)==="solved").length;
const BADGE={s:[["موثّق ✓","Documented ✓"],'solved'],sn:[["محلول — التفاصيل غير مسجّلة","Solved — details not recorded"],'solved'],a:[["حاولتُ ولم أحلّ","Attempted, not solved"],'todo'],u:[["لم يُحلّ — لا حل موثّق","Unsolved — no documented solution"],'todo']};
const sel={},revealed=new Set();
let view="home";

/* ============ القوالب ============ */
const GAL=[["flowers","جزر الزهور","Flower islands"],["pool","تفريغ المسبح","Pool drain"],["grid","تسوية الشبكة","Grid leveling"],["cams","كاميرات المراقبة","Surveillance cameras"],["hazelnut","فرز البندق","Hazelnut sorting"],["emoji","الرموز التعبيرية","Emoji"],["cater","اليرقات","Caterpillars"],["rumors","الشائعات","Rumors"],["rules","قواعد اللعبة","Game rules"],["build","البناء بشكل مختلف","Build differently"]];
const navHTML=()=>`<button class="tab" data-v="home" aria-current="${view==='home'}">${S("الرئيسية","Home")}</button><button class="tab" data-v="tracker" aria-current="${view==='tracker'}">${S("المتتبّع","Tracker")}</button><button class="tab" data-v="patterns" aria-current="${view==='patterns'}">${S("أنماط التفكير","Thinking patterns")}</button>
<div class="lang" role="group" aria-label="Language / اللغة">${[["ar","عربي"],["en","English"],["both","AR+EN"]].map(([m,t])=>`<button data-lang="${m}" aria-pressed="${mode===m}">${t}</button>`).join('')}</div>`;

function homeHTML(){
  const tot=P.reduce((a,p)=>a+p.lv.length,0),sv=P.reduce((a,p)=>a+p.lv.filter(x=>x==='s').length,0),dc=P.reduce((a,p)=>a+p.levels.filter(l=>l.st==='s').length,0);
  const rl=left("2026-11-22"),pts=P.reduce((x,p)=>x+ptsP(p,(q,i)=>q.lv[i]==='s'?'solved':'todo'),0);
  const reg=rl>=0?`${S("التسجيل مفتوح حتى 22 نوفمبر 2026","Registration is open until Nov 22, 2026")} ${cd(rl)}`:S("انتهى موعد التسجيل (22 نوفمبر 2026).","Registration has closed (Nov 22, 2026).");
  const steps=[["سجّل في المسابقة عبر رابط التسجيل.","Register for the contest via the registration link."],["استلم رمز الطالب (<bdi>Student Code</bdi>) عبر الرسائل النصية أو البريد.","Receive your Student Code by SMS or email."],["عبّئ نموذج بيانات المدرسة.","Fill in the school data form."],["تدرّب، ثم الاختبار التجريبي، ثم الاختبار الرسمي.","Practice, then the pilot test, then the official exam."]];
  const why=[["🧩","التفكير الحاسوبي","Computational thinking","مسائل قصيرة تنمّي التفكيك والتجريد والخوارزميات.","Short tasks that build decomposition, abstraction and algorithmic thinking."],["🧠","حل المسائل","Problem solving","تتبّع، بحث منظّم، وعمل عكسي بدل التخمين.","Tracing, systematic search and working backwards instead of guessing."],["💻","دون برمجة مسبقة","No prior programming","تعتمد المسائل على المنطق لا على لغة برمجة بعينها.","Tasks rely on logic, not on any particular programming language."],["🏅","مستويات ونقاط","Levels & points","كل مسألة بأربعة مستويات متدرّجة في الصعوبة.","Each problem comes in four levels of rising difficulty."]];
  return `
<div class="hero"><div class="herow"><div>
  <span class="tag">${S("بيبراس موهبة 2026","Bebras Mawhiba 2026")}</span>
  <h1>${B("رفيق <b>بيبراس موهبة</b>","Bebras Mawhiba <b>Companion</b>")}</h1>
  <p>${B("تطبيق تعليمي لطلاب الدبلوما — بنين: تتبّع المسائل والمستويات، حلولها، وأنماط التفكير المطلوبة.","A study companion for Diploma Section – Boys: track the problems and levels, their solutions, and the thinking patterns they call for.")}</p>
</div><div class="mainlogo"><img src="logo-bebras.png" alt="Bebras Mawhiba"></div></div>
<div class="cast">${['beaver','fox','bear','panda','elephant','tiger','lion','penguin','rabbit'].map(bub).join('')}</div>
<div class="cta"><a class="btn" href="#tracker" data-go="tracker">${S("ابدأ التتبّع","Start tracking")}</a><a class="btn ghost" href="#patterns" data-go="patterns">${S("أنماط التفكير","Thinking patterns")}</a><a class="btn ghost" href="https://english.bebrasksa.org/" target="_blank" rel="noopener">${S("التدريب والاختبار التجريبي","Practice & pilot test")}</a><a class="btn ghost" href="https://bebrasksa.org/bebras-register" target="_blank" rel="noopener">${S("رابط التسجيل","Registration link")}</a></div>
<div class="callout">${reg}</div></div>
<div class="sponsor"><div class="sl"><b>${S("الراعي الرسمي","Official Sponsor")}</b><p>${B("موهبة — المؤسسة المنظِّمة للمسابقة.","Mawhiba — the organization running the contest.")}</p></div><img src="logo-mawhiba.png" alt="Mawhiba"></div>

<h2>${S("ما هي بيبراس موهبة؟","What is Bebras Mawhiba?")}</h2>
<div class="card"><p>${B("مسابقة في التفكير الحاسوبي وحل المسائل لطلاب المدارس، تنظّمها موهبة، وتُجرى عن بُعد عبر الإنترنت. لا تتطلّب معرفة مسبقة بلغة برمجة، وإنما قدرة على التحليل والتتبّع والبحث المنظّم.","A computational-thinking and problem-solving contest for school students, organized by Mawhiba and held online. It needs no prior programming knowledge, only the ability to analyze, trace and search systematically.")}</p>
<p class="mut">${B("الاختبار الرسمي: السبت 5 ديسمبر 2026، الساعة 2:00 م، مدته 60 دقيقة.","Official exam: Saturday, Dec 5, 2026, 2:00 PM, 60 minutes.")}</p></div>
<h2>${S("نظام النقاط","Scoring")}</h2>
<div class="grid g4"><div class="card"><div class="stat">400</div><p class="mut">${B("مجموع نقاط المسابقة (10 مسائل)","total contest points (10 problems)")}</p></div><div class="card"><div class="stat">40</div><p class="mut">${B("نقطة لكل مسألة","points per problem")}</p></div><div class="card"><div class="stat">10</div><p class="mut">${B("نقاط لكل مستوى (4 مستويات)","points per level (4 levels)")}</p></div><div class="card"><div class="stat">★ 4</div><p class="mut">${B("حلّ المستوى الرابع يمنح الـ40 كاملة للمسألة دون الحاجة لحلّ المستويات قبله.","Solving level 4 earns the full 40 for the problem, without having to solve the earlier levels.")}</p></div></div>
<div class="callout">${B("ملاحظة: إن كنتَ واثقاً من حلّ المستوى الرابع فابدأ به مباشرة؛ فالزمن محدود (60 دقيقة).","Note: if you are confident you can solve level 4, start with it directly; time is limited (60 minutes).")}</div>

<h2>${S("مسائل 2026 على المنصة","The 2026 problems on the platform")}</h2>
<p class="mut">${B("هذه المسائل العشر هي موضوع هذا التطبيق: تحليلها، أنماط تفكيرها، وطرق حلّها. اضغط أي مسألة لفتحها.","These ten problems are what this app analyzes: their thinking patterns and solution methods. Tap any problem to open it.")}</p>
<div class="gal">${GAL.map(([id,ar,en])=>{const p=P.find(x=>x.id===id),n=p.lv.filter((_,i)=>cur(p,i)==='solved').length;return `<a class="gcard" href="#tracker" data-open="${id}"><b>${B(ar,en)}</b><img src="th-${id}.png" alt="${en}"><span class="stars" aria-label="${n}/4">${'★'.repeat(n)}<i>${'★'.repeat(4-n)}</i></span></a>`}).join('')}</div>

<h2>${S("المواعيد المهمة","Key dates")}</h2>
<div class="tl">${EV.map(e=>`<div class="ev ${e[5]?'hot':''}"><div><b>${B(e[1],e[2])}</b></div><div class="d">${B(e[3],e[4])}${cd(left(e[0]))}</div></div>`).join('')}</div>

<h2>${S("كيف تشارك؟","How to join")}</h2>
<div class="grid g2">${steps.map((s,i)=>`<div class="card step"><span class="num">${i+1}</span><div>${B(s)}</div></div>`).join('')}</div>

<h2>${S("لماذا بيبراس؟","Why Bebras?")}</h2>
<div class="grid g4">${why.map(w=>`<div class="card"><div class="ico">${w[0]}</div><h3>${B(w[1],w[2])}</h3><p class="mut">${B(w[3],w[4])}</p></div>`).join('')}</div>

<h2>${S("روابط مهمة","Important links")}</h2>
<div class="grid g2 linkc"><div class="card"><h3>${S("التدريب والاختبار التجريبي","Practice & pilot test")}</h3><p><a href="https://english.bebrasksa.org/" target="_blank" rel="noopener">english.bebrasksa.org</a></p><p class="mut">${B("رابط التدريب على نماذج السنوات السابقة، وهو أيضاً رابط إجراء الاختبار التجريبي لهذا العام: تسجيل الدخول بكود الطالب الرسمي يمنح الطالب الوصول إلى نموذج مسائل 2026 لإجراء الاختبار التجريبي.","The link for practicing on past years' papers, and also the link for taking this year's pilot test: logging in with the official Student Code gives the student access to the 2026 problem set for the pilot test.")}</p></div><div class="card"><h3>${S("التسجيل","Registration")}</h3><p><a href="https://bebrasksa.org/bebras-register" target="_blank" rel="noopener">bebrasksa.org/bebras-register</a></p></div></div>`;
}

function trackerShell(){return `
<h2>${S("متتبّع المسائل والمستويات","Problems & levels tracker")}</h2>
<div class="card"><div id="pTxt" style="font-weight:800;font-size:19px"></div><div class="mut" id="pPts"></div><div class="bar" style="margin-top:8px"><i id="pBar"></i></div>
<div class="legend"><span style="--c:var(--mint)">${S("محلول","Solved")}</span><span style="--c:var(--gold)">${S("للمراجعة","Review")}</span><span style="--c:var(--coral)">${S("لم يُحلّ","Open")}</span><span>${S("اضغط رقم المستوى لتبديل حالته","Tap a level number to cycle its status")}</span></div></div>
<div class="tools"><input id="q" type="search" placeholder="${ST("ابحث في المسائل…","Search problems…")}"><select id="f"><option value="all">${ST("الكل","All")}</option><option value="done">${ST("المكتملة","Completed")}</option><option value="open">${ST("غير المكتملة","Not yet complete")}</option></select><button class="btn ghost sm" id="reset">${S("إعادة ضبط الحالات","Reset statuses")}</button></div>
<div id="list"></div>`}

const NEON=["#00f5d4","#ff2bd6","#ffe600","#39ff14","#00b7ff","#ff7a00","#b967ff","#ff3860"];
const patternsHTML=()=>`<h2>${S("أنماط التفكير","Thinking patterns")}</h2><p class="mut">${B("الأنماط التي تكرّرت في حلول المسائل المسجّلة.","The patterns that recurred across the recorded solutions.")}</p><div class="grid g2">${PAT.map(([a,b,e,f],i)=>`<div class="card neon" style="--n:${NEON[i%8]}"><h3>${B(a,e)}</h3><p class="mut">${B(b,f)}</p></div>`).join('')}</div>`;

const footHTML=()=>`<div class="flogos"><img src="logo-forsan.png" alt="Dar Al-Forsan"><img src="logo-diploma.png" alt="Diploma Section"><img src="logo-mawhiba.png" alt="Mawhiba" class="wide"><img src="logo-bebras.png" alt="Bebras Mawhiba 2026"></div><b>${S("مدارس دار الفرسان · قسم الدبلوما — بنين","Dar Al-Forsan Schools · Diploma Section – Boys")}</b><small>${S("تنظيم المسابقة: موهبة","Contest organizer: Mawhiba")}</small>`;

/* ============ المتتبّع ============ */
function renderProg(){let s=0,t=0,r=0;P.forEach(p=>p.lv.forEach((_,i)=>{const c=cur(p,i);t++;if(c==="solved")s++;if(c==="review")r++}));
  const a=`${s} من ${t} مستوى محلول`+(r?` · ${r} للمراجعة`:""),e=`${s} of ${t} levels solved`+(r?` · ${r} to review`:"");
  $('pTxt').textContent=ST(a,e);const pt=P.reduce((x,p)=>x+ptsP(p,cur),0);$('pPts').textContent=ST(`${pt} من 400 نقطة (10 لكل مستوى؛ حلّ المستوى الرابع = 40 كاملة)`,`${pt} of 400 points (10 per level; solving level 4 = the full 40)`);$('pBar').style.width=(s/t*100)+"%"}
function mount(el,fn){if(el&&!el.dataset.on){el.dataset.on=1;try{fn(el)}catch(e){el.textContent=ST('تعذّر عرض المحاكي','Could not render the simulator')}}}
const revLabel=on=>on?S("أخفِ","Hide"):S("اكشف نمط التفكير والحل","Reveal thinking pattern & solution");
const planBlock=l=>l.plan?`<h4>${S("استراتيجية مقترحة لهذا المستوى","Suggested strategy for this level")}</h4><ul><li>${B(l.plan)}</li></ul><div class="mut">${B("اقتراح مني حسب نوع المسألة وتدرّج المستويات، وليس من حلولي المسجّلة.","My suggestion based on the problem type and level progression, not from my recorded solutions.")}</div>`:'';
function panel(p,i){
  const l=p.levels[i],b=BADGE[l.st];let h=`<div class="lvhead"><b>${ORDN(i)}</b><span class="badge ${b[1]}">${S(b[0])}</span></div>`;
  if(l.st==='u'||l.st==='a'){
    const msg=l.st==='a'?["حاولتُ هذا المستوى ولم أصل إلى حل. لا أملك حلاً موثّقاً له، ولن أقدّم تخميناً. أنماط التفكير العامة للمسألة أدناه قد تفيدك في المحاولة.","I attempted this level without reaching a solution. I have no documented solution for it and won't offer a guess. The problem's general thinking patterns below may help your attempt."]:["لا أملك حلاً موثّقاً لهذا المستوى، ولن أقدّم تخميناً. أنماط التفكير العامة للمسألة أدناه قد تفيدك في المحاولة.","I have no documented solution for this level and won't offer a guess. The problem's general thinking patterns below may help your attempt."];
    return h+`<div class="note">${B(msg)}</div>${l.plan?planBlock(l):`<h4>${S("أنماط التفكير العامة للمسألة","General thinking patterns for the problem")}</h4><ul>${p.think.map(x=>`<li>${B(x)}</li>`).join('')}</ul>`}`;
  }
  const on=revealed.has(p.id+':'+i);
  h+=`${l.q?`<h4>${S("سؤال توجيهي — فكّر قبل أن تكشف","Guiding question — think before you reveal")}</h4><div class="gq">${B(l.q)}</div>`:''}<button class="btn sm" style="margin-top:10px" data-lrev="${p.id}:${i}">${revLabel(on)}</button><div class="reveal" id="lr-${p.id}-${i}" ${on?'':'hidden'}>`;
  if(l.skill)h+=`<h4>${S("نمط التفكير في هذا المستوى","Thinking pattern for this level")}</h4><ul>${l.skill.map(x=>`<li>${B(x)}</li>`).join('')}</ul>`;
  else h+=l.plan?planBlock(l):`<h4>${S("أنماط التفكير العامة للمسألة","General thinking patterns for the problem")}</h4><div class="mut">${B("لم أسجّل نمطاً خاصاً بهذا المستوى.","I did not record a level-specific pattern.")}</div><ul>${p.think.map(x=>`<li>${B(x)}</li>`).join('')}</ul>`;
  return h+`<h4>${S("الحل","Solution")}</h4>${B(l.sol)}${l.viz?`<p class="mut">${B("المحاكاة التفاعلية لهذا المستوى في قسم «محاكاة المسألة» أعلاه.","The interactive simulation for this level is in the “Problem simulation” section above.")}</p>`:''}</div>`;
}
function drawBody(p,d){
  const i=sel[p.id]??0;
  d.querySelector('.ltabs').innerHTML=p.levels.map((l,k)=>`<button class="ltab" data-lt="${p.id}:${k}" aria-selected="${k===i}" data-s="${cur(p,k)}">${ORDN(k)}</button>`).join('');
  d.querySelector('.lpanel').innerHTML=panel(p,i);
  
}
const hay=p=>(p.n.join(' ')+' '+p.tags+' '+p.ask.join(' ')+' '+p.levels.map(l=>(l.q||[]).join(' ')+' '+(l.skill||[]).flat().join(' ')).join(' ')).toLowerCase();
function render(){
  const q=$('q').value.trim().toLowerCase(),f=$('f').value,box=$('list');box.innerHTML="";
  P.filter(p=>{const done=p.lv.every((_,i)=>cur(p,i)==="solved");if(f==="done"&&!done)return false;if(f==="open"&&done)return false;if(q&&!hay(p).includes(q))return false;return true})
  .forEach(p=>{
    const d=document.createElement("details");d.className="card prob";d.id="p-"+p.id;
    const lv=p.lv.map((_,i)=>`<button class="lvb" data-p="${p.id}" data-i="${i}" data-s="${cur(p,i)}" title="${ORDT(i)}">${i+1}</button>`).join("");
    const ch=p.chars.length?`<span class="chars">${p.chars.map(bub).join('')}</span>`:'';
    const cm=p.common?(p.commonOpen?`<h4>${B(p.commonCap)}</h4><div class="viz" id="cm-${p.id}"></div>`:`<details class="sub"><summary>${B(p.commonCap)}</summary><div class="viz" id="cm-${p.id}"></div></details>`):'';
    const sims=p.levels.map((l,i)=>l.viz?[l,i]:null).filter(Boolean);
    const sm=sims.length?`<h4>${S("محاكاة المسألة","Problem simulation")}</h4>`+sims.map(([l,i])=>`<details class="sub simd" open><summary>${S(`محاكاة — ${['المستوى الأول','المستوى الثاني','المستوى الثالث','المستوى الرابع'][i]}`,`Simulation — Level ${i+1}`)}</summary><div class="viz" id="sv-${p.id}-${i}"></div></details>`).join(''):'';
    d.innerHTML=`<summary>${ch}<span class="ttl">${B(p.n)}</span><span class="cnt">${p.lv.filter((_,i)=>cur(p,i)==="solved").length}/4</span><span class="lv">${lv}</span></summary>
    <div class="body"><h4>${S("المطلوب","The task")}</h4><p>${B(p.ask)}</p>${cm}${sm}
      <h4>${S("المستويات","Levels")}</h4><div class="ltabs"></div><div class="lpanel"></div>
      <details class="sub gen"><summary>${S("ملخص المسألة: أنماط التفكير العامة والفخاخ","Problem summary: general thinking patterns & traps")}</summary><h4>${S("أنماط التفكير العامة","General thinking patterns")}</h4><ul>${p.think.map(x=>`<li>${B(x)}</li>`).join('')}</ul>${p.traps.length?`<h4>${S("فخاخ شائعة","Common traps")}</h4><ul>${p.traps.map(x=>`<li>${B(x)}</li>`).join('')}</ul>`:''}<div class="gq" style="margin-top:8px">${B(p.gq)}</div></details>
    </div>`;
    d.addEventListener('toggle',()=>{if(d.open){if(p.common&&p.commonOpen)mount($('cm-'+p.id),p.common);p.levels.forEach((l,i)=>{if(l.viz)mount($(`sv-${p.id}-${i}`),l.viz)})}});
    const sub=d.querySelector('details.sub:not(.gen):not(.simd)');if(sub)sub.addEventListener('toggle',()=>{if(sub.open)mount($('cm-'+p.id),p.common)});
    box.appendChild(d);drawBody(p,d);if(p.common&&p.commonOpen)mount($('cm-'+p.id),p.common);p.levels.forEach((l,i)=>{if(l.viz)mount($(`sv-${p.id}-${i}`),l.viz)});
  });
  if(!box.children.length)box.innerHTML=`<p class="mut">${S("لا نتائج.","No results.")}</p>`;
  renderProg();
}


/* ============ شريط الأخبار: مواعيد التسجيل + أخبار + نصائح ============ */
function tickItems(){
  const it=[];const rl=left("2026-11-22"),pl=left("2026-11-29"),el=left("2026-12-05");
  if(rl>=0)it.push(["r",["التسجيل مفتوح حتى 22 نوفمبر 2026"+(rl<=7?` (متبقٍّ ${rl} يوم)`:""),"Registration is open until Nov 22, 2026"+(rl<=7?` (${rl} day(s) left)`:"")]]);
  if(pl>=0)it.push(["r",["الاختبار التجريبي حتى 29 نوفمبر 2026","The pilot test runs until Nov 29, 2026"]]);
  if(el>=0)it.push(["n",["الاختبار الرسمي: السبت 5 ديسمبر 2026 · 2:00 م · 60 دقيقة · عن بُعد","Official exam: Sat, Dec 5, 2026 · 2:00 PM · 60 min · online"]]);
  it.push(["n",["إعلان النتائج 5 يناير 2027 · تسليم الميداليات 5 فبراير 2027","Results Jan 5, 2027 · Medals Feb 5, 2027"]]);
  it.push(["n",["التدريب على نماذج السنوات السابقة وإجراء الاختبار التجريبي: english.bebrasksa.org (بكود الطالب الرسمي)","Practice on past papers and take the pilot test: english.bebrasksa.org (with your official Student Code)"]]);
  it.push(["n",["400 نقطة للمسابقة · 40 لكل مسألة · حلّ المستوى الرابع يمنح الـ40 كاملة","400 points in total · 40 per problem · solving level 4 earns the full 40"]]);
  [["تتبّع الحل بجدول على الورق قبل أن تُدخل إجابتك.","Trace the solution in a table on paper before you enter your answer."],
   ["الإجابات المُدخلة على المنصة تُحتسب، فتحقق منها ذهنياً أولاً.","Answers entered on the platform are counted, so verify them mentally first."],
   ["إن كنتَ واثقاً من المستوى الرابع فابدأ به؛ الزمن 60 دقيقة فقط.","If you're confident about level 4, start with it; you only have 60 minutes."],
   ["اعمل عكسياً من الهدف: ما الذي ينتج هذا الشكل؟","Work backwards from the target: what produces this result?"],
   ["في مسائل الشبكة والقيود ابدأ بأول خلية أو أكثر قيد.","In grid and constraint problems, start with the first cell or the tightest constraint."],
   ["ارسم المسألة (عقد وأسهم) قبل أن تحاول حلّها.","Draw the problem (nodes and arrows) before trying to solve it."]
  ].forEach(x=>it.push(["t",x]));
  return it;
}
const TKL={r:["التسجيل","Registration"],n:["أخبار","News"],t:["نصيحة","Tip"]};
function tickerHTML(){
  const grp=hid=>`<span class="grp"${hid?' aria-hidden="true"':''}>${tickItems().map(([k,[a,e]])=>`<span class="it" dir="${mode==='en'?'ltr':'rtl'}"><span class="lb ${k==='r'?'':k}">${ST(TKL[k][0],TKL[k][1])}</span><span>${mode==='en'?e:mode==='ar'?a:`${a} <span class="eni" style="margin:0 .3em">· ${e}</span>`}</span></span>`).join('')}</span>`;
  return `<button class="tkp" id="tkp" aria-pressed="false" aria-label="${ST('إيقاف/تشغيل الشريط','Pause/play the ticker')}" title="${ST('إيقاف/تشغيل','Pause/play')}">❚❚</button><div class="vp" tabindex="0"><div class="trk" id="trk">${grp(false)}${grp(true)}</div></div>`;
}
/* التحريك: scrollLeft بمؤقّت (setInterval) — لا يعتمد على CSS animation ولا requestAnimationFrame،
   ويتيح السحب اليدوي أيضاً؛ وإن لم يتحرك لأي سبب فنعود إلى transform. */
const TK_SPEED=70;let tkTimer=0,tkPos=0,tkLastT=0,tkIdleUntil=0,tkHover=false,tkMode="scroll",tkChecked=0,tkRaf=0;
const tkPaused=()=>tkHover||$('tick').classList.contains('paused')||Date.now()<tkIdleUntil||document.hidden;
function tkStep(){
  const vp=document.querySelector('#tick .vp'),t=$('trk');if(!vp||!t)return;
  const now=performance.now(),dt=Math.min((now-(tkLastT||now))/1000,.2);tkLastT=now;
  const w=t.scrollWidth/2;if(w<=0)return;
  if(tkPaused()){tkPos=vp.scrollLeft;return}
  tkPos+=dt*TK_SPEED;if(tkPos>=w)tkPos-=w;
  if(tkMode==="scroll"){vp.scrollLeft=Math.round(tkPos)}
  else{vp.scrollLeft=0;t.style.webkitTransform=t.style.transform=`translate3d(${-tkPos}px,0,0)`}
}
function setTick(){
  const vp=document.querySelector('#tick .vp');if(!vp)return;
  tkPos=0;tkMode="scroll";tkChecked=0;
  vp.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')tkHover=true});
  vp.addEventListener('pointerleave',()=>{tkHover=false});
  const hold=()=>{tkIdleUntil=Date.now()+2500};
  ['touchstart','touchmove','wheel','pointerdown'].forEach(ev=>vp.addEventListener(ev,hold,{passive:true}));
  vp.addEventListener('scroll',()=>{ // لفّ سلس عند السحب اليدوي
    const w=$('trk').scrollWidth/2;if(!w)return;
    if(Date.now()<tkIdleUntil){if(vp.scrollLeft>=w)vp.scrollLeft-=w;else if(vp.scrollLeft<=0)vp.scrollLeft+=w}
  },{passive:true});
  if(!tkTimer)tkTimer=setInterval(tkStep,33);
  // تحقّق: إن لم يتحرك الشريط خلال 1.5 ثانية بدّل إلى transform
  setTimeout(()=>{if(tkPaused())return;const s=vp.scrollLeft;setTimeout(()=>{if(!tkPaused()&&Math.abs(vp.scrollLeft-s)<1&&tkMode==="scroll"){tkMode="transform"}},1500)},800);
}

/* ============ بناء الصفحة وتبديل اللغة ============ */
function build(){
  const qv=$('q')?$('q').value:'',fv=$('f')?$('f').value:'all';
  const open=[...document.querySelectorAll('details.prob[open]')].map(d=>d.id),subs=[...document.querySelectorAll('details.prob details.sub:not(.gen):not(.simd)[open]')].map(d=>d.closest('details.prob').id);
  const de=document.documentElement;de.lang=mode==='en'?'en':'ar';de.dir=mode==='en'?'ltr':'rtl';de.dataset.mode=mode;
  document.title=mode==='en'?'Bebras Mawhiba 2026 Companion':mode==='ar'?'رفيق بيبراس موهبة 2026':'رفيق بيبراس موهبة 2026 · Bebras Mawhiba 2026 Companion';
  $('nav').innerHTML=navHTML();$('v-home').innerHTML=homeHTML();$('v-tracker').innerHTML=trackerShell();$('v-patterns').innerHTML=patternsHTML();$('foot').innerHTML=footHTML();$('tick').innerHTML=tickerHTML();setTick();
  $('q').value=qv;$('f').value=fv;render();
  open.forEach(id=>{const d=$(id);if(d)d.open=true});
  subs.forEach(id=>{const d=$(id);if(d){const s=d.querySelector('details.sub:not(.gen):not(.simd)');if(s)s.open=true}});
  show(view,true);
}
function show(v,keep){if(!["home","tracker","patterns"].includes(v))v="home";view=v;
  ["home","tracker","patterns"].forEach(k=>$("v-"+k).hidden=k!==v);
  document.querySelectorAll(".tab").forEach(t=>t.setAttribute("aria-current",t.dataset.v===v));
  try{if(location.hash!=="#"+v)history.replaceState(null,"","#"+v)}catch(e){}
  if(!keep)window.scrollTo(0,0)}
function setMode(m){mode=m;try{localStorage.setItem(LKEY,m)}catch(e){}const y=window.scrollY;build();window.scrollTo(0,y)}

document.addEventListener("click",e=>{
  const tk=e.target.closest("#tkp");if(tk){const p=$("tick").classList.toggle("paused");tk.setAttribute("aria-pressed",p);tk.textContent=p?"▶":"❚❚";return}
  const lg=e.target.closest("[data-lang]");if(lg){setMode(lg.dataset.lang);return}
  const b=e.target.closest(".lvb");
  if(b){e.preventDefault();e.stopPropagation();const p=P.find(x=>x.id===b.dataset.p),i=+b.dataset.i;st[p.id]=st[p.id]||{};st[p.id][i]=nextS[cur(p,i)];save();b.dataset.s=st[p.id][i];const d=b.closest("details");d.querySelector(".cnt").textContent=p.lv.filter((_,k)=>cur(p,k)==="solved").length+"/4";const t=d.querySelector(`.ltab[data-lt="${p.id}:${i}"]`);if(t)t.dataset.s=st[p.id][i];renderProg();return}
  const t=e.target.closest(".ltab");
  if(t){const[id,k]=t.dataset.lt.split(':'),p=P.find(x=>x.id===id);sel[id]=+k;drawBody(p,t.closest('details.prob'));return}
  const r=e.target.closest("[data-lrev]");
  if(r){const[id,k]=r.dataset.lrev.split(':'),p=P.find(x=>x.id===id),el=$(`lr-${id}-${k}`),key=id+':'+k;el.hidden=!el.hidden;if(el.hidden)revealed.delete(key);else revealed.add(key);r.innerHTML=revLabel(!el.hidden);return}
  const og=e.target.closest("[data-open]");if(og){e.preventDefault();show('tracker');const d=$('p-'+og.dataset.open);if(d){d.open=true;d.scrollIntoView()}return}
  const g=e.target.closest("[data-go]");if(g){e.preventDefault();show(g.dataset.go);return}
  const tb=e.target.closest(".tab");if(tb)show(tb.dataset.v);
  if(e.target.closest("#reset")){st={};save();render()}
});
document.addEventListener("input",e=>{if(e.target.id==="q")render()});
document.addEventListener("change",e=>{if(e.target.id==="f")render()});
window.addEventListener("hashchange",()=>show(location.hash.slice(1)));
view=["home","tracker","patterns"].includes(location.hash.slice(1))?location.hash.slice(1):"home";
build();
