interface IOperatingHour {
    id: number
    day_of_week: string
    open_time: string | null
    close_time: string | null
    is_closed: boolean
}