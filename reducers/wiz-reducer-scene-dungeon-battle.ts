import type { WizStateEntity } from "@/engine/entities/wiz-state-entity"
import { WizStateSceneBookEntity } from "@/engine/entities/wiz-state-scene-book.entity"
import { WizStateSceneDungeonEntity } from "@/engine/entities/wiz-state-scene-dungeon.entity"
import type { WizStateSceneDungeonBattleEntity } from "@/engine/entities/wiz-state-scene-dungeon-battle.entity"
import type { WizAction } from "@/engine/types"

/**
 * wizReducerSceneDungeonBattle
 */
export function wizReducerSceneDungeonBattle(
  state: WizStateSceneDungeonBattleEntity,
  action: WizAction,
): WizStateEntity {
  if (action.type === "ADD_USER_ACTION") {
    const newState = state.withAddedLogs(action.payload)
    return newState.withIncrementedChatCount()
  }

  if (action.type === "ADD_EVENT_CHAT") {
    const messages = action.payload.map((log) => ({
      id: crypto.randomUUID(),
      type: "EVENT_CHAT" as const,
      characterId: log.characterId,
      text: log.text,
    }))
    return state.withAddedLogs(messages)
  }

  if (action.type === "BATTLE_ATTACK") {
    console.log("攻撃する")
    const damage = 10
    const firstEnemy = state.enemies[0]
    const newState = state.withUpdatedEnemy(firstEnemy.id, {
      hp: firstEnemy.hp - damage,
    })
    return newState.withNextTurn()
  }

  if (action.type === "END_COMBAT") {
    return new WizStateSceneDungeonEntity({
      type: "dungeon",
      dungeonId: state.dungeonId,
      depth: state.depth,
      time: 0,
      currentMessageIndex: 0,
      nextBattle: null,
      narrativeSettings: state.narrativeSettings,
      vault: state.vault.toObject(),
    })
  }

  if (action.type === "SET_SECRET_KEY") {
    return state.withSecretKey(action.payload)
  }

  if (action.type === "DELETE_SECRET_KEY") {
    return state.withoutSecretKey()
  }

  if (action.type === "NAVIGATE_TO_BOOK_FROM_DUNGEON") {
    console.log("NAVIGATE_TO_BOOK_FROM_DUNGEON triggered from battle")
    return new WizStateSceneBookEntity({
      type: "book",
      bookType: "monster",
      selectedIndex: null,
      previousScene: {
        type: "dungeon-battle",
        dungeonId: state.dungeonId,
        depth: state.depth,
      },
      vault: state.vault.toObject(),
      narrativeSettings: state.narrativeSettings,
    })
  }

  return state
}
