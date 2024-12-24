"use client"

import { useEffect, useState } from "react"
import Summary from "@/components/establishment/Summary"
import { Lobster } from "next/font/google"
import { apiUrl } from "@/config/api"
import Loading from "@/components/form/LoadingSpinner"
import RedirectLink from "@/components/form/RedirectLink"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBurger, faCalendar, faCalendarAlt, faChartLine, faClipboardList, faLocationDot } from "@fortawesome/free-solid-svg-icons"
import ContentCard from "@/components/layout/ContentCard"

const lobster = Lobster({ subsets: ["latin"], weight: "400" })

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
  id: number
  name: string
  logo: string
  background_image: string
  address: Address
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
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    )
  } else if (establishment) {
    return (
      <div className="max-w-7xl mx-auto p-3">
        <div className="">
          <ContentCard className="overflow-hidden mb-5">
            <div>
              <img
                src={establishment.background_image}
                alt={`${establishment.name} Background`}
                className="max-h-[100px] sm:max-h-[150px] w-full object-cover"
              />
              <img
                src={establishment.logo}
                alt={`${establishment.name} Logo`}
                className="h-[80px] rounded-full mt-[-40px] ml-[5%] sm:ml-[10%]"
              />
            </div>
            <h1
              className={`text-4xl text-[#FF0000] text-center font-bold mt-[-20px]`}
            >
              {establishment.name}
            </h1>
            <div className="grid grid-cols-2 my-4">
              <div className="text-center flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faLocationDot} />
                <div>
                  <p>
                    {establishment.address.street}, {establishment.address.number}
                  </p>
                  <p>
                    {establishment.address.neighborhood}, {establishment.address.city} - {establishment.address.state}
                  </p>
                  <p>CEP: {establishment.address.zip_code}</p>
                </div>
              </div>
              <div>
                <p>Descrição:</p>
                <p>Um espaço acolhedor com opções de lanches variados, bebidas refrescantes e um ambiente perfeito para relaxar ou se reunir com amigos</p>
              </div>
            </div>
          </ContentCard>
        </div>

        <section className="mb-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <RedirectLink href="/product">
              <FontAwesomeIcon icon={faBurger} className="text-2xl" />
              <span>Produtos</span>
            </RedirectLink>
            <RedirectLink href="/">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-2xl" />
              <span>Cardápio</span>
            </RedirectLink>
            <RedirectLink href="/">
              <FontAwesomeIcon icon={faClipboardList} className="text-2xl" />
              <span>Agendamentos</span>
            </RedirectLink>
            <RedirectLink href="/">
              <FontAwesomeIcon icon={faChartLine} className="text-2xl" />
              <span>Relatórios</span>
            </RedirectLink>
          </div>
        </section>

        <Summary />

      </div>

    )
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>
  }
}
