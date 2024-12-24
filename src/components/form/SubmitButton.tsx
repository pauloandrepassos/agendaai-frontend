interface SubmitButtonProps {
    text: string;
    isLoading?: boolean;
}

export default function SubmitButton({ text, isLoading }: SubmitButtonProps) {
    return (
        <button type="submit" disabled={isLoading} className={`mt-2 w-full rounded-xl text-xl text-center text-white p-2 
            ${isLoading ? "bg-[#FF5800] opacity-50 cursor-not-allowed" : "bg-[#FF0000] hover:bg-[#e60000]"}
        `}>
            {isLoading ? `Carregando...` : text}
        </button>
    )
}