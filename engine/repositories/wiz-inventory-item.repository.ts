import { z } from "zod"
import json from "@/assets/inventory-items.json"
import {
  type WizInventoryItem,
  zWizStateInventoryItem,
} from "@/engine/models/wiz-state-inventory-item"

const zJson = z.object({ items: zWizStateInventoryItem.array() })

/**
 * Inventory Item Repository
 */
export class InventoryItemRepository {
  constructor() {
    Object.freeze(this)
  }

  private get records() {
    return zJson.parse(json).items
  }

  /**
   * Find many inventory items
   */
  findMany(): readonly WizInventoryItem[] {
    return this.records
  }

  /**
   * Find one inventory item by ID
   */
  findOne(id: string): WizInventoryItem | undefined {
    return this.records.find((record) => record.id === id)
  }
}
