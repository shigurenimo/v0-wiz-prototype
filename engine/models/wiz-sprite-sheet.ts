import { z } from "zod"

/**
 * スプライトシート（Sprite Sheet）
 *
 * ドット絵アニメーション（Pixel Art Animation）のフレームデータ
 */
export const zWizSpriteSheet = z.object({
  id: z.string(),
  name: z.string(),
  /**
   * アニメーションフレーム（Animation Frame）
   * 各フレームは8x8=64個のピクセルデータ（0 or 1）
   */
  frames: z.array(z.array(z.number().int().min(0).max(1)).length(64)),
})

export type WizSpriteSheet = z.infer<typeof zWizSpriteSheet>
