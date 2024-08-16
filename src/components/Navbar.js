"use client"
import Link from "next/link";
import Image from "next/image";
import styles from './Navbar.module.css';
import logo from '/public/logo-agendaai.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faShoppingBasket, faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { library } from '@fortawesome/fontawesome-svg-core';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiUrl } from "@/config/api";

library.add(faSignOutAlt, faUser);

export default function Navbar() {

    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [papel, setPapel] = useState(null)
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.dispatchEvent(new Event('storage')); // Dispara o evento para atualizar a navbar
        router.push("/inicio");
    }

    useEffect(() => {
        const fetchUserData = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);

                try {
                    const response = await fetch(`${apiUrl}/user`, {
                        method: 'GET',
                        headers: {
                            'token': `${storedToken}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        const userData = await response.json();
                        setUser(userData);
                        setPapel(userData.papel)
                    } else {
                        console.error('Erro ao buscar dados do usuário.');
                    }
                } catch (error) {
                    console.error('Erro na requisição:', error);
                }
            } else {
                setToken(null);
                setUser(null);
            }
        }

        fetchUserData();

        const handleStorageChange = () => {
            fetchUserData();
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link className={styles.logo} href='/' passHref>
                    <Image src={logo} alt="logo_agendaai" />
                    <h1>Agenda aí</h1>
                </Link>
                {token &&
                    <ul className={styles.list}>
                        {/* itens de usuario gerente */}
                        {papel == 'gerente' &&
                            <li className={styles.item}>
                                <Link href='/agendamentos' passHref>
                                    <FontAwesomeIcon icon={faFileAlt} />
                                </Link>
                            </li>
                        }

                        
                        {/* itens de usuario cliente */}
                        {papel == 'cliente' &&
                            <li className={styles.item}>
                                <Link href='/pedidos' passHref>
                                    <FontAwesomeIcon icon={faFileAlt} />
                                </Link>
                            </li>
                        }
                        {papel == 'cliente' &&
                            <li className={styles.item}>
                                <Link href='/cesto-de-compras' passHref>
                                    <FontAwesomeIcon icon={faShoppingBasket} />
                                </Link>
                            </li>
                        }


                        {/* itens de todos usuarios */}
                        {user?.imagem ? (
                            <li className={`${styles.item}`}>
                                <Link href={`/perfil`}>
                                    <Image
                                        src={user.imagem}
                                        alt="User Image"
                                        width={45}
                                        height={45}
                                        className={styles.userImage}
                                    />
                                </Link>
                            </li>
                        ) : (
                            <li className={styles.item}>
                                <Link href='/perfil' passHref>
                                    <FontAwesomeIcon icon="user" />
                                </Link>
                            </li>
                        )}
                        <li className={styles.item}>
                            <button onClick={handleLogout} className={styles.logoutButton}>
                                <FontAwesomeIcon icon="sign-out-alt" />
                            </button>
                        </li>
                    </ul>
                }
            </div>
        </nav>
    )
}
