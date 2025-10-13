"use client"

import type React from "react"
import { useId, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface WizApiKeySetupProps {
  onApiKeySet: (apiKey: string) => void
}

export function WizApiKeySetup({ onApiKeySet }: WizApiKeySetupProps) {
  const [apiKey, setApiKey] = useState("")
  const apiKeyInputId = useId()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (apiKey.trim()) {
      localStorage.setItem("claude_api_key", apiKey.trim())
      onApiKeySet(apiKey.trim())
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="font-bold text-2xl">Claude APIキーの設定</h1>
          <p className="text-muted-foreground text-sm">
            ゲームを開始するにはClaude APIキーが必要です
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor={apiKeyInputId} className="font-medium text-sm">
              APIキー
            </label>
            <Input
              id={apiKeyInputId}
              type="password"
              placeholder="sk-ant-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="font-mono"
            />
          </div>

          <Button type="submit" className="w-full" disabled={!apiKey.trim()}>
            保存して開始
          </Button>
        </form>

        <div className="space-y-2 text-muted-foreground text-xs">
          <p>APIキーはブラウザのローカルストレージに保存されます。</p>
          <p>
            APIキーは
            <a
              href="https://console.anthropic.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Anthropic Console
            </a>
            から取得できます。
          </p>
        </div>
      </div>
    </div>
  )
}
