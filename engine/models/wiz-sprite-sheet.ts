import { z } from "zod"

/**
 * スプライトシート（Sprite Sheet）
 *
 * ドット絵アニメーション（Pixel Art Animation）のフレームデータ
 */
export const zWizSpriteSheet = z.object({
  id: z.string(),
  /**
   * スラッグ（Slug）
   * URL friendly identifier
   */
  slug: z.string(),
  name: z.string(),
  /**
   * アニメーションフレーム（Animation Frame）
   * 各フレームは16x16の2次元配列（0 or 1）
   */
  frames: z.array(
    z.array(z.array(z.number().int()).length(16)).length(16),
  ),
})

export type WizSpriteSheet = z.infer<typeof zWizSpriteSheet>
