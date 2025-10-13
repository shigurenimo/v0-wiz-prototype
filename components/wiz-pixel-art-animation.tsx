type Props = {
  frames: number[][][]
  currentFrameIndex: number
  pixelSize?: number
}

/**
 * WizPixelArtAnimation
 *
 * 8x8のドット絵アニメーションを表示するコンポーネント（Component）
 * framesには複数のフレーム（Frame）データを配列で渡す
 * 各フレームは8x8の2次元配列（0 or 1）
 * currentFrameIndexは親コンポーネント（Component）で管理する
 */
export function WizPixelArtAnimation(props: Props) {
  const pixelSize = props.pixelSize ?? 16
  const currentFrame = props.frames[props.currentFrameIndex]

  return (
    <div className="grid grid-cols-8">
      {currentFrame?.map((row, rowIndex) =>
        row.map((pixel, colIndex) => (
          <div
            key={`pixel-${props.currentFrameIndex}-${rowIndex}-${colIndex}`}
            className="bg-primary"
            style={{
              width: `${pixelSize}px`,
              height: `${pixelSize}px`,
              opacity: pixel,
            }}
          />
        )),
      )}
    </div>
  )
}
