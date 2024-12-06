"use client"

import { apiUrl } from "@/config/api"
import Loading from "@/components/form/LoadingSpinner"
import Modal from "@/components/Modal"
import axios from "axios"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"

function VerifyContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState<boolean>(true)
    const [message, setMessage] = useState<string | null>(null)
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

    useEffect(() => {
        const token = searchParams.get("token")
        const email = searchParams.get("email")

        if (!token || !email) {
            router.push("/auth/login")
            return
        }

        axios
            .post(`${apiUrl}/verify`, { token, email })
            .then(() => {
                setMessage("Email verificado com sucesso")
                setLoading(false)
                setIsModalVisible(true)
            })
            .catch((error) => {
                setLoading(false)
                setIsModalVisible(true)
                if (error.response && error.response.data.message) {
                    setMessage(error.response.data.message)
                } else {
                    setMessage(`Erro ao verificar o usuário. Tente novamente.`)
                }
            })
    }, [searchParams, router])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loading />
            </div>
        )
    }

    return (
        <Modal
            title={message || "Erro ao verificar email..."}
            isVisible={isModalVisible}
            onClose={() => {
                router.push("/auth/login")
            }}
        />
    )
}

export default function Verify() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center h-screen">
                    <Loading />
                </div>
            }
        >
            <VerifyContent />
        </Suspense>
    )
}