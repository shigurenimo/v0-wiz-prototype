import enemiesData from "@/assets/enemies.json"
import {
  type WizEnemyMaster,
  zWizEnemyMaster,
} from "@/engine/models/wiz-enemy-master"

/**
 * WizEnemyRepository
 *
 * エネミーマスターデータ（Enemy Master Data）のRepository（Repository）
 */
export class WizEnemyRepository {
  private readonly items: readonly WizEnemyMaster[]

  constructor() {
    this.items = zWizEnemyMaster.array().parse(enemiesData.items)
    Object.freeze(this)
  }

  /**
   * Find many enemies
   */
  findMany(): readonly WizEnemyMaster[] {
    return this.items
  }

  /**
   * Find one enemy by ID
   */
  findOne(id: string): WizEnemyMaster | undefined {
    return this.items.find((enemy) => enemy.id === id)
  }
}
