"use client"
import { useEffect, useState } from "react"
import RedirectLink from "../form/RedirectLink"
import ContentCard from "../layout/ContentCard"
import { apiUrl } from "@/config/api"

interface OperatingHoursProps {
    className?: string
    establishmentId: number
}

interface OperatingHour {
    id: number
    day_of_week: string
    open_time: string | null
    close_time: string | null
    is_closed: boolean
}

const dayOfWeekMap: Record<string, string> = {
    sunday: "Domingo",
    monday: "Segunda",
    tuesday: "Terça",
    wednesday: "Quarta",
    thursday: "Quinta",
    friday: "Sexta",
    saturday: "Sábado",
}

export default function OperatingHours({ className, establishmentId }: OperatingHoursProps) {
    const [operatingHours, setOperatingHours] = useState<Record<string, OperatingHour[]>>({})
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [currentDate, setCurrentDate] = useState<string>("")

    useEffect(() => {
        // Formatar e definir a data atual
        const today = new Date()
        const formattedDate = today.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
        setCurrentDate(formattedDate)

        // Buscar horários de funcionamento
        const fetchOperatingHours = async () => {
            try {
                const response = await fetch(
                    `${apiUrl}/operating-hours/establishment/${establishmentId}`
                )
                if (!response.ok) {
                    throw new Error("Erro ao buscar horários de funcionamento.")
                }
                const data: OperatingHour[] = await response.json()

                // Agrupa os horários por dia da semana
                const groupedHours = data.reduce<Record<string, OperatingHour[]>>((acc, hour) => {
                    if (!acc[hour.day_of_week]) {
                        acc[hour.day_of_week] = []
                    }
                    acc[hour.day_of_week].push(hour)
                    return acc
                }, {})

                setOperatingHours(groupedHours)
            } catch (error: any) {
                console.error(error)
                setError(error.message || "Erro desconhecido.")
            } finally {
                setLoading(false)
            }
        }

        fetchOperatingHours()
    }, [establishmentId])

    if (error) {
        return <div className="text-center text-red-500">{error}</div>
    }

    return (
        <ContentCard className={`mb-5 p-3 ${className}`}>
            {loading ? (
                <div className="text-center">Carregando horários...</div>
            ) : (
                <div>
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold mb-3">Horários</h2>
                        <RedirectLink href="/">Editar</RedirectLink>
                    </div>
                    <div className="mb-3">
                        <p>
                            <span className="font-semibold">DATA ATUAL:</span>{" "}
                            <span>{currentDate}</span>
                        </p>
                    </div>
                    <div className="grid gap-2">
                        {Object.entries(operatingHours).map(([day, hours]) => (
                            <div key={day} className="grid grid-cols-[1fr_3fr] gap-2">
                                <p className="bg-primary text-white text-center rounded-full">
                                    {dayOfWeekMap[day]}
                                </p>
                                <p>
                                    {hours.every((hour) => hour.is_closed)
                                        ? "Fechado"
                                        : hours
                                              .map(
                                                  (hour) =>
                                                      `${hour.open_time?.slice(0, 5)} - ${hour.close_time?.slice(0, 5)}`
                                              )
                                              .join(" | ")}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </ContentCard>
    )
}
