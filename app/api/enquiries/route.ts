import {validateEnquiry} from '@/lib/enquiry-validation.mjs';
import {enquiryDatabase} from '@/db/enquiries';
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Please submit this form from the Pamsika website.'},{status:403});
 if(!request.headers.get('content-type')?.includes('application/json'))return Response.json({error:'Use the enquiry form to send your message.'},{status:415});
 try{
  const reader=request.body?.getReader();if(!reader)return Response.json({error:'Add your enquiry details.'},{status:400});
  let length=0;const chunks:Uint8Array[]=[];while(true){const {value,done}=await reader.read();if(done)break;length+=value.length;if(length>24000){await reader.cancel();return Response.json({error:'Your enquiry is too long. Please shorten it.'},{status:413});}chunks.push(value);}
  const body=new Uint8Array(length);let offset=0;for(const chunk of chunks){body.set(chunk,offset);offset+=chunk.length;}
  let input;try{input=JSON.parse(new TextDecoder().decode(body));}catch{return Response.json({error:'Check your details and try again.'},{status:400});}
  if(input.website)return Response.json({error:'We could not submit this enquiry. Please try again.'},{status:400});
  const result=validateEnquiry(input);if(!result.success)return Response.json({error:'Check the highlighted fields.',errors:result.errors},{status:400});
  const d=result.data!;const db=enquiryDatabase();const details=JSON.stringify({idea:d.idea,market:d.market,budget:d.budget,timing:d.timing,services:d.services,portfolio:d.portfolio});
  const payload=JSON.stringify(d);const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(payload));const hash=Array.from(new Uint8Array(digest)).map(x=>x.toString(16).padStart(2,'0')).join('');
  const reference='PAM-'+d.requestId!.slice(0,8).toUpperCase();const now=Date.now();
  await db.prepare('INSERT INTO enquiries (id,reference,kind,name,email,business,message,details,payload_hash,consent_at,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING').bind(d.requestId,reference,d.kind,d.name,d.email,d.business,d.message,details,hash,now,now).run();
  const saved=await db.prepare('SELECT reference,payload_hash FROM enquiries WHERE id=?').bind(d.requestId).first<{reference:string;payload_hash:string}>();
  if(!saved||saved.payload_hash!==hash)return Response.json({error:'This submission reference was already used. Refresh the page before sending a new enquiry.'},{status:409});
  return Response.json({reference:saved.reference},{status:201,headers:{'Cache-Control':'no-store'}});
 }catch(error){console.error('Enquiry persistence failed',error instanceof Error?error.name:'unknown');return Response.json({error:'Your enquiry could not be saved. Your details are still here; please try again.'},{status:503});}
}
