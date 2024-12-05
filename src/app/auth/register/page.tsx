"use client";
import { apiUrl } from "@/app/config/api";
import SubmitButton from "@/components/form/SubmitButton";
import Input from "@/components/form/TextInput";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Lobster } from "next/font/google";
import Modal from "@/components/Modal";

const lobster = Lobster({ subsets: ["latin"], weight: "400" });

interface FormData {
    name: string;
    cpf: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

const validationSchema = yup.object().shape({
    name: yup.string().required("O nome é obrigatório"),
    cpf: yup
        .string()
        .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "O CPF deve estar no formato 000.000.000-00")
        .required("O CPF é obrigatório"),
    email: yup.string().email("E-mail inválido").required("O e-mail é obrigatório"),
    phone: yup
        .string()
        //.matches(/^\d{10,11}$/, "O telefone deve conter 10 ou 11 dígitos")
        .required("O telefone é obrigatório"),
    password: yup
        .string()
        .min(6, "A senha deve ter pelo menos 6 caracteres")
        .required("A senha é obrigatória"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "As senhas não coincidem")
        .required("A confirmação da senha é obrigatória"),
});

export default function Login() {
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(validationSchema),
        mode: "onChange",
    })

    const formatCPF = (value: string) => {
        return value
            .replace(/\D/g, "")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    };

    const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValue = formatCPF(e.target.value);
        setValue("cpf", formattedValue)
    };

    const onSubmit = (data: FormData) => {
        setLoading(true);

        axios
            .post(`${apiUrl}/register`, {
                name: data.name,
                cpf: data.cpf,
                email: data.email,
                phone: data.phone,
                password: data.password,
            })
            .then((response) => {
                localStorage.setItem("token", response.data.token)
                setLoading(false)
                setIsModalVisible(true)
            })
            .catch((error) => {
                setLoading(false);
                if (error.response) {
                    const { status, data } = error.response;

                    if (status === 400 && data.errors) {
                        const allMessages = data.errors.map((err: { msg: string }) => err.msg).join("; ");
                        setMessage(allMessages);
                    } else if (status === 409) {
                        setMessage("Email ou CPF já em uso");
                    } else {
                        setMessage("Erro ao realizar registro. Tente novamente mais tarde");
                    }
                } else {
                    setMessage("Erro ao realizar registro");
                }
            });
    };


    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('/background.jpg')" }}
        >
            <div className="relative bg-[#FFF8DC] p-8 m-3 rounded-2xl shadow-md w-full max-w-3xl">
                <img src="/logo-agendaai.png" alt="Logo" className="absolute top-[-30px] left-10 w-16 h-16 object-contain" />
                <h1
                    className={`text-4xl text-[#FF0000] text-center font-bold mb-4 ${lobster.className}`}
                >
                    Cadastro
                </h1>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <Modal
                        title="Cadastro Enviado com Sucesso"
                        message="Para finalizar o seu cadastro, verifique seu email e acesse o link enviado."
                        isVisible={isModalVisible}
                        onClose={() => {
                            setIsModalVisible(false)
                            //router.push("/auth/login")
                        }}

                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Input
                            label="Nome"
                            placeholder="Digite seu nome"
                            type="text"
                            {...register("name")}
                            error={errors.name?.message}
                        />
                        <Input
                            label="Email"
                            placeholder="Digite seu email"
                            type="email"
                            {...register("email")}
                            error={errors.email?.message}
                        />
                        <Input
                            label="CPF"
                            placeholder="Digite seu CPF"
                            type="text"
                            {...register("cpf")}
                            onChange={handleCPFChange}
                            error={errors.cpf?.message}
                        />
                        <Input
                            label="Telefone"
                            placeholder="Digite seu telefone"
                            type="text"
                            {...register("phone")}
                            error={errors.phone?.message}
                        />
                        <Input
                            label="Senha"
                            placeholder="Digite sua senha"
                            type="password"
                            {...register("password")}
                            error={errors.password?.message}
                        />
                        <Input
                            label="Confirmar senha"
                            placeholder="Digite sua senha novamente"
                            type="password"
                            {...register("confirmPassword")}
                            error={errors.confirmPassword?.message}
                        />
                    </div>
                    <SubmitButton text="Entrar" isLoading={loading} />
                    <div className="text-center text-sm font-bold gap-1 pl">
                        <p>Já possui conta?</p>
                        <a href="/auth/login">
                            <p className="text-[#FF0000]">Entre aqui</p>
                        </a>
                    </div>
                </form>
                {message && <p className="mt-4 text-red-500">{message}</p>}
            </div>
        </div>
    );
}
