"use client"
import PrivateRouter from "@/components/PrivateRouter";
import styles from './usuarios.module.css';
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { apiUrl } from "@/config/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function UsuariosPage() {
    const [usuarios, setUsuarios] = useState([]);

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
                    // Ordenar usuários pelo nome em ordem alfabética
                    const sortedData = data.sort((a, b) => a.nome.localeCompare(b.nome));
                    setUsuarios(sortedData);
                } else {
                    console.error('Erro ao buscar usuários');
                }
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
            }
        };
    
        fetchUsuarios();
    }, []);
    

    return (
        <PrivateRouter tipoUsuario={`admin`}>
            <div className={styles.container}>
                <Navbar />
                <div className={styles.content}>
                    <h1>Lista de Usuários</h1>
                    {usuarios.map(user => (
                        <div className={styles.userProfile}>
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
        </PrivateRouter>
    );
}
