import { Link } from "react-router-dom";
import { NAV } from "./Header";
import { useLang } from "../i18n";

export default function Footer() {
  const { t } = useLang();
  const f = t.footer;
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link className="brand" to="/"><span>Rakshya<i>.</i></span></Link>
            <p>{f.blurb} {f.dangerPre} <a href="tel:100">100</a>{f.dangerPost === "." ? "." : " " + f.dangerPost}</p>
          </div>
          <div>
            <h2>{f.explore}</h2>
            <ul>{NAV.map((n) => <li key={n.to}><Link to={n.to}>{t.nav[n.key]}</Link></li>)}</ul>
          </div>
          <div>
            <h2>{f.urgent}</h2>
            <ul>
              <li><a href="tel:100">{f.police}</a></li>
              <li><a href="tel:1145">{f.women}</a></li>
              <li><a href="tel:1098">{f.child}</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-base">
          <span>© {new Date().getFullYear()} {f.made}</span>
          <span>{f.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
