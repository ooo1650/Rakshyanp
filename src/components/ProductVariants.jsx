import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { prefersReducedMotion } from "../hooks/motion";
import { rich, useLang } from "../i18n";

// Planned designs (none on sale). Words are in src/i18n → products.variants.items, same order.
const VARIANTS = [
  { id: "classic", bg: undefined, art: (
    <svg viewBox="0 0 100 100"><circle cx="50" cy="20" r="11" fill="none" stroke="#c4858c" strokeWidth="4" /><path d="M50 32c16 0 24 10 24 26 0 18-12 30-24 34-12-4-24-16-24-34 0-16 8-26 24-26Z" fill="#70020f" /><circle cx="50" cy="60" r="10" fill="#fedee1" /></svg>
  ) },
  { id: "blush", bg: "#f6e9eb", art: (
    <svg viewBox="0 0 100 100"><circle cx="50" cy="20" r="11" fill="none" stroke="#c4858c" strokeWidth="4" /><path d="M50 32c16 0 24 10 24 26 0 18-12 30-24 34-12-4-24-16-24-34 0-16 8-26 24-26Z" fill="#c4858c" /><circle cx="50" cy="60" r="10" fill="#fff" /></svg>
  ) },
  { id: "junior", bg: "#fff4d9", art: (
    <svg viewBox="0 0 100 100"><circle cx="50" cy="20" r="11" fill="none" stroke="#e0a43a" strokeWidth="4" /><path d="M50 32c16 0 24 10 24 26 0 18-12 30-24 34-12-4-24-16-24-34 0-16 8-26 24-26Z" fill="#f1b84b" /><circle cx="35" cy="55" r="3" fill="#2a0a0f" /><circle cx="65" cy="55" r="3" fill="#2a0a0f" /><path d="M42 68q8 7 16 0" stroke="#2a0a0f" strokeWidth="3" fill="none" strokeLinecap="round" /></svg>
  ) },
  { id: "core", bg: "#2a0a0f", art: (
    <svg viewBox="0 0 100 100"><rect x="38" y="6" width="24" height="22" rx="4" fill="#c4858c" /><rect x="38" y="72" width="24" height="22" rx="4" fill="#c4858c" /><rect x="26" y="26" width="48" height="48" rx="16" fill="#fedee1" /><rect x="31" y="31" width="38" height="38" rx="12" fill="#0e0204" /><circle cx="50" cy="50" r="8" fill="#9b0a1d" /></svg>
  ) },
  { id: "lite", bg: "#fde3e6", art: (
    <svg viewBox="0 0 100 100"><rect x="38" y="6" width="24" height="22" rx="4" fill="#70020f" /><rect x="38" y="72" width="24" height="22" rx="4" fill="#70020f" /><rect x="26" y="26" width="48" height="48" rx="24" fill="#70020f" /><circle cx="50" cy="50" r="18" fill="#fedee1" /><circle cx="50" cy="50" r="7" fill="#70020f" /></svg>
  ) },
];

const d = (v) => ({ "--d": v });

/** "Pick the one that fits your day": horizontally scrolling cards with dots and arrows. */
export default function ProductVariants() {
  const { t } = useLang();
  const v = t.products.variants;
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });

  const items = () => Array.from(trackRef.current?.children || []);

  const sync = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    let best = 0, min = Infinity;
    items().forEach((it, i) => {
      const dist = Math.abs(it.offsetLeft - track.offsetLeft - track.scrollLeft);
      if (dist < min) { min = dist; best = i; }
    });
    // The track has a few px of inner padding, so "at the start/end" allows a small margin.
    const start = track.scrollLeft < 8;
    const end = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
    // When several cards fit, the last positions can't be the leftmost card: at the end, mark the last dot.
    setActive(end && !start ? items().length - 1 : best);
    setEdges({ start, end });
  }, []);

  const go = (i) => {
    const track = trackRef.current, list = items();
    const it = list[Math.max(0, Math.min(list.length - 1, i))];
    if (it) track.scrollTo({ left: it.offsetLeft - track.offsetLeft, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  useEffect(() => {
    const track = trackRef.current;
    let timer;
    const onScroll = () => { clearTimeout(timer); timer = setTimeout(sync, 60); };
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", sync, { passive: true });
    sync();
    return () => { clearTimeout(timer); track.removeEventListener("scroll", onScroll); window.removeEventListener("resize", sync); };
  }, [sync]);

  const onKey = (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(active + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(active - 1); }
  };

  return (
    <section className="section section--wash" aria-labelledby="variants-title">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow reveal">{v.eyebrow}</p>
          <h2 id="variants-title" className="reveal" style={d(".08s")}>{rich(v.title, "accent")}</h2>
          <p className="lead reveal" style={d(".16s")}>{v.lead}</p>
        </div>

        <div className="carousel reveal">
          <div className="carousel__track" ref={trackRef} tabIndex={0} role="region" aria-label={v.regionAria} onKeyDown={onKey}>
            {VARIANTS.map((item, i) => (
              <article className="variant tilt" key={item.id}>
                <div className="variant__swatch" style={item.bg ? { background: item.bg } : undefined} aria-hidden="true">{item.art}</div>
                <div className="variant__tags"><span className="tag">{v.items[i].tag}</span><span className="variant__soon">{v.soon}</span></div>
                <h3>{v.items[i].name}</h3>
                <p>{v.items[i].text}</p>
              </article>
            ))}
          </div>
          <div className="carousel__controls">
            <div className="carousel__dots">
              {VARIANTS.map((item, i) => (
                <button key={item.id} type="button" aria-label={v.goTo(i + 1, VARIANTS.length)} aria-current={i === active} onClick={() => go(i)} />
              ))}
            </div>
            <button className="icon-btn" type="button" aria-label={v.prev} disabled={edges.start} onClick={() => go(active - 1)}>
              <Icon name="chevronLeft" strokeWidth={2.2} />
            </button>
            <button className="icon-btn" type="button" aria-label={v.next} disabled={edges.end} onClick={() => go(active + 1)}>
              <Icon name="chevronRight" strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
