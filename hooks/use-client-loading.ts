import { useEffect, useState } from "react"

/**
 * useClientLoading
 */
export function useClientLoading() {
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  return isLoading
}
