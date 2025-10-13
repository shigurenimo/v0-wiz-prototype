"use client"

import { experimental_useObject as useObject } from "@ai-sdk/react"
import type { Dispatch } from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { WizChatMessage } from "@/components/wiz-chat-message"
import { WizDungeonHeader } from "@/components/wiz-dungeon-header"
import { WizPixelArtAnimation } from "@/components/wiz-pixel-art-animation"
import type { WizStateSceneDungeonBattleEntity } from "@/engine/entities/wiz-state-scene-dungeon-battle.entity"
import type { WizMaster } from "@/engine/models/wiz-master"
import type { WizAction } from "@/engine/types"
import { zStreamResult } from "@/lib/ai/models"
import { useAnimationFrame } from "@/lib/use-animation-frame"

type Props = {
  master: WizMaster
  state: WizStateSceneDungeonBattleEntity
  dispatch: Dispatch<WizAction>
  secretKey: string
}

/**
 * WizSceneViewDungeonBattle
 */
export function WizSceneViewDungeonBattle(props: Props) {
  const player = props.state.vault.player

  const [inputValue, setInputValue] = useState("")

  const firstEnemy = props.state.enemies[0]
  const enemyMaster = props.master.enemies.find(
    (e) => e.id === firstEnemy?.enemyId,
  )
  const enemySpriteSheet = props.master.spriteSheets.find(
    (s) => s.id === enemyMaster?.spriteSheetId,
  )

  const currentFrame = useAnimationFrame({
    frameCount: enemySpriteSheet?.frames.length ?? 1,
    frameDelay: 300,
  })

  const api = useObject({
    api: "/api/chat",
    schema: zStreamResult,
    onFinish(result) {
      if (!result.object) return

      if (result.object.type === "EVENT_CHAT") {
        props.dispatch({
          type: "ADD_EVENT_CHAT",
          payload: result.object.logs,
        })
        return
      }
    },
  })

  const onSubmitChat = (playerInput: string) => {
    if (api.isLoading) return

    if (props.state.chatCount >= 2) return

    const playerMessage = {
      id: crypto.randomUUID(),
      type: "EVENT_USER_CHAT" as const,
      characterId: props.state.vault.player.id,
      text: playerInput,
    }

    props.dispatch({
      type: "ADD_USER_ACTION",
      payload: [playerMessage],
    })

    api.submit({
      type: "chat",
      secretKey: props.secretKey,
      playerInput: playerInput,
      state: props.state.toObject(),
    })
  }

  const streamingLogs =
    api.isLoading && api.object?.logs
      ? api.object.logs.filter((log) => log !== undefined)
      : []

  const historyLogs = props.state.vault.logs
  const _displayLogs = api.isLoading
    ? [...historyLogs, ...streamingLogs]
    : historyLogs

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <WizDungeonHeader depth={props.state.depth} player={player} />

      <div className="fixed top-0 right-0 left-0 flex items-center justify-center pt-40">
        <div className="flex gap-x-8">
          <WizPixelArtAnimation
            frames={enemySpriteSheet?.frames ?? []}
            currentFrameIndex={currentFrame}
          />
          <WizPixelArtAnimation
            frames={enemySpriteSheet?.frames ?? []}
            currentFrameIndex={currentFrame}
          />
        </div>
      </div>

      <div className="w-full max-w-2xl space-y-6">
        <div className="space-y-4">
          {_displayLogs.slice(-10).map((log, index) => {
            const sum = Math.min(_displayLogs.length, 10)
            const opacity = 1.0 - (sum - 1 - index) * 0.1
            if (opacity <= 0) return null
            return (
              <WizChatMessage
                key={log.id ?? `log-${index}`}
                log={log}
                members={props.state.vault.members}
                opacity={opacity}
              />
            )
          })}
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault()
                  const trimmed = inputValue.trim()
                  if (trimmed) {
                    onSubmitChat(trimmed)
                    setInputValue("")
                  }
                }
              }}
              disabled={api.isLoading || props.state.chatCount >= 2}
              placeholder={
                props.state.chatCount >= 2
                  ? "これ以上は話す余裕はないみたい"
                  : "発言や行動を入力（例: つかれた？ / 疲れているふりをする）"
              }
              className="flex-1 border-border bg-background font-mono text-base text-primary"
            />
            <Button
              onClick={() => {
                const trimmed = inputValue.trim()
                if (trimmed) {
                  onSubmitChat(trimmed)
                  setInputValue("")
                }
              }}
              variant="outline"
              className="border-border bg-secondary font-mono text-base text-primary hover:bg-accent hover:text-primary"
              disabled={
                api.isLoading ||
                !inputValue.trim() ||
                props.state.chatCount >= 2
              }
            >
              行動
            </Button>
          </div>
          <div className="flex justify-start gap-2">
            <Button
              onClick={() => props.dispatch({ type: "BATTLE_ATTACK" })}
              variant="outline"
              size="sm"
              className="border-border bg-secondary font-mono text-primary hover:bg-accent hover:text-primary"
            >
              たたかう
            </Button>
            <Button
              onClick={() => props.dispatch({ type: "UNKNOWN" })}
              variant="outline"
              size="sm"
              className="border-border bg-secondary font-mono text-primary hover:bg-accent hover:text-primary"
            >
              どうぐ
            </Button>
            <Button
              onClick={() => props.dispatch({ type: "END_COMBAT" })}
              variant="outline"
              size="sm"
              className="border-border bg-secondary font-mono text-primary hover:bg-accent hover:text-primary"
            >
              にげる
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
