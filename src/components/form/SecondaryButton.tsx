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
            className={`mt-2 w-full rounded-xl text-xl text-center text-white p-2 bg-secondary hover:bg-hoversecondary ${className}`}>
            {children}
        </button>
    )
}