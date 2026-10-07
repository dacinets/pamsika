import {MarketBrief} from '@/components/market/MarketBrief';
import {pageMetadata} from '@/lib/site';
export const metadata=pageMetadata('Join Creative Market','Apply to the Pamsika Creative Market network. Share your creative disciplines, location and portfolio for review.','/creative-market/join');
export default function JoinMarket(){return <MarketBrief creator/>}
