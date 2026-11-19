"use strict";
/* ============ اللغة: عربي / English / معاً ============ */
const LKEY="bebras26_lang";
let mode="ar";try{const m=localStorage.getItem(LKEY);if(m==="ar"||m==="en"||m==="both")mode=m}catch(e){}
const $=id=>document.getElementById(id);
const _tag=a=>/^\s*</.test(a)&&!/^\s*<(b|i|span|em|strong)\b/.test(a)?"div":"span";
/* كتلة: B(ar,en) أو B([ar,en]) — في وضع «معاً» يُضاف السطر الإنجليزي أسفل العربي */
const B=(a,e)=>{if(Array.isArray(a))[a,e]=a;if(mode==="ar")return a;if(mode==="en")return e;const t=_tag(a);return `${a}<${t} class="enb">${e}</${t}>`};
/* تسمية قصيرة داخل HTML */
const S=(a,e)=>{if(Array.isArray(a))[a,e]=a;return mode==="ar"?a:mode==="en"?e:`${a}<span class="eni">${e}</span>`};
/* نص صرف (textContent / title / aria) */
const ST=(a,e)=>{if(Array.isArray(a))[a,e]=a;return mode==="ar"?a:mode==="en"?e:`${a} · ${e}`};
/* نص داخل SVG: في وضع «معاً» سطران */
const SVT=(x,y,a,e,o={})=>{const sz=o.s||13,f=o.f||"#fff",w=o.w?` font-weight="${o.w}"`:"",an=o.a||"middle";
  const t=(yy,txt,s,op,l)=>`<text x="${x}" y="${yy}" text-anchor="${an}" font-size="${s}"${w} fill="${f}"${op?` fill-opacity="${op}"`:""}${l?' direction="ltr" style="unicode-bidi:isolate"':""}>${txt}</text>`;
  return mode==="ar"?t(y,a,sz):mode==="en"?t(y,e,sz,0,1):t(y,a,sz)+t(y+sz+2,e,sz-2,.75,1)};
const ORDN=n=>S(`المستوى ${['الأول','الثاني','الثالث','الرابع'][n]}`,`Level ${n+1}`);
const ORDT=n=>ST(`المستوى ${['الأول','الثاني','الثالث','الرابع'][n]}`,`Level ${n+1}`);

/* ============ شخصيات أصلية (SVG بسيط من تصميم التطبيق) ============ */
const NM={beaver:["القندس","Beaver"],fox:["الثعلب","Fox"],bear:["الدب","Bear"],panda:["الباندا","Panda"],elephant:["الفيل","Elephant"],tiger:["النمر","Tiger"],lion:["الأسد","Lion"],penguin:["البطريق","Penguin"],rabbit:["الأرنب","Rabbit"]};
const nm=k=>S(NM[k][0],NM[k][1]),nmT=k=>ST(NM[k][0],NM[k][1]);
const eyes=(y=48,dx=15,r=4)=>`<circle cx="${50-dx}" cy="${y}" r="${r}" fill="#1d1208"/><circle cx="${50+dx}" cy="${y}" r="${r}" fill="#1d1208"/><circle cx="${50-dx+1.4}" cy="${y-1.5}" r="1.4" fill="#fff"/><circle cx="${50+dx+1.4}" cy="${y-1.5}" r="1.4" fill="#fff"/>`;
const AV={
beaver:`<circle cx="24" cy="30" r="10" fill="#6f3f1b"/><circle cx="76" cy="30" r="10" fill="#6f3f1b"/><circle cx="50" cy="54" r="36" fill="#a8652b"/><ellipse cx="50" cy="68" rx="19" ry="14" fill="#f1cfa6"/><ellipse cx="50" cy="60" rx="7" ry="5" fill="#2a1a10"/><rect x="43.5" y="68" width="6.5" height="11" rx="2" fill="#fff" stroke="#c9b08a"/><rect x="50" y="68" width="6.5" height="11" rx="2" fill="#fff" stroke="#c9b08a"/>${eyes(46,14)}`,
fox:`<polygon points="14,8 44,36 10,52" fill="#e8741f"/><polygon points="86,8 56,36 90,52" fill="#e8741f"/><polygon points="20,22 37,36 18,44" fill="#4a2208"/><polygon points="80,22 63,36 82,44" fill="#4a2208"/><circle cx="50" cy="54" r="36" fill="#f08a2c"/><polygon points="50,92 17,57 34,50 50,62 66,50 83,57" fill="#fff"/><ellipse cx="50" cy="79" rx="5.5" ry="4" fill="#25140a"/>${eyes(47,15)}`,
bear:`<circle cx="22" cy="26" r="12" fill="#6e4528"/><circle cx="78" cy="26" r="12" fill="#6e4528"/><circle cx="50" cy="54" r="37" fill="#8d5a36"/><ellipse cx="50" cy="68" rx="17" ry="13" fill="#e7c49b"/><ellipse cx="50" cy="62" rx="7" ry="5" fill="#25140a"/><path d="M50 67v6" stroke="#25140a" stroke-width="2" fill="none"/>${eyes(46,15)}`,
panda:`<circle cx="21" cy="25" r="13" fill="#1d1d26"/><circle cx="79" cy="25" r="13" fill="#1d1d26"/><circle cx="50" cy="54" r="37" fill="#fbfbff" stroke="#d7d4ee" stroke-width="1.5"/><ellipse cx="34" cy="50" rx="9" ry="12" fill="#1d1d26" transform="rotate(22 34 50)"/><ellipse cx="66" cy="50" rx="9" ry="12" fill="#1d1d26" transform="rotate(-22 66 50)"/><circle cx="35" cy="49" r="3.4" fill="#fff"/><circle cx="65" cy="49" r="3.4" fill="#fff"/><ellipse cx="50" cy="67" rx="6.5" ry="4.5" fill="#1d1d26"/><path d="M50 71v5M44 77q6 4 12 0" stroke="#1d1d26" stroke-width="2" fill="none"/>`,
elephant:`<circle cx="14" cy="50" r="19" fill="#8793a8"/><circle cx="86" cy="50" r="19" fill="#8793a8"/><circle cx="14" cy="50" r="11" fill="#c5a5b7"/><circle cx="86" cy="50" r="11" fill="#c5a5b7"/><circle cx="50" cy="50" r="33" fill="#a2adc1"/><path d="M50 58Q49 92 60 90" stroke="#8793a8" stroke-width="14" fill="none" stroke-linecap="round"/>${eyes(44,14)}`,
tiger:`<circle cx="22" cy="26" r="11" fill="#e89516"/><circle cx="78" cy="26" r="11" fill="#e89516"/><circle cx="50" cy="54" r="37" fill="#f4a621"/><path d="M50 20v14M40 22l4 12M60 22l-4 12M16 52l14 3M16 64l14-3M84 52l-14 3M84 64l-14-3" stroke="#2a1608" stroke-width="4" stroke-linecap="round" fill="none"/><ellipse cx="50" cy="70" rx="18" ry="13" fill="#fff6e6"/><ellipse cx="50" cy="62" rx="6" ry="4" fill="#d9637a"/><path d="M50 66v6M44 74q6 4 12 0" stroke="#2a1608" stroke-width="2" fill="none"/>${eyes(46,15)}`,
lion:`<circle cx="50" cy="52" r="46" fill="#bd6a14"/><circle cx="22" cy="24" r="9" fill="#d9871f"/><circle cx="78" cy="24" r="9" fill="#d9871f"/><circle cx="50" cy="54" r="31" fill="#f5c46c"/><ellipse cx="50" cy="68" rx="14" ry="10" fill="#fff0cf"/><ellipse cx="50" cy="61" rx="6" ry="4.5" fill="#3a2008"/><path d="M50 65v5M44 72q6 4 12 0" stroke="#3a2008" stroke-width="2" fill="none"/>${eyes(48,12)}`,
penguin:`<circle cx="50" cy="52" r="38" fill="#1f2a55"/><ellipse cx="50" cy="62" rx="24" ry="28" fill="#fff"/><polygon points="43,52 57,52 50,64" fill="#ff9a1f"/>${eyes(42,13,4.2)}<ellipse cx="22" cy="68" rx="6" ry="14" fill="#1f2a55" transform="rotate(14 22 68)"/><ellipse cx="78" cy="68" rx="6" ry="14" fill="#1f2a55" transform="rotate(-14 78 68)"/>`,
rabbit:`<ellipse cx="35" cy="22" rx="9" ry="24" fill="#f4eefa"/><ellipse cx="65" cy="22" rx="9" ry="24" fill="#f4eefa"/><ellipse cx="35" cy="24" rx="4.5" ry="17" fill="#f2a9c4"/><ellipse cx="65" cy="24" rx="4.5" ry="17" fill="#f2a9c4"/><circle cx="50" cy="60" r="33" fill="#faf6ff"/><ellipse cx="50" cy="66" rx="5" ry="3.5" fill="#e0709a"/><path d="M50 69v5M43 75q7 5 14 0" stroke="#7a5b8a" stroke-width="2" fill="none"/>${eyes(56,13)}<circle cx="31" cy="68" r="5" fill="#f7c8da" opacity=".7"/><circle cx="69" cy="68" r="5" fill="#f7c8da" opacity=".7"/>`
};
const av=(k,s=48)=>`<svg viewBox="0 0 100 100" width="${s}" height="${s}" role="img" aria-label="${nmT(k)}">${AV[k]}</svg>`;
const bub=k=>`<span class="bubble" title="${nmT(k)}">${av(k,56)}</span>`;
const SVGNS='<svg xmlns="http://www.w3.org/2000/svg" ';
