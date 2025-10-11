import type { WizStateEntity } from "@/engine/entities/wiz-state-entity"
import { WizStateSceneDungeonEntity } from "@/engine/entities/wiz-state-scene-dungeon.entity"
import { WizStateSceneSettingsEntity } from "@/engine/entities/wiz-state-scene-settings.entity"
import type { WizAction } from "@/engine/types"
import { wizReducerSceneDungeon } from "./wiz-reducer-scene-dungeon"
import { wizReducerSceneSettings } from "./wiz-reducer-scene-settings"

/**
 * wizReducer
 */
export function wizReducer(state: WizStateEntity, action: WizAction): WizStateEntity {
  if (state instanceof WizStateSceneDungeonEntity) {
    return wizReducerSceneDungeon(state, action)
  }

  if (state instanceof WizStateSceneSettingsEntity) {
    return wizReducerSceneSettings(state, action)
  }

  return state
}
