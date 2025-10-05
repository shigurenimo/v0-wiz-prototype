type Props = {
  experience: number
  baseExperience: number
  multiplier: number
}

/**
 * 経験値からレベルを計算
 */
export class WizCharacterLevelValue {
  constructor(private readonly props: Props) {
    Object.freeze(this)
  }

  /**
   * 現在のレベルを取得
   */
  get value() {
    if (this.props.experience === 0) {
      return 1
    }

    const a = this.props.multiplier
    const I = this.props.baseExperience
    const M = this.props.experience

    const level = Math.log((1 - (M / I) * (1 - a)) / (1 - a)) / Math.log(a) + 1

    return Math.max(1, Math.floor(level))
  }

  /**
   * 次のレベルまでに必要な経験値
   */
  get experienceToNextLevel() {
    const nextLevel = this.value + 1
    const nextTotalExp = this.withTotalExperienceForLevel(nextLevel)
    return nextTotalExp - this.props.experience
  }

  /**
   * 指定レベルまでの累積経験値を計算
   */
  private withTotalExperienceForLevel(targetLevel: number): number {
    const I = this.props.baseExperience
    const a = this.props.multiplier
    const L = targetLevel

    return Math.floor((I * (1 - a ** (L - 1))) / (1 - a))
  }
}
