'use client';
import {useEffect} from 'react';
import {track} from '@/lib/analytics';
/**
 * Page-level progressive enhancement: analytics page view and click tracking,
 * scroll reveals and the pointer-following sheen on glass surfaces.
 * Everything here is optional; pages are complete without JavaScript.
 */
export function Enhancements(){
 useEffect(()=>{
  track('pageview');
  const onClick=(e:MouseEvent)=>{
   const el=(e.target as Element|null)?.closest<HTMLElement>('[data-track], a[href^="http"]');
   if(!el)return;
   if(el.dataset.track)track('cta_click',el.dataset.track);
   else if(el instanceof HTMLAnchorElement&&el.host!==location.host)track('outbound',el.host);
  };
  document.addEventListener('click',onClick);

  const reveals=document.querySelectorAll<HTMLElement>('[data-reveal]');
  const io='IntersectionObserver' in window?new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-visible');io?.unobserve(entry.target);}},{rootMargin:'0px 0px -8% 0px',threshold:.08}):null;
  reveals.forEach(el=>io?io.observe(el):el.classList.add('is-visible'));

  const fine=window.matchMedia('(pointer:fine)').matches;
  const onMove=(e:PointerEvent)=>{
   const el=(e.target as Element|null)?.closest<HTMLElement>('.glass,.glass-sheen,.service-card,.market-card,.process-grid article');
   if(!el)return;
   const r=el.getBoundingClientRect();
   el.style.setProperty('--mx',`${e.clientX-r.left}px`);el.style.setProperty('--my',`${e.clientY-r.top}px`);
  };
  if(fine)document.addEventListener('pointermove',onMove,{passive:true});
  return()=>{document.removeEventListener('click',onClick);document.removeEventListener('pointermove',onMove);io?.disconnect();};
 },[]);
 return null;
}
