import charactersData from "@/assets/characters.json"
import { WizCharacterEntity } from "@/engine/entities/wiz-character.entity"
import { zWizCharacter } from "@/engine/models/wiz-character"

/**
 * Character Repository
 */
export class WizCharacterRepository {
  private readonly items: readonly WizCharacterEntity[]

  constructor() {
    this.items = zWizCharacter
      .array()
      .parse(charactersData.items)
      .map((data) => new WizCharacterEntity(data))
    Object.freeze(this)
  }

  /**
   * Find many characters
   */
  findMany(): readonly WizCharacterEntity[] {
    return this.items
  }

  /**
   * Find one character by ID
   */
  findOne(id: string): WizCharacterEntity | undefined {
    return this.items.find((character) => character.id === id)
  }
}
