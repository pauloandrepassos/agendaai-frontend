export const weekDays = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
];

export const formatDateWithDay = (day: string) => {
    const today = new Date();
    const currentDayIndex = today.getDay();
    const targetDayIndex = weekDays.indexOf(day);

    const offset = (targetDayIndex - currentDayIndex + 7) % 7;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + offset);

    return new Intl.DateTimeFormat("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(targetDate);
};

export function getNextDayDate(day: string): Date {
    const daysOfWeek: Record<string, number> = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
    };

    const today = new Date();
    const todayDayOfWeek = today.getDay();
    const targetDayOfWeek = daysOfWeek[day.toLowerCase()];

    if (targetDayOfWeek === undefined) {
        throw new Error("O dia informado é inválido. Use um dia válido como 'sunday', 'monday', etc.");
    }

    if (targetDayOfWeek === todayDayOfWeek) {
        return today;
    }

    const daysUntilNextDay = (targetDayOfWeek - todayDayOfWeek + 7) % 7;
    const nextDayDate = new Date(today);
    nextDayDate.setDate(today.getDate() + daysUntilNextDay);

    return nextDayDate;
}