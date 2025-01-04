"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/config/api";
import Loading from "@/components/form/LoadingSpinner";
import EstablishmentHeader from "@/components/establishment/EstablishmentHeader";
import { useParams } from "next/navigation";
import { getDayString } from "@/utils/dateUtils";
import ContentCard from "@/components/layout/ContentCard";
import LobsterText from "@/components/form/LobsterText";
import Select from "@/components/form/Select";
import ProductCard from "@/components/ProductCard";
import OperatingHours from "@/components/establishment/OperatingHours";
import OperatingHoursModal from "@/components/OperatingHoursModal";
import ProductFormModal from "@/app/(vendor)/product/ProductModalForm";
import ProductModal from "./ProductModal";

interface Address {
  id: number;
  zip_code: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string;
  reference_point: string;
}

interface Establishment {
  id: number;
  name: string;
  logo: string;
  background_image: string;
  address: Address;
}

export default function Establishment() {
  const { id } = useParams(); // Obtém o ID da URL.

  const [establishment, setEstablishment] = useState<Establishment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [menu, setMenu] = useState<IMenuDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>(getDayString());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [operatingHours, setOperatingHours] = useState<IOperatingHour[]>([])
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<IProduct | null>(null);

  useEffect(() => {
    if (!id) return;

    const savedDay = localStorage.getItem("selectedDay");
    if (savedDay) {
      setSelectedDay(savedDay);
    }


    const fetchData = async () => {
      try {
        const estRes = await fetch(`${apiUrl}/establishments/${id}`, {
          headers: {
            token: `${localStorage.getItem("token")}`,
          },
        });
        const estData = await estRes.json();
        setEstablishment(estData);
        const hoursRes = await fetch(`${apiUrl}/operating-hours/establishment/${id}`, {
          headers: {
            token: `${localStorage.getItem("token")}`,
          },
        });
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
        const response = await fetch(`${apiUrl}/menu/establishment/${id}`, {
          headers: {
            token: `${localStorage.getItem("token")}`,
          },
        });

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

    fetchData();

    fetchMenu();
  }, [id]);

  const handleDaySelection = (day: string) => {
    setSelectedDay(day);
    localStorage.setItem("selectedDay", day)
  }

  const days = [
    { label: "Segunda", value: "monday" },
    { label: "Terça", value: "tuesday" },
    { label: "Quarta", value: "wednesday" },
    { label: "Quinta", value: "thursday" },
    { label: "Sexta", value: "friday" },
    { label: "Sábado", value: "saturday" },
    { label: "Domingo", value: "sunday" },
  ];

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
              showEditButton={true}
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

        <ContentCard className="min-h-[300px] mt-4">
          <div className="p-4">
            <Select
              options={days}
              value={selectedDay}
              onChange={(e) => handleDaySelection(e.target.value)}
            />
          </div>
          {menuForSelectedDay && menuForSelectedDay.menuItems.length > 0 ? (
            <div className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {menuForSelectedDay.menuItems.map((item) => (
                  <div
                    className=""
                    onClick={() => {
                      setCurrentProduct(item)
                      setIsModalVisible(true)
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
        </ContentCard>

        {currentProduct && (
          <ProductModal
            isVisible={isModalVisible}
            establishmentId={establishment.id}
            product={currentProduct}
            onClose={() => {
              setIsModalVisible(false)
            }}
          />
        )}
      </div>
    );
  }

  return null;
}