import type { GoogleGenerativeAIProvider } from "@ai-sdk/google"
import { streamObject } from "ai"
import { z } from "zod"
import { WizEventGenerator } from "@/engine/modules/wiz-event-generator"

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
  event: z
    .object({
      type: z.enum(["SCENERY", "DAMAGE", "ITEM", "COMBAT"]),
      enemyName: z.string().optional(),
      damage: z.number().optional(),
      itemId: z.string().optional(),
    })
    .optional(),
})

type Props = {
  google: GoogleGenerativeAIProvider
  partyInfo: string
  currentDepth: number
  availableItemIds: string[]
}

/**
 * generateEvent
 */
export function streamDungeonEvent(props: Props) {
  const eventGenerator = new WizEventGenerator({
    availableItemIds: props.availableItemIds,
  })
  const event = eventGenerator.generate()

  const getEventDescription = () => {
    if (event.type === "SCENERY") {
      return "情景描写: ダンジョンの雰囲気や環境の変化を描写してください"
    }
    if (event.type === "DAMAGE") {
      return `罠の遭遇: パーティが罠に遭遇しました。${event.damage}のダメージを受けます。この状況を臨場感を持って描写してください`
    }
    if (event.type === "COMBAT") {
      return `戦闘: ${event.enemyName}が現れました！この緊迫した遭遇を臨場感を持って描写してください`
    }
    return `アイテムの発見: パーティがアイテム（ID: ${event.itemId}）を発見しました。この発見の様子を描写してください`
  }

  const result = streamObject({
    model: props.google("gemini-2.0-flash-exp"),
    schema: responseSchema,
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
${getEventDescription()}

1つのイベント文章を生成してください。
logsには1つのオブジェクトを含めてください。type: "event", characterId: "system" を設定してください。`,
      },
    ],
  })

  return result
}
