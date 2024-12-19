import { BrowserRouter, Route, Routes } from "react-router-dom"
import Main from "./pages/Main"
import Court from "./pages/Court"
import LayoutOutlet from "./features/layout/LayoutOutlet"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutOutlet />}>
          <Route path="/" element={<Main />} />
          <Route path="/court" element={<Court />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
