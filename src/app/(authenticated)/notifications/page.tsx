"use client";

import PrimaryTitle from "@/components/form/title/PrimaryTitle";
import ContentCard from "@/components/layout/ContentCard";
import { apiUrl } from "@/config/api";
import { faBell, faCheck, faCircle, faEnvelope, faEnvelopeOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Notification {
    id: number
    title: string
    message: string
    action_url: string | null
    notification_type: string
    is_read: boolean
    created_at: string
}

export default function Notifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const router = useRouter()

    useEffect(() => {
        fetchNotifications()
            .then(() => setLoading(false))
            .catch((error) => {
                console.error("Erro ao buscar notificações:", error)
                setLoading(false)
            })
    }, [router])

    const fetchNotifications = async () => {
        try {
            const response = await fetch(`${apiUrl}/notifications`, {
                headers: { token: `${localStorage.getItem("token")}` },
            })

            if (!response.ok) throw new Error("Erro ao buscar notificações")

            const data = await response.json()
            setNotifications(data)
            // Atualiza a contagem de não lidas
            setUnreadCount(data.filter((n: Notification) => !n.is_read).length)
        } catch (error) {
            console.error("Erro ao buscar notificações:", error)
        }
    }

    const markAsRead = async (notificationId: number) => {
        try {
            const response = await fetch(`${apiUrl}/notifications/mark-as-read/${notificationId}`, {
                method: "POST",
                headers: { token: `${localStorage.getItem("token")}` },
            })

            if (!response.ok) throw new Error("Erro ao marcar como lida")

            // Atualiza o estado local
            setNotifications(prev =>
                prev.map(n =>
                    n.id === notificationId ? { ...n, is_read: true } : n
                )
            )
            
            setUnreadCount(prev => prev - 1)

            window.dispatchEvent(new CustomEvent("notificationRead"));
        } catch (error) {
            console.error("Erro ao marcar notificação como lida:", error)
        }
    }

    const handleNotificationClick = (notification: Notification) => {
        // Marca como lida se não estiver lida
        if (!notification.is_read) {
            markAsRead(notification.id)
        }

        // Navega para a URL da ação se existir
        if (notification.action_url) {
            router.push(notification.action_url)
        }
    }

    const markAllAsRead = async () => {
        try {
            // Filtra apenas as não lidas
            const unreadNotifications = notifications.filter(n => !n.is_read)
            
            // Marca cada uma como lida
            for (const notification of unreadNotifications) {
                await markAsRead(notification.id)
            }
        } catch (error) {
            console.error("Erro ao marcar todas como lidas:", error)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <div className="flex justify-between items-center mb-6">
                <PrimaryTitle>
                    <FontAwesomeIcon icon={faBell} className="mr-3"/>
                    Notificações
                </PrimaryTitle>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-colors"
                    >
                        <FontAwesomeIcon icon={faCheck} />
                        Marcar todas como lidas
                    </button>
                )}
            </div>
            {unreadCount > 0 && (
                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
                    Você tem {unreadCount} notificação{unreadCount > 1 ? "s" : ""} não lida{unreadCount > 1 ? "s" : ""}.
                </div>
            )}

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <ContentCard className="p-8 text-center text-gray-500">
                        Nenhuma notificação encontrada
                    </ContentCard>
                ) : (
                    notifications.map(notification => (
                        <div onClick={() => handleNotificationClick(notification)}>
                            <ContentCard
                                key={notification.id}
                                className={`p-4 cursor-pointer transition-all ${
                                    !notification.is_read ? "border-l-4 border-primary bg-blue-50" : ""
                                }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-3">
                                        <div className="mt-1">
                                            <FontAwesomeIcon
                                                icon={notification.is_read ? faEnvelopeOpen : faEnvelope}
                                                className={notification.is_read ? "text-gray-400" : "text-primary"}
                                            />
                                        </div>
                                        <div>
                                            <h3 className={`font-semibold ${!notification.is_read ? "text-primary" : "text-gray-700"}`}>
                                                {notification.title}
                                            </h3>
                                            <p className="text-gray-600">{notification.message}</p>
                                            <p className="text-sm text-gray-400 mt-1">
                                                {new Date(notification.created_at).toLocaleDateString("pt-BR", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    {!notification.is_read && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation() // Evita que o clique propague para o card
                                                markAsRead(notification.id)
                                            }}
                                            className="text-xs text-primary hover:text-secondary"
                                            aria-label="Marcar como lida"
                                        >
                                            <FontAwesomeIcon icon={faCircle} />
                                        </button>
                                    )}
                                </div>
                            </ContentCard>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}