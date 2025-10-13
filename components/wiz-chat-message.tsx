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

  return (
    <div style={{ opacity: props.opacity }}>
      <div className="flex items-center gap-x-2">
        {characterName && (
          <div className="font-mono opacity-60">{characterName}</div>
        )}
        <div className="font-mono text-primary">{props.log.text}</div>
      </div>
    </div>
  )
}
