import type {AnchorHTMLAttributes} from 'react';
/** Native document navigation keeps marketing routes reliable in the Worker build,
 * supports browser history and new tabs, and works before JavaScript hydrates. */
export function SiteLink(props:AnchorHTMLAttributes<HTMLAnchorElement>){return <a {...props}/>;}
