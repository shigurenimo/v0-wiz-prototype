"use client"

import { WizStateCharacterEntity } from "@/engine/entities/wiz-state-character.entity"
import type { WizStateCharacter } from "@/engine/models/wiz-state-character"

type Props = {
  depth: number
  player: WizStateCharacter
}

/**
 * WizDungeonHeader
 */
export function WizDungeonHeader(props: Props) {
  const player = new WizStateCharacterEntity(props.player)

  return (
    <header className="flex w-full justify-start gap-2 font-mono text-primary text-sm">
      <div>深度: {props.depth}</div>
      <div>Lv: {player.level.value}</div>
      <div>
        生命: {player.hp}/{player.maxHp}
      </div>
      <div>STR: {player.strength}</div>
      <div>DEX: {player.dexterity}</div>
      <div>INT: {player.intelligence}</div>
    </header>
  )
}
