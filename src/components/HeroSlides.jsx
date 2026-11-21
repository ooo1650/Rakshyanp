import { useEffect, useState } from "react";
import { prefersReducedMotion } from "../hooks/motion";
import { useLang } from "../i18n";

// Self-hosted (public/img/hero) so visitors' browsers never contact a third-party image host.
const SLIDES = ["/img/hero/hero-1.webp", "/img/hero/hero-2.webp", "/img/hero/hero-3.webp"];
const INTERVAL = 6000;

/** True while the media query matches; follows window resizes. */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    mq.addEventListener("change", update);
    update();
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}

/**
 * Desktop home hero photo slideshow: crossfades every 6s, with dots and a pause button.
 * Does not autoplay when the visitor prefers reduced motion.
 */
export default function HeroSlides() {
  const { t } = useLang();
  const s = t.about.slides;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(() => !prefersReducedMotion());

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), INTERVAL);
    return () => clearInterval(timer);
  }, [playing]);

  return (
    <figure className="hero__visual" aria-label={s.aria}>
      <div className="hero__slides">
        {SLIDES.map((src, i) => (
          <img key={src} className={"hero__slide" + (i === index ? " is-active" : "")} src={src} alt={s.alts[i]}
            aria-hidden={i !== index} width="1100" height="1400"
            loading={i === 0 ? "eager" : "lazy"} fetchPriority={i === 0 ? "high" : "auto"} decoding="async" />
        ))}
        <div className="hero__controls">
          <div className="hero__dots" role="group" aria-label={s.dotsAria}>
            {SLIDES.map((src, i) => (
              <button key={src} type="button" aria-label={s.show(i + 1, SLIDES.length)} aria-pressed={i === index} onClick={() => setIndex(i)} />
            ))}
          </div>
          <button className="hero__pause" type="button" aria-label={playing ? s.pauseAria : s.playAria} onClick={() => setPlaying((p) => !p)}>
            {playing ? s.pause : s.play}
          </button>
        </div>
      </div>
      <figcaption><span>{s.captions[0]}</span><span>{s.captions[1]}</span></figcaption>
      <div className="hero__image-note" aria-hidden="true"><span>•</span><span>{s.note[0]}<br />{s.note[1]}</span></div>
    </figure>
  );
}
