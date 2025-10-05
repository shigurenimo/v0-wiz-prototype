import { z } from "zod"

/**
 * ダンジョンでのイベント
 */
export const zWizDungeonEvent = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
})
