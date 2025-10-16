import { z } from "zod"

/**
 * 戦闘ログ（Battle Log）
 */
export const zWizBattleLog = z.object({
  id: z.string(),
  /**
   * ログのタイプ（Type）
   */
  type: z.enum([
    "PLAYER_ATTACK",
    "ENEMY_ATTACK",
    "PLAYER_DAMAGE",
    "ENEMY_DAMAGE",
  ]),
  /**
   * ログのテキスト（Text）
   */
  text: z.string(),
  /**
   * ダメージ量（Damage Amount）
   */
  damage: z.number().int().min(0).optional(),
})

export type WizBattleLog = z.infer<typeof zWizBattleLog>
