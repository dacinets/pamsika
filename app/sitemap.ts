import type {MetadataRoute} from 'next';
import {marketServices} from '@/lib/market-services.mjs';
import {SITE_URL} from '@/lib/site';
export default function sitemap():MetadataRoute.Sitemap{return ['','/faq','/adlab','/work','/services','/adapt-an-idea','/start-a-campaign','/about','/contact','/work/made-of-ambition','/work/a-fresh-perspective','/creative-market','/creative-market/request','/creative-market/join',...marketServices.map(service=>`/creative-market/${service.slug}`)].map(p=>({url:SITE_URL+p}));}
