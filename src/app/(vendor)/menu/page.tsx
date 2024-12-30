"use client";

import { useEffect, useState } from "react";
import RedirectLink from "@/components/form/RedirectLink";
import ContentCard from "@/components/layout/ContentCard";
import Loading from "@/components/form/LoadingSpinner";
import { apiUrl } from "@/config/api";
import ProductCard from "@/components/ProductCard";
import LobsterText from "@/components/form/LobsterText";
import ActionButton from "@/components/form/ActionButton";

interface MenuItem {
  id: number;
  name: string;
  image: string;
  price: string;
  category: string;
}

interface MenuDay {
  id: number;
  establishment_id: number;
  day: string;
  menuItems: MenuItem[];
}

export default function Menu() {
  const [menu, setMenu] = useState<MenuDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>("monday");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

        const data: MenuDay[] = await response.json();
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
    <div className="max-w-7xl mx-auto p-3 grid grid-cols-[1fr_4fr]">
      {/* Lateral com os dias */}
      <div className="mr-6 flex flex-col gap-3">
        {days.map((day) => (
          <button
            key={day.value}
            onClick={() => setSelectedDay(day.value)}
            className={`p-2 rounded-md ${
              selectedDay === day.value ? "bg-gradient-to-tr from-[#FF5800] to-[#FF0000] text-white" : "bg-[#FFFFF0] shadow-[2px_2px_0_0_#FF0000] border-2 border-[#FF0000]"
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>

      {/* Cardápio */}
      <ContentCard>
        {menuForSelectedDay ? (
          <div className="p-4">
            <div className="flex justify-between items-center py-3">
                <LobsterText className="text-2xl font-bold mb-4 capitalize">
                    {days.find((d) => d.value === selectedDay)?.label}
                </LobsterText>
                <h1>79 opções selecionadas</h1>
                <ActionButton onClick={() => {/*abrir modal */}}>Editar</ActionButton>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {menuForSelectedDay.menuItems.map((item) => (
                <ProductCard
                    image={item.image}
                    name={item.name}
                    price={item.price}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 items-center justify-center h-full">
              <p className="text-center text-gray-500">Nenhum item encontrado para este dia.</p>
              <ActionButton onClick={()=>{}}>Adicionar</ActionButton>
          </div>
        )}
      </ContentCard>
    </div>
  );
}