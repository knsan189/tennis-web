import {
  Box,
  Card,
  Grid2,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material"
import { useGetMyReservationsQuery } from "../features/reserve/reserveApiSlice"
import { useMemo } from "react"
import type { GroupedCourts } from "../features/court/courtApiSlice"
import { format, getWeekOfMonth } from "date-fns"
import { ko } from "date-fns/locale"

const Main = () => {
  const { data = [], isLoading } = useGetMyReservationsQuery(undefined)

  const groupedByWeek = useMemo(() => {
    if (!data.length) return {}

    const result: Record<string, GroupedCourts> = {}

    for (const court of data) {
      const date = new Date(court.year, court.month - 1, court.date)
      const week = getWeekOfMonth(date, { weekStartsOn: 1 }) // 월요일 시작으로 주차 계산

      const weekKey = `${court.year}-${court.month}-${week}` // ex) "2025-5-1"

      if (!result[weekKey]) {
        result[weekKey] = {}
      }

      const dateKey = date.getTime() // 날짜별로 다시 그룹핑
      if (!result[weekKey][dateKey]) {
        result[weekKey][dateKey] = {}
      }
      if (!result[weekKey][dateKey][court.time]) {
        result[weekKey][dateKey][court.time] = []
      }

      result[weekKey][dateKey][court.time].push(court)
    }

    return result
  }, [data])

  return (
    <Stack spacing={4}>
      {isLoading ? (
        <Grid2 container spacing={2}>
          {Array.from({ length: 10 }, (_, index) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
              <Card>
                <Stack spacing={1} padding={2}>
                  <Skeleton variant="text" width="50%" />
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="60%" />
                </Stack>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      ) : (
        Object.entries(groupedByWeek)
          .sort()
          .map(([weekKey, dates]) => {
            const [_, month, week] = weekKey.split("-")
            return (
              <Stack key={weekKey} spacing={2}>
                <Typography
                  variant="h5"
                  gutterBottom
                >{`${month}월 ${week}주차`}</Typography>
                <Grid2 container spacing={2}>
                  {Object.entries(dates)
                    .sort((a, b) => Number(a[0]) - Number(b[0]))
                    .map(([date, timeslots]) => (
                      <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={date}>
                        <Card>
                          <Stack spacing={1} padding={2}>
                            <Typography variant="h6">
                              {format(Number(date), " MMM do (E)", {
                                locale: ko,
                              })}
                            </Typography>
                            {Object.entries(timeslots).map(([time, courts]) => (
                              <Stack key={time} spacing={1}>
                                <Typography variant="subtitle1">
                                  {time}
                                </Typography>
                                {courts.map(court => (
                                  <Paper key={court.id} variant="outlined">
                                    <Stack padding={1}>
                                      <Typography variant="body2">
                                        {court.courtName}
                                      </Typography>
                                    </Stack>
                                  </Paper>
                                ))}
                              </Stack>
                            ))}
                          </Stack>
                        </Card>
                      </Grid2>
                    ))}
                </Grid2>
              </Stack>
            )
          })
      )}
      <Box height={100} />
    </Stack>
  )
}

export default Main
