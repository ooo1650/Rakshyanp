import { Link } from "react-router-dom";
import Drawer, { DrawerTrigger, useDrawers } from "./Drawer";
import Icon from "./Icon";
import { HELPLINES, telHref } from "../data/helplines";
import { useLang } from "../i18n";

export function EmergencyButton({ className = "sos-btn", children }) {
  const { t } = useLang();
  return (
    <DrawerTrigger as="a" href="/community#helplines" drawer="emergency" drawerId="emergency-drawer" className={className}>
      {children || <><span className="dot" aria-hidden="true" />{t.common.emergencyHelp}</>}
    </DrawerTrigger>
  );
}

export default function EmergencyDrawer() {
  const { closeDrawer } = useDrawers();
  const { t } = useLang();
  return (
    <Drawer id="emergency-drawer" name="emergency" labelledBy="emergency-title">
      <div className="drawer__head">
        <div>
          <h2 id="emergency-title">{t.emergency.title}</h2>
          <p>{t.emergency.sub}</p>
        </div>
        <button className="icon-btn" type="button" onClick={closeDrawer} aria-label={t.emergency.closeAria}>
          <Icon name="close" strokeWidth={2.2} />
        </button>
      </div>
      <div className="drawer__body">
        <a className="urgent-banner" href="tel:100" data-autofocus>
          <Icon name="shield" width="26" height="26" />
          <span>{t.emergency.dangerQ}<br /><small>{t.emergency.callPolice}</small></span>
          <strong>100</strong>
        </a>
        <ul className="helpline-list">
          {HELPLINES.map((h) => {
            const copy = t.helplines[h.id];
            const shown = h.display || h.number;
            return (
              <li className="helpline" key={h.id}>
                <span className="helpline__icon"><Icon name={h.icon} /></span>
                <span>
                  <span className="helpline__name">{copy.name}</span>
                  <span className="helpline__desc">{copy.desc}</span>
                </span>
                <a className="helpline__call" href={telHref(h.number)} aria-label={t.emergency.callAria(copy.name, shown)}>
                  <Icon name="phone" />{shown}
                </a>
              </li>
            );
          })}
        </ul>
        <p className="small-print">{t.emergency.note}</p>
        <p className="small-print"><Link to="/community#helplines" onClick={closeDrawer}>{t.emergency.fullDir}</Link></p>
      </div>
    </Drawer>
  );
}
