"use client"
import styles from './dashboard.module.css';
import Navbar from "@/components/Navbar";
import PrivateRouter from '@/components/PrivateRouter';
import Image from 'next/image';
import Link from "next/link";
import imagemLanchonete from '/public/imagem-lanchonete1.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faClock, faLocationDot, faHamburger, faClipboardList, faCalendarAlt, faChartLine } from '@fortawesome/free-solid-svg-icons';

export default function Dashboard() {

    return (
        <PrivateRouter tipoUsuario={"gerente"}>
            <div className={styles.container}>
                <Navbar />
                <div className={styles.content}>
                    <div className={styles.painelLanchonete}>
                        <div className={styles.image}>
                            <Image
                                src={imagemLanchonete}
                                alt='Imagem da lanchonete'
                            />

                        </div>
                        <div className={styles.info}>
                            <h1>Lanchonete do Seu Zé</h1>
                            <div className={styles.textDescription}>
                                <div className={styles.singleInfo}>
                                    <div className={styles.divIcon}>
                                        <FontAwesomeIcon className={styles.icon} icon={faLocationDot} />
                                    </div>
                                    <h3>
                                        <a href={"enderecoGoogleMapsURL"} target="_blank" rel="noopener noreferrer">
                                            R. São Sebastião, 407 - Malva, Picos - PI, 64600-108
                                        </a>
                                    </h3>
                                </div>
                                <div className={styles.singleInfo}>
                                    <div className={styles.divIcon}>
                                        <FontAwesomeIcon className={styles.icon} icon={faCalendarDays} />
                                    </div>
                                    <h3>SEG - SEX</h3>
                                </div>
                                <div className={styles.singleInfo}>
                                    <div className={styles.divIcon}>
                                        <FontAwesomeIcon className={styles.icon} icon={faClock} />
                                    </div>
                                    <h3> 8:00 - 11:00 / 15:00 - 21:00</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className={styles.linksContainer}>
                        <Link href='/horario-funcionamento' className={styles.linkButton}>
                            <FontAwesomeIcon icon={faClock} /> Horários
                        </Link>
                        <Link href='/lanches' className={styles.linkButton}>
                            <FontAwesomeIcon icon={faHamburger} /> Lanches
                        </Link>
                        <Link href='/cardapio' className={styles.linkButton}>
                            <FontAwesomeIcon icon={faClipboardList} /> Cardápio
                        </Link>
                        <Link href='/agendamentos' className={styles.linkButton}>
                            <FontAwesomeIcon icon={faCalendarAlt} /> Agendamentos
                        </Link>
                        <Link href='/relatorios' className={styles.linkButton}>
                            <FontAwesomeIcon icon={faChartLine} /> Relatórios
                        </Link>
                    </div>

                    
                </div>
            </div>
        </PrivateRouter>
    );
}
