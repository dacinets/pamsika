import {Navigation} from '@/components/site/Navigation';
import {Footer} from '@/components/site/Footer';
import {Enhancements} from '@/components/site/Enhancements';
export default function SiteLayout({children}:{children:React.ReactNode}){return <><a className="skip-link" href="#main">Skip to content</a><Navigation/><main id="main" tabIndex={-1}>{children}</main><Footer/><Enhancements/></>}
