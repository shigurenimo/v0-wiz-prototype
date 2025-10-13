import type { Metadata } from "next"
import { DotGothic16 } from "next/font/google"
import type React from "react"
import { Suspense } from "react"

import "./globals.css"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

const font = DotGothic16({
  weight: "400",
  subsets: ["latin"],
})

type Props = Readonly<{
  children: React.ReactNode
}>

export default function RootLayout(props: Props) {
  return (
    <html lang="en" className="dark">
      <body className={cn("overflow-y-hidden overscroll-auto font-sans", font.className)}>
        <Suspense fallback={<div>Loading...</div>}>{props.children}</Suspense>
      </body>
    </html>
  )
}
