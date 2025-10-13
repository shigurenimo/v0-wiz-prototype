import { WizStateSceneDungeonBattleEntity } from "@/engine/entities/wiz-state-scene-dungeon-battle.entity"
import type { WizStateSceneDungeonBattle } from "@/engine/models/wiz-state-scene-dungeon-battle"
import { WizCharacterRepository } from "@/engine/repositories/wiz-character-repository"

/**
 * Create initial Wiz state for battle debugging
 */
async function _createWizState(): Promise<WizStateSceneDungeonBattleEntity> {
  const characterRepository = new WizCharacterRepository()

  const characters = await characterRepository.findMany()

  const plainState: WizStateSceneDungeonBattle = {
    type: "dungeon-battle",
    dungeonId: "dungeon-1",
    depth: 1,
    enemies: [
      {
        id: "enemy-1",
        enemyId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        hp: 30,
        maxHp: 30,
      },
    ],
    turn: 0,
    chatCount: 0,
    narrativeSettings: {
      tone: "dark",
      perspective: "second-person",
      detailLevel: "detailed",
    },
    vault: {
      id: "vault-1",
      playerName: "あなた",
      player: (() => {
        const characterEntity = characters[0]
        return {
          id: characterEntity.id,
          name: characterEntity.name,
          author: characterEntity.author,
          spriteSheetId: characterEntity.spriteSheetId,
          baseStatusPoint: characterEntity.baseStatusPoint,
          baseStrengthPoint: characterEntity.baseStrengthPoint,
          baseDexterityPoint: characterEntity.baseDexterityPoint,
          baseIntelligencePoint: characterEntity.baseIntelligencePoint,
          profile: characterEntity.profile,
          personality: characterEntity.personality,
          backstory: characterEntity.backstory,
          relationships: characterEntity.relationships,
          exampleDialogues: characterEntity.exampleDialogues,
          hp: 100,
          experience: 0,
          baseExperience: 12,
          multiplier: 1.5,
          strengthPoint: 0,
          dexterityPoint: 0,
          intelligencePoint: 0,
        }
      })(),
      members: characters.slice(1).map((characterEntity) => {
        return {
          id: characterEntity.id,
          name: characterEntity.name,
          author: characterEntity.author,
          spriteSheetId: characterEntity.spriteSheetId,
          baseStatusPoint: characterEntity.baseStatusPoint,
          baseStrengthPoint: characterEntity.baseStrengthPoint,
          baseDexterityPoint: characterEntity.baseDexterityPoint,
          baseIntelligencePoint: characterEntity.baseIntelligencePoint,
          profile: characterEntity.profile,
          personality: characterEntity.personality,
          backstory: characterEntity.backstory,
          relationships: characterEntity.relationships,
          exampleDialogues: characterEntity.exampleDialogues,
          hp: 100,
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
        {
          id: crypto.randomUUID(),
          type: "EVENT_BATTLE",
          enemies: [
            {
              id: "enemy-1",
              enemyId: "goblin",
            },
          ],
          text: "薄暗い通路の先から、緑色の肌をした小柄な人型の怪物が現れた。ヘドロだ。黄色く濁った目がこちらを見据えている。",
        },
      ],
      secretKey: null,
    },
  }

  return new WizStateSceneDungeonBattleEntity(plainState)
}

export const wizState = _createWizState
