"use client"

import { useReducer } from "react"
import { useSecretKey } from "@/hooks/use-secret-key"
import { createWizState } from "@/lib/wiz-state"
import { wizReducer } from "@/reducers/wiz-reducer"
import { WizSecretKeySetup } from "./wiz-secret-key-setup"
import { WizSceneViewDungeon } from "./wiz-scene-view-dungeon"
import { WizSceneViewSettings } from "./wiz-scene-view-settings"

export function WizMainView() {
  const [state, dispatch] = useReducer(wizReducer, createWizState())

  const secretKeyState = useSecretKey({
    storageKey: "wiz.secret.key",
  })

  if (secretKeyState.isLoading) {
    return null
  }

  if (!secretKeyState.secretKey) {
    return <WizSecretKeySetup onSecretKeySet={secretKeyState.handleSecretKeySet} />
  }

  if (state.type === "dungeon") {
    return <WizSceneViewDungeon state={state} dispatch={dispatch} secretKey={secretKeyState.secretKey} />
  }

  if (state.type === "settings") {
    return (
      <WizSceneViewSettings
        state={state}
        dispatch={dispatch}
        secretKey={secretKeyState.secretKey}
        onSecretKeyDelete={secretKeyState.handleSecretKeyDelete}
      />
    )
  }

  if (state.type === "storage") {
    return <div>Storage Scene</div>
  }

  return null
}
