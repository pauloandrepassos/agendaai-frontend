"use client"

import { useEffect, useState } from "react"
import ActionButton from "@/components/form/ActionButton"
import Loading from "@/components/form/LoadingSpinner"
import { apiUrl } from "@/config/api"
import ContentCard from "../layout/ContentCard"
import ProductCard from "../ProductCard"

interface Product {
    id: number
    name: string
    image: string
    price: string
}

interface ProductSelectionModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (selectedIds: number[]) => void
}

export default function ProductSelectionModal({
    isOpen,
    onClose,
    onAdd,
}: ProductSelectionModalProps) {
    const [products, setProducts] = useState<Product[]>([])
    const [selectedProducts, setSelectedProducts] = useState<number[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        if (!isOpen) return

        const fetchProducts = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${apiUrl}/products/by-vendor`, {
                    headers: { token: `${localStorage.getItem("token")}` },
                })

                if (!response.ok) {
                    throw new Error("Erro ao buscar produtos.")
                }

                const data: Product[] = await response.json()
                setProducts(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [isOpen])

    const handleSelect = (id: number) => {
        setSelectedProducts((prev) =>
            prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
        )
    }

    const handleAdd = () => {
        onAdd(selectedProducts)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <ContentCard className="p-6 w-full max-w-7xl m-4 flex flex-col">
                <h2 className="text-xl font-bold mb-4">Selecione Produtos</h2>
                {loading ? (
                    <Loading />
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 max-h-96 overflow-y-auto">
                        {products.map((product) => (
                            <label key={product.id} className="relative group">
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
                )}
                <div className="flex justify-end gap-3 mt-4">
                    <ActionButton onClick={onClose}>Cancelar</ActionButton>
                    <ActionButton onClick={handleAdd}>Adicionar</ActionButton>
                </div>
            </ContentCard>
        </div>
    )
}