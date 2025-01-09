interface IOrder {
    id: number;
    order_date: string;
    status: string;
    total_price: string;
    user: IUser;
    orderItems: IOrderItem[];
}