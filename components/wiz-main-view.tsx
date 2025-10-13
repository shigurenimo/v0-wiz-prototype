"use client"

import { useQuery } from "@tanstack/react-query"
import { use, useEffect, useReducer } from "react"
import { useSecretKey } from "@/hooks/use-secret-key"
import { wizState } from "@/lib/debug/wiz-state-sakura"
import { wizReducer } from "@/reducers/wiz-reducer"
import { WizScene } from "./wiz-scene"
import { WizSecretKeySetup } from "./wiz-secret-key-setup"

export function WizMainView() {
  const stateQuery = useQuery({
    queryKey: ["wizState"],
    queryFn: wizState,
    experimental_prefetchInRender: true,
  })

  const initialState = use(stateQuery.promise)

  const [state, dispatch] = useReducer(wizReducer, initialState)

  const secretKeyState = useSecretKey({
    storageKey: "wiz.secret.key",
  })

  useEffect(() => {
    if (secretKeyState.secretKey && state.vault.secretKey === null) {
      dispatch({
        type: "SET_SECRET_KEY",
        payload: secretKeyState.secretKey,
      })
    }
  }, [secretKeyState.secretKey, state.vault.secretKey])

  const handleSecretKeySet = (key: string) => {
    secretKeyState.handleSecretKeySet(key)
    dispatch({
      type: "SET_SECRET_KEY",
      payload: key,
    })
  }

  const handleSecretKeyDelete = () => {
    secretKeyState.handleSecretKeyDelete()
    dispatch({
      type: "DELETE_SECRET_KEY",
    })
  }

  if (secretKeyState.isLoading) {
    return null
  }

  if (!state.vault.secretKey) {
    return <WizSecretKeySetup onSecretKeySet={handleSecretKeySet} />
  }

  return (
    <WizScene
      state={state}
      dispatch={dispatch}
      onSecretKeyDelete={handleSecretKeyDelete}
    />
  )
}
