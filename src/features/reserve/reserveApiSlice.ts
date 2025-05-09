import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { ReservedCourt } from "../court/courtApiSlice"

interface Task {
  status: "pending" | "completed"
  logs: string[]
}

interface StartReservationResponse {
  taskId: string
}

const reserveApilSlice = createApi({
  reducerPath: "reserveApi",
  tagTypes: ["myReservations"],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.DEV
      ? "http://localhost:4000"
      : import.meta.env.VITE_RESERVE_API_SERVER_URL,
    // baseUrl: import.meta.env.VITE_RESERVE_API_SERVER_URL,
  }),
  endpoints: builder => ({
    startReservation: builder.mutation<StartReservationResponse, ReservedCourt>(
      {
        query: request => ({ url: "reserve", body: request, method: "POST" }),
        // invalidatesTags: ["myReservations"],
      },
    ),
    checkReservationStatus: builder.query<Task, string>({
      query: taskId => ({
        url: `reserve/status/${taskId}`,
        method: "GET",
      }),
    }),
    getMyReservations: builder.query<ReservedCourt[], void>({
      query: () => ({
        url: "reserve/mylist",
        method: "GET",
      }),
      providesTags: ["myReservations"],
      transformResponse: (response: ReservedCourt[]) => {
        response.sort((a, b) => {
          return a.startTime.toString().localeCompare(b.startTime.toString())
        })
        return response
      },
    }),
    cancelReservation: builder.mutation<void, ReservedCourt>({
      query: request => ({
        url: "reserve/mylist",
        method: "DELETE",
        body: request,
      }),
      invalidatesTags: ["myReservations"],
    }),
  }),
})

export const {
  useStartReservationMutation,
  useCheckReservationStatusQuery,
  useGetMyReservationsQuery,
  useCancelReservationMutation,
} = reserveApilSlice
export default reserveApilSlice
