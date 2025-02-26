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
import LobsterText from "@/components/form/LobsterText";
import { categoryLabels } from "@/types/categoryLabels";

export default function Products() {
    const [products, setProducts] = useState<IProduct[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
    const [currentProduct, setCurrentProduct] = useState<IProduct | null>(null);
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

    const groupedProducts = products.reduce((acc, product) => {
        if (!acc[product.category]) {
            acc[product.category] = [];
        }
        acc[product.category].push(product);
        return acc;
    }, {} as Record<string, IProduct[]>);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loading />
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] sm:gap-4 items-center mb-5">
                <SearchBar placeholder="Pesquisar produto..." className="w-full" />
                <div className="grid grid-cols-1 gap-6">
                    {/*<SecondaryButton className="px-10 flex gap-1 items-center justify-center">
                        <FontAwesomeIcon icon={faTrash} />
                        Deletar
                    </SecondaryButton>*/}
                    <PrimaryButton className="px-10 flex gap-1 items-center justify-center" onClick={handleAddClick}>
                        <FontAwesomeIcon icon={faPlus} />
                        Adicionar
                    </PrimaryButton>
                </div>
            </div>

            <ProductFormModal
                isVisible={isModalVisible}
                onClose={() => {
                    setCurrentProduct(null)
                    setIsModalVisible(false)
                }}
                mode={modalMode}
                initialData={currentProduct}
                onSave={async () => {
                    try {
                        const response = await fetch(`${apiUrl}/products/by-vendor`, {
                            headers: {
                                token: `${localStorage.getItem("token")}`,
                            },
                        });
                        const data = await response.json();
                        setProducts(data)
                    } catch (error) {
                        console.error("Erro ao atualizar os produtos:", error);
                    }
                }}
            />
            <div className="">
                {Object.keys(groupedProducts).length === 0 ? (
                    <p>Nenhum produto cadastrado</p>
                ) : (
                    Object.entries(groupedProducts).map(([category, products]) => (
                        <div key={category} className="mb-8">
                            <div className="bg-gradient-to-tr from-secondary to-primary p-2 rounded-xl mb-4">
                                <LobsterText className="text-2xl text-white">{categoryLabels[category] || category}</LobsterText>
                            </div>
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
                                        <ContentCard className="overflow-hidden">
                                            <img
                                                src={product.image}
                                                alt={`Imagem de um ${product.name}`}
                                                className="w-full h-24 object-cover"
                                            />
                                            <div className="p-2 flex flex-col justify-between h-24">
                                                <h1 className="text-lg line-clamp-2">{product.name}</h1>
                                                <p className="text-end font-bold">R$ {product.price}</p>
                                            </div>
                                        </ContentCard>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}