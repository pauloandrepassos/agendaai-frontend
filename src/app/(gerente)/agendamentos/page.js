"use client"
import PrivateRouter from "@/components/PrivateRouter";
import styles from './agendamentos.module.css'
import Navbar from "@/components/Navbar";
import { useEffect, useRef, useState } from "react";
import { apiRailway, apiUrl } from "@/config/api";
import axios from "axios";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import ConfirmCancelModal from "@/components/ConfirmCancelModal";

export default function LanchoneteAgendamentosPage() {
    const [pedidos, setPedidos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedPedido, setSelectedPedido] = useState(null);
    const hasFetched = useRef(false); // Usando useRef para rastrear se a requisição já foi feita

    useEffect(() => {
        const fetchPedidos = async () => {
            if (hasFetched.current) return; // Se a requisição já foi feita, retorna imediatamente

            try {
                const token = localStorage.getItem('token'); // Obtenha o token do localStorage ou de onde estiver armazenado

                const response = await axios.get(`${apiUrl}/lanchonete-pedidos`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'token': token
                    }
                });

                setPedidos(response.data);
                hasFetched.current = true; // Marca que a requisição foi feita
            } catch (error) {
                console.error('Erro ao buscar pedidos:', error);
            }
        };

        fetchPedidos();
    }, []);


    const handleConfirmRetirada = async () => {
        if (!selectedPedido) return;

        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${apiRailway}/pedido/${selectedPedido}/confirmar-retirada`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                }
            });

            // Atualizar o estado dos pedidos para refletir a mudança no status
            setPedidos((prevPedidos) =>
                prevPedidos.map((pedido) =>
                    pedido.id === selectedPedido ? { ...pedido, status: 'retirado' } : pedido
                )
            );
        } catch (error) {
            console.error('Erro ao confirmar a retirada do pedido:', error);
        } finally {
            setShowModal(false);
            setSelectedPedido(null);
        }
    };

    return (
        <PrivateRouter tipoUsuario={"gerente"}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <h1>Agendamentos:</h1>
                    {pedidos && (
                        <div className={styles.pedidosContainer}>
                            {pedidos.map((pedido) => (
                                <div key={pedido.id} className={styles.pedido}>
                                    <div className={styles.row}>
                                        <div className={styles.userInfo}>
                                            {pedido.imagemUsuario ? (
                                                <Image
                                                    src={pedido.imagemUsuario}
                                                    alt="User image"
                                                    width={100}
                                                    height={100}
                                                    className={styles.userImage}
                                                />
                                            ) : (
                                                <div className={styles.noUserImage}>
                                                    <FontAwesomeIcon icon={faUser} />
                                                </div>
                                            )}
                                            <div>
                                                <h4>{pedido.nomeUsuario}</h4>
                                                <p>Status: {pedido.status}</p>
                                            </div>
                                        </div>
                                        <div className={styles.items}>
                                            {pedido.itens.map((item) => (
                                                <div key={item.id} className={styles.item}>
                                                    <Image
                                                        src={item.imagem}
                                                        width={60}
                                                        height={60}className={styles.itemImage}
                                                    />
                                                    <div>
                                                        <h4>{item.nome}</h4>
                                                        <p>Quantidade: {item.quantidade}</p>
                                                        <p>Total: R${item.total.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            
                                        </div>
                                    </div>
                                    <div className={styles.total}>
                                        <h4>Total do Pedido: R${pedido.total.toFixed(2)}</h4>
                                    </div>
                                    {pedido.status !== 'retirado' && (
                                        <button
                                            className={styles.confirmButton}
                                            onClick={() => {
                                                setSelectedPedido(pedido.id);
                                                setShowModal(true);
                                            }}
                                        >
                                            Confirmar Retirada
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <ConfirmCancelModal
                visible={showModal}
                message="Você confirma a retirada deste pedido?"
                onConfirm={handleConfirmRetirada}
                onCancel={() => {
                    setShowModal(false);
                    setSelectedPedido(null);
                }}
            />
        </PrivateRouter>
    )
}