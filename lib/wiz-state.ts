import { WizStateSceneDungeonEntity } from "@/engine/entities/wiz-state-scene-dungeon.entity"
import type { WizStateSceneDungeon } from "@/engine/models/wiz-state-scene-dungeon"
import { WizCharacterRepository } from "@/engine/repositories/wiz-character-repository"
import { calculateMaxHp } from "@/lib/calculate-max-hp"

/**
 * Create initial Wiz state internal
 */
export async function wizState(): Promise<WizStateSceneDungeonEntity> {
  const characterRepository = new WizCharacterRepository()

  const characters = await characterRepository.findMany()

  const plainState: WizStateSceneDungeon = {
    type: "dungeon",
    dungeonId: "dungeon-1",
    depth: 0,
    time: 0,
    currentMessageIndex: 0,
    nextBattle: null,
    narrativeSettings: {
      tone: "dark",
      perspective: "second-person",
      detailLevel: "detailed",
    },
    vault: {
      id: "vault-1",
      playerName: "あなた",
      player: (() => {
        const character = characters[0]
        const maxHp = calculateMaxHp({
          baseStatusPoint: character.baseStatusPoint,
          experience: 0,
          baseExperience: 12,
          multiplier: 1.5,
        })
        return {
          id: character.id,
          name: character.name,
          author: character.author,
          baseStatusPoint: character.baseStatusPoint,
          baseStrengthPoint: character.baseStrengthPoint,
          baseDexterityPoint: character.baseDexterityPoint,
          baseIntelligencePoint: character.baseIntelligencePoint,
          profile: character.profile,
          personality: character.personality,
          backstory: character.backstory,
          relationships: character.relationships,
          exampleDialogues: character.exampleDialogues,
          hp: maxHp,
          experience: 0,
          baseExperience: 12,
          multiplier: 1.5,
          strengthPoint: 0,
          dexterityPoint: 0,
          intelligencePoint: 0,
        }
      })(),
      members: characters.slice(1).map((character) => {
        const maxHp = calculateMaxHp({
          baseStatusPoint: character.baseStatusPoint,
          experience: 0,
          baseExperience: 12,
          multiplier: 1.5,
        })
        return {
          id: character.id,
          name: character.name,
          author: character.author,
          baseStatusPoint: character.baseStatusPoint,
          baseStrengthPoint: character.baseStrengthPoint,
          baseDexterityPoint: character.baseDexterityPoint,
          baseIntelligencePoint: character.baseIntelligencePoint,
          profile: character.profile,
          personality: character.personality,
          backstory: character.backstory,
          relationships: character.relationships,
          exampleDialogues: character.exampleDialogues,
          hp: maxHp,
          experience: 0,
          baseExperience: 12,
          multiplier: 1.5,
          strengthPoint: 0,
          dexterityPoint: 0,
          intelligencePoint: 0,
        }
      }),
      inventory: [],
      logs: [
        {
          id: crypto.randomUUID(),
          type: "EVENT_SCENE",
          text: "暗く湿った石の階段を降りていく。松明の光が揺れ、影が壁を這う。",
        },
      ],
      secretKey: null,
    },
  }

  return new WizStateSceneDungeonEntity(plainState)
}
