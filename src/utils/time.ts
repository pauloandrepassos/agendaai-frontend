export function formatarHorario(horario: string): string {
    const [hora, minutos] = horario.split(":");

    return `${hora}:${minutos}`;
}

export function formatarData(dataISO: string): string {
    const data = new Date(dataISO);

    const dia = data.getDate().toString().padStart(2, "0");
    const mes = (data.getMonth() + 1).toString().padStart(2, "0");
    const ano = data.getFullYear();

    return `${dia}/${mes}/${ano}`;
}

export function formatarDataComDia(dataISO: string): string {
    const data = new Date(dataISO);

    const diasDaSemana = [
        "domingo",
        "segunda-feira",
        "terça-feira",
        "quarta-feira",
        "quinta-feira",
        "sexta-feira",
        "sábado",
    ];

    const diaDaSemana = diasDaSemana[data.getDay()];

    const dia = data.getDate().toString().padStart(2, "0");
    const mes = (data.getMonth() + 1).toString().padStart(2, "0");
    const ano = data.getFullYear();

    return `${diaDaSemana}, ${dia}/${mes}/${ano}`;
}