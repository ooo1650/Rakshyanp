import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../hooks/motion";

const DrawerContext = createContext(null);
export const useDrawers = () => useContext(DrawerContext);

/** Holds which drawer is open ("emergency" | "share" | null) and restores focus on close. */
export function DrawerProvider({ children }) {
  const [open, setOpen] = useState(null);
  const openerRef = useRef(null);

  const openDrawer = useCallback((name, opener) => {
    setOpen((current) => {
      // Switching drawers keeps the original opener so focus returns to the page, not a hidden panel.
      if (!current) openerRef.current = opener || document.activeElement;
      return name;
    });
  }, []);

  const closeDrawer = useCallback(() => {
    setOpen(null);
    const el = openerRef.current;
    openerRef.current = null;
    if (el && el.focus && document.contains(el)) setTimeout(() => el.focus(), 0);
  }, []);

  useEffect(() => { document.body.classList.toggle("is-locked", !!open); }, [open]);

  return <DrawerContext.Provider value={{ open, openDrawer, closeDrawer }}>{children}</DrawerContext.Provider>;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/** Accessible side drawer / bottom sheet: focus trap, Esc to close, scrim click, slide transition. */
export default function Drawer({ id, name, labelledBy, children }) {
  const { open, closeDrawer } = useDrawers();
  const isOpen = open === name;
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    const reduce = prefersReducedMotion();
    if (isOpen) {
      setMounted(true);
      let r2;
      const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setShown(true)); });
      return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
    }
    setShown(false);
    const t = setTimeout(() => setMounted(false), reduce ? 0 : 550);
    return () => clearTimeout(t);
  }, [isOpen]);

  // Move focus into the panel once it is visible (a `visibility: hidden` element cannot take focus).
  useEffect(() => {
    if (!shown || !isOpen) return;
    const p = panelRef.current;
    (p.querySelector("[data-autofocus]") || p).focus();
  }, [shown, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    // Capture phase + preventDefault so the quick-exit "Esc twice" shortcut ignores this press.
    const onKey = (e) => {
      if (e.key === "Escape") { e.preventDefault(); closeDrawer(); return; }
      if (e.key !== "Tab") return;
      const f = Array.from(panelRef.current.querySelectorAll(FOCUSABLE)).filter((n) => n.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [isOpen, closeDrawer]);

  return (
    <div className={"drawer" + (shown ? " is-open" : "")} id={id} hidden={!mounted} aria-hidden={!isOpen}>
      <div className="drawer__scrim" onClick={closeDrawer} />
      <div className="drawer__panel" role="dialog" aria-modal="true" aria-labelledby={labelledBy} tabIndex={-1} ref={panelRef}>
        {children}
      </div>
    </div>
  );
}

/** A link/button that opens a drawer. Falls back to `href` semantics for the emergency directory. */
export function DrawerTrigger({ drawer, drawerId, as: Tag = "button", children, ...rest }) {
  const { open, openDrawer } = useDrawers();
  const props = Tag === "button" ? { type: "button" } : {};
  return (
    <Tag {...props} {...rest}
      aria-controls={drawerId} aria-expanded={open === drawer} aria-haspopup="dialog"
      onClick={(e) => { e.preventDefault(); openDrawer(drawer, e.currentTarget); }}>
      {children}
    </Tag>
  );
}
