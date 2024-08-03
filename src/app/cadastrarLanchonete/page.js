"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import Navbar from "@/components/Navbar";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState, useEffect } from "react";
import { apiUrl } from "@/config/api";

import styles from './cadastroLanchonete.module.css';
import CloudinaryUpload from "@/components/CloudinaryUpload";
import Image from "next/image";

const solicitacaoSchema = yup.object().shape({
    nome: yup.string().required('Nome é obrigatório'),
    email: yup.string().email('Email inválido').required('Email é obrigatório'),
    password: yup.string().min(6, 'Senha deve ter no mínimo 6 caracteres').required('Senha é obrigatória'),
    nomeLanchonete: yup.string().required('Nome da lanchonete é obrigatório'),
    cnpj: yup.string().matches(/^\d{14}$/, 'CNPJ deve ter 14 dígitos').required('CNPJ é obrigatório'),
    cep: yup.string().matches(/^\d{5}-?\d{3}$/, 'CEP inválido').required('CEP é obrigatório'),
    logradouro: yup.string().required('Logradouro é obrigatório'),
    numero: yup.string().required('Número é obrigatório'),
    bairro: yup.string().required('Bairro é obrigatório'),
    cidade: yup.string().required('Cidade é obrigatória'),
    estado: yup.string().length(2, 'Estado deve ter 2 caracteres').required('Estado é obrigatório'),
});

export default function CadastroLanchonete() {
    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(solicitacaoSchema),
        mode: "onChange"
    });
    const [ imageUrl, setImageUrl ] = useState(null)
    const [section, setSection] = useState(1);

    const onSubmit = async (data) => {
        try {
            await axios.post(`${apiUrl}/solicitacao`, {
                nome: data.nome,
                email: data.email,
                password: data.password,
                nomeLanchonete: data.nomeLanchonete,
                cnpj: data.cnpj,
                imagem: data.imagem,
                cep: data.cep,
                logradouro: data.logradouro,
                numero: data.numero,
                bairro: data.bairro,
                cidade: data.cidade,
                estado: data.estado
            });
            alert("Solicitação enviada com sucesso");
        } catch (error) {
            alert(`Erro ao criar solicitação: ${error.response?.data?.error || error.message}`);
        }
    };

    const handleImageChange = (url) => {
        setValue('imagem', url);
        setImageUrl(url)
    };

    const nextSection = () => setSection(section + 1);
    const prevSection = () => setSection(section - 1);

    useEffect(() => {
        if (!isSubmitting) {
            const firstErrorKey = Object.keys(errors)[0];
            switch (firstErrorKey) {
                case 'imagem':
                    setSection(1);
                    break;
                case 'nome':
                case 'email':
                case 'password':
                case 'nomeLanchonete':
                case 'cnpj':
                    setSection(2);
                    break;
                case 'cep':
                case 'logradouro':
                case 'numero':
                case 'bairro':
                case 'cidade':
                case 'estado':
                    setSection(3);
                    break;
                default:
                    break;
            }
        }
    }, [errors, isSubmitting]);

    return (
        <div className={styles.CadastroLanchonetePage}>
            <Navbar />
            <div className={styles.container}>
                <h2>Cadastro de Lanchonete</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        {section === 1 && (
                            <div>
                                <label>Insira uma imagem da lanchonete</label>
                                <CloudinaryUpload
                                    width={500}
                                    height={300}
                                    onURLChange={handleImageChange}
                                    defaultImage={imageUrl}
                                />
                                <p>{errors.imagem?.message}</p>
                            </div>
                        )}
                        {section === 2 && (
                            <div>
                                <label>Nome</label>
                                <input type="text" {...register('nome')} />
                                <p>{errors.nome?.message}</p>
                                <label>Email</label>
                                <input type="email" {...register('email')} />
                                <p>{errors.email?.message}</p>
                                <label>Senha</label>
                                <input type="password" {...register('password')} />
                                <p>{errors.password?.message}</p>
                                <label>Nome da Lanchonete</label>
                                <input type="text" {...register('nomeLanchonete')} />
                                <p>{errors.nomeLanchonete?.message}</p>
                                <label>CNPJ</label>
                                <input type="text" {...register('cnpj')} />
                                <p>{errors.cnpj?.message}</p>
                            </div>
                        )}
                        {section === 3 && (
                            <div>
                                <label>CEP</label>
                                <input type="text" {...register('cep')} />
                                <p>{errors.cep?.message}</p>
                                <label>Logradouro</label>
                                <input type="text" {...register('logradouro')} />
                                <p>{errors.logradouro?.message}</p>
                                <label>Número</label>
                                <input type="text" {...register('numero')} />
                                <p>{errors.numero?.message}</p>
                                <label>Bairro</label>
                                <input type="text" {...register('bairro')} />
                                <p>{errors.bairro?.message}</p>
                                <label>Cidade</label>
                                <input type="text" {...register('cidade')} />
                                <p>{errors.cidade?.message}</p>
                                <label>Estado</label>
                                <input type="text" {...register('estado')} />
                                <p>{errors.estado?.message}</p>
                            </div>
                        )}
                    </div>
                    <div className={styles.prev_next_buttons}>
                        <div>
                            {(section === 2 || section === 3) && (
                                <button type="button" onClick={prevSection}>Seção anterior</button>
                            )}
                        </div>
                        <div>
                            {(section === 1 || section === 2) && (
                                <button type="button" onClick={nextSection}>Avançar seção</button>
                            )}
                        </div>
                    </div>
                    {(section === 3) && (
                        
                        <button type="submit">Enviar Solicitação</button>
                    )}
                </form>
            </div>
        </div>
    );
}
