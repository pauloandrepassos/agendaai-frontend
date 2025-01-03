import PrimaryButton from "@/components/form/PrimaryButton"
import { Lobster } from "next/font/google"
import Link from "next/link"

const lobster = Lobster
({ subsets: ["latin"], weight: "400" })

export default function Start() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen">
      <div className="flex flex-col items-center justify-center p-8">
        <img src="/logo-agendaai.png" alt="Logo" className="w-20"/>
        <h1 className={`text-3xl sm:text-4xl text-primary text-center font-bold mb-4 ${lobster.className}`}>Bem-vindo ao Agenda Aí</h1>
        <p className="text-center mb-6">
          Faça login para acessar suas funcionalidades.
        </p>
        <Link href="/auth/login">
          <PrimaryButton>Entrar</PrimaryButton>
        </Link>
      </div>

      <div className="flex items-center justify-center bg-cover bg-center">
        <img
          src="/image-init.png"
          alt="Imagem da página inicial"
          className="max-h-[80%] max-w-[80%] object-contain rounded-3xl"
        />
      </div>
    </div>
  )
}