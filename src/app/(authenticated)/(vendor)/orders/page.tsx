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
import { formatDate, formatDateWithDay } from "@/utils/weekDays";
import PrimaryTitle from "@/components/form/title/PrimaryTitle";
import SearchBar from "@/components/form/SearchBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { formatarHorario } from "@/utils/time";

export default function VendorOrders() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [highlightedDates, setHighlightedDates] = useState<string[]>([]);

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

  const fetchHighlightedDates = async () => {
    try {
      const response = await fetch(`${apiUrl}/orders/establishment/dates`, {
        method: "GET",
        headers: {
          token: `${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar datas.");
      }

      const data = await response.json();
      setHighlightedDates(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders(selectedDate);
    fetchHighlightedDates()
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
      <div className="flex flex-col gap-4">
        <div className="flex justify-between w-full">
          <PrimaryTitle>Agendamentos</PrimaryTitle>
          <PrimaryTitle>{selectedDate ? selectedDate.toLocaleDateString() : ""}</PrimaryTitle>
        </div>
        <div className="mb-4 flex justify-between">
          <div className="flex gap-4">
            <button className="bg-elementbg items-center shadow-primary border-2 border-primary hover:bg-primary hover:text-white rounded-lg py-1 px-4 flex gap-2 font-bold">
              Todos
            </button>
            <button className="bg-elementbg items-center shadow-primary border-2 border-primary hover:bg-primary hover:text-white rounded-lg py-1 px-4 flex gap-2 font-bold">
              Pendentes
            </button>
            <button className="bg-elementbg items-center shadow-primary border-2 border-primary hover:bg-primary hover:text-white rounded-lg py-1 px-4 flex gap-2 font-bold">
              Concluídos
            </button>
          </div>
          <div className="flex gap-4">
            <SearchBar placeholder="Número do pedido" />
            <button className="bg-elementbg items-center shadow-primary border-2 border-primary hover:bg-primary hover:text-white rounded-lg py-1 px-4 flex gap-2 font-bold">
              Data
            </button>
          </div>
        </div>

        {/*<DateInput
          label="Alterar Data"
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          highlightedDates={highlightedDates}
          className="w-full sm:w-auto"
        />*/}
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center">Nenhum pedido encontrado para a data selecionada.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <ContentCard key={order.id} className="p-6">
              <div className="border-b-2 pb-3 mb-3">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex gap-3 items-center">
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
                      <div>
                        <h2 className="font-semibold">
                          {order.user.name}
                        </h2>
                        <h2 className="font-semibold text-secondary">
                          Pedido #{order.id}
                        </h2>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${order.status === "completed"
                      ? "bg-green-500 text-white"
                      : order.status === "canceled"
                        ? "bg-red-500 text-white"
                        : "bg-yellow-500 text-white"
                      }`}
                  >
                    {translateStatus(order.status)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <p>
                    {new Intl.DateTimeFormat('pt-BR').format(new Date(order.order_date))}
                  </p>
                  <p>
                    {formatarHorario(order.pickup_time)}
                  </p>
                </div>
              </div>
              <div className="border-b-2 pb-3 mb-3">
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
              <div className="text-gray-800 font-bold flex justify-between">
                <p>Total:</p>
                <p>R$ {parseFloat(order.total_price).toFixed(2)}</p>
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