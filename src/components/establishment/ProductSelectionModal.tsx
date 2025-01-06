"use client"

import { useEffect, useState } from "react"
import ActionButton from "@/components/form/ActionButton"
import Loading from "@/components/form/LoadingSpinner"
import { apiUrl } from "@/config/api"
import ContentCard from "../layout/ContentCard"
import ProductCard from "../ProductCard"
import PrimaryButton from "../form/PrimaryButton"
import SecondaryButton from "../form/SecondaryButton"
import LobsterText from "../form/LobsterText"
import { categoryLabels } from "@/types/categoryLabels"

interface ProductSelectionModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (selectedIds: number[]) => void
    selectedProductIds: number[]
}

export default function ProductSelectionModal({
    isOpen,
    onClose,
    onAdd,
    selectedProductIds
}: ProductSelectionModalProps) {
    const [products, setProducts] = useState<IProduct[]>([])
    const [selectedProducts, setSelectedProducts] = useState<number[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        if (!isOpen) return

        setSelectedProducts(selectedProductIds);

        const fetchProducts = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${apiUrl}/products/by-vendor`, {
                    headers: { token: `${localStorage.getItem("token")}` },
                })

                if (!response.ok) {
                    throw new Error("Erro ao buscar produtos.")
                }

                const data: IProduct[] = await response.json()
                setProducts(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [isOpen, selectedProductIds])

    const handleSelect = (id: number) => {
        setSelectedProducts((prev) =>
            prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
        )
    }

    const handleAdd = () => {
        onAdd(selectedProducts)
        onClose()
    }

    const groupedProducts = products.reduce((acc, product) => {
        if (!acc[product.category]) {
            acc[product.category] = [];
        }
        acc[product.category].push(product);
        return acc;
    }, {} as Record<string, IProduct[]>);

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <ContentCard className="p-6 w-full max-w-7xl m-4 flex flex-col">
                {loading ? (
                    <Loading />
                ) : (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">Selecione Produtos</h2>
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
                                            <label key={product.id} className="relative group mb-2">
                                                <ProductCard
                                                    image={product.image}
                                                    name={product.name}
                                                    price={product.price}
                                                />
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProducts.includes(product.id)}
                                                    onChange={() => handleSelect(product.id)}
                                                    className="absolute top-2 right-2 w-6 h-6 cursor-pointer bg-white border-2 border-gray-300 rounded-md shadow-sm group-hover:border-orange-500"
                                                />
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </ContentCard>
        </div>
    )
}