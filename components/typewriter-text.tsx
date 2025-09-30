"use client"

import { useEffect, useState } from "react"

const NOISE_CHARS = [
  "!",
  "@",
  "#",
  "$",
  "%",
  "^",
  "&",
  "*",
  "=",
  "+",
  "<",
  ">",
  "?",
  "~",
]

interface TypewriterTextProps {
  text: string
  speed?: number
  onComplete?: () => void
}

export function TypewriterText({ text, speed = 50, onComplete }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [noisyChars, setNoisyChars] = useState<string[]>([])
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    setDisplayedText("")
    setCurrentIndex(0)
    setIsComplete(false)
    setNoisyChars([])
  }, [text])

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timer)
    } else if (currentIndex === text.length && !isComplete) {
      setIsComplete(true)
      setNoisyChars([])
      if (onComplete) onComplete()
    }
  }, [currentIndex, text, speed, isComplete, onComplete])

  useEffect(() => {
    if (isComplete) return

    const noiseInterval = setInterval(() => {
      const length = displayedText.length
      const noiseStart = Math.max(0, length - 3)
      const newNoisyChars: string[] = []

      for (let i = noiseStart; i < length; i++) {
        if (Math.random() > 0.5) {
          newNoisyChars[i] = NOISE_CHARS[Math.floor(Math.random() * NOISE_CHARS.length)]
        }
      }

      setNoisyChars(newNoisyChars)
    }, 50)

    return () => clearInterval(noiseInterval)
  }, [displayedText, isComplete])

  const renderText = () => {
    return displayedText.split("").map((char, index) => {
      const noisyChar = noisyChars[index]
      if (noisyChar) {
        return (
          <span key={index} className="text-primary/50">
            {noisyChar}
          </span>
        )
      }
      return <span key={index}>{char}</span>
    })
  }

  return (
    <p className="font-mono text-lg leading-relaxed text-primary">
      {renderText()}
      {!isComplete && <span className="animate-pulse">▮</span>}
    </p>
  )
}
