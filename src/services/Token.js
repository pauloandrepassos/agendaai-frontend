import jwt from "jsonwebtoken"

export function isTokenValid(token) {
    if(!token) {
        return false
    }
    try {
        const decoded = jwt.decode(token);
        if(decoded.exp * 1000 < Date.now()) {
            return { isValid: false, status: "expirado"}
        }
        return { isValid: true, status: "valido"}
    } catch (error) {
        console.error('erro ao decodificar token')
        return { isValid: falso, status: "invalido"}
    }
}

export function decodeToken(token) {
    if (!token) {
        return null;
    }
    try {
        const decoded = jwt.decode(token);
        return decoded;
    } catch (error) {
        console.error('erro ao decodificar token');
        return null;
    }
}