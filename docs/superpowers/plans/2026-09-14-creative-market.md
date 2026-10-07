# Creative Market Implementation Plan

**Goal:** Add a working curated Creative Market alongside AdLab in the existing private Pamsika website.
**Architecture:** Reuse site and brand components, typed discipline content and existing D1 enquiries. Two additional enquiry kinds preserve current storage and idempotency.
**Tech stack:** Vinext, React, TypeScript, CSS tokens, Cloudflare D1.
**Spec:** docs/superpowers/specs/2026-09-14-creative-market-design.md

## Work
- [x] Catalogue: `lib/market-services.mjs`, `components/market/ServiceCatalogue.tsx`, `app/creative-market/page.tsx` and `[slug]/page.tsx`. Six honest categories, query/category filtering, result count, empty/reset state, semantic links and item metadata.
- [x] Enquiries: extend shared validator and EnquiryForm with market/creator kinds and portfolio. Add request and join pages. Test required disciplines, HTTPS portfolio, oversized fields, old campaign validation and stripping invalid values before storing. Persist portfolio in details JSON; no migration required.
- [x] Joint launch: update Home, navigation, footer, About, Services and sitemap. Keep Studio future and AdLab flagship. Use exact parent logo and separate product text.
- [x] Verify: types, existing and new validation tests, production build, responsive route and form checks. Review changed source and immutable logo hashes. No real production enquiries during testing.
- [ ] Publish: update existing owner-only site, preserve access, deliver Creative Market URL and operational launch dependencies.
