'use client';
import {SiteLink as Link} from '@/components/site/SiteLink';
import {usePathname} from 'next/navigation';
import {useEffect,useRef,useState} from 'react';
import {ArrowUpRight, Menu, X} from 'lucide-react';
import {Logo} from '../brand/Logo';
const links=[['/why-pamsika','Why Pamsika'],['/adlab','AdLab'],['/creative-market','Creative Market'],['/work','Work'],['/services','Services'],['/faq','FAQ']];
export function Navigation(){
 const path=usePathname(),[open,setOpen]=useState(false),toggle=useRef<HTMLButtonElement>(null);
 useEffect(()=>{setOpen(false)},[path]);
 useEffect(()=>{if(!open)return; const close=(e:KeyboardEvent)=>{if(e.key==='Escape'){setOpen(false);toggle.current?.focus()}};document.addEventListener('keydown',close);return()=>document.removeEventListener('keydown',close)},[open]);
 return <header className="site-header"><div className="container header-inner"><Link href="/" aria-label="Pamsika home"><Logo dark width={132}/></Link><nav className="desktop-nav" aria-label="Main navigation">{links.map(([href,label])=><Link href={href} key={href} aria-current={(path===href||(href==='/creative-market'&&path.startsWith(href+'/')))?'page':undefined}>{label}</Link>)}</nav><Link className="button button-primary header-cta" href="/start-a-campaign" data-track="Start a campaign (header)">Start a campaign<ArrowUpRight size={18} aria-hidden/></Link><button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open?'Close menu':'Open menu'} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div><nav id="mobile-navigation" className="mobile-nav container" aria-label="Mobile navigation" hidden={!open}>{[['/','Home'],...links,['/about','About'],['/contact','Contact'],['/start-a-campaign','Start a campaign']].map(([href,label])=><Link href={href} key={href} aria-current={(path===href||(href==='/creative-market'&&path.startsWith(href+'/')))?'page':undefined}>{label}<ArrowUpRight size={18} aria-hidden/></Link>)}</nav></header>;
}
