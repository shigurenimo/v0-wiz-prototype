import { z } from "zod"
import { zWizStateVault } from "@/engine/models/wiz-state-vault"

/**
 * ゲームコア状態
 */
export const zWizStateCore = z.object({
  vault: zWizStateVault,
  /**
   * ナレーションスタイル設定
   * AI生成時のシステムプロンプトで使用
   */
  narrativeSettings: z.object({
    /**
     * 物語のトーン（雰囲気）
     */
    tone: z.enum(["dark", "mysterious", "epic", "comedic"]),
    /**
     * 語りの視点
     */
    perspective: z.enum(["first-person", "second-person", "third-person"]),
    /**
     * 描写の詳細レベル
     */
    detailLevel: z.enum(["minimal", "moderate", "detailed"]),
  }),
})

export type WizStateCore = z.infer<typeof zWizStateCore>
