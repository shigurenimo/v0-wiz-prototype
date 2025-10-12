import type { WizStateEntity } from "@/engine/entities/wiz-state-entity"
import type { WizStateSceneDungeonEntity } from "@/engine/entities/wiz-state-scene-dungeon.entity"
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

  if (action.type === "SET_INPUT") {
    return state.withInputValue(action.payload)
  }

  if (action.type === "SUBMIT_INPUT") {
    console.log(`発言: ${action.payload.playerInput}`)
    return state
      .withIncrementedDepth()
      .withInputValue("")
      .withMessages(action.payload.messages)
  }

  if (action.type === "ADD_CHAT_MESSAGES") {
    const newState = state.withMessages(action.payload)
    if (state.combatState) {
      return newState.withIncrementedCombatChat()
    }
    return newState
  }

  if (action.type === "START_COMBAT") {
    return state.withCombatState({
      enemyName: action.payload.enemyName,
      chatCount: 0,
    })
  }

  if (action.type === "INCREMENT_COMBAT_CHAT") {
    return state.withIncrementedCombatChat()
  }

  if (action.type === "END_COMBAT") {
    return state.withoutCombatState()
  }

  if (action.type === "NEXT_CHAT") {
    return state.withNextMessage()
  }

  if (action.type === "STOP") {
    return new WizStateSceneSettingsEntity({
      type: "settings",
      vault: state.vault,
      narrativeSettings: state.narrativeSettings,
    })
  }

  if (action.type === "UNKNOWN") {
    console.log("選択: ???")
    return state
  }

  return state
}
