import { z } from "zod"
import { zWizStateCore } from "@/engine/models/wiz-state-core"

/**
 * ダンジョン画面
 */
export const zWizStateSceneDungeon = zWizStateCore.extend({
  type: z.literal("dungeon"),
  dungeonId: z.string(),
  depth: z.number().int().min(0),
  time: z.number().int().min(0),
  currentMessageIndex: z.number().int().min(0),
  nextBattle: z
    .object({
      enemies: z.array(
        z.object({
          id: z.string(),
          enemyId: z.string(),
        }),
      ),
      chatCount: z.number().int().min(0),
    })
    .nullable(),
})

export type WizStateSceneDungeon = z.infer<typeof zWizStateSceneDungeon>
