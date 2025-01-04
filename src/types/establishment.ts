import { IAddress } from "./address"
import { IUser } from "./user"

interface IEstablishment {
    id: number
    name: string
    logo: string
    background_image: string
    cnpj: string
    vendor_id: IUser
    address_id: IAddress
}