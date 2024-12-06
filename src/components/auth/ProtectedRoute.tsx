"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Modal from "../Modal";
import { error } from "console";

interface ProtectedRouteProps {
    allowedTypes: string[];
    children: React.ReactNode;
}

export default function ProtectedRoute({ allowedTypes, children }: ProtectedRouteProps) {
    const router = useRouter();
    const { isAuthenticated, userType, error } = useAuth();
    const [isClient, setIsClient] = useState(false);

    // Define o estado como true após o componente ser montado no cliente.
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Retorna nulo durante a renderização no servidor.
    if (!isClient) return null;

    if (!isAuthenticated) {
        if (error === "token_expired") {
            return (
                <Modal
                    title="Acesso Expirado!"
                    message="Faça Login novamente para acessar a página"
                    isVisible={true}
                    onClose={() => {
                        router.push("/auth/login")
                    }}
                />
            )
        } else {
            return (
                <Modal
                    title="Acesso Negado!"
                    message="Você precisa fazer login para acessar essa página"
                    isVisible={true}
                    onClose={() => {
                        router.push("/auth/login")
                    }}
                />
            )

        }
    }

    if (!userType || !allowedTypes.includes(userType)) {
        router.push("/");
        return null;
    }

    return <>{children}</>;
}
