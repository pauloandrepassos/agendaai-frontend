import { ReactNode } from "react"

interface PrimaryButtonProps {
    className?: string
    children: ReactNode
    onClick?: () => void
    isLoading?: boolean
}

export default function PrimaryButton({ className, children, onClick, isLoading }: PrimaryButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`mt-2 w-full rounded-xl text-xl text-center text-white p-2
            ${isLoading ? "bg-secondary opacity-50 cursor-not-allowed" : "bg-primary hover:bg-hoverprimary"}
                ${className}`}
            type="button"
        >
            {children}
        </button>
    )
}
