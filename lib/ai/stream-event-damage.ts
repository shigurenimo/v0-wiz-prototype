import type { GoogleGenerativeAIProvider } from "@ai-sdk/google"
import { streamObject } from "ai"
import { zStreamResultEventDamage } from "@/lib/ai/models"

const schema = zStreamResultEventDamage

type Props = {
  google: GoogleGenerativeAIProvider
  partyInfo: string
  currentDepth: number
  damage: number
}

/**
 * streamEventDamage
 */
export function streamEventDamage(props: Props) {
  const result = streamObject({
    model: props.google("gemini-2.0-flash-exp"),
    schema: schema,
    system: `あなたはダンジョン探索RPGのナレーターです。

パーティ構成:
${props.partyInfo}

現在の深度: ${props.currentDepth}

重要な指示:
- 与えられたイベントに基づいて、臨場感のある文章を生成してください
- イベントは短く、臨場感のある描写にしてください
- 深度に応じて危険度や雰囲気を調整してください
- メタ的な発言は避けてください`,
    messages: [
      {
        role: "user",
        content: `深度${props.currentDepth}で以下のイベントが発生しました。
罠の遭遇: パーティが罠に遭遇しました。${props.damage}のダメージを受けます。この状況を臨場感を持って描写してください

1つのイベント文章を生成してください。
logsには1つのオブジェクトを含めてください。type: "EVENT_DAMAGE", damage: ${props.damage} を設定してください。`,
      },
    ],
  })

  return result
}
