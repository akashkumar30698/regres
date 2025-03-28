import type { User } from "./types"

const BASE_URL = "https://reqres.in/api"

// Authentication
export async function loginUser(email: string, password: string) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error("Login failed")
  }

  return response.json()
}

// Users
export async function fetchUsers(page = 1) {
  const response = await fetch(`${BASE_URL}/users?page=${page}`)

  if (!response.ok) {
    throw new Error("Failed to fetch users")
  }

  return response.json()
}

export async function fetchUser(id: number) {
  const response = await fetch(`${BASE_URL}/users/${id}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch user with ID ${id}`)
  }

  return response.json()
}

export async function updateUser(id: number, userData: Partial<User>) {
  const response = await fetch(`${BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    throw new Error(`Failed to update user with ID ${id}`)
  }

  return response.json()
}

export async function deleteUser(id: number) {
  const response = await fetch(`${BASE_URL}/users/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error(`Failed to delete user with ID ${id}`)
  }

  return true
}

