import type {Metadata} from 'next';
import {Navigation} from '@/components/site/Navigation';
import {Footer} from '@/components/site/Footer';
import {ALLOW_INDEXING,SITE_URL} from '@/lib/site';
import './globals.css';
export const metadata:Metadata={metadataBase:new URL(SITE_URL),title:{default:'Pamsika — Ideas that move business.',template:'%s | Pamsika'},description:'An AI-powered African business growth platform. Explore AdLab campaigns, Creative Market services and a clear guide to your next business move.',robots:ALLOW_INDEXING?{index:true,follow:true}:{index:false,follow:false},icons:{icon:'/favicon.svg',apple:'/apple-touch-icon.png'},openGraph:{siteName:'Pamsika',type:'website',locale:'en_US'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><Navigation/><main id="main" tabIndex={-1}>{children}</main><Footer/></body></html>}
