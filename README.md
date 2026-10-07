# Pamsika website MVP

An eight-page, server-rendered website for Pamsika, with AdLab as the flagship launch offering. Built with React, TypeScript, Vinext and Cloudflare D1.

## Run locally

Use Node 22.13 or newer. Install with `npm ci`, then `npm run dev`. Run `npm run build` for the deployable Worker. `npx tsc --noEmit` checks types; `node --test tests/enquiry.test.mjs` checks brief validation.

To initialize a new local database after building:

```
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_ambitious_zarek.sql
```

Apply each migration once to each new local database. Sites applies production migrations during deployment.

## Source map

- `app/`: Home, AdLab, Watch / Work, Services, Adapt an Idea, Start a Campaign, About and Contact; two concept-detail pages, a not-found page, metadata, robots and sitemap.
- `components/brand/Logo.tsx`: controlled asset selection, production aspect ratios, minimum widths and 1X clear space.
- `components/site/`: reusable navigation, footer, section headings, actions and CTA bands.
- `components/campaigns/`: campaign cards, category filters and caption-ready native video playback.
- `components/forms/`: shared brief and contact flow, validation, review, save, error recovery and receipt download.
- `app/tokens/`: approved v1.2 foundations. Font-size units are converted to equivalent rem values to support text enlargement. Fonts are self-hosted Sora and Inter.
- `lib/campaigns.ts`: typed campaign records. Current records are clearly labeled illustrative concepts; no client claims, metrics or invented videos.
- `app/api/enquiries/route.ts`, `db/`: bounded, validated, same-origin, parameterized D1 enquiry persistence with idempotent submission references. No public enquiry-read endpoint.
- `docs/`: implementation plan, logo evidence, QA and launch notes.

## Brand authority

1. Pamsika Brand Guidelines v2.0
2. Pamsika Production Logo Family v1.0
3. Pamsika Design System Approved v1.2

The approved v1.2 ZIP still contained 17 superseded logo variants. None are shipped here. All 24 files in `public/brand/` are byte-for-byte copies of the authoritative production family. Do not optimize, retrace, recolor or alter their geometry. The master SVG is 1591 × 451; X is 60 geometry units. The supplied favicon and Apple touch icon are used unchanged.

Core colours: #005ABD, #FF7A00, #111827 and #FFFFFF. Light/dark tokens, restrained glass utility layers and motion timings are inherited from the approved system. Logos always use solid frames. Lucide is the existing approved design-system icon substitution.

## Campaign media

To publish a real film, replace concept copy with approved campaign details and provide a `video` object in `lib/campaigns.ts` with an MP4 source, an English WebVTT captions source and a transcript. Add the poster and correct aspect ratio. Native playback only renders when video data exists. Never add a decorative play control for a still image. Review usage rights, caption accuracy and all client claims before release.

## Enquiries

Campaign, adaptation and contact submissions are stored in D1 with consent timestamps. They do not send email, take payments or create bookings. The private review website can be tested by its owner. Stored enquiries can be inspected through Sites database tooling. No public administrative interface is exposed.

Before a public launch, configure the owner's lead notification/handling workflow, confirm privacy and retention copy, add final business contact details if desired, and enable appropriate public-form abuse controls. No email address has been invented or external message sent.

## Private review and public launch

The current deployment is owner-private. `app/robots.ts` and root metadata deliberately prevent indexing. Change these only when public release is approved; update `SITE_URL` to the verified public/custom-domain origin at the same time. Do not expose draft concepts as completed client campaigns.

Future AI Business Studio and Creative Marketplace are named as future offerings only. The shared component and token system supports adding them without a new brand identity.
