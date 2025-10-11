import type { WizStateSceneDungeonEntity } from "@/engine/entities/wiz-state-scene-dungeon.entity"
import type { WizStateSceneSettingsEntity } from "@/engine/entities/wiz-state-scene-settings.entity"

/**
 * Wiz State Entity Union
 */
export type WizStateEntity =
  | WizStateSceneDungeonEntity
  | WizStateSceneSettingsEntity
