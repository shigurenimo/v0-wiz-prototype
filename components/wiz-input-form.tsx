"use client"

import { experimental_useObject as useObject } from "@ai-sdk/react"
import type { Dispatch } from "react"
import { useState } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { WizStateMessage } from "@/engine/models/wiz-state-message"
import type { WizStateSceneDungeon } from "@/engine/models/wiz-state-scene-dungeon"
import { WizCharacterRepository } from "@/engine/repositories/wiz-character-repository"
import type { WizAction } from "@/engine/types"

const messageSchema = z.object({
  messages: z
    .object({
      characterId: z.string(),
      text: z.string(),
    })
    .array()
    .min(0)
    .max(2),
})

const eventSchema = z.object({
  event: z.object({
    text: z.string(),
  }),
})

type Props = {
  inputValue: string
  dispatch: Dispatch<WizAction>
  secretKey: string
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
  const [_accumulatedMessages, _setAccumulatedMessages] = useState<WizStateMessage[]>([])

  const chat = useObject({
    api: "/api/chat",
    schema: messageSchema,
    body: {
      secretKey: props.secretKey,
      playerInput: chatPlayerInput,
      partyMembers: props.state.vault.members,
      currentDepth: props.state.depth,
      previousMessages: props.state.chatMessages,
    },
    onFinish: (result) => {
      if (result.object?.messages) {
        const validMessages = result.object.messages.filter(
          (msg): msg is WizStateMessage =>
            msg !== undefined && typeof msg.characterId === "string" && typeof msg.text === "string",
        )
        props.dispatch({
          type: "ADD_CHAT_MESSAGES",
          payload: validMessages,
        })
      }
    },
  })

  const event = useObject({
    api: "/api/event",
    schema: eventSchema,
    body: {
      secretKey: props.secretKey,
      currentDepth: props.state.depth + 1,
      partyMembers: props.state.vault.members,
    },
    onFinish: (result) => {
      if (result.object?.event) {
        const eventMessage: WizStateMessage = {
          characterId: "system",
          text: result.object.event.text,
        }
        props.dispatch({
          type: "ADD_CHAT_MESSAGES",
          payload: [eventMessage],
        })
        setLastEventText(result.object.event.text)
        setWaitingForPartyResponse(true)
      }
    },
  })

  const onSubmitChat = () => {
    if (chat.isLoading || event.isLoading) {
      return
    }

    const playerInput = props.inputValue.trim()

    if (playerInput === "") {
      return
    }

    _setAccumulatedMessages([])

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

    setChatPlayerInput(playerInput)
    chat.submit({})
  }

  const onProceed = () => {
    if (chat.isLoading || event.isLoading) {
      return
    }

    _setAccumulatedMessages([])

    props.dispatch({
      type: "SUBMIT_INPUT",
      payload: {
        playerInput: "",
        messages: [],
      },
    })

    event.submit({})
  }

  const onPartyResponse = () => {
    setWaitingForPartyResponse(false)
    _setAccumulatedMessages([])
    setChatPlayerInput(lastEventText)
    setLastEventText("")
    chat.submit({})
  }

  const isLoading = chat.isLoading || event.isLoading

  const displayMessages: WizStateMessage[] = []

  if (event.object?.event?.text) {
    displayMessages.push({
      characterId: "system",
      text: event.object.event.text,
    })
  }

  if (chat.object?.messages) {
    const validMessages = chat.object.messages.filter(
      (msg): msg is WizStateMessage =>
        msg !== undefined && typeof msg.characterId === "string" && typeof msg.text === "string",
    )
    displayMessages.push(...validMessages)

    if (validMessages.length > _accumulatedMessages.length) {
      _setAccumulatedMessages(validMessages)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
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
