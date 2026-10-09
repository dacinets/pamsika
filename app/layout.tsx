import type {Metadata,Viewport} from 'next';
import {SiteStructuredData} from '@/components/site/StructuredData';
import {ALLOW_INDEXING,SITE_URL} from '@/lib/site';
import {THEME_KEY} from '@/lib/theme';
import './globals.css';
import './redesign.css';
import './showcase.css';
import './hero-film.css';
import './adlab-lens.css';
import './why.css';
import './case-study.css';
import './market-hero.css';
import './market-explore.css';
import './light-theme.css';
export const metadata:Metadata={metadataBase:new URL(SITE_URL),title:{default:'Pamsika — Ideas that move business.',template:'%s | Pamsika'},description:'An AI-powered African business growth platform. Explore AdLab campaigns, Creative Market services and a clear guide to your next business move.',applicationName:'Pamsika',robots:ALLOW_INDEXING?{index:true,follow:true,'max-image-preview':'large'}:{index:false,follow:false},icons:{icon:'/favicon.svg',apple:'/apple-touch-icon.png'},openGraph:{siteName:'Pamsika',type:'website',locale:'en_GB',images:[{url:'/og/default.jpg',width:1200,height:630}]},twitter:{card:'summary_large_image'},formatDetection:{telephone:false}};
// Runs before first paint: applies the visitor's stored theme so a light-theme
// visitor never sees a flash of dark. Dark stays the default for everyone else,
// and the /admin dashboard always stays dark.
const THEME_BOOT=`(function(d){d.classList.add('js');try{if(location.pathname.indexOf('/admin')>-1)return;var t=localStorage.getItem('${THEME_KEY}');if(t==='light'||t==='dark')d.setAttribute('data-theme',t)}catch(e){}})(document.documentElement)`;
export const viewport:Viewport={themeColor:'#05080f',colorScheme:'dark'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" data-theme="dark" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:THEME_BOOT}}/><SiteStructuredData/></head><body>{children}</body></html>}
