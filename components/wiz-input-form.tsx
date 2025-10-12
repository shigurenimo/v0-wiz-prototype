"use client"

import { experimental_useObject as useObject } from "@ai-sdk/react"
import type { Dispatch } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { WizStateMessage } from "@/engine/models/wiz-state-message"
import type { WizStateSceneDungeon } from "@/engine/models/wiz-state-scene-dungeon"
import type { WizAction } from "@/engine/types"

const responseSchema = z.object({
  logs: z
    .object({
      type: z.enum(["chat", "event"]),
      characterId: z.string(),
      text: z.string(),
    })
    .array()
    .min(0)
    .max(2),
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
  const api = useObject({
    api: "/api/chat",
    schema: responseSchema,
    onFinish: (result) => {
      if (!result.object?.logs) {
        return
      }

      const validLogs = result.object.logs.filter(
        (log): log is WizStateMessage & { type: "chat" | "event" } =>
          log !== undefined &&
          typeof log.characterId === "string" &&
          typeof log.text === "string",
      )

      const messages: WizStateMessage[] = validLogs.map((log) => ({
        characterId: log.characterId,
        text: log.text,
      }))

      props.dispatch({
        type: "ADD_CHAT_MESSAGES",
        payload: messages,
      })

      const eventLog = validLogs.find((log) => log.type === "event")
      if (!eventLog) {
        return
      }

      api.submit({
        type: "chat",
        secretKey: props.secretKey,
        playerInput: eventLog.text,
        state: props.state,
      })
    },
  })

  const onSubmitChat = () => {
    if (api.isLoading) {
      return
    }

    const playerInput = props.inputValue.trim()

    if (playerInput === "") {
      return
    }

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

    api.submit({
      type: "chat",
      secretKey: props.secretKey,
      playerInput: playerInput,
      state: props.state,
    })
  }

  const onProceed = () => {
    if (api.isLoading) {
      return
    }

    props.dispatch({
      type: "SUBMIT_INPUT",
      payload: {
        playerInput: "",
        messages: [],
      },
    })

    api.submit({
      type: "event",
      secretKey: props.secretKey,
      state: props.state,
    })
  }

  const isLoading = api.isLoading

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {props.state.chatMessages.slice(-10).map((message, index) => {
          const character =
            message.characterId === "system"
              ? undefined
              : props.state.vault.members.find(
                  (m) => m.id === message.characterId,
                )

          const characterName =
            message.characterId === "system"
              ? undefined
              : (character?.name ?? "???")

          const totalMessages = Math.min(props.state.chatMessages.length, 10)
          const reverseIndex = totalMessages - 1 - index
          const opacity = 1.0 - reverseIndex * 0.1

          if (opacity <= 0) {
            return null
          }

          return (
            <div
              key={`${message.characterId}-${index}`}
              style={{ opacity: opacity }}
            >
              <div className="flex items-center gap-x-2">
                {characterName && (
                  <div className="font-mono opacity-60">{characterName}</div>
                )}
                <div className="font-mono text-primary">{message.text}</div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex gap-2">
        <Input
          value={props.inputValue}
          onChange={(e) =>
            props.dispatch({ type: "SET_INPUT", payload: e.target.value })
          }
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
          {isLoading ? "..." : "実行"}
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
    </div>
  )
}
