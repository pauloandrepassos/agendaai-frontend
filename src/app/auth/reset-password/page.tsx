"use client"
import React, { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import SubmitButton from "@/components/form/SubmitButton"
import Input from "@/components/form/TextInput"
import Modal from "@/components/Modal"
import { Lobster } from "next/font/google"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useForm } from "react-hook-form"
import axios from "axios"
import { apiUrl } from "@/config/api"
import Loading from "@/components/form/LoadingSpinner"
import LobsterText from "@/components/form/LobsterText"
import ContentCard from "@/components/layout/ContentCard"

const lobster = Lobster({ subsets: ["latin"], weight: "400" })

interface FormData {
    newPassword: string
}

const validationSchema = yup.object().shape({
    newPassword: yup
        .string()
        .min(6, "A senha deve ter pelo menos 6 caracteres")
        .required("A senha é obrigatória"),
})

function ResetPasswordContent() {
    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [redirectTo, setRedirectTo] = useState<string | null>(null)
    const [token, setToken] = useState<string | null>(null)

    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const tokenFromParams = searchParams.get("token")
        if (tokenFromParams) {
            setToken(tokenFromParams)
        } else {
            router.push("/auth/login")
        }
    }, [searchParams, router])

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(validationSchema),
        mode: "onChange",
    })

    const onSubmit = (data: FormData) => {
        setLoading(true)

        axios
            .post(`${apiUrl}/reset-password`, {
                newPassword: data.newPassword,
                token,
            })
            .then(() => {
                setTitle("Senha redefinida com sucesso!")
                setMessage("Faça login para acessar seu perfil.")
                setRedirectTo("/auth/login")
                setIsModalVisible(true)
            })
            .catch(() => {
                setTitle("Erro")
                setMessage("Tente novamente.")
                setRedirectTo("/auth/forgot-password")
                setIsModalVisible(true)
            })
            .finally(() => setLoading(false))
    }

    const handleCloseModal = () => {
        setIsModalVisible(false)
        if (redirectTo) router.push(redirectTo)
    }

    return (
        <ContentCard className="relative bg-background p-8 m-3 rounded-2xl w-full max-w-md">
            <img
                src="/logo-agendaai.png"
                alt="Logo"
                className="absolute top-[-30px] left-10 w-16 h-16 object-contain"
            />
            <LobsterText className="text-4xl text-primary text-center font-bold mb-4">Redefinir senha</LobsterText>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Modal
                    title={title || ""}
                    message={message || ""}
                    isVisible={isModalVisible}
                    onClose={handleCloseModal}
                />
                <Input
                    label="Nova senha"
                    placeholder="Digite sua nova senha"
                    type="password"
                    {...register("newPassword")}
                    error={errors.newPassword?.message}
                />
                <SubmitButton text="Redefinir" isLoading={loading} />
            </form>
        </ContentCard>
    )
}

export default function ResetPassword() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center h-screen">
                    <Loading />
                </div>
            }
        >
            <ResetPasswordContent />
        </Suspense>
    )
}