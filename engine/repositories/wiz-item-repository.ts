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

  /**
   * Find many items
   */
  async findMany(): Promise<readonly WizItem[]> {
    return zJson.parse(json).items
  }

  /**
   * Find one item by ID
   */
  async findOne(id: string): Promise<WizItem | undefined> {
    return zJson.parse(json).items.find((item) => item.id === id)
  }
}
