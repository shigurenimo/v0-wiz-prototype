import type { WizStateCharacter } from "@/engine/models/wiz-state-character"
import { WizCharacterLevelValue } from "@/engine/values/wiz-character-level.value"

/**
 * Wiz State Character Entity
 */
export class WizStateCharacterEntity {
  constructor(private readonly props: WizStateCharacter) {
    Object.freeze(this)
  }

  get id() {
    return this.props.id
  }

  get characterId() {
    return this.props.id
  }

  get name() {
    return this.props.name
  }

  get author() {
    return this.props.author
  }

  get spriteSheetId() {
    return this.props.spriteSheetId
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

  get hp() {
    return this.props.hp
  }

  get experience() {
    return this.props.experience
  }

  get strengthPoint() {
    return this.props.strengthPoint
  }

  get dexterityPoint() {
    return this.props.dexterityPoint
  }

  get intelligencePoint() {
    return this.props.intelligencePoint
  }

  get baseExperience() {
    return this.props.baseExperience
  }

  get multiplier() {
    return this.props.multiplier
  }

  get level() {
    return new WizCharacterLevelValue({
      experience: this.props.experience,
      baseExperience: this.props.baseExperience,
      multiplier: this.props.multiplier,
    })
  }

  /**
   * 最大HP
   * (baseStatusPoint * level) * 2
   */
  get maxHp() {
    return this.props.baseStatusPoint * this.level.value * 2
  }

  /**
   * 力ポイント
   * baseStrengthPoint + strengthPoint
   */
  get strength() {
    return this.props.baseStrengthPoint + this.props.strengthPoint
  }

  /**
   * 器用さポイント
   * baseDexterityPoint + dexterityPoint
   */
  get dexterity() {
    return this.props.baseDexterityPoint + this.props.dexterityPoint
  }

  /**
   * 知性ポイント
   * baseIntelligencePoint + intelligencePoint
   */
  get intelligence() {
    return this.props.baseIntelligencePoint + this.props.intelligencePoint
  }
}
