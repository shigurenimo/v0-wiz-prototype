import type { WizCharacter } from "@/engine/models/wiz-character"

/**
 * Wiz Character Entity
 */
export class WizCharacterEntity {
  constructor(private readonly props: WizCharacter) {
    Object.freeze(this)
  }

  get id() {
    return this.props.id
  }

  get name() {
    return this.props.name
  }

  get author() {
    return this.props.author
  }

  get baseStatusPoint() {
    return this.props.baseStatusPoint
  }

  get baseStrengthPoint() {
    return this.props.baseStrengthPoint
  }

  get baseDexterityPoint() {
    return this.props.baseDexterityPoint
  }

  get baseIntelligencePoint() {
    return this.props.baseIntelligencePoint
  }

  get profile() {
    return this.props.profile
  }

  get personality() {
    return this.props.personality
  }

  get backstory() {
    return this.props.backstory
  }

  get relationships() {
    return this.props.relationships
  }

  get exampleDialogues() {
    return this.props.exampleDialogues
  }
}
