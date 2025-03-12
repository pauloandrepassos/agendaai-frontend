import AboutUs from "@/components/AboutUs"
import Features from "@/components/Features"
import LobsterText from "@/components/form/LobsterText"
import PrimaryButton from "@/components/form/PrimaryButton"
import SecondaryButton from "@/components/form/SecondaryButton"
import Footer from "@/components/layout/Footer"
import Navbar from "@/components/layout/Navbar"
import Team from "@/components/Team"
import Link from "next/link"


export default function Start() {
  return (
    <div className="">
      <div
        className="relative flex flex-col items-center justify-center bg-cover bg-center min-h-[90vh] py-20 px-5"
        style={{ backgroundImage: "url('/start-image-1.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative z-10 text-center max-w-2xl flex flex-col gap-5">
          <LobsterText className="text-[#fffff0] text-7xl">
            Não <span className="text-primary">espere</span> pelo seu lanche, faça ele esperar <span className="text-primary">por você</span>!
          </LobsterText>
          <p className="text-[#fffff0] font-bold text-lg">Um maior controle de sua rotina na palma da sua mão</p>
          <div className="grid grid-cols-2 gap-4">
            <PrimaryButton className="p-0">
              <Link href="/auth/login" className="font-bold flex items-center justify-center h-full">Entrar</Link>
            </PrimaryButton>
            <SecondaryButton>
              <Link href="/auth/register" className="font-bold flex items-center justify-center h-full">Cadastrar</Link>
            </SecondaryButton>
          </div>
        </div>
      </div>
      <AboutUs />
      <Features />
      <Team />
      <Footer isInitialPage={true}/>
    </div>
  )
}