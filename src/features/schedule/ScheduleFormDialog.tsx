import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material"
import { DateTimePicker } from "@mui/x-date-pickers"
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react"
import {
  useAddScheduleMutation,
  type Schedule,
  type AddScheduleRequest,
  useRemoveScheduleMutation,
  useEditScheduleMutation,
} from "./scheduleApiSlice"
import dayjs, { type Dayjs } from "dayjs"
import { Close, Delete, Save } from "@mui/icons-material"

interface Props {
  editSchedule: Schedule | null
  open: boolean
  onClose: () => void
}

const initialValues: AddScheduleRequest = {
  name: "",
  courtName: "새물공원",
  startTime: new Date().toISOString(),
  endTime: new Date().toISOString(),
  dateFixed: false,
}

const ScheduleFormDialog = ({ open, editSchedule, onClose }: Props) => {
  const [values, setValues] = useState<AddScheduleRequest>(initialValues)
  const handleClose = () => {
    setValues(initialValues)
    onClose()
  }
  const [addSchedule] = useAddScheduleMutation()
  const [removeSchedule] = useRemoveScheduleMutation()
  const [edit] = useEditScheduleMutation()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }
  const handleDateTimeChange = (date: Dayjs | null, name: string) => {
    if (date === null) return
    setValues(prev => ({
      ...prev,
      [name]: date?.toISOString() ?? "",
    }))

    if (name === "startTime" && values.endTime < date.toISOString()) {
      setValues(prev => ({
        ...prev,
        endTime: date?.toISOString() ?? "",
      }))
    }
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (editSchedule) {
      await edit({ id: editSchedule.id, request: values }).unwrap()
    } else {
      await addSchedule(values).unwrap()
    }
    handleClose()
  }

  const handleClickRemove = async () => {
    if (!editSchedule) return
    await removeSchedule(editSchedule.id).unwrap()

    handleClose()
  }

  useEffect(() => {
    if (editSchedule) {
      setValues({
        name: editSchedule.name,
        courtName: editSchedule.courtName,
        startTime: editSchedule.startTime,
        endTime: editSchedule.endTime,
        dateFixed: editSchedule.dateFixed,
      })
    }
  }, [editSchedule])
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>일정 {editSchedule ? "수정" : "추가"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="일정 제목"
              name="name"
              onChange={handleChange}
              value={values.name}
              required
            />
            <Stack spacing={2} direction="row">
              <DateTimePicker
                label="시작시간"
                value={dayjs(values.startTime)}
                onChange={date => handleDateTimeChange(date, "startTime")}
                slotProps={{ textField: { fullWidth: true, required: true } }}
                format="YYYY-MM-DD HH:mm"
              />
              <DateTimePicker
                label="종료시간"
                value={dayjs(values.endTime)}
                onChange={date => handleDateTimeChange(date, "endTime")}
                slotProps={{ textField: { fullWidth: true, required: true } }}
                format="YYYY-MM-DD HH:mm"
              />
            </Stack>
            <TextField
              label="코트 위치"
              name="courtName"
              onChange={handleChange}
              value={values.courtName}
              required
              select
            >
              <MenuItem value="새물공원">새물공원</MenuItem>
              <MenuItem value="중앙공원">중앙공원</MenuItem>
              <MenuItem value="서조공원">서조공원</MenuItem>
              <MenuItem value="호계 근린공원">호계 근린공원</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          {editSchedule && (
            <Button
              color="error"
              endIcon={<Delete />}
              variant="contained"
              onClick={handleClickRemove}
            >
              삭제
            </Button>
          )}
          <Button type="submit" endIcon={<Save />} variant="contained">
            저장
          </Button>
          <Button onClick={handleClose} endIcon={<Close />}>
            취소
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default ScheduleFormDialog
