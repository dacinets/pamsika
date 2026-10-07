import type {MetadataRoute} from 'next';
import {marketServices} from '@/lib/market-services.mjs';
import {campaigns} from '@/lib/campaigns';
import {SITE_URL} from '@/lib/site';
export const dynamic='force-static';
export default function sitemap():MetadataRoute.Sitemap{
 const core=['','/adlab','/creative-market','/work','/services','/faq','/about','/contact','/start-a-campaign','/adapt-an-idea','/creative-market/request','/creative-market/join'];
 const paths=[...core,...campaigns.map(c=>`/work/${c.slug}`),...marketServices.map(s=>`/creative-market/${s.slug}`)];
 return paths.map(p=>({url:`${SITE_URL}${p}/`,changeFrequency:p===''?'weekly':'monthly',priority:p===''?1:core.includes(p)?0.8:0.6}));
}
