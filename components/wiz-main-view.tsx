"use client"

import { useQuery } from "@tanstack/react-query"
import { use, useReducer } from "react"
import { useSecretKey } from "@/hooks/use-secret-key"
import { createWizState } from "@/lib/wiz-state"
import { wizReducer } from "@/reducers/wiz-reducer"
import { WizSceneViewDungeon } from "./wiz-scene-view-dungeon"
import { WizSceneViewSettings } from "./wiz-scene-view-settings"
import { WizSecretKeySetup } from "./wiz-secret-key-setup"

export function WizMainView() {
  const stateQuery = useQuery({
    queryKey: ["wizState"],
    queryFn: createWizState,
    experimental_prefetchInRender: true,
  })

  const initialState = use(stateQuery.promise)

  const [state, dispatch] = useReducer(wizReducer, initialState)

  const secretKeyState = useSecretKey({
    storageKey: "wiz.secret.key",
  })

  if (secretKeyState.isLoading) {
    return null
  }

  if (!secretKeyState.secretKey) {
    return (
      <WizSecretKeySetup onSecretKeySet={secretKeyState.handleSecretKeySet} />
    )
  }

  if (state.type === "dungeon") {
    return (
      <WizSceneViewDungeon
        state={state}
        dispatch={dispatch}
        secretKey={secretKeyState.secretKey}
      />
    )
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

  return null
}
