import {BriefPage} from '@/components/forms/BriefPage';
import {pageMetadata} from '@/lib/site';
export const metadata=pageMetadata('Contact','Talk to Pamsika about your business, a creative collaboration or a new campaign.','/contact');
export default function Contact(){return <BriefPage kind="contact"/>}
