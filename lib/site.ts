import type {Metadata} from 'next';
export const SITE_URL='https://pamsika-growth.andydacinto.chatgpt.site';
export function pageMetadata(title:string,description:string,path:string):Metadata{return {title,description,alternates:{canonical:SITE_URL+path},openGraph:{title:`${title} | Pamsika`,description,url:SITE_URL+path,type:'website'},twitter:{card:'summary',title:`${title} | Pamsika`,description}};}
