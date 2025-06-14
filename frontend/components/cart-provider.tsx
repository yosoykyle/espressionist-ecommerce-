"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { productService } from "@/lib/api-service"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  stock: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = async () => {
      // Only run on client side
      if (typeof window === "undefined") {
        setIsInitialized(true)
        return
      }

      try {
        const savedCart = localStorage.getItem("espressionist-cart")
        if (savedCart) {
          const cartItems = JSON.parse(savedCart) as CartItem[]

          // Validate cart items against current product data
          const validatedItems: CartItem[] = []

          for (const item of cartItems) {
            try {
              const product = await productService.getProductById(item.id)
              if (product && !product.archived) {
                // Update item with current product data
                validatedItems.push({
                  ...item,
                  name: product.name,
                  price: product.price,
                  image: typeof product.image === "string" ? product.image : "",
                  stock: product.stock,
                  // Ensure quantity doesn't exceed current stock
                  quantity: Math.min(item.quantity, product.stock),
                })
              }
            } catch (error) {
              console.error("Error validating cart item:", error)
              // Skip this item if validation fails
            }
          }

          setItems(validatedItems)
        }
      } catch (error) {
        console.error("Error loading cart:", error)
        // Set empty cart on error
        setItems([])
      } finally {
        setIsInitialized(true)
      }
    }

    loadCart()
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      try {
        localStorage.setItem("espressionist-cart", JSON.stringify(items))
      } catch (error) {
        console.error("Error saving cart:", error)
      }
    }
  }, [items, isInitialized])

  const addItem = async (newItem: Omit<CartItem, "quantity">) => {
    try {
      // Verify product still exists and is available
      const product = await productService.getProductById(newItem.id)
      if (!product || product.archived) {
        return
      }

      setItems((currentItems) => {
        const existingItem = currentItems.find((item) => item.id === newItem.id)

        if (existingItem) {
          // Check if we can add more
          if (existingItem.quantity >= product.stock) {
            return currentItems // Don't add if at stock limit
          }
          return currentItems.map((item) =>
            item.id === newItem.id ? { ...item, quantity: item.quantity + 1, stock: product.stock } : item,
          )
        }

        return [...currentItems, { ...newItem, quantity: 1, stock: product.stock }]
      })
    } catch (error) {
      console.error("Error adding item to cart:", error)
      // Fallback: add item without validation
      setItems((currentItems) => {
        const existingItem = currentItems.find((item) => item.id === newItem.id)
        if (existingItem) {
          return currentItems.map((item) => (item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item))
        }
        return [...currentItems, { ...newItem, quantity: 1 }]
      })
    }
  }

  const removeItem = (id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id))
  }

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }

    try {
      // Verify product still exists and check stock
      const product = await productService.getProductById(id)
      if (!product || product.archived) {
        removeItem(id)
        return
      }

      const maxQuantity = Math.min(quantity, product.stock)

      setItems((currentItems) =>
        currentItems.map((item) => (item.id === id ? { ...item, quantity: maxQuantity, stock: product.stock } : item)),
      )
    } catch (error) {
      console.error("Error updating cart item quantity:", error)
      // Fallback: update quantity without validation
      setItems((currentItems) => currentItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }
  }

  const clearCart = () => {
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
