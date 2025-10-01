export type WizChatMessage = {
  characterId: string
  text: string
}

export type WizAction =
  | { type: "NEXT_MESSAGE" }
  | { type: "SET_INPUT"; payload: string }
  | { type: "SUBMIT_INPUT" }
  | { type: "ADD_CHAT_MESSAGES"; payload: WizChatMessage[] }
  | { type: "STOP" }
  | { type: "UNKNOWN" }
