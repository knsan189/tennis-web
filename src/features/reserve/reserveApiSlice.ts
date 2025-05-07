import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { CourtAvailableTime } from "../court/courtApiSlice"

interface Task {
  status: "pending" | "completed"
  logs: string[]
}

interface StartReservationResponse {
  taskId: string
}

const reserveApilSlice = createApi({
  reducerPath: "reserveApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: import.meta.env.DEV
    //   ? "http://localhost:4000"
    //   : import.meta.env.VITE_RESERVE_API_SERVER_URL,
    baseUrl: import.meta.env.VITE_RESERVE_API_SERVER_URL,
  }),
  endpoints: builder => ({
    startReservation: builder.mutation<
      StartReservationResponse,
      CourtAvailableTime
    >({
      query: request => ({ url: "reserve", body: request, method: "POST" }),
    }),
    checkReservationStatus: builder.query<Task, string>({
      query: taskId => ({
        url: `reserve/status/${taskId}`,
        method: "GET",
      }),
    }),
    getMyReservations: builder.query<CourtAvailableTime[], void>({
      query: () => ({
        url: "reserve/mylist",
        method: "GET",
      }),
      transformResponse: (response: CourtAvailableTime[]) =>
        response.sort((a, b) => {
          return a.startTime.toString().localeCompare(b.startTime.toString())
        }),
    }),
  }),
})

export const {
  useStartReservationMutation,
  useCheckReservationStatusQuery,
  useGetMyReservationsQuery,
} = reserveApilSlice
export default reserveApilSlice
