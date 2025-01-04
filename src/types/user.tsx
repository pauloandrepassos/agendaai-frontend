export enum UserType {
    CLIENT = "client",
    VENDOR = "vendor",
    ADMIN = "admin",
}

export interface IUser {
    id: number
    name: string
    cpf: string
    email: string
    password: string
    phone: string
    image: string | null
    user_type: UserType
}