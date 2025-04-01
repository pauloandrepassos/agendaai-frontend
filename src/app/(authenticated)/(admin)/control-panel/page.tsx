"use client"
import { useEffect, useState } from "react";
import RedirectLink from "@/components/form/RedirectLink";
import PrimaryTitle from "@/components/form/title/PrimaryTitle";
import ContentCard from "@/components/layout/ContentCard";
import OrderChart from "@/components/OrderChart";
import Link from "next/link";
import { apiUrl } from "@/config/api";

export default function ControlPanel() {
    // Estados para armazenar os dados
    const [userCount, setUserCount] = useState<number>(0);
    const [orderCount, setOrderCount] = useState<number>(0);
    const [establishmentCount, setEstablishmentCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Função para buscar os dados da API
    const fetchData = async () => {
        try {
            // Requisição para contar usuários
            const usersResponse = await fetch(`${apiUrl}/users/count`);
            const usersData = await usersResponse.json();
            setUserCount(usersData.count);

            // Requisição para contar pedidos
            const ordersResponse = await fetch(`${apiUrl}/orders/count`);
            const ordersData = await ordersResponse.json();
            setOrderCount(ordersData.count);

            // Requisição para contar estabelecimentos
            const establishmentsResponse = await fetch(`${apiUrl}/establishments/count`);
            const establishmentsData = await establishmentsResponse.json();
            setEstablishmentCount(establishmentsData.count);
        } catch (err) {
            console.error("Erro ao buscar dados:", err);
            setError("Erro ao carregar dados. Tente novamente mais tarde.");
        } finally {
            setLoading(false);
        }
    };

    // Executar a função ao carregar o componente
    useEffect(() => {
        fetchData();
    }, []);

    // Dados fictícios para exemplo
    const stats = [
        { title: "Usuários", value: userCount, link: "/manage-users" },
        { title: "Estabelecimentos", value: establishmentCount, link: "/establishments" },
        { title: "Pedidos", value: orderCount, link: "/orders" },
    ];

    const activities = [
        { description: "Novo usuário cadastrado: João", link: "/manage-users" },
        { description: "Pedido realizado: #1234", link: "/orders/1234" },
        { description: "Estabelecimento aprovado: Padaria", link: "/establishments/1" },
    ];

    const quickLinks = [
        { title: "Gerenciar Usuários", link: "/manage-users" },
        { title: "Gerenciar Estabelecimentos", link: "/establishments" },
        { title: "Relatórios", link: "/reports" },
    ];

    const orderData = {
        labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"], // Dias da semana
        data: [12, 16, 14, 15, 12, 0, 0], // Número de pedidos por dia
    };

    if (loading) {
        return <div className="p-6 max-w-7xl mx-auto">Carregando...</div>;
    }

    if (error) {
        return <div className="p-6 max-w-7xl mx-auto text-red-500">{error}</div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <PrimaryTitle>Painel de Controle</PrimaryTitle>

            <div className="flex flex-col gap-5">
                {/* Seção: Resumo Estatístico */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {stats.map((stat, index) => (
                        <Link href={stat.link} key={index}>
                            <ContentCard className="p-5">
                                <h2 className="text-lg font-semibold text-gray-700">{stat.title}</h2>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </ContentCard>
                        </Link>
                    ))}
                </div>

                {/* Seção: Últimas Atividades */}
                <ContentCard className="p-5">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Últimas Atividades</h2>
                    <ul className="space-y-3">
                        {activities.map((activity, index) => (
                            <li key={index} className="text-gray-600">
                                <Link href={activity.link} className="hover:text-blue-500">
                                    {activity.description}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </ContentCard>

                {/* Seção: Links Rápidos */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {quickLinks.map((link, index) => (
                        <RedirectLink href={link.link} key={index} className="h-12 flex items-center justify-center font-bold">
                            {link.title}
                        </RedirectLink>
                    ))}
                </div>
            </div>
        </div>
    );
}