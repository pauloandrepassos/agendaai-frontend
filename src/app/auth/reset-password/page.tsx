"use client"
import SubmitButton from '@/components/form/SubmitButton'
import Input from '@/components/form/TextInput'
import { Lobster } from 'next/font/google'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { apiUrl } from '@/config/api'
import { error } from 'console'
import Modal from '@/components/Modal'

const lobster = Lobster({ subsets: ['latin'], weight: '400' })

interface FormData {
    newPassword: string
}

const validationSchema = yup.object().shape({
    newPassword: yup
        .string()
        .min(6, "A senha deve ter pelo menos 6 caracteres")
        .required("A senha é obrigatória")
})

export default function ResetPassword() {
    const [loading, setLoading] = useState<boolean>(false)
    const [title, setTitle] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [redirectTo, setRedirectTo] = useState<string | null>(null)
    const [token, setToken] = useState<string>("")
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const getToken = searchParams.get("token")
        if(getToken) {
            setToken(getToken)
        } else {
            //router.push('/auth/login')
        }
    })

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(validationSchema),
        mode: "onChange"
    })

    const onSubmit = (data: FormData) => {
        setLoading(true)

        axios.post(`${apiUrl}/reset-password`, {
            newPassword: data.newPassword,
            token: token
        }).then((response) => {
            setTitle("Senha redefinida com sucesso!")
            setMessage("Faça login para acessar seu perfil.")
            setIsModalVisible(true)
            setRedirectTo("/auth/login");
            setLoading(false)
        }).catch((error) => {
            setLoading(false)
            setTitle("Erro")
            setMessage("Tente novamente")
            setRedirectTo("/auth/forgot-password");
            setIsModalVisible(true)
        })
    }

    const handleCloseModal = () => {
        setIsModalVisible(false);
        if (redirectTo) {
          router.push(redirectTo);
        }
      };

    return (
        <div className="relative bg-[#FFF8DC] p-8 m-3 rounded-2xl shadow-md w-full max-w-md">
            <img src="/logo-agendaai.png" alt="Logo" className="absolute top-[-30px] left-10 w-16 h-16 object-contain" />
            <h1 className={`text-4xl text-[#FF0000] text-center font-bold mb-4 ${lobster.className}`}>Redefinir senha</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Modal
                    title={title || ""}
                    message={message || ""}
                    isVisible={isModalVisible}
                    onClose={handleCloseModal}
                />
                <Input
                    label='Nova senha'
                    placeholder='Digite sua nova senha'
                    type='password'
                    {...register("newPassword")}
                    error={errors.newPassword?.message}
                />
                <SubmitButton text='Redefinir' isLoading={loading} />
            </form>
        </div>
    )
}