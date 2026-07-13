import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Siren, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Portals", href: "#portals" },
  { label: "Missions", href: "#missions" },
  { label: "How it works", href: "#workflow" },
  { label: "Impact", href: "#impact" },
];

// Sticky navbar: transparent over the dark hero, frosted glass once scrolled.
export const LandingNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-slate-950/80 shadow-lg shadow-slate-950/20 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <a href="#top" className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-rose-500 text-slate-950 shadow-lg shadow-rose-500/25 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
            <Siren className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-sm font-bold tracking-tight text-white sm:text-base">
            Anti-Kuddus <span className="text-amber-400">Protocol</span>
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-300 transition-colors duration-200 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-white/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-300 hover:shadow-amber-400/30 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Enter the Protocol
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="grid h-10 w-10 place-items-center rounded-xl text-slate-200 transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 md:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-b border-white/10 bg-slate-950/95 backdrop-blur-xl md:hidden"
          >
            <div className="space-y-1 px-4 pb-5 pt-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-200 transition-colors duration-200 hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="mt-3 block rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-slate-950 transition-colors duration-200 hover:bg-amber-300"
              >
                Enter the Protocol
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
