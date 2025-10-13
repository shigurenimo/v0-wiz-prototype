import { WizStateCharacterEntity } from "@/engine/entities/wiz-state-character.entity"
import { WizStateItemEntity } from "@/engine/entities/wiz-state-item.entity"
import type { WizVault } from "@/engine/models/wiz-state-vault"

/**
 * Wiz State Vault Entity
 */
export class WizStateVaultEntity {
  constructor(private readonly vault: WizVault) {
    Object.freeze(this)
  }

  get id() {
    return this.vault.id
  }

  get playerName() {
    return this.vault.playerName
  }

  get player() {
    return new WizStateCharacterEntity(this.vault.player)
  }

  get members() {
    const members = this.vault.members.map((member) => {
      return new WizStateCharacterEntity(member)
    })

    return [this.player, ...members]
  }

  get inventory() {
    return this.vault.inventory.map((item) => {
      return new WizStateItemEntity(item)
    })
  }

  get logs() {
    return this.vault.logs
  }

  get secretKey() {
    return this.vault.secretKey
  }

  withAddedLogs(
    newLogs: (typeof this.vault.logs)[number][],
  ): WizStateVaultEntity {
    return new WizStateVaultEntity({
      ...this.vault,
      logs: [...this.vault.logs, ...newLogs],
    })
  }

  withSecretKey(secretKey: string): WizStateVaultEntity {
    return new WizStateVaultEntity({
      ...this.vault,
      secretKey: secretKey,
    })
  }

  withoutSecretKey(): WizStateVaultEntity {
    return new WizStateVaultEntity({
      ...this.vault,
      secretKey: null,
    })
  }

  toObject(): WizVault {
    return this.vault
  }
}
