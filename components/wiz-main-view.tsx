"use client"

import { useReducer } from "react"
import { useApiKey } from "@/hooks/use-api-key"
import { createWizState } from "@/lib/wiz-state"
import { wizReducer } from "@/reducers/wiz-reducer"
import { WizApiKeySetup } from "./wiz-api-key-setup"
import { WizSceneViewDungeon } from "./wiz-scene-view-dungeon"

export function WizMainView() {
  const [state, dispatch] = useReducer(wizReducer, createWizState())

  const apiKeyState = useApiKey({
    storageKey: "wiz.key.claude",
  })

  if (apiKeyState.isLoading) {
    return null
  }

  if (!apiKeyState.apiKey) {
    return <WizApiKeySetup onApiKeySet={apiKeyState.handleApiKeySet} />
  }

  if (state.type === "dungeon") {
    return (
      <WizSceneViewDungeon
        state={state}
        dispatch={dispatch}
        apiKey={apiKeyState.apiKey}
      />
    )
  }

  if (state.type === "storage") {
    return <div>Storage Scene</div>
  }

  return null
}
