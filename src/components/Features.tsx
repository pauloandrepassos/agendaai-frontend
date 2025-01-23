import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LobsterText from "./form/LobsterText";
import { faBook, faBookOpen, faChartArea, faChartBar } from "@fortawesome/free-solid-svg-icons";

export default function Features() {
    return (
        <section className="p-5 max-w-7xl mx-auto">
            <LobsterText className="text-5xl text-primary text-center">
                Funcionalidades
            </LobsterText>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
                <div>
                    <div className="text-primary">
                        <FontAwesomeIcon icon={faBook} className="w-20 h-20" />
                    </div>
                    <h1 className="text-secondary text-2xl font-bold">
                        Reserva antecipada
                    </h1>
                    <p className="text-justify font-semibold">
                        Os clientes podem agendar seus pedidos com hora marcada, garantindo seus lanches preferidos sem enfrentar filas ou esperar.
                    </p>
                </div>
                <div>
                    <div className="text-primary">
                        <FontAwesomeIcon icon={faBookOpen} className="w-20 h-20" />
                    </div>
                    <h1 className="text-secondary text-2xl font-bold">
                        Cardápio digital
                    </h1>
                    <p className="text-justify font-semibold">
                        Visualização completa e interativa dos produtos disponíveis, com possibilidade de personalização e escolha rápida.
                    </p>
                </div>
                <div>
                    <div className="text-primary">
                        <FontAwesomeIcon icon={faChartBar} className="w-20 h-20" />
                    </div>
                    <h1 className="text-secondary text-2xl font-bold">
                        Previsão e Estatísticas
                    </h1>
                    <p className="text-justify font-semibold">
                        Vendedores acessam dados de pedidos e tendências, otimizando o estoque e melhorando o planejamento para evitar perdas e maximizar lucros.
                    </p>
                </div>
            </div>
            <div className="max-h-[300px] flex items-center justify-center overflow-hidden mt-5 rounded-lg">
                <img
                    className="max-h-full w-full object-contain"
                    src="/image-features.png"
                    alt=""
                />
            </div>

        </section>
    )
}