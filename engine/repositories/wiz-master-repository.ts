import { type WizMaster, zWizMaster } from "@/engine/models/wiz-master"
import { WizCharacterRepository } from "@/engine/repositories/wiz-character-repository"
import { WizDungeonEventRepository } from "@/engine/repositories/wiz-dungeon-event.repository"
import { WizDungeonRepository } from "@/engine/repositories/wiz-dungeon-repository"
import { WizEnemyRepository } from "@/engine/repositories/wiz-enemy-repository"
import { InventoryItemRepository } from "@/engine/repositories/wiz-inventory-item.repository"
import { WizItemRepository } from "@/engine/repositories/wiz-item-repository"
import { WizSpriteSheetRepository } from "@/engine/repositories/wiz-sprite-sheet-repository"

/**
 * WizMasterRepository
 *
 * 全てのマスターデータ（Master Data）を統合して管理するRepository（Repository）
 */
export class WizMasterRepository {
  private readonly characterRepository: WizCharacterRepository
  private readonly itemRepository: WizItemRepository
  private readonly dungeonRepository: WizDungeonRepository
  private readonly dungeonEventRepository: WizDungeonEventRepository
  private readonly inventoryItemRepository: InventoryItemRepository
  private readonly spriteSheetRepository: WizSpriteSheetRepository
  private readonly enemyRepository: WizEnemyRepository

  constructor() {
    this.characterRepository = new WizCharacterRepository()
    this.itemRepository = new WizItemRepository()
    this.dungeonRepository = new WizDungeonRepository()
    this.dungeonEventRepository = new WizDungeonEventRepository()
    this.inventoryItemRepository = new InventoryItemRepository()
    this.spriteSheetRepository = new WizSpriteSheetRepository()
    this.enemyRepository = new WizEnemyRepository()
    Object.freeze(this)
  }

  /**
   * 全てのマスターデータを取得
   */
  async findAll(): Promise<WizMaster> {
    const characters = await this.characterRepository.findMany()
    const items = await this.itemRepository.findMany()
    const dungeons = this.dungeonRepository.findMany()
    const dungeonEvents = this.dungeonEventRepository.findMany()
    const inventoryItems = this.inventoryItemRepository.findMany()
    const spriteSheets = this.spriteSheetRepository.findMany()
    const enemies = this.enemyRepository.findMany()

    const master = zWizMaster.parse({
      characters,
      items,
      dungeons,
      dungeonEvents,
      inventoryItems,
      spriteSheets,
      enemies,
    })

    return Object.freeze(master) as WizMaster
  }
}
