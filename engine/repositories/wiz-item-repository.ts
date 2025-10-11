import { z } from "zod"
import json from "@/assets/items.json"
import { type WizItem, zWizItem } from "@/engine/models/wiz-item"

const zJson = z.object({ items: zWizItem.array() })

/**
 * Item Repository
 */
export class WizItemRepository {
  constructor() {
    Object.freeze(this)
  }

  private get records() {
    return zJson.parse(json).items
  }

  /**
   * Find many items
   */
  findMany(): readonly WizItem[] {
    return this.records
  }

  /**
   * Find one item by ID
   */
  findOne(id: string): WizItem | undefined {
    return this.records.find((record) => record.id === id)
  }
}
