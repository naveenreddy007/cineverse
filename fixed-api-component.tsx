"use client"

import { useEffect, useState } from "react"

interface User {
  id: number
  name: string
  email: string
}

export default function FixedApiComponent() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Solution: Remove the problematic dependency and use an empty dependency array
  // since we only want to fetch users once when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      try {
        // Simulating API call
        const response = await fetch("https://jsonplaceholder.typicode.com/users")
        if (!response.ok) {
          throw new Error("Failed to fetch users")
        }
        const data = await response.json()
        setUsers(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        setUsers([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()

    // Empty dependency array means this effect runs once on mount
  }, [])

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Users</h2>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!isLoading && !error && users.length === 0 && <p>No users found</p>}

      {!isLoading && !error && users.length > 0 && (
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.id} className="p-2 border rounded">
              <strong>{user.name}</strong> - {user.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

