import { createAnthropic } from "@ai-sdk/anthropic"
import { generateObject } from "ai"
import { z } from "zod"
import { WizStateCharacterEntity } from "@/engine/entities/wiz-state-character.entity"
import type { WizDungeon } from "@/engine/models/wiz-dungeon"
import type { WizStateSceneDungeon } from "@/engine/models/wiz-state-scene-dungeon"

type Props = {
  apiKey: string
  dungeon: WizDungeon
  state: WizStateSceneDungeon
}

/**
 * Generate scenery message
 */
export async function generateSceneryMessage(props: Props) {
  const anthropic = createAnthropic({
    apiKey: props.apiKey,
    headers: {
      "anthropic-dangerous-direct-browser-access": "true",
    },
  })

  const partyInfo = props.state.vault.members
    .map((member) => {
      return new WizStateCharacterEntity(member)
    })
    .map((member) => {
      return `- ${member.name}: HP ${member.hp}/${member.maxHp}, STR ${member.strength}, DEX ${member.dexterity}, INT ${member.intelligence}`
    })
    .join("\n")

  const messages = props.state.unreadChatMessages.map((message) => {
    if (message.characterId === "system") {
      return {
        role: "assistant" as const,
        content: message.text,
      }
    }
    const memberState = props.state.vault.members.find((m) => {
      return m.id === message.characterId
    })
    const member = memberState
      ? new WizStateCharacterEntity(memberState)
      : undefined
    return {
      role: "user" as const,
      content: `${member?.name}: ${message.text}`,
    }
  })

  const result = await generateObject({
    model: anthropic("claude-sonnet-4-5"),
    schema: z.object({
      message: z.string(),
    }),
    system: `あなたはダンジョン探索RPGのナレーターです。

ダンジョン情報:
- 名前: ${props.dungeon.name}
- 説明: ${props.dungeon.description}
- トーン: ${props.state.narrativeSettings.tone}
- 視点: ${props.state.narrativeSettings.perspective}
- 詳細レベル: ${props.state.narrativeSettings.detailLevel}

環境設定:
- 照明: ${props.dungeon.environment.lighting}
- 雰囲気: ${props.dungeon.environment.atmosphere}
- 温度: ${props.dungeon.environment.temperature}

テーマ要素: ${props.dungeon.theme.primaryElements.join("、")}

現在の状況:
- 深度: ${props.state.depth}
- パーティ状態:
${partyInfo}

トーンと視点の設定を守り、簡潔で臨場感のある描写を生成してください。`,
    messages: [
      ...messages,
      {
        role: "user",
        content:
          "上記の設定とこれまでのイベントログに基づいて、ダンジョン内の雰囲気や情景を1〜2文で描写してください。",
      },
    ],
  })

  return result.object.message
}
