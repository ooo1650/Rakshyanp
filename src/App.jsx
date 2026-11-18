import { useEffect } from "react";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TabBar from "./components/TabBar";
import EmergencyDrawer from "./components/EmergencyDrawer";
import { DrawerProvider } from "./components/Drawer";
import { useReveal, useTilt } from "./hooks/motion";
import { useLang } from "./i18n";
import About from "./pages/About";
import Community from "./pages/Community";
import Products from "./pages/Products";
import NotFound from "./pages/NotFound";

/** Scroll to the top on page change, or to `#hash` when the URL has one. */
function useScrollRestore() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) { el.scrollIntoView(); return; }
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, hash]);
}

function Layout() {
  const { pathname } = useLocation();
  const { t, lang } = useLang();
  useScrollRestore();
  // Re-scan when the page or language changes (new text = new elements to reveal / tilt)
  useReveal(pathname + lang);
  useTilt(pathname + lang);

  return (
    <DrawerProvider>
      <a className="skip-link" href="#main">{t.common.skip}</a>
      <Header />
      <main id="main"><Outlet /></main>
      <Footer />
      <TabBar />
      <EmergencyDrawer />
    </DrawerProvider>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<About />} />
        <Route path="community" element={<Community />} />
        <Route path="products" element={<Products />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
