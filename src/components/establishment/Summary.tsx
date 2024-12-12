export default function Summary() {
    return (
        <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumo do Dia</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#FFFFF0] flex sm:flex-col items-center justify-between shadow-[2px_3px_2px_0_#FF0000] rounded-2xl p-6 text-center">
                    <h3 className="text-lg font-bold text-gray-800">Pedidos Pendentes</h3>
                    <p className="text-2xl font-semibold text-red-600 mt-2">9</p>
                </div>

                <div className="bg-[#FFFFF0] flex sm:flex-col items-center justify-between shadow-[2px_3px_2px_0_#FF0000] rounded-2xl p-6 text-center">
                    <h3 className="text-lg font-bold text-gray-800">Pedidos Concluídos</h3>
                    <p className="text-2xl font-semibold text-green-600 mt-2">17</p>
                </div>

                <div className="bg-[#FFFFF0] flex sm:flex-col items-center justify-between shadow-[2px_3px_2px_0_#FF0000] rounded-2xl p-6 text-center">
                    <h3 className="text-lg font-bold text-gray-800">Lanches Vendidos</h3>
                    <p className="text-2xl font-semibold text-blue-600 mt-2">32</p>
                </div>

                <div className="bg-[#FFFFF0] flex sm:flex-col items-center justify-between shadow-[2px_3px_2px_0_#FF0000] rounded-2xl p-6 text-center">
                    <h3 className="text-lg font-bold text-gray-800">Faturamento Diário</h3>
                    <p className="text-2xl font-semibold text-yellow-600 mt-2">R$ 157,00</p>
                </div>
            </div>
        </section>
    )
}