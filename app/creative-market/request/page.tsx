import {MarketBrief} from '@/components/market/MarketBrief';
import {pageMetadata} from '@/lib/site';
export const metadata=pageMetadata('Request a creative match','Share your project brief with Pamsika Creative Market and explore the creative skills your business needs.','/creative-market/request');
export default function RequestMatch(){return <MarketBrief/>}
