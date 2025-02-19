"use client";

import { useEffect, useState } from "react";
import ActionButton from "@/components/form/ActionButton";
import Loading from "@/components/form/LoadingSpinner";
import { apiUrl } from "@/config/api";
import ContentCard from "../layout/ContentCard";
import ProductCard from "../ProductCard";
import PrimaryButton from "../form/PrimaryButton";
import SecondaryButton from "../form/SecondaryButton";
import LobsterText from "../form/LobsterText";
import { categoryLabels } from "@/types/categoryLabels";
import SecondaryTitle from "../form/title/SecondaryTitle";

interface ProductSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (items: { id: number; maxQuantity?: number }[]) => void;
    selectedProducts: { id: number; maxQuantity?: number }[];
}

interface SelectedProduct {
    id: number;
    maxQuantity?: number;
}

export default function ProductSelectionModal({
    isOpen,
    onClose,
    onAdd,
    selectedProducts: initialSelectedProducts,
}: ProductSelectionModalProps) {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(initialSelectedProducts);
    const [limitedProducts, setLimitedProducts] = useState<{ [id: number]: boolean }>({});
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setSelectedProducts(initialSelectedProducts);

        // Define automaticamente quais produtos já possuem limitação ativa
        const initialLimitedProducts: { [id: number]: boolean } = {};
        initialSelectedProducts.forEach((product) => {
            if (product.maxQuantity) {
                initialLimitedProducts[product.id] = true;
            }
        });
        setLimitedProducts(initialLimitedProducts);
    }, [initialSelectedProducts]);

    useEffect(() => {
        if (!isOpen) return;

        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${apiUrl}/products/by-vendor`, {
                    headers: { token: `${localStorage.getItem("token")}` },
                });

                if (!response.ok) {
                    throw new Error("Erro ao buscar produtos.");
                }

                const data: IProduct[] = await response.json();
                setProducts(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [isOpen]);

    const handleSelect = (id: number) => {
        setSelectedProducts((prev) => {
            const alreadySelected = prev.some((item) => item.id === id);

            if (alreadySelected) {
                // Se o produto for removido, também removemos sua limitação
                setLimitedProducts((prev) => {
                    const updated = { ...prev };
                    delete updated[id];
                    return updated;
                });

                return prev.filter((item) => item.id !== id);
            }

            return [...prev, { id, maxQuantity: undefined }];
        });
    };

    const handleToggleLimit = (id: number) => {
        setLimitedProducts((prev) => {
            const newState = !prev[id];

            // Se o checkbox foi desativado, removemos a quantidade máxima do produto
            setSelectedProducts((selected) =>
                selected.map((item) =>
                    item.id === id ? { ...item, maxQuantity: newState ? item.maxQuantity ?? 1 : undefined } : item
                )
            );

            return { ...prev, [id]: newState };
        });
    };

    const handleQuantityChange = (id: number, value: string) => {
        const parsedValue = value ? parseInt(value, 10) : undefined;
        setSelectedProducts((prev) =>
            prev.map((item) => (item.id === id ? { ...item, maxQuantity: parsedValue } : item))
        );
    };

    const handleAdd = () => {
        onAdd(selectedProducts);
        onClose();
    };

    const groupedProducts = products.reduce((acc, product) => {
        if (!acc[product.category]) {
            acc[product.category] = [];
        }
        acc[product.category].push(product);
        return acc;
    }, {} as Record<string, IProduct[]>);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <ContentCard className="p-6 w-full max-w-7xl m-4 flex flex-col">
                {loading ? (
                    <Loading />
                ) : (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-between mb-4">
                            <SecondaryTitle>Selecione os produtos:</SecondaryTitle>
                            <div className="grid grid-cols-2 gap-3">
                                <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
                                <PrimaryButton onClick={handleAdd}>Salvar</PrimaryButton>
                            </div>
                        </div>
                        <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-red-500 scrollbar-track-gray-200">
                            {Object.keys(groupedProducts).map((category) => (
                                <div key={category} className="mb-2">
                                    <div className="bg-gradient-to-tr from-secondary to-primary p-2 rounded-xl mb-2">
                                        <LobsterText className="text-2xl text-white">{categoryLabels[category] || category}</LobsterText>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                                        {groupedProducts[category].map((product) => (
                                            <div key={product.id} className="flex flex-col gap-3">
                                                <label className="relative group">
                                                    <ProductCard
                                                        image={product.image}
                                                        name={product.name}
                                                        price={product.price}
                                                    />
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedProducts.some((item) => item.id === product.id)}
                                                        onChange={() => handleSelect(product.id)}
                                                        className="absolute top-2 right-2 w-6 h-6 cursor-pointer bg-white border-2 border-gray-300 rounded-md shadow-sm group-hover:border-orange-500"
                                                    />
                                                </label>
                                                {selectedProducts.some((item) => item.id === product.id) && (
                                                    <div className="flex flex-col gap-2">
                                                        <label className="flex items-center gap-2 text-sm text-gray-600 ml-1">
                                                            <input
                                                                type="checkbox"
                                                                checked={limitedProducts[product.id] || false}
                                                                onChange={() => handleToggleLimit(product.id)}
                                                                className="w-4 h-4"
                                                            />
                                                            Limitar quantidade
                                                        </label>
                                                        {limitedProducts[product.id] && (
                                                            <input
                                                                id={`maxQuantity-${product.id}`}
                                                                type="number"
                                                                placeholder="Digite a quantidade"
                                                                value={selectedProducts.find((item) => item.id === product.id)?.maxQuantity || ""}
                                                                onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                                                className="h-12 p-3 rounded-xl shadow-secondary focus:outline-none focus:ring-2"
                                                                min="1"
                                                            />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </ContentCard>
        </div>
    );
}
