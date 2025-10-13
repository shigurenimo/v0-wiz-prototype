import type { GoogleGenerativeAIProvider } from "@ai-sdk/google"
import { streamObject } from "ai"
import { z } from "zod"
import type { WizStateCharacter } from "@/engine/models/wiz-state-character"
import {
  type zWizStateLog,
  zWizStateLogEventChat,
} from "@/engine/models/wiz-state-log"

const schema = z.object({
  type: z.literal("EVENT_CHAT"),
  logs: zWizStateLogEventChat.array().min(0),
})

type Props = {
  google: GoogleGenerativeAIProvider
  partyInfo: string
  currentDepth: number
  chatMessages: z.infer<typeof zWizStateLog>[]
  playerInput: string
  characters: readonly WizStateCharacter[]
}

/**
 * generateChat
 */
export function streamDungeonChat(props: Props) {
  const conversationHistory = props.chatMessages
    .map((message) => {
      const characterId =
        "characterId" in message ? message.characterId : undefined
      if (!characterId || characterId === "system") {
        return `[ナレーション] ${message.text}`
      }
      const character = props.characters.find((c) => c.id === characterId)
      return `${character?.name}: ${message.text}`
    })
    .join("\n")

  const result = streamObject({
    model: props.google("gemini-2.0-flash-exp"),
    schema: schema,
    system: `あなたはダンジョン探索RPGのパーティメンバーです。

パーティ構成:
${props.partyInfo}

現在の深度: ${props.currentDepth}

重要な指示:
- キャラクターとして自然に応答してください
- メタ的な発言（「深度1だから」「これぐらいで」など）は避けてください
- ダンジョン内での冒険者として、状況に応じた発言をしてください
- キャラクターの性格や職業に合わせた発言をしてください
- プレイヤーの行動（「寒いふりをした」など）にも適切に反応してください`,
    messages: [
      {
        role: "user",
        content: `これまでの会話:
${conversationHistory}

プレイヤーの入力: "${props.playerInput}"

プレイヤーの発言または行動に対して、必要に応じてパーティメンバー（プレイヤー本人を除く）の1人または2人が自然に応答してください。
- 発言する必要がない場合は空の配列を返してください
- 各ログには type: "EVENT_CHAT", characterId, text を含めてください
- characterIdはpartyの中から選んでください（プレイヤー本人のIDは除く）
- 短く自然な会話を心がけてください
- プレイヤーの入力が「すすむ」の場合は空の配列を返してください`,
      },
    ],
  })

  return result
}
