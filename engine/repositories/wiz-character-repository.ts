import charactersData from "@/assets/characters.json"
import { type WizCharacter, zWizCharacter } from "@/engine/models/wiz-character"

/**
 * Character Repository
 */
export class WizCharacterRepository {
  private get records() {
    return zWizCharacter.array().parse(charactersData.items)
  }

  constructor() {
    Object.freeze(this)
  }

  /**
   * Find many characters
   */
  async findMany(): Promise<readonly WizCharacter[]> {
    return this.records
  }

  /**
   * Find one character by ID
   */
  async findOne(id: string): Promise<WizCharacter | undefined> {
    return this.records.find((character) => character.id === id)
  }
}
