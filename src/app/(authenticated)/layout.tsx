import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <Navbar />
      {children}
    </ProtectedRoute>
  )
}