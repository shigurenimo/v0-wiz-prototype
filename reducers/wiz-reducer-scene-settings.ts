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

  if (action.type === "SET_SECRET_KEY") {
    return state.withSecretKey(action.payload)
  }

  if (action.type === "DELETE_SECRET_KEY") {
    return state.withoutSecretKey()
  }

  return state
}
