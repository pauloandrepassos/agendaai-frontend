// pages/admin/solicitacao/[id].js
"use client"
import { useEffect, useState } from "react";
import { apiUrl } from '@/config/api';
import styles from './solicitacao.module.css';
import PrivateRouter from "@/components/PrivateRouter";

export default function Solicitacao({ params }) {
    const [solicitacao, setSolicitacao] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSolicitacao = async () => {
            try {
                const response = await fetch(`${apiUrl}/solicitacao/${params.id}`);
                const data = await response.json();
                setSolicitacao(data);
            } catch (error) {
                setError(`Erro ao buscar solicitação: ${error}`);
            } finally {
                setLoading(false);
            }
        };

        fetchSolicitacao();
    }, [params.id]);

    const handleAprovar = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/solicitacao/${params.id}?token=${token}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                alert('Solicitação aprovada com sucesso.');
                setSolicitacao(data.solicitacao); // Atualizar o status da solicitação no estado
            } else {
                const errorData = await response.json();
                alert(`Erro ao aprovar a solicitação: ${errorData.error}`);
            }
        } catch (error) {
            alert(`Erro ao aprovar a solicitação: ${error}`);
        }
    };

    const handleDesaprovar = async () => {
        // Implementar a lógica para desaprovar a solicitação
    };

    return (
        <PrivateRouter tipoUsuario={'admin'} className={styles.container}>
            <div className={styles.content}>
                {loading ? (
                    <p>Carregando...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    solicitacao && (
                        <div className={styles.solicitacaoContainer}>
                            <h1 className={styles.title}>{solicitacao.nomeLanchonete}</h1>
                            <p><strong>Gerente:</strong> {solicitacao.gerente}</p>
                            <p><strong>Email:</strong> {solicitacao.email}</p>
                            <p><strong>CNPJ:</strong> {solicitacao.cnpj}</p>
                            <p><strong>Endereço:</strong> {solicitacao.logradouro}, {solicitacao.numero}, {solicitacao.bairro}, {solicitacao.cidade} - {solicitacao.estado}</p>
                            <p><strong>CEP:</strong> {solicitacao.cep}</p>
                            {solicitacao.imagem && <img src={solicitacao.imagem} alt={solicitacao.nomeLanchonete} className={styles.image} />}
                            <p><strong>Status:</strong> {solicitacao.status}</p>
                            <div className={styles.actions}>
                                <button onClick={handleAprovar} className={styles.aprovarButton}>Aprovar</button>
                                <button onClick={handleDesaprovar} className={styles.desaprovarButton}>Desaprovar</button>
                            </div>
                        </div>
                    )
                )}
            </div>
        </PrivateRouter>
    );
}
