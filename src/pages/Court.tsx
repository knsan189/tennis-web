import { useMemo, useState } from "react"
import {
  type GroupedCourts,
  useGetCourtsQuery,
} from "../features/court/courtApiSlice"
import {
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material"
import { Masonry } from "@mui/lab"
import CourtSettingDialog from "../features/court/CourtSettingDialog"
import ReservationDateCard from "../features/reserve/ReservationDateCard"

const Court = () => {
  const { data } = useGetCourtsQuery(undefined, { pollingInterval: 1000 * 60 })
  const [open, setOpen] = useState(false)

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

  const handleOpenSettings = () => setOpen(true)
  const handleCloseSettings = () => setOpen(false)

  return (
    <Container>
      <Stack spacing={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              마지막 동기화 시간 : {data?.timestamp.toLocaleString()}
            </Typography>
            <Button onClick={handleOpenSettings}>코트 설정</Button>
          </CardContent>
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

      <CourtSettingDialog open={open} onClose={handleCloseSettings} />
    </Container>
  )
}

export default Court
