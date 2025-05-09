import {
  Box,
  Card,
  Divider,
  Grid2,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material"
import { useGetMyReservationsQuery } from "../features/reserve/reserveApiSlice"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { useMemo } from "react"
import { groupCourtsByWeek } from "../features/court/utils/groupCourts"
import ReservationDetailDialog from "../features/reserve/ReservationDetailDialog"
import { setSelectedReservation } from "../features/reserve/reservationSlice"
import { useAppDispatch } from "../app/hooks"

const Main = () => {
  const { data = [], isLoading } = useGetMyReservationsQuery(undefined)

  const grouedCourts = useMemo(() => {
    return groupCourtsByWeek(data)
  }, [data])

  const dispatch = useAppDispatch()

  return (
    <Stack spacing={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h5" gutterBottom>
            예약 현황
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {new Date().toLocaleString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        </Box>
      </Box>
      {isLoading
        ? Array.from({ length: 3 }, (_, weekIndex) => (
            <Stack key={weekIndex} spacing={2}>
              {/* 주차 제목 스켈레톤 */}
              <Typography variant="h6" gutterBottom>
                <Skeleton variant="text" width={80} />
              </Typography>
              <Grid2 container spacing={2}>
                {Array.from({ length: 4 }, (_, dateIndex) => (
                  <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={dateIndex}>
                    <Card>
                      <Stack spacing={2} p={2}>
                        <Typography variant="subtitle1">
                          <Skeleton variant="text" width={60} />
                        </Typography>
                        <Divider />
                        <Stack spacing={1}>
                          <Typography variant="subtitle2">
                            <Skeleton variant="text" width={50} />
                          </Typography>
                          <Paper variant="outlined">
                            <Box py={1} px={2}>
                              <Skeleton variant="text" width={80} />
                            </Box>
                          </Paper>
                        </Stack>
                        <Stack spacing={1}>
                          <Typography variant="subtitle2">
                            <Skeleton variant="text" width={50} />
                          </Typography>
                          <Paper variant="outlined">
                            <Box py={1} px={2}>
                              <Skeleton variant="text" width={80} />
                            </Box>
                          </Paper>
                        </Stack>
                      </Stack>
                    </Card>
                  </Grid2>
                ))}
              </Grid2>
            </Stack>
          ))
        : Object.entries(grouedCourts)
            .sort()
            .map(([weekKey, dates]) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const [_, month, week] = weekKey.split("-")
              return (
                <Stack key={weekKey} spacing={2}>
                  <Typography
                    variant="h6"
                    gutterBottom
                  >{`${month}월 ${week}주차`}</Typography>
                  <Grid2 container spacing={2}>
                    {Object.entries(dates)
                      .sort((a, b) => Number(a[0]) - Number(b[0]))
                      .map(([date, timeslots]) => (
                        <Grid2
                          size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                          key={date}
                        >
                          <Card>
                            <Stack spacing={2} padding={2}>
                              <Typography variant="subtitle1">
                                {format(Number(date), " MMM do (E)", {
                                  locale: ko,
                                })}
                              </Typography>
                              <Divider />
                              {Object.entries(timeslots).map(
                                ([time, courts]) => (
                                  <Stack key={time} spacing={1}>
                                    <Typography
                                      variant="subtitle2"
                                      gutterBottom
                                    >
                                      {time}
                                    </Typography>
                                    <Paper variant="outlined">
                                      <List>
                                        {courts.map((court, i) => (
                                          <ListItem
                                            key={court.id}
                                            divider={i !== courts.length - 1}
                                          >
                                            <ListItemButton
                                              onClick={() =>
                                                dispatch(
                                                  setSelectedReservation(court),
                                                )
                                              }
                                            >
                                              <ListItemText
                                                primary={court.courtName}
                                              />
                                              <Typography
                                                variant="caption"
                                                color={
                                                  !court.status?.isPaid
                                                    ? "text.secondary"
                                                    : "error"
                                                }
                                              >
                                                {!court.status?.isPaid
                                                  ? "결제 완료"
                                                  : "결제 대기"}
                                              </Typography>
                                            </ListItemButton>
                                          </ListItem>
                                        ))}
                                      </List>
                                    </Paper>
                                  </Stack>
                                ),
                              )}
                            </Stack>
                          </Card>
                        </Grid2>
                      ))}
                  </Grid2>
                </Stack>
              )
            })}
      <ReservationDetailDialog />
    </Stack>
  )
}

export default Main
