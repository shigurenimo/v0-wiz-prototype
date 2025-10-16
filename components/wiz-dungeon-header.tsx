"use client"

import type { Dispatch } from "react"
import { Button } from "@/components/ui/button"
import { WizStateCharacterEntity } from "@/engine/entities/wiz-state-character.entity"
import type { WizStateCharacter } from "@/engine/models/wiz-state-character"
import type { WizAction } from "@/engine/types"

type Props = {
  depth: number
  player: WizStateCharacter
  dispatch: Dispatch<WizAction>
}

/**
 * WizDungeonHeader
 */
export function WizDungeonHeader(props: Props) {
  const player = new WizStateCharacterEntity(props.player)

  return (
    <header className="fixed top-0 left-0 flex w-full justify-start gap-2 p-8">
      <div className="flex flex-1 font-mono text-primary text-sm">
        <div>深度: {props.depth}</div>
        <div>Lv: {player.level.value}</div>
        <div>
          生命: {player.hp}/{player.maxHp}
        </div>
        <div>STR: {player.strength}</div>
        <div>DEX: {player.dexterity}</div>
        <div>INT: {player.intelligence}</div>
      </div>
      <div>
        <Button
          onClick={() => {
            console.log("てもとボタンクリック")
            props.dispatch({ type: "NAVIGATE_TO_BOOK_FROM_DUNGEON" })
          }}
        >
          {"てもと"}
        </Button>
      </div>
    </header>
  )
}
