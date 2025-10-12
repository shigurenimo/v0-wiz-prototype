import charactersData from "@/assets/characters.json"
import { WizCharacterEntity } from "@/engine/entities/wiz-character.entity"
import { zWizCharacter } from "@/engine/models/wiz-character"

/**
 * Character Repository
 */
export class WizCharacterRepository {
  private get records() {
    return zWizCharacter
      .array()
      .parse(charactersData.items)
      .map((data) => new WizCharacterEntity(data))
  }

  constructor() {
    Object.freeze(this)
  }

  /**
   * Find many characters
   */
  async findMany(): Promise<readonly WizCharacterEntity[]> {
    return this.records
  }

  /**
   * Find one character by ID
   */
  async findOne(id: string): Promise<WizCharacterEntity | undefined> {
    return this.records.find((character) => character.id === id)
  }
}
