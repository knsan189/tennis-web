import {
  Box,
  CircularProgress,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material"
import {
  useRefreshCourtsMutation,
  type ReservedCourt,
} from "../court/courtApiSlice"
import {
  useCheckReservationStatusQuery,
  useStartReservationMutation,
} from "./reserveApiSlice"
import { useEffect, useState } from "react"

interface Props {
  court: ReservedCourt
  divider: boolean
}

const ReservationTimeListItem = ({ court, divider }: Props) => {
  const [reserveCourt] = useStartReservationMutation()
  const [refreshCourts, { isLoading }] = useRefreshCourtsMutation()
  const [taskId, setTaskId] = useState<string | null>(null)

  const { data } = useCheckReservationStatusQuery(taskId ?? "", {
    skip: taskId === null,
    pollingInterval: 1000 * 2,
  })

  const handleClick = async () => {
    const response = await reserveCourt(court).unwrap()
    setTaskId(response.taskId)
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
        disabled={taskId !== null || isLoading || court.status !== undefined}
      >
        <ListItemText
          primary={court.courtName}
          slotProps={{
            primary: {
              fontWeight: ["1", "4", "5", "8"].some(num =>
                court.courtName.includes(num),
              )
                ? "bold"
                : undefined,
            },
          }}
        />
      </ListItemButton>
    </ListItem>
  )
}

export default ReservationTimeListItem
