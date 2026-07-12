import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosClient } from "../api/axiosClient.js";
import { ENDPOINTS } from "../api/endpoints.js";

// Thin adapter so RTK Query drives requests through axiosClient (and therefore
// its refresh-on-401 interceptor) instead of maintaining a second HTTP client.
// Unwraps claude.md's { success, message, data } envelope so callers only see data.
const axiosBaseQuery =
  () =>
  async ({ url, method = "GET", data, params, headers }) => {
    try {
      const result = await axiosClient.request({ url, method, data, params, headers });
      return { data: result.data.data };
    } catch (axiosError) {
      const response = axiosError.response?.data;
      return {
        error: {
          status: axiosError.response?.status,
          message: response?.message || "Something went wrong.",
          errors: response?.errors || [],
        },
      };
    }
  };

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Complaints", "StrikeState", "SosAlerts"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ rollNumber, pin }) => ({ url: ENDPOINTS.login, method: "POST", data: { rollNumber, pin } }),
    }),
    refreshSession: builder.mutation({
      query: () => ({ url: ENDPOINTS.refresh, method: "POST" }),
    }),
    logout: builder.mutation({
      query: () => ({ url: ENDPOINTS.logout, method: "POST" }),
    }),
    getMe: builder.query({
      query: () => ({ url: ENDPOINTS.me, method: "GET" }),
    }),

    issueAnonymousToken: builder.mutation({
      query: (purpose) => ({ url: ENDPOINTS.anonymousTokens, method: "POST", data: { purpose } }),
    }),

    uploadEvidence: builder.mutation({
      query: ({ file, anonymousToken }) => {
        const formData = new FormData();
        formData.append("image", file);
        return {
          url: ENDPOINTS.evidence,
          method: "POST",
          data: formData,
          headers: { "X-Anonymous-Token": anonymousToken },
        };
      },
    }),

    submitComplaint: builder.mutation({
      query: ({ category, description, evidenceFileIds, anonymousToken }) => ({
        url: ENDPOINTS.complaints,
        method: "POST",
        data: { category, description, evidenceFileIds },
        headers: { "X-Anonymous-Token": anonymousToken },
      }),
      invalidatesTags: ["Complaints"],
    }),

    getComplaints: builder.query({
      query: (params) => ({ url: ENDPOINTS.complaints, method: "GET", params }),
      providesTags: ["Complaints"],
    }),

    updateComplaintStatus: builder.mutation({
      query: ({ id, status }) => ({ url: ENDPOINTS.complaintStatus(id), method: "PATCH", data: { status } }),
      invalidatesTags: ["Complaints", "StrikeState"],
    }),

    getStrikeState: builder.query({
      query: () => ({ url: ENDPOINTS.strikeState, method: "GET" }),
      providesTags: ["StrikeState"],
    }),

    sendSos: builder.mutation({
      query: ({ location, occurredAt, clientEventId }) => ({
        url: ENDPOINTS.sos,
        method: "POST",
        data: { location, occurredAt, clientEventId },
      }),
    }),

    getActiveSos: builder.query({
      query: () => ({ url: ENDPOINTS.sosActive, method: "GET" }),
      providesTags: ["SosAlerts"],
    }),

    acknowledgeSos: builder.mutation({
      query: (id) => ({ url: ENDPOINTS.sosAcknowledge(id), method: "PATCH" }),
      invalidatesTags: ["SosAlerts"],
    }),

    resolveSos: builder.mutation({
      query: (id) => ({ url: ENDPOINTS.sosResolve(id), method: "PATCH" }),
      invalidatesTags: ["SosAlerts"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRefreshSessionMutation,
  useLogoutMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useIssueAnonymousTokenMutation,
  useUploadEvidenceMutation,
  useSubmitComplaintMutation,
  useGetComplaintsQuery,
  useUpdateComplaintStatusMutation,
  useGetStrikeStateQuery,
  useSendSosMutation,
  useGetActiveSosQuery,
  useAcknowledgeSosMutation,
  useResolveSosMutation,
} = apiSlice;
