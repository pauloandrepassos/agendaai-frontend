"use client";

import PrimaryButton from "@/components/form/PrimaryButton";
import SecondaryButton from "@/components/form/SecondaryButton";
import ContentCard from "@/components/layout/ContentCard";
import { translateStatus } from "@/utils/translateStatus";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction } from "react";

interface ModalProps {
    order: IOrder | null;
    isOpen: boolean;
    onClose: Dispatch<SetStateAction<boolean>>;
}

export default function OrderDetailsModal({
    order,
    isOpen,
    onClose,
}: ModalProps) {
    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <ContentCard className="w-full max-w-2xl p-6 shadow-lg m-2">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-primary">
                        Detalhes do Pedido #{order.id}
                    </h2>
                    <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${order.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                    >
                        {translateStatus(order.status)}
                    </span>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        {order.user.image ? (
                            <img
                                src={order.user.image}
                                alt={order.user.name}
                                className="w-16 h-16 object-cover rounded-full border"
                            />
                        ) : (
                            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-white text-3xl">
                                <FontAwesomeIcon icon={faUser}/>
                            </div>
                        )}

                        <div>
                            <p className="text-gray-600">
                                <span className="font-semibold">Cliente:</span> {order.user.name}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-semibold">Contato:</span> {order.user.phone}
                            </p>
                        </div>
                    </div>
                    <p className="text-black-800 font-bold">
                        <span className="font-semibold">Total:</span> R${" "}
                        {parseFloat(order.total_price).toFixed(2)}
                    </p>
                    <h3 className="text-lg font-semibold text-primary">Itens do Pedido:</h3>
                    <ul className="space-y-4 overflow-scroll scrollbar-thin scrollbar-thumb-primary scrollbar-track-gray-200 max-h-60">
                        {order.orderItems.map((item) => (
                            <li key={item.id} className="flex items-start space-x-4">
                                <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="w-12 h-12 object-cover rounded-lg border"
                                />
                                <div className="my-auto">
                                    <p className="text-sm font-semibold text-gray-600">
                                        {item.product.name}
                                    </p>
                                    <p className="font-bold text-gray-800">
                                        Quantidade: {item.quantity}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <SecondaryButton onClick={() => onClose(false)}>Fechar</SecondaryButton>
                <PrimaryButton>Retirar pedido</PrimaryButton>
            </ContentCard>
        </div>
    );
}
