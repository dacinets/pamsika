# Deploying Pamsika to Bluehost shared hosting

The site is plain files plus PHP, so it runs on any Bluehost shared (cPanel) plan with PHP 8.1+ and MySQL. Nothing runs Node on the server.

```
/home/<cpanel-user>/
├── private/
│   └── pamsika-config.php      ← secrets: database, admin login, email (chmod 600)
└── public_html/                ← contents of out/ after `npm run build`
    ├── .htaccess               ← HTTPS, security headers, caching, clean URLs
    ├── index.html, adlab/, faq/, …   (pre-rendered pages)
    ├── admin/                  ← dashboard (sign-in required)
    ├── api/                    ← PHP: enquiry, analytics beacon, admin API
    ├── sitemap.xml, robots.txt, llms.txt
    └── _next/, media/, fonts/, brand/, og/
```

## First deployment

### 1. Create the database (cPanel → MySQL Databases)
1. Create a database, e.g. `pamsika` (cPanel prefixes it: `cpaneluser_pamsika`).
2. Create a user with a long random password.
3. Add the user to the database with **ALL PRIVILEGES**.
4. Open **phpMyAdmin**, select the database, choose **Import**, and upload `database/schema.sql`.

### 2. Create the private config
1. In **File Manager**, go to your home folder (one level *above* `public_html`) and create a folder named `private`.
2. Upload `private/pamsika-config.php.example` into it and rename it to `pamsika-config.php`.
3. Edit it:
   - `db`: the database name, user and password from step 1 (host stays `localhost`).
   - `app.url`: your live address, e.g. `https://pamsika.com`.
   - `app.hash_salt`: a long random string. On your computer run `php -r "echo bin2hex(random_bytes(32));"`, or use any password generator for 64 characters.
   - `admins`: your email and a password hash. Run `php tools/hash-password.php 'your-long-password'` locally and paste the `$2y$…` output. Add more entries for more people.
   - `notify`: where new-enquiry emails go (`to`) and a mailbox on your domain to send from (`from`). Create the `from` mailbox in cPanel → Email Accounts so the mail isn't flagged as spam.
4. Set its permissions to **600** (File Manager → Permissions).

### 3. Build the site
On your computer (Node 22+):
```bash
cp .env.production.example .env.production   # set NEXT_PUBLIC_SITE_URL to the live address
npm ci
npm run build                                # writes the full site to out/
```
Or download the `public_html` artifact from the latest green GitHub Actions run (it is built with the default `https://pamsika.com` address; build locally if your domain differs).

### 4. Upload
1. Zip the **contents** of `out/` (not the folder itself). On macOS/Linux: `cd out && zip -r ../site.zip . && cd ..`. Hidden `.htaccess` files must be included.
2. In File Manager open `public_html`, upload `site.zip`, then **Extract**. Delete the zip afterwards.

### 5. Turn on HTTPS
cPanel → **SSL/TLS Status** → run AutoSSL for the domain (Bluehost's free certificate). The `.htaccess` redirects every request to HTTPS and adds HSTS once it is live.

### 6. Check it works
- `https://your-domain/api/health.php` should show `{"ok":true,…}`. A 503 means the config file or database details are wrong.
- Send a test enquiry from **Start a campaign**. You should get a `PAM-…` reference and an email.
- Sign in at `https://your-domain/admin/`. The enquiry appears under **Leads**; visits appear under **Analytics** within a minute (your own visits count unless your browser sends Do Not Track).
- `https://your-domain/api/inc/bootstrap.php` must return **403**.

### 7. Tell search engines
- Google Search Console: add the domain, then submit `https://your-domain/sitemap.xml`.
- Bing Webmaster Tools: import from Search Console (Bing also powers several AI assistants).
- Create or update the Google Business Profile with the same name, phone and address as the site.

## Updating the site
Rebuild (`npm run build`) and upload the contents of `out/` again, overwriting files. The database and `private/` folder are never touched by a deploy. If a release changes `database/schema.sql`, its new statements are safe to re-run (`IF NOT EXISTS`).

## Notes
- **Indexing:** production builds are indexable. For a staging copy, build with `NEXT_PUBLIC_ALLOW_INDEXING=false`.
- **www vs bare domain:** `.htaccess` redirects `www.` to the bare domain. If you prefer `www`, swap that rule and set `NEXT_PUBLIC_SITE_URL` to the `www` address.
- **Analytics privacy:** no cookies, no IP addresses stored, Do Not Track and Global Privacy Control respected, bots ignored. A visitor is counted once per day with a hash that rotates daily. This is why no cookie banner is needed for analytics; confirm with your own privacy advice.
- **Spam:** forms use a honeypot, same-origin checks and a per-IP limit (6 per hour by default, `security.enquiries_per_hour`). Admin sign-in locks for 15 minutes after 5 failures.
- **Backups:** cPanel → Backup covers files and the MySQL database. Export leads any time from the dashboard (CSV).
