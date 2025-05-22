"use client"

import { useEffect, useState } from "react"

export default function FixedComponent2() {
  const [user, setUser] = useState({ name: "John", age: 30 })
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  // Solution 2: Separate the concerns
  // 1. Update the document title when user changes
  useEffect(() => {
    document.title = `${user.name} is ${user.age} years old`

    // 2. Update lastUpdated timestamp when user changes
    // But store it in a separate state variable
    setLastUpdated(new Date().toISOString())
  }, [user.name, user.age]) // Only depend on the specific properties we care about

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">User Profile</h2>
      <p>Name: {user.name}</p>
      <p>Age: {user.age}</p>
      <p>Last Updated: {lastUpdated || "Never"}</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => setUser({ ...user, age: user.age + 1 })}
      >
        Increment Age
      </button>
    </div>
  )
}
