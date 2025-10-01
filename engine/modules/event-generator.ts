type EventType = "SCENERY" | "DAMAGE" | "ITEM"

type EventResult = {
  type: EventType
  message: string
  damage?: number
  item?: string
}

type Props = {
  sceneryMessages: string[]
  damageEvents: { message: string; damage: number }[]
  itemEvents: string[]
}

/**
 * EventGenerator
 */
export class EventGenerator {
  constructor(private readonly props: Props) {
    Object.freeze(this)
  }

  /**
   * generate
   */
  generate(): EventResult {
    const eventTypes: EventType[] = ["SCENERY", "DAMAGE", "ITEM"]
    const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)]

    switch (randomType) {
      case "SCENERY": {
        const randomIndex = Math.floor(
          Math.random() * this.props.sceneryMessages.length,
        )
        return {
          type: "SCENERY",
          message: this.props.sceneryMessages[randomIndex],
        }
      }
      case "DAMAGE": {
        const randomIndex = Math.floor(
          Math.random() * this.props.damageEvents.length,
        )
        const event = this.props.damageEvents[randomIndex]
        return {
          type: "DAMAGE",
          message: `${event.message} ${event.damage}のダメージを受けた！`,
          damage: event.damage,
        }
      }
      case "ITEM": {
        const randomIndex = Math.floor(
          Math.random() * this.props.itemEvents.length,
        )
        const item = this.props.itemEvents[randomIndex]
        return { type: "ITEM", message: item, item }
      }
    }
  }
}
