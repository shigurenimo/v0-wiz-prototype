import { createAnthropic } from "@ai-sdk/anthropic"
import { generateText } from "ai"
import type { EventType } from "@/engine/modules/wiz-event-generator"

type Props = {
  apiKey: string
  eventType: EventType
  currentDepth: number
}

/**
 * イベントメッセージを生成
 */
export async function generateEventMessage(props: Props): Promise<string> {
  const anthropic = createAnthropic({
    apiKey: props.apiKey,
    headers: {
      "anthropic-dangerous-direct-browser-access": "true",
    },
  })

  const eventTypePrompts = {
    SCENERY: "ダンジョンの情景や雰囲気を描写してください",
    DAMAGE: "敵の攻撃や罠によるダメージイベントを描写してください",
    ITEM: "アイテムを発見するイベントを描写してください",
  }

  const result = await generateText({
    model: anthropic("claude-sonnet-4-5"),
    prompt: `あなたはダンジョン探索RPGのナレーターです。

現在の深度: ${props.currentDepth}

イベント種類: ${props.eventType}
${eventTypePrompts[props.eventType]}

要件:
- 1-2文の短い描写にしてください
- 深度が深いほど危険な内容にしてください
- ${props.eventType === "DAMAGE" ? "具体的な攻撃方法や罠の種類を含めてください" : ""}
- ${props.eventType === "ITEM" ? "具体的なアイテム名を含めてください" : ""}
- ${props.eventType === "SCENERY" ? "雰囲気や環境の変化を描写してください" : ""}
`,
  })

  return result.text
}
