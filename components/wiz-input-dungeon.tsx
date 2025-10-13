"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"

type Props = {
  onSubmit: (value: string) => void
  isDisabled: boolean
  placeholder: string
}

/**
 * WizInputDungeon
 */
export function WizInputDungeon(props: Props) {
  const [inputValue, setInputValue] = useState("")

  const handleSubmit = () => {
    const trimmedValue = inputValue.trim()
    if (trimmedValue === "") {
      return
    }
    props.onSubmit(trimmedValue)
    setInputValue("")
  }

  return (
    <Input
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
          handleSubmit()
        }
      }}
      placeholder={props.placeholder}
      className="flex-1 border-border bg-secondary font-mono text-base text-primary placeholder:text-muted-foreground"
      disabled={props.isDisabled}
    />
  )
}
