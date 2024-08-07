"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import PrivateRouter from "@/components/PrivateRouter";
import axios from "axios";
import styles from './home.module.css';
import { apiUrl } from "@/config/api";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders, faStar, faSearch } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
    const [lanchonetes, setLanchonetes] = useState([]);

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
                <Navbar />
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
        </PrivateRouter>
    );
}
