# Pamsika website

Marketing site, enquiry system and analytics dashboard for Pamsika, an AI-powered African business growth platform (AdLab and Creative Market).

- **Frontend:** Next.js 16 + React 19, exported to static HTML (`out/`) so every page is pre-rendered for search engines and loads fast on shared hosting.
- **Backend:** PHP 8 endpoints in `public/api/` with a MySQL database: enquiries, a cookie-free analytics beacon, and the admin API.
- **Dashboard:** `/admin/` — traffic analytics, enquiry funnel and a leads inbox with statuses, notes and CSV export.
- **Hosting:** Bluehost shared (cPanel). See [DEPLOYMENT.md](DEPLOYMENT.md).

## Local development

Needs Node 22+ and the PHP CLI (with `pdo_sqlite`).

```bash
npm ci
npm run dev                       # design work at http://localhost:5173 (no PHP: forms and dashboard can't save)

# Full stack, exactly as on Bluehost:
php tools/dev-setup.php --demo    # SQLite dev database + 60 days of sample analytics and leads
npm run build
PAMSIKA_CONFIG=tools/dev-data/config.php npm run php:serve   # http://127.0.0.1:8080
#   dashboard: http://127.0.0.1:8080/admin/  ·  dev@pamsika.test / dev-password
```

Checks: `npm run lint`, `npm run typecheck`, `npm test` (unit tests plus PHP API integration tests against a throwaway SQLite database). CI runs all of them and the build on every pull request.

## Source map

- `app/(site)/` — public pages. `app/admin/` — dashboard shell. `app/sitemap.ts`, `app/robots.ts`, `app/llms.txt/` — search and AI discovery files.
- `app/redesign.css` — the v2 visual layer: dark cinematic surfaces, liquid glass material, display type, motion. `app/globals.css` + `app/tokens/` — the approved v1.2 design tokens it builds on.
- `components/site/` — navigation, footer, shared UI, JSON-LD (`StructuredData.tsx`), progressive enhancements and tracking (`Enhancements.tsx`).
- `components/admin/` — dashboard: analytics overview, leads inbox, API client.
- `components/forms/`, `components/faq/`, `components/market/`, `components/campaigns/` — enquiry flows, FAQ explorer, Creative Market catalogue, campaign concepts.
- `lib/` — content (`faq.mjs`, `market-services.mjs`, `campaigns.ts`), validation, analytics client, site config.
- `public/api/` — PHP API. `inc/validation.php` mirrors `lib/enquiry-validation.mjs`; the integration tests check they agree.
- `database/schema.sql` — MySQL schema. `private/pamsika-config.php.example` — server config template (lives outside `public_html`).
- `tools/` — dev database setup, password hashing, local PHP router, Open Graph image source.

## Content rules carried over from the MVP

- Logo SVGs in `public/brand/` are the authoritative production family. Don't optimise, recolour or redraw them; logos always sit on a solid frame.
- Campaign imagery is labelled **illustrative concept**. Don't present concepts as client work, and don't add testimonials, metrics or clients without approval.
- Update `lib/faq.mjs` whenever pricing, availability, terms or tools change; the FAQ, the home page answers, `llms.txt` and the FAQ structured data all read from it.

## Adding photography

Images live in `public/media/` as WebP at 640, 1280 and 1672px wide. Drop new sets in with the same naming (`name-640.webp`, …) and reference them like the existing `founder` and `citrus` images.
