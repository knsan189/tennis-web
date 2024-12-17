import { createTheme } from "@mui/material/styles"
import createTypography from "./createTypography"
import createPalette from "./createPalette"
import createShadow from "./createShadow"
import createComponents from "./createComponents"
import "./global.css"

const shadows = createShadow()
const typography = createTypography()
const palette = createPalette()
const components = createComponents(palette)

const theme = createTheme({
  components,
  palette,
  shape: {
    borderRadius: 8,
  },
  shadows,
  typography,
})

export default theme
