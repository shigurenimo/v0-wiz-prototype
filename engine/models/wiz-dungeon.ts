import { z } from "zod"

/**
 * ダンジョン設定
 */
export const zWizDungeon = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  /**
   * ダンジョンの環境設定
   * AI生成時のシステムプロンプトで使用
   */
  environment: z.object({
    /**
     * 照明の状態
     */
    lighting: z.string(),
    /**
     * 雰囲気の描写
     */
    atmosphere: z.string(),
    /**
     * 温度感覚
     */
    temperature: z.string(),
  }),
  theme: z.object({
    /**
     * ダンジョンの主要な環境要素（例: ["石造り", "水", "古代"]）
     * AI生成時のシーン描写で使用
     */
    primaryElements: z.array(z.string()),
    /**
     * 出現する敵の種類（例: ["スケルトン", "ゴースト", "ゾンビ"]）
     * 将来的な戦闘イベント生成で使用予定
     */
    enemies: z.array(z.string()),
    /**
     * 発見可能な宝物やオブジェクト（例: ["古びた宝箱", "石棺", "祭壇"]）
     * 将来的なアイテム発見イベント生成で使用予定
     */
    treasures: z.array(z.string()),
  }),
})

export type WizDungeon = z.infer<typeof zWizDungeon>
