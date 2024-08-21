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
import ConfirmCancelModal from "@/components/ConfirmCancelModal"
import Toast from "@/components/Toast"
import { useCesto } from "@/context/CestoContext"

export default function CestoDeComprasPage() {
    const [loading, setLoading] = useState(null)
    const [buscaloading, setBuscaLoading] = useState(true) // Inicializa como true para indicar que a busca está em andamento
    const {cesto, setCesto} = useCesto()
    const [erro, setErro] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [pedidoModalVisible, setPedidoModalVisible] = useState(false)
    const [modalCancelarPedidoVisible, setModalCancelarPedidoVisible] = useState(false)
    const [lancheSelecionado, setLancheSelecionado] = useState(null)
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState("")
    const [toastType, setToastType] = useState("")
    const router = useRouter()
    const [token, setToken] = useState(null)

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
            } finally {
                setBuscaLoading(false) // Busca finalizada
            }
        }
        fetchCesto()
    }, [setCesto])

    const calcularPrecoTotal = () => {
        if (cesto && cesto.lanches) {
            return cesto.lanches.reduce((total, lanche) => {
                return total + lanche.preco * lanche.quantidade
            }, 0).toFixed(2)
        }
        return "0.00"
    }

    const removerItem = (idLanche) => {
        setLancheSelecionado(idLanche)
        setModalVisible(true)
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

            setCesto(prevCesto => ({
                ...prevCesto,
                lanches: prevCesto.lanches.filter(lanche => lanche.idLanche !== lancheSelecionado)
            }))

            setModalVisible(false)
            setLancheSelecionado(null)
        } catch (error) {
            setErro(error.response ? error.response.data.error : 'Erro ao remover lanche')
        }
    }

    const handleCancelarRemocao = () => {
        setModalVisible(false)
        setLancheSelecionado(null)
    }

    const handleConfirmarPedido = () => {
        setPedidoModalVisible(true)
    }

    const handlePedidoConfirmado = async () => {
        setLoading(true)
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

            setPedidoModalVisible(false)
            router.push('/pedidos')
        } catch (error) {
            setErro(error.response ? error.response.data.error : 'Erro ao confirmar o pedido')
        }
    }

    const handleCancelarConfirmacaoPedido = () => {
        setPedidoModalVisible(false)
    }

    const handleCancelarPedido = () => {
        setModalCancelarPedidoVisible(true)
    }

    const handleCancelarPedidoOk = async () => {
        try {
            const token = localStorage.getItem('token')
            await axios.delete(`${apiUrl}/cesto`, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                }
            })

            setCesto(null)
            router.push(`/home`)
        } catch (error) {
            setErro(error.response ? error.response.data.error : 'Erro ao cancelar pedido')
        }
    }

    const hancleCancelarCancelaPedido = () => {
        setModalCancelarPedidoVisible(false)
    }

    return (
        <PrivateRouter tipoUsuario={'cliente'}>
            {buscaloading ? (
                <Loading />
            ) : (
                <div className={styles.container}>
                    {cesto && cesto.lanches.length > 0 ? (
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
                            <h2>Preço total: <strong>R$ {calcularPrecoTotal()}</strong></h2>
                            <div className={styles.actions}>
                                <button onClick={() => router.push(`/lanchonete/${cesto.lanchoneteId}`)} className={`${styles.actionButton} ${styles.addMoreItems}`}>Adicionar mais itens</button>
                                <button onClick={handleCancelarPedido} className={`${styles.actionButton} ${styles.cancelOrder}`}>Cancelar pedido</button>
                                <button onClick={handleConfirmarPedido} className={`${styles.actionButton} ${styles.confirmOrder}`}>Confirmar pedido</button>
                            </div>

                        </div>
                    ) : (
                        <div className={styles.content}>
                            <div className={styles.emptyCesto}>
                                <p>Não há lanches no seu cesto de compras.</p>
                                <button onClick={() => router.push(`/home`)} className={`${styles.actionButton} ${styles.addMoreItems}`}>Adicionar lanches</button>
                            </div>
                        </div>
                    )}

                    <ConfirmCancelModal
                        visible={modalVisible}
                        message="Deseja remover esse lanche do cesto de compras?"
                        onConfirm={handleRemoverConfirmado}
                        onCancel={handleCancelarRemocao}
                    />

                    <ConfirmCancelModal
                        visible={pedidoModalVisible}
                        message="Deseja confirmar o pedido?"
                        onConfirm={handlePedidoConfirmado}
                        onCancel={handleCancelarConfirmacaoPedido}
                    />

                    <ConfirmCancelModal
                        visible={modalCancelarPedidoVisible}
                        message="Tem certeza que deseja cancelar o pedido?"
                        onConfirm={handleCancelarPedidoOk}
                        onCancel={hancleCancelarCancelaPedido}
                    />

                    {showToast && <Toast type={toastType} message={toastMessage} />}
                </div>
            )}
        </PrivateRouter>
    )
}
