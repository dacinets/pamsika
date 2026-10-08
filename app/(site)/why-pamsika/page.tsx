import type {CSSProperties} from 'react';
import {ButtonLink,CTA,TextLink} from '@/components/site/UI';
import {StockImage} from '@/components/site/StockImage';
import {Breadcrumbs} from '@/components/site/StructuredData';
import {Scrub} from '@/components/why/Scrub';
import {pageMetadata} from '@/lib/site';

export const metadata=pageMetadata('Why Pamsika','Why Pamsika exists: African ambition deserves a bigger stage. Creativity, technology and local intelligence, working for the businesses moving Africa forward.','/why-pamsika');

const MANIFESTO='Great businesses across Africa are built on grit, taste and local knowledge. Yet the ideas, the creative quality and the technology that make a business impossible to ignore can feel out of reach. Pamsika exists to close that gap.';
const HIGHLIGHT=new Set(['close','that','gap.']);

const PRINCIPLES:[string,string,string,string][]=[
 ['01','Business comes first','Creative work has a job to do. We start with your goals and keep them in view.','strategy-session'],
 ['02','Culture has meaning','Local understanding shapes the story. We aim for relevance without shortcuts or stereotypes.','market-day'],
 ['03','People lead technology','Tools expand what is possible. Human judgment keeps the work purposeful, credible and clear.','interview-shoot'],
];

const PROMISES:[string,string][]=[
 ['We start with the goal.','Bring the business problem, not a finished brief. The work is shaped around what you need to change.'],
 ['We call a concept a concept.','Illustrative work is labelled as illustrative. Nothing is passed off as client work or proof of results.'],
 ['We agree before we make.','Scope, cost, timing, usage and revisions are settled before work begins.'],
 ['We don’t sell guarantees.','We won’t promise views, leads or sales we can’t control. We will promise considered, purposeful work.'],
];

const words=MANIFESTO.split(' ');

export default function WhyPamsika(){return <>
 <Breadcrumbs items={[['Why Pamsika','/why-pamsika']]}/>
 <Scrub/>

 {/* 1 · A bigger stage: the frame opens to full bleed as you scroll */}
 <section className="why-stage" data-scrub="pin" data-theme="dark" aria-labelledby="why-title">
  <div className="why-stage-pin">
   <div className="why-stage-frame" aria-hidden="true">
    <StockImage name="lake-malawi" sizes="100vw" priority position="center 62%"/>
    <span className="why-stage-caption">Lake Malawi at sunset</span>
   </div>
   <div className="why-stage-shade" aria-hidden="true"/>
   <div className="why-stage-copy container">
    <p className="why-kicker">Why Pamsika</p>
    <h1 id="why-title"><span className="why-l1">African ambition</span> <span className="why-l2">deserves a</span> <span className="why-l3">bigger stage.</span></h1>
    <p className="why-stage-lead">We believe great businesses should have access to the ideas, creative quality and technology that help them move forward.</p>
   </div>
   <span className="why-scrollcue" aria-hidden="true">Scroll</span>
  </div>
 </section>

 {/* 2 · The gap, read word by word */}
 <section className="why-manifesto" data-scrub="pin" data-theme="dark" aria-labelledby="why-gap">
  <div className="why-manifesto-pin container">
   <p className="why-kicker" id="why-gap">The gap we close</p>
   <p className="why-manifesto-text" style={{'--n':words.length} as CSSProperties}>
    {words.map((w,i)=><span key={i} className={HIGHLIGHT.has(w)&&i>words.length-4?'is-hot':undefined} style={{'--i':i} as CSSProperties}>{w} </span>)}
   </p>
  </div>
 </section>

 {/* 3 · Where three things meet */}
 <section className="section why-meet container" data-scrub="enter" aria-labelledby="why-meet">
  <div className="why-meet-copy">
   <p className="why-kicker">Where it comes together</p>
   <h2 id="why-meet">Three strengths. One move forward.</h2>
   <p className="lead">Pamsika is an AI-powered African business growth platform working at the intersection of business, creativity, technology, media and culture.</p>
   <p>We bring modern creative tools together with human understanding to help businesses communicate clearly, market effectively and compete at a higher standard.</p>
  </div>
  <div className="why-venn" aria-hidden="true">
   <span className="why-ring" data-ring="a"><b>Creativity</b></span>
   <span className="why-ring" data-ring="b"><b>Technology</b></span>
   <span className="why-ring" data-ring="c"><b>Local<br/>intelligence</b></span>
   <span className="why-core">Ideas that<br/>move business.</span>
  </div>
 </section>

 {/* 4 · What guides us */}
 <section className="section why-principles" data-theme="dark" aria-labelledby="why-guides">
  <div className="container">
   <div className="why-head"><p className="why-kicker">What guides us</p><h2 id="why-guides">Ambitious work.<br/>Grounded thinking.</h2></div>
   <ol className="why-panels">
    {PRINCIPLES.map(([n,title,text,img])=><li key={n} className="why-panel" tabIndex={0}>
     <StockImage name={img} sizes="(max-width:900px) 92vw, 46vw" className="why-panel-img"/>
     <span className="why-panel-n" aria-hidden="true">{n}</span>
     <div className="why-panel-body"><h3>{title}</h3><p>{text}</p></div>
    </li>)}
   </ol>
  </div>
 </section>

 {/* 5 · Promises */}
 <section className="section why-promises container" aria-labelledby="why-promise">
  <div className="why-head"><p className="why-kicker">How we work with you</p><h2 id="why-promise">Clear terms.<br/>Honest work.</h2></div>
  <ul>
   {PROMISES.map(([title,text],i)=><li key={title} data-reveal style={{'--d':i} as CSSProperties}><span className="why-promise-n">0{i+1}</span><h3>{title}</h3><p>{text}</p></li>)}
  </ul>
 </section>

 {/* 6 · Two ways in */}
 <section className="section why-routes" data-theme="dark" aria-labelledby="why-routes">
  <div className="container">
   <div className="why-head"><p className="why-kicker">Two ways in</p><h2 id="why-routes">Start where your business is.</h2></div>
   <div className="why-route-grid">
    <article className="why-route">
     <StockImage name="production-crew" sizes="(max-width:900px) 92vw, 46vw" className="why-route-img"/>
     <div className="why-route-body">
      <p className="why-route-label">Pamsika AdLab</p>
      <h3>A campaign, from idea to production.</h3>
      <p>Creative strategy, commercial production, social campaigns and brand design, shaped around a business goal.</p>
      <div className="actions"><ButtonLink href="/adlab" variant="accent">Explore AdLab</ButtonLink></div>
     </div>
    </article>
    <article className="why-route">
     <StockImage name="creator-painter" sizes="(max-width:900px) 92vw, 46vw" className="why-route-img"/>
     <div className="why-route-body">
      <p className="why-route-label">Creative Market</p>
      <h3>The right craft for your project.</h3>
      <p>Film, design, photography, writing, sound and motion. Describe the need and we explore the right creative support.</p>
      <div className="actions"><ButtonLink href="/creative-market" variant="glass">Explore Creative Market</ButtonLink></div>
     </div>
    </article>
   </div>
   <p className="why-routes-note">Not sure which fits? <TextLink href="/faq?view=guide">Let the guide help you choose</TextLink></p>
  </div>
 </section>

 <CTA title="Your ambition deserves a bigger stage. Let’s build it."/>
</>;}
