import { useEffect, useState } from "react";
import Icon from "./Icon";
import { useLang } from "../i18n";

const SAFE_URL = "https://www.google.com/search?q=weather+kathmandu";
const INTRO_KEY = "rakshya.quickExitIntroSeen";

function leave() {
  try { document.body.innerHTML = ""; } catch { /* noop */ }
  window.location.replace(SAFE_URL); // replace() keeps this site out of the back-button history
}

const introSeen = () => { try { return localStorage.getItem(INTRO_KEY) === "1"; } catch { return false; } };
const markIntroSeen = () => { try { localStorage.setItem(INTRO_KEY, "1"); } catch { /* private mode: show again next visit */ } };

/**
 * Trauma-informed quick exit, shown in the header on the community page.
 * The button, or Esc twice quickly (ignored while a drawer handles Esc), swaps the page
 * for a harmless weather search. A short note explains this on the first visit,
 * and again on mouse hover or keyboard focus.
 */
export default function QuickExit() {
  const { t } = useLang();
  const [intro, setIntro] = useState(false);

  useEffect(() => {
    if (introSeen()) return;
    const timer = setTimeout(() => setIntro(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let last = 0;
    const onKey = (e) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      const now = Date.now();
      if (now - last < 600) leave();
      last = now;
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const dismiss = () => { setIntro(false); markIntroSeen(); };

  return (
    <div className={"quick-exit-wrap" + (intro ? " is-intro" : "")}>
      <button className="quick-exit" type="button" onClick={leave} aria-describedby="quick-exit-tip">
        <Icon name="exit" width="18" height="18" strokeWidth={2.2} />
        <span className="label-long">{t.quickExit.label}</span>
        <span className="label-short">{t.quickExit.short}</span>
      </button>
      {/* After the button so CSS can show it on the button's hover / keyboard focus */}
      <div className="quick-exit__tip" id="quick-exit-tip" role={intro ? "note" : "tooltip"}>
        <strong>{t.quickExit.tipTitle}</strong>
        <span>{t.quickExit.tipBody}<span className="quick-exit__keys">{t.quickExit.tipKeys}</span></span>
        {intro && <button type="button" className="quick-exit__ok" onClick={dismiss}>{t.quickExit.gotIt}</button>}
      </div>
    </div>
  );
}
