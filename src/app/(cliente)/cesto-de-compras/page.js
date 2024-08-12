"use client"
import PrivateRouter from "@/components/PrivateRouter"
import styles from './cesto-de-compras.module.css'
import Navbar from "@/components/Navbar"
import { useEffect, useState } from "react"
import axios from "axios"
import { apiUrl } from "@/config/api"
import Loading from "@/components/Loading"
import { useRouter } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"

export default function CestoDeComprasPage() {
    const [cesto, setCesto] = useState(null)
    const [erro, setErro] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)  // Controla a visibilidade da modal
    const [lancheSelecionado, setLancheSelecionado] = useState(null) // Controla o lanche que será removido
    const router = useRouter()

    useEffect(() => {
        const fetchCesto = async () => {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(`${apiUrl}/cesto`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'token': token
                    }
                })
                setCesto(response.data)
            } catch (error) {
                setErro(error.response ? error.response.data.error : 'Erro ao buscar cesto')
            }
        }
        fetchCesto()
    }, [])

    const removerItem = (lancheId) => {
        setLancheSelecionado(lancheId)
        setModalVisible(true)  // Exibe a modal de confirmação
    }

    const handleRemoverConfirmado = async () => {
        try {
            const token = localStorage.getItem('token')
            await axios.delete(`${apiUrl}/cesto/remover/${lancheSelecionado}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                }
            })

            // Remove o lanche da lista localmente
            setCesto(prevCesto => ({
                ...prevCesto,
                lanches: prevCesto.lanches.filter(lanche => lanche.lancheId !== lancheSelecionado)
            }))

            setModalVisible(false)  // Fecha a modal
            setLancheSelecionado(null)  // Reseta o lanche selecionado
        } catch (error) {
            setErro(error.response ? error.response.data.error : 'Erro ao remover lanche')
        }
    }

    const handleCancelarRemocao = () => {
        setModalVisible(false)
        setLancheSelecionado(null)
    }

    const handleCancelarPedido = async () => {
        // Implementar a funcionalidade de cancelar pedido
    }

    const handleConfirmarPedido = async () => {
        // Implementar a funcionalidade de confirmar pedido
    }

    return (
        <PrivateRouter tipoUsuario={'cliente'}>
            <div className={styles.container}>
                <Navbar />
                {cesto ? (
                    <div className={styles.content}>
                        <h1>Cesto de Compras</h1>
                        <h2>Lanchonete: {cesto.lanchoneteNome}</h2>
                        <ul>
                            {cesto.lanches.map((lanche) => (
                                <li key={lanche.lancheId} className={styles.lancheItem}>
                                    <button className={styles.removeButton} onClick={() => removerItem(lanche.lancheId)}>
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </button>
                                    <img src={lanche.imagem} alt={lanche.nome} className={styles.lancheImagem} />
                                    <div>
                                        <h3>{lanche.nome}</h3>
                                        <p>Quantidade: {lanche.quantidade}</p>
                                        <p>Preço: <strong>R$ {lanche.preco.toFixed(2)}</strong></p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className={styles.actions}>
                            <button onClick={() => router.push(`/lanchonete/${cesto.lanchoneteId}`)} className={styles.actionButton}>Adicionar mais itens</button>
                            <button onClick={handleCancelarPedido} className={styles.actionButton}>Cancelar pedido</button>
                            <button onClick={handleConfirmarPedido} className={styles.actionButton}>Confirmar pedido</button>
                        </div>
                    </div>
                ) : (
                    <Loading />
                )}

                {modalVisible && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <p>Deseja remover esse lanche do cesto de compras?</p>
                            <div className={styles.modalActions}>
                                <button onClick={handleRemoverConfirmado} className={styles.confirmButton}>Confirmar</button>
                                <button onClick={handleCancelarRemocao} className={styles.cancelButton}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PrivateRouter>
    )
}
