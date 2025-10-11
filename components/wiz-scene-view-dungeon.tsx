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

  const displayedMessages = props.state.chatMessages.slice(
    0,
    props.state.currentMessageIndex + 1,
  )

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
        <div className="space-y-4 overflow-hidden">
          {displayedMessages.map((message, index) => {
            const member =
              message.characterId === "system"
                ? undefined
                : props.state.vault.members.find(
                    (m) => m.characterId === message.characterId,
                  )

            const characterName =
              message.characterId === "system"
                ? undefined
                : (member?.name ?? "???")

            const isCurrentMessage = index === props.state.currentMessageIndex

            // 現在のメッセージからの距離でopacityを計算
            const distanceFromCurrent = props.state.currentMessageIndex - index
            const opacity = Math.max(0, 1 - distanceFromCurrent * 0.2)

            // opacity 0のメッセージは表示しない
            if (opacity === 0) {
              return null
            }

            return (
              <div key={`${message.characterId}-${index}`} style={{ opacity }}>
                {isCurrentMessage ? (
                  <TypewriterText
                    text={message.text}
                    speed={50}
                    characterName={characterName}
                  />
                ) : (
                  <div className="space-y-1">
                    {characterName && (
                      <div className="font-mono text-primary text-sm">
                        {characterName}
                      </div>
                    )}
                    <div className="font-mono text-primary">{message.text}</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="space-y-2">
          <WizInputForm
            inputValue={props.state.inputValue}
            dispatch={props.dispatch}
            apiKey={props.apiKey}
            state={props.state.toObject()}
            hasUnreadMessages={props.state.hasUnreadMessages}
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
