# Pamsika website MVP implementation plan

**Goal:** Translate Pamsika’s approved identity and design system into a responsive eight-page website, launching with AdLab.

**Authority:** Pamsika Brand Guidelines v2.0; Pamsika Production Logo Family v1.0; Pamsika Design System Approved v1.2. The v1.2 archive still includes superseded logo variants. Copy all 24 original production SVGs without edits and map their measured viewBoxes correctly. Never ship the archive’s older contour artwork.

**Architecture:** Server-rendered React pages with a shared brand layer, navigation, footer, media cards, section layouts and enquiry components. Typed content records separate campaign material from presentation. Cloudflare D1 stores campaign briefs, idea adaptations and contact enquiries. The platform structure leaves room for AI Business Studio and Creative Marketplace without inventing new logos or launching unfinished products.

**Visual direction:** Follow the approved split marketing hero, editorial typography, 4px spacing scale, blue interaction, restrained orange emphasis and cinematic AdLab surfaces. Reuse the exact colour, spacing, type, radius, glass and motion tokens. Sora headings and Inter body copy are self-hosted. Logo frames are solid and preserve 1X clear space. Motion uses Spark 120ms, Connect 200ms, Move 320ms, Reveal 520ms and cinematic 800ms with reduced-motion support.

## Build sequence

1. **Brand foundation and first page.** Create `components/brand/Logo.tsx`, shared UI and navigation, `app/tokens`, `app/globals.css`, the root layout and Home page. Use the production wordmark at 120px minimum, tagline at 180px, sub-brands at 220px. Verify actual dimensions, palette and source hashes.
2. **Pages and content.** Add AdLab, Watch / Work, Services, Adapt an Idea, Start a Campaign, About and Contact. Home explains the parent platform; AdLab explains commercial production. Services connects each offering to a campaign brief. About states the African business-growth purpose. Watch / Work supports filters and campaign detail views with media metadata.
3. **Campaign presentation.** Build reusable campaign cards and a video component supporting posters, controls, captions and transcripts. No invented client results, testimonials or sample videos passed off as completed work. Any new imagery is clearly identified as an illustrative concept; playback appears only for real video sources.
4. **Enquiry flows.** Create accessible forms with inline validation, error summaries, review, durable submission, reference IDs and editable failure states. Store only the supplied enquiry fields. Do not send email or invent a contact address. Implement bounded request bodies, origin checking, parameterized writes and duplicate-submission protection.
5. **Verification.** Run compilation and types, functional enquiry tests, route/link checks, logo source comparisons, accessibility checks, and screenshots at 390/768/1024/1440px (plus narrow 320px). Exercise keyboard navigation, mobile menus, filters, forms, reduced motion and text enlargement. Correct broken layouts and any design-token conflicts before publishing.
6. **Handoff.** Publish a private review website and provide source and a concise QA record. Explain any remaining launch dependencies, especially real campaign films, approved campaign copy and public lead-notification setup.

## Acceptance criteria

- All eight requested destinations work directly and through navigation.
- Mobile/tablet/desktop layouts have no horizontal overflow or clipped controls.
- All shipped logos match the approved production files byte-for-byte.
- Primary palette is #005ABD / #FF7A00 / #111827 / #FFFFFF; no competing product colours.
- Sora and Inter load locally; heading and body hierarchy follow v1.2.
- Keyboard focus is visible; inputs are labeled; touch targets reach 44px; forms preserve input after failure.
- No fabricated client work, results, contact details, playback or submission success.
- Per-page titles, descriptions, canonical URLs, sitemap and robots behavior are set for the private review stage.
