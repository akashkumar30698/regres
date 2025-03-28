"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../components/auth-provider"
import { UserCard } from "../components/user-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Loader2, LogOut, Search } from "lucide-react"
import { toast } from "sonner"
import type { User } from "../lib/types"
import { fetchUsers } from "../lib/api"

export default function UsersPage() {
  const router = useRouter()
  const { isAuthenticated, logout } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    const loadUsers = async () => {
      try {
        setLoading(true)
        const data = await fetchUsers(currentPage)
        setUsers(data.data)
        setTotalPages(data.total_pages)
      } catch (error) {
        console.log("some error occured :",error)
        toast(
       "Failed to load users. Please try again."
        )
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [isAuthenticated, router, currentPage, toast])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleDeleteUser = (id: number) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id))
    toast(
      "User has been successfully deleted."
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading users...</span>
        </div>
      ) : (
        <>
          {(() => {
            const filteredUsers = users.filter((user) => {
              const searchLower = searchTerm.toLowerCase()
              return (
                user.first_name.toLowerCase().includes(searchLower) ||
                user.last_name.toLowerCase().includes(searchLower) ||
                user.email.toLowerCase().includes(searchLower)
              )
            })

            if (filteredUsers.length === 0 && searchTerm) {
              return (
                <div className="flex h-64 flex-col items-center justify-center text-center">
                  <p className="text-lg font-medium">No users found</p>
                  <p className="text-muted-foreground">Try a different search term or clear the search</p>
                  <Button variant="outline" className="mt-4" onClick={() => setSearchTerm("")}>
                    Clear Search
                  </Button>
                </div>
              )
            }

            return (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredUsers.map((user) => (
                  <UserCard key={user.id} user={user} onDelete={handleDeleteUser} />
                ))}
              </div>
            )
          })()}

          {users.length > 0 && !searchTerm && (
         <Pagination className="mt-6">
         <PaginationContent>
           <PaginationItem>
             <button
               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
               disabled={currentPage === 1}
               className={`p-2 rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
             >
               <PaginationPrevious />
             </button>
           </PaginationItem>
           <PaginationItem>
             Page {currentPage} of {totalPages}
           </PaginationItem>
           <PaginationItem>
             <button
               onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
               disabled={currentPage === totalPages}
               className={`p-2 rounded ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
             >
               <PaginationNext />
             </button>
           </PaginationItem>
         </PaginationContent>
       </Pagination>
       
        
          )}
        </>
      )}
    </div>
  )
}

