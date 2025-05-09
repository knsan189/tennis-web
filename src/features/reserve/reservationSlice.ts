import { createSlice } from "@reduxjs/toolkit"
import type { ReservedCourt } from "../court/courtApiSlice"
import type { RootState } from "../../app/store"

interface ReservationState {
  selectedReservation: ReservedCourt | null
}

const initialState: ReservationState = {
  selectedReservation: null,
}

const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    setSelectedReservation: (state, action) => {
      state.selectedReservation = action.payload
    },
    clearSelectedReservation: state => {
      state.selectedReservation = null
    },
  },
})

export const { setSelectedReservation, clearSelectedReservation } =
  reservationSlice.actions
export default reservationSlice

export const selectSelectedReservation = (state: RootState) =>
  state.reservation.selectedReservation
