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
    <span className={`${lobster.className} ${className}`}>
      {children}
    </span>
  )
}