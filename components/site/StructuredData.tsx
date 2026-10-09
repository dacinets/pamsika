import {SITE_URL} from '@/lib/site';
/** JSON-LD for search engines and AI/voice assistants. Values are escaped against script injection. */
export function JsonLd({data}:{data:object}){
 return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data).replace(/</g,'\\u003c')}}/>;
}
const sameAs=(process.env.NEXT_PUBLIC_SOCIAL_LINKS||'').split(',').map(s=>s.trim()).filter(Boolean);
export const organization={
 '@type':'Organization','@id':`${SITE_URL}/#organization`,name:'Pamsika',url:`${SITE_URL}/`,
 logo:{'@type':'ImageObject',url:`${SITE_URL}/brand/pamsika-app-icon.svg`},
 slogan:'Ideas that move business.',
 description:'Pamsika is an AI-powered African business growth platform. Pamsika AdLab creates advertising campaigns and commercials; Creative Market connects businesses with creative services.',
 areaServed:[{'@type':'Country',name:'Malawi'},{'@type':'Place',name:'Africa'}],
 knowsAbout:['Advertising','Commercial production','Brand strategy','Social media campaigns','Photography','Graphic design','AI-assisted creative production'],
 ...(sameAs.length?{sameAs}:{}),
 ...(process.env.NEXT_PUBLIC_CONTACT_EMAIL?{email:process.env.NEXT_PUBLIC_CONTACT_EMAIL}:{}),
};
export function SiteStructuredData(){
 return <JsonLd data={{'@context':'https://schema.org','@graph':[organization,{'@type':'WebSite','@id':`${SITE_URL}/#website`,url:`${SITE_URL}/`,name:'Pamsika',inLanguage:'en',publisher:{'@id':`${SITE_URL}/#organization`}}]}}/>;
}
export function Breadcrumbs({items}:{items:[string,string][]}){
 return <JsonLd data={{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[['Home','/'],...items].map(([name,path],i)=>({'@type':'ListItem',position:i+1,name,item:`${SITE_URL}${path.endsWith('/')?path:path+'/'}`}))}}/>;
}
export function ServiceLd({name,description,path,type='Service'}:{name:string;description:string;path:string;type?:string}){
 return <JsonLd data={{'@context':'https://schema.org','@type':type,name,description,url:`${SITE_URL}${path}`,provider:{'@id':`${SITE_URL}/#organization`},areaServed:'Malawi'}}/>;
}
