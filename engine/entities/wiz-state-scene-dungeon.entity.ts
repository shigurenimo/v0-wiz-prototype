import type { z } from "zod"
import { WizStateVaultEntity } from "@/engine/entities/wiz-state-vault.entity"
import type { zWizStateLog } from "@/engine/models/wiz-state-log"
import type { WizStateSceneDungeon } from "@/engine/models/wiz-state-scene-dungeon"

/**
 * Wiz State Scene Dungeon Entity
 */
export class WizStateSceneDungeonEntity {
  constructor(private readonly state: WizStateSceneDungeon) {
    Object.freeze(this)
  }

  get type() {
    return this.state.type
  }

  get dungeonId() {
    return this.state.dungeonId
  }

  get depth() {
    return this.state.depth
  }

  get time() {
    return this.state.time
  }

  get currentMessageIndex() {
    return this.state.currentMessageIndex
  }

  get currentMessage() {
    return this.vault.logs[this.state.currentMessageIndex]
  }

  get hasUnreadMessages() {
    return this.state.currentMessageIndex < this.vault.logs.length - 1
  }

  get narrativeSettings() {
    return this.state.narrativeSettings
  }

  get vault() {
    return new WizStateVaultEntity(this.state.vault)
  }

  get nextBattle() {
    return this.state.nextBattle
  }

  /**
   * Convert to plain object
   */
  toObject() {
    return this.state
  }

  /**
   * 深さを1増やす
   */
  withIncrementedDepth(): WizStateSceneDungeonEntity {
    return new WizStateSceneDungeonEntity({
      ...this.state,
      depth: this.state.depth + 1,
    })
  }

  /**
   * 時間を1増やす
   */
  withIncrementedTime(): WizStateSceneDungeonEntity {
    return new WizStateSceneDungeonEntity({
      ...this.state,
      time: this.state.time + 1,
    })
  }

  /**
   * ログを追加
   */
  withAddedLogs(
    logs: z.infer<typeof zWizStateLog>[],
  ): WizStateSceneDungeonEntity {
    const newVault = this.vault.withAddedLogs(logs)
    return new WizStateSceneDungeonEntity({
      ...this.state,
      vault: newVault.toObject(),
      currentMessageIndex: this.vault.logs.length,
    })
  }

  /**
   * 次のメッセージへ進む
   */
  withNextMessage(): WizStateSceneDungeonEntity {
    return new WizStateSceneDungeonEntity({
      ...this.state,
      currentMessageIndex: Math.min(
        this.state.currentMessageIndex + 1,
        this.vault.logs.length - 1,
      ),
    })
  }

  /**
   * アイテムをインベントリに追加
   */
  withAddedItem(itemId: string): WizStateSceneDungeonEntity {
    const existingItem = this.state.vault.inventory.find(
      (item) => item.itemId === itemId,
    )
    return new WizStateSceneDungeonEntity({
      ...this.state,
      vault: {
        ...this.state.vault,
        inventory: existingItem
          ? this.state.vault.inventory.map((item) =>
              item.itemId === itemId
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            )
          : [...this.state.vault.inventory, { itemId: itemId, quantity: 1 }],
      },
    })
  }

  /**
   * 最初のメンバーにダメージを与える
   */
  withDamageToFirstMember(damage: number): WizStateSceneDungeonEntity {
    const newMembers = this.state.vault.members.map((member, index) => {
      return index === 0
        ? {
            ...member,
            hp: Math.max(0, member.hp - damage),
          }
        : member
    })
    return new WizStateSceneDungeonEntity({
      ...this.state,
      vault: {
        ...this.state.vault,
        members: newMembers,
      },
    })
  }

  /**
   * 次の戦闘を設定
   */
  withNextBattle(nextBattle: {
    enemies: Array<{ id: string; enemyId: string }>
    chatCount: number
  }): WizStateSceneDungeonEntity {
    return new WizStateSceneDungeonEntity({
      ...this.state,
      nextBattle: nextBattle,
    })
  }

  /**
   * 戦闘中のチャット回数を増やす
   */
  withIncrementedBattleChat(): WizStateSceneDungeonEntity {
    if (!this.state.nextBattle) {
      return this
    }
    return new WizStateSceneDungeonEntity({
      ...this.state,
      nextBattle: {
        ...this.state.nextBattle,
        chatCount: this.state.nextBattle.chatCount + 1,
      },
    })
  }

  /**
   * 次の戦闘を解除
   */
  withoutNextBattle(): WizStateSceneDungeonEntity {
    return new WizStateSceneDungeonEntity({
      ...this.state,
      nextBattle: null,
    })
  }

  /**
   * シークレットキーを設定
   */
  withSecretKey(secretKey: string): WizStateSceneDungeonEntity {
    return new WizStateSceneDungeonEntity({
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
  withoutSecretKey(): WizStateSceneDungeonEntity {
    return new WizStateSceneDungeonEntity({
      ...this.state,
      vault: {
        ...this.state.vault,
        secretKey: null,
      },
    })
  }
}
