/* Motor de ilustraciones: figura articulada con cinemática inversa.
   Cada ejercicio = 2 poses (A y B). Se interpolan y se recalculan codos y rodillas. */
const FIG = (() => {
  const LEN = {torso:40, uArm:22, fArm:21, thigh:27, shin:27, head:12};
  const F = 124; // suelo
  const rad = d => d*Math.PI/180;
  const dir = (a,l) => [Math.cos(rad(a))*l, Math.sin(rad(a))*l];
  const add = (p,v) => [p[0]+v[0], p[1]+v[1]];
  // IK de 2 huesos. s = +1/-1 elige el lado del codo/rodilla
  function ik(root, target, l1, l2, s){
    let dx=target[0]-root[0], dy=target[1]-root[1], d=Math.hypot(dx,dy)||0.001;
    const max=l1+l2-0.01; if(d>max){dx*=max/d; dy*=max/d; d=max;}
    const a=(l1*l1-l2*l2+d*d)/(2*d), h=Math.sqrt(Math.max(0,l1*l1-a*a));
    const mx=root[0]+dx*a/d, my=root[1]+dy*a/d;
    const j=[mx - s*h*dy/d, my + s*h*dx/d];
    return [j,[root[0]+dx,root[1]+dy]];
  }
  const lerp=(a,b,t)=>a+(b-a)*t;
  const lp=(a,b,t)=>[lerp(a[0],b[0],t),lerp(a[1],b[1],t)];
  function mix(A,B,t){
    const o={};
    for(const k in A){ const a=A[k], b=B[k]===undefined?a:B[k];
      o[k]=Array.isArray(a)?lp(a,b,t):typeof a==="number"?lerp(a,b,t):a; }
    return o;
  }
  // Construye articulaciones desde una pose
  function solve(p){
    const hip=p.hip, neck=add(hip,dir(p.torso,LEN.torso));
    const head=add(neck,dir(p.torso+(p.nod||0),LEN.head));
    const sw=p.front?11:0, hw=p.front?7:0;
    const shN=[neck[0]+sw,neck[1]+2], shF=[neck[0]-sw,neck[1]+2];
    const hpN=[hip[0]+hw,hip[1]], hpF=[hip[0]-hw,hip[1]];
    const handF=p.handF||[p.hand[0]-(p.front?0:3),p.hand[1]-(p.front?0:1)];
    const footF=p.footF||[p.foot[0]-(p.front?0:3),p.foot[1]];
    const [eN,hN]=ik(shN,p.hand,LEN.uArm,LEN.fArm,p.eb||1);
    const [eF,hF]=ik(shF,handF,LEN.uArm,LEN.fArm,p.ebF||p.eb||1);
    const [kN,fN]=ik(hpN,p.foot,LEN.thigh,LEN.shin,p.kb||1);
    const [kF,fF]=ik(hpF,footF,LEN.thigh,LEN.shin,p.kbF||p.kb||1);
    return {hip,neck,head,shN,shF,hpN,hpF,eN,hN,eF,hF,kN,fN,kF,fF};
  }
  const seg=(a,b,w,c)=>`<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
  function props(list,j){
    let s="";
    (list||[]).forEach(pr=>{
      const [t,...a]=pr;
      if(t==="floor") s+=`<line x1="-200" y1="${F+5}" x2="400" y2="${F+5}" stroke="var(--fig-prop)" stroke-width="2" stroke-linecap="round"/>`;
      if(t==="box") s+=`<rect x="${a[0]}" y="${a[1]}" width="${a[2]}" height="${F+5-a[1]}" rx="4" fill="var(--fig-prop2)"/>`;
      if(t==="bar") s+=`<line x1="${a[0]}" y1="${a[2]}" x2="${a[1]}" y2="${a[2]}" stroke="var(--fig-prop)" stroke-width="4" stroke-linecap="round"/><line x1="${a[0]+4}" y1="${a[2]}" x2="${a[0]+4}" y2="${a[3]||140}" stroke="var(--fig-prop2)" stroke-width="3"/><line x1="${a[1]-4}" y1="${a[2]}" x2="${a[1]-4}" y2="${a[3]||140}" stroke="var(--fig-prop2)" stroke-width="3"/>`;
      if(t==="wall") s+=`<rect x="${a[0]}" y="4" width="8" height="${F+1}" rx="3" fill="var(--fig-prop2)"/>`;
      if(t==="band"){ // banda: de un punto del cuerpo a un ancla fija o a otro punto
        const p1=j[a[0]], p2=typeof a[1]==="string"?j[a[1]]:a[1];
        s+=`<path d="M${p1[0].toFixed(1)} ${p1[1].toFixed(1)} Q ${((p1[0]+p2[0])/2).toFixed(1)} ${((p1[1]+p2[1])/2+3).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}" stroke="var(--fig-band)" stroke-width="2.5" fill="none" stroke-linecap="round"/>`; }
      if(t==="anchor") s+=`<rect x="${a[0]-3}" y="${a[1]-8}" width="6" height="16" rx="2" fill="var(--fig-prop)"/>`;
    });
    return s;
  }
  function pack(j){ // mochila en la espalda
    const n=j.neck,h=j.hip, mx=(n[0]+h[0])/2, my=(n[1]+h[1])/2;
    const ang=Math.atan2(n[1]-h[1],n[0]-h[0])*180/Math.PI;
    return `<g transform="translate(${mx.toFixed(1)} ${my.toFixed(1)}) rotate(${(ang+90).toFixed(1)})"><rect x="-26" y="-13" width="17" height="27" rx="5" fill="var(--fig-pack)"/></g>`;
  }
  function svgPose(ex,t,opt){
    const p=mix(ex.A,ex.B,t), j=solve(p), C="var(--fig)", C2="var(--fig2)";
    let s=props(ex.props,j);
    // lado lejano
    s+=seg(j.hpF,j.kF,9,C2)+seg(j.kF,j.fF,8,C2)+seg(j.shF,j.eF,8,C2)+seg(j.eF,j.hF,7,C2);
    if(ex.pack) s+=pack(j);
    // tronco y cabeza
    if(p.front){ s+=`<path d="M${j.shF[0]} ${j.shF[1]} L${j.shN[0]} ${j.shN[1]} L${j.hpN[0]} ${j.hpN[1]} L${j.hpF[0]} ${j.hpF[1]} Z" fill="${C}" stroke="${C}" stroke-width="8" stroke-linejoin="round"/>`; }
    else s+=seg(j.hip,j.neck,14,C);
    s+=`<circle cx="${j.head[0].toFixed(1)}" cy="${j.head[1].toFixed(1)}" r="8.5" fill="${C}"/>`;
    // lado cercano
    const O="var(--fig-bg)";
    s+=seg(j.hpN,j.kN,13,O)+seg(j.kN,j.fN,12,O)+seg(j.hpN,j.kN,9.5,C)+seg(j.kN,j.fN,8.5,C);
    s+=seg(j.shN,j.eN,12,O)+seg(j.eN,j.hN,11,O)+seg(j.shN,j.eN,8.5,C)+seg(j.eN,j.hN,7.5,C);
    (ex.bands||[]).forEach(b=>{s+=props([["band",...b]],j);});
    return s;
  }
  const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
  // Encuadre automático: caja que contiene todo el movimiento, en proporción 10:7
  function fit(ex){
    if(ex._vb) return ex._vb;
    let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9; const P=(x,y)=>{x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);};
    for(const t of [0,.25,.5,.75,1]){const j=solve(mix(ex.A,ex.B,t)); for(const k in j){const p=j[k]; P(p[0],p[1]);} }
    x0-=12;x1+=12;y0-=14;y1+=8;
    (ex.props||[]).forEach(([t,...a])=>{ if(t==="floor") y1=Math.max(y1,F+8); if(t==="box"){P(a[0],a[1]);P(a[0]+a[2],F+5);} if(t==="bar"){y0=Math.min(y0,a[2]-6);} if(t==="anchor"){P(a[0]-6,a[1]);P(a[0]+6,a[1]);} if(t==="wall") x1=Math.max(x1,a[0]+12); });
    (ex.bands||[]).forEach(b=>{ if(Array.isArray(b[1])) P(b[1][0],b[1][1]); });
    let w=x1-x0,h=y1-y0; const R=10/7;
    if(w/h<R){const nw=h*R; x0-=(nw-w)/2; w=nw;} else {const nh=w/R; y0-=(nh-h)*0.6; h=nh;}
    if(w<130){const s=130/w, cx=x0+w/2, by=y0+h; w*=s; h*=s; x0=cx-w/2; y0=by-h;}
    return ex._vb=`${x0.toFixed(1)} ${y0.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`;
  }
  function svg(ex,t){return `<svg viewBox="${fit(ex)}" class="fig" aria-hidden="true">${svgPose(ex,t)}</svg>`;}
  // Animación en un contenedor
  function play(el,ex){
    let raf, t0=performance.now(); const dur=ex.dur||[1100,1100], hold=350;
    const cyc=dur[0]+dur[1]+hold*2;
    const red=matchMedia("(prefers-reduced-motion: reduce)").matches;
    function frame(now){
      const e=(now-t0)%cyc; let t;
      if(e<dur[0]) t=ease(e/dur[0]); else if(e<dur[0]+hold) t=1; else if(e<dur[0]+hold+dur[1]) t=1-ease((e-dur[0]-hold)/dur[1]); else t=0;
      el.innerHTML=svg(ex,t); raf=requestAnimationFrame(frame);
    }
    if(red){ el.innerHTML=svg(ex,1); return ()=>{}; }
    raf=requestAnimationFrame(frame); return ()=>cancelAnimationFrame(raf);
  }
  const fl=["floor"];
  // ---------- POSES (mirando a la derecha, suelo y=124) ----------
  const P = {
    flexiones:{props:[fl],A:{hip:[88,100],torso:-27,hand:[126,124],foot:[40,124],eb:-1,kb:1},B:{hip:[90,112],torso:-8,hand:[126,124],foot:[40,124]}},
    flexPies:{props:[fl,["box",14,102,36]],A:{hip:[84,96],torso:-20,hand:[124,124],foot:[34,102],eb:-1,kb:1},B:{hip:[88,106],torso:0,hand:[124,124],foot:[34,102]}},
    diamante:{props:[fl],A:{hip:[88,100],torso:-27,hand:[122,124],foot:[40,124],eb:-1,kb:1},B:{hip:[90,112],torso:-8,hand:[122,124],foot:[40,124]}},
    pica:{props:[fl],A:{hip:[92,76],torso:8,hand:[138,124],foot:[64,124],eb:-1,kb:-1,nod:30},B:{hip:[96,80],torso:34,hand:[138,124],foot:[64,124],nod:20}},
    sentadilla:{pack:true,props:[fl],A:{hip:[96,70],torso:-90,hand:[104,46],foot:[100,124],eb:1,kb:1},B:{hip:[78,96],torso:-58,hand:[112,66],foot:[100,124]}},
    bulgara:{props:[fl,["box",22,100,38]],A:{hip:[92,72],torso:-84,hand:[98,72],foot:[114,124],footF:[44,100],eb:1,kb:-1,kbF:1},B:{hip:[86,96],torso:-74,hand:[94,96],foot:[114,124],footF:[44,100]}},
    puente:{props:[fl],A:{hip:[98,114],torso:180,hand:[78,123],foot:[120,124],footF:[146,98],eb:-1,kb:-1,kbF:-1,nod:-8},B:{hip:[102,94],torso:160,hand:[78,123],foot:[120,124],footF:[150,74]}},
    zancadas:{props:[fl],A:{hip:[90,70],torso:-90,hand:[98,72],foot:[96,124],footF:[84,124],eb:1,kb:1,kbF:-1},B:{hip:[92,96],torso:-88,hand:[98,96],foot:[124,124],footF:[56,124]}},
    gemelos:{props:[fl,["box",78,112,60],["wall",150]],A:{hip:[104,58],torso:-90,hand:[148,48],foot:[106,112],eb:1,kb:-1},B:{hip:[106,49],torso:-90,hand:[148,40],foot:[110,104]}},
    planchaLat:{props:[fl],A:{hip:[86,117],torso:-18,hand:[146,124],handF:[88,104],foot:[36,124],eb:1,ebF:-1,kb:1},B:{hip:[86,104],torso:-24,hand:[146,124],handF:[88,92],foot:[36,124]}},
    bici:{props:[fl],A:{hip:[104,116],torso:196,hand:[52,98],foot:[116,94],footF:[152,104],eb:1,kb:1,kbF:1,nod:-15},B:{hip:[104,116],torso:192,hand:[52,98],foot:[152,104],footF:[116,94]}},
    plancha:{props:[fl],A:{hip:[86,108],torso:-14,hand:[142,124],foot:[36,124],eb:-1,kb:1},B:{hip:[86,104],torso:-16,hand:[142,124],foot:[36,124]},dur:[1600,1600]},
    crunchInv:{props:[fl],A:{hip:[104,118],torso:180,hand:[78,124],foot:[130,92],eb:1,kb:-1,nod:0},B:{hip:[102,110],torso:174,hand:[78,124],foot:[104,78]}},
    aperturas:{props:[fl],bands:[["hN",[196,46]],["hF",[4,46]]],A:{front:true,hip:[100,72],torso:-90,hand:[146,50],handF:[54,50],foot:[110,124],footF:[90,124],eb:1,ebF:-1,kb:-1,kbF:1},B:{hip:[100,72],torso:-90,hand:[104,58],handF:[96,58]}},
    elevLat:{props:[fl],bands:[["hN","fN"],["hF","fF"]],A:{front:true,hip:[100,72],torso:-90,hand:[122,80],handF:[78,80],foot:[110,124],footF:[90,124],eb:1,ebF:-1,kb:-1,kbF:1},B:{hip:[100,72],torso:-90,hand:[152,36],handF:[48,36]}},
    curl:{props:[fl],bands:[["hN","fN"]],A:{hip:[100,70],torso:-90,hand:[106,74],foot:[102,124],eb:1,kb:-1},B:{hip:[100,70],torso:-90,hand:[114,38]}},
    facepull:{props:[fl,["anchor",186,34]],bands:[["hN",[186,34]]],A:{hip:[92,70],torso:-92,hand:[140,36],foot:[96,124],footF:[86,124],eb:-1,kb:-1},B:{hip:[90,70],torso:-94,hand:[108,32],eb:-1}},
    rotExt:{props:[fl,["anchor",10,60]],bands:[["hN",[10,60]]],A:{front:true,hip:[100,72],torso:-90,hand:[98,58],handF:[86,76],foot:[110,124],footF:[90,124],eb:1,ebF:1,kb:-1,kbF:1},B:{hip:[100,72],torso:-90,hand:[134,58]}},
    dominadas:{props:[["bar",62,158,10]],A:{hip:[104,92],torso:-88,hand:[112,10],foot:[92,128],eb:1,kb:1,nod:-10},B:{hip:[104,62],torso:-86,hand:[112,10],foot:[92,98]},dur:[1000,1300]},
    negativas:{props:[["bar",62,158,10]],A:{hip:[104,62],torso:-86,hand:[112,10],foot:[92,98],eb:1,kb:1,nod:-10},B:{hip:[104,92],torso:-88,hand:[112,10],foot:[92,128]},dur:[2600,500]},
    remo:{props:[fl,["bar",104,170,62,124]],A:{hip:[91,113],torso:-12,hand:[132,62],foot:[40,124],eb:-1,kb:1,nod:-10},B:{hip:[87,97],torso:-30,hand:[132,62],foot:[40,124]}},
    rodillas:{props:[["bar",50,160,8]],A:{hip:[104,88],torso:-90,hand:[106,8],foot:[102,139],eb:1,kb:1},B:{hip:[106,84],torso:-96,hand:[106,8],foot:[130,110]}},
    deadbug:{props:[fl],A:{hip:[104,116],torso:180,hand:[64,74],handF:[62,74],foot:[128,90],footF:[126,90],eb:1,kb:-1,kbF:-1},B:{hip:[104,116],torso:180,hand:[26,106],handF:[62,74],foot:[128,90],footF:[154,108]}},
    pullapart:{props:[fl],bands:[["hN","hF"]],A:{front:true,hip:[100,72],torso:-90,hand:[108,46],handF:[92,46],foot:[110,124],footF:[90,124],eb:1,ebF:-1,kb:-1,kbF:1},B:{hip:[100,72],torso:-90,hand:[150,42],handF:[50,42]}}
  };
  P.pausa=P.flexiones; P.dominadasD=P.dominadas;
  return {P, svg, play};
})();
