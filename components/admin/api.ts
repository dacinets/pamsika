/** Thin client for the PHP admin API. Every write carries the session's CSRF token. */
export class ApiError extends Error{constructor(message:string,public status:number){super(message)}}
let csrf='';
export function setCsrf(token:string){csrf=token}
export async function api<T>(path:string,init:{method?:'GET'|'POST';body?:unknown}={}):Promise<T>{
 const method=init.method??'GET';
 const response=await fetch(`/api/admin/${path}`,{method,credentials:'same-origin',headers:method==='POST'?{'Content-Type':'application/json','X-CSRF-Token':csrf}:undefined,body:init.body===undefined?undefined:JSON.stringify(init.body),signal:AbortSignal.timeout(20000)});
 let data:unknown=null;try{data=await response.json()}catch{/* empty */}
 if(!response.ok)throw new ApiError((data as {error?:string}|null)?.error||'Something went wrong. Please try again.',response.status);
 return data as T;
}
export type Session={signedIn:boolean;email?:string;csrf?:string};
export type Row={name:string;visitors:number;pageviews:number};
export type Totals={visitors:number;pageviews:number;enquiries:number;conversion:number;pagesPerVisit:number;bounceRate:number};
export type Stats={range:{days:number;start:string;end:string};totals:Totals;previous:Totals;series:{day:string;visitors:number;pageviews:number;enquiries:number}[];pages:Row[];referrers:Row[];campaigns:Row[];devices:Row[];browsers:Row[];funnel:{step:string;visitors:number}[];ctas:{name:string;clicks:number}[];searches:{name:string;count:number}[];enquiryKinds:{name:string;count:number}[];pipeline:{name:string;count:number}[]};
export type Lead={id:string;reference:string;kind:string;name:string;email:string;business:string;message:string;details:{idea?:string;market?:string;budget?:string;timing?:string;services?:string[];portfolio?:string};status:string;notes:string|null;created_at:string;updated_at:string};
export type LeadPage={total:number;page:number;perPage:number;leads:Lead[];statuses:string[]};
export const KIND_LABELS:Record<string,string>={campaign:'Campaign brief',adapt:'Adapt an idea',contact:'Contact',market:'Creative Market',creator:'Creator application'};
export const STATUS_LABELS:Record<string,string>={new:'New',contacted:'Contacted',qualified:'Qualified',proposal:'Proposal sent',won:'Won',lost:'Lost',archived:'Archived'};
