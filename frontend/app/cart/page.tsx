"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCart } from "@/components/cart-provider"
import { productStore } from "@/lib/data-store"
import { useEffect, useState } from "react"

export default function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCart()
  const [stockWarnings, setStockWarnings] = useState<string[]>([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch all products from backend on mount
    async function fetchProducts() {
      setLoading(true)
      try {
        const allProducts = await productStore.getAll()
        setProducts(allProducts)
      } catch (e) {
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
      const product = products.find((p) => p.id === item.id)
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
    const product = products.find((p) => p.id === itemId)
    return product ? product.stock : 0
  }

  const isItemAvailable = (itemId: string) => {
    const product = products.find((p) => p.id === itemId)
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
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

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || !isAvailable}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>

                      <span className="w-12 text-center font-semibold">{item.quantity}</span>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= maxQuantity || !isAvailable}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-right">
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
                <p className="text-sm text-red-600 text-center">Please resolve stock issues before checkout</p>
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
