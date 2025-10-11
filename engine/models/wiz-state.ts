import { z } from "zod"
import { zWizStateSceneDungeon } from "@/engine/models/wiz-state-scene-dungeon"
import { zWizStateSceneSettings } from "@/engine/models/wiz-state-scene-settings"
import { zWizStateSceneStorage } from "@/engine/models/wiz-state-scene-storage"

/**
 * ゲーム状態
 */
export const zWizState = z.discriminatedUnion("type", [
  zWizStateSceneDungeon,
  zWizStateSceneStorage,
  zWizStateSceneSettings,
])

export type WizState = z.infer<typeof zWizState>
