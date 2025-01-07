import { jwtDecode } from "jwt-decode"

export function useAuth() {
  if (typeof window === "undefined") return { isAuthenticated: false, userType: null, error: "server" }

  const token = localStorage.getItem("token")

  if (!token) return { isAuthenticated: false, userType: null, error: "no_token" }

  try {
    const decoded: IDecodedToken = jwtDecode(token)

    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token") // Token expirado
      return { isAuthenticated: false, userType: null, error: "token_expired" }
    }

    return { isAuthenticated: true, userType: decoded.type, error: null }
  } catch {
    localStorage.removeItem("token") // Token inválido
    return { isAuthenticated: false, userType: null, error: "invalid_token" }
  }
}
