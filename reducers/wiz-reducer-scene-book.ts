import type { WizStateEntity } from "@/engine/entities/wiz-state-entity"
import type { WizStateSceneBookEntity } from "@/engine/entities/wiz-state-scene-book.entity"
import { WizStateSceneDungeonEntity } from "@/engine/entities/wiz-state-scene-dungeon.entity"
import { WizStateSceneDungeonBattleEntity } from "@/engine/entities/wiz-state-scene-dungeon-battle.entity"
import type { WizAction } from "@/engine/types"

/**
 * 図鑑シーン用Reducer（Book Scene Reducer）
 */
export function wizReducerSceneBook(
  state: WizStateSceneBookEntity,
  action: WizAction,
): WizStateEntity {
  if (action.type === "BOOK_CHANGE_TYPE") {
    return state.withBookType(action.payload)
  }

  if (action.type === "BOOK_SELECT_INDEX") {
    return state.withSelectedIndex(action.payload)
  }

  if (action.type === "NAVIGATE_BACK_FROM_BOOK") {
    if (!state.previousScene) {
      return state
    }

    if (state.previousScene.type === "dungeon") {
      const previousScene = state.previousScene
      return new WizStateSceneDungeonEntity({
        type: "dungeon",
        dungeonId: previousScene.dungeonId ?? "dungeon-1",
        depth: previousScene.depth ?? 1,
        time: 0,
        currentMessageIndex: state.vault.logs.length - 1,
        nextBattle: null,
        vault: state.vault.toObject(),
        narrativeSettings: state.narrativeSettings,
      })
    }

    if (state.previousScene.type === "dungeon-battle") {
      const previousScene = state.previousScene
      return new WizStateSceneDungeonBattleEntity({
        type: "dungeon-battle",
        dungeonId: previousScene.dungeonId ?? "dungeon-1",
        depth: previousScene.depth ?? 1,
        enemies: [
          {
            id: "enemy-1",
            enemyId: "slime",
            hp: 30,
            maxHp: 30,
            atk: 10,
            def: 5,
          },
        ],
        turn: 0,
        chatCount: 0,
        actionQueue: [],
        battleMessages: [],
        vault: state.vault.toObject(),
        narrativeSettings: state.narrativeSettings,
      })
    }

    return state
  }

  return state
}
