import type { WizStateEntity } from "@/engine/entities/wiz-state-entity"
import { WizStateSceneBookEntity } from "@/engine/entities/wiz-state-scene-book.entity"
import { WizStateSceneDungeonEntity } from "@/engine/entities/wiz-state-scene-dungeon.entity"
import { WizStateSceneDungeonBattleEntity } from "@/engine/entities/wiz-state-scene-dungeon-battle.entity"
import { WizStateSceneSettingsEntity } from "@/engine/entities/wiz-state-scene-settings.entity"
import type { WizAction } from "@/engine/types"
import { wizReducerSceneBook } from "./wiz-reducer-scene-book"
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
  console.log(
    "wizReducer called, action:",
    action.type,
    "state type:",
    state.type,
  )
  if (state instanceof WizStateSceneDungeonEntity) {
    const newState = wizReducerSceneDungeon(state, action)
    console.log("After wizReducerSceneDungeon, new state type:", newState.type)
    return newState
  }

  if (state instanceof WizStateSceneDungeonBattleEntity) {
    return wizReducerSceneDungeonBattle(state, action)
  }

  if (state instanceof WizStateSceneSettingsEntity) {
    return wizReducerSceneSettings(state, action)
  }

  if (state instanceof WizStateSceneBookEntity) {
    return wizReducerSceneBook(state, action)
  }

  return state
}
