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

  const _partyInfo = props.state.vault.members
    .map((member) => {
      return new WizStateCharacterEntity(member)
    })
    .map((member) => {
      return `- ${member.name}: HP ${member.hp}/${member.maxHp}, STR ${member.strength}, DEX ${member.dexterity}, INT ${member.intelligence}`
    })
    .join("\n")

  const messages = props.state.chatMessages.map((message) => {
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

ダンジョンの場所: ${props.dungeon.name}
雰囲気: ${props.dungeon.description}

環境:
${props.dungeon.environment.lighting}、${props.dungeon.environment.atmosphere}、${props.dungeon.environment.temperature}

テーマ要素: ${props.dungeon.theme.primaryElements.join("、")}

重要な指示:
- マークダウン記法（#、**など）を使用しないでください
- 「深度」「レベル」などのゲーム用語を使用しないでください
- 物語の中の描写として自然な文章で書いてください
- 1〜2文の簡潔な描写にしてください
- ${props.state.narrativeSettings.perspective}視点で書いてください`,
    messages: [
      ...messages,
      {
        role: "user",
        content:
          "これまでの出来事を踏まえて、今いる場所の雰囲気や情景を描写してください。",
      },
    ],
  })

  return result.object.message
}
