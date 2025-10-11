"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Props = {
  onSecretKeySet: (secretKey: string) => void
}

/**
 * WizSecretKeySetup
 */
export function WizSecretKeySetup(props: Props) {
  const [secretKey, setSecretKey] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (secretKey.trim()) {
      props.onSecretKeySet(secretKey.trim())
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="font-mono text-2xl text-primary">シークレットキーを入力</h1>
          <p className="font-mono text-sm text-muted-foreground">
            ゲームにアクセスするためのシークレットキーを入力してください
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder="シークレットキー"
            className="border-border bg-secondary font-mono text-base text-primary placeholder:text-muted-foreground"
          />

          <Button
            type="submit"
            className="w-full border-border bg-secondary font-mono text-base text-primary hover:bg-accent hover:text-primary"
            disabled={!secretKey.trim()}
          >
            開始
          </Button>
        </form>
      </div>
    </div>
  )
}
