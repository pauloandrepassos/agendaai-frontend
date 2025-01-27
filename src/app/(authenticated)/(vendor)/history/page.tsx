"use client";

import SecondaryButton from "@/components/form/SecondaryButton";
import ContentCard from "@/components/layout/ContentCard";
import { apiUrl } from "@/config/api";
import { translateStatus } from "@/utils/translateStatus";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function History() {
    const [groupedOrders, setGroupedOrders] = useState<Record<string, IOrder[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${apiUrl}/orders/establishment`, {
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
                    new Date(b.order_date).getTime() - new Date(a.order_date).getTime()
                );

                // Agrupar pedidos por data
                const grouped = sortedData.reduce((acc: Record<string, IOrder[]>, order: IOrder) => {
                    const date = new Date(order.order_date).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    });
                    if (!acc[date]) acc[date] = [];
                    acc[date].push(order);
                    return acc;
                }, {});

                setGroupedOrders(grouped);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Erro desconhecido.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleOpenModal = (order: IOrder) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    if (loading) {
        return <div className="text-center mt-5">Carregando pedidos...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 mt-5">{error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-5">
            <h1 className="text-3xl font-bold text-primary mb-8">Agendamentos</h1>
            {Object.keys(groupedOrders).length === 0 ? (
                <p className="text-gray-500 text-center">Nenhum pedido encontrado.</p>
            ) : (
                Object.entries(groupedOrders).map(([date, orders]) => (
                    <div key={date} className="mb-8">
                        <h2 className="text-2xl font-semibold text-secondary mb-4">{date}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {orders.map((order) => (
                                <ContentCard key={order.id} className="p-6">
                                    <div className="grid grid-cols-6 items-center border-b pb-3 mb-3">
                                        <div className="flex items-center gap-2 order-3 sm:order-1 col-span-6 sm:col-span-2 justify-center sm:justify-start">
                                            {order.user.image ? (
                                                <img
                                                    src={order.user.image}
                                                    alt={order.user.name}
                                                    className="w-16 h-16 object-cover rounded-full border"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-white text-3xl">
                                                    <FontAwesomeIcon icon={faUser} />
                                                </div>
                                            )}
                                            <span className="text-gray-800 font-semibold">
                                                {order.user.name}
                                            </span>
                                        </div>
                                        <h2 className="text-xl font-semibold text-secondary text-start sm:text-center order-1 sm:order-2 col-span-3 sm:col-span-2">
                                            Pedido #{order.id}
                                        </h2>
                                        <div className="flex items-center justify-end order-2 sm:order-3 col-span-3 sm:col-span-2">
                                            <span
                                                className={`px-3 py-1 text-xs font-medium rounded-full ${order.status === "completed"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                            >
                                                {translateStatus(order.status)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="my-2">
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
                                    <div className="space-y-1">
                                        <p className="text-gray-800 font-bold">
                                            Total: R$ {parseFloat(order.total_price).toFixed(2)}
                                        </p>
                                    </div>
                                    <SecondaryButton onClick={() => handleOpenModal(order)}>
                                        Detalhes
                                    </SecondaryButton>
                                </ContentCard>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
