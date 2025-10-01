import { z } from "zod"

/**
 * Party Member Schema
 * パーティメンバー（Party Member）を表すスキーマ
 */
export const zWizPartyMember = z.object({
  id: z.string(),
  name: z.string(),
  hp: z.number().int().min(0),
  maxHp: z.number().int().min(0),
  mp: z.number().int().min(0),
  maxMp: z.number().int().min(0),
})

export type WizPartyMember = z.infer<typeof zWizPartyMember>

/**
 * Inventory Item Schema
 * インベントリアイテム（Inventory Item）を表すスキーマ
 */
export const zWizInventoryItem = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number().int().min(0),
})

export type WizInventoryItem = z.infer<typeof zWizInventoryItem>

/**
 * Vault Player Schema
 * プレイヤー永続化データ（Vault Player）を表すスキーマ
 */
export const zWizVaultPlayer = z.object({
  id: z.string(),
  name: z.string(),
})

export type WizVaultPlayer = z.infer<typeof zWizVaultPlayer>

/**
 * Vault Schema
 * 永続化データ（Vault）を表すスキーマ
 */
export const zWizVault = z.object({
  player: zWizVaultPlayer,
  party: z.array(zWizPartyMember),
  inventory: z.array(zWizInventoryItem),
})

export type WizVault = z.infer<typeof zWizVault>

/**
 * State Core Schema
 * ゲームコア状態（State Core）を表すスキーマ
 */
export const zWizStateCore = z.object({
  vault: zWizVault,
})

export type WizStateCore = z.infer<typeof zWizStateCore>

/**
 * Chat Message Schema
 * チャットメッセージ（Chat Message）を表すスキーマ
 */
export const zWizChatMessage = z.object({
  characterId: z.string(),
  text: z.string(),
})

export type WizChatMessage = z.infer<typeof zWizChatMessage>

/**
 * Scene Dungeon Schema
 * ダンジョン画面（Scene Dungeon）を表すスキーマ
 */
export const zWizStateSceneDungeon = zWizStateCore.extend({
  type: z.literal("dungeon"),
  inputValue: z.string(),
  depth: z.number().int().min(0),
  unreadChatMessages: z.array(zWizChatMessage),
})

export type WizStateSceneDungeon = z.infer<typeof zWizStateSceneDungeon>

/**
 * Scene Storage Schema
 * データ管理画面（Scene Storage）を表すスキーマ
 */
export const zWizStateSceneStorage = zWizStateCore.extend({
  type: z.literal("storage"),
})

export type WizStateSceneStorage = z.infer<typeof zWizStateSceneStorage>

/**
 * State Schema
 * ゲーム状態（State）を表すスキーマ
 */
export const zWizState = z.discriminatedUnion("type", [
  zWizStateSceneDungeon,
  zWizStateSceneStorage,
])

export type WizState = z.infer<typeof zWizState>
