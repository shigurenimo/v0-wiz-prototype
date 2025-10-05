import type { WizStateSceneDungeonEntity } from "@/engine/entities/wiz-state-scene-dungeon.entity"
import type { WizAction } from "@/engine/types"

/**
 * wizReducerSceneDungeon
 */
export function wizReducerSceneDungeon(
  state: WizStateSceneDungeonEntity,
  action: WizAction,
): WizStateSceneDungeonEntity {
  if (action.type === "NEXT_MESSAGE") {
    return state.withNextChat()
  }

  if (action.type === "SET_INPUT") {
    return state.withInputValue(action.payload)
  }

  if (action.type === "SUBMIT_INPUT") {
    console.log(`発言: ${action.payload.playerInput}`)
    return state
      .withIncrementedDepth()
      .withInputValue("")
      .withReplacedMessages(action.payload.messages)
  }

  if (action.type === "ADD_CHAT_MESSAGES") {
    return state.withMessages(action.payload)
  }

  if (action.type === "NEXT_CHAT") {
    return state.withNextChat()
  }

  if (action.type === "STOP") {
    console.log("選択: たちどまる")
    return state
  }

  if (action.type === "UNKNOWN") {
    console.log("選択: ???")
    return state
  }

  return state
}
