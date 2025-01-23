import LobsterText from "./form/LobsterText"

export default function AboutUs() {
    return (
        <section className="bg-secondary p-5">
            <LobsterText className="text-5xl text-[#fffff0] text-center">
                Sobre nós
            </LobsterText>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4 max-w-7xl m-auto">
                <div className="flex flex-col items-center justify-center">
                    <p className="text-justify text-[#fffff0] text-lg max-w-[500px] font-semibold">
                        O Agenda aí é uma plataforma inovadora de agendamento de lanches e refeições em cantinas e estabelecimentos institucionais, projetada para otimizar a experiência do usuário no atendimento presencial. Através de um sistema que permite visualizar cardápios digitais, reservar pedidos com antecedência e realizar pagamentos online, oferecemos mais conveniência e rapidez para clientes. Para os vendedores, entregamos funcionalidades que reduzem o overbooking, aumentam a previsibilidade da demanda e fornecem estatísticas detalhadas, melhorando o gerenciamento de estoque e maximizando lucros.
                    </p>
                </div>
                <div className="flex items-center justify-center">
                    <img className="w-full max-w-[500px] rounded-lg" src="/image-about.png" alt="" />
                </div>
            </div>
        </section>
    )
}