"use client"
import axios from 'axios';
import { useState } from 'react';
import styles from './LancheModal.module.css';
import { apiUrl } from '@/config/api';

export default function LancheModal({ lanche, onClose }) {
    const [quantidade, setQuantidade] = useState(1);
    const [adicionando, setAdicionando] = useState(false); // Estado para gerenciar o texto do botão

    const incrementarQuantidade = () => {
        setQuantidade(prev => prev + 1);
    };

    const decrementarQuantidade = () => {
        setQuantidade(prev => (prev > 1 ? prev - 1 : 1));
    };

    const handleAdd = async () => {
        setAdicionando(true); // Muda o estado para "adicionando"

        try {
            const token = localStorage.getItem('token');
            const idLanchonete = lanche.idLanchonete;

            const response = await axios.post(`${apiUrl}/cesto/adicionar`, {
                idLanchonete,
                idLanche: lanche.id,
                quantidade
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                }
            });

            if (response.status === 200) {
                console.log('Lanche adicionado ao cesto:', response.data);
            } else {
                console.error('Erro ao adicionar lanche ao cesto:', response.data);
            }
        } catch (error) {
            console.error('Erro na requisição:', error.message);
        }

        setTimeout(() => {
            setAdicionando(false); // Reseta o estado do botão
            onClose(); // Fecha a modal após o tempo definido
        }, 2000); // Aguarda 2 segundos antes de fechar a modal
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>X</button>
                <h2>{lanche.nome}</h2>
                <div className={styles.modalContent}>
                    <div className={styles.imageArea}>
                        <img src={lanche.imagem} alt={lanche.nome}/>
                    </div>
                    <div className={styles.infoArea}>
                        <p>{lanche.descricao}</p>
                        <p><strong>Preço: R$ {lanche.preco.toFixed(2)}</strong> </p>
                        <div className={styles.quantityControl}>
                            <button onClick={decrementarQuantidade} className={styles.quantityButton}>-</button>
                            <span className={styles.quantity}>{quantidade}</span>
                            <button onClick={incrementarQuantidade} className={styles.quantityButton}>+</button>
                        </div>
                        <button className={styles.botaoAdicionar} onClick={handleAdd}>
                            {adicionando ? 'Adicionando lanche ao cesto...' : 'Adicionar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
