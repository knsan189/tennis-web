import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { groupCourtsByWeek, type GroupedCourts } from "./utils/groupCourts"

export interface DateInfo {
  month: number
  year: number
  date: number
}

export interface CourtAvailableTime extends DateInfo {
  id: string

  time: string

  /** 코트 이름  ex) 테니스장1 */
  courtName: string

  /** 공원 타입 */
  courtType: string

  /** 코트 ID */
  courtNumber: string

  url: string

  startTime: Date

  endTime: Date

  dateFixed: boolean
}

interface ApiServerResponse<T = unknown> {
  code: number
  data: T
}

interface GetCourtsResponse {
  grouped: Record<string, GroupedCourts>
  availableTimes: CourtAvailableTime[]
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
      providesTags: ["courts"],
      transformResponse: (response: ApiServerResponse<GetCourtsResponse>) => {
        response.data.timestamp = new Date(
          response.data.timestamp,
        ).toLocaleString()
        response.data.grouped = groupCourtsByWeek(response.data.availableTimes)
        return response.data
      },
    }),
    refreshCourts: builder.mutation<void, void>({
      query: () => ({
        url: "court/refresh",
        method: "POST",
      }),
      invalidatesTags: ["courts"],
    }),
  }),
  tagTypes: ["courts"],
})

export const { useGetCourtsQuery, useRefreshCourtsMutation } = courtApiSlice
export default courtApiSlice
