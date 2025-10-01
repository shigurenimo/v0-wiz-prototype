export type WizAction =
  | { type: "NEXT_MESSAGE" }
  | { type: "SET_INPUT"; payload: string }
  | { type: "SUBMIT_INPUT" }
  | { type: "STOP" }
  | { type: "UNKNOWN" }
