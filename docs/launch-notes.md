# Launch notes

The website is a private review MVP. All eight requested pages and two concept detail pages are implemented. Enquiries persist in D1; notifications are not connected. No external emails were sent.

Before a public launch, provide approved campaign films, captions, transcripts and case-study copy; confirm final business contact and privacy/retention details; connect lead notifications or an owner workflow; review public-form abuse protection; and approve the public domain and indexing switch.

Current campaign stills are newly generated, explicitly labeled illustrative concepts. The concept titles and marketing copy are new website copy, not source-backed claims about commissioned work. No fabricated testimonials, performance metrics or clients appear.

The original design-system documentation contains unresolved logo provenance notes. This implementation resolves those by using the separately supplied production family. `docs/logo-verification.json` records the source checksums and viewBoxes for all 24 SVGs.

## Creative Market joint launch

Creative Market now launches alongside AdLab as a curated service catalogue, with six discipline pages, business matching briefs and creator portfolio applications. Submissions use the existing D1 enquiries table with distinct `market` and `creator` types. The portfolio URL is stored in the details JSON for creator applications; no database migration is required.

Before public launch, review and approve the first creator roster, obtain permission for public profiles/work, and assign an enquiry/application owner. Profiles, ratings, fixed prices, online bookings and payments are not present. The current private implementation makes these boundaries clear. See `docs/creative-market-qa.md` for verification.

## Interactive FAQ

The /faq page explains both offerings and provides 34 searchable answers and six guided visitor routes. FAQ data is maintained in `lib/faq.mjs`; update it whenever pricing, creator availability, notifications, terms or AI tools change. Current capability limits are explicitly documented in the answers. No generative AI, question transmission or new storage is involved. See `docs/faq-qa.md`.
