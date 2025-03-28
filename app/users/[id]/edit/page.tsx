"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../../components/auth-provider"
import { UserForm } from "../../../components/user-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { User } from "../../../lib/types"
import { fetchUser, updateUser } from "../../../lib/api"

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    const loadUser = async () => {
      try {
        setLoading(true)
        const userData = await fetchUser(Number.parseInt(params.id))
        setUser(userData.data)
      } catch (error) {
        toast(
        "Failed to load user details. Please try again."
        )
        router.push("/users")
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [isAuthenticated, params.id, router, toast])

  const handleUpdate = async (updatedUser: Partial<User>) => {
    if (!user) return

    try {
      setUpdating(true)
      await updateUser(user.id, updatedUser)
      toast(
    "User has been successfully updated."
      )
      router.push("/users")
    } catch (error) {
      toast(
        "Failed to update user. Please try again."
      )
    } finally {
      setUpdating(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="container mx-auto p-4">
      <Button variant="ghost" className="mb-4" onClick={() => router.push("/users")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Users
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit User</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading user details...</span>
            </div>
          ) : user ? (
            <UserForm user={user} onSubmit={handleUpdate} isSubmitting={updating} />
          ) : (
            <p>User not found</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

