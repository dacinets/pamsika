# Interactive FAQ and first-visit guide

Goal: help a first-time visitor understand Pamsika, choose the appropriate offering and complete their next step without needing support.

Implement /faq as a lightweight, searchable knowledge guide with seven topics, published answers, direct per-answer links, and a goal-based route finder. Reuse the installed accessible accordion and input components with approved tokens. Search runs locally and retrieves written answers; it is not represented as generative AI. No private questions leave the browser or persist. Unknown questions receive a helpful empty state with links to start a brief or contact Pamsika.

Cover parent brand, AdLab versus Creative Market, future Studio, AI/human roles, six disciplines, illustrative campaign work, adaptations, briefs, costs and timing, matching, creator applications, submission references, data handling, scope/rights and site navigation. Avoid invented rates, response guarantees, legal terms, refunds, operating addresses or creator supply. Refer commercial details to the agreed project proposal.

Add FAQ in main/mobile navigation and footer, a first-visit link on Home, and contextual links next to forms. Direct questions use /faq#question-id and must reopen when visited or navigated with browser history. Search, category selection, empty/reset, accordion keyboard behavior and recommendation links must work across screen sizes. Keep FAQ answers server rendered for accessibility/search discovery and add matching FAQPage structured data.

Validate search relevance with behavioral tests, existing regressions, types and production build. Check target routes, anchors and answer consistency. Browser verification is covered by the original user's responsive/accessibility verification request. Publish to the existing private audience after successful checks.
