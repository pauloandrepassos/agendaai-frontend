export const getDayString = (): string => {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const today = new Date().getDay()
    return days[today]
}

export const getDayOfWeek = (dateStr: string): string => {
    const date = new Date(dateStr);
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    return days[date.getDay()];
};