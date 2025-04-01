"use client"
import Select from '@/components/form/Select';
import ContentCard from '@/components/layout/ContentCard';
import { apiUrl } from '@/config/api';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import UserDetailsModal from './UserDetailsModal';
import UserTypeBadge from '@/components/UserTypeBadge';

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    image: string;
    user_type: 'admin' | 'vendor' | 'client';
    created_at: string;
    updated_at: string;
}

type SortField = 'id' | 'name' | 'email' | 'created_at' | 'user_type';
type SortOrder = 'asc' | 'desc';

export default function ManageUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [sortField, setSortField] = useState<SortField>('id');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const searchParams = useSearchParams();

    // Verifica se há um userId na URL para abrir o modal
    const userId = searchParams.get('userId');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${apiUrl}/users`);

                if (!response.ok) {
                    throw new Error('Erro ao carregar usuários');
                }

                const data = await response.json();
                setUsers(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido');
                console.error('Erro na requisição:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const translateUserType = (type: string) => {
        const translations: Record<string, string> = {
            admin: 'Administrador',
            vendor: 'Vendedor',
            client: 'Cliente'
        };
        return translations[type] || type;
    };

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const sortedUsers = [...users].sort((a, b) => {
        let valueA, valueB;

        if (sortField === 'created_at') {
            valueA = new Date(a[sortField]).getTime();
            valueB = new Date(b[sortField]).getTime();
        } else {
            valueA = a[sortField];
            valueB = b[sortField];
        }

        if (valueA < valueB) {
            return sortOrder === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
            return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                <span className="ml-4 text-gray-600">Carregando usuários...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4">
                <p className="font-bold">Erro</p>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="container max-w-7xl mx-auto px-4 py-8">
            {/* Modal de detalhes do usuário */}
            {userId && <UserDetailsModal />}

            <ContentCard className="">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-800">Gerenciar Usuários</h1>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Ordenar por:</span>
                        <Select
                            options={[
                                { value: 'id', label: 'ID' },
                                { value: 'name', label: 'Nome' },
                                { value: 'email', label: 'Email' },
                                { value: 'user_type', label: 'Tipo' },
                                { value: 'created_at', label: 'Data de criação' }
                            ]}
                            value={sortField}
                            onChange={(e) => setSortField(e.target.value as SortField)}
                        />
                        <Select
                            options={[
                                { value: 'asc', label: 'Crescente' },
                                { value: 'desc', label: 'Decrescente' }
                            ]}
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-primary text-white">
                            <tr>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('id')}
                                >
                                    <div className="flex items-center">
                                        ID
                                        {sortField === 'id' && (
                                            <span className="ml-1">
                                                {sortOrder === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('name')}
                                >
                                    <div className="flex items-center">
                                        Nome
                                        {sortField === 'name' && (
                                            <span className="ml-1">
                                                {sortOrder === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Telefone</th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('user_type')}
                                >
                                    <div className="flex items-center">
                                        Tipo
                                        {sortField === 'user_type' && (
                                            <span className="ml-1">
                                                {sortOrder === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('created_at')}
                                >
                                    <div className="flex items-center">
                                        Criado em
                                        {sortField === 'created_at' && (
                                            <span className="ml-1">
                                                {sortOrder === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <Link href={`/manage-users?userId=${user.id}`} scroll={false}>
                                            {user.id}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link
                                            href={`/manage-users?userId=${user.id}`}
                                            scroll={false}
                                            className="flex items-center"
                                        >
                                            {user.image ? (
                                                <img
                                                    src={user.image}
                                                    alt={user.name}
                                                    className="flex-shrink-0 h-10 w-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">
                                                    <span className="text-xl font-bold">{user.name.charAt(0)}</span>
                                                </div>
                                            )}
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <Link href={`/manage-users?userId=${user.id}`} scroll={false}>
                                            {user.email}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <Link href={`/manage-users?userId=${user.id}`} scroll={false}>
                                            {user.phone}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link href={`/manage-users?userId=${user.id}`} scroll={false}>
                                            <UserTypeBadge userType={user.user_type} />
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <Link href={`/manage-users?userId=${user.id}`} scroll={false}>
                                            {new Date(user.created_at).toLocaleDateString('pt-BR')}
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ContentCard>
        </div>
    );
}