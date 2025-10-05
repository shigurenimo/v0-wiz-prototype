import type { WizStateEntity } from "@/engine/entities/wiz-state-entity"
import { WizStateSceneDungeonEntity } from "@/engine/entities/wiz-state-scene-dungeon.entity"
import type { WizAction } from "@/engine/types"
import { wizReducerSceneDungeon } from "./wiz-reducer-scene-dungeon"

/**
 * wizReducer
 */
export function wizReducer(
  state: WizStateEntity,
  action: WizAction,
): WizStateEntity {
  if (state instanceof WizStateSceneDungeonEntity) {
    return wizReducerSceneDungeon(state, action)
  }

  return state
}
