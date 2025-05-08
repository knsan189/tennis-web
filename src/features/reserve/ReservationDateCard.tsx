import { format } from "date-fns"
import type { CourtAvailableTime } from "../court/courtApiSlice"
import {
  Card,
  CardHeader,
  CardContent,
  Stack,
  Typography,
  Box,
  Divider,
} from "@mui/material"
import { ko } from "date-fns/locale"
import ReservationTimeList from "./ReservationTimeList"

interface Props {
  date: string
  timeslots: Record<string, CourtAvailableTime[]>
  reseveredTimeslots?: Record<string, CourtAvailableTime[]>
}

const ReservationDateCard = ({
  date,
  timeslots,
  reseveredTimeslots,
}: Props) => {
  const formattedDate = format(Number(date), "MMM do (E)", { locale: ko })

  return (
    <Card>
      <CardHeader title={formattedDate} />
      <CardContent sx={{ pt: 1 }}>
        <Stack spacing={2}>
          {reseveredTimeslots && (
            <>
              <Box>
                {Object.entries(reseveredTimeslots).map(([timeKey, courts]) => (
                  <Typography
                    variant="body2"
                    key={timeKey}
                    color="text.secondary"
                  >
                    {timeKey} ({courts.map(court => court.courtName).join(",")})
                  </Typography>
                ))}
              </Box>
              <Divider />
            </>
          )}
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
