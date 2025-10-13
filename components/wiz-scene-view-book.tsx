"use client"

import type { Dispatch } from "react"
import { Button } from "@/components/ui/button"
import { WizPixelArtAnimation } from "@/components/wiz-pixel-art-animation"
import type { WizStateSceneBookEntity } from "@/engine/entities/wiz-state-scene-book.entity"
import type { WizMaster } from "@/engine/models/wiz-master"
import type { WizBookType } from "@/engine/models/wiz-state-scene-book"
import type { WizAction } from "@/engine/types"
import { useAnimationFrame } from "@/lib/use-animation-frame"

type Props = {
  master: WizMaster
  state: WizStateSceneBookEntity
  dispatch: Dispatch<WizAction>
}

/**
 * WizSceneViewBook
 *
 * 図鑑シーン（Book Scene）の表示コンポーネント
 */
export function WizSceneViewBook(props: Props) {
  const bookTypes: Array<{ value: WizBookType; label: string }> = [
    { value: "monster", label: "モンスター図鑑" },
    { value: "weapon", label: "武器図鑑" },
    { value: "item", label: "アイテム図鑑" },
  ]

  const getItems = () => {
    if (props.state.bookType === "monster") {
      return props.master.enemies
    }
    return props.master.items
  }

  const items = getItems()
  const selectedItem =
    props.state.selectedIndex !== null ? items[props.state.selectedIndex] : null

  const selectedEnemy =
    props.state.bookType === "monster" && selectedItem && "baseHp" in selectedItem
      ? selectedItem
      : null

  const enemySpriteSheet = selectedEnemy
    ? props.master.spriteSheets.find(
        (s) => s.id === selectedEnemy.spriteSheetId,
      )
    : null

  const currentFrame = useAnimationFrame({
    frameCount: enemySpriteSheet?.frames.length ?? 1,
    frameDelay: 300,
  })

  return (
    <main className="flex h-screen flex-col overflow-hidden p-2">
      <div className="mx-auto w-full max-w-6xl space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-2xl">図鑑</h1>
          <Button
            onClick={() => props.dispatch({ type: "NAVIGATE_BACK_FROM_BOOK" })}
            variant="outline"
          >
            戻る
          </Button>
        </div>

        <div className="flex gap-2">
          {bookTypes.map((bookType) => (
            <Button
              key={bookType.value}
              onClick={() =>
                props.dispatch({
                  type: "BOOK_CHANGE_TYPE",
                  payload: bookType.value,
                })
              }
              variant={
                props.state.bookType === bookType.value ? "default" : "outline"
              }
            >
              {bookType.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2 rounded border p-2">
            <h2 className="font-semibold text-lg">
              {bookTypes.find((bt) => bt.value === props.state.bookType)?.label}
            </h2>
            <div className="h-[600px] overflow-y-auto">
              <div className="space-y-2">
                {items.map((item, index) => (
                  <Button
                    key={item.id}
                    onClick={() =>
                      props.dispatch({
                        type: "BOOK_SELECT_INDEX",
                        payload: index,
                      })
                    }
                    variant={
                      props.state.selectedIndex === index
                        ? "default"
                        : "outline"
                    }
                    className="w-full justify-start"
                  >
                    {item.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-2">
            {selectedItem ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-xl">{selectedItem.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    {selectedItem.description}
                  </p>
                </div>

                {selectedEnemy && enemySpriteSheet && (
                  <div className="flex justify-center py-4">
                    <WizPixelArtAnimation
                      frames={enemySpriteSheet.frames}
                      currentFrameIndex={currentFrame}
                      pixelSize={24}
                    />
                  </div>
                )}

                {props.state.bookType === "monster" &&
                  "baseHp" in selectedItem && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">HP:</span>
                        <span className="font-semibold text-sm">
                          {selectedItem.baseHp}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">攻撃力:</span>
                        <span className="font-semibold text-sm">
                          {selectedItem.baseAttack}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">防御力:</span>
                        <span className="font-semibold text-sm">
                          {selectedItem.baseDefense}
                        </span>
                      </div>
                    </div>
                  )}
              </div>
            ) : (
              <p className="text-muted-foreground">
                左のリストからアイテムを選択してください
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
