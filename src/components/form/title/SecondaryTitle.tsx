"use client"

import { ReactNode } from "react"
import LobsterText from "../LobsterText"

interface SecondaryTitleProps {
  children: ReactNode
  className?: string
}

export default function SecondaryTitle({ children, className = "" }: SecondaryTitleProps) {
  return (
    <div className={`text-2xl font-semibold text-primary p-2 ${className}`}>
      <LobsterText>{children}</LobsterText>
    </div>
  )
}