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
import OperatingHours from "@/components/establishment/OperatingHours"
import EstablishmentHeader from "@/components/establishment/EstablishmentHeader"

const lobster = Lobster({ subsets: ["latin"], weight: "400" })

export default function VendorDashboard() {
  const [establishment, setEstablishment] = useState<IEstablishment | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [operatingHours, setOperatingHours] = useState<IOperatingHour[]>([])

  useEffect(() => {
    const fetchEstablishment = async () => {
      try {
        setLoading(true);

        const establishmentResponse = await fetch(`${apiUrl}/establishments/by-vendor`, {
          headers: {
            token: `${localStorage.getItem("token")}`,
          },
        });

        if (!establishmentResponse.ok) {
          throw new Error("Erro ao buscar informações do estabelecimento.");
        }

        const establishmentData = await establishmentResponse.json();
        setEstablishment(establishmentData);

        const operatingHoursResponse = await fetch(
          `${apiUrl}/operating-hours/establishment`, {
          headers: {
            token: `${localStorage.getItem("token")}`,
          },
        }
        );

        if (!operatingHoursResponse.ok) {
          throw new Error("Erro ao buscar horários de funcionamento.");
        }

        const operatingHoursData = await operatingHoursResponse.json();
        setOperatingHours(operatingHoursData);
      } catch (error: any) {
        console.error(error);
        setError(error.message || "Erro desconhecido.");
      } finally {
        setLoading(false);
      }
    };

    fetchEstablishment();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    )
  } else if (establishment) {
    return (
      <div className="max-w-7xl mx-auto p-3">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
          <EstablishmentHeader className="col-span-2 md:col-span-1" establishment={establishment} showEditButton={true} />

          <OperatingHours
            operatingHours={operatingHours}
            className="order-4 md:order-2 col-span-2 md:col-span-1"
            showEditButton={true}
          />

          <section className="order-2 md:order-3 col-span-2">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <RedirectLink href="/product" className="py-3">
                <FontAwesomeIcon icon={faBurger} className="text-2xl" />
                <span>Produtos</span>
              </RedirectLink>
              <RedirectLink href="/menu" className="py-3">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-2xl" />
                <span>Cardápio</span>
              </RedirectLink>
              <RedirectLink href="/orders" className="py-3">
                <FontAwesomeIcon icon={faClipboardList} className="text-2xl" />
                <span>Agendamentos</span>
              </RedirectLink>
              <RedirectLink href="/" className="py-3">
                <FontAwesomeIcon icon={faChartLine} className="text-2xl" />
                <span>Relatórios</span>
              </RedirectLink>
            </div>
          </section>

          <Summary className="order-3 md:order-4 col-span-2" />
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>
  }
}
