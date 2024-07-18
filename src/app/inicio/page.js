import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Inicio() {
    return (
        <div>
            <Navbar />
            <Link href={'/auth/signup'}>Cadastro</Link>
            <Link href={'/auth/login'}>Login</Link>
            <Link href={'/cadastrarLanchonete'}>Cadastrar Lanchonete</Link>
        </div>
    )
}