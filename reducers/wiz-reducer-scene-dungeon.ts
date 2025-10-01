import type { WizStateSceneDungeon } from "@/engine/models"
import { EventGenerator } from "@/engine/modules/event-generator"
import type { WizAction } from "@/engine/types"

const eventGenerator = new EventGenerator({
  sceneryMessages: [
    "暗く湿った石の階段を降りていく。松明の光が揺れ、影が壁を這う。",
    "風が冷たく吹き、木々の葉がささやく。",
    "地下の湖に反射する光景が美しい。",
  ],
  damageEvents: [
    { message: "スライムの攻撃!", damage: 10 },
    { message: "ゴブリンの矢!", damage: 5 },
    { message: "ドラゴンの息!", damage: 20 },
  ],
  itemEvents: [
    "魔法の薬を手に入れた。",
    "盾を発見した。",
    "宝箱から金貨が取れた。",
  ],
})

/**
 * wizReducerSceneDungeon
 */
export function wizReducerSceneDungeon(
  state: WizStateSceneDungeon,
  action: WizAction,
): WizStateSceneDungeon {
  if (action.type === "NEXT_MESSAGE") {
    const event = eventGenerator.generate()
    const newDepth = state.depth + 1

    let newParty = state.vault.party
    let newInventory = state.vault.inventory

    if (event.type === "DAMAGE" && event.damage !== undefined) {
      const damage = event.damage
      newParty = state.vault.party.map((member, index) =>
        index === 0
          ? {
              ...member,
              hp: Math.max(0, member.hp - damage),
            }
          : member,
      )
    } else if (event.type === "ITEM" && event.item) {
      const existingItem = newInventory.find((item) => item.name === event.item)
      if (existingItem) {
        newInventory = newInventory.map((item) =>
          item.name === event.item
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      } else {
        newInventory = [
          ...newInventory,
          { id: crypto.randomUUID(), name: event.item, quantity: 1 },
        ]
      }
    }

    return {
      ...state,
      depth: newDepth,
      unreadChatMessages: [
        ...state.unreadChatMessages,
        {
          characterId: "system",
          text: event.message,
        },
      ],
      vault: {
        ...state.vault,
        party: newParty,
        inventory: newInventory,
      },
    }
  }

  if (action.type === "SET_INPUT") {
    return { ...state, inputValue: action.payload }
  }

  if (action.type === "SUBMIT_INPUT") {
    console.log(`発言: ${state.inputValue}`)
    return { ...state, inputValue: "" }
  }

  if (action.type === "ADD_CHAT_MESSAGES") {
    return {
      ...state,
      unreadChatMessages: [...state.unreadChatMessages, ...action.payload],
    }
  }

  if (action.type === "NEXT_CHAT") {
    const newUnreadMessages = state.unreadChatMessages.slice(1)
    return {
      ...state,
      unreadChatMessages: newUnreadMessages,
    }
  }

  if (action.type === "STOP") {
    console.log("選択: たちどまる")
    return state
  }

  if (action.type === "UNKNOWN") {
    console.log("選択: ???")
    return state
  }

  return state
}
