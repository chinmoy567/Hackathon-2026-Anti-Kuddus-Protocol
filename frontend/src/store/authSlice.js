import { createSlice } from "@reduxjs/toolkit";
import { setAccessToken as syncTokenManager } from "../utils/tokenManager.js";

const initialState = {
  accessToken: null,
  user: null, // { id, name, role }
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user ?? state.user;
      syncTokenManager(state.accessToken);
    },
    clearCredentials: (state) => {
      state.accessToken = null;
      state.user = null;
      syncTokenManager(null);
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => Boolean(state.auth.accessToken);
