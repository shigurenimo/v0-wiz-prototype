import type { WizStateItem } from "@/engine/models/wiz-state-item"

/**
 * Wiz State Item Entity
 */
export class WizStateItemEntity {
  constructor(private readonly item: WizStateItem) {
    Object.freeze(this)
  }

  get itemId() {
    return this.item.itemId
  }

  get quantity() {
    return this.item.quantity
  }

  /**
   * 数量を増やす
   */
  withIncrementedQuantity(amount = 1): WizStateItemEntity {
    return new WizStateItemEntity({
      ...this.item,
      quantity: this.item.quantity + amount,
    })
  }

  /**
   * 数量を減らす
   */
  withDecrementedQuantity(amount = 1): WizStateItemEntity {
    return new WizStateItemEntity({
      ...this.item,
      quantity: Math.max(1, this.item.quantity - amount),
    })
  }
}
