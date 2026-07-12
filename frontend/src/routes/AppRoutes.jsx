import { Routes, Route, Navigate } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout.jsx";
import { AppLayout } from "../layouts/AppLayout.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { RoleRoute } from "./RoleRoute.jsx";
import { LoginPage } from "../pages/LoginPage.jsx";
import { DashboardPage } from "../pages/DashboardPage.jsx";
import { ComplaintFormPage } from "../pages/ComplaintFormPage.jsx";

// Three routes for Mission 1 (Frontend.md §2) — no separate /complaints list
// route; the triage/read-only list is a section of DashboardPage.
export const AppRoutes = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<LoginPage />} />
    </Route>

    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route element={<RoleRoute allowedRoles={["student"]} />}>
          <Route path="/complaints/new" element={<ComplaintFormPage />} />
        </Route>
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);
