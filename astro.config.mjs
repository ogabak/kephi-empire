import { defineConfig } from 'astro/config';

// GitHub Pages configuration.
//
// OPTION A — custom domain (kephiempire.com): keep `site` as-is, no `base`.
//   Add public/CNAME containing the domain and set it in repo Pages settings.
//
// OPTION B — project page (ogabak.github.io/kephi-empire): uncomment `base`.
export default defineConfig({
  site: 'https://kephi-empire.netlify.app',
  // base: '/kephi-empire',
});
