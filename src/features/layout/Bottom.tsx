import { Schedule, SportsTennis } from "@mui/icons-material"
import { Paper, BottomNavigation, BottomNavigationAction } from "@mui/material"
import { useNavigate, useLocation } from "react-router-dom"

const Bottom = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={10}
    >
      <BottomNavigation
        showLabels
        value={pathname}
        onChange={(_, value) => navigate(value)}
      >
        <BottomNavigationAction
          label="일정 확인"
          icon={<Schedule />}
          value="/"
        />
        <BottomNavigationAction
          label="코트 예약"
          icon={<SportsTennis />}
          value="/court"
        />
      </BottomNavigation>
    </Paper>
  )
}

export default Bottom
