"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/config/api";
import Loading from "@/components/form/LoadingSpinner";
import EstablishmentHeader from "@/components/establishment/EstablishmentHeader";
import { useParams } from "next/navigation";

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

  useEffect(() => {
    if (!id) return;

    const fetchEstablishment = async () => {
      try {
        const response = await fetch(`${apiUrl}/establishments/${id}`, {
          headers: {
            token: `${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar informações do estabelecimento.");
        }

        const data = await response.json();
        setEstablishment(data);
      } catch (error: any) {
        console.error(error);
        setError(error.message || "Erro desconhecido.");
      } finally {
        setLoading(false);
      }
    };

    fetchEstablishment();
  }, [id]);

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
        <EstablishmentHeader establishment={establishment} showEditButton={false} />
        {/* Outros componentes relacionados ao estabelecimento */}
      </div>
    );
  }

  return null;
}