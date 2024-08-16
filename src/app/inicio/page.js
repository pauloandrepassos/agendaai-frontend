import Navbar from "@/components/Navbar";
import Link from "next/link";
import styes from './inicio.module.css'

export default function Inicio() {
    return (
        <div className={styes.inicial_page}>
            <div className={styes.section1}>
                <div className={styes.center}>
                    <h1>Agenda Aí</h1>
                    <h2>Não espere pelo lanche,  faça ele esperar por você!!!</h2>
                    <div className={styes.botoes}>
                        <Link href={`/auth/login`}>Login</Link>
                        <Link href={`/auth/signup`}>Cadastro</Link>
                    </div>
                </div>
            </div>
            <div className={styes.section2}>
                <div className={styes.botoes2}>
                    <Link href={`/cadastrarLanchonete`}>Cadastrar Lanchonete</Link>
                </div>
            </div>
            
        </div>
    )
}