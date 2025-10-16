import { z } from "zod"
import { zWizBattleAction } from "@/engine/models/wiz-battle-action"
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
  /**
   * 行動キュー（Action Queue）
   * 「誰が何をするか」を管理
   */
  actionQueue: z.array(zWizBattleAction),
  /**
   * AI生成されたバトルメッセージ
   * actionQueueの各アクションに対応
   */
  battleMessages: z.array(z.string()),
})

export type WizStateSceneDungeonBattle = z.infer<
  typeof zWizStateSceneDungeonBattle
>
