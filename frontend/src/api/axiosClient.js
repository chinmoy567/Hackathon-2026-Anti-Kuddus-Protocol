import axios from "axios";
import { ENDPOINTS } from "./endpoints.js";
import { getAccessToken, setAccessToken, notifyUnauthorized } from "../utils/tokenManager.js";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // sends the httpOnly refreshToken cookie
});

axiosClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshPromise = null;

// On a 401 (expired access token), attempt exactly one silent refresh+retry.
// A plain axios call (not axiosClient) avoids recursing through this interceptor.
axiosClient.interceptors.response.use(
  (response) => response,
  async (err) => {
    const original = err.config;
    const isAuthRoute = original?.url?.includes("/auth/");

    if (err.response?.status !== 401 || isAuthRoute || original._retried) {
      return Promise.reject(err);
    }
    original._retried = true;

    try {
      refreshPromise =
        refreshPromise ??
        axios.post(
          `${import.meta.env.VITE_API_BASE_URL}${ENDPOINTS.refresh}`,
          {},
          { withCredentials: true }
        );
      const { data } = await refreshPromise;
      setAccessToken(data.data.accessToken);
      original.headers.Authorization = `Bearer ${data.data.accessToken}`;
      return axiosClient(original);
    } catch (refreshErr) {
      setAccessToken(null);
      notifyUnauthorized();
      return Promise.reject(refreshErr);
    } finally {
      refreshPromise = null;
    }
  }
);
