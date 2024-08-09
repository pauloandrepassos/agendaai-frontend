"use client"
import { useState } from 'react';
import styles from './LancheModal.module.css';
import Image from 'next/image';

export default function LancheModal({ lanche, onClose }) {
    const [quantidade, setQuantidade] = useState(1);

    const incrementarQuantidade = () => {
        setQuantidade(prev => prev + 1);
    };

    const decrementarQuantidade = () => {
        setQuantidade(prev => (prev > 1 ? prev - 1 : 1));
    };

    const handleAdd = () => {
        onAdd(lanche, quantidade);
        onClose();
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
                        <button className={styles.botaoAdicionar} onClick={onClose}>Adicionar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
