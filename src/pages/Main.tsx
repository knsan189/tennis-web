import {
  type GetScheduleListRequest,
  type Schedule,
  useGetScheduleListQuery,
} from "../features/schedule/scheduleApiSlice"
import {
  Box,
  Button,
  Card,
  CardContent,
  DialogActions,
  Stack,
} from "@mui/material"
import { DataGrid, type GridRowParams } from "@mui/x-data-grid"
import { DatePicker } from "@mui/x-date-pickers"
import dayjs, { type Dayjs } from "dayjs"
import { useCallback, useState } from "react"
import ScheduleFormDialog from "../features/schedule/ScheduleFormDialog"
import { Add } from "@mui/icons-material"

const Main = () => {
  const [request, setRequest] = useState<GetScheduleListRequest>({
    startTime: new Date().toISOString(),
    endTime: "",
    courtName: "",
    name: "",
  })

  const { data = [] } = useGetScheduleListQuery(request)

  const handleChangeTime = (date: Dayjs | null, name: string) => {
    setRequest(prev => ({
      ...prev,
      [name]: date?.toISOString() ?? "",
    }))
  }

  const [dialog, setDialog] = useState(false)
  const [editSchedule, setEditSchedule] = useState<Schedule | null>(null)

  const onToggleDialog = useCallback(() => setDialog(prev => !prev), [])

  const onCloseDialog = useCallback(() => {
    setEditSchedule(null)
    setDialog(false)
  }, [])

  const handleClickRow = (params: GridRowParams<Schedule>) => {
    setEditSchedule(params.row)
    onToggleDialog()
  }

  return (
    <Stack spacing={2}>
      <Card>
        <CardContent>
          <Stack spacing={2} direction="row">
            <DatePicker
              name="startTime"
              label="시작 날짜"
              value={dayjs(request.startTime)}
              onChange={date => handleChangeTime(date, "startTime")}
              format="YYYY-MM-DD"
              minDate={dayjs()}
            />
          </Stack>
        </CardContent>
        <DialogActions>
          <Button
            onClick={onToggleDialog}
            variant="contained"
            startIcon={<Add />}
          >
            일정 추가
          </Button>
        </DialogActions>
        <ScheduleFormDialog
          open={dialog}
          editSchedule={editSchedule}
          onClose={onCloseDialog}
        />
      </Card>
      <Card>
        <DataGrid
          disableColumnMenu
          rows={data}
          onRowClick={handleClickRow}
          pageSizeOptions={[10, 20, 50]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
                page: 0,
              },
            },
          }}
          columns={[
            {
              field: "id",
              headerName: "ID",
              align: "center",
              headerAlign: "center",
            },
            {
              field: "name",
              headerName: "코트",
              headerAlign: "center",
              align: "center",
              width: 150,
            },
            {
              field: "startTime",
              headerName: "예약시간",
              width: 200,
              renderCell: params =>
                dayjs(params.value as string).format("YYYY-MM-DD HH:mm"),
            },
          ]}
        />
      </Card>
      <Box height={100} />
    </Stack>
  )
}

export default Main
