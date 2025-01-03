interface SubmitButtonProps {
    text: string;
    isLoading?: boolean;
}

export default function SubmitButton({ text, isLoading }: SubmitButtonProps) {
    return (
        <button type="submit" disabled={isLoading} className={`mt-2 w-full rounded-xl text-xl text-center text-white p-2 
            ${isLoading ? "bg-secondary opacity-50 cursor-not-allowed" : "bg-primary hover:bg-hoverprimary"}
        `}>
            {isLoading ? `Carregando...` : text}
        </button>
    )
}