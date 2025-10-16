import { z } from "zod"

export const zWizStateLogEventUserChat = z.object({
  id: z.string(),
  type: z.literal("EVENT_USER_CHAT"),
  characterId: z.string(),
  text: z.string(),
})

export const zWizStateLogEventChat = z.object({
  id: z.string(),
  type: z.literal("EVENT_CHAT"),
  characterId: z.string(),
  text: z.string(),
})

export const zWizStateLogEventScene = z.object({
  id: z.string(),
  type: z.literal("EVENT_SCENE"),
  text: z.string(),
})

export const zWizStateLogEventDamage = z.object({
  id: z.string(),
  type: z.literal("EVENT_DAMAGE"),
  damage: z.number(),
  text: z.string(),
})

export const zWizStateLogEventItem = z.object({
  id: z.string(),
  type: z.literal("EVENT_ITEM"),
  itemIds: z.array(z.string()),
  text: z.string(),
})

export const zWizStateLogEventBattle = z.object({
  id: z.string(),
  type: z.literal("EVENT_BATTLE"),
  enemies: z
    .object({
      id: z.string(),
      enemyId: z.string(),
    })
    .array()
    .min(1),
  text: z.string(),
})

export const zWizStateLogEventPlayerAttack = z.object({
  id: z.string(),
  type: z.literal("EVENT_PLAYER_ATTACK"),
  text: z.string(),
  characterId: z.string(),
})

export const zWizStateLogEventEnemyAttack = z.object({
  id: z.string(),
  type: z.literal("EVENT_ENEMY_ATTACK"),
  text: z.string(),
  enemyId: z.string(),
  damage: z.number(),
  targetCharacterId: z.string(),
  hpBefore: z.number(),
  hpAfter: z.number(),
})

export const zWizStateLogEventPlayerDamage = z.object({
  id: z.string(),
  type: z.literal("EVENT_PLAYER_DAMAGE"),
  text: z.string(),
  damage: z.number(),
  targetCharacterId: z.string(),
  hpBefore: z.number(),
  hpAfter: z.number(),
})

export const zWizStateLogEventEnemyDamage = z.object({
  id: z.string(),
  type: z.literal("EVENT_ENEMY_DAMAGE"),
  text: z.string(),
  damage: z.number(),
  targetEnemyId: z.string(),
  hpBefore: z.number(),
  hpAfter: z.number(),
})

export const zWizStateLogEventBattleTurnStart = z.object({
  id: z.string(),
  type: z.literal("EVENT_BATTLE_TURN_START"),
  text: z.string(),
  turn: z.number(),
})

export const zWizStateLog = z.union([
  zWizStateLogEventUserChat,
  zWizStateLogEventChat,
  zWizStateLogEventScene,
  zWizStateLogEventDamage,
  zWizStateLogEventItem,
  zWizStateLogEventBattle,
  zWizStateLogEventPlayerAttack,
  zWizStateLogEventEnemyAttack,
  zWizStateLogEventPlayerDamage,
  zWizStateLogEventEnemyDamage,
  zWizStateLogEventBattleTurnStart,
])
