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
                <p>Sem horários disponíveis</p>
            ) : (
                <div className="grid gap-2">
                    <div className="flex justify-between items-center">
                        <LobsterText className="text-xl text-primary">Horários:</LobsterText>
                        {showEditButton && (
                            <RedirectLink href="/">Editar</RedirectLink>
                        )}
                    </div>
                    {Object.entries(groupedHours).map(([day, hours]) => (
                        <div key={day} className="grid grid-cols-[1fr_3fr] gap-2">
                            <span className="bg-secondary text-white text-center rounded-full">
                                {dayOfWeekMap[day]}
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {hours
                                    .map((hour, index) => (
                                        <span key={hour.id}>
                                            {hour.is_closed
                                                ? "Fechado"
                                                : `${hour.open_time?.slice(0, 5)} - ${hour.close_time?.slice(0, 5)}`}
                                            {index < hours.length - 1 && " | "}
                                        </span>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </ContentCard>
    );
}
