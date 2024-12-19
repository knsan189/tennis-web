import { Container } from "@mui/material"
import type React from "react"
import Header from "./Header"

interface Props {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <Container sx={{ py: 3 }}>{children}</Container>
    </>
  )
}

export default Layout