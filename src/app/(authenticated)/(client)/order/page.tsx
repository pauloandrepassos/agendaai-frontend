"use client"

import Modal from "@/components/Modal";
import ConfirmModal from "@/components/ConfirmModal";
import SecondaryButton from "@/components/form/SecondaryButton";
import PrimaryTitle from "@/components/form/title/PrimaryTitle";
import ContentCard from "@/components/layout/ContentCard";
import { apiUrl } from "@/config/api";
import { translateStatus } from "@/utils/translateStatus";
import { useEffect, useState } from "react";
import PrimaryButton from "@/components/form/PrimaryButton";

export default function ClientOrder() {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [orderToCancel, setOrderToCancel] = useState<IOrder | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);
    const [errorModal, setErrorModal] = useState<{ show: boolean, message: string }>({ show: false, message: '' });

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${apiUrl}/orders/user`, {
                    method: "GET",
                    headers: {
                        token: `${localStorage.getItem("token")}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Erro ao buscar pedidos.");
                }

                const data = await response.json();
                const sortedData = data.sort((a: IOrder, b: IOrder) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                );

                setOrders(sortedData);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Erro desconhecido.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("pt-BR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const handleCancelClick = (order: IOrder) => {
        if (canCancelOrder(order)) {
            setOrderToCancel(order);
        } else {
            setErrorModal({
                show: true,
                message: `O prazo para cancelamento deste pedido já expirou. O horário limite para cancelar era ${order.establishment.cancellation_deadline_time.slice(0, 5)}.`
            });
        }
    };

    const handleCloseModal = () => {
        setOrderToCancel(null);
    };

    const handleCloseErrorModal = () => {
        setErrorModal({ show: false, message: '' });
    };

    const handleConfirmCancel = async () => {
        if (!orderToCancel) return;

        setIsCancelling(true);
        try {
            const response = await fetch(`${apiUrl}/order/${orderToCancel.id}/cancel`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    token: `${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro ao cancelar pedido.");
            }

            const updatedOrder = await response.json();

            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderToCancel.id ? { ...order, status: "canceled" } : order
                )
            );

            setOrderToCancel(null);
        } catch (err) {
            setErrorModal({
                show: true,
                message: err instanceof Error ? err.message : "Ocorreu um erro ao cancelar o pedido."
            });
        } finally {
            setIsCancelling(false);
        }
    };

    const canCancelOrder = (order: IOrder) => {
        if (order.status !== "pending") return false;

        const cancellationDeadline = order.establishment.cancellation_deadline_time;
        if (!cancellationDeadline || cancellationDeadline === "00:00:00") return true;

        const [deadlineHours, deadlineMinutes] = cancellationDeadline.split(':').map(Number);
        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();

        const orderDate = new Date(order.order_date);
        const isSameDay = orderDate.getDate() === now.getDate() &&
            orderDate.getMonth() === now.getMonth() &&
            orderDate.getFullYear() === now.getFullYear();

        if (isSameDay) {
            if (currentHours > deadlineHours) {
                return false;
            } else if (currentHours === deadlineHours) {
                return currentMinutes <= deadlineMinutes;
            }
        }

        return true;
    };

    const getCancellationMessage = (order: IOrder) => {
        if (order.status !== "pending") return null;

        const deadline = order.establishment.cancellation_deadline_time;
        if (!deadline || deadline === "00:00:00") {
            return "Você pode cancelar este pedido a qualquer momento.";
        }

        const orderDate = new Date(order.order_date);
        const formattedDate = orderDate.toLocaleDateString("pt-BR", {
            day: "numeric",
            month: "long",
        });

        return `Você pode cancelar este pedido até as ${deadline.slice(0, 5)} do dia ${formattedDate}.`;
    };

    if (loading) {
        return <div className="text-center mt-5">Carregando pedidos...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 mt-5">{error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-5">
            <PrimaryTitle>Agendamentos</PrimaryTitle>

            {orders.length === 0 ? (
                <p className="text-gray-500 text-center">Nenhum pedido encontrado.</p>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {orders.map((order) => {
                        const cancellationMessage = getCancellationMessage(order);
                        const isCanceled = order.status === "canceled";
                        
                        return (<ContentCard key={order.id} className={`p-6 max-w-[600px] mx-0 sm:mx-auto lg:mx-0  relative`}>
                            {isCanceled && (
                                <div className="absolute top-0 left-0 w-full h-full bg-gray-400 bg-opacity-50 flex items-center justify-center">
                                </div>
                            )}
                            <div className="grid grid-cols-6 items-center border-b pb-3 mb-3">
                                <div className="flex items-center gap-2 order-3 sm:order-1 col-span-6 sm:col-span-2 justify-center sm:justify-start">
                                    <img
                                        src={order.establishment.logo}
                                        alt={order.establishment.name}
                                        className="w-12 h-12 object-cover rounded-full border"
                                    />
                                    <span className="text-gray-800 font-semibold">
                                        {order.establishment.name}
                                    </span>
                                </div>
                                <h2 className="text-xl font-semibold text-secondary text-start sm:text-center order-1 sm:order-2 col-span-3 sm:col-span-2">
                                    Pedido #{order.id}
                                </h2>
                                <div className="flex items-center justify-end order-2 sm:order-3 col-span-3 sm:col-span-2">
                                    <span
                                        className={`px-3 py-1 text-xs font-medium rounded-full ${order.status === "completed"
                                                ? "bg-green-100 text-green-800"
                                                : order.status === "canceled"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                            }`}
                                    >
                                        {translateStatus(order.status)}
                                    </span>
                                </div>
                            </div>
                            <div className="my-2">
                                <p className="text-center text-sm">{formatDate(order.order_date)} - {order.pickup_time.slice(0, 5)}</p>
                                <h3 className="text-base font-semibold text-primary">
                                    Itens: ({order.orderItems.reduce((total, item) => total + item.quantity, 0)})
                                </h3>
                                <div className="flex flex-row overflow-hidden gap-2 mt-1">
                                    {order.orderItems.map((item) => (
                                        <div className="relative min-w-12" key={item.id}>
                                            <img
                                                src={item.product.image}
                                                alt={item.product.name}
                                                className="w-12 h-12 object-cover rounded-lg"
                                            />
                                            {item.quantity > 1 && (
                                                <span className="absolute top-0 right-0 bg-red-500 text-white text-sm font-bold rounded-full px-2">
                                                    {item.quantity}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {order.status === "pending" && cancellationMessage && (
                                <div className="mt-2 mb-3 p-2 bg-red-50 text-red-800 text-sm rounded-md">
                                    {cancellationMessage}
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 items-center mt-3">
                                <p className="text-gray-800 font-bold">
                                    Total: R$ {parseFloat(order.total_price.toString()).toFixed(2)}
                                </p>
                                {order.status === "pending" && (
                                    <PrimaryButton
                                        onClick={() => handleCancelClick(order)}
                                        className="px-4 py-2 text-sm font-medium rounded-md text-white"
                                    >
                                        Cancelar Pedido
                                    </PrimaryButton>
                                )}
                            </div>
                        </ContentCard>)
                    })}
                </div>
            )}

            {/* Modal de confirmação */}
            <ConfirmModal
                isVisible={!!orderToCancel}
                onClose={handleCloseModal}
                onConfirm={handleConfirmCancel}
                title="Confirmar cancelamento?"
                message="Tem certeza que deseja cancelar este pedido? Esta ação não pode ser desfeita."
                textButton="Confirmar"
                loading={isCancelling}
            />

            {/* Modal de erro/prazo expirado */}
            <Modal
                isVisible={errorModal.show}
                onClose={handleCloseErrorModal}
                title={errorModal.message.includes('prazo') ? "Prazo expirado" : "Erro ao cancelar"}
                message={errorModal.message}
            />
        </div>
    )
}