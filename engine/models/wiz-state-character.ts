import { z } from "zod"
import { zWizCharacter } from "@/engine/models/wiz-character"

/**
 * パーティメンバーの状態
 */
export const zWizStateCharacter = zWizCharacter.extend({
  hp: z.number().int().min(0),
  experience: z.number().int().min(0),
  baseExperience: z.number().int().min(0),
  multiplier: z.number().min(0),
  strengthPoint: z.number().int().min(0),
  dexterityPoint: z.number().int().min(0),
  intelligencePoint: z.number().int().min(0),
})

export type WizStateCharacter = z.infer<typeof zWizStateCharacter>
