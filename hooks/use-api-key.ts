import { useEffect, useState } from "react"
import { ApiKeyStorage } from "@/lib/api-key-storage"

type Props = {
  storageKey: string
}

/**
 * useApiKey
 */
export function useApiKey(props: Props) {
  const [apiKey, setApiKey] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storage = new ApiKeyStorage(props.storageKey)
    const storedApiKey = storage.get()
    setApiKey(storedApiKey)
    setIsLoading(false)
  }, [props.storageKey])

  const handleApiKeySet = (newApiKey: string) => {
    const storage = new ApiKeyStorage(props.storageKey)
    storage.save(newApiKey)
    setApiKey(newApiKey)
  }

  return { apiKey, isLoading, handleApiKeySet }
}
