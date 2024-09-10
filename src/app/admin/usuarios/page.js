"use client";
import PrivateRouter from "@/components/PrivateRouter";
import styles from './usuarios.module.css';
import { useEffect, useState } from "react";
import { apiUrl } from "@/config/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function UsuariosPage() {
    const [usuarios, setUsuarios] = useState([]);
    const [sortOption, setSortOption] = useState('nome-asc'); // Estado para a opção de ordenação

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await fetch(`${apiUrl}/users`, {
                    headers: {
                        'token': `${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    sortUsuarios(data, sortOption); // Chama a função para ordenar
                } else {
                    console.error('Erro ao buscar usuários');
                }
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
            }
        };

        fetchUsuarios();
    }, [sortOption]); // Atualiza a lista sempre que a opção de ordenação mudar

    const sortUsuarios = (data, criteria) => {
        let sortedData;
        switch (criteria) {
            case 'nome-asc':
                sortedData = data.sort((a, b) => a.nome.localeCompare(b.nome));
                break;
            case 'nome-desc':
                sortedData = data.sort((a, b) => b.nome.localeCompare(a.nome));
                break;
            case 'data-asc':
                sortedData = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'data-desc':
                sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'login-recent':
                sortedData = data.sort((a, b) => new Date(b.ultimo_login) - new Date(a.ultimo_login));
                break;
            default:
                sortedData = data;
                break;
        }
        setUsuarios(sortedData);
    };

    return (
        <PrivateRouter tipoUsuario={`admin`}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <h1>Lista de Usuários</h1>
                    <div className={styles.sortOptions}>
                        <label htmlFor="sort">Ordenar por: </label>
                        <select
                            id="sort"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="nome-asc">Nome (A-Z)</option>
                            <option value="nome-desc">Nome (Z-A)</option>
                            <option value="data-asc">Data de Criação (Mais Antigos)</option>
                            <option value="data-desc">Data de Criação (Mais Recentes)</option>
                            <option value="login-recent">Último Login (Mais Recentes)</option>
                        </select>
                    </div>
                    <div className={styles.usersList}>
                        {usuarios.map((user, index) => (
                            <div className={styles.userProfile} key={index}>
                                <div className={styles.userImageContainer}>
                                    {user.imagem ? (
                                        <img
                                            src={user.imagem || '/default-profile.png'}
                                            alt={user.nome}
                                            className={styles.userImage}
                                        />
                                    ) : (
                                        <div className={styles.userImage}>
                                            <FontAwesomeIcon icon={faUser} />
                                        </div>
                                    )}
                                </div>
                                <div className={styles.userInfo}>
                                    <h1>{user.nome}</h1>
                                    <div className={styles.d1}>
                                        <div className={styles.d2}>
                                            <p><strong>Email:</strong> {user.email}</p>
                                            <p><strong>Último Login:</strong> {user.ultimo_login ? new Date(user.ultimo_login).toLocaleString() : 'Nunca'}</p>
                                        </div>
                                        <div className={styles.d2}>
                                            <p><strong>Criado em:</strong> {new Date(user.createdAt).toLocaleString()}</p>
                                            <p><strong>Atualizado em:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PrivateRouter>
    );
}
