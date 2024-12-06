import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Home() {
    return (
        <ProtectedRoute allowedTypes={["client"]}>
            <div>
                <h1>Bem vindo</h1>
            </div>
        </ProtectedRoute>
    )
}