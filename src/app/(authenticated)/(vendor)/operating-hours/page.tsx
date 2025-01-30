"use client";

import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import axios from "axios";
import { apiUrl } from "@/config/api";
import { translateDayOfWeek } from "@/utils/translateDay";
import SecondaryButton from "@/components/form/SecondaryButton";
import PrimaryButton from "@/components/form/PrimaryButton";

export enum Day {
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
    const establishmentId = 17; // ID do estabelecimento
    const [operatingHours, setOperatingHours] = useState<OperatingHour[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchOperatingHours() {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("Token não encontrado.");
                    return;
                }

                const response = await axios.get(`${apiUrl}/operating-hours/establishment/${establishmentId}`, {
                    headers: { token: `${token}` },
                });

                if (response.data.length === 0) {
                    setOperatingHours(
                        daysOfWeek.map(({ value }) => ({
                            day_of_week: value as Day,
                            open_time: "",
                            close_time: "",
                            is_closed: true,
                        }))
                    );
                } else {
                    setOperatingHours(response.data);
                }
            } catch (error) {
                console.error("Erro ao carregar horários:", error);
            }
        }
        fetchOperatingHours();
    }, []);

    async function handleSave() {
        try {
            setLoading(true);
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
                { establishment_id: establishmentId, hours: formattedHours },
                { headers: { token: `${token}` } }
            );

            alert("Horários salvos com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar horário:", error);
        } finally {
            setLoading(false);
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

    return (
        <div className="p-6 bg-cream min-h-screen flex flex-col items-center">
            <h2 className="text-2xl font-bold text-primary mb-6">Gerenciar Horários de Funcionamento</h2>
            <div className="w-full max-w-2xl bg-white shadow-md p-6 rounded-md">
                {operatingHours.map((hour, index) => (
                    <div key={hour.day_of_week} className="grid grid-cols-2 items-center gap-4 mb-2">
                        <div className="grid grid-cols-[4fr_1fr]">
                            <span className="font-medium">{translateDayOfWeek(hour.day_of_week)}</span>
                            <div className="flex items-center gap-3">
                                <Switch
                                    checked={!hour.is_closed}
                                    onChange={() => toggleDay(index)}
                                    className={`${
                                        hour.is_closed ? "bg-gray-300" : "bg-primary"
                                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                                >
                                    <span className="sr-only">{hour.is_closed ? "Fechado" : "Aberto"}</span>
                                    <span
                                        className={`${
                                            hour.is_closed ? "translate-x-1" : "translate-x-6"
                                        } inline-block h-4 w-4 transform bg-white rounded-full transition`}
                                    />
                                </Switch>
                                <span className="text-sm w-20">{hour.is_closed ? "Fechado" : "Aberto"}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-3">
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
                    <SecondaryButton onClick={()=>window.location.reload()}>Cancelar</SecondaryButton>
                    <PrimaryButton onClick={handleSave}>Salvar</PrimaryButton>
                </div>
            </div>
        </div>
    );
}
