"use client"
import { useEffect, useState } from "react";
import ContentCard from "../layout/ContentCard";
import RedirectLink from "../form/RedirectLink";
import LobsterText from "../form/LobsterText";

interface OperatingHoursProps {
    className?: string;
    operatingHours: IOperatingHour[];
    showEditButton?: boolean
}

const dayOfWeekMap: Record<string, string> = {
    sunday: "Domingo",
    monday: "Segunda",
    tuesday: "Terça",
    wednesday: "Quarta",
    thursday: "Quinta",
    friday: "Sexta",
    saturday: "Sábado",
};

export default function OperatingHours({ className, operatingHours, showEditButton }: OperatingHoursProps) {
    const [currentDate, setCurrentDate] = useState<string>("")

    useEffect(() => {
        const today = new Date()
        const formattedDate = today.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
        setCurrentDate(formattedDate)
    }, [operatingHours])

    const groupedHours = operatingHours.reduce<Record<string, IOperatingHour[]>>((acc, hour) => {
        if (!acc[hour.day_of_week]) {
            acc[hour.day_of_week] = [];
        }
        acc[hour.day_of_week].push(hour);
        return acc;
    }, {});

    return (
        <ContentCard className={`p-4 ${className}`}>
            {operatingHours.length === 0 ? (
                showEditButton ? (
                    <div className="flex flex-col gap-3 items-center justify-center h-full">
                        <p className="text-center text-gray-700 text-sm">Sem horários registrados. Acesse o gerenciamento de horários para configurá-los.</p>
                        <RedirectLink href="/operating-hours">Gerenciar horários</RedirectLink>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 items-center justify-center h-full">
                        <p className="text-center text-gray-700 text-sm">Sem horários registrados.</p>
                    </div>
                )
            ) : (
                <div className="grid gap-2 h-full">
                    <div className="flex justify-between items-center">
                        <LobsterText className="text-xl text-primary">Horários:</LobsterText>
                        {showEditButton && (
                            <RedirectLink href="/operating-hours">Editar</RedirectLink>
                        )}
                    </div>
                    {Object.entries(groupedHours).map(([day, hours]) => {
                        const isDayClosed = hours.some((hour) => hour.is_closed);

                        return (
                            <div key={day} className="grid grid-cols-[1fr_3fr] gap-2">
                                <span
                                    className={`flex items-center justify-center text-white text-center rounded-full ${isDayClosed ? "bg-primary" : "bg-secondary"
                                        }`}
                                >
                                    {dayOfWeekMap[day]}
                                </span>
                                <div className="flex flex-wrap items-center gap-2">
                                    {hours.map((hour, index) => (
                                        <span key={hour.id}>
                                            {hour.is_closed
                                                ? "Fechado"
                                                : `${hour.open_time?.slice(0, 5)} - ${hour.close_time?.slice(0, 5)}`}
                                            {index < hours.length - 1 && " | "}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </ContentCard>
    );
}