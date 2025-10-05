import { WizStateCharacterEntity } from "@/engine/entities/wiz-state-character.entity"
import { WizStateSceneDungeonEntity } from "@/engine/entities/wiz-state-scene-dungeon.entity"
import type { WizStateSceneDungeon } from "@/engine/models/wiz-state-scene-dungeon"
import { WizCharacterRepository } from "@/engine/repositories/wiz-character-repository"

/**
 * Create initial Wiz state
 */
export function createWizState(): WizStateSceneDungeonEntity {
  const characterRepository = new WizCharacterRepository()

  const plainState: WizStateSceneDungeon = {
    type: "dungeon",
    dungeonId: "dungeon-1",
    inputValue: "",
    depth: 0,
    unreadChatMessages: [
      {
        characterId: "system",
        text: "暗く湿った石の階段を降りていく。松明の光が揺れ、影が壁を這う。",
      },
    ],
    narrativeSettings: {
      tone: "dark",
      perspective: "second-person",
      detailLevel: "detailed",
    },
    vault: {
      id: "vault-1",
      playerName: "あなた",
      members: characterRepository.findMany().map((characterEntity) => {
        const tempMember = new WizStateCharacterEntity({
          id: characterEntity.id,
          name: characterEntity.name,
          author: characterEntity.author,
          baseStatusPoint: characterEntity.baseStatusPoint,
          baseStrengthPoint: characterEntity.baseStrengthPoint,
          baseDexterityPoint: characterEntity.baseDexterityPoint,
          baseIntelligencePoint: characterEntity.baseIntelligencePoint,
          profile: characterEntity.profile,
          personality: characterEntity.personality,
          backstory: characterEntity.backstory,
          relationships: characterEntity.relationships,
          exampleDialogues: characterEntity.exampleDialogues,
          hp: 0,
          experience: 0,
          baseExperience: 12,
          multiplier: 1.5,
          strengthPoint: 0,
          dexterityPoint: 0,
          intelligencePoint: 0,
        })
        return {
          id: characterEntity.id,
          name: characterEntity.name,
          author: characterEntity.author,
          baseStatusPoint: characterEntity.baseStatusPoint,
          baseStrengthPoint: characterEntity.baseStrengthPoint,
          baseDexterityPoint: characterEntity.baseDexterityPoint,
          baseIntelligencePoint: characterEntity.baseIntelligencePoint,
          profile: characterEntity.profile,
          personality: characterEntity.personality,
          backstory: characterEntity.backstory,
          relationships: characterEntity.relationships,
          exampleDialogues: characterEntity.exampleDialogues,
          hp: tempMember.maxHp,
          experience: 0,
          baseExperience: 12,
          multiplier: 1.5,
          strengthPoint: 0,
          dexterityPoint: 0,
          intelligencePoint: 0,
        }
      }),
      inventory: [],
    },
  }

  return new WizStateSceneDungeonEntity(plainState)
}
