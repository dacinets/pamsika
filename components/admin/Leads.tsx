'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {Download,Mail,Search,X,ChevronLeft,ChevronRight,Check} from 'lucide-react';
import {api,ApiError,KIND_LABELS,STATUS_LABELS,type Lead,type LeadPage} from './api';

const when=(utc:string)=>new Date(utc.replace(' ','T')+'Z').toLocaleString('en-GB',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});

export function Leads({onExpired}:{onExpired:()=>void}){
 const [status,setStatus]=useState('open'),[kind,setKind]=useState(''),[query,setQuery]=useState(''),[page,setPage]=useState(1);
 const [data,setData]=useState<LeadPage|null>(null),[error,setError]=useState(''),[loading,setLoading]=useState(true);
 const [selected,setSelected]=useState<Lead|null>(null);
 const debounce=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
 const [search,setSearch]=useState('');

 const load=useCallback(async()=>{
  setLoading(true);setError('');
  const params=new URLSearchParams({status,kind,q:search,page:String(page)});
  try{setData(await api<LeadPage>(`leads.php?${params}`))}
  catch(e){if(e instanceof ApiError&&e.status===401)onExpired();else setError(e instanceof Error?e.message:'Could not load leads.')}
  finally{setLoading(false)}
 },[status,kind,search,page,onExpired]);
 useEffect(()=>{void load()},[load]);

 function onQuery(value:string){setQuery(value);clearTimeout(debounce.current);debounce.current=setTimeout(()=>{setPage(1);setSearch(value.trim())},300);}
 function onSaved(updated:Lead){setData(d=>d&&{...d,leads:d.leads.map(l=>l.id===updated.id?updated:l)});setSelected(updated);}

 const pages=data?Math.max(1,Math.ceil(data.total/data.perPage)):1;
 return <div className={`admin-leads${loading&&data?' is-refreshing':''}`}>
  <div className="admin-toolbar">
   <div><h1>Leads</h1><p className="admin-muted">{data?`${data.total} ${data.total===1?'enquiry':'enquiries'}`:'Loading…'}</p></div>
   <a className="button button-glass" href="/api/admin/export.php" download><Download size={16} aria-hidden/>Export CSV</a>
  </div>
  <div className="admin-filters">
   <label className="admin-search"><Search size={16} aria-hidden/><span className="sr-only">Search leads</span><input type="search" placeholder="Search name, email, business or reference" value={query} onChange={e=>onQuery(e.target.value)} maxLength={100}/></label>
   <label><span className="sr-only">Status</span><select value={status} onChange={e=>{setStatus(e.target.value);setPage(1)}}><option value="open">Open leads</option><option value="">All statuses</option>{Object.entries(STATUS_LABELS).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
   <label><span className="sr-only">Type</span><select value={kind} onChange={e=>{setKind(e.target.value);setPage(1)}}><option value="">All types</option>{Object.entries(KIND_LABELS).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
  </div>
  {error&&<p className="admin-alert" role="alert">{error}</p>}
  <div className="admin-card glass admin-table-card">
   {data&&data.leads.length===0?<p className="admin-empty">No enquiries match these filters.</p>:
   <div className="admin-table-scroll"><table className="leads-table"><thead><tr><th scope="col">Received</th><th scope="col">Name</th><th scope="col">Type</th><th scope="col">Business</th><th scope="col">Status</th><th scope="col"><span className="sr-only">Open</span></th></tr></thead>
    <tbody>{data?.leads.map(lead=><tr key={lead.id} onClick={()=>setSelected(lead)} className={selected?.id===lead.id?'is-selected':''}>
     <td className="nowrap">{when(lead.created_at)}</td>
     <td><strong>{lead.name}</strong><small>{lead.email}</small></td>
     <td>{KIND_LABELS[lead.kind]??lead.kind}</td>
     <td>{lead.business||'—'}</td>
     <td><span className="status-pill" data-status={lead.status}>{STATUS_LABELS[lead.status]??lead.status}</span></td>
     <td><button type="button" className="text-link" onClick={e=>{e.stopPropagation();setSelected(lead)}} aria-label={`Open enquiry from ${lead.name}`}>Open</button></td>
    </tr>)}</tbody></table></div>}
   {pages>1&&<div className="admin-pager"><button type="button" className="admin-icon-button" disabled={page<=1} onClick={()=>setPage(p=>p-1)} aria-label="Previous page"><ChevronLeft size={16} aria-hidden/></button><span>Page {page} of {pages}</span><button type="button" className="admin-icon-button" disabled={page>=pages} onClick={()=>setPage(p=>p+1)} aria-label="Next page"><ChevronRight size={16} aria-hidden/></button></div>}
  </div>
  {selected&&<LeadDrawer lead={selected} onClose={()=>setSelected(null)} onSaved={onSaved} onExpired={onExpired}/>}
 </div>;
}

function LeadDrawer({lead,onClose,onSaved,onExpired}:{lead:Lead;onClose:()=>void;onSaved:(l:Lead)=>void;onExpired:()=>void}){
 const [status,setStatus]=useState(lead.status),[notes,setNotes]=useState(lead.notes??''),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 const heading=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{setStatus(lead.status);setNotes(lead.notes??'');setMessage('');heading.current?.focus()},[lead]);
 useEffect(()=>{const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')onClose()};document.addEventListener('keydown',onKey);return()=>document.removeEventListener('keydown',onKey)},[onClose]);
 const dirty=status!==lead.status||notes!==(lead.notes??'');
 async function save(){setBusy(true);setMessage('');try{await api('leads.php',{method:'POST',body:{id:lead.id,status,notes}});onSaved({...lead,status,notes,updated_at:new Date().toISOString().slice(0,19).replace('T',' ')});setMessage('Saved.')}catch(e){if(e instanceof ApiError&&e.status===401)onExpired();else setMessage(e instanceof Error?e.message:'Could not save.')}finally{setBusy(false)}}
 const d=lead.details;
 const rows:[string,string|undefined][]=[['Reference',lead.reference],['Received',when(lead.created_at)],['Type',KIND_LABELS[lead.kind]??lead.kind],['Email',lead.email],['Business',lead.business],['Services',d.services?.join(', ')],[lead.kind==='creator'?'Location':'Audience / market',d.market],['Idea',d.idea],['Budget',d.budget],['Timing',d.timing],['Portfolio',d.portfolio]];
 return <><div className="drawer-backdrop" onClick={onClose} aria-hidden/><aside className="lead-drawer glass glass-strong" role="dialog" aria-modal="true" aria-labelledby="lead-title">
  <div className="drawer-head"><h2 id="lead-title" ref={heading} tabIndex={-1}>{lead.name}</h2><button type="button" className="admin-icon-button" onClick={onClose} aria-label="Close"><X size={18} aria-hidden/></button></div>
  <a className="button button-primary" href={`mailto:${encodeURIComponent(lead.email)}?subject=${encodeURIComponent(`Your Pamsika enquiry ${lead.reference}`)}`}><Mail size={16} aria-hidden/>Reply by email</a>
  <dl className="lead-details">{rows.filter(([,v])=>v).map(([k,v])=><div key={k}><dt>{k}</dt><dd>{k==='Portfolio'&&v?.startsWith('https://')?<a href={v} target="_blank" rel="noopener noreferrer nofollow">{v}</a>:v}</dd></div>)}</dl>
  <h3 className="admin-subhead">Message</h3><p className="lead-message">{lead.message}</p>
  <label htmlFor="lead-status" className="admin-subhead">Status</label>
  <select id="lead-status" value={status} onChange={e=>setStatus(e.target.value)}>{Object.entries(STATUS_LABELS).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select>
  <label htmlFor="lead-notes" className="admin-subhead">Private notes</label>
  <textarea id="lead-notes" rows={5} value={notes} maxLength={5000} onChange={e=>setNotes(e.target.value)} placeholder="Call notes, next steps, quote sent…"/>
  <div className="drawer-actions"><button type="button" className="button button-primary" onClick={save} disabled={busy||!dirty}>{busy?'Saving…':'Save changes'}</button>{message&&<span role="status" className="admin-muted">{message==='Saved.'&&<Check size={14} aria-hidden/>}{message}</span>}</div>
 </aside></>;
}
