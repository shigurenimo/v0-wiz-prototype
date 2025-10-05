import type { WizStateMessage } from "@/engine/models/wiz-state-message"
import type { WizStateSceneDungeon } from "@/engine/models/wiz-state-scene-dungeon"
import { generateChatMessages } from "./generate-chat-messages"

type Props = {
  apiKey: string
  playerInput: string
  state: WizStateSceneDungeon
}

/**
 * プレイヤーの発言に対する会話を生成
 */
export async function generatePlayerChatMessages(
  props: Props,
): Promise<WizStateMessage[]> {
  const chatResult = await generateChatMessages({
    apiKey: props.apiKey,
    playerInput: props.playerInput,
    partyMembers: props.state.vault.members,
    currentDepth: props.state.depth + 1,
    previousMessages: props.state.unreadChatMessages,
  })

  return chatResult.messages
}
