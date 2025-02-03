"use client"

import { useEffect, useState } from "react"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { apiUrl } from "@/config/api"
import EstablishmentCard from "@/components/EstablishmentCard"
import SearchBar from "@/components/form/SearchBar"
import LobsterText from "@/components/form/LobsterText"
import Loading from "@/components/form/LoadingSpinner"
import Title from "@/components/form/title/PrimaryTitle"

interface Establishment {
  id: number
  name: string
  logo: string
  background_image: string
  cnpj: string
  vendor: {
    id: number
    name: string
    cpf: string
    email: string
    phone: string
    image: string | null
    user_type: string
    created_at: string
    updated_at: string
  }
  address: {
    id: number
    zip_code: string
    state: string
    city: string
    neighborhood: string
    street: string
    number: string
    complement: string
    reference_point: string
    created_at: string
    updated_at: string
  }
  created_at: string
  updated_at: string
}

export default function Home() {
  const [establishments, setEstablishments] = useState<Establishment[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEstablishments = async () => {
      try {
        const response = await fetch(`${apiUrl}/establishments`, {
          headers: {
            token: `${localStorage.getItem("token")}`,
          },
        })

        if (!response.ok) {
          throw new Error("Erro ao buscar estabelecimentos.")
        }

        const data = await response.json()
        setEstablishments(data)
      } catch (error) {
        console.error(error)
        setError(`Não foi possível carregar os estabelecimentos. ${error}`)
      } finally {
        setLoading(false)
      }
    }

    fetchEstablishments()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    )
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-5">
        <SearchBar placeholder="Pesquisar..."/>
      </div>
      <Title>Estabelecimentos disponíveis:</Title>
      {establishments.length === 0 ? (
        <p className="text-center">Nenhum estabelecimento encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {establishments.map((establishment) => (
            <EstablishmentCard key={establishment.id} establishment={establishment}/>
          ))}
        </div>
      )}
    </div>
  )
}
