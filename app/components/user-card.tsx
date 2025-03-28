"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { User } from "../lib/types"
import { deleteUser } from "../lib/api"

interface UserCardProps {
  user: User
  onDelete: (id: number) => void
}

export function UserCard({ user, onDelete }: UserCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = () => {
    router.push(`/users/${user.id}/edit`)
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteUser(user.id)
      onDelete(user.id)
    } catch (error) {
      toast(
    "Failed to delete user. Please try again."
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="font-semibold">
          {user.first_name} {user.last_name}
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={handleEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the user.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex items-center space-x-4">
          <Image
            src={user.avatar || "/next.svg"}
            alt={`${user.first_name} ${user.last_name}`}
            width={64}
            height={64}
            className="rounded-full"
          />
          <div>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit User
        </Button>
      </CardFooter>
    </Card>
  )
}

