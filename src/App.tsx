import { BrowserRouter, Route, Routes } from "react-router-dom"
import LayoutOutlet from "./features/layout/LayoutOutlet"
import { lazy, Suspense } from "react"
import ScrollRestoration from "./features/layout/ScrollRestoration"

const Main = lazy(() => import("./pages/Main"))
const Court = lazy(() => import("./pages/Court"))

const App = () => {
  return (
    <BrowserRouter>
      <ScrollRestoration />
      <Suspense fallback={<LayoutOutlet />}>
        <Routes>
          <Route element={<LayoutOutlet />}>
            <Route path="/" element={<Main />} />
            <Route path="/court" element={<Court />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
