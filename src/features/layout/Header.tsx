import { AppBar, Button, Container, Stack, Toolbar } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"

const Header = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <AppBar position="sticky" color="inherit">
      <Container>
        <Toolbar>
          <Stack spacing={1} direction="row" alignItems="center">
            <Button
              onClick={() => navigate("/")}
              size="medium"
              variant={pathname === "/" ? "contained" : "text"}
            >
              일정
            </Button>
            <Button
              onClick={() => navigate("/court")}
              size="medium"
              variant={pathname === "/court" ? "contained" : "text"}
            >
              코트
            </Button>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header
