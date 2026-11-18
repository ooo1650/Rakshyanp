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

## Deploying to Cloudflare Pages

The site is built by **GitHub Actions** and uploaded with `wrangler pages deploy` (a Cloudflare *Direct Upload* project). Cloudflare never builds it, so it uses none of the account's build quota, which matters when several apps share one Cloudflare account.

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

| Event | What happens |
| --- | --- |
| Push to `master` | Build, then deploy to production |
| Pull request into `master` | Build only, to catch a broken build. No deployment, no preview |
| Push to any other branch | Nothing |
| Actions → Run workflow | Build and deploy the chosen branch (`master` = production) |

Changes to Markdown files alone don't trigger a run.

### One-time setup

1. **Create the Pages project as Direct Upload.** Don't connect the repo in the Cloudflare dashboard: a Git-connected project builds on Cloudflare, and a project can't be switched later.
   ```bash
   npx wrangler login
   npx wrangler pages project create rakshya --production-branch=master
   ```
   The name must match `name` in `wrangler.toml`. Give each app in the account its own name.
2. **Create an API token.** Cloudflare dashboard → My Profile → API Tokens → Create Token → Custom, with permission **Account → Cloudflare Pages → Edit**, limited to this account. One token can serve every app in the account.
3. **Add GitHub secrets** (repo → Settings → Secrets and variables → Actions): `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` (shown on the Workers & Pages overview). With several app repos in a GitHub organisation, set them once as organisation secrets.
4. Push to `master`. The site appears at `https://rakshya.pages.dev`. Add a custom domain under the project's Custom domains tab.

For other projects in the same account that *are* Git-connected, turn off unneeded preview builds: project → Settings → Builds → Branch control → Preview branch: **None** (or only the branches you name).

**Manual deploy from your machine:** `npm run deploy` (builds, then uploads `dist/` to production).

Routing: Cloudflare Pages serves `index.html` for unknown paths (SPA mode, since there is no `404.html`), so deep links like `/community#helplines` work. `public/_redirects` sends the old `.html` URLs to the new routes.

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
