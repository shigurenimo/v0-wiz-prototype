import type { WizState } from "@/engine/models"
import type { WizAction } from "@/engine/types"
import { wizReducerSceneDungeon } from "./wiz-reducer-scene-dungeon"

/**
 * wizReducer
 */
export function wizReducer(state: WizState, action: WizAction): WizState {
  if (state.type === "dungeon") {
    return wizReducerSceneDungeon(state, action)
  }

  return state
}
