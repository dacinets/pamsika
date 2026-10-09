import {BriefPage} from '@/components/forms/BriefPage';
import {pageMetadata} from '@/lib/site';
export const metadata=pageMetadata('Start a campaign','Tell Pamsika AdLab about your business, audience and campaign goals. Start with a brief; agree the scope before production.','/start-a-campaign');
export default function StartCampaign(){return <BriefPage kind="campaign"/>}
