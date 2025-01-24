"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { apiUrl } from "@/config/api";
import Image from "next/image";
import ContentCard from "@/components/layout/ContentCard";
import Input from "@/components/form/TextInput";
import PrimaryButton from "@/components/form/PrimaryButton";
import { set } from "react-hook-form";
import SecondaryButton from "@/components/form/SecondaryButton";
import LobsterText from "@/components/form/LobsterText";

export default function UserProfile() {
    const [user, setUser] = useState<IUser>();
    const [originalUser, setOriginalUser] = useState<IUser>();
    const [loading, setLoading] = useState(true);
    const [loadingInfo, setLoadingInfo] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [nameError, setNameError] = useState<string | null>(null);
    const [phoneError, setPhoneError] = useState<string | null>(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isEditingImage, setIsEditingImage] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${apiUrl}/user-by-token`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        token: `${localStorage.getItem("token")}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Erro ao buscar os dados do usuário.");
                }

                const userData = await response.json();
                setUser(userData);
                setOriginalUser(userData);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Erro desconhecido.");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleImageUpload = async () => {
        if (!image) return;

        const formData = new FormData();
        formData.append("image", image);

        try {
            const response = await fetch(`${apiUrl}/user/update-image`, {
                method: "PUT",
                headers: {
                    token: `${localStorage.getItem("token")}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Erro ao atualizar a imagem do perfil.");
            }

            const result = await response.json();
            setUser((prev) => (prev ? { ...prev, image: result.imageUrl } : prev));

            window.dispatchEvent(new CustomEvent("profileImageUpdated", { detail: { imageUrl: result.imageUrl } }));

            alert("Imagem do perfil atualizada com sucesso!");
        } catch (err) {
            alert(err instanceof Error ? err.message : "Erro desconhecido.");
        } finally {
            setIsEditingImage(false)
        }
    };

    const handleCancelImageEdit = () => {
        setImage(null);
        setImagePreview(null);
        setIsEditingImage(false);
    };

    const handleEditToggle = () => {
        if (isEditing) {
            setLoadingInfo(true);
            let valid = true;
            if (!user?.name || user.name.trim().length < 3) {
                setNameError("O nome deve ter no mínimo 3 caracteres.");
                valid = false;
                setLoadingInfo(false);
            } else {
                setNameError(null);
            }

            if (!user?.phone || user.phone.trim() === "") {
                setPhoneError("O telefone não pode estar vazio.");
                valid = false;
                setLoadingInfo(false);
            } else {
                setPhoneError(null);
            }

            if (valid) {
                handleUpdateUser();
            }
        } else {
            setIsEditing(true);
        }
    };

    const hancleCancelEdit = () => {
        setIsEditing(false);
        setUser(originalUser);
    }

    const handleUpdateUser = async () => {
        try {
            const response = await fetch(`${apiUrl}/user/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    token: `${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    name: user?.name,
                    phone: user?.phone,
                }),
            });

            if (!response.ok) {
                throw new Error("Erro ao atualizar os dados do usuário.");
            }

            alert("Dados atualizados com sucesso!");
            setIsEditing(false);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Erro desconhecido.");
        } finally {
            setLoadingInfo(false);
        }
    };


    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordMessage("As senhas não coincidem.");
            return;
        }

        try {
            alert("Redefinição de senha ainda não implementada.");//adicionar lógica futuramente
        } catch (err) {
            alert(err instanceof Error ? err.message : "Erro desconhecido.");
        }
    };

    if (loading) {
        return <div className="text-center mt-5">Carregando dados do usuário...</div>;
    }

    if (error || !user) {
        return (
            <div className="text-center text-red-500 mt-5">
                {error || "Erro ao carregar o perfil do usuário."}
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-5 grid grid-cols-2 gap-3">
            {/* Seção 1: Imagem do Perfil */}
            <ContentCard className="flex flex-col items-center gap-4 p-5 col-span-2 md:col-span-1 min-h-[300px]">
                <LobsterText className="text-2xl font-semibold text-primary">Imagem do Perfil</LobsterText>
                <div className="h-[120px] w-[120px]">
                    <img src={imagePreview || user.image || "/default-avatar.png"} alt={`Imagem de ${user.name}`} className="w-full h-full rounded-full object-cover" />
                </div>
                {!isEditingImage ? (
                    <PrimaryButton className="mt-auto" onClick={() => setIsEditingImage(true)}>Alterar Imagem</PrimaryButton>
                ) : (
                    <div className="flex flex-col items-center gap-2 w-full">
                        <label
                            htmlFor="image"
                            className="cursor-pointerbg-elementbg shadow-primary border-2 border-primary hover:bg-primary hover:text-white rounded-lg py-1 px-4"
                        >
                            Escolher nova imagem
                        </label>
                        <input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <div className="flex gap-2 mt-2 w-full">
                            <SecondaryButton onClick={handleCancelImageEdit}>Cancelar</SecondaryButton>
                            <PrimaryButton onClick={handleImageUpload}>Salvar</PrimaryButton>
                        </div>
                    </div>
                )}
            </ContentCard>

            {/* Seção 2: Informações do Usuário */}
            <ContentCard className="p-5 grid grid-cols-2 gap-4 col-span-2 md:col-span-1 min-h-[300px]">
                <LobsterText className="text-2xl text-center font-semibold text-primary col-span-2">Informações de usuário</LobsterText>
                <Input
                    label="Nome"
                    placeholder=""
                    value={user?.name || ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                        setUser((prev) => (prev ? { ...prev, name: e.target.value } : prev))
                    }
                />
                <Input
                    label="Telefone"
                    placeholder=""
                    value={user?.phone || ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                        setUser((prev) => (prev ? { ...prev, phone: e.target.value } : prev))
                    }
                />
                {!isEditing && (
                    <Input
                        label="Email"
                        placeholder=""
                        value={user?.email || ""}
                        disabled={true}
                    />
                )}
                {!isEditing && (
                    <Input
                        label="CPF"
                        placeholder=""
                        value={user?.cpf || ""}
                        disabled={true}
                    />
                )}
                {nameError && <p className="text-red-500">{nameError}</p>}
                {phoneError && <p className="text-red-500">{phoneError}</p>}
                <div className="col-span-2 flex items-end gap-3 mt-auto">
                    {isEditing && (
                        <SecondaryButton onClick={hancleCancelEdit}>Cancelar</SecondaryButton>
                    )}
                    <PrimaryButton className="" onClick={handleEditToggle} isLoading={loadingInfo}>
                        {isEditing ? "Salvar" : "Editar"}
                    </PrimaryButton>
                </div>
            </ContentCard>

            {/* Seção 3: Redefinir Senha */}
            <ContentCard className="col-span-2 p-5">
                <LobsterText className="text-2xl text-center font-semibold text-primary mb-5">Redefinir senha</LobsterText>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Nova Senha"
                        placeholder="Digite sua nova senha"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Input
                        label="Confirmar Senha"
                        placeholder="Confirme sua nova senha"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <div>
                        {passwordMessage && (
                            <p className="text-red-500">{passwordMessage}</p>
                        )}
                    </div>
                    <div className="flex justify-end">
                        <PrimaryButton className="w-auto" onClick={handleResetPassword}>Redefinir Senha</PrimaryButton>
                    </div>
                </div>
            </ContentCard>
        </div>
    );
}
