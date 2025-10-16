import z from "zod"
import {
  zWizStateLogEventBattle,
  zWizStateLogEventBattleTurnStart,
  zWizStateLogEventChat,
  zWizStateLogEventDamage,
  zWizStateLogEventItem,
  zWizStateLogEventScene,
} from "@/engine/models/wiz-state-log"
import { zWizStateSceneDungeon } from "@/engine/models/wiz-state-scene-dungeon"
import { zWizStateSceneDungeonBattle } from "@/engine/models/wiz-state-scene-dungeon-battle"

export const zStreamResultEventChat = z.object({
  type: z.literal("EVENT_CHAT"),
  logs: zWizStateLogEventChat.array().min(0),
})

export const zStreamResultEventScene = z.object({
  type: z.literal("EVENT_SCENE"),
  logs: zWizStateLogEventScene.array().min(1).max(1),
})

export const zStreamResultEventDamage = z.object({
  type: z.literal("EVENT_DAMAGE"),
  logs: zWizStateLogEventDamage.array().min(1).max(1),
})

export const zStreamResultEventItem = z.object({
  type: z.literal("EVENT_ITEM"),
  logs: zWizStateLogEventItem.array().min(1).max(1),
})

export const zStreamResultEventBattle = z.object({
  type: z.literal("EVENT_BATTLE"),
  logs: zWizStateLogEventBattle.array().min(1).max(1),
})

export const zStreamResultEventBattleTurnStart = z.object({
  type: z.literal("EVENT_BATTLE_TURN_START"),
  logs: zWizStateLogEventBattleTurnStart.array().min(1).max(1),
})

export const zStreamResultBattleActionMessage = z.object({
  type: z.literal("BATTLE_ACTION_MESSAGE"),
  dialogue: z.string(),
  scene: z.string(),
})

export const zStreamResult = z.union([
  zStreamResultEventChat,
  zStreamResultEventScene,
  zStreamResultEventDamage,
  zStreamResultEventItem,
  zStreamResultEventBattle,
  zStreamResultEventBattleTurnStart,
  zStreamResultBattleActionMessage,
])

const dungeonState = z.union([
  zWizStateSceneDungeon,
  zWizStateSceneDungeonBattle,
])

export const requestSchema = z.discriminatedUnion("type", [
  /**
   * 会話を生成する
   */
  z.object({
    type: z.literal("chat"),
    secretKey: z.string(),
    playerInput: z.string(),
    state: dungeonState,
  }),
  /**
   * イベントを生成する
   */
  z.object({
    type: z.literal("event"),
    secretKey: z.string(),
    state: dungeonState,
  }),
  /**
   * バトルターン開始時の戦況を生成する
   */
  z.object({
    type: z.literal("battleTurnStart"),
    secretKey: z.string(),
    turn: z.number(),
    allies: z.array(
      z.object({
        name: z.string(),
        hp: z.number(),
        maxHp: z.number(),
      }),
    ),
    enemies: z.array(
      z.object({
        name: z.string(),
        hp: z.number(),
        maxHp: z.number(),
      }),
    ),
  }),
  /**
   * 単一のバトルアクションメッセージを生成する
   */
  z.object({
    type: z.literal("battleActionMessage"),
    secretKey: z.string(),
    actionType: z.enum(["PLAYER_ATTACK", "ENEMY_ATTACK"]),
    actorName: z.string(),
    targetName: z.string(),
  }),
])
