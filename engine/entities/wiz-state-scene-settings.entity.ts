import { WizStateVaultEntity } from "@/engine/entities/wiz-state-vault.entity"
import type { WizStateSceneSettings } from "@/engine/models/wiz-state-scene-settings"

/**
 * WizStateSceneSettingsEntity
 */
export class WizStateSceneSettingsEntity {
  constructor(private readonly state: WizStateSceneSettings) {
    Object.freeze(this)
  }

  get type() {
    return this.state.type
  }

  get vault() {
    return new WizStateVaultEntity(this.state.vault)
  }

  get narrativeSettings() {
    return this.state.narrativeSettings
  }

  withSecretKey(secretKey: string): WizStateSceneSettingsEntity {
    return new WizStateSceneSettingsEntity({
      ...this.state,
      vault: {
        ...this.state.vault,
        secretKey: secretKey,
      },
    })
  }

  withoutSecretKey(): WizStateSceneSettingsEntity {
    return new WizStateSceneSettingsEntity({
      ...this.state,
      vault: {
        ...this.state.vault,
        secretKey: null,
      },
    })
  }

  toObject(): WizStateSceneSettings {
    return this.state
  }
}
