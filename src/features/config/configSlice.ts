import { createSlice } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store"

interface ConfigState {
  showReservedCourts: boolean
}

const initialState: ConfigState = {
  showReservedCourts: false,
}

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    toggleShowReservedCourts: state => {
      state.showReservedCourts = !state.showReservedCourts
    },
  },
})

export const { toggleShowReservedCourts } = configSlice.actions
export default configSlice

export const selectShowReservedCourts = (state: RootState) =>
  state.config.showReservedCourts
