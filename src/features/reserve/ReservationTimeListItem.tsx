import {
  Box,
  CircularProgress,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material"
import {
  useRefreshCourtsMutation,
  type CourtAvailableTime,
} from "../court/courtApiSlice"
import {
  useCheckReservationStatusQuery,
  useStartReservationMutation,
} from "./reserveApiSlice"
import { useEffect, useState } from "react"
import useCheckAdmin from "./hooks/useCheckAdmin"
import { OpenInNew } from "@mui/icons-material"

interface Props {
  court: CourtAvailableTime
  divider: boolean
}

const ReservationTimeListItem = ({ court, divider }: Props) => {
  const { isAdmin } = useCheckAdmin()
  const [reserveCourt] = useStartReservationMutation()
  const [refreshCourts, { isLoading }] = useRefreshCourtsMutation()
  const [taskId, setTaskId] = useState<string | null>(null)

  const { data } = useCheckReservationStatusQuery(taskId ?? "", {
    skip: taskId === null,
    pollingInterval: 1000 * 2,
  })

  const handleClick = async () => {
    if (isAdmin) {
      const response = await reserveCourt(court).unwrap()
      setTaskId(response.taskId)
    } else {
      window.open(court.url, "_blank")
    }
  }

  useEffect(() => {
    if (data?.status === "completed") {
      setTaskId(null)
      refreshCourts()
    }
  }, [data, refreshCourts])

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
      <ListItemButton
        onClick={handleClick}
        disabled={taskId !== null || isLoading}
      >
        <ListItemText
          primary={court.courtName}
          secondary={taskId !== null ? data?.logs.length : null}
        />
        <OpenInNew fontSize="small" />
      </ListItemButton>
    </ListItem>
  )
}

export default ReservationTimeListItem
