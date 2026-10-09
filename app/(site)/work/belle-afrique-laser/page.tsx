import {clientWork} from '@/lib/work';
import {ClientCaseStudy,caseMetadata} from '@/components/work/ClientCaseStudy';
const work=clientWork.find(w=>w.slug==='belle-afrique-laser')!;
export const metadata=caseMetadata(work);
export default function BelleAfriqueLaser(){return <ClientCaseStudy work={work}/>}
