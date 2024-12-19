import { useMemo } from "react"
import {
  type CourtAvailableTime,
  useGetCourtsQuery,
} from "../features/court/courtApiSlice"
import { format } from "date-fns"
import {
  Card,
  CardContent,
  CardHeader,
  Grid2,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material"
import { ko } from "date-fns/locale"

type GroupCourtsByDate = Record<number, Record<string, CourtAvailableTime[]>>

const Court = () => {
  const { data } = useGetCourtsQuery(undefined, { pollingInterval: 1000 * 60 })

  const groupCourtsByDate: GroupCourtsByDate = useMemo(() => {
    if (data === undefined) return {}
    const { availableTimes } = data
    const groupCourtsByDate: GroupCourtsByDate = {}
    for (const court of availableTimes) {
      const date = new Date(court.year, court.month - 1, court.date).getTime()
      if (!groupCourtsByDate[date]) {
        groupCourtsByDate[date] = {}
      }
      if (!groupCourtsByDate[date][court.time]) {
        groupCourtsByDate[date][court.time] = []
      }
      groupCourtsByDate[date][court.time].push(court)
    }
    return groupCourtsByDate
  }, [data])

  const handleClickButton = (url: string) => {
    window.open(url, "_blank")
  }

  return (
    <Stack spacing={4}>
      <Typography variant="h6" gutterBottom align="center">
        마지막 동기화 시간 : {data?.timestamp.toLocaleString()}
      </Typography>
      <Grid2 container spacing={2}>
        {Object.entries(groupCourtsByDate)
          .sort((a, b) => Number(a[0]) - Number(b[0]))
          .map(([date, courts]) => {
            const d = format(Number(date), "MMM do (E)", {
              locale: ko,
            })
            return (
              <Grid2 key={date} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Card>
                  <CardHeader title={d} />

                  <CardContent sx={{ pt: 1 }}>
                    <Stack spacing={2}>
                      {Object.entries(courts)
                        .sort((a, b) => a[0].localeCompare(b[0]))
                        .map(([time, courts]) => (
                          <div key={time}>
                            <Typography variant="subtitle1" gutterBottom>
                              {time}
                            </Typography>
                            <Paper variant="outlined">
                              <List dense disablePadding>
                                {courts.map((court, i) => (
                                  <ListItem
                                    key={court.id}
                                    divider={courts.length - 1 !== i}
                                    disablePadding
                                    disableGutters
                                  >
                                    <ListItemButton
                                      onClick={() =>
                                        handleClickButton(court.url)
                                      }
                                    >
                                      <ListItemText primary={court.courtName} />
                                    </ListItemButton>
                                  </ListItem>
                                ))}
                              </List>
                            </Paper>
                          </div>
                        ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid2>
            )
          })}
      </Grid2>
    </Stack>
  )
}

export default Court
