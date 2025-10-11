import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { streamObject } from "ai"
import { z } from "zod"
import type { WizStateCharacter } from "@/engine/models/wiz-state-character"

type Props = {
  apiKey: string
  currentDepth: number
  partyMembers: WizStateCharacter[]
}

export const eventSchema = z.object({
  event: z.object({
    text: z.string(),
  }),
})

/**
 * streamDungeonEvent
 */
export function streamDungeonEvent(props: Props) {
  const google = createGoogleGenerativeAI({
    apiKey: props.apiKey,
  })

  return streamObject({
    model: google("gemini-2.0-flash-exp"),
    schema: eventSchema,
    system: `あなたはダンジョン探索RPGのナレーターです。

現在の深度: ${props.currentDepth}

重要な指示:
- ダンジョン内で起こるランダムイベントを生成してください
- イベントは2-3文程度の短い文章にしてください
- モンスターとの遭遇、宝箱の発見、罠、環境の変化など、様々なイベントを生成してください
- 深度が深いほど、危険度の高いイベントを生成してください
- 戦闘は発生させないでください（会話のみ）`,
    messages: [
      {
        role: "user",
        content: `パーティが前に進みました。ランダムイベントを1つ生成してください。`,
      },
    ],
  })
}
