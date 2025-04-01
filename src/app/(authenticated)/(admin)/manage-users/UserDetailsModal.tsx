// components/UserDetailsModal.tsx
"use client"
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiUrl } from '@/config/api';
import ContentCard from '@/components/layout/ContentCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
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

export default function UserDetailsModal() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (userId) {
            fetchUserDetails(userId);
        }
    }, [userId]);

    const fetchUserDetails = async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${apiUrl}/user/${id}`);
            if (!response.ok) {
                throw new Error('Erro ao carregar detalhes do usuário');
            }

            const data = await response.json();
            setUser(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido');
            console.error('Erro ao buscar detalhes do usuário:', err);
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        router.push('/manage-users', { scroll: false });
    };

    if (!userId) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <ContentCard className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5">
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>

                {loading && (
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4">
                        <p className="font-bold">Erro</p>
                        <p>{error}</p>
                    </div>
                )}

                {user && (
                    <div className="space-y-6">
                        <div className="flex flex-col items-center">
                            {user.image ? (
                                <img
                                    src={user.image}
                                    alt={user.name}
                                    className="w-32 h-32 rounded-full object-cover mb-4"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 mb-4">
                                    <span className="text-4xl font-bold">{user.name.charAt(0)}</span>
                                </div>
                            )}
                            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                            <UserTypeBadge userType={user.user_type}/>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                                <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                            </div>

                            <div className="p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">Telefone</h3>
                                <p className="mt-1 text-sm text-gray-900">{user.phone}</p>
                            </div>

                            <div className="p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">Cadastrado em</h3>
                                <p className="mt-1 text-sm text-gray-900">
                                    {new Date(user.created_at).toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>

                            <div className="p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">Última atualização</h3>
                                <p className="mt-1 text-sm text-gray-900">
                                    {new Date(user.updated_at).toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </ContentCard>
        </div>
    );
}