"use client"

import SecondaryButton from "@/components/form/SecondaryButton";
import ContentCard from "@/components/layout/ContentCard";
import { apiUrl } from "@/config/api";
import { useEffect, useState } from "react";
import OrderDetailsModal from "./VendorOrdersDetails";
import { translateStatus } from "@/utils/translateStatus";
import Input from "@/components/form/TextInput";
import DateInput from "@/components/form/DateInput";
import { date } from "yup";
import { formatDateWithDay } from "@/utils/weekDays";

export default function VendorOrders() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const fetchOrders = async (date: Date | null) => {
    setLoading(true);
    if (!date) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/orders/establishment?date=${date.toISOString().split("T")[0]}`, {
        method: "GET",
        headers: {
          token: `${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar pedidos.");
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(selectedDate);
  }, [selectedDate]);

  const handleOpenModal = (order: IOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = event.target.value ? new Date(event.target.value) : null;
    setSelectedDate(dateValue);
  };

  const updateOrderStatus = (updatedOrder: IOrder) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === updatedOrder.id ? { ...order, ...updatedOrder } : order
      )
    );
  };  

  if (loading) {
    return <div className="text-center mt-5">Carregando pedidos...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-5">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary text-center sm:text-left">
          Agendamentos {selectedDate && <>de {formatDateWithDay(String(selectedDate))}</>}
        </h1>
        <DateInput
          label="Alterar Data"
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          className="w-full sm:w-auto"
        />
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center">Nenhum pedido encontrado para a data selecionada.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <ContentCard key={order.id} className="p-6">
              <div className="flex items-center justify-between border-b pb-3 mb-3">
                <h2 className="text-xl font-semibold text-secondary">
                  Pedido #{order.id}
                </h2>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${order.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                    }`}
                >
                  {translateStatus(order.status)}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold">Cliente:</span> {order.user.name}
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold">Contato:</span> {order.user.phone}
                </p>
                <p className="text-gray-800 font-bold">
                  Total: R$ {parseFloat(order.total_price).toFixed(2)}
                </p>
              </div>
              <div className="my-2">
                <h3 className="text-lg font-semibold text-primary">
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
              <SecondaryButton onClick={() => handleOpenModal(order)}>
                Detalhes
              </SecondaryButton>
            </ContentCard>
          ))}
        </div>
      )}

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={setIsModalOpen}
        onUpdateOrder={updateOrderStatus}
      />
    </div>
  );
}