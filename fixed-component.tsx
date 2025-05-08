"use client"

import { useEffect, useState } from "react"

export default function FixedComponent() {
  const [count, setCount] = useState(0)
  const [doubledCount, setDoubledCount] = useState(0)

  // Solution 1: Add dependency array with count
  // Now the effect only runs when count changes
  useEffect(() => {
    setDoubledCount(count * 2)
  }, [count]) // Added dependency array with count

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Counter: {count}</h2>
      <p className="mb-4">Doubled: {doubledCount}</p>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => setCount(count + 1)}
      >
        Increment
      </button>
    </div>
  )
}

