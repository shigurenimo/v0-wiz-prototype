import { WizCharacterLevelValue } from "@/engine/values/wiz-character-level.value"

type Props = {
  baseStatusPoint: number
  experience: number
  baseExperience: number
  multiplier: number
}

/**
 * calculateMaxHp
 *
 * キャラクター（Character）の最大HP（Max HP）を計算する
 * 計算式: (baseStatusPoint * level) * 2
 */
export function calculateMaxHp(props: Props): number {
  const level = new WizCharacterLevelValue({
    experience: props.experience,
    baseExperience: props.baseExperience,
    multiplier: props.multiplier,
  })
  return props.baseStatusPoint * level.value * 2
}
