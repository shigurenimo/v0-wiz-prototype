import { z } from "zod"
import { zWizStateCharacter } from "@/engine/models/wiz-state-character"
import { zWizStateItem } from "@/engine/models/wiz-state-item"
import { zWizStateLog } from "@/engine/models/wiz-state-log"

/**
 * 永続化データ（Vault）
 */
export const zWizStateVault = z.object({
  id: z.string(),
  playerName: z.string(),
  player: zWizStateCharacter,
  members: z.array(zWizStateCharacter),
  inventory: z.array(zWizStateItem),
  logs: z.array(zWizStateLog),
  secretKey: z.string().nullable(),
})

export type WizVault = z.infer<typeof zWizStateVault>
