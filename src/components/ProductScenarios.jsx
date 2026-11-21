import Icon from "./Icon";
import { useLang } from "../i18n";

// Words in src/i18n → products.scenarios.items, same order.
const ICONS = ["bus", "moon", "school", "mountain"];
const d = (v) => ({ "--d": v });

/** "Built for the moments that matter": situations the planned tools are designed for. */
export default function ProductScenarios() {
  const { t } = useLang();
  const s = t.products.scenarios;
  return (
    <section className="section section--dark" aria-labelledby="scen-title">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow reveal">{s.eyebrow}</p>
          <h2 id="scen-title" className="reveal" style={d(".08s")}>{s.title}</h2>
          <p className="lead reveal" style={d(".16s")}>{s.lead}</p>
        </div>
        <div className="scenarios">
          {s.items.map(([title, text], i) => (
            <article className="scenario reveal" style={d(`${i * 0.08}s`)} key={i}>
              <span className="scenario__icon"><Icon name={ICONS[i]} /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
