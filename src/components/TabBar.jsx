import { Link, NavLink } from "react-router-dom";
import { EmergencyButton } from "./EmergencyDrawer";
import Icon from "./Icon";
import { useLang } from "../i18n";

/**
 * Bottom navigation for phones and tablets: the one place for page links and the
 * emergency button, all within thumb reach. Hidden on desktop (see .tabbar in styles.css).
 */
export default function TabBar() {
  const { t } = useLang();
  return (
    <nav className="tabbar" aria-label={t.nav.tabbarAria}>
      <NavLink to="/" end className="tabbar__item"><Icon name="home" strokeWidth={1.8} /><span>{t.nav.tabHome}</span></NavLink>
      <NavLink to="/community" className="tabbar__item"><Icon name="users" strokeWidth={1.8} /><span>{t.nav.tabCommunity}</span></NavLink>
      <EmergencyButton className="tabbar__item tabbar__sos">
        <span className="tabbar__orb" aria-hidden="true">SOS</span>
        <span>{t.nav.tabSos}</span>
      </EmergencyButton>
      <NavLink to="/products" className="tabbar__item"><Icon name="box" strokeWidth={1.8} /><span>{t.nav.tabProducts}</span></NavLink>
      <Link to="/products#contact" className="tabbar__item"><Icon name="mail" strokeWidth={1.8} /><span>{t.nav.tabContact}</span></Link>
    </nav>
  );
}
