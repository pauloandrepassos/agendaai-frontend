"use client"
import Loading from "@/components/form/LoadingSpinner"
import { useAuth } from "@/hooks/useAuth"
import { Lobster } from "next/font/google"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const lobster = Lobster({ subsets: ["latin"], weight: "400" })

export default function Start() {
  const router = useRouter()
  const { isAuthenticated, userType, error } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      if (userType === "client") {
        router.push("/home")
      } else if (userType === "vendor") {
        router.push("/dashboard")
      } else if (userType === "admin") {
        router.push("/control-panel")
      }
    } else {
      router.push("/start")
    }
  }, [isAuthenticated, userType, router])

  return (
    <div className="flex items-center justify-center h-screen">
      <Loading />
    </div>
  )
}
