import type { GoogleGenerativeAIProvider } from "@ai-sdk/google"
import { streamObject } from "ai"
import { z } from "zod"

const responseSchema = z.object({
  logs: z
    .object({
      type: z.enum(["chat", "event"]),
      characterId: z.string(),
      text: z.string(),
    })
    .array()
    .min(0)
    .max(2),
})

type Props = {
  google: GoogleGenerativeAIProvider
  partyInfo: string
  currentDepth: number
}

/**
 * generateEvent
 */
export function streamDungeonEvent(props: Props) {
  const result = streamObject({
    model: props.google("gemini-2.0-flash-exp"),
    schema: responseSchema,
    system: `あなたはダンジョン探索RPGのナレーターです。

パーティ構成:
${props.partyInfo}

現在の深度: ${props.currentDepth}

重要な指示:
- ダンジョン内で発生するイベントを生成してください
- イベントは短く、臨場感のある描写にしてください
- 深度に応じて危険度や雰囲気を調整してください
- メタ的な発言は避けてください`,
    messages: [
      {
        role: "user",
        content: `深度${props.currentDepth}で発生するイベントを生成してください。
イベントの種類は以下のいずれかです：
- 情景描写: ダンジョンの雰囲気や環境の変化
- 遭遇: モンスターや罠との遭遇
- 発見: アイテムや宝箱の発見

1つのイベントを生成してください。
logsには1つのオブジェクトを含めてください。type: "event", characterId: "system" を設定してください。`,
      },
    ],
  })

  return result
}
