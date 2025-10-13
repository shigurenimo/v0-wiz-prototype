export type EventType =
  | "EVENT_SCENE"
  | "EVENT_DAMAGE"
  | "EVENT_ITEM"
  | "EVENT_BATTLE"

export type GeneratedEvent =
  | { type: "EVENT_SCENE"; text: "" }
  | { type: "EVENT_DAMAGE"; damage: number; text: "" }
  | { type: "EVENT_ITEM"; itemIds: string[]; text: "" }
  | {
      type: "EVENT_BATTLE"
      enemies: Array<{ id: string; enemyId: string }>
      text: ""
    }

type Props = {
  availableItemIds: string[]
}

const _ENEMY_IDS = ["goblin", "skeleton", "orc", "zombie", "kobold"]

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
    const enemyId = _ENEMY_IDS[Math.floor(Math.random() * _ENEMY_IDS.length)]
    return {
      type: "EVENT_BATTLE",
      enemies: [
        {
          id: `enemy-${Date.now()}`,
          enemyId: enemyId,
        },
      ],
      text: "",
    }

    // const eventTypes: EventType[] = ["EVENT_SCENE", "EVENT_DAMAGE", "EVENT_ITEM", "EVENT_BATTLE"]
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
