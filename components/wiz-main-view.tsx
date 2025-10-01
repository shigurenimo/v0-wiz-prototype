"use client"

import { useEffect, useReducer, useState } from "react"
import { wizReducer } from "@/app/reducers/wiz-reducer"
import { initialState } from "@/lib/wiz-state"
import { WizSceneViewDungeon } from "./wiz-scene-view-dungeon"
import { WizApiKeySetup } from "./wiz-api-key-setup"

/**
 * WizMainView
 */
export function WizMainView() {
  const [state, dispatch] = useReducer(wizReducer, initialState)
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedApiKey = localStorage.getItem("claude_api_key")
    setApiKey(storedApiKey)
    setIsLoading(false)
  }, [])

  const handleApiKeySet = (newApiKey: string) => {
    setApiKey(newApiKey)
  }

  if (isLoading) {
    return null
  }

  if (!apiKey) {
    return <WizApiKeySetup onApiKeySet={handleApiKeySet} />
  }

  if (state.type === "dungeon") {
    return <WizSceneViewDungeon state={state} dispatch={dispatch} />
  }

  if (state.type === "storage") {
    return <div>Storage Scene</div>
  }

  return null
}
