# Interactive FAQ verification — 15 September 2026

Added /faq with 34 published questions in seven topics, local search, topic filtering, shareable answer links, six guided next-step recommendations and direct service/form navigation. Added main/mobile menu, footer, Home and form entry points. The guide explicitly distinguishes local retrieval from generative AI and reflects current enquiry, marketplace and Studio availability.

Validation:
- 22 tests pass, including natural-language pricing/creator/AI queries, the basic “What is Pamsika?” query, unknown search behavior, topic filtering and existing enquiry/catalogue regressions.
- TypeScript and production build pass.
- Compiled browser checks: search suggestions, combined category/search, empty state, filter reset, all six recommendation targets, direct/repeated answer links and Enter/Space accordion controls.
- Both FAQ modes fit viewport overrides 320, 390, 768, 1024 and 1440 without horizontal overflow. Existing browser zoom produced actual CSS widths approximately 291, 355, 698, 931 and 1309. One H1 in each view. Mobile FAQ and desktop guide screenshots reviewed.
- All 17 unique answer/recommendation destinations return 200 locally. FAQ sitemap entry present. All 34 FAQPage questions/answers match the published source. All no-JavaScript answer anchors are present and unique in server HTML.
- Independent review prompted explicit answer-link activation and visible no-JavaScript fragment targets. Links no longer depend solely on location events to reveal an answer.
- Production logos and favicon still match their original source files; all 24 SVGs unchanged.

Limits: this is a published-answer search and rules-based route guide, not generative AI chat. No external AI API, search logging, new enquiry records or emails were added. No new automated axe audit or physical-device test was run. The browser recorded one anonymous reportAllChanges/startTime telemetry error during responsive testing; that symbol is absent from the shipped client/server bundles and the verified page interactions completed. It is not counted as an app test pass or an app source defect.
