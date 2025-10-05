import { z } from "zod"
import { zWizStateCharacter } from "@/engine/models/wiz-state-character"
import { zWizStateInventoryItem } from "@/engine/models/wiz-state-inventory-item"

/**
 * 永続化データ（Vault）
 */
export const zWizStateVault = z.object({
  id: z.string(),
  playerName: z.string(),
  members: z.array(zWizStateCharacter),
  inventory: z.array(zWizStateInventoryItem),
})

export type WizVault = z.infer<typeof zWizStateVault>
