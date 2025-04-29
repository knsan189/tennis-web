import { useMemo } from "react"
import {
  type GroupedCourts,
  useGetCourtsQuery,
  useRefreshCourtsMutation,
} from "../features/court/courtApiSlice"
import { Box, Card, Grid2, Skeleton, Stack, Typography } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import ReservationDateCard from "../features/reserve/ReservationDateCard"
import { Refresh } from "@mui/icons-material"
import { getWeekOfMonth } from "date-fns"
import useCheckAdmin from "../features/reserve/hooks/useCheckAdmin"

const Court = () => {
  const { isAdmin } = useCheckAdmin()
  const { data } = useGetCourtsQuery(undefined, { pollingInterval: 1000 * 60 })
  const [refreshCourts, { isLoading }] = useRefreshCourtsMutation()

  const groupedByWeek = useMemo(() => {
    if (!data?.availableTimes) return {}

    const result: Record<string, GroupedCourts> = {}

    for (const court of data.availableTimes) {
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

  const handleClickRefresh = () => {
    refreshCourts()
  }

  return (
    <Stack spacing={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h5">실시간 코트 현황</Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {`${data?.timestamp} 기준`}
          </Typography>
        </Box>
        <LoadingButton
          loading={isLoading}
          variant="contained"
          onClick={handleClickRefresh}
          startIcon={<Refresh />}
          disabled={!isAdmin}
        >
          새로고침
        </LoadingButton>
      </Box>

      {isLoading
        ? Array.from({ length: 3 }, (_, weekIndex) => (
            <Stack key={weekIndex} spacing={2}>
              {/* 주차 제목 스켈레톤 */}
              <Skeleton variant="text" width="30%" height={40} />
              <Grid2 container spacing={2}>
                {Array.from({ length: 4 }, (_, dateIndex) => (
                  <Grid2 size={{ sm: 6, md: 4, lg: 3 }} key={dateIndex}>
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
            </Stack>
          ))
        : Object.entries(groupedByWeek)
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
                          <ReservationDateCard
                            date={date}
                            timeslots={timeslots}
                          />
                        </Grid2>
                      ))}
                  </Grid2>
                </Stack>
              )
            })}
    </Stack>
  )
}

export default Court
