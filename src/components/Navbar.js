"use client"
import Link from "next/link";
import Image from "next/image";
import styles from './Navbar.module.css'

import logo from '/public/logo-agendaai.png'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBasket, faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { library } from '@fortawesome/fontawesome-svg-core';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

library.add(faSignOutAlt, faUser);

export default function Navbar() {

    const [token, setToken] = useState(null)
    const router = useRouter()

    const handleLogout = () => {
        localStorage.removeItem("token")
        router.push("/inicio")
    }

    useEffect(() => {
        const fetchData = async () => {
            const storedToken = localStorage.getItem('token')
            if (storedToken) {
                setToken(storedToken)
            }
        }
        fetchData()
    }, [token])

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link className={styles.logo} href='/' passHref>
                    <Image src={logo} alt="logo_agendaai" />
                    <h1>Agenda aí</h1>
                </Link>
                {token &&
                    <ul className={styles.list}>
                        <li className={styles.item}>
                            <Link href='/cesto-de-compras' passHref>
                                <FontAwesomeIcon icon={faShoppingBasket} />
                            </Link>
                        </li>
                        <li className={styles.item}>
                            <Link href='/perfil' passHref>
                                <FontAwesomeIcon icon="user" />
                            </Link>
                        </li>
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