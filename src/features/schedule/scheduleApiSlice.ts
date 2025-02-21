import baseApi from "../baseApi"

export interface Schedule {
  id: number
  name: string
  startTime: string
  endTime: string
  courtName: string
  dateFixed: boolean
  participations: []
  createdAt: string
}

interface GetScheduleListResponse {
  data: Schedule[]
  code: number
}

export interface AddScheduleRequest {
  name: string
  courtName: string
  startTime: string
  endTime: string
  dateFixed: boolean
}

export interface GetScheduleListRequest {
  startTime: string
  endTime?: string
  courtName?: string
  name?: string
}

const scheduleApiSlice = baseApi.injectEndpoints({
  endpoints: builder => ({
    getScheduleList: builder.query<Schedule[], GetScheduleListRequest>({
      query: request => ({
        url: "/schedule",
        method: "GET",
        params: request,
      }),
      transformResponse: (response: GetScheduleListResponse) => {
        response.data.sort((a, b) => {
          return (
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          )
        })
        return response.data
      },
      providesTags: ["schedules"],
    }),
    addSchedule: builder.mutation<Schedule, AddScheduleRequest>({
      query: request => ({
        url: "/schedule",
        method: "POST",
        body: request,
      }),
      invalidatesTags: ["schedules"],
    }),
    removeSchedule: builder.mutation<void, number>({
      query: id => ({
        url: `/schedule/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["schedules"],
    }),
    editSchedule: builder.mutation<
      Schedule,
      { id: number; request: AddScheduleRequest }
    >({
      query: ({ id, request }) => ({
        url: `/schedule/${id}`,
        method: "PUT",
        body: request,
      }),
      invalidatesTags: ["schedules"],
    }),
  }),
})

export const {
  useGetScheduleListQuery,
  useAddScheduleMutation,
  useRemoveScheduleMutation,
  useEditScheduleMutation,
} = scheduleApiSlice
