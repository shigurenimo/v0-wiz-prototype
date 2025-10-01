"use client"

import type { Dispatch } from "react"
import { TypewriterText } from "@/components/typewriter-text"
import { Button } from "@/components/ui/button"
import { WizInputForm } from "@/components/wiz-input-form"
import type { WizStateSceneDungeon } from "@/engine/models"
import type { WizAction } from "@/engine/types"

type Props = {
  state: WizStateSceneDungeon
  dispatch: Dispatch<WizAction>
  apiKey: string
}

/**
 * WizSceneViewDungeon
 */
export function WizSceneViewDungeon(props: Props) {
  const player = props.state.vault.party[0]

  const hasUnreadMessages = props.state.unreadChatMessages.length > 1

  const currentUnreadMessage = props.state.unreadChatMessages[0]

  const character =
    currentUnreadMessage &&
    props.state.vault.party.find(
      (member) => member.id === currentUnreadMessage.characterId,
    )

  const characterName =
    currentUnreadMessage?.characterId === "system"
      ? undefined
      : (character?.name ?? "???")

  return (
    <main className="flex min-h-screen flex-col items-center justify-end p-8">
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
            partyMembers={props.state.vault.party}
            currentDepth={props.state.depth}
            hasUnreadMessages={hasUnreadMessages}
          />

          <div className="flex justify-start gap-2">
            <Button
              onClick={() => props.dispatch({ type: "NEXT_MESSAGE" })}
              variant="outline"
              size="sm"
              className="border-border bg-secondary font-mono text-primary hover:bg-accent hover:text-primary"
            >
              すすむ
            </Button>
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
          <div className="flex gap-2 font-mono text-primary text-sm">
            <div>深度: {props.state.depth}</div>
            <div>
              生命: {player.hp}/{player.maxHp}
            </div>
            <div>MP: {player.mp}</div>
          </div>
        </div>
      </div>
    </main>
  )
}
