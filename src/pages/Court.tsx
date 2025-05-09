import {
  useGetCourtsQuery,
  useRefreshCourtsMutation,
} from "../features/court/courtApiSlice"
import {
  Box,
  Card,
  Checkbox,
  FormControlLabel,
  Grid2,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material"
import { LoadingButton } from "@mui/lab"
import CourtDateCard from "../features/court/CourtDateCard"
import { Refresh } from "@mui/icons-material"
import { useGetMyReservationsQuery } from "../features/reserve/reserveApiSlice"
import { useMemo } from "react"
import { groupCourtsByWeek } from "../features/court/utils/groupCourts"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  selectShowReservedCourts,
  toggleShowReservedCourts,
} from "../features/config/configSlice"

const Court = () => {
  const showReservedCourts = useAppSelector(selectShowReservedCourts)
  const { data, isLoading } = useGetCourtsQuery(undefined, {
    pollingInterval: 1000 * 60,
  })
  const { data: myList = [] } = useGetMyReservationsQuery()

  const [refreshCourts, { isLoading: isRefreshLoading }] =
    useRefreshCourtsMutation()

  const handleClickRefresh = () => {
    refreshCourts()
  }

  const groupedCourt = useMemo(() => {
    if (!showReservedCourts) {
      return groupCourtsByWeek(data?.availableTimes || [])
    }
    return groupCourtsByWeek([...(data?.availableTimes || []), ...myList])
  }, [data, myList, showReservedCourts])

  const dispatch = useAppDispatch()

  return (
    <Stack spacing={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h5" gutterBottom>
            실시간 코트 현황
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {!isLoading ? `${data?.timestamp} 기준` : <Skeleton width={200} />}
          </Typography>
        </Box>

        <LoadingButton
          loading={isLoading || isRefreshLoading}
          variant="contained"
          onClick={handleClickRefresh}
          startIcon={<Refresh />}
        >
          새로고침
        </LoadingButton>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="end"
        position="sticky"
        top={0}
        bgcolor="background.paper"
        zIndex={2}
      >
        <FormControlLabel
          control={<Checkbox checked={showReservedCourts} />}
          label="예약된 코트 같이보기"
          onChange={e => {
            dispatch(toggleShowReservedCourts())
          }}
        />
      </Box>

      {isLoading
        ? Array.from({ length: 3 }, (_, weekIndex) => (
            <Stack key={weekIndex} spacing={2}>
              <Typography variant="h6" gutterBottom>
                <Skeleton variant="text" width="30%" />
              </Typography>
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
        : Object.entries(groupedCourt)
            .sort()
            .map(([weekKey, dates]) => {
              const [, month, week] = weekKey.split("-")
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
                          <CourtDateCard date={date} timeslots={timeslots} />
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
