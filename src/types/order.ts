interface IOrder {
    id: number;
    order_date: string;
    pickup_time: string;
    status: string;
    total_price: string;
    user: IUser;
    establishment: IEstablishment;
    orderItems: IOrderItem[];
    created_at: Date
}