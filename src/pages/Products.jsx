import Hero, { HeroKicker, HeroTitle } from "../components/Hero";
import Icon from "../components/Icon";
import ProductVariants from "../components/ProductVariants";
import ProductGuide from "../components/ProductGuide";
import ProductScenarios from "../components/ProductScenarios";
import { usePageMeta } from "../hooks/motion";
import { rich, useLang } from "../i18n";

const d = (v) => ({ "--d": v });

// Placeholder contact details: replace before launch (see README).
const WHATSAPP_NUMBER = "9779800000000";
const EMAIL = "hello@rakshya.com.np";
const PHONE = "+9779800000000";

function KeychainArt() {
  return (
    <svg viewBox="0 0 240 240">
      <defs>
        <linearGradient id="kc-body" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#a1112a" /><stop offset="1" stopColor="#5a0110" /></linearGradient>
        <linearGradient id="kc-shine" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".55" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
      </defs>
      <circle cx="120" cy="44" r="26" fill="none" stroke="#c4858c" strokeWidth="7" />
      <rect x="112" y="64" width="16" height="22" rx="4" fill="#c4858c" />
      <path d="M120 82c36 0 56 24 56 60 0 40-26 72-56 82-30-10-56-42-56-82 0-36 20-60 56-60Z" fill="url(#kc-body)" />
      <path d="M92 100c10-8 22-11 28-11s18 3 28 11c-8 2-18 4-28 4s-20-2-28-4Z" fill="url(#kc-shine)" />
      <circle cx="120" cy="150" r="24" fill="#fedee1" />
      <path d="M120 164s-12-7-12-15a6.5 6.5 0 0 1 12-3.5 6.5 6.5 0 0 1 12 3.5c0 8-12 15-12 15Z" fill="#70020f" />
      <rect x="150" y="70" width="34" height="10" rx="5" fill="#fedee1" transform="rotate(25 150 70)" />
    </svg>
  );
}

function WristbandArt() {
  return (
    <svg viewBox="0 0 240 240">
      <defs>
        <linearGradient id="wb-band" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#c4858c" /><stop offset=".5" stopColor="#fedee1" /><stop offset="1" stopColor="#c4858c" /></linearGradient>
        <radialGradient id="wb-face" cx=".4" cy=".35" r=".8"><stop offset="0" stopColor="#2a0a0f" /><stop offset="1" stopColor="#0e0204" /></radialGradient>
      </defs>
      <path d="M86 20h68l-6 64H92Z" fill="url(#wb-band)" />
      <path d="M92 156h56l6 64H86Z" fill="url(#wb-band)" />
      <rect x="64" y="72" width="112" height="96" rx="34" fill="#fedee1" />
      <rect x="72" y="80" width="96" height="80" rx="28" fill="url(#wb-face)" />
      <circle cx="120" cy="120" r="22" fill="none" stroke="#c4858c" strokeOpacity=".5" strokeWidth="2" />
      <circle cx="120" cy="120" r="14" fill="#9b0a1d" />
      <text x="120" y="125" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="12" fontWeight="600" fill="#fff">SOS</text>
      <rect x="176" y="108" width="8" height="24" rx="4" fill="#c4858c" />
    </svg>
  );
}

export default function Products() {
  const { t } = useLang();
  const p = t.products;
  usePageMeta(p.metaTitle, p.metaDesc);
  const whatsapp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(p.whatsapp.message)}`;

  return (
    <>
      <Hero compact>
        <HeroKicker label={p.kickerB}>{p.kicker}</HeroKicker>
        <HeroTitle lines={p.heroLines} />
        <p className="lead">{p.heroLead}</p>
        <div className="btn-row">
          <a className="btn" href="#contact">{p.notify}</a>
        </div>
      </Hero>

      <section className="section" id="products" aria-labelledby="products-title">
        <div className="container teaser">
          <div className="teaser__visuals">
            <figure className="teaser__item tilt reveal reveal--left">
              <div className="product__stage" aria-hidden="true">
                <span className="product__ring" /><span className="product__ring product__ring--2" />
                <KeychainArt />
              </div>
              <figcaption>{p.keychain}</figcaption>
            </figure>
            <figure className="teaser__item teaser__item--dark tilt reveal reveal--left" style={d(".08s")}>
              <div className="product__stage" aria-hidden="true">
                <span className="product__ring" /><span className="product__ring product__ring--2" />
                <WristbandArt />
              </div>
              <figcaption>{p.wristband}</figcaption>
            </figure>
          </div>
          <div className="teaser__text">
            <span className="badge-soon reveal"><i aria-hidden="true" />{p.badge}</span>
            <h2 id="products-title" className="reveal" style={d(".08s")}>{rich(p.teaserTitle, "accent")}</h2>
            <p className="lead reveal" style={d(".16s")}>{p.teaserLead}</p>
            <p className="reveal" style={d(".2s")}>{p.teaserWarn}</p>
          </div>
        </div>
      </section>

      <ProductVariants />
      <ProductGuide />
      <ProductScenarios />

      <section className="section section--wash-rev" id="contact" aria-labelledby="contact-title">
        <div className="container">
          <div className="section-head section-head--center">
            <p className="eyebrow reveal">{p.contactEyebrow}</p>
            <h2 id="contact-title" className="reveal" style={d(".08s")}>{rich(p.contactTitle, "accent")}</h2>
            <p className="lead reveal" style={d(".16s")}>{p.contactLead}</p>
          </div>

          <div className="inquiry">
            <a className="contact-card contact-card--primary tilt reveal" href={whatsapp} target="_blank" rel="noopener noreferrer">
              <span className="contact-card__icon"><Icon name="whatsapp" /></span>
              <strong>{p.whatsapp.title}</strong>
              <span>{p.whatsapp.sub}</span>
              <span className="contact-card__go">{p.whatsapp.go}</span>
            </a>
            <a className="contact-card tilt reveal" style={d(".06s")} href={`mailto:${EMAIL}?subject=${encodeURIComponent(p.email.subject)}`}>
              <span className="contact-card__icon"><Icon name="mail" /></span>
              <strong>{p.email.title}</strong>
              <span>{EMAIL}</span>
              <span className="contact-card__go">{p.email.go}</span>
            </a>
            <a className="contact-card tilt reveal" style={d(".12s")} href={`tel:${PHONE}`}>
              <span className="contact-card__icon"><Icon name="phone" /></span>
              <strong>{p.call.title}</strong>
              <span>{p.call.sub}</span>
              <span className="contact-card__go">{p.call.go}</span>
            </a>
          </div>

          <div className="socials reveal">
            <a className="social" href="https://www.instagram.com/rakshya.np" target="_blank" rel="noopener noreferrer"><i><Icon name="instagram" /></i>Instagram</a>
            <a className="social" href="https://www.tiktok.com/@rakshya.np" target="_blank" rel="noopener noreferrer"><i><Icon name="tiktok" /></i>TikTok</a>
            <a className="social" href="https://www.facebook.com/rakshya.np" target="_blank" rel="noopener noreferrer"><i><Icon name="facebook" /></i>Facebook</a>
          </div>
        </div>
      </section>
    </>
  );
}
