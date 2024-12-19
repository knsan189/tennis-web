import { Outlet } from "react-router-dom"
import Layout from "./Layout"

const LayoutOutlet = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

export default LayoutOutlet
