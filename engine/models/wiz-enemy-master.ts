import { z } from "zod"

/**
 * エネミーマスターデータ（Enemy Master Data）
 *
 * 敵キャラクターの基本情報
 */
export const zWizEnemyMaster = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  /**
   * スプライトシートID（Sprite Sheet ID）
   */
  spriteSheetId: z.string(),
  /**
   * 基礎HP（Base HP）
   */
  baseHp: z.number().int().min(1),
  /**
   * 基礎攻撃力（Base Attack）
   */
  baseAttack: z.number().int().min(0),
  /**
   * 基礎防御力（Base Defense）
   */
  baseDefense: z.number().int().min(0),
})

export type WizEnemyMaster = z.infer<typeof zWizEnemyMaster>
