"use client"

import { experimental_useObject as useObject } from "@ai-sdk/react"
import type { Dispatch } from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { WizChatMessage } from "@/components/wiz-chat-message"
import { WizDungeonHeader } from "@/components/wiz-dungeon-header"
import { WizEnemy } from "@/components/wiz-enemy"
import type { WizStateSceneDungeonBattleEntity } from "@/engine/entities/wiz-state-scene-dungeon-battle.entity"
import type { WizMaster } from "@/engine/models/wiz-master"
import type { WizAction } from "@/engine/types"
import { zStreamResult } from "@/lib/ai/models"

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

      // 戦況ログが生成されたら、ログを追加してキューを生成
      if (result.object.type === "EVENT_BATTLE_TURN_START") {
        const log = result.object.logs[0]
        if (log) {
          props.dispatch({
            type: "ADD_EVENT_CHAT",
            payload: [
              {
                characterId: "",
                text: log.text,
              },
            ],
          })
        }
        // キューを生成
        props.dispatch({ type: "BATTLE_ATTACK" })
        return
      }

      // 仲間のアクションのセリフと情景が生成されたら、両方を保存してアクション処理
      if (result.object.type === "BATTLE_ACTION_MESSAGE") {
        // dialogueとsceneをbattleMessagesに保存してからアクション処理
        props.dispatch({
          type: "SET_BATTLE_MESSAGES",
          payload: [result.object.dialogue, result.object.scene],
        })
        props.dispatch({ type: "PROCESS_NEXT_ACTION" })
      }
    },
  })

  const onBattleAttack = () => {
    if (api.isLoading) return

    // 戦況生成を開始
    const allies = props.state.vault.members
      .filter((m) => m.hp > 0)
      .map((m) => ({
        name: m.name,
        hp: m.hp,
        maxHp: m.maxHp,
      }))

    const enemies = props.state.enemies
      .filter((e) => e.hp > 0)
      .map((e) => {
        const enemyMaster = props.master.enemies.find(
          (em) => em.id === e.enemyId,
        )
        return {
          name: enemyMaster?.name ?? "敵",
          hp: e.hp,
          maxHp: e.maxHp,
        }
      })

    api.submit({
      type: "battleTurnStart",
      secretKey: props.secretKey,
      turn: props.state.turn,
      allies,
      enemies,
    })
  }

  const onProcessNextAction = () => {
    if (api.isLoading) return

    const currentAction = props.state.actionQueue[0]
    if (!currentAction) {
      props.dispatch({ type: "PROCESS_NEXT_ACTION" })
      return
    }

    // プレイヤーの攻撃の場合、仲間かどうかチェック
    if (currentAction.type === "PLAYER_ATTACK") {
      const attacker = props.state.vault.members.find(
        (m) => m.id === currentAction.actorId,
      )
      const targetEnemy = props.state.enemies.find(
        (e) => e.id === currentAction.targetEnemyId,
      )
      const enemyMaster = props.master.enemies.find(
        (em) => em.id === targetEnemy?.enemyId,
      )

      // 仲間（プレイヤーではない）の場合、AI生成
      const isAlly = attacker && attacker.id !== props.state.vault.player.id

      if (attacker && targetEnemy && isAlly) {
        api.submit({
          type: "battleActionMessage",
          secretKey: props.secretKey,
          actionType: "PLAYER_ATTACK",
          actorName: attacker.name,
          targetName: enemyMaster?.name ?? "敵",
        })
        return
      }
    }

    // プレイヤー本人の攻撃または敵の攻撃は直接処理
    props.dispatch({ type: "PROCESS_NEXT_ACTION" })
  }

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
    api.object && "logs" in api.object
      ? (api.object.logs?.filter((log) => log !== undefined) ?? [])
      : []

  const currentLogs = api.isLoading ? streamingLogs : []

  const historyLogs = props.state.vault.logs

  return (
    <main className="flex h-screen min-h-screen w-full flex-col gap-y-6 p-8">
      <WizDungeonHeader
        depth={props.state.depth}
        player={player}
        dispatch={props.dispatch}
      />
      <div className="-z-10 fixed top-0 right-0 left-0 flex items-center justify-center px-8 pt-16">
        <div className="flex gap-x-8">
          {props.state.enemies.map((enemy, index) => (
            <WizEnemy
              key={enemy.id}
              master={props.master}
              enemy={enemy}
              frameOffset={index}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-end space-y-4 overflow-hidden">
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

      <div className="space-y-2">
        <div className="flex justify-start gap-2">
          {props.state.actionQueue.length === 0 && (
            <>
              <Button
                onClick={onBattleAttack}
                variant="outline"
                size="sm"
                disabled={api.isLoading}
              >
                たたかう
              </Button>
              <Button
                onClick={() => props.dispatch({ type: "UNKNOWN" })}
                variant="outline"
                size="sm"
                disabled={api.isLoading}
              >
                どうぐ
              </Button>
              <Button
                onClick={() => props.dispatch({ type: "END_COMBAT" })}
                variant="outline"
                size="sm"
                disabled={api.isLoading}
              >
                にげる
              </Button>
            </>
          )}
        </div>
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
                } else if (props.state.actionQueue.length > 0) {
                  onProcessNextAction()
                }
              }
            }}
            disabled={api.isLoading || props.state.chatCount >= 1}
            placeholder={
              props.state.chatCount >= 1
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
              } else if (props.state.actionQueue.length > 0) {
                onProcessNextAction()
              }
            }}
            variant="outline"
            disabled={
              api.isLoading ||
              (inputValue.trim() === "" && props.state.actionQueue.length === 0) ||
              (inputValue.trim() !== "" && props.state.chatCount >= 1)
            }
          >
            {inputValue.trim() === "" && props.state.actionQueue.length > 0
              ? "次へ"
              : "行動"}
          </Button>
        </div>
      </div>
    </main>
  )
}
