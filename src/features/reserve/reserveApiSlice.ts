import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { CourtAvailableTime } from "../court/courtApiSlice"

const reserveApilSlice = createApi({
  reducerPath: "reserveApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_RESERVE_API_SERVER_URL,
  }),
  endpoints: builder => ({
    reserveCourt: builder.mutation<string, CourtAvailableTime>({
      query: request => ({ url: "reserve", body: request, method: "POST" }),
    }),
  }),
})

export const { useReserveCourtMutation } = reserveApilSlice
export default reserveApilSlice
