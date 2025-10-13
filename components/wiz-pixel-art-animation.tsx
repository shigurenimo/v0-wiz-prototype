type Props = {
  frames: number[][][]
  currentFrameIndex: number
  pixelSize?: number
}

/**
 * WizPixelArtAnimation
 *
 * 16x16のドット絵アニメーションを表示するコンポーネント（Component）
 * framesには複数のフレーム（Frame）データを配列で渡す
 * 各フレームは16x16の2次元配列（0 or 1）
 * currentFrameIndexは親コンポーネント（Component）で管理する
 */
export function WizPixelArtAnimation(props: Props) {
  const pixelSize = props.pixelSize ?? 8
  const currentFrame = props.frames[props.currentFrameIndex]
  const gridSize = currentFrame?.length ?? 16

  return (
    <div className="grid" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
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
