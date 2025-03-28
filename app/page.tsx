"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./components/auth-provider"
import { Loader2 } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push("/users")
      } else {
        router.push("/login")
      }
    }
  }, [isAuthenticated, loading, router])

  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2">Redirecting...</span>
    </div>
  )
}

