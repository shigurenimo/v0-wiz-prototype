"use client"

import { useMutation } from "@tanstack/react-query"
import type { Dispatch } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { WizPartyMember } from "@/engine/models"
import type { WizAction } from "@/engine/types"
import { generateChatMessages } from "@/lib/ai/generate-chat-messages"

type Props = {
  inputValue: string
  dispatch: Dispatch<WizAction>
  apiKey: string
  partyMembers: WizPartyMember[]
  currentDepth: number
  hasUnreadMessages: boolean
}

/**
 * WizInputForm
 */
export function WizInputForm(props: Props) {
  const mutation = useMutation({
    mutationFn: generateChatMessages,
    onSuccess(result) {
      props.dispatch({ type: "NEXT_CHAT" })
      props.dispatch({
        type: "ADD_CHAT_MESSAGES",
        payload: result.messages,
      })
    },
  })

  const onSubmit = () => {
    if (props.hasUnreadMessages) {
      props.dispatch({ type: "NEXT_CHAT" })
      return
    }

    const playerInput = props.inputValue

    props.dispatch({ type: "SUBMIT_INPUT" })

    mutation.mutate({
      apiKey: props.apiKey,
      playerInput: playerInput,
      partyMembers: props.partyMembers,
      currentDepth: props.currentDepth,
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
