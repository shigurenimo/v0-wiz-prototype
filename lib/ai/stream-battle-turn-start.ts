import type { GoogleGenerativeAIProvider } from "@ai-sdk/google"
import { streamObject } from "ai"
import { zStreamResultEventBattleTurnStart } from "@/lib/ai/models"

type Props = {
  google: GoogleGenerativeAIProvider
  turn: number
  allies: Array<{ name: string; hp: number; maxHp: number }>
  enemies: Array<{ name: string; hp: number; maxHp: number }>
}

/**
 * バトルターン開始時の戦況メッセージを生成
 */
export function streamBattleTurnStart(props: Props) {
  const alliesStatus = props.allies
    .map((ally) => `${ally.name} (HP: ${ally.hp}/${ally.maxHp})`)
    .join(", ")

  const enemiesStatus = props.enemies
    .map((enemy) => `${enemy.name} (HP: ${enemy.hp}/${enemy.maxHp})`)
    .join(", ")

  return streamObject({
    model: props.google("gemini-2.0-flash-exp"),
    schema: zStreamResultEventBattleTurnStart,
    system: `あなたはダンジョン探索RPGのナレーターです。

味方の状態:
${alliesStatus}

敵の状態:
${enemiesStatus}

重要な指示:
- バトルシーンの臨場感のある描写を生成してください
- 敵と味方の状態（HP）や動き、様子を具体的に描写してください
- 敵の名前や特徴（スライム、ゴブリンなど）を活用してください
- 緊張感や戦闘の雰囲気を感じられる文章にしてください
- メタ的な発言（「ターン2だから」「HP50だから」など）は避けてください
- 60文字程度の描写にしてください（短すぎず、長すぎず）`,
    messages: [
      {
        role: "user",
        content: `ターン${props.turn}の戦闘状況を描写してください。

戦闘の緊迫感や、敵と味方の動き、傷の状態などを臨場感を持って描写してください。
複数の要素を組み合わせて、より詳細な状況を描いてください。

例:
- "スライムが粘液を滴らせながら迫ってくる。息が上がり、武器を握る手に力が入らない。"
- "ゴブリンの目が血走っている。仲間も傷だらけだが、まだ戦える。油断はできない。"
- "ヘドロが不気味にうごめき、酸の臭いが鼻を突く。こちらも無傷ではない。戦いはまだ続く。"
- "敵の動きが鈍くなってきた。だがこちらも疲労が限界に近い。どちらが先に倒れるか...。"

logsには1つのオブジェクトを入れてください。
idは空文字列で構いません（後で生成されます）。`,
      },
    ],
  })
}
