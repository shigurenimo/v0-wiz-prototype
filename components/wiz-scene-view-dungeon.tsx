"use client"

import { experimental_useObject as useObject } from "@ai-sdk/react"
import type { Dispatch } from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { WizChatMessage } from "@/components/wiz-chat-message"
import { WizDungeonHeader } from "@/components/wiz-dungeon-header"
import type { WizStateSceneDungeonEntity } from "@/engine/entities/wiz-state-scene-dungeon.entity"
import type { WizMaster } from "@/engine/models/wiz-master"
import type { WizStateMessage } from "@/engine/models/wiz-state-message"
import type { WizAction } from "@/engine/types"
import { zStreamResult } from "@/lib/ai/models"

type Props = {
  master: WizMaster
  state: WizStateSceneDungeonEntity
  dispatch: Dispatch<WizAction>
  secretKey: string
}

/**
 * WizSceneViewDungeon
 */
export function WizSceneViewDungeon(props: Props) {
  const player = props.state.vault.player

  const [inputValue, setInputValue] = useState("")

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

      if (result.object.type === "EVENT_SCENE") {
        const log = result.object.logs[0]
        props.dispatch({
          type: "ADD_EVENT_SCENE",
          payload: { text: log.text },
        })
        return
      }

      if (result.object.type === "EVENT_DAMAGE") {
        const log = result.object.logs[0]
        props.dispatch({
          type: "ADD_EVENT_DAMAGE",
          payload: { damage: log.damage, text: log.text },
        })
        return
      }

      if (result.object.type === "EVENT_ITEM") {
        const log = result.object.logs[0]
        props.dispatch({
          type: "ADD_EVENT_ITEM",
          payload: { itemIds: log.itemIds, text: log.text },
        })
        return
      }

      if (result.object.type === "EVENT_BATTLE") {
        const log = result.object.logs[0]
        props.dispatch({
          type: "ADD_EVENT_BATTLE",
          payload: { enemies: log.enemies, text: log.text },
        })

        api.submit({
          type: "chat",
          secretKey: props.secretKey,
          playerInput: log.text,
          state: props.state.toObject(),
        })
        return
      }
    },
  })

  /**
   * 行動する
   */
  const onSubmitChat = (playerInput: string) => {
    if (api.isLoading) return

    const playerMessage: WizStateMessage = {
      characterId: props.state.vault.player.id,
      text: playerInput,
    }

    props.dispatch({
      type: "ADD_USER_ACTION",
      payload: [
        {
          id: crypto.randomUUID(),
          type: "EVENT_USER_CHAT",
          characterId: playerMessage.characterId,
          text: playerMessage.text,
        },
      ],
    })

    api.submit({
      type: "chat",
      secretKey: props.secretKey,
      playerInput: playerInput,
      state: props.state.toObject(),
    })
  }

  /**
   * 奥に進む
   */
  const onProceed = () => {
    if (api.isLoading) return

    props.dispatch({
      type: "PROCEED_TIME_AND_DEPTH",
      payload: [],
    })

    api.submit({
      type: "event",
      secretKey: props.secretKey,
      state: props.state.toObject(),
    })
  }

  /**
   * 戦闘に遷移する
   */
  const onFight = () => {
    if (api.isLoading) return

    props.dispatch({
      type: "START_BATTLE",
    })
  }

  const onReturnHome = () => {
    if (api.isLoading) return

    alert("未実装")
  }

  const streamingLogs =
    api.object?.logs?.filter((log) => log !== undefined) ?? []

  const currentLogs = api.isLoading ? streamingLogs : []

  const historyLogs = props.state.vault.logs

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <WizDungeonHeader
        depth={props.state.depth}
        player={player}
        dispatch={props.dispatch}
      />

      <div className="w-full max-w-2xl space-y-6">
        <div className="space-y-4">
          {historyLogs.slice(-10).map((log, index) => {
            const sum = Math.min(historyLogs.length, 10)
            const opacity = 1.0 - (sum - 1 - index) * 0.1
            if (opacity <= 0) return null
            return (
              <WizChatMessage
                key={log.id}
                log={log}
                members={props.state.vault.members}
                opacity={opacity}
              />
            )
          })}
          {currentLogs.map((message, index) => (
            <WizChatMessage
              key={index.toFixed()}
              log={message}
              members={props.state.vault.members}
              opacity={1.0}
            />
          ))}
        </div>

        {props.state.nextBattle !== null &&
          props.state.nextBattle.chatCount >= 3 && (
            <div className="font-mono text-primary">
              {"これ以上は話す余裕はないみたい"}
            </div>
          )}

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
              disabled={
                api.isLoading ||
                (props.state.nextBattle !== null &&
                  props.state.nextBattle.chatCount >= 3)
              }
              placeholder="発言や行動を入力（例: つかれた？ / 疲れているふりをする）"
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
              disabled={
                api.isLoading ||
                !inputValue.trim() ||
                (props.state.nextBattle !== null &&
                  props.state.nextBattle.chatCount >= 3)
              }
            >
              実行
            </Button>

            {props.state.nextBattle !== null ? (
              <>
                <Button
                  onClick={onFight}
                  variant="outline"
                  disabled={api.isLoading}
                >
                  戦う
                </Button>
                <Button
                  onClick={onReturnHome}
                  variant="outline"
                  disabled={api.isLoading}
                >
                  引き返す
                </Button>
              </>
            ) : (
              <Button
                onClick={onProceed}
                variant="outline"
                disabled={api.isLoading}
              >
                進む
              </Button>
            )}
          </div>
          <div className="flex justify-start gap-2">
            <Button
              onClick={() => props.dispatch({ type: "STOP" })}
              variant="outline"
              size="sm"
            >
              たちどまる
            </Button>
            <Button
              onClick={() => props.dispatch({ type: "UNKNOWN" })}
              variant="outline"
              size="sm"
            >
              ???
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
