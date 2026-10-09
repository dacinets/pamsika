'use client';
import {useRef,useState} from 'react';
import {ArrowUpRight,Check,Plus,Search,X} from 'lucide-react';
import {filterMarketServices,marketGroups,marketServices} from '@/lib/market-services.mjs';
import {SiteLink as Link} from '@/components/site/SiteLink';
import {StockImage} from '@/components/site/StockImage';

/**
 * Explore the disciplines, laid out as a magazine index. Every discipline sits on
 * one board, grouped by kind of work, in large type. Pointing at, focusing or
 * tapping a name opens it in the detail panel (sticky beside the board on wide
 * screens, inline under its group on phones). Visitors can add several
 * disciplines to one brief and request a match for all of them at once.
 * Search and the group filter highlight matches instead of reshuffling the board.
 * Without JavaScript every name is a plain link to its discipline page.
 */
type Service=(typeof marketServices)[number];
const ORDERED:Service[]=marketGroups.flatMap(g=>marketServices.filter(s=>s.group===g));
const N=ORDERED.length;
const pad=(n:number)=>String(n).padStart(2,'0');
const detailHref=(s:Service)=>`/creative-market/${s.slug}`;
const requestHref=(titles:string[])=>`/creative-market/request?${titles.map(t=>`service=${encodeURIComponent(t)}`).join('&')}`;

export function ServiceCatalogue(){
 const [active,setActive]=useState(ORDERED[0].slug);
 const [query,setQuery]=useState('');
 const [group,setGroup]=useState('All');
 const [brief,setBrief]=useState<string[]>([]);
 const hover=useRef<number|undefined>(undefined);

 const filtering=query.trim()!==''||group!=='All';
 const matches=new Set(filterMarketServices(query,group).map(s=>s.slug));
 const service=ORDERED.find(s=>s.slug===active)??ORDERED[0];

 // Keep the open discipline among the matches while searching or filtering.
 const refocus=(q:string,g:string)=>{
  const found=filterMarketServices(q,g).map(s=>s.slug);
  if(found.length&&!found.includes(active))setActive(ORDERED.find(s=>found.includes(s.slug))!.slug);
 };
 const toggleBrief=(title:string)=>setBrief(b=>b.includes(title)?b.filter(t=>t!==title):[...b,title]);
 const clear=()=>{setQuery('');setGroup('All');};

 const detail=(where:'aside'|'inline')=>{
  const n=ORDERED.indexOf(service)+1,inBrief=brief.includes(service.title);
  return <article className="mb-detail" key={`${where}-${service.slug}`} id={where==='aside'?'mb-detail':undefined} aria-live={where==='aside'?'polite':undefined}>
   <figure className="mb-photo" data-theme="dark">
    <StockImage name={service.image} sizes={where==='aside'?'(max-width:1279px) 40vw, 520px':'(max-width:767px) 92vw, 46vw'}/>
    <figcaption><b>{pad(n)} / {pad(N)}</b>{service.group}</figcaption>
   </figure>
   <div className="mb-body">
    <h3>{service.title}</h3>
    <p>{service.summary}</p>
    <ul>{service.deliverables.map(item=><li key={item}>{item}</li>)}</ul>
    <div className="mb-actions">
     <Link className="button button-primary" href={requestHref([service.title])} data-track={`Discuss: ${service.title}`}>Discuss this service<ArrowUpRight size={18} aria-hidden/></Link>
     <button type="button" className="mb-add" aria-pressed={inBrief} onClick={()=>toggleBrief(service.title)}>{inBrief?<Check size={16} aria-hidden/>:<Plus size={16} aria-hidden/>}{inBrief?'In your brief':'Add to brief'}</button>
    </div>
    <Link className="text-link mb-more" href={detailHref(service)}>More about {service.title.toLowerCase()}<ArrowUpRight size={18} aria-hidden/></Link>
   </div>
  </article>;
 };

 const tray=(where:'aside'|'dock')=><div className={`mb-tray is-${where}`} data-empty={brief.length===0?'':undefined}>
  {brief.length?<>
   <p className="mb-tray-title"><b>Your brief</b>{brief.length===1?'One discipline':`${brief.length} disciplines`}</p>
   <ul>{brief.map(t=><li key={t}><button type="button" onClick={()=>toggleBrief(t)} aria-label={`Remove ${t} from your brief`}>{t}<X size={14} aria-hidden/></button></li>)}</ul>
   <Link className="button button-accent" href={requestHref(brief)} data-track="Request a match (brief)">Request a match<ArrowUpRight size={18} aria-hidden/></Link>
  </>:<p className="mb-tray-hint"><Plus size={16} aria-hidden/>Need more than one discipline? Add each to your brief and request a match for them together.</p>}
 </div>;

 return <div className="mb">
  <div className="mb-controls">
   <div className="market-search"><label htmlFor="service-search">Find a creative service</label><div><Search size={20} aria-hidden/><input id="service-search" type="search" value={query} onChange={e=>{setQuery(e.target.value);refocus(e.target.value,group);}} placeholder="Try photography, checkout or Chichewa" maxLength={100}/></div></div>
   <div className="market-filters" role="group" aria-label="Highlight a kind of work">{['All',...marketGroups].map(value=><button type="button" key={value} aria-pressed={group===value} onClick={()=>{setGroup(value);refocus(query,value);}}>{value}<small>{value==='All'?N:ORDERED.filter(s=>s.group===value).length}</small></button>)}</div>
  </div>
  <p className="mb-count" role="status">{filtering?<>{matches.size} of {N} disciplines match. <button type="button" onClick={clear}>Show all</button></>:`${N} disciplines across ${marketGroups.length} kinds of work`}</p>

  <div className="mb-layout">
   <div className="mb-board">
    {marketGroups.map((g,gi)=>{const items=ORDERED.filter(s=>s.group===g);return <section className="mb-group" key={g} aria-labelledby={`mb-g-${gi}`} data-dim={group!=='All'&&group!==g?'':undefined}>
     <h3 className="mb-group-label" id={`mb-g-${gi}`}><span>{pad(gi+1)}</span>{g}</h3>
     <ul className="mb-names">{items.map(s=>{const n=ORDERED.indexOf(s)+1;return <li key={s.slug}>
      <a className="mb-name" href={detailHref(s)} aria-current={s.slug===active?'true':undefined} aria-controls="mb-detail" data-miss={filtering&&!matches.has(s.slug)?'':undefined} data-brief={brief.includes(s.title)?'':undefined}
       onClick={e=>{e.preventDefault();setActive(s.slug);}}
       onFocus={()=>setActive(s.slug)}
       onPointerEnter={e=>{if(e.pointerType!=='mouse')return;clearTimeout(hover.current);hover.current=window.setTimeout(()=>setActive(s.slug),110);}}
       onPointerLeave={()=>clearTimeout(hover.current)}>{(([first,...rest])=><><span className="mb-nw"><sup>{pad(n)}</sup>{first}</span>{rest.length?` ${rest.join(' ')}`:''}</>)(s.title.split(' '))}</a>
     </li>;})}</ul>
     {service.group===g&&<div className="mb-inline">{detail('inline')}</div>}
    </section>;})}
   </div>
   <aside className="mb-aside" aria-label="Selected discipline">{detail('aside')}{tray('aside')}</aside>
  </div>
  {tray('dock')}
 </div>;
}
