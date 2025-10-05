import { z } from "zod"

/**
 * キャラクター関係性
 */
export const zWizCharacterRelationship = z.object({
  targetId: z.string(),
  description: z.string(),
})

export type WizCharacterRelationship = z.infer<typeof zWizCharacterRelationship>
