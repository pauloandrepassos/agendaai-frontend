// pages/lanchonete/adicionar-horario.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import styles from "./horario-funcionamento.module.css";
import { apiUrl } from "@/config/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import Loading from "@/components/Loading";
import PrivateRouter from "@/components/PrivateRouter";

library.add(fas);

export default function AdicionarHorario() {
    const [horarios, setHorarios] = useState([]);
    const [diaSemana, setDiaSemana] = useState("");
    const [horarioAbertura, setHorarioAbertura] = useState("");
    const [horarioFechamento, setHorarioFechamento] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [idLanchonete, setIdLanchonete] = useState(2)
    const router = useRouter();

    const fetchHorarios = async () => {
        try {
            const response = await fetch(`${apiUrl}/lanchonete/${idLanchonete}/horarios`);
            const data = await response.json();
            setHorarios(data);
        } catch (error) {
            setMensagem(`Erro ao buscar horários: ${error.message}`);
        }
    };

    useEffect(() => {
        fetchHorarios();
    }, []);

    const handleDelete = async (horarioId) => {

        try {
            const response = await fetch(`${apiUrl}/lanchonete/${idLanchonete}/horario/${horarioId}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (response.ok) {
                setMensagem(result.message);
                fetchHorarios(); // Atualizar os horários após a exclusão
            } else {
                setMensagem(result.error);
            }
        } catch (error) {
            setMensagem(`Erro ao deletar horário: ${error.message}`);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();


        const dados = {
            diaSemana,
            horarioAbertura,
            horarioFechamento,
        };

        try {
            const response = await fetch(`${apiUrl}/lanchonete/${idLanchonete}/horario`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dados),
            });

            const result = await response.json();

            if (response.ok) {
                setMensagem(result.message);
                fetchHorarios(); // Chamar a função para atualizar os horários após adicionar
            } else {
                setMensagem(result.error);
            }
        } catch (error) {
            setMensagem(`Erro ao adicionar horário: ${error.message}`);
        }
    };

    const diasSemana = ['SEG-SEX', 'SAB', 'DOM'];

    const organizarHorariosPorDia = (horarios) => {
        const horariosPorDia = {
            'SEG-SEX': [],
            'SAB': [],
            'DOM': [],
        };

        horarios.forEach(horario => {
            horariosPorDia[horario.diaSemana].push({
                id: horario.id,
                texto: `${horario.horarioAbertura} - ${horario.horarioFechamento}`
            });
        });

        const maxLinhas = Math.max(
            horariosPorDia['SEG-SEX'].length,
            horariosPorDia['SAB'].length,
            horariosPorDia['DOM'].length
        );

        const linhas = [];
        for (let i = 0; i < maxLinhas; i++) {
            linhas.push({
                'SEG-SEX': horariosPorDia['SEG-SEX'][i] || null,
                'SAB': horariosPorDia['SAB'][i] || null,
                'DOM': horariosPorDia['DOM'][i] || null
            });
        }

        return linhas;
    };

    const linhas = organizarHorariosPorDia(horarios);

    return (
        <PrivateRouter tipoUsuario={'gerente'}>
            <div className={styles.container}>
                <Navbar />
                <div className={styles.content}>
                    <h1 className={styles.title}>Horários de Funcionamento</h1>
                    {horarios.length === 0 || (
                        <div className={styles.horarios}>
                            <h2>Horários Cadastrados</h2>

                            <table className={styles.horariosTable}>
                                <thead>
                                    <tr>
                                        {diasSemana.map(dia => (
                                            <th key={dia}>{dia}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {linhas.map((linha, index) => (
                                        <tr key={index}>
                                            {diasSemana.map(dia => (
                                                <td key={dia}>
                                                    {linha[dia] ? (
                                                        <>
                                                            {linha[dia].texto}
                                                            <FontAwesomeIcon
                                                                icon={faTrash}
                                                                onClick={() => handleDelete(linha[dia].id)}
                                                                className={styles.deleteIcon}
                                                            />
                                                        </>
                                                    ) : '-'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <h2>Adicionar Horário</h2>
                        <label className={styles.label}>
                            Dia da Semana:
                            <select
                                value={diaSemana}
                                onChange={(e) => setDiaSemana(e.target.value)}
                                className={styles.select}
                            >
                                <option value="">Selecione</option>
                                <option value="DOM">Domingo</option>
                                <option value="SEG-SEX">Segunda a Sexta</option>
                                <option value="SAB">Sábado</option>
                            </select>
                        </label>
                        <label className={styles.label}>
                            Horário de Abertura:
                            <input
                                type="time"
                                value={horarioAbertura}
                                onChange={(e) => setHorarioAbertura(e.target.value)}
                                className={styles.input}
                            />
                        </label>
                        <label className={styles.label}>
                            Horário de Fechamento:
                            <input
                                type="time"
                                value={horarioFechamento}
                                onChange={(e) => setHorarioFechamento(e.target.value)}
                                className={styles.input}
                            />
                        </label>
                        <button type="submit" className={styles.button}>
                            Adicionar Horário
                        </button>
                        {mensagem && <p className={styles.message}>{mensagem}</p>}
                    </form>
                </div>
            </div>
        </PrivateRouter>
    );
}
