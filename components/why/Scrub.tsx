'use client';
import {useEffect} from 'react';

/**
 * Scroll progress for the Why Pamsika page. Every [data-scrub] element gets a
 * --p custom property from 0 to 1 that its CSS animates from:
 *   data-scrub="pin"   progress through a tall section whose child is sticky
 *   data-scrub="enter" progress as the element rises into view
 * CSS defaults --p to 1, so without JavaScript or with reduced motion the page
 * shows every section in its finished state.
 */
export function Scrub(){
 useEffect(()=>{
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const els=[...document.querySelectorAll<HTMLElement>('[data-scrub]')];
  let raf=0;
  const update=()=>{
   raf=0;const vh=window.innerHeight;
   for(const el of els){
    const r=el.getBoundingClientRect();
    if(r.bottom<-vh||r.top>vh*2)continue;
    const p=el.dataset.scrub==='pin'?-r.top/Math.max(1,r.height-vh):(vh-r.top)/(vh*.85);
    el.style.setProperty('--p',Math.min(1,Math.max(0,p)).toFixed(4));
   }
  };
  const queue=()=>{if(!raf)raf=requestAnimationFrame(update);};
  update();
  window.addEventListener('scroll',queue,{passive:true});window.addEventListener('resize',queue);
  return()=>{cancelAnimationFrame(raf);window.removeEventListener('scroll',queue);window.removeEventListener('resize',queue);};
 },[]);
 return null;
}
