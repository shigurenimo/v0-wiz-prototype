import { WizStateVaultEntity } from "@/engine/entities/wiz-state-vault.entity"
import type { WizStateMessage } from "@/engine/models/wiz-state-message"
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

  get inputValue() {
    return this.state.inputValue
  }

  get depth() {
    return this.state.depth
  }

  get chatMessages() {
    return this.state.chatMessages
  }

  get currentMessageIndex() {
    return this.state.currentMessageIndex
  }

  get currentMessage() {
    return this.state.chatMessages[this.state.currentMessageIndex]
  }

  get hasUnreadMessages() {
    return this.state.currentMessageIndex < this.state.chatMessages.length - 1
  }

  get narrativeSettings() {
    return this.state.narrativeSettings
  }

  get vault() {
    return new WizStateVaultEntity(this.state.vault)
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
   * 入力値を設定
   */
  withInputValue(inputValue: string): WizStateSceneDungeonEntity {
    return new WizStateSceneDungeonEntity({
      ...this.state,
      inputValue: inputValue,
    })
  }

  /**
   * チャットメッセージを追加
   */
  withMessages(messages: WizStateMessage[]): WizStateSceneDungeonEntity {
    return new WizStateSceneDungeonEntity({
      ...this.state,
      chatMessages: [...this.state.chatMessages, ...messages],
      currentMessageIndex: this.state.chatMessages.length,
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
        this.state.chatMessages.length - 1,
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
}
