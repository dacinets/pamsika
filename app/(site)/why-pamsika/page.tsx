import type {CSSProperties} from 'react';
import {ButtonLink,TextLink} from '@/components/site/UI';
import {StockImage} from '@/components/site/StockImage';
import {Breadcrumbs} from '@/components/site/StructuredData';
import {Scrub} from '@/components/why/Scrub';
import {pageMetadata} from '@/lib/site';

export const metadata=pageMetadata('Why Pamsika','Local talent. Greater possibility. Pamsika exists to elevate Malawi’s creative economy by connecting local talent with world-class creative standards.','/why-pamsika');

const BELIEF='When businesses tell stronger stories, and creators have opportunities to contribute, more becomes possible for both.';
const HOT=new Set(['both.']);

/** Eight reasons, from the original Why Pamsika page. */
const REASONS:{title:string;line:string;text:string;img:string;pos?:string}[]=[
 {title:'Promoting local creators',line:'Talent deserves to be seen and valued.',text:'Malawi is home to gifted videographers, photographers, designers and storytellers. Pamsika gives qualified creators a route into business projects that need their skills. By selecting for craft, professionalism and work ethic, we aim to raise creative standards while recognising the people behind the work.',img:'creator-painter',pos:'50% 35%'},
 {title:'Creating opportunities to earn',line:'Every project can open a door.',text:'Our model creates opportunities for independent creators to contribute to paid, project-based work. When a campaign needs local filming, photography or content capture, Pamsika brings suitable approved talent into the production. We want more creative ambition to become meaningful economic participation.',img:'production-crew'},
 {title:'Sharing international work standards',line:'Better processes help talent grow.',text:'Clear briefs, structured production, creative feedback and quality reviews are part of how Pamsika works. Creators gain practical exposure to demanding professional workflows through collaboration. Our ambition is to help local talent refine its craft and build confidence for opportunities at home and beyond Malawi.',img:'strategy-session',pos:'50% 40%'},
 {title:'Building a modern creative ecosystem',line:'Business growth and creative opportunity belong together.',text:'Pamsika connects strategic leadership, technology and local production talent in one coordinated model. AdLab develops the campaign; Creative Market supports its execution through a curated network. We want stronger businesses to create more demand for quality creative work, helping the wider industry grow.',img:'creative-team'},
 {title:'Empowering collaboration',line:'Great work gives everyone a part to play.',text:'Pamsika brings the brief, guidance and creative direction. Independent creators contribute their specialist skills and local knowledge. Pamsika then handles post-production, quality control and final assembly. Shared standards and clearly defined roles help different talents build something stronger together.',img:'interview-shoot'},
 {title:'Helping Malawian businesses grow',line:'Creative work should move a business forward.',text:'A strong campaign starts with a business challenge: being understood, reaching the right audience or giving people a reason to choose you. Pamsika brings strategy and creative execution together around that challenge, so the work has a clear purpose from the first idea to the final delivery.',img:'shopkeeper'},
 {title:'Keeping local identity at the centre',line:'Our stories should sound and feel like us.',text:'World-class standards can coexist with a distinctly Malawian voice. Local creators bring understanding of the places, languages and everyday experiences that shape a story. We aim to build campaigns that respect this context and express Malawi’s culture, creativity and ambition without relying on stereotypes.',img:'portrait-blue',pos:'50% 30%'},
 {title:'Using AI with human purpose',line:'Technology should expand what people can create.',text:'AI can help us explore ideas, develop creative directions and support production. Human judgement guides the strategy, cultural choices and final quality. Pamsika combines these tools with local talent so technology supports thoughtful creative work and the people who make it possible.',img:'animation'},
];

const words=BELIEF.split(' ');

export default function WhyPamsika(){return <>
 <Breadcrumbs items={[['Why Pamsika','/why-pamsika']]}/>
 <Scrub/>

 {/* 1 · Local talent, greater possibility: the frame opens to full bleed as you scroll */}
 <section className="why-stage" data-scrub="pin" data-theme="dark" aria-labelledby="why-title">
  <div className="why-stage-pin">
   <div className="why-stage-frame" aria-hidden="true">
    <StockImage name="creative-team" sizes="100vw" priority position="center 40%"/>
   </div>
   <div className="why-stage-shade" aria-hidden="true"/>
   <div className="why-stage-copy container">
    <p className="why-kicker">Why Pamsika</p>
    <h1 id="why-title"><span className="why-l1">Local talent.</span> <span className="why-l3">Greater possibility.</span></h1>
    <p className="why-stage-lead">We exist to elevate Malawi’s creative economy by connecting local talent with world-class creative standards. Empowerment, collaboration and opportunity shape how we work.</p>
   </div>
   <span className="why-scrollcue" aria-hidden="true">Scroll</span>
  </div>
 </section>

 {/* 2 · Our belief, read word by word */}
 <section className="why-manifesto" data-scrub="pin" data-theme="dark" aria-labelledby="why-belief">
  <div className="why-manifesto-pin container">
   <p className="why-kicker">Our belief</p>
   <h2 className="why-belief-title" id="why-belief">Malawi’s ambition deserves exceptional creative work.</h2>
   <p className="why-manifesto-text" style={{'--n':words.length} as CSSProperties}>
    {words.map((w,i)=><span key={i} className={HOT.has(w)?'is-hot':undefined} style={{'--i':i} as CSSProperties}>{w} </span>)}
   </p>
  </div>
 </section>

 {/* 3 · Built around that connection */}
 <section className="section why-meet container" data-scrub="enter" aria-labelledby="why-connection">
  <div className="why-meet-copy">
   <p className="why-kicker">Built around that connection</p>
   <h2 id="why-connection">One platform. Two ambitions.</h2>
   <p className="lead">Pamsika is a premium creative intelligence platform built around that connection.</p>
   <p>We lead the strategy and creative vision, work with vetted independent creators, and take responsibility for the finished campaign.</p>
   <TextLink href="/about">See how Pamsika works</TextLink>
  </div>
  <div className="why-venn" aria-hidden="true">
   <span className="why-ring" data-ring="a"><b>Businesses<small>Stronger stories</small></b></span>
   <span className="why-ring" data-ring="b"><b>Creators<small>Room to contribute</small></b></span>
   <span className="why-core">Pamsika</span>
  </div>
 </section>

 {/* 4 · What drives us: eight reasons, a horizontal reel on wide screens */}
 <section className="why-drive" data-scrub="pin" data-theme="dark" aria-labelledby="why-drives">
  <div className="why-drive-pin">
   <div className="why-drive-track">
    <header className="why-drive-intro">
     <p className="why-kicker">What drives us</p>
     <h2 id="why-drives">Eight reasons to build differently.</h2>
     <span className="why-drive-hint" aria-hidden="true">Keep scrolling</span>
    </header>
    <ol className="why-reasons">
     {REASONS.map((r,i)=><li className="why-reason" key={r.title}>
      <div className="why-reason-media"><StockImage name={r.img} sizes="(max-width:899px) 92vw, 34vw" position={r.pos}/></div>
      <div className="why-reason-body">
       <span className="why-reason-n" aria-hidden="true">{String(i+1).padStart(2,'0')}</span>
       <h3><span>{r.title}</span>{r.line}</h3>
       <p>{r.text}</p>
      </div>
     </li>)}
    </ol>
   </div>
   <div className="why-drive-progress" aria-hidden="true"><i/></div>
  </div>
 </section>

 {/* 5 · Opportunity with clarity */}
 <section className="section why-clarity container" aria-labelledby="why-clarity">
  <div>
   <p className="why-kicker">Opportunity with clarity</p>
   <h2 id="why-clarity">A shared ambition. A clear commitment.</h2>
  </div>
  <div className="why-clarity-body">
   <p className="lead">We aim to create lasting value through the quality of the work and the way people collaborate.</p>
   <p>These are the principles we are building towards. Creator approval is selective, and assignments depend on the needs of each project. A listing does not guarantee work. Scope, compensation and expectations are agreed before an assignment begins.</p>
   <TextLink href="/faq#creator-approval">Understand creator opportunities</TextLink>
  </div>
 </section>

 {/* 6 · Be part of what comes next */}
 <section className="section why-routes" data-theme="dark" aria-labelledby="why-next">
  <div className="container">
   <div className="why-head"><p className="why-kicker">Be part of what comes next</p><h2 id="why-next">Bring your ambition. Bring your craft.</h2><p className="why-head-sub">Build a campaign with Pamsika, or apply to contribute your skills to our creator network.</p></div>
   <div className="why-route-grid">
    <article className="why-route">
     <StockImage name="vendor-phone" sizes="(max-width:900px) 92vw, 46vw" className="why-route-img"/>
     <div className="why-route-body">
      <p className="why-route-label">For businesses</p>
      <h3>Build a campaign with Pamsika.</h3>
      <div className="actions"><ButtonLink href="/start-a-campaign" variant="accent" track="Start a campaign (Why Pamsika)">Start a campaign</ButtonLink></div>
     </div>
    </article>
    <article className="why-route">
     <StockImage name="photography" sizes="(max-width:900px) 92vw, 46vw" className="why-route-img"/>
     <div className="why-route-body">
      <p className="why-route-label">For creators</p>
      <h3>Contribute your craft to our creator network.</h3>
      <div className="actions"><ButtonLink href="/creative-market/join" variant="glass" track="Apply as a creator (Why Pamsika)">Apply as a creator</ButtonLink></div>
     </div>
    </article>
   </div>
  </div>
 </section>
</>;}
