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
  baseQuery: fetchBaseQuery({
    // baseUrl: import.meta.env.DEV
    //   ? "http://localhost:4000"
    //   : import.meta.env.VITE_RESERVE_API_SERVER_URL,
    baseUrl: import.meta.env.VITE_RESERVE_API_SERVER_URL,
  }),
  endpoints: builder => ({
    startReservation: builder.mutation<StartReservationResponse, ReservedCourt>(
      {
        query: request => ({ url: "reserve", body: request, method: "POST" }),
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
      transformResponse: (response: ReservedCourt[]) => {
        response.sort((a, b) => {
          return a.startTime.toString().localeCompare(b.startTime.toString())
        })
        return response
      },
    }),
  }),
})

export const {
  useStartReservationMutation,
  useCheckReservationStatusQuery,
  useGetMyReservationsQuery,
} = reserveApilSlice
export default reserveApilSlice
