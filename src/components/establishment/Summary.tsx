import { Lobster } from "next/font/google";
import ContentCard from "../layout/ContentCard";

const lobster = Lobster({ subsets: ["latin"], weight: "400" })

interface SummaryProps {
    className?: string
}

export default function Summary({className}:SummaryProps) {
    return (
        <section className={`${className}`}>
            <h2 className={`text-2xl text-center font-semibold text-gray-800 mb-4 ${lobster.className}`}>Resumo do Dia</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <ContentCard className="flex sm:flex-col items-center justify-between p-6 text-center">
                    <h3 className="text-base font-bold text-gray-800">Pedidos Pendentes</h3>
                    <p className="text-2xl font-semibold text-red-600 mt-2">9</p>
                </ContentCard>

                <ContentCard className="flex sm:flex-col items-center justify-between p-6 text-center">
                    <h3 className="text-base font-bold text-gray-800">Pedidos Concluídos</h3>
                    <p className="text-2xl font-semibold text-green-600 mt-2">17</p>
                </ContentCard>

                <ContentCard className="flex sm:flex-col items-center justify-between p-6 text-center">
                    <h3 className="text-base font-bold text-gray-800">Lanches Vendidos</h3>
                    <p className="text-2xl font-semibold text-blue-600 mt-2">32</p>
                </ContentCard>

                <ContentCard className="flex sm:flex-col items-center justify-between p-6 text-center">
                    <h3 className="text-base font-bold text-gray-800">Faturamento Diário</h3>
                    <p className="text-2xl font-semibold text-yellow-600 mt-2">R$ 157,00</p>
                </ContentCard>
            </div>
        </section>
    )
}