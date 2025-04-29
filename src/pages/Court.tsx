import { useMemo } from "react"
import {
  type GroupedCourts,
  useGetCourtsQuery,
  useRefreshCourtsMutation,
} from "../features/court/courtApiSlice"
import { Card, CardHeader, Container, Stack } from "@mui/material"
import { LoadingButton, Masonry } from "@mui/lab"

import ReservationDateCard from "../features/reserve/ReservationDateCard"

const Court = () => {
  const { data } = useGetCourtsQuery(undefined, { pollingInterval: 1000 * 60 })
  const [refreshCourts, { isLoading }] = useRefreshCourtsMutation()

  const groupedCourts: GroupedCourts = useMemo(() => {
    if (!data) return {}

    const { availableTimes } = data
    const result: GroupedCourts = {}
    for (const court of availableTimes) {
      const date = new Date(court.year, court.month - 1, court.date).getTime()
      if (!result[date]) {
        result[date] = {}
      }
      if (!result[date][court.time]) {
        result[date][court.time] = []
      }

      result[date][court.time].push(court)
    }

    return result
  }, [data])

  const handleClickRefresh = () => {
    refreshCourts()
  }

  return (
    <Container>
      <Stack spacing={3}>
        <Card>
          <CardHeader
            title={`마지막 동기화 시간 : ${data?.timestamp.toLocaleString()}`}
            action={
              <LoadingButton
                loading={isLoading}
                variant="outlined"
                onClick={handleClickRefresh}
              >
                새로고침
              </LoadingButton>
            }
          />
        </Card>
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
          {Object.entries(groupedCourts)
            .sort((a, b) => Number(a[0]) - Number(b[0]))
            .map(([date, timeslots]) => (
              <ReservationDateCard
                key={date}
                date={date}
                timeslots={timeslots}
              />
            ))}
        </Masonry>
      </Stack>
    </Container>
  )
}

export default Court
