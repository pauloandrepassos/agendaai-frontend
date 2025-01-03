"use client"

import { ReactNode } from "react"

interface ActionButtonProps {
    onClick: () => void
    className?: string
    children: ReactNode
}

export default function ActionButton({
    onClick,
    className,
    children,
}: ActionButtonProps) {

    return (
        <button
            onClick={onClick}
            className={`bg-[#FFFFF0] shadow-primary border-2 border-primary hover:bg-primary hover:text-white rounded-lg py-1 px-4 flex gap-2 ${className || ""}`}
            type="button"
        >
            {children}
        </button>
    )
}