import { ReactNode } from "react"

interface SecondaryButtonProps {
    className?: string
    children: ReactNode
    onClick?: () => void
}

export default function SecondaryButton({ className, children, onClick }: SecondaryButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`mt-2 w-full rounded-xl text-xl text-center text-white p-2 bg-[#FF5800] hover:bg-[#e14e00] ${className}`}>
            {children}
        </button>
    )
}