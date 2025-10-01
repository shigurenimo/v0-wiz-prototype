"use client"

import { useReducer } from "react"
import { wizReducer } from "@/app/reducers/wiz-reducer"
import { initialState } from "@/lib/wiz-state"
import { WizSceneViewDungeon } from "./wiz-scene-view-dungeon"

/**
 * WizMainView
 */
export function WizMainView() {
  const [state, dispatch] = useReducer(wizReducer, initialState)

  if (state.type === "dungeon") {
    return <WizSceneViewDungeon state={state} dispatch={dispatch} />
  }

  if (state.type === "storage") {
    return <div>Storage Scene</div>
  }

  return null
}
