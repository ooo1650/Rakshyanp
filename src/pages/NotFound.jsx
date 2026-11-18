import { Link } from "react-router-dom";
import Hero, { HeroKicker, HeroTitle } from "../components/Hero";
import { usePageMeta } from "../hooks/motion";
import { useLang } from "../i18n";

export default function NotFound() {
  const { t } = useLang();
  const n = t.notFound;
  usePageMeta(n.metaTitle);
  return (
    <Hero compact>
      <HeroKicker label="404">{n.kicker}</HeroKicker>
      <HeroTitle lines={n.heroLines} />
      <p className="lead">{n.lead}</p>
      <div className="btn-row"><Link className="btn" to="/">{n.home}</Link></div>
    </Hero>
  );
}
