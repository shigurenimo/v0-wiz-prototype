import type { WizStateSceneSettingsEntity } from "@/engine/entities/wiz-state-scene-settings.entity"
import type { WizAction } from "@/engine/types"
import type { WizStateEntity } from "@/engine/entities/wiz-state-entity"
import { createWizState } from "@/lib/wiz-state"

/**
 * wizReducerSceneSettings
 */
export function wizReducerSceneSettings(state: WizStateSceneSettingsEntity, action: WizAction): WizStateEntity {
  if (action.type === "BACK_TO_DUNGEON") {
    return createWizState()
  }

  return state
}
