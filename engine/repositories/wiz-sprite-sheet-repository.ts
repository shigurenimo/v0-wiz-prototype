import spriteSheetsData from "@/assets/sprite-sheets.json"
import {
  type WizSpriteSheet,
  zWizSpriteSheet,
} from "@/engine/models/wiz-sprite-sheet"

/**
 * WizSpriteSheetRepository
 *
 * スプライトシート（Sprite Sheet）のRepository（Repository）
 */
export class WizSpriteSheetRepository {
  private readonly items: readonly WizSpriteSheet[]

  constructor() {
    this.items = zWizSpriteSheet.array().parse(spriteSheetsData.items)
    Object.freeze(this)
  }

  /**
   * Find many sprite sheets
   */
  findMany(): readonly WizSpriteSheet[] {
    return this.items
  }

  /**
   * Find one sprite sheet by ID
   */
  findOne(id: string): WizSpriteSheet | undefined {
    return this.items.find((sheet) => sheet.id === id)
  }
}
