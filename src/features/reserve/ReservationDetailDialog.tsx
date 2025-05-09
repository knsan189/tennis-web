import { Dialog, DialogTitle } from "@mui/material"

import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  clearSelectedReservation,
  selectSelectedReservation,
} from "./reservationSlice"

const ReservationDetailDialog = () => {
  const selectedReservation = useAppSelector(selectSelectedReservation)
  const dispatch = useAppDispatch()
  const handleClose = () => {
    dispatch(clearSelectedReservation())
  }
  return (
    <Dialog open={Boolean(selectedReservation)} onClose={handleClose}>
      <DialogTitle>예약 상세</DialogTitle>
    </Dialog>
  )
}

export default ReservationDetailDialog
