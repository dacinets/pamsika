import {ButtonLink,TextLink} from '@/components/site/UI';
import {Navigation} from '@/components/site/Navigation';
import {Footer} from '@/components/site/Footer';
export default function NotFound(){return <><Navigation/><main id="main" tabIndex={-1}><section className="container section"><p className="eyebrow">404 · Page not found</p><h1 className="not-found-title">Let’s find your next move.</h1><p className="lead">This page is no longer here, or the address may be incorrect.</p><div className="actions"><ButtonLink href="/">Back to home</ButtonLink><TextLink href="/faq">Search the FAQ</TextLink></div></section></main><Footer/></>}
