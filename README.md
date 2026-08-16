# Israel Olashore — Full-Stack Developer Portfolio

A responsive, clean dark minimal portfolio website for Israel Olashore.

## Files
- `index.html` — structure, SEO metadata, project browser, pricing and contact form
- `styles.css` — responsive dark-minimal design and animations
- `script.js` — navigation, live project previews, device switcher, package prefill and reveal effects
- `assets/profile-placeholder.svg` — replace with your own portrait
- `assets/logo.png` — brand logo used in the header and footer
- `assets/favicon-32.png`, `favicon-48.png`, `favicon-192.png`, `favicon-512.png` — favicon/app icon variants
- `assets/apple-touch-icon.png` — iPhone/iPad home-screen icon
- `assets/og-card.svg` — social-sharing artwork
- `site.webmanifest` — web app/browser metadata
- `robots.txt` + `sitemap.xml` — SEO crawler files

## Before deploying
1. Replace every `https://your-domain.com/` value in `index.html`, `robots.txt` and `sitemap.xml` with your actual production domain.
2. Replace `assets/profile-placeholder.svg` with your real portrait. If your photo has a different filename, update the `<img>` path in `index.html`.
3. The contact form uses FormSubmit and sends to `israeladebolaolashore@gmail.com`. The first live submission may require activation from the confirmation email FormSubmit sends to that inbox.
4. Test all five live preview iframes after deployment. If a project host later blocks iframe embedding using security headers, the “Open live site” button will still work.
5. For stronger social previews, export `assets/og-card.svg` to a 1200×630 PNG/JPG and update the `og:image` and `twitter:image` meta tags.

## Featured projects
### Client projects
- Legacy Wealth Creation Hub — https://legacycreationhub.vercel.app/
- International Women's Global Academy — https://internationalwomensglobalacademy.com/
- Ogbayagi Bitters — https://ogbayagibitters.vercel.app/

### Demo concepts
- Aura Interiors — https://aura-interiors-five.vercel.app/
- Élan Beauty Studio — https://elan-beauty-saloon.vercel.app/

## Local preview
Open `index.html` in a browser, or use a local server such as VS Code Live Server.

## Deployment
This static project can be deployed to Vercel, Netlify, GitHub Pages, Cloudflare Pages or any regular web host.
