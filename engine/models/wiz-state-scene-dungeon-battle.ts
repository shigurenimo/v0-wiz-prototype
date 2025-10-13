import { z } from "zod"
import { zWizEnemy } from "@/engine/models/wiz-enemy"
import { zWizStateCore } from "@/engine/models/wiz-state-core"

/**
 * ダンジョン戦闘画面
 */
export const zWizStateSceneDungeonBattle = zWizStateCore.extend({
  type: z.literal("dungeon-battle"),
  dungeonId: z.string(),
  depth: z.number().int().min(0),
  enemies: z.array(zWizEnemy).min(1),
  turn: z.number().int().min(0),
  chatCount: z.number().int().min(0),
})

export type WizStateSceneDungeonBattle = z.infer<
  typeof zWizStateSceneDungeonBattle
>
