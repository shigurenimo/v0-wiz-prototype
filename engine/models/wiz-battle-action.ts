import { z } from "zod"

/**
 * プレイヤーの攻撃行動（Battle Action）
 */
export const zWizBattleActionPlayerAttack = z.object({
  type: z.literal("PLAYER_ATTACK"),
  actorId: z.string(),
  targetEnemyId: z.string(),
})

/**
 * 敵の攻撃行動（Battle Action）
 */
export const zWizBattleActionEnemyAttack = z.object({
  type: z.literal("ENEMY_ATTACK"),
  actorEnemyId: z.string(),
  targetCharacterId: z.string(),
})

/**
 * ターン終了処理（Battle Action）
 */
export const zWizBattleActionEndTurn = z.object({
  type: z.literal("END_TURN"),
})

/**
 * 戦闘行動（Battle Action）
 */
export const zWizBattleAction = z.union([
  zWizBattleActionPlayerAttack,
  zWizBattleActionEnemyAttack,
  zWizBattleActionEndTurn,
])

export type WizBattleAction = z.infer<typeof zWizBattleAction>
