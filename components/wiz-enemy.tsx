"use client"

import { WizPixelArtAnimation } from "@/components/wiz-pixel-art-animation"
import type { WizEnemy } from "@/engine/models/wiz-enemy"
import type { WizMaster } from "@/engine/models/wiz-master"
import { useAnimationFrame } from "@/lib/use-animation-frame"

type Props = {
  master: WizMaster
  enemy: WizEnemy
  frameOffset: number
}

/**
 * WizEnemy
 */
export function WizEnemy(props: Props) {
  const enemyMaster = props.master.enemies.find(
    (e) => e.id === props.enemy.enemyId,
  )

  const enemySpriteSheet = props.master.spriteSheets.find(
    (s) => s.id === enemyMaster?.spriteSheetId,
  )

  const baseFrame = useAnimationFrame({
    frameCount: enemySpriteSheet?.frames.length ?? 1,
    frameDelay: 300,
  })

  const currentFrame =
    (baseFrame + props.frameOffset) % (enemySpriteSheet?.frames.length ?? 1)

  return (
    <WizPixelArtAnimation
      frames={enemySpriteSheet?.frames ?? []}
      currentFrameIndex={currentFrame}
    />
  )
}
