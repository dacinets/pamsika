import type {CSSProperties} from 'react';
import {stockPhotos,stockSrc,stockSrcSet} from '@/lib/stock-photos.mjs';

type StockKey=keyof typeof stockPhotos;
/** Responsive licensed stock photo. Lazy by default; pass priority for above-the-fold images. */
export function StockImage({name,sizes,className,priority=false,position}:{name:string;sizes:string;className?:string;priority?:boolean;position?:string}){
 const photo=stockPhotos[name as StockKey];
 if(!photo)throw new Error(`Unknown stock photo: ${name}`);
 const style:CSSProperties|undefined=position?{objectPosition:position}:undefined;
 return <img className={className} src={stockSrc(name,1280)} srcSet={stockSrcSet(name)} sizes={sizes} width={photo.w} height={photo.h} alt={photo.alt} style={style} {...(priority?{fetchPriority:'high' as const}:{loading:'lazy' as const,decoding:'async' as const})}/>;
}
