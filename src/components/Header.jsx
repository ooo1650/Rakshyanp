import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { EmergencyButton } from "./EmergencyDrawer";
import QuickExit from "./QuickExit";
import Icon from "./Icon";
import { useLang } from "../i18n";

export const NAV = [
  { to: "/", key: "about", end: true },
  { to: "/community", key: "community" },
  { to: "/products", key: "products" },
];

export function BrandMark() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 4 8 13v17c0 15 10 25.5 24 30 14-4.5 24-15 24-30V13L32 4Z" fill="#70020f" />
      <path d="M32 45s-12-7.2-12-15.4A6.6 6.6 0 0 1 32 26a6.6 6.6 0 0 1 12 3.6C44 37.8 32 45 32 45Z" fill="#fedee1" />
    </svg>
  );
}

/** Switches between English and Nepali. The label is written in the language it switches to. */
export function LangToggle() {
  const { t, setLang } = useLang();
  return (
    <button type="button" className="lang-toggle" onClick={() => setLang(t.lang.switchToLang)} aria-label={t.lang.switchAria}>
      <Icon name="globe" strokeWidth={1.8} />
      <span lang={t.lang.switchToLang}>{t.lang.switchTo}</span>
    </button>
  );
}

/**
 * Top bar. Desktop: logo, page links, language, (quick exit), Emergency Help.
 * Phones and tablets: logo, language, (quick exit) — page links and SOS live in the bottom TabBar.
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { t } = useLang();
  const onCommunity = pathname.startsWith("/community");

  useEffect(() => {
    let ticking = false;
    const update = () => { setScrolled(window.scrollY > 24); ticking = false; };
    const onScroll = () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={"site-header" + (scrolled ? " is-scrolled" : "")}>
      <nav className="nav" aria-label={t.nav.primaryAria}>
        <Link className="brand" to="/" aria-label={t.common.homeAria}>
          <BrandMark />
          <span>Rakshya<i>.</i></span>
        </Link>
        <ul className="nav-links">
          {NAV.map((n) => <li key={n.to}><NavLink to={n.to} end={n.end}>{t.nav[n.key]}</NavLink></li>)}
        </ul>
        <div className="nav-actions">
          <LangToggle />
          {onCommunity && <QuickExit />}
          <EmergencyButton className="sos-btn nav-sos" />
        </div>
      </nav>
    </header>
  );
}
