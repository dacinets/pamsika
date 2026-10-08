'use client';
import {useEffect,useRef,useState,type CSSProperties} from 'react';
import {Pause,Play} from 'lucide-react';
import {Logo} from '@/components/brand/Logo';
import {ButtonLink,TextLink} from '@/components/site/UI';

/**
 * AdLab hero: "the hidden layer". A wall of everyday business moments scrolls
 * behind the headline in muted monochrome. A circular lens roams the section
 * and magnifies the layer underneath, where the same moments appear in full
 * colour as campaign concepts (strategy, film, social, design).
 *
 * The wall is rendered twice: once as the page backdrop and once inside the
 * lens, scaled around the lens centre. One clock moves both copies of every
 * column and the lens, writing transforms straight to the DOM; React only
 * re-renders when the tile under the lens changes. The lens follows a mouse,
 * glides to a tap on touch screens, and otherwise drifts on its own. Page
 * scrolling pushes the columns along. Motion pauses off-screen, in background
 * tabs and on request; with reduced motion the wall and lens stay still.
 */
type Kind='strategy'|'film'|'social'|'design';
type Tile={img:string;shape:'p'|'l';kind:Kind;raw:string;work:string;line:string;pos?:string};

const KINDS:{key:Kind;n:string;title:string;text:string}[]=[
 {key:'strategy',n:'01',title:'Strategy',text:'Audience, insight, the idea'},
 {key:'film',n:'02',title:'Film',text:'Commercials and brand films'},
 {key:'social',n:'03',title:'Social',text:'Campaigns for every feed'},
 {key:'design',n:'04',title:'Design',text:'Identity and campaign design'},
];
const KIND_N=Object.fromEntries(KINDS.map(k=>[k.key,k.n])) as Record<Kind,string>;

// Columns 0–2 carry every discipline because phones only show those three.
const COLS:Tile[][]=[
 [
  {img:'stock/market-day',shape:'p',kind:'strategy',raw:'Market day',work:'Market insight',line:'Know the street.',pos:'50% 40%'},
  {img:'stock/shopkeeper',shape:'l',kind:'film',raw:'The corner shop',work:'Brand story',line:'Open for the neighbourhood.'},
  {img:'stock/selfie-studio',shape:'l',kind:'social',raw:'A phone and an idea',work:'Vertical video',line:'Say it in fifteen seconds.',pos:'45% 30%'},
  {img:'stock/brand-swatches',shape:'p',kind:'design',raw:'Swatches on a desk',work:'Colour system',line:'A colour people remember.'},
 ],
 [
  {img:'stock/interview-shoot',shape:'l',kind:'film',raw:'A founder talking',work:'Founder film',line:'Hear it from the founder.'},
  {img:'stock/portrait-blue',shape:'p',kind:'film',raw:'A portrait',work:'Fashion film',line:'Wear the story.',pos:'50% 30%'},
  {img:'stock/vendor-phone',shape:'l',kind:'social',raw:'A stall owner online',work:'Mobile-first campaign',line:'Right where they scroll.',pos:'55% 35%'},
  {img:'stock/strategy',shape:'l',kind:'strategy',raw:'Two people, one laptop',work:'Creative brief',line:'One clear message.'},
 ],
 [
  {img:'stock/fashion-print',shape:'p',kind:'design',raw:'Printing fabric',work:'Brand identity',line:'Printed with pride.',pos:'50% 35%'},
  {img:'citrus',shape:'l',kind:'film',raw:'A product shot',work:'Product film',line:'Taste the season.'},
  {img:'stock/creator-phone',shape:'l',kind:'social',raw:'A creator',work:'Creator content',line:'Made for the feed.',pos:'45% 35%'},
  {img:'stock/production-crew',shape:'l',kind:'film',raw:'A camera on a tripod',work:'On set',line:'Every frame on brief.'},
 ],
 [
  {img:'stock/market-vendor',shape:'l',kind:'social',raw:'A trader at his stall',work:'Community campaign',line:'Proudly local.',pos:'30% 40%'},
  {img:'stock/strategy-session',shape:'p',kind:'strategy',raw:'A whiteboard session',work:'Campaign workshop',line:'Shape the idea together.'},
  {img:'stock/studio-mic',shape:'l',kind:'film',raw:'A microphone',work:'Radio spot',line:'Make them listen.',pos:'70% 50%'},
  {img:'stock/tailor',shape:'l',kind:'film',raw:'A tailor at work',work:'Craft story',line:'Made to measure.'},
 ],
 [
  {img:'founder',shape:'l',kind:'film',raw:'An outdoor portrait',work:'Brand film',line:'Built on purpose.',pos:'72% 30%'},
  {img:'stock/market-aerial',shape:'p',kind:'strategy',raw:'A crowded market',work:'Audience mapping',line:'Find your people.'},
  {img:'stock/social',shape:'l',kind:'social',raw:'Filming on a phone',work:'Launch content',line:'Launch day, everywhere.',pos:'40% 30%'},
  {img:'stock/design',shape:'p',kind:'design',raw:'A designer sketching',work:'Campaign design',line:'Designed to be seen.',pos:'50% 30%'},
 ],
];
const TILES=COLS.flat();
const src=(img:string,w:number)=>`/media/${img}-${w}.webp`;
const srcSet=(img:string)=>`${src(img,640)} 640w, ${src(img,1280)} 1280w`;

const MAG_DESKTOP=1.7,MAG_PHONE=1.55;
const DRIFT=.024;          // column drift, px per ms
const SCROLL_PUSH=.5;      // column travel per px of page scroll

function Wall({lens,tracks}:{lens:boolean;tracks:React.RefObject<(HTMLDivElement|null)[]>}){
 return <div className="al-wall">
  {COLS.map((col,c)=><div className="al-col" data-col={c} key={c}>
   <div className="al-track" ref={el=>{tracks.current[c]=el;}}>
    {[0,1].map(copy=>col.map((t,i)=>{
     const id=COLS.slice(0,c).reduce((n,cc)=>n+cc.length,0)+i;
     return <figure className="al-tile" data-shape={t.shape} data-tile={id} key={`${copy}-${t.img}`}>
      <img src={src(t.img,640)} srcSet={srcSet(t.img)} sizes={lens?'(max-width:767px) 66vw, 40vw':'(max-width:767px) 40vw, 23vw'} alt="" decoding="async" style={t.pos?{objectPosition:t.pos}:undefined}/>
      {lens
       ?<figcaption className="al-ad"><span className="al-ad-tag"><b>{KIND_N[t.kind]}</b>{t.kind}</span><strong>{t.line}</strong><span className="al-ad-meta">{t.work} · Concept</span><i className="al-crop" /></figcaption>
       :<figcaption className="al-raw">{t.raw}</figcaption>}
     </figure>;
    }))}
   </div>
  </div>)}
 </div>;
}

export function AdLabLensHero(){
 const root=useRef<HTMLElement>(null);
 const lensRef=useRef<HTMLDivElement>(null);
 const viewRef=useRef<HTMLDivElement>(null);
 const ringRef=useRef<SVGSVGElement>(null);
 const windowRef=useRef<HTMLDivElement>(null);
 const baseTracks=useRef<(HTMLDivElement|null)[]>([]);
 const lensTracks=useRef<(HTMLDivElement|null)[]>([]);
 const [active,setActive]=useState(0);
 const [playing,setPlaying]=useState(true);
 const [reduced,setReduced]=useState(false);
 const [ready,setReady]=useState(false);
 const ctl=useRef({playing:true,reduced:false,want:null as Kind|null});

 useEffect(()=>{
  const sec=root.current,lens=lensRef.current,view=viewRef.current;
  if(!sec||!lens||!view)return;
  const c=ctl.current;
  const mq=window.matchMedia('(prefers-reduced-motion: reduce)');
  const applyMq=()=>{c.reduced=mq.matches;setReduced(mq.matches);};
  applyMq();mq.addEventListener('change',applyMq);

  let W=0,H=0,R=0,mag=MAG_DESKTOP,phone=false,zone={top:0,h:0};
  let setH:number[]=[];
  const off=COLS.map((_,i)=>i*173+60);
  let tiles:HTMLElement[]=[];
  const measure=()=>{
   W=sec.clientWidth;H=sec.clientHeight;R=lens.offsetWidth/2;phone=W<768;mag=phone?MAG_PHONE:MAG_DESKTOP;
   view.style.width=`${W}px`;view.style.height=`${H}px`;
   setH=baseTracks.current.map(t=>{if(!t)return 1;const gap=parseFloat(getComputedStyle(t).rowGap)||0;return (t.offsetHeight+gap)/2||1;});
   const win=windowRef.current;
   if(win){const a=win.getBoundingClientRect(),b=sec.getBoundingClientRect();zone={top:a.top-b.top,h:a.height};}
   tiles=[...sec.querySelectorAll<HTMLElement>('.al-stage [data-tile]')];
  };
  measure();
  const ro=new ResizeObserver(measure);ro.observe(sec);
  setReady(true);

  // Where the lens wanders when nobody is steering it.
  const auto=(t:number)=>phone
   ?{x:W*(.5+.24*Math.sin(t*.00023)),y:zone.top+zone.h*.5+Math.max(0,zone.h/2-R*.85)*Math.sin(t*.00037+.9)}
   :(()=>{const x0=Math.max(W*.5,R+24),x1=Math.max(x0,W-R-24),y0=R*.75+90,y1=Math.max(y0,H-R-40);
     return{x:(x0+x1)/2+(x1-x0)/2*Math.sin(t*.00019),y:(y0+y1)/2+(y1-y0)/2*Math.sin(t*.00031+.8)};})();

  // Steering, strongest first: a held tile or tap point, then the mouse, then autopilot.
  // Pointer positions stay in viewport coordinates so the lens tracks the cursor while the page scrolls.
  type Hold={until:number;el?:HTMLElement;cx?:number;cy?:number;from?:{x:number;y:number}};
  let ptr:null|{cx:number;cy:number}=null,hold:Hold|null=null;
  const onMove=(e:PointerEvent)=>{
   if(e.pointerType!=='mouse')return;
   ptr={cx:e.clientX,cy:e.clientY};
   // A rail click holds the lens on a tile until the mouse clearly moves on.
   if(hold){hold.from??={x:e.clientX,y:e.clientY};if(Math.hypot(e.clientX-hold.from.x,e.clientY-hold.from.y)>80)hold=null;}
  };
  const onLeave=()=>{ptr=null;};
  const onDown=(e:PointerEvent)=>{
   if(e.pointerType==='mouse'||(e.target as Element).closest('a,button'))return;
   hold={until:performance.now()+5000,cx:e.clientX,cy:e.clientY};
  };
  const clampX=(v:number)=>Math.min(Math.max(v,R*.6),W-R*.6),clampY=(v:number)=>Math.min(Math.max(v,R*.6),H-R*.6);
  // Nearest tile of a discipline that the lens can sit on right now.
  const pick=(kind:Kind,r:DOMRect)=>{
   let best:HTMLElement|undefined,bd=Infinity;
   for(const el of tiles){
    if(TILES[Number(el.dataset.tile)]?.kind!==kind)continue;
    const b=el.getBoundingClientRect(),px=clampX(b.left-r.left+b.width/2),py=clampY(b.top-r.top+b.height/2);
    if(px<b.left-r.left||px>b.right-r.left||py<b.top-r.top||py>b.bottom-r.top)continue;
    const d=Math.hypot(px-x,py-y);if(d<bd){bd=d;best=el;}
   }
   return best;
  };
  sec.addEventListener('pointermove',onMove);sec.addEventListener('pointerleave',onLeave);sec.addEventListener('pointerdown',onDown);

  let lastY=window.scrollY,pushed=0;
  const onScroll=()=>{const y=window.scrollY;pushed+=y-lastY;lastY=y;};
  window.addEventListener('scroll',onScroll,{passive:true});

  let inView=true,visible=!document.hidden;
  const io=new IntersectionObserver(([e])=>{inView=e.isIntersecting;},{threshold:0});io.observe(sec);
  const onVis=()=>{visible=!document.hidden;};document.addEventListener('visibilitychange',onVis);

  const start=auto(0);let x=start.x,y=start.y,t=0,spin=0,last=performance.now(),lastRead=0,cur=-1,raf=0;
  const write=(now:number)=>{
   // Columns: odd columns run down, even columns run up.
   COLS.forEach((_,i)=>{
    const h=setH[i]||1,dir=i%2?1:-1;
    const o=((off[i]%h)+h)%h;
    const ty=dir<0?-o:o-h;
    const tf=`translate3d(0,${ty.toFixed(2)}px,0)`;
    const b=baseTracks.current[i],l=lensTracks.current[i];
    if(b)b.style.transform=tf;if(l)l.style.transform=tf;
   });
   lens.classList.toggle('is-flip',x>W-R*2.7);
   lens.style.transform=`translate3d(${(x-R).toFixed(2)}px,${(y-R).toFixed(2)}px,0)`;
   view.style.transform=`translate3d(${(R-x*mag).toFixed(2)}px,${(R-y*mag).toFixed(2)}px,0) scale(${mag})`;
   if(ringRef.current)ringRef.current.style.transform=`rotate(${spin.toFixed(2)}deg)`;
   if(now-lastRead>160){
    lastRead=now;
    const r=sec.getBoundingClientRect(),px=x+r.left,py=y+r.top;
    for(const el of tiles){
     const b=el.getBoundingClientRect();
     if(px>=b.left&&px<=b.right&&py>=b.top&&py<=b.bottom){const id=Number(el.dataset.tile);if(id!==cur){cur=id;setActive(id);}break;}
    }
   }
  };
  const frame=(now:number)=>{
   const dt=Math.min(now-last,64);last=now;
   if(inView&&visible){
    const still=c.reduced||!c.playing;
    if(!still)t+=dt;
    const r=sec.getBoundingClientRect();
    if(c.want){const el=pick(c.want,r);c.want=null;if(el)hold={until:now+7000,el};}
    let target:{x:number;y:number}|null=null;
    if(hold&&now<hold.until){
     if(hold.el){
      const b=hold.el.getBoundingClientRect(),px=clampX(b.left-r.left+b.width/2),py=clampY(b.top-r.top+b.height/2);
      if(px>=b.left-r.left&&px<=b.right-r.left&&py>=b.top-r.top&&py<=b.bottom-r.top)target={x:px,y:py};
     }else target={x:(hold.cx??0)-r.left,y:(hold.cy??0)-r.top};
    }
    if(!target)hold=null;
    const steer=hold?'hold':ptr?'ptr':'auto';
    target??=ptr?{x:ptr.cx-r.left,y:ptr.cy-r.top}:auto(t);
    const k=c.reduced?1:1-Math.exp(-dt/(steer==='ptr'?90:steer==='hold'?260:380));
    const nx=x+(target.x-x)*k,ny=y+(target.y-y)*k;
    spin+=(nx-x)*.35;x=nx;y=ny;
    const push=c.reduced?0:pushed*SCROLL_PUSH;pushed=0;
    for(let i=0;i<off.length;i++)off[i]+=(still?0:dt*DRIFT*(1+i%3*.18))+push;
    write(now);
   }else pushed=0;
   raf=requestAnimationFrame(frame);
  };
  raf=requestAnimationFrame(frame);
  return()=>{cancelAnimationFrame(raf);ro.disconnect();io.disconnect();mq.removeEventListener('change',applyMq);
   sec.removeEventListener('pointermove',onMove);sec.removeEventListener('pointerleave',onLeave);sec.removeEventListener('pointerdown',onDown);
   window.removeEventListener('scroll',onScroll);document.removeEventListener('visibilitychange',onVis);};
 },[]);
 useEffect(()=>{ctl.current.playing=playing;},[playing]);

 // Glide the lens to the nearest tile of a discipline; the animation loop follows that tile for a few seconds.
 const focusKind=(kind:Kind)=>{ctl.current.want=kind;};

 const tile=TILES[active];
 const line=(text:React.ReactNode,l:number)=><span className="al-line" style={{'--l':l} as CSSProperties}><span>{text}</span></span>;

 return <section className={`adlab-lens${ready?' is-ready':''}${playing&&!reduced?' is-playing':''}`} ref={root} data-theme="dark" aria-labelledby="adlab-title" data-kind={tile.kind}>
  <div className="al-stage" aria-hidden="true"><Wall lens={false} tracks={baseTracks}/></div>
  <div className="al-shade" aria-hidden="true"/>

  <div className="al-lens" ref={lensRef} aria-hidden="true">
   <div className="al-lens-glass">
    <div className="al-lens-view" ref={viewRef}>{ready&&<Wall lens tracks={lensTracks}/>}</div>
    <i className="al-lens-sheen"/>
    <i className="al-lens-cross"/>
   </div>
   <svg className="al-ring" ref={ringRef} viewBox="0 0 240 240">
    <defs><path id="al-ring-path" d="M120,120 m-109,0 a109,109 0 1,1 218,0 a109,109 0 1,1 -218,0"/></defs>
    <circle cx="120" cy="120" r="117" className="al-ring-ticks"/>
    <text><textPath href="#al-ring-path" textLength="684" lengthAdjust="spacing">Pamsika AdLab · Strategy · Film · Social · Design · Look closer · </textPath></text>
   </svg>
   <span className="al-lens-tag" key={active}><b>{KIND_N[tile.kind]} · {tile.kind}</b>{tile.work}</span>
  </div>

  <div className="al-hud container" aria-hidden="true">
   <span className="al-hud-rec"><i/>AdLab lens<span className="al-hud-mag"> · {MAG_DESKTOP}×</span></span>
   <span className="al-hud-note">Illustrative concepts</span>
   <span className="al-hud-hint"><span className="fine">Move to look closer</span><span className="coarse">Tap to look closer</span></span>
  </div>

  <div className="al-body container">
   <div className="al-window" ref={windowRef} aria-hidden="true"/>
   <div className="al-copy">
    <Logo kind="adlab" dark width={208}/>
    <p className="al-kicker">Creativity with a business purpose</p>
    <h1 id="adlab-title">{line('Malawian stories.',0)}{line('World-class',1)}{line(<span className="accent-text">commercials.</span>,2)}</h1>
    <p className="al-lead">Every business already holds a great campaign. AdLab finds it in your everyday and shapes it into strategy, film, social and design that make people choose you.</p>
    <div className="actions"><ButtonLink href="/start-a-campaign" variant="accent" track="Start a campaign (AdLab hero)">Start a campaign</ButtonLink><TextLink href="/work">Explore the ideas</TextLink></div>
   </div>
   <div className="al-foot">
    <p className="al-foot-label">What AdLab makes</p>
    <ol className="al-rail">{KINDS.map(k=><li key={k.key}><button type="button" onClick={()=>focusKind(k.key)} aria-current={tile.kind===k.key?'true':undefined} aria-label={`${k.title}: ${k.text}. Move the lens to ${k.title.toLowerCase()} work`}>
     <span className="al-rail-n">{k.n}</span><span className="al-rail-t">{k.title}</span><span className="al-rail-d">{k.text}</span>
    </button></li>)}</ol>
    {!reduced&&<button type="button" className="al-toggle" onClick={()=>setPlaying(p=>!p)} aria-label={playing?'Pause the moving background':'Play the moving background'}>{playing?<Pause size={16} aria-hidden/>:<Play size={16} aria-hidden/>}</button>}
   </div>
  </div>
 </section>;
}
