import type { WizInventoryItem } from "@/engine/models/wiz-state-inventory-item"

/**
 * Wiz State Inventory Item Entity
 */
export class WizStateInventoryItemEntity {
  constructor(private readonly item: WizInventoryItem) {
    Object.freeze(this)
  }

  get id() {
    return this.item.id
  }

  get name() {
    return this.item.name
  }

  get quantity() {
    return this.item.quantity
  }

  /**
   * 数量を増やす
   */
  withIncrementedQuantity(): WizStateInventoryItemEntity {
    return new WizStateInventoryItemEntity({
      ...this.item,
      quantity: this.item.quantity + 1,
    })
  }

  /**
   * 数量を減らす
   */
  withDecrementedQuantity(): WizStateInventoryItemEntity {
    return new WizStateInventoryItemEntity({
      ...this.item,
      quantity: Math.max(0, this.item.quantity - 1),
    })
  }
}
