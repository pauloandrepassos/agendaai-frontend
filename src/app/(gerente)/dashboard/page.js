"use client"
import { useEffect, useState } from 'react';
import styles from './dashboard.module.css';
import PrivateRouter from '@/components/PrivateRouter';
import Image from 'next/image';
import Link from "next/link";
import imagemLanchonete from '/public/imagem-lanchonete1.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faClock, faLocationDot, faHamburger, faClipboardList, faCalendarAlt, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { apiUrl } from '@/config/api';
import Loading from '@/components/Loading';

export default function Dashboard() {
    const [lanchonete, setLanchonete] = useState(null);

    useEffect(() => {
        const fetchLanchonete = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("Token não encontrado");
                return;
            }

            try {
                const response = await fetch(`${apiUrl}/lanchonete/gerente`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'token': token
                    }
                });

                if (!response.ok) {
                    throw new Error('Erro ao buscar lanchonete');
                }

                const data = await response.json();
                setLanchonete(data);
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchLanchonete();
    }, []);

    return (
        <PrivateRouter tipoUsuario={"gerente"}>
            <div className={styles.container}>
                {lanchonete ? (
                    <div className={styles.content}>
                        <div className={styles.painelLanchonete}>
                            <div className={styles.image}>
                                <Image
                                    width={500}
                                    height={300}
                                    src={lanchonete.imagem || imagemLanchonete}
                                    alt='Imagem da lanchonete'
                                />
                            </div>
                            <div className={styles.info}>
                                <h1>{lanchonete.nome}</h1>
                                <div className={styles.textDescription}>
                                    <div className={styles.singleInfo}>
                                        <div className={styles.divIcon}>
                                            <FontAwesomeIcon className={styles.icon} icon={faLocationDot} />
                                        </div>
                                        <h3>
                                            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lanchonete.endereco.logradouro}, ${lanchonete.endereco.numero}, ${lanchonete.endereco.bairro}, ${lanchonete.endereco.cidade}, ${lanchonete.endereco.estado}, ${lanchonete.endereco.cep}`)}`} 
         target="_blank" rel="noopener noreferrer">
                                                {lanchonete.endereco.logradouro}, {lanchonete.endereco.numero}, {lanchonete.endereco.bairro}, {lanchonete.endereco.cidade}, {lanchonete.endereco.estado}, {lanchonete.endereco.cep}
                                            </a>
                                        </h3>
                                    </div>
                                    <div className={styles.singleInfo}>
                                        <div className={styles.divIcon}>
                                            <FontAwesomeIcon className={styles.icon} icon={faCalendarDays} />
                                        </div>
                                        <h3>{lanchonete.horario_funcionamento}</h3>
                                    </div>
                                    <div className={styles.singleInfo}>
                                        <div className={styles.divIcon}>
                                            <FontAwesomeIcon className={styles.icon} icon={faClock} />
                                        </div>
                                        <h3>{lanchonete.horario_abertura} - {lanchonete.horario_fechamento}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className={styles.linksContainer}>
                            <Link href={`/lanchonete/${lanchonete.id}/horario-funcionamento`} className={styles.linkButton}>
                                <FontAwesomeIcon icon={faClock} /> Horários
                            </Link>
                            <Link href={`/lanchonete/${lanchonete.id}/lanche`} className={styles.linkButton}>
                                <FontAwesomeIcon icon={faHamburger} /> Lanches
                            </Link>
                            {/*<Link href='/cardapio' className={styles.linkButton}>
                                <FontAwesomeIcon icon={faClipboardList} /> Cardápio
                            </Link>*/}
                            <Link href='/agendamentos' className={styles.linkButton}>
                                <FontAwesomeIcon icon={faCalendarAlt} /> Agendamentos
                            </Link>
                            <Link href='/relatorios' className={styles.linkButton}>
                                <FontAwesomeIcon icon={faChartLine} /> Relatórios
                            </Link>
                        </div>
                    </div>
                ) : (
                    <Loading />
                )}
            </div>
        </PrivateRouter>
    );
}
