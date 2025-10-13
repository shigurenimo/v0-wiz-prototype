import type { WizStateEntity } from "@/engine/entities/wiz-state-entity"
import type { WizStateSceneDungeonEntity } from "@/engine/entities/wiz-state-scene-dungeon.entity"
import { WizStateSceneDungeonBattleEntity } from "@/engine/entities/wiz-state-scene-dungeon-battle.entity"
import { WizStateSceneSettingsEntity } from "@/engine/entities/wiz-state-scene-settings.entity"
import type { WizAction } from "@/engine/types"

/**
 * wizReducerSceneDungeon
 */
export function wizReducerSceneDungeon(
  state: WizStateSceneDungeonEntity,
  action: WizAction,
): WizStateEntity {
  if (action.type === "NEXT_MESSAGE") {
    return state.withNextMessage()
  }

  if (action.type === "INCREMENT_DEPTH") {
    return state.withIncrementedDepth()
  }

  if (action.type === "ADD_CHAT_MESSAGES") {
    const newState = state.withAddedLogs(action.payload)
    if (state.nextBattle) {
      return newState.withIncrementedBattleChat()
    }
    return newState
  }

  if (action.type === "ADD_USER_ACTION") {
    const newState = state.withAddedLogs(action.payload)
    const finalState = newState.withIncrementedTime()
    if (state.nextBattle) {
      return finalState.withIncrementedBattleChat()
    }
    return finalState
  }

  if (action.type === "PROCEED_TIME_AND_DEPTH") {
    const newState = state.withAddedLogs(action.payload)
    const withTime = newState.withIncrementedTime()
    const finalState = withTime.withIncrementedDepth()
    if (state.nextBattle) {
      return finalState.withIncrementedBattleChat()
    }
    return finalState
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

  if (action.type === "ADD_EVENT_SCENE") {
    const message = {
      id: crypto.randomUUID(),
      type: "EVENT_SCENE" as const,
      text: action.payload.text,
    }
    return state.withAddedLogs([message])
  }

  if (action.type === "ADD_EVENT_DAMAGE") {
    const message = {
      id: crypto.randomUUID(),
      type: "EVENT_DAMAGE" as const,
      damage: action.payload.damage,
      text: action.payload.text,
    }
    return state.withAddedLogs([message])
  }

  if (action.type === "ADD_EVENT_ITEM") {
    const message = {
      id: crypto.randomUUID(),
      type: "EVENT_ITEM" as const,
      itemIds: action.payload.itemIds,
      text: action.payload.text,
    }
    return state.withAddedLogs([message])
  }

  if (action.type === "ADD_EVENT_BATTLE") {
    const message = {
      id: crypto.randomUUID(),
      type: "EVENT_BATTLE" as const,
      enemies: action.payload.enemies,
      text: action.payload.text,
    }
    const newState = state.withAddedLogs([message])
    return newState.withNextBattle({
      enemies: action.payload.enemies,
      chatCount: 0,
    })
  }

  if (action.type === "START_BATTLE") {
    if (!state.nextBattle) {
      return state
    }
    return new WizStateSceneDungeonBattleEntity({
      type: "dungeon-battle",
      dungeonId: state.dungeonId,
      depth: state.depth,
      enemies: state.nextBattle.enemies.map((enemy) => ({
        id: enemy.id,
        enemyId: enemy.enemyId,
        hp: 30,
        maxHp: 30,
      })),
      turn: 0,
      chatCount: 0,
      narrativeSettings: state.narrativeSettings,
      vault: state.vault.toObject(),
    })
  }

  if (action.type === "INCREMENT_COMBAT_CHAT") {
    return state.withIncrementedBattleChat()
  }

  if (action.type === "END_COMBAT") {
    return state.withoutNextBattle()
  }

  if (action.type === "BATTLE_ATTACK") {
    console.log("攻撃する")
    return state
  }

  if (action.type === "NEXT_CHAT") {
    return state.withNextMessage()
  }

  if (action.type === "STOP") {
    return new WizStateSceneSettingsEntity({
      type: "settings",
      vault: state.vault.toObject(),
      narrativeSettings: state.narrativeSettings,
    })
  }

  if (action.type === "UNKNOWN") {
    console.log("選択: ???")
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
