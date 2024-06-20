import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Inicio() {
    return (
        <div>
            <Navbar />
            <Link href={'/auth/signup'}>Cadastro</Link>
        </div>
    )
}