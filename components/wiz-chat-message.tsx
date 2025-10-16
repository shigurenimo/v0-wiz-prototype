"use client"

import type { DeepPartial } from "ai"
import type { z } from "zod"
import type { WizStateCharacter } from "@/engine/models/wiz-state-character"
import type { zWizStateLog } from "@/engine/models/wiz-state-log"

type Props = {
  log: DeepPartial<z.infer<typeof zWizStateLog>>
  members: readonly WizStateCharacter[]
  opacity: number
}

/**
 * WizChatMessage
 */
export function WizChatMessage(props: Props) {
  const characterId =
    "characterId" in props.log ? props.log.characterId : undefined

  const character =
    !characterId || characterId === "system"
      ? undefined
      : props.members.find((m) => m.id === characterId)

  const characterName =
    !characterId || characterId === "system"
      ? undefined
      : (character?.name ?? "???")

  // EVENT_ENEMY_ATTACKの場合、ダメージ情報を結合
  let displayText = props.log.text ?? ""
  if (props.log.type === "EVENT_ENEMY_ATTACK") {
    const damage = "damage" in props.log ? props.log.damage : undefined
    const targetCharacterId =
      "targetCharacterId" in props.log ? props.log.targetCharacterId : undefined
    const targetCharacter = targetCharacterId
      ? props.members.find((m) => m.id === targetCharacterId)
      : undefined

    if (damage !== undefined && targetCharacter) {
      displayText = `${props.log.text ?? ""} ${targetCharacter.name}は${damage}のダメージを受けた！`
    }
  }

  return (
    <div style={{ opacity: props.opacity }}>
      <div className="flex items-center gap-x-2">
        {characterName && (
          <div className="font-mono opacity-60">{characterName}</div>
        )}
        <div className="font-mono text-primary">{displayText}</div>
      </div>
    </div>
  )
}
