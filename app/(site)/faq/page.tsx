import {FaqExplorer} from '@/components/faq/FaqExplorer';
import {Eyebrow,TextLink} from '@/components/site/UI';
import {faqs} from '@/lib/faq.mjs';
import {pageMetadata} from '@/lib/site';
export const metadata=pageMetadata('FAQ & getting started','Understand Pamsika, compare AdLab and Creative Market, find answers about costs, AI and applications, and choose your next step.','/faq');
export default function FAQ(){const structuredData={'@context':'https://schema.org','@type':'FAQPage',mainEntity:faqs.map(item=>({'@type':'Question',name:item.question,acceptedAnswer:{'@type':'Answer',text:item.answer}}))};return <>
<section className="container faq-page"><header className="faq-intro"><Eyebrow>FAQ & getting started</Eyebrow><h1>A little clarity.<br/><span>A confident next move.</span></h1><p>Pamsika helps businesses turn ideas into creative work. AdLab brings your campaign together. Creative Market helps you find the craft your project needs.</p></header><FaqExplorer/><noscript><style>{'.faq-workspace{display:none}'}</style><section><h2>Questions and answers</h2>{faqs.map(item=><article key={item.id} id={item.id}><h3>{item.question}</h3><p>{item.answer}</p><p><a href={item.href}>{item.action}</a></p></article>)}</section></noscript></section>
<section className="faq-contact surface-secondary"><div className="container"><div><Eyebrow>Something specific?</Eyebrow><h2>Make the next step yours.</h2><p>For a project question the guide doesn’t cover, include the details that matter in your brief or enquiry.</p></div><TextLink href="/contact">Contact Pamsika</TextLink></div></section><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData).replace(/</g,'\\u003c')}}/>
</>}
