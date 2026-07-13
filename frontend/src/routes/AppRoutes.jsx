import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout.jsx";
import { AppLayout } from "../layouts/AppLayout.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { RoleRoute } from "./RoleRoute.jsx";
import { LoginPage } from "../pages/LoginPage.jsx";
import { DashboardPage } from "../pages/DashboardPage.jsx";
import { ComplaintFormPage } from "../pages/ComplaintFormPage.jsx";
import { CaptainSosPage } from "../pages/CaptainSosPage.jsx";
import { StudentRosterPage } from "../pages/StudentRosterPage.jsx";
import { GridPlannerPage } from "../pages/SeatPlanner/GridPlannerPage.jsx";
import { LedgerEntryPage } from "../pages/LedgerEntryPage.jsx";
import { LedgerDashboardPage } from "../pages/LedgerDashboardPage.jsx";
import { SyllabusNegotiatorPage } from "../pages/SyllabusNegotiatorPage.jsx";
import { FactCheckPage } from "../pages/FactCheckPage.jsx";

// Landing page is public and animation-heavy — lazy-load it off the app bundle.
const LandingPage = lazy(() =>
  import("../pages/LandingPage.jsx").then((m) => ({ default: m.LandingPage }))
);

// Three routes for Mission 1 (Frontend.md §2) — no separate /complaints list
// route; the triage/read-only list is a section of DashboardPage.
export const AppRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
          <LandingPage />
        </Suspense>
      }
    />

    <Route element={<AuthLayout />}>
      <Route path="/login" element={<LoginPage />} />
    </Route>

    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/ledger" element={<LedgerDashboardPage />} />
        <Route path="/syllabus" element={<SyllabusNegotiatorPage />} />
        <Route path="/fact-check" element={<FactCheckPage />} />
        <Route element={<RoleRoute allowedRoles={["student"]} />}>
          <Route path="/complaints/new" element={<ComplaintFormPage />} />
          <Route path="/ledger/new" element={<LedgerEntryPage />} />
        </Route>
        <Route element={<RoleRoute allowedRoles={["captain_2nd", "captain_3rd", "teacher"]} />}>
          <Route path="/sos" element={<CaptainSosPage />} />
        </Route>
        <Route element={<RoleRoute allowedRoles={["teacher"]} />}>
          <Route path="/seat-planner/roster" element={<StudentRosterPage />} />
          <Route path="/seat-planner/grid" element={<GridPlannerPage />} />
        </Route>
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);
