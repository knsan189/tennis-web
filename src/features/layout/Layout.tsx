import { Container } from "@mui/material"
import type React from "react"
import Bottom from "./Bottom"

interface Props {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <Container sx={{ py: 2 }}>{children}</Container>
      <Bottom />
    </>
  )
}

export default Layout
