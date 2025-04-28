import { Typography, Paper, List } from "@mui/material"
import type { CourtAvailableTime } from "../court/courtApiSlice"
import ReservationTimeListItem from "./ReservationTimeListItem"

interface Props {
  time: string
  courts: CourtAvailableTime[]
}

const ReservationTimeList = ({ time, courts }: Props) => {
  return (
    <div>
      <Typography variant="subtitle1" gutterBottom>
        {time}
      </Typography>
      <Paper variant="outlined">
        <List dense disablePadding>
          {courts.map((court, i) => (
            <ReservationTimeListItem
              key={court.id}
              court={court}
              divider={i !== courts.length - 1}
            />
          ))}
        </List>
      </Paper>
    </div>
  )
}

export default ReservationTimeList
