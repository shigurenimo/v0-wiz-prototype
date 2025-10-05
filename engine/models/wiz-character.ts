import { z } from "zod"
import { zWizCharacterRelationship } from "@/engine/models/wiz-character-relationship"

/**
 * キャラクター・プロトタイプ
 */
export const zWizCharacter = z.object({
  id: z.string(),
  name: z.string(),
  author: z.string().nullable(),
  baseStatusPoint: z.number().int().min(0),
  baseStrengthPoint: z.number().int().min(0),
  baseDexterityPoint: z.number().int().min(0),
  baseIntelligencePoint: z.number().int().min(0),
  profile: z.object({
    age: z.number().int().min(0),
    gender: z.string(),
    occupation: z.string(),
    description: z.string(),
  }),
  personality: z.object({
    trait: z.string(),
    tone: z.string(),
    coreValue: z.string(),
    contradiction: z.string(),
  }),
  backstory: z.string(),
  relationships: z.array(zWizCharacterRelationship),
  exampleDialogues: z.array(z.string()),
})

export type WizCharacter = z.infer<typeof zWizCharacter>
