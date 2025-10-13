import type { WizStateCharacter } from "@/engine/models/wiz-state-character"

type Props = {
  character: WizStateCharacter
  experience: number
  baseExperience: number
  multiplier: number
  strengthPoint: number
  dexterityPoint: number
  intelligencePoint: number
}

/**
 * キャラクターのステータス（Status）
 */
export class WizCharacterStatusValue {
  constructor(private readonly props: Props) {
    Object.freeze(this)
  }

  /**
   * 最大HP（Max HP）
   * (baseStatusPoint * level) * 2
   */
  maxHp(level: number) {
    return this.props.character.baseStatusPoint * level * 2
  }

  /**
   * 力ポイント（Strength Point）
   * baseStrengthPoint + strengthPoint
   */
  get strength() {
    return this.props.character.baseStrengthPoint + this.props.strengthPoint
  }

  /**
   * 器用さポイント（Dexterity Point）
   * baseDexterityPoint + dexterityPoint
   */
  get dexterity() {
    return this.props.character.baseDexterityPoint + this.props.dexterityPoint
  }

  /**
   * 知性ポイント（Intelligence Point）
   * baseIntelligencePoint + intelligencePoint
   */
  get intelligence() {
    return (
      this.props.character.baseIntelligencePoint + this.props.intelligencePoint
    )
  }
}
