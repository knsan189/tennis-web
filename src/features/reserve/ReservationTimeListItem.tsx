import {
  Box,
  CircularProgress,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material"
import type { CourtAvailableTime } from "../court/courtApiSlice"
import {
  useCheckReservationStatusQuery,
  useStartReservationMutation,
} from "./reserveApiSlice"
import { useEffect, useState } from "react"

interface Props {
  court: CourtAvailableTime
  divider: boolean
}

const ReservationTimeListItem = ({ court, divider }: Props) => {
  const [reserveCourt] = useStartReservationMutation()
  const [taskId, setTaskId] = useState<string | null>(null)

  const { data } = useCheckReservationStatusQuery(taskId ?? "", {
    skip: taskId === null,
    pollingInterval: 1000 * 2,
  })

  const handleClick = async () => {
    const response = await reserveCourt(court).unwrap()
    setTaskId(response.taskId)
    // const startTime = new Date(court.year, court.month - 1, court.date)
    // startTime.setHours(Number(court.time.split(":")[0]))
    // const endTime = new Date(startTime)
    // endTime.setHours(endTime.getHours() + 1)

    // addSchedule({
    //   name: court.courtName,
    //   courtName: "새물공원",
    //   startTime: startTime.toISOString(),
    //   endTime: endTime.toISOString(),
    //   dateFixed: false,
    // })
  }

  useEffect(() => {
    if (data?.status === "completed") {
      setTaskId(null)
    }
  }, [data?.status])

  return (
    <ListItem
      key={court.id}
      divider={divider}
      disablePadding
      disableGutters
      secondaryAction={
        taskId !== null && (
          <Box pr={2}>
            <CircularProgress size={15} />
          </Box>
        )
      }
    >
      <ListItemButton onClick={handleClick} disabled={taskId !== null}>
        <ListItemText primary={court.courtName} />
      </ListItemButton>
    </ListItem>
  )
}

export default ReservationTimeListItem
