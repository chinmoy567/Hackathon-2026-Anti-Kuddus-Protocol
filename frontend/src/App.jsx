import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppRoutes } from "./routes/AppRoutes.jsx";
import { useRefreshSessionMutation, useLazyGetMeQuery } from "./store/apiSlice.js";
import { setCredentials, clearCredentials } from "./store/authSlice.js";
import { registerUnauthorizedHandler, setAccessToken } from "./utils/tokenManager.js";

// The access token lives in memory only, so a page reload loses it. On boot,
// silently attempt a refresh against the httpOnly cookie before deciding
// whether the user is logged in — avoids a false redirect to /login.
const AuthBootstrap = ({ children }) => {
  const dispatch = useDispatch();
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [refreshSession] = useRefreshSessionMutation();
  const [triggerGetMe] = useLazyGetMeQuery();

  useEffect(() => {
    registerUnauthorizedHandler(() => dispatch(clearCredentials()));

    (async () => {
      try {
        const { accessToken } = await refreshSession().unwrap();
        // Sync the axios interceptor's token source immediately — the getMe
        // request below reads it synchronously, before Redux state settles.
        setAccessToken(accessToken);
        const user = await triggerGetMe().unwrap();
        dispatch(setCredentials({ accessToken, user }));
      } catch {
        // No valid session cookie — the user must log in.
      } finally {
        setIsBootstrapping(false);
      }
    })();
  }, [dispatch, refreshSession, triggerGetMe]);

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
      </div>
    );
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthBootstrap>
        <AppRoutes />
      </AuthBootstrap>
    </BrowserRouter>
  );
}

export default App;
