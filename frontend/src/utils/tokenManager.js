// A tiny in-memory mirror of authSlice.accessToken, kept only so axiosClient's
// interceptors can read the current token without importing the Redux store
// (avoids a store <-> api circular import). Redux remains the source of truth;
// this is updated wherever setCredentials/clearCredentials fire.
let accessToken = null;
let onUnauthorized = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

// Registered once (in store/authSlice.js consumers / App.jsx) so axiosClient can
// signal "refresh failed, session is gone" without depending on the store.
export const registerUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

export const notifyUnauthorized = () => {
  if (onUnauthorized) onUnauthorized();
};
