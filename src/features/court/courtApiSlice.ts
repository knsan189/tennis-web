import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export interface CourtEntity {
  title: string
  availableDates: AvailableDate[]
  month: number
  year: number
  courtType: string
  courtNumber: string
}

export interface AvailableDate extends CourtEntity {
  date: number
  availableTimes: AvailableTime[]
}

export interface AvailableTime extends CourtEntity {
  date: number
  time: string
}

interface ApiServerResponse<T = unknown> {
  code: number
  data: T
}

interface GetCourtsResponse {
  courts: CourtEntity[]
  timestamp: string
  size: number
}

const courtApiSlice = createApi({
  reducerPath: "courtApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_CORUT_API_SERVER_URL,
  }),
  endpoints: builder => ({
    getCourts: builder.query<GetCourtsResponse, void>({
      query: () => "court",
      transformResponse: (response: ApiServerResponse<GetCourtsResponse>) =>
        response.data,
    }),
  }),
  tagTypes: ["courts"],
})

export const { useGetCourtsQuery } = courtApiSlice
export default courtApiSlice
