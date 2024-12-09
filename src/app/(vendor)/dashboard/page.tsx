"use client"

import { useEffect, useState } from "react"
import Summary from "@/components/establishment/Summary"
import { Lobster } from "next/font/google"
import { apiUrl } from "@/config/api"
import Loading from "@/components/form/LoadingSpinner"

const lobster = Lobster({ subsets: ["latin"], weight: "400" })

interface Establishment {
  id: number
  name: string
  logo: string
  background_image: string
}

export default function VendorDashboard() {
  const [establishment, setEstablishment] = useState<Establishment | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEstablishment = async () => {
      try {
        const response = await fetch(`${apiUrl}/establishments/by-vendor`, {
          headers: {
            token: `${localStorage.getItem("token")}`,
          },
        })

        if (!response.ok) {
          throw new Error("Erro ao buscar informações do estabelecimento.")
        }

        const data = await response.json()
        setEstablishment(data)
      } catch (error: any) {
        console.error(error)
        setError(error.message || "Erro desconhecido.")
      } finally {
        setLoading(false)
      }
    }

    fetchEstablishment()
  }, [])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {establishment && (
        <section className="bg-[#FFFFF0] shadow-[4px_4px_0_0_#FA240F] rounded-2xl overflow-hidden mb-5">
          <div className="relative">
            <img
              src={establishment.background_image}
              alt={`${establishment.name} Background`}
              className="max-h-[150px] w-full object-cover"
            />
            <img
              src={establishment.logo}
              alt={`${establishment.name} Logo`}
              className="h-[80px] rounded-full absolute bottom-[-40px] left-[5%] sm:left-[10%]"
            />
          </div>
          <h1
            className={`text-4xl text-[#FF0000] text-center font-bold my-4 ${lobster.className}`}
          >
            {establishment.name}
          </h1>
        </section>
      )}

      <Summary />
    </div>
  )
}
