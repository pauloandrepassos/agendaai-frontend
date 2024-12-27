import React from "react"
import ContentCard from "./layout/ContentCard"

interface ModalProps {
    title: string
    message?: string
    onClose: () => void
    onGlobalClose?: () => void
    isVisible: boolean
}

const Modal: React.FC<ModalProps> = ({ title, message, onClose, onGlobalClose, isVisible }) => {
    if (!isVisible) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <ContentCard className="p-6 w-11/12 max-w-md flex flex-col">
                <h2 className="text-xl text-center font-bold mb-4">{title}</h2>
                {message && <p className="mb-4 text-justify">{message}</p>}
                <button
                    onClick={() => {
                        onClose()
                        onGlobalClose?.()
                    }}
                    className="bg-[#FA240F] text-white px-4 py-2 rounded hover:bg-[#d0200e] transition m-auto"
                >
                    Fechar
                </button>
            </ContentCard>
        </div>
    )
}

export default Modal
