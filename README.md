# Rakshya — रक्षा

A website for **Rakshya**, a brand that protects and supports women and children in Nepal.

Built with **React 18 + Vite** and React Router. Hosted on **Cloudflare Pages**.

## Pages

| Route | File | What it does |
| --- | --- | --- |
| `/` About Us | `src/pages/About.jsx` | Hero with drifting gradient and waves; an origin story that reveals as you scroll; mission pillars with tilt on hover; the pledge; a call to action |
| `/community` Community Forum | `src/pages/Community.jsx` | One-tap helpline directory; anonymous stories you can filter; a 4-step anonymous sharing form that goes to a moderation queue; how moderation works; a quick-exit button |
| `/products` Products & Contact | `src/pages/Products.jsx` | A coming-soon teaser for the keychain and SOS wristband (nothing is on sale), and contact by WhatsApp, email, phone and social media |

Every page has one pulsing emergency button that opens the helpline directory in a drawer: in the top bar on desktop, and as the raised **SOS** button in the bottom tab bar on phones and tablets (under 1100px wide, where the tab bar also replaces the page links).

## Languages (English / नेपाली)

All text lives in `src/i18n/en.js` and `src/i18n/ne.js`, which have the same keys. Components read it with `const { t } = useLang()`, e.g. `t.about.heroLead`. In the text, `*word*` is emphasis (accent colour in headings) and `**word**` is bold.

- The switch in the header is labelled in the language it switches to ("नेपाली" / "English").
- The choice is saved in the browser. A link with `?lang=ne` or `?lang=en` opens the site in that language, and a browser set to Nepali starts in Nepali.
- `<html lang>` follows the choice, and `:lang(ne)` rules in `styles.css` loosen line height and drop italics for Devanagari. Noto Sans/Serif Devanagari load from Google Fonts.
- To add or change text, edit both files. Have a native Nepali speaker review `ne.js` before launch, especially the helpline, consent and story text.

## Structure

```
index.html                 Vite entry (fonts, meta)
public/                    copied as-is into dist/
  _headers                 Cloudflare Pages security + cache headers
  _redirects               old /community.html, /products.html -> new routes
  favicon.svg
src/
  main.jsx, App.jsx        router + shared layout
  styles.css               design tokens, components, animations
  data/helplines.js        HELPLINES (single source of truth)
  hooks/motion.js          scroll reveal, card tilt, scroll progress, page meta
  i18n/                    en.js, ne.js (all site text) + LangProvider / useLang / rich()
  components/              Header, TabBar, Footer, Hero, Drawer, EmergencyDrawer, SharePortal, QuickExit, Icon
  pages/                   About, Community, Products, NotFound
wrangler.toml              Cloudflare Pages project config
```

## Running locally

Needs Node 18+ (Cloudflare builds with the version in `.node-version`).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve dist/ locally
```

## Deploying to Cloudflare

Hosted as a **Cloudflare Worker with static assets**, connected to this GitHub repo through the dashboard (Workers Builds). On every push to `main`, Cloudflare runs `npm run build` and then `npx wrangler deploy`, which uploads `dist/` as configured in [`wrangler.toml`](wrangler.toml):

- `[assets] directory = "./dist"`: the built site, no server code.
- `not_found_handling = "single-page-application"`: unknown paths serve `index.html`, so React Router handles `/community`, `/products` and deep links like `/community#helplines`.
- `workers_dev = true`: the site is reachable at `https://rakshya.<subdomain>.workers.dev`.
- `preview_urls = false`: no per-version preview URLs.
- `public/_headers` (security and cache headers) and `public/_redirects` (old `.html` URLs) are applied automatically.

### Dashboard settings (Worker `rakshya` → Settings → Build)

- Git repository: `Rakshyanp`, branch `main`
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- **Non-production branch builds: off**, so only pushes to `main` build. This saves build quota.

The Worker name in the dashboard must match `name` in `wrangler.toml`. Add your own domain under the Worker's **Settings → Domains & Routes**.

To test the production setup locally: `npm run build && npx wrangler dev`.

## Performance & accessibility

- No images to download. All artwork is inline SVG or CSS gradients. Fonts load with `display=swap` and fall back to system fonts.
- Animations only use `transform` and `opacity`. Scroll reveals use `IntersectionObserver`. Scroll handlers are throttled with requestAnimationFrame.
- With `prefers-reduced-motion`, animations are turned off. With `prefers-contrast: more`, borders get stronger.
- Muted Rose `#c4858c` is used only for borders and decoration. Text uses the darker tones `#8a3f49` and `#5c2a31`, which meet AA contrast.
- Focus states are visible. There is a skip link. Drawers trap focus, close on Esc and return focus when closed. Font sizes use `rem`.
- Trauma-informed details: a quick exit in the Community page header that replaces browser history (button, or Esc twice), explained by a note on first visit; content warnings on sensitive stories; a warning if someone types a phone number or email into their story; no sign-up; `Referrer-Policy: no-referrer`.

## Before going live — TODO

1. **Submission backend.** `submitToModeration()` in `src/components/SharePortal.jsx` is a placeholder. Nothing is stored or sent. Connect it to an endpoint (for example a Cloudflare Pages Function under `functions/api/`) that saves entries to a private moderation queue. It should not log IP addresses. If it calls another origin, add that origin to `connect-src` in `public/_headers`.
2. **Contact details are placeholders:** `hello@rakshya.com.np`, `+977 980-000-0000`, and the `rakshya.np` Instagram, TikTok and Facebook handles (top of `src/pages/Products.jsx`; the displayed WhatsApp number is also in `products.whatsapp.sub` in both language files). Replace them with the real ones.
3. **Helpline numbers.** Check `src/data/helplines.js` periodically (names and descriptions are in `src/i18n`). It holds Police 100, Women's Helpline 1145, Child Helpline 1098, TPO Nepal 1660-010-2005, Ambulance 102, Tourist Police 1144 and Fire 101.
4. **Sample content.** The community stories (`community.stories` in `src/i18n/en.js` and `ne.js`) are illustrative. Replace them with real moderated stories.
