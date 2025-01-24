import { apiUrl } from "@/config/api";
import axios from "axios";

export async function fetchAuthenticatedUser() {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Usuário não está autenticado.");
    }

    try {
        const response = await axios.get(`${apiUrl}/user-by-token`, {
            headers: {
                token: `${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar usuário autenticado:", error);
        return null
    }
}
