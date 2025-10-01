"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface WizApiKeySetupProps {
  onApiKeySet: (apiKey: string) => void
}

export function WizApiKeySetup({ onApiKeySet }: WizApiKeySetupProps) {
  const [apiKey, setApiKey] = useState("")

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
          <h1 className="text-2xl font-bold">Claude APIキーの設定</h1>
          <p className="text-sm text-muted-foreground">ゲームを開始するにはClaude APIキーが必要です</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium">
              APIキー
            </label>
            <Input
              id="apiKey"
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

        <div className="space-y-2 text-xs text-muted-foreground">
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
