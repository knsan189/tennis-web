import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export default function ScrollRestoration() {
  const { pathname } = useLocation()

  useEffect(() => {
    const savedY = sessionStorage.getItem(`scroll-${pathname}`)
    if (savedY) {
      window.scrollTo(0, parseInt(savedY, 10))
    }

    return () => {
      sessionStorage.setItem(`scroll-${pathname}`, `${window.scrollY}`)
    }
  }, [pathname])

  return null
}
