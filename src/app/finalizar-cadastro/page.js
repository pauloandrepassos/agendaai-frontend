"use client"

import Loading from "@/components/Loading"
import Modal from "@/components/SucessErrorModal"
import { apiUrl } from "@/config/api"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export default function FinalizarCadastro() {
    const [loading, setLoading] = useState(true)
    const [responseMessage, setResponseMessage] = useState(null)
    const [verificationSuccess, setVerificationSuccess] = useState(false)
    const hasFetched = useRef(false)
    const router = useRouter()

    useEffect(() => {
        if (!hasFetched.current) {
            const searchParams = new URLSearchParams(window.location.search)
            const token = searchParams.get('token')
            const email = searchParams.get('email')

            if(!token || !email) {
                setResponseMessage(`Erro: token ou email ausente.`)
                setLoading(false)
            } else {
                verifyAccount(token, email)
            }
            hasFetched.current = true
        }
    }, [])

    const verifyAccount = async (token, email) => {
        try {
            const response = await fetch(`${apiUrl}/registrationComplation?token=${token}&email=${email}`);
            const data = await response.json();
            if (response.ok) {
                setLoading(false);
                setResponseMessage(data.message);
                setVerificationSuccess(true);
            } else {
                setLoading(false);
                setResponseMessage(data.error);
            }
        } catch (error) {
            setLoading(false);
            setResponseMessage("Erro ao verificar conta");
        }
    }

    const handleCloseModal = () => {
        setLoading(true)
        setResponseMessage(null);
        if (verificationSuccess) {
            router.push("/auth/login");
        } else {
            router.push("/")
        }
    }

    return (
        <div>
            {loading && <Loading />}
            {responseMessage &&
                <Modal 
                    isOpen={true}
                    onClose={handleCloseModal}
                    message={responseMessage}
                />
            }
        </div>
    )
}