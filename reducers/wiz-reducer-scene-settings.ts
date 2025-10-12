import type { WizStateEntity } from "@/engine/entities/wiz-state-entity"
import type { WizStateSceneSettingsEntity } from "@/engine/entities/wiz-state-scene-settings.entity"
import type { WizAction } from "@/engine/types"

/**
 * wizReducerSceneSettings
 */
export function wizReducerSceneSettings(
  state: WizStateSceneSettingsEntity,
  action: WizAction,
): WizStateEntity {
  if (action.type === "BACK_TO_DUNGEON") {
    return state
  }

  return state
}
