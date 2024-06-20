"use client"

import Navbar from "@/components/Navbar";
import styles from '../auth.module.css'
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function Signup() {
    
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
            <section className={styles.cadastro}>
                <div className={styles.cardCadastro}>
                    <h1>Cadastro</h1>
                    <form className={styles.formCadastro}>
                        <input
                            type='text'
                            id='nomeUsuario'
                            name='nomeUsuario'
                            placeholder='Digite seu nome'
                            required
                            //{...register("nomeUsuario")}
                        />
                        <input
                            type='text'
                            id='email'
                            name='email'
                            placeholder='Digite seu email'
                            required
                            //{...register("email")}
                        />

                        <div className={styles.inputSenha}>
                            <input
                                type={showPassword ? "text" : "password"}
                                id='password'
                                name='password'
                                placeholder='Digite sua senha'
                                required
                                //{...register("password")}
                            />
                            <FontAwesomeIcon className={styles.icon} icon={showPassword ? faEyeSlash : faEye} onClick={() => togglePasswordVisibility('password')} />
                        </div>

                        <div className={styles.inputSenha}>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id='confirmPassword'
                                name='confirmPassword'
                                placeholder='Confirme sua senha'
                                required
                                //{...register("confirmPassword")}
                            />
                            <FontAwesomeIcon className={styles.icon} icon={showConfirmPassword ? faEyeSlash : faEye} onClick={() => togglePasswordVisibility('confirmPassword')} />
                        </div>
                        <button
                            id="buttonLogin"
                            className={styles.submitButton}
                        >
                            Cadastrar
                        </button>
                    </form>
                </div>
            </section>
        </>
    )
}