"use client"

import SecondaryButton from "@/components/form/SecondaryButton";
import PrimaryTitle from "@/components/form/title/PrimaryTitle";
import ContentCard from "@/components/layout/ContentCard";
import { apiUrl } from "@/config/api";
import { translateStatus } from "@/utils/translateStatus";
import { useEffect, useState } from "react";
import { formatDate } from "react-datepicker/dist/date_utils";

export default function ClientOrder() {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleOpenModal = (order: IOrder) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("pt-BR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {orders.map((order) => (
                        <ContentCard key={order.id} className="p-6">
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
            )}
        </div>
    )
}