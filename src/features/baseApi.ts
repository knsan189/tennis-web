import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://tennis-api.haneul.app" }),
  endpoints: builder => ({}),
  tagTypes: ["schedules"],
})

export default baseApi
