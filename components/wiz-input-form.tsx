"use client"

import { experimental_useObject as useObject } from "@ai-sdk/react"
import type { Dispatch } from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { WizStateMessage } from "@/engine/models/wiz-state-message"
import type { WizStateSceneDungeon } from "@/engine/models/wiz-state-scene-dungeon"
import { WizCharacterRepository } from "@/engine/repositories/wiz-character-repository"
import type { WizAction } from "@/engine/types"
import { messageSchema, streamChatMessages } from "@/lib/ai/stream-chat-messages"
import { eventSchema, streamDungeonEvent } from "@/lib/ai/stream-dungeon-event"

type Props = {
  inputValue: string
  dispatch: Dispatch<WizAction>
  apiKey: string
  state: WizStateSceneDungeon
}

/**
 * WizInputForm
 */
export function WizInputForm(props: Props) {
  const characterRepository = new WizCharacterRepository()
  const [waitingForPartyResponse, setWaitingForPartyResponse] = useState(false)
  const [lastEventText, setLastEventText] = useState("")
  const [chatPlayerInput, setChatPlayerInput] = useState("")

  // チャット用（プレイヤー入力への仲間の応答）
  const chat = useObject({
    api: "/api/chat",
    schema: messageSchema,
    fetch: async () => {
      console.log("[v0] Starting chat generation with input:", chatPlayerInput)
      console.log("[v0] API Key exists:", !!props.apiKey)

      const result = streamChatMessages({
        apiKey: props.apiKey,
        playerInput: chatPlayerInput,
        partyMembers: props.state.vault.members,
        currentDepth: props.state.depth,
        previousMessages: props.state.chatMessages,
      })

      return result.toTextStreamResponse()
    },
    onFinish: (result) => {
      console.log("[v0] Chat generation finished:", result.object)

      if (result.object?.messages) {
        const validMessages = result.object.messages.filter(
          (msg): msg is WizStateMessage =>
            msg !== undefined && typeof msg.characterId === "string" && typeof msg.text === "string",
        )
        // 履歴に追加
        props.dispatch({
          type: "ADD_CHAT_MESSAGES",
          payload: validMessages,
        })
      }
    },
  })

  // イベント用（「進む」で発生）
  const event = useObject({
    api: "/api/event",
    schema: eventSchema,
    fetch: async () => {
      console.log("[v0] Starting event generation at depth:", props.state.depth + 1)
      console.log("[v0] API Key exists:", !!props.apiKey)

      const result = streamDungeonEvent({
        apiKey: props.apiKey,
        currentDepth: props.state.depth + 1,
        partyMembers: props.state.vault.members,
      })

      return result.toTextStreamResponse()
    },
    onFinish: (result) => {
      console.log("[v0] Event generation finished:", result.object)

      if (result.object?.event) {
        const eventMessage: WizStateMessage = {
          characterId: "system",
          text: result.object.event.text,
        }
        // 履歴に追加
        props.dispatch({
          type: "ADD_CHAT_MESSAGES",
          payload: [eventMessage],
        })
        // イベントテキストを保存して、仲間の応答待ちに
        setLastEventText(result.object.event.text)
        setWaitingForPartyResponse(true)
      }
    },
  })

  const onSubmitChat = () => {
    console.log("[v0] onSubmitChat called")

    if (chat.isLoading || event.isLoading) {
      console.log("[v0] Already loading, skipping")
      return
    }

    const playerInput = props.inputValue.trim()

    if (playerInput === "") {
      return
    }

    // プレイヤー入力を履歴に追加
    const playerMessage: WizStateMessage = {
      characterId: props.state.vault.members[0].id,
      text: playerInput,
    }

    props.dispatch({
      type: "SUBMIT_INPUT",
      payload: {
        playerInput: playerInput,
        messages: [playerMessage],
      },
    })

    // チャット入力を設定してから生成開始
    setChatPlayerInput(playerInput)

    // ストリーミング生成を開始
    chat.submit({})
  }

  const onProceed = () => {
    console.log("[v0] onProceed called")

    if (chat.isLoading || event.isLoading) {
      console.log("[v0] Already loading, skipping")
      return
    }

    // 深度を増やす
    props.dispatch({
      type: "SUBMIT_INPUT",
      payload: {
        playerInput: "",
        messages: [],
      },
    })

    // イベント生成を開始
    event.submit({})
  }

  const onPartyResponse = () => {
    setWaitingForPartyResponse(false)

    // チャット入力を設定してから生成開始
    setChatPlayerInput(lastEventText)
    setLastEventText("")

    // イベントに対する仲間の応答を生成
    chat.submit({})
  }

  const isLoading = chat.isLoading || event.isLoading

  // 表示用のメッセージリスト
  const displayMessages: WizStateMessage[] = []

  // イベント生成中
  if (event.object?.event?.text) {
    displayMessages.push({
      characterId: "system",
      text: event.object.event.text,
    })
  }

  // チャット生成中のメッセージを表示
  if (chat.object?.messages) {
    const validMessages = chat.object.messages.filter(
      (msg): msg is WizStateMessage =>
        msg !== undefined && typeof msg.characterId === "string" && typeof msg.text === "string",
    )
    displayMessages.push(...validMessages)
  }

  return (
    <div className="space-y-4">
      {/* メッセージ表示エリア */}
      <div className="min-h-[200px] space-y-4">
        {displayMessages.map((message, index) => {
          const character =
            message.characterId === "system" ? undefined : characterRepository.findOne(message.characterId)

          const characterName = message.characterId === "system" ? undefined : (character?.name ?? "???")

          return (
            <div key={`${message.characterId}-${index}`}>
              <div className="space-y-1">
                {characterName && <div className="font-mono text-primary text-sm">{characterName}</div>}
                <div className="font-mono text-primary">{message.text}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 入力エリア */}
      {waitingForPartyResponse ? (
        <Button
          onClick={onPartyResponse}
          variant="outline"
          className="w-full border-border bg-secondary font-mono text-base text-primary hover:bg-accent hover:text-primary"
        >
          次へ
        </Button>
      ) : (
        <div className="flex gap-2">
          <Input
            value={props.inputValue}
            onChange={(e) => props.dispatch({ type: "SET_INPUT", payload: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                onSubmitChat()
              }
            }}
            placeholder="発言や行動を入力（例: つかれた？ / 疲れているふりをする）"
            className="flex-1 border-border bg-secondary font-mono text-base text-primary placeholder:text-muted-foreground"
            disabled={isLoading}
          />
          <Button
            onClick={onSubmitChat}
            variant="outline"
            className="border-border bg-secondary font-mono text-base text-primary hover:bg-accent hover:text-primary"
            disabled={isLoading || props.inputValue.trim() === ""}
          >
            {isLoading ? "生成中..." : "実行"}
          </Button>
          <Button
            onClick={onProceed}
            variant="outline"
            className="border-border bg-secondary font-mono text-base text-primary hover:bg-accent hover:text-primary"
            disabled={isLoading}
          >
            進む
          </Button>
        </div>
      )}
    </div>
  )
}
