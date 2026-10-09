/** First-party, cookie-free analytics. Events go to /api/collect.php (PHP on the same host). */
export type TrackEvent='pageview'|'cta_click'|'form_view'|'form_start'|'form_review'|'form_submit'|'form_error'|'faq_search'|'faq_open'|'outbound';

function optedOut():boolean{
 if(typeof navigator==='undefined')return true;
 const nav=navigator as Navigator&{globalPrivacyControl?:boolean};
 return nav.doNotTrack==='1'||nav.globalPrivacyControl===true||location.hostname==='localhost';
}

export function track(type:TrackEvent,label=''){
 try{
  if(optedOut())return;
  const utm=new URLSearchParams(location.search).get('utm_source')||'';
  const body=JSON.stringify({t:type,p:location.pathname,l:label.slice(0,120),r:type==='pageview'?document.referrer:'',u:utm,w:window.innerWidth,g:navigator.language});
  const blob=new Blob([body],{type:'text/plain'});
  if(!navigator.sendBeacon?.('/api/collect.php',blob))void fetch('/api/collect.php',{method:'POST',body,keepalive:true,headers:{'Content-Type':'text/plain'}});
 }catch{/* analytics must never affect the page */}
}
