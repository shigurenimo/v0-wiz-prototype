import { z } from "zod"
import { zWizStateSceneDungeon } from "@/engine/models/wiz-state-scene-dungeon"
import { zWizStateSceneStorage } from "@/engine/models/wiz-state-scene-storage"

/**
 * ゲーム状態
 */
export const zWizState = z.discriminatedUnion("type", [
  zWizStateSceneDungeon,
  zWizStateSceneStorage,
])

export type WizState = z.infer<typeof zWizState>
