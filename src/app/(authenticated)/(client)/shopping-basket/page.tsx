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
import Modal from "@/components/Modal";
import PrimaryTitle from "@/components/form/title/PrimaryTitle";
import { getDayOfWeek } from "@/utils/dateUtils";

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
    order_date: string;
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
    const [pickupTime, setPickupTime] = useState<string>("");
    const [basketItems, setBasketItems] = useState<ShoppingBasketItem[]>([]);
    const [totalPrice, setTotalPrice] = useState<string>("0.00");
    const [establishment, setEstablishment] = useState<IEstablishment | null>(null);
    const [menu, setMenu] = useState<IMenuDay>();
    const [orderDate, setOrderDate] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loadingItemId, setLoadingItemId] = useState<number | null>(null);
    const [errorModal, setErrorModal] = useState<{ title: string; message: string } | null>(null);
    const [quantityInBasket, setQuantityInBasket] = useState<number>(0)
    const [operatingHours, setOperatingHours] = useState<IOperatingHour[]>([]);
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
            setOrderDate(data.order_date)
        } catch (err) {
            setError("Não foi possível carregar o cesto de compras. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOperatingHours();
    }, [establishment]);

    const fetchOperatingHours = async () => {
        if (!establishment) return;

        try {
            const response = await fetch(`${apiUrl}/operating-hours/establishment/${establishment.id}`, {
                headers: {
                    token: `${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                throw new Error("Erro ao buscar horários de funcionamento.");
            }

            const data = await response.json();
            setOperatingHours(data);
        } catch (err) {
            console.error("Erro ao buscar horários de funcionamento:", err);
        }
    };

    const fetchQuantityInBasket = async () => {
        try {
            const response = await fetch(`${apiUrl}/shopping-basket/count`, {
                headers: {
                    token: `${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                throw new Error("Erro ao buscar o cardápio.");
            }

            const data = await response.json();
            setQuantityInBasket(data.itemCount);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Erro desconhecido.");
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

            setQuantityInBasket(quantityInBasket + 1)

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

            setQuantityInBasket(quantityInBasket - 1)

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

            const response = await fetch(`${apiUrl}/shopping-basket`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    token: `${localStorage.getItem("token")}`,
                },
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
        if (!pickupTime) {
            setErrorModal({ message: "Informe o horário de retirada.", title: "Horário de retirada obrigatório" });
            setConfirmModalProps(null);
            return;
        }
    
        if (!validatePickupTime(pickupTime)) {
            setConfirmModalProps(null);
            return;
        }
    
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
                body: JSON.stringify({ idEstablishment: establishment?.id, pickupTime }),
            });
    
            if (!response.ok) {
                const errorData = await response.json(); // Captura a resposta de erro da API
                if (errorData.message === "Você já possui um pedido em andamento. Você só poderá adicionar um novo pedido, após a finalização do pedido atual.") {
                    setErrorModal({
                        title: "Pedido pendente",
                        message: errorData.message,
                    });
                } else {
                    throw new Error(errorData.message || "Erro ao finalizar pedido.");
                }
                return;
            }
    
            const basketUpdatedEvent = new CustomEvent("basketUpdated");
            window.dispatchEvent(basketUpdatedEvent);
    
            await router.push("/");
        } catch (err) {
            console.error("Erro ao finalizar pedido:", err);
            setErrorModal({
                title: "Erro",
                message: err instanceof Error ? err.message : "Erro desconhecido ao finalizar o pedido.",
            });
        } finally {
            setConfirmModalProps(null); // Fecha o modal de confirmação
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
        fetchQuantityInBasket()
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

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const validatePickupTime = (time: string): boolean => {
        if (!establishment || !orderDate) return false;

        const dayOfWeek = getDayOfWeek(orderDate);
        const hoursForDay = operatingHours.find((hours) => hours.day_of_week === dayOfWeek);

        if (!hoursForDay || hoursForDay.is_closed) {
            setErrorModal({ title: "Erro", message: "O estabelecimento está fechado no dia selecionado." });
            return false;
        }

        const openTime = hoursForDay.open_time;
        const closeTime = hoursForDay.close_time;

        if (!openTime || !closeTime) {
            setErrorModal({ title: "Erro", message: "Horário de funcionamento não disponível." });
            return false;
        }

        const selectedTime = new Date(`1970-01-01T${time}:00`);
        const openTimeDate = new Date(`1970-01-01T${openTime}`);
        const closeTimeDate = new Date(`1970-01-01T${closeTime}`);

        if (selectedTime < openTimeDate || selectedTime > closeTimeDate) {
            setErrorModal({
                title: "Erro",
                message: `O horário de retirada deve estar dentro do horário de funcionamento do dia do pedido. ${openTime} - ${closeTime}.`
            });
            return false;
        }

        return true;
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
        <div className="max-w-7xl mx-auto p-3">
            <div className="mb-3">
                <PrimaryTitle>Cesto de compras:</PrimaryTitle>
            </div>
            {basketItems.length === 0 ? (
                <div>
                    <p className="text-gray-500">Seu cesto está vazio.</p>
                    <PrimaryButton>Adicionar</PrimaryButton>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-4">
                        {basketItems.map((item) => (
                            <ContentCard
                                className="flex items-center gap-4"
                                key={item.id}
                            >
                                <div className="w-40">
                                    <img
                                        src={item.product.image}
                                        alt={item.product.name}
                                        className="w-full h-28 object-cover rounded-l-2xl"
                                    />
                                </div>
                                <div className="flex flex-col sm:flex-row w-full p-3">
                                    <div className="flex flex-1 justify-between sm:flex-col gap-1 mb-2">
                                        <h2 className="font-semibold">{item.product.name}</h2>
                                        <p className="text-gray-600 flex gap-1">
                                            R$<p className="text-xl">{Number(item.product.price).toFixed(2)}</p>
                                        </p>
                                    </div>
                                    <div className="flex mr-4 justify-center items-center gap-2">
                                        <div className="flex justify-center items-center gap-2 rounded-full border-2 border-secondary relative">
                                            <button
                                                className="p-2 rounded-full h-12 w-12"
                                                disabled={loadingItemId === item.id}
                                                onClick={() => removeItem(item.id)}
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
                                            {/* Botão de adicionar com efeito visual se desabilitado */}
                                            <div className="relative group">
                                                <button
                                                    className={`p-2 rounded-full h-12 w-12 transition-all ${quantityInBasket === 5 ? "opacity-50 cursor-not-allowed" : ""
                                                        }`}
                                                    disabled={loadingItemId === item.id || quantityInBasket === 5}
                                                    onClick={() => updateItemQuantity(item.id, item.product.id)}
                                                >
                                                    {loadingItemId === item.id ? (
                                                        <FontAwesomeIcon icon={faSpinner} spin />
                                                    ) : (
                                                        <FontAwesomeIcon icon={faPlus} />
                                                    )}
                                                </button>
                                                {/* Tooltip ao passar o mouse */}
                                                {quantityInBasket === 5 && (
                                                    <div className="absolute right-0 bottom-full mb-2 w-48 text-center text-xs text-white bg-red-500 p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                                        Você atingiu o limite máximo de 5 itens no cesto.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ContentCard>
                        ))}
                    </div>
                    <div>
                        <ContentCard className="p-5 flex flex-col gap-5">
                            {establishment && (
                                <div className="flex justify-center">
                                    <Link href={`/establishment/${establishment.id}`} className="flex items-center gap-4">
                                        <img
                                            src={establishment.logo}
                                            alt={establishment.name}
                                            className="w-16 h-16 object-cover rounded-full border"
                                        />
                                        <div>
                                            <h2 className="text-lg font-semibold">{establishment.name}</h2>
                                        </div>
                                    </Link>
                                </div>
                            )}
                            <div className="flex gap-2 flex-col sm:flex-row justify-between">
                                <p>Pedido para</p>
                                <p className="font-bold">{formatDate(orderDate)}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <label htmlFor="pickupTime" className="block">
                                    Horário de retirada:
                                </label>
                                <input
                                    type="time"
                                    id="pickupTime"
                                    value={pickupTime}
                                    onChange={(e) => setPickupTime(e.target.value)}
                                    className={`p-2 border rounded-md focus:outline-none focus:ring-2 ${error ? "focus:ring-red-500 border-red-500" : "focus:ring-[#FA240F]"
                                        }`}
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <label htmlFor="paymentMethod" className="block font-medium">
                                    Forma de pagamento:
                                </label>
                                <select
                                    id="paymentMethod"
                                    value="Pagamento na retirada"
                                    className={`p-2 border rounded-md focus:outline-none focus:ring-2 ${error ? "focus:ring-red-500 border-red-500" : "focus:ring-[#FA240F]"
                                        }`}
                                    disabled
                                >
                                    <option value="Pagamento na retirada">Pagamento na retirada</option>
                                </select>
                            </div>
                            <div className="flex justify-between">
                                <p>Preço total do pedido: </p>
                                <p className="font-bold">R$ {Number(totalPrice).toFixed(2)}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <SecondaryButton onClick={() => showConfirmModal("cancel")}>
                                    Cancelar pedido
                                </SecondaryButton>
                                <PrimaryButton onClick={() => showConfirmModal("finalize")}>
                                    Finalizar pedido
                                </PrimaryButton>
                            </div>
                        </ContentCard>
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

            {errorModal && (
                <Modal
                    isVisible={!!errorModal}
                    title={errorModal.title}
                    message={errorModal.message}
                    onClose={() => setErrorModal(null)}
                />
            )}
        </div>
    );
}