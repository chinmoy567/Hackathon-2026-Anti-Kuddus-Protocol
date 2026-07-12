import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useSocket } from "../hooks/useSocket.js";
import { SocketProvider } from "../context/SocketContext.jsx";

// No nav link is ever rendered for a role that can't use the destination —
// belt-and-suspenders UI hygiene; the real boundary is server-side
// (Frontend.md FE-3, esp. captain_1st / Kuddus).
const AppShell = () => {
  useSocket();
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="text-base font-semibold tracking-tight text-slate-900">
            Anti-Kuddus Protocol
          </span>
          <div className="flex items-center gap-3 text-sm sm:gap-5">
            <Link to="/dashboard" className="text-slate-600 transition-colors duration-150 hover:text-slate-900">
              Dashboard
            </Link>
            {role === "student" && (
              <Link
                to="/complaints/new"
                className="text-slate-600 transition-colors duration-150 hover:text-slate-900"
              >
                New Complaint
              </Link>
            )}
            <span className="hidden text-slate-400 sm:inline">{user?.name}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 transition-colors
                duration-150 hover:bg-slate-100 active:scale-95"
            >
              Log out
            </button>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
};

export const AppLayout = () => (
  <SocketProvider>
    <AppShell />
  </SocketProvider>
);
