import { useMemo, useState } from "react"
import {
  type CourtAvailableTime,
  useGetCourtsQuery,
} from "../features/court/courtApiSlice"
import { format } from "date-fns"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material"
import { ko } from "date-fns/locale"
import { Masonry } from "@mui/lab"
import { useAddScheduleMutation } from "../features/schedule/scheduleApiSlice"
import CourtSettingDialog from "../features/court/CourtSettingDialog"
import { useReserveCourtMutation } from "../features/reserve/reserveApiSlice"

type GroupCourtsByDate = Record<number, Record<string, CourtAvailableTime[]>>

const Court = () => {
  const { data } = useGetCourtsQuery(undefined, { pollingInterval: 1000 * 60 })
  const [addSchedule] = useAddScheduleMutation()

  const groupCourtsByDate: GroupCourtsByDate = useMemo(() => {
    if (data === undefined) return {}
    const { availableTimes } = data
    const groupCourtsByDate: GroupCourtsByDate = {}
    for (const court of availableTimes) {
      const date = new Date(court.year, court.month - 1, court.date).getTime()
      if (!groupCourtsByDate[date]) {
        groupCourtsByDate[date] = {}
      }
      if (!groupCourtsByDate[date][court.time]) {
        groupCourtsByDate[date][court.time] = []
      }
      groupCourtsByDate[date][court.time].push(court)
    }
    return groupCourtsByDate
  }, [data])

  const [reserveCourt, { isLoading }] = useReserveCourtMutation()
  const handleClickButton = async (court: CourtAvailableTime) => {
    await reserveCourt(court).unwrap()

    const startTime = new Date(court.year, court.month - 1, court.date)
    startTime.setHours(Number(court.time.split(":")[0]))
    const endTime = new Date(startTime)
    endTime.setHours(endTime.getHours() + 1)

    addSchedule({
      name: court.courtName,
      courtName: "새물공원",
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      dateFixed: false,
    })
  }

  const [open, setOpen] = useState(false)
  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Container>
      <Stack spacing={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              마지막 동기화 시간 : {data?.timestamp.toLocaleString()}
            </Typography>
            <Button onClick={handleClickOpen}>코트 설정</Button>
          </CardContent>
        </Card>
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
          {Object.entries(groupCourtsByDate)
            .sort((a, b) => Number(a[0]) - Number(b[0]))
            .map(([date, courts]) => {
              const d = format(Number(date), "MMM do (E)", {
                locale: ko,
              })
              return (
                <Card key={date}>
                  <CardHeader title={d} />
                  <CardContent sx={{ pt: 1 }}>
                    <Stack spacing={2}>
                      {Object.entries(courts)
                        .sort((a, b) => a[0].localeCompare(b[0]))
                        .map(([time, courts]) => (
                          <div key={time}>
                            <Typography variant="subtitle1" gutterBottom>
                              {time}
                            </Typography>
                            <Paper variant="outlined">
                              <List dense disablePadding>
                                {courts.map((court, i) => (
                                  <ListItem
                                    key={court.id}
                                    divider={courts.length - 1 !== i}
                                    disablePadding
                                    disableGutters
                                  >
                                    <ListItemButton
                                      onClick={() => handleClickButton(court)}
                                      disabled={isLoading}
                                    >
                                      <ListItemText primary={court.courtName} />
                                    </ListItemButton>
                                  </ListItem>
                                ))}
                              </List>
                            </Paper>
                          </div>
                        ))}
                    </Stack>
                  </CardContent>
                </Card>
              )
            })}
        </Masonry>
      </Stack>
      <CourtSettingDialog open={open} onClose={handleClose} />
    </Container>
  )
}

export default Court
