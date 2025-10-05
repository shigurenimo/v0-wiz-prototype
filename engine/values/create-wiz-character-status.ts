import type { WizCharacterEntity } from "@/engine/entities/wiz-character.entity"
import { WizCharacterStatusValue } from "@/engine/values/wiz-character-status.value"

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
 * Create Wiz Character Status
 */
export function createWizCharacterStatus(props: Props) {
  return new WizCharacterStatusValue(props)
}
