import LobsterText from "./form/LobsterText";
import { FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";

export default function Team() {
    return (
        <section className="bg-secondary p-5x py-20">
            <LobsterText className="text-5xl text-[#fffff0] text-center">
                Nossa equipe
            </LobsterText>
            <div className="flex flex-col md:flex-row md:gap-5 mt-4 m-auto justify-center">
                {/* Card 1 */}
                <div className="p-5 rounded-lg flex flex-col items-center gap-4">
                    <div className="max-w-28 overflow-hidden rounded-lg">
                        <img src="/michael.png" alt="Foto de Carlos Michael" />
                    </div>
                    <h1 className="text-[#fffff0] font-bold text-xl">Carlos Michael</h1>
                    <div className="flex gap-3">
                        <a
                            href="https://www.instagram.com/carlosmichaels_/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#fffff0] hover:text-[#ffc107]"
                        >
                            <FaInstagram size={24} />
                        </a>
                        <a
                            href="http://www.linkedin.com/in/carlos-michael-da-silva-sousa-319370336"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#fffff0] hover:text-blue-500"
                        >
                            <FaLinkedin size={24} />
                        </a>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="p-5 rounded-lg flex flex-col items-center gap-4">
                    <div className="max-w-28 overflow-hidden rounded-lg">
                        <img src="/eric.jpeg" alt="Foto de Francisco Eric" />
                    </div>
                    <h1 className="text-[#fffff0] font-bold text-xl">Francisco Eric</h1>
                    <div className="flex gap-3">
                        <a
                            href="https://www.instagram.com/ericsantos_777/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#fffff0] hover:text-[#ffc107]"
                        >
                            <FaInstagram size={24} />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/francisco-eric-santos-81767025b"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#fffff0] hover:text-blue-500"
                        >
                            <FaLinkedin size={24} />
                        </a>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="p-5 rounded-lg flex flex-col items-center gap-4">
                    <div className="max-w-28 overflow-hidden rounded-lg">
                        <img src="/pa.jpg" alt="Foto de Paulo André" />
                    </div>
                    <h1 className="text-[#fffff0] font-bold text-xl">Paulo André</h1>
                    <div className="flex gap-3">
                        <a
                            href="https://instagram.com/pauloandre.passos"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#fffff0] hover:text-[#ffc107]"
                        >
                            <FaInstagram size={24} />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/paulo-andr%C3%A9-dos-reis-passos-277693200/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#fffff0] hover:text-blue-500"
                        >
                            <FaLinkedin size={24} />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
