import { createContext, useCallback, useContext, useEffect, useState } from "react";
import en from "./en";
import ne from "./ne";

export const DICTS = { en, ne };
const KEY = "rakshya.lang";

/** Language on first load: ?lang= in the URL, then the saved choice, then the browser's language. */
function initialLang() {
  const fromUrl = new URLSearchParams(window.location.search).get("lang");
  if (fromUrl && fromUrl in DICTS) return fromUrl;
  try {
    const saved = localStorage.getItem(KEY);
    if (saved && saved in DICTS) return saved;
  } catch { /* storage blocked: fall through */ }
  return (navigator.language || "").toLowerCase().startsWith("ne") ? "ne" : "en";
}

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(initialLang);

  const setLang = useCallback((next) => {
    setLangState(next);
    try { localStorage.setItem(KEY, next); } catch { /* per-visit only */ }
  }, []);

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  return <LangContext.Provider value={{ lang, setLang, t: DICTS[lang] }}>{children}</LangContext.Provider>;
}

/** `t` is the current language's dictionary, e.g. `t.about.heroLead`. */
export const useLang = () => useContext(LangContext);

/**
 * Renders the light markup used in the dictionaries:
 * `*text*` → <em className={emClass}>, `**text**` → <strong>.
 */
export function rich(text, emClass) {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean).map((part, i) => {
    if (part.startsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*")) return <em key={i} className={emClass}>{part.slice(1, -1)}</em>;
    return part;
  });
}
