'use client';
import {useCallback,useEffect,useState} from 'react';
import {BarChart3,Inbox,LogOut,LockKeyhole,ArrowUpRight} from 'lucide-react';
import {Logo} from '@/components/brand/Logo';
import {SiteLink} from '@/components/site/SiteLink';
import {api,ApiError,setCsrf,type Session} from './api';
import {Overview} from './Overview';
import {Leads} from './Leads';

export function AdminApp(){
 const [session,setSession]=useState<Session|null>(null);
 const [error,setError]=useState('');
 const [tab,setTab]=useState<'overview'|'leads'>('overview');

 const load=useCallback(async()=>{
  try{const s=await api<Session>('session.php');if(s.csrf)setCsrf(s.csrf);setSession(s);setError('');}
  catch(e){setError(e instanceof ApiError&&e.status===503?'The dashboard can’t reach its database. Check the private config file on the server.':'The dashboard API isn’t reachable. It runs on the Bluehost server, not in local `next dev`.');setSession({signedIn:false});}
 },[]);
 useEffect(()=>{void load();setTab(location.hash==='#leads'?'leads':'overview');},[load]);
 const switchTab=(next:'overview'|'leads')=>{setTab(next);history.replaceState(null,'',next==='leads'?'#leads':'#');};
 const onExpired=useCallback(()=>setSession({signedIn:false}),[]);

 if(!session)return <main className="admin-loading" role="status">Loading dashboard…</main>;
 if(!session.signedIn)return <Login onSignedIn={s=>{if(s.csrf)setCsrf(s.csrf);setSession(s)}} notice={error}/>;

 async function signOut(){try{await api('logout.php',{method:'POST'})}finally{setSession({signedIn:false})}}

 return <div className="admin-shell">
  <header className="admin-top glass">
   <SiteLink href="/" aria-label="Back to the Pamsika website" className="admin-brand"><Logo width={120}/><span>Dashboard</span></SiteLink>
   <nav className="admin-tabs" aria-label="Dashboard sections">
    <button type="button" aria-current={tab==='overview'?'page':undefined} onClick={()=>switchTab('overview')}><BarChart3 size={16} aria-hidden/>Analytics</button>
    <button type="button" aria-current={tab==='leads'?'page':undefined} onClick={()=>switchTab('leads')}><Inbox size={16} aria-hidden/>Leads</button>
   </nav>
   <div className="admin-user"><span>{session.email}</span><SiteLink className="admin-icon-button" href="/" target="_blank" rel="noopener" aria-label="Open website in a new tab"><ArrowUpRight size={16} aria-hidden/></SiteLink><button type="button" className="admin-icon-button" onClick={signOut} aria-label="Sign out"><LogOut size={16} aria-hidden/></button></div>
  </header>
  <main className="admin-main" id="main">{tab==='overview'?<Overview onExpired={onExpired} onOpenLeads={()=>switchTab('leads')}/>:<Leads onExpired={onExpired}/>}</main>
 </div>;
}

function Login({onSignedIn,notice}:{onSignedIn:(s:Session)=>void;notice:string}){
 const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
 async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);setError('');try{onSignedIn(await api<Session>('login.php',{method:'POST',body:{email,password}}))}catch(err){setError(err instanceof Error?err.message:'Sign-in failed.')}finally{setBusy(false)}}
 return <main className="admin-login-wrap" id="main"><form className="admin-login glass" onSubmit={submit}>
  <Logo width={140}/>
  <h1><LockKeyhole size={20} aria-hidden/>Dashboard sign in</h1>
  <p className="admin-muted">Analytics and enquiries for the Pamsika website.</p>
  {notice&&<p className="admin-alert" role="status">{notice}</p>}
  {error&&<p className="admin-alert" role="alert">{error}</p>}
  <label htmlFor="admin-email">Email</label><input id="admin-email" type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} required/>
  <label htmlFor="admin-password">Password</label><input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required/>
  <button className="button button-primary" type="submit" disabled={busy}>{busy?'Signing in…':'Sign in'}</button>
 </form></main>;
}
