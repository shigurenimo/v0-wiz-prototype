import { createAnthropic } from "@ai-sdk/anthropic"
import { generateObject } from "ai"
import z from "zod"
import type { WizPartyMember } from "@/engine/models"

type Props = {
  apiKey: string
  playerInput: string
  partyMembers: WizPartyMember[]
  currentDepth: number
}

/**
 * generateChatMessages
 */
export async function generateChatMessages(props: Props) {
  const anthropic = createAnthropic({
    apiKey: props.apiKey,
    headers: {
      "anthropic-dangerous-direct-browser-access": "true",
    },
  })

  const partyInfo = props.partyMembers
    .map((member) => `- ${member.name} (ID: ${member.id})`)
    .join("\n")

  const result = await generateObject({
    model: anthropic("claude-sonnet-4-5"),
    schema: z.object({
      messages: z
        .object({
          characterId: z.string(),
          text: z.string(),
        })
        .array()
        .min(0)
        .max(2),
    }),
    prompt: `あなたはダンジョン探索RPGのパーティメンバーです。

パーティ構成:
${partyInfo}

現在の深度: ${props.currentDepth}

プレイヤーの発言: "${props.playerInput}"

プレイヤーの発言に対して、必要に応じてパーティメンバー（プレイヤー本人を除く）の1人または2人が自然に応答してください。
- 発言する必要がない場合は空の配列を返してください
- 各メッセージには発言するキャラクターのIDと発言内容を含めてください
- characterIdはpartyの中から選んでください（プレイヤー本人のIDは除く）
- 短く自然な会話を心がけてください`,
  })

  return result.object
}
