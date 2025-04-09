import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material"
import CourtToggleButtonGroup from "./CourtToggleButtonGroup"

interface Props {
  open: boolean
  onClose: () => void
}

const daysOptions = [
  { value: 1, label: "월요일" },
  { value: 2, label: "화요일" },
  { value: 3, label: "수요일" },
  { value: 4, label: "목요일" },
  { value: 5, label: "금요일" },
  { value: 6, label: "토요일" },
  { value: 0, label: "일요일" },
]

const CourtSettingDialog = ({ open, onClose }: Props) => {
  return (
    <Dialog open={open} maxWidth="md">
      <DialogTitle>코트 설정</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          {daysOptions.map(day => (
            <CourtToggleButtonGroup dayOption={day} key={day.value} />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button>저장</Button>
        <Button onClick={onClose}>취소</Button>
      </DialogActions>
    </Dialog>
  )
}

export default CourtSettingDialog
