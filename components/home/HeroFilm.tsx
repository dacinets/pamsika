'use client';
import {useEffect,useRef,useState,type CSSProperties} from 'react';
import {Pause,Play,Sparkles} from 'lucide-react';
import {ButtonLink} from '@/components/site/UI';

/**
 * Full-screen home hero, cut like an ad reel. Full-bleed shots change with wipe
 * transitions while oversized headlines tell the Pamsika story in four beats:
 *   01 Idea  ·  02 Craft (Creative Market)  ·  03 Campaign (AdLab)  ·  04 Ideas that move business
 * One clock drives the edit; React only re-renders when the shot changes, and the
 * progress bars and timecode are written straight to the DOM. The reel pauses
 * off-screen, in background tabs and on request; with reduced motion (or without
 * JavaScript) the hero rests on the final beat, which holds the page's real h1.
 */
type Shot={img:string;beat:number;ms:number;label:string;pos?:string;wipe:'up'|'left'|'right'|'iris';sizes:number[]};
const L=[640,1280],XL=[640,1280,1672];
const SHOTS:Shot[]=[
 {img:'stock/tailor',beat:0,ms:2600,label:'A tailoring studio, Lilongwe',pos:'45% 35%',wipe:'iris',sizes:XL},
 {img:'stock/strategy',beat:0,ms:2200,label:'Shaping the brief',pos:'60% 40%',wipe:'up',sizes:L},
 {img:'stock/film',beat:1,ms:1300,label:'Film',pos:'50% 40%',wipe:'left',sizes:L},
 {img:'stock/photography',beat:1,ms:1300,label:'Photography',pos:'55% 35%',wipe:'up',sizes:L},
 {img:'stock/design',beat:1,ms:1300,label:'Design',pos:'60% 30%',wipe:'right',sizes:L},
 {img:'stock/sound',beat:1,ms:1300,label:'Sound',pos:'50% 50%',wipe:'up',sizes:L},
 {img:'stock/animation',beat:1,ms:1300,label:'Motion',pos:'50% 40%',wipe:'left',sizes:L},
 {img:'stock/production-crew',beat:2,ms:1700,label:'On set · brand film',pos:'50% 35%',wipe:'iris',sizes:L},
 {img:'stock/social',beat:2,ms:1600,label:'Social · vertical',pos:'40% 30%',wipe:'right',sizes:L},
 {img:'founder',beat:2,ms:1700,label:'Outdoor · brand story',pos:'72% 30%',wipe:'up',sizes:XL},
 {img:'citrus',beat:2,ms:1600,label:'Product · launch film',pos:'50% 50%',wipe:'left',sizes:XL},
 {img:'stock/lake-malawi',beat:3,ms:4200,label:'Lake Malawi',pos:'50% 55%',wipe:'iris',sizes:XL},
 {img:'stock/creative-team',beat:3,ms:4200,label:'Pamsika creative team',pos:'50% 40%',wipe:'up',sizes:XL},
];
const BEATS=['Idea','Craft','Campaign','Move'];
const START=SHOTS.reduce<number[]>((a,s,i)=>(a.push(i?a[i-1]+SHOTS[i-1].ms:0),a),[]);
const TOTAL=START[SHOTS.length-1]+SHOTS[SHOTS.length-1].ms;
const beatStart=(b:number)=>START[SHOTS.findIndex(s=>s.beat===b)];
const beatEnd=(b:number)=>b===BEATS.length-1?TOTAL:beatStart(b+1);
const FINAL_SHOT=SHOTS.findIndex(s=>s.beat===BEATS.length-1);
const src=(s:Shot,w:number)=>`/media/${s.img}-${w}.webp`;

export function HeroFilm(){
 const [shot,setShot]=useState(0);
 const [prev,setPrev]=useState(-1);
 const [prevBeat,setPrevBeat]=useState(-1);
 const [playing,setPlaying]=useState(false);
 const [reduced,setReduced]=useState(false);
 const root=useRef<HTMLElement>(null);
 const bars=useRef<(HTMLElement|null)[]>([]);
 const tc=useRef<HTMLSpanElement>(null);
 const clock=useRef({t:0,running:false,shot:0});

 const go=(next:number)=>{
  const cur=clock.current.shot;if(next===cur)return;
  clock.current.shot=next;setPrev(cur);setShot(next);
  if(SHOTS[next].beat!==SHOTS[cur].beat)setPrevBeat(SHOTS[cur].beat);
 };

 useEffect(()=>{
  const mq=window.matchMedia('(prefers-reduced-motion: reduce)');
  const apply=()=>{setReduced(mq.matches);setPlaying(!mq.matches);if(mq.matches){clock.current.t=beatStart(3);go(FINAL_SHOT);}};
  apply();mq.addEventListener('change',apply);
  let inView=true,visible=!document.hidden,raf=0,last=performance.now(),lastTc=0;
  const io=new IntersectionObserver(([e])=>{inView=e.isIntersecting;},{threshold:.15});
  if(root.current)io.observe(root.current);
  const onVis=()=>{visible=!document.hidden;};document.addEventListener('visibilitychange',onVis);
  const frame=(now:number)=>{
   const dt=Math.min(now-last,500);last=now;const c=clock.current;
   if(c.running&&inView&&visible){
    c.t=(c.t+dt)%TOTAL;
    let i=SHOTS.length-1;while(i>0&&START[i]>c.t)i--;
    go(i);
    BEATS.forEach((_,b)=>{const el=bars.current[b];if(el)el.style.transform=`scaleX(${Math.min(1,Math.max(0,(c.t-beatStart(b))/(beatEnd(b)-beatStart(b))))})`;});
    if(now-lastTc>80&&tc.current){lastTc=now;const f=Math.floor(c.t/1000*24),s=Math.floor(f/24);tc.current.textContent=`00:00:${String(s).padStart(2,'0')}:${String(f%24).padStart(2,'0')}`;}
   }
   raf=requestAnimationFrame(frame);
  };
  raf=requestAnimationFrame(frame);
  return()=>{cancelAnimationFrame(raf);io.disconnect();mq.removeEventListener('change',apply);document.removeEventListener('visibilitychange',onVis);};
 },[]);
 useEffect(()=>{clock.current.running=playing;},[playing]);

 const jump=(b:number)=>{
  clock.current.t=beatStart(b);go(SHOTS.findIndex(s=>s.beat===b));
  BEATS.forEach((_,i)=>{const el=bars.current[i];if(el)el.style.transform=`scaleX(${i<b?1:0})`;});
 };
 const beat=SHOTS[shot].beat;
 const state=(b:number)=>b===beat?'on':b===prevBeat?'out':'idle';
 // Mount images just ahead of the edit so the first paint only loads the opening shot.
 const near=(i:number)=>i===shot||i===prev||(i-shot+SHOTS.length)%SHOTS.length<=2||i===FINAL_SHOT&&reduced;
 const line=(text:React.ReactNode,l:number,cls='')=><span className={`hf-line ${cls}`} style={{'--l':l} as CSSProperties}><span>{text}</span></span>;

 return <section className={`hero-film${playing?' is-playing':''}`} ref={root} aria-label="Introduction" data-beat={beat}>
  <div className="hf-reel" aria-hidden="true">
   {SHOTS.map((s,i)=><div key={s.img} className={`hf-shot${i===shot?' is-on':i===prev?' is-prev':''}`} data-wipe={s.wipe} style={{'--ms':`${s.ms+1200}ms`} as CSSProperties}>
    {near(i)&&<img src={src(s,1280)} srcSet={s.sizes.map(w=>`${src(s,w)} ${w}w`).join(', ')} sizes="100vw" alt="" style={{objectPosition:s.pos}} fetchPriority={i===0?'high':undefined} decoding="async"/>}
   </div>)}
   <div className="hf-shade"/>
   <div className="hf-grain"/>
  </div>

  <div className="hf-hud container" aria-hidden="true">
   <span className="hf-rec"><i/>Pamsika reel</span>
   <span className="hf-tc" ref={tc}>00:00:00:00</span>
   <span className="hf-geo">Lilongwe · 13.96° S 33.79° E</span>
   <span className="hf-shotlabel" key={shot}>{String(shot+1).padStart(2,'0')} / {SHOTS.length} · {SHOTS[shot].label}</span>
  </div>

  <div className="hf-body container">
   <div className="hf-stack">
    <p className="hf-beat" data-state={state(0)} aria-hidden="true">
     {line(<><b>01</b> The idea</>,0,'hf-kicker')}
     {line('Every move',1)}{line('starts with',2)}{line(<span className="accent-text">an idea.</span>,3)}
    </p>
    <p className="hf-beat" data-state={state(1)} aria-hidden="true">
     {line(<><b>02</b> Creative Market</>,0,'hf-kicker')}
     {line('Find the',1)}{line(<span className="hf-fill">craft.</span>,2)}
     {line(<span className="hf-disc" key={beat===1?shot:'x'}>{beat===1?SHOTS[shot].label:'Film'}</span>,3,'hf-disc-line')}
    </p>
    <p className="hf-beat" data-state={state(2)} aria-hidden="true">
     {line(<><b>03</b> AdLab</>,0,'hf-kicker')}
     {line('Make the',1)}{line(<span className="hf-outline">campaign.</span>,2)}
    </p>
    <h1 className="hf-beat" data-state={state(3)}>
     {line(<><b>04</b> Pamsika</>,0,'hf-kicker')}
     {line('Ideas that',1)}{line(<><span className="accent-text">move</span> <span className="blue-text">business.</span></>,2)}
    </h1>
   </div>

   <div className="hf-foot">
    <div className="hf-intro">
     <p>African ambition, amplified. Pamsika brings creativity, technology and local intelligence together to help your business make its next move.</p>
     <div className="actions"><ButtonLink href="/start-a-campaign" track="Start a campaign (hero)">Start a campaign</ButtonLink><ButtonLink href="/faq?view=guide" variant="glass" arrow={false} track="Help me choose (hero)"><Sparkles size={16} aria-hidden/>Help me choose</ButtonLink></div>
    </div>
    <div className="hf-rail">
     <ol>{BEATS.map((b,i)=><li key={b}><button type="button" onClick={()=>jump(i)} aria-current={i===beat?'step':undefined} aria-label={`Show part ${i+1}: ${b}`}>
      <span className="hf-rail-n">0{i+1}</span><span className="hf-rail-t">{b}</span><span className="hf-rail-bar"><i ref={el=>{bars.current[i]=el;}}/></span>
     </button></li>)}</ol>
     {!reduced&&<button type="button" className="hf-toggle" onClick={()=>setPlaying(p=>!p)} aria-label={playing?'Pause the hero film':'Play the hero film'}>{playing?<Pause size={16} aria-hidden/>:<Play size={16} aria-hidden/>}</button>}
    </div>
   </div>
  </div>
  <noscript><style>{'.hf-beat:not(h1){display:none}h1.hf-beat .hf-line>span{transform:none}'}</style></noscript>
  <a className="hf-scroll" href="#our-offerings" aria-label="Scroll to our offerings"><span/></a>
 </section>;
}
