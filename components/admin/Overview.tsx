'use client';
import {useCallback,useEffect,useMemo,useState} from 'react';
import {Area,AreaChart,CartesianGrid,ResponsiveContainer,Tooltip,XAxis,YAxis} from 'recharts';
import {ArrowDownRight,ArrowUpRight,Minus,RefreshCw} from 'lucide-react';
import {api,ApiError,KIND_LABELS,STATUS_LABELS,type Stats} from './api';

const RANGES=[[7,'7 days'],[30,'30 days'],[90,'90 days'],[365,'12 months']] as const;
const METRICS={visitors:{label:'Visitors',color:'#3d86d6'},pageviews:{label:'Page views',color:'#3d86d6'},enquiries:{label:'Enquiries',color:'#e56f00'}} as const;
type Metric=keyof typeof METRICS;
const nf=new Intl.NumberFormat('en-GB');
const dayLabel=(iso:string,days:number)=>new Date(iso+'T00:00:00Z').toLocaleDateString('en-GB',days>90?{month:'short',timeZone:'UTC'}:{day:'numeric',month:'short',timeZone:'UTC'});

export function Overview({onExpired,onOpenLeads}:{onExpired:()=>void;onOpenLeads:()=>void}){
 const [days,setDays]=useState<number>(30);
 const [stats,setStats]=useState<Stats|null>(null);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState('');
 const [metric,setMetric]=useState<Metric>('visitors');

 const load=useCallback(async(range:number)=>{
  setLoading(true);setError('');
  try{setStats(await api<Stats>(`stats.php?days=${range}`))}
  catch(e){if(e instanceof ApiError&&e.status===401)onExpired();else setError(e instanceof Error?e.message:'Could not load analytics.')}
  finally{setLoading(false)}
 },[onExpired]);
 useEffect(()=>{void load(days)},[days,load]);

 return <div className={`admin-overview${loading&&stats?' is-refreshing':''}`}>
  <div className="admin-toolbar">
   <div><h1>Analytics</h1>{stats&&<p className="admin-muted">{dayLabel(stats.range.start,30)} – {dayLabel(stats.range.end,30)} · times in UTC</p>}</div>
   <div className="admin-segmented" role="group" aria-label="Date range">{RANGES.map(([value,label])=><button type="button" key={value} aria-pressed={days===value} onClick={()=>setDays(value)}>{label}</button>)}</div>
   <button type="button" className="admin-icon-button" onClick={()=>load(days)} aria-label="Refresh"><RefreshCw size={16} aria-hidden/></button>
  </div>
  {error&&<p className="admin-alert" role="alert">{error}</p>}
  {!stats?(!error&&<div className="admin-loading" role="status">Loading analytics…</div>):<>
   <section className="kpi-grid" aria-label="Key numbers">
    <Kpi label="Visitors" value={stats.totals.visitors} prev={stats.previous.visitors} days={days}/>
    <Kpi label="Page views" value={stats.totals.pageviews} prev={stats.previous.pageviews} days={days}/>
    <Kpi label="Enquiries" value={stats.totals.enquiries} prev={stats.previous.enquiries} days={days}/>
    <Kpi label="Visitor-to-enquiry rate" value={stats.totals.conversion} prev={stats.previous.conversion} days={days} suffix="%"/>
    <Kpi label="Pages per visit" value={stats.totals.pagesPerVisit} prev={stats.previous.pagesPerVisit} days={days}/>
    <Kpi label="Single-page visits" value={stats.totals.bounceRate} prev={stats.previous.bounceRate} days={days} suffix="%" lowerIsBetter/>
   </section>

   <section className="admin-card glass" aria-labelledby="trend-title">
    <div className="admin-card-head"><h2 id="trend-title">{METRICS[metric].label} per day</h2>
     <div className="admin-segmented small" role="group" aria-label="Metric">{(Object.keys(METRICS) as Metric[]).map(key=><button type="button" key={key} aria-pressed={metric===key} onClick={()=>setMetric(key)}>{METRICS[key].label}</button>)}</div>
    </div>
    <TrendChart data={stats.series} metric={metric} days={days}/>
    <details className="admin-table-toggle"><summary>View as table</summary><div className="admin-table-scroll"><table><thead><tr><th scope="col">Day</th><th scope="col">Visitors</th><th scope="col">Page views</th><th scope="col">Enquiries</th></tr></thead><tbody>{[...stats.series].reverse().map(r=><tr key={r.day}><th scope="row">{r.day}</th><td>{nf.format(r.visitors)}</td><td>{nf.format(r.pageviews)}</td><td>{nf.format(r.enquiries)}</td></tr>)}</tbody></table></div></details>
   </section>

   <div className="admin-grid-2">
    <BarList title="Top pages" rows={stats.pages.map(r=>({name:r.name,value:r.visitors,detail:`${nf.format(r.pageviews)} views`}))} unit="visitors"/>
    <BarList title="Where visitors come from" rows={stats.referrers.map(r=>({name:r.name,value:r.visitors}))} unit="visitors" empty="No referrers yet."/>
   </div>

   <div className="admin-grid-3">
    <BarList title="Devices" rows={stats.devices.map(r=>({name:cap(r.name),value:r.visitors}))} unit="visitors" percent/>
    <BarList title="Browsers" rows={stats.browsers.map(r=>({name:r.name,value:r.visitors}))} unit="visitors" percent/>
    <BarList title="Campaign links (utm_source)" rows={stats.campaigns.map(r=>({name:r.name,value:r.visitors}))} unit="visitors" empty="Add ?utm_source=whatsapp (or similar) to links you share to see them here."/>
   </div>

   <div className="admin-grid-2">
    <Funnel steps={stats.funnel}/>
    <BarList title="Most-clicked calls to action" rows={stats.ctas.map(r=>({name:r.name,value:r.clicks}))} unit="clicks" empty="No tracked clicks yet."/>
   </div>

   <div className="admin-grid-2">
    <BarList title="What people search in the FAQ" rows={stats.searches.map(r=>({name:`“${r.name}”`,value:r.count}))} unit="searches" empty="No FAQ searches yet."/>
    <section className="admin-card glass" aria-labelledby="pipeline-title">
     <div className="admin-card-head"><h2 id="pipeline-title">Lead pipeline (all time)</h2><button type="button" className="text-link" onClick={onOpenLeads}>Open leads<ArrowUpRight size={16} aria-hidden/></button></div>
     <ul className="pipeline">{Object.keys(STATUS_LABELS).map(status=>{const n=stats.pipeline.find(p=>p.name===status)?.count??0;return <li key={status} data-status={status}><span>{STATUS_LABELS[status]}</span><strong>{nf.format(n)}</strong></li>})}</ul>
     <h3 className="admin-subhead">Enquiries this period by type</h3>
     <ul className="pipeline compact">{stats.enquiryKinds.length?stats.enquiryKinds.map(k=><li key={k.name}><span>{KIND_LABELS[k.name]??k.name}</span><strong>{nf.format(k.count)}</strong></li>):<li><span>No enquiries in this period.</span></li>}</ul>
    </section>
   </div>
  </>}
 </div>;
}

const cap=(s:string)=>s.charAt(0).toUpperCase()+s.slice(1);

function Kpi({label,value,prev,days,suffix='',lowerIsBetter=false}:{label:string;value:number;prev:number;days:number;suffix?:string;lowerIsBetter?:boolean}){
 const diff=prev===0?null:((value-prev)/prev)*100;
 const direction=diff===null||Math.abs(diff)<0.5?'flat':diff>0?'up':'down';
 const good=direction==='flat'?null:(direction==='up')!==lowerIsBetter;
 const Icon=direction==='up'?ArrowUpRight:direction==='down'?ArrowDownRight:Minus;
 return <div className="kpi glass">
  <p className="kpi-label">{label}</p>
  <p className="kpi-value">{suffix==='%'||!Number.isInteger(value)?value.toLocaleString('en-GB',{maximumFractionDigits:2}):nf.format(value)}{suffix}</p>
  <p className={`kpi-change${good===null?'':good?' good':' bad'}`}><Icon size={14} aria-hidden/>{diff===null?'No earlier data':`${diff>0?'+':''}${diff.toFixed(diff>=10||diff<=-10?0:1)}%`}<span> vs previous {days} days</span></p>
 </div>;
}

function TrendChart({data,metric,days}:{data:Stats['series'];metric:Metric;days:number}){
 const color=METRICS[metric].color;
 const ticks=useMemo(()=>{const step=Math.max(1,Math.round(data.length/6));return data.filter((_,i)=>i%step===0).map(d=>d.day)},[data]);
 return <div className="trend-chart" role="img" aria-label={`${METRICS[metric].label} per day. Use “View as table” for exact values.`}>
  <ResponsiveContainer width="100%" height={280}>
   <AreaChart data={data} margin={{top:12,right:8,bottom:0,left:-12}}>
    <defs><linearGradient id={`fill-${metric}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} stopOpacity={.32}/><stop offset="1" stopColor={color} stopOpacity={0}/></linearGradient></defs>
    <CartesianGrid vertical={false} stroke="rgba(255,255,255,.08)"/>
    <XAxis dataKey="day" ticks={ticks} tickFormatter={d=>dayLabel(d,days)} tick={{fill:'#7D8899',fontSize:12}} axisLine={{stroke:'rgba(255,255,255,.16)'}} tickLine={false}/>
    <YAxis allowDecimals={false} tick={{fill:'#7D8899',fontSize:12}} axisLine={false} tickLine={false} width={48}/>
    <Tooltip cursor={{stroke:'rgba(255,255,255,.35)',strokeWidth:1}} content={props=><TrendTooltip active={props.active} payload={props.payload as unknown as TipPayload} metric={metric}/>}/>
    <Area type="monotone" dataKey={metric} stroke={color} strokeWidth={2} fill={`url(#fill-${metric})`} activeDot={{r:5,stroke:'#0f1626',strokeWidth:2,fill:color}} isAnimationActive={false}/>
   </AreaChart>
  </ResponsiveContainer>
 </div>;
}

type TipPayload={payload:Stats['series'][number]}[];
function TrendTooltip({active,payload,metric}:{active?:boolean;payload?:TipPayload;metric:Metric}){
 if(!active||!payload?.length)return null;
 const row=payload[0].payload as Stats['series'][number];
 return <div className="chart-tooltip"><p className="chart-tooltip-day">{new Date(row.day+'T00:00:00Z').toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short',timeZone:'UTC'})}</p>
  {(Object.keys(METRICS) as Metric[]).map(key=><p key={key} className={key===metric?'is-active':''}><i style={{background:METRICS[key].color}}/><strong>{nf.format(row[key])}</strong><span>{METRICS[key].label}</span></p>)}
 </div>;
}

function BarList({title,rows,unit,percent=false,empty='No data for this period yet.'}:{title:string;rows:{name:string;value:number;detail?:string}[];unit:string;percent?:boolean;empty?:string}){
 const max=Math.max(1,...rows.map(r=>r.value));
 const total=rows.reduce((a,r)=>a+r.value,0)||1;
 const id=title.toLowerCase().replace(/[^a-z]+/g,'-');
 return <section className="admin-card glass" aria-labelledby={id}>
  <div className="admin-card-head"><h2 id={id}>{title}</h2><span className="admin-muted">{unit}</span></div>
  {rows.length?<ol className="bar-list">{rows.map(r=><li key={r.name}><div className="bar-fill" style={{width:`${(r.value/max)*100}%`}} aria-hidden/><span className="bar-name" title={r.name}>{r.name}</span><span className="bar-value">{percent?`${Math.round(r.value/total*100)}%`:nf.format(r.value)}{r.detail&&<small>{r.detail}</small>}</span></li>)}</ol>:<p className="admin-empty">{empty}</p>}
 </section>;
}

function Funnel({steps}:{steps:Stats['funnel']}){
 const first=steps[0]?.visitors||0;
 return <section className="admin-card glass" aria-labelledby="funnel-title">
  <div className="admin-card-head"><h2 id="funnel-title">Enquiry form funnel</h2><span className="admin-muted">visitors</span></div>
  {first===0?<p className="admin-empty">No one has opened an enquiry form in this period.</p>:<ol className="bar-list funnel">{steps.map((s,i)=>{const prev=i===0?s.visitors:steps[i-1].visitors;return <li key={s.step}><div className="bar-fill" style={{width:`${(s.visitors/first)*100}%`}} aria-hidden/><span className="bar-name">{s.step}</span><span className="bar-value">{nf.format(s.visitors)}<small>{i===0?'100%':`${prev?Math.round(s.visitors/prev*100):0}% of previous`}</small></span></li>})}</ol>}
 </section>;
}
