import type {Metadata} from 'next';
/** Public origin, set per deployment in `.env.production` (no trailing slash). */
export const SITE_URL=(process.env.NEXT_PUBLIC_SITE_URL||'https://pamsika.com').replace(/\/$/,'');
/** Search indexing is on unless a build explicitly sets NEXT_PUBLIC_ALLOW_INDEXING=false (e.g. staging). */
export const ALLOW_INDEXING=process.env.NEXT_PUBLIC_ALLOW_INDEXING!=='false';
const withSlash=(path:string)=>path.endsWith('/')?path:path+'/';
export function pageMetadata(title:string,description:string,path:string,image='/og/default.jpg'):Metadata{const url=SITE_URL+withSlash(path);return {title,description,alternates:{canonical:url},openGraph:{title:`${title} | Pamsika`,description,url,type:'website',images:[{url:image,width:1200,height:630,alt:'Pamsika — Ideas that move business.'}]},twitter:{card:'summary_large_image',title:`${title} | Pamsika`,description,images:[image]}};}
