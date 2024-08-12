"use client"
import PrivateRouter from "@/components/PrivateRouter"
import styles from './cesto-de-compras.module.css'
import Navbar from "@/components/Navbar"
import { useEffect, useState } from "react"
import axios from "axios"
import { apiUrl, wsApiUrl } from "@/config/api"
import Loading from "@/components/Loading"
import { useRouter } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"

export default function CestoDeComprasPage() {
    const [cesto, setCesto] = useState(null)
    const [erro, setErro] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)  // Controla a visibilidade da modal de remoção
    const [pedidoModalVisible, setPedidoModalVisible] = useState(false)  // Controla a visibilidade da modal de confirmação do pedido
    const [lancheSelecionado, setLancheSelecionado] = useState(null) // Controla o lanche que será removido
    const router = useRouter()
    const [token, setToken] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        if (token) {
            const ws = new WebSocket(`${wsApiUrl}?token=${token}`);

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                if (message.type === 'cestoAtualizado') {
                    setCesto(message.cesto);
                }
            };

            // Fechar a conexão WebSocket quando o componente for desmontado
            return () => {
                ws.close();
            };
        }
    }, [token]);

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

    const removerItem = (idLanche) => {
        setLancheSelecionado(idLanche)
        setModalVisible(true)  // Exibe a modal de confirmação de remoção
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
                lanches: prevCesto.lanches.filter(lanche => lanche.idLanche !== lancheSelecionado)
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

    const handleConfirmarPedido = () => {
        setPedidoModalVisible(true)  // Exibe a modal de confirmação do pedido
    }

    const handlePedidoConfirmado = async () => {
        try {
            const token = localStorage.getItem('token')
            await axios.post(`${apiUrl}/pedido`, {
                idLanchonete: cesto.lanchoneteId,
                lanches: cesto.lanches.map(lanche => ({
                    idLanche: lanche.idLanche,
                    quantidade: lanche.quantidade
                }))
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                }
            })

            setPedidoModalVisible(false)  // Fecha a modal
            router.push('/pedido-confirmado')  // Redireciona para uma página de confirmação do pedido
        } catch (error) {
            setErro(error.response ? error.response.data.error : 'Erro ao confirmar o pedido')
        }
    }

    const handleCancelarPedidoConfirmacao = () => {
        setPedidoModalVisible(false)
    }

    const handleCancelarPedido = () => {
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
                                <li key={lanche.idLanche} className={styles.lancheItem}>
                                    <button className={styles.removeButton} onClick={() => removerItem(lanche.idLanche)}>
                                        <FontAwesomeIcon icon={faTrash} />
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
                    <div className={styles.content}>
                        <div className={styles.emptyCesto}>
                            <p>Não há lanches no seu cesto de compras.</p>
                            <button onClick={() => router.push(`/home`)} className={styles.actionButton}>Adicionar lanches</button>
                        </div>
                    </div>
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

                {pedidoModalVisible && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <p>Deseja confirmar o pedido?</p>
                            <div className={styles.modalActions}>
                                <button onClick={handlePedidoConfirmado} className={styles.confirmButton}>Confirmar</button>
                                <button onClick={handleCancelarPedidoConfirmacao} className={styles.cancelButton}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PrivateRouter>
    )
}
