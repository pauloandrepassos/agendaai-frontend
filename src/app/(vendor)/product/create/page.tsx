"use client"
import { apiUrl } from "@/config/api"
import SubmitButton from "@/components/form/SubmitButton"
import Input from "@/components/form/TextInput"
import Select from "@/components/form/Select"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import Modal from "@/components/Modal"
import axios from "axios"
import ContentCard from "@/components/layout/ContentCard"
import ImageUpload from "@/components/form/ImageUpload"

interface FormData {
    name: string
    description: string
    price: number
    category: string
    image?: FileList | null; // Permitir null explicitamente
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

export default function CreateProduct() {
    const [loading, setLoading] = useState<boolean>(false)
    const [message, setMessage] = useState<string | null>(null)
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(validationSchema),
        mode: "onChange",
    })

    const onSubmit = async (data: FormData) => {
        const formData = new FormData()
        formData.append("name", data.name)
        formData.append("description", data.description)
        formData.append("price", data.price.toString())
        formData.append("category", data.category)
        if (data.image) {
            formData.append("image", data.image[0])
        }

        setLoading(true)

        try {
            const response = await axios.post(`${apiUrl}/products`, formData, {
                headers: {
                    token: `${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data",
                },
            })

            setLoading(false)
            setIsModalVisible(true)
            setMessage("Produto criado com sucesso!")
        } catch (error) {
            setLoading(false)
            setMessage(
                "Erro ao criar produto. Tente novamente mais tarde."
            )
        }
    }


    const handleImageUpload = (files: FileList | null) => {
        setValue("image", files, { shouldValidate: true });
    };

    return (
        <div className="p-3 max-w-2xl flex justify-center m-auto">
            <ContentCard className="p-3">
                <h1 className="text-3xl font-bold text-[#FF0000] text-center mb-6">Criar Produto</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <Modal
                        title="Produto Criado"
                        message="Seu produto foi criado com sucesso!"
                        isVisible={isModalVisible}
                        onClose={() => setIsModalVisible(false)}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ImageUpload
                            label="Imagem do produto"
                            onChange={handleImageUpload}
                            error={errors.image?.message}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                className="col-span-2"
                                label="Nome"
                                placeholder="Digite o nome do produto"
                                type="text"
                                {...register("name")}
                                error={errors.name?.message}
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
                            />
                            <Input
                                label="Preço"
                                placeholder="Digite o preço do produto"
                                type="number"
                                {...register("price")}
                                error={errors.price?.message}
                            />
                        </div>
                    </div>
                    <Input
                        label="Descrição"
                        placeholder="Digite a descrição do produto"
                        type="text"
                        {...register("description")}
                        error={errors.description?.message}
                    />
                    <SubmitButton text="Criar Produto" isLoading={loading} />
                </form>
                {message && <p className="mt-4 text-center text-red-500">{message}</p>}
            </ContentCard>
        </div>
    )
}