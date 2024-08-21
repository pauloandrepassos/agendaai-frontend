"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import PrivateRouter from "@/components/PrivateRouter";
import axios from "axios";
import styles from './home.module.css';
import { apiUrl, wsApiUrl } from "@/config/api";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders, faStar, faSearch } from "@fortawesome/free-solid-svg-icons";
import Toast from "@/components/Toast";

export default function Home() {
    const [lanchonetes, setLanchonetes] = useState([]);
    const [showToast, setShowToast] = useState(false); // Estado para controlar a exibição do toast
    const [toastMessage, setToastMessage] = useState(''); // Estado para a mensagem do toast
    const [toastType, setToastType] = useState('success'); // Estado para o tipo do toast (success, error, etc.)
    const [token, setToken] = useState(null)

    useEffect(() => {
        async function fetchLanchonetes() {
            try {
                const response = await axios.get(`${apiUrl}/lanchonete`);
                setLanchonetes(response.data);
            } catch (error) {
                console.error("Erro ao buscar lanchonetes: ", error);
            }
        }

        fetchLanchonetes();
    }, []);

    return (
        <PrivateRouter tipoUsuario={'cliente'}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.filters}>
                        <div className={styles.searchContainer}>
                            <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                            <input type="text" placeholder="Buscar lanchonetes..." className={styles.searchBar} />
                        </div>
                        <FontAwesomeIcon icon={faStar} className={styles.icon}/>
                        <FontAwesomeIcon icon={faSliders} className={styles.icon}/>
                    </div>
                    <div className={styles.cardsContainer}>
                        {lanchonetes.map(lanchonete => (
                            <Link href={`/lanchonete/${lanchonete.id}`} key={lanchonete.id} className={styles.card}>
                                <div className={styles.cardImage}>
                                    <img src={lanchonete.imagem} alt={lanchonete.nome}/>
                                </div>
                                <div className={styles.divInfo}>
                                    <h3>{lanchonete.nome}</h3>
                                    <p>{lanchonete.endereco.bairro}, {lanchonete.endereco.cidade} - {lanchonete.endereco.estado}</p>
                                    <p>...</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            {showToast && <Toast message={toastMessage} type={toastType} />}
        </PrivateRouter>
    );
}
