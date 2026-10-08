'use client';
import {useEffect,useRef,useState,type CSSProperties} from 'react';
import {ArrowUpRight,Pause,Play} from 'lucide-react';
import {ButtonLink,TextLink} from '@/components/site/UI';
import {SiteLink as Link} from '@/components/site/SiteLink';

/**
 * Creative Market hero: "We know people who ___."
 * The headline's last word cycles through the six crafts in the network, and each
 * word performs its own craft: FILM rolls through a film gate under letterbox bars,
 * SHOOT pulls focus and fires a flash, DESIGN is drawn as outlines inside a selection
 * box before it fills, WRITE is typed, RECORD bounces like a level meter over a
 * waveform, and ANIMATE moves with onion skins and squash and stretch. A portrait
 * of the craft sits behind the type and changes with a matching cut.
 *
 * One clock runs the cycle and writes the progress bar and HUD readouts straight
 * to the DOM; React only re-renders when the craft changes. Performances are CSS
 * keyframes that restart when their word remounts. The cycle pauses off-screen, in
 * background tabs and on request. With reduced motion every word rests in its final
 * state and only changes when the visitor picks a craft.
 */
type Key='film'|'shoot'|'design'|'write'|'record'|'animate';
type Craft={key:Key;verb:string;title:string;slug:string;alt:string;hud:string[];spoken:string};

const CRAFTS:Craft[]=[
 {key:'film',verb:'Film',title:'Film and video',slug:'film-and-video',spoken:'film',alt:'A filmmaker kneeling to frame a shot with a cinema camera',hud:['24 fps','2.39 : 1']},
 {key:'shoot',verb:'Shoot',title:'Photography',slug:'photography',spoken:'photograph',alt:'A photographer aiming his camera straight at the viewer',hud:['f/2.8','1/250','ISO 400']},
 {key:'design',verb:'Design',title:'Design and branding',slug:'design-and-branding',spoken:'design',alt:'A designer laying out a printed pattern on fabric in his studio',hud:['Layer · Wordmark','Fill #FFFFFF']},
 {key:'write',verb:'Write',title:'Writing and content',slug:'writing-and-content',spoken:'write',alt:'A writer working on a laptop at a café table',hud:['Draft 07','1 word']},
 {key:'record',verb:'Record',title:'Sound and voice',slug:'sound-and-voice',spoken:'record sound',alt:'A studio condenser microphone in a dark recording booth',hud:['48 kHz','Mono']},
 {key:'animate',verb:'Animate',title:'Animation and motion',slug:'animation-and-motion',spoken:'animate',alt:'A motion artist building a 3D scene across two monitors',hud:['Ease out back','12 fps onion']},
];
const N=CRAFTS.length;
const DUR=5600; // ms each craft holds the stage
const src=(k:Key,w:number)=>`/media/market/cm-${k}-${w}.webp`;
const srcSet=(k:Key)=>[640,1280,1672].map(w=>`${src(k,w)} ${w}w`).join(', ');
const pad=(n:number,l=2)=>String(Math.floor(n)).padStart(l,'0');

/** Per-craft props that stage pieces around the word. */
function Props({k,letters}:{k:Key;letters:string[]}){
 switch(k){
  case 'film':return <><i className="cm-sprockets"/><i className="cm-sprockets is-low"/></>;
  case 'shoot':return <span className="cm-af"><i/><i/><i/><i/><b>AF ●</b></span>;
  case 'design':return <><span className="cm-guides"><i data-l="Cap height"/><i data-l="Baseline"/></span>
   <span className="cm-bbox"><i/><i/><i/><i/><i/><i/><i/><i/><b className="cm-bbox-size">Wordmark</b></span>
   <svg className="cm-cursor" viewBox="0 0 24 24" aria-hidden><path d="M3 2l7.5 19 2.6-7.9L21 10.5z"/></svg>
   <b className="cm-cursor-tag">Designer</b></>;
  case 'write':return <svg className="cm-swash" viewBox="0 0 400 24" preserveAspectRatio="none" aria-hidden><path d="M4 16 C 90 4, 170 22, 250 12 S 360 6, 396 14" pathLength={1}/></svg>;
  case 'record':return <span className="cm-wave">{Array.from({length:56},(_,j)=><i key={j} style={{'--j':j,'--h':(.25+.75*Math.abs(Math.sin(j*1.7)*Math.cos(j*.37))).toFixed(2)} as CSSProperties}/>)}</span>;
  case 'animate':return <><span className="cm-ghosts" aria-hidden>{[3,2,1].map(g=><span className="cm-ghost" key={g} style={{'--g':g} as CSSProperties}>{letters.join('')}</span>)}</span>
   <span className="cm-timeline"><i className="cm-key" style={{'--at':0} as CSSProperties}/><i className="cm-key" style={{'--at':.45} as CSSProperties}/><i className="cm-key" style={{'--at':1} as CSSProperties}/><i className="cm-playhead"/></span></>;
 }
}

export function MarketHero(){
 const root=useRef<HTMLElement>(null);
 const liveRef=useRef<HTMLSpanElement>(null);
 const [i,setI]=useState(0);
 const [prev,setPrev]=useState<number|null>(null);
 const [take,setTake]=useState(0);
 const [playing,setPlaying]=useState(true);
 const [reduced,setReduced]=useState(false);
 const ctl=useRef({playing:true,reduced:false,elapsed:0,i:0,jump:-1});

 const go=(n:number)=>{
  const c=ctl.current;
  setPrev(c.i);c.i=n;c.elapsed=0;setI(n);setTake(t=>t+1);
 };

 useEffect(()=>{
  const sec=root.current;if(!sec)return;
  const c=ctl.current;
  const mq=window.matchMedia('(prefers-reduced-motion: reduce)');
  const applyMq=()=>{c.reduced=mq.matches;setReduced(mq.matches);};
  applyMq();mq.addEventListener('change',applyMq);
  let onScreen=true;
  const io=new IntersectionObserver(([e])=>{onScreen=e.isIntersecting;},{threshold:.05});
  io.observe(sec);

  // Tilt the portrait toward a mouse.
  const fine=window.matchMedia('(pointer: fine)');
  const onMove=(e:PointerEvent)=>{
   if(!fine.matches||c.reduced)return;
   const r=sec.getBoundingClientRect();
   sec.style.setProperty('--mx',((e.clientX-r.left)/r.width-.5).toFixed(3));
   sec.style.setProperty('--my',((e.clientY-r.top)/r.height-.5).toFixed(3));
  };
  sec.addEventListener('pointermove',onMove);

  let raf=0,last=performance.now(),meter=0;
  const tick=(now:number)=>{
   const dt=Math.min(now-last,100);last=now;
   const running=c.playing&&!c.reduced&&onScreen&&!document.hidden;
   sec.toggleAttribute('data-held',!running);
   if(running){
    c.elapsed+=dt;
    if(c.elapsed>=DUR){go((c.i+1)%N);}
   }
   sec.style.setProperty('--p',(c.reduced?1:Math.min(c.elapsed/DUR,1)).toFixed(4));
   // Live HUD readouts for the crafts that have a clock.
   const live=liveRef.current;
   if(live){
    const k=CRAFTS[c.i].key,t=c.elapsed/1000;
    if(k==='film')live.textContent=`TC 00:00:${pad(t)}:${pad((t%1)*24)}`;
    else if(k==='animate')live.textContent=`Frame ${pad((t*12)%48+1,3)} / 048`;
    else if(k==='record'){if(running&&now-meter>110){meter=now;live.textContent=`● REC  −${(6+Math.random()*9).toFixed(1)} dB`;}}
    else live.textContent='';
   }
   raf=requestAnimationFrame(tick);
  };
  raf=requestAnimationFrame(tick);
  return()=>{cancelAnimationFrame(raf);io.disconnect();mq.removeEventListener('change',applyMq);sec.removeEventListener('pointermove',onMove);};
 },[]);

 const toggle=()=>{const p=!playing;ctl.current.playing=p;setPlaying(p);};
 const craft=CRAFTS[i];
 const letters=[...craft.verb.toUpperCase()];

 return <section ref={root} className="cm-hero" data-craft={craft.key} data-paused={playing?undefined:''} aria-labelledby="cm-title">
  <div className="cm-ambient" aria-hidden><i/><i/></div>
  {/* Craft-wide effects that reach past the word */}
  <div className="cm-fx" aria-hidden key={`fx-${take}`} data-craft={craft.key}><i className="cm-bar is-top"/><i className="cm-bar is-bottom"/><i className="cm-flash"/></div>

  <div className="container cm-body">
   <div className="cm-top">
    <p className="cm-identity"><span>Pamsika</span>Creative Market</p>
    <p className="cm-hud" aria-hidden><span className="cm-hud-n">{pad(i+1)} / {pad(N)}</span><span className="cm-hud-live" ref={liveRef}/>{craft.hud.map(h=><span key={h}>{h}</span>)}</p>
   </div>

   <div className="cm-stage">
    <figure className="cm-card">
     <div className="cm-card-frame">
      {prev!==null&&prev!==i&&<img className="cm-card-img is-prev" key={`p-${CRAFTS[prev].key}`} src={src(CRAFTS[prev].key,640)} srcSet={srcSet(CRAFTS[prev].key)} sizes="(max-width:767px) 62vw, 34vw" alt="" decoding="async"/>}
      <img className="cm-card-img" key={`c-${take}`} data-craft={craft.key} src={src(craft.key,1280)} srcSet={srcSet(craft.key)} sizes="(max-width:767px) 62vw, 34vw" alt={craft.alt} fetchPriority={take===0?'high':undefined} decoding="async"/>
     </div>
     <figcaption className="cm-card-cap glass"><span><b>{pad(i+1)}</b>{craft.title}</span><Link href={`/creative-market/${craft.slug}`} aria-label={`Explore ${craft.title}`}><ArrowUpRight size={18} aria-hidden/></Link></figcaption>
    </figure>

    <h1 className="cm-title" id="cm-title">
     <span className="cm-line"><span>We know</span></span>
     <span className="cm-line"><span>people who</span></span>
     <span className="sr-only"> film, photograph, design, write, record sound and animate.</span>
     <span className="cm-slot" aria-hidden>
      <span className="cm-verb" key={`v-${take}`} data-craft={craft.key} style={{'--len':letters.length+1} as CSSProperties}>
       <span className="cm-word">{letters.map((ch,j)=><span className="cm-l" key={j} style={{'--i':j,'--d':`${.42+((j*37)%5)*.07}s`} as CSSProperties}>{ch}</span>)}<span className="cm-l cm-dot" style={{'--i':letters.length} as CSSProperties}>.</span></span>
       <Props k={craft.key} letters={letters}/>
      </span>
     </span>
    </h1>

    <nav className="cm-index" aria-label="Crafts in the network">
     <ol>{CRAFTS.map((c,n)=><li key={c.key}><button type="button" aria-pressed={n===i} onClick={()=>go(n)}><span className="cm-index-n">{pad(n+1)}</span><span className="cm-index-t">{c.verb}</span><i className="cm-index-bar" aria-hidden/></button></li>)}</ol>
     {!reduced&&<button type="button" className="cm-toggle" onClick={toggle} aria-label={playing?'Pause the craft cycle':'Play the craft cycle'}>{playing?<Pause size={16} aria-hidden/>:<Play size={16} aria-hidden/>}</button>}
    </nav>
   </div>

   <div className="cm-foot">
    <p className="cm-lead">Creative Market is Pamsika’s curated network of vetted, independent Malawian creators: the people behind our AdLab campaigns. Tell us what your idea needs and we’ll work towards the right creative match.</p>
    <div className="cm-actions"><ButtonLink href="/creative-market/request" track="Request a match (Creative Market hero)">Request a match</ButtonLink><TextLink href="/creative-market/join">Join as a creator</TextLink></div>
   </div>
  </div>
 </section>;
}
