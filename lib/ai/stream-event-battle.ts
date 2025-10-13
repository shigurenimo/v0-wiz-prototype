import type { GoogleGenerativeAIProvider } from "@ai-sdk/google"
import { streamObject } from "ai"
import { zStreamResultEventBattle } from "@/lib/ai/models"

const schema = zStreamResultEventBattle

type Props = {
  google: GoogleGenerativeAIProvider
  partyInfo: string
  currentDepth: number
  enemies: Array<{ id: string; enemyId: string }>
}

/**
 * streamEventBattle
 */
export function streamEventBattle(props: Props) {
  const enemiesDescription = props.enemies
    .map((enemy) => `${enemy.enemyId} (ID: ${enemy.id})`)
    .join(", ")

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
戦闘: ${enemiesDescription}が現れました！この緊迫した遭遇を臨場感を持って描写してください

1つのイベント文章を生成してください。
logsには1つのオブジェクトを含めてください。type: "EVENT_BATTLE", enemies: ${JSON.stringify(props.enemies)} を設定してください。`,
      },
    ],
  })

  return result
}
