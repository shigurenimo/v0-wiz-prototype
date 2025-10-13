import type { z } from "zod"
import type { zWizStateLog } from "@/engine/models/wiz-state-log"
import type { WizBookType } from "@/engine/models/wiz-state-scene-book"

type Log = z.infer<typeof zWizStateLog>

export type WizAction =
  | { type: "NEXT_MESSAGE" }
  | { type: "INCREMENT_DEPTH" }
  | { type: "ADD_CHAT_MESSAGES"; payload: Log[] }
  | { type: "ADD_USER_ACTION"; payload: Log[] }
  | { type: "PROCEED_TIME_AND_DEPTH"; payload: Log[] }
  | {
      type: "ADD_EVENT_CHAT"
      payload: Array<{ characterId: string; text: string }>
    }
  | {
      type: "ADD_EVENT_SCENE"
      payload: { text: string }
    }
  | {
      type: "ADD_EVENT_DAMAGE"
      payload: { damage: number; text: string }
    }
  | {
      type: "ADD_EVENT_ITEM"
      payload: { itemIds: string[]; text: string }
    }
  | {
      type: "ADD_EVENT_BATTLE"
      payload: {
        enemies: Array<{ id: string; enemyId: string }>
        text: string
      }
    }
  | { type: "START_BATTLE" }
  | { type: "INCREMENT_COMBAT_CHAT" }
  | { type: "END_COMBAT" }
  | { type: "BATTLE_ATTACK" }
  | { type: "NEXT_CHAT" }
  | { type: "STOP" }
  | { type: "UNKNOWN" }
  | { type: "BACK_TO_DUNGEON" }
  | { type: "SET_SECRET_KEY"; payload: string }
  | { type: "DELETE_SECRET_KEY" }
  | { type: "NAVIGATE_TO_SCENE"; payload: string }
  | { type: "BOOK_CHANGE_TYPE"; payload: WizBookType }
  | { type: "BOOK_SELECT_INDEX"; payload: number | null }
  | { type: "NAVIGATE_TO_BOOK_FROM_DUNGEON" }
  | { type: "NAVIGATE_BACK_FROM_BOOK" }
