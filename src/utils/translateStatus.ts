export const translateStatus = (status: string): string => {
    const statusTranslations: { [key: string]: string } = {
        pending: "Pendente",
        completed: "Concluído",
        canceled: "Cancelado",
    };

    return statusTranslations[status] || "Desconhecido";
};