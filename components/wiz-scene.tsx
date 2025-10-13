"use client"

import type { Dispatch } from "react"
import type { WizStateEntity } from "@/engine/entities/wiz-state-entity"
import type { WizAction } from "@/engine/types"
import { WizSceneViewDungeon } from "./wiz-scene-view-dungeon"
import { WizSceneViewDungeonBattle } from "./wiz-scene-view-dungeon-battle"
import { WizSceneViewSettings } from "./wiz-scene-view-settings"

type Props = {
  state: WizStateEntity
  dispatch: Dispatch<WizAction>
  onSecretKeyDelete: () => void
}

/**
 * WizScene
 */
export function WizScene(props: Props) {
  const secretKey = props.state.vault.secretKey

  if (secretKey === null) {
    return null
  }

  if (props.state.type === "dungeon") {
    return (
      <WizSceneViewDungeon
        state={props.state}
        dispatch={props.dispatch}
        secretKey={secretKey}
      />
    )
  }

  if (props.state.type === "dungeon-battle") {
    return (
      <WizSceneViewDungeonBattle
        state={props.state}
        dispatch={props.dispatch}
        secretKey={secretKey}
      />
    )
  }

  if (props.state.type === "settings") {
    return (
      <WizSceneViewSettings
        state={props.state}
        dispatch={props.dispatch}
        secretKey={secretKey}
        onSecretKeyDelete={props.onSecretKeyDelete}
      />
    )
  }

  return null
}
