"use client"
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup'
import Navbar from "@/components/Navbar";
import { useForm } from "react-hook-form";
import axios from "axios";
import { apiUrl } from "@/config/api";

import styles from './cadastroLanchonete.module.css'

const solicitacaoSchema = yup.object().shape({
    nome: yup.string().required('Nome é obrigatório'),
    email: yup.string().email('Email inválido').required('Email é obrigatório'),
    password: yup.string().min(6, 'Senha deve ter no mínimo 6 caracteres').required('Senha é obrigatória'),
    nomeLanchonete: yup.string().required('Nome da lanchonete é obrigatório'),
    cnpj: yup.string().matches(/^\d{14}$/, 'CNPJ deve ter 14 dígitos').required('CNPJ é obrigatório'),
    //imagem: yup.string().url('URL da imagem inválida').required('Imagem é obrigatória'),
    cep: yup.string().matches(/^\d{5}-?\d{3}$/, 'CEP inválido').required('CEP é obrigatório'),
    logradouro: yup.string().required('Logradouro é obrigatório'),
    numero: yup.string().required('Número é obrigatório'),
    bairro: yup.string().required('Bairro é obrigatório'),
    cidade: yup.string().required('Cidade é obrigatória'),
    estado: yup.string().length(2, 'Estado deve ter 2 caracteres').required('Estado é obrigatório'),
});

export default function CadastroLanchonete() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(solicitacaoSchema),
        mode: "onChange"
    })

    const onSubmit = (data) => axios.post(`${apiUrl}/solicitacao`, {
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
    }).then((response) => {
        alert("Solicitação enviada com sucesso")
    }).catch((error) => {
        alert(`Erro ao criar solicitação: ${error.response?.data?.error || error.message}`);
    })

    return (
        <div>
            <Navbar />
            <div className={styles.container}>
                <h2>Cadastro de Lanchonete</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label>Nome</label>
                        <input type="text" {...register('nome')} />
                        <p>{errors.nome?.message}</p>
                    </div>
                    <div>
                        <label>Email</label>
                        <input type="email" {...register('email')} />
                        <p>{errors.email?.message}</p>
                    </div>
                    <div>
                        <label>Senha</label>
                        <input type="password" {...register('password')} />
                        <p>{errors.password?.message}</p>
                    </div>
                    <div>
                        <label>Nome da Lanchonete</label>
                        <input type="text" {...register('nomeLanchonete')} />
                        <p>{errors.nomeLanchonete?.message}</p>
                    </div>
                    <div>
                        <label>CNPJ</label>
                        <input type="text" {...register('cnpj')} />
                        <p>{errors.cnpj?.message}</p>
                    </div>
                    <div>
                        <label>URL da Imagem</label>
                        <input type="url" {...register('imagem')} />
                        <p>{errors.imagem?.message}</p>
                    </div>
                    <div>
                        <label>CEP</label>
                        <input type="text" {...register('cep')} />
                        <p>{errors.cep?.message}</p>
                    </div>
                    <div>
                        <label>Logradouro</label>
                        <input type="text" {...register('logradouro')} />
                        <p>{errors.logradouro?.message}</p>
                    </div>
                    <div>
                        <label>Número</label>
                        <input type="text" {...register('numero')} />
                        <p>{errors.numero?.message}</p>
                    </div>
                    <div>
                        <label>Bairro</label>
                        <input type="text" {...register('bairro')} />
                        <p>{errors.bairro?.message}</p>
                    </div>
                    <div>
                        <label>Cidade</label>
                        <input type="text" {...register('cidade')} />
                        <p>{errors.cidade?.message}</p>
                    </div>
                    <div>
                        <label>Estado</label>
                        <input type="text" {...register('estado')} />
                        <p>{errors.estado?.message}</p>
                    </div>
                    <button type="submit">Enviar Solicitação</button>
                </form>
            </div>
        </div>
    )
}