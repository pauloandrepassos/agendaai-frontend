"use client";

import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import axios from "axios";
import { apiUrl } from "@/config/api";
import { translateDayOfWeek } from "@/utils/translateDay";
import SecondaryButton from "@/components/form/SecondaryButton";
import PrimaryButton from "@/components/form/PrimaryButton";
import ContentCard from "@/components/layout/ContentCard";
import Loading from "@/components/form/LoadingSpinner";
import LobsterText from "@/components/form/LobsterText";
import PrimaryTitle from "@/components/form/title/PrimaryTitle";

enum Day {
    Sunday = "sunday",
    Monday = "monday",
    Tuesday = "tuesday",
    Wednesday = "wednesday",
    Thursday = "thursday",
    Friday = "friday",
    Saturday = "saturday",
}

const daysOfWeek = Object.entries(Day).map(([label, value]) => ({ label, value }));

type OperatingHour = {
    id?: number;
    day_of_week: Day;
    open_time: string | null;
    close_time: string | null;
    is_closed: boolean;
};

export default function OperatingHoursPage() {
    const [operatingHours, setOperatingHours] = useState<OperatingHour[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingRequest, setLoadingRequest] = useState(false);

    // Cria um array padrão com todos os dias da semana, marcados como fechados
    const defaultOperatingHours: OperatingHour[] = daysOfWeek.map(({ value }) => ({
        day_of_week: value as Day,
        open_time: null,
        close_time: null,
        is_closed: true,
    }));

    useEffect(() => {
        async function fetchOperatingHours() {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("Token não encontrado.");
                    return;
                }

                const response = await axios.get(`${apiUrl}/operating-hours/establishment`, {
                    headers: { token: `${token}` },
                });

                // Mescla os dados da API com o array padrão
                const mergedHours = defaultOperatingHours.map((defaultHour) => {
                    const apiHour = response.data.find((hour: OperatingHour) => hour.day_of_week === defaultHour.day_of_week);
                    return apiHour ? apiHour : defaultHour;
                });

                setOperatingHours(mergedHours);
            } catch (error) {
                console.error("Erro ao carregar horários:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchOperatingHours();
    }, []);

    async function handleSave() {
        try {
            setLoadingRequest(true);
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Token não encontrado.");
                return;
            }

            const formattedHours = operatingHours.map((hour) => ({
                ...hour,
                open_time: hour.open_time && hour.open_time.length === 5 ? `${hour.open_time}:00` : hour.open_time,
                close_time: hour.close_time && hour.close_time.length === 5 ? `${hour.close_time}:00` : hour.close_time,
            }));

            await axios.post(
                `${apiUrl}/operating-hours`,
                { hours: formattedHours },
                { headers: { token: `${token}` } }
            );

            alert("Horários salvos com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar horário:", error);
        } finally {
            setLoadingRequest(false);
        }
    }

    function toggleDay(index: number) {
        setOperatingHours((prev) =>
            prev.map((hour, i) =>
                i === index
                    ? { ...hour, is_closed: !hour.is_closed, open_time: null, close_time: null }
                    : hour
            )
        );
    }

    function updateTime(index: number, field: "open_time" | "close_time", value: string) {
        setOperatingHours((prev) =>
            prev.map((hour, i) => (i === index ? { ...hour, [field]: value } : hour))
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loading />
            </div>
        );
    }

    return (
        <div className="p-6 bg-cream min-h-screen flex flex-col items-center">
            <PrimaryTitle>Gerenciar horários:</PrimaryTitle>
            <ContentCard className="w-full max-w-2xl p-5">
                {operatingHours.map((hour, index) => (
                    <div key={hour.day_of_week} className="grid grid-cols-1 sm:grid-cols-2 items-center gap-3 mb-3 pb-3 border-b border-b-gray-300 sm:border-b-0">
                        <div className="grid grid-cols-[4fr_1fr]">
                            <span className="font-medium">{translateDayOfWeek(hour.day_of_week)}</span>
                            <div className="flex items-center gap-3">
                                <Switch
                                    checked={!hour.is_closed}
                                    onChange={() => toggleDay(index)}
                                    className={`${hour.is_closed ? "bg-gray-300" : "bg-primary"
                                        } relative inline-flex h-6 w-11 items-center rounded-full`}
                                >
                                    <span className="sr-only">{hour.is_closed ? "Fechado" : "Aberto"}</span>
                                    <span
                                        className={`${hour.is_closed ? "translate-x-1" : "translate-x-6"
                                            } inline-block h-4 w-4 transform bg-white rounded-full transition`}
                                    />
                                </Switch>
                                <span className="text-sm w-20">{hour.is_closed ? "Fechado" : "Aberto"}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 items-center">
                            <input
                                type="time"
                                value={hour.open_time ? hour.open_time.slice(0, 5) : ""}
                                onChange={(e) => updateTime(index, "open_time", e.target.value)}
                                disabled={hour.is_closed}
                                className="border p-1 rounded text-center disabled:bg-gray-100"
                            />
                            <span className="text-sm text-center">até às</span>
                            <input
                                type="time"
                                value={hour.close_time ? hour.close_time.slice(0, 5) : ""}
                                onChange={(e) => updateTime(index, "close_time", e.target.value)}
                                disabled={hour.is_closed}
                                className="border p-1 rounded text-center disabled:bg-gray-100"
                            />
                        </div>
                    </div>
                ))}
                <div className="flex justify-end gap-4 mt-6">
                    <SecondaryButton onClick={() => window.location.reload()}>Cancelar</SecondaryButton>
                    <PrimaryButton onClick={handleSave} isLoading={loadingRequest}>Salvar</PrimaryButton>
                </div>
            </ContentCard>
        </div>
    );
}