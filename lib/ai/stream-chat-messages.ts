import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { streamObject } from "ai"
import { z } from "zod"
import { WizStateCharacterEntity } from "@/engine/entities/wiz-state-character.entity"
import type { WizStateCharacter } from "@/engine/models/wiz-state-character"
import type { WizStateMessage } from "@/engine/models/wiz-state-message"
import { WizCharacterRepository } from "@/engine/repositories/wiz-character-repository"

type Props = {
  apiKey: string
  playerInput: string
  partyMembers: WizStateCharacter[]
  currentDepth: number
  previousMessages: WizStateMessage[]
}

export const messageSchema = z.object({
  messages: z
    .object({
      characterId: z.string(),
      text: z.string(),
    })
    .array()
    .min(0)
    .max(2),
})

/**
 * streamChatMessages
 */
export function streamChatMessages(props: Props) {
  const characterRepository = new WizCharacterRepository()

  const google = createGoogleGenerativeAI({
    apiKey: props.apiKey,
  })

  const partyInfo = props.partyMembers
    .map((memberState) => {
      const character = characterRepository.findOne(memberState.id)
      const entity = new WizStateCharacterEntity(memberState)
      return `- ${character?.name} (ID: ${character?.id}): HP ${entity.hp}/${entity.maxHp}, STR ${entity.strength}, DEX ${entity.dexterity}, INT ${entity.intelligence}`
    })
    .join("\n")

  const conversationHistory = props.previousMessages
    .map((message) => {
      if (message.characterId === "system") {
        return `[ナレーション] ${message.text}`
      }
      const character = characterRepository.findOne(message.characterId)
      return `${character?.name}: ${message.text}`
    })
    .join("\n")

  return streamObject({
    model: google("gemini-2.0-flash-exp"),
    schema: messageSchema,
    system: `あなたはダンジョン探索RPGのパーティメンバーです。

パーティ構成:
${partyInfo}

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
- 各メッセージには発言するキャラクターのIDと発言内容を含めてください
- characterIdはpartyの中から選んでください（プレイヤー本人のIDは除く）
- 短く自然な会話を心がけてください
- プレイヤーの入力が「すすむ」の場合は空の配列を返してください`,
      },
    ],
  })
}
