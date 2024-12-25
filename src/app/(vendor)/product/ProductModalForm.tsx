"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import Input from "@/components/form/TextInput"
import Select from "@/components/form/Select"
import SubmitButton from "@/components/form/SubmitButton"
import ImageUpload from "@/components/form/ImageUpload"
import axios from "axios"
import SecondaryButton from "@/components/form/SecondaryButton"
import ContentCard from "@/components/layout/ContentCard"
import { apiUrl } from "@/config/api"
import Modal from "@/components/Modal"

interface ProductFormModalProps {
    isVisible: boolean
    onClose: () => void
    mode: "add" | "edit" | "view"
    initialData?: Product | null
    onSave?: () => void
}

interface Product {
    id?: number
    name: string
    description: string
    price: number
    category: string
    image?: string | FileList | null
}

const validationSchema = yup.object().shape({
    name: yup.string().required("O nome é obrigatório"),
    description: yup.string().required("A descrição é obrigatória"),
    price: yup
        .number()
        .typeError("O preço deve ser um número")
        .positive("O preço deve ser maior que zero")
        .required("O preço é obrigatório"),
    category: yup.string().required("A categoria é obrigatória"),
    image: yup
        .mixed<FileList>()
        .nullable()
        .test("fileRequired", "A imagem é obrigatória", (value) => {
            return Boolean(value && value.length > 0);
        }),
});

export default function ProductFormModal({
    isVisible,
    onClose,
    mode,
    initialData,
    onSave,
}: ProductFormModalProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [message, setMessage] = useState<string | null>(null)
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<Product>({
        resolver: yupResolver(validationSchema),
        mode: "onChange",
        defaultValues: initialData || {},
    })

    const handleImageUpload = (files: FileList | null) => {
        setValue("image", files, { shouldValidate: true })
    }

    const onSubmit = async (data: Product) => {
        const formData = new FormData()
        formData.append("name", data.name)
        formData.append("description", data.description)
        formData.append("price", data.price.toString())
        formData.append("category", data.category)
        if (data.image instanceof FileList) {
            formData.append("image", data.image[0])
        }

        setLoading(true)

        try {
            if (mode === "edit") {
                await axios.put(`${apiUrl}/products/${data.id}`, formData, {
                    headers: {
                        token: `${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data",
                    },
                })
            } else if (mode === "add") {
                await axios.post(`${apiUrl}/products`, formData, {
                    headers: {
                        token: `${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data",
                    },
                })
            }

            setLoading(false)
            onSave?.()
            setIsModalVisible(true)
            setMessage("Produto criado com sucesso!")
        } catch (error) {
            setLoading(false)
            console.error("Erro ao salvar o produto:", error)
            setMessage(
                "Erro ao criar produto. Tente novamente mais tarde."
            )
        }
    }

    useEffect(() => {
        if (initialData) {
            setValue("name", initialData.name)
            setValue("description", initialData.description)
            setValue("price", initialData.price)
            setValue("category", initialData.category)
        }
    }, [initialData, setValue])

    if (!isVisible) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <Modal
                title={message || ""}
                isVisible={isModalVisible}
                onClose={onClose}
            />
            <ContentCard className="p-6 w-11/12 max-w-2xl shadow-lg flex flex-col gap-4">
                <h2 className="text-xl font-bold text-center">
                    {mode === "add" ? "Adicionar" : mode === "edit" ? "Editar" : "Visualizar"}
                </h2>
                <form
                    onSubmit={mode !== "view" ? handleSubmit(onSubmit) : undefined}
                    className="flex flex-col gap-4"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ImageUpload
                            label="Imagem do produto"
                            onChange={handleImageUpload}
                            error={errors.image?.message}
                            disabled={mode === "view"}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                className="col-span-2"
                                label="Nome"
                                placeholder="Digite o nome do produto"
                                {...register("name")}
                                error={errors.name?.message}
                                disabled={mode === "view"}
                            />
                            <Select
                                label="Categoria"
                                options={[
                                    { value: "savoury", label: "Salgado" },
                                    { value: "sweet", label: "Doce" },
                                    { value: "cake", label: "Bolo" },
                                    { value: "pie", label: "Torta" },
                                    { value: "drink", label: "Bebida" },
                                    { value: "meal", label: "Marmita" },
                                    { value: "breakfast", label: "Café da Manhã" },
                                    { value: "others", label: "Outros" },
                                ]}
                                {...register("category")}
                                error={errors.category?.message}
                                disabled={mode === "view"}
                            />
                            <Input
                                label="Preço"
                                placeholder="Digite o preço do produto"
                                type="number"
                                {...register("price")}
                                error={errors.price?.message}
                                disabled={mode === "view"}
                            />
                        </div>
                    </div>
                    <Input
                        label="Descrição"
                        placeholder="Digite a descrição do produto"
                        {...register("description")}
                        error={errors.description?.message}
                        disabled={mode === "view"}
                    />
                    <div>
                        <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
                        {mode !== "view" && <SubmitButton text="Salvar" isLoading={loading} />}
                    </div>
                </form>
            </ContentCard>
        </div>
    )
}