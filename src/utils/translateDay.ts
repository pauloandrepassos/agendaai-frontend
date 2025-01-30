export function translateDayOfWeek(day: string): string {
    const days: Record<string, string> = {
        "sunday": "Domingo",
        "monday": "Segunda-feira",
        "tuesday": "Terça-feira",
        "wednesday": "Quarta-feira",
        "thursday": "Quinta-feira",
        "friday": "Sexta-feira",
        "saturday": "Sábado"
    };

    return days[day] || "Dia inválido";
}