export type EventType = "SCENERY" | "DAMAGE" | "ITEM" | "COMBAT"

export type GeneratedEvent =
  | { type: "SCENERY" }
  | { type: "DAMAGE"; damage: number }
  | { type: "ITEM"; itemId: string }
  | { type: "COMBAT"; enemyName: string }

type Props = {
  availableItemIds: string[]
}

const ENEMY_NAMES = ["ゴブリン", "スケルトン", "オーク", "ゾンビ", "コボルト"]

/**
 * EventGenerator
 */
export class WizEventGenerator {
  constructor(readonly _props: Props) {
    Object.freeze(this)
  }

  /**
   * イベントをランダムに生成
   */
  generate(): GeneratedEvent {
    // デバッグ用: 戦闘100%
    const enemyName =
      ENEMY_NAMES[Math.floor(Math.random() * ENEMY_NAMES.length)]
    return {
      type: "COMBAT",
      enemyName: enemyName,
    }

    // const eventTypes: EventType[] = ["SCENERY", "DAMAGE", "ITEM", "COMBAT"]
    // const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]

    // if (eventType === "COMBAT") {
    //   const enemyName = ENEMY_NAMES[Math.floor(Math.random() * ENEMY_NAMES.length)]
    //   return {
    //     type: "COMBAT",
    //     enemyName: enemyName,
    //   }
    // }

    // if (eventType === "DAMAGE") {
    //   return {
    //     type: "DAMAGE",
    //     damage: Math.floor(Math.random() * 10) + 5,
    //   }
    // }

    // if (eventType === "ITEM") {
    //   const itemId =
    //     this.props.availableItemIds[
    //       Math.floor(Math.random() * this.props.availableItemIds.length)
    //     ]
    //   return {
    //     type: "ITEM",
    //     itemId: itemId,
    //   }
    // }

    // return { type: "SCENERY" }
  }
}
