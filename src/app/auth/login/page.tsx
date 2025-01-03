"use client"
import { apiUrl } from "@/config/api";
import SubmitButton from "@/components/form/SubmitButton";
import Input from "@/components/form/TextInput";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Lobster } from 'next/font/google';
import ContentCard from "@/components/layout/ContentCard";

const lobster = Lobster({ subsets: ['latin'], weight: '400' });

interface FormData {
    email: string
    password: string
}

export default function Login() {
    const [loading, setLoading] = useState<boolean>(false)
    const [message, setMessage] = useState<string | null>(null)
    const router = useRouter()

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        mode: "onChange"
    })

    const onSubmit = (data: FormData) => {
        setLoading(true)

        axios.post(`${apiUrl}/login`, {
            email: data.email,
            password: data.password
        }).then((response) => {
            localStorage.setItem("token", response.data.token)

            router.push('/')
        }).catch((error) => {
            setLoading(false)
            if (error.response) {
                const status = error.response.status;

                if (status === 404) {
                    setMessage('Usuário não encontrado');
                } else if (status === 401) {
                    setMessage(`Email ou senha incorretos`);
                } else {
                    setMessage('Erro ao realizar login. Tente novamente mais tarde');
                }
            } else {
                setMessage('Erro ao realizar login');
            }
        })
    }

    return (
        <ContentCard className="relative bg-background p-8 m-3 rounded-2xl w-full max-w-md">
            <img src="/logo-agendaai.png" alt="Logo" className="absolute top-[-30px] left-10 w-16 h-16 object-contain" />
            <h1 className={`text-4xl text-primary text-center font-bold mb-4 ${lobster.className}`}>Login</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <Input
                    label="Email"
                    placeholder="Digite seu email"
                    type="email"
                    {...register("email")}
                />
                <Input
                    label="Senha"
                    placeholder="Digite sua senha"
                    type="password"
                    {...register("password")}
                />
                <div className="flex gap-1 text-sm font-bold">
                    <p>Esqueceu a sua senha?</p>
                    <a href="/auth/forgot-password"><p className="text-primary">Clique aqui</p></a>
                </div>
                <SubmitButton text="Entrar" isLoading={loading} />
                <div className="text-center text-sm font-bold">
                    <p>Não possui conta ainda?</p>
                    <a href="/auth/register"><p className="text-primary">Cadastre-se aqui</p></a>
                </div>
            </form>
            {message && <p className="mt-4 text-red-500">{message}</p>}
        </ContentCard>
    )
}