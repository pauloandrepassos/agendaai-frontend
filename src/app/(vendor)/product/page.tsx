"use client"
import Loading from "@/components/form/LoadingSpinner";
import PrimaryButton from "@/components/form/PrimaryButton";
import RedirectLink from "@/components/form/RedirectLink";
import SearchBar from "@/components/form/SearchBar";
import SecondaryButton from "@/components/form/SecondaryButton";
import ContentCard from "@/components/layout/ContentCard";
import { apiUrl } from "@/config/api";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProductFormModal from "./ProductModalForm";

interface Product {
    id: number
    name: string
    image: string
    description: string
    price: number
    category: string
}

export default function Products() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
    const router = useRouter()

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${apiUrl}/products/by-vendor`, {
                    headers: {
                        token: `${localStorage.getItem("token")}`
                    },
                })
                const data = await response.json()
                setProducts(data)
            } catch (error) {

            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    const handleAddClick = () => {
        setModalMode("add");
        setCurrentProduct(null);
        setIsModalVisible(true);
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loading />
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="flex items-center gap-6 mb-5">
                <SearchBar placeholder="Pesquisar produto..." className="w-full" />
                <div className="grid grid-cols-2 gap-6">
                    <SecondaryButton className="px-10 flex gap-1 items-center justify-center">
                        <FontAwesomeIcon icon={faTrash} />
                        Deletar
                    </SecondaryButton>
                    <PrimaryButton className="px-10 flex gap-1 items-center justify-center" onClick={handleAddClick}>
                        <FontAwesomeIcon icon={faPlus} />
                        Adicionar
                    </PrimaryButton>
                </div>

                <ProductFormModal
                    isVisible={isModalVisible}
                    onClose={() => {
                        setCurrentProduct(null)
                        setIsModalVisible(false)
                    }}
                    mode={modalMode}
                    initialData={currentProduct}
                    onSave={() => {
                        // Refetch products
                    }}
                />
            </div>
            <div className="">
                {products.length === 0 ? (
                    <p>Nenhum produto cadastrado</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
                        {products.map((product) => (
                            <div
                            key={product.id}
                            className="cursor-pointer"
                            onClick={() => {
                                setModalMode("edit");
                                setCurrentProduct(product);
                                setIsModalVisible(true);
                            }}
                        >
                            <ContentCard className="overflow-hidden text-center">
                                <img
                                    src={product.image}
                                    alt={`Imagem de um ${product.name}`}
                                    className="w-full h-24 object-cover"
                                />
                                <h1>{product.name}</h1>
                                <p>R$ {product.price}</p>
                            </ContentCard>
                        </div>
                        
                        ))}
                    </div>
                )}
            </div>

        </div>
    )
}