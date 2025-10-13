import type { WizStateEntity } from "@/engine/entities/wiz-state-entity"
import { WizStateSceneDungeonEntity } from "@/engine/entities/wiz-state-scene-dungeon.entity"
import { WizStateSceneDungeonBattleEntity } from "@/engine/entities/wiz-state-scene-dungeon-battle.entity"
import { WizStateSceneSettingsEntity } from "@/engine/entities/wiz-state-scene-settings.entity"
import type { WizAction } from "@/engine/types"
import { wizReducerSceneDungeon } from "./wiz-reducer-scene-dungeon"
import { wizReducerSceneDungeonBattle } from "./wiz-reducer-scene-dungeon-battle"
import { wizReducerSceneSettings } from "./wiz-reducer-scene-settings"

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

  if (state instanceof WizStateSceneDungeonBattleEntity) {
    return wizReducerSceneDungeonBattle(state, action)
  }

  if (state instanceof WizStateSceneSettingsEntity) {
    return wizReducerSceneSettings(state, action)
  }

  return state
}
