import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_TENNINS_API_URL }),
  endpoints: builder => ({}),
  tagTypes: ["schedules"],
})

export default baseApi
