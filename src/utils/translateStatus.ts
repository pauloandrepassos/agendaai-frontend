export const translateStatus = (status: string): string => {
    const statusTranslations: { [key: string]: string } = {
        pending: "Pendente",
        completed: "Concluído",
    };

    return statusTranslations[status] || "Desconhecido";
};