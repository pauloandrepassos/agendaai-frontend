"use client"

import { decodeToken, isTokenValid } from "@/services/Token"

const { useRouter } = require("next/navigation")
const { useState, useEffect } = require("react")
const { default: Modal } = require("./SucessErrorModal")

const PrivateRouter = ({ children, tipoUsuario, idUsuario }) => {
    const [token, setToken] = useState("")
    const [erro, setErro] = useState(null)
    const [openModal, setOpenModal] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        if (!storedToken) {
            setErro('Faça login para acessar essa página.')
            setOpenModal(true)
        } else {
            const statusToken = isTokenValid(storedToken)
            if (!statusToken.isValid) {
                if (statusToken.status === 'expirado') {
                    setErro('Acesso expirado. Faça login novamente.')
                } else {
                    setErro('Faça login para acessar essa página')
                }
                setOpenModal(true)
            } else {
                const decodedToken = decodeToken(storedToken)
                if (decodedToken.papel !== tipoUsuario) {
                    setErro(`Acesso negado! ${decodedToken.papel}`)
                    setOpenModal(true)
                } else {
                    
                }
            }
        }
    })

    const closeModal = () => {
        if (erro === "Acesso negado!") {
            router.push('/')
        } else {
            router.push("/auth/login");
        }
    }

    return (
        <>
            {!openModal && children}
            <Modal 
                isOpen={openModal}
                message={erro}
                onClose={closeModal}
            />
        </>
    )
}

export default PrivateRouter