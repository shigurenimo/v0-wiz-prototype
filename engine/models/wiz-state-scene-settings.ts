import { z } from "zod"
import { zWizStateCore } from "@/engine/models/wiz-state-core"

/**
 * WizStateSceneSettings
 */
export const zWizStateSceneSettings = zWizStateCore.extend({
  type: z.literal("settings"),
})

export type WizStateSceneSettings = z.infer<typeof zWizStateSceneSettings>
