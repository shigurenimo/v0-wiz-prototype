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

  get members() {
    return this.vault.members.map((member) => {
      return new WizStateCharacterEntity(member)
    })
  }

  get inventory() {
    return this.vault.inventory.map((item) => {
      return new WizStateItemEntity(item)
    })
  }
}
