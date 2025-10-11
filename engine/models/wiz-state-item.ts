import { z } from "zod"

/**
 * 取得済みアイテム
 */
export const zWizStateItem = z.object({
  itemId: z.string(),
  quantity: z.number().int().min(1),
})

export type WizStateItem = z.infer<typeof zWizStateItem>
