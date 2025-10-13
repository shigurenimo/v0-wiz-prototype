import { z } from "zod"
import { zWizCharacter } from "@/engine/models/wiz-character"
import { zWizDungeon } from "@/engine/models/wiz-dungeon"
import { zWizDungeonEvent } from "@/engine/models/wiz-dungeon-event"
import { zWizEnemyMaster } from "@/engine/models/wiz-enemy-master"
import { zWizItem } from "@/engine/models/wiz-item"
import { zWizSpriteSheet } from "@/engine/models/wiz-sprite-sheet"
import { zWizStateInventoryItem } from "@/engine/models/wiz-state-inventory-item"

/**
 * マスターデータ（Master Data）
 *
 * 全てのゲームマスターデータを統合した型（Type）
 */
export const zWizMaster = z.object({
  characters: zWizCharacter.array(),
  items: zWizItem.array(),
  dungeons: zWizDungeon.array(),
  dungeonEvents: zWizDungeonEvent.array(),
  inventoryItems: zWizStateInventoryItem.array(),
  spriteSheets: zWizSpriteSheet.array(),
  enemies: zWizEnemyMaster.array(),
})

export type WizMaster = z.infer<typeof zWizMaster>
