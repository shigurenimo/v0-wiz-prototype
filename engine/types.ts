import type { WizStateMessage } from "@/engine/models/wiz-state-message"

export type WizAction =
  | { type: "NEXT_MESSAGE" }
  | { type: "SET_INPUT"; payload: string }
  | {
      type: "SUBMIT_INPUT"
      payload: {
        playerInput: string
        messages: WizStateMessage[]
      }
    }
  | { type: "ADD_CHAT_MESSAGES"; payload: WizStateMessage[] }
  | { type: "NEXT_CHAT" }
  | { type: "STOP" }
  | { type: "UNKNOWN" }
  | { type: "BACK_TO_DUNGEON" }
