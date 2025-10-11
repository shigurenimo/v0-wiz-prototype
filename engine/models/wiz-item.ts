import { z } from "zod"

/**
 * アイテムプロトタイプ
 */
export const zWizItem = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  rarity: z.enum(["common", "uncommon", "rare", "epic", "legendary"]),
})

export type WizItem = z.infer<typeof zWizItem>
