"use client"

import { ReactNode } from "react"

interface ContentCardProps {
    className?: string
    children: ReactNode
}

export default function ContentCard({ className, children }: ContentCardProps) {
    return (
        <div
            className={`bg-elementbg shadow-secondary rounded-2xl ${className || ""}`}
        >
            {children}
        </div>
    );
}
