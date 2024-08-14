"use client"
import { useEffect, useState } from 'react'
import PrivateRouter from "@/components/PrivateRouter"
import styles from './pedidos.module.css'
import Navbar from "@/components/Navbar"
import axios from 'axios'
import { apiUrl } from '@/config/api'
import Loading from '@/components/Loading'

export default function PedidosPage() {
    const [pedidos, setPedidos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        async function fetchPedidos() {
            try {
                const response = await axios.get(`${apiUrl}/pedidos`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'token': token
                    }
                })
                setLoading(false)
                setPedidos(response.data)
            } catch (error) {
                console.error("Erro ao buscar pedidos:", error)
            }
        }

        fetchPedidos()
    }, [])

    return (
        <PrivateRouter tipoUsuario={'cliente'}>
            <div className={styles.container}>
                <Navbar />
                {loading ? (
                    <Loading />
                ) : (
                    <div className={styles.content}>
                        <h1>Meus Pedidos</h1>
                        {pedidos.length === 0 ? (
                            <p>Você ainda não fez nenhum pedido.</p>
                        ) : (
                            <div className={styles.pedidos}>
                                {pedidos.map(pedido => (
                                    <div key={pedido.id} className={styles.pedido}>
                                        <h2>Lanchonete: {pedido.nomeLanchonete}</h2>
                                        <p>Status: {pedido.status}</p>
                                        <div className={styles.itens}>
                                            {pedido.itens.map(item => (
                                                <div key={item.id} className={styles.item}>
                                                    <img src={item.imagem} alt={item.nome} className={styles.itemImagem} />
                                                    <div className={styles.itemDetalhes}>
                                                        <h3>{item.nome}</h3>
                                                        <p>{item.descricao}</p>
                                                        <p>Quantidade: {item.quantidade}</p>
                                                        <p>Preço Unitário: R${item.precoUnitario.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <h3>Total: R${pedido.total.toFixed(2)}</h3>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </PrivateRouter>
    )
}
