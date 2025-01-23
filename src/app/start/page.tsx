import AboutUs from "@/components/AboutUs"
import Features from "@/components/Features"
import LobsterText from "@/components/form/LobsterText"
import PrimaryButton from "@/components/form/PrimaryButton"
import SecondaryButton from "@/components/form/SecondaryButton"
import Navbar from "@/components/layout/Navbar"
import Team from "@/components/Team"
import Link from "next/link"


export default function Start() {
  return (
    <div className="">
      <section className="bg-primary">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-3">
          <Link href="/">
            <img src="/logo-agendaai.png" alt="Logo" className="w-12 h-12" />
          </Link>
          <div>
            <Link className="bg-[#fffff0] px-4 py-3 rounded-lg font-bold text-primary" href={"/auth/login"}>
            Entrar
          </Link>
          </div>
        </div>
      </section>
      <div
        className="relative flex flex-col items-center justify-center bg-cover bg-center py-20 px-5"
        style={{ backgroundImage: "url('/start-image-1.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative z-10 text-center max-w-2xl flex flex-col gap-4">
          <LobsterText className="text-[#fffff0] text-7xl">
            Não <span className="text-primary">espere</span> pelo seu lanche, faça ele esperar <span className="text-primary">por você</span>!
          </LobsterText>
          <p className="text-[#fffff0] font-bold text-lg">Um maior controle de sua rotina na palma da sua mão</p>
          <div className="flex gap-4">
            <PrimaryButton>
              <Link href="/auth/login" className="font-bold">Entrar</Link>
            </PrimaryButton>
            <SecondaryButton>
              <Link href="/auth/register" className="font-bold">Cadastrar</Link>
            </SecondaryButton>
          </div>
        </div>
      </div>
      <AboutUs />
      <Features />
      <Team />
    </div>
  )
}