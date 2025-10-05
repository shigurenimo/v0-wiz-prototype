export type EventType = "SCENERY" | "DAMAGE" | "ITEM"

/**
 * EventGenerator
 */
export class WizEventGenerator {
  constructor() {
    Object.freeze(this)
  }

  /**
   * イベント種類をランダムに生成
   */
  generate(): EventType {
    const eventTypes: EventType[] = ["SCENERY", "DAMAGE", "ITEM"]
    return eventTypes[Math.floor(Math.random() * eventTypes.length)]
  }
}
