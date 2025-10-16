import type { GoogleGenerativeAIProvider } from "@ai-sdk/google"
import { streamObject } from "ai"
import { z } from "zod"

type Props = {
  google: GoogleGenerativeAIProvider
  actionType: "PLAYER_ATTACK" | "ENEMY_ATTACK"
  actorName: string
  targetName: string
}

const schema = z.object({
  type: z.literal("BATTLE_ACTION_MESSAGE"),
  dialogue: z.string(),
  scene: z.string(),
})

/**
 * 単一のバトルアクションのセリフと情景を生成
 */
export function streamBattleActionMessage(props: Props) {
  const isAlly = props.actionType === "PLAYER_ATTACK"

  return streamObject({
    model: props.google("gemini-2.0-flash-exp"),
    schema: schema,
    system: `あなたはダンジョン探索RPGのバトルシーンを演出します。

攻撃者: ${props.actorName}
攻撃対象: ${props.targetName}

重要な指示:
- dialogue: ${props.actorName}が発する攻撃時のセリフ（30文字以内）
- scene: 攻撃の様子を描写する情景描写（30文字以内）
- ${isAlly ? "仲間キャラクターのセリフは、パーティーメンバーや敵への語りかけ、独り言、状況への反応など、会話的で自然な言葉にしてください。「喰らえ！」「いくぞ！」のような戦闘的な掛け声は避けてください" : "敵は唸り声や威嚇の声を出します"}
- セリフは実際の会話に出てくるような自然な発言にしてください
- 情景は三人称で、動きや様子を臨場感を持って描写してください`,
    messages: [
      {
        role: "user",
        content: `${props.actorName}が${props.targetName}を攻撃します。セリフと情景を生成してください。

${
  isAlly
    ? `例:
dialogue: "サクラ、そっち行ったよ！"
scene: "リリの剣が鋭く閃き、スライムに深く切り込む。"

dialogue: "まだ元気そうだな...しぶといぞ！"
scene: "ガドの拳が唸りを上げ、ゴブリンの顔面を捉える。"

dialogue: "みんな無事？私はまだいける！"
scene: "ロウの刃が光を纏い、敵を一刀両断する。"

dialogue: "油断しないで、まだ動いてる！"
scene: "サクラの矢が風を切って敵の急所を射抜く。"

dialogue: "ここは私に任せて！"
scene: "リリが素早く敵の背後に回り込み、短剣を突き立てる。"

dialogue: "やった...いや、まだだ！"
scene: "ガドの拳が敵の顎を捉え、大きく吹き飛ばす。"`
    : `例:
dialogue: "グルルル...！"
scene: "スライムが体を膨らませ、酸を飛ばす。"

dialogue: "ギャアアア！"
scene: "ゴブリンが牙を剥き出しにして襲いかかる。"

dialogue: "シャアァッ！"
scene: "ヘドロが粘液を撒き散らしながら迫る。"`
}`,
      },
    ],
  })
}
