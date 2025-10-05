import dungeonsData from "@/assets/dungeons.json"
import { type WizDungeon, zWizDungeon } from "@/engine/models/wiz-dungeon"

/**
 * Dungeon Repository
 */
export class DungeonRepository {
  private readonly items: readonly WizDungeon[]

  constructor() {
    this.items = zWizDungeon.array().parse(dungeonsData.items)
    Object.freeze(this)
  }

  /**
   * Find many dungeons
   */
  findMany(): readonly WizDungeon[] {
    return this.items
  }

  /**
   * Find one dungeon by ID
   */
  findOne(id: string): WizDungeon | undefined {
    return this.items.find((dungeon) => dungeon.id === id)
  }
}
