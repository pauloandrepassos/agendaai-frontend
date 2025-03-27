import Link from "next/link";
import { FaInstagram, FaLinkedin, FaGithub, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer({ isInitialPage = false }: { isInitialPage?: boolean }) {
    return (
        <footer
            className={`${isInitialPage ? "bg-primary" : "bg-secondary"
                } text-[#fffff0] py-8`}
        >
            <div className="max-w-7xl mx-auto px-5 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Sobre o Projeto */}
                <div>
                    <h3 className="text-lg font-bold mb-4">Agenda Aí</h3>
                    <p className="text-sm">
                        Uma plataforma para facilitar pedidos em lanchonetes e cantinas escolares, colocando o controle na palma da sua mão.
                    </p>
                </div>

                {/* Contatos */}
                <div>
                    <h3 className="text-lg font-bold mb-4">Contatos</h3>
                    <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                            <FaPhone />
                            <span>(89) 99992-1812</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <FaEnvelope />
                            <span>atendimento.agendaai@gmail.com</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <FaMapMarkerAlt />
                            <span>Picos, PI - Brasil</span>
                        </li>
                    </ul>
                </div>

                {/* Redes Sociais */}
                <div>
                    <h3 className="text-lg font-bold mb-4">Redes Sociais</h3>
                    <div className="flex gap-4">
                        <a
                            href="https://instagram.com/agendeaii"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#ffc107]"
                        >
                            <FaInstagram size={24} />
                        </a>
                        {/*<a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#ffc107]"
                        >
                            <FaLinkedin size={24} />
                        </a>*/}
                        <a
                            href="https://github.com/agendeaii"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#ffc107]"
                        >
                            <FaGithub size={24} />
                        </a>
                    </div>
                </div>
            </div>
            <div className="text-center text-sm mt-8 border-t border-[#fffff0] pt-4">
                &copy; {new Date().getFullYear()} Agenda Aí. Todos os direitos reservados.
            </div>
        </footer>
    );
}
