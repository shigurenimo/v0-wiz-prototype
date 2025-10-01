"use client"

import type { Dispatch } from "react"
import { TypewriterText } from "@/components/typewriter-text"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { WizStateSceneDungeon } from "@/engine/models"
import type { WizAction } from "@/engine/types"

type Props = {
  state: WizStateSceneDungeon
  dispatch: Dispatch<WizAction>
}

/**
 * WizSceneViewDungeon
 */
export function WizSceneViewDungeon(props: Props) {
  const onSubmit = () => {
    props.dispatch({ type: "SUBMIT_INPUT" })
  }

  const player = props.state.vault.party[0]

  return (
    <main className="flex min-h-screen flex-col items-center justify-end p-8">
      <div className="w-full max-w-2xl space-y-6">
        <div>
          <TypewriterText
            key={props.state.depth}
            text={props.state.currentMessage}
            speed={50}
          />
        </div>

        <div className="space-y-2">
          <div className="flex gap-2 font-mono text-primary text-sm">
            <div>深度: {props.state.depth}</div>
            <div>
              生命: {player.hp}/{player.maxHp}
            </div>
            <div>MP: {player.mp}</div>
          </div>

          <div className="flex gap-2">
            <Input
              value={props.state.inputValue}
              onChange={(e) =>
                props.dispatch({ type: "SET_INPUT", payload: e.target.value })
              }
              onKeyDown={(e) => e.key === "Enter" && onSubmit()}
              placeholder="何か言ってみる.."
              className="flex-1 border-border bg-secondary font-mono text-base text-primary placeholder:text-muted-foreground"
            />
            <Button
              onClick={onSubmit}
              variant="outline"
              className="border-border bg-secondary font-mono text-base text-primary hover:bg-accent hover:text-primary"
            >
              発言
            </Button>
          </div>

          <div className="flex justify-start gap-2">
            <Button
              onClick={() => props.dispatch({ type: "NEXT_MESSAGE" })}
              variant="outline"
              size="sm"
              className="border-border bg-secondary font-mono text-primary hover:bg-accent hover:text-primary"
            >
              すすむ
            </Button>
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
      </div>
    </main>
  )
}
