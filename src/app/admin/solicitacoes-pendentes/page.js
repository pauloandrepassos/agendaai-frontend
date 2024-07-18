"use client";
// pages/admin/pending-approvals.js
import { useEffect, useState } from 'react';
import styles from './solicitacoes-pendentes.module.css';
import Navbar from "@/components/Navbar";
import { apiUrl } from '@/config/api';

export default function SolicitacoesPendentes() {
    const [verificado, setVerificado] = useState([]);
    const [aguardandoVerificacao, setAguardandoVerificacao] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSolicitacoes = async () => {
            try {
                const response = await fetch(`${apiUrl}/solicitacao`);
                const data = await response.json();
                setVerificado(data.filter(s => s.status === 'verificado'));
                setAguardandoVerificacao(data.filter(s => s.status === 'aguardando verificação'));
            } catch (error) {
                setError(`Erro ao buscar solicitações: ${error}`);
            } finally {
                setLoading(false);
            }
        };

        fetchSolicitacoes();
    }, []);

    return (
        <div className={styles.container}>
            <Navbar />
            <div className={styles.content}>
                <h1 className={styles.title}>Solicitações Pendentes</h1>
                {loading ? (
                    <p>Carregando...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <>
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Verificado</h2>
                            <ul className={styles.list}>
                                {verificado.map(solicitacao => (
                                    <li key={solicitacao.id} className={styles.listItem}>
                                        <h2>{solicitacao.nomeLanchonete}</h2>
                                        <p><strong>Gerente:</strong> {solicitacao.gerente}</p>
                                        <p><strong>Email:</strong> {solicitacao.email}</p>
                                        <p><strong>CNPJ:</strong> {solicitacao.cnpj}</p>
                                        <p><strong>Endereço:</strong> {solicitacao.logradouro}, {solicitacao.numero}, {solicitacao.bairro}, {solicitacao.cidade} - {solicitacao.estado}</p>
                                        <p><strong>CEP:</strong> {solicitacao.cep}</p>
                                        {/*solicitacao.imagem && <img src={solicitacao.imagem} alt={solicitacao.nomeLanchonete} className={styles.image} />*/}
                                        <p><strong>Status:</strong> {solicitacao.status}</p>
                                    </li>
                                ))}
                            </ul>
                        </section>
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Aguardando Verificação</h2>
                            <ul className={styles.list}>
                                {aguardandoVerificacao.map(solicitacao => (
                                    <li key={solicitacao.id} className={styles.listItem}>
                                        <h2>{solicitacao.nomeLanchonete}</h2>
                                        <p><strong>Gerente:</strong> {solicitacao.gerente}</p>
                                        <p><strong>Email:</strong> {solicitacao.email}</p>
                                        <p><strong>CNPJ:</strong> {solicitacao.cnpj}</p>
                                        <p><strong>Endereço:</strong> {solicitacao.logradouro}, {solicitacao.numero}, {solicitacao.bairro}, {solicitacao.cidade} - {solicitacao.estado}</p>
                                        <p><strong>CEP:</strong> {solicitacao.cep}</p>
                                        {/*solicitacao.imagem && <img src={solicitacao.imagem} alt={solicitacao.nomeLanchonete} className={styles.image} />*/}
                                        <p><strong>Status:</strong> {solicitacao.status}</p>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </>
                )}
            </div>
        </div>
    );
}
