import { Stack, Typography, Grid2 } from "@mui/material"
import CourtDateCard from "./CourtDateCard"
import type { GroupedCourts } from "./utils/groupCourts"
import { useMemo } from "react"

interface Props {
  weekKey: string
  dates: GroupedCourts
}

const CourtWeekSection = ({ weekKey, dates }: Props) => {
  const [, month, week] = weekKey.split("-")

  const isAllReserved = useMemo(() => {
    const courts = Object.values(dates).flatMap(timeslots =>
      Object.values(timeslots).flat(),
    )

    return courts.every(court => court.status !== undefined)
  }, [dates])

  if (isAllReserved) {
    return null
  }

  return (
    <Stack spacing={2}>
      <Typography
        variant="h6"
        gutterBottom
      >{`${month}월 ${week}주차`}</Typography>
      <Grid2 container spacing={2}>
        {Object.entries(dates)
          .sort((a, b) => Number(a[0]) - Number(b[0]))
          .map(([date, timeslots]) => (
            <CourtDateCard date={date} timeslots={timeslots} />
          ))}
      </Grid2>
    </Stack>
  )
}

export default CourtWeekSection
