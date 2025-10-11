import type { WizDungeon } from "@/engine/models/wiz-dungeon"
import type { WizStateMessage } from "@/engine/models/wiz-state-message"
import type { WizStateSceneDungeon } from "@/engine/models/wiz-state-scene-dungeon"
import { WizEventGenerator } from "@/engine/modules/wiz-event-generator"
import { generateChatMessages } from "./generate-chat-messages"
import { generateEventMessage } from "./generate-event-message"

type Props = {
  apiKey: string
  state: WizStateSceneDungeon
  dungeon: WizDungeon
}

export type EventResult = {
  messages: WizStateMessage[]
  itemId?: string
  damage?: number
}

/**
 * イベントとそれに対する会話を生成
 */
export async function generateEventMessages(
  props: Props,
): Promise<EventResult> {
  const messages: WizStateMessage[] = []

  // 1. イベントを生成
  const eventGenerator = new WizEventGenerator({
    availableItemIds: props.dungeon.availableItems,
  })
  const event = eventGenerator.generate()

  // 2. イベントメッセージを生成
  const eventMessage = await generateEventMessage({
    apiKey: props.apiKey,
    eventType: event.type,
    currentDepth: props.state.depth + 1,
  })

  messages.push({
    characterId: "system",
    text: eventMessage,
  })

  // 3. イベントに対する会話を生成
  const chatResult = await generateChatMessages({
    apiKey: props.apiKey,
    playerInput: eventMessage,
    partyMembers: props.state.vault.members,
    currentDepth: props.state.depth + 1,
    previousMessages: [
      ...props.state.chatMessages,
      { characterId: "system", text: eventMessage },
    ],
  })

  for (const message of chatResult.messages) {
    messages.push(message)
  }

  return {
    messages: messages,
    itemId: event.type === "ITEM" ? event.itemId : undefined,
    damage: event.type === "DAMAGE" ? event.damage : undefined,
  }
}
