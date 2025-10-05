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

  get unreadChatMessages() {
    return this.state.unreadChatMessages
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
      unreadChatMessages: [...this.state.unreadChatMessages, ...messages],
    })
  }

  /**
   * チャットメッセージを置き換え
   */
  withReplacedMessages(
    messages: WizStateMessage[],
  ): WizStateSceneDungeonEntity {
    return new WizStateSceneDungeonEntity({
      ...this.state,
      unreadChatMessages: messages,
    })
  }

  /**
   * 次のチャットへ進む
   */
  withNextChat(): WizStateSceneDungeonEntity {
    return new WizStateSceneDungeonEntity({
      ...this.state,
      unreadChatMessages: this.state.unreadChatMessages.slice(1),
    })
  }
}
