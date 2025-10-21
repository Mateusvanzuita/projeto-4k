"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import SplashScreen from "@/components/splash-screen"

export default function HomePage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // Redirect based on user role
        if (user.role === "coach") {
          router.push("/coach/dashboard")
        } else if (user.role === "aluno") {
          router.push("/aluno/dashboard")
        }
      } else {
        // Show splash then redirect to login
        const timer = setTimeout(() => {
          router.push("/auth/login")
        }, 3000)
        return () => clearTimeout(timer)
      }
    }
  }, [user, isLoading, router])

  return <SplashScreen />
}
