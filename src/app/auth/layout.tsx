"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter()
  useEffect(()=> {
    const getToken = async () => {
      const token = await localStorage.getItem("token")
      if(token) {
        router.push("/")
      }
    }
    getToken()
  })
  return (
    <div
    className="min-h-screen flex items-center justify-center bg-cover bg-center"
    style={{ backgroundImage: "url('/background.jpg')" }}
    >
        {children}
    </div>
  )
}