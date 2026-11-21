import { rich } from "../i18n";

/** Shared hero shell: drifting gradient blobs, grain, and the two-layer wave at the bottom. */
export default function Hero({ compact = false, scrollCue = false, aside = null, children }) {
  return (
    <section className={"hero" + (compact ? " hero--compact" : "") + (aside ? " hero--split" : "")} aria-labelledby="hero-title">
      <div className="hero__waves" aria-hidden="true">
        <div className="blob blob--1" /><div className="blob blob--2" /><div className="blob blob--3" /><div className="blob blob--4" />
      </div>
      <div className="hero__grain" aria-hidden="true" />
      {aside ? (
        <div className="container hero__layout"><div className="hero__content">{children}</div>{aside}</div>
      ) : (
        <div className="container"><div className="hero__content">{children}</div></div>
      )}
      <svg className="hero__wave-svg" viewBox="0 0 1440 180" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 90c180-50 360-60 540-25s360 80 540 55 270-60 360-75v135H0Z" fill="#fff4f5" opacity=".6" />
        <path d="M0 120c200-40 380-45 600-10s400 60 560 30 220-40 280-50v90H0Z" fill="#fffafa" />
      </svg>
      {scrollCue && <span className="scroll-cue" aria-hidden="true" />}
    </section>
  );
}

/** Headline whose lines rise in one after another. `*word*` in a line gets the accent colour. */
export function HeroTitle({ lines }) {
  return (
    <h1 id="hero-title">
      {lines.map((line, i) => <span className="line" key={i}><span>{rich(line, "hero__nepali")}</span></span>)}
    </h1>
  );
}

/** "Label  rest of the line" above a hero headline. */
export function HeroKicker({ label, children }) {
  return <p className="hero__kicker"><b>{label}</b> <span>{children}</span></p>;
}
