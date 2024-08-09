"use client";
import Navbar from "@/components/Navbar";
import PrivateRouter from "@/components/PrivateRouter";
import { useEffect, useState } from "react";
import styles from './lanchonete.module.css';
import Image from "next/image";
import Loading from "@/components/Loading";
import { apiUrl } from "@/config/api";
import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faClock, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import CardLanche from "@/components/CardLanche";

export default function LanchontePage() {
    const [lanchonete, setLanchonete] = useState(null);
    const [lanches, setLanches] = useState([]);
    const [erro, setErro] = useState(null);
    const [tipoSelecionado, setTipoSelecionado] = useState("Todos");
    const [horarioSelecionado, setHorarioSelecionado] = useState("Todos");
    const { id } = useParams();

    useEffect(() => {
        const fetchLanchonete = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("Token não encontrado");
                return;
            }

            try {
                const response = await fetch(`${apiUrl}/lanchonete/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'token': token
                    }
                });

                if (!response.ok) {
                    setErro(response.erro);
                    throw new Error('Erro ao buscar lanchonete');
                }

                const data = await response.json();
                setLanchonete(data);
            } catch (error) {
                console.error(error.message);
            }
        };

        const fetchLanches = async () => {
            try {
                const response = await fetch(`${apiUrl}/lanchonete/${id}/lanche`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'token': localStorage.getItem('token')
                    }
                });

                if (!response.ok) {
                    throw new Error('Erro ao buscar lanches');
                }

                const data = await response.json();
                setLanches(data);
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchLanchonete();
        fetchLanches();
    }, [id]);

    const lanchesFiltrados = lanches.filter(lanche => 
        (tipoSelecionado === "Todos" || lanche.tipo === tipoSelecionado) /*&&
        /*(horarioSelecionado === "Todos" || lanche.horario === horarioSelecionado)*/
    );

    const handleSelectTipo = (e) => {
        setTipoSelecionado(e.target.value);
    };

    const handleSelectHorario = (e) => {
        setHorarioSelecionado(e.target.value);
    };

    return (
        <PrivateRouter tipoUsuario={'cliente'}>
            <div className={styles.container}>
                <Navbar />
                {lanchonete ? (
                    <div className={styles.content}>
                        <div className={styles.painelLanchonete}>
                            <div className={styles.image}>
                                <Image
                                    width={500}
                                    height={300}
                                    src={lanchonete.imagem || imagemLanchonete}
                                    alt='Imagem da lanchonete'
                                />
                            </div>
                            <div className={styles.info}>
                                <h1>{lanchonete.nome}</h1>
                                <div className={styles.textDescription}>
                                    <div className={styles.singleInfo}>
                                        <div className={styles.divIcon}>
                                            <FontAwesomeIcon className={styles.icon} icon={faLocationDot} />
                                        </div>
                                        <h3>
                                            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lanchonete.endereco.logradouro}, ${lanchonete.endereco.numero}, ${lanchonete.endereco.bairro}, ${lanchonete.endereco.cidade}, ${lanchonete.endereco.estado}, ${lanchonete.endereco.cep}`)}`}
                                                target="_blank" rel="noopener noreferrer">
                                                {lanchonete.endereco.logradouro}, {lanchonete.endereco.numero}, {lanchonete.endereco.bairro}, {lanchonete.endereco.cidade}, {lanchonete.endereco.estado}, {lanchonete.endereco.cep}
                                            </a>
                                        </h3>
                                    </div>
                                    <div className={styles.singleInfo}>
                                        <div className={styles.divIcon}>
                                            <FontAwesomeIcon className={styles.icon} icon={faCalendarDays} />
                                        </div>
                                        <h3>{lanchonete.horario_funcionamento}</h3>
                                    </div>
                                    <div className={styles.singleInfo}>
                                        <div className={styles.divIcon}>
                                            <FontAwesomeIcon className={styles.icon} icon={faClock} />
                                        </div>
                                        <h3>{lanchonete.horario_abertura} - {lanchonete.horario_fechamento}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.menuOpcoes}>
                            <select value={tipoSelecionado} onChange={handleSelectTipo} className={styles.select}>
                                <option value="Todos">Todos</option>
                                <option value="Salgado">Salgado</option>
                                <option value="Doce">Doce</option>
                                <option value="Bolo">Bolo</option>
                                <option value="Bebida">Bebida</option>
                                <option value="Outros">Outros</option>
                            </select>

                            <select value={horarioSelecionado} onChange={handleSelectHorario} className={styles.select}>
                                <option value="Todos">Todos os horários</option>
                                <option value="Manhã">Manhã</option>
                                <option value="Tarde">Tarde</option>
                                <option value="Noite">Noite</option>
                            </select>
                        </div>

                        <h3>Lanches Disponíveis</h3>

                        <div className={styles.lanchesContainer}>
                            {lanchesFiltrados.length > 0 ? (
                                lanchesFiltrados.map((lanche) => (
                                    <CardLanche
                                        key={lanche.id}
                                        id={lanche.id}
                                        nome={lanche.nome}
                                        imagem={lanche.imagem}
                                        preco={lanche.preco}
                                        url={`/`}
                                    />
                                ))
                            ) : (
                                <p>Nenhum lanche disponível.</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <Loading />
                )}
            </div>
        </PrivateRouter>
    );
}
