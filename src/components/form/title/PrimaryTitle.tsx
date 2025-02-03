"use client"

import { ReactNode } from "react"
import LobsterText from "../LobsterText"

interface PrimaryTitleProps {
  children: ReactNode
  className?: string
}

export default function PrimaryTitle({ children, className = "" }: PrimaryTitleProps) {
  return (
    <div className={`text-3xl font-semibold text-primary p-2 ${className}`}>
      <LobsterText>{children}</LobsterText>
    </div>
  )
}