"use client"

import Navbar from '@/components/Navbar'
import styles from '../auth.module.css'
import { useState } from 'react'
import Loading from '@/components/Loading'
import { useForm } from 'react-hook-form'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { apiUrl } from '@/config/api'
import Modal from '@/components/SucessErrorModal'


export default function Login() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)

    const { register, handleSubmit, formState: {errors} } = useForm({

    })

    const onSubmit = (data) => {
        setLoading(true)

        axios.post(`${apiUrl}/login`, {
            email: data.email,
            password: data.password
        }).then((response) => {
            localStorage.setItem("token", response.data.token)

            if(response.data.papel === 'cliente') {
                router.push('/home')
            } else if (response.data.papel === 'admin') {
                router.push('/admin')
            } else if (response.data.papel === 'gerente') {
                router.push('/dashboard')
            }
             else {
                router.push('/')
            }
        }).catch((error) => {
            setLoading(false)
            if (error.response) {
                const status = error.response.status
                if (status === 404) {
                    setMessage('Usuário não encontrado')
                } else if(status === 401) {
                    setMessage(`Email ou senha incorretos`)
                    //error.response.data.error
                } else {
                    setMessage('Erro ao realizar login. Tente novamente mais tarde')
                }
            } else {
                setMessage(`Erro ao realizar login`)
            }
        })
    }

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
        <>
            <Navbar />
            {loading ? (
                <Loading />
            ) : (
                <section className={styles.cadastro}>
                    <div className={styles.cardCadastro}>
                        <h1>Login</h1>
                        <form onSubmit={handleSubmit(onSubmit)} className={styles.formCadastro}>
                        <div className={styles.inputDiv}>
                                    <input
                                        id="login"
                                        type="email"
                                        placeholder="Email"
                                        required
                                        {...register("email")}
                                    />
                                </div>
                                <div className={styles.inputDiv}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        placeholder="Senha"
                                        required
                                        {...register('password')}
                                    />
                                    <FontAwesomeIcon className={styles.icon} icon={showPassword ? faEyeSlash : faEye} onClick={togglePasswordVisibility} />
                                </div>
                                <button id='buttonLogin' className={styles.submitButton} type='submit'>Entrar</button>
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