"use client"

import Navbar from "@/components/Navbar";
import styles from '../auth.module.css'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { apiUrl } from "@/config/api";
import Modal from "@/components/SucessErrorModal";
import axios from "axios";
import Loading from "@/components/Loading";

const schema = yup.object().shape({
    nome: yup.string().min(3, 'O nome de usuário deve ter pelo menos 3 dígitos').required('O nome deve vser preenchido'),
    email: yup.string().email('Formato de email inválido').required('O email deve ser preenchido'),
    password: yup.string().min(6, 'A senha deve ter pelo menos 6 caracteres').required('A senha deve ser preenchida'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'As senhas devem ser correspondentes').required('A confirmação de senha deve ser preenchida')
})

export default function Signup() {
    const router = useRouter()

    const [message, setMessage] = useState(null)
    const [loading, setLoading] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: "onChange"
    })

    const onSubmit = (data) => {
        setLoading(true)
        axios.post(`${apiUrl}/register`, {
            nome: data.nome,
            email: data.email,
            password: data.password,
            confirmPassword: data.confirmPassword
        }).then((response) => {
            setMessage('Foi enviado um link de confirmação para o seu email.')
            setLoading(false)
            //router.push('/auth/signupConfirm')
        }).catch((error) => {
            setLoading(false)
            if (error.response) {
                const responseData = error.response.data;
                if (responseData.error) {
                    setMessage(responseData.error)
                }
            } else {
                setMessage(error.message)
            }
        })
    }

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = (field) => {
        if (field === 'password') {
            setShowPassword((prevShowPassword) => !prevShowPassword);
        } else if (field === 'confirmPassword') {
            setShowConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword);
        }
    };

    return (
        <>
            <Navbar />
            {loading ? (
                <Loading />
            ) : (
                <section className={styles.cadastro}>
                    <div className={styles.cardCadastro}>
                        <h1>Cadastro</h1>
                        <form onSubmit={handleSubmit(onSubmit)} className={styles.formCadastro}>
                            <input
                                type='text'
                                id='nome'
                                name='nome'
                                placeholder='Digite seu nome'
                                required
                                {...register("nome")}
                            />
                            {errors.nome && <p className={styles.mensagemDeErro}>{errors.nome.message}</p>}
                            <input
                                type='text'
                                id='email'
                                name='email'
                                placeholder='Digite seu email'
                                required
                                {...register("email")}
                            />
                            {errors.email && <p className={styles.mensagemDeErro}>{errors.email.message}</p>}


                            <div className={styles.inputSenha}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id='password'
                                    name='password'
                                    placeholder='Digite sua senha'
                                    required
                                    {...register("password")}
                                />
                                <FontAwesomeIcon className={styles.icon} icon={showPassword ? faEyeSlash : faEye} onClick={() => togglePasswordVisibility('password')} />
                            </div>
                            {errors.password && <p className={styles.mensagemDeErro}>{errors.password.message}</p>}


                            <div className={styles.inputSenha}>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id='confirmPassword'
                                    name='confirmPassword'
                                    placeholder='Confirme sua senha'
                                    required
                                    {...register("confirmPassword")}
                                />
                                <FontAwesomeIcon className={styles.icon} icon={showConfirmPassword ? faEyeSlash : faEye} onClick={() => togglePasswordVisibility('confirmPassword')} />
                            </div>
                            {errors.confirmPassword && <p className={styles.mensagemDeErro}>{errors.confirmPassword.message}</p>}

                            <button
                                id="buttonLogin"
                                className={styles.submitButton}
                                type="submit"
                            >
                                Cadastrar
                            </button>
                        </form>
                    </div>
                </section>
            )}
            {message &&
                <Modal
                    isOpen={true}
                    onClose={() => setMessage(null)}
                    message={message}
                />
            }
        </>
    )
}