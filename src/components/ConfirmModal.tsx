import React from "react"
import ContentCard from "./layout/ContentCard"
import SecondaryButton from "./form/SecondaryButton"
import PrimaryButton from "./form/PrimaryButton"

interface ConfirmModalProps {
    title: string
    onClose: () => void
    onConfirm: () => void
    isVisible: boolean
    textButton?: string
    loading?: boolean
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ title, onClose, onConfirm, isVisible, textButton, loading }) => {
    if (!isVisible) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <ContentCard className="p-6 w-11/12 max-w-md flex flex-col">
                <h2 className="text-xl text-center font-bold mb-4">{title}</h2>
                <div className="grid grid-cols-2 gap-4">
                    <SecondaryButton onClick={()=>onClose()}>Voltar</SecondaryButton>
                    <PrimaryButton onClick={()=>onConfirm()} isLoading={loading}>{textButton ? `${textButton}` : "Confirmar"}</PrimaryButton>
                </div>
            </ContentCard>
        </div>
    )
}

export default ConfirmModal