export interface IAddress {
    id: number
    zip_code: string
    state: string
    city: string
    neighborhood: string
    street: string
    number: string
    complement?: string
    reference_point?: string
}