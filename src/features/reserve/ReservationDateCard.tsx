import { format } from "date-fns"
import type { ReservedCourt } from "../court/courtApiSlice"
import { Card, CardHeader, CardContent, Stack } from "@mui/material"
import { ko } from "date-fns/locale"
import ReservationTimeList from "./ReservationTimeList"

interface Props {
  date: string
  timeslots: Record<string, ReservedCourt[]>
}

const ReservationDateCard = ({ date, timeslots }: Props) => {
  const formattedDate = format(Number(date), "MMM do (E)", { locale: ko })

  return (
    <Card>
      <CardHeader title={formattedDate} />
      <CardContent sx={{ pt: 1 }}>
        <Stack spacing={2}>
          {Object.entries(timeslots)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([time, courts]) => (
              <ReservationTimeList key={time} time={time} courts={courts} />
            ))}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ReservationDateCard
