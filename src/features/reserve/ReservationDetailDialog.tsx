import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material"

import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  clearSelectedReservation,
  selectSelectedReservation,
} from "./reservationSlice"
import { Close, Delete } from "@mui/icons-material"
import { useCancelReservationMutation } from "./reserveApiSlice"

const ReservationDetailDialog = () => {
  const selectedReservation = useAppSelector(selectSelectedReservation)
  const [cancelReservation] = useCancelReservationMutation()
  const dispatch = useAppDispatch()
  const handleClose = () => {
    dispatch(clearSelectedReservation())
  }

  const handleRemove = () => {
    if (!selectedReservation) return
    cancelReservation(selectedReservation)
      .unwrap()
      .then(() => {
        dispatch(clearSelectedReservation())
      })
  }
  return (
    <Dialog open={Boolean(selectedReservation)} onClose={handleClose} fullWidth>
      <DialogTitle>예약 상세</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={1}>
          <TextField value={selectedReservation?.courtName} label="코트 이름" />
          <TextField
            value={selectedReservation?.status?.reservedDate}
            label="예약 날짜"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleRemove}
          color="error"
          startIcon={<Delete />}
          variant="contained"
          disabled
        >
          예약 취소
        </Button>
        <Button onClick={handleClose} color="primary" startIcon={<Close />}>
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ReservationDetailDialog
