"use client"
import { useEffect, useState } from 'react';
import PrivateRouter from "@/components/PrivateRouter";
import styles from './lanche.module.css';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { apiUrl } from '@/config/api';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faSliders, faStar } from '@fortawesome/free-solid-svg-icons';
import CardLanche from '@/components/CardLanche';

export default function Lanche() {
    const router = useRouter();
    const { id } = useParams();
    const [lanches, setLanches] = useState([]);

    useEffect(() => {
        if (id) {
            const fetchLanches = async () => {
                try {
                    const response = await axios.get(`${apiUrl}/lanchonete/${id}/lanche`);
                    setLanches(response.data);
                } catch (error) {
                    console.error('Erro ao buscar lanches:', error);
                }
            };
            fetchLanches();
        }
    }, [id]);

    return (
        <PrivateRouter tipoUsuario={'gerente'}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.filters}>
                        <div className={styles.searchContainer}>
                            <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                            <input type="text" placeholder="Buscar lanche..." className={styles.searchBar} />
                        </div>
                        <Link href={`/lanchonete/${id}/adicionar-lanche`} className={styles.button}>
                            Adicionar Lanche
                            <FontAwesomeIcon icon={faPlus}/>
                        </Link>
                    </div>
                    <div className={styles.lanchesContainer}>
                        {lanches.map((lanche) => (
                            <CardLanche
                                id={lanche.id}
                                nome={lanche.nome}
                                imagem={lanche.imagem}
                                preco={lanche.preco}
                                url={`/`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </PrivateRouter>
    );
}
