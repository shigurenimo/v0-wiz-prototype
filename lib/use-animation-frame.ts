import { useEffect, useState } from "react"

type Props = {
  frameCount: number
  frameDelay?: number
}

/**
 * useAnimationFrame
 *
 * アニメーションフレーム（Animation Frame）のインデックスを管理するフック（Hook）
 */
export function useAnimationFrame(props: Props) {
  const frameDelay = props.frameDelay ?? 300
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrameIndex((prev) => (prev + 1) % props.frameCount)
    }, frameDelay)

    return () => clearInterval(interval)
  }, [props.frameCount, frameDelay])

  return currentFrameIndex
}
