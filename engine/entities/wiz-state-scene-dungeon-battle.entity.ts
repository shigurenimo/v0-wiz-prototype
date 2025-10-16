import type { z } from "zod"
import { WizStateVaultEntity } from "@/engine/entities/wiz-state-vault.entity"
import type { WizBattleAction } from "@/engine/models/wiz-battle-action"
import type { zWizStateLog } from "@/engine/models/wiz-state-log"
import type { WizStateSceneDungeonBattle } from "@/engine/models/wiz-state-scene-dungeon-battle"

/**
 * WizStateSceneDungeonBattleEntity
 */
export class WizStateSceneDungeonBattleEntity {
  constructor(private readonly state: WizStateSceneDungeonBattle) {
    Object.freeze(this)
  }

  /**
   * Type
   */
  get type() {
    return this.state.type
  }

  /**
   * DungeonId
   */
  get dungeonId() {
    return this.state.dungeonId
  }

  /**
   * Depth
   */
  get depth() {
    return this.state.depth
  }

  /**
   * Enemies
   */
  get enemies() {
    return this.state.enemies
  }

  /**
   * Vault
   */
  get vault() {
    return new WizStateVaultEntity(this.state.vault)
  }

  /**
   * NarrativeSettings
   */
  get narrativeSettings() {
    return this.state.narrativeSettings
  }

  /**
   * Turn
   */
  get turn() {
    return this.state.turn
  }

  /**
   * ChatCount
   */
  get chatCount() {
    return this.state.chatCount
  }

  /**
   * ActionQueue
   */
  get actionQueue() {
    return this.state.actionQueue
  }

  /**
   * BattleMessages
   */
  get battleMessages() {
    return this.state.battleMessages
  }

  /**
   * Plain object
   */
  toObject(): WizStateSceneDungeonBattle {
    return this.state
  }

  /**
   * ログを追加
   */
  withAddedLogs(
    logs: z.infer<typeof zWizStateLog>[],
  ): WizStateSceneDungeonBattleEntity {
    const newVault = this.vault.withAddedLogs(logs)
    return new WizStateSceneDungeonBattleEntity({
      ...this.state,
      vault: newVault.toObject(),
    })
  }

  /**
   * 敵を更新
   */
  withUpdatedEnemy(
    enemyId: string,
    updates: Partial<{ hp: number; maxHp: number }>,
  ): WizStateSceneDungeonBattleEntity {
    const newEnemies = this.state.enemies.map((enemy) => {
      if (enemy.id === enemyId) {
        return {
          ...enemy,
          hp: updates.hp !== undefined ? Math.max(0, updates.hp) : enemy.hp,
          maxHp: updates.maxHp !== undefined ? updates.maxHp : enemy.maxHp,
        }
      }
      return enemy
    })
    return new WizStateSceneDungeonBattleEntity({
      ...this.state,
      enemies: newEnemies,
    })
  }

  /**
   * 味方キャラクターを更新
   */
  withUpdatedCharacter(
    characterId: string,
    updates: Partial<{ hp: number }>,
  ): WizStateSceneDungeonBattleEntity {
    const vaultData = this.state.vault

    // playerを更新
    if (vaultData.player.id === characterId) {
      const updatedPlayer = {
        ...vaultData.player,
        hp:
          updates.hp !== undefined
            ? Math.max(0, updates.hp)
            : vaultData.player.hp,
      }
      return new WizStateSceneDungeonBattleEntity({
        ...this.state,
        vault: {
          ...vaultData,
          player: updatedPlayer,
        },
      })
    }

    // membersを更新
    const newMembers = vaultData.members.map((member) => {
      if (member.id === characterId) {
        return {
          ...member,
          hp: updates.hp !== undefined ? Math.max(0, updates.hp) : member.hp,
        }
      }
      return member
    })

    return new WizStateSceneDungeonBattleEntity({
      ...this.state,
      vault: {
        ...vaultData,
        members: newMembers,
      },
    })
  }

  /**
   * チャット回数を増やす
   */
  withIncrementedChatCount(): WizStateSceneDungeonBattleEntity {
    return new WizStateSceneDungeonBattleEntity({
      ...this.state,
      chatCount: this.state.chatCount + 1,
    })
  }

  /**
   * ターンを増やしてチャット回数をリセット
   */
  withNextTurn(): WizStateSceneDungeonBattleEntity {
    return new WizStateSceneDungeonBattleEntity({
      ...this.state,
      turn: this.state.turn + 1,
      chatCount: 0,
    })
  }

  /**
   * シークレットキーを設定
   */
  withSecretKey(secretKey: string): WizStateSceneDungeonBattleEntity {
    return new WizStateSceneDungeonBattleEntity({
      ...this.state,
      vault: {
        ...this.state.vault,
        secretKey: secretKey,
      },
    })
  }

  /**
   * シークレットキーを削除
   */
  withoutSecretKey(): WizStateSceneDungeonBattleEntity {
    return new WizStateSceneDungeonBattleEntity({
      ...this.state,
      vault: {
        ...this.state.vault,
        secretKey: null,
      },
    })
  }

  /**
   * actionQueueをセット
   */
  withActionQueue(
    actions: WizBattleAction[],
  ): WizStateSceneDungeonBattleEntity {
    return new WizStateSceneDungeonBattleEntity({
      ...this.state,
      actionQueue: actions,
    })
  }

  /**
   * battleMessagesをセット
   */
  withBattleMessages(messages: string[]): WizStateSceneDungeonBattleEntity {
    return new WizStateSceneDungeonBattleEntity({
      ...this.state,
      battleMessages: messages,
    })
  }
}
