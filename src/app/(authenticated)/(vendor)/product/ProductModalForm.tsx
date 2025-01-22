"use client"

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "@/components/form/TextInput";
import Select from "@/components/form/Select";
import SubmitButton from "@/components/form/SubmitButton";
import ImageUpload from "@/components/form/ImageUpload";
import axios from "axios";
import SecondaryButton from "@/components/form/SecondaryButton";
import ContentCard from "@/components/layout/ContentCard";
import { apiUrl } from "@/config/api";
import Modal from "@/components/Modal";
import PriceInput from "@/components/form/PriceInput";

interface ProductFormModalProps {
    isVisible: boolean;
    onClose: () => void;
    mode: "add" | "edit" | "view";
    initialData?: Product | null;
    onSave?: () => void;
    closeAllModals?: () => void;
}

interface Product {
    id?: number;
    name: string;
    description: string;
    price: number;
    category: string;
    image?: FileList | string | null;
}

const validationSchema = (mode: "add" | "edit" | "view") =>
    yup.object().shape({
        name: yup.string().required("O nome é obrigatório"),
        description: yup.string().required("A descrição é obrigatória"),
        price: yup
            .number()
            .typeError("O preço deve ser um número")
            .positive("O preço deve ser maior que zero")
            .test("decimal-places", "O preço deve ter no máximo duas casas decimais", (value) => {
                return Number.isInteger((value ?? 0) * 100);
            })
            .required("O preço é obrigatório"),
        category: yup.string().required("A categoria é obrigatória"),
        image: yup.mixed<FileList | string>().nullable().test(
            "fileRequired",
            "A imagem é obrigatória",
            (value) => {
                if (mode === "add") {
                    return value instanceof FileList && value.length > 0;
                }
                return true; // Não é obrigatório em outros modos
            }
        ),
    });

export default function ProductFormModal({
    isVisible,
    onClose,
    mode,
    initialData,
    onSave,
}: ProductFormModalProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        watch
    } = useForm<Product>({
        resolver: yupResolver(validationSchema(mode)),
        mode: "onChange",
        defaultValues: initialData || {},
    });


  const price = watch("price") ?? 0; 

    const onSubmit = async (data: Product) => {
        const formData = new FormData();
        if (data.id) {
            formData.append("id", data.id.toString());
        }
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", data.price.toString());
        formData.append("category", data.category);

        if (data.image instanceof FileList) {
            formData.append("image", data.image[0]);
        }

        setLoading(true);

        try {
            if (mode === "edit") {
                console.log(initialData)
                console.log(formData)
                await axios.put(`${apiUrl}/products/${data.id}`, formData, {
                    headers: {
                        token: `${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                });
            } else if (mode === "add") {
                console.log(formData)
                await axios.post(`${apiUrl}/products`, formData, {
                    headers: {
                        token: `${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
            }

            setLoading(false);
            onSave?.();
            setIsModalVisible(true);
            if (mode === 'edit') {
                setMessage("Produto editado com sucesso!");
            } else if (mode === 'add') {
                setMessage("Produto criado com sucesso!");
            }
        } catch (error) {
            setLoading(false);
            console.error("Erro ao salvar o produto:", error);
            setMessage("Erro ao criar produto. Tente novamente mais tarde.");
        }
    };

    useEffect(() => {
        if (initialData) {
            setValue("id", initialData.id);
            setValue("name", initialData.name);
            setValue("description", initialData.description);
            setValue("price", initialData.price);
            setValue("category", initialData.category);
            setValue("image", initialData.image || null);
        } else {
            setValue("id", undefined);
            setValue("name", "");
            setValue("description", "");
            setValue("price", 0);
            setValue("category", "");
            setValue("image", null);
        }
    }, [initialData, setValue])

    const closeModal = () => {
        setIsModalVisible(false)
        onClose()
    }

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <Modal
                title={message || ""}
                isVisible={isModalVisible}
                onClose={closeModal}
                onGlobalClose={closeModal}
            />
            <ContentCard className="p-6 w-11/12 max-w-2xl shadow-lg flex flex-col gap-4">
                <h2 className="text-xl font-bold text-center">
                    {mode === "add"
                        ? "Adicionar"
                        : mode === "edit"
                            ? "Editar"
                            : "Visualizar"}
                </h2>
                <form
                    onSubmit={mode !== "view" ? handleSubmit(onSubmit) : undefined}
                    className="flex flex-col gap-4"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mode === "add" ? (
                            <ImageUpload
                                label="Imagem do produto"
                                onChange={(files) =>
                                    setValue("image", files, { shouldValidate: true })
                                }
                                error={errors.image?.message}
                            />
                        ) : (
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Imagem do produto
                                </label>
                                <img
                                    src={
                                        typeof initialData?.image === "string"
                                            ? initialData.image
                                            : ""
                                    }
                                    alt="Produto"
                                    className="w-full h-40 object-cover mt-2 rounded"
                                />
                            </div>
                        )}
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
                            <PriceInput
                                label="Preço"
                                value={watch("price")}
                                onChange={(value) => setValue("price", value, { shouldValidate: true })}
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
                    <div className="flex justify-end gap-2">
                        <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
                        {mode !== "view" && (
                            <SubmitButton text={mode === "edit" ? "Salvar" : "Adicionar"} isLoading={loading} />
                        )}
                    </div>
                </form>
            </ContentCard>
        </div>
    );
}
