"use client"
import SubmitButton from "@/components/form/SubmitButton"
import { useState } from "react"
import { Lobster } from 'next/font/google'
import { useForm } from "react-hook-form"
import Input from "@/components/form/TextInput"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import axios from "axios"
import { apiUrl } from "@/config/api"
import Modal from "@/components/Modal"
import { error } from "console"
import LobsterText from "@/components/form/LobsterText"
import ContentCard from "@/components/layout/ContentCard"

const lobster = Lobster({ subsets: ['latin'], weight: '400' })

interface FormData {
    email: string
}

const validationSchema = yup.object().shape({
    email: yup
        .string()
        .email("Email inválido")
        .required("O email é obrigatório")
})

export default function ForgotPassword() {
    const [loading, setLoading] = useState<boolean>(false)
    const [title, setTitle] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(validationSchema),
        mode: "onChange"
    })

    const onSubmit = (data: FormData) => {
        setLoading(true)

        axios
            .post(`${apiUrl}/forgot-password`, {
                email: data.email
            })
            .then((response) => {
                setTitle(response.data.message)
                setMessage("Verifique seu email e acesse o link que enviamos para recuperar sua senha.")
                setIsModalVisible(true)
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false)
                setTitle("Erro")
                if(error.response) {
                    const status = error.response.status

                    if(status === 404) {
                        setMessage("Email não encontrado")
                    } else {
                        setMessage("Erro ao tentar enviar email! Tente novamente.")
                    }
                } else {
                    setMessage("Erro ao tentar enviar email! Tente novamente.")
                }
                setIsModalVisible(true)
            })
    }

    return (
        <ContentCard className="relative bg-background p-8 m-3 rounded-2xl shadow-md w-full max-w-md">
            <img src="/logo-agendaai.png" alt="Logo" className="absolute top-[-30px] left-10 w-16 h-16 object-contain" />
            <LobsterText className="text-4xl text-primary text-center font-bold mb-4">Recuperar senha</LobsterText>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <Modal
                    title={title || ""}
                    message={message || ""}
                    isVisible={isModalVisible}
                    onClose={() => {
                        setIsModalVisible(false)
                        //router.push("/auth/login")
                    }}
                />
                <Input
                    label="Digite seu email que enviaremos um link para recuperar sua senha"
                    placeholder="Digite seu email"
                    type="email"
                    {...register("email")}
                    error={errors.email?.message}
                />
                <SubmitButton text="Enviar" isLoading={loading} />
                <div className="text-center text-sm font-bold">
                    <a href="/auth/login"><p className="text-primary">Cancelar</p></a>
                </div>
            </form>
        </ContentCard>
    )
}