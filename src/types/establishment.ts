interface IEstablishment {
    id: number
    description: string
    name: string
    logo: string
    background_image: string
    cnpj: string
    vendor_id: IUser
    address_id: IAddress
    address: IAddress;
    order_deadline_time: string;
    cancellation_deadline_time: string;
}