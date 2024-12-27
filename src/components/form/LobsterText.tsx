"use client"

import { Lobster } from "next/font/google"
import { ReactNode } from "react"

const lobster = Lobster({ subsets: ["latin"], weight: "400" })

interface LobsterTextProps {
  children: ReactNode
  className?: string
}

export default function LobsterText({ children, className = "" }: LobsterTextProps) {
  return (
    <div className={`${lobster.className} ${className}`}>
      <span>{children}</span>
    </div>
  )
}