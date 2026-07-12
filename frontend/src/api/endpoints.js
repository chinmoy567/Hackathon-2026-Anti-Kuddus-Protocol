// Single source of truth for API path strings — mirrors API.md.
export const ENDPOINTS = {
  login: "/auth/login",
  refresh: "/auth/refresh",
  logout: "/auth/logout",
  me: "/auth/me",
  anonymousTokens: "/anonymous-tokens",
  evidence: "/evidence",
  complaints: "/complaints",
  complaintStatus: (id) => `/complaints/${id}/status`,
  strikeState: "/dashboard/strike-state",
};
