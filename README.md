# Kephi Empire — luxury fashion showcase

Static Astro site + Decap CMS, hosted free on **GitHub Pages**. The client
edits content at `/admin` ("Login with GitHub"); every save is a git commit
that triggers a rebuild and redeploy. No database, no servers, no monthly cost.

```
Astro 5 (static build) ── GitHub Actions ── GitHub Pages
        ▲
Decap CMS (/admin) — commits content straight to this repo
        ▲
Cloudflare Worker (OAuth only) — free, ~15 min one-time setup
```

---

## 1. Push the repo

```bash
cd kephi-empire
git init && git add -A && git commit -m "Kephi Empire redesign"
git remote add origin https://github.com/ogabak/kephi-empire.git
git push -u origin main
```

## 2. Turn on GitHub Pages

Repo → **Settings → Pages → Source: "GitHub Actions"** (not "Deploy from a
branch"). The included workflow (`.github/workflows/deploy.yml`) builds and
deploys on every push to `main` automatically. First deploy runs as soon as
you push.

**Custom domain (recommended):** add the domain under Settings → Pages, point
DNS (CNAME → `ogabak.github.io`, or A records for apex), and create a file
`public/CNAME` containing exactly `kephiempire.com` — without that file the
domain setting is wiped on every deploy. `astro.config.mjs` is already set to
`https://kephiempire.com`; change it if the domain differs.

**No custom domain?** The site lives at `ogabak.github.io/kephi-empire`.
Uncomment `base: '/kephi-empire'` in `astro.config.mjs` and change `site` to
`https://ogabak.github.io`. (Root-relative URLs in the pages will then need
the base prefix — the custom-domain path avoids this entirely.)

## 3. Stand up the OAuth Worker (one-time, ~15 min)

GitHub Pages can't run the OAuth handshake Decap needs, so a tiny free
Cloudflare Worker does it:

1. Clone https://github.com/sterlingwes/decap-proxy and deploy it:
   `npx wrangler deploy` (free Cloudflare account). Note the Worker URL,
   e.g. `https://kephi-oauth.<you>.workers.dev`.
2. GitHub → Settings → Developer settings → **OAuth Apps** → New OAuth App:
   - Homepage URL: `https://kephiempire.com`
   - Authorization callback URL: `https://kephi-oauth.<you>.workers.dev/callback`
3. Add the app's Client ID and Client Secret to the Worker:
   `npx wrangler secret put GITHUB_CLIENT_ID` (and `GITHUB_CLIENT_SECRET`).
4. In `public/admin/config.yml`, set `base_url:` to the Worker URL.

**Give the client access:** invite her as a **collaborator** on the repo
(Settings → Collaborators). That's the entire permission model — anyone with
write access to the repo can log in at `kephiempire.com/admin` with their
GitHub account.

## 4. Contact form + newsletter (5 min)

Both forms post to **Web3Forms** (free, 250 submissions/month, no backend):

1. Get a free access key at https://web3forms.com (enter the email that
   should receive enquiries — e.g. hello@kephiempire.com).
2. In `src/pages/index.astro`, replace both occurrences of
   `YOUR_WEB3FORMS_ACCESS_KEY` with the key.

Submissions arrive by email. Swap in Formspree or a Cloudflare Worker later
if you outgrow the free tier.

## 5. Replace placeholder artwork

The site ships with elegant SVG placeholders so it looks finished on day one.
Real photos replace them **through the CMS** — no code:

- **Dresses / showcase:** `/admin` → Dresses → edit each entry → upload Photo.
- **Hero & About images:** `/admin` → Site Settings → Homepage & Contact.

Photos should be **under 500KB** (every upload is a git commit — big files
bloat the repo and slow the page). Squoosh.app makes this painless: export
as WebP or JPEG at ~1200px on the long edge.

**The logo:** the header/footer wordmark is a code approximation of the brand
logo (crown over the E). To use the real file instead, drop `logo.svg`/`.png`
into `public/images/` and replace the markup in
`src/components/Logo.astro` with an `<img>`.

## 6. Local development

```bash
npm install
npm run dev            # site at localhost:4321
```

To test the CMS locally without touching GitHub: uncomment
`local_backend: true` in `public/admin/config.yml`, then in a second
terminal run `npm run cms`. Re-comment before pushing.

---

## How content maps to the page

| Page section          | Edited in /admin under      | Source files                       |
| --------------------- | --------------------------- | ---------------------------------- |
| Hero text & image     | Site Settings               | `src/content/settings/site.json`   |
| Our Collections cards | Dresses (lowest-order photo per collection becomes the card cover) | `src/content/dresses/*.md` |
| About                 | Site Settings               | `site.json`                        |
| Our Services          | Services                    | `src/content/services/*.md`        |
| Testimonial slider    | Testimonials                | `src/content/testimonials/*.md`    |
| Fashion Showcase      | Dresses → "Feature in Fashion Showcase" toggle (first 6 by order) | `dresses/*.md` |
| Contact info, socials | Site Settings               | `site.json`                        |
| Full catalogue page   | Dresses (grouped automatically) | `/collections` route            |

Renaming or adding a collection category = edit `COLLECTIONS` in
`src/content.config.ts` **and** the matching dropdown in
`public/admin/config.yml` (kept in sync by hand, both commented).

## Launch checklist

- [ ] Repo pushed, Pages source set to "GitHub Actions", first deploy green
- [ ] OAuth Worker deployed, `base_url` set, client logs into `/admin` successfully
- [ ] Client invited as repo collaborator
- [ ] Web3Forms key pasted (both forms), test submission received
- [ ] `public/CNAME` added + DNS pointed (custom domain) — or `base` set (project page)
- [ ] Real photos uploaded via CMS, placeholders retired
- [ ] Real logo swapped into `Logo.astro` (optional)
- [ ] Phone, email, and social URLs updated in Site Settings
