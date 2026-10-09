'use client';
import {useEffect,useRef,useState,type CSSProperties} from 'react';
import {Pause,Play} from 'lucide-react';

/**
 * The home hero's motion piece: one story told in four acts, built from live HTML, SVG and CSS
 * (no video file), so it stays sharp at any size and weighs almost nothing.
 *
 *   01 Idea      a local business and its brief
 *   02 Craft     Creative Market gathers the disciplines the idea needs
 *   03 Campaign  AdLab produces film, social and outdoor work
 *   04 Move      the work reaches people and the business grows
 *
 * The active act is a data attribute on the stage; CSS moves every element between its
 * per-act states, so elements carry over between acts instead of cutting. Each act's
 * progress bar is a CSS animation and its `animationend` advances the story, which keeps
 * pause/resume exact. The loop pauses off-screen, in background tabs, on request, and
 * never starts for people who prefer reduced motion.
 */
const ACTS=[
 {title:'Idea',text:'It starts with your business and what it wants to achieve.',ms:4800},
 {title:'Craft',text:'Creative Market brings in the skills your idea needs.',ms:5000},
 {title:'Campaign',text:'AdLab turns it into film, social and outdoor work.',ms:6200},
 {title:'Growth',text:'Your audience sees it, shares it and chooses you.',ms:5600},
];
const NODES=[['Film','film'],['Photography','photography'],['Design','design'],['Writing','writing'],['Sound','sound'],['Motion','animation']] as const;
// Disciplines sit on an ellipse around the brief (stage units: 100 wide, 92 tall).
const HUB={x:50,y:45};
const nodePos=NODES.map((_,i)=>{const a=(-90+i*60)*Math.PI/180;return {x:+(HUB.x+37*Math.cos(a)).toFixed(2),y:+(HUB.y+31*Math.sin(a)).toFixed(2)};});
const media=(name:string)=>`/media/stock/${name}-640.webp`;

export function HeroShowcase(){
 const [act,setAct]=useState(0);
 // Starts paused and begins playing once we know the visitor hasn't asked for reduced motion.
 const [playing,setPlaying]=useState(false);
 const [inView,setInView]=useState(true);
 const [pageVisible,setPageVisible]=useState(true);
 const [reduced,setReduced]=useState(false);
 const root=useRef<HTMLDivElement>(null);
 const stage=useRef<HTMLDivElement>(null);

 useEffect(()=>{
  const mq=window.matchMedia('(prefers-reduced-motion: reduce)');
  const apply=()=>{setReduced(mq.matches);setPlaying(!mq.matches);};
  apply();mq.addEventListener('change',apply);
  const io=new IntersectionObserver(([e])=>setInView(e.isIntersecting),{threshold:.2});
  if(root.current)io.observe(root.current);
  const onVis=()=>setPageVisible(!document.hidden);document.addEventListener('visibilitychange',onVis);
  // A slight tilt toward the pointer gives the glass stage some depth.
  const el=stage.current,fine=window.matchMedia('(pointer:fine)').matches&&!mq.matches;
  const onMove=(e:PointerEvent)=>{if(!el)return;const r=el.getBoundingClientRect();el.style.setProperty('--tx',`${((e.clientX-r.left)/r.width-.5).toFixed(3)}`);el.style.setProperty('--ty',`${((e.clientY-r.top)/r.height-.5).toFixed(3)}`);};
  const onLeave=()=>{el?.style.setProperty('--tx','0');el?.style.setProperty('--ty','0');};
  if(fine&&el){el.addEventListener('pointermove',onMove);el.addEventListener('pointerleave',onLeave);}
  return()=>{mq.removeEventListener('change',apply);io.disconnect();document.removeEventListener('visibilitychange',onVis);el?.removeEventListener('pointermove',onMove);el?.removeEventListener('pointerleave',onLeave);};
 },[]);

 const running=playing&&inView&&pageVisible&&!reduced;
 const next=()=>setAct(a=>(a+1)%ACTS.length);

 return <div className={`showcase${running?' is-running':''}`} ref={root}>
  <div className="sc-stage" data-theme="dark" data-act={act} ref={stage} aria-hidden="true">
   <div className="sc-aura"><i/><i/><i/></div>
   <div className="sc-floor"/>

   <svg className="sc-threads" viewBox="0 0 100 92" preserveAspectRatio="none">
    <defs><linearGradient id="sc-thread" gradientUnits="userSpaceOnUse" x1="20" y1="10" x2="80" y2="82"><stop offset="0" stopColor="#ff9a3c"/><stop offset="1" stopColor="#5aa2ff"/></linearGradient></defs>
    {nodePos.map((p,i)=><g key={i} style={{'--i':i} as CSSProperties}><line className="sc-thread" x1={HUB.x} y1={HUB.y} x2={p.x} y2={p.y} pathLength={1}/><line className="sc-pulse" x1={HUB.x} y1={HUB.y} x2={p.x} y2={p.y} pathLength={1}/></g>)}
   </svg>

   <figure className="sc-biz"><img src={media('tailor')} srcSet={`${media('tailor')} 640w, /media/stock/tailor-1280.webp 1280w`} sizes="(max-width:1023px) 50vw, 360px" alt="" width="640" height="427" fetchPriority="high"/></figure>
   <div className="sc-spark"><i/><i/><i/></div>
   <div className="sc-biz-tag sc-chip">Local business</div>

   <div className="sc-brief">
    <p className="sc-kicker"><b/>The brief</p>
    <p className="sc-line">Launch our new collection.</p>
    <p className="sc-line">Reach young shoppers in Lilongwe.</p>
    <p className="sc-line">Make it feel world-class.</p>
   </div>

   <div className="sc-hub-label sc-chip">Your brief</div>
   {NODES.map(([label,img],i)=><div className="sc-node" key={label} style={{'--i':i,'--nx':nodePos[i].x,'--ny':nodePos[i].y} as CSSProperties}><span className="sc-node-img"><img src={media(img)} alt="" width="640" height="427" loading="lazy"/></span><span className="sc-node-label">{label}</span></div>)}

   <figure className="sc-card sc-film">
    <img src={media('production-crew')} alt="" width="640" height="427" loading="lazy"/>
    <span className="sc-vf"/>
    <span className="sc-rec"><i/>REC</span>
    <span className="sc-tc">00:00:<b/></span>
    <span className="sc-scrub"><i/></span>
    <span className="sc-card-tag">Brand film</span>
   </figure>
   <figure className="sc-card sc-social">
    <img src={media('social')} alt="" width="640" height="427" loading="lazy"/>
    <span className="sc-social-top"><i/><span><b>New collection</b><small>Sponsored</small></span></span>
    <span className="sc-social-cap">Made here. Worn everywhere.<span className="sc-heart">♥</span></span>
    <span className="sc-card-tag">Social</span>
   </figure>
   <figure className="sc-card sc-poster">
    <img src="/media/founder-640.webp" alt="" width="640" height="360" loading="lazy"/>
    <strong>Made here.<br/><span>Worn everywhere.</span></strong>
    <span className="sc-card-tag">Outdoor</span>
   </figure>

   <div className="sc-adlab-tag sc-chip"><b>AdLab</b> · In production</div>

   <div className="sc-panel"/>
   <svg className="sc-chart" viewBox="0 0 100 92" preserveAspectRatio="none">
    <defs><linearGradient id="sc-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ff7a00" stopOpacity=".45"/><stop offset="1" stopColor="#005abd" stopOpacity="0"/></linearGradient></defs>
    {[48,58,68,78].map(y=><line key={y} className="sc-grid" x1="8" x2="93" y1={y} y2={y}/>)}
    <path className="sc-area" d="M13 74 C 26 73, 33 68, 42 64 S 60 54, 70 49 S 86 40, 93 37 L 93 84 L 13 84 Z"/>
    <path className="sc-curve" d="M13 74 C 26 73, 33 68, 42 64 S 60 54, 70 49 S 86 40, 93 37" pathLength={1}/>
   </svg>
   {[['Seen',38,66],['Shared',62,53.5],['Chosen',84,42]].map(([label,x,y],i)=><span className={`sc-milestone${i===2?' is-flip':''}`} key={label} style={{'--i':i,'--mx':x,'--my':y} as CSSProperties}><i/>{label}</span>)}
   <div className="sc-biz-label">Your business</div>
   <div className="sc-moves"><span>Business</span><span>moves<i>.</i></span></div>
   <div className="sc-illustrative">Illustrative</div>
   <div className="sc-grain"/>
  </div>

  <div className="sc-rail">
   <ol>
    {ACTS.map((a,i)=><li key={a.title}><button type="button" className={i===act?'is-active':i<act?'is-done':''} aria-current={i===act?'step':undefined} onClick={()=>setAct(i)}>
     <span className="sc-rail-n">0{i+1}</span><span className="sc-rail-t">{a.title}</span>
     <span className="sc-rail-bar"><i key={`${act}-${i}`} style={{animationDuration:`${a.ms}ms`}} onAnimationEnd={i===act&&running?next:undefined}/></span>
    </button></li>)}
   </ol>
   {!reduced&&<button type="button" className="sc-toggle" onClick={()=>setPlaying(p=>!p)} aria-label={playing?'Pause the animation':'Play the animation'}>{playing?<Pause size={15} aria-hidden/>:<Play size={15} aria-hidden/>}</button>}
  </div>
  <p className="sc-caption" aria-live={running?'off':'polite'}>{ACTS[act].text}</p>
 </div>;
}
