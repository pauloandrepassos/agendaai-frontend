import LobsterText from "./form/LobsterText"

export default function AboutUs() {
    return (
        <section className="bg-secondary p-20">
            <LobsterText className="text-5xl text-[#fffff0] text-center">
                Sobre nós
            </LobsterText>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4 max-w-7xl m-auto">
                <div className="flex flex-col items-center justify-center">
                    <p className="text-justify text-[#fffff0] text-lg max-w-[500px] font-semibold">
                        O Agenda Aí é uma plataforma inovadora de agendamento de lanches e refeições, desenvolvida para simplificar a experiência de clientes e vendedores. Seja em cantinas, estabelecimentos institucionais ou para vendedores autônomos, nosso sistema oferece praticidade e eficiência.

                        Para clientes, proporcionamos cardápios digitais, reserva de pedidos com antecedência e pagamentos online, garantindo agilidade e comodidade.

                        Para vendedores, incluindo autônomos, oferecemos ferramentas que reduzem o overbooking, aumentam a previsibilidade da demanda e fornecem estatísticas detalhadas, melhorando o gerenciamento de estoque e maximizando lucros.

                        Com o Agenda Aí, unimos tecnologia e praticidade para beneficiar todos os envolvidos.
                    </p>
                </div>
                <div className="flex items-center justify-center">
                    <img className="w-full max-w-[500px] rounded-lg" src="/image-about.png" alt="" />
                </div>
            </div>
        </section>
    )
}