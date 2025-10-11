import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { streamObject } from "ai"
import { z } from "zod"
import { WizStateCharacterEntity } from "@/engine/entities/wiz-state-character.entity"
import type { WizStateCharacter } from "@/engine/models/wiz-state-character"
import { WizCharacterRepository } from "@/engine/repositories/wiz-character-repository"

const eventSchema = z.object({
  event: z.object({
    text: z.string(),
  }),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { secretKey, currentDepth, partyMembers } = body

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

    const result = streamObject({
      model: google("gemini-2.0-flash-exp"),
      schema: eventSchema,
      system: `あなたはダンジョン探索RPGのナレーターです。

パーティ構成:
${partyInfo}

現在の深度: ${currentDepth}

重要な指示:
- ダンジョン内で発生するイベントを生成してください
- イベントは短く、臨場感のある描写にしてください
- 深度に応じて危険度や雰囲気を調整してください
- メタ的な発言は避けてください`,
      messages: [
        {
          role: "user",
          content: `深度${currentDepth}で発生するイベントを生成してください。
イベントの種類は以下のいずれかです：
- 情景描写: ダンジョンの雰囲気や環境の変化
- 遭遇: モンスターや罠との遭遇
- 発見: アイテムや宝箱の発見

1つのイベントを生成してください。`,
        },
      ],
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Event API error:", error)
    return new Response("Internal server error", { status: 500 })
  }
}
