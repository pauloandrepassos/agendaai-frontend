"use client"
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import PrivateRouter from "@/components/PrivateRouter";
import Navbar from "@/components/Navbar";
import CloudinaryUpload from "@/components/CloudinaryUpload";
import styles from './adicionar-lanche.module.css';
import { apiUrl } from "@/config/api";
import Loading from "@/components/Loading";
import TextInput from "@/components/Form/TextInput";
import NumberInput from "@/components/Form/NumberInput";
import SelectInput from "@/components/Form/SelectInput";
import PriceInput from "@/components/Form/PriceInput";
import SubmitButton from "@/components/Form/SubmitButton";

export default function AdicionarLanche() {
    const { id } = useParams();
    const router = useRouter();
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [preco, setPreco] = useState(0);
    const [tipo, setTipo] = useState("");
    const [imagem, setImagem] = useState("");
    const [loading, setLoading] = useState(null)
    const token = localStorage.getItem("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/lanchonete/${id}/lanche`, {
                nome,
                descricao,
                preco,
                tipo,
                imagem,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "token": token
                },
            });
            setLoading(true)
            if (response.status === 201) {
                router.push(`/lanchonete/${id}/lanche`);
            }
        } catch (error) {
            console.error("Erro ao cadastrar o lanche:", error);
        }
    };

    return (
        <PrivateRouter tipoUsuario={'gerente'}>
            <div className={styles.container}>
                <Navbar />
                <div className={styles.content}>
                    <h1>Adicionar Lanche</h1>
                    {loading ? (
                        <Loading />
                    ) : (

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.sectionform}>
                                <div className={styles.field}>
                                    <label>Imagem:</label>
                                    <CloudinaryUpload onURLChange={setImagem} width={200} height={200} />
                                </div>
                            </div>
                            <div className={styles.sectionform}>
                                <TextInput
                                    id="nome"
                                    label="Nome do Lanche:"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    required
                                />
                                <TextInput
                                    id="descricao"
                                    label="Descrição:"
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                    required
                                />
                                <PriceInput
                                    id="preco"
                                    label="Preço:"
                                    value={preco}
                                    onChange={setPreco}
                                    required
                                />
                                <SelectInput
                                    id="tipo"
                                    label="Tipo:"
                                    value={tipo}
                                    onChange={(e) => setTipo(e.target.value)}
                                    options={[
                                        { value: "Salgado", label: "Salgado" },
                                        { value: "Bolo", label: "Bolo" },
                                        { value: "Doce", label: "Doce" },
                                        { value: "Bebida", label: "Bebida" },
                                        { value: "Outro", label: "Outro tipo" },
                                    ]}
                                    required
                                />

                                <SubmitButton
                                    text={`Adicionar Lanche`}
                                    isLoading={loading}
                                />
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </PrivateRouter>
    );
}
