import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../store/authSlice.js";

// A captain/teacher hitting a student-only URL directly is redirected, not
// shown a broken page — the real boundary is still the server (Frontend.md §2).
export const RoleRoute = ({ allowedRoles }) => {
  const user = useSelector(selectCurrentUser);
  if (!user || !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};
