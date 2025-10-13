"use client"

import type { Dispatch } from "react"
import type { WizStateEntity } from "@/engine/entities/wiz-state-entity"
import { WizStateSceneBookEntity } from "@/engine/entities/wiz-state-scene-book.entity"
import { WizStateSceneDungeonEntity } from "@/engine/entities/wiz-state-scene-dungeon.entity"
import { WizStateSceneDungeonBattleEntity } from "@/engine/entities/wiz-state-scene-dungeon-battle.entity"
import { WizStateSceneSettingsEntity } from "@/engine/entities/wiz-state-scene-settings.entity"
import type { WizMaster } from "@/engine/models/wiz-master"
import type { WizAction } from "@/engine/types"
import { WizSceneViewBook } from "./wiz-scene-view-book"
import { WizSceneViewDungeon } from "./wiz-scene-view-dungeon"
import { WizSceneViewDungeonBattle } from "./wiz-scene-view-dungeon-battle"
import { WizSceneViewSettings } from "./wiz-scene-view-settings"

type Props = {
  master: WizMaster
  state: WizStateEntity
  dispatch: Dispatch<WizAction>
  onSecretKeyDelete: () => void
}

/**
 * WizScene
 */
export function WizSceneView(props: Props) {
  const secretKey = props.state.vault.secretKey

  if (secretKey === null) {
    return null
  }

  if (props.state instanceof WizStateSceneDungeonEntity) {
    return (
      <WizSceneViewDungeon
        master={props.master}
        state={props.state}
        dispatch={props.dispatch}
        secretKey={secretKey}
      />
    )
  }

  if (props.state instanceof WizStateSceneDungeonBattleEntity) {
    return (
      <WizSceneViewDungeonBattle
        master={props.master}
        state={props.state}
        dispatch={props.dispatch}
        secretKey={secretKey}
      />
    )
  }

  if (props.state instanceof WizStateSceneSettingsEntity) {
    return (
      <WizSceneViewSettings
        master={props.master}
        state={props.state}
        dispatch={props.dispatch}
        secretKey={secretKey}
        onSecretKeyDelete={props.onSecretKeyDelete}
      />
    )
  }

  if (props.state instanceof WizStateSceneBookEntity) {
    return (
      <WizSceneViewBook
        master={props.master}
        state={props.state}
        dispatch={props.dispatch}
      />
    )
  }

  return null
}
