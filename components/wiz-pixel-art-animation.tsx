type Props = {
  frames: number[][]
  currentFrame: number
  pixelSize?: number
}

/**
 * WizPixelArtAnimation
 *
 * 8x8のドット絵アニメーションを表示するコンポーネント（Component）
 * framesには複数のフレーム（Frame）データを配列で渡す
 * 各フレームは64個の0または1の配列（Array）
 * currentFrameIndexは親コンポーネント（Component）で管理する
 */
export function WizPixelArt(props: Props) {
  const pixelSize = props.pixelSize ?? 16
  const currentFrame = props.frames[props.currentFrame]

  return (
    <div className="grid grid-cols-8">
      {currentFrame?.map((pixel, i) => (
        <div
          key={`pixel-${props.currentFrameIndex}-${i}`}
          className="bg-primary"
          style={{
            width: `${pixelSize}px`,
            height: `${pixelSize}px`,
            opacity: pixel,
          }}
        />
      ))}
    </div>
  )
}
