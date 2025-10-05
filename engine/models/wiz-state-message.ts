import { z } from "zod"

/**
 * チャットメッセージ
 */
export const zWizStateMessage = z.object({
  characterId: z.string(),
  text: z.string(),
})

export type WizStateMessage = z.infer<typeof zWizStateMessage>
