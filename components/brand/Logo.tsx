import type { CSSProperties } from 'react';
const marks = {
 wordmark: {prefix:'pamsika-A-wordmark',width:1591,height:451,min:120,label:'Pamsika'},
 tagline: {prefix:'pamsika-B-tagline-lockup',width:1591,height:566,min:180,label:'Pamsika — Ideas that move business.'},
 adlab: {prefix:'pamsika-adlab-lockup',width:1898.6455078125,height:451,min:220,label:'Pamsika AdLab'},
 studio: {prefix:'pamsika-ai-business-studio-lockup',width:2366.759765625,height:451,min:220,label:'Pamsika AI Business Studio'},
};
/** dark="auto" follows the page theme: reversed artwork on dark, full colour on light (CSS hides the other). */
export function Logo({kind='wordmark',dark=true,width=152}:{kind?:keyof typeof marks;dark?:boolean|'auto';width?:number}) {
 const mark=marks[kind], size=Math.max(width,mark.min), h=size*mark.height/mark.width;
 const frame=dark==='auto'?'logo-frame-auto':dark?'logo-frame-dark':'';
 return <span className={`logo-frame ${frame}`} style={{padding:size*60/mark.width,'--logo-width':`${size}px`} as CSSProperties}>
 {/* Production SVGs are immutable. Intrinsic aspect ratios come from the supplied viewBox. */}
 {dark==='auto'?<>
  {/* eslint-disable-next-line @next/next/no-img-element */}
  <img className="logo-on-dark" src={`/brand/${mark.prefix}-reversed.svg`} alt={mark.label} width={size} height={h} data-logo-kind={kind}/>
  {/* eslint-disable-next-line @next/next/no-img-element */}
  <img className="logo-on-light" src={`/brand/${mark.prefix}-full-color.svg`} alt={mark.label} width={size} height={h} data-logo-kind={kind}/>
 </>:<>
  {/* eslint-disable-next-line @next/next/no-img-element */}
  <img src={`/brand/${mark.prefix}-${dark?'reversed':'full-color'}.svg`} alt={mark.label} width={size} height={h} data-logo-kind={kind}/>
 </>}
 </span>;
}
