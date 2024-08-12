"use client"
import PrivateRouter from "@/components/PrivateRouter"
import styles from './cesto-de-compras.module.css'
import Navbar from "@/components/Navbar"
import { useEffect, useState } from "react"
import axios from "axios"
import { apiUrl } from "@/config/api"
import Loading from "@/components/Loading"
import { useRouter } from "next/navigation"

export default function CestoDeComprasPage() {
    const [cesto, setCesto] = useState(null)
    const [erro, setErro] = useState(null)
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

    const handleCancelarPedido = async () => {
        
    }

    const handleConfirmarPedido = async () => {
        
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
                            <button onClick={() => handleCancelarPedido()} className={styles.actionButton}>Cancelar pedido</button>
                            <button onClick={() => handleConfirmarPedido()} className={styles.actionButton}>Confirmar pedido</button>
                        </div>
                    </div>
                ) : (
                    <Loading />
                )}
            </div>

        </PrivateRouter>
    )
}