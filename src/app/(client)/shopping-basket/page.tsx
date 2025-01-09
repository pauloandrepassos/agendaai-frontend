"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/config/api";
import ContentCard from "@/components/layout/ContentCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTrash, faSpinner } from "@fortawesome/free-solid-svg-icons";
import PrimaryButton from "@/components/form/PrimaryButton";
import SecondaryButton from "@/components/form/SecondaryButton";
import Link from "next/link";
import Loading from "@/components/form/LoadingSpinner";
import ConfirmModal from "@/components/ConfirmModal";
import { useRouter } from "next/navigation";

interface ShoppingBasketItem {
    id: number;
    product: IProduct;
    quantity: number;
}

interface ShoppingBasketResponse {
    id: number;
    establishment: IEstablishment;
    menu: IMenuDay;
    total_price: string;
    shoppingBasketItems: ShoppingBasketItem[];
}

interface ConfirmModalProps {
    title: string;
    onClose: () => void;
    onConfirm: () => void;
    isVisible: boolean;
    textButton?: string;
    loading?: boolean;
}

export default function ShoppingBasket() {
    const [basketItems, setBasketItems] = useState<ShoppingBasketItem[]>([]);
    const [totalPrice, setTotalPrice] = useState<string>("0.00");
    const [establishment, setEstablishment] = useState<IEstablishment | null>(null);
    const [menu, setMenu] = useState<IMenuDay>();
    const [error, setError] = useState<string | null>(null);
    const [loadingItemId, setLoadingItemId] = useState<number | null>(null);
    const router = useRouter()

    const [loading, setLoading] = useState(true);
    const [confirmModalProps, setConfirmModalProps] = useState<ConfirmModalProps | null>(null);

    const fetchShoppingBasket = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${apiUrl}/shopping-basket/items`, {
                headers: {
                    token: `${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                if (response.status === 404) {
                    setBasketItems([]);
                    setTotalPrice("0.00");
                    setEstablishment(null);
                    return;
                }
                throw new Error("Erro ao carregar o cesto de compras.");
            }

            const data: ShoppingBasketResponse = await response.json();
            setBasketItems(data.shoppingBasketItems);
            setTotalPrice(data.total_price);
            setEstablishment(data.establishment);
            setMenu(data.menu);
        } catch (err) {
            setError("Não foi possível carregar o cesto de compras. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const updateItemQuantity = async (itemId: number, productId: number) => {
        setLoadingItemId(itemId);
        try {
            const response = await fetch(`${apiUrl}/shopping-basket/items`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    token: `${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ establishmentId: establishment?.id, productId, quantity: 1, menuId: menu?.id }),
            });

            if (!response.ok) {
                throw new Error("Erro ao atualizar item.");
            }

            const basketUpdatedEvent = new CustomEvent("basketUpdated");
            window.dispatchEvent(basketUpdatedEvent);

            await fetchShoppingBasket();
        } catch (err) {
            console.error("Erro ao atualizar quantidade do item:", err);
        } finally {
            setLoadingItemId(null);
        }
    };

    const removeItem = async (itemId: number) => {
        setLoadingItemId(itemId);
        try {
            const response = await fetch(`${apiUrl}/shopping-basket/items/${itemId}`, {
                method: "DELETE",
                headers: {
                    token: `${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                throw new Error("Erro ao remover item.");
            }

            const basketUpdatedEvent = new CustomEvent("basketUpdated");
            window.dispatchEvent(basketUpdatedEvent);

            await fetchShoppingBasket();
        } catch (err) {
            console.error("Erro ao remover item:", err);
        } finally {
            setLoadingItemId(null);
        }
    };

    const cancelOrder = async () => {
        try {
            setConfirmModalProps((prevProps) => {
                if (!prevProps) {
                    return null;
                }
                return {
                    ...prevProps,
                    loading: true,
                };
            });
            console.log("ID do estabelecimento:", establishment?.id);

            const response = await fetch(`${apiUrl}/shopping-basket/confirm`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    token: `${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ idEstablishment: establishment?.id }),
            });

            if (!response.ok) {
                throw new Error("Erro ao cancelar pedido.");
            }

            const basketUpdatedEvent = new CustomEvent("basketUpdated");
            window.dispatchEvent(basketUpdatedEvent);

            await router.push("/")
        } catch (err) {
            console.error("Erro ao cancelar pedido:", err);
        }
    };

    const finalizeOrder = async () => {
        try {
            setConfirmModalProps((prevProps) => {
                if (!prevProps) {
                    return null;
                }
                return {
                    ...prevProps,
                    loading: true,
                };
            });
            const response = await fetch(`${apiUrl}/shopping-basket/confirm`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", 
                    token: `${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ idEstablishment: establishment?.id }),
            });

            if (!response.ok) {
                throw new Error("Erro ao finalizar pedido.");
            }

            const basketUpdatedEvent = new CustomEvent("basketUpdated");
            window.dispatchEvent(basketUpdatedEvent);

            await router.push("/")
        } catch (err) {
            console.error("Erro ao finalizar pedido:", err);
        }
    };

    const showConfirmModal = (type: "cancel" | "finalize") => {
        if (type === "cancel") {
            setConfirmModalProps({
                title: "Tem certeza que deseja cancelar o pedido?",
                textButton: "Cancelar pedido",
                isVisible: true,
                loading: false,
                onClose: () => setConfirmModalProps(null),
                onConfirm: cancelOrder,
            });
        } else if (type === "finalize") {
            setConfirmModalProps({
                title: "Tem certeza que deseja finalizar o pedido?",
                textButton: "Finalizar pedido",
                isVisible: true,
                loading: false,
                onClose: () => setConfirmModalProps(null),
                onConfirm: finalizeOrder,
            });
        }
    };

    useEffect(() => {
        fetchShoppingBasket();
    }, []);

    const translateDay = (day: string) => {
        const days = [
            { label: "Segunda-feira", value: "monday" },
            { label: "Terça-feira", value: "tuesday" },
            { label: "Quarta-feira", value: "wednesday" },
            { label: "Quinta-feira", value: "thursday" },
            { label: "Sexta-feira", value: "friday" },
            { label: "Sábado", value: "saturday" },
            { label: "Domingo", value: "sunday" },
        ];
        const translatedDay = days.find((d) => d.value === day);
        return translatedDay ? translatedDay.label : day;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loading />
            </div>
        );
    } else if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="max-w-2xl mx-auto p-3">
            <div className="grid grid-cols-2 items-center gap-4 mb-2">
                <h1 className="text-2xl font-bold">Cesto de Compras</h1>
                {establishment && (
                    <div className="flex justify-end">
                        {establishment.id}
                        <Link href={`/establishment/${establishment.id}`} className="flex items-center gap-4">
                            <img
                                src={establishment.logo}
                                alt={establishment.name}
                                className="w-16 h-16 object-cover rounded-full"
                            />
                            <div>
                                <h2 className="text-lg font-semibold">{establishment.name}</h2>
                            </div>
                        </Link>
                    </div>
                )}
            </div>
            {basketItems.length === 0 ? (
                <div>
                    <p className="text-gray-500">Seu cesto está vazio.</p>
                    <PrimaryButton>Adicionar</PrimaryButton>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <p>Cesto de compras com itens referente ao cardápio de {translateDay(menu?.day || "")}</p>
                    {basketItems.map((item) => (
                        <ContentCard
                            className="flex items-center gap-4 overflow-hidden"
                            key={item.id}
                        >
                            <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-32 h-24 object-cover rounded"
                            />
                            <div className="flex-1">
                                <h2 className="font-semibold">{item.product.name}</h2>
                                <p className="text-gray-600 flex gap-1">
                                    R$<p className="text-xl">{Number(item.product.price).toFixed(2)}</p>
                                </p>
                            </div>
                            <div className="flex mr-4 justify-center items-center gap-2">
                                <div className="flex justify-center items-center gap-2 rounded-full border-2 border-secondary">
                                    <button
                                        className="p-2 rounded-full h-12 w-12"
                                        disabled={loadingItemId === item.id}
                                        onClick={() => {
                                            removeItem(item.id);
                                        }}
                                    >
                                        {loadingItemId === item.id ? (
                                            <FontAwesomeIcon icon={faSpinner} spin />
                                        ) : item.quantity === 1 ? (
                                            <FontAwesomeIcon icon={faTrash} />
                                        ) : (
                                            <FontAwesomeIcon icon={faMinus} />
                                        )}
                                    </button>
                                    <span className="font-semibold">{item.quantity}</span>
                                    <button
                                        className="p-2 rounded-full h-12 w-12"
                                        disabled={loadingItemId === item.id}
                                        onClick={() => {
                                            updateItemQuantity(item.id, item.product.id);
                                        }}
                                    >
                                        {loadingItemId === item.id ? (
                                            <FontAwesomeIcon icon={faSpinner} spin />
                                        ) : (
                                            <FontAwesomeIcon icon={faPlus} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </ContentCard>
                    ))}
                    <div className="mt-6">
                        <h2 className="text-xl text-center font-bold">
                            Subtotal: R$ {Number(totalPrice).toFixed(2)}
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <SecondaryButton onClick={() => showConfirmModal("cancel")}>
                            Cancelar pedido
                        </SecondaryButton>
                        <PrimaryButton onClick={() => showConfirmModal("finalize")}>
                            Finalizar pedido
                        </PrimaryButton>
                    </div>
                </div>
            )}
            {confirmModalProps && (
                <ConfirmModal
                    isVisible={confirmModalProps.isVisible}
                    onClose={confirmModalProps.onClose}
                    title={confirmModalProps.title}
                    textButton={confirmModalProps.textButton}
                    onConfirm={confirmModalProps.onConfirm}
                    loading={confirmModalProps.loading}
                />
            )}
        </div>
    );
}