import { format } from "date-fns"
import type { ReservedCourt } from "./courtApiSlice"
import { Card, CardHeader, CardContent, Stack } from "@mui/material"
import { ko } from "date-fns/locale"
import CourtTimeList from "./CourtTimeList"

interface Props {
  date: string
  timeslots: Record<string, ReservedCourt[]>
}

const CourtDateCard = ({ date, timeslots }: Props) => {
  const formattedDate = format(Number(date), "MMM do (E)", { locale: ko })

  return (
    <Card>
      <CardHeader title={formattedDate} />
      <CardContent sx={{ pt: 1 }}>
        <Stack spacing={1}>
          {Object.entries(timeslots)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([time, courts]) => (
              <CourtTimeList key={time} time={time} courts={courts} />
            ))}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default CourtDateCard
