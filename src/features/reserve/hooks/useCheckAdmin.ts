import { useSearchParams } from "react-router-dom"

const useCheckAdmin = () => {
  const [searchParams] = useSearchParams()

  const isAdmin = searchParams.get("admin") === "true"

  return {
    isAdmin,
  }
}

export default useCheckAdmin
