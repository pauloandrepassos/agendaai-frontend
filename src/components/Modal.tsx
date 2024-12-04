import React from "react"

interface ModalProps {
    title: string
    message: string
    onClose: () => void
    isVisible: boolean
}

const Modal: React.FC<ModalProps> = ({ title, message, onClose, isVisible }) => {
    if (!isVisible) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-[#FFF8DC] rounded-lg p-6 w-11/12 max-w-md shadow-lg flex flex-col">
                <h2 className="text-xl text-center font-bold mb-4">{title}</h2>
                <p className="mb-4 text-justify">{message}</p>
                <button
                    onClick={onClose}
                    className="bg-[#FA240F] text-white px-4 py-2 rounded hover:bg-[#d0200e] transition m-auto"
                >
                    Fechar
                </button>
            </div>
        </div>
    )
}

export default Modal