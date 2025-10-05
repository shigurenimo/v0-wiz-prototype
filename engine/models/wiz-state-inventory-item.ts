import { z } from "zod"

/**
 * インベントリアイテム
 */
export const zWizStateInventoryItem = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number().int().min(0),
})

export type WizInventoryItem = z.infer<typeof zWizStateInventoryItem>
