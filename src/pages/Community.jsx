import { useState } from "react";
import Hero, { HeroKicker, HeroTitle } from "../components/Hero";
import Icon from "../components/Icon";
import SharePortal from "../components/SharePortal";
import { DrawerTrigger } from "../components/Drawer";
import { HELPLINES, telHref } from "../data/helplines";
import { usePageMeta } from "../hooks/motion";
import { rich, useLang } from "../i18n";

const FILTERS = ["all", "harassment", "workplace", "child", "healing"];

// Language-independent story data; the words are in src/i18n (community.stories, same order).
// Illustrative sample stories. Replace with real moderated entries before launch.
const STORIES = [
  { topic: "harassment", counts: [128, 64] },
  { topic: "workplace", counts: [201, 87], d: ".06s" },
  { topic: "child", counts: [312, 140], d: ".12s" },
  { topic: "harassment", counts: [176, 93] },
  { topic: "healing", counts: [409], d: ".06s" },
  { topic: "workplace", counts: [154, 72], d: ".12s" },
];

const PROMISE_ICONS = ["lock", "eye", "exit"];

const d = (v) => ({ "--d": v });

function SupportButton({ label, count, heart }) {
  const [on, setOn] = useState(false);
  return (
    <button className="support-btn" type="button" aria-pressed={on} onClick={() => setOn(!on)}>
      {heart && <Icon name="heart" />}{label} · <span>{count + (on ? 1 : 0)}</span>
    </button>
  );
}

export default function Community() {
  const { t } = useLang();
  const c = t.community;
  usePageMeta(c.metaTitle, c.metaDesc);
  const [filter, setFilter] = useState("all");
  const shown = STORIES.filter((s) => filter === "all" || s.topic === filter).length;

  const shareButton = (cls, children, style) => (
    <DrawerTrigger drawer="share" drawerId="share-drawer" className={cls} style={style}>{children}</DrawerTrigger>
  );

  return (
    <>
      <Hero compact>
        <HeroKicker label={c.kickerB}>{c.kicker}</HeroKicker>
        <HeroTitle lines={c.heroLines} />
        <p className="lead">{c.heroLead}</p>
        <div className="btn-row">
          {shareButton("btn", <><Icon name="pen" />{c.share}</>)}
        </div>
        <div className="safety-promises">
          {c.promises.map(([title, text], i) => (
            <div className="promise" key={i}>
              <Icon name={PROMISE_ICONS[i]} />
              <div><strong>{title}</strong><span>{text}</span></div>
            </div>
          ))}
        </div>
      </Hero>

      <section className="section" id="helplines" aria-labelledby="helplines-title">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow reveal">{c.helpEyebrow}</p>
            <h2 id="helplines-title" className="reveal" style={d(".08s")}>{rich(c.helpTitle, "accent")}</h2>
            <p className="lead reveal" style={d(".16s")}>{c.helpLead}</p>
          </div>
          <ul className="helpline-grid">
            {HELPLINES.map((h, i) => {
              const copy = t.helplines[h.id];
              return (
                <li key={h.id} className={"helpline-card tilt reveal" + (h.urgent ? " helpline-card--urgent" : "")} style={d((i * 0.06).toFixed(2) + "s")}>
                  <div className="helpline-card__top">
                    <span className="helpline__icon"><Icon name={h.icon} /></span>
                    <span className="helpline-card__tag">{copy.tag}</span>
                  </div>
                  <h3>{copy.name}</h3>
                  <div className="helpline-card__number">{h.display || h.number}</div>
                  <p>{copy.desc}</p>
                  <a className={"btn" + (h.urgent ? " btn--light" : "")} href={telHref(h.number)}><Icon name="phone" />{t.common.callNow}</a>
                </li>
              );
            })}
          </ul>
          <p className="small-print">{c.helpNote}</p>
        </div>
      </section>

      <section className="section section--wash" id="share" aria-labelledby="feed-title">
        <div className="container">
          <div className="feed-head">
            <div className="section-head">
              <p className="eyebrow reveal">{c.feedEyebrow}</p>
              <h2 id="feed-title" className="reveal" style={d(".08s")}>{rich(c.feedTitle, "accent")}</h2>
              <p className="lead reveal" style={d(".16s")}>{c.feedLead}</p>
            </div>
            {shareButton("btn reveal", c.shareYours, d(".2s"))}
          </div>

          <div className="filters" role="group" aria-label={c.filterAria}>
            {FILTERS.map((v) => (
              <button key={v} className="chip" type="button" aria-pressed={filter === v} onClick={() => setFilter(v)}>{c.filters[v]}</button>
            ))}
          </div>
          <p className="sr-only" aria-live="polite">{filter === "all" ? "" : c.shown(shown)}</p>

          <div className="stories">
            {STORIES.map((s, i) => {
              const copy = c.stories[i];
              const body = <div className="story-card__body"><p>{copy.text}</p></div>;
              return (
                <article key={i} className="story-card reveal" style={s.d ? d(s.d) : undefined} hidden={filter !== "all" && s.topic !== filter}>
                  <div className="story-card__meta"><span className="tag">{copy.tag}</span><span>{copy.place} · {t.common.approved}</span></div>
                  {copy.cw ? <details className="cw"><summary>{copy.cw}</summary>{body}</details> : body}
                  <div className="story-card__foot">
                    {s.counts.map((count, j) => <SupportButton key={j} label={copy.reactions[j]} count={count} heart={j === 0} />)}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section--dark" aria-labelledby="mod-title">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow reveal">{c.modEyebrow}</p>
            <h2 id="mod-title" className="reveal" style={d(".08s")}>{c.modTitle}</h2>
          </div>
          <ol className="flow">
            {c.flow.map(([title, text], i) => (
              <li className="reveal" style={d(`${i * 0.08}s`)} key={i}><h3>{title}</h3><p>{text}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <SharePortal />
    </>
  );
}
