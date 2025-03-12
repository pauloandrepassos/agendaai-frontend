import { useState } from "react";
import LobsterText from "@/components/form/LobsterText";
import PrimaryButton from "@/components/form/PrimaryButton";
import SecondaryButton from "@/components/form/SecondaryButton";
import ContentCard from "@/components/layout/ContentCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { apiUrl } from "@/config/api";
import axios from "axios";

interface ProductModalProps {
    isVisible: boolean;
    onClose: () => void;
    product: IProduct;
    establishmentId: number;
    menuId: number;
    orderDate: Date;
    quantityInBasket?: number
    onError: (title: string, message?: string) => void;
    onAddToBasket: (addedQuantity: number) => void;
}

export default function ProductModal({
    isVisible,
    onClose,
    product,
    establishmentId,
    menuId,
    orderDate,
    quantityInBasket = 0,
    onError,
    onAddToBasket
}: ProductModalProps) {
    const [quantity, setQuantity] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    if (!isVisible) return null;

    const incrementQuantity = () => setQuantity((prev) => prev + 1);

    const decrementQuantity = () => {
        if (quantity > 1) setQuantity((prev) => prev - 1);
    };

    const formatLocalDate = (date: Date) => {
        const pad = (num: number) => num.toString().padStart(2, '0');
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };

    const addToBasket = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            localStorage.setItem("redirectUrl", window.location.pathname);
            window.location.href = "/auth/login";
            return;
        }
        setIsLoading(true);
        try {
            const response = await axios.post(`${apiUrl}/shopping-basket/items`, {
                establishmentId,
                productId: product.id,
                quantity,
                menuId,
                orderDate: formatLocalDate(orderDate)
            }, {
                headers: {
                    token: `${localStorage.getItem("token")}`
                }
            });
            console.log("Item adicionado ao cesto:", response.data);
            onAddToBasket(quantity);
            const basketUpdatedEvent = new CustomEvent("basketUpdated");
            window.dispatchEvent(basketUpdatedEvent);
            setQuantity(1);
            onClose();
        } catch (error: any) {
            console.error("Erro ao adicionar item ao cesto:", error);
            setQuantity(1);
            onClose();
            onError("Erro ao adicionar item", error.response?.data?.message || "Erro desconhecido");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <ContentCard className="p-6 w-11/12 max-w-2xl flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <img
                        src={product.image}
                        alt={`Imagem do ${product.name}`}
                        className="w-full h-40 object-cover rounded m-auto"
                    />
                    <div className="flex flex-col gap-4 justify-center">
                        <LobsterText className="text-3xl text-center text-primary">
                            {product.name}
                        </LobsterText>

                        <p className="text-gray-600">{product.description}</p>

                        <p className="mt-2 flex justify-between">
                            <span>Preço (unidade):</span>
                            <span className="font-semibold">R$ {product.price}</span>
                        </p>

                        <div className="flex justify-center items-center gap-2">
                            <button
                                className="p-2 bg-secondary text-white rounded-full h-12 w-12 hover:bg-primary disabled:opacity-50"
                                onClick={decrementQuantity}
                                disabled={quantity <= 1}
                            >
                                <FontAwesomeIcon icon={faMinus} />
                            </button>
                            <span className="text-lg font-semibold">{quantity}</span>
                            <button
                                className="p-2 bg-secondary text-white rounded-full h-12 w-12 hover:bg-primary disabled:opacity-50"
                                onClick={incrementQuantity}
                                disabled={quantity + quantityInBasket >= 5}
                            >
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                        </div>
                        {quantity + quantityInBasket >= 5 && (
                            <div className="text-xs text-primary font-bold">
                                {quantityInBasket > 0 && <p>Você já possui {quantityInBasket} itens no cesto de compras.</p>}
                                <p>No momento voce está limitado a pedir uma quantidade máxima de 5 itens no total.</p>
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 col-span-1 sm:col-span-2">
                        <SecondaryButton onClick={() => {
                            setQuantity(1);
                            onClose();
                        }}>Cancelar</SecondaryButton>
                        <PrimaryButton onClick={addToBasket} isLoading={isLoading}>
                            {isLoading ? "Adicionando..." : "Adicionar ao cesto"}
                        </PrimaryButton>
                    </div>
                </div>
            </ContentCard>
        </div>
    );
}
