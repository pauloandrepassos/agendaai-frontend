import React from "react"
import ContentCard from "./layout/ContentCard"
import SecondaryButton from "./form/SecondaryButton"
import PrimaryButton from "./form/PrimaryButton"

interface ConfirmModalProps {
    title: string
    message?: string
    onClose: () => void
    onConfirm: () => void
    isVisible: boolean
    textButton?: string
    loading?: boolean
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ title, message, onClose, onConfirm, isVisible, textButton, loading }) => {
    if (!isVisible) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <ContentCard className="p-6 w-11/12 max-w-md flex flex-col">
                <h2 className="text-xl text-center font-bold mb-4">{title}</h2>
                {message && <p className="mb-4 text-justify">{message}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-4">
                    <SecondaryButton onClick={()=>onClose()}>Voltar</SecondaryButton>
                    <PrimaryButton onClick={()=>onConfirm()} isLoading={loading}>{textButton ? `${textButton}` : "Confirmar"}</PrimaryButton>
                </div>
            </ContentCard>
        </div>
    )
}

export default ConfirmModal