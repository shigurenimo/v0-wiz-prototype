export type EventType = "SCENERY" | "DAMAGE" | "ITEM"

export type GeneratedEvent =
  | { type: "SCENERY" }
  | { type: "DAMAGE"; damage: number }
  | { type: "ITEM"; itemId: string }

type Props = {
  availableItemIds: string[]
}

/**
 * EventGenerator
 */
export class WizEventGenerator {
  constructor(private readonly props: Props) {
    Object.freeze(this)
  }

  /**
   * イベントをランダムに生成
   */
  generate(): GeneratedEvent {
    const eventTypes: EventType[] = ["SCENERY", "DAMAGE", "ITEM"]
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]

    if (eventType === "DAMAGE") {
      return {
        type: "DAMAGE",
        damage: Math.floor(Math.random() * 10) + 5,
      }
    }

    if (eventType === "ITEM") {
      const itemId =
        this.props.availableItemIds[
          Math.floor(Math.random() * this.props.availableItemIds.length)
        ]
      return {
        type: "ITEM",
        itemId: itemId,
      }
    }

    return { type: "SCENERY" }
  }
}
