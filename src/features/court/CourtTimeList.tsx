import { Typography, Paper, List } from "@mui/material"
import type { ReservedCourt } from "./courtApiSlice"
import CourtTimeListItem from "./CourtTimeListItem"

interface Props {
  time: string
  courts: ReservedCourt[]
}

const CourtTimeList = ({ time, courts }: Props) => {
  return (
    <div>
      <Typography variant="subtitle1" gutterBottom>
        {time}
      </Typography>
      <Paper variant="outlined">
        <List>
          {courts.map((court, i) => (
            <CourtTimeListItem
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

export default CourtTimeList
