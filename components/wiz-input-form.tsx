"use client"

import { useMutation } from "@tanstack/react-query"
import type { Dispatch } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { WizStateSceneDungeon } from "@/engine/models/wiz-state-scene-dungeon"
import { DungeonRepository } from "@/engine/repositories/dungeon-repository"
import type { WizAction } from "@/engine/types"
import { generateEventMessages } from "@/lib/ai/generate-event-messages"
import { generatePlayerChatMessages } from "@/lib/ai/generate-player-chat-messages"

type Props = {
  inputValue: string
  dispatch: Dispatch<WizAction>
  apiKey: string
  state: WizStateSceneDungeon
  hasUnreadMessages: boolean
}

/**
 * WizInputForm
 */
export function WizInputForm(props: Props) {
  const dungeonRepository = new DungeonRepository()

  // 2つ目: イベントとそれに対する会話を生成
  const eventMutation = useMutation({
    mutationFn: async (variables: {
      apiKey: string
      state: WizStateSceneDungeon
    }) => {
      const dungeon = dungeonRepository.findOne(variables.state.dungeonId)
      if (!dungeon) {
        return undefined
      }

      return await generateEventMessages({
        apiKey: variables.apiKey,
        state: variables.state,
        dungeon: dungeon,
      })
    },
    onSuccess(eventResult) {
      if (!eventResult) {
        return
      }

      let newState = props.state
      const messages = eventResult.messages

      // イベント結果を適用
      if (eventResult.itemId) {
        newState = {
          ...newState,
          vault: {
            ...newState.vault,
            inventory: newState.vault.inventory.find(
              (item) => item.itemId === eventResult.itemId,
            )
              ? newState.vault.inventory.map((item) =>
                  item.itemId === eventResult.itemId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item,
                )
              : [
                  ...newState.vault.inventory,
                  { itemId: eventResult.itemId, quantity: 1 },
                ],
          },
        }
      }

      if (eventResult.damage) {
        newState = {
          ...newState,
          vault: {
            ...newState.vault,
            members: newState.vault.members.map((member, index) =>
              index === 0
                ? {
                    ...member,
                    hp: Math.max(0, member.hp - eventResult.damage!),
                  }
                : member,
            ),
          },
        }
      }

      // メッセージを追加
      props.dispatch({
        type: "ADD_CHAT_MESSAGES",
        payload: messages,
      })
    },
  })

  // 1つ目: プレイヤーの発言に対する会話を生成
  const playerMutation = useMutation({
    mutationFn: async (variables: {
      apiKey: string
      playerInput: string
      state: WizStateSceneDungeon
    }) => {
      return await generatePlayerChatMessages(variables)
    },
    onSuccess(messages, variables) {
      // まず深度を進めてプレイヤーの会話を追加
      props.dispatch({
        type: "SUBMIT_INPUT",
        payload: {
          playerInput: variables.playerInput,
          messages: messages,
        },
      })

      // イベント生成用に現在のstateを取得（深度+1、メッセージ追加後）
      const newState: WizStateSceneDungeon = {
        ...variables.state,
        depth: variables.state.depth + 1,
        chatMessages: [...variables.state.chatMessages, ...messages],
        currentMessageIndex: variables.state.chatMessages.length,
      }

      // その後、イベント生成を開始
      eventMutation.mutate({
        apiKey: variables.apiKey,
        state: newState,
      })
    },
  })

  const onSubmit = () => {
    // イベント生成中は「次へ」も発言もブロック
    if (eventMutation.isPending) {
      return
    }

    if (props.hasUnreadMessages) {
      props.dispatch({ type: "NEXT_CHAT" })
      return
    }

    const playerInput = props.inputValue.trim()

    if (playerInput === "") {
      return
    }

    playerMutation.mutate({
      apiKey: props.apiKey,
      playerInput: playerInput,
      state: props.state,
    })
  }

  // プレイヤー発言とイベント生成の両方が完了するまでローディング
  const isLoading = playerMutation.isPending || eventMutation.isPending

  return (
    <div className="flex gap-2">
      {!props.hasUnreadMessages && (
        <Input
          value={props.inputValue}
          onChange={(e) =>
            props.dispatch({ type: "SET_INPUT", payload: e.target.value })
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              onSubmit()
            }
          }}
          placeholder="発言や行動を入力（例: つかれた？ / 疲れているふりをする / すすむ）"
          className="flex-1 border-border bg-secondary font-mono text-base text-primary placeholder:text-muted-foreground"
          disabled={isLoading}
        />
      )}
      <Button
        onClick={onSubmit}
        variant="outline"
        className={`border-border bg-secondary font-mono text-base text-primary hover:bg-accent hover:text-primary ${props.hasUnreadMessages ? "w-full" : ""}`}
        disabled={
          isLoading ||
          (!props.hasUnreadMessages && props.inputValue.trim() === "")
        }
      >
        {eventMutation.isPending
          ? "イベント生成中..."
          : playerMutation.isPending
            ? "生成中..."
            : props.hasUnreadMessages
              ? "次へ"
              : "実行"}
      </Button>
    </div>
  )
}
