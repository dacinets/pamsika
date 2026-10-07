# Pamsika MVP verification

Verified 14 September 2026 against the approved v1.2 design system, Brand Guidelines v2.0 and Production Logo Family v1.0.

## Completed checks

- 50 route/viewport combinations: ten pages at 320, 390, 768, 1024 and 1440px. No horizontal overflow, missing images, missing form labels or browser page errors. Exactly one H1 per page.
- Automated axe accessibility checks on every page at 390 and 1440px: no WCAG A/AA violations reported by the scanner.
- 200% text enlargement across five representative page types at mobile/tablet/desktop: no overflow after correcting future-product row wrapping.
- 20 internal destinations, query-prefill paths, icons and metadata routes: HTTP 200. Invalid campaign URL returns 404.
- Correct page titles, descriptions and canonical URLs for all ten rendered pages. Robots and root metadata prevent indexing during private review.
- All 24 production SVGs match their approved source bytes. Production favicon and Apple touch icon copied unchanged. Logo minimum widths and intrinsic aspect ratios checked in rendered pages.
- Self-hosted Sora and Inter WOFF2 subsets; total font assets approximately 172KB before license text. Responsive WebP campaign stills; no autoplay video or third-party analytics.
- Mobile navigation opens and closes with Escape. Active route is identified. Skip link moves focus into the main landmark. Validation summary receives focus after a failed submission.
- Campaign category filtering, idea prefill, service prefill, validation, review/edit, actual D1 saving, recoverable storage failure and downloadable receipt checked in the browser.
- Direct API checks confirm idempotent retries, conflicting reuse rejected with 409, invalid email rejected, oversized request rejected and cross-origin submission rejected. QA records exist only in the local test database.
- Reduced motion disables entrances. Reduced transparency makes glass opaque with no blur. Forced-colours screenshot inspected; controls and text retain visible boundaries.
- Five validation unit tests pass. Type checking and production Worker build pass. The complete enquiry journey also passes against the compiled production Worker running locally.
- Bounded independent source review identified a validation-focus defect. A keyboard-typing regression reproduced it; the form now focuses the summary only after failed validation/submission, preserving focus during corrections.

- Production-only transition-helper failure was corrected with native document links; navigation now works in the compiled Worker and before hydration.

## Practical limits

Automated accessibility checks do not replace assistive-technology or real-device testing. Physical phone/tablet performance and a full screen-reader audit have not been performed. No real campaign films were supplied, so caption-ready video support is implemented but real-film playback cannot be verified until approved media arrives. No Lighthouse score is claimed.

The site is owner-private. Campaign imagery is explicitly illustrative; there are no invented client results or testimonials. Enquiries are stored, but email notifications and an operational owner inbox are not connected. See launch notes before public release.
