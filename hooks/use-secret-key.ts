"use client"

import { useEffect, useState } from "react"
import { SecretKeyStorage } from "@/lib/secret-key-storage"

type Props = {
  storageKey: string
}

/**
 * useSecretKey
 */
export function useSecretKey(props: Props) {
  const [secretKey, setSecretKey] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storage = new SecretKeyStorage(props.storageKey)
    const storedSecretKey = storage.get()
    setSecretKey(storedSecretKey)
    setIsLoading(false)
  }, [props.storageKey])

  const handleSecretKeySet = (newSecretKey: string) => {
    const storage = new SecretKeyStorage(props.storageKey)
    storage.save(newSecretKey)
    setSecretKey(newSecretKey)
  }

  const handleSecretKeyDelete = () => {
    const storage = new SecretKeyStorage(props.storageKey)
    storage.delete()
    setSecretKey(null)
  }

  return { secretKey, isLoading, handleSecretKeySet, handleSecretKeyDelete }
}
