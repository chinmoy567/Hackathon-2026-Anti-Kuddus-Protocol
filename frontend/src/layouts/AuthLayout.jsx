import { Outlet } from "react-router-dom";

export const AuthLayout = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
    <div className="w-full max-w-sm">
      <Outlet />
    </div>
  </div>
);
