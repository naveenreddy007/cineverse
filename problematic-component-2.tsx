"use client"

import { useEffect, useState } from "react"

export default function ProblematicComponent2() {
  const [user, setUser] = useState({ name: "John", age: 30 })

  // Problem 2: Creating a new object in dependencies causes infinite loop
  // because {} === {} is always false in JavaScript
  useEffect(() => {
    document.title = `${user.name} is ${user.age} years old`

    // This creates a new object on every render
    setUser({ ...user, lastUpdated: new Date().toISOString() })
  }, [user]) // user changes every render because we're updating it in the effect

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">User Profile</h2>
      <p>Name: {user.name}</p>
      <p>Age: {user.age}</p>
      <p>Last Updated: {user.lastUpdated || "Never"}</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => setUser({ ...user, age: user.age + 1 })}
      >
        Increment Age
      </button>
    </div>
  )
}
