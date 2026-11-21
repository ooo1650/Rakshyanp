import { useRef, useState } from "react";
import { rich, useLang } from "../i18n";

const d = (v) => ({ "--d": v });

// Illustrations for each step: SCENES[tool][step]. Captions come from i18n (products.guide.tools[tool].scenes).
const SCENES = [
  [
    <>
      <circle cx="150" cy="80" r="22" fill="none" stroke="#c4858c" strokeWidth="6" />
      <path d="M120 100h60l10 30-40 20-40-20Z" fill="#c4858c" opacity=".35" />
      <path d="M150 112c28 0 44 18 44 46 0 32-20 56-44 64-24-8-44-32-44-64 0-28 16-46 44-46Z" fill="#70020f" />
      <circle cx="150" cy="166" r="18" fill="#fedee1" />
    </>,
    <>
      <path d="M150 112c28 0 44 18 44 46 0 32-20 56-44 64-24-8-44-32-44-64 0-28 16-46 44-46Z" fill="#70020f" />
      <rect x="190" y="88" width="46" height="12" rx="6" fill="#c4858c" transform="rotate(-30 190 88)" />
      <circle className="signal" cx="150" cy="166" r="70" fill="none" stroke="#70020f" strokeWidth="4" />
      <circle className="signal" cx="150" cy="166" r="70" fill="none" stroke="#70020f" strokeWidth="4" />
      <circle className="signal" cx="150" cy="166" r="70" fill="none" stroke="#70020f" strokeWidth="4" />
      <text x="150" y="172" textAnchor="middle" className="guide__big" fill="#fedee1">130dB</text>
    </>,
    <>
      <path d="M150 112c28 0 44 18 44 46 0 32-20 56-44 64-24-8-44-32-44-64 0-28 16-46 44-46Z" fill="#70020f" />
      <g stroke="#e0a43a" strokeWidth="6" strokeLinecap="round"><path d="M150 60v-22M98 82 84 66M202 82l14-16M70 140H48M230 140h22" /></g>
      <circle cx="150" cy="150" r="20" fill="#ffe8a8" />
      <circle className="signal" cx="150" cy="150" r="40" fill="#ffe8a8" opacity=".6" />
    </>,
    <>
      <circle cx="110" cy="110" r="16" fill="#70020f" />
      <path d="M110 128v50M110 140l-20 22M110 140l24 16M110 178l-16 40M110 178l22 36" stroke="#70020f" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M160 160h80M220 140l20 20-20 20" stroke="#c4858c" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="200" y="70" width="52" height="40" rx="10" fill="#fedee1" stroke="#70020f" strokeWidth="3" />
      <text x="226" y="96" textAnchor="middle" className="guide__num" fill="#70020f">100</text>
    </>,
  ],
  [
    <>
      <rect x="60" y="100" width="70" height="70" rx="22" fill="#2a0a0f" stroke="#fedee1" strokeWidth="6" />
      <rect x="180" y="80" width="64" height="112" rx="14" fill="#fff" stroke="#70020f" strokeWidth="4" />
      <path d="M140 136h30" stroke="#c4858c" strokeWidth="4" strokeDasharray="4 6" strokeLinecap="round" />
      <circle cx="212" cy="118" r="10" fill="#fedee1" /><circle cx="212" cy="146" r="10" fill="#fedee1" />
    </>,
    <>
      <rect x="100" y="90" width="100" height="100" rx="32" fill="#2a0a0f" stroke="#fedee1" strokeWidth="8" />
      <circle cx="150" cy="140" r="18" fill="#9b0a1d" />
      <rect x="204" y="126" width="12" height="28" rx="6" fill="#c4858c" />
      <text x="246" y="122" className="guide__big" fill="#70020f">×3</text>
      <circle className="signal" cx="150" cy="140" r="30" fill="none" stroke="#c4858c" strokeWidth="3" />
    </>,
    <>
      <path d="M150 70c-26 0-46 20-46 46 0 36 46 84 46 84s46-48 46-84c0-26-20-46-46-46Z" fill="#70020f" />
      <circle cx="150" cy="116" r="16" fill="#fedee1" />
      <circle className="signal" cx="150" cy="200" r="50" fill="none" stroke="#70020f" strokeWidth="3" />
      <circle className="signal" cx="150" cy="200" r="50" fill="none" stroke="#70020f" strokeWidth="3" />
    </>,
    <>
      <circle cx="100" cy="120" r="30" fill="#fedee1" stroke="#70020f" strokeWidth="4" />
      <circle cx="200" cy="120" r="30" fill="#fedee1" stroke="#70020f" strokeWidth="4" />
      <circle cx="150" cy="190" r="30" fill="#70020f" />
      <path d="M120 135l20 30M180 135l-20 30" stroke="#c4858c" strokeWidth="5" strokeLinecap="round" />
      <path d="M138 190l8 8 16-16" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>,
  ],
];

/** "How it works, step by step": product tabs, a step list, a slider and an animated illustration. */
export default function ProductGuide() {
  const { t } = useLang();
  const g = t.products.guide;
  const [tool, setTool] = useState(0);
  const [step, setStep] = useState(0);
  const tabRefs = useRef([]);
  const steps = g.tools[tool].steps;

  const selectTool = (i) => { setTool(i); setStep(0); };
  const onTabKey = (e, i) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const n = (i + dir + g.tools.length) % g.tools.length;
    selectTool(n);
    tabRefs.current[n]?.focus();
  };

  return (
    <section className="section" id="guide" aria-labelledby="guide-title">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow reveal">{g.eyebrow}</p>
          <h2 id="guide-title" className="reveal" style={d(".08s")}>{rich(g.title, "accent")}</h2>
          <p className="lead reveal" style={d(".16s")}>{g.lead}</p>
        </div>

        <div className="guide">
          <div className="reveal reveal--left">
            <div className="tabs" role="tablist" aria-label={g.tabsAria}>
              {g.tools.map((tl, i) => (
                <button key={i} ref={(el) => (tabRefs.current[i] = el)} role="tab" type="button" id={`guide-tab-${i}`}
                  aria-controls={`guide-panel-${i}`} aria-selected={tool === i} tabIndex={tool === i ? 0 : -1}
                  onClick={() => selectTool(i)} onKeyDown={(e) => onTabKey(e, i)}>
                  {tl.name}
                </button>
              ))}
            </div>

            {g.tools.map((tl, i) => (
              <div key={i} role="tabpanel" id={`guide-panel-${i}`} aria-labelledby={`guide-tab-${i}`} hidden={tool !== i}>
                <ol className="steps-list">
                  {tl.steps.map(([title, text], j) => (
                    <li key={j} className={tool === i && step === j ? "is-on" : ""}>
                      <button type="button" aria-current={tool === i && step === j ? "step" : undefined} onClick={() => setStep(j)}>
                        <b>{j + 1}</b><span><strong>{title}</strong><span>{text}</span></span>
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            ))}

            <div className="range">
              <label htmlFor="guide-range"><span>{g.rangeLabel}</span><output htmlFor="guide-range">{g.stepOf(step + 1, steps.length)}</output></label>
              <input type="range" id="guide-range" min="1" max={steps.length} step="1" value={step + 1}
                onChange={(e) => setStep(Number(e.target.value) - 1)} />
            </div>
          </div>

          <div className="guide__visual reveal reveal--scale" aria-hidden="true">
            <svg viewBox="0 0 300 300">
              {SCENES.map((toolScenes, i) => toolScenes.map((scene, j) => (
                <g key={`${i}-${j}`} className={"scene" + (tool === i && step === j ? " is-on" : "")}>
                  {scene}
                  <text x="150" y="268" textAnchor="middle" className="guide__caption" fill="#5c2a31">{g.tools[i].scenes[j]}</text>
                </g>
              )))}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
