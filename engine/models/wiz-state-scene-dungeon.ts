import { z } from "zod"
import { zWizStateCore } from "@/engine/models/wiz-state-core"
import { zWizStateMessage } from "@/engine/models/wiz-state-message"

/**
 * ダンジョン画面
 */
export const zWizStateSceneDungeon = zWizStateCore.extend({
  type: z.literal("dungeon"),
  dungeonId: z.string(),
  inputValue: z.string(),
  depth: z.number().int().min(0),
  chatMessages: z.array(zWizStateMessage),
  currentMessageIndex: z.number().int().min(0),
})

export type WizStateSceneDungeon = z.infer<typeof zWizStateSceneDungeon>
