"use client";

import { useEffect, useState } from "react";
import RedirectLink from "@/components/form/RedirectLink";
import ContentCard from "@/components/layout/ContentCard";
import Loading from "@/components/form/LoadingSpinner";
import { apiUrl } from "@/config/api";
import ProductCard from "@/components/ProductCard";
import LobsterText from "@/components/form/LobsterText";
import ActionButton from "@/components/form/ActionButton";
import ProductSelectionModal from "@/components/establishment/ProductSelectionModal";
import Select from "@/components/form/Select";

export default function Menu() {
  const [menu, setMenu] = useState<IMenuDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>("monday");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const savedDay = localStorage.getItem("selectedDay");
    if (savedDay) {
      setSelectedDay(savedDay);
    }

    const fetchMenu = async () => {
      try {
        const response = await fetch(`${apiUrl}/menu/establishment`, {
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

    fetchMenu();
  }, []);

  const handleAddItems = async (itemIds: number[]) => {
    try {
      setLoading(true)
      const response = await fetch(`${apiUrl}/menu/add-items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: `${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ itemIds, day: selectedDay }),
      });

      if (!response.ok) {
        throw new Error("Erro ao adicionar itens ao cardápio.");
      }

      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDaySelection = (day: string) => {
    setSelectedDay(day);
    localStorage.setItem("selectedDay", day)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">
        {error}
      </div>
    );
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

  return (
    <div className="max-w-7xl mx-auto p-3 grid grid-cols-1 md:grid-cols-[1fr_4fr]">
      {/* Lateral com os dias (visível apenas em telas médias ou maiores) */}
      <div className="hidden md:block">
        <div className="mr-6 flex flex-col gap-3">
          {days.map((day) => (
            <button
              key={day.value}
              onClick={() => handleDaySelection(day.value)}
              className={`p-2 rounded-md ${selectedDay === day.value
                ? "bg-gradient-to-tr from-secondary to-primary text-white"
                : "bg-elementbg shadow-primary border-2 border-primary"
                }`}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cardápio */}
      <ContentCard className="min-h-[300px]">
        <div className="p-4 h-full flex flex-col">
          <div className="grid grid-cols-2 md:grid-cols-3 items-center py-3 gap-4">
            <div className="order-2 md:order-1">
              <div className="hidden md:block">
                <LobsterText className="text-2xl font-bold mb-4 capitalize">
                  {days.find((d) => d.value === selectedDay)?.label}
                </LobsterText>
              </div>
              <div className="block md:hidden">
                <Select
                  options={days}
                  value={selectedDay}
                  onChange={(e) => handleDaySelection(e.target.value)}
                />
              </div>
            </div>

            {menuForSelectedDay && menuForSelectedDay.menuItems.length > 0 && (
              <h1 className="text-center order-3 md:order-2 col-span-2 md:col-span-1">
              {menuForSelectedDay?.menuItems.length || 0} opções selecionadas
            </h1>
            )}

            <div className="flex justify-end order-2 md:order-3 h-full">
              <ActionButton className="flex items-center justify-center w-full max-w-[200px]" onClick={() => setIsModalOpen(true)}>
                {menuForSelectedDay && menuForSelectedDay.menuItems.length > 0 ? (
                  <>Editar</>
                ):(
                  <>Adicionar</>
                )}
              </ActionButton>
            </div>
          </div>

          {menuForSelectedDay && menuForSelectedDay.menuItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {menuForSelectedDay.menuItems.map((item) => (
                <ProductCard
                  image={item.image}
                  name={item.name}
                  price={item.price}
                  key={item.id}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4 items-center justify-center h-full">
              <p className="text-center text-gray-500">
                Nenhum item encontrado para este dia. 
              </p>
            </div>
          )}
        </div>
      </ContentCard>

      <ProductSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddItems}
        selectedProductIds={menuForSelectedDay?.menuItems.map((item) => item.id) || []}
      />
    </div>
  );
}