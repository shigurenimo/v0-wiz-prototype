import { z } from "zod"

/**
 * 戦闘中の敵
 */
export const zWizEnemy = z.object({
  id: z.string(),
  enemyId: z.string(),
  hp: z.number().int().min(0),
  maxHp: z.number().int().min(0),
  atk: z.number().int().min(0),
  def: z.number().int().min(0),
})

export type WizEnemy = z.infer<typeof zWizEnemy>
