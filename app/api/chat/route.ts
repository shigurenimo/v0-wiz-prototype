import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { streamObject } from "ai"
import { z } from "zod"
import { WizStateCharacterEntity } from "@/engine/entities/wiz-state-character.entity"
import type { WizStateCharacter } from "@/engine/models/wiz-state-character"
import type { WizStateMessage } from "@/engine/models/wiz-state-message"
import { WizCharacterRepository } from "@/engine/repositories/wiz-character-repository"

const messageSchema = z.object({
  messages: z
    .object({
      characterId: z.string(),
      text: z.string(),
    })
    .array()
    .min(0)
    .max(2),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { secretKey, playerInput, partyMembers, currentDepth, previousMessages } = body

    // 環境変数からシークレットキーを取得
    const validSecretKey = process.env.SECRET_KEY
    if (!validSecretKey) {
      return new Response("Server configuration error", { status: 500 })
    }

    if (secretKey !== validSecretKey) {
      return new Response("Unauthorized", { status: 401 })
    }

    // 環境変数からAPIキーを取得
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) {
      return new Response("API key not configured", { status: 500 })
    }

    const characterRepository = new WizCharacterRepository()

    const google = createGoogleGenerativeAI({
      apiKey: apiKey,
    })

    const partyInfo = (partyMembers as WizStateCharacter[])
      .map((memberState) => {
        const character = characterRepository.findOne(memberState.id)
        const entity = new WizStateCharacterEntity(memberState)
        return `- ${character?.name} (ID: ${character?.id}): HP ${entity.hp}/${entity.maxHp}, STR ${entity.strength}, DEX ${entity.dexterity}, INT ${entity.intelligence}`
      })
      .join("\n")

    const conversationHistory = (previousMessages as WizStateMessage[])
      .map((message) => {
        if (message.characterId === "system") {
          return `[ナレーション] ${message.text}`
        }
        const character = characterRepository.findOne(message.characterId)
        return `${character?.name}: ${message.text}`
      })
      .join("\n")

    const result = streamObject({
      model: google("gemini-2.0-flash-exp"),
      schema: messageSchema,
      system: `あなたはダンジョン探索RPGのパーティメンバーです。

パーティ構成:
${partyInfo}

現在の深度: ${currentDepth}

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

プレイヤーの入力: "${playerInput}"

プレイヤーの発言または行動に対して、必要に応じてパーティメンバー（プレイヤー本人を除く）の1人または2人が自然に応答してください。
- 発言する必要がない場合は空の配列を返してください
- 各メッセージには発言するキャラクターのIDと発言内容を含めてください
- characterIdはpartyの中から選んでください（プレイヤー本人のIDは除く）
- 短く自然な会話を心がけてください
- プレイヤーの入力が「すすむ」の場合は空の配列を返してください`,
        },
      ],
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Internal server error", { status: 500 })
  }
}
