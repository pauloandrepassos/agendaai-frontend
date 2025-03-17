"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/config/api";
import Loading from "@/components/form/LoadingSpinner";
import EstablishmentHeader from "@/components/establishment/EstablishmentHeader";
import { useParams } from "next/navigation";
import { getDayString, getNextDayString, isBeforeCutoffTime } from "@/utils/dateUtils";
import Select from "@/components/form/Select";
import ProductCard from "@/components/ProductCard";
import OperatingHours from "@/components/establishment/OperatingHours";
import OperatingHoursModal from "@/components/OperatingHoursModal";
import ProductModal from "./ProductModal";
import Modal from "@/components/Modal";
import { formatDateWithDay, getNextDayDate, weekDays } from "@/utils/weekDays";

export default function Establishment() {
  const { id } = useParams(); // Obtém o ID da URL.

  const [establishment, setEstablishment] = useState<IEstablishment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [menu, setMenu] = useState<IMenuDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>(getDayString());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [operatingHours, setOperatingHours] = useState<IOperatingHour[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<IProduct | null>(null);
  const [errorModal, setErrorModal] = useState<{ title: string; message: string } | null>(null);
  const [quantityInBasket, setQuantityInBasket] = useState<number>(0);

  useEffect(() => {
    if (!id) return;

    const savedDay = localStorage.getItem("selectedDay");
    if (savedDay) {
      setSelectedDay(savedDay);
    }

    const fetchData = async () => {
      try {
        const estRes = await fetch(`${apiUrl}/establishments/${id}`);
        const estData = await estRes.json();
        setEstablishment(estData);
        const hoursRes = await fetch(`${apiUrl}/operating-hours/establishment/${id}`);
        const hoursData = await hoursRes.json();
        setOperatingHours(hoursData);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchMenu = async () => {
      try {
        const response = await fetch(`${apiUrl}/menu/establishment/${id}`);

        if (!response.ok) {
          throw new Error("Erro ao buscar o cardápio.");
        }

        const data: IMenuDay[] = await response.json();
        setMenu(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Erro desconhecido.");
      } finally {
        setLoading(false);
      }
    };

    const fetchQuantityInBasket = async () => {
      const token = localStorage.getItem("token");
      if (!token) return; // Não faz a requisição se o usuário não estiver autenticado

      try {
        const response = await fetch(`${apiUrl}/shopping-basket/count`, {
          headers: {
            token: token,
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar a quantidade de itens no cesto.");
        }

        const data = await response.json();
        setQuantityInBasket(data.itemCount);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Erro desconhecido.");
      }
    };

    fetchData();
    fetchMenu();
    fetchQuantityInBasket(); // Busca a quantidade de itens no cesto apenas se o usuário estiver autenticado
  }, [id]);

  const handleDaySelection = (day: string) => {
    setSelectedDay(day);
    localStorage.setItem("selectedDay", day);
  };

  const getOrderedDaysStartingFromToday = (): string[] => {
    const today = getDayString(); // Obtém o dia atual
    const todayIndex = weekDays.indexOf(today); // Encontra o índice do dia atual
    return [
      ...weekDays.slice(todayIndex), // Dias a partir do dia atual
      ...weekDays.slice(0, todayIndex), // Dias antes do dia atual
    ];
  };

  const orderedDays = getOrderedDaysStartingFromToday();

  const days = orderedDays.map((day) => {
    const isToday = day === getDayString();
    const isDisabled = isToday && !isBeforeCutoffTime(); // Desabilita o dia atual se for após 14:00

    return {
      label: formatDateWithDay(day),
      value: day,
      disabled: isDisabled, // Adiciona a propriedade disabled
    };
  });

  const isEstablishmentClosed = (day: string): boolean => {
    const operatingHour = operatingHours.find((oh) => oh.day_of_week === day);
    return operatingHour ? operatingHour.is_closed : true; // Assume que está fechado se não encontrar o horário
  };

  const isClosed = isEstablishmentClosed(selectedDay);

  const menuForSelectedDay = menu.find((day) => day.day === selectedDay);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (establishment) {
    return (
      <div className="max-w-7xl mx-auto p-3">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_2fr] gap-4">
          <EstablishmentHeader
            establishment={establishment}
            showEditButton={false}
          />

          <div className="hidden lg:block">
            <OperatingHours
              className="h-full ml-4"
              operatingHours={operatingHours}
              showEditButton={false}
            />
          </div>
          <button
            className="block lg:hidden bg-primary text-white rounded-md px-4 py-2"
            onClick={() => setIsModalOpen(true)}
          >
            Ver Horários de Funcionamento
          </button>
        </div>

        {isModalOpen && (
          <OperatingHoursModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            establishmentId={establishment.id}
          >
            <OperatingHours operatingHours={operatingHours} />
          </OperatingHoursModal>
        )}

        <div className="min-h-[300px] mt-4">
          <div className="mt-4">
            <Select
              options={days}
              value={selectedDay}
              onChange={(e) => handleDaySelection(e.target.value)}
            />
          </div>
          {isClosed ? (
            <div className="flex flex-col gap-4 items-center justify-center h-full">
              <p className="text-center text-red-500 font-bold">
                O estabelecimento está fechado neste dia.
              </p>
            </div>
          ) : menuForSelectedDay && menuForSelectedDay.menuItems.length > 0 ? (
            <div className="mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {menuForSelectedDay.menuItems.map((item) => (
                  <div
                    className=""
                    onClick={() => {
                      setCurrentProduct(item);
                      setIsModalVisible(true);
                    }}
                  >
                    <ProductCard
                      image={item.image}
                      name={item.name}
                      price={item.price}
                      key={item.id}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 items-center justify-center h-full">
              <p className="text-center text-gray-500">Nenhum item encontrado para este dia.</p>
            </div>
          )}
        </div>

        {currentProduct && menuForSelectedDay && (
          <ProductModal
            isVisible={isModalVisible}
            establishmentId={establishment.id}
            product={currentProduct}
            onClose={() => {
              setIsModalVisible(false);
            }}
            menuId={menuForSelectedDay.id}
            orderDate={getNextDayDate(selectedDay)}
            onError={(title = "Erro", message = "Ocorreu um erro") => {
              setErrorModal({ title, message });
              setIsModalVisible(false);
            }}
            quantityInBasket={quantityInBasket}
            onAddToBasket={(addedQuantity) => setQuantityInBasket((prev) => prev + addedQuantity)}
            selectedDay={selectedDay}
          />
        )}

        {errorModal && (
          <Modal
            isVisible={!!errorModal}
            title={errorModal.title}
            message={errorModal.message}
            onClose={() => setErrorModal(null)}
          />
        )}
      </div>
    );
  }

  return null;
}