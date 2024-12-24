"use client"

import { ReactNode } from "react"

interface ContentCardProps {
    className?: string
    children: ReactNode
}

export default function ContentCard({ className, children }: ContentCardProps) {
    return (
        <div
            className={`bg-[#FFFFF0] shadow-[2px_3px_0_0_#FF5800] rounded-2xl ${className || ""}`}
        >
            {children}
        </div>
    );
}
