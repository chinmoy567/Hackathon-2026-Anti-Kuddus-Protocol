import { useState } from "react";
import { Outlet, Link, useNavigate, useLocation, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Siren, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";
import { useSocket } from "../hooks/useSocket.js";
import { useSosOfflineSync } from "../hooks/useSosOfflineSync.js";
import { SocketProvider } from "../context/SocketContext.jsx";
import { SosButton } from "../components/sos/SosButton.jsx";

const SOS_DASHBOARD_ROLES = ["captain_2nd", "captain_3rd", "teacher"];

const EASE_OUT = [0.22, 1, 0.36, 1];

// No nav link is ever rendered for a role that can't use the destination —
// belt-and-suspenders UI hygiene; the real boundary is server-side
// (Frontend.md FE-3, esp. captain_1st / Kuddus).
const AppShell = () => {
  useSocket();
  useSosOfflineSync();
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/ledger", label: "Ledger Dashboard" },
    { to: "/syllabus", label: "Syllabus Negotiator" },
    { to: "/fact-check", label: "Fact-Checker" },
    ...(role === "student" ? [{ to: "/complaints/new", label: "New Complaint" }] : []),
    ...(role === "student" ? [{ to: "/ledger/new", label: "Log Ledger Entry" }] : []),
    ...(role === "teacher" ? [{ to: "/seat-planner/roster", label: "Seat Planner" }] : []),
    ...(SOS_DASHBOARD_ROLES.includes(role) ? [{ to: "/sos", label: "SOS Alerts" }] : []),
  ];

  // Seat Planner has two routes (roster + grid); either should highlight the same nav item.
  const isSeatPlannerActive = (to) =>
    to === "/seat-planner/roster" && location.pathname.startsWith("/seat-planner");

  const navLinkClass = (to) => ({ isActive }) =>
    `rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
      isActive || isSeatPlannerActive(to) ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
    }`;

  const mobileNavLinkClass = (to) => ({ isActive }) =>
    `block rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200 ${
      isActive || isSeatPlannerActive(to) ? "bg-white/10 text-white" : "text-slate-200 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/95 shadow-lg shadow-slate-950/20 backdrop-blur-xl">
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        >
          <Link
            to="/dashboard"
            className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-rose-500 text-slate-950 shadow-lg shadow-rose-500/25 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
              <Siren className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="hidden text-sm font-bold tracking-tight text-white sm:inline sm:text-base">
              Anti-Kuddus <span className="text-amber-400">Protocol</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass(link.to)}>
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <span className="max-w-[10rem] truncate text-sm text-slate-400">{user?.name}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm font-semibold text-white backdrop-blur transition-all duration-200 hover:border-white/30 hover:bg-white/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Log out
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="grid h-10 w-10 place-items-center rounded-xl text-slate-200 transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 lg:hidden"
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
              transition={{ duration: 0.3, ease: EASE_OUT }}
              className="overflow-hidden border-b border-white/10 bg-slate-950/95 backdrop-blur-xl lg:hidden"
            >
              <div className="space-y-1 px-4 pb-5 pt-2">
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className={mobileNavLinkClass(link.to)}
                  >
                    {link.label}
                  </NavLink>
                ))}
                <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/10 px-4 pt-3">
                  <span className="truncate text-sm text-slate-400">{user?.name}</span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/10 active:scale-95"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Log out
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      {role === "student" && <SosButton />}
    </div>
  );
};

export const AppLayout = () => (
  <SocketProvider>
    <AppShell />
  </SocketProvider>
);
