import { WizStateVaultEntity } from "@/engine/entities/wiz-state-vault.entity"
import type {
  WizBookType,
  WizStateSceneBook,
} from "@/engine/models/wiz-state-scene-book"

/**
 * 図鑑シーンエンティティ（Book Scene Entity）
 */
export class WizStateSceneBookEntity {
  constructor(private readonly state: WizStateSceneBook) {
    Object.freeze(this)
  }

  get type() {
    return this.state.type
  }

  get vault() {
    return new WizStateVaultEntity(this.state.vault)
  }

  get bookType() {
    return this.state.bookType
  }

  get selectedIndex() {
    return this.state.selectedIndex
  }

  get previousScene() {
    return this.state.previousScene
  }

  get narrativeSettings() {
    return this.state.narrativeSettings
  }

  /**
   * 図鑑の種類を変更する（Change Book Type）
   */
  withBookType(bookType: WizBookType): WizStateSceneBookEntity {
    return new WizStateSceneBookEntity({
      ...this.state,
      bookType,
      selectedIndex: null,
    })
  }

  /**
   * 選択中のアイテムを変更する（Change Selected Index）
   */
  withSelectedIndex(selectedIndex: number | null): WizStateSceneBookEntity {
    return new WizStateSceneBookEntity({
      ...this.state,
      selectedIndex,
    })
  }

  /**
   * プレーンオブジェクトに変換する（Convert to Plain Object）
   */
  toObject(): WizStateSceneBook {
    return this.state
  }
}
