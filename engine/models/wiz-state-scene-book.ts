import { z } from "zod"
import { zWizStateCore } from "@/engine/models/wiz-state-core"

/**
 * 図鑑の種類（Book Type）
 */
export const zWizBookType = z.enum(["monster", "weapon", "item"])

export type WizBookType = z.infer<typeof zWizBookType>

/**
 * 図鑑シーン状態（Book Scene State）
 *
 * 図鑑を閲覧するシーンの状態を管理
 */
export const zWizStateSceneBook = zWizStateCore.extend({
  type: z.literal("book"),
  /**
   * 開いている図鑑の種類（Book Type）
   */
  bookType: zWizBookType,
  /**
   * 選択中のアイテムのインデックス（Selected Index）
   */
  selectedIndex: z.number().int().min(0).nullable(),
  /**
   * 前のシーン情報（Previous Scene）
   */
  previousScene: z
    .object({
      type: z.string(),
      dungeonId: z.string().optional(),
      depth: z.number().int().min(0).optional(),
    })
    .nullable(),
})

export type WizStateSceneBook = z.infer<typeof zWizStateSceneBook>
