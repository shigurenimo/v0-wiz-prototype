"use client"

import type { Dispatch } from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { WizStateSceneSettingsEntity } from "@/engine/entities/wiz-state-scene-settings.entity"
import type { WizAction } from "@/engine/types"

type Props = {
  state: WizStateSceneSettingsEntity
  dispatch: Dispatch<WizAction>
  secretKey: string
  onSecretKeyDelete: () => void
}

/**
 * WizSceneViewSettings
 */
export function WizSceneViewSettings(props: Props) {
  const [showFullKey, setShowFullKey] = useState(false)

  const maskedKey = props.secretKey
    ? `${props.secretKey.slice(0, 4)}${"*".repeat(12)}${props.secretKey.slice(-4)}`
    : ""

  const handleDelete = () => {
    if (
      window.confirm(
        "シークレットキーを削除しますか？削除すると再度入力が必要になります。",
      )
    ) {
      props.onSecretKeyDelete()
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="font-bold font-mono text-2xl text-primary">設定</h1>

        <div className="space-y-4 rounded-lg border border-border bg-secondary p-6">
          <div className="space-y-2">
            <label className="font-medium font-mono text-primary text-sm">
              シークレットキー
            </label>
            <div className="flex gap-2">
              <Input
                type={showFullKey ? "text" : "password"}
                value={showFullKey ? props.secretKey : maskedKey}
                readOnly
                className="font-mono"
              />
              <Button
                onClick={() => setShowFullKey(!showFullKey)}
                variant="outline"
                size="sm"
                className="border-border bg-background font-mono text-primary hover:bg-accent"
              >
                {showFullKey ? "隠す" : "表示"}
              </Button>
            </div>
          </div>

          <Button
            onClick={handleDelete}
            variant="destructive"
            size="sm"
            className="font-mono"
          >
            シークレットキーを削除
          </Button>
        </div>

        <div className="flex justify-start">
          <Button
            onClick={() => props.dispatch({ type: "BACK_TO_DUNGEON" })}
            variant="outline"
            className="border-border bg-secondary font-mono text-primary hover:bg-accent hover:text-primary"
          >
            ダンジョンに戻る
          </Button>
        </div>
      </div>
    </main>
  )
}
