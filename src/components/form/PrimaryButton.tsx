import { ReactNode } from "react"

interface PrimaryButtonProps {
    className?: string
    children: ReactNode
    onClick?: () => void
}

export default function PrimaryButton({ className, children, onClick }: PrimaryButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`mt-2 w-full rounded-xl text-xl text-center text-white p-2 bg-primary hover:bg-hoverprimary ${className}`}
        >
            {children}
        </button>
    )
}
