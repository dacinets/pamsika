import {ButtonLink,CTA,Eyebrow,SectionHeading,TextLink} from '@/components/site/UI';
import {Logo} from '@/components/brand/Logo';
import {StockImage} from '@/components/site/StockImage';
import {HeroShowcase} from '@/components/home/HeroShowcase';
import {HeroFilm} from '@/components/home/HeroFilm';
import {JsonLd} from '@/components/site/StructuredData';
import {ArrowUpRight,AudioLines,Camera,Clapperboard,Lightbulb,MessageCircleQuestion,MoveUpRight,PenTool,Plus,TrendingUp,Type} from 'lucide-react';
import {marketServices} from '@/lib/market-services.mjs';
import {faqs} from '@/lib/faq.mjs';
import {pageMetadata} from '@/lib/site';

export const metadata=pageMetadata('Ideas that move business.','Grow with Pamsika AdLab campaigns and Creative Market services: creativity, AI-powered production and African cultural intelligence.','/');

const disciplineIcons:Record<string,typeof Camera>={'film-and-video':Clapperboard,'design-and-branding':PenTool,photography:Camera,'writing-and-content':Type,'sound-and-voice':AudioLines,'animation-and-motion':MoveUpRight};
const homeAnswers=['what-is-pamsika','choose-an-offering','pricing','ai-production'].map(id=>faqs.find(item=>item.id===id)!).filter(Boolean);

export default function Home(){return <>
<JsonLd data={{'@context':'https://schema.org','@type':'FAQPage',mainEntity:homeAnswers.map(item=>({'@type':'Question',name:item.question,acceptedAnswer:{'@type':'Answer',text:item.answer}}))}}/>

<HeroFilm/>

<div className="marquee" aria-hidden="true"><div className="marquee-track">{[0,1].flatMap(copy=>['Business meets possibility','Strategy','Creativity','Technology','Culture','Malawian stories','World-class commercials'].map(word=><span key={word+copy}>{word}</span>))}</div></div>

<section className="section container story-section">
 <div className="story-grid">
  <div data-reveal>
   <Eyebrow>How Pamsika works</Eyebrow>
   <h2 style={{marginTop:22}}>From one idea to a <span className="accent-text">business that moves.</span></h2>
   <p className="lead">Bring the ambition. Creative Market finds the craft it needs, AdLab turns it into a campaign, and the work goes out to the people who matter to your business.</p>
   <div className="actions" style={{marginTop:32}}><ButtonLink href="/services" variant="glass">Explore our services</ButtonLink></div>
  </div>
  <div data-reveal><HeroShowcase/></div>
 </div>
</section>

<section className="section container" id="our-offerings">
 <SectionHeading eyebrow="One platform. Growing possibilities." title="Start with the idea. Grow from there." description="Two ways to move your business forward: AdLab for a campaign from idea to execution, and Creative Market for the creative skills your project needs."/>
 <div className="offer-grid">
  <article className="offer-card" data-reveal>
   <img src="/media/citrus-1280.webp" srcSet="/media/citrus-640.webp 640w, /media/citrus-1280.webp 1280w, /media/citrus-1672.webp 1672w" sizes="(max-width:1023px) 100vw, 56vw" width="1672" height="941" alt="Illustrative product campaign: a chilled citrus drink in dramatic studio light" loading="lazy"/>
   <div className="offer-panel glass">
    <Logo kind="adlab" dark width={190}/>
    <h3>Malawian stories.<br/>World-class commercials.</h3>
    <p>From the first insight to the final frame: original concepts, AI-assisted commercial production and locally relevant campaigns.</p>
    <div className="offer-tags"><span>Brand films</span><span>Product campaigns</span><span>Social content</span></div>
    <div className="actions"><ButtonLink href="/adlab" variant="accent" track="Explore AdLab (home)">Explore AdLab</ButtonLink><TextLink href="/work">See the ideas</TextLink></div>
   </div>
  </article>
  <article className="offer-card" data-reveal>
   <StockImage name="creator-painter" sizes="(max-width:1023px) 100vw, 44vw" position="40% center"/>
   <div className="offer-panel glass">
    <p className="eyebrow">Creative Market</p>
    <h3>The craft behind your next move.</h3>
    <p>Find a starting point for your project, from photography and design to writing, sound and motion. Share a brief to explore a creative match.</p>
    <div className="actions"><ButtonLink href="/creative-market" track="Explore Creative Market (home)">Explore the market</ButtonLink><TextLink href="/creative-market/join">For creators</TextLink></div>
   </div>
  </article>
 </div>
 <div className="offer-future glass" data-reveal><div><strong>AI Business Studio</strong><p>Practical AI tools for African businesses, built on the same platform.</p></div><span className="quiet-label">Future offering</span></div>
</section>

<section className="section container">
 <div className="feature-v2">
  <figure className="feature-media" data-reveal><StockImage name="tailor" sizes="(max-width:1023px) 92vw, 52vw" position="60% center"/><figcaption className="glass">Made for the people behind the business</figcaption></figure>
  <div className="feature-copy-v2" data-reveal>
   <Eyebrow>More than a good-looking ad</Eyebrow>
   <h2>Built around <span className="accent-text">your</span> business.</h2>
   <p className="lead">A clear idea, the right creative expression and a practical path to market. Technology expands the possibilities. Human judgment gives it purpose.</p>
   <div className="actions"><ButtonLink href="/services" variant="glass">Explore our services</ButtonLink></div>
  </div>
 </div>
 <div className="service-grid" style={{marginTop:56}}>
  {[{Icon:Lightbulb,n:'01',title:'Find the idea',text:'Turn your business challenge into a focused creative direction. We start with your audience and the action you want them to take.'},{Icon:Clapperboard,n:'02',title:'Make it matter',text:'Bring the idea to life through film, design and content, with AI-assisted production guided by people.'},{Icon:TrendingUp,n:'03',title:'Move it forward',text:'Shape the campaign for the places your audience spends time, with formats and messaging that work together.'}].map(({Icon,n,title,text})=><article className="service-card" key={n} data-reveal><div className="card-top"><Icon size={28} strokeWidth={1.6} aria-hidden/><span>{n}</span></div><h3>{title}</h3><p>{text}</p></article>)}
 </div>
</section>

<section className="section surface-secondary">
 <div className="container">
  <SectionHeading eyebrow="Creative Market" title="What does your idea need?" description="Start with a specific discipline, or combine several around your project." action={<TextLink href="/creative-market">All disciplines</TextLink>}/>
  <div className="discipline-grid">
   {marketServices.map(service=>{const Icon=disciplineIcons[service.slug]??Camera;return <a className="discipline-tile glass lift" href={`/creative-market/${service.slug}/`} key={service.slug} data-reveal data-track={`Discipline: ${service.title}`}><StockImage name={service.image} className="tile-photo" sizes="(max-width:767px) 92vw, (max-width:1023px) 46vw, 30vw"/><span className="tile-top"><Icon size={26} strokeWidth={1.5} aria-hidden/><ArrowUpRight size={20} aria-hidden/></span><span><strong>{service.title}</strong><small>{service.summary}</small></span></a>})}
  </div>
 </div>
</section>

<section className="section container">
 <div className="answers-v2">
  <div data-reveal>
   <Eyebrow>Straight answers</Eyebrow>
   <h2 style={{marginTop:22}}>Ask in your own words.</h2>
   <p className="lead" style={{marginTop:22}}>The questions businesses ask us most, answered plainly. Search {faqs.length} answers or let the guide point you to the right next step.</p>
   <a className="ask-box glass lift" href="/faq/" data-track="Ask a question (home)"><MessageCircleQuestion size={22} aria-hidden/><span>How much does a campaign cost?</span><ArrowUpRight size={18} aria-hidden/></a>
  </div>
  <div className="answer-list" data-reveal>
   {homeAnswers.map((item,i)=><details className="glass" key={item.id} open={i===0}><summary>{item.question}<Plus size={20} aria-hidden/></summary><p>{item.answer}</p></details>)}
  </div>
 </div>
</section>

<CTA/>
</>}
