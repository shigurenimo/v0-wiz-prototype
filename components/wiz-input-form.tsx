"use client"

import { useMutation } from "@tanstack/react-query"
import type { Dispatch } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { WizStateMessage } from "@/engine/models/wiz-state-message"
import type { WizStateSceneDungeon } from "@/engine/models/wiz-state-scene-dungeon"
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
  const mutation = useMutation({
    mutationFn: async (variables: {
      apiKey: string
      playerInput: string
      state: WizStateSceneDungeon
    }) => {
      const messages: WizStateMessage[] = []

      // 1. 発言に対する会話を生成
      const playerMessages = await generatePlayerChatMessages(variables)
      for (const message of playerMessages) {
        messages.push(message)
      }

      // 2. イベントとそれに対する会話を生成
      const eventMessages = await generateEventMessages({
        apiKey: variables.apiKey,
        state: variables.state,
      })
      for (const message of eventMessages) {
        messages.push(message)
      }

      return messages
    },
    onSuccess(messages, variables) {
      props.dispatch({
        type: "SUBMIT_INPUT",
        payload: { playerInput: variables.playerInput, messages: messages },
      })
    },
  })

  const onSubmit = () => {
    if (props.hasUnreadMessages) {
      props.dispatch({ type: "NEXT_CHAT" })
      return
    }

    const playerInput = props.inputValue

    mutation.mutate({
      apiKey: props.apiKey,
      playerInput: playerInput,
      state: props.state,
    })
  }

  return (
    <div className="flex gap-2">
      <Input
        value={props.inputValue}
        onChange={(e) =>
          props.dispatch({ type: "SET_INPUT", payload: e.target.value })
        }
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        placeholder="何か言ってみる.."
        className="flex-1 border-border bg-secondary font-mono text-base text-primary placeholder:text-muted-foreground"
        disabled={mutation.isPending || props.hasUnreadMessages}
      />
      <Button
        onClick={onSubmit}
        variant="outline"
        className="border-border bg-secondary font-mono text-base text-primary hover:bg-accent hover:text-primary"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "..." : props.hasUnreadMessages ? "次へ" : "発言"}
      </Button>
    </div>
  )
}
