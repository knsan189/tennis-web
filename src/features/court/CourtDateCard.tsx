import { format } from "date-fns"
import type { ReservedCourt } from "./courtApiSlice"
import { Card, CardHeader, CardContent, Stack, Grid2 } from "@mui/material"
import { ko } from "date-fns/locale"
import CourtTimeList from "./CourtTimeList"
import { useMemo } from "react"

interface Props {
  date: string
  timeslots: Record<string, ReservedCourt[]>
}

const CourtDateCard = ({ date, timeslots }: Props) => {
  const formattedDate = format(Number(date), "MMM do (E)", { locale: ko })

  const isEmpty = useMemo(() => {
    const courts = Object.values(timeslots).flat()
    return courts.every(court => court.status !== undefined)
  }, [timeslots])

  if (isEmpty) {
    return null
  }

  return (
    <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={date}>
      <Card>
        <CardHeader title={formattedDate} />
        <CardContent sx={{ pt: 1 }}>
          {Object.entries(timeslots)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([time, courts]) => (
              <CourtTimeList key={time} time={time} courts={courts} />
            ))}
        </CardContent>
      </Card>
    </Grid2>
  )
}

export default CourtDateCard
