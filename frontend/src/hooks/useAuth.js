import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation, useLogoutMutation } from "../store/apiSlice.js";
import { setCredentials, clearCredentials, selectCurrentUser, selectIsAuthenticated } from "../store/authSlice.js";

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
  const [logoutMutation] = useLogoutMutation();

  const login = async (rollNumber, pin) => {
    const result = await loginMutation({ rollNumber, pin }).unwrap();
    dispatch(setCredentials(result));
    return result;
  };

  const logout = async () => {
    try {
      await logoutMutation().unwrap();
    } finally {
      dispatch(clearCredentials());
    }
  };

  return { user, role: user?.role ?? null, isAuthenticated, isLoggingIn, login, logout };
};
