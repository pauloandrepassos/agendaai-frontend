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
            className={`bg-[#FFFFF0] shadow-[2px_2px_0_0_#FF0000] border-2 border-[#FF0000] hover:bg-[#FF0000] hover:text-white rounded-lg py-1 px-4 flex gap-2 ${className || ""}`}
            type="button"
        >
            {children}
        </button>
    )
}