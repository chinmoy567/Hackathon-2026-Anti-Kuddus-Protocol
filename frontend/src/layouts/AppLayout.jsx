import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useSocket } from "../hooks/useSocket.js";
import { SocketProvider } from "../context/SocketContext.jsx";
import { SosButton } from "../components/sos/SosButton.jsx";

const SOS_DASHBOARD_ROLES = ["captain_2nd", "captain_3rd", "teacher"];

// No nav link is ever rendered for a role that can't use the destination —
// belt-and-suspenders UI hygiene; the real boundary is server-side
// (Frontend.md FE-3, esp. captain_1st / Kuddus).
const AppShell = () => {
  useSocket();
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const navLinks = (
    <>
      <Link to="/dashboard" className="text-slate-600 transition-colors duration-150 hover:text-slate-900">
        Dashboard
      </Link>
      <Link to="/ledger" className="text-slate-600 transition-colors duration-150 hover:text-slate-900">
        Ledger Dashboard
      </Link>
      {role === "student" && (
        <Link to="/complaints/new" className="text-slate-600 transition-colors duration-150 hover:text-slate-900">
          New Complaint
        </Link>
      )}
      {role === "student" && (
        <Link to="/ledger/new" className="text-slate-600 transition-colors duration-150 hover:text-slate-900">
          Log Ledger Entry
        </Link>
      )}
      {SOS_DASHBOARD_ROLES.includes(role) && (
        <Link to="/sos" className="text-slate-600 transition-colors duration-150 hover:text-slate-900">
          SOS Alerts
        </Link>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="text-base font-semibold tracking-tight text-slate-900">
            Anti-Kuddus Protocol
          </span>

          <div className="hidden items-center gap-5 text-sm sm:flex">
            {navLinks}
            <span className="text-slate-400">{user?.name}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 transition-colors
                duration-150 hover:bg-slate-100 active:scale-95"
            >
              Log out
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="rounded-lg border border-slate-300 p-2 text-slate-700 transition-colors
              duration-150 hover:bg-slate-100 active:scale-95 sm:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-slate-200 px-4 py-3 sm:hidden">
            <div className="flex flex-col gap-3 text-sm">
              {navLinks}
              <span className="text-slate-400">{user?.name}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="w-fit rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 transition-colors
                  duration-150 hover:bg-slate-100 active:scale-95"
              >
                Log out
              </button>
            </div>
          </div>
        )}
      </nav>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
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
