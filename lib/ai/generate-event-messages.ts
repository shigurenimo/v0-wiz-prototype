import type { WizStateMessage } from "@/engine/models/wiz-state-message"
import type { WizStateSceneDungeon } from "@/engine/models/wiz-state-scene-dungeon"
import { WizEventGenerator } from "@/engine/modules/wiz-event-generator"
import { generateChatMessages } from "./generate-chat-messages"
import { generateEventMessage } from "./generate-event-message"

type Props = {
  apiKey: string
  state: WizStateSceneDungeon
}

/**
 * イベントとそれに対する会話を生成
 */
export async function generateEventMessages(
  props: Props,
): Promise<WizStateMessage[]> {
  const messages: WizStateMessage[] = []

  // 1. イベントの種類を生成
  const eventGenerator = new WizEventGenerator()
  const eventType = eventGenerator.generate()

  // 2. イベントメッセージを生成
  const eventMessage = await generateEventMessage({
    apiKey: props.apiKey,
    eventType: eventType,
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
      ...props.state.unreadChatMessages,
      { characterId: "system", text: eventMessage },
    ],
  })

  for (const message of chatResult.messages) {
    messages.push(message)
  }

  return messages
}
