import type { WizCharacterEntity } from "@/engine/entities/wiz-character.entity"

type Props = {
  character: WizCharacterEntity
  experience: number
  baseExperience: number
  multiplier: number
  strengthPoint: number
  dexterityPoint: number
  intelligencePoint: number
}

/**
 * キャラクターのステータス
 */
export class WizCharacterStatusValue {
  constructor(private readonly props: Props) {
    Object.freeze(this)
  }

  /**
   * 最大HP
   * (baseStatusPoint * level) * 2
   */
  maxHp(level: number) {
    return this.props.character.baseStatusPoint * level * 2
  }

  /**
   * 力ポイント
   * baseStrengthPoint + strengthPoint
   */
  get strength() {
    return this.props.character.baseStrengthPoint + this.props.strengthPoint
  }

  /**
   * 器用さポイント
   * baseDexterityPoint + dexterityPoint
   */
  get dexterity() {
    return this.props.character.baseDexterityPoint + this.props.dexterityPoint
  }

  /**
   * 知性ポイント
   * baseIntelligencePoint + intelligencePoint
   */
  get intelligence() {
    return (
      this.props.character.baseIntelligencePoint + this.props.intelligencePoint
    )
  }
}
