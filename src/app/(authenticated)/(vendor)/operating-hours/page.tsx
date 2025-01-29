"use client"

import LobsterText from "@/components/form/LobsterText";
import { apiUrl } from "@/config/api";
import axios from "axios";
import { useEffect, useState } from "react";

export enum Day {
    Sunday = 'sunday',
    Monday = 'monday',
    Tuesday = 'tuesday',
    Wednesday = 'wednesday',
    Thursday = 'thursday',
    Friday = 'friday',
    Saturday = 'saturday',
}

type OperatingHour = {
    id?: number;
    day_of_week: Day;
    open_time: string | null;
    close_time: string | null;
    is_closed: boolean;
    establishment_id: number;
};

const dayOptions = Object.entries(Day).map(([key, value]) => ({
    label: key,
    value,
}));

export default function OperatingHoursPage() {
    const [operatingHours, setOperatingHours] = useState<OperatingHour[]>([]);
    const [selectedDay, setSelectedDay] = useState<Day>(Day.Monday);
    const [openTime, setOpenTime] = useState<string>('');
    const [closeTime, setCloseTime] = useState<string>('');
    const [isClosed, setIsClosed] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function fetchOperatingHours() {
            try {
                const response = await axios.get(`${apiUrl}/operating-hours/establishment/17`);
                setOperatingHours(response.data);
            } catch (error) {
                console.error('Erro ao carregar horários:', error);
            }
        }
        fetchOperatingHours();
    }, []);

    async function handleSave() {
        const newOperatingHour: OperatingHour = {
            day_of_week: selectedDay,
            open_time: isClosed ? null : openTime,
            close_time: isClosed ? null : closeTime,
            is_closed: isClosed,
            establishment_id: 17,
        };

        try {
            setLoading(true);
            const response = await axios.post(`${apiUrl}/operating-hours`, newOperatingHour);
            setOperatingHours([...operatingHours, response.data]);
        } catch (error) {
            console.error('Erro ao salvar horário:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-6">
            <div className="">
                <div className="mb-4">
                    <LobsterText className="text-2xl font-bold text-primary">Gerenciar Horários de Funcionamento</LobsterText>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <select
                            value={selectedDay}
                            onChange={(e) => setSelectedDay(e.target.value as Day)}
                            className="w-48 border rounded px-2 py-1"
                        >
                            <option value="" disabled>
                                Selecione o dia
                            </option>
                            {dayOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {!isClosed && (
                            <>
                                <input
                                    type="time"
                                    value={openTime}
                                    onChange={(e) => setOpenTime(e.target.value)}
                                    className="border rounded px-2 py-1"
                                    placeholder="Hora de abertura"
                                />
                                <input
                                    type="time"
                                    value={closeTime}
                                    onChange={(e) => setCloseTime(e.target.value)}
                                    className="border rounded px-2 py-1"
                                    placeholder="Hora de fechamento"
                                />
                            </>
                        )}
                        <button
                            onClick={() => setIsClosed(!isClosed)}
                            className={`px-4 py-2 rounded ${isClosed ? 'border border-gray-400' : 'bg-blue-500 text-white'
                                }`}
                        >
                            {isClosed ? 'Fechado' : 'Aberto'}
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className={`px-4 py-2 rounded ${loading ? 'bg-gray-400' : 'bg-green-500 text-white'}`}
                        >
                            {loading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                    <div className="mt-6">
                        <h2 className="text-xl font-bold mb-4">Horários Cadastrados</h2>
                        {operatingHours.map((hour) => (
                            <div
                                key={hour.id}
                                className="border p-4 rounded mb-2 flex justify-between items-center"
                            >
                                <span>
                                    {hour.day_of_week}:{' '}
                                    {hour.is_closed ? 'Fechado' : `${hour.open_time} - ${hour.close_time}`}
                                </span>
                                <button
                                    className="px-2 py-1 border border-gray-400 rounded text-gray-700 hover:bg-gray-100"
                                >
                                    Editar
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}