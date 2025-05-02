import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { getWeekOfMonth } from "date-fns"

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

export type GroupedCourts = Record<number, Record<string, CourtAvailableTime[]>>

const groupCourtsByWeek = (respones: GetCourtsResponse) => {
  const result: Record<string, GroupedCourts> = {}
  for (const court of respones.availableTimes) {
    const date = new Date(court.year, court.month - 1, court.date)
    const week = getWeekOfMonth(date, { weekStartsOn: 1 }) // 월요일 시작으로 주차 계산

    const weekKey = `${court.year}-${court.month}-${week}` // ex) "2025-5-1"

    if (!result[weekKey]) {
      result[weekKey] = {}
    }

    const dateKey = date.getTime() // 날짜별로 다시 그룹핑
    if (!result[weekKey][dateKey]) {
      result[weekKey][dateKey] = {}
    }
    if (!result[weekKey][dateKey][court.time]) {
      result[weekKey][dateKey][court.time] = []
    }

    result[weekKey][dateKey][court.time].push(court)
  }
  return result
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
        response.data.grouped = groupCourtsByWeek(response.data)

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
