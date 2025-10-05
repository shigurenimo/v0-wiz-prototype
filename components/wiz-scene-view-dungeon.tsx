"use client"

import type { Dispatch } from "react"
import { TypewriterText } from "@/components/typewriter-text"
import { Button } from "@/components/ui/button"
import { WizInputForm } from "@/components/wiz-input-form"
import type { WizStateSceneDungeonEntity } from "@/engine/entities/wiz-state-scene-dungeon.entity"
import type { WizAction } from "@/engine/types"

type Props = {
  state: WizStateSceneDungeonEntity
  dispatch: Dispatch<WizAction>
  apiKey: string
}

/**
 * WizSceneViewDungeon
 */
export function WizSceneViewDungeon(props: Props) {
  const player = props.state.vault.members[0]

  const hasUnreadMessages = props.state.unreadChatMessages.length > 1

  const currentUnreadMessage = props.state.unreadChatMessages[0]

  const member =
    currentUnreadMessage === undefined
      ? undefined
      : props.state.vault.members.find(
          (m) => m.characterId === currentUnreadMessage.characterId,
        )

  const characterName =
    currentUnreadMessage?.characterId === "system"
      ? undefined
      : (member?.name ?? "???")

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <header className="flex w-full justify-start gap-2 font-mono text-primary text-sm">
        <div>深度: {props.state.depth}</div>
        <div>Lv: {player.level.value}</div>
        <div>
          生命: {player.hp}/{player.maxHp}
        </div>
        <div>STR: {player.strength}</div>
        <div>DEX: {player.dexterity}</div>
        <div>INT: {player.intelligence}</div>
      </header>

      <div className="w-full max-w-2xl space-y-6">
        {currentUnreadMessage && (
          <TypewriterText
            key={currentUnreadMessage.characterId + currentUnreadMessage.text}
            text={currentUnreadMessage.text}
            speed={50}
            characterName={characterName}
          />
        )}

        <div className="space-y-2">
          <WizInputForm
            inputValue={props.state.inputValue}
            dispatch={props.dispatch}
            apiKey={props.apiKey}
            state={props.state.toObject()}
            hasUnreadMessages={hasUnreadMessages}
          />

          <div className="flex justify-start gap-2">
            <Button
              onClick={() => props.dispatch({ type: "STOP" })}
              variant="outline"
              size="sm"
              className="border-border bg-secondary font-mono text-primary hover:bg-accent hover:text-primary"
            >
              たちどまる
            </Button>
            <Button
              onClick={() => props.dispatch({ type: "UNKNOWN" })}
              variant="outline"
              size="sm"
              className="border-border bg-secondary font-mono text-primary hover:bg-accent hover:text-primary"
            >
              ???
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
