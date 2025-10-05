import { z } from "zod"
import { zWizStateCore } from "@/engine/models/wiz-state-core"

/**
 * データ管理画面
 */
export const zWizStateSceneStorage = zWizStateCore.extend({
  type: z.literal("storage"),
})

export type WizStateSceneStorage = z.infer<typeof zWizStateSceneStorage>
