import { useRef } from "react";
import { Link } from "react-router-dom";
import Hero, { HeroKicker, HeroTitle } from "../components/Hero";
import Icon from "../components/Icon";
import { usePageMeta, useScrollProgress } from "../hooks/motion";
import { rich, useLang } from "../i18n";

const PILLARS = [
  { id: "child", icon: "child", d: ".08s" },
  { id: "community", icon: "users", d: ".14s", blush: true },
  { id: "privacy", icon: "lock", d: ".06s" },
  { id: "education", icon: "book", d: ".12s" },
  { id: "rapid", icon: "phone", d: ".18s" },
];

const d = (v) => ({ "--d": v });

export default function About() {
  const { t } = useLang();
  const a = t.about;
  usePageMeta(a.metaTitle, a.metaDesc);
  const storyRef = useRef(null);
  useScrollProgress(storyRef);

  return (
    <>
      <Hero scrollCue>
        <HeroKicker label="रक्षा">{a.kicker}</HeroKicker>
        <HeroTitle lines={a.heroLines} />
        <p className="lead">{a.heroLead}</p>
        <div className="btn-row">
          <Link className="btn" to="/community">{a.join} <Icon name="arrowRight" strokeWidth={2.2} /></Link>
          <a className="btn btn--ghost" href="#story">{a.readStory}</a>
        </div>
        <div className="hero__stats">
          {a.stats.map(([value, label]) => <div className="stat" key={value}><strong>{value}</strong><span>{label}</span></div>)}
        </div>
      </Hero>

      <section className="section" id="story" aria-labelledby="story-title">
        <div className="container story" ref={storyRef}>
          <div className="story__sticky">
            <p className="eyebrow reveal">{a.originEyebrow}</p>
            <h2 id="story-title" className="reveal" style={d(".08s")}>{rich(a.originTitle, "accent")}</h2>
            <p className="lead reveal" style={d(".16s")}>{a.originLead}</p>
            <div className="story__bigword" aria-hidden="true">Rak<span>shya</span></div>
            <div className="story__progress" aria-hidden="true"><i /></div>
          </div>
          <div className="chapters">
            {a.chapters.map((c, i) => (
              <article className="chapter reveal reveal--right" key={i}>
                <h3>{c.title}</h3>
                <p>{rich(c.text)}</p>
                {c.quote && <blockquote>{c.quote}</blockquote>}
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[...a.values, ...a.values].map((v, i) => <span key={i}>{v}</span>)}
        </div>
      </div>

      <section className="section section--wash" aria-labelledby="pillars-title">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow reveal">{a.pillarsEyebrow}</p>
            <h2 id="pillars-title" className="reveal" style={d(".08s")}>{rich(a.pillarsTitle, "accent")}</h2>
            <p className="lead reveal" style={d(".16s")}>{a.pillarsLead}</p>
          </div>

          <div className="bento">
            <article className="tile tile--feature tilt reveal reveal--scale">
              <span className="tile__glow" aria-hidden="true" />
              <svg className="tile__art" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 4 8 13v17c0 15 10 25.5 24 30 14-4.5 24-15 24-30V13L32 4Z" fill="currentColor" /></svg>
              <span className="tile__icon"><Icon name="woman" /></span>
              <h3>{a.feature.title}</h3>
              <p>{a.feature.text}</p>
              <ul>{a.feature.list.map((li) => <li key={li}>{li}</li>)}</ul>
              <Link className="tile__link" to="/products">{a.feature.link} <span aria-hidden="true">→</span></Link>
            </article>

            {PILLARS.map((p) => (
              <article key={p.id} className={"tile tilt reveal" + (p.blush ? " tile--blush" : "")} style={d(p.d)}>
                <span className="tile__glow" aria-hidden="true" />
                <span className="tile__icon"><Icon name={p.icon} /></span>
                <h3>{a.pillars[p.id].title}</h3>
                <p>{a.pillars[p.id].text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark" aria-labelledby="pledge-title">
        <div className="container pledge">
          <div>
            <p className="eyebrow reveal">{a.pledgeEyebrow}</p>
            <h2 id="pledge-title" className="reveal" style={d(".08s")}>{a.pledgeTitle}</h2>
            <p className="lead reveal" style={d(".16s")}>{a.pledgeLead}</p>
          </div>
          <ol className="pledge__list">
            {a.pledges.map((text, i) => (
              <li className="reveal reveal--right" style={d(`${i * 0.08}s`)} key={i}><b>0{i + 1}</b><span>{text}</span></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="cta-title">
        <div className="container">
          <div className="cta-band reveal reveal--scale">
            <div>
              <h2 id="cta-title">{a.ctaTitle}</h2>
              <p>{a.ctaText}</p>
            </div>
            <div className="btn-row">
              <Link className="btn" to="/community#share">{a.ctaButton}</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
