import { useEffect, useRef, useState } from "react";
import Drawer, { useDrawers } from "./Drawer";
import Icon from "./Icon";
import { useLang } from "../i18n";

const TOPICS = ["harassment", "misconduct", "assault", "child", "abduction", "other"];
const REGIONS = ["", "koshi", "madhesh", "bagmati", "gandaki", "lumbini", "karnali", "sudurpashchim", "outside"];

const MIN = 40, MAX = 3000, LAST = 4;
const PII = /(\b\d{7,}\b)|([\w.+-]+@[\w-]+\.[\w.]+)|(\b98\d{8}\b)/;
const EMPTY = { topic: "", story: "", region: "", consentModeration: false, consentAnon: false, wantSupport: false };

// PREVIEW ONLY: the form is a demo and nothing is sent or stored. The copy says so (share.sub,
// share.s5Hint). To go live, POST the entry from onSubmit to a moderation endpoint that does not log
// IP addresses or set identifying cookies, then restore a real confirmation message.

export default function SharePortal() {
  const { open, openDrawer, closeDrawer } = useDrawers();
  const { t } = useLang();
  const s = t.share;
  const [step, setStep] = useState(0);
  const [data, setData] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const headings = useRef([]);
  const storyRef = useRef(null);
  const moved = useRef(false);

  // Start over when the drawer is opened again after a finished submission.
  useEffect(() => { if (open === "share" && step === LAST) { moved.current = false; setStep(0); } }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Move focus to the new step's heading (not on first render).
  useEffect(() => { if (moved.current) headings.current[step]?.focus(); }, [step]);

  // Error messages are stored as keys so they follow a language switch.
  const errorText = (key) => (key === "story" ? s.errStory(MIN) : key === "topic" ? s.errTopic : key === "consent" ? s.errConsent : "");

  const set = (k) => (e) => setData((d) => ({ ...d, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  const go = (n) => { moved.current = true; setStep(n); };

  function validate() {
    if (step === 0) {
      const ok = !!data.topic;
      setErrors({ topic: ok ? "" : "topic" });
      return ok;
    }
    if (step === 1) {
      const ok = data.story.trim().length >= MIN;
      setErrors({ story: ok ? "" : "story" });
      if (!ok) storyRef.current?.focus();
      return ok;
    }
    if (step === 2) {
      const ok = data.consentModeration && data.consentAnon;
      setErrors({ consent: ok ? "" : "consent" });
      return ok;
    }
    return true;
  }

  const next = () => { if (validate()) go(Math.min(step + 1, LAST)); };
  const back = () => go(Math.max(step - 1, 0));

  function onSubmit(e) {
    e.preventDefault();
    setData(EMPTY); // discard what was typed: nothing leaves the browser
    go(LAST);
  }

  const h3 = (i, id, text) => <h3 id={id} tabIndex={-1} ref={(el) => (headings.current[i] = el)}>{text}</h3>;
  const stepProps = (i, id, extra = "") => ({ className: "step" + extra + (step === i ? " is-active" : ""), hidden: step !== i, "aria-labelledby": id });

  return (
    <Drawer id="share-drawer" name="share" labelledBy="share-title">
      <div className="drawer__head">
        <div>
          <h2 id="share-title">{s.title}</h2>
          <p>{s.sub}</p>
        </div>
        <button className="icon-btn" type="button" onClick={closeDrawer} aria-label={s.closeAria}>
          <Icon name="close" strokeWidth={2.2} />
        </button>
      </div>
      <div className="drawer__body">
        <ol className="portal-steps" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => <li key={i} className={i < step ? "is-done" : i === step ? "is-current" : ""} />)}
        </ol>

        <form noValidate autoComplete="off" onSubmit={onSubmit}>
          <section {...stepProps(0, "s1-title")}>
            {h3(0, "s1-title", s.s1Title)}
            <p className="step__hint">{s.s1Hint}</p>
            <fieldset className="choice-grid">
              <legend className="sr-only">{s.topicLegend}</legend>
              {TOPICS.map((v) => (
                <label className="choice" key={v}>
                  <input type="radio" name="topic" value={v} checked={data.topic === v} onChange={set("topic")} />
                  <span>{s.topics[v].title}<small>{s.topics[v].hint}</small></span>
                </label>
              ))}
            </fieldset>
            <p className="field__error" role="alert">{errorText(errors.topic)}</p>
            <div className="notice">
              <Icon name="alert" />
              <span><strong>{s.dangerQ}</strong> {s.dangerPre} <a href="tel:100">{s.dangerPolice}</a> {s.dangerOr} <a href="tel:1098">{s.dangerChild}</a>{s.dangerPost === "." ? "." : " " + s.dangerPost}</span>
            </div>
            <div className="step__nav"><span /><button className="btn" type="button" onClick={next}>{s.next}</button></div>
          </section>

          <section {...stepProps(1, "s2-title")}>
            {h3(1, "s2-title", s.s2Title)}
            <p className="step__hint">{s.s2Hint}</p>
            <div className="field">
              <label htmlFor="story-text">{s.storyLabel}</label>
              <textarea id="story-text" ref={storyRef} maxLength={MAX} aria-describedby="story-count err-story" spellCheck
                value={data.story} onChange={set("story")} />
              <div className="field__meta">
                {PII.test(data.story) && <span>{s.pii}</span>}
                <span id="story-count" style={{ marginLeft: "auto" }}>{data.story.length} / {MAX}</span>
              </div>
              <p className="field__error" id="err-story" role="alert">{errorText(errors.story)}</p>
            </div>
            <div className="field">
              <label htmlFor="region">{s.province} <span style={{ fontWeight: 400, color: "var(--ink-soft)" }}>{s.optional}</span></label>
              <select id="region" value={data.region} onChange={set("region")}>
                {REGIONS.map((v) => <option key={v} value={v}>{s.regions[v]}</option>)}
              </select>
            </div>
            <div className="step__nav"><button className="btn btn--ghost" type="button" onClick={back}>{s.back}</button><button className="btn" type="button" onClick={next}>{s.next}</button></div>
          </section>

          <section {...stepProps(2, "s3-title")}>
            {h3(2, "s3-title", s.s3Title)}
            <p className="step__hint">{s.s3Hint}</p>
            <div className="notice">
              <Icon name="shield" />
              <span><strong>{s.queueTitle}</strong> {s.queueText}</span>
            </div>
            <label className="check"><input type="checkbox" checked={data.consentModeration} onChange={set("consentModeration")} /> <span>{s.consentMod}</span></label>
            <label className="check"><input type="checkbox" checked={data.consentAnon} onChange={set("consentAnon")} /> <span>{s.consentAnon}</span></label>
            <label className="check"><input type="checkbox" checked={data.wantSupport} onChange={set("wantSupport")} /> <span>{s.wantSupport}</span></label>
            <p className="field__error" role="alert">{errorText(errors.consent)}</p>
            <div className="step__nav"><button className="btn btn--ghost" type="button" onClick={back}>{s.back}</button><button className="btn" type="button" onClick={next}>{s.review}</button></div>
          </section>

          <section {...stepProps(3, "s4-title")}>
            {h3(3, "s4-title", s.s4Title)}
            <p className="step__hint">{s.s4Hint}</p>
            <dl className="review-box">
              <dt>{s.rTopic}</dt><dd>{data.topic ? s.topics[data.topic].label : "—"}</dd>
              <dt>{s.rProvince}</dt><dd>{data.region ? s.regions[data.region] : s.notShared}</dd>
              <dt>{s.rWords}</dt><dd>{data.story.trim() || "—"}</dd>
              <dt>{s.rSupport}</dt><dd>{data.wantSupport ? s.yesSupport : s.no}</dd>
            </dl>
            <div className="step__nav">
              <button className="btn btn--ghost" type="button" onClick={back}>{s.edit}</button>
              <button className="btn" type="submit">{s.submit}</button>
            </div>
          </section>

          <section {...stepProps(4, "s5-title", " success")}>
            <div className="success__mark"><Icon name="check" strokeWidth={2.5} /></div>
            {h3(4, "s5-title", s.s5Title)}
            <p className="step__hint">{s.s5Hint}</p>
            <div className="btn-row" style={{ justifyContent: "center", marginTop: "1.25rem" }}>
              <button className="btn" type="button" onClick={(e) => openDrawer("emergency", e.currentTarget)}>{s.seeSupport}</button>
              <button className="btn btn--ghost" type="button" onClick={closeDrawer}>{t.common.close}</button>
            </div>
          </section>
        </form>
      </div>
    </Drawer>
  );
}
