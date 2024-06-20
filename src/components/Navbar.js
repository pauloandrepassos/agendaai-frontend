"use client"
import Link from "next/link";
import Image from "next/image";
import styles from './Navbar.module.css'

import logo from '/public/logo-agendaai.png'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/navigation";

export default function Navbar({ opcoesCliente, opcoesGerente }) {
    const router = useRouter()

    const handleLogout = () => {
        localStorage.removeItem("token")
        router.push("/inicio")
    }

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link className={styles.logo} href='/' passHref>
                    <Image src={logo} alt="logo_agendaai" />
                    <h1>Agenda aí</h1>
                </Link>
                <div className={styles.opcoesNavbar}>
                    {(opcoesCliente) &&
                        <Link href='/user' passHref>
                            <div className={styles}>
                                <div className={styles.divUserIcon}>
                                    <FontAwesomeIcon icon={faUser}/>
                                </div>
                            </div>
                        </Link>
                    }
                    {(opcoesCliente || opcoesGerente) &&
                        <div className={styles}>
                            <button onClick={handleLogout}>
                                Sair
                                <div className={styles.divIcon}>
                                    <FontAwesomeIcon icon={faSignOutAlt} />
                                </div>
                            </button>
                        </div>
                    }
                </div>

            </div>
        </nav>
    )
}