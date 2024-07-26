"use client"
import styles from './dashboard.module.css';
import Navbar from "@/components/Navbar";
import PrivateRouter from '@/components/PrivateRouter';
import Link from "next/link";

export default function Dashboard() {

    return (
        <PrivateRouter tipoUsuario={"gerente"}>
            <div className={styles.container}>
                <Navbar />
                <div className={styles.content}>
                    dashboard
                </div>
            </div>
        </PrivateRouter>

    );
}
