import {SiteLink as Link} from '@/components/site/SiteLink';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
export function ButtonLink({href,children,variant='primary',arrow=true}:{href:string;children:ReactNode;variant?:'primary'|'secondary'|'accent'|'inverse';arrow?:boolean}) {
 return <Link className={`button button-${variant}`} href={href}>{children}{arrow&&<ArrowUpRight size={20} strokeWidth={1.75} aria-hidden/>}</Link>;
}
export function TextLink({href,children}:{href:string;children:ReactNode}) { return <Link className="text-link" href={href}>{children}<ArrowRight size={20} aria-hidden/></Link>; }
export function Eyebrow({children}:{children:ReactNode}) {return <p className="eyebrow">{children}</p>;}
export function SectionHeading({eyebrow,title,description,action}:{eyebrow:string;title:string;description?:string;action?:ReactNode}){
 return <div className="section-heading"><div><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2>{description&&<p className="section-description">{description}</p>}</div>{action}</div>;
}
export function CTA({title='What could your next idea become?',description='Tell us where you want to take your business. Let’s make the next move together.'}:{title?:string;description?:string}) {
 return <section className="cta-band"><div className="container cta-inner"><div><Eyebrow>Your next move</Eyebrow><h2>{title}</h2><p>{description}</p></div><ButtonLink href="/start-a-campaign" variant="inverse">Start a campaign</ButtonLink></div></section>;
}
export function PageIntro({eyebrow,title,description}:{eyebrow:string;title:string;description:string}) {return <div className="page-intro container"><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1><p className="lead">{description}</p></div>;}
