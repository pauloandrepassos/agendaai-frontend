export const getDayString = (): string => {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const today = new Date().getDay()
    return days[today]
}

export const getNextDayString = (): string => {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const today = new Date().getDay();
    const nextDayIndex = (today + 1) % 7;
    return days[nextDayIndex];
};

export const getDayOfWeek = (dateStr: string): string => {
    const date = new Date(dateStr);
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    return days[date.getDay()];
};

export const isBeforeCutoffTime = (): boolean => {
    const now = new Date();
    const cutoffHour = 14; // 14:00 horas
    return now.getHours() < cutoffHour;
};