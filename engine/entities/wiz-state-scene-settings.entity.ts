import type { WizStateSceneSettings } from "@/engine/models/wiz-state-scene-settings"

/**
 * WizStateSceneSettingsEntity
 */
export class WizStateSceneSettingsEntity {
  constructor(private readonly state: WizStateSceneSettings) {}

  get type() {
    return this.state.type
  }

  toObject(): WizStateSceneSettings {
    return this.state
  }
}
