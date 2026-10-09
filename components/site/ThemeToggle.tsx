'use client';
import {useEffect,useState} from 'react';
import {Moon,Sun} from 'lucide-react';
import {track} from '@/lib/analytics';
import {THEME_COLOR,THEME_KEY,type Theme} from '@/lib/theme';

/**
 * Light/dark switch. Dark is the default; the choice is stored per visitor and
 * applied before paint by the boot script in app/layout.tsx. Both icons are
 * rendered and CSS shows the right one, so the server markup never guesses.
 */
const EVENT='pamsika:theme';
const read=():Theme=>document.documentElement.dataset.theme==='light'?'light':'dark';
const syncChrome=(t:Theme)=>document.querySelector('meta[name="theme-color"]')?.setAttribute('content',THEME_COLOR[t]);

function setTheme(next:Theme){
 try{localStorage.setItem(THEME_KEY,next)}catch{/* private mode: the switch still works for this page */}
 const swap=()=>{document.documentElement.dataset.theme=next;syncChrome(next);window.dispatchEvent(new CustomEvent<Theme>(EVENT,{detail:next}))};
 const doc=document as Document&{startViewTransition?:(cb:()=>void)=>unknown};
 if(doc.startViewTransition&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches)doc.startViewTransition(swap);else swap();
 track('cta_click',`Theme: ${next}`);
}

export function ThemeToggle({labelled=false}:{labelled?:boolean}){
 const [theme,setState]=useState<Theme>('dark');
 useEffect(()=>{
  const t=read();setState(t);syncChrome(t);
  const on=(e:Event)=>setState((e as CustomEvent<Theme>).detail);
  window.addEventListener(EVENT,on);return()=>window.removeEventListener(EVENT,on);
 },[]);
 const light=theme==='light',toggle=()=>setTheme(light?'dark':'light');
 const icons=<span className="theme-toggle-icon" aria-hidden><Sun className="theme-icon-sun" size={18} strokeWidth={1.75}/><Moon className="theme-icon-moon" size={17} strokeWidth={1.75}/></span>;
 if(labelled)return <button type="button" className="theme-toggle-row" aria-pressed={light} onClick={toggle}><span>Light theme</span><span className="theme-switch" aria-hidden><i/></span></button>;
 return <button type="button" className="theme-toggle" aria-pressed={light} aria-label="Light theme" title={light?'Switch to dark theme':'Switch to light theme'} onClick={toggle}>{icons}</button>;
}
