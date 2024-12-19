import { useMemo } from "react"
import {
  type AvailableTime,
  useGetCourtsQuery,
} from "../features/court/courtApiSlice"
import { format } from "date-fns"
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid2,
  Stack,
  Typography,
} from "@mui/material"
import { ko } from "date-fns/locale"

type GroupCourtsByDate = Record<
  number,
  Record<AvailableTime["time"], AvailableTime[]>
>

const Court = () => {
  const { data } = useGetCourtsQuery(undefined, { pollingInterval: 1000 * 60 })

  const groupCourtsByDate: GroupCourtsByDate = useMemo(() => {
    if (data === undefined) return {}
    const { courts } = data

    const result = courts.reduce((acc: GroupCourtsByDate, court) => {
      court.availableDates.forEach(({ date, availableTimes }) => {
        availableTimes.forEach(availableTime => {
          const targetDate = new Date()
          targetDate.setFullYear(court.year, court.month - 1, date)
          const key = targetDate.getTime()

          if (acc[key] === undefined) {
            acc[key] = {}
          }

          if (acc[key][availableTime.time] === undefined) {
            acc[key][availableTime.time] = []
          }

          acc[key][availableTime.time].push({
            ...availableTime,
            courtNumber: court.courtNumber,
            courtType: court.courtType,
            title: court.title,
          })
        })
      })
      return acc
    }, {})
    return result
  }, [data])

  return (
    <Grid2 container spacing={2}>
      {Object.entries(groupCourtsByDate)
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(([date, courts]) => {
          const d = format(Number(date), "MMM do (E)", {
            locale: ko,
          })
          return (
            <Grid2 key={date} size={2}>
              <Card>
                <CardHeader title={d} />
                <Divider />
                <CardContent>
                  <Stack spacing={2}>
                    {Object.entries(courts)
                      .sort((a, b) => a[0].localeCompare(b[0]))
                      .map(([time, courts]) => (
                        <div key={time}>
                          <Typography variant="subtitle1">{time}</Typography>
                          <Typography variant="body2">
                            {courts.map(court => court.title).join(" ")}
                          </Typography>
                        </div>
                      ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid2>
          )
        })}
    </Grid2>
  )
}

export default Court
