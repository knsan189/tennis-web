import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export interface ReservationMeta {
  isPaid: boolean // 결제 완료 여부
  pageIndex: number
  rowIndex: number // 예약 목록에서의 행 인덱스
  /** yyyyMMdd */
  reservedDate: string // 예약 날짜
}

export interface ReservedCourt {
  year: number
  month: number
  date: number
  time: string
  courtName: string
  courtType: string
  courtNumber: string
  url: string
  startTime: Date
  endTime: Date
  id: string
  status?: ReservationMeta
}

interface ApiServerResponse<T = unknown> {
  code: number
  data: T
}

interface GetCourtsResponse {
  availableTimes: ReservedCourt[]
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
