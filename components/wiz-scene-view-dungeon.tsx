"use client"

import type { Dispatch } from "react"
import { Button } from "@/components/ui/button"
import { WizInputForm } from "@/components/wiz-input-form"
import type { WizStateSceneDungeonEntity } from "@/engine/entities/wiz-state-scene-dungeon.entity"
import type { WizAction } from "@/engine/types"

type Props = {
  state: WizStateSceneDungeonEntity
  dispatch: Dispatch<WizAction>
  apiKey: string
}

/**
 * WizSceneViewDungeon
 */
export function WizSceneViewDungeon(props: Props) {
  const player = props.state.vault.members[0]

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <header className="flex w-full justify-start gap-2 font-mono text-primary text-sm">
        <div>深度: {props.state.depth}</div>
        <div>Lv: {player.level.value}</div>
        <div>
          生命: {player.hp}/{player.maxHp}
        </div>
        <div>STR: {player.strength}</div>
        <div>DEX: {player.dexterity}</div>
        <div>INT: {player.intelligence}</div>
      </header>

      <div className="w-full max-w-2xl space-y-6">
        <WizInputForm
          inputValue={props.state.inputValue}
          dispatch={props.dispatch}
          apiKey={props.apiKey}
          state={props.state.toObject()}
        />

        <div className="flex justify-start gap-2">
          <Button
            onClick={() => props.dispatch({ type: "STOP" })}
            variant="outline"
            size="sm"
            className="border-border bg-secondary font-mono text-primary hover:bg-accent hover:text-primary"
          >
            たちどまる
          </Button>
          <Button
            onClick={() => props.dispatch({ type: "UNKNOWN" })}
            variant="outline"
            size="sm"
            className="border-border bg-secondary font-mono text-primary hover:bg-accent hover:text-primary"
          >
            ???
          </Button>
        </div>
      </div>
    </main>
  )
}
