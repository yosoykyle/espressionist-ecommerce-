"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCart } from "@/components/cart-provider"
import type { Product } from "@/lib/data-store"
import { useEffect, useState } from "react"

export default function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCart()
  const [stockWarnings, setStockWarnings] = useState<string[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch all products from backend on mount using fetch
    async function fetchProducts() {
      setLoading(true)
      try {
        const res = await fetch("/api/products", {
          method: "GET",
          headers: {
            "accept": "application/json"
          }
        })
        console.log('Fetch response:', res)
        if (!res.ok) throw new Error("Failed to fetch products")
        const data = await res.json()
        console.log('Fetched data:', data)
        // Handle both array and object with products property
        if (Array.isArray(data)) {
          setProducts(data)
        } else if (data.products && Array.isArray(data.products)) {
          setProducts(data.products)
        } else {
          setProducts([])
        }
      } catch (e) {
        console.error('Error fetching products:', e)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    // Check for stock issues
    if (loading) return
    const warnings: string[] = []
    items.forEach((item) => {
      // Compare IDs as numbers to avoid type mismatch
      const product = products.find((p) => Number(p.id) === Number(item.id))
      if (!product) {
        warnings.push(`${item.name} is no longer available`)
      } else if (product.archived) {
        warnings.push(`${item.name} has been discontinued`)
      } else if (product.stock < item.quantity) {
        warnings.push(`Only ${product.stock} units of ${item.name} are available`)
      } else if (product.stock === 0) {
        warnings.push(`${item.name} is out of stock`)
      }
    })
    setStockWarnings(warnings)
  }, [items, products, loading])

  const getMaxQuantity = (itemId: string) => {
    const product = products.find((p) => Number(p.id) === Number(itemId))
    return product ? product.stock : 0
  }

  const isItemAvailable = (itemId: string) => {
    const product = products.find((p) => Number(p.id) === Number(itemId))
    return product && !product.archived && product.stock > 0
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-md mx-auto">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Button asChild className="bg-brand-primary hover:bg-brand-primary/90">
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <span>Loading cart...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-md md:max-w-2xl lg:max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      {/* Stock Warnings */}
      {stockWarnings.length > 0 && (
        <Alert className="mb-6 border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <div className="space-y-1">
              {stockWarnings.map((warning, index) => (
                <p key={index}>{warning}</p>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const maxQuantity = getMaxQuantity(item.id)
            const isAvailable = isItemAvailable(item.id)

            return (
              <Card key={item.id} className={!isAvailable ? "opacity-60" : ""}>
                <CardContent className="p-3 sm:p-6">
                  {/* Mobile Layout */}
                  <div className="block sm:hidden">
                    <div className="flex gap-3 mb-3">
                      <Image
                        src={item.image ? `/uploads/products/${item.image}` : "/placeholder.svg"}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover w-20 h-20 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">{item.name}</h3>
                        <p className="text-brand-primary font-semibold">₱{item.price}</p>
                        <p className="text-sm text-gray-500">Available: {maxQuantity}</p>
                        {!isAvailable && (
                          <p className="text-sm text-red-600 font-medium">
                            {maxQuantity === 0 ? "Out of stock" : "Unavailable"}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 w-8 h-8 flex-shrink-0 opacity-100"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || !isAvailable}
                          aria-label="Decrease quantity"
                          className="w-8 h-8"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= maxQuantity || !isAvailable}
                          aria-label="Increase quantity"
                          className="w-8 h-8"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-brand-primary">₱{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex items-center gap-4">
                    <Image
                      src={item.image ? `/uploads/products/${item.image}` : "/placeholder.svg"}
                      alt={item.name}
                      width={96}
                      height={96}
                      className="rounded-lg object-cover w-24 h-24"
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{item.name}</h3>
                      <p className="text-brand-primary font-semibold">₱{item.price}</p>
                      <p className="text-sm text-gray-500">Available: {maxQuantity}</p>
                      {!isAvailable && (
                        <p className="text-sm text-red-600 font-medium">
                          {maxQuantity === 0 ? "Out of stock" : "Unavailable"}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || !isAvailable}
                        aria-label="Decrease quantity"
                        className="w-8 h-8"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= maxQuantity || !isAvailable}
                        aria-label="Increase quantity"
                        className="w-8 h-8"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 w-8 h-8 opacity-100"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <div className="text-right min-w-[80px]">
                      <p className="text-lg font-semibold">₱{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₱{total.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>VAT (12%)</span>
                <span>Calculated at checkout</span>
              </div>

              <hr />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-brand-primary">₱{total.toFixed(2)}</span>
              </div>

              <Button
                asChild
                className="w-full bg-brand-primary hover:bg-brand-primary/90"
                size="lg"
                disabled={stockWarnings.length > 0}
              >
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>

              {stockWarnings.length > 0 && (
                <p className="text-sm text-red-600 text-center">
                  Out-of-stock items will be removed from your order at checkout.
                </p>
              )}

              <Button asChild variant="outline" className="w-full">
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
