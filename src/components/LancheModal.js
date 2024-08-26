"use client"
import axios from 'axios'
import { useState } from 'react'
import styles from './LancheModal.module.css'
import { apiRailway } from '@/config/api'

export default function LancheModal({ lanche, onClose, showToastMessage }) {
    const [quantidade, setQuantidade] = useState(1)
    const [adicionando, setAdicionando] = useState(false)
    const [timeoutId, setTimeoutId] = useState(null)

    const incrementarQuantidade = () => {
        setQuantidade(prev => prev + 1)
    }

    const decrementarQuantidade = () => {
        setQuantidade(prev => (prev > 1 ? prev - 1 : 1))
    }

    const handleAdd = async () => {
        if (adicionando) return // Impede múltiplos cliques

        setAdicionando(true)

        try {
            const token = localStorage.getItem('token')
            const idLanchonete = lanche.idLanchonete

            const response = await axios.post(`${apiRailway}/cesto/adicionar`, {
                idLanchonete,
                idLanche: lanche.id,
                quantidade
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                }
            })

            if (response.status === 200) {
                showToastMessage(`${lanche.nome} adicionado ao cesto com sucesso!`, 'success')
            } else {
                showToastMessage('Erro ao adicionar lanche ao cesto.', 'error')
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error === 'Não é possível adicionar itens de uma lanchonete diferente no mesmo cesto.') {
                showToastMessage('Não é possível adicionar itens de uma lanchonete diferente no mesmo cesto. Verifique seu cesto de compras.', 'error')
            } else {
                showToastMessage('Erro na requisição: ' + error.message, 'error')
            }
        }

        const id = setTimeout(() => {
            setAdicionando(false)
            onClose()
        })

        setTimeoutId(id) // Armazena o ID do timeout
    }

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
                            <button onClick={decrementarQuantidade} className={styles.quantityButton} disabled={adicionando}>-</button>
                            <span className={styles.quantity}>{quantidade}</span>
                            <button onClick={incrementarQuantidade} className={styles.quantityButton} disabled={adicionando}>+</button>
                        </div>
                        <button className={styles.botaoAdicionar} onClick={handleAdd} disabled={adicionando}>
                            {adicionando ? 'Adicionando lanche ao cesto...' : 'Adicionar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
