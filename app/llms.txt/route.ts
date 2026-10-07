import {faqs} from '@/lib/faq.mjs';
import {marketServices} from '@/lib/market-services.mjs';
import {SITE_URL} from '@/lib/site';
export const dynamic='force-static';
/** Plain-text guide for AI assistants and answer engines (llmstxt.org). */
export function GET(){
 const u=(p:string)=>`${SITE_URL}${p}`;
 const body=`# Pamsika

> Pamsika is an AI-powered African business growth platform with a Malawian creative focus. Pamsika AdLab creates advertising campaigns and commercials (strategy, AI-assisted production, social content). Creative Market matches businesses with creative services such as photography, design, film, writing, sound and motion, and accepts creator applications. AI Business Studio is a future offering.

Pricing is quoted per project after a brief; there is no public price list, online booking or payment on the website. Work shown under "Work" is clearly labelled illustrative concepts, not client case studies.

## Key pages
- [Home](${u('/')}): overview of AdLab and Creative Market
- [AdLab](${u('/adlab/')}): campaigns and commercial production
- [Creative Market](${u('/creative-market/')}): creative disciplines and matching
- [Services](${u('/services/')}): campaign services in detail
- [Work](${u('/work/')}): illustrative creative directions
- [FAQ](${u('/faq/')}): ${faqs.length} plain-language answers
- [Start a campaign](${u('/start-a-campaign/')}): campaign brief form
- [Request a creative match](${u('/creative-market/request/')}): Creative Market brief form
- [Join as a creator](${u('/creative-market/join/')}): creator application
- [Contact](${u('/contact/')})

## Creative Market disciplines
${marketServices.map(s=>`- [${s.title}](${u(`/creative-market/${s.slug}/`)}): ${s.summary}`).join('\n')}

## Frequently asked questions
${faqs.map(f=>`### ${f.question}\n${f.answer}`).join('\n\n')}
`;
 return new Response(body,{headers:{'Content-Type':'text/plain; charset=utf-8'}});
}
