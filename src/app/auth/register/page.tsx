"use client";
import { apiUrl } from "@/config/api";
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
import ContentCard from "@/components/layout/ContentCard";

const lobster = Lobster({ subsets: ["latin"], weight: "400" });

interface FormData {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

// Função para validar CPF
const isValidCPF = (cpf: string): boolean => {
    cpf = cpf.replace(/\D/g, ""); // Remove caracteres não numéricos

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false; // Verifica se tem 11 dígitos e não é uma sequência repetida

    let sum = 0;
    let remainder;

    // Validação do primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
};

const validationSchema = yup.object().shape({
    name: yup
        .string()
        .required("O nome é obrigatório")
        .min(3, "O nome deve ter pelo menos 3 caracteres"),
    email: yup.string().email("E-mail inválido").required("O e-mail é obrigatório"),
    phone: yup
        .string()
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

    const onSubmit = (data: FormData) => {
        setLoading(true);

        axios
            .post(`${apiUrl}/register`, {
                name: data.name,
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
        <ContentCard className="relative bg-background p-8 m-3 rounded-2xl w-full max-w-3xl">
            <img src="/logo-agendaai.png" alt="Logo" className="absolute top-[-30px] left-10 w-16 h-16 object-contain" />
            <h1
                className={`text-4xl text-[#FF0000] text-center font-bold mb-4 ${lobster.className}`}
            >
                Cadastro
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <Modal
                    title="Cadastro Enviado com Sucesso"
                    message="Para concluir seu cadastro, acesse seu e-mail e clique no link de confirmação que enviamos. Se não encontrar o e-mail, verifique a caixa de spam ou lixo eletrônico."
                    isVisible={isModalVisible}
                    onClose={() => {
                        setIsModalVisible(false)
                        //router.push("/auth/login")
                    }}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                    className="col-span-1 sm:col-span-2"
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
        </ContentCard>
    );
}