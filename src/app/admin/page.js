"use client"
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';
import Navbar from "@/components/Navbar";
import PrivateRouter from '@/components/PrivateRouter';
import Link from 'next/link';

export default function Admin() {
    const router = useRouter()

    const handleViewPendingApprovals = () => {
        router.push('/admin/solicitacoes-pendentes');
    };

    return (
        <PrivateRouter tipoUsuario={'admin'} className={styles.adminContainer}>
            <div className={styles.container}>
                <Navbar />
                <div className={styles.dashboard}>
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Atividades Recentes</h2>
                        <ul className={styles.activityList}>
                            <li>Aprovação pendente: Lanchonete X</li>
                            <li>Novo cliente cadastrado: João Silva</li>
                            <li>Nova reserva: Lanche Y na Lanchonete Z</li>
                        </ul>
                        <button className={styles.viewAllButton} onClick={handleViewPendingApprovals}>
                            Ver Todas as Solicitações Pendentes
                        </button>
                    </section>
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Estatísticas</h2>
                        <div className={styles.stats}>
                            <Link href={`/`} className={styles.stat}>
                                <span className={styles.statNumber}>10</span>
                                <span className={styles.statLabel}>Lanchonetes Cadastradas</span>
                            </Link>
                            <Link href={`/admin/usuarios`} className={styles.stat}>
                                <span className={styles.statNumber}>50</span>
                                <span className={styles.statLabel}>Clientes Cadastrados</span>
                            </Link>
                            <Link href={`/`} className={styles.stat}>
                                <span className={styles.statNumber}>120</span>
                                <span className={styles.statLabel}>Reservas Feitas</span>
                            </Link>
                            <Link href={`/`} className={styles.stat}>
                                <span className={styles.statNumber}>300</span>
                                <span className={styles.statLabel}>Lanches Vendidos</span>
                            </Link>
                        </div>
                    </section>
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Gráficos e Relatórios</h2>
                        <div className={styles.charts}>
                            {/* Placeholder para os gráficos */}
                            <div className={styles.chartPlaceholder}>Gráfico de crescimento de cadastros</div>
                            <div className={styles.chartPlaceholder}>Gráfico de reservas por período</div>
                        </div>
                    </section>
                </div>
            </div>
        </PrivateRouter>
    )
}
