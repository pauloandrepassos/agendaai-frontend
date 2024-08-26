"use client";
import PrivateRouter from "@/components/PrivateRouter";
import { useEffect, useState } from "react";
import styles from './lanchonete.module.css';
import Image from "next/image";
import Loading from "@/components/Loading";
import { apiUrl, wsApiUrl } from "@/config/api";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faClock, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import CardLanche from "@/components/CardLanche";
import LancheModal from "@/components/LancheModal";
import Toast from "@/components/Toast";

export default function LanchontePage() {
    const [lanchonete, setLanchonete] = useState(null);
    const [lanches, setLanches] = useState([]);
    const [isLoadingLanches, setIsLoadingLanches] = useState(true);
    const [erro, setErro] = useState(null);
    const [tipoSelecionado, setTipoSelecionado] = useState("Todos");
    const [horarioSelecionado, setHorarioSelecionado] = useState("Todos");
    const [lancheSelecionado, setLancheSelecionado] = useState(null); // Estado para o lanche selecionado
    const [showToast, setShowToast] = useState(false); // Estado para controlar a exibição do toast
    const [toastMessage, setToastMessage] = useState(''); // Estado para a mensagem do toast
    const [toastType, setToastType] = useState('success'); // Estado para o tipo do toast (success, error, etc.)

    const { id } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();

    const showToastMessage = (message, type = 'success') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000); // Exibe o toast por 3 segundos
    };

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
                setIsLoadingLanches(false);
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchLanchonete();
        fetchLanches();
    }, [id]);

    useEffect(() => {
        const lancheId = searchParams.get('lanche');
        if (lancheId && lanches.length > 0) {
            const lanche = lanches.find(l => l.id === parseInt(lancheId));
            if (lanche) {
                setLancheSelecionado(lanche);
            }
        }
    }, [searchParams, lanches]);

    const lanchesFiltrados = lanches.filter(lanche =>
        (tipoSelecionado === "Todos" || lanche.tipo === tipoSelecionado) &&
        (horarioSelecionado === "Todos" || lanche.horario === horarioSelecionado)
    );

    const handleSelectTipo = (e) => {
        setTipoSelecionado(e.target.value);
    };

    const handleSelectHorario = (e) => {
        setHorarioSelecionado(e.target.value);
    };

    const handleCardClick = (idLanche) => {
        router.push(`/lanchonete/${id}?lanche=${idLanche}`);
    };

    const closeModal = () => {
        setLancheSelecionado(null);
        router.push(`/lanchonete/${id}`);
    };

    return (
        <PrivateRouter tipoUsuario={'cliente'}>
            <div className={styles.container}>
                {showToast && <Toast message={toastMessage} type={toastType} />}
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

                        {!isLoadingLanches && (
                            <>
                                <div className={styles.menuOpcoes}>
                                    <select value={tipoSelecionado} onChange={handleSelectTipo} className={styles.select}>
                                        <option value="Todos">Todos</option>
                                        <option value="Salgado">Salgado</option>
                                        <option value="Doce">Doce</option>
                                        <option value="Bolo">Bolo</option>
                                        <option value="Bebida">Bebida</option>
                                        <option value="Outro">Outros</option>
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
                                                url={`/lanchonete/${id}?lanche=${lanche.id}`}
                                                onClick={() => handleCardClick(lanche.id)}
                                            />
                                        ))
                                    ) : (
                                        <p>Nenhum lanche disponível.</p>
                                    )}
                                </div>
                            </>
                        )}

                        {lancheSelecionado && (
                            <LancheModal lanche={lancheSelecionado} onClose={closeModal} showToastMessage={showToastMessage} />
                        )}

                    </div>
                ) : (
                    <Loading />
                )}

                {showToast && <Toast message={toastMessage} type={toastType} />}
            </div>
        </PrivateRouter>
    );
}
