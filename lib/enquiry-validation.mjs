import {marketServiceNames} from './market-services.mjs';
export function validateEnquiry(input) {
 /** @type {Record<string,string>} */
 const errors={};const raw=input&&typeof input==='object'?input:{};
 const text=(key,max,required=false)=>{const value=typeof raw[key]==='string'?raw[key].trim():'';if(required&&!value)errors[key]='Complete this field.';if(value.length>max)errors[key]=`Keep this under ${max} characters.`;return value;};
 const kind=text('kind',20,true);if(!['campaign','adapt','contact','market','creator'].includes(kind))errors.kind='Choose a valid enquiry type.';
 const name=text('name',120,true),email=text('email',254,true),business=text('business',180,!['contact','creator'].includes(kind)),message=text('message',5000,true);
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))errors.email='Add a valid email address so we can reply.';
 if(message.length<10)errors.message='Tell us a little more, using at least 10 characters.';
 const consent=raw.consent===true;if(!consent)errors.consent='Agree to be contacted about this enquiry.';
 const idea=text('idea',1000,kind==='adapt'),market=text('market',180,kind==='creator'),budget=text('budget',80),timing=text('timing',100);
 const allowed=['market','creator'].includes(kind)?marketServiceNames:['Creative strategy','Commercial production','Social campaigns','Brand and design'];
 const services=Array.isArray(raw.services)?raw.services.filter(x=>typeof x==='string'&&allowed.includes(x)):[];
 if(['market','creator'].includes(kind)&&services.length===0)errors.services='Choose at least one creative discipline.';
 const portfolio=kind==='creator'?text('portfolio',2000,true):'';
 if(kind==='creator'){try{const url=new URL(portfolio);if(url.protocol!=='https:'||url.username||url.password||!url.hostname.includes('.'))throw new Error();}catch{errors.portfolio='Add a public HTTPS link to your portfolio or work profile.';}}
 const requestId=text('requestId',36,true);if(!/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(requestId))errors.requestId='Refresh the page and try again.';
 return Object.keys(errors).length?{success:false,errors}:{success:true,data:{kind,name,email,business,message,consent,idea,market,budget,timing,services,...(kind==='creator'?{portfolio}:{}),requestId}};
}
