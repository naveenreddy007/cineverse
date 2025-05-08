"use client"

import { useEffect, useState, useMemo } from "react"

interface Product {
  id: number
  name: string
  price: number
}

export default function FixedComplexComponent() {
  const [products, setProducts] = useState<Product[]>([])
  const [filter, setFilter] = useState("")

  // Fetch products (simulated)
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setProducts([
        { id: 1, name: "Laptop", price: 999 },
        { id: 2, name: "Phone", price: 699 },
        { id: 3, name: "Tablet", price: 499 },
        { id: 4, name: "Headphones", price: 199 },
      ])
    }, 1000)
  }, [])

  // Solution: Use useMemo instead of useCallback + useEffect
  // This computes filteredProducts only when products or filter changes
  const filteredProducts = useMemo(() => {
    return products.filter((product) => product.name.toLowerCase().includes(filter.toLowerCase()))
  }, [products, filter])

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Products</h2>
      <input
        type="text"
        placeholder="Filter products..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      {filteredProducts.length === 0 ? (
        <p>No products found</p>
      ) : (
        <ul className="space-y-2">
          {filteredProducts.map((product) => (
            <li key={product.id} className="p-2 border rounded">
              {product.name} - ${product.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

