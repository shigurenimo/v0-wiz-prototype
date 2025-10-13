import type { WizStateCharacter } from "@/engine/models/wiz-state-character"
import { WizCharacterStatusValue } from "@/engine/values/wiz-character-status.value"

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
 * createWizCharacterStatus
 *
 * キャラクターステータス（Character Status）のValueオブジェクトを生成
 */
export function createWizCharacterStatus(props: Props) {
  return new WizCharacterStatusValue(props)
}
